-- Complete Knowledge Base Population with ALL Professional Development Books
-- This script includes ALL 100+ books from the original list
BEGIN;

-- Clear existing knowledge base to avoid duplicates
DELETE FROM knowledge_base;

-- Reset the sequence
ALTER SEQUENCE knowledge_base_id_seq RESTART WITH 1;

-- Insert ALL professional development books from the original list
INSERT INTO knowledge_base (title, category, content, author, tags, slug, read_count) VALUES

-- CAREER DEVELOPMENT & LIFE DESIGN (9 books)
('Designing Your Life', 'Desarrollo de Carrera', 'Guía práctica para aplicar design thinking a tu carrera y vida. Los autores, profesores de Stanford, presentan un enfoque sistemático para crear una vida profesional significativa usando herramientas de diseño. Incluye ejercicios para identificar valores, explorar opciones y crear prototipos de vida.', 'Bill Burnett & Dave Evans', ARRAY['carrera', 'diseño', 'vida', 'propósito', 'stanford'], 'designing-your-life', 0),

('Drive', 'Motivación', 'Explora la ciencia de la motivación humana basándose en décadas de investigación. Demuestra que la autonomía, maestría y propósito son más efectivos que las recompensas tradicionales para motivar el rendimiento. Revoluciona la comprensión de qué nos impulsa realmente.', 'Daniel H. Pink', ARRAY['motivación', 'psicología', 'rendimiento', 'autonomía', 'propósito'], 'drive', 0),

('Grit', 'Desarrollo Personal', 'El poder de la pasión y perseverancia para el éxito a largo plazo. La investigación de Duckworth demuestra que la combinación de pasión y persistencia es más predictiva del éxito que el talento natural. Incluye estrategias para desarrollar resistencia mental.', 'Angela Duckworth', ARRAY['perseverancia', 'éxito', 'psicología', 'resistencia', 'talento'], 'grit', 0),

('Mindset', 'Psicología', 'La diferencia entre mentalidad fija y de crecimiento. Dweck explica cómo nuestras creencias sobre nuestras habilidades afectan profundamente el éxito y cómo adoptar una mentalidad de crecimiento puede transformar tu carrera y vida personal.', 'Carol S. Dweck', ARRAY['mentalidad', 'crecimiento', 'aprendizaje', 'psicología', 'éxito'], 'mindset', 0),

('Peak', 'Aprendizaje', 'Los secretos de la práctica deliberada para mejorar en cualquier habilidad. Ericsson desmitifica el talento natural y presenta un marco científico para el desarrollo de expertise a través de práctica estructurada y retroalimentación constante.', 'Anders Ericsson & Robert Pool', ARRAY['práctica', 'expertise', 'habilidades', 'aprendizaje', 'deliberada'], 'peak', 0),

('Range', 'Desarrollo Personal', 'Por qué los generalistas triunfan en un mundo especializado. Epstein argumenta que en muchos campos, la experiencia amplia y diversa es más valiosa que la especialización temprana, presentando evidencia de múltiples disciplinas.', 'David Epstein', ARRAY['generalista', 'especialización', 'diversidad', 'aprendizaje', 'versatilidad'], 'range', 0),

('So Good They Cant Ignore You', 'Desarrollo de Carrera', 'Por qué las habilidades triunfan sobre la pasión en la búsqueda del trabajo que amas. Newport desafía el consejo convencional de seguir tu pasión y presenta un enfoque basado en el desarrollo de habilidades valiosas y raras.', 'Cal Newport', ARRAY['habilidades', 'pasión', 'carrera', 'maestría', 'valor'], 'so-good-they-cant-ignore-you', 0),

('The 2-Hour Job Search', 'Búsqueda de Empleo', 'Un enfoque sistemático para encontrar trabajo más rápido. Dalton presenta una metodología probada para acelerar la búsqueda de empleo usando técnicas de networking estratégico y priorización de oportunidades.', 'Steve Dalton', ARRAY['búsqueda-empleo', 'networking', 'estrategia', 'eficiencia', 'oportunidades'], 'the-2-hour-job-search', 0),

('The First 90 Days', 'Transiciones Profesionales', 'Estrategias probadas para acelerar tu éxito en nuevos roles de liderazgo. Watkins presenta un plan sistemático para los primeros 90 días en cualquier nueva posición, desde empleado individual hasta CEO.', 'Michael D. Watkins', ARRAY['transición', 'liderazgo', 'nuevos-roles', 'estrategia', 'éxito'], 'the-first-90-days', 0),

-- CAREER GUIDANCE CLASSIC
('What Color Is Your Parachute?', 'Orientación Profesional', 'La guía clásica para la búsqueda de empleo y cambio de carrera, actualizada anualmente. Bolles presenta ejercicios de autoconocimiento, técnicas de búsqueda de empleo y estrategias para encontrar trabajo significativo.', 'Richard N. Bolles', ARRAY['búsqueda-empleo', 'autoconocimiento', 'carrera', 'orientación', 'trabajo'], 'what-color-is-your-parachute', 0),

-- PRODUCTIVITY & HABITS (10 books)
('Atomic Habits', 'Productividad', 'Un enfoque sistemático para formar buenos hábitos y romper los malos. Clear presenta el concepto de mejoras del 1% y el poder del interés compuesto en los hábitos para lograr resultados extraordinarios. Incluye el marco de los cuatro pasos para el cambio de comportamiento.', 'James Clear', ARRAY['hábitos', 'productividad', 'cambio', 'comportamiento', 'sistemas'], 'atomic-habits', 0),

('Deep Work', 'Productividad', 'La capacidad de concentrarse sin distracción en tareas cognitivamente demandantes. Newport presenta estrategias para cultivar esta habilidad cada vez más rara pero valiosa, y cómo usarla para producir trabajo de alta calidad de manera eficiente.', 'Cal Newport', ARRAY['concentración', 'productividad', 'trabajo-profundo', 'distracción', 'enfoque'], 'deep-work', 0),

('Eat That Frog!', 'Gestión del Tiempo', 'Técnicas para dejar de procrastinar y hacer más en menos tiempo. Tracy presenta 21 métodos prácticos para superar la procrastinación y aumentar la productividad, enfocándose en hacer primero las tareas más importantes y difíciles.', 'Brian Tracy', ARRAY['procrastinación', 'tiempo', 'productividad', 'prioridades', 'eficiencia'], 'eat-that-frog', 0),

('Essentialism', 'Productividad', 'La disciplina de hacer menos pero mejor. McKeown presenta un enfoque sistemático para identificar lo verdaderamente esencial y eliminar todo lo demás, permitiendo hacer las contribuciones más significativas posibles.', 'Greg McKeown', ARRAY['esencialismo', 'prioridades', 'enfoque', 'simplicidad', 'disciplina'], 'essentialism', 0),

('Getting Things Done', 'Productividad', 'Sistema completo de gestión de tareas y proyectos para lograr productividad sin estrés. Allen presenta metodologías probadas para capturar, clarificar, organizar y revisar todas las responsabilidades de tu vida profesional y personal.', 'David Allen', ARRAY['gtd', 'organización', 'tareas', 'productividad', 'sistema'], 'getting-things-done', 0),

('Make Time', 'Gestión del Tiempo', 'Cómo enfocarse en lo que importa todos los días. Los ex-diseñadores de Google presentan un marco de cuatro pasos para crear tiempo para las cosas que realmente importan, combatiendo las distracciones constantes del mundo moderno.', 'Jake Knapp & John Zeratsky', ARRAY['tiempo', 'enfoque', 'distracciones', 'prioridades', 'google'], 'make-time', 0),

