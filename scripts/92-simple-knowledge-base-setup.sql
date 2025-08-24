-- Drop existing tables if they exist
DROP TABLE IF EXISTS knowledge_base_articles CASCADE;
DROP TABLE IF EXISTS knowledge_base_categories CASCADE;

-- Create categories table
CREATE TABLE knowledge_base_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'BookOpen',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE knowledge_base_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES knowledge_base_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
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
CREATE POLICY "Allow public read access to categories" ON knowledge_base_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to articles" ON knowledge_base_articles FOR SELECT USING (true);

-- Insert categories
INSERT INTO knowledge_base_categories (name, slug, description, icon, sort_order) VALUES
('Documentación Técnica', 'technical-docs', 'Especificaciones técnicas y arquitectura del sistema', 'FileCode', 1),
('Guías de Usuario', 'user-guides', 'Tutoriales y guías paso a paso', 'BookOpen', 2),
('Información de Carreras', 'career-info', 'Datos del mercado laboral y oportunidades profesionales', 'GraduationCap', 3),
('Recursos Generales', 'general-resources', 'Herramientas, plantillas y recursos adicionales', 'Library', 4);

-- Insert technical specification article
INSERT INTO knowledge_base_articles (category_id, title, slug, excerpt, content, is_featured, sort_order) VALUES
(
  (SELECT id FROM knowledge_base_categories WHERE slug = 'technical-docs'),
  'Especificación Técnica DTC - Plataforma de Desarrollo de Carrera',
  'dtc-technical-specification',
  'Documentación técnica completa de la plataforma Despega Tu Carrera',
  'Especificación Técnica DTC - Plataforma de Desarrollo de Carrera

Visión General del Proyecto

Despega Tu Carrera (DTC) es una plataforma integral de desarrollo profesional diseñada específicamente para estudiantes universitarios chilenos. La plataforma combina inteligencia artificial, análisis psicométrico y datos del mercado laboral local para ofrecer una experiencia personalizada según la carrera del usuario.

Arquitectura del Sistema

Stack Tecnológico:
- Frontend: Next.js 14 con App Router
- Backend: Next.js API Routes + Supabase
- Base de Datos: PostgreSQL (Supabase)
- Autenticación: Supabase Auth
- UI/UX: Tailwind CSS + shadcn/ui
- IA: OpenAI GPT-4 API
- Deployment: Vercel

Estructura de la Base de Datos:

Tablas Principales:
- users (id, email, created_at)
- user_profiles (user_id, career, full_name, university, graduation_year)
- personality_assessments (user_id, test_type, results, completed_at)
- skills_assessments (user_id, skill_type, level, assessment_data)
- technical_assessments (user_id, career_specific_data, scores)
- cv_data (user_id, personal_info, experience, education, skills)
- cv_templates (id, name, career_specific, template_data)
- job_listings (id, title, company, location, career_match, requirements)
- job_applications (user_id, job_id, status, applied_at)
- coaching_conversations (user_id, conversation_data, ai_insights)
- career_recommendations (user_id, recommendations, generated_at)

Personalización por Carreras

Carreras Objetivo (7 principales):
1. Arquitectura
2. Derecho
3. Diseño
4. Ingeniería Comercial
5. Ingeniería Civil Informática
6. Medicina
7. Psicología

Tests Psicométricos Adaptados:
- Arquitectura: Enfoque en creatividad, visión espacial, sostenibilidad
- Derecho: Análisis crítico, argumentación, ética profesional
- Diseño: Creatividad, tendencias, portfolio digital
- Ing. Comercial: Liderazgo, análisis financiero, networking
- Ing. Civil Informática: Lógica, resolución de problemas, tecnologías
- Medicina: Empatía, resistencia al estrés, ética médica
- Psicología: Inteligencia emocional, escucha activa, análisis conductual

Funcionalidades Principales

1. Sistema de Evaluación Integral
- Tests de personalidad adaptados por carrera
- Evaluación de habilidades blandas específicas
- Tests técnicos personalizados
- Sistema de evaluación adaptativa

2. Generador de CV Inteligente
- Análisis automático de fortalezas del usuario
- Sugerencias de contenido basadas en el perfil
- Optimización ATS para sistemas de tracking
- Múltiples formatos de exportación (PDF, Word, LinkedIn)

3. Búsqueda de Empleo Personalizada
- Integración con APIs de portales chilenos
- Matching inteligente basado en perfil y carrera
- Alertas personalizadas por email y push notifications
- Análisis de compatibilidad con ofertas laborales

4. Coach de Carrera con IA
- Conversaciones naturales usando GPT-4
- Análisis personalizado de tu perfil y objetivos
- Recomendaciones específicas para tu carrera
- Planificación de carrera a corto y largo plazo

Seguridad y Privacidad

Protección de Datos:
- Encriptación de todos los datos sensibles
- Comunicación segura HTTPS
- Row Level Security en Supabase
- Respaldos automáticos diarios

Cumplimiento Normativo:
- Ley de Protección de Datos Personales (Chile)
- GDPR para usuarios internacionales
- Gestión clara de permisos de usuario
- Derecho al olvido implementado',
  true,
  1
);

