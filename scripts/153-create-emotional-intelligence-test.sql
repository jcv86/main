-- Create Emotional Intelligence Test with comprehensive questions
-- Covers 5 core EI competencies: Self-awareness, Self-regulation, Motivation, Empathy, Social Skills

BEGIN;

-- Ensure test_questions table exists
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

-- Clear existing emotional intelligence questions
DELETE FROM test_questions WHERE test_type = 'emotional-intelligence';

-- Insert Emotional Intelligence Test Questions (30 questions total)
-- 5 competencies × 6 questions each = 30 questions

-- SELF-AWARENESS (Autoconciencia) - 6 questions
INSERT INTO test_questions (test_type, question_number, question_text, options, category, question_type) VALUES
('emotional-intelligence', 1, 'Cuando sientes una emoción intensa, ¿qué tan bien puedes identificar exactamente qué estás sintiendo?', 
 '["Raramente puedo identificar mis emociones específicas", "A veces puedo identificar emociones básicas como alegría o tristeza", "Generalmente puedo identificar mis emociones principales", "Siempre puedo identificar y nombrar mis emociones específicas"]', 
 'self-awareness', 'multiple_choice'),

('emotional-intelligence', 2, '¿Con qué frecuencia reflexionas sobre las causas de tus reacciones emocionales?', 
 '["Nunca reflexiono sobre mis emociones", "Raramente pienso en por qué reacciono de cierta manera", "A menudo reflexiono sobre mis reacciones emocionales", "Siempre analizo las causas de mis emociones"]', 
 'self-awareness', 'multiple_choice'),

('emotional-intelligence', 3, 'Cuando recibes críticas, tu primera reacción interna es:', 
 '["Sentirme atacado y ponerme a la defensiva", "Sentir molestia pero tratar de mantener la calma", "Evaluar si la crítica tiene fundamento", "Agradecer la oportunidad de mejorar"]', 
 'self-awareness', 'multiple_choice'),

('emotional-intelligence', 4, '¿Qué tan consciente eres de cómo tus emociones afectan tu rendimiento laboral?', 
 '["No noto conexión entre mis emociones y mi trabajo", "A veces noto que mis emociones afectan mi trabajo", "Generalmente soy consciente del impacto de mis emociones", "Siempre monitoreo cómo mis emociones influyen en mi desempeño"]', 
 'self-awareness', 'multiple_choice'),

('emotional-intelligence', 5, 'Cuando estás en una situación social incómoda, ¿qué tan bien reconoces tus propias señales de incomodidad?', 
 '["No suelo darme cuenta hasta que es muy obvio", "Me doy cuenta cuando ya estoy muy incómodo", "Reconozco las señales tempranas de incomodidad", "Inmediatamente identifico cualquier cambio en mi comodidad emocional"]', 
 'self-awareness', 'multiple_choice'),

('emotional-intelligence', 6, '¿Con qué frecuencia tus emociones te sorprenden o te pillan desprevenido?', 
 '["Constantemente me sorprenden mis reacciones emocionales", "A menudo mis emociones me toman por sorpresa", "Ocasionalmente me sorprendo de mis reacciones", "Raramente me sorprenden mis emociones"]', 
 'self-awareness', 'multiple_choice'),

-- SELF-REGULATION (Autorregulación) - 6 questions
('emotional-intelligence', 7, 'Cuando sientes ira o frustración en el trabajo, ¿cómo manejas típicamente esa emoción?', 
 '["Exploto inmediatamente sin poder controlarme", "Trato de contenerme pero a menudo se nota mi molestia", "Logro mantener la calma externamente aunque por dentro esté molesto", "Puedo procesar y canalizar constructivamente mi frustración"]', 
 'self-regulation', 'multiple_choice'),

('emotional-intelligence', 8, '¿Qué tan efectivo eres para mantener la calma bajo presión?', 
 '["Me descompongo fácilmente bajo presión", "Lucho por mantener la calma en situaciones estresantes", "Generalmente mantengo la compostura bajo presión", "Siempre permanezco calmado y centrado bajo presión"]', 
 'self-regulation', 'multiple_choice'),

('emotional-intelligence', 9, 'Cuando cometes un error importante, ¿cómo reaccionas emocionalmente?', 
 '["Me culpo severamente y me quedo atascado en emociones negativas", "Me siento mal por un tiempo prolongado", "Me permito sentir la decepción pero luego me enfoco en soluciones", "Acepto el error, aprendo de él y sigo adelante rápidamente"]', 
 'self-regulation', 'multiple_choice'),