('The One Thing', 'Productividad', 'El éxito extraordinario viene de enfocarse en una cosa a la vez. Los autores presentan estrategias para identificar la actividad más importante que hará que todo lo demás sea más fácil o innecesario, eliminando la multitarea y maximizando resultados.', 'Gary Keller & Jay Papasan', ARRAY['enfoque', 'prioridades', 'éxito', 'productividad', 'simplicidad'], 'the-one-thing', 0),

('The Power of Habit', 'Hábitos', 'Por qué hacemos lo que hacemos en la vida y los negocios. Duhigg explora la ciencia de la formación de hábitos y presenta el bucle del hábito: señal, rutina, recompensa. Incluye casos de estudio de individuos, empresas y sociedades.', 'Charles Duhigg', ARRAY['hábitos', 'neurociencia', 'cambio', 'comportamiento', 'bucle'], 'the-power-of-habit', 0),

('Tiny Habits', 'Formación de Hábitos', 'El método pequeño para grandes cambios. Fogg presenta su método científicamente probado para crear hábitos duraderos comenzando con cambios diminutos. Basado en 20 años de investigación en Stanford sobre el comportamiento humano.', 'BJ Fogg', ARRAY['hábitos', 'cambio', 'comportamiento', 'stanford', 'pequeños-pasos'], 'tiny-habits', 0),

('Ultralearning', 'Aprendizaje Acelerado', 'Domina habilidades difíciles, supera a la competencia y acelera tu carrera. Young presenta principios para el aprendizaje autodirigido intensivo, basándose en casos de estudio de personas que lograron resultados extraordinarios de aprendizaje.', 'Scott Young', ARRAY['aprendizaje', 'habilidades', 'autodirigido', 'acelerado', 'maestría'], 'ultralearning', 0),

-- BUSINESS WRITING & COMMUNICATION (10 books)
('HBR Guide to Better Business Writing', 'Escritura Empresarial', 'Cómo comunicar tus ideas con claridad y impacto. Garner presenta técnicas probadas para mejorar la escritura empresarial, desde emails hasta informes ejecutivos, enfocándose en claridad, concisión y persuasión.', 'Bryan A. Garner', ARRAY['escritura', 'comunicación', 'negocios', 'claridad', 'impacto'], 'hbr-guide-better-business-writing', 0),

('Made to Stick', 'Comunicación', 'Por qué algunas ideas sobreviven y otras mueren. Los hermanos Heath presentan el modelo SUCCESS para crear mensajes memorables y los principios fundamentales que hacen que las ideas sean pegajosas y perduren en la memoria.', 'Chip Heath & Dan Heath', ARRAY['comunicación', 'ideas', 'memorable', 'persuasión', 'narrativa'], 'made-to-stick', 0),

('On Writing Well', 'Escritura', 'Considerado uno de los mejores libros sobre escritura de no ficción. Zinsser enfatiza la importancia de la simplicidad, claridad y humanidad en la escritura, ofreciendo principios atemporales para comunicación efectiva.', 'William Zinsser', ARRAY['escritura', 'claridad', 'no-ficción', 'simplicidad', 'estilo'], 'on-writing-well', 0),

('Presentation Zen', 'Presentaciones', 'Ideas simples sobre el diseño y la entrega de presentaciones. Reynolds presenta principios de diseño zen aplicados a las presentaciones, enfatizando la simplicidad, la narrativa visual y la conexión auténtica con la audiencia.', 'Garr Reynolds', ARRAY['presentaciones', 'diseño', 'zen', 'simplicidad', 'visual'], 'presentation-zen', 0),

('Resonate', 'Presentaciones', 'Cómo crear presentaciones que muevan a las audiencias a la acción. Duarte presenta principios para crear mensajes que resuenen profundamente, basándose en el análisis de las presentaciones más persuasivas de la historia.', 'Nancy Duarte', ARRAY['presentaciones', 'persuasión', 'audiencia', 'narrativa', 'acción'], 'resonate', 0),

('Talk Like TED', 'Presentaciones', 'Los secretos de las presentaciones extraordinarias analizando las charlas TED más populares. Gallo identifica nueve técnicas utilizadas por los mejores oradores del mundo para inspirar, persuadir y motivar a sus audiencias.', 'Carmine Gallo', ARRAY['presentaciones', 'ted', 'oratoria', 'inspiración', 'persuasión'], 'talk-like-ted', 0),

('The Elements of Style', 'Escritura', 'El manual clásico de estilo y uso del inglés. Strunk y White presentan reglas fundamentales de composición, principios de escritura clara y elementos de estilo que han influenciado generaciones de escritores.', 'William Strunk Jr. & E. B. White', ARRAY['escritura', 'estilo', 'gramática', 'composición', 'clásico'], 'the-elements-of-style', 0),

('The Pyramid Principle', 'Comunicación Estructurada', 'La metodología para estructurar el pensamiento y la comunicación de manera lógica. Minto presenta técnicas para organizar ideas en una estructura piramidal que facilita la comprensión y persuasión en comunicación empresarial.', 'Barbara Minto', ARRAY['estructura', 'lógica', 'comunicación', 'pensamiento', 'claridad'], 'pyramid-principle', 0),

('The Sense of Style', 'Escritura Moderna', 'La guía del pensador para escribir en el siglo XXI. Pinker combina la ciencia cognitiva con los principios de la buena escritura, ofreciendo consejos prácticos para escribir con claridad, elegancia y gracia en la era digital.', 'Steven Pinker', ARRAY['escritura', 'estilo', 'ciencia-cognitiva', 'claridad', 'moderno'], 'the-sense-of-style', 0),

('Writing That Works', 'Escritura Práctica', 'Cómo comunicar efectivamente en los negocios. Roman y Raphaelson presentan técnicas probadas para escribir cartas, memos, informes y presentaciones que logran resultados, enfocándose en la comunicación práctica y efectiva.', 'Kenneth Roman & Joel Raphaelson', ARRAY['escritura', 'negocios', 'comunicación', 'efectividad', 'práctico'], 'writing-that-works', 0),

-- NEGOTIATION & INFLUENCE (10 books)
('Crucial Conversations', 'Comunicación Difícil', 'Herramientas para hablar cuando las apuestas son altas. Los autores presentan técnicas para manejar conversaciones difíciles con confianza y habilidad, manteniendo relaciones mientras se logran resultados.', 'Kerry Patterson, Joseph Grenny, Ron McMillan & Al Switzler', ARRAY['conversaciones', 'comunicación', 'conflicto', 'relaciones', 'resultados'], 'crucial-conversations', 0),

('Getting to Yes', 'Negociación', 'Negociar acuerdos sin ceder. Fisher, Ury y Patton presentan el método de negociación basada en principios, enfocándose en intereses mutuos en lugar de posiciones para crear soluciones ganar-ganar.', 'Roger Fisher, William Ury & Bruce Patton', ARRAY['negociación', 'acuerdos', 'principios', 'ganar-ganar', 'intereses'], 'getting-to-yes', 0),

('Give and Take', 'Reciprocidad', 'Un enfoque revolucionario del éxito. Grant explora cómo los dadores, tomadores y intercambiadores navegan el éxito, demostrando que los dadores generosos pueden ser tanto los más exitosos como los menos exitosos.', 'Adam Grant', ARRAY['reciprocidad', 'generosidad', 'éxito', 'relaciones', 'dar'], 'give-and-take', 0),

('How to Win Friends and Influence People', 'Relaciones Interpersonales', 'El clásico atemporal sobre relaciones humanas. Carnegie presenta principios fundamentales para manejar personas, ganar amigos e influir en otros de manera ética y efectiva, basándose en la comprensión de la naturaleza humana.', 'Dale Carnegie', ARRAY['relaciones', 'influencia', 'amistad', 'personas', 'clásico'], 'how-to-win-friends-influence-people', 0),

