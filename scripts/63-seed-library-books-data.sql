-- Clear existing data
DELETE FROM public.user_book_notes;
DELETE FROM public.user_book_bookmarks;
DELETE FROM public.user_book_progress;
DELETE FROM public.library_book_chapters;
DELETE FROM public.library_books;

-- Insert sample books
INSERT INTO public.library_books (
    id, title, author, description, cover_image, category, difficulty, 
    estimated_reading_time, pages, published_year, rating, tags, key_topics, is_recommended
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Hábitos Atómicos',
    'James Clear',
    'Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos.',
    '/books/atomic-habits.jpg',
    'Desarrollo Personal',
    'Intermedio',
    240,
    320,
    2018,
    4.8,
    ARRAY['hábitos', 'productividad', 'autoayuda'],
    ARRAY['Formación de hábitos', 'Cambio de comportamiento', 'Productividad personal'],
    true
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Los 7 Hábitos de la Gente Altamente Efectiva',
    'Stephen R. Covey',
    'Un enfoque integral para la efectividad personal y profesional.',
    '/books/7-habits.jpg',
    'Liderazgo',
    'Intermedio',
    320,
    380,
    1989,
    4.7,
    ARRAY['liderazgo', 'efectividad', 'principios'],
    ARRAY['Liderazgo personal', 'Efectividad', 'Principios universales'],
    true
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Trabajo Profundo',
    'Cal Newport',
    'Reglas para el éxito enfocado en un mundo distraído.',
    '/books/deep-work.jpg',
    'Productividad',
    'Avanzado',
    280,
    296,
    2016,
    4.6,
    ARRAY['concentración', 'productividad', 'enfoque'],
    ARRAY['Concentración profunda', 'Gestión de distracciones', 'Productividad cognitiva'],
    true
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    'Inteligencia Emocional',
    'Daniel Goleman',
    'Por qué es más importante que el cociente intelectual.',
    '/books/emotional-intelligence.jpg',
    'Psicología',
    'Intermedio',
    300,
    352,
    1995,
    4.5,
    ARRAY['inteligencia emocional', 'psicología', 'liderazgo'],
    ARRAY['Autoconciencia', 'Autorregulación', 'Empatía', 'Habilidades sociales'],
    true
),
(
    '550e8400-e29b-41d4-a716-446655440005',
    'Lean In',
    'Sheryl Sandberg',
    'Las mujeres, el trabajo y la voluntad de liderar.',
    '/books/lean-in.jpg',
    'Liderazgo',
    'Intermedio',
    250,
    240,
    2013,
    4.4,
    ARRAY['liderazgo femenino', 'carrera profesional', 'igualdad'],
    ARRAY['Liderazgo femenino', 'Desarrollo profesional', 'Igualdad de género'],
    true
),
(
    '550e8400-e29b-41d4-a716-446655440006',
    'Mindset',
    'Carol S. Dweck',
    'La nueva psicología del éxito.',
    '/books/mindset.jpg',
    'Psicología',
    'Principiante',
    220,
    276,
    2006,
    4.6,
    ARRAY['mentalidad', 'crecimiento', 'psicología'],
    ARRAY['Mentalidad de crecimiento', 'Aprendizaje', 'Resiliencia'],
    true
),
(
    '550e8400-e29b-41d4-a716-446655440007',
    'El Poder del Ahora',
    'Eckhart Tolle',
    'Una guía hacia la iluminación espiritual.',
    '/books/power-of-now.jpg',
    'Espiritualidad',
    'Intermedio',
    200,
    236,
    1997,
    4.3,
    ARRAY['mindfulness', 'espiritualidad', 'presente'],
    ARRAY['Mindfulness', 'Conciencia presente', 'Transformación personal'],
    false
),
(
    '550e8400-e29b-41d4-a716-446655440008',
    'Good to Great',
    'Jim Collins',
    'Por qué algunas empresas dan el salto... y otras no.',
    '/books/good-to-great.jpg',
    'Negocios',
    'Avanzado',
    350,
    300,
    2001,
    4.5,
    ARRAY['liderazgo empresarial', 'estrategia', 'excelencia'],
    ARRAY['Liderazgo empresarial', 'Transformación organizacional', 'Excelencia operativa'],
    true
),
(
    '550e8400-e29b-41d4-a716-446655440009',
    'La Semana Laboral de 4 Horas',
    'Timothy Ferriss',
    'Escapa de la rutina de 9-5, vive en cualquier lugar y únete a los nuevos ricos.',
    '/books/4-hour-workweek.jpg',
    'Emprendimiento',
    'Intermedio',
    280,
    308,
    2007,
    4.2,
    ARRAY['emprendimiento', 'libertad financiera', 'productividad'],
    ARRAY['Automatización', 'Libertad geográfica', 'Emprendimiento digital'],
    false
),
(
    '550e8400-e29b-41d4-a716-446655440010',
    'Conversaciones Cruciales',
    'Kerry Patterson',
    'Herramientas para hablar cuando hay mucho en juego.',
    '/books/crucial-conversations.jpg',
    'Comunicación',
    'Intermedio',
    240,
    288,
    2002,
    4.4,
    ARRAY['comunicación', 'negociación', 'conflictos'],
    ARRAY['Comunicación efectiva', 'Resolución de conflictos', 'Negociación'],
    true
);

