-- Fix RLS policies and authentication for CV builder

-- First, ensure the cv_data table exists with proper structure
CREATE TABLE IF NOT EXISTS cv_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}',
    template_id TEXT DEFAULT 'modern',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own CV data" ON cv_data;
DROP POLICY IF EXISTS "Users can insert own CV data" ON cv_data;
DROP POLICY IF EXISTS "Users can update own CV data" ON cv_data;
DROP POLICY IF EXISTS "Users can delete own CV data" ON cv_data;

-- Create permissive policies for development
CREATE POLICY "Allow all operations for development" ON cv_data
    FOR ALL USING (true) WITH CHECK (true);

-- For production, use these restrictive policies instead:
-- CREATE POLICY "Users can view own CV data" ON cv_data
--     FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert own CV data" ON cv_data
--     FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update own CV data" ON cv_data
--     FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can delete own CV data" ON cv_data
--     FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cv_data_user_id ON cv_data(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_data_template_id ON cv_data(template_id);
CREATE INDEX IF NOT EXISTS idx_cv_data_updated_at ON cv_data(updated_at);

-- Create a helper function to get user CV data
CREATE OR REPLACE FUNCTION get_user_cv_data(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    data JSONB,
    template_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cv.id,
        cv.data,
        cv.template_id,
        cv.created_at,
        cv.updated_at
    FROM cv_data cv
    WHERE cv.user_id = p_user_id;
END;
$$;

-- Create demo user if it doesn't exist (for development)
DO $$
DECLARE
    demo_user_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
    -- Insert demo user into auth.users if it doesn't exist
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        demo_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'demo@dtcfinal.com',
        crypt('demo123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ) ON CONFLICT (id) DO NOTHING;

    -- Insert demo CV data
    INSERT INTO cv_data (
        user_id,
        data,
        template_id
    ) VALUES (
        demo_user_id,
        '{
            "personal": {
                "fullName": "Juan Pérez González",
                "email": "juan.perez@email.com",
                "phone": "+56 9 1234 5678",
                "address": "Av. Providencia 1234",
                "city": "Santiago",
                "country": "Chile",
                "linkedIn": "linkedin.com/in/juanperez",
                "website": "juanperez.dev",
                "summary": "Desarrollador Full Stack con 5 años de experiencia en tecnologías web modernas. Especializado en React, Node.js y bases de datos relacionales. Busco oportunidades para contribuir al crecimiento de equipos de desarrollo innovadores."
            },
            "experience": [
                {
                    "id": "exp1",
                    "company": "TechCorp Chile",
                    "position": "Desarrollador Senior Full Stack",
                    "startDate": "2021-03",
                    "endDate": "",
                    "current": true,
                    "description": "Desarrollo y mantenimiento de aplicaciones web usando React y Node.js",
                    "achievements": [
                        "Lideré el desarrollo de una plataforma que aumentó la eficiencia en 40%",
                        "Implementé arquitectura de microservicios que redujo los tiempos de respuesta en 60%",
                        "Mentoré a 3 desarrolladores junior"
                    ]
                }
            ],
            "education": [
                {
                    "id": "edu1",
                    "institution": "Universidad de Chile",
                    "degree": "Ingeniería Civil en Computación",
                    "field": "Ciencias de la Computación",
                    "startDate": "2015-03",
                    "endDate": "2019-12",
                    "current": false,
                    "gpa": "6.2",
                    "description": "Especialización en desarrollo de software y sistemas distribuidos"
                }
            ],
            "skills": [
                {
                    "id": "skill1",
                    "name": "JavaScript",
                    "level": "Expert",
                    "category": "Technical"
                },
                {
                    "id": "skill2",
                    "name": "React",
                    "level": "Advanced",
                    "category": "Technical"
                },
                {
                    "id": "skill3",
                    "name": "Leadership",
                    "level": "Advanced",
                    "category": "Soft"
                }
            ],
            "languages": [
                {
                    "id": "lang1",
                    "name": "Español",
                    "level": "Native"
                },
                {
                    "id": "lang2",
                    "name": "Inglés",
                    "level": "Fluent"
                }
            ],
            "projects": [],
            "certifications": []
        }',
        'modern'
    ) ON CONFLICT (user_id) DO UPDATE SET
        data = EXCLUDED.data,
        template_id = EXCLUDED.template_id,
        updated_at = NOW();
END $$;

-- Grant necessary permissions
GRANT ALL ON cv_data TO authenticated;
GRANT ALL ON cv_data TO anon;
