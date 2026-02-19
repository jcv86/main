-- Create A3 Training Modules table
CREATE TABLE IF NOT EXISTS a3_entrenamientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100) NOT NULL,
  nivel VARCHAR(50) NOT NULL DEFAULT 'intermedio', -- principiante, intermedio, avanzado
  duracion_minutos INTEGER DEFAULT 60,
  contenido JSONB, -- estructura flexible para contenido
  competencias_desarrolladas TEXT[], -- array de habilidades
  requisitos_previos TEXT[], -- módulos requeridos antes
  tags TEXT[], -- for searching and filtering
  activo BOOLEAN DEFAULT true,
  orden INTEGER, -- orden de presentación
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_a3_entrenamientos_categoria ON a3_entrenamientos(categoria);
CREATE INDEX idx_a3_entrenamientos_nivel ON a3_entrenamientos(nivel);
CREATE INDEX idx_a3_entrenamientos_activo ON a3_entrenamientos(activo);

-- Insert training modules
INSERT INTO a3_entrenamientos (titulo, descripcion, categoria, nivel, duracion_minutos, competencias_desarrolladas, tags) VALUES
-- Leadership
('Fundamentos del Liderazgo', 'Aprende los principios básicos de liderazgo efectivo', 'liderazgo', 'principiante', 45, ARRAY['comunicación', 'visión', 'inspiración'], ARRAY['liderazgo', 'fundamentos']),
('Liderazgo Transformacional', 'Desarrolla habilidades de liderazgo transformacional para inspirar equipos', 'liderazgo', 'intermedio', 60, ARRAY['inspiración', 'visión', 'cambio'], ARRAY['liderazgo', 'equipos']),
('Gestión de Conflictos en Equipos', 'Herramientas para resolver conflictos y mejorar cohesión de equipo', 'liderazgo', 'avanzado', 75, ARRAY['resolución de conflictos', 'empatía', 'negociación'], ARRAY['liderazgo', 'conflictos']),

-- Communication
('Comunicación Efectiva', 'Mejora tus habilidades de comunicación clara y persuasiva', 'comunicacion', 'principiante', 45, ARRAY['escucha activa', 'claridad', 'empatía'], ARRAY['comunicación', 'básico']),
('Presentaciones Impactantes', 'Aprende a crear y presentar ideas de forma memorable', 'comunicacion', 'intermedio', 60, ARRAY['oratoria', 'persuasión', 'presencia'], ARRAY['comunicación', 'presentaciones']),
('Storytelling y Narrativa', 'Domina el arte de contar historias para influir y conectar', 'comunicacion', 'avanzado', 90, ARRAY['narrativa', 'emoción', 'influencia'], ARRAY['comunicación', 'storytelling']),

-- Entrepreneurship
('Mentalidad Emprendedora', 'Desarrolla la mentalidad necesaria para emprender', 'emprendimiento', 'principiante', 45, ARRAY['resiliencia', 'creatividad', 'riesgo'], ARRAY['emprendimiento', 'mindset']),
('Validación de Negocios', 'Aprende a validar ideas de negocio antes de invertir', 'emprendimiento', 'intermedio', 60, ARRAY['análisis de mercado', 'investigación', 'cliente'], ARRAY['emprendimiento', 'validación']),
('Financiamiento y Crecimiento', 'Estrategias para financiar y escalar tu negocio', 'emprendimiento', 'avanzado', 75, ARRAY['finanzas', 'inversión', 'escalabilidad'], ARRAY['emprendimiento', 'crecimiento']),

-- Digital Transformation
('Introducción a la Transformación Digital', 'Entiende el impacto de la digitalización en negocios', 'transformacion-digital', 'principiante', 45, ARRAY['tecnología', 'innovación', 'cambio'], ARRAY['digital', 'introducción']),
('Automatización de Procesos', 'Identificar oportunidades de automatización en tu empresa', 'transformacion-digital', 'intermedio', 60, ARRAY['eficiencia', 'RPA', 'optimización'], ARRAY['digital', 'automatización']),
('IA y Machine Learning para Negocios', 'Aplicaciones prácticas de IA en decisiones empresariales', 'transformacion-digital', 'avanzado', 90, ARRAY['IA', 'datos', 'predicción'], ARRAY['digital', 'IA']),

-- Management
('Gestión de Proyectos Básica', 'Fundamentos de gestión de proyectos efectiva', 'gestion', 'principiante', 45, ARRAY['planificación', 'seguimiento', 'entrega'], ARRAY['gestión', 'proyectos']),
('Metodologías Ágiles', 'Aprende Scrum y metodologías ágiles para mejor productividad', 'gestion', 'intermedio', 60, ARRAY['agilidad', 'iteración', 'adaptabilidad'], ARRAY['gestión', 'ágil']),
('Liderazgo de Equipos Remotos', 'Gestiona equipos distribuidos de forma efectiva', 'gestion', 'avanzado', 75, ARRAY['remoto', 'confianza', 'comunicación asincrónica'], ARRAY['gestión', 'remoto']),

-- Personal Development
('Inteligencia Emocional', 'Desarrolla tu inteligencia emocional y autoconciencia', 'desarrollo-personal', 'principiante', 45, ARRAY['autoconocimiento', 'empatía', 'autorregulación'], ARRAY['desarrollo', 'emocional']),
('Productividad y Gestión del Tiempo', 'Sistemas y técnicas para maximizar tu productividad', 'desarrollo-personal', 'intermedio', 60, ARRAY['productividad', 'priorización', 'enfoque'], ARRAY['desarrollo', 'productividad']),
('Mentalidad de Crecimiento', 'Cultiva una mentalidad de aprendizaje continuo', 'desarrollo-personal', 'avanzado', 75, ARRAY['aprendizaje', 'resiliencia', 'crecimiento'], ARRAY['desarrollo', 'mindset']),

-- Sales
('Fundamentos de Ventas', 'Principios básicos de ventas y prospección', 'ventas', 'principiante', 45, ARRAY['prospección', 'cierre', 'cliente'], ARRAY['ventas', 'básico']),
('Técnicas de Negociación', 'Estrategias ganadoras para negociar mejores términos', 'ventas', 'intermedio', 60, ARRAY['negociación', 'persuasión', 'valor'], ARRAY['ventas', 'negociación']),
('Venta Consultiva Avanzada', 'Venta basada en solución y valor para el cliente', 'ventas', 'avanzado', 75, ARRAY['consultoría', 'solución', 'relación'], ARRAY['ventas', 'consultiva'])
ON CONFLICT DO NOTHING;

-- Enable RLS if needed
ALTER TABLE a3_entrenamientos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access (useful for showing available trainings)
CREATE POLICY "Anyone can view active trainings" 
  ON a3_entrenamientos 
  FOR SELECT 
  USING (activo = true);
