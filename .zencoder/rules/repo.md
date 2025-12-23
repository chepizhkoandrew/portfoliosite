---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary

This is a multi-project monorepo containing an interactive CV portfolio application and a chatbot backend service. The **cv-portfolio** is a modern Next.js frontend showcasing career experiences with animated visualizations, while **chatbot-backend** is a FastAPI service providing AI-powered chat capabilities with Gemini integration and Supabase database support.

## Repository Structure

```
CVs/
├── cv-portfolio/          # Next.js 16 frontend application
│   ├── app/               # Application layout and pages
│   ├── components/        # React components (HelicopterView)
│   ├── data/              # Career experience data
│   ├── public/            # Static assets
│   └── lib/               # Utility functions
├── chatbot-backend/       # Python FastAPI backend service
│   ├── main.py            # FastAPI application entry point
│   ├── agents.py          # AI agent implementation
│   ├── vector_search.py   # Knowledge base search
│   └── config.py          # Configuration management
├── casino/                # PDF CV files
└── docs/                  # Documentation (DEPLOYMENT.md, CHATBOT_SETUP.md, etc.)
```

### Main Repository Components
- **cv-portfolio**: Interactive Next.js portfolio with animated career timeline
- **chatbot-backend**: FastAPI-based AI chatbot service with Gemini integration
- **Documentation**: Setup guides, deployment instructions, and architecture docs

---

## Project 1: cv-portfolio (Frontend)

**Configuration File**: `cv-portfolio/package.json`

### Language & Runtime
**Language**: TypeScript / JavaScript (JSX)  
**Node.js Version**: 18+  
**Framework**: Next.js 16.0.7  
**Runtime**: Node.js (development and production)  
**Package Manager**: npm

### Dependencies

**Main Dependencies**:
- `next` 16.0.7 - React framework with Turbopack
- `react` 19.2.1 - UI library
- `react-dom` 19.2.1 - React DOM binding
- `framer-motion` 12.23.25 - Animation library
- `tailwindcss` 4.1.17 - Utility-first CSS framework
- `@google/generative-ai` 0.24.1 - Google Generative AI client
- `@supabase/supabase-js` 2.87.1 - Supabase client
- `html2pdf.js` 0.10.1 - PDF generation
- `pdf-lib` 1.17.1 - PDF manipulation
- `react-icons` 5.5.0 - Icon library

**Development Dependencies**:
- `typescript` 5.9.3 - Type checking
- `@tailwindcss/postcss` 4.1.17 - Tailwind CSS PostCSS plugin
- `@types/react` 19.2.7, `@types/react-dom` 19.2.3 - Type definitions
- `postcss` 8.5.6 - CSS processor
- `autoprefixer` 10.4.22 - PostCSS autoprefixer

### Build & Installation

```bash
cd cv-portfolio
npm install
npm run dev        # Development server on http://localhost:3000
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint check
```

### Main Entry Points & Configuration
- **Entry Point**: `app/page.tsx` - Main page component
- **Layout**: `app/layout.tsx` - Root layout
- **Main Component**: `components/HelicopterView.tsx` - Interactive visualization
- **Data**: `data/experience.ts` - Career experience data structure
- **Config**: `next.config.js` - Next.js configuration with Turbopack
- **TypeScript Config**: `tsconfig.json` - ES2020 target with strict mode
- **Environment Variables**: `.env.local` references `NEXT_PUBLIC_BACKEND_URL`

---

## Project 2: chatbot-backend (Python FastAPI)

**Configuration File**: `chatbot-backend/requirements.txt`

### Language & Runtime
**Language**: Python  
**Python Version**: 3.12 (specified in Dockerfile)  
**Framework**: FastAPI 0.115.0  
**ASGI Server**: Uvicorn 0.31.0  
**Package Manager**: pip

### Dependencies

**Core Dependencies**:
- `fastapi` 0.115.0 - Web framework
- `uvicorn` 0.31.0 - ASGI server
- `google-generativeai` 0.8.5 - Google Gemini API integration
- `supabase` 2.4.4 - Supabase client for database
- `pydantic` 2.10.0 - Data validation
- `pydantic-settings` 2.5.0 - Settings management
- `python-dotenv` 1.0.1 - Environment variable management
- `python-multipart` 0.0.6 - Multipart form support
- `slowapi` 0.1.9 - Rate limiting
- `playwright` 1.57.0 - Browser automation

### Build & Installation

```bash
cd chatbot-backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py            # Development server on http://localhost:8000
```

**Production**:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker

**Dockerfile**: `chatbot-backend/Dockerfile`
**Base Image**: `python:3.12-slim`
**Exposed Port**: 8000
**Entry Point**: `python main.py`

**Build & Run**:
```bash
docker build -t chatbot-backend .
docker run -p 8000:8000 --env-file .env chatbot-backend
```

### Main Entry Points & Configuration
- **Entry Point**: `main.py` - FastAPI application with endpoints for `/health`, `/api/chat`, and file serving
- **Configuration**: `config.py` - Pydantic settings for `GOOGLE_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`, `ENVIRONMENT`, `LOG_LEVEL`
- **Knowledge Base**: `knowledge_base.py`, `vector_search.py` - RAG system with vector search
- **Chat Agent**: `agents.py` - AI agent for question generation
- **Supabase Client**: `supabase_client.py` - Message storage
- **Environment File**: `.env` (example: `.env.example`)

### API Endpoints
- **Health Check**: `GET /health`
- **Chat**: `POST /api/chat` - Rate limited (20 req/min per IP), supports streaming responses
- **Rate Limiting**: slowapi middleware with `RateLimitExceeded` handler

### Testing
**Test Script**: `chatbot-backend/test_sse_endpoint.sh` - Tests Server-Sent Events endpoint

---

## Integration

Both projects are configured to work together:
- **Frontend URL** (cv-portfolio): `http://localhost:3000`
- **Backend URL** (chatbot-backend): `http://localhost:8000`
- **CORS**: Backend configured to accept requests from `FRONTEND_URL`
- **Shared Services**: Both use Supabase for data persistence and Google Generative AI for AI features

