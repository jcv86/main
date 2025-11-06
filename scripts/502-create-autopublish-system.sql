-- Sistema de Autopublicación de Prompts Ganadores
-- Este script crea las tablas y funciones necesarias para automatizar
-- la publicación de prompts que superan umbrales de performance

-- Tabla de configuración de autopublicación
CREATE TABLE IF NOT EXISTS autopublish_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_name TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN DEFAULT false,
  
  -- Umbrales para autopublicación
  min_sessions_required INTEGER DEFAULT 100, -- Mínimo de sesiones para considerar
  min_satisfaction_score NUMERIC DEFAULT 4.0, -- Satisfacción mínima (1-5)
  min_engagement_score NUMERIC DEFAULT 0.7, -- Engagement mínimo (0-1)
  min_action_completion_rate NUMERIC DEFAULT 0.6, -- Tasa de completitud de acciones
  
  -- Configuración de comparación
  improvement_threshold_percentage NUMERIC DEFAULT 10.0, -- % de mejora requerido vs actual
  confidence_level NUMERIC DEFAULT 0.95, -- Nivel de confianza estadística
  
  -- Configuración de seguridad
  require_manual_review BOOLEAN DEFAULT true, -- Requiere revisión manual antes de publicar
  auto_rollback_on_degradation BOOLEAN DEFAULT true, -- Rollback automático si empeora
  rollback_threshold_percentage NUMERIC DEFAULT 5.0, -- % de degradación para rollback
  
  -- Notificaciones
  notify_on_autopublish BOOLEAN DEFAULT true,
  notify_emails TEXT[] DEFAULT ARRAY['admin@dtc.com'],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de historial de autopublicaciones
CREATE TABLE IF NOT EXISTS autopublish_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Información del prompt
  old_prompt_version_id UUID REFERENCES prompt_versions(id),
  new_prompt_version_id UUID REFERENCES prompt_versions(id),
  coach_type TEXT NOT NULL,
  conversation_category TEXT,
  
  -- Métricas de decisión
  decision_reason TEXT NOT NULL,
  old_metrics JSONB, -- Métricas del prompt anterior
  new_metrics JSONB, -- Métricas del nuevo prompt
  improvement_percentage NUMERIC,
  confidence_score NUMERIC,
  
  -- Estado de la publicación
  status TEXT DEFAULT 'pending', -- pending, published, rolled_back, failed
  published_at TIMESTAMPTZ,
  rolled_back_at TIMESTAMPTZ,
  rollback_reason TEXT,
  
  -- Auditoría
  triggered_by TEXT DEFAULT 'system', -- system, manual, scheduled
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'published', 'rolled_back', 'failed'))
);

-- Tabla de monitoreo post-publicación
CREATE TABLE IF NOT EXISTS autopublish_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autopublish_id UUID REFERENCES autopublish_history(id),
  
  -- Métricas monitoreadas
  monitoring_period TEXT NOT NULL, -- '1h', '6h', '24h', '7d'
  sessions_count INTEGER DEFAULT 0,
  avg_satisfaction NUMERIC,
  avg_engagement NUMERIC,
  action_completion_rate NUMERIC,
  
  -- Comparación con baseline
  satisfaction_change_percentage NUMERIC,
  engagement_change_percentage NUMERIC,
  completion_rate_change_percentage NUMERIC,
  
  -- Estado
  health_status TEXT DEFAULT 'healthy', -- healthy, warning, critical
  alerts_triggered TEXT[],
  
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_health_status CHECK (health_status IN ('healthy', 'warning', 'critical'))
);

-- Insertar configuración por defecto
INSERT INTO autopublish_config (
  config_name,
  is_enabled,
  min_sessions_required,
  min_satisfaction_score,
  min_engagement_score,
  min_action_completion_rate,
  improvement_threshold_percentage,
  require_manual_review,
  auto_rollback_on_degradation,
  notify_on_autopublish
) VALUES (
  'default',
  false, -- Deshabilitado por defecto por seguridad
  100,
  4.0,
  0.7,
  0.6,
  10.0,
  true,
  true,
  true
) ON CONFLICT (config_name) DO NOTHING;

