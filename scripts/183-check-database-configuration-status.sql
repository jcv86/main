-- Verificar el estado actual de la configuración de la base de datos
-- Check current database configuration status

-- 1. Verificar tablas existentes
SELECT 'TABLAS EXISTENTES' as check_type;
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN (
        'knowledge_base',
        'user_reading_progress', 
        'user_bookmarks',
        'reading_goals',
        'reading_sessions',
        'book_reviews',
        'user_profiles'
    )
ORDER BY table_name;

-- 2. Verificar funciones existentes
SELECT 'FUNCIONES EXISTENTES' as check_type;
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
    AND (routine_name LIKE '%book%' OR routine_name LIKE '%reading%' OR routine_name LIKE '%knowledge%')
ORDER BY routine_name;

-- 3. Verificar datos en knowledge_base
SELECT 'DATOS EN KNOWLEDGE_BASE' as check_type;
SELECT 
    COUNT(*) as total_books,
    COUNT(DISTINCT category) as categories,
    COUNT(DISTINCT author) as authors,
    AVG(LENGTH(content)) as avg_content_length
FROM knowledge_base;

-- 4. Verificar datos de progreso de lectura
SELECT 'DATOS DE PROGRESO DE LECTURA' as check_type;
SELECT 
    COUNT(*) as total_progress_records,
    COUNT(DISTINCT user_email) as unique_users,
    COUNT(DISTINCT book_id) as books_with_progress,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_books,
    COUNT(CASE WHEN status = 'reading' THEN 1 END) as books_being_read
FROM user_reading_progress;

-- 5. Verificar integridad de datos
SELECT 'INTEGRIDAD DE DATOS' as check_type;
SELECT 
    'user_reading_progress -> knowledge_base' as relation,
    COUNT(*) as total_records,
    COUNT(CASE WHEN kb.id IS NULL THEN 1 END) as orphaned_records
FROM user_reading_progress urp
LEFT JOIN knowledge_base kb ON urp.book_id = kb.id;

-- 6. Verificar bookmarks
SELECT 'BOOKMARKS' as check_type;
SELECT 
    COUNT(*) as total_bookmarks,
    COUNT(DISTINCT user_email) as users_with_bookmarks,
    COUNT(DISTINCT book_id) as bookmarked_books
FROM user_bookmarks;

-- 7. Verificar índices importantes
SELECT 'ÍNDICES EXISTENTES' as check_type;
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
    AND tablename IN ('knowledge_base', 'user_reading_progress', 'user_bookmarks')
ORDER BY tablename, indexname;

-- 8. Verificar constraints
SELECT 'CONSTRAINTS' as check_type;
SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name,
    contype as constraint_type,
    confrelid::regclass as referenced_table
FROM pg_constraint 
WHERE connamespace = 'public'::regnamespace
    AND conrelid::regclass::text IN ('knowledge_base', 'user_reading_progress', 'user_bookmarks', 'reading_goals', 'reading_sessions', 'book_reviews')
ORDER BY table_name, constraint_type;

-- 9. Resumen final
SELECT 'RESUMEN FINAL' as check_type;
SELECT 
    'knowledge_base' as tabla,
    COUNT(*) as registros
FROM knowledge_base
UNION ALL
SELECT 
    'user_reading_progress' as tabla,
    COUNT(*) as registros
FROM user_reading_progress
UNION ALL
SELECT 
    'user_bookmarks' as tabla,
    COUNT(*) as registros
FROM user_bookmarks
UNION ALL
SELECT 
    'reading_goals' as tabla,
    COUNT(*) as registros
FROM reading_goals
UNION ALL
SELECT 
    'reading_sessions' as tabla,
    COUNT(*) as registros
FROM reading_sessions
UNION ALL
SELECT 
    'book_reviews' as tabla,
    COUNT(*) as registros
FROM book_reviews;