('Influence', 'Psicología de la Persuasión', 'Los seis principios universales de influencia: reciprocidad, compromiso/consistencia, prueba social, autoridad, simpatía y escasez. Cialdini presenta insights científicos sobre por qué las personas dicen sí y cómo aplicar estos principios éticamente.', 'Robert B. Cialdini', ARRAY['influencia', 'persuasión', 'psicología', 'principios', 'ética'], 'influence', 0),

('Never Eat Alone', 'Networking', 'Y otros secretos del éxito, una relación a la vez. Ferrazzi presenta estrategias para construir una red de contactos auténtica y poderosa, enfocándose en dar valor a otros antes de recibir.', 'Keith Ferrazzi & Tahl Raz', ARRAY['networking', 'relaciones', 'contactos', 'valor', 'autenticidad'], 'never-eat-alone', 0),

('Never Split the Difference', 'Negociación Táctica', 'Negociar como si tu vida dependiera de ello. El ex-negociador del FBI Voss presenta técnicas de negociación de alto riesgo aplicadas a situaciones empresariales y personales cotidianas.', 'Chris Voss & Tahl Raz', ARRAY['negociación', 'fbi', 'tácticas', 'alto-riesgo', 'persuasión'], 'never-split-the-difference', 0),

('Pre-Suasion', 'Influencia Previa', 'Un método revolucionario para influir y persuadir. Cialdini explora el arte de capturar y canalizar la atención como el primer paso de la persuasión efectiva, presentando técnicas para preparar el terreno antes de hacer una petición.', 'Robert B. Cialdini', ARRAY['pre-suasión', 'atención', 'persuasión', 'influencia', 'preparación'], 'pre-suasion', 0),

('The Charisma Myth', 'Carisma', 'Cómo cualquiera puede dominar el arte y la ciencia del magnetismo personal. Cabane desmitifica el carisma y presenta técnicas específicas para desarrollar presencia, poder y calidez, los tres componentes del carisma.', 'Olivia Fox Cabane', ARRAY['carisma', 'presencia', 'magnetismo', 'poder', 'calidez'], 'the-charisma-myth', 0),

('The Like Switch', 'Simpatía', 'Un guía del ex-agente del FBI para influir, atraer y ganar personas. Schafer presenta técnicas utilizadas en inteligencia para generar simpatía y confianza rápidamente, aplicables en contextos empresariales y personales.', 'Jack Schafer & Marvin Karlins', ARRAY['simpatía', 'fbi', 'confianza', 'influencia', 'atracción'], 'the-like-switch', 0),

-- LEADERSHIP & MANAGEMENT (10 books)
('Extreme Ownership', 'Liderazgo', 'Principios de liderazgo de los Navy SEALs aplicados al mundo empresarial. El concepto de responsabilidad extrema donde los líderes asumen responsabilidad total por sus equipos y todos los resultados, buenos y malos.', 'Jocko Willink & Leif Babin', ARRAY['liderazgo', 'responsabilidad', 'equipos', 'militar', 'disciplina'], 'extreme-ownership', 0),

('High Output Management', 'Gestión', 'Las lecciones de liderazgo del legendario CEO de Intel. Grove presenta principios fundamentales de gestión, incluyendo reuniones efectivas, evaluaciones de desempeño y cómo maximizar la productividad de equipos y organizaciones.', 'Andrew S. Grove', ARRAY['gestión', 'liderazgo', 'intel', 'productividad', 'equipos'], 'high-output-management', 0),

('Leaders Eat Last', 'Liderazgo', 'Por qué algunos equipos se unen y otros no. Sinek explora el concepto del círculo de seguridad y cómo los grandes líderes crean ambientes donde las personas se sienten seguras, valoradas y motivadas a dar lo mejor de sí.', 'Simon Sinek', ARRAY['liderazgo', 'seguridad', 'equipos', 'confianza', 'cultura'], 'leaders-eat-last', 0),

('Multipliers', 'Liderazgo', 'Cómo los líderes amplifican la inteligencia de otros versus los que la disminuyen. Wiseman identifica las cinco disciplinas de los Multiplicadores y cómo desarrollar estas capacidades para maximizar el potencial del equipo.', 'Liz Wiseman', ARRAY['liderazgo', 'inteligencia', 'multiplicadores', 'potencial', 'desarrollo'], 'multipliers', 0),

('Radical Candor', 'Gestión', 'Cómo ser un mejor jefe a través del cuidado personal y el desafío directo. Scott presenta un marco para dar feedback efectivo que ayude a las personas a crecer mientras se mantienen relaciones sólidas y de confianza.', 'Kim Scott', ARRAY['feedback', 'gestión', 'cuidado', 'honestidad', 'crecimiento'], 'radical-candor', 0),

('Team of Teams', 'Trabajo en Equipo', 'Nuevas reglas de compromiso para un mundo complejo. McChrystal presenta lecciones del campo de batalla sobre cómo crear organizaciones adaptables que puedan prosperar en entornos de cambio rápido e incertidumbre.', 'Stanley McChrystal', ARRAY['equipos', 'adaptabilidad', 'complejidad', 'militar', 'cambio'], 'team-of-teams', 0),

('The Culture Code', 'Cultura Organizacional', 'Los secretos de los grupos altamente exitosos. Coyle identifica tres habilidades clave que permiten a los grupos trabajar juntos efectivamente: construir seguridad, compartir vulnerabilidad y establecer propósito.', 'Daniel Coyle', ARRAY['cultura', 'grupos', 'seguridad', 'vulnerabilidad', 'propósito'], 'the-culture-code', 0),

('The Effective Executive', 'Efectividad Ejecutiva', 'La guía definitiva para hacer las cosas correctas. Drucker presenta cinco prácticas esenciales que hacen efectivos a los ejecutivos: gestión del tiempo, enfoque en contribución, construcción sobre fortalezas, prioridades y toma de decisiones efectiva.', 'Peter F. Drucker', ARRAY['efectividad', 'ejecutivo', 'tiempo', 'contribución', 'decisiones'], 'the-effective-executive', 0),

('The Five Dysfunctions of a Team', 'Trabajo en Equipo', 'Un modelo poderoso para construir equipos cohesivos. Lencioni identifica cinco disfunciones: ausencia de confianza, miedo al conflicto, falta de compromiso, evitación de responsabilidad y falta de atención a los resultados.', 'Patrick Lencioni', ARRAY['equipos', 'disfunciones', 'confianza', 'conflicto', 'compromiso'], 'five-dysfunctions-team', 0),

('Turn the Ship Around!', 'Liderazgo Transformacional', 'Un manual de liderazgo verdadero. Marquet cuenta cómo transformó el peor submarino nuclear de la Marina en el mejor, creando líderes en todos los niveles a través del modelo líder-líder en lugar de líder-seguidor.', 'L. David Marquet', ARRAY['liderazgo', 'transformación', 'submarino', 'marina', 'empoderamiento'], 'turn-the-ship-around', 0),

-- STRATEGY & BUSINESS (8 books)
('Blue Ocean Strategy', 'Estrategia', 'Cómo crear espacios de mercado sin competencia haciendo que la competencia sea irrelevante. Kim y Mauborgne presentan herramientas y marcos para identificar y capturar océanos azules de oportunidad no disputada.', 'W. Chan Kim & Renée Mauborgne', ARRAY['estrategia', 'océano-azul', 'competencia', 'innovación', 'mercado'], 'blue-ocean-strategy', 0),

('Execution', 'Ejecución', 'La disciplina de hacer que las cosas sucedan. Los autores argumentan que la ejecución es la mayor deficiencia en los negocios hoy y presentan un sistema integral para cerrar la brecha entre estrategia y resultados.', 'Larry Bossidy & Ram Charan', ARRAY['ejecución', 'estrategia', 'resultados', 'disciplina', 'liderazgo'], 'execution', 0),

