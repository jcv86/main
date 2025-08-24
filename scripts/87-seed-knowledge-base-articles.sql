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
