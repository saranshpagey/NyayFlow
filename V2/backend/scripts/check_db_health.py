import os
from supabase.client import create_client
from dotenv import load_dotenv

load_dotenv()

def check_supabase_health():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    supabase = create_client(url, key)
    
    print("🛰️ Checking Supabase Index Health...")
    
    # Check if indexes exist and their status
    query = """
    SELECT
        schemaname,
        tablename,
        indexname,
        indexdef
    FROM
        pg_indexes
    WHERE
        tablename = 'documents' OR tablename = 'answer_cache';
    """
    
    # RPC is safer for raw SQL if we have one, otherwise we can try a direct table query on pg_indexes if allowed
    try:
        # Most Supabase configs don't allow direct SELECT on pg_indexes via API for security.
        # But we can check if the match_documents function is healthy by running a small query.
        
        print("🔍 Testing match_documents with a dummy embedding...")
        dummy_embedding = [0.1] * 768
        res = supabase.rpc("match_documents", {
            "query_embedding": dummy_embedding,
            "match_threshold": 0.5,
            "match_count": 1
        }).execute()
        print("✅ RPC match_documents responded.")
        
    except Exception as e:
        print(f"❌ RPC Health Check Error: {e}")

    # Check the Maintenance Memory again
    try:
        print("\n🔍 Checking maintenance_work_mem...")
        res = supabase.rpc("run_sql", {"sql": "SHOW maintenance_work_mem;"}).execute()
        print(f"🛠️ maintenance_work_mem: {res.data}")
    except:
        pass

if __name__ == "__main__":
    check_supabase_health()
