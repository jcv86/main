-- Multimodal Analysis Schema for Despega A3
-- Enterprise-level interview analysis with video, audio, and behavioral metrics

-- Main analysis sessions table
CREATE TABLE IF NOT EXISTS a3_multimodal_analysis_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entrevista_id UUID REFERENCES a3_entrevistas(id),
  session_title TEXT NOT NULL,
  session_type VARCHAR(50) NOT NULL, -- 'practice', 'real', 'coaching'
  
  -- Media storage
  video_url TEXT,
  audio_url TEXT,
  video_blob_id TEXT, -- Vercel Blob storage ID
  audio_blob_id TEXT,
  
  -- Session metadata
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  codec_video VARCHAR(50),
  codec_audio VARCHAR(50),
  fps INTEGER,
  resolution VARCHAR(20),
  
  -- Processing status
  processing_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE,
  processing_error TEXT,
  
  -- Analysis metadata
  frames_extracted INTEGER,
  frames_analyzed INTEGER,
  audio_transcribed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE -- Auto-delete after 30/90 days
);

-- Visual analysis: posture, eye contact, gestures
CREATE TABLE IF NOT EXISTS a3_visual_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES a3_multimodal_analysis_sessions(id) ON DELETE CASCADE,
  
  -- Frame analysis
  frame_number INTEGER,
  frame_timestamp FLOAT, -- seconds
  frame_url TEXT, -- Blob storage URL
  
  -- Posture metrics (0-100)
  posture_score INTEGER,
  posture_feedback TEXT,
  
  -- Eye contact (0-100)
  eye_contact_score INTEGER,
  eye_contact_frames INTEGER,
  eye_contact_feedback TEXT,
  
  -- Hand gestures
  hand_movement_score INTEGER,
  gesture_frequency INTEGER,
  gesture_types JSONB, -- array of detected gestures
  
  -- Facial expressions
  microexpression_detected BOOLEAN,
  microexpression_type VARCHAR(50),
  microexpression_intensity INTEGER, -- 0-100
  emotion_primary VARCHAR(20), -- happy, sad, neutral, confident, nervous
  emotion_confidence NUMERIC,
  
  -- Coherence between verbal and non-verbal
  verbal_nonverbal_alignment_score INTEGER,
  alignment_notes TEXT,
  
  ai_analysis JSONB, -- Full OpenAI response for visual
  confidence_score NUMERIC, -- 0-100
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audio analysis: tone, pace, clarity
CREATE TABLE IF NOT EXISTS a3_audio_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES a3_multimodal_analysis_sessions(id) ON DELETE CASCADE,
  
  -- Transcription
  transcript TEXT,
  transcript_segments JSONB, -- array of {timestamp, text, speaker}
  
  -- Speech metrics
  words_per_minute INTEGER,
  speaking_pace_score INTEGER, -- 0-100
  clarity_score INTEGER,
  filler_words_count INTEGER,
  filler_types JSONB, -- {um: 5, uh: 3, like: 2}
  
  -- Tone analysis
  tone_primary VARCHAR(30), -- professional, nervous, confident, hesitant, etc
  tone_confidence NUMERIC,
  tone_consistency_score INTEGER,
  
  -- Energy & emphasis
  energy_level_score INTEGER, -- 0-100
  emphasis_moments JSONB, -- array of {timestamp, keyword, intensity}
  vocal_variety_score INTEGER,
  
  -- Specific metrics
  response_time_to_question FLOAT, -- milliseconds
  hesitation_detected BOOLEAN,
  hesitation_count INTEGER,
  
  -- Overall assessment
  ai_analysis JSONB, -- Full OpenAI response for audio
  confidence_score NUMERIC,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multimodal coherence analysis
CREATE TABLE IF NOT EXISTS a3_multimodal_coherence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES a3_multimodal_analysis_sessions(id) ON DELETE CASCADE,
  
  -- Cross-modal alignment
  verbal_consistency_score INTEGER,
  nonverbal_consistency_score INTEGER,
  emotional_alignment_score INTEGER,
  
  -- Specific misalignments
  contradictions JSONB, -- array of detected contradictions
  contradiction_count INTEGER,
  
  -- Question-specific coherence
  question_id UUID REFERENCES a3_preguntas_entrevista(id),
  question_text TEXT,
  user_response TEXT,
  
  coherence_score INTEGER,
  coherence_detailed_analysis JSONB,
  
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detailed feedback and recommendations
CREATE TABLE IF NOT EXISTS a3_multimodal_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES a3_multimodal_analysis_sessions(id) ON DELETE CASCADE,
  
  -- Structured feedback
  feedback_category VARCHAR(50), -- 'posture', 'eye_contact', 'tone', 'pace', 'coherence', 'overall'
  
  -- Scores
  strength_areas JSONB, -- array of strengths
  improvement_areas JSONB, -- array of areas needing improvement
  
  -- Specific recommendations
  recommendations TEXT,
  specific_techniques JSONB, -- array of actionable techniques
  
  -- Priority ranking
  improvement_priority INTEGER, -- 1-10, higher = more important
  
  -- Metrics
  before_after_comparison JSONB, -- if user has previous sessions
  
  -- AI-generated insights
  ai_insights JSONB,
  confidence_score NUMERIC,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session summary and overall score
