-- Create emotional intelligence test questions
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
-- Self-Awareness Questions (1-6)
('emotional-intelligence', 1, '¿Qué tan bien reconoces tus propias emociones cuando las experimentas?', 
 '["Raramente las reconozco", "A veces las reconozco", "Generalmente las reconozco", "Siempre las reconozco claramente"]', 
 'self_awareness', 'multiple_choice'),

('emotional-intelligence', 2, '¿Entiendes las causas de tus emociones?', 
 '["Raramente entiendo por qué me siento así", "A veces entiendo las causas", "Generalmente entiendo las causas", "Siempre entiendo qué causa mis emociones"]', 
 'self_awareness', 'multiple_choice'),

('emotional-intelligence', 3, '¿Eres consciente de cómo tus emociones afectan tu comportamiento?', 
 '["Raramente soy consciente", "A veces me doy cuenta", "Generalmente soy consciente", "Siempre soy muy consciente"]', 
 'self_awareness', 'multiple_choice'),

('emotional-intelligence', 4, '¿Reconoces tus fortalezas y limitaciones emocionales?', 
 '["No las reconozco bien", "Reconozco algunas", "Reconozco la mayoría", "Las reconozco completamente"]', 
 'self_awareness', 'multiple_choice'),

('emotional-intelligence', 5, '¿Qué tan bien identificas tus desencadenantes emocionales?', 
 '["No los identifico", "Identifico pocos", "Identifico la mayoría", "Los identifico todos claramente"]', 
 'self_awareness', 'multiple_choice'),

('emotional-intelligence', 6, '¿Eres consciente del impacto de tus emociones en otros?', 
 '["Raramente soy consciente", "A veces me doy cuenta", "Generalmente soy consciente", "Siempre considero el impacto"]', 
 'self_awareness', 'multiple_choice'),

-- Self-Regulation Questions (7-12)
('emotional-intelligence', 7, '¿Qué tan bien manejas el estrés y la presión?', 
 '["Me cuesta mucho manejar el estrés", "A veces puedo manejar el estrés", "Generalmente manejo bien el estrés", "Manejo el estrés de manera excelente"]', 
 'self_regulation', 'multiple_choice'),

('emotional-intelligence', 8, '¿Puedes controlar tus impulsos emocionales?', 
 '["Raramente puedo controlar mis impulsos", "A veces puedo controlarlos", "Generalmente los controlo bien", "Siempre controlo mis impulsos"]', 
 'self_regulation', 'multiple_choice'),

('emotional-intelligence', 9, '¿Cómo manejas las emociones negativas?', 
 '["Me abruman las emociones negativas", "A veces las manejo mal", "Generalmente las manejo bien", "Las manejo de manera muy efectiva"]', 
 'self_regulation', 'multiple_choice'),

('emotional-intelligence', 10, '¿Qué tan flexible eres ante los cambios?', 
 '["Me cuesta adaptarme a los cambios", "A veces me adapto bien", "Generalmente soy flexible", "Soy muy adaptable a los cambios"]', 
 'self_regulation', 'multiple_choice'),

('emotional-intelligence', 11, '¿Puedes mantener la calma en situaciones difíciles?', 
 '["Raramente mantengo la calma", "A veces puedo mantener la calma", "Generalmente mantengo la calma", "Siempre mantengo la calma"]', 
 'self_regulation', 'multiple_choice'),

('emotional-intelligence', 12, '¿Cómo manejas la frustración?', 
 '["La frustración me paraliza", "A veces manejo mal la frustración", "Generalmente manejo bien la frustración", "Manejo la frustración de manera constructiva"]', 
 'self_regulation', 'multiple_choice'),

-- Motivation Questions (13-18)
('emotional-intelligence', 13, '¿Qué tan motivado/a te sientes para alcanzar tus objetivos?', 
 '["Me cuesta mantener la motivación", "A veces me siento motivado/a", "Generalmente estoy motivado/a", "Siempre estoy altamente motivado/a"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 14, '¿Persistes ante las dificultades?', 
 '["Me rindo fácilmente", "A veces persisto", "Generalmente persisto", "Siempre persisto hasta lograr mis objetivos"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 15, '¿Buscas oportunidades de mejora y crecimiento?', 
 '["Raramente busco mejorar", "A veces busco oportunidades", "Generalmente busco crecer", "Siempre busco oportunidades de crecimiento"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 16, '¿Qué tan optimista eres ante los desafíos?', 
 '["Soy pesimista ante los desafíos", "A veces soy optimista", "Generalmente soy optimista", "Siempre mantengo una actitud positiva"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 17, '¿Te comprometes con la excelencia en tu trabajo?', 
 '["Hago lo mínimo necesario", "A veces me esfuerzo más", "Generalmente busco la calidad", "Siempre busco la excelencia"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 18, '¿Tomas iniciativa para resolver problemas?', 
 '["Espero que otros resuelvan los problemas", "A veces tomo iniciativa", "Generalmente soy proactivo/a", "Siempre tomo la iniciativa"]', 
 'motivation', 'multiple_choice'),

