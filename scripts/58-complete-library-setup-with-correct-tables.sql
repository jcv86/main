-- Complete library setup with correct table structures
-- This script ensures all tables exist with the correct structure

-- Clean existing data first
DELETE FROM user_book_bookmarks WHERE TRUE;
DELETE FROM user_book_progress WHERE TRUE;
DELETE FROM book_chapters WHERE TRUE;
DELETE FROM books WHERE TRUE;

-- Insert the 3 essential books
INSERT INTO books (
  id,
  title,
  author,
  description,
  category,
  rating,
  reading_time,
  pages,
  published_year,
  cover_url,
  tags,
  difficulty,
  key_topics,
  is_recommended,
  created_at,
  updated_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Hábitos Atómicos',
  'James Clear',
  'Un método fácil y comprobado para crear buenos hábitos y eliminar los malos. James Clear revela estrategias prácticas que te enseñarán exactamente cómo formar buenos hábitos, romper los malos y dominar los pequeños comportamientos que llevan a resultados notables.',
  'Productividad',
  4.8,
  '4h 30min',
  320,
  2018,
  '/placeholder.svg?height=400&width=300&text=Hábitos%20Atómicos&bg=3b82f6&color=white',
  ARRAY['Hábitos', 'Productividad', 'Autoayuda', 'Comportamiento'],
  'Intermedio',
  ARRAY['Formación de hábitos', 'Productividad personal', 'Cambio de comportamiento', 'Sistemas vs objetivos'],
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Los 7 Hábitos de la Gente Altamente Efectiva',
  'Stephen R. Covey',
  'Lecciones poderosas de cambio personal que han inspirado a millones de personas. Covey presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales.',
  'Liderazgo',
  4.6,
  '6h 15min',
  432,
  1989,
  '/placeholder.svg?height=400&width=300&text=7%20Hábitos&bg=1f2937&color=white',
  ARRAY['Liderazgo', 'Efectividad', 'Desarrollo Personal', 'Principios'],
  'Intermedio',
  ARRAY['Liderazgo personal', 'Efectividad', 'Principios de vida', 'Interdependencia'],
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Inteligencia Emocional',
  'Daniel Goleman',
  'Por qué puede importar más que el coeficiente intelectual. Goleman argumenta que nuestras emociones juegan un papel mucho mayor en el pensamiento, la toma de decisiones y el éxito individual que tradicionalmente se ha reconocido.',
  'Habilidades Blandas',
  4.7,
  '5h 20min',
  384,
  1995,
  '/placeholder.svg?height=400&width=300&text=Inteligencia%20Emocional&bg=10b981&color=white',
  ARRAY['Inteligencia Emocional', 'Psicología', 'Relaciones', 'Autoconciencia'],
  'Intermedio',
  ARRAY['Autoconciencia emocional', 'Autorregulación', 'Empatía', 'Habilidades sociales'],
  true,
  NOW(),
  NOW()
);

