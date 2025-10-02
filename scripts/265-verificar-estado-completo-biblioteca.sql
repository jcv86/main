-- ═══════════════════════════════════════════════════════════
-- VERIFICACIÓN COMPLETA DEL ESTADO DE LA BIBLIOTECA
-- Este script analiza el estado actual de todos los libros
-- y determina qué acciones adicionales se necesitan
-- ═══════════════════════════════════════════════════════════

-- Mostrar banner inicial
SELECT 
    '═══════════════════════════════════════════════════════════' as "═══════════════════";
SELECT 
    '📚 VERIFICACIÓN COMPLETA DE BIBLIOTECA DTC' as titulo;
SELECT 
    '═══════════════════════════════════════════════════════════' as "═══════════════════";

-- 1. ESTADO GENERAL
SELECT 
    '
1️⃣ RESUMEN EJECUTIVO' as seccion;
SELECT 
    '───────────────────────────────────────────────────────────' as "───────────────────";

SELECT 
    COUNT(*) as total_libros,
    COUNT(*) FILTER (WHERE LENGTH(content) >= 50000) as "✅ Completos (50K+)",
    COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 35000 AND 49999) as "🟡 Buenos (35-50K)",
    COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 20000 AND 34999) as "🟠 Necesitan Mejora (20-35K)",
    COUNT(*) FILTER (WHERE LENGTH(content) < 20000) as "🔴 Urgente Expansión (<20K)",
    ROUND((COUNT(*) FILTER (WHERE LENGTH(content) >= 50000)::numeric / COUNT(*)::numeric * 100), 1) || '%' as porcentaje_completos
FROM knowledge_base;

-- 2. DISTRIBUCIÓN POR TIEMPO DE LECTURA
SELECT 
    '
2️⃣ DISTRIBUCIÓN POR TIEMPO DE LECTURA' as seccion;
SELECT 
    '───────────────────────────────────────────────────────────' as "───────────────────";

SELECT 
    CASE 
        WHEN LENGTH(content) < 1000 THEN '🔴 < 5 min'
        WHEN LENGTH(content) < 2000 THEN '🔴 5-10 min'
        WHEN LENGTH(content) < 4000 THEN '🟠 10-20 min'
        WHEN LENGTH(content) < 7000 THEN '🟡 20-35 min'
        ELSE '✅ 35+ min'
    END as rango_tiempo,
    COUNT(*) as cantidad_libros,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1) || '%' as porcentaje
FROM knowledge_base
GROUP BY 
    CASE 
        WHEN LENGTH(content) < 1000 THEN '🔴 < 5 min'
        WHEN LENGTH(content) < 2000 THEN '🔴 5-10 min'
        WHEN LENGTH(content) < 4000 THEN '🟠 10-20 min'
        WHEN LENGTH(content) < 7000 THEN '🟡 20-35 min'
        ELSE '✅ 35+ min'
    END
ORDER BY promedio_caracteres ASC;

-- 3. TOP 30 LIBROS MÁS CORTOS (PRIORIDAD DE EXPANSIÓN)
SELECT 
    '
3️⃣ TOP 30 LIBROS MÁS CORTOS - NECESITAN EXPANSIÓN URGENTE' as seccion;
SELECT 
    '───────────────────────────────────────────────────────────' as "───────────────────";

SELECT 
    ROW_NUMBER() OVER (ORDER BY LENGTH(content) ASC) as prioridad,
    LEFT(title, 50) as libro,
    author as autor,
    category as categoria,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content)::numeric / 200, 1) || ' min' as tiempo_lectura,
    CASE 
        WHEN LENGTH(content) < 1000 THEN '🔴 CRÍTICO'
        WHEN LENGTH(content) < 2000 THEN '🔴 MUY URGENTE'
        WHEN LENGTH(content) < 5000 THEN '🟠 URGENTE'
        WHEN LENGTH(content) < 10000 THEN '🟡 NECESARIO'
        ELSE '⚪ REVISAR'
    END as estado
FROM knowledge_base
ORDER BY LENGTH(content) ASC
LIMIT 30;

-- 4. DISTRIBUCIÓN POR CATEGORÍA
SELECT 
    '
4️⃣ ANÁLISIS POR CATEGORÍA' as seccion;
SELECT 
    '───────────────────────────────────────────────────────────' as "───────────────────";

SELECT 
    category as categoria,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE LENGTH(content) >= 50000) as completos,
    COUNT(*) FILTER (WHERE LENGTH(content) < 20000) as criticos,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_chars,
    ROUND(AVG(LENGTH(content))::numeric / 200, 1) || ' min' as tiempo_promedio
FROM knowledge_base
GROUP BY category
ORDER BY AVG(LENGTH(content)) ASC;

-- 5. LIBROS ACTUALIZADOS RECIENTEMENTE
SELECT 
    '
5️⃣ LIBROS ACTUALIZADOS EN ÚLTIMAS 24 HORAS' as seccion;
SELECT 
    '───────────────────────────────────────────────────────────' as "───────────────────";

SELECT 
    title as libro,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content)::numeric / 200, 1) || ' min' as tiempo_lectura,
    updated_at as actualizado,
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '✅ COMPLETO'
        WHEN LENGTH(content) >= 35000 THEN '🟡 BUENO'
        WHEN LENGTH(content) >= 20000 THEN '🟠 NECESITA MEJORA'
        ELSE '🔴 INSUFICIENTE'
    END as estado
FROM knowledge_base
WHERE updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC
LIMIT 20;

-- 6. ESTADÍSTICAS DETALLADAS
SELECT 
    '
