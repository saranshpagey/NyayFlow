import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def search_full_db():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🔍 Server-side search for 'Companies' in metadata...")
    
    try:
        # Correct syntax for searching JSONB in Supabase-py
        # Use metadata->>title for string comparison
        res = supabase.table("documents").select("id, metadata").ilike("metadata->>title", "%Companies%").execute()
        
        matches = res.data
        print(f"📄 Found {len(matches)} document entries matching 'Companies' in title")
        for doc in matches[:10]:
            print(f"   - ID: {doc['id']} | Metadata: {doc['metadata']}")

        # Also search for 'Companies Act'
        res_act = supabase.table("documents").select("id").ilike("metadata->>title", "%Companies Act%").execute()
        print(f"📄 Total matching 'Companies Act': {len(res_act.data)}")

    except Exception as e:
        print(f"❌ Error during search: {e}")

if __name__ == "__main__":
    asyncio.run(search_full_db())
