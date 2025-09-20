-- Crear tablas para el seguimiento de progreso de lectura
-- Create tables for reading progress tracking

-- 1. Eliminar tablas existentes si hay conflictos
DROP TABLE IF EXISTS reading_sessions CASCADE;
DROP TABLE IF EXISTS book_reviews CASCADE;
DROP TABLE IF EXISTS user_bookmarks CASCADE;
DROP TABLE IF EXISTS user_reading_progress CASCADE;

-- 2. Crear tabla de progreso de lectura de usuarios
CREATE TABLE user_reading_progress (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
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

-- 3. Crear tabla de bookmarks de usuarios
CREATE TABLE user_bookmarks (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    bookmark_note TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- 4. Crear tabla de sesiones de lectura
CREATE TABLE reading_sessions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    session_start TIMESTAMP DEFAULT NOW(),
    session_end TIMESTAMP,
    duration_minutes INTEGER,
    progress_start INTEGER DEFAULT 0,
    progress_end INTEGER DEFAULT 0,
    pages_read INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Crear tabla de reseñas de libros
CREATE TABLE book_reviews (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_recommended BOOLEAN DEFAULT true,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- 6. Crear tabla de objetivos de lectura
CREATE TABLE reading_goals (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    goal_type VARCHAR(50) NOT NULL, -- 'books_per_month', 'pages_per_day', 'minutes_per_day'
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Crear índices para optimizar consultas
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

-- 8. Insertar datos de ejemplo para el usuario demo
INSERT INTO user_reading_progress (user_email, book_id, reading_progress, target_percentage, status, started_at, last_read_at, reading_time_minutes)
SELECT 
    'demo@example.com',
    id,
    CASE 
        WHEN random() < 0.2 THEN 100  -- 20% completados
        WHEN random() < 0.4 THEN floor(random() * 80 + 20)::INTEGER  -- 20% en progreso
        WHEN random() < 0.6 THEN floor(random() * 30)::INTEGER  -- 20% iniciados
        ELSE 0  -- 40% no iniciados
    END,
    CASE 
        WHEN random() < 0.3 THEN 30   -- 30% objetivo
        WHEN random() < 0.6 THEN 60   -- 60% objetivo
        ELSE 100  -- 100% objetivo
    END,
    CASE 
        WHEN random() < 0.2 THEN 'completed'
        WHEN random() < 0.5 THEN 'reading'
        WHEN random() < 0.7 THEN 'not_started'
        ELSE 'paused'
    END,
    CASE WHEN random() > 0.4 THEN NOW() - (random() * interval '30 days') ELSE NULL END,
    CASE WHEN random() > 0.4 THEN NOW() - (random() * interval '7 days') ELSE NULL END,
    floor(random() * 120 + 15)::INTEGER  -- 15-135 minutos
FROM knowledge_base
WHERE random() < 0.8  -- 80% de los libros tendrán algún progreso
ON CONFLICT (user_email, book_id) DO NOTHING;

-- 9. Actualizar status basado en progreso
UPDATE user_reading_progress 
SET 
    status = 'completed', 
    completed_at = last_read_at
WHERE reading_progress >= target_percentage AND status != 'completed';

UPDATE user_reading_progress 
SET status = 'reading'
WHERE reading_progress > 0 AND reading_progress < target_percentage AND status = 'not_started';

-- 10. Insertar bookmarks de ejemplo
INSERT INTO user_bookmarks (user_email, book_id, bookmark_note, created_at)
SELECT 
    'demo@example.com',
    id,
    CASE floor(random() * 4)
        WHEN 0 THEN 'Libro muy interesante, quiero leerlo pronto'
        WHEN 1 THEN 'Recomendado por mi mentor'
        WHEN 2 THEN 'Perfecto para mi desarrollo profesional'
        ELSE 'Contenido relevante para mi proyecto actual'
    END,
    NOW() - (random() * interval '20 days')
FROM knowledge_base
WHERE random() < 0.4  -- 40% de los libros serán bookmarks
ON CONFLICT (user_email, book_id) DO NOTHING;

-- 11. Insertar reseñas de ejemplo
INSERT INTO book_reviews (user_email, book_id, rating, review_text, is_recommended, created_at)
SELECT 
    'demo@example.com',
    id,
    floor(random() * 2 + 4)::INTEGER,  -- Ratings entre 4-5
    CASE floor(random() * 5)
        WHEN 0 THEN 'Excelente libro con contenido muy práctico y aplicable.'
        WHEN 1 THEN 'Me ayudó mucho en mi desarrollo profesional. Altamente recomendado.'
        WHEN 2 THEN 'Conceptos claros y ejemplos útiles. Fácil de seguir.'
        WHEN 3 THEN 'Información valiosa presentada de manera accesible.'
        ELSE 'Gran recurso para cualquiera que busque crecer profesionalmente.'
    END,
    random() > 0.1,  -- 90% recomendados
    NOW() - (random() * interval '25 days')
FROM knowledge_base
WHERE random() < 0.3  -- 30% de los libros tendrán reseñas
ON CONFLICT (user_email, book_id) DO NOTHING;

-- 12. Insertar sesiones de lectura de ejemplo
INSERT INTO reading_sessions (user_email, book_id, session_start, session_end, duration_minutes, progress_start, progress_end, pages_read)
SELECT 
    'demo@example.com',
    urp.book_id,
    NOW() - (random() * interval '10 days'),
    NOW() - (random() * interval '10 days') + (random() * interval '2 hours'),
    floor(random() * 90 + 15)::INTEGER,  -- 15-105 minutos
    GREATEST(0, urp.reading_progress - floor(random() * 20)::INTEGER),
    urp.reading_progress,
    floor(random() * 15 + 5)::INTEGER  -- 5-20 páginas
FROM user_reading_progress urp
WHERE urp.user_email = 'demo@example.com' 
AND urp.reading_progress > 0
AND random() < 0.6;  -- 60% de los libros en progreso tendrán sesiones

-- 13. Insertar objetivos de lectura de ejemplo
INSERT INTO reading_goals (user_email, goal_type, target_value, current_value, period_start, period_end, status)
VALUES 
('demo@example.com', 'books_per_month', 3, 2, DATE_TRUNC('month', NOW()), DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day', 'active'),
('demo@example.com', 'minutes_per_day', 30, 25, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'active'),
('demo@example.com', 'pages_per_day', 10, 8, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'active');

-- 14. Verificar que todo se creó correctamente
SELECT 
    'user_reading_progress' as tabla, 
    COUNT(*) as registros,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completados,
    COUNT(CASE WHEN status = 'reading' THEN 1 END) as leyendo,
    COUNT(CASE WHEN status = 'not_started' THEN 1 END) as no_iniciados
FROM user_reading_progress
UNION ALL
SELECT 
    'user_bookmarks' as tabla, 
    COUNT(*) as registros,
    NULL as completados,
    NULL as leyendo,
    NULL as no_iniciados
FROM user_bookmarks
UNION ALL
SELECT 
    'book_reviews' as tabla, 
    COUNT(*) as registros,
    AVG(rating) as completados,
    NULL as leyendo,
    NULL as no_iniciados
FROM book_reviews
UNION ALL
SELECT 
    'reading_sessions' as tabla, 
    COUNT(*) as registros,
    AVG(duration_minutes) as completados,
    NULL as leyendo,
    NULL as no_iniciados
FROM reading_sessions
UNION ALL
SELECT 
    'reading_goals' as tabla, 
    COUNT(*) as registros,
    NULL as completados,
    NULL as leyendo,
    NULL as no_iniciados
FROM reading_goals;

-- 15. Mostrar estadísticas del usuario demo
SELECT 
    'Estadísticas de Lectura - demo@example.com' as titulo,
    (SELECT COUNT(*) FROM user_reading_progress WHERE user_email = 'demo@example.com') as total_libros,
    (SELECT COUNT(*) FROM user_reading_progress WHERE user_email = 'demo@example.com' AND status = 'completed') as completados,
    (SELECT COUNT(*) FROM user_reading_progress WHERE user_email = 'demo@example.com' AND status = 'reading') as leyendo,
    (SELECT COUNT(*) FROM user_bookmarks WHERE user_email = 'demo@example.com') as bookmarks,
    (SELECT COUNT(*) FROM book_reviews WHERE user_email = 'demo@example.com') as reseñas,
    (SELECT ROUND(AVG(rating), 1) FROM book_reviews WHERE user_email = 'demo@example.com') as rating_promedio;
