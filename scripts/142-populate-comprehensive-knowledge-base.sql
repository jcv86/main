-- Comprehensive Knowledge Base Population
-- Adding 100+ professional development books to the platform brain

-- Clear existing knowledge base to avoid duplicates
DELETE FROM knowledge_base;

-- Reset the sequence
ALTER SEQUENCE knowledge_base_id_seq RESTART WITH 1;

-- Insert comprehensive book collection into knowledge base
INSERT INTO knowledge_base (title, category, content, author, tags, slug, read_count) VALUES

-- CAREER DEVELOPMENT & LIFE DESIGN
('Designing Your Life', 'Desarrollo de Carrera', 'Una guía práctica para aplicar el pensamiento de diseño a tu carrera y vida. Los autores, profesores de Stanford, presentan un enfoque sistemático para crear una vida profesional significativa y satisfactoria, utilizando herramientas de design thinking para explorar múltiples opciones de carrera.', 'Bill Burnett & Dave Evans', ARRAY['carrera', 'diseño', 'vida', 'propósito'], 'designing-your-life', 0),

('Drive', 'Motivación', 'Explora la ciencia de la motivación humana, demostrando que los motivadores tradicionales (recompensas y castigos) son menos efectivos que la autonomía, maestría y propósito. Essential para entender qué realmente impulsa el rendimiento y la satisfacción en el trabajo.', 'Daniel H. Pink', ARRAY['motivación', 'psicología', 'rendimiento', 'autonomía'], 'drive', 0),

('Grit', 'Desarrollo Personal', 'Investiga el poder de la pasión y la perseverancia para el éxito a largo plazo. Duckworth demuestra que el talento no es suficiente; la combinación de pasión y persistencia hacia objetivos a largo plazo es más predictiva del éxito que el talento natural.', 'Angela Duckworth', ARRAY['perseverancia', 'éxito', 'psicología', 'talento'], 'grit', 0),

('Mindset', 'Psicología', 'Presenta la diferencia entre mentalidad fija y mentalidad de crecimiento. Dweck muestra cómo nuestras creencias sobre nuestras habilidades afectan profundamente nuestro éxito, y cómo adoptar una mentalidad de crecimiento puede transformar nuestra carrera y vida.', 'Carol S. Dweck', ARRAY['mentalidad', 'crecimiento', 'aprendizaje', 'éxito'], 'mindset', 0),

('Peak', 'Aprendizaje', 'Revela los secretos de la práctica deliberada y cómo cualquiera puede mejorar en cualquier habilidad. Ericsson desmitifica el concepto de talento natural y proporciona un marco científico para el desarrollo de la expertise.', 'Anders Ericsson & Robert Pool', ARRAY['práctica', 'expertise', 'habilidades', 'mejora'], 'peak', 0),

('So Good They Cannot Ignore You', 'Desarrollo de Carrera', 'Desafía el consejo común de "sigue tu pasión" y argumenta que la pasión viene después de desarrollar habilidades valiosas. Newport presenta el concepto de "capital de carrera" y cómo construir una carrera extraordinaria.', 'Cal Newport', ARRAY['carrera', 'pasión', 'habilidades', 'capital'], 'so-good-they-cant-ignore-you', 0),

('The 2-Hour Job Search', 'Búsqueda de Empleo', 'Un sistema eficiente y sistemático para la búsqueda de empleo que reduce el tiempo necesario mientras aumenta la efectividad. Dalton proporciona estrategias prácticas para networking, investigación de empresas y preparación de entrevistas.', 'Steve Dalton', ARRAY['empleo', 'búsqueda', 'networking', 'entrevistas'], 'the-2-hour-job-search', 0),

('The First 90 Days', 'Transiciones', 'Guía esencial para líderes en transición, proporcionando estrategias para acelerar el aprendizaje, construir credibilidad y lograr resultados rápidos en nuevos roles. Fundamental para cualquier cambio de posición o empresa.', 'Michael D. Watkins', ARRAY['transición', 'liderazgo', 'nuevos-roles', 'credibilidad'], 'the-first-90-days', 0),

('What Color Is Your Parachute', 'Orientación Profesional', 'El clásico manual de búsqueda de empleo y cambio de carrera, actualizado anualmente. Bolles proporciona ejercicios de autoconocimiento, estrategias de búsqueda de empleo y herramientas para identificar la carrera ideal.', 'Richard N. Bolles', ARRAY['carrera', 'autoconocimiento', 'empleo', 'orientación'], 'what-color-is-your-parachute', 0),

-- PRODUCTIVITY & HABITS
('Atomic Habits', 'Productividad', 'Un enfoque sistemático para formar buenos hábitos y romper los malos. Clear presenta el concepto de mejoras del 1% y cómo los pequeños cambios pueden llevar a resultados extraordinarios a través del poder del interés compuesto en los hábitos.', 'James Clear', ARRAY['hábitos', 'productividad', 'cambio', 'sistemas'], 'atomic-habits', 0),

('Deep Work', 'Productividad', 'Argumenta que la capacidad de concentrarse sin distracción en tareas cognitivamente demandantes es cada vez más valiosa en nuestra economía. Newport proporciona estrategias para cultivar esta habilidad y producir trabajo de alta calidad.', 'Cal Newport', ARRAY['concentración', 'productividad', 'trabajo-profundo', 'distracción'], 'deep-work', 0),

('Eat That Frog', 'Gestión del Tiempo', 'Presenta 21 técnicas para superar la procrastinación y hacer más cosas importantes en menos tiempo. Tracy enfatiza la importancia de abordar primero las tareas más importantes y desafiantes del día.', 'Brian Tracy', ARRAY['procrastinación', 'tiempo', 'prioridades', 'productividad'], 'eat-that-frog', 0),

('Essentialism', 'Productividad', 'La disciplina de hacer menos pero mejor. McKeown presenta un enfoque sistemático para identificar lo verdaderamente esencial y eliminar todo lo demás, permitiendo contribuciones más significativas en las áreas que realmente importan.', 'Greg McKeown', ARRAY['esencialismo', 'prioridades', 'enfoque', 'simplicidad'], 'essentialism', 0),

('Getting Things Done', 'Productividad', 'Un sistema completo de gestión de tareas y proyectos que promete liberar la mente del estrés de recordar todo. Allen presenta metodologías para capturar, clarificar, organizar y revisar todas las responsabilidades de la vida.', 'David Allen', ARRAY['gtd', 'organización', 'tareas', 'sistema'], 'getting-things-done', 0),

('Make Time', 'Gestión del Tiempo', 'Estrategias para crear tiempo para lo que importa en un mundo lleno de distracciones. Los autores de Google Ventures presentan un marco de cuatro pasos para diseñar tu día y enfocarte en tus prioridades.', 'Jake Knapp & John Zeratsky', ARRAY['tiempo', 'enfoque', 'prioridades', 'diseño'], 'make-time', 0),

