-- Reset library with only 3 books and correct table structure
-- Clean existing data first
DELETE FROM user_book_bookmarks;
DELETE FROM user_book_progress;
DELETE FROM book_chapters;
DELETE FROM books;

-- Reset sequences if they exist
ALTER SEQUENCE IF EXISTS books_id_seq RESTART WITH 1;

-- Insert only 3 essential books
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

**El poder sorprendente de los hábitos atómicos**

Es muy fácil sobrestimar la importancia de un momento definitorio y subestimar el valor de hacer pequeñas mejoras diariamente. Con demasiada frecuencia, nos convencemos de que el cambio masivo requiere una acción masiva.

Ya sea perdiendo peso, construyendo un negocio, escribiendo un libro, ganando un campeonato o logrando cualquier otro objetivo, nos presionamos para hacer alguna mejora que capture la atención de todos y hable por sí misma.

Mientras tanto, mejorar en un 1 por ciento no es particularmente notable, a veces ni siquiera es perceptible, pero puede ser mucho más significativo, especialmente a largo plazo. La diferencia que puede hacer una pequeña mejora con el tiempo es asombrosa.

**Cómo los pequeños cambios generan una gran diferencia**

Imagina que tienes un avión que despega de Los Ángeles con destino a Nueva York. Si el piloto ajusta el rumbo solo 3.5 grados hacia el sur, comenzarás dirigiéndote hacia Washington, D.C., en lugar de Nueva York. Este pequeño cambio —apenas perceptible en el despegue— crea una diferencia de 225 millas de distancia al llegar al destino.

De manera similar, un pequeño cambio en tus hábitos diarios puede guiar tu vida hacia un destino completamente diferente. Hacer una elección que es un 1 por ciento mejor o un 1 por ciento peor parece insignificante en el momento, pero a lo largo de toda una vida estas elecciones determinan la diferencia entre quien eres y quien podrías ser.

**Por qué los hábitos importan**

Los hábitos son una espada de doble filo. Los malos hábitos pueden reducirte tanto como los buenos hábitos pueden elevarte, razón por la cual entender los detalles es crucial. Necesitas saber cómo funcionan y cómo diseñarlos a tu favor para que puedas evitar los peligros comunes que hacen que la mayoría de las personas fallen.',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440102',
  '550e8400-e29b-41d4-a716-446655440001',
  2,
  'Cómo tus hábitos moldean tu identidad (y viceversa)',
  'Hay tres niveles en los que puede ocurrir el cambio. Puedes imaginar estos como las capas de una cebolla.

**Los tres niveles de cambio**

El primer nivel es cambiar tus resultados. Este nivel se trata de cambiar lo que obtienes. La mayoría de las metas que te fijas están en este nivel: perder peso, publicar un libro, ganar un campeonato.

El segundo nivel es cambiar tu proceso. Este nivel se trata de cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, organizar tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación.

El tercer y más profundo nivel es cambiar tu identidad. Este nivel se trata de cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y otros.

**El problema con el cambio basado en resultados**

Muchas personas comienzan el proceso de cambiar sus hábitos enfocándose en lo que quieren lograr. Esto los lleva a hábitos basados en resultados. La alternativa es construir hábitos basados en identidad. Con este enfoque, comenzamos enfocándonos en quién deseamos llegar a ser.

Imagina dos personas que rechazan un cigarrillo. Cuando se les ofrece fumar, la primera persona dice: "No, gracias. Estoy tratando de dejar de fumar". Suena como una respuesta razonable, pero esta persona todavía cree que es un fumador que está tratando de ser otra cosa. Espera que su comportamiento cambie mientras se aferra a las mismas creencias.

La segunda persona rechaza diciendo: "No, gracias. No soy fumador". Es una pequeña diferencia, pero esta declaración indica un cambio en la identidad. Fumar era parte de su vida anterior, no de su vida actual. Ya no se ven a sí mismos de esa manera.

**El proceso de dos pasos para cambiar tu identidad**

Tu identidad emerge de tus hábitos. No naces con creencias preestablecidas. Cada creencia, incluidas las que tienes sobre ti mismo, se aprende y se condiciona a través de la experiencia.

