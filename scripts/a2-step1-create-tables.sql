-- A2 (Rutas) - PASO 1: Crear tablas necesarias
-- Tablas para el flujo completo de A2: misión 90 días, sprints, acciones diarias, bitácora

-- 1. a2_user_missions - Misión 90 días del usuario
CREATE TABLE IF NOT EXISTS a2_user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route_id UUID NOT NULL REFERENCES a2_learning_routes(id) ON DELETE CASCADE,
  camino TEXT NOT NULL CHECK (camino IN ('persona', 'profesional', 'hibrido')),
  
  -- Misión core
  objetivo_especifico TEXT NOT NULL,
  restricciones_contexto TEXT,
  metrica_exito TEXT NOT NULL,
  
  -- Estado del progreso
  estado TEXT NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa', 'completada', 'pausada', 'cancelada')),
  progreso_porcentaje INTEGER DEFAULT 0 CHECK (progreso_porcentaje >= 0 AND progreso_porcentaje <= 100),
  
  -- Temporalidad
  fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_fin_planeada DATE,
  fecha_completada TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_a2_user_missions_user_id ON a2_user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_a2_user_missions_route_id ON a2_user_missions(route_id);

-- 2. a2_user_sprints - Sprints (30 días c/u)
CREATE TABLE IF NOT EXISTS a2_user_sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES a2_user_missions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Sprint info
  numero_sprint INTEGER NOT NULL CHECK (numero_sprint IN (1, 2, 3)),
  desafio_semanal TEXT NOT NULL,
  
  -- Temporalidad
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  
  -- Estado
  estado TEXT NOT NULL DEFAULT 'no_iniciado' CHECK (estado IN ('no_iniciado', 'activo', 'completado', 'pausado')),
  progreso_porcentaje INTEGER DEFAULT 0 CHECK (progreso_porcentaje >= 0 AND progreso_porcentaje <= 100),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_a2_user_sprints_mission_id ON a2_user_sprints(mission_id);
CREATE INDEX IF NOT EXISTS idx_a2_user_sprints_user_id ON a2_user_sprints(user_id);

-- 3. a2_user_daily_actions - Acciones completadas por día
CREATE TABLE IF NOT EXISTS a2_user_daily_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID NOT NULL REFERENCES a2_user_sprints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_id UUID REFERENCES a2_micro_actions(id) ON DELETE SET NULL,
  
  -- Acción info
  fecha_accion DATE NOT NULL,
  descripcion_accion TEXT NOT NULL,
  duracion_minutos INTEGER,
  dificultad TEXT CHECK (dificultad IN ('facil', 'medio', 'desafiante')),
  
  -- Progreso
  completada BOOLEAN DEFAULT FALSE,
  completada_at TIMESTAMP WITH TIME ZONE,
  tiempo_real_minutos INTEGER,
  notas TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_a2_user_daily_actions_sprint_id ON a2_user_daily_actions(sprint_id);
CREATE INDEX IF NOT EXISTS idx_a2_user_daily_actions_user_id ON a2_user_daily_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_a2_user_daily_actions_fecha ON a2_user_daily_actions(fecha_accion);

-- 4. a2_user_experiments - Experimentos tipo Adam Grant
CREATE TABLE IF NOT EXISTS a2_user_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID NOT NULL REFERENCES a2_user_sprints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Experimento
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  hipotesis TEXT,
  
  -- Resultado
  resultado TEXT,
  aprendizaje TEXT,
  estado TEXT DEFAULT 'planeado' CHECK (estado IN ('planeado', 'en_progreso', 'completado')),
  
  -- Temporalidad
  fecha_inicio DATE,
  fecha_fin DATE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_a2_user_experiments_sprint_id ON a2_user_experiments(sprint_id);
CREATE INDEX IF NOT EXISTS idx_a2_user_experiments_user_id ON a2_user_experiments(user_id);

-- 5. a2_user_bitacora - Entrada de bitácora (reflexión diaria/semanal)
CREATE TABLE IF NOT EXISTS a2_user_bitacora (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES a2_user_missions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES a2_user_sprints(id) ON DELETE SET NULL,
  
  -- Entrada
  tipo_entrada TEXT NOT NULL CHECK (tipo_entrada IN ('diaria', 'semanal', 'reflexion')),
  fecha_entrada DATE NOT NULL,
  semana INTEGER,
  
  -- Contenido
  que_probe TEXT,
  que_aprendi TEXT,
  que_ajustare TEXT,
  evidencia JSONB,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_a2_user_bitacora_mission_id ON a2_user_bitacora(mission_id);
CREATE INDEX IF NOT EXISTS idx_a2_user_bitacora_user_id ON a2_user_bitacora(user_id);
CREATE INDEX IF NOT EXISTS idx_a2_user_bitacora_fecha ON a2_user_bitacora(fecha_entrada);

-- 6. a2_user_weekly_checkins - Check-in semanal
CREATE TABLE IF NOT EXISTS a2_user_weekly_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID NOT NULL REFERENCES a2_user_sprints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Check-in
  semana INTEGER NOT NULL,
  fecha_checkin DATE NOT NULL,
  
  -- Reflexión
  que_salio_bien TEXT,
  que_no_salio_bien TEXT,
  tasa_exito_porcentaje INTEGER CHECK (tasa_exito_porcentaje >= 0 AND tasa_exito_porcentaje <= 100),
  
  -- Ajustes propuestos
  ajustes_sugeridos TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_a2_user_weekly_checkins_sprint_id ON a2_user_weekly_checkins(sprint_id);
CREATE INDEX IF NOT EXISTS idx_a2_user_weekly_checkins_user_id ON a2_user_weekly_checkins(user_id);

-- 7. a2_user_recursos_linkados - Recursos curados linkados a cada ruta
CREATE TABLE IF NOT EXISTS a2_user_recursos_linkados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES a2_user_missions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Recurso
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('libro', 'articulo', 'video', 'podcast', 'curso', 'herramienta')),
  url TEXT,
  
  -- Relación
  relevancia TEXT CHECK (relevancia IN ('critica', 'muy-recomendada', 'sugerida')),
  usado BOOLEAN DEFAULT FALSE,
  usado_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_a2_user_recursos_linkados_mission_id ON a2_user_recursos_linkados(mission_id);
CREATE INDEX IF NOT EXISTS idx_a2_user_recursos_linkados_user_id ON a2_user_recursos_linkados(user_id);

-- Habilitar RLS para datos del usuario
ALTER TABLE a2_user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_user_sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_user_daily_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_user_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_user_bitacora ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_user_weekly_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE a2_user_recursos_linkados ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users view own missions" ON a2_user_missions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own missions" ON a2_user_missions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own missions" ON a2_user_missions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users view own sprints" ON a2_user_sprints
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own sprints" ON a2_user_sprints
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own sprints" ON a2_user_sprints
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users view own daily actions" ON a2_user_daily_actions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own daily actions" ON a2_user_daily_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own daily actions" ON a2_user_daily_actions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users view own experiments" ON a2_user_experiments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own experiments" ON a2_user_experiments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own experiments" ON a2_user_experiments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users view own bitacora" ON a2_user_bitacora
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own bitacora" ON a2_user_bitacora
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own bitacora" ON a2_user_bitacora
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users view own checkins" ON a2_user_weekly_checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own checkins" ON a2_user_weekly_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own checkins" ON a2_user_weekly_checkins
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users view own recursos" ON a2_user_recursos_linkados
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own recursos" ON a2_user_recursos_linkados
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own recursos" ON a2_user_recursos_linkados
  FOR UPDATE USING (auth.uid() = user_id);
