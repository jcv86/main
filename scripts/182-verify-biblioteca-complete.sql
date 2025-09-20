-- Verificar que la biblioteca esté completamente configurada
-- Verify that the library is completely configured

-- 1. Verificar libros insertados
SELECT 
    'LIBROS EN LA BIBLIOTECA' as section,
    id,
    title,
    category,
    author,
    array_length(tags, 1) as num_tags,
    length(content) as content_length,
    slug
FROM knowledge_base
ORDER BY id;

-- 2. Verificar progreso de lectura del usuario demo
SELECT 
    'PROGRESO DE LECTURA - USUARIO DEMO' as section,
    urp.book_id,
    kb.title,
    urp.reading_progress,
    urp.target_percentage,
    urp.status,
    urp.reading_time_minutes,
    urp.notes
FROM user_reading_progress urp
JOIN knowledge_base kb ON urp.book_id = kb.id
WHERE urp.user_email = 'demo@example.com'
ORDER BY urp.book_id;

-- 3. Verificar bookmarks del usuario demo
SELECT 
    'BOOKMARKS - USUARIO DEMO' as section,
    ub.book_id,
    kb.title,
    ub.bookmark_note,
    ub.created_at
FROM user_bookmarks ub
JOIN knowledge_base kb ON ub.book_id = kb.id
WHERE ub.user_email = 'demo@example.com'
ORDER BY ub.book_id;

-- 4. Verificar objetivos de lectura
SELECT 
    'OBJETIVOS DE LECTURA - USUARIO DEMO' as section,
    goal_type,
    target_value,
    current_value,
    period_start,
    period_end,
    status
FROM reading_goals
WHERE user_email = 'demo@example.com'
ORDER BY goal_type;

-- 5. Verificar sesiones de lectura
SELECT 
    'SESIONES DE LECTURA - USUARIO DEMO' as section,
    rs.book_id,
    kb.title,
    rs.duration_minutes,
    rs.progress_start,
    rs.progress_end,
    rs.pages_read,
    rs.session_start
FROM reading_sessions rs
JOIN knowledge_base kb ON rs.book_id = kb.id
WHERE rs.user_email = 'demo@example.com'
ORDER BY rs.session_start DESC;

-- 6. Resumen final
SELECT 
    'RESUMEN FINAL' as section,
    (SELECT COUNT(*) FROM knowledge_base) as total_libros,
    (SELECT COUNT(*) FROM user_reading_progress WHERE user_email = 'demo@example.com') as libros_en_progreso,
    (SELECT COUNT(*) FROM user_bookmarks WHERE user_email = 'demo@example.com') as total_bookmarks,
    (SELECT COUNT(*) FROM reading_goals WHERE user_email = 'demo@example.com') as objetivos_activos,
    (SELECT COUNT(*) FROM reading_sessions WHERE user_email = 'demo@example.com') as sesiones_registradas,
    (SELECT SUM(reading_time_minutes) FROM user_reading_progress WHERE user_email = 'demo@example.com') as tiempo_total_lectura_minutos;
