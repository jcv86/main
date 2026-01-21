-- Script 026: Complete 6 starter books with 1000+ characters each
-- These are the books shown in "Comienza Tu Viaje Profesional"

-- 1. Start with Why - Simon Sinek
UPDATE knowledge_base SET
  content = 'START WITH WHY de Simon Sinek

CONCEPTO CENTRAL: Las personas no compran LO QUE haces, compran POR QUE lo haces.

EL CIRCULO DORADO:

El modelo del Circulo Dorado explica por que algunos lideres y organizaciones inspiran mientras otros no logran conectar. Tiene tres niveles concentricos:

1. POR QUE (Centro): Tu proposito, causa o creencia fundamental. La razon por la que tu organizacion existe mas alla de ganar dinero. Muy pocas personas u organizaciones pueden articular claramente su Por Que.

2. COMO (Medio): Los procesos especificos, valores diferenciadores o propuesta de valor unica que te distinguen. Es como implementas tu Por Que.

3. QUE (Exterior): Los productos, servicios o resultados tangibles. Todas las organizaciones saben QUE hacen, pero esto no inspira lealtad.

LA BIOLOGIA DEL LIDERAZGO:

El Circulo Dorado corresponde directamente a como funciona el cerebro humano:
- El neocortex (exterior) procesa datos racionales como caracteristicas y beneficios
- El sistema limbico (centro) controla emociones, comportamiento y toma de decisiones

Por esto, cuando comunicamos desde el Por Que, hablamos directamente a la parte del cerebro que impulsa la accion y la lealtad.

CASOS DE ESTUDIO:

Apple no vende computadoras - vende la creencia de pensar diferente y desafiar el status quo. Sus productos son simplemente la prueba de esa creencia.

Martin Luther King no tenia un plan detallado - tenia un sueno que resonaba con las creencias profundas de millones de personas.

Los hermanos Wright no tenian los mejores recursos - tenian un proposito claro que los motivo a superar fracasos repetidos.

APLICACION PROFESIONAL:

- Liderazgo: Los mejores lideres inspiran accion comunicando primero su proposito, no sus logros
- Contratacion: Contrata personas que crean en tu Por Que, no solo que necesiten un trabajo
- Marketing: Los clientes leales son aquellos que comparten tus creencias fundamentales
- Carrera: Encuentra organizaciones cuyo Por Que se alinee con el tuyo para encontrar satisfaccion duradera
- Innovacion: El Por Que proporciona la brujula para todas las decisiones estrategicas

EJERCICIO PRACTICO:

Preguntate: Si tu organizacion desapareciera manana, que perderia el mundo? La respuesta revela tu verdadero Por Que.',
  author = 'Simon Sinek',
  category = 'Liderazgo',
  difficulty_level = 'Principiante',
  language = 'Espanol',
  estimated_read_time = 45
WHERE title ILIKE '%Start with Why%' OR title ILIKE '%Empieza con el Por Que%';

-- 2. The Power of Habit - Charles Duhigg
UPDATE knowledge_base SET
  content = 'EL PODER DEL HABITO de Charles Duhigg

CONCEPTO CENTRAL: Los habitos no son destino - pueden ser ignorados, cambiados o reemplazados una vez que entiendes como funcionan.

EL BUCLE DEL HABITO:

Todo habito opera en un ciclo de tres partes que el cerebro ejecuta automaticamente:

1. SENAL: El disparador que inicia el comportamiento automatico. Puede ser una ubicacion, hora del dia, estado emocional, otras personas o una accion inmediatamente anterior.

2. RUTINA: El comportamiento en si mismo - puede ser fisico, mental o emocional. Es la parte que queremos cambiar.

3. RECOMPENSA: La satisfaccion que el cerebro obtiene y que refuerza el ciclo. El cerebro decide si vale la pena recordar este bucle para el futuro.

LA REGLA DE ORO DEL CAMBIO:

No puedes eliminar un mal habito - solo puedes cambiarlo. Para modificar un habito existente:
- Mantener la misma SENAL
- Proporcionar la misma RECOMPENSA  
- Cambiar solo la RUTINA

Esto funciona porque los habitos son patrones neurologicos grabados en los ganglios basales que nunca desaparecen completamente.

