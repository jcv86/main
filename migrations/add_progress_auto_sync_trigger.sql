-- Migration: Create progress calculation trigger
-- Purpose: Automatically update a3_user_progreso.progreso_porcentaje whenever activities change

-- Create function to calculate and update progress
CREATE OR REPLACE FUNCTION calculate_user_progress(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_module_progress NUMERIC := 0;
  v_interview_progress NUMERIC := 0;
  v_training_progress NUMERIC := 0;
  v_score_progress NUMERIC := 0;
  v_overall_progress INTEGER := 0;
  v_total_modules INTEGER := 0;
  v_completed_modules INTEGER := 0;
  v_total_interviews INTEGER := 0;
  v_avg_score NUMERIC := 0;
  v_completed_trainings INTEGER := 0;
BEGIN
  -- Calculate module completion (35%)
  SELECT COUNT(*), COUNT(*) FILTER (WHERE completado = true)
  INTO v_total_modules, v_completed_modules
  FROM a4_module_progress
  WHERE user_id = p_user_id;
  
  IF v_total_modules > 0 THEN
    v_module_progress := (v_completed_modules::NUMERIC / v_total_modules::NUMERIC) * 0.35;
  END IF;

  -- Calculate interview progress (30%)
  -- Target: 10 interviews
  SELECT COUNT(*), AVG(score_total)
  INTO v_total_interviews, v_avg_score
  FROM a3_user_entrevistas
  WHERE user_id = p_user_id;
  
  v_interview_progress := LEAST((v_total_interviews::NUMERIC / 10.0), 1.0) * 0.30;
  
  -- Average interview score (15%)
  IF v_avg_score IS NOT NULL THEN
    v_score_progress := LEAST((v_avg_score / 100.0), 1.0) * 0.15;
  END IF;

  -- Calculate training completion (20%)
  -- Target: 5 trainings
  SELECT COUNT(*) FILTER (WHERE completed_at IS NOT NULL)
  INTO v_completed_trainings
  FROM a3_training_assignments
  WHERE user_id = p_user_id;
  
  v_training_progress := LEAST((v_completed_trainings::NUMERIC / 5.0), 1.0) * 0.20;

  -- Calculate overall progress (0-100)
  v_overall_progress := ROUND(
    (v_module_progress + v_interview_progress + v_training_progress + v_score_progress) * 100
  );

  RETURN v_overall_progress;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create trigger for module progress updates
CREATE OR REPLACE FUNCTION update_progress_on_module_change()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE a3_user_progreso
  SET progreso_porcentaje = calculate_user_progress(NEW.user_id),
      updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS tr_update_progress_on_module_change ON a4_module_progress;
DROP TRIGGER IF EXISTS tr_update_progress_on_interview_change ON a3_user_entrevistas;
DROP TRIGGER IF EXISTS tr_update_progress_on_training_change ON a3_training_assignments;

-- Create trigger on module progress insert/update
CREATE TRIGGER tr_update_progress_on_module_change
AFTER INSERT OR UPDATE ON a4_module_progress
FOR EACH ROW
EXECUTE FUNCTION update_progress_on_module_change();

-- Create trigger on interview insert/update
CREATE TRIGGER tr_update_progress_on_interview_change
AFTER INSERT OR UPDATE ON a3_user_entrevistas
FOR EACH ROW
EXECUTE FUNCTION update_progress_on_module_change();

-- Create trigger on training assignment insert/update
CREATE TRIGGER tr_update_progress_on_training_change
AFTER INSERT OR UPDATE ON a3_training_assignments
FOR EACH ROW
EXECUTE FUNCTION update_progress_on_module_change();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_a4_module_progress_user_id ON a4_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_user_entrevistas_user_id ON a3_user_entrevistas(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_training_assignments_user_id ON a3_training_assignments(user_id);
