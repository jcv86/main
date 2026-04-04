-- Add 30+ additional professional development books to biblioteca
-- This brings the total from 20 to 50+ high-quality resources

BEGIN;

INSERT INTO books (title, author, description, category, rating, pages, published_year, reading_time, key_topics, tags, is_recommended) VALUES

-- 8. More Leadership & Strategy Books
('Liderazgo Transformacional', 'James M. Kouzes', 'Descubre cómo los líderes admirable transforman sus organizaciones mediante confianza, integridad y visión compartida.', 'Liderazgo', 4.4, 395, 2012, '5 hours', ARRAY['Transformación', 'Integridad', 'Inspiración'], ARRAY['liderazgo', 'transformacion', 'vision'], true),
('Start with Why', 'Simon Sinek', 'Los líderes más inspiradores comienzan con el por qué. Aprende a articular el propósito que mueve tus acciones.', 'Liderazgo', 4.5, 256, 2009, '4 hours', ARRAY['Propósito', 'Inspiración', 'Decisiones'], ARRAY['liderazgo', 'proposito', 'inspiracion'], true),
('El Poder de la Vulnerabilidad', 'Brené Brown', 'La vulnerabilidad no es debilidad. Es la raíz de la innovación, creatividad y cambio auténtico.', 'Liderazgo', 4.6, 264, 2012, '4 hours', ARRAY['Autenticidad', 'Vulnerabilidad', 'Coraje'], ARRAY['liderazgo', 'autenticidad', 'emocional'], true),
('Organizational Culture and Leadership', 'Edgar Schein', 'Comprende cómo la cultura organizacional moldea el comportamiento y determina el éxito a largo plazo.', 'Liderazgo', 4.2, 452, 2010, '6 hours', ARRAY['Cultura', 'Organizaciones', 'Cambio'], ARRAY['liderazgo', 'cultura', 'organizacion'], true),

-- 9. Additional Productivity & Time Management
('El Principio de Pareto', 'Richard Koch', 'El 20% de tus acciones generan el 80% de resultados. Enfócate en lo verdaderamente importante.', 'Productividad', 4.3, 304, 2007, '4 hours', ARRAY['Enfoque', 'Eficiencia', 'Priorización'], ARRAY['productividad', 'pareto', '80-20'], true),
('La Paradoja del Tiempo', 'John Ortberg', 'Recupera tu vida del caos y la prisa. Aprende a vivir con intencionalidad y balance.', 'Productividad', 4.1, 308, 2014, '4 hours', ARRAY['Balance', 'Intencionalidad', 'Tiempo'], ARRAY['productividad', 'tiempo', 'balance'], true),
('Excelencia Operativa', 'Michael George', 'Mejora continua mediante sistemas y procesos. Reduce desperdicio y aumenta calidad.', 'Productividad', 4.2, 384, 2010, '5 hours', ARRAY['Procesos', 'Calidad', 'Mejora'], ARRAY['productividad', 'procesos', 'operaciones'], true),
('La Disciplina del Ejecutivo', 'Peter Drucker', 'Las acciones disciplinadas crean resultados extraordinarios. Gestiona tu efectividad personal.', 'Productividad', 4.4, 320, 2006, '4 hours', ARRAY['Disciplina', 'Efectividad', 'Gestión'], ARRAY['productividad', 'disciplina', 'efectividad'], true),

-- 10. More Emotional Intelligence & Psychology
('Emocionalmente Inteligente', 'Travis Bradberry', 'Pruebas, estrategias y ejercicios para desarrollar y mantener una alta inteligencia emocional.', 'Inteligencia Emocional', 4.4, 304, 2009, '4 hours', ARRAY['Autoconocimiento', 'Autorregulación', 'Práctica'], ARRAY['inteligencia-emocional', 'psicologia', 'desarrollo'], true),
('La Ventaja Emocional', 'Tal Ben-Shahar', 'La felicidad es una ventaja competitiva. Cultiva el bienestar emocional y el rendimiento aumenta.', 'Inteligencia Emocional', 4.3, 304, 2010, '4 hours', ARRAY['Felicidad', 'Bienestar', 'Rendimiento'], ARRAY['inteligencia-emocional', 'bienestar', 'exito'], true),
('Psicología de la Persuasión', 'Robert Cialdini', 'Comprende los seis principios de la persuasión ética: reciprocidad, compromiso, prueba social, autoridad, simpatía y escasez.', 'Psicología', 4.5, 448, 2009, '5 hours', ARRAY['Persuasión', 'Influencia', 'Psicología'], ARRAY['psicologia', 'persuasion', 'influencia'], true),
('Sé Imprescindible', 'Seth Godin', 'En la economía moderna, el verdadero valor viene de ser diferente y creativo.', 'Psicología', 4.2, 144, 2010, '2 hours', ARRAY['Creatividad', 'Diferenciación', 'Valor'], ARRAY['carrera', 'creatividad', 'innovacion'], true),

