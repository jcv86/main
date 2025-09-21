-- Verify that the new books were added successfully

-- Check total count of books
SELECT COUNT(*) as total_books FROM knowledge_base;

-- Check the most recently added books
SELECT title, author, category, read_count 
FROM knowledge_base 
WHERE slug IN (
    'getting-things-done-stress-free',
    'emotional-intelligence-matters-more-iq',
    'seven-habits-highly-effective-people',
    'crucial-conversations-high-stakes',
    'mindset-new-psychology-success',
    'how-to-win-friends-influence-people',
    'power-of-habit-why-we-do',
    'deep-work-focused-success-distracted',
    'atomic-habits-easy-proven-way',
    'first-90-days-proven-strategies'
)
ORDER BY title;

-- Show books by category
SELECT category, COUNT(*) as book_count 
FROM knowledge_base 
GROUP BY category 
ORDER BY book_count DESC;

-- Show some sample content to verify data integrity
SELECT title, LEFT(content, 100) as content_preview
FROM knowledge_base 
WHERE slug = 'getting-things-done-stress-free';