('The One Thing', 'Productividad', 'Presenta el concepto de que el éxito extraordinario viene de enfocarse en una cosa a la vez. Keller y Papasan proporcionan estrategias para identificar la actividad más importante que hará que todo lo demás sea más fácil o innecesario.', 'Gary Keller & Jay Papasan', ARRAY['enfoque', 'prioridades', 'éxito', 'simplicidad'], 'the-one-thing', 0),

('The Power of Habit', 'Hábitos', 'Explora la ciencia detrás de por qué existen los hábitos y cómo pueden cambiarse. Duhigg presenta el "bucle del hábito" y estrategias para transformar hábitos individuales, organizacionales y sociales.', 'Charles Duhigg', ARRAY['hábitos', 'neurociencia', 'cambio', 'comportamiento'], 'the-power-of-habit', 0),

('Tiny Habits', 'Cambio de Comportamiento', 'Un método científico para crear hábitos duraderos comenzando con cambios muy pequeños. Fogg, investigador de Stanford, presenta su modelo de comportamiento y cómo diseñar hábitos que se mantengan automáticamente.', 'BJ Fogg', ARRAY['hábitos', 'comportamiento', 'cambio', 'diseño'], 'tiny-habits', 0),

('Ultralearning', 'Aprendizaje', 'Estrategias para el aprendizaje autodirigido intensivo y efectivo. Young presenta principios y técnicas para dominar habilidades difíciles rápidamente, basándose en casos de estudio de ultraaprendices exitosos.', 'Scott Young', ARRAY['aprendizaje', 'autodidacta', 'habilidades', 'maestría'], 'ultralearning', 0),

-- COMMUNICATION & WRITING
('HBR Guide to Better Business Writing', 'Comunicación', 'Guía práctica para mejorar la escritura empresarial, desde emails hasta informes complejos. Garner proporciona técnicas para escribir con claridad, concisión y persuasión en contextos profesionales.', 'Bryan A. Garner', ARRAY['escritura', 'comunicación', 'negocios', 'claridad'], 'hbr-guide-better-business-writing', 0),

('Made to Stick', 'Comunicación', 'Explora por qué algunas ideas sobreviven y otras mueren, presentando el modelo SUCCESS para crear mensajes memorables. Los Heath identifican los principios que hacen que las ideas sean pegajosas y fáciles de recordar.', 'Chip Heath & Dan Heath', ARRAY['comunicación', 'ideas', 'memorable', 'persuasión'], 'made-to-stick', 0),

('On Writing Well', 'Escritura', 'Considerado uno de los mejores libros sobre escritura no ficción. Zinsser enfatiza la importancia de la simplicidad, claridad y humanidad en la escritura, proporcionando principios atemporales para comunicarse efectivamente.', 'William Zinsser', ARRAY['escritura', 'claridad', 'no-ficción', 'estilo'], 'on-writing-well', 0),

('Presentation Zen', 'Presentaciones', 'Revoluciona el enfoque tradicional de las presentaciones empresariales, enfatizando la simplicidad, el storytelling visual y la conexión auténtica con la audiencia. Reynolds combina principios de diseño zen con técnicas de presentación efectivas.', 'Garr Reynolds', ARRAY['presentaciones', 'diseño', 'storytelling', 'simplicidad'], 'presentation-zen', 0),

('Resonate', 'Presentaciones', 'Enseña cómo crear presentaciones que muevan a las audiencias a la acción. Duarte analiza las presentaciones más persuasivas de la historia y extrae principios para crear mensajes que resuenen profundamente con las audiencias.', 'Nancy Duarte', ARRAY['presentaciones', 'persuasión', 'audiencia', 'acción'], 'resonate', 0),

('Talk Like TED', 'Presentaciones', 'Analiza las charlas TED más populares para identificar los secretos de las presentaciones extraordinarias. Gallo presenta nueve técnicas utilizadas por los mejores oradores del mundo para inspirar y persuadir.', 'Carmine Gallo', ARRAY['presentaciones', 'ted', 'oratoria', 'inspiración'], 'talk-like-ted', 0),

('The Elements of Style', 'Escritura', 'El manual clásico de escritura en inglés que enfatiza la brevedad, claridad y elegancia. Strunk y White proporcionan reglas fundamentales de uso, principios de composición y enfoques de estilo que han influido generaciones de escritores.', 'William Strunk Jr. & E. B. White', ARRAY['escritura', 'estilo', 'gramática', 'claridad'], 'elements-of-style', 0),

('The Pyramid Principle', 'Comunicación Estructurada', 'Metodología para estructurar el pensamiento y la comunicación de manera lógica y persuasiva. Minto presenta técnicas para organizar ideas en una estructura piramidal que facilita la comprensión y retención.', 'Barbara Minto', ARRAY['estructura', 'lógica', 'comunicación', 'pensamiento'], 'pyramid-principle', 0),

('The Sense of Style', 'Escritura', 'Una guía moderna para escribir bien en el siglo XXI. Pinker combina la ciencia cognitiva con consejos prácticos de escritura, actualizando los principios clásicos de estilo para la era digital.', 'Steven Pinker', ARRAY['escritura', 'estilo', 'ciencia-cognitiva', 'modernidad'], 'sense-of-style', 0),

('Writing That Works', 'Escritura Empresarial', 'Guía práctica para la escritura empresarial efectiva, cubriendo desde emails hasta propuestas complejas. Roman y Raphaelson proporcionan técnicas probadas para comunicarse claramente en contextos profesionales.', 'Kenneth Roman & Joel Raphaelson', ARRAY['escritura', 'negocios', 'comunicación', 'efectividad'], 'writing-that-works', 0),

-- NEGOTIATION & INFLUENCE
('Crucial Conversations', 'Comunicación', 'Herramientas para hablar cuando las apuestas son altas. Los autores proporcionan técnicas para manejar conversaciones difíciles, crear seguridad psicológica y lograr resultados mutuamente beneficiosos en situaciones de alta tensión.', 'Kerry Patterson, Joseph Grenny, Ron McMillan & Al Switzler', ARRAY['conversaciones', 'conflicto', 'comunicación', 'resultados'], 'crucial-conversations', 0),

('Getting to Yes', 'Negociación', 'El método clásico de negociación basada en principios. Fisher y Ury presentan un enfoque para llegar a acuerdos mutuamente beneficiosos sin ceder, enfocándose en intereses en lugar de posiciones.', 'Roger Fisher, William Ury & Bruce Patton', ARRAY['negociación', 'principios', 'acuerdos', 'intereses'], 'getting-to-yes', 0),

('Give and Take', 'Reciprocidad', 'Explora cómo los estilos de reciprocidad (dar, tomar, intercambiar) afectan el éxito. Grant demuestra que los "dadores" pueden ser tanto los más exitosos como los menos exitosos, y proporciona estrategias para dar de manera inteligente.', 'Adam Grant', ARRAY['reciprocidad', 'dar', 'éxito', 'relaciones'], 'give-and-take', 0),

