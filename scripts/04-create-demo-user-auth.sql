-- This script provides instructions for creating the demo auth user
-- Note: This cannot be executed directly as it requires Supabase Auth API

/*
To create the demo user, you need to use Supabase Auth API or the dashboard:

1. Via Supabase Dashboard:
   - Go to Authentication > Users
   - Click "Add user"
   - Email: demo@example.com
   - Password: demo123456
   - User Metadata: {"full_name": "Demo User"}
   - Email Confirm: true

2. Via API (use this in your application):
   
   const { data, error } = await supabase.auth.admin.createUser({
     email: 'demo@example.com',
     password: 'demo123456',
     email_confirm: true,
     user_metadata: {
       full_name: 'Demo User'
     }
   })

3. The user profile will be automatically created via the trigger function
   when the auth user is created.

4. Update the demo data user_id to match the actual auth user ID:
*/

-- Update demo data with actual auth user ID (run this after creating auth user)
-- Replace 'ACTUAL_AUTH_USER_ID' with the real UUID from auth.users

/*
UPDATE users SET id = 'ACTUAL_AUTH_USER_ID' WHERE email = 'demo@example.com';
UPDATE personality_assessments SET user_id = 'ACTUAL_AUTH_USER_ID' WHERE user_id = '00000000-0000-0000-0000-000000000001';
UPDATE skills_assessments SET user_id = 'ACTUAL_AUTH_USER_ID' WHERE user_id = '00000000-0000-0000-0000-000000000001';
UPDATE interview_sessions SET user_id = 'ACTUAL_AUTH_USER_ID' WHERE user_id = '00000000-0000-0000-0000-000000000001';
UPDATE coaching_conversations SET user_id = 'ACTUAL_AUTH_USER_ID' WHERE user_id = '00000000-0000-0000-0000-000000000001';
UPDATE user_progress SET user_id = 'ACTUAL_AUTH_USER_ID' WHERE user_id = '00000000-0000-0000-0000-000000000001';
UPDATE job_recommendations SET user_id = 'ACTUAL_AUTH_USER_ID' WHERE user_id = '00000000-0000-0000-0000-000000000001';
*/

-- Note: This script is for reference only
-- The demo user should be created through Supabase Auth dashboard or API
-- Email: demo@example.com
-- Password: demo123456

-- After creating the user in Supabase Auth, the trigger will automatically
-- create the corresponding record in the users table

-- You can also create the user programmatically:
/*
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'demo@example.com',
  crypt('demo123456', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Demo User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
*/

-- Note: This is just for reference. Use Supabase Auth methods to create users properly.
