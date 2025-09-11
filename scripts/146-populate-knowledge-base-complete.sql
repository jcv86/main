-- Complete Knowledge Base Population with Professional Development Books
BEGIN;

-- Clear existing knowledge base to avoid duplicates
DELETE FROM knowledge_base;

-- Reset the sequence
ALTER SEQUENCE knowledge_base_id_seq RESTART WITH 1;

-- Insert comprehensive professional development library
INSERT INTO knowledge_base (title, category, content, author, tags, slug, read_count) VALUES

-- CAREER DEVELOPMENT (5 books)
('Designing Your Life', 'Desarrollo de Carrera', 'Guía práctica para aplicar design thinking a tu carrera y vida. Los autores, profesores de Stanford, presentan un enfoque sistemático para crear una vida profesional significativa usando herramientas de diseño. Incluye ejercicios para identificar valores, explorar opciones y crear prototipos de vida.', 'Bill Burnett & Dave Evans', ARRAY['carrera', 'diseño', 'vida', 'propósito', 'stanford'], 'designing-your-life', 0),

('Drive', 'Motivación', 'Explora la ciencia de la motivación humana basándose en décadas de investigación. Demuestra que la autonomía, maestría y propósito son más efectivos que las recompensas tradicionales para motivar el rendimiento. Revoluciona la comprensión de qué nos impulsa realmente.', 'Daniel H. Pink', ARRAY['motivación', 'psicología', 'rendimiento', 'autonomía', 'propósito'], 'drive', 0),

('Grit', 'Desarrollo Personal', 'El poder de la pasión y perseverancia para el éxito a largo plazo. La investigación de Duckworth demuestra que la combinación de pasión y persistencia es más predictiva del éxito que el talento natural. Incluye estrategias para desarrollar resistencia mental.', 'Angela Duckworth', ARRAY['perseverancia', 'éxito', 'psicología', 'resistencia', 'talento'], 'grit', 0),

('Mindset', 'Psicología', 'La diferencia entre mentalidad fija y de crecimiento. Dweck explica cómo nuestras creencias sobre nuestras habilidades afectan profundamente el éxito y cómo adoptar una mentalidad de crecimiento puede transformar tu carrera y vida personal.', 'Carol S. Dweck', ARRAY['mentalidad', 'crecimiento', 'aprendizaje', 'psicología', 'éxito'], 'mindset', 0),

('Peak', 'Aprendizaje', 'Los secretos de la práctica deliberada para mejorar en cualquier habilidad. Ericsson desmitifica el talento natural y presenta un marco científico para el desarrollo de expertise a través de práctica estructurada y retroalimentación constante.', 'Anders Ericsson & Robert Pool', ARRAY['práctica', 'expertise', 'habilidades', 'aprendizaje', 'deliberada'], 'peak', 0),

-- PRODUCTIVITY & HABITS (5 books)
('Atomic Habits', 'Productividad', 'Un enfoque sistemático para formar buenos hábitos y romper los malos. Clear presenta el concepto de mejoras del 1% y el poder del interés compuesto en los hábitos para lograr resultados extraordinarios. Incluye el marco de los cuatro pasos para el cambio de comportamiento.', 'James Clear', ARRAY['hábitos', 'productividad', 'cambio', 'comportamiento', 'sistemas'], 'atomic-habits', 0),

('Deep Work', 'Productividad', 'La capacidad de concentrarse sin distracción en tareas cognitivamente demandantes. Newport presenta estrategias para cultivar esta habilidad cada vez más rara pero valiosa, y cómo usarla para producir trabajo de alta calidad de manera eficiente.', 'Cal Newport', ARRAY['concentración', 'productividad', 'trabajo-profundo', 'distracción', 'enfoque'], 'deep-work', 0),

('Getting Things Done', 'Productividad', 'Sistema completo de gestión de tareas y proyectos para lograr productividad sin estrés. Allen presenta metodologías probadas para capturar, clarificar, organizar y revisar todas las responsabilidades de tu vida profesional y personal.', 'David Allen', ARRAY['gtd', 'organización', 'tareas', 'productividad', 'sistema'], 'getting-things-done', 0),

