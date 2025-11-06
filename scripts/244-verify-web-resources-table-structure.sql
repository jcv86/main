-- Verificar la estructura real de la tabla web_resources
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'web_resources'
ORDER BY ordinal_position;

-- Verificar constraints únicos
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'web_resources';

-- Contar recursos existentes
SELECT 
    'Total recursos existentes: ' || COUNT(*) as mensaje
FROM web_resources;

-- Ver recursos existentes por categoría
SELECT 
    category,
    COUNT(*) as cantidad
FROM web_resources
GROUP BY category
ORDER BY cantidad DESC;

-- Listar URLs existentes (primeros 20)
SELECT 
    id,
    title,
    url,
    category
FROM web_resources
ORDER BY id
LIMIT 20;
