-- Insert sample books with proper UUIDs
INSERT INTO library_books (id, title, author, description, cover_image, category, difficulty, rating, estimated_reading_time, pages, tags, key_topics, is_recommended) VALUES
('00000000-0000-0000-0000-000000000001', 'Hábitos Atómicos', 'James Clear', 'Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos. James Clear nos brinda estrategias prácticas que nos enseñarán exactamente cómo formar buenos hábitos, romper los malos, y dominar los pequeños comportamientos que llevan a resultados notables.', '/books/atomic-habits.jpg', 'Desarrollo Personal', 'Intermedio', 4.8, 240, 320, ARRAY['hábitos', 'productividad', 'autoayuda', 'cambio personal'], ARRAY['Formación de hábitos', 'Cambio de comportamiento', 'Productividad', 'Psicología del cambio'], true),

('00000000-0000-0000-0000-000000000002', 'Los 7 Hábitos de la Gente Altamente Efectiva', 'Stephen R. Covey', 'Un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales. Covey presenta un camino claro para vivir con equidad, integridad, honestidad y dignidad humana, principios que nos dan la seguridad para adaptarnos al cambio.', '/books/7-habits.jpg', 'Liderazgo', 'Intermedio', 4.7, 300, 380, ARRAY['liderazgo', 'efectividad', 'principios', 'desarrollo personal'], ARRAY['Liderazgo personal', 'Efectividad', 'Principios universales', 'Carácter'], true),

('00000000-0000-0000-0000-000000000003', 'Trabajo Profundo', 'Cal Newport', 'En una economía cada vez más competitiva, aquellos que puedan dominar la habilidad de producir trabajo de alta calidad de manera rápida y eficiente prosperarán. Newport argumenta que la capacidad de concentrarse sin distracciones en una tarea cognitivamente exigente es una habilidad que se está volviendo cada vez más valiosa.', '/books/deep-work.jpg', 'Productividad', 'Avanzado', 4.6, 280, 296, ARRAY['concentración', 'productividad', 'trabajo', 'enfoque'], ARRAY['Concentración profunda', 'Eliminación de distracciones', 'Productividad cognitiva'], true),

('00000000-0000-0000-0000-000000000004', 'Inteligencia Emocional', 'Daniel Goleman', 'Goleman explica por qué la inteligencia emocional puede ser más importante que el coeficiente intelectual. Aprende a desarrollar la autoconciencia, autorregulación, motivación, empatía y habilidades sociales.', '/books/emotional-intelligence.jpg', 'Psicología', 'Intermedio', 4.5, 320, 352, ARRAY['inteligencia emocional', 'psicología', 'relaciones', 'autoconocimiento'], ARRAY['Autoconciencia', 'Autorregulación', 'Empatía', 'Habilidades sociales'], true),

('00000000-0000-0000-0000-000000000005', 'Lean In', 'Sheryl Sandberg', 'La COO de Facebook examina por qué el progreso de las mujeres en el logro de roles de liderazgo se ha estancado, explica las causas fundamentales y ofrece soluciones convincentes y prácticas para permitir que todas las mujeres alcancen su máximo potencial.', '/books/lean-in.jpg', 'Liderazgo', 'Intermedio', 4.4, 260, 240, ARRAY['liderazgo femenino', 'carrera profesional', 'igualdad', 'empoderamiento'], ARRAY['Liderazgo femenino', 'Desarrollo profesional', 'Igualdad de género'], true);

-- Insert chapters for Hábitos Atómicos
INSERT INTO library_book_chapters (id, book_id, title, content, "order") VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Introducción: Mi historia', 
'# Mi historia

En el segundo año de la escuela secundaria, me golpearon en la cara con un bate de béisbol. Mientras mi compañero de clase hacía un swing de práctica, yo estaba parado detrás de él esperando mi turno. El bate me golpeó directamente entre los ojos.

No recuerdo los primeros días en el hospital. Tenía una fractura masiva en el centro de mi cara, múltiples huesos rotos y una conmoción cerebral severa. Los médicos me dijeron que mi lesión era potencialmente mortal.

