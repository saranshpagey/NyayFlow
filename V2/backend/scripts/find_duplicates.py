import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def find_duplicates():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🔍 Looking for Companies Act entries WITHOUT 'startup_compliance' tag...")
    
    try:
        # Search for Companies Act in title but EXCLUDING my recently added topic
        res = supabase.table("documents").select("id, metadata").ilike("metadata->>title", "%Companies Act%").not_.eq("metadata->>topic", "startup_compliance").execute()
        
        matches = res.data
        print(f"📄 Found {len(matches)} document entries for 'Companies Act' WITHOUT the startup_compliance tag.")
        for doc in matches[:10]:
            print(f"   - ID: {doc['id']} | Metadata: {doc['metadata']}")

    except Exception as e:
        print(f"❌ Error during duplicate search: {e}")

if __name__ == "__main__":
    asyncio.run(find_duplicates())
