-- Índice alfabético completo de todos los libros
SELECT 
    ROW_NUMBER() OVER (ORDER BY title) as "Nº",
    UPPER(LEFT(title, 1)) as "Letra",
    title as "📚 Título",
    author as "👤 Autor",
    category as "📁 Categoría",
    CEIL(LENGTH(content) / 200.0) as "📖 Págs",
    read_count as "⭐ Lecturas",
    CASE 
        WHEN LENGTH(content) > 15000 THEN '📚 Extenso'
        WHEN LENGTH(content) > 10000 THEN '📄 Medio'
        ELSE '📝 Corto'
    END as "📏 Tamaño",
    created_at::date as "📅 Creado"
FROM knowledge_base
ORDER BY title;

-- Índice por letras del alfabeto
SELECT 
    '🔤 ÍNDICE ALFABÉTICO POR LETRAS' as "Sección",
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
    CONCAT('📖 Letra ', UPPER(LEFT(title, 1)), ':') as "Sección",
    COUNT(*)::text || ' libros' as " ",
    '' as "  ",
    '' as "   ",
    '' as "    ",
    '' as "     ",
    '' as "      ",
    '' as "       ",
    '' as "        "
FROM knowledge_base
GROUP BY UPPER(LEFT(title, 1))
ORDER BY "Sección";
