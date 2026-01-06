import os
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()
key = os.environ.get("GOOGLE_API_KEY")

# These were in the list_models() output earlier
models_to_try = [
    "gemini-2.0-flash",
    "models/gemini-2.0-flash",
    "gemini-1.5-flash",
    "models/gemini-1.5-flash",
    "gemini-pro",
    "models/gemini-pro"
]

for model in models_to_try:
    try:
        print(f"Testing {model}...")
        llm = ChatGoogleGenerativeAI(model=model, google_api_key=key)
        res = llm.invoke("Hi")
        print(f"✅ {model} OK: {res.content}")
        # Save working model name to a temp file for me to read
        with open("working_model.txt", "w") as f:
            f.write(model)
        break
    except Exception as e:
        print(f"❌ {model} Failed: {e}")
