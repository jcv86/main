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

## Conclusión: El Viaje Continuo del Liderazgo

El liderazgo efectivo no es un destino, sino un viaje continuo de crecimiento personal y profesional. Los principios y herramientas presentados en este libro proporcionan una base sólida, pero su aplicación exitosa requiere práctica constante, reflexión honesta y adaptación continua.', 
'Dr. María Elena Rodríguez', 
ARRAY['liderazgo', 'management', 'desarrollo profesional', 'equipos', 'comunicación'], 
'fundamentos-liderazgo-efectivo'),

-- LIBRO 2: Gestión de Energía Personal
('Gestión de Energía Personal y Productividad Sostenible', 'Productividad', 
'# Gestión de Energía Personal y Productividad Sostenible

## Introducción: Más Allá de la Gestión del Tiempo

En un mundo donde la información fluye constantemente y las demandas profesionales parecen infinitas, la gestión tradicional del tiempo ha demostrado ser insuficiente. Este libro introduce un paradigma revolucionario: la gestión de energía personal como la clave para una productividad sostenible y una vida profesional plena.

## Capítulo 1: Los Cuatro Tipos de Energía

### Energía Física: La Base de Todo

La energía física es el fundamento sobre el cual se construye toda productividad sostenible. Sin una base física sólida, nuestras capacidades mentales, emocionales y espirituales se ven comprometidas.

**Componentes de la Energía Física:**

**1. Nutrición Estratégica**
- Desayuno rico en proteínas (25-30g) para estabilizar glucosa
- Comidas pequeñas cada 3-4 horas para mantener energía constante
- Hidratación de 35ml por kg de peso corporal diariamente
- Evitar picos de azúcar que causan crashes energéticos

**2. Ejercicio Inteligente**
- 30 minutos de actividad cardiovascular 4-5 veces por semana
- Entrenamiento de fuerza 2-3 veces por semana
- Caminatas cortas cada 90 minutos durante el día laboral
- Ejercicios de estiramiento para contrarrestar postura sedentaria

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

**2. Regulación Emocional**
- Técnicas de reencuadre cognitivo
- Respiración controlada para manejo de estrés
- Ejercicios de gratitud diarios (3 cosas específicas)
- Visualización positiva de objetivos

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

## Conclusión: Integrando la Gestión de Energía en tu Vida

La gestión efectiva de energía personal no es un destino, sino un proceso continuo de autoconocimiento, experimentación y refinamiento. Los principios y técnicas presentados en este libro proporcionan un marco sólido, pero su aplicación exitosa requiere personalización y práctica constante.', 
'Dr. Carlos Mendoza', 
ARRAY['productividad', 'energía', 'bienestar', 'rendimiento', 'salud'], 
'gestion-energia-personal'),

-- LIBRO 3: Estrategias de Desarrollo de Carrera
('Estrategias Avanzadas de Desarrollo de Carrera Profesional', 'Desarrollo Profesional', 
'# Estrategias Avanzadas de Desarrollo de Carrera Profesional

## Introducción: Navegando el Futuro del Trabajo

El panorama profesional del siglo XXI se caracteriza por la velocidad del cambio, la obsolescencia acelerada de habilidades y la emergencia de nuevas formas de trabajo. En este contexto dinámico, el desarrollo de carrera ya no puede ser un proceso pasivo o reactivo.

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

## Conclusión: Diseñando una Carrera de Impacto y Significado

El desarrollo de carrera en el siglo XXI requiere una aproximación fundamentalmente diferente a las generaciones anteriores. Ya no se trata de seguir un camino lineal predefinido, sino de diseñar activamente una trayectoria que maximice tanto el impacto profesional como la satisfacción personal.', 
'Dra. Ana Sofía Martínez', 
ARRAY['carrera', 'desarrollo profesional', 'estrategia', 'liderazgo', 'networking'], 
'estrategias-desarrollo-carrera');

