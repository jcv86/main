-- Verificar configuración completa del sistema de biblioteca
-- Verify complete library system setup

-- 1. Verificar estructura de tablas
SELECT 
    'VERIFICACIÓN DE TABLAS' as check_type,
    table_name,
    CASE 
        WHEN table_name IN (
            'knowledge_base', 'user_reading_progress', 'user_bookmarks', 
            'reading_sessions', 'book_reviews', 'reading_goals'
        ) THEN 'EXISTE ✓'
        ELSE 'FALTA ✗'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'knowledge_base', 'user_reading_progress', 'user_bookmarks', 
    'reading_sessions', 'book_reviews', 'reading_goals'
)
ORDER BY table_name;

-- 2. Verificar contenido de libros
SELECT 
    'VERIFICACIÓN DE CONTENIDO' as check_type,
    COUNT(*) as total_libros,
    COUNT(CASE WHEN LENGTH(content) > 1000 THEN 1 END) as libros_con_contenido_completo,
    AVG(LENGTH(content)) as promedio_caracteres_por_libro
FROM knowledge_base;

-- 3. Verificar libros por categoría
SELECT 
    'LIBROS POR CATEGORÍA' as check_type,
    category,
    COUNT(*) as cantidad_libros,
    STRING_AGG(title, ', ') as titulos
FROM knowledge_base 
GROUP BY category
ORDER BY category;

-- 4. Verificar datos del usuario demo
SELECT 
    'DATOS USUARIO DEMO' as check_type,
    'Progreso de Lectura' as tipo_dato,
    COUNT(*) as cantidad,
    AVG(reading_progress) as progreso_promedio,
    SUM(reading_time_minutes) as tiempo_total_minutos
FROM user_reading_progress 
WHERE user_email = 'demo@example.com'

UNION ALL

SELECT 
    'DATOS USUARIO DEMO' as check_type,
    'Bookmarks' as tipo_dato,
    COUNT(*) as cantidad,
    NULL as progreso_promedio,
    NULL as tiempo_total_minutos
FROM user_bookmarks 
WHERE user_email = 'demo@example.com'

UNION ALL

SELECT 
    'DATOS USUARIO DEMO' as check_type,
    'Objetivos de Lectura' as tipo_dato,
    COUNT(*) as cantidad,
    AVG(current_value) as progreso_promedio,
    AVG(target_value) as tiempo_total_minutos
FROM reading_goals 
WHERE user_email = 'demo@example.com'

UNION ALL

SELECT 
    'DATOS USUARIO DEMO' as check_type,
    'Sesiones de Lectura' as tipo_dato,
    COUNT(*) as cantidad,
    AVG(duration_minutes) as progreso_promedio,
    SUM(duration_minutes) as tiempo_total_minutos
FROM reading_sessions 
WHERE user_email = 'demo@example.com';

-- 5. Verificar funciones del sistema
SELECT 
    'VERIFICACIÓN DE FUNCIONES' as check_type,
    routine_name as nombre_funcion,
    'EXISTE ✓' as status
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

-- 6. Probar función de búsqueda
SELECT 
    'PRUEBA DE BÚSQUEDA' as check_type,
    title,
    category,
    author,
    relevance_score
FROM search_knowledge_base('liderazgo', NULL, 5)
ORDER BY relevance_score DESC;

-- 7. Probar estadísticas de usuario
SELECT 
    'ESTADÍSTICAS DE USUARIO' as check_type,
    *
FROM get_user_reading_stats('demo@example.com');

-- 8. Probar función de libros por estado
SELECT 
    'LIBROS POR ESTADO' as check_type,
    title,
    category,
    status,
    reading_progress,
    target_percentage,
    is_bookmarked
FROM get_books_by_status('demo@example.com', NULL)
ORDER BY last_read_at DESC NULLS LAST;

-- 9. Verificar índices
SELECT 
    'VERIFICACIÓN DE ÍNDICES' as check_type,
    indexname as nombre_indice,
    tablename as tabla,
    'EXISTE ✓' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 10. Resumen final del sistema
SELECT 
    'RESUMEN FINAL' as check_type,
    'Sistema de Biblioteca Profesional' as componente,
    CASE 
        WHEN (
            SELECT COUNT(*) FROM information_schema.tables 
            WHERE table_name IN (
                'knowledge_base', 'user_reading_progress', 'user_bookmarks', 
                'reading_sessions', 'book_reviews', 'reading_goals'
            )
        ) = 6 
        AND (SELECT COUNT(*) FROM knowledge_base) >= 3
        AND (SELECT COUNT(*) FROM user_reading_progress WHERE user_email = 'demo@example.com') >= 3
        THEN 'CONFIGURADO CORRECTAMENTE ✓'
        ELSE 'REQUIERE ATENCIÓN ✗'
    END as status_final;
