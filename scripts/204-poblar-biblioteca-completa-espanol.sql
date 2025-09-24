-- Limpiar tabla existente y repoblar con libros en español
DELETE FROM knowledge_base;

-- Resetear secuencia de ID
ALTER SEQUENCE knowledge_base_id_seq RESTART WITH 1;

-- Insertar libros de desarrollo profesional en español
INSERT INTO knowledge_base (title, category, content, author, tags, slug, read_count) VALUES

-- PRODUCTIVIDAD
('Organízate con Eficacia', 'Productividad', 
'Organízate con Eficacia (Getting Things Done) es un sistema revolucionario de gestión del tiempo y la productividad que ha transformado la vida de millones de personas en todo el mundo.

**El Problema Fundamental:**
Nuestra mente no está diseñada para recordar tareas y compromisos. Cuando intentamos mantener todo en nuestra cabeza, experimentamos estrés constante y perdemos claridad mental.

**Los Cinco Pasos del Método GTD:**

**1. Capturar**
- Recopila todo lo que llame tu atención en bandejas de entrada confiables
- Usa herramientas como libretas, aplicaciones o grabadoras de voz
- El objetivo es sacar todo de tu mente y ponerlo en un sistema externo

**2. Aclarar**
- Procesa cada elemento de tus bandejas de entrada
- Pregúntate: "¿Es accionable?"
- Si no es accionable: elimínalo, archívalo o ponlo en "algún día/tal vez"
- Si es accionable: define la siguiente acción específica

**3. Organizar**
- Coloca los elementos accionables en las listas apropiadas
- Usa contextos como @llamadas, @ordenador, @recados
- Mantén un calendario solo para citas y compromisos con fecha específica

**4. Reflexionar**
- Revisa semanalmente todo tu sistema
- Actualiza listas, proyectos y compromisos
- Mantén tu sistema actualizado y confiable

**5. Comprometerse**
- Usa tu sistema para tomar decisiones sobre qué hacer
- Confía en tu sistema para elegir la siguiente acción
- Actúa con confianza sabiendo que no se te olvida nada

GTD no es solo un sistema de productividad, es una forma de vida que te permite estar presente y enfocado en lo que realmente importa.',
'David Allen', 
ARRAY['productividad', 'organización', 'gestión del tiempo', 'gtd', 'eficiencia'], 
'organizate-con-eficacia', 2847),

('Trabajo Profundo', 'Productividad',
'El trabajo profundo son actividades profesionales realizadas en un estado de concentración libre de distracciones que llevan las capacidades cognitivas al límite. Estos esfuerzos crean nuevo valor, mejoran tu habilidad, y son difíciles de replicar.

**La Hipótesis del Trabajo Profundo:**
La capacidad de realizar trabajo profundo se está volviendo cada vez más rara exactamente al mismo tiempo que se está volviendo cada vez más valiosa en nuestra economía. Como consecuencia, los pocos que cultiven esta habilidad, y luego la conviertan en el núcleo de su vida laboral, prosperarán.

**Las Cuatro Reglas del Trabajo Profundo:**

**1. Trabaja Profundamente**
- Transforma el trabajo profundo de una aspiración en una práctica regular
- Desarrolla rutinas y rituales para apoyar el trabajo profundo
- Elige entre filosofías: monástica, bimodal, rítmica o periodística

**2. Abraza el Aburrimiento**
- La capacidad de concentrarse intensamente es una habilidad que debe entrenarse
- Deshazte de la dependencia de la distracción
- Practica la meditación productiva

**3. Abandona las Redes Sociales**
- Las herramientas de red nos distraen del trabajo que requiere concentración ininterrumpida
- Aplica el enfoque del artesano para la selección de herramientas
- Usa las redes sociales solo si proporcionan beneficios sustanciales

**4. Drena las Aguas Poco Profundas**
- Identifica y minimiza el trabajo superficial en tu horario
- Programa cada minuto de tu día
- Termina tu trabajo a una hora específica

El trabajo profundo no es solo una estrategia de productividad, es una filosofía que puede transformar tanto tu trabajo como tu vida.',
'Cal Newport',
ARRAY['productividad', 'enfoque', 'concentración', 'trabajo profundo', 'distracción'],
'trabajo-profundo', 1847),

