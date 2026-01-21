-- Script 025: Add the 15 missing books from the original 64-book list
-- These books were never inserted into knowledge_base

-- First, let's see what books we currently have
-- SELECT title FROM knowledge_base ORDER BY title;

-- Insert missing books with complete content

-- 1. The Sense of Style - Steven Pinker
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'The Sense of Style',
  'Steven Pinker',
  'El Sentido del Estilo de Steven Pinker es una guia moderna y cientifica para escribir de manera clara, coherente y elegante en el siglo XXI.

CONCEPTOS FUNDAMENTALES:

1. La Maldicion del Conocimiento: El mayor obstaculo para escribir bien es olvidar lo que es no saber algo. Los expertos asumen conocimientos que sus lectores no tienen.

2. Prosa Clasica: El estilo ideal trata la escritura como una ventana hacia el mundo. El escritor ve algo y lo senala al lector, como si ambos pudieran verlo.

3. La Gramatica como Herramienta: Las reglas gramaticales no son arbitrarias - existen para facilitar la comprension. Entender por que existen te permite romperlas inteligentemente.

4. El Arbol Sintactico: Visualizar las oraciones como estructuras jerarquicas ayuda a construir frases claras y evitar ambiguedades.

TECNICAS DE ESCRITURA CLARA:

- Verbos Fuertes: Preferir verbos activos y especificos sobre construcciones pasivas y abstractas.

- Coherencia: Mantener el tema conocido al principio de la oracion y la informacion nueva al final.

- Concision: Eliminar palabras innecesarias, cliches y jerga que oscurecen el significado.

- Ritmo: Variar la longitud de las oraciones para mantener el interes del lector.

APLICACION PROFESIONAL:

- Comunicacion Ejecutiva: Escribir reportes y presentaciones que transmitan ideas complejas de manera accesible.

- Documentacion Tecnica: Crear manuales y guias que usuarios no tecnicos puedan entender.

- Marketing y Ventas: Redactar mensajes persuasivos basados en claridad, no en manipulacion.

- Liderazgo: Los mejores lideres son comunicadores claros que eliminan la ambiguedad.

Lectura esencial para cualquier profesional que quiera dominar el arte de la comunicacion escrita.',
  'Comunicacion',
  'Intermedio',
  'Espanol',
  50
);

-- 2. Give and Take - Adam Grant
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Give and Take',
  'Adam Grant',
  'Dar y Recibir de Adam Grant revoluciona nuestra comprension del exito profesional, demostrando que los mas generosos pueden llegar a la cima.

CONCEPTOS FUNDAMENTALES:

1. Tres Estilos de Reciprocidad:
   - Dadores (Givers): Contribuyen mas de lo que reciben, ayudan sin esperar nada a cambio.
   - Tomadores (Takers): Buscan obtener mas de lo que dan, priorizan sus intereses.
   - Emparejadores (Matchers): Buscan equilibrio justo entre dar y recibir.

2. La Paradoja del Dador: Los dadores ocupan tanto el fondo como la cima de las metricas de exito. La diferencia esta en como dan.

3. Dadores Exitosos vs Dadores Agotados: Los dadores exitosos establecen limites, son estrategicos sobre cuando, como y a quien ayudan.

ESTRATEGIAS DE DADORES EXITOSOS:

- Dar de Manera Sostenible: Concentrar actos de generosidad en bloques de tiempo en lugar de distribuirlos constantemente.

- La Regla de los 5 Minutos: Si puedes ayudar a alguien en menos de 5 minutos, hazlo. Es de bajo costo y alto impacto.

- Pedir Ayuda: Los dadores exitosos tambien piden ayuda, lo que permite a otros experimentar la satisfaccion de dar.

- Detectar Tomadores: Protegerse de quienes explotan la generosidad reconociendo patrones de comportamiento egoista.

APLICACION PROFESIONAL:

- Networking Autentico: Construir relaciones basadas en generosidad genuina, no en transacciones calculadas.

- Liderazgo Servicial: Los lideres que priorizan el desarrollo de su equipo generan mayor lealtad y rendimiento.

