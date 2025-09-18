-- Fix soft skills test questions options format
-- Ensure proper JSON formatting for all soft skills questions

-- First, let's see what we have
SELECT id, question_text, options, question_type 
FROM test_questions 
WHERE test_type = 'soft-skills' 
LIMIT 5;

-- Delete existing soft skills questions to start fresh
DELETE FROM test_questions WHERE test_type = 'soft-skills';

-- Insert properly formatted soft skills questions
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES

-- Communication Questions
('soft-skills', 1, '¿Cómo prefieres comunicar ideas complejas a tu equipo?', 
 '["Uso presentaciones visuales detalladas", "Explico verbalmente paso a paso", "Combino explicación verbal con ejemplos prácticos", "Facilito una discusión interactiva"]', 
 'communication', 'multiple_choice'),

('soft-skills', 2, 'Cuando hay un malentendido en la comunicación, ¿qué haces?', 
 '["Espero que se resuelva solo", "Culpo a la otra persona por no entender", "Busco aclarar inmediatamente", "Analizo qué causó el malentendido y mejoro mi comunicación"]', 
 'communication', 'multiple_choice'),

('soft-skills', 3, 'Describe una situación donde tuviste que comunicar malas noticias. ¿Cómo lo manejaste?', 
 '[]', 
 'communication', 'open_ended'),

-- Leadership Questions  
('soft-skills', 4, '¿Cómo motivas a un equipo que está desmotivado?', 
 '["Les digo que trabajen más duro", "Ofrezco incentivos económicos", "Escucho sus preocupaciones y busco soluciones", "Inspiro con una visión clara y apoyo individual"]', 
 'leadership', 'multiple_choice'),

('soft-skills', 5, 'Cuando tomas decisiones difíciles como líder, ¿qué consideras más importante?', 
 '["La rapidez de la decisión", "La opinión de la mayoría", "El impacto en todas las partes interesadas", "Los datos y el análisis objetivo"]', 
 'leadership', 'multiple_choice'),

('soft-skills', 6, 'Comparte un ejemplo de cómo has liderado un cambio importante en tu organización.', 
 '[]', 
 'leadership', 'open_ended'),

-- Teamwork Questions
('soft-skills', 7, 'En un proyecto de equipo, ¿cuál es tu rol natural?', 
 '["El que toma todas las decisiones", "El que ejecuta las tareas asignadas", "El que facilita la colaboración", "El que aporta ideas creativas y apoya a otros"]', 
 'teamwork', 'multiple_choice'),

('soft-skills', 8, '¿Cómo manejas los conflictos dentro del equipo?', 
 '["Los evito hasta que se resuelvan solos", "Tomo partido por quien creo que tiene razón", "Facilito una conversación para entender todas las perspectivas", "Busco soluciones ganar-ganar que beneficien al equipo"]', 
 'teamwork', 'multiple_choice'),

('soft-skills', 9, 'Describe una experiencia donde el trabajo en equipo fue crucial para el éxito del proyecto.', 
 '[]', 
 'teamwork', 'open_ended'),

-- Problem Solving Questions
('soft-skills', 10, 'Ante un problema complejo sin solución obvia, ¿cuál es tu enfoque?', 
 '["Busco una solución rápida aunque no sea perfecta", "Pido ayuda inmediatamente", "Analizo el problema desde múltiples ángulos", "Uso metodologías estructuradas y busco soluciones innovadoras"]', 
 'problem_solving', 'multiple_choice'),

('soft-skills', 11, '¿Cómo priorizas cuando tienes múltiples problemas urgentes?', 
 '["Trabajo en el que grita más fuerte", "Hago todo al mismo tiempo", "Evalúo impacto y urgencia", "Uso frameworks de priorización y comunico claramente"]', 
 'problem_solving', 'multiple_choice'),

('soft-skills', 12, 'Comparte un ejemplo de un problema complejo que resolviste de manera creativa.', 
 '[]', 
 'problem_solving', 'open_ended'),