('How to Win Friends and Influence People', 'Relaciones Interpersonales', 'El clásico atemporal sobre relaciones humanas y influencia. Carnegie presenta principios fundamentales para manejar personas, ganar amigos y influir en otros de manera ética y efectiva.', 'Dale Carnegie', ARRAY['relaciones', 'influencia', 'amistad', 'personas'], 'how-to-win-friends', 0),

('Influence', 'Psicología de la Persuasión', 'Explora los seis principios universales de la influencia: reciprocidad, compromiso/consistencia, prueba social, autoridad, simpatía y escasez. Cialdini proporciona insights científicos sobre por qué las personas dicen "sí" y cómo aplicar estos principios éticamente.', 'Robert B. Cialdini', ARRAY['influencia', 'persuasión', 'psicología', 'principios'], 'influence', 0),

('Never Eat Alone', 'Networking', 'Estrategias para construir una red de relaciones poderosa y auténtica. Ferrazzi presenta técnicas para conectar con otros de manera genuina, crear valor mutuo y mantener relaciones a largo plazo que beneficien a todas las partes.', 'Keith Ferrazzi & Tahl Raz', ARRAY['networking', 'relaciones', 'conexiones', 'valor'], 'never-eat-alone', 0),

('Never Split the Difference', 'Negociación', 'Técnicas de negociación del FBI aplicadas a la vida empresarial y personal. Voss, ex negociador de rehenes, presenta estrategias de negociación emocional que van más allá de la lógica tradicional.', 'Chris Voss & Tahl Raz', ARRAY['negociación', 'fbi', 'emocional', 'técnicas'], 'never-split-difference', 0),

('Pre-Suasion', 'Influencia', 'Explora el arte de la influencia antes de intentar persuadir. Cialdini revela cómo preparar el terreno para la persuasión, enfocándose en los momentos privilegiados antes de entregar un mensaje.', 'Robert B. Cialdini', ARRAY['pre-suasión', 'influencia', 'preparación', 'momentos'], 'pre-suasion', 0),

('The Charisma Myth', 'Carisma', 'Desmitifica el carisma y presenta técnicas prácticas para desarrollarlo. Cabane demuestra que el carisma no es un don innato sino un conjunto de comportamientos que pueden aprenderse y perfeccionarse.', 'Olivia Fox Cabane', ARRAY['carisma', 'presencia', 'comportamiento', 'desarrollo'], 'charisma-myth', 0),

('The Like Switch', 'Relaciones', 'Técnicas del FBI para generar simpatía y construir relaciones. Schafer presenta el modelo de amistad y estrategias para hacer que otros se sientan cómodos y conectados, basándose en su experiencia como agente del FBI.', 'Jack Schafer & Marvin Karlins', ARRAY['simpatía', 'fbi', 'relaciones', 'conexión'], 'like-switch', 0),

-- LEADERSHIP & MANAGEMENT
('Extreme Ownership', 'Liderazgo', 'Principios de liderazgo de los Navy SEALs aplicados al mundo empresarial. Willink y Babin presentan el concepto de responsabilidad extrema y cómo los líderes deben asumir la responsabilidad total de sus equipos y resultados.', 'Jocko Willink & Leif Babin', ARRAY['liderazgo', 'responsabilidad', 'navy-seals', 'equipos'], 'extreme-ownership', 0),

('High Output Management', 'Gestión', 'Principios fundamentales de gestión del ex-CEO de Intel. Grove presenta conceptos como gestión por objetivos, reuniones efectivas y cómo maximizar la productividad de los equipos de conocimiento.', 'Andrew S. Grove', ARRAY['gestión', 'productividad', 'objetivos', 'intel'], 'high-output-management', 0),

('Leaders Eat Last', 'Liderazgo', 'Explora por qué algunos equipos se unen y otros no. Sinek presenta el concepto del "círculo de seguridad" y cómo los grandes líderes crean ambientes donde las personas se sienten seguras y motivadas a dar lo mejor de sí.', 'Simon Sinek', ARRAY['liderazgo', 'seguridad', 'equipos', 'motivación'], 'leaders-eat-last', 0),

('Multipliers', 'Liderazgo', 'Distingue entre líderes que amplifican la inteligencia de otros (Multiplicadores) y aquellos que la disminuyen (Diminuidores). Wiseman presenta cinco disciplinas de los Multiplicadores y cómo desarrollar estas capacidades.', 'Liz Wiseman', ARRAY['liderazgo', 'inteligencia', 'multiplicadores', 'equipos'], 'multipliers', 0),

('Radical Candor', 'Gestión', 'Un enfoque para ser un mejor jefe a través del cuidado personal y el desafío directo. Scott presenta un marco para dar feedback efectivo que ayude a las personas a crecer mientras mantiene relaciones sólidas.', 'Kim Scott', ARRAY['feedback', 'gestión', 'cuidado', 'desafío'], 'radical-candor', 0),

('Team of Teams', 'Liderazgo Organizacional', 'Cómo las organizaciones pueden adaptarse y prosperar en un mundo complejo e impredecible. McChrystal presenta lecciones del ejército estadounidense sobre cómo crear organizaciones ágiles y adaptables.', 'Stanley McChrystal', ARRAY['organizaciones', 'adaptabilidad', 'complejidad', 'agilidad'], 'team-of-teams', 0),

('The Culture Code', 'Cultura Organizacional', 'Explora los secretos de los grupos altamente exitosos. Coyle identifica tres habilidades clave que generan cultura: construir seguridad, compartir vulnerabilidad y establecer propósito, con ejemplos de organizaciones exitosas.', 'Daniel Coyle', ARRAY['cultura', 'grupos', 'seguridad', 'propósito'], 'culture-code', 0),

('The Effective Executive', 'Efectividad Ejecutiva', 'Los hábitos fundamentales de los ejecutivos efectivos. Drucker presenta cinco prácticas esenciales: gestión del tiempo, enfoque en contribución, construcción sobre fortalezas, prioridades efectivas y toma de decisiones efectiva.', 'Peter F. Drucker', ARRAY['ejecutivos', 'efectividad', 'hábitos', 'drucker'], 'effective-executive', 0),

('The Five Dysfunctions of a Team', 'Trabajo en Equipo', 'Un modelo para construir equipos cohesivos. Lencioni identifica cinco disfunciones que impiden el trabajo en equipo efectivo: ausencia de confianza, miedo al conflicto, falta de compromiso, evitación de responsabilidad y falta de atención a los resultados.', 'Patrick Lencioni', ARRAY['equipos', 'disfunciones', 'confianza', 'resultados'], 'five-dysfunctions-team', 0),

('Turn the Ship Around', 'Liderazgo', 'Cómo crear líderes en todos los niveles de la organización. Marquet presenta el modelo "líder-líder" en lugar del tradicional "líder-seguidor", basándose en su experiencia transformando un submarino nuclear de bajo rendimiento.', 'L. David Marquet', ARRAY['liderazgo', 'empoderamiento', 'submarino', 'transformación'], 'turn-ship-around', 0),

