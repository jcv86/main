-- Verificar que todos los libros están en español
-- Mostrar información completa de la biblioteca

-- Contar libros por categoría
SELECT 
    category as "Categoría",
    COUNT(*) as "Cantidad de Libros"
FROM knowledge_base 
GROUP BY category 
ORDER BY COUNT(*) DESC;

-- Mostrar los primeros 5 libros con sus detalles
SELECT 
    title as "Título",
    author as "Autor",
    category as "Categoría",
    array_to_string(tags, ', ') as "Etiquetas",
    read_count as "Lecturas"
FROM knowledge_base 
ORDER BY read_count DESC 
LIMIT 5;

-- Verificar que no hay contenido en inglés (buscar palabras comunes en inglés)
SELECT 
    title,
    CASE 
        WHEN content ILIKE '%the %' OR content ILIKE '%and %' OR content ILIKE '%for %' THEN 'Posible contenido en inglés'
        ELSE 'Contenido en español'
    END as idioma_detectado
FROM knowledge_base
WHERE content ILIKE '%the %' OR content ILIKE '%and %' OR content ILIKE '%for %'
LIMIT 3;

-- Estadísticas generales de la biblioteca
SELECT 
    COUNT(*) as "Total de Libros",
    COUNT(DISTINCT category) as "Categorías Únicas",
    COUNT(DISTINCT author) as "Autores Únicos",
    AVG(read_count) as "Promedio de Lecturas",
    SUM(read_count) as "Total de Lecturas"
FROM knowledge_base;

-- Mostrar todas las categorías disponibles
SELECT DISTINCT category as "Categorías Disponibles"
FROM knowledge_base 
ORDER BY category;
