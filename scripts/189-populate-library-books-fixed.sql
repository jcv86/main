-- Poblar con libros profesionales reales completos (versión corregida)
-- Populate with complete real professional books (fixed version)

-- 1. Limpiar datos existentes para empezar fresco
DELETE FROM user_reading_progress WHERE user_email = 'demo@example.com';
DELETE FROM user_bookmarks WHERE user_email = 'demo@example.com';
DELETE FROM reading_sessions WHERE user_email = 'demo@example.com';
DELETE FROM book_reviews WHERE user_email = 'demo@example.com';
DELETE FROM reading_goals WHERE user_email = 'demo@example.com';
DELETE FROM knowledge_base;

-- 2. Insertar libros profesionales completos con contenido real
INSERT INTO knowledge_base (title, category, content, author, tags, slug, read_count) VALUES 

-- LIBRO 1: Los 7 Hábitos de la Gente Altamente Efectiva
('Los 7 Hábitos de la Gente Altamente Efectiva', 'Liderazgo', 
'Stephen Covey presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales. Los siete hábitos representan un enfoque secuencial de crecimiento personal y interpersonal que nos lleva de la dependencia a la independencia y de la independencia a la interdependencia.

HÁBITO 1: SER PROACTIVO
La proactividad significa que, como seres humanos, somos responsables de nuestras propias vidas. Nuestro comportamiento es una función de nuestras decisiones, no de nuestras condiciones. Tenemos la iniciativa y la responsabilidad de hacer que las cosas sucedan.

Las personas reactivas se ven afectadas por el ambiente físico. Si el tiempo es bueno, se sienten bien. Si no lo es, afecta su actitud y su comportamiento. Las personas proactivas llevan su propio clima con ellas. Llueva o haga sol no les importa. Su fuerza motriz son los valores, y si su valor es hacer un trabajo de calidad, no depende de que haga buen tiempo o no.

HÁBITO 2: EMPEZAR CON UN FIN EN MENTE
Este hábito se basa en el principio de que todas las cosas se crean dos veces. Hay una creación mental (primera) y una creación física (segunda). La creación física sigue a la creación mental, de la misma manera que un edificio sigue a un plano.

Si no desarrollas tu propio diseño de vida, te adaptas a los planes de otras personas y puede que no respondan a tus prioridades. Empezar con un fin en mente significa comenzar con una clara comprensión de tu destino. Significa saber adónde vas, de modo que puedas comprender mejor dónde estás ahora y dar siempre los pasos adecuados en la dirección correcta.

HÁBITO 3: ESTABLECER PRIMERO LO PRIMERO
El Hábito 3 es la realización práctica de los Hábitos 1 y 2. El Hábito 1 dice: "Tú eres el creador. Tú tienes la responsabilidad." El Hábito 2 es la primera creación mental: "Empieza con un fin en mente." El Hábito 3 es la segunda creación, la creación física. Es la realización, la actualización, la aparición natural de los Hábitos 1 y 2.

La administración efectiva es poner primero lo primero. Mientras el liderazgo decide qué es "primero", la administración lo pone primero, día a día, momento a momento. La administración es disciplina, ejecución.

HÁBITO 4: PENSAR EN GANAR-GANAR
Ganar-Ganar es una estructura de la mente y el corazón que constantemente procura el beneficio mutuo en todas las interacciones humanas. Ganar-Ganar significa que los acuerdos o soluciones son mutuamente benéficos, mutuamente satisfactorios.

Con una solución de Ganar-Ganar todas las partes se sienten bien por la decisión y se comprometen con el plan de acción. Ganar-Ganar ve la vida como un escenario cooperativo, no competitivo. La mayoría de las personas tiende a pensar en términos de dicotomías: fuerte o débil, rudo o suave, ganar o perder. Pero ese pensamiento es fundamentalmente defectuoso.

HÁBITO 5: PROCURAR PRIMERO ENTENDER, LUEGO SER ENTENDIDO
Este principio es la clave de la comunicación interpersonal efectiva. Supongamos que vas al oculista y le dices: "Doctor, tengo problemas con los ojos. ¿Puede ayudarme?" Él se quita los anteojos y te los da diciendo: "Póntelos. Los he usado durante diez años y realmente me han dado resultado."

Te pones los anteojos, pero ahora ves peor. "¡Esto es terrible!", exclamas. "¡No puedo ver nada!" "Bueno, ¿qué pasa contigo? A mí me funcionan muy bien. Ponte una actitud positiva."

HÁBITO 6: LA SINERGIA
Sinergia significa que el todo es más que la suma de sus partes. Significa que la relación que las partes tienen entre sí es una parte en sí misma. Y no sólo una parte, sino la más catalizadora, la que genera más poder, la más unificadora y la más estimulante.

La esencia de la sinergia consiste en valorar las diferencias: respetarlas, compensar las debilidades, construir sobre las fortalezas. Va más allá de la transacción. Es transformación. Crea algo nuevo.

HÁBITO 7: AFILAR LA SIERRA
El Hábito 7 es renovación personal. Es preservar y realzar el mayor bien que posees: tú mismo. Es renovar las cuatro dimensiones de tu naturaleza: la física, la espiritual, la mental y la social/emocional.',
'Stephen R. Covey',
ARRAY['liderazgo', 'desarrollo personal', 'productividad', 'hábitos', 'efectividad'],
'siete-habitos-gente-altamente-efectiva',
342
),

