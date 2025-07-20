-- Insert demo user (this will be handled by auth, but we can prepare the profile)
-- The actual user creation happens through Supabase Auth

-- Demo achievements data
INSERT INTO achievements (id, user_id, title, description, category, icon, earned_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'First Steps', 'Completed your first personality assessment', 'milestone', 'star', NOW() - INTERVAL '5 days'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Skill Explorer', 'Assessed skills in 5 different categories', 'skills', 'target', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Goal Setter', 'Created your first career goal', 'goals', 'flag', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Interview Ready', 'Completed 3 practice interviews', 'interview', 'user-check', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Consistent Learner', 'Used the platform for 7 consecutive days', 'engagement', 'zap', NOW())
ON CONFLICT (id) DO NOTHING;

-- Demo career goals
INSERT INTO career_goals (id, user_id, title, description, target_date, status, priority, progress) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Learn TypeScript', 'Master TypeScript for better code quality and career advancement', '2024-03-01', 'active', 'high', 60),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Get AWS Certification', 'Obtain AWS Solutions Architect Associate certification', '2024-06-01', 'active', 'medium', 40),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Build Portfolio Website', 'Create a professional portfolio showcasing my projects', '2024-02-15', 'completed', 'high', 100),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Network with Industry Professionals', 'Connect with 50 professionals in my field', '2024-12-31', 'active', 'low', 25)
ON CONFLICT (id) DO NOTHING;

-- Demo skills assessments
INSERT INTO skills_assessments (id, user_id, skill_name, category, level, notes) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'JavaScript', 'Programming', 8, 'Strong foundation with ES6+ features'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'React', 'Frontend', 7, 'Experienced with hooks and state management'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Node.js', 'Backend', 6, 'Good understanding of server-side development'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'SQL', 'Database', 7, 'Proficient in complex queries and optimization'),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Project Management', 'Soft Skills', 6, 'Experience leading small teams'),
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Communication', 'Soft Skills', 8, 'Strong written and verbal communication'),
('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Problem Solving', 'Soft Skills', 9, 'Excellent analytical and critical thinking'),
('770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', 'Git', 'Tools', 7, 'Proficient with version control workflows')
ON CONFLICT (id) DO NOTHING;

-- Demo personality result
INSERT INTO personality_results (id, user_id, personality_type, traits, strengths, areas_for_growth, career_suggestions) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'INTJ-A', 
'{"openness": 85, "conscientiousness": 90, "extraversion": 35, "agreeableness": 70, "neuroticism": 25}',
'{"Strategic thinking", "Independent work", "Problem solving", "Long-term planning", "Technical expertise"}',
'{"Team collaboration", "Public speaking", "Networking", "Flexibility with change", "Delegation"}',
'{"Software Architect", "Technical Lead", "Product Manager", "Data Scientist", "Research & Development"}'
)
ON CONFLICT (id) DO NOTHING;

-- Demo interview sessions
INSERT INTO interview_sessions (id, user_id, job_role, difficulty_level, score, duration_minutes, completed_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Frontend Developer', 'medium', 85, 45, NOW() - INTERVAL '3 days'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Full Stack Developer', 'hard', 78, 60, NOW() - INTERVAL '1 day'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Software Engineer', 'medium', 92, 50, NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- Demo coaching sessions
INSERT INTO coaching_sessions (id, user_id, topic, summary, session_duration_minutes) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Career Transition Strategy', 'Discussed transitioning from junior to mid-level developer role', 30),
('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Interview Preparation', 'Practiced behavioral questions and technical problem-solving', 45)
ON CONFLICT (id) DO NOTHING;

-- Demo job recommendations
INSERT INTO job_recommendations (id, user_id, job_title, company_name, location, salary_range, match_score, is_bookmarked) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Senior Frontend Developer', 'TechCorp Inc.', 'San Francisco, CA', '$120,000 - $150,000', 92, true),
('bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Full Stack Engineer', 'StartupXYZ', 'Remote', '$100,000 - $130,000', 88, true),
('bb0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'React Developer', 'Digital Agency', 'New York, NY', '$90,000 - $120,000', 85, false),
('bb0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Software Engineer', 'Enterprise Solutions', 'Austin, TX', '$110,000 - $140,000', 90, true),
('bb0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Frontend Architect', 'Innovation Labs', 'Seattle, WA', '$140,000 - $170,000', 87, false)
ON CONFLICT (id) DO NOTHING;