-- Insert chapters for Hábitos Atómicos
INSERT INTO book_chapters (
  id,
  book_id,
  chapter_number,
  title,
  content,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440101',
  '550e8400-e29b-41d4-a716-446655440001',
  1,
  'Los Fundamentos: Por qué los pequeños cambios generan una gran diferencia',
  'Los hábitos son el interés compuesto de la superación personal. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites. Parecen generar poca diferencia en un día determinado y, sin embargo, el impacto que producen a lo largo de los meses y años puede ser enorme.

Es solo cuando miramos hacia atrás —dos, cinco o quizás diez años después— que el valor de los buenos hábitos y el costo de los malos se vuelve asombrosamente evidente.

## El poder sorprendente de los hábitos atómicos

Es muy fácil sobrestimar la importancia de un momento definitorio y subestimar el valor de hacer pequeñas mejoras diariamente. Con demasiada frecuencia, nos convencemos de que el cambio masivo requiere una acción masiva.

Ya sea perdiendo peso, construyendo un negocio, escribiendo un libro, ganando un campeonato o logrando cualquier otro objetivo, nos presionamos para hacer alguna mejora que capture la atención de todos y hable por sí misma.

Mientras tanto, **mejorar en un 1 por ciento no es particularmente notable**, a veces ni siquiera es perceptible, pero puede ser mucho más significativo, especialmente a largo plazo. La diferencia que puede hacer una pequeña mejora con el tiempo es asombrosa.

### Las matemáticas de las pequeñas mejoras

Si puedes mejorar solo un 1% cada día durante un año, terminarás siendo treinta y siete veces mejor al final del año. Por el contrario, si empeoras un 1% cada día durante un año, caerás casi hasta cero. Lo que comienza como una pequeña victoria o un revés menor se acumula en algo mucho más.

## Cómo los pequeños cambios generan una gran diferencia

Imagina que tienes un avión que despega de Los Ángeles con destino a Nueva York. Si el piloto ajusta el rumbo solo 3.5 grados hacia el sur, comenzarás dirigiéndote hacia Washington, D.C., en lugar de Nueva York. Este pequeño cambio —apenas perceptible en el despegue— crea una diferencia de 225 millas de distancia al llegar al destino.

De manera similar, **un pequeño cambio en tus hábitos diarios puede guiar tu vida hacia un destino completamente diferente**. Hacer una elección que es un 1 por ciento mejor o un 1 por ciento peor parece insignificante en el momento, pero a lo largo de toda una vida estas elecciones determinan la diferencia entre quien eres y quien podrías ser.

### El valle de la decepción

Es natural sentirse desanimado cuando no ves resultados inmediatos. Esto es lo que llamo el "Valle de la Decepción". Esperas hacer progreso de manera lineal, pero la realidad es que los resultados de nuestros esfuerzos a menudo se retrasan.

## Por qué los hábitos importan

Los hábitos son una espada de doble filo. Los malos hábitos pueden reducirte tanto como los buenos hábitos pueden elevarte, razón por la cual entender los detalles es crucial. Necesitas saber cómo funcionan y cómo diseñarlos a tu favor para que puedas evitar los peligros comunes que hacen que la mayoría de las personas fallen.

### Un sistema de hábitos atómicos

Si tienes problemas para cambiar tus hábitos, el problema no eres tú. El problema es tu sistema. Los malos hábitos se repiten una y otra vez no porque no quieras cambiar, sino porque tienes el sistema equivocado para el cambio.

**No te elevas al nivel de tus objetivos. Caes al nivel de tus sistemas.**

## Puntos clave del capítulo

1. Los hábitos son el interés compuesto de la superación personal
2. Las pequeñas mejoras del 1% se acumulan en resultados extraordinarios
3. Los hábitos pueden trabajar a tu favor o en tu contra
4. El éxito es el producto de hábitos diarios, no transformaciones únicas
5. Necesitas un sistema, no solo objetivos',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440102',
  '550e8400-e29b-41d4-a716-446655440001',
  2,
  'Cómo tus hábitos moldean tu identidad (y viceversa)',
  'Hay tres niveles en los que puede ocurrir el cambio. Puedes imaginar estos como las capas de una cebolla.

## Los tres niveles de cambio

**El primer nivel** es cambiar tus resultados. Este nivel se trata de cambiar lo que obtienes. La mayoría de las metas que te fijas están en este nivel: perder peso, publicar un libro, ganar un campeonato.

**El segundo nivel** es cambiar tu proceso. Este nivel se trata de cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, organizar tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación.

**El tercer y más profundo nivel** es cambiar tu identidad. Este nivel se trata de cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y otros.

### Los resultados son sobre lo que obtienes
### Los procesos son sobre lo que haces  
### La identidad es sobre lo que crees

## El problema con el cambio basado en resultados

Muchas personas comienzan el proceso de cambiar sus hábitos enfocándose en lo que quieren lograr. Esto los lleva a hábitos basados en resultados. La alternativa es construir hábitos basados en identidad. Con este enfoque, comenzamos enfocándonos en quién deseamos llegar a ser.

### Ejemplo del fumador

Imagina dos personas que rechazan un cigarrillo. Cuando se les ofrece fumar, la primera persona dice: "No, gracias. Estoy tratando de dejar de fumar". Suena como una respuesta razonable, pero esta persona todavía cree que es un fumador que está tratando de ser otra cosa.

La segunda persona rechaza diciendo: **"No, gracias. No soy fumador"**. Es una pequeña diferencia, pero esta declaración indica un cambio en la identidad. Fumar era parte de su vida anterior, no de su vida actual.

## El proceso de dos pasos para cambiar tu identidad

Tu identidad emerge de tus hábitos. No naces con creencias preestablecidas. Cada creencia, incluidas las que tienes sobre ti mismo, se aprende y se condiciona a través de la experiencia.

Más precisamente, **tus hábitos son la forma en que encarnas tu identidad**. Cuando haces tu cama cada mañana, encarnas la identidad de una persona organizada. Cuando escribes cada día, encarnas la identidad de una persona creativa. Cuando entrenas cada día, encarnas la identidad de una persona atlética.

### La etimología de la identidad

Cuanto más repites un comportamiento, más refuerzas la identidad asociada con ese comportamiento. De hecho, la palabra identidad originalmente se derivaba de las palabras latinas *essentitas*, que significa ser, e *identidem*, que significa repetidamente. **Tu identidad es literalmente tus "hábitos repetidos"**.

### El ciclo de retroalimentación

El proceso es un ciclo de retroalimentación de dos pasos:

1. **Cada acción es un voto por el tipo de persona que deseas llegar a ser.**
2. **A medida que tus creencias sobre ti mismo cambian, también cambian tus acciones.**

## Decidir el tipo de persona que quieres ser

La primera pregunta es: ¿Quién es el tipo de persona que podría obtener el resultado que quiero? ¿Quién podría perder cuarenta libras? ¿Quién podría aprender un nuevo idioma? ¿Quién podría dirigir un negocio exitoso?

### Trabajar hacia atrás desde los resultados

Por ejemplo, "¿Qué haría una persona saludable?" Una persona saludable caminaría más. Bien, comenzaré a caminar. Una persona saludable comería más verduras. Comenzaré a comer más verduras.

Una vez que tienes una idea del tipo de persona que quieres ser, puedes comenzar a dar pequeños pasos para reforzar tu identidad deseada.

### Ejemplos de cambio basado en identidad

- **El objetivo no es leer un libro, el objetivo es convertirse en lector.**
- **El objetivo no es correr un maratón, el objetivo es convertirse en corredor.**
- **El objetivo no es aprender un instrumento, el objetivo es convertirse en músico.**

## El verdadero cambio es un cambio de identidad

Puedes comenzar un hábito debido a la motivación, pero la única razón por la que lo mantendrás es que se convierte en parte de tu identidad.

### La verdadera razón por la que los hábitos importan

Los hábitos importan porque pueden cambiar tus creencias sobre ti mismo. Cada vez que escribes una página, eres un escritor. Cada vez que practicas el violín, eres un músico. Cada vez que comienzas un entrenamiento, eres un atleta.

**Cada acción que tomas es un voto por el tipo de persona que deseas llegar a ser.** Ninguna instancia individual transformará tus creencias, pero a medida que los votos se acumulan, también lo hace la evidencia de tu nueva identidad.

## Puntos clave del capítulo

1. Hay tres niveles de cambio: resultado, proceso e identidad
2. El cambio más efectivo es el cambio basado en identidad
3. Tu identidad emerge de tus hábitos
4. Cada acción es un voto por el tipo de persona que quieres llegar a ser
5. Convertirse en la mejor versión de ti mismo requiere editar continuamente tus creencias
6. El verdadero cambio de comportamiento es un cambio de identidad',
  NOW()
);

