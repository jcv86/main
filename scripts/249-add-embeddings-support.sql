-- ============================================================================
-- Script 249: Add Vector Embeddings Support for Semantic Search
-- ============================================================================
-- This script enables pgvector extension and creates all necessary tables,
-- functions, and indexes for semantic search functionality
-- ============================================================================

-- Enable the pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to knowledge_base table (books)
ALTER TABLE knowledge_base 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Add embedding column to web_resources table
ALTER TABLE web_resources 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create index for faster vector similarity search on knowledge_base
-- Using IVFFlat index for approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS knowledge_base_embedding_idx 
ON knowledge_base 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for faster vector similarity search on web_resources
CREATE INDEX IF NOT EXISTS web_resources_embedding_idx 
ON web_resources 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create table to track embedding generation logs
CREATE TABLE IF NOT EXISTS embedding_generation_logs (
    id SERIAL PRIMARY KEY,
    source_type TEXT NOT NULL CHECK (source_type IN ('book', 'web_resource')),
    source_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'failed')),
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on embedding logs for better query performance
CREATE INDEX IF NOT EXISTS embedding_logs_source_idx 
ON embedding_generation_logs(source_type, source_id);

CREATE INDEX IF NOT EXISTS embedding_logs_created_idx 
ON embedding_generation_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS embedding_logs_status_idx 
ON embedding_generation_logs(status);

