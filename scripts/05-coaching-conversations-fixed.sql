-- Create coaching conversations table for persistent memory
CREATE TABLE IF NOT EXISTS coaching_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID DEFAULT gen_random_uuid(),
    message_id UUID DEFAULT gen_random_uuid(),
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'analysis', 'recommendation', 'action_plan', 'insight')),
    metadata JSONB DEFAULT '{}',
    context_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coaching sessions table for session management
CREATE TABLE IF NOT EXISTS coaching_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_title TEXT,
    session_summary TEXT,
    total_messages INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    context_snapshot JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coaching insights table for user insights tracking
CREATE TABLE IF NOT EXISTS coaching_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL,
    insight_data JSONB NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_user_id ON coaching_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_session_id ON coaching_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_created_at ON coaching_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_last_activity ON coaching_sessions(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_coaching_insights_user_id ON coaching_insights(user_id);

-- Enable RLS
ALTER TABLE coaching_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own coaching conversations" ON coaching_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coaching conversations" ON coaching_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coaching conversations" ON coaching_conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own coaching sessions" ON coaching_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coaching sessions" ON coaching_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coaching sessions" ON coaching_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own coaching insights" ON coaching_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coaching insights" ON coaching_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coaching insights" ON coaching_insights
    FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update session activity (fixed to match session by user_id and latest session)
CREATE OR REPLACE FUNCTION update_coaching_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the most recent session for this user
    UPDATE coaching_sessions 
    SET 
        last_activity = NOW(),
        total_messages = total_messages + 1,
        updated_at = NOW()
    WHERE user_id = NEW.user_id 
    AND id = (
        SELECT id FROM coaching_sessions 
        WHERE user_id = NEW.user_id 
        ORDER BY last_activity DESC 
        LIMIT 1
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for session activity updates
DROP TRIGGER IF EXISTS trigger_update_coaching_session_activity ON coaching_conversations;
CREATE TRIGGER trigger_update_coaching_session_activity
    AFTER INSERT ON coaching_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_coaching_session_activity();
