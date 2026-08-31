"""
Gemini function-calling tool that lets the assistant capture a structured
lead when a visitor asks to connect with Andrii or requests a meeting,
instead of just describing the request in prose and forgetting it.
"""
import logging

from supabase_client import save_contact_request

logger = logging.getLogger(__name__)

SAVE_CONTACT_REQUEST_TOOL = {
    "function_declarations": [
        {
            "name": "save_contact_request",
            "description": (
                "Record that a visitor wants to connect with Andrii or schedule a "
                "meeting/call. Call this whenever someone asks to be put in touch "
                "with Andrii, leaves their name/email/contact info, or wants to set "
                "up a call - don't just say you'll pass it along, actually call this "
                "tool so it gets recorded for him to follow up on."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "request_type": {
                        "type": "string",
                        "enum": ["message", "meeting"],
                        "description": "'message' for a general contact/connect request, 'meeting' if they specifically want to schedule a call or meeting.",
                    },
                    "visitor_name": {
                        "type": "string",
                        "description": "The visitor's name, if they gave one.",
                    },
                    "contact_method": {
                        "type": "string",
                        "description": "How they want to be reached, e.g. 'email', 'phone', 'linkedin', 'whatsapp', 'telegram'.",
                    },
                    "contact_value": {
                        "type": "string",
                        "description": "The actual contact detail (email address, phone number, handle).",
                    },
                    "company": {
                        "type": "string",
                        "description": "Their company or organization, if mentioned.",
                    },
                    "message": {
                        "type": "string",
                        "description": "A concise summary of what they want - why they're reaching out, what they asked about, any preferred meeting time. For recruiters/clients, include the essence of the vacancy or project: the role's main goal, key requirements, and anything else Andrii needs to reply well. Always required, even if brief.",
                    },
                },
                "required": ["request_type", "message"],
            },
        }
    ]
}


async def execute_save_contact_request(conversation_id: str, args: dict) -> bool:
    """Execute the tool call: persist the lead. Returns whether it saved."""
    return await save_contact_request(
        conversation_id=conversation_id,
        request_type=args.get('request_type', 'message'),
        message=args.get('message', ''),
        visitor_name=args.get('visitor_name'),
        contact_method=args.get('contact_method'),
        contact_value=args.get('contact_value'),
        company=args.get('company'),
    )
