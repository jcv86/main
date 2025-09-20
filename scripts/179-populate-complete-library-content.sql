-- Poblar la biblioteca con contenido completo y profesional
-- Populate the library with complete and professional content

-- 1. Limpiar datos existentes
DELETE FROM user_reading_progress WHERE user_email = 'demo@example.com';
DELETE FROM user_bookmarks WHERE user_email = 'demo@example.com';
DELETE FROM book_reviews WHERE user_email = 'demo@example.com';
DELETE FROM reading_sessions WHERE user_email = 'demo@example.com';
DELETE FROM reading_goals WHERE user_email = 'demo@example.com';
DELETE FROM knowledge_base;

-- 2. Insertar libros completos con contenido profesional
INSERT INTO knowledge_base (title, category, content, author, tags, slug) VALUES 

-- LIBRO 1: Fundamentos del Liderazgo Efectivo
('Fundamentos del Liderazgo Efectivo', 'Liderazgo', 
'# Fundamentos del Liderazgo Efectivo

## Introducción al Liderazgo Moderno

El liderazgo efectivo en el siglo XXI requiere una combinación única de habilidades técnicas, inteligencia emocional y visión estratégica. Este libro te guiará a través de los principios fundamentales que distinguen a los líderes excepcionales de los gerentes ordinarios.

## Capítulo 1: Definiendo el Liderazgo Auténtico

### ¿Qué es el Liderazgo Auténtico?

El liderazgo auténtico se basa en cuatro pilares fundamentales:

1. **Autoconciencia**: Conocer tus fortalezas, debilidades, valores y motivaciones
2. **Transparencia relacional**: Construir relaciones basadas en la confianza y honestidad
3. **Procesamiento equilibrado**: Analizar información objetivamente antes de tomar decisiones
4. **Perspectiva moral**: Actuar de acuerdo con principios éticos claros

### Los 5 Niveles de Liderazgo (John Maxwell)

**Nivel 1: Posición**
- Liderazgo basado en el título o cargo
- Las personas te siguen porque tienen que hacerlo
- Enfoque en derechos más que responsabilidades
- Limitaciones: Baja moral, alta rotación, bajo rendimiento

**Nivel 2: Permiso**
- Liderazgo basado en relaciones
- Las personas te siguen porque quieren hacerlo
- Enfoque en construir confianza y rapport
- Beneficios: Mejor ambiente de trabajo, mayor colaboración

**Nivel 3: Producción**
- Liderazgo basado en resultados
- Las personas te siguen por lo que has hecho por la organización
- Enfoque en logros y momentum
- Beneficios: Credibilidad, respeto, momentum positivo

**Nivel 4: Desarrollo de Personas**
- Liderazgo basado en reproducción
- Las personas te siguen por lo que has hecho por ellas
- Enfoque en desarrollar otros líderes
- Beneficios: Crecimiento organizacional, sucesión sólida

**Nivel 5: Pináculo**
- Liderazgo basado en respeto
- Las personas te siguen por quién eres y lo que representas
- Enfoque en legado y trascendencia
- Beneficios: Impacto duradero, influencia generacional

## Capítulo 2: Desarrollando Inteligencia Emocional

### Los Cuatro Dominios de la Inteligencia Emocional

**1. Autoconciencia Emocional**
- Reconocer tus emociones en tiempo real
- Entender cómo tus emociones afectan tu desempeño
- Identificar patrones emocionales
- Desarrollar vocabulario emocional preciso

**Ejercicio Práctico: El Diario Emocional**
Durante una semana, registra cada 2 horas:
- Tu estado emocional actual (1-10)
- Situación o trigger que lo causó
- Impacto en tu comportamiento
- Respuesta alternativa que podrías haber tenido

**2. Autorregulación**
- Gestionar emociones disruptivas
- Mantener la compostura bajo presión
- Adaptarse al cambio con flexibilidad
- Controlar impulsos destructivos

**Técnicas de Autorregulación:**
- Respiración 4-7-8: Inhala 4, mantén 7, exhala 8
- Pausa de 6 segundos antes de reaccionar
- Reencuadre cognitivo: "¿Qué más podría significar esto?"
- Visualización de respuesta ideal

**3. Conciencia Social**
- Leer las emociones de otros
- Entender dinámicas organizacionales
- Mostrar empatía genuina
- Interpretar señales no verbales

**4. Gestión de Relaciones**
- Influir positivamente en otros
- Resolver conflictos constructivamente
- Inspirar y motivar equipos
- Comunicar con impacto

## Capítulo 3: Comunicación de Alto Impacto

### Principios de Comunicación Efectiva

**1. Claridad de Mensaje**
- Define el objetivo específico de tu comunicación
- Estructura tu mensaje con inicio, desarrollo y cierre
- Usa ejemplos concretos y relevantes
- Evita jerga técnica innecesaria

**2. Adaptación a la Audiencia**
- Conoce el estilo de comunicación preferido
- Ajusta tu lenguaje al nivel de expertise
- Considera el contexto cultural y generacional
- Identifica motivadores clave de tu audiencia

**3. Escucha Activa**
- Presta atención completa al hablante
- Haz preguntas clarificadoras
- Parafrasea para confirmar comprensión
- Observa lenguaje corporal y tono

### Herramientas de Comunicación

**La Técnica STAR para Feedback**
- **S**ituación: Describe el contexto específico
- **T**area: Explica lo que se esperaba
- **A**cción: Detalla lo que realmente ocurrió
- **R**esultado: Comparte el impacto y próximos pasos

**El Modelo GROW para Coaching**
- **G**oal: ¿Qué quieres lograr?
- **R**eality: ¿Cuál es la situación actual?
- **O**ptions: ¿Qué alternativas tienes?
- **W**ay forward: ¿Cuál es tu plan de acción?

## Capítulo 4: Toma de Decisiones Estratégicas

### Marco de Decisiones de Alto Impacto

**Paso 1: Definición del Problema**
- Identifica el problema real vs. síntomas
- Establece criterios de éxito claros
- Determina stakeholders clave
- Define timeline y recursos disponibles

**Paso 2: Generación de Alternativas**
- Usa técnicas de brainstorming estructurado
- Considera opciones no convencionales
- Evalúa pros y contras objetivamente
- Busca input de perspectivas diversas

**Paso 3: Análisis de Riesgo**
- Identifica riesgos potenciales
- Evalúa probabilidad e impacto
- Desarrolla planes de contingencia
- Considera costos de oportunidad

**Paso 4: Implementación y Seguimiento**
- Comunica la decisión claramente
- Establece métricas de seguimiento
- Ajusta según resultados
- Documenta lecciones aprendidas

### Herramientas de Análisis

**Matriz de Decisión Ponderada**
1. Lista criterios importantes (costo, tiempo, calidad, riesgo)
2. Asigna pesos a cada criterio (total = 100%)
3. Califica cada opción (1-5) en cada criterio
4. Calcula puntuación total ponderada
5. Selecciona opción con mayor puntuación

**Análisis de Escenarios**
- **Mejor caso**: Todo sale según lo planeado
- **Caso más probable**: Expectativa realista
- **Peor caso**: Múltiples problemas ocurren
- Desarrolla plan para cada escenario

## Capítulo 5: Construcción de Equipos de Alto Rendimiento

### Características de Equipos Excepcionales

**1. Propósito Compartido**
- Visión clara y compelling del futuro
- Objetivos específicos y medibles
- Conexión con valores organizacionales
- Entendimiento del "por qué" detrás del trabajo

**2. Confianza Psicológica**
- Ambiente seguro para tomar riesgos
- Apertura para admitir errores
- Respeto por diversidad de opiniones
- Comunicación honesta y directa

**3. Responsabilidad Mutua**
- Compromisos claros y públicos
- Feedback regular y constructivo
- Consecuencias por incumplimiento
- Celebración de logros colectivos

**4. Complementariedad de Habilidades**
- Diversidad de expertise técnico
- Variedad de estilos de trabajo
- Balance de personalidades
- Roles claros y definidos

### Proceso de Desarrollo de Equipos

**Fase 1: Formación (Forming)**
Actividades clave:
- Establecer normas de trabajo
- Clarificar roles y responsabilidades
- Construir relaciones interpersonales
- Alinear en objetivos y métodos

**Fase 2: Conflicto (Storming)**
Estrategias de manejo:
- Facilitar discusiones constructivas
- Mediar diferencias de opinión
- Establecer procesos de resolución
- Mantener enfoque en objetivos

**Fase 3: Normalización (Norming)**
Enfoque en:
- Refinar procesos de trabajo
- Celebrar primeros éxitos
- Fortalecer cohesión grupal
- Establecer ritmos productivos

**Fase 4: Rendimiento (Performing)**
Optimización:
- Maximizar productividad
- Fomentar innovación continua
- Mantener motivación alta
- Escalar impacto y resultados

## Capítulo 6: Gestión del Cambio y Transformación

### Modelo de Cambio de 8 Pasos (Kotter)

**1. Crear Urgencia**
- Identifica amenazas y oportunidades
- Examina realidades del mercado
- Discute crisis potenciales
- Genera conversaciones honestas

**2. Formar Coalición Guía**
- Reúne líderes influyentes
- Asegura compromiso del top management
- Diversifica habilidades y perspectivas
- Construye momentum inicial

**3. Desarrollar Visión y Estrategia**
- Crea visión clara del futuro
- Desarrolla estrategias para lograrla
- Asegura que sea memorable y motivadora
- Conecta con valores organizacionales

**4. Comunicar la Visión**
- Usa múltiples canales de comunicación
- Modela comportamientos esperados
- Aborda preocupaciones y resistencias
- Repite mensaje consistentemente

**5. Empoderar Acción Amplia**
- Remueve obstáculos estructurales
- Cambia sistemas que socavan la visión
- Fomenta toma de riesgos e ideas no convencionales
- Proporciona recursos necesarios

**6. Generar Victorias a Corto Plazo**
- Planifica mejoras visibles
- Crea esas mejoras
- Reconoce y recompensa contribuciones
- Comunica éxitos ampliamente

**7. Consolidar Ganancias y Producir Más Cambio**
- Usa credibilidad de victorias tempranas
- Aborda sistemas, estructuras y políticas
- Contrata, promueve y desarrolla empleados alineados
- Mantiene momentum

**8. Anclar Nuevos Enfoques en la Cultura**
- Articula conexiones entre comportamientos y éxito
- Desarrolla medios para asegurar desarrollo de liderazgo
- Refuerza cambios a través de sistemas de recompensa
- Institucionaliza nuevas prácticas

### Gestión de Resistencia al Cambio

**Tipos de Resistencia:**

**Resistencia Racional**
- Basada en análisis lógico
- Preocupaciones sobre viabilidad
- Cuestiones de costo-beneficio
- Estrategia: Educación y comunicación

**Resistencia Emocional**
- Miedo al cambio
- Ansiedad por lo desconocido
- Pérdida de control
- Estrategia: Facilitación y apoyo

**Resistencia Política**
- Pérdida de poder o estatus
- Conflictos de interés
- Agendas ocultas
- Estrategia: Participación e involucramiento

## Capítulo 7: Desarrollo de Sucesores y Mentoría

### Identificación de Talento de Alto Potencial

**Criterios de Evaluación:**

**1. Capacidad de Aprendizaje**
- Velocidad de adquisición de nuevas habilidades
- Adaptabilidad a situaciones nuevas
- Curiosidad intelectual
- Capacidad de aplicar aprendizajes

**2. Liderazgo Natural**
- Influencia sin autoridad formal
- Capacidad de inspirar a otros
- Iniciativa para liderar proyectos
- Construcción de coaliciones

**3. Resultados Consistentes**
- Historial de logro de objetivos
- Calidad de ejecución
- Impacto en el negocio
- Superación de expectativas

**4. Inteligencia Emocional**
- Autoconciencia y autorregulación
- Empatía y habilidades sociales
- Manejo de relaciones complejas
- Adaptación a diferentes contextos

### Programa de Desarrollo de Liderazgo

**Modelo 70-20-10:**

**70% - Experiencias Desafiantes**
- Asignaciones stretch que expanden capacidades
- Roles laterales en áreas nuevas
- Proyectos de alto impacto y visibilidad
- Liderazgo de transformaciones

**20% - Aprendizaje Social**
- Mentoría y coaching estructurado
- Networking estratégico
- Comunidades de práctica
- Feedback 360 grados

**10% - Educación Formal**
- Programas de liderazgo ejecutivo
- Certificaciones relevantes
- Conferencias y seminarios
- Lectura dirigida

### Mentoría Efectiva

**Roles del Mentor:**
- Consejero y guía
- Conector de oportunidades
- Desafiador constructivo
- Modelo a seguir

**Estructura de Sesiones de Mentoría:**
- Frecuencia: Reuniones mensuales de 90 minutos
- Agenda: 30% revisión de progreso, 40% desarrollo de habilidades, 30% planificación futura
- Seguimiento: Objetivos específicos entre sesiones
- Evaluación: Revisión trimestral de avances

## Conclusión: El Viaje Continuo del Liderazgo

El liderazgo efectivo no es un destino, sino un viaje continuo de crecimiento personal y profesional. Los principios y herramientas presentados en este libro proporcionan una base sólida, pero su aplicación exitosa requiere práctica constante, reflexión honesta y adaptación continua.

### Compromisos de Acción

**1. Desarrollo Personal Continuo**
- Dedica 30 minutos semanales a la autorreflexión
- Busca feedback regular de tu equipo y pares
- Invierte en tu educación y crecimiento profesional
- Mantén un diario de liderazgo

**2. Construcción de Relaciones**
- Prioriza la construcción de confianza en todas las interacciones
- Practica la escucha activa diariamente
- Celebra los éxitos de tu equipo públicamente
- Invierte tiempo en conocer a las personas como individuos

**3. Impacto Organizacional**
- Alinea tus acciones con la visión organizacional
- Desarrolla a otros líderes activamente
- Toma decisiones pensando en el largo plazo
- Deja un legado positivo en cada rol

### Plan de Desarrollo Personal

**Próximos 30 días:**
- Completa autoevaluación de liderazgo
- Solicita feedback de 5 personas clave
- Identifica 3 áreas de desarrollo prioritarias
- Establece métricas de progreso

**Próximos 90 días:**
- Implementa técnicas de inteligencia emocional
- Practica nuevas habilidades de comunicación
- Inicia proceso de mentoría con alguien
- Lidera un proyecto de cambio pequeño

**Próximos 12 meses:**
- Desarrolla y ejecuta plan de desarrollo completo
- Construye equipo de alto rendimiento
- Establece programa de desarrollo de sucesores
- Mide impacto de tu liderazgo

El liderazgo efectivo transforma no solo organizaciones, sino vidas. Tu compromiso con la excelencia en el liderazgo tiene el poder de crear un impacto positivo duradero en todos los que te rodean.', 
'Dr. María Elena Rodríguez', 
ARRAY['liderazgo', 'management', 'desarrollo profesional', 'equipos', 'comunicación'], 
'fundamentos-liderazgo-efectivo'),

