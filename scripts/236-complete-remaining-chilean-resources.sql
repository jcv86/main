-- Completar los últimos 4 recursos web del mercado chileno (47-50)

-- 47. Memoria Chilena DUECh
INSERT INTO web_resources (
  url,
  title,
  description,
  content,
  category,
  source_type,
  country,
  tags,
  author,
  published_date,
  metadata
) VALUES (
  'https://www.memoriachilena.gob.cl/602/w3-article-126516.html',
  'Memoria Chilena - Diccionario del Español de Chile',
  'Recurso patrimonial sobre el español chileno en Memoria Chilena',
  'Memoria Chilena, portal de la Biblioteca Nacional, conserva y difunde recursos sobre el español chileno, incluyendo ediciones históricas del DUECh y otros diccionarios. Proporciona: contexto histórico del desarrollo lexicográfico chileno, acceso a ediciones antiguas, análisis de evolución del léxico, y material complementario. Es útil para: investigación lingüística, comprensión histórica del lenguaje profesional, estudios culturales, y contextualización de términos técnicos chilenos. El portal incluye material bibliográfico, documentos, y análisis académico.',
  'Léxico/Modismos',
  'government',
  'Chile',
  ARRAY['DUECh', 'Memoria Chilena', 'patrimonio', 'español chileno', 'historia'],
  'Biblioteca Nacional de Chile',
  '2010-01-01',
  '{"frequency": "única", "owner": "Biblioteca Nacional de Chile", "year": "2010 (edición)"}'::jsonb
);

-- 48. BCN Portal Ley Chile
INSERT INTO web_resources (
  url,
  title,
  description,
  content,
  category,
  source_type,
  country,
  tags,
  author,
  published_date,
  metadata
) VALUES (
  'https://www.bcn.cl/leychile',
  'BCN - Portal Ley Chile (Legislación Laboral)',
  'Portal de acceso a toda la legislación chilena incluyendo normativa laboral',
  'Ley Chile es el portal oficial de la Biblioteca del Congreso Nacional que proporciona acceso gratuito a toda la legislación vigente en Chile. Incluye: leyes, decretos, reglamentos, códigos, y normativas relacionadas con trabajo, empleo, seguridad social, y formación profesional. El portal permite: búsqueda por tema, navegación por código, acceso a historias de ley, y seguimiento de proyectos legislativos. Es fundamental para: cumplimiento normativo, asesoría legal, investigación jurídica, y comprensión del marco regulatorio del mercado laboral chileno.',
  'Normativa laboral',
  'government',
  'Chile',
  ARRAY['legislación', 'BCN', 'Ley Chile', 'normativa', 'códigos'],
  'BCN (Biblioteca del Congreso Nacional)',
  '2024-01-01',
  '{"frequency": "continuo", "owner": "BCN", "period": "vigente (actualización continua)"}'::jsonb
);

-- 49. SENCE Observatorios
INSERT INTO web_resources (
  url,
  title,
  description,
  content,
  category,
  source_type,
  country,
  tags,
  author,
  published_date,
  metadata
) VALUES (
  'https://sence.gob.cl/observatorios',
  'SENCE - Red de Observatorios Laborales',
  'Red de observatorios regionales sobre mercado laboral en Chile',
  'La Red de Observatorios Laborales de SENCE integra observatorios regionales que analizan mercados laborales locales. Cada observatorio proporciona: análisis de demanda laboral regional, identificación de brechas de competencias, estudios sectoriales, prospectiva laboral, y vinculación con actores locales (empresas, instituciones educativas, gobierno). Los observatorios producen reportes regulares y estudios ad-hoc sobre temas relevantes para cada región. Son fundamentales para: políticas de empleo territorial, programas de capacitación contextualizados, y comprensión de especificidades de mercados laborales regionales.',
  'Observatorios Laborales (SENCE)',
  'government',
  'Chile',
  ARRAY['observatorios', 'SENCE', 'regional', 'mercado laboral', 'territorios'],
  'Subrab/SENCE - OLN',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "Subrab/SENCE - OLN", "period": "2020-presente (mensual)"}'::jsonb
);

-- 50. Encuesta Bicentenario Series Históricas
INSERT INTO web_resources (
  url,
  title,
  description,
  content,
  category,
  source_type,
  country,
  tags,
  author,
  published_date,
  metadata
) VALUES (
  'https://encuestabicentenario.uc.cl/noticia',
  'UC - Encuesta Bicentenario - Series Históricas',
  'Series históricas de la Encuesta Bicentenario con tendencias temporales',
  'Las series históricas de la Encuesta Bicentenario (2006-2024) permiten análisis longitudinal de cambios en valores, actitudes y opiniones en Chile. Los datos históricos revelan: evolución de confianza institucional, cambios en aspiraciones económicas, transformaciones en valores laborales, y tendencias en percepción de equidad. El análisis temporal es crucial para: identificar cambios generacionales, evaluar impacto de eventos críticos (estallido social, pandemia), comprender contextos culturales del trabajo, y anticipar cambios en expectativas laborales. Los datos están disponibles para análisis secundario.',
  'Opinión Pública',
  'academic',
  'Chile',
  ARRAY['series históricas', 'tendencias', 'UC', 'Bicentenario', 'longitudinal'],
  'I-CPUC',
  '2024-01-01',
  '{"frequency": "anual", "owner": "I-CPUC", "period": "anual"}'::jsonb
);

-- Verificar que se completaron los 50 recursos
SELECT 
  'Total de recursos chilenos: ' || COUNT(*) as resumen,
  'Categorías únicas: ' || COUNT(DISTINCT category) as categorias
FROM web_resources 
WHERE country = 'Chile';

-- Mostrar resumen por categoría
SELECT 
  category,
  COUNT(*) as cantidad,
  STRING_AGG(DISTINCT source_type, ', ') as tipos_fuente
FROM web_resources 
WHERE country = 'Chile'
GROUP BY category
ORDER BY cantidad DESC;
