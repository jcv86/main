-- Script 023: Audit to find all incomplete books in knowledge_base
-- This will identify exactly which books need content enrichment

-- 1. List all books with content length < 500 characters (incomplete)
SELECT 
  id,
  title,
  author,
  category,
  LENGTH(content) as content_length,
  CASE 
    WHEN LENGTH(content) < 100 THEN 'VERY_SHORT'
    WHEN LENGTH(content) < 300 THEN 'SHORT'
    WHEN LENGTH(content) < 500 THEN 'NEEDS_MORE'
    ELSE 'COMPLETE'
  END as status
FROM knowledge_base
WHERE LENGTH(content) < 500 OR content IS NULL
ORDER BY content_length ASC;

-- 2. Summary statistics
SELECT 
  COUNT(*) as total_books,
  COUNT(CASE WHEN LENGTH(content) >= 500 THEN 1 END) as complete_books,
  COUNT(CASE WHEN LENGTH(content) < 500 OR content IS NULL THEN 1 END) as incomplete_books,
  ROUND(COUNT(CASE WHEN LENGTH(content) >= 500 THEN 1 END)::numeric / COUNT(*)::numeric * 100, 1) as completion_percentage
FROM knowledge_base;

-- 3. List all book titles to verify which ones exist
SELECT id, title, author, LENGTH(content) as content_length
FROM knowledge_base
ORDER BY title;
