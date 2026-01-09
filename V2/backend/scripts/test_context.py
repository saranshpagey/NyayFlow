import asyncio
from rag_engine import rag_engine

async def test_multi_turn_conversation():
    print("🤖 Testing Multi-Turn Conversation (Context Awareness)...")
    
    # 1. Initial Query
    query_1 = "What is Section 302 of the IPC?"
    print(f"\n👤 USER: {query_1}")
    results_1 = await rag_engine.analyze_query(query_1)
    answer_1 = results_1[0]['summary']
    print(f"🤖 AI: {answer_1}")
    
    # 2. Follow-up Query (requires context)
    query_2 = "Can you continue with the punishment details?"
    print(f"\n👤 USER: {query_2}")
    
    # Prepare history
    history = [
        {"role": "user", "content": query_1},
        {"role": "ai", "content": answer_1}
    ]
    
    results_2 = await rag_engine.analyze_query(query_2, history=history)
    answer_2 = results_2[0]['summary']
    print(f"🤖 AI: {answer_2}")
    
    # Check if the AI understood the context
    if "Section 302" in answer_2 or "murder" in answer_2 or "death penalty" in answer_2:
        print("\n✅ Success: AI maintained context!")
    else:
        print("\n❌ Failure: AI lost context.")

if __name__ == "__main__":
    asyncio.run(test_multi_turn_conversation())
