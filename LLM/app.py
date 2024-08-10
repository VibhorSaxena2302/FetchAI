from flask import Flask, json, jsonify, request, Response
from flask_cors import CORS
import llm_model
from google.cloud import storage
import os
import shutil
import chroma
import tempfile
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from uagents import Model
from uagents.query import query

uPROMPT_AGENT_ADDRESS = 'agent1q2vnqcvyevps2c0q6ge9cpxyrvqe7zhkgmuex2fkfjmmf2f64ynljlf4ydh'

class PromptModeler(Model):
    query: str
    context_text: str
    history: str
    role: str

app = Flask(__name__)

CORS(app)
llm = llm_model.llm()

# Dictionary to keep track of loaded databases
loaded_dbs = {}
last_access_times = {}

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
        
def download_chromadb_from_gcs(url, temp_dir):
    # Assuming the URL format is "https://storage.googleapis.com/[BUCKET_NAME]/[FILE_PATH]"
    if not url.startswith('https://storage.googleapis.com/'):
        raise ValueError("Invalid URL provided")

    # Parse the bucket name and blob path from the URL
    parts = url.split('/', 4)  # Splits into ['https:', '', 'storage.googleapis.com', '[BUCKET_NAME]', '[FILE_PATH]']
    bucket_name = parts[3]
    blob_path = parts[4]

    # Initialize the GCS client and get the bucket
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    # Get the blobs in the specified directory
    blobs = bucket.list_blobs(prefix=blob_path)
    for blob in blobs:
        # Create the local path preserving the structure
        local_path = os.path.join(temp_dir, blob.name)
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        # Download the blob to the local path
        blob.download_to_filename(local_path)
        print(f"Downloaded {blob.name} to {local_path}")

def cleanup_old_directories():
    """Cleanup old directories that have not been accessed for more than an hour."""
    current_time = datetime.now()
    expired_dirs = [url for url, last_accessed in last_access_times.items() if current_time - last_accessed > timedelta(hours=1)]
    for url in expired_dirs:
        shutil.rmtree(loaded_dbs[url])
        del loaded_dbs[url]
        del last_access_times[url]
        print(f"Removed temporary directory for URL {url}")

scheduler = BackgroundScheduler()
scheduler.add_job(func=cleanup_old_directories, trigger="interval", minutes=10)

def cleanup_directories():
    for directory in loaded_dbs.values():
        if os.path.exists(directory):
            shutil.rmtree(directory)
            print(f"Cleaned up directory: {directory}")

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

@app.route('/api/llm', methods=['POST'])
async def chat():
    data = request.get_json()
    queryy = data.get('query', '')
    role = data.get('role', '')
    url = data.get('url', '')
    history = data.get('chathistory', '')

    chathistory = ''

    for message in history:
        chathistory += f"\nSender: {message['sender']}"
        chathistory += f"Message: {message['text']}\n"

    context_text = ''

    if url:
        url += '/ChromaDB'
        if url not in loaded_dbs.keys():
            temp_dir = tempfile.mkdtemp()
            temp_chromadb_path = os.path.join(temp_dir, 'ChromaDB')
            loaded_dbs[url] = temp_dir
            download_chromadb_from_gcs(url, temp_chromadb_path)
            print(f"Created temporary directory for URL {url}")
        temp_dir = loaded_dbs[url]
        temp_chromadb_path = temp_dir+'/ChromaDB'
        last_access_times[url] = datetime.now() 
        db = chroma.get_chroma(temp_chromadb_path)
        results = db.similarity_search_with_score(queryy, k=2)
        context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results]).replace('\n', ' ')

    prompt = f'Answer the following query. Do not exceed 150 words:\n\n Query: {queryy}'

    req = PromptModeler(query=queryy, context_text=context_text, history=chathistory, role=role)
    response = await query(destination=uPROMPT_AGENT_ADDRESS, message=req, timeout=15.0)
    res = json.loads(response.decode_payload())
    print(res)

    if context_text != '':
        prompt += f'### CONTEXT ### \n\n {context_text}\n\n'

    if len(history) > 0:
        prompt += f'### CHAT HISTORY ### \n\n {chathistory}\n\n'

    if role:
        prompt = f'You are given the following role, answer the query following your role in less than 150 words. If no role is specified, act like a normal AI bot.\n: {role} \n\n Query: {query}'

    return Response(llm.generate(prompt), content_type='text/plain')

if __name__ == '__main__':
    atexit.register(cleanup_directories)
    scheduler.start()
    app.run(use_reloader=False, debug=True)