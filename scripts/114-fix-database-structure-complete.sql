-- Drop all existing tables to recreate with correct structure
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS knowledge_base CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table with ALL necessary columns
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_email VARCHAR(255) UNIQUE, -- For compatibility
    full_name VARCHAR(255),
    avatar_url TEXT,
    position VARCHAR(255),
    department VARCHAR(255),
    experience_years INTEGER DEFAULT 0,
    skills TEXT[],
    career_goal TEXT,
    career_goals TEXT, -- For compatibility
    current_level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    tests_completed INTEGER DEFAULT 0,
    documents_read INTEGER DEFAULT 0,
    skills_learned INTEGER DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create test_results table
CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    test_category VARCHAR(50) DEFAULT 'personality',
    results JSONB NOT NULL,
    score INTEGER,
    duration_minutes INTEGER,
    difficulty_level VARCHAR(20) DEFAULT 'intermediate',
    completion_percentage INTEGER DEFAULT 100,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE
);

-- Create user_activities table
CREATE TABLE user_activities (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE
);

-- Create knowledge_base table
CREATE TABLE knowledge_base (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    content TEXT,
    author VARCHAR(255),
    tags TEXT[],
    difficulty_level VARCHAR(50),
    estimated_read_time INTEGER,
    read_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_results_user_email ON test_results(user_email);
CREATE INDEX IF NOT EXISTS idx_test_results_test_name ON test_results(test_name);
CREATE INDEX IF NOT EXISTS idx_test_results_category ON test_results(test_category);
CREATE INDEX IF NOT EXISTS idx_test_results_completion ON test_results(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_email ON user_activities(user_email);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);

-- Insert sample user data
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
    'travis@dtcfinal.com',
    'travis@dtcfinal.com',
    'Travis Johnson',
    'Senior Developer',
    'Technology',
    5,
    ARRAY['JavaScript', 'React', 'Node.js', 'Python', 'Leadership'],
    'Advance to technical leadership role and mentor junior developers',
    3,
    275,
    12,
    3,
    5
),
(
    'demo@dtcfinal.com',
    'demo@dtcfinal.com',
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
);

-- Insert sample DISC test results
INSERT INTO test_results (
    user_email, 
    test_type, 
    test_name, 
    test_category,
    results, 
    score, 
    duration_minutes,
    completed_at
) VALUES 
(
    'travis@dtcfinal.com',
    'personality',
    'DISC Assessment',
    'personality',
    '{"D": 85, "I": 72, "S": 45, "C": 68, "primary_type": "D", "secondary_type": "I", "personality_summary": "Líder directo y entusiasta", "strengths": ["Toma decisiones rápidas", "Motiva a otros", "Orientado a resultados"], "areas_for_growth": ["Paciencia con procesos lentos", "Escucha activa", "Delegación efectiva"]}',
    78,
    12,
    NOW() - INTERVAL '1 day'
),
(
    'travis@dtcfinal.com',
    'personality',
    'Big Five',
    'personality',
    '{"O": 78, "C": 65, "E": 82, "A": 71, "N": 35, "primary_traits": ["Abierto a experiencias", "Extrovertido", "Emocionalmente estable"], "detailed_analysis": {"openness": "Alto nivel de creatividad y curiosidad intelectual", "conscientiousness": "Moderadamente organizado y disciplinado", "extraversion": "Muy sociable y enérgico", "agreeableness": "Cooperativo y empático", "neuroticism": "Emocionalmente estable y resiliente"}}',
    72,
    18,
    NOW() - INTERVAL '2 days'
),
(
    'travis@dtcfinal.com',
    'personality',
    'MBTI',
    'personality',
    '{"type": "ENTJ", "type_name": "El Comandante", "type_description": "Líder audaz, imaginativo y con voluntad fuerte", "scores": {"E": 12, "I": 8, "N": 14, "S": 6, "T": 15, "F": 5, "J": 13, "P": 7}, "cognitive_functions": ["Te", "Ni", "Se", "Fi"], "career_matches": ["CEO", "Entrepreneur", "Management Consultant", "Investment Banker"]}',
    85,
    16,
    NOW() - INTERVAL '3 days'
),
(
    'demo@dtcfinal.com',
    'personality',
    'DISC Assessment',
    'personality',
    '{"D": 45, "I": 88, "S": 72, "C": 55, "primary_type": "I", "secondary_type": "S", "personality_summary": "Comunicador empático y colaborativo", "strengths": ["Excelente comunicación", "Trabajo en equipo", "Motivación positiva"], "areas_for_growth": ["Toma de decisiones difíciles", "Manejo de conflictos", "Enfoque en detalles"]}',
    75,
    14,
    NOW() - INTERVAL '1 day'
);

