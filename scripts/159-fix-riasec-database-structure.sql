-- Fix RIASEC database structure and populate complete test
-- Remove NOT NULL constraint from category to allow open-ended questions

-- First, update the table structure
ALTER TABLE test_questions ALTER COLUMN category DROP NOT NULL;

-- Clear existing RIASEC questions to avoid duplicates
DELETE FROM test_questions WHERE test_type = 'riasec';

-- Insert RIASEC Multiple Choice Questions (30 questions - 5 per category)

-- REALISTIC (R) - Hands-on, practical work
INSERT INTO test_questions (test_type, category, question_text, question_type, options, correct_answer, points, order_index) VALUES
('riasec', 'realistic', '¿Te gusta trabajar con herramientas y maquinaria?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 1),
('riasec', 'realistic', '¿Prefieres trabajos que involucren actividades físicas y al aire libre?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 2),
('riasec', 'realistic', '¿Te interesa reparar equipos electrónicos o mecánicos?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 3),
('riasec', 'realistic', '¿Disfrutas construir o ensamblar objetos con tus manos?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 4),
('riasec', 'realistic', '¿Te atrae trabajar en agricultura, silvicultura o pesca?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 5);

-- INVESTIGATIVE (I) - Analytical, scientific thinking
INSERT INTO test_questions (test_type, category, question_text, question_type, options, correct_answer, points, order_index) VALUES
('riasec', 'investigative', '¿Te gusta resolver problemas complejos y abstractos?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 6),
('riasec', 'investigative', '¿Disfrutas realizando experimentos científicos?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 7),
('riasec', 'investigative', '¿Te interesa investigar y analizar datos?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 8),
('riasec', 'investigative', '¿Prefieres trabajar de forma independiente en proyectos de investigación?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 9),
('riasec', 'investigative', '¿Te atrae estudiar fenómenos naturales o sociales?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 10);

-- ARTISTIC (A) - Creative expression
INSERT INTO test_questions (test_type, category, question_text, question_type, options, correct_answer, points, order_index) VALUES
('riasec', 'artistic', '¿Disfrutas creando obras de arte, música o literatura?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 11),
('riasec', 'artistic', '¿Te gusta expresarte de manera creativa y original?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 12),
('riasec', 'artistic', '¿Prefieres ambientes de trabajo flexibles y poco estructurados?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 13),
('riasec', 'artistic', '¿Te interesa el diseño gráfico, la fotografía o las artes visuales?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 14),
('riasec', 'artistic', '¿Disfrutas escribiendo historias, poemas o artículos creativos?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 15);

-- SOCIAL (S) - Helping and working with people
INSERT INTO test_questions (test_type, category, question_text, question_type, options, correct_answer, points, order_index) VALUES
('riasec', 'social', '¿Te gusta ayudar a otros a resolver sus problemas?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 16),
('riasec', 'social', '¿Disfrutas enseñando o entrenando a otras personas?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 17),
('riasec', 'social', '¿Te interesa trabajar en servicios de salud o bienestar social?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 18),
('riasec', 'social', '¿Prefieres trabajar en equipo y colaborar con otros?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 19),
('riasec', 'social', '¿Te motiva hacer una diferencia positiva en la vida de las personas?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 20);

-- ENTERPRISING (E) - Leadership and persuasion
INSERT INTO test_questions (test_type, category, question_text, question_type, options, correct_answer, points, order_index) VALUES
('riasec', 'enterprising', '¿Te gusta liderar proyectos y dirigir equipos?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 21),
('riasec', 'enterprising', '¿Disfrutas vendiendo productos o ideas a otros?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 22),
('riasec', 'enterprising', '¿Te interesa iniciar tu propio negocio?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 23),
('riasec', 'enterprising', '¿Te motiva competir y alcanzar metas ambiciosas?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 24),
('riasec', 'enterprising', '¿Prefieres roles donde puedas influir y persuadir a otros?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 25);

-- CONVENTIONAL (C) - Organization and structure
INSERT INTO test_questions (test_type, category, question_text, question_type, options, correct_answer, points, order_index) VALUES
('riasec', 'conventional', '¿Te gusta trabajar con datos, números y registros detallados?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 26),
('riasec', 'conventional', '¿Prefieres seguir procedimientos establecidos y rutinas claras?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 27),
('riasec', 'conventional', '¿Disfrutas organizando archivos, documentos y sistemas?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 28),
('riasec', 'conventional', '¿Te interesa trabajar en contabilidad, finanzas o administración?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 29),
('riasec', 'conventional', '¿Prefieres ambientes de trabajo estructurados y predecibles?', 'multiple_choice', '["Definitivamente sí", "Probablemente sí", "Incierto", "Probablemente no", "Definitivamente no"]', 0, 5, 30);

-- Open-ended questions (5 questions)
INSERT INTO test_questions (test_type, category, question_text, question_type, options, correct_answer, points, order_index) VALUES
('riasec', NULL, '¿Qué te motiva más en tu carrera profesional y por qué?', 'open_ended', NULL, NULL, 0, 31),
('riasec', NULL, '¿Cuál ha sido tu mayor logro profesional hasta ahora y qué aprendiste de esa experiencia?', 'open_ended', NULL, NULL, 0, 32),
('riasec', NULL, '¿Cómo prefieres abordar los problemas complejos en el trabajo?', 'open_ended', NULL, NULL, 0, 33),
('riasec', NULL, '¿Qué tipo de contribución te gustaría hacer en un equipo de trabajo?', 'open_ended', NULL, NULL, 0, 34),
('riasec', NULL, '¿Dónde te ves profesionalmente en los próximos 5 años?', 'open_ended', NULL, NULL, 0, 35);

-- Update platform configuration
INSERT INTO platform_config (key, value, description) VALUES 
('riasec_questions_count', '35', 'Total number of RIASEC test questions')
ON CONFLICT (key) DO UPDATE SET 
value = EXCLUDED.value,
updated_at = CURRENT_TIMESTAMP;

COMMIT;
