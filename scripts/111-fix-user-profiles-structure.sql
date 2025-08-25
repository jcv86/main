-- Drop existing tables to recreate with correct structure
DROP TABLE IF EXISTS disc_results;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS knowledge_base;

-- Create user_profiles table with all necessary columns
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    position VARCHAR(255),
    department VARCHAR(255),
    experience_years INTEGER DEFAULT 0,
    skills TEXT[],
    career_goals TEXT,
    documents_read INTEGER DEFAULT 0,
    tests_completed INTEGER DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create disc_results table
CREATE TABLE disc_results (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    d_score INTEGER NOT NULL,
    i_score INTEGER NOT NULL,
    s_score INTEGER NOT NULL,
    c_score INTEGER NOT NULL,
    primary_type VARCHAR(50),
    analysis TEXT,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES user_profiles(user_email)
);

-- Create knowledge_base table
CREATE TABLE knowledge_base (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    content TEXT,
    tags TEXT[],
    difficulty_level VARCHAR(50),
    estimated_read_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample user data
INSERT INTO user_profiles (
    user_email, 
    full_name, 
    position, 
    department, 
    experience_years, 
    skills, 
    career_goals,
    documents_read,
    tests_completed
) VALUES (
    'travis@dtcfinal.com',
    'Travis Johnson',
    'Senior Developer',
    'Technology',
    5,
    ARRAY['JavaScript', 'React', 'Node.js', 'Python', 'Leadership'],
    'Advance to technical leadership role and mentor junior developers',
    12,
    3
) ON CONFLICT (user_email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    position = EXCLUDED.position,
    department = EXCLUDED.department,
    experience_years = EXCLUDED.experience_years,
    skills = EXCLUDED.skills,
    career_goals = EXCLUDED.career_goals,
    documents_read = EXCLUDED.documents_read,
    tests_completed = EXCLUDED.tests_completed,
    updated_at = CURRENT_TIMESTAMP;

-- Insert knowledge base content
INSERT INTO knowledge_base (title, category, content, tags, difficulty_level, estimated_read_time) VALUES
('Leadership Fundamentals', 'Leadership', 'Essential principles of effective leadership including communication, delegation, and team building.', ARRAY['leadership', 'management', 'communication'], 'Beginner', 15),
('Advanced JavaScript Patterns', 'Technical', 'Deep dive into advanced JavaScript concepts including closures, prototypes, and async patterns.', ARRAY['javascript', 'programming', 'advanced'], 'Advanced', 25),
('Career Planning Guide', 'Career Development', 'Comprehensive guide to planning your career trajectory and setting achievable goals.', ARRAY['career', 'planning', 'goals'], 'Intermediate', 20),
('Effective Communication', 'Soft Skills', 'Techniques for improving workplace communication and building stronger professional relationships.', ARRAY['communication', 'soft-skills', 'relationships'], 'Beginner', 12),
('Project Management Basics', 'Management', 'Introduction to project management methodologies and best practices.', ARRAY['project-management', 'methodology', 'planning'], 'Beginner', 18);
