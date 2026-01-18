#!/usr/bin/env python3
"""
Test to see actual LLM response metadata structure
"""
import os
import sys
import asyncio
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI

async def test_metadata():
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0.1,
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
    
    print("🧪 Testing LLM response metadata structure...\n")
    
    response = await llm.ainvoke("What is 2+2?")
    
    print(f"📄 Response Content: {response.content}\n")
    print(f"📊 Response Metadata: {response.response_metadata}\n")
    
    # Check for usage_metadata attribute (modern LangChain)
    usage_metadata = getattr(response, "usage_metadata", None)
    print(f"📊 usage_metadata attribute: {usage_metadata}\n")
    
    # Try different extraction methods
    print("=" * 80)
    print("TOKEN EXTRACTION ATTEMPTS:")
    print("=" * 80)
    
    meta = response.response_metadata
    
    # Method 1: token_usage in metadata
    token_usage = meta.get("token_usage")
    print(f"\n1. meta.get('token_usage'): {token_usage}")
    
    # Method 2: usage_metadata in metadata
    usage_metadata_in_meta = meta.get("usage_metadata")
    print(f"2. meta.get('usage_metadata'): {usage_metadata_in_meta}")
    
    # Method 3: Direct usage_metadata attribute
    usage_attr = getattr(response, "usage_metadata", {}) or {}
    print(f"3. response.usage_metadata: {usage_attr}")
    print(f"   - Input Tokens: {usage_attr.get('input_tokens')}")
    print(f"   - Output Tokens: {usage_attr.get('output_tokens')}")

if __name__ == "__main__":
    asyncio.run(test_metadata())
