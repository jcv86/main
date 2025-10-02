-- ═══════════════════════════════════════════════════════════
-- 🔍 VERIFICACIÓN COMPLETA DE LA EJECUCIÓN DEL SCRIPT 268/270
-- ═══════════════════════════════════════════════════════════

SELECT '═══════════════════════════════════════════════════════════' as "═══";
SELECT '🔍 VERIFICACIÓN DE EJECUCIÓN DEL SCRIPT 268' as titulo;
SELECT '═══════════════════════════════════════════════════════════' as "═══";

-- 1️⃣ Verificar libros actualizados en los últimos 10 minutos
SELECT '

1️⃣ LIBROS ACTUALIZADOS EN LOS ÚLTIMOS 10 MINUTOS' as seccion;

SELECT 
    COUNT(*) as total_actualizados,
    MIN(updated_at) as primera_actualizacion,
    MAX(updated_at) as ultima_actualizacion,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres_nuevos,
    ROUND(AVG(LENGTH(content))::numeric / 200, 1) as minutos_lectura_promedio
FROM knowledge_base
WHERE updated_at > NOW() - INTERVAL '10 minutes';

-- 2️⃣ Detalle de libros actualizados
SELECT '

2️⃣ DETALLE DE LIBROS ACTUALIZADOS' as seccion;

SELECT 
    ROW_NUMBER() OVER (ORDER BY updated_at DESC) as num,
    title as libro,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content)::numeric / 200, 1) || ' min' as tiempo_lectura,
    TO_CHAR(updated_at, 'HH24:MI:SS') as hora_actualizacion,
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '✅ Excelente'
        WHEN LENGTH(content) >= 35000 THEN '🟢 Bueno'
        WHEN LENGTH(content) >= 20000 THEN '🟡 Aceptable'
        ELSE '🔴 Corto'
    END as estado
FROM knowledge_base
WHERE updated_at > NOW() - INTERVAL '10 minutes'
ORDER BY updated_at DESC;

-- 3️⃣ Estado general de la biblioteca
SELECT '

3️⃣ ESTADO GENERAL DE LA BIBLIOTECA' as seccion;

SELECT 
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '✅ Excelentes (50K+)'
        WHEN LENGTH(content) >= 35000 THEN '🟢 Buenos (35-50K)'
        WHEN LENGTH(content) >= 20000 THEN '🟡 Aceptables (20-35K)'
        ELSE '🔴 Necesitan expansión (<20K)'
    END as categoria,
    COUNT(*) as cantidad,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1) || '%' as porcentaje
FROM knowledge_base
GROUP BY 
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '✅ Excelentes (50K+)'
        WHEN LENGTH(content) >= 35000 THEN '🟢 Buenos (35-50K)'
        WHEN LENGTH(content) >= 20000 THEN '🟡 Aceptables (20-35K)'
        ELSE '🔴 Necesitan expansión (<20K)'
    END
ORDER BY MIN(LENGTH(content)) DESC;

-- 4️⃣ Top 20 libros más cortos (próxima prioridad)
SELECT '

4️⃣ TOP 20 LIBROS MÁS CORTOS (Próxima prioridad si quedan)' as seccion;

SELECT 
    ROW_NUMBER() OVER (ORDER BY LENGTH(content) ASC) as prioridad,
    title as libro,
    LENGTH(content) as chars,
    ROUND(LENGTH(content)::numeric / 200, 1) || ' min' as lectura,
    CASE 
        WHEN LENGTH(content) < 1000 THEN '❌ Crítico'
        WHEN LENGTH(content) < 5000 THEN '🔴 Muy corto'
        WHEN LENGTH(content) < 20000 THEN '🟡 Corto'
        ELSE '🟢 OK'
    END as estado
FROM knowledge_base
ORDER BY LENGTH(content) ASC
LIMIT 20;

-- 5️⃣ Resumen ejecutivo
SELECT '

═══════════════════════════════════════════════════════════' as "═══";
SELECT '📊 RESUMEN EJECUTIVO' as seccion;
SELECT '═══════════════════════════════════════════════════════════' as "═══";

SELECT 
    (SELECT COUNT(*) FROM knowledge_base) as total_libros,
    (SELECT COUNT(*) FROM knowledge_base WHERE LENGTH(content) >= 50000) as excelentes,
    (SELECT COUNT(*) FROM knowledge_base WHERE LENGTH(content) >= 35000 AND LENGTH(content) < 50000) as buenos,
    (SELECT COUNT(*) FROM knowledge_base WHERE LENGTH(content) >= 20000 AND LENGTH(content) < 35000) as aceptables,
    (SELECT COUNT(*) FROM knowledge_base WHERE LENGTH(content) < 20000) as necesitan_expansion,
    ROUND(
        (SELECT COUNT(*) FROM knowledge_base WHERE LENGTH(content) >= 50000)::numeric / 
        (SELECT COUNT(*) FROM knowledge_base)::numeric * 100, 
        1
    ) || '%' as porcentaje_excelentes;

-- 6️⃣ Verificación de libros específicos expandidos
SELECT '

6️⃣ VERIFICACIÓN DE LIBROS CLAVE' as seccion;

SELECT 
    title as libro,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content)::numeric / 200, 1) || ' min' as lectura,
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '✅ Expandido correctamente'
        WHEN LENGTH(content) >= 20000 THEN '🟡 Parcialmente expandido'
        ELSE '❌ No expandido'
    END as estado
FROM knowledge_base
WHERE slug IN (
    'la-quinta-disciplina',
    'comunicacion-no-violenta',
    'pensar-rapido-pensar-despacio',
    'los-7-habitos-de-la-gente-altamente-efectiva',
    'inteligencia-emocional'
)
ORDER BY LENGTH(content) DESC;

SELECT '

✅ Verificación completada' as resultado;
SELECT '═══════════════════════════════════════════════════════════' as "═══";
