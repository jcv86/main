-- Clear all library and Mirix system data completely
-- This script will remove all books, chapters, progress, bookmarks, stats, and Mirix data

BEGIN;

-- Disable foreign key checks temporarily
SET session_replication_role = replica;

-- Clear all library-related tables
TRUNCATE TABLE user_book_bookmarks CASCADE;
TRUNCATE TABLE user_book_progress CASCADE;
TRUNCATE TABLE user_reading_stats CASCADE;
TRUNCATE TABLE book_chapters CASCADE;
TRUNCATE TABLE books CASCADE;

-- Clear Mirix system tables if they exist
DO $$
BEGIN
    -- Clear Mirix memory entries
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mirix_memory_entries') THEN
        TRUNCATE TABLE mirix_memory_entries CASCADE;
    END IF;
    
    -- Clear Mirix sessions
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mirix_sessions') THEN
        TRUNCATE TABLE mirix_sessions CASCADE;
    END IF;
    
    -- Clear any other Mirix tables
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mirix_insights') THEN
        TRUNCATE TABLE mirix_insights CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mirix_connections') THEN
        TRUNCATE TABLE mirix_connections CASCADE;
    END IF;
END $$;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Reset sequences to start from 1
DO $$
DECLARE
    seq_record RECORD;
BEGIN
    -- Reset all sequences related to library tables
    FOR seq_record IN 
        SELECT schemaname, sequencename 
        FROM pg_sequences 
        WHERE sequencename LIKE '%book%' 
           OR sequencename LIKE '%reading%'
           OR sequencename LIKE '%mirix%'
    LOOP
        EXECUTE 'ALTER SEQUENCE ' || quote_ident(seq_record.schemaname) || '.' || quote_ident(seq_record.sequencename) || ' RESTART WITH 1';
    END LOOP;
END $$;

-- Verify cleanup
SELECT 
    'books' as table_name, COUNT(*) as record_count FROM books
UNION ALL
SELECT 
    'book_chapters' as table_name, COUNT(*) as record_count FROM book_chapters
UNION ALL
SELECT 
    'user_book_progress' as table_name, COUNT(*) as record_count FROM user_book_progress
UNION ALL
SELECT 
    'user_book_bookmarks' as table_name, COUNT(*) as record_count FROM user_book_bookmarks
UNION ALL
SELECT 
    'user_reading_stats' as table_name, COUNT(*) as record_count FROM user_reading_stats;

-- Success message
SELECT 'Library and Mirix data cleared successfully! All tables are now empty.' as status;

COMMIT;
