-- Listado simple numerado de todos los libros
SELECT 
    ROW_NUMBER() OVER (ORDER BY read_count DESC, title) as "#",
    title as "📖 Título",
    author as "✍️ Autor",
    category as "📂 Categoría",
    CEIL(LENGTH(content) / 200.0) as "📄 Páginas",
    CEIL(LENGTH(content) / 1000.0) as "⏱️ Min Lectura",
    read_count as "⭐ Lecturas",
    LENGTH(content) as "📝 Caracteres",
    CASE 
        WHEN read_count > 5000 THEN '🔥 Muy Popular'
        WHEN read_count > 3000 THEN '📈 Popular'
        WHEN read_count > 1000 THEN '👍 Bueno'
        ELSE '🆕 Nuevo'
    END as "🏆 Estado"
FROM knowledge_base
ORDER BY read_count DESC, title;

-- Resumen estadístico
SELECT 
    '📊 ESTADÍSTICAS GENERALES' as "Resumen",
    '' as " ",
    '' as "  ",
    '' as "   ",
    '' as "    ",
    '' as "     ",
    '' as "      ",
    '' as "       ",
    '' as "        "
UNION ALL
SELECT 
    'Total de libros:' as "Resumen",
    COUNT(*)::text as " ",
    '' as "  ",
    '' as "   ",
    '' as "    ",
    '' as "     ",
    '' as "      ",
    '' as "       ",
    '' as "        "
FROM knowledge_base
UNION ALL
SELECT 
    'Categorías únicas:' as "Resumen",
    COUNT(DISTINCT category)::text as " ",
    '' as "  ",
    '' as "   ",
    '' as "    ",
    '' as "     ",
    '' as "      ",
    '' as "       ",
    '' as "        "
FROM knowledge_base
UNION ALL
SELECT 
    'Autores únicos:' as "Resumen",
    COUNT(DISTINCT author)::text as " ",
    '' as "  ",
    '' as "   ",
    '' as "    ",
    '' as "     ",
    '' as "      ",
    '' as "       ",
    '' as "        "
FROM knowledge_base
UNION ALL
SELECT 
    'Total lecturas:' as "Resumen",
    SUM(read_count)::text as " ",
    '' as "  ",
    '' as "   ",
    '' as "    ",
    '' as "     ",
    '' as "      ",
    '' as "       ",
    '' as "        "
FROM knowledge_base
UNION ALL
SELECT 
    'Promedio páginas:' as "Resumen",
    ROUND(AVG(CEIL(LENGTH(content) / 200.0)))::text as " ",
    '' as "  ",
    '' as "   ",
    '' as "    ",
    '' as "     ",
    '' as "      ",
    '' as "       ",
    '' as "        "
FROM knowledge_base;