Más precisamente, tus hábitos son la forma en que encarnas tu identidad. Cuando haces tu cama cada mañana, encarnas la identidad de una persona organizada. Cuando escribes cada día, encarnas la identidad de una persona creativa. Cuando entrenas cada día, encarnas la identidad de una persona atlética.

Cuanto más repites un comportamiento, más refuerzas la identidad asociada con ese comportamiento. De hecho, la palabra identidad originalmente se derivaba de las palabras latinas essentitas, que significa ser, e identidem, que significa repetidamente. Tu identidad es literalmente tus "hábitos repetidos".

El proceso es un ciclo de retroalimentación de dos pasos:

1. Cada acción es un voto por el tipo de persona que deseas llegar a ser.
2. A medida que tus creencias sobre ti mismo cambian, también cambian tus acciones.

**Decidir el tipo de persona que quieres ser**

La primera pregunta es: ¿Quién es el tipo de persona que podría obtener el resultado que quiero? ¿Quién podría perder cuarenta libras? ¿Quién podría aprender un nuevo idioma? ¿Quién podría dirigir un negocio exitoso?

Por ejemplo, "¿Qué haría una persona saludable?" Una persona saludable caminaría más. Bien, comenzaré a caminar. Una persona saludable comería más verduras. Comenzaré a comer más verduras.

Una vez que tienes una idea del tipo de persona que quieres ser, puedes comenzar a dar pequeños pasos para reforzar tu identidad deseada.',
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
  'La forma en que vemos el problema es el problema. Este libro trata sobre un enfoque de adentro hacia afuera para la efectividad personal e interpersonal. Adentro hacia afuera significa comenzar contigo mismo; más fundamentalmente, comenzar con las partes más internas de ti mismo: tus paradigmas, tu carácter y tus motivos.

**El poder de un paradigma**

El término paradigma proviene del griego. Originalmente era un término científico, y en términos más generales significa un modelo, teoría, percepción, suposición o marco de referencia. En el sentido más general, es la forma en que "vemos" el mundo, no en términos de nuestro sentido de la vista, sino en términos de percibir, entender, interpretar.

Para nuestros propósitos, una forma simple de entender los paradigmas es verlos como mapas. Todos sabemos que "el mapa no es el territorio". Un mapa es simplemente una descripción de ciertos aspectos del territorio. Eso es exactamente lo que es un paradigma. Es una teoría, una explicación o modelo de algo más.

**El poder de un cambio de paradigma**

Quizás recuerdes tu propia experiencia con un cambio de paradigma, ya sea instantáneo o lento y deliberado, cuando de repente viste algo de una manera completamente diferente. Tal vez fue cuando por primera vez viste una imagen que parecía ser una hermosa mujer joven y luego, de repente, viste a una anciana. O tal vez recuerdas un momento en el que de repente viste a una persona de manera diferente, tal vez un jefe o un compañero de trabajo o incluso un cónyuge, y como resultado de esa nueva visión, tus actitudes y comportamientos hacia esa persona cambiaron significativamente.

**Principios de crecimiento y cambio**

Los principios correctos son como brújulas: siempre apuntan el camino. Y si sabemos cómo leer la brújula, no nos perderemos, confundiremos o seremos engañados por voces o valores conflictivos a nuestro alrededor.

Los principios son verdades profundas, fundamentales, verdades clásicas, denominadores comunes. Son hebras estrechamente entretejidas que atraviesan las familias, organizaciones y civilizaciones duraderas y prósperas a lo largo de la historia.

**El principio del crecimiento**

El proceso de crecimiento es progresivo, y debemos pasar por cada etapa. No hay atajos. Esto se aplica a todos los ámbitos de la vida, ya sea aprender a tocar el piano o comunicarse de manera efectiva con un compañero de trabajo. Es "ley natural"; debemos gatear antes de caminar.

**El camino hacia la madurez**

En el área del desarrollo humano, también hay una progresión natural, secuencial. Nos movemos progresivamente en un continuo de madurez desde la dependencia hacia la independencia hacia la interdependencia.

**Dependencia** es el paradigma de tú: tú cuidas de mí; tú vienes por mí cuando no logro; tú eres culpable de los resultados.

