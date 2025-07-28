-- Fix profiles table and create CV-related tables
-- This script safely adds missing columns and creates all necessary tables

-- First, let's safely add missing columns to profiles table
DO $$ 
BEGIN
    -- Add missing columns to profiles table if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'first_name') THEN
        ALTER TABLE profiles ADD COLUMN first_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_name') THEN
        ALTER TABLE profiles ADD COLUMN last_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
        ALTER TABLE profiles ADD COLUMN full_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
        ALTER TABLE profiles ADD COLUMN location TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'linkedin_url') THEN
        ALTER TABLE profiles ADD COLUMN linkedin_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'github_url') THEN
        ALTER TABLE profiles ADD COLUMN github_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'portfolio_url') THEN
        ALTER TABLE profiles ADD COLUMN portfolio_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'experience_level') THEN
        ALTER TABLE profiles ADD COLUMN experience_level TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'industry') THEN
        ALTER TABLE profiles ADD COLUMN industry TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'job_title') THEN
        ALTER TABLE profiles ADD COLUMN job_title TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'skills') THEN
        ALTER TABLE profiles ADD COLUMN skills TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'created_at') THEN
        ALTER TABLE profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Create user_education table
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
    commune TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_experience table
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_projects table
CREATE TABLE IF NOT EXISTS user_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    technologies TEXT[] DEFAULT '{}',
    url TEXT,
    start_date TEXT,
    end_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_skills table
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level TEXT DEFAULT 'Intermedio',
    category TEXT DEFAULT 'Técnico',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_certifications table
CREATE TABLE IF NOT EXISTS user_certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT,
    expiry_date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_languages table
CREATE TABLE IF NOT EXISTS user_languages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    proficiency TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_awards table
CREATE TABLE IF NOT EXISTS user_awards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create CV templates table
CREATE TABLE IF NOT EXISTS cv_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    template_data JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_cvs table
CREATE TABLE IF NOT EXISTS user_cvs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    template_id UUID REFERENCES cv_templates(id),
    cv_data JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE user_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cvs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_education
DROP POLICY IF EXISTS "Users can view own education" ON user_education;
CREATE POLICY "Users can view own education" ON user_education
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own education" ON user_education;
CREATE POLICY "Users can insert own education" ON user_education
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own education" ON user_education;
CREATE POLICY "Users can update own education" ON user_education
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own education" ON user_education;
CREATE POLICY "Users can delete own education" ON user_education
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_experience
DROP POLICY IF EXISTS "Users can view own experience" ON user_experience;
CREATE POLICY "Users can view own experience" ON user_experience
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own experience" ON user_experience;
CREATE POLICY "Users can insert own experience" ON user_experience
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own experience" ON user_experience;
CREATE POLICY "Users can update own experience" ON user_experience
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own experience" ON user_experience;
CREATE POLICY "Users can delete own experience" ON user_experience
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_projects
DROP POLICY IF EXISTS "Users can view own projects" ON user_projects;
CREATE POLICY "Users can view own projects" ON user_projects
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON user_projects;
CREATE POLICY "Users can insert own projects" ON user_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON user_projects;
CREATE POLICY "Users can update own projects" ON user_projects
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON user_projects;
CREATE POLICY "Users can delete own projects" ON user_projects
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_skills
DROP POLICY IF EXISTS "Users can view own skills" ON user_skills;
CREATE POLICY "Users can view own skills" ON user_skills
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own skills" ON user_skills;
CREATE POLICY "Users can insert own skills" ON user_skills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own skills" ON user_skills;
CREATE POLICY "Users can update own skills" ON user_skills
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own skills" ON user_skills;
CREATE POLICY "Users can delete own skills" ON user_skills
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_certifications
DROP POLICY IF EXISTS "Users can view own certifications" ON user_certifications;
CREATE POLICY "Users can view own certifications" ON user_certifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own certifications" ON user_certifications;
CREATE POLICY "Users can insert own certifications" ON user_certifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own certifications" ON user_certifications;
CREATE POLICY "Users can update own certifications" ON user_certifications
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own certifications" ON user_certifications;
CREATE POLICY "Users can delete own certifications" ON user_certifications
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_languages
DROP POLICY IF EXISTS "Users can view own languages" ON user_languages;
CREATE POLICY "Users can view own languages" ON user_languages
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own languages" ON user_languages;
CREATE POLICY "Users can insert own languages" ON user_languages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own languages" ON user_languages;
CREATE POLICY "Users can update own languages" ON user_languages
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own languages" ON user_languages;
CREATE POLICY "Users can delete own languages" ON user_languages
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_awards
DROP POLICY IF EXISTS "Users can view own awards" ON user_awards;
CREATE POLICY "Users can view own awards" ON user_awards
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own awards" ON user_awards;
CREATE POLICY "Users can insert own awards" ON user_awards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own awards" ON user_awards;
CREATE POLICY "Users can update own awards" ON user_awards
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own awards" ON user_awards;
CREATE POLICY "Users can delete own awards" ON user_awards
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for cv_templates (public read)
DROP POLICY IF EXISTS "Anyone can view cv templates" ON cv_templates;
CREATE POLICY "Anyone can view cv templates" ON cv_templates
    FOR SELECT USING (is_active = true);

