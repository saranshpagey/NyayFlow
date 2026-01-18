import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def cleanup_llp_duplicates():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🧹 Cleaning up LLP Act duplicates...")
    
    try:
        # Get all LLP Act entries with chunk_index 0
        res = supabase.table("documents").select("id, metadata").ilike("metadata->>title", "%Limited Liability Partnership%").eq("metadata->>chunk_index", "0").execute()
        
        llp_docs = res.data
        print(f"📄 Found {len(llp_docs)} LLP Act entries with chunk_index 0")
        
        # Group by source_url
        url_groups = {}
        for doc in llp_docs:
            url = doc['metadata'].get('source_url', '')
            if url not in url_groups:
                url_groups[url] = []
            url_groups[url].append(doc)
        
        # For each URL group, keep one and delete the rest
        to_delete = []
        for url, docs in url_groups.items():
            if len(docs) > 1:
                print(f"\n🔍 URL: {url}")
                print(f"   Found {len(docs)} duplicates")
                # Keep the first one, delete the rest
                keep_id = docs[0]['id']
                delete_ids = [d['id'] for d in docs[1:]]
                print(f"   Keeping: {keep_id}")
                print(f"   Deleting: {delete_ids}")
                to_delete.extend(delete_ids)
        
        if not to_delete:
            print("✨ No duplicates to delete!")
            return
        
        print(f"\n🗑️  Deleting {len(to_delete)} duplicate LLP Act entries...")
        
        # Delete all chunks for these document IDs
        for doc_id in to_delete:
            # First, get all chunks with this source
            all_chunks_res = supabase.table("documents").select("id").eq("metadata->>source_url", 
                supabase.table("documents").select("metadata->>source_url").eq("id", doc_id).execute().data[0]['metadata']['source_url']
            ).execute()
            
            # Simpler approach: just delete by ID pattern
            # Get the source URL first
            doc_res = supabase.table("documents").select("metadata").eq("id", doc_id).execute()
            if doc_res.data:
                source_url = doc_res.data[0]['metadata'].get('source_url')
                # Delete all documents with this source_url that match the duplicate pattern
                supabase.table("documents").delete().eq("metadata->>source_url", source_url).execute()
                print(f"✅ Deleted all chunks for source: {source_url[:60]}...")
                break  # Only need to do this once per URL
        
        print("\n✨ LLP Act cleanup complete!")
        
        # Verify
        res_verify = supabase.table("documents").select("id").ilike("metadata->>title", "%Limited Liability Partnership%").eq("metadata->>chunk_index", "0").execute()
        print(f"📊 Remaining LLP Act entries (chunk_index 0): {len(res_verify.data)}")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(cleanup_llp_duplicates())
