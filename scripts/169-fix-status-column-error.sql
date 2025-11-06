-- Arreglar error de columna "status" que no existe
-- Fix "status" column does not exist error

-- 1. Verificar estructura actual de user_reading_progress
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_reading_progress' 
ORDER BY ordinal_position;

-- 2. Verificar si la tabla existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'user_reading_progress'
);

-- 3. Crear tabla user_reading_progress si no existe o recrearla con estructura correcta
DROP TABLE IF EXISTS user_reading_progress CASCADE;

CREATE TABLE user_reading_progress (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL,
    reading_progress INTEGER DEFAULT 0 CHECK (reading_progress >= 0 AND reading_progress <= 100),
    target_percentage INTEGER DEFAULT 100 CHECK (target_percentage >= 0 AND target_percentage <= 100),
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'reading', 'completed', 'paused')),
    notes TEXT,
    reading_time_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_read_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- 4. Crear tabla user_bookmarks si no existe
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- 5. Crear tabla reading_sessions si no existe
CREATE TABLE IF NOT EXISTS reading_sessions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL,
    session_start TIMESTAMP DEFAULT NOW(),
    session_end TIMESTAMP,
    duration_minutes INTEGER,
    progress_start INTEGER DEFAULT 0,
    progress_end INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Crear tabla book_reviews si no existe
CREATE TABLE IF NOT EXISTS book_reviews (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_recommended BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- 7. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_user_email ON user_reading_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_book_id ON user_reading_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_status ON user_reading_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_email ON user_bookmarks(user_email);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_book_id ON user_bookmarks(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_email ON reading_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_book_reviews_book_id ON book_reviews(book_id);

-- 8. Insertar datos de ejemplo para el usuario demo
INSERT INTO user_reading_progress (user_email, book_id, reading_progress, target_percentage, status, started_at, last_read_at)
SELECT 
    'demo@example.com',
    id,
    CASE 
        WHEN random() < 0.3 THEN 100
        WHEN random() < 0.6 THEN floor(random() * 80 + 20)::INTEGER
        ELSE 0
    END,
    CASE 
        WHEN random() < 0.4 THEN 30
        WHEN random() < 0.7 THEN 60
        ELSE 100
    END,
    CASE 
        WHEN random() < 0.3 THEN 'completed'
        WHEN random() < 0.6 THEN 'reading'
        ELSE 'not_started'
    END,
    NOW() - (random() * interval '30 days'),
    NOW() - (random() * interval '7 days')
FROM knowledge_base
WHERE random() < 0.7  -- 70% de los libros tendrán progreso
ON CONFLICT (user_email, book_id) DO NOTHING;

-- 9. Actualizar status basado en progreso
UPDATE user_reading_progress 
SET status = 'completed', completed_at = last_read_at
WHERE reading_progress >= target_percentage AND status != 'completed';

UPDATE user_reading_progress 
SET status = 'reading'
WHERE reading_progress > 0 AND reading_progress < target_percentage AND status = 'not_started';

-- 10. Insertar algunos bookmarks de ejemplo
INSERT INTO user_bookmarks (user_email, book_id, created_at)
SELECT 
    'demo@example.com',
    id,
    NOW() - (random() * interval '15 days')
FROM knowledge_base
WHERE random() < 0.3  -- 30% de los libros serán bookmarks
ON CONFLICT (user_email, book_id) DO NOTHING;

-- 11. Insertar algunas reseñas de ejemplo
INSERT INTO book_reviews (user_email, book_id, rating, review_text, is_recommended, created_at)
SELECT 
    'demo@example.com',
    id,
    floor(random() * 5 + 1)::INTEGER,
    CASE floor(random() * 3)
        WHEN 0 THEN 'Excelente libro, muy recomendado para el desarrollo profesional.'
        WHEN 1 THEN 'Contenido muy útil y aplicable. Me ayudó mucho en mi carrera.'
        ELSE 'Buena lectura con conceptos claros y ejemplos prácticos.'
    END,
    random() > 0.1,  -- 90% recomendados
    NOW() - (random() * interval '20 days')
FROM knowledge_base
WHERE random() < 0.4  -- 40% de los libros tendrán reseñas
ON CONFLICT (user_email, book_id) DO NOTHING;

-- 12. Verificar que todo se creó correctamente
SELECT 'user_reading_progress' as table_name, COUNT(*) as records FROM user_reading_progress
UNION ALL
SELECT 'user_bookmarks' as table_name, COUNT(*) as records FROM user_bookmarks
UNION ALL
SELECT 'reading_sessions' as table_name, COUNT(*) as records FROM reading_sessions
UNION ALL
SELECT 'book_reviews' as table_name, COUNT(*) as records FROM book_reviews;

-- 13. Mostrar estadísticas de progreso por usuario
SELECT 
    user_email,
    COUNT(*) as total_books,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN status = 'reading' THEN 1 END) as reading,
    COUNT(CASE WHEN status = 'paused' THEN 1 END) as paused,
    AVG(reading_progress) as avg_progress
FROM user_reading_progress
GROUP BY user_email;
