-- A3 Training and Simulation Schema
-- Diseñado para entrenamientos en contextos reales con feedback y rúbricas

-- 1. Sesiones de entrenamiento (roleplay, laboratorio, campo)
CREATE TABLE IF NOT EXISTS a3_training_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES a2_user_missions(id),
  session_type TEXT NOT NULL CHECK (session_type IN ('simulator', 'laboratory', 'field')),
  skill_target TEXT NOT NULL, -- e.g., "conversación-difícil", "negociación", "presentación"
  scenario_level TEXT NOT NULL CHECK (scenario_level IN ('basico', 'intermedio', 'avanzado')),
  objective TEXT,
  created_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  status TEXT DEFAULT 'en_progreso' CHECK (status IN ('en_progreso', 'completado', 'abandonado')),
  UNIQUE(user_id, mission_id, session_type, skill_target, session_type)
);

-- 2. Ejecuciones (lo que pasó durante la sesión)
CREATE TABLE IF NOT EXISTS a3_training_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES a3_training_sessions(id) ON DELETE CASCADE,
  execution_data JSONB, -- Guarda transcripción del roleplay o detalles de la práctica
  duration_minutes INT,
  created_at TIMESTAMP DEFAULT now()
);

-- 3. Rúbricas (criterios de evaluación)
CREATE TABLE IF NOT EXISTS a3_rubrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_target TEXT NOT NULL,
  scenario_level TEXT NOT NULL,
  criteria JSONB NOT NULL, -- Array de {criteria_name, description, weight}
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(skill_target, scenario_level)
);

-- 4. Evaluaciones (feedback sobre la sesión)
CREATE TABLE IF NOT EXISTS a3_session_evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id UUID NOT NULL REFERENCES a3_training_executions(id) ON DELETE CASCADE,
  rubric_id UUID REFERENCES a3_rubrics(id),
  scores JSONB NOT NULL, -- {criteria_name: score}
  feedback_narrative TEXT, -- Resumen en palabras del coach
  patterns_detected JSONB, -- Array de patrones observados
  next_steps TEXT, -- Recomendación para la próxima sesión
  created_at TIMESTAMP DEFAULT now()
);

-- 5. Micro-experimentos en vida real (campo)
CREATE TABLE IF NOT EXISTS a3_field_experiments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES a3_training_sessions(id),
  hypothesis TEXT,
  action_taken TEXT,
  context TEXT, -- Dónde/cuándo pasó
  friction_level INT DEFAULT 3, -- 1-5, qué tan difícil fue
  result TEXT,
  learning TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- 6. Progreso por habilidad (agrega data)
CREATE TABLE IF NOT EXISTS a3_skill_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_target TEXT NOT NULL,
  session_count INT DEFAULT 0,
  avg_score DECIMAL(3,2) DEFAULT 0,
  friction_trend TEXT, -- ascending, stable, descending
  days_since_practice INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, skill_target)
);

-- Row-Level Security
ALTER TABLE a3_training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_training_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_session_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_field_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_skill_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own A3 sessions"
  ON a3_training_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own A3 sessions"
  ON a3_training_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own A3 evaluations"
  ON a3_session_evaluations FOR SELECT
  USING (
    execution_id IN (
      SELECT id FROM a3_training_executions
      WHERE session_id IN (
        SELECT id FROM a3_training_sessions
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can view their own A3 field experiments"
  ON a3_field_experiments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own A3 field experiments"
  ON a3_field_experiments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Seed initial rubrics for common skills
INSERT INTO a3_rubrics (skill_target, scenario_level, criteria) VALUES
  ('conversacion-dificil', 'basico', '[
    {"name": "mantiene-hilo", "description": "No se pierde en tangentes", "weight": 0.2},
    {"name": "escucha-activa", "description": "Parafrasea y valida", "weight": 0.25},
    {"name": "claridad", "description": "Expresa ideas sin ambigüedad", "weight": 0.2},
    {"name": "regulacion-emocional", "description": "No escala tensión", "weight": 0.35}
  ]'),
  ('negociacion', 'intermedio', '[
    {"name": "define-intereses", "description": "Identifica lo que realmente importa", "weight": 0.25},
    {"name": "busca-opciones", "description": "Genera alternativas creativas", "weight": 0.3},
    {"name": "cierra-claro", "description": "Deja próximos pasos definidos", "weight": 0.25},
    {"name": "mantiene-relacion", "description": "No sacrifica relación por acuerdo", "weight": 0.2}
  ]'),
  ('presentacion', 'avanzado', '[
    {"name": "estructura", "description": "Inicio-cuerpo-cierre claro", "weight": 0.2},
    {"name": "engagement", "description": "Mantiene atención audiencia", "weight": 0.25},
    {"name": "claridad-tecnica", "description": "Explica conceptos complejos", "weight": 0.3},
    {"name": "presencia", "description": "Lenguaje corporal confiado", "weight": 0.25}
  ]')
ON CONFLICT DO NOTHING;
