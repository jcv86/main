CREATE TABLE IF NOT EXISTS canary_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_name TEXT NOT NULL,
  description TEXT,
  deployment_type TEXT NOT NULL, -- 'feature', 'prompt', 'config', 'code'
  target_resource TEXT NOT NULL, -- what's being deployed (feature flag name, prompt id, etc)
  target_resource_id UUID,
  
  -- Deployment stages
  current_stage TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'stage_1', 'stage_2', 'stage_3', 'stage_4', 'completed', 'rolled_back', 'failed'
  stage_config JSONB NOT NULL DEFAULT '{"stages": [5, 25, 50, 100], "stage_duration_minutes": [30, 60, 120, 0]}',
  
  -- Traffic control
  current_traffic_percentage INTEGER NOT NULL DEFAULT 0,
  target_traffic_percentage INTEGER NOT NULL DEFAULT 100,
  
  -- Monitoring
  health_check_interval_minutes INTEGER DEFAULT 5,
  metrics_to_monitor JSONB DEFAULT '["error_rate", "response_time", "user_satisfaction"]',
  
  -- Thresholds for auto-rollback
  max_error_rate_increase_pct NUMERIC DEFAULT 10.0,
  max_response_time_increase_pct NUMERIC DEFAULT 20.0,
  min_satisfaction_score NUMERIC DEFAULT 3.5,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'paused', 'completed', 'rolled_back', 'failed'
  auto_rollback_enabled BOOLEAN DEFAULT true,
  require_manual_approval BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  rolled_back_at TIMESTAMPTZ,
  last_stage_change_at TIMESTAMPTZ,
  
  -- Metadata
  created_by TEXT,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  rollback_reason TEXT,
  deployment_notes TEXT,
  
  -- Integration
  ticket_id TEXT, -- Jira, Linear, etc
  git_commit_hash TEXT,
  git_branch TEXT
);

