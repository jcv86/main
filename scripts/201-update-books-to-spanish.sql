-- Actualizar todos los libros a español
-- Primero eliminamos los libros existentes para evitar duplicados
DELETE FROM knowledge_base;

-- Reiniciar el contador de ID
ALTER SEQUENCE knowledge_base_id_seq RESTART WITH 1;

-- Insertar libros profesionales en español
INSERT INTO knowledge_base (title, category, content, author, tags, slug, read_count) VALUES 

-- LIBRO 1: Organízate con Eficacia
('Organízate con Eficacia: El Arte de la Productividad sin Estrés', 'Productividad',
'David Allen presenta un sistema integral para organizar tareas, proyectos y compromisos para lograr una productividad libre de estrés.

LA METODOLOGÍA GTD

Los Cinco Pasos de GTD:

1. CAPTURAR - Recopilar todo lo que llame tu atención en un sistema confiable fuera de tu cabeza.
2. ACLARAR - Procesar lo que has capturado para determinar qué significa y qué acción se requiere.
3. ORGANIZAR - Poner recordatorios de acciones y materiales de referencia en categorías apropiadas.
4. REFLEXIONAR - Revisar tu sistema regularmente para mantenerlo actualizado y funcional.
5. COMPROMETERSE - Tomar acción con confianza, sabiendo que estás haciendo lo correcto.

EL BUCLE DEL HÁBITO

La clave de GTD es construir un sistema confiable que saque todo de tu cabeza y lo ponga en un sistema externo confiable, permitiendo que tu mente se enfoque en hacer en lugar de recordar.

APLICACIONES PRÁCTICAS

Para el Desarrollo Personal:
- Anota todas las tareas y compromisos
- Procesa tu bandeja de entrada regularmente
- Configura tu sistema organizacional
- Haz revisiones semanales
- Enfócate en las próximas acciones

El sistema ayuda a reducir el estrés y aumentar la productividad proporcionando claridad sobre qué necesita hacerse y cuándo.',
'David Allen',
ARRAY['productividad', 'gestión del tiempo', 'organización', 'manejo del estrés', 'efectividad personal'],
'organizate-con-eficacia-productividad',
4123
),

-- LIBRO 2: Inteligencia Emocional
('Inteligencia Emocional: Por Qué Importa Más que el Coeficiente Intelectual', 'Psicología',
'Daniel Goleman explora la importancia de la inteligencia emocional en el éxito personal y profesional.

¿QUÉ ES LA INTELIGENCIA EMOCIONAL?

La capacidad de reconocer, entender y manejar nuestras propias emociones mientras reconocemos y respondemos efectivamente a las emociones de otros.

Los Cuatro Dominios:

1. AUTOCONCIENCIA - La capacidad de reconocer y entender tus propias emociones.
2. AUTOGESTIÓN - La capacidad de manejar tus emociones efectivamente.
3. CONCIENCIA SOCIAL - La capacidad de entender las emociones de otros y las dinámicas organizacionales.
4. GESTIÓN DE RELACIONES - La capacidad de influir, entrenar, mentorizar y resolver conflictos.

DESARROLLANDO LA INTELIGENCIA EMOCIONAL

Construyendo Autoconciencia:
- Practica mindfulness y meditación
- Mantén un diario emocional
- Busca retroalimentación de otros
- Presta atención a las sensaciones físicas

Mejorando la Autogestión:
- Aprende técnicas de manejo del estrés
- Practica la regulación emocional
- Desarrolla estrategias de afrontamiento
- Construye resistencia

Mejorando la Conciencia Social:
- Practica la escucha activa
- Observa el lenguaje corporal y señales no verbales
- Haz preguntas para entender a otros
- Muestra interés genuino en las personas

Fortaleciendo la Gestión de Relaciones:
- Comunícate clara y efectivamente
- Construye rapport con otros
- Aprende habilidades de resolución de conflictos
- Practica dar y recibir retroalimentación

La inteligencia emocional es un conjunto de habilidades aprendibles que pueden impactar significativamente tu éxito en relaciones personales y profesionales.',
'Daniel Goleman',
ARRAY['inteligencia emocional', 'psicología', 'liderazgo', 'comunicación', 'autoconciencia'],
'inteligencia-emocional-exito',
3567
),

