import asyncio
import os
import sys
from dotenv import load_dotenv

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from rag_engine import rag_engine

async def test_research_logging():
    load_dotenv()
    
    query = "Explain the liability of a director under Section 166 of the Companies Act 2013 in the context of recent ESG norms. (UNIQUE_ID_98765)"
    print(f"🧬 Running Research: '{query}'")
    
    try:
        results = await rag_engine.analyze_query(query)
        print("✅ Research Complete")
        
        # Check if usage was logged
        from services.usage_service import usage_service
        stats = usage_service.get_stats(days=1)
        print("\n📊 USAGE STATS (Last 24h):")
        print(stats)
        
        if stats['total_cost_usd'] == 0:
            print("\n❌ COST IS STILL ZERO. Check token counting logic.")
        else:
            print("\n✅ Cost logged successfully!")

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_research_logging())
