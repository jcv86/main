-- Drop existing functions to avoid parameter conflicts
DO $$ 
BEGIN
    -- Drop existing functions if they exist
    DROP FUNCTION IF EXISTS is_admin(UUID);
    DROP FUNCTION IF EXISTS get_user_role(UUID);
    DROP FUNCTION IF EXISTS assign_user_role(UUID, user_role);
    DROP FUNCTION IF EXISTS update_user_status(UUID, user_status);
    DROP FUNCTION IF EXISTS log_user_activity(UUID, TEXT, JSONB);
    DROP FUNCTION IF EXISTS log_admin_action(UUID, UUID, TEXT, JSONB);
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Drop existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
    DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
    DROP POLICY IF EXISTS "Users can view own activity" ON user_activity_logs;
    DROP POLICY IF EXISTS "Admins can view all activity" ON user_activity_logs;
    DROP POLICY IF EXISTS "Only admins can view admin actions" ON admin_actions;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Create user management tables
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'user',
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    permission TEXT NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create custom types if they don't exist
DO $$ 
BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add status column to auth.users if it doesn't exist
DO $$ 
BEGIN
    ALTER TABLE auth.users ADD COLUMN status user_status DEFAULT 'active';
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Create functions with unique parameter names
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = check_user_id AND role = 'admin'
    );
END;
$$;

CREATE OR REPLACE FUNCTION get_user_role(check_user_id UUID)
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_result user_role;
BEGIN
    SELECT role INTO user_role_result
    FROM user_roles 
    WHERE user_id = check_user_id;
    
    RETURN COALESCE(user_role_result, 'user');
END;
$$;

CREATE OR REPLACE FUNCTION assign_user_role(target_user_id UUID, new_role user_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO user_roles (user_id, role, assigned_by)
    VALUES (target_user_id, new_role, auth.uid())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        role = new_role,
        assigned_by = auth.uid(),
        assigned_at = NOW();
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION update_user_status(target_user_id UUID, new_status user_status)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE auth.users 
    SET status = new_status
    WHERE id = target_user_id;
    
    RETURN FOUND;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION log_user_activity(activity_user_id UUID, activity_action TEXT, activity_details JSONB DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO user_activity_logs (user_id, action, details)
    VALUES (activity_user_id, activity_action, activity_details);
END;
$$;

CREATE OR REPLACE FUNCTION log_admin_action(admin_user_id UUID, target_user_id UUID, admin_action TEXT, action_details JSONB DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO admin_actions (admin_id, target_user_id, action, details)
    VALUES (admin_user_id, target_user_id, admin_action, action_details);
END;
$$;

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON user_roles
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own activity" ON user_activity_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity" ON user_activity_logs
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can view admin actions" ON admin_actions
    FOR SELECT USING (is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_user_id ON admin_actions(target_user_id);

-- Set travis@nuanu.com as admin
DO $$
DECLARE
    travis_user_id UUID;
BEGIN
    -- First, try to find existing user
    SELECT id INTO travis_user_id 
    FROM auth.users 
    WHERE email = 'travis@nuanu.com';
    
    -- If user doesn't exist, create a demo entry
    IF travis_user_id IS NULL THEN
        travis_user_id := '11111111-1111-1111-1111-111111111111';
        
        -- Insert demo user if not exists
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
        VALUES (
            travis_user_id,
            'travis@nuanu.com',
            crypt('password', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"full_name": "Travis Admin"}'::jsonb
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;
    
    -- Assign admin role
    INSERT INTO user_roles (user_id, role, assigned_by, assigned_at)
    VALUES (travis_user_id, 'admin', travis_user_id, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        role = 'admin',
        assigned_by = travis_user_id,
        assigned_at = NOW();
        
    RAISE NOTICE 'Travis admin setup completed for user ID: %', travis_user_id;
END $$;

-- Create trigger to automatically log user activities
CREATE OR REPLACE FUNCTION trigger_log_user_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_user_activity(NEW.user_id, 'role_assigned', 
            jsonb_build_object('role', NEW.role, 'assigned_by', NEW.assigned_by));
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM log_user_activity(NEW.user_id, 'role_updated', 
            jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role, 'updated_by', NEW.assigned_by));
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER user_role_activity_log
    AFTER INSERT OR UPDATE ON user_roles
    FOR EACH ROW EXECUTE FUNCTION trigger_log_user_activity();
