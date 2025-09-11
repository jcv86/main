-- Enhance the platform brain with advanced search and categorization

-- Create full-text search configuration for better Spanish support
CREATE TEXT SEARCH CONFIGURATION IF NOT EXISTS spanish_config (COPY = spanish);

-- Add search ranking function
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
    relevance_score REAL
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
        ts_rank(
            to_tsvector('spanish', kb.title || ' ' || kb.content || ' ' || array_to_string(kb.tags, ' ')),
            plainto_tsquery('spanish', search_query)
        ) as relevance_score
    FROM knowledge_base kb
    WHERE 
        to_tsvector('spanish', kb.title || ' ' || kb.content || ' ' || array_to_string(kb.tags, ' ')) 
        @@ plainto_tsquery('spanish', search_query)
        AND (category_filter IS NULL OR kb.category = category_filter)
    ORDER BY relevance_score DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- Create knowledge categories summary
CREATE OR REPLACE VIEW knowledge_categories_summary AS
SELECT 
    category,
    COUNT(*) as book_count,
    array_agg(DISTINCT unnest(tags)) as all_tags,
    string_agg(DISTINCT author, ', ') as authors
FROM knowledge_base
GROUP BY category
ORDER BY book_count DESC;

-- Insert brain enhancement metadata
INSERT INTO platform_config (key, value, description) VALUES
('brain_search_enabled', 'true', 'Full-text search capability enabled'),
('brain_categories_count', (SELECT COUNT(DISTINCT category)::text FROM knowledge_base), 'Number of knowledge categories'),
('brain_total_authors', (SELECT COUNT(DISTINCT author)::text FROM knowledge_base), 'Number of unique authors'),
('brain_search_languages', 'spanish,english', 'Supported search languages')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

SELECT 'Brain search capabilities enhanced successfully' as status;
