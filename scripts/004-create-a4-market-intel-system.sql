-- A4 Base: Context & Market Knowledge System
-- This table stores market intelligence, news, trends, and professional resources

CREATE TABLE IF NOT EXISTS despega_a4_market_intel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  contenido TEXT,
  tipo TEXT CHECK (tipo IN ('noticia', 'tendencia', 'recurso', 'oportunidad', 'industria', 'economia')) NOT NULL,
  categoria TEXT, -- e.g., "Tech", "Finanzas", "Retail", "Recursos", etc.
  fuente TEXT,
  url TEXT,
  publicado_en DATE,
  relevancia TEXT CHECK (relevancia IN ('alta', 'media', 'baja')) DEFAULT 'media',
  tags JSONB DEFAULT '[]',
  resumen_ia TEXT, -- AI-generated summary
  puntos_clave JSONB DEFAULT '[]', -- Key takeaways
  es_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A4 Learning Modules based on market context
CREATE TABLE IF NOT EXISTS despega_a4_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  market_intel_ids UUID[] DEFAULT '{}', -- Related market intel items
  contenido_principal TEXT,
  recursos JSONB DEFAULT '[]', -- Links, PDFs, videos
  casos_estudio JSONB DEFAULT '[]', -- Real-world examples
  preguntas_reflexion JSONB DEFAULT '[]', -- Reflection questions
  duracion_minutos INTEGER DEFAULT 30,
  puntos INTEGER DEFAULT 20,
  nivel TEXT CHECK (nivel IN ('basico', 'intermedio', 'avanzado')) DEFAULT 'intermedio',
  categoria TEXT,
  es_active BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A4 Professional News Feed (curated daily)
CREATE TABLE IF NOT EXISTS despega_a4_news_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  resumen TEXT,
  contenido TEXT,
  imagen_url TEXT,
  fuente TEXT,
  categoria TEXT,
  relevancia_score INTEGER CHECK (relevancia_score >= 0 AND relevancia_score <= 100),
  publicado_en TIMESTAMP WITH TIME ZONE,
  etiquetas JSONB DEFAULT '[]',
  en_destacado BOOLEAN DEFAULT false,
  es_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A4 Career Resources Library
CREATE TABLE IF NOT EXISTS despega_a4_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT CHECK (tipo IN ('libro', 'articulo', 'video', 'podcast', 'sitio', 'herramienta', 'curso')),
  url TEXT,
  autor TEXT,
  categoria TEXT,
  tags JSONB DEFAULT '[]',
  calificacion FLOAT CHECK (calificacion >= 1 AND calificacion <= 5),
  resenas INTEGER DEFAULT 0,
  es_recomendado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User A4 Progress
CREATE TABLE IF NOT EXISTS despega_user_a4_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES despega_a4_modules(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  reflection_responses JSONB, -- Answers to reflection questions
  puntos_earned INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- User A4 Saved Resources
CREATE TABLE IF NOT EXISTS despega_user_a4_saved_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES despega_a4_resources(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notas TEXT,
  calificacion_usuario INTEGER CHECK (calificacion_usuario >= 1 AND calificacion_usuario <= 5),
  UNIQUE(user_id, resource_id)
);

-- Enable RLS
ALTER TABLE despega_a4_market_intel ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a4_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a4_news_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_a4_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_user_a4_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE despega_user_a4_saved_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active market intel" ON despega_a4_market_intel FOR SELECT TO authenticated USING (es_active = true);
CREATE POLICY "Anyone can view active modules" ON despega_a4_modules FOR SELECT TO authenticated USING (es_active = true);
CREATE POLICY "Anyone can view news feed" ON despega_a4_news_feed FOR SELECT TO authenticated USING (es_active = true);
CREATE POLICY "Anyone can view resources" ON despega_a4_resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view own A4 progress" ON despega_user_a4_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own A4 progress" ON despega_user_a4_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own A4 progress" ON despega_user_a4_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own saved resources" ON despega_user_a4_saved_resources FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved resources" ON despega_user_a4_saved_resources FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved resources" ON despega_user_a4_saved_resources FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_a4_market_intel_tipo ON despega_a4_market_intel(tipo);
CREATE INDEX IF NOT EXISTS idx_a4_market_intel_categoria ON despega_a4_market_intel(categoria);
CREATE INDEX IF NOT EXISTS idx_a4_market_intel_date ON despega_a4_market_intel(publicado_en DESC);
CREATE INDEX IF NOT EXISTS idx_a4_modules_categoria ON despega_a4_modules(categoria);
CREATE INDEX IF NOT EXISTS idx_a4_news_publicado ON despega_a4_news_feed(publicado_en DESC);
CREATE INDEX IF NOT EXISTS idx_a4_news_destacado ON despega_a4_news_feed(en_destacado) WHERE en_destacado = true;
CREATE INDEX IF NOT EXISTS idx_a4_user_progress ON despega_user_a4_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_a4_saved_resources ON despega_user_a4_saved_resources(user_id);
