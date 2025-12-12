# Chatbot Setup Instructions

## 1. Get Google Gemini API Key
- Visit https://aistudio.google.com/app/apikey
- Click "Get API Key"
- Create a new API key or use existing one
- Copy the key

## 2. Set Up Supabase
- Create a new project at https://supabase.com
- Go to Settings → API Keys
- Copy the Project URL and anon key
- Go to Settings → API Keys and copy the service_role key

## 3. Create Database Table
- Go to your Supabase project → SQL Editor
- Paste the contents of `docs/SUPABASE_SCHEMA.sql`
- Run the query

## 4. Configure Environment Variables
- Copy `.env.example` to `.env.local`
- Fill in all the values:
  ```
  GOOGLE_API_KEY=your_api_key
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```

## 5. Deploy
- Run `npm run dev` to test locally
- Run `npm run build` to build for production
- Deploy to Vercel or your hosting platform

## Integration

### Add ChatWidget to Any Page
```tsx
import { ChatWidget } from '@/components/ChatWidget';

export default function YourPage() {
  return (
    <>
      {/* Your page content */}
      <ChatWidget />
    </>
  );
}
```

### Full Page Chat
- Visit `/chatbot` route for the full-page chat interface

## Troubleshooting
- If messages aren't saving, check Supabase connection and table permissions
- If no responses, verify Google API key and rate limits
- Check browser console for error messages
