-- Learning Paths System (LinkedIn Learning style)
CREATE TABLE IF NOT EXISTS learning_paths (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_hours INTEGER,
    skills_covered TEXT[],
    prerequisites TEXT[],
    target_roles TEXT[],
    completion_rate DECIMAL(5,2) DEFAULT 0,
    popularity_score INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_path_steps (
    id SERIAL PRIMARY KEY,
    path_id INTEGER REFERENCES learning_paths(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT CHECK (content_type IN ('book', 'web_resource', 'exercise', 'assessment', 'reflection')),
    content_id INTEGER,
    estimated_minutes INTEGER,
    is_required BOOLEAN DEFAULT true,
    unlock_criteria JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_learning_path_progress (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    path_id INTEGER REFERENCES learning_paths(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 1,
    completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'paused', 'completed')) DEFAULT 'not_started',
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    total_time_minutes INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_email, path_id)
);

-- Skill Gap Analysis (BetterUp style)
CREATE TABLE IF NOT EXISTS user_skill_assessments (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    current_level INTEGER CHECK (current_level BETWEEN 0 AND 10),
    target_level INTEGER CHECK (target_level BETWEEN 0 AND 10),
    importance TEXT CHECK (importance IN ('low', 'medium', 'high', 'critical')),
    assessed_at TIMESTAMPTZ DEFAULT NOW(),
    next_review_date DATE,
    notes TEXT,
    UNIQUE(user_email, skill_name)
);

CREATE TABLE IF NOT EXISTS skill_benchmarks (
    id SERIAL PRIMARY KEY,
    skill_name TEXT NOT NULL,
    industry TEXT,
    experience_level TEXT,
    percentile_25 DECIMAL(3,1),
    percentile_50 DECIMAL(3,1),
    percentile_75 DECIMAL(3,1),
    percentile_90 DECIMAL(3,1),
    sample_size INTEGER,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(skill_name, industry, experience_level)
);

-- Spaced Repetition System (Coach.me style)
CREATE TABLE IF NOT EXISTS spaced_repetition_items (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    content_id INTEGER NOT NULL,
    content_type TEXT NOT NULL,
    concept_summary TEXT NOT NULL,
    ease_factor DECIMAL(3,2) DEFAULT 2.5,
    interval_days INTEGER DEFAULT 1,
    repetitions INTEGER DEFAULT 0,
    next_review_date DATE NOT NULL,
    last_reviewed_at TIMESTAMPTZ,
    quality_responses INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_email, content_id, content_type)
);