-- Insert chapters for Los 7 Hábitos
INSERT INTO book_chapters (
  id,
  book_id,
  chapter_number,
  title,
  content,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440201',
  '550e8400-e29b-41d4-a716-446655440002',
  1,
  'Paradigmas y principios',
  'La forma en que vemos el problema es el problema. Este libro trata sobre un enfoque de adentro hacia afuera para la efectividad personal e interpersonal. **Adentro hacia afuera significa comenzar contigo mismo**; más fundamentalmente, comenzar con las partes más internas de ti mismo: tus paradigmas, tu carácter y tus motivos.

## El poder de un paradigma

El término paradigma proviene del griego. Originalmente era un término científico, y en términos más generales significa un modelo, teoría, percepción, suposición o marco de referencia. En el sentido más general, es la forma en que "vemos" el mundo, no en términos de nuestro sentido de la vista, sino en términos de percibir, entender, interpretar.

Para nuestros propósitos, una forma simple de entender los paradigmas es verlos como mapas. Todos sabemos que **"el mapa no es el territorio"**. Un mapa es simplemente una descripción de ciertos aspectos del territorio. Eso es exactamente lo que es un paradigma. Es una teoría, una explicación o modelo de algo más.

### El mapa no es el territorio

Supongamos que quisieras llegar a un lugar específico en el centro de Chicago. Un mapa de la calle de Chicago sería de gran ayuda para ti en este esfuerzo, a menos que hubiera un problema con el mapa. Supongamos que tuvieras el mapa equivocado. Supongamos que estuvieras tratando de llegar a algún lugar en Chicago usando un mapa de Detroit. ¿Puedes imaginar la frustración, la futilidad de tratar de llegar a donde quieres ir?

## El poder de un cambio de paradigma

Quizás recuerdes tu propia experiencia con un cambio de paradigma, ya sea instantáneo o lento y deliberado, cuando de repente viste algo de una manera completamente diferente. Tal vez fue cuando por primera vez viste una imagen que parecía ser una hermosa mujer joven y luego, de repente, viste a una anciana.

### La experiencia del metro

Recuerdo una experiencia dominical por la mañana en el metro de Nueva York. Los pasajeros estaban sentados tranquilamente: algunos leyendo periódicos, algunos perdidos en sus pensamientos, algunos descansando con los ojos cerrados. Era una escena tranquila y pacífica.

Entonces de repente, un hombre y sus hijos subieron al vagón. Los niños eran tan ruidosos y revoltosos que instantáneamente toda la atmósfera cambió. El hombre se sentó junto a mí y cerró los ojos, aparentemente ajeno a la situación. Los niños gritaban de un lado a otro, tirando cosas, incluso agarrando los periódicos de la gente. Era muy molesto. Y sin embargo, el hombre sentado junto a mí no hacía nada.

Era difícil no sentirse irritado. No podía creer que pudiera ser tan insensible como para dejar que sus hijos corrieran salvajemente así y no hacer nada al respecto. Así que finalmente, con lo que sentí que era una paciencia y moderación inusuales, me volví hacia él y dije: "Señor, sus hijos están realmente molestando a mucha gente. Me pregunto si no podría controlarlos un poco más."

El hombre levantó la vista como si se diera cuenta de la situación por primera vez y dijo suavemente: **"Oh, tienes razón. Supongo que debería hacer algo al respecto. Acabamos de venir del hospital donde su madre murió hace aproximadamente una hora. No sé qué pensar, y supongo que ellos tampoco saben cómo manejarlo."**

¿Puedes imaginar lo que sentí en ese momento? Mi paradigma cambió. De repente vi las cosas de manera diferente, y porque vi de manera diferente, pensé de manera diferente, sentí de manera diferente, me comporté de manera diferente.

## Principios de crecimiento y cambio

**Los principios correctos son como brújulas: siempre apuntan el camino.** Y si sabemos cómo leer la brújula, no nos perderemos, confundiremos o seremos engañados por voces o valores conflictivos a nuestro alrededor.

Los principios son verdades profundas, fundamentales, verdades clásicas, denominadores comunes. Son hebras estrechamente entretejidas que atraviesan las familias, organizaciones y civilizaciones duraderas y prósperas a lo largo de la historia.

### Principios universales

Los principios no son prácticas. Una práctica es una actividad o acción específica. Una práctica que funciona en una circunstancia no necesariamente funcionará en otra, como lo atestiguan los padres que han tratado de criar a un segundo hijo exactamente como criaron al primero.

Mientras que las prácticas son situacionales, **los principios son verdades profundas, fundamentales, de aplicación universal**. Se aplican a individuos, matrimonios, familias, organizaciones privadas e instituciones públicas de todo tipo.

## El principio del crecimiento

El proceso de crecimiento es progresivo, y debemos pasar por cada etapa. **No hay atajos.** Esto se aplica a todos los ámbitos de la vida, ya sea aprender a tocar el piano o comunicarse de manera efectiva con un compañero de trabajo. Es "ley natural"; debemos gatear antes de caminar.

### No hay atajos en el desarrollo

Es imposible que un niño de cinco años funcione con la responsabilidad de un adulto de veinticinco años. Es igualmente imposible que un adulto de veinticinco años que no ha aprendido los principios básicos de responsabilidad funcione efectivamente como un padre o gerente responsable.

## El camino hacia la madurez

En el área del desarrollo humano, también hay una progresión natural, secuencial. Nos movemos progresivamente en un continuo de madurez desde la dependencia hacia la independencia hacia la interdependencia.

### Las tres etapas de la madurez

**Dependencia** es el paradigma de tú: tú cuidas de mí; tú vienes por mí cuando no logro; tú eres culpable de los resultados.

**Independencia** es el paradigma de yo: yo puedo hacerlo; yo soy responsable; yo soy autosuficiente; yo puedo elegir.

**Interdependencia** es el paradigma de nosotros: nosotros podemos hacerlo; nosotros podemos cooperar; nosotros podemos combinar nuestros talentos y habilidades y crear algo más grande juntos.

### La interdependencia como objetivo

Las personas dependientes necesitan a otros para conseguir lo que quieren. Las personas independientes pueden conseguir lo que quieren a través de su propio esfuerzo. **Las personas interdependientes combinan sus propios esfuerzos con los esfuerzos de otros para lograr su mayor éxito.**

## Puntos clave del capítulo

1. Los paradigmas son mapas mentales que guían nuestro comportamiento
2. Los cambios de paradigma pueden transformar instantáneamente nuestra perspectiva
3. Los principios son verdades universales que trascienden culturas y tiempo
4. El crecimiento es un proceso progresivo sin atajos
5. La madurez progresa de dependencia a independencia a interdependencia
6. El enfoque de adentro hacia afuera comienza con el carácter personal',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440202',
  '550e8400-e29b-41d4-a716-446655440002',
  2,
  'Hábito 1: Ser proactivo',
  'Mientras trabajaba con diversos grupos a lo largo de los años en el desarrollo del liderazgo, me impresionó el impacto de la proactividad en las personas y las organizaciones. **En el nivel más básico, ser proactivo significa tomar responsabilidad por tu propia vida.**

## El espejo social

Si la única visión que tenemos de nosotros mismos proviene del espejo social —las opiniones, percepciones y paradigmas actuales de las personas que nos rodean— nuestra visión de nosotros mismos es como el reflejo en los espejos de circo de un parque de diversiones.

### Los mensajes que recibimos

"Eres siempre tarde."
"No puedes hacer nada bien."
"¡Qué hermosa eres!"
"Eres tan irresponsable."
"No tienes talento para la música."
"Eres un gran atleta."
"No eres académico; eres más del tipo atlético."
"¿Qué está mal contigo?"

Estos reflejos de visiones distorsionadas de otros pueden no ser precisos. Pueden estar fuera de proporción. Pero si creemos en ellos, se convierten en nuestros paradigmas, nuestras verdades, y moldean nuestro comportamiento.

## Entre estímulo y respuesta

**En el espacio entre estímulo y respuesta está nuestro poder para elegir nuestra respuesta. En nuestra respuesta radica nuestro crecimiento y nuestra libertad.**

### La experiencia de Viktor Frankl

Viktor Frankl era un psiquiatra judío que sobrevivió a los campos de concentración nazis. Sus padres, hermano y esposa murieron en los campos o fueron enviados a las cámaras de gas. Excepto por su hermana, toda su familia pereció. Frankl mismo sufrió torturas y innumerables indignidades, nunca sabiendo si viviría para ver el siguiente día.

Un día, desnudo y solo en una pequeña habitación, comenzó a darse cuenta de lo que más tarde llamaría **"la última de las libertades humanas"** —la libertad que sus captores nazis no podían quitarle. Podían controlar todo su entorno, podían hacer lo que quisieran con su cuerpo, pero Viktor Frankl mismo era un ser autoconsciente que podía mirar como observador a su propia participación. Su identidad básica estaba intacta.

### Las cuatro dotaciones humanas únicas

Entre estímulo y respuesta, el hombre tiene la libertad de elegir. Dentro de esa libertad de elegir están esas dotaciones que nos hacen únicamente humanos:

1. **Autoconciencia** - la capacidad de pensar sobre nuestros propios procesos de pensamiento
2. **Imaginación** - la capacidad de crear en nuestras mentes más allá de nuestra realidad presente
3. **Conciencia moral** - una profunda conciencia interior de lo correcto e incorrecto
4. **Voluntad independiente** - la capacidad de actuar basándose en nuestra autoconciencia

## Tomando la iniciativa

Tomar la iniciativa no significa ser insistente, molesto o agresivo. **Significa reconocer nuestra responsabilidad de hacer que las cosas sucedan.**

Durante años he trabajado con personas en situaciones comerciales y organizacionales, y he encontrado que las personas más efectivas son aquellas que toman la iniciativa. No esperan a que otros actúen o que las condiciones cambien. Ven lo que necesita hacerse, y lo hacen.

### El lenguaje reactivo vs. proactivo

**Lenguaje reactivo:**
- "No hay nada que pueda hacer."
- "Así soy yo."
- "Me vuelve loco."
- "No lo permitirán."
- "Tengo que hacer eso."
- "No puedo."
- "Debo."
- "Si tan solo..."

**Lenguaje proactivo:**
- "Veamos nuestras alternativas."
- "Puedo elegir un enfoque diferente."
- "Controlo mis propios sentimientos."
- "Puedo crear una presentación efectiva."
- "Elegiré una respuesta apropiada."
- "Elijo."
- "Prefiero."
- "Haré."

## Círculo de preocupación vs. Círculo de influencia

Cada uno de nosotros tiene una amplia gama de preocupaciones: nuestra salud, nuestros hijos, problemas en el trabajo, la deuda nacional, la guerra nuclear. Podemos separar estas preocupaciones en dos áreas: **Círculo de Preocupación y Círculo de Influencia**.

### El Círculo de Preocupación

El Círculo de Preocupación está lleno de las cosas que nos preocupan: el clima, la economía, la guerra. Estas son cosas sobre las que tenemos poca o ninguna influencia.

### El Círculo de Influencia

El Círculo de Influencia está lleno de las cosas que podemos hacer algo al respecto: nuestro trabajo, nuestra salud, nuestros hijos, nuestros problemas en el trabajo.

### Enfoque proactivo vs. reactivo

**Las personas proactivas** se enfocan sus esfuerzos en el Círculo de Influencia. Trabajan en las cosas con las que pueden hacer algo. La naturaleza de su energía es positiva, ampliadora y magnificadora, causando que su Círculo de Influencia aumente.

**Las personas reactivas**, por otro lado, se enfocan sus esfuerzos en el Círculo de Preocupación. Se enfocan en las debilidades de otras personas, los problemas en el entorno y las circunstancias sobre las que no tienen control. Su enfoque resulta en culpar y acusar, lenguaje reactivo y sentimientos de victimización aumentados.

## Los "tener" y los "ser"

Otra excelente manera de ser más autoconsciente con respecto a nuestro propio grado de proactividad es mirar dónde enfocamos nuestro tiempo y energía. ¿Nos enfocamos en nuestro Círculo de Preocupación o en nuestro Círculo de Influencia?

### Problemas de control directo

Los problemas que involucran nuestro propio comportamiento están en nuestro Círculo de Influencia. Podemos resolverlos trabajando en nuestros hábitos, nuestro carácter, nuestros métodos.

### Problemas de control indirecto

Los problemas que involucran el comportamiento de otras personas están en nuestro Círculo de Influencia. Podemos resolverlos cambiando nuestros métodos de influencia.

### Problemas sin control

Los problemas sobre los que no tenemos control directo o indirecto involucran tomar la responsabilidad de cambiar nuestras actitudes: sonreír, aceptar genuinamente, aprender a vivir con ellos, incluso si no nos gustan.

## Puntos clave del capítulo

1. Ser proactivo significa tomar responsabilidad por tu propia vida
2. Entre estímulo y respuesta tenemos la libertad de elegir
3. Las cuatro dotaciones humanas únicas nos dan el poder de elegir
4. El lenguaje proactivo refleja la capacidad de elegir
5. Enfócate en tu Círculo de Influencia, no en tu Círculo de Preocupación
6. Sé un modelo, no un crítico
7. Los errores están en el pasado, pero las respuestas están en el presente',
  NOW()
);

