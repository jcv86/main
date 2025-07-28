-- Create CV builder tables that work with the existing database structure
-- This script creates the necessary tables for the CV builder functionality

-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS cv_data CASCADE;
DROP TABLE IF EXISTS cv_templates CASCADE;

-- Create CV templates table
CREATE TABLE cv_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    preview_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CV data table that stores all CV information in JSONB format
CREATE TABLE cv_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES cv_templates(id) ON DELETE SET NULL,
    title VARCHAR(255) DEFAULT 'Mi CV Profesional',
    personal_info JSONB NOT NULL DEFAULT '{}',
    education JSONB NOT NULL DEFAULT '[]',
    experience JSONB NOT NULL DEFAULT '[]',
    projects JSONB NOT NULL DEFAULT '[]',
    skills JSONB NOT NULL DEFAULT '[]',
    languages JSONB NOT NULL DEFAULT '[]',
    certifications JSONB NOT NULL DEFAULT '[]',
    awards JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_cv_data_user_id ON cv_data(user_id);
CREATE INDEX idx_cv_data_template_id ON cv_data(template_id);
CREATE INDEX idx_cv_data_active ON cv_data(is_active) WHERE is_active = true;

-- Insert default CV templates
INSERT INTO cv_templates (name, description, preview_url) VALUES
('modern', 'Plantilla moderna con gradientes azules y diseño profesional', '/cv-previews/modern.png'),
('classic', 'Plantilla clásica con tipografía serif y diseño tradicional', '/cv-previews/classic.png'),
('creative', 'Plantilla creativa con colores vibrantes y diseño dinámico', '/cv-previews/creative.png'),
('minimal', 'Plantilla minimalista con tipografía limpia y espacios amplios', '/cv-previews/minimal.png');

-- Enable RLS
ALTER TABLE cv_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cv_templates (public read)
CREATE POLICY "CV templates are viewable by everyone" ON cv_templates
    FOR SELECT USING (is_active = true);

-- RLS Policies for cv_data (user-specific)
CREATE POLICY "Users can view their own CV data" ON cv_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CV data" ON cv_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CV data" ON cv_data
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CV data" ON cv_data
    FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_cv_data_updated_at 
    BEFORE UPDATE ON cv_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cv_templates_updated_at 
    BEFORE UPDATE ON cv_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one active CV per user
CREATE OR REPLACE FUNCTION ensure_single_active_cv()
RETURNS TRIGGER AS $$
BEGIN
    -- If the new/updated record is active, deactivate all other CVs for this user
    IF NEW.is_active = true THEN
        UPDATE cv_data 
        SET is_active = false 
        WHERE user_id = NEW.user_id 
        AND id != NEW.id 
        AND is_active = true;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to ensure only one active CV per user
CREATE TRIGGER ensure_single_active_cv_trigger
    BEFORE INSERT OR UPDATE ON cv_data
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_active_cv();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON cv_templates TO anon, authenticated;
GRANT ALL ON cv_data TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Insert sample CV data for demo user if exists
DO $$
DECLARE
    demo_user_id UUID;
    template_id INTEGER;
