-- Create A4 Gamified Tests Table

-- A4 Gamified Tests (the tests themselves)
CREATE TABLE IF NOT EXISTS public.a4_gamified_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  categoria TEXT NOT NULL,
  nivel TEXT NOT NULL CHECK (nivel IN ('basico', 'intermedio', 'avanzado')),
  puntos INTEGER NOT NULL DEFAULT 10,
  badge_id TEXT,
  badge_name TEXT,
  preguntas JSONB NOT NULL, -- Array of question objects
  tiempo_limite_minutos INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A4 User Test Completions (user progress on tests)
CREATE TABLE IF NOT EXISTS public.a4_user_test_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES public.a4_gamified_tests(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- Array of user answers
  score INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.a4_gamified_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.a4_user_test_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for a4_gamified_tests (public read)
CREATE POLICY "Tests are viewable by all authenticated users" 
  ON public.a4_gamified_tests 
  FOR SELECT 
  USING (is_active = TRUE);

-- RLS Policies for a4_user_test_completions
CREATE POLICY "Users see own test completions" 
  ON public.a4_user_test_completions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own test completion" 
  ON public.a4_user_test_completions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_a4_gamified_tests_category ON public.a4_gamified_tests(categoria);
CREATE INDEX idx_a4_gamified_tests_active ON public.a4_gamified_tests(is_active);
CREATE INDEX idx_a4_user_test_completions_user ON public.a4_user_test_completions(user_id);
CREATE INDEX idx_a4_user_test_completions_test ON public.a4_user_test_completions(test_id);
CREATE INDEX idx_a4_user_test_completions_user_test ON public.a4_user_test_completions(user_id, test_id);

-- Seed some sample tests
INSERT INTO public.a4_gamified_tests (titulo, descripcion, categoria, nivel, puntos, badge_name, preguntas, tiempo_limite_minutos, is_active)
VALUES 
(
  'Economía Básica de Chile',
  'Comprende los fundamentos de la economía chilena actual',
  'Economía',
  'basico',
  10,
  'Economista Principiante',
  '[
    {
      "id": "q1",
      "pregunta": "¿Cuál es el principal indicador de actividad económica en Chile?",
      "opciones": ["IMACEC", "IPC", "TPM", "PIB"],
      "respuesta_correcta": 0,
      "explicacion": "El IMACEC es el Índice de Actividad Económica y mide la actividad productiva del país."
    },
    {
      "id": "q2",
      "pregunta": "¿Qué mide el IPC?",
      "opciones": ["Desempleo", "Inflación", "Crecimiento económico", "Tipos de cambio"],
      "respuesta_correcta": 1,
      "explicacion": "El IPC (Índice de Precios al Consumidor) mide la inflación, el cambio de precios de bienes y servicios."
    },
    {
      "id": "q3",
      "pregunta": "¿Cuál es la tasa de política monetaria (TPM)?",
      "opciones": ["La tasa de desempleo", "La tasa de interés que fija el Banco Central", "El crecimiento del PIB", "La inflación"],
      "respuesta_correcta": 1,
      "explicacion": "La TPM es la tasa de interés que fija el Banco Central de Chile como herramienta de política monetaria."
    }
  ]'::jsonb,
  15,
  TRUE
),
(
  'Mercado Laboral 2024-2025',
  'Tendencias actuales del mercado laboral chileno',
  'Mercado Laboral',
  'intermedio',
  15,
  'Experto Laboral',
  '[
    {
      "id": "q1",
      "pregunta": "¿Cuál ha sido la tendencia del desempleo en Chile en los últimos años?",
      "opciones": ["Constante aumento", "Varía entre 7-9%", "Disminución sostenida", "Cerca de 0%"],
      "respuesta_correcta": 1,
      "explicacion": "El desempleo en Chile ha fluctuado principalmente entre 7-9% en los últimos años."
    },
    {
      "id": "q2",
      "pregunta": "¿Qué sectores están creciendo más en el mercado laboral chileno?",
      "opciones": ["Agricultura", "Tecnología y servicios", "Manufactura", "Minería"],
      "respuesta_correcta": 1,
      "explicacion": "Los sectores de tecnología y servicios están en crecimiento, especialmente en las grandes ciudades."
    },
    {
      "id": "q3",
      "pregunta": "¿Cuál es el salario promedio en Chile?",
      "opciones": ["$500,000", "$800,000 - $1,200,000", "$2,000,000", "Varía por sector"],
      "respuesta_correcta": 1,
      "explicacion": "El salario promedio en Chile oscila entre $800,000 y $1,200,000 pesos, variando según sector y experiencia."
    }
  ]'::jsonb,
  15,
  TRUE
),
(
  'Tendencias Industriales 2025',
  'Análisis profundo de las tendencias que mueven la industria',
  'Tendencias',
  'avanzado',
  20,
  'Futurólogo Industrial',
  '[
    {
      "id": "q1",
      "pregunta": "¿Cuál es el impacto de la IA en el mercado laboral según expertos?",
      "opciones": ["Eliminará todos los trabajos", "Transformará roles y creará nuevas oportunidades", "No tendrá impacto", "Solo afectará a startups"],
      "respuesta_correcta": 1,
      "explicacion": "La IA transformará muchos roles pero también creará nuevas oportunidades y demandas de talento."
    },
    {
      "id": "q2",
      "pregunta": "¿Qué competencias serán más demandadas en 2025-2026?",
      "opciones": ["Solo programación", "Adaptabilidad, pensamiento crítico, y habilidades blandas", "Solo administración", "Especialización muy estrecha"],
      "respuesta_correcta": 1,
      "explicacion": "La adaptabilidad y habilidades blandas serán críticas en el futuro del trabajo."
    },
    {
      "id": "q3",
      "pregunta": "¿Cuál es la importancia de la economía digital en Chile?",
      "opciones": ["Marginal", "Creciente y transformadora", "Decreciente", "Sin importancia"],
      "respuesta_correcta": 1,
      "explicacion": "La economía digital es creciente y transformadora en Chile, especialmente en servicios y educación."
    }
  ]'::jsonb,
  20,
  TRUE
);

-- Seed some sample test completions for testing (optional - use real user IDs)
-- Note: Uncomment and adjust user_id if needed for testing
-- INSERT INTO public.a4_user_test_completions (user_id, test_id, answers, score, completed_at)
-- SELECT auth.uid(), id, '[0, 1, 1]', 100, NOW()
-- FROM public.a4_gamified_tests WHERE titulo = 'Economía Básica de Chile' LIMIT 1;
