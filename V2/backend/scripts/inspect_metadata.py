import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def inspect_metadata():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🔍 Inspecting sample metadata from 'documents' table...")
    
    try:
        res = supabase.table("documents").select("metadata").limit(20).execute()
        for doc in res.data:
            print(f"📄 Meta: {doc['metadata']}")
            
    except Exception as e:
        print(f"❌ Error during inspection: {e}")

if __name__ == "__main__":
    asyncio.run(inspect_metadata())