## El camino de regreso

Durante los meses siguientes, comencé el lento proceso de recuperación. No podía hacer mucho, pero podía hacer algo: podía comenzar con hábitos increíblemente pequeños.

Comencé con lo básico:
- Hacer mi cama cada mañana
- Escribir una página en mi diario cada día
- Leer durante 10 minutos antes de dormir

Estos hábitos parecían pequeños e insignificantes, pero se acumularon en algo mucho más grande. En los años siguientes, continué construyendo sobre estos fundamentos.

## La revelación

Fue entonces cuando me di cuenta del poder de los hábitos atómicos. Los cambios que parecen pequeños e insignificantes al principio se componen en resultados notables si estás dispuesto a mantenerlos durante años.

Este es el significado de los hábitos atómicos: un sistema regular de pequeñas mejoras. En el transcurso de este libro, compartiré contigo exactamente cómo puedes usar este sistema para transformar tu vida.

## Lo que aprenderás

En las páginas siguientes, aprenderás:
- Por qué los pequeños cambios generan una gran diferencia
- Cómo formar un buen hábito y romper uno malo
- Las cuatro leyes del cambio de comportamiento
- Cómo superar la falta de motivación y fuerza de voluntad

Los hábitos son el interés compuesto de la superación personal. Así como el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites.', 1),

