-- Verify and fix Big Five AI integration
-- This script ensures all components are ready for Big Five test with AI

-- Ensure test_questions table has Big Five questions
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, competency_area) VALUES
('big-five', 1, '¿Cómo te describes en términos de creatividad e innovación?', 'open', NULL, 'openness'),
('big-five', 2, '¿Qué tan organizado eres en tu vida diaria y trabajo?', 'open', NULL, 'conscientiousness'),
('big-five', 3, '¿Cómo te sientes en situaciones sociales y de liderazgo?', 'open', NULL, 'extraversion'),
('big-five', 4, '¿Cómo manejas los conflictos y la cooperación con otros?', 'open', NULL, 'agreeableness'),
('big-five', 5, '¿Cómo respondes al estrés y la presión?', 'open', NULL, 'neuroticism')
ON CONFLICT (test_type, question_number) DO NOTHING;

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
        "strengths": ["Capacidad para generar ideas innovadoras", "Alta disciplina y organización", "Facilidad para conectar con personas"]
    }',
    82,
    18,
    NOW() - INTERVAL '2 days'
) ON CONFLICT DO NOTHING;

COMMIT;