-- STRATEGY & BUSINESS
('Blue Ocean Strategy', 'Estrategia', 'Cómo crear espacios de mercado sin competencia y hacer que la competencia sea irrelevante. Kim y Mauborgne presentan herramientas y marcos para identificar y capturar océanos azules de oportunidad no disputada.', 'W. Chan Kim & Renée Mauborgne', ARRAY['estrategia', 'océano-azul', 'competencia', 'innovación'], 'blue-ocean-strategy', 0),

('Execution', 'Ejecución', 'La disciplina de hacer que las cosas sucedan. Bossidy y Charan argumentan que la ejecución es la mayor deficiencia en los negocios hoy en día y presentan un sistema para cerrar la brecha entre estrategia y resultados.', 'Larry Bossidy & Ram Charan', ARRAY['ejecución', 'estrategia', 'resultados', 'disciplina'], 'execution', 0),

('Good to Great', 'Excelencia Empresarial', 'Qué hace que algunas empresas den el salto de buenas a grandiosas. Collins identifica los factores que distinguen a las empresas grandiosas: liderazgo de Nivel 5, primero quién luego qué, confrontar los hechos brutales, y el concepto del erizo.', 'Jim Collins', ARRAY['excelencia', 'liderazgo', 'transformación', 'empresas'], 'good-to-great', 0),

('Measure What Matters', 'OKRs', 'El sistema de objetivos y resultados clave (OKRs) que impulsa el crecimiento exponencial. Doerr presenta cómo las OKRs han ayudado a empresas como Google e Intel a lograr un crecimiento extraordinario a través del enfoque y la alineación.', 'John Doerr', ARRAY['okrs', 'objetivos', 'medición', 'crecimiento'], 'measure-what-matters', 0),

('Playing to Win', 'Estrategia', 'Un marco práctico para la estrategia empresarial. Lafley y Martin presentan cinco preguntas esenciales que toda estrategia debe responder y cómo crear estrategias ganadoras que generen ventaja competitiva sostenible.', 'A.G. Lafley & Roger L. Martin', ARRAY['estrategia', 'competencia', 'ventaja', 'ganar'], 'playing-to-win', 0),

('The Balanced Scorecard', 'Medición de Rendimiento', 'Un sistema revolucionario para medir y gestionar el rendimiento organizacional. Kaplan y Norton presentan un enfoque equilibrado que va más allá de las métricas financieras para incluir perspectivas de clientes, procesos internos y aprendizaje.', 'Robert S. Kaplan & David P. Norton', ARRAY['balanced-scorecard', 'medición', 'rendimiento', 'perspectivas'], 'balanced-scorecard', 0),

('The Goal', 'Teoría de Restricciones', 'Una novela empresarial que presenta la Teoría de Restricciones. Goldratt demuestra cómo identificar y gestionar las restricciones del sistema para mejorar dramáticamente el rendimiento organizacional.', 'Eliyahu M. Goldratt', ARRAY['restricciones', 'sistemas', 'optimización', 'rendimiento'], 'the-goal', 0),

('The Innovator''s Dilemma', 'Innovación', 'Por qué las empresas exitosas fallan cuando enfrentan innovación disruptiva. Christensen explora cómo las tecnologías disruptivas pueden derrocar a líderes establecidos y presenta estrategias para navegar la innovación.', 'Clayton M. Christensen', ARRAY['innovación', 'disrupción', 'tecnología', 'empresas'], 'innovators-dilemma', 0),

('Working Backwards', 'Cultura Amazon', 'Los principios y prácticas que impulsaron el éxito de Amazon. Bryar y Carr, ex ejecutivos de Amazon, revelan los procesos internos, principios de liderazgo y mecanismos que hicieron de Amazon una de las empresas más exitosas del mundo.', 'Colin Bryar & Bill Carr', ARRAY['amazon', 'principios', 'procesos', 'éxito'], 'working-backwards', 0),

-- PRODUCT MANAGEMENT
('Continuous Discovery Habits', 'Descubrimiento de Producto', 'Cómo construir productos que los clientes aman a través del descubrimiento continuo. Torres presenta un enfoque estructurado para mantenerse conectado con los clientes y tomar decisiones de producto basadas en evidencia.', 'Teresa Torres', ARRAY['producto', 'descubrimiento', 'clientes', 'evidencia'], 'continuous-discovery-habits', 0),

('Crossing the Chasm', 'Adopción de Tecnología', 'Cómo llevar productos tecnológicos disruptivos al mercado masivo. Moore presenta el modelo de ciclo de vida de adopción de tecnología y estrategias para cruzar el "abismo" entre early adopters y mercado masivo.', 'Geoffrey A. Moore', ARRAY['tecnología', 'adopción', 'mercado', 'disrupción'], 'crossing-the-chasm', 0),

('Empowered', 'Equipos de Producto', 'Cómo alcanzar el éxito del producto con equipos de producto empoderados. Cagan y Jones presentan cómo estructurar y empoderar equipos de producto para crear productos extraordinarios que los clientes aman y que funcionan para el negocio.', 'Marty Cagan & Chris Jones', ARRAY['equipos', 'empoderamiento', 'producto', 'éxito'], 'empowered', 0),

('Escaping the Build Trap', 'Gestión de Producto', 'Cómo los equipos de producto efectivos crean valor real. Perri presenta cómo escapar de la trampa de construir características sin crear valor real, enfocándose en resultados en lugar de outputs.', 'Melissa Perri', ARRAY['producto', 'valor', 'resultados', 'características'], 'escaping-build-trap', 0),

('Inspired', 'Gestión de Producto', 'Cómo crear productos tecnológicos que los clientes aman. Cagan presenta las mejores prácticas de gestión de producto de las empresas tecnológicas más exitosas, cubriendo desde descubrimiento hasta entrega.', 'Marty Cagan', ARRAY['producto', 'tecnología', 'gestión', 'clientes'], 'inspired', 0),

('Lean Analytics', 'Métricas de Producto', 'Cómo usar datos para construir un mejor negocio más rápido. Croll y Yoskovitz presentan un enfoque basado en datos para validar ideas de negocio y optimizar productos usando métricas clave.', 'Alistair Croll & Benjamin Yoskovitz', ARRAY['analytics', 'métricas', 'datos', 'validación'], 'lean-analytics', 0),

('Sprint', 'Design Thinking', 'Cómo resolver grandes problemas y probar nuevas ideas en solo cinco días. Knapp presenta el proceso de sprint de Google Ventures para prototipado rápido y validación de ideas.', 'Jake Knapp, John Zeratsky & Braden Kowitz', ARRAY['sprint', 'prototipado', 'validación', 'design-thinking'], 'sprint', 0),

('The Lean Product Playbook', 'Desarrollo de Producto', 'Cómo innovar con Lean Startup y Design Thinking. Olsen presenta un proceso paso a paso para construir productos que los clientes quieren, desde la identificación del mercado hasta el product-market fit.', 'Dan Olsen', ARRAY['lean', 'innovación', 'product-market-fit', 'proceso'], 'lean-product-playbook', 0),

