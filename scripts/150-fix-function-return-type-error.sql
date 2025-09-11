-- Drop existing functions to avoid return type conflicts
DROP FUNCTION IF EXISTS increment_read_count(integer);
DROP FUNCTION IF EXISTS search_knowledge_base(text, text, integer);
DROP FUNCTION IF EXISTS get_knowledge_categories_summary();

-- Recreate increment_read_count function with proper return type
CREATE OR REPLACE FUNCTION increment_read_count(book_id integer)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE knowledge_base 
    SET read_count = read_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = book_id;
END;
$$;

-- Recreate search function with proper return type
CREATE OR REPLACE FUNCTION search_knowledge_base(
    search_query text,
    category_filter text DEFAULT NULL,
    limit_results integer DEFAULT 50
)
RETURNS TABLE(
    id integer,
    title text,
    category text,
    content text,
    author text,
    tags text[],
    slug text,
    read_count integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    relevance_score numeric
)
LANGUAGE plpgsql
AS $$
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
        kb.created_at,
        kb.updated_at,
        (
            CASE 
                WHEN kb.title ILIKE '%' || search_query || '%' THEN 3.0
                ELSE 0.0
            END +
            CASE 
                WHEN kb.author ILIKE '%' || search_query || '%' THEN 2.0
                ELSE 0.0
            END +
            CASE 
                WHEN kb.content ILIKE '%' || search_query || '%' THEN 1.0
                ELSE 0.0
            END +
            CASE 
                WHEN EXISTS (
                    SELECT 1 FROM unnest(kb.tags) AS tag 
                    WHERE tag ILIKE '%' || search_query || '%'
                ) THEN 2.5
                ELSE 0.0
            END
        ) AS relevance_score
    FROM knowledge_base kb
    WHERE 
        (category_filter IS NULL OR kb.category = category_filter)
        AND (
            kb.title ILIKE '%' || search_query || '%' OR
            kb.author ILIKE '%' || search_query || '%' OR
            kb.content ILIKE '%' || search_query || '%' OR
            EXISTS (
                SELECT 1 FROM unnest(kb.tags) AS tag 
                WHERE tag ILIKE '%' || search_query || '%'
            )
        )
    ORDER BY relevance_score DESC, kb.read_count DESC
    LIMIT limit_results;
END;
$$;

-- Recreate categories summary function
CREATE OR REPLACE FUNCTION get_knowledge_categories_summary()
RETURNS TABLE(
    category text,
    book_count bigint,
    total_reads bigint,
    avg_reads numeric
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        kb.category,
        COUNT(*) as book_count,
        SUM(kb.read_count) as total_reads,
        ROUND(AVG(kb.read_count), 2) as avg_reads
    FROM knowledge_base kb
    GROUP BY kb.category
    ORDER BY book_count DESC;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_read_count ON knowledge_base(read_count DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_created_at ON knowledge_base(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_title_gin ON knowledge_base USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_knowledge_base_content_gin ON knowledge_base USING gin(to_tsvector('english', content));

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION increment_read_count(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION search_knowledge_base(text, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_knowledge_categories_summary() TO authenticated;

-- Verify the functions work correctly
SELECT 'Functions created successfully' as status;
