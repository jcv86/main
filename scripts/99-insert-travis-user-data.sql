-- Insertar perfil del usuario travis@nuanu.com
INSERT INTO user_profiles (
    id,
    email,
    name,
    created_at,
    updated_at,
    profile_completion_percentage,
    total_xp,
    current_level,
    tests_completed,
    cv_generated,
    interview_simulations,
    bio,
    location
) VALUES (
    uuid_generate_v4(),
    'travis@nuanu.com',
    'Travis Nuanu',
    NOW() - INTERVAL '30 days',
    NOW(),
    65,
    150,
    3,
    3,
    1,
    5,
    'Profesional en desarrollo de carrera enfocado en tecnología',
    'Santiago, Chile'
) ON CONFLICT (email) DO UPDATE SET
    profile_completion_percentage = 65,
    total_xp = 150,
    current_level = 3,
    tests_completed = 3,
    cv_generated = 1,
    interview_simulations = 5,
    updated_at = NOW();

-- Insertar perfil de usuario Travis
INSERT INTO user_profiles (
    email, 
    full_name, 
    current_level, 
    total_xp, 
    tests_completed, 
    documents_read, 
    skills_learned,
    career_goal,
    created_at,
    updated_at
) VALUES (
    'travis@example.com',
    'Travis Johnson',
    3,
    275,
    2,
    8,
    12,
    'Convertirme en líder de equipo en tecnología',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    current_level = EXCLUDED.current_level,
    total_xp = EXCLUDED.total_xp,
    tests_completed = EXCLUDED.tests_completed,
    documents_read = EXCLUDED.documents_read,
    skills_learned = EXCLUDED.skills_learned,
    career_goal = EXCLUDED.career_goal,
    updated_at = CURRENT_TIMESTAMP;

-- Insertar resultados de tests para travis@nuanu.com
INSERT INTO test_results (
    id,
    user_email,
    test_type,
    test_name,
    results,
    score,
    completed_at,
    duration_minutes
) VALUES 
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'personality',
    'DISC',
    '{"primary_type": "Influencer", "scores": {"D": 65, "I": 85, "S": 45, "C": 35}, "description": "Perfil Influencer con alta capacidad de comunicación y persuasión. Excelente para roles que requieren interacción social y liderazgo de equipos."}',
    85,
    NOW() - INTERVAL '15 days',
    12
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'personality',
    'Big Five',
    '{"scores": {"openness": 78, "conscientiousness": 72, "extraversion": 82, "agreeableness": 68, "neuroticism": 35}, "description": "Alta apertura y extraversión, baja en neuroticismo. Persona creativa, sociable y emocionalmente estable."}',
    72,
    NOW() - INTERVAL '12 days',
    18
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'personality',
    'MBTI',
    '{"type": "ENFP", "description": "El Inspirador - Entusiasta, creativo y sociable con una amplia gama de intereses. Excelente para roles en consultoría, recursos humanos o emprendimiento.", "preferences": {"E": 75, "N": 68, "F": 72, "P": 80}}',
    75,
    NOW() - INTERVAL '10 days',
    25
)
ON CONFLICT (user_email, test_name) DO UPDATE SET
    results = EXCLUDED.results,
    score = EXCLUDED.score,
    completed_at = EXCLUDED.completed_at,
    duration_minutes = EXCLUDED.duration_minutes;

-- Insertar algunas actividades de ejemplo
INSERT INTO user_activities (user_email, activity_type, activity_description, xp_earned) VALUES
('travis@example.com', 'test_completed', 'Completaste el test DISC', 25),
('travis@example.com', 'document_read', 'Leíste: Guía de Liderazgo Efectivo', 10),
('travis@example.com', 'skill_learned', 'Aprendiste: Comunicación Asertiva', 15),
('travis@example.com', 'level_up', 'Subiste al nivel 2', 50),
('travis@example.com', 'test_completed', 'Completaste evaluación de habilidades', 25);

-- Insertar actividades recientes
INSERT INTO user_activities (
    id,
    user_email,
    activity_type,
    activity_description,
    xp_earned,
    created_at
) VALUES 
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'test_completed',
    'Completaste el test DISC',
    15,
    NOW() - INTERVAL '15 days'
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'test_completed',
    'Completaste el test Big Five',
    20,
    NOW() - INTERVAL '12 days'
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'test_completed',
    'Completaste el test MBTI',
    25,
    NOW() - INTERVAL '10 days'
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'cv_generated',
    'Generaste tu primer CV',
    20,
    NOW() - INTERVAL '8 days'
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'achievement_unlocked',
    'Desbloqueaste la insignia "Explorador"',
    10,
    NOW() - INTERVAL '7 days'
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'interview_simulation',
    'Completaste simulación de entrevista general',
    15,
    NOW() - INTERVAL '5 days'
)
ON CONFLICT (user_email, activity_description) DO NOTHING;

