import os
from supabase import create_client
from dotenv import load_dotenv
from collections import defaultdict
import time

load_dotenv()

def optimize_database():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    supabase = create_client(url, key)

    print("🚀 Starting Vector DB Optimization...")
    print("-------------------------------------")

    # 1. Fetch ALL metadata
    print("🔍 Fetching metadata for all documents...")
    all_metadata = []
    limit = 1000
    offset = 0
    
    while True:
        try:
            # We only need id and metadata. created_at might not exist.
            res = supabase.table("documents").select("id, metadata").range(offset, offset + limit - 1).execute()
            if not res.data:
                break
            all_metadata.extend(res.data)
            offset += limit
            if offset % 5000 == 0:
                print(f"   Fetched {len(all_metadata)} records...")
            
            # Safety break if database is surprisingly huge (shouldn't be based on analysis)
            if len(all_metadata) > 100000:
                print("⚠️ Safety limit reached (100k vectors). Pausing fetch.")
                break
                
            if len(res.data) < limit:
                break
        except Exception as e:
            print(f"❌ Error fetching data: {e}")
            break
            
    print(f"✅ Total Records: {len(all_metadata)}")

    # 2. Identify Duplicates
    # Strategy: Group by (Title + Chunk Index). Keep one instance.
    print("\n🧩 Identifying duplicates...")
    
    chunk_groups = defaultdict(list)
    for item in all_metadata:
        meta = item.get("metadata", {}) or {}
        title = meta.get("title", 'Untitled')
        idx = meta.get("chunk_index", 0)
        
        # Key that strictly defines a unique piece of information
        key = f"{title}|{idx}"
        chunk_groups[key].append(item)

    ids_to_delete = []
    kept_count = 0
    
    for key, items in chunk_groups.items():
        if len(items) > 1:
            # Sort by ID descending. 
            # If ID is serial, this keeps the newest. 
            # If ID is UUID, this deterministically keeps one and deletes others.
            items.sort(key=lambda x: str(x['id']), reverse=True)
            
            # Keep the first one (newest)
            kept = items[0]
            kept_count += 1
            
            # Mark rest for deletion
            for redundant in items[1:]:
                ids_to_delete.append(redundant['id'])
        else:
            kept_count += 1

    print(f"   Unique Chunks to Keep: {kept_count}")
    print(f"   Redundant Chunks:      {len(ids_to_delete)}")
    
    if not ids_to_delete:
        print("🎉 No duplicates found! Database is already optimized.")
        return

    # 3. Confirmation
    # Since this is an automated run approved by user, we proceed directly but with logs.
    print(f"\n🗑️ Deleting {len(ids_to_delete)} redundant vectors...")
    
    # 4. Batch Deletion
    batch_size = 500
    total_deleted = 0
    
    for i in range(0, len(ids_to_delete), batch_size):
        batch = ids_to_delete[i:i+batch_size]
        try:
            supabase.table("documents").delete().in_("id", batch).execute()
            total_deleted += len(batch)
            print(f"   Deleted {total_deleted}/{len(ids_to_delete)}...")
            time.sleep(0.1) # Tiny throttle to be nice to DB
        except Exception as e:
            print(f"❌ Error deleting batch {i}: {e}")

    print("\n✨ Optimization Complete!")
    print(f"   Removed: {total_deleted} vectors")
    print(f"   Remaining Estimate: {kept_count} vectors")

if __name__ == "__main__":
    optimize_database()
