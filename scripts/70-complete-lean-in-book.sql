-- Complete Lean In book with original content inspired by the themes
-- This creates original content about women's leadership and workplace equality

-- First, ensure the book exists in library_books
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

-- Delete existing chapters for this book
DELETE FROM library_book_chapters WHERE book_id = '550e8400-e29b-41d4-a716-446655440005';

-- Insert chapters with original content (removed updated_at column)
INSERT INTO library_book_chapters (
  id,
  book_id,
  title,
  content,
  "order",
  created_at
) VALUES 
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '550e8400-e29b-41d4-a716-446655440005',
  'Introducción: La Conversación Interna',
  'En el mundo profesional actual, las mujeres enfrentan desafíos únicos que van más allá de las barreras externas. Existe una conversación interna que muchas mujeres mantienen consigo mismas, llena de dudas, cuestionamientos y limitaciones autoimpuestas.

Esta conversación interna a menudo incluye preguntas como: "¿Soy lo suficientemente buena para este puesto?" o "¿Qué pensarán si hablo en esta reunión?" Estas dudas no surgen de la nada; son el resultado de años de condicionamiento social y expectativas culturales.

El primer paso para el cambio es reconocer que esta conversación existe. Muchas mujeres talentosas se limitan a sí mismas antes de que cualquier barrera externa tenga la oportunidad de hacerlo. Cambian su comportamiento, reducen sus ambiciones y se conforman con menos de lo que merecen.

Pero también existe otra realidad: las mujeres que han logrado romper estas barreras internas han descubierto un poder transformador. Han aprendido a confiar en sus habilidades, a hablar con autoridad y a perseguir oportunidades con determinación.

El cambio comienza con la conciencia. Cuando las mujeres reconocen los patrones de pensamiento que las limitan, pueden comenzar a desafiarlos. Pueden empezar a reescribir esa conversación interna, transformándola de una fuente de dudas en una fuente de fortaleza.

Este libro explora cómo las mujeres pueden desarrollar la confianza necesaria para liderar, cómo pueden navegar los desafíos únicos del lugar de trabajo moderno, y cómo pueden crear un cambio positivo tanto para ellas mismas como para las generaciones futuras.

