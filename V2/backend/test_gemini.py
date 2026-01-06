import os
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

key = os.environ.get("GOOGLE_API_KEY")
print(f"Key found: {'Yes' if key else 'No'}")

try:
    print("Testing Chat...")
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=key)
    res = llm.invoke("Hi")
    print(f"Chat OK: {res.content}")
except Exception as e:
    print(f"Chat Failed: {e}")

try:
    print("Testing Embedding (embedding-001)...")
    emb = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=key)
    res = emb.embed_query("Hello world")
    print(f"Embedding OK: {len(res)} dims")
except Exception as e:
    print(f"Embedding (embedding-001) Failed: {e}")

try:
    print("Testing Embedding (text-embedding-004)...")
    emb = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=key)
    res = emb.embed_query("Hello world")
    print(f"Embedding OK: {len(res)} dims")
except Exception as e:
    print(f"Embedding (text-embedding-004) Failed: {e}")
