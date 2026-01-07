import os
import glob
from supabase.client import create_client
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from dotenv import load_dotenv

load_dotenv()

# CONFIG
DATA_DIR = "./data/templates"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 100

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

def ingest_templates():
    print(f"🔍 Specifically indexing templates from {DATA_DIR}...")
    files = glob.glob(os.path.join(DATA_DIR, "*.md"))
    
    if not files:
        print("⚠️ No templates found in ./data/templates")
        return

    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=GOOGLE_API_KEY)
    
    total_chunks = 0
    for file_path in files:
        print(f"📄 Processing {os.path.basename(file_path)}...")
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
        
        # Templates are small, usually 1-2 chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
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

    print(f"✨ Successfully indexed {len(files)} templates ({total_chunks} chunks).")

if __name__ == "__main__":
    ingest_templates()
