-- Primero, eliminar cualquier recurso web duplicado existente
DELETE FROM web_resources WHERE country = 'Chile';

-- Ahora insertar los 50 recursos web del mercado chileno sin duplicados

-- 1. ChileValora - Catálogo de Perfiles
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

-- 2. ChileValora - Guía Evaluación 2024
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
  'https://chilevalora.gob.cl/guia-evaluacion-2024',
  'ChileValora - Guía de Evaluación y Certificación 2024',
  'Guía completa sobre el proceso de evaluación y certificación de competencias laborales en Chile',
  'Esta guía proporciona información detallada sobre el proceso de evaluación y certificación de competencias laborales en Chile. Incluye metodologías de evaluación, criterios de certificación, procedimientos administrativos, y ejemplos prácticos de aplicación. Es un recurso esencial para evaluadores, capacitadores, y profesionales de recursos humanos que buscan implementar sistemas de gestión por competencias en sus organizaciones.',
  'Competencias',
  'government',
  'Chile',
  ARRAY['evaluación', 'certificación', 'competencias', 'guía', 'ChileValora', '2024'],
  'ChileValora',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "ChileValora", "year": 2024}'::jsonb
);

-- 3. ChileValora - Guía Articulación 2024
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
  'https://chilevalora.gob.cl/guia-articulacion-2024',
  'ChileValora - Guía de Articulación de Competencias 2024',
  'Documento que explica cómo articular competencias laborales con programas de formación',
  'La Guía de Articulación 2024 de ChileValora explica cómo vincular los perfiles de competencias con programas de capacitación y formación técnico-profesional. Incluye metodologías para el diseño curricular basado en competencias, estrategias de articulación entre el mundo educativo y productivo, y ejemplos de implementación exitosa.',
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
  'ChileValora - Portal Principal',
  'Portal oficial de ChileValora con acceso a todas las guías y recursos del sistema de certificación',
  'El portal principal de ChileValora es el punto de acceso central a todos los recursos del Sistema Nacional de Certificación de Competencias Laborales. Aquí se encuentran las guías de evaluación y articulación 2024, el catálogo completo de perfiles ocupacionales, información sobre centros de evaluación certificados, estadísticas del sistema, y noticias actualizadas.',
  'Competencias',
  'government',
  'Chile',
  ARRAY['ChileValora', 'certificación', 'competencias', 'portal', 'recursos', '2024'],
  'ChileValora',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "ChileValora", "year": 2024}'::jsonb
);

-- 5. Dirección del Trabajo - ENCLA
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
  'https://www.dt.gob.cl/encuesta-laboral-encla',
  'Dirección del Trabajo - Encuesta Laboral ENCLA',
  'Encuesta sobre relaciones laborales y condiciones de trabajo en Chile',
  'La Encuesta Laboral ENCLA de la Dirección del Trabajo es un estudio periódico que analiza las relaciones laborales, condiciones de trabajo, prácticas de gestión de recursos humanos, y clima laboral en empresas chilenas. Proporciona datos sobre: contratación, remuneraciones, jornadas laborales, negociación colectiva, capacitación, seguridad y salud ocupacional, y relaciones sindicales.',
  'Condiciones laborales',
  'government',
  'Chile',
  ARRAY['encuesta laboral', 'condiciones trabajo', 'relaciones laborales', 'ENCLA', 'Dirección del Trabajo'],
  'Dirección del Trabajo',
  '2021-01-01',
  '{"frequency": "multianual", "owner": "Dirección del Trabajo", "waves": "2002-2021", "latest": 2021}'::jsonb
);

-- 6. SUBTEL - Encuesta Internet
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
  'https://www.subtel.gob.cl/estudios-internet',
  'SUBTEL - Encuesta de Acceso y Uso de Internet',
  'Encuesta histórica sobre penetración y uso de internet en Chile',
  'La Encuesta de Acceso y Uso de Internet de SUBTEL proporciona datos históricos sobre la adopción y uso de tecnologías de información en Chile. Incluye indicadores sobre: penetración de internet fijo y móvil, velocidades de conexión, dispositivos utilizados, usos principales como educación, trabajo y entretenimiento, brechas digitales por región y nivel socioeconómico, y evolución temporal.',
  'Conectividad',
  'government',
  'Chile',
  ARRAY['internet', 'conectividad', 'brecha digital', 'SUBTEL', 'acceso', 'tecnología'],
  'SUBTEL',
  '2024-01-01',
  '{"frequency": "anual", "owner": "SUBTEL", "period": "2015-2024", "type": "bases e informes"}'::jsonb
);

