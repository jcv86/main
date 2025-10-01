-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to knowledge_base table
ALTER TABLE knowledge_base 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Add embedding column to web_resources table
ALTER TABLE web_resources 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create index for faster vector similarity search on knowledge_base
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

-- Create index on embedding logs
CREATE INDEX IF NOT EXISTS embedding_logs_source_idx 
ON embedding_generation_logs(source_type, source_id);

CREATE INDEX IF NOT EXISTS embedding_logs_created_idx 
ON embedding_generation_logs(created_at DESC);

-- Function to log embedding generation
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

-- Function to get items that need embeddings
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

-- Function for semantic search in knowledge_base
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

-- Function for semantic search in web_resources
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

-- Function for unified semantic search across both tables
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
        -- Search in books
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

-- Create view for embedding statistics
CREATE OR REPLACE VIEW embedding_statistics AS
SELECT 
    'Books' as source,
    COUNT(*) as total_items,
    COUNT(embedding) as items_with_embeddings,
    COUNT(*) - COUNT(embedding) as items_missing_embeddings,
    ROUND((COUNT(embedding)::FLOAT / COUNT(*) * 100)::NUMERIC, 2) as completion_percentage
FROM knowledge_base

UNION ALL

SELECT 
    'Web Resources' as source,
    COUNT(*) as total_items,
    COUNT(embedding) as items_with_embeddings,
    COUNT(*) - COUNT(embedding) as items_missing_embeddings,
    ROUND((COUNT(embedding)::FLOAT / COUNT(*) * 100)::NUMERIC, 2) as completion_percentage
FROM web_resources;

-- Grant permissions
GRANT SELECT ON embedding_statistics TO authenticated, anon;
GRANT EXECUTE ON FUNCTION log_embedding_generation TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_items_needing_embeddings TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_knowledge_semantic TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_web_resources_semantic TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_brain_semantic TO authenticated, anon;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Embeddings support has been successfully added!';
    RAISE NOTICE '📊 Run: SELECT * FROM embedding_statistics; to check current status';
    RAISE NOTICE '🔍 Use search_brain_semantic() function to perform semantic searches';
END $$;
