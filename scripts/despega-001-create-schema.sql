-- DESPEGA v3 - Database Schema
-- Arquitectura: 2 Caminos (Persona/Profesional) + 4 Pilares

-- 1. User Despega Profile (configuracion principal del usuario)
CREATE TABLE IF NOT EXISTS despega_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  camino_persona_active BOOLEAN DEFAULT false,
  camino_profesional_active BOOLEAN DEFAULT false,
  camino_foco TEXT CHECK (camino_foco IN ('persona', 'profesional', 'ambos')) DEFAULT 'ambos',
  onboarding_completed BOOLEAN DEFAULT false,
  a1_test_completed BOOLEAN DEFAULT false,
  a1_test_completed_at TIMESTAMP WITH TIME ZONE,
  current_ciclo INTEGER DEFAULT 30 CHECK (current_ciclo IN (30, 60, 90)),
  ciclo_start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 1B. A1 Diagnostic Results (Issue #3: separate table for each check-in)
CREATE TABLE IF NOT EXISTS despega_a1_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Diagnostic scores (0-100, NOT points)
  diagnostic_score_energia INTEGER NOT NULL CHECK (diagnostic_score_energia >= 0 AND diagnostic_score_energia <= 100),
  diagnostic_score_enfoque INTEGER NOT NULL CHECK (diagnostic_score_enfoque >= 0 AND diagnostic_score_enfoque <= 100),
  diagnostic_score_relaciones INTEGER NOT NULL CHECK (diagnostic_score_relaciones >= 0 AND diagnostic_score_relaciones <= 100),
  diagnostic_score_plan_ejecutivo INTEGER NOT NULL CHECK (diagnostic_score_plan_ejecutivo >= 0 AND diagnostic_score_plan_ejecutivo <= 100),
  diagnostic_score_overall INTEGER NOT NULL CHECK (diagnostic_score_overall >= 0 AND diagnostic_score_overall <= 100),
  -- Context captured (Issue #4: separate table for sensitive data)
  context_shift_worker BOOLEAN DEFAULT false,
  context_caregiving BOOLEAN DEFAULT false,
  context_neurodiversity BOOLEAN DEFAULT false,
  context_other_approved BOOLEAN DEFAULT false,
  -- ciclo reference
  ciclo INTEGER DEFAULT 30 CHECK (ciclo IN (30, 60, 90)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ciclo, created_at)
);

-- 1C. Context Data Vault (Issue #4: sensitive data storage with consent)
CREATE TABLE IF NOT EXISTS despega_context_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  context_other_text TEXT,
  consent_given BOOLEAN DEFAULT false,
  retention_days INTEGER DEFAULT 90,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);
CREATE TABLE IF NOT EXISTS despega_pilar_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pilar TEXT NOT NULL CHECK (pilar IN ('a1_cerebral', 'a2_rutas', 'aterrizaje', 'base')),
  estado JSONB DEFAULT '{}',
  progreso INTEGER DEFAULT 0 CHECK (progreso >= 0 AND progreso <= 100),
  score INTEGER DEFAULT 0,
  ciclo_actual INTEGER DEFAULT 30 CHECK (ciclo_actual IN (30, 60, 90)),
  ciclo_dia INTEGER DEFAULT 1 CHECK (ciclo_dia >= 1 AND ciclo_dia <= 90),
  ciclo_start_date DATE,
  is_unlocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pilar)
);

-- 3. Rutas (definicion de rutas/paquetes)
CREATE TABLE IF NOT EXISTS despega_rutas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  pilar TEXT NOT NULL CHECK (pilar IN ('a1_cerebral', 'a2_rutas', 'aterrizaje', 'base')),
  paquete TEXT CHECK (paquete IN ('energia', 'enfoque', 'relaciones', 'plan_ejecutivo', 'empleabilidad', 'cultura_general', 'noticias')),
  camino TEXT NOT NULL CHECK (camino IN ('persona', 'profesional', 'ambos')),
  nivel_30_content JSONB DEFAULT '[]',
  nivel_60_content JSONB DEFAULT '[]',
  nivel_90_content JSONB DEFAULT '[]',
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Misiones (misiones/acciones diarias)
CREATE TABLE IF NOT EXISTS despega_misiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ruta_id UUID REFERENCES despega_rutas(id) ON DELETE CASCADE,
  ciclo INTEGER NOT NULL CHECK (ciclo IN (30, 60, 90)),
  dia INTEGER NOT NULL CHECK (dia >= 1 AND dia <= 90),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT CHECK (tipo IN ('lectura', 'reflexion', 'accion', 'quiz', 'habito', 'proyecto')),
  duracion_minutos INTEGER DEFAULT 15,
  puntos INTEGER DEFAULT 10,
  contenido JSONB DEFAULT '{}',
  recursos_ids JSONB DEFAULT '[]',
  is_required BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User Misiones Progress (progreso de misiones por usuario)
