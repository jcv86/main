-- Conteo rápido de progreso
SELECT 
    '📊 RESUMEN RÁPIDO' as tipo,
    COUNT(*) as total_libros,
    COUNT(CASE WHEN LENGTH(content) >= 50000 THEN 1 END) as completos_50k_plus,
    COUNT(CASE WHEN LENGTH(content) BETWEEN 35000 AND 49999 THEN 1 END) as muy_buenos_35_50k,
    COUNT(CASE WHEN LENGTH(content) BETWEEN 20000 AND 34999 THEN 1 END) as buenos_20_35k,
    COUNT(CASE WHEN LENGTH(content) < 20000 THEN 1 END) as necesitan_expansion
FROM knowledge_base;

-- Títulos específicos que faltan por expandir (menos de 50k)
SELECT 
    '⏳ FALTAN POR EXPANDIR' as estado,
    title,
    LENGTH(content) as caracteres_actuales
FROM knowledge_base
WHERE LENGTH(content) < 50000
ORDER BY LENGTH(content) ASC
LIMIT 30;
