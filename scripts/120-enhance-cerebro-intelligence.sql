-- Enhance Cerebro Intelligence System
-- Add advanced memory, reasoning, and personalization capabilities

-- 1. Create conversation memory table for long-term context
CREATE TABLE IF NOT EXISTS cerebro_conversation_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  conversation_id UUID NOT NULL,
  memory_type VARCHAR(50) NOT NULL, -- 'fact', 'preference', 'goal', 'insight', 'pattern'
  content TEXT NOT NULL,
  importance_score INTEGER DEFAULT 5, -- 1-10 scale
  confidence_score DECIMAL(3,2) DEFAULT 0.80,
  created_at TIMESTAMP DEFAULT NOW(),
  last_accessed TIMESTAMP DEFAULT NOW(),
  access_count INTEGER DEFAULT 0,
  embedding vector(1536), -- For semantic memory search
  tags TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_cerebro_memory_user ON cerebro_conversation_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_cerebro_memory_type ON cerebro_conversation_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_cerebro_memory_importance ON cerebro_conversation_memory(importance_score DESC);

-- 2. Create reasoning chains table for multi-step analysis
CREATE TABLE IF NOT EXISTS cerebro_reasoning_chains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  query TEXT NOT NULL,
  reasoning_steps JSONB NOT NULL, -- Array of reasoning steps
  final_conclusion TEXT NOT NULL,
  confidence_score DECIMAL(3,2),
  sources_used JSONB, -- References to knowledge base
  created_at TIMESTAMP DEFAULT NOW(),
  processing_time_ms INTEGER,
  was_helpful BOOLEAN,
  user_feedback TEXT
);

CREATE INDEX IF NOT EXISTS idx_reasoning_user ON cerebro_reasoning_chains(user_id);
CREATE INDEX IF NOT EXISTS idx_reasoning_helpful ON cerebro_reasoning_chains(was_helpful) WHERE was_helpful IS NOT NULL;

-- 3. Create user learning patterns table
CREATE TABLE IF NOT EXISTS cerebro_user_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  pattern_type VARCHAR(50) NOT NULL, -- 'query_style', 'learning_preference', 'topic_interest', 'time_pattern'
  pattern_data JSONB NOT NULL,
  confidence DECIMAL(3,2) DEFAULT 0.70,
  sample_size INTEGER DEFAULT 1,
  first_observed TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_patterns_user ON cerebro_user_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_patterns_type ON cerebro_user_patterns(pattern_type);

-- 4. Create predictive insights table
CREATE TABLE IF NOT EXISTS cerebro_predictive_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  insight_type VARCHAR(50) NOT NULL, -- 'skill_gap', 'career_opportunity', 'learning_recommendation', 'goal_suggestion'
  prediction TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  confidence_score DECIMAL(3,2),
  priority INTEGER DEFAULT 5, -- 1-10
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'shown', 'accepted', 'dismissed'
  created_at TIMESTAMP DEFAULT NOW(),
  shown_at TIMESTAMP,
  user_action VARCHAR(20), -- 'accepted', 'dismissed', 'ignored'
  action_taken_at TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_predictive_user ON cerebro_predictive_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_predictive_status ON cerebro_predictive_insights(status);
CREATE INDEX IF NOT EXISTS idx_predictive_priority ON cerebro_predictive_insights(priority DESC);

-- 5. Create feedback learning table
CREATE TABLE IF NOT EXISTS cerebro_feedback_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  feedback_type VARCHAR(20) NOT NULL, -- 'positive', 'negative', 'correction'
  feedback_details TEXT,
  rating INTEGER, -- 1-5 stars
  what_worked TEXT,
  what_didnt_work TEXT,
  suggested_improvement TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  applied_to_model BOOLEAN DEFAULT false,
  improvement_impact JSONB -- Track if changes improved future responses
);

