-- Fix user_email column error and create proper reading tracking tables
-- Drop existing tables if they exist to recreate with correct structure
DROP TABLE IF EXISTS user_reading_progress CASCADE;
DROP TABLE IF EXISTS reading_sessions CASCADE;
DROP TABLE IF EXISTS book_reviews CASCADE;
DROP TABLE IF EXISTS user_bookmarks CASCADE;

-- Create user_reading_progress table with correct structure
CREATE TABLE user_reading_progress (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    reading_time_minutes INTEGER DEFAULT 0,
    notes TEXT,
    last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES knowledge_base(id) ON DELETE CASCADE,
    UNIQUE(user_email, book_id)
);

-- Create reading_sessions table for detailed session tracking
CREATE TABLE reading_sessions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP,
    duration_minutes INTEGER DEFAULT 0,
    pages_read INTEGER DEFAULT 0,
    progress_start INTEGER DEFAULT 0,
    progress_end INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES knowledge_base(id) ON DELETE CASCADE
);

-- Create book_reviews table for user ratings and reviews
CREATE TABLE book_reviews (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_recommended BOOLEAN DEFAULT true,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES knowledge_base(id) ON DELETE CASCADE,
    UNIQUE(user_email, book_id)
);

-- Recreate user_bookmarks table with correct structure
CREATE TABLE user_bookmarks (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    book_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES knowledge_base(id) ON DELETE CASCADE,
    UNIQUE(user_email, book_id)
);

-- Create reading_goals table for user goal tracking
CREATE TABLE reading_goals (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    goal_type VARCHAR(50) NOT NULL, -- 'monthly', 'yearly', 'custom'
    target_books INTEGER DEFAULT 0,
    target_minutes INTEGER DEFAULT 0,
    current_books INTEGER DEFAULT 0,
    current_minutes INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reading_achievements table for gamification
CREATE TABLE reading_achievements (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    achievement_type VARCHAR(100) NOT NULL,
    achievement_name VARCHAR(255) NOT NULL,
    description TEXT,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX idx_user_reading_progress_user_email ON user_reading_progress(user_email);
CREATE INDEX idx_user_reading_progress_book_id ON user_reading_progress(book_id);
CREATE INDEX idx_user_reading_progress_last_read ON user_reading_progress(last_read_at);

CREATE INDEX idx_reading_sessions_user_email ON reading_sessions(user_email);
CREATE INDEX idx_reading_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX idx_reading_sessions_start ON reading_sessions(session_start);

CREATE INDEX idx_book_reviews_user_email ON book_reviews(user_email);
CREATE INDEX idx_book_reviews_book_id ON book_reviews(book_id);
CREATE INDEX idx_book_reviews_rating ON book_reviews(rating);

CREATE INDEX idx_user_bookmarks_user_email ON user_bookmarks(user_email);
CREATE INDEX idx_user_bookmarks_book_id ON user_bookmarks(book_id);

CREATE INDEX idx_reading_goals_user_email ON reading_goals(user_email);
CREATE INDEX idx_reading_goals_active ON reading_goals(is_active);

CREATE INDEX idx_reading_achievements_user_email ON reading_achievements(user_email);
CREATE INDEX idx_reading_achievements_type ON reading_achievements(achievement_type);

-- Create functions for reading progress management
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
        progress_percentage = GREATEST(user_reading_progress.progress_percentage, p_progress),
        reading_time_minutes = user_reading_progress.reading_time_minutes + p_reading_time,
        last_read_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Create function to start reading session
CREATE OR REPLACE FUNCTION start_reading_session(
    p_user_email VARCHAR(255),
    p_book_id INTEGER
) RETURNS INTEGER AS $$
DECLARE
    session_id INTEGER;
    current_progress INTEGER;
BEGIN
    -- Get current progress
    SELECT COALESCE(progress_percentage, 0) INTO current_progress
    FROM user_reading_progress
    WHERE user_email = p_user_email AND book_id = p_book_id;
    
    -- Insert new session
    INSERT INTO reading_sessions (user_email, book_id, session_start, progress_start)
    VALUES (p_user_email, p_book_id, CURRENT_TIMESTAMP, current_progress)
    RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to end reading session
CREATE OR REPLACE FUNCTION end_reading_session(
    p_session_id INTEGER
) RETURNS VOID AS $$
DECLARE
    session_record RECORD;
    duration INTEGER;
BEGIN
    -- Get session details
    SELECT * INTO session_record
    FROM reading_sessions
    WHERE id = p_session_id;
    
    IF session_record IS NOT NULL THEN
        -- Calculate duration
        duration := EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - session_record.session_start)) / 60;
        
        -- Update session
        UPDATE reading_sessions
        SET session_end = CURRENT_TIMESTAMP,
            duration_minutes = duration
        WHERE id = p_session_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION check_reading_achievements(
    p_user_email VARCHAR(255)
) RETURNS VOID AS $$
DECLARE
    books_completed INTEGER;
    total_reading_time INTEGER;
    current_streak INTEGER;
