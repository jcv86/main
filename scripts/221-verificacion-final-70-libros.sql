-- Script de verificación final para confirmar que tenemos exactamente 70 libros
-- y mostrar un resumen completo de la biblioteca

-- Verificación principal
SELECT 
    '🔍 VERIFICACIÓN PRINCIPAL' as seccion,
    COUNT(*) as total_libros,
    CASE 
        WHEN COUNT(*) = 70 THEN '✅ CORRECTO: Biblioteca completa con 70 libros'
        WHEN COUNT(*) < 70 THEN '⚠️ FALTAN: ' || (70 - COUNT(*)) || ' libros para completar 70'
        ELSE '❌ EXCESO: ' || (COUNT(*) - 70) || ' libros de más'
    END as estado_verificacion
FROM knowledge_base;

-- Conteo por categoría
SELECT 
    '📊 DISTRIBUCIÓN POR CATEGORÍAS' as seccion,
    category as categoria,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM knowledge_base), 1) || '%' as porcentaje
FROM knowledge_base 
GROUP BY category 
ORDER BY COUNT(*) DESC;

-- Verificación de integridad de datos
SELECT 
    '🔧 INTEGRIDAD DE DATOS' as seccion,
    COUNT(*) as total_registros,
    COUNT(CASE WHEN title IS NOT NULL AND title != '' THEN 1 END) as titulos_validos,
    COUNT(CASE WHEN author IS NOT NULL AND author != '' THEN 1 END) as autores_validos,
    COUNT(CASE WHEN category IS NOT NULL AND category != '' THEN 1 END) as categorias_validas,
    COUNT(CASE WHEN content IS NOT NULL AND LENGTH(content) > 500 THEN 1 END) as contenido_valido,
    COUNT(CASE WHEN slug IS NOT NULL AND slug != '' THEN 1 END) as slugs_validos
FROM knowledge_base;

-- Top 5 por categoría más poblada
WITH top_categoria AS (
    SELECT category 
    FROM knowledge_base 
    GROUP BY category 
    ORDER BY COUNT(*) DESC 
    LIMIT 1
)
SELECT 
    '🏆 TOP 5 DE LA CATEGORÍA MÁS POBLADA (' || tc.category || ')' as seccion,
    kb.title as titulo,
    kb.author as autor,
    kb.read_count as lecturas,
    LENGTH(kb.content) as caracteres
FROM knowledge_base kb, top_categoria tc
WHERE kb.category = tc.category
ORDER BY kb.read_count DESC
LIMIT 5;

-- Estadísticas generales
SELECT 
    '📈 ESTADÍSTICAS GENERALES' as seccion,
    COUNT(DISTINCT category) as total_categorias,
    COUNT(DISTINCT author) as total_autores,
    ROUND(AVG(LENGTH(content))) as promedio_caracteres,
    ROUND(AVG(read_count)) as promedio_lecturas,
    MIN(LENGTH(content)) as contenido_mas_corto,
    MAX(LENGTH(content)) as contenido_mas_largo,
    SUM(read_count) as total_lecturas_registradas
FROM knowledge_base;

-- Libros únicos por slug (verificar duplicados)
SELECT 
    '🔍 VERIFICACIÓN DE DUPLICADOS' as seccion,
    COUNT(*) as total_registros,
    COUNT(DISTINCT slug) as slugs_unicos,
    COUNT(DISTINCT title) as titulos_unicos,
    CASE 
        WHEN COUNT(*) = COUNT(DISTINCT slug) THEN '✅ Sin duplicados por slug'
        ELSE '⚠️ Posibles duplicados: ' || (COUNT(*) - COUNT(DISTINCT slug)) || ' registros'
    END as estado_duplicados
FROM knowledge_base;

-- Resumen final con emoji de estado
SELECT 
    '🎯 RESUMEN FINAL' as seccion,
    CASE 
        WHEN COUNT(*) = 70 AND 
             COUNT(CASE WHEN title IS NOT NULL AND title != '' THEN 1 END) = 70 AND
             COUNT(CASE WHEN content IS NOT NULL AND LENGTH(content) > 500 THEN 1 END) = 70 AND
             COUNT(DISTINCT slug) = 70
        THEN '🎉 BIBLIOTECA COMPLETA Y VERIFICADA - 70 libros listos para usar'
        ELSE '⚠️ BIBLIOTECA REQUIERE ATENCIÓN - Revisar datos faltantes o duplicados'
    END as estado_final,
    COUNT(*) as libros_totales,
    COUNT(DISTINCT category) as categorias_totales,
    COUNT(DISTINCT author) as autores_totales,
    ROUND(SUM(LENGTH(content)) / 1000000.0, 2) || ' MB' as contenido_total_estimado
FROM knowledge_base;