-- LIBRO 2: Comunicación No Violenta
('Comunicación No Violenta', 'Comunicación',
'Marshall Rosenberg desarrolló la Comunicación No Violenta (CNV) como un proceso de comunicación que ayuda a las personas a intercambiar la información necesaria para resolver conflictos y diferencias pacíficamente. La CNV se basa en la idea de que todos los seres humanos tienen la capacidad de compasión y recurren a la violencia o comportamiento dañino solo cuando no reconocen estrategias más efectivas para satisfacer sus necesidades.

LOS CUATRO COMPONENTES DE LA COMUNICACIÓN NO VIOLENTA

COMPONENTE 1: OBSERVACIÓN SIN EVALUACIÓN
El primer componente de la CNV implica separar la observación de la evaluación. Cuando combinamos observación con evaluación, las personas tienden a escuchar crítica y resistir lo que estamos diciendo.

Observación: "Juan llegó tarde a las últimas tres reuniones."
Evaluación mezclada con observación: "Juan siempre llega tarde a las reuniones."

La diferencia es crucial. La primera es un hecho verificable, la segunda es una generalización que puede generar defensividad.

COMPONENTE 2: EXPRESAR SENTIMIENTOS
El segundo componente implica expresar cómo nos sentimos en relación con lo que observamos. Desarrollar un vocabulario emocional nos ayuda a conectar más claramente y específicamente con nosotros mismos y otros.

Sentimientos cuando las necesidades están satisfechas:
- Alegre, agradecido, esperanzado, inspirado, intrigado, radiante, relajado, aliviado, satisfecho, conmovido

Sentimientos cuando las necesidades no están satisfechas:
- Enojado, molesto, desalentado, decepcionado, disgustado, inquieto, frustrado, desesperanzado, irritado, solitario

COMPONENTE 3: ASUMIR RESPONSABILIDAD POR NUESTROS SENTIMIENTOS
El tercer componente es reconocer las necesidades, valores, deseos, etc., que están creando nuestros sentimientos. Cuando expresamos nuestras necesidades indirectamente a través de evaluaciones, interpretaciones e imágenes, es probable que las personas escuchen crítica.

Las necesidades humanas universales incluyen:
- Autonomía: elegir nuestros propios sueños, objetivos, valores
- Celebración: celebrar la creación de la vida y los sueños cumplidos
- Integridad: autenticidad, creatividad, significado, autoestima
- Interdependencia: aceptación, aprecio, cercanía, comunidad, consideración
- Juego: diversión, risa
- Comunión espiritual: belleza, armonía, inspiración, orden, paz
- Sustento físico: aire, comida, movimiento, descanso, expresión sexual, refugio, tacto, agua

COMPONENTE 4: HACER PETICIONES ESPECÍFICAS
El cuarto componente aborda qué nos gustaría que la otra persona haga para enriquecer nuestras vidas. Tratamos de evitar lenguaje vago, abstracto o ambiguo, y recordamos que una petición específica nos dice qué acciones queremos que tome la persona.

Petición vaga: "Me gustaría que fueras más responsable."
Petición específica: "Me gustaría que llegues a tiempo a nuestras reuniones programadas."

APLICACIONES PRÁCTICAS DE LA CNV

EN EL LUGAR DE TRABAJO
- Dar retroalimentación constructiva
- Resolver conflictos entre colegas
- Mejorar la comunicación en equipos
- Manejar conversaciones difíciles con supervisores

EN RELACIONES PERSONALES
- Expresar necesidades sin culpar
- Escuchar empáticamente durante conflictos
- Criar hijos con compasión
- Fortalecer la intimidad y conexión',
'Marshall B. Rosenberg',
ARRAY['comunicación', 'resolución de conflictos', 'empatía', 'relaciones interpersonales', 'no violencia'],
'comunicacion-no-violenta',
189
),

