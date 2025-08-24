-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verificar qué tablas existen actualmente
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Crear tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    profile_completion_percentage INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    tests_completed INTEGER DEFAULT 0,
    cv_generated INTEGER DEFAULT 0,
    interview_simulations INTEGER DEFAULT 0,
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    phone VARCHAR(50),
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT
);

-- Crear tabla de resultados de tests
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    results JSONB NOT NULL,
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_minutes INTEGER
);

-- Crear tabla de actividades del usuario
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Crear tabla de simulaciones de entrevistas
CREATE TABLE IF NOT EXISTS interview_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    simulation_type VARCHAR(100) NOT NULL,
    score DECIMAL(3,1),
    feedback TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_minutes INTEGER,
    questions_answered INTEGER,
    metadata JSONB
);

-- Crear tabla de CVs generados
CREATE TABLE IF NOT EXISTS generated_cvs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    cv_name VARCHAR(255) NOT NULL,
    cv_data JSONB NOT NULL,
    template_used VARCHAR(100),
    completeness_score INTEGER DEFAULT 0,
    ats_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Crear tabla de conversaciones con el coach IA
CREATE TABLE IF NOT EXISTS coach_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    conversation_title VARCHAR(255),
    messages JSONB NOT NULL,
    mentor_philosophy VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Crear tabla de logros/badges
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    achievement_type VARCHAR(100) NOT NULL,
    achievement_name VARCHAR(255) NOT NULL,
    achievement_description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xp_reward INTEGER DEFAULT 0,
    badge_icon VARCHAR(100)
);

-- Crear tabla de habilidades del usuario
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    skill_category VARCHAR(100),
    proficiency_level INTEGER DEFAULT 1,
    verified BOOLEAN DEFAULT false,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de documentos de la base de conocimiento
CREATE TABLE IF NOT EXISTS knowledge_base_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    author VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0
);

-- Crear índices básicos
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_test_results_user_email ON test_results(user_email);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_email ON user_activities(user_email);
CREATE INDEX IF NOT EXISTS idx_interview_simulations_user_email ON interview_simulations(user_email);
CREATE INDEX IF NOT EXISTS idx_generated_cvs_user_email ON generated_cvs(user_email);
CREATE INDEX IF NOT EXISTS idx_coach_conversations_user_email ON coach_conversations(user_email);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_email ON user_achievements(user_email);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_email ON user_skills(user_email);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_slug ON knowledge_base_documents(slug);

-- Verificar que todas las tablas se crearon
SELECT 
    table_name,
    'Created' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN (
        'user_profiles',
        'test_results', 
        'user_activities',
        'interview_simulations',
        'generated_cvs',
        'coach_conversations',
        'user_achievements',
        'user_skills',
        'knowledge_base_documents'
    )
ORDER BY table_name;

-- Mostrar el conteo actual de registros
SELECT 'user_profiles' as table_name, COUNT(*) as count FROM user_profiles
UNION ALL
SELECT 'test_results' as table_name, COUNT(*) as count FROM test_results
UNION ALL
SELECT 'user_activities' as table_name, COUNT(*) as count FROM user_activities
UNION ALL
SELECT 'interview_simulations' as table_name, COUNT(*) as count FROM interview_simulations
UNION ALL
SELECT 'generated_cvs' as table_name, COUNT(*) as count FROM generated_cvs
UNION ALL
SELECT 'coach_conversations' as table_name, COUNT(*) as count FROM coach_conversations
UNION ALL
SELECT 'user_achievements' as table_name, COUNT(*) as count FROM user_achievements
UNION ALL
SELECT 'user_skills' as table_name, COUNT(*) as count FROM user_skills
UNION ALL
SELECT 'knowledge_base_documents' as table_name, COUNT(*) as count FROM knowledge_base_documents;