-- 3. Insert reading progress data for demo user
INSERT INTO user_reading_progress (user_email, book_id, reading_progress, target_percentage, status, notes, reading_time_minutes, started_at, last_read_at)
SELECT 
    'demo@example.com',
    kb.id,
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN 45
        WHEN kb.slug = 'gestion-energia-personal' THEN 30
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN 15
    END,
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN 100
        WHEN kb.slug = 'gestion-energia-personal' THEN 60
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN 100
    END,
    'reading',
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN 'Excelente contenido sobre liderazgo auténtico. Las técnicas de inteligencia emocional son muy aplicables.'
        WHEN kb.slug = 'gestion-energia-personal' THEN 'Los conceptos de gestión de energía están cambiando mi rutina diaria. Especialmente útil el capítulo sobre ciclos ultradianos.'
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN 'Muy relevante para mi situación actual. El framework de autoconocimiento es muy completo.'
    END,
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN 180
        WHEN kb.slug = 'gestion-energia-personal' THEN 120
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN 60
    END,
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN NOW() - INTERVAL '5 days'
        WHEN kb.slug = 'gestion-energia-personal' THEN NOW() - INTERVAL '3 days'
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN NOW() - INTERVAL '1 day'
    END,
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN NOW() - INTERVAL '1 day'
        WHEN kb.slug = 'gestion-energia-personal' THEN NOW() - INTERVAL '6 hours'
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN NOW() - INTERVAL '2 hours'
    END
FROM knowledge_base kb
WHERE kb.slug IN ('fundamentos-liderazgo-efectivo', 'gestion-energia-personal', 'estrategias-desarrollo-carrera');

-- 4. Insert bookmarks
INSERT INTO user_bookmarks (user_email, book_id, bookmark_note)
SELECT 
    'demo@example.com',
    kb.id,
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN 'Técnicas de feedback STAR - muy útil para mis reuniones 1:1'
        WHEN kb.slug = 'gestion-energia-personal' THEN 'Protocolo de micro-recuperaciones - implementar en mi rutina diaria'
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN 'Ejercicio de definición de propósito - completar este fin de semana'
    END
FROM knowledge_base kb
WHERE kb.slug IN ('fundamentos-liderazgo-efectivo', 'gestion-energia-personal', 'estrategias-desarrollo-carrera');

-- 5. Insert reading goals
INSERT INTO reading_goals (user_email, goal_type, target_value, current_value, period_start, period_end, status) VALUES
('demo@example.com', 'books_completed', 12, 0, '2025-01-01', '2025-12-31', 'active'),
('demo@example.com', 'reading_time_hours', 100, 6, '2025-01-01', '2025-12-31', 'active'),
('demo@example.com', 'categories_explored', 5, 3, '2025-01-01', '2025-12-31', 'active');

-- 6. Insert reading sessions
INSERT INTO reading_sessions (user_email, book_id, session_start, session_end, duration_minutes, progress_start, progress_end, pages_read)
SELECT 
    'demo@example.com',
    kb.id,
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN NOW() - INTERVAL '2 hours'
        WHEN kb.slug = 'gestion-energia-personal' THEN NOW() - INTERVAL '6 hours'
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN NOW() - INTERVAL '3 hours'
    END,
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN NOW() - INTERVAL '1 hour'
        WHEN kb.slug = 'gestion-energia-personal' THEN NOW() - INTERVAL '5 hours'
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN NOW() - INTERVAL '2.5 hours'
    END,
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN 60
        WHEN kb.slug = 'gestion-energia-personal' THEN 45
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN 30
    END,
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN 40
        WHEN kb.slug = 'gestion-energia-personal' THEN 25
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN 10
    END,
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN 45
        WHEN kb.slug = 'gestion-energia-personal' THEN 30
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN 15
    END,
    CASE 
        WHEN kb.slug = 'fundamentos-liderazgo-efectivo' THEN 12
        WHEN kb.slug = 'gestion-energia-personal' THEN 8
        WHEN kb.slug = 'estrategias-desarrollo-carrera' THEN 6
    END
FROM knowledge_base kb
WHERE kb.slug IN ('fundamentos-liderazgo-efectivo', 'gestion-energia-personal', 'estrategias-desarrollo-carrera');

-- 7. Verify that everything was inserted correctly
SELECT 
    'BIBLIOTECA CONFIGURADA EXITOSAMENTE' as status,
    (SELECT COUNT(*) FROM knowledge_base) as total_libros,
    (SELECT COUNT(*) FROM user_reading_progress WHERE user_email = 'demo@example.com') as progreso_usuario,
    (SELECT COUNT(*) FROM user_bookmarks WHERE user_email = 'demo@example.com') as bookmarks_usuario,
    (SELECT COUNT(*) FROM reading_goals WHERE user_email = 'demo@example.com') as objetivos_usuario,
    (SELECT COUNT(*) FROM reading_sessions WHERE user_email = 'demo@example.com') as sesiones_usuario;
