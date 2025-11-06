-- Sistema de Políticas de Retención de Datos
-- Define y automatiza limpieza de datos según tipo y antigüedad

-- Tabla de políticas de retención
CREATE TABLE IF NOT EXISTS data_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name VARCHAR(100) NOT NULL UNIQUE,
  table_name VARCHAR(100) NOT NULL,
  retention_days INTEGER NOT NULL,
  description TEXT,
  category VARCHAR(50) CHECK (category IN ('essential', 'operational', 'analytics', 'temporary', 'cache')),
  is_active BOOLEAN DEFAULT true,
  auto_cleanup_enabled BOOLEAN DEFAULT false,
  archive_before_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Historial de limpieza
CREATE TABLE IF NOT EXISTS data_cleanup_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID REFERENCES data_retention_policies(id),
  table_name VARCHAR(100) NOT NULL,
  records_deleted INTEGER DEFAULT 0,
  records_archived INTEGER DEFAULT 0,
  cleanup_date TIMESTAMPTZ DEFAULT NOW(),
  executed_by UUID REFERENCES auth.users(id),
  execution_type VARCHAR(50) CHECK (execution_type IN ('manual', 'automatic', 'scheduled')),
  status VARCHAR(50) CHECK (status IN ('success', 'partial', 'failed')),
  error_message TEXT,
  execution_time_ms INTEGER
);

-- Insert default policies (solo si no existen)
INSERT INTO data_retention_policies (policy_name, table_name, retention_days, description, category, auto_cleanup_enabled) 
VALUES
('user_sessions', 'user_sessions', 30, 'Sesiones de usuario inactivas', 'operational', true),
('test_results_temp', 'test_results', 365, 'Resultados de tests antiguos', 'analytics', false),
('ai_coaching_sessions', 'ai_coaching_sessions', 180, 'Sesiones de coaching AI', 'operational', false),
('user_reading_sessions', 'user_reading_sessions', 365, 'Sesiones de lectura', 'analytics', false),
('ab_test_results', 'ab_test_results', 90, 'Resultados de AB testing', 'analytics', true),
('system_logs', 'system_logs', 30, 'Logs del sistema', 'operational', true),
('error_logs', 'error_logs', 90, 'Logs de errores', 'operational', false),
('audit_logs', 'audit_logs', 2555, 'Logs de auditoría (7 años)', 'essential', false),
('user_activity_logs', 'user_activity_logs', 180, 'Logs de actividad de usuario', 'analytics', true),
('email_notifications', 'email_notifications', 60, 'Notificaciones por email enviadas', 'temporary', true),
('cache_entries', 'cache_entries', 7, 'Entradas de caché', 'cache', true),
('temp_files', 'temp_files', 1, 'Archivos temporales', 'temporary', true)
ON CONFLICT (policy_name) DO NOTHING;

-- Índices (solo si no existen)
CREATE INDEX IF NOT EXISTS idx_retention_policies_active ON data_retention_policies(is_active);
CREATE INDEX IF NOT EXISTS idx_retention_policies_table ON data_retention_policies(table_name);
CREATE INDEX IF NOT EXISTS idx_cleanup_history_date ON data_cleanup_history(cleanup_date);
CREATE INDEX IF NOT EXISTS idx_cleanup_history_policy ON data_cleanup_history(policy_id);

-- Vista de políticas activas
CREATE OR REPLACE VIEW active_retention_policies AS
SELECT 
  p.*,
  COUNT(h.id) as cleanup_count,
  MAX(h.cleanup_date) as last_cleanup,
  SUM(h.records_deleted) as total_deleted
FROM data_retention_policies p
LEFT JOIN data_cleanup_history h ON h.policy_id = p.id
WHERE p.is_active = true
GROUP BY p.id;
