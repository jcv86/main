-- Verificar el estado actual de todos los libros en la base de datos
-- Mostrar cuáles están completos y cuáles necesitan expansión

-- 1. Resumen general
SELECT 
    '📊 RESUMEN GENERAL' as seccion,
    COUNT(*) as total_libros,
    COUNT(DISTINCT author) as total_autores,
    COUNT(DISTINCT category) as total_categorias,
    SUM(read_count) as total_lecturas,
    ROUND(AVG(LENGTH(content))) as promedio_caracteres
FROM knowledge_base;

-- 2. Distribución por longitud de contenido
SELECT 
    '📏 DISTRIBUCIÓN POR LONGITUD' as seccion,
    CASE 
        WHEN LENGTH(content) < 5000 THEN '🔴 Muy Corto (< 5K)'
        WHEN LENGTH(content) < 10000 THEN '🟡 Corto (5K-10K)'
        WHEN LENGTH(content) < 20000 THEN '🟢 Medio (10K-20K)'
        WHEN LENGTH(content) < 50000 THEN '🔵 Largo (20K-50K)'
        ELSE '⭐ Completo (50K+)'
    END as categoria_longitud,
    COUNT(*) as cantidad_libros,
    ROUND(AVG(LENGTH(content))) as promedio_chars,
    ROUND(AVG(estimated_read_time)) as promedio_minutos
FROM knowledge_base
GROUP BY categoria_longitud
ORDER BY promedio_chars;

-- 3. Libros que necesitan expansión urgente (< 20K caracteres)
SELECT 
    '🔴 NECESITAN EXPANSIÓN URGENTE' as seccion,
    id,
    title as titulo,
    author as autor,
    category as categoria,
    LENGTH(content) as caracteres_actuales,
    estimated_read_time as minutos_lectura,
    CASE 
        WHEN LENGTH(content) < 5000 THEN 'Crítico - necesita 10x más'
        WHEN LENGTH(content) < 10000 THEN 'Alto - necesita 5x más'
        ELSE 'Medio - necesita 2-3x más'
    END as prioridad
FROM knowledge_base
WHERE LENGTH(content) < 20000
ORDER BY LENGTH(content) ASC;

-- 4. Libros completos (50K+ caracteres)
SELECT 
    '⭐ LIBROS COMPLETOS' as seccion,
    id,
    title as titulo,
    author as autor,
    LENGTH(content) as caracteres,
    estimated_read_time as minutos_lectura,
    read_count as lecturas
FROM knowledge_base
WHERE LENGTH(content) >= 50000
ORDER BY LENGTH(content) DESC;

-- 5. Distribución por categoría
SELECT 
    '📚 POR CATEGORÍA' as seccion,
    category as categoria,
    COUNT(*) as total_libros,
    ROUND(AVG(LENGTH(content))) as promedio_chars,
    SUM(CASE WHEN LENGTH(content) >= 50000 THEN 1 ELSE 0 END) as completos,
    SUM(CASE WHEN LENGTH(content) < 20000 THEN 1 ELSE 0 END) as necesitan_expansion
FROM knowledge_base
GROUP BY category
ORDER BY total_libros DESC;

-- 6. Top 10 libros más populares
SELECT 
    '🏆 TOP 10 MÁS POPULARES' as seccion,
    title as titulo,
    author as autor,
    read_count as lecturas,
    LENGTH(content) as caracteres,
    CASE 
        WHEN LENGTH(content) >= 50000 THEN '✅ Completo'
        WHEN LENGTH(content) >= 20000 THEN '⚠️ Bueno'
        ELSE '❌ Necesita expansión'
    END as estado_contenido
FROM knowledge_base
ORDER BY read_count DESC
LIMIT 10;

-- 7. Recomendación de próximos libros a expandir
SELECT 
    '🎯 PRÓXIMOS 5 LIBROS A EXPANDIR' as seccion,
    id,
    title as titulo,
    author as autor,
    category as categoria,
    LENGTH(content) as chars_actuales,
    '→ Expandir a 50K+ caracteres' as objetivo
FROM knowledge_base
WHERE LENGTH(content) < 50000
ORDER BY read_count DESC, LENGTH(content) ASC
LIMIT 5;
