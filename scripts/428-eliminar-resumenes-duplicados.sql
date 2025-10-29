-- Eliminar versiones "Resumen" cuando existe una versión "Completo" o "Medio" del mismo libro
DELETE FROM knowledge_base
WHERE id IN (
  SELECT kb1.id
  FROM knowledge_base kb1
  WHERE kb1.difficulty_level = 'principiante'
  AND kb1.estimated_read_time < 10
  AND EXISTS (
    SELECT 1
    FROM knowledge_base kb2
    WHERE kb2.title = kb1.title
    AND kb2.author = kb1.author
    AND kb2.id != kb1.id
    AND (kb2.difficulty_level IN ('intermedio', 'avanzado') OR kb2.estimated_read_time > 20)
  )
);

-- Eliminar duplicados exactos (mismo título y autor)
DELETE FROM knowledge_base
WHERE id NOT IN (
  SELECT MIN(id)
  FROM knowledge_base
  GROUP BY title, author
);