('The Mom Test', 'Validación de Ideas', 'Cómo hablar con clientes y aprender si tu negocio es una buena idea cuando todos te mienten. Fitzpatrick presenta técnicas para obtener feedback honesto y útil de clientes potenciales.', 'Rob Fitzpatrick', ARRAY['validación', 'clientes', 'feedback', 'ideas'], 'mom-test', 0),

('Zero to One', 'Startups', 'Notas sobre startups, o cómo construir el futuro. Thiel presenta ideas contraintuitivas sobre innovación, monopolios y cómo crear empresas que van de cero a uno en lugar de uno a n.', 'Peter Thiel & Blake Masters', ARRAY['startups', 'innovación', 'monopolios', 'futuro'], 'zero-to-one', 0),

-- MARKETING
('Alchemy', 'Marketing Psicológico', 'La magia oscura de la lógica irracional en marketing. Sutherland explora cómo las decisiones aparentemente irracionales pueden ser más efectivas que las lógicas, presentando casos de éxito en marketing y publicidad.', 'Rory Sutherland', ARRAY['marketing', 'psicología', 'irracionalidad', 'publicidad'], 'alchemy', 0),

('Building a StoryBrand', 'Marketing Narrativo', 'Clarifica tu mensaje para que los clientes escuchen. Miller presenta un marco de siete partes basado en narrativa para crear mensajes de marketing claros y convincentes que resuenen con los clientes.', 'Donald Miller', ARRAY['storybrand', 'narrativa', 'mensaje', 'marketing'], 'building-storybrand', 0),

('Contagious', 'Marketing Viral', 'Por qué las cosas se vuelven populares. Berger identifica seis principios que hacen que el contenido sea viral: moneda social, triggers, emoción, público, valor práctico e historias.', 'Jonah Berger', ARRAY['viral', 'contenido', 'popularidad', 'principios'], 'contagious', 0),

('Hacking Growth', 'Growth Hacking', 'Cómo las empresas de más rápido crecimiento impulsan el éxito explosivo. Ellis y Brown presentan el proceso de growth hacking y cómo construir equipos y procesos para el crecimiento acelerado.', 'Sean Ellis & Morgan Brown', ARRAY['growth-hacking', 'crecimiento', 'startups', 'proceso'], 'hacking-growth', 0),

('Hooked', 'Productos Adictivos', 'Cómo construir productos que forman hábitos. Eyal presenta el modelo Hook de cuatro pasos (trigger, acción, recompensa variable, inversión) para crear productos que los usuarios usan habitualmente.', 'Nir Eyal', ARRAY['hábitos', 'productos', 'engagement', 'psicología'], 'hooked', 0),

('Marketing Management', 'Marketing Estratégico', 'El texto definitivo sobre marketing estratégico y gestión. Kotler y Keller cubren todos los aspectos del marketing moderno, desde investigación de mercados hasta marketing digital y global.', 'Philip Kotler & Kevin Lane Keller', ARRAY['marketing', 'estrategia', 'gestión', 'kotler'], 'marketing-management', 0),

('Play Bigger', 'Category Design', 'Cómo los legendarios crean y dominan mercados. Los autores presentan el concepto de "category design" y cómo las empresas más exitosas no solo compiten en categorías existentes, sino que crean categorías completamente nuevas.', 'Al Ramadan, Dave Peterson, Christopher Lochhead & Kevin Maney', ARRAY['categorías', 'mercados', 'diseño', 'dominación'], 'play-bigger', 0),

('Positioning', 'Posicionamiento', 'La batalla por tu mente. Ries y Trout presentan el concepto revolucionario de posicionamiento: cómo diferenciarse en un mercado sobrecomunicado ocupando una posición única en la mente del cliente.', 'Al Ries & Jack Trout', ARRAY['posicionamiento', 'diferenciación', 'mente', 'mercado'], 'positioning', 0),

('Purple Cow', 'Marketing Diferenciado', 'Transforma tu negocio siendo extraordinario. Godin argumenta que en un mundo lleno de ruido, solo los productos y servicios extraordinarios (vacas púrpuras) pueden destacar y tener éxito.', 'Seth Godin', ARRAY['diferenciación', 'extraordinario', 'marketing', 'innovación'], 'purple-cow', 0),

('This Is Marketing', 'Marketing Moderno', 'No puedes ser visto hasta que aprendas a ver. Godin presenta una nueva visión del marketing centrada en el servicio, la empatía y el cambio que queremos ver en el mundo, alejándose del marketing de interrupción tradicional.', 'Seth Godin', ARRAY['marketing', 'servicio', 'empatía', 'cambio'], 'this-is-marketing', 0),

-- DESIGN & UX
('101 Design Methods', 'Métodos de Diseño', 'Una guía estructurada para la innovación en productos, servicios y experiencias. Kumar presenta 101 métodos organizados en siete modos de innovación, proporcionando un toolkit completo para diseñadores e innovadores.', 'Vijay Kumar', ARRAY['diseño', 'métodos', 'innovación', 'toolkit'], '101-design-methods', 0),

('About Face', 'Diseño de Interacción', 'Los fundamentos del diseño de interacción. Cooper presenta principios y prácticas para diseñar productos digitales que sean tanto útiles como usables, cubriendo desde investigación de usuarios hasta diseño detallado de interfaces.', 'Alan Cooper, Robert Reimann, David Cronin & Christopher Noessel', ARRAY['interacción', 'usabilidad', 'interfaces', 'usuarios'], 'about-face', 0),

('Creative Confidence', 'Creatividad', 'Libera la creatividad que llevas dentro. Los hermanos Kelley de IDEO presentan cómo cualquiera puede desarrollar confianza creativa y aplicar el design thinking para resolver problemas y generar innovación.', 'Tom Kelley & David Kelley', ARRAY['creatividad', 'confianza', 'design-thinking', 'innovación'], 'creative-confidence', 0),

('Designing for the Digital Age', 'Diseño Digital', 'Cómo crear experiencias humanas centradas en productos digitales. Goodwin presenta un proceso completo de diseño centrado en objetivos que equilibra las necesidades del usuario con los objetivos del negocio.', 'Kim Goodwin', ARRAY['diseño-digital', 'experiencia', 'usuarios', 'objetivos'], 'designing-digital-age', 0),

('Don''t Make Me Think', 'Usabilidad Web', 'Un enfoque de sentido común para la usabilidad web. Krug presenta principios simples pero poderosos para crear sitios web usables, enfatizando la importancia de la navegación intuitiva y el diseño claro.', 'Steve Krug', ARRAY['usabilidad', 'web', 'navegación', 'intuición'], 'dont-make-me-think', 0),

('Lean UX', 'UX Ágil', 'Aplicando principios lean a la mejora de la experiencia del usuario. Gothelf y Seiden presentan cómo integrar UX en procesos ágiles, enfocándose en aprendizaje rápido y iteración continua.', 'Jeff Gothelf & Josh Seiden', ARRAY['lean', 'ux', 'ágil', 'iteración'], 'lean-ux', 0),