6️⃣ ESTADÍSTICAS DETALLADAS' as seccion;
SELECT 
    '───────────────────────────────────────────────────────────' as "───────────────────";

SELECT 
    'Total de libros' as metrica,
    COUNT(*)::text as valor
FROM knowledge_base
UNION ALL
SELECT 
    'Promedio de caracteres' as metrica,
    ROUND(AVG(LENGTH(content))::numeric, 0)::text as valor
FROM knowledge_base
UNION ALL
SELECT 
    'Tiempo promedio de lectura' as metrica,
    ROUND(AVG(LENGTH(content))::numeric / 200, 1)::text || ' minutos' as valor
FROM knowledge_base
UNION ALL
SELECT 
    'Libro más corto' as metrica,
    MIN(LENGTH(content))::text || ' caracteres' as valor
FROM knowledge_base
UNION ALL
SELECT 
    'Libro más largo' as metrica,
    MAX(LENGTH(content))::text || ' caracteres' as valor
FROM knowledge_base
UNION ALL
SELECT 
    'Libros con < 2 min lectura' as metrica,
    COUNT(*) FILTER (WHERE LENGTH(content) < 400)::text as valor
FROM knowledge_base
UNION ALL
SELECT 
    'Libros con 2-5 min lectura' as metrica,
    COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 400 AND 1000)::text as valor
FROM knowledge_base
UNION ALL
SELECT 
    'Libros con 5-10 min lectura' as metrica,
    COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 1000 AND 2000)::text as valor
FROM knowledge_base
UNION ALL
SELECT 
    'Libros necesitan expansión' as metrica,
    COUNT(*) FILTER (WHERE LENGTH(content) < 35000)::text as valor
FROM knowledge_base;

-- 7. RECOMENDACIÓN FINAL
SELECT 
    '
7️⃣ RECOMENDACIÓN Y PRÓXIMOS PASOS' as seccion;
SELECT 
    '═══════════════════════════════════════════════════════════' as "═══════════════════";

DO $$
DECLARE
    libros_criticos INTEGER;
    libros_urgentes INTEGER;
    libros_necesarios INTEGER;
    total_necesitan_expansion INTEGER;
BEGIN
    SELECT 
        COUNT(*) FILTER (WHERE LENGTH(content) < 5000),
        COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 5000 AND 20000),
        COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 20000 AND 35000),
        COUNT(*) FILTER (WHERE LENGTH(content) < 35000)
    INTO libros_criticos, libros_urgentes, libros_necesarios, total_necesitan_expansion
    FROM knowledge_base;
    
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '📊 ANÁLISIS COMPLETO:';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '🔴 CRÍTICOS (< 5K chars): % libros', libros_criticos;
    RAISE NOTICE '🟠 URGENTES (5-20K chars): % libros', libros_urgentes;
    RAISE NOTICE '🟡 NECESARIOS (20-35K chars): % libros', libros_necesarios;
    RAISE NOTICE '───────────────────────────────────────────────────────────';
    RAISE NOTICE '📌 TOTAL que necesitan expansión: % libros', total_necesitan_expansion;
    RAISE NOTICE '';
    
    IF total_necesitan_expansion = 0 THEN
        RAISE NOTICE '✅ ¡PERFECTO! Todos los libros tienen contenido adecuado.';
        RAISE NOTICE '   No se necesitan scripts adicionales de expansión.';
    ELSIF total_necesitan_expansion <= 20 THEN
        RAISE NOTICE '⚠️  ACCIÓN REQUERIDA:';
        RAISE NOTICE '   → Ejecutar script 266 (expandirá % libros)', total_necesitan_expansion;
        RAISE NOTICE '   → Esto completará la biblioteca';
    ELSIF total_necesitan_expansion <= 40 THEN
        RAISE NOTICE '⚠️  ACCIÓN REQUERIDA:';
        RAISE NOTICE '   → Ejecutar script 266 (expandirá 20 libros)';
        RAISE NOTICE '   → Después ejecutar script 267 (expandirá % restantes)', total_necesitan_expansion - 20;
    ELSE
        RAISE NOTICE '⚠️  ACCIÓN REQUERIDA:';
        RAISE NOTICE '   → Se necesitan % scripts de expansión', CEIL(total_necesitan_expansion::numeric / 20);
        RAISE NOTICE '   → Script 266: Primeros 20 libros';
        RAISE NOTICE '   → Script 267: Siguientes 20 libros';
        IF total_necesitan_expansion > 40 THEN
            RAISE NOTICE '   → Scripts adicionales: % más', CEIL((total_necesitan_expansion - 40)::numeric / 20);
        END IF;
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
END $$;

-- Verificación de tablas relacionadas
SELECT 
    '
8️⃣ VERIFICACIÓN DE TABLAS RELACIONADAS' as seccion;
SELECT 
    '───────────────────────────────────────────────────────────' as "───────────────────";

SELECT 
    'knowledge_base' as tabla,
    COUNT(*) as registros,
    'Libros principales' as descripcion
FROM knowledge_base
UNION ALL
SELECT 
    'user_bookmarks' as tabla,
    COUNT(*) as registros,
    'Marcadores de usuarios' as descripcion
FROM user_bookmarks
UNION ALL
SELECT 
    'reading_progress' as tabla,
    COUNT(*) as registros,
    'Progreso de lectura' as descripcion
FROM reading_progress
UNION ALL
SELECT 
    'web_resources' as tabla,
    COUNT(*) as registros,
    'Recursos web adicionales' as descripcion
FROM web_resources;

SELECT 
    '
═══════════════════════════════════════════════════════════' as final;
SELECT 
    '✅ Verificación completada' as estado;
SELECT 
    '═══════════════════════════════════════════════════════════' as final;
