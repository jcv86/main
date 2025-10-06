-- =====================================================
-- SAMPLE LEARNING PATHS
-- Based on LinkedIn Learning & Coursera best practices
-- =====================================================

-- Path 1: Liderazgo Efectivo (Intermediate)
INSERT INTO learning_paths (
    title, 
    description, 
    category, 
    difficulty_level, 
    estimated_hours,
    skills_covered,
    prerequisites,
    target_roles,
    popularity_score
) VALUES (
    'Liderazgo Efectivo en el Siglo XXI',
    'Desarrolla habilidades de liderazgo moderno: influencia, comunicación y gestión de equipos remotos.',
    'Liderazgo',
    'intermediate',
    20,
    ARRAY['Comunicación Efectiva', 'Gestión de Equipos', 'Inteligencia Emocional', 'Toma de Decisiones'],
    ARRAY['Experiencia básica en gestión'],
    ARRAY['Team Lead', 'Manager', 'Director'],
    85
) RETURNING id;

-- Path 2: Productividad Personal Avanzada (Intermediate)
INSERT INTO learning_paths (
    title,
    description,
    category,
    difficulty_level,
    estimated_hours,
    skills_covered,
    prerequisites,
    target_roles,
    popularity_score
) VALUES (
    'Productividad Personal: Del Caos a la Excelencia',
    'Sistema completo para dominar tu tiempo, energía y atención en la era digital.',
    'Productividad',
    'intermediate',
    15,
    ARRAY['Gestión del Tiempo', 'Organización Personal', 'Focus y Concentración', 'Hábitos Atómicos'],
    ARRAY['Ninguno'],
    ARRAY['Todos los profesionales'],
    92
);

-- Path 3: Comunicación Profesional (Beginner)
INSERT INTO learning_paths (
    title,
    description,
    category,
    difficulty_level,
    estimated_hours,
    skills_covered,
    prerequisites,
    target_roles,
    popularity_score
) VALUES (
    'Fundamentos de Comunicación Profesional',
    'Aprende a comunicarte con claridad, persuasión y empatía en cualquier contexto laboral.',
    'Comunicación',
    'beginner',
    12,
    ARRAY['Comunicación Verbal', 'Comunicación Escrita', 'Escucha Activa', 'Presentaciones'],
    ARRAY['Ninguno'],
    ARRAY['Todos los profesionales'],
    88
);

-- Path 4: Inteligencia Emocional para Profesionales (Intermediate)
INSERT INTO learning_paths (
    title,
    description,
    category,
    difficulty_level,
    estimated_hours,
    skills_covered,
    prerequisites,
    target_roles,
    popularity_score
) VALUES (
    'Dominio de la Inteligencia Emocional',
    'Desarrolla autoconciencia, autogestión y habilidades sociales para el éxito profesional.',
    'Inteligencia Emocional',
    'intermediate',
    18,
    ARRAY['Autoconciencia', 'Autogestión', 'Empatía', 'Habilidades Sociales'],
    ARRAY['Ninguno'],
    ARRAY['Leaders', 'Managers', 'HR Professionals'],
    90
);

-- Path 5: Transformación Digital y Adaptabilidad (Advanced)
INSERT INTO learning_paths (
    title,
    description,
    category,
    difficulty_level,
    estimated_hours,
    skills_covered,
    prerequisites,
    target_roles,
    popularity_score
) VALUES (
    'Liderando la Transformación Digital',
    'Guía al cambio organizacional en la era de la disrupción tecnológica.',
    'Transformación Digital',
    'advanced',
    25,
    ARRAY['Change Management', 'Digital Strategy', 'Innovation', 'Agile Leadership'],
    ARRAY['Experiencia en liderazgo'],
    ARRAY['Senior Manager', 'Director', 'C-Level'],
    78
);

-- =====================================================
-- SAMPLE LEARNING PATH STEPS
-- =====================================================

-- Steps for Path 1: Liderazgo Efectivo
INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, content_id, estimated_minutes, is_required)
SELECT 
    lp.id,
    1,
    'Introducción: El Líder del Siglo XXI',
    'Comprende las diferencias entre el liderazgo tradicional y el moderno.',
    'book',
    kb.id,
    45,
    true
FROM learning_paths lp
CROSS JOIN knowledge_base kb
WHERE lp.title = 'Liderazgo Efectivo en el Siglo XXI'
    AND kb.title LIKE '%Liderazgo%'
LIMIT 1;

INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, content_id, estimated_minutes, is_required)
SELECT 
    lp.id,
    2,
    'Inteligencia Emocional en el Liderazgo',
    'Desarrolla autoconciencia y empatía como líder.',
    'book',
    kb.id,
    60,
    true
FROM learning_paths lp
CROSS JOIN knowledge_base kb
WHERE lp.title = 'Liderazgo Efectivo en el Siglo XXI'
    AND kb.title LIKE '%Inteligencia Emocional%'
