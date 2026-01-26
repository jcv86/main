-- Schema para Entrevistas Guiadas (A3 - Aterrizaje)
-- Tablas para gestionar entrevistas asistidas y no asistidas

-- 1. Tabla de módulos educativos
CREATE TABLE a3_modulos_educativos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR NOT NULL,
  descripcion TEXT,
  contenido JSONB, -- { "introduccion": "...", "que_esperar": "...", "tips": [...] }
  tipo_modulo VARCHAR, -- 'que_es_entrevista', 'a_que_te_enfrentas', 'tips_preparacion'
  orden INT,
  created_at TIMESTAMP DEFAULT now()
);

-- 2. Tabla de preguntas por tipo de entrevista
CREATE TABLE a3_preguntas_entrevista (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pregunta TEXT NOT NULL,
  tipo_entrevista VARCHAR, -- 'conductual', 'tecnica', 'situacional', 'general'
  dificultad VARCHAR, -- 'facil', 'medio', 'dificil'
  categoria VARCHAR, -- 'motivacion', 'conflicto', 'habilidades', 'experiencia'
  sugerencia_respuesta TEXT,
  tips JSONB, -- Array de tips para responder
  perfil_ideal VARCHAR, -- A/B/C/D del DISC
  created_at TIMESTAMP DEFAULT now()
);

-- 3. Tabla de sesiones de entrevista guiada
CREATE TABLE a3_entrevistas_sesiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_entrevista VARCHAR, -- 'guiada' o 'libre'
  estado VARCHAR, -- 'en_progreso', 'completada', 'pausada'
  etapa_actual VARCHAR, -- 'educacion', 'entrevista', 'feedback'
  modulos_completados JSONB, -- Array de módulos vistos
  fecha_inicio TIMESTAMP DEFAULT now(),
  fecha_completada TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 4. Tabla de respuestas del usuario en entrevista
CREATE TABLE a3_respuestas_entrevista (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sesion_id UUID REFERENCES a3_entrevistas_sesiones(id) ON DELETE CASCADE,
  pregunta_id UUID REFERENCES a3_preguntas_entrevista(id),
  respuesta_usuario TEXT,
  score_calidad INT, -- 0-100
  feedback_ia TEXT,
  puntos_fuertes JSONB,
  areas_mejora JSONB,
  tiempo_respuesta INT, -- en segundos
  created_at TIMESTAMP DEFAULT now()
);

-- 5. Tabla de progreso en entrevistas
CREATE TABLE a3_progreso_entrevistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  entrevistas_completadas INT DEFAULT 0,
  puntuacion_promedio DECIMAL(5,2),
  nivel_preparacion VARCHAR, -- 'principiante', 'intermedio', 'avanzado'
  ultima_entrevista TIMESTAMP,
  proxima_recomendacion VARCHAR,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Índices
CREATE INDEX idx_sesiones_user ON a3_entrevistas_sesiones(user_id);
CREATE INDEX idx_sesiones_estado ON a3_entrevistas_sesiones(estado);
CREATE INDEX idx_respuestas_sesion ON a3_respuestas_entrevista(sesion_id);
CREATE INDEX idx_progreso_user ON a3_progreso_entrevistas(user_id);
