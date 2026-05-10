-- Gamification Schema Migration
-- Creates all necessary tables for the comprehensive gamification system

-- 1. User Gamification Profile
CREATE TABLE IF NOT EXISTS user_gamification_profile (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  daily_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  xp_a1_total INTEGER DEFAULT 0,
  xp_a2_total INTEGER DEFAULT 1,
  xp_a3_total INTEGER DEFAULT 0,
  xp_interview_total INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_total_xp (total_xp DESC)
);

-- 2. User Rankings (Global Leaderboard)
CREATE TABLE IF NOT EXISTS user_rankings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  tier TEXT NOT NULL DEFAULT 'Rising',
  general_score INTEGER DEFAULT 0,
  a1_score INTEGER DEFAULT 0,
  a2_score INTEGER DEFAULT 0,
  a3_score INTEGER DEFAULT 0,
  xp_a1 INTEGER DEFAULT 0,
  xp_a2 INTEGER DEFAULT 0,
  xp_a3 INTEGER DEFAULT 0,
  last_rank_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_rank (rank),
  INDEX idx_tier (tier),
  INDEX idx_general_score (general_score DESC)
);

-- 3. DTC Balance Tracking
CREATE TABLE IF NOT EXISTS user_dtc_balance (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  lifetime_spent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_balance (balance DESC)
);

-- 4. DTC Transactions
CREATE TABLE IF NOT EXISTS dtc_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'spend')),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_transaction_type (transaction_type)
);

-- 5. Achievements/Badges
CREATE TABLE IF NOT EXISTS achievements (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  xp_reward INTEGER DEFAULT 0,
  dtc_reward INTEGER DEFAULT 0,
  icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_category (category),
  INDEX idx_earned_at (earned_at DESC),
  UNIQUE (user_id, title, category)
);

-- 6. Activity Log
CREATE TABLE IF NOT EXISTS gamification_activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  section TEXT,
  xp_earned INTEGER DEFAULT 0,
  dtc_earned INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_activity_type (activity_type),
  INDEX idx_created_at (created_at DESC)
);

-- 7. Level Configuration
CREATE TABLE IF NOT EXISTS gamification_level_config (
  id BIGSERIAL PRIMARY KEY,
  level INTEGER NOT NULL UNIQUE,
  xp_required INTEGER NOT NULL,
  title TEXT,
  badge_reward TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Populate level configuration
INSERT INTO gamification_level_config (level, xp_required, title, badge_reward) VALUES
(1, 0, 'Beginner', 'apprentice'),
(2, 1000, 'Novice', 'student'),
(3, 2500, 'Practitioner', 'professional'),
(4, 5000, 'Expert', 'master'),
(5, 10000, 'Master', 'sage'),
(6, 20000, 'Legend', 'legend'),
(7, 50000, 'Mythic', 'mythic')
ON CONFLICT DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE user_gamification_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dtc_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE dtc_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Gamification Profile - Users can only see their own profile
CREATE POLICY user_gamif_self ON user_gamification_profile FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY user_gamif_self_update ON user_gamification_profile FOR UPDATE
  USING (auth.uid() = user_id);

-- User Rankings - Public read, only system can write
CREATE POLICY rankings_public_read ON user_rankings FOR SELECT
  USING (true);

-- DTC Balance - Users can only see their own balance
CREATE POLICY dtc_balance_self ON user_dtc_balance FOR SELECT
  USING (auth.uid() = user_id);

-- DTC Transactions - Users can only see their own transactions
CREATE POLICY dtc_trans_self ON dtc_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Achievements - Users can only see their own, but all are readable for leaderboards
CREATE POLICY achievements_self ON achievements FOR SELECT
  USING (true);

-- Activity Log - Users can only see their own
CREATE POLICY activity_log_self ON gamification_activity_log FOR SELECT
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
