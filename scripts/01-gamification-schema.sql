-- Gamification System Database Schema

-- 1. User DTC Balance Table
CREATE TABLE IF NOT EXISTS user_dtc_balance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. DTC Transactions Table
CREATE TABLE IF NOT EXISTS dtc_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'earn', 'spend', 'purchase'
  description TEXT,
  related_to VARCHAR(100), -- 'interview_tips', 'interview_complete', 'stripe_purchase'
  related_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Interview Tips Usage Table (Free & Premium)
CREATE TABLE IF NOT EXISTS interview_tips_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interview_session_id UUID, -- Reference to interview session
  question_id INTEGER,
  tip_number INTEGER NOT NULL, -- 1-3 for free, 4-6 for premium
  tip_type VARCHAR(50) NOT NULL, -- 'structure', 'content', 'delivery', 'confidence'
  ai_tip_content TEXT NOT NULL,
  confidence_score NUMERIC,
  question_context JSONB,
  response_before_tip TEXT,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_premium BOOLEAN DEFAULT FALSE,
  dtc_cost INTEGER DEFAULT 0, -- 0 for free, 150 for premium tips
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Interview Session Enhancement Table
CREATE TABLE IF NOT EXISTS interview_session_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  interview_type VARCHAR(100),
  difficulty_level VARCHAR(50),
  total_tips_used_free INTEGER DEFAULT 0,
  total_tips_used_premium INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  time_spent_minutes INTEGER,
  overall_score INTEGER,
  tips_purchased_this_session INTEGER DEFAULT 0,
  dtc_spent_this_session INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  streak_maintained BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User Gamification Profile Table
CREATE TABLE IF NOT EXISTS user_gamification_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_level VARCHAR(50) DEFAULT 'Bronze', -- Bronze, Silver, Gold, Platinum, Diamond
  current_xp INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  interview_streak INTEGER DEFAULT 0,
  best_interview_streak INTEGER DEFAULT 0,
  total_interviews_completed INTEGER DEFAULT 0,
  total_tips_earned_free INTEGER DEFAULT 0,
  total_tips_earned_premium INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 6. DTC Purchase History (Stripe Integration)
CREATE TABLE IF NOT EXISTS dtc_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_transaction_id VARCHAR(255),
  amount_usd NUMERIC(10,2),
  dtc_amount_purchased INTEGER,
  bonus_dtc INTEGER DEFAULT 0, -- Promotional bonuses
  status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 7. Enhanced Interview Questions with Metadata
ALTER TABLE a3_preguntas_entrevista ADD COLUMN IF NOT EXISTS
  question_metadata JSONB DEFAULT '{
    "tips_available": 3,
    "time_limit_seconds": 120,
    "difficulty_score": 5,
    "key_points": [],
    "common_mistakes": [],
    "follow_ups": []
  }'::jsonb;

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_user_dtc_balance ON user_dtc_balance(user_id);
CREATE INDEX IF NOT EXISTS idx_dtc_transactions_user ON dtc_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_dtc_transactions_type ON dtc_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_interview_tips_usage_user ON interview_tips_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_tips_usage_session ON interview_tips_usage(interview_session_id);
CREATE INDEX IF NOT EXISTS idx_interview_session_gamification_user ON interview_session_gamification(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gamification_profile_user ON user_gamification_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_dtc_purchases_user ON dtc_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_dtc_purchases_stripe ON dtc_purchases(stripe_transaction_id);

-- Enable RLS for Security
ALTER TABLE user_dtc_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE dtc_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_tips_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_session_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE dtc_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own DTC balance" ON user_dtc_balance
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own transactions" ON dtc_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own tips usage" ON interview_tips_usage
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own interview gamification" ON interview_session_gamification
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own gamification profile" ON user_gamification_profile
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own DTC purchases" ON dtc_purchases
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all gamification" ON user_dtc_balance
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all transactions" ON dtc_transactions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all tips" ON interview_tips_usage
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all sessions" ON interview_session_gamification
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all profiles" ON user_gamification_profile
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all purchases" ON dtc_purchases
  FOR ALL USING (auth.role() = 'service_role');
