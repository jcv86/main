-- Agregar 22 libros más para llegar a 70 libros totales en la biblioteca
-- Libros 49-70 de desarrollo profesional (CORREGIDO Y COMPLETO)

INSERT INTO knowledge_base (title, author, category, content, tags, difficulty_level, estimated_read_time) VALUES

-- Libro 49: Innovación y Creatividad
('El Arte de la Innovación', 'Tom Kelley', 'Innovación', 
'La innovación no es un accidente, es el resultado de un proceso sistemático y una mentalidad específica. Tom Kelley, de IDEO, revela los secretos detrás de la innovación exitosa.

**Los Diez Rostros de la Innovación:**

1. **El Antropólogo**: Observa el comportamiento humano y desarrolla nuevas perspectivas.
2. **El Experimentador**: Prototipa nuevas ideas continuamente.
3. **El Polinizador Cruzado**: Explora otras industrias y culturas.
4. **El Saltador de Obstáculos**: Supera barreras que impiden la innovación.
5. **El Colaborador**: Reúne grupos diversos hacia soluciones creativas.

**Metodología de Innovación:**
La innovación requiere un enfoque estructurado que combine observación, ideación, prototipado e implementación.

**Herramientas Prácticas:**
- Mapeo de experiencia del usuario
- Sesiones de lluvia de ideas estructuradas  
- Prototipado rápido
- Storytelling para comunicar ideas

La innovación es tanto arte como ciencia, requiriendo creatividad disciplinada y ejecución sistemática.',
ARRAY['innovación', 'creatividad', 'diseño', 'IDEO', 'proceso creativo'], 'intermedio', 240),

-- Libro 50: Gestión de Proyectos
('Gestión de Proyectos en la Era Digital', 'Antonio Nieto-Rodriguez', 'Gestión de Proyectos',
'En la era digital, la gestión de proyectos ha evolucionado dramáticamente. Los métodos tradicionales deben adaptarse a la velocidad y complejidad del mundo moderno.

**Metodologías Híbridas:**
La combinación de enfoques tradicionales (Waterfall) con metodologías ágiles (Scrum, Kanban) permite mayor flexibilidad sin sacrificar control.

**Componentes Clave:**
1. Definición clara del alcance
2. Gestión de stakeholders
3. Planificación adaptativa
4. Gestión de riesgos proactiva
5. Comunicación digital

**Herramientas Digitales:**
- Plataformas de gestión (Asana, Monday, Jira)
- Herramientas de colaboración (Slack, Teams)
- Software de visualización (Tableau, Power BI)

La gestión exitosa requiere equilibrar agilidad con disciplina, innovación con control.',
ARRAY['gestión de proyectos', 'metodologías ágiles', 'transformación digital', 'liderazgo'], 'intermedio', 280),

-- Libro 51: Transformación Digital
('Transformación Digital: Estrategias para el Éxito', 'Michael Wade', 'Transformación Digital',
'La transformación digital no es solo sobre tecnología; es sobre reimaginar completamente cómo opera una organización.

**Los Cuatro Pilares:**
1. **Estrategia Digital**: Visión clara de cómo la tecnología creará valor
2. **Capacidades Digitales**: Habilidades técnicas y organizacionales necesarias
3. **Cultura Digital**: Mentalidad que abrace el cambio y experimentación
4. **Liderazgo Digital**: Líderes que naveguen complejidad y ambigüedad

**Fases de Transformación:**
- Digitalización: Convertir procesos analógicos en digitales
- Digitización: Usar datos para mejores decisiones
- Transformación: Reimaginar modelos de negocio

**Tecnologías Habilitadoras:**
- Inteligencia Artificial y Machine Learning
- Internet of Things (IoT)
- Cloud Computing
- Blockchain

La transformación digital es un viaje continuo de adaptación y evolución.',
ARRAY['transformación digital', 'estrategia digital', 'innovación', 'liderazgo'], 'avanzado', 320),

