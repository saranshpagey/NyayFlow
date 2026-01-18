import os
from supabase.client import create_client
from dotenv import load_dotenv

load_dotenv()

def check_indexes():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    supabase = create_client(url, key)
    
    print("🛰️ Deep Index Inspection...")
    
    # Try to see if we can get index info via a more clever way or raw query
    # If the user has a 'run_sql' RPC (common in some custom setups), we'd use it.
    # Otherwise, let's just see if a very short query works.
    
    import time
    start = time.time()
    dummy_embedding = [0.0] * 768
    try:
        res = supabase.rpc("match_documents", {
            "query_embedding": dummy_embedding,
            "match_threshold": 0.9, # Very high to minimize return rows
            "match_count": 1
        }).execute()
        print(f"✅ Fast check (0.9 threshold): {time.time() - start:.2f}s")
    except Exception as e:
        print(f"❌ Fast check failed: {e}")

    start = time.time()
    try:
        res = supabase.rpc("match_documents", {
            "query_embedding": dummy_embedding,
            "match_threshold": 0.1, # Forced scan?
            "match_count": 5
        }).execute()
        print(f"📊 Slow check (0.1 threshold): {time.time() - start:.2f}s")
    except Exception as e:
        print(f"❌ Slow check timed out/failed: {e}")

if __name__ == "__main__":
    check_indexes()
