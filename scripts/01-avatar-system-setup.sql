-- Phase 1: Avatar System Database Setup
-- Tables for avatar profiles, practice moments, and progress tracking

-- 1. Avatar Profiles Table
CREATE TABLE IF NOT EXISTS avatar_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avatar_id VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  rol VARCHAR(100) NOT NULL,
  tono VARCHAR(50) NOT NULL,
  descripcion_larga TEXT,
  descripcion_corta TEXT,
  nivel_dificultad INTEGER DEFAULT 1,
  competencias_focus JSONB,
  contexto_entrevista JSONB,
  video_urls JSONB, -- { greeting: "", thinking: "", farewell: "" }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. A2-A3 Practice Moments (when to practice with each avatar)
CREATE TABLE IF NOT EXISTS a2_a3_practice_moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia INTEGER NOT NULL, -- 1-90
  mes INTEGER NOT NULL, -- 1-3
  avatar_id VARCHAR(50) NOT NULL REFERENCES avatar_profiles(avatar_id),
  titulo_tarea VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo_practica VARCHAR(50), -- "entrevista_mock", "respuesta_practica", "caso_estudio"
  competencias_enfoque JSONB,
  criterios_exito JSONB,
  tiempo_estimado_minutos INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(dia, mes)
);

-- 3. User Avatar Progress (tracks practice sessions)
CREATE TABLE IF NOT EXISTS user_avatar_practice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  avatar_id VARCHAR(50) NOT NULL REFERENCES avatar_profiles(avatar_id),
  dia INTEGER NOT NULL,
  mes INTEGER NOT NULL,
  tipo_practica VARCHAR(50),
  completada BOOLEAN DEFAULT FALSE,
  score_total INTEGER,
  score_confidence INTEGER,
  score_clarity INTEGER,
  score_delivery INTEGER,
  feedback_ia TEXT,
  respuesta_usuario TEXT,
  video_session_id UUID,
  retry_count INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Avatar Interaction History (for engagement tracking)
CREATE TABLE IF NOT EXISTS avatar_interaction_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  avatar_id VARCHAR(50) NOT NULL REFERENCES avatar_profiles(avatar_id),
  tipo_interaccion VARCHAR(50), -- "greeting", "thinking", "farewell", "feedback"
  timestamp_inicio TIMESTAMP WITH TIME ZONE,
  timestamp_fin TIMESTAMP WITH TIME ZONE,
  duracion_segundos INTEGER,
  video_view_completed BOOLEAN,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user_id_log FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Avatar Difficulty Progression (tracks difficulty escalation)
CREATE TABLE IF NOT EXISTS user_avatar_difficulty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  avatar_id VARCHAR(50) NOT NULL REFERENCES avatar_profiles(avatar_id),
  dificultad_actual INTEGER DEFAULT 1,
  dificultad_maxima_alcanzada INTEGER DEFAULT 1,
  score_promedio DECIMAL(5, 2),
  ultimo_score INTEGER,
  intentos_totales INTEGER DEFAULT 0,
  intentos_exitosos INTEGER DEFAULT 0,
  puede_incrementar_dificultad BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user_id_diff FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, avatar_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_avatar_practice_user_id ON user_avatar_practice(user_id);
CREATE INDEX idx_user_avatar_practice_avatar_id ON user_avatar_practice(avatar_id);
CREATE INDEX idx_user_avatar_practice_dia_mes ON user_avatar_practice(dia, mes);
CREATE INDEX idx_a2_a3_practice_dia_mes ON a2_a3_practice_moments(dia, mes);
CREATE INDEX idx_avatar_interaction_log_user_id ON avatar_interaction_log(user_id);
CREATE INDEX idx_user_avatar_difficulty_user_id ON user_avatar_difficulty(user_id);

-- Enable RLS on all tables
ALTER TABLE avatar_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_a3_practice_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_avatar_practice ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_interaction_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_avatar_difficulty ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- avatar_profiles: anyone can view (public data)
CREATE POLICY "Anyone can view avatar profiles" ON avatar_profiles
  FOR SELECT USING (TRUE);

-- a2_a3_practice_moments: anyone can view (public data)
CREATE POLICY "Anyone can view practice moments" ON a2_a3_practice_moments
  FOR SELECT USING (TRUE);

-- user_avatar_practice: users can view/insert/update own data
CREATE POLICY "Users can view own avatar practice" ON user_avatar_practice
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own avatar practice" ON user_avatar_practice
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own avatar practice" ON user_avatar_practice
  FOR UPDATE USING (user_id = auth.uid());

-- avatar_interaction_log: users can insert/view own data
CREATE POLICY "Users can insert own avatar interactions" ON avatar_interaction_log
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can view own avatar interactions" ON avatar_interaction_log
  FOR SELECT USING (user_id = auth.uid());

-- user_avatar_difficulty: users can view/update own data
CREATE POLICY "Users can view own avatar difficulty" ON user_avatar_difficulty
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own avatar difficulty" ON user_avatar_difficulty
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own avatar difficulty" ON user_avatar_difficulty
  FOR UPDATE USING (user_id = auth.uid());
