-- Create tables for storing user CV data
-- This script creates the necessary tables for the CV builder functionality

-- User Education table
CREATE TABLE IF NOT EXISTS user_education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT,
    start_date TEXT,
    end_date TEXT,
    gpa TEXT,
    institution_type TEXT DEFAULT 'Universidad Estatal',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Experience table
CREATE TABLE IF NOT EXISTS user_experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    start_date TEXT,
    end_date TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    achievements TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Projects table
CREATE TABLE IF NOT EXISTS user_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    technologies TEXT[] DEFAULT '{}',
    url TEXT,
    start_date TEXT,
    end_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Skills table
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level TEXT DEFAULT 'Intermedio',
    category TEXT DEFAULT 'Técnica',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- User Languages table
CREATE TABLE IF NOT EXISTS user_languages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- User Certifications table
CREATE TABLE IF NOT EXISTS user_certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Awards table
CREATE TABLE IF NOT EXISTS user_awards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_education_user_id ON user_education(user_id);
CREATE INDEX IF NOT EXISTS idx_user_experience_user_id ON user_experience(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_languages_user_id ON user_languages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certifications_user_id ON user_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_awards_user_id ON user_awards(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE user_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_awards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Education policies
CREATE POLICY "Users can view their own education" ON user_education
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own education" ON user_education
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own education" ON user_education
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own education" ON user_education
    FOR DELETE USING (auth.uid() = user_id);

-- Experience policies
CREATE POLICY "Users can view their own experience" ON user_experience
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own experience" ON user_experience
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own experience" ON user_experience
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own experience" ON user_experience
    FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view their own projects" ON user_projects
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON user_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON user_projects
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON user_projects
    FOR DELETE USING (auth.uid() = user_id);

-- Skills policies
CREATE POLICY "Users can view their own skills" ON user_skills
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own skills" ON user_skills
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skills" ON user_skills
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills" ON user_skills
    FOR DELETE USING (auth.uid() = user_id);

-- Languages policies
CREATE POLICY "Users can view their own languages" ON user_languages
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own languages" ON user_languages
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own languages" ON user_languages
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own languages" ON user_languages
    FOR DELETE USING (auth.uid() = user_id);

-- Certifications policies
CREATE POLICY "Users can view their own certifications" ON user_certifications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own certifications" ON user_certifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own certifications" ON user_certifications
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own certifications" ON user_certifications
    FOR DELETE USING (auth.uid() = user_id);

-- Awards policies
CREATE POLICY "Users can view their own awards" ON user_awards
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own awards" ON user_awards
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own awards" ON user_awards
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own awards" ON user_awards
    FOR DELETE USING (auth.uid() = user_id);

-- Insert sample data for travis@nuanu.com
DO $$
DECLARE
    travis_user_id UUID;
BEGIN
    -- Get travis user ID
    SELECT id INTO travis_user_id FROM auth.users WHERE email = 'travis@nuanu.com';
    
    IF travis_user_id IS NOT NULL THEN
        -- Insert sample education for Travis
        INSERT INTO user_education (user_id, degree, institution, location, start_date, end_date, gpa, institution_type, description)
        VALUES 
        (travis_user_id, 'Ingeniería Civil en Computación', 'Universidad de Chile', 'Santiago, Chile', '2018-03', '2023-12', '6.2', 'Universidad Estatal', 'Formación integral en ciencias de la computación con enfoque en desarrollo de software y sistemas distribuidos.'),
        (travis_user_id, 'Certificación AWS Solutions Architect', 'Amazon Web Services', 'Online', '2023-06', '2023-08', '', 'Certificación', 'Certificación profesional en arquitectura de soluciones cloud con AWS.')
        ON CONFLICT DO NOTHING;

        -- Insert sample experience for Travis
        INSERT INTO user_experience (user_id, title, company, location, start_date, end_date, is_current, description, achievements)
        VALUES 
        (travis_user_id, 'Senior Software Engineer', 'DespegaTuCarrera', 'Santiago, Chile', '2023-01', '', true, 'Lidero el desarrollo de la plataforma de desarrollo profesional con IA más innovadora de Chile, enfocada en ayudar a profesionales a acelerar sus carreras.', ARRAY['Arquitectura de sistema de IA para evaluaciones de personalidad', 'Implementación de tests DISC con procesamiento de audio', 'Desarrollo de recomendaciones personalizadas con ML', 'Liderazgo técnico de equipo de 5 desarrolladores']),
        (travis_user_id, 'Full Stack Developer', 'Startup Tech Chile', 'Santiago, Chile', '2021-06', '2022-12', false, 'Desarrollo de aplicaciones web modernas para el mercado chileno utilizando React, Node.js y tecnologías cloud.', ARRAY['Desarrollo de MVP que alcanzó 10K usuarios en 6 meses', 'Implementación de arquitectura serverless en AWS', 'Optimización de performance que redujo tiempo de carga en 60%'])
        ON CONFLICT DO NOTHING;

        -- Insert sample projects for Travis
        INSERT INTO user_projects (user_id, name, description, technologies, url, start_date, end_date)
        VALUES 
        (travis_user_id, 'DespegaTuCarrera Platform', 'Plataforma integral de desarrollo profesional con IA que incluye tests de personalidad, recomendaciones de carrera y coaching personalizado.', ARRAY['React', 'Next.js', 'TypeScript', 'Supabase', 'OpenAI API', 'Tailwind CSS'], 'https://github.com/dtc/platform', '2023-01', ''),
        (travis_user_id, 'Chilean Job Market Analyzer', 'Sistema de análisis del mercado laboral chileno que integra datos de múltiples portales de empleo para generar insights sobre tendencias salariales y demanda de habilidades.', ARRAY['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Apache Airflow'], 'https://github.com/travis/job-analyzer', '2022-08', '2023-01')
        ON CONFLICT DO NOTHING;

        -- Insert sample skills for Travis
        INSERT INTO user_skills (user_id, name, level, category)
        VALUES 
        (travis_user_id, 'JavaScript', 'Avanzado', 'Técnica'),
        (travis_user_id, 'TypeScript', 'Avanzado', 'Técnica'),
        (travis_user_id, 'React', 'Experto', 'Técnica'),
        (travis_user_id, 'Next.js', 'Avanzado', 'Técnica'),
        (travis_user_id, 'Node.js', 'Avanzado', 'Técnica'),
        (travis_user_id, 'Python', 'Intermedio', 'Técnica'),
        (travis_user_id, 'PostgreSQL', 'Avanzado', 'Técnica'),
        (travis_user_id, 'AWS', 'Intermedio', 'Técnica'),
        (travis_user_id, 'Docker', 'Intermedio', 'Técnica'),
        (travis_user_id, 'Git', 'Avanzado', 'Técnica'),
        (travis_user_id, 'Supabase', 'Avanzado', 'Técnica'),
        (travis_user_id, 'Tailwind CSS', 'Avanzado', 'Técnica'),
        (travis_user_id, 'Liderazgo Técnico', 'Avanzado', 'Blanda'),
        (travis_user_id, 'Gestión de Proyectos', 'Intermedio', 'Blanda'),
        (travis_user_id, 'Comunicación', 'Avanzado', 'Blanda'),
        (travis_user_id, 'Resolución de Problemas', 'Experto', 'Blanda')
        ON CONFLICT (user_id, name) DO NOTHING;

        -- Insert sample languages for Travis
        INSERT INTO user_languages (user_id, name, level)
        VALUES 
        (travis_user_id, 'Español', 'Nativo'),
        (travis_user_id, 'Inglés', 'Avanzado'),
        (travis_user_id, 'Portugués', 'Básico')
        ON CONFLICT (user_id, name) DO NOTHING;

        -- Insert sample certifications for Travis
        INSERT INTO user_certifications (user_id, name, issuer, date, url)
        VALUES 
        (travis_user_id, 'AWS Solutions Architect Associate', 'Amazon Web Services', '2023-08', 'https://aws.amazon.com/certification/'),
        (travis_user_id, 'React Professional Developer', 'Meta', '2022-11', 'https://developers.facebook.com/certifications/'),
        (travis_user_id, 'Scrum Master Certified', 'Scrum Alliance', '2022-05', 'https://scrumalliance.org/')
        ON CONFLICT DO NOTHING;

        -- Insert sample awards for Travis
        INSERT INTO user_awards (user_id, name, issuer, date, description)
        VALUES 
        (travis_user_id, 'Mejor Innovación Tech 2023', 'TechCrunch Chile', '2023-11', 'Reconocimiento por el desarrollo de DespegaTuCarrera como la plataforma más innovadora del año en el sector de desarrollo profesional.'),
        (travis_user_id, 'Desarrollador Destacado', 'Universidad de Chile', '2023-06', 'Premio otorgado por contribuciones excepcionales al ecosistema tecnológico chileno como egresado destacado.')
        ON CONFLICT DO NOTHING;

        -- Update the profiles table with Travis's information
        INSERT INTO profiles (user_id, first_name, last_name, full_name, phone, location, bio, linkedin_url, github_url, portfolio_url, job_title, industry, experience_level, skills, created_at, updated_at)
        VALUES (
            travis_user_id,
            'Travis',
            'Nuanu',
            'Travis Nuanu',
            '+56 9 8765 4321',
            'Santiago, Chile',
            'Senior Software Engineer y fundador de DespegaTuCarrera, la plataforma de desarrollo profesional con IA más innovadora de Chile. Especializado en desarrollo full-stack, arquitectura de sistemas y liderazgo técnico. Apasionado por crear soluciones que impacten positivamente en el crecimiento profesional de miles de chilenos.',
            'https://linkedin.com/in/travis-nuanu',
            'https://github.com/travis-nuanu',
            'https://travis-nuanu.dev',
            'Senior Software Engineer & Founder',
            'Technology',
            'Senior',
            ARRAY['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'AWS', 'Leadership'],
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            full_name = EXCLUDED.full_name,
            phone = EXCLUDED.phone,
            location = EXCLUDED.location,
            bio = EXCLUDED.bio,
            linkedin_url = EXCLUDED.linkedin_url,
            github_url = EXCLUDED.github_url,
            portfolio_url = EXCLUDED.portfolio_url,
            job_title = EXCLUDED.job_title,
            industry = EXCLUDED.industry,
            experience_level = EXCLUDED.experience_level,
            skills = EXCLUDED.skills,
            updated_at = NOW();

    END IF;
END $$;

-- Create triggers to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all CV tables
CREATE TRIGGER update_user_education_updated_at BEFORE UPDATE ON user_education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_experience_updated_at BEFORE UPDATE ON user_experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON user_education TO authenticated;
GRANT ALL ON user_experience TO authenticated;
GRANT ALL ON user_projects TO authenticated;
GRANT ALL ON user_skills TO authenticated;
GRANT ALL ON user_languages TO authenticated;
GRANT ALL ON user_certifications TO authenticated;
GRANT ALL ON user_awards TO authenticated;