HABITOS CLAVE (Keystone Habits):

Algunos habitos tienen el poder de iniciar una reaccion en cadena que cambia otros habitos:
- El ejercicio regular frecuentemente lleva a mejor alimentacion y mayor productividad
- Hacer la cama cada manana se correlaciona con mayor bienestar general
- Las reuniones familiares regulares predicen mejor rendimiento academico en ninos

LA VOLUNTAD COMO MUSCULO:

La fuerza de voluntad es el habito clave mas importante. Funciona como un musculo:
- Se agota con el uso durante el dia
- Se fortalece con practica consistente
- Requiere planificacion anticipada para momentos de debilidad

HABITOS ORGANIZACIONALES:

Las empresas exitosas crean habitos institucionales que permiten:
- Toma de decisiones sin friccion constante
- Treguas entre departamentos en competencia
- Crisis como oportunidades para cambiar patrones arraigados

APLICACION PROFESIONAL:

- Productividad: Disenar senales ambientales que disparen comportamientos deseados
- Liderazgo: Identificar y cultivar habitos clave en tu equipo
- Cambio organizacional: Usar crisis como ventanas de oportunidad para nuevos habitos
- Desarrollo personal: Crear sistemas que hagan inevitable el comportamiento deseado

EJERCICIO PRACTICO:

Para cambiar un habito: 1) Identifica la rutina, 2) Experimenta con recompensas, 3) Aisla la senal, 4) Disena un plan.',
  author = 'Charles Duhigg',
  category = 'Productividad',
  difficulty_level = 'Principiante',
  language = 'Espanol',
  estimated_read_time = 50
WHERE title ILIKE '%Power of Habit%' OR title ILIKE '%Poder del Habito%';

-- 3. Liderazgo Transformacional - James Kouzes & Barry Posner
UPDATE knowledge_base SET
  content = 'EL DESAFIO DEL LIDERAZGO de James Kouzes y Barry Posner

CONCEPTO CENTRAL: El liderazgo no es sobre personalidad - es sobre comportamiento. Cualquiera puede aprender las practicas que distinguen a los lideres extraordinarios.

LAS CINCO PRACTICAS DEL LIDERAZGO EJEMPLAR:

Basadas en mas de 30 anos de investigacion con millones de lideres en todo el mundo:

1. MODELAR EL CAMINO:
Los lideres clarifican valores encontrando su propia voz y afirmando valores compartidos. Dan el ejemplo alineando acciones con valores compartidos. La credibilidad es la base del liderazgo - DWYSYWD (Do What You Say You Will Do).

2. INSPIRAR UNA VISION COMPARTIDA:
Los lideres visualizan el futuro imaginando posibilidades emocionantes y ennoblecedoras. Reclutan a otros en una vision comun apelando a aspiraciones compartidas. La vision sin accion es solo un sueno; la accion sin vision es pasar el tiempo.

3. DESAFIAR EL PROCESO:
Los lideres buscan oportunidades tomando la iniciativa y buscando formas innovadoras de mejorar. Experimentan y toman riesgos generando pequenas victorias y aprendiendo de los errores. El fracaso es simplemente la oportunidad de comenzar de nuevo mas inteligentemente.

4. HABILITAR A OTROS PARA ACTUAR:
Los lideres fomentan la colaboracion construyendo confianza y facilitando relaciones. Fortalecen a otros aumentando la autodeterminacion y desarrollando competencia. El liderazgo no es un acto solitario - requiere un equipo.

5. ALENTAR EL CORAZON:
Los lideres reconocen contribuciones mostrando aprecio por la excelencia individual. Celebran los valores y victorias creando un espiritu de comunidad. Las personas necesitan aliento para funcionar a su maximo potencial.

LOS DIEZ COMPROMISOS:

Cada practica tiene dos compromisos especificos que los lideres hacen:
- Encontrar tu voz y afirmar valores compartidos
- Dar el ejemplo y alinear acciones con valores
- Visualizar el futuro y reclutar a otros
- Buscar oportunidades y experimentar
- Fomentar colaboracion y fortalecer a otros
- Reconocer contribuciones y celebrar victorias