-- Create RLS policies for user_cvs
DROP POLICY IF EXISTS "Users can view own cvs" ON user_cvs;
CREATE POLICY "Users can view own cvs" ON user_cvs
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own cvs" ON user_cvs;
CREATE POLICY "Users can insert own cvs" ON user_cvs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cvs" ON user_cvs;
CREATE POLICY "Users can update own cvs" ON user_cvs
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own cvs" ON user_cvs;
CREATE POLICY "Users can delete own cvs" ON user_cvs
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_education_user_id ON user_education(user_id);
CREATE INDEX IF NOT EXISTS idx_user_experience_user_id ON user_experience(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certifications_user_id ON user_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_languages_user_id ON user_languages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_awards_user_id ON user_awards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cvs_user_id ON user_cvs(user_id);

-- Create update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_education_updated_at ON user_education;
CREATE TRIGGER update_user_education_updated_at BEFORE UPDATE ON user_education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_experience_updated_at ON user_experience;
CREATE TRIGGER update_user_experience_updated_at BEFORE UPDATE ON user_experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_projects_updated_at ON user_projects;
CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_skills_updated_at ON user_skills;
CREATE TRIGGER update_user_skills_updated_at BEFORE UPDATE ON user_skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_certifications_updated_at ON user_certifications;
CREATE TRIGGER update_user_certifications_updated_at BEFORE UPDATE ON user_certifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_languages_updated_at ON user_languages;
CREATE TRIGGER update_user_languages_updated_at BEFORE UPDATE ON user_languages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_awards_updated_at ON user_awards;
CREATE TRIGGER update_user_awards_updated_at BEFORE UPDATE ON user_awards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cv_templates_updated_at ON cv_templates;
CREATE TRIGGER update_cv_templates_updated_at BEFORE UPDATE ON cv_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_cvs_updated_at ON user_cvs;
CREATE TRIGGER update_user_cvs_updated_at BEFORE UPDATE ON user_cvs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default CV templates
INSERT INTO cv_templates (name, description, template_data) VALUES
('modern', 'Plantilla Moderna', '{"style": "modern", "colors": {"primary": "#3b82f6", "secondary": "#64748b"}}'),
('classic', 'Plantilla Clásica', '{"style": "classic", "colors": {"primary": "#1f2937", "secondary": "#6b7280"}}'),
('creative', 'Plantilla Creativa', '{"style": "creative", "colors": {"primary": "#ef4444", "secondary": "#f97316"}}'),
('minimal', 'Plantilla Minimalista', '{"style": "minimal", "colors": {"primary": "#000000", "secondary": "#6b7280"}}')
ON CONFLICT DO NOTHING;

-- Create demo data for Travis (DTC founder)
DO $$
DECLARE
    travis_user_id UUID;
BEGIN
    -- Check if Travis user exists, if not create demo data
    SELECT id INTO travis_user_id FROM auth.users WHERE email = 'travis@dtc.com' LIMIT 1;
    
    IF travis_user_id IS NOT NULL THEN
        -- Insert/Update Travis profile
        INSERT INTO profiles (
            user_id, 
            first_name, 
            last_name, 
            full_name, 
            phone, 
            location, 
            bio, 
            linkedin_url, 
            github_url, 
            portfolio_url,
            experience_level,
            industry,
            job_title
        ) VALUES (
            travis_user_id,
            'Travis',
            'Mendoza',
            'Travis Mendoza',
            '+56 9 8765 4321',
            'Santiago, Chile',
            'Fundador y CEO de DTC (Desarrollo de Talento Chileno), plataforma líder en desarrollo profesional para el mercado chileno. Emprendedor serial con más de 10 años de experiencia en tecnología y educación. Apasionado por democratizar el acceso a oportunidades de crecimiento profesional en Chile.',
            'linkedin.com/in/travis-mendoza-dtc',
            'github.com/travis-dtc',
            'travis-mendoza.com',
            'Senior',
            'EdTech',
            'CEO & Founder'
        ) ON CONFLICT (user_id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            full_name = EXCLUDED.full_name,
            phone = EXCLUDED.phone,
            location = EXCLUDED.location,
            bio = EXCLUDED.bio,
            linkedin_url = EXCLUDED.linkedin_url,
            github_url = EXCLUDED.github_url,
            portfolio_url = EXCLUDED.portfolio_url,
            experience_level = EXCLUDED.experience_level,
            industry = EXCLUDED.industry,
            job_title = EXCLUDED.job_title,
            updated_at = NOW();

        -- Insert Travis education
        INSERT INTO user_education (user_id, degree, institution, location, start_date, end_date, gpa, institution_type, commune, description) VALUES
        (travis_user_id, 'MBA en Gestión de Negocios', 'Universidad Adolfo Ibáñez', 'Santiago, Chile', '2018-03', '2020-12', '6.8', 'Universidad Privada', 'Las Condes', 'Especialización en emprendimiento y gestión de startups tecnológicas. Tesis sobre el ecosistema emprendedor chileno.'),
        (travis_user_id, 'Ingeniería Civil Industrial', 'Pontificia Universidad Católica de Chile', 'Santiago, Chile', '2012-03', '2017-12', '6.5', 'Universidad Privada', 'Providencia', 'Mención en Tecnologías de Información. Proyecto de título sobre plataformas educativas digitales.')
        ON CONFLICT DO NOTHING;

        -- Insert Travis experience
        INSERT INTO user_experience (user_id, title, company, location, start_date, end_date, is_current, description, achievements) VALUES
        (travis_user_id, 'CEO & Founder', 'DTC - Desarrollo de Talento Chileno', 'Santiago, Chile', '2021-01', '', true, 'Fundé y lidero DTC, la plataforma de desarrollo profesional más innovadora de Chile. Dirijo un equipo multidisciplinario enfocado en democratizar el acceso a oportunidades de crecimiento profesional para trabajadores chilenos.', ARRAY[
            'Lancé la plataforma que ha impactado a más de 50,000 profesionales chilenos',
            'Levanté $2M USD en financiamiento de inversionistas locales e internacionales',
            'Establecí alianzas estratégicas con más de 200 empresas chilenas',
            'Desarrollé el primer sistema de evaluación de habilidades adaptado al mercado laboral chileno',
            'Creé una biblioteca digital con más de 500 recursos de desarrollo profesional'
        ]),
        (travis_user_id, 'Director de Producto', 'Cornershop by Uber', 'Santiago, Chile', '2019-06', '2020-12', false, 'Lideré el desarrollo de productos digitales para el mercado latinoamericano, enfocándome en la experiencia del usuario y el crecimiento del negocio en Chile y la región.', ARRAY[
            'Aumenté la retención de usuarios en 35% mediante mejoras en UX',
            'Lideré el lanzamiento de nuevas categorías de productos que generaron $5M USD adicionales',
            'Gestioné un equipo de 15 personas entre diseñadores, desarrolladores y analistas',
            'Implementé metodologías ágiles que redujeron el time-to-market en 40%'
        ]),
        (travis_user_id, 'Senior Product Manager', 'NotCo', 'Santiago, Chile', '2017-08', '2019-05', false, 'Desarrollé estrategias de producto para la expansión de NotCo en el mercado chileno y latinoamericano, trabajando en la intersección de tecnología, alimentación y sostenibilidad.', ARRAY[
            'Lancé 8 nuevos productos que alcanzaron $10M USD en ventas anuales',
            'Desarrollé la estrategia de go-to-market para mercados internacionales',
            'Colaboré con el equipo de IA para optimizar formulaciones de productos',
            'Establecí partnerships con retailers que aumentaron la distribución en 200%'
        ])
        ON CONFLICT DO NOTHING;

        -- Insert Travis projects
        INSERT INTO user_projects (user_id, name, description, technologies, url, start_date, end_date) VALUES
        (travis_user_id, 'DTC Platform', 'Plataforma integral de desarrollo profesional que incluye evaluaciones de personalidad, construcción de CV, búsqueda de empleo y coaching de carrera. Diseñada específicamente para el mercado laboral chileno.', ARRAY['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Vercel'], 'dtc-platform.com', '2020-09', '2024-01'),
        (travis_user_id, 'ChileJobs API', 'API que integra las principales bolsas de trabajo chilenas (Trabajando.com, GetOnBoard, Laborum) para proporcionar búsqueda unificada de empleos con filtros específicos del mercado local.', ARRAY['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'AWS'], 'github.com/dtc/chilejobs-api', '2021-03', '2021-08'),
        (travis_user_id, 'Talent Analytics Dashboard', 'Dashboard de analytics para empresas chilenas que permite analizar tendencias del mercado laboral, salarios y demanda de habilidades en tiempo real.', ARRAY['React', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL', 'Tableau'], 'analytics.dtc.com', '2022-01', '2022-06')
        ON CONFLICT DO NOTHING;

        -- Insert Travis skills
        INSERT INTO user_skills (user_id, name, level, category) VALUES
        (travis_user_id, 'Liderazgo Estratégico', 'Experto', 'Liderazgo'),
        (travis_user_id, 'Gestión de Productos', 'Experto', 'Negocio'),
        (travis_user_id, 'Emprendimiento', 'Experto', 'Negocio'),
        (travis_user_id, 'Fundraising', 'Avanzado', 'Negocio'),
        (travis_user_id, 'JavaScript', 'Avanzado', 'Técnico'),
        (travis_user_id, 'React', 'Avanzado', 'Técnico'),
        (travis_user_id, 'Product Strategy', 'Experto', 'Negocio'),
        (travis_user_id, 'Data Analysis', 'Avanzado', 'Técnico'),
        (travis_user_id, 'UX/UI Design', 'Intermedio', 'Técnico'),
        (travis_user_id, 'Comunicación Pública', 'Experto', 'Comunicación'),
        (travis_user_id, 'Negociación', 'Avanzado', 'Comunicación'),
        (travis_user_id, 'Gestión de Equipos', 'Experto', 'Liderazgo'),
        (travis_user_id, 'Inglés', 'Experto', 'Idiomas'),
        (travis_user_id, 'Español', 'Experto', 'Idiomas')
        ON CONFLICT DO NOTHING;

        -- Insert Travis certifications
        INSERT INTO user_certifications (user_id, name, issuer, issue_date, credential_url) VALUES
        (travis_user_id, 'Certified Product Manager', 'Product Management Institute', '2019-08', 'pmi.org/certifications/travis-mendoza'),
        (travis_user_id, 'AWS Solutions Architect', 'Amazon Web Services', '2020-03', 'aws.amazon.com/certification/travis-mendoza'),
        (travis_user_id, 'Scrum Master Certified', 'Scrum Alliance', '2018-11', 'scrumalliance.org/travis-mendoza'),
        (travis_user_id, 'Google Analytics Certified', 'Google', '2021-05', 'analytics.google.com/travis-mendoza')
        ON CONFLICT DO NOTHING;

        -- Insert Travis languages
        INSERT INTO user_languages (user_id, language, proficiency) VALUES
        (travis_user_id, 'Español', 'Nativo'),
        (travis_user_id, 'Inglés', 'Avanzado'),
        (travis_user_id, 'Portugués', 'Intermedio')
        ON CONFLICT DO NOTHING;

        -- Insert Travis awards
        INSERT INTO user_awards (user_id, name, issuer, date, description) VALUES
        (travis_user_id, 'Emprendedor del Año', 'Revista Capital', '2023-11', 'Reconocimiento como el emprendedor más destacado del año en el sector EdTech chileno.'),
        (travis_user_id, '40 Under 40', 'AmericaEconomia', '2022-09', 'Incluido en la lista de los 40 líderes menores de 40 años más influyentes de Latinoamérica.'),
        (travis_user_id, 'Innovation Award', 'Startup Chile', '2021-12', 'Premio a la innovación por el desarrollo de la plataforma DTC y su impacto en el mercado laboral chileno.')
        ON CONFLICT DO NOTHING;

    END IF;
END $$;

-- Create a sample CV for Travis
DO $$
DECLARE
    travis_user_id UUID;
    modern_template_id UUID;
BEGIN
    SELECT id INTO travis_user_id FROM auth.users WHERE email = 'travis@dtc.com' LIMIT 1;
    SELECT id INTO modern_template_id FROM cv_templates WHERE name = 'modern' LIMIT 1;
    
    IF travis_user_id IS NOT NULL AND modern_template_id IS NOT NULL THEN
        INSERT INTO user_cvs (user_id, title, template_id, cv_data) VALUES
        (travis_user_id, 'CV Ejecutivo - Travis Mendoza', modern_template_id, '{
            "personalInfo": {
                "firstName": "Travis",
                "lastName": "Mendoza",
                "email": "travis@dtc.com",
                "phone": "+56 9 8765 4321",
                "location": "Santiago, Chile",
                "bio": "Fundador y CEO de DTC, plataforma líder en desarrollo profesional para el mercado chileno.",
                "linkedinUrl": "linkedin.com/in/travis-mendoza-dtc",
                "githubUrl": "github.com/travis-dtc",
                "portfolioUrl": "travis-mendoza.com"
            },
            "template": "modern",
            "lastUpdated": "2024-01-15"
        }')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Final verification and cleanup
ANALYZE profiles;
ANALYZE user_education;
ANALYZE user_experience;
ANALYZE user_projects;
ANALYZE user_skills;
ANALYZE user_certifications;
ANALYZE user_languages;
ANALYZE user_awards;
ANALYZE cv_templates;
ANALYZE user_cvs;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Created all CV-related tables with proper RLS policies';
    RAISE NOTICE 'Added demo data for Travis Mendoza (DTC Founder)';
    RAISE NOTICE 'CV Builder is ready for testing';
END $$;
