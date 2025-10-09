-- ═══════════════════════════════════════════════════════════════════════════
-- DIAGNÓSTICO COMPLETO - ¿Por qué solo 38 libros completos?
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. RESUMEN ACTUAL POR ESTADO
SELECT 
    '📊 RESUMEN ACTUAL' as seccion,
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '🟢 Excelente (50k+)'
        WHEN LENGTH(content) >= 35000 THEN '🟡 Muy Bueno (35-50k)'
        WHEN LENGTH(content) >= 20000 THEN '🟠 Bueno (20-35k)'
        WHEN LENGTH(content) >= 10000 THEN '🔴 Regular (10-20k)'
        ELSE '⚫ Incompleto (<10k)'
    END as categoria,
    COUNT(*) as cantidad,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_chars
FROM knowledge_base
GROUP BY 
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '🟢 Excelente (50k+)'
        WHEN LENGTH(content) >= 35000 THEN '🟡 Muy Bueno (35-50k)'
        WHEN LENGTH(content) >= 20000 THEN '🟠 Bueno (20-35k)'
        WHEN LENGTH(content) >= 10000 THEN '🔴 Regular (10-20k)'
        ELSE '⚫ Incompleto (<10k)'
    END
ORDER BY promedio_chars DESC;

-- 2. TOTAL DE LIBROS EN LA BASE DE DATOS
SELECT 
    '📚 TOTAL LIBROS' as seccion,
    COUNT(*) as total_libros_en_bd
FROM knowledge_base;

-- 3. LIBROS ACTUALIZADOS RECIENTEMENTE (últimas 24 horas)
SELECT 
    '🆕 ACTUALIZADOS HOY' as seccion,
    COUNT(*) as actualizados_hoy,
    STRING_AGG(title, ' | ') as titulos
FROM knowledge_base
WHERE updated_at > NOW() - INTERVAL '24 hours';

-- 4. LISTADO DE LOS 38 LIBROS "COMPLETOS" (20k+)
SELECT 
    '✅ LIBROS COMPLETOS (20k+)' as seccion,
    ROW_NUMBER() OVER (ORDER BY LENGTH(content) DESC) as num,
    title,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content) / 200.0, 1) as minutos_lectura,
    TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI') as ultima_actualizacion
FROM knowledge_base
WHERE LENGTH(content) >= 20000
ORDER BY LENGTH(content) DESC;

-- 5. LIBROS QUE NECESITAN EXPANSIÓN (menos de 20k)
SELECT 
    '⚠️ NECESITAN EXPANSIÓN' as seccion,
    COUNT(*) as cantidad_incompletos
FROM knowledge_base
WHERE LENGTH(content) < 20000;

-- 6. DESGLOSE DETALLADO DE INCOMPLETOS
SELECT 
    '📋 LISTA DE INCOMPLETOS' as seccion,
    title,
    LENGTH(content) as caracteres,
    CASE 
        WHEN LENGTH(content) >= 10000 THEN '🔴 Regular (10-20k)'
        WHEN LENGTH(content) >= 5000 THEN '🟠 Corto (5-10k)'
        WHEN LENGTH(content) >= 2000 THEN '🟡 Muy Corto (2-5k)'
        ELSE '⚫ Mínimo (<2k)'
    END as nivel,
    TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI') as ultima_actualizacion
FROM knowledge_base
WHERE LENGTH(content) < 20000
ORDER BY LENGTH(content) ASC;

-- 7. VERIFICAR SI SCRIPTS ANTERIORES SE EJECUTARON
SELECT 
    '🔍 VERIFICAR SCRIPTS RECIENTES' as seccion,
    title,
    LENGTH(content) as caracteres_actuales,
    updated_at
FROM knowledge_base
WHERE title LIKE '%Deep Work%' 
   OR title LIKE '%Trabajo Profundo%'
   OR title LIKE '%Thinking%Fast%'
   OR title LIKE '%Pensar%Rápido%'
   OR title LIKE '%Start%Why%'
   OR title LIKE '%Empieza%Por%Qué%'
ORDER BY title;

-- 8. CATEGORÍAS CON MÁS LIBROS INCOMPLETOS
SELECT 
    '📑 INCOMPLETOS POR CATEGORÍA' as seccion,
    category,
    COUNT(*) as total_en_categoria,
    COUNT(CASE WHEN LENGTH(content) < 20000 THEN 1 END) as incompletos,
    COUNT(CASE WHEN LENGTH(content) >= 20000 THEN 1 END) as completos,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres
FROM knowledge_base
GROUP BY category
ORDER BY incompletos DESC;

-- 9. ANÁLISIS DE ACTUALIZACIONES
SELECT 
    '📅 HISTORIAL DE ACTUALIZACIONES' as seccion,
    DATE(updated_at) as fecha,
    COUNT(*) as libros_actualizados,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres
FROM knowledge_base
GROUP BY DATE(updated_at)
ORDER BY fecha DESC
LIMIT 10;

-- 10. RECOMENDACIÓN: PRÓXIMOS 10 LIBROS A EXPANDIR
SELECT 
    '🎯 PRÓXIMOS 10 A EXPANDIR' as seccion,
    ROW_NUMBER() OVER (ORDER BY LENGTH(content) ASC) as prioridad,
    title,
    author,
    LENGTH(content) as caracteres_actuales,
    20000 - LENGTH(content) as caracteres_necesarios,
    category
FROM knowledge_base
WHERE LENGTH(content) < 20000
ORDER BY LENGTH(content) ASC
LIMIT 10;
