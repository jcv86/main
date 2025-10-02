-- ═══════════════════════════════════════════════════════════
-- VERIFICACIÓN COMPLETA DEL ESTADO DE LA BIBLIOTECA
-- Este script muestra el estado actual de todos los libros
-- ═══════════════════════════════════════════════════════════

-- Header
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    '📚 REPORTE COMPLETO DE ESTADO DE BIBLIOTECA' as titulo;
SELECT 
    CURRENT_TIMESTAMP as fecha_reporte;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

-- ═══════════════════════════════════════════════════════════
-- SECCIÓN 1: RESUMEN GENERAL
-- ═══════════════════════════════════════════════════════════

SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    '📊 RESUMEN GENERAL' as seccion;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

SELECT 
    COUNT(*) as total_libros,
    COUNT(*) FILTER (WHERE LENGTH(content) >= 50000) as "✅ Excelente (50K+)",
    COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 35000 AND 49999) as "🟢 Bueno (35-50K)",
    COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 20000 AND 34999) as "🟡 Regular (20-35K)",
    COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 10000 AND 19999) as "🟠 Corto (10-20K)",
    COUNT(*) FILTER (WHERE LENGTH(content) < 10000) as "🔴 Muy Corto (<10K)",
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres,
    ROUND(AVG(LENGTH(content))::numeric / 200, 1) as promedio_minutos_lectura,
    MIN(LENGTH(content)) as caracteres_minimo,
    MAX(LENGTH(content)) as caracteres_maximo
FROM knowledge_base;

-- ═══════════════════════════════════════════════════════════
-- SECCIÓN 2: PORCENTAJES Y PROGRESO
-- ═══════════════════════════════════════════════════════════

SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    '📈 PORCENTAJES Y PROGRESO' as seccion;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

SELECT 
    ROUND((COUNT(*) FILTER (WHERE LENGTH(content) >= 50000)::numeric / COUNT(*)::numeric * 100), 1) as "% Excelente",
    ROUND((COUNT(*) FILTER (WHERE LENGTH(content) >= 35000)::numeric / COUNT(*)::numeric * 100), 1) as "% Aceptable o Mejor",
    ROUND((COUNT(*) FILTER (WHERE LENGTH(content) < 35000)::numeric / COUNT(*)::numeric * 100), 1) as "% Necesita Expansión",
    ROUND((COUNT(*) FILTER (WHERE LENGTH(content) < 10000)::numeric / COUNT(*)::numeric * 100), 1) as "% Crítico"
FROM knowledge_base;

-- ═══════════════════════════════════════════════════════════
-- SECCIÓN 3: TOP 20 LIBROS MÁS CORTOS (PRIORIDAD ALTA)
-- ═══════════════════════════════════════════════════════════

SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    '🔴 TOP 20 LIBROS MÁS CORTOS - PRIORIDAD CRÍTICA' as seccion;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

SELECT 
    ROW_NUMBER() OVER (ORDER BY LENGTH(content) ASC) as prioridad,
    id,
    LEFT(title, 50) as titulo,
    LEFT(author, 30) as autor,
    category as categoria,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content) / 200.0, 1) as minutos_lectura,
    CASE 
        WHEN LENGTH(content) < 5000 THEN '🔴 CRÍTICO'
        WHEN LENGTH(content) < 10000 THEN '🔴 MUY CORTO'
        WHEN LENGTH(content) < 20000 THEN '🟠 CORTO'
        WHEN LENGTH(content) < 35000 THEN '🟡 NECESITA MÁS'
        ELSE '✅ OK'
    END as estado
FROM knowledge_base
ORDER BY LENGTH(content) ASC
LIMIT 20;

-- ═══════════════════════════════════════════════════════════
-- SECCIÓN 4: DISTRIBUCIÓN POR CATEGORÍA
-- ═══════════════════════════════════════════════════════════

SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    '📂 DISTRIBUCIÓN POR CATEGORÍA' as seccion;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

SELECT 
    category as categoria,
    COUNT(*) as total_libros,
    COUNT(*) FILTER (WHERE LENGTH(content) >= 50000) as excelentes,
    COUNT(*) FILTER (WHERE LENGTH(content) < 35000) as necesitan_expansion,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres,
    ROUND(AVG(LENGTH(content))::numeric / 200, 1) as promedio_minutos,
    MIN(LENGTH(content)) as min_chars,
    MAX(LENGTH(content)) as max_chars
FROM knowledge_base
GROUP BY category
ORDER BY AVG(LENGTH(content)) ASC;

-- ═══════════════════════════════════════════════════════════
-- SECCIÓN 5: ANÁLISIS DE CALIDAD DE CONTENIDO
-- ═══════════════════════════════════════════════════════════

SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    '🎯 ANÁLISIS DE CALIDAD DE CONTENIDO' as seccion;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

SELECT 
    '50,000+ caracteres' as rango,
    COUNT(*) as cantidad,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1) as porcentaje,
    '✅ EXCELENTE - Contenido completo, 25+ min lectura' as evaluacion
FROM knowledge_base
WHERE LENGTH(content) >= 50000

UNION ALL

SELECT 
    '35,000-49,999 caracteres' as rango,
    COUNT(*) as cantidad,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1) as porcentaje,
    '🟢 BUENO - Contenido sustancial, 15-24 min lectura' as evaluacion
FROM knowledge_base
WHERE LENGTH(content) BETWEEN 35000 AND 49999

UNION ALL

SELECT 
    '20,000-34,999 caracteres' as rango,
    COUNT(*) as cantidad,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1) as porcentaje,
    '🟡 REGULAR - Necesita más contenido, 10-17 min lectura' as evaluacion
