import os
import json
from supabase import create_client
from dotenv import load_dotenv
from collections import defaultdict

load_dotenv()

def analyze_redundancy():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    supabase = create_client(url, key)

    print("🔍 Fetching document metadata to analyze redundancy...")
    # Fetching in batches to avoid memory/timeout issues if it's huge
    # However, since we only need metadata, we can try to fetch just the columns we need
    # We'll use id and metadata
    
    all_metadata = []
    limit = 1000
    offset = 0
    
    while True:
        res = supabase.table("documents").select("id, metadata").range(offset, offset + limit - 1).execute()
        if not res.data:
            break
        all_metadata.extend(res.data)
        offset += limit
        print(f"   Fetched {len(all_metadata)} vectors...")
        if len(res.data) < limit:
            break

    print(f"✅ Total Vectors Fetched: {len(all_metadata)}")

    # Group by title/citation to find duplicates
    # Use a combination of title and chunk_index or just title to find total docs
    docs = defaultdict(list)
    for item in all_metadata:
        meta = item.get("metadata", {})
        title = meta.get("title", "Untitled")
        citation = meta.get("citation", "No Citation")
        
        # Identity key for a "Document"
        doc_key = f"{title}|{citation}"
        docs[doc_key].append(item["id"])

    print(f"📊 Unique Documents Found: {len(docs)}")
    
    # Check for cases where the same content was ingested with different titles or keys
    # But usually, it's the exact same title from different ingestion runs
    
    redundant_ids = []
    for key, ids in docs.items():
        # A document might have many chunks. We need to check if we have multiple SETS of chunks for the same document.
        # This is tricky because metadata doesn't always have a file_hash.
        # Let's check how many chunks per document.
        pass

    # Better approach: Group by (title, citation, chunk_index)
    unique_chunks = defaultdict(list)
    for item in all_metadata:
        meta = item.get("metadata", {})
        title = meta.get("title", "Untitled")
        idx = meta.get("chunk_index", 0)
        # Unique key for a specific chunk of a specific document
        chunk_key = f"{title}|{idx}"
        unique_chunks[chunk_key].append(item["id"])

    redundant_chunk_ids = []
    for key, ids in unique_chunks.items():
        if len(ids) > 1:
            # Keep one, mark others for deletion
            redundant_chunk_ids.extend(ids[1:])

    print(f"⚠️ Redundant Chunks Found: {len(redundant_chunk_ids)}")
    
    if redundant_chunk_ids:
        print(f"🧹 Deleting {len(redundant_chunk_ids)} redundant chunks...")
        # Delete in batches of 500
        batch_size = 500
        for i in range(0, len(redundant_chunk_ids), batch_size):
            batch = redundant_chunk_ids[i:i+batch_size]
            supabase.table("documents").delete().in_("id", batch).execute()
            print(f"   Deleted {i + len(batch)}/{len(redundant_chunk_ids)}...")
        print("✨ Redundancy resolved!")
    else:
        print("✅ No redundant knowledge found.")

    return {
        "total_vectors": len(all_metadata),
        "unique_documents": len(docs),
        "redundant_cleared": len(redundant_chunk_ids)
    }

if __name__ == "__main__":
    analyze_redundancy()
