-- Enhanced Knowledge Base for AI Brain
-- This script creates a comprehensive knowledge base for the platform's AI brain

BEGIN;

-- Create knowledge base table if it doesn't exist
CREATE TABLE IF NOT EXISTS knowledge_base (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    tags TEXT[],
    difficulty_level VARCHAR(50) DEFAULT 'beginner',
    search_vector tsvector,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for full-text search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_search ON knowledge_base USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base (category);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING GIN(tags);

-- Clear existing data and insert comprehensive knowledge base
TRUNCATE knowledge_base RESTART IDENTITY;

-- DISC Test Knowledge
INSERT INTO knowledge_base (title, content, category, subcategory, tags, difficulty_level) VALUES
('Fundamentos del Test DISC',
'El test DISC es una evaluación psicométrica que mide cuatro dimensiones principales del comportamiento:

**D - DOMINANCIA (Dominance):**
- **Características:** Orientado a resultados, directo, decidido, competitivo
- **Fortalezas:** Liderazgo natural, toma decisiones rápidas, orientación a objetivos
- **Desafíos:** Puede ser impaciente, demasiado directo, resistente a la autoridad
- **Carreras ideales:** CEO, Director de Ventas, Emprendedor, Gerente de Proyectos

**I - INFLUENCIA (Influence):**
- **Características:** Sociable, entusiasta, persuasivo, optimista
- **Fortalezas:** Excelente comunicador, motivador, construye relaciones fácilmente
- **Desafíos:** Puede ser desorganizado, evita conflictos, busca aprobación
- **Carreras ideales:** Ventas, Marketing, Relaciones Públicas, Capacitación

**S - ESTABILIDAD (Steadiness):**
- **Características:** Paciente, leal, confiable, colaborativo
- **Fortalezas:** Trabajo en equipo, consistencia, escucha activa, apoyo a otros
- **Desafíos:** Resistencia al cambio, evita confrontaciones, puede ser indeciso
- **Carreras ideales:** Recursos Humanos, Servicio al Cliente, Enfermería, Educación

**C - CUMPLIMIENTO (Compliance):**
- **Características:** Analítico, preciso, sistemático, orientado a la calidad
- **Fortalezas:** Atención al detalle, pensamiento crítico, seguimiento de procesos
- **Desafíos:** Puede ser perfeccionista, crítico, lento en decisiones
- **Carreras ideales:** Contabilidad, Ingeniería, Investigación, Control de Calidad

**Interpretación de Puntuaciones:**
- **Alto (80-100%):** Característica muy dominante en tu comportamiento
- **Medio-Alto (60-79%):** Característica presente pero flexible
- **Medio (40-59%):** Característica situacional, adaptable
- **Bajo (0-39%):** Característica menos natural, requiere esfuerzo consciente

**Aplicaciones Prácticas:**
- **Autoconocimiento:** Entender tu estilo natural de comunicación
- **Desarrollo profesional:** Identificar roles que se alineen con tu perfil
- **Trabajo en equipo:** Mejorar la colaboración entendiendo estilos diferentes
- **Liderazgo:** Adaptar tu estilo según la situación y las personas',
'disc', 'fundamentals', ARRAY['disc', 'comportamiento', 'liderazgo', 'comunicación'], 'beginner'),

('Interpretación Avanzada DISC',
'Análisis profundo de combinaciones y patrones DISC:

**COMBINACIONES COMUNES:**

**D-I (Dominancia-Influencia):**
- **Perfil:** Líder carismático y orientado a resultados
- **Fortalezas:** Visión estratégica + habilidades de persuasión
- **Carreras:** CEO, Director Comercial, Político, Consultor Senior
- **Desarrollo:** Trabajar en paciencia y escucha activa

**D-C (Dominancia-Cumplimiento):**
- **Perfil:** Líder analítico y sistemático
- **Fortalezas:** Decisiones basadas en datos + orientación a objetivos
- **Carreras:** Director de Operaciones, Ingeniero Jefe, Analista Senior
- **Desarrollo:** Mejorar habilidades interpersonales

**I-S (Influencia-Estabilidad):**
- **Perfil:** Comunicador empático y colaborativo
- **Fortalezas:** Construcción de relaciones + trabajo en equipo
- **Carreras:** Recursos Humanos, Capacitador, Mediador, Consejero
- **Desarrollo:** Aumentar orientación a resultados

**S-C (Estabilidad-Cumplimiento):**
- **Perfil:** Especialista confiable y meticuloso
- **Fortalezas:** Consistencia + atención al detalle
- **Carreras:** Especialista Técnico, Administrador, Investigador
- **Desarrollo:** Desarrollar habilidades de liderazgo

**PATRONES DE ADAPTACIÓN:**
- **Estilo Natural vs Adaptado:** Diferencias indican estrés o adaptación situacional
- **Línea de Energía:** Indica nivel de energía y motivación actual
- **Patrones de Estrés:** Comportamientos bajo presión

**DESARROLLO POR ESTILO:**

**Para Dominantes (D):**
- Practicar paciencia y escucha activa
- Desarrollar habilidades de coaching
- Aprender a delegar efectivamente
- Trabajar en inteligencia emocional

**Para Influyentes (I):**
- Mejorar organización y seguimiento
- Desarrollar habilidades analíticas
- Practicar comunicación directa
- Fortalecer orientación a detalles

**Para Estables (S):**
- Desarrollar confianza para liderar cambios
- Practicar comunicación asertiva
- Mejorar habilidades de toma de decisiones
- Aumentar orientación a resultados

**Para Cumplidos (C):**
- Desarrollar habilidades interpersonales
- Practicar comunicación informal
- Mejorar flexibilidad y adaptabilidad
- Fortalecer habilidades de presentación',
'disc', 'advanced', ARRAY['disc', 'combinaciones', 'desarrollo', 'liderazgo'], 'advanced');

-- Big Five Knowledge
INSERT INTO knowledge_base (title, content, category, subcategory, tags, difficulty_level) VALUES
('Modelo Big Five de Personalidad',
'El modelo Big Five (Cinco Grandes) es el marco más científicamente validado para entender la personalidad:

**1. APERTURA A LA EXPERIENCIA (Openness)**
- **Alto:** Creativo, curioso, imaginativo, aventurero
- **Bajo:** Práctico, convencional, prefiere rutina, realista
- **Carreras (Alto):** Artista, Investigador, Consultor, Diseñador
- **Carreras (Bajo):** Contador, Administrador, Técnico, Operador

**2. RESPONSABILIDAD (Conscientiousness)**
- **Alto:** Organizado, disciplinado, confiable, orientado a objetivos
- **Bajo:** Flexible, espontáneo, relajado, adaptable
- **Carreras (Alto):** Gerente, Médico, Abogado, Ingeniero
- **Carreras (Bajo):** Artista, Periodista, Vendedor, Emprendedor

**3. EXTRAVERSIÓN (Extraversion)**
- **Alto:** Sociable, enérgico, asertivo, busca estimulación
- **Bajo:** Reservado, independiente, reflexivo, prefiere soledad
- **Carreras (Alto):** Ventas, Relaciones Públicas, Gerencia, Política
- **Carreras (Bajo):** Investigación, Escritura, Programación, Análisis

**4. AMABILIDAD (Agreeableness)**
- **Alto:** Cooperativo, confiado, empático, altruista
- **Bajo:** Competitivo, escéptico, directo, independiente
- **Carreras (Alto):** Recursos Humanos, Enfermería, Educación, Trabajo Social
- **Carreras (Bajo):** Abogado, Cirujano, Crítico, Analista Financiero

**5. NEUROTICISMO (Neuroticism)**
- **Alto:** Sensible al estrés, emocional, ansioso, reactivo
- **Bajo:** Estable emocionalmente, calmado, resiliente, relajado
- **Carreras (Bajo):** Piloto, Cirujano, Gerente de Crisis, Bombero
- **Carreras (Alto):** Artista, Escritor, Terapeuta (con manejo adecuado)

**COMBINACIONES PROFESIONALES EXITOSAS:**

**Liderazgo Ejecutivo:**
- Alta Extraversión + Alta Responsabilidad + Baja Amabilidad
- Perfil: Líder decidido, organizado y orientado a resultados

**Innovación y Creatividad:**
- Alta Apertura + Baja Responsabilidad + Alta Extraversión
- Perfil: Creativo, flexible y colaborativo

**Especialización Técnica:**
- Baja Extraversión + Alta Responsabilidad + Alta Apertura
- Perfil: Experto técnico, detallista y analítico

**Servicio y Apoyo:**
- Alta Amabilidad + Alta Responsabilidad + Baja Extraversión
- Perfil: Confiable, empático y orientado al servicio

**DESARROLLO PERSONAL:**
- **Apertura:** Exponerse a nuevas experiencias, viajar, leer diverso
- **Responsabilidad:** Establecer rutinas, usar herramientas de organización
- **Extraversión:** Practicar habilidades sociales, buscar oportunidades de networking
- **Amabilidad:** Desarrollar empatía, practicar colaboración
- **Estabilidad Emocional:** Técnicas de manejo del estrés, mindfulness',
'big-five', 'fundamentals', ARRAY['big-five', 'personalidad', 'carreras', 'desarrollo'], 'beginner');

-- MBTI Knowledge
INSERT INTO knowledge_base (title, content, category, subcategory, tags, difficulty_level) VALUES
('Sistema MBTI y 16 Tipos de Personalidad',
'El Myers-Briggs Type Indicator (MBTI) identifica 16 tipos de personalidad basados en 4 dimensiones:

**DIMENSIONES PRINCIPALES:**

**E/I - Extraversión vs Introversión:**
- **Extraversión (E):** Energía del mundo exterior, procesamiento externo
- **Introversión (I):** Energía del mundo interior, procesamiento interno

**S/N - Sensación vs Intuición:**
- **Sensación (S):** Información concreta, detalles, experiencia práctica
- **Intuición (N):** Patrones, posibilidades, conceptos abstractos

**T/F - Pensamiento vs Sentimiento:**
- **Pensamiento (T):** Decisiones basadas en lógica y análisis objetivo
- **Sentimiento (F):** Decisiones basadas en valores y consideraciones personales

**J/P - Juicio vs Percepción:**
- **Juicio (J):** Estructura, planificación, decisiones definitivas
- **Percepción (P):** Flexibilidad, adaptabilidad, opciones abiertas

**16 TIPOS Y CARRERAS IDEALES:**

**ANALISTAS (NT):**
- **INTJ - Arquitecto:** Estratega, Consultor, Científico, CEO
- **INTP - Pensador:** Investigador, Programador, Filósofo, Analista
- **ENTJ - Comandante:** Ejecutivo, Emprendedor, Abogado, Gerente
- **ENTP - Innovador:** Consultor, Inventor, Periodista, Vendedor

**DIPLOMÁTICOS (NF):**
- **INFJ - Abogado:** Consejero, Escritor, Psicólogo, Activista
- **INFP - Mediador:** Artista, Escritor, Terapeuta, Trabajador Social
- **ENFJ - Protagonista:** Líder, Maestro, Entrenador, Político
- **ENFP - Activista:** Consultor, Periodista, Actor, Emprendedor

**CENTINELAS (SJ):**
- **ISTJ - Logista:** Contador, Administrador, Ingeniero, Auditor
- **ISFJ - Protector:** Enfermero, Maestro, Administrador, Consejero
- **ESTJ - Ejecutivo:** Gerente, Abogado, Juez, Administrador
- **ESFJ - Cónsul:** Recursos Humanos, Maestro, Vendedor, Organizador

**EXPLORADORES (SP):**
- **ISTP - Virtuoso:** Ingeniero, Mecánico, Piloto, Programador
- **ISFP - Aventurero:** Artista, Diseñador, Músico, Terapeuta
- **ESTP - Emprendedor:** Vendedor, Atleta, Paramédico, Negociador
- **ESFP - Animador:** Actor, Maestro, Vendedor, Organizador de eventos

**FUNCIONES COGNITIVAS:**
Cada tipo tiene una jerarquía de 4 funciones cognitivas que determinan cómo procesan información y toman decisiones.

**DESARROLLO PROFESIONAL POR TIPO:**
- **NT:** Buscar desafíos intelectuales, autonomía, oportunidades de innovación
- **NF:** Encontrar propósito, impacto social, desarrollo de personas
- **SJ:** Valorar estabilidad, estructura, reconocimiento por confiabilidad
- **SP:** Buscar variedad, flexibilidad, aplicación práctica inmediata',
'mbti', 'fundamentals', ARRAY['mbti', 'tipos', 'personalidad', 'carreras'], 'beginner');

-- RIASEC Knowledge
INSERT INTO knowledge_base (title, content, category, subcategory, tags, difficulty_level) VALUES
('Modelo RIASEC de Intereses Vocacionales',
'El modelo RIASEC de John Holland identifica 6 tipos de intereses vocacionales:

**R - REALISTA (Realistic):**
- **Características:** Práctico, físico, mecánico, directo
- **Actividades:** Construir, reparar, operar maquinaria, trabajar al aire libre
- **Carreras:** Ingeniero, Mecánico, Agricultor, Piloto, Técnico, Carpintero
- **Ambiente:** Estructurado, con herramientas y máquinas, resultados tangibles

**I - INVESTIGATIVO (Investigative):**
- **Características:** Analítico, intelectual, científico, curioso
- **Actividades:** Investigar, analizar, experimentar, resolver problemas complejos
- **Carreras:** Científico, Médico, Investigador, Analista, Programador, Matemático
- **Ambiente:** Laboratorios, universidades, centros de investigación

**A - ARTÍSTICO (Artistic):**
- **Características:** Creativo, expresivo, imaginativo, original
- **Actividades:** Crear, diseñar, escribir, actuar, componer música
- **Carreras:** Artista, Diseñador, Escritor, Músico, Actor, Arquitecto
- **Ambiente:** Estudios, teatros, galerías, espacios creativos flexibles

**S - SOCIAL (Social):**
- **Características:** Empático, colaborativo, orientado a ayudar, comunicativo
- **Actividades:** Enseñar, aconsejar, cuidar, entrenar, trabajar en equipo
- **Carreras:** Maestro, Psicólogo, Enfermero, Trabajador Social, Entrenador
- **Ambiente:** Escuelas, hospitales, organizaciones de servicio

**E - EMPRENDEDOR (Enterprising):**
- **Características:** Persuasivo, ambicioso, orientado al liderazgo, competitivo
- **Actividades:** Vender, liderar, negociar, gestionar, influir en otros
- **Carreras:** Gerente, Vendedor, Abogado, Político, Emprendedor, Ejecutivo
- **Ambiente:** Oficinas corporativas, salas de juntas, entornos competitivos

**C - CONVENCIONAL (Conventional):**
- **Características:** Organizado, detallista, sistemático, confiable
- **Actividades:** Organizar datos, seguir procedimientos, mantener registros
- **Carreras:** Contador, Administrador, Secretario, Analista Financiero, Auditor
- **Ambiente:** Oficinas estructuradas, bancos, organizaciones burocráticas

**COMBINACIONES COMUNES:**

**RI - Realista-Investigativo:**
- Ingeniero, Técnico de Laboratorio, Investigador Aplicado
- Combina habilidades prácticas con análisis científico

**AI - Artístico-Investigativo:**
- Diseñador UX, Arquitecto, Investigador Creativo
- Fusiona creatividad con metodología rigurosa

**SE - Social-Emprendedor:**
- Director de Recursos Humanos, Consultor Organizacional, Líder Comunitario
- Combina orientación a personas con habilidades de liderazgo

**EC - Emprendedor-Convencional:**
- Gerente Financiero, Director de Operaciones, Consultor de Negocios
- Mezcla ambición con organización sistemática

**DESARROLLO DE CARRERA:**
- **Tipo Primario:** Tu área de mayor interés y fortaleza natural
- **Tipo Secundario:** Complementa y enriquece tu perfil profesional
- **Tipos Opuestos:** Pueden generar conflicto o crear perfiles únicos y valiosos

**ESTRATEGIAS DE EXPLORACIÓN:**
1. Identifica tus 2-3 tipos más altos
2. Investiga carreras en la intersección de estos tipos
3. Busca experiencias (voluntariado, pasantías) en áreas de interés
4. Habla con profesionales en campos que te interesan
5. Considera cómo tus intereses pueden evolucionar con el tiempo',
'riasec', 'fundamentals', ARRAY['riasec', 'intereses', 'vocacional', 'carreras'], 'beginner');

-- Soft Skills Knowledge
INSERT INTO knowledge_base (title, content, category, subcategory, tags, difficulty_level) VALUES
('Evaluación de Habilidades Blandas',
'Las habilidades blandas son competencias interpersonales y de autogestión cruciales para el éxito profesional:

**CATEGORÍAS PRINCIPALES:**

**1. COMUNICACIÓN:**
- **Verbal:** Claridad, persuasión, presentaciones efectivas
- **Escrita:** Emails profesionales, reportes, documentación
- **No verbal:** Lenguaje corporal, presencia, escucha activa
- **Evaluación:** Capacidad de adaptar mensaje según audiencia

**2. LIDERAZGO:**
- **Influencia:** Motivar e inspirar a otros sin autoridad formal
- **Toma de decisiones:** Análisis, evaluación de opciones, decisión oportuna
- **Delegación:** Asignar tareas efectivamente, empoderar al equipo
- **Visión:** Comunicar dirección clara y propósito compartido

**3. TRABAJO EN EQUIPO:**
- **Colaboración:** Trabajar efectivamente con diversos grupos
- **Resolución de conflictos:** Mediar diferencias constructivamente
- **Construcción de consenso:** Facilitar acuerdos grupales
- **Diversidad e inclusión:** Valorar y aprovechar diferencias

**4. ADAPTABILIDAD:**
- **Flexibilidad:** Ajustarse a cambios y nuevas situaciones
- **Aprendizaje continuo:** Adquirir nuevas habilidades proactivamente
- **Resiliencia:** Recuperarse de setbacks y mantener rendimiento
- **Innovación:** Generar ideas creativas y soluciones novedosas

**5. INTELIGENCIA EMOCIONAL:**
- **Autoconciencia:** Reconocer propias emociones y triggers
- **Autorregulación:** Manejar emociones bajo presión
- **Empatía:** Entender y responder a emociones de otros
- **Habilidades sociales:** Construir relaciones positivas

**6. GESTIÓN DEL TIEMPO:**
- **Priorización:** Identificar tareas más importantes/urgentes
- **Planificación:** Organizar trabajo y recursos efectivamente
- **Productividad:** Maximizar output manteniendo calidad
- **Balance:** Gestionar múltiples responsabilidades

**NIVELES DE COMPETENCIA:**

**Nivel 1 - Básico (0-40%):**
- Conciencia limitada de la habilidad
- Aplicación inconsistente
- Requiere supervisión y guía constante
- **Desarrollo:** Entrenamiento formal, mentoring intensivo

**Nivel 2 - Competente (41-70%):**
- Comprensión sólida de conceptos
- Aplicación regular con algunos errores
- Funciona independientemente en situaciones familiares
- **Desarrollo:** Práctica dirigida, feedback regular

**Nivel 3 - Avanzado (71-85%):**
- Dominio consistente de la habilidad
- Adapta enfoque según situación
- Puede enseñar y mentorear a otros
- **Desarrollo:** Proyectos desafiantes, roles de liderazgo

**Nivel 4 - Experto (86-100%):**
- Maestría excepcional y natural
- Innovación en aplicación de la habilidad
- Referente para otros en la organización
- **Desarrollo:** Roles estratégicos, consultoría externa

**ESTRATEGIAS DE DESARROLLO:**

**Para Comunicación:**
- Toastmasters o clubes de oratoria
- Práctica de presentaciones regulares
- Feedback 360° sobre estilo comunicativo
- Cursos de escritura profesional

**Para Liderazgo:**
- Liderar proyectos voluntarios
- Mentoring de colegas junior
- Programas de desarrollo de liderazgo
- Coaching ejecutivo

**Para Trabajo en Equipo:**
- Participar en equipos multifuncionales
- Facilitar reuniones y workshops
- Entrenamiento en resolución de conflictos
- Proyectos colaborativos internacionales

**Para Adaptabilidad:**
- Buscar asignaciones en nuevas áreas
- Aprender tecnologías emergentes
- Trabajar en proyectos de cambio organizacional
- Desarrollar mindset de crecimiento

**MEDICIÓN Y SEGUIMIENTO:**
- Evaluaciones 360° trimestrales
- Feedback de supervisores y pares
- Autoevaluación reflexiva regular
- Métricas de desempeño específicas por rol',
'soft-skills', 'fundamentals', ARRAY['habilidades-blandas', 'competencias', 'desarrollo', 'liderazgo'], 'beginner');

-- Career Development Knowledge
INSERT INTO knowledge_base (title, content, category, subcategory, tags, difficulty_level) VALUES
('Estrategias de Desarrollo de Carrera',
'Guía completa para planificar y ejecutar el desarrollo profesional:

**FASES DEL DESARROLLO DE CARRERA:**

**1. AUTOEVALUACIÓN (Meses 1-2):**
- **Tests psicométricos:** DISC, Big Five, MBTI, RIASEC, Habilidades Blandas
- **Inventario de fortalezas:** Identificar competencias naturales y desarrolladas
- **Análisis de valores:** Qué es importante en tu vida profesional y personal
- **Revisión de experiencias:** Patrones de éxito y satisfacción en roles anteriores

**2. EXPLORACIÓN (Meses 2-4):**
- **Investigación de mercado:** Tendencias, oportunidades, salarios por industria
- **Networking informativo:** Conversaciones con profesionales en áreas de interés
- **Shadowing profesional:** Observar día típico en roles objetivo
- **Análisis de brechas:** Diferencia entre perfil actual y requerimientos objetivo

**3. PLANIFICACIÓN (Mes 4-5):**
- **Objetivos SMART:** Específicos, medibles, alcanzables, relevantes, temporales
- **Plan de desarrollo:** Habilidades a desarrollar, experiencias a buscar
- **Timeline realista:** Hitos a 6 meses, 1 año, 3 años, 5 años
- **Plan de contingencia:** Alternativas si el plan principal no funciona

**4. EJECUCIÓN (Meses 6-36):**
- **Desarrollo de habilidades:** Cursos, certificaciones, práctica deliberada
- **Construcción de experiencia:** Proyectos, voluntariado, roles stretch
- **Networking estratégico:** Construir relaciones en industria objetivo
- **Marca personal:** LinkedIn, portfolio, presencia profesional

**5. EVALUACIÓN Y AJUSTE (Continuo):**
- **Revisión trimestral:** Progreso hacia objetivos, ajustes necesarios
- **Feedback regular:** Supervisores, mentores, pares sobre desarrollo
- **Métricas de progreso:** Habilidades adquiridas, experiencias ganadas
- **Pivoting estratégico:** Cambios basados en nuevas oportunidades o intereses

**ESTRATEGIAS POR ETAPA DE CARRERA:**

**EARLY CAREER (0-5 años):**
- **Enfoque:** Exploración amplia, desarrollo de habilidades fundamentales
- **Objetivos:** Identificar fortalezas, construir red profesional, ganar experiencia diversa
- **Acciones:** Rotaciones, mentoring, certificaciones básicas, proyectos cross-funcionales
- **Métricas:** Habilidades desarrolladas, feedback positivo, expansión de red

**MID CAREER (5-15 años):**
- **Enfoque:** Especialización estratégica, desarrollo de liderazgo
- **Objetivos:** Convertirse en experto, liderar equipos, impacto organizacional
- **Acciones:** MBA/especialización, liderazgo de proyectos, mentoring de otros
- **Métricas:** Promociones, reconocimiento de expertise, tamaño de equipo liderado

**SENIOR CAREER (15+ años):**
- **Enfoque:** Liderazgo estratégico, legado, desarrollo de otros
- **Objetivos:** Influencia organizacional, transformación, sucesión
- **Acciones:** Roles ejecutivos, board positions, speaking, consultoría
- **Métricas:** Impacto organizacional, reconocimiento industria, desarrollo de sucesores

**TRANSICIONES DE CARRERA:**

**Cambio de Función:**
- **Preparación:** 6-12 meses de desarrollo de habilidades específicas
- **Estrategia:** Proyectos bridge, roles híbridos, transferencia interna
- **Riesgos:** Pérdida de expertise, reducción temporal de compensación

**Cambio de Industria:**
- **Preparación:** 12-24 meses de inmersión en nueva industria
- **Estrategia:** Networking intensivo, consultoría, roles de entrada lateral
- **Riesgos:** Curva de aprendizaje pronunciada, competencia con nativos

**Emprendimiento:**
- **Preparación:** 18-36 meses de desarrollo de idea y recursos
- **Estrategia:** Validación de mercado, construcción de equipo, funding
- **Riesgos:** Inestabilidad financiera, alta tasa de fracaso

**HERRAMIENTAS DE DESARROLLO:**

**Formales:**
- **Educación:** MBA, maestrías especializadas, certificaciones profesionales
- **Programas corporativos:** Leadership development, high potential programs
- **Coaching:** Ejecutivo, de carrera, de habilidades específicas

**Informales:**
- **Mentoring:** Formal e informal, múltiples mentores por área
- **Networking:** Asociaciones profesionales, eventos industria, alumni networks
- **Experiencias stretch:** Proyectos desafiantes, asignaciones internacionales

**CONSTRUCCIÓN DE MARCA PERSONAL:**

**Online:**
- **LinkedIn optimizado:** Headline compelling, summary narrativo, contenido regular
- **Portfolio digital:** Proyectos, logros, testimoniales, casos de estudio
- **Thought leadership:** Artículos, posts, comentarios en temas de expertise

**Offline:**
- **Speaking:** Conferencias, paneles, workshops internos
- **Networking estratégico:** Eventos selectivos, one-on-ones, follow-ups consistentes
- **Mentoring visible:** Desarrollo de otros como parte de tu reputación

**MÉTRICAS DE ÉXITO:**

**Cuantitativas:**
- Incremento salarial anual (target: 5-15% dependiendo de nivel)
- Tiempo en promociones (target: 18-36 meses por nivel)
- Tamaño de red profesional (target: crecimiento 20% anual)
- Reconocimientos formales (awards, menciones, invitaciones)

**Cualitativas:**
- Satisfacción profesional y alineación con valores
- Balance vida-trabajo sostenible
- Impacto positivo en organización y comunidad
- Desarrollo y éxito de personas que has mentoreado

**ERRORES COMUNES A EVITAR:**
- Falta de planificación estratégica a largo plazo
- Enfoque excesivo en promociones vs desarrollo de habilidades
- Networking transaccional vs construcción de relaciones auténticas
- Resistencia al feedback y cambio
- Subestimar importancia de habilidades blandas',
'career', 'development', ARRAY['carrera', 'desarrollo', 'planificación', 'estrategia'], 'intermediate');

-- Platform and Methodology Knowledge
INSERT INTO knowledge_base (title, content, category, subcategory, tags, difficulty_level) VALUES
('Metodología y Algoritmos de la Plataforma',
'Explicación técnica de cómo funciona el cerebro de la plataforma:

**ARQUITECTURA DEL SISTEMA:**

**1. MOTOR DE EVALUACIÓN:**
- **Algoritmos adaptativos:** Ajustan dificultad según respuestas previas
- **Validación cruzada:** Preguntas de control para verificar consistencia
- **Normalización estadística:** Comparación con población de referencia
- **Detección de patrones:** Identificación de respuestas inconsistentes o aleatorias

**2. PROCESAMIENTO DE DATOS:**
- **Análisis multivariado:** Correlaciones entre diferentes dimensiones
- **Machine Learning:** Patrones de éxito profesional basados en perfiles similares
- **Validación científica:** Basado en investigación psicométrica peer-reviewed
- **Actualización continua:** Refinamiento de algoritmos con nuevos datos

**3. GENERACIÓN DE INSIGHTS:**
- **Análisis de brechas:** Comparación perfil actual vs roles objetivo
- **Predicción de éxito:** Probabilidad de éxito en diferentes carreras
- **Recomendaciones personalizadas:** Basadas en perfil único y objetivos
- **Planes de desarrollo:** Roadmaps específicos con timeline realista

**NIVELES DE CONFIANZA:**

**1. Datos de Entrada:**
- Completitud de respuestas: +/-20%
- Consistencia interna: +/-15%
- Tiempo de reflexión: +/-10%
- Validación cruzada: +/-25%

**2. Nivel de Confianza:**
- Tests completados: +20% por test
- Consistencia de respuestas: +/-15%
- Tiempo de reflexión: +/-10%
- Feedback histórico: +/-20%

**3. Priorización de Desarrollo:**
- Impacto en objetivos profesionales: 40%
- Facilidad de desarrollo: 30%
- Relevancia temporal: 20%
- Recursos disponibles: 10%

**Validación y Precisión:**
- **Validez de Constructo:** Tests basados en teorías validadas
- **Confiabilidad:** Consistencia interna > 0.85
- **Validez Predictiva:** Seguimiento de outcomes profesionales
- **Calibración Continua:** Ajustes basados en datos reales

**Privacidad y Seguridad:**
- Encriptación de datos personales
- Anonimización para análisis agregados
- Control total del usuario sobre sus datos
- Cumplimiento con regulaciones de privacidad

**Limitaciones y Consideraciones:**
- Los tests son herramientas, no verdades absolutas
- Resultados deben complementarse con reflexión personal
- Contexto cultural y personal es importante
- Evolución personal puede cambiar resultados',
'platform', 'methodology', ARRAY['metodología', 'algoritmos', 'ia', 'precisión'], 'advanced'),

('Estrategias de Mejora por Área',
'Guías específicas para desarrollar diferentes competencias profesionales:

**LIDERAZGO:**

**Nivel Básico (0-2 años experiencia):**
- **Autoconocimiento:** Completar evaluaciones de personalidad
- **Comunicación:** Practicar presentaciones y feedback
- **Influencia:** Liderar proyectos pequeños
- **Tiempo:** 3-6 meses de desarrollo intensivo

**Nivel Intermedio (2-5 años experiencia):**
- **Gestión de equipos:** Supervisar 2-5 personas
- **Toma de decisiones:** Casos complejos con múltiples variables
- **Desarrollo de otros:** Mentoría y coaching
- **Tiempo:** 6-12 meses de práctica estructurada

**Nivel Avanzado (5+ años experiencia):**
- **Liderazgo estratégico:** Visión organizacional
- **Gestión del cambio:** Transformaciones complejas
- **Liderazgo ejecutivo:** Influencia a nivel C-suite
- **Tiempo:** 1-2 años de desarrollo continuo

**COMUNICACIÓN:**

**Comunicación Verbal:**
- **Práctica diaria:** 15 minutos de presentaciones
- **Toastmasters:** Participación en club local
- **Feedback:** Grabarse y analizar mejoras
- **Coaching:** Sesiones con experto en comunicación

**Comunicación Escrita:**
- **Escritura diaria:** Blog, artículos, reportes
- **Cursos especializados:** Business writing
- **Herramientas:** Grammarly, Hemingway Editor
- **Práctica:** Diferentes formatos y audiencias

**Comunicación No Verbal:**
- **Conciencia corporal:** Postura, gestos, expresiones
- **Escucha activa:** Técnicas de parafraseo y clarificación
- **Presencia:** Desarrollo de carisma y autoridad
- **Práctica:** Role-playing y simulaciones

**TRABAJO EN EQUIPO:**

**Colaboración Efectiva:**
- **Herramientas digitales:** Slack, Asana, Miro
- **Metodologías ágiles:** Scrum, Kanban
- **Dinámicas de grupo:** Facilitación de reuniones
- **Resolución de conflictos:** Mediación y negociación

**Diversidad e Inclusión:**
- **Sesgo inconsciente:** Entrenamiento y conciencia
- **Comunicación intercultural:** Adaptación de estilos
- **Equipos remotos:** Herramientas y técnicas específicas
- **Liderazgo inclusivo:** Crear ambientes seguros

**INNOVACIÓN Y CREATIVIDAD:**

**Pensamiento Creativo:**
- **Técnicas:** Brainstorming, Design Thinking, SCAMPER
- **Exposición:** Arte, culturas diferentes, experiencias nuevas
- **Práctica:** Proyectos creativos regulares
- **Colaboración:** Equipos multidisciplinarios

**Implementación de Ideas:**
- **Prototipado rápido:** MVP, testing iterativo
- **Gestión de proyectos:** Metodologías ágiles
- **Comunicación de ideas:** Storytelling, visualización
- **Perseverancia:** Gestión de fracasos y pivoting

**GESTIÓN DEL TIEMPO:**

**Productividad Personal:**
- **Técnica Pomodoro:** Bloques de trabajo concentrado
- **GTD (Getting Things Done):** Sistema de organización
- **Time blocking:** Calendario estructurado
- **Eliminación:** Identificar y eliminar time wasters

**Priorización:**
- **Matriz Eisenhower:** Urgente vs Importante
- **Método ABCDE:** Clasificación por importancia
- **OKRs:** Objetivos y resultados clave
- **Review semanal:** Evaluación y ajuste de prioridades

**INTELIGENCIA EMOCIONAL:**

**Autoconciencia:**
- **Journaling:** Reflexión diaria sobre emociones
- **Mindfulness:** Meditación y atención plena
- **Feedback 360°:** Perspectivas múltiples
- **Assessment:** Tests de IE regulares

**Gestión Emocional:**
- **Técnicas de respiración:** Control del estrés
- **Reframing cognitivo:** Cambio de perspectiva
- **Ejercicio físico:** Regulación emocional
- **Apoyo profesional:** Coaching o terapia

**Empatía y Habilidades Sociales:**
- **Escucha activa:** Técnicas de comprensión profunda
- **Lectura emocional:** Interpretación de señales no verbales
- **Comunicación empática:** Validación y comprensión
- **Construcción de relaciones:** Networking auténtico

**Plan de Desarrollo Integrado:**
1. **Evaluación inicial:** Identificar 2-3 áreas prioritarias
2. **Plan específico:** Objetivos SMART por área
3. **Práctica deliberada:** 1 hora diaria de desarrollo
4. **Feedback regular:** Semanal de supervisores/pares
5. **Medición:** Evaluaciones trimestrales de progreso
6. **Ajuste:** Modificación basada en resultados',
'development', 'skills', ARRAY['mejora', 'habilidades', 'desarrollo', 'estrategias'], 'advanced');

-- Update search vectors for all records
UPDATE knowledge_base SET 
    search_vector = to_tsvector('spanish', title || ' ' || content),
    updated_at = CURRENT_TIMESTAMP;

-- Create user interaction tracking
CREATE TABLE IF NOT EXISTS ai_brain_interactions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    knowledge_used TEXT[],
    confidence_score INTEGER,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    is_saved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_brain_interactions_user ON ai_brain_interactions (user_email);
CREATE INDEX IF NOT EXISTS idx_ai_brain_interactions_created ON ai_brain_interactions (created_at);

-- Insert sample successful interactions
INSERT INTO ai_brain_interactions (user_email, query, response, knowledge_used, confidence_score, user_rating, is_saved) VALUES
('demo@example.com', '¿Qué significa mi puntuación alta en Dominancia DISC?', 'Una puntuación alta en Dominancia (D) indica que tienes características de liderazgo natural, orientación a resultados y tendencia a tomar decisiones rápidas. Esto sugiere que podrías destacar en roles como CEO, Director de Ventas o Emprendedor...', ARRAY['Fundamentos del Test DISC'], 92, 5, true),
('demo@example.com', '¿Cómo puedo desarrollar mis habilidades de comunicación?', 'Para desarrollar habilidades de comunicación, te recomiendo: 1) Práctica diaria de 15 minutos de presentaciones, 2) Unirte a Toastmasters, 3) Grabarte y analizar mejoras, 4) Buscar coaching especializado...', ARRAY['Estrategias de Mejora por Área'], 88, 4, true);

COMMIT;
