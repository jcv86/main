-- Drop all dependent objects first, then recreate everything
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS disc_results CASCADE;
DROP TABLE IF EXISTS knowledge_base CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

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
    FOREIGN KEY (user_email) REFERENCES user_profiles(user_email) ON DELETE CASCADE
);

-- Create test_results table
CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    results JSONB NOT NULL,
    score INTEGER,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER,
    FOREIGN KEY (user_email) REFERENCES user_profiles(user_email) ON DELETE CASCADE
);

-- Create user_activities table
CREATE TABLE user_activities (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES user_profiles(user_email) ON DELETE CASCADE
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
) VALUES 
(
    'travis@dtcfinal.com',
    'Travis Johnson',
    'Senior Developer',
    'Technology',
    5,
    ARRAY['JavaScript', 'React', 'Node.js', 'Python', 'Leadership'],
    'Advance to technical leadership role and mentor junior developers',
    12,
    3
),
(
    'demo@dtcfinal.com',
    'Usuario Demo',
    'Team Member',
    'Technology',
    2,
    ARRAY['Communication', 'Problem Solving'],
    'Develop leadership skills and advance in career',
    5,
    1
),
(
    'test@dtcfinal.com',
    'Usuario Test',
    'Junior Developer',
    'Technology',
    1,
    ARRAY['Learning', 'Adaptability'],
    'Build technical skills and gain experience',
    3,
    0
);

-- Insert sample DISC results for Travis
INSERT INTO disc_results (user_email, d_score, i_score, s_score, c_score, primary_type, analysis, recommendations) VALUES
('travis@dtcfinal.com', 85, 65, 45, 75, 'Dominance', 'Strong leadership qualities with focus on results and efficiency', 'Continue developing delegation skills and emotional intelligence');

-- Insert sample test results
INSERT INTO test_results (user_email, test_type, test_name, results, score, duration_minutes) VALUES
('travis@dtcfinal.com', 'personality', 'DISC Assessment', '{"D": 85, "I": 65, "S": 45, "C": 75, "primary_style": "Dominance", "secondary_style": "Compliance"}', 85, 12),
('demo@dtcfinal.com', 'personality', 'DISC Assessment', '{"D": 45, "I": 75, "S": 65, "C": 55, "primary_style": "Influence", "secondary_style": "Steadiness"}', 75, 15);

-- Insert user activities
INSERT INTO user_activities (user_email, activity_type, activity_description, xp_earned) VALUES
('travis@dtcfinal.com', 'test_completed', 'Completed DISC Assessment with excellent results', 50),
('travis@dtcfinal.com', 'document_read', 'Read Leadership Fundamentals guide', 25),
('travis@dtcfinal.com', 'skill_learned', 'Developed advanced communication skills', 30),
('demo@dtcfinal.com', 'test_completed', 'Completed DISC Assessment', 50),
('demo@dtcfinal.com', 'document_read', 'Read Career Planning Guide', 25);

-- Insert knowledge base content
INSERT INTO knowledge_base (title, category, content, tags, difficulty_level, estimated_read_time) VALUES
('Leadership Fundamentals', 'Leadership', 'Essential principles of effective leadership including communication, delegation, and team building. This comprehensive guide covers the core competencies every leader needs to develop.', ARRAY['leadership', 'management', 'communication'], 'Beginner', 15),
('Advanced JavaScript Patterns', 'Technical', 'Deep dive into advanced JavaScript concepts including closures, prototypes, and async patterns. Learn how to write more efficient and maintainable code.', ARRAY['javascript', 'programming', 'advanced'], 'Advanced', 25),
('Career Planning Guide', 'Career Development', 'Comprehensive guide to planning your career trajectory and setting achievable goals. Includes frameworks for self-assessment and goal setting.', ARRAY['career', 'planning', 'goals'], 'Intermediate', 20),
('Effective Communication', 'Soft Skills', 'Techniques for improving workplace communication and building stronger professional relationships. Learn active listening and assertive communication.', ARRAY['communication', 'soft-skills', 'relationships'], 'Beginner', 12),
('Project Management Basics', 'Management', 'Introduction to project management methodologies and best practices. Covers Agile, Scrum, and traditional project management approaches.', ARRAY['project-management', 'methodology', 'planning'], 'Beginner', 18);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON user_profiles(user_email);
CREATE INDEX idx_disc_results_user_email ON disc_results(user_email);
CREATE INDEX idx_test_results_user_email ON test_results(user_email);
CREATE INDEX idx_user_activities_user_email ON user_activities(user_email);
CREATE INDEX idx_knowledge_base_category ON knowledge_base(category);

SELECT 'Database structure created successfully with all dependencies resolved' as status;
