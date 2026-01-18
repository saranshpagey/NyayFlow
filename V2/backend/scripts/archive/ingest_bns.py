
import asyncio
from ingest_documents import DocumentIngestor
import os

async def main():
    ingestor = DocumentIngestor()
    bns_dir = "./source-documents/statutes/bns/sections"
    if os.path.exists(bns_dir):
        print(f"🚀 Ingesting BNS sections from {bns_dir}...")
        await ingestor.ingest_directory(bns_dir)
    else:
        print(f"❌ directory not found: {bns_dir}")

if __name__ == "__main__":
    asyncio.run(main())
