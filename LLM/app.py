from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import llm_model
from uagents import Model
from uagents.query import query
from google.cloud import storage
import os
import shutil
import chroma
import tempfile

app = Flask(__name__)

CORS(app)
llm = llm_model.llm()

uPDF_AGENT_ADDRESS = 'agent1qgs4vrgf72qnkffkn66a36rt2h6p2zcuaaqrstqzuj0a8x2el2m52jd7zrz'

class PDFQuery(Model):
    pdf_url: str
    query: str

def empty_directory(dir_path):
    """Empties all contents of the specified directory.

    Args:
    dir_path (str): Path to the directory to empty.
    """
    # Check if the directory exists
    if not os.path.exists(dir_path):
        print(f"Directory not found: {dir_path}")
        return

    # Iterate over each item in the directory
    for item in os.listdir(dir_path):
        item_path = os.path.join(dir_path, item)
        try:
            if os.path.isfile(item_path) or os.path.islink(item_path):
                os.remove(item_path)  # Remove files and links
                print(f"Removed file: {item_path}")
            elif os.path.isdir(item_path):
                shutil.rmtree(item_path)  # Remove directories
                print(f"Removed directory: {item_path}")
        except Exception as e:
            print(f"Failed to delete {item_path}. Reason: {e}")

def uploadfolder_to_gcs(source_folder, bucket_name, blob_name):
    """Uploads a folder and its subfolders to a GCS bucket.

    Args:
    bucket_name (str): Name of the GCS bucket.
    source_folder (str): Local path to the folder to upload.
    """
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    # Walk through the source directory
    for local_dir, _, files in os.walk(source_folder):
        for file in files:
            local_file_path = os.path.join(local_dir, file)
            relative_path = os.path.relpath(local_file_path, source_folder)
            blob_path = os.path.join(blob_name, relative_path)

            blob = bucket.blob(blob_path)
            blob.upload_from_filename(local_file_path)
            print(f"Uploaded {local_file_path} to {blob_path}")

    return bucket.blob(blob_name).public_url

def delete_folder(bucket_name, folder_name):
    """Deletes all objects within the folder in the specified bucket."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    # List all objects that start with the folder name (prefix)
    blobs = bucket.list_blobs(prefix=f"{folder_name}/")  # Ensure the folder path ends with '/'
    
    # Delete each object
    for blob in blobs:
        blob.delete()
        print(f"Blob {blob.name} deleted.")
        
@app.route('/api/uploadpdf', methods=['POST'])
async def uploadPdf():
    try:
        username = request.form['username']
        chatbot_id = request.form['chatbotid']
        file = request.files.get('file')
        print(username, chatbot_id, file)
        
        if file:
            # Save the file temporarily
            temp_dir = tempfile.mkdtemp()
            temp_pdf_path = os.path.join(temp_dir, file.filename)
            temp_chromadb_path = os.path.join(temp_dir, 'ChromaDB')
            filename = file.filename
            file.save(temp_pdf_path)
            
            # Process the file as needed
            print(f"File saved to {temp_pdf_path} for processing")

            # Set bucket name
            bucket_name = "updfstorage"
            # Create blob_name with username and chatbot_id directory structure
            blob_name = f"{username}/{chatbot_id}"

            try:
                chroma.create_chromadb_from_pdf(temp_pdf_path, temp_chromadb_path)

                folder_url = uploadfolder_to_gcs(temp_dir, bucket_name, blob_name)

                # Call the upload function
                print(f"File uploaded successfully: {folder_url}")

        
                empty_directory(temp_dir)
                os.rmdir(temp_dir)
                return jsonify({'file_url': folder_url, 'file_name': filename}), 200
            except:
                empty_directory(temp_dir)
                os.rmdir(temp_dir)
                return jsonify({'message': 'Error'}), 500
        
        return jsonify({'message': 'No file uploaded'}), 409
    except Exception as e:
        return jsonify({'error': e}), 500
    
@app.route('/api/deletepdf', methods=['POST'])
async def deletePdf():
    try:
        username = request.form['username']
        chatbot_id = request.form['chatbotid']
        print(username, chatbot_id)
        
        bucket_name = 'updfstorage'

        folder_name = f'{username}/{chatbot_id}'
        
        delete_folder(bucket_name, folder_name)
        print("Folder deleted successfully.")
            
        return jsonify({'message': 'File deleted.'}), 200
    except Exception as e:
        return jsonify({'error': e}), 409
    
@app.route('/api/updf', methods=['POST'])
async def uPdf():
    try:
        username = request.form['username']
        chatbot_id = request.form['chatbotid']
        file = request.files.get('file')
        print(username, chatbot_id, file)
        # req = PDFQuery(pdf_url=data['pdf_url'], query=data['query'])
        # response = await query(destination=uPDF_AGENT_ADDRESS, message=req, timeout=15.0)
        # res = json.loads(response.decode_payload())
        # print(res)
        return f"successful call - agent response:"
    except Exception as e:
        print(e)
        return f"unsuccessful agent call: {str(e)}" 

@app.route('/api//llm', methods=['POST'])
def chat():
    data = request.get_json()
    prompt = data.get('query', '')

    return Response(llm.generate(prompt), content_type='text/plain')

if __name__ == '__main__':
    app.run(use_reloader=False, port=5003)