('Good to Great', 'Excelencia Empresarial', 'Qué hace que las empresas salten de buenas a grandiosas. Collins identifica factores distintivos: liderazgo Nivel 5, primero quién luego qué, confrontar hechos brutales, concepto del erizo, cultura de disciplina y tecnología como acelerador.', 'Jim Collins', ARRAY['excelencia', 'liderazgo', 'transformación', 'disciplina', 'cultura'], 'good-to-great', 0),

('HBRs 10 Must Reads on Strategy', 'Estrategia Empresarial', 'Los artículos más influyentes sobre estrategia empresarial de Harvard Business Review. Incluye trabajos clásicos de Porter, Christensen, Kim & Mauborgne y otros pensadores estratégicos líderes.', 'Harvard Business Review', ARRAY['estrategia', 'hbr', 'porter', 'competencia', 'ventaja'], 'hbr-10-must-reads-strategy', 0),

('Measure What Matters', 'OKRs', 'El sistema de objetivos y resultados clave que impulsa el crecimiento exponencial. Doerr explica cómo los OKRs ayudaron a Google, Intel y otras empresas a lograr un crecimiento extraordinario y cómo implementarlos efectivamente.', 'John Doerr', ARRAY['okrs', 'objetivos', 'medición', 'crecimiento', 'google'], 'measure-what-matters', 0),

('Playing to Win', 'Estrategia Competitiva', 'Cómo la estrategia realmente funciona. Lafley y Martin presentan un marco integrado de cinco preguntas para desarrollar estrategias ganadoras, basándose en su experiencia transformando P&G.', 'A.G. Lafley & Roger L. Martin', ARRAY['estrategia', 'competencia', 'ganar', 'p&g', 'marco'], 'playing-to-win', 0),

('The Balanced Scorecard', 'Medición Estratégica', 'Traducir la estrategia en acción. Kaplan y Norton presentan el sistema de balanced scorecard para medir y gestionar el desempeño organizacional desde múltiples perspectivas: financiera, cliente, procesos internos y aprendizaje.', 'Robert S. Kaplan & David P. Norton', ARRAY['balanced-scorecard', 'medición', 'estrategia', 'desempeño', 'perspectivas'], 'the-balanced-scorecard', 0),

('The Goal', 'Teoría de Restricciones', 'Un proceso de mejora continua. Goldratt presenta la Teoría de Restricciones a través de una novela empresarial, mostrando cómo identificar y gestionar los cuellos de botella para mejorar el desempeño organizacional.', 'Eliyahu M. Goldratt', ARRAY['restricciones', 'mejora-continua', 'cuellos-botella', 'procesos', 'optimización'], 'the-goal', 0),

-- INNOVATION & DISRUPTION (2 books)
('The Innovators Dilemma', 'Innovación', 'Por qué las empresas exitosas fallan cuando se enfrentan a la innovación disruptiva. Christensen explica cómo las tecnologías disruptivas derriban a los líderes establecidos y presenta estrategias para navegar la innovación.', 'Clayton M. Christensen', ARRAY['innovación', 'disrupción', 'tecnología', 'cambio', 'estrategia'], 'innovators-dilemma', 0),

('Working Backwards', 'Innovación Amazon', 'Insights y secretos detrás del enfoque de Amazon. Bryar y Carr revelan los principios de liderazgo y procesos operativos que impulsaron el crecimiento de Amazon, incluyendo el proceso de Working Backwards.', 'Colin Bryar & Bill Carr', ARRAY['amazon', 'innovación', 'procesos', 'liderazgo', 'crecimiento'], 'working-backwards', 0),

-- PRODUCT MANAGEMENT (10 books)
('Continuous Discovery Habits', 'Descubrimiento de Producto', 'Descubre productos que los clientes aman. Torres presenta un enfoque estructurado para el descubrimiento continuo de productos, ayudando a los equipos a tomar mejores decisiones de producto a través de la investigación regular con clientes.', 'Teresa Torres', ARRAY['descubrimiento', 'producto', 'clientes', 'investigación', 'decisiones'], 'continuous-discovery-habits', 0),

('Crossing the Chasm', 'Adopción de Tecnología', 'Cómo llevar productos tecnológicos disruptivos al mercado masivo. Moore presenta el modelo del ciclo de vida de adopción de tecnología y estrategias específicas para cruzar el abismo entre early adopters y el mercado masivo.', 'Geoffrey A. Moore', ARRAY['tecnología', 'adopción', 'mercado', 'disrupción', 'mainstream'], 'crossing-the-chasm', 0),

('Empowered', 'Equipos de Producto', 'Equipos de producto ordinarios, productos extraordinarios. Cagan y Jones presentan cómo transformar equipos de producto tradicionales en equipos empoderados que pueden innovar y entregar valor excepcional a los clientes.', 'Marty Cagan & Chris Jones', ARRAY['equipos', 'producto', 'empoderamiento', 'innovación', 'valor'], 'empowered', 0),

('Escaping the Build Trap', 'Gestión de Producto', 'Cómo la gestión efectiva de productos crea valor real. Perri explora cómo las organizaciones pueden escapar de la trampa de construir características sin crear valor real, enfocándose en resultados en lugar de outputs.', 'Melissa Perri', ARRAY['producto', 'valor', 'resultados', 'características', 'gestión'], 'escaping-the-build-trap', 0),

('Inspired', 'Gestión de Producto', 'Cómo crear productos tecnológicos que los clientes aman. Cagan comparte las mejores prácticas de gestión de producto de las empresas tecnológicas más exitosas, desde el descubrimiento del producto hasta la entrega.', 'Marty Cagan', ARRAY['producto', 'tecnología', 'gestión', 'clientes', 'innovación'], 'inspired', 0),

('Lean Analytics', 'Métricas de Producto', 'Usa datos para construir un mejor negocio startup más rápido. Croll y Yoskovitz presentan un marco para usar analytics para validar ideas de producto, medir progreso y tomar decisiones basadas en datos.', 'Alistair Croll & Benjamin Yoskovitz', ARRAY['analytics', 'métricas', 'datos', 'startup', 'validación'], 'lean-analytics', 0),

('Sprint', 'Design Thinking', 'Cómo resolver grandes problemas y probar nuevas ideas en solo cinco días. El proceso de sprint de Google Ventures para prototipado rápido y validación de ideas, utilizado por cientos de empresas para acelerar la innovación.', 'Jake Knapp, John Zeratsky & Braden Kowitz', ARRAY['sprint', 'prototipado', 'validación', 'google-ventures', 'innovación'], 'sprint', 0),

('The Lean Product Playbook', 'Desarrollo de Producto', 'Cómo innovar con Lean Startup y Design Thinking. Olsen presenta un proceso paso a paso para construir productos que los clientes realmente quieren, desde la identificación del mercado hasta el product-market fit.', 'Dan Olsen', ARRAY['lean', 'innovación', 'product-market-fit', 'startup', 'design-thinking'], 'lean-product-playbook', 0),

('The Mom Test', 'Validación de Ideas', 'Cómo hablar con los clientes y aprender si tu negocio es una buena idea cuando todos te mienten. Fitzpatrick presenta técnicas para obtener feedback honesto y útil de clientes potenciales antes de construir el producto.', 'Rob Fitzpatrick', ARRAY['validación', 'clientes', 'feedback', 'startup', 'investigación'], 'mom-test', 0),

('Zero to One', 'Startup', 'Notas sobre startups, o cómo construir el futuro. Thiel presenta ideas contraintuitivas sobre innovación y construcción de empresas, argumentando que las empresas más valiosas crean algo completamente nuevo en lugar de competir en mercados existentes.', 'Peter Thiel & Blake Masters', ARRAY['startup', 'innovación', 'monopolio', 'futuro', 'contraintuitivo'], 'zero-to-one', 0),

