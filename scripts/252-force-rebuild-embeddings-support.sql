-- ============================================================================
-- Script 252: Force Rebuild Embeddings Support (Complete Reset)
-- ============================================================================

-- Drop all existing functions with CASCADE to remove dependencies
DROP FUNCTION IF EXISTS search_brain_semantic CASCADE;
DROP FUNCTION IF EXISTS search_knowledge_semantic CASCADE;
DROP FUNCTION IF EXISTS search_web_resources_semantic CASCADE;
DROP FUNCTION IF EXISTS get_items_needing_embeddings CASCADE;
DROP FUNCTION IF EXISTS log_embedding_generation CASCADE;

-- Drop existing view
DROP VIEW IF EXISTS embedding_statistics CASCADE;

-- Drop existing table
DROP TABLE IF EXISTS embedding_generation_logs CASCADE;

-- Drop existing indexes
DROP INDEX IF EXISTS knowledge_base_embedding_idx CASCADE;
DROP INDEX IF EXISTS web_resources_embedding_idx CASCADE;
DROP INDEX IF EXISTS embedding_logs_source_idx CASCADE;
DROP INDEX IF EXISTS embedding_logs_created_idx CASCADE;
DROP INDEX IF EXISTS embedding_logs_status_idx CASCADE;

-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'knowledge_base' AND column_name = 'embedding'
    ) THEN
        ALTER TABLE knowledge_base ADD COLUMN embedding vector(1536);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'web_resources' AND column_name = 'embedding'
    ) THEN
        ALTER TABLE web_resources ADD COLUMN embedding vector(1536);
    END IF;
END $$;

-- Create vector indexes
CREATE INDEX knowledge_base_embedding_idx 
ON knowledge_base 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX web_resources_embedding_idx 
ON web_resources 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create embedding logs table
CREATE TABLE embedding_generation_logs (
    id SERIAL PRIMARY KEY,
    source_type TEXT NOT NULL CHECK (source_type IN ('book', 'web_resource')),
    source_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'failed')),
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX embedding_logs_source_idx ON embedding_generation_logs(source_type, source_id);
CREATE INDEX embedding_logs_created_idx ON embedding_generation_logs(created_at DESC);
CREATE INDEX embedding_logs_status_idx ON embedding_generation_logs(status);