('Refactoring UI', 'Diseño de Interfaces', 'Aprende a diseñar interfaces hermosas sin un background en diseño. Wathan y Schoger presentan tácticas específicas para mejorar el diseño visual de interfaces, desde tipografía hasta color y layout.', 'Adam Wathan & Steve Schoger', ARRAY['ui', 'interfaces', 'diseño-visual', 'tácticas'], 'refactoring-ui', 0),

('Seductive Interaction Design', 'Diseño Persuasivo', 'Crea experiencias que conviertan visitantes en clientes. Anderson presenta técnicas de diseño persuasivo basadas en psicología para crear interfaces que motiven a los usuarios a tomar acción.', 'Stephen Anderson', ARRAY['persuasión', 'conversión', 'psicología', 'interfaces'], 'seductive-interaction-design', 0),

('The Design of Everyday Things', 'Diseño Centrado en el Usuario', 'Los principios fundamentales del buen diseño. Norman presenta conceptos clave como affordances, signifiers y feedback, explicando por qué algunos diseños funcionan y otros no desde una perspectiva cognitiva.', 'Don Norman', ARRAY['diseño', 'usabilidad', 'cognición', 'principios'], 'design-everyday-things', 0),

('The Elements of User Experience', 'Experiencia de Usuario', 'Un enfoque centrado en el usuario para el diseño web. Garrett presenta un modelo de cinco planos para la experiencia de usuario: estrategia, alcance, estructura, esqueleto y superficie.', 'Jesse James Garrett', ARRAY['ux', 'experiencia', 'modelo', 'planos'], 'elements-user-experience', 0),

-- DATA & ANALYTICS
('An Introduction to Statistical Learning', 'Machine Learning', 'Una introducción accesible al aprendizaje estadístico. Los autores presentan métodos estadísticos modernos para analizar datos, con aplicaciones en R y ejemplos del mundo real.', 'Gareth James, Daniela Witten, Trevor Hastie & Robert Tibshirani', ARRAY['estadística', 'machine-learning', 'análisis', 'datos'], 'intro-statistical-learning', 0),

('Be Data Literate', 'Alfabetización de Datos', 'La guía para hablar, entender y usar datos para tomar mejores decisiones. Morrow presenta cómo desarrollar alfabetización de datos en organizaciones y tomar decisiones más informadas basadas en evidencia.', 'Jordan Morrow', ARRAY['datos', 'alfabetización', 'decisiones', 'evidencia'], 'be-data-literate', 0),

('Data Science for Business', 'Ciencia de Datos', 'Lo que necesitas saber sobre minería de datos y pensamiento analítico de datos. Provost y Fawcett presentan principios fundamentales de ciencia de datos aplicados a problemas empresariales.', 'Foster Provost & Tom Fawcett', ARRAY['ciencia-datos', 'minería', 'analítica', 'negocios'], 'data-science-business', 0),

('How Charts Lie', 'Visualización de Datos', 'Cómo los gráficos pueden engañar y cómo leerlos correctamente. Cairo presenta técnicas para crear y interpretar visualizaciones de datos de manera honesta y efectiva.', 'Alberto Cairo', ARRAY['visualización', 'gráficos', 'interpretación', 'honestidad'], 'how-charts-lie', 0),

('Naked Statistics', 'Estadística Aplicada', 'Desnudando el poder de los datos. Wheelan presenta conceptos estadísticos de manera accesible y entretenida, mostrando cómo la estadística afecta nuestras vidas diarias y decisiones.', 'Charles Wheelan', ARRAY['estadística', 'datos', 'conceptos', 'aplicación'], 'naked-statistics', 0),

('Storytelling with Data', 'Narrativa con Datos', 'Una guía para la comunicación efectiva con datos. Knaflic presenta técnicas para transformar datos en historias convincentes que impulsen la acción, combinando análisis con narrativa visual.', 'Cole Nussbaumer Knaflic', ARRAY['storytelling', 'datos', 'comunicación', 'visualización'], 'storytelling-with-data', 0),

('The Signal and the Noise', 'Predicción', 'Por qué tantas predicciones fallan, pero algunas no. Silver explora el arte y la ciencia de la predicción, examinando por qué algunos pronósticos son exitosos mientras otros fallan espectacularmente.', 'Nate Silver', ARRAY['predicción', 'pronósticos', 'señal', 'ruido'], 'signal-and-noise', 0),

('The Visual Display of Quantitative Information', 'Visualización', 'Los principios clásicos de la visualización de datos. Tufte presenta principios atemporales para la representación visual de información cuantitativa, enfatizando la claridad, precisión y eficiencia.', 'Edward R. Tufte', ARRAY['visualización', 'información', 'principios', 'claridad'], 'visual-display-quantitative', 0),

('Thinking with Data', 'Análisis de Datos', 'Cómo convertir información en insights. Shron presenta un enfoque estructurado para el análisis de datos que va desde la formulación de preguntas hasta la comunicación de resultados.', 'Max Shron', ARRAY['análisis', 'insights', 'información', 'estructura'], 'thinking-with-data', 0),

('Weapons of Math Destruction', 'Algoritmos y Sociedad', 'Cómo los big data aumentan la desigualdad y amenazan la democracia. O''Neil examina cómo los algoritmos pueden perpetuar sesgos y crear injusticias, presentando la necesidad de algoritmos más justos y transparentes.', 'Cathy O''Neil', ARRAY['algoritmos', 'sesgos', 'big-data', 'justicia'], 'weapons-math-destruction', 0),

-- SOFTWARE DEVELOPMENT
('A Philosophy of Software Design', 'Arquitectura de Software', 'Cómo crear software que sea fácil de modificar y extender. Ousterhout presenta principios de diseño de software que reducen la complejidad y mejoran la mantenibilidad del código.', 'John Ousterhout', ARRAY['arquitectura', 'diseño', 'complejidad', 'mantenibilidad'], 'philosophy-software-design', 0),

('Accelerate', 'DevOps', 'La ciencia de Lean Software y DevOps: construyendo y escalando organizaciones tecnológicas de alto rendimiento. Forsgren presenta investigación sobre qué prácticas técnicas y de gestión predicen el rendimiento organizacional.', 'Nicole Forsgren, Jez Humble & Gene Kim', ARRAY['devops', 'rendimiento', 'organizaciones', 'prácticas'], 'accelerate', 0),

('Clean Architecture', 'Arquitectura', 'Una guía del artesano para la estructura y el diseño de software. Martin presenta principios de arquitectura de software que crean sistemas mantenibles, testeable y flexibles.', 'Robert C. Martin', ARRAY['arquitectura', 'estructura', 'mantenibilidad', 'flexibilidad'], 'clean-architecture', 0),

('Clean Code', 'Calidad de Código', 'Un manual de artesanía de software ágil. Martin presenta principios y prácticas para escribir código limpio, legible y mantenible, con ejemplos prácticos y técnicas de refactoring.', 'Robert C. Martin', ARRAY['código-limpio', 'legibilidad', 'mantenibilidad', 'refactoring'], 'clean-code', 0),

