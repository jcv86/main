-- Temporarily remove foreign key constraint on coaching_sessions.user_id for testing
-- WARNING: This should be restored in production with proper authentication

-- Drop the foreign key constraint
ALTER TABLE coaching_sessions 
DROP CONSTRAINT IF EXISTS coaching_sessions_user_id_fkey;

-- Make user_id nullable for testing purposes
ALTER TABLE coaching_sessions 
ALTER COLUMN user_id DROP NOT NULL;

-- Verify the changes
SELECT 
  column_name, 
  is_nullable, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'coaching_sessions' 
  AND column_name = 'user_id';

-- Note: In production, you should:
-- 1. Re-add the foreign key constraint:
--    ALTER TABLE coaching_sessions 
--    ADD CONSTRAINT coaching_sessions_user_id_fkey 
--    FOREIGN KEY (user_id) REFERENCES users(id);
-- 
-- 2. Make user_id NOT NULL again:
--    ALTER TABLE coaching_sessions 
--    ALTER COLUMN user_id SET NOT NULL;
