-- Verificar libros actuales en la biblioteca
SELECT 
    id,
    title,
    author,
    LENGTH(content) as content_length,
    category,
    estimated_read_time
FROM knowledge_base
ORDER BY id;