CREATE TABLE IF NOT EXISTS canary_deployment_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID NOT NULL REFERENCES canary_deployments(id) ON DELETE CASCADE,
  
  stage_number INTEGER NOT NULL,
  stage_name TEXT NOT NULL, -- 'Stage 1: 5%', 'Stage 2: 25%', etc
  traffic_percentage INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed', 'skipped'
  
  -- Metrics collected during this stage
  baseline_metrics JSONB,
  current_metrics JSONB,
  metrics_comparison JSONB,
  
  -- Health status
  health_status TEXT DEFAULT 'unknown', -- 'healthy', 'warning', 'critical', 'unknown'
  health_checks_passed INTEGER DEFAULT 0,
  health_checks_failed INTEGER DEFAULT 0,
  
  -- Timestamps
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Decision
  decision TEXT, -- 'proceed', 'rollback', 'pause', 'manual_review'
  decision_reason TEXT,
  decided_by TEXT, -- 'auto', 'admin@example.com'
  decided_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS canary_deployment_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID NOT NULL REFERENCES canary_deployments(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES canary_deployment_stages(id) ON DELETE CASCADE,
  
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  baseline_value NUMERIC,
  change_percentage NUMERIC,
  
  -- Comparison
  is_within_threshold BOOLEAN,
  threshold_value NUMERIC,
  
  -- Context
  traffic_percentage INTEGER,
  sample_size INTEGER,
  
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS canary_deployment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID NOT NULL REFERENCES canary_deployments(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES canary_deployment_stages(id) ON DELETE CASCADE,
  
  event_type TEXT NOT NULL, -- 'stage_started', 'stage_completed', 'health_check', 'rollback_triggered', 'manual_intervention', 'approval_requested'
  event_severity TEXT DEFAULT 'info', -- 'info', 'warning', 'error', 'critical'
  event_message TEXT NOT NULL,
  event_data JSONB,
  
  triggered_by TEXT, -- 'system', 'admin@example.com'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS canary_rollback_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID NOT NULL REFERENCES canary_deployments(id) ON DELETE CASCADE,
  
  rollback_reason TEXT NOT NULL,
  rollback_type TEXT NOT NULL, -- 'auto', 'manual'
  triggered_by TEXT,
  
  -- State before rollback
  stage_at_rollback TEXT,
  traffic_percentage_at_rollback INTEGER,
  metrics_at_rollback JSONB,
  
  -- Rollback execution
  rollback_started_at TIMESTAMPTZ DEFAULT NOW(),
  rollback_completed_at TIMESTAMPTZ,
  rollback_duration_ms INTEGER,
  rollback_status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed'
  rollback_error TEXT,
  
  -- Impact
  users_affected INTEGER,
  sessions_affected INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- View: Active deployments with current status
CREATE OR REPLACE VIEW canary_active_deployments AS
SELECT 
  cd.id,
  cd.deployment_name,
  cd.deployment_type,
  cd.current_stage,
  cd.current_traffic_percentage,
  cd.status,
  cd.auto_rollback_enabled,
  cd.started_at,
  cd.created_at, -- Added created_at to view columns
  cd.created_by,
  
  -- Current stage info
  cds.stage_name AS current_stage_name,
  cds.health_status AS current_health_status,
  cds.started_at AS stage_started_at,
  
  -- Time in current stage
  EXTRACT(EPOCH FROM (NOW() - cds.started_at))/60 AS minutes_in_current_stage,
  cds.duration_minutes AS stage_duration_minutes,
  
  -- Recent events
  (
    SELECT COUNT(*) 
    FROM canary_deployment_events 
    WHERE deployment_id = cd.id 
    AND event_severity IN ('error', 'critical')
    AND created_at > NOW() - INTERVAL '1 hour'
  ) AS recent_critical_events
  
FROM canary_deployments cd
LEFT JOIN canary_deployment_stages cds ON cds.deployment_id = cd.id AND cds.status = 'in_progress'
WHERE cd.status IN ('pending', 'in_progress', 'paused')
ORDER BY cd.created_at DESC;

-- View: Deployment health summary
CREATE OR REPLACE VIEW canary_deployment_health AS
SELECT 
  cd.id AS deployment_id,
  cd.deployment_name,
  cd.current_stage,
  cd.current_traffic_percentage,
  
  -- Metrics summary
  AVG(CASE WHEN cdm.metric_name = 'error_rate' THEN cdm.metric_value END) AS current_error_rate,
  AVG(CASE WHEN cdm.metric_name = 'error_rate' THEN cdm.baseline_value END) AS baseline_error_rate,
  AVG(CASE WHEN cdm.metric_name = 'response_time' THEN cdm.metric_value END) AS current_response_time,
  AVG(CASE WHEN cdm.metric_name = 'response_time' THEN cdm.baseline_value END) AS baseline_response_time,
  AVG(CASE WHEN cdm.metric_name = 'user_satisfaction' THEN cdm.metric_value END) AS current_satisfaction,
  AVG(CASE WHEN cdm.metric_name = 'user_satisfaction' THEN cdm.baseline_value END) AS baseline_satisfaction,
  
  -- Health checks
  SUM(cds.health_checks_passed) AS total_health_checks_passed,
  SUM(cds.health_checks_failed) AS total_health_checks_failed,
  
  -- Overall health
  CASE 
    WHEN SUM(cds.health_checks_failed) > 3 THEN 'critical'
    WHEN SUM(cds.health_checks_failed) > 0 THEN 'warning'
    WHEN SUM(cds.health_checks_passed) > 0 THEN 'healthy'
    ELSE 'unknown'
  END AS overall_health_status
  
FROM canary_deployments cd
LEFT JOIN canary_deployment_stages cds ON cds.deployment_id = cd.id
LEFT JOIN canary_deployment_metrics cdm ON cdm.deployment_id = cd.id AND cdm.created_at > NOW() - INTERVAL '15 minutes'
WHERE cd.status = 'in_progress'
GROUP BY cd.id, cd.deployment_name, cd.current_stage, cd.current_traffic_percentage;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_canary_deployments_status ON canary_deployments(status);
CREATE INDEX IF NOT EXISTS idx_canary_deployments_created_at ON canary_deployments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_canary_deployment_stages_deployment ON canary_deployment_stages(deployment_id);
CREATE INDEX IF NOT EXISTS idx_canary_deployment_metrics_deployment ON canary_deployment_metrics(deployment_id);
CREATE INDEX IF NOT EXISTS idx_canary_deployment_events_deployment ON canary_deployment_events(deployment_id);
CREATE INDEX IF NOT EXISTS idx_canary_deployment_events_created_at ON canary_deployment_events(created_at DESC);