La igualdad de género en el lugar de trabajo no es solo un tema de justicia social; es una necesidad económica. Las organizaciones que aprovechan plenamente el talento femenino superan consistentemente a aquellas que no lo hacen. Sin embargo, para que esto suceda, las mujeres deben estar dispuestas a dar un paso adelante y reclamar su lugar en la mesa de decisiones.',
  1,
  NOW()
),
(
  'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  '550e8400-e29b-41d4-a716-446655440005',
  'Capítulo 1: Siéntate a la Mesa',
  'En una reunión ejecutiva de una empresa Fortune 500, había una mesa grande rodeada de sillas. Los ejecutivos masculinos se sentaron naturalmente alrededor de la mesa, mientras que las pocas mujeres presentes tomaron asiento en las sillas contra la pared. Esta escena se repite en salas de juntas de todo el mundo, y es una metáfora poderosa de un problema más amplio.

Las mujeres a menudo se excluyen a sí mismas de las conversaciones importantes, literal y figurativamente. No se sientan a la mesa principal, no hablan en las reuniones, y no se postulan para los puestos de liderazgo que merecen. Esta autoexclusión tiene raíces profundas en la socialización y las expectativas culturales.

Desde una edad temprana, a las niñas se les enseña a ser modestas, a no presumir, y a poner las necesidades de otros antes que las propias. Estos valores, aunque admirables en muchos contextos, pueden convertirse en obstáculos en el mundo profesional. Mientras que los hombres son alentados a ser asertivos y ambiciosos, las mujeres que muestran estas mismas cualidades a menudo son etiquetadas negativamente.

El síndrome del impostor afecta desproporcionadamente a las mujeres. Muchas mujeres exitosas sienten que no merecen sus logros, que han tenido suerte, o que pronto serán "descubiertas" como fraudes. Esta sensación las lleva a trabajar más duro para demostrar su valía, pero también las hace menos propensas a buscar nuevas oportunidades o a hablar con confianza sobre sus logros.

La investigación muestra que los hombres se postulan para trabajos cuando cumplen con el 60% de los requisitos, mientras que las mujeres esperan hasta cumplir con el 100%. Esta diferencia en la percepción de la preparación tiene consecuencias reales en las trayectorias profesionales.

Para sentarse a la mesa, las mujeres deben:

Primero, reconocer su propio valor. Esto significa hacer un inventario honesto de sus habilidades, logros y contribuciones. Muchas mujeres minimizan sus éxitos o los atribuyen a factores externos.

Segundo, desarrollar la confianza para hablar. En las reuniones, las mujeres a menudo esperan a ser invitadas a participar, mientras que los hombres simplemente hablan. Las mujeres deben practicar el arte de interrumpir educadamente y de hacer que sus voces sean escuchadas.

Tercero, buscar activamente oportunidades de liderazgo. Esto significa postularse para proyectos desafiantes, solicitar promociones, y expresar ambiciones profesionales claramente.

Cuarto, construir una red de apoyo. Las mujeres que tienen éxito a menudo tienen mentores y patrocinadores que las ayudan a navegar los desafíos profesionales y a identificar oportunidades.

El cambio también requiere que las organizaciones examinen sus propias prácticas. ¿Las reuniones están estructuradas de manera que permitan la participación equitativa? ¿Los procesos de promoción son transparentes y justos? ¿Se valoran igualmente las contribuciones de hombres y mujeres?

Sentarse a la mesa no es solo sobre ocupar un asiento físico; es sobre reclamar el espacio que las mujeres merecen en las conversaciones que dan forma al futuro de las organizaciones y la sociedad.',
  2,
  NOW()
),
(
  'c3d4e5f6-g7h8-9012-cdef-345678901234',
  '550e8400-e29b-41d4-a716-446655440005',
  'Capítulo 2: El Éxito y la Simpatía',
  'Existe un dilema fundamental que enfrentan las mujeres en el lugar de trabajo: el conflicto entre el éxito y la simpatía. La investigación ha demostrado consistentemente que cuando las mujeres tienen éxito, especialmente en roles tradicionalmente masculinos, a menudo son percibidas como menos simpáticas. Este fenómeno no afecta a los hombres de la misma manera.

Este dilema se manifiesta de múltiples formas en el entorno laboral. Una mujer que negocia agresivamente por un salario más alto puede ser vista como "difícil" o "demandante", mientras que un hombre que hace lo mismo es considerado "un buen negociador". Una líder femenina que toma decisiones difíciles puede ser etiquetada como "fría" o "calculadora", mientras que un líder masculino que hace lo mismo es visto como "decisivo" y "fuerte".

Esta doble moral tiene consecuencias reales. Las mujeres que son percibidas como menos simpáticas pueden enfrentar resistencia de colegas, dificultades para construir coaliciones, y obstáculos en su avance profesional. Como resultado, muchas mujeres modifican su comportamiento, suavizando su enfoque o disculpándose por sus éxitos, en un intento de mantener la simpatía.

El origen de este dilema se encuentra en las expectativas sociales profundamente arraigadas sobre cómo deben comportarse las mujeres. Se espera que las mujeres sean cálidas, serviciales y modestas. Cuando violan estas expectativas al ser asertivas o ambiciosas, enfrentan una reacción negativa.

Un ejemplo clásico es el estudio de caso de Heidi Roizen, una empresaria exitosa de Silicon Valley. Cuando los estudiantes de MBA leyeron sobre sus logros, los hombres en el estudio la encontraron competente pero no simpática, mientras que cuando el mismo caso de estudio se presentó con un nombre masculino (Howard), los estudiantes lo encontraron tanto competente como simpático.

Para navegar este dilema, las mujeres pueden adoptar varias estrategias:

La primera es la conciencia. Reconocer que este sesgo existe ayuda a las mujeres a entender que las reacciones negativas que enfrentan pueden no estar relacionadas con su desempeño real, sino con expectativas de género.

La segunda es encontrar formas de ser asertivas mientras mantienen la calidez. Esto puede incluir explicar las razones detrás de las decisiones difíciles, mostrar preocupación por el impacto en otros, y usar un lenguaje que sea directo pero no agresivo.

La tercera es construir alianzas estratégicas. Las mujeres que tienen el apoyo de colegas respetados, tanto hombres como mujeres, pueden navegar más fácilmente las percepciones negativas.

La cuarta es redefinir el éxito. En lugar de adoptar completamente los modelos masculinos de liderazgo, las mujeres pueden desarrollar estilos de liderazgo que incorporen tanto la competencia como la colaboración.

Sin embargo, la responsabilidad no recae únicamente en las mujeres. Las organizaciones deben examinar sus culturas y procesos para identificar y eliminar los sesgos de género. Esto incluye entrenar a los gerentes sobre sesgos inconscientes, crear procesos de evaluación más objetivos, y celebrar diversos estilos de liderazgo.

Los hombres también tienen un papel crucial que desempeñar. Cuando los líderes masculinos apoyan y defienden a las mujeres, pueden ayudar a cambiar las percepciones y crear entornos más inclusivos.

El objetivo no es que las mujeres tengan que elegir entre el éxito y la simpatía, sino crear entornos donde puedan ser tanto competentes como auténticas, donde el liderazgo femenino sea valorado y celebrado, no penalizado.',
  3,
  NOW()
),
(
  'd4e5f6g7-h8i9-0123-defg-456789012345',
  '550e8400-e29b-41d4-a716-446655440005',
  'Capítulo 3: Mentores y Patrocinadores',
  'En el camino hacia el liderazgo, pocas cosas son tan valiosas como tener mentores y patrocinadores. Sin embargo, existe una diferencia crucial entre estos dos roles, y entender esta diferencia puede ser determinante para el éxito profesional de una mujer.

Un mentor es alguien que ofrece consejos, comparte experiencias y ayuda a desarrollar habilidades. La relación de mentoría se basa en el intercambio de conocimientos y la orientación. Un patrocinador, por otro lado, es alguien que aboga activamente por tu avance profesional, que usa su influencia para crear oportunidades y que está dispuesto a apostar su reputación por tu éxito.

Las mujeres a menudo tienen más mentores que patrocinadores, y esta diferencia es significativa. Mientras que los mentores pueden ofrecer valiosos consejos, son los patrocinadores quienes realmente abren puertas. Son ellos quienes mencionan tu nombre cuando se discuten promociones, quienes te recomiendan para proyectos de alto perfil, y quienes te defienden cuando no estás en la habitación.

La investigación muestra que los hombres son más propensos a tener patrocinadores, mientras que las mujeres tienden a ser "sobre-mentoreadas y sub-patrocinadas". Esta disparidad contribuye a la brecha de género en posiciones de liderazgo.

Existen varias razones por las que las mujeres enfrentan desafíos para encontrar patrocinadores:

Primero, la falta de representación femenina en posiciones senior significa que hay menos mujeres en posiciones de poder que puedan servir como patrocinadoras.

Segundo, los hombres en posiciones de liderazgo pueden sentirse incómodos desarrollando relaciones cercanas con mujeres más jóvenes debido a percepciones sobre la apropiedad o preocupaciones sobre cómo otros podrían interpretar la relación.

Tercero, las mujeres a menudo no buscan activamente patrocinadores, esperando que el buen trabajo hable por sí mismo. Sin embargo, en muchas organizaciones, la visibilidad y la promoción activa son esenciales para el avance.

Para desarrollar relaciones de patrocinio efectivas, las mujeres pueden:

Identificar líderes potenciales cuyas carreras admiren y cuyos valores se alineen con los suyos. Los mejores patrocinadores son aquellos que tienen influencia en las decisiones que afectan tu carrera.

Demostrar valor antes de buscar patrocinio. Los patrocinadores invierten en personas que pueden entregar resultados y reflejar positivamente en su juicio.

Ser específicas sobre lo que buscan. En lugar de pedir vagamente "consejos de carrera", las mujeres deben articular claramente sus objetivos y cómo un patrocinador podría ayudar.

Mantener a los patrocinadores informados sobre sus logros y aspiraciones. Los patrocinadores no pueden abogar por ti si no saben lo que has logrado o hacia dónde quieres ir.

Reciprocar cuando sea posible. Aunque la relación puede ser asimétrica en términos de poder, las mujeres pueden ofrecer valor a través de su trabajo, perspectivas únicas, o conexiones con otros talentos.

Las organizaciones también tienen un papel que desempeñar en facilitar relaciones de patrocinio. Pueden crear programas formales de patrocinio, establecer métricas para el avance de las mujeres, y hacer que los líderes sean responsables de desarrollar talento diverso.

Los líderes masculinos que quieren ser patrocinadores efectivos de mujeres pueden:

Ser intencionales sobre buscar y desarrollar talento femenino.

Crear oportunidades para que las mujeres demuestren sus habilidades en proyectos de alto perfil.

Hablar públicamente sobre los logros de las mujeres en sus equipos.

Examinar sus propios sesgos y asegurarse de que están evaluando el potencial de manera equitativa.

El patrocinio efectivo no se trata de favoritismo o de bajar los estándares. Se trata de asegurar que el talento sea reconocido y desarrollado independientemente del género, y que las barreras sistémicas no impidan que las mejores personas alcancen posiciones de liderazgo.

Cuando las mujeres tienen patrocinadores fuertes, no solo avanzan en sus propias carreras, sino que también se convierten en modelos a seguir y patrocinadoras para la próxima generación, creando un ciclo positivo de cambio organizacional.',
  4,
  NOW()
);

-- Verify the data was inserted
SELECT 
  b.title,
  b.author,
  COUNT(c.id) as chapter_count
FROM library_books b
LEFT JOIN library_book_chapters c ON b.id = c.book_id
WHERE b.id = '550e8400-e29b-41d4-a716-446655440005'
GROUP BY b.id, b.title, b.author;
