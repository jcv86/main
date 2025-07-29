-- Create coaching conversations table for persistent chat history
CREATE TABLE IF NOT EXISTS coaching_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_user_id ON coaching_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_session_id ON coaching_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_created_at ON coaching_conversations(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE coaching_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own coaching conversations" ON coaching_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coaching conversations" ON coaching_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coaching conversations" ON coaching_conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coaching conversations" ON coaching_conversations
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coaching_conversations_updated_at 
    BEFORE UPDATE ON coaching_conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean old conversations (optional)
CREATE OR REPLACE FUNCTION clean_old_coaching_conversations()
RETURNS void AS $$
BEGIN
    DELETE FROM coaching_conversations 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;
