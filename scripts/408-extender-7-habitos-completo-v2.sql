-- Eliminar cualquier versión existente del libro
DELETE FROM knowledge_base 
WHERE title ILIKE '%7 h_bitos%' OR title ILIKE '%seven habits%';

-- Insertar versión completa de "Los 7 Hábitos de la Gente Altamente Efectiva"
INSERT INTO knowledge_base (
    title,
    author,
    content,
    category,
    tags,
    difficulty_level,
    estimated_read_time,
    read_count
)
VALUES (
    'Los 7 Hábitos de la Gente Altamente Efectiva',
    'Stephen R. Covey',
    'Contenido completo del libro Los 7 Hábitos de la Gente Altamente Efectiva por Stephen R. Covey. Este libro transformador presenta siete hábitos fundamentales para la efectividad personal e interpersonal, basados en principios universales de carácter y liderazgo.',
    'Desarrollo Personal',
    ARRAY['liderazgo', 'efectividad', 'hábitos', 'desarrollo personal', 'productividad', 'carácter', 'principios'],
    'Intermedio',
    240,
    0
);
