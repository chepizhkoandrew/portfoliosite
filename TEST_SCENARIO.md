# End-to-End Test Scenario

## Setup

**Terminal 1 - Start Backend**
```bash
cd /Users/andriichepizhko/Downloads/CVs/chatbot-backend
python main.py
```
Wait for: `INFO: Uvicorn running on http://0.0.0.0:8000`

**Terminal 2 - Start Frontend**
```bash
cd /Users/andriichepizhko/Downloads/CVs/cv-portfolio
npm run dev
```
Wait for: `▲ Next.js 16.0.7`

**Browser** - Open http://localhost:3000

---

## Test Scenario

### Test 1: First Response (No Questions Yet)
**What to expect:**
- ✅ Message chunks appear with pauses (0.5-1.2s)
- ✅ Blinking cursor appears while streaming
- ✅ No question asked (turn 1)
- ✅ Message saved to Supabase

**User Input:**
```
Tell me about Andrii's experience and background
```

**Expected Output:**
- ~7-10 text chunks appearing one by one
- Response talks about experience, skills, industries
- **NO question at the end** (because it's turn 1)

**Backend logs should show:**
```
✅ Gemini response received: ...
✅ Message saved: user in conversation conv_XXX
✅ Message saved: assistant in conversation conv_XXX
```

---

### Test 2: Second Response (Should Ask Question)
**What to expect:**
- ✅ Message chunks with pauses
- ✅ After all chunks, a question appears
- ✅ Question asks about user's interest/intent
- ✅ Message saved to Supabase

**User Input:**
```
What's your approach to product management?
```

**Expected Output:**
- ~5-6 text chunks about PM approach
- **THEN a question appears**, such as:
  - "By the way, what specifically brought you to my site?"
  - "Are we looking at a potential opportunity here?"
  - "Where are you based, by the way?"

**Visual indicators:**
- Each chunk appears with slight delay
- Cursor blinks at the end until next chunk comes
- Question appears with extra pause (0.8-1.5s) before it

---

### Test 3: Context Tracking
**What to expect:**
- ✅ If same question type appears again, it's different from last time
- ✅ Conversation state is maintained

**User Input:**
```
How do you optimize product launches?
```

**Expected Output:**
- Long response (>300 chars) with chunks
- Question asked is **different** from the one in Test 2
- Different question type from the pool

---

### Test 4: Browser Console Logs
**What to check:**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for:
   ```
   (No errors about "Failed to send message")
   (No "Error parsing chunk")
   ```

4. Go to Network tab
5. Click on `chat/stream` request
6. Response should show `text/event-stream` with `data: {...}` lines

---

## Debug Checklist

If something doesn't work:

### Messages not chunking?
- Check backend logs for: `Streaming X chunks`
- Check message length (must be >300 chars for questions)
- Verify `/api/chat/stream` endpoint is being called (Network tab)

### No questions appearing?
- Backend logs should show: `should_add_question check: ... = True`
- Check turn number: must be >= 2
- Check message length: must be > 300 chars

### Cursor not blinking?
- Check frontend React component renders `isStreaming={true}`
- Verify Framer Motion is animating the span

### Supabase messages not saving?
- Backend should log: `✅ Message saved:`
- If not, check `.env` file has correct `SUPABASE_SERVICE_ROLE_KEY`
- Verify table `chatbot_messages` exists in Supabase SQL

### SSE not streaming?
- Check Network Response tab for `data: {...}` lines
- If empty, backend might be crashing
- Check backend terminal for errors

---

## Success Criteria

✅ **All of these should happen:**
1. First response: chunks appear, no question
2. Second response: chunks appear, question appears
3. Cursor blinks while streaming
4. Questions are relevant and don't repeat
5. Supabase logs show messages saving
6. Console has no errors
7. Network shows `text/event-stream` response type

---

## Example Conversation

```
User: "Tell me about your experience with SaaS products"

Bot (Turn 1 - No question):
"I have extensive experience building SaaS products from the ground up. 
Over the past 14+ years, I've worked on various SaaS platforms... 
[chunks appear] ... helped achieve 3x faster releases."

User: "What's the best way to scale a product?"

Bot (Turn 2 - WITH question):
"Scaling requires a multi-faceted approach. 
First, you need strong product-market fit... 
[chunks appear] ... user feedback is critical.

By the way, what specifically brought you to my site? 
Are you looking for a specific service?"
```

---

## Reset Between Tests

If you want to start fresh:
1. Clear browser cache or open in incognito mode
2. Restart backend: `Ctrl+C` then `python main.py`
3. New conversation_id is generated automatically
