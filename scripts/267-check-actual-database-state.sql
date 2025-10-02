-- ═══════════════════════════════════════════════════════════
-- VERIFICACIÓN DEL ESTADO REAL DE LA BASE DE DATOS
-- Este script verifica si los cambios anteriores fueron aplicados
-- y determina exactamente qué se necesita hacer
-- ═══════════════════════════════════════════════════════════

-- Banner inicial
SELECT '═══════════════════════════════════════════════════════════' as "═══";
SELECT '🔍 VERIFICACIÓN COMPLETA DEL ESTADO ACTUAL' as titulo;
SELECT '═══════════════════════════════════════════════════════════' as "═══";

-- 1. VERIFICAR QUE LA TABLA EXISTE
SELECT '
1️⃣ VERIFICACIÓN DE ESTRUCTURA' as seccion;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'knowledge_base') THEN
        RAISE NOTICE '✅ Tabla knowledge_base existe';
    ELSE
        RAISE NOTICE '❌ ERROR: Tabla knowledge_base NO existe';
        RAISE EXCEPTION 'Tabla knowledge_base no encontrada';
    END IF;
END $$;

-- 2. CONTEO TOTAL Y DISTRIBUCIÓN
SELECT '
2️⃣ ESTADÍSTICAS GENERALES' as seccion;

SELECT 
    COUNT(*) as total_libros,
    MIN(LENGTH(content)) as contenido_minimo,
    MAX(LENGTH(content)) as contenido_maximo,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_contenido,
    ROUND(AVG(LENGTH(content))::numeric / 200, 1) || ' minutos' as tiempo_promedio_lectura
FROM knowledge_base;

-- 3. DISTRIBUCIÓN POR CALIDAD DE CONTENIDO
SELECT '
3️⃣ DISTRIBUCIÓN POR CALIDAD' as seccion;

SELECT 
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '✅ EXCELENTE (50K+)'
        WHEN LENGTH(content) >= 35000 THEN '🟢 BUENO (35-50K)'
        WHEN LENGTH(content) >= 20000 THEN '🟡 ACEPTABLE (20-35K)'
        WHEN LENGTH(content) >= 10000 THEN '🟠 NECESITA MEJORA (10-20K)'
        WHEN LENGTH(content) >= 5000 THEN '🔴 INSUFICIENTE (5-10K)'
        ELSE '❌ CRÍTICO (<5K)'
    END as categoria,
    COUNT(*) as cantidad,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1) || '%' as porcentaje,
    ROUND(AVG(LENGTH(content))::numeric / 200, 1) || ' min' as tiempo_promedio
FROM knowledge_base
GROUP BY 
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '✅ EXCELENTE (50K+)'
        WHEN LENGTH(content) >= 35000 THEN '🟢 BUENO (35-50K)'
        WHEN LENGTH(content) >= 20000 THEN '🟡 ACEPTABLE (20-35K)'
        WHEN LENGTH(content) >= 10000 THEN '🟠 NECESITA MEJORA (10-20K)'
        WHEN LENGTH(content) >= 5000 THEN '🔴 INSUFICIENTE (5-10K)'
        ELSE '❌ CRÍTICO (<5K)'
    END
ORDER BY AVG(LENGTH(content)) DESC;

-- 4. LOS 20 LIBROS MÁS CORTOS (PRIORIDAD URGENTE)
SELECT '
4️⃣ TOP 20 LIBROS MÁS CORTOS - REQUIEREN ATENCIÓN' as seccion;

SELECT 
    ROW_NUMBER() OVER (ORDER BY LENGTH(content) ASC) as prioridad,
    LEFT(title, 60) as libro,
    LENGTH(content) as chars,
    ROUND(LENGTH(content)::numeric / 200, 1) || ' min' as lectura,
    CASE 
        WHEN LENGTH(content) < 400 THEN '❌ < 2 min'
        WHEN LENGTH(content) < 1000 THEN '🔴 2-5 min'
        WHEN LENGTH(content) < 2000 THEN '🔴 5-10 min'
        WHEN LENGTH(content) < 5000 THEN '🟠 10-25 min'
        ELSE '🟡 OK'
    END as estado
FROM knowledge_base
ORDER BY LENGTH(content) ASC
LIMIT 20;

-- 5. VERIFICAR ACTUALIZACIONES RECIENTES
SELECT '
5️⃣ ACTUALIZACIONES RECIENTES (Últimas 48 horas)' as seccion;

SELECT 
    COUNT(*) as libros_actualizados,
    MIN(updated_at) as primera_actualizacion,
    MAX(updated_at) as ultima_actualizacion,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_chars_actualizados
FROM knowledge_base
WHERE updated_at > NOW() - INTERVAL '48 hours';

SELECT 
    LEFT(title, 50) as libro_actualizado,
    LENGTH(content) as chars,
    ROUND(LENGTH(content)::numeric / 200, 1) || ' min' as lectura,
    TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI') as cuando,
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '✅'
        WHEN LENGTH(content) >= 35000 THEN '🟢'
        WHEN LENGTH(content) >= 20000 THEN '🟡'
        ELSE '🔴'
    END as estado
