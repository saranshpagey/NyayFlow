#!/usr/bin/env python3
"""
Check detailed usage logs to debug cost tracking
"""
import os
import sys
from dotenv import load_dotenv
from supabase import create_client

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

def check_detailed_logs():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    client = create_client(supabase_url, supabase_key)
    
    try:
        # Get all logs ordered by most recent
        res = client.table("llm_usage_logs").select("*").order("created_at", desc=True).limit(15).execute()
        
        logs = res.data or []
        
        print(f"📊 Total Logs: {len(logs)}\n")
        print("=" * 100)
        
        for i, log in enumerate(logs, 1):
            print(f"\n{i}. Query Type: {log.get('query_type')}")
            print(f"   Model: {log.get('model')}")
            print(f"   Input Tokens: {log.get('input_tokens')}")
            print(f"   Output Tokens: {log.get('output_tokens')}")
            print(f"   Cost (USD): ${log.get('cost_usd')}")
            print(f"   Status: {log.get('status')}")
            print(f"   Created: {log.get('created_at')}")
            print("-" * 100)
        
        # Calculate totals
        total_cost = sum(log.get('cost_usd', 0) for log in logs)
        total_tokens = sum(log.get('input_tokens', 0) + log.get('output_tokens', 0) for log in logs)
        
        print(f"\n📈 SUMMARY:")
        print(f"   Total Cost: ${total_cost:.6f}")
        print(f"   Total Tokens: {total_tokens}")
        print(f"   Total Operations: {len(logs)}")
        
        # Breakdown by type
        breakdown = {}
        for log in logs:
            qtype = log.get('query_type', 'unknown')
            if qtype not in breakdown:
                breakdown[qtype] = {'count': 0, 'cost': 0, 'tokens': 0}
            breakdown[qtype]['count'] += 1
            breakdown[qtype]['cost'] += log.get('cost_usd', 0)
            breakdown[qtype]['tokens'] += log.get('input_tokens', 0) + log.get('output_tokens', 0)
        
        print(f"\n📊 BREAKDOWN BY TYPE:")
        for qtype, stats in breakdown.items():
            print(f"   {qtype}: {stats['count']} ops, ${stats['cost']:.6f}, {stats['tokens']} tokens")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_detailed_logs()