-- MARKETING (10 books)
('Alchemy', 'Marketing Psicológico', 'El poder sorprendente de las ideas que no tienen sentido. Sutherland explora cómo la psicología, no la lógica, impulsa el comportamiento humano y cómo las empresas pueden usar insights psicológicos para crear valor.', 'Rory Sutherland', ARRAY['psicología', 'comportamiento', 'marketing', 'insights', 'valor'], 'alchemy', 0),

('Building a StoryBrand', 'Marketing Narrativo', 'Clarifica tu mensaje para que los clientes escuchen. Miller presenta un marco de siete partes basado en la narrativa clásica para crear mensajes de marketing claros y convincentes que resuenen con los clientes.', 'Donald Miller', ARRAY['storybrand', 'narrativa', 'mensaje', 'claridad', 'clientes'], 'building-storybrand', 0),

('Contagious', 'Marketing Viral', 'Por qué las cosas se vuelven populares. Berger identifica seis principios que hacen que el contenido se vuelva viral: moneda social, triggers, emoción, público, valor práctico y historias. Basado en años de investigación científica.', 'Jonah Berger', ARRAY['viral', 'contenido', 'popularidad', 'psicología', 'compartir'], 'contagious', 0),

('Hacking Growth', 'Growth Hacking', 'Cómo las empresas de más rápido crecimiento impulsan el éxito disruptivo. Ellis y Brown presentan el proceso sistemático de growth hacking utilizado por empresas como Facebook, Airbnb y Uber para lograr un crecimiento explosivo.', 'Sean Ellis & Morgan Brown', ARRAY['growth-hacking', 'crecimiento', 'startup', 'disruptivo', 'sistemático'], 'hacking-growth', 0),

('Hooked', 'Productos Adictivos', 'Cómo construir productos que forman hábitos. Eyal presenta el modelo Hook de cuatro pasos: trigger, acción, recompensa variable e inversión, para crear productos que los usuarios utilizan de manera habitual y frecuente.', 'Nir Eyal', ARRAY['hábitos', 'productos', 'engagement', 'psicología', 'adicción'], 'hooked', 0),

('Marketing Management', 'Marketing Estratégico', 'El texto definitivo sobre marketing estratégico y táctico. Kotler y Keller presentan conceptos fundamentales de marketing, desde segmentación y targeting hasta branding y comunicaciones integradas de marketing.', 'Philip Kotler & Kevin Lane Keller', ARRAY['marketing', 'estratégico', 'segmentación', 'branding', 'comunicaciones'], 'marketing-management', 0),

('Play Bigger', 'Category Design', 'Cómo los piratas, soñadores e innovadores crean y dominan mercados. Los autores presentan el concepto de Category Design: cómo las empresas más exitosas no solo construyen productos, sino que crean y definen categorías completamente nuevas.', 'Al Ramadan, Dave Peterson, Christopher Lochhead & Kevin Maney', ARRAY['category-design', 'mercados', 'innovación', 'categorías', 'dominación'], 'play-bigger', 0),

('Positioning', 'Posicionamiento', 'La batalla por tu mente. Ries y Trout introdujeron el concepto revolucionario de posicionamiento: cómo diferenciarse ocupando una posición única en la mente del cliente en un mercado sobrecomunicado.', 'Al Ries & Jack Trout', ARRAY['posicionamiento', 'diferenciación', 'mente', 'marketing', 'estrategia'], 'positioning', 0),

('Purple Cow', 'Marketing Diferenciado', 'Transforma tu negocio siendo extraordinario. Godin argumenta que en un mundo lleno de ruido, solo los productos y servicios extraordinarios pueden destacar y tener éxito. La clave está en ser notable desde el diseño.', 'Seth Godin', ARRAY['diferenciación', 'extraordinario', 'marketing', 'notable', 'innovación'], 'purple-cow', 0),

('This Is Marketing', 'Marketing Moderno', 'No puedes ser visto hasta que aprendas a ver. Godin presenta una nueva visión del marketing centrada en la empatía, el servicio y la creación de cambio para las personas que eliges servir.', 'Seth Godin', ARRAY['marketing', 'empatía', 'servicio', 'cambio', 'moderno'], 'this-is-marketing', 0),

-- DESIGN & UX (10 books)
('101 Design Methods', 'Métodos de Diseño', 'Una guía estructurada para la innovación en productos, servicios y experiencias. Kumar presenta 101 métodos organizados en siete modos de innovación, proporcionando un toolkit completo para diseñadores e innovadores.', 'Vijay Kumar', ARRAY['diseño', 'métodos', 'innovación', 'toolkit', 'experiencias'], '101-design-methods', 0),

('About Face', 'Diseño de Interacción', 'Los fundamentos del diseño de interacción. Cooper y su equipo presentan principios completos para diseñar productos digitales útiles y usables, desde la investigación de usuarios hasta el diseño detallado de interfaces.', 'Alan Cooper, Robert Reimann, David Cronin & Christopher Noessel', ARRAY['interacción', 'usabilidad', 'interfaces', 'usuarios', 'digital'], 'about-face', 0),

('Creative Confidence', 'Creatividad', 'Libera la creatividad que llevas dentro. Los hermanos Kelley de IDEO explican cómo desarrollar confianza creativa y aplicar design thinking para resolver problemas complejos y generar innovación en cualquier campo.', 'Tom Kelley & David Kelley', ARRAY['creatividad', 'confianza', 'design-thinking', 'ideo', 'innovación'], 'creative-confidence', 0),

('Designing for the Digital Age', 'Diseño Digital', 'Cómo crear experiencias humanas centradas a través del diseño. Goodwin presenta un proceso completo para el diseño de productos digitales, desde la investigación hasta la implementación, enfocándose en las necesidades humanas.', 'Kim Goodwin', ARRAY['diseño-digital', 'experiencias', 'humano-centrado', 'proceso', 'investigación'], 'designing-for-digital-age', 0),

('Dont Make Me Think', 'Usabilidad Web', 'Un enfoque de sentido común para la usabilidad web. Krug presenta principios simples pero poderosos para crear sitios web usables, enfatizando la navegación intuitiva y el diseño claro que no requiere pensamiento del usuario.', 'Steve Krug', ARRAY['usabilidad', 'web', 'navegación', 'intuición', 'simplicidad'], 'dont-make-me-think', 0),

('Lean UX', 'UX Ágil', 'Aplicando principios lean a la mejora de la experiencia del usuario. Gothelf y Seiden presentan un enfoque colaborativo para el diseño UX que se integra perfectamente con metodologías ágiles de desarrollo.', 'Jeff Gothelf & Josh Seiden', ARRAY['lean-ux', 'ágil', 'colaborativo', 'experiencia-usuario', 'metodologías'], 'lean-ux', 0),

('Refactoring UI', 'Diseño de Interfaces', 'Aprende a diseñar interfaces impresionantes sin formación en diseño. Wathan y Schoger presentan tácticas específicas para mejorar el diseño visual de interfaces, desde tipografía hasta color y layout.', 'Adam Wathan & Steve Schoger', ARRAY['ui', 'interfaces', 'diseño-visual', 'tipografía', 'layout'], 'refactoring-ui', 0),

('Seductive Interaction Design', 'Diseño Persuasivo', 'Creando experiencias convincentes en la web. Anderson explora cómo aplicar principios de psicología y persuasión al diseño de interacciones para crear experiencias más atractivas y efectivas.', 'Stephen Anderson', ARRAY['interacción', 'persuasivo', 'psicología', 'experiencias', 'atractivo'], 'seductive-interaction-design', 0),