('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'Capítulo 1: El sorprendente poder de los hábitos atómicos',
'# El sorprendente poder de los hábitos atómicos

Es muy fácil sobrestimar la importancia de un momento definitorio y subestimar el valor de hacer pequeñas mejoras diariamente. Con demasiada frecuencia, nos convencemos de que el cambio masivo requiere una acción masiva.

## La agregación de ganancias marginales

En 2003, el equipo de ciclismo británico contrató a Dave Brailsford como su nuevo director de rendimiento. En ese momento, los ciclistas profesionales británicos habían tenido un rendimiento tan pobre durante casi cien años que una de las principales compañías de bicicletas de Europa se negó a venderles bicicletas porque temían que dañara las ventas si otros ciclistas las vieran usando sus bicicletas.

Brailsford creía en un concepto que él denominó "la agregación de ganancias marginales". Su filosofía era simple: si pudieras mejorar cada área relacionada con el ciclismo en solo un 1 por ciento, entonces esas pequeñas ganancias se sumarían a una mejora notable.

## Los pequeños cambios, grandes resultados

Comenzaron optimizando las cosas obvias:
- La nutrición de los ciclistas
- Sus programas de entrenamiento  
- La ergonomía de los asientos de las bicicletas
- El peso de las llantas

Pero Brailsford y su equipo no se detuvieron ahí. Buscaron mejoras del 1 por ciento en áreas que otros equipos pasaban por alto:
- Probaron diferentes tipos de aceites de masaje para ver cuál llevaba a la recuperación muscular más rápida
- Contrataron a un cirujano para enseñar a cada ciclista la forma adecuada de lavarse las manos para reducir las posibilidades de contraer un resfriado
- Determinaron el tipo de almohada y colchón que llevaba al mejor sueño nocturno para cada ciclista

## Los resultados

Solo cinco años después de que Brailsford asumiera el cargo, el equipo de ciclismo británico dominó los eventos de ciclismo en carretera y pista en los Juegos Olímpicos de 2008 en Beijing.

Cuatro años después, cuando llegaron los Juegos Olímpicos de Londres de 2012, los británicos establecieron nueve récords olímpicos y siete récords mundiales.

## El poder del 1 por ciento

Los hábitos son el interés compuesto de la superación personal. Los efectos de tus hábitos se multiplican a medida que los repites. Parecen hacer poca diferencia en un día dado y, sin embargo, el impacto que entregan durante meses y años puede ser enorme.

Si puedes mejorar un 1 por ciento cada día durante un año, terminarás siendo treinta y siete veces mejor al final del año. Por el contrario, si empeoras un 1 por ciento cada día durante un año, caerás casi a cero.

**1% mejor cada día = 1.01^365 = 37.78**
**1% peor cada día = 0.99^365 = 0.03**

Los pequeños cambios a menudo parecen no marcar la diferencia hasta que cruzas un umbral crítico. Los resultados más poderosos de cualquier proceso compuesto se retrasan. Necesitas ser paciente.', 2),

('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'Capítulo 2: Cómo tus hábitos moldean tu identidad (y viceversa)',
'# Cómo tus hábitos moldean tu identidad (y viceversa)

¿Por qué es tan fácil repetir los malos hábitos y tan difícil seguir los buenos? Pocas cosas pueden tener un impacto más poderoso en tu vida que mejorar tus hábitos diarios. Y sin embargo, es probable que este tiempo el próximo año estarás haciendo las mismas cosas que estás haciendo hoy.

## Los tres niveles de cambio

Puedes imaginar los cambios que ocurren en tres niveles:

### Nivel 1: Cambiar tus resultados
Este nivel se trata de cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato. La mayoría de las metas que te fijas están en este nivel.

### Nivel 2: Cambiar tu proceso  
Este nivel se trata de cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, organizar tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación. La mayoría de los hábitos que construyes están en este nivel.

### Nivel 3: Cambiar tu identidad
Este nivel se trata de cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y otros. La mayoría de las creencias, suposiciones y sesgos que tienes están en este nivel.

## El problema con el cambio basado en resultados

Muchas personas comienzan el proceso de cambiar sus hábitos enfocándose en lo que quieren lograr. Esto los lleva a hábitos basados en resultados. La alternativa es construir hábitos basados en identidad.

Con este enfoque, comenzamos enfocándonos en quién deseamos convertirnos.

## Ejemplos de cambio de identidad

- El objetivo no es leer un libro, el objetivo es convertirse en lector.
- El objetivo no es correr un maratón, el objetivo es convertirse en corredor.
- El objetivo no es aprender un instrumento, el objetivo es convertirse en músico.

## Cómo cambiar tu identidad

Tu identidad emerge de tus hábitos. Cada acción es un voto por el tipo de persona que deseas convertirte. No necesitas ser perfecto. Solo necesitas estar convencido.

### El proceso de dos pasos:

1. **Decide el tipo de persona que quieres ser.**
   ¿Qué tipo de persona podría obtener el resultado que quiero? ¿Quién es el tipo de persona que podría escribir un libro? ¿Quién es el tipo de persona que podría estar en forma?

2. **Demuéstratelo a ti mismo con pequeñas victorias.**
   Una vez que tengas una idea del tipo de persona que quieres ser, puedes comenzar a dar pequeños pasos para reforzar tu identidad deseada.

## La retroalimentación de la identidad

Cada vez que escribes una página, eres un escritor.
Cada vez que practicas el violín, eres un músico.
Cada vez que empiezas un entrenamiento, eres un atleta.
Cada vez que animas a tus empleados, eres un líder.

Cada hábito no solo obtiene resultados sino que también te enseña algo mucho más importante: confiar en ti mismo. Empiezas a creer que realmente puedes lograr estas cosas.

## El verdadero cambio es el cambio de identidad

Los cambios de comportamiento que no están alineados con el yo no durarán. Puedes querer más dinero, pero si tu identidad es alguien que consume en lugar de crear, entonces continuarás siendo atraído hacia gastar en lugar de ganar.

La forma más práctica de cambiar quién eres es cambiar lo que haces. Cada vez que actúas, encarnas la identidad asociada con esa acción. Cuando repites un comportamiento, refuerzas la identidad asociada con ese comportamiento.

El cambio real y duradero viene de adentro hacia afuera, comenzando con tu identidad y trabajando hacia afuera hasta tus resultados.', 3);

-- Insert chapters for Los 7 Hábitos
INSERT INTO library_book_chapters (id, book_id, title, content, "order") VALUES
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000002', 'Introducción: Paradigmas y principios',
'# Paradigmas y principios

En más de 25 años de trabajar con personas en empresas, universidades y en contextos matrimoniales y familiares, he llegado a contacto con muchas personas que han logrado un grado increíble de éxito externo, pero que han luchado con una necesidad interna de desarrollar efectividad personal y relaciones saludables y crecientes con otras personas.

## La crisis del carácter

He llegado a creer que muchos de los problemas que enfrentamos como individuos y como sociedad son síntomas de una crisis más fundamental. Es una crisis del carácter.

Durante los primeros 150 años de la historia de Estados Unidos, casi toda la literatura sobre el éxito se centró en lo que podríamos llamar la Ética del Carácter como fundamento del éxito. Cosas como:
- Integridad
- Humildad  
- Fidelidad
- Templanza
- Coraje
- Justicia
- Paciencia
- Industria
- Simplicidad
- Modestia

## El cambio hacia la personalidad

Pero poco después de la Primera Guerra Mundial, la visión básica del éxito cambió de la Ética del Carácter a lo que podríamos llamar la Ética de la Personalidad. El éxito se convirtió más en una función de:
- Personalidad
- Imagen pública
- Actitudes y comportamientos
- Habilidades y técnicas

## Los paradigmas

Un paradigma es un modelo, teoría, percepción, suposición o marco de referencia. Es la forma en que "vemos" el mundo, no en términos de nuestro sentido de la vista, sino en términos de percepción, comprensión e interpretación.

Para nuestros propósitos, una forma simple de entender los paradigmas es verlos como mapas. Todos sabemos que "el mapa no es el territorio". Un mapa es simplemente una descripción de ciertos aspectos del territorio.

## El poder de un cambio de paradigma

Quizás el ejemplo más poderoso de un cambio de paradigma en la historia reciente de la ciencia ocurrió cuando Ptolomeo, el gran astrónomo egipcio, fue desafiado por Copérnico. Ptolomeo creía que la Tierra era el centro del universo. Copérnico creó un cambio de paradigma, y una gran resistencia y persecución también, al colocar al Sol en el centro.

De repente, todo lo demás tomó una perspectiva diferente.

## Los principios

Los principios son como faros. Son leyes naturales que no pueden romperse. Como dijo Cecil B. DeMille sobre los principios contenidos en su película épica Los Diez Mandamientos: "Es imposible para nosotros romper la ley. Solo podemos rompernos a nosotros mismos contra la ley".

Los principios no son prácticas. Una práctica es una actividad o acción específica. Una práctica que funciona en una circunstancia no necesariamente funcionará en otra.

Los principios son verdades profundas, fundamentales, verdades clásicas, denominadores comunes. Son hebras estrechamente tejidas que atraviesan las familias, organizaciones y civilizaciones duraderas y prósperas a lo largo de la historia.

## El enfoque de adentro hacia afuera

El enfoque de adentro hacia afuera significa comenzar contigo mismo; aún más fundamentalmente, comenzar con las partes más internas de ti mismo: tus paradigmas, tu carácter y tus motivos.

Si quieres tener un matrimonio feliz, sé el tipo de persona que genera energía positiva y evita la energía negativa destructiva. Si quieres tener un hijo más cooperativo, sé un padre más comprensivo, empático, consistente y amoroso.

Si quieres tener más libertad, más latitud en tu trabajo, sé un empleado más responsable, útil y contribuyente. Si quieres que se confíe en ti, sé digno de confianza.

Si quieres el talento secundario de tu adolescente, sé un ejemplo primario. Si quieres que tu jefe te dé crédito por tu contribución al éxito de un proyecto, dale crédito a él por su apoyo y orientación.

El enfoque de adentro hacia afuera dice que las victorias privadas preceden a las victorias públicas, que hacer y mantener promesas a nosotros mismos precede a hacer y mantener promesas a otros.', 1),

('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000002', 'Hábito 1: Ser proactivo',
'# Hábito 1: Ser proactivo

Mientras trabajaba con varios grupos de ejecutivos y estudiantes universitarios, comencé a pedirles que participaran en el siguiente ejercicio mental:

"Proyéctense hacia adelante en el tiempo hasta su funeral. Visualícense caminando hacia el lugar donde se llevará a cabo el servicio funerario. Mientras caminan por el pasillo y ven las caras de familiares y amigos, sienten el amor y respeto compartido que la gente siente por ustedes."

## El círculo de preocupación y el círculo de influencia

Mientras examinamos las cosas dentro de nuestro Círculo de Preocupación, se hace evidente que hay algunas sobre las que no tenemos control real y otras sobre las que sí podemos hacer algo.

Podemos identificar las preocupaciones en el primer grupo creando un Círculo de Preocupación más pequeño - un Círculo de Influencia - dentro del cual podemos hacer algo al respecto.

### Personas proactivas
Las personas proactivas enfocan sus esfuerzos en el Círculo de Influencia. Trabajan en las cosas que pueden hacer algo al respecto:
- Salud
- Hijos  
- Problemas en el trabajo

La naturaleza de su energía es positiva, ampliadora y magnificadora, causando que su Círculo de Influencia aumente.

### Personas reactivas
Las personas reactivas, por otro lado, enfocan sus esfuerzos en el Círculo de Preocupación. Se enfocan en:
- Las debilidades de otras personas
- Los problemas en el ambiente
- Circunstancias sobre las que no tienen control

Su enfoque resulta en culpar y acusar, lenguaje reactivo y sentimientos de victimización aumentados. La energía negativa generada por ese enfoque, combinada con la negligencia en las áreas en las que podrían hacer algo, causa que su Círculo de Influencia se reduzca.

## El lenguaje reactivo vs. proactivo

### Lenguaje reactivo:
- "No hay nada que pueda hacer."
- "Así soy yo."
- "Me vuelve loco."
- "No lo permitirán."
- "Tengo que hacer eso."
- "No puedo."
- "Debo."
- "Si tan solo..."

### Lenguaje proactivo:
- "Veamos nuestras alternativas."
- "Puedo elegir un enfoque diferente."
- "Controlo mis propios sentimientos."
- "Puedo crear una presentación efectiva."
- "Elegiré una respuesta apropiada."
- "Elijo."
- "Prefiero."
- "Haré."

## Los errores y la respuesta proactiva

Una forma de determinar qué tan proactivos somos es mirar dónde enfocamos nuestro tiempo y energía. ¿Estamos enfocados en nuestro Círculo de Preocupación o en nuestro Círculo de Influencia?

Cuando cometemos un error, podemos elegir una de dos respuestas:

### Respuesta reactiva:
1. Negarlo o ignorarlo
2. Culpar a las circunstancias o a otras personas
3. Acusar y justificar

### Respuesta proactiva:
1. Reconocerlo rápidamente
2. Corregirlo inmediatamente  
3. Aprender de él

## Hacer y mantener compromisos

En el corazón de cualquier familia, organización o comunidad próspera se encuentran individuos que han aprendido a hacer y mantener compromisos y promesas.

El poder de hacer y mantener compromisos a nosotros mismos es la esencia del desarrollo de los hábitos básicos de efectividad. El conocimiento, la habilidad y el deseo están todos dentro de nuestro control.

Podemos trabajar en cualquiera de estos tres elementos para mejorar el equilibrio de los tres. A medida que nuestros motivos se vuelven más puros y a medida que desarrollamos mayor habilidad, nuestro conocimiento también aumenta y viceversa.

## La esencia de ser proactivo

La palabra proactividad significa más que simplemente tomar la iniciativa. Significa que como seres humanos, somos responsables de nuestras propias vidas. Nuestro comportamiento es una función de nuestras decisiones, no de nuestras condiciones.

Podemos subordinar los sentimientos a los valores. Tenemos la iniciativa y la responsabilidad de hacer que las cosas sucedan.

Mira la palabra responsabilidad - "habilidad de respuesta" - la habilidad de elegir tu respuesta. Las personas altamente proactivas reconocen esa responsabilidad. No culpan a las circunstancias, condiciones o condicionamiento por su comportamiento. Su comportamiento es un producto de su propia elección consciente, basada en valores, en lugar de un producto de sus condiciones, basado en sentimientos.', 2);

-- Insert chapter for Trabajo Profundo
INSERT INTO library_book_chapters (id, book_id, title, content, "order") VALUES
('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000003', 'Introducción: El trabajo profundo es valioso',
'# El trabajo profundo es valioso

**Trabajo Profundo:** Actividades profesionales realizadas en un estado de concentración libre de distracciones que empujan tus capacidades cognitivas a su límite. Estos esfuerzos crean nuevo valor, mejoran tu habilidad y son difíciles de replicar.

**Trabajo Superficial:** Tareas de estilo logístico, a menudo realizadas mientras se está distraído, que no crean mucho valor nuevo en el mundo y son fáciles de replicar.

## La hipótesis del trabajo profundo

Mi propuesta, que llamo la hipótesis del trabajo profundo, es la siguiente:

**La capacidad de realizar trabajo profundo se está volviendo cada vez más rara al mismo tiempo que se está volviendo cada vez más valiosa en nuestra economía. Como consecuencia, los pocos que cultivan esta habilidad, y luego la convierten en el núcleo de su vida laboral, prosperarán.**

Esta hipótesis tiene dos partes. Primero, que el trabajo profundo es valioso. Segundo, que es raro. Si ambas son ciertas, entonces al cultivar esta habilidad, estarás obteniendo una ventaja económica significativa.

## Por qué el trabajo profundo es valioso

Vivimos en una economía de la información alimentada por tecnologías como Internet y la comunicación digital. En este nuevo mundo económico, tres grupos tendrán una ventaja particular:

### 1. Los trabajadores altamente calificados
Aquellos que pueden trabajar bien y creativamente con tecnologías inteligentes.

### 2. Las superestrellas
Los mejores en su campo. Si eres el mejor en lo que haces, puedes trabajar desde cualquier lugar y cosechar las recompensas.

### 3. Los propietarios
Aquellos con acceso al capital.

## Las dos habilidades fundamentales

Para unirte a los grupos que prosperarán en nuestra nueva economía, debes dominar las siguientes dos habilidades fundamentales:

1. **La capacidad de dominar rápidamente cosas difíciles**
2. **La capacidad de producir a un nivel de élite, tanto en términos de calidad como de velocidad**

Ambas habilidades dependen de tu capacidad para realizar trabajo profundo. Si no has dominado esta habilidad fundamental, tendrás dificultades para aprender cosas difíciles o producir a tu máximo nivel.

## La ley de productividad de alto nivel

**Trabajo de alta calidad producido = (Tiempo invertido) × (Intensidad de concentración)**

Si estás constantemente cambiando tu atención, nunca alcanzarás la máxima intensidad de concentración. En otras palabras, el trabajo profundo es como un superpoder en nuestra economía cada vez más competitiva del siglo XXI.

## Por qué el trabajo profundo es raro

A pesar de la creciente evidencia de que el trabajo profundo es valioso, muchas personas han perdido la capacidad de ir profundo, pasando sus días en un frenesí de correo electrónico y redes sociales, sin darse cuenta de que hay una mejor manera.

### Los culpables principales:

**Comunicación instantánea:** El correo electrónico, Slack, y las redes sociales crean una expectativa de respuesta rápida que fragmenta la atención.

**Reuniones excesivas:** Muchas organizaciones confunden estar ocupado con ser productivo.

**Multitarea:** La creencia errónea de que hacer múltiples cosas a la vez es más eficiente.

**Métricas de productividad pobres:** En ausencia de indicadores claros de lo que significa ser productivo y valioso en su trabajo, muchos trabajadores del conocimiento recurren a un indicador industrial: hacer muchas cosas de manera visible.

## La gran reorganización

Estamos en medio de una gran reorganización de nuestra economía laboral. En este nuevo mundo, aquellos que pueden crear valor a través del trabajo profundo prosperarán, mientras que aquellos que no pueden serán dejados atrás.

El trabajo profundo no es solo una habilidad útil; es el superpoder del siglo XXI. Aquellos que lo cultiven prosperarán, mientras que aquellos que no lo hagan se quedarán atrás.

En las páginas siguientes, te enseñaré exactamente cómo desarrollar esta habilidad crucial y transformar tu vida profesional en el proceso.', 1);
