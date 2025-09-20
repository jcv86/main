-- Verificar que todo esté configurado correctamente para la biblioteca
-- Verify that everything is set up correctly for the library

-- 1. Verificar tablas principales
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_name IN (
    'knowledge_base',
    'user_reading_progress', 
    'user_bookmarks',
    'reading_sessions',
    'book_reviews'
)
ORDER BY table_name;

-- 2. Verificar estructura de knowledge_base
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'knowledge_base'
ORDER BY ordinal_position;

-- 3. Verificar estructura de user_reading_progress
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_reading_progress'
ORDER BY ordinal_position;

-- 4. Contar registros en cada tabla
SELECT 'knowledge_base' as tabla, COUNT(*) as registros FROM knowledge_base
UNION ALL
SELECT 'user_reading_progress' as tabla, COUNT(*) as registros FROM user_reading_progress
UNION ALL
SELECT 'user_bookmarks' as tabla, COUNT(*) as registros FROM user_bookmarks
UNION ALL
SELECT 'reading_sessions' as tabla, COUNT(*) as registros FROM reading_sessions
UNION ALL
SELECT 'book_reviews' as tabla, COUNT(*) as registros FROM book_reviews;

-- 5. Verificar datos de ejemplo para demo@example.com
SELECT 
    'Progreso de lectura' as tipo,
    COUNT(*) as cantidad,
    string_agg(DISTINCT status, ', ') as estados
FROM user_reading_progress 
WHERE user_email = 'demo@example.com'
UNION ALL
SELECT 
    'Bookmarks' as tipo,
    COUNT(*) as cantidad,
    'N/A' as estados
FROM user_bookmarks 
WHERE user_email = 'demo@example.com'
UNION ALL
SELECT 
    'Reseñas' as tipo,
    COUNT(*) as cantidad,
    AVG(rating)::TEXT as estados
FROM book_reviews 
WHERE user_email = 'demo@example.com';

-- 6. Verificar funciones creadas
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%book%' OR routine_name LIKE '%reading%'
ORDER BY routine_name;

-- 7. Probar función de búsqueda
SELECT 
    title,
    category,
    author,
    relevance_score
FROM search_knowledge_base('liderazgo', NULL, 5)
ORDER BY relevance_score DESC;

-- 8. Probar estadísticas de usuario
SELECT * FROM get_user_reading_stats('demo@example.com');

-- 9. Verificar categorías disponibles
SELECT 
    category,
    COUNT(*) as libros,
    AVG(read_count) as promedio_lecturas
FROM knowledge_base 
GROUP BY category 
ORDER BY libros DESC;

-- 10. Verificar libros más populares
SELECT 
    title,
    author,
    category,
    read_count,
    LENGTH(content) as content_length
FROM knowledge_base 
ORDER BY read_count DESC 
LIMIT 10;

-- 11. Verificar integridad de datos
SELECT 
    'Libros sin contenido' as check_type,
    COUNT(*) as count
FROM knowledge_base 
WHERE content IS NULL OR LENGTH(content) < 100
UNION ALL
SELECT 
    'Progreso inválido' as check_type,
    COUNT(*) as count
FROM user_reading_progress 
WHERE reading_progress < 0 OR reading_progress > 100
UNION ALL
SELECT 
    'Target inválido' as check_type,
    COUNT(*) as count
FROM user_reading_progress 
WHERE target_percentage < 0 OR target_percentage > 100;

-- 12. Mostrar resumen final
SELECT 
    'BIBLIOTECA CONFIGURADA CORRECTAMENTE' as status,
    (SELECT COUNT(*) FROM knowledge_base) as total_libros,
    (SELECT COUNT(DISTINCT category) FROM knowledge_base) as categorias,
    (SELECT COUNT(*) FROM user_reading_progress WHERE user_email = 'demo@example.com') as progreso_demo,
    (SELECT COUNT(*) FROM user_bookmarks WHERE user_email = 'demo@example.com') as bookmarks_demo;
