import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment
load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

if not supabase_url or not supabase_key:
    print("❌ Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found in .env")
    exit(1)

print(f"🔗 Connecting to: {supabase_url}")
supabase = create_client(supabase_url, supabase_key)

try:
    # Try fetching a row from a known existing table first (document metadata)
    res = supabase.table("documents").select("id").limit(1).execute()
    print("✅ Successfully connected and read from 'documents' table.")
    
    # Now check for llm_usage_logs
    try:
        res_usage = supabase.table("llm_usage_logs").select("*").limit(1).execute()
        print("✅ 'llm_usage_logs' table FOUND.")
    except Exception as e:
        print(f"❌ 'llm_usage_logs' table NOT found or error: {e}")

except Exception as e:
    print(f"❌ Connection error: {e}")
