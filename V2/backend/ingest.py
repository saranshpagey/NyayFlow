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
DATA_DIR = "./data"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# Initialize Clients
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, GOOGLE_API_KEY]):
    print("❌ Missing environment variables in .env file!")
    exit(1)

supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

def ingest_docs():
    print(f"🔍 Scanning {DATA_DIR} for legal documents...")
    files = []
    files.extend(glob.glob(os.path.join(DATA_DIR, "*.txt")))
    files.extend(glob.glob(os.path.join(DATA_DIR, "*.md")))
    files.extend(glob.glob(os.path.join(DATA_DIR, "*.csv")))
    
    if not files:
        print("⚠️ No text files found. Creating sample...")
        if not os.path.exists(DATA_DIR):
            os.makedirs(DATA_DIR)
        sample_path = os.path.join(DATA_DIR, "sample_case.txt")
        with open(sample_path, "w") as f:
            f.write("Section 138 of the Negotiable Instruments Act, 1881. Dishonour of cheque for insufficiency, etc., of funds in the account.")
        files = [sample_path]

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )

    # Use the verified embedding model
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=GOOGLE_API_KEY)
    
    # Process files
    total_chunks = 0
    import csv

    for file_path in files:
        if file_path.endswith(".csv"):
             print(f"📄 Processing CSV {os.path.basename(file_path)}...")
             csv_chunks = []
             # Use encoding='utf-8' with replacement to handle bad chars
             with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                 reader = csv.DictReader(f)
                 for row in reader:
                     # Heuristic for CrPC dataset or general legal CSVs
                     # Try to find meaningful columns
                     section = row.get("Section", "") or row.get("section", "")
                     title = row.get("Section_name", "") or row.get("title", "")
                     offense = row.get("Offense", "") or row.get("offense", "")
                     punishment = row.get("Punishment", "") or row.get("punishment", "")
                     desc = row.get("Description", "") or row.get("description", "") or row.get("text", "")
                     url = row.get("url", "")
                     
                     if desc or offense:
                         # Full text content (CrPC or IPC style)
                         content = f"Section: {section}\n"
                         if title: content += f"Title: {title}\n"
                         if offense: content += f"Offense: {offense}\n"
                         if punishment: content += f"Punishment: {punishment}\n"
                         content += f"Content: {desc}"
                         csv_chunks.append(content)
                     elif title and url:
                         # Metadata Index (Laws of India style)
                         # We treat this as a reference document
                         content = f"Legislative Act: {title}\nPublished: {row.get('published_date', 'N/A')}\nLink: {url}\nNote: Full text not available locally."
                         csv_chunks.append(content)
             
             print(f"   -> Found {len(csv_chunks)} rows in CSV.")
             chunks = csv_chunks # No need to split further if rows are reasonably sized sections
        
        else:
            # Standard Text/MD processing
            with open(file_path, 'r') as f:
                text = f.read()
            chunks = text_splitter.split_text(text)
            print(f"📄 Processing {os.path.basename(file_path)}: {len(chunks)} chunks")
        
        # Upload to Supabase (Batching to avoid timeouts)
        batch_size = 50
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
        
    print(f"✨ Successfully ingested {total_chunks} legal data chunks/sections.")

if __name__ == "__main__":
    ingest_docs()
