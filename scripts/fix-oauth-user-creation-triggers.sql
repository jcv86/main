-- FIX: OAuth User Creation Triggers
-- This script fixes the "Database error saving new user" issue
-- by ensuring all triggers that run on auth.users INSERT have proper error handling

-- ======================
-- STEP 1: Drop existing problematic triggers
-- ======================

DROP TRIGGER IF EXISTS trigger_initialize_user_on_signup ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_oauth ON auth.users;

-- ======================
-- STEP 2: Create a robust unified trigger function
-- ======================

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _full_name TEXT;
  _avatar_url TEXT;
  _provider TEXT;
BEGIN
  -- Extract user metadata safely
  _full_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name',
    TRIM(CONCAT(
      COALESCE(NEW.raw_user_meta_data ->> 'given_name', ''),
      ' ',
      COALESCE(NEW.raw_user_meta_data ->> 'family_name', '')
    )),
    SPLIT_PART(NEW.email, '@', 1)
  );
  
  _avatar_url := COALESCE(
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'picture'
  );
  
  _provider := COALESCE(NEW.raw_app_meta_data ->> 'provider', 'email');

  -- 1. Insert into profiles table (required for NextAuth)
  BEGIN
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      avatar_url,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      _full_name,
      _avatar_url,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
      updated_at = NOW();
  EXCEPTION
    WHEN others THEN
      RAISE WARNING 'handle_new_auth_user: Error inserting into profiles: %', SQLERRM;
  END;

  -- 2. Insert into user_profiles_enriched table
  BEGIN
    INSERT INTO public.user_profiles_enriched (
      user_id,
      email,
      full_name,
      avatar_url,
      profile_source,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      _full_name,
      _avatar_url,
      _provider,
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, user_profiles_enriched.full_name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles_enriched.avatar_url),
      profile_source = COALESCE(EXCLUDED.profile_source, user_profiles_enriched.profile_source),
      updated_at = NOW();
  EXCEPTION
    WHEN others THEN
      RAISE WARNING 'handle_new_auth_user: Error inserting into user_profiles_enriched: %', SQLERRM;
  END;

  -- 3. Insert into users table if it exists
  BEGIN
    INSERT INTO public.users (
      id,
      email,
      full_name,
      avatar_url,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      _full_name,
      _avatar_url,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, users.full_name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
      updated_at = NOW();
  EXCEPTION
    WHEN others THEN
      RAISE WARNING 'handle_new_auth_user: Error inserting into users: %', SQLERRM;
  END;

  -- 4. Initialize A4 module progress (optional - don't fail if not needed)
  BEGIN
    INSERT INTO public.a4_module_progress (user_id, module_id, modulo_titulo, progreso_porcentaje, completado)
    VALUES (NEW.id, 'intro', 'Introducción', 0, false)
    ON CONFLICT DO NOTHING;
  EXCEPTION
    WHEN others THEN
      RAISE WARNING 'handle_new_auth_user: Error initializing a4_module_progress: %', SQLERRM;
  END;

  -- 5. Initialize A4 points history (optional - don't fail if not needed)
  BEGIN
    INSERT INTO public.a4_points_history (user_id, puntos_ganados, balance_anterior, balance_nuevo, razon)
    VALUES (NEW.id, 0, 0, 0, 'initialization')
    ON CONFLICT DO NOTHING;
  EXCEPTION
    WHEN others THEN
      RAISE WARNING 'handle_new_auth_user: Error initializing a4_points_history: %', SQLERRM;
  END;

  -- Always return NEW to allow the auth.users insert to complete
  RETURN NEW;
END;
$$;

-- ======================
-- STEP 3: Create the unified trigger
-- ======================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

-- ======================
-- STEP 4: Grant necessary permissions
-- ======================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO service_role;

-- Profiles table
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO service_role;

-- User profiles enriched
GRANT SELECT, INSERT, UPDATE ON public.user_profiles_enriched TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles_enriched TO service_role;

-- Users table
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.users TO service_role;

-- A4 tables
GRANT SELECT, INSERT, UPDATE ON public.a4_module_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.a4_module_progress TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.a4_points_history TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.a4_points_history TO service_role;

-- ======================
-- STEP 5: Ensure RLS allows service role operations
-- ======================

-- Allow service role to bypass RLS for user creation
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles_enriched ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for service_role (if they don't exist)
DO $$
BEGIN
  -- Profiles policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Service role full access to profiles'
  ) THEN
    CREATE POLICY "Service role full access to profiles" ON public.profiles
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  
  -- User profiles enriched policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles_enriched' AND policyname = 'Service role full access to user_profiles_enriched'
  ) THEN
    CREATE POLICY "Service role full access to user_profiles_enriched" ON public.user_profiles_enriched
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  
  -- Users table policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Service role full access to users'
  ) THEN
    CREATE POLICY "Service role full access to users" ON public.users
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ======================
-- VERIFICATION
-- ======================

-- Show the active trigger
SELECT tgname, tgrelid::regclass, proname 
FROM pg_trigger 
JOIN pg_proc ON pg_proc.oid = pg_trigger.tgfoid
WHERE tgrelid = 'auth.users'::regclass;
