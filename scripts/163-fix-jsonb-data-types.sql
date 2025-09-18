-- Drop existing tables if they exist
DROP TABLE IF EXISTS ai_interactions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table with proper JSONB handling
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    preferences JSONB NOT NULL DEFAULT '{
        "communicationStyle": "professional",
        "learningStyle": "visual",
        "careerGoals": [],
        "interests": [],
        "skillLevel": "intermediate",
        "timeAvailability": "moderate"
    }'::jsonb,
    test_results JSONB NOT NULL DEFAULT '{}'::jsonb,
    conversation_history JSONB NOT NULL DEFAULT '{
        "totalMessages": 0,
        "topics": [],
        "lastActive": "",
        "commonQuestions": [],
        "progressTracking": {}
    }'::jsonb,
    personality_insights JSONB NOT NULL DEFAULT '{
        "strengths": [],
        "growthAreas": [],
        "workStyle": "collaborative",
        "motivators": [],
        "stressors": [],
        "communicationPreferences": []
    }'::jsonb,
    career_profile JSONB NOT NULL DEFAULT '{
        "experience": "intermediate",
        "aspirations": [],
        "skillGaps": [],
        "networkingStyle": "professional"
    }'::jsonb,
    learning_profile JSONB NOT NULL DEFAULT '{
        "completedBooks": [],
        "currentReading": [],
        "preferredFormats": ["digital", "interactive"],
        "learningPace": "moderate",
        "retentionStyle": "practical"
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_interactions table for detailed conversation tracking
CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    metadata JSONB DEFAULT '{}'::jsonb,
    suggested_actions JSONB DEFAULT '[]'::jsonb,
    context_used JSONB DEFAULT '[]'::jsonb,
    confidence_score DECIMAL(3,2) DEFAULT 0.8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_ai_interactions_user_email ON ai_interactions(user_email);
CREATE INDEX idx_ai_interactions_created_at ON ai_interactions(created_at);
CREATE INDEX idx_user_profiles_preferences ON user_profiles USING GIN (preferences);
CREATE INDEX idx_user_profiles_conversation_history ON user_profiles USING GIN (conversation_history);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing with proper JSONB casting
INSERT INTO user_profiles (email, name, preferences, conversation_history) 
VALUES (
    'travis@example.com',
    'Travis',
    '{
        "communicationStyle": "professional",
        "learningStyle": "visual",
        "careerGoals": ["liderazgo", "desarrollo profesional"],
        "interests": ["tecnología", "gestión"],
        "skillLevel": "intermediate",
        "timeAvailability": "moderate"
    }'::jsonb,
    jsonb_build_object(
        'totalMessages', 0,
        'topics', '[]'::jsonb,
        'lastActive', NOW()::text,
        'commonQuestions', '[]'::jsonb,
        'progressTracking', '{}'::jsonb
    )
) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    preferences = EXCLUDED.preferences,
    conversation_history = EXCLUDED.conversation_history,
    updated_at = NOW();

-- Create view for user analytics with fixed JSONB functions
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
    up.email,
    up.name,
    (up.preferences->>'skillLevel') as skill_level,
    COALESCE((up.conversation_history->>'totalMessages')::int, 0) as total_messages,
    CASE 
        WHEN jsonb_typeof(up.conversation_history->'topics') = 'array' 
        THEN jsonb_array_length(up.conversation_history->'topics')
        ELSE 0 
    END as topics_count,
    CASE 
        WHEN jsonb_typeof(up.test_results) = 'object' 
        THEN (SELECT COUNT(*) FROM jsonb_object_keys(up.test_results))
        ELSE 0 
    END as completed_tests,
    up.created_at,
    up.updated_at
FROM user_profiles up;

-- Function to safely get user profile with analytics
CREATE OR REPLACE FUNCTION get_user_profile_with_analytics(user_email VARCHAR)
RETURNS JSONB AS $$
DECLARE
    profile_data JSONB;
    interaction_count INT;
BEGIN
    -- Get user profile
    SELECT to_jsonb(up.*) INTO profile_data
    FROM user_profiles up
    WHERE up.email = user_email;
    
    -- Get interaction count
    SELECT COALESCE(COUNT(*), 0) INTO interaction_count
    FROM ai_interactions ai
    WHERE ai.user_email = user_email;
    
    -- Add analytics to profile if profile exists
    IF profile_data IS NOT NULL THEN
        profile_data = profile_data || jsonb_build_object('analytics', jsonb_build_object(
            'totalInteractions', interaction_count,
            'lastUpdated', NOW()
        ));
    END IF;
    
    RETURN COALESCE(profile_data, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to safely update conversation history
CREATE OR REPLACE FUNCTION update_conversation_history(
    user_email VARCHAR,
    new_message_count INT DEFAULT 1,
    new_topic VARCHAR DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    current_history JSONB;
    updated_history JSONB;
    current_topics JSONB;
BEGIN
    -- Get current conversation history
    SELECT conversation_history INTO current_history
    FROM user_profiles
    WHERE email = user_email;
    
    -- If no history exists, create default
    IF current_history IS NULL THEN
        current_history = '{
            "totalMessages": 0,
            "topics": [],
            "lastActive": "",
            "commonQuestions": [],
            "progressTracking": {}
        }'::jsonb;
    END IF;
    
    -- Update message count
    updated_history = jsonb_set(
        current_history,
        '{totalMessages}',
        to_jsonb(COALESCE((current_history->>'totalMessages')::int, 0) + new_message_count)
    );
    
    -- Update last active
    updated_history = jsonb_set(
        updated_history,
        '{lastActive}',
        to_jsonb(NOW()::text)
    );
    
    -- Add new topic if provided
    IF new_topic IS NOT NULL THEN
        current_topics = COALESCE(updated_history->'topics', '[]'::jsonb);
        
        -- Only add if topic doesn't already exist
        IF NOT (current_topics @> to_jsonb(new_topic)) THEN
            updated_history = jsonb_set(
                updated_history,
                '{topics}',
                current_topics || to_jsonb(new_topic)
            );
        END IF;
    END IF;
    
    -- Update the user profile
    UPDATE user_profiles
    SET conversation_history = updated_history,
        updated_at = NOW()
    WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL PRIVILEGES ON user_profiles TO postgres;
GRANT ALL PRIVILEGES ON ai_interactions TO postgres;
GRANT SELECT ON user_analytics TO postgres;
GRANT EXECUTE ON FUNCTION get_user_profile_with_analytics(VARCHAR) TO postgres;
GRANT EXECUTE ON FUNCTION update_conversation_history(VARCHAR, INT, VARCHAR) TO postgres;

-- Verify the setup
SELECT 'Database setup completed successfully' as status;