-- DESARROLLO PERSONAL
('Los 7 Hábitos de la Gente Altamente Efectiva', 'Desarrollo Personal',
'Los 7 Hábitos de la Gente Altamente Efectiva presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales.

**Los 7 Hábitos:**

**VICTORIA PRIVADA (Independencia)**

**Hábito 1: Ser Proactivo**
- Toma responsabilidad de tu vida y decisiones
- Enfócate en tu Círculo de Influencia, no en tu Círculo de Preocupación
- Usa lenguaje proactivo: "Yo puedo", "Yo elegiré", "Yo prefiero"

**Hábito 2: Comenzar con el Fin en Mente**
- Define claramente tu misión y visión personal
- Crea una declaración de misión personal basada en principios
- Todos los logros se crean mentalmente antes que físicamente

**Hábito 3: Poner Primero lo Primero**
- Gestiona tu tiempo basándote en principios, no en prioridades
- Enfócate en actividades del Cuadrante II (importante pero no urgente)
- Aprende a decir "no" a lo bueno para decir "sí" a lo mejor

**VICTORIA PÚBLICA (Interdependencia)**

**Hábito 4: Pensar Ganar-Ganar**
- Busca beneficio mutuo en todas las interacciones humanas
- Desarrolla una mentalidad de abundancia, no de escasez

**Hábito 5: Buscar Primero Entender, Luego Ser Entendido**
- Practica la escucha empática antes de buscar ser escuchado
- Escucha con la intención de entender, no de responder

**Hábito 6: Sinergizar**
- Combina las fortalezas de las personas para lograr objetivos
- Valora las diferencias y busca la tercera alternativa

**RENOVACIÓN CONTINUA**

**Hábito 7: Afilar la Sierra**
- Renueva regularmente las cuatro dimensiones: física, espiritual, mental y social/emocional

Los 7 hábitos son principios fundamentales de efectividad humana que se convierten en la base del carácter.',
'Stephen R. Covey',
ARRAY['desarrollo personal', 'liderazgo', 'efectividad', 'hábitos', 'principios'],
'7-habitos-gente-altamente-efectiva', 4521),

('Hábitos Atómicos', 'Desarrollo Personal',
'Los cambios que parecen pequeños e insignificantes al principio se convertirán en resultados extraordinarios si estás dispuesto a mantenerlos durante años. Este es el poder de los hábitos atómicos.

**Las Cuatro Leyes del Cambio de Comportamiento:**

**1ª Ley: Hazlo Obvio**
- Usa intenciones de implementación
- Usa el apilamiento de hábitos
- Diseña tu ambiente para hacer obvios los buenos hábitos

**2ª Ley: Hazlo Atractivo**
- Usa el agrupamiento de tentaciones
- Únete a una cultura donde tu comportamiento deseado sea normal
- Crea un ritual de motivación

**3ª Ley: Hazlo Fácil**
- Reduce la fricción para buenos hábitos
- Usa la Regla de los Dos Minutos
- Prepara tu ambiente para acciones futuras

**4ª Ley: Hazlo Satisfactorio**
- Usa refuerzo inmediato
- Usa un rastreador de hábitos
- Nunca falles dos veces

**Conceptos Clave:**
- Sistemas vs. Objetivos
- Hábitos Basados en Identidad
- La Meseta del Potencial Latente

El secreto para obtener resultados que duren es nunca dejar de hacer mejoras.',
'James Clear',
ARRAY['hábitos', 'cambio de comportamiento', 'automejora', 'sistemas', 'identidad'],
'habitos-atomicos', 6789),

