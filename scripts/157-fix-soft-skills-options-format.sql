-- Fix soft skills test questions with proper JSON formatting
-- First, ensure the test_questions table exists
CREATE TABLE IF NOT EXISTS test_questions (
    id SERIAL PRIMARY KEY,
    test_type VARCHAR(50) NOT NULL,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice',
    options JSONB,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(test_type, question_number)
);

-- Delete existing soft skills questions
DELETE FROM test_questions WHERE test_type = 'soft-skills';

-- Insert soft skills questions with proper JSON formatting
-- Communication (8 questions)
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('soft-skills', 1, '¿Cómo prefieres comunicar ideas complejas a tu equipo?', 'multiple_choice', '["Uso presentaciones visuales detalladas", "Explico verbalmente paso a paso", "Combino explicación verbal con ejemplos prácticos", "Facilito una discusión interactiva"]', 'communication'),
('soft-skills', 2, 'Cuando hay un malentendido en la comunicación, ¿qué haces?', 'multiple_choice', '["Espero que se resuelva solo", "Culpo a la otra persona por no entender", "Busco aclarar inmediatamente", "Analizo qué causó el malentendido y mejoro mi comunicación"]', 'communication'),
('soft-skills', 3, '¿Cómo adaptas tu estilo de comunicación según tu audiencia?', 'multiple_choice', '["No cambio mi estilo", "Hago pequeños ajustes", "Adapto significativamente mi enfoque", "Personalizo completamente mi comunicación"]', 'communication'),
('soft-skills', 4, 'En presentaciones importantes, ¿cómo manejas los nervios?', 'multiple_choice', '["Me pongo muy nervioso y se nota", "Trato de ocultarlo pero me afecta", "Uso técnicas para mantener la calma", "Convierto los nervios en energía positiva"]', 'communication'),
('soft-skills', 5, '¿Qué tan efectivo eres dando retroalimentación constructiva?', 'multiple_choice', '["Evito dar retroalimentación", "La doy pero de forma directa", "La doy de manera constructiva", "Soy experto en dar retroalimentación que motiva"]', 'communication'),
('soft-skills', 6, 'Cuando alguien no está de acuerdo contigo, ¿cómo respondes?', 'multiple_choice', '["Me molesto y defiendo mi posición", "Escucho pero mantengo mi opinión", "Trato de entender su perspectiva", "Busco puntos en común y soluciones colaborativas"]', 'communication'),
('soft-skills', 7, '¿Cómo manejas las conversaciones difíciles o conflictivas?', 'multiple_choice', '["Las evito a toda costa", "Las abordo directamente sin preparación", "Me preparo y busco el momento adecuado", "Las facilito creando un ambiente seguro para todos"]', 'communication'),
('soft-skills', 8, 'Describe una situación donde tuviste que comunicar malas noticias. ¿Cómo lo manejaste?', 'open_ended', NULL, 'communication');

-- Leadership (6 questions)
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('soft-skills', 9, '¿Cómo motivas a un equipo que está desmotivado?', 'multiple_choice', '["Les digo que trabajen más duro", "Ofrezco incentivos económicos", "Escucho sus preocupaciones y busco soluciones", "Inspiro con una visión clara y apoyo individual"]', 'leadership'),
('soft-skills', 10, 'Cuando lideras un proyecto, ¿cuál es tu enfoque principal?', 'multiple_choice', '["Controlo todos los detalles", "Delego pero superviso de cerca", "Empodero al equipo y facilito", "Creo una visión compartida y apoyo el crecimiento"]', 'leadership'),
('soft-skills', 11, '¿Cómo tomas decisiones difíciles que afectan al equipo?', 'multiple_choice', '["Decido solo basándome en datos", "Consulto a algunos miembros clave", "Involucro al equipo en el proceso", "Facilito una decisión colaborativa considerando todos los factores"]', 'leadership'),
('soft-skills', 12, 'Ante un miembro del equipo con bajo rendimiento, ¿qué haces?', 'multiple_choice', '["Lo critico directamente", "Espero que mejore solo", "Ofrezco apoyo y recursos", "Desarrollo un plan personalizado de mejora"]', 'leadership'),
('soft-skills', 13, '¿Cómo desarrollas el potencial de tu equipo?', 'multiple_choice', '["Me enfoco en completar tareas", "Doy retroalimentación ocasional", "Ofrezco oportunidades de crecimiento", "Mentoreo activamente y creo planes de desarrollo"]', 'leadership'),
('soft-skills', 14, 'Describe tu experiencia liderando un proyecto desafiante. ¿Qué aprendiste?', 'open_ended', NULL, 'leadership');

