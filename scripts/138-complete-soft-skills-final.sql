-- Complete Soft Skills Test Setup with 27 Questions
-- 16 Multiple Choice + 11 Open-ended questions across 8 competencies

-- First, ensure the test_questions table exists with proper structure
CREATE TABLE IF NOT EXISTS test_questions (
    id SERIAL PRIMARY KEY,
    test_type VARCHAR(50) NOT NULL,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer INTEGER,
    category VARCHAR(100),
    question_type VARCHAR(20) DEFAULT 'multiple_choice',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create open_responses table for AI analysis
CREATE TABLE IF NOT EXISTS open_responses (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    test_type VARCHAR(50) NOT NULL,
    question_id INTEGER NOT NULL,
    response_text TEXT NOT NULL,
    ai_analysis JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, test_type, question_id)
);

-- Clear existing soft skills questions
DELETE FROM test_questions WHERE test_type = 'soft-skills';

-- Insert 27 Soft Skills Questions (16 MC + 11 Open-ended)

-- COMMUNICATION (4 questions: 3 MC + 1 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 1, '¿Cómo prefieres comunicar ideas complejas a tu equipo?', 
 '["Presentación visual con gráficos y diagramas", "Explicación verbal detallada paso a paso", "Documento escrito con ejemplos", "Sesión interactiva de preguntas y respuestas"]', 
 'communication', 'multiple_choice'),

('soft-skills', 2, 'Cuando recibes feedback negativo, tu primera reacción es:', 
 '["Escuchar atentamente y hacer preguntas aclaratorias", "Defender tu posición con argumentos", "Tomar notas y reflexionar antes de responder", "Agradecer y pedir ejemplos específicos"]', 
 'communication', 'multiple_choice'),

('soft-skills', 3, 'En una reunión donde hay desacuerdo, tú:', 
 '["Facilitas la discusión buscando puntos en común", "Presentas datos objetivos para resolver el conflicto", "Escuchas todas las perspectivas antes de opinar", "Propones un receso para reflexionar"]', 
 'communication', 'multiple_choice'),

('soft-skills', 4, 'Describe una situación reciente donde tuviste que comunicar malas noticias o información difícil. ¿Cómo lo manejaste y qué aprendiste?', 
 NULL, 'communication', 'open_ended');

-- LEADERSHIP (4 questions: 3 MC + 1 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 5, 'Tu estilo de liderazgo se caracteriza más por:', 
 '["Dar autonomía y confiar en el equipo", "Establecer objetivos claros y hacer seguimiento", "Inspirar con una visión compartida", "Apoyar el desarrollo individual de cada miembro"]', 
 'leadership', 'multiple_choice'),

('soft-skills', 6, 'Cuando un miembro del equipo no cumple con las expectativas:', 
 '["Tienes una conversación privada para entender las causas", "Estableces un plan de mejora con metas específicas", "Ofreces recursos adicionales y capacitación", "Reasignas tareas según las fortalezas de cada uno"]', 
 'leadership', 'multiple_choice'),

('soft-skills', 7, 'Para motivar a tu equipo durante un proyecto desafiante:', 
 '["Celebras los pequeños logros y avances", "Recuerdas constantemente el propósito del proyecto", "Proporcionas los recursos necesarios para el éxito", "Mantienes comunicación abierta sobre obstáculos"]', 
 'leadership', 'multiple_choice'),

('soft-skills', 8, 'Cuenta sobre una vez que tuviste que liderar un cambio importante. ¿Cómo gestionaste la resistencia y qué estrategias usaste?', 
 NULL, 'leadership', 'open_ended');

-- TEAMWORK (3 questions: 2 MC + 1 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 9, 'En un proyecto grupal, tu rol natural tiende a ser:', 
 '["El coordinador que organiza tareas y tiempos", "El generador de ideas creativas", "El analista que evalúa opciones", "El facilitador que mantiene la armonía del grupo"]', 
 'teamwork', 'multiple_choice'),

