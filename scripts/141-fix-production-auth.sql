-- Fix production authentication issues
-- This script ensures the database is properly set up for authentication

-- Ensure user_profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) DEFAULT 'Team Member',
    department VARCHAR(255) DEFAULT 'Technology',
    experience_years INTEGER DEFAULT 0,
    skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    career_goals TEXT DEFAULT '',
    current_level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    documents_read INTEGER DEFAULT 0,
    tests_completed INTEGER DEFAULT 0,
    skills_learned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles (email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_email ON user_profiles (user_email);

-- Insert default users for production testing
INSERT INTO user_profiles (
    email, user_email, full_name, position, department, 
    experience_years, skills, career_goals, current_level, 
    total_xp, documents_read, tests_completed, skills_learned
) VALUES 
(
    'demo@despegaturcarrera.com', 'demo@despegaturcarrera.com', 
    'Usuario Demo', 'Team Member', 'Technology', 
    2, ARRAY['JavaScript', 'React', 'Node.js'], 
    'Desarrollo profesional en tecnología', 1, 
    150, 5, 2, 3
),
(
    'travis@nuanu.com', 'travis@nuanu.com', 
    'Travis Johnson', 'Senior Developer', 'Technology', 
    5, ARRAY['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'], 
    'Liderazgo técnico y arquitectura de software', 3, 
    500, 12, 4, 8
),
(
    'test@dtc.com', 'test@dtc.com', 
    'Usuario Test', 'Team Member', 'Technology', 
    1, ARRAY['HTML', 'CSS', 'JavaScript'], 
    'Aprender desarrollo web', 1, 
    50, 2, 1, 2
),
(
    'admin@dtc.com', 'admin@dtc.com', 
    'Administrador', 'Administrator', 'Management', 
    10, ARRAY['Management', 'Strategy', 'Leadership'], 
    'Gestión organizacional', 5, 
    1000, 20, 5, 15
)
ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    position = EXCLUDED.position,
    department = EXCLUDED.department,
    updated_at = CURRENT_TIMESTAMP;

-- Ensure all required tables exist
CREATE TABLE IF NOT EXISTS test_results (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    test_type VARCHAR(50) NOT NULL,
    results JSONB NOT NULL,
    score INTEGER NOT NULL,
    completed_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS knowledge_base (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    difficulty_level VARCHAR(50) DEFAULT 'beginner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_test_results_updated_at ON test_results;
CREATE TRIGGER update_test_results_updated_at 
    BEFORE UPDATE ON test_results 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

COMMIT;