-- Insert chapters for Inteligencia Emocional
INSERT INTO book_chapters (
  id,
  book_id,
  chapter_number,
  title,
  content,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440301',
  '550e8400-e29b-41d4-a716-446655440003',
  1,
  '¿Para qué sirven las emociones?',
  'En un sentido muy real, **tenemos dos mentes: una que piensa y otra que siente**. Estas dos formas fundamentalmente diferentes de conocimiento interactúan para construir nuestra vida mental. Una, la mente racional, es el modo de comprensión del que somos típicamente conscientes: más prominente en la conciencia, reflexivo, capaz de ponderar y reflexionar. Pero junto a ese existe otro sistema de conocimiento: impulsivo y poderoso, aunque a veces ilógico: la mente emocional.

## El diseño emocional del cerebro

Para comprender el fuerte control que las emociones pueden ejercer sobre el pensamiento, necesitamos considerar cómo evolucionó el cerebro. El cerebro humano, con sus tres libras de células y jugos neuronales, es aproximadamente tres veces más grande que el de nuestros parientes evolutivos más cercanos, los primates no humanos. A lo largo de millones de años de evolución, el cerebro ha crecido desde abajo hacia arriba, con sus centros superiores desarrollándose como elaboraciones de partes inferiores más antiguas.

El crecimiento del cerebro en el embrión humano recapitula aproximadamente este curso evolutivo. La parte más primitiva del cerebro, compartida con todas las especies que tienen más que un sistema nervioso mínimo, es el tronco cerebral que rodea la parte superior de la médula espinal. Este cerebro raíz regula las funciones vitales básicas como la respiración y el metabolismo de los órganos del cuerpo, así como las reacciones y movimientos estereotipados.

## La raíz emocional

Desde la raíz más primitiva, el tronco cerebral, emergieron los centros emocionales. Millones de años después en la evolución, desde estas áreas emocionales evolucionó el cerebro pensante o "neocórtex", el gran bulbo de tejidos plegados que forman las capas superiores. **El hecho de que el cerebro pensante creciera a partir del emocional revela mucho sobre la relación entre pensamiento y sentimiento; había un cerebro emocional mucho antes de que hubiera uno racional.**

### El sistema límbico

La parte del cerebro que evolucionó desde el cerebro reptiliano fue el sistema límbico, que agregó emociones apropiadas para el repertorio de respuestas del cerebro. Cuando estamos dominados por el deseo o la furia, locos de amor o retorciéndonos de miedo, es el sistema límbico el que nos tiene en su poder.

## Cuando las emociones son rápidas y descuidadas

En momentos de crisis emocional, podemos decir que **el secuestro límbico ha tenido lugar**. Estos son momentos en los que el centro emocional del cerebro proclama una emergencia, reclutando al resto del cerebro para su agenda urgente. El secuestro ocurre en un instante, desencadenando esta reacción crucial momentos antes de que la mente pensante, el neocórtex, haya tenido la oportunidad de vislumbrar completamente lo que está sucediendo, y mucho menos decidir si es una buena respuesta.

### La amígdala como centinela emocional

La amígdala en los humanos es una estructura relativamente grande comparada con la de nuestros parientes primates más cercanos. Hay dos amígdalas, una a cada lado del cerebro, anidadas hacia el lado de la cabeza. La amígdala humana es relativamente grande en comparación con la de cualquier primate.

## El propósito de las emociones

**Nuestras emociones, entonces, nos guían cuando enfrentamos momentos difíciles y tareas demasiado importantes para dejarlas solo al intelecto**: peligros, pérdidas dolorosas, persistir hacia una meta a pesar de las frustraciones, vincularse con un compañero, construir una familia. Cada emoción ofrece una disposición distintiva para actuar; cada una nos señala una dirección que ha funcionado bien para manejar los desafíos recurrentes de la vida humana.

### Las emociones como impulsos para actuar

La raíz de la palabra emoción es *motere*, el verbo latino "mover", más el prefijo "e-" para denotar "alejarse", sugiriendo que **una tendencia a actuar está implícita en cada emoción**.

## Las variedades de la experiencia emocional

Los psicólogos debaten si hay un puñado de emociones básicas o varias docenas; no hay consenso sobre esta cuestión. Paul Ekman, el psicólogo de la Universidad de California en San Francisco que ha estudiado más las emociones faciales, argumenta que hay al menos seis emociones básicas: ira, tristeza, miedo, disfrute, amor y sorpresa.

Otros teóricos proponen listas diferentes, pero todos están de acuerdo en que hay algunas emociones básicas. Mi propia lista incluiría las siguientes familias principales, cada una con sus propios núcleos emocionales básicos y sus parientes:

### Las familias emocionales básicas

• **Ira**: furia, indignación, resentimiento, cólera, exasperación, indignación, acrimonia, animosidad, molestia, irritabilidad, hostilidad y, tal vez en el extremo, odio y violencia patológicos.

• **Tristeza**: dolor, pena, desánimo, melancolía, autocompasión, soledad, abatimiento, desesperación y, cuando patológica, depresión severa.

• **Miedo**: ansiedad, aprensión, nerviosismo, preocupación, consternación, cautela, escrúpulo, inquietud, pavor, susto, terror; como psicopatología, fobia y pánico.

• **Disfrute**: felicidad, alegría, alivio, contento, beatitud, deleite, diversión, orgullo, placer sensual, emoción, arrebato, gratificación, satisfacción, euforia, capricho y, en el extremo, manía.

• **Amor**: aceptación, amistad, confianza, amabilidad, afinidad, devoción, adoración, enamoramiento, ágape.

• **Sorpresa**: shock, asombro, desconcierto, maravilla.

## Dos mentes, dos tipos diferentes de inteligencia

Estas dos mentes, la emocional y la racional, operan en armonía la mayor parte del tiempo, entrelazando sus formas muy diferentes de conocimiento para guiarnos a través del mundo. Ordinariamente hay un equilibrio entre mente emocional y racional, con la emoción alimentando e informando las operaciones de la mente racional, y la mente racional refinando y a veces vetando la entrada de las emociones.

Sin embargo, estas son facultades semiindependientes, cada una, como veremos, reflejando la operación de circuitos distintos en el cerebro.

En muchos o la mayoría de los momentos, estas mentes están exquisitamente coordinadas; los sentimientos son esenciales para el pensamiento, el pensamiento para el sentimiento. **Pero cuando las pasiones surgen, el equilibrio se inclina: es la mente emocional la que captura la ventaja, abrumando la mente racional.**

## Puntos clave del capítulo

1. Tenemos dos mentes: una racional y una emocional
2. El cerebro emocional evolucionó antes que el racional
3. Las emociones nos preparan para la acción
4. Cada emoción tiene un propósito evolutivo específico
5. El sistema límbico puede secuestrar la razón en momentos de crisis
6. Las emociones básicas se expresan universalmente en todas las culturas
7. El equilibrio entre emoción y razón es clave para el funcionamiento óptimo',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440302',
  '550e8400-e29b-41d4-a716-446655440003',
  2,
  'Anatomía de un secuestro emocional',
  'La vida es una comedia para aquellos que piensan y una tragedia para aquellos que sienten, escribió Horace Walpole. Su observación apunta a la tensión entre razón y emoción. **Es esta tensión entre el impulso emocional y la razón que hace que el secuestro emocional sea tan problemático**: parece que viene de la nada, desencadenando una reacción que en retrospectiva vemos como desproporcionada a lo que la provocó.

## El asalto neuronal

Estos secuestros emocionales son, por supuesto, momentos cuando **la amígdala, el centro de alarma del cerebro, proclama una emergencia y recluta al resto del cerebro para su agenda urgente**. El secuestro ocurre en un instante, desencadenando esta reacción crucial momentos antes de que el neocórtex, el cerebro pensante, haya tenido la oportunidad de vislumbrar completamente lo que está sucediendo, y mucho menos decidir si es una buena respuesta.

La clave para entender el poder de las emociones en la vida mental proviene de comprender cómo evolucionó el cerebro. El cerebro humano creció desde abajo hacia arriba, evolucionando desde las partes más primitivas hacia las más sofisticadas. La parte más antigua es el tronco cerebral, que regula las funciones básicas de la vida como respirar y el metabolismo.

### La arquitectura del secuestro

Para que la amígdala secuestre, debe activarse antes de que el neocórtex haya tenido tiempo de evaluar completamente lo que está sucediendo y decidir la mejor respuesta. **Este secuestro neural explica por qué podemos hacer cosas en el calor de la pasión de las que luego nos arrepentimos terriblemente.**

## Las emociones que pueden salvar vidas

El papel de la amígdala como centinela emocional, escaneando cada situación, cada percepción, con una pregunta en mente: **"¿Es esto algo que odio? ¿Que me lastima? ¿Algo que temo?"** Si es así, la amígdala reacciona instantáneamente, como una red neuronal de alarma, telegrafía un mensaje de crisis a todas las partes del cerebro.

En el diseño del cerebro, la amígdala es como una compañía de alarma donde los operadores están listos para enviar bomberos, policía y vecinos cada vez que un sistema de alarma doméstico envía una señal de problema. Cuando suena una alarma emocional, la amígdala proclama una emergencia, reclutando al resto del cerebro para su agenda urgente.

### El momento crucial

El momento crucial para el secuestro emocional es en los primeros milisegundos de percepción, cuando decidimos qué es algo. Para la supervivencia es crucial tener esta evaluación: ¿Es esto algo que me come, o algo que puedo comer? ¿Es mi amigo o mi enemigo? ¿Debo acercarme, atacar o huir?

## El especialista en memoria emocional

Pero es como especialista en asuntos emocionales que **la amígdala es suprema**. Si la amígdala es desconectada del resto del cerebro, el resultado es una notable incapacidad para calibrar el significado emocional de los eventos; esta condición a veces se llama "ceguera afectiva".

### El caso de la mujer sin miedo

Una mujer joven cuya amígdala había sido destruida quirúrgicamente para controlar ataques severos perdió toda capacidad de reconocer el miedo en las expresiones faciales de otras personas, aunque podía identificar todas las demás emociones. Para leer el miedo, parece que debemos recurrir a la amígdala.

## El guardián de la memoria emocional

Además de tener conexiones con el neocórtex, la amígdala también tiene un conjunto de conexiones con el hipocampo y estructuras relacionadas, que son clave para la memoria. Es probable que estas dos vías de memoria, una a través del hipocampo y otra a través de la amígdala, expliquen la diferencia entre nuestros recuerdos ordinarios y nuestros recuerdos emocionales.

El hipocampo, que registra y da sentido a los patrones de percepción, es crucial para reconocer el significado de un evento y reaccionar apropiadamente. **Pero es la amígdala, donde se almacenan los recuerdos emocionales, la que determina si una situación particular tiene significado emocional.**

### Recuerdos emocionales vs. recuerdos ordinarios

Los recuerdos que tienen una carga emocional intensa pueden permanecer vívidamente grabados durante décadas. La amígdala, que alberga la memoria emocional, puede provocar una respuesta emocional completa antes de que el neocórtex haya descifrado completamente lo que está sucediendo.

## Alarmas neurales obsoletas

Uno de los problemas de la vida moderna es que **nuestras alarmas emocionales, tan útiles durante la emergencia prehistórica, pueden activarse con demasiada facilidad**. Como LeDoux me dijo: "La amígdala escanea la experiencia entrante, comparándola con lo que sucedió en el pasado. Lo hace mediante un método asociativo, evaluando si la situación actual es similar a algo del pasado al comparar características clave. Es un método crudo: actúa antes de que haya confirmación completa. Salta a conclusiones, reaccionando antes de obtener la imagen completa. No es de extrañar que actuemos de maneras de las que luego nos arrepentimos; la amígdala puede hacernos actuar antes de que el siempre más lento neocórtex despliegue su comprensión más refinada."

### El precio de la velocidad emocional

En la vida emocional, es la velocidad, no solo la precisión, lo que importa. Si esperamos a que el neocórtex haga su análisis completo, podríamos estar muertos. **El inconveniente es que estas impresiones y juicios intuitivos, porque se hacen tan rápidamente, pueden estar equivocados.**

## Controlando la pasión

No todos los impulsos límbicos son desastrosos; cuando una hija ve a su padre después de semanas de separación, la alegría que la impulsa a sus brazos surge del mismo circuito límbico que hace que alguien se encoja de miedo ante una serpiente. En ambos casos, una evaluación límbica inicial impulsa la acción antes de que el neocórtex tenga tiempo de evaluar completamente lo que está sucediendo.

### El arte del autocontrol emocional

El neocórtex no gobierna toda la vida emocional; en asuntos cruciales del corazón —y especialmente en emergencias emocionales— puede decirse que el sistema límbico toma las riendas. **Pero el neocórtex y las estructuras relacionadas que se ramifican desde los lóbulos prefrontales pueden ejercer un veto sobre los impulsos emocionales.**

### Estrategias para el autocontrol

1. **Reconocer el secuestro**: El primer paso es darse cuenta de que está ocurriendo
2. **Pausar antes de actuar**: Crear espacio entre el impulso y la acción
3. **Respirar profundamente**: Activar el sistema nervioso parasimpático
4. **Reencuadrar la situación**: Buscar perspectivas alternativas
5. **Elegir la respuesta**: Decidir conscientemente cómo actuar

## El momento de la verdad emocional

Los sentimientos que vienen a nosotros en forma de secuestro emocional son particularmente potentes; son tan abrumadores que no hay duda de que lo que estamos sintiendo es válido, y por lo tanto no hay tiempo para considerar si nuestra reacción es apropiada.

**En estos momentos emocionales intensos, parece que no tenemos elección sobre cómo reaccionar. Pero sí la tenemos.** No podemos decidir cuándo tener nuestros arrebatos emocionales, pero sí podemos decidir qué hacer una vez que han comenzado.

## Puntos clave del capítulo

1. Los secuestros emocionales ocurren cuando la amígdala actúa antes que el neocórtex
2. La amígdala escanea constantemente en busca de amenazas emocionales
3. Los recuerdos emocionales pueden desencadenar respuestas instantáneas
4. Nuestras alarmas emocionales están calibradas para amenazas prehistóricas
5. La velocidad emocional puede comprometer la precisión
6. El neocórtex puede ejercer control sobre los impulsos emocionales
7. El autocontrol emocional es una habilidad que se puede desarrollar
8. Reconocer el secuestro es el primer paso para controlarlo',
  NOW()
);