-- 7. SUBTEL - Informe 2024
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
  'https://www.subtel.gob.cl/informe-conectividad-2024',
  'SUBTEL - Informe de Conectividad 2024',
  'Informe actualizado sobre el estado de la conectividad en Chile',
  'El Informe de Conectividad y Uso de Internet 2024 de SUBTEL presenta un análisis completo del estado de las telecomunicaciones en Chile. Incluye: estadísticas de penetración de banda ancha fija y móvil, evolución de velocidades promedio, análisis de brechas regionales, uso de internet por propósito como teletrabajo, educación online y comercio electrónico.',
  'Conectividad',
  'government',
  'Chile',
  ARRAY['conectividad', 'informe', 'internet', 'telecomunicaciones', 'SUBTEL', '2024'],
  'SUBTEL',
  '2024-01-01',
  '{"frequency": "anual", "owner": "SUBTEL", "year": 2024}'::jsonb
);

-- 8. SUBTEL - Series Históricas
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
  'https://www.subtel.gob.cl/series-internet-2015-2024',
  'SUBTEL - Series de Datos 2015-2024',
  'Serie completa de encuestas sobre acceso y uso de internet en Chile',
  'Esta colección de encuestas de SUBTEL proporciona una visión longitudinal de la evolución del acceso y uso de internet en Chile durante la última década. Los datos permiten analizar tendencias como: el crecimiento exponencial de la banda ancha móvil, la reducción gradual de brechas urbano-rurales, el aumento del uso productivo de internet.',
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
  'Banco Central - IMACEC y Estadísticas',
  'Base de datos de indicadores económicos clave de Chile',
  'El Sistema de Información del Banco Central (SI3) proporciona acceso a series estadísticas económicas fundamentales: IMACEC (Indicador Mensual de Actividad Económica), PIB, inflación (IPC, IPCSAE), empleo, salarios, comercio exterior, agregados monetarios, tasas de interés, tipo de cambio, cuentas nacionales, y balanza de pagos.',
  'Contexto macroeconómico',
  'government',
  'Chile',
  ARRAY['IMACEC', 'economía', 'Banco Central', 'indicadores', 'estadísticas', 'PIB'],
  'Banco Central de Chile',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "Banco Central de Chile", "period": "1986-presente"}'::jsonb
);

-- 10. CODESACH
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
  'https://www.codesach.cl',
  'CODESACH - Corpus Sociológico del Español',
  'Base de datos académica sobre lenguaje y sociedad en Chile',
  'El Corpus Sociológico del Español de Chile (CODESACH) es un proyecto académico que analiza el uso del lenguaje en diferentes contextos sociales chilenos. Incluye análisis de: variaciones dialectales, lenguaje profesional por sector, terminología técnica, comunicación organizacional, y evolución del español chileno.',
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
  'https://www.codesach.cl/inalbi',
  'CODESACH INALBI - Variantes del Español Chileno',
  'Corpus académico sobre variantes del español chileno en contextos laborales',
  'Esta versión del corpus CODESACH se enfoca específicamente en el lenguaje utilizado en contextos laborales y profesionales en Chile. Analiza: terminología técnica por industria, comunicación formal e informal en organizaciones, variaciones regionales en el lenguaje empresarial.',
  'Corpora',
  'academic',
  'Chile',
  ARRAY['corpus', 'lenguaje laboral', 'comunicación profesional', 'variantes', 'INALBI'],
  'Proyecto académico (INALBI)',
  '2022-01-01',
  '{"frequency": "adhoc", "owner": "Proyecto académico", "year": "v1.0 (2022)"}'::jsonb
);

