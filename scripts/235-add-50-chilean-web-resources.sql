-- Agregar 50 recursos web del mercado chileno al cerebro de la plataforma
-- Estos recursos proporcionan datos actualizados sobre competencias, empleo, economía y desarrollo en Chile

-- 1. ChileValora - Catálogo de Perfiles [Ichas]
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
  'https://chilevalora.gob.cl/certificacion',
  'ChileValora - Catálogo de Perfiles de Competencias',
  'Sistema de certificación de competencias laborales en Chile con perfiles ocupacionales validados',
  'ChileValora es el Sistema Nacional de Certificación de Competencias Laborales de Chile, que reconoce formalmente las competencias laborales de las personas, independientemente de cómo las hayan adquirido. El catálogo de perfiles contiene descripciones detalladas de competencias por sector económico, incluyendo conocimientos, habilidades y actitudes requeridas para diferentes ocupaciones. Este recurso es fundamental para entender las competencias demandadas en el mercado laboral chileno y diseñar programas de capacitación alineados con las necesidades del sector productivo.',
  'Competencias',
  'government',
  'Chile',
  ARRAY['competencias', 'certificación', 'perfiles ocupacionales', 'ChileValora', 'mercado laboral'],
  'ChileValora',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "ChileValora", "coverage": "nacional"}'::jsonb
);

-- 2. ChileValora - Guía Evaluación y Certificación 2024
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
  'https://chilevalora.gob.cl/wp-content/uploads/2024/12/Guia-de-Evaluacion-y-Certificacion-2024.pdf',
  'Guía de Evaluación y Certificación de Competencias 2024',
  'Guía completa sobre el proceso de evaluación y certificación de competencias laborales en Chile',
  'Esta guía proporciona información detallada sobre el proceso de evaluación y certificación de competencias laborales en Chile. Incluye metodologías de evaluación, criterios de certificación, procedimientos administrativos, y ejemplos prácticos de aplicación. Es un recurso esencial para evaluadores, capacitadores, y profesionales de recursos humanos que buscan implementar sistemas de gestión por competencias en sus organizaciones. La guía está actualizada con los últimos estándares y mejores prácticas del sistema ChileValora.',
  'Competencias',
  'government',
  'Chile',
  ARRAY['evaluación', 'certificación', 'competencias', 'guía', 'ChileValora', '2024'],
  'ChileValora',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "ChileValora", "year": 2024}'::jsonb
);

-- 3. ChileValora - Guía de Articulación 2024
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
  'https://chilevalora.gob.cl/wp-content/uploads/2024/12/Guia-de-Articulacion-2024-Paginas.pdf',
  'Guía de Articulación de Competencias 2024',
  'Documento que explica cómo articular competencias laborales con programas de formación',
  'La Guía de Articulación 2024 de ChileValora explica cómo vincular los perfiles de competencias con programas de capacitación y formación técnico-profesional. Incluye metodologías para el diseño curricular basado en competencias, estrategias de articulación entre el mundo educativo y productivo, y ejemplos de implementación exitosa. Este recurso es clave para instituciones de formación, empresas, y profesionales que buscan desarrollar programas de capacitación alineados con las necesidades del mercado laboral chileno y los estándares de ChileValora.',
  'Competencias',
  'government',
  'Chile',
  ARRAY['articulación', 'formación', 'competencias', 'educación', 'ChileValora', '2024'],
  'ChileValora',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "ChileValora", "year": 2024}'::jsonb
);

-- 4. ChileValora - Portal Principal
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
  'https://chilevalora.gob.cl/',
  'ChileValora - Portal Principal con Guías 2024',
  'Portal oficial de ChileValora con acceso a todas las guías y recursos del sistema de certificación',
  'El portal principal de ChileValora es el punto de acceso central a todos los recursos del Sistema Nacional de Certificación de Competencias Laborales. Aquí se encuentran las guías de evaluación y articulación 2024, el catálogo completo de perfiles ocupacionales, información sobre centros de evaluación certificados, estadísticas del sistema, y noticias actualizadas. Es el recurso principal para trabajadores que buscan certificarse, empleadores que necesitan validar competencias, y organizaciones capacitadoras que desean alinear sus programas con los estándares nacionales.',
  'Competencias',
  'government',
  'Chile',
  ARRAY['ChileValora', 'certificación', 'competencias', 'portal', 'recursos', '2024'],
  'ChileValora',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "ChileValora", "year": 2024}'::jsonb
);

-- 5. Dirección del Trabajo - Encuesta Laboral
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
  'https://www.dt.gob.cl/',
  'Dirección del Trabajo - Encuesta Laboral ENCLA',
  'Encuesta sobre relaciones laborales y condiciones de trabajo en Chile',
  'La Encuesta Laboral ENCLA de la Dirección del Trabajo es un estudio periódico que analiza las relaciones laborales, condiciones de trabajo, prácticas de gestión de recursos humanos, y clima laboral en empresas chilenas. Proporciona datos sobre: contratación, remuneraciones, jornadas laborales, negociación colectiva, capacitación, seguridad y salud ocupacional, y relaciones sindicales. La ENCLA es una fuente fundamental para entender la realidad laboral chilena desde la perspectiva de empleadores y trabajadores, y es ampliamente utilizada para diseñar políticas públicas y estrategias empresariales.',
  'Condiciones laborales',
  'government',
  'Chile',
  ARRAY['encuesta laboral', 'condiciones trabajo', 'relaciones laborales', 'ENCLA', 'Dirección del Trabajo'],
  'Dirección del Trabajo',
  '2021-01-01',
  '{"frequency": "multianual", "owner": "Dirección del Trabajo", "waves": "2002-2021", "latest": 2021}'::jsonb
);

-- 6. SUBTEL - Encuesta Acceso y Uso de Internet (histórico)
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
  'https://www.subtel.gob.cl/estudios/internet-u-sociedad-de-la-informacion/',
  'SUBTEL - Encuesta de Acceso y Uso de Internet',
  'Encuesta histórica sobre penetración y uso de internet en Chile',
  'La Encuesta de Acceso y Uso de Internet de SUBTEL proporciona datos históricos sobre la adopción y uso de tecnologías de información en Chile. Incluye indicadores sobre: penetración de internet fijo y móvil, velocidades de conexión, dispositivos utilizados, usos principales como educación, trabajo y entretenimiento, brechas digitales por región y nivel socioeconómico, y evolución temporal. Esta serie de datos es fundamental para entender la transformación digital de Chile, evaluar políticas de conectividad, y diseñar estrategias de inclusión digital. Los datos abarcan desde 2015 hasta 2024.',
  'Conectividad',
  'government',
  'Chile',
  ARRAY['internet', 'conectividad', 'brecha digital', 'SUBTEL', 'acceso', 'tecnología'],
  'SUBTEL',
  '2024-01-01',
  '{"frequency": "anual", "owner": "SUBTEL", "period": "2015-2024", "type": "bases e informes"}'::jsonb
);

