-- Insertar perfil del usuario travis@nuanu.com
INSERT INTO user_profiles (
    email,
    full_name,
    profile_completion_percentage,
    total_xp,
    current_level,
    tests_completed,
    cv_generated,
    interview_simulations,
    bio,
    location,
    documents_read,
    skills_learned,
    career_goal
) VALUES (
    'travis@example.com',
    'Travis Johnson',
    65,
    275,
    3,
    2,
    1,
    5,
    'Profesional en desarrollo de carrera enfocado en tecnología',
    'Santiago, Chile',
    8,
    12,
    'Convertirme en líder de equipo en tecnología'
)
ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    profile_completion_percentage = EXCLUDED.profile_completion_percentage,
    total_xp = EXCLUDED.total_xp,
    current_level = EXCLUDED.current_level,
    tests_completed = EXCLUDED.tests_completed,
    cv_generated = EXCLUDED.cv_generated,
    interview_simulations = EXCLUDED.interview_simulations,
    bio = EXCLUDED.bio,
    location = EXCLUDED.location,
    documents_read = EXCLUDED.documents_read,
    skills_learned = EXCLUDED.skills_learned,
    career_goal = EXCLUDED.career_goal,
    updated_at = CURRENT_TIMESTAMP;

-- Insertar usuario demo
INSERT INTO user_profiles (email, full_name, current_level, total_xp, tests_completed, documents_read, skills_learned, career_goal) 
VALUES ('demo@example.com', 'Usuario Demo', 1, 50, 1, 3, 5, 'Explorar la plataforma')
ON CONFLICT (email) DO NOTHING;

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
    'travis@example.com',
    'personality',
    'DISC',
    '{"primary_type": "Influencer", "scores": {"D": 65, "I": 85, "S": 45, "C": 35}, "description": "Perfil Influencer con alta capacidad de comunicación y persuasión"}',
    85,
    NOW() - INTERVAL '15 days',
    12
),
(
    'travis@example.com',
    'personality',
    'Big Five',
    '{"scores": {"openness": 78, "conscientiousness": 72, "extraversion": 82, "agreeableness": 68, "neuroticism": 35}, "description": "Alta apertura y extraversión, baja en neuroticismo"}',
    72,
    NOW() - INTERVAL '12 days',
    18
),
(
    'travis@example.com',
    'personality',
    'MBTI',
    '{"type": "ENFP", "description": "El Inspirador - Entusiasta, creativo y sociable", "preferences": {"E": 75, "N": 68, "F": 72, "P": 80}}',
    75,
    NOW() - INTERVAL '10 days',
    25
);

-- Insertar actividades del usuario
INSERT INTO user_activities (
    user_email,
    activity_type,
    activity_description,
    xp_earned,
    created_at
) VALUES 
(
    'travis@example.com',
    'test_completed',
    'Completaste el test DISC',
    25,
    NOW() - INTERVAL '15 days'
),
(
    'travis@example.com',
    'document_read',
    'Leíste: Guía de Liderazgo',
    10,
    NOW() - INTERVAL '14 days'
),
(
    'travis@example.com',
    'skill_learned',
    'Aprendiste: Comunicación Asertiva',
    15,
    NOW() - INTERVAL '13 days'
),
(
    'travis@example.com',
    'level_up',
    'Subiste al nivel 3',
    50,
    NOW() - INTERVAL '12 days'
),
(
    'travis@example.com',
    'cv_generated',
    'Generaste tu primer CV',
    20,
    NOW() - INTERVAL '8 days'
),
(
    'travis@example.com',
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
    'travis@example.com',
    'general',
    8.5,
    'Excelente comunicación y confianza. Recomendación: Incluir más ejemplos específicos usando metodología STAR.',
    NOW() - INTERVAL '5 days',
    25,
    8
),
(
    'travis@example.com',
    'technical',
    7.2,
    'Buen conocimiento técnico. Practicar explicaciones más claras de conceptos complejos.',
    NOW() - INTERVAL '20 days',
    35,
    12
),
(
    'travis@example.com',
    'behavioral',
    8.0,
    'Muy buenas respuestas conductuales, demuestras autoconocimiento y capacidad de reflexión.',
    NOW() - INTERVAL '25 days',
    30,
    10
);

