import requests
from config import get_settings

settings = get_settings()
headers = {
    "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
    "Content-Type": "application/json"
}

# Check how many records exist
response = requests.get(
    f"{settings.SUPABASE_URL}/rest/v1/knowledge_base?select=section_id",
    headers=headers,
    timeout=10
)

if response.status_code == 200:
    data = response.json()
    print(f"✅ Knowledge base has {len(data)} sections:")
    for item in data:
        print(f"  - {item['section_id']}")
else:
    print(f"❌ Error: {response.status_code}")
    print(response.text)