-- Teamwork (6 questions)
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('soft-skills', 15, 'En un proyecto de equipo, ¿cuál es tu rol natural?', 'multiple_choice', '["El que toma todas las decisiones", "El que ejecuta las tareas asignadas", "El que facilita la colaboración", "El que aporta ideas creativas y apoya a otros"]', 'teamwork'),
('soft-skills', 16, '¿Cómo manejas los conflictos dentro del equipo?', 'multiple_choice', '["Los ignoro esperando que se resuelvan", "Tomo partido por una de las partes", "Trato de mediar neutralmente", "Facilito una resolución colaborativa"]', 'teamwork'),
('soft-skills', 17, 'Cuando un compañero no cumple con su parte del trabajo, ¿qué haces?', 'multiple_choice', '["Me quejo con otros", "Hago su trabajo para evitar problemas", "Hablo directamente con él", "Busco entender las causas y ofrezco apoyo"]', 'teamwork'),
('soft-skills', 18, '¿Cómo contribuyes a crear un ambiente de equipo positivo?', 'multiple_choice', '["Me enfoco en mi trabajo", "Soy amigable cuando es necesario", "Participo activamente en actividades de equipo", "Lidero iniciativas para fortalecer la cohesión"]', 'teamwork'),
('soft-skills', 19, 'Ante ideas diferentes en el equipo, ¿cómo reaccionas?', 'multiple_choice', '["Defiendo mi idea", "Acepto la mayoría", "Busco combinar las mejores ideas", "Facilito un proceso para evaluar todas las opciones"]', 'teamwork'),
('soft-skills', 20, 'Comparte un ejemplo de cómo ayudaste a resolver un conflicto en tu equipo.', 'open_ended', NULL, 'teamwork');

-- Problem Solving (6 questions)
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('soft-skills', 21, 'Ante un problema complejo sin solución obvia, ¿cuál es tu enfoque?', 'multiple_choice', '["Busco una solución rápida aunque no sea perfecta", "Pido ayuda inmediatamente", "Analizo el problema desde múltiples ángulos", "Uso metodologías estructuradas y busco soluciones innovadoras"]', 'problem_solving'),
('soft-skills', 22, '¿Cómo priorizas cuando tienes múltiples problemas urgentes?', 'multiple_choice', '["Trabajo en el que grita más fuerte", "Hago una lista y trabajo en orden", "Evalúo impacto y urgencia", "Uso frameworks de priorización y considero recursos"]', 'problem_solving'),
('soft-skills', 23, 'Cuando una solución no funciona, ¿qué haces?', 'multiple_choice', '["Insisto hasta que funcione", "Busco otra solución similar", "Analizo por qué falló y ajusto", "Reevalúo completamente el problema y exploro nuevos enfoques"]', 'problem_solving'),
('soft-skills', 24, '¿Cómo involucras a otros en la resolución de problemas?', 'multiple_choice', '["Prefiero resolver solo", "Pido opiniones ocasionalmente", "Colaboro activamente con otros", "Facilito sesiones de brainstorming y co-creación"]', 'problem_solving'),
('soft-skills', 25, 'Ante un problema que requiere creatividad, ¿cómo procedes?', 'multiple_choice', '["Uso soluciones que ya conozco", "Busco ejemplos en internet", "Genero múltiples ideas creativas", "Combino técnicas de creatividad con análisis sistemático"]', 'problem_solving'),
('soft-skills', 26, 'Describe el problema más complejo que has resuelto y tu proceso.', 'open_ended', NULL, 'problem_solving');

-- Adaptability (4 questions)
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('soft-skills', 27, '¿Cómo reaccionas cuando los planes cambian repentinamente?', 'multiple_choice', '["Me molesto y me resisto al cambio", "Me adapto pero con dificultad", "Me adapto rápidamente", "Veo el cambio como una oportunidad y ayudo a otros a adaptarse"]', 'adaptability'),
('soft-skills', 28, 'Ante nuevas tecnologías o procesos, ¿cuál es tu actitud?', 'multiple_choice', '["Los evito si puedo", "Los aprendo cuando es necesario", "Los adopto proactivamente", "Los domino y ayudo a otros a adoptarlos"]', 'adaptability'),
('soft-skills', 29, '¿Cómo manejas la incertidumbre en el trabajo?', 'multiple_choice', '["Me estresa mucho", "Trato de evitarla", "La acepto como parte del trabajo", "La abrazo como oportunidad de crecimiento"]', 'adaptability'),
('soft-skills', 30, 'Comparte una experiencia donde tuviste que adaptarte rápidamente a un cambio significativo.', 'open_ended', NULL, 'adaptability');

-- Verify the data was inserted correctly
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

-- Show total count
SELECT COUNT(*) as total_questions 
FROM test_questions 
WHERE test_type = 'soft-skills';
