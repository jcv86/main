-- Create RIASEC test questions with proper structure
-- First, ensure the test_questions table exists with correct structure
CREATE TABLE IF NOT EXISTS test_questions (
    id SERIAL PRIMARY KEY,
    test_type VARCHAR(50) NOT NULL,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice',
    options JSONB,
    category VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(test_type, question_number)
);

-- Delete existing RIASEC questions to avoid conflicts
DELETE FROM test_questions WHERE test_type = 'riasec';

-- Insert RIASEC multiple choice questions (30 questions, 5 per category)
-- Realistic category (R) - Questions 1-5
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('riasec', 1, '¿Te gusta trabajar con herramientas y maquinaria?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'R'),
('riasec', 2, '¿Disfrutas reparar objetos o dispositivos?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'R'),
('riasec', 3, '¿Te atrae trabajar al aire libre?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'R'),
('riasec', 4, '¿Te gusta construir o ensamblar cosas?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'R'),
('riasec', 5, '¿Prefieres trabajos que requieren habilidades físicas?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'R');

-- Investigativo category (I) - Questions 6-10
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('riasec', 6, '¿Te gusta resolver problemas complejos?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'I'),
('riasec', 7, '¿Disfrutas investigar y analizar datos?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'I'),
('riasec', 8, '¿Te atrae la ciencia y la tecnología?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'I'),
('riasec', 9, '¿Te gusta experimentar y probar teorías?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'I'),
('riasec', 10, '¿Prefieres trabajar de forma independiente?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'I');

-- Artístico category (A) - Questions 11-15
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('riasec', 11, '¿Te gusta crear arte o diseños?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'A'),
('riasec', 12, '¿Disfrutas escribir o componer música?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'A'),
('riasec', 13, '¿Te atrae la expresión creativa?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'A'),
('riasec', 14, '¿Te gusta innovar y crear cosas nuevas?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'A'),
('riasec', 15, '¿Prefieres ambientes de trabajo flexibles?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'A');

-- Social category (S) - Questions 16-20
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('riasec', 16, '¿Te gusta ayudar y enseñar a otros?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'S'),
('riasec', 17, '¿Disfrutas trabajar en equipo?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'S'),
('riasec', 18, '¿Te atrae el trabajo comunitario?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'S'),
('riasec', 19, '¿Te gusta cuidar y apoyar a las personas?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'S'),
('riasec', 20, '¿Prefieres resolver conflictos interpersonales?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'S');

-- Emprendedor category (E) - Questions 21-25
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('riasec', 21, '¿Te gusta liderar y dirigir proyectos?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'E'),
('riasec', 22, '¿Disfrutas persuadir y convencer a otros?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'E'),
('riasec', 23, '¿Te atrae tomar decisiones importantes?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'E'),
('riasec', 24, '¿Te gusta competir y ganar?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'E'),
('riasec', 25, '¿Prefieres ambientes dinámicos y desafiantes?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'E');

-- Convencional category (C) - Questions 26-30
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('riasec', 26, '¿Te gusta organizar y planificar actividades?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'C'),
('riasec', 27, '¿Disfrutas trabajar con números y datos?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'C'),
('riasec', 28, '¿Te atrae seguir procedimientos establecidos?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'C'),
('riasec', 29, '¿Te gusta mantener registros detallados?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'C'),
('riasec', 30, '¿Prefieres trabajos estructurados y predecibles?', 'multiple_choice', '["Nada", "Poco", "Algo", "Mucho"]', 'C');

-- Reflective questions (31-35)
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('riasec', 31, '¿Qué tipo de actividades te motivan más en el trabajo?', 'open_ended', NULL, NULL),
('riasec', 32, '¿Cómo te ves profesionalmente en 5 años?', 'open_ended', NULL, NULL),
('riasec', 33, '¿Cuál ha sido tu mayor logro personal o profesional?', 'open_ended', NULL, NULL),
('riasec', 34, '¿Cómo sueles enfrentar los desafíos o problemas?', 'open_ended', NULL, NULL),
('riasec', 35, '¿De qué manera contribuyes mejor en un equipo de trabajo?', 'open_ended', NULL, NULL);

-- Verify the questions were inserted
SELECT test_type, COUNT(*) as total_questions,
       COUNT(CASE WHEN question_type = 'multiple_choice' THEN 1 END) as multiple_choice,
       COUNT(CASE WHEN question_type = 'open_ended' THEN 1 END) as open_ended
FROM test_questions 
WHERE test_type = 'riasec' 
GROUP BY test_type;

-- Show questions by category
SELECT category, COUNT(*) as count
FROM test_questions 
WHERE test_type = 'riasec' AND category IS NOT NULL
GROUP BY category
ORDER BY category;
