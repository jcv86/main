-- Sistema DSAR (Data Subject Access Request) para cumplimiento GDPR
-- Permite a usuarios solicitar acceso, eliminación y portabilidad de sus datos

-- Added DROP INDEX IF EXISTS to handle existing indexes
DROP INDEX IF EXISTS idx_dsar_requests_user;
DROP INDEX IF EXISTS idx_dsar_requests_status;
DROP INDEX IF EXISTS idx_dsar_requests_type;
DROP INDEX IF EXISTS idx_dsar_audit_request;

CREATE TABLE IF NOT EXISTS dsar_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  request_type TEXT NOT NULL, -- 'access', 'deletion', 'portability', 'rectification'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'processing', 'completed', 'rejected'
  verification_code TEXT,
  verification_expires_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  data_export_url TEXT,
  export_expires_at TIMESTAMPTZ,
  deletion_scheduled_for TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dsar_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES dsar_requests(id),
  action TEXT NOT NULL,
  performed_by UUID REFERENCES auth.users(id),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recreate indexes after dropping
CREATE INDEX idx_dsar_requests_user ON dsar_requests(user_id);
CREATE INDEX idx_dsar_requests_status ON dsar_requests(status);
CREATE INDEX idx_dsar_requests_type ON dsar_requests(request_type);
CREATE INDEX idx_dsar_audit_request ON dsar_audit_log(request_id);

COMMENT ON TABLE dsar_requests IS 'Solicitudes DSAR (Data Subject Access Request) para cumplimiento GDPR';
COMMENT ON TABLE dsar_audit_log IS 'Registro de auditoría de todas las acciones DSAR';