-- Insertar historial de simulaciones de entrevistas
INSERT INTO interview_simulations (
    id,
    user_email,
    simulation_type,
    score,
    feedback,
    completed_at,
    duration_minutes,
    questions_answered
) VALUES 
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'general',
    8.5,
    'Excelente comunicación y confianza. Demuestras buena preparación y conocimiento del rol. Recomendación: Incluir más ejemplos específicos usando la metodología STAR para fortalecer tus respuestas.',
    NOW() - INTERVAL '5 days',
    25,
    8
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'technical',
    7.2,
    'Buen conocimiento técnico y capacidad de resolución de problemas. Áreas de mejora: Practicar explicaciones más claras de conceptos complejos y mejorar la estructura de las respuestas técnicas.',
    NOW() - INTERVAL '20 days',
    35,
    12
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'behavioral',
    8.0,
    'Muy buenas respuestas conductuales, demuestras autoconocimiento y capacidad de reflexión. Sigue practicando ejemplos concretos de situaciones desafiantes.',
    NOW() - INTERVAL '25 days',
    30,
    10
)
ON CONFLICT (user_email, simulation_type, completed_at) DO NOTHING;

-- Insertar CV generado
INSERT INTO generated_cvs (
    id,
    user_email,
    cv_name,
    cv_data,
    template_used,
    completeness_score,
    ats_score,
    created_at
) VALUES (
    uuid_generate_v4(),
    'travis@nuanu.com',
    'CV Profesional - Travis Nuanu',
    '{"personal_info": {"name": "Travis Nuanu", "email": "travis@nuanu.com", "phone": "+56 9 1234 5678", "location": "Santiago, Chile"}, "summary": "Profesional con experiencia en desarrollo de carrera y tecnología", "experience": [], "education": [], "skills": ["Comunicación", "Liderazgo", "Análisis"], "languages": ["Español", "Inglés"]}',
    'professional_modern',
    95,
    88,
    NOW() - INTERVAL '8 days'
) ON CONFLICT DO NOTHING;

-- Insertar logros/achievements
INSERT INTO user_achievements (
    id,
    user_email,
    achievement_type,
    achievement_name,
    achievement_description,
    earned_at,
    xp_reward,
    badge_icon
) VALUES 
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'exploration',
    'Explorador',
    'Completaste tu primer test psicométrico',
    NOW() - INTERVAL '15 days',
    10,
    'compass'
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'personality',
    'Conocedor de Sí Mismo',
    'Completaste 3 tests de personalidad',
    NOW() - INTERVAL '10 days',
    25,
    'brain'
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'cv',
    'Creador de CV',
    'Generaste tu primer CV profesional',
    NOW() - INTERVAL '8 days',
    20,
    'file-text'
)
ON CONFLICT (user_email, achievement_name) DO NOTHING;

-- Insertar habilidades del usuario
INSERT INTO user_skills (
    id,
    user_email,
    skill_name,
    skill_category,
    proficiency_level,
    verified,
    added_at
) VALUES 
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'Comunicación',
    'soft_skills',
    4,
    true,
    NOW() - INTERVAL '15 days'
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'Liderazgo',
    'soft_skills',
    4,
    true,
    NOW() - INTERVAL '15 days'
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'Trabajo en Equipo',
    'soft_skills',
    5,
    true,
    NOW() - INTERVAL '12 days'
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'Resolución de Problemas',
    'soft_skills',
    4,
    false,
    NOW() - INTERVAL '10 days'
),
(
    uuid_generate_v4(),
    'travis@nuanu.com',
    'Creatividad',
    'soft_skills',
    5,
    true,
    NOW() - INTERVAL '10 days'
)
ON CONFLICT (user_email, skill_name) DO NOTHING;

-- Verificar que todos los datos se insertaron correctamente
SELECT 'User Profile' as table_name, COUNT(*) as count FROM user_profiles WHERE email = 'travis@nuanu.com'
UNION ALL
SELECT 'User Profile' as table_name, COUNT(*) as count FROM user_profiles WHERE email = 'travis@example.com'
UNION ALL
SELECT 'Test Results' as table_name, COUNT(*) as count FROM test_results WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'User Activities' as table_name, COUNT(*) as count FROM user_activities WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'User Activities' as table_name, COUNT(*) as count FROM user_activities WHERE user_email = 'travis@example.com'
UNION ALL
SELECT 'Interview Simulations' as table_name, COUNT(*) as count FROM interview_simulations WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'Generated CVs' as table_name, COUNT(*) as count FROM generated_cvs WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'User Achievements' as table_name, COUNT(*) as count FROM user_achievements WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'User Achievements' as table_name, COUNT(*) as count FROM user_achievements WHERE user_email = 'travis@example.com'
UNION ALL
SELECT 'User Skills' as table_name, COUNT(*) as count FROM user_skills WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'User Skills' as table_name, COUNT(*) as count FROM user_skills WHERE user_email = 'travis@example.com';

-- Mostrar resumen del perfil creado
SELECT 
    up.name,
    up.email,
    up.profile_completion_percentage,
    up.total_xp,
    up.current_level,
    up.tests_completed,
    up.cv_generated,
    up.interview_simulations,
    COUNT(DISTINCT tr.id) as actual_tests,
    COUNT(DISTINCT ua.id) as activities,
    COUNT(DISTINCT ach.id) as achievements
FROM user_profiles up
LEFT JOIN test_results tr ON up.email = tr.user_email
LEFT JOIN user_activities ua ON up.email = ua.user_email
LEFT JOIN user_achievements ach ON up.email = ach.user_email
WHERE up.email = 'travis@nuanu.com' OR up.email = 'travis@example.com'
GROUP BY up.id, up.name, up.email, up.profile_completion_percentage, up.total_xp, up.current_level, up.tests_completed, up.cv_generated, up.interview_simulations;
