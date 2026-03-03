-- CANON v1.1 Database Tables
-- Creates the three core tables for the CANON system: Conozcámonos 1, A1 Despega Cerebral, and Conozcámonos 2

-- Table 1: canon_conozcamonos_1_responses
-- Pre-A1 contextual information (7 questions)
CREATE TABLE IF NOT EXISTS canon_conozcamonos_1_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  test_name VARCHAR(255) DEFAULT 'Despega Cerebral',
  
  -- 7 Conozcámonos 1 Questions
  q1_contexto_actual TEXT, -- ¿Cuál es tu contexto actual de vida/trabajo?
  q2_desafio_principal TEXT, -- ¿Cuál es tu desafío principal AHORA?
  q3_tiempo_disponible TEXT, -- ¿Cuánto tiempo puedes dedicar realmente?
  q4_recurso_valioso TEXT, -- ¿Qué recurso es más valioso para ti?
  q5_estilo_aprender TEXT, -- ¿Cuál es tu estilo de aprender?
  q6_expectativa TEXT, -- ¿Qué esperas de este proceso?
  q7_restriccion TEXT, -- ¿Qué restricción te frenar?
  
  responses JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE
);

-- Table 2: canon_conozcamonos_2_responses
-- Post-Informe execution planning (2 steps: 9 + 5 questions)
CREATE TABLE IF NOT EXISTS canon_conozcamonos_2_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  test_name VARCHAR(255) DEFAULT 'Despega Cerebral',
  
  -- Step 1: Ruta 30 días (9 preguntas obligatorias)
  step1_completed BOOLEAN DEFAULT FALSE,
  step1_completed_at TIMESTAMP WITH TIME ZONE,
  
  q1_energia_disponible TEXT, -- ¿Cuánta energía tienes disponible?
  q2_tempo_preferido TEXT, -- ¿Cuál es tu tempo preferido?
  q3_barrera_principal TEXT, -- ¿Cuál es tu barrera principal?
  q4_formato_contenido TEXT, -- ¿Qué formato de contenido prefieres?
  q5_soporte_necesario TEXT, -- ¿Qué soporte necesitas?
  q6_metrica_exito TEXT, -- ¿Cuál será tu métrica de éxito?
  q7_frecuencia_checkin TEXT, -- ¿Con qué frecuencia necesitas check-in?
  q8_ajuste_requerido TEXT, -- ¿Qué ajuste requiere tu ruta?
  q9_commitment_nivel TEXT, -- ¿Cuál es tu nivel de compromiso?
  
  -- Step 2: Ruta 60/90 días (5 preguntas opcionales)
  step2_completed BOOLEAN DEFAULT FALSE,
  step2_completed_at TIMESTAMP WITH TIME ZONE,
  
  q10_siguiente_hito TEXT, -- ¿Cuál es tu siguiente hito?
  q11_nivel_profundidad TEXT, -- ¿Qué nivel de profundidad?
  q12_expansion_temas TEXT, -- ¿Qué expansión de temas?
  q13_ritmo_escalado TEXT, -- ¿Cuál será el ritmo?
  q14_vision_90_dias TEXT, -- ¿Cuál es tu visión?
  
  responses JSONB DEFAULT '{}',
  generated_route_30 JSONB, -- Ruta generada para 30 días
  generated_route_60 JSONB, -- Ruta generada para 60 días
  generated_route_90 JSONB, -- Ruta generada para 90 días
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Table 3: canon_rules_engine
-- Maps responses to rules to outputs (Nivel 3 Motor de Reglas)
CREATE TABLE IF NOT EXISTS canon_rules_engine (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id VARCHAR(255) NOT NULL UNIQUE,
  rule_name VARCHAR(255) NOT NULL,
  source_phase VARCHAR(50), -- 'conozcamonos1', 'a1', 'conozcamonos2_step1', 'conozcamonos2_step2'
  
  -- Input conditions (what triggers this rule)
  input_question VARCHAR(255),
  input_condition JSONB, -- { "field": "q1_contexto_actual", "operator": "contains", "value": "empresa" }
  
  -- Output action (what happens when rule is triggered)
  output_action VARCHAR(255), -- 'modify_mission', 'adjust_difficulty', 'add_support', 'adjust_frequency'
  output_parameters JSONB, -- { "mission_type": "professional", "difficulty": "intermediate" }
  
  -- Traceability
  description TEXT,
  documentation_url TEXT,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 4: canon_user_journey_trazability
-- Tracks the link between user responses and generated missions/routes
CREATE TABLE IF NOT EXISTS canon_user_journey_trazability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Source information
  source_phase VARCHAR(50), -- which phase generated this
  source_question_id VARCHAR(255),
  source_question_text TEXT,
  source_response TEXT,
  
  -- Rules applied
  rules_applied JSONB, -- array of rule IDs that matched
  
  -- Generated output
  output_type VARCHAR(50), -- 'mission', 'route_adjustment', 'support_add'
  output_id UUID,
  output_details JSONB,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 5: canon_generated_routes
-- Stores the complete 30/60/90 day routes generated for users
CREATE TABLE IF NOT EXISTS canon_generated_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  a1_profile_type VARCHAR(1), -- D, I, S, C
  
  -- Source data
  conozcamonos_1_id UUID REFERENCES canon_conozcamonos_1_responses(id),
  conozcamonos_2_id UUID REFERENCES canon_conozcamonos_2_responses(id),
  
  -- Generated routes
  ruta_30_dias JSONB, -- 30-day missions array with trazability
  ruta_60_dias JSONB, -- 60-day missions array with trazability
  ruta_90_dias JSONB, -- 90-day missions array with trazability
  
  -- Overall route metadata
  total_missions INTEGER,
  estimated_hours NUMERIC,
  difficulty_level VARCHAR(50),
  personalization_score INTEGER, -- 0-100 based on how tailored it is
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- RLS Policies for canon_conozcamonos_1_responses
ALTER TABLE canon_conozcamonos_1_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own C1 responses"
  ON canon_conozcamonos_1_responses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own C1 responses"
  ON canon_conozcamonos_1_responses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own C1 responses"
  ON canon_conozcamonos_1_responses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for canon_conozcamonos_2_responses
ALTER TABLE canon_conozcamonos_2_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own C2 responses"
  ON canon_conozcamonos_2_responses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own C2 responses"
  ON canon_conozcamonos_2_responses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own C2 responses"
  ON canon_conozcamonos_2_responses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for canon_user_journey_trazability
ALTER TABLE canon_user_journey_trazability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trazability"
  ON canon_user_journey_trazability
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert trazability"
  ON canon_user_journey_trazability
  FOR INSERT
  WITH CHECK (TRUE);

-- RLS Policies for canon_generated_routes
ALTER TABLE canon_generated_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generated routes"
  ON canon_generated_routes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage generated routes"
  ON canon_generated_routes
  FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

-- Rules Engine table (admin only, no RLS needed for now)
ALTER TABLE canon_rules_engine ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rules engine"
  ON canon_rules_engine
  FOR SELECT
  USING (TRUE);

-- Indexes for performance
CREATE INDEX idx_canon_c1_user_id ON canon_conozcamonos_1_responses(user_id);
CREATE INDEX idx_canon_c1_created_at ON canon_conozcamonos_1_responses(created_at);
CREATE INDEX idx_canon_c2_user_id ON canon_conozcamonos_2_responses(user_id);
CREATE INDEX idx_canon_c2_step1_completed ON canon_conozcamonos_2_responses(step1_completed);
CREATE INDEX idx_canon_routes_user_id ON canon_generated_routes(user_id);
CREATE INDEX idx_canon_trazability_user_id ON canon_user_journey_trazability(user_id);
CREATE INDEX idx_canon_rules_active ON canon_rules_engine(is_active);
