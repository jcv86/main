-- Crear funciones que pueden estar faltando para la biblioteca
-- Create missing functions for the library

-- 1. Eliminar funciones existentes para evitar conflictos de tipo de retorno
DROP FUNCTION IF EXISTS increment_read_count(INTEGER);
DROP FUNCTION IF EXISTS search_knowledge_base(TEXT, TEXT, INTEGER);
DROP FUNCTION IF EXISTS get_user_reading_stats(TEXT);
DROP FUNCTION IF EXISTS get_book_recommendations(TEXT, INTEGER);
DROP FUNCTION IF EXISTS update_reading_progress(TEXT, INTEGER, INTEGER, INTEGER, TEXT);
DROP FUNCTION IF EXISTS get_books_by_status(TEXT, TEXT);

-- 2. Función para incrementar contador de lecturas
CREATE OR REPLACE FUNCTION increment_read_count(book_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE knowledge_base 
    SET read_count = read_count + 1,
        updated_at = NOW()
    WHERE id = book_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Función para buscar en la base de conocimientos
CREATE OR REPLACE FUNCTION search_knowledge_base(
    search_query TEXT,
    category_filter TEXT DEFAULT NULL,
    limit_results INTEGER DEFAULT 50
)
RETURNS TABLE(
    id INTEGER,
    title TEXT,
    category TEXT,
    content TEXT,
    author TEXT,
    tags TEXT[],
    slug TEXT,
    read_count INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    relevance_score FLOAT
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
        kb.read_count,
        kb.created_at,
        kb.updated_at,
        -- Calcular relevancia basada en coincidencias en título, contenido y tags
        (
            CASE WHEN kb.title ILIKE '%' || search_query || '%' THEN 3.0 ELSE 0.0 END +
            CASE WHEN kb.content ILIKE '%' || search_query || '%' THEN 1.0 ELSE 0.0 END +
            CASE WHEN array_to_string(kb.tags, ' ') ILIKE '%' || search_query || '%' THEN 2.0 ELSE 0.0 END +
            CASE WHEN kb.author ILIKE '%' || search_query || '%' THEN 1.5 ELSE 0.0 END
        ) as relevance_score
    FROM knowledge_base kb
    WHERE 
        (
            kb.title ILIKE '%' || search_query || '%' OR
            kb.content ILIKE '%' || search_query || '%' OR
            kb.author ILIKE '%' || search_query || '%' OR
            array_to_string(kb.tags, ' ') ILIKE '%' || search_query || '%'
        )
        AND (category_filter IS NULL OR kb.category = category_filter)
    ORDER BY relevance_score DESC, kb.read_count DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- 4. Función para obtener estadísticas de lectura de un usuario
CREATE OR REPLACE FUNCTION get_user_reading_stats(p_user_email TEXT)
RETURNS TABLE(
    total_books INTEGER,
    completed_books INTEGER,
    reading_books INTEGER,
    paused_books INTEGER,
    total_pages_read INTEGER,
    total_reading_time INTEGER,
    avg_progress FLOAT,
    bookmarks_count INTEGER,
    reviews_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_books,
        COUNT(CASE WHEN urp.status = 'completed' THEN 1 END)::INTEGER as completed_books,
        COUNT(CASE WHEN urp.status = 'reading' THEN 1 END)::INTEGER as reading_books,
        COUNT(CASE WHEN urp.status = 'paused' THEN 1 END)::INTEGER as paused_books,
        COALESCE(SUM(
            CASE WHEN urp.status = 'completed' 
            THEN CEIL(LENGTH(kb.content) / 2000.0)::INTEGER 
            ELSE 0 END
        ), 0)::INTEGER as total_pages_read,
        COALESCE(SUM(urp.reading_time_minutes), 0)::INTEGER as total_reading_time,
        COALESCE(AVG(urp.reading_progress), 0)::FLOAT as avg_progress,
        (SELECT COUNT(*) FROM user_bookmarks WHERE user_email = p_user_email)::INTEGER as bookmarks_count,
        (SELECT COUNT(*) FROM book_reviews WHERE user_email = p_user_email)::INTEGER as reviews_count
    FROM user_reading_progress urp
    LEFT JOIN knowledge_base kb ON urp.book_id = kb.id
    WHERE urp.user_email = p_user_email;
END;
$$ LANGUAGE plpgsql;

-- 5. Función para obtener recomendaciones de libros
CREATE OR REPLACE FUNCTION get_book_recommendations(
    p_user_email TEXT,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
    id INTEGER,
    title TEXT,
    category TEXT,
    content TEXT,
    author TEXT,
    tags TEXT[],
    slug TEXT,
    read_count INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    recommendation_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    WITH user_categories AS (
        -- Obtener categorías que el usuario ha leído más
        SELECT 
            kb.category,
            COUNT(*) as category_count,
            AVG(urp.reading_progress) as avg_progress
        FROM user_reading_progress urp
        JOIN knowledge_base kb ON urp.book_id = kb.id
        WHERE urp.user_email = p_user_email
        GROUP BY kb.category
    ),
    user_completed_books AS (
        -- Libros que el usuario ya completó
        SELECT book_id
        FROM user_reading_progress
        WHERE user_email = p_user_email AND status = 'completed'
    )
    SELECT 
        kb.id,
        kb.title,
        kb.category,
        kb.content,
        kb.author,
        kb.tags,
        kb.slug,
        kb.read_count,
        kb.created_at,
        kb.updated_at,
        -- Calcular score de recomendación
        (
            COALESCE(uc.category_count * 2.0, 0) +  -- Preferencia por categorías leídas
            (kb.read_count / 10.0) +  -- Popularidad general
            CASE WHEN kb.created_at > NOW() - INTERVAL '30 days' THEN 1.0 ELSE 0.0 END  -- Novedad
        ) as recommendation_score
    FROM knowledge_base kb
    LEFT JOIN user_categories uc ON kb.category = uc.category
    WHERE kb.id NOT IN (SELECT book_id FROM user_completed_books)
    ORDER BY recommendation_score DESC, kb.read_count DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- 6. Función para actualizar progreso de lectura
CREATE OR REPLACE FUNCTION update_reading_progress(
    p_user_email TEXT,
    p_book_id INTEGER,
    p_progress INTEGER,
    p_target_percentage INTEGER DEFAULT 100,
    p_status TEXT DEFAULT 'reading'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_reading_progress (
        user_email,
        book_id,
        reading_progress,
        target_percentage,
        status,
        started_at,
        last_read_at,
        updated_at
    )
    VALUES (
        p_user_email,
        p_book_id,
        p_progress,
        p_target_percentage,
        p_status,
        CASE WHEN p_progress > 0 THEN NOW() ELSE NULL END,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_email, book_id)
    DO UPDATE SET
        reading_progress = GREATEST(user_reading_progress.reading_progress, p_progress),
        target_percentage = p_target_percentage,
        status = p_status,
        last_read_at = NOW(),
        updated_at = NOW(),
        completed_at = CASE 
            WHEN p_progress >= p_target_percentage AND p_status = 'completed' 
            THEN NOW() 
            ELSE user_reading_progress.completed_at 
        END;
END;
$$ LANGUAGE plpgsql;

-- 7. Función para obtener libros por estado
CREATE OR REPLACE FUNCTION get_books_by_status(
    p_user_email TEXT,
    p_status TEXT
)
RETURNS TABLE(
    id INTEGER,
    title TEXT,
    category TEXT,
    content TEXT,
    author TEXT,
    tags TEXT[],
    slug TEXT,
    read_count INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    reading_progress INTEGER,
    target_percentage INTEGER,
    status TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_read_at TIMESTAMP
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
        kb.read_count,
        kb.created_at,
        kb.updated_at,
        urp.reading_progress,
        urp.target_percentage,
        urp.status,
        urp.started_at,
        urp.completed_at,
        urp.last_read_at
    FROM knowledge_base kb
    JOIN user_reading_progress urp ON kb.id = urp.book_id
    WHERE urp.user_email = p_user_email 
    AND urp.status = p_status
    ORDER BY urp.last_read_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 8. Verificar que las funciones se crearon correctamente
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'increment_read_count',
    'search_knowledge_base',
    'get_user_reading_stats',
    'get_book_recommendations',
    'update_reading_progress',
    'get_books_by_status'
)
ORDER BY routine_name;
