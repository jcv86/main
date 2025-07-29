-- Remove the foreign key constraint that's causing issues
-- The coaching_conversations table should not have a foreign key on session_id
-- since we're using session_id as a simple grouping identifier, not a reference to another table

-- First, check if the constraint exists and drop it
DO $$ 
BEGIN
    -- Drop the foreign key constraint if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'coaching_conversations_session_id_fkey' 
        AND table_name = 'coaching_conversations'
    ) THEN
        ALTER TABLE coaching_conversations DROP CONSTRAINT coaching_conversations_session_id_fkey;
        RAISE NOTICE 'Dropped foreign key constraint coaching_conversations_session_id_fkey';
    ELSE
        RAISE NOTICE 'Foreign key constraint coaching_conversations_session_id_fkey does not exist';
    END IF;
END $$;

-- Ensure the session_id column is UUID type but without foreign key constraint
DO $$
BEGIN
    -- Check if session_id column exists and alter it if needed
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'coaching_conversations' 
        AND column_name = 'session_id'
    ) THEN
        -- Update the column type to UUID
        ALTER TABLE coaching_conversations 
        ALTER COLUMN session_id TYPE UUID USING session_id::UUID;
        RAISE NOTICE 'Updated session_id column to UUID type';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not alter session_id column type: %', SQLERRM;
END $$;

-- Update any existing invalid session IDs to proper UUIDs
UPDATE coaching_conversations 
SET session_id = gen_random_uuid()
WHERE session_id IS NULL 
   OR NOT (session_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$');

-- Make sure session_id is not null
ALTER TABLE coaching_conversations 
ALTER COLUMN session_id SET NOT NULL;

-- Add a default value for new records
ALTER TABLE coaching_conversations 
ALTER COLUMN session_id SET DEFAULT gen_random_uuid();

-- Create an index for better performance on session queries
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_session_user 
ON coaching_conversations(session_id, user_id);

-- Create an index for better performance on user queries
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_user_created 
ON coaching_conversations(user_id, created_at DESC);

-- Create an index for better performance on content searches
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_content_search 
ON coaching_conversations USING gin(to_tsvector('spanish', content));

-- Show table structure information
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'coaching_conversations' 
ORDER BY ordinal_position;

-- Show constraint information
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'coaching_conversations';

-- Show sample data to verify everything is working
SELECT 
    id, 
    user_id, 
    session_id, 
    role, 
    LEFT(content, 50) as content_preview, 
    created_at 
FROM coaching_conversations 
ORDER BY created_at DESC 
LIMIT 5;
