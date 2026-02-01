-- Enhanced A3 System: Complete Interview Training & Behavioral Analysis
-- This extends the existing A3 schema with behavioral observation, progress tracking, and emotional regulation

-- A3.0 Pre-Interview Analysis
CREATE TABLE IF NOT EXISTS despega_a3_pre_interview_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL UNIQUE,
  photo_url TEXT, -- Photo or first frame of video
  video_url TEXT, -- Optional video URL
  analysis_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Visual Analysis
  vestimenta_coherence FLOAT CHECK (vestimenta_coherence >= 0 AND vestimenta_coherence <= 100),
  vestimenta_feedback TEXT,
  postura_score FLOAT CHECK (postura_score >= 0 AND postura_score <= 100),
  postura_notes TEXT,
  expresion_facial_confidence FLOAT CHECK (expresion_facial_confidence >= 0 AND expresion_facial_confidence <= 100),
  expresion_notes TEXT,
  contacto_visual_estimated FLOAT CHECK (contacto_visual_estimated >= 0 AND contacto_visual_estimated <= 100),
  
  -- Composite Readiness
  pre_interview_readiness FLOAT CHECK (pre_interview_readiness >= 0 AND pre_interview_readiness <= 100),
  recommendations JSONB, -- Array of actionable recommendations
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- A3.1 Employability Diagnosis
CREATE TABLE IF NOT EXISTS despega_a3_employability_diagnosis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  
  -- Clarity of Profile
  profile_clarity FLOAT CHECK (profile_clarity >= 0 AND profile_clarity <= 100),
  profile_clarity_feedback TEXT,
  
  -- Real Strengths Identified
  strengths JSONB, -- Array of identified strengths
  
  -- Main Gaps
  gaps JSONB, -- Array of main gaps
  
  -- Current Preparation Level
  prep_level TEXT CHECK (prep_level IN ('basico', 'intermedio', 'avanzado')),
  prep_level_score FLOAT CHECK (prep_level_score >= 0 AND prep_level_score <= 100),
  
  -- Recommendations for Training Focus
  focus_areas JSONB, -- Array of recommended training areas
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- A3.3 Behavioral Observation During Simulation
CREATE TABLE IF NOT EXISTS despega_a3_behavioral_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  simulation_id UUID REFERENCES despega_user_a3_progress(id) ON DELETE CASCADE,
  
  -- Visual Signals (from video/webcam)
  facial_microexpressions JSONB, -- Array of detected emotions and timing
  postura_rigidez_score FLOAT, -- 0-100: higher = more rigid
  postura_changes TEXT, -- Notes on posture changes
  repetitive_movements JSONB, -- Array of detected repetitive gestures
  eye_contact_percentage FLOAT CHECK (eye_contact_percentage >= 0 AND eye_contact_percentage <= 100),
  eye_contact_pattern TEXT,
  
  -- Voice Analysis (from audio)
  tone_confidence FLOAT CHECK (tone_confidence >= 0 AND tone_confidence <= 100),
  tone_changes JSONB, -- When tone shifts
  volume_baseline FLOAT, -- Baseline volume
  volume_variations TEXT, -- Pattern of changes
  speech_speed TEXT CHECK (speech_speed IN ('muy_lento', 'lento', 'normal', 'rapido', 'muy_rapido')),
  voice_breaks_count INTEGER,
  voice_breaks_timing JSONB,
  
  -- Verbal Patterns
  verbal_fillers JSONB, -- Detected "ums", "ahs", etc with frequency
  repetition_score FLOAT, -- How often user repeats themselves
  evasion_indicators JSONB, -- Places where user avoided answering
  response_focus TEXT CHECK (response_focus IN ('muy_enfocada', 'enfocada', 'dispersa', 'muy_dispersa')),
  response_length_issues TEXT, -- "too_short", "too_long", "good"
  
  -- Silence & Blocks
  silence_count INTEGER,
  silence_duration_seconds JSONB, -- Array of silence durations
  silence_context JSONB, -- What question/topic triggered silences
  blank_outs_count INTEGER, -- Times user completely lost train of thought
  topic_changes_abrupt_count INTEGER,
  
  -- Composite Behavioral Score
  behavioral_stability_score FLOAT CHECK (behavioral_stability_score >= 0 AND behavioral_stability_score <= 100),
  
  observation_summary TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A3.5 Emotional State & Regulation
