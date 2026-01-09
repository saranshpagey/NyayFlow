import asyncio
from rag_engine import rag_engine

async def verify_precedents():
    print("🧪 Verifying Landmark Judgment Retrieval...")
    
    queries = [
        "What is the 'Basic Structure Doctrine' and which case established it?",
        "Can a state government be dismissed arbitrarily? Mention S.R. Bommai.",
        "Is privacy a fundamental right in India? Give case reference."
    ]
    
    for q in queries:
        print(f"\n👤 USER: {q}")
        results = await rag_engine.analyze_query(q)
        if results and len(results) > 0:
            answer = results[0]['summary']
            print(f"🤖 AI RESPONSE:\n{answer[:500]}...")
            
            # Check for specific case mentions
            if "Kesavananda Bharati" in answer or "S.R. Bommai" in answer or "Puttaswamy" in answer:
                print("✅ SUCCESS: Found relevant precedent!")
            else:
                print("⚠️ WARNING: AI didn't explicitly mention the landmark case.")
        else:
            print("❌ NO RESULTS.")

if __name__ == "__main__":
    asyncio.run(verify_precedents())