FROM knowledge_base
WHERE LENGTH(content) BETWEEN 20000 AND 34999

UNION ALL

SELECT 
    '10,000-19,999 caracteres' as rango,
    COUNT(*) as cantidad,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1) as porcentaje,
    '🟠 CORTO - Insuficiente, 5-10 min lectura' as evaluacion
FROM knowledge_base
WHERE LENGTH(content) BETWEEN 10000 AND 19999

UNION ALL

SELECT 
    'Menos de 10,000 caracteres' as rango,
    COUNT(*) as cantidad,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1) as porcentaje,
    '🔴 CRÍTICO - Muy insuficiente, <5 min lectura' as evaluacion
FROM knowledge_base
WHERE LENGTH(content) < 10000;

-- ═══════════════════════════════════════════════════════════
-- SECCIÓN 6: RECOMENDACIONES Y PLAN DE ACCIÓN
-- ═══════════════════════════════════════════════════════════

SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    '💡 RECOMENDACIONES Y PLAN DE ACCIÓN' as seccion;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

-- Calcular trabajo restante
WITH trabajo_restante AS (
    SELECT 
        COUNT(*) FILTER (WHERE LENGTH(content) < 10000) as criticos,
        COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 10000 AND 19999) as muy_cortos,
        COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 20000 AND 34999) as cortos,
        SUM(GREATEST(50000 - LENGTH(content), 0)) FILTER (WHERE LENGTH(content) < 35000) as caracteres_necesarios
    FROM knowledge_base
)
SELECT 
    criticos as "🔴 Libros Críticos (<10K)",
    muy_cortos as "🟠 Libros Muy Cortos (10-20K)",
    cortos as "🟡 Libros Cortos (20-35K)",
    criticos + muy_cortos + cortos as "Total a Expandir",
    ROUND(caracteres_necesarios / 1000000.0, 2) as "Millones de Caracteres Necesarios",
    CEIL((criticos + muy_cortos + cortos)::numeric / 20) as "Lotes de 20 Necesarios"
FROM trabajo_restante;

-- ═══════════════════════════════════════════════════════════
-- SECCIÓN 7: LISTA DETALLADA DE TODOS LOS LIBROS CORTOS
-- ═══════════════════════════════════════════════════════════

SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    '📋 LISTA COMPLETA DE LIBROS QUE NECESITAN EXPANSIÓN' as seccion;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

SELECT 
    ROW_NUMBER() OVER (ORDER BY LENGTH(content) ASC) as numero,
    id,
    title as titulo,
    author as autor,
    category as categoria,
    LENGTH(content) as caracteres_actuales,
    ROUND(LENGTH(content) / 200.0, 1) as minutos_actuales,
    50000 - LENGTH(content) as caracteres_a_agregar,
    ROUND((50000 - LENGTH(content)) / 200.0, 1) as minutos_a_agregar,
    CASE 
        WHEN LENGTH(content) < 5000 THEN '🔴 CRÍTICO - Prioridad 1'
        WHEN LENGTH(content) < 10000 THEN '🔴 MUY CORTO - Prioridad 2'
        WHEN LENGTH(content) < 20000 THEN '🟠 CORTO - Prioridad 3'
        ELSE '🟡 NECESITA MÁS - Prioridad 4'
    END as prioridad
FROM knowledge_base
WHERE LENGTH(content) < 35000
ORDER BY LENGTH(content) ASC;

-- ═══════════════════════════════════════════════════════════
-- SECCIÓN 8: VERIFICACIÓN DE ÚLTIMAS ACTUALIZACIONES
-- ═══════════════════════════════════════════════════════════

SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    '⏰ LIBROS ACTUALIZADOS RECIENTEMENTE' as seccion;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

SELECT 
    id,
    LEFT(title, 50) as titulo,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content) / 200.0, 1) as minutos_lectura,
    updated_at as fecha_actualizacion,
    NOW() - updated_at as hace
FROM knowledge_base
WHERE updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;

-- ═══════════════════════════════════════════════════════════
-- SECCIÓN 9: RESUMEN EJECUTIVO Y DECISIÓN
-- ═══════════════════════════════════════════════════════════

SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    '🎯 RESUMEN EJECUTIVO' as seccion;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

WITH metricas AS (
    SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE LENGTH(content) >= 50000) as completos,
        COUNT(*) FILTER (WHERE LENGTH(content) < 35000) as necesitan_expansion
    FROM knowledge_base
)
SELECT 
    total as "Total Libros en Biblioteca",
    completos as "✅ Libros Completos (50K+)",
    necesitan_expansion as "🔄 Libros que Necesitan Expansión",
    ROUND((completos::numeric / total::numeric * 100), 1) as "% Completitud",
    CASE 
        WHEN (completos::numeric / total::numeric) >= 0.90 THEN '✅ EXCELENTE - Biblioteca casi completa'
        WHEN (completos::numeric / total::numeric) >= 0.70 THEN '🟢 BUENO - Mayoría de libros completos'
        WHEN (completos::numeric / total::numeric) >= 0.50 THEN '🟡 REGULAR - Mitad de biblioteca completa'
        ELSE '🔴 NECESITA TRABAJO - Muchos libros incompletos'
    END as estado_general,
    CASE 
        WHEN necesitan_expansion > 0 THEN '⚠️ SÍ - Ejecutar más scripts de expansión'
        ELSE '✅ NO - Biblioteca completa'
    END as "¿Necesita más scripts?"
FROM metricas;

-- Final message
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    '📝 FIN DEL REPORTE' as mensaje;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