-- Libro 52: Marca Personal
('Marca Personal en la Era Digital', 'Andrés Pérez Ortega', 'Desarrollo Personal',
'En un mundo hiperconectado, tu marca personal es tu activo más valioso.

**Los 4 Pilares:**
1. **Autoconocimiento**: Identificar fortalezas y propósito único
2. **Diferenciación**: Propuesta de valor que te distinga
3. **Visibilidad**: Presencia estratégica en canales relevantes
4. **Credibilidad**: Reputación a través de resultados consistentes

**Proceso de Construcción:**
- Auditoría personal y análisis FODA
- Definición de posicionamiento
- Estrategia de contenido
- Presencia digital optimizada
- Networking estratégico

**Herramientas Digitales:**
- LinkedIn para networking profesional
- Twitter para thought leadership
- Medium para artículos
- YouTube para contenido audiovisual

Tu marca personal es tu legado profesional.',
ARRAY['marca personal', 'networking', 'LinkedIn', 'presencia digital'], 'intermedio', 260),

-- Libro 53: Networking Estratégico
('El Arte del Networking Estratégico', 'Keith Ferrazzi', 'Networking',
'El networking efectivo es sobre construir relaciones auténticas que generen valor mutuo.

**Principios Fundamentales:**
1. Mentalidad de generosidad
2. Autenticidad ante todo
3. Calidad sobre cantidad
4. Seguimiento sistemático

**Estrategias Efectivas:**
- Networking interno y externo
- La regla del 70/30 (escuchar/hablar)
- Preguntas poderosas
- LinkedIn estratégico

**Sistemas de Seguimiento:**
- CRM personal
- Calendario de networking
- Registro de interacciones

El networking es una inversión a largo plazo en tu carrera.',
ARRAY['networking', 'relaciones profesionales', 'LinkedIn', 'comunicación'], 'intermedio', 290),

-- Libro 54: Emprendimiento
('Lean Startup en Acción', 'Eric Ries', 'Emprendimiento',
'La metodología Lean Startup revoluciona cómo pensamos sobre innovación y emprendimiento.

**Los Tres Pilares:**
1. Build-Measure-Learn (Construir-Medir-Aprender)
2. Validated Learning (Aprendizaje Validado)
3. Innovation Accounting (Contabilidad de la Innovación)

**Tipos de MVP:**
- MVP de humo (smoke test)
- MVP concierge
- MVP mago de Oz
- MVP de funcionalidad única

**Métricas Clave:**
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate y retention
- Net Promoter Score (NPS)

La metodología Lean no es solo para startups; transforma cualquier organización.',
ARRAY['lean startup', 'emprendimiento', 'innovación', 'MVP'], 'intermedio', 310),

-- Libro 55: Gestión del Cambio
('Liderar el Cambio Organizacional', 'John Kotter', 'Gestión del Cambio',
'El cambio organizacional requiere un enfoque sistemático y liderazgo comprometido.

**Los 8 Pasos de Kotter:**
1. Crear sentido de urgencia
2. Formar coalición poderosa
3. Crear visión para el cambio
4. Comunicar la visión
5. Empoderar acción amplia
6. Generar triunfos a corto plazo
7. Consolidar ganancias
8. Anclar nuevos enfoques en cultura

**Superando Resistencia:**
- Comunicación transparente
- Participación e involucramiento
- Facilitación y apoyo
- Demostración de beneficios

El cambio exitoso requiere tanto gestión como liderazgo.',
ARRAY['gestión del cambio', 'liderazgo', 'transformación organizacional'], 'avanzado', 340),

-- Libro 56: Trabajo en Equipo
('Los Cinco Disfunciones de un Equipo', 'Patrick Lencioni', 'Trabajo en Equipo',
'Los equipos de alto rendimiento requieren trabajo intencional para superar disfunciones naturales.

**Las Cinco Disfunciones:**
1. Ausencia de confianza
2. Miedo al conflicto
3. Falta de compromiso
4. Evitar responsabilidad
5. Falta de atención a resultados

**Construyendo Equipos Cohesivos:**
- Ejercicios de construcción de confianza
- Herramientas para gestionar conflicto
- Técnicas de compromiso
- Sistemas de responsabilidad mutua

El trabajo en equipo efectivo es una ventaja competitiva rara.',
ARRAY['trabajo en equipo', 'liderazgo de equipos', 'confianza', 'responsabilidad'], 'intermedio', 300),