BEGIN
    -- Get user stats
    SELECT COUNT(*) INTO books_completed
    FROM user_reading_progress
    WHERE user_email = p_user_email AND progress_percentage = 100;
    
    SELECT COALESCE(SUM(reading_time_minutes), 0) INTO total_reading_time
    FROM user_reading_progress
    WHERE user_email = p_user_email;
    
    -- Award achievements based on milestones
    -- First book completed
    IF books_completed >= 1 THEN
        INSERT INTO reading_achievements (user_email, achievement_type, achievement_name, description)
        VALUES (p_user_email, 'first_book', 'Primer Libro', 'Completaste tu primer libro')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- 5 books milestone
    IF books_completed >= 5 THEN
        INSERT INTO reading_achievements (user_email, achievement_type, achievement_name, description)
        VALUES (p_user_email, 'five_books', 'Lector Dedicado', 'Completaste 5 libros')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- 10 books milestone
    IF books_completed >= 10 THEN
        INSERT INTO reading_achievements (user_email, achievement_type, achievement_name, description)
        VALUES (p_user_email, 'ten_books', 'Bibliófilo', 'Completaste 10 libros')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Reading time milestones
    IF total_reading_time >= 600 THEN -- 10 hours
        INSERT INTO reading_achievements (user_email, achievement_type, achievement_name, description)
        VALUES (p_user_email, 'ten_hours', 'Maratonista de Lectura', 'Acumulaste 10 horas de lectura')
        ON CONFLICT DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for demo users
INSERT INTO user_reading_progress (user_email, book_id, progress_percentage, reading_time_minutes, last_read_at) VALUES
('demo@example.com', 1, 100, 120, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('demo@example.com', 2, 75, 90, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('demo@example.com', 3, 45, 60, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
('travis@nuanu.com', 1, 100, 150, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('travis@nuanu.com', 4, 60, 80, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('demo@despegaturcarrera.com', 2, 100, 110, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('demo@despegaturcarrera.com', 5, 30, 45, CURRENT_TIMESTAMP - INTERVAL '1 hour');

-- Insert sample reading sessions
INSERT INTO reading_sessions (user_email, book_id, session_start, session_end, duration_minutes, progress_start, progress_end) VALUES
('demo@example.com', 1, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '45 minutes', 45, 80, 100),
('demo@example.com', 2, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '30 minutes', 30, 60, 75),
('travis@nuanu.com', 1, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '60 minutes', 60, 70, 100),
('demo@despegaturcarrera.com', 2, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '50 minutes', 50, 85, 100);

-- Insert sample book reviews
INSERT INTO book_reviews (user_email, book_id, rating, review_text, is_recommended) VALUES
('demo@example.com', 1, 5, 'Excelente libro sobre liderazgo. Muy práctico y aplicable.', true),
('demo@example.com', 2, 4, 'Buenas técnicas de productividad, aunque algunas son repetitivas.', true),
('travis@nuanu.com', 1, 5, 'Transformó mi perspectiva sobre el liderazgo. Altamente recomendado.', true),
('demo@despegaturcarrera.com', 2, 4, 'Útil para mejorar la organización personal.', true);

-- Insert sample bookmarks
INSERT INTO user_bookmarks (user_email, book_id) VALUES
('demo@example.com', 3),
('demo@example.com', 4),
('travis@nuanu.com', 2),
('travis@nuanu.com', 3),
('demo@despegaturcarrera.com', 1),
('demo@despegaturcarrera.com', 4);

-- Insert sample reading goals
INSERT INTO reading_goals (user_email, goal_type, target_books, current_books, start_date, end_date) VALUES
('demo@example.com', 'monthly', 5, 2, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'),
('travis@nuanu.com', 'monthly', 3, 1, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'),
('demo@despegaturcarrera.com', 'monthly', 4, 1, DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day');

-- Insert sample achievements
INSERT INTO reading_achievements (user_email, achievement_type, achievement_name, description) VALUES
('demo@example.com', 'first_book', 'Primer Libro', 'Completaste tu primer libro'),
('demo@example.com', 'five_books', 'Lector Dedicado', 'Completaste 5 libros'),
('travis@nuanu.com', 'first_book', 'Primer Libro', 'Completaste tu primer libro'),
('demo@despegaturcarrera.com', 'first_book', 'Primer Libro', 'Completaste tu primer libro');

-- Create trigger to automatically check achievements when progress is updated
CREATE OR REPLACE FUNCTION trigger_check_achievements()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM check_reading_achievements(NEW.user_email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER achievement_check_trigger
    AFTER INSERT OR UPDATE ON user_reading_progress
    FOR EACH ROW
    EXECUTE FUNCTION trigger_check_achievements();

-- Update platform configuration
INSERT INTO platform_config (key, value, description) VALUES
('reading_tracking_enabled', 'true', 'Enable reading progress tracking'),
('achievements_enabled', 'true', 'Enable reading achievements system'),
('default_monthly_goal', '5', 'Default monthly reading goal for new users')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = CURRENT_TIMESTAMP;

COMMIT;
