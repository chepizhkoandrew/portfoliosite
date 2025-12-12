-- Chatbot messages table for storing conversations
-- Run this SQL in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS chatbot_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  conversation_id VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for better query performance
  CONSTRAINT messages_conversation_check CHECK (conversation_id != '')
);

-- Create index on conversation_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conversation_id 
ON chatbot_messages(conversation_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_created_at 
ON chatbot_messages(created_at DESC);

-- Create index on conversation_id and created_at for combined queries
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conversation_created 
ON chatbot_messages(conversation_id, created_at DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (since we're allowing anonymous access)
CREATE POLICY "Allow anonymous inserts" ON chatbot_messages
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anyone to read messages (optional - adjust based on your needs)
CREATE POLICY "Allow anonymous reads" ON chatbot_messages
  FOR SELECT
  USING (true);

-- Note: After running this, you may also want to set up:
-- 1. Authentication policies if you want to restrict access
-- 2. Rate limiting at the application level
-- 3. Data retention policies (e.g., delete messages older than X days)