- Negociacion: Adoptar una perspectiva de crear valor en lugar de solo reclamarlo produce mejores resultados para todos.

- Cultura Organizacional: Los equipos con normas de generosidad superan a aquellos dominados por tomadores.

Libro transformador que demuestra que el exito sostenible viene de ayudar a otros a triunfar.',
  'Desarrollo Personal',
  'Intermedio',
  'Espanol',
  45
);

-- 3. Presentation Zen - Garr Reynolds
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Presentation Zen',
  'Garr Reynolds',
  'Presentation Zen de Garr Reynolds transforma radicalmente como pensamos sobre las presentaciones, aplicando principios de diseno japones para comunicar con claridad e impacto.

CONCEPTOS FUNDAMENTALES:

1. Restriccion (Kanso): La simplicidad es la maxima sofisticacion. Eliminar todo lo que no sea esencial para el mensaje.

2. Naturalidad (Shizen): Las mejores presentaciones fluyen naturalmente, sin artificialidad ni exceso de produccion.

3. Vacio (Ma): El espacio en blanco no es desperdicio - es un elemento de diseno que da poder a lo que permanece.

PRINCIPIOS DE DISENO:

- Una Idea por Diapositiva: Cada slide debe comunicar un solo concepto claro. Si necesitas mas, crea otra diapositiva.

- Relacion Senal/Ruido: Maximizar el contenido significativo y eliminar decoracion innecesaria que distrae.

- Imagenes sobre Texto: El cerebro procesa imagenes 60,000 veces mas rapido que texto. Usa fotografias de alta calidad.

- Contraste: Crear jerarquia visual clara entre elementos importantes y secundarios.

METODOLOGIA DE PREPARACION:

1. Brainstorming Analogico: Comenzar con papel y lapiz, lejos del computador, para generar ideas libremente.

2. Storyboarding: Planificar el flujo narrativo antes de abrir PowerPoint.

3. Practica Deliberada: Ensayar la presentacion completa multiples veces, idealmente frente a otros.

APLICACION PROFESIONAL:

- Pitch de Negocios: Capturar la atencion de inversionistas con presentaciones memorables y claras.

- Ventas: Conectar emocionalmente con clientes potenciales a traves de historias visuales.

- Liderazgo: Inspirar equipos con mensajes simples pero poderosos.

- Ensenanza: Facilitar el aprendizaje con presentaciones que respetan la atencion de la audiencia.

Guia definitiva para crear presentaciones que informan, inspiran y permanecen en la memoria.',
  'Comunicacion',
  'Principiante',
  'Espanol',
  40
);

-- 4. Never Split the Difference - Chris Voss
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Never Split the Difference',
  'Chris Voss',
  'Rompe la Barrera del No de Chris Voss revela las tacticas de negociacion del FBI que funcionan en cualquier situacion, desde secuestros hasta negociaciones salariales.

CONCEPTOS FUNDAMENTALES:

1. Empatia Tactica: Entender las emociones y perspectiva del otro lado, no para estar de acuerdo, sino para obtener influencia.

2. El Espejeo: Repetir las ultimas 2-3 palabras de lo que dijo la otra persona para generar rapport y obtener mas informacion.

3. Etiquetado: Nombrar las emociones del otro (parece que estas frustrado) para validarlas y desactivar su carga negativa.

4. El No como Herramienta: El no no es el fin de la negociacion - es el comienzo. Permite a la otra parte sentirse en control.

TECNICAS AVANZADAS:

- La Pregunta Calibrada: Preguntas que comienzan con como o que obligan al otro a resolver tu problema (Como se supone que haga eso?).

- El Efecto Ackerman: Sistema de ofertas (65%, 85%, 95%, 100%) que ancla expectativas y maximiza tu posicion.

- Cisne Negro: Buscar la informacion oculta que cambia completamente la dinamica de la negociacion.

- Acuerdo de Implementacion: Asegurar que los acuerdos se cumplan preguntando sobre los detalles especificos de ejecucion.

APLICACION PROFESIONAL:

- Negociacion Salarial: Usar estas tecnicas para obtener mejores ofertas de compensacion.

