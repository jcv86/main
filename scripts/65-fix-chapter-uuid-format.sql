-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_book_bookmarks CASCADE;
DROP TABLE IF EXISTS user_book_progress CASCADE;
DROP TABLE IF EXISTS library_book_chapters CASCADE;
DROP TABLE IF EXISTS library_books CASCADE;

-- Create library_books table
CREATE TABLE library_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image VARCHAR(500),
    category VARCHAR(100),
    difficulty VARCHAR(20) CHECK (difficulty IN ('Principiante', 'Intermedio', 'Avanzado')),
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    estimated_reading_time INTEGER, -- in minutes
    pages INTEGER,
    tags TEXT[], -- array of tags
    key_topics TEXT[], -- array of key topics
    is_recommended BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create library_book_chapters table
CREATE TABLE library_book_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, "order")
);

-- Create user_book_progress table
CREATE TABLE user_book_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    current_chapter INTEGER DEFAULT 1,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    reading_time_minutes INTEGER DEFAULT 0,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- Create user_book_bookmarks table
CREATE TABLE user_book_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES library_book_chapters(id) ON DELETE CASCADE,
    chapter_title VARCHAR(255) NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id, chapter_id)
);

-- Create indexes for better performance
CREATE INDEX idx_library_books_category ON library_books(category);
CREATE INDEX idx_library_books_difficulty ON library_books(difficulty);
CREATE INDEX idx_library_books_is_recommended ON library_books(is_recommended);
CREATE INDEX idx_library_book_chapters_book_id ON library_book_chapters(book_id);
CREATE INDEX idx_library_book_chapters_order ON library_book_chapters(book_id, "order");
CREATE INDEX idx_user_book_progress_user_id ON user_book_progress(user_id);
CREATE INDEX idx_user_book_progress_book_id ON user_book_progress(book_id);
CREATE INDEX idx_user_book_bookmarks_user_id ON user_book_bookmarks(user_id);
CREATE INDEX idx_user_book_bookmarks_book_id ON user_book_bookmarks(book_id);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_library_books_updated_at BEFORE UPDATE ON library_books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_library_book_chapters_updated_at BEFORE UPDATE ON library_book_chapters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_book_progress_updated_at BEFORE UPDATE ON user_book_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Books and chapters are readable by everyone
CREATE POLICY "Books are viewable by everyone" ON library_books FOR SELECT USING (true);
CREATE POLICY "Chapters are viewable by everyone" ON library_book_chapters FOR SELECT USING (true);

-- User progress and bookmarks are only accessible by the user who owns them
CREATE POLICY "Users can view own progress" ON user_book_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_book_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_book_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON user_book_progress FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own bookmarks" ON user_book_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON user_book_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookmarks" ON user_book_bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON user_book_bookmarks FOR DELETE USING (auth.uid() = user_id);
