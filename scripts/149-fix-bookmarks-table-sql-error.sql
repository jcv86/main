-- Fix the SQL error in knowledge categories summary
BEGIN;

-- Drop the problematic view first
DROP VIEW IF EXISTS knowledge_categories_summary;

-- Create user_bookmarks table
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES knowledge_base(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique bookmark per user per book
    UNIQUE(book_id, user_email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_email ON user_bookmarks(user_email);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_book_id ON user_bookmarks(book_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_created_at ON user_bookmarks(created_at);

-- Create function to increment read count
CREATE OR REPLACE FUNCTION increment_read_count(book_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE knowledge_base 
    SET read_count = read_count + 1,
        updated_at = NOW()
    WHERE id = book_id;
END;
$$ LANGUAGE plpgsql;

-- Create fixed view for knowledge categories summary (without set-returning functions in aggregates)
CREATE OR REPLACE VIEW knowledge_categories_summary AS
WITH category_tags AS (
    SELECT 
        category,
        COUNT(*) as book_count,
        SUM(read_count) as total_reads,
        ROUND(AVG(read_count)) as avg_reads,
        string_agg(DISTINCT author, ', ') as authors
    FROM knowledge_base
    GROUP BY category
),
category_all_tags AS (
    SELECT 
        category,
        array_agg(DISTINCT tag) as all_tags
    FROM (
        SELECT category, unnest(tags) as tag
        FROM knowledge_base
    ) t
    GROUP BY category
)
SELECT 
    ct.category,
    ct.book_count,
    ct.total_reads,
    ct.avg_reads,
    COALESCE(cat.all_tags, ARRAY[]::text[]) as all_tags,
    ct.authors
FROM category_tags ct
LEFT JOIN category_all_tags cat ON ct.category = cat.category
ORDER BY ct.book_count DESC;

-- Create search function for knowledge base
CREATE OR REPLACE FUNCTION search_knowledge_base(
    search_query TEXT,
    category_filter TEXT DEFAULT NULL,
    limit_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    category TEXT,
    content TEXT,
    author TEXT,
    tags TEXT[],
    slug TEXT,
    read_count INTEGER,
    relevance_score REAL,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        kb.id,
        kb.title,
        kb.category,
        kb.content,
        kb.author,
        kb.tags,
        kb.slug,
        kb.read_count,
        -- Simple relevance scoring based on text matches
        (
            CASE WHEN kb.title ILIKE '%' || search_query || '%' THEN 1.0 ELSE 0.0 END +
            CASE WHEN kb.author ILIKE '%' || search_query || '%' THEN 0.8 ELSE 0.0 END +
            CASE WHEN kb.content ILIKE '%' || search_query || '%' THEN 0.6 ELSE 0.0 END +
            CASE WHEN EXISTS (
                SELECT 1 FROM unnest(kb.tags) AS tag 
                WHERE tag ILIKE '%' || search_query || '%'
            ) THEN 0.7 ELSE 0.0 END
        )::REAL as relevance_score,
        kb.created_at,
        kb.updated_at
    FROM knowledge_base kb
    WHERE 
        (
            kb.title ILIKE '%' || search_query || '%' OR
            kb.author ILIKE '%' || search_query || '%' OR
            kb.content ILIKE '%' || search_query || '%' OR
            EXISTS (
                SELECT 1 FROM unnest(kb.tags) AS tag 
                WHERE tag ILIKE '%' || search_query || '%'
            )
        )
        AND (category_filter IS NULL OR kb.category = category_filter)
    ORDER BY relevance_score DESC, kb.read_count DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample bookmarks for demo user
INSERT INTO user_bookmarks (book_id, user_email) 
SELECT id, 'demo@example.com'
FROM knowledge_base 
WHERE title IN (
    'Atomic Habits',
    'Deep Work', 
    'The First 90 Days',
    'Designing Your Life',
    'Multipliers'
)
ON CONFLICT (book_id, user_email) DO NOTHING;

-- Update some read counts to make the data more realistic
UPDATE knowledge_base SET read_count = 
    CASE 
        WHEN title = 'Atomic Habits' THEN 156
        WHEN title = 'Deep Work' THEN 142
        WHEN title = 'The First 90 Days' THEN 98
        WHEN title = 'Designing Your Life' THEN 87
        WHEN title = 'Multipliers' THEN 76
        WHEN title = 'Getting Things Done' THEN 134
        WHEN title = 'Drive' THEN 123
        WHEN title = 'Mindset' THEN 119
        WHEN title = 'Influence' THEN 108
        WHEN title = 'Good to Great' THEN 95
        ELSE FLOOR(RANDOM() * 50) + 10
    END;

COMMIT;

-- Verify the setup
SELECT 'User bookmarks table created successfully!' as status;
SELECT COUNT(*) as total_bookmarks FROM user_bookmarks;
SELECT category, book_count, total_reads FROM knowledge_categories_summary LIMIT 5;