-- 12. Corpus Básico Diferencial
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
  'https://www.scielo.cl/corpus-basico-diferencial',
  'Corpus Básico Diferencial del Español de Chile',
  'Artículos académicos sobre particularidades del español chileno',
  'Esta colección de artículos académicos analiza las características distintivas del español chileno en contextos profesionales y cotidianos. Los estudios cubren: modismos y expresiones idiomáticas, vocabulario técnico chileno, diferencias con otras variantes del español.',
  'Corpora',
  'academic',
  'Chile',
  ARRAY['español chileno', 'artículos', 'diferencial', 'sociolingüística', 'comunicación'],
  'Universidades/Scielo',
  '2020-01-01',
  '{"frequency": "varios", "owner": "Universidades/Scielo"}'::jsonb
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
  'https://www.ine.gob.cl/esi',
  'INE - Encuesta Suplementaria de Ingresos',
  'Encuesta sobre ingresos de hogares y personas en Chile',
  'La Encuesta Suplementaria de Ingresos (ESI) del INE proporciona información detallada sobre la distribución de ingresos en Chile. Incluye datos sobre: ingresos del trabajo por ocupación, sector y región, ingresos autónomos, subsidios y transferencias, ingresos totales de hogares, desigualdad de ingresos.',
  'Costo de vida',
  'government',
  'Chile',
  ARRAY['ESI', 'ingresos', 'salarios', 'INE', 'distribución', 'desigualdad'],
  'INE',
  '2022-01-01',
  '{"frequency": "multianual", "owner": "INE", "waves": "2006-2022"}'::jsonb
);

-- 14. INE - IPC
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
  'https://www.ine.gob.cl/ipc',
  'INE - Índice de Precios al Consumidor',
  'Indicador oficial de inflación en Chile',
  'El Índice de Precios al Consumidor (IPC) es el indicador oficial de inflación en Chile, medido mensualmente por el INE. Registra la variación de precios de una canasta de bienes y servicios representativa del consumo de los hogares chilenos.',
  'Costo de vida',
  'government',
  'Chile',
  ARRAY['IPC', 'inflación', 'precios', 'costo de vida', 'INE', 'canasta'],
  'INE',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "INE", "period": "1928-presente"}'::jsonb
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
  'ChileCompra - Portal de Compras Públicas',
  'Base de datos de licitaciones y contrataciones públicas en Chile',
  'ChileCompra es el portal de compras públicas del Estado chileno que transparenta todas las licitaciones y contrataciones. Proporciona datos sobre: demanda de servicios profesionales por sector público, montos contratados por categoría, tendencias de contratación.',
  'Demanda laboral',
  'government',
  'Chile',
  ARRAY['ChileCompra', 'licitaciones', 'compras públicas', 'demanda', 'servicios'],
  'Dirección ChileCompra',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "Dirección ChileCompra", "period": "2003-presente"}'::jsonb
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
  'Los Informes de Desarrollo Humano del PNUD Chile analizan dimensiones clave del bienestar y desarrollo en el país. Incluyen temas como: desigualdad y cohesión social, empleo y trabajo decente, educación y oportunidades, salud y calidad de vida.',
  'Desarrollo Humano',
  'academic',
  'Chile',
  ARRAY['PNUD', 'desarrollo humano', 'bienestar', 'desigualdad', 'políticas públicas'],
  'PNUD Chile',
  '2024-01-01',
  '{"frequency": "multianual", "owner": "PNUD Chile", "period": "1996-2024"}'::jsonb
);