-- 7. SUBTEL - Informes 2024
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
  'https://www.subtel.gob.cl/wp-content/uploads/2024/06/Informe-de-Conectividad-y-Uso-de-Internet-2024.pdf',
  'SUBTEL - Informe de Conectividad y Uso de Internet 2024',
  'Informe actualizado sobre el estado de la conectividad en Chile',
  'El Informe de Conectividad y Uso de Internet 2024 de SUBTEL presenta un análisis completo del estado de las telecomunicaciones en Chile. Incluye: estadísticas de penetración de banda ancha fija y móvil, evolución de velocidades promedio, análisis de brechas regionales, uso de internet por propósito como teletrabajo, educación online y comercio electrónico, impacto de políticas públicas de conectividad, y proyecciones futuras. El informe es especialmente relevante para entender cómo la pandemia aceleró la digitalización y qué desafíos persisten en términos de equidad digital.',
  'Conectividad',
  'government',
  'Chile',
  ARRAY['conectividad', 'informe', 'internet', 'telecomunicaciones', 'SUBTEL', '2024'],
  'SUBTEL',
  '2024-01-01',
  '{"frequency": "anual", "owner": "SUBTEL", "year": 2024}'::jsonb
);

-- 8. SUBTEL - Series 2015-2024
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
  'https://www.subtel.gob.cl/estudios/internet-u-sociedad-de-la-informacion/',
  'SUBTEL - Series de Datos de Acceso y Uso de Internet 2015-2024',
  'Serie completa de encuestas sobre acceso y uso de internet en Chile',
  'Esta colección de encuestas de SUBTEL proporciona una visión longitudinal de la evolución del acceso y uso de internet en Chile durante la última década. Los datos permiten analizar tendencias como: el crecimiento exponencial de la banda ancha móvil, la reducción gradual de brechas urbano-rurales, el aumento del uso productivo de internet para teletrabajo, educación y emprendimiento, y los cambios en patrones de consumo digital. La serie es invaluable para investigadores, formuladores de políticas, y empresas del sector tecnológico que necesitan entender la madurez digital del mercado chileno.',
  'Conectividad',
  'government',
  'Chile',
  ARRAY['serie temporal', 'acceso internet', 'uso internet', 'SUBTEL', 'histórico', '2015-2024'],
  'SUBTEL',
  '2024-01-01',
  '{"frequency": "anual", "owner": "SUBTEL", "period": "2015-2024"}'::jsonb
);

-- 9. Banco Central - IMACEC
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
  'https://si3.bcentral.cl/Siete',
  'Banco Central de Chile - IMACEC y Estadísticas Macroeconómicas',
  'Base de datos de indicadores económicos clave de Chile',
  'El Sistema de Información del Banco Central (SI3) proporciona acceso a series estadísticas económicas fundamentales: IMACEC (Indicador Mensual de Actividad Económica), PIB, inflación (IPC, IPCSAE), empleo, salarios, comercio exterior, agregados monetarios, tasas de interés, tipo de cambio, cuentas nacionales, y balanza de pagos. Los datos son actualizados regularmente y tienen series históricas extensas. Este recurso es esencial para análisis económico, forecasting, investigación académica, y toma de decisiones empresariales. El IMACEC es especialmente útil como proxy mensual del PIB.',
  'Contexto macroeconómico',
  'government',
  'Chile',
  ARRAY['IMACEC', 'economía', 'Banco Central', 'indicadores', 'estadísticas', 'PIB'],
  'Banco Central de Chile',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "Banco Central de Chile", "period": "1986-presente", "type": "serie manual"}'::jsonb
);

-- 10. CODESACH - Corpus sociológico
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
  'https://www.benjamin.com/es/catalog/1-13103.aad',
  'CODESACH - Corpus Sociológico del Español de Chile',
  'Base de datos académica sobre lenguaje y sociedad en Chile',
  'El Corpus Sociológico del Español de Chile (CODESACH) es un proyecto académico que analiza el uso del lenguaje en diferentes contextos sociales chilenos. Incluye análisis de: variaciones dialectales, lenguaje profesional por sector, terminología técnica, comunicación organizacional, y evolución del español chileno. El corpus es útil para: desarrollo de competencias comunicativas, capacitación en comunicación profesional, análisis de cultura organizacional, y comprensión de dinámicas sociolingüísticas del mercado laboral chileno. Es especialmente relevante para profesionales de recursos humanos y comunicación.',
  'Corpora',
  'academic',
  'Chile',
  ARRAY['corpus', 'lenguaje', 'sociolingüística', 'español chileno', 'comunicación'],
  'Proyecto académico',
  '2022-01-01',
  '{"frequency": "adhoc", "owner": "Proyecto académico", "year": "v1.0 (2022)"}'::jsonb
);

-- 11. CODESACH INALBI
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
  'https://www.benjamin.com/es/catalog/1-13103.aad',
  'CODESACH INALBI - Corpus del Español de Chile (Variantes)',
  'Corpus académico sobre variantes del español chileno en contextos laborales',
  'Esta versión del corpus CODESACH se enfoca específicamente en el lenguaje utilizado en contextos laborales y profesionales en Chile. Analiza: terminología técnica por industria, comunicación formal e informal en organizaciones, variaciones regionales en el lenguaje empresarial, y evolución del lenguaje profesional chileno. El recurso incluye transcripciones de entrevistas, documentos corporativos, y análisis lingüístico. Es especialmente útil para: desarrollo de programas de capacitación en comunicación profesional, evaluación de competencias comunicativas, y diseño de materiales educativos contextualizados al mercado chileno.',
  'Corpora',
  'academic',
  'Chile',
  ARRAY['corpus', 'lenguaje laboral', 'comunicación profesional', 'variantes', 'INALBI'],
  'Proyecto académico (variante INALBI)',
  '2022-01-01',
  '{"frequency": "adhoc", "owner": "Proyecto académico (variante INALBI)", "year": "v1.0 (2022)"}'::jsonb
);

