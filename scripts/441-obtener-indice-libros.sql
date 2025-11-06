-- Script para obtener el índice completo de libros en la base de datos
-- Ejecuta este script para ver todos los libros existentes antes de agregar nuevos

SELECT 
  title,
  author,
  category,
  difficulty_level,
  estimated_read_time,
  LENGTH(content) as content_length,
  read_count
FROM knowledge_base
ORDER BY title ASC;
