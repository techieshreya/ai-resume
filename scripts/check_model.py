import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load your .env file
load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ Error: No GOOGLE_API_KEY found in .env")
    exit()

# Configure the library
genai.configure(api_key=api_key)

print("🔍 Connecting to Google to list available models...")

try:
    found_any = False
    for m in genai.list_models():
        # We only care about models that can generate text (content)
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ AVAILABLE: {m.name}")
            found_any = True
    
    if not found_any:
        print("⚠️ Connected, but no text-generation models were found for this API key.")
        
except Exception as e:
    print(f"❌ Connection Error: {e}")