-- Empathy Questions (19-24)
('emotional-intelligence', 19, '¿Qué tan bien entiendes las emociones de otras personas?', 
 '["Me cuesta entender las emociones ajenas", "A veces entiendo las emociones de otros", "Generalmente entiendo bien las emociones ajenas", "Siempre entiendo claramente las emociones de otros"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 20, '¿Te pones en el lugar de otras personas?', 
 '["Raramente me pongo en el lugar de otros", "A veces puedo ponerme en su lugar", "Generalmente me pongo en su lugar", "Siempre me pongo en el lugar de otros"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 21, '¿Eres sensible a las necesidades de otros?', 
 '["No soy muy sensible a las necesidades ajenas", "A veces percibo las necesidades de otros", "Generalmente soy sensible a sus necesidades", "Siempre percibo y respondo a las necesidades de otros"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 22, '¿Puedes leer las señales no verbales de otros?', 
 '["Me cuesta leer las señales no verbales", "A veces las percibo", "Generalmente las leo bien", "Siempre interpreto correctamente las señales no verbales"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 23, '¿Respondes apropiadamente a las emociones de otros?', 
 '["No sé cómo responder a las emociones ajenas", "A veces respondo apropiadamente", "Generalmente respondo bien", "Siempre respondo de manera apropiada y empática"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 24, '¿Te preocupas genuinamente por el bienestar de otros?', 
 '["Raramente me preocupo por otros", "A veces me preocupo por otros", "Generalmente me preocupo por el bienestar ajeno", "Siempre me preocupo genuinamente por otros"]', 
 'empathy', 'multiple_choice'),

-- Social Skills Questions (25-30)
('emotional-intelligence', 25, '¿Qué tan efectivo eres comunicándote con otros?', 
 '["Me cuesta comunicarme efectivamente", "A veces me comunico bien", "Generalmente me comunico efectivamente", "Siempre me comunico de manera excelente"]', 
 'social_skills', 'multiple_choice'),

('emotional-intelligence', 26, '¿Manejas bien los conflictos interpersonales?', 
 '["Me cuesta manejar conflictos", "A veces manejo bien los conflictos", "Generalmente manejo bien los conflictos", "Siempre resuelvo conflictos efectivamente"]', 
 'social_skills', 'multiple_choice'),

('emotional-intelligence', 27, '¿Eres capaz de influir positivamente en otros?', 
 '["Me cuesta influir en otros", "A veces puedo influir positivamente", "Generalmente tengo influencia positiva", "Siempre influyo de manera positiva y constructiva"]', 
 'social_skills', 'multiple_choice'),

('emotional-intelligence', 28, '¿Trabajas bien en equipo?', 
 '["Prefiero trabajar solo/a", "A veces trabajo bien en equipo", "Generalmente soy buen/a compañero/a de equipo", "Siempre contribuyo positivamente al trabajo en equipo"]', 
 'social_skills', 'multiple_choice'),

('emotional-intelligence', 29, '¿Puedes liderar y motivar a otros?', 
 '["Me cuesta liderar a otros", "A veces puedo liderar", "Generalmente soy buen/a líder", "Siempre lidero e inspiro a otros efectivamente"]', 
 'social_skills', 'multiple_choice'),

('emotional-intelligence', 30, '¿Construyes relaciones sólidas y duraderas?', 
 '["Me cuesta construir relaciones duraderas", "A veces construyo buenas relaciones", "Generalmente construyo relaciones sólidas", "Siempre construyo relaciones fuertes y duraderas"]', 
 'social_skills', 'multiple_choice');

-- Verify the insertion
SELECT COUNT(*) as total_questions FROM test_questions WHERE test_type = 'emotional-intelligence';
SELECT category, COUNT(*) as questions_per_category 
FROM test_questions 
WHERE test_type = 'emotional-intelligence' 
GROUP BY category;
