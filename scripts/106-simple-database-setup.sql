-- Script simplificado sin conflictos de constraints

-- Verificar qué tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar estructura de user_profiles si existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Limpiar datos existentes de travis si existen
DELETE FROM user_activities WHERE user_email = 'travis@nuanu.com';
DELETE FROM test_results WHERE user_email = 'travis@nuanu.com';
DELETE FROM interview_simulations WHERE user_email = 'travis@nuanu.com';
DELETE FROM generated_cvs WHERE user_email = 'travis@nuanu.com';
DELETE FROM user_achievements WHERE user_email = 'travis@nuanu.com';
DELETE FROM user_skills WHERE user_email = 'travis@nuanu.com';
DELETE FROM user_profiles WHERE email = 'travis@nuanu.com';

-- Insertar perfil de travis (sin ON CONFLICT)
INSERT INTO user_profiles (
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
);

-- Insertar resultados de tests
INSERT INTO test_results (
    user_email,
    test_type,
    test_name,
    results,
    score,
    completed_at,
    duration_minutes
) VALUES 
(
    'travis@nuanu.com',
    'personality',
    'DISC',
    '{"primary_type": "Influencer", "scores": {"D": 65, "I": 85, "S": 45, "C": 35}, "description": "Perfil Influencer con alta capacidad de comunicación y persuasión"}',
    85,
    NOW() - INTERVAL '15 days',
    12
),
(
    'travis@nuanu.com',
    'personality',
    'Big Five',
    '{"scores": {"openness": 78, "conscientiousness": 72, "extraversion": 82, "agreeableness": 68, "neuroticism": 35}, "description": "Alta apertura y extraversión, baja en neuroticismo"}',
    72,
    NOW() - INTERVAL '12 days',
    18
),
(
    'travis@nuanu.com',
    'personality',
    'MBTI',
    '{"type": "ENFP", "description": "El Inspirador - Entusiasta, creativo y sociable", "preferences": {"E": 75, "N": 68, "F": 72, "P": 80}}',
    75,
    NOW() - INTERVAL '10 days',
    25
);

-- Insertar actividades
INSERT INTO user_activities (
    user_email,
    activity_type,
    activity_description,
    xp_earned,
    created_at
) VALUES 
(
    'travis@nuanu.com',
    'test_completed',
    'Completaste el test DISC',
    15,
    NOW() - INTERVAL '15 days'
),
(
    'travis@nuanu.com',
    'test_completed',
    'Completaste el test Big Five',
    20,
    NOW() - INTERVAL '12 days'
),
(
    'travis@nuanu.com',
    'test_completed',
    'Completaste el test MBTI',
    25,
    NOW() - INTERVAL '10 days'
),
(
    'travis@nuanu.com',
    'cv_generated',
    'Generaste tu primer CV',
    20,
    NOW() - INTERVAL '8 days'
),
(
    'travis@nuanu.com',
    'achievement_unlocked',
    'Desbloqueaste la insignia "Explorador"',
    10,
    NOW() - INTERVAL '7 days'
);

-- Insertar simulaciones de entrevistas
INSERT INTO interview_simulations (
    user_email,
    simulation_type,
    score,
    feedback,
    completed_at,
    duration_minutes,
    questions_answered
) VALUES 
(
    'travis@nuanu.com',
    'general',
    8.5,
    'Excelente comunicación y confianza. Recomendación: Incluir más ejemplos específicos usando metodología STAR.',
    NOW() - INTERVAL '5 days',
    25,
    8
),
(
    'travis@nuanu.com',
    'technical',
    7.2,
    'Buen conocimiento técnico. Practicar explicaciones más claras de conceptos complejos.',
    NOW() - INTERVAL '20 days',
    35,
    12
);

-- Verificar que todo se insertó correctamente
SELECT 'User Profile' as table_name, COUNT(*) as count FROM user_profiles WHERE email = 'travis@nuanu.com'
UNION ALL
SELECT 'Test Results' as table_name, COUNT(*) as count FROM test_results WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'User Activities' as table_name, COUNT(*) as count FROM user_activities WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'Interview Simulations' as table_name, COUNT(*) as count FROM interview_simulations WHERE user_email = 'travis@nuanu.com';
