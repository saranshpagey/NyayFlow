import os
import json
from supabase import create_client
from dotenv import load_dotenv
from collections import defaultdict, Counter

load_dotenv()

def analyze_vectors():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    supabase = create_client(url, key)

    print("🔍 Fetching document metadata for analysis...")
    
    all_metadata = []
    limit = 1000
    offset = 0
    
    while True:
        try:
            res = supabase.table("documents").select("id, metadata").range(offset, offset + limit - 1).execute()
            if not res.data:
                break
            all_metadata.extend(res.data)
            offset += limit
            if offset % 5000 == 0:
                print(f"   Fetched {len(all_metadata)} vectors...")
            if len(res.data) < limit:
                break
        except Exception as e:
            print(f"❌ Error fetching data: {e}")
            break

    total_vectors = len(all_metadata)
    print(f"✅ Total Vectors Fetched: {total_vectors}")

    # Analysis 1: Unique Documents (by Title + Citation)
    doc_groups = defaultdict(list)
    for item in all_metadata:
        meta = item.get("metadata", {}) or {}
        title = meta.get("title", "Untitled")
        citation = meta.get("citation", "No Citation")
        doc_key = f"{title}" # Group mainly by title for now as citations might vary slightly
        doc_groups[doc_key].append(item["id"])

    # Analysis 2: Perfect Duplicates (Title + Chunk Index)
    chunk_groups = defaultdict(list)
    for item in all_metadata:
        meta = item.get("metadata", {}) or {}
        title = meta.get("title", "Untitled")
        idx = meta.get("chunk_index", 0)
        chunk_key = f"{title}|{idx}"
        chunk_groups[chunk_key].append(item["id"])

    redundant_chunk_count = 0
    redundancy_distribution = Counter()
    
    for key, ids in chunk_groups.items():
        if len(ids) > 1:
            count = len(ids) - 1
            redundant_chunk_count += count
            title = key.split('|')[0]
            redundancy_distribution[title] += count

    print("\n📊 ANALYSIS RESULTS")
    print("===================")
    print(f"Total Vectors:       {total_vectors}")
    print(f"Unique Documents:    {len(doc_groups)}")
    print(f"Duplicate Chunks:    {redundant_chunk_count}")
    print(f"Redundancy Rate:     {redundant_chunk_count/total_vectors*100:.2f}%")
    
    print("\n🏆 Top 10 Most Duplicated Documents:")
    for title, count in redundancy_distribution.most_common(10):
        print(f"   - {title}: {count} extra chunks")
        
    print("\n💡 Storage Optimization Estimate:")
    # Assuming avg chunk size ~2KB (content + embedding)
    est_savings = redundant_chunk_count * 2 / 1024 # MB
    print(f"   Removing duplicates could save approx. {est_savings:.2f} MB of data storage + index size.")

if __name__ == "__main__":
    analyze_vectors()
