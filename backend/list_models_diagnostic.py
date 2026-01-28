import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("GEMINI_API_KEY NOT FOUND")
    exit(1)

genai.configure(api_key=api_key)

print("Listing ALL available models...")
try:
    models = list(genai.list_models())
    if not models:
        print("NO MODELS RETURNED BY list_models()")
    for m in models:
        print(f"DEBUG_MODEL: {m.name} (Methods: {m.supported_generation_methods})")
except Exception as e:
    print(f"Error listing models: {e}")
