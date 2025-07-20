-- Fix users table constraints properly
-- First, we need to handle foreign key dependencies

-- Drop foreign key constraints that depend on users.id
ALTER TABLE personality_assessments 
DROP CONSTRAINT IF EXISTS personality_assessments_user_id_fkey;

ALTER TABLE resumes 
DROP CONSTRAINT IF EXISTS resumes_user_id_fkey;

ALTER TABLE skills_assessments 
DROP CONSTRAINT IF EXISTS skills_assessments_user_id_fkey;

ALTER TABLE interview_sessions 
DROP CONSTRAINT IF EXISTS interview_sessions_user_id_fkey;

ALTER TABLE coaching_conversations 
DROP CONSTRAINT IF EXISTS coaching_conversations_user_id_fkey;

ALTER TABLE user_progress 
DROP CONSTRAINT IF EXISTS user_progress_user_id_fkey;

ALTER TABLE job_recommendations 
DROP CONSTRAINT IF EXISTS job_recommendations_user_id_fkey;

-- Now we can safely drop and recreate the primary key
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_pkey;

-- Add primary key constraint back
ALTER TABLE users 
ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- Ensure email is unique
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE users 
ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Recreate foreign key constraints with proper CASCADE behavior
ALTER TABLE personality_assessments 
ADD CONSTRAINT personality_assessments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE resumes 
ADD CONSTRAINT resumes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE skills_assessments 
ADD CONSTRAINT skills_assessments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE interview_sessions 
ADD CONSTRAINT interview_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE coaching_conversations 
ADD CONSTRAINT coaching_conversations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_progress 
ADD CONSTRAINT user_progress_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE job_recommendations 
ADD CONSTRAINT job_recommendations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Add indexes on foreign key columns for better performance
CREATE INDEX IF NOT EXISTS idx_personality_assessments_user_id ON personality_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_assessments_user_id ON skills_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_user_id ON coaching_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_job_recommendations_user_id ON job_recommendations(user_id);