-- LIBRO 3: Los 7 Hábitos de la Gente Altamente Efectiva
('Los 7 Hábitos de la Gente Altamente Efectiva: Lecciones Poderosas para el Cambio Personal', 'Desarrollo Personal',
'Stephen Covey presenta un enfoque centrado en principios para resolver problemas personales y profesionales.

LOS SIETE HÁBITOS

VICTORIA PRIVADA (Hábitos 1-3)

Hábito 1: Ser Proactivo
Toma responsabilidad por tu vida y respuestas a las circunstancias.

Hábito 2: Comenzar con el Fin en Mente
Define tus valores y metas a largo plazo antes de tomar acción.

Hábito 3: Poner Primero lo Primero
Organiza y ejecuta alrededor de tus prioridades más importantes.

VICTORIA PÚBLICA (Hábitos 4-6)

Hábito 4: Pensar Ganar-Ganar
Busca soluciones mutuamente beneficiosas en todas las interacciones.

Hábito 5: Buscar Primero Entender, Luego Ser Entendido
Escucha empáticamente antes de tratar de ser entendido.

Hábito 6: Sinergizar
Combina las fortalezas de las personas a través del trabajo en equipo positivo.

RENOVACIÓN (Hábito 7)

Hábito 7: Afilar la Sierra
Renuévate continuamente en cuatro áreas clave de la vida.

APLICACIONES PRÁCTICAS

Para el Desarrollo Personal:
- Escribe una declaración de misión personal
- Practica los hábitos diariamente
- Enfócate en el desarrollo del carácter
- Busca la mejora continua

Para el Liderazgo:
- Modela los hábitos que quieres ver
- Ayuda a otros a desarrollar su potencial
- Crea acuerdos ganar-ganar
- Construye confianza a través de la consistencia

Los siete hábitos proporcionan un marco para la efectividad personal e interpersonal basado en principios atemporales.',
'Stephen R. Covey',
ARRAY['desarrollo personal', 'liderazgo', 'efectividad', 'carácter', 'hábitos'],
'siete-habitos-gente-efectiva',
4567
),

-- LIBRO 4: Cómo Ganar Amigos e Influir sobre las Personas
('Cómo Ganar Amigos e Influir sobre las Personas', 'Comunicación',
'Dale Carnegie proporciona principios atemporales para construir relaciones e influir en otros.

TÉCNICAS FUNDAMENTALES

Principio 1: No Criticar, Condenar o Quejarse
La crítica pone a las personas a la defensiva y las hace justificarse.

Principio 2: Dar Aprecio Honesto y Sincero
Las personas anhelan aprecio y reconocimiento más que casi cualquier otra cosa.

Principio 3: Despertar en la Otra Persona un Deseo Ardiente
La única manera de influir en las personas es hablar sobre lo que quieren y mostrarles cómo conseguirlo.

SEIS MANERAS DE HACER QUE LAS PERSONAS TE AGRADEN

1. Interésate Genuinamente en Otras Personas
2. Sonríe
3. Recuerda que el Nombre de una Persona es Importante
4. Sé un Buen Oyente
5. Habla en Términos de los Intereses de la Otra Persona
6. Haz que la Otra Persona se Sienta Importante

CÓMO GANAR PERSONAS PARA TU FORMA DE PENSAR

1. Evita las Discusiones
2. Muestra Respeto por las Opiniones de Otros
3. Si Estás Equivocado, Admítelo Rápidamente
4. Comienza de Manera Amigable
5. Haz que la Otra Persona Diga Sí Inmediatamente
6. Deja que la Otra Persona Hable la Mayor Parte del Tiempo

APLICACIONES PRÁCTICAS

Para Construir Relaciones:
- Muestra interés genuino en otros
- Escucha más de lo que hablas
- Da aprecio sincero
- Haz que otros se sientan importantes

Para el Liderazgo:
- Comienza con elogios y aprecio honesto
- Llama la atención a los errores indirectamente
- Habla de tus propios errores primero
- Haz preguntas en lugar de dar órdenes

Estos principios funcionan porque apelan a necesidades humanas fundamentales de aprecio, importancia y respeto.',
'Dale Carnegie',
ARRAY['comunicación', 'relaciones', 'influencia', 'liderazgo', 'habilidades interpersonales'],
'ganar-amigos-influir-personas',
5234
),

