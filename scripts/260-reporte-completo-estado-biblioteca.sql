-- Reporte Completo del Estado de la Biblioteca
-- Análisis detallado de todos los libros y su estado de completitud

-- 1. RESUMEN EJECUTIVO
SELECT 
    '═══════════════════════════════════════════════════════════' as separador,
    '📊 RESUMEN EJECUTIVO DE LA BIBLIOTECA' as titulo,
    '═══════════════════════════════════════════════════════════' as separador2;

SELECT 
    COUNT(*) as total_libros_biblioteca,
    COUNT(*) FILTER (WHERE LENGTH(content) >= 50000) as "✅ Completos (50K+)",
    COUNT(*) FILTER (WHERE LENGTH(content) >= 35000 AND LENGTH(content) < 50000) as "🟡 Buenos (35K-50K)",
    COUNT(*) FILTER (WHERE LENGTH(content) >= 20000 AND LENGTH(content) < 35000) as "🟠 Medios (20K-35K)",
    COUNT(*) FILTER (WHERE LENGTH(content) < 20000) as "🔴 Cortos (<20K)",
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres,
    ROUND((COUNT(*) FILTER (WHERE LENGTH(content) >= 50000)::numeric / COUNT(*)::numeric * 100), 1) as porcentaje_completos
FROM knowledge_base;

-- 2. DISTRIBUCIÓN POR CATEGORÍA
SELECT 
    '═══════════════════════════════════════════════════════════' as separador,
    '📚 DISTRIBUCIÓN POR CATEGORÍA' as titulo,
    '═══════════════════════════════════════════════════════════' as separador2;

SELECT 
    category as categoria,
    COUNT(*) as total_libros,
    COUNT(*) FILTER (WHERE LENGTH(content) >= 50000) as completos,
    COUNT(*) FILTER (WHERE LENGTH(content) >= 35000 AND LENGTH(content) < 50000) as buenos,
    COUNT(*) FILTER (WHERE LENGTH(content) < 35000) as necesitan_expansion,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres,
    ROUND((COUNT(*) FILTER (WHERE LENGTH(content) >= 50000)::numeric / COUNT(*)::numeric * 100), 1) as "% completos"
FROM knowledge_base
GROUP BY category
ORDER BY COUNT(*) DESC, promedio_caracteres DESC;

-- 3. TOP 20 LIBROS MÁS COMPLETOS
SELECT 
    '═══════════════════════════════════════════════════════════' as separador,
    '🏆 TOP 20 LIBROS MÁS COMPLETOS' as titulo,
    '═══════════════════════════════════════════════════════════' as separador2;

SELECT 
    ROW_NUMBER() OVER (ORDER BY LENGTH(content) DESC) as ranking,
    id,
    title as titulo,
    author as autor,
    category as categoria,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content) / 2500.0, 1) as paginas_estimadas,
    read_count as lecturas,
    '✅' as estado
FROM knowledge_base
ORDER BY LENGTH(content) DESC
LIMIT 20;

-- 4. LIBROS QUE NECESITAN EXPANSIÓN URGENTE
SELECT 
    '═══════════════════════════════════════════════════════════' as separador,
    '🔴 LIBROS QUE NECESITAN EXPANSIÓN (MENORES A 35K)' as titulo,
    '═══════════════════════════════════════════════════════════' as separador2;

SELECT 
    ROW_NUMBER() OVER (ORDER BY LENGTH(content) ASC) as prioridad,
    id,
    title as titulo,
    author as autor,
    category as categoria,
    LENGTH(content) as caracteres_actuales,
    ROUND(LENGTH(content) / 2500.0, 1) as paginas_actuales,
    (50000 - LENGTH(content)) as caracteres_a_agregar,
    CASE 
        WHEN LENGTH(content) < 10000 THEN '🔴 URGENTE'
        WHEN LENGTH(content) < 20000 THEN '🟠 ALTA'
        WHEN LENGTH(content) < 35000 THEN '🟡 MEDIA'
        ELSE '✅ OK'
    END as prioridad_expansion
FROM knowledge_base
WHERE LENGTH(content) < 35000
ORDER BY LENGTH(content) ASC;

-- 5. ANÁLISIS DE CONTENIDO POR RANGOS
SELECT 
    '═══════════════════════════════════════════════════════════' as separador,
    '📈 ANÁLISIS POR RANGOS DE CONTENIDO' as titulo,
    '═══════════════════════════════════════════════════════════' as separador2;

