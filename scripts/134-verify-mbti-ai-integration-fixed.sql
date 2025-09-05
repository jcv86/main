-- Verificar y crear estructura para MBTI con integración IA
DO $$
BEGIN
    -- Verificar si existe la columna question_type en test_questions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'test_questions' 
        AND column_name = 'question_type'
    ) THEN
        ALTER TABLE test_questions ADD COLUMN question_type VARCHAR(20) DEFAULT 'multiple_choice';
    END IF;

    -- Verificar si existe la columna dimension en test_questions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'test_questions' 
        AND column_name = 'dimension'
    ) THEN
        ALTER TABLE test_questions ADD COLUMN dimension VARCHAR(10);
    END IF;

    -- Verificar si existe la columna score_mapping en test_questions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'test_questions' 
        AND column_name = 'score_mapping'
    ) THEN
        ALTER TABLE test_questions ADD COLUMN score_mapping JSONB;
    END IF;

    -- Verificar si existe la columna category en test_questions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'test_questions' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE test_questions ADD COLUMN category VARCHAR(50) DEFAULT 'personality';
    END IF;
END $$;

-- Limpiar preguntas MBTI existentes
DELETE FROM test_questions WHERE test_type = 'mbti';

-- Insertar preguntas MBTI mejoradas (27 preguntas mixtas)
INSERT INTO test_questions (test_type, question_number, question_text, question_type, dimension, options, score_mapping, category) VALUES

-- Extraversion vs Introversion (E/I) - 7 preguntas
(
    'mbti', 1, 
    'En una reunión social, prefieres:', 
    'multiple_choice', 'EI',
    '["Conocer muchas personas nuevas", "Conversar profundamente con pocas personas"]',
    '{"A": "E", "B": "I"}',
    'personality'
),
(
    'mbti', 2, 
    'Cuando necesitas energía, prefieres:', 
    'multiple_choice', 'EI',
    '["Estar con otras personas", "Estar solo/a"]',
    '{"A": "E", "B": "I"}',
    'personality'
),
(
    'mbti', 3, 
    'En el trabajo, te sientes más cómodo:', 
    'multiple_choice', 'EI',
    '["Trabajando en equipo y colaborando", "Trabajando de forma independiente"]',
    '{"A": "E", "B": "I"}',
    'personality'
),
(
    'mbti', 4, 
    'Cuando tienes una idea nueva:', 
    'multiple_choice', 'EI',
    '["La compartes inmediatamente con otros", "La reflexionas internamente primero"]',
    '{"A": "E", "B": "I"}',
    'personality'
),
(
    'mbti', 5, 
    'En una presentación, prefieres:', 
    'multiple_choice', 'EI',
    '["Improvisar y interactuar con la audiencia", "Preparar todo detalladamente de antemano"]',
    '{"A": "E", "B": "I"}',
    'personality'
),
(
    'mbti', 6, 
    'En una reunión de lluvia de ideas:', 
    'multiple_choice', 'EI',
    '["Participas activamente y compartes ideas en voz alta", "Escuchas primero y contribuyes cuando tienes algo bien pensado"]',
    '{"A": "E", "B": "I"}',
    'personality'
),
(
    'mbti', 7, 
    'Describe una situación donde te sentiste más energizado/a en el trabajo y explica por qué:', 
    'open_ended', 'EI',
    '[]',
    '{}',
    'personality'
),

-- Sensing vs Intuition (S/N) - 7 preguntas
(
    'mbti', 8, 
    'Al resolver problemas, confías más en:', 
    'multiple_choice', 'SN',
    '["Experiencia práctica y hechos concretos", "Intuición y posibilidades futuras"]',
    '{"A": "S", "B": "N"}',
    'personality'
),
(
    'mbti', 9, 
    'Prefieres trabajar con:', 
    'multiple_choice', 'SN',
    '["Datos específicos y detalles precisos", "Conceptos generales y el panorama completo"]',
    '{"A": "S", "B": "N"}',
    'personality'
),
(
    'mbti', 10, 
    'Al aprender algo nuevo:', 
    'multiple_choice', 'SN',
    '["Prefieres ejemplos prácticos y aplicaciones", "Te interesan las teorías y conceptos abstractos"]',
    '{"A": "S", "B": "N"}',
    'personality'
),
(
    'mbti', 11, 
    'En una conversación, tiendes a:', 
    'multiple_choice', 'SN',
    '["Enfocarte en hechos y experiencias reales", "Explorar ideas y posibilidades futuras"]',
    '{"A": "S", "B": "N"}',
    'personality'
),
(
    'mbti', 12, 
    'Cuando planificas un proyecto:', 
    'multiple_choice', 'SN',
    '["Te enfocas en pasos concretos y recursos", "Visualizas el resultado final y las oportunidades"]',
    '{"A": "S", "B": "N"}',
    'personality'
),
(
    'mbti', 13, 
    'Al enfrentar un problema complejo:', 
    'multiple_choice', 'SN',
    '["Buscas soluciones que han funcionado antes", "Exploras enfoques completamente nuevos"]',
    '{"A": "S", "B": "N"}',
    'personality'
),
(
    'mbti', 14, 
    'Describe cómo abordas típicamente un proyecto nuevo desde el inicio hasta la finalización:', 
    'open_ended', 'SN',
    '[]',
    '{}',
    'personality'
),

