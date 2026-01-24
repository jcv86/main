SELECT 
  id,
  title,
  author,
  LENGTH(content) as content_length,
  CASE 
    WHEN LENGTH(content) < 500 THEN 'EMPTY'
    WHEN LENGTH(content) < 5000 THEN 'SHORT'
    WHEN LENGTH(content) < 8000 THEN 'MEDIUM'
    ELSE 'COMPLETE'
  END as status
FROM knowledge_base
WHERE source_type = 'libro_original'
ORDER BY id;