-- Insert chapters for Hábitos Atómicos
INSERT INTO public.library_book_chapters (id, book_id, title, content, "order") VALUES 
(
    'chapter-1-atomic-habits',
    '550e8400-e29b-41d4-a716-446655440001',
    'Introducción: Mi Historia',
    'En el segundo año de la escuela secundaria, me golpearon en la cara con un bate de béisbol. Mientras esperaba mi turno durante la práctica de bateo, un compañero de equipo perdió el control de su swing y el bate me golpeó directamente entre los ojos.

No recuerdo los primeros días en el hospital. Según los informes médicos, sufrí una fractura nasal, múltiples fracturas en el cráneo y dos ojos morados. La lesión más grave fue una conmoción cerebral masiva.

Los médicos me informaron que mi recuperación sería larga y difícil. Durante meses, luché con síntomas que incluían náuseas constantes, dolores de cabeza severos y dificultades para concentrarme. Mi rendimiento académico se desplomó, y tuve que repetir mi segundo año.

Sin embargo, esta experiencia traumática se convirtió en el catalizador de una transformación extraordinaria. Durante mi lenta recuperación, comencé a desarrollar pequeños hábitos que, con el tiempo, cambiarían completamente mi vida.

## El Poder de los Pequeños Cambios

La mayoría de las personas subestiman el poder de los pequeños cambios. Pensamos que para lograr grandes resultados necesitamos tomar grandes acciones. Pero la realidad es diferente.

Los hábitos son el interés compuesto del auto-mejoramiento. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican mientras los repites.

Un cambio del 1% no parece mucho en el momento, pero los efectos se acumulan con el tiempo. Esto es lo que llamo "hábitos atómicos": pequeños cambios que forman parte de un sistema más grande.

## Mi Sistema de Hábitos

Durante mi recuperación, desarrollé un sistema simple pero poderoso:

1. **Empezar pequeño**: En lugar de intentar cambios dramáticos, me enfoqué en mejoras mínimas.

2. **Ser consistente**: La consistencia era más importante que la perfección.

3. **Enfocarse en el sistema, no en las metas**: En lugar de obsesionarme con los resultados, me concentré en el proceso.

4. **Hacer que los buenos hábitos fueran obvios, atractivos, fáciles y satisfactorios**.

Este enfoque me ayudó no solo a recuperarme de mi lesión, sino a prosperar de maneras que nunca había imaginado. Regresé al equipo de béisbol, fui seleccionado como capitán, y eventualmente recibí una beca académica para la universidad.

## La Ciencia de los Hábitos

Los hábitos no son solo rutinas personales; son la base de toda mejora. Cada acción que tomas es un voto por el tipo de persona que deseas convertirte.

La investigación muestra que aproximadamente el 40-45% de nuestras acciones diarias son hábitos. Esto significa que casi la mitad de lo que hacemos cada día no es realmente una decisión, sino un hábito.

Por eso es tan importante desarrollar buenos hábitos. No se trata solo de lograr un objetivo específico, sino de convertirte en el tipo de persona que puede lograr esos objetivos de manera consistente.

## El Camino Adelante

En este libro, compartiré contigo el sistema exacto que uso para construir buenos hábitos y eliminar los malos. Aprenderás:

- Por qué los pequeños cambios hacen una gran diferencia
- Cómo formar un nuevo hábito en solo unos minutos al día
- Cómo superar la falta de motivación y fuerza de voluntad
- Cómo diseñar tu entorno para el éxito
- Cómo recuperarte cuando te desvías del camino

Los hábitos atómicos no son solo otra técnica de productividad. Son una forma de vida. Son pequeños cambios que pueden transformar tu vida de maneras extraordinarias.

Comencemos este viaje juntos.',
    1
),
(
    'chapter-2-atomic-habits',
    '550e8400-e29b-41d4-a716-446655440001',
    'Capítulo 1: El Sorprendente Poder de los Hábitos Atómicos',
    'Es muy fácil sobrestimar la importancia de un momento definitorio y subestimar el valor de hacer pequeñas mejoras diariamente. Con demasiada frecuencia, nos convencemos de que el cambio masivo requiere una acción masiva.

Ya sea perdiendo peso, construyendo un negocio, escribiendo un libro, ganando un campeonato, o logrando cualquier otra meta, nos presionamos para hacer alguna mejora que capture la atención de todos.

Mientras tanto, mejorar en un 1% no es particularmente notable, a veces ni siquiera es perceptible, pero puede ser mucho más significativo, especialmente a largo plazo.

## La Matemática de las Pequeñas Mejoras

Si puedes mejorar en un 1% cada día durante un año, terminarás siendo treinta y siete veces mejor al final del año. Por el contrario, si empeoras en un 1% cada día durante un año, caerás casi a cero.

1% mejor cada día: 1.01^365 = 37.78
1% peor cada día: 0.99^365 = 0.03

Lo que comienza como una pequeña ganancia o una pérdida menor se acumula en algo mucho más significativo.

## Los Hábitos Son el Interés Compuesto del Auto-Mejoramiento

Los hábitos son el interés compuesto del auto-mejoramiento. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican mientras los repites. Parecen hacer poca diferencia en un día dado, pero el impacto que entregan durante meses y años puede ser enorme.

Solo cuando miramos hacia atrás, dos, cinco o diez años después, el valor de los buenos hábitos y el costo de los malos se vuelve sorprendentemente aparente.

## El Valle de la Decepción

Imagina que tienes un cubo de hielo sentado en la mesa frente a ti. La habitación está fría y puedes ver tu aliento. Está a -10°C. Lentamente, la habitación comienza a calentarse.

-9°C... -8°C... -7°C...

El hielo sigue siendo sólido. Nada ha cambiado visiblemente.

-6°C... -5°C... -4°C...

Todavía nada. El cubo de hielo sigue intacto.

-3°C... -2°C... -1°C...

Aún sólido. Nada parece estar sucediendo.

0°C...

El hielo comienza a derretirse. Un cambio de un grado, aparentemente no diferente de los aumentos de temperatura que lo precedieron, ha desencadenado una transformación desproporcionada.

Los momentos de avance a menudo son el resultado de muchas acciones previas, que construyen el potencial requerido para desencadenar un cambio importante.

## Olvida las Metas, Enfócate en los Sistemas

Si eres entrenador, tu meta podría ser ganar un campeonato. Tu sistema es la forma en que recluta jugadores, administra a tus asistentes y diriges las prácticas.

Si eres empresario, tu meta podría ser construir un negocio de un millón de dólares. Tu sistema es cómo pruebas ideas de productos, contratas empleados y ejecutas campañas de marketing.

Si eres músico, tu meta podría ser tocar una nueva pieza. Tu sistema es la frecuencia con la que practicas, cómo desglosas y abordas elementos difíciles, y tu método para recibir comentarios de tu instructor.

## Los Problemas con el Enfoque en las Metas

**Problema #1: Los ganadores y perdedores tienen las mismas metas.**

Cada atleta olímpico quiere ganar una medalla de oro. Cada candidato quiere conseguir el trabajo. Y si los exitosos y los no exitosos comparten las mismas metas, entonces la meta no puede ser lo que diferencia a los ganadores de los perdedores.

**Problema #2: Lograr una meta es solo un cambio momentáneo.**

Imagina que tienes una habitación desordenada y estableces la meta de limpiarla. Si reúnes la energía para ordenar, entonces tendrás una habitación limpia, por ahora. Pero si mantienes los mismos hábitos descuidados que llevaron a una habitación desordenada en primer lugar, pronto estarás mirando una nueva pila de desorden.

**Problema #3: Las metas restringen tu felicidad.**

La suposición implícita detrás de cualquier meta es: "Una vez que logre mi meta, seré feliz." El problema con una mentalidad de "primero la meta" es que continuamente pospones la felicidad hasta el próximo hito.

**Problema #4: Las metas están en desacuerdo con el progreso a largo plazo.**

Finalmente, una mentalidad orientada a metas puede crear un efecto "yo-yo". Muchas personas trabajan duro hasta que alcanzan una meta y luego se relajan. Es como correr una carrera, cruzar la línea de meta y luego dejar de correr.

## Un Sistema de Hábitos Atómicos

Si tienes problemas para cambiar tus hábitos, el problema no eres tú. El problema es tu sistema. Los malos hábitos se repiten una y otra vez no porque no quieras cambiar, sino porque tienes el sistema equivocado para el cambio.

No te elevas al nivel de tus metas. Caes al nivel de tus sistemas.

En este libro, aprenderás un sistema para cambiar tus hábitos. Pero primero, necesitamos aclarar exactamente qué es un hábito y cómo funciona.',
    2
),
(
    'chapter-3-atomic-habits',
    '550e8400-e29b-41d4-a716-446655440001',
    'Capítulo 2: Cómo Tus Hábitos Moldean Tu Identidad (y Viceversa)',
    'Por qué es tan fácil repetir los malos hábitos y tan difícil formar buenos? Pocas cosas pueden tener un impacto más poderoso en tu vida que mejorar tus hábitos diarios. Y sin embargo, es probable que esta vez el próximo año estarás haciendo las mismas cosas que estás haciendo hoy.

A menudo despedimos los pequeños cambios porque no parecen importar mucho en el momento. Si ahorras un poco de dinero ahora, sigues sin ser millonario. Si vas al gimnasio tres días seguidos, sigues fuera de forma. Si estudias mandarín durante una hora esta noche, aún no hablas el idioma. Hacemos algunos cambios, pero los resultados nunca parecen llegar rápidamente y así volvemos a nuestras viejas rutinas.

Desafortunadamente, el lento ritmo de transformación también hace que sea fácil dejar que un mal día se convierta en un mal mes o año. Si comes una hamburguesa poco saludable, la báscula no se mueve mucho. Si trabajas hasta tarde esta noche e ignoras a tu familia, no se divorciarán. Si procrastinas y pones tu proyecto para mañana, normalmente todavía habrá tiempo para terminarlo más tarde. Un solo error es fácil de descartar.

Pero cuando repetimos errores del 1 por ciento, día tras día, replicando decisiones pobres, duplicando pequeños errores, y racionalizando pequeñas excusas, nuestras pequeñas elecciones se combinan para producir resultados tóxicos. Es la acumulación de muchos pasos en falso—un 1 por ciento de declive aquí y allá—lo que eventualmente lleva a un problema.

## Los Tres Niveles de Cambio

El cambio puede ocurrir en tres niveles. Puedes imaginar estos niveles como las capas de una cebolla.

**Nivel 1: Cambiar tus resultados**
Este nivel se trata de cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato. La mayoría de las metas que te fijas están en este nivel.

**Nivel 2: Cambiar tu proceso**
Este nivel se trata de cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, decluttering tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación. La mayoría de los hábitos que construyes están en este nivel.

**Nivel 3: Cambiar tu identidad**
Este nivel se trata de cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y otros. La mayoría de las creencias, suposiciones y sesgos que tienes están en este nivel.

Los resultados son sobre lo que obtienes. Los procesos son sobre lo que haces. La identidad es sobre lo que crees.

## El Verdadero Cambio de Comportamiento es Cambio de Identidad

Imagina a dos personas resistiendo un cigarrillo. Cuando se les ofrece un humo, la primera persona dice, "No gracias. Estoy tratando de dejar de fumar." Suena como una respuesta razonable, pero esta persona todavía cree que es un fumador que está tratando de ser algo más. Esperan que su comportamiento cambie mientras se aferran a la misma creencia.

La segunda persona declina diciendo, "No gracias. No soy fumador." Es una pequeña diferencia, pero esta declaración viene de una identidad diferente. Ya no se ven a sí mismos como fumadores.

La mayoría de las personas ni siquiera consideran el cambio de identidad cuando se proponen mejorar. Solo piensan: "Quiero ser delgado" y nunca: "Quiero ser el tipo de persona que se mueve más cada día." "Quiero aprender español" y nunca: "Quiero ser el tipo de persona que es consistente y confiable."

## El Proceso de Dos Pasos para Cambiar Tu Identidad

Tu identidad emerge de tus hábitos. No naces con creencias preestablecidas. Cada creencia, incluyendo aquellas sobre ti mismo, se aprende y se condiciona a través de la experiencia.

Más precisamente, tus hábitos son cómo encarnas tu identidad. Cuando haces tu cama cada mañana, encarnas la identidad de una persona organizada. Cuando escribes cada día, encarnas la identidad de una persona creativa. Cuando entrenas cada día, encarnas la identidad de una persona atlética.

Cuanto más repites un comportamiento, más refuerzas la identidad asociada con ese comportamiento. De hecho, la palabra identidad originalmente se derivó de las palabras latinas essentitas, que significa ser, e identidem, que significa repetidamente. Tu identidad es literalmente tus "seres repetidos."

El proceso es un bucle de retroalimentación de dos pasos:

1. Cada acción que tomas es un voto por el tipo de persona que deseas convertirte.
2. A medida que tus creencias sobre ti mismo cambian, también lo hacen tus acciones.

Es un proceso gradual. O te conviertes en la persona que deseas ser a través de pequeñas victorias, o permaneces atrapado en un ciclo destructivo y refuerzas una identidad que no deseas.',
    3
);