-- Libro 57: Resolución de Conflictos
('Negociación y Resolución de Conflictos', 'Roger Fisher', 'Comunicación',
'Los conflictos pueden convertirse en oportunidades de crecimiento con el manejo adecuado.

**Principios de Negociación:**
1. Separar personas del problema
2. Enfocarse en intereses, no posiciones
3. Generar opciones para beneficio mutuo
4. Usar criterios objetivos

**Tipos de Conflicto:**
- Conflicto de tareas
- Conflicto de procesos
- Conflicto de relaciones

**Estilos de Manejo:**
- Competir, colaborar, comprometer
- Evitar, acomodar

La resolución efectiva transforma tensiones en oportunidades.',
ARRAY['resolución de conflictos', 'negociación', 'comunicación', 'mediación'], 'intermedio', 320),

-- Libro 58: Toma de Decisiones
('Pensar Rápido, Pensar Despacio', 'Daniel Kahneman', 'Toma de Decisiones',
'Entender los dos sistemas de pensamiento es clave para mejorar nuestro juicio.

**Los Dos Sistemas:**
- Sistema 1: Rápido, automático, intuitivo
- Sistema 2: Lento, deliberativo, analítico

**Sesgos Cognitivos Comunes:**
- Sesgo de confirmación
- Sesgo de anclaje
- Sesgo de disponibilidad
- Exceso de confianza
- Aversión a la pérdida

**Marcos de Decisión:**
- Modelo DECIDE
- Análisis multicriterio
- Árbol de decisiones

La toma efectiva combina intuición con análisis riguroso.',
ARRAY['toma de decisiones', 'sesgos cognitivos', 'pensamiento crítico'], 'avanzado', 350),

-- Libro 59: Inteligencia Artificial
('IA y el Futuro del Trabajo', 'Kai-Fu Lee', 'Tecnología',
'La IA está transformando radicalmente el mundo del trabajo.

**Las Cuatro Olas de la IA:**
1. IA de Internet
2. IA de Negocios
3. IA de Percepción
4. IA Autónoma

**Impacto en el Trabajo:**
- Alto riesgo: Tareas rutinarias y repetitivas
- Riesgo medio: Roles que combinan rutina con creatividad
- Bajo riesgo: Creatividad, interacción humana compleja

**Habilidades Críticas:**
- Técnicas: Alfabetización digital, programación
- Humanas: Inteligencia emocional, creatividad
- Híbridas: Colaboración humano-IA

La clave es abrazar la colaboración humano-máquina.',
ARRAY['inteligencia artificial', 'futuro del trabajo', 'automatización'], 'avanzado', 380),

-- Libro 60: Productividad Personal
('Organízate con Eficacia (GTD)', 'David Allen', 'Productividad',
'GTD es una metodología completa para gestionar compromisos y liberar la mente.

**Los Cinco Pasos:**
1. Capturar: Recopilar todo en sistema externo
2. Clarificar: Procesar qué significa cada elemento
3. Organizar: Poner recordatorios en listas apropiadas
4. Reflexionar: Revisar frecuentemente el sistema
5. Comprometerse: Elegir acciones con confianza

**Listas Esenciales:**
- Próximas acciones por contexto
- Proyectos activos
- En espera
- Algún día/tal vez

GTD libera la mente para el trabajo creativo.',
ARRAY['productividad', 'GTD', 'organización personal', 'gestión del tiempo'], 'intermedio', 360),

-- Libro 61: Comunicación Efectiva
('Comunicación No Violenta', 'Marshall Rosenberg', 'Comunicación',
'La CNV ayuda a intercambiar información para resolver conflictos pacíficamente.

**Los Cuatro Componentes:**
1. Observación sin evaluación
2. Expresar sentimientos
3. Identificar necesidades
4. Hacer peticiones específicas

**Aplicaciones:**
- Resolución de conflictos laborales
- Feedback constructivo
- Negociaciones
- Liderazgo empático

La CNV es una forma de vida basada en compasión y respeto.',
ARRAY['comunicación no violenta', 'empatía', 'resolución de conflictos'], 'intermedio', 340),

