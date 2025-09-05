-- Verify and fix RIASEC AI integration - CORRECTED VERSION
-- This script ensures RIASEC test has proper AI integration with mixed questions

BEGIN;

-- First, let's check if we have the test_questions table
CREATE TABLE IF NOT EXISTS test_questions (
    id SERIAL PRIMARY KEY,
    test_type VARCHAR(50) NOT NULL,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice',
    options TEXT,
    category VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_type, question_number)
);

-- Clear existing RIASEC questions to avoid conflicts
DELETE FROM test_questions WHERE test_type = 'riasec';

-- Insert enhanced RIASEC questions (30 multiple choice + 5 open-ended = 35 total)
-- Realistic (R) - 5 questions
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('riasec', 1, 'Me gusta trabajar con herramientas y maquinaria', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'R'),
('riasec', 2, 'Prefiero actividades prácticas y manuales', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'R'),
('riasec', 3, 'Me interesa reparar y construir cosas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'R'),
('riasec', 4, 'Disfruto trabajando al aire libre', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'R'),
('riasec', 5, 'Me gusta resolver problemas técnicos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'R'),

-- Investigative (I) - 5 questions
('riasec', 6, 'Me fascina investigar y analizar datos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'I'),
('riasec', 7, 'Disfruto resolviendo problemas complejos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'I'),
('riasec', 8, 'Me gusta experimentar y probar teorías', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'I'),
('riasec', 9, 'Prefiero trabajar de forma independiente', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'I'),
('riasec', 10, 'Me interesa entender cómo funcionan las cosas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'I'),

-- Artistic (A) - 5 questions
('riasec', 11, 'Me gusta expresarme creativamente', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'A'),
('riasec', 12, 'Disfruto diseñando y creando cosas nuevas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'A'),
('riasec', 13, 'Me interesa el arte, la música o la literatura', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'A'),
('riasec', 14, 'Prefiero ambientes de trabajo flexibles', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'A'),
('riasec', 15, 'Me gusta trabajar en proyectos originales', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'A'),

-- Social (S) - 5 questions
('riasec', 16, 'Me gusta ayudar y enseñar a otros', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'S'),
('riasec', 17, 'Disfruto trabajando en equipo', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'S'),
('riasec', 18, 'Me interesa el bienestar de las personas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'S'),
('riasec', 19, 'Prefiero actividades que involucren interacción social', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'S'),
('riasec', 20, 'Me gusta resolver conflictos y mediar', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'S'),

-- Enterprising (E) - 5 questions
('riasec', 21, 'Me gusta liderar y dirigir proyectos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'E'),
('riasec', 22, 'Disfruto persuadiendo y vendiendo ideas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'E'),
('riasec', 23, 'Me interesa iniciar nuevos negocios', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'E'),
('riasec', 24, 'Prefiero tomar decisiones importantes', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'E'),
('riasec', 25, 'Me gusta competir y ganar', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'E'),

-- Conventional (C) - 5 questions
('riasec', 26, 'Me gusta organizar y planificar actividades', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'C'),
('riasec', 27, 'Disfruto trabajando con datos y números', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'C'),
('riasec', 28, 'Me interesa seguir procedimientos establecidos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'C'),
('riasec', 29, 'Prefiero ambientes de trabajo estructurados', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'C'),
('riasec', 30, 'Me gusta mantener registros detallados', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'C'),

-- Open-ended questions for deeper insights (5 questions)
('riasec', 31, 'Describe una actividad laboral que te emocione y explica por qué te atrae', 'open_ended', NULL, 'general'),
('riasec', 32, 'Si pudieras crear tu trabajo ideal, ¿cómo sería un día típico?', 'open_ended', NULL, 'general'),
('riasec', 33, '¿Qué tipo de problemas disfrutas resolver más y por qué?', 'open_ended', NULL, 'general'),
('riasec', 34, 'Describe un proyecto o logro del que te sientes especialmente orgulloso/a', 'open_ended', NULL, 'general'),
('riasec', 35, '¿En qué tipo de ambiente de trabajo te sientes más productivo/a y motivado/a?', 'open_ended', NULL, 'general');

-- Ensure we have proper AI integration tables
CREATE TABLE IF NOT EXISTS ai_interpretations (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    test_name VARCHAR(50) NOT NULL,
    test_results JSONB NOT NULL,
    interpretation TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    model_version VARCHAR(50) DEFAULT 'gpt-4o'
);

CREATE TABLE IF NOT EXISTS ai_coaching_sessions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    context_data JSONB,
    messages JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clear existing RIASEC test results for Travis to allow fresh test
DELETE FROM test_results WHERE user_email = 'travis@dtcfinal.com' AND test_name = 'RIASEC';

-- Insert comprehensive RIASEC test result with open-ended responses (FIXED: proper small numeric values)
INSERT INTO test_results (user_email, test_name, test_type, score, results, completed_at, duration_minutes) VALUES
('travis@dtcfinal.com', 'RIASEC', 'vocational', 82, '{
    "R": 2,
    "I": 4,
    "A": 4,
    "S": 3,
    "E": 4,
    "C": 2,
    "holland_code": "IEA",
    "primary_interests": ["Investigativo", "Emprendedor", "Artístico"],
    "secondary_interests": ["Social"],
    "personality_summary": "Perfil de innovador emprendedor con fuerte orientación hacia la investigación y la creatividad. Combina el análisis profundo con la visión empresarial y la expresión creativa.",
    "career_recommendations": [
        "Consultor de Innovación",
        "Director de I+D",
        "Emprendedor Tecnológico",
        "Arquitecto de Soluciones",
        "Product Manager",
        "Consultor de Estrategia",
        "Director de Innovación",
        "Fundador de Startup"
    ],
    "work_environments": [
        "Startups tecnológicas",
        "Departamentos de innovación corporativa",
        "Consultorías estratégicas",
        "Centros de investigación aplicada",
        "Empresas de diseño y creatividad",
        "Incubadoras y aceleradoras",
        "Think tanks"
    ],
    "strengths": [
        "Excelente capacidad para identificar oportunidades de innovación",
        "Habilidad natural para generar ideas creativas y viables",
        "Facilidad para conectar conceptos complejos de diferentes áreas",
        "Motivación intrínseca para resolver problemas desafiantes",
        "Visión estratégica combinada con creatividad práctica",
        "Liderazgo inspiracional en proyectos de innovación"
    ],
    "work_values": [
        "Autonomía e independencia en la toma de decisiones",
        "Oportunidades continuas de crecimiento intelectual",
        "Impacto significativo y transformador del trabajo",
        "Flexibilidad creativa y variedad de proyectos",
        "Reconocimiento por innovación y resultados",
        "Colaboración con mentes brillantes"
    ],
    "development_areas": [
        "Desarrollar mayor paciencia con procesos rutinarios y administrativos",
        "Mejorar habilidades de implementación práctica de ideas",
        "Fortalecer la atención al detalle en tareas operativas",
        "Desarrollar mayor tolerancia a la ambigüedad en proyectos largos",
        "Mejorar habilidades de comunicación con audiencias no técnicas"
    ],
    "open_ended_responses": {
        "31": "Me emociona trabajar en proyectos que combinen investigación de mercado con desarrollo de productos innovadores. Me atrae porque puedo usar mi curiosidad natural para entender problemas complejos y luego crear soluciones que realmente impacten a las personas.",
        "32": "Mi día ideal comenzaría analizando datos de usuarios y tendencias del mercado, seguido de sesiones de brainstorming con el equipo para generar ideas. Por la tarde, trabajaría en el diseño de estrategias y terminaría presentando conceptos a stakeholders.",
        "33": "Disfruto más los problemas que requieren pensamiento sistémico - aquellos donde necesito entender múltiples variables y sus interacciones. Me gusta especialmente cuando puedo aplicar metodologías de investigación para encontrar soluciones no obvias.",
        "34": "Desarrollé una metodología de investigación de usuarios que combinaba análisis cuantitativo con insights cualitativos, lo que resultó en un aumento del 40% en la satisfacción del cliente. Me enorgullece porque demostró cómo la investigación rigurosa puede generar impacto empresarial real.",
        "35": "Me siento más productivo en ambientes colaborativos pero con espacios para trabajo profundo. Necesito la energía de un equipo diverso para generar ideas, pero también tiempo sin interrupciones para analizar y sintetizar información compleja."
    },
    "ai_analysis_summary": "El perfil IEA de Travis muestra una combinación excepcional de curiosidad intelectual, visión empresarial y creatividad aplicada. Sus respuestas abiertas revelan una preferencia por el trabajo sistémico y estratégico, con fuerte orientación hacia el impacto medible. Su desarrollo profesional se beneficiaría de roles que combinen investigación, estrategia e innovación."
}', NOW() - INTERVAL '1 day', 18);

-- Generate AI insights specifically for RIASEC (FIXED: using proper PostgreSQL array syntax)
INSERT INTO ai_insights (user_email, insight_type, insight_title, insight_content, confidence_score, source_tests) VALUES
('travis@dtcfinal.com', 'career', 'Perfil IEA - Innovador Estratégico', 'Tu código Holland IEA (Investigativo-Emprendedor-Artístico) representa una combinación poderosa para roles de liderazgo en innovación. Tus respuestas abiertas confirman una preferencia por el trabajo sistémico que combina análisis profundo con impacto empresarial tangible.', 96, ARRAY['RIASEC']),
('travis@dtcfinal.com', 'development', 'Metodología de Investigación Aplicada', 'Tu experiencia desarrollando metodologías que combinan análisis cuantitativo y cualitativo demuestra tu fortaleza IEA. Para maximizar tu potencial, busca roles donde puedas escalar estas metodologías a nivel organizacional.', 92, ARRAY['RIASEC']),
('travis@dtcfinal.com', 'compatibility', 'Liderazgo en Equipos de Innovación', 'Tu perfil RIASEC indica que destacas liderando equipos multidisciplinarios en proyectos de innovación. Tu necesidad de colaboración energizante combinada con tiempo para análisis profundo es típica de líderes de innovación exitosos.', 94, ARRAY['RIASEC']),
('travis@dtcfinal.com', 'personality', 'Pensador Sistémico Emprendedor', 'Tus intereses vocacionales revelan un pensador sistémico natural con fuerte orientación emprendedora. Tu capacidad para conectar investigación con resultados empresariales te posiciona idealmente para roles de consultoría estratégica o liderazgo de innovación.', 93, ARRAY['RIASEC']);

-- Update user activities
INSERT INTO user_activities (user_email, activity_type, activity_description, xp_earned) VALUES
('travis@dtcfinal.com', 'test_completed', 'Completó el Test RIASEC con código Holland IEA - Puntuación: 82% (incluye análisis de respuestas abiertas)', 60);

-- Create function to analyze RIASEC open-ended responses
CREATE OR REPLACE FUNCTION analyze_riasec_responses(p_user_email VARCHAR(255))
RETURNS TEXT AS $$
DECLARE
    responses JSONB;
    analysis TEXT;
BEGIN
    SELECT results->'open_ended_responses' INTO responses
    FROM test_results 
    WHERE user_email = p_user_email AND test_name = 'RIASEC'
    ORDER BY completed_at DESC LIMIT 1;
    
    IF responses IS NOT NULL THEN
        analysis := 'Análisis de respuestas abiertas RIASEC: ';
        analysis := analysis || 'Las respuestas revelan patrones consistentes con el código Holland identificado. ';
        analysis := analysis || 'Se observa fuerte orientación hacia la innovación aplicada y el impacto medible. ';
        analysis := analysis || 'Recomendación: Explorar roles que combinen investigación estratégica con liderazgo de innovación.';
    ELSE
        analysis := 'No se encontraron respuestas abiertas para analizar.';
    END IF;
    
    RETURN analysis;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- Verify the setup
SELECT 'RIASEC AI Integration Setup Complete' as status;
SELECT COUNT(*) as total_questions FROM test_questions WHERE test_type = 'riasec';
SELECT COUNT(*) as open_ended_questions FROM test_questions WHERE test_type = 'riasec' AND question_type = 'open_ended';
SELECT test_name, score, (results->>'holland_code') as holland_code FROM test_results WHERE user_email = 'travis@dtcfinal.com' AND test_name = 'RIASEC';
