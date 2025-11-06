-- =====================================================
-- SISTEMA DE POLÍTICAS DE RETENCIÓN DE DATOS
-- =====================================================
-- Gestión completa de retención y limpieza automática de datos
-- Cumplimiento con GDPR y regulaciones de privacidad

-- Tabla de políticas de retención por tipo de dato
CREATE TABLE IF NOT EXISTS data_retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_type TEXT NOT NULL UNIQUE, -- Tipo de dato (ej: 'test_results', 'ai_conversations')
    table_name TEXT NOT NULL, -- Nombre de la tabla
    retention_days INTEGER NOT NULL, -- Días de retención
    retention_category TEXT NOT NULL CHECK (retention_category IN (
        'essential', -- Datos esenciales (indefinido o muy largo)
        'operational', -- Datos operacionales (1-3 años)
        'analytical', -- Datos analíticos (6-12 meses)
        'temporary', -- Datos temporales (30-90 días)
        'cache' -- Cache (1-7 días)
    )),
    archive_before_delete BOOLEAN DEFAULT false, -- Archivar antes de eliminar
    archive_table_name TEXT, -- Tabla de archivo si aplica
    auto_cleanup_enabled BOOLEAN DEFAULT true, -- Limpieza automática habilitada
    last_cleanup_at TIMESTAMP WITH TIME ZONE,
    next_cleanup_at TIMESTAMP WITH TIME ZONE,
    cleanup_frequency_days INTEGER DEFAULT 7, -- Frecuencia de limpieza en días
    date_column TEXT NOT NULL, -- Columna de fecha para calcular retención
    description TEXT,
    legal_basis TEXT, -- Base legal para la retención
    compliance_notes TEXT,
    notify_before_deletion BOOLEAN DEFAULT false,
    notification_days_before INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT,
    updated_by TEXT
);

-- Tabla de historial de limpieza
CREATE TABLE IF NOT EXISTS data_cleanup_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES data_retention_policies(id),
    data_type TEXT NOT NULL,
    table_name TEXT NOT NULL,
    cleanup_type TEXT NOT NULL CHECK (cleanup_type IN ('automatic', 'manual', 'scheduled')),
    records_identified INTEGER NOT NULL DEFAULT 0,
    records_archived INTEGER NOT NULL DEFAULT 0,
    records_deleted INTEGER NOT NULL DEFAULT 0,
    records_failed INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'partial')),
    error_message TEXT,
    error_details JSONB,
    executed_by TEXT,
    execution_summary JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de datos archivados (metadata)
CREATE TABLE IF NOT EXISTS archived_data_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_table TEXT NOT NULL,
    original_id TEXT NOT NULL,
    data_type TEXT NOT NULL,
    archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archive_location TEXT, -- Ubicación del archivo (blob storage, etc)
    archive_format TEXT DEFAULT 'jsonb', -- Formato del archivo
    data_snapshot JSONB, -- Snapshot de los datos
    retention_until TIMESTAMP WITH TIME ZONE, -- Fecha hasta la cual se debe retener el archivo
    can_be_restored BOOLEAN DEFAULT true,
    restored_at TIMESTAMP WITH TIME ZONE,
    restored_by TEXT,
    permanent_deletion_at TIMESTAMP WITH TIME ZONE, -- Fecha de eliminación permanente
    user_id UUID, -- Usuario relacionado (para DSAR)
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de notificaciones de retención
CREATE TABLE IF NOT EXISTS retention_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES data_retention_policies(id),
    notification_type TEXT NOT NULL CHECK (notification_type IN (
        'upcoming_deletion',
        'deletion_completed',
        'archive_completed',
        'cleanup_failed',
        'policy_expiring'
    )),
    recipient_email TEXT NOT NULL,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('admin', 'user', 'dpo')),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    data_summary JSONB,
    sent_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_retention_policies_data_type ON data_retention_policies(data_type);
CREATE INDEX IF NOT EXISTS idx_retention_policies_next_cleanup ON data_retention_policies(next_cleanup_at) WHERE auto_cleanup_enabled = true;
CREATE INDEX IF NOT EXISTS idx_cleanup_history_policy ON data_cleanup_history(policy_id);
CREATE INDEX IF NOT EXISTS idx_cleanup_history_created ON data_cleanup_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_archived_metadata_table ON archived_data_metadata(original_table);
CREATE INDEX IF NOT EXISTS idx_archived_metadata_user ON archived_data_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_archived_metadata_retention ON archived_data_metadata(retention_until);
CREATE INDEX IF NOT EXISTS idx_retention_notifications_status ON retention_notifications(status) WHERE status = 'pending';

-- Vista de resumen de retención
CREATE OR REPLACE VIEW retention_summary AS
SELECT 
    drp.data_type,
    drp.table_name,
    drp.retention_days,
    drp.retention_category,
    drp.auto_cleanup_enabled,
    drp.last_cleanup_at,
    drp.next_cleanup_at,
    COUNT(DISTINCT dch.id) as total_cleanups,
    SUM(dch.records_deleted) as total_records_deleted,
    SUM(dch.records_archived) as total_records_archived,
    MAX(dch.completed_at) as last_successful_cleanup,
    COUNT(CASE WHEN dch.status = 'failed' THEN 1 END) as failed_cleanups
FROM data_retention_policies drp
LEFT JOIN data_cleanup_history dch ON drp.id = dch.policy_id
GROUP BY drp.id, drp.data_type, drp.table_name, drp.retention_days, 
         drp.retention_category, drp.auto_cleanup_enabled, 
         drp.last_cleanup_at, drp.next_cleanup_at;

