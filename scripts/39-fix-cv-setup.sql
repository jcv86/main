-- Create comprehensive CV database schema
-- This script sets up all tables needed for the CV builder functionality

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS cv_templates CASCADE;
DROP TABLE IF EXISTS cv_data CASCADE;

-- Create cv_templates table
CREATE TABLE cv_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    preview_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_data table
CREATE TABLE cv_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES cv_templates(id),
    personal_info JSONB DEFAULT '{}',
    education JSONB DEFAULT '[]',
    experience JSONB DEFAULT '[]',
    projects JSONB DEFAULT '[]',
    skills JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert CV templates
DO $$
BEGIN
    -- Insert templates only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM cv_templates WHERE name = 'Modern') THEN
        INSERT INTO cv_templates (name, description, preview_image) VALUES
        ('Modern', 'Diseño moderno con gradientes azules y layout profesional', '/cv-previews/modern.png');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM cv_templates WHERE name = 'Classic') THEN
        INSERT INTO cv_templates (name, description, preview_image) VALUES
        ('Classic', 'Diseño clásico y tradicional con tipografía serif', '/cv-previews/classic.png');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM cv_templates WHERE name = 'Creative') THEN
        INSERT INTO cv_templates (name, description, preview_image) VALUES
        ('Creative', 'Diseño creativo con colores vibrantes y elementos artísticos', '/cv-previews/creative.png');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM cv_templates WHERE name = 'Minimal') THEN
        INSERT INTO cv_templates (name, description, preview_image) VALUES
        ('Minimal', 'Diseño minimalista enfocado en tipografía y espacios limpios', '/cv-previews/minimal.png');
    END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own education" ON user_education;
DROP POLICY IF EXISTS "Users can insert own education" ON user_education;
DROP POLICY IF EXISTS "Users can update own education" ON user_education;
DROP POLICY IF EXISTS "Users can delete own education" ON user_education;

DROP POLICY IF EXISTS "Users can view own experience" ON user_experience;
DROP POLICY IF EXISTS "Users can insert own experience" ON user_experience;
DROP POLICY IF EXISTS "Users can update own experience" ON user_experience;
DROP POLICY IF EXISTS "Users can delete own experience" ON user_experience;

DROP POLICY IF EXISTS "Users can view own projects" ON user_projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON user_projects;
DROP POLICY IF EXISTS "Users can update own projects" ON user_projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON user_projects;

DROP POLICY IF EXISTS "Users can view own skills" ON user_skills;
DROP POLICY IF EXISTS "Users can insert own skills" ON user_skills;
DROP POLICY IF EXISTS "Users can update own skills" ON user_skills;
DROP POLICY IF EXISTS "Users can delete own skills" ON user_skills;

DROP POLICY IF EXISTS "Users can view own certifications" ON user_certifications;
DROP POLICY IF EXISTS "Users can insert own certifications" ON user_certifications;
DROP POLICY IF EXISTS "Users can update own certifications" ON user_certifications;
DROP POLICY IF EXISTS "Users can delete own certifications" ON user_certifications;

DROP POLICY IF EXISTS "Users can view own languages" ON user_languages;
DROP POLICY IF EXISTS "Users can insert own languages" ON user_languages;
DROP POLICY IF EXISTS "Users can update own languages" ON user_languages;
DROP POLICY IF EXISTS "Users can delete own languages" ON user_languages;

DROP POLICY IF EXISTS "Users can view own awards" ON user_awards;
DROP POLICY IF EXISTS "Users can insert own awards" ON user_awards;
DROP POLICY IF EXISTS "Users can update own awards" ON user_awards;
DROP POLICY IF EXISTS "Users can delete own awards" ON user_awards;

DROP POLICY IF EXISTS "cv_templates_select_policy" ON cv_templates;

DROP POLICY IF EXISTS "cv_data_select_policy" ON cv_data;
DROP POLICY IF EXISTS "cv_data_insert_policy" ON cv_data;
DROP POLICY IF EXISTS "cv_data_update_policy" ON cv_data;
DROP POLICY IF EXISTS "cv_data_delete_policy" ON cv_data;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = user_id);

-- Education policies
CREATE POLICY "Users can view own education" ON user_education FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own education" ON user_education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own education" ON user_education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own education" ON user_education FOR DELETE USING (auth.uid() = user_id);

-- Experience policies
CREATE POLICY "Users can view own experience" ON user_experience FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own experience" ON user_experience FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own experience" ON user_experience FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own experience" ON user_experience FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON user_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON user_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON user_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON user_projects FOR DELETE USING (auth.uid() = user_id);

-- Skills policies
CREATE POLICY "Users can view own skills" ON user_skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own skills" ON user_skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own skills" ON user_skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own skills" ON user_skills FOR DELETE USING (auth.uid() = user_id);

-- Certifications policies
CREATE POLICY "Users can view own certifications" ON user_certifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own certifications" ON user_certifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own certifications" ON user_certifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own certifications" ON user_certifications FOR DELETE USING (auth.uid() = user_id);

-- Languages policies
CREATE POLICY "Users can view own languages" ON user_languages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own languages" ON user_languages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own languages" ON user_languages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own languages" ON user_languages FOR DELETE USING (auth.uid() = user_id);

-- Awards policies
CREATE POLICY "Users can view own awards" ON user_awards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own awards" ON user_awards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own awards" ON user_awards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own awards" ON user_awards FOR DELETE USING (auth.uid() = user_id);

-- CV templates policies (public read)
CREATE POLICY "cv_templates_select_policy" ON cv_templates
    FOR SELECT USING (true);

-- User CVs policies
CREATE POLICY "cv_data_select_policy" ON cv_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cv_data_insert_policy" ON cv_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cv_data_update_policy" ON cv_data
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cv_data_delete_policy" ON cv_data
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_education_user_id ON user_education(user_id);
CREATE INDEX IF NOT EXISTS idx_user_experience_user_id ON user_experience(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certifications_user_id ON user_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_languages_user_id ON user_languages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_awards_user_id ON user_awards(user_id);
CREATE INDEX idx_cv_data_user_id ON cv_data(user_id);
CREATE INDEX idx_cv_data_template_id ON cv_data(template_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_user_education_updated_at ON user_education;
DROP TRIGGER IF EXISTS update_user_experience_updated_at ON user_experience;
DROP TRIGGER IF EXISTS update_user_projects_updated_at ON user_projects;
DROP TRIGGER IF EXISTS update_user_skills_updated_at ON user_skills;
DROP TRIGGER IF EXISTS update_user_certifications_updated_at ON user_certifications;
DROP TRIGGER IF EXISTS update_user_languages_updated_at ON user_languages;
DROP TRIGGER IF EXISTS update_user_awards_updated_at ON user_awards;
DROP TRIGGER IF EXISTS update_cv_templates_updated_at ON cv_templates;
DROP TRIGGER IF EXISTS update_cv_data_updated_at ON cv_data;

-- Apply the trigger to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_education_updated_at BEFORE UPDATE ON user_education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_experience_updated_at BEFORE UPDATE ON user_experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_skills_updated_at BEFORE UPDATE ON user_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_certifications_updated_at BEFORE UPDATE ON user_certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_languages_updated_at BEFORE UPDATE ON user_languages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_awards_updated_at BEFORE UPDATE ON user_awards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cv_templates_updated_at BEFORE UPDATE ON cv_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cv_data_updated_at BEFORE UPDATE ON cv_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
