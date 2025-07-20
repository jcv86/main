-- Demo personality assessment data
INSERT INTO personality_assessments (
  id,
  user_id,
  assessment_type,
  responses,
  results,
  personality_type,
  strengths,
  growth_areas,
  career_recommendations,
  completed_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'demo@careerlaunch.com' LIMIT 1),
  'MBTI',
  '{"1": "E", "2": "N", "3": "F", "4": "P", "5": "I love working on creative projects that allow me to collaborate with diverse teams.", "6": "E", "7": "I thrive in dynamic environments with flexible schedules and open communication.", "8": "F"}',
  '{"personalityType": "ENFP", "summary": "You are an enthusiastic and creative individual with strong people skills.", "communicationStyle": "You communicate with warmth and enthusiasm, inspiring others with your vision.", "workStyle": "You prefer collaborative environments with flexibility and variety.", "leadershipPotential": "You have natural leadership abilities through inspiration and motivation."}',
  'ENFP',
  ARRAY['Creative problem solving', 'Strong interpersonal skills', 'Adaptability', 'Enthusiasm and motivation', 'Big picture thinking'],
  ARRAY['Time management', 'Attention to detail', 'Following through on routine tasks', 'Dealing with conflict'],
  ARRAY['Marketing Manager', 'Product Manager', 'UX Designer', 'Consultant', 'Teacher', 'Entrepreneur', 'HR Specialist'],
  NOW() - INTERVAL '2 days'
) ON CONFLICT DO NOTHING;

-- Demo skills assessments
INSERT INTO skills_assessments (
  id,
  user_id,
  skill_category,
  skill_name,
  assessment_type,
  score,
  max_score,
  responses,
  completed_at
) VALUES 
(
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'demo@careerlaunch.com' LIMIT 1),
  'Technical',
  'JavaScript',
  'technical',
  85,
  100,
  '{"question1": "object", "question2": "function removeDuplicates(arr) { return [...new Set(arr)]; }"}',
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'demo@careerlaunch.com' LIMIT 1),
  'Soft Skills',
  'Communication',
  'soft_skill',
  78,
  100,
  '{"scenario1": "I would break down the technical concept into simple terms and use analogies that relate to their business context.", "question1": "be-specific"}',
  NOW() - INTERVAL '3 days'
),
(
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'demo@careerlaunch.com' LIMIT 1),
  'Technical',
  'Python',
  'technical',
  72,
  100,
  '{"question1": "array", "question2": "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)"}',
  NOW() - INTERVAL '5 days'
) ON CONFLICT DO NOTHING;

-- Demo interview session
INSERT INTO interview_sessions (
  id,
  user_id,
  industry,
  position,
  questions,
  responses,
  feedback,
  overall_score,
  duration_minutes,
  completed_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'demo@careerlaunch.com' LIMIT 1),
  'Technology',
  'Frontend Developer',
  '[{"question": "Tell me about yourself", "category": "General"}, {"question": "Why are you interested in this position?", "category": "Motivation"}]',
  '{"1": "I am a passionate frontend developer with 3 years of experience building user-friendly web applications.", "2": "I am excited about this role because it combines my technical skills with my passion for creating great user experiences."}',
  '{"strengths": ["Clear communication", "Good technical knowledge", "Enthusiasm"], "improvements": ["Provide more specific examples", "Quantify achievements"], "overallFeedback": "Strong candidate with good potential"}',
  82,
  25,
  NOW() - INTERVAL '1 week'
) ON CONFLICT DO NOTHING;
