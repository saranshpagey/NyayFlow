import asyncio
import os
import sys

# Add parent directory to path to import backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.orchestrator import orchestrator
from rag_engine import rag_engine

async def test_heuristics():
    print("\n--- Testing Heuristic Intent Classification ---")
    queries = [
        "What are the requirements for GST registration?", # Compliance
        "How to file a consumer complaint?", # Procedure
        "Draft a legal notice for rental default", # Draft
        "What does 'sub-judice' mean?", # Glossary
        "Analyze my chances of winning a defamation case" # Analyze
    ]
    
    for q in queries:
        print(f"\nQuery: {q}")
        # We check logs manually or trust the return
        intent = await orchestrator.classify_intent(q)
        print(f"Detected Intent: {intent['primary_intent']}")

async def test_decoupled_retrieval():
    print("\n--- Testing Decoupled Retrieval (No LLM Gen) ---")
    query = "Section 420 IPC punishment"
    print(f"Query: {query}")
    
    # This should NOT trigger "🤖 Generation Phase..." in logs
    context, sources = await rag_engine.get_retrieved_context(query)
    print(f"Retrieved Context Length: {len(context)} characters")
    print(f"Sources Found: {len(sources)}")
    
    if len(context) > 0 and len(sources) > 0:
        print("✅ Decoupled retrieval working.")
    else:
        print("❌ Decoupled retrieval failed.")

async def test_optimized_draft_flow():
    print("\n--- Testing Optimized Draft Flow ---")
    query = "Draft a partnership agreement for a tech startup"
    
    # Watch logs: Should only see 1 "Generation" phase (from the orchestrator's coordinator_llm)
    # and NO "Generation Phase" from rag_engine.
    print(f"Executing: {query}")
    response = await orchestrator.route_query(query)
    
    if response["success"]:
        results = response["results"]
        print(f"Draft generated: {results[0]['title']}")
        print("✅ Draft flow completed.")
    else:
        print("❌ Draft flow failed.")

async def main():
    await test_heuristics()
    await test_decoupled_retrieval()
    await test_optimized_draft_flow()

if __name__ == "__main__":
    asyncio.run(main())
