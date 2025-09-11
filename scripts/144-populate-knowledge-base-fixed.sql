-- Fixed Knowledge Base Population Script
-- Adding professional development books to the platform brain

BEGIN;

-- Clear existing knowledge base to avoid duplicates
DELETE FROM knowledge_base;

-- Reset the sequence
ALTER SEQUENCE knowledge_base_id_seq RESTART WITH 1;

-- Insert books in smaller batches to avoid syntax issues
INSERT INTO knowledge_base (title, category, content, author, tags, slug, read_count) VALUES
-- CAREER DEVELOPMENT
('Designing Your Life', 'Desarrollo de Carrera', 'Guía práctica para aplicar design thinking a tu carrera y vida. Enfoque sistemático para crear una vida profesional significativa usando herramientas de diseño.', 'Bill Burnett & Dave Evans', ARRAY['carrera', 'diseño', 'vida', 'propósito'], 'designing-your-life', 0),
('Drive', 'Motivación', 'Explora la ciencia de la motivación humana. Demuestra que autonomía, maestría y propósito son más efectivos que recompensas tradicionales.', 'Daniel H. Pink', ARRAY['motivación', 'psicología', 'rendimiento'], 'drive', 0),
('Grit', 'Desarrollo Personal', 'El poder de la pasión y perseverancia para el éxito. La combinación de pasión y persistencia es más predictiva del éxito que el talento natural.', 'Angela Duckworth', ARRAY['perseverancia', 'éxito', 'psicología'], 'grit', 0),
('Mindset', 'Psicología', 'Diferencia entre mentalidad fija y de crecimiento. Cómo nuestras creencias sobre habilidades afectan el éxito y transforman carrera y vida.', 'Carol S. Dweck', ARRAY['mentalidad', 'crecimiento', 'aprendizaje'], 'mindset', 0),
('Peak', 'Aprendizaje', 'Secretos de la práctica deliberada para mejorar cualquier habilidad. Marco científico para el desarrollo de expertise desmitificando el talento natural.', 'Anders Ericsson & Robert Pool', ARRAY['práctica', 'expertise', 'habilidades'], 'peak', 0),

-- PRODUCTIVITY
('Atomic Habits', 'Productividad', 'Enfoque sistemático para formar buenos hábitos. Concepto de mejoras del 1% y poder del interés compuesto en hábitos para resultados extraordinarios.', 'James Clear', ARRAY['hábitos', 'productividad', 'cambio'], 'atomic-habits', 0),
('Deep Work', 'Productividad', 'Capacidad de concentrarse sin distracción en tareas cognitivamente demandantes. Estrategias para cultivar esta habilidad y producir trabajo de alta calidad.', 'Cal Newport', ARRAY['concentración', 'productividad', 'trabajo-profundo'], 'deep-work', 0),
('Getting Things Done', 'Productividad', 'Sistema completo de gestión de tareas y proyectos. Metodologías para capturar, clarificar, organizar y revisar responsabilidades de la vida.', 'David Allen', ARRAY['gtd', 'organización', 'tareas'], 'getting-things-done', 0),
('The One Thing', 'Productividad', 'El éxito extraordinario viene de enfocarse en una cosa. Estrategias para identificar la actividad más importante que facilita todo lo demás.', 'Gary Keller & Jay Papasan', ARRAY['enfoque', 'prioridades', 'éxito'], 'the-one-thing', 0),
('Essentialism', 'Productividad', 'Disciplina de hacer menos pero mejor. Enfoque sistemático para identificar lo esencial y eliminar lo demás para contribuciones significativas.', 'Greg McKeown', ARRAY['esencialismo', 'prioridades', 'enfoque'], 'essentialism', 0),

