-- Verificar y corregir datos de usuario
SELECT 'Verificando estructura de tablas...' as status;

-- Verificar si las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'test_results', 'user_activities', 'knowledge_base');

-- Verificar datos de usuario existentes
SELECT 'Datos de usuario actuales:' as info;
SELECT email, full_name, current_level, total_xp, tests_completed 
FROM user_profiles 
LIMIT 5;

-- Verificar resultados de tests
SELECT 'Resultados de tests:' as info;
SELECT user_email, test_name, score, completed_at 
FROM test_results 
ORDER BY completed_at DESC 
LIMIT 5;

SELECT 'Verificación completada' as status;

-- Verificar si el usuario travis@nuanu.com existe
SELECT * FROM auth.users WHERE email = 'travis@nuanu.com';

-- Verificar si existe en la tabla de perfiles
SELECT * FROM user_profiles WHERE email = 'travis@nuanu.com';

-- Si no existe, crear el usuario en user_profiles
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
    interview_simulations
) VALUES (
    gen_random_uuid(),
    'travis@nuanu.com',
    'Travis Nuanu',
    NOW(),
    NOW(),
    65,
    150,
    3,
    3,
    1,
    5
) ON CONFLICT (email) DO UPDATE SET
    profile_completion_percentage = 65,
    total_xp = 150,
    current_level = 3,
    tests_completed = 3,
    cv_generated = 1,
    interview_simulations = 5,
    updated_at = NOW();

-- Crear resultados de tests para travis@nuanu.com
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
    gen_random_uuid(),
    'travis@nuanu.com',
    'personality',
    'DISC',
    '{"primary_type": "Influencer", "scores": {"D": 65, "I": 85, "S": 45, "C": 35}, "description": "Perfil Influencer con alta capacidad de comunicación y persuasión"}',
    85,
    '2024-11-15 10:30:00',
    12
),
(
    gen_random_uuid(),
    'travis@nuanu.com',
    'personality',
    'Big Five',
    '{"scores": {"openness": 78, "conscientiousness": 72, "extraversion": 82, "agreeableness": 68, "neuroticism": 35}, "description": "Alta apertura y extraversión, baja en neuroticismo"}',
    72,
    '2024-11-12 14:20:00',
    18
),
(
    gen_random_uuid(),
    'travis@nuanu.com',
    'personality',
    'MBTI',
    '{"type": "ENFP", "description": "El Inspirador - Entusiasta, creativo y sociable con una amplia gama de intereses", "preferences": {"E": 75, "N": 68, "F": 72, "P": 80}}',
    75,
    '2024-11-10 16:45:00',
    25
)
ON CONFLICT (user_email, test_name) DO UPDATE SET
    results = EXCLUDED.results,
    score = EXCLUDED.score,
    completed_at = EXCLUDED.completed_at,
    duration_minutes = EXCLUDED.duration_minutes;

-- Crear actividades recientes
INSERT INTO user_activities (
    id,
    user_email,
    activity_type,
    activity_description,
    xp_earned,
    created_at
) VALUES 
(
    gen_random_uuid(),
    'travis@nuanu.com',
    'test_completed',
    'Completaste el test DISC',
    15,
    '2024-11-15 10:30:00'
),
(
    gen_random_uuid(),
    'travis@nuanu.com',
    'cv_generated',
    'Generaste tu primer CV',
    20,
    '2024-11-14 09:15:00'
),
(
    gen_random_uuid(),
    'travis@nuanu.com',
    'achievement_unlocked',
    'Desbloqueaste la insignia "Explorador"',
    10,
    '2024-11-13 11:20:00'
)
ON CONFLICT (user_email, activity_description) DO NOTHING;

-- Crear historial de simulaciones de entrevistas
INSERT INTO interview_simulations (
    id,
    user_email,
    simulation_type,
    score,
    feedback,
    completed_at,
    duration_minutes
) VALUES 
(
    gen_random_uuid(),
    'travis@nuanu.com',
    'general',
    8.5,
    'Excelente comunicación y confianza. Mejorar en ejemplos específicos con metodología STAR.',
    '2024-11-13 15:30:00',
    25
),
(
    gen_random_uuid(),
    'travis@nuanu.com',
    'technical',
    7.2,
    'Buen conocimiento técnico. Practicar explicaciones más claras de conceptos complejos.',
    '2024-11-06 10:15:00',
    35
)
ON CONFLICT (user_email, simulation_type, completed_at) DO NOTHING;

-- Verificar que todo se creó correctamente
SELECT 'User Profile' as table_name, COUNT(*) as count FROM user_profiles WHERE email = 'travis@nuanu.com'
UNION ALL
SELECT 'Test Results' as table_name, COUNT(*) as count FROM test_results WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'User Activities' as table_name, COUNT(*) as count FROM user_activities WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'Interview Simulations' as table_name, COUNT(*) as count FROM interview_simulations WHERE user_email = 'travis@nuanu.com';