-- 17. MDSF
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
  'https://observatorio.ministeriodesarrollosocial.gob.cl/discapacidad',
  'MDSF - Encuestas de Inclusión Social',
  'Encuestas sobre inclusión social y discapacidad en Chile',
  'Las encuestas del Ministerio de Desarrollo Social y Familia (MDSF) y SENADES analizan barreras y facilitadores para la inclusión social en Chile. Incluyen datos sobre: personas en situación de discapacidad, acceso a empleo, educación inclusiva.',
  'Discapacidad/Dependencia',
  'government',
  'Chile',
  ARRAY['discapacidad', 'inclusión', 'MDSF', 'SENADES', 'accesibilidad', 'diversidad'],
  'MDSF / SENADES / INE',
  '2022-01-01',
  '{"frequency": "varios", "owner": "MDSF", "period": "2015-2022"}'::jsonb
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
  'https://www.oecd.org/pisa/chile',
  'PISA Chile - Evaluación OECD',
  'Resultados de Chile en evaluación internacional PISA',
  'PISA evalúa competencias de estudiantes de 15 años en lectura, matemáticas, y ciencias. Los resultados de Chile permiten comparaciones internacionales y análisis de tendencias en calidad educativa.',
  'Educación Escolar',
  'academic',
  'Chile',
  ARRAY['PISA', 'educación', 'OECD', 'competencias', 'evaluación internacional'],
  'OECD / Mineduc',
  '2022-01-01',
  '{"frequency": "trienal", "owner": "OECD / Mineduc", "period": "2000-2022"}'::jsonb
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
  'SIES Mi Futuro - Educación Superior',
  'Portal con información sobre carreras, instituciones y empleabilidad',
  'Mi Futuro es el portal oficial del SIES que proporciona datos sobre: carreras universitarias y técnicas, instituciones acreditadas, aranceles, empleabilidad por carrera, ingresos promedio de egresados.',
  'Educación Superior',
  'government',
  'Chile',
  ARRAY['educación superior', 'empleabilidad', 'ingresos', 'carreras', 'SIES', 'Mi Futuro'],
  'Mineduc',
  '2024-01-01',
  '{"frequency": "anual", "owner": "Mineduc", "period": "2012-presente"}'::jsonb
);

-- 20. Mi Futuro Empleabilidad
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
  'https://www.mifuturo.cl/empleabilidad',
  'Mi Futuro - Empleabilidad de Egresados',
  'Base de datos sobre trayectorias laborales de egresados',
  'Esta base de datos proporciona información detallada sobre las trayectorias laborales de egresados de educación superior en Chile. Incluye: tasas de empleabilidad, ingresos promedio por carrera, evolución salarial, sectores de empleo.',
  'Educación/Empleabilidad',
  'government',
  'Chile',
  ARRAY['empleabilidad', 'ingresos egresados', 'educación superior', 'trayectorias', 'SIES'],
  'Mineduc',
  '2024-01-01',
  '{"frequency": "anual", "owner": "Mineduc", "period": "2012-presente"}'::jsonb
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
  'Servicio Civil - Empleo Público',
  'Portal de oportunidades laborales en el sector público chileno',
  'El portal de Empleo Público del Servicio Civil concentra todas las ofertas laborales del Estado chileno. Proporciona información sobre: cargos disponibles, requisitos y perfiles solicitados, procesos de selección, remuneraciones.',
  'Empleo formal',
  'government',
  'Chile',
  ARRAY['empleo público', 'Servicio Civil', 'Estado', 'concursos', 'oportunidades'],
  'Servicio Civil',
  '2024-01-01',
  '{"frequency": "continuo", "owner": "Servicio Civil"}'::jsonb
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
  'https://www.afc.cl/estadisticas',
  'AFC - Seguro de Cesantía',
  'Datos sobre seguro de desempleo y rotación laboral en Chile',
  'La AFC gestiona el seguro de desempleo en Chile y publica estadísticas sobre: beneficiarios del seguro, montos pagados, duración promedio del desempleo, tasas de rotación laboral por sector.',
  'Empleo formal',
  'government',
  'Chile',
  ARRAY['seguro cesantía', 'desempleo', 'AFC', 'rotación laboral', 'beneficios'],
  'AFC',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "AFC", "period": "2002-presente"}'::jsonb
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
  'https://www.ine.gob.cl/eme',
  'INE - Encuesta de Microemprendimiento',
  'Encuesta sobre características y desempeño de microempresas en Chile',
  'La Encuesta de Microemprendimiento (EME) del INE caracteriza a los pequeños negocios y emprendimientos en Chile. Incluye datos sobre: número de microempresas, sectores de actividad, ingresos y ventas.',
  'Emprendimiento',
  'government',
  'Chile',
  ARRAY['microemprendimiento', 'pymes', 'emprendimiento', 'INE', 'informalidad'],
  'INE',
  '2023-01-01',
  '{"frequency": "bienal", "owner": "INE", "period": "2015-2023"}'::jsonb
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
  'https://gemconsortium.org/chile',
  'GEM Chile - Monitor Global de Emprendimiento',
  'Estudio anual sobre actividad emprendedora en Chile',
  'El Global Entrepreneurship Monitor (GEM) Chile es parte de un estudio internacional que mide la actividad emprendedora. Proporciona datos sobre: tasa de actividad emprendedora, emprendimiento por oportunidad vs necesidad.',
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
  'https://observatorio.ministeriodesarrollosocial.gob.cl/casen',
  'CASEN - Encuesta de Caracterización Socioeconómica',
  'Encuesta principal sobre condiciones socioeconómicas de hogares chilenos',
  'La Encuesta CASEN es el principal instrumento para medir pobreza, desigualdad, y acceso a servicios en Chile. Incluye datos sobre: ingresos de hogares, empleo y ocupación, educación, salud, vivienda.',
  'Encuestas Oficiales',
  'government',
  'Chile',
  ARRAY['CASEN', 'pobreza', 'desigualdad', 'caracterización', 'hogares', 'MDSF'],
  'MDSF',
  '2022-01-01',
  '{"frequency": "bienal", "owner": "MDSF", "period": "1990-2022"}'::jsonb
);

