import asyncio
from rag_engine import rag_engine

async def verify_excise_retrieval():
    print("🧪 Verifying Excise Law Retrieval...")
    
    queries = [
        "What is the Central Excise Act 1944?",
        "Punishment for illegal liquor possession in UP?",
        "What does the Karnataka Excise Act 1965 specify about licenses?"
    ]
    
    for q in queries:
        print(f"\n🔍 Query: {q}")
        results = await rag_engine.analyze_query(q)
        if results and len(results) > 0:
            print(f"✅ AI Answered: {results[0]['summary'][:200]}...")
            if results[0].get('widget'):
                print(f"📦 Widget Generated: {results[0]['widget']['type']}")
        else:
            print("❌ No results found.")

if __name__ == "__main__":
    asyncio.run(verify_excise_retrieval())
