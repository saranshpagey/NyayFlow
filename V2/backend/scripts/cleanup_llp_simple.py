import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def cleanup_llp_simple():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🧹 Cleaning up LLP Act duplicates (simple approach)...")
    
    try:
        # Get all LLP Act entries
        res = supabase.table("documents").select("id, metadata").ilike("metadata->>title", "%Limited Liability Partnership%").execute()
        
        llp_docs = res.data
        print(f"📄 Total LLP Act documents: {len(llp_docs)}")
        
        # Group by (source_url, chunk_index)
        fingerprints = {}
        for doc in llp_docs:
            url = doc['metadata'].get('source_url', '')
            chunk = doc['metadata'].get('chunk_index', '')
            key = f"{url}||{chunk}"
            
            if key not in fingerprints:
                fingerprints[key] = []
            fingerprints[key].append(doc['id'])
        
        # Find duplicates
        to_delete = []
        for key, ids in fingerprints.items():
            if len(ids) > 1:
                # Keep first, delete rest
                to_delete.extend(ids[1:])
                print(f"🔍 Fingerprint: {key[:80]}...")
                print(f"   Keeping: {ids[0]}")
                print(f"   Deleting: {ids[1:]}")
        
        if not to_delete:
            print("✨ No duplicates found!")
            return
        
        print(f"\n🗑️  Deleting {len(to_delete)} duplicate documents...")
        
        # Delete in batches
        batch_size = 100
        for i in range(0, len(to_delete), batch_size):
            batch = to_delete[i:i+batch_size]
            supabase.table("documents").delete().in_("id", batch).execute()
            print(f"✅ Deleted batch {i//batch_size + 1}")
        
        print(f"\n✨ Cleanup complete! Deleted {len(to_delete)} duplicates.")
        
        # Verify
        res_verify = supabase.table("documents").select("id").ilike("metadata->>title", "%Limited Liability Partnership%").execute()
        print(f"📊 Remaining LLP Act documents: {len(res_verify.data)}")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(cleanup_llp_simple())