-- LIBRO 3: Mindset: La Actitud del Éxito
('Mindset: La Actitud del Éxito', 'Desarrollo Personal',
'Carol Dweck presenta una investigación revolucionaria sobre la motivación y el aprendizaje, revelando el poder de nuestras creencias para influir en nuestro éxito. Su trabajo sobre mentalidades fijas versus mentalidades de crecimiento ha transformado la forma en que entendemos el talento, el esfuerzo y el logro.

LA MENTALIDAD FIJA VS. LA MENTALIDAD DE CRECIMIENTO

MENTALIDAD FIJA
Las personas con mentalidad fija creen que sus cualidades básicas, como su inteligencia o talento, son simplemente rasgos fijos. Pasan su tiempo documentando su inteligencia o talento en lugar de desarrollarlos.

Características de la mentalidad fija:
- Creen que el talento es innato e inmutable
- Evitan desafíos para proteger su imagen
- Se rinden fácilmente ante obstáculos
- Ven el esfuerzo como signo de debilidad
- Ignoran retroalimentación negativa útil
- Se sienten amenazados por el éxito de otros

MENTALIDAD DE CRECIMIENTO
Las personas con mentalidad de crecimiento creen que sus habilidades más básicas pueden desarrollarse a través de dedicación y trabajo duro. El cerebro y el talento son solo el punto de partida.

Características de la mentalidad de crecimiento:
- Creen que las habilidades pueden desarrollarse
- Abrazan desafíos como oportunidades
- Persisten ante obstáculos
- Ven el esfuerzo como el camino al dominio
- Aprenden de críticas y fracasos
- Se inspiran en el éxito de otros

EL PODER DE "TODAVÍA"

Una palabra simple puede transformar la mentalidad: "todavía".

En lugar de: "No puedo hacer esto"
Di: "No puedo hacer esto todavía"

En lugar de: "No soy bueno en esto"
Di: "No soy bueno en esto todavía"

Esta pequeña palabra implica que el aprendizaje y la mejora son posibles con tiempo y esfuerzo.

DESARROLLANDO UNA MENTALIDAD DE CRECIMIENTO

RECONOCE TU MENTALIDAD ACTUAL
- Observa tus reacciones ante desafíos
- Nota cómo respondes a la crítica
- Examina tus creencias sobre el talento y la habilidad
- Identifica áreas donde tienes mentalidad fija

CAMBIA TU DIÁLOGO INTERNO
Mentalidad fija: "Soy terrible en esto"
Mentalidad de crecimiento: "Estoy mejorando en esto"

Mentalidad fija: "No puedo hacer esto"
Mentalidad de crecimiento: "No puedo hacer esto todavía"

ABRAZA LOS DESAFÍOS
- Busca activamente tareas que te saquen de tu zona de confort
- Ve los obstáculos como puzzles a resolver
- Celebra el esfuerzo tanto como los resultados
- Aprende de cada experiencia, exitosa o no',
'Carol S. Dweck',
ARRAY['desarrollo personal', 'psicología', 'mentalidad', 'crecimiento', 'motivación'],
'mindset-actitud-del-exito',
312
),

