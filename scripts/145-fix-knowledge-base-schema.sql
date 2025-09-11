-- Fix knowledge_base table schema and add missing columns
BEGIN;

-- Add missing columns to knowledge_base table
ALTER TABLE knowledge_base 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
ADD COLUMN IF NOT EXISTS author VARCHAR(255) DEFAULT 'Unknown';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_slug ON knowledge_base(slug);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_author ON knowledge_base(author);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_search ON knowledge_base USING GIN(to_tsvector('spanish', title || ' ' || content || ' ' || COALESCE(author, '')));

-- Create or update the search function
CREATE OR REPLACE FUNCTION search_knowledge_base(
    search_query TEXT,
    category_filter TEXT DEFAULT NULL,
    limit_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(255),
    category VARCHAR(100),
    content TEXT,
    author VARCHAR(255),
    tags TEXT[],
    slug VARCHAR(255),
    read_count INTEGER,
    relevance_score REAL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
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
        ts_rank(
            to_tsvector('spanish', kb.title || ' ' || kb.content || ' ' || COALESCE(kb.author, '')),
            plainto_tsquery('spanish', search_query)
        ) as relevance_score,
        kb.created_at,
        kb.updated_at
    FROM knowledge_base kb
    WHERE 
        (category_filter IS NULL OR kb.category = category_filter)
        AND (
            to_tsvector('spanish', kb.title || ' ' || kb.content || ' ' || COALESCE(kb.author, '')) 
            @@ plainto_tsquery('spanish', search_query)
            OR kb.title ILIKE '%' || search_query || '%'
            OR kb.content ILIKE '%' || search_query || '%'
            OR kb.author ILIKE '%' || search_query || '%'
            OR search_query = ANY(kb.tags)
        )
    ORDER BY relevance_score DESC, kb.read_count DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- Create knowledge categories summary view (fixed)
CREATE OR REPLACE VIEW knowledge_categories_summary AS
WITH category_tags AS (
    SELECT 
        category,
        unnest(tags) as tag
    FROM knowledge_base
)
SELECT 
    kb.category,
    COUNT(*) as book_count,
    array_agg(DISTINCT ct.tag) as all_tags,
    string_agg(DISTINCT kb.author, ', ') as authors
FROM knowledge_base kb
LEFT JOIN category_tags ct ON kb.category = ct.category
GROUP BY kb.category
ORDER BY book_count DESC;

-- Create function to increment read count
CREATE OR REPLACE FUNCTION increment_read_count(book_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE knowledge_base 
    SET read_count = read_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = book_id;
END;
$$ LANGUAGE plpgsql;

-- Create platform_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS platform_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT 'Knowledge base schema updated successfully' as status;

COMMIT;