-- LIBRO 5: Hábitos Atómicos
('Hábitos Atómicos: Una Manera Fácil y Comprobada de Construir Buenos Hábitos y Romper los Malos', 'Desarrollo Personal',
'James Clear presenta un sistema integral para construir buenos hábitos y romper los malos.

LOS FUNDAMENTOS

¿Qué son los Hábitos Atómicos?
Pequeños hábitos que son parte de un sistema más grande. Son los bloques de construcción de resultados extraordinarios.

Por qué los Pequeños Hábitos Hacen una Gran Diferencia:
- 1% mejor cada día equivale a 37 veces mejor después de un año
- El éxito es el producto de hábitos diarios, no de transformaciones únicas en la vida

LAS CUATRO LEYES DEL CAMBIO DE COMPORTAMIENTO

1ª Ley: Hazlo Obvio (Señal)
- Aumenta la conciencia de tus hábitos
- Diseña tu entorno para el éxito
- Usa intenciones de implementación
- Apila hábitos juntos

2ª Ley: Hazlo Atractivo (Antojo)
- Usa el agrupamiento de tentaciones
- Únete a una cultura donde el comportamiento deseado es normal
- Crea rituales de motivación
- Reenmarca tu mentalidad

3ª Ley: Hazlo Fácil (Respuesta)
- Reduce la fricción para los buenos hábitos
- Prepara tu entorno
- Domina el momento decisivo
- Usa la regla de los dos minutos

4ª Ley: Hazlo Satisfactorio (Recompensa)
- Usa refuerzo
- Haz que no hacer nada sea disfrutable
- Usa un rastreador de hábitos
- Nunca falles dos veces

APLICACIONES PRÁCTICAS

Para Construir Buenos Hábitos:
1. Comienza con hábitos increíblemente pequeños
2. Aumenta los hábitos de maneras muy pequeñas
3. Divide los hábitos en pedazos
4. Cuando falles, vuelve al camino rápidamente
5. Sé paciente

Para Romper Malos Hábitos:
1. Hazlo invisible (elimina señales)
2. Hazlo poco atractivo (reenmarca la mentalidad)
3. Hazlo difícil (aumenta la fricción)
4. Hazlo insatisfactorio (añade costo inmediato)

La idea clave es que los pequeños hábitos se componen con el tiempo para crear resultados extraordinarios.',
'James Clear',
ARRAY['hábitos', 'desarrollo personal', 'cambio de comportamiento', 'productividad', 'sistemas'],
'habitos-atomicos-construir-buenos-habitos',
4321
),

-- LIBRO 6: Trabajo Profundo
('Trabajo Profundo: Reglas para el Éxito Enfocado en un Mundo Distraído', 'Productividad',
'Cal Newport define el trabajo profundo como actividades profesionales realizadas en un estado de concentración libre de distracciones que llevan las capacidades cognitivas al límite.

CONCEPTOS CLAVE

• Trabajo Profundo vs. Trabajo Superficial: Distinguir entre actividades que crean valor y aquellas que son logísticas y no cognitivamente demandantes
• La Hipótesis del Trabajo Profundo: La capacidad de realizar trabajo profundo se está volviendo cada vez más rara y valiosa
• Filosofías de Trabajo Profundo: Monástica, bimodal, rítmica y periodística
• Las Cuatro Disciplinas: Enfocarse en lo importante, actuar sobre medidas de liderazgo, mantener un marcador convincente, y crear una cadencia de responsabilidad

ESTRATEGIAS PRÁCTICAS

1. Rituales de Trabajo Profundo: Crear rutinas específicas para maximizar la concentración
2. Arquitectura de Atención: Diseñar el entorno físico y digital para minimizar distracciones
3. Entrenamiento de Concentración: Ejercicios para fortalecer la capacidad de atención sostenida
4. Drenaje de lo Superficial: Identificar y minimizar el trabajo que no agrega valor

IMPLEMENTACIÓN

- Programar bloques específicos de tiempo para trabajo profundo
- Crear rituales que señalen el inicio del trabajo concentrado
- Eliminar o minimizar las fuentes de distracción digital
- Desarrollar la capacidad de trabajar sin estimulación constante

IMPACTO EN TU CARRERA

El dominio del trabajo profundo te permitirá:
- Producir trabajo de mayor calidad en menos tiempo
- Desarrollar habilidades valiosas más rápidamente
- Crear valor económico significativo en tu campo
- Diferenciarte en un mercado laboral cada vez más competitivo',
'Cal Newport',
ARRAY['trabajo profundo', 'concentración', 'productividad', 'enfoque', 'distracción'],
'trabajo-profundo-exito-enfocado',
3890
),

