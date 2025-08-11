-- Clear all library data completely
-- This script removes all books, chapters, user progress, bookmarks, and stats

-- First, disable foreign key checks temporarily by truncating in the right order
-- Start with dependent tables first

-- Clear user book bookmarks
TRUNCATE TABLE user_book_bookmarks CASCADE;

-- Clear user book progress  
TRUNCATE TABLE user_book_progress CASCADE;

-- Clear user reading stats
TRUNCATE TABLE user_reading_stats CASCADE;

-- Clear book chapters
TRUNCATE TABLE book_chapters CASCADE;

-- Clear books (main table)
TRUNCATE TABLE books CASCADE;

-- Reset any sequences if they exist
-- This ensures that when we add new books, IDs start fresh
SELECT setval(pg_get_serial_sequence('books', 'id'), 1, false) WHERE pg_get_serial_sequence('books', 'id') IS NOT NULL;
SELECT setval(pg_get_serial_sequence('book_chapters', 'id'), 1, false) WHERE pg_get_serial_sequence('book_chapters', 'id') IS NOT NULL;
SELECT setval(pg_get_serial_sequence('user_book_progress', 'id'), 1, false) WHERE pg_get_serial_sequence('user_book_progress', 'id') IS NOT NULL;
SELECT setval(pg_get_serial_sequence('user_book_bookmarks', 'id'), 1, false) WHERE pg_get_serial_sequence('user_book_bookmarks', 'id') IS NOT NULL;
SELECT setval(pg_get_serial_sequence('user_reading_stats', 'id'), 1, false) WHERE pg_get_serial_sequence('user_reading_stats', 'id') IS NOT NULL;

-- Verify all tables are empty
SELECT 'books' as table_name, COUNT(*) as count FROM books
UNION ALL
SELECT 'book_chapters' as table_name, COUNT(*) as count FROM book_chapters  
UNION ALL
SELECT 'user_book_progress' as table_name, COUNT(*) as count FROM user_book_progress
UNION ALL
SELECT 'user_book_bookmarks' as table_name, COUNT(*) as count FROM user_book_bookmarks
UNION ALL
SELECT 'user_reading_stats' as table_name, COUNT(*) as count FROM user_reading_stats;

-- Success message
SELECT 'All library data has been cleared successfully!' as status;
