-- ============================================================
-- Script 356: Fix Knowledge Base Structure and Create Function
-- ============================================================

-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add source_type column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'knowledge_base' 
        AND column_name = 'source_type'
    ) THEN
        ALTER TABLE knowledge_base 
        ADD COLUMN source_type VARCHAR(50) DEFAULT 'book';
        RAISE NOTICE 'Added source_type column';
    ELSE
        RAISE NOTICE 'source_type column already exists';
    END IF;
END $$;

-- Add embedding column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'knowledge_base' 
        AND column_name = 'embedding'
    ) THEN
        ALTER TABLE knowledge_base 
        ADD COLUMN embedding vector(1536);
        RAISE NOTICE 'Added embedding column';
    ELSE
        RAISE NOTICE 'embedding column already exists';
    END IF;
END $$;

-- Update NULL source_type values
UPDATE knowledge_base 
SET source_type = 'book' 
WHERE source_type IS NULL;

-- Drop old function variants
DROP FUNCTION IF EXISTS match_knowledge_base(vector, float, int);
DROP FUNCTION IF EXISTS match_knowledge_base(vector(1536), float, int);

-- Create new match_knowledge_base function
CREATE OR REPLACE FUNCTION match_knowledge_base(
    query_embedding vector(1536),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id bigint,
    title text,
    author text,
    category text,
    content text,
    source_type text,
    similarity float
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
        kb.content,
        COALESCE(kb.source_type, 'book') as source_type,
        1 - (kb.embedding <=> query_embedding) as similarity
    FROM knowledge_base kb
    WHERE kb.embedding IS NOT NULL
        AND 1 - (kb.embedding <=> query_embedding) > match_threshold
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Create index for fast similarity search
DROP INDEX IF EXISTS knowledge_base_embedding_idx;
CREATE INDEX knowledge_base_embedding_idx 
ON knowledge_base 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- ============================================================
-- DIAGNOSTIC QUERIES
-- ============================================================

-- Section 1: Table Structure
SELECT 
    '1. TABLE STRUCTURE' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'knowledge_base'
ORDER BY ordinal_position;

-- Section 2: Total Records
SELECT 
    '2. TOTAL RECORDS' as section,
    COUNT(*) as total_records 
FROM knowledge_base;

-- Section 3: Source Type Distribution
SELECT 
    '3. SOURCE TYPE DISTRIBUTION' as section,
    COALESCE(source_type, 'NULL') as source_type,
    COUNT(*) as count
FROM knowledge_base
GROUP BY source_type
ORDER BY count DESC;

-- Section 4: Embedding Statistics
SELECT 
    '4. EMBEDDING STATISTICS' as section,
    COUNT(*) as total_records,
    COUNT(embedding) as records_with_embedding,
    COUNT(*) - COUNT(embedding) as records_without_embedding,
    ROUND(100.0 * COUNT(embedding) / NULLIF(COUNT(*), 0), 2) as percentage_complete
FROM knowledge_base;

-- Section 5: Books with Embeddings (sample)
SELECT 
    '5. SAMPLE BOOKS WITH EMBEDDINGS' as section,
    id,
    title,
    author,
    category,
    source_type,
    LENGTH(content) as content_length
FROM knowledge_base
WHERE embedding IS NOT NULL
ORDER BY id
LIMIT 10;

-- Section 6: Books WITHOUT Embeddings
SELECT 
    '6. BOOKS WITHOUT EMBEDDINGS' as section,
    id,
    title,
    author,
    category,
    source_type,
    LENGTH(content) as content_length
FROM knowledge_base
WHERE embedding IS NULL
ORDER BY LENGTH(content) DESC
LIMIT 20;

-- Section 7: Category Statistics
SELECT 
    '7. CATEGORY STATISTICS' as section,
    category,
    COUNT(*) as total_books,
    COUNT(embedding) as with_embedding,
    COUNT(*) - COUNT(embedding) as without_embedding
FROM knowledge_base
GROUP BY category
ORDER BY total_books DESC;

-- Section 8: Content Length Statistics
SELECT 
    '8. CONTENT LENGTH STATISTICS' as section,
    CASE 
        WHEN LENGTH(content) < 5000 THEN 'Very Short (<5k)'
        WHEN LENGTH(content) < 10000 THEN 'Short (5k-10k)'
        WHEN LENGTH(content) < 20000 THEN 'Good (10k-20k)'
        ELSE 'Excellent (20k+)'
    END as content_size,
    COUNT(*) as count
FROM knowledge_base
GROUP BY 
    CASE 
        WHEN LENGTH(content) < 5000 THEN 'Very Short (<5k)'
        WHEN LENGTH(content) < 10000 THEN 'Short (5k-10k)'
        WHEN LENGTH(content) < 20000 THEN 'Good (10k-20k)'
        ELSE 'Excellent (20k+)'
    END
ORDER BY count DESC;

-- Section 9: Next Steps Recommendation
SELECT 
    '9. NEXT STEPS' as section,
    CASE 
        WHEN COUNT(embedding) = 0 THEN 
            'ACTION REQUIRED: Generate embeddings at /admin/embeddings'
        WHEN COUNT(embedding) < COUNT(*) * 0.5 THEN 
            'Only ' || ROUND(100.0 * COUNT(embedding) / COUNT(*), 0) || '% has embeddings. Continue generating.'
        WHEN COUNT(embedding) < COUNT(*) THEN 
            ROUND(100.0 * COUNT(embedding) / COUNT(*), 0) || '% complete. Almost ready!'
        ELSE 
            'COMPLETE: All records have embeddings. Ready to use!'
    END as status,
    COUNT(*) as total_records,
    COUNT(embedding) as with_embeddings,
    COUNT(*) - COUNT(embedding) as missing_embeddings
FROM knowledge_base;
