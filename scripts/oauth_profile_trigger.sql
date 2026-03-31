-- OAuth Profile Enrichment Trigger
-- This trigger automatically populates user_profiles_enriched when a new user signs up via OAuth

-- Create or replace the function that handles new OAuth users
CREATE OR REPLACE FUNCTION public.handle_oauth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      CONCAT(
        COALESCE(NEW.raw_user_meta_data ->> 'given_name', ''),
        ' ',
        COALESCE(NEW.raw_user_meta_data ->> 'family_name', '')
      )
    ),
    COALESCE(
      NEW.raw_user_meta_data ->> 'avatar_url',
      NEW.raw_user_meta_data ->> 'picture'
    ),
    COALESCE(NEW.raw_app_meta_data ->> 'provider', 'email'),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, user_profiles_enriched.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles_enriched.avatar_url),
    profile_source = COALESCE(EXCLUDED.profile_source, user_profiles_enriched.profile_source),
    updated_at = NOW();

  -- Also create entry in profiles table if it exists
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
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      CONCAT(
        COALESCE(NEW.raw_user_meta_data ->> 'given_name', ''),
        ' ',
        COALESCE(NEW.raw_user_meta_data ->> 'family_name', '')
      )
    ),
    COALESCE(
      NEW.raw_user_meta_data ->> 'avatar_url',
      NEW.raw_user_meta_data ->> 'picture'
    ),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the signup
    RAISE WARNING 'handle_oauth_user trigger error: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_oauth ON auth.users;

-- Create the trigger to run after a new user is inserted
CREATE TRIGGER on_auth_user_oauth
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_oauth_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles_enriched TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
