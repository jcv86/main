-- Insertar perfil del usuario travis@nuanu.com
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
) ON CONFLICT (email) DO UPDATE SET
    profile_completion_percentage = 65,
    total_xp = 150,
    current_level = 3,
    tests_completed = 3,
    cv_generated = 1,
    interview_simulations = 5,
    updated_at = NOW();

-- Obtener el ID del usuario para las referencias
DO $$
DECLARE
    travis_user_id UUID;
BEGIN
    -- Obtener el ID del usuario travis
    SELECT id INTO travis_user_id FROM user_profiles WHERE email = 'travis@nuanu.com';
    
    -- Insertar resultados de tests
    INSERT INTO test_results (
        user_id,
        user_email,
        test_type,
        test_name,
        results,
        score,
        completed_at,
        duration_minutes
    ) VALUES 
    (
        travis_user_id,
        'travis@nuanu.com',
        'personality',
        'DISC',
        '{"primary_type": "Influencer", "scores": {"D": 65, "I": 85, "S": 45, "C": 35}, "description": "Perfil Influencer con alta capacidad de comunicación y persuasión. Excelente para roles que requieren interacción social y liderazgo de equipos."}',
        85,
        NOW() - INTERVAL '15 days',
        12
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'personality',
        'Big Five',
        '{"scores": {"openness": 78, "conscientiousness": 72, "extraversion": 82, "agreeableness": 68, "neuroticism": 35}, "description": "Alta apertura y extraversión, baja en neuroticismo. Persona creativa, sociable y emocionalmente estable."}',
        72,
        NOW() - INTERVAL '12 days',
        18
    ),
    (
        travis_user_id,
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

    -- Insertar actividades recientes
    INSERT INTO user_activities (
        user_id,
        user_email,
        activity_type,
        activity_description,
        xp_earned,
        created_at
    ) VALUES 
    (
        travis_user_id,
        'travis@nuanu.com',
        'test_completed',
        'Completaste el test DISC',
        15,
        NOW() - INTERVAL '15 days'
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'test_completed',
        'Completaste el test Big Five',
        20,
        NOW() - INTERVAL '12 days'
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'test_completed',
        'Completaste el test MBTI',
        25,
        NOW() - INTERVAL '10 days'
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'cv_generated',
        'Generaste tu primer CV',
        20,
        NOW() - INTERVAL '8 days'
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'achievement_unlocked',
        'Desbloqueaste la insignia "Explorador"',
        10,
        NOW() - INTERVAL '7 days'
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'interview_simulation',
        'Completaste simulación de entrevista general',
        15,
        NOW() - INTERVAL '5 days'
    );

    -- Insertar historial de simulaciones de entrevistas
    INSERT INTO interview_simulations (
        user_id,
        user_email,
        simulation_type,
        score,
        feedback,
        completed_at,
        duration_minutes,
        questions_answered
    ) VALUES 
    (
        travis_user_id,
        'travis@nuanu.com',
        'general',
        8.5,
        'Excelente comunicación y confianza. Demuestras buena preparación y conocimiento del rol. Recomendación: Incluir más ejemplos específicos usando la metodología STAR para fortalecer tus respuestas.',
        NOW() - INTERVAL '5 days',
        25,
        8
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'technical',
        7.2,
        'Buen conocimiento técnico y capacidad de resolución de problemas. Áreas de mejora: Practicar explicaciones más claras de conceptos complejos y mejorar la estructura de las respuestas técnicas.',
        NOW() - INTERVAL '20 days',
        35,
        12
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'behavioral',
        8.0,
        'Muy buenas respuestas conductuales, demuestras autoconocimiento y capacidad de reflexión. Sigue practicando ejemplos concretos de situaciones desafiantes.',
        NOW() - INTERVAL '25 days',
        30,
        10
    );

    -- Insertar CV generado
    INSERT INTO generated_cvs (
        user_id,
        user_email,
        cv_name,
        cv_data,
        template_used,
        completeness_score,
        ats_score,
        created_at
    ) VALUES (
        travis_user_id,
        'travis@nuanu.com',
        'CV Profesional - Travis Nuanu',
        '{"personal_info": {"name": "Travis Nuanu", "email": "travis@nuanu.com", "phone": "+56 9 1234 5678", "location": "Santiago, Chile"}, "summary": "Profesional con experiencia en desarrollo de carrera y tecnología", "experience": [], "education": [], "skills": ["Comunicación", "Liderazgo", "Análisis"], "languages": ["Español", "Inglés"]}',
        'professional_modern',
        95,
        88,
        NOW() - INTERVAL '8 days'
    );

    -- Insertar logros/achievements
    INSERT INTO user_achievements (
        user_id,
        user_email,
        achievement_type,
        achievement_name,
        achievement_description,
        earned_at,
        xp_reward,
        badge_icon
    ) VALUES 
    (
        travis_user_id,
        'travis@nuanu.com',
        'exploration',
        'Explorador',
        'Completaste tu primer test psicométrico',
        NOW() - INTERVAL '15 days',
        10,
        'compass'
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'personality',
        'Conocedor de Sí Mismo',
        'Completaste 3 tests de personalidad',
        NOW() - INTERVAL '10 days',
        25,
        'brain'
    ),
    (
        travis_user_id,
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
        user_id,
        user_email,
        skill_name,
        skill_category,
        proficiency_level,
        verified,
        added_at
    ) VALUES 
    (
        travis_user_id,
        'travis@nuanu.com',
        'Comunicación',
        'soft_skills',
        4,
        true,
        NOW() - INTERVAL '15 days'
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'Liderazgo',
        'soft_skills',
        4,
        true,
        NOW() - INTERVAL '15 days'
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'Trabajo en Equipo',
        'soft_skills',
        5,
        true,
        NOW() - INTERVAL '12 days'
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'Resolución de Problemas',
        'soft_skills',
        4,
        false,
        NOW() - INTERVAL '10 days'
    ),
    (
        travis_user_id,
        'travis@nuanu.com',
        'Creatividad',
        'soft_skills',
        5,
        true,
        NOW() - INTERVAL '10 days'
    )
    ON CONFLICT (user_email, skill_name) DO NOTHING;

END $$;

-- Insertar documentos de la base de conocimiento
INSERT INTO knowledge_base_documents (
    title,
    slug,
    content,
    category,
    tags,
    author,
    created_at,
    is_published
) VALUES 
(
    'Especificación Técnica DTC 1.5',
    'especificacion-tecnica-dtc-15',
    'Documento técnico completo con la arquitectura, funcionalidades y especificaciones técnicas de la plataforma DespegaTuCarrera 1.5. Incluye detalles sobre la implementación de tests psicométricos, generación de CV con IA, simulación de entrevistas y sistema de coaching personalizado.',
    'Técnico',
    ARRAY['arquitectura', 'especificaciones', 'técnico', 'desarrollo'],
    'Equipo DTC',
    NOW(),
    true
),
(
    'Guía de Inicio DTC',
    'guia-inicio-dtc',
    'Guía completa para nuevos usuarios de DespegaTuCarrera. Incluye primeros pasos, configuración inicial, cómo completar tu perfil, realizar tests psicométricos y maximizar tu experiencia en la plataforma.',
    'Guía',
    ARRAY['inicio', 'tutorial', 'primeros-pasos', 'configuración'],
    'Equipo DTC',
    NOW(),
    true
),
(
    'Guía de Carreras Chile',
    'guia-carreras-chile',
    'Información detallada del mercado laboral chileno, incluyendo salarios promedio por industria, oportunidades de crecimiento, tendencias del mercado y consejos específicos para profesionales en Chile.',
    'Mercado',
    ARRAY['chile', 'mercado-laboral', 'salarios', 'carreras'],
    'Equipo DTC',
    NOW(),
    true
),
(
    'Módulos Psicométricos',
    'modulos-psicometricos',
    'Documentación completa sobre los tests psicométricos disponibles: DISC, Big Five, MBTI, RIASEC, Habilidades Blandas e Inteligencias Múltiples. Incluye interpretación de resultados y aplicaciones prácticas.',
    'Psicometría',
    ARRAY['tests', 'psicometría', 'personalidad', 'evaluación'],
    'Equipo DTC',
    NOW(),
    true
),
(
    'CV Generator & Entrevistas',
    'cv-generator-entrevistas',
    'Guía completa sobre las herramientas inteligentes para generación de CV y simulación de entrevistas con IA. Incluye mejores prácticas, optimización ATS y técnicas de preparación para entrevistas.',
    'Herramientas',
    ARRAY['cv', 'entrevistas', 'ia', 'herramientas'],
    'Equipo DTC',
    NOW(),
    true
),
(
    'Biblioteca de Habilidades & Coach IA',
    'biblioteca-habilidades-coach-ia',
    'Catálogo completo de habilidades profesionales, sistema de coaching con IA y filosofías de mentores reconocidos como Bill Campbell, Carol Dweck y Naval Ravikant.',
    'IA & Skills',
    ARRAY['habilidades', 'coaching', 'ia', 'mentores'],
    'Equipo DTC',
    NOW(),
    true
),
(
    'Progreso, Gamificación & Integraciones',
    'progreso-gamificacion-integraciones',
    'Sistema completo de seguimiento de progreso, gamificación inteligente con XP y logros, e integraciones con plataformas externas como LinkedIn, GitHub y sistemas ATS.',
    'Gamificación',
    ARRAY['progreso', 'gamificación', 'xp', 'integraciones'],
    'Equipo DTC',
    NOW(),
    true
),
(
    'Recursos Adicionales',
    'recursos-adicionales',
    'Información complementaria, casos de uso, estudios de caso de usuarios exitosos, recursos de desarrollo profesional y enlaces a herramientas externas recomendadas.',
    'Recursos',
    ARRAY['recursos', 'casos-uso', 'desarrollo-profesional', 'herramientas'],
    'Equipo DTC',
    NOW(),
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Verificar que todos los datos se insertaron correctamente
SELECT 'User Profile' as table_name, COUNT(*) as count FROM user_profiles WHERE email = 'travis@nuanu.com'
UNION ALL
SELECT 'Test Results' as table_name, COUNT(*) as count FROM test_results WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'User Activities' as table_name, COUNT(*) as count FROM user_activities WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'Interview Simulations' as table_name, COUNT(*) as count FROM interview_simulations WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'Generated CVs' as table_name, COUNT(*) as count FROM generated_cvs WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'User Achievements' as table_name, COUNT(*) as count FROM user_achievements WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'User Skills' as table_name, COUNT(*) as count FROM user_skills WHERE user_email = 'travis@nuanu.com'
UNION ALL
SELECT 'Knowledge Base' as table_name, COUNT(*) as count FROM knowledge_base_documents;

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
WHERE up.email = 'travis@nuanu.com'
GROUP BY up.id, up.name, up.email, up.profile_completion_percentage, up.total_xp, up.current_level, up.tests_completed, up.cv_generated, up.interview_simulations;
