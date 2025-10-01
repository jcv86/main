-- Comprehensive analysis of Chilean web resources in the database
-- This script provides detailed statistics about all Chilean resources

-- 1. Total count of Chilean resources
SELECT 
    COUNT(*) as total_chilean_resources,
    COUNT(CASE WHEN country = 'Chile' THEN 1 END) as explicit_chile_count,
    COUNT(CASE WHEN content LIKE '%Chile%' OR content LIKE '%chileno%' THEN 1 END) as content_chile_count
FROM web_resources;

-- 2. Breakdown by category
SELECT 
    category,
    COUNT(*) as resource_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%'
GROUP BY category
ORDER BY resource_count DESC;

-- 3. Source type distribution
SELECT 
    source_type,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%'
GROUP BY source_type
ORDER BY count DESC;

-- 4. Recently added resources (last 10)
SELECT 
    id,
    title,
    category,
    source_type,
    TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
    access_count
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%'
ORDER BY created_at DESC
LIMIT 10;

-- 5. Check for duplicate URLs
SELECT 
    url,
    COUNT(*) as duplicate_count,
    STRING_AGG(title, ' | ') as titles
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%'
GROUP BY url
HAVING COUNT(*) > 1;

-- 6. Access statistics
SELECT 
    COUNT(*) as total_resources,
    SUM(access_count) as total_accesses,
    ROUND(AVG(access_count), 2) as avg_accesses,
    MAX(access_count) as max_accesses,
    MIN(access_count) as min_accesses
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%';

-- 7. Most popular resources (top 10)
SELECT 
    title,
    category,
    access_count,
    url
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%'
ORDER BY access_count DESC
LIMIT 10;

-- 8. Tag distribution (top 20 tags)
SELECT 
    tag,
    COUNT(*) as usage_count
FROM web_resources,
    UNNEST(tags) as tag
WHERE country = 'Chile' OR content LIKE '%Chile%'
GROUP BY tag
ORDER BY usage_count DESC
LIMIT 20;

-- 9. Content completeness check
SELECT 
    COUNT(*) as total_resources,
    COUNT(CASE WHEN content IS NOT NULL AND LENGTH(content) > 100 THEN 1 END) as has_full_content,
    COUNT(CASE WHEN content IS NULL OR LENGTH(content) <= 100 THEN 1 END) as needs_content,
    COUNT(CASE WHEN description IS NOT NULL THEN 1 END) as has_description,
    ROUND(COUNT(CASE WHEN content IS NOT NULL AND LENGTH(content) > 100 THEN 1 END) * 100.0 / COUNT(*), 2) as completion_percentage
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%';

-- 10. Resources by ID range (to see distribution)
SELECT 
    CASE 
        WHEN id BETWEEN 1 AND 20 THEN '1-20 (Initial batch)'
        WHEN id BETWEEN 21 AND 50 THEN '21-50 (First expansion)'
        WHEN id BETWEEN 51 AND 79 THEN '51-79 (Second expansion)'
        WHEN id >= 80 THEN '80+ (Future additions)'
    END as id_range,
    COUNT(*) as resource_count,
    MIN(id) as first_id,
    MAX(id) as last_id
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%'
GROUP BY 
    CASE 
        WHEN id BETWEEN 1 AND 20 THEN '1-20 (Initial batch)'
        WHEN id BETWEEN 21 AND 50 THEN '21-50 (First expansion)'
        WHEN id BETWEEN 51 AND 79 THEN '51-79 (Second expansion)'
        WHEN id >= 80 THEN '80+ (Future additions)'
    END
ORDER BY MIN(id);

-- 11. Export summary for verification
SELECT 
    'Chilean Web Resources Summary' as report_title,
    COUNT(*) as total_count,
    TO_CHAR(MIN(created_at), 'YYYY-MM-DD') as earliest_added,
    TO_CHAR(MAX(created_at), 'YYYY-MM-DD') as latest_added,
    COUNT(DISTINCT category) as unique_categories,
    COUNT(DISTINCT source_type) as unique_source_types,
    SUM(access_count) as total_accesses
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%';

-- 12. List all Chilean resources with key details
SELECT 
    id,
    title,
    category,
    source_type,
    url,
    LENGTH(content) as content_length,
    access_count,
    ARRAY_LENGTH(tags, 1) as tag_count
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%'
ORDER BY id;

-- 13. Gap analysis - find missing IDs in sequence
SELECT 
    id + 1 as missing_id_start,
    LEAD(id) OVER (ORDER BY id) - 1 as missing_id_end,
    LEAD(id) OVER (ORDER BY id) - id - 1 as gap_size
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%'
HAVING LEAD(id) OVER (ORDER BY id) - id > 1
ORDER BY id;

-- 14. Resources by quality score (based on completeness)
SELECT 
    id,
    title,
    category,
    CASE 
        WHEN LENGTH(content) > 1000 AND description IS NOT NULL AND ARRAY_LENGTH(tags, 1) >= 3 THEN 'High'
        WHEN LENGTH(content) > 500 AND description IS NOT NULL THEN 'Medium'
        ELSE 'Needs Enhancement'
    END as quality_score,
    LENGTH(content) as content_length,
    ARRAY_LENGTH(tags, 1) as tag_count
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%'
ORDER BY 
    CASE 
        WHEN LENGTH(content) > 1000 AND description IS NOT NULL AND ARRAY_LENGTH(tags, 1) >= 3 THEN 1
        WHEN LENGTH(content) > 500 AND description IS NOT NULL THEN 2
        ELSE 3
    END,
    id;

-- 15. Final summary with recommendations
SELECT 
    'FINAL REPORT' as section,
    COUNT(*) as total_chilean_resources,
    COUNT(CASE WHEN LENGTH(content) > 1000 THEN 1 END) as high_quality_content,
    COUNT(CASE WHEN LENGTH(content) BETWEEN 500 AND 1000 THEN 1 END) as medium_quality_content,
    COUNT(CASE WHEN LENGTH(content) < 500 THEN 1 END) as needs_enhancement,
    ROUND(COUNT(CASE WHEN LENGTH(content) > 1000 THEN 1 END) * 100.0 / COUNT(*), 2) as high_quality_percentage,
    CASE 
        WHEN COUNT(*) >= 79 THEN 'Target achieved or exceeded'
        ELSE 'Need ' || (79 - COUNT(*))::text || ' more resources'
    END as status
FROM web_resources
WHERE country = 'Chile' OR content LIKE '%Chile%';
