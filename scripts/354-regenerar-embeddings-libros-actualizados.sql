-- Regenerar embeddings para libros recientemente expandidos
-- Este script identifica libros con contenido actualizado pero embeddings desactualizados

-- 1. Identificar libros que necesitan nuevos embeddings
SELECT 
    id,
    title,
    LENGTH(content) as char_count,
    updated_at,
    CASE 
        WHEN embedding IS NULL THEN 'Sin embedding'
        WHEN LENGTH(content) > 15000 AND updated_at > NOW() - INTERVAL '7 days' THEN 'Necesita actualización'
        ELSE 'OK'
    END as embedding_status
FROM knowledge_base
WHERE 
    LENGTH(content) > 15000 
    AND (
        embedding IS NULL 
        OR updated_at > NOW() - INTERVAL '7 days'
    )
ORDER BY LENGTH(content) DESC, updated_at DESC;

-- 2. Limpiar embeddings antiguos de libros actualizados recientemente
UPDATE knowledge_base
SET embedding = NULL
WHERE 
    LENGTH(content) > 15000 
    AND updated_at > NOW() - INTERVAL '7 days'
    AND embedding IS NOT NULL;

-- 3. Verificar total de items que necesitan embeddings
SELECT 
    'Libros' as tipo,
    COUNT(*) FILTER (WHERE embedding IS NULL) as sin_embeddings,
    COUNT(*) FILTER (WHERE embedding IS NOT NULL) as con_embeddings,
    COUNT(*) as total,
    ROUND(
        100.0 * COUNT(*) FILTER (WHERE embedding IS NOT NULL) / NULLIF(COUNT(*), 0),
        2
    ) as porcentaje_completo
FROM knowledge_base
WHERE LENGTH(content) > 5000

UNION ALL

SELECT 
    'Web Resources' as tipo,
    COUNT(*) FILTER (WHERE embedding IS NULL) as sin_embeddings,
    COUNT(*) FILTER (WHERE embedding IS NOT NULL) as con_embeddings,
    COUNT(*) as total,
    ROUND(
        100.0 * COUNT(*) FILTER (WHERE embedding IS NOT NULL) / NULLIF(COUNT(*), 0),
        2
    ) as porcentaje_completo
FROM web_resources;

-- 4. Listar próximos libros prioritarios para embeddings
SELECT 
    id,
    title,
    category,
    LENGTH(content) as caracteres,
    read_count,
    updated_at
FROM knowledge_base
WHERE embedding IS NULL
ORDER BY 
    read_count DESC,
    LENGTH(content) DESC,
    updated_at DESC
LIMIT 20;