('Mentalidad de Crecimiento', 'Desarrollo Personal',
'La mentalidad que adoptas profundamente afecta la forma en que vives tu vida. Puede determinar si te conviertes en la persona que quieres ser y si logras las cosas que valoras.

**Dos Mentalidades:**

**Mentalidad Fija:**
- Cree que las cualidades básicas son rasgos fijos
- Evita desafíos por miedo al fracaso
- Ve el esfuerzo como signo de baja habilidad
- Ignora críticas útiles

**Mentalidad de Crecimiento:**
- Cree que las cualidades básicas se pueden desarrollar
- Abraza desafíos como oportunidades
- Ve el esfuerzo como el camino al dominio
- Aprende de las críticas

**Aplicaciones:**
- En la educación: fomenta el amor por el aprendizaje
- En los negocios: crea culturas de innovación
- En las relaciones: permite crecimiento mutuo
- En la crianza: desarrolla resiliencia en los niños

**Desarrollando una Mentalidad de Crecimiento:**
1. Aprende a escuchar tu mentalidad fija
2. Reconoce que tienes una elección
3. Habla con tu mentalidad fija
4. Toma acción de mentalidad de crecimiento

La mentalidad de crecimiento es la creencia de que tus habilidades más básicas pueden desarrollarse a través de dedicación y trabajo duro.',
'Carol S. Dweck',
ARRAY['mentalidad', 'crecimiento', 'psicología', 'desarrollo', 'aprendizaje'],
'mentalidad-crecimiento', 3456),

-- PSICOLOGÍA
('Inteligencia Emocional', 'Psicología',
'La Inteligencia Emocional es la capacidad de reconocer, entender y manejar nuestras propias emociones, así como reconocer, entender e influir en las emociones de otros.

**Los Cinco Componentes:**

**1. Autoconciencia Emocional**
- Reconocer y entender tus propias emociones
- Ser consciente de cómo las emociones afectan pensamientos y comportamiento
- Conocer fortalezas y limitaciones emocionales

**2. Autorregulación**
- Manejar efectivamente emociones disruptivas e impulsos
- Mantener estándares de honestidad e integridad
- Ser flexible en el manejo del cambio

**3. Motivación**
- Estar impulsado a lograr por el placer del logro
- Tener un fuerte impulso para mejorar el desempeño
- Ser optimista incluso frente al fracaso

**4. Empatía**
- Entender las emociones de otros
- Anticipar y satisfacer necesidades de clientes
- Ayudar a desarrollar habilidades de otros

**5. Habilidades Sociales**
- Ser efectivo en liderar el cambio
- Ser persuasivo y comunicarse efectivamente
- Construir y liderar equipos

**El Cerebro Emocional vs. Racional:**
- Sistema Límbico: procesa emociones rápidamente
- Neocórtex: procesa información lógicamente

La inteligencia emocional es más predictiva del éxito que el CI tradicional.',
'Daniel Goleman',
ARRAY['inteligencia emocional', 'psicología', 'liderazgo', 'relaciones', 'autoconciencia'],
'inteligencia-emocional', 3156),

('El Poder del Hábito', 'Psicología',
'Los hábitos no son el destino. Los hábitos pueden ser ignorados, cambiados o reemplazados. Pero la razón por la que el descubrimiento del bucle del hábito es tan importante es que revela una verdad básica: cuando emerge un hábito, el cerebro deja de participar completamente en la toma de decisiones.

**El Bucle del Hábito:**

**1. La Señal**
- Un disparador que le dice al cerebro que entre en modo automático
- Puede ser una ubicación, tiempo, estado emocional, otras personas o acción inmediatamente anterior

**2. La Rutina**
- El comportamiento en sí mismo
- Puede ser física, mental o emocional

**3. La Recompensa**
- El beneficio que obtienes del hábito
- Ayuda al cerebro a determinar si vale la pena recordar este bucle particular

**La Regla de Oro del Cambio de Hábitos:**
No puedes extinguir un mal hábito, solo puedes cambiarlo. Usa la misma señal, proporciona la misma recompensa, pero cambia la rutina.

**Hábitos Clave:**
Algunos hábitos importan más que otros porque tienen el poder de iniciar una reacción en cadena que cambia otros hábitos. Estos se llaman "hábitos clave".

**Aplicaciones:**
- Hábitos individuales: identifica señales y recompensas
- Hábitos organizacionales: cambia culturas corporativas
- Hábitos sociales: movimientos sociales y cambio comunitario

**Pasos para Cambiar Hábitos:**
1. Identifica la rutina
2. Experimenta con recompensas
3. Aísla la señal
4. Ten un plan

Los hábitos pueden ser cambiados si entendemos cómo funcionan.',
'Charles Duhigg',
ARRAY['hábitos', 'psicología', 'neurociencia', 'cambio', 'comportamiento'],
'poder-del-habito', 2890),

