-- Create XP Activity Logs table for audit trail and section tracking
CREATE TABLE IF NOT EXISTS xp_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section VARCHAR(10) NOT NULL CHECK (section IN ('A3', 'A4', 'INTERVIEW', 'BONUS')),
  activity_type VARCHAR(50) NOT NULL,
  xp_amount INT NOT NULL CHECK (xp_amount > 0),
  reference_id VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_xp_activity_logs_user_id ON xp_activity_logs(user_id);
CREATE INDEX idx_xp_activity_logs_user_section ON xp_activity_logs(user_id, section);
CREATE INDEX idx_xp_activity_logs_created_at ON xp_activity_logs(created_at DESC);

-- Alter user_gamification_profile to add section breakdown columns
ALTER TABLE user_gamification_profile
ADD COLUMN IF NOT EXISTS xp_a3_total INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS xp_a4_total INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS xp_interview_bonus INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS xp_global_total INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS xp_last_sync TIMESTAMP DEFAULT now();

-- Create function to recalculate global XP from logs
CREATE OR REPLACE FUNCTION recalculate_user_xp(p_user_id UUID)
RETURNS TABLE (
  xp_a3_total INT,
  xp_a4_total INT,
  xp_interview_bonus INT,
  xp_global_total INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN section = 'A3' THEN xp_amount ELSE 0 END), 0)::INT as xp_a3_total,
    COALESCE(SUM(CASE WHEN section = 'A4' THEN xp_amount ELSE 0 END), 0)::INT as xp_a4_total,
    COALESCE(SUM(CASE WHEN section IN ('INTERVIEW', 'BONUS') THEN xp_amount ELSE 0 END), 0)::INT as xp_interview_bonus,
    COALESCE(SUM(xp_amount), 0)::INT as xp_global_total
  FROM xp_activity_logs
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update user_gamification_profile when xp_activity_logs changes
CREATE OR REPLACE FUNCTION sync_xp_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_gamification_profile
  SET 
    xp_a3_total = (SELECT xp_a3_total FROM recalculate_user_xp(NEW.user_id)),
    xp_a4_total = (SELECT xp_a4_total FROM recalculate_user_xp(NEW.user_id)),
    xp_interview_bonus = (SELECT xp_interview_bonus FROM recalculate_user_xp(NEW.user_id)),
    xp_global_total = (SELECT xp_global_total FROM recalculate_user_xp(NEW.user_id)),
    xp_last_sync = now(),
    current_level = FLOOR((SELECT xp_global_total FROM recalculate_user_xp(NEW.user_id))::FLOAT / 1000.0) + 1
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF NOT EXISTS trigger_sync_xp_to_profile ON xp_activity_logs;
CREATE TRIGGER trigger_sync_xp_to_profile
AFTER INSERT ON xp_activity_logs
FOR EACH ROW
EXECUTE FUNCTION sync_xp_to_profile();

-- Backfill existing XP data from a3_user_progreso and other tables
INSERT INTO xp_activity_logs (user_id, section, activity_type, xp_amount, metadata, created_at)
SELECT 
  p.user_id,
  'A3' as section,
  'interview_completion' as activity_type,
  CASE 
    WHEN ie.score_total >= 90 THEN 200
    WHEN ie.score_total >= 80 THEN 150
    WHEN ie.score_total >= 70 THEN 100
    ELSE 50
  END as xp_amount,
  jsonb_build_object('interview_id', ie.id, 'score', ie.score_total) as metadata,
  ie.created_at
FROM a3_user_entrevistas ie
JOIN a3_user_progreso p ON p.user_id = ie.user_id
WHERE NOT EXISTS (
  SELECT 1 FROM xp_activity_logs 
  WHERE user_id = ie.user_id AND section = 'A3' AND reference_id = ie.id::text
)
ON CONFLICT DO NOTHING;

-- Backfill A4 module completions
INSERT INTO xp_activity_logs (user_id, section, activity_type, xp_amount, metadata, created_at)
SELECT 
  mp.user_id,
  'A4' as section,
  'module_completion' as activity_type,
  CASE 
    WHEN mp.progreso_porcentaje = 100 THEN 250
    ELSE FLOOR(mp.progreso_porcentaje * 2.5)::INT
  END as xp_amount,
  jsonb_build_object('module_id', mp.id, 'progress', mp.progreso_porcentaje) as metadata,
  mp.updated_at
FROM a4_module_progress mp
WHERE mp.completado = true
  AND NOT EXISTS (
    SELECT 1 FROM xp_activity_logs 
    WHERE user_id = mp.user_id AND section = 'A4' AND reference_id = mp.id::text
  )
ON CONFLICT DO NOTHING;

-- Recalculate all user profiles
WITH user_ids AS (
  SELECT DISTINCT user_id FROM xp_activity_logs
)
UPDATE user_gamification_profile ugp
SET 
  xp_a3_total = (SELECT xp_a3_total FROM recalculate_user_xp(ugp.user_id)),
  xp_a4_total = (SELECT xp_a4_total FROM recalculate_user_xp(ugp.user_id)),
  xp_interview_bonus = (SELECT xp_interview_bonus FROM recalculate_user_xp(ugp.user_id)),
  xp_global_total = (SELECT xp_global_total FROM recalculate_user_xp(ugp.user_id)),
  current_level = FLOOR((SELECT xp_global_total::FLOAT FROM recalculate_user_xp(ugp.user_id)) / 1000.0) + 1,
  xp_last_sync = now()
WHERE user_id IN (SELECT user_id FROM user_ids);
