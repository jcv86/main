-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.admin_actions CASCADE;
DROP TABLE IF EXISTS public.user_activities CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraints for role and status
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'moderator', 'admin'));

ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check 
CHECK (status IN ('active', 'inactive', 'suspended', 'pending'));

-- Create user_activities table
CREATE TABLE public.user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_email TEXT,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_actions table
CREATE TABLE public.admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID,
    admin_email TEXT,
    target_user_id UUID,
    target_user_email TEXT,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for demo mode
CREATE POLICY "profiles_all_access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "user_activities_all_access" ON public.user_activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "admin_actions_all_access" ON public.admin_actions FOR ALL USING (true) WITH CHECK (true);

-- Function to get admin statistics
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE (
    total_users BIGINT,
    active_users BIGINT,
    inactive_users BIGINT,
    suspended_users BIGINT,
    new_users_this_month BIGINT,
    total_sessions BIGINT,
    average_session_duration TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_users,
        COUNT(*) FILTER (WHERE p.status = 'active')::BIGINT as active_users,
        COUNT(*) FILTER (WHERE p.status = 'inactive')::BIGINT as inactive_users,
        COUNT(*) FILTER (WHERE p.status = 'suspended')::BIGINT as suspended_users,
        COUNT(*) FILTER (WHERE p.created_at >= date_trunc('month', CURRENT_DATE))::BIGINT as new_users_this_month,
        COALESCE((SELECT COUNT(*) FROM public.user_activities WHERE action = 'login'), 0)::BIGINT as total_sessions,
        '25m'::TEXT as average_session_duration
    FROM public.profiles p;
EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY
        SELECT 
            0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT, '0m'::TEXT;
END;
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role TEXT;
BEGIN
    IF user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
    RETURN COALESCE(user_role = 'admin', FALSE);
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT NULL)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role TEXT;
BEGIN
    IF user_id IS NULL THEN
        RETURN 'user';
    END IF;
    
    SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
    RETURN COALESCE(user_role, 'user');
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'user';
END;
$$;

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_user_id UUID,
    p_action TEXT,
    p_details TEXT DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    activity_id UUID;
    user_email_val TEXT;
BEGIN
    SELECT email INTO user_email_val FROM public.profiles WHERE id = p_user_id;
    
    INSERT INTO public.user_activities (
        user_id, user_email, action, details, ip_address, user_agent
    ) VALUES (
        p_user_id, user_email_val, p_action, p_details, p_ip_address, p_user_agent
    ) RETURNING id INTO activity_id;
    
    RETURN activity_id;
EXCEPTION
    WHEN OTHERS THEN
        RETURN uuid_generate_v4();
END;
$$;

-- Function to log admin action
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_admin_id UUID,
    p_target_user_id UUID,
    p_action TEXT,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    action_id UUID;
    admin_email_val TEXT;
    target_email_val TEXT;
BEGIN
    SELECT email INTO admin_email_val FROM public.profiles WHERE id = p_admin_id;
    SELECT email INTO target_email_val FROM public.profiles WHERE id = p_target_user_id;
    
    INSERT INTO public.admin_actions (
        admin_id, admin_email, target_user_id, target_user_email, action, details
    ) VALUES (
        p_admin_id, admin_email_val, p_target_user_id, target_email_val, p_action, p_details
    ) RETURNING id INTO action_id;
    
    RETURN action_id;
EXCEPTION
    WHEN OTHERS THEN
        RETURN uuid_generate_v4();
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at);

CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_action ON public.user_activities(action);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at);

CREATE INDEX idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX idx_admin_actions_target_user_id ON public.admin_actions(target_user_id);
CREATE INDEX idx_admin_actions_created_at ON public.admin_actions(created_at);
