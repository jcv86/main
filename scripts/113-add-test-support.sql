-- Add support for new test types and improve existing structure

-- Update test_results table to support more test types
ALTER TABLE test_results 
ADD COLUMN IF NOT EXISTS test_category VARCHAR(50) DEFAULT 'personality',
ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(20) DEFAULT 'intermediate',
ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 100;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_results_test_name ON test_results(test_name);
CREATE INDEX IF NOT EXISTS idx_test_results_category ON test_results(test_category);
CREATE INDEX IF NOT EXISTS idx_test_results_completion ON test_results(completed_at DESC);

-- Insert sample Big Five results for demo
INSERT INTO test_results (
    user_email, 
    test_type, 
    test_name, 
    test_category,
    results, 
    score, 
    duration_minutes,
    completed_at
) VALUES 
(
    'travis@dtcfinal.com',
    'personality',
    'Big Five',
    'personality',
    '{"O": 78, "C": 65, "E": 82, "A": 71, "N": 35, "primary_traits": ["Abierto a experiencias", "Extrovertido", "Emocionalmente estable"]}',
    72,
    18,
    NOW() - INTERVAL '2 days'
),
(
    'demo@dtcfinal.com',
    'personality',
    'Big Five',
    'personality',
    '{"O": 65, "C": 78, "E": 45, "A": 82, "N": 40, "primary_traits": ["Consciente", "Amable"]}',
    68,
    22,
    NOW() - INTERVAL '1 day'
);

-- Insert sample MBTI results for demo
INSERT INTO test_results (
    user_email, 
    test_type, 
    test_name, 
    test_category,
    results, 
    score, 
    duration_minutes,
    completed_at
) VALUES 
(
    'travis@dtcfinal.com',
    'personality',
    'MBTI',
    'personality',
    '{"type": "ENTJ", "type_name": "El Comandante", "type_description": "Líder audaz, imaginativo y con voluntad fuerte", "scores": {"E": 12, "I": 8, "N": 14, "S": 6, "T": 15, "F": 5, "J": 13, "P": 7}}',
    85,
    16,
    NOW() - INTERVAL '3 days'
);

-- Update user activities with new test completions
INSERT INTO user_activities (user_email, activity_type, activity_description, xp_earned, created_at) VALUES
('travis@dtcfinal.com', 'test_completed', 'Completó el Test Big Five - Perfil: Abierto y Extrovertido', 75, NOW() - INTERVAL '2 days'),
('travis@dtcfinal.com', 'test_completed', 'Completó el Test MBTI - Tipo: ENTJ (El Comandante)', 100, NOW() - INTERVAL '3 days'),
('demo@dtcfinal.com', 'test_completed', 'Completó el Test Big Five - Perfil: Consciente y Amable', 75, NOW() - INTERVAL '1 day');

-- Update user profiles with increased test counts
UPDATE user_profiles 
SET tests_completed = tests_completed + 2,
    total_xp = total_xp + 175
WHERE user_email = 'travis@dtcfinal.com';

UPDATE user_profiles 
SET tests_completed = tests_completed + 1,
    total_xp = total_xp + 75
WHERE user_email = 'demo@dtcfinal.com';

-- Add more knowledge base content for test-related resources
INSERT INTO knowledge_base (title, category, content, tags, difficulty_level, estimated_read_time) VALUES
('Entendiendo tu Personalidad DISC', 'Personalidad', 'Guía completa para interpretar y aplicar los resultados del test DISC en tu vida profesional. Aprende cómo cada estilo se manifiesta en el trabajo y cómo mejorar tu comunicación con otros estilos.', ARRAY['disc', 'personalidad', 'comunicación', 'liderazgo'], 'Beginner', 20),
('Big Five: Los Cinco Grandes Factores', 'Personalidad', 'Profundiza en el modelo de personalidad más respaldado científicamente. Descubre cómo la Apertura, Responsabilidad, Extraversión, Amabilidad y Neuroticismo influyen en tu comportamiento y decisiones.', ARRAY['big-five', 'personalidad', 'psicología', 'autoconocimiento'], 'Intermediate', 25),
('MBTI en el Ambiente Laboral', 'Personalidad', 'Aprende a aplicar tu tipo de personalidad MBTI para mejorar tu desempeño laboral, comunicación en equipo y desarrollo de carrera. Incluye estrategias específicas para cada tipo.', ARRAY['mbti', 'trabajo-en-equipo', 'desarrollo-profesional'], 'Intermediate', 30),
('Desarrollo de Inteligencia Emocional', 'Soft Skills', 'Guía práctica para desarrollar tu inteligencia emocional en el contexto profesional. Incluye ejercicios y técnicas para mejorar la autoconciencia, autorregulación y habilidades sociales.', ARRAY['inteligencia-emocional', 'soft-skills', 'liderazgo'], 'Advanced', 35),
('Comunicación Efectiva por Tipo de Personalidad', 'Comunicación', 'Estrategias de comunicación adaptadas a diferentes tipos de personalidad. Aprende a identificar el estilo de comunicación de otros y adaptar tu mensaje para mayor efectividad.', ARRAY['comunicación', 'personalidad', 'relaciones-interpersonales'], 'Intermediate', 22);

SELECT 'Test support tables updated successfully with new content and sample data' as status;