CREATE TABLE IF NOT EXISTS despega_user_misiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mision_id UUID REFERENCES despega_misiones(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  puntos_earned INTEGER DEFAULT 0,
  respuesta JSONB DEFAULT '{}',
  tiempo_dedicado_minutos INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mision_id)
);

-- 6. Rankings (scores por pilar, camino y general)
CREATE TABLE IF NOT EXISTS despega_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Scores por Pilar
  score_a1_cerebral INTEGER DEFAULT 0,
  score_a2_rutas INTEGER DEFAULT 0,
  score_aterrizaje INTEGER DEFAULT 0,
  score_base INTEGER DEFAULT 0,
  -- Scores por Camino
  score_camino_persona INTEGER DEFAULT 0,
  score_camino_profesional INTEGER DEFAULT 0,
  -- Score General
  score_general INTEGER DEFAULT 0,
  -- Rankings
  rank_a1 INTEGER,
  rank_a2 INTEGER,
  rank_aterrizaje INTEGER,
  rank_base INTEGER,
  rank_persona INTEGER,
  rank_profesional INTEGER,
  rank_general INTEGER,
  -- Metadata
  total_misiones_completadas INTEGER DEFAULT 0,
  total_dias_activos INTEGER DEFAULT 0,
  streak_actual INTEGER DEFAULT 0,
  mejor_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 7. Test A1 Results (resultados del test despega cerebral)
CREATE TABLE IF NOT EXISTS despega_a1_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_version TEXT DEFAULT 'v1',
  respuestas JSONB NOT NULL,
  resultados JSONB NOT NULL,
  diagnostico TEXT,
  recomendaciones JSONB DEFAULT '[]',
  score_total INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9B. Score Events (Issue #9: time-series for "Mi Evolución", not rankings)
CREATE TABLE IF NOT EXISTS despega_score_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('diagnostic', 'mission_completed', 'milestone')),
  pilar TEXT CHECK (pilar IN ('a1_cerebral', 'a2_rutas', 'aterrizaje', 'base')),
  -- Score state at this moment
  diagnostic_score_at_event INTEGER,
  points_delta INTEGER,
  points_total INTEGER,
  progress_pct_at_event INTEGER,
  -- Context snapshot
  context_flags JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for personal evolution queries
CREATE INDEX IF NOT EXISTS idx_score_events_user_pilar ON despega_score_events(user_id, pilar, created_at DESC);
CREATE TABLE IF NOT EXISTS despega_user_ruta_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ruta_id UUID REFERENCES despega_rutas(id) ON DELETE CASCADE,
  nivel_actual INTEGER DEFAULT 30 CHECK (nivel_actual IN (30, 60, 90)),
  progreso_nivel INTEGER DEFAULT 0 CHECK (progreso_nivel >= 0 AND progreso_nivel <= 100),
  nivel_30_completed BOOLEAN DEFAULT false,
  nivel_60_completed BOOLEAN DEFAULT false,
  nivel_90_completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nivel_30_completed_at TIMESTAMP WITH TIME ZONE,
  nivel_60_completed_at TIMESTAMP WITH TIME ZONE,
  nivel_90_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ruta_id)
);

-- Enable RLS
ALTER TABLE despega_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_pilar_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_rutas ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_misiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_user_misiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a1_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_user_ruta_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own despega profile" ON despega_user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own despega profile" ON despega_user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own despega profile" ON despega_user_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own pilar progress" ON despega_pilar_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pilar progress" ON despega_pilar_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pilar progress" ON despega_pilar_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view rutas" ON despega_rutas FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can view misiones" ON despega_misiones FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view own misiones progress" ON despega_user_misiones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own misiones progress" ON despega_user_misiones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own misiones progress" ON despega_user_misiones FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own rankings" ON despega_rankings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view all rankings for leaderboard" ON despega_rankings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own rankings" ON despega_rankings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rankings" ON despega_rankings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own test results" ON despega_a1_test_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own test results" ON despega_a1_test_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own ruta progress" ON despega_user_ruta_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ruta progress" ON despega_user_ruta_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ruta progress" ON despega_user_ruta_progress FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_despega_user_profiles_user ON despega_user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_despega_pilar_progress_user ON despega_pilar_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_despega_pilar_progress_pilar ON despega_pilar_progress(pilar);
CREATE INDEX IF NOT EXISTS idx_despega_misiones_ruta ON despega_misiones(ruta_id);
CREATE INDEX IF NOT EXISTS idx_despega_misiones_ciclo_dia ON despega_misiones(ciclo, dia);
CREATE INDEX IF NOT EXISTS idx_despega_user_misiones_user ON despega_user_misiones(user_id);
CREATE INDEX IF NOT EXISTS idx_despega_rankings_score ON despega_rankings(score_general DESC);
CREATE INDEX IF NOT EXISTS idx_despega_user_ruta_progress_user ON despega_user_ruta_progress(user_id);