-- COMMUNICATION
('Made to Stick', 'Comunicación', 'Por qué algunas ideas sobreviven y otras mueren. Modelo SUCCESS para crear mensajes memorables y principios para ideas pegajosas.', 'Chip Heath & Dan Heath', ARRAY['comunicación', 'ideas', 'memorable'], 'made-to-stick', 0),
('Talk Like TED', 'Presentaciones', 'Secretos de presentaciones extraordinarias analizando charlas TED populares. Nueve técnicas de los mejores oradores para inspirar y persuadir.', 'Carmine Gallo', ARRAY['presentaciones', 'ted', 'oratoria'], 'talk-like-ted', 0),
('Resonate', 'Presentaciones', 'Crear presentaciones que muevan audiencias a la acción. Principios para mensajes que resuenen profundamente basados en presentaciones persuasivas históricas.', 'Nancy Duarte', ARRAY['presentaciones', 'persuasión', 'audiencia'], 'resonate', 0),
('The Pyramid Principle', 'Comunicación Estructurada', 'Metodología para estructurar pensamiento y comunicación lógica. Técnicas para organizar ideas en estructura piramidal que facilita comprensión.', 'Barbara Minto', ARRAY['estructura', 'lógica', 'comunicación'], 'pyramid-principle', 0),
('On Writing Well', 'Escritura', 'Uno de los mejores libros sobre escritura no ficción. Importancia de simplicidad, claridad y humanidad en escritura con principios atemporales.', 'William Zinsser', ARRAY['escritura', 'claridad', 'no-ficción'], 'on-writing-well', 0),

-- LEADERSHIP
('Extreme Ownership', 'Liderazgo', 'Principios de liderazgo Navy SEALs aplicados al mundo empresarial. Responsabilidad extrema donde líderes asumen responsabilidad total de equipos y resultados.', 'Jocko Willink & Leif Babin', ARRAY['liderazgo', 'responsabilidad', 'equipos'], 'extreme-ownership', 0),
('Leaders Eat Last', 'Liderazgo', 'Por qué algunos equipos se unen y otros no. Concepto del círculo de seguridad y cómo líderes crean ambientes seguros y motivadores.', 'Simon Sinek', ARRAY['liderazgo', 'seguridad', 'equipos'], 'leaders-eat-last', 0),
('The Five Dysfunctions of a Team', 'Trabajo en Equipo', 'Modelo para construir equipos cohesivos. Cinco disfunciones: ausencia de confianza, miedo al conflicto, falta de compromiso, evitación de responsabilidad, falta de atención a resultados.', 'Patrick Lencioni', ARRAY['equipos', 'disfunciones', 'confianza'], 'five-dysfunctions-team', 0),
('Radical Candor', 'Gestión', 'Ser mejor jefe a través de cuidado personal y desafío directo. Marco para dar feedback efectivo que ayude a crecer manteniendo relaciones sólidas.', 'Kim Scott', ARRAY['feedback', 'gestión', 'cuidado'], 'radical-candor', 0),
('Multipliers', 'Liderazgo', 'Líderes que amplifican inteligencia de otros vs los que la disminuyen. Cinco disciplinas de Multiplicadores y cómo desarrollar estas capacidades.', 'Liz Wiseman', ARRAY['liderazgo', 'inteligencia', 'multiplicadores'], 'multipliers', 0),