('The One Thing', 'Productividad', 'El éxito extraordinario viene de enfocarse en una cosa a la vez. Los autores presentan estrategias para identificar la actividad más importante que hará que todo lo demás sea más fácil o innecesario, eliminando la multitarea y maximizando resultados.', 'Gary Keller & Jay Papasan', ARRAY['enfoque', 'prioridades', 'éxito', 'productividad', 'simplicidad'], 'the-one-thing', 0),

('Essentialism', 'Productividad', 'La disciplina de hacer menos pero mejor. McKeown presenta un enfoque sistemático para identificar lo verdaderamente esencial y eliminar todo lo demás, permitiendo hacer las contribuciones más significativas posibles.', 'Greg McKeown', ARRAY['esencialismo', 'prioridades', 'enfoque', 'simplicidad', 'disciplina'], 'essentialism', 0),

-- COMMUNICATION & WRITING (5 books)
('Made to Stick', 'Comunicación', 'Por qué algunas ideas sobreviven y otras mueren. Los hermanos Heath presentan el modelo SUCCESS para crear mensajes memorables y los principios fundamentales que hacen que las ideas sean pegajosas y perduren en la memoria.', 'Chip Heath & Dan Heath', ARRAY['comunicación', 'ideas', 'memorable', 'persuasión', 'narrativa'], 'made-to-stick', 0),

('Talk Like TED', 'Presentaciones', 'Los secretos de las presentaciones extraordinarias analizando las charlas TED más populares. Gallo identifica nueve técnicas utilizadas por los mejores oradores del mundo para inspirar, persuadir y motivar a sus audiencias.', 'Carmine Gallo', ARRAY['presentaciones', 'ted', 'oratoria', 'inspiración', 'persuasión'], 'talk-like-ted', 0),

('Resonate', 'Presentaciones', 'Cómo crear presentaciones que muevan a las audiencias a la acción. Duarte presenta principios para crear mensajes que resuenen profundamente, basándose en el análisis de las presentaciones más persuasivas de la historia.', 'Nancy Duarte', ARRAY['presentaciones', 'persuasión', 'audiencia', 'narrativa', 'acción'], 'resonate', 0),

('The Pyramid Principle', 'Comunicación Estructurada', 'La metodología para estructurar el pensamiento y la comunicación de manera lógica. Minto presenta técnicas para organizar ideas en una estructura piramidal que facilita la comprensión y persuasión en comunicación empresarial.', 'Barbara Minto', ARRAY['estructura', 'lógica', 'comunicación', 'pensamiento', 'claridad'], 'pyramid-principle', 0),

('On Writing Well', 'Escritura', 'Considerado uno de los mejores libros sobre escritura de no ficción. Zinsser enfatiza la importancia de la simplicidad, claridad y humanidad en la escritura, ofreciendo principios atemporales para comunicación efectiva.', 'William Zinsser', ARRAY['escritura', 'claridad', 'no-ficción', 'simplicidad', 'estilo'], 'on-writing-well', 0),

-- LEADERSHIP & MANAGEMENT (5 books)
('Extreme Ownership', 'Liderazgo', 'Principios de liderazgo de los Navy SEALs aplicados al mundo empresarial. El concepto de responsabilidad extrema donde los líderes asumen responsabilidad total por sus equipos y todos los resultados, buenos y malos.', 'Jocko Willink & Leif Babin', ARRAY['liderazgo', 'responsabilidad', 'equipos', 'militar', 'disciplina'], 'extreme-ownership', 0),

('Leaders Eat Last', 'Liderazgo', 'Por qué algunos equipos se unen y otros no. Sinek explora el concepto del círculo de seguridad y cómo los grandes líderes crean ambientes donde las personas se sienten seguras, valoradas y motivadas a dar lo mejor de sí.', 'Simon Sinek', ARRAY['liderazgo', 'seguridad', 'equipos', 'confianza', 'cultura'], 'leaders-eat-last', 0),

('The Five Dysfunctions of a Team', 'Trabajo en Equipo', 'Un modelo poderoso para construir equipos cohesivos. Lencioni identifica cinco disfunciones: ausencia de confianza, miedo al conflicto, falta de compromiso, evitación de responsabilidad y falta de atención a los resultados.', 'Patrick Lencioni', ARRAY['equipos', 'disfunciones', 'confianza', 'conflicto', 'compromiso'], 'five-dysfunctions-team', 0),