-- Insert getting started guide
INSERT INTO knowledge_base_articles (category_id, title, slug, excerpt, content, is_featured, sort_order) VALUES
(
  (SELECT id FROM knowledge_base_categories WHERE slug = 'user-guides'),
  'Guía de Inicio - Cómo usar la Plataforma',
  'getting-started',
  'Aprende a usar la plataforma paso a paso',
  'Guía de Inicio - Despega Tu Carrera

Bienvenido a Despega Tu Carrera! Esta guía te ayudará a aprovechar al máximo nuestra plataforma de desarrollo profesional diseñada específicamente para estudiantes universitarios chilenos.

Primeros Pasos

1. Crear tu Cuenta
- Regístrate con tu email universitario preferiblemente
- Verifica tu cuenta a través del email de confirmación
- Completa tu perfil básico con información real

2. Seleccionar tu Carrera
- Elige tu carrera de la lista de 7 opciones disponibles:
  - Arquitectura
  - Derecho
  - Diseño
  - Ingeniería Comercial
  - Ingeniería Civil Informática
  - Medicina
  - Psicología
- Esta selección personalizará toda tu experiencia en la plataforma

3. Completar Tests Iniciales
Para obtener recomendaciones precisas, completa estos tests:
- Test de Personalidad (15 minutos)
- Evaluación de Habilidades Blandas (20 minutos)
- Test Técnico específico de tu carrera (30 minutos)

Panel de Control (Dashboard)

Tu dashboard personal es el centro de comando donde puedes:

Vista General:
- Progreso general de tu desarrollo profesional
- Recomendaciones personalizadas basadas en tu carrera
- Actividad reciente y próximos pasos sugeridos
- Métricas clave de tu perfil profesional

Generador de CV Inteligente

Características Principales:
- Plantillas específicas diseñadas para tu carrera
- Sugerencias automáticas de contenido basadas en tu perfil
- Análisis de fortalezas y áreas de mejora
- Optimización ATS para sistemas de seguimiento de candidatos

Consejos por Carrera:
- Arquitectura: Incluye portfolio visual y proyectos destacados
- Derecho: Enfatiza experiencia en práctica jurídica
- Diseño: Portfolio digital es esencial
- Ing. Comercial: Destaca logros cuantificables y liderazgo
- Ing. Civil Informática: Incluye proyectos técnicos
- Medicina: Experiencia clínica y formación continua
- Psicología: Enfoque en especialización

Búsqueda de Empleo Personalizada

Funcionalidades Avanzadas:
- Ofertas filtradas automáticamente por tu carrera
- Análisis de compatibilidad con cada posición
- Alertas personalizadas por email y notificaciones
- Seguimiento de aplicaciones y estado de postulaciones

Coach de Carrera con IA

Capacidades del Coach:
- Conversaciones naturales sobre tu desarrollo profesional
- Análisis personalizado de tu perfil y objetivos
- Recomendaciones específicas para tu carrera
- Planificación de carrera a corto y largo plazo

Biblioteca de Recursos

Contenido Disponible:
- Libros digitales con funcionalidad de lectura avanzada
- Artículos especializados del mercado laboral chileno
- Cursos recomendados específicos para tu carrera
- Videos educativos y webinars de expertos

Consejos para Mejores Resultados

Optimiza tu Perfil:
- Completa toda la información solicitada
- Actualiza regularmente tu experiencia y habilidades
- Añade proyectos y logros relevantes
- Mantén tu información de contacto actualizada

Estás listo para despegar tu carrera profesional!',
  false,
  2
);