-- LIBRO 4: Organízate con Eficacia (Getting Things Done)
('Organízate con Eficacia (Getting Things Done)', 'Productividad',
'David Allen presenta el sistema GTD (Getting Things Done), una metodología completa para la gestión de tareas y proyectos que ha revolucionado la productividad personal y profesional. El sistema se basa en liberar la mente de tener que recordar todo, capturando y organizando todas las tareas en un sistema confiable.

LOS PRINCIPIOS FUNDAMENTALES DE GTD

EL PROBLEMA DE LA MENTE COMO SISTEMA DE RECORDATORIO
Tu mente está diseñada para tener ideas, no para almacenarlas. Cuando usas tu mente para recordar tareas, proyectos y compromisos, experimentas estrés y reduces tu capacidad de pensar creativamente.

LA ECUACIÓN DE LA PRODUCTIVIDAD SIN ESTRÉS
La productividad sin estrés se logra cuando tienes:
1. Un inventario completo de todo lo que necesitas hacer
2. Un sistema confiable para procesarlo
3. Herramientas apropiadas para organizarlo
4. Revisiones regulares para mantenerlo actualizado

LOS CINCO PASOS DEL FLUJO DE TRABAJO GTD

PASO 1: CAPTURAR
Recolecta todo lo que llama tu atención en bandejas de entrada confiables, fuera de tu mente.

Herramientas de captura:
- Bandeja de entrada física
- Aplicaciones digitales (correo, notas)
- Grabadora de voz
- Libreta de bolsillo
- Smartphone

PASO 2: ACLARAR
Procesa lo que significa cada elemento y qué acción requiere, si es que requiere alguna.

El algoritmo de procesamiento:
1. ¿Qué es esto?
2. ¿Es accionable?
   - Si NO: Eliminar, incubar para más tarde, o archivar como referencia
   - Si SÍ: ¿Cuál es la siguiente acción?
     - Si toma menos de 2 minutos: Hazlo ahora
     - Si toma más de 2 minutos: Delégalo o aplázalo

PASO 3: ORGANIZAR
Pon los recordatorios de tus proyectos y siguientes acciones en las categorías apropiadas.

Las listas esenciales de GTD:
- Proyectos: Lista de todos los proyectos (resultados que requieren más de una acción)
- Siguientes Acciones: Organizadas por contexto (@llamadas, @computadora, @recados)
- En Espera: Cosas que estás esperando de otros
- Algún Día/Tal Vez: Ideas que podrías querer hacer en el futuro
- Calendario: Solo para citas con fecha y hora específicas

PASO 4: REFLEXIONAR
Revisa frecuentemente y actualiza tu sistema para recuperar control y enfoque.

La Revisión Semanal:
- Recolecta y procesa todas las bandejas de entrada
- Revisa tu calendario de la semana pasada y próxima
- Revisa todas las listas de proyectos y siguientes acciones
- Actualiza listas según sea necesario

PASO 5: COMPROMETERSE
Simplemente haz. Usa tu sistema para tomar decisiones de acción con confianza.',
'David Allen',
ARRAY['productividad', 'organización', 'gestión del tiempo', 'sistemas', 'GTD'],
'organizate-con-eficacia-gtd',
298
),

