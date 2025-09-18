-- Complete Soft Skills test with proper JSON formatting
-- Clear existing soft skills questions to avoid duplicates
DELETE FROM test_questions WHERE test_type = 'soft-skills';

-- COMMUNICATION (8 questions including open-ended)
INSERT INTO test_questions (test_type, category, question_text, question_type, options, correct_answer, points, order_index) VALUES
('soft-skills', 'communication', '¿Cómo te sientes al hablar en público frente a un grupo grande?', 'multiple_choice', '["Muy cómodo y confiado", "Cómodo con preparación", "Algo nervioso pero manejable", "Muy nervioso", "Evito estas situaciones"]', 0, 1, 1),
('soft-skills', 'communication', 'Cuando explicas conceptos complejos, ¿qué tan efectivo eres?', 'multiple_choice', '["Excelente, siempre me entienden", "Bueno, generalmente claro", "Regular, a veces confundo", "Necesito mejorar", "Me cuesta mucho"]', 0, 1, 2),
('soft-skills', 'communication', '¿Qué tan bien escuchas activamente a otros durante conversaciones?', 'multiple_choice', '["Siempre escucho atentamente", "Generalmente escucho bien", "A veces me distraigo", "Me cuesta concentrarme", "Suelo interrumpir"]', 0, 1, 3),
('soft-skills', 'communication', 'Al escribir emails profesionales, ¿qué tan claro y conciso eres?', 'multiple_choice', '["Siempre claro y directo", "Generalmente bien estructurado", "A veces demasiado extenso", "Suelo ser confuso", "Me cuesta escribir profesionalmente"]', 0, 1, 4),
('soft-skills', 'communication', '¿Cómo manejas las conversaciones difíciles o conflictivas?', 'multiple_choice', '["Con calma y diplomacia", "Bien, mantengo la compostura", "Me pongo algo tenso", "Me cuesta mantener la calma", "Evito estos temas"]', 0, 1, 5),
('soft-skills', 'communication', '¿Qué tan efectivo eres dando feedback constructivo?', 'multiple_choice', '["Muy efectivo y empático", "Bueno, pero puedo mejorar", "Regular, a veces directo", "Me cuesta ser constructivo", "Evito dar feedback"]', 0, 1, 6),
('soft-skills', 'communication', '¿Cómo adaptas tu comunicación según tu audiencia?', 'multiple_choice', '["Siempre adapto mi estilo", "Generalmente ajusto el tono", "A veces considero la audiencia", "Rara vez cambio mi estilo", "Comunico igual con todos"]', 0, 1, 7),
('soft-skills', 'communication', 'Describe una situación donde tuviste que comunicar malas noticias. ¿Cómo lo manejaste?', 'open_ended', NULL, NULL, 0, 8);

-- LEADERSHIP (6 questions)
INSERT INTO test_questions (test_type, category, question_text, question_type, options, correct_answer, points, order_index) VALUES
('soft-skills', 'leadership', '¿Qué tan cómodo te sientes tomando decisiones importantes bajo presión?', 'multiple_choice', '["Muy cómodo, decido rápido", "Cómodo con información suficiente", "Algo ansioso pero decido", "Me cuesta decidir rápido", "Prefiero que otros decidan"]', 0, 1, 9),
('soft-skills', 'leadership', 'Cuando lideras un equipo, ¿cómo motivas a los miembros?', 'multiple_choice', '["Inspiro con visión clara", "Reconozco logros individuales", "Establezco metas desafiantes", "Apoyo desarrollo personal", "Me cuesta motivar"]', 0, 1, 10),
('soft-skills', 'leadership', '¿Cómo manejas los conflictos dentro de tu equipo?', 'multiple_choice', '["Abordo directamente el problema", "Facilito conversaciones abiertas", "Busco soluciones ganar-ganar", "Evito confrontaciones", "Delego a otros"]', 0, 1, 11),
('soft-skills', 'leadership', '¿Qué tan efectivo eres delegando responsabilidades?', 'multiple_choice', '["Excelente, confío en mi equipo", "Bueno, pero superviso", "Regular, me cuesta soltar control", "Prefiero hacer yo mismo", "No delego casi nunca"]', 0, 1, 12),
('soft-skills', 'leadership', '¿Cómo desarrollas el talento de tu equipo?', 'multiple_choice', '["Creo planes de desarrollo", "Ofrezco mentoría regular", "Asigno proyectos desafiantes", "Envío a capacitaciones", "No tengo tiempo para esto"]', 0, 1, 13),
('soft-skills', 'leadership', '¿Qué tan bien comunicas la visión y objetivos del equipo?', 'multiple_choice', '["Siempre clara y inspiradora", "Generalmente bien explicada", "A veces confusa", "Me cuesta comunicar visión", "No suelo compartir visión"]', 0, 1, 14);

