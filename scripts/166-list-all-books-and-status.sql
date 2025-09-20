-- Listar todos los libros y su estado actual en la base de conocimientos
-- List all books and their current status in the knowledge base

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
    category as "Categoría",
    COUNT(*) as "Total Libros",
    AVG(LENGTH(content)) as "Promedio Caracteres",
    AVG(read_count) as "Promedio Lecturas",
    MIN(created_at) as "Primer Libro",
    MAX(created_at) as "Último Libro"
FROM knowledge_base 
GROUP BY category 
ORDER BY COUNT(*) DESC;

-- 3. Mostrar todos los libros con información detallada
SELECT 
    id,
    title as "Título",
    author as "Autor",
    category as "Categoría",
    LENGTH(content) as "Caracteres",
    CEIL(LENGTH(content) / 2000.0) as "Páginas Estimadas",
    CEIL(LENGTH(content) / 200.0) as "Minutos Lectura",
    read_count as "Veces Leído",
    array_length(tags, 1) as "Número Tags",
    CASE 
        WHEN LENGTH(content) < 500 THEN 'Resumen Corto'
        WHEN LENGTH(content) < 1500 THEN 'Resumen Medio'
        WHEN LENGTH(content) < 3000 THEN 'Resumen Largo'
        ELSE 'Contenido Completo'
    END as "Estado Contenido",
    created_at as "Fecha Creación"
FROM knowledge_base 
ORDER BY category, title;

-- 4. Estadísticas generales de la biblioteca
SELECT 
    'Total de Libros' as "Métrica",
    COUNT(*)::text as "Valor"
FROM knowledge_base
UNION ALL
SELECT 
    'Categorías Únicas' as "Métrica",
    COUNT(DISTINCT category)::text as "Valor"
FROM knowledge_base
UNION ALL
SELECT 
    'Autores Únicos' as "Métrica",
    COUNT(DISTINCT author)::text as "Valor"
FROM knowledge_base
UNION ALL
SELECT 
    'Promedio Caracteres' as "Métrica",
    ROUND(AVG(LENGTH(content)))::text as "Valor"
FROM knowledge_base
UNION ALL
SELECT 
    'Total Lecturas' as "Métrica",
    SUM(read_count)::text as "Valor"
FROM knowledge_base;

-- 5. Top 10 libros más leídos
SELECT 
    title as "Título",
    author as "Autor",
    category as "Categoría",
    read_count as "Lecturas",
    LENGTH(content) as "Caracteres"
FROM knowledge_base 
ORDER BY read_count DESC 
LIMIT 10;

-- 6. Libros con contenido más extenso
SELECT 
    title as "Título",
    author as "Autor",
    category as "Categoría",
    LENGTH(content) as "Caracteres",
    CEIL(LENGTH(content) / 2000.0) as "Páginas Est.",
    read_count as "Lecturas"
FROM knowledge_base 
ORDER BY LENGTH(content) DESC 
LIMIT 10;

-- 7. Verificar tags más comunes
SELECT 
    unnest(tags) as "Tag",
    COUNT(*) as "Frecuencia"
FROM knowledge_base 
WHERE tags IS NOT NULL
GROUP BY unnest(tags)
ORDER BY COUNT(*) DESC
LIMIT 20;

-- 8. Libros por año de creación
SELECT 
    EXTRACT(YEAR FROM created_at) as "Año",
    COUNT(*) as "Libros Creados"
FROM knowledge_base 
GROUP BY EXTRACT(YEAR FROM created_at)
ORDER BY "Año" DESC;

-- 9. Análisis de contenido por categoría
SELECT 
    category as "Categoría",
    COUNT(*) as "Libros",
    MIN(LENGTH(content)) as "Min Caracteres",
    MAX(LENGTH(content)) as "Max Caracteres",
    AVG(LENGTH(content))::integer as "Promedio Caracteres",
    SUM(read_count) as "Total Lecturas"
FROM knowledge_base 
GROUP BY category 
ORDER BY "Total Lecturas" DESC;

-- 10. Verificar integridad de datos
SELECT 
    'Libros sin título' as "Problema",
    COUNT(*) as "Cantidad"
FROM knowledge_base 
WHERE title IS NULL OR title = ''
UNION ALL
SELECT 
    'Libros sin autor' as "Problema",
    COUNT(*) as "Cantidad"
FROM knowledge_base 
WHERE author IS NULL OR author = ''
UNION ALL
SELECT 
    'Libros sin categoría' as "Problema",
    COUNT(*) as "Cantidad"
FROM knowledge_base 
WHERE category IS NULL OR category = ''
UNION ALL
SELECT 
    'Libros sin contenido' as "Problema",
    COUNT(*) as "Cantidad"
FROM knowledge_base 
WHERE content IS NULL OR LENGTH(content) < 100
UNION ALL
SELECT 
    'Libros sin slug' as "Problema",
    COUNT(*) as "Cantidad"
FROM knowledge_base 
WHERE slug IS NULL OR slug = '';
