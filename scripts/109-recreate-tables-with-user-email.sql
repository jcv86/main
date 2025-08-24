-- Eliminar todas las tablas para recrearlas correctamente
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS coach_conversations CASCADE;
DROP TABLE IF EXISTS generated_cvs CASCADE;
DROP TABLE IF EXISTS interview_simulations CASCADE;
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS knowledge_base_documents CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Eliminar función si existe
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de perfiles de usuario (tabla principal)
CREATE TABLE user_profiles (
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

-- Tabla de resultados de tests (CON user_email)
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    results JSONB NOT NULL,
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_minutes INTEGER
);

-- Tabla de actividades del usuario (CON user_email)
CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Tabla de simulaciones de entrevistas (CON user_email)
CREATE TABLE interview_simulations (
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

-- Tabla de CVs generados (CON user_email)
CREATE TABLE generated_cvs (
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

-- Tabla de conversaciones con el coach IA (CON user_email)
CREATE TABLE coach_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    conversation_title VARCHAR(255),
    messages JSONB NOT NULL,
    mentor_philosophy VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Tabla de logros/badges (CON user_email)
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    achievement_type VARCHAR(100) NOT NULL,
    achievement_name VARCHAR(255) NOT NULL,
    achievement_description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xp_reward INTEGER DEFAULT 0,
    badge_icon VARCHAR(100)
);

-- Tabla de habilidades del usuario (CON user_email)
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    skill_category VARCHAR(100),
    proficiency_level INTEGER DEFAULT 1,
    verified BOOLEAN DEFAULT false,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de documentos de la base de conocimiento (independiente)
CREATE TABLE knowledge_base_documents (
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
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_test_results_user_email ON test_results(user_email);
CREATE INDEX idx_user_activities_user_email ON user_activities(user_email);
CREATE INDEX idx_interview_simulations_user_email ON interview_simulations(user_email);
CREATE INDEX idx_generated_cvs_user_email ON generated_cvs(user_email);
CREATE INDEX idx_coach_conversations_user_email ON coach_conversations(user_email);
CREATE INDEX idx_user_achievements_user_email ON user_achievements(user_email);
CREATE INDEX idx_user_skills_user_email ON user_skills(user_email);
CREATE INDEX idx_knowledge_base_slug ON knowledge_base_documents(slug);

-- Verificar estructura de las tablas creadas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('test_results', 'user_activities', 'interview_simulations')
    AND column_name = 'user_email'
ORDER BY table_name, ordinal_position;

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
