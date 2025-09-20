-- Crear funciones faltantes eliminando primero las existentes para evitar conflictos de tipo
-- Create missing functions by first dropping existing ones to avoid type conflicts

-- 1. Eliminar todas las funciones existentes que puedan tener conflictos de tipo
DROP FUNCTION IF EXISTS search_knowledge_base(TEXT, TEXT, INTEGER);
DROP FUNCTION IF EXISTS search_knowledge_base(TEXT, TEXT);
DROP FUNCTION IF EXISTS search_knowledge_base(TEXT);
DROP FUNCTION IF EXISTS search_knowledge_base();
DROP FUNCTION IF EXISTS update_reading_progress(TEXT, INTEGER, INTEGER, TEXT);
DROP FUNCTION IF EXISTS update_reading_progress(TEXT, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS get_user_reading_stats(TEXT);
DROP FUNCTION IF EXISTS get_books_by_status(TEXT, TEXT);
DROP FUNCTION IF EXISTS increment_read_count(INTEGER);

-- 2. Función para buscar en la base de conocimiento
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
        kb.id,
        kb.title,
        kb.category,
        kb.author,
        kb.tags,
        kb.slug,
        COALESCE(kb.read_count, 0) as read_count,
        CASE 
            WHEN search_term IS NULL THEN 1.0
            ELSE (
                CASE WHEN kb.title ILIKE '%' || search_term || '%' THEN 0.4 ELSE 0.0 END +
                CASE WHEN kb.author ILIKE '%' || search_term || '%' THEN 0.3 ELSE 0.0 END +
                CASE WHEN kb.content ILIKE '%' || search_term || '%' THEN 0.2 ELSE 0.0 END +
                CASE WHEN EXISTS (SELECT 1 FROM unnest(kb.tags) AS tag WHERE tag ILIKE '%' || search_term || '%') THEN 0.1 ELSE 0.0 END
            )
        END::NUMERIC AS relevance_score
    FROM knowledge_base kb
    WHERE 
        (search_term IS NULL OR 
         kb.title ILIKE '%' || search_term || '%' OR 
         kb.author ILIKE '%' || search_term || '%' OR 
         kb.content ILIKE '%' || search_term || '%' OR
         EXISTS (SELECT 1 FROM unnest(kb.tags) AS tag WHERE tag ILIKE '%' || search_term || '%'))
        AND (category_filter IS NULL OR kb.category = category_filter)
    ORDER BY 
        CASE WHEN search_term IS NULL THEN COALESCE(kb.read_count, 0) ELSE relevance_score END DESC,
        COALESCE(kb.read_count, 0) DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- 3. Función para actualizar progreso de lectura
CREATE OR REPLACE FUNCTION update_reading_progress(
    user_email_param TEXT,
    book_id_param INTEGER,
    progress_param INTEGER,
    status_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_status TEXT;
    new_status TEXT;
BEGIN
    -- Obtener estado actual
    SELECT status INTO current_status 
    FROM user_reading_progress 
    WHERE user_email = user_email_param AND book_id = book_id_param;
    
    -- Determinar nuevo estado
    new_status := COALESCE(status_param, 
        CASE 
            WHEN progress_param = 0 THEN 'not_started'
            WHEN progress_param >= 100 THEN 'completed'
            WHEN progress_param > 0 THEN 'reading'
            ELSE COALESCE(current_status, 'not_started')
        END
    );
    
    -- Insertar o actualizar progreso
    INSERT INTO user_reading_progress (
        user_email, 
        book_id, 
        reading_progress, 
        status,
        reading_time_minutes,
        started_at,
        completed_at,
        last_read_at,
        updated_at
    ) VALUES (
        user_email_param,
        book_id_param,
        progress_param,
        new_status,
        0,
        CASE WHEN progress_param > 0 THEN NOW() ELSE NULL END,
        CASE WHEN new_status = 'completed' THEN NOW() ELSE NULL END,
        CASE WHEN progress_param > 0 THEN NOW() ELSE NULL END,
        NOW()
    )
    ON CONFLICT (user_email, book_id) 
    DO UPDATE SET
        reading_progress = progress_param,
        status = new_status,
        completed_at = CASE WHEN new_status = 'completed' THEN NOW() ELSE user_reading_progress.completed_at END,
        last_read_at = CASE WHEN progress_param > user_reading_progress.reading_progress THEN NOW() ELSE user_reading_progress.last_read_at END,
        updated_at = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 4. Función para obtener estadísticas de lectura del usuario
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
        (SELECT COUNT(*)::INTEGER FROM knowledge_base) as total_books,
        (SELECT COUNT(*)::INTEGER FROM user_reading_progress WHERE user_email = user_email_param AND status = 'completed') as completed_books,
        (SELECT COUNT(*)::INTEGER FROM user_reading_progress WHERE user_email = user_email_param AND status = 'reading') as reading_books,
        (SELECT COUNT(*)::INTEGER FROM user_reading_progress WHERE user_email = user_email_param AND status = 'not_started') as not_started_books,
        (SELECT COUNT(*)::INTEGER FROM user_reading_progress WHERE user_email = user_email_param AND status = 'paused') as paused_books,
        (SELECT COALESCE(SUM(reading_time_minutes), 0)::INTEGER FROM user_reading_progress WHERE user_email = user_email_param) as total_reading_time,
        (SELECT COALESCE(AVG(reading_progress), 0)::NUMERIC FROM user_reading_progress WHERE user_email = user_email_param) as average_progress,
        (SELECT COUNT(*)::INTEGER FROM user_bookmarks WHERE user_email = user_email_param) as bookmarks_count,
        (SELECT COUNT(*)::INTEGER FROM book_reviews WHERE user_email = user_email_param) as reviews_count,
        (SELECT kb.category 
         FROM user_reading_progress urp 
         JOIN knowledge_base kb ON urp.book_id = kb.id 
         WHERE urp.user_email = user_email_param 
         GROUP BY kb.category 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as favorite_category;
END;
$$ LANGUAGE plpgsql;

-- 5. Función para obtener libros por estado
CREATE OR REPLACE FUNCTION get_books_by_status(
    user_email_param TEXT,
    status_filter TEXT
)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    category TEXT,
    content TEXT,
    author TEXT,
    tags TEXT[],
    slug TEXT,
    read_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    reading_progress INTEGER,
    target_percentage INTEGER,
    status TEXT,
    reading_time_minutes INTEGER,
    last_read_at TIMESTAMP WITH TIME ZONE,
    is_bookmarked BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        kb.id,
        kb.title,
        kb.category,
        kb.content,
        kb.author,
        kb.tags,
        kb.slug,
        COALESCE(kb.read_count, 0) as read_count,
        kb.created_at,
        kb.updated_at,
        urp.reading_progress,
        urp.target_percentage,
        urp.status,
        urp.reading_time_minutes,
        urp.last_read_at,
        EXISTS (SELECT 1 FROM user_bookmarks ub WHERE ub.user_email = user_email_param AND ub.book_id = kb.id) as is_bookmarked
    FROM knowledge_base kb
    JOIN user_reading_progress urp ON kb.id = urp.book_id
    WHERE urp.user_email = user_email_param 
        AND urp.status = status_filter
    ORDER BY urp.last_read_at DESC NULLS LAST, kb.title;
END;
$$ LANGUAGE plpgsql;

-- 6. Función para incrementar contador de lecturas
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

-- 7. Verificar que todas las funciones se crearon correctamente
SELECT 
    'FUNCIONES CREADAS CORRECTAMENTE' as status,
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
    AND routine_name IN (
        'search_knowledge_base',
        'update_reading_progress', 
        'get_user_reading_stats',
        'get_books_by_status',
        'increment_read_count'
    )
ORDER BY routine_name;

-- 8. Probar las funciones básicas
SELECT 'PROBANDO FUNCIONES...' as test_status;

-- Probar búsqueda
SELECT 'Prueba search_knowledge_base:' as test;
SELECT title, relevance_score FROM search_knowledge_base('liderazgo', NULL, 3);

-- Probar estadísticas (puede no devolver datos si no hay usuario demo)
SELECT 'Prueba get_user_reading_stats:' as test;
SELECT * FROM get_user_reading_stats('demo@example.com');

-- Probar incremento de contador
SELECT 'Prueba increment_read_count:' as test;
SELECT increment_read_count(1);
