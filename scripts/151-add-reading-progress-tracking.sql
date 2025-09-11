-- Add reading progress tracking for users
CREATE TABLE IF NOT EXISTS user_reading_progress (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reading_time_minutes INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, book_id)
);

-- Add reading sessions tracking
CREATE TABLE IF NOT EXISTS reading_sessions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add book ratings and reviews
CREATE TABLE IF NOT EXISTS book_reviews (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_recommended BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, book_id)
);

-- Function to update reading progress
CREATE OR REPLACE FUNCTION update_reading_progress(
    p_user_email VARCHAR(255),
    p_book_id INTEGER,
    p_progress INTEGER,
    p_reading_time INTEGER DEFAULT 0
) RETURNS VOID AS $$
BEGIN
    INSERT INTO user_reading_progress (user_email, book_id, progress_percentage, reading_time_minutes, last_read_at)
    VALUES (p_user_email, p_book_id, p_progress, p_reading_time, CURRENT_TIMESTAMP)
    ON CONFLICT (user_email, book_id)
    DO UPDATE SET
        progress_percentage = p_progress,
        reading_time_minutes = user_reading_progress.reading_time_minutes + p_reading_time,
        last_read_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Function to start reading session
CREATE OR REPLACE FUNCTION start_reading_session(
    p_user_email VARCHAR(255),
    p_book_id INTEGER
) RETURNS INTEGER AS $$
DECLARE
    session_id INTEGER;
BEGIN
    INSERT INTO reading_sessions (user_email, book_id, session_start)
    VALUES (p_user_email, p_book_id, CURRENT_TIMESTAMP)
    RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to end reading session
CREATE OR REPLACE FUNCTION end_reading_session(
    p_session_id INTEGER
) RETURNS VOID AS $$
DECLARE
    session_duration INTEGER;
BEGIN
    UPDATE reading_sessions 
    SET session_end = CURRENT_TIMESTAMP,
        duration_minutes = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - session_start)) / 60
    WHERE id = p_session_id;
    
    -- Get the duration for progress update
    SELECT duration_minutes INTO session_duration
    FROM reading_sessions
    WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_email ON user_reading_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_reading_progress_book_id ON user_reading_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_email ON reading_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_book_reviews_book_id ON book_reviews(book_id);

-- Insert some sample reading progress data
INSERT INTO user_reading_progress (user_email, book_id, progress_percentage, reading_time_minutes) VALUES
('demo@example.com', 1, 75, 45),
('demo@example.com', 2, 100, 120),
('demo@example.com', 3, 25, 15),
('demo@example.com', 4, 50, 30);

-- Insert some sample reviews
INSERT INTO book_reviews (user_email, book_id, rating, review_text, is_recommended) VALUES
('demo@example.com', 2, 5, 'Excelente libro sobre productividad. Los conceptos son muy prácticos y fáciles de implementar.', true),
('demo@example.com', 1, 4, 'Muy buen contenido sobre liderazgo. Me ayudó a mejorar mi comunicación con el equipo.', true);