-- LIBRO 7: Mindset
('Mindset: La Nueva Psicología del Éxito', 'Psicología',
'Carol Dweck revela cómo nuestras creencias sobre nuestras habilidades afectan profundamente nuestro éxito.

LOS DOS MINDSETS

MINDSET FIJO
- Cree que las habilidades son estáticas
- Evita desafíos
- Se rinde fácilmente
- Ve el esfuerzo como signo de debilidad
- Ignora críticas útiles
- Se siente amenazado por el éxito de otros

MINDSET DE CRECIMIENTO
- Cree que las habilidades pueden desarrollarse
- Abraza desafíos
- Persiste ante obstáculos
- Ve el esfuerzo como camino al dominio
- Aprende de las críticas
- Se inspira en el éxito de otros

APLICACIONES EN DIFERENTES ÁREAS

En los Negocios:
- Fomenta la innovación y la toma de riesgos
- Crea culturas de aprendizaje
- Mejora el liderazgo y la gestión
- Aumenta la colaboración

En las Relaciones:
- Mejora la comunicación
- Reduce conflictos
- Fomenta el crecimiento mutuo
- Construye relaciones más fuertes

En la Educación:
- Mejora el rendimiento académico
- Aumenta la motivación
- Reduce la ansiedad por el rendimiento
- Fomenta el amor por el aprendizaje

DESARROLLANDO UN MINDSET DE CRECIMIENTO

1. Reconoce tu mindset actual
2. Escucha tu voz de mindset fijo
3. Habla de vuelta con la voz de crecimiento
4. Toma acción basada en el crecimiento

El mindset de crecimiento es la creencia de que tus habilidades más básicas pueden desarrollarse a través de dedicación y trabajo duro.',
'Carol S. Dweck',
ARRAY['mindset', 'psicología', 'crecimiento', 'mentalidad', 'éxito'],
'mindset-psicologia-exito',
4156
),

-- LIBRO 8: El Poder del Hábito
('El Poder del Hábito: Por Qué Hacemos lo que Hacemos en la Vida y los Negocios', 'Desarrollo Personal',
'Charles Duhigg explora la ciencia detrás de por qué existen los hábitos y cómo pueden cambiarse.

EL BUCLE DEL HÁBITO

Todo hábito consiste en tres componentes:

1. LA SEÑAL - Un disparador que le dice a tu cerebro que entre en modo automático
2. LA RUTINA - El comportamiento físico, mental o emocional
3. LA RECOMPENSA - El beneficio que obtienes del comportamiento

HÁBITOS CLAVE

Los hábitos clave son aquellos que, cuando cambian, desencadenan una reacción en cadena que ayuda a cambiar otros hábitos también.

Ejemplos de Hábitos Clave:
- Ejercicio regular
- Llevar un diario de comida
- Hacer la cama cada mañana
- Planificar el día anterior

CAMBIANDO HÁBITOS

La Regla de Oro del Cambio de Hábitos:
No puedes extinguir un mal hábito, solo puedes cambiarlo.

Pasos para Cambiar un Hábito:
1. Identifica la rutina
2. Experimenta con recompensas
3. Aísla la señal
4. Ten un plan

HÁBITOS ORGANIZACIONALES

Las organizaciones también tienen hábitos:
- Rutinas operativas
- Procesos de toma de decisiones
- Culturas corporativas
- Respuestas a crisis

APLICACIONES PRÁCTICAS

Para Individuos:
- Identifica tus hábitos clave
- Cambia un hábito a la vez
- Enfócate en la recompensa
- Sé paciente con el proceso

Para Organizaciones:
- Identifica rutinas organizacionales
- Cambia procesos sistemáticamente
- Crea nuevas culturas
- Mide el progreso

Los hábitos pueden transformarse si entendemos cómo funcionan.',
'Charles Duhigg',
ARRAY['hábitos', 'comportamiento', 'cambio', 'neurociencia', 'rutinas'],
'poder-del-habito-vida-negocios',
3745
),

