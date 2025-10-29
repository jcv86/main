-- Cambiando nombre de tabla de "libros" a "knowledge_base"
INSERT INTO knowledge_base (title, author, content, category, tags, difficulty_level, estimated_read_time, read_count)
SELECT 
  'Deep Work: Reglas para el Éxito Enfocado en un Mundo Distraído',
  'Cal Newport',
  'Contenido del libro Deep Work por Cal Newport',
  'Productividad',
  ARRAY['productividad', 'concentración', 'enfoque', 'trabajo profundo', 'distracción', 'eficiencia', 'rendimiento', 'hábitos', 'disciplina', 'éxito'],
  'intermedio',
  60,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM knowledge_base 
  WHERE title = 'Deep Work: Reglas para el Éxito Enfocado en un Mundo Distraído' 
  AND author = 'Cal Newport'
);