- Ventas Complejas: Cerrar tratos difíciles entendiendo las verdaderas objeciones del cliente.

- Manejo de Conflictos: Resolver disputas en equipos de trabajo sin crear ganadores y perdedores.

- Liderazgo: Influir en stakeholders y obtener buy-in para iniciativas importantes.

El libro de negociacion mas practico y aplicable jamas escrito.',
  'Negociacion',
  'Intermedio',
  'Espanol',
  45
);

-- 5. The Effective Executive - Peter Drucker
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'The Effective Executive',
  'Peter Drucker',
  'El Ejecutivo Eficaz de Peter Drucker es la obra maestra sobre productividad gerencial, estableciendo los principios atemporales que distinguen a los ejecutivos que producen resultados.

CONCEPTOS FUNDAMENTALES:

1. La Efectividad se Aprende: No es un talento innato sino un conjunto de practicas que cualquiera puede desarrollar con disciplina.

2. Conoce tu Tiempo: El tiempo es el recurso mas escaso. Los ejecutivos efectivos registran, analizan y consolidan su tiempo.

3. Enfocate en Contribucion: Preguntarte constantemente que puedo aportar que afecte significativamente los resultados de la organizacion.

4. Construye sobre Fortalezas: Asignar personas basandose en lo que pueden hacer, no en minimizar debilidades.

PRACTICAS DE EFECTIVIDAD:

- Primero lo Primero: Hacer las cosas importantes primero y las segundas cosas nunca. La concentracion es esencial.

- Decisiones Efectivas: Las buenas decisiones requieren desacuerdo constructivo y considerar alternativas genuinas.

- Reuniones Productivas: Cada reunion debe tener un proposito claro y terminar con compromisos especificos de accion.

- Delegacion Real: Delegar no es asignar tareas sino dar responsabilidad completa por resultados.

LAS CINCO PRACTICAS:

1. Saber donde va el tiempo
2. Enfocarse en resultados externos
3. Construir sobre fortalezas
4. Concentrarse en pocas areas donde el desempeno superior produce resultados
5. Tomar decisiones efectivas

APLICACION PROFESIONAL:

- Productividad Personal: Maximizar tu contribucion en cualquier rol profesional.

- Gestion de Equipos: Obtener lo mejor de cada miembro enfocandote en sus fortalezas.

- Liderazgo Estrategico: Tomar las pocas decisiones que realmente importan para la organizacion.

Lectura obligatoria para cualquier profesional que aspire a posiciones de liderazgo.',
  'Liderazgo',
  'Intermedio',
  'Espanol',
  50
);

-- 6. Working Backwards - Colin Bryar & Bill Carr
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Working Backwards',
  'Colin Bryar y Bill Carr',
  'Working Backwards de Colin Bryar y Bill Carr revela los principios y procesos internos que hicieron de Amazon una de las empresas mas exitosas del mundo.

CONCEPTOS FUNDAMENTALES:

1. Trabajar Hacia Atras: Comenzar con el cliente y trabajar hacia atras hacia la solucion. El PR/FAQ (comunicado de prensa + preguntas frecuentes) obliga a clarificar el valor antes de construir.

2. Equipos de Dos Pizzas: Equipos lo suficientemente pequenos para alimentarse con dos pizzas. Minimiza la coordinacion y maximiza la autonomia.

3. Metricas de Input vs Output: Enfocarse en las actividades controlables (inputs) que eventualmente producen resultados (outputs).

4. Los 14 Principios de Liderazgo: Obsesion por el cliente, ownership, inventar y simplificar, tener razon frecuentemente, aprender y ser curioso, contratar y desarrollar a los mejores, insistir en altos estandares, pensar en grande, sesgo hacia la accion, frugalidad, ganarse la confianza, profundizar, tener columna vertebral, entregar resultados.

EL PROCESO PR/FAQ:

- Comunicado de Prensa: Escribir el anuncio del producto terminado ANTES de comenzar el desarrollo.

- Preguntas Frecuentes: Anticipar y responder todas las preguntas de clientes y stakeholders internos.

- Visuales: Incluir mockups de la experiencia del usuario para hacer tangible la vision.