SELECT 
    CASE 
        WHEN LENGTH(content) >= 100000 THEN '🌟 Excepcional (100K+)'
        WHEN LENGTH(content) >= 75000 THEN '⭐ Excelente (75K-100K)'
        WHEN LENGTH(content) >= 50000 THEN '✅ Completo (50K-75K)'
        WHEN LENGTH(content) >= 35000 THEN '🟡 Bueno (35K-50K)'
        WHEN LENGTH(content) >= 20000 THEN '🟠 Medio (20K-35K)'
        WHEN LENGTH(content) >= 10000 THEN '🔴 Corto (10K-20K)'
        ELSE '⚠️ Muy Corto (<10K)'
    END as rango,
    COUNT(*) as cantidad_libros,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1) as porcentaje,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres,
    MIN(LENGTH(content)) as minimo,
    MAX(LENGTH(content)) as maximo
FROM knowledge_base
GROUP BY 
    CASE 
        WHEN LENGTH(content) >= 100000 THEN '🌟 Excepcional (100K+)'
        WHEN LENGTH(content) >= 75000 THEN '⭐ Excelente (75K-100K)'
        WHEN LENGTH(content) >= 50000 THEN '✅ Completo (50K-75K)'
        WHEN LENGTH(content) >= 35000 THEN '🟡 Bueno (35K-50K)'
        WHEN LENGTH(content) >= 20000 THEN '🟠 Medio (20K-35K)'
        WHEN LENGTH(content) >= 10000 THEN '🔴 Corto (10K-20K)'
        ELSE '⚠️ Muy Corto (<10K)'
    END
ORDER BY MIN(LENGTH(content)) DESC;

-- 6. LIBROS ACTUALIZADOS RECIENTEMENTE
SELECT 
    '═══════════════════════════════════════════════════════════' as separador,
    '🆕 LIBROS ACTUALIZADOS RECIENTEMENTE (ÚLTIMAS 24 HORAS)' as titulo,
    '═══════════════════════════════════════════════════════════' as separador2;

SELECT 
    id,
    title as titulo,
    author as autor,
    category as categoria,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content) / 2500.0, 1) as paginas,
    updated_at as actualizado_en,
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '✅ COMPLETO'
        WHEN LENGTH(content) >= 35000 THEN '🟡 BUENO'
        ELSE '🔴 NECESITA MÁS'
    END as estado
FROM knowledge_base
WHERE updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;

-- 7. ESTADÍSTICAS DETALLADAS POR AUTOR
SELECT 
    '═══════════════════════════════════════════════════════════' as separador,
    '👨‍💼 ESTADÍSTICAS POR AUTOR' as titulo,
    '═══════════════════════════════════════════════════════════' as separador2;

SELECT 
    author as autor,
    COUNT(*) as total_libros,
    COUNT(*) FILTER (WHERE LENGTH(content) >= 50000) as libros_completos,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres,
    MIN(LENGTH(content)) as libro_mas_corto,
    MAX(LENGTH(content)) as libro_mas_largo,
    SUM(read_count) as total_lecturas
FROM knowledge_base
GROUP BY author
HAVING COUNT(*) >= 1
ORDER BY COUNT(*) DESC, promedio_caracteres DESC
LIMIT 20;

-- 8. LISTA COMPLETA ALFABÉTICA CON ESTADO
SELECT 
    '═══════════════════════════════════════════════════════════' as separador,
    '📖 ÍNDICE ALFABÉTICO COMPLETO DE LA BIBLIOTECA' as titulo,
    '═══════════════════════════════════════════════════════════' as separador2;

SELECT 
    ROW_NUMBER() OVER (ORDER BY title) as num,
    title as titulo,
    author as autor,
    category as categoria,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content) / 2500.0, 1) as paginas,
    CASE 
        WHEN LENGTH(content) >= 100000 THEN '🌟'
        WHEN LENGTH(content) >= 75000 THEN '⭐'
        WHEN LENGTH(content) >= 50000 THEN '✅'
        WHEN LENGTH(content) >= 35000 THEN '🟡'
        WHEN LENGTH(content) >= 20000 THEN '🟠'
        WHEN LENGTH(content) >= 10000 THEN '🔴'
        ELSE '⚠️'
    END as estado,
    CASE 
        WHEN LENGTH(content) >= 50000 THEN 'Completo'
        WHEN LENGTH(content) >= 35000 THEN 'Bueno'
        WHEN LENGTH(content) >= 20000 THEN 'Medio'
        ELSE 'Necesita expansión'
    END as descripcion_estado
FROM knowledge_base
ORDER BY title;

-- 9. RECOMENDACIONES DE ACCIÓN
SELECT 
    '═══════════════════════════════════════════════════════════' as separador,
    '💡 RECOMENDACIONES DE ACCIÓN' as titulo,
    '═══════════════════════════════════════════════════════════' as separador2;

