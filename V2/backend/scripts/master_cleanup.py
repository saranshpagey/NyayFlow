import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def master_cleanup():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🧹 Starting Master Redundancy Cleanup...")
    
    try:
        # Get all startup_compliance documents
        res = supabase.table("documents").select("id, metadata").eq("metadata->>topic", "startup_compliance").execute()
        docs = res.data
        
        # Identity map: (source_url or title, chunk_index) -> list of IDs
        identity_map = {}
        for doc in docs:
            meta = doc['metadata']
            # Use source_url + chunk_index as the unique key
            key = (meta.get('source_url', meta.get('title')), meta.get('chunk_index'))
            if key not in identity_map:
                identity_map[key] = []
            identity_map[key].append(doc['id'])
            
        duplicate_ids = []
        for key, ids in identity_map.items():
            if len(ids) > 1:
                # Keep the first one, delete the rest
                duplicate_ids.extend(ids[1:])
                
        if not duplicate_ids:
            print("✨ No duplicates found in startup_compliance topic.")
            return

        print(f"🚨 Found {len(duplicate_ids)} redundant document chunks. Deleting...")
        
        # Delete in batches to avoid URL length issues or timeouts
        batch_size = 100
        for i in range(0, len(duplicate_ids), batch_size):
            batch = duplicate_ids[i : i + batch_size]
            supabase.table("documents").delete().in_("id", batch).execute()
            print(f"✅ Deleted batch {i//batch_size + 1}")

        print("✨ Cleanup Complete.")

    except Exception as e:
        print(f"❌ Error during master cleanup: {e}")

if __name__ == "__main__":
    asyncio.run(master_cleanup())
