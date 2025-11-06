-- Script 355 Fixed: Verificar y crear función match_knowledge_base para búsqueda semántica
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
        RAISE NOTICE '✅ Columna embedding agregada a knowledge_base';
    ELSE
        RAISE NOTICE '✅ Columna embedding ya existe en knowledge_base';
    END IF;
END $$;

-- 3. ELIMINAR la función existente si tiene un tipo de retorno diferente
DROP FUNCTION IF EXISTS match_knowledge_base(vector, float, int);

-- 4. Crear la función de búsqueda semántica con el tipo correcto
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
        COALESCE(kb.source_type, 'book') as source_type,
        1 - (kb.embedding <=> query_embedding) as similarity
    FROM knowledge_base kb
    WHERE 
        kb.embedding IS NOT NULL
        AND 1 - (kb.embedding <=> query_embedding) > match_threshold
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 5. Crear índice para búsquedas más rápidas si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'knowledge_base_embedding_idx'
    ) THEN
        CREATE INDEX knowledge_base_embedding_idx ON knowledge_base 
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
        RAISE NOTICE '✅ Índice de embedding creado en knowledge_base';
    ELSE
        RAISE NOTICE '✅ Índice de embedding ya existe en knowledge_base';
    END IF;
END $$;

-- 6. Mostrar estadísticas de embeddings
SELECT 
    '📊 ESTADÍSTICAS DE EMBEDDINGS' as seccion,
    COUNT(*) as total_registros,
    COUNT(embedding) as con_embedding,
    COUNT(*) - COUNT(embedding) as sin_embedding,
    ROUND(100.0 * COUNT(embedding) / NULLIF(COUNT(*), 0), 2) as porcentaje_con_embedding
FROM knowledge_base;

-- 7. Mostrar desglose por tipo de fuente
SELECT 
    '📚 DESGLOSE POR TIPO' as seccion,
    COALESCE(source_type, 'book') as tipo,
    COUNT(*) as total,
    COUNT(embedding) as con_embedding,
    COUNT(*) - COUNT(embedding) as sin_embedding
FROM knowledge_base
GROUP BY source_type
ORDER BY total DESC;

-- 8. Mostrar libros sin embedding (primeros 20 más largos)
SELECT 
    '❌ LIBROS SIN EMBEDDING (Top 20)' as seccion,
    title,
    author,
    category,
    LENGTH(content) as caracteres,
    COALESCE(source_type, 'book') as tipo
FROM knowledge_base
WHERE embedding IS NULL
ORDER BY LENGTH(content) DESC
LIMIT 20;

-- 9. Mostrar libros con embedding (primeros 10)
SELECT 
    '✅ LIBROS CON EMBEDDING (Sample)' as seccion,
    title,
    author,
    category,
    LENGTH(content) as caracteres
FROM knowledge_base
WHERE embedding IS NOT NULL
ORDER BY id
LIMIT 10;

-- 10. Resumen final
SELECT 
    '🎯 RESUMEN FINAL' as seccion,
    'Función match_knowledge_base recreada exitosamente' as status,
    (SELECT COUNT(*) FROM knowledge_base WHERE embedding IS NOT NULL) as embeddings_listos,
    (SELECT COUNT(*) FROM knowledge_base WHERE embedding IS NULL) as embeddings_pendientes,
    CASE 
        WHEN (SELECT COUNT(*) FROM knowledge_base WHERE embedding IS NOT NULL) > 0 
        THEN '✅ Puedes usar /cerebro ahora'
        ELSE '⚠️ Genera embeddings en /admin/embeddings primero'
    END as siguiente_paso;
