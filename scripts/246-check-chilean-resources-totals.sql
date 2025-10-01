-- Verificar el total de recursos chilenos y su estado actual
-- Este script proporciona un resumen completo de los recursos web chilenos

-- 1. Contar total de recursos chilenos
SELECT 
    'Total Recursos Chilenos' as metric,
    COUNT(*) as count
FROM web_resources
WHERE country = 'Chile';

-- 2. Recursos por categoría
SELECT 
    category,
    COUNT(*) as count,
    ARRAY_AGG(DISTINCT source_type) as source_types
FROM web_resources
WHERE country = 'Chile'
GROUP BY category
ORDER BY count DESC;

-- 3. Recursos por tipo de fuente
SELECT 
    source_type,
    COUNT(*) as count
FROM web_resources
WHERE country = 'Chile'
GROUP BY source_type
ORDER BY count DESC;

-- 4. Últimos 10 recursos agregados
SELECT 
    id,
    title,
    category,
    source_type,
    created_at
FROM web_resources
WHERE country = 'Chile'
ORDER BY created_at DESC
LIMIT 10;

-- 5. Verificar si hay URLs duplicadas
SELECT 
    url,
    COUNT(*) as count
FROM web_resources
WHERE country = 'Chile'
GROUP BY url
HAVING COUNT(*) > 1;

-- 6. Resumen de accesos
SELECT 
    'Total Accesos' as metric,
    SUM(access_count) as total,
    AVG(access_count) as promedio,
    MAX(access_count) as maximo
FROM web_resources
WHERE country = 'Chile';

-- 7. Recursos más populares (top 5)
SELECT 
    title,
    category,
    access_count,
    url
FROM web_resources
WHERE country = 'Chile'
ORDER BY access_count DESC
LIMIT 5;

-- 8. Distribución por tags
SELECT 
    UNNEST(tags) as tag,
    COUNT(*) as count
FROM web_resources
WHERE country = 'Chile'
GROUP BY tag
ORDER BY count DESC
LIMIT 20;

-- 9. Recursos sin contenido completo (si los hay)
SELECT 
    COUNT(*) as recursos_sin_contenido
FROM web_resources
WHERE country = 'Chile' 
    AND (content IS NULL OR LENGTH(content) < 100);

-- 10. Rangos de IDs ocupados
SELECT 
    MIN(id) as primer_id,
    MAX(id) as ultimo_id,
    MAX(id) - MIN(id) + 1 as rango_total,
    COUNT(*) as recursos_reales,
    (MAX(id) - MIN(id) + 1) - COUNT(*) as gaps
FROM web_resources
WHERE country = 'Chile';