**Independencia** es el paradigma de yo: yo puedo hacerlo; yo soy responsable; yo soy autosuficiente; yo puedo elegir.

**Interdependencia** es el paradigma de nosotros: nosotros podemos hacerlo; nosotros podemos cooperar; nosotros podemos combinar nuestros talentos y habilidades y crear algo más grande juntos.',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440202',
  '550e8400-e29b-41d4-a716-446655440002',
  2,
  'Hábito 1: Ser proactivo',
  'Mientras trabajaba con diversos grupos a lo largo de los años en el desarrollo del liderazgo, me impresionó el impacto de la proactividad en las personas y las organizaciones. En el nivel más básico, ser proactivo significa tomar responsabilidad por tu propia vida.

**El espejo social**

Si la única visión que tenemos de nosotros mismos proviene del espejo social —las opiniones, percepciones y paradigmas actuales de las personas que nos rodean— nuestra visión de nosotros mismos es como el reflejo en los espejos de circo de un parque de diversiones.

"Eres siempre tarde."
"No puedes hacer nada bien."
"¡Qué hermosa eres!"
"Eres tan irresponsable."
"No tienes talento para la música."
"Eres un gran atleta."
"No eres académico; eres más del tipo atlético."
"¿Qué está mal contigo?"

Estos reflejos de visiones distorsionadas de otros pueden no ser precisos. Pueden estar fuera de proporción. Pero si creemos en ellos, se convierten en nuestros paradigmas, nuestras verdades, y moldean nuestro comportamiento.

**Entre estímulo y respuesta**

En el espacio entre estímulo y respuesta está nuestro poder para elegir nuestra respuesta. En nuestra respuesta radica nuestro crecimiento y nuestra libertad.

Cuando éramos niños pequeños, éramos muy dependientes, muy vulnerables. Vivíamos en el momento, reaccionando a nuestro entorno, gateando hacia lo que parecía bueno y alejándonos de lo que parecía difícil o amenazante.

A medida que crecimos y maduramos, nos volvimos cada vez más conscientes de que hay algo entre lo que nos sucede (el estímulo) y nuestras acciones (la respuesta). Viktor Frankl sugiere que hay algo más. Él dice que hay tres valores centrales en la vida: los valores creativos, los valores experienciales y los valores actitudinales.

**Tomando la iniciativa**

Tomar la iniciativa no significa ser insistente, molesto o agresivo. Significa reconocer nuestra responsabilidad de hacer que las cosas sucedan.

Durante años he trabajado con personas en situaciones comerciales y organizacionales, y he encontrado que las personas más efectivas son aquellas que toman la iniciativa. No esperan a que otros actúen o que las condiciones cambien. Ven lo que necesita hacerse, y lo hacen.

**Actuar o ser actuado**

Las personas proactivas se enfocan sus esfuerzos en el Círculo de Influencia. Trabajan en las cosas con las que pueden hacer algo. La naturaleza de su energía es positiva, ampliadora y magnificadora, causando que su Círculo de Influencia aumente.

Las personas reactivas, por otro lado, se enfocan sus esfuerzos en el Círculo de Preocupación. Se enfocan en las debilidades de otras personas, los problemas en el entorno y las circunstancias sobre las que no tienen control. Su enfoque resulta en culpar y acusar, lenguaje reactivo y sentimientos de victimización aumentados.',
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
  'En un sentido muy real, tenemos dos mentes: una que piensa y otra que siente. Estas dos formas fundamentalmente diferentes de conocimiento interactúan para construir nuestra vida mental. Una, la mente racional, es el modo de comprensión del que somos típicamente conscientes: más prominente en la conciencia, reflexivo, capaz de ponderar y reflexionar. Pero junto a ese existe otro sistema de conocimiento: impulsivo y poderoso, aunque a veces ilógico: la mente emocional.

**El diseño emocional del cerebro**

Para comprender el fuerte control que las emociones pueden ejercer sobre el pensamiento, necesitamos considerar cómo evolucionó el cerebro. El cerebro humano, con sus tres libras de células y jugos neuronales, es aproximadamente tres veces más grande que el de nuestros parientes evolutivos más cercanos, los primates no humanos. A lo largo de millones de años de evolución, el cerebro ha crecido desde abajo hacia arriba, con sus centros superiores desarrollándose como elaboraciones de partes inferiores más antiguas.

