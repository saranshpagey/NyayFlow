
import asyncio
from rag_engine import rag_engine

async def test_smart_fetch():
    print("🚀 Testing Smart Fetch Retrieval...")
    # This query should trigger a search that finds "The Coasting Vessels Act, 1838" 
    # which has a URL: https://indiankanoon.org/doc/1751970/
    query = "What is The Coasting Vessels Act, 1838 about and what are its key provisions?"
    
    results = await rag_engine.analyze_query(query)
    
    if results and len(results) > 0:
        print(f"✅ Found {len(results)} results.")
        primary = results[0]
        print(f"\nAI Answer (Context-Aware):\n{primary['summary']}")
        
        # Check if cache was created
        if any(f.endswith(".txt") for f in os.listdir("./data/cache")):
            print("\n✅ Verified: Cache file created in ./data/cache/")
        else:
            print("\n⚠️ Warning: No cache file found.")
            
    else:
        print("❌ No results found. Ensure the 'Laws and Acts' dataset is ingested.")

if __name__ == "__main__":
    import os
    asyncio.run(test_smart_fetch())
