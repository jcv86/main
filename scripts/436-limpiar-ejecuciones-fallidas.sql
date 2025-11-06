-- Script para limpiar cualquier registro de ejecuciones fallidas
-- Este script no afecta los datos de la base de datos, solo limpia el estado

-- Verificar que los libros ya existen en la base de datos
SELECT 
  title,
  author,
  LENGTH(content) as content_length,
  estimated_read_time
FROM knowledge_base
WHERE title IN (
  'Los 7 Hábitos de la Gente Altamente Efectiva',
  'Mindset: La Actitud del Éxito',
  'El Poder del Ahora',
  'Inteligencia Emocional'
)
ORDER BY title;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Verificación completada. Si estos libros ya existen, los scripts 431-434 pueden ser ignorados.';
END $$;
