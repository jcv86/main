-- Tarea 1: Crear tablas para conexiones post-onboarding
-- Este script crea las tablas necesarias para conectar A1→A2→A3→A4

-- 1. training_assignments: Asigna entrenamientos de A3 basado en A2
CREATE TABLE IF NOT EXISTS public.a3_training_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route_id uuid REFERENCES a2_learning_routes(id),
  training_module_id uuid REFERENCES a3_modulos_educativos(id),
  assigned_at timestamp with time zone DEFAULT now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  reason text, -- "Recomendado por ruta", "Competencia faltante", etc
  relevance_score integer DEFAULT 50,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_a3_training_assignments_user_id ON public.a3_training_assignments(user_id);
CREATE INDEX idx_a3_training_assignments_route_id ON public.a3_training_assignments(route_id);

-- RLS Policies
ALTER TABLE public.a3_training_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own training assignments" ON public.a3_training_assignments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own training assignments" ON public.a3_training_assignments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can manage training assignments" ON public.a3_training_assignments
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 2. personalized_a4_feeds: Personaliza contenido A4 según A3 actual
CREATE TABLE IF NOT EXISTS public.a4_personalized_feeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  training_module_id uuid REFERENCES a3_modulos_educativos(id),
  news_category text, -- "liderazgo", "emprendimiento", "transformación_digital"
  keywords jsonb, -- Array de palabras clave relevantes
  relevance_boost integer DEFAULT 100, -- 0-200, multiplier para scoring
  active boolean DEFAULT true,
  starts_at timestamp with time zone DEFAULT now(),
  ends_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_a4_personalized_feeds_user_id ON public.a4_personalized_feeds(user_id);
CREATE INDEX idx_a4_personalized_feeds_training_module_id ON public.a4_personalized_feeds(training_module_id);
CREATE INDEX idx_a4_personalized_feeds_active ON public.a4_personalized_feeds(active);

-- RLS Policies
ALTER TABLE public.a4_personalized_feeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own personalized feeds" ON public.a4_personalized_feeds
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage personalized feeds" ON public.a4_personalized_feeds
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 3. coach_context_snapshots: Contexto omnipresente del coach
CREATE TABLE IF NOT EXISTS public.coach_context_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- A1 Context
  a1_perfil_disc text, -- "ROJO", "AZUL", "VERDE", "AMARILLO"
  a1_score_total integer,
  a1_principales_caracteristicas jsonb,
  a1_fortalezas jsonb,
  a1_areas_mejora jsonb,
  a1_recomendaciones jsonb,
  
  -- A2 Context
  a2_route_id uuid REFERENCES a2_learning_routes(id),
  a2_route_nombre text,
  a2_mission_id uuid REFERENCES a2_user_missions(id),
  a2_sprint_numero integer,
  a2_sprint_desafio text,
  a2_progreso_porcentaje integer,
  a2_ultima_bitacora_entrada jsonb,
  
  -- A3 Context
  a3_entrenamiento_actual uuid REFERENCES a3_modulos_educativos(id),
  a3_entrenamiento_titulo text,
  a3_competencias_focos jsonb, -- Array de competencias en desarrollo
  a3_progreso_entrenamientos integer,
  
  -- A4 Context
  a4_noticias_personalizadas jsonb, -- Array de categorías activas
  a4_puntos_acumulados integer,
  a4_badges_desbloqueados jsonb,
  a4_ultimo_engagement jsonb,
  
  -- Meta
  snapshot_version integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone
);

CREATE INDEX idx_coach_context_snapshots_user_id ON public.coach_context_snapshots(user_id);
CREATE INDEX idx_coach_context_snapshots_updated_at ON public.coach_context_snapshots(updated_at DESC);

-- RLS Policies
ALTER TABLE public.coach_context_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coach context" ON public.coach_context_snapshots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage coach context" ON public.coach_context_snapshots
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.a3_training_assignments TO authenticated;
GRANT SELECT ON public.a3_training_assignments TO anon;

GRANT SELECT, INSERT, UPDATE ON public.a4_personalized_feeds TO authenticated;
GRANT SELECT ON public.a4_personalized_feeds TO anon;

GRANT SELECT, INSERT, UPDATE ON public.coach_context_snapshots TO authenticated;
GRANT SELECT ON public.coach_context_snapshots TO anon;
