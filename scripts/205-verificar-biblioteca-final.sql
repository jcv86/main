-- Verificar el estado final de la biblioteca
SELECT 
    'RESUMEN GENERAL' as seccion,
    COUNT(*) as total_libros,
    COUNT(DISTINCT category) as categorias,
    COUNT(DISTINCT author) as autores,
    SUM(read_count) as total_lecturas,
    AVG(LENGTH(content)) as promedio_caracteres
FROM knowledge_base

UNION ALL

SELECT 
    'POR CATEGORIA' as seccion,
    NULL as total_libros,
    NULL as categorias, 
    NULL as autores,
    NULL as total_lecturas,
    NULL as promedio_caracteres
FROM knowledge_base
LIMIT 1;

-- Mostrar libros por categoría
SELECT 
    category as categoria,
    COUNT(*) as cantidad_libros,
    STRING_AGG(title, ' | ') as titulos
FROM knowledge_base
GROUP BY category
ORDER BY cantidad_libros DESC;

-- Mostrar los primeros 10 libros para verificar contenido
SELECT 
    id,
    title,
    author,
    category,
    LENGTH(content) as longitud_contenido,
    read_count,
    ARRAY_LENGTH(tags, 1) as cantidad_tags
FROM knowledge_base
ORDER BY id
LIMIT 10;

-- Verificar que no hay contenido vacío
SELECT 
    COUNT(*) as libros_sin_contenido
FROM knowledge_base
WHERE content IS NULL OR LENGTH(TRIM(content)) < 100;

-- Mostrar estadísticas de tags
SELECT 
    UNNEST(tags) as tag,
    COUNT(*) as frecuencia
FROM knowledge_base
GROUP BY UNNEST(tags)
ORDER BY frecuencia DESC
LIMIT 20;
