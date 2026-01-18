import asyncio
from rag_engine import rag_engine

async def verify_drafting():
    print("🧪 Verifying AI Drafting Intelligence...")
    
    query = "My name is Saransh. My cheque of 20,000 was bounced by SBI bank yesterday. Can you help me draft a legal notice for this?"
    print(f"\n👤 USER: {query}")
    
    results = await rag_engine.analyze_query(query)
    if results and len(results) > 0:
        answer = results[0]['summary']
        print(f"\n🤖 AI RESPONSE:\n{answer}")
        
        # Check for key draft elements
        if "LEGAL NOTICE" in answer and "SBI" in answer and "Section 138" in answer:
            print("\n✅ SUCCESS: AI correctly identified the template and populated details!")
        else:
            print("\n⚠️ WARNING: AI answered but might not have used the template perfectly.")
    else:
        print("\n❌ NO RESULTS: Check RAG retrieval.")

if __name__ == "__main__":
    asyncio.run(verify_drafting())
