-- Removed invalid LIMIT clauses from UPDATE statements
-- Update the 6 key starter books with complete metadata
-- These books appear in "Comienza Tu Viaje Profesional" section

UPDATE knowledge_base 
SET 
  content = 'DISEÑA TU CARRERA ÚNICA

Bill Burnett y Dave Evans te enseñan a diseñar tu vida profesional como si fuera un proyecto creativo:

CONCEPTOS CLAVE:
• Vida como proyecto: Tu carrera es un diseño en evolución constante
• Múltiples versiones: Crea varias versiones potenciales de tu futuro profesional
• Prototipos: Experimenta antes de comprometerse completamente
• Pivoting: Cambia de dirección cuando sea necesario

PROCESO:
1. Descubre tu "why" (propósito profundo)
2. Crea 3 visiones diferentes para tu futuro
3. Prototipa cada una con pequeños experimentos
4. Evalúa y aprende de cada experiencia

BENEFICIOS COMPROBADOS:
- Mayor claridad en decisiones de carrera (92% de lectores)
- Reducción de ansiedad sobre el futuro profesional
- Habilidad de adaptación y flexibilidad mental
- Mayor satisfacción laboral a largo plazo

IDEAL PARA: Personas buscando cambio de carrera, emprendedores, o cualquiera que quiera ser intencional sobre su desarrollo profesional.',
  author = 'Bill Burnett & Dave Evans',
  category = 'Desarrollo Profesional',
  language = 'español',
  tags = ARRAY['carrera', 'propósito', 'diseño-de-vida', 'objetivos', 'autoconocimiento'],
  difficulty_level = 'intermedio',
  estimated_read_time = 240
WHERE LOWER(title) LIKE '%designing your life%' OR LOWER(title) LIKE '%diseña tu vida%';

UPDATE knowledge_base 
SET 
  content = 'LA CIENCIA DEL ÉXITO Y LA RESILIENCIA

Angela Duckworth demuestra que el talento no lo es todo - la persistencia es lo que realmente importa:

CONCEPTO CENTRAL: GRIT
Grit = Pasión + Persistencia
- La capacidad de trabajar duro hacia objetivos a largo plazo
- Mantener el esfuerzo a pesar de los obstáculos
- Perseverancia ante la adversidad

INVESTIGACIÓN CIENTÍFICA:
- Estudios con militares, atletas, emprendedores
- El grit predice éxito mejor que IQ o talento
- Es desarrollable, no innato

PILARES PARA DESARROLLAR GRIT:
1. Interés genuino en tu campo
2. Práctica deliberada y consistente
3. Propósito que trasciende a ti mismo
4. Esperanza y resiliencia ante fracasos

APLICACIÓN PRÁCTICA:
- Establece metas ambiciosas pero alcanzables
- Crea rutinas de mejora continua
- Encuentra tu "por qué" más profundo
- Rodéate de gente con grit

IDEAL PARA: Emprendedores, atletas, estudiantes, cualquiera que enfrenta retos significativos.',
  author = 'Angela Duckworth',
  category = 'Psicología del Éxito',
  language = 'español',
  tags = ARRAY['resiliencia', 'éxito', 'hábitos', 'motivación', 'autoconocimiento'],
  difficulty_level = 'básico',
  estimated_read_time = 240
WHERE LOWER(title) LIKE '%grit%';

UPDATE knowledge_base 
SET 
  content = 'CAMBIO DE MENTALIDAD PARA EL ÉXITO

Carol Dweck presenta la investigación revolucionaria sobre dos tipos de mentalidad:

MENTALIDAD FIJA vs MENTALIDAD DE CRECIMIENTO

MENTALIDAD FIJA:
- Crees que tus habilidades son fijas e inmutables
- Evitas retos para no fracasar
- Ves el esfuerzo como señal de debilidad
- Te desmoralizas fácilmente ante obstáculos

MENTALIDAD DE CRECIMIENTO:
- Crees que las habilidades se pueden desarrollar
- Abraza retos como oportunidades de aprendizaje
- Ves el esfuerzo como el camino al dominio
- Aprendes de la crítica constructiva

INVESTIGACIÓN COMPROBADA:
- Estudiantes con mentalidad de crecimiento mejoran más
- Los emprendedores con mentalidad de crecimiento logran más éxito
- Influye en relaciones, paternidad, liderazgo

CÓMO CAMBIAR TU MENTALIDAD:
1. Reconoce tu mentalidad actual en diferentes áreas
2. Acepta los retos como oportunidades
3. Cultiva el "aún no" en lugar del "no puedo"
4. Celebra el proceso, no solo el resultado

IMPACTO EN LA CARRERA:
- Mayor adaptabilidad a cambios
- Mejor desempeño bajo presión
- Liderazgo más efectivo
- Innovación y creatividad mejorada

IDEAL PARA: Profesionales en cualquier etapa, padres, educadores, líderes.',
  author = 'Carol S. Dweck',
  category = 'Psicología del Éxito',
  language = 'español',
  tags = ARRAY['mentalidad', 'crecimiento', 'autoconocimiento', 'psicología', 'transformación'],
  difficulty_level = 'básico',
  estimated_read_time = 280
WHERE LOWER(title) LIKE '%mindset%';

UPDATE knowledge_base 
SET 
  content = 'EL ARTE DE LOS HÁBITOS ATÓMICOS

James Clear enseña cómo pequeños cambios en tus hábitos generan resultados extraordinarios:

LA PARADOJA DE LOS HÁBITOS ATÓMICOS:
- 1% de mejora cada día = 37x mejor en un año
- Los hábitos son la causa de éxito, no el resultado
- No es sobre cambio drástico, sino mejora consistente

SISTEMA DE 4 LEYES PARA CONSTRUIR HÁBITOS:
1. Hacerlo obvio: Diseña tu ambiente para activar el hábito
2. Hacerlo atractivo: Vincula con algo que ya disfrutas
3. Hacerlo fácil: Reduce fricción, empieza pequeño
4. Hacerlo satisfactorio: Crea recompensa inmediata

CICLO DEL HÁBITO:
Señal → Antojo → Respuesta → Recompensa

ELIMINAR MALOS HÁBITOS:
- Hacer la señal invisible
- Hacer el antojo indeseable
- Hacer la respuesta difícil
- Hacer la recompensa insatisfactoria

CONSTRUCCIÓN DE IDENTIDAD:
- No se trata de objetivos, se trata de quién quieres ser
- Cada pequeña acción es un voto por esa identidad
- Los hábitos refuerzan la identidad que quieres desarrollar

APLICACIÓN PROFESIONAL:
- Desarrolla hábitos de aprendizaje
- Construye rutinas de productividad
- Crea sistemas, no metas
- El progreso llega de la consistencia

IDEAL PARA: Profesionales buscando mejorar productividad, emprendedores, cualquiera buscando cambio duradero.',
  author = 'James Clear',
  category = 'Hábitos y Productividad',
  language = 'español',
  tags = ARRAY['hábitos', 'productividad', 'objetivos', 'disciplina', 'transformación'],
  difficulty_level = 'básico',
  estimated_read_time = 320
WHERE LOWER(title) LIKE '%atomic habits%' OR LOWER(title) LIKE '%hábitos%';

UPDATE knowledge_base 
SET 
  content = 'EXCELENCIA EN LIDERAZGO Y ÉXITO

Robert Greene y Joost Elffers presentan 48 leyes de poder que revelan cómo funciona realmente el poder:

LAS 48 LEYES DEL PODER - SELECCIÓN CRÍTICA:

LEYES FUNDAMENTALES DE LIDERAZGO:
• Ley 1: Nunca oscurezcas al líder
• Ley 5: Dirígete siempre a la audiencia correcta
• Ley 15: Destruye a tus enemigos completamente
• Ley 29: Planifica tu salida

LECCIONES CLAVE PARA PROFESIONALES:
1. Entiende las dinámicas de poder en tu organización
2. Crea alianzas estratégicas genuinas
3. Aprende a protegerte políticamente
4. Desarrolla influencia sin ser percibido como amenaza

APLICACIÓN EN CARRERA:
- Gestión política estratégica
- Construcción de redes de influencia
- Navegación de dinámicas de poder
- Protección de tu reputación

LIDERAZGO EFECTIVO:
- Conoce quién tiene poder real
- Construye coaliciones
- Comunica claramente tu valor
- Mantén tu independencia

ADVERTENCIA IMPORTANTE:
- Las leyes describen realidad, no morales
- Usar sabiamente para protegerse, no para manipular
- Balance entre poder y ética

IDEAL PARA: Ejecutivos, emprendedores, profesionales en ambiente político, líderes emergentes.',
  author = 'Robert Greene & Joost Elffers',
  category = 'Liderazgo',
  language = 'español',
  tags = ARRAY['liderazgo', 'poder', 'influencia', 'estrategia', 'habilidades-blandas'],
  difficulty_level = 'avanzado',
  estimated_read_time = 360
WHERE LOWER(title) LIKE '%48 laws%' OR LOWER(title) LIKE '%leyes del poder%';

UPDATE knowledge_base 
SET 
  content = 'LA CIENCIA DE LA COMUNICACIÓN EFECTIVA

Marshall Rosenberg presenta la Comunicación No Violenta (CNV), un método científicamente probado para resolver conflictos y mejorar relaciones:

FUNDAMENTOS DE CNV:
La comunicación tradicional es a menudo:
- Crítica y culpabilización
- Generadora de defensividad
- Destructiva para relaciones

LA ALTERNATIVA: Comunicación Compasiva
Expresa tus necesidades sin herir, escucha genuinamente

PROCESO DE 4 PASOS:
1. Observación: Descripción objetiva (sin juicio)
2. Sentimiento: Expresa tu emoción honestamente
3. Necesidad: Identifica tu necesidad subyacente
4. Petición: Haz una solicitud clara y posible

APLICACIÓN EN TRABAJO:
- Conflictos con colegas se resuelven mejor
- Liderazgo más empático y efectivo
- Reducción de rotación de personal
- Mejor colaboración en equipos

BENEFICIOS COMPROBADOS:
- Mejora significativa en relaciones laborales
- Reducción de conflictos y estrés
- Mayor creatividad en equipo
- Liderazgo más humanizado

HABILIDADES DESARROLLADAS:
- Empatía genuina
- Escucha activa
- Expresión clara de necesidades
- Resolución de conflictos

IDEAL PARA: Líderes, gerentes de RR.HH., emprendedores, cualquiera que trabaje en equipo.',
  author = 'Marshall B. Rosenberg',
  category = 'Habilidades Blandas',
  language = 'español',
  tags = ARRAY['habilidades-blandas', 'comunicación', 'liderazgo', 'relaciones', 'empatía'],
  difficulty_level = 'intermedio',
  estimated_read_time = 280
WHERE LOWER(title) LIKE '%nonviolent communication%' OR LOWER(title) LIKE '%comunicación no violenta%';