('Designing Data-Intensive Applications', 'Sistemas Distribuidos', 'Las grandes ideas detrás de sistemas de datos confiables, escalables y mantenibles. Kleppmann presenta conceptos fundamentales para diseñar aplicaciones que manejan grandes volúmenes de datos.', 'Martin Kleppmann', ARRAY['datos', 'escalabilidad', 'confiabilidad', 'sistemas'], 'designing-data-intensive-apps', 0),

('System Design Interview', 'Entrevistas Técnicas', 'Una guía interna para el diseño de sistemas a gran escala. Xu presenta un enfoque estructurado para abordar preguntas de diseño de sistemas en entrevistas técnicas, con ejemplos del mundo real.', 'Alex Xu', ARRAY['diseño-sistemas', 'entrevistas', 'escalabilidad', 'arquitectura'], 'system-design-interview', 0),

('The DevOps Handbook', 'DevOps', 'Cómo crear agilidad, confiabilidad y seguridad de clase mundial en organizaciones tecnológicas. Los autores presentan principios y prácticas para implementar DevOps exitosamente.', 'Gene Kim, Jez Humble, Patrick Debois & John Willis', ARRAY['devops', 'agilidad', 'confiabilidad', 'seguridad'], 'devops-handbook', 0),

('The Manager''s Path', 'Gestión Técnica', 'Una guía para líderes tecnológicos navegando el crecimiento y el cambio. Fournier presenta consejos prácticos para ingenieros que se convierten en managers, desde liderar equipos hasta gestionar organizaciones.', 'Camille Fournier', ARRAY['gestión', 'liderazgo', 'tecnología', 'crecimiento'], 'managers-path', 0),

('The Phoenix Project', 'DevOps Narrativo', 'Una novela sobre IT, DevOps y ayudar a tu negocio a ganar. Los autores presentan principios de DevOps a través de una historia sobre la transformación de una empresa en crisis.', 'Gene Kim, Kevin Behr & George Spafford', ARRAY['devops', 'transformación', 'it', 'narrativa'], 'phoenix-project', 0),

('The Pragmatic Programmer', 'Desarrollo de Software', 'Tu viaje hacia la maestría. Hunt y Thomas presentan consejos prácticos y filosofías para convertirse en un programador más efectivo y profesional.', 'Andrew Hunt & David Thomas', ARRAY['programación', 'maestría', 'profesionalismo', 'efectividad'], 'pragmatic-programmer', 0),

-- PSYCHOLOGY & DECISION MAKING
('Antifragile', 'Resiliencia', 'Cosas que se benefician del desorden. Taleb presenta el concepto de antifragilidad: sistemas que no solo resisten el estrés y la volatilidad, sino que se fortalecen con ellos.', 'Nassim Nicholas Taleb', ARRAY['antifragilidad', 'resiliencia', 'volatilidad', 'sistemas'], 'antifragile', 0),

('Noise', 'Toma de Decisiones', 'Una falla en el juicio humano. Kahneman explora cómo el "ruido" (variabilidad no deseada en juicios) afecta las decisiones y presenta estrategias para reducir esta variabilidad.', 'Daniel Kahneman, Olivier Sibony & Cass R. Sunstein', ARRAY['decisiones', 'juicio', 'variabilidad', 'ruido'], 'noise', 0),

('Nudge', 'Arquitectura de Decisiones', 'Mejorando decisiones sobre salud, riqueza y felicidad. Thaler y Sunstein presentan cómo pequeños cambios en la forma en que se presentan las opciones pueden mejorar significativamente las decisiones.', 'Richard H. Thaler & Cass R. Sunstein', ARRAY['nudge', 'decisiones', 'arquitectura', 'opciones'], 'nudge', 0),

('Predictably Irrational', 'Economía Conductual', 'Las fuerzas ocultas que moldean nuestras decisiones. Ariely presenta experimentos que revelan cómo tomamos decisiones de manera sistemáticamente irracional pero predecible.', 'Dan Ariely', ARRAY['irracionalidad', 'decisiones', 'experimentos', 'comportamiento'], 'predictably-irrational', 0),

('Skin in the Game', 'Riesgo y Recompensa', 'Asimetrías ocultas en la vida diaria. Taleb explora cómo tener "skin in the game" (riesgo personal en las decisiones) afecta el comportamiento y la toma de decisiones.', 'Nassim Nicholas Taleb', ARRAY['riesgo', 'decisiones', 'asimetrías', 'comportamiento'], 'skin-in-the-game', 0),

('Superforecasting', 'Predicción', 'El arte y la ciencia de la predicción. Tetlock presenta técnicas de los "superpronosticadores" para hacer predicciones más precisas sobre eventos futuros.', 'Philip E. Tetlock & Dan Gardner', ARRAY['predicción', 'pronósticos', 'precisión', 'futuro'], 'superforecasting', 0),

('The Art of Thinking Clearly', 'Sesgos Cognitivos', 'Errores sistemáticos de pensamiento que todos cometemos. Dobelli presenta 99 sesgos cognitivos comunes y cómo evitarlos para tomar mejores decisiones.', 'Rolf Dobelli', ARRAY['sesgos', 'pensamiento', 'errores', 'decisiones'], 'art-thinking-clearly', 0),

('The Checklist Manifesto', 'Sistemas de Control', 'Cómo hacer las cosas bien. Gawande presenta el poder de las listas de verificación para reducir errores y mejorar el rendimiento en campos complejos como medicina y aviación.', 'Atul Gawande', ARRAY['checklists', 'errores', 'rendimiento', 'sistemas'], 'checklist-manifesto', 0),

('The Paradox of Choice', 'Toma de Decisiones', 'Por qué más es menos. Schwartz explora cómo el exceso de opciones puede llevar a ansiedad y parálisis de decisión, y presenta estrategias para navegar un mundo de opciones infinitas.', 'Barry Schwartz', ARRAY['opciones', 'decisiones', 'ansiedad', 'paradoja'], 'paradox-of-choice', 0),

('Thinking, Fast and Slow', 'Psicología Cognitiva', 'Los dos sistemas que impulsan la forma en que pensamos. Kahneman presenta la distinción entre pensamiento rápido (Sistema 1) y lento (Sistema 2), y cómo ambos afectan nuestras decisiones.', 'Daniel Kahneman', ARRAY['pensamiento', 'sistemas', 'cognición', 'decisiones'], 'thinking-fast-slow', 0),

-- CREATIVITY & INNOVATION
('A Technique for Producing Ideas', 'Creatividad', 'El proceso clásico de generación de ideas. Young presenta un método de cinco pasos para producir ideas de manera sistemática, basándose en principios de asociación y combinación.', 'James Webb Young', ARRAY['ideas', 'creatividad', 'proceso', 'asociación'], 'technique-producing-ideas', 0),

('Show Your Work', 'Creatividad Digital', 'Cómo ser descubierto en la era digital. Kleon presenta estrategias para compartir tu trabajo creativo en línea, construir una audiencia y avanzar en tu carrera creativa.', 'Austin Kleon', ARRAY['creatividad', 'digital', 'audiencia', 'carrera'], 'show-your-work', 0),

