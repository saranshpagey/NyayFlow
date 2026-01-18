import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

async def delete_incomplete_llp():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    supabase = create_client(supabase_url, supabase_key)

    print("🗑️  Deleting incomplete LLP Act entry...")
    
    try:
        # Delete all documents with the incomplete URL
        incomplete_url = "https://indiankanoon.org/doc/358068/"
        
        res = supabase.table("documents").delete().eq("metadata->>source_url", incomplete_url).execute()
        print(f"✅ Deleted all documents from {incomplete_url}")
        
        # Verify
        res_verify = supabase.table("documents").select("id").ilike("metadata->>title", "%Limited Liability Partnership%").eq("metadata->>chunk_index", "0").execute()
        print(f"\n📊 Remaining LLP Act entries (chunk_index 0): {len(res_verify.data)}")
        
        if len(res_verify.data) == 1:
            print("✅ SUCCESS: Only 1 authoritative LLP Act entry remains!")
        else:
            print(f"⚠️  WARNING: Expected 1 entry, found {len(res_verify.data)}")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(delete_incomplete_llp())
