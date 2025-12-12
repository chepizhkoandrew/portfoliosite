# Chatbot Backend Service

A FastAPI-based backend service for the AI chatbot assistant. This service handles all API key management, Gemini integration, and Supabase interactions securely.

## Setup

### Prerequisites
- Python 3.12 or higher
- pip (Python package installer)

### Installation

1. Navigate to the chatbot-backend directory:
```bash
cd chatbot-backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file from the example:
```bash
cp .env.example .env
```

5. Update `.env` with your credentials:
```
GOOGLE_API_KEY=your_google_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
```

### Running the Backend

Start the development server:
```bash
python main.py
```

The server will run on `http://localhost:8000`

For production:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Health Check
```
GET /health
```
Returns service status.

### Chat
```
POST /api/chat
```

**Request Body:**
```json
{
  "message": "user message",
  "conversation_id": "conv_12345",
  "history": [
    {
      "role": "user",
      "content": "previous message"
    },
    {
      "role": "assistant",
      "content": "response"
    }
  ]
}
```

**Response:**
```json
{
  "message": "assistant response",
  "conversation_id": "conv_12345"
}
```

## Docker

Build the Docker image:
```bash
docker build -t chatbot-backend .
```

Run the container:
```bash
docker run -p 8000:8000 --env-file .env chatbot-backend
```

## Rate Limiting

The `/api/chat` endpoint has a rate limit of 20 requests per minute per IP address.

## Environment Variables

- `GOOGLE_API_KEY`: Google Generative AI API key
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `FRONTEND_URL`: Frontend URL for CORS configuration
- `ENVIRONMENT`: Environment type (development/production)
- `LOG_LEVEL`: Logging level (DEBUG/INFO/WARNING/ERROR)

## Security Notes

- Never commit the `.env` file to version control
- Keep API keys secure and rotate them regularly
- The backend uses CORS to restrict requests to your frontend URL
- All API keys are server-side only and never exposed to the browser
