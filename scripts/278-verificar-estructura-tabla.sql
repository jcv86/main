-- Verificar la estructura real de la tabla knowledge_base
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'knowledge_base'
ORDER BY ordinal_position;

-- Ver algunos títulos existentes
SELECT id, title, category, author
FROM knowledge_base
ORDER BY title
LIMIT 10;
