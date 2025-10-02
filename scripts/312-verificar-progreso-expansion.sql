-- Verificar cuántos libros hemos expandido con contenido completo (50k+)
SELECT 
    '📊 PROGRESO DE EXPANSIÓN' as reporte,
    COUNT(*) as total_libros,
    COUNT(CASE WHEN LENGTH(content) >= 50000 THEN 1 END) as expandidos_completos,
    COUNT(CASE WHEN LENGTH(content) < 50000 THEN 1 END) as por_expandir,
    ROUND(COUNT(CASE WHEN LENGTH(content) >= 50000 THEN 1 END)::numeric / COUNT(*)::numeric * 100, 1) as porcentaje_completo
FROM knowledge_base;

-- Lista de libros ya expandidos (50k+)
SELECT 
    '✅ LIBROS EXPANDIDOS (50k+)' as estado,
    title,
    author,
    LENGTH(content) as caracteres,
    ROUND(LENGTH(content) / 200.0, 1) as minutos_lectura
FROM knowledge_base
WHERE LENGTH(content) >= 50000
ORDER BY LENGTH(content) DESC;

-- Lista de libros que faltan por expandir
SELECT 
    '⏳ LIBROS POR EXPANDIR' as estado,
    title,
    author,
    category,
    LENGTH(content) as caracteres_actuales,
    50000 - LENGTH(content) as caracteres_faltantes
FROM knowledge_base
WHERE LENGTH(content) < 50000
ORDER BY LENGTH(content) ASC;