-- Libro 62: Mindfulness y Bienestar
('Mindfulness en el Trabajo', 'Jon Kabat-Zinn', 'Bienestar',
'El mindfulness mejora rendimiento, reduce estrés y aumenta satisfacción laboral.

**Beneficios:**
- Cognitivos: Mejor concentración y claridad
- Emocionales: Reducción de estrés y ansiedad
- Interpersonales: Mejor comunicación y empatía
- Físicos: Mejor salud y energía

**Prácticas para el Trabajo:**
- Meditación de respiración
- Body scan rápido
- Mindful walking
- Pausas mindful

El mindfulness es compromiso total con la realidad presente.',
ARRAY['mindfulness', 'bienestar laboral', 'meditación', 'estrés'], 'intermedio', 380),

-- Libro 63: Finanzas Personales
('Padre Rico, Padre Pobre', 'Robert Kiyosaki', 'Finanzas Personales',
'Las diferencias en mentalidad financiera determinan si construimos riqueza.

**Lecciones Clave:**
1. Los ricos no trabajan por dinero
2. Importancia de alfabetización financiera
3. Ocúpate de tu propio negocio
4. Poder de las corporaciones
5. Los ricos inventan el dinero
6. Trabaja para aprender

**Activos vs Pasivos:**
- Activos: Ponen dinero en tu bolsillo
- Pasivos: Sacan dinero de tu bolsillo

La educación financiera es fundamental para la libertad.',
ARRAY['finanzas personales', 'inversión', 'activos', 'libertad financiera'], 'intermedio', 400),

-- Libro 64: Sostenibilidad
('Capitalismo Consciente', 'John Mackey', 'Sostenibilidad',
'El capitalismo consciente beneficia a todos los stakeholders, no solo accionistas.

**Los Cuatro Pilares:**
1. Propósito superior
2. Orientación a stakeholders
3. Liderazgo consciente
4. Cultura y gestión conscientes

**Beneficios:**
- Para empresas: Mayor engagement y reputación
- Para empleados: Mayor propósito y crecimiento
- Para sociedad: Soluciones a problemas sociales

El capitalismo consciente es una estrategia superior de negocio.',
ARRAY['capitalismo consciente', 'sostenibilidad', 'responsabilidad social'], 'avanzado', 420),

-- Libro 65: Diversidad e Inclusión
('El Poder de la Diferencia', 'Scott Page', 'Diversidad e Inclusión',
'La diversidad es matemáticamente superior para resolver problemas complejos.

**Beneficios de la Diversidad:**
1. Mejor resolución de problemas
2. Mayor innovación
3. Mejor predicción
4. Verificación robusta

**Construyendo Equipos Diversos:**
- Reclutamiento inclusivo
- Proceso de selección objetivo
- Onboarding inclusivo
- Desarrollo equitativo de carrera

La diversidad es un imperativo estratégico para el éxito.',
ARRAY['diversidad', 'inclusión', 'equipos diversos', 'cultura inclusiva'], 'avanzado', 440),

-- Libro 66: Ética Empresarial
('Ética en los Negocios', 'Laura Hartman', 'Ética Empresarial',
'La ética empresarial es fundamental para la sostenibilidad organizacional.

**Componentes Clave:**
- Integridad, transparencia, responsabilidad
- Respeto, justicia

**Implementando Ética:**
1. Evaluación ética
2. Desarrollo de código de ética
3. Capacitación y comunicación
4. Sistemas de reporte
5. Monitoreo y mejora

La ética no es sobre perfección; es sobre compromiso continuo.',
ARRAY['ética empresarial', 'integridad', 'responsabilidad social'], 'avanzado', 460),

