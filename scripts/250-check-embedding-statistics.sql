SELECT 
    source,
    total_items,
    items_with_embeddings,
    items_missing_embeddings,
    completion_percentage::text || ' percent' as completion
FROM embedding_statistics
ORDER BY 
    CASE 
        WHEN source = 'TOTAL' THEN 3
        WHEN source = 'Books' THEN 1
        ELSE 2
    END;

DO $$
DECLARE
    v_books_total INTEGER;
    v_books_with_embeddings INTEGER;
    v_resources_total INTEGER;
    v_resources_with_embeddings INTEGER;
    v_total INTEGER;
    v_total_with_embeddings INTEGER;
    v_completion_pct NUMERIC;
    v_books_pct NUMERIC;
    v_resources_pct NUMERIC;
BEGIN
    SELECT COUNT(*), COUNT(embedding) 
    INTO v_books_total, v_books_with_embeddings
    FROM knowledge_base;
    
    SELECT COUNT(*), COUNT(embedding)
    INTO v_resources_total, v_resources_with_embeddings
    FROM web_resources;
    
    v_total := v_books_total + v_resources_total;
    v_total_with_embeddings := v_books_with_embeddings + v_resources_with_embeddings;
    
    IF v_total > 0 THEN
        v_completion_pct := ROUND((v_total_with_embeddings::NUMERIC / v_total * 100), 2);
    ELSE
        v_completion_pct := 0;
    END IF;
    
    IF v_books_total > 0 THEN
        v_books_pct := ROUND((v_books_with_embeddings::NUMERIC / v_books_total * 100), 2);
    ELSE
        v_books_pct := 0;
    END IF;
    
    IF v_resources_total > 0 THEN
        v_resources_pct := ROUND((v_resources_with_embeddings::NUMERIC / v_resources_total * 100), 2);
    ELSE
        v_resources_pct := 0;
    END IF;
    
    RAISE NOTICE 'BOOKS Total: % | With embeddings: % | Missing: % | Progress: % percent', 
        v_books_total, v_books_with_embeddings, v_books_total - v_books_with_embeddings, v_books_pct;
    
    RAISE NOTICE 'WEB RESOURCES Total: % | With embeddings: % | Missing: % | Progress: % percent', 
        v_resources_total, v_resources_with_embeddings, v_resources_total - v_resources_with_embeddings, v_resources_pct;
    
    RAISE NOTICE 'OVERALL Total items: % | With embeddings: % | Missing: % | Completion: % percent', 
        v_total, v_total_with_embeddings, v_total - v_total_with_embeddings, v_completion_pct;
    
    IF v_completion_pct = 100 THEN
        RAISE NOTICE 'SUCCESS: All embeddings generated! Visit /test-semantic-search';
    ELSIF v_completion_pct > 0 THEN
        RAISE NOTICE 'PARTIAL: % percent complete. Visit /admin/embeddings to continue', v_completion_pct;
    ELSE
        RAISE NOTICE 'NOT STARTED: Visit /admin/embeddings to generate embeddings';
    END IF;
END $$;

SELECT COUNT(*) as log_entries FROM embedding_generation_logs;

SELECT 
    source_type,
    id,
    title
FROM get_items_needing_embeddings()
LIMIT 20;
