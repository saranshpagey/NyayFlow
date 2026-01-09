
import asyncio
import sys
import os
import time

# Ensure we can import from backend root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag_engine import rag_engine

QUERIES = [
    {
        "text": "My neighbor built a wall blocking my sunlight. What are my rights under Easement Act and can I get an injunction? Draft a notice.",
        "intent": "Research + Drafting + Specific Act",
        "expected_type": "summary" # Widget type
    },
    {
        "text": "Explain the procedure for filing a divorce under Hindu Marriage Act when one partner is missing for 7 years. Include relevant case laws.",
        "intent": "Procedure + Case Law",
        "expected_type": "procedure"
    },
    {
        "text": "What acts cover cyber defamation in India? Compare with IPC Section 499. What is the punishment?",
        "intent": "Comparative Analysis + Penalty",
        "expected_type": "penalty"
    },
    {
        "text": "I sold goods to a company in Bangalore but they haven't paid. Cheque bounced. Jurisdiction is Delhi. Can I file in Delhi? Draft a demand notice.",
        "intent": "Jurisdiction Logic + Drafting",
        "expected_type": "summary"
    }
]

async def stress_test():
    print(f"🚀 Starting RAG Stress Test ({len(QUERIES)} Complex Queries)...\n")
    
    overall_start = time.time()
    
    for i, q in enumerate(QUERIES):
        print(f"🔹 Query {i+1}: {q['text']}")
        print(f"   Intent: {q['intent']}")
        
        start = time.time()
        try:
            # Analyze
            results = await rag_engine.analyze_query(q['text'])
            duration = time.time() - start
            
            # Validation
            if not results:
                print(f"   ❌ FAILED: No results returned ({duration:.2f}s)")
                continue

            main_res = results[0]
            
            # Check for Fallback
            if main_res.get('id') == 'fallback' or 'fallback' in str(main_res.get('thinking', '')).lower():
                print(f"   ⚠️  FALLBACK TRIGGERED (Index might vary) ({duration:.2f}s)")
            else:
                 print(f"   ✅ SUCCESS: Retrieved from DB/Cache ({duration:.2f}s)")

            # Check Widget
            widget = main_res.get('widget')
            if widget:
                print(f"      Widget: {widget.get('type')} (Data keys: {list(widget.get('data', {}).keys())})")
            else:
                print("      Widget: None")
            
            # Check for Draft
            summary = main_res.get('summary', '')
            if 'VAKALATNAMA' in summary.upper() or 'NOTICE' in summary.upper() or 'DRAFT' in summary.upper():
                 print(f"      Draft: Detected in response.")

        except Exception as e:
            print(f"   ❌ ERROR: {e}")

        print("")
        await asyncio.sleep(1) # Gentle formatting pause

    print(f"\n🏁 Stress Test Complete in {time.time() - overall_start:.2f}s")

if __name__ == "__main__":
    asyncio.run(stress_test())
