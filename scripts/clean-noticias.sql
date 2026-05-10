-- Delete all articles with fallback despega.cl URL and reset the table
DELETE FROM public.a4_noticias WHERE url = 'https://despega.cl' OR url IS NULL;

-- Verify deletion
SELECT COUNT(*) as remaining_articles FROM public.a4_noticias;
