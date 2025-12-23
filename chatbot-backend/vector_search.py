"""Vector search functionality for the knowledge base."""

import google.generativeai as genai
import requests
import logging
from config import get_settings
from typing import List, Dict
import json

logger = logging.getLogger(__name__)

async def search_knowledge_base(query: str, top_k: int = 3) -> List[Dict]:
    """Search knowledge base using vector similarity and hybrid ranking.
    
    Args:
        query: Search query (can be a question or keywords)
        top_k: Number of top results to return
        
    Returns:
        List of relevant knowledge base sections with content, ranked by relevance
    """
    try:
        settings = get_settings()
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        
        logger.info(f"🔍 Searching knowledge base for: {query[:60]}...")
        
        # Generate embedding for the query
        logger.debug("   Generating query embedding...")
        query_embedding = genai.embed_content(
            model='models/text-embedding-004', 
            content=query
        )['embedding']
        
        # First try: Use Supabase pgvector search (RPC function)
        headers = {
            "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json"
        }
        
        # Fetch all records for hybrid re-ranking
        logger.debug("   Fetching all knowledge base records for hybrid search...")
        response = requests.get(
            f"{settings.SUPABASE_URL}/rest/v1/knowledge_base?select=section_id,section_type,tags,content,embedding",
            headers=headers,
            timeout=10
        )
        
        if response.status_code != 200:
            logger.error(f"❌ Fetch failed: {response.status_code}")
            # Return empty results - search failed
            return []
        
        all_records = response.json()
        logger.debug(f"   Retrieved {len(all_records)} total records from knowledge base")
        
        # Calculate hybrid relevance scores
        scores = []
        
        for record in all_records:
            section_id = record.get('section_id', 'Unknown')
            content = record.get('content', '').lower()
            tags = record.get('tags', [])
            query_lower = query.lower()
            
            # Initialize score
            score = 0.0
            
            # 1. VECTOR SIMILARITY (40% weight)
            try:
                if record.get('embedding'):
                    # Simple cosine similarity calculation
                    embedding = record.get('embedding', [])
                    if isinstance(embedding, list) and len(embedding) > 0:
                        dot_product = sum(a*b for a, b in zip(query_embedding, embedding))
                        vector_score = max(0, min(1, (dot_product + 1) / 2))  # Normalize to 0-1
                        score += vector_score * 40.0
                        logger.debug(f"   {section_id}: vector_similarity={vector_score:.2f}")
            except Exception as e:
                logger.debug(f"   Could not calculate vector similarity for {section_id}: {e}")
            
            # 2. TAG MATCHING (35% weight)
            tags_lower = [t.lower() for t in tags]
            tags_normalized = [t.replace('-', ' ') for t in tags_lower]
            
            tag_score = 0.0
            for tag, tag_norm in zip(tags_lower, tags_normalized):
                if tag in query_lower or query_lower in tag:
                    tag_score += 10.0
                elif tag_norm in query_lower or query_lower in tag_norm:
                    tag_score += 8.0
                else:
                    for word in tag_norm.split():
                        if word in query_lower and len(word) > 2:
                            tag_score += 3.0
            
            # Cap tag score at 35
            score += min(35.0, tag_score)
            
            # 3. SECTION ID MATCHING (15% weight)
            query_normalized = query_lower.replace(' ', '_').replace("'s", '')
            if query_normalized in section_id.lower() or section_id.lower() in query_normalized:
                score += 15.0
            
            # 4. KEYWORD MATCHING IN CONTENT (10% weight)
            keywords = [w for w in query_lower.split() if len(w) > 3]
            keyword_matches = sum(1 for kw in keywords if kw in content)
            keyword_score = min(10.0, keyword_matches * 2.0)
            score += keyword_score
            
            scores.append({
                'record': record,
                'score': score,
                'section_id': section_id
            })
        
        # Sort by score and return top_k
        scores.sort(key=lambda x: x['score'], reverse=True)
        
        logger.info(f"✅ Top {top_k} results:")
        results = []
        for i, item in enumerate(scores[:top_k]):
            results.append(item['record'])
            logger.info(f"   {i+1}. {item['section_id']} (score: {item['score']:.1f})")
        
        return results
            
    except Exception as e:
        logger.error(f"❌ Vector search failed: {e}", exc_info=True)
        return []

async def get_context_for_agents(query: str, context_type: str = None) -> str:
    """Get relevant context from knowledge base for agents.
    
    Args:
        query: What to search for
        context_type: Optional - filter by section type (e.g., 'Communication Style')
        
    Returns:
        Formatted context string for use in agent prompts
    """
    results = await search_knowledge_base(query, top_k=4)
    
    if not results:
        return ""
    
    # Format results into a context string
    context_parts = []
    for result in results:
        content = result.get('content', '')
        context_parts.append(content)
    
    return "\n\n".join(context_parts)

async def get_full_context() -> str:
    """Get all knowledge base content for comprehensive context.
    
    Used when we need maximum context to prevent hallucinations.
    """
    results = await search_knowledge_base("", top_k=16)  # Get all sections
    
    if not results:
        return ""
    
    # Format all results into a comprehensive context string
    context_parts = []
    for result in results:
        content = result.get('content', '')
        context_parts.append(content)
    
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
