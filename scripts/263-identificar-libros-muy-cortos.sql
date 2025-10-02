-- Identificar todos los libros que tienen contenido insuficiente
-- Menos de 10,000 caracteres = aproximadamente 2-4 minutos de lectura

SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    '🔍 LIBROS CON CONTENIDO INSUFICIENTE' as titulo;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

-- Mostrar todos los libros muy cortos
SELECT 
    ROW_NUMBER() OVER (ORDER BY LENGTH(content) ASC) as prioridad,
    id,
    title as titulo,
    author as autor,
    category as categoria,
    LENGTH(content) as caracteres_actuales,
    ROUND(LENGTH(content) / 200.0, 1) as minutos_lectura_aprox,
    ROUND(LENGTH(content) / 2500.0, 1) as paginas_actuales,
    (50000 - LENGTH(content)) as caracteres_necesarios,
    CASE 
        WHEN LENGTH(content) < 5000 THEN '🔴 CRÍTICO - Solo ' || ROUND(LENGTH(content) / 200.0, 1) || ' min'
        WHEN LENGTH(content) < 10000 THEN '🔴 MUY CORTO - ' || ROUND(LENGTH(content) / 200.0, 1) || ' min'
        WHEN LENGTH(content) < 20000 THEN '🟠 CORTO - ' || ROUND(LENGTH(content) / 200.0, 1) || ' min'
        WHEN LENGTH(content) < 35000 THEN '🟡 NECESITA MÁS - ' || ROUND(LENGTH(content) / 200.0, 1) || ' min'
        ELSE '✅ OK'
    END as estado
FROM knowledge_base
WHERE LENGTH(content) < 35000
ORDER BY LENGTH(content) ASC;

-- Resumen por categoría de libros cortos
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    'RESUMEN POR CATEGORÍA (LIBROS CORTOS)' as titulo;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

SELECT 
    category as categoria,
    COUNT(*) as libros_cortos,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_caracteres,
    MIN(LENGTH(content)) as mas_corto,
    MAX(LENGTH(content)) as mas_largo,
    STRING_AGG(title, ' | ' ORDER BY LENGTH(content)) as titulos
FROM knowledge_base
WHERE LENGTH(content) < 35000
GROUP BY category
ORDER BY COUNT(*) DESC, promedio_caracteres ASC;

-- Total de trabajo requerido
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;
SELECT 
    'RESUMEN DE TRABAJO REQUERIDO' as titulo;
SELECT 
    '═══════════════════════════════════════════════════════════' as separador;

SELECT 
    COUNT(*) as total_libros_a_expandir,
    COUNT(*) FILTER (WHERE LENGTH(content) < 5000) as criticos,
    COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 5000 AND 10000) as muy_cortos,
    COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 10000 AND 20000) as cortos,
    COUNT(*) FILTER (WHERE LENGTH(content) BETWEEN 20000 AND 35000) as necesitan_mas,
    ROUND(SUM(GREATEST(50000 - LENGTH(content), 0))::numeric / 1000000, 2) as millones_caracteres_a_agregar,
    ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_actual,
    50000 - ROUND(AVG(LENGTH(content))::numeric, 0) as promedio_a_agregar_por_libro
FROM knowledge_base
WHERE LENGTH(content) < 35000;
