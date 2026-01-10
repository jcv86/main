-- Fixed ARRAY syntax: changed single quotes to properly escaped quotes for PostgreSQL
-- Changed from: tags = ARRAY['autoconocimiento', ...]
-- Changed to: tags = ARRAY[''autoconocimiento'', ...]

-- Enrich 6 Starter Books with EXTENSIVE detailed content
-- These books are shown to all new users in "Comienza Tu Viaje Profesional"

-- 1. Update Designing Your Life by Bill Burnett & Dave Evans
UPDATE knowledge_base 
SET 
  content = E'# Designing Your Life: Cómo Construir una Vida Bien Diseñada\n\nAutores: Bill Burnett & Dave Evans\n\n## Introducción\nDesigning Your Life te proporciona un enfoque único para diseñar tu carrera y vida personal con el mismo rigor que un ingeniero diseña un producto.\n\n## Conceptos Clave\n\n### Las Cuatro Medidas de Calidad\n- **Salud (Health)**: Tu bienestar físico y mental\n- **Riqueza (Wealth)**: Tu seguridad financiera\n- **Amor (Love)**: Tus relaciones significativas\n- **Juego (Play)**: Tu diversión y creatividad\n\n## Herramientas Prácticas\n\n**La Brújula Profesional**: Identifica tus valores, intereses y competencias.\n\n**El Mapa de Caminos**: Crea 3 versiones posibles de tu vida a 5 años:\n- Plan A: Tu trayectoria actual mejorada\n- Plan B: Una carrera alternativa completamente diferente\n- Plan C: Qué harías si la economía no fuera factor\n\n**Conversaciones Generativas**: Técnicas para conversar con profesionales sin presión.\n\n## Aplicación Profesional\n\nPara Emprendedores: Diseña tu startup como un producto iterativo.\nPara Profesionales en Transición: Usa el prototipado para explorar nuevas carreras.\nPara Líderes: Diseña tu equipo y cultura con intencionalidad.\n\n## Ejercicios Clave\n\n1. Mapea tu Dashcrafting: Tus 3 planes de vida alternativos\n2. Identifica tus valores: Qué realmente importa\n3. Crea prototipos: Prueba ideas antes de comprometerte\n4. Itera: Aprende y refina continuamente',
  tags = ARRAY[''autoconocimiento'', ''propósito'', ''diseño'', ''carrera'', ''desarrollo-personal''],
  estimated_read_time = 60,
  difficulty_level = ''intermedio'',
  language = ''es''
WHERE title = ''Designing Your Life'' OR title = ''Start with Why'';

-- 2. Update Grit: The Power of Passion and Perseverance
UPDATE knowledge_base 
SET 
  content = E'# Grit: El Poder de la Pasión y la Perseverancia\n\nAutora: Angela Duckworth\n\n## ¿Qué es Grit?\n\nGrit = Pasión + Perseverancia sobre el tiempo\n\nNo es solo trabajar duro, sino mantener la dirección durante años, incluso con fracasos.\n\n## Los 4 Pilares del Grit\n\n### 1. Pasión (Direction)\nQué es lo que realmente te importa.\n- Exploración: Prueba diferentes carreras\n- Descubrimiento: Encuentra tu verdadera pasión\n- Compromiso: Dedícate profundamente\n\n### 2. Práctica Deliberada (Practice)\nNo es repetir, sino practicar estratégicamente:\n- Identifica áreas de mejora\n- Busca retroalimentación continua\n- Ajusta tu técnica\n- Repite hasta dominar\n\n### 3. Propósito (Purpose)\nEntender el PORQUÉ:\n- Cómo contribuyes a otros\n- El impacto más allá de recompensa personal\n- Conexión con algo mayor\n\n### 4. Esperanza (Hope)\nLa creencia en mejora:\n- Mentalidad de crecimiento\n- Resiliencia ante fracasos\n- Adaptabilidad\n\n## Investigación Científica\n\nDuckworth estudió: soldados West Point, Spelling Bee, vendedores, emprendedores.\n\nHallazgo: Grit predice éxito mejor que IQ, talento natural o educación.\n\n## Aplicación Profesional\n\nIdentifica tu pasión, desarrolla práctica deliberada, comprende tu propósito, mantén esperanza.\n\n## 5 Estrategias para Desarrollar Grit\n\n1. Define tu pasión claramente\n2. Practica deliberadamente cada día\n3. Conecta con tu propósito\n4. Cultiva mentalidad de crecimiento\n5. Rodéate de gente con Grit',
  tags = ARRAY[''perseverancia'', ''pasión'', ''objetivos'', ''excelencia'', ''resiliencia''],
  estimated_read_time = 50,
  difficulty_level = ''intermedio'',
  language = ''es''
