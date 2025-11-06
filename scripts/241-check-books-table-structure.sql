-- Verificar estructura de la tabla knowledge_base
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'knowledge_base'
ORDER BY ordinal_position;

-- Verificar si existe tabla books
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'books'
) as books_table_exists;

-- Contar registros actuales en knowledge_base
SELECT COUNT(*) as total_entries FROM knowledge_base;

-- Ver últimos 5 registros
SELECT 
  id,
  title,
  category,
  author,
  LENGTH(content) as content_length,
  created_at
FROM knowledge_base
ORDER BY id DESC
LIMIT 5;
