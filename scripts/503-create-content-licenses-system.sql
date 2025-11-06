-- Sistema de Documentación de Licencias para Contenido
-- Registra origen, derechos y compliance legal de libros y tests

-- Tabla principal de licencias de contenido
CREATE TABLE IF NOT EXISTS content_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL CHECK (content_type IN ('book', 'test', 'article', 'resource')),
    content_id UUID NOT NULL,
    content_title TEXT NOT NULL,
    
    -- Información de licencia
    license_type TEXT NOT NULL CHECK (license_type IN (
        'public_domain',
        'creative_commons_by',
        'creative_commons_by_sa',
        'creative_commons_by_nc',
        'creative_commons_by_nc_sa',
        'fair_use',
        'purchased',
        'proprietary',
        'custom',
        'unknown'
    )),
    license_details TEXT,
    license_url TEXT,
    
    -- Información de origen
    source_type TEXT CHECK (source_type IN (
        'original_creation',
        'purchased_rights',
        'public_domain',
        'creative_commons',
        'fair_use_excerpt',
        'licensed_content',
        'user_generated',
        'third_party'
    )),
    source_name TEXT,
    source_url TEXT,
    acquisition_date DATE,
    
    -- Derechos y restricciones
    copyright_holder TEXT,
    copyright_year INTEGER,
    usage_rights TEXT,
    restrictions TEXT,
    attribution_required BOOLEAN DEFAULT false,
    attribution_text TEXT,
    commercial_use_allowed BOOLEAN DEFAULT false,
    modification_allowed BOOLEAN DEFAULT false,
    redistribution_allowed BOOLEAN DEFAULT false,
    
    -- Compliance
    compliance_status TEXT DEFAULT 'pending' CHECK (compliance_status IN (
        'verified',
        'pending_review',
        'needs_documentation',
        'at_risk',
        'non_compliant'
    )),
    compliance_notes TEXT,
    verified_by TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    last_review_date DATE,
    next_review_date DATE,
    
    -- Documentación
    proof_of_license_url TEXT,
    contract_reference TEXT,
    internal_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT,
    updated_by TEXT
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_content_licenses_content ON content_licenses(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_licenses_status ON content_licenses(compliance_status);
CREATE INDEX IF NOT EXISTS idx_content_licenses_review ON content_licenses(next_review_date);

-- Tabla de historial de cambios de licencias
CREATE TABLE IF NOT EXISTS content_license_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID REFERENCES content_licenses(id) ON DELETE CASCADE,
    change_type TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_by TEXT,
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de alertas de compliance
CREATE TABLE IF NOT EXISTS license_compliance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID REFERENCES content_licenses(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL CHECK (alert_type IN (
        'missing_documentation',
        'review_overdue',
        'license_expiring',
        'compliance_issue',
        'verification_needed'
    )),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    alert_message TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
    acknowledged_by TEXT,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_by TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_license_alerts_status ON license_compliance_alerts(status, severity);

-- Vista de resumen de compliance
CREATE OR REPLACE VIEW license_compliance_summary AS
SELECT 
    content_type,
    COUNT(*) as total_items,
    COUNT(*) FILTER (WHERE compliance_status = 'verified') as verified_count,
    COUNT(*) FILTER (WHERE compliance_status = 'pending_review') as pending_count,
    COUNT(*) FILTER (WHERE compliance_status = 'needs_documentation') as needs_docs_count,
    COUNT(*) FILTER (WHERE compliance_status = 'at_risk') as at_risk_count,
    COUNT(*) FILTER (WHERE compliance_status = 'non_compliant') as non_compliant_count,
    ROUND(100.0 * COUNT(*) FILTER (WHERE compliance_status = 'verified') / NULLIF(COUNT(*), 0), 2) as compliance_percentage,
    COUNT(*) FILTER (WHERE next_review_date < CURRENT_DATE) as overdue_reviews,
    COUNT(*) FILTER (WHERE license_type = 'unknown') as unknown_licenses
FROM content_licenses
GROUP BY content_type;

-- Vista de contenido sin licencia documentada
CREATE OR REPLACE VIEW unlicensed_content AS
SELECT 
    'book' as content_type,
    b.id as content_id,
    b.title as content_title,
    b.author,
    b.published_year,
    b.created_at
FROM books b
LEFT JOIN content_licenses cl ON cl.content_id = b.id AND cl.content_type = 'book'
WHERE cl.id IS NULL

UNION ALL

SELECT 
    'book' as content_type,
    lb.id as content_id,
    lb.title as content_title,
    lb.author,
    lb.published_year,
    lb.created_at
FROM library_books lb
LEFT JOIN content_licenses cl ON cl.content_id = lb.id AND cl.content_type = 'book'
WHERE cl.id IS NULL;

-- Función para crear alertas automáticas
CREATE OR REPLACE FUNCTION check_license_compliance()
RETURNS void AS $$
BEGIN
    -- Alertas por revisión vencida
    INSERT INTO license_compliance_alerts (license_id, alert_type, severity, alert_message)
    SELECT 
        id,
        'review_overdue',
        'high',
        'License review is overdue for: ' || content_title
    FROM content_licenses
    WHERE next_review_date < CURRENT_DATE
    AND compliance_status != 'non_compliant'
    AND id NOT IN (
        SELECT license_id FROM license_compliance_alerts 
        WHERE alert_type = 'review_overdue' AND status = 'active'
    );
    
    -- Alertas por documentación faltante
    INSERT INTO license_compliance_alerts (license_id, alert_type, severity, alert_message)
    SELECT 
        id,
        'missing_documentation',
        'medium',
        'Missing license documentation for: ' || content_title
    FROM content_licenses
    WHERE compliance_status = 'needs_documentation'
    AND id NOT IN (
        SELECT license_id FROM license_compliance_alerts 
        WHERE alert_type = 'missing_documentation' AND status = 'active'
    );
    
    -- Alertas por licencias desconocidas
    INSERT INTO license_compliance_alerts (license_id, alert_type, severity, alert_message)
    SELECT 
        id,
        'verification_needed',
        'critical',
        'Unknown license type for: ' || content_title
    FROM content_licenses
    WHERE license_type = 'unknown'
    AND id NOT IN (
        SELECT license_id FROM license_compliance_alerts 
        WHERE alert_type = 'verification_needed' AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_content_license_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_licenses_timestamp
    BEFORE UPDATE ON content_licenses
    FOR EACH ROW
    EXECUTE FUNCTION update_content_license_timestamp();

-- Trigger para registrar cambios en historial
CREATE OR REPLACE FUNCTION log_license_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO content_license_history (
        license_id,
        change_type,
        old_values,
        new_values,
        changed_by
    ) VALUES (
        NEW.id,
        TG_OP,
        to_jsonb(OLD),
        to_jsonb(NEW),
        NEW.updated_by
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_content_license_changes
    AFTER UPDATE ON content_licenses
    FOR EACH ROW
    EXECUTE FUNCTION log_license_changes();

COMMENT ON TABLE content_licenses IS 'Documentación completa de licencias y derechos de contenido';
COMMENT ON TABLE license_compliance_alerts IS 'Alertas de compliance y problemas de licencias';
COMMENT ON VIEW license_compliance_summary IS 'Resumen del estado de compliance por tipo de contenido';
COMMENT ON VIEW unlicensed_content IS 'Contenido sin licencia documentada';
