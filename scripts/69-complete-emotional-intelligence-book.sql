-- Complete the Emotional Intelligence book with real content
-- Add the book back with proper UUID and content

INSERT INTO public.library_books (
    id, title, author, description, cover_image, category, difficulty, 
    estimated_reading_time, pages, published_year, rating, tags, key_topics, is_recommended
) VALUES (
    '550e8400-e29b-41d4-a716-446655440004',
    'Inteligencia Emocional',
    'Daniel Goleman',
    'Por qué es más importante que el cociente intelectual. Un libro revolucionario que cambió nuestra comprensión de la inteligencia humana.',
    '/books/emotional-intelligence.jpg',
    'Psicología',
    'Intermedio',
    300,
    352,
    1995,
    4.5,
    ARRAY['inteligencia emocional', 'psicología', 'liderazgo', 'autoconocimiento'],
    ARRAY['Autoconciencia emocional', 'Autorregulación', 'Empatía', 'Habilidades sociales', 'Motivación'],
    true
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    author = EXCLUDED.author,
    description = EXCLUDED.description,
    cover_image = EXCLUDED.cover_image,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    estimated_reading_time = EXCLUDED.estimated_reading_time,
    pages = EXCLUDED.pages,
    published_year = EXCLUDED.published_year,
    rating = EXCLUDED.rating,
    tags = EXCLUDED.tags,
    key_topics = EXCLUDED.key_topics,
    is_recommended = EXCLUDED.is_recommended,
    updated_at = NOW();

-- Add chapters for Emotional Intelligence with proper UUIDs
INSERT INTO public.library_book_chapters (id, book_id, title, content, "order") VALUES 
(
    '550e8400-e29b-41d4-a716-446655440101',
    '550e8400-e29b-41d4-a716-446655440004',
    'Introducción: ¿Para qué sirven las emociones?',
    'Cualquier concepción de la naturaleza humana que pase por alto el poder de las emociones es lamentablemente miope. El nombre mismo de nuestra especie, Homo sapiens, la especie pensante, resulta engañoso a la luz de la nueva valoración y visión que la ciencia ofrece del lugar que ocupan las emociones en nuestra vida.

Como todos sabemos por experiencia, cuando se trata de dar forma a nuestras decisiones y a nuestras acciones, los sentimientos cuentan tanto como los pensamientos, y a menudo más. Hemos llegado muy lejos en lo que se refiere a destacar el valor y el significado de lo puramente racional —de lo que mide el CI— en la vida humana. Para bien o para mal, la inteligencia puede no tener la menor importancia cuando dominan las emociones.

## El Poder de las Emociones

En los momentos en que nos vemos arrastrados por las emociones, la inteligencia emocional entra en juego. Estas capacidades incluyen el autocontrol, el entusiasmo, la perseverancia y la habilidad para motivarse a uno mismo. Y se pueden enseñar a los niños, dándoles así mejores oportunidades de utilizar el potencial intelectual que la lotería genética les haya podido otorgar.

Más allá de estas consideraciones se encuentra una premisa moral urgente. Vivimos en una época en la que el tejido de la sociedad parece deshacerse a una velocidad cada vez mayor, en la que el egoísmo, la violencia y la mezquindad espiritual parecen socavar la bondad de nuestras vidas comunitarias.

## La Inteligencia Emocional Definida

La inteligencia emocional incluye la autorregulación, la motivación, la empatía y las habilidades sociales. Estas son las características que marcan a las personas que destacan en la vida real: aquellos que tienen relaciones íntimas que perduran, que son estrellas en el trabajo.

Estas son también las características de los individuos que se cuidan a sí mismos y a los demás de manera efectiva. La inteligencia emocional no significa simplemente "ser agradable". En momentos estratégicos puede requerir, por el contrario, enfrentar sin rodeos a alguien para hacerle ver una verdad importante, aunque molesta, que haya estado evitando.

## Los Cinco Componentes de la Inteligencia Emocional

**1. Autoconciencia Emocional**
La capacidad de reconocer y entender nuestras propias emociones cuando ocurren. Esta es la piedra angular de la inteligencia emocional.

**2. Autorregulación**
La habilidad de manejar nuestras emociones de manera que faciliten la tarea entre manos, en lugar de interferir con ella; ser conscientes y demorar la gratificación en la búsqueda de objetivos; recuperarse bien de las tensiones emocionales.

**3. Motivación**
Utilizar nuestras preferencias más profundas para orientarnos y avanzar hacia los objetivos, para tomar iniciativas y ser muy efectivos, y para perseverar frente a los contratiempos y las frustraciones.

**4. Empatía**
Percibir lo que sienten los demás, ser capaces de ver las cosas desde su perspectiva, cultivar la afinidad con una amplia diversidad de personas.

**5. Habilidades Sociales**
Manejar bien las emociones en las relaciones e interpretar con precisión las situaciones sociales y las redes sociales; interactuar sin problemas; utilizar estas habilidades para persuadir, dirigir y negociar, y para resolver disputas.

## El Cerebro Emocional

Tenemos dos mentes: una que piensa y otra que siente. Estas dos formas fundamentalmente diferentes de conocimiento interactúan para construir nuestra vida mental. Una, la mente racional, es la forma de comprensión de la que somos típicamente conscientes: más destacada en cuanto a la conciencia, reflexiva, capaz de analizar y meditar.

Pero junto a este existe otro sistema de conocimiento: impulsivo y poderoso, aunque a veces ilógico: la mente emocional. La dicotomía emocional/racional se aproxima a la distinción popular entre "corazón" y "cabeza".

## La Anatomía de un Secuestro Emocional

En la arquitectura del cerebro, el sistema límbico que alberga las emociones también alberga la capacidad de aprendizaje y memoria; esto explica por qué el aprendizaje emocional es tan poderoso y por qué las emociones intensas pueden crear recuerdos tan vívidos.

El secuestro emocional ocurre cuando la amígdala, el centro de alarma del cerebro, toma el control antes de que la corteza prefrontal, nuestro centro ejecutivo, pueda evaluar la situación. En estos momentos, actuamos antes de pensar.

## Aplicaciones Prácticas

La inteligencia emocional se puede desarrollar. A diferencia del CI, que cambia poco después de los años de adolescencia, la inteligencia emocional parece ser en gran medida aprendida, y continúa desarrollándose a medida que avanzamos por la vida y aprendemos de nuestras experiencias.

De hecho, los estudios que han seguido a las personas a lo largo de los años muestran que la inteligencia emocional aumenta con la edad: lo que se llama madurez. Tenemos otra palabra para esto: sabiduría.',
    1
),
(
    '550e8400-e29b-41d4-a716-446655440102',
    '550e8400-e29b-41d4-a716-446655440004',
    'Capítulo 1: ¿Para qué sirven las emociones?',
    'Una noche lluviosa de agosto, Richard Robles, de veintiún años, merodeaba por el Upper East Side de Manhattan en busca de un apartamento para robar. Había elegido el apartamento 3C del 963 de la calle 88 Este porque había visto a una mujer mayor salir antes y supuso que estaría vacío.

Pero Robles se había equivocado. Cuando forzó la puerta, se encontró cara a cara con Janice Wylie, de veintiún años, una investigadora de la revista Newsweek. También estaba allí Emily Hoffert, de veintitrés años, una maestra de escuela primaria que acababa de graduarse de la universidad.

Lo que siguió fue una de las tragedias más brutales en la historia criminal de Nueva York. En un arrebato de pánico y furia, Robles ató y apuñaló a las dos mujeres jóvenes. Más tarde confesaría: "Simplemente me volví loco. Mi cabeza simplemente explotó."

## La Herencia Emocional

¿Por qué evolucionamos con emociones? Si fueran simplemente una fuente de problemas, la evolución las habría eliminado hace mucho tiempo. Pero las emociones han sido cruciales para la supervivencia humana durante milenios.

Cada emoción nos prepara para actuar de una manera distintiva; cada una nos señala una dirección que ha funcionado bien para manejar los desafíos humanos recurrentes. Estas tendencias biológicas automáticas para actuar fueron moldeadas por las realidades brutales que enfrentaron nuestros antepasados.

## El Repertorio Emocional

**Ira**: La sangre fluye a las manos, haciendo más fácil empuñar un arma o golpear a un enemigo; el ritmo cardíaco se eleva y un aumento de hormonas como la adrenalina genera un pulso de energía lo suficientemente fuerte para una acción vigorosa.

**Miedo**: La sangre va a los músculos del esqueleto, como los de las piernas, haciendo más fácil huir, y el rostro se queda pálido cuando la sangre se desvía de él (creando la sensación de que la sangre "se hiela"). Al mismo tiempo, el cuerpo se congela, aunque sea por un momento, permitiendo quizás que la persona se esconda.

**Felicidad**: Hay un aumento de actividad en un centro nervioso que inhibe los sentimientos negativos y fomenta un aumento en la energía disponible, y una disminución de aquellos que generan pensamientos preocupantes.

**Amor**: Los sentimientos tiernos y la satisfacción sexual activan el sistema nervioso parasimpático, el opuesto fisiológico de la movilización de "lucha o huida" que comparten el miedo y la ira.

**Sorpresa**: El levantar las cejas en sorpresa permite un mayor alcance visual y también permite que más luz golpee la retina. Esto ofrece más información sobre el evento inesperado, haciendo más fácil descifrar exactamente lo que está sucediendo y idear el mejor plan de acción.

**Disgusto**: La expresión facial de disgusto parece ser universal: el labio superior se tuerce hacia un lado mientras la nariz se arruga ligeramente. Darwin especuló que esto puede representar un intento primordial de cerrar las fosas nasales contra un olor nocivo o de escupir un alimento venenoso.

**Tristeza**: La tristeza tiene una función adaptativa importante: la pérdida de energía que conlleva mantiene a las personas cerca de casa, donde están más seguras.

## Nuestros Dos Cerebros

Evolutivamente hablando, el surgimiento del neocórtex fue un gran paso adelante. Durante millones de años de evolución, el cerebro ha crecido de abajo hacia arriba, con sus centros superiores desarrollándose como elaboraciones de partes inferiores más antiguas.

El crecimiento del cerebro en el embrión humano recapitula aproximadamente este curso evolutivo. La parte más primitiva del cerebro, compartida con todas las especies que tienen más que un sistema nervioso mínimo, es el tronco cerebral que rodea la parte superior de la médula espinal.

## El Cerebro Emocional

Hace alrededor de 100 millones de años, el cerebro de los mamíferos dio un gran salto de crecimiento. Encima del delgado tronco cerebral de dos capas, las áreas emocionales comenzaron a evolucionar. Sesenta millones de años más tarde en la evolución, a partir de estas áreas emocionales evolucionó el cerebro pensante o neocórtex.

El hecho de que el cerebro pensante creciera a partir del emocional revela mucho sobre la relación entre pensamiento y sentimiento; había un cerebro emocional mucho antes de que hubiera un cerebro racional.

## La Amígdala: Especialista en Asuntos Emocionales

En los seres humanos, la amígdala es relativamente grande en comparación con la de nuestros parientes evolutivos más cercanos, los primates. Tenemos dos amígdalas, una a cada lado del cerebro, ubicadas hacia el lado de la cabeza.

La amígdala actúa como un depósito de la memoria emocional, y por lo tanto del significado mismo; la vida sin amígdala es una vida despojada de significados personales. La amígdala, que madura mucho antes que el neocórtex, puede tomar el control de lo que hacemos incluso mientras el neocórtex más lento despliega su plan de reacción más refinado.

## El Secuestro Neural

Estos arrebatos emocionales son secuestros neurales. En esos momentos, la amígdala declara una emergencia, reclutando al resto del cerebro para su agenda urgente. El secuestro ocurre en un instante, desencadenando esta reacción crucial momentos antes de que el neocórtex, el cerebro pensante, haya tenido la oportunidad de vislumbrar completamente lo que está sucediendo, y mucho menos decidir si es una buena respuesta.

El sello distintivo de tal secuestro es que una vez que el momento pasa, las personas no tienen idea de lo que les pasó. Estos no son simplemente casos de emociones que se salen de control, sino de emociones que han tomado completamente el control.',
    2
),
(
    '550e8400-e29b-41d4-a716-446655440103',
    '550e8400-e29b-41d4-a716-446655440004',
    'Capítulo 2: Anatomía de un Secuestro Emocional',
    'La vida es una comedia para aquellos que piensan y una tragedia para aquellos que sienten, escribió Horace Walpole. Su observación sugiere una división entre pensamiento y sentimiento que se remonta a los antiguos griegos, quienes contrastaban logos (razón) con pathos (sentimiento).

Esta tensión entre razón y emoción se refleja en la distinción popular entre "corazón" y "cabeza". Saber que algo está "bien" en nuestro corazón de los corazones es un tipo diferente de convicción —de alguna manera un tipo más profundo de certeza— que pensar lo mismo con nuestra mente racional.

## El Diseño del Cerebro Emocional

Para entender el poder fuerte de las emociones sobre la mente pensante —y por qué el sentimiento y la razón están tan fácilmente en guerra— debemos considerar cómo evolucionó el cerebro.

El cerebro humano, con sus tres libras de células y jugos neurales, es aproximadamente tres veces más grande que el de nuestros parientes evolutivos más cercanos, los primates no humanos. A lo largo de millones de años de evolución, el cerebro ha crecido de abajo hacia arriba, con sus centros superiores desarrollándose como elaboraciones de partes inferiores más antiguas.

## La Raíz del Neocórtex

La parte más primitiva del cerebro, compartida con todas las especies que tienen más que un sistema nervioso mínimo, es el tronco cerebral que rodea la parte superior de la médula espinal. Este cerebro raíz regula las funciones vitales básicas como la respiración y el metabolismo de los órganos del cuerpo, así como controla las reacciones y movimientos estereotipados.

Este cerebro primitivo no puede decirse que piense o aprenda; más bien es un conjunto de reguladores preprogramados que mantienen el cuerpo funcionando como debería y reaccionando de una manera que asegure la supervivencia. Este cerebro reinó supremo en la Era de los Reptiles: imagina una serpiente silbando para señalar la amenaza de un ataque.

## El Surgimiento de las Emociones

A partir del tronco cerebral más primitivo —la médula y el bulbo raquídeo— emergieron los centros emocionales. Millones de años más tarde en la evolución, a partir de estas áreas emocionales evolucionó el cerebro pensante o "neocórtex", la gran protuberancia de tejidos plegados que forman las capas superiores.

El hecho de que el cerebro pensante creciera a partir del emocional revela mucho sobre la relación entre pensamiento y sentimiento; había un cerebro emocional mucho antes de que hubiera un cerebro racional.

## El Sistema Límbico

Los centros de emoción están ubicados en el sistema límbico, un conjunto de estructuras que incluye el hipocampo, donde tiene lugar el aprendizaje y la memoria; la amígdala, donde se procesan las emociones como el miedo y la ira; y varias otras estructuras que regulan la emoción.

Es el sistema límbico el que evalúa si algo es agradable o desagradable. Cuando estamos en las garras de un deseo o furia, enamorados o recoilendo en horror, es el sistema límbico el que nos tiene en su poder.

## La Amígdala: El Especialista Emocional

De todas las estructuras límbicas, la amígdala ha llegado a ser reconocida como central para los asuntos emocionales. Si la amígdala se separa del resto del cerebro, el resultado es una notable incapacidad para evaluar el significado emocional de los eventos; esta condición a veces se llama "ceguera afectiva".

Un joven cuya amígdala había sido extirpada quirúrgicamente para controlar ataques severos se volvió completamente desinteresado socialmente. Ya no podía reconocer sentimientos en otros, y ya no podía sentir sus propias emociones.

## El Centinela Emocional

La amígdala sirve como una especie de depósito de la memoria emocional, y por lo tanto del significado mismo; la vida sin amígdala es una vida despojada de significados personales. Más que simplemente formar memorias emocionales, la amígdala puede actuar independientemente del neocórtex.

Algunas reacciones emocionales y memorias emocionales pueden formarse sin ninguna participación cognitiva consciente en absoluto. La amígdala puede albergar memorias y repertorios de respuestas que promulgamos sin saber completamente por qué lo hacemos, porque el atajo desde el tálamo hasta la amígdala evita completamente el neocórtex.

## El Secuestro Emocional

Este circuito neural explica el poder de la emoción para superar la racionalidad. Es un mecanismo de emergencia que permite a la amígdala activar una respuesta antes de que los centros neocorticales hayan procesado completamente lo que está sucediendo.

Pero este circuito desde el tálamo hasta la amígdala lleva solo una pequeña porción de los mensajes sensoriales, con la mayoría tomando la ruta principal hasta el neocórtex. Así que lo que llega a la amígdala es, en el mejor de los casos, una señal cruda, apenas suficiente para sonar una alarma.

## Las Características del Secuestro

Los secuestros emocionales tienen ciertas características distintivas. Primero, involucran el surgimiento de una emoción intensa. Segundo, son súbitos, encendiéndose en segundos o minutos. Tercero, las acciones que siguen se sienten justificadas más tarde, aunque en retrospectiva parezcan inapropiadas.

Además de la intensidad, impulsividad y la cualidad de arrepentimiento posterior que marca estos secuestros emocionales, hay otro signo revelador: una sensación de no saber lo que nos está pasando mientras está sucediendo.

## El Gerente Emocional

Mientras que la amígdala trabaja para impulsar una respuesta emocional impulsiva, otra parte del cerebro emocional permite una respuesta más apropiada y correctiva. El interruptor que apaga una emoción perturbadora parece estar en el extremo izquierdo de la corteza prefrontal, justo detrás de la frente.

La corteza prefrontal izquierda parece ser parte de un circuito neural que puede apagar, o al menos atenuar, todos excepto los más fuertes arrebatos negativos. Si la amígdala a menudo actúa como una alarma de emergencia, la corteza prefrontal izquierda parece ser parte del cerebro que mantiene las emociones en perspectiva.

## Armonizando Emoción y Pensamiento

Estas conexiones entre la amígdala (y las estructuras límbicas relacionadas) y el neocórtex son el centro de las batallas o acuerdos cooperativos entre cabeza y corazón, pensamiento y sentimiento. Esta circuitería explica por qué la emoción es tan importante para el pensamiento efectivo, tanto en la toma de decisiones sabias como en simplemente permitirnos pensar claramente.',
    3
);

-- Verify the book was added
SELECT id, title, author FROM public.library_books WHERE id = '550e8400-e29b-41d4-a716-446655440004';
