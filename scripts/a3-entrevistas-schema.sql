-- A3: ATERRIZAJE - ENTREVISTAS GUIADAS
-- Schema para gestionar entrevistas, feedback IA y progreso

-- Tabla de entrevistas disponibles
CREATE TABLE IF NOT EXISTS a3_entrevistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(30) CHECK (tipo IN ('educacion', 'asistencia', 'transicion')),
  preguntas JSONB NOT NULL, -- Array de preguntas
  duracion_minutos INT DEFAULT 30,
  nivel VARCHAR(20) CHECK (nivel IN ('principiante', 'intermedio', 'avanzado')),
  competencias TEXT[], -- Qué skills evalúa
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Respuestas de entrevistas del usuario
CREATE TABLE IF NOT EXISTS a3_user_entrevistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  entrevista_id UUID REFERENCES a3_entrevistas NOT NULL,
  respuestas JSONB NOT NULL, -- Respuestas del usuario
  score_total INT CHECK (score_total BETWEEN 0 AND 100),
  feedback_ia JSONB, -- Feedback generado por IA
  tiempo_real_minutos INT,
  completada_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progreso 30-60-90 del usuario en A3
CREATE TABLE IF NOT EXISTS a3_user_progreso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  fase VARCHAR(20) CHECK (fase IN ('30-dias', '60-dias', '90-dias')),
  entrevistas_completadas INT DEFAULT 0,
  score_promedio INT,
  competencias_desarrolladas TEXT[],
  logros TEXT[],
  recomendaciones TEXT[],
  empleadores_interesados INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fase)
);

-- Banco de videos educativos
CREATE TABLE IF NOT EXISTS a3_video_banco (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  url_video VARCHAR(255) NOT NULL,
  duracion_segundos INT,
  categoria VARCHAR(50), -- Ej: 'comunicacion', 'presentacion', 'negociacion'
  competencia VARCHAR(100),
  nivel VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seguimiento de videos vistos
CREATE TABLE IF NOT EXISTS a3_user_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  video_id UUID REFERENCES a3_video_banco NOT NULL,
  visto_at TIMESTAMPTZ DEFAULT NOW(),
  duracion_visto_segundos INT,
  completado BOOLEAN DEFAULT false,
  UNIQUE(user_id, video_id)
);

-- Empleadores en el sistema
CREATE TABLE IF NOT EXISTS a3_empleadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  industria VARCHAR(100),
  url_website VARCHAR(255),
  email_contacto VARCHAR(255),
  api_key VARCHAR(255), -- Para webhooks
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matching entre usuarios y empleadores
CREATE TABLE IF NOT EXISTS a3_user_empleador_match (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  empleador_id UUID REFERENCES a3_empleadores NOT NULL,
  score_compatibilidad INT CHECK (score_compatibilidad BETWEEN 0 AND 100),
  estado VARCHAR(30) CHECK (estado IN ('pendiente', 'visto', 'interesado', 'rechazado')),
  enviado_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, empleador_id)
);

-- RLS Policies
ALTER TABLE a3_user_entrevistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_user_progreso ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_user_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_user_empleador_match ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven solo sus entrevistas" ON a3_user_entrevistas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios ven solo su progreso" ON a3_user_progreso
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios ven solo sus videos" ON a3_user_videos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios ven solo sus matches" ON a3_user_empleador_match
  FOR SELECT USING (auth.uid() = user_id);

-- Datos iniciales: Entrevistas de ejemplo
INSERT INTO a3_entrevistas (titulo, descripcion, tipo, preguntas, nivel, competencias) VALUES
('Comunicación Efectiva', 'Evalúa tu capacidad para comunicar ideas de forma clara', 'educacion', 
  '[{"id": 1, "pregunta": "¿Cómo explicarías tu proyecto a alguien sin experiencia técnica?", "tipo": "abierta"},
    {"id": 2, "pregunta": "¿Cuál es tu estilo de comunicación principal?", "tipo": "multiple"}]'::jsonb,
  'principiante', ARRAY['Comunicación', 'Claridad', 'Empatía']),

('Presentación en Público', 'Evalúa tu capacidad para presentar con confianza', 'asistencia',
  '[{"id": 1, "pregunta": "¿Cómo manejas los nervios ante audiencias grandes?", "tipo": "abierta"},
    {"id": 2, "pregunta": "¿Qué es lo más importante en una presentación?", "tipo": "multiple"}]'::jsonb,
  'intermedio', ARRAY['Presentación', 'Confianza', 'Estructura']),

('Negociación', 'Evalúa tu capacidad para negociar en contextos profesionales', 'transicion',
  '[{"id": 1, "pregunta": "¿Cómo abordas una negociación donde ambas partes tienen posiciones diferentes?", "tipo": "abierta"},
    {"id": 2, "pregunta": "¿Cuál es tu enfoque principal en negociaciones?", "tipo": "multiple"}]'::jsonb,
  'avanzado', ARRAY['Negociación', 'Empatía', 'Decisión']);

-- Datos iniciales: Videos
INSERT INTO a3_video_banco (titulo, descripcion, url_video, duracion_segundos, categoria, competencia, nivel) VALUES
('Comunicación Clara: 5 Tips', 'Aprende técnicas para comunicar de forma efectiva', 'https://example.com/video1', 480, 'comunicacion', 'Comunicación', 'principiante'),
('Presentaciones que Impactan', 'Estructura y técnicas para presentaciones memorables', 'https://example.com/video2', 720, 'presentacion', 'Presentación', 'intermedio'),
('Negociación Estratégica', 'Tácticas avanzadas de negociación profesional', 'https://example.com/video3', 900, 'negociacion', 'Negociación', 'avanzado');