-- Thinking vs Feeling (T/F) - 7 preguntas
(
    'mbti', 15, 
    'Al tomar decisiones importantes:', 
    'multiple_choice', 'TF',
    '["Analizas lógicamente pros y contras", "Consideras el impacto en las personas"]',
    '{"A": "T", "B": "F"}',
    'personality'
),
(
    'mbti', 16, 
    'Valoras más:', 
    'multiple_choice', 'TF',
    '["La justicia y la objetividad", "La armonía y la comprensión"]',
    '{"A": "T", "B": "F"}',
    'personality'
),
(
    'mbti', 17, 
    'En un conflicto, tiendes a:', 
    'multiple_choice', 'TF',
    '["Buscar la solución más lógica", "Considerar los sentimientos de todos"]',
    '{"A": "T", "B": "F"}',
    'personality'
),
(
    'mbti', 18, 
    'Cuando das feedback:', 
    'multiple_choice', 'TF',
    '["Eres directo y te enfocas en los hechos", "Eres diplomático y consideras las emociones"]',
    '{"A": "T", "B": "F"}',
    'personality'
),
(
    'mbti', 19, 
    'En el trabajo, priorizas:', 
    'multiple_choice', 'TF',
    '["La eficiencia y los resultados", "Las relaciones y el bienestar del equipo"]',
    '{"A": "T", "B": "F"}',
    'personality'
),
(
    'mbti', 20, 
    'Si un colega comete un error:', 
    'multiple_choice', 'TF',
    '["Le señalas el error directamente para corregirlo", "Buscas una forma gentil de ayudarle a mejorar"]',
    '{"A": "T", "B": "F"}',
    'personality'
),
(
    'mbti', 21, 
    'Describe una situación donde tuviste que tomar una decisión difícil que afectaba a otras personas. ¿Cómo la abordaste?', 
    'open_ended', 'TF',
    '[]',
    '{}',
    'personality'
),

-- Judging vs Perceiving (J/P) - 6 preguntas
(
    'mbti', 22, 
    'Prefieres un ambiente de trabajo:', 
    'multiple_choice', 'JP',
    '["Estructurado con plazos claros", "Flexible y adaptable"]',
    '{"A": "J", "B": "P"}',
    'personality'
),
(
    'mbti', 23, 
    'Al planificar vacaciones:', 
    'multiple_choice', 'JP',
    '["Organizas todo con anticipación", "Prefieres improvisar sobre la marcha"]',
    '{"A": "J", "B": "P"}',
    'personality'
),
(
    'mbti', 24, 
    'En tu escritorio o espacio de trabajo:', 
    'multiple_choice', 'JP',
    '["Todo está organizado y en su lugar", "Tienes un caos organizado que funciona"]',
    '{"A": "J", "B": "P"}',
    'personality'
),
(
    'mbti', 25, 
    'Cuando trabajas en un proyecto:', 
    'multiple_choice', 'JP',
    '["Prefieres completar tareas una por una", "Te gusta trabajar en varias cosas a la vez"]',
    '{"A": "J", "B": "P"}',
    'personality'
),
(
    'mbti', 26, 
    'Ante los cambios inesperados:', 
    'multiple_choice', 'JP',
    '["Te sientes incómodo y prefieres estabilidad", "Los ves como oportunidades emocionantes"]',
    '{"A": "J", "B": "P"}',
    'personality'
),
(
    'mbti', 27, 
    'Describe tu enfoque ideal para organizar y gestionar tu tiempo de trabajo. ¿Qué métodos o sistemas prefieres usar?', 
    'open_ended', 'JP',
    '[]',
    '{}',
    'personality'
);

-- Limpiar resultados MBTI existentes para Travis
DELETE FROM test_results WHERE user_email = 'travis@example.com' AND test_name = 'MBTI';

