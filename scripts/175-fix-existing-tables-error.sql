-- Arreglar error de tablas existentes y configurar sistema completo
-- Fix existing tables error and set up complete system

-- 1. Eliminar tablas existentes para recrear con estructura correcta
DROP TABLE IF EXISTS reading_sessions CASCADE;
DROP TABLE IF EXISTS book_reviews CASCADE;
DROP TABLE IF EXISTS reading_goals CASCADE;
DROP TABLE IF EXISTS user_bookmarks CASCADE;
DROP TABLE IF EXISTS user_reading_progress CASCADE;

-- 2. Eliminar funciones existentes para recrear con tipos correctos
DROP FUNCTION IF EXISTS increment_read_count(INTEGER);
DROP FUNCTION IF EXISTS search_knowledge_base(TEXT, TEXT, INTEGER);
DROP FUNCTION IF EXISTS get_user_reading_stats(TEXT);
DROP FUNCTION IF EXISTS update_reading_progress(TEXT, INTEGER, INTEGER, TEXT);
DROP FUNCTION IF EXISTS get_books_by_status(TEXT, TEXT);

-- 3. Asegurar que knowledge_base existe con estructura correcta
CREATE TABLE IF NOT EXISTS knowledge_base (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    slug TEXT UNIQUE NOT NULL,
    read_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla de progreso de lectura de usuarios
CREATE TABLE user_reading_progress (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    reading_progress INTEGER DEFAULT 0 CHECK (reading_progress >= 0 AND reading_progress <= 100),
    target_percentage INTEGER DEFAULT 100 CHECK (target_percentage >= 0 AND target_percentage <= 100),
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'reading', 'completed', 'paused')),
    notes TEXT,
    reading_time_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- 5. Crear tabla de bookmarks de usuarios
