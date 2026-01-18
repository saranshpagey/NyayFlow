import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def cleanup_redundancy():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    # Redundant Doc ID identified: f32526ff-e4c0-4310-b20e-d30c598b1dc5
    # (Matches current ingestion attempt with wrong date 1956)
    redundant_id = "f32526ff-e4c0-4310-b20e-d30c598b1dc5"
    
    print(f"🧹 Deleting redundant document and its chunks: {redundant_id}")
    
    try:
        # Delete chunks first (foreign key dependency usually)
        chunk_del = supabase.table("documents").delete().eq("id", redundant_id).execute()
        print(f"✅ Document {redundant_id} deleted successfully.")
        
        # Note: In SupabaseVectorStore/LangChain, it might be in 'documents' table only 
        # but chunks might be in a separate table if it's a custom setup.
        # My verify script earlier saw entries in 'documents'.
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")

if __name__ == "__main__":
    asyncio.run(cleanup_redundancy())