-- Insert a few chapters for other books as well
INSERT INTO public.library_book_chapters (id, book_id, title, content, "order") VALUES 
(
    'chapter-1-7-habits',
    '550e8400-e29b-41d4-a716-446655440002',
    'Paradigmas y Principios',
    'La forma en que vemos el problema es el problema. Este libro trata sobre un enfoque de adentro hacia afuera para la efectividad personal e interpersonal. Adentro hacia afuera significa empezar contigo mismo; más fundamentalmente, empezar con las partes más internas de ti mismo: tus paradigmas, tu carácter y tus motivos.

## El Poder de un Paradigma

Casi todos tenemos paradigmas en nuestras cabezas, mapas mentales que nos ayudan a interpretar todo lo que experimentamos. Rara vez cuestionamos estos mapas mentales. Generalmente ni siquiera somos conscientes de que los tenemos. Simplemente asumimos que la forma en que vemos las cosas es la forma en que realmente son o la forma en que deberían ser.

Estos paradigmas son la fuente de nuestras actitudes y comportamientos. No podemos actuar con integridad fuera de ellos. Simplemente no podemos mantener comportamientos que son inconsistentes con nuestros paradigmas.

## Principios de Crecimiento y Cambio

Los principios son leyes naturales en la dimensión humana que son tan reales, tan constantes y tan indiscutibles como la gravedad en la dimensión física. Los principios no son prácticas. Una práctica es una actividad o acción específica. Una práctica que funciona en una circunstancia no necesariamente funcionará en otra.

Los principios, por el contrario, son verdades profundas, fundamentales, verdades clásicas, denominadores comunes. Son hebras estrechamente tejidas que corren con exactitud, consistencia, belleza y fuerza a través del tejido de la vida.

## El Continuum de la Madurez

Los 7 Hábitos no son un conjunto de fórmulas separadas o fragmentadas. En armonía con las leyes naturales del crecimiento, proporcionan un enfoque incremental, secuencial y altamente integrado para el desarrollo de la efectividad personal e interpersonal.

Nos mueven progresivamente en un Continuum de Madurez desde la dependencia hasta la independencia hasta la interdependencia.',
    1
);
