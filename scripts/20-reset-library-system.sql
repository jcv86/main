-- Reset and recreate the complete library system
-- Drop existing tables and functions
DROP TABLE IF EXISTS user_book_bookmarks CASCADE;
DROP TABLE IF EXISTS user_book_progress CASCADE;
DROP TABLE IF EXISTS user_reading_stats CASCADE;
DROP TABLE IF EXISTS book_chapters CASCADE;
DROP TABLE IF EXISTS books CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_user_reading_stats() CASCADE;
DROP FUNCTION IF EXISTS calculate_reading_level(integer) CASCADE;

-- Create books table
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    reading_time TEXT,
    pages INTEGER DEFAULT 0,
    published_year INTEGER,
    cover_url TEXT,
    tags TEXT[] DEFAULT '{}',
    difficulty TEXT CHECK (difficulty IN ('Fácil', 'Intermedio', 'Avanzado')),
    key_topics TEXT[] DEFAULT '{}',
    is_recommended BOOLEAN DEFAULT false,
    is_free BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create book chapters table
CREATE TABLE book_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    estimated_reading_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, chapter_number)
);

-- Create user book progress table
CREATE TABLE user_book_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    current_chapter INTEGER DEFAULT 1,
    total_chapters INTEGER DEFAULT 1,
    reading_time_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- Create user reading stats table
CREATE TABLE user_reading_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    books_read INTEGER DEFAULT 0,
    total_reading_time INTEGER DEFAULT 0,
    reading_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user book bookmarks table
CREATE TABLE user_book_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES book_chapters(id) ON DELETE CASCADE,
    position_percentage DECIMAL(5,2) DEFAULT 0.0,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_difficulty ON books(difficulty);
CREATE INDEX idx_books_is_recommended ON books(is_recommended);
CREATE INDEX idx_book_chapters_book_id ON book_chapters(book_id);
CREATE INDEX idx_book_chapters_number ON book_chapters(book_id, chapter_number);
CREATE INDEX idx_user_book_progress_user_id ON user_book_progress(user_id);
CREATE INDEX idx_user_book_progress_book_id ON user_book_progress(book_id);
CREATE INDEX idx_user_book_bookmarks_user_book ON user_book_bookmarks(user_id, book_id);

-- Function to calculate reading level based on points
CREATE OR REPLACE FUNCTION calculate_reading_level(points INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN CASE 
        WHEN points < 100 THEN 1
        WHEN points < 300 THEN 2
        WHEN points < 600 THEN 3
        WHEN points < 1000 THEN 4
        WHEN points < 1500 THEN 5
        WHEN points < 2100 THEN 6
        WHEN points < 2800 THEN 7
        WHEN points < 3600 THEN 8
        WHEN points < 4500 THEN 9
        ELSE 10
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to update user reading stats when progress changes
CREATE OR REPLACE FUNCTION update_user_reading_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update user reading stats
    INSERT INTO user_reading_stats (user_id, books_read, total_reading_time, points, level)
    VALUES (
        NEW.user_id,
        CASE WHEN NEW.completed_at IS NOT NULL THEN 1 ELSE 0 END,
        NEW.reading_time_minutes,
        CASE WHEN NEW.completed_at IS NOT NULL THEN 100 ELSE NEW.progress_percentage END,
        1
    )
    ON CONFLICT (user_id) DO UPDATE SET
        books_read = user_reading_stats.books_read + CASE 
            WHEN NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN 1 
            ELSE 0 
        END,
        total_reading_time = user_reading_stats.total_reading_time + (NEW.reading_time_minutes - COALESCE(OLD.reading_time_minutes, 0)),
        points = user_reading_stats.points + CASE 
            WHEN NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN 100
            WHEN NEW.progress_percentage > COALESCE(OLD.progress_percentage, 0) THEN (NEW.progress_percentage - COALESCE(OLD.progress_percentage, 0))
            ELSE 0
        END,
        level = calculate_reading_level(user_reading_stats.points + CASE 
            WHEN NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN 100
            WHEN NEW.progress_percentage > COALESCE(OLD.progress_percentage, 0) THEN (NEW.progress_percentage - COALESCE(OLD.progress_percentage, 0))
            ELSE 0
        END),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating reading stats
CREATE TRIGGER trigger_update_reading_stats
    AFTER INSERT OR UPDATE ON user_book_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_user_reading_stats();

-- Enable RLS on all tables
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for books (public read access)
CREATE POLICY "Books are viewable by everyone" ON books FOR SELECT USING (true);
CREATE POLICY "Books are insertable by authenticated users" ON books FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Books are updatable by authenticated users" ON books FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for book chapters (public read access)
CREATE POLICY "Book chapters are viewable by everyone" ON book_chapters FOR SELECT USING (true);
CREATE POLICY "Book chapters are insertable by authenticated users" ON book_chapters FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Book chapters are updatable by authenticated users" ON book_chapters FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for user book progress (user-specific)
CREATE POLICY "Users can view their own book progress" ON user_book_progress FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own book progress" ON user_book_progress FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own book progress" ON user_book_progress FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own book progress" ON user_book_progress FOR DELETE USING (auth.uid()::text = user_id::text);

-- RLS Policies for user reading stats (user-specific)
CREATE POLICY "Users can view their own reading stats" ON user_reading_stats FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own reading stats" ON user_reading_stats FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own reading stats" ON user_reading_stats FOR UPDATE USING (auth.uid()::text = user_id::text);

-- RLS Policies for user book bookmarks (user-specific)
CREATE POLICY "Users can view their own bookmarks" ON user_book_bookmarks FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own bookmarks" ON user_book_bookmarks FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own bookmarks" ON user_book_bookmarks FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own bookmarks" ON user_book_bookmarks FOR DELETE USING (auth.uid()::text = user_id::text);

-- Grant permissions
GRANT ALL ON books TO authenticated;
GRANT ALL ON book_chapters TO authenticated;
GRANT ALL ON user_book_progress TO authenticated;
GRANT ALL ON user_reading_stats TO authenticated;
GRANT ALL ON user_book_bookmarks TO authenticated;

GRANT SELECT ON books TO anon;
GRANT SELECT ON book_chapters TO anon;
