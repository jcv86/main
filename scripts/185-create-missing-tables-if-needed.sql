-- Crear tablas faltantes si no existen
-- Create missing tables if they don't exist

-- 1. Verificar y crear tabla user_profiles si no existe
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    reading_goals JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{"profile_public": false, "reading_stats_public": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Verificar y crear tabla reading_goals si no existe
CREATE TABLE IF NOT EXISTS reading_goals (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('books_per_month', 'books_per_year', 'pages_per_day', 'minutes_per_day')),
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, goal_type, period_start)
);

-- 3. Verificar y crear tabla reading_sessions si no existe
CREATE TABLE IF NOT EXISTS reading_sessions (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE NOT NULL,
    session_end TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    pages_read INTEGER DEFAULT 0,
    progress_start INTEGER DEFAULT 0,
    progress_end INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Verificar y crear tabla book_reviews si no existe
CREATE TABLE IF NOT EXISTS book_reviews (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_public BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- 5. Verificar y agregar columnas faltantes a user_reading_progress
DO $$
BEGIN
    -- Agregar target_percentage si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_reading_progress' AND column_name = 'target_percentage') THEN
        ALTER TABLE user_reading_progress ADD COLUMN target_percentage INTEGER DEFAULT 100;
    END IF;
    
    -- Agregar reading_time_minutes si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_reading_progress' AND column_name = 'reading_time_minutes') THEN
        ALTER TABLE user_reading_progress ADD COLUMN reading_time_minutes INTEGER DEFAULT 0;
    END IF;
    
    -- Agregar started_at si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_reading_progress' AND column_name = 'started_at') THEN
        ALTER TABLE user_reading_progress ADD COLUMN started_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Agregar completed_at si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_reading_progress' AND column_name = 'completed_at') THEN
        ALTER TABLE user_reading_progress ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Agregar last_read_at si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_reading_progress' AND column_name = 'last_read_at') THEN
        ALTER TABLE user_reading_progress ADD COLUMN last_read_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Agregar updated_at si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_reading_progress' AND column_name = 'updated_at') THEN
        ALTER TABLE user_reading_progress ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 6. Crear índices importantes si no existen
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_user_email ON user_reading_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_book_id ON user_reading_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_status ON user_reading_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_email ON user_bookmarks(user_email);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_book_id ON user_bookmarks(book_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_author ON knowledge_base(author);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_email ON reading_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_book_reviews_user_email ON book_reviews(user_email);
CREATE INDEX IF NOT EXISTS idx_book_reviews_book_id ON book_reviews(book_id);

-- 7. Verificar que todas las tablas existen
SELECT 'VERIFICACIÓN DE TABLAS' as status;
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count,
    CASE 
        WHEN table_name = 'knowledge_base' THEN (SELECT COUNT(*) FROM knowledge_base)
        WHEN table_name = 'user_reading_progress' THEN (SELECT COUNT(*) FROM user_reading_progress)
        WHEN table_name = 'user_bookmarks' THEN (SELECT COUNT(*) FROM user_bookmarks)
        WHEN table_name = 'reading_goals' THEN (SELECT COUNT(*) FROM reading_goals)
        WHEN table_name = 'reading_sessions' THEN (SELECT COUNT(*) FROM reading_sessions)
        WHEN table_name = 'book_reviews' THEN (SELECT COUNT(*) FROM book_reviews)
        WHEN table_name = 'user_profiles' THEN (SELECT COUNT(*) FROM user_profiles)
        ELSE 0
    END as record_count
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

-- 8. Verificar columnas de user_reading_progress
SELECT 'COLUMNAS DE USER_READING_PROGRESS' as status;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_reading_progress'
ORDER BY ordinal_position;

-- 9. Resumen final
SELECT 'CONFIGURACIÓN COMPLETADA' as status;
SELECT 
    'Tablas creadas/verificadas' as item,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('knowledge_base', 'user_reading_progress', 'user_bookmarks', 'reading_goals', 'reading_sessions', 'book_reviews', 'user_profiles')
UNION ALL
SELECT 
    'Funciones creadas/verificadas' as item,
    COUNT(*) as count
FROM information_schema.routines 
WHERE routine_schema = 'public'
    AND routine_name IN ('search_knowledge_base', 'update_reading_progress', 'get_user_reading_stats', 'get_books_by_status', 'increment_read_count')
UNION ALL
SELECT 
    'Índices creados' as item,
    COUNT(*) as count
FROM pg_indexes 
WHERE schemaname = 'public'
    AND tablename IN ('knowledge_base', 'user_reading_progress', 'user_bookmarks', 'reading_sessions', 'book_reviews');
