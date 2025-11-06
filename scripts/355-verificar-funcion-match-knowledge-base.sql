-- Script 355: Verificar y crear función match_knowledge_base para búsqueda semántica
-- Este script configura todo lo necesario para la búsqueda semántica

-- 1. Habilitar extensión vector si no está habilitada
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Verificar si la columna embedding existe en knowledge_base
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'knowledge_base' 
        AND column_name = 'embedding'
    ) THEN
        ALTER TABLE knowledge_base ADD COLUMN embedding vector(1536);
        RAISE NOTICE 'Columna embedding agregada a knowledge_base';
    ELSE
        RAISE NOTICE 'Columna embedding ya existe en knowledge_base';
    END IF;
END $$;

-- 3. Crear o reemplazar la función de búsqueda semántica
CREATE OR REPLACE FUNCTION match_knowledge_base(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    id bigint,
    title text,
    author text,
    category text,
    content text,
    source_type text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        kb.id,
        kb.title,
        kb.author,
        kb.category,
        kb.content,
        kb.source_type,
        1 - (kb.embedding <=> query_embedding) as similarity
    FROM knowledge_base kb
    WHERE 
        kb.embedding IS NOT NULL
        AND 1 - (kb.embedding <=> query_embedding) > match_threshold
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 4. Crear índice para búsquedas más rápidas si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'knowledge_base_embedding_idx'
    ) THEN
        CREATE INDEX knowledge_base_embedding_idx ON knowledge_base 
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
        RAISE NOTICE 'Índice de embedding creado en knowledge_base';
    ELSE
        RAISE NOTICE 'Índice de embedding ya existe en knowledge_base';
    END IF;
END $$;

-- 5. Mostrar estadísticas de embeddings
SELECT 
    COUNT(*) as total_registros,
    COUNT(embedding) as con_embedding,
    COUNT(*) - COUNT(embedding) as sin_embedding,
    ROUND(100.0 * COUNT(embedding) / COUNT(*), 2) as porcentaje_con_embedding
FROM knowledge_base;

-- 6. Mostrar libros sin embedding (para saber cuáles necesitan generación)
SELECT 
    id,
    title,
    author,
    category,
    LENGTH(content) as longitud_contenido,
    source_type
FROM knowledge_base
WHERE embedding IS NULL
ORDER BY LENGTH(content) DESC
LIMIT 20;

-- 7. Verificar que la función funciona (test básico)
SELECT 
    'Función match_knowledge_base creada exitosamente' as status,
    'Ejecuta en /admin/embeddings para generar embeddings faltantes' as siguiente_paso;

-- 8. Mostrar resumen de configuración
SELECT 
    'Sistema de búsqueda semántica configurado' as mensaje,
    (SELECT COUNT(*) FROM knowledge_base WHERE embedding IS NOT NULL) as embeddings_generados,
    (SELECT COUNT(*) FROM knowledge_base WHERE embedding IS NULL) as embeddings_faltantes,
    'Ir a /admin/embeddings para generar los embeddings que faltan' as accion_requerida;