-- TEAMWORK (6 questions)
INSERT INTO test_questions (test_type, category, question_text, question_type, options, correct_answer, points, order_index) VALUES
('soft-skills', 'teamwork', '¿Cómo contribuyes típicamente en reuniones de equipo?', 'multiple_choice', '["Lidero discusiones activamente", "Aporto ideas valiosas", "Escucho y apoyo", "Participo cuando me preguntan", "Prefiero no hablar"]', 0, 1, 15),
('soft-skills', 'teamwork', '¿Qué tan bien colaboras con personas de diferentes estilos de trabajo?', 'multiple_choice', '["Excelente, me adapto fácil", "Bien, soy flexible", "Regular, depende de la persona", "Me cuesta adaptarme", "Prefiero trabajar solo"]', 0, 1, 16),
('soft-skills', 'teamwork', 'Cuando hay desacuerdos en el equipo, ¿cómo reaccionas?', 'multiple_choice', '["Busco puntos en común", "Escucho todas las perspectivas", "Propongo soluciones", "Me mantengo neutral", "Evito el conflicto"]', 0, 1, 17),
('soft-skills', 'teamwork', '¿Qué tan dispuesto estás a ayudar a colegas con sus tareas?', 'multiple_choice', '["Siempre disponible para ayudar", "Ayudo cuando puedo", "Depende de mi carga de trabajo", "Solo si me lo piden", "Prefiero enfocarme en lo mío"]', 0, 1, 18),
('soft-skills', 'teamwork', '¿Cómo manejas las críticas constructivas de tus compañeros?', 'multiple_choice', '["Las recibo con gratitud", "Las considero seriamente", "Me pongo algo defensivo", "Me cuesta aceptarlas", "Las tomo como ataques personales"]', 0, 1, 19),
('soft-skills', 'teamwork', '¿Qué tan efectivo eres construyendo relaciones de trabajo positivas?', 'multiple_choice', '["Excelente, conecto fácil", "Bueno, soy amigable", "Regular, soy algo reservado", "Me cuesta socializar", "Prefiero relaciones mínimas"]', 0, 1, 20);

-- PROBLEM SOLVING (6 questions)
INSERT INTO test_questions (test_type, category, question_text, question_type, options, correct_answer, points, order_index) VALUES
('soft-skills', 'problem-solving', '¿Cómo abordas problemas complejos sin solución obvia?', 'multiple_choice', '["Analizo sistemáticamente", "Busco patrones y conexiones", "Consulto con expertos", "Pruebo diferentes enfoques", "Me siento abrumado"]', 0, 1, 21),
('soft-skills', 'problem-solving', '¿Qué tan creativo eres generando soluciones alternativas?', 'multiple_choice', '["Muy creativo, muchas ideas", "Bueno, algunas ideas originales", "Regular, ideas convencionales", "Me cuesta ser creativo", "Prefiero soluciones probadas"]', 0, 1, 22),
('soft-skills', 'problem-solving', 'Cuando enfrentas un problema urgente, ¿cómo priorizas?', 'multiple_choice', '["Evalúo impacto y urgencia", "Me enfoco en lo más crítico", "Hago una lista y la sigo", "Ataco todo a la vez", "Me paralizo con la presión"]', 0, 1, 23),
('soft-skills', 'problem-solving', '¿Qué tan bien identificas la causa raíz de los problemas?', 'multiple_choice', '["Excelente, voy al fondo", "Bueno, generalmente encuentro", "Regular, a veces me quedo en síntomas", "Me cuesta profundizar", "Ataco síntomas directamente"]', 0, 1, 24),
('soft-skills', 'problem-solving', '¿Cómo validas que tus soluciones realmente funcionan?', 'multiple_choice', '["Establezco métricas claras", "Hago seguimiento regular", "Pido feedback de usuarios", "Confío en mi experiencia", "Asumo que funcionan"]', 0, 1, 25),
('soft-skills', 'problem-solving', '¿Qué tan cómodo te sientes con la ambigüedad e incertidumbre?', 'multiple_choice', '["Muy cómodo, me adapto", "Cómodo, busco claridad", "Algo incómodo pero manejo", "Me genera ansiedad", "Necesito todo muy claro"]', 0, 1, 26);

-- ADAPTABILITY (4 questions)
INSERT INTO test_questions (test_type, category, question_text, question_type, options, correct_answer, points, order_index) VALUES
('soft-skills', 'adaptability', '¿Cómo reaccionas cuando cambian las prioridades del proyecto?', 'multiple_choice', '["Me adapto rápidamente", "Ajusto mi plan sin problema", "Necesito tiempo para adaptarme", "Me genera estrés", "Resisto los cambios"]', 0, 1, 27),
('soft-skills', 'adaptability', '¿Qué tan abierto estás a aprender nuevas tecnologías o métodos?', 'multiple_choice', '["Muy abierto, me emociona", "Abierto, veo el valor", "Neutral, si es necesario", "Algo reacio al cambio", "Prefiero lo que conozco"]', 0, 1, 28),
('soft-skills', 'adaptability', '¿Cómo manejas trabajar con equipos de diferentes culturas?', 'multiple_choice', '["Excelente, disfruto la diversidad", "Bien, me adapto al estilo", "Regular, necesito tiempo", "Me cuesta adaptarme", "Prefiero equipos similares"]', 0, 1, 29),
('soft-skills', 'adaptability', '¿Qué tan flexible eres con tu horario y métodos de trabajo?', 'multiple_choice', '["Muy flexible, me adapto", "Flexible dentro de límites", "Algo rígido en mis métodos", "Prefiero rutinas fijas", "No me gusta cambiar"]', 0, 1, 30);

-- Update platform configuration
INSERT INTO platform_config (key, value, description) VALUES 
('soft_skills_questions_count', '30', 'Total number of soft skills test questions')
ON CONFLICT (key) DO UPDATE SET 
value = EXCLUDED.value,
updated_at = CURRENT_TIMESTAMP;

COMMIT;
