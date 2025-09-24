-- Reporte detallado de la biblioteca con formato mejorado
-- Incluye verificación de consistencia en cálculo de páginas

-- Mostrar estadísticas detalladas en formato tabular
SELECT 
    '📊 ESTADÍSTICAS DETALLADAS' as seccion,
    category as categoria,
    COUNT(*) as libros,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM knowledge_base)), 1) || '%' as porcentaje,
    SUM(read_count) as lecturas,
    MIN(LENGTH(content)) as min_chars,
    MAX(LENGTH(content)) as max_chars,
    ROUND(AVG(LENGTH(content))) as avg_chars,
    MIN(CEIL(LENGTH(content) / 200.0)) as min_paginas,
    MAX(CEIL(LENGTH(content) / 200.0)) as max_paginas,
    ROUND(AVG(CEIL(LENGTH(content) / 200.0))) as avg_paginas
FROM knowledge_base 
GROUP BY category 
ORDER BY COUNT(*) DESC;

-- Verificación de consistencia en cálculo de páginas
SELECT 
    '🔍 VERIFICACIÓN PÁGINAS' as seccion,
    title as libro,
    LENGTH(content) as caracteres,
    CEIL(LENGTH(content) / 200.0) as paginas_formula_actual,
    ROUND(LENGTH(content) / 250.0) as paginas_alternativa_250,
    ROUND(LENGTH(content) / 300.0) as paginas_alternativa_300,
    CASE 
        WHEN LENGTH(content) < 1000 THEN '⚠️ Contenido corto'
        WHEN LENGTH(content) > 10000 THEN '📖 Contenido extenso'
        ELSE '✅ Contenido normal'
    END as estado_contenido
FROM knowledge_base 
ORDER BY LENGTH(content) DESC
LIMIT 10;

-- Listado completo por categoría
SELECT 
    '📚 LISTADO POR CATEGORÍA' as seccion,
    category as categoria,
    title as titulo,
    author as autor,
    read_count as lecturas,
    LENGTH(content) as caracteres,
    CEIL(LENGTH(content) / 200.0) as paginas,
    CEIL(LENGTH(content) / 1000.0) as tiempo_lectura_min
FROM knowledge_base 
ORDER BY category, read_count DESC;

-- Análisis de popularidad
SELECT 
    '⭐ ANÁLISIS DE POPULARIDAD' as seccion,
    CASE 
        WHEN read_count >= 5000 THEN 'Muy Popular (5000+)'
        WHEN read_count >= 3000 THEN 'Popular (3000-4999)'
        WHEN read_count >= 1000 THEN 'Moderado (1000-2999)'
        ELSE 'Nuevo (0-999)'
    END as nivel_popularidad,
    COUNT(*) as cantidad_libros,
    ROUND(AVG(read_count)) as promedio_lecturas,
    ROUND(AVG(LENGTH(content))) as promedio_caracteres
FROM knowledge_base 
GROUP BY 
    CASE 
        WHEN read_count >= 5000 THEN 'Muy Popular (5000+)'
        WHEN read_count >= 3000 THEN 'Popular (3000-4999)'
        WHEN read_count >= 1000 THEN 'Moderado (1000-2999)'
        ELSE 'Nuevo (0-999)'
    END
ORDER BY MIN(read_count) DESC;

-- Resumen ejecutivo
SELECT 
    '📋 RESUMEN EJECUTIVO' as seccion,
    'Total de libros' as metrica,
    COUNT(*)::text as valor
FROM knowledge_base
UNION ALL
SELECT 
    '📋 RESUMEN EJECUTIVO' as seccion,
    'Categorías diferentes' as metrica,
    COUNT(DISTINCT category)::text as valor
FROM knowledge_base
UNION ALL
SELECT 
    '📋 RESUMEN EJECUTIVO' as seccion,
    'Autores únicos' as metrica,
    COUNT(DISTINCT author)::text as valor
FROM knowledge_base
UNION ALL
SELECT 
    '📋 RESUMEN EJECUTIVO' as seccion,
    'Total de lecturas' as metrica,
    SUM(read_count)::text as valor
FROM knowledge_base
UNION ALL
SELECT 
    '📋 RESUMEN EJECUTIVO' as seccion,
    'Promedio caracteres por libro' as metrica,
    ROUND(AVG(LENGTH(content)))::text as valor
FROM knowledge_base
UNION ALL
SELECT 
    '📋 RESUMEN EJECUTIVO' as seccion,
    'Total páginas estimadas' as metrica,
    SUM(CEIL(LENGTH(content) / 200.0))::text as valor
FROM knowledge_base;
