-- Cambiando nombre de tabla de "libros" a "knowledge_base"
INSERT INTO knowledge_base (title, author, content, category, tags, difficulty_level, estimated_read_time, read_count)
SELECT 
  'Grit: El Poder de la Pasión y la Perseverancia',
  'Angela Duckworth',
  'Contenido del libro Grit por Angela Duckworth',
  'Desarrollo Personal',
  ARRAY['perseverancia', 'éxito', 'mentalidad', 'disciplina', 'pasión', 'metas', 'resiliencia', 'crecimiento', 'hábitos', 'motivación'],
  'intermedio',
  45,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM knowledge_base 
  WHERE title = 'Grit: El Poder de la Pasión y la Perseverancia' 
  AND author = 'Angela Duckworth'
);
