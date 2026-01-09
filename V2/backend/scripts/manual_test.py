
import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from rag_engine import rag_engine

async def test_theft_query():
    query = "What charges would I face if I carry out theft?"
    print(f"🔎 Testing Query: '{query}'")
    
    # Force timeout simulation or just run it (if no index, it WILL timeout or be slow)
    results = await rag_engine.analyze_query(query)
    
    print("\n--- RESULTS ---")
    for r in results:
        print(f"Title: {r.get('title')}")
        print(f"Summary: {r.get('summary')[:100]}...")
        if r.get('id') == 'fallback' or 'Fallback' in str(r.get('thinking')):
             print("❌ FAIL: Fallback Triggered (Timeout Likely)")
        else:
             print("✅ SUCCESS: Retrieved Logic")

if __name__ == "__main__":
    asyncio.run(test_theft_query())
