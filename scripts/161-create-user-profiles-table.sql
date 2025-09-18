-- Create comprehensive user profiles table for advanced AI coach
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    
    -- User preferences
    preferences JSONB DEFAULT '{
        "communicationStyle": "professional",
        "learningStyle": "visual", 
        "careerGoals": [],
        "interests": [],
        "skillLevel": "intermediate",
        "timeAvailability": "moderate"
    }'::jsonb,
    
    -- Test results storage
    test_results JSONB DEFAULT '{}'::jsonb,
    
    -- Conversation history and analytics
    conversation_history JSONB DEFAULT '{
        "totalMessages": 0,
        "topics": [],
        "lastActive": null,
        "commonQuestions": [],
        "progressTracking": {}
    }'::jsonb,
    
    -- AI-generated personality insights
    personality_insights JSONB DEFAULT '{
        "strengths": [],
        "growthAreas": [],
        "workStyle": "collaborative",
        "motivators": [],
        "stressors": [],
        "communicationPreferences": []
    }'::jsonb,
    
    -- Career profile information
    career_profile JSONB DEFAULT '{
        "currentRole": null,
        "industry": null,
        "experience": "intermediate",
        "aspirations": [],
        "skillGaps": [],
        "networkingStyle": "professional"
    }'::jsonb,
    
    -- Learning profile and preferences
    learning_profile JSONB DEFAULT '{
        "completedBooks": [],
        "currentReading": [],
        "preferredFormats": ["digital", "interactive"],
        "learningPace": "moderate",
        "retentionStyle": "practical"
    }'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_updated_at ON user_profiles(updated_at);

-- Create GIN indexes for JSONB columns for efficient querying
CREATE INDEX IF NOT EXISTS idx_user_profiles_preferences ON user_profiles USING GIN (preferences);
CREATE INDEX IF NOT EXISTS idx_user_profiles_test_results ON user_profiles USING GIN (test_results);
CREATE INDEX IF NOT EXISTS idx_user_profiles_conversation_history ON user_profiles USING GIN (conversation_history);

-- Create AI interactions table for detailed conversation tracking
CREATE TABLE IF NOT EXISTS ai_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    context_used JSONB DEFAULT '{}'::jsonb,
    profile_snapshot JSONB DEFAULT '{}'::jsonb,
    confidence_score DECIMAL(3,2) DEFAULT 0.8,
    model_used VARCHAR(50) DEFAULT 'gpt-4o',
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE
);

-- Create indexes for AI interactions
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_email ON ai_interactions(user_email);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_model_used ON ai_interactions(model_used);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert demo user profile for testing
INSERT INTO user_profiles (email, name, preferences, conversation_history) 
VALUES (
    'demo@example.com',
    'Usuario Demo',
    '{
        "communicationStyle": "professional",
        "learningStyle": "visual",
        "careerGoals": ["liderazgo", "desarrollo profesional"],
        "interests": ["productividad", "comunicación"],
        "skillLevel": "intermediate",
        "timeAvailability": "moderate"
    }'::jsonb,
    '{
        "totalMessages": 0,
        "topics": [],
        "lastActive": null,
        "commonQuestions": [],
        "progressTracking": {}
    }'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Create view for user profile analytics
CREATE OR REPLACE VIEW user_profile_analytics AS
SELECT 
    email,
    name,
    (conversation_history->>'totalMessages')::integer as total_messages,
    jsonb_array_length(COALESCE(preferences->'careerGoals', '[]'::jsonb)) as career_goals_count,
    jsonb_array_length(COALESCE(preferences->'interests', '[]'::jsonb)) as interests_count,
    jsonb_object_keys(test_results) as completed_tests,
    preferences->>'skillLevel' as skill_level,
    preferences->>'learningStyle' as learning_style,
    created_at,
    updated_at
FROM user_profiles;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ai_interactions TO authenticated;
GRANT SELECT ON user_profile_analytics TO authenticated;
