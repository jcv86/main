-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS open_responses CASCADE;
DROP TABLE IF EXISTS test_questions CASCADE;

-- Create test_questions table with proper structure
CREATE TABLE IF NOT EXISTS test_questions (
    id SERIAL PRIMARY KEY,
    test_type VARCHAR(50) NOT NULL,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    options TEXT, -- Will store pipe-separated options for multiple choice
    category VARCHAR(100) NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'open_ended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create open_responses table for storing narrative responses
CREATE TABLE IF NOT EXISTS open_responses (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    test_type VARCHAR(50) NOT NULL,
    question_id INTEGER REFERENCES test_questions(id),
    response_text TEXT NOT NULL,
    ai_analysis JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, test_type, question_id)
);

-- Clear existing soft skills questions
DELETE FROM test_questions WHERE test_type = 'soft-skills';

-- Insert Communication questions (2 MC + 2 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 1, '¿Cómo manejas una situación donde necesitas comunicar malas noticias a tu equipo?', 'Evito la conversación hasta encontrar el momento perfecto|Comunico directamente pero con empatía y claridad|Delego la responsabilidad a mi supervisor|Minimizo la importancia del problema', 'communication', 'multiple_choice'),
('soft-skills', 2, 'Cuando hay un malentendido en el equipo, ¿cuál es tu primera acción?', 'Espero a que se resuelva solo|Busco entender todas las perspectivas antes de actuar|Tomo partido por quien considero tiene razón|Evito involucrarme en el conflicto', 'communication', 'multiple_choice'),
('soft-skills', 3, 'Describe una situación donde tuviste que comunicar una idea compleja a personas con diferentes niveles de conocimiento técnico. ¿Cómo adaptaste tu mensaje?', '', 'communication', 'open_ended'),
('soft-skills', 4, 'Cuéntanos sobre una vez que recibiste feedback negativo. ¿Cómo lo manejaste y qué aprendiste de la experiencia?', '', 'communication', 'open_ended');

-- Insert Leadership questions (2 MC + 2 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 5, '¿Cómo motivas a un miembro del equipo que está pasando por un mal momento?', 'Le doy espacio hasta que se recupere|Hablo con él para entender la situación y ofrecer apoyo|Le asigno tareas más fáciles temporalmente|Reporto la situación a recursos humanos', 'leadership', 'multiple_choice'),
('soft-skills', 6, 'Cuando lideras un proyecto con opiniones divididas, ¿qué haces?', 'Impongo mi criterio como líder|Facilito una discusión para encontrar consenso|Voto y sigo la mayoría|Busco una solución de compromiso', 'leadership', 'multiple_choice'),
('soft-skills', 7, 'Describe una situación donde tuviste que liderar un equipo a través de un cambio difícil. ¿Qué estrategias utilizaste para mantener la moral y productividad?', '', 'leadership', 'open_ended'),
('soft-skills', 8, 'Cuéntanos sobre una vez que tuviste que tomar una decisión impopular pero necesaria. ¿Cómo la comunicaste y manejaste las reacciones?', '', 'leadership', 'open_ended');

-- Insert Teamwork questions (2 MC + 1 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 9, '¿Cómo contribuyes cuando trabajas en un equipo diverso?', 'Me enfoco en mis tareas individuales|Busco entender y aprovechar las diferentes perspectivas|Trato de que todos piensen como yo|Evito los conflictos de opinión', 'teamwork', 'multiple_choice'),
('soft-skills', 10, 'Cuando un compañero no cumple con sus responsabilidades, ¿qué haces?', 'Hago su trabajo para no afectar al equipo|Hablo directamente con él sobre el problema|Lo reporto inmediatamente al supervisor|Ignoro la situación', 'teamwork', 'multiple_choice'),
('soft-skills', 11, 'Describe un proyecto colaborativo donde enfrentaste desafíos significativos. ¿Cómo contribuiste a superarlos y qué rol jugaste en el éxito del equipo?', '', 'teamwork', 'open_ended');

