-- Índice completo organizado por categoría
-- Muestra todos los libros agrupados por categoría con detalles

-- Crear vista temporal para el índice
WITH categoria_stats AS (
    SELECT 
        category,
        COUNT(*) as total_libros,
        SUM(read_count) as total_lecturas,
        ROUND(AVG(LENGTH(content))) as promedio_caracteres,
        ROUND(AVG(CEIL(LENGTH(content) / 200.0))) as promedio_paginas
    FROM knowledge_base 
    GROUP BY category
),
libros_detallados AS (
    SELECT 
        category,
        title,
        author,
        read_count,
        LENGTH(content) as caracteres,
        CEIL(LENGTH(content) / 200.0) as paginas,
        CEIL(LENGTH(content) / 1000.0) as tiempo_lectura_min,
        tags,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY read_count DESC, title) as ranking_categoria
    FROM knowledge_base
)

-- Mostrar estadísticas por categoría
SELECT 
    '📊 ESTADÍSTICAS POR CATEGORÍA' as tipo,
    cs.category as categoria,
    cs.total_libros,
    cs.total_lecturas,
    cs.promedio_caracteres,
    cs.promedio_paginas,
    ROUND((cs.total_libros * 100.0 / (SELECT COUNT(*) FROM knowledge_base)), 1) as porcentaje_biblioteca
FROM categoria_stats cs
ORDER BY cs.total_libros DESC, cs.total_lecturas DESC;

-- Mostrar top 3 libros por cada categoría
SELECT 
    '📚 TOP LIBROS POR CATEGORÍA' as tipo,
    ld.category as categoria,
    ld.ranking_categoria as posicion,
    ld.title as titulo,
    ld.author as autor,
    ld.read_count as lecturas,
    ld.paginas,
    ld.tiempo_lectura_min as minutos_lectura
FROM libros_detallados ld
WHERE ld.ranking_categoria <= 3
ORDER BY ld.category, ld.ranking_categoria;

-- Listado completo alfabético por categoría
SELECT 
    '📖 LISTADO COMPLETO' as tipo,
    category as categoria,
    title as titulo,
    author as autor,
    read_count as lecturas,
    caracteres,
    paginas,
    tiempo_lectura_min as minutos_lectura,
    CASE 
        WHEN tags IS NOT NULL AND LENGTH(tags::text) > 0 THEN 
            SUBSTRING(tags::text, 1, 50) || CASE WHEN LENGTH(tags::text) > 50 THEN '...' ELSE '' END
        ELSE 'Sin tags'
    END as tags_preview
FROM libros_detallados
ORDER BY category, title;

-- Resumen final del índice
SELECT 
    '📋 RESUMEN DEL ÍNDICE' as tipo,
    'BIBLIOTECA COMPLETA' as descripcion,
    COUNT(*) as total_libros,
    COUNT(DISTINCT category) as total_categorias,
    COUNT(DISTINCT author) as total_autores,
    SUM(read_count) as lecturas_acumuladas,
    SUM(caracteres) as caracteres_totales,
    SUM(paginas) as paginas_totales,
    SUM(tiempo_lectura_min) as horas_lectura_total
FROM libros_detallados;