-- LIBRO 5: Las Cinco Disfunciones de un Equipo
('Las Cinco Disfunciones de un Equipo', 'Gestión de Equipos',
'Patrick Lencioni presenta un modelo poderoso y accesible para entender y superar los obstáculos que impiden que los equipos alcancen su máximo potencial. A través de una fábula empresarial, identifica las cinco disfunciones que destruyen el trabajo en equipo y proporciona herramientas prácticas para construir equipos cohesivos.

LAS CINCO DISFUNCIONES: UNA PIRÁMIDE

DISFUNCIÓN 1: AUSENCIA DE CONFIANZA (BASE DE LA PIRÁMIDE)

QUÉ ES LA CONFIANZA EN EQUIPOS
La confianza en equipos no es la capacidad de predecir el comportamiento de un compañero de equipo basándose en experiencias pasadas. Es la confianza de que las intenciones de los compañeros son buenas y que no hay razón para ser protector o cuidadoso en el grupo.

CARACTERÍSTICAS DE EQUIPOS SIN CONFIANZA
- Los miembros ocultan sus debilidades y errores
- Dudan en pedir ayuda o dar retroalimentación constructiva
- Dudan en ofrecer ayuda fuera de sus áreas de responsabilidad
- Saltan a conclusiones sobre las intenciones y aptitudes de otros
- No reconocen ni aprovechan las habilidades y experiencias de otros
- Pierden tiempo y energía manejando comportamientos para obtener efecto
- Guardan rencores
- Temen las reuniones y encuentran razones para evitar pasar tiempo juntos

CONSTRUYENDO CONFIANZA
Ejercicio de Historias Personales: Cada miembro comparte información personal sobre su infancia, desafíos, pasatiempos, etc.

Ejercicio de Efectividad del Equipo: Cada miembro identifica la contribución más importante que hace cada uno de sus compañeros al equipo, así como un área que debe mejorar o eliminar.

DISFUNCIÓN 2: MIEDO AL CONFLICTO

ENTENDIENDO EL CONFLICTO PRODUCTIVO
Los equipos que carecen de confianza son incapaces de participar en debates apasionados e sin filtros sobre ideas clave. En su lugar, recurren a discusiones veladas y comentarios cuidadosos.

CONFLICTO PRODUCTIVO VS. DESTRUCTIVO
Conflicto Productivo:
- Se enfoca en conceptos e ideas
- Es apasionado pero no personal
- Busca la mejor solución
- Todos participan abiertamente
- Se resuelve rápidamente

Conflicto Destructivo:
- Se enfoca en personalidades
- Incluye ataques personales
- Busca ganar a toda costa
- Algunos se retiran o atacan
- Crea resentimientos duraderos

DISFUNCIÓN 3: FALTA DE COMPROMISO

LA NATURALEZA DEL COMPROMISO
El compromiso es una función de claridad y buy-in. Los grandes equipos se aseguran de que todos estén de acuerdo con las decisiones, aunque inicialmente no estuvieran de acuerdo.

DOS CAUSAS PRINCIPALES DE FALTA DE COMPROMISO
1. Deseo de consenso: Esperar que todos estén de acuerdo antes de avanzar
2. Necesidad de certeza: Esperar tener toda la información antes de tomar decisiones

DISFUNCIÓN 4: EVITAR LA RESPONSABILIDAD

DEFINIENDO LA RESPONSABILIDAD
La responsabilidad se refiere específicamente a la disposición de los miembros del equipo de llamar la atención sobre el rendimiento o comportamiento de sus pares que puede dañar al equipo.

DISFUNCIÓN 5: FALTA DE ATENCIÓN A LOS RESULTADOS

QUÉ SON LOS RESULTADOS
Los resultados se refieren a los objetivos colectivos del equipo, no a los objetivos individuales de los miembros.',
'Patrick Lencioni',
ARRAY['gestión de equipos', 'liderazgo', 'trabajo en equipo', 'disfunciones', 'confianza'],
'cinco-disfunciones-equipo',
356
);

-- 3. Insertar progreso de lectura para el usuario demo
INSERT INTO user_reading_progress (user_email, book_id, reading_progress, target_percentage, status, notes, reading_time_minutes, started_at, last_read_at)
SELECT 
    'demo@example.com',
    kb.id,
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN 75
        WHEN kb.slug = 'comunicacion-no-violenta' THEN 45
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN 30
        WHEN kb.slug = 'organizate-con-eficacia-gtd' THEN 60
        WHEN kb.slug = 'cinco-disfunciones-equipo' THEN 20
    END,
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN 100
        WHEN kb.slug = 'comunicacion-no-violenta' THEN 60
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN 100
        WHEN kb.slug = 'organizate-con-eficacia-gtd' THEN 100
        WHEN kb.slug = 'cinco-disfunciones-equipo' THEN 30
    END,
    'reading',
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN 'Excelente libro sobre principios fundamentales. Los 7 hábitos son muy aplicables en el trabajo diario.'
        WHEN kb.slug = 'comunicacion-no-violenta' THEN 'Técnicas muy útiles para mejorar la comunicación. Los 4 componentes son fáciles de recordar.'
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN 'Cambió mi perspectiva sobre el aprendizaje. El concepto de "todavía" es poderoso.'
        WHEN kb.slug = 'organizate-con-eficacia-gtd' THEN 'Sistema muy completo para organización. La revisión semanal es clave.'
        WHEN kb.slug = 'cinco-disfunciones-equipo' THEN 'Muy relevante para mi equipo actual. Las 5 disfunciones son muy claras.'
    END,
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN 240
        WHEN kb.slug = 'comunicacion-no-violenta' THEN 135
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN 90
        WHEN kb.slug = 'organizate-con-eficacia-gtd' THEN 180
        WHEN kb.slug = 'cinco-disfunciones-equipo' THEN 60
    END,
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN NOW() - INTERVAL '7 days'
        WHEN kb.slug = 'comunicacion-no-violenta' THEN NOW() - INTERVAL '5 days'
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN NOW() - INTERVAL '3 days'
        WHEN kb.slug = 'organizate-con-eficacia-gtd' THEN NOW() - INTERVAL '2 days'
        WHEN kb.slug = 'cinco-disfunciones-equipo' THEN NOW() - INTERVAL '1 day'
    END,
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN NOW() - INTERVAL '2 days'
        WHEN kb.slug = 'comunicacion-no-violenta' THEN NOW() - INTERVAL '1 day'
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN NOW() - INTERVAL '8 hours'
        WHEN kb.slug = 'organizate-con-eficacia-gtd' THEN NOW() - INTERVAL '4 hours'
        WHEN kb.slug = 'cinco-disfunciones-equipo' THEN NOW() - INTERVAL '2 hours'
    END
