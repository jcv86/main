-- Verificar el total de libros en la base de datos
SELECT 
    COUNT(*) as total_libros,
    COUNT(DISTINCT category) as total_categorias,
    COUNT(DISTINCT author) as total_autores
FROM knowledge_base;

-- Mostrar libros por categoría
SELECT 
    category,
    COUNT(*) as libros_por_categoria
FROM knowledge_base
GROUP BY category
ORDER BY libros_por_categoria DESC;

-- Mostrar los primeros 20 libros para verificar el contenido
SELECT 
    id,
    title,
    author,
    category,
    LENGTH(content) as content_length,
    read_count
FROM knowledge_base
ORDER BY id
LIMIT 20;