CREATE TABLE user_bookmarks (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    bookmark_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- 6. Crear tabla de sesiones de lectura
CREATE TABLE reading_sessions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    progress_start INTEGER DEFAULT 0,
    progress_end INTEGER DEFAULT 0,
    pages_read INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Crear tabla de reseñas de libros
CREATE TABLE book_reviews (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_recommended BOOLEAN DEFAULT true,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- 8. Crear tabla de objetivos de lectura
CREATE TABLE reading_goals (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    goal_type VARCHAR(50) NOT NULL,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Crear índices para optimizar consultas
CREATE INDEX idx_user_reading_progress_user_email ON user_reading_progress(user_email);
CREATE INDEX idx_user_reading_progress_book_id ON user_reading_progress(book_id);
CREATE INDEX idx_user_reading_progress_status ON user_reading_progress(status);
CREATE INDEX idx_user_reading_progress_last_read ON user_reading_progress(last_read_at DESC);

CREATE INDEX idx_user_bookmarks_user_email ON user_bookmarks(user_email);
CREATE INDEX idx_user_bookmarks_book_id ON user_bookmarks(book_id);
CREATE INDEX idx_user_bookmarks_created ON user_bookmarks(created_at DESC);

CREATE INDEX idx_reading_sessions_user_email ON reading_sessions(user_email);
CREATE INDEX idx_reading_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX idx_reading_sessions_start ON reading_sessions(session_start DESC);

CREATE INDEX idx_book_reviews_book_id ON book_reviews(book_id);
CREATE INDEX idx_book_reviews_rating ON book_reviews(rating DESC);
CREATE INDEX idx_book_reviews_created ON book_reviews(created_at DESC);

CREATE INDEX idx_reading_goals_user_email ON reading_goals(user_email);
CREATE INDEX idx_reading_goals_status ON reading_goals(status);
CREATE INDEX idx_reading_goals_period ON reading_goals(period_start, period_end);

CREATE INDEX idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX idx_knowledge_base_read_count ON knowledge_base(read_count DESC);
CREATE INDEX idx_knowledge_base_created_at ON knowledge_base(created_at DESC);

-- 10. Crear funciones con tipos correctos
CREATE OR REPLACE FUNCTION increment_read_count(book_id_param INTEGER)
RETURNS INTEGER AS $$
BEGIN
    UPDATE knowledge_base 
    SET read_count = read_count + 1, updated_at = NOW()
    WHERE id = book_id_param;
    
    RETURN (SELECT read_count FROM knowledge_base WHERE id = book_id_param);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_knowledge_base(
    search_term TEXT DEFAULT NULL,
    category_filter TEXT DEFAULT NULL,
    limit_results INTEGER DEFAULT 10
)
RETURNS TABLE(
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
        kb.read_count,
        CASE 
            WHEN search_term IS NULL THEN 1.0::NUMERIC
            ELSE (
                CASE WHEN LOWER(kb.title) LIKE LOWER('%' || search_term || '%') THEN 3.0 ELSE 0.0 END +
                CASE WHEN LOWER(kb.content) LIKE LOWER('%' || search_term || '%') THEN 2.0 ELSE 0.0 END +
                CASE WHEN LOWER(kb.author) LIKE LOWER('%' || search_term || '%') THEN 1.5 ELSE 0.0 END +
                CASE WHEN search_term = ANY(SELECT LOWER(unnest(kb.tags))) THEN 2.5 ELSE 0.0 END
            )::NUMERIC
        END as relevance_score
    FROM knowledge_base kb
    WHERE 
        (category_filter IS NULL OR kb.category = category_filter)
        AND (
            search_term IS NULL 
            OR LOWER(kb.title) LIKE LOWER('%' || search_term || '%')
            OR LOWER(kb.content) LIKE LOWER('%' || search_term || '%')
            OR LOWER(kb.author) LIKE LOWER('%' || search_term || '%')
            OR search_term = ANY(SELECT LOWER(unnest(kb.tags)))
        )
    ORDER BY relevance_score DESC, kb.read_count DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_reading_stats(user_email_param TEXT)
RETURNS TABLE(
    total_books BIGINT,
    completed_books BIGINT,
    reading_books BIGINT,
    not_started_books BIGINT,
    paused_books BIGINT,
    total_reading_time INTEGER,
    average_progress NUMERIC,
    bookmarks_count BIGINT,
    reviews_count BIGINT,
    favorite_category TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE((SELECT COUNT(*) FROM user_reading_progress WHERE user_email = user_email_param), 0)::BIGINT as total_books,
        COALESCE((SELECT COUNT(*) FROM user_reading_progress WHERE user_email = user_email_param AND status = 'completed'), 0)::BIGINT as completed_books,
        COALESCE((SELECT COUNT(*) FROM user_reading_progress WHERE user_email = user_email_param AND status = 'reading'), 0)::BIGINT as reading_books,
        COALESCE((SELECT COUNT(*) FROM user_reading_progress WHERE user_email = user_email_param AND status = 'not_started'), 0)::BIGINT as not_started_books,
        COALESCE((SELECT COUNT(*) FROM user_reading_progress WHERE user_email = user_email_param AND status = 'paused'), 0)::BIGINT as paused_books,
        COALESCE((SELECT SUM(reading_time_minutes) FROM user_reading_progress WHERE user_email = user_email_param), 0)::INTEGER as total_reading_time,
        COALESCE((SELECT AVG(reading_progress) FROM user_reading_progress WHERE user_email = user_email_param), 0)::NUMERIC as average_progress,
        COALESCE((SELECT COUNT(*) FROM user_bookmarks WHERE user_email = user_email_param), 0)::BIGINT as bookmarks_count,
        COALESCE((SELECT COUNT(*) FROM book_reviews WHERE user_email = user_email_param), 0)::BIGINT as reviews_count,
        COALESCE((
            SELECT kb.category 
            FROM user_reading_progress urp 
            JOIN knowledge_base kb ON urp.book_id = kb.id 
            WHERE urp.user_email = user_email_param 
            GROUP BY kb.category 
            ORDER BY COUNT(*) DESC 
            LIMIT 1
        ), 'N/A')::TEXT as favorite_category;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_reading_progress(
    user_email_param TEXT,
    book_id_param INTEGER,
    progress_param INTEGER,
    status_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    new_status TEXT;
    target_pct INTEGER;
BEGIN
    -- Obtener el target_percentage actual
    SELECT target_percentage INTO target_pct 
    FROM user_reading_progress 
    WHERE user_email = user_email_param AND book_id = book_id_param;
    
    -- Si no existe el registro, usar 100% como default
    IF target_pct IS NULL THEN
        target_pct := 100;
    END IF;
    
    -- Determinar el nuevo status si no se proporciona
    IF status_param IS NULL THEN
        IF progress_param >= target_pct THEN
            new_status := 'completed';
        ELSIF progress_param > 0 THEN
            new_status := 'reading';
        ELSE
            new_status := 'not_started';
        END IF;
    ELSE
        new_status := status_param;
    END IF;
    
    -- Insertar o actualizar el progreso
    INSERT INTO user_reading_progress (
        user_email, book_id, reading_progress, status, 
        started_at, completed_at, last_read_at, updated_at
    ) VALUES (
        user_email_param, book_id_param, progress_param, new_status,
        CASE WHEN progress_param > 0 THEN NOW() ELSE NULL END,
        CASE WHEN new_status = 'completed' THEN NOW() ELSE NULL END,
        NOW(), NOW()
    )
    ON CONFLICT (user_email, book_id) 
    DO UPDATE SET 
        reading_progress = progress_param,
        status = new_status,
        started_at = CASE 
            WHEN user_reading_progress.started_at IS NULL AND progress_param > 0 
            THEN NOW() 
            ELSE user_reading_progress.started_at 
        END,
        completed_at = CASE 
            WHEN new_status = 'completed' 
            THEN NOW() 
            ELSE NULL 
        END,
        last_read_at = NOW(),
        updated_at = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_books_by_status(
    user_email_param TEXT,
    status_filter TEXT DEFAULT NULL
)
RETURNS TABLE(
    id INTEGER,
    title TEXT,
    category TEXT,
    author TEXT,
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
        kb.author,
        COALESCE(urp.reading_progress, 0) as reading_progress,
        COALESCE(urp.target_percentage, 100) as target_percentage,
        COALESCE(urp.status, 'not_started') as status,
        COALESCE(urp.reading_time_minutes, 0) as reading_time_minutes,
        urp.last_read_at,
        (ub.book_id IS NOT NULL) as is_bookmarked
    FROM knowledge_base kb
    LEFT JOIN user_reading_progress urp ON kb.id = urp.book_id AND urp.user_email = user_email_param
    LEFT JOIN user_bookmarks ub ON kb.id = ub.book_id AND ub.user_email = user_email_param
    WHERE status_filter IS NULL OR COALESCE(urp.status, 'not_started') = status_filter
    ORDER BY 
        CASE WHEN urp.last_read_at IS NOT NULL THEN urp.last_read_at ELSE kb.created_at END DESC;
END;
$$ LANGUAGE plpgsql;

-- 11. Confirmar que las tablas se crearon correctamente
SELECT 
    'TABLAS CREADAS EXITOSAMENTE' as status,
    COUNT(*) as total_tablas
FROM information_schema.tables 
WHERE table_name IN (
    'knowledge_base', 'user_reading_progress', 'user_bookmarks', 
    'reading_sessions', 'book_reviews', 'reading_goals'
);
