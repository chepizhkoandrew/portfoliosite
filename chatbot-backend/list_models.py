#!/usr/bin/env python3
"""List available Gemini models"""

import google.generativeai as genai
from config import get_settings

print("=" * 70)
print("AVAILABLE GEMINI MODELS")
print("=" * 70)

settings = get_settings()
genai.configure(api_key=settings.GOOGLE_API_KEY)

try:
    models = genai.list_models()
    print(f"\n✅ Found {len(list(models))} models\n")
    
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    models = genai.list_models()
    
    for model in models:
        print(f"Model: {model.name}")
        print(f"  Display Name: {model.display_name}")
        print(f"  Capabilities: {model.supported_generation_methods}")
        print()
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
