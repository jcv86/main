-- Optimize dashboard queries for better performance
-- Add indexes for common queries

-- Index for user_profiles by email (most common lookup)
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Index for test_results by user_email and completed_at
CREATE INDEX IF NOT EXISTS idx_test_results_user_email_completed ON test_results(user_email, completed_at DESC);

-- Index for user_activities by user_email and created_at
CREATE INDEX IF NOT EXISTS idx_user_activities_user_email_created ON user_activities(user_email, created_at DESC);

-- Index for knowledge_base by created_at
CREATE INDEX IF NOT EXISTS idx_knowledge_base_created ON knowledge_base(created_at DESC);

-- Index for ai_insights by user_email and is_active
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_email_active ON ai_insights(user_email, is_active, created_at DESC);

-- Optimize user_profiles table structure
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0;

-- Update profile completion for existing users
UPDATE user_profiles 
SET profile_completion_percentage = CASE 
  WHEN full_name IS NOT NULL AND career_goal IS NOT NULL THEN 100
  WHEN full_name IS NOT NULL THEN 75
  ELSE 50
END
WHERE profile_completion_percentage = 0;

-- Create materialized view for dashboard stats (optional, for very high traffic)
-- This can be refreshed periodically instead of calculating on each load
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  up.email,
  up.full_name,
  up.current_level,
  up.total_xp,
  COALESCE(test_count.count, 0) as tests_completed,
  COALESCE(activity_count.count, 0) as total_activities,
  up.documents_read,
  up.skills_learned
FROM user_profiles up
LEFT JOIN (
  SELECT user_email, COUNT(*) as count 
  FROM test_results 
  GROUP BY user_email
) test_count ON up.email = test_count.user_email
LEFT JOIN (
  SELECT user_email, COUNT(*) as count 
  FROM user_activities 
  GROUP BY user_email
) activity_count ON up.email = activity_count.user_email;

-- Add function to get dashboard data efficiently
CREATE OR REPLACE FUNCTION get_dashboard_data(user_email_param TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'profile', (
      SELECT row_to_json(up) 
      FROM user_profiles up 
      WHERE up.email = user_email_param
    ),
    'test_results', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', tr.id,
          'test_name', tr.test_name,
          'test_type', tr.test_type,
          'score', tr.score,
          'completed_at', tr.completed_at,
          'duration_minutes', tr.duration_minutes
        )
      ), '[]'::json)
      FROM test_results tr 
      WHERE tr.user_email = user_email_param 
      ORDER BY tr.completed_at DESC 
      LIMIT 10
    ),
    'recent_activities', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', ua.id,
          'activity_type', ua.activity_type,
          'activity_description', ua.activity_description,
          'xp_earned', ua.xp_earned,
          'created_at', ua.created_at
        )
      ), '[]'::json)
      FROM user_activities ua 
      WHERE ua.user_email = user_email_param 
      ORDER BY ua.created_at DESC 
      LIMIT 5
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
