-- Simple verification script to check the current state of the knowledge base

-- Check if the knowledge_base table exists and has data
SELECT 
    COUNT(*) as total_books,
    COUNT(DISTINCT category) as categories,
    COUNT(DISTINCT author) as authors,
    AVG(read_count) as avg_reads
FROM knowledge_base;

-- Show all categories and their book counts
SELECT 
    category,
    COUNT(*) as book_count
FROM knowledge_base 
GROUP BY category 
ORDER BY book_count DESC;

-- Show the most recent 10 books (by title alphabetically)
SELECT 
    title,
    author,
    category,
    read_count
FROM knowledge_base 
ORDER BY title 
LIMIT 10;

-- Check for any books with our new slugs
SELECT 
    title,
    slug,
    category
FROM knowledge_base 
WHERE slug LIKE '%productivity%' 
   OR slug LIKE '%emotional%' 
   OR slug LIKE '%habits%'
   OR slug LIKE '%friends%'
ORDER BY title;
