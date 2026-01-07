import asyncio
from rag_engine import rag_engine

async def verify_phase1():
    print("🧪 Verifying Phase 1: Metadata Indexing...")
    
    # Search for a 2024 case we know exists in the metadata
    query = "Find the case Vijay Singh vs State of Bihar from 2024"
    print(f"\n👤 USER: {query}")
    
    results = await rag_engine.analyze_query(query)
    if results and len(results) > 0:
        answer = results[0]['summary']
        print(f"\n🤖 AI RESPONSE:\n{answer}")
        
        if "Vijay Singh" in answer and "2024" in answer:
            print("\n✅ SUCCESS: Phase 1 is working! Case header retrieved.")
        else:
            print("\n⚠️ WARNING: AI answered but header details might be missing.")
    else:
        print("\n❌ NO RESULTS: Still indexing or search failed.")

if __name__ == "__main__":
    asyncio.run(verify_phase1())
