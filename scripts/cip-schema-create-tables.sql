-- ============================================
-- CIP (Capacity & Task Management System)
-- Schema SQL para Supabase
-- ============================================

-- 1. TABLA: user_capacity_profile
-- Almacena el perfil de capacidad de cada usuario
CREATE TABLE IF NOT EXISTS user_capacity_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- A1 Base inicial
  a1_base_capacity DECIMAL(5, 2) NOT NULL DEFAULT 100.0,
  
  -- Fase de progresión (A1_Base, A1_30dias, A1_60dias, A1_90dias)
  progression_phase TEXT NOT NULL DEFAULT 'A1_Base',
  phase_start_date TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Modo activo (Hard Rule: solo uno activo a la vez)
  active_mode TEXT NOT NULL DEFAULT 'focus',
  -- Valores posibles: 'focus', 'recovery', 'exploration', 'balance'
  
  -- Estadísticas acumuladas
  total_days_tracked INT DEFAULT 0,
  last_capacity_check TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. TABLA: daily_capacity
-- Registra capacidad diaria y probabilidad de éxito
CREATE TABLE IF NOT EXISTS daily_capacity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_capacity_profile(user_id) ON DELETE CASCADE,
  
  -- Fecha del registro
  date DATE NOT NULL,
  
  -- T_capacidad_actual: Capacidad real calculada para hoy
  effective_capacity DECIMAL(5, 2) NOT NULL,
  
  -- P_success: Probabilidad de completar tareas (0-100%)
  success_probability DECIMAL(5, 2) NOT NULL,
  
  -- Estado general del día
  energy_level INT DEFAULT 50, -- 0-100
  mood_rating INT DEFAULT 5, -- 1-10
  completion_rate DECIMAL(5, 2) DEFAULT 0.0, -- % de tareas completadas
  
  -- Capacidad teórica vs real
  theoretical_capacity DECIMAL(5, 2),
  capacity_variance DECIMAL(5, 2), -- diferencia teórica - actual
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- 3. TABLA: task_sessions
-- Registra tareas completadas en sesiones
CREATE TABLE IF NOT EXISTS task_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_capacity_profile(user_id) ON DELETE CASCADE,
  
  -- Información de la tarea
  task_title TEXT NOT NULL,
  task_description TEXT,
  task_category TEXT, -- 'work', 'learning', 'health', 'personal'
  
  -- Modo aplicado cuando se completó
  mode_applied TEXT NOT NULL,
  
  -- Duración y estado
  duration_minutes INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed', -- 'completed', 'partial', 'abandoned'
  
  -- Complejidad estimada vs realidad
  estimated_difficulty INT, -- 1-10
  actual_difficulty INT, -- 1-10
  
  -- Metadata
  session_date DATE NOT NULL,
  session_start_time TIMESTAMP NOT NULL,
  session_end_time TIMESTAMP,
  
  -- Feedback
  quality_rating INT, -- 1-10 (satisfacción con ejecución)
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. TABLA: capacity_alerts
-- Log de alertas por umbrales (68% y 15%)
CREATE TABLE IF NOT EXISTS capacity_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_capacity_profile(user_id) ON DELETE CASCADE,
  
  -- Tipo de alerta
  alert_type TEXT NOT NULL, -- 'strong_commitment' (68%), 'high_difficulty' (15%)
  severity TEXT NOT NULL, -- 'info', 'warning', 'critical'
  
  -- Umbrales que dispararon alerta
  threshold_percentage DECIMAL(5, 2) NOT NULL,
  actual_capacity DECIMAL(5, 2) NOT NULL,
  
  -- Mensaje y acción sugerida
  message TEXT NOT NULL,
  suggested_action TEXT,
  
  -- Estado de alerta
  dismissed BOOLEAN DEFAULT FALSE,
  dismissed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. TABLA: capacity_history
-- Historial de cambios en capacidad (auditoría)
CREATE TABLE IF NOT EXISTS capacity_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_capacity_profile(user_id) ON DELETE CASCADE,
  
  -- Campo que cambió
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  
  -- Razón del cambio
  change_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Índices para optimización
-- ============================================

CREATE INDEX IF NOT EXISTS idx_daily_capacity_user_date ON daily_capacity(user_id, date);
CREATE INDEX IF NOT EXISTS idx_task_sessions_user_date ON task_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_capacity_alerts_user ON capacity_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_capacity_history_user ON capacity_history(user_id);

-- ============================================
-- Habilitar RLS (Row Level Security)
-- ============================================

ALTER TABLE user_capacity_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacity_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacity_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Usuarios solo ven sus propios datos
CREATE POLICY "Users can view own capacity profile" ON user_capacity_profile
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own capacity profile" ON user_capacity_profile
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own daily capacity" ON daily_capacity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own task sessions" ON task_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own alerts" ON capacity_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own history" ON capacity_history
  FOR SELECT USING (auth.uid() = user_id);
