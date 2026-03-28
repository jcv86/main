-- Fase 1: Arquitectura Base A4 - Tabla de Puntaje Estratégico
-- Script: 06-create-a4-strategic-score.sql
-- Propósito: Crear tabla y lógica para puntaje dinámico que calibra A1→A4

-- 1. Tabla principal de puntaje (promedio móvil, decadencia natural)
CREATE TABLE IF NOT EXISTS a4_strategic_score (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score NUMERIC(5, 2) CHECK (score >= 0 AND score <= 100) DEFAULT 50,
  score_7day_average NUMERIC(5, 2) DEFAULT 50,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Historial de cambios de puntaje (para auditoría y calibración)
CREATE TABLE IF NOT EXISTS a4_strategic_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score_value NUMERIC(5, 2),
  source VARCHAR(50), -- 'radar_engagement', 'test_completion', 'natural_decay'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Configuración de decadencia natural (0.1% por día sin actividad)
CREATE TABLE IF NOT EXISTS a4_score_decay_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_decay_percentage NUMERIC(5, 3) DEFAULT 0.1, -- 0.1% decay per day
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. RLS Policies - Usuarios solo ven su propio puntaje
ALTER TABLE a4_strategic_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE a4_strategic_score_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own strategic score" ON a4_strategic_score
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users see own score history" ON a4_strategic_score_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage strategic scores" ON a4_strategic_score
  FOR ALL USING (auth.role() = 'service_role');

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS idx_a4_strategic_score_user_id ON a4_strategic_score(user_id);
CREATE INDEX IF NOT EXISTS idx_a4_strategic_score_history_user ON a4_strategic_score_history(user_id);
CREATE INDEX IF NOT EXISTS idx_a4_strategic_score_updated ON a4_strategic_score(updated_at DESC);

-- Inicializar configuración de decay (solo si no existe)
INSERT INTO a4_score_decay_config (daily_decay_percentage, is_active)
  SELECT 0.1, true WHERE NOT EXISTS (SELECT 1 FROM a4_score_decay_config);
