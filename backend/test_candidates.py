import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

candidates = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-1.5-flash-8b',
]

print("Testing candidates...")
for model_name in candidates:
    try:
        m = genai.GenerativeModel(model_name)
        # Try a very simple call
        response = m.generate_content("test")
        print(f"SUCCESS: {model_name}")
    except Exception as e:
        print(f"FAILED: {model_name} - {e}")

print("\nListing all supported models for generateContent:")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Available: {m.name}")
except Exception as e:
    print(f"List failed: {e}")
