-- Create A3 Rutas content structure for simulations and training scenarios
-- This extends the despega_rutas table with A3-specific simulation content

-- A3 RUTAS: ENERGÍA, ENFOQUE, RELACIONES, PLAN EJECUTIVO (Advanced Training)
INSERT INTO despega_rutas (nombre, descripcion, pilar, paquete, camino, icon, color, order_index, is_active) 
VALUES
('A3 Energía - Optimización Avanzada', 'Programas de optimización energética, nutrición, ejercicio y resilencia', 'a2_rutas', 'energia', 'persona', '⚡', '#3b82f6', 1, true),
('A3 Enfoque - Productividad Extrema', 'Técnicas avanzadas de concentración, flujo profundo, y sistemas de ejecución', 'a2_rutas', 'enfoque', 'ambos', '🎯', '#10b981', 2, true),
('A3 Relaciones - Networking Estratégico', 'Construcción de redes profesionales, liderazgo, influencia y comunicación ejecutiva', 'a2_rutas', 'relaciones', 'profesional', '🤝', '#f97316', 3, true),
('A3 Plan Ejecutivo - Liderazgo Operacional', 'Planificación estratégica, toma de decisiones complejas, gestión de crises', 'a2_rutas', 'plan_ejecutivo', 'profesional', '📋', '#a855f7', 4, true)
ON CONFLICT DO NOTHING;

-- A3 SIMULATION SCENARIOS
-- These represent realistic professional situations that require decision-making

CREATE TABLE IF NOT EXISTS despega_a3_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ruta_id UUID REFERENCES despega_rutas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  contexto JSONB NOT NULL, -- Detailed scenario setup
  tipo TEXT CHECK (tipo IN ('decision', 'comunicacion', 'negociacion', 'liderazgo', 'crisis', 'planificacion')),
  duracion_minutos INTEGER DEFAULT 20,
  puntos INTEGER DEFAULT 25,
  nivel TEXT CHECK (nivel IN ('intermedio', 'avanzado')) DEFAULT 'intermedio',
  -- Scenario branches based on user choices
  decisiones JSONB DEFAULT '[]', -- Array of possible decisions with outcomes
  metricas_exito JSONB DEFAULT '{}', -- How success is measured
  coaching_points JSONB DEFAULT '[]', -- Key coaching insights
  es_multiple_choice BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A3 USER SCENARIO PROGRESS
CREATE TABLE IF NOT EXISTS despega_user_a3_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES despega_a3_scenarios(id) ON DELETE CASCADE,
  ruta_id UUID REFERENCES despega_rutas(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  decision_path JSONB, -- Record of decisions made
  performance_score INTEGER CHECK (performance_score >= 0 AND performance_score <= 100),
  puntos_earned INTEGER DEFAULT 0,
  feedback JSONB, -- Personalized feedback from coach
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, scenario_id)
);

-- A3 SIMULATION CONTENT LIBRARY
CREATE TABLE IF NOT EXISTS despega_a3_simulation_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES despega_a3_scenarios(id) ON DELETE CASCADE,
  content_type TEXT CHECK (content_type IN ('tutorial', 'framework', 'example', 'counterexample', 'deepdive')),
  titulo TEXT NOT NULL,
  contenido TEXT,
  recursos_url JSONB DEFAULT '[]',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE despega_a3_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_user_a3_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a3_simulation_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active scenarios" ON despega_a3_scenarios FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Users can view own scenario progress" ON despega_user_a3_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scenario progress" ON despega_user_a3_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scenario progress" ON despega_user_a3_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view simulation content" ON despega_a3_simulation_content FOR SELECT TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_a3_scenarios_ruta ON despega_a3_scenarios(ruta_id);
CREATE INDEX IF NOT EXISTS idx_a3_scenarios_tipo ON despega_a3_scenarios(tipo);
CREATE INDEX IF NOT EXISTS idx_a3_user_progress_user ON despega_user_a3_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_user_progress_scenario ON despega_user_a3_progress(scenario_id);
