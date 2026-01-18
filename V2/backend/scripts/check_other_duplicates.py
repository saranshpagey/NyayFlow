import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def check_others():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    acts = ["Trade Marks Act", "Limited Liability Partnership"]
    
    for act in acts:
        print(f"🔍 Checking for duplicates of '{act}' with chunk_index 0...")
        try:
            res = supabase.table("documents").select("id, metadata").ilike("metadata->>title", f"%{act}%").eq("metadata->>chunk_index", "0").execute()
            matches = res.data
            print(f"📄 Found {len(matches)} entries.")
            for doc in matches:
                print(f"   - ID: {doc['id']} | Metadata: {doc['metadata']}")
        except Exception as e:
            print(f"❌ Error checking {act}: {e}")

if __name__ == "__main__":
    asyncio.run(check_others())