('emotional-intelligence', 10, '¿Qué tan bien puedes controlar impulsos emocionales como interrumpir a otros o reaccionar defensivamente?', 
 '["Raramente puedo controlar mis impulsos emocionales", "A veces logro controlar mis impulsos", "Generalmente puedo controlar mis impulsos emocionales", "Siempre tengo control sobre mis impulsos emocionales"]', 
 'self-regulation', 'multiple_choice'),

('emotional-intelligence', 11, 'Cuando experimentas emociones negativas intensas, ¿qué estrategias usas para regularlas?', 
 '["No tengo estrategias específicas, solo espero que pasen", "Trato de distraerme o evitar pensar en ello", "Uso técnicas como respiración profunda o tomar un descanso", "Tengo múltiples estrategias efectivas como mindfulness, reencuadre cognitivo, etc."]', 
 'self-regulation', 'multiple_choice'),

('emotional-intelligence', 12, '¿Con qué frecuencia tus emociones interfieren con tu capacidad de tomar decisiones racionales?', 
 '["Constantemente mis emociones nublan mi juicio", "A menudo mis emociones interfieren con mis decisiones", "Ocasionalmente mis emociones afectan mi toma de decisiones", "Raramente permito que las emociones interfieran con decisiones importantes"]', 
 'self-regulation', 'multiple_choice'),

-- MOTIVATION (Motivación) - 6 questions
('emotional-intelligence', 13, '¿Qué te motiva más en tu trabajo o proyectos personales?', 
 '["Principalmente recompensas externas como dinero o reconocimiento", "Una mezcla de recompensas externas y satisfacción personal", "Principalmente la satisfacción personal y el crecimiento", "El propósito, el impacto positivo y la realización personal"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 14, 'Cuando enfrentas obstáculos o fracasos, ¿cómo respondes típicamente?', 
 '["Me desanimo fácilmente y considero rendirme", "Me siento desanimado pero eventualmente continúo", "Veo los obstáculos como desafíos a superar", "Me energizo con los desafíos y los veo como oportunidades de crecimiento"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 15, '¿Qué tan comprometido estás con el crecimiento personal y profesional continuo?', 
 '["No me enfoco mucho en el crecimiento personal", "Ocasionalmente busco oportunidades de crecimiento", "Regularmente busco formas de mejorar y crecer", "Estoy constantemente comprometido con el aprendizaje y crecimiento"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 16, '¿Cómo manejas las tareas que no te resultan naturalmente interesantes?', 
 '["Las evito o las hago de mala gana", "Las hago pero con poca energía o entusiasmo", "Encuentro formas de hacerlas más interesantes o las conecto con objetivos mayores", "Mantengo alta energía y calidad sin importar la tarea"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 17, '¿Qué tan optimista eres sobre el futuro y tus posibilidades de éxito?', 
 '["Tiendo a ser pesimista sobre mis posibilidades", "Soy realista, a veces optimista, a veces pesimista", "Generalmente soy optimista sobre el futuro", "Siempre mantengo una perspectiva optimista y esperanzadora"]', 
 'motivation', 'multiple_choice'),

('emotional-intelligence', 18, '¿Con qué frecuencia te fijas metas desafiantes y trabajas persistentemente para alcanzarlas?', 
 '["Raramente me fijo metas desafiantes", "A veces me fijo metas pero no siempre las persigo", "Regularmente me fijo y trabajo hacia metas desafiantes", "Constantemente tengo metas ambiciosas y trabajo persistentemente hacia ellas"]', 
 'motivation', 'multiple_choice'),