-- Insert user activities
INSERT INTO user_activities (user_email, activity_type, activity_description, xp_earned, created_at) VALUES
('travis@dtcfinal.com', 'test_completed', 'Completó el Test DISC - Perfil: Líder Directo (D-I)', 100, NOW() - INTERVAL '1 day'),
('travis@dtcfinal.com', 'test_completed', 'Completó el Test Big Five - Perfil: Abierto y Extrovertido', 75, NOW() - INTERVAL '2 days'),
('travis@dtcfinal.com', 'test_completed', 'Completó el Test MBTI - Tipo: ENTJ (El Comandante)', 100, NOW() - INTERVAL '3 days'),
('travis@dtcfinal.com', 'document_read', 'Leyó: Leadership Fundamentals', 25, NOW() - INTERVAL '4 days'),
('travis@dtcfinal.com', 'document_read', 'Leyó: Advanced JavaScript Patterns', 30, NOW() - INTERVAL '5 days'),
('travis@dtcfinal.com', 'level_up', 'Subió al Nivel 3', 50, NOW() - INTERVAL '6 days'),
('demo@dtcfinal.com', 'test_completed', 'Completó el Test DISC - Perfil: Comunicador Empático (I-S)', 100, NOW() - INTERVAL '1 day'),
('demo@dtcfinal.com', 'document_read', 'Leyó: Effective Communication', 25, NOW() - INTERVAL '2 days'),
('demo@dtcfinal.com', 'level_up', 'Subió al Nivel 2', 50, NOW() - INTERVAL '3 days');

-- Insert knowledge base content
INSERT INTO knowledge_base (title, category, content, tags, difficulty_level, estimated_read_time, read_count) VALUES
('Leadership Fundamentals', 'Leadership', 'Essential principles of effective leadership including communication, delegation, and team building. This comprehensive guide covers the core competencies every leader needs to develop, from setting vision to managing performance and fostering team collaboration.', ARRAY['leadership', 'management', 'communication'], 'Beginner', 15, 45),
('Advanced JavaScript Patterns', 'Technical', 'Deep dive into advanced JavaScript concepts including closures, prototypes, and async patterns. Learn design patterns, performance optimization techniques, and modern ES6+ features that will elevate your coding skills.', ARRAY['javascript', 'programming', 'advanced'], 'Advanced', 25, 32),
('Career Planning Guide', 'Career Development', 'Comprehensive guide to planning your career trajectory and setting achievable goals. Includes frameworks for self-assessment, goal setting, networking strategies, and continuous learning approaches.', ARRAY['career', 'planning', 'goals'], 'Intermediate', 20, 67),
('Effective Communication', 'Soft Skills', 'Techniques for improving workplace communication and building stronger professional relationships. Covers verbal and non-verbal communication, active listening, conflict resolution, and presentation skills.', ARRAY['communication', 'soft-skills', 'relationships'], 'Beginner', 12, 89),
('Project Management Basics', 'Management', 'Introduction to project management methodologies and best practices. Learn about project lifecycle, risk management, stakeholder communication, and popular frameworks like Agile and Scrum.', ARRAY['project-management', 'methodology', 'planning'], 'Beginner', 18, 56),
('Entendiendo tu Personalidad DISC', 'Personalidad', 'Guía completa para interpretar y aplicar los resultados del test DISC en tu vida profesional. Aprende cómo cada estilo se manifiesta en el trabajo y cómo mejorar tu comunicación con otros estilos.', ARRAY['disc', 'personalidad', 'comunicación', 'liderazgo'], 'Beginner', 20, 23),
('Big Five: Los Cinco Grandes Factores', 'Personalidad', 'Profundiza en el modelo de personalidad más respaldado científicamente. Descubre cómo la Apertura, Responsabilidad, Extraversión, Amabilidad y Neuroticismo influyen en tu comportamiento y decisiones.', ARRAY['big-five', 'personalidad', 'psicología', 'autoconocimiento'], 'Intermediate', 25, 18),
('MBTI en el Ambiente Laboral', 'Personalidad', 'Aprende a aplicar tu tipo de personalidad MBTI para mejorar tu desempeño laboral, comunicación en equipo y desarrollo de carrera. Incluye estrategias específicas para cada tipo.', ARRAY['mbti', 'trabajo-en-equipo', 'desarrollo-profesional'], 'Intermediate', 30, 15),
('Desarrollo de Inteligencia Emocional', 'Soft Skills', 'Guía práctica para desarrollar tu inteligencia emocional en el contexto profesional. Incluye ejercicios y técnicas para mejorar la autoconciencia, autorregulación y habilidades sociales.', ARRAY['inteligencia-emocional', 'soft-skills', 'liderazgo'], 'Advanced', 35, 12),
('Comunicación Efectiva por Tipo de Personalidad', 'Comunicación', 'Estrategias de comunicación adaptadas a diferentes tipos de personalidad. Aprende a identificar el estilo de comunicación de otros y adaptar tu mensaje para mayor efectividad.', ARRAY['comunicación', 'personalidad', 'relaciones-interpersonales'], 'Intermediate', 22, 28);

SELECT 'Database structure created successfully with all necessary columns and sample data' as status;
