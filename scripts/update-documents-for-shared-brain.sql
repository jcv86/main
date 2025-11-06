-- Modificar la tabla documents para ser un cerebro compartido administrado
-- Primero eliminar la foreign key constraint antes de eliminar la columna
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_user_id_fkey CASCADE;

-- Eliminar user_id ya que los documentos son compartidos, no personales
ALTER TABLE documents DROP COLUMN IF EXISTS user_id CASCADE;

-- Agregar campos para administración
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS file_type TEXT; -- 'pdf', 'csv', 'dataset', etc.

-- Crear índices para búsqueda eficiente
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_is_active ON documents(is_active);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN(tags);

-- Habilitar RLS pero permitir lectura a todos los usuarios autenticados
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer documentos activos
CREATE POLICY "Anyone can read active documents"
ON documents FOR SELECT
TO authenticated
USING (is_active = true);

-- Política: Solo admins pueden insertar/actualizar/eliminar
CREATE POLICY "Only admins can manage documents"
ON documents FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.email IN ('travis@nuanu.com', 'rjvial@gn.cl')
  )
);

-- Lo mismo para document_chunks
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read chunks"
ON document_chunks FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage chunks"
ON document_chunks FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.email IN ('travis@nuanu.com', 'rjvial@gn.cl')
  )
);

-- Crear tabla para tracking de uso del cerebro
CREATE TABLE IF NOT EXISTS brain_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  query TEXT NOT NULL,
  sources_used TEXT[], -- IDs de documentos/libros usados
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_brain_queries_user ON brain_queries(user_id);
CREATE INDEX idx_brain_queries_created ON brain_queries(created_at);
