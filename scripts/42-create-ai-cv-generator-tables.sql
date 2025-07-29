-- Create AI CV Generator tables
CREATE TABLE IF NOT EXISTS cv_ai_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    generation_type TEXT NOT NULL CHECK (generation_type IN ('full_cv', 'section', 'optimization', 'job_match', 'real_time_feedback')),
    input_data JSONB NOT NULL,
    ai_prompt TEXT NOT NULL,
    ai_response JSONB NOT NULL,
    target_job_description TEXT,
    target_company TEXT,
    target_industry TEXT,
    tone TEXT DEFAULT 'professional',
    language TEXT DEFAULT 'es',
    quality_score INTEGER DEFAULT 0,
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
    match_score INTEGER DEFAULT 0,
    suggested_improvements JSONB DEFAULT '[]',
    optimized_sections JSONB DEFAULT '{}',
    ats_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback history table
CREATE TABLE IF NOT EXISTS cv_feedback_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_data_id UUID,
    section_type TEXT NOT NULL,
    original_content TEXT,
    suggested_content TEXT,
    suggestion_type TEXT DEFAULT 'improvement',
    reasoning TEXT,
    applied BOOLEAN DEFAULT FALSE,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default CV templates
INSERT INTO cv_templates (name, description, industry, template_data, is_ats_optimized) VALUES
('Moderno Tech', 'Plantilla moderna optimizada para la industria tecnológica', 'technology', '{"layout": "modern", "colors": ["#3b82f6", "#1e40af"], "sections": ["header", "summary", "experience", "skills", "education", "projects"]}', true),
('Clásico Corporativo', 'Plantilla tradicional para empresas corporativas', 'corporate', '{"layout": "classic", "colors": ["#1f2937", "#374151"], "sections": ["header", "summary", "experience", "education", "skills", "certifications"]}', true),
('Creativo Startup', 'Plantilla innovadora para startups y empresas creativas', 'startup', '{"layout": "creative", "colors": ["#10b981", "#059669"], "sections": ["header", "summary", "projects", "experience", "skills", "education"]}', false),
('Formal Gobierno', 'Plantilla formal para sector público y gobierno', 'government', '{"layout": "formal", "colors": ["#374151", "#4b5563"], "sections": ["header", "summary", "experience", "education", "certifications", "skills"]}', true),
('Minimalista', 'Plantilla limpia y minimalista para cualquier industria', 'general', '{"layout": "minimal", "colors": ["#000000", "#6b7280"], "sections": ["header", "summary", "experience", "skills", "education"]}', true),
('ATS Optimizado', 'Plantilla específicamente diseñada para sistemas ATS', 'general', '{"layout": "ats", "colors": ["#000000", "#374151"], "sections": ["header", "summary", "experience", "skills", "education", "keywords"]}', true);

-- Create RLS policies
ALTER TABLE cv_ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_feedback_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_templates ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "Anyone can view templates" ON cv_templates
    FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_cv_ai_generations_user_id ON cv_ai_generations(user_id);
CREATE INDEX idx_cv_ai_generations_type ON cv_ai_generations(generation_type);
CREATE INDEX idx_cv_job_matches_user_id ON cv_job_matches(user_id);
CREATE INDEX idx_cv_feedback_history_user_id ON cv_feedback_history(user_id);
CREATE INDEX idx_cv_templates_industry ON cv_templates(industry);
