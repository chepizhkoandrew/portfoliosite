#!/bin/bash

echo "Testing SSE streaming endpoint..."
echo "Note: Make sure backend is running on http://localhost:8000"
echo ""

# Create a JSON payload
PAYLOAD=$(cat <<EOF
{
  "message": "Tell me about Andrii's experience",
  "conversation_id": "test_conv_123",
  "history": []
}
EOF
)

echo "Sending request to /api/chat/stream..."
echo "Payload: $PAYLOAD"
echo ""
echo "Response:"
echo "---"

# Make the request and show the SSE response
curl -X POST http://localhost:8000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  -v

echo ""
echo "---"
echo "Done"
