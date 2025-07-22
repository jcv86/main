-- Create library functions for the career development platform

-- Function to get user's reading progress for a specific book
CREATE OR REPLACE FUNCTION get_user_book_progress(p_user_id UUID, p_book_id UUID)
RETURNS TABLE (
    book_id UUID,
    title VARCHAR,
    author VARCHAR,
    progress INTEGER,
    current_page INTEGER,
    total_pages INTEGER,
    reading_time_minutes INTEGER,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_read_at TIMESTAMP WITH TIME ZONE,
    user_rating INTEGER,
    notes TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.title,
        b.author,
        COALESCE(ubp.progress, 0),
        COALESCE(ubp.current_page, 0),
        COALESCE(ubp.total_pages, b.pages),
        COALESCE(ubp.reading_time_minutes, 0),
        ubp.started_at,
        ubp.completed_at,
        ubp.last_read_at,
        ubp.rating,
        ubp.notes
    FROM books b
    LEFT JOIN user_book_progress ubp ON b.id = ubp.book_id AND ubp.user_id = p_user_id
    WHERE b.id = p_book_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user's reading progress
CREATE OR REPLACE FUNCTION update_reading_progress(
    p_user_id UUID,
    p_book_id UUID,
    p_current_page INTEGER,
    p_total_pages INTEGER DEFAULT NULL,
    p_reading_time_minutes INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_progress INTEGER;
    v_total_pages INTEGER;
BEGIN
    -- Get total pages from book if not provided
    IF p_total_pages IS NULL THEN
        SELECT pages INTO v_total_pages FROM books WHERE id = p_book_id;
    ELSE
        v_total_pages := p_total_pages;
    END IF;
    
    -- Calculate progress percentage
    IF v_total_pages > 0 THEN
        v_progress := LEAST(100, GREATEST(0, ROUND((p_current_page::DECIMAL / v_total_pages) * 100)));
    ELSE
        v_progress := 0;
    END IF;
    
    -- Insert or update progress
    INSERT INTO user_book_progress (
        user_id, 
        book_id, 
        progress, 
        current_page, 
        total_pages, 
        reading_time_minutes,
        started_at,
        last_read_at,
        completed_at
    )
    VALUES (
        p_user_id,
        p_book_id,
        v_progress,
        p_current_page,
        v_total_pages,
        COALESCE(p_reading_time_minutes, 0),
        CASE WHEN NOT EXISTS (SELECT 1 FROM user_book_progress WHERE user_id = p_user_id AND book_id = p_book_id) 
             THEN NOW() 
             ELSE NULL 
        END,
        NOW(),
        CASE WHEN v_progress >= 100 THEN NOW() ELSE NULL END
    )
    ON CONFLICT (user_id, book_id)
    DO UPDATE SET
        progress = v_progress,
        current_page = p_current_page,
        total_pages = v_total_pages,
        reading_time_minutes = COALESCE(user_book_progress.reading_time_minutes, 0) + COALESCE(p_reading_time_minutes, 0),
        last_read_at = NOW(),
        completed_at = CASE WHEN v_progress >= 100 AND user_book_progress.completed_at IS NULL 
                           THEN NOW() 
                           ELSE user_book_progress.completed_at 
                      END,
        updated_at = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's reading statistics
CREATE OR REPLACE FUNCTION get_user_reading_stats(p_user_id UUID)
RETURNS TABLE (
    total_books INTEGER,
    completed_books INTEGER,
    in_progress_books INTEGER,
    total_reading_time INTEGER,
    average_rating DECIMAL,
    books_this_month INTEGER,
    reading_streak INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_books,
        COUNT(CASE WHEN ubp.progress = 100 THEN 1 END)::INTEGER as completed_books,
        COUNT(CASE WHEN ubp.progress > 0 AND ubp.progress < 100 THEN 1 END)::INTEGER as in_progress_books,
        COALESCE(SUM(ubp.reading_time_minutes), 0)::INTEGER as total_reading_time,
        ROUND(AVG(ubp.rating), 2) as average_rating,
        COUNT(CASE WHEN ubp.started_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END)::INTEGER as books_this_month,
        -- Simple streak calculation (days with reading activity in last 30 days)
        (SELECT COUNT(DISTINCT DATE(last_read_at))
         FROM user_book_progress 
         WHERE user_id = p_user_id 
         AND last_read_at >= CURRENT_DATE - INTERVAL '30 days')::INTEGER as reading_streak
    FROM user_book_progress ubp
    WHERE ubp.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add or update a bookmark
CREATE OR REPLACE FUNCTION add_bookmark(
    p_user_id UUID,
    p_book_id UUID,
    p_page_number INTEGER,
    p_chapter_title VARCHAR DEFAULT NULL,
    p_note TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_bookmark_id UUID;
BEGIN
    INSERT INTO user_book_bookmarks (user_id, book_id, page_number, chapter_title, note)
    VALUES (p_user_id, p_book_id, p_page_number, p_chapter_title, p_note)
    RETURNING id INTO v_bookmark_id;
    
    RETURN v_bookmark_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's bookmarks for a book
CREATE OR REPLACE FUNCTION get_user_bookmarks(p_user_id UUID, p_book_id UUID)
RETURNS TABLE (
    id UUID,
    page_number INTEGER,
    chapter_title VARCHAR,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ubb.id,
        ubb.page_number,
        ubb.chapter_title,
        ubb.note,
        ubb.created_at
    FROM user_book_bookmarks ubb
    WHERE ubb.user_id = p_user_id AND ubb.book_id = p_book_id
    ORDER BY ubb.page_number ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recommended books based on user's reading history
CREATE OR REPLACE FUNCTION get_recommended_books(p_user_id UUID, p_limit INTEGER DEFAULT 6)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    author VARCHAR,
    description TEXT,
    category VARCHAR,
    rating DECIMAL,
    reading_time VARCHAR,
    pages INTEGER,
    cover_url TEXT,
    tags TEXT[],
    difficulty VARCHAR,
    key_topics TEXT[],
    is_user_reading BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.title,
        b.author,
        b.description,
        b.category,
        b.rating,
        b.reading_time,
        b.pages,
        b.cover_url,
        b.tags,
        b.difficulty,
        b.key_topics,
        CASE WHEN ubp.id IS NOT NULL THEN TRUE ELSE FALSE END as is_user_reading
    FROM books b
    LEFT JOIN user_book_progress ubp ON b.id = ubp.book_id AND ubp.user_id = p_user_id
    WHERE b.is_recommended = true
    OR b.category IN (
        SELECT DISTINCT b2.category 
        FROM books b2 
        JOIN user_book_progress ubp2 ON b2.id = ubp2.book_id 
        WHERE ubp2.user_id = p_user_id AND ubp2.rating >= 4
    )
    ORDER BY 
        b.is_recommended DESC,
        b.rating DESC,
        CASE WHEN ubp.id IS NOT NULL THEN 1 ELSE 0 END ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search books
CREATE OR REPLACE FUNCTION search_books(
    p_search_term TEXT DEFAULT NULL,
    p_category VARCHAR DEFAULT NULL,
    p_difficulty VARCHAR DEFAULT NULL,
    p_min_rating DECIMAL DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    author VARCHAR,
    description TEXT,
    category VARCHAR,
    rating DECIMAL,
    reading_time VARCHAR,
    pages INTEGER,
    cover_url TEXT,
    tags TEXT[],
    difficulty VARCHAR,
    key_topics TEXT[],
    is_recommended BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.title,
        b.author,
        b.description,
        b.category,
        b.rating,
        b.reading_time,
        b.pages,
        b.cover_url,
        b.tags,
        b.difficulty,
        b.key_topics,
        b.is_recommended
    FROM books b
    WHERE 
        (p_search_term IS NULL OR 
         b.title ILIKE '%' || p_search_term || '%' OR 
         b.author ILIKE '%' || p_search_term || '%' OR
         b.description ILIKE '%' || p_search_term || '%' OR
         EXISTS (SELECT 1 FROM unnest(b.tags) AS tag WHERE tag ILIKE '%' || p_search_term || '%') OR
         EXISTS (SELECT 1 FROM unnest(b.key_topics) AS topic WHERE topic ILIKE '%' || p_search_term || '%')
        )
        AND (p_category IS NULL OR b.category = p_category)
        AND (p_difficulty IS NULL OR b.difficulty = p_difficulty)
        AND (p_min_rating IS NULL OR b.rating >= p_min_rating)
    ORDER BY 
        b.is_recommended DESC,
        b.rating DESC,
        b.title ASC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
