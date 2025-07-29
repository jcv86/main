-- Fix AI CV Generator setup with corrected syntax
-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS cv_feedback_history CASCADE;
DROP TABLE IF EXISTS cv_job_matches CASCADE;
DROP TABLE IF EXISTS cv_ai_generations CASCADE;
DROP TABLE IF EXISTS cv_generation_history CASCADE;
DROP TABLE IF EXISTS cv_templates CASCADE;
DROP TABLE IF EXISTS cv_job_analysis CASCADE;

-- Ensure cv_data table exists with correct structure
CREATE TABLE IF NOT EXISTS cv_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
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

-- Create CV templates table first (no dependencies)
CREATE TABLE cv_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    industry VARCHAR(50),
    template_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CV generation history table
CREATE TABLE cv_generation_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    generation_type VARCHAR(50) NOT NULL,
    input_data JSONB NOT NULL,
    generated_content JSONB NOT NULL,
    template_id UUID,
    quality_score INTEGER DEFAULT 0,
    feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_cv_generation_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cv_generation_template FOREIGN KEY (template_id) REFERENCES cv_templates(id) ON DELETE SET NULL
);

-- Create CV job analysis table
CREATE TABLE cv_job_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    cv_data JSONB NOT NULL,
    job_description TEXT NOT NULL,
    analysis_results JSONB NOT NULL,
    compatibility_score INTEGER DEFAULT 0,
    recommendations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_cv_job_analysis_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create AI CV Generator tables
CREATE TABLE cv_ai_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    cv_data_id UUID,
    generation_type TEXT NOT NULL,
    input_data JSONB NOT NULL,
    ai_prompt TEXT NOT NULL,
    ai_response JSONB NOT NULL,
    target_job_description TEXT,
    target_company TEXT,
    target_industry TEXT,
    tone TEXT DEFAULT 'professional',
    language TEXT DEFAULT 'es',
    quality_score INTEGER DEFAULT 0,
    user_feedback INTEGER,
    applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT cv_ai_generations_generation_type_check 
        CHECK (generation_type IN ('full_cv', 'section', 'optimization', 'job_match', 'real_time_feedback')),
    CONSTRAINT cv_ai_generations_tone_check 
        CHECK (tone IN ('professional', 'creative', 'formal', 'startup', 'technical')),
    CONSTRAINT cv_ai_generations_language_check 
        CHECK (language IN ('es', 'en')),
    CONSTRAINT cv_ai_generations_quality_score_check 
        CHECK (quality_score >= 0 AND quality_score <= 100),
    CONSTRAINT cv_ai_generations_user_feedback_check 
        CHECK (user_feedback >= 1 AND user_feedback <= 5)
);

-- Create job match analysis table
CREATE TABLE cv_job_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    cv_generation_id UUID,
    job_title TEXT NOT NULL,
    company_name TEXT,
    job_description TEXT NOT NULL,
    extracted_keywords TEXT[] DEFAULT '{}',
    required_skills TEXT[] DEFAULT '{}',
    preferred_skills TEXT[] DEFAULT '{}',
    match_score INTEGER DEFAULT 0,
    suggested_improvements JSONB DEFAULT '[]',
    optimized_sections JSONB DEFAULT '{}',
    ats_score INTEGER DEFAULT 0,
    missing_keywords TEXT[] DEFAULT '{}',
    keyword_density JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT cv_job_matches_match_score_check 
        CHECK (match_score >= 0 AND match_score <= 100),
    CONSTRAINT cv_job_matches_ats_score_check 
        CHECK (ats_score >= 0 AND ats_score <= 100)
);

-- Create feedback history table
CREATE TABLE cv_feedback_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    cv_data_id UUID,
    section_type TEXT NOT NULL,
    original_content TEXT,
    suggested_content TEXT,
    suggestion_type TEXT DEFAULT 'improvement',
    priority_level TEXT DEFAULT 'medium',
    reasoning TEXT,
    applied BOOLEAN DEFAULT FALSE,
    user_rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT cv_feedback_history_section_type_check 
        CHECK (section_type IN ('summary', 'experience', 'skills', 'education', 'projects', 'certifications')),
    CONSTRAINT cv_feedback_history_suggestion_type_check 
        CHECK (suggestion_type IN ('improvement', 'quantification', 'keyword', 'tone', 'grammar', 'structure')),
    CONSTRAINT cv_feedback_history_priority_level_check 
        CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT cv_feedback_history_user_rating_check 
        CHECK (user_rating >= 1 AND user_rating <= 5)
);