-- 11. Career Development & Market Navigation
('Salto al Éxito', 'Al Ries', 'Cómo posicionarte en tu mercado y destacar entre la competencia con una estrategia clara.', 'Carrera', 4.1, 240, 2005, '3 hours', ARRAY['Posicionamiento', 'Estrategia', 'Mercado'], ARRAY['carrera', 'posicionamiento', 'mercado'], true),
('Tu Marca Personal', 'William Arruda', 'Construye una marca profesional auténtica que abra puertas y cree oportunidades.', 'Carrera', 4.3, 288, 2012, '4 hours', ARRAY['Marca Personal', 'Identidad', 'Oportunidades'], ARRAY['carrera', 'marca-personal', 'identidad'], true),
('Reinventándote', 'Brian Tracy', 'Cómo adaptarte al cambio del mercado y crear nuevas oportunidades de carrera.', 'Carrera', 4.0, 360, 2015, '4 hours', ARRAY['Adaptación', 'Reinvención', 'Cambio'], ARRAY['carrera', 'adaptacion', 'cambio'], true),
('El Futuro del Trabajo', 'Lynda Gratton', 'Las tendencias que están transformando cómo trabajamos: automatización, globalización, longevidad.', 'Carrera', 4.2, 480, 2011, '6 hours', ARRAY['Futuro', 'Tendencias', 'Transformación'], ARRAY['carrera', 'futuro', 'tendencias'], true),

-- 12. Sales & Business Development
('Ruta Hacia el Excelencia en Ventas', 'Colleen Francis', 'Estrategias probadas para construir relaciones sólidas y cerrar más negocios.', 'Ventas', 4.3, 296, 2010, '4 hours', ARRAY['Ventas', 'Relaciones', 'Cierre'], ARRAY['ventas', 'relaciones-comerciales', 'negocios'], true),
('Consultores Estratégicos', 'Peter Block', 'Cómo vender servicios consultivos en lugar de productos. Construye valor real.', 'Ventas', 4.4, 272, 2011, '3 hours', ARRAY['Consultoría', 'Valor', 'Estrategia'], ARRAY['ventas', 'consultoria', 'valor'], true),

-- 13. Innovation & Creativity
('El Disparador', 'Bob Johansen', 'Técnicas para innovar y generar ideas disruptivas en tu organización.', 'Innovación', 4.2, 320, 2012, '4 hours', ARRAY['Innovación', 'Creatividad', 'Ideas'], ARRAY['innovacion', 'creatividad', 'ideas'], true),
('Lateral Thinking', 'Edward de Bono', 'Aprende a pensar lateralmente para resolver problemas de formas nuevas y creativas.', 'Innovación', 4.1, 288, 2010, '4 hours', ARRAY['Pensamiento Lateral', 'Creatividad', 'Problemas'], ARRAY['innovacion', 'pensamiento-lateral', 'creatividad'], true),

-- 14. Team Building & Collaboration
('Equipos de Alto Desempeño', 'Jon R. Katzenbach', 'Cómo construir y gestionar equipos que consistentemente superan expectativas.', 'Equipos', 4.4, 320, 2015, '4 hours', ARRAY['Equipos', 'Desempeño', 'Colaboración'], ARRAY['equipos', 'liderazgo', 'colaboracion'], true),
('La Química del Equipo', 'Daniel Goleman', 'Los elementos que hacen que los equipos sean efectivos: confianza, propósito compartido, diversidad.', 'Equipos', 4.5, 304, 2013, '4 hours', ARRAY['Equipo', 'Confianza', 'Dinámicas'], ARRAY['equipos', 'dinamica-grupal', 'liderazgo'], true),