('Radical Candor', 'Gestión', 'Cómo ser un mejor jefe a través del cuidado personal y el desafío directo. Scott presenta un marco para dar feedback efectivo que ayude a las personas a crecer mientras se mantienen relaciones sólidas y de confianza.', 'Kim Scott', ARRAY['feedback', 'gestión', 'cuidado', 'honestidad', 'crecimiento'], 'radical-candor', 0),

('Multipliers', 'Liderazgo', 'Cómo los líderes amplifican la inteligencia de otros versus los que la disminuyen. Wiseman identifica las cinco disciplinas de los Multiplicadores y cómo desarrollar estas capacidades para maximizar el potencial del equipo.', 'Liz Wiseman', ARRAY['liderazgo', 'inteligencia', 'multiplicadores', 'potencial', 'desarrollo'], 'multipliers', 0),

-- STRATEGY & BUSINESS (5 books)
('Good to Great', 'Excelencia Empresarial', 'Qué hace que las empresas salten de buenas a grandiosas. Collins identifica factores distintivos: liderazgo Nivel 5, primero quién luego qué, confrontar hechos brutales, concepto del erizo, cultura de disciplina y tecnología como acelerador.', 'Jim Collins', ARRAY['excelencia', 'liderazgo', 'transformación', 'disciplina', 'cultura'], 'good-to-great', 0),

('Blue Ocean Strategy', 'Estrategia', 'Cómo crear espacios de mercado sin competencia haciendo que la competencia sea irrelevante. Kim y Mauborgne presentan herramientas y marcos para identificar y capturar océanos azules de oportunidad no disputada.', 'W. Chan Kim & Renée Mauborgne', ARRAY['estrategia', 'océano-azul', 'competencia', 'innovación', 'mercado'], 'blue-ocean-strategy', 0),

('The Innovators Dilemma', 'Innovación', 'Por qué las empresas exitosas fallan cuando se enfrentan a la innovación disruptiva. Christensen explica cómo las tecnologías disruptivas derriban a los líderes establecidos y presenta estrategias para navegar la innovación.', 'Clayton M. Christensen', ARRAY['innovación', 'disrupción', 'tecnología', 'cambio', 'estrategia'], 'innovators-dilemma', 0),

('Execution', 'Ejecución', 'La disciplina de hacer que las cosas sucedan. Los autores argumentan que la ejecución es la mayor deficiencia en los negocios hoy y presentan un sistema integral para cerrar la brecha entre estrategia y resultados.', 'Larry Bossidy & Ram Charan', ARRAY['ejecución', 'estrategia', 'resultados', 'disciplina', 'liderazgo'], 'execution', 0),

('Measure What Matters', 'OKRs', 'El sistema de objetivos y resultados clave que impulsa el crecimiento exponencial. Doerr explica cómo los OKRs ayudaron a Google, Intel y otras empresas a lograr un crecimiento extraordinario y cómo implementarlos efectivamente.', 'John Doerr', ARRAY['okrs', 'objetivos', 'medición', 'crecimiento', 'google'], 'measure-what-matters', 0),

-- PRODUCT MANAGEMENT (5 books)
('Inspired', 'Gestión de Producto', 'Cómo crear productos tecnológicos que los clientes aman. Cagan comparte las mejores prácticas de gestión de producto de las empresas tecnológicas más exitosas, desde el descubrimiento del producto hasta la entrega.', 'Marty Cagan', ARRAY['producto', 'tecnología', 'gestión', 'clientes', 'innovación'], 'inspired', 0),

('The Lean Product Playbook', 'Desarrollo de Producto', 'Cómo innovar con Lean Startup y Design Thinking. Olsen presenta un proceso paso a paso para construir productos que los clientes realmente quieren, desde la identificación del mercado hasta el product-market fit.', 'Dan Olsen', ARRAY['lean', 'innovación', 'product-market-fit', 'startup', 'design-thinking'], 'lean-product-playbook', 0),

('Crossing the Chasm', 'Adopción de Tecnología', 'Cómo llevar productos tecnológicos disruptivos al mercado masivo. Moore presenta el modelo del ciclo de vida de adopción de tecnología y estrategias específicas para cruzar el abismo entre early adopters y el mercado masivo.', 'Geoffrey A. Moore', ARRAY['tecnología', 'adopción', 'mercado', 'disrupción', 'mainstream'], 'crossing-the-chasm', 0),