-- Vista para candidatos a autopublicación
CREATE OR REPLACE VIEW autopublish_candidates AS
SELECT 
  pv.id as prompt_version_id,
  pv.version_name,
  pv.coach_type,
  pv.conversation_category,
  pv.is_active,
  pv.is_published,
  
  -- Métricas actuales
  pp.total_sessions,
  pp.avg_satisfaction,
  pp.avg_engagement,
  pp.action_completion_rate,
  
  -- Prompt actual publicado
  current_pv.id as current_published_id,
  current_pv.version_name as current_version_name,
  current_pp.avg_satisfaction as current_satisfaction,
  current_pp.avg_engagement as current_engagement,
  current_pp.action_completion_rate as current_completion_rate,
  
  -- Mejoras
  ROUND(((pp.avg_satisfaction - current_pp.avg_satisfaction) / NULLIF(current_pp.avg_satisfaction, 0) * 100)::numeric, 2) as satisfaction_improvement_pct,
  ROUND(((pp.avg_engagement - current_pp.avg_engagement) / NULLIF(current_pp.avg_engagement, 0) * 100)::numeric, 2) as engagement_improvement_pct,
  ROUND(((pp.action_completion_rate - current_pp.action_completion_rate) / NULLIF(current_pp.action_completion_rate, 0) * 100)::numeric, 2) as completion_improvement_pct,
  
  -- Configuración
  ac.min_sessions_required,
  ac.min_satisfaction_score,
  ac.improvement_threshold_percentage,
  ac.require_manual_review,
  
  -- Evaluación
  CASE 
    WHEN pp.total_sessions >= ac.min_sessions_required
      AND pp.avg_satisfaction >= ac.min_satisfaction_score
      AND pp.avg_engagement >= ac.min_engagement_score
      AND pp.action_completion_rate >= ac.min_action_completion_rate
      AND ((pp.avg_satisfaction - current_pp.avg_satisfaction) / NULLIF(current_pp.avg_satisfaction, 0) * 100) >= ac.improvement_threshold_percentage
    THEN true
    ELSE false
  END as meets_autopublish_criteria,
  
  pv.created_at
FROM prompt_versions pv
JOIN prompt_performance pp ON pv.id = pp.prompt_version_id
CROSS JOIN autopublish_config ac
LEFT JOIN LATERAL (
  SELECT id, version_name
  FROM prompt_versions 
  WHERE coach_type = pv.coach_type 
    AND conversation_category = pv.conversation_category
    AND is_published = true
    AND is_active = true
  LIMIT 1
) current_pv ON true
LEFT JOIN prompt_performance current_pp ON current_pv.id = current_pp.prompt_version_id
WHERE pv.is_active = true
  AND pv.is_published = false
  AND ac.config_name = 'default'
  AND ac.is_enabled = true
ORDER BY 
  meets_autopublish_criteria DESC,
  satisfaction_improvement_pct DESC;

-- Función para evaluar candidatos a autopublicación
CREATE OR REPLACE FUNCTION evaluate_autopublish_candidates()
RETURNS TABLE (
  prompt_version_id UUID,
  version_name TEXT,
  coach_type TEXT,
  should_autopublish BOOLEAN,
  reason TEXT,
  metrics JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ac.prompt_version_id,
    ac.version_name,
    ac.coach_type,
    ac.meets_autopublish_criteria as should_autopublish,
    CASE 
      WHEN NOT ac.meets_autopublish_criteria THEN 
        'No cumple criterios: ' ||
        CASE WHEN ac.total_sessions < ac.min_sessions_required 
          THEN 'sesiones insuficientes (' || ac.total_sessions || '/' || ac.min_sessions_required || ') '
          ELSE '' END ||
        CASE WHEN ac.avg_satisfaction < ac.min_satisfaction_score 
          THEN 'satisfacción baja (' || ROUND(ac.avg_satisfaction::numeric, 2) || '/' || ac.min_satisfaction_score || ') '
          ELSE '' END ||
        CASE WHEN ac.satisfaction_improvement_pct < ac.improvement_threshold_percentage 
          THEN 'mejora insuficiente (' || ac.satisfaction_improvement_pct || '%/' || ac.improvement_threshold_percentage || '%) '
          ELSE '' END
      ELSE 
        'Cumple todos los criterios. Mejora: ' || 
        ROUND(ac.satisfaction_improvement_pct::numeric, 1) || '% satisfacción, ' ||
        ROUND(ac.engagement_improvement_pct::numeric, 1) || '% engagement'
    END as reason,
    jsonb_build_object(
      'total_sessions', ac.total_sessions,
      'avg_satisfaction', ac.avg_satisfaction,
      'avg_engagement', ac.avg_engagement,
      'action_completion_rate', ac.action_completion_rate,
      'satisfaction_improvement_pct', ac.satisfaction_improvement_pct,
      'engagement_improvement_pct', ac.engagement_improvement_pct,
      'completion_improvement_pct', ac.completion_improvement_pct
    ) as metrics
  FROM autopublish_candidates ac
  WHERE ac.meets_autopublish_criteria = true;
END;
$$ LANGUAGE plpgsql;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_autopublish_history_status ON autopublish_history(status);
CREATE INDEX IF NOT EXISTS idx_autopublish_history_created ON autopublish_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_autopublish_monitoring_health ON autopublish_monitoring(health_status);
CREATE INDEX IF NOT EXISTS idx_autopublish_monitoring_autopublish ON autopublish_monitoring(autopublish_id);

COMMENT ON TABLE autopublish_config IS 'Configuración del sistema de autopublicación de prompts';
COMMENT ON TABLE autopublish_history IS 'Historial de autopublicaciones realizadas';
COMMENT ON TABLE autopublish_monitoring IS 'Monitoreo post-publicación para detectar degradaciones';
COMMENT ON VIEW autopublish_candidates IS 'Vista de prompts candidatos a autopublicación';
