# Vector Database Setup Guide

This guide explains how to set up the vector database in Supabase for intelligent knowledge retrieval.

## What is This?

Instead of hardcoding information about Andrii, we store it in a vector database. When agents need context, they search the database and get relevant information automatically.

**Benefits:**
- Single source of truth (edit `knowledge_source.md`)
- Intelligent search (understands meaning, not just keywords)
- Easy to update (no code changes needed)
- Scalable (can add more knowledge anytime)

---

## Step 1: Enable pgvector Extension in Supabase

1. Go to **Supabase Dashboard** → Your project
2. Click **SQL Editor** (left sidebar)
3. Create a new query and paste:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

4. Run the query
5. Verify by running:

```sql
SELECT extname FROM pg_extension WHERE extname = 'vector';
```

---

## Step 2: Create the Knowledge Base Table

In Supabase SQL Editor, run:

```sql
CREATE TABLE IF NOT EXISTS knowledge_base (
  id BIGSERIAL PRIMARY KEY,
  section_id TEXT UNIQUE NOT NULL,
  section_type TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  content TEXT NOT NULL,
  embedding vector(768),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for fast similarity search
CREATE INDEX ON knowledge_base USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create policy for reading (public)
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON knowledge_base
  FOR SELECT USING (true);
```

---

## Step 3: Create the Vector Search RPC Function

In Supabase SQL Editor, run:

```sql
CREATE OR REPLACE FUNCTION search_knowledge(
  query_embedding vector(768),
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id bigint,
  section_id text,
  section_type text,
  tags text[],
  content text,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.section_id,
    kb.section_type,
    kb.tags,
    kb.content,
    (kb.embedding <=> query_embedding) as similarity
  FROM knowledge_base kb
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
```

This function performs vector similarity search.

---

## Step 4: Populate the Knowledge Base

### 4a. Prepare `knowledge_source.md`

Edit `/chatbot-backend/knowledge_source.md`:
- Replace placeholder info with your actual information
- Keep the section format as is
- Add your rates in PRICING section
- Fill in your technical skills
- Add your specific achievements

### 4b. Run the Population Script

```bash
cd /Users/andriichepizhko/Downloads/CVs/chatbot-backend

# First, make sure dependencies are installed
pip install google-generativeai requests

# Run the population script
python3 populate_vector_db.py
```

**What it does:**
- Reads `knowledge_source.md`
- Splits it into sections
- Generates embeddings for each section using Gemini
- Stores them in Supabase with vectors

**Output should look like:**
```
================================================================================
🚀 POPULATING VECTOR DATABASE
================================================================================
📖 Parsing knowledge_source.md...
✅ Parsed 12 sections
📝 Storing 12 sections in Supabase...
   Processing PERSONAL_INFO...
   ✅ Stored PERSONAL_INFO
   Processing CORE_EXPERIENCE...
   ✅ Stored CORE_EXPERIENCE
   ...
================================================================================
✅ Vector database population complete!
================================================================================
```

---

## Step 5: Verify the Data

In Supabase SQL Editor:

```sql
-- Check how many sections are stored
SELECT section_id, section_type, LENGTH(content) as content_length
FROM knowledge_base
ORDER BY created_at;

-- Test a vector search
SELECT section_id, similarity
FROM search_knowledge(
  (SELECT embedding FROM knowledge_base LIMIT 1),
  3
);
```

---

## Step 6: Update the System Prompt

The system prompt is now lighter because agents will fetch context dynamically.

Original system prompt in `knowledge_base.py` can be simplified to focus on communication style.

---

## How It Works During Conversations

1. **User asks a question**
2. **Main agent (Gemini)** generates a response
3. **Vector search** finds relevant knowledge sections
4. **Context injected** into agent prompts
5. **Question generator** uses knowledge + communication style
6. **Validator agent** checks quality

```
User Question
    ↓
Main Agent (with vector context)
    ↓
Vector Search (find relevant knowledge)
    ↓
Question Generator (with style guide)
    ↓
Validator Agent
    ↓
Response to User
```

---

## Updating the Knowledge Base

To update information:

1. Edit `knowledge_source.md`
2. Save the file
3. Run `python3 populate_vector_db.py` again
4. That's it! No code changes needed.

Example: Want to add a new product?
- Edit the `PRODUCTS_BUILT` section in `knowledge_source.md`
- Run the populate script
- Done!

---

## Troubleshooting

### Error: "Cannot create extension vector"
**Solution:** You might not have proper permissions. Ask Supabase support to enable pgvector on your database.

### Error: "RPC function not found"
**Solution:** Make sure you ran the SQL to create the `search_knowledge` function.

### Error: "Embedding generation failed"
**Solution:** Check that your `GOOGLE_API_KEY` is valid and has access to the embedding model.

### Vector search returns no results
**Solution:** The knowledge base might not be populated. Run `python3 populate_vector_db.py` again.

---

## File Structure

```
chatbot-backend/
├── knowledge_source.md          # YOUR CONTENT (edit this)
├── populate_vector_db.py        # Populate script (run this)
├── vector_search.py             # Search functionality (used by agents)
├── agents.py                    # Agent logic (updated to use vectors)
└── main.py                      # Main API (updated to use vectors)
```

---

## Next Steps

1. ✅ Enable pgvector in Supabase
2. ✅ Create the knowledge_base table
3. ✅ Create the search_knowledge RPC function
4. ✅ Edit knowledge_source.md with your information
5. ✅ Run populate_vector_db.py
6. ✅ Verify data in Supabase
7. ✅ Update agents.py to use vector_search
8. ✅ Test the system

---

## Example Usage in Code

```python
from vector_search import get_context_for_agents, get_about_andrii

# Get relevant context for a query
context = await get_context_for_agents("product strategy experience")

# Get specific contexts
about = await get_about_andrii()
style = await get_communication_style()

# Use in agent prompts
prompt = f"""
Based on this context: {context}

Generate a response...
"""
```

---

## Cost Considerations

- Supabase pgvector: Included in all plans
- Gemini embeddings: First 15,000 requests/month free
- Vector search: No additional cost (just database queries)

---

Questions? Review the code in `vector_search.py` and `populate_vector_db.py`.