-- ============================================================================
-- FUNCTION: log_embedding_generation
-- Purpose: Log embedding generation attempts for monitoring and debugging
-- Parameters:
--   p_source_type: 'book' or 'web_resource'
--   p_source_id: ID of the book or web resource
--   p_status: 'completed' or 'failed'
--   p_error_message: Error message if failed (optional)
--   p_processing_time_ms: Time taken to generate embedding (optional)
-- ============================================================================
CREATE OR REPLACE FUNCTION log_embedding_generation(
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
    INSERT INTO embedding_generation_logs (
        source_type,
        source_id,
        status,
        error_message,
        processing_time_ms
    )
    VALUES (
        p_source_type,
        p_source_id,
        p_status,
        p_error_message,
        p_processing_time_ms
    );
END;
$$;

-- ============================================================================
-- FUNCTION: get_items_needing_embeddings
-- Purpose: Get all books and web resources that don't have embeddings yet
-- Returns: Table with source_type, id, and title of items needing embeddings
-- ============================================================================
CREATE OR REPLACE FUNCTION get_items_needing_embeddings()
RETURNS TABLE (
    source_type TEXT,
    id INTEGER,
    title TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'book'::TEXT as source_type,
        kb.id,
        kb.title
    FROM knowledge_base kb
    WHERE kb.embedding IS NULL
    
    UNION ALL
    
    SELECT 
        'web_resource'::TEXT as source_type,
        wr.id,
        wr.title
    FROM web_resources wr
    WHERE wr.embedding IS NULL
    
    ORDER BY source_type, id;
END;
$$;

-- ============================================================================
-- FUNCTION: search_knowledge_semantic
-- Purpose: Perform semantic search on books using vector similarity
-- Parameters:
--   query_embedding: The 1536-dimensional embedding vector of the search query
--   similarity_threshold: Minimum similarity score (0.0 to 1.0), default 0.7
--   limit_results: Maximum number of results to return, default 10
-- Returns: Table with book details and similarity scores
-- ============================================================================
CREATE OR REPLACE FUNCTION search_knowledge_semantic(
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
        LEFT(kb.content, 300) as content_preview,
        (1 - (kb.embedding <=> query_embedding))::FLOAT as similarity_score
    FROM knowledge_base kb
    WHERE kb.embedding IS NOT NULL
        AND (1 - (kb.embedding <=> query_embedding)) >= similarity_threshold
    ORDER BY kb.embedding <=> query_embedding
    LIMIT limit_results;
END;
$$;

-- ============================================================================
-- FUNCTION: search_web_resources_semantic
-- Purpose: Perform semantic search on web resources using vector similarity
-- Parameters: Same as search_knowledge_semantic
-- Returns: Table with web resource details and similarity scores
-- ============================================================================
CREATE OR REPLACE FUNCTION search_web_resources_semantic(
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
        COALESCE(LEFT(wr.content, 300), LEFT(wr.description, 300)) as content_preview,
        (1 - (wr.embedding <=> query_embedding))::FLOAT as similarity_score
    FROM web_resources wr
    WHERE wr.embedding IS NOT NULL
        AND (1 - (wr.embedding <=> query_embedding)) >= similarity_threshold
    ORDER BY wr.embedding <=> query_embedding
    LIMIT limit_results;
END;
$$;

-- ============================================================================
-- FUNCTION: search_brain_semantic
-- Purpose: Unified semantic search across both books and web resources
-- This is the main function the AI brain will use for semantic search
-- Parameters:
--   query_embedding: The embedding vector of the search query
--   similarity_threshold: Minimum similarity score, default 0.7
--   source_type_filter: Optional filter ('book', 'web_resource', or NULL for both)
--   limit_results: Maximum number of results, default 10
-- Returns: Combined results from both sources with similarity scores
-- ============================================================================
CREATE OR REPLACE FUNCTION search_brain_semantic(
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
        -- Search in books (knowledge_base)
        SELECT 
            'book'::TEXT as source_type,
            kb.id,
            kb.title,
            kb.author,
            kb.category,
            kb.tags,
            kb.slug as identifier,
            LEFT(kb.content, 300) as content_preview,
            (1 - (kb.embedding <=> query_embedding))::FLOAT as similarity_score
        FROM knowledge_base kb
        WHERE kb.embedding IS NOT NULL
            AND (source_type_filter IS NULL OR source_type_filter = 'book')
            AND (1 - (kb.embedding <=> query_embedding)) >= similarity_threshold
        
        UNION ALL
        
        -- Search in web resources
        SELECT 
            'web_resource'::TEXT as source_type,
            wr.id,
            wr.title,
            wr.author,
            wr.category,
            wr.tags,
            wr.url as identifier,
            COALESCE(LEFT(wr.content, 300), LEFT(wr.description, 300)) as content_preview,
            (1 - (wr.embedding <=> query_embedding))::FLOAT as similarity_score
        FROM web_resources wr
        WHERE wr.embedding IS NOT NULL
            AND (source_type_filter IS NULL OR source_type_filter = 'web_resource')
            AND (1 - (wr.embedding <=> query_embedding)) >= similarity_threshold
    )
    SELECT * FROM combined_results
    ORDER BY similarity_score DESC
    LIMIT limit_results;
END;
$$;

-- ============================================================================
-- VIEW: embedding_statistics
-- Purpose: Provide quick overview of embedding generation progress
-- Shows statistics for books, web resources, and overall totals
-- ============================================================================
CREATE OR REPLACE VIEW embedding_statistics AS
SELECT 
    'Books' as source,
    COUNT(*) as total_items,
    COUNT(embedding) as items_with_embeddings,
    COUNT(*) - COUNT(embedding) as items_missing_embeddings,
    ROUND((COUNT(embedding)::FLOAT / NULLIF(COUNT(*), 0) * 100)::NUMERIC, 2) as completion_percentage
FROM knowledge_base

UNION ALL

SELECT 
    'Web Resources' as source,
    COUNT(*) as total_items,
    COUNT(embedding) as items_with_embeddings,
    COUNT(*) - COUNT(embedding) as items_missing_embeddings,
    ROUND((COUNT(embedding)::FLOAT / NULLIF(COUNT(*), 0) * 100)::NUMERIC, 2) as completion_percentage
FROM web_resources

UNION ALL

SELECT 
    'TOTAL' as source,
    (SELECT COUNT(*) FROM knowledge_base) + (SELECT COUNT(*) FROM web_resources) as total_items,
    (SELECT COUNT(embedding) FROM knowledge_base) + (SELECT COUNT(embedding) FROM web_resources) as items_with_embeddings,
    ((SELECT COUNT(*) FROM knowledge_base) + (SELECT COUNT(*) FROM web_resources)) - 
    ((SELECT COUNT(embedding) FROM knowledge_base) + (SELECT COUNT(embedding) FROM web_resources)) as items_missing_embeddings,
    ROUND((
        ((SELECT COUNT(embedding) FROM knowledge_base) + (SELECT COUNT(embedding) FROM web_resources))::FLOAT / 
        NULLIF(((SELECT COUNT(*) FROM knowledge_base) + (SELECT COUNT(*) FROM web_resources)), 0) * 100
    )::NUMERIC, 2) as completion_percentage;

-- Grant necessary permissions for authenticated and anonymous users
GRANT SELECT ON embedding_statistics TO authenticated, anon;
GRANT SELECT ON embedding_generation_logs TO authenticated, anon;
GRANT EXECUTE ON FUNCTION log_embedding_generation TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_items_needing_embeddings TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_knowledge_semantic TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_web_resources_semantic TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_brain_semantic TO authenticated, anon;

-- ============================================================================
-- Verification and Success Message
-- ============================================================================
DO $$
DECLARE
    v_books_count INTEGER;
    v_resources_count INTEGER;
    v_total_count INTEGER;
BEGIN
    -- Get counts of existing data
    SELECT COUNT(*) INTO v_books_count FROM knowledge_base;
    SELECT COUNT(*) INTO v_resources_count FROM web_resources;
    v_total_count := v_books_count + v_resources_count;
    
    -- Display success message with statistics
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'SUCCESS: Embeddings support has been successfully added!';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Database Statistics:';
    RAISE NOTICE '  Books in knowledge base: %', v_books_count;
    RAISE NOTICE '  Web resources: %', v_resources_count;
    RAISE NOTICE '  Total items ready for embedding: %', v_total_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Created Components:';
    RAISE NOTICE '  - pgvector extension enabled';
    RAISE NOTICE '  - embedding columns added to both tables';
    RAISE NOTICE '  - IVFFlat indexes created for fast similarity search';
    RAISE NOTICE '  - embedding_generation_logs table created';
    RAISE NOTICE '  - 4 search functions created';
    RAISE NOTICE '  - embedding_statistics view created';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '  1. Check current status: SELECT * FROM embedding_statistics;';
    RAISE NOTICE '  2. Generate embeddings: Visit /admin/embeddings';
    RAISE NOTICE '  3. Test semantic search: Visit /test-semantic-search';
    RAISE NOTICE '';
    RAISE NOTICE 'Available Functions:';
    RAISE NOTICE '  - search_brain_semantic(query_embedding, threshold, filter, limit)';
    RAISE NOTICE '  - search_knowledge_semantic(query_embedding, threshold, limit)';
    RAISE NOTICE '  - search_web_resources_semantic(query_embedding, threshold, limit)';
    RAISE NOTICE '  - get_items_needing_embeddings()';
    RAISE NOTICE '  - log_embedding_generation(type, id, status, error, time)';
    RAISE NOTICE '';
    RAISE NOTICE '============================================================================';
END $$;