-- Create log function
CREATE FUNCTION log_embedding_generation(
    p_source_type TEXT,
    p_source_id INTEGER,
    p_status TEXT,
    p_error_message TEXT DEFAULT NULL,
    p_processing_time_ms INTEGER DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO embedding_generation_logs (source_type, source_id, status, error_message, processing_time_ms)
    VALUES (p_source_type, p_source_id, p_status, p_error_message, p_processing_time_ms);
END;
$$;

-- Create function to get items needing embeddings
CREATE FUNCTION get_items_needing_embeddings()
RETURNS TABLE (source_type TEXT, id INTEGER, title TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 'book'::TEXT, kb.id, kb.title FROM knowledge_base kb WHERE kb.embedding IS NULL
    UNION ALL
    SELECT 'web_resource'::TEXT, wr.id, wr.title FROM web_resources wr WHERE wr.embedding IS NULL
    ORDER BY 1, 2;
END;
$$;

-- Create semantic search for books
CREATE FUNCTION search_knowledge_semantic(
    query_embedding vector(1536),
    similarity_threshold FLOAT DEFAULT 0.7,
    limit_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    author TEXT,
    category TEXT,
    tags TEXT[],
    slug TEXT,
    content_preview TEXT,
    similarity_score FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        kb.id,
        kb.title,
        kb.author,
        kb.category,
        kb.tags,
        kb.slug,
        LEFT(kb.content, 300),
        (1 - (kb.embedding <=> query_embedding))::FLOAT
    FROM knowledge_base kb
    WHERE kb.embedding IS NOT NULL
        AND (1 - (kb.embedding <=> query_embedding)) >= similarity_threshold
    ORDER BY kb.embedding <=> query_embedding
    LIMIT limit_results;
END;
$$;

-- Create semantic search for web resources
CREATE FUNCTION search_web_resources_semantic(
    query_embedding vector(1536),
    similarity_threshold FLOAT DEFAULT 0.7,
    limit_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    author TEXT,
    category TEXT,
    tags TEXT[],
    url TEXT,
    content_preview TEXT,
    similarity_score FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wr.id,
        wr.title,
        wr.author,
        wr.category,
        wr.tags,
        wr.url,
        COALESCE(LEFT(wr.content, 300), LEFT(wr.description, 300)),
        (1 - (wr.embedding <=> query_embedding))::FLOAT
    FROM web_resources wr
    WHERE wr.embedding IS NOT NULL
        AND (1 - (wr.embedding <=> query_embedding)) >= similarity_threshold
    ORDER BY wr.embedding <=> query_embedding
    LIMIT limit_results;
END;
$$;

-- Create unified semantic search
CREATE FUNCTION search_brain_semantic(
    query_embedding vector(1536),
    similarity_threshold FLOAT DEFAULT 0.7,
    source_type_filter TEXT DEFAULT NULL,
    limit_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    source_type TEXT,
    id INTEGER,
    title TEXT,
    author TEXT,
    category TEXT,
    tags TEXT[],
    identifier TEXT,
    content_preview TEXT,
    similarity_score FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH combined_results AS (
        SELECT 
            'book'::TEXT,
            kb.id,
            kb.title,
            kb.author,
            kb.category,
            kb.tags,
            kb.slug,
            LEFT(kb.content, 300),
            (1 - (kb.embedding <=> query_embedding))::FLOAT
        FROM knowledge_base kb
        WHERE kb.embedding IS NOT NULL
            AND (source_type_filter IS NULL OR source_type_filter = 'book')
            AND (1 - (kb.embedding <=> query_embedding)) >= similarity_threshold
        UNION ALL
        SELECT 
            'web_resource'::TEXT,
            wr.id,
            wr.title,
            wr.author,
            wr.category,
            wr.tags,
            wr.url,
            COALESCE(LEFT(wr.content, 300), LEFT(wr.description, 300)),
            (1 - (wr.embedding <=> query_embedding))::FLOAT
        FROM web_resources wr
        WHERE wr.embedding IS NOT NULL
            AND (source_type_filter IS NULL OR source_type_filter = 'web_resource')
            AND (1 - (wr.embedding <=> query_embedding)) >= similarity_threshold
    )
    SELECT * FROM combined_results
    ORDER BY 9 DESC
    LIMIT limit_results;
END;
$$;

-- Create statistics view
CREATE VIEW embedding_statistics AS
SELECT 
    'Books' as source,
    COUNT(*) as total_items,
    COUNT(embedding) as items_with_embeddings,
    COUNT(*) - COUNT(embedding) as items_missing_embeddings,
    ROUND((COUNT(embedding)::FLOAT / NULLIF(COUNT(*), 0) * 100)::NUMERIC, 2) as completion_percentage
FROM knowledge_base
UNION ALL
SELECT 
    'Web Resources',
    COUNT(*),
    COUNT(embedding),
    COUNT(*) - COUNT(embedding),
    ROUND((COUNT(embedding)::FLOAT / NULLIF(COUNT(*), 0) * 100)::NUMERIC, 2)
FROM web_resources
UNION ALL
SELECT 
    'TOTAL',
    (SELECT COUNT(*) FROM knowledge_base) + (SELECT COUNT(*) FROM web_resources),
    (SELECT COUNT(embedding) FROM knowledge_base) + (SELECT COUNT(embedding) FROM web_resources),
    ((SELECT COUNT(*) FROM knowledge_base) + (SELECT COUNT(*) FROM web_resources)) - 
    ((SELECT COUNT(embedding) FROM knowledge_base) + (SELECT COUNT(embedding) FROM web_resources)),
    ROUND((
        ((SELECT COUNT(embedding) FROM knowledge_base) + (SELECT COUNT(embedding) FROM web_resources))::FLOAT / 
        NULLIF(((SELECT COUNT(*) FROM knowledge_base) + (SELECT COUNT(*) FROM web_resources)), 0) * 100
    )::NUMERIC, 2);

-- Grant permissions
GRANT SELECT ON embedding_statistics TO authenticated, anon;
GRANT SELECT ON embedding_generation_logs TO authenticated, anon;
GRANT EXECUTE ON FUNCTION log_embedding_generation TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_items_needing_embeddings TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_knowledge_semantic TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_web_resources_semantic TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_brain_semantic TO authenticated, anon;

-- Display success message
DO $$
DECLARE
    v_books INTEGER;
    v_resources INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_books FROM knowledge_base;
    SELECT COUNT(*) INTO v_resources FROM web_resources;
    RAISE NOTICE 'SUCCESS: Embeddings support rebuilt!';
    RAISE NOTICE 'Books: % | Web Resources: % | Total: %', v_books, v_resources, v_books + v_resources;
    RAISE NOTICE 'Next: SELECT * FROM embedding_statistics;';
END $$;
