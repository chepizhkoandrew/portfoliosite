from typing import List, Dict
from datetime import datetime

class ConversationContext:
    def __init__(self):
        self.contexts: Dict[str, Dict] = {}
    
    def get_context(self, conversation_id: str) -> Dict:
        if conversation_id not in self.contexts:
            self.contexts[conversation_id] = {
                'conversation_turn': 0,
                'asked_about_intent': False,
                'asked_about_skills': False,
                'asked_about_contact': False,
                'asked_personal': False,
                'started_at': datetime.now(),
                'messages_count': 0,
            }
        return self.contexts[conversation_id]
    
    def update_context(self, conversation_id: str, key: str, value: any):
        context = self.get_context(conversation_id)
        context[key] = value
    
    def increment_turn(self, conversation_id: str):
        context = self.get_context(conversation_id)
        context['conversation_turn'] += 1
        context['messages_count'] += 1
    
    def mark_question_asked(self, conversation_id: str, question_type: str):
        context = self.get_context(conversation_id)
        key = f'asked_about_{question_type}'
        if key in context:
            context[key] = True
    
    def get_tracked_context(self, conversation_id: str) -> Dict:
        return self.get_context(conversation_id).copy()

conversation_context = ConversationContext()
