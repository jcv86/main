-- Create demo users for testing
-- Run this script with Supabase service role to create auth users

-- Helper function to create demo users with hashed passwords
-- Using bcrypt-style hashing (Supabase default)

-- Function to create demo users
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS TABLE(user_id UUID, email TEXT, success BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  demo_users record;
  hashed_pwd text;
BEGIN
  -- Demo user data
  FOR demo_users IN 
    VALUES 
      ('travis@nuanu.com'::text, 'travis123'::text, 'Travis'::text, 'Developer'::text),
      ('demo@despegaturcarrera.com'::text, 'demo123'::text, 'Ana'::text, 'Marketing'::text),
      ('test@dtc.com'::text, 'test123'::text, 'Carlos'::text, 'PM'::text),
      ('admin@dtc.com'::text, 'admin123'::text, 'María'::text, 'Admin'::text)
  LOOP
    -- Check if user already exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = demo_users.column1) THEN
      -- Create the user using Supabase auth
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        invited_at,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at
      ) VALUES (
        '00000000-0000-0000-0000-000000000000'::uuid,
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        demo_users.column1,
        crypt(demo_users.column2, gen_salt('bf')),
        now(),
        NULL,
        '',
        NULL,
        '',
        NULL,
        '',
        '',
        NULL,
        NULL,
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"name":"' || demo_users.column3 || '","role":"' || demo_users.column4 || '"}'::jsonb,
        false,
        now(),
        now(),
        NULL,
        NULL
      );

      -- Create corresponding user profile
      INSERT INTO public.users (
        id,
        email,
        full_name,
        created_at,
        updated_at
      ) VALUES (
        (SELECT id FROM auth.users WHERE email = demo_users.column1),
        demo_users.column1,
        demo_users.column3,
        now(),
        now()
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = demo_users.column3,
        updated_at = now();

      RETURN QUERY SELECT 
        (SELECT id FROM auth.users WHERE email = demo_users.column1)::uuid,
        demo_users.column1::text,
        true::boolean;
    ELSE
      -- User already exists, just return their ID
      RETURN QUERY SELECT 
        (SELECT id FROM auth.users WHERE email = demo_users.column1)::uuid,
        demo_users.column1::text,
        false::boolean;
    END IF;
  END LOOP;
END;
$$;

-- Execute the function
SELECT * FROM create_demo_users();

-- Verify users were created
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email IN ('travis@nuanu.com', 'demo@despegaturcarrera.com', 'test@dtc.com', 'admin@dtc.com')
ORDER BY created_at;
