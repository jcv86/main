-- CIP Tasks Table - Conecta tareas reales con capacidad
CREATE TABLE cip_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Información de la tarea
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general', -- deep_work, learning, rest, collaboration
  priority SMALLINT DEFAULT 1, -- 1=low, 2=medium, 3=high
  estimated_duration NUMERIC(5,2), -- en minutos
  
  -- Estado
  status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, failed, skipped
  completed_at TIMESTAMP,
  actual_duration NUMERIC(5,2),
  
  -- CIP Connection
  recommended BOOLEAN DEFAULT FALSE,
  predicted_success_rate NUMERIC(5,2), -- P_success del día
  capacity_used NUMERIC(5,2), -- Porcentaje de capacidad que usó
  
  -- Notas
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_cip_tasks_user_date ON cip_tasks(user_id, date);
CREATE INDEX idx_cip_tasks_status ON cip_tasks(user_id, status);

-- View: Resumen diario de tareas por usuario
CREATE VIEW cip_daily_task_summary AS
SELECT 
  ct.user_id,
  ct.date,
  COUNT(*) as total_tasks,
  COUNT(*) FILTER (WHERE ct.status = 'completed') as completed_tasks,
  COUNT(*) FILTER (WHERE ct.status = 'failed') as failed_tasks,
  COUNT(*) FILTER (WHERE ct.status = 'pending' OR ct.status = 'in_progress') as active_tasks,
  ROUND(SUM(ct.actual_duration)::NUMERIC / 60, 2) as total_hours_spent,
  ROUND(AVG(ct.capacity_used), 2) as avg_capacity_used,
  ROUND(SUM(ct.capacity_used), 2) as total_capacity_used
FROM cip_tasks ct
GROUP BY ct.user_id, ct.date;

-- RLS Policy
ALTER TABLE cip_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks"
  ON cip_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON cip_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON cip_tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON cip_tasks FOR DELETE
  USING (auth.uid() = user_id);
