import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def verify_kb():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🔍 Scanning Knowledge Base for Redundancy...")
    
    # Fetch document metadata
    try:
        res = supabase.table("documents").select("id, metadata").execute()
        docs = res.data
        
        companies_docs = []
        for doc in docs:
            meta = doc.get('metadata', {})
            title = meta.get('title', '')
            if "Companies Act 2013" in title:
                companies_docs.append(doc)
                
        print(f"📄 Found {len(companies_docs)} document entries for 'Companies Act 2013'")
        for doc in companies_docs:
            print(f"   - ID: {doc['id']} | Metadata: {doc['metadata']}")

        # Check for other recently ingested items
        others = ["Angel Tax", "DPDP Act"]
        for item in others:
            res_other = supabase.table("documents").select("id, metadata").ilike("metadata->>title", f"%{item}%").execute()
            print(f"📄 Found {len(res_other.data)} entries for '{item}'")
            
    except Exception as e:
        print(f"❌ Error during scan: {e}")

if __name__ == "__main__":
    asyncio.run(verify_kb())