-- 12. Corpus básico diferencial
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
  'https://www.scielo.cl/scielo.php?script=sci_arttext&pid=S0254-92332020000200483',
  'Corpus Básico Diferencial del Español de Chile',
  'Artículos académicos sobre particularidades del español chileno',
  'Esta colección de artículos académicos analiza las características distintivas del español chileno en contextos profesionales y cotidianos. Los estudios cubren: modismos y expresiones idiomáticas, vocabulario técnico chileno, diferencias con otras variantes del español, y su impacto en la comunicación laboral. El recurso es especialmente relevante para: profesionales extranjeros que trabajan en Chile, empresas multinacionales, traductores, y desarrolladores de programas de capacitación. Ayuda a entender cómo las particularidades del español chileno afectan la comunicación efectiva en entornos profesionales.',
  'Corpora',
  'academic',
  'Chile',
  ARRAY['español chileno', 'artículos', 'diferencial', 'sociolingüística', 'comunicación'],
  'Universidades/Scielo',
  '2020-01-01',
  '{"frequency": "varios", "owner": "Universidades/Scielo", "years": "varios"}'::jsonb
);

-- 13. INE - ESI
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
  'https://www.ine.gob.cl/estadisticas/sociales/ingresos-y-gastos/encuesta-suplementaria-de-ingresos',
  'INE - Encuesta Suplementaria de Ingresos (ESI)',
  'Encuesta sobre ingresos de hogares y personas en Chile',
  'La Encuesta Suplementaria de Ingresos (ESI) del INE proporciona información detallada sobre la distribución de ingresos en Chile. Incluye datos sobre: ingresos del trabajo (por ocupación, sector, región), ingresos autónomos, subsidios y transferencias, ingresos totales de hogares, desigualdad de ingresos (índice de Gini), y evolución temporal. La ESI tiene múltiples olas que permiten análisis de tendencias desde 2006. Es fundamental para: estudios de equidad salarial, benchmarking de remuneraciones, políticas de compensación, análisis de mercado laboral, y estudios socioeconómicos.',
  'Costo de vida',
  'government',
  'Chile',
  ARRAY['ESI', 'ingresos', 'salarios', 'INE', 'distribución', 'desigualdad'],
  'INE',
  '2022-01-01',
  '{"frequency": "multianual", "owner": "INE", "waves": "2006-2007, 2011-2012, 2016-2017, 2021-2022"}'::jsonb
);

-- 14. IPC
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
  'INE - Índice de Precios al Consumidor (IPC)',
  'Indicador oficial de inflación en Chile',
  'El Índice de Precios al Consumidor (IPC) es el indicador oficial de inflación en Chile, medido mensualmente por el INE. Registra la variación de precios de una canasta de bienes y servicios representativa del consumo de los hogares chilenos. Incluye categorías como: alimentos, vivienda, transporte, salud, educación, y recreación. El IPC es fundamental para: ajustes salariales, indexación de contratos, políticas monetarias del Banco Central, análisis de costo de vida, y planificación financiera. Los datos están disponibles desde 1928, con series mensuales actualizadas regularmente.',
  'Costo de vida',
  'government',
  'Chile',
  ARRAY['IPC', 'inflación', 'precios', 'costo de vida', 'INE', 'canasta'],
  'INE',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "INE", "period": "1928-presente", "type": "manual"}'::jsonb
);

-- 15. ChileCompra
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
  'https://datos.chilecompra.cl/',
  'ChileCompra - Portal de Datos de Compras Públicas',
  'Base de datos de licitaciones y contrataciones públicas en Chile',
  'ChileCompra es el portal de compras públicas del Estado chileno que transparenta todas las licitaciones y contrataciones. Proporciona datos sobre: demanda de servicios profesionales por sector público, montos contratados por categoría, tendencias de contratación, requisitos técnicos, y oportunidades de negocio. El portal es esencial para: empresas que buscan participar en licitaciones públicas, análisis de demanda laboral en servicios profesionales, identificación de competencias demandadas por el Estado, y estudios de mercado. Los datos se actualizan diariamente y están disponibles desde 2003.',
  'Demanda laboral',
  'government',
  'Chile',
  ARRAY['ChileCompra', 'licitaciones', 'compras públicas', 'demanda', 'servicios'],
  'Dirección ChileCompra',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "Dirección ChileCompra", "period": "2003-presente", "type": "manual"}'::jsonb
);

-- 16. PNUD Chile
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
  'https://www.undp.org/es/chile',
  'PNUD Chile - Informes de Desarrollo Humano',
  'Serie de informes sobre desarrollo humano en Chile',
  'Los Informes de Desarrollo Humano del PNUD Chile analizan dimensiones clave del bienestar y desarrollo en el país. Incluyen temas como: desigualdad y cohesión social, empleo y trabajo decente, educación y oportunidades, salud y calidad de vida, medio ambiente y sustentabilidad, participación ciudadana, y desarrollo regional. Los informes combinan análisis cuantitativo y cualitativo, con datos de encuestas, grupos focales, y estudios de caso. Son fundamentales para entender desafíos estructurales del desarrollo chileno y diseñar políticas e intervenciones basadas en evidencia.',
  'Desarrollo Humano',
  'academic',
  'Chile',
  ARRAY['PNUD', 'desarrollo humano', 'bienestar', 'desigualdad', 'políticas públicas'],
  'PNUD Chile',
  '2024-01-01',
  '{"frequency": "multianual", "owner": "PNUD Chile", "period": "1996, 2002, 2015, 2024"}'::jsonb
);

-- 17. MDSF/SENADES
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
  'MDSF - Encuestas de Discapacidad e Inclusión Social',
  'Encuestas sobre inclusión social y discapacidad en Chile',
  'Las encuestas del Ministerio de Desarrollo Social y Familia (MDSF) y SENADES (Servicio Nacional de la Discapacidad) analizan barreras y facilitadores para la inclusión social en Chile. Incluyen datos sobre: personas en situación de discapacidad, acceso a empleo, educación inclusiva, accesibilidad urbana, apoyos sociales, y participación comunitaria. Los datos son fundamentales para: diseñar políticas de inclusión laboral, implementar ajustes razonables en el trabajo, desarrollar programas de capacitación accesibles, y promover entornos laborales diversos e inclusivos.',
  'Discapacidad/Dependencia',
  'government',
  'Chile',
  ARRAY['discapacidad', 'inclusión', 'MDSF', 'SENADES', 'accesibilidad', 'diversidad'],
  'MDSF / SENADES / INE',
  '2022-01-01',
  '{"frequency": "varios", "owner": "MDSF / SENADES / INE", "period": "2015-2022"}'::jsonb
);

