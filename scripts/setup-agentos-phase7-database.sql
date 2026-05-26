-- Phase 7: DTC AgentOS Database Migrations
-- Run this script in Supabase SQL Editor

-- Agent runs log - tracks all AI agent executions
CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  command TEXT NOT NULL,
  agent TEXT NOT NULL,
  mode TEXT NOT NULL,
  input_context JSONB,
  output_response JSONB,
  memory_updates JSONB,
  tokens_used INTEGER,
  duration_ms INTEGER,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'success', 'error'
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_user ON agent_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_command ON agent_runs(command);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_agent_runs_created ON agent_runs(created_at DESC);

-- Unlock events - tracks when features/modules are unlocked
CREATE TABLE IF NOT EXISTS unlock_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unlock_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  conditions_met JSONB,
  triggered_by TEXT, -- 'module_complete', 'document_created', 'score_threshold', etc.
  UNIQUE(user_id, unlock_key)
);

CREATE INDEX IF NOT EXISTS idx_unlock_events_user ON unlock_events(user_id);
CREATE INDEX IF NOT EXISTS idx_unlock_events_key ON unlock_events(unlock_key);

-- Admin roles table for admin dashboard access
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'super_admin', 'support'
  permissions JSONB DEFAULT '["read_users", "read_metrics"]',
  granted_by UUID,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_admin_roles_user ON admin_roles(user_id);

-- Admin logs for audit trail
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_user_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at DESC);

-- Memory items enhancements (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'memory_items' AND column_name = 'valid_until') THEN
    ALTER TABLE memory_items ADD COLUMN valid_until TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'memory_items' AND column_name = 'importance') THEN
    ALTER TABLE memory_items ADD COLUMN importance NUMERIC DEFAULT 0.5;
  END IF;
END $$;

-- Row Level Security Policies

-- agent_runs: Users can only see their own runs
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS agent_runs_user_isolation ON agent_runs;
CREATE POLICY agent_runs_user_isolation ON agent_runs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS agent_runs_insert ON agent_runs;
CREATE POLICY agent_runs_insert ON agent_runs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- unlock_events: Users can only see their own unlocks
ALTER TABLE unlock_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS unlock_events_user_isolation ON unlock_events;
CREATE POLICY unlock_events_user_isolation ON unlock_events
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS unlock_events_insert ON unlock_events;
CREATE POLICY unlock_events_insert ON unlock_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- admin_roles: Only admins can see admin roles
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_roles_self_read ON admin_roles;
CREATE POLICY admin_roles_self_read ON admin_roles
  FOR SELECT USING (auth.uid() = user_id);

-- admin_logs: Admins can see all logs
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_logs_admin_read ON admin_logs;
CREATE POLICY admin_logs_admin_read ON admin_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS admin_logs_admin_insert ON admin_logs;
CREATE POLICY admin_logs_admin_insert ON admin_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

-- Comments for documentation
COMMENT ON TABLE agent_runs IS 'Logs all DTC AgentOS command executions with context and results';
COMMENT ON TABLE unlock_events IS 'Tracks when users unlock modules/features based on progress';
COMMENT ON TABLE admin_roles IS 'Defines admin access levels for platform management';
COMMENT ON TABLE admin_logs IS 'Audit trail of all admin actions for compliance';

COMMENT ON COLUMN agent_runs.command IS 'DTC command executed (e.g., /dtc:a3-run-interview)';
COMMENT ON COLUMN agent_runs.agent IS 'Agent used (coach, sofia, elena, bruno)';
COMMENT ON COLUMN agent_runs.mode IS 'Mode used (coaching, basic-interview, etc.)';
COMMENT ON COLUMN unlock_events.triggered_by IS 'What triggered the unlock (module_complete, score_threshold, etc.)';
COMMENT ON COLUMN admin_roles.permissions IS 'JSON array of permission strings';