-- 26. MCTP
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
  'El Marco de Cualificaciones Técnico Profesional (MCTP) organiza y clasifica las cualificaciones de la educación técnica en Chile en niveles progresivos.',
  'Formación',
  'government',
  'Chile',
  ARRAY['cualificaciones', 'educación técnica', 'MCTP', 'competencias', 'Mineduc'],
  'Mineduc',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "Mineduc", "period": "2015-presente"}'::jsonb
);

-- 27. Banco Central - Cuentas Nacionales
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
  'https://www.bcentral.cl/cuentas-nacionales',
  'Banco Central - Cuentas Nacionales y Empleo',
  'Series estadísticas sobre actividad económica y empleo',
  'El Banco Central publica series de cuentas nacionales que incluyen datos sobre empleo, productividad, y actividad económica por sector.',
  'Contexto macroeconómico',
  'government',
  'Chile',
  ARRAY['cuentas nacionales', 'empleo', 'productividad', 'Banco Central', 'PIB'],
  'Banco Central',
  '2024-01-01',
  '{"frequency": "trimestral", "owner": "Banco Central", "period": "2010-presente"}'::jsonb
);

-- 28. INE - ESI Módulo
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
  'https://www.ine.gob.cl/esi-modulo-ingresos',
  'INE - ESI Módulo Ingresos',
  'Datos detallados sobre estructura y distribución de ingresos',
  'El módulo de ingresos de la ESI proporciona desagregación detallada de fuentes de ingreso: sueldos y salarios, ingresos del trabajo independiente, rentas de capital.',
  'Ingresos laborales',
  'government',
  'Chile',
  ARRAY['ESI', 'ingresos', 'distribución', 'equidad', 'INE', 'estructura'],
  'INE',
  '2024-01-01',
  '{"frequency": "multianual", "owner": "INE", "period": "2010-2024"}'::jsonb
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
  'https://www.ine.gob.cl/ene-historica',
  'INE - ENE Series Históricas',
  'Serie histórica de estadísticas de empleo y desempleo',
  'La Encuesta Nacional de Empleo (ENE) del INE es la principal fuente de estadísticas laborales en Chile. Proporciona datos mensuales sobre: tasa de ocupación, desocupación, participación laboral.',
  'Mercado laboral',
  'government',
  'Chile',
  ARRAY['ENE', 'empleo', 'desempleo', 'series históricas', 'INE', 'mercado laboral'],
  'INE',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "INE", "period": "2010-2024"}'::jsonb
);

-- 30. INE - ESI Trabajo
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
  'https://www.ine.gob.cl/esi-ingresos-trabajo',
  'INE - ESI Ingresos del Trabajo',
  'Análisis específico de ingresos laborales en Chile',
  'Este módulo específico de la ESI se enfoca exclusivamente en ingresos provenientes del trabajo. Desagrega: salarios por ocupación, sector, región, tamaño de empresa.',
  'Ingresos laborales',
  'government',
  'Chile',
  ARRAY['ingresos trabajo', 'salarios', 'ESI', 'brechas', 'INE'],
  'INE',
  '2024-01-01',
  '{"frequency": "anual", "owner": "INE", "period": "2010-2024"}'::jsonb
);