-- Insertar datos de prueba para Travis
INSERT INTO test_results (
    user_email, 
    test_type, 
    test_name, 
    test_category, 
    results, 
    score, 
    duration_minutes, 
    completed_at
) VALUES (
    'travis@example.com',
    'personality',
    'MBTI',
    'personality',
    '{
        "type": "ENFP",
        "type_name": "El Activista",
        "type_description": "Entusiasta, creativo y sociable. Siempre busca nuevas posibilidades y conexiones entre ideas y personas.",
        "scores": {
            "E": 18, "I": 9,
            "S": 8, "N": 19,
            "T": 11, "F": 16,
            "J": 9, "P": 18
        },
        "dominant_function": "Intuición Extrovertida (Ne)",
        "auxiliary_function": "Sentimiento Introvertido (Fi)",
        "tertiary_function": "Pensamiento Extrovertido (Te)",
        "inferior_function": "Sensación Introvertida (Si)",
        "traits": ["Entusiasta", "Creativo", "Empático", "Flexible", "Inspirador"],
        "strengths": [
            "Excelente capacidad para generar ideas innovadoras",
            "Habilidad natural para motivar e inspirar a otros",
            "Adaptabilidad y flexibilidad ante cambios",
            "Fuerte empatía y comprensión interpersonal",
            "Visión optimista y orientada al futuro"
        ],
        "challenges": [
            "Tendencia a procrastinar en tareas rutinarias",
            "Dificultad para mantener el foco en proyectos a largo plazo",
            "Puede ser demasiado sensible a las críticas",
            "Tendencia a sobrecomprometerse con múltiples proyectos"
        ],
        "career_recommendations": [
            "Consultor de Innovación",
            "Director Creativo",
            "Coach de Vida",
            "Psicólogo Organizacional",
            "Emprendedor Social",
            "Facilitador de Cambio"
        ],
        "famous_people": ["Robin Williams", "Ellen DeGeneres", "Walt Disney", "Mark Twain"],
        "compatibility": {
            "best_matches": ["INTJ", "INFJ", "ENFJ"],
            "challenging_matches": ["ISTJ", "ESTJ", "ISFJ"]
        },
        "development_areas": [
            "Mejorar habilidades de planificación y organización",
            "Desarrollar mayor tolerancia a la rutina",
            "Fortalecer la capacidad de seguimiento en proyectos",
            "Aprender a manejar mejor las críticas constructivas"
        ],
        "leadership_style": "Inspiracional y visionario, motiva a través del entusiasmo y la creatividad",
        "communication_style": "Expresivo, empático y orientado a las personas, prefiere conversaciones profundas y significativas",
        "open_responses": {
            "7": "Me siento más energizado cuando trabajo en proyectos colaborativos donde puedo intercambiar ideas con el equipo. Las sesiones de brainstorming me dan mucha energía.",
            "14": "Empiezo visualizando el resultado final y las posibilidades. Luego creo un plan flexible que me permita adaptarme sobre la marcha.",
            "21": "Cuando tuve que reestructurar mi equipo, primero hablé individualmente con cada persona para entender sus preocupaciones antes de tomar la decisión.",
            "27": "Prefiero usar herramientas visuales como Kanban boards y mantener flexibilidad en mi horario para poder adaptarme a nuevas oportunidades."
        }
    }',
    88,
    22,
    NOW() - INTERVAL '2 days'
);

-- Verificar que las tablas de IA existen
CREATE TABLE IF NOT EXISTS ai_interpretations (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    test_results JSONB NOT NULL,
    interpretation TEXT NOT NULL,
    generated_at TIMESTAMP DEFAULT NOW(),
    model_version VARCHAR(50) DEFAULT 'gpt-4'
);

CREATE TABLE IF NOT EXISTS ai_coaching_sessions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    context_data JSONB,
    messages JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_insights (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    insight_type VARCHAR(50) NOT NULL,
    insight_title VARCHAR(255) NOT NULL,
    insight_content TEXT NOT NULL,
    confidence_score INTEGER DEFAULT 80,
    source_tests TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Limpiar interpretación IA existente para Travis
DELETE FROM ai_interpretations WHERE user_email = 'travis@example.com' AND test_name = 'MBTI';

-- Insertar interpretación IA de ejemplo para Travis
INSERT INTO ai_interpretations (
    user_email,
    test_name,
    test_results,
    interpretation,
    generated_at,
    model_version
) VALUES (
    'travis@example.com',
    'MBTI',
    '{
        "type": "ENFP",
        "scores": {"E": 18, "I": 9, "S": 8, "N": 19, "T": 11, "F": 16, "J": 9, "P": 18}
    }',
    'Como ENFP, Travis muestra un perfil de personalidad altamente creativo y orientado a las personas. Su fuerte preferencia por la Intuición Extrovertida (Ne) como función dominante se refleja en su capacidad excepcional para generar ideas innovadoras y ver conexiones entre conceptos aparentemente no relacionados.

Las puntuaciones revelan un equilibrio interesante: mientras que su Extraversión (E=18) y Intuición (N=19) son muy marcadas, su preferencia por el Sentimiento (F=16) sobre el Pensamiento (T=11) indica que toma decisiones considerando principalmente el impacto humano. Su alta puntuación en Percepción (P=18) sugiere una preferencia natural por la flexibilidad y la adaptabilidad.

En el contexto profesional, Travis probablemente destaca en roles que requieren innovación, colaboración y visión estratégica. Su combinación de creatividad (N), orientación social (E) y flexibilidad (P) lo convierte en un catalizador natural de cambio organizacional. Sin embargo, debe ser consciente de su tendencia a dispersarse en múltiples proyectos y trabajar en desarrollar mayor estructura en su enfoque de trabajo.

Para su desarrollo profesional, recomiendo que Travis se enfoque en roles de liderazgo transformacional, consultoría de innovación o emprendimiento social, donde puede aprovechar al máximo sus fortalezas naturales mientras contribuye significativamente al crecimiento organizacional.',
    NOW() - INTERVAL '2 days',
    'gpt-4o'
);

SELECT 'MBTI AI integration setup completed successfully' as status;
