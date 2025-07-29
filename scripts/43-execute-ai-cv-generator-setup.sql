-- Execute the AI CV Generator setup
-- This script will create all necessary tables and data

-- First, ensure we have the cv_data table (if not already created)
CREATE TABLE IF NOT EXISTS cv_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    personal_info JSONB DEFAULT '{}',
    summary TEXT,
    experience JSONB DEFAULT '[]',
    education JSONB DEFAULT '[]',
    skills JSONB DEFAULT '[]',
    languages JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    projects JSONB DEFAULT '[]',
    references JSONB DEFAULT '[]',
    template_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI CV Generator tables
CREATE TABLE IF NOT EXISTS cv_ai_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_data_id UUID REFERENCES cv_data(id) ON DELETE CASCADE,
    generation_type TEXT NOT NULL CHECK (generation_type IN ('full_cv', 'section', 'optimization', 'job_match', 'real_time_feedback')),
    input_data JSONB NOT NULL,
    ai_prompt TEXT NOT NULL,
    ai_response JSONB NOT NULL,
    target_job_description TEXT,
    target_company TEXT,
    target_industry TEXT,
    tone TEXT DEFAULT 'professional' CHECK (tone IN ('professional', 'creative', 'formal', 'startup', 'technical')),
    language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en')),
    quality_score INTEGER DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
    user_feedback INTEGER CHECK (user_feedback >= 1 AND user_feedback <= 5),
    applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job match analysis table