-- Insert careers guide
INSERT INTO knowledge_base_articles (category_id, title, slug, excerpt, content, is_featured, sort_order) VALUES
(
  (SELECT id FROM knowledge_base_categories WHERE slug = 'career-info'),
  'Guía Completa de Carreras - Mercado Laboral Chileno',
  'careers-guide',
  'Información detallada de las 7 carreras objetivo con datos del mercado chileno',
  'Guía Completa de Carreras - Mercado Laboral Chileno

Esta guía proporciona información detallada sobre las 7 carreras principales que cubre nuestra plataforma, incluyendo datos específicos y actualizados del mercado laboral chileno.

Arquitectura

Mercado Laboral:
- Salario Promedio: $800.000 - $1.500.000 CLP mensuales
- Salario Senior: $1.500.000 - $2.500.000 CLP mensuales
- Crecimiento Proyectado: 5% anual (2024-2028)
- Empleabilidad: 78% de titulados encuentra empleo en 12 meses

Principales Empleadores:
- Estudios de Arquitectura: Mathias Klotz, Smiljan Radic
- Constructoras: Salfacorp, Besalco, Echeverría Izquierdo
- Sector Público: MINVU, SERVIU, Municipalidades
- Inmobiliarias: Inmobiliaria Aconcagua, Paz Corp

Especialidades Demandadas:
1. Arquitectura Residencial: Vivienda social y privada
2. Arquitectura Comercial: Centros comerciales, oficinas
3. Urbanismo y Planificación: Desarrollo urbano sustentable
4. Arquitectura Sustentable: Certificaciones LEED

Derecho

Mercado Laboral:
- Salario Promedio: $700.000 - $2.000.000 CLP mensuales
- Salario Senior: $2.000.000 - $5.000.000 CLP mensuales
- Crecimiento Proyectado: 3% anual (2024-2028)
- Empleabilidad: 72% encuentra empleo en 18 meses

Principales Empleadores:
- Estudios Jurídicos: Carey, Claro & Cía, Philippi Prietocarrizosa
- Empresas: Banco de Chile, Falabella, CMPC, Codelco
- Sector Público: Poder Judicial, Ministerios, Contraloría

Especialidades Demandadas:
1. Derecho Corporativo: Fusiones, adquisiciones, compliance
2. Derecho Laboral: Relaciones laborales
3. Derecho Tributario: Asesoría fiscal
4. Derecho Penal: Litigación, defensa penal

Diseño

Mercado Laboral:
- Salario Promedio: $600.000 - $1.200.000 CLP mensuales
- Salario Senior: $1.200.000 - $2.200.000 CLP mensuales
- Crecimiento Proyectado: 8% anual (2024-2028)
- Empleabilidad: 85% encuentra empleo en 10 meses

Principales Empleadores:
- Agencias de Publicidad: McCann, Ogilvy, BBDO, Grey
- Empresas Tech: Cornershop, NotCo, Fintual, Buk
- Consultoras Digitales: Globant, Accenture, Deloitte Digital

Especialidades Demandadas:
1. Diseño UX/UI: Experiencia de usuario, interfaces digitales
2. Diseño Gráfico: Branding, comunicación visual
3. Diseño Digital: Marketing digital, redes sociales
4. Motion Graphics: Animación, video

Ingeniería Comercial

Mercado Laboral:
- Salario Promedio: $900.000 - $2.500.000 CLP mensuales
- Salario Senior: $2.500.000 - $5.000.000 CLP mensuales
- Crecimiento Proyectado: 6% anual (2024-2028)
- Empleabilidad: 90% encuentra empleo en 8 meses

Principales Empleadores:
- Bancos: Banco de Chile, Santander, BCI, Itaú
- Consultoras: McKinsey, BCG, Bain, Deloitte
- Retail: Falabella, Cencosud, Ripley
- Multinacionales: Unilever, P&G, Nestlé

Especialidades Demandadas:
1. Finanzas Corporativas: Análisis financiero, inversiones
2. Marketing y Ventas: Gestión comercial
3. Consultoría Estratégica: Estrategia empresarial
4. Emprendimiento: Startups, innovación

Ingeniería Civil Informática

Mercado Laboral:
- Salario Promedio: $1.000.000 - $2.800.000 CLP mensuales
- Salario Senior: $2.800.000 - $5.500.000 CLP mensuales
- Crecimiento Proyectado: 12% anual (2024-2028)
- Empleabilidad: 95% encuentra empleo en 6 meses

Principales Empleadores:
- Empresas Tech: Mercado Libre, Cornershop, NotCo, Fintual
- Bancos: Banco de Chile, Santander (áreas digitales)
- Consultoras Tech: Globant, Accenture, IBM
- Multinacionales: Google, Microsoft, Amazon

Especialidades Demandadas:
1. Desarrollo de Software: Full-stack, mobile, web
2. Ciencia de Datos: Machine learning, AI, analytics
3. Ciberseguridad: Seguridad informática
4. Cloud Computing: AWS, Azure, Google Cloud

Medicina

Mercado Laboral:
- Salario Promedio: $1.200.000 - $4.000.000 CLP mensuales
- Salario Especialista: $3.000.000 - $8.000.000 CLP mensuales
- Crecimiento Proyectado: 4% anual (2024-2028)
- Empleabilidad: 98% encuentra empleo inmediatamente

Principales Empleadores:
- Hospitales Públicos: Hospital Salvador, Hospital del Trabajador
- Clínicas Privadas: Clínica Las Condes, Clínica Alemana
- Centros de Salud: CESFAM, consultorios municipales
- Consulta Privada: Práctica independiente

Especialidades Demandadas:
1. Medicina Familiar: Atención primaria
2. Medicina Interna: Diagnóstico y tratamiento
3. Pediatría: Atención médica infantil
4. Psiquiatría: Salud mental, creciente demanda

Psicología

Mercado Laboral:
- Salario Promedio: $650.000 - $1.800.000 CLP mensuales
- Salario Senior: $1.800.000 - $3.500.000 CLP mensuales
- Crecimiento Proyectado: 7% anual (2024-2028)
- Empleabilidad: 82% encuentra empleo en 12 meses

Principales Empleadores:
- Clínicas y Hospitales: Atención de salud mental
- Empresas: Áreas de recursos humanos
- Centros Educacionales: Colegios, universidades
- Consulta Privada: Práctica independiente

Especialidades Demandadas:
1. Psicología Clínica: Terapia individual, grupal
2. Psicología Organizacional: Recursos humanos
3. Psicología Educacional: Apoyo en aprendizaje
4. Neuropsicología: Evaluación cognitiva

Análisis Transversal del Mercado

Sectores en Crecimiento:
1. Tecnología: Transformación digital, fintech
2. Sustentabilidad: Energías renovables
3. Salud y Bienestar: Telemedicina, salud mental
4. Educación Digital: EdTech, capacitación online

Habilidades Transversales Demandadas:
1. Adaptabilidad: Capacidad de ajustarse a cambios
2. Pensamiento Crítico: Análisis y resolución de problemas
3. Colaboración Remota: Trabajo en equipos distribuidos
4. Competencias Digitales: Alfabetización digital avanzada
5. Inteligencia Emocional: Gestión emocional

Consejos para el Éxito Profesional:
- Networking Estratégico: Participa en eventos de tu industria
- Educación Continua: Realiza cursos de especialización
- Experiencia Práctica: Busca pasantías durante la universidad
- Desarrollo de Habilidades Blandas: Mejora comunicación y liderazgo',
  true,
  3
);