- Iteracion: El documento evoluciona a traves de multiples revisiones hasta que la idea este cristalina.

APLICACION PROFESIONAL:

- Desarrollo de Productos: Usar el PR/FAQ para validar ideas antes de invertir recursos significativos.

- Gestion de Proyectos: Estructurar equipos autonomos con metricas claras y responsabilidad end-to-end.

- Cultura Organizacional: Implementar principios de liderazgo como base para decisiones y comportamientos.

- Innovacion: Crear procesos que fomenten la experimentacion mientras mantienen altos estandares.

Manual practico de las metodologias que impulsan la innovacion en Amazon.',
  'Negocios',
  'Avanzado',
  'Espanol',
  55
);

-- 7. Continuous Discovery Habits - Teresa Torres
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Continuous Discovery Habits',
  'Teresa Torres',
  'Habitos de Descubrimiento Continuo de Teresa Torres es la guia definitiva para equipos de producto que quieren tomar mejores decisiones basadas en investigacion constante con usuarios.

CONCEPTOS FUNDAMENTALES:

1. Descubrimiento Continuo: En lugar de fases separadas de investigacion y desarrollo, integrar el contacto con usuarios en el trabajo diario del equipo.

2. El Trio de Producto: Producto, diseno e ingenieria trabajan juntos en el descubrimiento, no en silos secuenciales.

3. Entrevistas Semanales: Hablar con al menos un usuario o cliente cada semana para mantener conexion constante con la realidad.

4. Oportunidades vs Soluciones: Mapear el espacio de oportunidades antes de saltar a soluciones. Entender el problema completamente.

EL OPPORTUNITY SOLUTION TREE:

- Resultado Deseado: El objetivo de negocio que el equipo busca impactar.

- Oportunidades: Los problemas, necesidades y deseos de los usuarios que, si se abordan, impactan el resultado.

- Soluciones: Las ideas especificas que podrian abordar cada oportunidad.

- Experimentos: Las formas de probar si las soluciones funcionan antes de construirlas completamente.

HABITOS CLAVE:

- Entrevistas de Historia: Preguntar sobre experiencias pasadas especificas, no opiniones o predicciones.

- Mapeo de Suposiciones: Identificar las creencias que deben ser verdaderas para que una solucion funcione.

- Experimentos Rapidos: Probar suposiciones riesgosas con el minimo esfuerzo posible.

APLICACION PROFESIONAL:

- Product Management: Framework completo para tomar decisiones de producto basadas en evidencia.

- UX Research: Integrar investigacion en el flujo de trabajo del equipo, no como fase separada.

- Desarrollo Agil: Complementar Scrum/Kanban con practicas de descubrimiento que aseguran construir lo correcto.

Lectura esencial para cualquier profesional de producto que quiera reducir riesgo y aumentar impacto.',
  'Producto',
  'Intermedio',
  'Espanol',
  50
);

-- 8. Crossing the Chasm - Geoffrey Moore
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Crossing the Chasm',
  'Geoffrey A. Moore',
  'Cruzando el Abismo de Geoffrey Moore es el libro definitivo sobre como llevar productos de tecnologia desde los early adopters hacia el mercado mainstream.

CONCEPTOS FUNDAMENTALES:

1. La Curva de Adopcion: Innovadores, Early Adopters, Mayoria Temprana, Mayoria Tardia, Rezagados. Cada grupo tiene motivaciones y comportamientos diferentes.

2. El Abismo: Existe una brecha significativa entre Early Adopters (visionarios) y la Mayoria Temprana (pragmaticos). La mayoria de startups mueren aqui.

3. Mercado de Cabeza de Playa: Para cruzar el abismo, debes dominar completamente un nicho especifico antes de expandirte.

4. El Producto Completo: Los pragmaticos no compran productos - compran soluciones completas que funcionan out-of-the-box.

ESTRATEGIA PARA CRUZAR:

- Segmentacion Extrema: Elegir UN segmento de mercado lo suficientemente pequeno para dominarlo completamente.

- Razon Convincente para Comprar: Identificar el problema urgente que hace que los pragmaticos actuen ahora.

