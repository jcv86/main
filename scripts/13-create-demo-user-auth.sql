-- Create demo user in auth.users if it doesn't exist
-- Note: This would typically be done through Supabase Auth API, but for demo purposes
-- we'll create the necessary profile data

-- First, let's create a demo profile that can work without auth
INSERT INTO public.profiles (
  user_id,
  full_name,
  email,
  bio,
  location,
  phone,
  role,
  experience_level,
  career_stage,
  skills,
  interests,
  preferred_work_type,
  salary_expectation,
  availability_date,
  linkedin_url,
  github_url,
  portfolio_url,
  website_url,
  avatar_url,
  is_active,
  onboarding_completed,
  notification_preferences,
  created_at,
  updated_at,
  last_login
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Usuario Demo',
  'demo@careercoach.cl',
  'Perfil de demostración para explorar la plataforma de desarrollo profesional.',
  'Santiago, Chile',
  '+56 9 1234 5678',
  'Software Developer',
  'mid-level',
  'growth',
  ARRAY['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
  ARRAY['Desarrollo Web', 'Inteligencia Artificial', 'Startups'],
  'hybrid',
  2500000,
  CURRENT_DATE + INTERVAL '30 days',
  'https://linkedin.com/in/demo-user',
  'https://github.com/demo-user',
  'https://portfolio.demo-user.com',
  'https://demo-user.com',
  '/placeholder-user.jpg',
  true,
  true,
  '{"email": true, "push": false, "sms": false}'::jsonb,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  updated_at = NOW(),
  last_login = NOW();

-- Create some demo assessment results
INSERT INTO public.assessment_results (
  id,
  user_id,
  assessment_type,
  score,
  results,
  completed_at,
  created_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'technical_skills',
  85,
  '{"javascript": 90, "react": 85, "nodejs": 80, "python": 75, "sql": 70}'::jsonb,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'personality',
  78,
  '{"type": "ENFP", "traits": {"extraversion": 75, "intuition": 85, "feeling": 70, "perceiving": 80}}'::jsonb,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
) ON CONFLICT DO NOTHING;

-- Create some demo achievements
INSERT INTO public.achievements (
  id,
  user_id,
  title,
  description,
  category,
  icon,
  earned_at,
  created_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'First Assessment',
  'Completed your first skills assessment',
  'assessment',
  'trophy',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Profile Complete',
  'Completed your professional profile',
  'profile',
  'user-check',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days'
) ON CONFLICT DO NOTHING;
