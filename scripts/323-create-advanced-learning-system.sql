-- =====================================================
-- ADVANCED LEARNING SYSTEM
-- Inspired by LinkedIn Learning, BetterUp, Coach.me
-- =====================================================

-- Learning Paths (LinkedIn Learning style)
CREATE TABLE IF NOT EXISTS learning_paths (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_hours INTEGER,
    skills_covered TEXT[],
    prerequisites TEXT[],
    target_roles TEXT[],
    is_active BOOLEAN DEFAULT true,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    popularity_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning Path Steps
CREATE TABLE IF NOT EXISTS learning_path_steps (
    id SERIAL PRIMARY KEY,
    path_id INTEGER REFERENCES learning_paths(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) CHECK (content_type IN ('book', 'web_resource', 'exercise', 'assessment', 'reflection')),
    content_id INTEGER,
    estimated_minutes INTEGER,
    is_required BOOLEAN DEFAULT true,
    unlock_criteria JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Learning Path Progress
CREATE TABLE IF NOT EXISTS user_learning_path_progress (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    path_id INTEGER REFERENCES learning_paths(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 1,
    completed_steps INTEGER[] DEFAULT '{}',
    status VARCHAR(50) CHECK (status IN ('not_started', 'in_progress', 'paused', 'completed')) DEFAULT 'not_started',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_activity_at TIMESTAMP,
    total_time_minutes INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_streak_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, path_id)
);

-- Skill Gap Analysis (BetterUp style)
CREATE TABLE IF NOT EXISTS user_skill_assessments (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    current_level INTEGER CHECK (current_level BETWEEN 1 AND 10),
    target_level INTEGER CHECK (target_level BETWEEN 1 AND 10),
    importance VARCHAR(20) CHECK (importance IN ('low', 'medium', 'high', 'critical')),
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_review_date DATE,
    improvement_plan JSONB,
    progress_notes TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Micro-learning Sessions (bite-sized content)
CREATE TABLE IF NOT EXISTS micro_learning_sessions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    content_type VARCHAR(50),
    content_id INTEGER,
    session_duration_seconds INTEGER,
    key_takeaways TEXT[],
    action_items TEXT[],
    completed BOOLEAN DEFAULT false,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    retention_score INTEGER CHECK (retention_score BETWEEN 1 AND 10)
);

-- Spaced Repetition System
CREATE TABLE IF NOT EXISTS spaced_repetition_items (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    content_id INTEGER NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    concept_summary TEXT NOT NULL,
    ease_factor DECIMAL(3,2) DEFAULT 2.5,
    interval_days INTEGER DEFAULT 1,
    repetitions INTEGER DEFAULT 0,
    next_review_date DATE NOT NULL,
    last_reviewed_at TIMESTAMP,
    quality_responses INTEGER[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, content_id, content_type)
);

-- Peer Comparison (Anonymous Benchmarking)
CREATE TABLE IF NOT EXISTS peer_benchmarks (
    id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    experience_level VARCHAR(50),
    percentile_25 DECIMAL(5,2),
    percentile_50 DECIMAL(5,2),
    percentile_75 DECIMAL(5,2),
    percentile_90 DECIMAL(5,2),
    sample_size INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(skill_name, industry, experience_level)
);

-- Smart Recommendations (ML-based)
CREATE TABLE IF NOT EXISTS smart_recommendations (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    recommendation_type VARCHAR(50) CHECK (recommendation_type IN ('next_book', 'skill_development', 'learning_path', 'peer_connection', 'content')),
    item_id INTEGER,
    item_type VARCHAR(50),
    title VARCHAR(200),
    reason TEXT,
    confidence_score DECIMAL(3,2),
    priority INTEGER DEFAULT 5,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'accepted', 'dismissed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- A/B Testing Framework
CREATE TABLE IF NOT EXISTS ab_test_variants (
    id SERIAL PRIMARY KEY,
    test_name VARCHAR(100) NOT NULL,
    variant_name VARCHAR(50) NOT NULL,
    description TEXT,
    config JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(test_name, variant_name)
);

CREATE TABLE IF NOT EXISTS user_ab_assignments (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    variant_name VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, test_name)
);

CREATE TABLE IF NOT EXISTS ab_test_events (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    variant_name VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Response Caching for Performance
CREATE TABLE IF NOT EXISTS brain_response_cache (
    id SERIAL PRIMARY KEY,
    query_hash VARCHAR(64) UNIQUE NOT NULL,
    query_text TEXT NOT NULL,
    response_data JSONB NOT NULL,
    user_context_hash VARCHAR(64),
    hit_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Analytics Pipeline
CREATE TABLE IF NOT EXISTS brain_analytics_events (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255),
    session_id VARCHAR(100),
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50),
    event_data JSONB,
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cost Optimization Tracking
CREATE TABLE IF NOT EXISTS api_usage_tracking (
    id SERIAL PRIMARY KEY,
    endpoint VARCHAR(200) NOT NULL,
    provider VARCHAR(50),
    model VARCHAR(100),
    tokens_used INTEGER,
    estimated_cost DECIMAL(10,6),
    response_time_ms INTEGER,
    cache_hit BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_learning_paths_category ON learning_paths(category);
CREATE INDEX IF NOT EXISTS idx_learning_paths_difficulty ON learning_paths(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_user_path_progress_user ON user_learning_path_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_user_path_progress_status ON user_learning_path_progress(status);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_user ON user_skill_assessments(user_email);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_skill ON user_skill_assessments(skill_name);
CREATE INDEX IF NOT EXISTS idx_spaced_rep_user ON spaced_repetition_items(user_email);
CREATE INDEX IF NOT EXISTS idx_spaced_rep_next_review ON spaced_repetition_items(next_review_date);
CREATE INDEX IF NOT EXISTS idx_smart_rec_user ON smart_recommendations(user_email, status);
CREATE INDEX IF NOT EXISTS idx_brain_cache_hash ON brain_response_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_brain_cache_expires ON brain_response_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON brain_analytics_events(user_email);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON brain_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage_tracking(endpoint, created_at);

-- =====================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =====================================================

-- Calculate skill gap score
CREATE OR REPLACE FUNCTION calculate_skill_gap_score(
    p_user_email VARCHAR(255)
) RETURNS TABLE (
    skill_name VARCHAR(100),
    current_level INTEGER,
    target_level INTEGER,
    gap_size INTEGER,
    priority_score DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        usa.skill_name,
        usa.current_level,
        usa.target_level,
        (usa.target_level - usa.current_level) as gap_size,
        CASE 
            WHEN usa.importance = 'critical' THEN (usa.target_level - usa.current_level) * 3.0
            WHEN usa.importance = 'high' THEN (usa.target_level - usa.current_level) * 2.0
            WHEN usa.importance = 'medium' THEN (usa.target_level - usa.current_level) * 1.5
            ELSE (usa.target_level - usa.current_level) * 1.0
        END as priority_score
    FROM user_skill_assessments usa
    WHERE usa.user_email = p_user_email
        AND usa.current_level < usa.target_level
    ORDER BY priority_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Get next spaced repetition items
CREATE OR REPLACE FUNCTION get_due_repetitions(
    p_user_email VARCHAR(255),
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
    id INTEGER,
    content_id INTEGER,
    content_type VARCHAR(50),
    concept_summary TEXT,
    days_overdue INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sri.id,
        sri.content_id,
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

-- Generate personalized learning path recommendations
CREATE OR REPLACE FUNCTION recommend_learning_paths(
    p_user_email VARCHAR(255),
    p_limit INTEGER DEFAULT 5
) RETURNS TABLE (
    path_id INTEGER,
    title VARCHAR(200),
    match_score DECIMAL(5,2),
    reason TEXT
) AS $$
DECLARE
    v_user_skills TEXT[];
    v_user_gaps TEXT[];
    v_user_interests TEXT[];
BEGIN
    -- Get user's skill gaps
    SELECT ARRAY_AGG(skill_name) INTO v_user_gaps
    FROM user_skill_assessments
    WHERE user_email = p_user_email
        AND current_level < target_level
    LIMIT 10;

    -- Get user's learning history (interests)
    SELECT ARRAY_AGG(DISTINCT category) INTO v_user_interests
    FROM user_reading_progress urp
    JOIN knowledge_base kb ON urp.book_id = kb.id
    WHERE urp.user_email = p_user_email
    LIMIT 10;

    RETURN QUERY
    SELECT 
        lp.id as path_id,
        lp.title,
        -- Calculate match score
        (
            COALESCE(
                (SELECT COUNT(*) FROM unnest(lp.skills_covered) sc
                 WHERE sc = ANY(v_user_gaps)) * 30, 0
            ) +
            COALESCE(
                (SELECT COUNT(*) FROM unnest(ARRAY[lp.category]) c
                 WHERE c = ANY(v_user_interests)) * 20, 0
            ) +
            (lp.popularity_score / 10.0) +
            CASE 
                WHEN lp.difficulty_level = 'beginner' THEN 10
                WHEN lp.difficulty_level = 'intermediate' THEN 15
                WHEN lp.difficulty_level = 'advanced' THEN 12
                ELSE 8
            END
        )::DECIMAL(5,2) as match_score,
        -- Generate reason
        CASE 
            WHEN EXISTS(SELECT 1 FROM unnest(lp.skills_covered) sc WHERE sc = ANY(v_user_gaps))
            THEN 'Aborda tus brechas de habilidades: ' || 
                 array_to_string(ARRAY(SELECT unnest(lp.skills_covered) INTERSECT SELECT unnest(v_user_gaps)), ', ')
            WHEN lp.category = ANY(v_user_interests)
            THEN 'Basado en tus intereses en ' || lp.category
            ELSE 'Popular entre profesionales similares'
        END as reason
    FROM learning_paths lp
    WHERE lp.is_active = true
    ORDER BY match_score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Update learning streak
CREATE OR REPLACE FUNCTION update_learning_streak(
    p_user_email VARCHAR(255),
    p_path_id INTEGER
) RETURNS INTEGER AS $$
DECLARE
    v_last_streak_date DATE;
    v_current_streak INTEGER;
BEGIN
    SELECT last_streak_date, streak_days 
    INTO v_last_streak_date, v_current_streak
    FROM user_learning_path_progress
    WHERE user_email = p_user_email
        AND path_id = p_path_id;

    IF v_last_streak_date IS NULL OR v_last_streak_date < CURRENT_DATE - INTERVAL '1 day' THEN
        -- Reset streak if more than 1 day gap
        v_current_streak := 1;
    ELSIF v_last_streak_date = CURRENT_DATE - INTERVAL '1 day' THEN
        -- Increment streak if consecutive day
        v_current_streak := v_current_streak + 1;
    END IF;

    UPDATE user_learning_path_progress
    SET 
        streak_days = v_current_streak,
        last_streak_date = CURRENT_DATE,
        last_activity_at = CURRENT_TIMESTAMP
    WHERE user_email = p_user_email
        AND path_id = p_path_id;

    RETURN v_current_streak;
END;
$$ LANGUAGE plpgsql;

-- Get peer benchmark percentile
CREATE OR REPLACE FUNCTION get_user_percentile(
    p_skill_name VARCHAR(100),
    p_user_score DECIMAL(5,2),
    p_industry VARCHAR(100) DEFAULT NULL,
    p_experience VARCHAR(50) DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_percentile INTEGER;
    v_p25 DECIMAL(5,2);
    v_p50 DECIMAL(5,2);
    v_p75 DECIMAL(5,2);
    v_p90 DECIMAL(5,2);
BEGIN
    SELECT percentile_25, percentile_50, percentile_75, percentile_90
    INTO v_p25, v_p50, v_p75, v_p90
    FROM peer_benchmarks
    WHERE skill_name = p_skill_name
        AND (p_industry IS NULL OR industry = p_industry)
        AND (p_experience IS NULL OR experience_level = p_experience)
    LIMIT 1;

    IF v_p90 IS NULL THEN
        RETURN NULL;
    END IF;

    IF p_user_score >= v_p90 THEN
        v_percentile := 90;
    ELSIF p_user_score >= v_p75 THEN
        v_percentile := 75;
    ELSIF p_user_score >= v_p50 THEN
        v_percentile := 50;
    ELSIF p_user_score >= v_p25 THEN
        v_percentile := 25;
    ELSE
        v_percentile := 10;
    END IF;

    RETURN v_percentile;
END;
$$ LANGUAGE plpgsql;

-- Cache brain response
CREATE OR REPLACE FUNCTION cache_brain_response(
    p_query_hash VARCHAR(64),
    p_query_text TEXT,
    p_response_data JSONB,
    p_user_context_hash VARCHAR(64) DEFAULT NULL,
    p_ttl_hours INTEGER DEFAULT 24
) RETURNS VOID AS $$
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
        CURRENT_TIMESTAMP + (p_ttl_hours || ' hours')::INTERVAL
    )
    ON CONFLICT (query_hash) 
    DO UPDATE SET
        hit_count = brain_response_cache.hit_count + 1,
        last_accessed_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Get cached response
CREATE OR REPLACE FUNCTION get_cached_response(
    p_query_hash VARCHAR(64)
) RETURNS JSONB AS $$
DECLARE
    v_response JSONB;
BEGIN
    SELECT response_data INTO v_response
    FROM brain_response_cache
    WHERE query_hash = p_query_hash
        AND expires_at > CURRENT_TIMESTAMP;

    IF v_response IS NOT NULL THEN
        UPDATE brain_response_cache
        SET 
            hit_count = hit_count + 1,
            last_accessed_at = CURRENT_TIMESTAMP
        WHERE query_hash = p_query_hash;
    END IF;

    RETURN v_response;
END;
$$ LANGUAGE plpgsql;

-- Track API usage
CREATE OR REPLACE FUNCTION track_api_usage(
    p_endpoint VARCHAR(200),
    p_provider VARCHAR(50),
    p_model VARCHAR(100),
    p_tokens INTEGER,
    p_cost DECIMAL(10,6),
    p_response_time INTEGER,
    p_cache_hit BOOLEAN DEFAULT false
) RETURNS VOID AS $$
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

-- Create materialized view for analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS brain_usage_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_queries,
    COUNT(DISTINCT user_email) as unique_users,
    AVG(CASE WHEN event_data->>'confidence' IS NOT NULL 
        THEN (event_data->>'confidence')::DECIMAL ELSE NULL END) as avg_confidence,
    COUNT(CASE WHEN event_data->>'cache_hit' = 'true' THEN 1 END) as cache_hits,
    AVG(CASE WHEN event_data->>'response_time_ms' IS NOT NULL 
        THEN (event_data->>'response_time_ms')::INTEGER ELSE NULL END) as avg_response_time_ms
FROM brain_analytics_events
WHERE event_type = 'brain_query'
GROUP BY DATE_TRUNC('day', created_at);

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_brain_analytics_date ON brain_usage_analytics(date);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_brain_analytics()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY brain_usage_analytics;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE learning_paths IS 'LinkedIn Learning-style structured learning paths';
COMMENT ON TABLE user_skill_assessments IS 'BetterUp-style skill gap analysis';
COMMENT ON TABLE spaced_repetition_items IS 'Scientific spaced repetition for better retention';
COMMENT ON TABLE peer_benchmarks IS 'Anonymous peer comparison data';
COMMENT ON TABLE smart_recommendations IS 'ML-powered personalized recommendations';
COMMENT ON TABLE brain_response_cache IS 'Response caching for performance optimization';
COMMENT ON TABLE api_usage_tracking IS 'Cost monitoring and optimization';