-- COMUNICACIÓN
('Cómo Ganar Amigos e Influir sobre las Personas', 'Comunicación',
'Este libro clásico enseña técnicas fundamentales para manejar personas, hacer que te aprecien, ganar a la gente a tu manera de pensar y ser un líder.

**PARTE I: TÉCNICAS FUNDAMENTALES**

**Principio 1: No Critiques, No Condenes, No Te Quejes**
- La crítica es inútil porque pone a la persona a la defensiva
- En lugar de criticar, trata de entender por qué hacen lo que hacen

**Principio 2: Demuestra Aprecio Honesto y Sincero**
- El deseo más profundo del ser humano es sentirse importante
- Aprecia genuinamente las buenas cualidades de otros

**Principio 3: Despierta un Deseo Vehemente**
- Habla de lo que la otra persona quiere
- Conecta tus ideas con sus motivaciones

**PARTE II: SEIS MANERAS DE AGRADAR**

1. Interésate genuinamente en otras personas
2. Sonríe
3. Recuerda que el nombre es el sonido más dulce
4. Sé un buen oyente
5. Habla en términos de los intereses del otro
6. Haz que la otra persona se sienta importante

**PARTE III: LOGRA QUE LA GENTE PIENSE COMO TÚ**

1. La única forma de ganar una discusión es evitándola
2. Demuestra respeto por las opiniones ajenas
3. Si estás equivocado, admítelo rápida y enfáticamente
4. Comienza de manera amigable
5. Consigue que digan "sí, sí" inmediatamente
6. Permite que la otra persona hable mucho

Los principios de Carnegie se basan en necesidades humanas fundamentales que no cambian con el tiempo.',
'Dale Carnegie',
ARRAY['comunicación', 'relaciones interpersonales', 'liderazgo', 'influencia', 'habilidades sociales'],
'como-ganar-amigos-influir-personas', 5234),

('Conversaciones Cruciales', 'Comunicación',
'Las conversaciones cruciales son discusiones entre dos o más personas donde las opiniones varían, las emociones son fuertes y los resultados importan. Estas conversaciones pueden tener un gran impacto en tu carrera, felicidad y vida.

**¿Qué Hace Crucial una Conversación?**
- Las opiniones varían
- Los resultados importan
- Las emociones son fuertes

**El Poder del Diálogo:**
Cuando las personas se sienten seguras para compartir su significado, estás en diálogo. El flujo libre de significado entre personas es clave para conversaciones cruciales exitosas.

**Comienza con el Corazón:**
Antes de abrir la boca, necesitas saber qué realmente quieres:
- ¿Qué quiero realmente para mí?
- ¿Qué quiero realmente para otros?
- ¿Qué quiero realmente para la relación?

**Aprende a Observar:**
Busca problemas de seguridad y silencio o violencia:
- Silencio: enmascarar, evitar, retirarse
- Violencia: controlar, etiquetar, atacar

**Haz que Sea Seguro:**
Cuando notes que la seguridad está en riesgo:
- Disculparse cuando hayas cometido un error
- Contrastar cuando otros malinterpreten tu propósito
- Crear propósito mutuo cuando estén en propósitos cruzados

**EXPRESA tu Camino:**
- Comparte tus hechos
- Cuenta tu historia
- Pregunta por los caminos de otros
- Habla tentativamente
- Fomenta las pruebas

Dominar las conversaciones cruciales mejorará tus relaciones, aumentará tu influencia y te ayudará a lograr mejores resultados.',
'Kerry Patterson, Joseph Grenny, Ron McMillan, Al Switzler',
ARRAY['comunicación', 'conversaciones difíciles', 'diálogo', 'resolución de conflictos', 'liderazgo'],
'conversaciones-cruciales', 1543),

