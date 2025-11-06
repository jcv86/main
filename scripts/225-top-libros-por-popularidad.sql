-- Top 20 libros más populares con rankings detallados
WITH ranked_books AS (
    SELECT 
        title,
        author,
        category,
        read_count,
        CEIL(LENGTH(content) / 200.0) as paginas,
        CEIL(LENGTH(content) / 1000.0) as tiempo_lectura,
        LENGTH(content) as caracteres,
        ROW_NUMBER() OVER (ORDER BY read_count DESC) as ranking_global,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY read_count DESC) as ranking_categoria,
        CASE 
            WHEN read_count >= 6000 THEN '🥇 Oro'
            WHEN read_count >= 4000 THEN '🥈 Plata'
            WHEN read_count >= 2000 THEN '🥉 Bronce'
            ELSE '🏅 Destacado'
        END as medalla
    FROM knowledge_base
)
SELECT 
    CASE 
        WHEN ranking_global = 1 THEN '👑'
        WHEN ranking_global <= 3 THEN '🏆'
        WHEN ranking_global <= 10 THEN '🌟'
        ELSE '⭐'
    END as "🏅",
    ranking_global as "#️⃣",
    title as "📚 Título",
    author as "✍️ Autor",
    category as "📂 Categoría",
    read_count as "👥 Lecturas",
    paginas as "📄 Págs",
    tiempo_lectura as "⏱️ Min",
    medalla as "🏆 Nivel",
    CONCAT('#', ranking_categoria, ' en ', category) as "🎯 Ranking Categoría"
FROM ranked_books
WHERE ranking_global <= 20
ORDER BY ranking_global;

-- Estadísticas de popularidad
SELECT 
    '📊 ANÁLISIS DE POPULARIDAD' as "Análisis",
    '' as " ",
    '' as "  ",
    '' as "   ",
    '' as "    ",
    '' as "     ",
    '' as "      ",
    '' as "       ",
    '' as "        ",
    '' as "         "
UNION ALL
SELECT 
    'Libro más popular:' as "Análisis",
    (SELECT title FROM knowledge_base ORDER BY read_count DESC LIMIT 1) as " ",
    '' as "  ",
    '' as "   ",
    '' as "    ",
    '' as "     ",
    '' as "      ",
    '' as "       ",
    '' as "        ",
    '' as "         "
UNION ALL
SELECT 
    'Lecturas máximas:' as "Análisis",
    (SELECT MAX(read_count)::text FROM knowledge_base) as " ",
    '' as "  ",
    '' as "   ",
    '' as "    ",
    '' as "     ",
    '' as "      ",
    '' as "       ",
    '' as "        ",
    '' as "         "
UNION ALL
SELECT 
    'Promedio lecturas:' as "Análisis",
    ROUND(AVG(read_count))::text as " ",
    '' as "  ",
    '' as "   ",
    '' as "    ",
    '' as "     ",
    '' as "      ",
    '' as "       ",
    '' as "        ",
    '' as "         "
FROM knowledge_base
UNION ALL
SELECT 
    'Categoría más popular:' as "Análisis",
    (SELECT category FROM knowledge_base GROUP BY category ORDER BY SUM(read_count) DESC LIMIT 1) as " ",
    '' as "  ",
    '' as "   ",
    '' as "    ",
    '' as "     ",
    '' as "      ",
    '' as "       ",
    '' as "        ",
    '' as "         ";
