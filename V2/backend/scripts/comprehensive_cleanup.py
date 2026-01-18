import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client
from collections import defaultdict

load_dotenv()

async def comprehensive_cleanup():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🔍 Starting Comprehensive Redundancy Scan...")
    
    try:
        # Get ALL documents with startup_compliance topic
        res = supabase.table("documents").select("id, metadata").eq("metadata->>topic", "startup_compliance").execute()
        docs = res.data
        
        print(f"📊 Total startup_compliance documents: {len(docs)}")
        
        # Group by (source_url, chunk_index) to find duplicates
        fingerprint_map = defaultdict(list)
        
        for doc in docs:
            meta = doc['metadata']
            source_url = meta.get('source_url', '')
            chunk_index = meta.get('chunk_index', '')
            
            # Create unique fingerprint
            fingerprint = f"{source_url}||{chunk_index}"
            fingerprint_map[fingerprint].append({
                'id': doc['id'],
                'title': meta.get('title', 'Unknown'),
                'date': meta.get('date', 'Unknown')
            })
        
        # Find duplicates
        duplicates_to_delete = []
        duplicate_summary = []
        
        for fingerprint, doc_list in fingerprint_map.items():
            if len(doc_list) > 1:
                # Sort by date to keep the most recent/accurate one
                # Keep first, delete rest
                duplicate_summary.append({
                    'fingerprint': fingerprint,
                    'count': len(doc_list),
                    'keeping': doc_list[0]['id'],
                    'deleting': [d['id'] for d in doc_list[1:]]
                })
                duplicates_to_delete.extend([d['id'] for d in doc_list[1:]])
        
        if not duplicates_to_delete:
            print("✨ No duplicates found! Database is clean.")
            return
        
        print(f"\n🚨 Found {len(duplicates_to_delete)} redundant documents across {len(duplicate_summary)} unique fingerprints.")
        print("\nDuplicate Summary:")
        for dup in duplicate_summary[:10]:  # Show first 10
            print(f"  - Fingerprint: {dup['fingerprint'][:80]}...")
            print(f"    Keeping: {dup['keeping']}")
            print(f"    Deleting: {len(dup['deleting'])} copies")
        
        # Delete in batches
        print(f"\n🧹 Deleting {len(duplicates_to_delete)} redundant documents...")
        batch_size = 100
        deleted_count = 0
        
        for i in range(0, len(duplicates_to_delete), batch_size):
            batch = duplicates_to_delete[i : i + batch_size]
            supabase.table("documents").delete().in_("id", batch).execute()
            deleted_count += len(batch)
            print(f"✅ Deleted batch {i//batch_size + 1}/{(len(duplicates_to_delete)-1)//batch_size + 1} ({deleted_count}/{len(duplicates_to_delete)} total)")
        
        print(f"\n✨ Cleanup Complete! Removed {deleted_count} redundant documents.")
        
        # Final verification
        res_final = supabase.table("documents").select("id", count="exact").eq("metadata->>topic", "startup_compliance").execute()
        print(f"📊 Final startup_compliance document count: {res_final.count}")

    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(comprehensive_cleanup())
