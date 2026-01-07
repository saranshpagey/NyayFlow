import asyncio
from rag_engine import rag_engine

async def verify_paralegal():
    print("🧪 Verifying Paralegal Brain (Procedural Knowledge)...")
    
    queries = [
        "What is the limitation period for filing a suit to recover immovable property?",
        "How much is the court fee for a bail application generally?",
        "If my contract was broken 4 years ago, can I still file a suit for money?"
    ]
    
    for q in queries:
        print(f"\n👤 USER: {q}")
        results = await rag_engine.analyze_query(q)
        if results and len(results) > 0:
            answer = results[0]['summary']
            print(f"🤖 AI RESPONSE:\n{answer[:500]}...")
            
            # Check for specific procedural mentions
            if "12 Years" in answer or "3 Years" in answer or "Limitation Act" in answer:
                print("✅ SUCCESS: Found relevant procedural details!")
            else:
                print("⚠️ WARNING: AI might be missing specific procedural data.")
        else:
            print("❌ NO RESULTS.")

if __name__ == "__main__":
    asyncio.run(verify_paralegal())
