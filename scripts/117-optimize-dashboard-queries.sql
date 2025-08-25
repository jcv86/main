-- Optimize dashboard queries for better performance

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_test_results_user_email_completed ON test_results(user_email, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_email_created ON user_activities(user_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_test_questions_test_name ON test_questions(test_name);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_email_active ON ai_insights(user_email, is_active, created_at DESC);

-- Create function to increment user stats efficiently
CREATE OR REPLACE FUNCTION increment_user_stats(
  user_email TEXT,
  xp_to_add INTEGER DEFAULT 0,
  tests_to_add INTEGER DEFAULT 0,
  docs_to_add INTEGER DEFAULT 0,
  skills_to_add INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_profiles (
    email, 
    full_name, 
    total_xp, 
    tests_completed, 
    documents_read, 
    skills_learned,
    current_level,
    created_at
  ) VALUES (
    user_email,
    SPLIT_PART(user_email, '@', 1),
    xp_to_add,
    tests_to_add,
    docs_to_add,
    skills_to_add,
    GREATEST(1, xp_to_add / 100 + 1),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    total_xp = user_profiles.total_xp + xp_to_add,
    tests_completed = user_profiles.tests_completed + tests_to_add,
    documents_read = user_profiles.documents_read + docs_to_add,
    skills_learned = user_profiles.skills_learned + skills_to_add,
    current_level = GREATEST(1, (user_profiles.total_xp + xp_to_add) / 100 + 1),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create optimized dashboard data function
CREATE OR REPLACE FUNCTION get_dashboard_data(user_email TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'profile', (
      SELECT row_to_json(p) FROM (
        SELECT email, full_name, avatar_url, current_level, total_xp, 
               tests_completed, documents_read, skills_learned, career_goal, created_at
        FROM user_profiles 
        WHERE email = user_email
      ) p
    ),
    'recent_tests', (
      SELECT COALESCE(json_agg(t ORDER BY t.completed_at DESC), '[]'::json) FROM (
        SELECT id, test_name, test_type, score, completed_at, duration_minutes
        FROM test_results 
        WHERE user_email = get_dashboard_data.user_email
        ORDER BY completed_at DESC 
        LIMIT 10
      ) t
    ),
    'recent_activities', (
      SELECT COALESCE(json_agg(a ORDER BY a.created_at DESC), '[]'::json) FROM (
        SELECT id, activity_type, activity_description, xp_earned, created_at
        FROM user_activities 
        WHERE user_email = get_dashboard_data.user_email
        ORDER BY created_at DESC 
        LIMIT 5
      ) a
    ),
    'documents', (
      SELECT COALESCE(json_agg(d ORDER BY d.created_at DESC), '[]'::json) FROM (
        SELECT id, title, category, read_count, created_at
        FROM knowledge_base 
        ORDER BY created_at DESC 
        LIMIT 6
      ) d
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create materialized view for popular content (optional, for high traffic)
CREATE MATERIALIZED VIEW IF NOT EXISTS popular_content AS
SELECT 
  'test' as content_type,
  test_name as title,
  COUNT(*) as usage_count,
  AVG(score) as avg_score
FROM test_results 
WHERE completed_at > NOW() - INTERVAL '30 days'
GROUP BY test_name
UNION ALL
SELECT 
  'document' as content_type,
  title,
  read_count as usage_count,
  NULL as avg_score
FROM knowledge_base
ORDER BY usage_count DESC;

-- Refresh materialized view (run periodically)
-- REFRESH MATERIALIZED VIEW popular_content;

COMMIT;
