-- Verificar si existe la función de búsqueda semántica
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'match_knowledge_base';

-- Si no existe, crearla
CREATE OR REPLACE FUNCTION match_knowledge_base(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 5
)
RETURNS TABLE (
    id uuid,
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
    WHERE kb.embedding IS NOT NULL
    AND 1 - (kb.embedding <=> query_embedding) > match_threshold
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Verificar índice para búsqueda rápida
CREATE INDEX IF NOT EXISTS knowledge_base_embedding_idx 
ON knowledge_base 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Estadísticas
SELECT 
    COUNT(*) as total_items,
    COUNT(embedding) as items_with_embeddings,
    COUNT(*) - COUNT(embedding) as items_without_embeddings,
    ROUND(100.0 * COUNT(embedding) / NULLIF(COUNT(*), 0), 2) as percentage_complete
FROM knowledge_base;

-- Mostrar algunos ejemplos de contenido
SELECT 
    title,
    category,
    CASE 
        WHEN embedding IS NOT NULL THEN 'Sí'
        ELSE 'No'
    END as tiene_embedding,
    LENGTH(content) as content_length
FROM knowledge_base
ORDER BY RANDOM()
LIMIT 10;
