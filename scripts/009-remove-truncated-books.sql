-- PHASE 1: Identify books with incomplete/truncated content
-- Only keep books that have substantial content (>500 characters)
-- This ensures quality library content

-- First, see what truncated books we're removing
SELECT id, title, author, LENGTH(COALESCE(content, '')) as content_length
FROM knowledge_base
WHERE content IS NULL 
   OR LENGTH(COALESCE(content, '')) < 500
ORDER BY content_length ASC;

-- Delete the truncated/incomplete books from knowledge_base
DELETE FROM knowledge_base
WHERE content IS NULL 
   OR LENGTH(COALESCE(content, '')) < 500;

-- Verify deletion
SELECT COUNT(*) as remaining_complete_books
FROM knowledge_base;

-- Check biblioteca table separately (uses description, not content)
SELECT COUNT(*) as total_recursos
FROM biblioteca;
