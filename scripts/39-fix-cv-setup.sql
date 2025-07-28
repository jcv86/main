-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS cv_projects CASCADE;
DROP TABLE IF EXISTS cv_skills CASCADE;
DROP TABLE IF EXISTS cv_languages CASCADE;
DROP TABLE IF EXISTS cv_certifications CASCADE;
DROP TABLE IF EXISTS cv_awards CASCADE;
DROP TABLE IF EXISTS cv_publications CASCADE;
DROP TABLE IF EXISTS cv_experience CASCADE;
DROP TABLE IF EXISTS cv_education CASCADE;
DROP TABLE IF EXISTS saved_cvs CASCADE;

-- Create saved_cvs table
CREATE TABLE saved_cvs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    template VARCHAR(50) NOT NULL CHECK (template IN ('modern', 'classic', 'creative', 'minimal')),
    personal_info JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_education table
CREATE TABLE cv_education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cv_id UUID REFERENCES saved_cvs(id) ON DELETE CASCADE,
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_date VARCHAR(50) NOT NULL,
    end_date VARCHAR(50) NOT NULL,
    gpa VARCHAR(10),
    description TEXT,
    honors TEXT[],
    relevant_courses TEXT[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_experience table
CREATE TABLE cv_experience (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cv_id UUID REFERENCES saved_cvs(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_date VARCHAR(50) NOT NULL,
    end_date VARCHAR(50),
    description TEXT NOT NULL,
    achievements TEXT[],
    technologies TEXT[],
    responsibilities TEXT[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_projects table
CREATE TABLE cv_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cv_id UUID REFERENCES saved_cvs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT[],
    url VARCHAR(500),
    github_url VARCHAR(500),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    role VARCHAR(255),
    team_size INTEGER,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_skills table
CREATE TABLE cv_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cv_id UUID REFERENCES saved_cvs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
    category VARCHAR(100),
    years_of_experience INTEGER,
    certified BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_languages table
CREATE TABLE cv_languages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cv_id UUID REFERENCES saved_cvs(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    proficiency VARCHAR(50) NOT NULL CHECK (proficiency IN ('Básico', 'Intermedio', 'Avanzado', 'Nativo', 'Profesional')),
    certified BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_certifications table
CREATE TABLE cv_certifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cv_id UUID REFERENCES saved_cvs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date VARCHAR(50) NOT NULL,
    expiry_date VARCHAR(50),
    credential_id VARCHAR(255),
    url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_awards table
CREATE TABLE cv_awards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cv_id UUID REFERENCES saved_cvs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    date VARCHAR(50) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_publications table
CREATE TABLE cv_publications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cv_id UUID REFERENCES saved_cvs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    date VARCHAR(50) NOT NULL,
    url VARCHAR(500),
    description TEXT,
    authors TEXT[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_saved_cvs_user_id ON saved_cvs(user_id);
CREATE INDEX idx_saved_cvs_is_active ON saved_cvs(is_active);
CREATE INDEX idx_cv_education_cv_id ON cv_education(cv_id);
CREATE INDEX idx_cv_experience_cv_id ON cv_experience(cv_id);
CREATE INDEX idx_cv_projects_cv_id ON cv_projects(cv_id);
CREATE INDEX idx_cv_skills_cv_id ON cv_skills(cv_id);
CREATE INDEX idx_cv_languages_cv_id ON cv_languages(cv_id);
CREATE INDEX idx_cv_certifications_cv_id ON cv_certifications(cv_id);
CREATE INDEX idx_cv_awards_cv_id ON cv_awards(cv_id);
CREATE INDEX idx_cv_publications_cv_id ON cv_publications(cv_id);

-- Enable RLS on all tables
ALTER TABLE saved_cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_publications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for saved_cvs
CREATE POLICY "Users can view their own CVs" ON saved_cvs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CVs" ON saved_cvs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs" ON saved_cvs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CVs" ON saved_cvs
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for cv_education
CREATE POLICY "Users can view their CV education" ON cv_education
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM saved_cvs 
            WHERE saved_cvs.id = cv_education.cv_id 
            AND saved_cvs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their CV education" ON cv_education
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM saved_cvs 
            WHERE saved_cvs.id = cv_education.cv_id 
            AND saved_cvs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their CV education" ON cv_education
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM saved_cvs 
            WHERE saved_cvs.id = cv_education.cv_id 
            AND saved_cvs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their CV education" ON cv_education
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM saved_cvs 
            WHERE saved_cvs.id = cv_education.cv_id 
            AND saved_cvs.user_id = auth.uid()
        )
    );

-- Create similar RLS policies for all other CV tables
CREATE POLICY "Users can view their CV experience" ON cv_experience
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM saved_cvs 
            WHERE saved_cvs.id = cv_experience.cv_id 
            AND saved_cvs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their CV experience" ON cv_experience
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM saved_cvs 
            WHERE saved_cvs.id = cv_experience.cv_id 
            AND saved_cvs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their CV experience" ON cv_experience
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM saved_cvs 
            WHERE saved_cvs.id = cv_experience.cv_id 
            AND saved_cvs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their CV experience" ON cv_experience
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM saved_cvs 
            WHERE saved_cvs.id = cv_experience.cv_id 
            AND saved_cvs.user_id = auth.uid()
        )
    );

-- Repeat similar policies for all other tables (projects, skills, languages, certifications, awards, publications)
-- For brevity, I'll create a function to generate these policies

DO $$
DECLARE
    table_name TEXT;
    table_names TEXT[] := ARRAY['cv_projects', 'cv_skills', 'cv_languages', 'cv_certifications', 'cv_awards', 'cv_publications'];
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        EXECUTE format('
            CREATE POLICY "Users can view their %s" ON %s
                FOR SELECT USING (
                    EXISTS (
                        SELECT 1 FROM saved_cvs 
                        WHERE saved_cvs.id = %s.cv_id 
                        AND saved_cvs.user_id = auth.uid()
                    )
                );
        ', table_name, table_name, table_name);
        
        EXECUTE format('
            CREATE POLICY "Users can insert their %s" ON %s
                FOR INSERT WITH CHECK (
                    EXISTS (
                        SELECT 1 FROM saved_cvs 
                        WHERE saved_cvs.id = %s.cv_id 
                        AND saved_cvs.user_id = auth.uid()
                    )
                );
        ', table_name, table_name, table_name);
        
        EXECUTE format('
            CREATE POLICY "Users can update their %s" ON %s
                FOR UPDATE USING (
                    EXISTS (
                        SELECT 1 FROM saved_cvs 
                        WHERE saved_cvs.id = %s.cv_id 
                        AND saved_cvs.user_id = auth.uid()
                    )
                );
        ', table_name, table_name, table_name);
        
        EXECUTE format('
            CREATE POLICY "Users can delete their %s" ON %s
                FOR DELETE USING (
                    EXISTS (
                        SELECT 1 FROM saved_cvs 
                        WHERE saved_cvs.id = %s.cv_id 
                        AND saved_cvs.user_id = auth.uid()
                    )
                );
        ', table_name, table_name, table_name);
    END LOOP;
END $$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_saved_cvs_updated_at 
    BEFORE UPDATE ON saved_cvs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo data for the demo user
DO $$
DECLARE
    demo_user_id UUID := '11111111-1111-1111-1111-111111111111';
    demo_cv_id UUID;
BEGIN
    -- Insert demo CV
    INSERT INTO saved_cvs (id, user_id, title, template, personal_info, is_active)
    VALUES (
        gen_random_uuid(),
        demo_user_id,
        'CV Profesional - Juan Pérez',
        'modern',
        '{
            "fullName": "Juan Pérez González",
            "email": "juan.perez@email.com",
            "phone": "+56 9 1234 5678",
            "location": "Santiago, Chile",
            "jobTitle": "Desarrollador Full Stack Senior",
            "summary": "Desarrollador de software experimentado con 5+ años de experiencia en desarrollo full-stack en el mercado chileno, especializado en React, Node.js y tecnologías cloud. Apasionado por crear soluciones escalables y liderar equipos de desarrollo en empresas chilenas, con profundo conocimiento del ecosistema tech local.",
            "linkedin": "linkedin.com/in/juanperez",
            "github": "github.com/juanperez",
            "website": "juanperez.dev"
        }',
        true
    ) RETURNING id INTO demo_cv_id;

    -- Insert demo experience
    INSERT INTO cv_experience (cv_id, job_title, company, location, start_date, end_date, description, achievements, technologies, sort_order)
    VALUES 
    (demo_cv_id, 'Ingeniero de Software Senior', 'NotCo', 'Santiago, Chile', '2022-01', NULL, 
     'Lidero el desarrollo de aplicaciones customer-facing que sirven a 100K+ usuarios chilenos. Implementé arquitectura de microservicios reduciendo la latencia del sistema en 40%. Colaboro con equipos multiculturales adaptando productos al mercado chileno.',
     ARRAY['Reducción de latencia del sistema en 40%', 'Liderazgo de equipo de 5 desarrolladores', 'Implementación de arquitectura de microservicios'],
     ARRAY['React', 'Node.js', 'AWS', 'Docker', 'PostgreSQL'], 0),
    (demo_cv_id, 'Desarrollador de Software', 'Fintual', 'Remoto, Chile', '2020-03', '2021-12',
     'Desarrollé y mantuve aplicaciones React para servicios financieros dirigidos al mercado chileno. Colaboré con el equipo de diseño para implementar componentes UI responsivos adaptados a las preferencias de usuarios chilenos.',
     ARRAY['Desarrollo de 15+ componentes UI reutilizables', 'Mejora del performance de la aplicación en 30%'],
     ARRAY['React', 'TypeScript', 'Redux', 'Jest', 'Figma'], 1),
    (demo_cv_id, 'Desarrollador Junior', 'Banco de Chile', 'Santiago, Chile', '2018-06', '2020-02',
     'Participé en el desarrollo de sistemas bancarios digitales para clientes chilenos. Trabajé en la migración de sistemas legacy y implementación de nuevas funcionalidades cumpliendo con regulaciones financieras chilenas.',
     ARRAY['Migración exitosa de 3 sistemas legacy', 'Implementación de nuevas funcionalidades de banca digital'],
     ARRAY['Java', 'Spring Boot', 'Oracle DB', 'Angular'], 2);

    -- Insert demo education
    INSERT INTO cv_education (cv_id, degree, institution, location, start_date, end_date, gpa, description, sort_order)
    VALUES 
    (demo_cv_id, 'Ingeniería Civil en Computación', 'Universidad de Chile', 'Santiago, Chile', '2016-03', '2020-12', '6.2',
     'Especialización en desarrollo de software y sistemas distribuidos. Tesis sobre optimización de algoritmos para el mercado financiero chileno.', 0),
    (demo_cv_id, 'Técnico en Programación', 'Instituto Profesional DUOC UC', 'Santiago, Chile', '2014-03', '2015-12', '6.5',
     'Formación técnica en programación y bases de datos con enfoque práctico en el desarrollo de aplicaciones.', 1);

    -- Insert demo skills
    INSERT INTO cv_skills (cv_id, name, level, category, years_of_experience, sort_order)
    VALUES 
    (demo_cv_id, 'JavaScript', 90, 'Frontend', 5, 0),
    (demo_cv_id, 'TypeScript', 85, 'Frontend', 3, 1),
    (demo_cv_id, 'React', 88, 'Frontend', 4, 2),
    (demo_cv_id, 'Node.js', 82, 'Backend', 4, 3),
    (demo_cv_id, 'Python', 75, 'Backend', 2, 4),
    (demo_cv_id, 'AWS', 78, 'Cloud', 3, 5),
    (demo_cv_id, 'Docker', 80, 'DevOps', 3, 6),
    (demo_cv_id, 'PostgreSQL', 85, 'Database', 4, 7);

    -- Insert demo projects
    INSERT INTO cv_projects (cv_id, name, description, technologies, url, github_url, role, sort_order)
    VALUES 
    (demo_cv_id, 'E-commerce Platform Chile', 'Plataforma de e-commerce completa adaptada al mercado chileno con integración de pagos locales y logística nacional.',
     ARRAY['React', 'Node.js', 'PostgreSQL', 'AWS', 'Stripe'], 'https://ecommerce-chile.com', 'https://github.com/juanperez/ecommerce-chile',
     'Full Stack Developer', 0),
    (demo_cv_id, 'FinTech Dashboard', 'Dashboard para análisis financiero con datos del mercado chileno, incluyendo visualizaciones en tiempo real.',
     ARRAY['React', 'D3.js', 'Python', 'FastAPI', 'Redis'], 'https://fintech-dashboard.cl', 'https://github.com/juanperez/fintech-dashboard',
     'Frontend Lead', 1),
    (demo_cv_id, 'API Gateway Microservices', 'Gateway de APIs para arquitectura de microservicios con autenticación y rate limiting.',
     ARRAY['Node.js', 'Express', 'Redis', 'Docker', 'Kubernetes'], NULL, 'https://github.com/juanperez/api-gateway',
     'Backend Developer', 2);

    -- Insert demo languages
    INSERT INTO cv_languages (cv_id, name, proficiency, sort_order)
    VALUES 
    (demo_cv_id, 'Español', 'Nativo', 0),
    (demo_cv_id, 'Inglés', 'Avanzado', 1),
    (demo_cv_id, 'Portugués', 'Intermedio', 2);

    -- Insert demo certifications
    INSERT INTO cv_certifications (cv_id, name, issuer, issue_date, credential_id, url, sort_order)
    VALUES 
    (demo_cv_id, 'AWS Solutions Architect Associate', 'Amazon Web Services', '2023-06', 'AWS-SAA-2023-001', 'https://aws.amazon.com/certification/', 0),
    (demo_cv_id, 'React Developer Certification', 'Meta', '2022-11', 'META-REACT-2022-456', 'https://developers.facebook.com/certification/', 1);

END $$;

-- Grant necessary permissions
GRANT ALL ON saved_cvs TO authenticated;
GRANT ALL ON cv_education TO authenticated;
GRANT ALL ON cv_experience TO authenticated;
GRANT ALL ON cv_projects TO authenticated;
GRANT ALL ON cv_skills TO authenticated;
GRANT ALL ON cv_languages TO authenticated;
GRANT ALL ON cv_certifications TO authenticated;
GRANT ALL ON cv_awards TO authenticated;
GRANT ALL ON cv_publications TO authenticated;

-- Create helpful functions for CV management
CREATE OR REPLACE FUNCTION get_user_cvs(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    template VARCHAR,
    personal_info JSONB,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT sc.id, sc.title, sc.template, sc.personal_info, sc.is_active, sc.created_at, sc.updated_at
    FROM saved_cvs sc
    WHERE sc.user_id = user_uuid
    ORDER BY sc.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_cv_complete_data(cv_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    cv_record saved_cvs%ROWTYPE;
BEGIN
    -- Get the CV record
    SELECT * INTO cv_record FROM saved_cvs WHERE id = cv_uuid;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Build complete CV data
    SELECT jsonb_build_object(
        'id', cv_record.id,
        'title', cv_record.title,
        'template', cv_record.template,
        'personalInfo', cv_record.personal_info,
        'education', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'degree', degree,
                    'institution', institution,
                    'location', location,
                    'startDate', start_date,
                    'endDate', end_date,
                    'gpa', gpa,
                    'description', description,
                    'honors', honors,
                    'relevantCourses', relevant_courses
                ) ORDER BY sort_order
            )
            FROM cv_education WHERE cv_id = cv_uuid
        ), '[]'::jsonb),
        'experience', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'jobTitle', job_title,
                    'company', company,
                    'location', location,
                    'startDate', start_date,
                    'endDate', end_date,
                    'description', description,
                    'achievements', achievements,
                    'technologies', technologies,
                    'responsibilities', responsibilities
                ) ORDER BY sort_order
            )
            FROM cv_experience WHERE cv_id = cv_uuid
        ), '[]'::jsonb),
        'projects', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'name', name,
                    'description', description,
                    'technologies', technologies,
                    'url', url,
                    'githubUrl', github_url,
                    'startDate', start_date,
                    'endDate', end_date,
                    'role', role,
                    'teamSize', team_size
                ) ORDER BY sort_order
            )
            FROM cv_projects WHERE cv_id = cv_uuid
        ), '[]'::jsonb),
        'skills', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'name', name,
                    'level', level,
                    'category', category,
                    'yearsOfExperience', years_of_experience,
                    'certified', certified
                ) ORDER BY sort_order
            )
            FROM cv_skills WHERE cv_id = cv_uuid
        ), '[]'::jsonb),
        'languages', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'name', name,
                    'proficiency', proficiency,
                    'certified', certified
                ) ORDER BY sort_order
            )
            FROM cv_languages WHERE cv_id = cv_uuid
        ), '[]'::jsonb),
        'certifications', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'name', name,
                    'issuer', issuer,
                    'issueDate', issue_date,
                    'expiryDate', expiry_date,
                    'credentialId', credential_id,
                    'url', url
                ) ORDER BY sort_order
            )
            FROM cv_certifications WHERE cv_id = cv_uuid
        ), '[]'::jsonb),
        'awards', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'title', title,
                    'issuer', issuer,
                    'date', date,
                    'description', description
                ) ORDER BY sort_order
            )
            FROM cv_awards WHERE cv_id = cv_uuid
        ), '[]'::jsonb),
        'publications', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'title', title,
                    'publisher', publisher,
                    'date', date,
                    'url', url,
                    'description', description,
                    'authors', authors
                ) ORDER BY sort_order
            )
            FROM cv_publications WHERE cv_id = cv_uuid
        ), '[]'::jsonb),
        'isActive', cv_record.is_active,
        'createdAt', cv_record.created_at,
        'updatedAt', cv_record.updated_at
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to set active CV
CREATE OR REPLACE FUNCTION set_active_cv(user_uuid UUID, cv_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- First, set all CVs for this user to inactive
    UPDATE saved_cvs SET is_active = false WHERE user_id = user_uuid;
    
    -- Then set the specified CV to active
    UPDATE saved_cvs SET is_active = true WHERE id = cv_uuid AND user_id = user_uuid;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
