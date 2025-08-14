-- Apply all library changes to ensure the system is fully operational
-- This script should be run after the main library setup

-- Ensure all necessary extensions are enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update any existing user progress to ensure consistency
UPDATE user_book_progress 
SET updated_at = NOW() 
WHERE updated_at IS NULL;

-- Create additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_book_progress_last_read ON user_book_progress(last_read_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_book_progress_completed ON user_book_progress(completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_library_books_rating ON library_books(rating DESC);
CREATE INDEX IF NOT EXISTS idx_library_books_created ON library_books(created_at DESC);

-- Create a view for user reading statistics
CREATE OR REPLACE VIEW user_reading_stats AS
SELECT 
    user_id,
    COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as books_completed,
    COUNT(CASE WHEN completed_at IS NULL AND progress_percentage > 0 THEN 1 END) as books_in_progress,
    COALESCE(SUM(reading_time_minutes), 0) as total_reading_minutes,
    COALESCE(AVG(CASE WHEN completed_at IS NOT NULL THEN reading_time_minutes END), 0) as avg_reading_time_per_book,
    MAX(last_read_at) as last_activity
FROM user_book_progress
GROUP BY user_id;

-- Create a view for book statistics
CREATE OR REPLACE VIEW book_reading_stats AS
SELECT 
    b.id,
    b.title,
    b.author,
    b.category,
    COUNT(p.user_id) as total_readers,
    COUNT(CASE WHEN p.completed_at IS NOT NULL THEN 1 END) as completed_readers,
    COALESCE(AVG(CASE WHEN p.completed_at IS NOT NULL THEN p.reading_time_minutes END), 0) as avg_completion_time,
    COALESCE(AVG(p.progress_percentage), 0) as avg_progress
FROM library_books b
LEFT JOIN user_book_progress p ON b.id = p.book_id
GROUP BY b.id, b.title, b.author, b.category;

-- Grant necessary permissions
GRANT SELECT ON user_reading_stats TO authenticated;
GRANT SELECT ON book_reading_stats TO authenticated;

-- Create function to get user's current reading list
CREATE OR REPLACE FUNCTION get_user_reading_list(user_uuid UUID)
RETURNS TABLE(
    book_id UUID,
    title TEXT,
    author TEXT,
    cover_image TEXT,
    category TEXT,
    progress_percentage INTEGER,
    current_chapter INTEGER,
    last_read_at TIMESTAMP WITH TIME ZONE,
    reading_time_minutes INTEGER,
    is_completed BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.title,
        b.author,
        b.cover_image,
        b.category,
        p.progress_percentage,
        p.current_chapter,
        p.last_read_at,
        p.reading_time_minutes,
        (p.completed_at IS NOT NULL) as is_completed
    FROM user_book_progress p
    JOIN library_books b ON p.book_id = b.id
    WHERE p.user_id = user_uuid
    ORDER BY p.last_read_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update reading progress
CREATE OR REPLACE FUNCTION update_reading_progress(
    user_uuid UUID,
    book_uuid UUID,
    chapter_num INTEGER,
    progress_pct INTEGER,
    reading_minutes INTEGER DEFAULT 0
)
RETURNS BOOLEAN AS $$
DECLARE
    total_chapters INTEGER;
    is_completed BOOLEAN := false;
BEGIN
    -- Get total chapters for the book
    SELECT COUNT(*) INTO total_chapters
    FROM library_book_chapters
    WHERE book_id = book_uuid;
    
    -- Check if book is completed
    IF progress_pct >= 100 OR chapter_num >= total_chapters THEN
        is_completed := true;
        progress_pct := 100;
    END IF;
    
    -- Insert or update progress
    INSERT INTO user_book_progress (
        user_id, 
        book_id, 
        current_chapter, 
        progress_percentage, 
        reading_time_minutes,
        last_read_at,
        completed_at
    )
    VALUES (
        user_uuid, 
        book_uuid, 
        chapter_num, 
        progress_pct, 
        reading_minutes,
        NOW(),
        CASE WHEN is_completed THEN NOW() ELSE NULL END
    )
    ON CONFLICT (user_id, book_id)
    DO UPDATE SET
        current_chapter = EXCLUDED.current_chapter,
        progress_percentage = EXCLUDED.progress_percentage,
        reading_time_minutes = user_book_progress.reading_time_minutes + EXCLUDED.reading_time_minutes,
        last_read_at = EXCLUDED.last_read_at,
        completed_at = CASE 
            WHEN EXCLUDED.progress_percentage >= 100 AND user_book_progress.completed_at IS NULL 
            THEN NOW() 
            ELSE user_book_progress.completed_at 
        END,
        updated_at = NOW();
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add bookmark
CREATE OR REPLACE FUNCTION add_bookmark(
    user_uuid UUID,
    book_uuid UUID,
    chapter_uuid UUID,
    chapter_title_text TEXT,
    note_text TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    bookmark_id UUID;
BEGIN
    INSERT INTO user_book_bookmarks (
        user_id,
        book_id,
        chapter_id,
        chapter_title,
        note
    )
    VALUES (
        user_uuid,
        book_uuid,
        chapter_uuid,
        chapter_title_text,
        note_text
    )
    RETURNING id INTO bookmark_id;
    
    RETURN bookmark_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add highlight
CREATE OR REPLACE FUNCTION add_highlight(
    user_uuid UUID,
    book_uuid UUID,
    chapter_uuid UUID,
    selected_text_content TEXT,
    start_pos INTEGER,
    end_pos INTEGER,
    highlight_color TEXT DEFAULT 'yellow',
    note_text TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    highlight_id UUID;
BEGIN
    INSERT INTO user_book_highlights (
        user_id,
        book_id,
        chapter_id,
        selected_text,
        start_position,
        end_position,
        color,
        note
    )
    VALUES (
        user_uuid,
        book_uuid,
        chapter_uuid,
        selected_text_content,
        start_pos,
        end_pos,
        highlight_color,
        note_text
    )
    RETURNING id INTO highlight_id;
    
    RETURN highlight_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add note
CREATE OR REPLACE FUNCTION add_note(
    user_uuid UUID,
    book_uuid UUID,
    chapter_uuid UUID,
    note_content TEXT,
    note_position INTEGER DEFAULT 0,
    is_private_note BOOLEAN DEFAULT true
)
RETURNS UUID AS $$
DECLARE
    note_id UUID;
BEGIN
    INSERT INTO user_book_notes (
        user_id,
        book_id,
        chapter_id,
        content,
        position,
        is_private
    )
    VALUES (
        user_uuid,
        book_uuid,
        chapter_uuid,
        note_content,
        note_position,
        is_private_note
    )
    RETURNING id INTO note_id;
    
    RETURN note_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's highlights for a chapter
CREATE OR REPLACE FUNCTION get_user_highlights(
    user_uuid UUID,
    chapter_uuid UUID
)
RETURNS TABLE(
    id UUID,
    selected_text TEXT,
    start_position INTEGER,
    end_position INTEGER,
    color TEXT,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.id,
        h.selected_text,
        h.start_position,
        h.end_position,
        h.color,
        h.note,
        h.created_at
    FROM user_book_highlights h
    WHERE h.user_id = user_uuid AND h.chapter_id = chapter_uuid
    ORDER BY h.start_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's notes for a chapter
CREATE OR REPLACE FUNCTION get_user_notes(
    user_uuid UUID,
    chapter_uuid UUID
)
RETURNS TABLE(
    id UUID,
    content TEXT,
    position INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.content,
        n.position,
        n.created_at,
        n.updated_at
    FROM user_book_notes n
    WHERE n.user_id = user_uuid AND n.chapter_id = chapter_uuid
    ORDER BY n.position, n.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's bookmarks for a book
CREATE OR REPLACE FUNCTION get_user_bookmarks(
    user_uuid UUID,
    book_uuid UUID
)
RETURNS TABLE(
    id UUID,
    chapter_id UUID,
    chapter_title TEXT,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.chapter_id,
        b.chapter_title,
        b.note,
        b.created_at
    FROM user_book_bookmarks b
    WHERE b.user_id = user_uuid AND b.book_id = book_uuid
    ORDER BY b.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_user_reading_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recommended_books(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_reading_list(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_reading_progress(UUID, UUID, INTEGER, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION add_bookmark(UUID, UUID, UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION add_highlight(UUID, UUID, UUID, TEXT, INTEGER, INTEGER, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION add_note(UUID, UUID, UUID, TEXT, INTEGER, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_highlights(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_notes(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_bookmarks(UUID, UUID) TO authenticated;

-- Final verification query
SELECT 
    'Library setup completed successfully' as status,
    COUNT(*) as total_books,
    COUNT(CASE WHEN is_recommended THEN 1 END) as recommended_books,
    COUNT(DISTINCT category) as categories
FROM library_books;