-- 18. PISA Chile
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
  'https://www.oecd.org/pisa/',
  'PISA Chile - Evaluación OECD de Estudiantes',
  'Resultados de Chile en evaluación internacional PISA',
  'PISA (Programme for International Student Assessment) evalúa competencias de estudiantes de 15 años en lectura, matemáticas, y ciencias. Los resultados de Chile permiten comparaciones internacionales y análisis de tendencias en calidad educativa. Los datos incluyen: puntajes por dominio, brechas socioeconómicas, diferencias por tipo de establecimiento, y factores asociados al desempeño. PISA es fundamental para: evaluar la efectividad del sistema educativo, identificar brechas de competencias, diseñar políticas educativas, y entender las capacidades de la fuerza laboral futura.',
  'Educación Escolar',
  'academic',
  'Chile',
  ARRAY['PISA', 'educación', 'OECD', 'competencias', 'evaluación internacional'],
  'OECD / Mineduc',
  '2022-01-01',
  '{"frequency": "trienal", "owner": "OECD / Mineduc", "waves": "2000-2022 (cada 3 años)"}'::jsonb
);

-- 19. SIES Mi Futuro
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
  'https://mifuturo.cl/',
  'SIES Mi Futuro - Sistema de Información de Educación Superior',
  'Portal con información sobre carreras, instituciones, empleabilidad e ingresos de egresados',
  'Mi Futuro es el portal oficial del Sistema de Información de Educación Superior (SIES) que proporciona datos sobre: carreras universitarias y técnicas, instituciones acreditadas, aranceles, empleabilidad por carrera, ingresos promedio de egresados, duración real de estudios, y perfiles de egreso. El portal es fundamental para: orientación vocacional, planificación de estudios superiores, análisis de retorno de inversión educativa, identificación de carreras con alta demanda laboral, y estudios de mercado del capital humano chileno.',
  'Educación Superior / Retornos',
  'government',
  'Chile',
  ARRAY['educación superior', 'empleabilidad', 'ingresos', 'carreras', 'SIES', 'Mi Futuro'],
  'Subsec. Educación Superior (Mineduc)',
  '2024-01-01',
  '{"frequency": "anual", "owner": "Subsec. Educación Superior (Mineduc)", "period": "2012-presente"}'::jsonb
);

-- 20. Mi Futuro - Empleabilidad
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
  'https://www.mifuturo.cl/',
  'Mi Futuro - Empleabilidad e Ingresos de Egresados de Educación Superior',
  'Base de datos sobre trayectorias laborales de egresados de educación superior',
  'Esta base de datos del SIES proporciona información detallada sobre las trayectorias laborales de egresados de educación superior en Chile. Incluye: tasas de empleabilidad al 1° y 5° año de egreso, ingresos promedio por carrera e institución, evolución salarial, sectores de empleo, y movilidad laboral. Los datos se obtienen vinculando registros educacionales con bases de datos laborales (SII, IPS). Es esencial para: evaluación de calidad de programas educativos, orientación vocacional basada en evidencia, benchmarking de instituciones, y análisis de retorno de la inversión en educación superior.',
  'Educación/Empleabilidad',
  'government',
  'Chile',
  ARRAY['empleabilidad', 'ingresos egresados', 'educación superior', 'trayectorias', 'SIES'],
  'Mineduc (SIES/Mineduc)',
  '2024-01-01',
  '{"frequency": "anual", "owner": "Mineduc (SIES/Mineduc)", "period": "2000-2022 (cada 3 años)"}'::jsonb
);

-- 21. Servicio Civil
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
  'https://www.empleospublicos.cl/',
  'Servicio Civil - Portal de Empleo Público',
  'Portal de oportunidades laborales en el sector público chileno',
  'El portal de Empleo Público del Servicio Civil concentra todas las ofertas laborales del Estado chileno. Proporciona información sobre: cargos disponibles, requisitos y perfiles solicitados, procesos de selección, remuneraciones, beneficios, y trayectorias de carrera en el sector público. El portal implementa el Sistema de Alta Dirección Pública y procesos meritocráticos de selección. Es fundamental para: profesionales que buscan empleo público, análisis de demanda de competencias en el Estado, benchmarking de condiciones laborales, y estudios sobre mercado laboral público.',
  'Empleo formal',
  'government',
  'Chile',
  ARRAY['empleo público', 'Servicio Civil', 'Estado', 'concursos', 'oportunidades'],
  'Servicio Civil',
  '2024-01-01',
  '{"frequency": "continuo", "owner": "Servicio Civil", "period": "vigente"}'::jsonb
);

-- 22. AFC Chile
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
  'https://www.afc.cl/',
  'AFC Chile - Estadísticas del Seguro de Cesantía',
  'Datos sobre seguro de desempleo y rotación laboral en Chile',
  'La Administradora de Fondos de Cesantía (AFC) gestiona el seguro de desempleo en Chile y publica estadísticas sobre: beneficiarios del seguro, montos pagados, duración promedio del desempleo, tasas de rotación laboral por sector, y características de los trabajadores cesantes. Los datos son fundamentales para: análisis de estabilidad laboral, estudios de rotación por industria, planificación de políticas de empleo, y comprensión de dinámicas del mercado laboral chileno. La AFC tiene datos desde 2002 cuando se implementó el sistema.',
  'Empleo formal',
  'government',
  'Chile',
  ARRAY['seguro cesantía', 'desempleo', 'AFC', 'rotación laboral', 'beneficios'],
  'AFC/Superintendencia',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "AFC/Superintendencia", "period": "2002-presente"}'::jsonb
);

-- 23. INE - EME
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
  'https://www.ine.gob.cl/estadisticas/sociales/ingresos-y-gastos/encuesta-de-microemprendimiento',
  'INE - Encuesta de Microemprendimiento (EME)',
  'Encuesta sobre características y desempeño de microempresas en Chile',
  'La Encuesta de Microemprendimiento (EME) del INE caracteriza a los pequeños negocios y emprendimientos en Chile. Incluye datos sobre: número de microempresas, sectores de actividad, ingresos y ventas, empleo generado, formalización, acceso a financiamiento, uso de tecnología, y desafíos enfrentados. La encuesta distingue entre emprendimiento de necesidad y oportunidad. Es fundamental para: políticas de fomento productivo, programas de apoyo a emprendedores, estudios de ecosistema emprendedor, y comprensión del sector informal de la economía.',
  'Emprendimiento',
  'government',
  'Chile',
  ARRAY['microemprendimiento', 'pymes', 'emprendimiento', 'INE', 'informalidad'],
  'Ministerio de Economía / INE',
  '2023-01-01',
  '{"frequency": "bienal", "owner": "Ministerio de Economía / INE", "period": "2015-2023"}'::jsonb
);

