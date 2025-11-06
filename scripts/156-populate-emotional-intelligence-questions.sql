-- Create emotional intelligence test questions
-- First, ensure the test_questions table exists
CREATE TABLE IF NOT EXISTS test_questions (
    id SERIAL PRIMARY KEY,
    test_type VARCHAR(50) NOT NULL,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INTEGER,
    category VARCHAR(50) NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clear existing emotional intelligence questions
DELETE FROM test_questions WHERE test_type = 'emotional-intelligence';

-- Insert emotional intelligence test questions
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES

-- Self-Awareness Questions (6 questions)
('emotional-intelligence', 1, '¿Cómo reaccionas cuando alguien te critica constructivamente?', 
 '["Me molesto y me pongo a la defensiva", "Escucho pero no cambio mi comportamiento", "Considero la crítica y reflexiono sobre ella", "Agradezco la retroalimentación y busco mejorar"]', 
 'self_awareness', 'multiple_choice'),

('emotional-intelligence', 2, 'Cuando te sientes abrumado por las emociones, ¿qué haces?', 
 '["Ignoro mis sentimientos", "Me dejo llevar por las emociones", "Trato de entender qué las causa", "Analizo mis emociones y busco soluciones"]', 
 'self_awareness', 'multiple_choice'),

('emotional-intelligence', 3, '¿Con qué frecuencia reflexionas sobre tus propias reacciones emocionales?', 
 '["Nunca lo hago", "Rara vez", "A veces", "Regularmente"]', 
 'self_awareness', 'multiple_choice'),

('emotional-intelligence', 4, '¿Qué tan bien conoces tus fortalezas y debilidades emocionales?', 
 '["No las conozco bien", "Tengo una idea general", "Las conozco bastante bien", "Las conozco muy bien y trabajo en ellas"]', 
 'self_awareness', 'multiple_choice'),

('emotional-intelligence', 5, 'Cuando tomas decisiones importantes, ¿cómo consideras tus emociones?', 
 '["Las ignoro completamente", "Las considero poco", "Las tomo en cuenta junto con la lógica", "Las integro completamente en mi proceso de decisión"]', 
 'self_awareness', 'multiple_choice'),

('emotional-intelligence', 6, '¿Cómo describes tu nivel de autoconciencia emocional?', 
 '["Muy bajo", "Bajo", "Moderado", "Alto"]', 
 'self_awareness', 'multiple_choice'),

-- Self-Regulation Questions (6 questions)
('emotional-intelligence', 7, 'Cuando estás muy estresado en el trabajo, ¿qué haces?', 
 '["Exploto y descargo mi frustración con otros", "Me quedo callado pero sigo sintiéndome mal", "Tomo un descanso para calmarme", "Uso técnicas de respiración y manejo del estrés"]', 
 'self_regulation', 'multiple_choice'),

('emotional-intelligence', 8, '¿Cómo manejas los impulsos negativos cuando estás molesto?', 
 '["No los controlo bien", "A veces los controlo", "Generalmente los controlo", "Siempre los controlo efectivamente"]', 
 'self_regulation', 'multiple_choice'),

('emotional-intelligence', 9, 'Ante un cambio inesperado en el trabajo, tu reacción típica es:', 
 '["Me resisto y me molesto", "Me adapto con dificultad", "Me adapto relativamente bien", "Me adapto fácilmente y veo oportunidades"]', 
 'self_regulation', 'multiple_choice'),

('emotional-intelligence', 10, '¿Qué tan bien manejas la presión en situaciones difíciles?', 
 '["Muy mal", "Mal", "Bien", "Muy bien"]', 
 'self_regulation', 'multiple_choice'),

('emotional-intelligence', 11, 'Cuando cometes un error, ¿cómo reaccionas?', 
 '["Me culpo excesivamente", "Busco excusas", "Acepto la responsabilidad", "Aprendo del error y mejoro"]', 
 'self_regulation', 'multiple_choice'),

('emotional-intelligence', 12, '¿Con qué frecuencia pierdes el control emocional?', 
 '["Frecuentemente", "A veces", "Rara vez", "Nunca"]', 
 'self_regulation', 'multiple_choice'),

-- Motivation Questions (6 questions)
('emotional-intelligence', 13, '¿Qué te motiva más en tu trabajo?', 
 '["Solo el salario y los beneficios", "El reconocimiento de otros", "Los desafíos y el crecimiento personal", "Hacer una diferencia significativa"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 14, 'Ante los obstáculos en tus metas, ¿cómo reaccionas?', 
 '["Me rindo fácilmente", "Persisto un poco", "Persisto con determinación", "Los veo como oportunidades de crecimiento"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 15, '¿Qué tan optimista eres sobre el futuro?', 
 '["Muy pesimista", "Algo pesimista", "Moderadamente optimista", "Muy optimista"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 16, '¿Cómo te describes en términos de iniciativa personal?', 
 '["Espero que otros tomen la iniciativa", "A veces tomo iniciativa", "Frecuentemente tomo iniciativa", "Siempre busco oportunidades para liderar"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 17, 'Cuando estableces metas, ¿qué tan comprometido estás con alcanzarlas?', 
 '["Poco comprometido", "Moderadamente comprometido", "Muy comprometido", "Totalmente comprometido"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 18, '¿Qué tan importante es para ti la mejora continua?', 
 '["No es importante", "Algo importante", "Muy importante", "Es fundamental en mi vida"]', 
 'motivation', 'multiple_choice'),

-- Empathy Questions (6 questions)
('emotional-intelligence', 19, 'Cuando un compañero está visiblemente molesto, ¿cómo respondes?', 
 '["Lo ignoro, no es mi problema", "Le pregunto qué pasa pero no profundizo", "Trato de entender cómo se siente", "Ofrezco apoyo y ayuda específica"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 20, '¿Qué tan bien puedes leer las emociones de otras personas?', 
 '["Muy mal", "Mal", "Bien", "Muy bien"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 21, 'Cuando alguien te cuenta un problema personal, ¿cómo respondes?', 
 '["Cambio de tema", "Escucho pero no me involucro", "Escucho y ofrezco consejos", "Escucho empáticamente y apoyo emocionalmente"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 22, '¿Con qué frecuencia consideras cómo se sienten otros antes de actuar?', 
 '["Nunca", "Rara vez", "A menudo", "Siempre"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 23, '¿Qué tan fácil es para ti ponerte en el lugar de otra persona?', 
 '["Muy difícil", "Difícil", "Fácil", "Muy fácil"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 24, 'Cuando hay tensión en un grupo, ¿qué haces?', 
 '["Evito la situación", "Espero que otros la resuelvan", "Trato de entender todas las perspectivas", "Facilito activamente la resolución"]', 
 'empathy', 'multiple_choice'),

-- Social Skills Questions (6 questions)
('emotional-intelligence', 25, 'En una reunión de equipo con conflicto, ¿cómo actúas?', 
 '["Evito participar en la discusión", "Tomo partido por una de las partes", "Trato de mediar y encontrar puntos en común", "Facilito una solución colaborativa"]', 
 'social_skills', 'multiple_choice'),

('emotional-intelligence', 26, '¿Cómo describirías tus habilidades de comunicación?', 
 '["Muy pobres", "Pobres", "Buenas", "Excelentes"]', 
 'social_skills', 'multiple_choice'),

('emotional-intelligence', 27, 'Cuando necesitas influir en otros para lograr un objetivo, ¿qué haces?', 
 '["Uso autoridad o presión", "Presento solo los hechos", "Busco puntos en común", "Inspiro y motivo hacia una visión compartida"]', 
 'social_skills', 'multiple_choice'),

('emotional-intelligence', 28, '¿Qué tan cómodo te sientes liderando un equipo?', 
 '["Muy incómodo", "Incómodo", "Cómodo", "Muy cómodo"]', 
 'social_skills', 'multiple_choice'),

('emotional-intelligence', 29, 'En situaciones sociales nuevas, ¿cómo te comportas?', 
 '["Me mantengo apartado", "Participo mínimamente", "Me integro gradualmente", "Me integro fácilmente y conecto con otros"]', 
 'social_skills', 'multiple_choice'),

('emotional-intelligence', 30, '¿Qué tan efectivo eres manejando conflictos interpersonales?', 
 '["Muy inefectivo", "Inefectivo", "Efectivo", "Muy efectivo"]', 
 'social_skills', 'multiple_choice');

-- Verify the data was inserted
SELECT 
    test_type,
    category,
    COUNT(*) as question_count
FROM test_questions 
WHERE test_type = 'emotional-intelligence'
GROUP BY test_type, category
ORDER BY category;

-- Show total count
SELECT COUNT(*) as total_questions 
FROM test_questions 
WHERE test_type = 'emotional-intelligence';