('The Mom Test', 'Validación de Ideas', 'Cómo hablar con los clientes y aprender si tu negocio es una buena idea cuando todos te mienten. Fitzpatrick presenta técnicas para obtener feedback honesto y útil de clientes potenciales antes de construir el producto.', 'Rob Fitzpatrick', ARRAY['validación', 'clientes', 'feedback', 'startup', 'investigación'], 'mom-test', 0),

('Sprint', 'Design Thinking', 'Cómo resolver grandes problemas y probar nuevas ideas en solo cinco días. El proceso de sprint de Google Ventures para prototipado rápido y validación de ideas, utilizado por cientos de empresas para acelerar la innovación.', 'Jake Knapp, John Zeratsky & Braden Kowitz', ARRAY['sprint', 'prototipado', 'validación', 'google-ventures', 'innovación'], 'sprint', 0),

-- MARKETING (5 books)
('Purple Cow', 'Marketing Diferenciado', 'Transforma tu negocio siendo extraordinario. Godin argumenta que en un mundo lleno de ruido, solo los productos y servicios extraordinarios pueden destacar y tener éxito. La clave está en ser notable desde el diseño.', 'Seth Godin', ARRAY['diferenciación', 'extraordinario', 'marketing', 'notable', 'innovación'], 'purple-cow', 0),

('Contagious', 'Marketing Viral', 'Por qué las cosas se vuelven populares. Berger identifica seis principios que hacen que el contenido se vuelva viral: moneda social, triggers, emoción, público, valor práctico y historias. Basado en años de investigación científica.', 'Jonah Berger', ARRAY['viral', 'contenido', 'popularidad', 'psicología', 'compartir'], 'contagious', 0),

('Building a StoryBrand', 'Marketing Narrativo', 'Clarifica tu mensaje para que los clientes escuchen. Miller presenta un marco de siete partes basado en la narrativa clásica para crear mensajes de marketing claros y convincentes que resuenen con los clientes.', 'Donald Miller', ARRAY['storybrand', 'narrativa', 'mensaje', 'claridad', 'clientes'], 'building-storybrand', 0),

('Hooked', 'Productos Adictivos', 'Cómo construir productos que forman hábitos. Eyal presenta el modelo Hook de cuatro pasos: trigger, acción, recompensa variable e inversión, para crear productos que los usuarios utilizan de manera habitual y frecuente.', 'Nir Eyal', ARRAY['hábitos', 'productos', 'engagement', 'psicología', 'adicción'], 'hooked', 0),

('Positioning', 'Posicionamiento', 'La batalla por tu mente. Ries y Trout introdujeron el concepto revolucionario de posicionamiento: cómo diferenciarse ocupando una posición única en la mente del cliente en un mercado sobrecomunicado.', 'Al Ries & Jack Trout', ARRAY['posicionamiento', 'diferenciación', 'mente', 'marketing', 'estrategia'], 'positioning', 0),

-- DESIGN & UX (5 books)
('Dont Make Me Think', 'Usabilidad Web', 'Un enfoque de sentido común para la usabilidad web. Krug presenta principios simples pero poderosos para crear sitios web usables, enfatizando la navegación intuitiva y el diseño claro que no requiere pensamiento del usuario.', 'Steve Krug', ARRAY['usabilidad', 'web', 'navegación', 'intuición', 'simplicidad'], 'dont-make-me-think', 0),

('The Design of Everyday Things', 'Diseño Centrado en el Usuario', 'Los principios fundamentales del buen diseño. Norman explora conceptos clave como affordances, signifiers y feedback, explicando por qué algunos diseños funcionan y otros no desde una perspectiva cognitiva y psicológica.', 'Don Norman', ARRAY['diseño', 'usabilidad', 'cognición', 'psicología', 'affordances'], 'design-everyday-things', 0),

('About Face', 'Diseño de Interacción', 'Los fundamentos del diseño de interacción. Cooper y su equipo presentan principios completos para diseñar productos digitales útiles y usables, desde la investigación de usuarios hasta el diseño detallado de interfaces.', 'Alan Cooper, Robert Reimann, David Cronin & Christopher Noessel', ARRAY['interacción', 'usabilidad', 'interfaces', 'usuarios', 'digital'], 'about-face', 0),

