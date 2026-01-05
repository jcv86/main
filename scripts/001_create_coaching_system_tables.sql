-- Create user_performance_context table
-- Stores cached performance metrics (C1-C4) for quick Coach access
CREATE TABLE IF NOT EXISTS user_performance_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  c1_score DECIMAL(5,2) DEFAULT 0,
  c2_score DECIMAL(5,2) DEFAULT 0,
  c3_score DECIMAL(5,2) DEFAULT 0,
  c4_score DECIMAL(5,2) DEFAULT 0,
  performance_summary JSONB,
  test_results_summary JSONB,
  last_test_date TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create contextual_suggestions table
-- Tracks generated suggestions across different contexts
CREATE TABLE IF NOT EXISTS contextual_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  context_type TEXT NOT NULL CHECK (context_type IN ('dashboard', 'dtc', 'metas', 'simulaciones', 'coach', 'reports')),
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  based_on TEXT,
  performance_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Create user_coaching_memory table
-- Stores insights extracted from Coach conversations (goals, challenges, actions, strengths)
CREATE TABLE IF NOT EXISTS user_coaching_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('goal', 'challenge', 'strength', 'area_improvement', 'action', 'insight')),
  content TEXT NOT NULL,
  source_conversation_id UUID REFERENCES coach_conversations(id) ON DELETE SET NULL,
  linked_axis TEXT CHECK (linked_axis IN ('c1', 'c2', 'c3', 'c4', NULL)),
  action_status TEXT DEFAULT 'pending' CHECK (action_status IN ('pending', 'in_progress', 'completed', 'abandoned')),
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Create ai_insights_from_coaching table
-- Auto-generated insights based on coaching conversations and progress
CREATE TABLE IF NOT EXISTS ai_insights_from_coaching (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('progress', 'recommendation', 'pattern', 'breakthrough', 'opportunity')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  linked_axis TEXT CHECK (linked_axis IN ('c1', 'c2', 'c3', 'c4', NULL)),
  based_on_memory_ids UUID[],
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  generated_by TEXT DEFAULT 'coaching_memory_processor'
);

-- Add RLS policies
ALTER TABLE user_performance_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE contextual_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coaching_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights_from_coaching ENABLE ROW LEVEL SECURITY;

-- Create policies for user_performance_context
CREATE POLICY "Users can view their own performance context" 
  ON user_performance_context FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own performance context" 
  ON user_performance_context FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for contextual_suggestions
CREATE POLICY "Users can view their own suggestions" 
  ON contextual_suggestions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suggestions" 
  ON contextual_suggestions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policies for user_coaching_memory
CREATE POLICY "Users can view their own coaching memory" 
  ON user_coaching_memory FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coaching memory" 
  ON user_coaching_memory FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coaching memory" 
  ON user_coaching_memory FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for ai_insights_from_coaching
CREATE POLICY "Users can view their own coaching insights" 
  ON ai_insights_from_coaching FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert coaching insights" 
  ON ai_insights_from_coaching FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create indexes AFTER table definitions (moved out of CREATE TABLE)
-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_context ON contextual_suggestions(user_id, context_type);
CREATE INDEX IF NOT EXISTS idx_suggestions_created_at ON contextual_suggestions(created_at);
CREATE INDEX IF NOT EXISTS idx_performance_updated_at ON user_performance_context(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_suggestions_expires ON contextual_suggestions(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_memory_user_status ON user_coaching_memory(user_id, action_status);
CREATE INDEX IF NOT EXISTS idx_memory_linked_axis ON user_coaching_memory(user_id, linked_axis);
CREATE INDEX IF NOT EXISTS idx_memory_due_date ON user_coaching_memory(due_date) WHERE action_status = 'pending';
CREATE INDEX IF NOT EXISTS idx_insights_user_axis ON ai_insights_from_coaching(user_id, linked_axis);
CREATE INDEX IF NOT EXISTS idx_insights_type ON ai_insights_from_coaching(insight_type);