-- LIBRO 2: Gestión de Energía Personal
('Gestión de Energía Personal y Productividad Sostenible', 'Productividad', 
'# Gestión de Energía Personal y Productividad Sostenible

## Introducción: Más Allá de la Gestión del Tiempo

En un mundo donde la información fluye constantemente y las demandas profesionales parecen infinitas, la gestión tradicional del tiempo ha demostrado ser insuficiente. Este libro introduce un paradigma revolucionario: la gestión de energía personal como la clave para una productividad sostenible y una vida profesional plena.

La diferencia entre profesionales que prosperan y aquellos que simplemente sobreviven no radica en cuántas horas trabajan, sino en cómo gestionan su energía física, mental, emocional y espiritual.

## Capítulo 1: Los Cuatro Tipos de Energía

### Energía Física: La Base de Todo

La energía física es el fundamento sobre el cual se construye toda productividad sostenible. Sin una base física sólida, nuestras capacidades mentales, emocionales y espirituales se ven comprometidas.

**Componentes de la Energía Física:**

**1. Nutrición Estratégica**
- Desayuno rico en proteínas (25-30g) para estabilizar glucosa
- Comidas pequeñas cada 3-4 horas para mantener energía constante
- Hidratación de 35ml por kg de peso corporal diariamente
- Evitar picos de azúcar que causan crashes energéticos

**Ejemplo de Día Nutricional Óptimo:**
- 7:00 AM: Desayuno con huevos, aguacate y avena
- 10:00 AM: Snack de nueces y fruta
- 12:30 PM: Almuerzo balanceado con proteína, vegetales y carbohidratos complejos
- 3:30 PM: Yogur griego con semillas
- 7:00 PM: Cena ligera con pescado y vegetales

**2. Ejercicio Inteligente**
- 30 minutos de actividad cardiovascular 4-5 veces por semana
- Entrenamiento de fuerza 2-3 veces por semana
- Caminatas cortas cada 90 minutos durante el día laboral
- Ejercicios de estiramiento para contrarrestar postura sedentaria

**Rutina de Ejercicio Mínimo Efectivo (20 min/día):**
- Lunes/Miércoles/Viernes: Fuerza (sentadillas, flexiones, plancha)
- Martes/Jueves: Cardio intervalado (30 seg intenso, 90 seg recuperación)
- Sábado: Actividad recreativa (caminata, deportes, yoga)
- Domingo: Recuperación activa (estiramientos suaves)

**3. Recuperación Activa**
- 7-9 horas de sueño de calidad
- Rutina de relajación 30 minutos antes de dormir
- Siestas estratégicas de 10-20 minutos (no más de 30)
- Técnicas de respiración profunda cada 2 horas

### Energía Mental: Optimizando el Rendimiento Cognitivo

La energía mental se refiere a nuestra capacidad de concentración, toma de decisiones y procesamiento de información compleja.

**Principios de Gestión Mental:**

**1. Atención Profunda vs. Atención Superficial**
- Bloques de trabajo profundo de 90-120 minutos
- Eliminación de distracciones digitales durante estos bloques
- Técnica Pomodoro para tareas que requieren concentración
- Espacios físicos optimizados para el enfoque

**2. Gestión de la Carga Cognitiva**
- Externalización de memoria (sistemas de notas digitales)
- Automatización de decisiones rutinarias
- Batching de tareas similares
- Delegación estratégica de decisiones menores

**Técnica del Batching:**
- Lunes: Todas las reuniones de planificación
- Martes: Trabajo creativo y estratégico
- Miércoles: Comunicaciones (emails, llamadas)
- Jueves: Análisis y reportes
- Viernes: Revisión y preparación de próxima semana

**3. Renovación Mental**
- Meditación mindfulness (10-20 minutos diarios)
- Cambios de contexto mental regulares
- Actividades que requieren creatividad
- Tiempo en la naturaleza para restauración cognitiva

### Energía Emocional: El Combustible de la Motivación

La energía emocional determina nuestra capacidad de mantener motivación, manejar estrés y construir relaciones positivas.

**Dimensiones de la Energía Emocional:**

**1. Autoconciencia Emocional**
- Registro diario de estados emocionales (escala 1-10)
- Identificación de triggers emocionales específicos
- Reconocimiento de patrones emocionales semanales/mensuales
- Conexión entre emociones y productividad

**Ejercicio: Diario Emocional**
Cada 3 horas registra:
- Estado emocional actual (1-10)
- Situación o evento desencadenante
- Impacto en tu energía y productividad
- Acción tomada para gestionar la emoción

**2. Regulación Emocional**
- Técnicas de reencuadre cognitivo
- Respiración controlada para manejo de estrés
- Ejercicios de gratitud diarios (3 cosas específicas)
- Visualización positiva de objetivos

**Técnicas de Regulación Inmediata:**
- Respiración 4-7-8: Inhala 4, mantén 7, exhala 8
- Técnica STOP: Stop, Take a breath, Observe, Proceed
- Reencuadre: "¿Qué más podría significar esta situación?"
- Ancla positiva: Recordar un momento de éxito reciente

**3. Conexión Social**
- Inversión en relaciones de calidad
- Comunicación empática y asertiva
- Construcción de redes de apoyo profesional
- Contribución al bienestar de otros

### Energía Espiritual: Propósito y Significado

La energía espiritual proviene de la conexión con nuestros valores más profundos y el sentido de propósito en nuestro trabajo.

**Elementos de la Energía Espiritual:**

**1. Claridad de Propósito**
- Definición de misión personal clara
- Alineación entre valores y acciones diarias
- Conexión entre trabajo diario e impacto mayor
- Revisión regular de objetivos de vida

**Ejercicio de Definición de Propósito:**
Completa esta declaración:
"Mi propósito profesional es [IMPACTO] para [AUDIENCIA] a través de [MÉTODO] porque [RAZÓN PROFUNDA]."

**2. Integridad Personal**
- Coherencia entre creencias y comportamientos
- Toma de decisiones basada en principios
- Honestidad en comunicación y relaciones
- Responsabilidad por resultados y errores

**3. Contribución Significativa**
- Identificación del impacto positivo de tu trabajo
- Mentoría y desarrollo de otros
- Participación en causas importantes
- Construcción de legado profesional

## Capítulo 2: Ciclos de Energía y Ritmos Naturales

### Entendiendo Tus Ritmos Circadianos

Cada persona tiene patrones únicos de energía a lo largo del día. Identificar y trabajar con estos ritmos naturales puede incrementar la productividad hasta en un 40%.

**Tipos de Cronotipos:**

**1. Alondras Matutinas (25% de la población)**
- Máxima energía: 6:00 AM - 12:00 PM
- Trabajo óptimo: Tareas analíticas y decisiones importantes en la mañana
- Desafíos: Reuniones tardías, creatividad nocturna
- Estrategias: Proteger las mañanas, ejercicio temprano, cena ligera

**2. Búhos Nocturnos (25% de la población)**
- Máxima energía: 6:00 PM - 12:00 AM
- Trabajo óptimo: Creatividad y análisis profundo en la tarde/noche
- Desafíos: Reuniones matutinas, decisiones tempranas
- Estrategias: Rutina matutina gradual, trabajo importante en la tarde

**3. Terceros Pájaros (50% de la población)**
- Máxima energía: 10:00 AM - 2:00 PM
- Trabajo óptimo: Flexibilidad en horarios, dos picos de energía
- Ventaja: Adaptabilidad a diferentes horarios
- Estrategias: Aprovechar pico matutino y vespertino

**Protocolo de Identificación de Cronotipo:**

*Semana de Observación (sin alarmas si es posible):*
- Registra niveles de energía cada 2 horas (escala 1-10)
- Nota cuándo te sientes más alerta mentalmente
- Identifica momentos de mayor creatividad
- Observa patrones de sueño natural

*Optimización de Horario:*
- Programa trabajo más importante en picos de energía
- Reserva tareas rutinarias para valles energéticos
- Ajusta horarios de reuniones según tu cronotipo
- Negocia flexibilidad laboral cuando sea posible

### Ciclos Ultradianos: Ritmos de 90 Minutos

Nuestro cuerpo opera en ciclos de 90 minutos durante el día, alternando entre períodos de alta y baja energía.

**Aplicación de Ciclos Ultradianos:**

*Estructura de Trabajo Óptima:*
- 90 minutos de trabajo enfocado (sin interrupciones)
- 20 minutos de descanso activo
- Repetir 3-4 ciclos por día
- Ajustar según demandas específicas del trabajo

*Señales de Fin de Ciclo:*
- Dificultad para concentrarse
- Aumento de errores menores
- Necesidad de estirarse o moverse
- Pensamientos divagantes
- Bostezos o somnolencia ligera

*Actividades para Descansos de 20 minutos:*
- Caminata corta al aire libre
- Ejercicios de estiramiento
- Meditación o respiración profunda
- Hidratación consciente
- Conversación social ligera

### Gestión de Energía Semanal y Mensual

**Planificación Semanal Energética:**

*Lunes: Arranque Gradual*
- Tareas de planificación y organización
- Reuniones de coordinación y sincronización
- Revisión de objetivos semanales
- Evitar decisiones complejas o creativas

*Martes-Jueves: Máximo Rendimiento*
- Proyectos más desafiantes e importantes
- Decisiones estratégicas importantes
- Presentaciones clave y reuniones críticas
- Trabajo creativo e innovación

*Viernes: Cierre y Reflexión*
- Completar tareas pendientes de la semana
- Revisión de logros y aprendizajes semanales
- Planificación de la siguiente semana
- Actividades de networking y relaciones

**Ciclos Mensuales de Productividad:**

*Semana 1: Planificación e Inicio*
- Establecimiento de objetivos mensuales
- Inicio de proyectos nuevos y desafiantes
- Energía alta para nuevos desafíos
- Reuniones de planificación estratégica

*Semana 2-3: Ejecución Intensiva*
- Máximo enfoque en entregables importantes
- Trabajo profundo y sostenido
- Minimizar distracciones y reuniones no esenciales
- Aprovechar momentum de inicio de mes

*Semana 4: Evaluación y Ajuste*
- Revisión de progreso contra objetivos
- Ajustes de estrategia según resultados
- Preparación para el siguiente ciclo mensual
- Celebración de logros y aprendizajes

## Capítulo 3: Técnicas Avanzadas de Renovación

### Micro-Recuperaciones: Renovación en Tiempo Real

Las micro-recuperaciones son técnicas breves (1-5 minutos) que pueden restaurar energía durante el día laboral sin interrumpir significativamente el flujo de trabajo.

**Técnicas de Micro-Recuperación:**

**1. Respiración Energizante (2 minutos)**
- Respiración 4-7-8: Inhala por 4, mantén por 7, exhala por 8
- Repetir 4 ciclos completos
- Enfocarse completamente en la respiración
- Ideal antes de reuniones importantes o tareas desafiantes

**2. Estiramiento Energizante (3 minutos)**
- Rotación de cuello y hombros (30 segundos cada dirección)
- Estiramiento de brazos por encima de la cabeza (30 segundos)
- Torsión de columna sentado (30 segundos cada lado)
- Flexión hacia adelante para estirar espalda baja (30 segundos)

**3. Visualización Rápida (2 minutos)**
- Cierra los ojos e imagina un lugar que te tranquilice
- Visualiza completar exitosamente tu próxima tarea importante
- Recuerda vívidamente un logro reciente y la sensación asociada
- Conecta con tu propósito y motivación más profunda

**4. Hidratación Consciente (1 minuto)**
- Bebe 250ml de agua lentamente
- Presta atención completa a la sensación del agua
- Toma 5 respiraciones profundas mientras bebes
- Combina con movimiento ligero (caminar al dispensador)

### Macro-Recuperaciones: Renovación Profunda

Las macro-recuperaciones son períodos más largos dedicados a la restauración completa de energía en una o más dimensiones.

**Recuperación Diaria (45-60 minutos):**

*Rutina de Descompresión Post-Trabajo:*
1. **Transición Física (10 minutos)**
   - Cambio de ropa para marcar fin del día laboral
   - Cambio de ubicación física (salir de la oficina/espacio de trabajo)
   - Ritual de cierre (apagar computadora, organizar escritorio)

2. **Actividad Física (20 minutos)**
   - Caminata al aire libre sin dispositivos
   - Yoga o estiramientos suaves
   - Ejercicio cardiovascular ligero
   - Actividades domésticas activas

3. **Actividad Creativa (15 minutos)**
   - Lectura recreativa (no relacionada con trabajo)
   - Música, arte, o escritura personal
   - Cocinar de manera mindful
   - Jardinería o actividades manuales

4. **Conexión Social o Soledad (15 minutos)**
   - Conversación de calidad con familia/amigos
   - Tiempo en soledad reflexiva según preferencia
   - Actividades que nutren relaciones importantes
   - Meditación o práctica espiritual personal

**Recuperación Semanal (Medio día completo):**

*Sábado de Renovación Integral:*
- **Desconexión Digital**: 4-6 horas sin dispositivos laborales
- **Actividad Física Intensa**: Ejercicio que disfrutes por 60-90 minutos
- **Tiempo en Naturaleza**: Mínimo 2 horas al aire libre
- **Actividades Nutritivas**: Hobbies, pasiones, o intereses personales
- **Planificación Relajada**: 30 minutos de planificación suave para la semana

**Recuperación Mensual (1-2 días completos):**

*Retiro Personal Mensual:*
- **Cambio Completo de Ambiente**: Salir de tu entorno habitual
- **Reflexión Profunda**: Evaluación de progreso hacia objetivos importantes
- **Actividades Restaurativas**: Lo que más te recarga personalmente
- **Planificación Estratégica**: Revisión y ajuste de objetivos a largo plazo
- **Renovación de Motivación**: Reconexión con propósito y valores

### Técnicas de Recuperación Específicas por Tipo de Energía

**Para Agotamiento Físico:**
- **Sueño Reparador**: 8-9 horas por 2-3 noches consecutivas
- **Nutrición Densa**: Comidas ricas en nutrientes, hidratación extra
- **Masaje o Terapia Física**: Liberación de tensión muscular acumulada
- **Baños Relajantes**: Agua caliente con sales de Epsom
- **Ejercicio Suave**: Yoga restaurativo, caminatas lentas

**Para Fatiga Mental:**
- **Meditación Profunda**: 20-30 minutos de mindfulness
- **Actividades No-Cognitivas**: Tareas que no requieren decisiones
- **Lectura Recreativa**: Ficción o temas completamente diferentes al trabajo
- **Puzzles Ligeros**: Actividades mentales relajantes (sudoku, crucigramas)
- **Silencio Total**: Períodos sin estímulos auditivos

**Para Desgaste Emocional:**
- **Conexión Humana**: Tiempo de calidad con seres queridos
- **Actividades Alegres**: Lo que naturalmente te hace sonreír
- **Expresión Creativa**: Arte, música, escritura como outlet emocional
- **Terapia o Coaching**: Apoyo profesional para procesamiento
- **Actos de Servicio**: Ayudar a otros para ganar perspectiva

**Para Vacío Espiritual:**
- **Reflexión de Propósito**: Tiempo dedicado a reconectar con tu "por qué"
- **Conexión con Naturaleza**: Tiempo contemplativo al aire libre
- **Prácticas Espirituales**: Según tus creencias y tradiciones
- **Lectura Inspiracional**: Biografías, filosofía, textos espirituales
- **Contribución Significativa**: Voluntariado o proyectos de impacto social

## Capítulo 4: Diseño de Ambientes Energizantes

### Optimización del Espacio Físico

El ambiente físico tiene un impacto directo y medible en nuestros niveles de energía, concentración y bienestar general.

**Elementos Clave del Espacio Energizante:**

**1. Iluminación Natural y Artificial**
- **Luz Natural**: Maximizar exposición durante horas de trabajo
- **Luz Artificial**: Lámparas de espectro completo (5000K-6500K) durante el día
- **Luz Cálida**: Transición a luz cálida (2700K-3000K) 2 horas antes de dormir
- **Control de Intensidad**: Dimmer switches para ajustar según actividad

**Protocolo de Iluminación Diaria:**
- 6:00-9:00 AM: Luz brillante para activación
- 9:00 AM-5:00 PM: Luz natural + artificial según necesidad
- 5:00-8:00 PM: Reducir intensidad gradualmente
- 8:00 PM en adelante: Solo luz cálida y tenue

**2. Calidad del Aire y Ambiente**
- **Ventilación**: Cambio de aire cada 2-3 horas
- **Plantas Purificadoras**: Pothos, sansevieria, peace lily
- **Humedad Óptima**: 40-60% para confort y salud
- **Temperatura**: 20-22°C para máxima productividad cognitiva

**3. Organización y Limpieza**
- **Principio de Superficies Despejadas**: Solo elementos esenciales visibles
- **Sistema de Organización**: Lugar específico para cada objeto
- **Limpieza Diaria**: 10 minutos de organización al final del día
- **Elementos Inspiradores**: Fotos, plantas, objetos que generen emociones positivas

**4. Ergonomía y Comodidad**
- **Silla Ergonómica**: Soporte lumbar, altura ajustable, reposabrazos
- **Monitor a Altura de Ojos**: Evitar tensión en cuello
- **Teclado y Mouse**: Posición neutral de muñecas
- **Opción de Trabajo de Pie**: Escritorio ajustable o standing desk

### Diseño de Zonas Específicas

**Zona de Trabajo Profundo:**
- **Ubicación**: Área más silenciosa disponible
- **Iluminación**: Luz enfocada y brillante
- **Distracciones**: Mínimas distracciones visuales
- **Herramientas**: Todo lo necesario al alcance de la mano
- **Señalización**: Indicadores visuales de "no molestar"

**Zona de Creatividad:**
- **Colores**: Tonos que estimulen creatividad (azules, verdes, algunos acentos vibrantes)
- **Flexibilidad**: Muebles móviles para reconfigurar según necesidad
- **Materiales**: Pizarras, papel, materiales para brainstorming
- **Inspiración**: Arte, libros, objetos que estimulen ideas

**Zona de Descanso:**
- **Colores**: Tonos relajantes (azules suaves, verdes, neutros cálidos)
- **Asientos**: Cómodos y diferentes a los de trabajo
- **Separación**: Visual y física del área de trabajo
- **Elementos Naturales**: Plantas, materiales naturales, vista al exterior si es posible

### Gestión del Ambiente Digital

**Optimización de Dispositivos:**

**1. Configuración de Pantallas**
- **Brillo**: Ajustado automáticamente según luz ambiente
- **Filtros de Luz Azul**: Activados 2 horas antes de dormir
- **Tamaño de Fuente**: Cómodo para evitar fatiga visual
- **Múltiples Monitores**: Para reducir cambio constante entre ventanas

**2. Organización Digital**
- **Escritorio Limpio**: Máximo 5 iconos visibles
- **Sistema de Archivos**: Estructura lógica y consistente
- **Aplicaciones**: Organizadas por función y frecuencia de uso
- **Limpieza Regular**: Eliminación semanal de archivos innecesarios

**3. Gestión de Notificaciones**
- **Notificaciones Esenciales**: Solo las críticas para tu trabajo
- **Horarios de Email**: Revisar solo 2-3 veces por día
- **Modo "No Molestar"**: Durante bloques de trabajo profundo
- **Apps de Bloqueo**: Freedom, Cold Turkey, o similares para distracciones

**Herramientas Digitales para Gestión de Energía:**

*Aplicaciones de Seguimiento:*
- **Sueño**: Sleep Cycle, Oura Ring, Fitbit
- **Actividad Física**: Apple Health, Google Fit, Strava
- **Meditación**: Headspace, Calm, Insight Timer
- **Estado de Ánimo**: Daylio, Mood Meter, eMoods

*Herramientas de Productividad:*
- **Bloqueo de Sitios**: Cold Turkey, Freedom, StayFocusd
- **Temporizadores**: Forest, Be Focused, Toggl
- **Ruido de Fondo**: Brain.fm, Noisli, mynoise.net
- **Planificación**: Notion, Todoist, Any.do

## Capítulo 5: Nutrición para el Rendimiento Sostenible

### Alimentación Estratégica para Energía Constante

La nutrición adecuada es fundamental para mantener niveles de energía estables, optimizar función cognitiva y sostener alto rendimiento a largo plazo.

**Principios de Nutrición Energética:**

**1. Estabilización de Glucosa en Sangre**
- **Proteína en Cada Comida**: 20-30g para estabilizar azúcar
- **Carbohidratos Complejos**: Avena, quinoa, batata, arroz integral
- **Grasas Saludables**: Aguacate, nueces, aceite de oliva, pescado graso
- **Fibra Abundante**: Vegetales, frutas, legumbres para digestión lenta

**2. Timing Nutricional Estratégico**
- **Desayuno Dentro de 1 Hora**: Después de despertar para activar metabolismo
- **Comidas Cada 3-4 Horas**: Para mantener energía constante
- **Cena 3 Horas Antes**: De dormir para mejor calidad de sueño
- **Hidratación Constante**: 250ml cada 2 horas durante el día

**3. Nutrientes para Optimización Cognitiva**
- **Omega-3**: EPA/DHA para función cerebral (pescado graso, nueces, chía)
- **Antioxidantes**: Berries, vegetales de colores, té verde
- **Vitaminas B**: Huevos, vegetales de hoja verde, legumbres
- **Magnesio**: Almendras, espinacas, chocolate oscuro

**Plan de Alimentación Diario Optimizado:**

*Desayuno Energizante (7:00 AM):*
- **Proteína**: 25-30g (huevos, yogur griego, proteína en polvo)
- **Grasas Saludables**: 15-20g (aguacate, nueces, semillas)
- **Carbohidratos Complejos**: 30-40g (avena, frutas con fibra)
- **Hidratación**: 500ml de agua + electrolitos si es necesario

*Ejemplo: Tazón de Poder Matutino*
- 2 huevos revueltos con espinacas
- 1/2 aguacate en rodajas
- 1/2 taza de avena con berries
- 1 cucharada de almendras picadas
- Té verde o café (máximo 200mg cafeína)

*Media Mañana (10:00 AM):*
- **Snack Balanceado**: Proteína + grasa saludable
- **Hidratación**: 250ml de agua
- **Opcional**: Té verde para antioxidantes

*Ejemplo: Snack Energético*
- 30g de nueces mixtas
- 1 manzana mediana
- 250ml de agua con limón

*Almuerzo Sostenible (12:30 PM):*
- **Proteína Magra**: 25-35g (pollo, pescado, tofu, legumbres)
- **Vegetales Variados**: 2-3 tazas de colores diversos
- **Carbohidratos Complejos**: 1/2-1 taza (quinoa, arroz integral)
- **Grasas Saludables**: 1-2 cucharadas (aceite de oliva, semillas)

*Ejemplo: Bowl Mediterráneo*
- 120g de salmón a la plancha
- 2 tazas de ensalada mixta con pepino, tomate, pimiento
- 1/2 taza de quinoa
- 2 cucharadas de aceite de oliva extra virgen
- 1/4 taza de garbanzos

*Media Tarde (3:30 PM):*
- **Snack Proteico**: Para evitar crash de energía
- **Hidratación**: 250ml de agua
- **Evitar**: Azúcares refinados y cafeína excesiva

*Ejemplo: Snack Estabilizador*
- 150g de yogur griego natural
- 1 cucharada de semillas de chía
- Handful de berries
- 250ml de agua con pepino

*Cena Reparadora (7:00 PM):*
- **Proteína Digestible**: 20-25g (pescado, pollo, huevos)
- **Vegetales Cocidos**: Más fáciles de digerir en la noche
- **Carbohidratos Limitados**: Para mejor sueño
- **Grasas Omega-3**: Para recuperación nocturna

*Ejemplo: Cena Reparadora*
- 100g de pescado blanco al vapor
- 1.5 tazas de vegetales salteados (brócoli, zanahorias, calabacín)
- 1/4 taza de arroz integral
- Ensalada pequeña con aceite de oliva

### Suplementación Estratégica

**Suplementos Básicos para Energía y Rendimiento:**

**1. Vitamina D3**
- **Dosis**: 2000-4000 UI diarias (ajustar según análisis de sangre)
- **Beneficios**: Estado de ánimo, energía, función inmune, salud ósea
- **Timing**: Con comida que contenga grasas para mejor absorción
- **Consideraciones**: Especialmente importante en climas con poco sol

**2. Magnesio**
- **Dosis**: 300-400mg antes de dormir
- **Forma**: Glicinato de magnesio para mejor absorción y menos efectos digestivos
- **Beneficios**: Relajación muscular, calidad de sueño, función nerviosa
- **Señales de Deficiencia**: Calambres, insomnio, fatiga, irritabilidad

**3. Omega-3 (EPA/DHA)**
- **Dosis**: 1-2g de EPA/DHA combinados diarios
- **Fuente**: Aceite de pescado de calidad farmacéutica
- **Beneficios**: Función cerebral, reducción de inflamación, salud cardiovascular
- **Timing**: Con comidas para reducir eructos de pescado

**4. Complejo B de Alta Calidad**
- **Beneficios**: Metabolismo energético, función neurológica, manejo del estrés
- **Timing**: Por la mañana con desayuno
- **Forma**: Vitaminas B metiladas para mejor biodisponibilidad
- **Especial Atención**: B12 para vegetarianos/veganos

**Suplementos Avanzados (Consultar con Profesional):**

**Para Energía Celular:**
- **Coenzima Q10**: 100-200mg diarios para producción de ATP
- **PQQ**: 10-20mg para salud mitocondrial
- **Creatina**: 3-5g diarios para energía muscular y cerebral

**Para Adaptación al Estrés:**
- **Rhodiola Rosea**: 300-600mg en ayunas para resistencia al estrés
- **Ashwagandha**: 300-500mg para equilibrio hormonal y cortisol
- **Ginseng Siberiano**: 200-400mg para energía adaptogénica

### Timing Nutricional para Máximo Rendimiento

**Pre-Trabajo Mental Intensivo:**
- **30-60 minutos antes**: Snack con proteína y carbohidratos complejos
- **Hidratación**: 250-500ml de agua
- **Cafeína Estratégica**: 100-200mg si es tolerada (no después de 2 PM)
- **Evitar**: Comidas pesadas que causen somnolencia

**Durante Trabajo Prolongado (>4 horas):**
- **Hidratación Constante**: 100-150ml cada 30 minutos
- **Snacks Ligeros**: Cada 2-3 horas para mantener glucosa estable
- **Electrolitos**: Si hay sudoración o trabajo mental intenso prolongado
- **Evitar**: Azúcares simples que causen picos y crashes

**Post-Trabajo Intensivo:**
- **Proteína para Recuperación**: 20-30g dentro de 2 horas
- **Carbohidratos para Reposición**: Frutas, vegetales con almidón
- **Antioxidantes**: Para reducir estrés oxidativo del trabajo mental
- **Hidratación**: Reponer líquidos perdidos durante el día

**Optimización para Diferentes Tipos de Trabajo:**

*Trabajo Creativo:*
- Ayuno intermitente ligero puede aumentar creatividad
- Grasas saludables para función cerebral
- Antioxidantes para protección neuronal
- Hidratación constante para flujo de ideas

*Trabajo Analítico:*
- Desayuno rico en proteínas para concentración sostenida
- Carbohidratos complejos para energía cerebral constante
- Omega-3 para procesamiento de información
- Evitar fluctuaciones de azúcar en sangre

*Trabajo Social/Reuniones:*
- Comidas ligeras para mantener energía social
- Evitar alimentos que causen somnolencia
- Hidratación para claridad mental
- Snacks que no interfieran con horarios de reuniones

## Conclusión: Integrando la Gestión de Energía en tu Vida

La gestión efectiva de energía personal no es un destino, sino un proceso continuo de autoconocimiento, experimentación y refinamiento. Los principios y técnicas presentados en este libro proporcionan un marco sólido, pero su aplicación exitosa requiere personalización y práctica constante.

### Plan de Implementación de 90 Días

**Días 1-30: Establecimiento de Fundamentos**
- **Semana 1**: Evaluación inicial y establecimiento de rutinas básicas de sueño
- **Semana 2**: Implementación de ejercicio mínimo efectivo y nutrición básica
- **Semana 3**: Introducción de técnicas de micro-recuperación
- **Semana 4**: Optimización básica del ambiente de trabajo

**Días 31-60: Optimización y Refinamiento**
- **Semana 5-6**: Identificación de patrones de energía personal y ajuste de horarios
- **Semana 7**: Implementación de técnicas avanzadas de renovación
- **Semana 8**: Desarrollo de estrategias personalizadas de manejo de estrés

**Días 61-90: Integración y Sostenibilidad**
- **Semana 9-10**: Creación de sistemas sostenibles a largo plazo
- **Semana 11**: Desarrollo de resiliencia ante desafíos y setbacks
- **Semana 12**: Establecimiento de métricas de seguimiento y mejora continua

### Métricas de Éxito y Seguimiento

**Indicadores Cuantitativos:**
- **Sueño**: Horas de sueño de calidad por noche (objetivo: 7-9 horas)
- **Ejercicio**: Minutos de actividad física por semana (objetivo: 150 min moderada + 75 min intensa)
- **Recuperación**: Número de micro-recuperaciones diarias (objetivo: 6-8)
- **Trabajo Profundo**: Horas de concentración sostenida diaria (objetivo: 3-4 horas)
- **Energía**: Niveles promedio de energía por momento del día (escala 1-10)

**Indicadores Cualitativos:**
- **Control**: Sensación de control sobre tu energía y productividad
- **Concentración**: Capacidad de mantener atención en tareas importantes
- **Relaciones**: Calidad de interacciones interpersonales
- **Alineación**: Coherencia entre valores personales y acciones diarias
- **Satisfacción**: Nivel general de satisfacción con productividad y bienestar

**Herramientas de Seguimiento:**
- **Apps Digitales**: Para métricas objetivas (sueño, ejercicio, tiempo)
- **Diario Analógico**: Para reflexiones cualitativas y patrones
- **Revisión Semanal**: 30 minutos cada domingo para evaluar progreso
- **Evaluación Mensual**: Análisis más profundo y ajustes de estrategia

### Mensaje Final: Tu Energía, Tu Responsabilidad

La gestión de energía personal es una inversión en tu futuro profesional y personal más importante que cualquier otra habilidad técnica que puedas desarrollar. Cada pequeño ajuste que hagas hoy se compone para crear transformaciones significativas a largo plazo.

Recuerda estos principios fundamentales:

1. **La Consistencia Supera a la Perfección**: Pequeñas acciones diarias son más poderosas que esfuerzos esporádicos intensos.

2. **La Personalización es Clave**: Lo que funciona para otros puede no funcionar para ti. Experimenta y adapta.

3. **La Paciencia es Esencial**: Los cambios reales en energía y productividad toman tiempo. Dale al menos 90 días a cualquier nuevo sistema.

4. **La Integración es el Objetivo**: No se trata de añadir más cosas a tu vida, sino de integrar prácticas energizantes en tu rutina existente.

Tu energía es tu recurso más valioso. Gestionarla sabiamente no solo mejorará tu productividad, sino que enriquecerá cada aspecto de tu vida, permitiéndote contribuir de manera más significativa al mundo mientras mantienes tu bienestar y felicidad.

El viaje hacia una productividad sostenible y una vida energizada comienza con un solo paso. Ese paso es ahora.', 
'Dr. Carlos Mendoza', 
ARRAY['productividad', 'energía', 'bienestar', 'rendimiento', 'salud'], 
'gestion-energia-personal'),

