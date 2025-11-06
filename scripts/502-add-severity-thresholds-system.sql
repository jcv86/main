CREATE TABLE IF NOT EXISTS severity_thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL UNIQUE,
  metric_category TEXT NOT NULL, -- 'performance', 'engagement', 'quality', 'system'
  warning_threshold NUMERIC,
  critical_threshold NUMERIC,
  comparison_operator TEXT NOT NULL DEFAULT 'greater_than', -- 'greater_than', 'less_than'
  unit TEXT, -- '%', 'ms', 'count', etc.
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default thresholds for key metrics
INSERT INTO severity_thresholds (metric_name, metric_category, warning_threshold, critical_threshold, comparison_operator, unit, description) VALUES
  ('error_rate', 'system', 5, 10, 'greater_than', '%', 'Porcentaje de errores en el sistema'),
  ('response_time', 'performance', 2000, 5000, 'greater_than', 'ms', 'Tiempo de respuesta promedio'),
  ('user_satisfaction', 'quality', 3.5, 3.0, 'less_than', '/5', 'Satisfacción promedio de usuarios'),
  ('daily_active_users', 'engagement', 50, 20, 'less_than', 'count', 'Usuarios activos diarios'),
  ('session_duration', 'engagement', 5, 2, 'less_than', 'min', 'Duración promedio de sesión'),
  ('completion_rate', 'engagement', 60, 40, 'less_than', '%', 'Tasa de completitud de tests'),
  ('ai_coach_response_time', 'performance', 3000, 8000, 'greater_than', 'ms', 'Tiempo de respuesta del AI coach'),
  ('cron_job_failures', 'system', 2, 5, 'greater_than', 'count', 'Fallos de cron jobs en 24h'),
  ('database_query_time', 'performance', 1000, 3000, 'greater_than', 'ms', 'Tiempo de consultas a BD'),
  ('memory_usage', 'system', 80, 95, 'greater_than', '%', 'Uso de memoria del sistema'),
  ('api_error_rate', 'system', 3, 8, 'greater_than', '%', 'Tasa de errores en APIs'),
  ('user_retention_rate', 'engagement', 40, 25, 'less_than', '%', 'Tasa de retención de usuarios'),
  ('prompt_success_rate', 'quality', 85, 70, 'less_than', '%', 'Tasa de éxito de prompts'),
  ('rag_coverage', 'quality', 70, 50, 'less_than', '%', 'Cobertura del sistema RAG'),
  ('test_accuracy', 'quality', 90, 80, 'less_than', '%', 'Precisión de tests psicométricos');

-- Create view for threshold violations
CREATE OR REPLACE VIEW threshold_violations AS
SELECT 
  st.id,
  st.metric_name,
  st.metric_category,
  st.warning_threshold,
  st.critical_threshold,
  st.comparison_operator,
  st.unit,
  st.description,
  CASE 
    WHEN st.comparison_operator = 'greater_than' THEN 'Valor debe ser menor que'
    ELSE 'Valor debe ser mayor que'
  END as threshold_direction
FROM severity_thresholds st
WHERE st.is_active = true
ORDER BY st.metric_category, st.metric_name;

-- Create table for threshold alerts history
CREATE TABLE IF NOT EXISTS threshold_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  threshold_id UUID REFERENCES severity_thresholds(id),
  metric_name TEXT NOT NULL,
  current_value NUMERIC NOT NULL,
  threshold_value NUMERIC NOT NULL,
  severity TEXT NOT NULL, -- 'warning', 'critical'
  message TEXT,
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_threshold_alerts_metric ON threshold_alerts(metric_name);
CREATE INDEX idx_threshold_alerts_severity ON threshold_alerts(severity);
CREATE INDEX idx_threshold_alerts_acknowledged ON threshold_alerts(acknowledged);
CREATE INDEX idx_threshold_alerts_created ON threshold_alerts(created_at DESC);

COMMENT ON TABLE severity_thresholds IS 'Umbrales configurables para métricas del sistema';
COMMENT ON TABLE threshold_alerts IS 'Historial de alertas generadas por violaciones de umbrales';
