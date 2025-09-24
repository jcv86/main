-- Generar índice completo de la biblioteca con 70 libros organizados por categoría
-- Versión corregida sin funciones de ventana en agregados

-- 1. Verificación inicial del total de libros
SELECT 
    'VERIFICACIÓN INICIAL' as seccion,
    COUNT(*) as total_libros,
    CASE 
        WHEN COUNT(*) = 70 THEN '✅ CORRECTO: 70 libros'
        ELSE '❌ ERROR: Se esperaban 70 libros, encontrados: ' || COUNT(*)
    END as estado
FROM knowledge_base;

-- 2. Estadísticas generales de la biblioteca
SELECT 
    'ESTADÍSTICAS GENERALES' as seccion,
    COUNT(*) as total_libros,
    COUNT(DISTINCT category) as total_categorias,
    COUNT(DISTINCT author) as total_autores,
    SUM(read_count) as total_lecturas,
    ROUND(AVG(LENGTH(content))) as promedio_caracteres,
    ROUND(AVG(LENGTH(content) / 200.0)) as promedio_paginas_estimadas,
    MIN(LENGTH(content)) as min_caracteres,
    MAX(LENGTH(content)) as max_caracteres
FROM knowledge_base;

-- 3. Distribución por categorías
SELECT 
    'DISTRIBUCIÓN POR CATEGORÍAS' as seccion,
    category as categoria,
    COUNT(*) as cantidad_libros,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM knowledge_base)), 1) as porcentaje,
    SUM(read_count) as total_lecturas_categoria,
    ROUND(AVG(LENGTH(content))) as promedio_caracteres,
    ROUND(AVG(LENGTH(content) / 200.0)) as promedio_paginas
FROM knowledge_base 
GROUP BY category 
ORDER BY COUNT(*) DESC;

-- 4. Top 10 libros más populares
WITH libros_populares AS (
    SELECT 
        title,
        author,
        category,
        read_count,
        LENGTH(content) as caracteres,
        CEIL(LENGTH(content) / 200.0) as paginas_estimadas,
        ROW_NUMBER() OVER (ORDER BY read_count DESC) as ranking
    FROM knowledge_base
)
SELECT 
    'TOP 10 LIBROS MÁS POPULARES' as seccion,
    ranking,
    title as titulo,
    author as autor,
    category as categoria,
    read_count as lecturas,
    caracteres,
    paginas_estimadas
FROM libros_populares 
WHERE ranking <= 10;

-- 5. Análisis de autores más prolíficos
SELECT 
    'AUTORES MÁS PROLÍFICOS' as seccion,
    author as autor,
    COUNT(*) as cantidad_libros,
    SUM(read_count) as total_lecturas,
    ROUND(AVG(read_count)) as promedio_lecturas_por_libro,
    STRING_AGG(DISTINCT category, ', ') as categorias
FROM knowledge_base 
GROUP BY author 
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC, SUM(read_count) DESC;

-- 6. Libros por categoría (listado completo)
SELECT 
    'LISTADO COMPLETO POR CATEGORÍA' as seccion,
    category as categoria,
    title as titulo,
    author as autor,
    read_count as lecturas,
    LENGTH(content) as caracteres,
    CEIL(LENGTH(content) / 200.0) as paginas_estimadas,
    CASE 
        WHEN tags IS NOT NULL THEN ARRAY_LENGTH(string_to_array(tags::text, ','), 1)
        ELSE 0
    END as cantidad_tags
FROM knowledge_base 
ORDER BY category, read_count DESC, title;

-- 7. Análisis de contenido y consistencia
SELECT 
    'ANÁLISIS DE CONSISTENCIA' as seccion,
    COUNT(*) as total_libros,
    COUNT(*) FILTER (WHERE LENGTH(content) > 1000) as libros_contenido_completo,
    COUNT(*) FILTER (WHERE LENGTH(content) <= 1000) as libros_contenido_corto,
    COUNT(*) FILTER (WHERE tags IS NOT NULL AND LENGTH(tags::text) > 0) as libros_con_tags,
    COUNT(*) FILTER (WHERE slug IS NOT NULL AND slug != '') as libros_con_slug,
    COUNT(*) FILTER (WHERE read_count > 0) as libros_con_lecturas
FROM knowledge_base;

-- 8. Verificación de integridad de datos
SELECT 
    'VERIFICACIÓN DE INTEGRIDAD' as seccion,
    'Títulos únicos' as verificacion,
    COUNT(*) as total,
    COUNT(DISTINCT title) as unicos,
    CASE 
        WHEN COUNT(*) = COUNT(DISTINCT title) THEN '✅ Sin duplicados'
        ELSE '❌ Hay ' || (COUNT(*) - COUNT(DISTINCT title)) || ' duplicados'
    END as estado
FROM knowledge_base

UNION ALL

SELECT 
    'VERIFICACIÓN DE INTEGRIDAD' as seccion,
    'Slugs únicos' as verificacion,
    COUNT(*) as total,
    COUNT(DISTINCT slug) as unicos,
    CASE 
        WHEN COUNT(*) = COUNT(DISTINCT slug) THEN '✅ Sin duplicados'
        ELSE '❌ Hay ' || (COUNT(*) - COUNT(DISTINCT slug)) || ' duplicados'
    END as estado
FROM knowledge_base

UNION ALL

SELECT 
    'VERIFICACIÓN DE INTEGRIDAD' as seccion,
    'Contenido no vacío' as verificacion,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE content IS NOT NULL AND LENGTH(TRIM(content)) > 0) as unicos,
    CASE 
        WHEN COUNT(*) = COUNT(*) FILTER (WHERE content IS NOT NULL AND LENGTH(TRIM(content)) > 0) THEN '✅ Todo el contenido válido'
        ELSE '❌ Hay contenido vacío'
    END as estado
FROM knowledge_base;

-- 9. Resumen final
SELECT 
    'RESUMEN FINAL' as seccion,
    '📚 BIBLIOTECA DE DESARROLLO PROFESIONAL' as titulo,
    COUNT(*) as total_libros,
    COUNT(DISTINCT category) as categorias,
    COUNT(DISTINCT author) as autores,
    SUM(read_count) as lecturas_totales,
    ROUND(SUM(LENGTH(content)) / 1000.0) as total_kb_contenido,
    ROUND(SUM(LENGTH(content) / 200.0)) as total_paginas_estimadas
FROM knowledge_base;
