-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own coaching conversations" ON coaching_conversations;
DROP POLICY IF EXISTS "Users can insert their own coaching conversations" ON coaching_conversations;
DROP POLICY IF EXISTS "Users can update their own coaching conversations" ON coaching_conversations;
DROP POLICY IF EXISTS "Users can delete their own coaching conversations" ON coaching_conversations;

-- Drop existing table if it exists
DROP TABLE IF EXISTS coaching_conversations CASCADE;

-- Create coaching_conversations table
CREATE TABLE coaching_conversations (
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
CREATE INDEX idx_coaching_conversations_user_id ON coaching_conversations(user_id);
CREATE INDEX idx_coaching_conversations_session_id ON coaching_conversations(session_id);
CREATE INDEX idx_coaching_conversations_created_at ON coaching_conversations(created_at);
CREATE INDEX idx_coaching_conversations_user_session ON coaching_conversations(user_id, session_id);

-- Enable RLS
ALTER TABLE coaching_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own coaching conversations"
    ON coaching_conversations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coaching conversations"
    ON coaching_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coaching conversations"
    ON coaching_conversations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coaching conversations"
    ON coaching_conversations FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_coaching_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_coaching_conversations_updated_at ON coaching_conversations;
CREATE TRIGGER trigger_update_coaching_conversations_updated_at
    BEFORE UPDATE ON coaching_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_coaching_conversations_updated_at();

-- Create function to clean up old conversations (optional)
CREATE OR REPLACE FUNCTION cleanup_old_coaching_conversations()
RETURNS void AS $$
BEGIN
    DELETE FROM coaching_conversations 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT ALL ON coaching_conversations TO authenticated;
GRANT ALL ON coaching_conversations TO service_role;
