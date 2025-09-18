-- Drop existing tables if they exist
DROP TABLE IF EXISTS ai_interactions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table with comprehensive JSONB structure
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
    }',
    test_results JSONB NOT NULL DEFAULT '{}',
    conversation_history JSONB NOT NULL DEFAULT '{
        "totalMessages": 0,
        "topics": [],
        "lastActive": "",
        "commonQuestions": [],
        "progressTracking": {}
    }',
    personality_insights JSONB NOT NULL DEFAULT '{
        "strengths": [],
        "growthAreas": [],
        "workStyle": "collaborative",
        "motivators": [],
        "stressors": [],
        "communicationPreferences": []
    }',
    career_profile JSONB NOT NULL DEFAULT '{
        "experience": "intermediate",
        "aspirations": [],
        "skillGaps": [],
        "networkingStyle": "professional"
    }',
    learning_profile JSONB NOT NULL DEFAULT '{
        "completedBooks": [],
        "currentReading": [],
        "preferredFormats": ["digital", "interactive"],
        "learningPace": "moderate",
        "retentionStyle": "practical"
    }',
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
    metadata JSONB DEFAULT '{}',
    suggested_actions JSONB DEFAULT '[]',
    context_used JSONB DEFAULT '[]',
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

-- Insert sample data for testing
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
    }',
    '{
        "totalMessages": 0,
        "topics": [],
        "lastActive": "' || NOW()::text || '",
        "commonQuestions": [],
        "progressTracking": {}
    }'
) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    preferences = EXCLUDED.preferences,
    conversation_history = EXCLUDED.conversation_history,
    updated_at = NOW();

-- Create view for user analytics
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
    up.email,
    up.name,
    (up.preferences->>'skillLevel') as skill_level,
    (up.conversation_history->>'totalMessages')::int as total_messages,
    jsonb_array_length(up.conversation_history->'topics') as topics_count,
    jsonb_object_keys_count(up.test_results) as completed_tests,
    up.created_at,
    up.updated_at
FROM user_profiles up;

-- Function to get user profile with analytics
CREATE OR REPLACE FUNCTION get_user_profile_with_analytics(user_email VARCHAR)
RETURNS JSONB AS $$
DECLARE
    profile_data JSONB;
    interaction_count INT;
BEGIN
    -- Get user profile
    SELECT row_to_json(up)::jsonb INTO profile_data
    FROM user_profiles up
    WHERE up.email = user_email;
    
    -- Get interaction count
    SELECT COUNT(*) INTO interaction_count
    FROM ai_interactions ai
    WHERE ai.user_email = user_email;
    
    -- Add analytics to profile
    profile_data = profile_data || jsonb_build_object('analytics', jsonb_build_object(
        'totalInteractions', interaction_count,
        'lastUpdated', NOW()
    ));
    
    RETURN profile_data;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL PRIVILEGES ON user_profiles TO postgres;
GRANT ALL PRIVILEGES ON ai_interactions TO postgres;
GRANT SELECT ON user_analytics TO postgres;
