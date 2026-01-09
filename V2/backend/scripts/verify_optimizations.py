import asyncio
from rag_engine import rag_engine

async def test_optimizations():
    print("🧪 Testing RAG Optimizations (Few-Shot & Caching)...")
    
    # 1. Test Few-Shot/Persona
    query = "What is the limitation for a money suit?"
    print(f"\n👤 USER: {query}")
    results = await rag_engine.analyze_query(query)
    print(f"🤖 AI RESPONSE (Check for empathy/chunking):\n{results[0]['summary']}")
    
    # 2. Test Cache Logic (Even if table doesn't exist yet, we check the flow)
    print("\n🔄 Repeating query to trigger cache logic...")
    results2 = await rag_engine.analyze_query(query)
    
    if results2[0].get('id') == "cache_hit":
        print("\n✅ SUCCESS: Semantic Cache Hit confirmed!")
    else:
        print("\nℹ️ Cache Miss (Expected if table not created by user yet).")

if __name__ == "__main__":
    asyncio.run(test_optimizations())