LIMIT 1;

INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, estimated_minutes, is_required)
SELECT 
    lp.id,
    3,
    'Comunicación para Líderes',
    'Aprende a comunicar visión y motivar a tu equipo.',
    'book',
    kb.id,
    50,
    true
FROM learning_paths lp
CROSS JOIN knowledge_base kb
WHERE lp.title = 'Liderazgo Efectivo en el Siglo XXI'
    AND kb.title LIKE '%Comunicación%'
LIMIT 1;

-- Steps for Path 2: Productividad Personal
INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, content_id, estimated_minutes, is_required)
SELECT 
    lp.id,
    1,
    'Fundamentos de Productividad Personal',
    'Comprende los principios básicos de la gestión del tiempo y energía.',
    'book',
    kb.id,
    40,
    true
FROM learning_paths lp
CROSS JOIN knowledge_base kb
WHERE lp.title = 'Productividad Personal: Del Caos a la Excelencia'
    AND kb.title LIKE '%Hábitos Atómicos%'
LIMIT 1;

INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, estimated_minutes, is_required)
SELECT 
    lp.id,
    2,
    'Deep Work: Trabajo Profundo',
    'Aprende a mantener el foco en un mundo de distracciones.',
    'book',
    kb.id,
    55,
    true
FROM learning_paths lp
CROSS JOIN knowledge_base kb
WHERE lp.title = 'Productividad Personal: Del Caos a la Excelencia'
    AND kb.title LIKE '%Deep Work%'
LIMIT 1;

INSERT INTO learning_path_steps (path_id, step_order, title, description, content_type, estimated_minutes, is_required)
SELECT 
    lp.id,
    3,
    'Sistemas de Organización Personal',
    'Implementa sistemas para gestionar tareas, proyectos e información.',
    'book',
    kb.id,
    45,
    true
FROM learning_paths lp
CROSS JOIN knowledge_base kb
WHERE lp.title = 'Productividad Personal: Del Caos a la Excelencia'
    AND kb.title LIKE '%7 Hábitos%'
LIMIT 1;

-- =====================================================
-- SAMPLE SKILL BENCHMARKS (Peer Comparison Data)
-- =====================================================

-- Leadership Skills Benchmarks
INSERT INTO peer_benchmarks (skill_name, industry, experience_level, percentile_25, percentile_50, percentile_75, percentile_90, sample_size)
VALUES 
    ('Liderazgo', 'Tecnología', 'Mid-Level', 5.2, 6.5, 7.8, 8.5, 450),
    ('Liderazgo', 'Tecnología', 'Senior', 6.8, 7.8, 8.7, 9.2, 320),
    ('Liderazgo', 'Finanzas', 'Mid-Level', 5.5, 6.8, 7.9, 8.6, 380),
    ('Liderazgo', 'Finanzas', 'Senior', 7.0, 8.0, 8.9, 9.4, 280);

-- Communication Skills Benchmarks
INSERT INTO peer_benchmarks (skill_name, industry, experience_level, percentile_25, percentile_50, percentile_75, percentile_90, sample_size)
VALUES 
    ('Comunicación', 'Tecnología', 'Mid-Level', 6.0, 7.0, 8.0, 8.8, 500),
    ('Comunicación', 'Tecnología', 'Senior', 7.2, 8.2, 9.0, 9.5, 350),
    ('Comunicación', 'Finanzas', 'Mid-Level', 6.2, 7.3, 8.2, 8.9, 420),
    ('Comunicación', 'Finanzas', 'Senior', 7.5, 8.5, 9.2, 9.6, 310);

-- Emotional Intelligence Benchmarks
INSERT INTO peer_benchmarks (skill_name, industry, experience_level, percentile_25, percentile_50, percentile_75, percentile_90, sample_size)
VALUES 
    ('Inteligencia Emocional', 'Tecnología', 'Mid-Level', 5.8, 7.0, 8.1, 8.7, 480),
    ('Inteligencia Emocional', 'Tecnología', 'Senior', 6.9, 7.9, 8.8, 9.3, 340),
    ('Inteligencia Emocional', 'Finanzas', 'Mid-Level', 6.0, 7.2, 8.3, 8.9, 410),
    ('Inteligencia Emocional', 'Finanzas', 'Senior', 7.1, 8.1, 9.0, 9.5, 290);

