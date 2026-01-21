-- Script 024: Remove duplicate books keeping the most complete version
-- This will clean up the knowledge_base table

-- First, let's see the duplicates
SELECT title, COUNT(*) as count, 
       array_agg(id ORDER BY LENGTH(COALESCE(content, '')) DESC) as ids,
       array_agg(LENGTH(COALESCE(content, '')) ORDER BY LENGTH(COALESCE(content, '')) DESC) as content_lengths
FROM knowledge_base
GROUP BY title
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Delete duplicates keeping the one with most content
-- For each duplicate title, keep the row with the longest content
DELETE FROM knowledge_base a
USING knowledge_base b
WHERE a.title = b.title
  AND a.id < b.id
  AND LENGTH(COALESCE(a.content, '')) <= LENGTH(COALESCE(b.content, ''));

-- Also delete exact duplicates where newer has same or more content
DELETE FROM knowledge_base a
USING knowledge_base b
WHERE a.title = b.title
  AND a.id > b.id
  AND LENGTH(COALESCE(a.content, '')) < LENGTH(COALESCE(b.content, ''));

-- Final count after cleanup
SELECT 
  'After cleanup' as status,
  COUNT(*) as total_unique_books,
  COUNT(CASE WHEN LENGTH(COALESCE(content, '')) > 500 THEN 1 END) as complete_books
FROM knowledge_base;
