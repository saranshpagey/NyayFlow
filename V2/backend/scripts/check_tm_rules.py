import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def check_trademark_rules():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🔍 Checking for Trademark Rules...")
    
    try:
        # Check for Trademark Rules
        res = supabase.table("documents").select("id, metadata").ilike("metadata->>title", "%Trademark Rules%").execute()
        
        print(f"📄 Found {len(res.data)} documents matching 'Trademark Rules'")
        for doc in res.data[:5]:
            print(f"   - {doc['metadata'].get('title')} ({doc['metadata'].get('date')})")
            
        # Check for Trade Marks Act just to be sure
        res_act = supabase.table("documents").select("id", count="exact").ilike("metadata->>title", "%Trade Marks Act%").execute()
        print(f"📄 Trade Marks Act count: {res_act.count}")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_trademark_rules())
