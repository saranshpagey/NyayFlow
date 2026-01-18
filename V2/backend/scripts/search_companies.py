import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def search_companies():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🔍 Searching for any metadata containing 'Companies'...")
    
    try:
        # Fetch ALL documents and filter locally for robustness against query syntax errors
        res = supabase.table("documents").select("id, metadata").execute()
        docs = res.data
        
        matches = []
        for doc in docs:
            meta_str = str(doc.get('metadata', {})).lower()
            if "companies" in meta_str:
                matches.append(doc)
                
        print(f"📄 Found {len(matches)} document entries related to 'Companies'")
        for doc in matches[:10]: # Limit output
            print(f"   - ID: {doc['id']} | Metadata: {doc['metadata']}")
            
        # Count total documents to see if we are hitting a limit
        count_res = supabase.table("documents").select("id", count="exact").limit(1).execute()
        print(f"📊 Total Document Chunks in DB: {count_res.count}")

    except Exception as e:
        print(f"❌ Error during search: {e}")

if __name__ == "__main__":
    asyncio.run(search_companies())
