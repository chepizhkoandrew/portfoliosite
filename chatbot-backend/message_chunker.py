import re
from typing import List
from enum import Enum

class ChunkType(Enum):
    PARAGRAPH = "paragraph"
    SENTENCE = "sentence"
    CLAUSE = "clause"

def chunk_message(text: str, target_length: int = 150) -> List[str]:
    chunks = []
    text = text.strip()
    
    if len(text) <= target_length:
        return [text]
    
    paragraphs = text.split('\n\n')
    
    for paragraph in paragraphs:
        if len(paragraph) <= target_length:
            chunks.append(paragraph)
        else:
            sentences = re.split(r'(?<=[.!?])\s+', paragraph)
            current_chunk = ""
            
            for sentence in sentences:
                if len(current_chunk) + len(sentence) + 1 <= target_length:
                    current_chunk += sentence + " " if current_chunk else sentence + " "
                else:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                    current_chunk = sentence + " "
            
            if current_chunk:
                chunks.append(current_chunk.strip())
    
    return [chunk.strip() for chunk in chunks if chunk.strip()]


def should_add_question(message: str, conversation_length: int) -> bool:
    is_long_enough = len(message) > 200
    not_too_early = conversation_length >= 1
    
    return is_long_enough and not_too_early


def generate_contextual_question(user_messages: List[str], conversation_context: dict) -> tuple:
    question_pool = {}
    
    if not conversation_context.get('asked_about_intent'):
        question_pool['intent'] = [
            "Quick question - are you here because you want to **build something**, **need help with your team**, or just **exploring**?",
            "What's your angle? **Hiring for a project**, **want advice**, or **just curious**?",
            "So what brings you - **looking to collaborate**, **need a consultant**, or **just browsing**?",
        ]
    
    if not conversation_context.get('asked_about_skills'):
        question_pool['skills'] = [
            "Interested in learning more about **product strategy**, **system design**, or **team scaling**?",
            "Want to dig into **his tech stack**, **how he ships fast**, or **managing chaos**?",
            "Curious about **how products actually get built**, **making teams efficient**, or **tech strategy**?",
        ]
    
    if not conversation_context.get('asked_about_contact'):
        question_pool['contact'] = [
            "Want to **reach out directly** or **see his work**? (LinkedIn, email, WhatsApp - whatever works)",
            "Ready to **talk to him directly** or need more info first?",
            "Should I hook you up with **his contact info** or keep asking questions?",
        ]
    
    if conversation_context.get('conversation_turn', 0) > 3 and not conversation_context.get('asked_personal'):
        question_pool['personal'] = [
            "By the way - what do **you** actually do? What's your thing?",
            "Tell me about you - what's your deal? What brings you here?",
            "Alright, enough about Andrii - **what are you working on**? What's the real story?",
        ]
    
    if question_pool:
        import random
        question_type = random.choice(list(question_pool.keys()))
        question = random.choice(question_pool[question_type])
        return (question, question_type)
    
    return ("", "")