-- Insert Problem Solving questions (2 MC + 2 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 12, 'Ante un problema complejo sin solución obvia, ¿cuál es tu enfoque?', 'Busco soluciones que han funcionado antes|Analizo el problema desde múltiples ángulos|Pido ayuda inmediatamente|Tomo la primera solución que encuentro', 'problem-solving', 'multiple_choice'),
('soft-skills', 13, '¿Cómo priorizas cuando tienes múltiples problemas urgentes?', 'Trabajo en el más fácil primero|Evalúo impacto y urgencia de cada uno|Trabajo en todos simultáneamente|Delego todo lo que puedo', 'problem-solving', 'multiple_choice'),
('soft-skills', 14, 'Describe una situación donde tuviste que resolver un problema sin precedentes. ¿Cuál fue tu proceso de pensamiento y cómo llegaste a la solución?', '', 'problem-solving', 'open_ended'),
('soft-skills', 15, 'Cuéntanos sobre una vez que una solución que implementaste no funcionó como esperabas. ¿Cómo identificaste el problema y qué hiciste para corregirlo?', '', 'problem-solving', 'open_ended');

-- Insert Adaptability questions (2 MC + 1 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 16, '¿Cómo reaccionas cuando cambian las prioridades del proyecto a mitad del desarrollo?', 'Me frustro pero me adapto|Evalúo el impacto y ajusto mi plan|Resisto el cambio hasta entender las razones|Continúo con el plan original', 'adaptability', 'multiple_choice'),
('soft-skills', 17, 'Cuando necesitas aprender una nueva tecnología rápidamente, ¿qué haces?', 'Espero a recibir capacitación formal|Busco recursos y practico intensivamente|Pido que asignen la tarea a alguien más|Aprendo lo mínimo necesario', 'adaptability', 'multiple_choice'),
('soft-skills', 18, 'Describe una situación donde tuviste que adaptarte rápidamente a un cambio significativo en tu trabajo. ¿Cómo manejaste la transición y qué aprendiste?', '', 'adaptability', 'open_ended');

-- Insert Emotional Intelligence questions (2 MC + 1 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 19, '¿Cómo manejas tus emociones durante situaciones de alta presión?', 'Trato de no mostrar emociones|Reconozco mis emociones y las gestiono conscientemente|Dejo que las emociones guíen mis decisiones|Evito las situaciones de presión', 'emotional-intelligence', 'multiple_choice'),
('soft-skills', 20, 'Cuando notas que un colega está estresado, ¿qué haces?', 'No es mi responsabilidad|Ofrezco apoyo y escucho activamente|Le doy consejos sobre cómo manejar el estrés|Reporto la situación al supervisor', 'emotional-intelligence', 'multiple_choice'),
('soft-skills', 21, 'Describe una situación donde tuviste que manejar tus propias emociones fuertes mientras ayudabas a otros. ¿Cómo equilibraste tus necesidades con las del equipo?', '', 'emotional-intelligence', 'open_ended');

-- Insert Time Management questions (2 MC + 1 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 22, '¿Cómo organizas tu día cuando tienes múltiples deadlines?', 'Trabajo en lo que me gusta primero|Priorizo por impacto y urgencia|Trabajo en orden cronológico|Hago todo al mismo tiempo', 'time-management', 'multiple_choice'),
('soft-skills', 23, 'Cuando te interrumpen constantemente, ¿cómo mantienes la productividad?', 'Acepto todas las interrupciones|Establezco horarios específicos para estar disponible|Ignoro todas las interrupciones|Trabajo fuera de horario para compensar', 'time-management', 'multiple_choice'),
('soft-skills', 24, 'Describe cómo manejas una semana particularmente intensa con múltiples proyectos y deadlines. ¿Qué estrategias utilizas para mantener la calidad y cumplir los plazos?', '', 'time-management', 'open_ended');

-- Insert Critical Thinking questions (2 MC + 1 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 25, '¿Cómo evalúas la validez de información contradictoria?', 'Confío en la fuente más conocida|Analizo evidencias y busco fuentes adicionales|Sigo mi intuición|Pregunto a otros qué piensan', 'critical-thinking', 'multiple_choice'),
('soft-skills', 26, 'Cuando tomas decisiones importantes, ¿cuál es tu proceso?', 'Confío en mi experiencia pasada|Analizo pros, contras y posibles consecuencias|Tomo decisiones rápidamente|Busco consenso del grupo', 'critical-thinking', 'multiple_choice'),
('soft-skills', 27, 'Describe una situación donde tuviste que cuestionar una práctica establecida o una decisión popular. ¿Cómo abordaste la situación y cuál fue el resultado?', '', 'critical-thinking', 'open_ended');

-- Verify the data was inserted correctly
SELECT 
    category,
    question_type,
    COUNT(*) as question_count
FROM test_questions 
WHERE test_type = 'soft-skills'
GROUP BY category, question_type
ORDER BY category, question_type;

-- Show total count
SELECT COUNT(*) as total_questions FROM test_questions WHERE test_type = 'soft-skills';
