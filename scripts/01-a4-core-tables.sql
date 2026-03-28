-- =====================
-- A4 CORE TABLES
-- =====================

-- 1. Tesis Estratégicas del Día
CREATE TABLE IF NOT EXISTS a4_tesis_del_dia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  tesis_estrategica TEXT NOT NULL,
  delta_estrategico TEXT,
  nivel_energía VARCHAR(50),
  que_descuenta_mercado TEXT,
  tension_narrativa TEXT,
  ritmo_narrativo VARCHAR(50),
  impacto_plazo VARCHAR(50),
  consensus_score DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(fecha)
);

-- 2. Noticias (News Feed)
CREATE TABLE IF NOT EXISTS a4_noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  source VARCHAR(255),
  published_at TIMESTAMP NOT NULL,
  capa_1_tesis BOOLEAN DEFAULT FALSE,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_a4_noticias_category ON a4_noticias(category);
CREATE INDEX idx_a4_noticias_published_at ON a4_noticias(published_at DESC);

-- 3. Weak Signals
CREATE TABLE IF NOT EXISTS a4_weak_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senal VARCHAR(255) NOT NULL,
  descripcion TEXT,
  probabilidad_activacion DECIMAL(3,2),
  timeframe_activacion VARCHAR(100),
  impacto_potencial VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Gamified Tests
CREATE TABLE IF NOT EXISTS a4_gamified_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  questions JSONB, -- Array of {id, question, options, correct_answer}
  difficulty VARCHAR(50),
  duration_minutes INTEGER DEFAULT 5,
  points_reward INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. User Test Completions
CREATE TABLE IF NOT EXISTS a4_user_test_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  test_id UUID NOT NULL REFERENCES a4_gamified_tests(id),
  answers JSONB, -- User's answers
  score DECIMAL(5,2),
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_a4_user_test_completions_user ON a4_user_test_completions(user_id);
CREATE INDEX idx_a4_user_test_completions_test ON a4_user_test_completions(test_id);

-- 6. Biblioteca (Learning Resources)
CREATE TABLE IF NOT EXISTS biblioteca (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  type VARCHAR(50), -- article, video, book, tool
  category VARCHAR(100),
  url VARCHAR(500),
  author VARCHAR(255),
  tags TEXT[], -- Array of tags
  is_verified BOOLEAN DEFAULT FALSE,
  relevance_score DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_biblioteca_category ON biblioteca(category);
CREATE INDEX idx_biblioteca_is_verified ON biblioteca(is_verified);

-- 7. Module Progress
CREATE TABLE IF NOT EXISTS a4_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module_name VARCHAR(255),
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  last_lesson_completed VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_a4_module_progress_user ON a4_module_progress(user_id);
