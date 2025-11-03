-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  page_count INTEGER,
  status TEXT DEFAULT 'processing', -- processing, ready, error
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_chunks table for storing text chunks with embeddings
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 embeddings are 1536 dimensions
  token_count INTEGER,
  page_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_conversations table
CREATE TABLE IF NOT EXISTS document_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_ids UUID[] NOT NULL, -- Array of document IDs for multi-document chat
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_messages table
CREATE TABLE IF NOT EXISTS document_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES document_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- user, assistant
  content TEXT NOT NULL,
  sources JSONB, -- Array of {chunk_id, document_id, page_number, relevance_score}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_conversations_user_id ON document_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_document_messages_conversation_id ON document_messages(conversation_id);

-- Create vector similarity search index (using ivfflat for performance)
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Users can update own documents" ON documents
  FOR UPDATE USING (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

-- RLS Policies for document_chunks
CREATE POLICY "Users can view chunks of own documents" ON document_chunks
  FOR SELECT USING (document_id IN (SELECT id FROM documents WHERE user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')));

-- RLS Policies for document_conversations
CREATE POLICY "Users can view own conversations" ON document_conversations
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Users can insert own conversations" ON document_conversations
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Users can update own conversations" ON document_conversations
  FOR UPDATE USING (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

CREATE POLICY "Users can delete own conversations" ON document_conversations
  FOR DELETE USING (user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email'));

-- RLS Policies for document_messages
CREATE POLICY "Users can view messages in own conversations" ON document_messages
  FOR SELECT USING (conversation_id IN (SELECT id FROM document_conversations WHERE user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')));

CREATE POLICY "Users can insert messages in own conversations" ON document_messages
  FOR INSERT WITH CHECK (conversation_id IN (SELECT id FROM document_conversations WHERE user_id = (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')));