-- LIBRO 9: Conversaciones Cruciales
('Conversaciones Cruciales: Herramientas para Hablar Cuando Hay Mucho en Juego', 'Comunicación',
'Kerry Patterson y su equipo proporcionan herramientas para manejar conversaciones de alto riesgo.

¿QUÉ ES UNA CONVERSACIÓN CRUCIAL?

Una conversación crucial es una discusión entre dos o más personas donde:
- Las opiniones varían
- Hay mucho en juego
- Las emociones son intensas

PRINCIPIOS FUNDAMENTALES

1. Comienza Contigo Mismo
- Enfócate en lo que realmente quieres
- Aprende a mirar por señales de que no estás en diálogo

2. Aprende a Mirar
- Por condiciones de seguridad
- Por señales de que las personas se están moviendo hacia el silencio o la violencia
- Por tu propio estilo bajo estrés

3. Haz que Sea Seguro Hablar
- Disculparse cuando sea apropiado
- Contrastar para arreglar malentendidos
- Crear un propósito mutuo

4. Domina Tus Historias
- Retrace tu camino hacia los hechos
- Separa los hechos de las historias
- Cuenta la historia más respetuosa

5. ESTADO tu Camino hacia la Acción
- Comparte tus hechos
- Cuenta tu historia
- Pide los caminos de otros
- Habla tentativamente
- Alienta las pruebas

HABILIDADES DE ESCUCHA

- Pregunta para obtener los caminos de otros
- Parafrasea para reconocer
- Prepárate para estar de acuerdo o diferir
- Construye sobre ideas

MOVIMIENTO HACIA LA ACCIÓN

- Decide cómo decidir
- Documenta decisiones y sigue adelante
- Asigna responsabilidades claras
- Establece plazos específicos

Las conversaciones cruciales son inevitables, pero con las herramientas correctas, pueden ser productivas.',
'Kerry Patterson, Joseph Grenny, Ron McMillan, Al Switzler',
ARRAY['comunicación', 'conversaciones difíciles', 'diálogo', 'conflicto', 'liderazgo'],
'conversaciones-cruciales-herramientas',
2987
),

-- LIBRO 10: Los Primeros 90 Días
('Los Primeros 90 Días: Estrategias Críticas de Éxito para Nuevos Líderes en Todos los Niveles', 'Liderazgo',
'Michael Watkins proporciona un plan para que los nuevos líderes aceleren su transición y comiencen a crear valor más rápidamente.

LOS DESAFÍOS FUNDAMENTALES DE TRANSICIÓN

1. PROMOVER TU MISMO
- Dejar de hacer y empezar a hacer que otros hagan
- Cambiar de especialista a generalista
- Desarrollar nuevas fuentes de poder e influencia

2. ACELERAR TU APRENDIZAJE
- Aprender sobre mercados, productos, tecnologías, sistemas y estructuras
- Entender la cultura y la política
- Identificar quién puede ayudarte a tener éxito

3. HACER COINCIDIR ESTRATEGIA Y SITUACIÓN
- Diagnosticar la situación del negocio
- Desarrollar la estrategia correcta
- Alinear tu enfoque con la situación

4. ASEGURAR VICTORIAS TEMPRANAS
- Construir credibilidad y crear impulso
- Establecer patrones de comportamiento productivos
- Obtener el permiso para hacer cambios más difíciles

5. NEGOCIAR EL ÉXITO
- Construir una relación productiva con tu jefe
- Gestionar expectativas
- Obtener recursos necesarios

LAS CUATRO SITUACIONES DE NEGOCIO

INICIO: Construir desde cero
CAMBIO: Realizar una transformación
ACELERACIÓN: Mantener el éxito
REESTRUCTURACIÓN: Salvar una situación en declive

ESTRATEGIAS PARA CADA SITUACIÓN

Para Inicio:
- Construye estructuras y sistemas
- Contrata el equipo correcto
- Establece una visión clara

Para Cambio:
- Crea urgencia para el cambio
- Forma una coalición poderosa
- Desarrolla una visión convincente

Para Aceleración:
- Identifica oportunidades para mejorar
- Evita la complacencia
- Mantén el enfoque en la ejecución

Para Reestructuración:
- Toma decisiones difíciles rápidamente
- Enfócate en lo esencial
- Comunica honestamente sobre la situación

Los primeros 90 días son críticos para establecer el tono de tu liderazgo.',
'Michael Watkins',
ARRAY['liderazgo', 'transición', 'gestión', 'estrategia', 'nuevos líderes'],
'primeros-90-dias-nuevos-lideres',
3421
);

-- Verificar que los libros se agregaron correctamente
SELECT COUNT(*) as libros_agregados FROM knowledge_base;

-- Mostrar los libros recién agregados
SELECT title, author, category, read_count 
FROM knowledge_base 
ORDER BY title;

-- Mostrar el conteo total de libros en la biblioteca
SELECT 
    COUNT(*) as total_libros,
    COUNT(DISTINCT category) as categorias,
    COUNT(DISTINCT author) as autores
FROM knowledge_base;
