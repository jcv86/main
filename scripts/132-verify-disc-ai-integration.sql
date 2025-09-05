-- Verificar y crear tablas necesarias para integración IA del DISC
DO $$
BEGIN
    -- Verificar si existe la tabla ai_interpretations
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_interpretations') THEN
        CREATE TABLE ai_interpretations (
            id SERIAL PRIMARY KEY,
            user_email VARCHAR(255) NOT NULL,
            test_name VARCHAR(100) NOT NULL,
            test_results JSONB NOT NULL,
            interpretation TEXT NOT NULL,
            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            model_version VARCHAR(50) DEFAULT 'gpt-4'
        );
    END IF;

    -- Verificar si existe la tabla ai_coaching_sessions
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_coaching_sessions') THEN
        CREATE TABLE ai_coaching_sessions (
            id SERIAL PRIMARY KEY,
            user_email VARCHAR(255) NOT NULL,
            session_type VARCHAR(50) NOT NULL,
            context_data JSONB,
            messages JSONB NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;

    -- Verificar si existe la tabla ai_insights
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_insights') THEN
        CREATE TABLE ai_insights (
            id SERIAL PRIMARY KEY,
            user_email VARCHAR(255) NOT NULL,
            insight_type VARCHAR(50) NOT NULL,
            insight_title VARCHAR(255) NOT NULL,
            insight_content TEXT NOT NULL,
            confidence_score INTEGER DEFAULT 80,
            source_tests TEXT[] DEFAULT '{}',
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;

    -- Asegurar que la tabla disc_results existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'disc_results') THEN
        CREATE TABLE disc_results (
            id SERIAL PRIMARY KEY,
            user_email VARCHAR(255) NOT NULL,
            d_score INTEGER NOT NULL,
            i_score INTEGER NOT NULL,
            s_score INTEGER NOT NULL,
            c_score INTEGER NOT NULL,
            primary_type VARCHAR(50) NOT NULL,
            analysis TEXT,
            recommendations TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;

    -- Insertar datos de prueba si no existen
    IF NOT EXISTS (SELECT FROM disc_results WHERE user_email = 'travis@example.com') THEN
        INSERT INTO disc_results (user_email, d_score, i_score, s_score, c_score, primary_type, analysis, recommendations)
        VALUES (
            'travis@example.com',
            75,
            65,
            45,
            85,
            'Compliance',
            'Tu estilo principal es Compliance con puntuaciones: D=75%, I=65%, S=45%, C=85%',
            'Continúa desarrollando tus fortalezas naturales mientras trabajas en áreas de crecimiento.'
        );
    END IF;

END $$;
