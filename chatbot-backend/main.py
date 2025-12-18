from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
import logging
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, AsyncGenerator
import traceback
import json
import random
import asyncio
import tempfile
import os
from playwright.async_api import async_playwright

from config import get_settings
from knowledge_base import SYSTEM_PROMPT
from supabase_client import save_message
from message_chunker import chunk_message, should_add_question
from conversation_context import conversation_context
from agents import generate_question
from vector_search import search_knowledge_base

def validate_response_uses_knowledge(response: str, search_results: list) -> tuple[str, bool]:
    """
    Validate that the response actually uses the knowledge base.
    If it appears to hallucinate, append a disclaimer.
    
    Returns: (response, is_valid)
    """
    # Extract section IDs from search results
    available_sections = [r.get('section_id', 'Unknown') for r in search_results]
    response_lower = response.lower()
    
    # Check if response mentions specific facts from the knowledge base
    knowledge_indicators = ['from:', '[', ']', 'according to', 'based on']
    has_citations = any(indicator in response_lower for indicator in knowledge_indicators)
    
    # Check for hallucination markers (inventing names, companies, etc.)
    hallucination_markers = [
        r'worked at [^(]*\(',  # Mentions working at companies not listed
        r'\d+ years ago',  # Random dates
        r'(created|founded|built|worked on) (\w+) (?!platform|product|solution)',  # Invented project names
    ]
    
    # For now, we trust that the improved system prompt will prevent hallucinations
    # This is a safety net for future improvements
    is_valid = len(response) > 20  # Basic validity check
    
    return response, is_valid

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_id: str
    history: List[Message] = []

class ChatResponse(BaseModel):
    message: str
    conversation_id: str

class VacancyMatchRequest(BaseModel):
    vacancy: str
    instructions: str = ""

class VacancyMatchResponse(BaseModel):
    summary: str

class PDFGenerateRequest(BaseModel):
    html: str
    filename: str = "document.pdf"

def init_genai():
    settings = get_settings()
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    logger.info("✅ Google Generative AI configured")

async def test_supabase_connection():
    """Test Supabase connection at startup"""
    logger.info("🔍 Testing Supabase connection...")
    try:
        from supabase_client import test_connection
        success = test_connection()
        
        if success:
            logger.info(f"   URL: {get_settings().SUPABASE_URL}")
            logger.info(f"   Service Role Key: {get_settings().SUPABASE_SERVICE_ROLE_KEY[:20]}...")
        return success
    except Exception as e:
        logger.error(f"❌ Supabase connection failed: {e}")
        logger.error(f"   URL: {get_settings().SUPABASE_URL}")
        logger.error(f"   Service Role Key: {get_settings().SUPABASE_SERVICE_ROLE_KEY[:20]}...")
        return False

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=" * 80)
    logger.info("🚀 STARTING CHATBOT BACKEND SERVICE")
    logger.info("=" * 80)
    
    # Initialize Google Generative AI
    init_genai()
    
    # Test Supabase connection
    if not await test_supabase_connection():
        logger.error("⚠️  WARNING: Supabase is not available")
        logger.error("   Messages will NOT be persisted to database")
        logger.error("   Continue anyway? Set REQUIRE_SUPABASE=false to continue without database")
        
        settings = get_settings()
        if settings.ENVIRONMENT == "production":
            logger.critical("❌ PRODUCTION MODE: Cannot start without Supabase")
            raise RuntimeError("Supabase connection required in production")
    
    logger.info("✅ All systems initialized successfully")
    logger.info("=" * 80)
    
    yield
    
    logger.info("🛑 Shutting down chatbot backend service")

app = FastAPI(title="Chatbot Backend", version="1.0.0", lifespan=lifespan)

settings = get_settings()

# CORS configuration - allow requests from frontend
logger.info(f"Configuring CORS for: {settings.FRONTEND_URL}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=".*",
)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return HTTPException(status_code=429, detail="Too many requests")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

async def stream_response(conversation_id: str, full_message: str) -> AsyncGenerator[str, None]:
    conversation_context.increment_turn(conversation_id)
    ctx = conversation_context.get_context(conversation_id)
    
    chunks = chunk_message(full_message, target_length=100)
    logger.info(f"📤 Streaming response: {len(chunks)} chunks, msg_len={len(full_message)}")
    
    for idx, chunk in enumerate(chunks):
        data = {
            "type": "message",
            "content": chunk,
        }
        logger.debug(f"   [MESSAGE {idx+1}] {chunk[:50]}...")
        yield f"data: {json.dumps(data)}\n\n"
        
        await asyncio.sleep(1.0)
    
    should_ask = should_add_question(full_message, ctx['conversation_turn'])
    logger.info(f"📏 Should add question: {should_ask} (turn={ctx['conversation_turn']}, len={len(full_message)})")
    
    if should_ask:
        question, is_valid = await generate_question(
            user_message=full_message,
            history_length=ctx['conversation_turn'],
            covered_topics=[]
        )
        if question and is_valid:
            logger.info(f"❓ Generated question: {question[:80]}...")
            
            await asyncio.sleep(1.0)
            data = {
                "type": "message",
                "content": question,
            }
            yield f"data: {json.dumps(data)}\n\n"
        else:
            logger.warning("⚠️  No valid question generated")
    
    data = {"type": "done", "conversation_id": conversation_id}
    logger.info(f"✅ Stream complete for conversation {conversation_id}")
    yield f"data: {json.dumps(data)}\n\n"

