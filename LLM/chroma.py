from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader

# Define the embeddings function using HuggingFace model
def get_embedding_functions():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-mpnet-base-v2",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': False}
    )
    return embeddings

# Function to add documents to ChromaDB
def add_to_chroma(chunks, chroma_path):
    db = Chroma(
        persist_directory=chroma_path,
        embedding_function=get_embedding_functions()
    )
    last_page = 0
    current_chunk_index = 0
    chunk_ids = []
    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        current_page_id = f"{source}:{page}"
        
        if page != last_page:
            current_chunk_index = 0
        else:
            current_chunk_index += 1
        
        current_page_id = f"{current_page_id}:{current_chunk_index}"
        chunk.metadata["id"] = current_page_id
        chunk_ids.append(current_page_id)
        last_page = page
        print(current_page_id)
    
    db.add_documents(chunks, ids=chunk_ids)

# Function to retrieve the Chroma database instance
def get_chroma(chroma_path):
    db = Chroma(
        persist_directory=chroma_path,
        embedding_function=get_embedding_functions()
    )
    return db

# Function to split documents into chunks
def split_documents(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False
    )
    return text_splitter.split_documents(documents)

# Function to load documents from PDF directory
def load_documents(file_path):
    document_loader = PyPDFLoader(file_path)
    return document_loader.load()
    
# Uncomment the following lines to create and populate the Chroma database from PDFs
def create_chromadb_from_pdf(file_path, chroma_path):
    documents = load_documents(file_path)
    chunks = split_documents(documents)
    add_to_chroma(chunks, chroma_path)