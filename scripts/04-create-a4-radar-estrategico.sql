-- A4 Radar Estratégico - Complete Schema for Strategic News Platform
-- Tables for the 7-layer cognitive radar system
-- Version 1.0 - Base MVP

-- Main radar document of the day
CREATE TABLE IF NOT EXISTS public.despega_radar_tesis_dia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  tesis_estrategica TEXT NOT NULL,
  delta_estrategico TEXT NOT NULL,
  nivel_energía VARCHAR(20) NOT NULL CHECK (nivel_energía IN ('Alta', 'Confirmación', 'Contexto')),
  que_descuenta_mercado TEXT NOT NULL,
  consensus_score FLOAT DEFAULT 0.5,
  tension_narrativa TEXT,
  ritmo_narrativo VARCHAR(30) NOT NULL CHECK (ritmo_narrativo IN ('Acelerando', 'Estabilizado', 'Perdiendo fuerza')),
  impacto_plazo VARCHAR(20) NOT NULL CHECK (impacto_plazo IN ('Corto', 'Mediano', 'Largo')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Individual news articles with 7-layer analysis
CREATE TABLE IF NOT EXISTS public.despega_radar_noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tesis_dia_id UUID REFERENCES public.despega_radar_tesis_dia(id),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fuente TEXT NOT NULL,
  url TEXT UNIQUE,
  imagen_url TEXT,
  
  -- 7 Capas Obligatorias
  capa_1_tesis TEXT NOT NULL,
  capa_2_delta TEXT NOT NULL,
  capa_3_nivel_energia VARCHAR(20) NOT NULL CHECK (capa_3_nivel_energia IN ('Alta', 'Confirmación', 'Contexto')),
  capa_4_descuento_mercado TEXT NOT NULL,
  capa_5_consensus TEXT,
  capa_5_tension_narrativa TEXT,
  capa_6_ritmo_narrativo VARCHAR(30) NOT NULL CHECK (capa_6_ritmo_narrativo IN ('Acelerando', 'Estabilizado', 'Perdiendo fuerza')),
  capa_7_impacto_plazo VARCHAR(20) NOT NULL CHECK (capa_7_impacto_plazo IN ('Corto', 'Mediano', 'Largo')),
  
  fecha_publicacion TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Narrative evolution tracking
CREATE TABLE IF NOT EXISTS public.despega_radar_narrativa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  noticia_id UUID REFERENCES public.despega_radar_noticias(id),
  tipo_evolucion VARCHAR(30) NOT NULL CHECK (tipo_evolucion IN ('Continua', 'Cambia narrativa', 'Ruido pasajero', 'Inicia tendencia')),
  descripcion TEXT,
  perspectiva_anterior TEXT,
  perspectiva_nueva TEXT,
  fecha_evaluacion TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comparative radar data
CREATE TABLE IF NOT EXISTS public.despega_radar_comparativo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  tema TEXT NOT NULL,
  cobertura_mediatica FLOAT NOT NULL,
  relevancia_estructural FLOAT NOT NULL,
  gap_interpretacion FLOAT DEFAULT 0,
  descripcion TEXT,
  notas_estrategicas TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Weak signals detection
CREATE TABLE IF NOT EXISTS public.despega_radar_weak_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tesis_dia_id UUID REFERENCES public.despega_radar_tesis_dia(id),
  senal TEXT NOT NULL,
  magnitud_potencial FLOAT DEFAULT 0.3,
  timeframe_activacion VARCHAR(30) NOT NULL CHECK (timeframe_activacion IN ('Inmediato', 'Corto plazo', 'Mediano plazo', 'Largo plazo')),
  probabilidad_activacion FLOAT DEFAULT 0.5,
  descripcion TEXT,
  impacto_potencial TEXT,
  observaciones_tecnicas TEXT,
  fecha_deteccion TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User engagement with radar
CREATE TABLE IF NOT EXISTS public.despega_radar_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  noticia_id UUID REFERENCES public.despega_radar_noticias(id),
  tipo_interaccion VARCHAR(50) NOT NULL CHECK (tipo_interaccion IN ('read', 'saved', 'shared', 'commented', 'analyzed')),
  tiempo_lectura_segundos INT,
  profundidad_lectura VARCHAR(20) CHECK (profundidad_lectura IN ('Titulo', 'Resumen', 'Completo')),
  fecha_interaccion TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Radar editorial history
CREATE TABLE IF NOT EXISTS public.despega_radar_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tesis_dia_id UUID REFERENCES public.despega_radar_tesis_dia(id),
  version INT DEFAULT 1,
  cambios_realizados TEXT,
  razon_cambio TEXT,
  editor_id UUID,
  fecha_cambio TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_radar_tesis_fecha ON public.despega_radar_tesis_dia(fecha DESC);
CREATE INDEX idx_radar_noticias_tesis ON public.despega_radar_noticias(tesis_dia_id);
CREATE INDEX idx_radar_noticias_fecha ON public.despega_radar_noticias(fecha_publicacion DESC);
CREATE INDEX idx_radar_engagement_user ON public.despega_radar_engagement(user_id);
CREATE INDEX idx_radar_engagement_noticia ON public.despega_radar_engagement(noticia_id);
CREATE INDEX idx_radar_comparativo_fecha ON public.despega_radar_comparativo(fecha DESC);
CREATE INDEX idx_radar_weak_signals_tesis ON public.despega_radar_weak_signals(tesis_dia_id);

-- Enable RLS on all tables
ALTER TABLE public.despega_radar_tesis_dia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.despega_radar_noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.despega_radar_narrativa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.despega_radar_comparativo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.despega_radar_weak_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.despega_radar_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.despega_radar_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read access for radar content
CREATE POLICY "authenticated_can_read_tesis" ON public.despega_radar_tesis_dia
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_read_noticias" ON public.despega_radar_noticias
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_read_narrativa" ON public.despega_radar_narrativa
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_read_comparativo" ON public.despega_radar_comparativo
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "authenticated_can_read_weak_signals" ON public.despega_radar_weak_signals
  FOR SELECT USING (auth.role() = 'authenticated');

-- User engagement - only read/write own data
CREATE POLICY "users_can_manage_own_engagement" ON public.despega_radar_engagement
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- History - read only for authenticated
CREATE POLICY "authenticated_can_read_history" ON public.despega_radar_history
  FOR SELECT USING (auth.role() = 'authenticated');

-- Sample seed data for MVP
INSERT INTO public.despega_radar_tesis_dia (
  fecha, tesis_estrategica, delta_estrategico, nivel_energía, 
  que_descuenta_mercado, ritmo_narrativo, impacto_plazo
) VALUES (
  CURRENT_DATE,
  'El mercado está reprecificando la tasa de interés neutral en contexto de inflación persistente. El consenso se mueve pero lentamente.',
  'vs ayer: Datos de empleo en US más débiles de lo esperado, abriendo space para reinterpretación dovish. Mercado bonos lo captura primero.',
  'Confirmación',
  'El mercado descuenta 2.5 alzas 2024 vs 3.5 hace 2 meses. Eso es viejo. Ahora pregunta si el peak ya pasó.',
  'Estabilizado',
  'Mediano'
);
