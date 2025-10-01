-- Add embeddings support for semantic search
-- This enables vector similarity search using pgvector extension

BEGIN;

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to knowledge_base table
ALTER TABLE knowledge_base 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Add embedding column to web_resources table
ALTER TABLE web_resources 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create indexes for vector similarity search
CREATE INDEX IF NOT EXISTS knowledge_base_embedding_idx 
ON knowledge_base USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS web_resources_embedding_idx 
ON web_resources USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create function for semantic search in knowledge base
CREATE OR REPLACE FUNCTION search_knowledge_semantic(
    query_embedding vector(1536),
    similarity_threshold float DEFAULT 0.7,
    limit_results integer DEFAULT 10
)
RETURNS TABLE (
    id integer,
    title varchar,
    category varchar,
    content text,
    author varchar,
    tags text[],
    slug varchar,
    read_count integer,
    similarity_score float,
    created_at timestamp,
    updated_at timestamp
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
        1 - (kb.embedding <=> query_embedding) as similarity_score,
        kb.created_at,
        kb.updated_at
    FROM knowledge_base kb
    WHERE kb.embedding IS NOT NULL
        AND 1 - (kb.embedding <=> query_embedding) >= similarity_threshold
    ORDER BY kb.embedding <=> query_embedding
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- Create function for semantic search in web resources
CREATE OR REPLACE FUNCTION search_web_resources_semantic(
    query_embedding vector(1536),
    similarity_threshold float DEFAULT 0.7,
    limit_results integer DEFAULT 10
)
RETURNS TABLE (
    id integer,
    url varchar,
    title varchar,
    description text,
    content text,
    category varchar,
    source_type varchar,
    country varchar,
    tags text[],
    author varchar,
    published_date varchar,
    similarity_score float,
    created_at timestamp,
    updated_at timestamp
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wr.id,
        wr.url,
        wr.title,
        wr.description,
        wr.content,
        wr.category,
        wr.source_type,
        wr.country,
        wr.tags,
        wr.author,
        wr.published_date,
        1 - (wr.embedding <=> query_embedding) as similarity_score,
        wr.created_at,
        wr.updated_at
    FROM web_resources wr
    WHERE wr.embedding IS NOT NULL
        AND 1 - (wr.embedding <=> query_embedding) >= similarity_threshold
    ORDER BY wr.embedding <=> query_embedding
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- Create unified semantic search across both tables
CREATE OR REPLACE FUNCTION search_brain_semantic(
    query_embedding vector(1536),
    similarity_threshold float DEFAULT 0.7,
    source_type_filter varchar DEFAULT NULL,
    limit_results integer DEFAULT 10
)
RETURNS TABLE (
    source_type varchar,
    id integer,
    title varchar,
    category varchar,
    author varchar,
    tags text[],
    identifier varchar,
    content_preview text,
    similarity_score float
) AS $$
BEGIN
    IF source_type_filter = 'book' OR source_type_filter IS NULL THEN
        RETURN QUERY
        SELECT 
            'book'::varchar as source_type,
            kb.id,
            kb.title,
            kb.category,
            kb.author,
            kb.tags,
            kb.slug as identifier,
            LEFT(kb.content, 500) as content_preview,
            1 - (kb.embedding <=> query_embedding) as similarity_score
        FROM knowledge_base kb
        WHERE kb.embedding IS NOT NULL
            AND 1 - (kb.embedding <=> query_embedding) >= similarity_threshold
        ORDER BY kb.embedding <=> query_embedding
        LIMIT CASE WHEN source_type_filter IS NULL THEN limit_results / 2 ELSE limit_results END;
    END IF;

    IF source_type_filter = 'web_resource' OR source_type_filter IS NULL THEN
        RETURN QUERY
        SELECT 
            'web_resource'::varchar as source_type,
            wr.id,
            wr.title,
            wr.category,
            COALESCE(wr.author, 'Web Resource') as author,
            wr.tags,
            wr.url as identifier,
            LEFT(COALESCE(wr.description, wr.content), 500) as content_preview,
            1 - (wr.embedding <=> query_embedding) as similarity_score
        FROM web_resources wr
        WHERE wr.embedding IS NOT NULL
            AND 1 - (wr.embedding <=> query_embedding) >= similarity_threshold
        ORDER BY wr.embedding <=> query_embedding
        LIMIT CASE WHEN source_type_filter IS NULL THEN limit_results / 2 ELSE limit_results END;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to get items that need embeddings
CREATE OR REPLACE FUNCTION get_items_needing_embeddings()
RETURNS TABLE (
    source_type varchar,
    id integer,
    title varchar,
    content_to_embed text
) AS $$
BEGIN
    -- Get books without embeddings
    RETURN QUERY
    SELECT 
        'book'::varchar as source_type,
        kb.id,
        kb.title,
        kb.title || ' ' || kb.author || ' ' || kb.content as content_to_embed
    FROM knowledge_base kb
    WHERE kb.embedding IS NULL
    LIMIT 50;

    -- Get web resources without embeddings
    RETURN QUERY
    SELECT 
        'web_resource'::varchar as source_type,
        wr.id,
        wr.title,
        wr.title || ' ' || COALESCE(wr.author, '') || ' ' || COALESCE(wr.description, '') || ' ' || wr.content as content_to_embed
    FROM web_resources wr
    WHERE wr.embedding IS NULL
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- Create table to track embedding generation status
CREATE TABLE IF NOT EXISTS embedding_generation_log (
    id SERIAL PRIMARY KEY,
    source_type varchar(50) NOT NULL,
    source_id integer NOT NULL,
    status varchar(50) DEFAULT 'pending',
    error_message text,
    processing_time_ms integer,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp
);

CREATE INDEX IF NOT EXISTS idx_embedding_log_status 
ON embedding_generation_log(status, source_type);

-- Create function to log embedding generation
CREATE OR REPLACE FUNCTION log_embedding_generation(
    p_source_type varchar,
    p_source_id integer,
    p_status varchar,
    p_error_message text DEFAULT NULL,
    p_processing_time_ms integer DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO embedding_generation_log (
        source_type,
        source_id,
        status,
        error_message,
        processing_time_ms,
        completed_at
    ) VALUES (
        p_source_type,
        p_source_id,
        p_status,
        p_error_message,
        p_processing_time_ms,
        CASE WHEN p_status = 'completed' THEN CURRENT_TIMESTAMP ELSE NULL END
    );
END;
$$ LANGUAGE plpgsql;

-- Create view for embedding statistics
CREATE OR REPLACE VIEW embedding_statistics AS
SELECT 
    'Books' as source,
    COUNT(*) as total_items,
    COUNT(embedding) as items_with_embeddings,
    COUNT(*) - COUNT(embedding) as items_missing_embeddings,
    ROUND(100.0 * COUNT(embedding) / NULLIF(COUNT(*), 0), 2) as completion_percentage
FROM knowledge_base
UNION ALL
SELECT 
    'Web Resources' as source,
    COUNT(*) as total_items,
    COUNT(embedding) as items_with_embeddings,
    COUNT(*) - COUNT(embedding) as items_missing_embeddings,
    ROUND(100.0 * COUNT(embedding) / NULLIF(COUNT(*), 0), 2) as completion_percentage
FROM web_resources;

COMMIT;

-- Display initial statistics
SELECT * FROM embedding_statistics;