APLICACION PROFESIONAL:

- Desarrollo de equipos: Crear ambientes donde las personas quieran dar lo mejor de si
- Gestion del cambio: Liderar transformaciones con vision clara y participacion activa
- Cultura organizacional: Construir culturas de alto rendimiento basadas en valores compartidos
- Carrera personal: Desarrollar credibilidad como la moneda del liderazgo

EJERCICIO PRACTICO:

Reflexiona sobre tu mejor experiencia de liderazgo personal. Que practicas utilizaste? Como puedes aplicarlas mas consistentemente?',
  author = 'James Kouzes y Barry Posner',
  category = 'Liderazgo',
  difficulty_level = 'Intermedio',
  language = 'Espanol',
  estimated_read_time = 55
WHERE title ILIKE '%Liderazgo Transformacional%' OR title ILIKE '%Leadership Challenge%';

-- 4. Inteligencia Emocional - Daniel Goleman
UPDATE knowledge_base SET
  content = 'INTELIGENCIA EMOCIONAL de Daniel Goleman

CONCEPTO CENTRAL: La inteligencia emocional (IE) importa mas que el coeficiente intelectual para el exito en la vida y el trabajo. Es la capacidad de reconocer, entender y gestionar nuestras emociones y las de otros.

LOS CINCO COMPONENTES DE LA INTELIGENCIA EMOCIONAL:

1. AUTOCONCIENCIA:
La capacidad de reconocer y entender tus propios estados emocionales, impulsos y su efecto en otros. Incluye:
- Conciencia emocional: Reconocer tus emociones y sus efectos
- Autoevaluacion precisa: Conocer tus fortalezas y limitaciones
- Autoconfianza: Certeza sobre tu valor y capacidades

2. AUTORREGULACION:
La capacidad de controlar o redirigir impulsos y estados de animo disruptivos. Incluye:
- Autocontrol: Manejar emociones e impulsos perturbadores
- Confiabilidad: Mantener estandares de honestidad e integridad
- Adaptabilidad: Flexibilidad para manejar el cambio
- Innovacion: Comodidad con nuevas ideas y enfoques

3. MOTIVACION:
Una pasion por el trabajo que va mas alla del dinero o estatus. Incluye:
- Impulso de logro: Esfuerzo por mejorar o cumplir estandares de excelencia
- Compromiso: Alineacion con metas del grupo u organizacion
- Iniciativa: Disposicion para actuar sobre oportunidades
- Optimismo: Persistencia en perseguir metas a pesar de obstaculos

4. EMPATIA:
La capacidad de entender la composicion emocional de otras personas. Incluye:
- Comprender a otros: Percibir sentimientos y perspectivas ajenas
- Desarrollar a otros: Percibir necesidades de desarrollo y fomentar habilidades
- Orientacion de servicio: Anticipar y satisfacer necesidades de clientes
- Aprovechar diversidad: Cultivar oportunidades a traves de diferentes personas
- Conciencia politica: Leer corrientes emocionales y relaciones de poder

5. HABILIDADES SOCIALES:
Competencia en manejar relaciones y construir redes. Incluye:
- Influencia: Usar tacticas efectivas de persuasion
- Comunicacion: Enviar mensajes claros y convincentes
- Manejo de conflictos: Negociar y resolver desacuerdos
- Liderazgo: Inspirar y guiar grupos
- Catalizador del cambio: Iniciar o manejar el cambio
- Construccion de vinculos: Nutrir relaciones instrumentales
- Colaboracion: Trabajar con otros hacia metas compartidas
- Capacidades de equipo: Crear sinergia grupal

APLICACION PROFESIONAL:

- Liderazgo: Los lideres mas efectivos tienen alta IE, especialmente autoconciencia y empatia
- Ventas: La empatia y habilidades sociales son predictores clave del exito en ventas
- Trabajo en equipo: La IE colectiva del equipo predice su rendimiento
- Manejo del estres: La autorregulacion permite mantener efectividad bajo presion

LA BUENA NOTICIA:

A diferencia del IQ, la inteligencia emocional puede desarrollarse significativamente a cualquier edad con practica deliberada y retroalimentacion.',
  author = 'Daniel Goleman',
  category = 'Desarrollo Personal',
  difficulty_level = 'Intermedio',
  language = 'Espanol',
  estimated_read_time = 60
WHERE title ILIKE '%Inteligencia Emocional%' AND author ILIKE '%Goleman%';

-- 5. Comunicacion Efectiva para Lideres
UPDATE knowledge_base SET
  content = 'COMUNICACION EFECTIVA PARA LIDERES

CONCEPTO CENTRAL: La comunicacion efectiva es la habilidad mas importante del liderazgo. No se trata solo de transmitir informacion, sino de crear conexion, inspirar accion y construir confianza.

LOS CUATRO PILARES DE LA COMUNICACION DE LIDERAZGO:

1. CLARIDAD:
Los mejores comunicadores eliminan la ambiguedad y van directo al punto:
- Usa el principio de la piramide: Conclusion primero, luego los detalles de soporte
- Elimina jerga innecesaria y palabras de relleno
- Estructura mensajes en grupos de tres (la regla del tres)
- Prueba tu mensaje: Si no puedes explicarlo simplemente, no lo entiendes suficientemente bien

2. CONEXION EMOCIONAL:
La logica convence, pero la emocion mueve a la accion:
- Cuenta historias que ilustren tus puntos clave
- Usa metaforas y analogias para hacer tangible lo abstracto
- Muestra vulnerabilidad apropiada para construir confianza
- Reconoce las emociones de tu audiencia antes de pedir accion

3. ESCUCHA ACTIVA:
La comunicacion efectiva es 50% escuchar:
- Practica escucha de nivel 3: Escuchar no solo palabras, sino emociones e intenciones
- Haz preguntas poderosas que inviten reflexion profunda
- Parafrasea para confirmar entendimiento
- Resiste la urgencia de interrumpir o preparar tu respuesta mientras el otro habla

4. ADAPTABILIDAD:
Diferentes situaciones y audiencias requieren diferentes enfoques:
- Adapta tu estilo al preferido por tu audiencia (DISC, Myers-Briggs)
- Ajusta el nivel de detalle segun el contexto
- Elige el canal apropiado: algunas conversaciones requieren cara a cara
- Lee las senales no verbales y ajusta en tiempo real

COMUNICACION EN SITUACIONES DIFICILES:

Conversaciones dificiles:
- Separa la persona del problema
- Enfocate en intereses, no posiciones
- Genera opciones de beneficio mutuo
- Usa criterios objetivos para evaluar soluciones

Dar retroalimentacion:
- Especifica y basada en comportamientos observables
- Oportuna y en privado para temas sensibles
- Balanceada entre reconocimiento y areas de mejora
- Orientada al desarrollo, no al castigo

Presentaciones ejecutivas:
- Conoce tu audiencia y sus prioridades
- Lidera con el punto principal y la recomendacion
- Anticipa preguntas y objeciones
- Practica hasta que parezca natural

APLICACION PROFESIONAL:

- Reuniones: Comienza con el objetivo, termina con proximos pasos claros
- Correos: Una idea principal, accion requerida clara, brevedad
- Negociaciones: Escucha primero, entiende intereses, busca ganancias mutuas
- Crisis: Comunica rapido, con hechos, con empatia y con plan de accion

EJERCICIO PRACTICO:

Graba tu proxima presentacion o llamada importante. Revisala identificando: claridad del mensaje, conexion emocional, calidad de escucha y adaptabilidad a la audiencia.',
  author = 'Sheryl Willey',
  category = 'Comunicacion',
  difficulty_level = 'Intermedio',
  language = 'Espanol',
  estimated_read_time = 45
WHERE title ILIKE '%Comunicacion Efectiva%Lideres%';

-- 6. Desarrollo de Inteligencia Emocional
UPDATE knowledge_base SET
  content = 'DESARROLLO DE INTELIGENCIA EMOCIONAL

CONCEPTO CENTRAL: La inteligencia emocional no es un rasgo fijo - es un conjunto de habilidades que pueden desarrollarse sistematicamente con practica deliberada y retroalimentacion consistente.

EL MODELO DE DESARROLLO DE IE:

A diferencia del IQ que permanece relativamente estable, la IE puede mejorar significativamente a cualquier edad. El desarrollo requiere:

1. CONCIENCIA: Reconocer donde estas actualmente
2. CONOCIMIENTO: Entender que necesitas cambiar
3. PRACTICA: Aplicar nuevos comportamientos repetidamente
4. RETROALIMENTACION: Obtener informacion sobre tu progreso

DESARROLLANDO AUTOCONCIENCIA:

La autoconciencia es la piedra angular de toda la IE. Estrategias para desarrollarla:

- Journaling emocional: Registra diariamente tus emociones, sus disparadores y tus respuestas
- Mindfulness: Practica atencion plena para observar emociones sin reaccionar automaticamente
- Retroalimentacion 360: Pide a colegas, jefes y reportes directos que evaluen tu impacto emocional
- Identificacion de patrones: Busca situaciones recurrentes que disparan reacciones emocionales

DESARROLLANDO AUTORREGULACION:

La capacidad de manejar impulsos y emociones perturbadoras:

- Pausa estrategica: Cuenta hasta 10 antes de responder en situaciones emocionales
- Reencuadre cognitivo: Cambia la interpretacion de eventos para cambiar la respuesta emocional
- Tecnicas de relajacion: Respiracion profunda, relajacion muscular progresiva
- Preparacion mental: Anticipa situaciones dificiles y planifica respuestas constructivas

DESARROLLANDO MOTIVACION:

Cultivar pasion intrinseca y persistencia:

- Clarifica tu proposito: Conecta tareas diarias con metas significativas mayores
- Establece metas de maestria: Enfocate en aprendizaje y mejora, no solo resultados
- Celebra progreso: Reconoce pequenas victorias para mantener momentum
- Cultiva optimismo: Practica explicaciones optimistas para contratiempos

DESARROLLANDO EMPATIA:

La capacidad de percibir y responder a emociones de otros:

- Escucha activa: Enfocate completamente en el otro sin preparar tu respuesta
- Perspectiva ajena: Practica imaginar situaciones desde el punto de vista del otro
- Lectura no verbal: Estudia lenguaje corporal, tono de voz y microexpresiones
- Curiosidad genuina: Haz preguntas abiertas sobre experiencias y sentimientos de otros

DESARROLLANDO HABILIDADES SOCIALES:

Competencia en construir y mantener relaciones:

- Networking estrategico: Cultiva relaciones antes de necesitarlas
- Manejo de conflictos: Practica conversaciones dificiles con coaching
- Influencia: Aprende a persuadir apelando a valores e intereses del otro
- Colaboracion: Desarrolla habilidades de facilitacion y construccion de consenso

APLICACION PROFESIONAL:

- Plan de desarrollo: Elige 1-2 competencias para enfocar durante 3-6 meses
- Practica diaria: Identifica oportunidades cotidianas para practicar
- Accountability: Encuentra un coach o companero de desarrollo
- Medicion: Evalua progreso trimestralmente con retroalimentacion estructurada

EJERCICIO PRACTICO:

Completa una evaluacion de IE (como el EQ-i 2.0) para identificar tus fortalezas y areas de desarrollo. Selecciona una competencia prioritaria y crea un plan de 90 dias con practicas especificas.',
  author = 'Daniel Goleman',
  category = 'Desarrollo Personal',
  difficulty_level = 'Intermedio',
  language = 'Espanol',
  estimated_read_time = 50
WHERE title ILIKE '%Desarrollo%Inteligencia Emocional%';

-- Verification query
SELECT title, author, LENGTH(content) as content_length, 
       CASE WHEN LENGTH(content) >= 1000 THEN 'COMPLETO' ELSE 'INCOMPLETO' END as status
FROM knowledge_base 
WHERE title ILIKE '%Start with Why%'
   OR title ILIKE '%Power of Habit%'
   OR title ILIKE '%Liderazgo Transformacional%'
   OR (title ILIKE '%Inteligencia Emocional%' AND author ILIKE '%Goleman%')
   OR title ILIKE '%Comunicacion Efectiva%Lideres%'
   OR title ILIKE '%Desarrollo%Inteligencia Emocional%'
ORDER BY title;
