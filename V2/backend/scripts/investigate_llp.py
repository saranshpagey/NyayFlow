import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def investigate_llp():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🔍 Investigating remaining LLP Act entries...")
    
    try:
        # Get the two remaining entries
        res = supabase.table("documents").select("id, metadata").ilike("metadata->>title", "%Limited Liability Partnership%").eq("metadata->>chunk_index", "0").execute()
        
        print(f"\n📄 Found {len(res.data)} LLP Act entries:\n")
        
        for i, doc in enumerate(res.data, 1):
            meta = doc['metadata']
            print(f"Entry {i}:")
            print(f"  ID: {doc['id']}")
            print(f"  Title: {meta.get('title')}")
            print(f"  Date: {meta.get('date')}")
            print(f"  URL: {meta.get('source_url')}")
            print(f"  File Path: {meta.get('file_path')}")
            
            # Count total chunks for this source
            count_res = supabase.table("documents").select("id", count="exact").eq("metadata->>source_url", meta.get('source_url')).execute()
            print(f"  Total chunks from this source: {count_res.count}")
            print()
        
        # Decision: Keep the one with more chunks or more recent date
        if len(res.data) == 2:
            url1 = res.data[0]['metadata'].get('source_url')
            url2 = res.data[1]['metadata'].get('source_url')
            
            count1 = supabase.table("documents").select("id", count="exact").eq("metadata->>source_url", url1).execute().count
            count2 = supabase.table("documents").select("id", count="exact").eq("metadata->>source_url", url2).execute().count
            
            print(f"📊 Chunk counts:")
            print(f"  URL 1 ({url1[:50]}...): {count1} chunks")
            print(f"  URL 2 ({url2[:50]}...): {count2} chunks")
            
            # Recommend keeping the one with more chunks (likely more complete)
            if count1 > count2:
                print(f"\n💡 Recommendation: Keep URL 1 (more complete with {count1} chunks)")
                print(f"   Delete URL 2 ({count2} chunks)")
                to_delete_url = url2
            else:
                print(f"\n💡 Recommendation: Keep URL 2 (more complete with {count2} chunks)")
                print(f"   Delete URL 1 ({count1} chunks)")
                to_delete_url = url1
            
            return to_delete_url

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(investigate_llp())
