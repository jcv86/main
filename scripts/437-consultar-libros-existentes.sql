-- Consultar todos los libros existentes en la base de datos
SELECT 
  id,
  title,
  author,
  category,
  difficulty_level,
  estimated_read_time,
  LENGTH(content) as content_length,
  read_count,
  tags,
  created_at
FROM knowledge_base
ORDER BY created_at DESC;

-- Contar total de libros
SELECT COUNT(*) as total_books FROM knowledge_base;

-- Libros por categoría
SELECT category, COUNT(*) as count 
FROM knowledge_base 
GROUP BY category 
ORDER BY count DESC;