-- Insertar CV generado
INSERT INTO generated_cvs (
    user_email,
    cv_name,
    cv_data,
    template_used,
    completeness_score,
    ats_score,
    created_at
) VALUES (
    'travis@example.com',
    'CV Profesional - Travis Johnson',
    '{"personal_info": {"name": "Travis Johnson", "email": "travis@example.com", "phone": "+56 9 1234 5678", "location": "Santiago, Chile"}, "summary": "Profesional con experiencia en desarrollo de carrera y tecnología", "experience": [], "education": [], "skills": ["Comunicación", "Liderazgo", "Análisis"], "languages": ["Español", "Inglés"]}',
    'professional_modern',
    95,
    88,
    NOW() - INTERVAL '8 days'
);

-- Insertar logros/achievements
INSERT INTO user_achievements (
    user_email,
    achievement_type,
    achievement_name,
    achievement_description,
    earned_at,
    xp_reward,
    badge_icon
) VALUES 
(
    'travis@example.com',
    'exploration',
    'Explorador',
    'Completaste tu primer test psicométrico',
    NOW() - INTERVAL '15 days',
    10,
    'compass'
),
(
    'travis@example.com',
    'personality',
    'Conocedor de Sí Mismo',
    'Completaste 3 tests de personalidad',
    NOW() - INTERVAL '10 days',
    25,
    'brain'
),
(
    'travis@example.com',
    'cv',
    'Creador de CV',
    'Generaste tu primer CV profesional',
    NOW() - INTERVAL '8 days',
    20,
    'file-text'
);

-- Insertar habilidades del usuario
INSERT INTO user_skills (
    user_email,
    skill_name,
    skill_category,
    proficiency_level,
    verified,
    added_at
) VALUES 
(
    'travis@example.com',
    'Comunicación',
    'soft_skills',
    4,
    true,
    NOW() - INTERVAL '15 days'
),
(
    'travis@example.com',
    'Liderazgo',
    'soft_skills',
    4,
    true,
    NOW() - INTERVAL '15 days'
),
(
    'travis@example.com',
    'Trabajo en Equipo',
    'soft_skills',
    5,
    true,
    NOW() - INTERVAL '12 days'
),
(
    'travis@example.com',
    'Resolución de Problemas',
    'soft_skills',
    4,
    false,
    NOW() - INTERVAL '10 days'
),
(
    'travis@example.com',
    'Creatividad',
    'soft_skills',
    5,
    true,
    NOW() - INTERVAL '10 days'
);

