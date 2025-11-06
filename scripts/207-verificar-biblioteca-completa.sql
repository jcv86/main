-- Verificar el estado completo de la biblioteca después de todas las adiciones

-- Contar total de libros
SELECT 'TOTAL DE LIBROS' as metric, COUNT(*) as value FROM knowledge_base
UNION ALL
SELECT 'TOTAL DE AUTORES' as metric, COUNT(DISTINCT author) as value FROM knowledge_base
UNION ALL
SELECT 'TOTAL DE CATEGORÍAS' as metric, COUNT(DISTINCT category) as value FROM knowledge_base
UNION ALL
SELECT 'TOTAL DE LECTURAS' as metric, SUM(read_count) as value FROM knowledge_base
UNION ALL
SELECT 'PROMEDIO CARACTERES' as metric, AVG(LENGTH(content))::integer as value FROM knowledge_base;

-- Libros por categoría
SELECT 
    category as "Categoría",
    COUNT(*) as "Cantidad de Libros",
    AVG(read_count)::integer as "Promedio Lecturas",
    AVG(LENGTH(content))::integer as "Promedio Caracteres"
FROM knowledge_base 
GROUP BY category 
ORDER BY COUNT(*) DESC;

-- Top 10 libros más populares
SELECT 
    title as "Título",
    author as "Autor",
    category as "Categoría",
    read_count as "Lecturas",
    LENGTH(content) as "Caracteres"
FROM knowledge_base 
ORDER BY read_count DESC 
LIMIT 10;

-- Libros agregados recientemente
SELECT 
    title as "Título",
    author as "Autor",
    category as "Categoría",
    created_at as "Fecha Creación"
FROM knowledge_base 
ORDER BY id DESC 
LIMIT 10;

-- Verificar que todos los libros tienen contenido completo
SELECT 
    title as "Título",
    LENGTH(content) as "Caracteres",
    CASE 
        WHEN LENGTH(content) < 1000 THEN 'Contenido Corto'
        WHEN LENGTH(content) < 3000 THEN 'Contenido Medio'
        ELSE 'Contenido Completo'
    END as "Estado Contenido"
FROM knowledge_base 
ORDER BY LENGTH(content) ASC;

-- Estadísticas de etiquetas
SELECT 
    unnest(tags) as etiqueta,
    COUNT(*) as frecuencia
FROM knowledge_base 
GROUP BY unnest(tags)
ORDER BY frecuencia DESC
LIMIT 20;
