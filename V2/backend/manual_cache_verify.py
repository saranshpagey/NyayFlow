import os
import json
import asyncio
from supabase.client import create_client
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

async def manual_cache_test():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    google_key = os.environ.get("GOOGLE_API_KEY")
    
    supabase = create_client(url, key)
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=google_key)
    
    test_query = "What is the penalty for theft?"
    print(f"🛰️ Generating embedding for: {test_query}")
    embedding = embeddings.embed_query(test_query)
    
    dummy_response = {
        "thinking": "Dummy thoughts",
        "answer": "The penalty for theft under IPC is imprisonment up to 3 years.",
        "widget": {"type": "penalty", "data": {"crime": "Theft", "imprisonment": "3 years", "fine": "Varies"}}
    }
    
    print("💾 Manually inserting into answer_cache...")
    try:
        supabase.table("answer_cache").insert({
            "query_text": test_query,
            "query_embedding": embedding,
            "response_json": dummy_response
        }).execute()
        print("✅ Inserted successfully.")
        
        print("\n🔍 Querying cache via RPC match_cache...")
        match_res = supabase.rpc("match_cache", {
            "query_embedding": embedding,
            "match_threshold": 0.95,
            "match_count": 1
        }).execute()
        
        if match_res.data:
            print(f"⚡ CACHE HIT SUCCESS: {match_res.data[0]['query_text']}")
            print(f"🤖 Cached Answer: {match_res.data[0]['response_json']['answer']}")
        else:
            print("❌ CACHE HIT FAILED: Result empty.")
            
    except Exception as e:
        print(f"❌ Error during manual cache test: {e}")

if __name__ == "__main__":
    asyncio.run(manual_cache_test())
