-- Complete RIASEC Career Interest Profiler Implementation
-- Based on Holland's Occupational Themes (RIASEC Model)

BEGIN;

-- Ensure test_questions table exists
CREATE TABLE IF NOT EXISTS test_questions (
    id SERIAL PRIMARY KEY,
    test_type VARCHAR(50) NOT NULL,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice',
    options TEXT,
    category VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_type, question_number)
);

-- Clear existing RIASEC questions
DELETE FROM test_questions WHERE test_type = 'riasec';

-- Insert comprehensive RIASEC questions (42 questions total: 36 MC + 6 open-ended)
-- Each RIASEC category gets 6 multiple choice questions + 1 open-ended

-- Realistic (R) - Hands-on, practical, mechanical
INSERT INTO test_questions (test_type, question_number, question_text, question_type, options, category) VALUES
('riasec', 1, 'Me gusta trabajar con herramientas y maquinaria', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'R'),
('riasec', 2, 'Prefiero actividades prácticas y manuales', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'R'),
('riasec', 3, 'Me interesa reparar y construir cosas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'R'),
('riasec', 4, 'Disfruto trabajando al aire libre', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'R'),
('riasec', 5, 'Me gusta resolver problemas técnicos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'R'),
('riasec', 6, 'Prefiero trabajar con objetos físicos que con ideas abstractas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'R'),
('riasec', 7, 'Describe un proyecto práctico o técnico del que te sientas orgulloso. ¿Qué habilidades utilizaste?', 'open_ended', NULL, 'R'),

-- Investigative (I) - Research, analysis, intellectual
('riasec', 8, 'Me fascina investigar y analizar datos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'I'),
('riasec', 9, 'Disfruto resolviendo problemas complejos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'I'),
('riasec', 10, 'Me gusta experimentar y probar teorías', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'I'),
('riasec', 11, 'Prefiero trabajar de forma independiente', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'I'),
('riasec', 12, 'Me interesa entender cómo funcionan las cosas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'I'),
('riasec', 13, 'Disfruto leyendo artículos científicos o técnicos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'I'),
('riasec', 14, '¿Qué tipo de problemas intelectuales te resultan más fascinantes y por qué?', 'open_ended', NULL, 'I'),

-- Artistic (A) - Creative, expressive, original
('riasec', 15, 'Me gusta expresarme creativamente', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'A'),
('riasec', 16, 'Disfruto diseñando y creando cosas nuevas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'A'),
('riasec', 17, 'Me interesa el arte, la música o la literatura', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'A'),
('riasec', 18, 'Prefiero ambientes de trabajo flexibles y no estructurados', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'A'),
('riasec', 19, 'Me gusta trabajar en proyectos originales e innovadores', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'A'),
('riasec', 20, 'Valoro la estética y el diseño en mi trabajo', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'A'),
('riasec', 21, 'Describe un proyecto creativo que hayas realizado. ¿Qué te inspiró y cómo lo desarrollaste?', 'open_ended', NULL, 'A'),

-- Social (S) - Helping, teaching, serving
('riasec', 22, 'Me gusta ayudar y enseñar a otros', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'S'),
('riasec', 23, 'Disfruto trabajando en equipo', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'S'),
('riasec', 24, 'Me interesa el bienestar de las personas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'S'),
('riasec', 25, 'Prefiero actividades que involucren interacción social', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'S'),
('riasec', 26, 'Me gusta resolver conflictos y mediar entre personas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'S'),
('riasec', 27, 'Disfruto trabajando en servicios comunitarios o sociales', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'S'),
('riasec', 28, '¿Cómo te sientes cuando ayudas a alguien a alcanzar sus metas? Describe una experiencia significativa.', 'open_ended', NULL, 'S'),

-- Enterprising (E) - Leading, persuading, managing
('riasec', 29, 'Me gusta liderar y dirigir proyectos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'E'),
('riasec', 30, 'Disfruto persuadiendo y vendiendo ideas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'E'),
('riasec', 31, 'Me interesa iniciar nuevos negocios o proyectos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'E'),
('riasec', 32, 'Prefiero tomar decisiones importantes', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'E'),
('riasec', 33, 'Me gusta competir y alcanzar metas ambiciosas', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'E'),
('riasec', 34, 'Disfruto negociando y cerrando acuerdos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'E'),
('riasec', 35, 'Describe una situación donde lideraste un equipo o proyecto. ¿Qué estrategias utilizaste?', 'open_ended', NULL, 'E'),

-- Conventional (C) - Organizing, data, detail-oriented
('riasec', 36, 'Me gusta organizar y planificar actividades', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'C'),
('riasec', 37, 'Disfruto trabajando con datos y números', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'C'),
('riasec', 38, 'Me interesa seguir procedimientos y sistemas establecidos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'C'),
('riasec', 39, 'Prefiero ambientes de trabajo estructurados y predecibles', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'C'),
('riasec', 40, 'Me gusta mantener registros detallados y precisos', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'C'),
('riasec', 41, 'Disfruto trabajando con sistemas y procesos eficientes', 'multiple_choice', '["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]', 'C'),
('riasec', 42, '¿Qué sistemas o procesos has creado o mejorado? ¿Cómo impactaron en la eficiencia?', 'open_ended', NULL, 'C');

-- Create career matches table for RIASEC codes
CREATE TABLE IF NOT EXISTS riasec_career_matches (
    id SERIAL PRIMARY KEY,
    holland_code VARCHAR(3) NOT NULL UNIQUE,
    career_title VARCHAR(255) NOT NULL,
    careers JSONB NOT NULL,
    work_environments JSONB NOT NULL,
    key_skills JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert career matches for all major Holland codes
INSERT INTO riasec_career_matches (holland_code, career_title, careers, work_environments, key_skills) VALUES
('RIE', 'Ingeniero Innovador', '["Ingeniero de Software", "Ingeniero Mecánico", "Arquitecto de Sistemas", "Ingeniero de Datos", "Desarrollador de Productos"]', '["Empresas tecnológicas", "Startups de ingeniería", "Departamentos de I+D", "Consultorías técnicas"]', '["Resolución de problemas técnicos", "Pensamiento analítico", "Liderazgo de proyectos", "Innovación tecnológica"]'),
('IAS', 'Investigador Creativo', '["Científico de Datos", "Investigador UX", "Psicólogo Investigador", "Analista de Comportamiento", "Diseñador de Investigación"]', '["Universidades", "Centros de investigación", "Empresas de diseño", "Consultorías de innovación"]', '["Investigación cualitativa", "Análisis creativo", "Empatía", "Pensamiento crítico"]'),
('AES', 'Emprendedor Creativo', '["Director Creativo", "Fundador de Startup Creativa", "Productor de Contenido", "Consultor de Marca", "Diseñador de Experiencias"]', '["Agencias creativas", "Startups", "Medios digitales", "Empresas de entretenimiento"]', '["Creatividad", "Liderazgo visionario", "Comunicación persuasiva", "Gestión de equipos"]'),
('SEI', 'Líder Educativo', '["Director de Capacitación", "Consultor Educativo", "Coach Ejecutivo", "Gerente de Desarrollo de Talento", "Facilitador de Innovación"]', '["Empresas de capacitación", "Consultorías", "Departamentos de RRHH", "Organizaciones educativas"]', '["Enseñanza", "Liderazgo", "Análisis de necesidades", "Diseño instruccional"]'),
('ECS', 'Gerente Organizacional', '["Gerente de Operaciones", "Director de Proyectos", "Gerente de RRHH", "Consultor Organizacional", "Gerente de Calidad"]', '["Corporaciones", "Consultorías", "Organizaciones sin fines de lucro", "Gobierno"]', '["Gestión de equipos", "Planificación estratégica", "Organización", "Liderazgo colaborativo"]'),
('CSE', 'Analista de Negocios', '["Analista Financiero", "Consultor de Negocios", "Gerente de Proyectos", "Analista de Datos", "Auditor"]', '["Empresas financieras", "Consultorías", "Corporaciones", "Firmas de auditoría"]', '["Análisis de datos", "Planificación", "Liderazgo", "Pensamiento estratégico"]');

COMMIT;

-- Verify setup
SELECT 'RIASEC Career Interest Profiler Setup Complete' as status;
SELECT COUNT(*) as total_questions FROM test_questions WHERE test_type = 'riasec';
SELECT COUNT(*) as multiple_choice FROM test_questions WHERE test_type = 'riasec' AND question_type = 'multiple_choice';
SELECT COUNT(*) as open_ended FROM test_questions WHERE test_type = 'riasec' AND question_type = 'open_ended';
SELECT COUNT(*) as career_matches FROM riasec_career_matches;