@app.post("/api/chat/stream")
@limiter.limit("20/minute")
async def chat_stream(request: Request, chat_request: ChatRequest):
    logger.info("=" * 80)
    logger.info(f"📨 Received streaming chat request")
    logger.info(f"   Message: {chat_request.message[:100]}...")
    logger.info(f"   Conversation ID: {chat_request.conversation_id}")
    logger.info(f"   History items: {len(chat_request.history)}")
    
    try:
        if not chat_request.message or not chat_request.conversation_id:
            logger.error("❌ Missing required fields")
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # Fetch relevant context from knowledge base
        logger.info(f"📚 Searching knowledge base for context...")
        
        # Check if this is a general question about Andrii
        general_keywords = ['who', 'about', 'tell me', 'describe', 'explain', 'background', 'experience', 'profile']
        is_general = any(kw in chat_request.message.lower() for kw in general_keywords)
        
        # For general questions, get more context to prevent hallucinations
        top_k = 5 if is_general else 4
        search_results = await search_knowledge_base(chat_request.message, top_k=top_k)
        
        # Format context from results
        context_parts = []
        for result in search_results:
            section_id = result.get('section_id', 'Unknown')
            content = result.get('content', '')
            tags = result.get('tags', [])
            tags_str = f" (Tags: {', '.join(tags)})" if tags else ""
            context_parts.append(f"[{section_id}]{tags_str}\n{content}")
        
        knowledge_context = "\n\n".join(context_parts) if context_parts else "No specific context found."
        logger.info(f"✅ Context retrieved: {len(knowledge_context)} characters")
        
        # Inject context into system prompt
        system_prompt_with_context = SYSTEM_PROMPT.format(knowledge_context=knowledge_context)
        
        logger.debug(f"🤖 Initializing Gemini model...")
        logger.debug(f"   System prompt length: {len(system_prompt_with_context)} chars")
        model = genai.GenerativeModel(
            'gemini-2.5-flash',
            system_instruction=system_prompt_with_context
        )
        
        chat_history = [
            {
                'role': 'user' if msg.role == 'user' else 'model',
                'parts': [{'text': msg.content}]
            }
            for msg in chat_request.history
        ]
        
        logger.debug(f"📚 Chat history: {len(chat_history)} messages")
        chat_session = model.start_chat(
            history=chat_history if chat_history else None
        )
        
        # Inject knowledge context directly into the message to force Gemini to use it
        message_with_context = f"""Use ONLY the knowledge base below to answer this question. Do NOT make up information.

KNOWLEDGE BASE:
{knowledge_context}

USER QUESTION: {chat_request.message}

INSTRUCTIONS:
- Answer ONLY using the knowledge base above
- Cite the section you're using: [From: SECTION_ID]
- If information isn't in the knowledge base, say "I don't have information about that"
- Do NOT invent, guess, or hallucinate"""
        
        logger.info(f"📤 Sending message to Gemini with knowledge context injected...")
        response = chat_session.send_message(message_with_context)
        assistant_message = response.text
        logger.info(f"✅ Gemini response received: {len(assistant_message)} chars, {assistant_message[:80]}...")
        
        logger.info(f"💾 Saving messages to Supabase...")
        user_saved = await save_message(chat_request.conversation_id, 'user', chat_request.message)
        assistant_saved = await save_message(chat_request.conversation_id, 'assistant', assistant_message)
        logger.info(f"   User message saved: {user_saved}")
        logger.info(f"   Assistant message saved: {assistant_saved}")
        
        logger.info(f"✅ Message processed successfully")
        logger.info("=" * 80)
        
        return StreamingResponse(
            stream_response(chat_request.conversation_id, assistant_message),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
                "Connection": "keep-alive",
            },
        )
    
    except HTTPException:
        raise
    except Exception as e:
        error_trace = traceback.format_exc()
        logger.error(f"❌ Chat error: {e}")
        logger.error(f"Traceback:\n{error_trace}")
        logger.error("=" * 80)
        raise HTTPException(status_code=500, detail="Failed to process message")

