-- Create knowledge base system tables
CREATE TABLE IF NOT EXISTS knowledge_base_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_base_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES knowledge_base_categories(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'published',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_articles_category ON knowledge_base_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_articles_slug ON knowledge_base_articles(slug);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_articles_status ON knowledge_base_articles(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_articles_featured ON knowledge_base_articles(featured);

-- Enable RLS
ALTER TABLE knowledge_base_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Knowledge base categories are viewable by everyone" ON knowledge_base_categories
  FOR SELECT USING (true);

CREATE POLICY "Knowledge base articles are viewable by everyone" ON knowledge_base_articles
  FOR SELECT USING (status = 'published');

-- Insert knowledge base categories
INSERT INTO knowledge_base_categories (name, description, icon, sort_order) VALUES
('Documentación Técnica', 'Especificaciones técnicas y documentación del sistema', 'FileCode', 1),
('Guías de Usuario', 'Guías paso a paso para usar la plataforma', 'Play', 2),
('Información de Carreras', 'Información detallada sobre carreras y mercado laboral', 'Users', 3),
('Recursos Generales', 'Recursos adicionales y documentación general', 'BookOpen', 4);

-- Insert knowledge base articles
INSERT INTO knowledge_base_articles (category_id, title, slug, description, content, featured, sort_order) VALUES
(
  (SELECT id FROM knowledge_base_categories WHERE name = 'Documentación Técnica'),
  'Especificación Técnica DTC - Plataforma de Desarrollo de Carrera',
  'dtc-technical-specification',
  'Documentación técnica completa del proyecto DTC con personalización por carreras',
  '# Especificación Técnica DTC - Plataforma de Desarrollo de Carrera

## Visión General del Proyecto

DTC (Despega Tu Carrera) es una plataforma integral de desarrollo profesional diseñada específicamente para estudiantes universitarios chilenos. La plataforma utiliza inteligencia artificial para personalizar la experiencia de cada usuario según su carrera específica, proporcionando herramientas adaptadas para el desarrollo de habilidades, búsqueda de empleo y crecimiento profesional.

## Objetivos Principales

- **Personalización por Carrera**: Adaptar todas las funcionalidades según la carrera específica del usuario
- **Desarrollo Integral**: Combinar evaluaciones psicométricas, técnicas y de habilidades blandas
- **Orientación al Mercado Chileno**: Integrar datos específicos del mercado laboral chileno
- **Experiencia de Usuario Optimizada**: Interfaz intuitiva y responsive para todos los dispositivos

## Arquitectura del Sistema

### Frontend
- **Framework**: Next.js 14 con App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Estado**: React Context + Hooks
- **Autenticación**: NextAuth.js integrado con Supabase

### Backend
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **APIs**: Next.js API Routes
- **Almacenamiento**: Supabase Storage

### Integraciones de IA
- **OpenAI GPT-4**: Para análisis de personalidad y coaching
- **Análisis de Texto**: Para evaluación de respuestas y feedback
- **Generación de Contenido**: Para personalización de CV y recomendaciones

## Módulos del Sistema

### 1. Sistema de Autenticación y Perfiles
- Registro y login con email/password
- Perfiles de usuario con información académica
- Selección de carrera para personalización
- Gestión de preferencias y configuración

### 2. Evaluaciones y Tests
- **Tests Psicométricos**: Personalidad, DISC, Big Five
- **Tests Técnicos**: Específicos por carrera
- **Habilidades Blandas**: Comunicación, liderazgo, trabajo en equipo
- **Sistema Adaptativo**: Tests que se ajustan al nivel del usuario

### 3. Generador de CV Inteligente
- Plantillas específicas por carrera
- Análisis automático de contenido
- Sugerencias de mejora basadas en IA
- Exportación en múltiples formatos

### 4. Búsqueda de Empleo
- Integración con portales de empleo chilenos
- Filtros avanzados por carrera y ubicación
- Sistema de alertas personalizadas
- Análisis de compatibilidad con ofertas

### 5. Coach de Carrera IA
- Conversaciones personalizadas por carrera
- Análisis de fortalezas y debilidades
- Recomendaciones de desarrollo
- Planificación de carrera a largo plazo

### 6. Simulador de Entrevistas
- Preguntas específicas por carrera
- Análisis de respuestas con IA
- Feedback detallado y sugerencias
- Práctica de casos reales

### 7. Biblioteca de Recursos
- Libros digitales con TTS
- Artículos especializados por carrera
- Videos educativos
- Sistema de progreso y bookmarks

## Personalización por Carreras

### Carreras Objetivo (7 carreras principales):

1. **Arquitectura**
2. **Derecho** 
3. **Diseño (Gráfico, Industrial y otros)**
4. **Ingeniería Comercial (Administración y Negocios)**
5. **Ingeniería Civil Informática (Tecnología y Programación)**
6. **Medicina**
7. **Psicología**

### Adaptaciones Específicas por Carrera:

#### Arquitectura
- **CV Templates**: Portfolios visuales con proyectos arquitectónicos
- **Tests Técnicos**: Evaluación de software CAD, diseño espacial
- **Simulador**: Entrevistas con estudios de arquitectura, presentación de proyectos
- **Coach IA**: Orientación sobre especialización (residencial, comercial, paisajismo)

#### Derecho
- **CV Templates**: Formato formal con énfasis en logros académicos
- **Tests**: Análisis crítico, argumentación, ética profesional
- **Simulador**: Casos hipotéticos, exámenes orales de habilitación
- **Coach IA**: Orientación sobre ramas del derecho (civil, penal, corporativo)

#### Diseño
- **CV Templates**: Portfolios creativos con integración visual
- **Tests**: Evaluación de creatividad, software de diseño
- **Simulador**: Presentación de proyectos, feedback de clientes
- **Coach IA**: Orientación sobre freelancing, cotización de proyectos

#### Ingeniería Comercial
- **CV Templates**: Énfasis en logros cuantitativos y métricas
- **Tests**: Excel avanzado, análisis financiero, case studies
- **Simulador**: Entrevistas grupales, presentaciones de negocio
- **Coach IA**: Orientación sobre especialización (finanzas, marketing, consultoría)

#### Ingeniería Civil Informática
- **CV Templates**: Portfolios técnicos con proyectos de código
- **Tests**: Coding challenges, algoritmos, bases de datos
- **Simulador**: Entrevistas técnicas, explicación de conceptos
- **Coach IA**: Orientación sobre tecnologías emergentes, carrera en tech

#### Medicina
- **CV Templates**: Formato académico con investigaciones y rotaciones
- **Tests**: Conocimientos médicos, ética, casos clínicos
- **Simulador**: Entrevistas de residencia, presentación de casos
- **Coach IA**: Orientación sobre especialidades médicas

#### Psicología
- **CV Templates**: Énfasis en experiencia clínica y investigación
- **Tests**: Casos psicológicos, ética profesional, terapias
- **Simulador**: Entrevistas clínicas, presentación de casos
- **Coach IA**: Orientación sobre áreas de especialización

## Flujo de Datos y Personalización

### 1. Onboarding del Usuario