-- STRATEGY
('Good to Great', 'Excelencia Empresarial', 'Qué hace que empresas salten de buenas a grandiosas. Factores distintivos: liderazgo Nivel 5, primero quién luego qué, hechos brutales, concepto del erizo.', 'Jim Collins', ARRAY['excelencia', 'liderazgo', 'transformación'], 'good-to-great', 0),
('Blue Ocean Strategy', 'Estrategia', 'Crear espacios de mercado sin competencia haciendo competencia irrelevante. Herramientas para identificar y capturar océanos azules de oportunidad no disputada.', 'W. Chan Kim & Renée Mauborgne', ARRAY['estrategia', 'océano-azul', 'competencia'], 'blue-ocean-strategy', 0),
('The Innovators Dilemma', 'Innovación', 'Por qué empresas exitosas fallan ante innovación disruptiva. Cómo tecnologías disruptivas derriban líderes establecidos y estrategias para navegar innovación.', 'Clayton M. Christensen', ARRAY['innovación', 'disrupción', 'tecnología'], 'innovators-dilemma', 0),
('Execution', 'Ejecución', 'Disciplina de hacer que las cosas sucedan. La ejecución es la mayor deficiencia en negocios. Sistema para cerrar brecha entre estrategia y resultados.', 'Larry Bossidy & Ram Charan', ARRAY['ejecución', 'estrategia', 'resultados'], 'execution', 0),
('Measure What Matters', 'OKRs', 'Sistema de objetivos y resultados clave que impulsa crecimiento exponencial. Cómo OKRs ayudaron a Google e Intel lograr crecimiento extraordinario.', 'John Doerr', ARRAY['okrs', 'objetivos', 'medición'], 'measure-what-matters', 0),

-- PRODUCT MANAGEMENT
('Inspired', 'Gestión de Producto', 'Crear productos tecnológicos que clientes aman. Mejores prácticas de gestión de producto de empresas tecnológicas exitosas, desde descubrimiento hasta entrega.', 'Marty Cagan', ARRAY['producto', 'tecnología', 'gestión'], 'inspired', 0),
('The Lean Product Playbook', 'Desarrollo de Producto', 'Innovar con Lean Startup y Design Thinking. Proceso paso a paso para construir productos que clientes quieren, desde identificación de mercado hasta product-market fit.', 'Dan Olsen', ARRAY['lean', 'innovación', 'product-market-fit'], 'lean-product-playbook', 0),
('Crossing the Chasm', 'Adopción de Tecnología', 'Llevar productos tecnológicos disruptivos al mercado masivo. Modelo de ciclo de vida de adopción y estrategias para cruzar abismo entre early adopters y mercado masivo.', 'Geoffrey A. Moore', ARRAY['tecnología', 'adopción', 'mercado'], 'crossing-the-chasm', 0),
('The Mom Test', 'Validación de Ideas', 'Hablar con clientes y aprender si tu negocio es buena idea cuando todos mienten. Técnicas para obtener feedback honesto y útil de clientes potenciales.', 'Rob Fitzpatrick', ARRAY['validación', 'clientes', 'feedback'], 'mom-test', 0),
('Sprint', 'Design Thinking', 'Resolver grandes problemas y probar nuevas ideas en cinco días. Proceso de sprint de Google Ventures para prototipado rápido y validación de ideas.', 'Jake Knapp, John Zeratsky & Braden Kowitz', ARRAY['sprint', 'prototipado', 'validación'], 'sprint', 0),

-- MARKETING
('Purple Cow', 'Marketing Diferenciado', 'Transforma tu negocio siendo extraordinario. En mundo lleno de ruido, solo productos extraordinarios pueden destacar y tener éxito.', 'Seth Godin', ARRAY['diferenciación', 'extraordinario', 'marketing'], 'purple-cow', 0),
('Contagious', 'Marketing Viral', 'Por qué las cosas se vuelven populares. Seis principios para contenido viral: moneda social, triggers, emoción, público, valor práctico, historias.', 'Jonah Berger', ARRAY['viral', 'contenido', 'popularidad'], 'contagious', 0),
('Building a StoryBrand', 'Marketing Narrativo', 'Clarifica tu mensaje para que clientes escuchen. Marco de siete partes basado en narrativa para mensajes de marketing claros y convincentes.', 'Donald Miller', ARRAY['storybrand', 'narrativa', 'mensaje'], 'building-storybrand', 0),
('Hooked', 'Productos Adictivos', 'Construir productos que forman hábitos. Modelo Hook de cuatro pasos: trigger, acción, recompensa variable, inversión para productos de uso habitual.', 'Nir Eyal', ARRAY['hábitos', 'productos', 'engagement'], 'hooked', 0),
('Positioning', 'Posicionamiento', 'La batalla por tu mente. Concepto revolucionario de posicionamiento: diferenciarse ocupando posición única en mente del cliente en mercado sobrecomunicado.', 'Al Ries & Jack Trout', ARRAY['posicionamiento', 'diferenciación', 'mente'], 'positioning', 0),

