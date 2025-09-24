-- Verificar consistencia en el cálculo de páginas
-- Asegurar que la fórmula sea consistente en toda la aplicación

-- 1. Verificar la fórmula actual de páginas
SELECT 
    'VERIFICACIÓN FÓRMULA PÁGINAS' as seccion,
    title,
    LENGTH(content) as caracteres_totales,
    CEIL(LENGTH(content) / 200.0) as paginas_biblioteca, -- Fórmula usada en biblioteca
    CEIL(LENGTH(content) / 1000.0) as paginas_lector,    -- Fórmula sugerida para lector
    CEIL(LENGTH(content) / 250.0) as paginas_alternativa,
    CASE 
        WHEN LENGTH(content) < 2000 THEN 'Libro corto'
        WHEN LENGTH(content) < 5000 THEN 'Libro medio'
        ELSE 'Libro largo'
    END as categoria_longitud
FROM knowledge_base 
ORDER BY LENGTH(content) DESC
LIMIT 15;

-- 2. Estadísticas de distribución de páginas
SELECT 
    'DISTRIBUCIÓN DE PÁGINAS' as seccion,
    CASE 
        WHEN CEIL(LENGTH(content) / 200.0) <= 5 THEN '1-5 páginas'
        WHEN CEIL(LENGTH(content) / 200.0) <= 10 THEN '6-10 páginas'
        WHEN CEIL(LENGTH(content) / 200.0) <= 20 THEN '11-20 páginas'
        WHEN CEIL(LENGTH(content) / 200.0) <= 50 THEN '21-50 páginas'
        ELSE '50+ páginas'
    END as rango_paginas,
    COUNT(*) as cantidad_libros,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM knowledge_base)), 1) as porcentaje
FROM knowledge_base 
GROUP BY 
    CASE 
        WHEN CEIL(LENGTH(content) / 200.0) <= 5 THEN '1-5 páginas'
        WHEN CEIL(LENGTH(content) / 200.0) <= 10 THEN '6-10 páginas'
        WHEN CEIL(LENGTH(content) / 200.0) <= 20 THEN '11-20 páginas'
        WHEN CEIL(LENGTH(content) / 200.0) <= 50 THEN '21-50 páginas'
        ELSE '50+ páginas'
    END
ORDER BY MIN(CEIL(LENGTH(content) / 200.0));

-- 3. Recomendaciones para consistencia
SELECT 
    'RECOMENDACIONES' as seccion,
    'Fórmula recomendada' as aspecto,
    'CEIL(caracteres / 200) para vista de biblioteca' as recomendacion
UNION ALL
SELECT 
    'RECOMENDACIONES' as seccion,
    'Fórmula para lector' as aspecto,
    'CEIL(caracteres / 1000) para páginas de lectura' as recomendacion
UNION ALL
SELECT 
    'RECOMENDACIONES' as seccion,
    'Tiempo de lectura' as aspecto,
    'CEIL(caracteres / 1000) minutos (1000 chars = 1 min)' as recomendacion;

-- 4. Verificar libros con contenido muy corto o muy largo
SELECT 
    'LIBROS ATÍPICOS' as seccion,
    title,
    author,
    LENGTH(content) as caracteres,
    CEIL(LENGTH(content) / 200.0) as paginas,
    CASE 
        WHEN LENGTH(content) < 1000 THEN '⚠️ Contenido muy corto'
        WHEN LENGTH(content) > 15000 THEN '📚 Contenido muy extenso'
        ELSE '✅ Contenido normal'
    END as estado
FROM knowledge_base 
WHERE LENGTH(content) < 1000 OR LENGTH(content) > 15000
ORDER BY LENGTH(content);

-- 5. Verificación final de 70 libros
SELECT 
    'VERIFICACIÓN FINAL' as seccion,
    COUNT(*) as total_encontrado,
    CASE 
        WHEN COUNT(*) = 70 THEN '✅ PERFECTO: Tenemos exactamente 70 libros'
        WHEN COUNT(*) > 70 THEN '⚠️ EXCESO: Tenemos ' || COUNT(*) || ' libros (esperados 70)'
        ELSE '❌ FALTANTE: Solo tenemos ' || COUNT(*) || ' libros (esperados 70)'
    END as estado_final
FROM knowledge_base;