BEGIN
    -- Try to find demo user (you can replace this with any existing user email)
    SELECT id INTO demo_user_id FROM auth.users WHERE email LIKE '%@%' LIMIT 1;
    
    -- Get modern template ID
    SELECT id INTO template_id FROM cv_templates WHERE name = 'modern' LIMIT 1;
    
    -- Insert sample CV data if demo user exists
    IF demo_user_id IS NOT NULL AND template_id IS NOT NULL THEN
        INSERT INTO cv_data (
            user_id, 
            template_id, 
            title,
            personal_info, 
            education, 
            experience, 
            projects, 
            skills,
            languages,
            certifications
        ) VALUES (
            demo_user_id,
            template_id,
            'CV Profesional - Demo',
            '{
                "fullName": "Juan Pérez González",
                "email": "juan.perez@email.com",
                "phone": "+56 9 1234 5678",
                "location": "Santiago, Chile",
                "jobTitle": "Desarrollador Full Stack Senior",
                "summary": "Desarrollador de software experimentado con 5+ años de experiencia en desarrollo full-stack en el mercado chileno, especializado en React, Node.js y tecnologías cloud. Apasionado por crear soluciones escalables y liderar equipos de desarrollo en empresas chilenas.",
                "linkedin": "linkedin.com/in/juanperez",
                "github": "github.com/juanperez",
                "website": "juanperez.dev"
            }',
            '[
                {
                    "id": "1",
                    "degree": "Ingeniería Civil en Computación",
                    "institution": "Universidad de Chile",
                    "location": "Santiago, Chile",
                    "startDate": "2016-03",
                    "endDate": "2020-12",
                    "gpa": "6.2",
                    "description": "Especialización en desarrollo de software y sistemas distribuidos. Tesis sobre arquitecturas de microservicios."
                },
                {
                    "id": "2",
                    "degree": "Técnico en Programación",
                    "institution": "Instituto Profesional DUOC UC",
                    "location": "Santiago, Chile",
                    "startDate": "2014-03",
                    "endDate": "2015-12",
                    "description": "Fundamentos de programación, bases de datos y desarrollo web."
                }
            ]',
            '[
                {
                    "id": "1",
                    "jobTitle": "Ingeniero de Software Senior",
                    "company": "NotCo",
                    "location": "Santiago, Chile",
                    "startDate": "2022-01",
                    "endDate": "",
                    "description": "Lidero el desarrollo de aplicaciones customer-facing que sirven a 100K+ usuarios chilenos. Implementé arquitectura de microservicios reduciendo la latencia del sistema en 40%. Colaboro con equipos multiculturales adaptando productos al mercado chileno.",
                    "achievements": ["Reducción de latencia del sistema en 40%", "Liderazgo de equipo de 5 desarrolladores", "Implementación de arquitectura de microservicios"],
                    "technologies": ["React", "Node.js", "AWS", "Docker", "PostgreSQL"]
                },
                {
                    "id": "2",
                    "jobTitle": "Desarrollador de Software",
                    "company": "Fintual",
                    "location": "Remoto, Chile",
                    "startDate": "2020-03",
                    "endDate": "2021-12",
                    "description": "Desarrollé y mantuve aplicaciones React para servicios financieros dirigidos al mercado chileno. Colaboré con el equipo de diseño para implementar componentes UI responsivos adaptados a las preferencias de usuarios chilenos.",
                    "achievements": ["Desarrollo de 15+ componentes UI reutilizables", "Mejora del performance de la aplicación en 30%"],
                    "technologies": ["React", "TypeScript", "Redux", "Jest", "Figma"]
                },
                {
                    "id": "3",
                    "jobTitle": "Desarrollador Junior",
                    "company": "Banco de Chile",
                    "location": "Santiago, Chile",
                    "startDate": "2018-06",
                    "endDate": "2020-02",
                    "description": "Participé en el desarrollo de sistemas bancarios digitales para clientes chilenos. Trabajé en la migración de sistemas legacy y implementación de nuevas funcionalidades cumpliendo con regulaciones financieras chilenas.",
                    "achievements": ["Migración exitosa de 3 sistemas legacy", "Implementación de nuevas funcionalidades de banca digital"],
                    "technologies": ["Java", "Spring Boot", "Oracle DB", "Angular"]
                }
            ]',
            '[
                {
                    "id": "1",
                    "name": "Plataforma E-commerce",
                    "description": "Desarrollo de plataforma e-commerce completa con React, Node.js y PostgreSQL para mercado chileno",
                    "technologies": ["React", "Node.js", "PostgreSQL", "AWS"],
                    "url": "https://github.com/juanperez/ecommerce-chile",
                    "githubUrl": "https://github.com/juanperez/ecommerce-chile",
                    "startDate": "2021-06",
                    "endDate": "2021-12",
                    "role": "Full Stack Developer"
                },
                {
                    "id": "2",
                    "name": "App Móvil Fintech",
                    "description": "Aplicación móvil para gestión financiera personal adaptada a regulaciones chilenas",
                    "technologies": ["React Native", "Firebase", "Stripe"],
                    "url": "https://github.com/juanperez/fintech-app",
                    "githubUrl": "https://github.com/juanperez/fintech-app",
                    "startDate": "2020-08",
                    "endDate": "2021-02",
                    "role": "Mobile Developer"
                }
            ]',
            '[
                {
                    "id": "1",
                    "name": "JavaScript",
                    "level": 90,
                    "category": "Frontend",
                    "yearsOfExperience": 5
                },
                {
                    "id": "2",
                    "name": "React",
                    "level": 88,
                    "category": "Frontend",
                    "yearsOfExperience": 4
                },
                {
                    "id": "3",
                    "name": "Node.js",
                    "level": 82,
                    "category": "Backend",
                    "yearsOfExperience": 4
                },
                {
                    "id": "4",
                    "name": "Python",
                    "level": 75,
                    "category": "Backend",
                    "yearsOfExperience": 2
                },
                {
                    "id": "5",
                    "name": "AWS",
                    "level": 78,
                    "category": "Cloud",
                    "yearsOfExperience": 3
                },
                {
                    "id": "6",
                    "name": "Liderazgo",
                    "level": 85,
                    "category": "Blanda",
                    "yearsOfExperience": 3
                },
                {
                    "id": "7",
                    "name": "Comunicación",
                    "level": 90,
                    "category": "Blanda",
                    "yearsOfExperience": 5
                },
                {
                    "id": "8",
                    "name": "Trabajo en Equipo",
                    "level": 92,
                    "category": "Blanda",
                    "yearsOfExperience": 5
                }
            ]',
            '[
                {
                    "id": "1",
                    "name": "Español",
                    "proficiency": "Nativo"
                },
                {
                    "id": "2",
                    "name": "Inglés",
                    "proficiency": "Avanzado"
                },
                {
                    "id": "3",
                    "name": "Portugués",
                    "proficiency": "Intermedio"
                }
            ]',
            '[
                {
                    "id": "1",
                    "name": "AWS Solutions Architect Associate",
                    "issuer": "Amazon Web Services",
                    "issueDate": "2023-06",
                    "credentialId": "AWS-SAA-2023-001",
                    "url": "https://aws.amazon.com/certification/"
                },
                {
                    "id": "2",
                    "name": "React Developer Certification",
                    "issuer": "Meta",
                    "issueDate": "2022-11",
                    "credentialId": "META-REACT-2022-456",
                    "url": "https://developers.facebook.com/certification/"
                }
            ]'
        ) ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Sample CV data inserted successfully for user: %', demo_user_id;
    ELSE
        RAISE NOTICE 'No user found or template missing';
    END IF;
END $$;

-- Verify the setup
SELECT 'CV Templates created:' as info, count(*) as count FROM cv_templates;
SELECT 'CV Data entries:' as info, count(*) as count FROM cv_data;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'CV Builder database setup completed successfully!';
    RAISE NOTICE 'Tables created: cv_templates, cv_data';
    RAISE NOTICE 'RLS policies enabled';
    RAISE NOTICE 'Sample data inserted';
END $$;
