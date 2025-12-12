"""Vector search functionality for the knowledge base."""

import google.generativeai as genai
import requests
import logging
from config import get_settings
from typing import List, Dict

logger = logging.getLogger(__name__)

async def search_knowledge_base(query: str, top_k: int = 3) -> List[Dict]:
    """Search knowledge base using vector similarity.
    
    Args:
        query: Search query (can be a question or keywords)
        top_k: Number of top results to return
        
    Returns:
        List of relevant knowledge base sections with content
    """
    try:
        settings = get_settings()
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        
        # Generate embedding for the query
        logger.debug(f"🔍 Searching knowledge base: {query[:50]}...")
        query_embedding = genai.embed_content(model='models/text-embedding-004', content=query)['embedding']
        
        # Search in Supabase using vector similarity
        headers = {
            "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json"
        }
        
        # Fetch all records for comprehensive hybrid re-ranking
        logger.debug("   Fetching all records for hybrid search...")
        response = requests.get(
            f"{settings.SUPABASE_URL}/rest/v1/knowledge_base?select=section_id,section_type,tags,content",
            headers=headers,
            timeout=10
        )
        
        if response.status_code != 200:
            logger.error(f"   Fetch failed: {response.status_code}")
            return []
        
        all_records = response.json()
        
        scores = []
        for record in all_records:
            content = record.get('content', '').lower()
            tags = record.get('tags', [])
            section_id = record.get('section_id', '').lower()
            query_lower = query.lower()
            
            # Start with vector similarity score if available
            score = record.get('similarity', 0.5)
            
            # Strong boost: tag match (handle hyphens)
            tags_lower = [t.lower() for t in tags]
            tags_normalized = [t.replace('-', ' ') for t in tags_lower]
            for tag, tag_norm in zip(tags_lower, tags_normalized):
                # Exact match
                if tag in query_lower or query_lower in tag:
                    score += 5.0
                # Normalized match (handle hyphens)
                elif tag_norm in query_lower or query_lower in tag_norm:
                    score += 5.0
                # Partial match on words
                for word in tag_norm.split():
                    if word in query_lower and len(word) > 2:
                        score += 3.0
            
            # Strong boost: section ID match
            query_normalized = query_lower.replace(' ', '_').replace("'s", '')
            if query_normalized in section_id or section_id in query_normalized:
                score += 3.0
            
            # Medium boost: keyword matching in content
            keywords = [w for w in query_lower.split() if len(w) > 3]
            matches = sum(1 for kw in keywords if kw in content)
            score += matches * 0.5
            
            # Small boost: keyword match in tags
            for tag in tags_normalized:
                for keyword in keywords:
                    if keyword in tag and len(keyword) > 3:
                        score += 2.0
            
            scores.append((record, score))
        
        # Sort by score and return top_k
        scores.sort(key=lambda x: x[1], reverse=True)
        results = [item[0] for item in scores[:top_k]]
        logger.debug(f"   Final results: {len(results)} items")
        return results
            
    except Exception as e:
        logger.error(f"❌ Vector search failed: {e}")
        return []

async def get_context_for_agents(query: str, context_type: str = None) -> str:
    """Get relevant context from knowledge base for agents.
    
    Args:
        query: What to search for
        context_type: Optional - filter by section type (e.g., 'Communication Style')
        
    Returns:
        Formatted context string for use in agent prompts
    """
    results = await search_knowledge_base(query, top_k=3)
    
    if not results:
        return ""
    
    # Format results into a context string
    context_parts = []
    for result in results:
        section = result.get('section_id', 'Unknown')
        content = result.get('content', '')
        context_parts.append(f"[{section}]\n{content}")
    
    return "\n\n".join(context_parts)

async def get_communication_style() -> str:
    """Get Andrii's communication style from knowledge base."""
    return await get_context_for_agents("communication style tone voice", "Personal Style")

async def get_experience_context(topic: str) -> str:
    """Get experience context for a specific topic."""
    return await get_context_for_agents(f"experience {topic}")

async def get_about_andrii() -> str:
    """Get basic information about Andrii."""
    return await get_context_for_agents("who is Andrii about experience background")
