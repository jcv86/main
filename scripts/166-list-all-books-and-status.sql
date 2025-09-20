-- Lista completa de todos los libros en la base de conocimientos
-- Complete list of all books in the knowledge base

-- 1. Verificar estructura de la tabla knowledge_base
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'knowledge_base' 
ORDER BY ordinal_position;

-- 2. Contar total de libros por categoría
SELECT 
    category,
    COUNT(*) as total_books,
    AVG(LENGTH(content)) as avg_content_length,
    MIN(read_count) as min_reads,
    MAX(read_count) as max_reads,
    AVG(read_count) as avg_reads
FROM knowledge_base 
GROUP BY category 
ORDER BY total_books DESC;

-- 3. Lista completa de todos los libros con detalles
SELECT 
    id,
    title,
    author,
    category,
    LENGTH(content) as content_length,
    CASE 
        WHEN LENGTH(content) < 500 THEN 'Resumen Corto'
        WHEN LENGTH(content) < 1500 THEN 'Resumen Medio'
        WHEN LENGTH(content) < 3000 THEN 'Resumen Largo'
        ELSE 'Contenido Completo'
    END as content_type,
    array_length(tags, 1) as tag_count,
    tags,
    read_count,
    slug,
    created_at,
    updated_at
FROM knowledge_base 
ORDER BY category, title;

-- 4. Libros que necesitan contenido completo (menos de 2000 caracteres)
SELECT 
    id,
    title,
    author,
    category,
    LENGTH(content) as current_length,
    'NECESITA EXPANSIÓN' as status
FROM knowledge_base 
WHERE LENGTH(content) < 2000
ORDER BY LENGTH(content) ASC;

-- 5. Estadísticas generales de la biblioteca
SELECT 
    COUNT(*) as total_books,
    COUNT(DISTINCT category) as total_categories,
    COUNT(DISTINCT author) as total_authors,
    AVG(LENGTH(content)) as avg_content_length,
    SUM(read_count) as total_reads,
    MAX(read_count) as most_read_count,
    MIN(created_at) as oldest_book,
    MAX(updated_at) as newest_update
FROM knowledge_base;

-- 6. Top 10 libros más leídos
SELECT 
    title,
    author,
    category,
    read_count,
    LENGTH(content) as content_length
FROM knowledge_base 
ORDER BY read_count DESC 
LIMIT 10;

-- 7. Libros por autor (autores con más libros)
SELECT 
    author,
    COUNT(*) as book_count,
    string_agg(DISTINCT category, ', ') as categories,
    AVG(read_count) as avg_reads
FROM knowledge_base 
GROUP BY author 
HAVING COUNT(*) > 1
ORDER BY book_count DESC;

-- 8. Tags más utilizados
SELECT 
    unnest(tags) as tag,
    COUNT(*) as usage_count
FROM knowledge_base 
GROUP BY unnest(tags)
ORDER BY usage_count DESC
LIMIT 20;
