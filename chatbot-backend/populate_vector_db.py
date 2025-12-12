#!/usr/bin/env python3
"""
Populate Supabase vector database from knowledge_source.md

This script:
1. Reads knowledge_source.md
2. Splits it into sections
3. Generates embeddings for each section
4. Stores in Supabase with pgvector
"""

import re
import logging
import google.generativeai as genai
import requests
from config import get_settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def parse_knowledge_source(filepath: str) -> list:
    """Parse knowledge_source.md into sections."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    sections = []
    section_pattern = r'## SECTION: (\w+)\s*\n\*\*Type\*\*: (.+?)\n\*\*Tags\*\*: (.+?)\n\n(.*?)(?=## SECTION:|## END|$)'
    
    matches = re.finditer(section_pattern, content, re.DOTALL)
    
    for match in matches:
        section_id = match.group(1)
        section_type = match.group(2)
        tags = match.group(3)
        text = match.group(4).strip()
        
        sections.append({
            'id': section_id,
            'type': section_type,
            'tags': tags.split(', '),
            'content': text,
        })
        
        logger.info(f"✅ Parsed section: {section_id} ({section_type})")
    
    return sections

def generate_embedding(text: str) -> list:
    """Generate embedding for text using Gemini."""
    try:
        result = genai.embed_content(model='models/text-embedding-004', content=text)
        return result['embedding']
    except Exception as e:
        logger.error(f"❌ Failed to generate embedding: {e}")
        return None

def store_in_supabase(sections: list):
    """Store sections with embeddings in Supabase."""
    settings = get_settings()
    
    # First, create the table if it doesn't exist
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS knowledge_base (
        id BIGSERIAL PRIMARY KEY,
        section_id TEXT UNIQUE NOT NULL,
        section_type TEXT NOT NULL,
        tags TEXT[] NOT NULL,
        content TEXT NOT NULL,
        embedding vector(768),
        created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS ON knowledge_base USING ivfflat (embedding vector_cosine_ops);
    """
    
    # Execute create table via RPC or direct SQL
    # For now, assume table exists or use Supabase UI to create it
    
    headers = {
        "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    logger.info(f"📝 Storing {len(sections)} sections in Supabase...")
    
    for section in sections:
        logger.info(f"   Processing {section['id']}...")
        
        # Generate embedding
        embedding = generate_embedding(section['content'])
        if not embedding:
            logger.warning(f"   ⚠️  Skipping {section['id']} - no embedding")
            continue
        
        # Prepare payload
        payload = {
            'section_id': section['id'],
            'section_type': section['type'],
            'tags': section['tags'],
            'content': section['content'],
            'embedding': embedding,
        }
        
        # Try to store - delete and re-insert if conflict
        try:
            response = requests.post(
                f"{settings.SUPABASE_URL}/rest/v1/knowledge_base",
                headers=headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                logger.info(f"   ✅ Stored {section['id']}")
            elif response.status_code == 409:
                # Conflict - delete and re-insert
                logger.debug(f"   ♻️  Updating {section['id']}...")
                delete_response = requests.delete(
                    f"{settings.SUPABASE_URL}/rest/v1/knowledge_base?section_id=eq.{section['id']}",
                    headers=headers,
                    timeout=10
                )
                if delete_response.status_code in [200, 204]:
                    insert_response = requests.post(
                        f"{settings.SUPABASE_URL}/rest/v1/knowledge_base",
                        headers=headers,
                        json=payload,
                        timeout=10
                    )
                    if insert_response.status_code in [200, 201]:
                        logger.info(f"   ✅ Updated {section['id']}")
                    else:
                        logger.error(f"   ❌ Failed to re-insert {section['id']}: {insert_response.status_code}")
            else:
                logger.error(f"   ❌ Failed to store {section['id']}: {response.status_code}")
        except Exception as e:
            logger.error(f"   ❌ Error storing {section['id']}: {e}")

def main():
    """Main function."""
    logger.info("=" * 80)
    logger.info("🚀 POPULATING VECTOR DATABASE")
    logger.info("=" * 80)
    
    # Configure Gemini
    settings = get_settings()
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    
    # Parse knowledge source
    logger.info("📖 Parsing knowledge_source.md...")
    sections = parse_knowledge_source('knowledge_source.md')
    logger.info(f"✅ Parsed {len(sections)} sections")
    
    # Store in Supabase
    store_in_supabase(sections)
    
    logger.info("=" * 80)
    logger.info("✅ Vector database population complete!")
    logger.info("=" * 80)

if __name__ == '__main__':
    main()
