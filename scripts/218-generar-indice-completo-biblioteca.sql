-- Generar índice completo de la biblioteca por categorías
-- Este script muestra todos los libros organizados por categoría

-- Primero verificamos el total de libros
SELECT 'RESUMEN GENERAL' as seccion, 
       COUNT(*) as total_libros,
       COUNT(DISTINCT category) as total_categorias,
       COUNT(DISTINCT author) as total_autores
FROM knowledge_base;

-- Mostrar conteo por categoría
SELECT 'LIBROS POR CATEGORÍA' as seccion,
       category as categoria,
       COUNT(*) as cantidad_libros
FROM knowledge_base 
GROUP BY category 
ORDER BY COUNT(*) DESC, category;

-- Índice completo por categoría
SELECT 
    '=== ' || category || ' ===' as categoria_header,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY title) as numero,
    title as titulo,
    author as autor,
    LENGTH(content) as caracteres,
    read_count as lecturas,
    CASE 
        WHEN LENGTH(content) < 3000 THEN 'Corto'
        WHEN LENGTH(content) < 6000 THEN 'Medio'
        ELSE 'Largo'
    END as longitud,
    created_at::date as fecha_creacion
FROM knowledge_base 
ORDER BY category, title;

-- Estadísticas detalladas por categoría
WITH category_stats AS (
    SELECT 
        category,
        COUNT(*) as total_libros,
        AVG(LENGTH(content)) as promedio_caracteres,
        SUM(read_count) as total_lecturas,
        MIN(LENGTH(content)) as min_caracteres,
        MAX(LENGTH(content)) as max_caracteres
    FROM knowledge_base 
    GROUP BY category
)
SELECT 
    'ESTADÍSTICAS POR CATEGORÍA' as seccion,
    category as categoria,
    total_libros,
    ROUND(promedio_caracteres) as promedio_caracteres,
    total_lecturas,
    min_caracteres,
    max_caracteres,
    ROUND(promedio_caracteres / 200.0) as paginas_estimadas
FROM category_stats 
ORDER BY total_libros DESC, categoria;

-- Top 10 libros más populares
SELECT 
    'TOP 10 MÁS POPULARES' as seccion,
    ROW_NUMBER() OVER (ORDER BY read_count DESC) as ranking,
    title as titulo,
    author as autor,
    category as categoria,
    read_count as lecturas
FROM knowledge_base 
ORDER BY read_count DESC 
LIMIT 10;

-- Libros más recientes
SELECT 
    'LIBROS MÁS RECIENTES' as seccion,
    ROW_NUMBER() OVER (ORDER BY created_at DESC) as orden,
    title as titulo,
    author as autor,
    category as categoria,
    created_at::date as fecha_creacion
FROM knowledge_base 
ORDER BY created_at DESC 
LIMIT 10;

-- Autores con más libros
SELECT 
    'AUTORES MÁS PROLÍFICOS' as seccion,
    author as autor,
    COUNT(*) as cantidad_libros,
    STRING_AGG(title, ' | ' ORDER BY title) as titulos
FROM knowledge_base 
GROUP BY author 
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC, author;

-- Verificación de integridad de datos
SELECT 
    'VERIFICACIÓN DE INTEGRIDAD' as seccion,
    COUNT(*) as total_registros,
    COUNT(CASE WHEN title IS NULL OR title = '' THEN 1 END) as titulos_vacios,
    COUNT(CASE WHEN author IS NULL OR author = '' THEN 1 END) as autores_vacios,
    COUNT(CASE WHEN category IS NULL OR category = '' THEN 1 END) as categorias_vacias,
    COUNT(CASE WHEN content IS NULL OR content = '' THEN 1 END) as contenido_vacio,
    COUNT(CASE WHEN LENGTH(content) < 1000 THEN 1 END) as contenido_muy_corto,
    COUNT(CASE WHEN slug IS NULL OR slug = '' THEN 1 END) as slugs_vacios
FROM knowledge_base;

-- Lista alfabética completa de todos los libros
SELECT 
    'ÍNDICE ALFABÉTICO COMPLETO' as seccion,
    ROW_NUMBER() OVER (ORDER BY title) as numero,
    title as titulo,
    author as autor,
    category as categoria,
    CASE 
        WHEN LENGTH(content) < 2000 THEN '📄 Corto'
        WHEN LENGTH(content) < 5000 THEN '📖 Medio'
        ELSE '📚 Extenso'
    END as tipo,
    read_count as lecturas,
    slug
FROM knowledge_base 
ORDER BY title;
