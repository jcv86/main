-- Traducir todos los títulos de libros y categorías al español

-- Actualizar "Effective Communication"
UPDATE knowledge_base
SET 
    title = 'Comunicación Efectiva',
    category = 'Habilidades Blandas',
    tags = ARRAY['comunicación', 'habilidades-blandas', 'relaciones'],
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Effective Communication';

-- Actualizar "Career Planning Guide"
UPDATE knowledge_base
SET 
    title = 'Guía de Planificación de Carrera',
    category = 'Desarrollo Profesional',
    tags = ARRAY['carrera', 'planificación', 'objetivos'],
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Career Planning Guide';

-- Actualizar "Project Management Basics"
UPDATE knowledge_base
SET 
    title = 'Fundamentos de Gestión de Proyectos',
    category = 'Gestión',
    tags = ARRAY['gestión-de-proyectos', 'metodología', 'planificación'],
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Project Management Basics';

-- Actualizar "Leadership Fundamentals"
UPDATE knowledge_base
SET 
    title = 'Fundamentos de Liderazgo',
    category = 'Liderazgo',
    tags = ARRAY['liderazgo', 'gestión', 'equipos'],
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Leadership Fundamentals';

-- Actualizar "Advanced JavaScript Patterns"
UPDATE knowledge_base
SET 
    title = 'Patrones Avanzados de JavaScript',
    category = 'Técnico',
    tags = ARRAY['javascript', 'programación', 'patrones'],
    updated_at = CURRENT_TIMESTAMP
WHERE title = 'Advanced JavaScript Patterns';

-- Actualizar cualquier otro libro con categorías en inglés
UPDATE knowledge_base
SET category = 'Habilidades Blandas', updated_at = CURRENT_TIMESTAMP
WHERE category = 'Soft Skills';

UPDATE knowledge_base
SET category = 'Desarrollo Profesional', updated_at = CURRENT_TIMESTAMP
WHERE category = 'Career Development';

UPDATE knowledge_base
SET category = 'Gestión', updated_at = CURRENT_TIMESTAMP
WHERE category = 'Management';

UPDATE knowledge_base
SET category = 'Liderazgo', updated_at = CURRENT_TIMESTAMP
WHERE category = 'Leadership';

UPDATE knowledge_base
SET category = 'Técnico', updated_at = CURRENT_TIMESTAMP
WHERE category = 'Technical';

UPDATE knowledge_base
SET category = 'Finanzas Personales', updated_at = CURRENT_TIMESTAMP
WHERE category = 'Personal Finance';

UPDATE knowledge_base
SET category = 'Productividad', updated_at = CURRENT_TIMESTAMP
WHERE category = 'Productivity';

UPDATE knowledge_base
SET category = 'Emprendimiento', updated_at = CURRENT_TIMESTAMP
WHERE category = 'Entrepreneurship';

UPDATE knowledge_base
SET category = 'Marketing', updated_at = CURRENT_TIMESTAMP
WHERE category = 'Marketing';

UPDATE knowledge_base
SET category = 'Ventas', updated_at = CURRENT_TIMESTAMP
WHERE category = 'Sales';