-- DESIGN & UX
('Dont Make Me Think', 'Usabilidad Web', 'Enfoque de sentido común para usabilidad web. Principios simples pero poderosos para sitios web usables, enfatizando navegación intuitiva y diseño claro.', 'Steve Krug', ARRAY['usabilidad', 'web', 'navegación'], 'dont-make-me-think', 0),
('The Design of Everyday Things', 'Diseño Centrado en el Usuario', 'Principios fundamentales del buen diseño. Conceptos clave como affordances, signifiers y feedback, explicando por qué algunos diseños funcionan desde perspectiva cognitiva.', 'Don Norman', ARRAY['diseño', 'usabilidad', 'cognición'], 'design-everyday-things', 0),
('About Face', 'Diseño de Interacción', 'Fundamentos del diseño de interacción. Principios para diseñar productos digitales útiles y usables, desde investigación de usuarios hasta diseño detallado de interfaces.', 'Alan Cooper, Robert Reimann, David Cronin & Christopher Noessel', ARRAY['interacción', 'usabilidad', 'interfaces'], 'about-face', 0),
('Creative Confidence', 'Creatividad', 'Libera la creatividad que llevas dentro. Cómo desarrollar confianza creativa y aplicar design thinking para resolver problemas y generar innovación.', 'Tom Kelley & David Kelley', ARRAY['creatividad', 'confianza', 'design-thinking'], 'creative-confidence', 0),
('101 Design Methods', 'Métodos de Diseño', 'Guía estructurada para innovación en productos, servicios y experiencias. 101 métodos organizados en siete modos de innovación, toolkit completo para diseñadores.', 'Vijay Kumar', ARRAY['diseño', 'métodos', 'innovación'], '101-design-methods', 0),

-- DATA & ANALYTICS
('Storytelling with Data', 'Narrativa con Datos', 'Comunicación efectiva con datos. Técnicas para transformar datos en historias convincentes que impulsen acción, combinando análisis con narrativa visual.', 'Cole Nussbaumer Knaflic', ARRAY['storytelling', 'datos', 'comunicación'], 'storytelling-with-data', 0),
('Naked Statistics', 'Estadística Aplicada', 'Desnudando el poder de los datos. Conceptos estadísticos de manera accesible y entretenida, mostrando cómo estadística afecta vidas diarias y decisiones.', 'Charles Wheelan', ARRAY['estadística', 'datos', 'conceptos'], 'naked-statistics', 0),
('The Signal and the Noise', 'Predicción', 'Por qué tantas predicciones fallan pero algunas no. Arte y ciencia de predicción, examinando por qué algunos pronósticos son exitosos mientras otros fallan.', 'Nate Silver', ARRAY['predicción', 'pronósticos', 'señal'], 'signal-and-noise', 0),
('Data Science for Business', 'Ciencia de Datos', 'Lo necesario sobre minería de datos y pensamiento analítico. Principios fundamentales de ciencia de datos aplicados a problemas empresariales.', 'Foster Provost & Tom Fawcett', ARRAY['ciencia-datos', 'minería', 'analítica'], 'data-science-business', 0),
('How Charts Lie', 'Visualización de Datos', 'Cómo gráficos pueden engañar y cómo leerlos correctamente. Técnicas para crear e interpretar visualizaciones de datos de manera honesta y efectiva.', 'Alberto Cairo', ARRAY['visualización', 'gráficos', 'interpretación'], 'how-charts-lie', 0),

