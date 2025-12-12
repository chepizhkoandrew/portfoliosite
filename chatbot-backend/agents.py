import google.generativeai as genai
import json
import logging
from config import get_settings
from typing import Tuple
from vector_search import search_knowledge_base

logger = logging.getLogger(__name__)

QUESTION_GENERATOR_PROMPT = """You are a question generation agent. Your job is to generate ONE contextual follow-up question based on the conversation and Andrii's knowledge.

RULES:
1. Keep it SHORT - one sentence max
2. Make it DIRECT and CONVERSATIONAL - no corporate speak
3. Offer 2-3 clear options with bold formatting: "Want **option1**, **option2**, or **option3**?"
4. Be FUNNY and NATURAL - like talking to a friend
5. Don't be patronizing or over-explain
6. Use actual knowledge about Andrii from the context

CONTEXT ABOUT ANDRII:
{knowledge_context}

CONVERSATION CONTEXT:
- User's previous message: {user_message}
- Conversation history length: {history_length}

Generate ONE question that naturally flows from the conversation and what Andrii does. Return ONLY the question, nothing else."""

VALIDATOR_PROMPT = """You are a validation agent. Your job is to check if a follow-up question is appropriate.

CHECK:
1. Is it SHORT? (max 150 chars) - yes/no
2. Is it CONVERSATIONAL? (no jargon/corporate BS) - yes/no
3. Does it offer CLEAR OPTIONS? (uses bold formatting) - yes/no
4. Is it NATURAL? (sounds like a real person) - yes/no
5. Is it RELEVANT? (follows from conversation) - yes/no

QUESTION TO VALIDATE: {question}

Return JSON: {{"valid": true/false, "feedback": "reason if invalid"}}"""


async def generate_question(
    user_message: str,
    history_length: int,
    covered_topics: list,
) -> Tuple[str, bool]:
    """Generate a contextual follow-up question using an agent.
    
    Returns (question, is_valid)
    """
    try:
        settings = get_settings()
        
        # Fetch context from knowledge base
        logger.debug("📚 Fetching context for question generation...")
        search_results = await search_knowledge_base(user_message, top_k=2)
        
        # Format context
        context_parts = []
        for result in search_results:
            section_id = result.get('section_id', 'Unknown')
            content = result.get('content', '')
            context_parts.append(f"[{section_id}]\n{content[:300]}...")
        
        knowledge_context = "\n\n".join(context_parts) if context_parts else "General information about Andrii's experience and skills."
        logger.debug(f"   Context: {len(knowledge_context)} chars")
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = QUESTION_GENERATOR_PROMPT.format(
            knowledge_context=knowledge_context,
            user_message=user_message[:200],
            history_length=history_length,
        )
        
        logger.debug("📝 Generating question with agent...")
        response = model.generate_content(prompt)
        generated_question = response.text.strip()
        
        logger.debug(f"   Generated: {generated_question[:80]}...")
        
        # Validate the question
        is_valid = await validate_question(generated_question)
        
        if not is_valid:
            logger.warning("⚠️  Generated question failed validation, using fallback")
            return ("", False)
        
        return (generated_question, True)
        
    except Exception as e:
        logger.error(f"❌ Question generation failed: {e}")
        return ("", False)


async def validate_question(question: str) -> bool:
    """Validate a question using the validator agent."""
    try:
        settings = get_settings()
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = VALIDATOR_PROMPT.format(question=question)
        
        logger.debug("✅ Validating question with agent...")
        response = model.generate_content(prompt)
        
        try:
            result = json.loads(response.text)
            is_valid = result.get('valid', False)
            feedback = result.get('feedback', '')
            
            if is_valid:
                logger.debug("   Question passed validation")
            else:
                logger.debug(f"   Validation failed: {feedback}")
            
            return is_valid
        except json.JSONDecodeError:
            logger.warning("⚠️  Validator returned invalid JSON")
            return False
            
    except Exception as e:
        logger.error(f"❌ Question validation failed: {e}")
        return False
