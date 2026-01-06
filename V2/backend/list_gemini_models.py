import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
key = os.environ.get("GOOGLE_API_KEY")
genai.configure(api_key=key)

print("Listing models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Model (Chat capable): {m.name}")
        if 'embedContent' in m.supported_generation_methods or 'embedText' in m.supported_generation_methods:
            print(f"Model (Embedding capable): {m.name}")
except Exception as e:
    print(f"Failed to list models: {e}")