-- Libro 67: Negocios Internacionales
('El Mundo es Plano', 'Thomas Friedman', 'Negocios Internacionales',
'La globalización ha creado un campo de juego nivelado mundial.

**Las Diez Fuerzas Aplanadoras:**
1. Caída del Muro de Berlín
2. Netscape sale a bolsa
3. Software de flujo de trabajo
4. Código abierto
5. Outsourcing

**Competencias Globales:**
- Técnicas: Alfabetización digital
- Culturales: Inteligencia cultural
- Liderazgo: Visión global

En un mundo plano, el éxito depende de colaboración e innovación global.',
ARRAY['globalización', 'negocios internacionales', 'competencia global'], 'avanzado', 480),

-- Libro 68: Pensamiento Sistémico
('La Quinta Disciplina', 'Peter Senge', 'Pensamiento Sistémico',
'El pensamiento sistémico nos permite ver patrones completos en lugar de eventos aislados.

**Las Cinco Disciplinas:**
1. Dominio personal
2. Modelos mentales
3. Visión compartida
4. Aprendizaje en equipo
5. Pensamiento sistémico

**Arquetipos Sistémicos:**
- Límites del crecimiento
- Desplazamiento de la carga
- Erosión de metas

El pensamiento sistémico integra todas las demás disciplinas.',
ARRAY['pensamiento sistémico', 'organizaciones que aprenden', 'complejidad'], 'avanzado', 500),

-- Libro 69: Resiliencia Organizacional
('Antifrágil', 'Nassim Nicholas Taleb', 'Resiliencia',
'Las organizaciones antifrágiles se fortalecen con volatilidad y estrés.

**Los Tres Estados:**
1. Frágil: Se daña con volatilidad
2. Resiliente: Resiste volatilidad
3. Antifrágil: Se beneficia de volatilidad

**Principios de Antifragilidad:**
- Optionalidad
- Sobrecompensación
- Vía negativa
- Piel en el juego

La antifragilidad es necesaria para supervivencia organizacional.',
ARRAY['antifragilidad', 'resiliencia organizacional', 'adaptabilidad'], 'avanzado', 520),

-- Libro 70: Futuro del Trabajo
('El Futuro del Trabajo', 'Jacob Morgan', 'Futuro del Trabajo',
'El trabajo experimenta la transformación más radical de la historia.

**Fuerzas Transformadoras:**
- Tecnológicas: IA, automatización, VR/AR
- Sociales: Cambios generacionales, nuevas expectativas
- Económicas: Economía gig, globalización digital
- Ambientales: Sostenibilidad, trabajo remoto

**El Empleado del Futuro:**
- Adaptabilidad y curiosidad
- Resiliencia y colaboración
- Pensamiento crítico

**Habilidades Esenciales:**
- Técnicas: Alfabetización digital, análisis de datos
- Humanas: Inteligencia emocional, creatividad
- Híbridas: Colaboración humano-IA

El futuro del trabajo requiere aprendizaje continuo y adaptabilidad.',
ARRAY['futuro del trabajo', 'transformación laboral', 'habilidades digitales'], 'avanzado', 540);

-- Verificar que se insertaron correctamente
SELECT 'Libros agregados exitosamente' as status, COUNT(*) as total_libros 
FROM knowledge_base 
WHERE title IN (
    'El Arte de la Innovación',
    'Gestión de Proyectos en la Era Digital',
    'Transformación Digital: Estrategias para el Éxito',
    'Marca Personal en la Era Digital',
    'El Arte del Networking Estratégico',
    'Lean Startup en Acción',
    'Liderar el Cambio Organizacional',
    'Los Cinco Disfunciones de un Equipo',
    'Negociación y Resolución de Conflictos',
    'Pensar Rápido, Pensar Despacio',
    'IA y el Futuro del Trabajo',
    'Organízate con Eficacia (GTD)',
    'Comunicación No Violenta',
    'Mindfulness en el Trabajo',
    'Padre Rico, Padre Pobre',
    'Capitalismo Consciente',
    'El Poder de la Diferencia',
    'Ética en los Negocios',
    'El Mundo es Plano',
    'La Quinta Disciplina',
    'Antifrágil',
    'El Futuro del Trabajo'
);

-- Mostrar total de libros en la biblioteca
SELECT 'Total de libros en biblioteca:' as info, COUNT(*) as total FROM knowledge_base;
