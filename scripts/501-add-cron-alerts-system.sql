-- Sistema de Alertas para Cron Jobs
-- Este script agrega funcionalidad de alertas sin modificar tablas existentes

-- Tabla para configuración de alertas de cron jobs
CREATE TABLE IF NOT EXISTS cron_job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('failure', 'success', 'slow_execution', 'missed_schedule')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  alert_message TEXT NOT NULL,
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by TEXT,
  resolution_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_cron_alerts_job_name ON cron_job_alerts(job_name);
CREATE INDEX IF NOT EXISTS idx_cron_alerts_triggered_at ON cron_job_alerts(triggered_at DESC);
CREATE INDEX IF NOT EXISTS idx_cron_alerts_acknowledged ON cron_job_alerts(acknowledged) WHERE NOT acknowledged;
CREATE INDEX IF NOT EXISTS idx_cron_alerts_severity ON cron_job_alerts(severity);

-- Vista para alertas activas (no reconocidas)
CREATE OR REPLACE VIEW cron_active_alerts AS
SELECT 
  ca.*,
  cjc.schedule,
  cjc.last_success_at,
  cjc.last_failure_at,
  cjc.consecutive_failures,
  EXTRACT(EPOCH FROM (NOW() - ca.triggered_at))/3600 AS hours_since_triggered
FROM cron_job_alerts ca
LEFT JOIN cron_job_config cjc ON ca.job_name = cjc.job_name
WHERE NOT ca.acknowledged
ORDER BY 
  CASE ca.severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  ca.triggered_at DESC;

-- Vista para resumen de salud de cron jobs
CREATE OR REPLACE VIEW cron_health_summary AS
SELECT 
  cjc.job_name,
  cjc.is_active,
  cjc.schedule,
  cjc.last_execution_at,
  cjc.last_success_at,
  cjc.last_failure_at,
  cjc.consecutive_failures,
  COUNT(DISTINCT ca.id) FILTER (WHERE NOT ca.acknowledged) AS active_alerts,
  COUNT(DISTINCT ca.id) FILTER (WHERE ca.severity = 'critical' AND NOT ca.acknowledged) AS critical_alerts,
  CASE 
    WHEN cjc.consecutive_failures >= 3 THEN 'critical'
    WHEN cjc.consecutive_failures >= 2 THEN 'warning'
    WHEN cjc.last_failure_at > cjc.last_success_at THEN 'degraded'
    WHEN cjc.last_success_at IS NULL THEN 'unknown'
    ELSE 'healthy'
  END AS health_status
FROM cron_job_config cjc
LEFT JOIN cron_job_alerts ca ON cjc.job_name = ca.job_name
GROUP BY cjc.job_name, cjc.is_active, cjc.schedule, cjc.last_execution_at, 
         cjc.last_success_at, cjc.last_failure_at, cjc.consecutive_failures;

COMMENT ON TABLE cron_job_alerts IS 'Sistema de alertas para monitoreo de cron jobs';
COMMENT ON VIEW cron_active_alerts IS 'Vista de alertas activas (no reconocidas) con información de contexto';
COMMENT ON VIEW cron_health_summary IS 'Resumen del estado de salud de todos los cron jobs';
