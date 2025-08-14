-- Fix user profiles and authentication system
-- This script ensures proper user profile creation and foreign key relationships

-- First, let's check if we have the auth schema and users table
DO $$
BEGIN
    -- Create profiles table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        CREATE TABLE public.profiles (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            email TEXT NOT NULL,
            full_name TEXT,
            avatar_url TEXT,
            role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
END $$;

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to ensure user profile exists
CREATE OR REPLACE FUNCTION public.ensure_user_profile(user_id UUID, user_email TEXT DEFAULT NULL)
RETURNS UUID AS $$
DECLARE
    profile_exists BOOLEAN;
    user_record RECORD;
BEGIN
    -- Check if profile already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = user_id) INTO profile_exists;
    
    IF NOT profile_exists THEN
        -- Try to get user info from auth.users if email not provided
        IF user_email IS NULL THEN
            SELECT email INTO user_email FROM auth.users WHERE id = user_id;
        END IF;
        
        -- Create profile with available information
        INSERT INTO public.profiles (id, email, full_name)
        VALUES (
            user_id,
            COALESCE(user_email, 'user@example.com'),
            COALESCE(user_email, 'User')
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some test users to ensure we have valid user_ids
-- These are demo users for development/testing
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    'demo@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- Ensure profiles exist for test users
SELECT public.ensure_user_profile('550e8400-e29b-41d4-a716-446655440000'::uuid, 'demo@example.com');

-- Update user_book_progress table to have proper foreign key constraints
ALTER TABLE user_book_progress DROP CONSTRAINT IF EXISTS user_book_progress_user_id_fkey;
ALTER TABLE user_book_progress ADD CONSTRAINT user_book_progress_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update other tables that reference user_id
DO $$
DECLARE
    table_name TEXT;
    tables_to_update TEXT[] := ARRAY[
        'user_book_bookmarks',
        'coaching_conversations',
        'test_results',
        'cv_data',
        'goals',
        'calendar_events',
        'job_alerts',
        'mirix_memories'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables_to_update
    LOOP
        -- Check if table exists before modifying
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = table_name) THEN
            -- Drop existing foreign key constraint
            EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I_user_id_fkey', table_name, table_name);
            -- Add new foreign key constraint
            EXECUTE format('ALTER TABLE %I ADD CONSTRAINT %I_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE', table_name, table_name);
        END IF;
    END LOOP;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(UUID, TEXT) TO anon, authenticated;

-- Update RLS policies for user_book_progress to be more permissive during development
DROP POLICY IF EXISTS "Users can manage their own book progress" ON user_book_progress;
CREATE POLICY "Users can manage their own book progress" ON user_book_progress
    FOR ALL USING (true); -- Temporarily permissive for development

-- Update RLS policies for user_book_bookmarks
DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON user_book_bookmarks;
CREATE POLICY "Users can manage their own bookmarks" ON user_book_bookmarks
    FOR ALL USING (true); -- Temporarily permissive for development

-- Ensure we have some sample progress data
INSERT INTO user_book_progress (
    id,
    user_id,
    book_id,
    current_chapter,
    progress_percentage,
    last_read_at,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000'::uuid,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    1,
    15.5,
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_book_progress_user_id ON user_book_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_book_progress_book_id ON user_book_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_user_book_bookmarks_user_id ON user_book_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

COMMIT;