-- Insert general resources
INSERT INTO knowledge_base_articles (category_id, title, slug, excerpt, content, is_featured, sort_order) VALUES
(
  (SELECT id FROM knowledge_base_categories WHERE slug = 'general-resources'),
  'Base de Conocimiento - Recursos Generales',
  'knowledge-base',
  'Recursos generales y documentación de apoyo para el desarrollo profesional',
  'Base de Conocimiento - Recursos Generales

Bienvenido a la Base de Conocimiento de Despega Tu Carrera. Aquí encontrarás recursos, guías y documentación para maximizar tu desarrollo profesional.

Categorías Disponibles

Documentación Técnica:
Especificaciones técnicas, arquitectura del sistema y documentación para desarrolladores.

Guías de Usuario:
Tutoriales paso a paso, mejores prácticas y consejos para usar efectivamente la plataforma.

Información de Carreras:
Datos del mercado laboral chileno, tendencias por industria y oportunidades profesionales.

Recursos Generales:
Materiales adicionales, plantillas, checklists y herramientas complementarias.

Cómo Usar Esta Base de Conocimiento

Para Estudiantes:
- Explora las guías específicas de tu carrera
- Revisa las tendencias del mercado laboral
- Utiliza las plantillas y herramientas disponibles
- Mantente actualizado con nuevos recursos

Para Profesionales:
- Consulta información de transición de carrera
- Accede a recursos de desarrollo continuo
- Utiliza herramientas de networking y marca personal
- Explora oportunidades en sectores emergentes

Búsqueda y Navegación

Funcionalidades de Búsqueda:
- Búsqueda por palabras clave en todo el contenido
- Filtros por categoría para encontrar información específica
- Artículos relacionados para explorar temas conexos
- Contenido destacado con los recursos más populares

Recursos Más Populares

Top 5 Artículos Más Consultados:
1. Guía Completa de Carreras - Información del mercado laboral chileno
2. Especificación Técnica DTC - Documentación técnica de la plataforma
3. Guía de Inicio - Cómo usar la plataforma efectivamente
4. Plantillas de CV - Formatos específicos por carrera
5. Consejos de Entrevista - Preparación por industria

Herramientas y Plantillas

Plantillas Disponibles:
- CV por Carrera: Formatos optimizados para cada profesión
- Cartas de Presentación: Templates personalizables
- Portfolio Digital: Estructuras para mostrar trabajo
- Plan de Desarrollo: Plantillas de crecimiento profesional

Checklists Útiles:
- Preparación de Entrevistas: Lista de verificación completa
- Networking Efectivo: Pasos para construir red profesional
- Búsqueda de Empleo: Estrategia sistemática de búsqueda
- Desarrollo de Habilidades: Plan de mejora continua

Estadísticas y Datos

Mercado Laboral Chileno 2024:
- Tasa de Desempleo: 7.8% (promedio nacional)
- Sectores en Crecimiento: Tecnología (+12%), Salud (+8%), Sustentabilidad (+15%)
- Habilidades Más Demandadas: Adaptabilidad, pensamiento crítico, competencias digitales
- Modalidades de Trabajo: 35% remoto, 40% híbrido, 25% presencial

Educación Continua

Certificaciones Recomendadas por Carrera:

Arquitectura:
- LEED Green Associate: Construcción sustentable
- Revit Architecture: Modelado BIM
- Project Management: Gestión de proyectos

Derecho:
- Compliance Officer: Cumplimiento normativo
- Data Protection: Protección de datos
- Arbitration: Resolución de conflictos

Diseño:
- Google UX Design: Experiencia de usuario
- Adobe Certified Expert: Herramientas creativas
- Design Thinking: Metodología de innovación

Ingeniería Comercial:
- PMP: Project Management Professional
- CFA: Chartered Financial Analyst
- Google Analytics: Análisis de datos

Ingeniería Civil Informática:
- AWS Solutions Architect: Arquitectura en la nube
- Certified Ethical Hacker: Ciberseguridad
- Scrum Master: Metodologías ágiles

Medicina:
- ACLS: Advanced Cardiovascular Life Support
- Especialización Médica: Según área de interés
- Investigación Clínica: Metodología de investigación

Psicología:
- Terapia Cognitivo-Conductual: Especialización terapéutica
- Neuropsicología Clínica: Evaluación cognitiva
- Psicología Organizacional: Recursos humanos

Plataformas de Aprendizaje Recomendadas:
- Coursera: Cursos universitarios y especializaciones
- edX: Programas de universidades prestigiosas
- Platzi: Tecnología y habilidades digitales
- LinkedIn Learning: Habilidades profesionales
- Udemy: Cursos específicos y prácticos

Soporte y Contacto

Canales de Ayuda:
- Chat en Vivo: Lunes a Viernes 9:00-18:00
- Email: soporte@despegaturcarrera.cl
- Centro de Ayuda: FAQ y tutoriales

Esta base de conocimiento se actualiza constantemente. Si no encuentras la información que buscas, no dudes en contactar nuestro equipo de soporte.',
  true,
  4
);

-- Verify the data
SELECT 
  c.name as category_name,
  a.title as article_title,
  a.slug as article_slug,
  LENGTH(a.content) as content_length
FROM knowledge_base_categories c
LEFT JOIN knowledge_base_articles a ON c.id = a.category_id
ORDER BY c.sort_order, a.sort_order;
