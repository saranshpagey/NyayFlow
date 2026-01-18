import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")

async def check_usage_rows():
    if not url or not key:
        print("❌ Supabase credentials missing")
        return

    supabase: Client = create_client(url, key)
    
    try:
        response = supabase.table("llm_usage_logs").select("*", count="exact").execute()
        count = response.count
        print(f"✅ Table 'llm_usage_logs' exists.")
        print(f"📊 Total Rows: {count}")
        
        if count > 0:
            latest = supabase.table("llm_usage_logs").select("*").order("created_at", desc=True).limit(1).execute()
            print("🕒 Latest Log:", latest.data[0]['created_at'])
            print("💰 Latest Cost:", latest.data[0]['cost_usd'])
            
    except Exception as e:
        print(f"❌ Error querying table: {e}")

if __name__ == "__main__":
    asyncio.run(check_usage_rows())