-- SOFTWARE DEVELOPMENT
('Clean Code', 'Calidad de Código', 'Manual de artesanía de software ágil. Principios y prácticas para escribir código limpio, legible y mantenible, con ejemplos prácticos y técnicas de refactoring.', 'Robert C. Martin', ARRAY['código-limpio', 'legibilidad', 'mantenibilidad'], 'clean-code', 0),
('The Pragmatic Programmer', 'Desarrollo de Software', 'Tu viaje hacia la maestría. Consejos prácticos y filosofías para convertirse en programador más efectivo y profesional.', 'Andrew Hunt & David Thomas', ARRAY['programación', 'maestría', 'profesionalismo'], 'pragmatic-programmer', 0),
('Clean Architecture', 'Arquitectura', 'Guía del artesano para estructura y diseño de software. Principios de arquitectura de software que crean sistemas mantenibles, testeable y flexibles.', 'Robert C. Martin', ARRAY['arquitectura', 'estructura', 'mantenibilidad'], 'clean-architecture', 0),
('Designing Data-Intensive Applications', 'Sistemas Distribuidos', 'Grandes ideas detrás de sistemas de datos confiables, escalables y mantenibles. Conceptos fundamentales para diseñar aplicaciones que manejan grandes volúmenes de datos.', 'Martin Kleppmann', ARRAY['datos', 'escalabilidad', 'confiabilidad'], 'designing-data-intensive-apps', 0),
('The DevOps Handbook', 'DevOps', 'Crear agilidad, confiabilidad y seguridad de clase mundial en organizaciones tecnológicas. Principios y prácticas para implementar DevOps exitosamente.', 'Gene Kim, Jez Humble, Patrick Debois & John Willis', ARRAY['devops', 'agilidad', 'confiabilidad'], 'devops-handbook', 0),

-- PSYCHOLOGY & DECISION MAKING
('Thinking Fast and Slow', 'Psicología Cognitiva', 'Los dos sistemas que impulsan la forma en que pensamos. Distinción entre pensamiento rápido (Sistema 1) y lento (Sistema 2), y cómo ambos afectan decisiones.', 'Daniel Kahneman', ARRAY['pensamiento', 'sistemas', 'cognición'], 'thinking-fast-slow', 0),
('Influence', 'Psicología de la Persuasión', 'Seis principios universales de influencia: reciprocidad, compromiso/consistencia, prueba social, autoridad, simpatía y escasez. Insights científicos sobre por qué personas dicen sí.', 'Robert B. Cialdini', ARRAY['influencia', 'persuasión', 'psicología'], 'influence', 0),
('Nudge', 'Arquitectura de Decisiones', 'Mejorando decisiones sobre salud, riqueza y felicidad. Cómo pequeños cambios en presentación de opciones pueden mejorar significativamente decisiones.', 'Richard H. Thaler & Cass R. Sunstein', ARRAY['nudge', 'decisiones', 'arquitectura'], 'nudge', 0),
('Predictably Irrational', 'Economía Conductual', 'Fuerzas ocultas que moldean nuestras decisiones. Experimentos que revelan cómo tomamos decisiones de manera sistemáticamente irracional pero predecible.', 'Dan Ariely', ARRAY['irracionalidad', 'decisiones', 'experimentos'], 'predictably-irrational', 0),
('The Art of Thinking Clearly', 'Sesgos Cognitivos', 'Errores sistemáticos de pensamiento que todos cometemos. 99 sesgos cognitivos comunes y cómo evitarlos para tomar mejores decisiones.', 'Rolf Dobelli', ARRAY['sesgos', 'pensamiento', 'errores'], 'art-thinking-clearly', 0),

