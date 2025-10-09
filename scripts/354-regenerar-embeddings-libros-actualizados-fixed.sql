-- Script 354: Regenerar Embeddings para Libros Actualizados (CORREGIDO)
-- Este script trabaja con la estructura real: knowledge_base.embedding y web_resources.embedding

-- 1. Análisis inicial
DO $$
BEGIN
    RAISE NOTICE '=== ANÁLISIS DE ESTADO ACTUAL ===';
    RAISE NOTICE '';
END $$;

-- Verificar total de libros y embeddings
SELECT 
    'Total de libros' as metrica,
    COUNT(*) as cantidad
FROM knowledge_base
UNION ALL
SELECT 
    'Libros con embedding' as metrica,
    COUNT(*) FILTER (WHERE embedding IS NOT NULL) as cantidad
FROM knowledge_base
UNION ALL
SELECT 
    'Libros sin embedding' as metrica,
    COUNT(*) FILTER (WHERE embedding IS NULL) as cantidad
FROM knowledge_base
UNION ALL
SELECT 
    'Libros con contenido completo (20k+)' as metrica,
    COUNT(*) FILTER (WHERE LENGTH(content) >= 20000) as cantidad
FROM knowledge_base
UNION ALL
SELECT 
    'Libros completos SIN embedding' as metrica,
    COUNT(*) FILTER (WHERE LENGTH(content) >= 20000 AND embedding IS NULL) as cantidad
FROM knowledge_base;

-- 2. Listar libros actualizados recientemente
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== LIBROS ACTUALIZADOS RECIENTEMENTE ===';
    RAISE NOTICE '';
END $$;

SELECT 
    id,
    title,
    LENGTH(content) as chars,
    CASE 
        WHEN embedding IS NULL THEN '❌ Sin embedding'
        ELSE '✅ Con embedding'
    END as estado_embedding,
    updated_at::date as actualizado
FROM knowledge_base
WHERE updated_at > NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC
LIMIT 20;

-- 3. Identificar libros prioritarios sin embedding
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== TOP 30 LIBROS PRIORITARIOS SIN EMBEDDING ===';
    RAISE NOTICE '';
END $$;

SELECT 
    id,
    title,
    category,
    LENGTH(content) as chars,
    CASE 
        WHEN LENGTH(content) >= 25000 THEN '🟢 Muy completo'
        WHEN LENGTH(content) >= 20000 THEN '🟢 Completo'
        WHEN LENGTH(content) >= 15000 THEN '🟡 Avanzado'
        WHEN LENGTH(content) >= 10000 THEN '🟡 Básico'
        ELSE '🔴 Incompleto'
    END as nivel_contenido
FROM knowledge_base
WHERE embedding IS NULL
ORDER BY 
    LENGTH(content) DESC,
    read_count DESC NULLS LAST
LIMIT 30;

-- 4. Limpiar embeddings de libros actualizados (preparar para regenerar)
DO $$
DECLARE
    v_cleared_count INTEGER := 0;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== LIMPIEZA DE EMBEDDINGS DESACTUALIZADOS ===';
    RAISE NOTICE '';
    
    -- Limpiar embeddings de libros actualizados en últimos 7 días
    UPDATE knowledge_base
    SET embedding = NULL
    WHERE updated_at > NOW() - INTERVAL '7 days'
      AND embedding IS NOT NULL;
    
    GET DIAGNOSTICS v_cleared_count = ROW_COUNT;
    
    RAISE NOTICE 'Embeddings limpiados de libros actualizados: %', v_cleared_count;
    RAISE NOTICE 'Estos libros necesitarán regenerar sus embeddings.';
END $$;

-- 5. Verificar recursos web
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== ESTADO DE RECURSOS WEB ===';
    RAISE NOTICE '';
END $$;

SELECT 
    'Total recursos web' as metrica,
    COUNT(*) as cantidad
FROM web_resources
UNION ALL
SELECT 
    'Con embedding' as metrica,
    COUNT(*) FILTER (WHERE embedding IS NOT NULL) as cantidad
FROM web_resources
UNION ALL
SELECT 
    'Sin embedding' as metrica,
    COUNT(*) FILTER (WHERE embedding IS NULL) as cantidad
FROM web_resources;

-- 6. Resumen final y recomendaciones
DO $$
DECLARE
    v_books_total INTEGER;
    v_books_without_embedding INTEGER;
    v_books_complete_without_embedding INTEGER;
    v_resources_without_embedding INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== RESUMEN FINAL ===';
    RAISE NOTICE '';
    
    SELECT COUNT(*) INTO v_books_total FROM knowledge_base;
    SELECT COUNT(*) INTO v_books_without_embedding FROM knowledge_base WHERE embedding IS NULL;
    SELECT COUNT(*) INTO v_books_complete_without_embedding FROM knowledge_base WHERE embedding IS NULL AND LENGTH(content) >= 20000;
    SELECT COUNT(*) INTO v_resources_without_embedding FROM web_resources WHERE embedding IS NULL;
    
    RAISE NOTICE 'Total de libros: %', v_books_total;
    RAISE NOTICE 'Libros sin embedding: %', v_books_without_embedding;
    RAISE NOTICE 'Libros completos (20k+) sin embedding: % 🔴 CRÍTICO', v_books_complete_without_embedding;
    RAISE NOTICE 'Recursos web sin embedding: %', v_resources_without_embedding;
    RAISE NOTICE '';
    RAISE NOTICE '✅ Script completado exitosamente.';
    RAISE NOTICE '';
    RAISE NOTICE '📋 PRÓXIMOS PASOS:';
    RAISE NOTICE '1. Ir a /admin/embeddings';
    RAISE NOTICE '2. Click en "Generate All Missing Embeddings"';
    RAISE NOTICE '3. Esperar generación (puede tardar 10-20 min)';
    RAISE NOTICE '4. Probar en /cerebro-avanzado';
    RAISE NOTICE '';
END $$;
