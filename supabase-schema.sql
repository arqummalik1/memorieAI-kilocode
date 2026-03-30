-- MemorAI Database Schema
-- Run these SQL commands in the Supabase SQL Editor

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- PROFILES TABLE
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  briefing_time TIME DEFAULT '08:00:00',
  briefing_enabled BOOLEAN DEFAULT TRUE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  push_subscription JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- REMINDERS TABLE
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  remind_at TIMESTAMPTZ NOT NULL,
  recurrence TEXT DEFAULT 'none',
  recurrence_rule TEXT,
  status TEXT DEFAULT 'pending',
  snooze_until TIMESTAMPTZ,
  friend_email TEXT,
  source TEXT DEFAULT 'chat',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- LISTS TABLE
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT '📝',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- LIST ITEMS TABLE
CREATE TABLE list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- MEMORIES TABLE
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  embedding vector(768),
  source TEXT DEFAULT 'chat',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FILES TABLE
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  tags TEXT[],
  ai_summary TEXT,
  embedding vector(768),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CHAT MESSAGES TABLE
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  intent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CALENDAR CONNECTIONS TABLE
CREATE TABLE calendar_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  provider TEXT DEFAULT 'google',
  access_token TEXT,
  refresh_token TEXT,
  token_expiry TIMESTAMPTZ,
  calendar_id TEXT DEFAULT 'primary',
  connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- EMAIL CONNECTIONS TABLE
CREATE TABLE email_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  provider TEXT DEFAULT 'gmail',
  access_token TEXT,
  refresh_token TEXT,
  token_expiry TIMESTAMPTZ,
  email_address TEXT,
  connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FRIEND REMINDERS TABLE
CREATE TABLE friend_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_email TEXT NOT NULL,
  message TEXT NOT NULL,
  send_at TIMESTAMPTZ NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- DAILY BRIEFINGS TABLE
CREATE TABLE daily_briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  delivered_via TEXT[],
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_briefings ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Users own data" ON profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON reminders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON lists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON memories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON files FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON chat_messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON calendar_connections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON email_connections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON friend_reminders FOR ALL USING (auth.uid() = sender_id);
CREATE POLICY "Users own data" ON daily_briefings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owner access" ON list_items FOR ALL USING (
  list_id IN (SELECT id FROM lists WHERE user_id = auth.uid())
);

-- VECTOR SEARCH FUNCTION
CREATE OR REPLACE FUNCTION match_memories(
  query_embedding vector(768),
  match_user_id UUID,
  match_count INT DEFAULT 5
)
RETURNS TABLE (id UUID, content TEXT, type TEXT, similarity FLOAT)
LANGUAGE SQL STABLE AS $$
  SELECT id, content, type, 1 - (embedding <=> query_embedding) AS similarity
  FROM memories
  WHERE user_id = match_user_id AND embedding IS NOT NULL
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- STORAGE BUCKET for files
INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view files" ON storage.objects
  FOR SELECT USING (bucket_id = 'files');

CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);
