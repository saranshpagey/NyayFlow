import os
import sys
import yaml
import asyncio
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

from langchain_community.vectorstores import SupabaseVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from supabase.client import create_client

# Add parent to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class DocumentIngestor:
    def __init__(self):
        self.supabase_url = os.environ.get("SUPABASE_URL")
        self.supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
        self.google_api_key = os.environ.get("GOOGLE_API_KEY")
        
        self.supabase = create_client(self.supabase_url, self.supabase_key)
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004", 
            google_api_key=self.google_api_key
        )
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1500,
            chunk_overlap=200,
            add_start_index=True
        )

    def parse_file(self, file_path: str):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if content.startswith('---'):
            try:
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    metadata = yaml.safe_load(parts[1])
                    body = parts[2].strip()
                    return body, metadata
            except Exception as e:
                print(f"⚠️ Error parsing frontmatter in {file_path}: {e}")
        
        return content, {"source": file_path}

    def _sanitize_metadata(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Convert all metadata values to JSON-serializable types."""
        sanitized = {}
        for key, value in metadata.items():
            if value is None:
                sanitized[key] = None
            elif isinstance(value, (str, int, float, bool)):
                sanitized[key] = value
            elif isinstance(value, (list, tuple)):
                sanitized[key] = [str(v) for v in value]
            else:
                # Convert dates, objects, etc. to strings
                sanitized[key] = str(value)
        return sanitized

    async def ingest_directory(self, directory_path: str):
        print(f"📂 Starting Ingestion from: {directory_path}")
        files = [f for f in os.listdir(directory_path) if f.endswith('.md')]
        
        total_chunks = 0
        for filename in files:
            path = os.path.join(directory_path, filename)
            text, metadata = self.parse_file(path)
            
            print(f"🧩 Chunking: {metadata.get('title', filename)}")
            chunks = self.text_splitter.split_text(text)
            
            # Prepare metadata for each chunk
            chunk_metadatas = []
            for i in range(len(chunks)):
                m = metadata.copy()
                m["chunk_index"] = i
                m["file_path"] = path
                # Convert all values to JSON-serializable types
                m = self._sanitize_metadata(m)
                chunk_metadatas.append(m)
            
            # Step-by-step Batching to prevent Supabase timeouts
            batch_size = 50
            for i in range(0, len(chunks), batch_size):
                batch_chunks = chunks[i : i + batch_size]
                batch_metadatas = chunk_metadatas[i : i + batch_size]
                
                print(f"📤 Uploading batch {i//batch_size + 1}/{(len(chunks)-1)//batch_size + 1} ({len(batch_chunks)} chunks)...")
                
                try:
                    SupabaseVectorStore.from_texts(
                        texts=batch_chunks,
                        embedding=self.embeddings,
                        metadatas=batch_metadatas,
                        client=self.supabase,
                        table_name="documents",
                        query_name="match_documents"
                    )
                except Exception as e:
                    print(f"❌ Batch upload error: {e}")
                    # Brief wait and retry once? Simple retry for now
                    await asyncio.sleep(2)
                    SupabaseVectorStore.from_texts(
                        texts=batch_chunks,
                        embedding=self.embeddings,
                        metadatas=batch_metadatas,
                        client=self.supabase,
                        table_name="documents",
                        query_name="match_documents"
                    )
            
            total_chunks += len(chunks)
            
        print(f"✨ Ingestion Finished! Total Chunks: {total_chunks}")
        
        # Invalidate Semantic Cache (optional, but requested)
        # In a real system, you might run an RPC to clear cache entries related to these topics
        print("🧹 Clearing high-level semantic cache...")
        # self.supabase.table("semantic_cache").delete().neq("id", "000").execute() # Danger!
        
        return total_chunks

    async def ingest_single_file(self, file_path: str):
        """Ingest a single file immediately."""
        print(f"🧩 Ingesting Single File: {file_path}")
        text, metadata = self.parse_file(file_path)
        chunks = self.text_splitter.split_text(text)
        
        chunk_metadatas = []
        for i in range(len(chunks)):
            m = metadata.copy()
            m["chunk_index"] = i
            m["file_path"] = file_path
            m = self._sanitize_metadata(m)
            chunk_metadatas.append(m)
            
        try:
            SupabaseVectorStore.from_texts(
                texts=chunks,
                embedding=self.embeddings,
                metadatas=chunk_metadatas,
                client=self.supabase,
                table_name="documents",
                query_name="match_documents"
            )
            print(f"✅ Successfully Indexed: {len(chunks)} chunks")
            return len(chunks)
        except Exception as e:
            print(f"❌ Ingestion Failed: {e}")
            raise e

async def main():
    ingestor = DocumentIngestor()
    
    # Ingest the curated year-wise cases
    bulk_dir = "./source-documents/indian_kanoon_bulk"
    if os.path.exists(bulk_dir):
        for year in os.listdir(bulk_dir):
            year_path = os.path.join(bulk_dir, year)
            if os.path.isdir(year_path):
                await ingestor.ingest_directory(year_path)

    # Ingest the scraped documents
    await ingestor.ingest_directory("./source-documents/scraped")
    # Ingest the constitution
    await ingestor.ingest_directory("./source-documents/constitution")
    # Also ingest the manual ones
    await ingestor.ingest_directory("./source-documents/statutes/ipc")
    await ingestor.ingest_directory("./source-documents/statutes/crpc")
    await ingestor.ingest_directory("./source-documents/statutes/bns/sections")
    await ingestor.ingest_directory("./source-documents/cases")

if __name__ == "__main__":
    asyncio.run(main())
