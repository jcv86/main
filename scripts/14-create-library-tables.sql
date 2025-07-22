-- Create library tables for the career development platform
-- This script creates all necessary tables for the book library feature

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    reading_time VARCHAR(50),
    pages INTEGER DEFAULT 0,
    published_year INTEGER,
    cover_url TEXT,
    tags TEXT[] DEFAULT '{}',
    is_recommended BOOLEAN DEFAULT false,
    difficulty VARCHAR(50) DEFAULT 'Intermedio' CHECK (difficulty IN ('Básico', 'Intermedio', 'Avanzado')),
    key_topics TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_book_progress table
CREATE TABLE IF NOT EXISTS user_book_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    current_page INTEGER DEFAULT 0,
    total_pages INTEGER DEFAULT 0,
    reading_time_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- Create user_book_bookmarks table
CREATE TABLE IF NOT EXISTS user_book_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    chapter_title VARCHAR(255),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_reading_goals table
CREATE TABLE IF NOT EXISTS user_reading_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL CHECK (goal_type IN ('books_per_month', 'minutes_per_day', 'pages_per_day')),
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating DESC);
CREATE INDEX IF NOT EXISTS idx_books_recommended ON books(is_recommended);
CREATE INDEX IF NOT EXISTS idx_books_difficulty ON books(difficulty);

CREATE INDEX IF NOT EXISTS idx_user_book_progress_user_id ON user_book_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_book_progress_book_id ON user_book_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_user_book_progress_progress ON user_book_progress(progress);
CREATE INDEX IF NOT EXISTS idx_user_book_progress_last_read ON user_book_progress(last_read_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_book_bookmarks_user_id ON user_book_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_book_bookmarks_book_id ON user_book_bookmarks(book_id);
CREATE INDEX IF NOT EXISTS idx_user_book_bookmarks_page ON user_book_bookmarks(page_number);

CREATE INDEX IF NOT EXISTS idx_user_reading_goals_user_id ON user_reading_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_goals_active ON user_reading_goals(is_active);
CREATE INDEX IF NOT EXISTS idx_user_reading_goals_period ON user_reading_goals(period_start, period_end);

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_goals ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_progress_updated_at BEFORE UPDATE ON user_book_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_reading_goals_updated_at BEFORE UPDATE ON user_reading_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE books IS 'Professional development books available in the library';
COMMENT ON TABLE user_book_progress IS 'User reading progress and notes for each book';
COMMENT ON TABLE user_book_bookmarks IS 'User bookmarks within books';
COMMENT ON TABLE user_reading_goals IS 'User reading goals and targets';

COMMENT ON COLUMN books.rating IS 'Average rating from 0.0 to 5.0';
COMMENT ON COLUMN books.difficulty IS 'Reading difficulty level: Básico, Intermedio, Avanzado';
COMMENT ON COLUMN user_book_progress.progress IS 'Reading progress percentage from 0 to 100';
COMMENT ON COLUMN user_book_progress.rating IS 'User rating from 1 to 5 stars';
