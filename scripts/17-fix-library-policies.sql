-- Fix library policies - drop existing ones and recreate
-- This script handles the case where policies already exist

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Books are viewable by everyone" ON books;
DROP POLICY IF EXISTS "Only admins can insert books" ON books;
DROP POLICY IF EXISTS "Only admins can update books" ON books;

DROP POLICY IF EXISTS "Users can view their own book progress" ON user_book_progress;
DROP POLICY IF EXISTS "Users can insert their own book progress" ON user_book_progress;
DROP POLICY IF EXISTS "Users can update their own book progress" ON user_book_progress;
DROP POLICY IF EXISTS "Users can delete their own book progress" ON user_book_progress;

DROP POLICY IF EXISTS "Users can view their own bookmarks" ON user_book_bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON user_book_bookmarks;
DROP POLICY IF EXISTS "Users can update their own bookmarks" ON user_book_bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON user_book_bookmarks;

DROP POLICY IF EXISTS "Users can view their own reading goals" ON user_reading_goals;
DROP POLICY IF EXISTS "Users can insert their own reading goals" ON user_reading_goals;
DROP POLICY IF EXISTS "Users can update their own reading goals" ON user_reading_goals;
DROP POLICY IF EXISTS "Users can delete their own reading goals" ON user_reading_goals;

-- Recreate policies
-- RLS Policies for books table (public read access)
CREATE POLICY "Books are viewable by everyone" ON books
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert books" ON books
    FOR INSERT WITH CHECK (false);

CREATE POLICY "Only admins can update books" ON books
    FOR UPDATE USING (false);

-- RLS Policies for user_book_progress table
CREATE POLICY "Users can view their own book progress" ON user_book_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own book progress" ON user_book_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own book progress" ON user_book_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own book progress" ON user_book_progress
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_book_bookmarks table
CREATE POLICY "Users can view their own bookmarks" ON user_book_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON user_book_bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" ON user_book_bookmarks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON user_book_bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_reading_goals table
CREATE POLICY "Users can view their own reading goals" ON user_reading_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading goals" ON user_reading_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading goals" ON user_reading_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading goals" ON user_reading_goals
    FOR DELETE USING (auth.uid() = user_id);