El crecimiento del cerebro en el embrión humano recapitula aproximadamente este curso evolutivo. La parte más primitiva del cerebro, compartida con todas las especies que tienen más que un sistema nervioso mínimo, es el tronco cerebral que rodea la parte superior de la médula espinal. Este cerebro raíz regula las funciones vitales básicas como la respiración y el metabolismo de los órganos del cuerpo, así como las reacciones y movimientos estereotipados.

**La raíz emocional**

Desde la raíz más primitiva, el tronco cerebral, emergieron los centros emocionales. Millones de años después en la evolución, desde estas áreas emocionales evolucionó el cerebro pensante o "neocórtex", el gran bulbo de tejidos plegados que forman las capas superiores. El hecho de que el cerebro pensante creciera a partir del emocional revela mucho sobre la relación entre pensamiento y sentimiento; había un cerebro emocional mucho antes de que hubiera uno racional.

**Cuando las emociones son rápidas y descuidadas**

En momentos de crisis emocional, podemos decir que el secuestro límbico ha tenido lugar. Estos son momentos en los que el centro emocional del cerebro proclama una emergencia, reclutando al resto del cerebro para su agenda urgente. El secuestro ocurre en un instante, desencadenando esta reacción crucial momentos antes de que la mente pensante, el neocórtex, haya tenido la oportunidad de vislumbrar completamente lo que está sucediendo, y mucho menos decidir si es una buena respuesta.

**El propósito de las emociones**

Nuestras emociones, entonces, nos guían cuando enfrentamos momentos difíciles y tareas demasiado importantes para dejarlas solo al intelecto: peligros, pérdidas dolorosas, persistir hacia una meta a pesar de las frustraciones, vincularse con un compañero, construir una familia. Cada emoción ofrece una disposición distintiva para actuar; cada una nos señala una dirección que ha funcionado bien para manejar los desafíos recurrentes de la vida humana.

**Las variedades de la experiencia emocional**

Los psicólogos debaten si hay un puñado de emociones básicas o varias docenas; no hay consenso sobre esta cuestión. Paul Ekman, el psicólogo de la Universidad de California en San Francisco que ha estudiado más las emociones faciales, argumenta que hay al menos seis emociones básicas: ira, tristeza, miedo, disfrute, amor y sorpresa.

Otros teóricos proponen listas diferentes, pero todos están de acuerdo en que hay algunas emociones básicas. Mi propia lista incluiría las siguientes familias principales, cada una con sus propios núcleos emocionales básicos y sus parientes:

• **Ira**: furia, indignación, resentimiento, cólera, exasperación, indignación, acrimonia, animosidad, molestia, irritabilidad, hostilidad y, tal vez en el extremo, odio y violencia patológicos.

• **Tristeza**: dolor, pena, desánimo, melancolía, autocompasión, soledad, abatimiento, desesperación y, cuando patológica, depresión severa.

• **Miedo**: ansiedad, aprensión, nerviosismo, preocupación, consternación, cautela, escrúpulo, inquietud, pavor, susto, terror; como psicopatología, fobia y pánico.',
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440302',
  '550e8400-e29b-41d4-a716-446655440003',
  2,
  'Anatomía de un secuestro emocional',
  'La vida es una comedia para aquellos que piensan y una tragedia para aquellos que sienten, escribió Horace Walpole. Su observación apunta a la tensión entre razón y emoción. Es esta tensión entre el impulso emocional y la razón que hace que el secuestro emocional sea tan problemático: parece que viene de la nada, desencadenando una reacción que en retrospectiva vemos como desproporcionada a lo que la provocó.

**El asalto neuronal**

Estos secuestros emocionales son, por supuesto, momentos cuando la amígdala, el centro de alarma del cerebro, proclama una emergencia y recluta al resto del cerebro para su agenda urgente. El secuestro ocurre en un instante, desencadenando esta reacción crucial momentos antes de que el neocórtex, el cerebro pensante, haya tenido la oportunidad de vislumbrar completamente lo que está sucediendo, y mucho menos decidir si es una buena respuesta.