('soft-skills', 10, 'Cuando hay conflicto entre compañeros de equipo:', 
 '["Medias buscando una solución que beneficie a ambos", "Te enfocas en los hechos para resolver objetivamente", "Facilitas una conversación abierta entre las partes", "Buscas la intervención de un supervisor si es necesario"]', 
 'teamwork', 'multiple_choice'),

('soft-skills', 11, 'Describe tu experiencia más exitosa trabajando en equipo. ¿Qué hiciste para contribuir al éxito del grupo?', 
 NULL, 'teamwork', 'open_ended');

-- PROBLEM SOLVING (3 questions: 2 MC + 1 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 12, 'Ante un problema complejo, tu primer paso es:', 
 '["Dividir el problema en partes más pequeñas", "Investigar soluciones que otros han usado", "Analizar las causas raíz del problema", "Generar múltiples alternativas de solución"]', 
 'problem-solving', 'multiple_choice'),

('soft-skills', 13, 'Cuando no tienes toda la información necesaria para decidir:', 
 '["Buscas activamente la información faltante", "Tomas la mejor decisión con la información disponible", "Consultas con expertos o colegas", "Estableces un plan para obtener la información necesaria"]', 
 'problem-solving', 'multiple_choice'),

('soft-skills', 14, 'Comparte un ejemplo de un problema complejo que resolviste recientemente. ¿Cuál fue tu proceso de pensamiento?', 
 NULL, 'problem-solving', 'open_ended');

-- ADAPTABILITY (3 questions: 2 MC + 1 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 15, 'Cuando los planes cambian inesperadamente:', 
 '["Te adaptas rápidamente y buscas nuevas oportunidades", "Evalúas el impacto y ajustas tu estrategia", "Mantienes la calma y reorganizas las prioridades", "Comunicas los cambios claramente al equipo"]', 
 'adaptability', 'multiple_choice'),

('soft-skills', 16, 'Tu actitud hacia el cambio organizacional es:', 
 '["Entusiasta - ves el cambio como oportunidad de crecimiento", "Pragmática - evalúas pros y contras antes de adaptarte", "Cautelosa - prefieres cambios graduales y bien planificados", "Colaborativa - trabajas con otros para facilitar la transición"]', 
 'adaptability', 'multiple_choice'),

('soft-skills', 17, 'Describe una situación donde tuviste que adaptarte rápidamente a un cambio significativo. ¿Cómo lo manejaste?', 
 NULL, 'adaptability', 'open_ended');

-- EMOTIONAL INTELLIGENCE (3 questions: 2 MC + 1 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 18, 'Cuando sientes estrés o frustración en el trabajo:', 
 '["Tomas un momento para respirar y reflexionar", "Hablas con alguien de confianza sobre la situación", "Te enfocas en aspectos que puedes controlar", "Buscas la causa raíz de tus emociones"]', 
 'emotional-intelligence', 'multiple_choice'),

('soft-skills', 19, 'Para entender las emociones de tus colegas:', 
 '["Observas su lenguaje corporal y tono de voz", "Haces preguntas abiertas sobre cómo se sienten", "Escuchas activamente lo que dicen y no dicen", "Compartes tus propias experiencias para crear conexión"]', 
 'emotional-intelligence', 'multiple_choice'),

('soft-skills', 20, '¿Cómo manejas tus emociones en situaciones de alta presión? Comparte un ejemplo específico.', 
 NULL, 'emotional-intelligence', 'open_ended');

-- TIME MANAGEMENT (3 questions: 2 MC + 1 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 21, 'Para gestionar múltiples tareas con fechas límite:', 
 '["Priorizas según urgencia e importancia", "Creas un cronograma detallado con hitos", "Te enfocas en una tarea a la vez hasta completarla", "Delegas o renegocías plazos cuando es necesario"]', 
 'time-management', 'multiple_choice'),