- Producto Completo: Desarrollar todo lo necesario (servicios, integraciones, soporte) para que la solucion funcione.

- Competencia y Diferenciacion: Posicionarte en relacion a alternativas que los pragmaticos ya conocen.

- Canal de Distribucion: Usar canales que los pragmaticos confian y utilizan normalmente.

APLICACION PROFESIONAL:

- Go-to-Market: Disenar estrategias de lanzamiento que reconozcan las diferencias entre segmentos de adopcion.

- Product Marketing: Crear mensajes que resuenen con las preocupaciones especificas de cada grupo.

- Estrategia de Startup: Evitar la trampa de perseguir muchos mercados simultaneamente antes de dominar uno.

- Ventas B2B: Entender por que los early adopters compran diferente que la mayoria y adaptar el approach.

Framework indispensable para cualquier profesional de tecnologia o innovacion.',
  'Negocios',
  'Avanzado',
  'Espanol',
  50
);

-- 9. Empowered - Marty Cagan & Chris Jones
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Empowered',
  'Marty Cagan y Chris Jones',
  'Empowered de Marty Cagan y Chris Jones explica como las mejores companias de tecnologia crean equipos de producto verdaderamente autonomos y efectivos.

CONCEPTOS FUNDAMENTALES:

1. Equipos Empoderados vs Feature Teams: Los equipos empoderados reciben problemas para resolver, no listas de features para construir.

2. El Modelo de Producto: Las mejores companias operan con equipos de producto, no con IT como tomador de pedidos de stakeholders.

3. Coaching vs Managing: Los lideres de producto efectivos desarrollan las capacidades de sus equipos, no microgestionan su trabajo.

4. Contexto sobre Control: Dar a los equipos el contexto estrategico y las restricciones, luego confiar en ellos para encontrar soluciones.

ROLES CLAVE:

- Product Manager: Responsable de asegurar que el producto sea valioso (los clientes lo quieren) y viable (funciona para el negocio).

- Product Designer: Responsable de que el producto sea usable y genere la respuesta emocional correcta.

- Tech Lead: Responsable de que el producto sea factible tecnicamente y se construya de manera sostenible.

TRANSFORMACION ORGANIZACIONAL:

- De Output a Outcomes: Medir exito por resultados de negocio logrados, no por features entregadas.

- De Roadmaps a Objetivos: Comprometerse con problemas a resolver, no con soluciones especificas en fechas especificas.

- De Stakeholders a Clientes: El cliente es quien usa el producto, no quien solicita features internamente.

APLICACION PROFESIONAL:

- Liderazgo de Producto: Crear las condiciones para que equipos de producto prosperen y generen impacto.

- Desarrollo Organizacional: Transformar organizaciones tradicionales hacia el modelo de producto.

- Estrategia de Producto: Conectar el trabajo de equipos individuales con la vision y estrategia de la compania.

Guia definitiva para construir organizaciones de producto de clase mundial.',
  'Producto',
  'Avanzado',
  'Espanol',
  55
);

-- 10. Sprint - Jake Knapp
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Sprint',
  'Jake Knapp',
  'Sprint de Jake Knapp detalla el proceso de Design Sprint de Google Ventures: cinco dias para responder preguntas criticas de negocio a traves de diseno, prototipado y testing con usuarios.

CONCEPTOS FUNDAMENTALES:

1. El Sprint de 5 Dias: Un proceso estructurado que comprime meses de trabajo en una semana intensiva.

2. Prototipo Realista: Crear una fachada convincente del producto en un dia para testear con usuarios reales.

3. Aprender con Clientes: Validar ideas antes de invertir meses de desarrollo observando usuarios reales.

4. El Decididor: Alguien con autoridad para tomar decisiones debe participar para que el sprint tenga impacto.

LOS CINCO DIAS:

- Lunes (Mapear): Definir el problema, crear un mapa del journey del cliente, elegir un objetivo especifico.

- Martes (Sketchar): Generar soluciones individuales a traves de ejercicios estructurados de ideacion.

- Miercoles (Decidir): Evaluar ideas, votar y crear un storyboard del prototipo.

- Jueves (Prototipar): Construir un prototipo realista en un solo dia usando herramientas de diseno.