WITH stats AS (
    SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE LENGTH(content) >= 50000) as completos,
        COUNT(*) FILTER (WHERE LENGTH(content) < 50000) as incompletos,
        COUNT(*) FILTER (WHERE LENGTH(content) < 20000) as muy_cortos
    FROM knowledge_base
)
SELECT 
    CASE 
        WHEN completos::float / total >= 0.9 THEN 
            '✅ EXCELENTE: ' || completos || ' de ' || total || ' libros están completos (' || ROUND(completos::numeric / total::numeric * 100, 1) || '%). La biblioteca está en excelente estado.'
        WHEN completos::float / total >= 0.7 THEN 
            '🟡 BUENO: ' || completos || ' de ' || total || ' libros completos. Expandir ' || incompletos || ' libros restantes para alcanzar 100% de completitud.'
        WHEN completos::float / total >= 0.5 THEN 
            '🟠 REGULAR: Solo ' || completos || ' de ' || total || ' completos. Se necesita expandir ' || incompletos || ' libros adicionales.'
        ELSE 
            '🔴 ACCIÓN URGENTE: Solo ' || completos || ' de ' || total || ' libros completos. ' || muy_cortos || ' libros necesitan expansión urgente.'
    END as evaluacion_general,
    
    CASE 
        WHEN incompletos > 0 THEN 
            'Priorizar expansión de los ' || muy_cortos || ' libros más cortos (< 20K caracteres) primero.'
        ELSE 
            'Mantener calidad y considerar agregar nuevos títulos a la biblioteca.'
    END as proximos_pasos,
    
    CASE 
        WHEN incompletos > 50 THEN 'Crear 5-6 scripts de expansión batch adicionales'
        WHEN incompletos > 30 THEN 'Crear 3-4 scripts de expansión batch adicionales'
        WHEN incompletos > 10 THEN 'Crear 2-3 scripts de expansión batch adicionales'
        WHEN incompletos > 0 THEN 'Crear 1 script final de expansión'
        ELSE 'Biblioteca completa - Celebrar! 🎉'
    END as plan_tecnico
FROM stats;

-- 10. PROGRESO DE EXPANSIÓN (ÚLTIMOS 7 DÍAS)
SELECT 
    '═══════════════════════════════════════════════════════════' as separador,
    '📊 PROGRESO DE EXPANSIÓN (ÚLTIMOS 7 DÍAS)' as titulo,
    '═══════════════════════════════════════════════════════════' as separador2;

SELECT 
    DATE(updated_at) as fecha,
    COUNT(*) as libros_actualizados,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres_nuevos,
    MIN(LENGTH(content)) as minimo,
    MAX(LENGTH(content)) as maximo,
    STRING_AGG(DISTINCT category, ', ') as categorias_actualizadas
FROM knowledge_base
WHERE updated_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(updated_at)
ORDER BY fecha DESC;

-- 11. RESUMEN FINAL
SELECT 
    '═══════════════════════════════════════════════════════════' as separador,
    '🎯 RESUMEN FINAL Y PRÓXIMOS PASOS' as titulo,
    '═══════════════════════════════════════════════════════════' as separador2;

SELECT 
    'Estado de la Biblioteca' as metrica,
    COUNT(*) || ' libros totales' as valor
FROM knowledge_base
UNION ALL
SELECT 
    'Libros Completos (50K+)',
    COUNT(*) || ' libros (' || ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1) || '%)'
FROM knowledge_base
WHERE LENGTH(content) >= 50000
UNION ALL
SELECT 
    'Contenido Total',
    ROUND(SUM(LENGTH(content))::numeric / 1000000, 2) || ' millones de caracteres'
FROM knowledge_base
UNION ALL
SELECT 
    'Promedio por Libro',
    ROUND(AVG(LENGTH(content))::numeric, 0) || ' caracteres (~' || ROUND(AVG(LENGTH(content))::numeric / 2500, 1) || ' páginas)'
FROM knowledge_base
UNION ALL
SELECT 
    'Libros que Necesitan Expansión',
    COUNT(*) || ' libros'
FROM knowledge_base
WHERE LENGTH(content) < 50000
UNION ALL
SELECT 
    'Contenido a Agregar',
    ROUND(SUM(GREATEST(50000 - LENGTH(content), 0))::numeric / 1000000, 2) || ' millones de caracteres adicionales'
FROM knowledge_base
WHERE LENGTH(content) < 50000
UNION ALL
SELECT 
    'Total de Lecturas',
    SUM(read_count) || ' lecturas acumuladas'
FROM knowledge_base
UNION ALL
SELECT 
    'Categorías Únicas',
    COUNT(DISTINCT category) || ' categorías diferentes'
FROM knowledge_base
UNION ALL
SELECT 
    'Autores Únicos',
    COUNT(DISTINCT author) || ' autores diferentes'
FROM knowledge_base;