-- LIBRO 3: Estrategias de Desarrollo de Carrera
('Estrategias Avanzadas de Desarrollo de Carrera Profesional', 'Desarrollo Profesional', 
'# Estrategias Avanzadas de Desarrollo de Carrera Profesional

## Introducción: Navegando el Futuro del Trabajo

El panorama profesional del siglo XXI se caracteriza por la velocidad del cambio, la obsolescencia acelerada de habilidades y la emergencia de nuevas formas de trabajo. En este contexto dinámico, el desarrollo de carrera ya no puede ser un proceso pasivo o reactivo.

Este libro te proporcionará las herramientas, marcos conceptuales y estrategias prácticas necesarias para no solo navegar exitosamente tu carrera, sino para diseñarla de manera que maximice tanto tu impacto profesional como tu satisfacción personal.

## Capítulo 1: Autoconocimiento Estratégico

### Auditoría Integral de Fortalezas y Capacidades

El primer paso hacia un desarrollo de carrera exitoso es desarrollar una comprensión profunda y objetiva de tus capacidades actuales, potencial de crecimiento y preferencias de trabajo.

**Marco de Evaluación de Fortalezas:**

**1. Competencias Técnicas (Hard Skills)**
- Habilidades específicas de tu industria
- Certificaciones y credenciales actuales
- Experiencia con herramientas y tecnologías
- Conocimiento especializado único

**2. Competencias Interpersonales (Soft Skills)**
- Comunicación verbal y escrita
- Liderazgo e influencia sin autoridad
- Trabajo en equipo y colaboración
- Resolución de problemas complejos

**3. Competencias Adaptativas (Future Skills)**
- Aprendizaje continuo y agilidad mental
- Inteligencia emocional y cultural
- Pensamiento sistémico y estratégico
- Innovación y creatividad aplicada

### Identificación de Valores y Motivadores Profesionales

**Categorías de Valores Profesionales:**

**1. Valores de Logro**
- Reconocimiento y estatus profesional
- Avance y promoción acelerada
- Influencia y poder de decisión
- Excelencia y maestría técnica

**2. Valores de Relación**
- Colaboración y trabajo en equipo
- Servicio a otros y impacto social
- Construcción de comunidad
- Mentoría y desarrollo de talento

**3. Valores de Autonomía**
- Independencia y flexibilidad
- Creatividad e innovación
- Toma de decisiones autónoma
- Emprendimiento y riesgo calculado

**4. Valores de Seguridad**
- Estabilidad económica y beneficios
- Equilibrio vida-trabajo sostenible
- Ambiente predecible y estructurado
- Crecimiento profesional gradual

### Definición de Propósito Profesional

**Elementos del Propósito Profesional:**

1. **Impacto Deseado**: ¿Qué cambio específico quieres crear en el mundo?
2. **Audiencia Objetivo**: ¿A quién quieres servir, influenciar o empoderar?
3. **Método Preferido**: ¿Cómo prefieres crear ese impacto? (liderazgo, innovación, enseñanza, etc.)
4. **Contexto Ideal**: ¿En qué tipo de organización, industria o ambiente?

**Ejercicio de Definición de Propósito:**

*Técnica de los "5 Por Qués":*
1. ¿Por qué haces el trabajo que haces actualmente?
2. ¿Por qué eso es importante para ti personalmente?
3. ¿Por qué eso te motiva a levantarte cada mañana?
4. ¿Por qué eso tiene significado profundo en tu vida?
5. ¿Por qué eso conecta con tu identidad más auténtica?

*Declaración de Propósito (Template):*
"Mi propósito profesional es [IMPACTO] para [AUDIENCIA] a través de [MÉTODO] en el contexto de [INDUSTRIA/ORGANIZACIÓN] porque [RAZÓN PROFUNDA]."

**Ejemplo Completo:**
"Mi propósito profesional es acelerar la transformación digital para empresas medianas a través del liderazgo estratégico y la implementación de tecnología en el sector manufacturero porque creo que la tecnología puede democratizar oportunidades y crear empleos de mayor valor que mejoren la calidad de vida de las comunidades."

## Capítulo 2: Inteligencia de Mercado y Tendencias Profesionales

### Análisis del Panorama Laboral Futuro

**Megatendencias que Impactan las Carreras:**

**1. Automatización e Inteligencia Artificial**
- **Trabajos en Riesgo**: Tareas rutinarias, predecibles y basadas en reglas
- **Nuevos Roles Emergentes**: Especialistas en IA, entrenadores de algoritmos, auditores de ética en IA
- **Habilidades Complementarias**: Creatividad, pensamiento crítico, inteligencia emocional
- **Oportunidades**: Colaboración humano-máquina, interpretación de datos de IA

**2. Transformación Digital Acelerada**
- **Digitalización Universal**: Todos los procesos tradicionales se digitalizan
- **Nuevos Modelos de Negocio**: Plataformas, ecosistemas digitales, economía de datos
- **Competencias Digitales Esenciales**: Alfabetización de datos, ciberseguridad, UX/UI
- **Cultura de Datos**: Toma de decisiones basada en analytics y métricas

**3. Trabajo Remoto e Híbrido Permanente**
- **Redefinición de Espacios**: Oficina como hub de colaboración, no lugar de trabajo diario
- **Habilidades Virtuales**: Facilitación online, comunicación asíncrona, gestión de equipos distribuidos
- **Gestión por Resultados**: Enfoque en outcomes vs. horas trabajadas
- **Equilibrio Global**: Acceso a talento mundial, competencia global

**4. Economía de la Experiencia y Personalización**
- **Enfoque en Customer Experience**: Diseño centrado en el usuario
- **Personalización Masiva**: Productos y servicios adaptados individualmente
- **Design Thinking**: Metodologías de innovación centradas en el humano
- **Storytelling Corporativo**: Marcas con propósito y narrativas auténticas

**5. Sostenibilidad y Responsabilidad Social**
- **Empleos Verdes**: Energías renovables, economía circular, tecnologías limpias
- **ESG Integration**: Environmental, Social, Governance en todas las decisiones
- **Propósito Corporativo**: Empresas con misión social clara
- **Impacto Medible**: Métricas de triple bottom line (profit, people, planet)

**Metodología de Investigación de Tendencias:**

*Fuentes Primarias de Información:*
- **Consultoras Globales**: McKinsey Global Institute, Deloitte Insights, PwC Research
- **Organizaciones Profesionales**: Asociaciones de tu industria, colegios profesionales
- **Academia**: MIT Technology Review, Harvard Business Review, Stanford Research
- **Gobierno**: Departamentos de trabajo, estadísticas nacionales, políticas públicas

*Fuentes Secundarias Valiosas:*
- **LinkedIn Economic Graph**: Datos de demanda de habilidades y movilidad laboral
- **Glassdoor Insights**: Tendencias salariales y satisfacción laboral
- **AngelList/Crunchbase**: Startups emergentes y áreas de inversión
- **GitHub/Stack Overflow**: Tendencias tecnológicas y habilidades en demanda

*Análisis de Señales Débiles:*
- **Startups Emergentes**: ¿Qué problemas están resolviendo las nuevas empresas?
- **Inversiones VC**: ¿Dónde está fluyendo el capital de riesgo?
- **Patentes y Publicaciones**: ¿Qué investigación se está comercializando?
- **Regulaciones en Desarrollo**: ¿Qué nuevas leyes crearán nuevas necesidades?

### Mapeo de Ecosistemas Profesionales

**Componentes del Ecosistema Profesional:**

**1. Industrias Adyacentes**
- **Sectores Convergentes**: Fintech, Healthtech, Edtech, Cleantech
- **Transferencia de Habilidades**: Dónde tus competencias son valiosas
- **Oportunidades de Arbitraje**: Aplicar conocimiento de una industria en otra
- **Sectores Híbridos**: Nuevas industrias en la intersección de dos tradicionales

**2. Cadena de Valor Extendida**
- **Upstream**: Proveedores, partners tecnológicos, consultores
- **Core**: Tu industria y competidores directos
- **Downstream**: Clientes, usuarios finales, canales de distribución
- **Ecosystem**: Reguladores, medios, influencers, comunidades

**3. Geografías Estratégicas**
- **Hubs de Innovación**: Silicon Valley, Tel Aviv, Singapur, Berlín
- **Mercados Emergentes**: India, Brasil, Nigeria, Vietnam
- **Centros de Talento**: Ciudades con concentración de expertise
- **Oportunidades Remotas**: Trabajos que no requieren ubicación específica

**4. Comunidades Profesionales Clave**
- **Asociaciones de Industria**: Networking y desarrollo profesional
- **Grupos de Práctica**: Comunidades de expertise específico
- **Comunidades Online**: LinkedIn Groups, Reddit, Discord especializados
- **Eventos y Conferencias**: Presenciales y virtuales de tu campo

**Ejercicio de Mapeo de Ecosistema:**

*Paso 1: Mapeo Visual*
Crea un diagrama con tu rol actual en el centro y mapea:
- **Círculo Interior**: Roles directamente relacionados (mismo nivel, promociones obvias)
- **Círculo Medio**: Industrias adyacentes donde podrías aplicar tus habilidades
- **Círculo Exterior**: Oportunidades emergentes o no obvias
- **Conexiones**: Líneas que muestren cómo podrías transicionar entre roles

*Paso 2: Análisis de Oportunidades (Matriz 2x2)*
Para cada elemento del mapa, evalúa:
- **Eje X - Atractivo** (1-5): ¿Qué tan interesante/deseable es?
- **Eje Y - Accesibilidad** (1-5): ¿Qué tan alcanzable es con tu perfil actual?
- **Cuadrante Superior Derecho**: Oportunidades prioritarias
- **Cuadrante Superior Izquierdo**: Desarrollo a largo plazo
- **Cuadrante Inferior Derecho**: Opciones de transición
- **Cuadrante Inferior Izquierdo**: Evitar o reconsiderar

*Paso 3: Identificación de Brechas Críticas*
Para las oportunidades prioritarias, identifica:
- **Habilidades Faltantes**: ¿Qué competencias necesitas desarrollar?
- **Experiencia Requerida**: ¿Qué tipo de proyectos o roles necesitas?
- **Conexiones Clave**: ¿Con quién necesitas construir relaciones?
- **Credenciales Útiles**: ¿Qué certificaciones o educación podrían ayudar?

### Análisis Competitivo Personal

**Benchmarking contra Profesionales Exitosos:**

**1. Identificación de Referentes Estratégicos**
- **Profesionales Aspiracionales**: 2-3 niveles por encima de ti en tu campo
- **Transicionadores Exitosos**: Personas que han hecho cambios similares a los que contemplas
- **Líderes Cross-Industry**: Profesionales exitosos en campos adyacentes
- **Emprendedores Relevantes**: Fundadores en tu sector o sectores de interés

**2. Análisis Profundo de Trayectorias**
Para cada referente, investiga:
- **Patrones de Carrera**: ¿Qué secuencia de roles siguieron?
- **Decisiones Clave**: ¿Cuándo y por qué hicieron transiciones importantes?
- **Desarrollo de Habilidades**: ¿Qué competencias desarrollaron en cada etapa?
- **Errores y Aprendizajes**: ¿Qué setbacks tuvieron y cómo los superaron?
- **Factores de Éxito**: ¿Qué elementos fueron críticos para su progreso?

**3. Diferenciación Estratégica Personal**
Identifica tu ventaja competitiva única:
- **Combinación Rara**: ¿Qué mix de habilidades tienes que pocos poseen?
- **Experiencia Distintiva**: ¿Qué experiencias únicas has tenido?
- **Perspectiva Única**: ¿Qué punto de vista diferente aportas?
- **Red Especial**: ¿Qué conexiones tienes que otros no?

**Framework VRIO para Ventaja Competitiva Personal:**

*Evalúa cada fortaleza/experiencia:*
- **V**alioso: ¿Esta habilidad/experiencia crea valor real para empleadores/clientes?
- **R**aro: ¿Pocos profesionales en tu campo la tienen?
- **I**nimitable: ¿Es difícil de copiar o desarrollar rápidamente?
- **O**rganizado: ¿Puedes aprovecharla efectivamente en tu trabajo?

*Ejemplos de Ventajas Competitivas Sólidas:*
- Combinación de expertise técnico profundo + habilidades de comunicación excepcionales
- Experiencia internacional en mercados específicos + conocimiento cultural profundo
- Red de contactos que cruza múltiples industrias + habilidad para conectar personas
- Historial probado en transformaciones complejas + metodologías propias desarrolladas

## Capítulo 3: Planificación Estratégica de Carrera

### Modelo de Planificación de Carrera a 10 Años

**Horizonte Temporal Estratégico:**

**1. Visión a 10 Años (2034)**
- **Posición Aspiracional**: ¿Dónde quieres estar profesionalmente?
- **Impacto Deseado**: ¿Qué tipo de influencia quieres tener?
- **Definición de Éxito**: ¿Cómo se ve el éxito para ti específicamente?
- **Legado Profesional**: ¿Qué quieres que se diga de tu contribución?

**2. Objetivos a 5 Años (2029)**
- **Rol Objetivo**: Posición específica o tipo de responsabilidad
- **Nivel de Influencia**: Alcance de tu impacto y autoridad
- **Compensación Target**: Rango salarial y estructura de beneficios
- **Expertise Desarrollada**: Áreas donde serás reconocido como experto

**3. Metas a 2 Años (2026)**
- **Próximo Rol**: Promoción específica o cambio de posición
- **Proyectos de Alto Impacto**: Iniciativas que construirán tu reputación
- **Habilidades Críticas**: Competencias específicas a desarrollar
- **Red Estratégica**: Conexiones clave a construir o fortalecer

**4. Acciones a 1 Año (2025)**
- **Objetivos de Performance**: Metas específicas en tu rol actual
- **Iniciativas de Desarrollo**: Cursos, certificaciones, experiencias
- **Actividades de Networking**: Eventos, asociaciones, mentorías
- **Métricas de Progreso**: KPIs para medir avance hacia objetivos mayores

**Template de Planificación Estratégica:**

*Visión de Carrera a 10 Años:*
"En 2034, seré [POSICIÓN ESPECÍFICA] en [TIPO DE ORGANIZACIÓN], liderando [ÁREA DE IMPACTO ESPECÍFICA] y reconocido por [EXPERTISE DISTINTIVA]. Habré impactado [AUDIENCIA ESPECÍFICA] a través de [CONTRIBUCIONES CONCRETAS] y construido un legado de [VALORES/PRINCIPIOS]."

*Objetivos SMART por Horizonte Temporal:*
Cada objetivo debe ser:
- **S**pecífico: Claramente definido sin ambigüedad
- **M**edible: Con métricas cuantificables o hitos verificables
- **A**lcanzable: Realista dado tu situación y recursos
- **R**elevante: Alineado con visión y valores personales
- **T**emporal: Con fechas límite específicas y hitos intermedios

### Estrategias de Desarrollo Acelerado

**Modelo 70-20-10 para Desarrollo Profesional:**

**70% - Experiencias Desafiantes y Transformadoras**
- **Proyectos Stretch**: Asignaciones que expanden significativamente tus capacidades
- **Roles Laterales**: Movimientos a áreas nuevas para ampliar perspectiva
- **Asignaciones Internacionales**: Experiencia en diferentes mercados/culturas
- **Liderazgo de Transformaciones**: Gestión de cambios organizacionales complejos
- **Startups Internas**: Liderazgo de nuevas iniciativas desde cero

**20% - Aprendizaje Social y Relacional**
- **Mentoría Bidireccional**: Tanto recibir como dar mentoría
- **Coaching Ejecutivo**: Desarrollo de habilidades de liderazgo específicas
- **Networking Estratégico**: Construcción intencional de relaciones clave
- **Comunidades de Práctica**: Participación activa en grupos de expertise
- **Feedback 360°**: Evaluación regular desde múltiples perspectivas

**10% - Educación Formal y Estructurada**
- **Programas Ejecutivos**: MBAs, programas de liderazgo de universidades top
- **Certificaciones Relevantes**: Credenciales específicas de industria
- **Conferencias y Seminarios**: Eventos de aprendizaje y networking
- **Lectura Dirigida**: Libros, artículos, investigación relevante
- **Cursos Online**: Plataformas como Coursera, edX, LinkedIn Learning

**Identificación de Experiencias de Alto Impacto:**

*Criterios de Selección para Oportunidades:*
- **Visibilidad Ejecutiva**: ¿Te expondrá a líderes senior y tomadores de decisión?
- **Desarrollo de Capacidades**: ¿Desarrollará habilidades críticas para tu futuro?
- **Impacto Organizacional**: ¿Creará valor medible y reconocible?
- **Expansión de Red**: ¿Te conectará con personas influyentes en tu campo?
- **Aprendizaje del Negocio**: ¿Te enseñará sobre aspectos clave del negocio?

*Tipos de Experiencias Transformadoras:*
- **Turnarounds**: Liderar la recuperación de una unidad/proyecto en crisis
- **Lanzamientos**: Gestionar el lanzamiento de nuevos productos/servicios
- **M&A**: Participar en fusiones, adquisiciones o joint ventures
- **Expansión Geográfica**: Abrir nuevos mercados o regiones
- **Transformación Digital**: Liderar iniciativas de digitalización
- **Equipos Multiculturales**: Gestionar equipos diversos globalmente
- **Stakeholder Management**: Gestionar relaciones complejas con múltiples partes

### Construcción de Marca Personal Estratégica

**Elementos de una Marca Personal Sólida:**

**1. Posicionamiento Claro y Diferenciado**
- **Expertise Distintiva**: ¿Por qué eres conocido profesionalmente?
- **Propuesta de Valor Única**: ¿Qué problemas resuelves mejor que otros?
- **Audiencia Target**: ¿Quién es tu audiencia profesional principal?
- **Diferenciación Competitiva**: ¿Qué te hace único en tu campo?

**2. Narrativa Coherente y Compelling**
- **Historia Profesional**: Hilo conductor lógico en tu trayectoria
- **Evolución Intencional**: Progresión clara de roles y responsabilidades
- **Conexión de Experiencias**: Cómo experiencias diversas se complementan
- **Visión Futura**: Dirección clara hacia donde te diriges

**3. Presencia Digital Profesional Optimizada**
- **LinkedIn Estratégico**: Perfil optimizado para tu audiencia target
- **Contenido de Valor**: Publicaciones regulares que demuestran expertise
- **Engagement Auténtico**: Participación genuina en conversaciones de industria
- **Testimonios Sociales**: Recomendaciones y endorsements de personas clave

**4. Reputación y Credibilidad Demostrable**
- **Resultados Cuantificables**: Logros específicos y medibles
- **Reconocimientos Externos**: Premios, menciones, invitaciones a hablar
- **Thought Leadership**: Artículos, presentaciones, apariciones en medios
- **Validación de Pares**: Reconocimiento de otros profesionales respetados

**Estrategia de Contenido para Marca Personal:**

*Pilares de Contenido (Regla 80-20):*

**80% - Valor para la Audiencia:**
- **Insights de Industria**: Análisis de tendencias y cambios del mercado
- **Mejores Prácticas**: Metodologías y frameworks que has desarrollado/aplicado
- **Lecciones Aprendidas**: Experiencias y errores que pueden ayudar a otros
- **Análisis de Casos**: Estudios de proyectos exitosos (respetando confidencialidad)

**20% - Promoción Personal Sutil:**
- **Logros y Reconocimientos**: Compartir éxitos de manera humilde
- **Nuevos Roles/Proyectos**: Anunciar transiciones y oportunidades
- **Apariciones en Medios**: Entrevistas, podcasts, conferencias
- **Colaboraciones Importantes**: Partnerships y proyectos de alto perfil

*Calendario de Contenido Sugerido:*
- **Lunes**: Insight de industria o análisis de tendencia
- **Miércoles**: Lección aprendida o caso de estudio
- **Viernes**: Reflexión personal o perspectiva única
- **Mensual**: Artículo largo o análisis profundo
- **Trimestral**: Video o contenido multimedia

**Medición de Efectividad de Marca Personal:**

*Métricas Cuantitativas:*
- **Alcance**: Seguidores, conexiones, visualizaciones
- **Engagement**: Likes, comentarios, shares, mensajes directos
- **Crecimiento**: Tasa de crecimiento de audiencia
- **Conversiones**: Oportunidades generadas, invitaciones recibidas

*Métricas Cualitativas:*
- **Calidad de Oportunidades**: Nivel de roles/proyectos ofrecidos
- **Reconocimiento de Expertise**: Invitaciones a hablar, consultar, asesorar
- **Calidad de Red**: Nivel de profesionales que buscan conectar contigo
- **Feedback Directo**: Comentarios sobre tu reputación y expertise

## Conclusión: Diseñando una Carrera de Impacto y Significado

El desarrollo de carrera en el siglo XXI requiere una aproximación fundamentalmente diferente a las generaciones anteriores. Ya no se trata de seguir un camino lineal predefinido, sino de diseñar activamente una trayectoria que maximice tanto el impacto profesional como la satisfacción personal.

### Principios Fundamentales para el Éxito Sostenible

**1. Autoconocimiento Continuo y Evolutivo**
- Inversión regular en introspección profunda y feedback externo
- Adaptación consciente a cambios en valores y prioridades de vida
- Alineación constante entre identidad auténtica y acciones profesionales
- Evolución intencional de fortalezas y desarrollo de nuevas capacidades

**2. Aprendizaje Perpetuo como Ventaja Competitiva**
- Curiosidad intelectual como motor de crecimiento profesional
- Adaptabilidad proactiva ante cambios tecnológicos y de mercado
- Construcción estratégica de habilidades complementarias y diferenciadas
- Mentalidad de crecimiento vs. mentalidad fija en todos los desafíos

**3. Construcción de Relaciones Auténticas y Estratégicas**
- Networking basado en valor mutuo y contribución genuina
- Inversión consistente en el desarrollo y éxito de otros
- Construcción de reputación sólida basada en resultados y carácter
- Contribución activa a comunidades profesionales y causas importantes

**4. Orientación al Impacto Medible y Significativo**
- Enfoque en resultados concretos y valor creado
- Contribución clara a objetivos organizacionales y sociales
- Creación de valor para múltiples stakeholders
- Construcción de legado profesional positivo y duradero

### Plan de Acción Personal Inmediato

**Próximos 30 Días - Fundamentos:**
- Completar auditoría integral de fortalezas, valores y propósito
- Definir visión de carrera específica a 10 años
- Identificar 3 brechas críticas de desarrollo más importantes
- Iniciar conversaciones exploratorias con 5 mentores/referentes potenciales
- Optimizar perfil de LinkedIn y presencia digital básica

**Próximos 90 Días - Construcción:**
- Desarrollar plan detallado de desarrollo de habilidades con timeline
- Expandir red profesional estratégicamente en 25 contactos de calidad
- Identificar y aplicar a 2 oportunidades de stretch o proyectos desafiantes
- Establecer rutina de creación de contenido y thought leadership
- Comenzar programa formal de mentoría (dar y recibir)

**Próximos 12 Meses - Ejecución:**
- Ejecutar plan de desarrollo sistemáticamente con revisiones mensuales
- Medir progreso contra objetivos establecidos con métricas específicas
- Ajustar estrategia basado en aprendizajes y cambios del mercado
- Preparar y ejecutar transición a siguiente nivel de carrera
- Establecer sistema de seguimiento y mejora continua

### Recursos Esenciales para Profundización

**Libros Fundamentales:**
- "What Color Is Your Parachute?" - Richard N. Bolles (autoconocimiento)
- "The Start-up of You" - Reid Hoffman (mentalidad emprendedora)
- "Designing Your Life" - Bill Burnett y Dave Evans (diseño intencional)
- "The Lean Startup" - Eric Ries (innovación y experimentación)
- "Good to Great" - Jim Collins (excelencia y liderazgo)
- "Mindset" - Carol Dweck (mentalidad de crecimiento)

**Herramientas y Evaluaciones Profesionales:**
- **StrengthsFinder 2.0**: Identificación científica de fortalezas naturales
- **Myers-Briggs Type Indicator**: Comprensión de preferencias de trabajo
- **Enneagram**: Autoconocimiento profundo de motivaciones
- **360-Degree Feedback**: Evaluación integral desde múltiples perspectivas
- **LinkedIn Learning**: Desarrollo continuo de habilidades técnicas y blandas

**Comunidades y Redes Estratégicas:**
- **Asociaciones Profesionales**: De tu industria específica y aspiracional
- **Grupos de LinkedIn**: Comunidades de práctica y networking
- **Meetups Locales**: Eventos presenciales de networking y aprendizaje
- **Comunidades de Emprendedores**: Para mentalidad innovadora
- **Programas de Mentoría**: Tanto formales como informales

### Mensaje Final: Tu Carrera, Tu Responsabilidad, Tu Legado

Tu carrera profesional es una de las inversiones más importantes que harás en tu vida. No es solo sobre alcanzar posiciones o salarios más altos; es sobre crear impacto significativo, desarrollar tu potencial único y contribuir positivamente al mundo.

Las herramientas, estrategias y marcos presentados en este libro te proporcionan la base para diseñar y ejecutar una trayectoria profesional excepcional. Sin embargo, el conocimiento sin acción es inútil. El éxito no será resultado de la suerte o las circunstancias, sino de:

- **Planificación Estratégica**: Diseño intencional de tu futuro profesional
- **Ejecución Disciplinada**: Acción consistente hacia tus objetivos
- **Adaptación Continua**: Flexibilidad ante cambios y nuevas oportunidades
- **Contribución Auténtica**: Valor real creado para otros y para la sociedad

El futuro del trabajo pertenece a aquellos que toman control activo de su desarrollo profesional, que se reinventan continuamente y que construyen carreras basadas en propósito, impacto y crecimiento mutuo.

Tu momento de comenzar a diseñar intencionalmente tu futuro profesional es ahora. El mundo necesita tu contribución única, y tú mereces una carrera que te llene de propósito y satisfacción.

¡El viaje hacia tu carrera extraordinaria comienza hoy!', 
'Dra. Ana Sofía Martínez', 
ARRAY['carrera', 'desarrollo profesional', 'estrategia', 'liderazgo', 'networking'], 
'estrategias-desarrollo-carrera');

