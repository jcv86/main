-- Add AI coaching support to the database structure
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS ai_coach_data JSONB DEFAULT '{}';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS personality_summary JSONB DEFAULT '{}';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS coaching_preferences JSONB DEFAULT '{}';

-- Create AI coaching sessions table
CREATE TABLE IF NOT EXISTS ai_coaching_sessions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    session_type VARCHAR(100) NOT NULL, -- 'personality_analysis', 'career_guidance', 'skill_development'
    prompt TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context_data JSONB DEFAULT '{}',
    satisfaction_rating INTEGER, -- 1-5 rating from user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE
);

-- Create AI insights table for storing generated insights
CREATE TABLE IF NOT EXISTS ai_insights (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    insight_type VARCHAR(100) NOT NULL, -- 'personality', 'career', 'growth', 'compatibility'
    insight_title VARCHAR(255) NOT NULL,
    insight_content TEXT NOT NULL,
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    source_tests TEXT[], -- Array of test names that contributed to this insight
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_coaching_sessions_user_email ON ai_coaching_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_ai_coaching_sessions_type ON ai_coaching_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_email ON ai_insights(user_email);
CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON ai_insights(insight_type);

-- Function to update personality summary when test results are added
CREATE OR REPLACE FUNCTION update_personality_summary()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the personality summary in user_profiles when a new test result is added
    UPDATE user_profiles 
    SET personality_summary = (
        SELECT jsonb_object_agg(test_name, results)
        FROM test_results 
        WHERE user_email = NEW.user_email 
        AND test_type = 'personality'
    )
    WHERE email = NEW.user_email;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update personality summary
DROP TRIGGER IF EXISTS trigger_update_personality_summary ON test_results;
CREATE TRIGGER trigger_update_personality_summary
    AFTER INSERT OR UPDATE ON test_results
    FOR EACH ROW
    EXECUTE FUNCTION update_personality_summary();

SELECT 'AI coaching support tables and triggers created successfully' as status;
