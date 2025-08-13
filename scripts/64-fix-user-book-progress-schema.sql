-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS public.user_book_notes CASCADE;
DROP TABLE IF EXISTS public.user_book_bookmarks CASCADE;
DROP TABLE IF EXISTS public.user_book_progress CASCADE;
DROP TABLE IF EXISTS public.library_book_chapters CASCADE;
DROP TABLE IF EXISTS public.library_books CASCADE;

-- Create library_books table
CREATE TABLE public.library_books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50) CHECK (difficulty IN ('Principiante', 'Intermedio', 'Avanzado')),
    estimated_reading_time INTEGER DEFAULT 240, -- in minutes
    pages INTEGER,
    published_year INTEGER,
    rating DECIMAL(3,2) DEFAULT 4.0,
    tags TEXT[],
    key_topics TEXT[],
    is_recommended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create library_book_chapters table
CREATE TABLE public.library_book_chapters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, "order")
);

-- Create user_book_progress table with correct column names
CREATE TABLE public.user_book_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
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
CREATE TABLE public.user_book_bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.library_book_chapters(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_book_notes table
CREATE TABLE public.user_book_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.library_book_chapters(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_library_books_category ON public.library_books(category);
CREATE INDEX idx_library_books_difficulty ON public.library_books(difficulty);
CREATE INDEX idx_library_books_is_recommended ON public.library_books(is_recommended);
CREATE INDEX idx_library_book_chapters_book_id ON public.library_book_chapters(book_id);
CREATE INDEX idx_library_book_chapters_order ON public.library_book_chapters(book_id, "order");
CREATE INDEX idx_user_book_progress_user_id ON public.user_book_progress(user_id);
CREATE INDEX idx_user_book_progress_book_id ON public.user_book_progress(book_id);
CREATE INDEX idx_user_book_bookmarks_user_book ON public.user_book_bookmarks(user_id, book_id);
CREATE INDEX idx_user_book_notes_user_book ON public.user_book_notes(user_id, book_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_book_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_book_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Library books and chapters are public (readable by everyone)
CREATE POLICY "Library books are viewable by everyone" ON public.library_books
    FOR SELECT USING (true);

CREATE POLICY "Library book chapters are viewable by everyone" ON public.library_book_chapters
    FOR SELECT USING (true);

-- User progress, bookmarks, and notes are private (only accessible by the user)
CREATE POLICY "Users can view their own book progress" ON public.user_book_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own book progress" ON public.user_book_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own book progress" ON public.user_book_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own book progress" ON public.user_book_progress
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own bookmarks" ON public.user_book_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON public.user_book_bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" ON public.user_book_bookmarks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON public.user_book_bookmarks
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own notes" ON public.user_book_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON public.user_book_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON public.user_book_notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON public.user_book_notes
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_library_books_updated_at BEFORE UPDATE ON public.library_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_progress_updated_at BEFORE UPDATE ON public.user_book_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
