-- Insert sample learning paths
INSERT INTO learning_paths (title, description, category, difficulty_level, estimated_hours, skills_covered, prerequisites, target_roles, completion_rate, popularity_score)
VALUES 
(
    'Liderazgo Efectivo en el Siglo XXI',
    'Desarrolla habilidades de liderazgo moderno: influencia, comunicación y gestión de equipos remotos. Aprende a inspirar, motivar y guiar equipos hacia el éxito en entornos dinámicos.',
    'Liderazgo',
    'intermediate',
    20,
    ARRAY['Comunicación Efectiva', 'Gestión de Equipos', 'Inteligencia Emocional', 'Toma de Decisiones', 'Feedback Constructivo'],
    ARRAY['Experiencia básica en gestión'],
    ARRAY['Team Lead', 'Manager', 'Director', 'VP'],
    78,
    85
),
(
    'Productividad Personal: Del Caos a la Excelencia',
    'Sistema completo para dominar tu tiempo, energía y atención en la era digital. Aprende técnicas probadas de GTD, Pomodoro y gestión de energía.',
    'Productividad',
    'intermediate',
    15,
    ARRAY['Gestión del Tiempo', 'Organización Personal', 'Focus y Concentración', 'Hábitos Atómicos', 'Gestión de Energía'],
    ARRAY[],
    ARRAY['Profesionales en general', 'Emprendedores', 'Estudiantes'],
    85,
    92
),
(
    'Inteligencia Emocional para Profesionales',
    'Desarrolla tu capacidad para reconocer, entender y gestionar emociones propias y ajenas. Mejora tus relaciones profesionales y toma de decisiones.',
    'Desarrollo Personal',
    'beginner',
    12,
    ARRAY['Autoconocimiento', 'Autorregulación', 'Empatía', 'Habilidades Sociales', 'Motivación'],
    ARRAY[],
    ARRAY['Todos los profesionales'],
    82,
    88
),
(
    'Comunicación Estratégica y Persuasión',
    'Aprende a comunicar ideas de forma clara, convincente e impactante. Domina técnicas de storytelling, presentaciones efectivas y negociación.',
    'Comunicación',
    'intermediate',
    18,
    ARRAY['Comunicación Verbal', 'Comunicación Escrita', 'Storytelling', 'Presentaciones', 'Negociación'],
    ARRAY['Experiencia profesional básica'],
    ARRAY['Sales', 'Marketing', 'Management', 'Consulting'],
    75,
    80
),
(
    'Pensamiento Estratégico y Resolución de Problemas',
    'Desarrolla tu capacidad de análisis, pensamiento crítico y toma de decisiones estratégicas. Aprende frameworks como First Principles y Systems Thinking.',
    'Estrategia',
    'advanced',
    25,
    ARRAY['Pensamiento Crítico', 'Análisis de Datos', 'Toma de Decisiones', 'Systems Thinking', 'Problem Solving'],
    ARRAY['Experiencia profesional intermedia'],
    ARRAY['Manager', 'Strategy', 'Consultant', 'Executive'],
    70,
    75
);

-- Insert learning path steps for "Liderazgo Efectivo"
INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, content_id, estimated_minutes, is_required)
SELECT 
    lp.id,
    1,
    'Fundamentos del Liderazgo Moderno',
    'Comprende los principios fundamentales del liderazgo en la era digital y cómo han evolucionado.',
    'book',
    (SELECT id FROM books WHERE slug = 'los-7-habitos-de-la-gente-altamente-efectiva' LIMIT 1),
    90,
    true
FROM learning_paths lp
WHERE lp.title = 'Liderazgo Efectivo en el Siglo XXI';

INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, content_id, estimated_minutes, is_required)
SELECT 
    lp.id,
    2,
    'Inteligencia Emocional en el Liderazgo',
    'Desarrolla tu capacidad de gestionar emociones y crear conexiones auténticas con tu equipo.',
    'book',
    (SELECT id FROM books WHERE slug = 'inteligencia-emocional' LIMIT 1),
    120,
    true
FROM learning_paths lp
WHERE lp.title = 'Liderazgo Efectivo en el Siglo XXI';

INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, content_id, estimated_minutes, is_required)
SELECT 
    lp.id,
    3,
    'Comunicación de Alto Impacto',
    'Aprende a comunicar tu visión de forma clara y motivadora.',
    'book',
    (SELECT id FROM books WHERE slug = 'como-ganar-amigos-e-influir-sobre-las-personas' LIMIT 1),
    90,
    true