('Steal Like an Artist', 'Creatividad', 'Cosas que nadie te dijo sobre ser creativo. Kleon presenta principios para liberar tu creatividad, incluyendo cómo encontrar inspiración, desarrollar tu voz y construir una carrera creativa.', 'Austin Kleon', ARRAY['creatividad', 'inspiración', 'voz', 'artista'], 'steal-like-artist', 0),

('Story', 'Narrativa', 'Sustancia, estructura, estilo y los principios de la escritura de guiones. McKee presenta los elementos fundamentales de la narrativa efectiva, aplicables tanto a guiones como a comunicación empresarial.', 'Robert McKee', ARRAY['narrativa', 'estructura', 'guiones', 'storytelling'], 'story', 0),

('Storyworthy', 'Storytelling Personal', 'Involucra, enseña, persuade y cambia tu vida a través del poder de contar historias. Dicks presenta técnicas para encontrar, desarrollar y contar historias personales convincentes.', 'Matthew Dicks', ARRAY['storytelling', 'historias-personales', 'persuasión', 'cambio'], 'storyworthy', 0),

('The Anatomy of Story', 'Estructura Narrativa', 'Los 22 pasos para convertirse en un escritor maestro. Truby presenta un enfoque estructurado para crear historias poderosas, desde la premisa hasta la resolución.', 'John Truby', ARRAY['estructura', 'escritura', 'historias', 'maestría'], 'anatomy-of-story', 0),

('The Artist''s Way', 'Creatividad Espiritual', 'Un camino espiritual hacia la creatividad superior. Cameron presenta un programa de 12 semanas para recuperar y desarrollar la creatividad, incluyendo técnicas como las páginas matutinas.', 'Julia Cameron', ARRAY['creatividad', 'espiritual', 'programa', 'desarrollo'], 'artists-way', 0),

('The Creative Habit', 'Hábitos Creativos', 'Aprende a usarla de por vida. Tharp presenta rutinas y ejercicios para desarrollar y mantener la creatividad como un hábito diario, basándose en su experiencia como coreógrafa.', 'Twyla Tharp', ARRAY['creatividad', 'hábitos', 'rutinas', 'disciplina'], 'creative-habit', 0),

('The Hero with a Thousand Faces', 'Mitología', 'El viaje del héroe en la mitología mundial. Campbell presenta el monomito: el patrón narrativo universal encontrado en mitos de todas las culturas, fundamental para el storytelling moderno.', 'Joseph Campbell', ARRAY['mitología', 'héroe', 'narrativa', 'universal'], 'hero-thousand-faces', 0),

('The War of Art', 'Resistencia Creativa', 'Rompe las barreras y gana tus batallas creativas internas. Pressfield identifica la "Resistencia" como el enemigo de la creatividad y presenta estrategias para superarla y hacer el trabajo creativo.', 'Steven Pressfield', ARRAY['resistencia', 'creatividad', 'barreras', 'trabajo'], 'war-of-art', 0),

-- FINANCE & INVESTING
('A Random Walk Down Wall Street', 'Inversión', 'La estrategia de inversión probada en el tiempo para el inversor exitoso. Malkiel presenta el caso para la inversión en índices y la teoría del mercado eficiente.', 'Burton G. Malkiel', ARRAY['inversión', 'índices', 'mercado-eficiente', 'estrategia'], 'random-walk-wall-street', 0),

('Accounting Made Simple', 'Contabilidad', 'Contabilidad explicada en 100 páginas o menos. Piper presenta los conceptos fundamentales de contabilidad de manera clara y concisa para no contadores.', 'Mike Piper', ARRAY['contabilidad', 'conceptos', 'fundamentos', 'simple'], 'accounting-made-simple', 0),

('Common Sense on Mutual Funds', 'Fondos Mutuos', 'Nuevos imperativos para el inversor inteligente. Bogle presenta principios de inversión de bajo costo y largo plazo, enfatizando la importancia de los costos en los retornos de inversión.', 'John C. Bogle', ARRAY['fondos-mutuos', 'costos', 'largo-plazo', 'retornos'], 'common-sense-mutual-funds', 0),

('Financial Intelligence', 'Inteligencia Financiera', 'Una guía del manager para saber lo que realmente significan los números. Berman y Knight presentan conceptos financieros esenciales para managers no financieros.', 'Karen Berman & Joe Knight', ARRAY['finanzas', 'managers', 'números', 'conceptos'], 'financial-intelligence', 0),

('I Will Teach You to Be Rich', 'Finanzas Personales', 'Un programa de 6 semanas sin culpa para manejar tu dinero. Sethi presenta un enfoque práctico y automatizado para las finanzas personales, desde presupuestos hasta inversiones.', 'Ramit Sethi', ARRAY['finanzas-personales', 'dinero', 'automatización', 'programa'], 'i-will-teach-you-rich', 0),

('Rich Dad Poor Dad', 'Educación Financiera', 'Lo que los ricos enseñan a sus hijos sobre el dinero que los pobres y la clase media no. Kiyosaki presenta conceptos sobre activos, pasivos y la importancia de la educación financiera.', 'Robert T. Kiyosaki & Sharon Lechter', ARRAY['educación-financiera', 'activos', 'pasivos', 'riqueza'], 'rich-dad-poor-dad', 0),

('The Little Book of Common Sense Investing', 'Inversión Simple', 'La única forma de garantizar tu parte justa de los retornos del mercado de valores. Bogle presenta el caso para la inversión en fondos índice como la estrategia más efectiva para la mayoría de inversores.', 'John C. Bogle', ARRAY['inversión', 'fondos-índice', 'retornos', 'mercado'], 'little-book-common-sense-investing', 0),

('The Personal MBA', 'Educación Empresarial', 'Domina el arte de los negocios. Kaufman presenta conceptos empresariales esenciales de manera accesible, cubriendo desde marketing hasta finanzas y operaciones.', 'Josh Kaufman', ARRAY['mba', 'negocios', 'conceptos', 'educación'], 'personal-mba', 0),

('The Psychology of Money', 'Psicología Financiera', 'Lecciones atemporales sobre riqueza, codicia y felicidad. Housel explora cómo la psicología, más que la inteligencia técnica, determina el éxito financiero.', 'Morgan Housel', ARRAY['psicología', 'dinero', 'riqueza', 'comportamiento'], 'psychology-of-money', 0);

-- Update knowledge base statistics
SELECT 'Knowledge base populated successfully with ' || COUNT(*) || ' books' as status
FROM knowledge_base;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_search ON knowledge_base USING GIN(to_tsvector('spanish', title || ' ' || content));

-- Update the brain configuration
INSERT INTO platform_config (key, value, description) VALUES
('brain_knowledge_count', (SELECT COUNT(*)::text FROM knowledge_base), 'Total number of books in knowledge base'),
('brain_categories', (SELECT array_to_string(array_agg(DISTINCT category), ',') FROM knowledge_base), 'Available knowledge categories'),
('brain_last_updated', NOW()::text, 'Last knowledge base update timestamp')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

COMMIT;