-- LIDERAZGO
('Los Primeros 90 Días', 'Liderazgo',
'Los primeros 90 días en un nuevo rol de liderazgo son críticos. Las acciones que tomes durante este período determinarán en gran medida si tienes éxito o fracasas en tu nueva posición.

**La Línea de Tiempo de Transición:**

**Antes del Día Uno: Prepárate**
- Oriéntate a la situación del negocio
- Comienza a construir relaciones clave
- Clarifica expectativas con tu nuevo jefe

**Primeros 30 Días: Aprende y Escucha**
- Evalúa la situación que estás heredando
- Construye relaciones con stakeholders clave
- Entiende la cultura y política

**Días 30-60: Desarrolla tu Estrategia**
- Completa tu evaluación situacional
- Comienza a hacer cambios necesarios
- Construye tu equipo y alinea recursos

**Días 60-90: Ejecuta y Establece Momentum**
- Implementa tus iniciativas estratégicas
- Mide progreso y ajusta curso
- Solidifica relaciones clave

**El Modelo STARS:**
- Startup: ensamblar capacidades para nuevo negocio
- Turnaround: salvar negocio en problemas serios
- Accelerated Growth: manejar expansión rápida
- Realignment: revitalizar negocio exitoso con problemas
- Sustaining Success: preservar vitalidad de negocio exitoso

**Construyendo tu Equipo:**
- Mantener: alto desempeño que encaja
- Desarrollar: personas con potencial que necesitan apoyo
- Mover: buenas personas que no encajan
- Reemplazar: bajo desempeño o mal encaje

Los primeros 90 días establecen la trayectoria para toda tu permanencia en el rol.',
'Michael Watkins',
ARRAY['liderazgo', 'transición', 'nuevo rol', '90 días', 'gestión', 'estrategia'],
'primeros-90-dias', 967),

('Liderazgo: La Inteligencia Emocional', 'Liderazgo',
'El liderazgo no se trata de dominar a otros, sino de dominar a uno mismo. Los líderes más efectivos son aquellos que entienden sus propias emociones y las de otros.

**Competencias de Liderazgo Emocional:**

**Autoconciencia:**
- Conciencia emocional: reconocer emociones y sus efectos
- Autoevaluación precisa: conocer fortalezas y limitaciones
- Autoconfianza: fuerte sentido de autoestima y capacidades

**Autorregulación:**
- Autocontrol: manejar emociones e impulsos disruptivos
- Adaptabilidad: flexibilidad en manejar el cambio
- Orientación al logro: esforzarse por mejorar el desempeño
- Perspectiva positiva: ver lo bueno en personas, situaciones y eventos

**Conciencia Social:**
- Empatía: entender emociones de otros
- Conciencia organizacional: leer redes organizacionales
- Orientación al servicio: reconocer y satisfacer necesidades de seguidores

**Gestión de Relaciones:**
- Influencia: tener impacto positivo en otros
- Coach y mentor: ayudar a otros a desarrollarse
- Gestión de conflictos: resolver desacuerdos
- Liderazgo de equipo: inspirar y guiar grupos
- Liderazgo inspiracional: inspirar y motivar con visión convincente

**Estilos de Liderazgo:**
- Visionario: moviliza personas hacia una visión
- Coach: conecta lo que la persona quiere con objetivos organizacionales
- Afiliativo: crea armonía y construye vínculos emocionales
- Democrático: forja consenso a través de participación
- Marcapasos: espera excelencia y autodirección
- Comandante: demanda cumplimiento inmediato

El liderazgo emocionalmente inteligente crea resonancia y mueve a las personas en dirección positiva.',
'Daniel Goleman',
ARRAY['liderazgo', 'inteligencia emocional', 'gestión', 'equipos', 'influencia'],
'liderazgo-inteligencia-emocional', 2134),