-- EMPATHY (Empatía) - 6 questions
('emotional-intelligence', 19, '¿Qué tan bien puedes leer las emociones de otras personas a través de su lenguaje corporal y expresiones?', 
 '["Raramente noto las señales emocionales de otros", "A veces noto emociones obvias en otros", "Generalmente puedo leer las emociones básicas de otros", "Siempre puedo detectar sutiles cambios emocionales en otros"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 20, 'Cuando alguien te cuenta un problema personal, ¿cómo respondes típicamente?', 
 '["Trato de dar consejos o soluciones inmediatamente", "Escucho pero me siento incómodo con las emociones", "Escucho atentamente y valido sus sentimientos", "Me conecto profundamente con sus emociones y ofrezco apoyo empático"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 21, '¿Qué tan bien entiendes las perspectivas de personas que son muy diferentes a ti?', 
 '["Me cuesta entender perspectivas muy diferentes a la mía", "Puedo entender perspectivas diferentes con esfuerzo", "Generalmente puedo ver las cosas desde otras perspectivas", "Fácilmente me pongo en el lugar de otros, sin importar qué tan diferentes sean"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 22, 'En situaciones de conflicto, ¿qué tan bien puedes entender los sentimientos de todas las partes involucradas?', 
 '["Me enfoco principalmente en mi propia perspectiva", "Puedo entender mi perspectiva y parcialmente la de otros", "Generalmente entiendo los sentimientos de todas las partes", "Siempre considero y entiendo profundamente todas las perspectivas emocionales"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 23, '¿Con qué frecuencia otros buscan tu apoyo emocional o te confían sus problemas?', 
 '["Raramente otros me buscan para apoyo emocional", "Ocasionalmente algunos me confían sus problemas", "Regularmente las personas me buscan para apoyo", "Constantemente soy el confidente de muchas personas"]', 
 'empathy', 'multiple_choice'),

('emotional-intelligence', 24, '¿Qué tan sensible eres a los cambios de humor en tu entorno (familia, trabajo, amigos)?', 
 '["Raramente noto cambios de humor en otros", "A veces noto cuando alguien está obviamente molesto o feliz", "Generalmente detecto cambios de humor en mi entorno", "Inmediatamente percibo incluso cambios sutiles de humor en otros"]', 
 'empathy', 'multiple_choice'),

-- SOCIAL SKILLS (Habilidades Sociales) - 6 questions
('emotional-intelligence', 25, '¿Qué tan efectivo eres para resolver conflictos entre otras personas?', 
 '["Evito involucrarme en conflictos de otros", "A veces ayudo pero no siempre con buenos resultados", "Generalmente puedo ayudar a resolver conflictos efectivamente", "Soy muy hábil mediando y resolviendo conflictos entre otros"]', 
 'social-skills', 'multiple_choice'),

('emotional-intelligence', 26, '¿Cómo te desempeñas en situaciones sociales nuevas o desafiantes?', 
 '["Me siento muy incómodo y tiendo a evitarlas", "Me adapto lentamente a nuevas situaciones sociales", "Me adapto bien a la mayoría de situaciones sociales", "Prospero en cualquier situación social, nueva o desafiante"]', 
 'social-skills', 'multiple_choice'),

('emotional-intelligence', 27, '¿Qué tan bien puedes influir positivamente en las emociones y actitudes de otros?', 
 '["Raramente influyo en el estado emocional de otros", "A veces puedo mejorar el ánimo de otros", "Generalmente puedo influir positivamente en otros", "Consistentemente elevo el ánimo y la energía de quienes me rodean"]', 
 'social-skills', 'multiple_choice'),

('emotional-intelligence', 28, '¿Cómo manejas las conversaciones difíciles o sensibles?', 
 '["Las evito o las manejo muy torpemente", "Las manejo con dificultad y a menudo empeoran", "Generalmente puedo navegar conversaciones difíciles efectivamente", "Soy muy hábil manejando conversaciones sensibles con tacto y efectividad"]', 
 'social-skills', 'multiple_choice'),

('emotional-intelligence', 29, '¿Qué tan bien construyes y mantienes relaciones profesionales y personales?', 
 '["Me cuesta construir y mantener relaciones", "Tengo algunas relaciones pero requiere mucho esfuerzo", "Generalmente construyo buenas relaciones con otros", "Fácilmente construyo relaciones sólidas y duraderas"]', 
 'social-skills', 'multiple_choice'),

('emotional-intelligence', 30, '¿Con qué frecuencia otros te buscan para liderazgo o orientación en situaciones emocionales complejas?', 
 '["Raramente me ven como líder emocional", "Ocasionalmente me piden consejo", "Regularmente me buscan para orientación emocional", "Constantemente soy visto como líder y guía emocional"]', 
 'social-skills', 'multiple_choice');

