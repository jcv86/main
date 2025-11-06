-- Drop and recreate the canary_active_deployments view with correct columns
-- This fixes the "cannot change name of view column" error

DROP VIEW IF EXISTS canary_active_deployments CASCADE;

CREATE VIEW canary_active_deployments AS
SELECT 
  cd.id,
  cd.deployment_name,
  cd.deployment_type,
  cd.current_stage,
  cd.current_traffic_percentage,
  cd.status,
  cd.auto_rollback_enabled,
  cd.started_at,
  cd.created_at,
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
