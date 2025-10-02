-- Verificar el estado EXACTO actual de cada libro en la base de datos
-- Para ver cuáles están completos y cuáles necesitan expansión

-- 1. Mostrar todos los libros con su longitud actual
SELECT 
    '📚 LISTADO COMPLETO DE LIBROS' as seccion,
    id,
    title as titulo,
    author as autor,
    category as categoria,
    LENGTH(content) as caracteres_actuales,
    ROUND(LENGTH(content) / 2000.0, 1) as paginas_estimadas,
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '✅ COMPLETO - No tocar'
        WHEN LENGTH(content) >= 30000 THEN '🟡 BUENO - Revisar si expandir'
        WHEN LENGTH(content) >= 15000 THEN '🟠 MEDIO - Necesita expansión'
        WHEN LENGTH(content) >= 5000 THEN '🔴 CORTO - Urgente expandir'
        ELSE '⚠️ MUY CORTO - Crítico expandir'
    END as estado,
    SUBSTRING(content, 1, 100) || '...' as preview_contenido
FROM knowledge_base
ORDER BY LENGTH(content) DESC;

-- 2. Resumen por categorías
SELECT 
    '📊 RESUMEN POR CATEGORÍA' as seccion,
    category as categoria,
    COUNT(*) as total_libros,
    ROUND(AVG(LENGTH(content))) as promedio_caracteres,
    MIN(LENGTH(content)) as minimo,
    MAX(LENGTH(content)) as maximo,
    SUM(CASE WHEN LENGTH(content) >= 50000 THEN 1 ELSE 0 END) as completos,
    SUM(CASE WHEN LENGTH(content) < 50000 AND LENGTH(content) >= 30000 THEN 1 ELSE 0 END) as buenos,
    SUM(CASE WHEN LENGTH(content) < 30000 AND LENGTH(content) >= 15000 THEN 1 ELSE 0 END) as medios,
    SUM(CASE WHEN LENGTH(content) < 15000 THEN 1 ELSE 0 END) as necesitan_expansion
FROM knowledge_base
GROUP BY category
ORDER BY promedio_caracteres DESC;

-- 3. Los 20 libros más cortos que NECESITAN expansión urgente
SELECT 
    '🔴 TOP 20 LIBROS MÁS CORTOS - EXPANDIR URGENTE' as seccion,
    id,
    title as titulo,
    author as autor,
    category as categoria,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content) / 2000.0, 1) as paginas,
    50000 - LENGTH(content) as caracteres_a_agregar
FROM knowledge_base
WHERE LENGTH(content) < 30000
ORDER BY LENGTH(content) ASC
LIMIT 20;

-- 4. Libros que YA están completos (NO tocar)
SELECT 
    '✅ LIBROS YA COMPLETOS (50K+ caracteres) - NO MODIFICAR' as seccion,
    id,
    title as titulo,
    author as autor,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content) / 2000.0, 1) as paginas
FROM knowledge_base
WHERE LENGTH(content) >= 50000
ORDER BY LENGTH(content) DESC;

-- 5. Estadísticas generales
SELECT 
    '📈 ESTADÍSTICAS GENERALES' as seccion,
    'Total de libros' as metrica,
    COUNT(*)::text as valor
FROM knowledge_base
UNION ALL
SELECT 
    '📈 ESTADÍSTICAS GENERALES',
    'Libros completos (50K+)',
    COUNT(*)::text
FROM knowledge_base
WHERE LENGTH(content) >= 50000
UNION ALL
SELECT 
    '📈 ESTADÍSTICAS GENERALES',
    'Libros buenos (30K-50K)',
    COUNT(*)::text
FROM knowledge_base
WHERE LENGTH(content) >= 30000 AND LENGTH(content) < 50000
UNION ALL
SELECT 
    '📈 ESTADÍSTICAS GENERALES',
    'Libros medios (15K-30K)',
    COUNT(*)::text
FROM knowledge_base
WHERE LENGTH(content) >= 15000 AND LENGTH(content) < 30000
UNION ALL
SELECT 
    '📈 ESTADÍSTICAS GENERALES',
    'Libros cortos (<15K) - URGENTE',
    COUNT(*)::text
FROM knowledge_base
WHERE LENGTH(content) < 15000
UNION ALL
SELECT 
    '📈 ESTADÍSTICAS GENERALES',
    'Promedio de caracteres por libro',
    ROUND(AVG(LENGTH(content)))::text
FROM knowledge_base;
