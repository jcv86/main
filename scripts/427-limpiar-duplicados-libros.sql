-- Script para eliminar libros duplicados de la base de datos
-- Mantiene solo la primera entrada de cada libro basado en título y autor

-- Eliminar duplicados manteniendo el registro con el ID más bajo
DELETE FROM knowledge_base a
USING knowledge_base b
WHERE a.id > b.id
  AND a.title = b.title
  AND a.author = b.author;

-- Verificar cuántos libros únicos quedan
SELECT 
  COUNT(*) as total_libros,
  COUNT(DISTINCT title) as titulos_unicos,
  COUNT(*) - COUNT(DISTINCT title) as posibles_duplicados
FROM knowledge_base;

-- Mostrar libros que podrían estar duplicados (mismo título, diferente autor o viceversa)
SELECT 
  title,
  author,
  COUNT(*) as cantidad
FROM knowledge_base
GROUP BY title, author
HAVING COUNT(*) > 1
ORDER BY cantidad DESC, title;
