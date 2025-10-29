-- Verificar contenido de los 4 libros que ya existen en la base de datos
SELECT 
  title,
  author,
  LENGTH(content) as content_length,
  estimated_read_time,
  difficulty_level,
  SUBSTRING(content, 1, 200) as content_preview
FROM knowledge_base
WHERE 
  (title = 'Los 7 Hábitos de la Gente Altamente Efectiva' AND author = 'Stephen R. Covey')
  OR (title = 'Mindset: La Actitud del Éxito' AND author = 'Carol S. Dweck')
  OR (title = 'El Poder del Ahora' AND author = 'Eckhart Tolle')
  OR (title = 'Inteligencia Emocional' AND author = 'Daniel Goleman')
ORDER BY title;
