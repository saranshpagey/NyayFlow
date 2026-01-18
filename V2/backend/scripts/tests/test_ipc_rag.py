
import asyncio
import os
import sys

# Add parent directory to path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag_engine import rag_engine

async def test_ipc():
    print("Testing IPC Retrieval and Analysis...")
    query = "What is the punishment for murder under IPC Section 302?"
    results = await rag_engine.analyze_query(query)
    
    if results and len(results) > 0:
        print(f"✅ Found {len(results)} results.")
        primary = results[0]
        print(f"\nAI Answer:\n{primary['summary']}")
        print(f"\nThinking:\n{primary['thinking']}")
        if primary.get('widget'):
            print(f"\nWidget: {primary['widget']['type']}")
    else:
        print("❌ No results found. Check if IPC data was ingested.")

if __name__ == "__main__":
    asyncio.run(test_ipc())
