-- Script 354: Regenerar Embeddings para Libros Actualizados
-- Este script prepara la base de datos para regenerar embeddings después de actualizar contenido

-- 1. Identificar libros actualizados recientemente (últimos 7 días)
DO $$
BEGIN
    RAISE NOTICE '=== ANÁLISIS DE LIBROS ACTUALIZADOS ===';
    RAISE NOTICE '';
END $$;

SELECT 
    'Total de libros en knowledge_base' as descripcion,
    COUNT(*) as cantidad
FROM knowledge_base
UNION ALL
SELECT 
    'Libros actualizados en últimos 7 días' as descripcion,
    COUNT(*) as cantidad
FROM knowledge_base
WHERE updated_at > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 
    'Libros con contenido largo (20k+)' as descripcion,
    COUNT(*) as cantidad
FROM knowledge_base
WHERE LENGTH(content) >= 20000;

-- 2. Listar los 20 libros más recientemente actualizados
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== TOP 20 LIBROS ACTUALIZADOS RECIENTEMENTE ===';
    RAISE NOTICE '';
END $$;

SELECT 
    id,
    title,
    LENGTH(content) as content_length,
    updated_at::date as ultima_actualizacion,
    CASE 
        WHEN LENGTH(content) >= 25000 THEN '✅ Muy Completo'
        WHEN LENGTH(content) >= 20000 THEN '✅ Completo'
        WHEN LENGTH(content) >= 15000 THEN '⚠️ Avanzado'
        WHEN LENGTH(content) >= 10000 THEN '⚠️ Básico'
        ELSE '❌ Incompleto'
    END as estado
FROM knowledge_base
ORDER BY updated_at DESC
LIMIT 20;

-- 3. Verificar estado de embeddings existentes
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== ESTADO DE EMBEDDINGS ===';
    RAISE NOTICE '';
END $$;

SELECT 
    'Total de embeddings en brain_embeddings' as descripcion,
    COUNT(*) as cantidad
FROM brain_embeddings
WHERE embedding IS NOT NULL
UNION ALL
SELECT 
    'Embeddings de libros (books)' as descripcion,
    COUNT(*) as cantidad
FROM brain_embeddings
WHERE source_type = 'book' AND embedding IS NOT NULL
UNION ALL
SELECT 
    'Embeddings de recursos web' as descripcion,
    COUNT(*) as cantidad
FROM brain_embeddings
WHERE source_type = 'web_resource' AND embedding IS NOT NULL;

-- 4. Identificar libros que necesitan nuevos embeddings
-- (actualizados después de la fecha del embedding)
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== LIBROS QUE NECESITAN REGENERAR EMBEDDINGS ===';
    RAISE NOTICE '';
END $$;

SELECT 
    kb.id,
    kb.title,
    LENGTH(kb.content) as content_length,
    kb.updated_at::date as libro_actualizado,
    COALESCE(be.created_at::date, 'Sin embedding') as embedding_creado,
    CASE 
        WHEN be.id IS NULL THEN '❌ Sin embedding'
        WHEN kb.updated_at > be.created_at THEN '⚠️ Desactualizado'
        ELSE '✅ Actualizado'
    END as estado_embedding
FROM knowledge_base kb
LEFT JOIN brain_embeddings be ON be.source_id = kb.id AND be.source_type = 'book'
WHERE kb.updated_at > NOW() - INTERVAL '7 days'
   OR be.id IS NULL
ORDER BY kb.updated_at DESC
LIMIT 30;

-- 5. Eliminar embeddings desactualizados de libros modificados
-- IMPORTANTE: Esto preparará para regenerar embeddings frescos
DO $$
DECLARE
    deleted_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== LIMPIEZA DE EMBEDDINGS DESACTUALIZADOS ===';
    RAISE NOTICE '';
    
    -- Eliminar embeddings donde el libro se actualizó después
    DELETE FROM brain_embeddings be
    USING knowledge_base kb
    WHERE be.source_type = 'book'
      AND be.source_id = kb.id
      AND kb.updated_at > be.created_at;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RAISE NOTICE 'Embeddings desactualizados eliminados: %', deleted_count;
    RAISE NOTICE 'Estos libros ahora están listos para regenerar embeddings.';
END $$;

-- 6. Resumen final
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== RESUMEN FINAL ===';
    RAISE NOTICE '';
END $$;

SELECT 
    'Libros sin embedding' as categoria,
    COUNT(*) as cantidad,
    '🔴 ALTA' as prioridad
FROM knowledge_base kb
LEFT JOIN brain_embeddings be ON be.source_id = kb.id AND be.source_type = 'book'
WHERE be.id IS NULL
UNION ALL
SELECT 
    'Libros con contenido 20k+ sin embedding' as categoria,
    COUNT(*) as cantidad,
    '🔴 CRÍTICA' as prioridad
FROM knowledge_base kb
LEFT JOIN brain_embeddings be ON be.source_id = kb.id AND be.source_type = 'book'
WHERE be.id IS NULL AND LENGTH(kb.content) >= 20000
UNION ALL
SELECT 
    'Recursos web sin embedding' as categoria,
    COUNT(*) as cantidad,
    '🟡 MEDIA' as prioridad
FROM web_resources wr
LEFT JOIN brain_embeddings be ON be.source_id = wr.id AND be.source_type = 'web_resource'
WHERE be.id IS NULL;

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Script completado.';
    RAISE NOTICE '';
    RAISE NOTICE 'PRÓXIMOS PASOS:';
    RAISE NOTICE '1. Ir a /admin/embeddings en la aplicación';
    RAISE NOTICE '2. Hacer clic en "Generate All Missing Embeddings"';
    RAISE NOTICE '3. Esperar a que se generen todos los embeddings (puede tardar varios minutos)';
    RAISE NOTICE '4. Probar el cerebro avanzado en /cerebro-avanzado';
    RAISE NOTICE '';
END $$;