CREATE INDEX IF NOT EXISTS idx_feedback_user ON cerebro_feedback_learning(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON cerebro_feedback_learning(feedback_type);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON cerebro_feedback_learning(rating);

-- 6. Create context aggregation view
-- Fixed column references to use 'id' instead of 'user_id' from user_profiles table
CREATE OR REPLACE VIEW cerebro_user_context AS
SELECT 
  up.id as user_id,
  up.email,
  up.name,
  up.career_profile,
  up.personality_insights,
  up.test_results,
  
  -- Aggregate conversation memories
  (SELECT json_agg(json_build_object(
    'type', memory_type,
    'content', content,
    'importance', importance_score
  ) ORDER BY importance_score DESC, last_accessed DESC)
   FROM cerebro_conversation_memory 
   WHERE user_id = up.id 
   AND importance_score >= 7
   LIMIT 10) as key_memories,
  
  -- Aggregate learning patterns
  (SELECT json_agg(json_build_object(
    'pattern_type', pattern_type,
    'data', pattern_data,
    'confidence', confidence
  ))
   FROM cerebro_user_patterns 
   WHERE user_id = up.id 
   AND is_active = true) as learning_patterns,
  
  -- Recent test results
  (SELECT json_agg(json_build_object(
    'test_type', test_type,
    'score', score,
    'completed_at', completed_at
  ) ORDER BY completed_at DESC)
   FROM test_results 
   WHERE user_email = up.email 
   LIMIT 5) as recent_tests,
  
  -- Active goals
  (SELECT json_agg(json_build_object(
    'title', title,
    'category', category,
    'progress', progress,
    'target_date', target_date
  ))
   FROM career_goals 
   WHERE user_id = up.id 
   AND status = 'active') as active_goals,
  
  -- Feedback history summary
  (SELECT json_build_object(
    'avg_rating', AVG(rating),
    'total_feedback', COUNT(*),
    'positive_count', SUM(CASE WHEN feedback_type = 'positive' THEN 1 ELSE 0 END),
    'negative_count', SUM(CASE WHEN feedback_type = 'negative' THEN 1 ELSE 0 END)
  )
   FROM cerebro_feedback_learning 
   WHERE user_id = up.id) as feedback_summary

FROM user_profiles up;

-- 7. Function to update memory importance based on access
CREATE OR REPLACE FUNCTION update_memory_access()
RETURNS TRIGGER AS $$
BEGIN
  NEW.access_count = OLD.access_count + 1;
  NEW.last_accessed = NOW();
  
  -- Increase importance if accessed frequently
  IF NEW.access_count > 5 AND NEW.importance_score < 10 THEN
    NEW.importance_score = LEAST(NEW.importance_score + 1, 10);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_memory_access ON cerebro_conversation_memory;
CREATE TRIGGER trigger_memory_access
BEFORE UPDATE ON cerebro_conversation_memory
FOR EACH ROW
WHEN (OLD.last_accessed IS DISTINCT FROM NEW.last_accessed)
EXECUTE FUNCTION update_memory_access();

-- 8. Function for semantic memory search
CREATE OR REPLACE FUNCTION search_cerebro_memory(
  p_user_id UUID,
  p_query_embedding vector(1536),
  p_similarity_threshold DECIMAL DEFAULT 0.75,
  p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  memory_id UUID,
  memory_type VARCHAR,
  content TEXT,
  importance_score INTEGER,
  similarity_score DECIMAL,
  tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    memory_type,
    content,
    importance_score,
    (1 - (embedding <=> p_query_embedding))::DECIMAL(3,2) as similarity,
    tags
  FROM cerebro_conversation_memory
  WHERE user_id = p_user_id
    AND embedding IS NOT NULL
    AND (1 - (embedding <=> p_query_embedding)) >= p_similarity_threshold
  ORDER BY 
    (1 - (embedding <=> p_query_embedding)) DESC,
    importance_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- 9. Create analytics view for Cerebro performance
CREATE OR REPLACE VIEW cerebro_intelligence_metrics AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_queries,
  AVG(confidence_score) as avg_confidence,
  AVG(processing_time_ms) as avg_processing_time,
  SUM(CASE WHEN was_helpful = true THEN 1 ELSE 0 END) as helpful_responses,
  SUM(CASE WHEN was_helpful = false THEN 1 ELSE 0 END) as unhelpful_responses,
  (SUM(CASE WHEN was_helpful = true THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(*), 0) * 100) as helpfulness_rate
FROM cerebro_reasoning_chains
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

COMMENT ON TABLE cerebro_conversation_memory IS 'Stores long-term memory for Cerebro AI to maintain context across sessions';
COMMENT ON TABLE cerebro_reasoning_chains IS 'Tracks multi-step reasoning processes for complex queries';
COMMENT ON TABLE cerebro_user_patterns IS 'Learns and stores user behavior patterns for personalization';
COMMENT ON TABLE cerebro_predictive_insights IS 'Generates proactive recommendations based on user data';
COMMENT ON TABLE cerebro_feedback_learning IS 'Collects user feedback to improve AI responses over time';
