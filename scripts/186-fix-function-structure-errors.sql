-- Arreglar errores de estructura de funciones
-- Fix function structure errors

-- 1. Eliminar todas las funciones problemáticas
DROP FUNCTION IF EXISTS search_knowledge_base(TEXT, TEXT, INTEGER);
DROP FUNCTION IF EXISTS update_reading_progress(TEXT, INTEGER, INTEGER, TEXT);
DROP FUNCTION IF EXISTS get_user_reading_stats(TEXT);
DROP FUNCTION IF EXISTS get_books_by_status(TEXT, TEXT);
DROP FUNCTION IF EXISTS increment_read_count(INTEGER);

-- 2. Verificar estructura actual de knowledge_base
SELECT 'ESTRUCTURA KNOWLEDGE_BASE' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'knowledge_base' 
ORDER BY ordinal_position;

-- 3. Verificar estructura actual de user_reading_progress
SELECT 'ESTRUCTURA USER_READING_PROGRESS' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_reading_progress' 
ORDER BY ordinal_position;

-- 4. Crear función de búsqueda simple que coincida con la estructura real
CREATE OR REPLACE FUNCTION search_knowledge_base(
    search_term TEXT DEFAULT NULL,
    category_filter TEXT DEFAULT NULL,
    limit_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    category TEXT,
    author TEXT,
    tags TEXT[],
    slug TEXT,
    read_count INTEGER,
    relevance_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        kb.id::INTEGER,
        kb.title::TEXT,
        kb.category::TEXT,
        kb.author::TEXT,
        COALESCE(kb.tags, ARRAY[]::TEXT[])::TEXT[],
        kb.slug::TEXT,
        COALESCE(kb.read_count, 0)::INTEGER,
        1.0::NUMERIC as relevance_score
    FROM knowledge_base kb
    WHERE 
        (search_term IS NULL OR 
         kb.title ILIKE '%' || search_term || '%' OR 
         kb.author ILIKE '%' || search_term || '%' OR 
         kb.content ILIKE '%' || search_term || '%')
        AND (category_filter IS NULL OR kb.category = category_filter)
    ORDER BY COALESCE(kb.read_count, 0) DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- 5. Crear función simple para actualizar progreso
CREATE OR REPLACE FUNCTION update_reading_progress(
    user_email_param TEXT,
    book_id_param INTEGER,
    progress_param INTEGER,
    status_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Determinar estado basado en progreso
    INSERT INTO user_reading_progress (
        user_email, 
        book_id, 
        reading_progress, 
        status,
        target_percentage,
        reading_time_minutes,
        last_read_at,
        updated_at
    ) VALUES (
        user_email_param,
        book_id_param,
        progress_param,
        COALESCE(status_param, 
            CASE 
                WHEN progress_param = 0 THEN 'not_started'
                WHEN progress_param >= 100 THEN 'completed'
                ELSE 'reading'
            END
        ),
        100,
        0,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_email, book_id) 
    DO UPDATE SET
        reading_progress = progress_param,
        status = COALESCE(status_param, 
            CASE 
                WHEN progress_param = 0 THEN 'not_started'
                WHEN progress_param >= 100 THEN 'completed'
                ELSE 'reading'
            END
        ),
        last_read_at = NOW(),
        updated_at = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 6. Crear función simple para estadísticas
CREATE OR REPLACE FUNCTION get_user_reading_stats(user_email_param TEXT)
RETURNS TABLE (
    total_books INTEGER,
    completed_books INTEGER,
    reading_books INTEGER,
    not_started_books INTEGER,
    paused_books INTEGER,
    total_reading_time INTEGER,
    average_progress NUMERIC,
    bookmarks_count INTEGER,
    reviews_count INTEGER,
    favorite_category TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM knowledge_base),
        (SELECT COUNT(*)::INTEGER FROM user_reading_progress WHERE user_email = user_email_param AND status = 'completed'),
        (SELECT COUNT(*)::INTEGER FROM user_reading_progress WHERE user_email = user_email_param AND status = 'reading'),
        (SELECT COUNT(*)::INTEGER FROM user_reading_progress WHERE user_email = user_email_param AND status = 'not_started'),
        (SELECT COUNT(*)::INTEGER FROM user_reading_progress WHERE user_email = user_email_param AND status = 'paused'),
        (SELECT COALESCE(SUM(reading_time_minutes), 0)::INTEGER FROM user_reading_progress WHERE user_email = user_email_param),
        (SELECT COALESCE(AVG(reading_progress), 0)::NUMERIC FROM user_reading_progress WHERE user_email = user_email_param),
        (SELECT COUNT(*)::INTEGER FROM user_bookmarks WHERE user_email = user_email_param),
        0::INTEGER as reviews_count,
        (SELECT 'Desarrollo Personal'::TEXT) as favorite_category;
END;
$$ LANGUAGE plpgsql;

-- 7. Crear función simple para incrementar contador
CREATE OR REPLACE FUNCTION increment_read_count(book_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    UPDATE knowledge_base 
    SET read_count = COALESCE(read_count, 0) + 1,
        updated_at = NOW()
    WHERE id = book_id_param
    RETURNING read_count INTO new_count;
    
    RETURN COALESCE(new_count, 0);
END;
$$ LANGUAGE plpgsql;

-- 8. Verificar que las funciones se crearon correctamente
SELECT 'VERIFICACION FUNCIONES' as status;
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
    AND routine_name IN (
        'search_knowledge_base',
        'update_reading_progress', 
        'get_user_reading_stats',
        'increment_read_count'
    )
ORDER BY routine_name;

-- 9. Probar las funciones
SELECT 'PRUEBA SEARCH' as test;
SELECT title, author FROM search_knowledge_base('liderazgo', NULL, 2);

SELECT 'PRUEBA STATS' as test;
SELECT total_books, completed_books FROM get_user_reading_stats('demo@example.com');

SELECT 'PRUEBA INCREMENT' as test;
SELECT increment_read_count(1) as new_count;
