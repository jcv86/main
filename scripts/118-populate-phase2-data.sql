-- Phase 2: Populate data for Goal Tracking, Peer Comparison, and Email Insights

-- Add sample career goals for different categories
INSERT INTO career_goals (user_id, title, description, category, status, priority, target_date, progress, created_at, updated_at)
SELECT 
  id,
  'Completar todos los tests psicométricos',
  'Realizar y completar las 6 evaluaciones disponibles para obtener un perfil completo',
  'assessment',
  'in_progress',
  'high',
  CURRENT_DATE + INTERVAL '30 days',
  50,
  NOW(),
  NOW()
FROM users
LIMIT 1;

-- Add email notification preferences
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS weekly_insights_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS goal_reminders BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS achievement_notifications BOOLEAN DEFAULT true;

-- Create table for email insights history
CREATE TABLE IF NOT EXISTS email_insights_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  sent_at TIMESTAMP DEFAULT NOW(),
  email_type VARCHAR(50) DEFAULT 'weekly_insights',
  content JSONB,
  opened BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false
);

-- Create table for peer comparison data (anonymous aggregated stats)
CREATE TABLE IF NOT EXISTS test_benchmarks (
  id SERIAL PRIMARY KEY,
  test_type VARCHAR(100) NOT NULL,
  industry VARCHAR(100),
  experience_level VARCHAR(50),
  score_percentile_25 INTEGER,
  score_percentile_50 INTEGER,
  score_percentile_75 INTEGER,
  score_percentile_90 INTEGER,
  total_participants INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Populate benchmark data for DISC test
INSERT INTO test_benchmarks (test_type, industry, experience_level, score_percentile_25, score_percentile_50, score_percentile_75, score_percentile_90, total_participants)
VALUES 
  ('disc', 'technology', 'entry', 65, 75, 85, 92, 1250),
  ('disc', 'technology', 'mid', 70, 80, 88, 94, 2100),
  ('disc', 'technology', 'senior', 75, 85, 92, 96, 850),
  ('disc', 'finance', 'entry', 68, 78, 86, 93, 980),
  ('disc', 'finance', 'mid', 72, 82, 89, 95, 1450),
  ('disc', 'healthcare', 'entry', 66, 76, 84, 91, 720),
  ('disc', 'education', 'entry', 64, 74, 83, 90, 650);

-- Populate benchmark data for Big Five test
INSERT INTO test_benchmarks (test_type, industry, experience_level, score_percentile_25, score_percentile_50, score_percentile_75, score_percentile_90, total_participants)
VALUES 
  ('big-five', 'technology', 'entry', 62, 72, 82, 90, 1100),
  ('big-five', 'technology', 'mid', 68, 78, 86, 93, 1850),
  ('big-five', 'finance', 'entry', 65, 75, 84, 91, 890);

-- Populate benchmark data for RIASEC test
INSERT INTO test_benchmarks (test_type, industry, experience_level, score_percentile_25, score_percentile_50, score_percentile_75, score_percentile_90, total_participants)
VALUES 
  ('riasec', 'technology', 'entry', 60, 70, 80, 88, 950),
  ('riasec', 'technology', 'mid', 65, 75, 85, 92, 1200);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_benchmarks_type ON test_benchmarks(test_type);
CREATE INDEX IF NOT EXISTS idx_test_benchmarks_industry ON test_benchmarks(industry);
CREATE INDEX IF NOT EXISTS idx_email_insights_user ON email_insights_history(user_id);
CREATE INDEX IF NOT EXISTS idx_career_goals_user ON career_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_career_goals_status ON career_goals(status);