('Creative Confidence', 'Creatividad', 'Libera la creatividad que llevas dentro. Los hermanos Kelley de IDEO explican cómo desarrollar confianza creativa y aplicar design thinking para resolver problemas complejos y generar innovación en cualquier campo.', 'Tom Kelley & David Kelley', ARRAY['creatividad', 'confianza', 'design-thinking', 'ideo', 'innovación'], 'creative-confidence', 0),

('101 Design Methods', 'Métodos de Diseño', 'Una guía estructurada para la innovación en productos, servicios y experiencias. Kumar presenta 101 métodos organizados en siete modos de innovación, proporcionando un toolkit completo para diseñadores e innovadores.', 'Vijay Kumar', ARRAY['diseño', 'métodos', 'innovación', 'toolkit', 'experiencias'], '101-design-methods', 0),

-- DATA & ANALYTICS (5 books)
('Storytelling with Data', 'Narrativa con Datos', 'La comunicación efectiva con datos. Knaflic enseña técnicas para transformar datos en historias convincentes que impulsen la acción, combinando principios de análisis de datos con narrativa visual efectiva.', 'Cole Nussbaumer Knaflic', ARRAY['storytelling', 'datos', 'comunicación', 'visualización', 'narrativa'], 'storytelling-with-data', 0),

('Naked Statistics', 'Estadística Aplicada', 'Desnudando el poder de los datos. Wheelan explica conceptos estadísticos de manera accesible y entretenida, mostrando cómo la estadística afecta nuestras vidas diarias y la toma de decisiones en todos los campos.', 'Charles Wheelan', ARRAY['estadística', 'datos', 'conceptos', 'aplicación', 'decisiones'], 'naked-statistics', 0),

('The Signal and the Noise', 'Predicción', 'Por qué tantas predicciones fallan pero algunas no. Silver examina el arte y la ciencia de la predicción, explorando por qué algunos pronósticos son exitosos mientras que otros fallan espectacularmente.', 'Nate Silver', ARRAY['predicción', 'pronósticos', 'señal', 'ruido', 'análisis'], 'signal-and-noise', 0),

('Data Science for Business', 'Ciencia de Datos', 'Lo que necesitas saber sobre minería de datos y pensamiento analítico orientado a datos. Los autores presentan los principios fundamentales de la ciencia de datos aplicados a problemas empresariales reales.', 'Foster Provost & Tom Fawcett', ARRAY['ciencia-datos', 'minería', 'analítica', 'negocios', 'pensamiento'], 'data-science-business', 0),

('How Charts Lie', 'Visualización de Datos', 'Cómo los gráficos pueden engañar y cómo leerlos correctamente. Cairo enseña técnicas para crear e interpretar visualizaciones de datos de manera honesta y efectiva, evitando manipulaciones comunes.', 'Alberto Cairo', ARRAY['visualización', 'gráficos', 'interpretación', 'honestidad', 'manipulación'], 'how-charts-lie', 0),

-- SOFTWARE DEVELOPMENT (5 books)
('Clean Code', 'Calidad de Código', 'Un manual de artesanía de software ágil. Martin presenta principios y prácticas para escribir código limpio, legible y mantenible, con ejemplos prácticos y técnicas de refactoring que todo desarrollador debe conocer.', 'Robert C. Martin', ARRAY['código-limpio', 'legibilidad', 'mantenibilidad', 'refactoring', 'artesanía'], 'clean-code', 0),

('The Pragmatic Programmer', 'Desarrollo de Software', 'Tu viaje hacia la maestría. Hunt y Thomas ofrecen consejos prácticos y filosofías atemporales para convertirse en un programador más efectivo, profesional y exitoso en el desarrollo de software.', 'Andrew Hunt & David Thomas', ARRAY['programación', 'maestría', 'profesionalismo', 'pragmático', 'desarrollo'], 'pragmatic-programmer', 0),

('Clean Architecture', 'Arquitectura', 'Una guía del artesano para la estructura y el diseño de software. Martin explora los principios universales de la arquitectura de software que crean sistemas mantenibles, testeable y flexibles a largo plazo.', 'Robert C. Martin', ARRAY['arquitectura', 'estructura', 'mantenibilidad', 'diseño', 'sistemas'], 'clean-architecture', 0),