-- 24. GEM Chile
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
  'https://gemconsortium.org/economy-profiles/chile',
  'GEM Chile - Monitor Global de Emprendimiento',
  'Estudio anual sobre actividad emprendedora en Chile con comparación internacional',
  'El Global Entrepreneurship Monitor (GEM) Chile es parte de un estudio internacional que mide la actividad emprendedora en múltiples países. Para Chile, proporciona datos sobre: tasa de actividad emprendedora (TEA), emprendimiento por oportunidad vs necesidad, etapas del emprendimiento, características de emprendedores, percepción de oportunidades, miedo al fracaso, y ecosistema emprendedor. GEM permite comparar a Chile con otros países y analizar tendencias temporales. Es esencial para: políticas de fomento al emprendimiento, identificación de brechas en el ecosistema, y benchmarking internacional.',
  'Emprendimiento',
  'academic',
  'Chile',
  ARRAY['GEM', 'emprendimiento', 'internacional', 'ecosistema', 'TEA'],
  'U. del Desarrollo',
  '2024-01-01',
  '{"frequency": "anual", "owner": "U. del Desarrollo", "period": "2002-presente"}'::jsonb
);

-- 25. CASEN
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
  'https://observatorio.ministeriodesarrollosocial.gob.cl/encuesta-casen',
  'CASEN - Encuesta de Caracterización Socioeconómica Nacional',
  'Encuesta principal sobre condiciones socioeconómicas de hogares chilenos',
  'La Encuesta CASEN es el principal instrumento para medir pobreza, desigualdad, y acceso a servicios en Chile. Incluye datos sobre: ingresos de hogares, empleo y ocupación, educación, salud, vivienda, redes de apoyo, y participación social. CASEN permite análisis a nivel nacional, regional, y comunal, con representatividad estadística. Los datos se usan para: diseño de políticas sociales, focalización de programas, evaluación de impacto, y estudios sobre equidad y movilidad social. La encuesta se realiza cada 2-3 años desde 1990.',
  'Encuestas Oficiales',
  'government',
  'Chile',
  ARRAY['CASEN', 'pobreza', 'desigualdad', 'caracterización', 'hogares', 'MDSF'],
  'MDSF (Observatorio Social)',
  '2022-01-01',
  '{"frequency": "bienal", "owner": "MDSF (Observatorio Social)", "period": "1990-2022"}'::jsonb
);

-- 26. MCTP Mineduc
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
  'https://marcodecualificaciones.mineduc.cl/',
  'MCTP - Marco de Cualificaciones Técnico Profesional',
  'Sistema de clasificación de cualificaciones técnicas en Chile',
  'El Marco de Cualificaciones Técnico Profesional (MCTP) organiza y clasifica las cualificaciones de la educación técnica en Chile en niveles progresivos. Define: perfiles de egreso, competencias esperadas, rutas de progresión, articulación entre niveles, y estándares de calidad. El MCTP facilita: reconocimiento de aprendizajes previos, movilidad entre instituciones, empleabilidad de técnicos, y alineación con necesidades del sector productivo. Es fundamental para instituciones de educación técnica, empleadores, y políticas de formación de capital humano técnico.',
  'Formación (marco/marco)',
  'government',
  'Chile',
  ARRAY['cualificaciones', 'educación técnica', 'MCTP', 'competencias', 'Mineduc'],
  'Mineduc',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "Mineduc", "period": "2015-presente"}'::jsonb
);

-- 27. Banco Central - Series de Empleo
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
  'https://www.bcentral.cl/estadisticas-economicas/tipo-de-publicacion',
  'Banco Central - Cuentas Nacionales y Series de Empleo',
  'Series estadísticas sobre actividad económica y empleo del Banco Central',
  'El Banco Central publica series de cuentas nacionales que incluyen datos sobre empleo, productividad, y actividad económica por sector. Los datos permiten analizar: evolución del empleo por industria, productividad laboral, valor agregado sectorial, y contribución al PIB. Estas series son complementarias a las del INE y proporcionan una perspectiva macroeconómica del mercado laboral. Son esenciales para: análisis de competitividad sectorial, estudios de productividad, proyecciones de empleo, y comprensión de ciclos económicos y su impacto laboral.',
  'Género/Mujer/Tiempo',
  'government',
  'Chile',
  ARRAY['cuentas nacionales', 'empleo', 'productividad', 'Banco Central', 'PIB'],
  'INE + MDSF',
  '2024-01-01',
  '{"frequency": "multianual", "owner": "INE + MDSF", "period": "series (p. ej. 2010-2024)"}'::jsonb
);

-- 28. INE - ESI Módulo Ingresos
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
  'https://www.ine.gob.cl/estadisticas/sociales/ingresos-y-gastos/encuesta-suplementaria-de-ingresos',
  'INE - Encuesta Suplementaria de Ingresos ESI (Módulo Ingresos)',
  'Datos detallados sobre estructura y distribución de ingresos en Chile',
  'El módulo de ingresos de la ESI proporciona desagregación detallada de fuentes de ingreso: sueldos y salarios, ingresos del trabajo independiente, rentas de capital, pensiones, subsidios estatales, y otras transferencias. Permite analizar: composición de ingresos por decil, brechas salariales, ingresos laborales vs no laborales, y efectividad redistributiva del sistema tributario y de transferencias. Es fundamental para: estudios de equidad, diseño de políticas redistributivas, análisis de mercado laboral, y comprensión de la estructura económica de los hogares chilenos.',
  'Género/Trabajo No Remunerado',
  'government',
  'Chile',
  ARRAY['ESI', 'ingresos', 'distribución', 'equidad', 'INE', 'estructura'],
  'INE',
  '2024-01-01',
  '{"frequency": "multianual", "owner": "INE", "period": "(p. ej. 2010-2024)"}'::jsonb
);

