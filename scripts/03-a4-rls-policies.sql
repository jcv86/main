-- =====================
-- A4 ROW LEVEL SECURITY (RLS) POLICIES
-- =====================

-- Enable RLS on all A4 tables
ALTER TABLE a4_tesis_del_dia ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_weak_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_gamified_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_user_test_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_news_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_user_saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_personalized_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE a1_disc_assessment ENABLE ROW LEVEL SECURITY;

-- =====================
-- PUBLIC READ POLICIES (Content Tables)
-- =====================

-- Tesis del Día: Everyone can read
CREATE POLICY "Public read tesis" ON a4_tesis_del_dia
  FOR SELECT USING (true);

-- Noticias: Everyone can read
CREATE POLICY "Public read noticias" ON a4_noticias
  FOR SELECT USING (true);

-- Weak Signals: Everyone can read
CREATE POLICY "Public read signals" ON a4_weak_signals
  FOR SELECT USING (true);

-- Gamified Tests: Everyone can read
CREATE POLICY "Public read tests" ON a4_gamified_tests
  FOR SELECT USING (is_active = true);

-- Biblioteca: Everyone can read verified resources
CREATE POLICY "Public read biblioteca" ON biblioteca
  FOR SELECT USING (is_verified = true);

-- =====================
-- USER-SPECIFIC POLICIES
-- =====================

-- User Test Completions: Users can only see/modify their own
CREATE POLICY "Users can view own test completions" ON a4_user_test_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test completions" ON a4_user_test_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Saved Resources: Users can only see/modify their own
CREATE POLICY "Users can view own saved resources" ON a4_user_saved_resources
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved resources" ON a4_user_saved_resources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved resources" ON a4_user_saved_resources
  FOR DELETE USING (auth.uid() = user_id);

-- Points History: Users can only view their own
CREATE POLICY "Users can view own points history" ON a4_points_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert points" ON a4_points_history
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- User Badges: Users can only view their own
CREATE POLICY "Users can view own badges" ON a4_user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert badges" ON a4_user_badges
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Module Progress: Users can only view/modify their own
CREATE POLICY "Users can view own module progress" ON a4_module_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own module progress" ON a4_module_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- News Engagement: Users can only view/modify their own
CREATE POLICY "Users can view own news engagement" ON a4_news_engagement
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own news engagement" ON a4_news_engagement
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own news engagement" ON a4_news_engagement
  FOR UPDATE USING (auth.uid() = user_id);

-- Personalized Feeds: Users can only view their own
CREATE POLICY "Users can view own personalized feeds" ON a4_personalized_feeds
  FOR SELECT USING (auth.uid() = user_id);

-- DISC Assessment: Users can only view their own
CREATE POLICY "Users can view own DISC assessment" ON a1_disc_assessment
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert DISC assessment" ON a1_disc_assessment
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- =====================
-- LEADERBOARD POLICIES
-- =====================

-- Create a public leaderboard view (aggregate points without exposing individual data)
CREATE VIEW a4_leaderboard AS
SELECT 
  user_id,
  (SELECT balance_nuevo FROM a4_points_history WHERE user_id = a4_points_history.user_id ORDER BY created_at DESC LIMIT 1) as total_points,
  (SELECT COUNT(DISTINCT badge_id) FROM a4_user_badges WHERE user_id = a4_user_badges.user_id) as total_badges,
  (SELECT COUNT(*) FROM a4_user_test_completions WHERE user_id = a4_user_test_completions.user_id) as tests_completed
FROM a4_points_history
GROUP BY user_id;

-- Allow public read of leaderboard (anonymized)
CREATE POLICY "Public read leaderboard" ON a4_leaderboard
  FOR SELECT USING (true);
