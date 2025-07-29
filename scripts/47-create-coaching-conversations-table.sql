-- Create coaching conversations table for AI Coach
CREATE TABLE IF NOT EXISTS coaching_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    session_id UUID DEFAULT gen_random_uuid(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_user_id ON coaching_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_session_id ON coaching_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_created_at ON coaching_conversations(created_at);

-- Enable RLS
ALTER TABLE coaching_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own conversations" ON coaching_conversations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own conversations" ON coaching_conversations
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own conversations" ON coaching_conversations
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own conversations" ON coaching_conversations
    FOR DELETE USING (user_id = auth.uid());

-- Create trigger for updated_at
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

-- Grant permissions
GRANT ALL ON coaching_conversations TO authenticated;
GRANT ALL ON coaching_conversations TO service_role;

-- Insert sample conversation for demo
INSERT INTO coaching_conversations (user_id, message, role, session_id) VALUES
('demo-user-id', '¡Hola! Soy tu Coach IA personal. Estoy aquí para ayudarte con tu desarrollo profesional. ¿En qué puedo asistirte hoy?', 'assistant', gen_random_uuid());
