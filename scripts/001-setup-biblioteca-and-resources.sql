-- Create tabla biblioteca if not exists with all fields needed for books and Chilean public resources
CREATE TABLE IF NOT EXISTS biblioteca (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  tags TEXT[],
  url VARCHAR(500),
  language VARCHAR(10) DEFAULT 'es',
  relevance_score NUMERIC(3,2) DEFAULT 1.00,
  read_count INTEGER DEFAULT 0,
  content TEXT,
  slug VARCHAR(255) UNIQUE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  source_type VARCHAR(50) DEFAULT 'internal',
  is_recommended BOOLEAN DEFAULT TRUE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_biblioteca_category ON biblioteca(category);
CREATE INDEX IF NOT EXISTS idx_biblioteca_tags ON biblioteca USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_biblioteca_source_type ON biblioteca(source_type);

-- Insert 46 Chilean public resources
INSERT INTO biblioteca (title, author, description, category, tags, url, language, relevance_score, is_recommended)
VALUES
-- Competencias Laborales (5)
('Catálogo de Perfiles ChileValora', 'ChileValora', 'Marco de competencias laborales chileno con perfiles detallados', 'Competencias', ARRAY['competencias', 'laboral', 'chile'], 'https://www.chilevalora.cl/', 'es', 0.95, true),
('Guía de Articulación de Competencias 2024', 'ChileValora', 'Guía para articulación de competencias entre niveles de educación', 'Competencias', ARRAY['articulation', 'competencies', 'education'], 'https://www.chilevalora.cl/', 'es', 0.90, true),
('Clasificación de Perfiles de Gestión', 'ChileValora', 'Perfiles de gestión según estándares nacionales', 'Competencias', ARRAY['management', 'profiles'], 'https://www.chilevalora.cl/', 'es', 0.85, false),
('Guía Técnica de Certificación 2024', 'ChileValora', 'Procedimientos técnicos para certificación laboral', 'Competencias', ARRAY['certification', 'standards'], 'https://www.chilevalora.cl/', 'es', 0.88, true),
('Atlas de Ocupaciones Chile', 'ChileValora', 'Mapeo completo de ocupaciones en el mercado laboral chileno', 'Competencias', ARRAY['occupations', 'labor_market', 'chile'], 'https://www.chilevalora.cl/', 'es', 0.92, true),

-- Datos Laborales (6)
('ENCLA - Encuesta Laboral', 'Dirección del Trabajo', 'Encuesta sobre relaciones laborales e instituciones en Chile', 'Datos Laborales', ARRAY['encuesta', 'laboral', 'estadisticas'], 'https://www.dt.gob.cl/', 'es', 0.85, false),
('SUBTEL - Acceso a Internet', 'SUBTEL', 'Información sobre acceso a internet y conectividad en Chile', 'Conectividad', ARRAY['internet', 'conectividad', 'datos'], 'https://www.subtel.gob.cl/', 'es', 0.75, false),
('Informe Final SUBTEL 2024', 'SUBTEL', 'Análisis completo del sector telecomunicaciones en Chile', 'Conectividad', ARRAY['telecomunicaciones', 'infraestructura'], 'https://www.subtel.gob.cl/', 'es', 0.80, false),
('Encuesta de Acceso a Internet', 'SUBTEL', 'Datos sobre acceso y uso de internet por región', 'Conectividad', ARRAY['internet', 'regiones'], 'https://www.subtel.gob.cl/', 'es', 0.78, false),
('Reporte de Conectividad Rural', 'SUBTEL', 'Situación de conectividad en zonas rurales de Chile', 'Conectividad', ARRAY['rural', 'conectividad'], 'https://www.subtel.gob.cl/', 'es', 0.72, false),
('Tendencias de Sociedad Digital', 'Observatorio Social', 'Análisis de tendencias digitales en la sociedad chilena', 'Datos Laborales', ARRAY['digital', 'tendencias', 'sociedad'], 'https://www.obs.cl/', 'es', 0.82, false),

-- Educación Superior (7)
('SIES - Sistema de Información Educación Superior', 'Mineduc', 'Base de datos completa de instituciones y programas de educación superior', 'Educación Superior', ARRAY['sies', 'educacion', 'superior', 'instituciones'], 'https://www.sies.cl/', 'es', 0.93, true),
('Guía de Admisión Mineduc', 'Mineduc', 'Información sobre proceso de admisión a educación superior', 'Educación Superior', ARRAY['admision', 'educacion'], 'https://www.mifuturo.cl/', 'es', 0.88, true),
('Aranceles y Costos Educación Superior 2024', 'Mineduc', 'Información sobre aranceles en instituciones de educación superior', 'Educación Superior', ARRAY['aranceles', 'costos'], 'https://www.sies.cl/', 'es', 0.85, false),
('Programas de Becas y Financiamiento', 'Mineduc', 'Opciones de financiamiento para estudiantes de educación superior', 'Educación Superior', ARRAY['becas', 'financiamiento', 'creditos'], 'https://www.mifuturo.cl/', 'es', 0.90, true),
('Carreras con Mayor Demanda Laboral', 'Observatorio Laboral', 'Análisis de carreras más demandadas en el mercado', 'Educación Superior', ARRAY['demanda', 'carreras', 'mercado'], 'https://www.obs.cl/', 'es', 0.87, true),
('Tasa de Empleabilidad por Carrera', 'SIES', 'Estadísticas de empleabilidad por programa de estudio', 'Educación Superior', ARRAY['empleabilidad', 'estadisticas'], 'https://www.sies.cl/', 'es', 0.91, true),
('Portales de Busqueda de Carreras', 'Mineduc', 'Herramientas para buscar y comparar programas de estudio', 'Educación Superior', ARRAY['busqueda', 'programas', 'carreras'], 'https://www.mifuturo.cl/', 'es', 0.84, false),

-- Educación Escolar (3)
('PISA - Evaluación Internacional de Estudiantes', 'OCDE', 'Resultados de evaluación PISA para Chile', 'Educación Escolar', ARRAY['pisa', 'ocde', 'evaluacion'], 'https://www.oecd.org/pisa/', 'es', 0.80, false),
('Información sobre Educación Escolar Chile', 'Mineduc', 'Datos estadísticos de educación escolar', 'Educación Escolar', ARRAY['estadisticas', 'educacion'], 'https://www.mineduc.cl/', 'es', 0.75, false),
('Estándares Nacionales de Desempeño Escolar', 'Agencia Educación', 'Estándares de calidad para educación escolar', 'Educación Escolar', ARRAY['estandares', 'calidad'], 'https://www.agenciaeducacion.cl/', 'es', 0.78, false),

-- Empleo Público (5)
('Empleos Públicos - Servicio Civil', 'Servicio Civil', 'Portal de empleos en sector público chileno', 'Empleo', ARRAY['empleos', 'publico', 'servicio'], 'https://www.empleospublicos.cl/', 'es', 0.88, false),
('Estadísticas Seguro de Cesantía', 'Superintendencia Seguridad Social', 'Datos sobre empleo y cesantía en Chile', 'Empleo', ARRAY['cesantia', 'desempleo'], 'https://www.suseso.cl/', 'es', 0.82, false),
('Indicador de Empleo Público', 'INE', 'Series históricas de empleo público en Chile', 'Empleo', ARRAY['empleo', 'publico', 'indicadores'], 'https://www.ine.cl/', 'es', 0.80, false),
('Programa de Empleo Joven', 'Ministerio Trabajo', 'Iniciativas de empleo para jóvenes en Chile', 'Empleo', ARRAY['joven', 'empleo', 'programas'], 'https://www.mintrab.gob.cl/', 'es', 0.85, true),
('Emprendimiento en Chile - Datos SECO', 'Ministerio Economía', 'Información sobre emprendimiento y startups', 'Empleo', ARRAY['emprendimiento', 'startups'], 'https://www.economia.gob.cl/', 'es', 0.83, true),

-- Mercado Laboral (8)
('Encuesta Nacional de Ocupación e Inactividad', 'INE', 'Datos detallados de mercado laboral chileno', 'Mercado Laboral', ARRAY['ocupacion', 'mercado', 'ine'], 'https://www.ine.cl/', 'es', 0.94, true),
('Índice de Tendencias Laborales', 'INE', 'Indicadores de tendencias en mercado laboral', 'Mercado Laboral', ARRAY['tendencias', 'mercado', 'indicadores'], 'https://www.ine.cl/', 'es', 0.89, true),
('Salarios por Ocupación en Chile', 'Banco Central', 'Información sobre salarios promedio por profesión', 'Mercado Laboral', ARRAY['salarios', 'ocupacion'], 'https://www.bcentral.cl/', 'es', 0.91, true),
('Demanda Laboral por Región', 'Observatorio Laboral', 'Análisis de demanda laboral geográfica', 'Mercado Laboral', ARRAY['demanda', 'regiones', 'geografica'], 'https://www.obs.cl/', 'es', 0.86, false),
('Proyecciones de Empleo 2024-2030', 'OIT', 'Proyecciones sobre empleo futuro en Chile', 'Mercado Laboral', ARRAY['proyecciones', 'futuro'], 'https://www.ilo.org/', 'es', 0.85, true),
('Sectores Económicos en Crecimiento', 'Banco Central', 'Análisis de sectores económicos dinámicos', 'Mercado Laboral', ARRAY['sectores', 'economia', 'crecimiento'], 'https://www.bcentral.cl/', 'es', 0.84, true),
('Encuesta de Remuneraciones por Sector', 'INE', 'Datos salariales desagregados por sector económico', 'Mercado Laboral', ARRAY['remuneraciones', 'sectores'], 'https://www.ine.cl/', 'es', 0.87, false),
('Movilidad Laboral en Chile', 'Observatorio Social', 'Estudio sobre movilidad y cambios laborales', 'Mercado Laboral', ARRAY['movilidad', 'cambios', 'trayectorias'], 'https://www.obs.cl/', 'es', 0.83, false),

-- Información General (6)
('Diccionario de Ocupaciones CIUO', 'OIT', 'Clasificación internacional uniforme de ocupaciones', 'Referencia', ARRAY['clasificacion', 'ocupaciones'], 'https://www.ilo.org/ciuo/', 'es', 0.88, false),
('Normativa Laboral Chilena', 'Dirección Trabajo', 'Resumen de leyes y normativas laborales vigentes', 'Referencia', ARRAY['normativa', 'laboral', 'leyes'], 'https://www.dt.gob.cl/', 'es', 0.90, false),
('Datos Económicos Banco Central', 'Banco Central de Chile', 'Indicadores económicos y estadísticas nacionales', 'Economía', ARRAY['economia', 'indicadores'], 'https://www.bcentral.cl/', 'es', 0.85, false),
('Atlas de Desigualdad en Chile', 'PNUD', 'Análisis de desigualdad y oportunidades en Chile', 'Sociedad', ARRAY['desigualdad', 'oportunidades', 'social'], 'https://www.undp.org/es/chile', 'es', 0.82, false),
('Reportes de Desarrollo Humano', 'PNUD', 'Índice de desarrollo humano y análisis relacionado', 'Desarrollo', ARRAY['desarrollo', 'humano', 'idh'], 'https://www.undp.org/es/chile', 'es', 0.84, false),
('Institucionalidad Laboral Chilena', 'Ministerio Trabajo', 'Información sobre instituciones relacionadas al trabajo', 'Instituciones', ARRAY['instituciones', 'trabajo'], 'https://www.mintrab.gob.cl/', 'es', 0.79, false);

-- Removed invalid CREATE POLICY IF NOT EXISTS (PostgreSQL doesn't support this syntax)
-- RLS policies already exist, no need to recreate them