WHERE title = ''Grit'';

-- 3. Update Mindset: The New Psychology of Success
UPDATE knowledge_base 
SET 
  content = E'# Mindset: La Nueva Psicología del Éxito\n\nAutora: Carol S. Dweck\n\n## Los Dos Tipos de Mentalidad\n\n### Mentalidad Fija\n\"Mis habilidades son fijas y no puedo cambiarlos\"\n\nCaracterísticas:\n- Evitar desafíos\n- Rendirse ante obstáculos\n- Ignorar retroalimentación\n- Sentir amenaza por éxito de otros\n\n### Mentalidad de Crecimiento\n\"Puedo desarrollar mis habilidades a través del esfuerzo\"\n\nCaracterísticas:\n- Abrirse a desafíos\n- Perseverar\n- Valorar retroalimentación\n- Inspirarse en éxito de otros\n\n## La Ciencia del Cerebro\n\n**Plasticidad Neuronal**: Tu cerebro puede crear nuevas conexiones a cualquier edad.\n\n**Mielinización**: La práctica construye mielina alrededor de circuitos neurales, mejorando velocidad y precisión.\n\n## Aplicación en Diferentes Áreas\n\n### Educación\n- Estudiantes con Growth Mindset obtienen mejores calificaciones\n- Valoran aprendizaje sobre calificación\n- Ven errores como parte del aprendizaje\n\n### Negocios\n- Empresas con crecimiento: líderes con Growth Mindset\n- Fomentan innovación\n- Crean cultura de aprendizaje\n\n## Transición de Mentalidades\n\nNo es binario. Puedes tener Growth Mindset en algunas áreas y Fijo en otras.\n\nProceso:\n1. Reconoce tu mentalidad actual\n2. Desafíate conscientemente\n3. Celebra el esfuerzo, no solo resultados\n4. Practica deliberadamente',
  tags = ARRAY[''mentalidad'', ''aprendizaje'', ''autoconocimiento'', ''crecimiento'', ''psicología''],
  estimated_read_time = 55,
  difficulty_level = ''intermedio'',
  language = ''es''
WHERE title = ''Mindset'';

-- 4. Update Atomic Habits
UPDATE knowledge_base 
SET 
  content = E'# Hábitos Atómicos\n\nAutor: James Clear\n\n## El Poder del 1% de Mejora\n\n1.01^365 = 37.78 (Mejora 1% diariamente = 37x mejor en un año)\n0.99^365 = 0.03 (Declina 1% diariamente = 97% peor en un año)\n\nPequeños cambios consistentes = resultados transformacionales.\n\n## Los 4 Pasos del Sistema de Hábitos\n\n### 1. Señal (Cue)\nEl disparador que inicia el comportamiento:\n- Contexto ambiental\n- Hora del día\n- Emociones\n- Acciones previas\n\n### 2. Anhelo (Craving)\nLa motivación para cambiar:\n- No deseamos el hábito en sí\n- Deseamos el resultado\n- Ej: No correr, sino estar en forma\n\n### 3. Respuesta (Response)\nEl hábito en sí:\n- Física, emocional o mental\n- Debe ser fácil\n\n### 4. Recompensa (Reward)\nEl beneficio:\n- Satisface el anhelo\n- Enseña si vale la pena repetir\n\n## 5 Estrategias para Cambiar Hábitos\n\n1. **Incrementa fricción de malos hábitos**: Apaga notificaciones\n2. **Disminuye fricción de buenos**: Prepara el ambiente\n3. **Apilamiento de hábitos**: Conecta a habitual existente\n4. **Ambiente**: Diseña contexto para facilitar buenos hábitos\n5. **Identidad**: Cultiva identidad del tipo de persona que eres\n\n## Ejemplos de Apilamiento\n\n- Después de desayunar, medito 5 min\n- Después de terminar reunión, anoto aprendizajes\n- Después de llegar a casa, leo 30 min',
  tags = ARRAY[''hábitos'', ''productividad'', ''disciplina'', ''mejora-continua'', ''éxito''],
  estimated_read_time = 65,
  difficulty_level = ''intermedio'',
  language = ''es''
WHERE title = ''Atomic Habits'';

