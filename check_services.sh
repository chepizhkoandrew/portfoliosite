#!/bin/bash

echo "======================================================================="
echo "CHATBOT SERVICES STATUS"
echo "======================================================================="
echo ""

# Check Backend
echo "1️⃣  Backend (FastAPI) - Port 8000"
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "   ✅ Running"
    BACKEND_STATUS=$(curl -s http://localhost:8000/health)
    echo "   Response: $BACKEND_STATUS"
else
    echo "   ❌ Not running"
    echo "   Start with: cd chatbot-backend && source venv/bin/activate && python main.py"
fi
echo ""

# Check Frontend
echo "2️⃣  Frontend (Next.js) - Port 3000"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Running"
else
    echo "   ❌ Not running"
    echo "   Start with: cd cv-portfolio && npm run dev"
fi
echo ""

# Check port availability
echo "3️⃣  Port Status"
echo "   Port 8000 (Backend): $(lsof -i :8000 > /dev/null && echo '✅ In use' || echo '⚪ Available')"
echo "   Port 3000 (Frontend): $(lsof -i :3000 > /dev/null && echo '✅ In use' || echo '⚪ Available')"
echo ""

echo "======================================================================="
echo "QUICK START COMMANDS:"
echo "======================================================================="
echo ""
echo "Terminal 1 - Backend:"
echo "  cd /Users/andriichepizhko/Downloads/CVs/chatbot-backend"
echo "  source venv/bin/activate && python main.py"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd /Users/andriichepizhko/Downloads/CVs/cv-portfolio"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo "======================================================================="