La clave para entender el poder de las emociones en la vida mental proviene de comprender cómo evolucionó el cerebro. El cerebro humano creció desde abajo hacia arriba, evolucionando desde las partes más primitivas hacia las más sofisticadas. La parte más antigua es el tronco cerebral, que regula las funciones básicas de la vida como respirar y el metabolismo.

**Las emociones que pueden salvar vidas**

El papel de la amígdala como centinela emocional, escaneando cada situación, cada percepción, con una pregunta en mente: "¿Es esto algo que odio? ¿Que me lastima? ¿Algo que temo?" Si es así, la amígdala reacciona instantáneamente, como una red neuronal de alarma, telegrafía un mensaje de crisis a todas las partes del cerebro.

En el diseño del cerebro, la amígdala es como una compañía de alarma donde los operadores están listos para enviar bomberos, policía y vecinos cada vez que un sistema de alarma doméstico envía una señal de problema. Cuando suena una alarma emocional, la amígdala proclama una emergencia, reclutando al resto del cerebro para su agenda urgente.

**El especialista en memoria emocional**

Pero es como especialista en asuntos emocionales que la amígdala es suprema. Si la amígdala es desconectada del resto del cerebro, el resultado es una notable incapacidad para calibrar el significado emocional de los eventos; esta condición a veces se llama "ceguera afectiva".

**El guardián de la memoria emocional**

Además de tener conexiones con el neocórtex, la amígdala también tiene un conjunto de conexiones con el hipocampo y estructuras relacionadas, que son clave para la memoria. Es probable que estas dos vías de memoria, una a través del hipocampo y otra a través de la amígdala, expliquen la diferencia entre nuestros recuerdos ordinarios y nuestros recuerdos emocionales.

El hipocampo, que registra y da sentido a los patrones de percepción, es crucial para reconocer el significado de un evento y reaccionar apropiadamente. Pero es la amígdala, donde se almacenan los recuerdos emocionales, la que determina si una situación particular tiene significado emocional.

**Alarmas neurales obsoletas**

Uno de los problemas de la vida moderna es que nuestras alarmas emocionales, tan útiles durante la emergencia prehistórica, pueden activarse con demasiada facilidad. Como LeDoux me dijo: "La amígdala escanea la experiencia entrante, comparándola con lo que sucedió en el pasado. Lo hace mediante un método asociativo, evaluando si la situación actual es similar a algo del pasado al comparar características clave. Es un método crudo: actúa antes de que haya confirmación completa. Salta a conclusiones, reaccionando antes de obtener la imagen completa. No es de extrañar que actuemos de maneras de las que luego nos arrepentimos; la amígdala puede hacernos actuar antes de que el siempre más lento neocórtex despliegue su comprensión más refinada."',
  NOW()
);

-- Create a demo user first (this should match an existing auth.users record)
-- Note: In production, this would be handled by Supabase Auth registration
-- For demo purposes, we'll check if a demo user exists and create sample progress

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
          page_number,
          chapter_title,
          note,
          created_at
        ) VALUES 
        (
          demo_user_id,
          '550e8400-e29b-41d4-a716-446655440001',
          23,
          'Los Fundamentos',
          'Importante: Los hábitos son el interés compuesto de la superación personal. Mejorar 1% diario = 37x mejor en un año.',
          NOW() - INTERVAL '2 days'
        ),
        (
          demo_user_id,
          '550e8400-e29b-41d4-a716-446655440003',
          67,
          'Anatomía de un secuestro emocional',
          'La amígdala reacciona antes que el neocórtex. Por eso actuamos de maneras de las que luego nos arrepentimos.',
          NOW() - INTERVAL '1 day'
        );
        
        RAISE NOTICE 'Sample book progress created for user: %', demo_user_id;
    ELSE
        RAISE NOTICE 'No users found in auth.users table. Sample progress not created.';
    END IF;
END $$;

-- Verify the data was inserted correctly
SELECT 
  title,
  author,
  category,
  rating,
  is_recommended,
  array_length(tags, 1) as tag_count,
  array_length(key_topics, 1) as topic_count
FROM books 
ORDER BY created_at DESC;
