-- A1 "Origen" - Diagnostic base stage
CREATE TABLE IF NOT EXISTS a1_conozcamonos_1 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS a1_disc_assessment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  questions JSONB NOT NULL, -- 28 preguntas Más/Menos/Como yo
  responses JSONB NOT NULL,
  disc_profile JSONB NOT NULL, -- D, I, S, C scores
  dominant_pattern VARCHAR NOT NULL,
  secondary_pattern VARCHAR,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS a1_informe_completo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  a1_conozcamonos_1_id UUID REFERENCES a1_conozcamonos_1(id),
  a1_disc_assessment_id UUID REFERENCES a1_disc_assessment(id),
  diagnostic_summary TEXT NOT NULL,
  key_insights JSONB NOT NULL,
  behavioral_patterns JSONB NOT NULL,
  recommendations TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A2 "Ruta" - Route personalization stage
CREATE TABLE IF NOT EXISTS a2_conozcamonos_2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  responses JSONB NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS a2_rutas_personalizadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  a1_informe_completo_id UUID REFERENCES a1_informe_completo(id),
  a2_conozcamonos_2_id UUID REFERENCES a2_conozcamonos_2(id),
  ruta_30_dias JSONB NOT NULL, -- Actividades día a día
  ruta_60_dias JSONB,
  ruta_90_dias JSONB,
  focos_priorizados JSONB NOT NULL,
  orden_avance JSONB NOT NULL,
  ruta_activa VARCHAR DEFAULT '30', -- '30', '60', '90'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- A3 "Impulso" - Training and market execution stage
CREATE TABLE IF NOT EXISTS a3_entrevista_0 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conditions_reviewed JSONB NOT NULL, -- luz, fondo, audio, cámara, presentación
  feedback TEXT,
  passed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS a3_practicas_simulaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  simulation_type VARCHAR NOT NULL, -- 'interview', 'presentation', 'scenario'
  scenario_context JSONB NOT NULL,
  user_response TEXT,
  ai_feedback TEXT,
  score FLOAT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS a3_cv_generado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cv_content TEXT NOT NULL,
  cv_ats_format TEXT NOT NULL,
  competencies JSONB NOT NULL,
  based_on_profile JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- A4 "Radar" - Context and criterion development stage
CREATE TABLE IF NOT EXISTS a4_noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR,
  relevance_score FLOAT,
  category VARCHAR, -- 'mercado', 'tendencias', 'cultura_general'
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS a4_user_news_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  news_id UUID REFERENCES a4_noticias(id),
  viewed BOOLEAN DEFAULT FALSE,
  understood BOOLEAN DEFAULT FALSE,
  test_passed BOOLEAN,
  engagement_score FLOAT,
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS a4_despega_radar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  context_understanding_score FLOAT DEFAULT 0,
  strategic_reading_score FLOAT DEFAULT 0,
  consistency_score FLOAT DEFAULT 0,
  criterion_score FLOAT DEFAULT 0,
  overall_radar_level INT DEFAULT 1, -- Niveles 1-10
  progress_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User journey tracking
CREATE TABLE IF NOT EXISTS user_journey_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_stage VARCHAR NOT NULL, -- 'A1', 'A2', 'A3', 'A4'
  stage_progress FLOAT DEFAULT 0, -- 0-100%
  a1_completed BOOLEAN DEFAULT FALSE,
  a2_completed BOOLEAN DEFAULT FALSE,
  a3_completed BOOLEAN DEFAULT FALSE,
  a4_completed BOOLEAN DEFAULT FALSE,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_a1_conozcamonos_1_user_id ON a1_conozcamonos_1(user_id);
CREATE INDEX idx_a1_disc_user_id ON a1_disc_assessment(user_id);
CREATE INDEX idx_a1_informe_user_id ON a1_informe_completo(user_id);
CREATE INDEX idx_a2_conozcamonos_2_user_id ON a2_conozcamonos_2(user_id);
CREATE INDEX idx_a2_rutas_user_id ON a2_rutas_personalizadas(user_id);
CREATE INDEX idx_a3_entrevista_user_id ON a3_entrevista_0(user_id);
CREATE INDEX idx_a3_practicas_user_id ON a3_practicas_simulaciones(user_id);
CREATE INDEX idx_a3_cv_user_id ON a3_cv_generado(user_id);
CREATE INDEX idx_a4_radar_user_id ON a4_despega_radar(user_id);
CREATE INDEX idx_user_journey_user_id ON user_journey_progress(user_id);