('soft-skills', 22, 'Cuando te interrumpen frecuentemente durante el trabajo:', 
 '["Estableces horarios específicos para estar disponible", "Evalúas la urgencia antes de atender la interrupción", "Comunicas claramente tus períodos de concentración", "Buscas un espacio de trabajo más tranquilo"]', 
 'time-management', 'multiple_choice'),

('soft-skills', 23, 'Describe tu sistema personal para organizar tareas y gestionar el tiempo. ¿Qué herramientas o métodos usas?', 
 NULL, 'time-management', 'open_ended');

-- CRITICAL THINKING (4 questions: 2 MC + 2 Open)
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('soft-skills', 24, 'Al evaluar una propuesta o idea nueva:', 
 '["Analizas los datos y evidencia disponible", "Consideras múltiples perspectivas y puntos de vista", "Evalúas riesgos y beneficios potenciales", "Cuestionas las suposiciones subyacentes"]', 
 'critical-thinking', 'multiple_choice'),

('soft-skills', 25, 'Cuando necesitas tomar una decisión importante:', 
 '["Recopilas toda la información relevante disponible", "Consultas con stakeholders y expertos", "Consideras las consecuencias a corto y largo plazo", "Utilizas un marco estructurado de toma de decisiones"]', 
 'critical-thinking', 'multiple_choice'),

('soft-skills', 26, 'Comparte un ejemplo donde tuviste que cuestionar una práctica establecida o una decisión popular. ¿Cómo abordaste la situación?', 
 NULL, 'critical-thinking', 'open_ended'),

('soft-skills', 27, 'Describe tu proceso para evaluar la credibilidad de información o fuentes. ¿Qué criterios usas?', 
 NULL, 'critical-thinking', 'open_ended');

-- Create demo results for testing
INSERT INTO test_results (user_email, test_type, test_name, results, score, completed_at, duration_minutes) VALUES
('demo@example.com', 'soft-skills', 'Habilidades Blandas Avanzado', '{
  "overall_score": 78,
  "competency_scores": {
    "communication": 85,
    "leadership": 72,
    "teamwork": 88,
    "problem-solving": 75,
    "adaptability": 82,
    "emotional-intelligence": 79,
    "time-management": 68,
    "critical-thinking": 74
  },
  "multiple_choice_answers": [
    {"question": 1, "answer": 0, "category": "communication", "score": 4},
    {"question": 2, "answer": 3, "category": "communication", "score": 5},
    {"question": 3, "answer": 0, "category": "communication", "score": 4}
  ],
  "open_ended_responses": {
    "communication": [{
      "question": 4,
      "response": "Recientemente tuve que comunicar a mi equipo que nuestro proyecto principal sería cancelado debido a cambios en la estrategia de la empresa. Primero, me reuní con mi supervisor para entender completamente las razones y el contexto. Luego, organicé una reunión con todo el equipo donde expliqué la situación de manera transparente, reconocí el trabajo duro que habían invertido, y me enfoqué en las oportunidades futuras. Aprendí que la honestidad y la empatía son cruciales en estas situaciones.",
      "analysis": {
        "score": 85,
        "strengths": ["Preparación previa", "Transparencia", "Empatía", "Enfoque en oportunidades futuras"],
        "improvements": ["Podría haber mencionado seguimiento individual", "Faltó mencionar apoyo emocional específico"],
        "insights": ["Demuestra madurez emocional", "Buen balance entre honestidad y esperanza"],
        "overall_assessment": "Excelente manejo de comunicación difícil con enfoque empático y estratégico",
        "recommendations": ["Desarrollar protocolos para comunicación de crisis", "Practicar técnicas de comunicación no verbal"]
      }
    }],
    "leadership": [{
      "question": 8,
      "response": "Lideré la transición de nuestro equipo al trabajo remoto durante la pandemia. Inicialmente hubo mucha resistencia, especialmente de miembros más senior. Mi estrategia fue involucrar a todos en el diseño del nuevo proceso, crear grupos de trabajo para diferentes aspectos (tecnología, comunicación, cultura), y establecer un período de prueba con feedback constante. También identifiqué a los más resistentes y trabajé con ellos individualmente para entender sus preocupaciones. Al final, el equipo no solo se adaptó sino que mejoró su productividad.",
      "analysis": {
        "score": 88,
        "strengths": ["Enfoque participativo", "Gestión individual de resistencias", "Estructura clara", "Medición de resultados"],
        "improvements": ["Podría haber anticipado mejor las resistencias", "Faltó mencionar celebración de logros"],
        "insights": ["Liderazgo transformacional efectivo", "Excelente gestión del cambio"],
        "overall_assessment": "Liderazgo excepcional con enfoque colaborativo y resultados medibles",
        "recommendations": ["Desarrollar más técnicas de anticipación de resistencias", "Crear frameworks replicables para futuros cambios"]
      }
    }]
  },
  "total_questions": 27,
  "answered_questions": 27,
  "question_breakdown": {
    "multiple_choice": 16,
    "open_ended": 11
  }
}', 78, NOW() - INTERVAL '2 days', 25)
ON CONFLICT (user_email, test_type, test_name) DO UPDATE SET
results = EXCLUDED.results,
score = EXCLUDED.score,
completed_at = EXCLUDED.completed_at,
duration_minutes = EXCLUDED.duration_minutes;