-- Performance Optimization: Response Caching
CREATE TABLE IF NOT EXISTS brain_response_cache (
    id SERIAL PRIMARY KEY,
    query_hash TEXT NOT NULL UNIQUE,
    query_text TEXT NOT NULL,
    response_data JSONB NOT NULL,
    user_context_hash TEXT,
    hit_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cache_query_hash ON brain_response_cache(query_hash);
CREATE INDEX idx_cache_expires_at ON brain_response_cache(expires_at);

-- Cost Optimization: API Usage Tracking
CREATE TABLE IF NOT EXISTS api_usage_tracking (
    id SERIAL PRIMARY KEY,
    endpoint TEXT NOT NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    tokens_used INTEGER NOT NULL,
    estimated_cost DECIMAL(10,6) NOT NULL,
    response_time_ms INTEGER,
    cache_hit BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_usage_created_at ON api_usage_tracking(created_at);
CREATE INDEX idx_api_usage_endpoint ON api_usage_tracking(endpoint);

-- Analytics: Brain Usage Analytics
CREATE TABLE IF NOT EXISTS brain_analytics_events (
    id SERIAL PRIMARY KEY,
    user_email TEXT,
    session_id TEXT,
    event_type TEXT NOT NULL,
    event_category TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_event_type ON brain_analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON brain_analytics_events(created_at);
CREATE INDEX idx_analytics_user_email ON brain_analytics_events(user_email);

-- A/B Testing Framework
CREATE TABLE IF NOT EXISTS ab_test_variants (
    id SERIAL PRIMARY KEY,
    test_name TEXT NOT NULL,
    variant_name TEXT NOT NULL,
    description TEXT,
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    traffic_percentage INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(test_name, variant_name)
);

CREATE TABLE IF NOT EXISTS user_ab_assignments (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    test_name TEXT NOT NULL,
    variant_name TEXT NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_email, test_name)
);

CREATE TABLE IF NOT EXISTS ab_test_events (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    test_name TEXT NOT NULL,
    variant_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Smart Recommendations
CREATE TABLE IF NOT EXISTS user_recommendations (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    recommendation_type TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    item_type TEXT NOT NULL,
    confidence_score DECIMAL(5,4),
    reason TEXT,
    priority_rank INTEGER,
    expires_at TIMESTAMPTZ,
    is_dismissed BOOLEAN DEFAULT false,
    is_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recommendations_user ON user_recommendations(user_email);
CREATE INDEX idx_recommendations_expires ON user_recommendations(expires_at);

-- Functions for Learning Path System
CREATE OR REPLACE FUNCTION calculate_skill_gap_score(p_user_email TEXT)
RETURNS TABLE (
    skill_name TEXT,
    current_level INTEGER,
    target_level INTEGER,
    gap_size INTEGER,
    priority_score DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sa.skill_name,
        sa.current_level,
        sa.target_level,
        (sa.target_level - sa.current_level) as gap_size,
        CASE sa.importance
            WHEN 'critical' THEN (sa.target_level - sa.current_level) * 2.0
            WHEN 'high' THEN (sa.target_level - sa.current_level) * 1.5
            WHEN 'medium' THEN (sa.target_level - sa.current_level) * 1.0
            ELSE (sa.target_level - sa.current_level) * 0.5
        END as priority_score
    FROM user_skill_assessments sa
    WHERE sa.user_email = p_user_email
      AND sa.current_level < sa.target_level
    ORDER BY priority_score DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION recommend_learning_paths(p_user_email TEXT, p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
    path_id INTEGER,
    title TEXT,
    match_score DECIMAL,
    reason TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH user_gaps AS (
        SELECT skill_name, (target_level - current_level) as gap
        FROM user_skill_assessments
        WHERE user_email = p_user_email
    ),
    path_matches AS (
        SELECT 
            lp.id,
            lp.title,
            lp.skills_covered,
            COUNT(*) FILTER (WHERE ug.skill_name = ANY(lp.skills_covered)) as matching_skills,
            COALESCE(AVG(ug.gap) FILTER (WHERE ug.skill_name = ANY(lp.skills_covered)), 0) as avg_gap
        FROM learning_paths lp
        LEFT JOIN user_gaps ug ON ug.skill_name = ANY(lp.skills_covered)
        WHERE lp.is_active = true
        GROUP BY lp.id, lp.title, lp.skills_covered
    )
    SELECT 
        pm.id::INTEGER as path_id,
        pm.title,
        LEAST((pm.matching_skills * 20 + pm.avg_gap * 10)::DECIMAL, 100.0) as match_score,
        CASE 
            WHEN pm.matching_skills > 2 THEN 'Aborda ' || pm.matching_skills || ' de tus brechas de habilidades'
            WHEN pm.avg_gap > 5 THEN 'Alta prioridad basada en tus objetivos'
            ELSE 'Recomendado para tu perfil'
        END as reason
    FROM path_matches pm
    ORDER BY match_score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_learning_streak(p_user_email TEXT, p_path_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    v_last_activity TIMESTAMPTZ;
    v_current_streak INTEGER;
    v_new_streak INTEGER;
BEGIN
    SELECT last_activity_at, streak_days 
    INTO v_last_activity, v_current_streak
    FROM user_learning_path_progress
    WHERE user_email = p_user_email AND path_id = p_path_id;
    
    IF v_last_activity IS NULL THEN
        v_new_streak := 1;
    ELSIF DATE(v_last_activity) = CURRENT_DATE THEN
        v_new_streak := v_current_streak;
    ELSIF DATE(v_last_activity) = CURRENT_DATE - INTERVAL '1 day' THEN
        v_new_streak := v_current_streak + 1;
    ELSE
        v_new_streak := 1;
    END IF;
    
    UPDATE user_learning_path_progress
    SET streak_days = v_new_streak
    WHERE user_email = p_user_email AND path_id = p_path_id;
    
    RETURN v_new_streak;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_due_repetitions(p_user_email TEXT, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id INTEGER,
    content_id INTEGER,
    content_type TEXT,
    concept_summary TEXT,
    days_overdue INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sri.id::INTEGER,
        sri.content_id::INTEGER,
        sri.content_type,
        sri.concept_summary,
        (CURRENT_DATE - sri.next_review_date)::INTEGER as days_overdue
    FROM spaced_repetition_items sri
    WHERE sri.user_email = p_user_email
      AND sri.next_review_date <= CURRENT_DATE
    ORDER BY sri.next_review_date ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_percentile(
    p_skill_name TEXT,
    p_user_score DECIMAL,
    p_industry TEXT DEFAULT NULL,
    p_experience TEXT DEFAULT NULL
)
RETURNS DECIMAL AS $$
DECLARE
    v_p25 DECIMAL;
    v_p50 DECIMAL;
    v_p75 DECIMAL;
    v_p90 DECIMAL;
    v_percentile DECIMAL;
BEGIN
    SELECT percentile_25, percentile_50, percentile_75, percentile_90
    INTO v_p25, v_p50, v_p75, v_p90
    FROM skill_benchmarks
    WHERE skill_name = p_skill_name
      AND (p_industry IS NULL OR industry = p_industry)
      AND (p_experience IS NULL OR experience_level = p_experience)
    LIMIT 1;
    
    IF v_p25 IS NULL THEN
        RETURN NULL;
    END IF;
    
    IF p_user_score <= v_p25 THEN
        v_percentile := 25 * (p_user_score / v_p25);
    ELSIF p_user_score <= v_p50 THEN
        v_percentile := 25 + 25 * ((p_user_score - v_p25) / (v_p50 - v_p25));
    ELSIF p_user_score <= v_p75 THEN
        v_percentile := 50 + 25 * ((p_user_score - v_p50) / (v_p75 - v_p50));
    ELSIF p_user_score <= v_p90 THEN
        v_percentile := 75 + 15 * ((p_user_score - v_p75) / (v_p90 - v_p75));
    ELSE
        v_percentile := 90 + 10 * ((p_user_score - v_p90) / (10 - v_p90));
    END IF;
    
    RETURN LEAST(v_percentile, 100);
END;
$$ LANGUAGE plpgsql;

-- Performance Functions
CREATE OR REPLACE FUNCTION get_cached_response(p_query_hash TEXT)
RETURNS JSONB AS $$
DECLARE
    v_response JSONB;
BEGIN
    UPDATE brain_response_cache
    SET hit_count = hit_count + 1,
        last_accessed_at = NOW()
    WHERE query_hash = p_query_hash
      AND expires_at > NOW()
    RETURNING response_data INTO v_response;
    
    RETURN v_response;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cache_brain_response(
    p_query_hash TEXT,
    p_query_text TEXT,
    p_response_data JSONB,
    p_user_context_hash TEXT DEFAULT NULL,
    p_ttl_hours INTEGER DEFAULT 24
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO brain_response_cache (
        query_hash,
        query_text,
        response_data,
        user_context_hash,
        expires_at
    ) VALUES (
        p_query_hash,
        p_query_text,
        p_response_data,
        p_user_context_hash,
        NOW() + (p_ttl_hours || ' hours')::INTERVAL
    )
    ON CONFLICT (query_hash) DO UPDATE
    SET response_data = p_response_data,
        expires_at = NOW() + (p_ttl_hours || ' hours')::INTERVAL,
        hit_count = 0;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION track_api_usage(
    p_endpoint TEXT,
    p_provider TEXT,
    p_model TEXT,
    p_tokens INTEGER,
    p_cost DECIMAL,
    p_response_time INTEGER,
    p_cache_hit BOOLEAN DEFAULT false
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO api_usage_tracking (
        endpoint,
        provider,
        model,
        tokens_used,
        estimated_cost,
        response_time_ms,
        cache_hit
    ) VALUES (
        p_endpoint,
        p_provider,
        p_model,
        p_tokens,
        p_cost,
        p_response_time,
        p_cache_hit
    );
END;
$$ LANGUAGE plpgsql;

-- Insert sample skill benchmarks
INSERT INTO skill_benchmarks (skill_name, industry, experience_level, percentile_25, percentile_50, percentile_75, percentile_90, sample_size)
VALUES 
    ('Liderazgo', 'Tecnología', 'Mid-Level', 5.0, 6.5, 7.5, 8.5, 1000),
    ('Comunicación Efectiva', 'Tecnología', 'Mid-Level', 5.5, 7.0, 8.0, 9.0, 1000),
    ('Gestión del Tiempo', 'Tecnología', 'Mid-Level', 5.0, 6.0, 7.5, 8.5, 1000),
    ('Inteligencia Emocional', 'Tecnología', 'Mid-Level', 5.5, 6.5, 7.5, 8.5, 1000),
    ('Pensamiento Estratégico', 'Tecnología', 'Mid-Level', 4.5, 6.0, 7.5, 8.5, 1000)
ON CONFLICT (skill_name, industry, experience_level) DO NOTHING;

COMMENT ON TABLE learning_paths IS 'Structured learning paths similar to LinkedIn Learning';
COMMENT ON TABLE user_skill_assessments IS 'Skill gap analysis similar to BetterUp';
COMMENT ON TABLE spaced_repetition_items IS 'Spaced repetition system for long-term retention';
COMMENT ON TABLE brain_response_cache IS 'Response caching for performance optimization';
COMMENT ON TABLE api_usage_tracking IS 'API usage tracking for cost optimization';
