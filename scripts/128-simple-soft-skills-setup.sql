-- Ensure the user exists in user_profiles table
INSERT INTO user_profiles (
    email,
    user_email,
    full_name, 
    position, 
    department, 
    experience_years, 
    skills, 
    career_goals,
    current_level,
    total_xp,
    documents_read,
    tests_completed,
    skills_learned
) VALUES 
(
    'demo@example.com',
    'demo@example.com',
    'Demo User',
    'Product Manager',
    'Product',
    3,
    ARRAY['Product Management', 'Analytics', 'UX Design'],
    'Lead product strategy and grow into VP of Product role',
    2,
    150,
    8,
    2,
    3
)
ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    position = EXCLUDED.position,
    department = EXCLUDED.department,
    updated_at = CURRENT_TIMESTAMP;

-- Create test_questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS test_questions (
    id SERIAL PRIMARY KEY,
    test_type VARCHAR(50) NOT NULL,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    options TEXT NOT NULL,
    correct_answer INTEGER,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_type, question_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_questions_type ON test_questions(test_type);
CREATE INDEX IF NOT EXISTS idx_test_questions_category ON test_questions(test_type, category);

-- Delete existing soft-skills questions to avoid duplicates
DELETE FROM test_questions WHERE test_type = 'soft-skills';

-- Insert soft skills test questions with pipe-separated format
INSERT INTO test_questions (test_type, question_number, question_text, options, correct_answer, category) VALUES
-- Communication Questions (1-3)
('soft-skills', 1, 'En una reunión de equipo, un colega presenta una idea que consideras problemática. ¿Cómo respondes?', 
 'Espero al final de la reunión para hablar en privado|Interrumpo inmediatamente para corregir|Hago preguntas para entender mejor su perspectiva|No digo nada para evitar conflictos', 
 2, 'communication'),

('soft-skills', 2, 'Necesitas explicar un proceso complejo a un nuevo empleado. ¿Cuál es tu enfoque?', 
 'Le envío la documentación por email|Explico todo de una vez rápidamente|Divido la información en pasos pequeños y verifico comprensión|Le pido a otro colega que le explique', 
 2, 'communication'),

('soft-skills', 3, 'Un cliente está frustrado por un retraso en el proyecto. ¿Cómo manejas la situación?', 
 'Explico que no es mi culpa|Escucho activamente y reconozco su frustración|Le digo que se calme|Transfiero la llamada a mi supervisor', 
 1, 'communication'),

-- Leadership Questions (4-6)
('soft-skills', 4, 'Tu equipo está desmotivado después de un proyecto fallido. ¿Qué haces?', 
 'Organizo una reunión para analizar qué salió mal y cómo mejorar|Les digo que olviden el pasado y sigan adelante|Reporto el problema a recursos humanos|Trabajo solo en el próximo proyecto', 
 0, 'leadership'),

('soft-skills', 5, 'Un miembro de tu equipo constantemente llega tarde a las reuniones. ¿Cómo lo abordas?', 
 'Lo ignoro para evitar confrontación|Hablo con él en privado para entender la situación|Lo reporto inmediatamente a su supervisor|Hago comentarios sarcásticos en las reuniones', 
 1, 'leadership'),

('soft-skills', 6, 'Necesitas delegar una tarea importante pero compleja. ¿Cuál es tu estrategia?', 
 'Elijo a la persona más disponible|Selecciono basándome en habilidades y proporciono apoyo claro|La hago yo mismo para asegurar calidad|La divido entre varias personas sin coordinación', 
 1, 'leadership'),

-- Teamwork Questions (7-9)
('soft-skills', 7, 'En un proyecto grupal, hay desacuerdo sobre la dirección a tomar. ¿Qué haces?', 
 'Propongo una votación democrática|Facilito una discusión para encontrar puntos en común|Sigo la opinión de la persona con más experiencia|Me mantengo neutral y no opino', 
 1, 'teamwork'),

('soft-skills', 8, 'Un colega está sobrecargado de trabajo y tú has terminado tus tareas. ¿Cómo actúas?', 
 'Ofrezco ayuda específica en áreas donde puedo contribuir|Le sugiero que hable con su jefe|Aprovecho para tomarme un descanso|Espero a que me pida ayuda directamente', 
 0, 'teamwork'),

('soft-skills', 9, 'Durante una lluvia de ideas, alguien propone una idea que ya se intentó antes sin éxito. ¿Qué haces?', 
 'Menciono inmediatamente que ya se probó|Pregunto cómo podríamos mejorar esa idea esta vez|Cambio de tema discretamente|Apoyo la idea sin mencionar el pasado', 
 1, 'teamwork'),

-- Problem Solving Questions (10-12)
('soft-skills', 10, 'Te enfrentas a un problema técnico que nunca has visto antes. ¿Cuál es tu primer paso?', 
 'Busco ayuda inmediatamente|Investigo y analizo el problema sistemáticamente|Pruebo soluciones al azar|Reporto que es imposible de resolver', 
 1, 'problem-solving'),

('soft-skills', 11, 'Un proceso que siempre funcionó ahora está causando problemas. ¿Cómo lo abordas?', 
 'Continúo usándolo porque siempre funcionó|Analizo qué cambió en el entorno o contexto|Lo abandono completamente|Culpo a otros por los cambios', 
 1, 'problem-solving'),

('soft-skills', 12, 'Tienes múltiples soluciones posibles para un problema. ¿Cómo decides cuál usar?', 
 'Elijo la más rápida de implementar|Evalúo pros, contras y riesgos de cada opción|Pregunto a mi jefe qué hacer|Uso la que otros han usado antes', 
 1, 'problem-solving'),

-- Adaptability Questions (13-15)
('soft-skills', 13, 'Tu empresa implementa un nuevo software que cambia completamente tu flujo de trabajo. ¿Cómo reaccionas?', 
 'Me resisto al cambio y sigo usando el método anterior|Aprendo el nuevo sistema y busco formas de optimizarlo|Me quejo constantemente sobre el cambio|Espero a que otros lo aprendan primero', 
 1, 'adaptability'),

('soft-skills', 14, 'En medio de un proyecto, el cliente cambia significativamente los requisitos. ¿Qué haces?', 
 'Me frustro y expreso mi molestia|Evalúo el impacto y propongo un plan ajustado|Continúo con el plan original|Abandono el proyecto', 
 1, 'adaptability'),

('soft-skills', 15, 'Tu rol en la empresa evoluciona y ahora incluye responsabilidades que no esperabas. ¿Cómo respondes?', 
 'Acepto el desafío y busco desarrollar las habilidades necesarias|Pido que me transfieran a otro puesto|Hago solo lo que sé hacer bien|Me quejo de que no es lo que firmé', 
 0, 'adaptability'),

-- Emotional Intelligence Questions (16-18)
('soft-skills', 16, 'Notas que un colega está visiblemente estresado y su rendimiento está bajando. ¿Qué haces?', 
 'Lo ignoro porque no es mi problema|Le ofrezco apoyo y pregunto si necesita ayuda|Reporto su bajo rendimiento|Hago su trabajo para compensar', 
 1, 'emotional-intelligence'),

('soft-skills', 17, 'Recibes críticas constructivas sobre tu trabajo que te resultan difíciles de escuchar. ¿Cómo reaccionas?', 
 'Me defiendo y explico por qué hice las cosas así|Escucho, reflexiono y agradezco el feedback|Me molesto y evito a esa persona|Finjo estar de acuerdo pero no cambio nada', 
 1, 'emotional-intelligence'),

('soft-skills', 18, 'Durante una presentación importante, cometes un error notable. ¿Cómo manejas la situación?', 
 'Continúo como si nada hubiera pasado|Reconozco el error, lo corrijo y sigo adelante|Me disculpo excesivamente y pierdo confianza|Culpo a factores externos', 
 1, 'emotional-intelligence'),

-- Time Management Questions (19-21)
('soft-skills', 19, 'Tienes múltiples tareas urgentes y tiempo limitado. ¿Cómo priorizas?', 
 'Hago primero las tareas más fáciles|Evalúo impacto y urgencia para priorizar estratégicamente|Trabajo en todas simultáneamente|Pido extensión de todos los plazos', 
 1, 'time-management'),

('soft-skills', 20, 'Constantemente te interrumpen durante el día con solicitudes urgentes. ¿Cómo lo manejas?', 
 'Atiendo todas las interrupciones inmediatamente|Establezco horarios específicos para atender consultas|Ignoro todas las interrupciones|Me quejo de las constantes interrupciones', 
 1, 'time-management'),

('soft-skills', 21, 'Un proyecto está tomando más tiempo del estimado. ¿Cuál es tu enfoque?', 
 'Trabajo horas extra hasta terminarlo|Analizo qué está causando el retraso y ajusto el plan|Entrego lo que tengo en la fecha original|Pido más tiempo sin explicación', 
 1, 'time-management'),

-- Critical Thinking Questions (22-23)
('soft-skills', 22, 'Recibes información contradictoria de dos fuentes confiables. ¿Cómo procedes?', 
 'Creo a la fuente que prefiero|Investigo más para verificar y entender las diferencias|Uso la información más reciente|Evito tomar decisiones hasta tener certeza absoluta', 
 1, 'critical-thinking'),

('soft-skills', 23, 'Tu equipo está considerando una decisión importante basada en datos limitados. ¿Qué sugieres?', 
 'Proceder con la información disponible|Identificar qué información adicional necesitamos y cómo obtenerla|Postponer la decisión indefinidamente|Seguir la intuición del líder', 
 1, 'critical-thinking'),

-- Creativity Questions (24-25)
('soft-skills', 24, 'Necesitas encontrar una solución innovadora para reducir costos sin afectar la calidad. ¿Cómo abordas el desafío?', 
 'Copio lo que hace la competencia|Organizo sesiones de brainstorming y exploro ideas no convencionales|Reduzco gastos obvios como suministros|Contrato consultores externos', 
 1, 'creativity'),

('soft-skills', 25, 'Un proceso rutinario está volviéndose ineficiente. ¿Cómo lo mejoras?', 
 'Lo dejo como está porque funciona|Analizo el proceso y busco formas creativas de optimizarlo|Pido a otros que lo cambien|Automatizo todo sin considerar el contexto', 
 1, 'creativity');

SELECT 'Soft Skills test questions setup completed successfully' as status;
