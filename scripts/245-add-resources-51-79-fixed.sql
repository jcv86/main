-- Agregar recursos web 51-79 del mercado chileno (CORREGIDO - sin duplicados)
-- Continuación de los primeros 50 recursos
-- Usa INSERT ... ON CONFLICT DO NOTHING para evitar errores por duplicados

-- 51. CADEM - Plaza Pública
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
  'https://cadem.cl/plaza-publica/',
  'CADEM - Plaza Pública',
  'Encuesta semanal de opinión pública sobre temas políticos y sociales',
  'Plaza Pública es la principal encuesta semanal de opinión pública en Chile, realizada por CADEM. Mide aprobación presidencial, evaluación de gobierno, intención de voto, y percepción sobre temas de actualidad nacional. Los datos se publican semanalmente y permiten seguir tendencias de opinión pública en tiempo casi real, siendo una herramienta fundamental para entender el clima político y social del país.',
  'Opinión Pública',
  'data',
  'Chile',
  ARRAY['CADEM', 'opinión pública', 'encuesta', 'semanal', 'política', 'aprobación'],
  'CADEM',
  '2024-01-01',
  '{"frequency": "semanal", "owner": "CADEM", "period": "2013-presente"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 52. CEP - Encuesta Nacional
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
  'https://www.cepchile.cl/cep/encuestas-cep/encuestas-2010-2021',
  'CEP - Encuesta Nacional de Opinión Pública',
  'Encuesta histórica sobre opinión pública y valores en Chile desde 1987',
  'La Encuesta Nacional de Opinión Pública del Centro de Estudios Públicos (CEP) es una de las encuestas más antiguas y respetadas de Chile, con datos desde 1987. Analiza actitudes políticas, valores sociales, confianza institucional, evaluación económica, y temas de contingencia. Su extensa serie histórica permite análisis longitudinales de cambios culturales y políticos en la sociedad chilena.',
  'Opinión Pública',
  'academic',
  'Chile',
  ARRAY['CEP', 'opinión pública', 'histórica', 'valores', 'encuesta nacional'],
  'Centro de Estudios Públicos',
  '2024-01-01',
  '{"frequency": "semestral", "owner": "CEP", "period": "1987-presente"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 53. CEP - Serie Histórica
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
  'https://www.cepchile.cl/cep/site/docs/20160303/20160303183411/encuestascep_1987_2015.pdf',
  'CEP - Serie Histórica de Encuestas 1987-2015',
  'Base de datos completa de encuestas CEP desde 1987',
  'La serie histórica de encuestas del CEP proporciona acceso a todas las olas desde 1987 hasta el presente. Incluye datos sobre evolución de actitudes políticas durante la transición democrática, cambios en valores sociales, percepción de instituciones, y opinión sobre reformas. Es un recurso invaluable para investigadores y analistas que estudian la evolución de la opinión pública chilena.',
  'Opinión/Actitudes',
  'academic',
  'Chile',
  ARRAY['CEP', 'serie histórica', 'opinión pública', 'datos longitudinales', '1987-presente'],
  'Centro de Estudios Públicos',
  '2024-01-01',
  '{"frequency": "semestral", "owner": "CEP", "period": "1987-presente", "waves": "70+"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 54. Centro de Políticas Públicas UC
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
  'https://encuestabicentenario.uc.cl/bases-de-datos/',
  'Centro de Políticas Públicas UC - Bases de Datos',
  'Bases de datos de encuestas y estudios sobre políticas públicas',
  'El Centro de Políticas Públicas de la UC mantiene bases de datos de múltiples encuestas, incluyendo la Encuesta Bicentenario. Proporciona datos sobre actitudes hacia instituciones, evaluación de políticas públicas, valores ciudadanos, y percepción de problemas nacionales. Las bases están disponibles para investigadores y permiten análisis secundarios.',
  'Opinión/Actitudes',
  'academic',
  'Chile',
  ARRAY['UC', 'políticas públicas', 'bases de datos', 'investigación', 'Bicentenario'],
  'Centro de Políticas Públicas UC',
  '2024-01-01',
  '{"frequency": "anual", "owner": "UC", "period": "2006-2024"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 55. World Values Survey - Chile
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
  'https://www.worldvaluessurvey.org/WVSDocumentationWV7.jsp',
  'World Values Survey - Chile (Wave 7)',
  'Encuesta internacional sobre valores aplicada en Chile múltiples veces',
  'La World Values Survey (WVS) es una encuesta internacional que mide valores, creencias y motivaciones de personas en más de 100 países. Chile ha participado en múltiples olas (1990, 1996, 2000, 2006, 2012, 2018). Permite comparaciones internacionales de valores relacionados con trabajo, familia, religión, política, y confianza social. Es fundamental para entender valores laborales y culturales en contexto comparativo.',
  'Opinión/Actitudes',
  'academic',
  'Chile',
  ARRAY['World Values Survey', 'WVS', 'valores', 'internacional', 'comparativo'],
  'WVS Association',
  '2018-01-01',
  '{"frequency": "multianual", "owner": "WVS Association", "waves": "V2/1990, V3/1996, V4/2001, V5/2006, V6/2012, V7/2018"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 56. INE - IPC
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
  'https://www.ine.gob.cl/estadisticas/economia/indices-de-precio-e-inflacion/indice-de-precios-al-consumidor',
  'INE - Índice de Precios al Consumidor',
  'Serie histórica completa del IPC desde 1930',
  'El Índice de Precios al Consumidor (IPC) del INE es el indicador oficial de inflación en Chile. Mide la variación de precios de una canasta representativa de bienes y servicios consumidos por hogares. La serie histórica desde 1930 permite análisis de largo plazo sobre costo de vida, poder adquisitivo, y ajustes salariales. Incluye desagregaciones por categoría de gasto y región.',
  'Precios/Inflación',
  'government',
  'Chile',
  ARRAY['IPC', 'inflación', 'precios', 'INE', 'serie histórica', '1930-presente'],
  'INE',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "INE", "period": "1930-presente"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 57. RSH - Registro Social de Hogares
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
  'https://www.registrosocial.gob.cl/',
  'RSH - Registro Social de Hogares',
  'Sistema de información socioeconómica de hogares para focalización de beneficios',
  'El Registro Social de Hogares (RSH) es el instrumento de caracterización socioeconómica que reemplazó a la Ficha de Protección Social. Recopila información sobre ingresos, composición familiar, vivienda, salud, educación, y situación laboral de los hogares. Es usado para focalizar programas sociales, subsidios, y beneficios estatales. Proporciona un retrato detallado de condiciones socioeconómicas a nivel de hogares.',
  'Programas/Beneficios',
  'government',
  'Chile',
  ARRAY['RSH', 'Registro Social', 'focalización', 'beneficios', 'hogares', 'MDSF'],
  'Ministerio de Desarrollo Social y Familia',
  '2024-01-01',
  '{"frequency": "continuo", "owner": "MDSF", "period": "vigente"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 58. SENCE - Subsidio al Empleo Joven
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
  'https://www.sence.cl/portal/Programa-de-empleo/Subsidio-al-Empleo-Joven/',
  'SENCE - Subsidio al Empleo Joven',
  'Programa de subsidio para incentivar contratación de jóvenes',
  'El Subsidio al Empleo Joven es un beneficio estatal que incentiva la contratación formal de jóvenes entre 18 y 24 años. Proporciona un aporte monetario mensual tanto al trabajador como al empleador durante los primeros dos años de contrato. Es una herramienta de política activa de empleo para reducir desempleo juvenil y facilitar inserción laboral formal de jóvenes.',
  'Programas/Beneficios',
  'government',
  'Chile',
  ARRAY['subsidio empleo', 'jóvenes', 'SENCE', 'ChileAtiende', 'inserción laboral'],
  'SENCE/ChileAtiende',
  '2024-01-01',
  '{"frequency": "continuo", "owner": "SENCE", "period": "vigente"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 59. RSH - Portal (diferente de #57)
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
  'https://www.registrosocial.gob.cl/consulta-tu-rsh',
  'RSH - Portal de Consulta y Elegibilidad',
  'Portal oficial para consultar y actualizar información del Registro Social',
  'El portal del RSH permite a las personas consultar su calificación socioeconómica, actualizar información familiar, y verificar elegibilidad para beneficios sociales. Proporciona acceso a prestaciones como: subsidios habitacionales, becas estudiantiles, pensiones solidarias, subsidios de salud, y programas de apoyo social. Es el punto de acceso principal al sistema de protección social chileno.',
  'Programas/Elegibilidad',
  'government',
  'Chile',
  ARRAY['RSH', 'elegibilidad', 'beneficios', 'protección social', 'MDSF'],
  'Ministerio de Desarrollo Social y Familia',
  '2024-01-01',
  '{"frequency": "continuo", "owner": "MDSF", "period": "vigente"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 60. ELCS - Longitudinal Social Chile
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
  'https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN.DI4EHD',
  'ELCS - Encuesta Longitudinal Social de Chile',
  'Estudio longitudinal que sigue a los mismos individuos a lo largo del tiempo',
  'La Encuesta Longitudinal Social de Chile (ELCS) es un estudio del Centro de Estudios de Conflicto y Cohesión Social (COES) que sigue a las mismas personas en múltiples olas (2016-2023). Analiza trayectorias educativas, laborales, familiares, y de salud. Permite entender movilidad social, desigualdad, y cambios en condiciones de vida a nivel individual. Los datos están disponibles en Harvard Dataverse.',
  'Psico-social',
  'academic',
  'Chile',
  ARRAY['longitudinal', 'ELCS', 'COES', 'trayectorias', 'Harvard Dataverse'],
  'COES/Harvard Dataverse',
  '2023-01-01',
  '{"frequency": "anual", "owner": "COES", "period": "7 olas", "waves": "2016-2023"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 61. PNUD - Informes de Desarrollo Humano
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
  'https://www.undp.org/es/chile/informes-desarrollo-humano',
  'PNUD Chile - Informes de Desarrollo Humano',
  'Serie de informes sobre desarrollo humano, desigualdad y bienestar',
  'Los Informes de Desarrollo Humano del PNUD Chile analizan dimensiones clave del bienestar: desigualdad, cohesión social, seguridad humana, trabajo, y calidad de vida. Incluyen análisis cualitativo y cuantitativo sobre percepciones sociales, aspiraciones, miedos, y desafíos de desarrollo. Son referencia fundamental para políticas públicas y análisis social.',
  'Psico-social/Chile (informes)',
  'academic',
  'Chile',
  ARRAY['PNUD', 'desarrollo humano', 'informes', 'desigualdad', 'bienestar'],
  'PNUD Chile',
  '2024-01-01',
  '{"frequency": "multianual", "owner": "PNUD Chile", "period": "1996-2024"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 62. COES - Harvard Dataverse Principal
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
  'https://dataverse.harvard.edu/dataverse/coes',
  'COES - Dataverse de Harvard',
  'Repositorio de datos del Centro de Estudios de Conflicto y Cohesión Social',
  'El dataverse de COES en Harvard contiene múltiples bases de datos de estudios longitudinales y transversales sobre desigualdad, conflicto, cohesión social, y percepciones de justicia en Chile. Incluye la ELCS (2016-2023), encuestas territoriales, y estudios cualitativos. Los datos están disponibles gratuitamente para investigadores con documentación completa.',
  'Psico-social/Chile (series)',
  'academic',
  'Chile',
  ARRAY['COES', 'Harvard Dataverse', 'bases de datos', 'longitudinal', 'desigualdad'],
  'COES/Harvard Dataverse',
  '2023-01-01',
  '{"frequency": "multianual", "owner": "COES", "period": "2016-2023", "waves": "7 olas"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 63. INE - Remuneraciones y Costos Laborales
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
  'https://www.ine.gob.cl/estadisticas/sociales/mercado-laboral/remuneraciones-y-costo-mano-de-obra',
  'INE - Índice de Remuneraciones y Costo de la Mano de Obra',
  'Series estadísticas sobre evolución de remuneraciones y costos laborales',
  'El INE publica series mensuales sobre remuneraciones e índices de costo de mano de obra. Incluye: índice de remuneraciones por sector, índice de costo de mano de obra (ICMO), evolución de remuneraciones reales y nominales, y desagregaciones por actividad económica. Permite analizar tendencias salariales, ajustes por inflación, y costos laborales para empleadores.',
  'Remuneraciones',
  'government',
  'Chile',
  ARRAY['remuneraciones', 'INE', 'salarios', 'ICMO', 'costo laboral', 'series'],
  'INE',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "INE", "period": "2003-presente"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 64. PNUD - Informe Remuneraciones
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
  'https://www.undp.org/es/chile/publicaciones/desigualdad-regional-en-chile',
  'PNUD - Informe sobre Remuneraciones y Desigualdad',
  'Análisis sobre estructura salarial y brechas de remuneración en Chile',
  'Este informe del PNUD analiza la estructura de remuneraciones en Chile, identificando brechas por género, edad, nivel educativo, sector, y región. Examina factores que explican desigualdad salarial como segregación ocupacional, discriminación, y acceso a empleos de calidad. Proporciona recomendaciones de política para reducir inequidades salariales.',
  'Remuneraciones (INE)',
  'academic',
  'Chile',
  ARRAY['remuneraciones', 'PNUD', 'desigualdad salarial', 'brechas', 'análisis'],
  'PNUD',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "PNUD", "type": "informe temático"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 65. SUSESO - Estadísticas
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
  'https://www.suseso.cl/605/w3-propertyvalue-118471.html',
  'SUSESO - Estadísticas de Seguridad y Salud en el Trabajo',
  'Datos sobre accidentes laborales, enfermedades profesionales y seguridad ocupacional',
  'La Superintendencia de Seguridad Social (SUSESO) publica estadísticas sobre: accidentes del trabajo, enfermedades profesionales, licencias médicas, pensiones de invalidez, y tasas de siniestralidad por sector. Incluye análisis de riesgos ocupacionales, costos de accidentes, y efectividad de medidas preventivas. Es fundamental para gestión de seguridad y salud ocupacional.',
  'Salud laboral',
  'government',
  'Chile',
  ARRAY['SUSESO', 'seguridad laboral', 'accidentes', 'salud ocupacional', 'riesgos'],
  'SUSESO',
  '2024-01-01',
  '{"frequency": "anual", "owner": "SUSESO", "period": "2006-presente"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 66. INE - Seguridad Ciudadana
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
  'https://www.ine.gob.cl/estadisticas/sociales/seguridad-ciudadana-y-justicia',
  'INE - Estadísticas de Seguridad Pública y Justicia',
  'Datos sobre delincuencia, victimización y percepción de seguridad',
  'El INE recopila estadísticas sobre seguridad ciudadana, victimización, y percepción de inseguridad. Incluye: tasas de denuncias, tipos de delitos, victimización por hogar, percepción de seguridad en barrios, y confianza en instituciones de seguridad. Permite analizar impacto de inseguridad en calidad de vida y comportamiento social.',
  'Seguridad',
  'government',
  'Chile',
  ARRAY['seguridad', 'INE', 'delincuencia', 'victimización', 'percepción'],
  'INE',
  '2024-01-01',
  '{"frequency": "anual", "owner": "INE", "period": "2003-presente"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 67. ENUSC - Encuesta Nacional Urbana de Seguridad Ciudadana
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
  'https://www.ine.gob.cl/enusc',
  'Subsecretaría de Prevención del Delito + INE - ENUSC',
  'Encuesta sobre victimización y percepción de seguridad en zonas urbanas',
  'La Encuesta Nacional Urbana de Seguridad Ciudadana (ENUSC) es realizada anualmente por el INE y la Subsecretaría de Prevención del Delito. Mide victimización delictual, percepción de inseguridad, evaluación de instituciones de seguridad, y medidas de autoprotección. Proporciona datos desagregados por región, comuna, y características socioeconómicas, permitiendo focalizar políticas de prevención.',
  'Seguridad/Contexto',
  'government',
  'Chile',
  ARRAY['ENUSC', 'seguridad ciudadana', 'prevención', 'victimización', 'urbano'],
  'Subsecretaría de Prevención del Delito + INE',
  '2024-01-01',
  '{"frequency": "anual", "owner": "SPD + INE", "period": "2003-presente", "waves": "anual 1982, 1994, 1996, 1998, 2000, 2003, 2006, 2009, 2011, 2013, 2015, 2017, 2022"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 68. MDSF - Observatorio Social
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
  'https://observatorio.ministeriodesarrollosocial.gob.cl/',
  'MDSF - Observatorio Social',
  'Portal de encuestas sociales del Ministerio de Desarrollo Social',
  'El Observatorio Social del MDSF centraliza múltiples encuestas sobre condiciones de vida, bienestar, y percepción de políticas sociales. Incluye CASEN, encuestas de caracterización, estudios sobre pobreza multidimensional, y evaluaciones de programas sociales. Proporciona acceso a microdatos, informes, y visualizaciones interactivas.',
  'Socioeconómicas (histórico+hogares)',
  'government',
  'Chile',
  ARRAY['MDSF', 'observatorio social', 'encuestas', 'bienestar', 'políticas sociales'],
  'Ministerio de Desarrollo Social y Familia',
  '2024-01-01',
  '{"frequency": "continuo", "owner": "MDSF", "period": "1990, 1992, 1994, 1996, 1998, 2000, 2003, 2006, 2009, 2011, 2013, 2015, 2017, 2022"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 69. EPS - Encuesta de Protección Social
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
  'https://www.previsionsocial.gob.cl/sps/biblioteca/encuesta-de-proteccion-social/',
  'EPS - Encuesta de Protección Social',
  'Encuesta longitudinal sobre trayectorias laborales, previsionales y de salud',
  'La Encuesta de Protección Social (EPS) es un estudio longitudinal que sigue a los mismos individuos desde 2002. Analiza: historias laborales completas, cotizaciones previsionales, cobertura de salud, ahorro e inversión, y transiciones entre empleo formal e informal. Es fundamental para estudios de pensiones, protección social, y mercado laboral de largo plazo.',
  'Socioeconómicas (protección social)',
  'government',
  'Chile',
  ARRAY['EPS', 'protección social', 'longitudinal', 'pensiones', 'trayectorias'],
  'Subsecretaría de Previsión Social',
  '2020-01-01',
  '{"frequency": "multianual", "owner": "SPS", "period": "2002, 2004, 2006, 2009, 2012, 2015, 2017, 2020, 2023-24 (VIII)"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 70. ENUT - Encuesta Nacional sobre Uso del Tiempo
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
  'https://www.ine.gob.cl/enut',
  'INE/MINSAL/MDSP - Encuesta sobre Uso del Tiempo',
  'Encuesta sobre distribución del tiempo en actividades productivas, domésticas y de cuidado',
  'La Encuesta sobre Uso del Tiempo analiza cómo las personas distribuyen su tiempo entre trabajo remunerado, trabajo doméstico no remunerado, cuidado de personas, educación, y tiempo libre. Permite visibilizar desigualdades de género en trabajo no remunerado, doble jornada laboral femenina, y carga de cuidados. Es fundamental para políticas de conciliación trabajo-familia.',
  'Tiempo de uso',
  'government',
  'Chile',
  ARRAY['uso del tiempo', 'trabajo no remunerado', 'cuidados', 'género', 'conciliación'],
  'INE/MINSAL/MDSP',
  '2023-01-01',
  '{"frequency": "multianual", "owner": "INE/MINSAL/MDSP", "period": "2008, 2015, 2023 regiones 2024"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 71. ENUT Regional
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
  'https://www.ine.gob.cl/enut-regional',
  'INE/MINSAL/MDSP - ENUT Completa',
  'Encuesta Nacional de Uso del Tiempo con cobertura nacional',
  'La Encuesta Nacional de Uso del Tiempo (ENUT) es el estudio más completo sobre distribución del tiempo en Chile. Mide tiempo dedicado a: trabajo remunerado, trabajo doméstico, cuidado de niños y adultos mayores, estudio, tiempo libre, y sueño. Desagrega por género, edad, nivel socioeconómico, y región. Permite calcular el valor económico del trabajo no remunerado.',
  'Uso del tiempo',
  'government',
  'Chile',
  ARRAY['ENUT', 'uso del tiempo', 'trabajo no remunerado', 'INE', 'MINSAL', 'cuidados'],
  'INE / MINSAL / MDSP',
  '2024-01-01',
  '{"frequency": "multianual", "owner": "INE/MINSAL/MDSP", "period": "2015-2022"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 72. Latinobarómetro
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
  'https://www.latinobarometro.org/lat.jsp',
  'Latinobarómetro',
  'Encuesta de opinión pública regional con datos de Chile desde 1995',
  'Latinobarómetro es una encuesta regional que mide actitudes, valores y opiniones en 18 países de América Latina. Los datos de Chile desde 1995 permiten análisis comparativos sobre democracia, instituciones, economía, y valores sociales. Es fundamental para entender posición de Chile en contexto regional y evolución de actitudes políticas y sociales.',
  'Valores',
  'academic',
  'Chile',
  ARRAY['Latinobarómetro', 'regional', 'comparativo', 'democracia', 'valores'],
  'Corporación Latinobarómetro',
  '2020-01-01',
  '{"frequency": "anual", "owner": "Corporación Latinobarómetro", "period": "anual hasta 2020"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 73. World Values Survey - Chile (diferente URL que #55)
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
  'https://www.worldvaluessurvey.org/WVSContents.jsp?CMSID=Findings',
  'World Values Survey - Chile Series Completa',
  'Encuesta internacional de valores aplicada en Chile en múltiples olas',
  'La World Values Survey mide valores fundamentales y creencias de personas en más de 100 países. Chile participó en 1990, 1996, 2001, 2006, 2012, y 2018. Analiza valores relacionados con trabajo, familia, religión, política, confianza, y tolerancia. Permite comparaciones internacionales y análisis de cambio cultural de largo plazo.',
  'Valores',
  'academic',
  'Chile',
  ARRAY['World Values', 'internacional', 'comparativo', 'valores', 'cultura'],
  'WVS Association',
  '2018-01-01',
  '{"frequency": "multianual", "owner": "WVS", "period": "1990, 1996, 2001, 2006, 2012, 2018"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 74. Red Vista - CASEN Territorial
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
  'https://red.gob.cl/vista/',
  'Ministerio de Desarrollo Social (MDSF) - CASEN Territorial',
  'Datos de CASEN con desagregación territorial y visualización interactiva',
  'El portal Vista del MDSF proporciona acceso a datos de CASEN con desagregación territorial hasta nivel comunal. Incluye visualizaciones interactivas sobre pobreza, ingresos, empleo, educación, salud, y vivienda por comuna. Permite comparaciones territoriales y análisis de brechas regionales en condiciones socioeconómicas.',
  'Territorio/Clima',
  'government',
  'Chile',
  ARRAY['CASEN', 'territorial', 'comunal', 'visualización', 'MDSF'],
  'Ministerio de Desarrollo Social (MDSF)',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "MDSF", "period": "2024"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 75. SUBDERE - Mapas
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
  'https://datos.subdere.gov.cl/datasets',
  'SUBDERE - Mapas de Brechas Territoriales',
  'Sistema de información territorial sobre infraestructura y servicios',
  'El sistema de información de SUBDERE mapea brechas territoriales en infraestructura, servicios básicos, conectividad, y equipamiento comunitario. Incluye datos sobre disponibilidad de agua potable, alcantarillado, electricidad, internet, salud, educación, y transporte por comuna. Permite identificar territorios rezagados y priorizar inversión pública.',
  'Territorio/Clima',
  'government',
  'Chile',
  ARRAY['SUBDERE', 'brechas', 'territorial', 'infraestructura', 'servicios'],
  'SUBDERE',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "SUBDERE", "period": "última edición 2024"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 76. MDSF - Migración
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
  'https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen-inmigrantes-2022',
  'MDSF - Observatorio Social (Migración)',
  'Portal de datos sobre migración y población extranjera en Chile',
  'El Observatorio Social del MDSF incluye sección dedicada a migración con datos sobre: población extranjera por nacionalidad y región, inserción laboral de migrantes, acceso a servicios sociales, regularización migratoria, y caracterización socioeconómica. Integra datos de múltiples fuentes: INE, PDI, Servicio de Migraciones, y encuestas CASEN.',
  'Migración',
  'government',
  'Chile',
  ARRAY['migración', 'extranjeros', 'MDSF', 'observatorio', 'integración'],
  'MDSF - Observatorio Social',
  '2022-01-01',
  '{"frequency": "bienal", "owner": "MDSF", "period": "2022"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 77. INE - Pueblos Indígenas
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
  'https://www.ine.gob.cl/estadisticas/sociales/pueblos-indigenas',
  'INE - Encuesta de Caracterización Socioeconómica de Pueblos Indígenas',
  'Primera encuesta específica sobre pueblos indígenas en Chile',
  'Esta encuesta del INE caracteriza condiciones socioeconómicas de pueblos indígenas en Chile. Incluye datos sobre: autoidentificación indígena, lengua y cultura, educación, empleo, ingresos, vivienda, salud, y discriminación. Permite visibilizar brechas entre población indígena y no indígena, y diseñar políticas de inclusión específicas.',
  'Pueblos Originarios',
  'government',
  'Chile',
  ARRAY['pueblos indígenas', 'INE', 'caracterización', 'brechas', 'inclusión'],
  'INE',
  '2017-01-01',
  '{"frequency": "adhoc", "owner": "INE", "period": "2017 (última versión)"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 78. DT - Género y Trabajo
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
  'https://www.dt.gob.cl/portal/1626/w3-propertyvalue-22777.html',
  'Dirección del Trabajo - Encuesta Género, Trabajo y Tiempo',
  'Encuesta sobre desigualdades de género en el mercado laboral',
  'La Encuesta de Género, Trabajo y Tiempo (EGT) analiza brechas de género en: participación laboral, segregación ocupacional, brecha salarial, trabajo no remunerado, cuidados, y conciliación trabajo-familia. Incluye módulos sobre acoso laboral, discriminación, y percepción de igualdad de oportunidades. Es fundamental para políticas de equidad de género.',
  'Desigualdad/Brechas',
  'government',
  'Chile',
  ARRAY['género', 'brechas', 'trabajo', 'discriminación', 'DT'],
  'Dirección del Trabajo + Gobierno de Chile',
  '2022-01-01',
  '{"frequency": "adhoc", "owner": "DT + GobCL", "period": "2016-2022"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- 79. COES - Panel LOES
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
  'https://coes.cl/encuesta-panel/',
  'COES Chile + UC/Chile - Panel LOES (Desigualdad y Cohesión Social)',
  'Panel longitudinal sobre desigualdad, cohesión social y conflicto',
  'El Panel Longitudinal de Estudios Sociales (LOES) del COES estudia desigualdad, cohesión social, conflicto, y percepción de justicia. Sigue a los mismos individuos desde 2016, analizando: percepción de desigualdad, apoyo a redistribución, confianza interpersonal e institucional, participación política, y legitimidad del sistema económico. Datos disponibles en Harvard Dataverse.',
  'Desigualdad/Brechas',
  'academic',
  'Chile',
  ARRAY['COES', 'desigualdad', 'cohesión', 'panel', 'longitudinal'],
  'COES Chile + UC/Chile',
  '2023-01-01',
  '{"frequency": "anual", "owner": "COES", "period": "2016-2023"}'::jsonb
)
ON CONFLICT (url) DO NOTHING;

-- Verificar inserción
SELECT 
  'Total recursos insertados en esta ejecución: ' || COUNT(*) as mensaje
FROM web_resources 
WHERE country = 'Chile'
AND created_at > NOW() - INTERVAL '1 minute';

-- Mostrar resumen por categoría de nuevos recursos
SELECT 
  category,
  COUNT(*) as cantidad,
  source_type
FROM web_resources 
WHERE country = 'Chile'
AND created_at > NOW() - INTERVAL '1 minute'
GROUP BY category, source_type
ORDER BY cantidad DESC;

-- Verificar total general
SELECT 
  'Total recursos Chile en base de datos: ' || COUNT(*) as mensaje_total
FROM web_resources 
WHERE country = 'Chile';
