-- Create brain feedback table
CREATE TABLE IF NOT EXISTS brain_feedback (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    conversation_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create successful patterns table for learning
CREATE TABLE IF NOT EXISTS successful_patterns (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    query_pattern TEXT NOT NULL,
    response_pattern TEXT NOT NULL,
    context JSONB,
    usage_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_brain_feedback_user ON brain_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_brain_feedback_conversation ON brain_feedback(conversation_id);
CREATE INDEX IF NOT EXISTS idx_brain_feedback_rating ON brain_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_successful_patterns_user ON successful_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_successful_patterns_usage ON successful_patterns(usage_count DESC);

-- Create view for brain analytics
CREATE OR REPLACE VIEW brain_analytics AS
SELECT 
    DATE(bf.created_at) as date,
    COUNT(*) as total_queries,
    AVG(bf.rating) as avg_rating,
    COUNT(CASE WHEN bf.rating >= 4 THEN 1 END) as positive_feedback,
    COUNT(CASE WHEN bf.rating <= 2 THEN 1 END) as negative_feedback,
    COUNT(DISTINCT bf.user_id) as unique_users
FROM brain_feedback bf
GROUP BY DATE(bf.created_at)
ORDER BY date DESC;

-- Function to get user learning patterns
CREATE OR REPLACE FUNCTION get_user_learning_patterns(p_user_id TEXT)
RETURNS TABLE (
    pattern TEXT,
    frequency INTEGER,
    avg_rating NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sp.query_pattern,
        sp.usage_count,
        AVG(bf.rating)::NUMERIC(3,2)
    FROM successful_patterns sp
    LEFT JOIN brain_feedback bf ON bf.user_id = sp.user_id
    WHERE sp.user_id = p_user_id
    GROUP BY sp.query_pattern, sp.usage_count
    ORDER BY sp.usage_count DESC, AVG(bf.rating) DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE brain_feedback IS 'Stores user feedback for brain responses to improve learning';
COMMENT ON TABLE successful_patterns IS 'Stores successful query-response patterns for future optimization';
COMMENT ON VIEW brain_analytics IS 'Analytics view for brain performance metrics';