-- 31. INE - ENE Trimestre
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
  'https://www.ine.gob.cl/ene-trimestre-movil',
  'INE - ENE Trimestre Móvil',
  'Estadísticas laborales con promedio trimestral móvil',
  'La ENE trimestre móvil proporciona estadísticas laborales con promedios de tres meses consecutivos, reduciendo volatilidad y facilitando identificación de tendencias.',
  'Mercado laboral',
  'government',
  'Chile',
  ARRAY['ENE', 'trimestre móvil', 'tendencias', 'empleo', 'INE'],
  'INE',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "INE", "period": "2010-presente"}'::jsonb
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
  'https://sence.gob.cl/buscaempleo',
  'SENCE - Buscaempleo',
  'Plataforma de intermediación laboral pública',
  'Buscaempleo es el portal de intermediación laboral de SENCE que conecta ofertas y demandas de trabajo. Proporciona datos sobre: vacantes publicadas por sector y región.',
  'Intermediación Pública',
  'government',
  'Chile',
  ARRAY['intermediación laboral', 'OMIL', 'SENCE', 'vacantes', 'colocación'],
  'SENCE',
  '2024-01-01',
  '{"frequency": "continuo", "owner": "SENCE"}'::jsonb
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
  'https://www.injuv.gob.cl/encuesta',
  'INJUV - Encuesta Nacional de Juventudes',
  'Encuesta sobre condiciones y aspiraciones de jóvenes',
  'La Encuesta Nacional de Juventudes del INJUV caracteriza a la población joven chilena (15-29 años). Incluye datos sobre: educación, empleo, participación social.',
  'Juventud',
  'government',
  'Chile',
  ARRAY['juventud', 'INJUV', 'empleo juvenil', 'encuesta', 'jóvenes'],
  'INJUV',
  '2022-01-01',
  '{"frequency": "trienal", "owner": "INJUV", "period": "2003-2022"}'::jsonb
);

-- 34. DUECh
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
  'https://www.memoriachilena.gob.cl/duech',
  'DUECh - Diccionario de Uso del Español',
  'Diccionario académico del español chileno',
  'El Diccionario de Uso del Español de Chile (DUECh) documenta el léxico chileno con definiciones, ejemplos de uso, y contexto histórico.',
  'Lingüística',
  'academic',
  'Chile',
  ARRAY['diccionario', 'español chileno', 'DUECh', 'Academia', 'léxico'],
  'Academia Chilena',
  '2010-01-01',
  '{"frequency": "única", "owner": "Academia Chilena", "year": 2010}'::jsonb
);

-- 35. ASALE
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
  'Diccionario de términos del español americano',
  'El Diccionario de Americanismos de ASALE documenta el léxico de América Latina, incluyendo términos chilenos.',
  'Lingüística',
  'academic',
  'Chile',
  ARRAY['americanismos', 'ASALE', 'RAE', 'diccionario', 'español América'],
  'ASALE/RAE',
  '2010-01-01',
  '{"frequency": "única", "owner": "ASALE/RAE", "year": 2010}'::jsonb
);

-- 36. Roediger
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
  'https://archive.org/details/diccionario-roediger',
  'Roediger - Diccionario Histórico',
  'Diccionario histórico del español chileno de principios del siglo XX',
  'El diccionario histórico de Roediger documenta el español chileno de principios del siglo XX.',
  'Lingüística',
  'academic',
  'Chile',
  ARRAY['diccionario histórico', 'Roediger', 'español chileno', 'siglo XX', 'patrimonio'],
  'Dominio público',
  '1918-01-01',
  '{"frequency": "única", "owner": "Dominio público", "year": 1918}'::jsonb
);

