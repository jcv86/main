-- Fix CV data table structure
DROP TABLE IF EXISTS cv_data CASCADE;

-- Create cv_data table with proper structure
CREATE TABLE cv_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Mi CV',
  template TEXT NOT NULL DEFAULT 'modern',
  content JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_cv_data_user_id ON cv_data(user_id);
CREATE INDEX idx_cv_data_is_active ON cv_data(is_active);
CREATE INDEX idx_cv_data_created_at ON cv_data(created_at);

-- Enable RLS
ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own CV data" ON cv_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CV data" ON cv_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CV data" ON cv_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CV data" ON cv_data
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cv_data_updated_at
  BEFORE UPDATE ON cv_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample CV data for demo user
INSERT INTO cv_data (user_id, title, template, content, is_active) VALUES (
  (SELECT id FROM auth.users WHERE email = 'demo@dtcfinal.com' LIMIT 1),
  'CV Profesional - Juan Pérez',
  'modern',
  '{
    "personalInfo": {
      "fullName": "Juan Pérez González",
      "email": "juan.perez@email.com",
      "phone": "+56 9 1234 5678",
      "location": "Santiago, Chile",
      "jobTitle": "Desarrollador Full Stack Senior",
      "linkedin": "linkedin.com/in/juanperez",
      "github": "github.com/juanperez",
      "website": "juanperez.dev",
      "summary": "Desarrollador de software experimentado con 5+ años de experiencia en desarrollo full-stack en el mercado chileno, especializado en React, Node.js y tecnologías cloud. Apasionado por crear soluciones escalables y liderar equipos de desarrollo en empresas chilenas."
    },
    "experience": [
      {
        "id": "exp1",
        "jobTitle": "Ingeniero de Software Senior",
        "company": "NotCo",
        "location": "Santiago, Chile",
        "startDate": "2022-01",
        "endDate": "",
        "description": "Lidero el desarrollo de aplicaciones customer-facing que sirven a 100K+ usuarios chilenos. Implementé arquitectura de microservicios reduciendo la latencia del sistema en 40%.",
        "achievements": [
          "Reducción de latencia del sistema en 40%",
          "Liderazgo de equipo de 5 desarrolladores",
          "Implementación de arquitectura de microservicios"
        ],
        "technologies": ["React", "Node.js", "AWS", "PostgreSQL", "Docker"]
      }
    ],
    "education": [
      {
        "id": "edu1",
        "degree": "Ingeniería Civil en Computación",
        "institution": "Universidad de Chile",
        "location": "Santiago, Chile",
        "startDate": "2016-03",
        "endDate": "2020-12",
        "gpa": "6.2",
        "description": "Especialización en desarrollo de software y sistemas distribuidos"
      }
    ],
    "projects": [
      {
        "id": "proj1",
        "name": "E-commerce Platform Chile",
        "description": "Plataforma de comercio electrónico completa para el mercado chileno con integración de pagos locales",
        "technologies": ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
        "url": "https://ecommerce-chile.com",
        "githubUrl": "https://github.com/juanperez/ecommerce-chile",
        "role": "Full Stack Developer"
      }
    ],
    "skills": [
      {
        "id": "skill1",
        "name": "JavaScript",
        "level": 90,
        "category": "Frontend",
        "yearsOfExperience": 5
      },
      {
        "id": "skill2",
        "name": "React",
        "level": 85,
        "category": "Frontend",
        "yearsOfExperience": 4
      },
      {
        "id": "skill3",
        "name": "Node.js",
        "level": 80,
        "category": "Backend",
        "yearsOfExperience": 4
      },
      {
        "id": "skill4",
        "name": "AWS",
        "level": 75,
        "category": "Cloud",
        "yearsOfExperience": 3
      },
      {
        "id": "skill5",
        "name": "PostgreSQL",
        "level": 70,
        "category": "Database",
        "yearsOfExperience": 3
      }
    ],
    "languages": [
      {
        "id": "lang1",
        "name": "Español",
        "proficiency": "Nativo"
      },
      {
        "id": "lang2",
        "name": "Inglés",
        "proficiency": "Avanzado"
      }
    ],
    "certifications": [
      {
        "id": "cert1",
        "name": "AWS Solutions Architect Associate",
        "issuer": "Amazon Web Services",
        "issueDate": "2023-06",
        "expiryDate": "2026-06",
        "credentialId": "AWS-SAA-2023-001",
        "url": "https://aws.amazon.com/certification/"
      }
    ]
  }',
  true
) ON CONFLICT DO NOTHING;
