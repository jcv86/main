-- =====================
-- A4 ENGAGEMENT & GAMIFICATION TABLES
-- =====================

-- 1. News Engagement Tracking
CREATE TABLE IF NOT EXISTS a4_news_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  news_id UUID NOT NULL REFERENCES a4_noticias(id),
  leido BOOLEAN DEFAULT FALSE,
  guardado BOOLEAN DEFAULT FALSE,
  leido_at TIMESTAMP,
  guardado_at TIMESTAMP,
  puntos_ganados INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(user_id, news_id)
);

CREATE INDEX idx_a4_news_engagement_user ON a4_news_engagement(user_id);
CREATE INDEX idx_a4_news_engagement_leido ON a4_news_engagement(leido);

-- 2. User Saved Resources
CREATE TABLE IF NOT EXISTS a4_user_saved_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  resource_id UUID NOT NULL,
  resource_type VARCHAR(50),
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_a4_user_saved_resources_user ON a4_user_saved_resources(user_id);

-- 3. Points History
CREATE TABLE IF NOT EXISTS a4_points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  puntos_ganados INTEGER NOT NULL,
  balance_anterior INTEGER DEFAULT 0,
  balance_nuevo INTEGER DEFAULT 0,
  razon VARCHAR(255), -- read_article, share_article, complete_test, etc.
  relacionado_a VARCHAR(255),
  relacionado_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_a4_points_history_user ON a4_points_history(user_id);
CREATE INDEX idx_a4_points_history_razon ON a4_points_history(razon);
CREATE INDEX idx_a4_points_history_created_at ON a4_points_history(created_at DESC);

-- 4. User Badges/Achievements
CREATE TABLE IF NOT EXISTS a4_user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_id VARCHAR(100) NOT NULL,
  badge_name VARCHAR(255),
  description TEXT,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_a4_user_badges_user ON a4_user_badges(user_id);

-- 5. Badge Definitions (Reference Table)
CREATE TABLE IF NOT EXISTS a4_badge_definitions (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  requirement TEXT,
  points_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert badge definitions
INSERT INTO a4_badge_definitions (id, name, description, icon, requirement, points_reward) VALUES
('first-article', 'Lector Principiante', 'Lee tu primer artículo', '📖', 'Lee 1 artículo', 10),
('5-articles', 'Lector Ávido', 'Lee múltiples artículos', '📚', 'Lee 5 artículos', 25),
('10-articles', 'Experto Lector', 'Consumidor voraz de contenido', '🎯', 'Lee 10 artículos', 50),
('first-test', 'Estudiante', 'Completa tu primera prueba', '✅', 'Completa 1 prueba', 15),
('5-tests', 'Académico', 'Estudia consistentemente', '🏆', 'Completa 5 pruebas', 75),
('perfect-score', 'Perfeccionista', 'Obtén calificación perfecta', '⭐', 'Obtén 100% en una prueba', 100),
('streak-7', 'Consistencia', 'Activo una semana seguida', '🔥', '7 días consecutivos', 50),
('streak-30', 'Maestría', 'Un mes de dedicación', '👑', '30 días consecutivos', 200),
('social-butterfly', 'Mariposa Social', 'Comparte conocimiento', '🦋', 'Comparte 5 artículos', 40),
('knowledge-hub', 'Centro de Conocimiento', 'Constructor de biblioteca', '🌟', 'Guarda 10 recursos', 60)
ON CONFLICT (id) DO NOTHING;

-- 6. Personalized Feeds
CREATE TABLE IF NOT EXISTS a4_personalized_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  feed_name VARCHAR(255),
  description TEXT,
  priority VARCHAR(50), -- high, medium, low
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_a4_personalized_feeds_user ON a4_personalized_feeds(user_id);

-- 7. DISC Assessment Results (Personalization)
CREATE TABLE IF NOT EXISTS a1_disc_assessment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  disc_profile JSONB, -- {D: 0.30, I: 0.25, S: 0.20, C: 0.25}
  dominant_pattern VARCHAR(1),
  secondary_pattern VARCHAR(1),
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_a1_disc_assessment_user ON a1_disc_assessment(user_id);
