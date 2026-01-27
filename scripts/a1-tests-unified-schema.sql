-- ============================================
-- A1 TESTS UNIFIED SCHEMA
-- Tests: Despega Cerebral, Inteligencia Emocional, Mapa Personalidad, 5 Dimensiones, Brújula Vocacional, Competencias
-- ============================================

-- Tabla principal de resultados de tests
CREATE TABLE a1_tests_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  test_type VARCHAR(50) NOT NULL, -- 'cerebral', 'inteligencia_emocional', 'mapa_personalidad', '5_dimensiones', 'brujula_vocacional', 'competencias'
  test_name VARCHAR(255) NOT NULL,
  responses JSONB NOT NULL,
  score INT,
  profile_type VARCHAR(20),
  resultado_texto TEXT,
  completed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, test_type)
);

-- Tabla de dependencias/requisitos entre tests
CREATE TABLE a1_test_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_type VARCHAR(50) NOT NULL,
  requires_test_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de progreso del usuario en A1
CREATE TABLE a1_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users UNIQUE NOT NULL,
  tests_completed INT DEFAULT 0,
  cerebral_completed BOOLEAN DEFAULT FALSE,
  inteligencia_emocional_completed BOOLEAN DEFAULT FALSE,
  mapa_personalidad_completed BOOLEAN DEFAULT FALSE,
  cinco_dimensiones_completed BOOLEAN DEFAULT FALSE,
  brujula_vocacional_completed BOOLEAN DEFAULT FALSE,
  competencias_completed BOOLEAN DEFAULT FALSE,
  unified_profile JSONB,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de informe consolidado A1
CREATE TABLE a1_unified_report (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users UNIQUE NOT NULL,
  perfil_disco_type VARCHAR(20),
  inteligencia_emocional_score INT,
  personalidad_tipo VARCHAR(100),
  cinco_dimensiones JSONB,
  intereses_vocacionales TEXT[],
  competencias_principales TEXT[],
  recomendaciones TEXT,
  version VARCHAR(10), -- 'free' o 'premium'
  generated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar requisitos de tests
INSERT INTO a1_test_requirements (test_type, requires_test_type) VALUES
  ('mapa_personalidad', 'cerebral'),
  ('cinco_dimensiones', 'cerebral'),
  ('cinco_dimensiones', 'inteligencia_emocional'),
  ('brujula_vocacional', 'mapa_personalidad'),
  ('competencias', 'cinco_dimensiones'),
  ('competencias', 'brujula_vocacional');

-- Índices para performance
CREATE INDEX idx_a1_results_user ON a1_tests_results(user_id);
CREATE INDEX idx_a1_results_type ON a1_tests_results(test_type);
CREATE INDEX idx_a1_progress_user ON a1_progress(user_id);
CREATE INDEX idx_a1_report_user ON a1_unified_report(user_id);

-- RLS Policies
ALTER TABLE a1_tests_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE a1_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE a1_unified_report ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own test results" ON a1_tests_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test results" ON a1_tests_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON a1_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON a1_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own report" ON a1_unified_report
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own report" ON a1_unified_report
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own report" ON a1_unified_report
  FOR UPDATE USING (auth.uid() = user_id);
