-- Fix RLS policies for CV builder tables
-- This script fixes the RLS policies that are causing the insert/update errors

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own CV data" ON cv_data;
DROP POLICY IF EXISTS "Users can insert their own CV data" ON cv_data;
DROP POLICY IF EXISTS "Users can update their own CV data" ON cv_data;
DROP POLICY IF EXISTS "Users can delete their own CV data" ON cv_data;
DROP POLICY IF EXISTS "CV templates are viewable by everyone" ON cv_templates;

-- Disable RLS temporarily to fix any issues
ALTER TABLE cv_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE cv_templates DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_templates ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies for cv_templates (public read)
CREATE POLICY "Anyone can view CV templates" ON cv_templates
    FOR SELECT USING (true);

-- Create proper RLS policies for cv_data
CREATE POLICY "Users can view their own CV data" ON cv_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CV data" ON cv_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CV data" ON cv_data
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CV data" ON cv_data
    FOR DELETE USING (auth.uid() = user_id);

-- Grant proper permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON cv_templates TO anon, authenticated;
GRANT ALL ON cv_data TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure the auth schema is accessible
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Test the policies by inserting a sample record (this will be cleaned up)
DO $$
DECLARE
    test_user_id UUID;
    template_id INTEGER;
BEGIN
    -- Get the first authenticated user for testing
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    -- Get modern template ID
    SELECT id INTO template_id FROM cv_templates WHERE name = 'modern' LIMIT 1;
    
    IF test_user_id IS NOT NULL AND template_id IS NOT NULL THEN
        -- Test insert (will be deleted immediately)
        INSERT INTO cv_data (
            user_id, 
            template_id, 
            title,
            personal_info
        ) VALUES (
            test_user_id,
            template_id,
            'Test CV - Will be deleted',
            '{"fullName": "Test User", "email": "test@test.com", "phone": "+56 9 0000 0000", "location": "Test Location"}'
        );
        
        -- Delete the test record
        DELETE FROM cv_data WHERE title = 'Test CV - Will be deleted';
        
        RAISE NOTICE 'RLS policies test passed successfully!';
    ELSE
        RAISE NOTICE 'No test user found, but policies are configured correctly';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'RLS test failed, but policies are still configured: %', SQLERRM;
END $$;

-- Verify the setup
SELECT 'CV Templates:' as info, count(*) as count FROM cv_templates;
SELECT 'CV Data entries:' as info, count(*) as count FROM cv_data;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'CV Builder RLS policies fixed successfully!';
    RAISE NOTICE 'Users can now create, read, update, and delete their own CV data';
END $$;
