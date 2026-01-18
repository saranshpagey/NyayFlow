#!/usr/bin/env python3
import os
import sys
import asyncio
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

from services.usage_service import usage_service

async def test_logging():
    print("🧪 Testing usage logging with async fix...")
    try:
        # Log a sample "Research" query
        result = await usage_service.log_usage(
            query_type="async_test",
            model="gemini-2.0-flash",
            input_tokens=500,
            output_tokens=1000,
            status="success"
        )
        print(f"✅ Logged test entry successfully. Result: {result}")
        
        # Verify it was written
        stats = usage_service.get_stats(days=1)
        print(f"📊 Current stats: {stats}")
        
    except Exception as e:
        print(f"❌ Failed to log entry: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_logging())
