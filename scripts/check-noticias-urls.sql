-- Check noticias in database
SELECT 
  COUNT(*) as total_articles,
  COUNT(CASE WHEN url IS NULL THEN 1 END) as articles_without_url,
  COUNT(CASE WHEN url IS NOT NULL THEN 1 END) as articles_with_url
FROM public.a4_noticias;

-- Show articles without URLs
SELECT id, title, url FROM public.a4_noticias WHERE url IS NULL LIMIT 10;

-- Show sample of articles with URLs
SELECT id, title, url FROM public.a4_noticias WHERE url IS NOT NULL LIMIT 5;