-- Vista de políticas que necesitan limpieza
CREATE OR REPLACE VIEW policies_needing_cleanup AS
SELECT 
    id,
    data_type,
    table_name,
    retention_days,
    date_column,
    last_cleanup_at,
    next_cleanup_at,
    EXTRACT(DAY FROM (NOW() - COALESCE(last_cleanup_at, NOW() - INTERVAL '1 year'))) as days_since_last_cleanup
FROM data_retention_policies
WHERE auto_cleanup_enabled = true
  AND (next_cleanup_at IS NULL OR next_cleanup_at <= NOW())
ORDER BY next_cleanup_at NULLS FIRST;

-- Insertar políticas de retención predefinidas
INSERT INTO data_retention_policies (
    data_type, table_name, retention_days, retention_category, 
    date_column, description, legal_basis, auto_cleanup_enabled,
    archive_before_delete, cleanup_frequency_days
) VALUES
-- Datos esenciales (retención larga)
('user_profiles', 'users', 2555, 'essential', 'created_at', 
 'Perfiles de usuario - Retención de 7 años', 
 'Cumplimiento contractual y legal', true, true, 30),

('test_results', 'test_results', 1825, 'essential', 'completed_at', 
 'Resultados de tests psicométricos - Retención de 5 años', 
 'Servicios contratados y análisis longitudinal', true, true, 30),

-- Datos operacionales (1-3 años)
('coaching_sessions', 'coaching_sessions', 1095, 'operational', 'created_at', 
 'Sesiones de coaching - Retención de 3 años', 
 'Mejora del servicio y análisis de calidad', true, true, 14),

('job_applications', 'job_applications', 730, 'operational', 'created_at', 
 'Aplicaciones laborales - Retención de 2 años', 
 'Cumplimiento legal laboral', true, true, 30),

('cv_data', 'cv_data', 1095, 'operational', 'updated_at', 
 'Datos de CV - Retención de 3 años', 
 'Servicios contratados', true, true, 30),

-- Datos analíticos (6-12 meses)
('ai_conversations', 'ai_conversations', 365, 'analytical', 'created_at', 
 'Conversaciones con IA - Retención de 1 año', 
 'Mejora de modelos y análisis de uso', true, true, 7),

('brain_conversations', 'brain_conversations', 365, 'analytical', 'created_at', 
 'Consultas al cerebro - Retención de 1 año', 
 'Mejora del sistema RAG', true, true, 7),

('coaching_metrics', 'coaching_metrics', 365, 'analytical', 'created_at', 
 'Métricas de coaching - Retención de 1 año', 
 'Análisis de efectividad', true, true, 7),

('user_activities', 'user_activities', 180, 'analytical', 'created_at', 
 'Actividades de usuario - Retención de 6 meses', 
 'Análisis de engagement', true, false, 7),

-- Datos temporales (30-90 días)
('email_insights_history', 'email_insights_history', 90, 'temporary', 'sent_at', 
 'Historial de emails - Retención de 90 días', 
 'Análisis de comunicaciones', true, false, 7),

('admin_notifications', 'admin_notifications', 90, 'temporary', 'created_at', 
 'Notificaciones admin - Retención de 90 días', 
 'Gestión operacional', true, false, 7),

('ab_test_events', 'ab_test_events', 180, 'analytical', 'created_at', 
 'Eventos de A/B testing - Retención de 6 meses', 
 'Análisis de experimentos', true, true, 14),

-- Cache y datos temporales (1-7 días)
('brain_response_cache', 'brain_response_cache', 7, 'cache', 'created_at', 
 'Cache de respuestas - Retención de 7 días', 
 'Optimización de performance', true, false, 1),

('api_usage_tracking', 'api_usage_tracking', 30, 'analytical', 'created_at', 
 'Tracking de uso de API - Retención de 30 días', 
 'Monitoreo de costos', true, false, 7),

-- Logs y métricas
('cron_job_executions', 'cron_job_executions', 90, 'operational', 'created_at', 
 'Ejecuciones de cron jobs - Retención de 90 días', 
 'Monitoreo operacional', true, false, 7),

('metric_values', 'metric_values', 90, 'analytical', 'measured_at', 
 'Valores de métricas - Retención de 90 días', 
 'Análisis de sistema', true, false, 7);

-- Función para calcular próxima fecha de limpieza
CREATE OR REPLACE FUNCTION calculate_next_cleanup_date(policy_id UUID)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
DECLARE
    cleanup_freq INTEGER;
    last_cleanup TIMESTAMP WITH TIME ZONE;
    next_cleanup TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT cleanup_frequency_days, last_cleanup_at
    INTO cleanup_freq, last_cleanup
    FROM data_retention_policies
    WHERE id = policy_id;
    
    IF last_cleanup IS NULL THEN
        next_cleanup := NOW();
    ELSE
        next_cleanup := last_cleanup + (cleanup_freq || ' days')::INTERVAL;
    END IF;
    
    RETURN next_cleanup;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar next_cleanup_at
CREATE OR REPLACE FUNCTION update_next_cleanup_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.next_cleanup_at := calculate_next_cleanup_date(NEW.id);
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_next_cleanup
BEFORE UPDATE ON data_retention_policies
FOR EACH ROW
WHEN (OLD.last_cleanup_at IS DISTINCT FROM NEW.last_cleanup_at)
EXECUTE FUNCTION update_next_cleanup_trigger();

-- Comentarios
COMMENT ON TABLE data_retention_policies IS 'Políticas de retención de datos por tipo';
COMMENT ON TABLE data_cleanup_history IS 'Historial de ejecuciones de limpieza de datos';
COMMENT ON TABLE archived_data_metadata IS 'Metadata de datos archivados antes de eliminación';
COMMENT ON TABLE retention_notifications IS 'Notificaciones relacionadas con retención de datos';
