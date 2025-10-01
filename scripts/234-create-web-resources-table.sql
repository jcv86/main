-- Crear tabla para almacenar recursos web en el cerebro
-- Esta tabla se integrará con knowledge_base para consultas del AI

-- Tabla principal de recursos web
CREATE TABLE IF NOT EXISTS web_resources (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Contenido extraído del sitio
  category TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'article', 'report', 'data', 'news', 'government', 'academic'
  country TEXT DEFAULT 'Chile',
  tags TEXT[] DEFAULT '{}',
  author TEXT,
  published_date DATE,
  access_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP,
  metadata JSONB DEFAULT '{}', -- Para almacenar info adicional flexible
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_web_resources_category ON web_resources(category);
CREATE INDEX IF NOT EXISTS idx_web_resources_tags ON web_resources USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_web_resources_country ON web_resources(country);
CREATE INDEX IF NOT EXISTS idx_web_resources_source_type ON web_resources(source_type);
CREATE INDEX IF NOT EXISTS idx_web_resources_content_search ON web_resources USING GIN(to_tsvector('spanish', content));

-- Tabla de relaciones entre recursos web y libros (para recomendaciones)
CREATE TABLE IF NOT EXISTS web_resource_book_relations (
  id SERIAL PRIMARY KEY,
  web_resource_id INTEGER REFERENCES web_resources(id) ON DELETE CASCADE,
  book_id INTEGER REFERENCES knowledge_base(id) ON DELETE CASCADE,
  relation_type TEXT, -- 'related_topic', 'complementary', 'cited', 'example'
  strength INTEGER DEFAULT 50, -- 0-100, qué tan relacionados están
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(web_resource_id, book_id)
);

-- Vista unificada para el cerebro (libros + recursos web)
CREATE OR REPLACE VIEW brain_unified_knowledge AS
SELECT 
  'book' as source_type,
  id,
  title,
  content,
  category,
  author,
  tags,
  slug as identifier,
  read_count as access_count,
  created_at,
  updated_at
FROM knowledge_base
UNION ALL
SELECT 
  'web_resource' as source_type,
  id,
  title,
  content,
  category,
  author,
  tags,
  url as identifier,
  access_count,
  created_at,
  updated_at
FROM web_resources;

-- Función para buscar en todo el cerebro (libros + web resources)
CREATE OR REPLACE FUNCTION search_brain_unified(
  search_query TEXT,
  category_filter TEXT DEFAULT NULL,
  source_type_filter TEXT DEFAULT NULL,
  limit_results INTEGER DEFAULT 10
)
RETURNS TABLE (
  source_type TEXT,
  id INTEGER,
  title TEXT,
  category TEXT,
  author TEXT,
  tags TEXT[],
  identifier TEXT,
  content_preview TEXT,
  relevance_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    buk.source_type,
    buk.id,
    buk.title,
    buk.category,
    buk.author,
    buk.tags,
    buk.identifier,
    LEFT(buk.content, 300) as content_preview,
    ts_rank(
      to_tsvector('spanish', buk.title || ' ' || buk.content),
      plainto_tsquery('spanish', search_query)
    ) as relevance_score
  FROM brain_unified_knowledge buk
  WHERE 
    (category_filter IS NULL OR buk.category = category_filter)
    AND (source_type_filter IS NULL OR buk.source_type = source_type_filter)
    AND (
      to_tsvector('spanish', buk.title || ' ' || buk.content) @@ plainto_tsquery('spanish', search_query)
    )
  ORDER BY relevance_score DESC
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- Función para incrementar contador de acceso a recursos web
CREATE OR REPLACE FUNCTION increment_web_resource_access(resource_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE web_resources 
  SET 
    access_count = access_count + 1,
    last_accessed_at = NOW()
  WHERE id = resource_id
  RETURNING access_count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener recursos web por categoría
CREATE OR REPLACE FUNCTION get_web_resources_by_category(
  category_name TEXT,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id INTEGER,
  url TEXT,
  title TEXT,
  description TEXT,
  category TEXT,
  tags TEXT[],
  author TEXT,
  access_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wr.id,
    wr.url,
    wr.title,
    wr.description,
    wr.category,
    wr.tags,
    wr.author,
    wr.access_count
  FROM web_resources wr
  WHERE wr.category = category_name
  ORDER BY wr.access_count DESC, wr.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener recursos más populares
CREATE OR REPLACE FUNCTION get_popular_web_resources(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id INTEGER,
  url TEXT,
  title TEXT,
  category TEXT,
  access_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wr.id,
    wr.url,
    wr.title,
    wr.category,
    wr.access_count
  FROM web_resources wr
  ORDER BY wr.access_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_web_resources_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER web_resources_update_timestamp
BEFORE UPDATE ON web_resources
FOR EACH ROW
EXECUTE FUNCTION update_web_resources_timestamp();

-- Configuración inicial
INSERT INTO platform_config (key, value, description) VALUES
('brain_web_resources_enabled', 'true', 'Habilita recursos web en el cerebro de la plataforma'),
('brain_unified_search_enabled', 'true', 'Habilita búsqueda unificada en libros y recursos web')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Comentarios para documentación
COMMENT ON TABLE web_resources IS 'Almacena recursos web (artículos, informes, datos) para el cerebro de la plataforma';
COMMENT ON TABLE web_resource_book_relations IS 'Relaciona recursos web con libros para recomendaciones cruzadas';
COMMENT ON VIEW brain_unified_knowledge IS 'Vista unificada de todo el conocimiento (libros + recursos web)';
COMMENT ON FUNCTION search_brain_unified IS 'Búsqueda unificada en todo el cerebro (libros y recursos web)';
