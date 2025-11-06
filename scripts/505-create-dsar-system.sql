CREATE TABLE IF NOT EXISTS dsar_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('access', 'deletion', 'portability', 'rectification')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'processing', 'completed', 'rejected', 'cancelled')),
  
  -- Verification
  verification_token TEXT UNIQUE,
  verification_code TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_method TEXT CHECK (verification_method IN ('email', 'phone', 'manual')),
  
  -- Processing
  assigned_to TEXT,
  started_processing_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Data export (for access/portability requests)
  export_file_url TEXT,
  export_format TEXT CHECK (export_format IN ('json', 'csv', 'pdf')),
  export_generated_at TIMESTAMP WITH TIME ZONE,
  export_expires_at TIMESTAMP WITH TIME ZONE,
  export_downloaded_at TIMESTAMP WITH TIME ZONE,
  
  -- Deletion tracking (for deletion requests)
  deletion_summary JSONB, -- Tables and record counts deleted
  deletion_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  request_reason TEXT,
  admin_notes TEXT,
  rejection_reason TEXT,
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to track what data was collected for each request
CREATE TABLE IF NOT EXISTS dsar_data_collected (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES dsar_requests(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  record_count INTEGER NOT NULL DEFAULT 0,
  data_snapshot JSONB, -- Actual data collected
  collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log for all DSAR actions
CREATE TABLE IF NOT EXISTS dsar_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES dsar_requests(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'created', 'verified', 'processed', 'exported', 'deleted', 'rejected'
  performed_by TEXT, -- email of admin or 'system'
  action_details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configuration for DSAR processing
CREATE TABLE IF NOT EXISTS dsar_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  updated_by TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO dsar_config (config_key, config_value, description) VALUES
('verification_required', 'true', 'Whether email verification is required for DSAR requests'),
('auto_approve_access', 'false', 'Auto-approve data access requests after verification'),
('export_expiry_days', '7', 'Days until export link expires'),
('deletion_grace_period_days', '30', 'Days to wait before permanent deletion'),
('notify_admins', 'true', 'Send notifications to admins for new requests'),
('admin_emails', '["travis@nuanu.com", "admin@dtc.com"]', 'Emails to notify for DSAR requests'),
('tables_to_export', '{
  "essential": ["users", "profiles", "user_preferences"],
  "assessments": ["test_results", "personality_assessments", "disc_results", "personality_results"],
  "career": ["cv_data", "user_experience", "user_education", "user_skills", "career_goals", "job_recommendations"],
  "learning": ["user_book_progress", "user_reading_sessions", "user_book_notes", "user_book_highlights", "coaching_sessions"],
  "interactions": ["ai_interactions", "brain_conversations", "coaching_metrics", "user_activities"]
}', 'Tables to include in data export organized by category')
ON CONFLICT (config_key) DO NOTHING;

-- View for DSAR request summary
CREATE OR REPLACE VIEW dsar_request_summary AS
SELECT 
  dr.id,
  dr.user_email,
  dr.request_type,
  dr.status,
  dr.created_at,
  dr.verified_at,
  dr.completed_at,
  dr.assigned_to,
  CASE 
    WHEN dr.status = 'pending' AND dr.verified_at IS NULL THEN 'Awaiting Verification'
    WHEN dr.status = 'verified' THEN 'Verified - Awaiting Processing'
    WHEN dr.status = 'processing' THEN 'Processing'
    WHEN dr.status = 'completed' THEN 'Completed'
    WHEN dr.status = 'rejected' THEN 'Rejected'
    WHEN dr.status = 'cancelled' THEN 'Cancelled'
  END as status_display,
  EXTRACT(EPOCH FROM (NOW() - dr.created_at))/3600 as hours_since_request,
  (SELECT COUNT(*) FROM dsar_data_collected WHERE request_id = dr.id) as tables_collected,
  (SELECT SUM(record_count) FROM dsar_data_collected WHERE request_id = dr.id) as total_records
FROM dsar_requests dr
ORDER BY dr.created_at DESC;

-- View for pending DSAR requests needing attention
CREATE OR REPLACE VIEW dsar_pending_requests AS
SELECT 
  dr.*,
  EXTRACT(EPOCH FROM (NOW() - dr.created_at))/3600 as hours_waiting,
  CASE 
    WHEN dr.status = 'pending' AND dr.verified_at IS NULL THEN 'high'
    WHEN dr.status = 'verified' AND EXTRACT(EPOCH FROM (NOW() - dr.verified_at))/3600 > 24 THEN 'high'
    WHEN dr.status = 'processing' AND EXTRACT(EPOCH FROM (NOW() - dr.started_processing_at))/3600 > 48 THEN 'high'
    ELSE 'normal'
  END as priority
FROM dsar_requests dr
WHERE dr.status IN ('pending', 'verified', 'processing')
ORDER BY 
  CASE 
    WHEN dr.status = 'pending' AND dr.verified_at IS NULL THEN 1
    WHEN dr.status = 'verified' THEN 2
    WHEN dr.status = 'processing' THEN 3
  END,
  dr.created_at ASC;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dsar_requests_user_email ON dsar_requests(user_email);
CREATE INDEX IF NOT EXISTS idx_dsar_requests_status ON dsar_requests(status);
CREATE INDEX IF NOT EXISTS idx_dsar_requests_created_at ON dsar_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dsar_data_collected_request_id ON dsar_data_collected(request_id);
CREATE INDEX IF NOT EXISTS idx_dsar_audit_log_request_id ON dsar_audit_log(request_id);

COMMENT ON TABLE dsar_requests IS 'GDPR Data Subject Access Requests - tracks all user data requests';
COMMENT ON TABLE dsar_data_collected IS 'Tracks what data was collected for each DSAR request';
COMMENT ON TABLE dsar_audit_log IS 'Audit trail of all actions performed on DSAR requests';
COMMENT ON TABLE dsar_config IS 'Configuration settings for DSAR processing';
