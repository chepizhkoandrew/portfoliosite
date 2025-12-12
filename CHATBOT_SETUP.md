# Chatbot Setup & Running Guide

## Architecture Overview

```
Frontend (Next.js) → Backend (FastAPI) → Gemini API
    :3000              :8000
```

## Prerequisites

You need **2 services running**:

1. **Backend Service** (Python FastAPI) - Must be running for chatbot to work
2. **Frontend Service** (Next.js) - The website itself

---

## Terminal 1: Start Backend

```bash
cd /Users/andriichepizhko/Downloads/CVs/chatbot-backend
source venv/bin/activate
python main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**Test it:**
```bash
curl http://localhost:8000/health
# Response: {"status":"ok"}
```

---

## Terminal 2: Start Frontend

```bash
cd /Users/andriichepizhko/Downloads/CVs/cv-portfolio
npm run dev
```

**Expected output:**
```
▲ Next.js 16.0.7
✓ Ready in 2.5s
```

Open browser: `http://localhost:3000`

---

## Common Issues

### ❌ "<!DOCTYPE" error in console
**Cause:** Backend is not running or not responding

**Fix:** Make sure backend is running in Terminal 1
```bash
cd chatbot-backend && source venv/bin/activate && python main.py
```

### ❌ "Cannot reach backend" message in chat
**Cause:** Frontend can't connect to backend

**Check:**
1. Is backend running? (Terminal 1)
2. Is backend URL correct? Check `.env.local`:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

### ❌ Chatbot responds but messages aren't saved to Supabase
**Cause:** Supabase service role key is invalid

**Status:** ⚠️ This is expected - provide correct key to enable persistence
- Get key from: Supabase Dashboard → Settings → API → Service Role Key
- Update: `/chatbot-backend/.env`
  ```
  SUPABASE_SERVICE_ROLE_KEY=your_correct_key_here
  ```

---

## Test Checklist

- [ ] Backend running on port 8000
- [ ] `curl http://localhost:8000/health` returns `{"status":"ok"}`
- [ ] Frontend running on port 3000
- [ ] Can open chat widget (blue button, bottom-right)
- [ ] Can type and send messages
- [ ] Receive AI responses from Gemini
- [ ] (Optional) Messages show in Supabase (if key is valid)

---

## Production Deployment

### Backend
```bash
# Build Docker image
docker build -t chatbot-backend .

# Run container
docker run -p 8000:8000 --env-file .env chatbot-backend
```

### Frontend
```bash
# Build production build
npm run build

# Start production server
npm start
```

Update environment variables:
- **Backend `.env`**: `FRONTEND_URL=your-production-domain.com`
- **Frontend `.env.local`**: `NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com`

---

## Files Reference

```
chatbot-backend/
├── main.py              # FastAPI app
├── config.py            # Configuration
├── knowledge_base.py    # System prompt & Andrii's info
├── supabase_client.py   # Database integration
├── requirements.txt     # Python dependencies
├── .env                 # API keys (keep secret!)
└── Dockerfile           # Docker configuration

cv-portfolio/
├── components/
│   └── ChatWidget.tsx   # Frontend chat component
├── .env.local           # Frontend config
└── app/
```