('Designing Data-Intensive Applications', 'Sistemas Distribuidos', 'Las grandes ideas detrás de sistemas de datos confiables, escalables y mantenibles. Kleppmann explora los conceptos fundamentales para diseñar aplicaciones que manejan grandes volúmenes de datos de manera efectiva.', 'Martin Kleppmann', ARRAY['datos', 'escalabilidad', 'confiabilidad', 'distribuidos', 'sistemas'], 'designing-data-intensive-apps', 0),

('The DevOps Handbook', 'DevOps', 'Cómo crear agilidad, confiabilidad y seguridad de clase mundial en organizaciones tecnológicas. Los autores presentan los principios y prácticas para implementar DevOps exitosamente y transformar la entrega de software.', 'Gene Kim, Jez Humble, Patrick Debois & John Willis', ARRAY['devops', 'agilidad', 'confiabilidad', 'seguridad', 'transformación'], 'devops-handbook', 0),

-- PSYCHOLOGY & DECISION MAKING (5 books)
('Thinking Fast and Slow', 'Psicología Cognitiva', 'Los dos sistemas que impulsan la forma en que pensamos. Kahneman distingue entre el pensamiento rápido (Sistema 1) e intuitivo y el pensamiento lento (Sistema 2) y deliberativo, y cómo ambos afectan nuestras decisiones.', 'Daniel Kahneman', ARRAY['pensamiento', 'sistemas', 'cognición', 'decisiones', 'psicología'], 'thinking-fast-slow', 0),

('Influence', 'Psicología de la Persuasión', 'Los seis principios universales de influencia: reciprocidad, compromiso/consistencia, prueba social, autoridad, simpatía y escasez. Cialdini presenta insights científicos sobre por qué las personas dicen sí y cómo aplicar estos principios éticamente.', 'Robert B. Cialdini', ARRAY['influencia', 'persuasión', 'psicología', 'principios', 'ética'], 'influence', 0),

('Nudge', 'Arquitectura de Decisiones', 'Mejorando las decisiones sobre salud, riqueza y felicidad. Thaler y Sunstein explican cómo pequeños cambios en la forma en que se presentan las opciones pueden mejorar significativamente las decisiones que tomamos.', 'Richard H. Thaler & Cass R. Sunstein', ARRAY['nudge', 'decisiones', 'arquitectura', 'comportamiento', 'mejora'], 'nudge', 0),

('Predictably Irrational', 'Economía Conductual', 'Las fuerzas ocultas que moldean nuestras decisiones. Ariely presenta experimentos fascinantes que revelan cómo tomamos decisiones de manera sistemáticamente irracional pero predecible, desafiando la economía tradicional.', 'Dan Ariely', ARRAY['irracionalidad', 'decisiones', 'experimentos', 'comportamiento', 'economía'], 'predictably-irrational', 0),

('The Art of Thinking Clearly', 'Sesgos Cognitivos', 'Los errores sistemáticos de pensamiento que todos cometemos. Dobelli presenta 99 sesgos cognitivos comunes y cómo evitarlos para tomar mejores decisiones en la vida personal y profesional.', 'Rolf Dobelli', ARRAY['sesgos', 'pensamiento', 'errores', 'cognición', 'claridad'], 'art-thinking-clearly', 0),

-- CREATIVITY & INNOVATION (5 books)
('The Artists Way', 'Creatividad Espiritual', 'Un camino espiritual hacia la creatividad superior. Cameron presenta un programa de 12 semanas para recuperar y desarrollar la creatividad, incluyendo técnicas como las páginas matutinas y las citas con el artista interior.', 'Julia Cameron', ARRAY['creatividad', 'espiritual', 'programa', 'artista', 'recuperación'], 'artists-way', 0),

('Steal Like an Artist', 'Creatividad', '10 cosas que nadie te dijo sobre ser creativo. Kleon presenta principios accesibles para liberar la creatividad, incluyendo cómo encontrar inspiración, desarrollar tu voz única y construir una carrera creativa sostenible.', 'Austin Kleon', ARRAY['creatividad', 'inspiración', 'voz', 'carrera', 'artista'], 'steal-like-artist', 0),