-- Insertar documentos de la base de conocimiento
INSERT INTO knowledge_base_documents (
    title,
    slug,
    content,
    category,
    tags,
    author,
    is_published
) VALUES 
(
    'Especificación Técnica DTC 1.5',
    'especificacion-tecnica-dtc-15',
    'Documento técnico completo con la arquitectura, funcionalidades y especificaciones técnicas de la plataforma DespegaTuCarrera 1.5. Incluye detalles sobre la implementación de tests psicométricos, generación de CV con IA, simulación de entrevistas y sistema de coaching personalizado.',
    'Técnico',
    ARRAY['arquitectura', 'especificaciones', 'técnico', 'desarrollo'],
    'Equipo DTC',
    true
),
(
    'Guía de Inicio DTC',
    'guia-inicio-dtc',
    'Guía completa para nuevos usuarios de DespegaTuCarrera. Incluye primeros pasos, configuración inicial, cómo completar tu perfil, realizar tests psicométricos y maximizar tu experiencia en la plataforma.',
    'Guía',
    ARRAY['inicio', 'tutorial', 'primeros-pasos', 'configuración'],
    'Equipo DTC',
    true
),
(
    'Guía de Carreras Chile',
    'guia-carreras-chile',
    'Información detallada del mercado laboral chileno, incluyendo salarios promedio por industria, oportunidades de crecimiento, tendencias del mercado y consejos específicos para profesionales en Chile.',
    'Mercado',
    ARRAY['chile', 'mercado-laboral', 'salarios', 'carreras'],
    'Equipo DTC',
    true
),
(
    'Módulos Psicométricos',
    'modulos-psicometricos',
    'Documentación completa sobre los tests psicométricos disponibles: DISC, Big Five, MBTI, RIASEC, Habilidades Blandas e Inteligencias Múltiples. Incluye interpretación de resultados y aplicaciones prácticas.',
    'Psicometría',
    ARRAY['tests', 'psicometría', 'personalidad', 'evaluación'],
    'Equipo DTC',
    true
),
(
    'CV Generator & Entrevistas',
    'cv-generator-entrevistas',
    'Guía completa sobre las herramientas inteligentes para generación de CV y simulación de entrevistas con IA. Incluye mejores prácticas, optimización ATS y técnicas de preparación para entrevistas.',
    'Herramientas',
    ARRAY['cv', 'entrevistas', 'ia', 'herramientas'],
    'Equipo DTC',
    true
),
(
    'Biblioteca de Habilidades & Coach IA',
    'biblioteca-habilidades-coach-ia',
    'Catálogo completo de habilidades profesionales, sistema de coaching con IA y filosofías de mentores reconocidos como Bill Campbell, Carol Dweck y Naval Ravikant.',
    'IA & Skills',
    ARRAY['habilidades', 'coaching', 'ia', 'mentores'],
    'Equipo DTC',
    true
),
(
    'Progreso, Gamificación & Integraciones',
    'progreso-gamificacion-integraciones',
    'Sistema completo de seguimiento de progreso, gamificación inteligente con XP y logros, e integraciones con plataformas externas como LinkedIn, GitHub y sistemas ATS.',
    'Gamificación',
    ARRAY['progreso', 'gamificación', 'xp', 'integraciones'],
    'Equipo DTC',
    true
),
(
    'Recursos Adicionales',
    'recursos-adicionales',
    'Información complementaria, casos de uso, estudios de caso de usuarios exitosos, recursos de desarrollo profesional y enlaces a herramientas externas recomendadas.',
    'Recursos',
    ARRAY['recursos', 'casos-uso', 'desarrollo-profesional', 'herramientas'],
    'Equipo DTC',
    true
),
(
    'Guía del Test DISC',
    'guia-del-test-disc',
    'Guía completa sobre el test DISC y sus aplicaciones.',
    'Dr. María González',
    true
),
(
    'Liderazgo Efectivo',
    'liderazgo-efectivo',
    'Principios fundamentales del liderazgo moderno.',
    'Carlos Mendoza',
    true
),
(
    'Comunicación Asertiva',
    'comunicacion-asertiva',
    'Técnicas para mejorar la comunicación interpersonal.',
    'Ana Rodríguez',
    true
);

-- Verificar que todo se creó correctamente
SELECT 'Tables Created' as status, COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN (
        'user_profiles',
        'test_results', 
        'user_activities',
        'interview_simulations',
        'generated_cvs',
        'coach_conversations',
        'user_achievements',
        'user_skills',
        'knowledge_base_documents'
    );

-- Verificar datos insertados
SELECT 'User Profile' as table_name, COUNT(*) as count FROM user_profiles WHERE email = 'travis@example.com'
UNION ALL
SELECT 'Test Results' as table_name, COUNT(*) as count FROM test_results WHERE user_email = 'travis@example.com'
UNION ALL
SELECT 'User Activities' as table_name, COUNT(*) as count FROM user_activities WHERE user_email = 'travis@example.com'
UNION ALL
SELECT 'Interview Simulations' as table_name, COUNT(*) as count FROM interview_simulations WHERE user_email = 'travis@example.com'
UNION ALL
SELECT 'Generated CVs' as table_name, COUNT(*) as count FROM generated_cvs WHERE user_email = 'travis@example.com'
UNION ALL
SELECT 'User Achievements' as table_name, COUNT(*) as count FROM user_achievements WHERE user_email = 'travis@example.com'
UNION ALL
SELECT 'User Skills' as table_name, COUNT(*) as count FROM user_skills WHERE user_email = 'travis@example.com'
UNION ALL
SELECT 'Knowledge Base' as table_name, COUNT(*) as count FROM knowledge_base_documents;

-- Mostrar resumen del perfil creado
SELECT 
    full_name,
    email,
    profile_completion_percentage,
    total_xp,
    current_level,
    tests_completed,
    cv_generated,
    interview_simulations,
    career_goal
FROM user_profiles 
WHERE email = 'travis@example.com';
