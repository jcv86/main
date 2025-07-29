-- Fix coaching conversations foreign key constraint
DO $$
BEGIN
    -- Drop the table if it exists to recreate it properly
    DROP TABLE IF EXISTS coaching_conversations CASCADE;
    
    -- Create the coaching_conversations table with proper foreign key
    CREATE TABLE coaching_conversations (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT NOT NULL DEFAULT 'Nueva Conversación',
        messages JSONB NOT NULL DEFAULT '[]'::jsonb,
        context JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE coaching_conversations ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies
    CREATE POLICY "Users can view their own conversations" ON coaching_conversations
        FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own conversations" ON coaching_conversations
        FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own conversations" ON coaching_conversations
        FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own conversations" ON coaching_conversations
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

    RAISE NOTICE 'Coaching conversations table created successfully with proper foreign key constraints';
END $$;
