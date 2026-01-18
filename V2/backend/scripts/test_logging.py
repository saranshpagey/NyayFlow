import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

from services.usage_service import usage_service

async def test_logging():
    print("🧪 Testing usage logging...")
    try:
        # Log a sample "Research" query (approx 500 input, 1000 output)
        await usage_service.log_usage(
            query_type="research_test",
            model="gemini-2.0-flash",
            input_tokens=500,
            output_tokens=1000,
            status="success"
        )
        print("✅ Logged test entry successfully.")
    except Exception as e:
        print(f"❌ Failed to log entry: {e}")

if __name__ == "__main__":
    asyncio.run(test_logging())