FROM knowledge_base
WHERE updated_at > NOW() - INTERVAL '48 hours'
ORDER BY updated_at DESC
LIMIT 10;

-- 6. ANÁLISIS POR CATEGORÍA
SELECT '
6️⃣ ANÁLISIS POR CATEGORÍA' as seccion;

SELECT 
    category as categoria,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE LENGTH(content) >= 50000) as excelentes,
    COUNT(*) FILTER (WHERE LENGTH(content) < 20000) as necesitan_expansion,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_chars,
    ROUND(AVG(LENGTH(content))::numeric / 200, 1) || ' min' as tiempo_promedio
FROM knowledge_base
GROUP BY category
ORDER BY AVG(LENGTH(content)) ASC;

-- 7. RECOMENDACIÓN FINAL
SELECT '
7️⃣ ANÁLISIS Y RECOMENDACIÓN' as seccion;

DO $$
DECLARE
    total_libros INTEGER;
    libros_criticos INTEGER;
    libros_insuficientes INTEGER;
    libros_mejorables INTEGER;
    libros_completos INTEGER;
    actualizados_recientes INTEGER;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE LENGTH(content) < 5000),
        COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 5000 AND 19999),
        COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 20000 AND 34999),
        COUNT(*) FILTER (WHERE LENGTH(content) >= 35000),
        COUNT(*) FILTER (WHERE updated_at > NOW() - INTERVAL '24 hours')
    INTO 
        total_libros,
        libros_criticos,
        libros_insuficientes,
        libros_mejorables,
        libros_completos,
        actualizados_recientes
    FROM knowledge_base;
    
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '📊 RESUMEN EJECUTIVO';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE 'Total de libros en biblioteca: %', total_libros;
    RAISE NOTICE '';
    RAISE NOTICE '❌ CRÍTICOS (<5K): % libros', libros_criticos;
    RAISE NOTICE '🔴 INSUFICIENTES (5-20K): % libros', libros_insuficientes;
    RAISE NOTICE '🟡 MEJORABLES (20-35K): % libros', libros_mejorables;
    RAISE NOTICE '✅ COMPLETOS (35K+): % libros', libros_completos;
    RAISE NOTICE '';
    RAISE NOTICE '🕐 Actualizados en últimas 24 horas: %', actualizados_recientes;
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '🎯 RECOMENDACIÓN:';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    
    IF (libros_criticos + libros_insuficientes + libros_mejorables) = 0 THEN
        RAISE NOTICE '✅ ¡PERFECTO! Todos los libros tienen contenido adecuado.';
        RAISE NOTICE '   La biblioteca está completa y lista para producción.';
        RAISE NOTICE '';
        RAISE NOTICE '   Próximos pasos sugeridos:';
        RAISE NOTICE '   1. Verificar funcionalidad de lectura en la UI';
        RAISE NOTICE '   2. Probar búsqueda y filtros';
        RAISE NOTICE '   3. Validar tracking de progreso de lectura';
    ELSIF actualizados_recientes > 0 AND (libros_criticos + libros_insuficientes) <= 20 THEN
        RAISE NOTICE '🔄 Scripts recientes fueron aplicados exitosamente.';
        RAISE NOTICE '';
        IF (libros_criticos + libros_insuficientes) > 0 THEN
            RAISE NOTICE '⚠️  Aún quedan % libros que necesitan expansión.', (libros_criticos + libros_insuficientes);
            RAISE NOTICE '';
            RAISE NOTICE '   ACCIÓN REQUERIDA:';
            IF (libros_criticos + libros_insuficientes) <= 20 THEN
                RAISE NOTICE '   → Ejecutar script 266 (expandirá los % libros restantes)', (libros_criticos + libros_insuficientes);
            ELSE
                RAISE NOTICE '   → Ejecutar script 266 (expandirá 20 libros)';
                RAISE NOTICE '   → Después ejecutar script adicional para % restantes', (libros_criticos + libros_insuficientes - 20);
            END IF;
        ELSE
            RAISE NOTICE '✅ No se necesitan más scripts de expansión.';
        END IF;
    ELSIF (libros_criticos + libros_insuficientes) > 0 THEN
        RAISE NOTICE '⚠️  Se detectaron % libros con contenido insuficiente', (libros_criticos + libros_insuficientes);
        RAISE NOTICE '';
        RAISE NOTICE '   PLAN DE ACCIÓN:';
        RAISE NOTICE '   1. Ejecutar script 264 (primeros 20 libros más cortos)';
        IF (libros_criticos + libros_insuficientes) > 20 THEN
            RAISE NOTICE '   2. Ejecutar script 266 (siguientes 20 libros)';
        END IF;
        IF (libros_criticos + libros_insuficientes) > 40 THEN
            RAISE NOTICE '   3. Ejecutar scripts adicionales según sea necesario';
            RAISE NOTICE '      (Se necesitan ~% scripts más)', CEIL((libros_criticos + libros_insuficientes - 40)::numeric / 20);
        END IF;
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
END $$;

SELECT '
✅ Verificación completada' as estado;
SELECT '═══════════════════════════════════════════════════════════' as final;