CREATE TABLE IF NOT EXISTS a3_multimodal_session_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES a3_multimodal_analysis_sessions(id) ON DELETE CASCADE,
  
  -- Overall scores
  overall_interview_score INTEGER, -- 0-100
  visual_score INTEGER,
  audio_score INTEGER,
  coherence_score INTEGER,
  
  -- Breakdown by competency
  communication_score INTEGER,
  confidence_score INTEGER,
  professionalism_score INTEGER,
  authenticity_score INTEGER,
  
  -- Aggregate metrics
  key_strengths JSONB, -- array of top 3 strengths
  key_improvements JSONB, -- array of top 3 improvements
  
  -- Comparison data
  percentile_rank INTEGER, -- where user ranks vs other users
  improvement_over_time NUMERIC, -- % improvement from previous sessions
  
  -- Personalized path
  recommended_next_training UUID REFERENCES a3_entrenamientos(id),
  training_reason TEXT,
  
  -- Video highlights
  highlight_moments JSONB, -- array of {timestamp, type, description}
  
  -- Summary report
  executive_summary TEXT,
  detailed_report JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Storage for analysis metadata and processing queue
CREATE TABLE IF NOT EXISTS a3_multimodal_processing_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES a3_multimodal_analysis_sessions(id) ON DELETE CASCADE,
  
  -- Queue status
  queue_position INTEGER,
  priority INTEGER DEFAULT 5, -- 1-10, higher = more urgent
  
  -- Processing phases
  phase VARCHAR(50), -- 'frame_extraction', 'visual_analysis', 'audio_analysis', 'coherence', 'report_generation'
  phase_started_at TIMESTAMP WITH TIME ZONE,
  phase_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Retry logic
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  last_error TEXT,
  
  -- Resource tracking
  estimated_cost_usd NUMERIC,
  actual_cost_usd NUMERIC,
  tokens_used INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis caching for fast retrieval
CREATE TABLE IF NOT EXISTS a3_multimodal_analysis_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES a3_multimodal_analysis_sessions(id) ON DELETE CASCADE,
  
  cache_key VARCHAR(255) UNIQUE,
  cache_data JSONB,
  
  -- Cache validity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  hits INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE
);

-- User preferences for analysis settings
CREATE TABLE IF NOT EXISTS a3_multimodal_user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Privacy settings
  auto_delete_videos_after_days INTEGER DEFAULT 30,
  encrypt_storage BOOLEAN DEFAULT TRUE,
  share_analytics BOOLEAN DEFAULT FALSE,
  
  -- Analysis preferences
  focus_areas JSONB, -- array of areas to focus on
  skip_analysis_categories JSONB, -- array of analysis types to skip
  
  -- Notification preferences
  notify_analysis_complete BOOLEAN DEFAULT TRUE,
  notify_new_insights BOOLEAN DEFAULT TRUE,
  digest_frequency VARCHAR(20) DEFAULT 'weekly', -- daily, weekly, monthly
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage tracking
CREATE TABLE IF NOT EXISTS a3_multimodal_api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  analysis_date DATE,
  sessions_analyzed INTEGER DEFAULT 0,
  api_calls_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  cost_usd NUMERIC,
  
  -- Rate limiting
  daily_quota INTEGER,
  monthly_quota INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_multimodal_sessions_user ON a3_multimodal_analysis_sessions(user_id);
CREATE INDEX idx_multimodal_sessions_status ON a3_multimodal_analysis_sessions(processing_status);
CREATE INDEX idx_multimodal_sessions_created ON a3_multimodal_analysis_sessions(created_at);

CREATE INDEX idx_visual_analysis_session ON a3_visual_analysis(session_id);
CREATE INDEX idx_visual_analysis_emotion ON a3_visual_analysis(emotion_primary);

CREATE INDEX idx_audio_analysis_session ON a3_audio_analysis(session_id);
CREATE INDEX idx_audio_analysis_tone ON a3_audio_analysis(tone_primary);

CREATE INDEX idx_coherence_session ON a3_multimodal_coherence(session_id);
CREATE INDEX idx_coherence_score ON a3_multimodal_coherence(coherence_score);

CREATE INDEX idx_feedback_session ON a3_multimodal_feedback(session_id);
CREATE INDEX idx_feedback_category ON a3_multimodal_feedback(feedback_category);

CREATE INDEX idx_summary_session ON a3_multimodal_session_summary(session_id);
CREATE INDEX idx_summary_overall_score ON a3_multimodal_session_summary(overall_interview_score);

CREATE INDEX idx_processing_queue_status ON a3_multimodal_processing_queue(phase);
CREATE INDEX idx_api_usage_user_date ON a3_multimodal_api_usage(user_id, analysis_date);

-- Enable RLS for security
ALTER TABLE a3_multimodal_analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_visual_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_audio_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_multimodal_coherence ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_multimodal_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_multimodal_session_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_multimodal_processing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_multimodal_user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE a3_multimodal_api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only see their own data
CREATE POLICY users_can_view_own_sessions ON a3_multimodal_analysis_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY users_can_insert_sessions ON a3_multimodal_analysis_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY users_can_update_sessions ON a3_multimodal_analysis_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- System can manage analysis data
CREATE POLICY system_can_manage_analysis ON a3_visual_analysis
  FOR ALL USING (TRUE);

CREATE POLICY system_can_manage_audio ON a3_audio_analysis
  FOR ALL USING (TRUE);

CREATE POLICY system_can_manage_coherence ON a3_multimodal_coherence
  FOR ALL USING (TRUE);

CREATE POLICY system_can_manage_feedback ON a3_multimodal_feedback
  FOR ALL USING (TRUE);

CREATE POLICY system_can_manage_summary ON a3_multimodal_session_summary
  FOR ALL USING (TRUE);

CREATE POLICY users_can_manage_settings ON a3_multimodal_user_settings
  FOR ALL USING (auth.uid() = user_id);