-- Insert demo results for emotional intelligence test
INSERT INTO test_results (user_email, test_type, test_name, results, score, completed_at, duration_minutes) VALUES
('demo@example.com', 'emotional-intelligence', 'Inteligencia Emocional', '{
  "overall_score": 82,
  "competency_scores": {
    "self_awareness": 85,
    "self_regulation": 78,
    "motivation": 88,
    "empathy": 84,
    "social_skills": 75
  },
  "detailed_analysis": {
    "self_awareness": {
      "score": 85,
      "level": "Alto",
      "description": "Tienes una excelente conciencia de tus propias emociones y reacciones. Reconoces fácilmente tus estados emocionales y entiendes cómo estos afectan tu comportamiento y decisiones.",
      "strengths": ["Autoconocimiento emocional", "Reflexión personal", "Conciencia del impacto"],
      "development_areas": ["Predicción de reacciones emocionales"]
    },
    "self_regulation": {
      "score": 78,
      "level": "Bueno",
      "description": "Demuestras buena capacidad para manejar tus emociones, aunque hay espacio para mejorar en situaciones de alta presión.",
      "strengths": ["Control de impulsos", "Manejo del estrés", "Adaptabilidad"],
      "development_areas": ["Técnicas de regulación avanzadas", "Consistencia bajo presión"]
    },
    "motivation": {
      "score": 88,
      "level": "Muy Alto",
      "description": "Muestras una motivación intrínseca excepcional, con fuerte orientación al logro y optimismo hacia el futuro.",
      "strengths": ["Motivación intrínseca", "Perseverancia", "Optimismo", "Orientación al crecimiento"],
      "development_areas": ["Mantener motivación en tareas rutinarias"]
    },
    "empathy": {
      "score": 84,
      "level": "Alto",
      "description": "Tienes una fuerte capacidad empática, puedes entender y conectar con las emociones de otros efectivamente.",
      "strengths": ["Lectura emocional", "Perspectiva múltiple", "Conexión emocional"],
      "development_areas": ["Empatía cognitiva en situaciones complejas"]
    },
    "social_skills": {
      "score": 75,
      "level": "Bueno",
      "description": "Posees habilidades sociales sólidas, con capacidad para influir positivamente en otros, aunque puedes desarrollar más tu liderazgo emocional.",
      "strengths": ["Comunicación efectiva", "Construcción de relaciones", "Influencia positiva"],
      "development_areas": ["Liderazgo emocional", "Manejo de conflictos complejos", "Presencia social"]
    }
  },
  "ei_profile": "Líder Empático",
  "profile_description": "Tu perfil muestra un líder naturalmente empático con alta motivación intrínseca y buena autoconciencia. Tienes fortalezas particulares en motivación personal y empatía, con oportunidades de crecimiento en regulación emocional bajo presión y habilidades de liderazgo social.",
  "career_implications": {
    "ideal_roles": ["Coach/Mentor", "Líder de Equipo", "Consultor Organizacional", "Gerente de Recursos Humanos"],
    "work_environments": ["Colaborativo", "Orientado al desarrollo", "Dinámico", "Con propósito social"],
    "leadership_style": "Transformacional con enfoque en desarrollo de personas"
  },
  "development_recommendations": [
    {
      "area": "Autorregulación",
      "recommendation": "Practica técnicas avanzadas de mindfulness y respiración para mantener calma bajo presión extrema",
      "timeframe": "2-3 meses",
      "priority": "Alta"
    },
    {
      "area": "Habilidades Sociales",
      "recommendation": "Busca oportunidades de liderazgo formal para desarrollar habilidades de influencia y manejo de conflictos",
      "timeframe": "6 meses",
      "priority": "Media"
    },
    {
      "area": "Integración EI",
      "recommendation": "Considera certificación en coaching emocional para integrar todas tus fortalezas EI",
      "timeframe": "1 año",
      "priority": "Baja"
    }
  ],
  "strengths_summary": [
    "Motivación intrínseca excepcional (88%)",
    "Alta autoconciencia emocional (85%)",
    "Fuerte capacidad empática (84%)",
    "Buen control emocional general (78%)",
    "Habilidades sociales sólidas (75%)"
  ],
  "growth_areas": [
    "Regulación emocional bajo presión extrema",
    "Liderazgo emocional en grupos grandes",
    "Manejo de conflictos interpersonales complejos"
  ]
}', 82, NOW() - INTERVAL '3 days', 18)
ON CONFLICT (user_email, test_type, test_name) DO UPDATE SET
results = EXCLUDED.results,
score = EXCLUDED.score,
completed_at = EXCLUDED.completed_at,
duration_minutes = EXCLUDED.duration_minutes;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_questions_ei_type ON test_questions(test_type, category) WHERE test_type = 'emotional-intelligence';

COMMIT;
