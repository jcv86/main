-- Primero, eliminar todas las tablas si existen para empezar limpio
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

-- Verificar y corregir la tabla user_profiles
DO $$
BEGIN
    -- Verificar si la columna email existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'email'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN email VARCHAR(255) UNIQUE;
    END IF;
    
    -- Asegurar que email no sea nulo
    UPDATE user_profiles SET email = 'user' || id || '@example.com' WHERE email IS NULL;
    ALTER TABLE user_profiles ALTER COLUMN email SET NOT NULL;
END $$;

-- Tabla de resultados de tests
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    results JSONB NOT NULL,
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_minutes INTEGER,
    UNIQUE(user_email, test_name)
);

-- Verificar y corregir foreign keys
DO $$
BEGIN
    -- Eliminar constraint existente si existe
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'test_results_user_email_fkey'
    ) THEN
        ALTER TABLE test_results DROP CONSTRAINT test_results_user_email_fkey;
    END IF;
    
    -- Recrear foreign key
    ALTER TABLE test_results 
    ADD CONSTRAINT test_results_user_email_fkey 
    FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE;
    
    -- Lo mismo para user_activities
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_activities_user_email_fkey'
    ) THEN
        ALTER TABLE user_activities DROP CONSTRAINT user_activities_user_email_fkey;
    END IF;
    
    ALTER TABLE user_activities 
    ADD CONSTRAINT user_activities_user_email_fkey 
    FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE;
END $$;

-- Tabla de actividades del usuario
CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Tabla de simulaciones de entrevistas
CREATE TABLE interview_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    simulation_type VARCHAR(100) NOT NULL,
    score DECIMAL(3,1),
    feedback TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_minutes INTEGER,
    questions_answered INTEGER,
    metadata JSONB
);

-- Tabla de CVs generados
CREATE TABLE generated_cvs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
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

-- Tabla de conversaciones con el coach IA
CREATE TABLE coach_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    conversation_title VARCHAR(255),
    messages JSONB NOT NULL,
    mentor_philosophy VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Tabla de logros/badges
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    achievement_type VARCHAR(100) NOT NULL,
    achievement_name VARCHAR(255) NOT NULL,
    achievement_description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    xp_reward INTEGER DEFAULT 0,
    badge_icon VARCHAR(100),
    UNIQUE(user_email, achievement_name)
);

-- Tabla de habilidades del usuario
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    skill_category VARCHAR(100),
    proficiency_level INTEGER DEFAULT 1,
    verified BOOLEAN DEFAULT false,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, skill_name)
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

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_test_results_user_email ON test_results(user_email);
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_test_results_test_name ON test_results(test_name);
CREATE INDEX idx_user_activities_user_email ON user_activities(user_email);
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX idx_interview_simulations_user_email ON interview_simulations(user_email);
CREATE INDEX idx_interview_simulations_user_id ON interview_simulations(user_id);
CREATE INDEX idx_generated_cvs_user_email ON generated_cvs(user_email);
CREATE INDEX idx_generated_cvs_user_id ON generated_cvs(user_id);
CREATE INDEX idx_coach_conversations_user_email ON coach_conversations(user_email);
CREATE INDEX idx_coach_conversations_user_id ON coach_conversations(user_id);
CREATE INDEX idx_user_achievements_user_email ON user_achievements(user_email);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_skills_user_email ON user_skills(user_email);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_knowledge_base_slug ON knowledge_base_documents(slug);
CREATE INDEX idx_knowledge_base_category ON knowledge_base_documents(category);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_cvs_updated_at 
    BEFORE UPDATE ON generated_cvs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_conversations_updated_at 
    BEFORE UPDATE ON coach_conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at 
    BEFORE UPDATE ON knowledge_base_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verificar que todas las tablas se crearon correctamente
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN (
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
ORDER BY tablename;

-- Mostrar estructura de la tabla user_profiles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Estructura de base de datos corregida' as status;