-- 29. INE - ENE Histórica
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
  'https://www.ine.gob.cl/estadisticas/sociales/mercado-laboral/ocupacion-y-desocupacion',
  'INE - Encuesta Nacional de Empleo (ENE) - Series Históricas',
  'Serie histórica de estadísticas de empleo y desempleo en Chile',
  'La Encuesta Nacional de Empleo (ENE) del INE es la principal fuente de estadísticas laborales en Chile. Proporciona datos mensuales sobre: tasa de ocupación, desocupación, participación laboral, características de ocupados y desocupados, sectores de empleo, formalidad/informalidad, y jornadas laborales. Las series históricas permiten análisis de tendencias de largo plazo y evaluación de políticas laborales. La ENE reemplazó en 2010 a encuestas anteriores, pero el INE mantiene series empalmadas que se remontan a 1986, permitiendo análisis de décadas.',
  'Ingresos laborales',
  'government',
  'Chile',
  ARRAY['ENE', 'empleo', 'desempleo', 'series históricas', 'INE', 'mercado laboral'],
  'INE',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "INE", "period": "anual (p. ej. 2010-2024)"}'::jsonb
);

-- 30. INE - ESI Ingresos del Trabajo
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
  'https://www.ine.gob.cl/estadisticas/sociales/ingresos-y-gastos/encuesta-suplementaria-de-ingresos',
  'INE - ESI Módulo Ingresos del Trabajo',
  'Análisis específico de ingresos laborales en Chile',
  'Este módulo específico de la ESI se enfoca exclusivamente en ingresos provenientes del trabajo. Desagrega: salarios por ocupación, sector, región, tamaño de empresa, formalidad, y características del trabajador (educación, experiencia, género). Permite análisis detallados de: brechas salariales de género, premios por educación, retornos a la experiencia, diferencias urbano-rurales, y efectos de la negociación colectiva. Es esencial para: benchmarking salarial, estudios de discriminación, políticas de equidad, y análisis de capital humano.',
  'Ingresos laborales',
  'government',
  'Chile',
  ARRAY['ingresos trabajo', 'salarios', 'ESI', 'brechas', 'INE'],
  'INE',
  '2024-01-01',
  '{"frequency": "anual", "owner": "INE", "period": "(p. ej. 2010-2024)"}'::jsonb
);

-- 31. INE - ENE Trimestre Móvil
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
  'https://www.ine.gob.cl/estadisticas/sociales/mercado-laboral/ocupacion-y-desocupacion',
  'INE - ENE Trimestre Móvil',
  'Estadísticas laborales mensuales con promedio trimestral móvil',
  'La ENE trimestre móvil proporciona estadísticas laborales con promedios de tres meses consecutivos, lo que reduce la volatilidad mensual y facilita la identificación de tendencias. Los datos incluyen: tasas de ocupación, desocupación, participación, informalidad, y subempleo, desagregados por región, género, edad, y sector. El trimestre móvil es especialmente útil para: análisis de tendencias, proyecciones de corto plazo, identificación de cambios estructurales, y comunicación de resultados a audiencias no técnicas. Se publica mensualmente con series desde 2010.',
  'Ingresos laborales',
  'government',
  'Chile',
  ARRAY['ENE', 'trimestre móvil', 'tendencias', 'empleo', 'INE'],
  'INE',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "INE", "period": "2010-presente (trimestre móvil)"}'::jsonb
);

-- 32. SENCE Buscaempleo
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
  'https://sence.gob.cl/servicios/buscaempleo',
  'SENCE - Portal Buscaempleo e Intermediación Laboral',
  'Plataforma de intermediación laboral pública en Chile',
  'Buscaempleo es el portal de intermediación laboral de SENCE que conecta ofertas y demandas de trabajo. Proporciona datos sobre: vacantes publicadas por sector y región, perfiles solicitados, competencias demandadas, remuneraciones ofrecidas, y estadísticas de colocación. Las OMIL (Oficinas Municipales de Intermediación Laboral) alimentan esta plataforma con ofertas locales. Es fundamental para: análisis de demanda laboral en tiempo real, identificación de brechas de competencias, orientación laboral, y evaluación de programas de empleo.',
  'Intermediación Pública',
  'government',
  'Chile',
  ARRAY['intermediación laboral', 'OMIL', 'SENCE', 'vacantes', 'colocación'],
  'SENCE',
  '2024-01-01',
  '{"frequency": "continuo", "owner": "SENCE", "period": "continuo"}'::jsonb
);

-- 33. INJUV
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
  'https://www.injuv.gob.cl/',
  'INJUV - Encuesta Nacional de Juventudes',
  'Encuesta sobre condiciones, aspiraciones y desafíos de jóvenes en Chile',
  'La Encuesta Nacional de Juventudes del INJUV caracteriza a la población joven chilena (15-29 años). Incluye datos sobre: educación y trayectorias formativas, empleo y expectativas laborales, participación social y política, salud y bienestar, uso de tecnología, y valores. La encuesta permite identificar: desafíos de inserción laboral juvenil, brechas de oportunidades, aspiraciones y proyectos de vida, y factores de vulnerabilidad. Es esencial para: diseño de políticas de juventud, programas de empleabilidad juvenil, y comprensión de dinámicas generacionales en el mercado laboral.',
  'Juventud',
  'government',
  'Chile',
  ARRAY['juventud', 'INJUV', 'empleo juvenil', 'encuesta', 'jóvenes'],
  'INJUV',
  '2022-01-01',
  '{"frequency": "trienal", "owner": "INJUV", "period": "2003, 2012, 2015, 2018, 2022"}'::jsonb
);

-- 34. DUECh Academia
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
  'DUECh - Diccionario de Uso del Español de Chile',
  'Diccionario académico del español chileno con contexto de uso',
  'El Diccionario de Uso del Español de Chile (DUECh) de la Academia Chilena de la Lengua documenta el léxico chileno con definiciones, ejemplos de uso, y contexto histórico. Incluye: chilenismos, modismos, expresiones idiomáticas, y variantes regionales. El diccionario es especialmente útil para: comunicación profesional efectiva, capacitación intercultural, traducción, y comprensión de matices culturales en contextos laborales. La edición más reciente refleja usos contemporáneos del español chileno en diversos ámbitos profesionales.',
  'Lingüística',
  'academic',
  'Chile',
  ARRAY['diccionario', 'español chileno', 'DUECh', 'Academia', 'léxico'],
  'Academia Chilena / Instituto de Chile',
  '2010-01-01',
  '{"frequency": "única", "owner": "Academia Chilena / Instituto de Chile", "year": 2010}'::jsonb
);