-- EMPRENDIMIENTO
('El Método Lean Startup', 'Emprendimiento',
'La metodología Lean Startup es un enfoque científico para crear y gestionar startups exitosos en una era donde las empresas necesitan innovar más que nunca.

**Principios Fundamentales:**

**Ciclo Construir-Medir-Aprender:**
La actividad fundamental de un startup es convertir ideas en productos, medir cómo responden los clientes, y luego aprender si pivotar o perseverar.

**Producto Mínimo Viable (MVP):**
El MVP es esa versión de un nuevo producto que permite al equipo recopilar la máxima cantidad de aprendizaje validado sobre clientes con el menor esfuerzo.

**Aprendizaje Validado:**
Es el proceso de demostrar empíricamente que un equipo ha descubierto verdades valiosas sobre las perspectivas presentes y futuras del negocio.

**Los Cinco Principios:**

1. Los emprendedores están en todas partes
2. El emprendimiento es gestión
3. Aprendizaje validado
4. Construir-Medir-Aprender
5. Contabilidad de la innovación

**Conceptos Clave:**

**Pivotar vs. Perseverar:**
Un pivote es una corrección de curso estructurada diseñada para probar una nueva hipótesis fundamental sobre el producto, estrategia y motor de crecimiento.

**Motores de Crecimiento:**
- Motor Pegajoso: se enfoca en atraer y retener clientes
- Motor Viral: depende de transmisión persona a persona
- Motor Pagado: usa publicidad o ventas para adquirir clientes

**Implementación Práctica:**
1. Identifica tus suposiciones de salto de fe
2. Construye un MVP para probar estas suposiciones
3. Establece métricas base
4. Ajusta el motor desde la base hacia el ideal

La metodología Lean Startup ayuda a reducir desperdicios, aumentar probabilidades de éxito y construir productos que los clientes realmente quieren.',
'Eric Ries',
ARRAY['emprendimiento', 'startup', 'innovación', 'lean', 'mvp', 'pivote'],
'metodo-lean-startup', 1892),

-- FINANZAS PERSONALES
('Padre Rico, Padre Pobre', 'Finanzas Personales',
'Este libro desafía la creencia de que necesitas ganar un ingreso alto para ser rico y explica la diferencia entre trabajar por dinero y hacer que el dinero trabaje para ti.

**Las Seis Lecciones:**

**Lección 1: Los Ricos No Trabajan por Dinero**
- Los pobres y clase media trabajan por dinero
- Los ricos hacen que el dinero trabaje para ellos
- Aprende a hacer que el dinero trabaje para ti

**Lección 2: ¿Por Qué Enseñar Alfabetización Financiera?**
- No es cuánto dinero ganas, sino cuánto conservas
- Los ricos adquieren activos, los pobres y clase media adquieren pasivos
- Debes conocer la diferencia entre activo y pasivo

**Lección 3: Ocúpate de tu Propio Negocio**
- Mantén tu trabajo diario, pero construye tu columna de activos
- Los ricos se enfocan en su columna de activos mientras otros se enfocan en sus estados de ingresos

**Lección 4: La Historia de los Impuestos y el Poder de las Corporaciones**
- Los ricos usan corporaciones para proteger y hacer crecer su riqueza
- Conocimiento financiero = poder financiero

**Lección 5: Los Ricos Inventan el Dinero**
- Desarrolla tu genio financiero
- Toma riesgos calculados
- Aprende a reconocer oportunidades

**Lección 6: Trabaja para Aprender, No por Dinero**
- Desarrolla habilidades múltiples
- Especialización es para empleados, generalización es para dueños

**Conceptos Clave:**
- Activos vs. Pasivos
- Flujo de efectivo vs. Ganancias de capital
- Inteligencia financiera
- Hacer que el dinero trabaje para ti

La educación financiera es la base de la riqueza.',
'Robert T. Kiyosaki',
ARRAY['finanzas personales', 'inversión', 'riqueza', 'activos', 'educación financiera'],
'padre-rico-padre-pobre', 4567),