FROM knowledge_base kb
WHERE kb.slug IN ('siete-habitos-gente-altamente-efectiva', 'comunicacion-no-violenta', 'mindset-actitud-del-exito', 'organizate-con-eficacia-gtd', 'cinco-disfunciones-equipo');

-- 4. Insertar bookmarks
INSERT INTO user_bookmarks (user_email, book_id, bookmark_note)
SELECT 
    'demo@example.com',
    kb.id,
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN 'Los 7 hábitos son fundamentales - revisar regularmente'
        WHEN kb.slug = 'comunicacion-no-violenta' THEN 'Los 4 componentes de CNV - muy útil para reuniones difíciles'
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN 'El poder de "todavía" - aplicar en mi desarrollo profesional'
    END
FROM knowledge_base kb
WHERE kb.slug IN ('siete-habitos-gente-altamente-efectiva', 'comunicacion-no-violenta', 'mindset-actitud-del-exito');

-- 5. Insertar objetivos de lectura
INSERT INTO reading_goals (user_email, goal_type, target_value, current_value, period_start, period_end, status) VALUES
('demo@example.com', 'books_completed', 10, 0, '2025-01-01', '2025-12-31', 'active'),
('demo@example.com', 'reading_time_hours', 80, 12, '2025-01-01', '2025-12-31', 'active'),
('demo@example.com', 'categories_explored', 5, 4, '2025-01-01', '2025-12-31', 'active');

-- 6. Insertar sesiones de lectura
INSERT INTO reading_sessions (user_email, book_id, session_start, session_end, duration_minutes, progress_start, progress_end, pages_read)
SELECT 
    'demo@example.com',
    kb.id,
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN NOW() - INTERVAL '3 hours'
        WHEN kb.slug = 'comunicacion-no-violenta' THEN NOW() - INTERVAL '5 hours'
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN NOW() - INTERVAL '8 hours'
    END,
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN NOW() - INTERVAL '2 hours'
        WHEN kb.slug = 'comunicacion-no-violenta' THEN NOW() - INTERVAL '4 hours'
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN NOW() - INTERVAL '7 hours'
    END,
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN 60
        WHEN kb.slug = 'comunicacion-no-violenta' THEN 45
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN 30
    END,
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN 70
        WHEN kb.slug = 'comunicacion-no-violenta' THEN 40
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN 25
    END,
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN 75
        WHEN kb.slug = 'comunicacion-no-violenta' THEN 45
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN 30
    END,
    CASE 
        WHEN kb.slug = 'siete-habitos-gente-altamente-efectiva' THEN 15
        WHEN kb.slug = 'comunicacion-no-violenta' THEN 12
        WHEN kb.slug = 'mindset-actitud-del-exito' THEN 8
    END
FROM knowledge_base kb
WHERE kb.slug IN ('siete-habitos-gente-altamente-efectiva', 'comunicacion-no-violenta', 'mindset-actitud-del-exito');

-- 7. Verificar que todo se insertó correctamente
SELECT 
    'BIBLIOTECA CONFIGURADA EXITOSAMENTE' as status,
    (SELECT COUNT(*) FROM knowledge_base) as total_libros,
    (SELECT COUNT(*) FROM user_reading_progress WHERE user_email = 'demo@example.com') as progreso_usuario,
    (SELECT COUNT(*) FROM user_bookmarks WHERE user_email = 'demo@example.com') as bookmarks_usuario,
    (SELECT COUNT(*) FROM reading_goals WHERE user_email = 'demo@example.com') as objetivos_usuario,
    (SELECT COUNT(*) FROM reading_sessions WHERE user_email = 'demo@example.com') as sesiones_usuario;

-- 8. Mostrar resumen por categoría
SELECT 
    category,
    COUNT(*) as book_count,
    AVG(read_count) as avg_reads
FROM knowledge_base 
GROUP BY category 
ORDER BY category;