-- Only insert sample progress if there's at least one user in auth.users
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Try to get the first user from auth.users
    SELECT id INTO demo_user_id FROM auth.users LIMIT 1;
    
    -- If we found a user, create sample progress
    IF demo_user_id IS NOT NULL THEN
        -- Insert some sample reading progress for the demo user
        INSERT INTO user_book_progress (
          user_id,
          book_id,
          current_page,
          total_pages,
          reading_time_minutes,
          started_at,
          last_read_at,
          created_at,
          updated_at
        ) VALUES 
        (
          demo_user_id,
          '550e8400-e29b-41d4-a716-446655440001',
          45,
          320,
          60,
          NOW() - INTERVAL '3 days',
          NOW() - INTERVAL '1 hour',
          NOW(),
          NOW()
        ),
        (
          demo_user_id,
          '550e8400-e29b-41d4-a716-446655440003',
          89,
          384,
          120,
          NOW() - INTERVAL '7 days',
          NOW() - INTERVAL '2 days',
          NOW(),
          NOW()
        );

        -- Insert some sample bookmarks/notes for the demo user
        INSERT INTO user_book_bookmarks (
          user_id,
          book_id,
          chapter_id,
          page_number,
          chapter_title,
          note,
          bookmark_type,
          created_at
        ) VALUES 
        (
          demo_user_id,
          '550e8400-e29b-41d4-a716-446655440001',
          '550e8400-e29b-41d4-a716-446655440101',
          23,
          'Los Fundamentos',
          'Importante: Los hábitos son el interés compuesto de la superación personal. Mejorar 1% diario = 37x mejor en un año.',
          'note',
          NOW() - INTERVAL '2 days'
        ),
        (
          demo_user_id,
          '550e8400-e29b-41d4-a716-446655440003',
          '550e8400-e29b-41d4-a716-446655440302',
          67,
          'Anatomía de un secuestro emocional',
          'La amígdala reacciona antes que el neocórtex. Por eso actuemos de maneras de las que luego nos arrepentimos.',
          'highlight',
          NOW() - INTERVAL '1 day'
        ),
        (
          demo_user_id,
          '550e8400-e29b-41d4-a716-446655440002',
          '550e8400-e29b-41d4-a716-446655440201',
          15,
          'Paradigmas y principios',
          'El mapa no es el territorio - los paradigmas son mapas mentales que guían nuestro comportamiento.',
          'bookmark',
          NOW() - INTERVAL '5 hours'
        );
        
        RAISE NOTICE 'Sample book progress and bookmarks created for user: %', demo_user_id;
    ELSE
        RAISE NOTICE 'No users found in auth.users table. Sample progress not created.';
    END IF;
END $$;

-- Verify the data was inserted correctly
SELECT 
  b.title,
  b.author,
  b.category,
  b.rating,
  b.is_recommended,
  array_length(b.tags, 1) as tag_count,
  array_length(b.key_topics, 1) as topic_count,
  COUNT(bc.id) as chapter_count
FROM books b
LEFT JOIN book_chapters bc ON b.id = bc.book_id
GROUP BY b.id, b.title, b.author, b.category, b.rating, b.is_recommended, b.tags, b.key_topics
ORDER BY b.created_at DESC;

-- Show sample of bookmarks if any exist
SELECT 
  bb.bookmark_type,
  bb.chapter_title,
  LEFT(bb.note, 50) || '...' as note_preview,
  b.title as book_title
FROM user_book_bookmarks bb
JOIN books b ON bb.book_id = b.id
LIMIT 5;