-- NEGOCIACIÓN
('Obtenga el Sí', 'Negociación',
'Este libro presenta el método de negociación de Harvard, un enfoque directo para llegar a acuerdos mutuamente aceptables en todo tipo de conflictos.

**Los Cuatro Principios Fundamentales:**

**1. Separa a las Personas del Problema**
- Ataca el problema, no a la persona
- Reconoce y entiende las emociones
- Comunícate claramente
- Escucha activamente y reconoce lo que se dice

**2. Enfócate en Intereses, No en Posiciones**
- Las posiciones son lo que la gente dice que quiere
- Los intereses son por qué lo quieren
- Pregunta "¿Por qué?" y "¿Por qué no?"
- Identifica intereses compartidos y compatibles

**3. Genera Opciones de Beneficio Mutuo**
- Separa la invención de la decisión
- Amplía las opciones en lugar de buscar una sola respuesta
- Busca beneficios mutuos
- Haz que decidir sea fácil para ellos

**4. Usa Criterios Objetivos**
- Desarrolla opciones justas independientes de la voluntad
- Razona y mantente abierto a razones
- Nunca cedas a la presión, solo a principios

**Tácticas Adicionales:**

**¿Qué Si No Aceptan?**
- Desarrolla tu BATNA (Mejor Alternativa a un Acuerdo Negociado)
- Conoce tu punto de reserva
- Mejora tu BATNA antes y durante la negociación

**¿Qué Si Usan Trucos Sucios?**
- Reconoce la táctica
- Lleva la atención al proceso
- Cuestiona la táctica y su legitimidad

**¿Qué Si Son Más Poderosos?**
- Protégete
- Usa tu conocimiento de sus intereses
- Desarrolla tu BATNA

**Aplicaciones Prácticas:**
- Negociaciones comerciales
- Resolución de conflictos familiares
- Negociaciones laborales
- Disputas internacionales

El método de Harvard se enfoca en llegar a acuerdos sabios de manera eficiente y amigable.',
'Roger Fisher, William Ury, Bruce Patton',
ARRAY['negociación', 'resolución de conflictos', 'comunicación', 'acuerdos', 'harvard'],
'obtenga-el-si', 2345),

-- CREATIVIDAD E INNOVACIÓN
('Pensar Rápido, Pensar Despacio', 'Psicología',
'Este libro explora los dos sistemas que impulsan la forma en que pensamos: el Sistema 1, rápido e intuitivo, y el Sistema 2, lento y deliberativo.

**Los Dos Sistemas:**

**Sistema 1: Rápido**
- Opera automática y rápidamente
- Requiere poco o ningún esfuerzo
- Difícil de controlar o apagar
- Genera impresiones, intuiciones y sentimientos

**Sistema 2: Lento**
- Requiere atención y esfuerzo mental
- Opera más lentamente y deliberadamente
- Puede ser dirigido y controlado
- Responsable del razonamiento y decisiones complejas

**Sesgos Cognitivos Clave:**

**Sesgo de Anclaje:**
- Las primeras impresiones influyen desproporcionadamente en decisiones posteriores
- Los números aleatorios pueden servir como anclas

**Efecto Halo:**
- La tendencia a que una impresión en un área influya en la opinión en otras áreas
- "Lo que ves es todo lo que hay"

**Sesgo de Confirmación:**
- Buscamos información que confirme nuestras creencias existentes
- Ignoramos evidencia contradictoria

**Aversión a las Pérdidas:**
- Las pérdidas se sienten aproximadamente el doble de poderosas que las ganancias equivalentes
- "Las pérdidas duelen más que las ganancias equivalentes se sienten bien"

**Aplicaciones Prácticas:**
- Toma de decisiones empresariales
- Inversiones y finanzas personales
- Política pública
- Medicina y diagnóstico

**Mejorando la Toma de Decisiones:**
- Reconoce cuándo confiar en la intuición vs. análisis deliberado
- Usa listas de verificación para decisiones importantes
- Busca activamente evidencia contradictoria
- Considera múltiples perspectivas

Entender cómo pensamos nos ayuda a tomar mejores decisiones y evitar errores costosos.',
'Daniel Kahneman',
ARRAY['psicología', 'toma de decisiones', 'sesgos cognitivos', 'pensamiento', 'economía conductual'],
'pensar-rapido-pensar-despacio', 3789);

-- Verificar inserción
SELECT COUNT(*) as total_libros_insertados FROM knowledge_base;
