-- Dashboard Rápido del Estado de la Biblioteca
-- Vista rápida del estado general

-- PANEL 1: MÉTRICAS CLAVE
SELECT '╔════════════════════════════════════════════╗' as "╔═══════════════════════════════════╗";
SELECT '║   📊 MÉTRICAS CLAVE DE LA BIBLIOTECA      ║' as "║";
SELECT '╚════════════════════════════════════════════╝' as "╚═══════════════════════════════════╝";

SELECT 
    '📚 Total de Libros' as "Métrica",
    COUNT(*)::text as "Valor",
    '100%' as "% del Total"
FROM knowledge_base

UNION ALL

SELECT 
    '✅ Libros Completos (50K+)',
    COUNT(*)::text,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1)::text || '%'
FROM knowledge_base
WHERE LENGTH(content) >= 50000

UNION ALL

SELECT 
    '🟡 Libros Buenos (35-50K)',
    COUNT(*)::text,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1)::text || '%'
FROM knowledge_base
WHERE LENGTH(content) >= 35000 AND LENGTH(content) < 50000

UNION ALL

SELECT 
    '🟠 Libros Medios (20-35K)',
    COUNT(*)::text,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1)::text || '%'
FROM knowledge_base
WHERE LENGTH(content) >= 20000 AND LENGTH(content) < 35000

UNION ALL

SELECT 
    '🔴 Libros Cortos (<20K)',
    COUNT(*)::text,
    ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM knowledge_base)::numeric * 100), 1)::text || '%'
FROM knowledge_base
WHERE LENGTH(content) < 20000

UNION ALL

SELECT 
    '📖 Promedio Caracteres/Libro',
    ROUND(AVG(LENGTH(content))::numeric, 0)::text,
    '~' || ROUND(AVG(LENGTH(content))::numeric / 2500, 1)::text || ' páginas'
FROM knowledge_base

UNION ALL

SELECT 
    '📝 Contenido Total',
    ROUND(SUM(LENGTH(content))::numeric / 1000000, 2)::text || 'M',
    'caracteres'
FROM knowledge_base

UNION ALL

SELECT 
    '👀 Total de Lecturas',
    SUM(read_count)::text,
    'lecturas acumuladas'
FROM knowledge_base;

-- PANEL 2: TOP 5 POR CATEGORÍA
SELECT '';
SELECT '╔════════════════════════════════════════════╗';
SELECT '║   📚 TOP 5 CATEGORÍAS                     ║';
SELECT '╚════════════════════════════════════════════╝';

SELECT 
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as "#",
    category as "Categoría",
    COUNT(*) as "Libros",
    COUNT(*) FILTER (WHERE LENGTH(content) >= 50000) as "Completos",
    ROUND((COUNT(*) FILTER (WHERE LENGTH(content) >= 50000)::numeric / COUNT(*)::numeric * 100), 0)::text || '%' as "% Completo"
FROM knowledge_base
GROUP BY category
ORDER BY COUNT(*) DESC
LIMIT 5;

-- PANEL 3: PRÓXIMAS ACCIONES
SELECT '';
SELECT '╔════════════════════════════════════════════╗';
SELECT '║   🎯 PRÓXIMAS ACCIONES                    ║';
SELECT '╚════════════════════════════════════════════╝';

WITH needs_expansion AS (
    SELECT COUNT(*) as qty FROM knowledge_base WHERE LENGTH(content) < 50000
),
priority AS (
    SELECT COUNT(*) as qty FROM knowledge_base WHERE LENGTH(content) < 20000
)
SELECT 
    CASE 
        WHEN (SELECT qty FROM needs_expansion) = 0 THEN '🎉 ¡Biblioteca 100% completa!'
        WHEN (SELECT qty FROM priority) > 20 THEN '🔴 Acción urgente: ' || (SELECT qty FROM priority) || ' libros necesitan expansión prioritaria'
        WHEN (SELECT qty FROM needs_expansion) > 0 THEN '🟡 ' || (SELECT qty FROM needs_expansion) || ' libros necesitan expansión'
        ELSE '✅ Estado óptimo'
    END as "Estado General",
    
    CASE 
        WHEN (SELECT qty FROM needs_expansion) > 50 THEN 'Crear 5-6 scripts batch de expansión'
        WHEN (SELECT qty FROM needs_expansion) > 30 THEN 'Crear 3-4 scripts batch de expansión'
        WHEN (SELECT qty FROM needs_expansion) > 10 THEN 'Crear 2 scripts batch de expansión'
        WHEN (SELECT qty FROM needs_expansion) > 0 THEN 'Crear 1 script final de expansión'
        ELSE 'Biblioteca completa - ¡Celebrar! 🎉'
    END as "Plan de Acción";
