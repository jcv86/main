-- ChileValora Integration - Phase 1: Database Schema
-- Created: 2026-02-06
-- Purpose: Store and index ChileValora job profiles for brain semantic search

-- ============================================
-- Table 1: ChileValora Profiles (Base Data)
-- ============================================
CREATE TABLE IF NOT EXISTS chilevalora_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo varchar(50) UNIQUE NOT NULL,
  nombre varchar(255) NOT NULL,
  estado varchar(50) DEFAULT 'activo',
  sector varchar(100),
  industria varchar(100),
  descripcion_corta text,
  descripcion_larga text,
  requerimientos jsonb DEFAULT '{}', -- education, experience requirements
  competencias jsonb DEFAULT '{}', -- required skills
  salario_minimo integer,
  salario_maximo integer,
  moneda varchar(10) DEFAULT 'CLP',
  demanda_nivel varchar(50) DEFAULT 'medio', -- bajo, medio, alto, muy_alto
  tendencia_mercado varchar(50) DEFAULT 'estable', -- creciente, estable, decreciente
  data_adicional jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  indexed_at timestamp with time zone
);

-- ============================================
-- Table 2: ChileValora UCL (Competency Framework)
-- ============================================
CREATE TABLE IF NOT EXISTS chilevalora_ucl (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo varchar(50) UNIQUE NOT NULL,
  nombre varchar(255) NOT NULL,
  descripcion text,
  categoria varchar(100),
  nivel_profundidad integer DEFAULT 1, -- 1-5
  habilidades_incluidas text[],
  ejemplos_aplicacion text,
  est_horas_capacitacion integer,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================
-- Table 3: Profile-UCL Mapping (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS chilevalora_profile_ucl (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES chilevalora_profiles(id) ON DELETE CASCADE,
  ucl_id uuid NOT NULL REFERENCES chilevalora_ucl(id) ON DELETE CASCADE,
  es_requerida boolean DEFAULT true,
  es_deseada boolean DEFAULT false,
  nivel_minimo_recomendado integer DEFAULT 1,
  peso_importancia numeric(3,2) DEFAULT 1.0, -- 0.5 to 1.0
  created_at timestamp with time zone DEFAULT now(),
  
  UNIQUE(profile_id, ucl_id)
);

-- ============================================
-- Table 4: Embedded Chunks (for Brain RAG)
-- ============================================
-- This integrates with your existing document_chunks table
-- ChileValora profiles will be chunked and embedded here
CREATE TABLE IF NOT EXISTS chilevalora_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES chilevalora_profiles(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL,
  chunk_type varchar(50) DEFAULT 'descripcion', -- descripcion, competencias, requisitos, beneficios
  content text NOT NULL,
  token_count integer,
  embedding vector(1536), -- for pgvector similarity search
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================
-- Table 5: User-ChileValora Interactions
-- ============================================
CREATE TABLE IF NOT EXISTS user_chilevalora_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES chilevalora_profiles(id) ON DELETE CASCADE,
  interaction_type varchar(50) DEFAULT 'viewed', -- viewed, saved, applied, queried
  interest_score numeric(3,2), -- 0.0 to 1.0
  match_score numeric(3,2), -- from brain matching
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================
-- Table 6: Market Trends Tracking
-- ============================================
CREATE TABLE IF NOT EXISTS chilevalora_market_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_codigo varchar(50) NOT NULL,
  fecha date NOT NULL,
  busquedas_mes integer DEFAULT 0,
  perfiles_activos integer DEFAULT 0,
  salario_promedio_actualizado integer,
  demanda_cambio varchar(50), -- aumentando, disminuyendo, estable
  tendencia_score numeric(5,2),
  created_at timestamp with time zone DEFAULT now(),
  
  UNIQUE(profile_codigo, fecha)
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_chilevalora_profiles_sector ON chilevalora_profiles(sector);
CREATE INDEX idx_chilevalora_profiles_estado ON chilevalora_profiles(estado);
CREATE INDEX idx_chilevalora_profiles_demanda ON chilevalora_profiles(demanda_nivel);
CREATE INDEX idx_chilevalora_chunks_profile ON chilevalora_chunks(profile_id);
CREATE INDEX idx_chilevalora_chunks_embedding ON chilevalora_chunks USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_user_interactions_user ON user_chilevalora_interactions(user_id);
CREATE INDEX idx_user_interactions_profile ON user_chilevalora_interactions(profile_id);
CREATE INDEX idx_market_trends_codigo_fecha ON chilevalora_market_trends(profile_codigo, fecha DESC);

-- ============================================
-- Row-Level Security (RLS) Policies
-- ============================================
ALTER TABLE chilevalora_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chilevalora_ucl ENABLE ROW LEVEL SECURITY;
ALTER TABLE chilevalora_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chilevalora_interactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Everyone can read, only admins can write
CREATE POLICY "Anyone can view profiles" ON chilevalora_profiles FOR SELECT USING (true);

-- UCL: Everyone can read
CREATE POLICY "Anyone can view UCL" ON chilevalora_ucl FOR SELECT USING (true);

-- Chunks: Everyone can read for brain queries
CREATE POLICY "Anyone can query chunks for brain" ON chilevalora_chunks FOR SELECT USING (true);

-- User Interactions: Users can only see and modify their own
CREATE POLICY "Users view own interactions" ON user_chilevalora_interactions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own interactions" ON user_chilevalora_interactions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own interactions" ON user_chilevalora_interactions 
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- Seed: Enable pgvector extension
-- ============================================
-- Run this separately if not already enabled:
-- CREATE EXTENSION IF NOT EXISTS vector;