CREATE TABLE IF NOT EXISTS despega_a3_emotional_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  simulation_id UUID REFERENCES despega_user_a3_progress(id) ON DELETE CASCADE,
  
  -- Pre-Simulation Emotional State
  anxiety_level_pre FLOAT CHECK (anxiety_level_pre >= 0 AND anxiety_level_pre <= 100),
  confidence_pre FLOAT CHECK (confidence_pre >= 0 AND confidence_pre <= 100),
  readiness_pre FLOAT CHECK (readiness_pre >= 0 AND readiness_pre <= 100),
  
  -- During Simulation Peaks
  max_anxiety_during FLOAT CHECK (max_anxiety_during >= 0 AND max_anxiety_during <= 100),
  anxiety_trigger TEXT,
  frustration_detected BOOLEAN,
  frustration_intensity FLOAT CHECK (frustration_intensity >= 0 AND frustration_intensity <= 100),
  frustration_timing TEXT,
  
  -- Post-Simulation
  anxiety_level_post FLOAT CHECK (anxiety_level_post >= 0 AND anxiety_level_post <= 100),
  confidence_post FLOAT CHECK (confidence_post >= 0 AND confidence_post <= 100),
  willingness_continue BOOLEAN,
  
  -- Emotional Resilience Indicators
  recovery_after_mistake_score FLOAT CHECK (recovery_after_mistake_score >= 0 AND recovery_after_mistake_score <= 100),
  emotional_regulation_score FLOAT CHECK (emotional_regulation_score >= 0 AND emotional_regulation_score <= 100),
  
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Difficulty Levels & Progression
CREATE TABLE IF NOT EXISTS despega_a3_difficulty_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_type TEXT NOT NULL, -- "entrevista_guiada", "estructurada", "desafiante", "presion"
  
  -- Current Level (1=Básico, 2=Intermedio, 3=Avanzado, 4+=Bonus)
  current_level INTEGER CHECK (current_level >= 1 AND current_level <= 10),
  unlocked_up_to_level INTEGER DEFAULT 1,
  
  -- Level Progression Tracking
  solid_executions_at_level INTEGER DEFAULT 0, -- Consecutive solid performances
  failed_attempts_at_level INTEGER DEFAULT 0,
  abandoned_attempts_at_level INTEGER DEFAULT 0,
  frustration_signals_at_level INTEGER DEFAULT 0,
  
  -- Bonus Level Requirements (Mastery)
  bonus_1_unlocked_at TIMESTAMP WITH TIME ZONE, -- After 3 solid executions
  bonus_2_unlocked_at TIMESTAMP WITH TIME ZONE, -- After 5 solid executions
  bonus_3_unlocked_at TIMESTAMP WITH TIME ZONE, -- After 7 solid executions
  
  last_level_change TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- P_Success Probability Tracking
CREATE TABLE IF NOT EXISTS despega_a3_p_success_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  simulation_id UUID REFERENCES despega_user_a3_progress(id),
  
  -- Input Factors
  historical_completion_rate FLOAT,
  current_difficulty_level INTEGER,
  effective_capacity_score FLOAT,
  user_mode TEXT, -- "reposo", "normal", "high_energy"
  context_score FLOAT, -- Environmental/time context
  
  -- Behavioral Signals
  pre_simulation_confidence FLOAT,
  behavioral_stability_score FLOAT,
  estimated_anxiety_trigger_risk FLOAT,
  
  -- Final Calculation
  p_success_probability FLOAT CHECK (p_success_probability >= 0 AND p_success_probability <= 1),
  p_success_category TEXT CHECK (p_success_category IN ('muy_alta', 'alta', 'moderada', 'baja', 'muy_baja')),
  difficulty_relative_warning BOOLEAN, -- True if P_success <= 0.15 (15% rule)
  
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A3.4 Structured Professional Feedback
CREATE TABLE IF NOT EXISTS despega_a3_structured_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  simulation_id UUID REFERENCES despega_user_a3_progress(id) ON DELETE CASCADE,
  
  -- What Worked
  strengths_demonstrated JSONB, -- Array with descriptions
  effective_moments JSONB, -- Specific moments that went well
  
  -- What Didn't Work
  areas_for_improvement JSONB, -- Specific areas
  ineffective_moments JSONB, -- When things didn't go well
  
  -- Manifestation Analysis
  emotional_manifestation TEXT, -- How emotions showed up
  behavioral_manifestation TEXT, -- Specific behaviors observed
  
  -- Concrete Actions
  actionable_adjustments JSONB, -- Array of specific adjustments to make
  
  -- Coach-Style Narrative Feedback
  coach_narrative TEXT, -- Personalized coach feedback
  
  encouragement_score FLOAT CHECK (encouragement_score >= 0 AND encouragement_score <= 100),
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE despega_a3_pre_interview_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a3_employability_diagnosis ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a3_behavioral_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a3_emotional_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a3_difficulty_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a3_p_success_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a3_structured_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own pre-interview analysis" ON despega_a3_pre_interview_analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pre-interview analysis" ON despega_a3_pre_interview_analysis FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own employability diagnosis" ON despega_a3_employability_diagnosis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own employability diagnosis" ON despega_a3_employability_diagnosis FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own behavioral observations" ON despega_a3_behavioral_observations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own behavioral observations" ON despega_a3_behavioral_observations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own emotional state" ON despega_a3_emotional_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emotional state" ON despega_a3_emotional_state FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own difficulty levels" ON despega_a3_difficulty_levels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own difficulty levels" ON despega_a3_difficulty_levels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own difficulty levels" ON despega_a3_difficulty_levels FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own p_success calculations" ON despega_a3_p_success_calculations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own p_success calculations" ON despega_a3_p_success_calculations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own structured feedback" ON despega_a3_structured_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own structured feedback" ON despega_a3_structured_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_a3_pre_interview_user ON despega_a3_pre_interview_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_employability_user ON despega_a3_employability_diagnosis(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_behavioral_user ON despega_a3_behavioral_observations(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_behavioral_simulation ON despega_a3_behavioral_observations(simulation_id);
CREATE INDEX IF NOT EXISTS idx_a3_emotional_user ON despega_a3_emotional_state(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_emotional_simulation ON despega_a3_emotional_state(simulation_id);
CREATE INDEX IF NOT EXISTS idx_a3_difficulty_user ON despega_a3_difficulty_levels(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_difficulty_type ON despega_a3_difficulty_levels(scenario_type);
CREATE INDEX IF NOT EXISTS idx_a3_p_success_user ON despega_a3_p_success_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_feedback_user ON despega_a3_structured_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_a3_feedback_simulation ON despega_a3_structured_feedback(simulation_id);