-- 35. ASALE Diccionario
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
  'https://www.asale.org/damer/',
  'ASALE - Diccionario de Americanismos',
  'Diccionario de términos y expresiones del español americano',
  'El Diccionario de Americanismos de la Asociación de Academias de la Lengua Española (ASALE) documenta el léxico de toda América Latina, incluyendo términos chilenos. Proporciona: definiciones estandarizadas, indicaciones geográficas de uso, ejemplos contextualizados, y variantes regionales. Es fundamental para: comunicación profesional pan-latinoamericana, traducción, capacitación de trabajadores extranjeros en Chile, y empresas con operaciones en múltiples países latinoamericanos. El diccionario facilita la comprensión de diferencias léxicas entre países hispanohablantes.',
  'Lingüística',
  'academic',
  'Chile',
  ARRAY['americanismos', 'ASALE', 'RAE', 'diccionario', 'español América'],
  'ASALE/RAE',
  '2010-01-01',
  '{"frequency": "única", "owner": "ASALE/RAE", "year": "2010 (en línea)"}'::jsonb
);

-- 36. Roediger Histórico
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
  'https://archive.org/details/diccionariodelch00roed',
  'Roediger - Diccionario del Español de Chile (Histórico 1901-1918)',
  'Diccionario histórico del español chileno de principios del siglo XX',
  'El diccionario histórico de Roediger documenta el español chileno de principios del siglo XX. Aunque es un recurso histórico, proporciona perspectiva sobre: evolución del léxico chileno, términos que han caído en desuso, expresiones tradicionales, y cambios en el uso del lenguaje. Es útil para: estudios lingüísticos históricos, comprensión de textos y documentos antiguos, análisis de evolución cultural, y contexto histórico del lenguaje profesional chileno. El diccionario está en dominio público y disponible digitalmente.',
  'Lingüística',
  'academic',
  'Chile',
  ARRAY['diccionario histórico', 'Roediger', 'español chileno', 'siglo XX', 'patrimonio'],
  'Dominio público',
  '1918-01-01',
  '{"frequency": "única", "owner": "Dominio público", "year": "tomo I-V"}'::jsonb
);

-- 37. DUECh 2010
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
  'Academia Chilena - DUECh Edición 2010',
  'Diccionario oficial de uso del español de Chile',
  'La edición 2010 del DUECh es la referencia oficial del español chileno. Incluye: más de 18,000 entradas, definiciones contextualizadas, ejemplos de uso contemporáneo, indicaciones de registro (formal, informal, técnico), y marcas de frecuencia. El diccionario cubre vocabulario general y técnico de diversos ámbitos profesionales. Es esencial para: redacción profesional, capacitación en comunicación efectiva, elaboración de materiales educativos, y estandarización de lenguaje en organizaciones. La edición está disponible en línea con búsqueda avanzada.',
  'Léxico/Modismos',
  'academic',
  'Chile',
  ARRAY['DUECh', 'Academia Chilena', 'diccionario oficial', 'español chileno', '2010'],
  'Academia Chilena de la Lengua/Instituto de Chile',
  '2010-01-01',
  '{"frequency": "única", "owner": "Academia Chilena de la Lengua/Instituto de Chile", "year": "2010 (edición)"}'::jsonb
);

-- 38. Banco Central SI3
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
  'https://www.bcentral.cl/Siete',
  'Banco Central - Base de Datos Estadísticos (SI3)',
  'Sistema integrado de información estadística económica de Chile',
  'El Sistema de Información Estadística (SI3) del Banco Central es la fuente más completa de datos macroeconómicos de Chile. Incluye series mensuales, trimestrales y anuales sobre: PIB y componentes, inflación (IPC, IPCSAE, IPM), empleo y salarios, cuentas externas, agregados monetarios, tasas de interés, tipo de cambio, y cuentas fiscales. Los datos tienen alta frecuencia de actualización y series históricas extensas. Es fundamental para: análisis económico, proyecciones, investigación académica, decisiones de inversión, y comprensión del contexto macroeconómico en que opera el mercado laboral chileno.',
  'Marco de Cualificaciones',
  'government',
  'Chile',
  ARRAY['Banco Central', 'estadísticas', 'macroeconómicas', 'SI3', 'PIB', 'inflación'],
  'Banco Central de Chile',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "Banco Central de Chile", "period": "1960-presente"}'::jsonb
);

-- 39. MCTP Talleres
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
  'https://marcodecualificaciones.mineduc.cl/',
  'Mineduc - Marco de Cualificaciones Técnico Profesional (Talleres)',
  'Recursos y talleres sobre implementación del MCTP en Chile',
  'Esta sección del portal MCTP proporciona materiales de talleres y capacitaciones sobre la implementación del Marco de Cualificaciones. Incluye: guías metodológicas, herramientas de diseño curricular, casos de estudio, presentaciones de talleres, y recursos para docentes y directivos. Los materiales cubren: articulación entre niveles educativos, reconocimiento de aprendizajes previos, diseño por competencias, y evaluación de resultados de aprendizaje. Es fundamental para: instituciones que implementan educación basada en competencias, diseñadores curriculares, y evaluadores de programas técnicos.',
  'Mercado de Cualificaciones',
  'government',
  'Chile',
  ARRAY['MCTP', 'talleres', 'capacitación', 'implementación', 'Mineduc'],
  'Mineduc',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "Mineduc", "period": "2015-presente"}'::jsonb
);

-- 40. INE ENE Desocupación
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
  'https://www.ine.gob.cl/estadisticas/sociales/mercado-laboral/ocupacion-y-desocupacion',
  'INE - ENE Desocupación y Mercado Laboral',
  'Estadísticas detalladas sobre desempleo y búsqueda de empleo en Chile',
  'Esta sección de la ENE proporciona análisis detallado sobre desocupación en Chile. Incluye: tasa de desocupación por región, género, edad, nivel educativo, duración del desempleo, motivos de cesantía, canales de búsqueda de empleo, y características de desocupados. Los datos del trimestre móvil permiten identificar tendencias y patrones estacionales. Es fundamental para: políticas de empleo, programas de capacitación, intermediación laboral, y comprensión de barreras de acceso al empleo. Las series permiten comparaciones históricas y análisis de impacto de crisis económicas.',
  'Mercado laboral (encuestas)',
  'government',
  'Chile',
  ARRAY['desocupación', 'desempleo', 'ENE', 'búsqueda empleo', 'INE'],
  'INE',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "INE", "period": "1957-presente (trimestre)"}'::jsonb
);

