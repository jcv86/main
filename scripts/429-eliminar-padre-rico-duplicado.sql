-- Eliminar duplicados de "Padre Rico, Padre Pobre" manteniendo solo la versión más larga
DELETE FROM knowledge_base
WHERE title = 'Padre Rico, Padre Pobre'
AND author = 'Robert T. Kiyosaki'
AND id NOT IN (
  SELECT id
  FROM knowledge_base
  WHERE title = 'Padre Rico, Padre Pobre'
  AND author = 'Robert T. Kiyosaki'
  ORDER BY estimated_read_time DESC, LENGTH(content) DESC
  LIMIT 1
);
