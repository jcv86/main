-- Arreglar error de estructura de consulta que no coincide con el tipo de resultado de la función
-- Fix "structure of query does not match function result type" error

-- 1. Eliminar todas las funciones existentes para evitar conflictos
DROP FUNCTION IF EXISTS increment_read_count(INTEGER);
DROP FUNCTION IF EXISTS search_knowledge_base(TEXT, TEXT, INTEGER);
DROP FUNCTION IF EXISTS get_user_reading_stats(TEXT);
DROP FUNCTION IF EXISTS get_book_recommendations(TEXT, INTEGER);
DROP FUNCTION IF EXISTS update_reading_progress(TEXT, INTEGER, INTEGER, INTEGER, TEXT);
DROP FUNCTION IF EXISTS get_books_by_status(TEXT, TEXT);

-- 2. Verificar estructura exacta de knowledge_base
DO $$
BEGIN
    -- Mostrar estructura de knowledge_base
    RAISE NOTICE 'Estructura de knowledge_base:';
    FOR rec IN 
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'knowledge_base' 
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE '  %: %', rec.column_name, rec.data_type;
    END LOOP;
END $$;

-- 3. Verificar estructura exacta de user_reading_progress
DO $$
BEGIN
    -- Mostrar estructura de user_reading_progress
    RAISE NOTICE 'Estructura de user_reading_progress:';
    FOR rec IN 
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'user_reading_progress' 
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE '  %: %', rec.column_name, rec.data_type;
    END LOOP;
END $$;

-- 4. Función simple para incrementar contador de lecturas
CREATE OR REPLACE FUNCTION increment_read_count(p_book_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE knowledge_base 
    SET read_count = COALESCE(read_count, 0) + 1,
        updated_at = NOW()
    WHERE id = p_book_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Función de búsqueda simplificada que coincida exactamente con knowledge_base
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
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    relevance_score NUMERIC
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
        -- Calcular relevancia como NUMERIC
        (
            CASE WHEN kb.title ILIKE '%' || search_query || '%' THEN 3.0 ELSE 0.0 END +
            CASE WHEN kb.content ILIKE '%' || search_query || '%' THEN 1.0 ELSE 0.0 END +
            CASE WHEN array_to_string(kb.tags, ' ') ILIKE '%' || search_query || '%' THEN 2.0 ELSE 0.0 END +
            CASE WHEN kb.author ILIKE '%' || search_query || '%' THEN 1.5 ELSE 0.0 END
        )::NUMERIC as relevance_score
    FROM knowledge_base kb
    WHERE 
        (
            kb.title ILIKE '%' || search_query || '%' OR
            kb.content ILIKE '%' || search_query || '%' OR
            kb.author ILIKE '%' || search_query || '%' OR
            array_to_string(kb.tags, ' ') ILIKE '%' || search_query || '%'
        )
        AND (category_filter IS NULL OR kb.category = category_filter)
    ORDER BY relevance_score DESC, COALESCE(kb.read_count, 0) DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- 6. Función de estadísticas de usuario simplificada
CREATE OR REPLACE FUNCTION get_user_reading_stats(p_user_email TEXT)
RETURNS TABLE(
    total_books BIGINT,
    completed_books BIGINT,
    reading_books BIGINT,
    paused_books BIGINT,
    total_reading_time INTEGER,
    avg_progress NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_books,
        COUNT(CASE WHEN urp.status = 'completed' THEN 1 END) as completed_books,
        COUNT(CASE WHEN urp.status = 'reading' THEN 1 END) as reading_books,
        COUNT(CASE WHEN urp.status = 'paused' THEN 1 END) as paused_books,
        COALESCE(SUM(urp.reading_time_minutes), 0)::INTEGER as total_reading_time,
        COALESCE(AVG(urp.reading_progress), 0)::NUMERIC as avg_progress
    FROM user_reading_progress urp
    WHERE urp.user_email = p_user_email;
END;
$$ LANGUAGE plpgsql;

-- 7. Función para actualizar progreso de lectura
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

-- 8. Función para obtener libros por estado
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
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    reading_progress INTEGER,
    target_percentage INTEGER,
    status TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_read_at TIMESTAMP WITH TIME ZONE
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
        urp.started_at,
        urp.completed_at,
        urp.last_read_at
    FROM knowledge_base kb
    JOIN user_reading_progress urp ON kb.id = urp.book_id
    WHERE urp.user_email = p_user_email 
    AND urp.status = p_status
    ORDER BY urp.last_read_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- 9. Probar las funciones para verificar que funcionan
SELECT 'Probando increment_read_count...' as test;
SELECT increment_read_count(1);

SELECT 'Probando search_knowledge_base...' as test;
SELECT title, relevance_score FROM search_knowledge_base('liderazgo', NULL, 3);

SELECT 'Probando get_user_reading_stats...' as test;
SELECT * FROM get_user_reading_stats('demo@example.com');

SELECT 'Probando update_reading_progress...' as test;
SELECT update_reading_progress('demo@example.com', 1, 50, 100, 'reading');

SELECT 'Probando get_books_by_status...' as test;
SELECT title, status FROM get_books_by_status('demo@example.com', 'reading') LIMIT 3;

-- 10. Verificar que todas las funciones se crearon correctamente
SELECT 
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

-- 11. Mostrar resumen de configuración
SELECT 
    'FUNCIONES CORREGIDAS Y VERIFICADAS' as status,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name LIKE '%book%' OR routine_name LIKE '%reading%') as funciones_creadas,
    (SELECT COUNT(*) FROM knowledge_base) as total_libros,
    (SELECT COUNT(*) FROM user_reading_progress) as registros_progreso;
