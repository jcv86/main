-- Fix CV Builder RLS Policies and Create Complete System

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own cv_data" ON cv_data;
DROP POLICY IF EXISTS "Users can insert own cv_data" ON cv_data;
DROP POLICY IF EXISTS "Users can update own cv_data" ON cv_data;
DROP POLICY IF EXISTS "Users can delete own cv_data" ON cv_data;

-- Recreate cv_data table with proper structure
DROP TABLE IF EXISTS cv_data CASCADE;
CREATE TABLE cv_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Mi CV',
    template VARCHAR(50) NOT NULL DEFAULT 'modern',
    data JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own cv_data" ON cv_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cv_data" ON cv_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cv_data" ON cv_data
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cv_data" ON cv_data
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cv_data_updated_at BEFORE UPDATE ON cv_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create personality test results table
CREATE TABLE IF NOT EXISTS personality_test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    test_type VARCHAR(50) NOT NULL, -- 'big_five', 'disc', 'mbti', 'values'
    results JSONB NOT NULL,
    raw_answers JSONB,
    ai_analysis TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for personality tests
ALTER TABLE personality_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own personality results" ON personality_test_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personality results" ON personality_test_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own personality results" ON personality_test_results
    FOR UPDATE USING (auth.uid() = user_id);

-- Create coach memory table for persistent conversations
CREATE TABLE IF NOT EXISTS coach_memory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    memory_type VARCHAR(50) NOT NULL, -- 'personality', 'preferences', 'goals', 'history'
    key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL,
    context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, memory_type, key)
);

-- Enable RLS for coach memory
ALTER TABLE coach_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coach memory" ON coach_memory
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coach memory" ON coach_memory
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coach memory" ON coach_memory
    FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for coach memory updated_at
CREATE TRIGGER update_coach_memory_updated_at BEFORE UPDATE ON coach_memory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create test recommendations table
CREATE TABLE IF NOT EXISTS test_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    test_result_id UUID REFERENCES personality_test_results(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL, -- 'book', 'course', 'skill', 'career'
    item_id VARCHAR(255), -- ID of recommended item
    title VARCHAR(500) NOT NULL,
    description TEXT,
    reason TEXT, -- Why this was recommended
    priority INTEGER DEFAULT 1, -- 1=high, 2=medium, 3=low
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'viewed', 'completed', 'dismissed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for recommendations
ALTER TABLE test_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations" ON test_recommendations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations" ON test_recommendations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations" ON test_recommendations
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON cv_data TO authenticated;
GRANT ALL ON personality_test_results TO authenticated;
GRANT ALL ON coach_memory TO authenticated;
GRANT ALL ON test_recommendations TO authenticated;

-- Insert sample data for testing
INSERT INTO cv_data (user_id, title, template, data) 
SELECT 
    id,
    'Mi CV Profesional',
    'modern',
    '{
        "personalInfo": {
            "fullName": "Usuario Demo",
            "email": "demo@example.com",
            "phone": "+56 9 1234 5678",
            "location": "Santiago, Chile",
            "jobTitle": "Desarrollador Full Stack",
            "summary": "Desarrollador experimentado con pasión por crear soluciones innovadoras"
        },
        "experience": [],
        "education": [],
        "skills": [],
        "projects": [],
        "languages": [],
        "certifications": []
    }'::jsonb
FROM auth.users 
WHERE email = 'demo@dtcfinal.com'
ON CONFLICT DO NOTHING;
