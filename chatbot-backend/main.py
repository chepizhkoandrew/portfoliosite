from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
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

from config import get_settings
from knowledge_base import SYSTEM_PROMPT
from supabase_client import save_message
from message_chunker import chunk_message, should_add_question
from conversation_context import conversation_context
from agents import generate_question
from vector_search import search_knowledge_base

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
        search_results = await search_knowledge_base(chat_request.message, top_k=3)
        
        # Format context from results
        context_parts = []
        for result in search_results:
            section_id = result.get('section_id', 'Unknown')
            content = result.get('content', '')
            context_parts.append(f"[{section_id}]\n{content}")
        
        knowledge_context = "\n\n".join(context_parts) if context_parts else "No specific context found."
        logger.info(f"✅ Context retrieved: {len(knowledge_context)} characters")
        
        # Inject context into system prompt
        system_prompt_with_context = SYSTEM_PROMPT.format(knowledge_context=f"KNOWLEDGE:\n{knowledge_context}")
        
        logger.debug(f"🤖 Initializing Gemini model...")
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
        
        logger.info(f"📤 Sending message to Gemini...")
        response = chat_session.send_message(chat_request.message)
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
        
        model = genai.GenerativeModel(
            'gemini-2.5-flash',
            system_instruction=SYSTEM_PROMPT
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
        
        logger.info(f"Sending message to Gemini...")
        response = chat_session.send_message(chat_request.message)
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

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
