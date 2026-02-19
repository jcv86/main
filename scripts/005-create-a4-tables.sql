-- A4 Tables for Gamified Tests, Library, and Progress

-- A4 User Test Completion
CREATE TABLE IF NOT EXISTS public.a4_user_test_completion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL,
  respuestas JSONB NOT NULL,
  puntos_ganados INTEGER NOT NULL DEFAULT 0,
  badge_desbloqueado TEXT,
  completado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A4 User Saved Resources
CREATE TABLE IF NOT EXISTS public.a4_user_saved_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usado_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A4 User Badges
CREATE TABLE IF NOT EXISTS public.a4_user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,
  desbloqueado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A4 News Engagement (tracking reads and interactions)
CREATE TABLE IF NOT EXISTS public.a4_news_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  news_id TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  leido_at TIMESTAMP WITH TIME ZONE,
  guardado BOOLEAN DEFAULT FALSE,
  guardado_at TIMESTAMP WITH TIME ZONE,
  respuesta_pregunta TEXT,
  puntos_ganados INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A4 Module Progress (tracking learning module completion)
CREATE TABLE IF NOT EXISTS public.a4_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  modulo_titulo TEXT NOT NULL,
  progreso_porcentaje INTEGER DEFAULT 0,
  completado BOOLEAN DEFAULT FALSE,
  respuestas_reflexion JSONB,
  tiempo_dedicado_minutos INTEGER DEFAULT 0,
  completado_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A4 User Points History (audit trail)
CREATE TABLE IF NOT EXISTS public.a4_points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  puntos_ganados INTEGER NOT NULL,
  razon TEXT NOT NULL,
  relacionado_a TEXT, -- 'test', 'news', 'module', 'badge'
  relacionado_id TEXT,
  balance_anterior INTEGER,
  balance_nuevo INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.a4_user_test_completion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.a4_user_saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.a4_user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.a4_news_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.a4_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.a4_points_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for a4_user_test_completion
CREATE POLICY "Users see own test completion" 
  ON public.a4_user_test_completion 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own test completion" 
  ON public.a4_user_test_completion 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for a4_user_saved_resources
CREATE POLICY "Users see own saved resources" 
  ON public.a4_user_saved_resources 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own saved resources" 
  ON public.a4_user_saved_resources 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own saved resources" 
  ON public.a4_user_saved_resources 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for a4_user_badges
CREATE POLICY "Users see own badges" 
  ON public.a4_user_badges 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- RLS Policies for a4_news_engagement
CREATE POLICY "Users see own news engagement" 
  ON public.a4_news_engagement 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own news engagement" 
  ON public.a4_news_engagement 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own news engagement" 
  ON public.a4_news_engagement 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for a4_module_progress
CREATE POLICY "Users see own module progress" 
  ON public.a4_module_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own module progress" 
  ON public.a4_module_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own module progress" 
  ON public.a4_module_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for a4_points_history (read-only for users)
CREATE POLICY "Users see own points history" 
  ON public.a4_points_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_a4_test_completion_user ON public.a4_user_test_completion(user_id);
CREATE INDEX idx_a4_saved_resources_user ON public.a4_user_saved_resources(user_id);
CREATE INDEX idx_a4_badges_user ON public.a4_user_badges(user_id);
CREATE INDEX idx_a4_news_engagement_user ON public.a4_news_engagement(user_id);
CREATE INDEX idx_a4_module_progress_user ON public.a4_module_progress(user_id);
CREATE INDEX idx_a4_points_history_user ON public.a4_points_history(user_id);