('The Design of Everyday Things', 'Diseño Centrado en el Usuario', 'Los principios fundamentales del buen diseño. Norman explora conceptos clave como affordances, signifiers y feedback, explicando por qué algunos diseños funcionan y otros no desde una perspectiva cognitiva y psicológica.', 'Don Norman', ARRAY['diseño', 'usabilidad', 'cognición', 'psicología', 'affordances'], 'design-everyday-things', 0),

('The Elements of User Experience', 'Experiencia de Usuario', 'Diseño centrado en el usuario para la web y más allá. Garrett presenta un marco conceptual para entender y diseñar experiencias de usuario efectivas, desde la estrategia hasta la superficie visual.', 'Jesse James Garrett', ARRAY['experiencia-usuario', 'diseño-centrado', 'marco-conceptual', 'estrategia', 'web'], 'elements-user-experience', 0),

-- DATA & ANALYTICS (10 books)
('An Introduction to Statistical Learning', 'Aprendizaje Estadístico', 'Con aplicaciones en R. James, Witten, Hastie y Tibshirani presentan métodos estadísticos modernos para el análisis de datos, incluyendo regresión, clasificación, remuestreo y aprendizaje no supervisado.', 'Gareth James, Daniela Witten, Trevor Hastie & Robert Tibshirani', ARRAY['estadística', 'aprendizaje', 'r', 'regresión', 'clasificación'], 'intro-statistical-learning', 0),

('Be Data Literate', 'Alfabetización de Datos', 'El camino de los datos a los insights. Morrow presenta un enfoque práctico para desarrollar habilidades de alfabetización de datos, ayudando a profesionales a tomar mejores decisiones basadas en datos.', 'Jordan Morrow', ARRAY['alfabetización', 'datos', 'insights', 'decisiones', 'habilidades'], 'be-data-literate', 0),

('Data Science for Business', 'Ciencia de Datos', 'Lo que necesitas saber sobre minería de datos y pensamiento analítico orientado a datos. Los autores presentan los principios fundamentales de la ciencia de datos aplicados a problemas empresariales reales.', 'Foster Provost & Tom Fawcett', ARRAY['ciencia-datos', 'minería', 'analítica', 'negocios', 'pensamiento'], 'data-science-business', 0),

('How Charts Lie', 'Visualización de Datos', 'Cómo los gráficos pueden engañar y cómo leerlos correctamente. Cairo enseña técnicas para crear e interpretar visualizaciones de datos de manera honesta y efectiva, evitando manipulaciones comunes.', 'Alberto Cairo', ARRAY['visualización', 'gráficos', 'interpretación', 'honestidad', 'manipulación'], 'how-charts-lie', 0),

('Naked Statistics', 'Estadística Aplicada', 'Desnudando el poder de los datos. Wheelan explica conceptos estadísticos de manera accesible y entretenida, mostrando cómo la estadística afecta nuestras vidas diarias y la toma de decisiones en todos los campos.', 'Charles Wheelan', ARRAY['estadística', 'datos', 'conceptos', 'aplicación', 'decisiones'], 'naked-statistics', 0),

('Storytelling with Data', 'Narrativa con Datos', 'La comunicación efectiva con datos. Knaflic enseña técnicas para transformar datos en historias convincentes que impulsen la acción, combinando principios de análisis de datos con narrativa visual efectiva.', 'Cole Nussbaumer Knaflic', ARRAY['storytelling', 'datos', 'comunicación', 'visualización', 'narrativa'], 'storytelling-with-data', 0),

('The Signal and the Noise', 'Predicción', 'Por qué tantas predicciones fallan pero algunas no. Silver examina el arte y la ciencia de la predicción, explorando por qué algunos pronósticos son exitosos mientras que otros fallan espectacularmente.', 'Nate Silver', ARRAY['predicción', 'pronósticos', 'señal', 'ruido', 'análisis'], 'signal-and-noise', 0),

('The Visual Display of Quantitative Information', 'Visualización Cuantitativa', 'El trabajo seminal sobre visualización de datos. Tufte presenta principios fundamentales para el diseño gráfico de información estadística, enfatizando la claridad, precisión y eficiencia en la comunicación de datos.', 'Edward R. Tufte', ARRAY['visualización', 'información', 'gráfico', 'estadística', 'tufte'], 'visual-display-quantitative-info', 0),

('Thinking with Data', 'Pensamiento Analítico', 'Cómo convertir información en insights. Shron presenta un enfoque estructurado para el análisis de datos, desde la formulación de preguntas hasta la comunicación de resultados, enfocándose en el pensamiento crítico.', 'Max Shron', ARRAY['pensamiento', 'analítico', 'insights', 'análisis', 'crítico'], 'thinking-with-data', 0),

('Weapons of Math Destruction', 'Algoritmos y Sociedad', 'Cómo los big data aumentan la desigualdad y amenazan la democracia. ONeil examina cómo los algoritmos pueden perpetuar sesgos y crear injusticias, presentando casos donde los modelos matemáticos causan daño social.', 'Cathy ONeil', ARRAY['algoritmos', 'big-data', 'sesgos', 'injusticia', 'sociedad'], 'weapons-math-destruction', 0),

-- SOFTWARE DEVELOPMENT (10 books)
('A Philosophy of Software Design', 'Filosofía del Software', 'Cómo crear software que sea fácil de modificar. Ousterhout presenta principios fundamentales para el diseño de software que minimiza la complejidad y maximiza la claridad, basándose en años de experiencia en Stanford.', 'John Ousterhout', ARRAY['filosofía', 'diseño', 'complejidad', 'claridad', 'stanford'], 'philosophy-software-design', 0),

('Accelerate', 'DevOps y Rendimiento', 'La ciencia de Lean Software y DevOps: construyendo y escalando organizaciones tecnológicas de alto rendimiento. Forsgren, Humble y Kim presentan investigación sobre qué prácticas impulsan el rendimiento en entrega de software.', 'Nicole Forsgren, Jez Humble & Gene Kim', ARRAY['devops', 'rendimiento', 'lean', 'organizaciones', 'investigación'], 'accelerate', 0),

('Clean Architecture', 'Arquitectura', 'Una guía del artesano para la estructura y el diseño de software. Martin explora los principios universales de la arquitectura de software que crean sistemas mantenibles, testeable y flexibles a largo plazo.', 'Robert C. Martin', ARRAY['arquitectura', 'estructura', 'mantenibilidad', 'diseño', 'sistemas'], 'clean-architecture', 0),

('Clean Code', 'Calidad de Código', 'Un manual de artesanía de software ágil. Martin presenta principios y prácticas para escribir código limpio, legible y mantenible, con ejemplos prácticos y técnicas de refactoring que todo desarrollador debe conocer.', 'Robert C. Martin', ARRAY['código-limpio', 'legibilidad', 'mantenibilidad', 'refactoring', 'artesanía'], 'clean-code', 0),

('Designing Data-Intensive Applications', 'Sistemas Distribuidos', 'Las grandes ideas detrás de sistemas de datos confiables, escalables y mantenibles. Kleppmann explora los conceptos fundamentales para diseñar aplicaciones que manejan grandes volúmenes de datos de manera efectiva.', 'Martin Kleppmann', ARRAY['datos', 'escalabilidad', 'confiabilidad', 'distribuidos', 'sistemas'], 'designing-data-intensive-apps', 0),

('System Design Interview', 'Diseño de Sistemas', 'Una guía interna para el diseño de sistemas a gran escala. Xu presenta un enfoque estructurado para las entrevistas de diseño de sistemas, cubriendo desde conceptos básicos hasta arquitecturas complejas de sistemas distribuidos.', 'Alex Xu', ARRAY['diseño-sistemas', 'entrevistas', 'gran-escala', 'arquitecturas', 'distribuidos'], 'system-design-interview', 0),