FROM learning_paths lp
WHERE lp.title = 'Liderazgo Efectivo en el Siglo XXI';

INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, estimated_minutes, is_required)
SELECT 
    lp.id,
    4,
    'Reflexión: Tu Estilo de Liderazgo',
    'Reflexiona sobre tus fortalezas y áreas de mejora como líder.',
    'reflection',
    NULL,
    30,
    true
FROM learning_paths lp
WHERE lp.title = 'Liderazgo Efectivo en el Siglo XXI';

-- Insert learning path steps for "Productividad Personal"
INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, content_id, estimated_minutes, is_required)
SELECT 
    lp.id,
    1,
    'Fundamentos de Hábitos Efectivos',
    'Aprende cómo construir y mantener hábitos que te lleven al éxito.',
    'book',
    (SELECT id FROM books WHERE slug = 'habitos-atomicos' LIMIT 1),
    120,
    true
FROM learning_paths lp
WHERE lp.title = 'Productividad Personal: Del Caos a la Excelencia';

INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, content_id, estimated_minutes, is_required)
SELECT 
    lp.id,
    2,
    'Trabajo Profundo y Concentración',
    'Domina el arte del trabajo profundo y elimina las distracciones.',
    'book',
    (SELECT id FROM books WHERE slug = 'deep-work' LIMIT 1),
    90,
    true
FROM learning_paths lp
WHERE lp.title = 'Productividad Personal: Del Caos a la Excelencia';

INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, content_id, estimated_minutes, is_required)
SELECT 
    lp.id,
    3,
    'La Semana Laboral de 4 Horas',
    'Aprende técnicas avanzadas de automatización y delegación.',
    'book',
    (SELECT id FROM books WHERE slug = 'la-semana-laboral-de-4-horas' LIMIT 1),
    100,
    false
FROM learning_paths lp
WHERE lp.title = 'Productividad Personal: Del Caos a la Excelencia';

INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, estimated_minutes, is_required)
SELECT 
    lp.id,
    4,
    'Ejercicio: Plan de Productividad Personal',
    'Crea tu plan personalizado de productividad basado en lo aprendido.',
    'exercise',
    NULL,
    45,
    true
FROM learning_paths lp
WHERE lp.title = 'Productividad Personal: Del Caos a la Excelencia';

-- Insert sample user progress for demo user
INSERT INTO user_learning_path_progress (user_email, path_id, current_step, completed_steps, status, completion_percentage, streak_days, total_time_minutes, started_at, last_activity_at)
SELECT 
    'demo-user',
    lp.id,
    2,
    ARRAY[1],
    'in_progress',
    45.0,
    7,
    180,
    NOW() - INTERVAL '7 days',
    NOW()
FROM learning_paths lp
WHERE lp.title = 'Productividad Personal: Del Caos a la Excelencia';

-- Insert sample skill assessments for demo user
INSERT INTO user_skill_assessments (user_email, skill_name, current_level, target_level, importance, assessed_at, next_review_date)
VALUES
    ('demo-user', 'Liderazgo', 5, 8, 'high', NOW(), CURRENT_DATE + INTERVAL '3 months'),
    ('demo-user', 'Comunicación Efectiva', 6, 9, 'critical', NOW(), CURRENT_DATE + INTERVAL '3 months'),
    ('demo-user', 'Gestión del Tiempo', 4, 8, 'high', NOW(), CURRENT_DATE + INTERVAL '3 months'),
    ('demo-user', 'Inteligencia Emocional', 5, 7, 'medium', NOW(), CURRENT_DATE + INTERVAL '3 months'),
    ('demo-user', 'Pensamiento Estratégico', 4, 8, 'high', NOW(), CURRENT_DATE + INTERVAL '3 months'),
    ('demo-user', 'Negociación', 3, 7, 'medium', NOW(), CURRENT_DATE + INTERVAL '3 months')
ON CONFLICT (user_email, skill_name) DO NOTHING;

-- Create A/B test for brain features
INSERT INTO ab_test_variants (test_name, variant_name, description, config, is_active, traffic_percentage)
VALUES
    ('brain_ui_v1', 'control', 'Original brain chat interface', '{"showSources": true, "showFollowUp": true}', true, 50),
    ('brain_ui_v1', 'enhanced', 'Enhanced brain with analytics sidebar', '{"showSources": true, "showFollowUp": true, "showAnalytics": true}', true, 50)
ON CONFLICT (test_name, variant_name) DO NOTHING;

COMMENT ON TABLE learning_paths IS 'Sample learning paths populated for demo';
