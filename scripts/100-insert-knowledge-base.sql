-- Insertar documentos de la base de conocimiento
INSERT INTO knowledge_base_documents (
    id,
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
    uuid_generate_v4(),
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
    uuid_generate_v4(),
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
    uuid_generate_v4(),
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
    uuid_generate_v4(),
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
    uuid_generate_v4(),
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
    uuid_generate_v4(),
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
    uuid_generate_v4(),
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
    uuid_generate_v4(),
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

-- Verificar que los documentos se insertaron correctamente
SELECT 
    title,
    category,
    array_length(tags, 1) as tag_count,
    created_at
FROM knowledge_base_documents 
ORDER BY created_at DESC;
