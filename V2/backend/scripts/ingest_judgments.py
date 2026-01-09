import os
import glob
from supabase.client import create_client
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from dotenv import load_dotenv

load_dotenv()

# CONFIG
DATA_DIR = "./data/judgments"
CHUNK_SIZE = 2000 # Judgments are large, using larger chunks for better context retention
CHUNK_OVERLAP = 200

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

def ingest_judgments():
    print(f"⚖️ Specifically indexing landmark judgments from {DATA_DIR}...")
    files = glob.glob(os.path.join(DATA_DIR, "*.md"))
    
    if not files:
        print("⚠️ No judgments found in ./data/judgments")
        return

    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=GOOGLE_API_KEY)
    
    total_chunks = 0
    for file_path in files:
        print(f"📄 Processing {os.path.basename(file_path)}...")
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
        
        # Split into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
        chunks = text_splitter.split_text(text)
        
        # Batch upload
        batch_size = 30
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i:i+batch_size]
            SupabaseVectorStore.from_texts(
                texts=batch,
                embedding=embeddings,
                client=supabase_client,
                table_name="documents",
                query_name="match_documents"
            )
            print(f"   -> Uploaded batch {i}-{i+len(batch)}")
        
        total_chunks += len(chunks)
        print(f"   ✅ Finished {os.path.basename(file_path)} with {len(chunks)} chunks.")

    print(f"\n✨ Successfully indexed {len(files)} judgments ({total_chunks} chunks).")

if __name__ == "__main__":
    ingest_judgments()