-- Time Management Benchmarks
INSERT INTO peer_benchmarks (skill_name, industry, experience_level, percentile_25, percentile_50, percentile_75, percentile_90, sample_size)
VALUES 
    ('Gestión del Tiempo', 'Tecnología', 'Mid-Level', 5.5, 6.8, 7.9, 8.6, 520),
    ('Gestión del Tiempo', 'Tecnología', 'Senior', 6.7, 7.7, 8.6, 9.1, 370),
    ('Gestión del Tiempo', 'Finanzas', 'Mid-Level', 5.7, 7.0, 8.1, 8.7, 440),
    ('Gestión del
    ('Gestión del Tiempo', 'Finanzas', 'Mid-Level', 5.7, 7.0, 8.1, 8.7, 440),
    ('Gestión del Tiempo', 'Finanzas', 'Senior', 6.9, 7.9, 8.8, 9.3, 360);

-- Problem Solving Benchmarks
INSERT INTO peer_benchmarks (skill_name, industry, experience_level, percentile_25, percentile_50, percentile_75, percentile_90, sample_size)
VALUES 
    ('Resolución de Problemas', 'Tecnología', 'Mid-Level', 6.0, 7.2, 8.2, 8.9, 490),
    ('Resolución de Problemas', 'Tecnología', 'Senior', 7.3, 8.3, 9.1, 9.6, 360),
    ('Resolución de Problemas', 'Finanzas', 'Mid-Level', 6.2, 7.4, 8.4, 9.0, 430),
    ('Resolución de Problemas', 'Finanzas', 'Senior', 7.5, 8.5, 9.2, 9.7, 320);

-- =====================================================
-- SAMPLE A/B TEST CONFIGURATIONS
-- =====================================================

-- Test: Response Format
INSERT INTO ab_test_variants (test_name, variant_name, description, config, is_active)
VALUES 
    ('response_format', 'control', 'Standard response format', '{"format": "standard", "include_sources": true}', true),
    ('response_format', 'concise', 'More concise responses', '{"format": "concise", "max_words": 300}', true),
    ('response_format', 'detailed', 'More detailed explanations', '{"format": "detailed", "include_examples": true}', true);

-- Test: Recommendation Engine
INSERT INTO ab_test_variants (test_name, variant_name, description, config, is_active)
VALUES 
    ('recommendation_algorithm', 'control', 'Standard collaborative filtering', '{"algorithm": "collaborative_filtering"}', true),
    ('recommendation_algorithm', 'ml_enhanced', 'ML-enhanced recommendations', '{"algorithm": "ml_hybrid", "use_embeddings": true}', true);

-- Test: Learning Path Display
INSERT INTO ab_test_variants (test_name, variant_name, description, config, is_active)
VALUES 
    ('learning_path_ui', 'control', 'Standard list view', '{"layout": "list"}', true),
    ('learning_path_ui', 'card_view', 'Card-based visual layout', '{"layout": "cards", "show_progress": true}', true),
    ('learning_path_ui', 'roadmap', 'Visual roadmap style', '{"layout": "roadmap", "show_milestones": true}', true);

-- =====================================================
-- SAMPLE SMART RECOMMENDATIONS
-- =====================================================

-- Create sample recommendations for demo user
INSERT INTO smart_recommendations (
    user_email, 
    recommendation_type, 
    item_id, 
    item_type,
    title,
    reason,
    confidence_score,
    priority,
    expires_at
)
SELECT 
    'demo-user',
    'learning_path',
    lp.id,
    'learning_path',
    lp.title,
    'Basado en tus brechas de habilidades identificadas en ' || array_to_string(lp.skills_covered, ', '),
    0.85,
    1,
    CURRENT_TIMESTAMP + INTERVAL '7 days'
FROM learning_paths lp
WHERE lp.title = 'Liderazgo Efectivo en el Siglo XXI';

INSERT INTO smart_recommendations (
    user_email, 
    recommendation_type, 
    item_id, 
    item_type,
    title,
    reason,
    confidence_score,
    priority,
    expires_at
)
SELECT 
    'demo-user',
    'next_book',
    kb.id,
    'book',
    kb.title,
    'Usuarios con intereses similares también leyeron este libro',
    0.78,
    2,
    CURRENT_TIMESTAMP + INTERVAL '14 days'
FROM knowledge_base kb
WHERE kb.title LIKE '%Hábitos Atómicos%'
LIMIT 1;

COMMENT ON TABLE learning_paths IS 'Structured learning paths inspired by LinkedIn Learning';
COMMENT ON TABLE learning_path_steps IS 'Individual steps within learning paths';
COMMENT ON TABLE user_learning_path_progress IS 'User progress tracking with streaks (Coach.me style)';
COMMENT ON TABLE peer_benchmarks IS 'Anonymous peer comparison data for skill levels';
COMMENT ON TABLE smart_recommendations IS 'ML-powered personalized recommendations';
COMMENT ON TABLE ab_test_variants IS 'A/B testing framework for continuous improvement';
COMMENT ON TABLE brain_response_cache IS 'Response caching for 2x faster responses';
COMMENT ON TABLE api_usage_tracking IS 'Cost optimization and monitoring';
