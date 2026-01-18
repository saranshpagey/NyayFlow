#!/usr/bin/env python3
"""
Reset Cost Tracker - Clear all LLM usage logs
"""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

def reset_cost_tracker():
    """Delete all entries from llm_usage_logs table."""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY")
        return
    
    client = create_client(supabase_url, supabase_key)
    
    try:
        # Get current count
        count_res = client.table("llm_usage_logs").select("*", count="exact").execute()
        current_count = count_res.count if count_res.count else 0
        
        print(f"📊 Current entries in llm_usage_logs: {current_count}")
        
        if current_count == 0:
            print("✅ Cost tracker is already empty!")
            return
        
        # Confirm deletion
        print(f"\n⚠️  This will DELETE all {current_count} entries from the cost tracker.")
        confirm = input("Type 'RESET' to confirm: ")
        
        if confirm != "RESET":
            print("❌ Reset cancelled.")
            return
        
        # Delete all entries
        # Note: Supabase doesn't have a "delete all" without a filter
        # We'll delete by selecting all IDs first
        all_entries = client.table("llm_usage_logs").select("id").execute()
        
        if all_entries.data:
            for entry in all_entries.data:
                client.table("llm_usage_logs").delete().eq("id", entry["id"]).execute()
        
        print(f"✅ Successfully deleted {current_count} entries!")
        
        # Verify
        verify_res = client.table("llm_usage_logs").select("*", count="exact").execute()
        remaining = verify_res.count if verify_res.count else 0
        print(f"📊 Remaining entries: {remaining}")
        
    except Exception as e:
        print(f"❌ Error resetting cost tracker: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    reset_cost_tracker()
