-- Add Lean In book with corrected UUIDs and complete content
-- This script adds the book "Lean In" by Sheryl Sandberg with 4 complete chapters

-- First, ensure we have the book in the library_books table
INSERT INTO library_books (
    id,
    title,
    author,
    description,
    cover_image,
    category,
    difficulty,
    rating,
    estimated_reading_time,
    pages,
    tags,
    key_topics,
    is_recommended,
    created_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440005',
    'Lean In: Mujeres, Trabajo y la Voluntad de Liderar',
    'Sheryl Sandberg',
    'Una exploración sobre los desafíos que enfrentan las mujeres en el lugar de trabajo y cómo pueden superarlos para alcanzar posiciones de liderazgo.',
    '/books/lean-in.jpg',
    'Liderazgo',
    'Intermedio',
    4.5,
    280,
    320,
    ARRAY['liderazgo femenino', 'igualdad de género', 'desarrollo profesional', 'empoderamiento'],
    ARRAY['Liderazgo femenino', 'Igualdad en el trabajo', 'Desarrollo de carrera', 'Empoderamiento personal'],
    true,
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    author = EXCLUDED.author,
    description = EXCLUDED.description,
    cover_image = EXCLUDED.cover_image,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    rating = EXCLUDED.rating,
    estimated_reading_time = EXCLUDED.estimated_reading_time,
    pages = EXCLUDED.pages,
    tags = EXCLUDED.tags,
    key_topics = EXCLUDED.key_topics,
    is_recommended = EXCLUDED.is_recommended;

-- Delete existing chapters for this book to avoid duplicates
DELETE FROM library_book_chapters WHERE book_id = '550e8400-e29b-41d4-a716-446655440005';

-- Now add the chapters with complete content
INSERT INTO library_book_chapters (
    id,
    book_id,
    title,
    content,
    "order",
    created_at
) VALUES 
(
    '123e4567-e89b-12d3-a456-426614174000',
    '550e8400-e29b-41d4-a716-446655440005',
    'Introducción: La Conversación Interna',
    'En el mundo profesional actual, las mujeres enfrentan desafíos únicos que van más allá de las barreras externas. Existe una conversación interna que muchas mujeres mantienen consigo mismas, llena de dudas, cuestionamientos y limitaciones autoimpuestas.

Esta conversación interna a menudo incluye preguntas como: "¿Soy lo suficientemente buena para este puesto?" o "¿Qué pensarán si hablo en esta reunión?" Estas dudas no surgen de la nada; son el resultado de años de condicionamiento social y expectativas culturales.

El primer paso para el cambio es reconocer que esta conversación existe. Muchas mujeres talentosas se limitan a sí mismas antes de que cualquier barrera externa tenga la oportunidad de hacerlo. Cambian su comportamiento, reducen sus ambiciones y se conforman con menos de lo que merecen.

Pero también existe otra realidad: las mujeres que han logrado romper estas barreras internas han descubierto un poder transformador. Han aprendido a confiar en sus habilidades, a hablar con autoridad y a perseguir oportunidades con determinación.

El cambio comienza con la conciencia. Cuando las mujeres reconocen los patrones de pensamiento que las limitan, pueden comenzar a desafiarlos. Pueden empezar a reescribir esa conversación interna, transformándola de una fuente de dudas en una fuente de fortaleza.

Este libro explora cómo las mujeres pueden desarrollar la confianza necesaria para liderar, cómo pueden navegar los desafíos únicos del lugar de trabajo moderno, y cómo pueden crear un cambio positivo tanto para ellas mismas como para las generaciones futuras.

La igualdad de género en el lugar de trabajo no es solo un tema de justicia social; es una necesidad económica. Las organizaciones que aprovechan plenamente el talento femenino superan consistentemente a aquellas que no lo hacen. Sin embargo, para que esto suceda, las mujeres deben estar dispuestas a dar un paso adelante y reclamar su lugar en la mesa de decisiones.

Cuando hablamos de liderazgo femenino, no se trata de reemplazar un modelo con otro, sino de crear espacios donde diferentes estilos de liderazgo puedan coexistir y prosperar. Las mujeres aportan perspectivas únicas, enfoques colaborativos y una comprensión profunda de la diversidad que enriquece cualquier organización.

La investigación muestra que las empresas con mayor diversidad de género en posiciones de liderazgo tienen un 21% más de probabilidades de experimentar rentabilidad superior. Sin embargo, a pesar de estos beneficios claros, las mujeres siguen estando subrepresentadas en roles ejecutivos en todo el mundo.

Este desequilibrio no es solo el resultado de barreras externas, aunque estas ciertamente existen. También es el resultado de barreras internas que las mujeres se imponen a sí mismas. Es hora de examinar estas barreras y encontrar formas de superarlas.',
    1,
    NOW()
),
(
    '123e4567-e89b-12d3-a456-426614174001',
    '550e8400-e29b-41d4-a716-446655440005',
    'Capítulo 1: Siéntate a la Mesa',
    'En una reunión ejecutiva de una empresa Fortune 500, había una mesa grande rodeada de sillas. Los ejecutivos masculinos se sentaron naturalmente alrededor de la mesa, mientras que las pocas mujeres presentes tomaron asiento en las sillas contra la pared. Esta escena se repite en salas de juntas de todo el mundo, y es una metáfora poderosa de un problema más amplio.

Las mujeres a menudo se excluyen a sí mismas de las conversaciones importantes, literal y figurativamente. No se sientan a la mesa principal, no hablan en las reuniones, y no se postulan para los puestos de liderazgo que merecen. Esta autoexclusión tiene raíces profundas en la socialización y las expectativas culturales.

Desde una edad temprana, a las niñas se les enseña a ser modestas, a no presumir, y a poner las necesidades de otros antes que las propias. Estos valores, aunque admirables en muchos contextos, pueden convertirse en obstáculos en el mundo profesional. Mientras que los hombres son alentados a ser asertivos y ambiciosos, las mujeres que muestran estas mismas cualidades a menudo son etiquetadas negativamente.

El síndrome del impostor afecta desproporcionadamente a las mujeres. Muchas mujeres exitosas sienten que no merecen sus logros, que han tenido suerte, o que pronto serán "descubiertas" como fraudes. Esta sensación las lleva a trabajar más duro para demostrar su valía, pero también las hace menos propensas a buscar nuevas oportunidades o a hablar con confianza sobre sus logros.

La investigación muestra que los hombres se postulan para trabajos cuando cumplen con el 60% de los requisitos, mientras que las mujeres esperan hasta cumplir con el 100%. Esta diferencia en la percepción de la preparación tiene consecuencias reales en las trayectorias profesionales.

Un estudio realizado por Hewlett Packard encontró que las mujeres se aplicaban para promociones solo cuando cumplían con el 100% de las calificaciones listadas, mientras que los hombres se aplicaban cuando cumplían con solo el 60%. Esta diferencia no se debe a falta de confianza únicamente, sino también a diferentes interpretaciones de lo que significa estar "calificado".

Para las mujeres, una lista de requisitos se lee como una lista de verificación: cada elemento debe ser cumplido antes de aplicar. Para los hombres, una lista de requisitos se lee más como una lista de deseos: si cumplen con algunos de los elementos, sienten que vale la pena intentarlo.

Esta diferencia en la interpretación tiene implicaciones profundas. Significa que las mujeres pueden estar perdiendo oportunidades no porque no sean calificadas, sino porque se están descalificando a sí mismas antes de que alguien más tenga la oportunidad de hacerlo.

Para sentarse a la mesa, las mujeres deben:

Primero, reconocer su propio valor. Esto significa hacer un inventario honesto de sus habilidades, logros y contribuciones. Muchas mujeres minimizan sus éxitos o los atribuyen a factores externos como la suerte o la ayuda de otros. Es importante reconocer que el éxito rara vez es solo cuestión de suerte.

Segundo, desarrollar la confianza para hablar. En las reuniones, las mujeres a menudo esperan a ser invitadas a participar, mientras que los hombres simplemente hablan. Las mujeres deben practicar el arte de interrumpir educadamente y de hacer que sus voces sean escuchadas. Esto no significa ser agresiva, sino ser asertiva.

Tercero, buscar activamente oportunidades de liderazgo. Esto significa postularse para proyectos desafiantes, solicitar promociones, y expresar ambiciones profesionales claramente. No esperar a que otros reconozcan su potencial, sino hacer que ese potencial sea visible.

Cuarto, construir una red de apoyo. Las mujeres que tienen éxito a menudo tienen mentores y patrocinadores que las ayudan a navegar los desafíos profesionales y a identificar oportunidades. Construir estas relaciones requiere intención y esfuerzo.

El cambio también requiere que las organizaciones examinen sus propias prácticas. ¿Las reuniones están estructuradas de manera que permitan la participación equitativa? ¿Los procesos de promoción son transparentes y justos? ¿Se valoran igualmente las contribuciones de hombres y mujeres?

Sentarse a la mesa no es solo sobre ocupar un asiento físico; es sobre reclamar el espacio que las mujeres merecen en las conversaciones que dan forma al futuro de las organizaciones y la sociedad.',
    2,
    NOW()
),
(
    '123e4567-e89b-12d3-a456-426614174002',
    '550e8400-e29b-41d4-a716-446655440005',
    'Capítulo 2: El Éxito y la Simpatía',
    'Existe un dilema fundamental que enfrentan las mujeres en el lugar de trabajo: el conflicto entre el éxito y la simpatía. La investigación ha demostrado consistentemente que cuando las mujeres tienen éxito, especialmente en roles tradicionalmente masculinos, a menudo son percibidas como menos simpáticas. Este fenómeno no afecta a los hombres de la misma manera.

Este dilema se manifiesta de múltiples formas en el entorno laboral. Una mujer que negocia agresivamente por un salario más alto puede ser vista como "difícil" o "demandante", mientras que un hombre que hace lo mismo es considerado "un buen negociador". Una líder femenina que toma decisiones difíciles puede ser etiquetada como "fría" o "calculadora", mientras que un líder masculino que hace lo mismo es visto como "decisivo" y "fuerte".

Esta doble moral tiene consecuencias reales. Las mujeres que son percibidas como menos simpáticas pueden enfrentar resistencia de colegas, dificultades para construir coaliciones, y obstáculos en su avance profesional. Como resultado, muchas mujeres modifican su comportamiento, suavizando su enfoque o disculpándose por sus éxitos, en un intento de mantener la simpatía.

El origen de este dilema se encuentra en las expectativas sociales profundamente arraigadas sobre cómo deben comportarse las mujeres. Se espera que las mujeres sean cálidas, serviciales y modestas. Cuando violan estas expectativas al ser asertivas o ambiciosas, enfrentan una reacción negativa.

Un estudio famoso ilustra este punto perfectamente. Los investigadores de Harvard Business School presentaron a los participantes el caso de estudio de Heidi Roizen, una exitosa empresaria de Silicon Valley. A la mitad de los participantes se les presentó el caso exactamente como era, con Heidi como protagonista. A la otra mitad se les presentó el mismo caso, pero con el nombre cambiado a Howard.

Los resultados fueron reveladores: aunque ambos grupos calificaron a Heidi y Howard como igualmente competentes, encontraron a Heidi menos simpática y menos deseable como colega. Los participantes describieron a Howard como alguien con quien les gustaría trabajar, mientras que describieron a Heidi como "egoísta" y "no el tipo de persona que contratarías o para quien trabajarías".

Este estudio demuestra cómo los mismos comportamientos y logros pueden ser interpretados de manera completamente diferente dependiendo del género de la persona. Lo que se ve como liderazgo natural en un hombre puede ser visto como agresividad inapropiada en una mujer.

El dilema éxito-simpatía crea un doble vínculo para las mujeres. Si son competentes y asertivas, pueden ser vistas como poco simpáticas. Si son cálidas y serviciales, pueden ser vistas como menos competentes. Es una situación en la que es difícil ganar.

Para navegar este dilema, las mujeres pueden adoptar varias estrategias:

La primera es la conciencia. Reconocer que este sesgo existe ayuda a las mujeres a entender que las reacciones negativas que enfrentan pueden no estar relacionadas con su desempeño real, sino con expectativas de género. Esta conciencia puede ayudar a mantener la confianza en situaciones difíciles.

La segunda es encontrar formas de ser asertivas mientras mantienen la calidez. Esto puede incluir explicar las razones detrás de las decisiones difíciles, mostrar preocupación por el impacto en otros, y usar un lenguaje que sea directo pero no agresivo. Por ejemplo, en lugar de decir "Esto está mal", una mujer podría decir "Creo que podríamos considerar un enfoque diferente porque..."

La tercera es construir alianzas estratégicas. Las mujeres que tienen el apoyo de colegas respetados, tanto hombres como mujeres, pueden navegar más fácilmente las percepciones negativas. Cuando otros hablan en su nombre, puede ayudar a contrarrestar las percepciones negativas.

La cuarta es redefinir el éxito en términos que incluyan tanto el logro como las relaciones. En lugar de adoptar completamente los modelos masculinos de liderazgo, las mujeres pueden desarrollar estilos de liderazgo que incorporen tanto la competencia como la colaboración.

Sin embargo, la responsabilidad no recae únicamente en las mujeres. Las organizaciones deben examinar sus culturas y procesos para identificar y eliminar los sesgos de género. Esto incluye entrenar a los gerentes sobre sesgos inconscientes, crear procesos de evaluación más objetivos, y celebrar diversos estilos de liderazgo.

Los hombres también tienen un papel crucial que desempeñar. Cuando los líderes masculinos apoyan y defienden a las mujeres, pueden ayudar a cambiar las percepciones y crear entornos más inclusivos.

El objetivo no es que las mujeres tengan que elegir entre el éxito y la simpatía, sino crear entornos donde puedan ser tanto competentes como auténticas, donde el liderazgo femenino sea valorado y celebrado, no penalizado.',
    3,
    NOW()
),
(
    '123e4567-e89b-12d3-a456-426614174003',
    '550e8400-e29b-41d4-a716-446655440005',
    'Capítulo 3: Mentores y Patrocinadores',
    'En el camino hacia el liderazgo, pocas cosas son tan valiosas como tener mentores y patrocinadores. Sin embargo, existe una diferencia crucial entre estos dos roles, y entender esta diferencia puede ser determinante para el éxito profesional de una mujer.

Un mentor es alguien que ofrece consejos, comparte experiencias y ayuda a desarrollar habilidades. La relación de mentoría se basa en el intercambio de conocimientos y la orientación. Los mentores pueden ayudar a navegar desafíos profesionales, desarrollar nuevas competencias, y proporcionar perspectiva sobre decisiones de carrera.

Un patrocinador, por otro lado, es alguien que aboga activamente por tu avance profesional, que usa su influencia para crear oportunidades y que está dispuesto a apostar su reputación por tu éxito. Los patrocinadores no solo ofrecen consejos; toman acción. Hablan en tu nombre en reuniones donde no estás presente, te recomiendan para asignaciones de alto perfil, y usan su capital político para impulsar tu carrera.

Las mujeres a menudo tienen más mentores que patrocinadores, y esta diferencia es significativa. Mientras que los mentores pueden ofrecer valiosos consejos, son los patrocinadores quienes realmente abren puertas. Son ellos quienes mencionan tu nombre cuando se discuten promociones, quienes te recomiendan para proyectos de alto perfil, y quienes te defienden cuando no estás en la habitación.

La investigación de Catalyst muestra que los hombres son más propensos a tener patrocinadores, mientras que las mujeres tienden a ser "sobre-mentoreadas y sub-patrocinadas". Esta disparidad contribuye significativamente a la brecha de género en posiciones de liderazgo.

¿Por qué existe esta diferencia? Hay varias razones:

Primero, la falta de representación femenina en posiciones senior significa que hay menos mujeres en posiciones de poder que puedan servir como patrocinadoras. Aunque los hombres pueden patrocinar mujeres, a menudo es más natural para ellos patrocinar a otros hombres con quienes pueden identificarse más fácilmente.

Segundo, los hombres en posiciones de liderazgo pueden sentirse incómodos desarrollando relaciones cercanas con mujeres más jóvenes debido a percepciones sobre la apropiedad o preocupaciones sobre cómo otros podrían interpretar la relación. Esta incomodidad puede llevar a que eviten el tipo de relaciones cercanas que son necesarias para el patrocinio efectivo.

Tercero, las mujeres a menudo no buscan activamente patrocinadores, esperando que el buen trabajo hable por sí mismo. Pueden sentirse incómodas pidiendo a alguien que arriesgue su capital político por ellas, o pueden no entender completamente la diferencia entre mentoría y patrocinio.

Cuarto, las mujeres pueden ser más propensas a buscar mentoría porque se sienten más cómodas pidiendo consejos que pidiendo promoción activa. La mentoría se siente más segura y menos transaccional.

Un estudio de Catalyst encontró que tanto hombres como mujeres que tenían patrocinadores recibían más promociones, pero los hombres eran más propensos a tener patrocinadores en primer lugar. Entre aquellos que tenían patrocinadores, los hombres recibían asignaciones más desafiantes y promociones más rápidas.

Para desarrollar relaciones de patrocinio efectivas, las mujeres pueden:

Primero, identificar líderes potenciales cuyas carreras admiren y que tengan influencia en áreas relevantes para sus objetivos. Los mejores patrocinadores son aquellos que tienen poder real en las decisiones que afectan tu carrera y que están en posiciones donde pueden crear oportunidades.

Segundo, demostrar valor antes de buscar patrocinio. Los patrocinadores invierten en personas que pueden entregar resultados y reflejar positivamente en su juicio. Esto significa sobresalir en tu trabajo actual, tomar iniciativa en proyectos importantes, y construir una reputación de confiabilidad y excelencia.

Tercero, ser específicas sobre lo que buscan y cómo el patrocinador puede ayudar. En lugar de pedir vagamente "consejos de carrera", las mujeres deben articular claramente sus objetivos profesionales y las barreras específicas que enfrentan. Esto hace que sea más fácil para los patrocinadores potenciales entender cómo pueden ayudar.

Cuarto, mantener a los patrocinadores informados sobre sus logros y aspiraciones. Los patrocinadores no pueden abogar por ti si no saben lo que has logrado o hacia dónde quieres ir. Esto requiere comunicación regular y actualizaciones sobre tu progreso.

Quinto, reciprocar cuando sea posible. Aunque la relación puede ser asimétrica en términos de poder, las mujeres pueden ofrecer valor a través de su trabajo excepcional, perspectivas únicas, información sobre mercados o demografías específicas, o conexiones con otros talentos emergentes.

Las organizaciones también tienen un papel importante que desempeñar en facilitar relaciones de patrocinio. Pueden:

Crear programas formales de patrocinio que conecten a líderes senior con talentos emergentes, con métricas claras para el éxito.

Establecer expectativas claras de que los líderes senior deben desarrollar y patrocinar talento diverso como parte de sus responsabilidades de liderazgo.

Proporcionar entrenamiento sobre cómo ser un patrocinador efectivo, incluyendo cómo navegar las dinámicas de género de manera apropiada.

Crear transparencia en los procesos de promoción y asignación de proyectos para asegurar que el patrocinio sea visible y justo.

Los líderes masculinos que quieren ser patrocinadores efectivos de mujeres pueden:

Ser intencionales sobre buscar y desarrollar talento femenino, reconociendo que esto puede requerir esfuerzo adicional debido a sesgos inconscientes.

Crear oportunidades para que las mujeres demuestren sus habilidades en proyectos de alto perfil y visibilidad.

Hablar públicamente sobre los logros de las mujeres en sus equipos, asegurándose de que su trabajo sea reconocido y valorado.

Examinar sus propios sesgos y asegurarse de que están evaluando el potencial de manera equitativa, sin aplicar estándares diferentes a hombres y mujeres.

El patrocinio efectivo no se trata de favoritismo o de bajar los estándares. Se trata de asegurar que el talento sea reconocido y desarrollado independientemente del género, y que las barreras sistémicas no impidan que las mejores personas alcancen posiciones de liderazgo.

Cuando las mujeres tienen patrocinadores fuertes, no solo avanzan en sus propias carreras, sino que también se convierten en modelos a seguir y patrocinadoras para la próxima generación, creando un ciclo positivo de cambio organizacional.

La clave está en entender que el patrocinio es una inversión mutua: los patrocinadores invierten en el éxito de otros, y a cambio, construyen equipos más fuertes, organizaciones más diversas, y legados de liderazgo más ricos.',
    4,
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    "order" = EXCLUDED."order";

-- Verify the insertion was successful
SELECT 
    b.title as book_title,
    b.author,
    COUNT(c.id) as chapter_count,
    ARRAY_AGG(c.title ORDER BY c."order") as chapter_titles
FROM library_books b
LEFT JOIN library_book_chapters c ON b.id = c.book_id
WHERE b.id = '550e8400-e29b-41d4-a716-446655440005'
GROUP BY b.id, b.title, b.author;

-- Show content length for each chapter
SELECT 
    c.title,
    c."order",
    LENGTH(c.content) as content_length,
    CASE 
        WHEN LENGTH(c.content) > 100 THEN CONCAT(LEFT(c.content, 100), '...')
        ELSE c.content
    END as content_preview
FROM library_book_chapters c
WHERE c.book_id = '550e8400-e29b-41d4-a716-446655440005'
ORDER BY c."order";

-- Final verification: Show total content
SELECT 
    'Total chapters' as metric,
    COUNT(*) as value
FROM library_book_chapters 
WHERE book_id = '550e8400-e29b-41d4-a716-446655440005'
UNION ALL
SELECT 
    'Total content length' as metric,
    SUM(LENGTH(content)) as value
FROM library_book_chapters 
WHERE book_id = '550e8400-e29b-41d4-a716-446655440005';
