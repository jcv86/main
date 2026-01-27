-- A3 Entrevistas: Tracking de progreso 30-60-90
CREATE TABLE a3_entrevista_progreso_ciclos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  ciclo INT CHECK (ciclo IN (30, 60, 90)) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  entrevistas_completadas INT DEFAULT 0,
  score_promedio NUMERIC(3,1) DEFAULT 0,
  feedback_ia_count INT DEFAULT 0,
  videos_vistos INT DEFAULT 0,
  empleadores_interesados INT DEFAULT 0,
  progreso_porcentaje INT DEFAULT 0,
  estado VARCHAR CHECK (estado IN ('en_progreso', 'completado', 'pausado')),
  creado_at TIMESTAMP DEFAULT NOW(),
  actualizado_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, ciclo)
);

CREATE TABLE a3_entrevista_feedback_ia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sesion_id UUID REFERENCES a3_entrevistas_sesiones NOT NULL,
  respuesta_usuario TEXT NOT NULL,
  pregunta TEXT NOT NULL,
  analisis_fortalezas TEXT[],
  areas_mejora TEXT[],
  sugerencias_especificas TEXT NOT NULL,
  score_contenido INT,
  score_entrega INT,
  score_confianza INT,
  recomendacion_siguiente TEXT,
  creado_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE a3_videos_banco (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR NOT NULL,
  descripcion TEXT,
  url_video VARCHAR NOT NULL,
  duracion_segundos INT,
  tipo_entrevista VARCHAR,
  perfil_target VARCHAR[],
  nivel_dificultad VARCHAR CHECK (nivel_dificultad IN ('basico', 'intermedio', 'avanzado')),
  tags TEXT[],
  orden INT,
  creado_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE a3_video_progreso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  video_id UUID REFERENCES a3_videos_banco NOT NULL,
  visto BOOLEAN DEFAULT FALSE,
  tiempo_reproduccion_segundos INT DEFAULT 0,
  anotaciones TEXT,
  completado_at TIMESTAMP,
  UNIQUE(user_id, video_id)
);

CREATE TABLE a3_empleadores_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  descripcion TEXT,
  url_logo VARCHAR,
  cantidad_vacantes INT DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  creado_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE a3_scoring_empleadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  empleador_id UUID REFERENCES a3_empleadores_partners NOT NULL,
  score_general INT,
  habilidades_match TEXT[],
  potencial_interes BOOLEAN,
  compartido_at TIMESTAMP,
  visto_por_empleador_at TIMESTAMP,
  UNIQUE(user_id, empleador_id)
);

CREATE TABLE a3_api_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empleador_id UUID REFERENCES a3_empleadores_partners NOT NULL,
  evento_tipo VARCHAR CHECK (evento_tipo IN ('entrevista_completada', 'nuevo_score', 'perfil_compartido')),
  url_webhook VARCHAR NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  ultimos_eventos JSONB DEFAULT '[]',
  creado_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_a3_progreso_user ON a3_entrevista_progreso_ciclos(user_id);
CREATE INDEX idx_a3_feedback_sesion ON a3_entrevista_feedback_ia(sesion_id);
CREATE INDEX idx_a3_video_user ON a3_video_progreso(user_id);
CREATE INDEX idx_a3_scoring_user ON a3_scoring_empleadores(user_id);