CREATE TABLE IF NOT EXISTS cv_job_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_generation_id UUID REFERENCES cv_ai_generations(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    company_name TEXT,
    job_description TEXT NOT NULL,
    extracted_keywords TEXT[] DEFAULT '{}',
    required_skills TEXT[] DEFAULT '{}',
    preferred_skills TEXT[] DEFAULT '{}',
    match_score INTEGER DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
    suggested_improvements JSONB DEFAULT '[]',
    optimized_sections JSONB DEFAULT '{}',
    ats_score INTEGER DEFAULT 0 CHECK (ats_score >= 0 AND ats_score <= 100),
    missing_keywords TEXT[] DEFAULT '{}',
    keyword_density JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback history table
CREATE TABLE IF NOT EXISTS cv_feedback_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_data_id UUID REFERENCES cv_data(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL CHECK (section_type IN ('summary', 'experience', 'skills', 'education', 'projects', 'certifications')),
    original_content TEXT,
    suggested_content TEXT,
    suggestion_type TEXT DEFAULT 'improvement' CHECK (suggestion_type IN ('improvement', 'quantification', 'keyword', 'tone', 'grammar', 'structure')),
    priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
    reasoning TEXT,
    applied BOOLEAN DEFAULT FALSE,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CV templates table
CREATE TABLE IF NOT EXISTS cv_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    industry TEXT,
    template_data JSONB NOT NULL,
    is_ats_optimized BOOLEAN DEFAULT FALSE,
    preview_image_url TEXT,
    usage_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert comprehensive CV templates
INSERT INTO cv_templates (name, description, industry, template_data, is_ats_optimized, preview_image_url) VALUES
('Moderno Tech', 'Plantilla moderna optimizada para la industria tecnológica con diseño limpio y profesional', 'technology', 
'{"layout": "modern", "colors": {"primary": "#3b82f6", "secondary": "#1e40af", "accent": "#60a5fa"}, "fonts": {"heading": "Inter", "body": "Inter"}, "sections": ["header", "summary", "experience", "skills", "education", "projects"], "spacing": "comfortable", "style": "modern"}', 
true, '/templates/modern-tech.png'),

('Clásico Corporativo', 'Plantilla tradicional para empresas corporativas y sector financiero', 'corporate', 
'{"layout": "classic", "colors": {"primary": "#1f2937", "secondary": "#374151", "accent": "#6b7280"}, "fonts": {"heading": "Times New Roman", "body": "Times New Roman"}, "sections": ["header", "summary", "experience", "education", "skills", "certifications"], "spacing": "compact", "style": "traditional"}', 
true, '/templates/classic-corporate.png'),

('Creativo Startup', 'Plantilla innovadora para startups y empresas creativas', 'startup', 
'{"layout": "creative", "colors": {"primary": "#10b981", "secondary": "#059669", "accent": "#34d399"}, "fonts": {"heading": "Poppins", "body": "Poppins"}, "sections": ["header", "summary", "projects", "experience", "skills", "education"], "spacing": "dynamic", "style": "creative"}', 
false, '/templates/creative-startup.png'),

('Formal Gobierno', 'Plantilla formal para sector público y gobierno', 'government', 
'{"layout": "formal", "colors": {"primary": "#374151", "secondary": "#4b5563", "accent": "#9ca3af"}, "fonts": {"heading": "Times New Roman", "body": "Times New Roman"}, "sections": ["header", "summary", "experience", "education", "certifications", "skills"], "spacing": "formal", "style": "government"}', 
true, '/templates/formal-government.png'),

('Minimalista', 'Plantilla limpia y minimalista para cualquier industria', 'general', 
'{"layout": "minimal", "colors": {"primary": "#000000", "secondary": "#6b7280", "accent": "#9ca3af"}, "fonts": {"heading": "Helvetica", "body": "Helvetica"}, "sections": ["header", "summary", "experience", "skills", "education"], "spacing": "minimal", "style": "clean"}', 
true, '/templates/minimal.png'),

('ATS Optimizado', 'Plantilla específicamente diseñada para sistemas ATS', 'general', 
'{"layout": "ats", "colors": {"primary": "#000000", "secondary": "#374151", "accent": "#6b7280"}, "fonts": {"heading": "Arial", "body": "Arial"}, "sections": ["header", "summary", "experience", "skills", "education", "keywords"], "spacing": "ats", "style": "ats_friendly"}', 
true, '/templates/ats-optimized.png'),

('Salud y Medicina', 'Plantilla profesional para sector salud y medicina', 'healthcare', 
'{"layout": "professional", "colors": {"primary": "#dc2626", "secondary": "#991b1b", "accent": "#f87171"}, "fonts": {"heading": "Times New Roman", "body": "Times New Roman"}, "sections": ["header", "summary", "experience", "education", "certifications", "skills"], "spacing": "professional", "style": "medical"}', 
true, '/templates/healthcare.png'),

('Educación', 'Plantilla académica para profesionales de la educación', 'education', 
'{"layout": "academic", "colors": {"primary": "#7c3aed", "secondary": "#5b21b6", "accent": "#a78bfa"}, "fonts": {"heading": "Georgia", "body": "Georgia"}, "sections": ["header", "summary", "experience", "education", "publications", "skills"], "spacing": "academic", "style": "educational"}', 
true, '/templates/education.png');

-- Create RLS policies
ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_feedback_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_templates ENABLE ROW LEVEL SECURITY;

-- Policies for cv_data
CREATE POLICY "Users can view their own CV data" ON cv_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CV data" ON cv_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CV data" ON cv_data
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CV data" ON cv_data
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for cv_ai_generations
CREATE POLICY "Users can view their own generations" ON cv_ai_generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generations" ON cv_ai_generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generations" ON cv_ai_generations
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for cv_job_matches
CREATE POLICY "Users can view their own job matches" ON cv_job_matches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own job matches" ON cv_job_matches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for cv_feedback_history
CREATE POLICY "Users can view their own feedback history" ON cv_feedback_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own feedback history" ON cv_feedback_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback history" ON cv_feedback_history
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for cv_templates (public read)
CREATE POLICY "Anyone can view active templates" ON cv_templates
    FOR SELECT USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cv_data_user_id ON cv_data(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_data_active ON cv_data(is_active);
CREATE INDEX IF NOT EXISTS idx_cv_ai_generations_user_id ON cv_ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_ai_generations_type ON cv_ai_generations(generation_type);
CREATE INDEX IF NOT EXISTS idx_cv_ai_generations_created_at ON cv_ai_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cv_job_matches_user_id ON cv_job_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_job_matches_score ON cv_job_matches(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_cv_feedback_history_user_id ON cv_feedback_history(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_feedback_history_section ON cv_feedback_history(section_type);
CREATE INDEX IF NOT EXISTS idx_cv_templates_industry ON cv_templates(industry);
CREATE INDEX IF NOT EXISTS idx_cv_templates_ats ON cv_templates(is_ats_optimized);

-- Create functions for AI CV generation
CREATE OR REPLACE FUNCTION get_user_cv_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_generations', COUNT(*),
        'avg_quality_score', COALESCE(AVG(quality_score), 0),
        'job_matches', COUNT(DISTINCT cjm.id),
        'avg_match_score', COALESCE(AVG(cjm.match_score), 0),
        'feedback_count', (
            SELECT COUNT(*) 
            FROM cv_feedback_history 
            WHERE user_id = user_uuid
        )
    ) INTO result
    FROM cv_ai_generations cag
    LEFT JOIN cv_job_matches cjm ON cag.id = cjm.cv_generation_id
    WHERE cag.user_id = user_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update template usage
CREATE OR REPLACE FUNCTION increment_template_usage(template_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE cv_templates 
    SET usage_count = usage_count + 1,
        updated_at = NOW()
    WHERE id = template_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate ATS score
CREATE OR REPLACE FUNCTION calculate_ats_score(cv_content TEXT, job_keywords TEXT[])
RETURNS INTEGER AS $$
DECLARE
    keyword TEXT;
    found_keywords INTEGER := 0;
    total_keywords INTEGER := array_length(job_keywords, 1);
    ats_score INTEGER;
BEGIN
    IF total_keywords = 0 THEN
        RETURN 0;
    END IF;
    
    FOREACH keyword IN ARRAY job_keywords
    LOOP
        IF cv_content ILIKE '%' || keyword || '%' THEN
            found_keywords := found_keywords + 1;
        END IF;
    END LOOP;
    
    ats_score := (found_keywords * 100) / total_keywords;
    RETURN ats_score;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Insert sample data for testing (optional)
-- This will be populated when users start using the system