('The DevOps Handbook', 'DevOps', 'Cómo crear agilidad, confiabilidad y seguridad de clase mundial en organizaciones tecnológicas. Los autores presentan los principios y prácticas para implementar DevOps exitosamente y transformar la entrega de software.', 'Gene Kim, Jez Humble, Patrick Debois & John Willis', ARRAY['devops', 'agilidad', 'confiabilidad', 'seguridad', 'transformación'], 'devops-handbook', 0),

('The Managers Path', 'Gestión Técnica', 'Una guía para líderes de equipos de tecnología navegando el crecimiento y el cambio. Fournier presenta consejos prácticos para la transición de desarrollador individual a líder técnico y más allá.', 'Camille Fournier', ARRAY['gestión', 'liderazgo', 'técnico', 'equipos', 'crecimiento'], 'managers-path', 0),

('The Phoenix Project', 'DevOps Narrativo', 'Una novela sobre IT, DevOps y ayudar a tu negocio a ganar. Kim, Behr y Spafford presentan los principios de DevOps a través de una historia cautivadora sobre la transformación de una empresa en crisis.', 'Gene Kim, Kevin Behr & George Spafford', ARRAY['devops', 'it', 'transformación', 'novela', 'negocios'], 'phoenix-project', 0),

('The Pragmatic Programmer', 'Desarrollo de Software', 'Tu viaje hacia la maestría. Hunt y Thomas ofrecen consejos prácticos y filosofías atemporales para convertirse en un programador más efectivo, profesional y exitoso en el desarrollo de software.', 'Andrew Hunt & David Thomas', ARRAY['programación', 'maestría', 'profesionalismo', 'pragmático', 'desarrollo'], 'pragmatic-programmer', 0),

-- PSYCHOLOGY & DECISION MAKING (9 books)
('Antifragile', 'Antifragilidad', 'Cosas que se benefician del desorden. Taleb introduce el concepto de antifragilidad: sistemas que no solo resisten el estrés y la volatilidad, sino que se fortalecen con ellos, aplicable a negocios, política y vida personal.', 'Nassim Nicholas Taleb', ARRAY['antifragilidad', 'desorden', 'volatilidad', 'sistemas', 'fortalecimiento'], 'antifragile', 0),

('Noise', 'Ruido en las Decisiones', 'Una falla en el juicio humano. Kahneman, Sibony y Sunstein exploran cómo el ruido (variabilidad no deseada en juicios) afecta las decisiones en organizaciones y cómo reducirlo para mejorar la toma de decisiones.', 'Daniel Kahneman, Olivier Sibony & Cass R. Sunstein', ARRAY['ruido', 'juicio', 'decisiones', 'variabilidad', 'organizaciones'], 'noise', 0),

('Nudge', 'Arquitectura de Decisiones', 'Mejorando las decisiones sobre salud, riqueza y felicidad. Thaler y Sunstein explican cómo pequeños cambios en la forma en que se presentan las opciones pueden mejorar significativamente las decisiones que tomamos.', 'Richard H. Thaler & Cass R. Sunstein', ARRAY['nudge', 'decisiones', 'arquitectura', 'comportamiento', 'mejora'], 'nudge', 0),

('Predictably Irrational', 'Economía Conductual', 'Las fuerzas ocultas que moldean nuestras decisiones. Ariely presenta experimentos fascinantes que revelan cómo tomamos decisiones de manera sistemáticamente irracional pero predecible, desafiando la economía tradicional.', 'Dan Ariely', ARRAY['irracionalidad', 'decisiones', 'experimentos', 'comportamiento', 'economía'], 'predictably-irrational', 0),

('Skin in the Game', 'Riesgo y Recompensa', 'Asimetrías ocultas en la vida diaria. Taleb explora el concepto de tener algo en juego y cómo las asimetrías de riesgo afectan las decisiones, desde los mercados financieros hasta la política y la ética.', 'Nassim Nicholas Taleb', ARRAY['riesgo', 'recompensa', 'asimetrías', 'decisiones', 'ética'], 'skin-in-the-game', 0),

('Superforecasting', 'Predicción Superior', 'El arte y la ciencia de la predicción. Tetlock y Gardner presentan técnicas utilizadas por los mejores pronosticadores del mundo, mostrando cómo cualquiera puede mejorar su capacidad de predicción.', 'Philip E. Tetlock & Dan Gardner', ARRAY['predicción', 'pronósticos', 'técnicas', 'superforecasting', 'capacidad'], 'superforecasting', 0),

('The Art of Thinking Clearly', 'Sesgos Cognitivos', 'Los errores sistemáticos de pensamiento que todos cometemos. Dobelli presenta 99 sesgos cognitivos comunes y cómo evitarlos para tomar mejores decisiones en la vida personal y profesional.', 'Rolf Dobelli', ARRAY['sesgos', 'pensamiento', 'errores', 'cognición', 'claridad'], 'art-thinking-clearly', 0),

('The Checklist Manifesto', 'Listas de Verificación', 'Cómo hacer las cosas bien. Gawande explora el poder de las listas de verificación simples para reducir errores y mejorar el rendimiento en campos complejos como la medicina, la aviación y la construcción.', 'Atul Gawande', ARRAY['listas', 'verificación', 'errores', 'rendimiento', 'medicina'], 'checklist-manifesto', 0),

('The Paradox of Choice', 'Paradoja de la Elección', 'Por qué más es menos. Schwartz explora cómo el exceso de opciones puede llevar a la ansiedad, la depresión y la parálisis de decisión, y presenta estrategias para navegar un mundo de opciones infinitas.', 'Barry Schwartz', ARRAY['elección', 'opciones', 'ansiedad', 'decisión', 'paradoja'], 'paradox-of-choice', 0),

('Thinking Fast and Slow', 'Psicología Cognitiva', 'Los dos sistemas que impulsan la forma en que pensamos. Kahneman distingue entre el pensamiento rápido (Sistema 1) e intuitivo y el pensamiento lento (Sistema 2) y deliberativo, y cómo ambos afectan nuestras decisiones.', 'Daniel Kahneman', ARRAY['pensamiento', 'sistemas', 'cognición', 'decisiones', 'psicología'], 'thinking-fast-slow', 0),

-- CREATIVITY & INNOVATION (10 books)
('A Technique for Producing Ideas', 'Generación de Ideas', 'El método clásico para la creatividad en publicidad y más allá. Young presenta un proceso de cinco pasos para generar ideas creativas de manera sistemática, basándose en décadas de experiencia en publicidad.', 'James Webb Young', ARRAY['ideas', 'creatividad', 'publicidad', 'proceso', 'sistemático'], 'technique-producing-ideas', 0),

('Show Your Work!', 'Compartir Creatividad', '10 maneras de compartir tu creatividad y ser descubierto. Kleon presenta estrategias para compartir tu proceso creativo y construir una audiencia para tu trabajo, enfatizando la importancia de la transparencia y la generosidad.', 'Austin Kleon', ARRAY['creatividad', 'compartir', 'audiencia', 'transparencia', 'generosidad'], 'show-your-work', 0),

('Steal Like an Artist', 'Creatividad', '10 cosas que nadie te dijo sobre ser creativo. Kleon presenta principios accesibles para liberar la creatividad, incluyendo cómo encontrar inspiración, desarrollar tu voz única y construir una carrera creativa sostenible.', 'Austin Kleon', ARRAY['creatividad', 'inspiración', 'voz', 'carrera', 'artista'], 'steal-like-artist', 0),

('Story', 'Narrativa', 'Sustancia, estructura, estilo y principios de la escritura de guiones. McKee explora los elementos fundamentales de la narrativa efectiva, aplicables tanto a guiones cinematográficos como a la comunicación empresarial y personal.', 'Robert McKee', ARRAY['narrativa', 'estructura', 'guiones', 'historia', 'comunicación'], 'story', 0),