-- 3. Get the actual book IDs after insertion
DO $$
DECLARE
    libro1_id INTEGER;
    libro2_id INTEGER;
    libro3_id INTEGER;
BEGIN
    -- Get the IDs of the inserted books
    SELECT id INTO libro1_id FROM knowledge_base WHERE slug = 'fundamentos-liderazgo-efectivo';
    SELECT id INTO libro2_id FROM knowledge_base WHERE slug = 'gestion-energia-personal';
    SELECT id INTO libro3_id FROM knowledge_base WHERE slug = 'estrategias-desarrollo-carrera';

    -- Insert reading progress data using the actual book IDs
    INSERT INTO user_reading_progress (user_email, book_id, reading_progress, target_percentage, status, notes, reading_time_minutes, started_at, last_read_at) VALUES
    ('demo@example.com', libro1_id, 45, 100, 'reading', 'Excelente contenido sobre liderazgo auténtico. Las técnicas de inteligencia emocional son muy aplicables.', 180, NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
    ('demo@example.com', libro2_id, 30, 60, 'reading', 'Los conceptos de gestión de energía están cambiando mi rutina diaria. Especialmente útil el capítulo sobre ciclos ultradianos.', 120, NOW() - INTERVAL '3 days', NOW() - INTERVAL '6 hours'),
    ('demo@example.com', libro3_id, 15, 100, 'reading', 'Muy relevante para mi situación actual. El framework de autoconocimiento es muy completo.', 60, NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours');

    -- Insert bookmarks using the actual book IDs
    INSERT INTO user_bookmarks (user_email, book_id, bookmark_note) VALUES
    ('demo@example.com', libro1_id, 'Técnicas de feedback STAR - muy útil para mis reuniones 1:1'),
    ('demo@example.com', libro2_id, 'Protocolo de micro-recuperaciones - implementar en mi rutina diaria'),
    ('demo@example.com', libro3_id, 'Ejercicio de definición de propósito - completar este fin de semana');

    -- Insert reading sessions using the actual book IDs
    INSERT INTO reading_sessions (user_email, book_id, session_start, session_end, duration_minutes, progress_start, progress_end, pages_read) VALUES
    ('demo@example.com', libro1_id, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', 60, 40, 45, 12),
    ('demo@example.com', libro2_id, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours', 45, 25, 30, 8),
    ('demo@example.com', libro3_id, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2.5 hours', 30, 10, 15, 6);
END $$;

-- 4. Insert reading goals
INSERT INTO reading_goals (user_email, goal_type, target_value, current_value, period_start, period_end, status) VALUES
('demo@example.com', 'books_completed', 12, 0, '2025-01-01', '2025-12-31', 'active'),
('demo@example.com', 'reading_time_hours', 100, 6, '2025-01-01', '2025-12-31', 'active'),
('demo@example.com', 'categories_explored', 5, 3, '2025-01-01', '2025-12-31', 'active');

-- 5. Verify that everything was inserted correctly
SELECT 
    'BIBLIOTECA CONFIGURADA EXITOSAMENTE' as status,
    (SELECT COUNT(*) FROM knowledge_base) as total_libros,
    (SELECT COUNT(*) FROM user_reading_progress WHERE user_email = 'demo@example.com') as progreso_usuario,
    (SELECT COUNT(*) FROM user_bookmarks WHERE user_email = 'demo@example.com') as bookmarks_usuario,
    (SELECT COUNT(*) FROM reading_goals WHERE user_email = 'demo@example.com') as objetivos_usuario;