- Viernes (Testear): Observar 5 usuarios interactuar con el prototipo y sintetizar aprendizajes.

PRINCIPIOS CLAVE:

- Juntos pero Solos: Trabajo individual dentro de un marco grupal produce mejores ideas que brainstorming tradicional.

- Superficie sobre Profundidad: Un prototipo que parece real es mas valioso que uno que funciona realmente.

- Preguntas Grandes: Usar sprints para responder las preguntas mas riesgosas e importantes del negocio.

APLICACION PROFESIONAL:

- Innovacion de Producto: Validar nuevas ideas rapidamente antes de comprometer recursos significativos.

- Resolucion de Problemas: Aplicar el proceso a cualquier desafio complejo que requiera creatividad y validacion.

- Alineacion de Equipos: Usar sprints para crear consenso y momentum en proyectos estancados.

Metodologia probada para reducir el riesgo de construir el producto equivocado.',
  'Producto',
  'Principiante',
  'Espanol',
  40
);

-- 11. Hooked - Nir Eyal
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Hooked',
  'Nir Eyal',
  'Enganchado de Nir Eyal revela la psicologia detras de los productos que crean habitos, proporcionando un framework para disenar productos que los usuarios aman y usan repetidamente.

CONCEPTOS FUNDAMENTALES:

1. El Modelo Hook: Un ciclo de cuatro fases que las companias usan para formar habitos: Trigger, Action, Variable Reward, Investment.

2. Productos Formadores de Habitos: Los productos mas exitosos se convierten en parte de la rutina diaria de los usuarios sin requerir publicidad constante.

3. La Zona de Habito: Cuando un comportamiento ocurre con suficiente frecuencia y utilidad percibida, se vuelve automatico.

EL CICLO DE 4 FASES:

- Trigger (Disparador): Externo (notificacion, email) o interno (emocion, situacion) que inicia el comportamiento.

- Action (Accion): El comportamiento mas simple posible en anticipacion de una recompensa. Debe ser facil de ejecutar.

- Variable Reward (Recompensa Variable): La anticipacion de recompensa, no la recompensa misma, impulsa la accion. La variabilidad mantiene el interes.

- Investment (Inversion): El usuario pone algo de valor (tiempo, datos, esfuerzo) que mejora el producto y aumenta la probabilidad de volver.

TIPOS DE RECOMPENSAS:

- De la Tribu: Reconocimiento social, conexion, pertenencia.
- De la Caza: Busqueda de recursos, informacion, oportunidades.
- Del Yo: Maestria, competencia, consistencia.

APLICACION PROFESIONAL:

- Diseno de Producto: Crear productos que los usuarios quieran usar, no que tengan que usar.

- Marketing: Entender los disparadores emocionales que motivan el uso del producto.

- Etica: Usar estos principios para crear productos que genuinamente mejoren la vida de los usuarios.

- Engagement: Disenar loops de retencion que mantengan usuarios activos a largo plazo.

Framework esencial para cualquier profesional de producto o marketing digital.',
  'Producto',
  'Intermedio',
  'Espanol',
  40
);

-- 12. Blue Ocean Strategy - W. Chan Kim & Renee Mauborgne
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Blue Ocean Strategy',
  'W. Chan Kim y Renee Mauborgne',
  'La Estrategia del Oceano Azul de W. Chan Kim y Renee Mauborgne presenta un framework revolucionario para crear mercados nuevos en lugar de competir en mercados saturados.

CONCEPTOS FUNDAMENTALES:

1. Oceano Rojo vs Oceano Azul: Los oceanos rojos son mercados existentes donde las companias compiten ferozmente. Los oceanos azules son espacios de mercado nuevos donde la competencia es irrelevante.

2. Innovacion en Valor: Crear un salto de valor para compradores y la empresa simultaneamente, haciendo la competencia irrelevante.

3. No-Clientes: Enfocarse en quienes NO son clientes de la industria y entender por que no participan.

HERRAMIENTAS ESTRATEGICAS:

- El Lienzo Estrategico: Visualizar graficamente como tu oferta se compara con la competencia en factores clave.