-- 5. Update The 48 Laws of Power
UPDATE knowledge_base 
SET 
  content = E'# Las 48 Leyes del Poder\n\nAutor: Robert Greene\n\n## Las 8 Leyes Clave\n\n### 1. Nunca Oscurezcas al Jefe\nAsegúrate que tu jefe se vea bien.\n\n### 2. Nunca Confíes Demasiado en Amigos\nLos enemigos son más honestos.\n\n### 3. Oculta tus Intenciones\nCuando revelas intenciones, la gente pone obstáculos.\n\n### 4. Siempre Di Menos de lo Necesario\nPalabras innecesarias revelan inseguridad.\n\n### 5. Depende de la Reputación\nTu reputación es tu capital social más importante.\n\n### 6. Haz que Dependan de Ti\nEl poder viene de ser necesario.\n\n### 7. Aprende a Trabajar el Sistema\nComprende cómo funciona, trabájalo a tu favor.\n\n### 8. Usa Información Selectivamente\nLa información es poder.\n\n## Dinámicas de Poder en Organizaciones\n\nCada organización es una corte política con:\n- Jugadores del poder\n- Víctimas\n- Observadores\n\nAlternativas:\n- Construye alianzas estratégicas\n- Evita enemigos innecesarios\n- Comprende jerarquías\n\n## Aplicación ÉTICA\n\nNo significa ser manipulador. Significa ENTENDER dinámicas de poder para:\n- Protegerte\n- Avanzar tu carrera\n- Liderar éticamente\n- Resistir manipulación',
  tags = ARRAY[''poder'', ''liderazgo'', ''estrategia'', ''influencia'', ''política-corporativa''],
  estimated_read_time = 70,
  difficulty_level = ''avanzado'',
  language = ''es''
WHERE title = ''The 48 Laws of Power'' OR title = ''48 Laws of Power'';

-- 6. Update Nonviolent Communication
UPDATE knowledge_base 
SET 
  content = E'# Comunicación No Violenta\n\nAutor: Marshall B. Rosenberg\n\n## Los 4 Componentes de CNV\n\n### 1. Observación (Sin Juicio)\nObserva los hechos SIN interpretación:\n- DI: \"No cumpliste el deadline\"\n- NO: \"Eres irresponsable\"\n- DI: \"Hablaste durante toda la reunión\"\n- NO: \"Eres narcisista\"\n\n### 2. Sentimiento (Honesto)\nExpresa cómo te sientes genuinamente:\n- \"Me siento frustrado\"\n- \"Me siento decepcionado\"\n- \"Me siento ansioso\"\n\n### 3. Necesidad (Lo que Realmente Importa)\nIdentifica la necesidad subyacente:\n- Necesidad de respeto\n- Necesidad de confianza\n- Necesidad de autonomía\n- Necesidad de predictibilidad\n- Necesidad de crecimiento\n\nMayor parte de conflictos = necesidades no satisfechas.\n\n### 4. Pedido (Claro y Específico)\nHaz un pedido específico:\n- \"¿Podrías enviar el reporte para mañana 3pm?\"\n- \"Me gustaría que escucharas sin interrumpir\"\n- \"Necesito que confirmes el cambio de timeline\"\n\nEl pedido debe ser: claro, alcanzable, específico, mutuamente beneficioso.\n\n## La Fórmula CNV Completa\n\n\"Cuando [OBSERVACIÓN], me siento [SENTIMIENTO], porque necesito [NECESIDAD]. ¿Podrías [PEDIDO]?\"\n\nEjemplo:\n\"Cuando no me miras durante la conversación, me siento ignorado, porque necesito sentir que soy importante. ¿Podrías establecer contacto visual?\"\n\n## Escucha Empática\n\nNo solo hablar, sino escuchar:\n- Refleja lo que escuchas\n- Identifica sentimientos\n- Reconoce necesidades\n- Valida la experiencia\n\n## Aplicación Profesional\n\n- Resuelve conflictos en equipos\n- Mejora comunicación con jefe\n- Fortalece relaciones profesionales\n- Crea psicología de seguridad',
  tags = ARRAY[''comunicación'', ''empatía'', ''resolución-de-conflictos'', ''relaciones'', ''liderazgo''],
  estimated_read_time = 55,
  difficulty_level = ''intermedio'',
  language = ''es''
WHERE title = ''Nonviolent Communication'' OR title = ''Comunicación Efectiva para Líderes'';
