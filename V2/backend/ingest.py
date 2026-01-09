import os
import glob
from supabase.client import create_client
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from dotenv import load_dotenv

# Load API keys
load_dotenv()

# CONFIG
DATA_DIR = "./source-documents"
CHUNK_SIZE = 1500  # Increased for legal context preservation
CHUNK_OVERLAP = 200

# Initialize Clients
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, GOOGLE_API_KEY]):
    print("❌ Missing environment variables in .env file!")
    exit(1)

supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

def parse_frontmatter(content):
    """
    Simple parser for YAML-style frontmatter.
    Returns (metadata_dict, content_body)
    """
    metadata = {}
    body = content
    
    if content.strip().startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            frontmatter = parts[1]
            body = parts[2].strip()
            
            # Parse line by line
            for line in frontmatter.splitlines():
                if ":" in line:
                    key, value = line.split(":", 1)
                    metadata[key.strip()] = value.strip()
    
    return metadata, body

def ingest_docs():
    print(f"🔍 Scanning {DATA_DIR} for legal documents...")
    files = []
    files.extend(glob.glob(os.path.join(DATA_DIR, "**/*.md"), recursive=True))
    files.extend(glob.glob(os.path.join(DATA_DIR, "**/*.txt"), recursive=True))
    
    if not files:
        print(f"⚠️ No documents found in {DATA_DIR}")
        return

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )

    # Use the verified embedding model
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=GOOGLE_API_KEY)
    
    total_docs = 0
    total_chunks = 0
    
    print(f"📚 Found {len(files)} documents to ingest.")

    for file_path in files:
        file_name = os.path.basename(file_path)
        print(f"Processing {file_name}...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            raw_content = f.read()
        
        # Parse metadata
        metadata, body = parse_frontmatter(raw_content)
        
        # Add file-level metadata
        metadata['source'] = file_name
        metadata['file_path'] = file_path
        metadata['ingested_at'] = "2026-01-08" # Hardcoded for now or use datetime

        # Create chunks
        chunks = text_splitter.split_text(body)
        
        # Prepare metadata for each chunk (replicated)
        metadatas = [metadata for _ in chunks]
        
        print(f"   -> Generated {len(chunks)} chunks. Metadata: {list(metadata.keys())}")
        
        # Upload to Supabase
        try:
            SupabaseVectorStore.from_texts(
                texts=chunks,
                metadatas=metadatas,
                embedding=embeddings,
                client=supabase_client,
                table_name="documents",
                query_name="match_documents"
            )
            total_chunks += len(chunks)
            total_docs += 1
            print(f"   ✅ Uploaded {len(chunks)} chunks for {file_name}")
        except Exception as e:
            print(f"   ❌ Failed to upload {file_name}: {e}")
        
    print(f"\n✨ Ingestion Complete!")
    print(f"📊 Total Documents: {total_docs}")
    print(f"🧩 Total Chunks: {total_chunks}")
    
    # Verify by doing a quick count if possible (optional, skip for now)

if __name__ == "__main__":
    ingest_docs()