- El Marco de las Cuatro Acciones: Eliminar, Reducir, Incrementar, Crear - cuatro preguntas para redisenar la curva de valor.

- La Matriz ERIC: Herramienta practica para implementar las cuatro acciones sistematicamente.

- Los Seis Caminos: Seis formas de mirar mas alla de los limites tradicionales de la industria para encontrar oceanos azules.

LOS TRES NIVELES DE NO-CLIENTES:

1. Proximos a ser clientes: Usan minimo la industria pero estan listos para saltar.
2. No-clientes que rechazan: Conscientemente eligen no usar la industria.
3. No-clientes inexplorados: Nunca han considerado la oferta de la industria como opcion.

APLICACION PROFESIONAL:

- Estrategia Corporativa: Encontrar espacios de crecimiento mas alla de la competencia directa.

- Emprendimiento: Identificar oportunidades de mercado donde grandes companias no estan mirando.

- Innovacion de Producto: Redisenar ofertas para capturar nuevos segmentos de clientes.

- Diferenciacion: Escapar de la comoditizacion creando una propuesta de valor unica.

El libro de estrategia mas influyente de las ultimas dos decadas.',
  'Estrategia',
  'Avanzado',
  'Espanol',
  55
);

-- 13. Turn the Ship Around - L. David Marquet
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Turn the Ship Around',
  'L. David Marquet',
  'Dar la Vuelta al Barco de L. David Marquet cuenta como transformo el submarino nuclear peor evaluado de la Marina de EE.UU. en el mejor, reemplazando el modelo de liderazgo tradicional.

CONCEPTOS FUNDAMENTALES:

1. Lider-Lider vs Lider-Seguidor: En lugar de un lider que da ordenes y seguidores que obedecen, crear una organizacion donde todos son lideres.

2. Intencion sobre Permiso: En lugar de pedir permiso (Capitan, solicito permiso para...), los subordinados declaran intencion (Capitan, tengo la intencion de...).

3. Empujar Control hacia Abajo: Mover la autoridad de decision lo mas cerca posible de donde esta la informacion.

LOS TRES PILARES:

- Control: Dar a las personas control real sobre su trabajo y decisiones.

- Competencia: Asegurar que tengan el conocimiento tecnico necesario para tomar buenas decisiones.

- Claridad: Todos entienden los objetivos organizacionales y como su trabajo contribuye.

MECANISMOS DE IMPLEMENTACION:

- Pensar en Voz Alta: Los subordinados verbalizan su razonamiento antes de actuar.

- Certificar vs Aprobar: Los lideres certifican que alguien tiene competencia, no aprueban cada decision.

- Eliminar Sistemas de Monitoreo: Cuando confias en las personas, no necesitas vigilarlas constantemente.

- Usar Inmediatamente: Implementar nuevas ideas inmediatamente en lugar de estudiarlas indefinidamente.

APLICACION PROFESIONAL:

- Liderazgo de Equipos: Crear equipos autonomos que no dependan del lider para cada decision.

- Transformacion Cultural: Cambiar organizaciones jerarquicas hacia modelos mas agiles y empoderados.

- Desarrollo de Talento: Crear las condiciones para que las personas crezcan y asuman mas responsabilidad.

- Escalabilidad: Los lideres que empoderan pueden manejar equipos mas grandes porque no son cuellos de botella.

Historia inspiradora con lecciones practicas aplicables a cualquier organizacion.',
  'Liderazgo',
  'Intermedio',
  'Espanol',
  45
);

-- 14. Escaping the Build Trap - Melissa Perri
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Escaping the Build Trap',
  'Melissa Perri',
  'Escapando la Trampa de Construir de Melissa Perri explica por que las organizaciones se obsesionan con entregar features en lugar de crear valor, y como escapar de este patron destructivo.

CONCEPTOS FUNDAMENTALES:

1. La Trampa de Construir: Medir exito por cantidad de features entregadas en lugar de resultados de negocio logrados.

2. Output vs Outcome: Output es lo que produces (features). Outcome es el cambio en comportamiento del usuario que crea valor.

