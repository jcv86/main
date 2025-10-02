-- Analyze book content length and identify books needing expansion
-- Show which books have minimal content vs full reading experience

-- 1. Show summary statistics
SELECT 
    '📊 OVERALL STATISTICS' as section,
    COUNT(*) as total_books,
    ROUND(AVG(LENGTH(content))) as avg_content_length,
    MIN(LENGTH(content)) as shortest_book,
    MAX(LENGTH(content)) as longest_book,
    ROUND(AVG(LENGTH(content)) / 2000.0) as avg_pages_estimate
FROM knowledge_base;

-- 2. Content length distribution
SELECT 
    '📈 CONTENT LENGTH DISTRIBUTION' as section,
    CASE 
        WHEN LENGTH(content) < 5000 THEN '1. Very Short (< 5K chars)'
        WHEN LENGTH(content) < 10000 THEN '2. Short (5K-10K chars)'
        WHEN LENGTH(content) < 20000 THEN '3. Medium (10K-20K chars)'
        WHEN LENGTH(content) < 50000 THEN '4. Long (20K-50K chars)'
        WHEN LENGTH(content) < 100000 THEN '5. Very Long (50K-100K chars)'
        ELSE '6. Complete Book (100K+ chars)'
    END as content_category,
    COUNT(*) as book_count,
    ROUND(AVG(LENGTH(content))) as avg_length,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM knowledge_base), 2) as percentage
FROM knowledge_base
GROUP BY content_category
ORDER BY content_category;

-- 3. Books that need significant expansion (less than 20K characters)
SELECT 
    '🔴 BOOKS NEEDING MAJOR EXPANSION (< 20K)' as section,
    id,
    title,
    author,
    category,
    LENGTH(content) as current_length,
    ROUND(LENGTH(content) / 2000.0, 1) as current_pages_estimate,
    CASE 
        WHEN LENGTH(content) < 5000 THEN 'Critical - needs 4-5x more content'
        WHEN LENGTH(content) < 10000 THEN 'High Priority - needs 2-3x more'
        ELSE 'Medium Priority - needs 50-100% more'
    END as expansion_priority
FROM knowledge_base
WHERE LENGTH(content) < 20000
ORDER BY LENGTH(content) ASC;

-- 4. Books with good content (20K-50K characters)
SELECT 
    '🟡 BOOKS WITH GOOD CONTENT (20K-50K)' as section,
    id,
    title,
    author,
    LENGTH(content) as content_length,
    ROUND(LENGTH(content) / 2000.0, 1) as pages_estimate
FROM knowledge_base
WHERE LENGTH(content) >= 20000 AND LENGTH(content) < 50000
ORDER BY LENGTH(content) DESC;

-- 5. Books with excellent content (50K+ characters)
SELECT 
    '🟢 BOOKS WITH EXCELLENT CONTENT (50K+)' as section,
    id,
    title,
    author,
    LENGTH(content) as content_length,
    ROUND(LENGTH(content) / 2000.0, 1) as pages_estimate,
    CASE 
        WHEN LENGTH(content) >= 100000 THEN 'Complete Book Experience'
        WHEN LENGTH(content) >= 75000 THEN 'Near Complete'
        ELSE 'Good but could expand'
    END as quality_rating
FROM knowledge_base
WHERE LENGTH(content) >= 50000
ORDER BY LENGTH(content) DESC;

-- 6. Category breakdown by content quality
SELECT 
    '📚 CONTENT QUALITY BY CATEGORY' as section,
    category,
    COUNT(*) as total_books,
    ROUND(AVG(LENGTH(content))) as avg_content_length,
    ROUND(AVG(LENGTH(content)) / 2000.0, 1) as avg_pages,
    MIN(LENGTH(content)) as shortest,
    MAX(LENGTH(content)) as longest,
    SUM(CASE WHEN LENGTH(content) < 20000 THEN 1 ELSE 0 END) as needs_expansion,
    SUM(CASE WHEN LENGTH(content) >= 50000 THEN 1 ELSE 0 END) as excellent_content
FROM knowledge_base
GROUP BY category
ORDER BY avg_content_length DESC;

-- 7. Top 10 shortest books that need immediate attention
SELECT 
    '⚠️ TOP 10 SHORTEST BOOKS - IMMEDIATE ATTENTION' as section,
    id,
    title,
    author,
    category,
    LENGTH(content) as chars,
    ROUND(LENGTH(content) / 2000.0, 1) as pages,
    SUBSTRING(content, 1, 200) || '...' as content_preview
FROM knowledge_base
ORDER BY LENGTH(content) ASC
LIMIT 10;

-- 8. Recommended expansion targets
SELECT 
    '🎯 RECOMMENDED EXPANSION PLAN' as section,
    'PHASE 1: Expand ' || COUNT(*) || ' critical books (< 5K chars) to 20K+ chars' as action
FROM knowledge_base
WHERE LENGTH(content) < 5000
UNION ALL
SELECT 
    '🎯 RECOMMENDED EXPANSION PLAN',
    'PHASE 2: Expand ' || COUNT(*) || ' high priority books (5K-10K) to 30K+ chars'
FROM knowledge_base
WHERE LENGTH(content) >= 5000 AND LENGTH(content) < 10000
UNION ALL
SELECT 
    '🎯 RECOMMENDED EXPANSION PLAN',
    'PHASE 3: Expand ' || COUNT(*) || ' medium priority books (10K-20K) to 40K+ chars'
FROM knowledge_base
WHERE LENGTH(content) >= 10000 AND LENGTH(content) < 20000
UNION ALL
SELECT 
    '🎯 RECOMMENDED EXPANSION PLAN',
    'PHASE 4: Enhance ' || COUNT(*) || ' good books (20K-50K) to 60K+ chars'
FROM knowledge_base
WHERE LENGTH(content) >= 20000 AND LENGTH(content) < 50000;

-- 9. Final summary and recommendations
SELECT 
    '✅ SUMMARY AND NEXT STEPS' as section,
    'Total Books: ' || COUNT(*) as metric
FROM knowledge_base
UNION ALL
SELECT 
    '✅ SUMMARY AND NEXT STEPS',
    'Books Needing Expansion: ' || COUNT(*)
FROM knowledge_base
WHERE LENGTH(content) < 20000
UNION ALL
SELECT 
    '✅ SUMMARY AND NEXT STEPS',
    'Average Content Length: ' || ROUND(AVG(LENGTH(content))) || ' chars'
FROM knowledge_base
UNION ALL
SELECT 
    '✅ SUMMARY AND NEXT STEPS',
    'Target: All books should have 50,000+ characters (25+ pages)'
FROM knowledge_base
LIMIT 1;
