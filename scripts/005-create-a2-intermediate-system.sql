-- A2 Intermediate Content & Transitions
-- Bridges A1 diagnostics to A3 application through thematic deep-dives

CREATE TABLE IF NOT EXISTS despega_a2_content_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilar TEXT NOT NULL, -- energia, enfoque, relaciones, plan_ejecutivo
  titulo TEXT NOT NULL,
  descripcion TEXT,
  nivel_requerido TEXT CHECK (nivel_requerido IN ('a1_0_25', 'a1_25_50', 'a1_50_75', 'a1_75_100')) DEFAULT 'a1_0_25',
  secuencia INTEGER,
  duracion_dias INTEGER DEFAULT 14,
  temas JSONB DEFAULT '[]', -- Array of main topics
  es_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A2 Learning Lessons within each content path
CREATE TABLE IF NOT EXISTS despega_a2_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path_id UUID REFERENCES despega_a2_content_paths(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  contenido TEXT,
  tipo TEXT CHECK (tipo IN ('leccion', 'video', 'ejercicio', 'reflexion', 'taller')) DEFAULT 'leccion',
  duracion_minutos INTEGER DEFAULT 15,
  puntos INTEGER DEFAULT 15,
  orden INTEGER,
  recursos JSONB DEFAULT '[]', -- Links, materials, downloads
  preguntas_concepto JSONB DEFAULT '[]', -- Concept checks
  es_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A2 Progression System - tracks user journey from A1 to A3
CREATE TABLE IF NOT EXISTS despega_user_a2_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id UUID REFERENCES despega_a2_content_paths(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  lessons_completed INTEGER DEFAULT 0,
  total_lessons INTEGER,
  progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  puntos_earned INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, path_id)
);

-- A2 Lesson Completion Tracking
CREATE TABLE IF NOT EXISTS despega_user_a2_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES despega_a2_lessons(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  answers_to_checks JSONB, -- JSON of concept check answers
  notes TEXT,
  puntos_earned INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- A2 Adaptive Recommendations based on A1 results
CREATE TABLE IF NOT EXISTS despega_a2_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  from_a1_result JSONB, -- A1 diagnostic results that triggered recommendation
  recommended_path_id UUID REFERENCES despega_a2_content_paths(id),
  reason_text TEXT, -- Why this path was recommended
  priority INTEGER CHECK (priority >= 1 AND priority <= 5),
  viewed_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE despega_a2_content_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a2_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_user_a2_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_user_a2_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a2_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active content paths" ON despega_a2_content_paths FOR SELECT TO authenticated USING (es_active = true);
CREATE POLICY "Anyone can view active lessons" ON despega_a2_lessons FOR SELECT TO authenticated 
  USING (es_active = true AND path_id IN (SELECT id FROM despega_a2_content_paths WHERE es_active = true));
CREATE POLICY "Users can view own A2 progress" ON despega_user_a2_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own A2 progress" ON despega_user_a2_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own A2 progress" ON despega_user_a2_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own lesson progress" ON despega_user_a2_lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lesson progress" ON despega_user_a2_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON despega_user_a2_lesson_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own recommendations" ON despega_a2_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update recommendation viewed status" ON despega_a2_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_a2_paths_pilar ON despega_a2_content_paths(pilar);
CREATE INDEX IF NOT EXISTS idx_a2_lessons_path ON despega_a2_lessons(path_id);
CREATE INDEX IF NOT EXISTS idx_a2_user_progress_user ON despega_user_a2_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_a2_user_progress_path ON despega_user_a2_progress(path_id);
CREATE INDEX IF NOT EXISTS idx_a2_lesson_progress_user ON despega_user_a2_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_a2_lesson_progress_lesson ON despega_user_a2_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_a2_recommendations_user ON despega_a2_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_a2_recommendations_priority ON despega_a2_recommendations(priority DESC);
