-- Test Improvements Schema Migration
-- Adds tables for retry logic, test completion time monitoring, progress snapshots, and A/B testing

-- 1. Test Retry History Table (for failed saves)
CREATE TABLE IF NOT EXISTS test_save_retries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  test_type VARCHAR(100) NOT NULL,
  attempt_number INT NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, success, failed
  error_message TEXT,
  test_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_retry_at TIMESTAMP WITH TIME ZONE,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  retry_delay_ms INT DEFAULT 1000,
  UNIQUE(user_email, test_type, attempt_number)
);

-- 2. Test Completion Time Metrics Table
CREATE TABLE IF NOT EXISTS test_completion_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  test_type VARCHAR(100) NOT NULL,
  duration_minutes NUMERIC NOT NULL,
  questions_count INT NOT NULL,
  completion_percentage INT DEFAULT 100,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Test Progress Snapshots Table (for interrupted tests)
CREATE TABLE IF NOT EXISTS test_progress_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  test_type VARCHAR(100) NOT NULL,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  current_question INT NOT NULL,
  total_questions INT NOT NULL,
  answers_so_far JSONB NOT NULL,
  duration_so_far_minutes NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
);

-- 4. A/B Test Variants Table (already exists as ab_test_variants, but we'll ensure proper structure)
-- Adding variant tracking for test questions
CREATE TABLE IF NOT EXISTS ab_test_question_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_type VARCHAR(100) NOT NULL,
  question_id INT NOT NULL,
  variant_name VARCHAR(100) NOT NULL,
  variant_text TEXT NOT NULL,
  variant_config JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  traffic_percentage INT DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(test_type, question_id, variant_name)
);

-- 5. A/B Test Results Tracking
CREATE TABLE IF NOT EXISTS ab_test_results_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  test_type VARCHAR(100) NOT NULL,
  question_id INT NOT NULL,
  variant_name VARCHAR(100) NOT NULL,
  response_time_ms INT,
  response_quality INT,
  answer_provided JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Test Analytics Summary Table
CREATE TABLE IF NOT EXISTS test_analytics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_type VARCHAR(100) NOT NULL UNIQUE,
  total_completions BIGINT DEFAULT 0,
  total_attempts BIGINT DEFAULT 0,
  avg_duration_minutes NUMERIC DEFAULT 0,
  completion_rate_percentage NUMERIC DEFAULT 0,
  avg_score NUMERIC DEFAULT 0,
  median_duration_minutes NUMERIC DEFAULT 0,
  p95_duration_minutes NUMERIC DEFAULT 0,
  common_dropoff_question INT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period_start_date DATE DEFAULT CURRENT_DATE,
  period_end_date DATE
);

-- 7. Test Export Logs Table
CREATE TABLE IF NOT EXISTS test_export_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  test_type VARCHAR(100),
  export_format VARCHAR(20) NOT NULL,
  export_url TEXT,
  file_size_bytes INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  exported_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
  download_count INT DEFAULT 0
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_test_save_retries_status ON test_save_retries(status);
CREATE INDEX IF NOT EXISTS idx_test_save_retries_next_retry ON test_save_retries(next_retry_at);
CREATE INDEX IF NOT EXISTS idx_completion_metrics_test_type ON test_completion_metrics(test_type);
CREATE INDEX IF NOT EXISTS idx_progress_snapshots_user_email ON test_progress_snapshots(user_email);
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_active ON ab_test_question_variants(is_active);

-- Ensure RLS is enabled on sensitive tables
ALTER TABLE test_save_retries ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_progress_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_export_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for test_save_retries (admin only)
CREATE POLICY "test_save_retries_admin_read" ON test_save_retries FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policies for test_progress_snapshots (user sees own snapshots)
CREATE POLICY "test_snapshots_user_read" ON test_progress_snapshots FOR SELECT
  USING (user_email = auth.jwt()->>'email');

CREATE POLICY "test_snapshots_user_insert" ON test_progress_snapshots FOR INSERT
  WITH CHECK (user_email = auth.jwt()->>'email');

CREATE POLICY "test_snapshots_user_update" ON test_progress_snapshots FOR UPDATE
  USING (user_email = auth.jwt()->>'email');

-- RLS Policies for test_export_logs (user sees own exports)
CREATE POLICY "test_export_user_read" ON test_export_logs FOR SELECT
  USING (user_email = auth.jwt()->>'email');

CREATE POLICY "test_export_user_insert" ON test_export_logs FOR INSERT
  WITH CHECK (user_email = auth.jwt()->>'email');
