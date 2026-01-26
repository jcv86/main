-- DESPEGA CEREBRAL TEST - Schema para almacenar respuestas y resultados del test

-- Tabla 1: Respuestas del Test
CREATE TABLE IF NOT EXISTS despega_cerebral_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id VARCHAR NOT NULL,
  question_text TEXT,
  answer_text TEXT,
  answer_score JSONB DEFAULT '{}',  -- {dimensionA: 2, dimensionB: 1, dimensionC: 0, dimensionD: 1}
  question_type VARCHAR CHECK (question_type IN ('conversational', 'multiple_choice', 'scale')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Tabla 2: Perfil del Usuario (resultado procesado)
CREATE TABLE IF NOT EXISTS despega_cerebral_perfil (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  tipo_perfil VARCHAR(1) CHECK (tipo_perfil IN ('A', 'B', 'C', 'D')),
  descripcion_perfil TEXT,
  puntuacion_a INTEGER DEFAULT 0,
  puntuacion_b INTEGER DEFAULT 0,
  puntuacion_c INTEGER DEFAULT 0,
  puntuacion_d INTEGER DEFAULT 0,
  principales_caracteristicas JSONB DEFAULT '{}',
  fortalezas JSONB DEFAULT '[]',
  areas_mejora JSONB DEFAULT '[]',
  empleos_recomendados JSONB DEFAULT '[]',
  compatibilidad_perfiles JSONB DEFAULT '{}',  -- {A: 85, B: 60, C: 45}
  test_version VARCHAR DEFAULT '1.0',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 3: Informe Generado (FREE vs PREMIUM)
CREATE TABLE IF NOT EXISTS despega_perfil_informe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  perfil_id UUID REFERENCES despega_cerebral_perfil(id) ON DELETE CASCADE,
  version VARCHAR CHECK (version IN ('free', 'premium')),
  
  -- Secciones básicas (FREE)
  portada JSONB DEFAULT '{}',
  resumen_ejecutivo JSONB DEFAULT '{}',
  analisis_comportamental JSONB DEFAULT '{}',
  
  -- Secciones PREMIUM
  competencias_detalladas JSONB DEFAULT '{}',
  cip_integration JSONB DEFAULT '{}',
  puestos_ideales JSONB DEFAULT '{}',
  ruta_personalizada JSONB DEFAULT '{}',
  comparativa_usuarios JSONB DEFAULT '{}',
  plan_30_60_90 JSONB DEFAULT '{}',
  recomendaciones_api JSONB DEFAULT '{}',
  
  pdf_url TEXT,
  html_url TEXT,
  shareable_link TEXT,
  
  is_sharable BOOLEAN DEFAULT false,
  can_api_access BOOLEAN DEFAULT false,
  
  generated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, version)
);

-- Tabla 4: Comparativas Anónimas (para benchmarking)
CREATE TABLE IF NOT EXISTS despega_perfil_benchmark (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_perfil VARCHAR(1),
  total_usuarios INTEGER DEFAULT 1,
  edad_promedio NUMERIC,
  genero_distribucion JSONB DEFAULT '{}',
  empleos_principales JSONB DEFAULT '[]',
  salario_promedio NUMERIC,
  satisfaccion_laboral NUMERIC,
  tendencia_30_dias TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices
CREATE INDEX idx_despega_cerebral_responses_user ON despega_cerebral_responses(user_id);
CREATE INDEX idx_despega_cerebral_perfil_user ON despega_cerebral_perfil(user_id);
CREATE INDEX idx_despega_perfil_informe_user ON despega_perfil_informe(user_id);
CREATE INDEX idx_despega_perfil_informe_version ON despega_perfil_informe(version);
