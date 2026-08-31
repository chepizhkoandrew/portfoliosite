import requests
import json
from config import get_settings
import logging

logger = logging.getLogger(__name__)

def _get_headers() -> dict:
    """Get headers for Supabase REST API requests"""
    settings = get_settings()
    return {
        "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }

def test_connection() -> bool:
    """Test if Supabase connection works"""
    try:
        settings = get_settings()
        response = requests.get(
            f"{settings.SUPABASE_URL}/rest/v1/chatbot_messages?select=id&limit=1",
            headers=_get_headers(),
            timeout=5
        )
        success = response.status_code == 200
        if success:
            logger.info("✅ Supabase REST API connection successful")
        else:
            logger.error(f"❌ Supabase REST API returned status {response.status_code}")
        return success
    except Exception as e:
        logger.error(f"❌ Supabase connection test failed: {e}")
        return False

async def save_message(conversation_id: str, role: str, content: str) -> bool:
    try:
        settings = get_settings()
        
        logger.debug(f"📝 Saving {role} message ({len(content)} chars)...")
        
        payload = {
            'conversation_id': conversation_id,
            'role': role,
            'content': content,
        }
        
        response = requests.post(
            f"{settings.SUPABASE_URL}/rest/v1/chatbot_messages",
            headers=_get_headers(),
            json=payload,
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            logger.info(f"✅ Message saved: {role} in conversation {conversation_id}")
            return True
        else:
            logger.error(f"❌ Supabase insert failed with status {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"❌ Failed to save {role} message: {e}", exc_info=True)
        return False

async def save_contact_request(
    conversation_id: str,
    request_type: str,
    message: str,
    visitor_name: str = None,
    contact_method: str = None,
    contact_value: str = None,
    company: str = None,
) -> bool:
    """Save a structured lead/contact event (visitor wants to connect or
    schedule a meeting) so Andrii can follow up. Separate from the raw
    chat transcript in chatbot_messages."""
    try:
        settings = get_settings()

        payload = {
            'conversation_id': conversation_id,
            'request_type': request_type,
            'message': message,
            'visitor_name': visitor_name,
            'contact_method': contact_method,
            'contact_value': contact_value,
            'company': company,
        }

        logger.info(f"📇 Saving contact request ({request_type}) for conversation {conversation_id}...")

        response = requests.post(
            f"{settings.SUPABASE_URL}/rest/v1/contact_requests",
            headers=_get_headers(),
            json=payload,
            timeout=10
        )

        if response.status_code in [200, 201]:
            logger.info(f"✅ Contact request saved: {request_type}")
            return True
        else:
            logger.error(f"❌ Contact request insert failed with status {response.status_code}: {response.text}")
            return False

    except Exception as e:
        logger.error(f"❌ Failed to save contact request: {e}", exc_info=True)
        return False

async def get_conversation_history(conversation_id: str) -> list:
    try:
        supabase = get_supabase()
        response = supabase.table('chatbot_messages').select('*').eq(
            'conversation_id', conversation_id
        ).order('created_at', desc=False).execute()
        return response.data if response.data else []
    except Exception as e:
        logger.error(f"Failed to retrieve conversation history: {e}")
        return []
