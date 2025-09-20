-- Asegurar que todas las tablas requeridas existan con la estructura correcta
-- Ensure all required tables exist with correct structure

-- 1. Crear tabla knowledge_base si no existe
CREATE TABLE IF NOT EXISTS knowledge_base (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    slug TEXT UNIQUE NOT NULL,
    read_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla user_reading_progress si no existe
CREATE TABLE IF NOT EXISTS user_reading_progress (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    reading_progress INTEGER DEFAULT 0 CHECK (reading_progress >= 0 AND reading_progress <= 100),
    target_percentage INTEGER DEFAULT 100 CHECK (target_percentage >= 0 AND target_percentage <= 100),
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'reading', 'completed', 'paused')),
    notes TEXT,
    reading_time_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- 3. Crear tabla user_bookmarks si no existe
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    bookmark_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- 4. Crear tabla reading_goals si no existe
CREATE TABLE IF NOT EXISTS reading_goals (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('books_per_month', 'minutes_per_day', 'pages_per_day')),
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Crear tabla reading_sessions si no existe
CREATE TABLE IF NOT EXISTS reading_sessions (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE NOT NULL,
    session_end TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    pages_read INTEGER DEFAULT 0,
    progress_before INTEGER DEFAULT 0,
    progress_after INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Crear tabla book_reviews si no existe
CREATE TABLE IF NOT EXISTS book_reviews (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- 7. Crear índices importantes si no existen
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_author ON knowledge_base(author);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_read_count ON knowledge_base(read_count DESC);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_user_email ON user_reading_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_status ON user_reading_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_email ON user_bookmarks(user_email);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_email ON reading_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_book_reviews_book_id ON book_reviews(book_id);

-- 8. Verificar que todas las tablas existen
SELECT 'TABLAS CREADAS' as status;
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
        'book_reviews'
    )
ORDER BY table_name;

-- 9. Verificar estructura de knowledge_base
SELECT 'ESTRUCTURA KNOWLEDGE_BASE' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'knowledge_base' 
ORDER BY ordinal_position;

-- 10. Verificar estructura de user_reading_progress
SELECT 'ESTRUCTURA USER_READING_PROGRESS' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_reading_progress' 
ORDER BY ordinal_position;