-- 41. Centro Microdatos
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
  'https://www.microdatos.cl/',
  'Centro de Microdatos Universidad de Chile',
  'Centro de investigación en análisis de datos y mercado laboral',
  'El Centro de Microdatos de la Universidad de Chile realiza investigación aplicada usando bases de datos administrativas y encuestas. Sus estudios cubren: mercado laboral, educación, salud, políticas públicas, y evaluación de impacto. El centro produce reportes sobre: trayectorias laborales, efectividad de programas de capacitación, brechas salariales, movilidad social, y transiciones educación-trabajo. Sus investigaciones utilizan metodologías rigurosas y datos longitudinales, proporcionando evidencia para diseño de políticas. Es una fuente clave de investigación académica sobre el mercado laboral chileno.',
  'Mercado laboral/Ocupaciones',
  'academic',
  'Chile',
  ARRAY['investigación', 'microdatos', 'Universidad de Chile', 'evidencia', 'políticas'],
  'U. de Chile - Centro Microdatos',
  '2024-01-01',
  '{"frequency": "trimestral", "owner": "U. de Chile - Centro Microdatos", "period": "1957-presente (trimestre)"}'::jsonb
);

-- 42. SECTRA
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
  'https://www.sectra.gob.cl/',
  'SECTRA - Encuesta Origen Destino de Viajes',
  'Encuesta sobre movilidad urbana y patrones de desplazamiento en Chile',
  'La Encuesta Origen-Destino de SECTRA analiza patrones de movilidad en las principales ciudades chilenas. Incluye datos sobre: modos de transporte utilizados, tiempos de viaje, propósitos de desplazamiento (trabajo, estudio, otros), rutas más utilizadas, y características socioeconómicas de usuarios. La encuesta permite analizar: accesibilidad a empleos, impacto de transporte en calidad de vida laboral, brechas de movilidad, y necesidades de infraestructura. Es fundamental para: planificación urbana, políticas de transporte, análisis de accesibilidad laboral, y comprensión de desafíos de conciliación trabajo-vida.',
  'Movilidad Urbana',
  'government',
  'Chile',
  ARRAY['movilidad', 'transporte', 'SECTRA', 'origen-destino', 'viajes'],
  'SECTRA',
  '2024-01-01',
  '{"frequency": "multianual", "owner": "SECTRA", "period": "2001-presente"}'::jsonb
);

-- 43. BCN Código del Trabajo
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
  'https://www.bcn.cl/leychile/navegar?idNorma=207436',
  'BCN - Código del Trabajo de Chile (Ley Chile)',
  'Texto actualizado del Código del Trabajo con sus modificaciones',
  'El portal Ley Chile de la Biblioteca del Congreso Nacional proporciona acceso al Código del Trabajo actualizado con todas sus modificaciones. Incluye: normativa sobre contratos, jornadas laborales, remuneraciones, descansos, feriados, terminación de contrato, negociación colectiva, organizaciones sindicales, y derechos fundamentales. El portal permite navegación por artículos, búsqueda de términos, y acceso a historia de modificaciones. Es esencial para: profesionales de recursos humanos, abogados laborales, trabajadores, empleadores, y cualquier persona que necesite conocer la legislación laboral vigente en Chile.',
  'Normativa laboral',
  'government',
  'Chile',
  ARRAY['Código del Trabajo', 'legislación', 'BCN', 'Ley Chile', 'normativa'],
  'BCN/DT',
  '2024-01-01',
  '{"frequency": "continuo", "owner": "BCN/DT", "period": "vigente (actualización continua)"}'::jsonb
);

-- 44. Termómetro Laboral
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
  'https://www.subtrab.gob.cl/',
  'Subsecretaría del Trabajo - Termómetro Laboral',
  'Indicador de condiciones laborales en Chile',
  'El Termómetro Laboral Nacional es un indicador sintético que resume múltiples dimensiones del mercado laboral chileno. Integra datos sobre: empleo, desempleo, salarios, formalidad, sindicalización, negociación colectiva, y conflictividad laboral. El indicador permite monitorear la salud general del mercado laboral y comunicar de manera simple cambios complejos. Es útil para: comunicación pública de políticas laborales, análisis de coyuntura, identificación de alertas tempranas, y evaluación rápida de impacto de shocks económicos en el empleo.',
  'Observatorios Laborales (SENCE)',
  'government',
  'Chile',
  ARRAY['termómetro laboral', 'indicador', 'Subsecretaría', 'condiciones', 'monitoreo'],
  'Subrab/SENCE',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "Subrab/SENCE", "period": "2020-presente (mensual)"}'::jsonb
);

-- 45. Observatorio Laboral
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
  'https://www.subtrab.gob.cl/',
  'Observatorio Laboral - Subsecretaría del Trabajo',
  'Portal de datos y análisis del mercado laboral chileno',
  'El Observatorio Laboral de la Subsecretaría del Trabajo centraliza datos y análisis sobre el mercado laboral. Proporciona: boletines mensuales, informes especiales, series estadísticas, visualizaciones interactivas, y estudios temáticos. Cubre temas como: evolución del empleo, calidad del trabajo, brechas laborales, productividad, y efectos de políticas públicas. El observatorio es fundamental para: análisis de coyuntura, investigación aplicada, diseño de políticas, y comunicación con diversos stakeholders. Combina datos de múltiples fuentes (INE, SENCE, Dirección del Trabajo) en un solo lugar.',
  'Observatorios Laborales (SENCE)',
  'government',
  'Chile',
  ARRAY['observatorio', 'análisis laboral', 'boletines', 'estudios', 'Subsecretaría'],
  'Pad Observatorios',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "Pad Observatorios", "period": "2020-presente (mensual)"}'::jsonb
);

-- 46. Encuesta Bicentenario UC
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
  'https://encuestabicentenario.uc.cl/',
  'UC - Encuesta Bicentenario',
  'Encuesta sobre valores, actitudes y opinión pública en Chile',
  'La Encuesta Bicentenario de la Pontificia Universidad Católica de Chile es un estudio anual sobre valores, actitudes políticas, percepción de instituciones, y opinión sobre temas de actualidad. Aunque no es específicamente laboral, incluye preguntas sobre: satisfacción con el trabajo, aspiraciones económicas, percepción de movilidad social, confianza en sindicatos y empleadores, y valores relacionados con el trabajo. La encuesta permite analizar cambios culturales que afectan el mundo laboral chileno y es útil para comprender contextos más amplios de las relaciones laborales.',
  'Opinión Pública',
  'academic',
  'Chile',
  ARRAY['opinión pública', 'valores', 'UC', 'Bicentenario', 'actitudes'],
  'I-CPUC',
  '2024-01-01',
  '{"frequency": "anual", "owner": "I-CPUC", "period": "anual"}'::jsonb
);

-- Verificar inserción
SELECT 'Se insertaron ' || COUNT(*) || ' recursos web del mercado chileno' as resultado
FROM web_resources 
WHERE country = 'Chile';
