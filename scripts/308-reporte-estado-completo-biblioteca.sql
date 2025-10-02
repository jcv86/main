-- ═══════════════════════════════════════════════════════════════════════════
-- REPORTE COMPLETO DEL ESTADO DE LA BIBLIOTECA
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Resumen general por categoría de longitud
SELECT 
    '📊 RESUMEN GENERAL POR LONGITUD' as reporte,
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '🟢 Excelente (50k+)'
        WHEN LENGTH(content) >= 35000 THEN '🟡 Muy Bueno (35-50k)'
        WHEN LENGTH(content) >= 20000 THEN '🟠 Bueno (20-35k)'
        WHEN LENGTH(content) >= 10000 THEN '🔴 Regular (10-20k)'
        ELSE '⚫ Corto (<10k)'
    END as categoria,
    COUNT(*) as cantidad_libros,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres,
    ROUND(AVG(LENGTH(content) / 200.0)::numeric, 1) as promedio_minutos_lectura
FROM knowledge_base
GROUP BY 
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '🟢 Excelente (50k+)'
        WHEN LENGTH(content) >= 35000 THEN '🟡 Muy Bueno (35-50k)'
        WHEN LENGTH(content) >= 20000 THEN '🟠 Bueno (20-35k)'
        WHEN LENGTH(content) >= 10000 THEN '🔴 Regular (10-20k)'
        ELSE '⚫ Corto (<10k)'
    END
ORDER BY 
    CASE 
        WHEN LENGTH(content) >= 50000 THEN 1
        WHEN LENGTH(content) >= 35000 THEN 2
        WHEN LENGTH(content) >= 20000 THEN 3
        WHEN LENGTH(content) >= 10000 THEN 4
        ELSE 5
    END;

-- 2. Top 20 libros más completos
SELECT 
    '📚 TOP 20 LIBROS MÁS COMPLETOS' as reporte,
    title,
    author,
    category,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content) / 200.0, 1) as minutos_lectura,
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '🟢 Excelente'
        WHEN LENGTH(content) >= 35000 THEN '🟡 Muy Bueno'
        WHEN LENGTH(content) >= 20000 THEN '🟠 Bueno'
        ELSE '🔴 Regular'
    END as estado
FROM knowledge_base
ORDER BY LENGTH(content) DESC
LIMIT 20;

-- 3. Libros que necesitan más contenido (menos de 20k caracteres)
SELECT 
    '⚠️ LIBROS QUE NECESITAN EXPANSIÓN (<20k)' as reporte,
    title,
    author,
    category,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content) / 200.0, 1) as minutos_lectura,
    50000 - LENGTH(content) as caracteres_faltantes
FROM knowledge_base
WHERE LENGTH(content) < 20000
ORDER BY LENGTH(content) ASC;

-- 4. Resumen por categoría
SELECT 
    '📑 RESUMEN POR CATEGORÍA' as reporte,
    category,
    COUNT(*) as total_libros,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres,
    MIN(LENGTH(content)) as min_caracteres,
    MAX(LENGTH(content)) as max_caracteres,
    ROUND(AVG(LENGTH(content) / 200.0)::numeric, 1) as promedio_minutos_lectura
FROM knowledge_base
GROUP BY category
ORDER BY promedio_caracteres DESC;

-- 5. Estadísticas generales
SELECT 
    '📈 ESTADÍSTICAS GENERALES' as reporte,
    COUNT(*) as total_libros,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres,
    MIN(LENGTH(content)) as min_caracteres,
    MAX(LENGTH(content)) as max_caracteres,
    SUM(LENGTH(content)) as total_caracteres,
    ROUND(SUM(LENGTH(content) / 200.0)::numeric, 1) as total_horas_lectura,
    COUNT(CASE WHEN LENGTH(content) >= 50000 THEN 1 END) as excelentes,
    COUNT(CASE WHEN LENGTH(content) >= 35000 AND LENGTH(content) < 50000 THEN 1 END) as muy_buenos,
    COUNT(CASE WHEN LENGTH(content) >= 20000 AND LENGTH(content) < 35000 THEN 1 END) as buenos,
    COUNT(CASE WHEN LENGTH(content) < 20000 THEN 1 END) as necesitan_mejora
FROM knowledge_base;

-- 6. Lista completa de todos los libros ordenados por longitud
SELECT 
    '📖 LISTA COMPLETA DE LIBROS' as reporte,
    ROW_NUMBER() OVER (ORDER BY LENGTH(content) DESC) as ranking,
    title,
    author,
    category,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content) / 200.0, 1) as minutos_lectura,
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '🟢 Excelente'
        WHEN LENGTH(content) >= 35000 THEN '🟡 Muy Bueno'
        WHEN LENGTH(content) >= 20000 THEN '🟠 Bueno'
        WHEN LENGTH(content) >= 10000 THEN '🔴 Regular'
        ELSE '⚫ Necesita Expansión'
    END as estado,
    slug
FROM knowledge_base
ORDER BY LENGTH(content) DESC;
