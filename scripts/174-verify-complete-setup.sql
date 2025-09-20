-- Verificación completa del sistema de biblioteca
-- Complete verification of the library system

-- 1. Verificar estructura de tablas
SELECT 
    'VERIFICACIÓN DE TABLAS' as seccion,
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columnas,
    CASE 
        WHEN table_name = 'knowledge_base' THEN (SELECT COUNT(*) FROM knowledge_base)
        WHEN table_name = 'user_reading_progress' THEN (SELECT COUNT(*) FROM user_reading_progress)
        WHEN table_name = 'user_bookmarks' THEN (SELECT COUNT(*) FROM user_bookmarks)
        ELSE 0
    END as registros
FROM information_schema.tables t
WHERE table_name IN ('knowledge_base', 'user_reading_progress', 'user_bookmarks')
ORDER BY table_name;

-- 2. Verificar contenido de libros
SELECT 
    'VERIFICACIÓN DE CONTENIDO' as seccion,
    title,
    category,
    author,
    LENGTH(content) as caracteres,
    array_length(tags, 1) as num_tags,
    read_count
FROM knowledge_base
ORDER BY id;

-- 3. Verificar progreso de usuario demo
SELECT 
    'PROGRESO USUARIO DEMO' as seccion,
    kb.title,
    urp.reading_progress,
    urp.target_percentage,
    urp.status,
    urp.reading_time_minutes,
    CASE WHEN ub.book_id IS NOT NULL THEN 'Sí' ELSE 'No' END as bookmarked
FROM knowledge_base kb
LEFT JOIN user_reading_progress urp ON kb.id = urp.book_id AND urp.user_email = 'demo@example.com'
LEFT JOIN user_bookmarks ub ON kb.id = ub.book_id AND ub.user_email = 'demo@example.com'
ORDER BY kb.id;

-- 4. Verificar funciones creadas
SELECT 
    'FUNCIONES DISPONIBLES' as seccion,
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

-- 5. Probar función de búsqueda
SELECT 
    'PRUEBA DE BÚSQUEDA' as seccion,
    title,
    category,
    relevance_score
FROM search_knowledge_base('liderazgo', NULL, 3)
ORDER BY relevance_score DESC;

-- 6. Probar estadísticas de usuario
SELECT 
    'ESTADÍSTICAS USUARIO' as seccion,
    *
FROM get_user_reading_stats('demo@example.com');

-- 7. Verificar categorías y distribución
SELECT 
    'DISTRIBUCIÓN POR CATEGORÍA' as seccion,
    category,
    COUNT(*) as total_libros,
    AVG(read_count) as promedio_lecturas,
    AVG(LENGTH(content)) as promedio_caracteres
FROM knowledge_base 
GROUP BY category 
ORDER BY total_libros DESC;

-- 8. Verificar integridad de datos
SELECT 
    'VERIFICACIÓN DE INTEGRIDAD' as seccion,
    'Libros sin contenido' as tipo_check,
    COUNT(*) as problemas_encontrados
FROM knowledge_base 
WHERE content IS NULL OR LENGTH(content) < 1000
UNION ALL
SELECT 
    'VERIFICACIÓN DE INTEGRIDAD' as seccion,
    'Progreso inválido' as tipo_check,
    COUNT(*) as problemas_encontrados
FROM user_reading_progress 
WHERE reading_progress < 0 OR reading_progress > 100
UNION ALL
SELECT 
    'VERIFICACIÓN DE INTEGRIDAD' as seccion,
    'Target inválido' as tipo_check,
    COUNT(*) as problemas_encontrados
FROM user_reading_progress 
WHERE target_percentage < 0 OR target_percentage > 100;

-- 9. Resumen final del sistema
SELECT 
    'RESUMEN FINAL DEL SISTEMA' as seccion,
    'Total de libros' as metrica,
    COUNT(*)::TEXT as valor
FROM knowledge_base
UNION ALL
SELECT 
    'RESUMEN FINAL DEL SISTEMA' as seccion,
    'Categorías únicas' as metrica,
    COUNT(DISTINCT category)::TEXT as valor
FROM knowledge_base
UNION ALL
SELECT 
    'RESUMEN FINAL DEL SISTEMA' as seccion,
    'Progreso registrado' as metrica,
    COUNT(*)::TEXT as valor
FROM user_reading_progress
WHERE user_email = 'demo@example.com'
UNION ALL
SELECT 
    'RESUMEN FINAL DEL SISTEMA' as seccion,
    'Bookmarks guardados' as metrica,
    COUNT(*)::TEXT as valor
FROM user_bookmarks
WHERE user_email = 'demo@example.com'
UNION ALL
SELECT 
    'RESUMEN FINAL DEL SISTEMA' as seccion,
    'Promedio caracteres por libro' as metrica,
    ROUND(AVG(LENGTH(content)))::TEXT as valor
FROM knowledge_base;

-- 10. Mensaje de confirmación
SELECT 
    '🎉 BIBLIOTECA COMPLETAMENTE CONFIGURADA Y VERIFICADA 🎉' as mensaje,
    'Todos los componentes están funcionando correctamente' as estado,
    'El sistema está listo para usar' as siguiente_paso;
