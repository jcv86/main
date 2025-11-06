-- Cambiando nombre de tabla de "libros" a "knowledge_base"
INSERT INTO knowledge_base (title, author, content, category, tags, difficulty_level, estimated_read_time, read_count)
SELECT 
  'Hábitos Atómicos',
  'James Clear',
  '# HÁBITOS ATÓMICOS
## Por James Clear

---

## INTRODUCCIÓN

Los hábitos son el interés compuesto de la auto-mejora. Así como el dinero se multiplica con el interés compuesto, los efectos de tus hábitos se multiplican mientras los repites.

**El Poder del 1%:**

**Si mejoras 1% cada día:**

',
  'Autoayuda',
  ARRAY['hábitos', 'productividad', 'disciplina', 'cambio', 'sistemas', 'mejora continua', 'rutinas', 'comportamiento', 'éxito', 'transformación'],
  'principiante',
  55,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM knowledge_base 
  WHERE title = 'Hábitos Atómicos' 
  AND author = 'James Clear'
);
