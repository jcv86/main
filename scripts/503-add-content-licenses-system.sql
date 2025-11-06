-- Sistema de Documentación de Licencias para Contenido
-- Registra origen, derechos y compliance de libros y tests

-- Tabla principal de licencias
CREATE TABLE IF NOT EXISTS content_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('book', 'test', 'prompt', 'article', 'video', 'other')),
  content_id UUID NOT NULL,
  content_title TEXT NOT NULL,
  
  -- Información de licencia
  license_type VARCHAR(100) NOT NULL CHECK (license_type IN (
    'public_domain',
    'cc_by',
    'cc_by_sa',
    'cc_by_nc',
    'cc_by_nd',
    'fair_use',
    'proprietary',
    'custom',
    'unknown',
    'pending_review'
  )),
  license_details TEXT,
  license_url TEXT,
  
  -- Información de origen
  source_name TEXT,
  source_url TEXT,
  author_name TEXT,
  publisher TEXT,
  publication_date DATE,
  acquisition_date DATE DEFAULT CURRENT_DATE,
  
  -- Derechos y restricciones
  copyright_holder TEXT,
  rights_statement TEXT,
  usage_restrictions TEXT,
  attribution_required BOOLEAN DEFAULT false,
  attribution_text TEXT,
  commercial_use_allowed BOOLEAN DEFAULT false,
  modification_allowed BOOLEAN DEFAULT false,
  redistribution_allowed BOOLEAN DEFAULT false,
  
  -- Compliance
  compliance_status VARCHAR(50) DEFAULT 'pending_review' CHECK (compliance_status IN (
    'verified',
    'pending_review',
    'needs_documentation',
    'at_risk',
    'non_compliant'
  )),
  compliance_notes TEXT,
  last_review_date DATE,
  next_review_date DATE,
  reviewed_by UUID REFERENCES auth.users(id),
  
  -- Documentación
  documentation_url TEXT,
  internal_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_content_licenses_type ON content_licenses(content_type);
CREATE INDEX IF NOT EXISTS idx_content_licenses_content_id ON content_licenses(content_id);
CREATE INDEX IF NOT EXISTS idx_content_licenses_compliance ON content_licenses(compliance_status);
CREATE INDEX IF NOT EXISTS idx_content_licenses_license_type ON content_licenses(license_type);
CREATE INDEX IF NOT EXISTS idx_content_licenses_review_date ON content_licenses(next_review_date);

-- Drop and recreate views to avoid column conflicts
DROP VIEW IF EXISTS content_license_compliance_summary;
DROP VIEW IF EXISTS unlicensed_content;

-- Vista de resumen de compliance
CREATE VIEW content_license_compliance_summary AS
SELECT 
  content_type,
  compliance_status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY content_type), 2) as percentage
FROM content_licenses
GROUP BY content_type, compliance_status
ORDER BY content_type, compliance_status;

-- Vista de contenido sin licencia
CREATE VIEW unlicensed_content AS
SELECT 
  'book' as content_type,
  b.id as content_id,
  b.title as content_title,
  b.created_at
FROM books b
LEFT JOIN content_licenses cl ON cl.content_id = b.id AND cl.content_type = 'book'
WHERE cl.id IS NULL

UNION ALL

SELECT 
  'test' as content_type,
  NULL as content_id,
  'Tests sin licencia' as content_title,
  NOW() as created_at
WHERE NOT EXISTS (
  SELECT 1 FROM content_licenses WHERE content_type = 'test'
);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_content_licenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS content_licenses_updated_at ON content_licenses;
CREATE TRIGGER content_licenses_updated_at
  BEFORE UPDATE ON content_licenses
  FOR EACH ROW
  EXECUTE FUNCTION update_content_licenses_updated_at();
