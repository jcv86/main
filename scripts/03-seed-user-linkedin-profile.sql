-- Create sample LinkedIn profiles for authenticated users
-- This allows testing the LinkedIn integration without actual OAuth connection

-- Get the first user ID from the auth system and insert a LinkedIn profile
INSERT INTO linkedin_user_profiles (
  user_id,
  first_name,
  last_name,
  headline,
  profile_image_url,
  linkedin_url,
  skills,
  experience,
  industry,
  seniority_level,
  created_at,
  updated_at
)
SELECT 
  id,
  'Carlos' as first_name,
  'Martinez' as last_name,
  'Senior Product Manager | AI/ML Enthusiast | Scaling Tech Teams' as headline,
  'https://lh3.googleusercontent.com/a/default-user=s96-c' as profile_image_url,
  'https://linkedin.com/in/carlosmartinez' as linkedin_url,
  jsonb_build_array(
    jsonb_build_object('name', 'Product Management', 'endorsements', 45),
    jsonb_build_object('name', 'Machine Learning', 'endorsements', 32),
    jsonb_build_object('name', 'Python', 'endorsements', 28),
    jsonb_build_object('name', 'Data Analysis', 'endorsements', 38),
    jsonb_build_object('name', 'Leadership', 'endorsements', 52),
    jsonb_build_object('name', 'Strategic Planning', 'endorsements', 40)
  ) as skills,
  jsonb_build_array(
    jsonb_build_object(
      'company', 'Stripe',
      'title', 'Senior Product Manager',
      'startDate', '2021-01',
      'endDate', '2026-04',
      'description', 'Led product strategy for AI-powered payment solutions, grew adoption by 3x, managed $2M budget'
    ),
    jsonb_build_object(
      'company', 'Google',
      'title', 'Product Manager',
      'startDate', '2018-06',
      'endDate', '2021-01',
      'description', 'Managed Cloud ML products, shipped 5 major features, 40M+ users impacted'
    )
  ) as experience,
  'Technology' as industry,
  'senior' as seniority_level,
  NOW(),
  NOW()
FROM auth.users
LIMIT 1
ON CONFLICT (user_id) DO NOTHING;
