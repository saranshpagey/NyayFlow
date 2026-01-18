import os
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()
key = os.environ.get("GOOGLE_API_KEY")

models_to_try = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-pro",
    "gemini-1.0-pro"
]

for model in models_to_try:
    try:
        print(f"Testing {model}...")
        llm = ChatGoogleGenerativeAI(model=model, google_api_key=key)
        res = llm.invoke("Hi")
        print(f"✅ {model} OK: {res.content}")
        break
    except Exception as e:
        print(f"❌ {model} Failed: {e}")
