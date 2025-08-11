-- Fix user_book_bookmarks table structure
-- Drop and recreate with correct columns

DROP TABLE IF EXISTS user_book_bookmarks CASCADE;

CREATE TABLE user_book_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES book_chapters(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL DEFAULT 1,
    chapter_title TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    highlight_text TEXT,
    bookmark_type TEXT NOT NULL DEFAULT 'bookmark' CHECK (bookmark_type IN ('note', 'highlight', 'bookmark')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_book_bookmarks_user_id ON user_book_bookmarks(user_id);
CREATE INDEX idx_user_book_bookmarks_book_id ON user_book_bookmarks(book_id);
CREATE INDEX idx_user_book_bookmarks_created_at ON user_book_bookmarks(created_at DESC);

-- Enable RLS
ALTER TABLE user_book_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own bookmarks" ON user_book_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON user_book_bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" ON user_book_bookmarks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON user_book_bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_book_bookmarks_updated_at 
    BEFORE UPDATE ON user_book_bookmarks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
