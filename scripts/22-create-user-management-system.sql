-- Create user roles and permissions system
CREATE TYPE user_role AS ENUM ('admin', 'user', 'moderator');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create user_permissions table
CREATE TABLE IF NOT EXISTS public.user_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    permission TEXT NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_activity_logs table
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_actions table
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update profiles table to include status and admin fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'active',
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_roles.user_id = is_admin.user_id 
        AND role = 'admin'
    ) OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = is_admin.user_id 
        AND is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
DECLARE
    user_role_result user_role;
BEGIN
    SELECT role INTO user_role_result
    FROM public.user_roles 
    WHERE user_roles.user_id = get_user_role.user_id;
    
    IF user_role_result IS NULL THEN
        RETURN 'user'::user_role;
    END IF;
    
    RETURN user_role_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies for user_roles
CREATE POLICY "Admins can view all user roles" ON public.user_roles
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert user roles" ON public.user_roles
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update user roles" ON public.user_roles
    FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view own role" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for user_permissions
CREATE POLICY "Admins can manage all permissions" ON public.user_permissions
    FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view own permissions" ON public.user_permissions
    FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for user_activity_logs
CREATE POLICY "Admins can view all activity logs" ON public.user_activity_logs
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view own activity logs" ON public.user_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity logs" ON public.user_activity_logs
    FOR INSERT WITH CHECK (true);

-- Create RLS policies for admin_actions
CREATE POLICY "Admins can view all admin actions" ON public.admin_actions
    FOR ALL USING (public.is_admin(auth.uid()));

-- Update profiles RLS policies to allow admin access
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_user_id UUID,
    p_action TEXT,
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO public.user_activity_logs (user_id, action, details, ip_address, user_agent)
    VALUES (p_user_id, p_action, p_details, p_ip_address, p_user_agent)
    RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
    p_admin_id UUID,
    p_target_user_id UUID,
    p_action TEXT,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    action_id UUID;
BEGIN
    INSERT INTO public.admin_actions (admin_id, target_user_id, action, details)
    VALUES (p_admin_id, p_target_user_id, p_action, p_details)
    RETURNING id INTO action_id;
    
    RETURN action_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign role to user
CREATE OR REPLACE FUNCTION public.assign_user_role(
    p_user_id UUID,
    p_role user_role,
    p_assigned_by UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if assigner is admin
    IF NOT public.is_admin(p_assigned_by) THEN
        RAISE EXCEPTION 'Only admins can assign roles';
    END IF;
    
    -- Insert or update role
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (p_user_id, p_role, p_assigned_by)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        role = p_role,
        assigned_by = p_assigned_by,
        assigned_at = NOW();
    
    -- Update profile admin flag if role is admin
    UPDATE public.profiles 
    SET is_admin = (p_role = 'admin')
    WHERE user_id = p_user_id;
    
    -- Log admin action
    PERFORM public.log_admin_action(
        p_assigned_by,
        p_user_id,
        'role_assigned',
        jsonb_build_object('role', p_role)
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user status
CREATE OR REPLACE FUNCTION public.update_user_status(
    p_user_id UUID,
    p_status user_status,
    p_updated_by UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if updater is admin
    IF NOT public.is_admin(p_updated_by) THEN
        RAISE EXCEPTION 'Only admins can update user status';
    END IF;
    
    -- Update profile status
    UPDATE public.profiles 
    SET status = p_status
    WHERE user_id = p_user_id;
    
    -- Log admin action
    PERFORM public.log_admin_action(
        p_updated_by,
        p_user_id,
        'status_updated',
        jsonb_build_object('status', p_status)
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update login stats
CREATE OR REPLACE FUNCTION public.update_login_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles 
    SET 
        last_login = NOW(),
        login_count = COALESCE(login_count, 0) + 1
    WHERE user_id = NEW.id;
    
    -- Log login activity
    PERFORM public.log_user_activity(
        NEW.id,
        'user_login',
        jsonb_build_object('login_time', NOW())
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for login tracking (this would be called by auth system)
-- Note: This is a placeholder - actual implementation depends on Supabase auth hooks

-- Set travis@nuanu.com as admin
DO $$
DECLARE
    travis_user_id UUID;
BEGIN
    -- Find travis user by email
    SELECT id INTO travis_user_id 
    FROM auth.users 
    WHERE email = 'travis@nuanu.com';
    
    IF travis_user_id IS NOT NULL THEN
        -- Assign admin role
        INSERT INTO public.user_roles (user_id, role, assigned_by)
        VALUES (travis_user_id, 'admin', travis_user_id)
        ON CONFLICT (user_id) 
        DO UPDATE SET role = 'admin';
        
        -- Update profile
        UPDATE public.profiles 
        SET is_admin = true
        WHERE user_id = travis_user_id;
        
        RAISE NOTICE 'Admin role assigned to travis@nuanu.com';
    ELSE
        RAISE NOTICE 'User travis@nuanu.com not found';
    END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON public.user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON public.user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_user_id ON public.admin_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);