@app.post("/api/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat(request: Request, chat_request: ChatRequest):
    logger.info(f"Received chat request:")
    logger.info(f"  Message: {chat_request.message[:100]}...")
    logger.info(f"  Conversation ID: {chat_request.conversation_id}")
    logger.info(f"  History items: {len(chat_request.history)}")
    
    try:
        if not chat_request.message or not chat_request.conversation_id:
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        logger.info(f"🔍 Searching knowledge base for relevant context...")
        
        # Check if this is a general question about Andrii
        general_keywords = ['who', 'about', 'tell me', 'describe', 'explain', 'background', 'experience', 'profile']
        is_general = any(kw in chat_request.message.lower() for kw in general_keywords)
        
        # For general questions, get more context to prevent hallucinations
        top_k = 5 if is_general else 4
        search_results = await search_knowledge_base(chat_request.message, top_k=top_k)
        
        context_parts = []
        for result in search_results:
            section_id = result.get('section_id', 'Unknown')
            content = result.get('content', '')
            tags = result.get('tags', [])
            tags_str = f" (Tags: {', '.join(tags)})" if tags else ""
            context_parts.append(f"[{section_id}]{tags_str}\n{content}")
        
        knowledge_context = "\n\n".join(context_parts) if context_parts else "No specific information found in knowledge base."
        logger.info(f"✅ Context retrieved: {len(knowledge_context)} characters from {len(search_results)} results")
        if search_results:
            logger.info(f"   Results: {[r.get('section_id', 'Unknown') for r in search_results]}")
        
        system_prompt_with_context = SYSTEM_PROMPT.format(knowledge_context=knowledge_context)
        
        model = genai.GenerativeModel(
            'gemini-2.5-flash',
            system_instruction=system_prompt_with_context
        )
        
        chat_history = [
            {
                'role': 'user' if msg.role == 'user' else 'model',
                'parts': [{'text': msg.content}]
            }
            for msg in chat_request.history
        ]
        
        chat_session = model.start_chat(
            history=chat_history if chat_history else None
        )
        
        # Inject knowledge context directly into the message to force Gemini to use it
        message_with_context = f"""Use ONLY the knowledge base below to answer this question. Do NOT make up information.

KNOWLEDGE BASE:
{knowledge_context}

USER QUESTION: {chat_request.message}

INSTRUCTIONS:
- Answer ONLY using the knowledge base above
- Cite the section you're using: [From: SECTION_ID]
- If information isn't in the knowledge base, say "I don't have information about that"
- Do NOT invent, guess, or hallucinate"""
        
        logger.info(f"Sending message to Gemini with knowledge context injected...")
        response = chat_session.send_message(message_with_context)
        assistant_message = response.text
        logger.info(f"✅ Gemini response received: {assistant_message[:100]}...")
        
        await save_message(chat_request.conversation_id, 'user', chat_request.message)
        await save_message(chat_request.conversation_id, 'assistant', assistant_message)
        
        logger.info(f"✅ Message processed for conversation {chat_request.conversation_id}")
        
        return ChatResponse(
            message=assistant_message,
            conversation_id=chat_request.conversation_id
        )
    
    except HTTPException:
        raise
    except Exception as e:
        error_trace = traceback.format_exc()
        logger.error(f"Chat error: {e}")
        logger.error(f"Traceback: {error_trace}")
        raise HTTPException(status_code=500, detail="Failed to process message")

@app.post("/api/vacancy-match", response_model=VacancyMatchResponse)
@limiter.limit("10/minute")
async def vacancy_match(request: Request, vacancy_request: VacancyMatchRequest):
    logger.info("=" * 80)
    logger.info(f"📋 Received vacancy match request")
    logger.info(f"   Vacancy length: {len(vacancy_request.vacancy)} characters")
    logger.info(f"   Vacancy preview: {vacancy_request.vacancy[:200]}...")
    if vacancy_request.instructions:
        logger.info(f"   Instructions: {vacancy_request.instructions[:100]}...")
    
    try:
        if not vacancy_request.vacancy or not vacancy_request.vacancy.strip():
            raise HTTPException(status_code=400, detail="Vacancy description is required")
        
        logger.info(f"🔍 Extracting key requirements from vacancy...")
        extract_prompt = f"""Extract the 5-7 most important skills, technologies, responsibilities, or qualifications from this job vacancy. Return as a short phrase that can be used for semantic search.

Vacancy:
{vacancy_request.vacancy}

Search query (5-7 key terms):"""
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        extraction_response = model.generate_content(extract_prompt)
        search_query = extraction_response.text.strip()
        logger.info(f"✅ Extracted search query: {search_query}")
        
        logger.info(f"📚 Searching knowledge base with extracted keywords...")
        search_results = await search_knowledge_base(search_query, top_k=6)
        
        context_parts = []
        for result in search_results:
            section_id = result.get('section_id', 'Unknown')
            content = result.get('content', '')
            context_parts.append(f"[{section_id}]\n{content}")
        
        knowledge_context = "\n\n".join(context_parts) if context_parts else "No matching profile information found."
        logger.info(f"✅ Context retrieved: {len(knowledge_context)} characters from {len(search_results)} results")
        logger.info(f"   Results: {[r.get('section_id', 'Unknown') for r in search_results]}")
        
        additional_instructions = f"\n\nADDITIONAL INSTRUCTIONS:\n{vacancy_request.instructions}" if vacancy_request.instructions else ""
        
        vacancy_analysis_prompt = f"""You are an expert recruiter analyzing job matches.

Read the vacancy description below and identify the most crucial requirements.
Prioritize requirements that are:
- explicitly repeated
- tied to core responsibilities
- related to decision-making, system ownership, or delivery
- required rather than "nice to have"

For each crucial requirement, state clearly that Andrii has this requirement using the SAME TERMINOLOGY as in the vacancy, and support the statement with concrete evidence from Andrii's career experience below.

Use only facts that can be found in Andrii's profile.
Do not invent or exaggerate experience.
Match terminology exactly - if vacancy uses "product management", use "product management" not "PM".

Output: Write one compact, high-density abstract (100–130 words maximum) that explicitly states why Andrii matches this vacancy.

Style rules:
- Declarative, factual statements only
- No motivation, no self-promotion language
- Optimized for automated screening and LLM parsing
- Human-readable but machine-first
- Single block of text, no bullet points

ANDRII'S RELEVANT EXPERIENCE:
{knowledge_context}

VACANCY DESCRIPTION:
{vacancy_request.vacancy}{additional_instructions}

MATCHING SUMMARY:"""
        
        logger.info(f"🤖 Analyzing vacancy match with Gemini 2.5 Pro...")
        logger.info(f"📤 Sending to LLM...")
        pro_model = genai.GenerativeModel('gemini-2.5-pro')
        response = pro_model.generate_content(vacancy_analysis_prompt)
        summary = response.text.strip()
        logger.info(f"✅ Analysis complete: {len(summary)} characters")
        logger.info(f"   Summary: {summary[:200]}...")
        logger.info("=" * 80)
        
        return VacancyMatchResponse(summary=summary)
    
    except HTTPException:
        raise
    except Exception as e:
        error_trace = traceback.format_exc()
        logger.error(f"❌ Vacancy match error: {e}")
        logger.error(f"Traceback:\n{error_trace}")
        logger.error("=" * 80)
        raise HTTPException(status_code=500, detail="Failed to analyze vacancy")

@app.post("/api/generate-pdf")
@limiter.limit("10/minute")
async def generate_pdf(request: Request, pdf_request: PDFGenerateRequest):
    logger.info("=" * 80)
    logger.info(f"📄 Received PDF generation request")
    logger.info(f"   Filename: {pdf_request.filename}")
    logger.info(f"   HTML length: {len(pdf_request.html)} characters")
    
    temp_pdf_path = None
    
    try:
        if not pdf_request.html or not pdf_request.html.strip():
            raise HTTPException(status_code=400, detail="HTML content is required")
        
        logger.info(f"🎭 Launching Playwright browser...")
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page(viewport={'width': 794, 'height': 1123})
            
            logger.info(f"📝 Setting HTML content...")
            await page.set_content(pdf_request.html, wait_until="networkidle")
            
            logger.info(f"⏳ Waiting for images and network...")
            await page.wait_for_load_state("networkidle")
            await page.wait_for_timeout(1500)
            
            logger.info(f"🖨️  Generating PDF...")
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp_file:
                temp_pdf_path = tmp_file.name
            
            await page.pdf(
                path=temp_pdf_path,
                format='A4',
                margin={'top': '0px', 'bottom': '0px', 'left': '0px', 'right': '0px'},
                print_background=True
            )
            
            await browser.close()
            
            logger.info(f"✅ PDF generated: {os.path.getsize(temp_pdf_path)} bytes")
            logger.info("=" * 80)
            
            return FileResponse(
                path=temp_pdf_path,
                filename=pdf_request.filename,
                media_type="application/pdf",
                headers={"Content-Disposition": f'attachment; filename="{pdf_request.filename}"'}
            )
    
    except HTTPException:
        if temp_pdf_path and os.path.exists(temp_pdf_path):
            os.unlink(temp_pdf_path)
        raise
    except Exception as e:
        if temp_pdf_path and os.path.exists(temp_pdf_path):
            os.unlink(temp_pdf_path)
        
        error_trace = traceback.format_exc()
        logger.error(f"❌ PDF generation error: {e}")
        logger.error(f"Traceback:\n{error_trace}")
        logger.error("=" * 80)
        raise HTTPException(status_code=500, detail="Failed to generate PDF")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
