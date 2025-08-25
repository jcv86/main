-- Insertar datos finales para Travis con estructura correcta

-- Insertar Travis en user_profiles
INSERT INTO user_profiles (
    email, full_name, current_level, total_xp, tests_completed, documents_read, skills_learned, career_goal
) VALUES (
    'travis@example.com',
    'Travis Johnson', 
    3, 
    275, 
    2, 
    8, 
    12, 
    'Convertirme en líder de equipo en tecnología'
);

-- Insertar resultado DISC completo para Travis
INSERT INTO test_results (
    user_email, test_type, test_name, results, score, completed_at, duration_minutes
) VALUES (
    'travis@example.com',
    'personality',
    'DISC',
    '{
        "primary_type": "Influence",
        "secondary_type": "Dominance",
        "scores": {"D": 75, "I": 85, "S": 45, "C": 35},
        "strengths": [
            "Comunicación efectiva y persuasiva",
            "Motivación natural de equipos", 
            "Adaptabilidad y flexibilidad",
            "Creatividad e innovación",
            "Networking y relaciones interpersonales"
        ],
        "development_areas": [
            "Atención al detalle en tareas complejas",
            "Planificación a largo plazo",
            "Seguimiento sistemático de proyectos",
            "Paciencia con procesos lentos"
        ],
        "communication_style": "Tu estilo de comunicación es expresivo, entusiasta y altamente persuasivo. Disfrutas de la interacción social y tienes una habilidad natural para inspirar y motivar a otros.",
        "leadership_style": "Tu estilo de liderazgo es inspiracional y participativo. Motivas a través del ejemplo personal y la comunicación positiva.",
        "work_preferences": [
            "Ambiente colaborativo con mucha interacción social",
            "Flexibilidad en horarios y métodos de trabajo", 
            "Oportunidades para presentar ideas y proyectos",
            "Reconocimiento público de logros"
        ],
        "career_recommendations": [
            "Marketing y Comunicaciones",
            "Ventas y Desarrollo de Negocios",
            "Recursos Humanos",
            "Relaciones Públicas",
            "Capacitación y Desarrollo"
        ],
        "detailed_analysis": "Tu perfil DISC muestra una fuerte orientación hacia la influencia con elementos significativos de dominancia. Esta combinación te convierte en un comunicador natural con capacidad de liderazgo efectivo.",
        "ai_insights": {
            "personality_summary": "Eres una persona naturalmente carismática con un don especial para inspirar y motivar a otros. Tu combinación de influencia y dominancia te convierte en un líder nato.",
            "career_fit_score": 92,
            "leadership_potential": 88,
            "team_compatibility": ["Tipos S para estabilidad", "Tipos C para análisis", "Otros tipos I para creatividad"],
            "stress_indicators": ["Trabajo aislado", "Ambientes muy estructurados", "Críticas públicas"],
            "growth_recommendations": ["Desarrollar seguimiento sistemático", "Mejorar planificación a largo plazo", "Fortalecer análisis de datos"],
            "ideal_work_environment": "Ambiente colaborativo y dinámico con espacios abiertos que fomenten la comunicación espontánea.",
            "communication_tips": ["Estructurar presentaciones con datos", "Practicar escucha activa", "Ser más específico en instrucciones"]
        }
    }',
    85,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    12
);

-- Insertar actividades para Travis
INSERT INTO user_activities (user_email, activity_type, activity_description, xp_earned, created_at) VALUES
('travis@example.com', 'test_completed', 'Completaste el test DISC con análisis IA avanzado', 25, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('travis@example.com', 'document_read', 'Leíste: Guía Completa de Liderazgo Efectivo', 10, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('travis@example.com', 'skill_learned', 'Aprendiste: Comunicación Asertiva y Persuasiva', 15, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('travis@example.com', 'level_up', 'Subiste al nivel 3 - ¡Felicitaciones!', 50, CURRENT_TIMESTAMP - INTERVAL '4 days'),
('travis@example.com', 'document_read', 'Leíste: Inteligencia Emocional en el Trabajo', 10, CURRENT_TIMESTAMP - INTERVAL '5 days');

-- Insertar contenido en knowledge_base
INSERT INTO knowledge_base (title, category, content, author, read_count, created_at) VALUES
(
    'Guía Completa del Test DISC',
    'Evaluaciones',
    'El test DISC es una herramienta de evaluación psicométrica que mide cuatro dimensiones principales del comportamiento: Dominancia (D), Influencia (I), Estabilidad (S) y Conciencia (C). Esta guía completa te ayudará a entender cómo interpretar tus resultados y aplicarlos efectivamente en tu desarrollo profesional y liderazgo.',
    'Dr. María González',
    45,
    CURRENT_TIMESTAMP - INTERVAL '10 days'
),
(
    'Desarrollo de Liderazgo en el Siglo XXI',
    'Liderazgo', 
    'El liderazgo moderno requiere una combinación única de habilidades técnicas, emocionales y estratégicas. En esta guía exploramos las competencias clave que todo líder debe desarrollar para ser efectivo en el entorno empresarial actual, incluyendo inteligencia emocional, comunicación efectiva y gestión del cambio.',
    'Carlos Mendoza',
    32,
    CURRENT_TIMESTAMP - INTERVAL '15 days'
),
(
    'Comunicación Efectiva en Equipos Remotos',
    'Comunicación',
    'La comunicación en equipos remotos presenta desafíos únicos que requieren estrategias específicas. Aprende técnicas probadas para mantener la cohesión del equipo, facilitar reuniones efectivas y construir relaciones sólidas a distancia en el mundo del trabajo híbrido.',
    'Ana Rodríguez',
    28,
    CURRENT_TIMESTAMP - INTERVAL '20 days'
),
(
    'Planificación de Carrera Profesional',
    'Desarrollo',
    'Una carrera exitosa no sucede por accidente. Requiere planificación estratégica, autoconocimiento y la capacidad de adaptarse a los cambios del mercado laboral. Esta guía te proporciona un marco estructurado para diseñar tu trayectoria profesional y alcanzar tus objetivos.',
    'Roberto Silva',
    51,
    CURRENT_TIMESTAMP - INTERVAL '25 days'
),
(
    'Inteligencia Emocional en el Trabajo',
    'Habilidades Blandas',
    'La inteligencia emocional es fundamental para el éxito profesional. Aprende a reconocer y gestionar tus emociones, desarrollar empatía y construir relaciones interpersonales sólidas que impulsen tu carrera y mejoren tu efectividad como líder.',
    'Dra. Laura Martín',
    39,
    CURRENT_TIMESTAMP - INTERVAL '30 days'
);

-- Insertar usuario demo adicional
INSERT INTO user_profiles (
    email, full_name, current_level, total_xp, tests_completed, documents_read, skills_learned, career_goal
) VALUES (
    'demo@example.com',
    'Usuario Demo',
    1,
    50,
    1,
    3,
    5,
    'Explorar todas las funcionalidades de la plataforma'
);

SELECT 'Datos completos de Travis y contenido insertados exitosamente' as status;