3. La Organizacion Orientada a Producto: Una empresa donde los equipos de producto tienen autonomia para resolver problemas de clientes.

SENALES DE LA TRAMPA:

- Roadmaps de features con fechas especificas
- Product managers que son project managers
- Exito medido por features entregadas
- Poca o ninguna investigacion con usuarios
- Stakeholders que dictan soluciones

EL FRAMEWORK DE ESTRATEGIA DE PRODUCTO:

- Vision de Compania: El mundo que quieres crear.
- Portafolio de Productos: Como los productos trabajan juntos para lograr la vision.
- Estrategia de Producto: Como un producto especifico contribuye a la estrategia de la compania.
- Iniciativas de Producto: Los problemas grandes que el equipo abordara.

ROLES Y RESPONSABILIDADES:

- CPO: Conecta la estrategia de negocio con la estrategia de producto.
- VP de Producto: Asegura que los equipos tengan las herramientas y contexto para tener exito.
- Director de Producto: Traduce la estrategia en problemas concretos para equipos.
- Product Manager: Resuelve problemas especificos de clientes que mueven metricas de negocio.

APLICACION PROFESIONAL:

- Transformacion de Producto: Mover organizaciones de fabricas de features a equipos empoderados.
- Career Development: Entender el camino de crecimiento en organizaciones de producto modernas.
- Comunicacion con Stakeholders: Cambiar conversaciones de que construir a que problemas resolver.

Lectura obligatoria para cualquier profesional frustrado con organizaciones que construyen sin estrategia.',
  'Producto',
  'Intermedio',
  'Espanol',
  45
);

-- 15. Influence - Robert Cialdini
INSERT INTO knowledge_base (title, author, content, category, difficulty_level, language, estimated_read_time)
VALUES (
  'Influence',
  'Robert B. Cialdini',
  'Influencia de Robert Cialdini es el libro definitivo sobre la psicologia de la persuasion, identificando los seis principios universales que guian el comportamiento humano.

CONCEPTOS FUNDAMENTALES:

Los seres humanos usan atajos mentales (heuristicos) para tomar decisiones. Estos atajos pueden ser activados para influir en comportamiento de manera etica o manipulativa.

LOS SEIS PRINCIPIOS DE INFLUENCIA:

1. Reciprocidad: Sentimos obligacion de devolver favores. Un pequeno regalo o concesion genera sentimiento de deuda.

2. Compromiso y Consistencia: Una vez que tomamos una posicion, nos sentimos compelidos a comportarnos consistentemente con ella.

3. Prueba Social: Cuando no sabemos que hacer, miramos lo que hacen otros en situaciones similares.

4. Autoridad: Tendemos a obedecer a figuras de autoridad, incluso cuando sus instrucciones son cuestionables.

5. Agrado: Decimos si mas facilmente a personas que nos agradan, ya sea por atractivo, similitud o cumplidos.

6. Escasez: Valoramos mas lo que es raro o esta por desaparecer. La urgencia y exclusividad motivan accion.

APLICACION ETICA:

- Reconocer cuando estos principios se usan contigo para tomar decisiones mas conscientes.
- Usar los principios para comunicar valor genuino, no para manipular.
- Construir relaciones autenticas basadas en reciprocidad real.

APLICACION PROFESIONAL:

- Ventas: Estructurar presentaciones y ofertas que activen multiples principios naturalmente.

- Marketing: Disenar campanas que aprovechen prueba social, escasez y autoridad legitimamente.

- Negociacion: Usar reciprocidad y compromiso para lograr acuerdos mutuamente beneficiosos.

- Liderazgo: Influir en equipos a traves de autoridad ganada y relaciones genuinas.

- Defensa Personal: Reconocer tacticas de manipulacion en publicidad, ventas y politica.

La investigacion mas citada sobre persuasion, esencial para cualquier profesional.',
  'Psicologia',
  'Intermedio',
  'Espanol',
  50
);

-- Final count verification
SELECT 
  'RESULTADO FINAL' as status,
  COUNT(*) as total_libros,
  COUNT(CASE WHEN LENGTH(content) > 500 THEN 1 END) as libros_completos
FROM knowledge_base;