-- 37. Academia Chilena
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
  'https://www.academiachilenalengua.cl/duech-2010',
  'Academia Chilena - DUECh 2010',
  'Diccionario oficial de uso del español de Chile',
  'La edición 2010 del DUECh es la referencia oficial del español chileno. Incluye más de 18,000 entradas con definiciones contextualizadas.',
  'Léxico/Modismos',
  'academic',
  'Chile',
  ARRAY['DUECh', 'Academia Chilena', 'diccionario oficial', 'español chileno', '2010'],
  'Academia Chilena',
  '2010-01-01',
  '{"frequency": "única", "owner": "Academia Chilena", "year": 2010}'::jsonb
);

-- 38. BCentral SI3
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
  'https://www.bcentral.cl/estadisticas',
  'Banco Central - Sistema SI3',
  'Sistema integrado de información estadística económica',
  'El Sistema de Información Estadística (SI3) es la fuente más completa de datos macroeconómicos de Chile.',
  'Estadísticas',
  'government',
  'Chile',
  ARRAY['Banco Central', 'estadísticas', 'macroeconómicas', 'SI3', 'PIB', 'inflación'],
  'Banco Central',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "Banco Central", "period": "1960-presente"}'::jsonb
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
  'https://marcodecualificaciones.mineduc.cl/talleres',
  'Mineduc - MCTP Talleres',
  'Recursos y talleres sobre implementación del MCTP',
  'Materiales de talleres y capacitaciones sobre la implementación del Marco de Cualificaciones.',
  'Formación',
  'government',
  'Chile',
  ARRAY['MCTP', 'talleres', 'capacitación', 'implementación', 'Mineduc'],
  'Mineduc',
  '2024-01-01',
  '{"frequency": "adhoc", "owner": "Mineduc", "period": "2015-presente"}'::jsonb
);

-- 40. INE Desocupación
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
  'https://www.ine.gob.cl/ene-desocupacion',
  'INE - ENE Desocupación',
  'Estadísticas detalladas sobre desempleo',
  'Análisis detallado sobre desocupación en Chile con datos por región, género, edad, nivel educativo.',
  'Mercado laboral',
  'government',
  'Chile',
  ARRAY['desocupación', 'desempleo', 'ENE', 'búsqueda empleo', 'INE'],
  'INE',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "INE", "period": "2010-presente"}'::jsonb
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
  'Centro de Microdatos U. Chile',
  'Centro de investigación en análisis de datos',
  'El Centro de Microdatos realiza investigación aplicada usando bases de datos administrativas y encuestas.',
  'Investigación',
  'academic',
  'Chile',
  ARRAY['investigación', 'microdatos', 'Universidad de Chile', 'evidencia', 'políticas'],
  'U. de Chile',
  '2024-01-01',
  '{"frequency": "trimestral", "owner": "U. de Chile"}'::jsonb
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
  'https://www.sectra.gob.cl/encuestas',
  'SECTRA - Encuesta Origen Destino',
  'Encuesta sobre movilidad urbana',
  'La Encuesta Origen-Destino de SECTRA analiza patrones de movilidad en las principales ciudades chilenas.',
  'Movilidad Urbana',
  'government',
  'Chile',
  ARRAY['movilidad', 'transporte', 'SECTRA', 'origen-destino', 'viajes'],
  'SECTRA',
  '2024-01-01',
  '{"frequency": "multianual", "owner": "SECTRA", "period": "2001-presente"}'::jsonb
);

-- 43. BCN Código
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
  'https://www.bcn.cl/leychile/codigo-trabajo',
  'BCN - Código del Trabajo',
  'Texto actualizado del Código del Trabajo',
  'El portal Ley Chile proporciona acceso al Código del Trabajo actualizado con todas sus modificaciones.',
  'Normativa laboral',
  'government',
  'Chile',
  ARRAY['Código del Trabajo', 'legislación', 'BCN', 'Ley Chile', 'normativa'],
  'BCN',
  '2024-01-01',
  '{"frequency": "continuo", "owner": "BCN"}'::jsonb
);