-- CREATIVITY & INNOVATION
('The Artists Way', 'Creatividad Espiritual', 'Camino espiritual hacia creatividad superior. Programa de 12 semanas para recuperar y desarrollar creatividad, incluyendo técnicas como páginas matutinas.', 'Julia Cameron', ARRAY['creatividad', 'espiritual', 'programa'], 'artists-way', 0),
('Steal Like an Artist', 'Creatividad', 'Cosas que nadie te dijo sobre ser creativo. Principios para liberar creatividad, incluyendo cómo encontrar inspiración, desarrollar voz y construir carrera creativa.', 'Austin Kleon', ARRAY['creatividad', 'inspiración', 'voz'], 'steal-like-artist', 0),
('The War of Art', 'Resistencia Creativa', 'Rompe barreras y gana batallas creativas internas. Identifica Resistencia como enemigo de creatividad y presenta estrategias para superarla y hacer trabajo creativo.', 'Steven Pressfield', ARRAY['resistencia', 'creatividad', 'barreras'], 'war-of-art', 0),
('Story', 'Narrativa', 'Sustancia, estructura, estilo y principios de escritura de guiones. Elementos fundamentales de narrativa efectiva, aplicables tanto a guiones como comunicación empresarial.', 'Robert McKee', ARRAY['narrativa', 'estructura', 'guiones'], 'story', 0),
('The Creative Habit', 'Hábitos Creativos', 'Aprende a usarla de por vida. Rutinas y ejercicios para desarrollar y mantener creatividad como hábito diario, basándose en experiencia como coreógrafa.', 'Twyla Tharp', ARRAY['creatividad', 'hábitos', 'rutinas'], 'creative-habit', 0),

-- FINANCE & INVESTING
('Rich Dad Poor Dad', 'Educación Financiera', 'Lo que ricos enseñan a sus hijos sobre dinero que pobres y clase media no. Conceptos sobre activos, pasivos y importancia de educación financiera.', 'Robert T. Kiyosaki & Sharon Lechter', ARRAY['educación-financiera', 'activos', 'pasivos'], 'rich-dad-poor-dad', 0),
('The Psychology of Money', 'Psicología Financiera', 'Lecciones atemporales sobre riqueza, codicia y felicidad. Cómo psicología, más que inteligencia técnica, determina éxito financiero.', 'Morgan Housel', ARRAY['psicología', 'dinero', 'riqueza'], 'psychology-of-money', 0),
('A Random Walk Down Wall Street', 'Inversión', 'Estrategia de inversión probada en el tiempo para inversor exitoso. Caso para inversión en índices y teoría del mercado eficiente.', 'Burton G. Malkiel', ARRAY['inversión', 'índices', 'mercado-eficiente'], 'random-walk-wall-street', 0),
('I Will Teach You to Be Rich', 'Finanzas Personales', 'Programa de 6 semanas sin culpa para manejar tu dinero. Enfoque práctico y automatizado para finanzas personales, desde presupuestos hasta inversiones.', 'Ramit Sethi', ARRAY['finanzas-personales', 'dinero', 'automatización'], 'i-will-teach-you-rich', 0),
('The Personal MBA', 'Educación Empresarial', 'Domina el arte de los negocios. Conceptos empresariales esenciales de manera accesible, cubriendo desde marketing hasta finanzas y operaciones.', 'Josh Kaufman', ARRAY['mba', 'negocios', 'conceptos'], 'personal-mba', 0);

-- Update knowledge base statistics
INSERT INTO platform_config (key, value, description) VALUES
('brain_knowledge_count', (SELECT COUNT(*)::text FROM knowledge_base), 'Total number of books in knowledge base'),
('brain_categories', (SELECT string_agg(DISTINCT category, ',') FROM knowledge_base), 'Available knowledge categories'),
('brain_last_updated', NOW()::text, 'Last knowledge base update timestamp')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_search ON knowledge_base USING GIN(to_tsvector('spanish', title || ' ' || content));

SELECT 'Knowledge base populated successfully with ' || COUNT(*) || ' books' as status
FROM knowledge_base;

COMMIT;
