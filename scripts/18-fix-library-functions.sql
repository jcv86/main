-- Fix library functions - drop existing ones and recreate with correct signatures
-- This script handles the case where functions already exist with different return types

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_books_with_progress(UUID);
DROP FUNCTION IF EXISTS get_recommended_books(UUID);
DROP FUNCTION IF EXISTS get_user_book_progress(UUID, UUID);
DROP FUNCTION IF EXISTS update_user_book_progress(UUID, UUID, INTEGER, INTEGER, INTEGER, TEXT, INTEGER);
DROP FUNCTION IF EXISTS get_user_reading_stats(UUID);
DROP FUNCTION IF EXISTS update_reading_progress(UUID, UUID, INTEGER, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS add_bookmark(UUID, UUID, INTEGER, VARCHAR, TEXT);
DROP FUNCTION IF EXISTS get_user_bookmarks(UUID, UUID);
DROP FUNCTION IF EXISTS search_books(TEXT, VARCHAR, VARCHAR, DECIMAL, INTEGER, INTEGER);

-- Function to get books with user progress
CREATE OR REPLACE FUNCTION get_books_with_progress(p_user_id UUID)
RETURNS TABLE (
   id UUID,
   title VARCHAR(255),
   author VARCHAR(255),
   description TEXT,
   category VARCHAR(100),
   rating DECIMAL(3,2),
   reading_time VARCHAR(50),
   pages INTEGER,
   published_year INTEGER,
   cover_url TEXT,
   tags TEXT[],
   is_recommended BOOLEAN,
   difficulty VARCHAR(50),
   key_topics TEXT[],
   user_progress INTEGER,
   started_at TIMESTAMP WITH TIME ZONE,
   completed_at TIMESTAMP WITH TIME ZONE,
   last_read_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
       b.published_year,
       b.cover_url,
       b.tags,
       b.is_recommended,
       b.difficulty,
       b.key_topics,
       COALESCE(ubp.progress, 0) as user_progress,
       ubp.started_at,
       ubp.completed_at,
       ubp.last_read_at
   FROM books b
   LEFT JOIN user_book_progress ubp ON b.id = ubp.book_id AND ubp.user_id = p_user_id
   ORDER BY b.rating DESC, b.title ASC;
END;
$$;

-- Function to get recommended books for a user
CREATE OR REPLACE FUNCTION get_recommended_books(p_user_id UUID)
RETURNS TABLE (
   id UUID,
   title VARCHAR(255),
   author VARCHAR(255),
   description TEXT,
   category VARCHAR(100),
   rating DECIMAL(3,2),
   reading_time VARCHAR(50),
   pages INTEGER,
   published_year INTEGER,
   cover_url TEXT,
   tags TEXT[],
   is_recommended BOOLEAN,
   difficulty VARCHAR(50),
   key_topics TEXT[],
   user_progress INTEGER,
   started_at TIMESTAMP WITH TIME ZONE,
   completed_at TIMESTAMP WITH TIME ZONE,
   last_read_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
       b.published_year,
       b.cover_url,
       b.tags,
       b.is_recommended,
       b.difficulty,
       b.key_topics,
       COALESCE(ubp.progress, 0) as user_progress,
       ubp.started_at,
       ubp.completed_at,
       ubp.last_read_at
   FROM books b
   LEFT JOIN user_book_progress ubp ON b.id = ubp.book_id AND ubp.user_id = p_user_id
   WHERE b.is_recommended = true
   ORDER BY b.rating DESC, b.title ASC;
END;
$$;

-- Function to get user's book progress
CREATE OR REPLACE FUNCTION get_user_book_progress(p_user_id UUID, p_book_id UUID)
RETURNS TABLE (
   book_id UUID,
   progress INTEGER,
   current_page INTEGER,
   total_pages INTEGER,
   reading_time_minutes INTEGER,
   started_at TIMESTAMP WITH TIME ZONE,
   completed_at TIMESTAMP WITH TIME ZONE,
   last_read_at TIMESTAMP WITH TIME ZONE,
   notes TEXT,
   rating INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
   RETURN QUERY
   SELECT 
       ubp.book_id,
       ubp.progress,
       ubp.current_page,
       ubp.total_pages,
       ubp.reading_time_minutes,
       ubp.started_at,
       ubp.completed_at,
       ubp.last_read_at,
       ubp.notes,
       ubp.rating
   FROM user_book_progress ubp
   WHERE ubp.user_id = p_user_id AND ubp.book_id = p_book_id;
END;
$$;

-- Function to update user's book progress
CREATE OR REPLACE FUNCTION update_user_book_progress(
   p_user_id UUID,
   p_book_id UUID,
   p_progress INTEGER DEFAULT NULL,
   p_current_page INTEGER DEFAULT NULL,
   p_reading_time_minutes INTEGER DEFAULT NULL,
   p_notes TEXT DEFAULT NULL,
   p_rating INTEGER DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
   v_started_at TIMESTAMP WITH TIME ZONE;
   v_completed_at TIMESTAMP WITH TIME ZONE;
BEGIN
   -- Determine started_at and completed_at based on progress
   IF p_progress IS NOT NULL THEN
       IF p_progress > 0 THEN
           v_started_at = COALESCE((SELECT started_at FROM user_book_progress WHERE user_id = p_user_id AND book_id = p_book_id), NOW());
       END IF;
       
       IF p_progress >= 100 THEN
           v_completed_at = NOW();
       END IF;
   END IF;

   -- Insert or update progress
   INSERT INTO user_book_progress (
       user_id,
       book_id,
       progress,
       current_page,
       reading_time_minutes,
       started_at,
       completed_at,
       last_read_at,
       notes,
       rating
   )
   VALUES (
       p_user_id,
       p_book_id,
       COALESCE(p_progress, 0),
       COALESCE(p_current_page, 0),
       COALESCE(p_reading_time_minutes, 0),
       v_started_at,
       v_completed_at,
       NOW(),
       p_notes,
       p_rating
   )
   ON CONFLICT (user_id, book_id)
   DO UPDATE SET
       progress = COALESCE(p_progress, user_book_progress.progress),
       current_page = COALESCE(p_current_page, user_book_progress.current_page),
       reading_time_minutes = COALESCE(p_reading_time_minutes, user_book_progress.reading_time_minutes),
       started_at = COALESCE(v_started_at, user_book_progress.started_at),
       completed_at = CASE 
           WHEN p_progress >= 100 THEN NOW()
           WHEN p_progress < 100 THEN NULL
           ELSE user_book_progress.completed_at
       END,
       last_read_at = NOW(),
       notes = COALESCE(p_notes, user_book_progress.notes),
       rating = COALESCE(p_rating, user_book_progress.rating),
       updated_at = NOW();
END;
$$;

-- Function to get user's reading statistics
CREATE OR REPLACE FUNCTION get_user_reading_stats(p_user_id UUID)
RETURNS TABLE (
   total_books INTEGER,
   books_in_progress INTEGER,
   books_completed INTEGER,
   total_reading_time_minutes INTEGER,
   average_rating DECIMAL(3,2),
   favorite_category VARCHAR(100)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
   RETURN QUERY
   WITH user_stats AS (
       SELECT 
           COUNT(*) as total_books,
           COUNT(CASE WHEN ubp.progress > 0 AND ubp.progress < 100 THEN 1 END) as books_in_progress,
           COUNT(CASE WHEN ubp.progress = 100 THEN 1 END) as books_completed,
           COALESCE(SUM(ubp.reading_time_minutes), 0) as total_reading_time_minutes,
           COALESCE(AVG(ubp.rating), 0.0) as average_rating
       FROM user_book_progress ubp
       WHERE ubp.user_id = p_user_id
   ),
   favorite_cat AS (
       SELECT b.category
       FROM user_book_progress ubp
       JOIN books b ON ubp.book_id = b.id
       WHERE ubp.user_id = p_user_id AND ubp.progress > 0
       GROUP BY b.category
       ORDER BY COUNT(*) DESC
       LIMIT 1
   )
   SELECT 
       us.total_books::INTEGER,
       us.books_in_progress::INTEGER,
       us.books_completed::INTEGER,
       us.total_reading_time_minutes::INTEGER,
       us.average_rating::DECIMAL(3,2),
       COALESCE(fc.category, 'N/A')::VARCHAR(100)
   FROM user_stats us
   LEFT JOIN favorite_cat fc ON true;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_books_with_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_recommended_books(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_book_progress(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_book_progress(UUID, UUID, INTEGER, INTEGER, INTEGER, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_reading_stats(UUID) TO authenticated;
