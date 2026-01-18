
import asyncio
import os
import sys

# Add current directory to path so we can import ingest_documents
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ingest_documents import DocumentIngestor, SupabaseVectorStore

async def main():
    print("🚀 Starting Targeted Corporate Law Ingestion...")
    ingestor = DocumentIngestor()
    
    dirs = [
        "./source-documents/statutes/companies_act_2013",
        "./source-documents/statutes/trademarks_act_1999"
    ]
    
    total_chunks = 0
    for d in dirs:
        if os.path.exists(d):
            print(f"📂 Ingesting: {d}")
            total_chunks += await ingestor.ingest_directory(d)
        else:
            print(f"⚠️ Directory not found: {d}")
            
    print(f"✅ Targeted Ingestion Complete! Total Chunks: {total_chunks}")
    
    # Verify count
    res = ingestor.supabase.table('documents').select('*', count='exact', head=True).execute()
    print(f"📊 Current Vector Count: {res.count}")

if __name__ == "__main__":
    asyncio.run(main())
