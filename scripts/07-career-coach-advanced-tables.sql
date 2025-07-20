-- Advanced Career Coach System - 5 Specialized Tables
-- Sistema de Coach de Carrera con IA Avanzada

-- 1. COACHING SESSIONS - Sesiones de coaching con metadata avanzada
CREATE TABLE IF NOT EXISTS coaching_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_title VARCHAR(200) NOT NULL,
    session_summary TEXT,
    session_category VARCHAR(50) DEFAULT 'general', -- career_strategy, salary_negotiation, skill_development, job_search
    total_messages INTEGER DEFAULT 0,
    intelligence_level VARCHAR(20) DEFAULT 'advanced', -- basic, advanced, expert
    user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 100),
    key_topics TEXT[], -- Array of main topics discussed
    session_goals TEXT[],
    outcomes_achieved TEXT[],
    next_steps TEXT[],
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. COACHING CONVERSATIONS - Conversaciones con análisis avanzado
CREATE TABLE IF NOT EXISTS coaching_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES coaching_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    message_type VARCHAR(30) DEFAULT 'text', -- text, analysis, recommendation, insight, action_plan
    intelligence_level VARCHAR(20) DEFAULT 'advanced',
    personalization_score INTEGER CHECK (personalization_score >= 0 AND personalization_score <= 100),
    market_data_used JSONB, -- Market insights applied to this message
    user_profile_factors JSONB, -- User profile elements considered
    sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
    keywords_extracted TEXT[],
    follow_up_actions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MARKET_INTELLIGENCE - Inteligencia de mercado en tiempo real
CREATE TABLE IF NOT EXISTS market_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) NOT NULL, -- salary, companies, skills, trends, opportunities
    title VARCHAR(200) NOT NULL,
    description TEXT,
    data JSONB NOT NULL, -- Flexible data structure for different types
    relevance_score INTEGER CHECK (relevance_score >= 0 AND relevance_score <= 100),
    source VARCHAR(100), -- Where the data comes from
    geographic_scope VARCHAR(50) DEFAULT 'Chile', -- Chile, LATAM, Global
    industry_focus VARCHAR(50) DEFAULT 'Technology',
    confidence_level DECIMAL(3,2) DEFAULT 0.85, -- 0.0 to 1.0
    expiry_date TIMESTAMP WITH TIME ZONE, -- When this data becomes stale
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. USER_CAREER_PROFILES - Perfiles de carrera detallados
CREATE TABLE IF NOT EXISTS user_career_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    current_role VARCHAR(100),
    experience_level VARCHAR(30), -- Junior, Semi-Senior, Senior, Lead, Manager
    years_experience INTEGER,
    current_salary_clp INTEGER,
    target_salary_clp INTEGER,
    skills JSONB, -- {skill: level, skill: level}
    target_roles TEXT[],
    work_preferences JSONB, -- remote, hybrid, onsite, etc.
    career_goals TEXT[],
    industry_preferences TEXT[],
    company_size_preference VARCHAR(30), -- startup, scale-up, enterprise
    education_background JSONB,
    certifications TEXT[],
    languages JSONB, -- {language: level}
    availability_status VARCHAR(30) DEFAULT 'passive', -- active, passive, not_looking
    location VARCHAR(100) DEFAULT 'Santiago, Chile',
    linkedin_profile VARCHAR(200),
    github_profile VARCHAR(200),
    portfolio_url VARCHAR(200),
    personality_type VARCHAR(10), -- From DISC test
    soft_skills_scores JSONB, -- From soft skills assessment
    technical_skills_scores JSONB, -- From technical assessment
    last_profile_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PERSONALIZED_INSIGHTS - Insights personalizados y recomendaciones
CREATE TABLE IF NOT EXISTS personalized_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL, -- opportunity, skill_gap, salary_analysis, market_trend, career_path
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    confidence_score DECIMAL(3,2) DEFAULT 0.80,
    data_sources TEXT[], -- What data was used to generate this insight
    recommended_actions TEXT[],
    expected_impact VARCHAR(100), -- What impact this could have
    timeline_estimate VARCHAR(50), -- How long to implement
    related_market_data UUID[], -- References to market_intelligence records
    status VARCHAR(30) DEFAULT 'active', -- active, acknowledged, acted_upon, dismissed
    user_feedback INTEGER CHECK (user_feedback >= 1 AND user_feedback <= 5),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES for optimal performance
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_activity ON coaching_sessions(user_id, last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_session ON coaching_conversations(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_market_intelligence_category ON market_intelligence(category, relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_market_intelligence_tags ON market_intelligence USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_user_career_profiles_user ON user_career_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_personalized_insights_user_priority ON personalized_insights(user_id, priority_level, created_at DESC);

-- TRIGGERS for automatic updates
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE coaching_sessions 
    SET last_activity = NOW(), 
        total_messages = total_messages + 1,
        updated_at = NOW()
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_session_activity
    AFTER INSERT ON coaching_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_session_activity();

-- Function to auto-generate session titles
CREATE OR REPLACE FUNCTION generate_session_title()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.session_title IS NULL OR NEW.session_title = '' THEN
        NEW.session_title := 'Sesión de Coaching - ' || to_char(NEW.created_at, 'DD/MM/YYYY HH24:MI');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_generate_session_title
    BEFORE INSERT ON coaching_sessions
    FOR EACH ROW
    EXECUTE FUNCTION generate_session_title();

-- RLS Policies
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_insights ENABLE ROW LEVEL SECURITY;

-- Policies for coaching_sessions
CREATE POLICY "Users can view own coaching sessions" ON coaching_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own coaching sessions" ON coaching_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coaching sessions" ON coaching_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for coaching_conversations
CREATE POLICY "Users can view own coaching conversations" ON coaching_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own coaching conversations" ON coaching_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for market_intelligence (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view market intelligence" ON market_intelligence
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for user_career_profiles
CREATE POLICY "Users can view own career profile" ON user_career_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own career profile" ON user_career_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own career profile" ON user_career_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Policies for personalized_insights
CREATE POLICY "Users can view own personalized insights" ON personalized_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own personalized insights" ON personalized_insights
    FOR UPDATE USING (auth.uid() = user_id);