('Storyworthy', 'Narrativa Personal', 'Involucra, enseña, persuade y cambia tu vida a través del poder de contar historias. Dicks presenta técnicas para encontrar, crear y contar historias personales convincentes que conecten con las audiencias.', 'Matthew Dicks', ARRAY['narrativa', 'historias', 'personal', 'persuasión', 'conexión'], 'storyworthy', 0),

('The Anatomy of Story', 'Estructura Narrativa', 'Los 22 pasos para convertirse en un escritor maestro. Truby presenta un enfoque integral para la construcción de historias, desde la premisa hasta la estructura, aplicable a novelas, guiones y narrativa empresarial.', 'John Truby', ARRAY['estructura', 'narrativa', 'escritura', 'historias', 'maestría'], 'anatomy-of-story', 0),

('The Artists Way', 'Creatividad Espiritual', 'Un camino espiritual hacia la creatividad superior. Cameron presenta un programa de 12 semanas para recuperar y desarrollar la creatividad, incluyendo técnicas como las páginas matutinas y las citas con el artista interior.', 'Julia Cameron', ARRAY['creatividad', 'espiritual', 'programa', 'artista', 'recuperación'], 'artists-way', 0),

('The Creative Habit', 'Hábitos Creativos', 'Aprende a usarla de por vida. Tharp comparte rutinas y ejercicios para desarrollar y mantener la creatividad como un hábito diario, basándose en su experiencia como una de las coreógrafas más exitosas del mundo.', 'Twyla Tharp', ARRAY['creatividad', 'hábitos', 'rutinas', 'disciplina', 'arte'], 'creative-habit', 0),

('The Hero with a Thousand Faces', 'Monomito', 'El patrón universal de la aventura del héroe. Campbell presenta el monomito, la estructura narrativa común encontrada en mitos y historias de todas las culturas, influyendo profundamente en la narrativa moderna.', 'Joseph Campbell', ARRAY['monomito', 'héroe', 'mitos', 'narrativa', 'universal'], 'hero-thousand-  'Joseph Campbell', ARRAY['monomito', 'héroe', 'mitos', 'narrativa', 'universal'], 'hero-thousand-faces', 0),

('The War of Art', 'Resistencia Creativa', 'Rompe las barreras y gana tus batallas creativas internas. Pressfield identifica la Resistencia como el enemigo número uno de la creatividad y presenta estrategias para superarla y hacer el trabajo creativo que importa.', 'Steven Pressfield', ARRAY['resistencia', 'creatividad', 'barreras', 'guerra', 'trabajo'], 'war-of-art', 0),

-- FINANCE & INVESTING (10 books)
('A Random Walk Down Wall Street', 'Inversión', 'La estrategia de inversión probada en el tiempo para el inversor exitoso. Malkiel presenta el caso convincente para la inversión en fondos indexados y la teoría del mercado eficiente como base para una estrategia de inversión sólida.', 'Burton G. Malkiel', ARRAY['inversión', 'índices', 'mercado-eficiente', 'wall-street', 'estrategia'], 'random-walk-wall-street', 0),

('Accounting Made Simple', 'Contabilidad', 'Explicación de contabilidad en 100 páginas o menos. Piper presenta los conceptos fundamentales de contabilidad de manera clara y concisa, ideal para emprendedores y profesionales que necesitan entender estados financieros.', 'Mike Piper', ARRAY['contabilidad', 'estados-financieros', 'emprendedores', 'conceptos', 'simple'], 'accounting-made-simple', 0),

('Common Sense on Mutual Funds', 'Fondos Mutuos', 'Nuevos imperativos para el inversor inteligente. Bogle, fundador de Vanguard, presenta principios fundamentales para la inversión en fondos mutuos, enfatizando costos bajos y estrategias a largo plazo.', 'John C. Bogle', ARRAY['fondos-mutuos', 'vanguard', 'costos-bajos', 'largo-plazo', 'inversión'], 'common-sense-mutual-funds', 0),

('Financial Intelligence', 'Inteligencia Financiera', 'Una guía del gerente para saber lo que realmente significan los números. Berman y Knight presentan conceptos financieros esenciales para profesionales no financieros, incluyendo estados financieros y métricas clave.', 'Karen Berman & Joe Knight', ARRAY['inteligencia-financiera', 'gerentes', 'números', 'métricas', 'profesionales'], 'financial-intelligence', 0),

('I Will Teach You to Be Rich', 'Finanzas Personales', 'Un programa de 6 semanas sin culpa para manejar tu dinero. Sethi presenta un enfoque práctico y automatizado para las finanzas personales, desde la creación de presupuestos hasta las inversiones y la optimización de gastos.', 'Ramit Sethi', ARRAY['finanzas-personales', 'dinero', 'automatización', 'presupuesto', 'optimización'], 'i-will-teach-you-rich', 0),

('Rich Dad Poor Dad', 'Educación Financiera', 'Lo que los ricos enseñan a sus hijos sobre el dinero que los pobres y la clase media no. Kiyosaki contrasta las lecciones de sus dos padres sobre conceptos fundamentales como activos, pasivos y la importancia de la educación financiera.', 'Robert T. Kiyosaki & Sharon Lechter', ARRAY['educación-financiera', 'activos', 'pasivos', 'riqueza', 'dinero'], 'rich-dad-poor-dad', 0),

('The Little Book of Common Sense Investing', 'Inversión Indexada', 'La única manera de garantizar tu parte justa de los rendimientos del mercado de valores. Bogle presenta el caso para la inversión en fondos indexados como la estrategia más efectiva para la mayoría de los inversores.', 'John C. Bogle', ARRAY['inversión-indexada', 'fondos-índice', 'mercado-valores', 'rendimientos', 'efectiva'], 'little-book-common-sense-investing', 0),

('The Personal MBA', 'Educación Empresarial', 'Domina el arte de los negocios. Kaufman presenta los conceptos empresariales más esenciales de manera accesible y práctica, cubriendo desde marketing y ventas hasta finanzas y operaciones, sin necesidad de un MBA formal.', 'Josh Kaufman', ARRAY['mba', 'negocios', 'conceptos', 'educación', 'empresarial'], 'personal-mba', 0),

('The Psychology of Money', 'Psicología Financiera', 'Lecciones atemporales sobre riqueza, codicia y felicidad. Housel explora cómo la psicología, más que la inteligencia técnica o el conocimiento financiero, determina el éxito financiero a largo plazo.', 'Morgan Housel', ARRAY['psicología', 'dinero', 'riqueza', 'comportamiento', 'inversión'], 'psychology-of-money', 0);

-- Update platform configuration with knowledge base statistics
INSERT INTO platform_config (key, value, description) VALUES
('brain_knowledge_count', (SELECT COUNT(*)::text FROM knowledge_base), 'Total number of books in knowledge base'),
('brain_categories_count', (SELECT COUNT(DISTINCT category)::text FROM knowledge_base), 'Number of knowledge categories'),
('brain_total_authors', (SELECT COUNT(DISTINCT author)::text FROM knowledge_base), 'Total number of unique authors'),
('brain_last_updated', NOW()::text, 'Last knowledge base update timestamp')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Verify the data was inserted correctly and show summary by category
SELECT 
    'Knowledge base populated successfully!' as status,
    COUNT(*) as total_books,
    COUNT(DISTINCT category) as categories,
    COUNT(DISTINCT author) as authors
FROM knowledge_base;

-- Show breakdown by category
SELECT 
    category,
    COUNT(*) as book_count,
    string_agg(DISTINCT author, ', ' ORDER BY author) as sample_authors
FROM knowledge_base
GROUP BY category
ORDER BY book_count DESC;

COMMIT;