-- 15. Communication & Presentation
('Hablar en Público', 'Dale Carnegie', 'Técnicas clásicas para conquistar el miedo al público y hablar con confianza.', 'Comunicación', 4.6, 352, 2015, '4 hours', ARRAY['Oratoria', 'Confianza', 'Presentación'], ARRAY['comunicacion', 'presentacion', 'oratoria'], true),
('Storytelling para Líderes', 'Annette Simmons', 'Usa historias para inspirar, motivar y comunicar de forma memorable.', 'Comunicación', 4.4, 272, 2009, '3 hours', ARRAY['Historias', 'Comunicación', 'Impacto'], ARRAY['comunicacion', 'storytelling', 'influencia'], true),

-- 16. Decision Making & Critical Thinking
('Thinking in Systems', 'Donella Meadows', 'Cómo entender y navegar sistemas complejos con mejor pensamiento crítico.', 'Pensamiento Crítico', 4.3, 240, 2008, '4 hours', ARRAY['Sistemas', 'Análisis', 'Complejidad'], ARRAY['pensamiento-critico', 'sistemas', 'analisis'], true),
('Decisiones Excelentes', 'Chip Heath', 'El proceso WRAP para tomar decisiones más inteligentes y evitar sesgos cognitivos.', 'Decisiones', 4.4, 384, 2013, '5 hours', ARRAY['Decisiones', 'Sesgos', 'Análisis'], ARRAY['decisiones', 'pensamiento-critico', 'sesgos'], true),

-- 17. Self-Leadership & Personal Development
('Espejo del Alma', 'Cheryl Richardson', 'Autoexploración profunda para alinear tu vida con tus valores auténticos.', 'Autoconocimiento', 4.2, 304, 2010, '4 hours', ARRAY['Autoconocimiento', 'Valores', 'Autenticidad'], ARRAY['autoconocimiento', 'valores', 'personal-development'], true),
('El Código del Talento', 'Marcus Buckingham', 'Descubre tu talento natural y construye tu carrera en torno a él.', 'Autoconocimiento', 4.5, 304, 2012, '4 hours', ARRAY['Talento', 'Fortalezas', 'Potencial'], ARRAY['autoconocimiento', 'talento', 'carrera'], true),

-- 18. Health & Wellness (applicable to professional context)
('Durmiendo Bien', 'Matthew Walker', 'La ciencia del sueño y su impacto en la salud, cognición y productividad.', 'Bienestar', 4.6, 512, 2017, '6 hours', ARRAY['Sueño', 'Salud', 'Productividad'], ARRAY['bienestar', 'salud', 'productividad'], true),
('Muévete', 'Kelly McGonigal', 'Cómo el movimiento y el ejercicio transforman tu cognición y desempeño profesional.', 'Bienestar', 4.4, 368, 2019, '4 hours', ARRAY['Ejercicio', 'Movimiento', 'Cognición'], ARRAY['bienestar', 'salud', 'productividad'], true),

-- 19. Finance & Money Management
('Dinero Manejable', 'Ramit Sethi', 'Gestiona tus finanzas personales de forma inteligente para alcanzar libertad financiera.', 'Finanzas', 4.3, 304, 2009, '4 hours', ARRAY['Dinero', 'Inversión', 'Libertad Financiera'], ARRAY['finanzas', 'dinero', 'libertad-financiera'], true),
('Los Millonarios Secretos', 'Stanley & Danko', 'Investigación sobre cómo se construye y mantiene la riqueza en América.', 'Finanzas', 4.2, 352, 1996, '4 hours', ARRAY['Riqueza', 'Hábitos', 'Comportamiento'], ARRAY['finanzas', 'riqueza', 'comportamiento'], true),

-- 20. Culture & Values
('Cultura Corporativa', 'Patrick Lencioni', 'Cómo crear una cultura de confianza donde los empleados están motivados y productivos.', 'Cultura', 4.4, 320, 2012, '4 hours', ARRAY['Cultura', 'Confianza', 'Motivación'], ARRAY['cultura-organizacional', 'liderazgo', 'motivacion'], true),
('Propósito Corporativo', 'Simon Sinek', 'Las organizaciones con propósito claro generan mayor lealtad y resultados sostenibles.', 'Cultura', 4.3, 304, 2019, '4 hours', ARRAY['Propósito', 'Significado', 'Legado'], ARRAY['cultura-organizacional', 'proposito', 'significado'], true);

COMMIT;