-- 44. Termómetro
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
  'https://www.subtrab.gob.cl/termometro-laboral',
  'Subsecretaría - Termómetro Laboral',
  'Indicador de condiciones laborales',
  'El Termómetro Laboral Nacional es un indicador sintético que resume múltiples dimensiones del mercado laboral.',
  'Observatorios Laborales',
  'government',
  'Chile',
  ARRAY['termómetro laboral', 'indicador', 'Subsecretaría', 'condiciones', 'monitoreo'],
  'Subsecretaría del Trabajo',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "Subsecretaría", "period": "2020-presente"}'::jsonb
);

-- 45. Observatorio
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
  'https://www.subtrab.gob.cl/observatorio',
  'Observatorio Laboral - Subsecretaría',
  'Portal de datos y análisis del mercado laboral',
  'El Observatorio Laboral centraliza datos y análisis sobre el mercado laboral chileno.',
  'Observatorios Laborales',
  'government',
  'Chile',
  ARRAY['observatorio', 'análisis laboral', 'boletines', 'estudios', 'Subsecretaría'],
  'Subsecretaría del Trabajo',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "Subsecretaría", "period": "2020-presente"}'::jsonb
);

-- 46. Bicentenario UC
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
  'Encuesta sobre valores y opinión pública',
  'La Encuesta Bicentenario de la UC es un estudio anual sobre valores, actitudes políticas y percepción de instituciones.',
  'Opinión Pública',
  'academic',
  'Chile',
  ARRAY['opinión pública', 'valores', 'UC', 'Bicentenario', 'actitudes'],
  'UC',
  '2024-01-01',
  '{"frequency": "anual", "owner": "UC"}'::jsonb
);

-- 47. Memoria Chilena
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
  'https://www.memoriachilena.gob.cl/recursos-linguisticos',
  'Memoria Chilena - Recursos Lingüísticos',
  'Recurso patrimonial sobre el español chileno',
  'Memoria Chilena conserva y difunde recursos sobre el español chileno.',
  'Léxico/Modismos',
  'government',
  'Chile',
  ARRAY['Memoria Chilena', 'patrimonio', 'español chileno', 'historia'],
  'Biblioteca Nacional',
  '2010-01-01',
  '{"frequency": "única", "owner": "Biblioteca Nacional"}'::jsonb
);

-- 48. BCN Portal
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
  'BCN - Portal Ley Chile',
  'Portal de acceso a legislación chilena',
  'Ley Chile es el portal oficial que proporciona acceso gratuito a toda la legislación vigente.',
  'Normativa laboral',
  'government',
  'Chile',
  ARRAY['legislación', 'BCN', 'Ley Chile', 'normativa', 'códigos'],
  'BCN',
  '2024-01-01',
  '{"frequency": "continuo", "owner": "BCN"}'::jsonb
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
  'https://sence.gob.cl/observatorios-regionales',
  'SENCE - Observatorios Regionales',
  'Red de observatorios regionales sobre mercado laboral',
  'La Red de Observatorios Laborales de SENCE integra observatorios regionales.',
  'Observatorios Laborales',
  'government',
  'Chile',
  ARRAY['observatorios', 'SENCE', 'regional', 'mercado laboral', 'territorios'],
  'SENCE',
  '2024-01-01',
  '{"frequency": "mensual", "owner": "SENCE", "period": "2020-presente"}'::jsonb
);

-- 50. Bicentenario Series
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
  'https://encuestabicentenario.uc.cl/series-historicas',
  'UC - Bicentenario Series Históricas',
  'Series históricas de la Encuesta Bicentenario',
  'Las series históricas de la Encuesta Bicentenario (2006-2024) permiten análisis longitudinal.',
  'Opinión Pública',
  'academic',
  'Chile',
  ARRAY['series históricas', 'tendencias', 'UC', 'Bicentenario', 'longitudinal'],
  'UC',
  '2024-01-01',
  '{"frequency": "anual", "owner": "UC", "period": "2006-2024"}'::jsonb
);

-- Verificar inserción
SELECT 
  'Total recursos insertados: ' || COUNT(*) as total,
  'Categorías únicas: ' || COUNT(DISTINCT category) as categorias
FROM web_resources 
WHERE country = 'Chile';

-- Mostrar resumen por categoría
SELECT 
  category,
  COUNT(*) as cantidad
FROM web_resources 
WHERE country = 'Chile'
GROUP BY category
ORDER BY cantidad DESC;