-- Adaptability Questions
('soft-skills', 13, '¿Cómo reaccionas cuando los planes cambian repentinamente?', 
 '["Me molesto y me resisto al cambio", "Me adapto pero con dificultad", "Me adapto rápidamente", "Veo el cambio como una oportunidad y ayudo a otros a adaptarse"]', 
 'adaptability', 'multiple_choice'),

('soft-skills', 14, 'Cuando aprendes una nueva tecnología o proceso, ¿cuál es tu enfoque?', 
 '["Espero que alguien me enseñe", "Leo la documentación básica", "Experimento y aprendo haciendo", "Combino múltiples fuentes de aprendizaje y comparto conocimiento"]', 
 'adaptability', 'multiple_choice'),

('soft-skills', 15, 'Describe una situación donde tuviste que adaptarte rápidamente a un cambio significativo.', 
 '[]', 
 'adaptability', 'open_ended'),

-- Emotional Intelligence Questions
('soft-skills', 16, '¿Cómo manejas el estrés en situaciones de alta presión?', 
 '["Me paralizo y no puedo funcionar", "Trabajo más horas para compensar", "Uso técnicas de manejo del estrés", "Mantengo la calma y ayudo a otros a manejar su estrés también"]', 
 'emotional_intelligence', 'multiple_choice'),

('soft-skills', 17, 'Cuando un colega está pasando por un momento difícil, ¿cómo respondes?', 
 '["No es mi problema", "Le doy consejos para que se sienta mejor", "Escucho y ofrezco apoyo emocional", "Proporciono apoyo empático y ayuda práctica según sus necesidades"]', 
 'emotional_intelligence', 'multiple_choice'),

('soft-skills', 18, 'Comparte una experiencia donde tu inteligencia emocional fue clave para resolver una situación.', 
 '[]', 
 'emotional_intelligence', 'open_ended'),

-- Time Management Questions
('soft-skills', 19, '¿Cómo organizas tu día de trabajo típico?', 
 '["Voy resolviendo las cosas según surgen", "Tengo una lista básica de tareas", "Planifico con prioridades claras", "Uso sistemas avanzados de productividad y reviso regularmente"]', 
 'time_management', 'multiple_choice'),

('soft-skills', 20, 'Cuando tienes múltiples deadlines, ¿cómo los manejas?', 
 '["Trabajo en pánico hasta terminar", "Hago lo que puedo en el tiempo disponible", "Planifico y comunico proactivamente", "Optimizo procesos y busco eficiencias para cumplir todo"]', 
 'time_management', 'multiple_choice'),

('soft-skills', 21, 'Describe tu estrategia para mantener el equilibrio entre trabajo y vida personal.', 
 '[]', 
 'time_management', 'open_ended'),

-- Critical Thinking Questions
('soft-skills', 22, 'Cuando evalúas información para tomar una decisión, ¿qué haces?', 
 '["Confío en mi intuición", "Busco la opinión de otros", "Analizo datos y evidencias", "Uso pensamiento crítico sistemático y considero múltiples perspectivas"]', 
 'critical_thinking', 'multiple_choice'),

('soft-skills', 23, '¿Cómo identificas y cuestionas tus propios sesgos?', 
 '["No creo tener sesgos significativos", "A veces me doy cuenta después", "Regularmente reflexiono sobre mis decisiones", "Activamente busco perspectivas contrarias y feedback"]', 
 'critical_thinking', 'multiple_choice'),

('soft-skills', 24, 'Comparte un ejemplo donde tu pensamiento crítico te ayudó a evitar un error importante.', 
 '[]', 
 'critical_thinking', 'open_ended');

-- Verify the data
SELECT 
    test_type,
    category,
    COUNT(*) as question_count,
    COUNT(CASE WHEN question_type = 'multiple_choice' THEN 1 END) as multiple_choice,
    COUNT(CASE WHEN question_type = 'open_ended' THEN 1 END) as open_ended
FROM test_questions 
WHERE test_type = 'soft-skills'
GROUP BY test_type, category
ORDER BY category;

-- Test JSON parsing
SELECT 
    id,
    question_text,
    options,
    json_array_length(options::json) as option_count
FROM test_questions 
WHERE test_type = 'soft-skills' 
AND question_type = 'multiple_choice'
LIMIT 5;
