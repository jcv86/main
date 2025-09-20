-- Crear tablas para seguimiento de progreso de lectura
-- Create tables for reading progress tracking

-- Tabla para progreso de lectura de usuarios
CREATE TABLE IF NOT EXISTS user_reading_progress (
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

-- Tabla para sesiones de lectura
CREATE TABLE IF NOT EXISTS reading_sessions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    session_start TIMESTAMP DEFAULT NOW(),
    session_end TIMESTAMP,
    duration_minutes INTEGER,
    progress_start INTEGER DEFAULT 0,
    progress_end INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para reseñas de libros
CREATE TABLE IF NOT EXISTS book_reviews (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_recommended BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_email, book_id)
);

-- Función para iniciar sesión de lectura
CREATE OR REPLACE FUNCTION start_reading_session(
    p_user_email VARCHAR(255),
    p_book_id INTEGER
) RETURNS INTEGER AS $$
DECLARE
    session_id INTEGER;
    current_progress INTEGER;
BEGIN
    -- Obtener progreso actual
    SELECT reading_progress INTO current_progress
    FROM user_reading_progress
    WHERE user_email = p_user_email AND book_id = p_book_id;
    
    IF current_progress IS NULL THEN
        current_progress := 0;
    END IF;
    
    -- Crear nueva sesión
    INSERT INTO reading_sessions (user_email, book_id, progress_start)
    VALUES (p_user_email, p_book_id, current_progress)
    RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Función para finalizar sesión de lectura
CREATE OR REPLACE FUNCTION end_reading_session(
    p_session_id INTEGER
) RETURNS VOID AS $$
DECLARE
    session_duration INTEGER;
BEGIN
    -- Calcular duración y actualizar sesión
    UPDATE reading_sessions 
    SET 
        session_end = NOW(),
        duration_minutes = EXTRACT(EPOCH FROM (NOW() - session_start)) / 60
    WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar progreso de lectura
CREATE OR REPLACE FUNCTION update_reading_progress(
    p_user_email VARCHAR(255),
    p_book_id INTEGER,
    p_progress INTEGER,
    p_reading_time INTEGER DEFAULT 0
) RETURNS VOID AS $$
BEGIN
    INSERT INTO user_reading_progress (
        user_email, 
        book_id, 
        reading_progress, 
        reading_time_minutes,
        last_read_at,
        updated_at
    )
    VALUES (
        p_user_email, 
        p_book_id, 
        p_progress, 
        p_reading_time,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_email, book_id)
    DO UPDATE SET
        reading_progress = GREATEST(user_reading_progress.reading_progress, p_progress),
        reading_time_minutes = user_reading_progress.reading_time_minutes + p_reading_time,
        last_read_at = NOW(),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_user_email ON user_reading_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_book_id ON user_reading_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_status ON user_reading_progress(status);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_email ON reading_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_book_reviews_book_id ON book_reviews(book_id);

-- Insertar datos de ejemplo para el usuario demo
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

-- Actualizar status basado en progreso
UPDATE user_reading_progress 
SET status = 'completed', completed_at = last_read_at
WHERE reading_progress >= target_percentage AND status != 'completed';

UPDATE user_reading_progress 
SET status = 'reading'
WHERE reading_progress > 0 AND reading_progress < target_percentage AND status = 'not_started';
