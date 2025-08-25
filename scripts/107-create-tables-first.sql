-- Crear tablas en el orden correcto

-- 1. Tabla principal de usuarios
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    current_level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    tests_completed INTEGER DEFAULT 0,
    documents_read INTEGER DEFAULT 0,
    skills_learned INTEGER DEFAULT 0,
    career_goal TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de resultados de tests (depende de user_profiles)
CREATE TABLE IF NOT EXISTS test_results (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    results JSONB NOT NULL,
    score INTEGER,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER,
    CONSTRAINT fk_test_results_user FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE
);

-- 3. Tabla de actividades (depende de user_profiles)
CREATE TABLE IF NOT EXISTS user_activities (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_activities_user FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE
);

-- 4. Tabla independiente de knowledge_base
CREATE TABLE IF NOT EXISTS knowledge_base (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255),
    read_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_test_results_user_email ON test_results(user_email);
CREATE INDEX IF NOT EXISTS idx_test_results_test_name ON test_results(test_name);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_email ON user_activities(user_email);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);

SELECT 'Tablas creadas en orden correcto' as status;
