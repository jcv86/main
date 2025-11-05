-- Sistema de workflow para revisión humana de prompts críticos
-- Permite trackear el estado de revisión y asignar tareas a admins

-- Tabla de tareas de revisión de prompts
CREATE TABLE IF NOT EXISTS prompt_review_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_type TEXT NOT NULL CHECK (coach_type IN ('sofia', 'dani')),
  conversation_category TEXT NOT NULL,
  prompt_version_id UUID REFERENCES prompt_versions(id),
  
  -- Métricas que dispararon la revisión
  avg_satisfaction DECIMAL(3,2),
  avg_engagement DECIMAL(5,2),
  action_completion_rate DECIMAL(5,2),
  total_sessions INTEGER,
  
  -- Clasificación del problema
  issue_type TEXT NOT NULL CHECK (issue_type IN ('low_satisfaction', 'low_engagement', 'low_action', 'multiple_issues')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  
  -- Workflow
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'variant_created', 'testing', 'resolved', 'dismissed')),
  assigned_to TEXT, -- Email del admin asignado
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  resolution_notes TEXT,
  
  -- Tracking de variantes creadas
  new_variant_id UUID REFERENCES prompt_versions(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_prompt_review_tasks_status ON prompt_review_tasks(status);
CREATE INDEX IF NOT EXISTS idx_prompt_review_tasks_severity ON prompt_review_tasks(severity);
CREATE INDEX IF NOT EXISTS idx_prompt_review_tasks_assigned ON prompt_review_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_prompt_review_tasks_created ON prompt_review_tasks(created_at DESC);

-- Tabla de notificaciones para admins
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('critical_prompt', 'review_assigned', 'test_complete', 'variant_published')),
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Referencia a la tarea relacionada
  related_task_id UUID REFERENCES prompt_review_tasks(id),
  
  -- Estado de la notificación
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_email ON admin_notifications(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created ON admin_notifications(created_at DESC);

-- Función para calcular severidad basada en métricas
CREATE OR REPLACE FUNCTION calculate_severity(
  satisfaction DECIMAL,
  engagement DECIMAL,
  action_rate DECIMAL
) RETURNS TEXT AS $$
BEGIN
  -- Critical: múltiples métricas muy por debajo del umbral
  IF (satisfaction < 3.5 OR engagement < 1.5 OR action_rate < 40) THEN
    RETURN 'critical';
  END IF;
  
  -- High: al menos una métrica significativamente baja
  IF (satisfaction < 4.0 OR engagement < 2.0 OR action_rate < 50) THEN
    RETURN 'high';
  END IF;
  
  -- Medium: cerca de los umbrales
  IF (satisfaction < 4.3 OR engagement < 2.5 OR action_rate < 60) THEN
    RETURN 'medium';
  END IF;
  
  RETURN 'low';
END;
$$ LANGUAGE plpgsql;

-- Función para crear tareas automáticamente desde prompts críticos
CREATE OR REPLACE FUNCTION create_review_tasks_from_critical_prompts()
RETURNS TABLE(tasks_created INTEGER) AS $$
DECLARE
  task_count INTEGER := 0;
BEGIN
  -- Fixed column names: version_name instead of version_number, action_completed instead of suggested_action_completed, removed is_control reference
  -- Insertar tareas para prompts críticos que no tienen tarea pendiente
  INSERT INTO prompt_review_tasks (
    coach_type,
    conversation_category,
    prompt_version_id,
    avg_satisfaction,
    avg_engagement,
    action_completion_rate,
    total_sessions,
    issue_type,
    severity
  )
  SELECT DISTINCT
    pv.coach_type,
    pv.conversation_category,
    pv.id,
    AVG(cm.satisfaction_rating) as avg_satisfaction,
    AVG(cm.message_count) as avg_engagement,
    AVG(CASE WHEN cm.action_completed THEN 100.0 ELSE 0.0 END) as action_rate,
    COUNT(*) as total_sessions,
    CASE
      WHEN AVG(cm.satisfaction_rating) < 4.3 
           AND AVG(CASE WHEN cm.action_completed THEN 100.0 ELSE 0.0 END) < 60 
           AND AVG(cm.message_count) < 2.5 THEN 'multiple_issues'
      WHEN AVG(cm.satisfaction_rating) < 4.3 THEN 'low_satisfaction'
      WHEN AVG(cm.message_count) < 2.5 THEN 'low_engagement'
      WHEN AVG(CASE WHEN cm.action_completed THEN 100.0 ELSE 0.0 END) < 60 THEN 'low_action'
      ELSE 'low_satisfaction'
    END as issue_type,
    calculate_severity(
      AVG(cm.satisfaction_rating),
      AVG(cm.message_count),
      AVG(CASE WHEN cm.action_completed THEN 100.0 ELSE 0.0 END)
    ) as severity
  FROM prompt_versions pv
  JOIN coaching_metrics cm ON 
    cm.coach_type = pv.coach_type 
    AND cm.conversation_category = pv.conversation_category
  WHERE pv.is_published = true
    AND (
      AVG(cm.satisfaction_rating) < 4.3
      OR AVG(cm.message_count) < 2.5
      OR AVG(CASE WHEN cm.action_completed THEN 100.0 ELSE 0.0 END) < 60
    )
    AND NOT EXISTS (
      SELECT 1 FROM prompt_review_tasks prt
      WHERE prt.prompt_version_id = pv.id
        AND prt.status IN ('pending', 'in_review', 'testing')
    )
  GROUP BY pv.id, pv.coach_type, pv.conversation_category
  HAVING COUNT(*) >= 5; -- Mínimo 5 sesiones para considerar
  
  GET DIAGNOSTICS task_count = ROW_COUNT;
  
  RETURN QUERY SELECT task_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_prompt_review_task_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Added DROP TRIGGER IF EXISTS to make script idempotent
DROP TRIGGER IF EXISTS update_prompt_review_task_timestamp ON prompt_review_tasks;

CREATE TRIGGER update_prompt_review_task_timestamp
  BEFORE UPDATE ON prompt_review_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_prompt_review_task_timestamp();

-- Fixed column name: version_name instead of version_number
-- Vista para dashboard de tareas pendientes
CREATE OR REPLACE VIEW pending_review_tasks AS
SELECT 
  prt.*,
  pv.version_name,
  pv.system_prompt,
  COUNT(an.id) as unread_notifications
FROM prompt_review_tasks prt
LEFT JOIN prompt_versions pv ON prt.prompt_version_id = pv.id
LEFT JOIN admin_notifications an ON an.related_task_id = prt.id AND an.read = false
WHERE prt.status IN ('pending', 'in_review')
GROUP BY prt.id, pv.version_name, pv.system_prompt
ORDER BY 
  CASE prt.severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    ELSE 4
  END,
  prt.created_at DESC;

COMMENT ON TABLE prompt_review_tasks IS 'Tareas de revisión de prompts críticos para workflow humano';
COMMENT ON TABLE admin_notifications IS 'Notificaciones para administradores sobre prompts críticos';
COMMENT ON FUNCTION create_review_tasks_from_critical_prompts IS 'Crea tareas automáticamente para prompts que necesitan revisión';
