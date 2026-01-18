import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def check_index_zero():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🔍 Checking for multiple 'chunk_index: 0' for 'The Companies Act 2013'...")
    
    try:
        # Search for Companies Act entries with chunk_index 0
        res = supabase.table("documents").select("id, metadata").ilike("metadata->>title", "%Companies Act 2013%").eq("metadata->>chunk_index", "0").execute()
        
        matches = res.data
        print(f"📄 Found {len(matches)} entries with chunk_index: 0 for Companies Act 2013.")
        for doc in matches:
            print(f"   - ID: {doc['id']} | Metadata: {doc['metadata']}")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_index_zero())
