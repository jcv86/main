-- Verify and fix Big Five AI integration
-- This script ensures all components are ready for Big Five test with AI

-- First, let's check the current structure of test_questions table
-- and add the missing column if needed
DO $$ 
BEGIN
    -- Add competency_area column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'test_questions' AND column_name = 'competency_area') THEN
        ALTER TABLE test_questions ADD COLUMN competency_area VARCHAR(100);
    END IF;
    
    -- Add question_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'test_questions' AND column_name = 'question_type') THEN
        ALTER TABLE test_questions ADD COLUMN question_type VARCHAR(50) DEFAULT 'multiple_choice';
    END IF;
END $$;

-- Clear existing Big Five questions to avoid conflicts
DELETE FROM test_questions WHERE test_type = 'big-five';

-- Insert Big Five mixed questions (Likert + Open-ended)
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, competency_area, category) VALUES
-- Openness Questions (1-6)
('big-five', 1, 'Me gusta explorar nuevas ideas y conceptos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'openness', 'openness'),
('big-five', 2, '¿Cómo te describes en términos de creatividad e innovación? Describe una situación donde hayas aplicado tu creatividad.', 'open_ended', NULL, 'openness', 'openness'),
('big-five', 3, 'Disfruto de actividades artísticas y creativas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'openness', 'openness'),
('big-five', 4, 'Prefiero seguir rutinas establecidas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'openness', 'openness'),
('big-five', 5, 'Me interesa aprender sobre diferentes culturas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'openness', 'openness'),
('big-five', 6, 'Tengo una imaginación muy activa', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'openness', 'openness'),

-- Conscientiousness Questions (7-12)
('big-five', 7, 'Siempre cumplo con mis compromisos y plazos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'conscientiousness', 'conscientiousness'),
('big-five', 8, '¿Qué tan organizado eres en tu vida diaria y trabajo? Describe tu sistema de organización personal.', 'open_ended', NULL, 'conscientiousness', 'conscientiousness'),
('big-five', 9, 'Soy muy organizado en mi trabajo y vida personal', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'conscientiousness', 'conscientiousness'),
('big-five', 10, 'A menudo dejo las cosas para el último minuto', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'conscientiousness', 'conscientiousness'),
('big-five', 11, 'Presto atención a los detalles importantes', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'conscientiousness', 'conscientiousness'),
('big-five', 12, 'Tengo autodisciplina para completar tareas difíciles', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'conscientiousness', 'conscientiousness'),

-- Extraversion Questions (13-18)
('big-five', 13, 'Me siento energizado cuando estoy con otras personas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'extraversion', 'extraversion'),
('big-five', 14, '¿Cómo te sientes en situaciones sociales y de liderazgo? Describe tu estilo de interacción.', 'open_ended', NULL, 'extraversion', 'extraversion'),
('big-five', 15, 'Prefiero trabajar solo que en equipo', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'extraversion', 'extraversion'),
('big-five', 16, 'Soy el alma de las fiestas y reuniones sociales', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'extraversion', 'extraversion'),
('big-five', 17, 'Me gusta ser el centro de atención', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'extraversion', 'extraversion'),
('big-five', 18, 'Inicio conversaciones con extraños fácilmente', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'extraversion', 'extraversion'),

-- Agreeableness Questions (19-24)
('big-five', 19, 'Siempre trato de ayudar a otros cuando puedo', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'agreeableness', 'agreeableness'),
('big-five', 20, '¿Cómo manejas los conflictos y la cooperación con otros? Describe tu enfoque.', 'open_ended', NULL, 'agreeableness', 'agreeableness'),
('big-five', 21, 'Confío en las buenas intenciones de las personas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'agreeableness', 'agreeableness'),
('big-five', 22, 'Puedo ser bastante competitivo y agresivo', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'agreeableness', 'agreeableness'),
('big-five', 23, 'Me preocupo genuinamente por el bienestar de otros', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'agreeableness', 'agreeableness'),
('big-five', 24, 'Prefiero cooperar que competir', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'agreeableness', 'agreeableness'),

-- Neuroticism Questions (25-30)
('big-five', 25, 'Me preocupo frecuentemente por cosas pequeñas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'neuroticism', 'neuroticism'),
('big-five', 26, '¿Cómo respondes al estrés y la presión? Describe tus estrategias de manejo.', 'open_ended', NULL, 'neuroticism', 'neuroticism'),
('big-five', 27, 'Mantengo la calma bajo presión', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'neuroticism', 'neuroticism'),
('big-five', 28, 'Mis emociones cambian rápidamente', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'neuroticism', 'neuroticism'),
('big-five', 29, 'Me siento ansioso en situaciones nuevas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'neuroticism', 'neuroticism'),
('big-five', 30, 'Soy emocionalmente estable', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'neuroticism', 'neuroticism');

-- Verify AI coaching tables exist
CREATE TABLE IF NOT EXISTS ai_interpretations (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    test_results JSONB NOT NULL,
    interpretation TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    model_version VARCHAR(50) DEFAULT 'gpt-4o',
    tokens_used INTEGER DEFAULT 0
);

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_ai_interpretations_user_test ON ai_interpretations(user_email, test_name);
CREATE INDEX IF NOT EXISTS idx_ai_interpretations_generated_at ON ai_interpretations(generated_at);

-- Verify user has Big Five test results for demo
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
    'travis@dtcfinal.com',
    'personality',
    'Big Five',
    'personality',
    '{
        "O": 85,
        "C": 78,
        "E": 72,
        "A": 68,
        "N": 35,
        "primary_traits": ["Creativo", "Organizado", "Sociable"],
        "secondary_traits": ["Curioso", "Responsable", "Empático"],
        "personality_summary": "Perfil de innovador organizado con alta estabilidad emocional y orientación social.",
        "career_recommendations": ["Director de Innovación", "Consultor de Estrategia", "Product Manager"],
        "development_areas": ["Desarrollar mayor flexibilidad", "Mejorar negociación en conflictos"],
        "strengths": ["Capacidad para generar ideas innovadoras", "Alta disciplina y organización", "Facilidad para conectar con personas"],
        "open_responses": {
            "2": "Soy muy creativo en la resolución de problemas. Por ejemplo, cuando nuestro equipo enfrentó un desafío técnico complejo, propuse una solución innovadora que combinaba diferentes tecnologías.",
            "8": "Mantengo un sistema de organización digital muy estructurado con calendarios, listas de tareas priorizadas y recordatorios automáticos.",
            "14": "Me siento cómodo liderando equipos y facilitando discusiones. Prefiero un estilo colaborativo donde todos puedan contribuir.",
            "20": "Cuando hay conflictos, trato de entender todas las perspectivas antes de buscar soluciones que beneficien a todos.",
            "26": "Manejo el estrés mediante técnicas de respiración, ejercicio regular y manteniendo una perspectiva positiva de los desafíos."
        }
    }',
    82,
    18,
    NOW() - INTERVAL '2 days'
) ON CONFLICT DO NOTHING;

SELECT 'Big Five AI integration setup completed successfully' as status;
