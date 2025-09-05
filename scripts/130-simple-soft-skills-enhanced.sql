-- Add support for open-ended questions in soft skills test
-- Update test_questions table to support question types
ALTER TABLE test_questions 
ADD COLUMN IF NOT EXISTS question_type VARCHAR(20) DEFAULT 'multiple_choice';

-- Add table for storing open-ended responses
CREATE TABLE IF NOT EXISTS open_responses (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    test_type VARCHAR(50) NOT NULL,
    question_id INTEGER NOT NULL,
    response_text TEXT NOT NULL,
    ai_analysis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_open_responses_user_test ON open_responses(user_email, test_type);
CREATE INDEX IF NOT EXISTS idx_open_responses_question ON open_responses(question_id);

-- Delete existing soft-skills questions to replace with mixed format
DELETE FROM test_questions WHERE test_type = 'soft-skills';

-- Insert Communication Questions
INSERT INTO test_questions (test_type, question_number, question_text, options, correct_answer, category, question_type) VALUES
('soft-skills', 1, 'En una reunión de equipo, un colega presenta una idea que consideras problemática. ¿Cómo respondes?', 'Espero al final de la reunión para hablar en privado|Interrumpo inmediatamente para corregir|Hago preguntas para entender mejor su perspectiva|No digo nada para evitar conflictos', 2, 'communication', 'multiple_choice'),
('soft-skills', 2, 'Describe una situación específica donde tuviste que comunicar malas noticias a tu equipo o cliente. ¿Cómo lo manejaste y qué aprendiste de esa experiencia?', '', NULL, 'communication', 'open_ended'),
('soft-skills', 3, 'Necesitas explicar un proceso complejo a un nuevo empleado. ¿Cuál es tu enfoque?', 'Le envío la documentación por email|Explico todo de una vez rápidamente|Divido la información en pasos pequeños y verifico comprensión|Le pido a otro colega que le explique', 2, 'communication', 'multiple_choice'),
('soft-skills', 4, 'Cuéntame sobre una vez cuando tuviste que adaptar tu estilo de comunicación para diferentes audiencias en el mismo proyecto. ¿Qué estrategias utilizaste?', '', NULL, 'communication', 'open_ended');

-- Insert Leadership Questions
INSERT INTO test_questions (test_type, question_number, question_text, options, correct_answer, category, question_type) VALUES
('soft-skills', 5, 'Tu equipo está desmotivado después de un proyecto fallido. ¿Qué haces?', 'Organizo una reunión para analizar qué salió mal y cómo mejorar|Les digo que olviden el pasado y sigan adelante|Reporto el problema a recursos humanos|Trabajo solo en el próximo proyecto', 0, 'leadership', 'multiple_choice'),
('soft-skills', 6, 'Describe una situación donde tuviste que liderar un equipo a través de un cambio significativo. ¿Cuáles fueron los principales desafíos y cómo los superaste?', '', NULL, 'leadership', 'open_ended'),
('soft-skills', 7, 'Un miembro de tu equipo constantemente llega tarde a las reuniones. ¿Cómo lo abordas?', 'Lo ignoro para evitar confrontación|Hablo con él en privado para entender la situación|Lo reporto inmediatamente a su supervisor|Hago comentarios sarcásticos en las reuniones', 1, 'leadership', 'multiple_choice'),
('soft-skills', 8, 'Comparte un ejemplo de cuando tuviste que tomar una decisión difícil que afectó a tu equipo. ¿Cómo comunicaste la decisión y manejaste las reacciones?', '', NULL, 'leadership', 'open_ended');

-- Insert Teamwork Questions
INSERT INTO test_questions (test_type, question_number, question_text, options, correct_answer, category, question_type) VALUES
('soft-skills', 9, 'En un proyecto grupal, hay desacuerdo sobre la dirección a tomar. ¿Qué haces?', 'Propongo una votación democrática|Facilito una discusión para encontrar puntos en común|Sigo la opinión de la persona con más experiencia|Me mantengo neutral y no opino', 1, 'teamwork', 'multiple_choice'),
('soft-skills', 10, 'Describe una experiencia trabajando con un colega difícil. ¿Cómo manejaste la situación y qué estrategias utilizaste para mantener la productividad del equipo?', '', NULL, 'teamwork', 'open_ended'),
('soft-skills', 11, 'Un colega está sobrecargado de trabajo y tú has terminado tus tareas. ¿Cómo actúas?', 'Ofrezco ayuda específica en áreas donde puedo contribuir|Le sugiero que hable con su jefe|Aprovecho para tomarme un descanso|Espero a que me pida ayuda directamente', 0, 'teamwork', 'multiple_choice');

-- Insert Problem Solving Questions
INSERT INTO test_questions (test_type, question_number, question_text, options, correct_answer, category, question_type) VALUES
('soft-skills', 12, 'Te enfrentas a un problema técnico que nunca has visto antes. ¿Cuál es tu primer paso?', 'Busco ayuda inmediatamente|Investigo y analizo el problema sistemáticamente|Pruebo soluciones al azar|Reporto que es imposible de resolver', 1, 'problem-solving', 'multiple_choice'),
('soft-skills', 13, 'Cuéntame sobre el problema más complejo que has resuelto en tu carrera. ¿Cuál fue tu proceso de pensamiento y qué recursos utilizaste?', '', NULL, 'problem-solving', 'open_ended'),
('soft-skills', 14, 'Un proceso que siempre funcionó ahora está causando problemas. ¿Cómo lo abordas?', 'Continúo usándolo porque siempre funcionó|Analizo qué cambió en el entorno o contexto|Lo abandono completamente|Culpo a otros por los cambios', 1, 'problem-solving', 'multiple_choice'),
('soft-skills', 15, 'Describe una situación donde tuviste que encontrar una solución creativa con recursos limitados. ¿Qué enfoque tomaste?', '', NULL, 'problem-solving', 'open_ended');

-- Insert Adaptability Questions
INSERT INTO test_questions (test_type, question_number, question_text, options, correct_answer, category, question_type) VALUES
('soft-skills', 16, 'Tu empresa implementa un nuevo software que cambia completamente tu flujo de trabajo. ¿Cómo reaccionas?', 'Me resisto al cambio y sigo usando el método anterior|Aprendo el nuevo sistema y busco formas de optimizarlo|Me quejo constantemente sobre el cambio|Espero a que otros lo aprendan primero', 1, 'adaptability', 'multiple_choice'),
('soft-skills', 17, 'Comparte un ejemplo de cuando tuviste que adaptarte rápidamente a un cambio inesperado en tu trabajo. ¿Cómo manejaste la transición?', '', NULL, 'adaptability', 'open_ended'),
('soft-skills', 18, 'En medio de un proyecto, el cliente cambia significativamente los requisitos. ¿Qué haces?', 'Me frustro y expreso mi molestia|Evalúo el impacto y propongo un plan ajustado|Continúo con el plan original|Abandono el proyecto', 1, 'adaptability', 'multiple_choice');

-- Insert Emotional Intelligence Questions
INSERT INTO test_questions (test_type, question_number, question_text, options, correct_answer, category, question_type) VALUES
('soft-skills', 19, 'Notas que un colega está visiblemente estresado y su rendimiento está bajando. ¿Qué haces?', 'Lo ignoro porque no es mi problema|Le ofrezco apoyo y pregunto si necesita ayuda|Reporto su bajo rendimiento|Hago su trabajo para compensar', 1, 'emotional-intelligence', 'multiple_choice'),
('soft-skills', 20, 'Describe una situación donde tuviste que manejar tus propias emociones en un momento de alta presión. ¿Qué técnicas utilizaste?', '', NULL, 'emotional-intelligence', 'open_ended'),
('soft-skills', 21, 'Recibes críticas constructivas sobre tu trabajo que te resultan difíciles de escuchar. ¿Cómo reaccionas?', 'Me defiendo y explico por qué hice las cosas así|Escucho, reflexiono y agradezco el feedback|Me molesto y evito a esa persona|Finjo estar de acuerdo pero no cambio nada', 1, 'emotional-intelligence', 'multiple_choice');

-- Insert Time Management Questions
INSERT INTO test_questions (test_type, question_number, question_text, options, correct_answer, category, question_type) VALUES
('soft-skills', 22, 'Tienes múltiples tareas urgentes y tiempo limitado. ¿Cómo priorizas?', 'Hago primero las tareas más fáciles|Evalúo impacto y urgencia para priorizar estratégicamente|Trabajo en todas simultáneamente|Pido extensión de todos los plazos', 1, 'time-management', 'multiple_choice'),
('soft-skills', 23, 'Describe tu sistema personal para manejar múltiples proyectos y deadlines. ¿Qué herramientas o métodos has encontrado más efectivos?', '', NULL, 'time-management', 'open_ended'),
('soft-skills', 24, 'Constantemente te interrumpen durante el día con solicitudes urgentes. ¿Cómo lo manejas?', 'Atiendo todas las interrupciones inmediatamente|Establezco horarios específicos para atender consultas|Ignoro todas las interrupciones|Me quejo de las constantes interrupciones', 1, 'time-management', 'multiple_choice');

-- Insert Critical Thinking & Creativity Questions
INSERT INTO test_questions (test_type, question_number, question_text, options, correct_answer, category, question_type) VALUES
('soft-skills', 25, 'Recibes información contradictoria de dos fuentes confiables. ¿Cómo procedes?', 'Creo a la fuente que prefiero|Investigo más para verificar y entender las diferencias|Uso la información más reciente|Evito tomar decisiones hasta tener certeza absoluta', 1, 'critical-thinking', 'multiple_choice'),
('soft-skills', 26, 'Cuéntame sobre una vez cuando tuviste que pensar fuera de la caja para resolver un problema o aprovechar una oportunidad. ¿Cuál fue tu proceso creativo?', '', NULL, 'creativity', 'open_ended'),
('soft-skills', 27, 'Necesitas encontrar una solución innovadora para reducir costos sin afectar la calidad. ¿Cómo abordas el desafío?', 'Copio lo que hace la competencia|Organizo sesiones de brainstorming y exploro ideas no convencionales|Reduzco gastos obvios como suministros|Contrato consultores externos', 1, 'creativity', 'multiple_choice');

SELECT 'Enhanced Soft Skills test with mixed question types setup completed successfully' as status;
