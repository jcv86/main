-- =====================
-- A4 SEED DATA
-- =====================

-- 1. Seed Tesis del Día
INSERT INTO a4_tesis_del_dia (
  fecha, 
  tesis_estrategica, 
  delta_estrategico,
  nivel_energía,
  que_descuenta_mercado,
  tension_narrativa,
  ritmo_narrativo,
  impacto_plazo,
  consensus_score
) VALUES (
  CURRENT_DATE,
  'La IA Generativa consolidará su adopción en empresas, pero el diferenciador será la capacidad de integración con datos propios',
  'De "¿Qué es la IA?" a "¿Cómo optimizar nuestros procesos con IA?"',
  'Alta',
  'Que la IA será commodity en 12-18 meses',
  'Transición de hype a aplicación práctica',
  'Acelerado',
  'Plazo Inmediato (1-3 meses)',
  0.75
),
(
  CURRENT_DATE - INTERVAL '1 day',
  'Sustentabilidad deja de ser ESG para convertirse en estrategia de diferenciación competitiva',
  'De compliance a ventaja competitiva en el mercado premium',
  'Media-Alta',
  'Que consumidores pagarán premium por sostenibilidad',
  'Cambio de narrativa corporativa',
  'Sostenido',
  'Plazo Corto (3-6 meses)',
  0.68
);

-- 2. Seed Noticias
INSERT INTO a4_noticias (title, content, category, source, published_at, capa_1_tesis, descripcion) VALUES
('Grandes modelos de lenguaje transforman automatización empresarial', 'Las últimas generaciones de LLMs están siendo integradas en sistemas de automatización...', 'IA y Automatización', 'TechCrunch', NOW() - INTERVAL '2 hours', true, 'Cómo la IA está revolucionando los procesos empresariales'),
('Competidores tradicionales lanzan alternativas a ChatGPT', 'Empresas de software establecidas presentan sus propias soluciones de IA generativa...', 'Competencia', 'Bloomberg', NOW() - INTERVAL '4 hours', true, 'La competencia se intensifica en el mercado de IA'),
('Marcos regulatorios emergentes para IA en la UE', 'La Unión Europea avanza en regulación de sistemas de inteligencia artificial...', 'Regulación', 'Reuters', NOW() - INTERVAL '6 hours', false, 'Nueva normativa para garantizar uso responsable de IA'),
('Startups de sostenibilidad alcanzan valuaciones récord', 'Empresas enfocadas en soluciones sustentables reciben inversión récord...', 'Sustentabilidad', 'VentureBeat', NOW() - INTERVAL '8 hours', true, 'Inversores apuestan por empresas sostenibles'),
('Transformación digital acelera en Latinoamérica', 'Empresas latinas invierten 40% más en digitalización que hace 2 años...', 'Transformación Digital', 'El Economista', NOW() - INTERVAL '10 hours', false, 'Latinoamérica se acelera digitalmente');

-- 3. Seed Weak Signals
INSERT INTO a4_weak_signals (senal, descripcion, probabilidad_activacion, timeframe_activacion, impacto_potencial) VALUES
('Convergencia entre Blockchain y IA en sistemas de identidad', 'Proyectos piloto de identidades descentralizadas con verificación por IA', 0.35, '6-12 meses', 'Alto'),
('Resurgimiento de arquitecturas de software local-first', 'Movimiento creciente en desarrollo hacia aplicaciones que funcionan offline', 0.45, '3-6 meses', 'Medio-Alto'),
('Regulación de consumo de energía en data centers', 'Presión regulatoria y ambiental sobre el consumo energético de la infraestructura tech', 0.60, '1-3 meses', 'Alto'),
('Fragmentación de internet por geopolítica', 'Riesgo de internet regionales debido a tensiones internacionales', 0.40, '6-18 meses', 'Crítico');

-- 4. Seed Gamified Tests
INSERT INTO a4_gamified_tests (title, description, questions, difficulty, duration_minutes, points_reward, is_active) VALUES
(
  'Estrategia de Transformación Digital',
  'Prueba interactiva sobre cómo implementar transformación digital efectiva',
  '[
    {
      "id": "q1",
      "question": "¿Cuál es el primer paso en una transformación digital?",
      "options": ["Invertir en tecnología", "Cambio cultural y alineación", "Contratar consultores", "Migrar a cloud"],
      "correct_answer": 1
    },
    {
      "id": "q2", 
      "question": "¿Qué diferencia a los líderes en transformación digital?",
      "options": ["Presupuesto mayor", "Ecosistema de partnerships", "Mayor edad de la empresa", "Más empleados"],
      "correct_answer": 1
    }
  ]'::jsonb,
  'Intermedio',
  10,
  15,
  true
),
(
  'Introducción a la IA Generativa',
  'Conceptos básicos sobre cómo funcionan los modelos de lenguaje',
  '[
    {
      "id": "q1",
      "question": "¿Qué permite a un LLM generar texto coherente?",
      "options": ["Búsqueda en internet", "Predicción de siguiente token", "Reglas hardcodeadas", "Memoria perfecta"],
      "correct_answer": 1
    }
  ]'::jsonb,
  'Básico',
  5,
  10,
  true
);

-- 5. Seed Biblioteca Resources
INSERT INTO biblioteca (title, description, type, category, url, author, tags, is_verified, relevance_score) VALUES
('El Manifiesto de la Transformación Digital', 'Guía estratégica sobre cómo las empresas pueden transformarse digitalmente', 'book', 'Transformación Digital', 'https://example.com/libro1', 'Expert Author', ARRAY['transformación', 'digital', 'estrategia'], true, 0.95),
('IA Generativa: Oportunidades y Riesgos', 'Análisis en profundidad del impacto de la IA generativa en la economía', 'article', 'IA y Automatización', 'https://example.com/articulo1', 'Tech Analyst', ARRAY['IA', 'generativa', 'impacto'], true, 0.90),
('Sustainability Report 2024', 'Tendencias y mejores prácticas en sustentabilidad empresarial', 'article', 'Sustentabilidad', 'https://example.com/report1', 'Global Institute', ARRAY['ESG', 'sostenibilidad', 'reporte'], true, 0.85),
('Frameworks de Implementación de IA', 'Herramientas prácticas para implementar IA en empresas', 'tool', 'IA y Automatización', 'https://example.com/tool1', 'Tech Company', ARRAY['IA', 'implementación', 'framework'], true, 0.88);

-- 6. Initial Sample User Data (if using test users)
-- Note: In production, these are created through authentication flow

-- Create a function to safely initialize user data on signup
CREATE OR REPLACE FUNCTION initialize_user_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Initialize module progress
  INSERT INTO a4_module_progress (user_id, module_name, completion_percentage)
  VALUES (NEW.id, 'Introducción', 0);

  -- Initialize points history with 0 balance
  INSERT INTO a4_points_history (user_id, puntos_ganados, balance_anterior, balance_nuevo, razon)
  VALUES (NEW.id, 0, 0, 0, 'initialization');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run on new user creation (if using auth.users table)
CREATE TRIGGER trigger_initialize_user_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION initialize_user_on_signup();
