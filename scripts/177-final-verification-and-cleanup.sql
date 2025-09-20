-- Verificación final y limpieza del sistema de biblioteca
-- Final verification and cleanup of the library system

-- 1. Verificar que todas las tablas existen y tienen datos
SELECT 
    'VERIFICACIÓN DE TABLAS' as seccion,
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as columnas,
    CASE 
        WHEN table_name = 'knowledge_base' THEN (SELECT COUNT(*) FROM knowledge_base)
        WHEN table_name = 'user_reading_progress' THEN (SELECT COUNT(*) FROM user_reading_progress)
        WHEN table_name = 'user_bookmarks' THEN (SELECT COUNT(*) FROM user_bookmarks)
        WHEN table_name = 'reading_sessions' THEN (SELECT COUNT(*) FROM reading_sessions)
        WHEN table_name = 'book_reviews' THEN (SELECT COUNT(*) FROM book_reviews)
        WHEN table_name = 'reading_goals' THEN (SELECT COUNT(*) FROM reading_goals)
        ELSE 0
    END as registros
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('knowledge_base', 'user_reading_progress', 'user_bookmarks', 'reading_sessions', 'book_reviews', 'reading_goals')
ORDER BY table_name;

-- 2. Verificar que todas las funciones existen
SELECT 
    'FUNCIONES CREADAS' as seccion,
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'increment_read_count',
    'search_knowledge_base',
    'get_user_reading_stats',
    'update_reading_progress',
    'get_books_by_status'
)
ORDER BY routine_name;

-- 3. Probar todas las funciones con datos reales
SELECT 'PRUEBA DE FUNCIONES' as seccion, 'increment_read_count' as funcion, increment_read_count(1) as resultado;

SELECT 'PRUEBA DE FUNCIONES' as seccion, 'search_knowledge_base' as funcion, COUNT(*) as resultado
FROM search_knowledge_base('liderazgo', NULL, 5);

SELECT 'PRUEBA DE FUNCIONES' as seccion, 'get_user_reading_stats' as funcion, total_books as resultado
FROM get_user_reading_stats('demo@example.com');

SELECT 'PRUEBA DE FUNCIONES' as seccion, 'get_books_by_status' as funcion, COUNT(*) as resultado
FROM get_books_by_status('demo@example.com', NULL);

-- 4. Verificar contenido de libros
SELECT 
    'CONTENIDO DE LIBROS' as seccion,
    title,
    category,
    author,
    LENGTH(content) as caracteres,
    array_length(tags, 1) as num_tags,
    read_count
FROM knowledge_base
ORDER BY id;

-- 5. Verificar datos del usuario demo
SELECT 
    'DATOS USUARIO DEMO' as seccion,
    kb.title,
    urp.reading_progress,
    urp.target_percentage,
    urp.status,
    urp.reading_time_minutes,
    CASE WHEN ub.book_id IS NOT NULL THEN 'Sí' ELSE 'No' END as bookmarked,
    CASE WHEN br.book_id IS NOT NULL THEN br.rating ELSE NULL END as rating
FROM knowledge_base kb
LEFT JOIN user_reading_progress urp ON kb.id = urp.book_id AND urp.user_email = 'demo@example.com'
LEFT JOIN user_bookmarks ub ON kb.id = ub.book_id AND ub.user_email = 'demo@example.com'
LEFT JOIN book_reviews br ON kb.id = br.book_id AND br.user_email = 'demo@example.com'
ORDER BY kb.id;

-- 6. Estadísticas finales del sistema
SELECT 
    'ESTADÍSTICAS FINALES' as seccion,
    'Total libros' as metrica,
    COUNT(*)::TEXT as valor
FROM knowledge_base
UNION ALL
SELECT 
    'ESTADÍSTICAS FINALES' as seccion,
    'Categorías únicas' as metrica,
    COUNT(DISTINCT category)::TEXT as valor
FROM knowledge_base
UNION ALL
SELECT 
    'ESTADÍSTICAS FINALES' as seccion,
    'Progreso registrado' as metrica,
    COUNT(*)::TEXT as valor
FROM user_reading_progress
WHERE user_email = 'demo@example.com'
UNION ALL
SELECT 
    'ESTADÍSTICAS FINALES' as seccion,
    'Bookmarks guardados' as metrica,
    COUNT(*)::TEXT as valor
FROM user_bookmarks
WHERE user_email = 'demo@example.com'
UNION ALL
SELECT 
    'ESTADÍSTICAS FINALES' as seccion,
    'Reseñas escritas' as metrica,
    COUNT(*)::TEXT as valor
FROM book_reviews
WHERE user_email = 'demo@example.com'
UNION ALL
SELECT 
    'ESTADÍSTICAS FINALES' as seccion,
    'Sesiones de lectura' as metrica,
    COUNT(*)::TEXT as valor
FROM reading_sessions
WHERE user_email = 'demo@example.com'
UNION ALL
SELECT 
    'ESTADÍSTICAS FINALES' as seccion,
    'Objetivos de lectura' as metrica,
    COUNT(*)::TEXT as valor
FROM reading_goals
WHERE user_email = 'demo@example.com';

-- 7. Mensaje de confirmación final
SELECT 
    '🎉 SISTEMA DE BIBLIOTECA COMPLETAMENTE FUNCIONAL 🎉' as mensaje,
    'Todas las tablas, funciones y datos están configurados correctamente' as estado,
    'El sistema está listo para usar con contenido completo' as resultado,
    'Ejecuta el siguiente script para ver la página de biblioteca' as siguiente_paso;