-- Insert comprehensive CV templates
INSERT INTO cv_templates (name, description, category, industry, template_data) VALUES
('Moderno Tech', 'Plantilla moderna para profesionales de tecnología', 'modern', 'technology', '{"layout": "modern", "colors": {"primary": "#3b82f6", "secondary": "#1f2937"}, "sections": ["header", "summary", "experience", "skills", "education"]}'),
('Clásico Corporativo', 'Plantilla clásica para entornos corporativos', 'classic', 'corporate', '{"layout": "classic", "colors": {"primary": "#000000", "secondary": "#666666"}, "sections": ["header", "summary", "experience", "education", "skills"]}'),
('Creativo Diseño', 'Plantilla creativa para diseñadores y creativos', 'creative', 'design', '{"layout": "creative", "colors": {"primary": "#8b5cf6", "secondary": "#ec4899"}, "sections": ["header", "portfolio", "experience", "skills", "education"]}'),
('Minimalista', 'Plantilla minimalista para cualquier industria', 'minimal', 'general', '{"layout": "minimal", "colors": {"primary": "#374151", "secondary": "#9ca3af"}, "sections": ["header", "summary", "experience", "education", "skills"]}');

-- Enable RLS
ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_feedback_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_generation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_job_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own CV data" ON cv_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CV data" ON cv_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CV data" ON cv_data
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CV data" ON cv_data
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own generations" ON cv_ai_generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generations" ON cv_ai_generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generations" ON cv_ai_generations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own job matches" ON cv_job_matches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own job matches" ON cv_job_matches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback history" ON cv_feedback_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own feedback history" ON cv_feedback_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback history" ON cv_feedback_history
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cv_templates_select_policy" ON cv_templates
    FOR SELECT USING (is_active = true);

CREATE POLICY "cv_generation_history_select_policy" ON cv_generation_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cv_generation_history_insert_policy" ON cv_generation_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cv_generation_history_update_policy" ON cv_generation_history
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cv_job_analysis_select_policy" ON cv_job_analysis
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cv_job_analysis_insert_policy" ON cv_job_analysis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cv_job_analysis_update_policy" ON cv_job_analysis
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_cv_data_user_id ON cv_data(user_id);
CREATE INDEX idx_cv_data_active ON cv_data(is_active);
CREATE INDEX idx_cv_ai_generations_user_id ON cv_ai_generations(user_id);
CREATE INDEX idx_cv_ai_generations_type ON cv_ai_generations(generation_type);
CREATE INDEX idx_cv_ai_generations_created_at ON cv_ai_generations(created_at DESC);
CREATE INDEX idx_cv_job_matches_user_id ON cv_job_matches(user_id);
CREATE INDEX idx_cv_job_matches_score ON cv_job_matches(match_score DESC);
CREATE INDEX idx_cv_feedback_history_user_id ON cv_feedback_history(user_id);
CREATE INDEX idx_cv_feedback_history_section ON cv_feedback_history(section_type);
CREATE INDEX idx_cv_templates_category ON cv_templates(category);
CREATE INDEX idx_cv_templates_industry ON cv_templates(industry);
CREATE INDEX idx_cv_generation_history_user_id ON cv_generation_history(user_id);
CREATE INDEX idx_cv_generation_history_created_at ON cv_generation_history(created_at DESC);
CREATE INDEX idx_cv_job_analysis_user_id ON cv_job_analysis(user_id);
CREATE INDEX idx_cv_job_analysis_created_at ON cv_job_analysis(created_at DESC);

-- Grant necessary permissions
GRANT SELECT ON cv_templates TO authenticated;
GRANT ALL ON cv_generation_history TO authenticated;
GRANT ALL ON cv_job_analysis TO authenticated;
