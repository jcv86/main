-- Configuración simple de base de datos

-- Limpiar datos existentes si es necesario
TRUNCATE TABLE user_activities CASCADE;
TRUNCATE TABLE test_results CASCADE;
TRUNCATE TABLE user_profiles CASCADE;
TRUNCATE TABLE knowledge_base CASCADE;

-- Recrear usuario Travis con datos completos
INSERT INTO user_profiles (
    email, full_name, current_level, total_xp, tests_completed, documents_read, skills_learned, career_goal
) VALUES (
    'travis@example.com', 'Travis Johnson', 3, 275, 2, 8, 12, 'Convertirme en líder de equipo en tecnología'
);

-- Insertar resultado DISC para Travis
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
        "strengths": ["Comunicación efectiva", "Motivación de equipos", "Adaptabilidad", "Creatividad"],
        "development_areas": ["Atención al detalle", "Planificación a largo plazo", "Seguimiento de tareas"],
        "communication_style": "Expresivo, entusiasta y persuasivo. Disfruta de la interacción social.",
        "leadership_style": "Liderazgo inspiracional y participativo. Motiva a través del ejemplo.",
        "work_preferences": ["Trabajo en equipo", "Ambiente dinámico", "Interacción social"],
        "career_recommendations": ["Marketing", "Recursos Humanos", "Ventas", "Capacitación"],
        "detailed_analysis": "Tu perfil DISC muestra una fuerte orientación hacia la influencia con elementos de dominancia. Esta combinación te convierte en un comunicador natural con capacidad de liderazgo."
    }',
    85,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    12
);

-- Insertar actividades para Travis
INSERT INTO user_activities (user_email, activity_type, activity_description, xp_earned) VALUES
('travis@example.com', 'test_completed', 'Completaste el test DISC con análisis IA', 25),
('travis@example.com', 'document_read', 'Leíste: Guía de Liderazgo Efectivo', 10),
('travis@example.com', 'skill_learned', 'Aprendiste: Comunicación Asertiva', 15),
('travis@example.com', 'level_up', 'Subiste al nivel 3', 50);

-- Insertar contenido en knowledge_base
INSERT INTO knowledge_base (title, category, content, author, read_count) VALUES
('Guía Completa del Test DISC', 'Evaluaciones', 'El test DISC evalúa cuatro dimensiones del comportamiento...', 'Dr. María González', 45),
('Desarrollo de Liderazgo', 'Liderazgo', 'El liderazgo moderno requiere habilidades técnicas y emocionales...', 'Carlos Mendoza', 32),
('Comunicación Efectiva', 'Comunicación', 'La comunicación efectiva es clave para el éxito profesional...', 'Ana Rodríguez', 28);

SELECT 'Base de datos configurada exitosamente' as status;
