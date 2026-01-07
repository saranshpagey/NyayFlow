import os
import glob
import sys
from supabase.client import create_client
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from dotenv import load_dotenv

load_dotenv()

def ingest_folder(folder_path):
    print(f"🔍 Indexing files from {folder_path}...")
    files = glob.glob(os.path.join(folder_path, "**/*.md"), recursive=True)
    
    if not files:
        print(f"⚠️ No files found in {folder_path}")
        return

    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
    GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
    supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=GOOGLE_API_KEY)
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    
    total_chunks = 0
    for file_path in files:
        print(f"📄 Processing {os.path.basename(file_path)}...")
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
        
        chunks = text_splitter.split_text(text)
        
        SupabaseVectorStore.from_texts(
            texts=chunks,
            embedding=embeddings,
            client=supabase_client,
            table_name="documents",
            query_name="match_documents"
        )
        total_chunks += len(chunks)
        print(f"   ✅ Uploaded {len(chunks)} chunks.")

    print(f"✨ Successfully indexed {len(files)} files ({total_chunks} chunks).")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        ingest_folder(sys.argv[1])
    else:
        print("Usage: python ingest_folder.py <folder_path>")