-- Insert demo results for other tests to show in dashboard
INSERT INTO test_results (user_email, test_type, test_name, results, score, completed_at, duration_minutes) VALUES
('demo@example.com', 'disc', 'DISC Assessment', '{
  "d_score": 75,
  "i_score": 65,
  "s_score": 45,
  "c_score": 85,
  "primary_type": "Compliance",
  "analysis": "Tu estilo principal es Compliance con puntuaciones: D=75%, I=65%, S=45%, C=85%"
}', 82, NOW() - INTERVAL '5 days', 12),

('demo@example.com', 'big-five', 'Big Five', '{
  "O": 78,
  "C": 85,
  "E": 62,
  "A": 88,
  "N": 35,
  "primary_traits": ["Responsable", "Amable", "Creativo"],
  "strengths": ["Alta responsabilidad", "Excelente cooperación", "Creatividad notable"],
  "personality_summary": "Perfil equilibrado con alta responsabilidad y amabilidad"
}', 75, NOW() - INTERVAL '8 days', 18),

('demo@example.com', 'mbti', 'MBTI', '{
  "type": "ENFP",
  "type_name": "El Activista",
  "scores": {"E": 18, "I": 9, "S": 8, "N": 19, "T": 11, "F": 16, "J": 9, "P": 18},
  "strengths": ["Entusiasta", "Creativo", "Empático"],
  "career_recommendations": ["Consultor", "Coach", "Director Creativo"]
}', 88, NOW() - INTERVAL '12 days', 22),

('demo@example.com', 'riasec', 'RIASEC', '{
  "R": 8, "I": 14, "A": 12, "S": 11, "E": 13, "C": 7,
  "holland_code": "IEA",
  "career_matches": ["Consultor de Innovación", "Product Manager", "Analista de Datos"],
  "strengths": ["Pensamiento analítico", "Liderazgo innovador", "Creatividad aplicada"]
}', 79, NOW() - INTERVAL '15 days', 15)
ON CONFLICT (user_email, test_type, test_name) DO UPDATE SET
results = EXCLUDED.results,
score = EXCLUDED.score,
completed_at = EXCLUDED.completed_at,
duration_minutes = EXCLUDED.duration_minutes;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_questions_type_number ON test_questions(test_type, question_number);
CREATE INDEX IF NOT EXISTS idx_test_results_user_type ON test_results(user_email, test_type);
CREATE INDEX IF NOT EXISTS idx_open_responses_user_test ON open_responses(user_email, test_type);

COMMIT;
