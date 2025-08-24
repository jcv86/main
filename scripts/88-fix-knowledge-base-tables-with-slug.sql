-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS knowledge_base_articles CASCADE;
DROP TABLE IF EXISTS knowledge_base_categories CASCADE;

-- Create knowledge base categories table with slug column
CREATE TABLE knowledge_base_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge base articles table
CREATE TABLE knowledge_base_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES knowledge_base_categories(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE knowledge_base_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Knowledge base categories are publicly readable" ON knowledge_base_categories
  FOR SELECT USING (true);

CREATE POLICY "Knowledge base articles are publicly readable" ON knowledge_base_articles
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_kb_categories_slug ON knowledge_base_categories(slug);
CREATE INDEX idx_kb_articles_slug ON knowledge_base_articles(slug);
CREATE INDEX idx_kb_articles_category ON knowledge_base_articles(category_id);
CREATE INDEX idx_kb_articles_featured ON knowledge_base_articles(is_featured);

-- Insert knowledge base categories
INSERT INTO knowledge_base_categories (name, slug, description, icon, sort_order) VALUES
('Documentación Técnica', 'technical-docs', 'Especificaciones técnicas y documentación del sistema', 'FileCode', 1),
('Guías de Usuario', 'user-guides', 'Guías paso a paso para usar la plataforma', 'BookOpen', 2),
('Información de Carreras', 'career-info', 'Información detallada sobre carreras y mercado laboral', 'GraduationCap', 3),
('Recursos Generales', 'general-resources', 'Recursos adicionales y materiales de apoyo', 'Library', 4);

-- Insert knowledge base articles
INSERT INTO knowledge_base_articles (category_id, title, slug, excerpt, content, is_featured, sort_order) VALUES
(
  (SELECT id FROM knowledge_base_categories WHERE slug = 'technical-docs'),
  'Especificación Técnica DTC - Plataforma de Desarrollo de Carrera',
  'dtc-technical-specification',
  'Documentación técnica completa del proyecto DTC con personalización por carreras',
  '# Especificación Técnica DTC - Plataforma de Desarrollo de Carrera

## Visión General del Proyecto

**Despega Tu Carrera (DTC)** es una plataforma integral de desarrollo profesional diseñada específicamente para estudiantes universitarios chilenos. La plataforma combina inteligencia artificial, análisis psicométrico y datos del mercado laboral local para ofrecer una experiencia personalizada según la carrera del usuario.

## Arquitectura del Sistema

### Stack Tecnológico
- **Frontend**: Next.js 14 con App Router
- **Backend**: Next.js API Routes + Supabase
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth
- **UI/UX**: Tailwind CSS + shadcn/ui
- **IA**: OpenAI GPT-4 API
- **Deployment**: Vercel

### Estructura de la Base de Datos

#### Tablas Principales
```sql
-- Usuarios y perfiles
users (id, email, created_at)
user_profiles (user_id, career, full_name, university, graduation_year)

-- Sistema de evaluaciones
personality_assessments (user_id, test_type, results, completed_at)
skills_assessments (user_id, skill_type, level, assessment_data)
technical_assessments (user_id, career_specific_data, scores)

-- CV y documentos
cv_data (user_id, personal_info, experience, education, skills)
cv_templates (id, name, career_specific, template_data)

-- Búsqueda de empleo
job_listings (id, title, company, location, career_match, requirements)
job_applications (user_id, job_id, status, applied_at)

-- Coach IA y conversaciones
coaching_conversations (user_id, conversation_data, ai_insights)
career_recommendations (user_id, recommendations, generated_at)