('The War of Art', 'Resistencia Creativa', 'Rompe las barreras y gana tus batallas creativas internas. Pressfield identifica la Resistencia como el enemigo número uno de la creatividad y presenta estrategias para superarla y hacer el trabajo creativo que importa.', 'Steven Pressfield', ARRAY['resistencia', 'creatividad', 'barreras', 'guerra', 'trabajo'], 'war-of-art', 0),

('Story', 'Narrativa', 'Sustancia, estructura, estilo y principios de la escritura de guiones. McKee explora los elementos fundamentales de la narrativa efectiva, aplicables tanto a guiones cinematográficos como a la comunicación empresarial y personal.', 'Robert McKee', ARRAY['narrativa', 'estructura', 'guiones', 'historia', 'comunicación'], 'story', 0),

('The Creative Habit', 'Hábitos Creativos', 'Aprende a usarla de por vida. Tharp comparte rutinas y ejercicios para desarrollar y mantener la creatividad como un hábito diario, basándose en su experiencia como una de las coreógrafas más exitosas del mundo.', 'Twyla Tharp', ARRAY['creatividad', 'hábitos', 'rutinas', 'disciplina', 'arte'], 'creative-habit', 0),

-- FINANCE & INVESTING (5 books)
('Rich Dad Poor Dad', 'Educación Financiera', 'Lo que los ricos enseñan a sus hijos sobre el dinero que los pobres y la clase media no. Kiyosaki contrasta las lecciones de sus dos padres sobre conceptos fundamentales como activos, pasivos y la importancia de la educación financiera.', 'Robert T. Kiyosaki & Sharon Lechter', ARRAY['educación-financiera', 'activos', 'pasivos', 'riqueza', 'dinero'], 'rich-dad-poor-dad', 0),

('The Psychology of Money', 'Psicología Financiera', 'Lecciones atemporales sobre riqueza, codicia y felicidad. Housel explora cómo la psicología, más que la inteligencia técnica o el conocimiento financiero, determina el éxito financiero a largo plazo.', 'Morgan Housel', ARRAY['psicología', 'dinero', 'riqueza', 'comportamiento', 'inversión'], 'psychology-of-money', 0),

('A Random Walk Down Wall Street', 'Inversión', 'La estrategia de inversión probada en el tiempo para el inversor exitoso. Malkiel presenta el caso convincente para la inversión en fondos indexados y la teoría del mercado eficiente como base para una estrategia de inversión sólida.', 'Burton G. Malkiel', ARRAY['inversión', 'índices', 'mercado-eficiente', 'wall-street', 'estrategia'], 'random-walk-wall-street', 0),

('I Will Teach You to Be Rich', 'Finanzas Personales', 'Un programa de 6 semanas sin culpa para manejar tu dinero. Sethi presenta un enfoque práctico y automatizado para las finanzas personales, desde la creación de presupuestos hasta las inversiones y la optimización de gastos.', 'Ramit Sethi', ARRAY['finanzas-personales', 'dinero', 'automatización', 'presupuesto', 'optimización'], 'i-will-teach-you-rich', 0),

('The Personal MBA', 'Educación Empresarial', 'Domina el arte de los negocios. Kaufman presenta los conceptos empresariales más esenciales de manera accesible y práctica, cubriendo desde marketing y ventas hasta finanzas y operaciones, sin necesidad de un MBA formal.', 'Josh Kaufman', ARRAY['mba', 'negocios', 'conceptos', 'educación', 'empresarial'], 'personal-mba', 0);

-- Update platform configuration with knowledge base statistics
INSERT INTO platform_config (key, value, description) VALUES
('brain_knowledge_count', (SELECT COUNT(*)::text FROM knowledge_base), 'Total number of books in knowledge base'),
('brain_categories_count', (SELECT COUNT(DISTINCT category)::text FROM knowledge_base), 'Number of knowledge categories'),
('brain_total_authors', (SELECT COUNT(DISTINCT author)::text FROM knowledge_base), 'Total number of unique authors'),
('brain_last_updated', NOW()::text, 'Last knowledge base update timestamp')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();

-- Verify the data was inserted correctly
SELECT 
    'Knowledge base populated successfully!' as status,
    COUNT(*) as total_books,
    COUNT(DISTINCT category) as categories,
    COUNT(DISTINCT author) as authors
FROM knowledge_base;

COMMIT;
