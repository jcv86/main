-- Check the actual structure of user_book_progress table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_book_progress' 
ORDER BY ordinal_position;

-- Check the actual structure of book_chapters table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'book_chapters' 
ORDER BY ordinal_position;

-- Check the actual structure of books table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'books' 
ORDER BY ordinal_position;

-- Check the difficulty constraint
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
WHERE t.relname = 'books' AND conname LIKE '%difficulty%';

-- Clean up existing data first
DELETE FROM user_book_progress WHERE 1=1;
DELETE FROM book_chapters WHERE 1=1;
DELETE FROM books WHERE 1=1;
DELETE FROM user_reading_stats WHERE 1=1;

-- Insert books with correct difficulty values
INSERT INTO books (
    id, title, author, description, cover_url, category, rating, pages, 
    published_year, reading_time, difficulty, tags, key_topics, is_recommended
) VALUES 
(
    gen_random_uuid(),
    'Hábitos Atómicos',
    'James Clear',
    'Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos. James Clear nos brinda estrategias prácticas que nos enseñarán exactamente cómo formar buenos hábitos, romper los malos, y dominar los pequeños comportamientos que llevan a resultados notables.',
    '/placeholder.svg?height=300&width=200&text=Hábitos+Atómicos',
    'Productividad',
    4.8,
    320,
    2018,
    '5h 20min',
    'Fácil',
    ARRAY['hábitos', 'productividad', 'autoayuda', 'psicología', 'cambio', 'comportamiento'],
    ARRAY['Formación de hábitos', 'Cambio de comportamiento', 'Mejora continua', 'Sistemas vs objetivos', 'Identidad y hábitos'],
    true
),
(
    gen_random_uuid(),
    'Los 7 Hábitos de la Gente Altamente Efectiva',
    'Stephen R. Covey',
    'Un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales. Covey revela un proceso paso a paso para vivir con equidad, integridad, honestidad y dignidad humana.',
    '/placeholder.svg?height=300&width=200&text=7+Hábitos',
    'Liderazgo',
    4.7,
    432,
    1989,
    '7h 12min',
    'Intermedio',
    ARRAY['liderazgo', 'efectividad', 'principios', 'carácter', 'desarrollo personal'],
    ARRAY['Proactividad', 'Liderazgo personal', 'Gestión personal', 'Beneficio mutuo', 'Comunicación empática'],
    true
),
(
    gen_random_uuid(),
    'Trabajo Profundo',
    'Cal Newport',
    'Reglas para el éxito enfocado en un mundo distraído. Newport argumenta que la capacidad de concentrarse sin distracciones en una tarea cognitivamente exigente es una habilidad que se está volviendo cada vez más valiosa en nuestra economía.',
    '/placeholder.svg?height=300&width=200&text=Trabajo+Profundo',
    'Productividad',
    4.6,
    304,
    2016,
    '5h 4min',
    'Avanzado',
    ARRAY['concentración', 'productividad', 'tecnología', 'enfoque', 'distracción'],
    ARRAY['Concentración profunda', 'Distracción digital', 'Valor del trabajo', 'Filosofías de trabajo profundo'],
    false
),
(
    gen_random_uuid(),
    'Inteligencia Emocional',
    'Daniel Goleman',
    'Por qué es más importante que el cociente intelectual. Goleman explica cómo la inteligencia emocional puede ser fomentada y fortalecida en todos nosotros, y cómo esta habilidad determina nuestro éxito en las relaciones, el trabajo y hasta nuestro bienestar físico.',
    '/placeholder.svg?height=300&width=200&text=Inteligencia+Emocional',
    'Desarrollo Personal',
    4.5,
    384,
    1995,
    '6h 24min',
    'Intermedio',
    ARRAY['emociones', 'psicología', 'relaciones', 'autoconciencia', 'empatía'],
    ARRAY['Autoconciencia emocional', 'Autorregulación', 'Empatía', 'Habilidades sociales', 'Motivación'],
    true
),
(
    gen_random_uuid(),
    'Lean In',
    'Sheryl Sandberg',
    'Las mujeres, el trabajo y la voluntad de liderar. Sandberg examina por qué el progreso de las mujeres en el logro de roles de liderazgo se ha estancado, explica las causas fundamentales, y ofrece soluciones convincentes y prácticas.',
    '/placeholder.svg?height=300&width=200&text=Lean+In',
    'Liderazgo',
    4.4,
    240,
    2013,
    '4h 0min',
    'Fácil',
    ARRAY['liderazgo', 'mujeres', 'carrera', 'igualdad', 'trabajo', 'género'],
    ARRAY['Liderazgo femenino', 'Equilibrio trabajo-vida', 'Negociación', 'Confianza', 'Ambición'],
    false
);

-- Get book IDs and insert data with correct column names
DO $$
DECLARE
    book_atomic_habits_id UUID;
    book_7_habits_id UUID;
    book_deep_work_id UUID;
    book_emotional_id UUID;
    book_lean_in_id UUID;
    demo_user_id UUID := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
    -- Get book IDs
    SELECT id INTO book_atomic_habits_id FROM books WHERE title = 'Hábitos Atómicos';
    SELECT id INTO book_7_habits_id FROM books WHERE title = 'Los 7 Hábitos de la Gente Altamente Efectiva';
    SELECT id INTO book_deep_work_id FROM books WHERE title = 'Trabajo Profundo';
    SELECT id INTO book_emotional_id FROM books WHERE title = 'Inteligencia Emocional';
    SELECT id INTO book_lean_in_id FROM books WHERE title = 'Lean In';

    -- Insert user reading progress using actual column names (we'll check what exists first)
    -- This will be adjusted based on the actual table structure
    INSERT INTO user_book_progress (user_id, book_id, percentage, current_page, total_pages, last_read_at) VALUES
    (demo_user_id, book_atomic_habits_id, 25, 80, 320, NOW() - INTERVAL '1 day'),
    (demo_user_id, book_7_habits_id, 100, 432, 432, NOW() - INTERVAL '7 days'),
    (demo_user_id, book_emotional_id, 75, 288, 384, NOW() - INTERVAL '2 days'),
    (demo_user_id, book_lean_in_id, 40, 96, 240, NOW() - INTERVAL '3 days');

    -- Insert sample chapters for books
    INSERT INTO book_chapters (book_id, chapter_number, title, content) VALUES
    (book_atomic_habits_id, 1, 'El Sorprendente Poder de los Hábitos Atómicos', 
     'Los hábitos son el interés compuesto de la mejora personal. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites. Parecen hacer poca diferencia en un día cualquiera y, sin embargo, el impacto que generan a lo largo de los meses y años puede ser enorme. Es solo cuando miramos hacia atrás, dos, cinco o diez años después, que el valor de los buenos hábitos y el costo de los malos se vuelve asombrosamente aparente.

Este es uno de los significados centrales de este libro: un pequeño cambio puede hacer una gran diferencia. Pero saber que los pequeños hábitos marcan una gran diferencia es solo el primer paso. El verdadero desafío es descubrir cuáles son los pequeños hábitos que importan; enfocarse en ellos; y mantenerse motivado para seguir adelante cuando no veas resultados inmediatos.

Los hábitos atómicos son pequeños hábitos que forman parte de un sistema más grande. Así como los átomos son los bloques de construcción de las moléculas, los hábitos atómicos son los bloques de construcción de resultados notables. Los hábitos son como los átomos de nuestras vidas. Cada uno es una unidad fundamental que contribuye a tu mejora general.

Al final de este libro, tendrás un sistema probado que puede llevarte a nuevas alturas. Es solo una cuestión de saber cómo hacer que los hábitos trabajen para ti en lugar de en tu contra.'),
    
    (book_atomic_habits_id, 2, 'Cómo Tus Hábitos Moldean Tu Identidad (y Viceversa)', 
     'Hay tres niveles en los que puede ocurrir el cambio. Puedes imaginar que son como las capas de una cebolla.

El primer nivel es cambiar tus resultados. Este nivel se preocupa por cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato. La mayoría de las metas que te fijas están asociadas con este nivel de cambio.

El segundo nivel es cambiar tu proceso. Este nivel se preocupa por cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, organizar tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación. La mayoría de los hábitos que construyes están asociados con este nivel.

El tercer y más profundo nivel es cambiar tu identidad. Este nivel se preocupa por cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y sobre otros. La mayoría de las creencias, suposiciones y sesgos que tienes están asociados con este nivel.

Los resultados son sobre lo que obtienes. Los procesos son sobre lo que haces. La identidad es sobre lo que crees. Cuando se trata de construir hábitos duraderos, es decir, no solo por unas pocas semanas o meses, sino por años y décadas, la identidad es el nivel más profundo de cambio.

El verdadero cambio de comportamiento es cambio de identidad. Podrías comenzar un hábito debido a la motivación, pero la única razón por la que lo mantendrás es que se convierte en parte de tu identidad.'),
    
    (book_atomic_habits_id, 3, 'Cómo Construir Mejores Hábitos en 4 Simples Pasos', 
     'En 1898, un psicólogo llamado Edward Thorndike realizó un experimento que sentaría las bases para nuestro entendimiento de cómo se forman los hábitos. Thorndike estaba interesado en estudiar el comportamiento animal, así que construyó un laberinto llamado "caja rompecabezas". Colocó un gato dentro de la caja, que estaba diseñada para que el gato pudiera escapar a través de una serie de acciones como tirar de una cuerda, presionar una palanca y pisar una plataforma.

Al principio, cada gato se movía alrededor de la caja al azar. Podría arañar las paredes o olfatear los rincones. Luego, por casualidad, presionaría la palanca correcta, la puerta se abriría, y el gato escaparía. Thorndike pondría el mismo gato de vuelta en la caja y cronometraría cuánto tiempo tardaba en escapar.

En las pruebas sucesivas, cada gato se volvía un poco más rápido. En lugar de vagar sin rumbo, los gatos comenzaron a ir directamente hacia la palanca. Después de veinte o treinta intentos, los gatos podían escapar en unos pocos segundos.

Durante sus experimentos, Thorndike describió el proceso de aprendizaje diciendo: "Los comportamientos seguidos por consecuencias satisfactorias tienden a repetirse y aquellos que producen consecuencias desagradables son menos propensos a repetirse." Su trabajo proporcionó la base científica para lo que conocemos como la Ley del Efecto.

Este proceso dentro de nuestros cerebros es un bucle de retroalimentación de cuatro pasos: señal, anhelo, respuesta, recompensa. Y este ciclo es la columna vertebral de cada hábito.'),

    (book_7_habits_id, 1, 'Paradigmas y Principios', 
     'La forma en que vemos el problema es el problema. Covey nos introduce al concepto de paradigmas y cómo estos afectan nuestra percepción de la realidad y nuestras acciones.

Un paradigma es una teoría, un modelo o un marco de referencia. Es la manera en que "vemos" el mundo, no en términos de nuestro sentido de la vista, sino en términos de percepción, comprensión e interpretación. Para nuestros propósitos, una manera simple de entender los paradigmas es verlos como mapas.

Todos sabemos que "el mapa no es el territorio". Un mapa es simplemente una descripción de ciertos aspectos del territorio. Eso es exactamente lo que es un paradigma. Es una teoría, una explicación o un modelo de algo más.

Supongamos que quieres llegar a un lugar específico en el centro de Chicago. Un plano de la ciudad sería de gran ayuda. Pero supongamos que te dieran el mapa equivocado. Supongamos que te dieran un mapa de Detroit pero te dijeran que era un mapa de Chicago. ¿Puedes imaginar la frustración, la ineficacia de tratar de llegar a donde quieres ir?

Podrías trabajar en tu comportamiento: podrías tratar más duro, ser más diligente, duplicar tu velocidad. Pero tus esfuerzos solo te llevarían al lugar equivocado más rápido.

Podrías trabajar en tu actitud: podrías pensar más positivamente. Aún no llegarías al lugar correcto, pero tal vez no te importaría. Tu actitud sería tan positiva que te sentirías feliz donde sea que terminaras.

El punto es, tendrías el mapa equivocado. Este libro es sobre tener el mapa correcto de la vida, un mapa basado en principios universales y atemporales.'),

    (book_7_habits_id, 2, 'Los 7 Hábitos - Una Visión General', 
     'Nuestro carácter, básicamente, es un compuesto de nuestros hábitos. "Siembra un pensamiento, cosecha una acción; siembra una acción, cosecha un hábito; siembra un hábito, cosecha un carácter; siembra un carácter, cosecha un destino", dice el refrán.

Los hábitos son factores poderosos en nuestras vidas. Porque son patrones consistentes, a menudo inconscientes, constantemente expresan nuestro carácter y producen nuestra efectividad... o inefectividad.

Como Horace Mann, el gran educador, dijo una vez: "Los hábitos son como una cuerda. Tejemos un hilo cada día y pronto se vuelve tan fuerte que no podemos romperla." Pero algunos de nosotros encontramos que la cuerda que hemos tejido se ha convertido en una soga.

Los hábitos pueden ser aprendidos y desaprendidos. Pero sé que no es un proceso rápido o fácil. Involucra un compromiso tremendo y un proceso gradual.

Los 7 Hábitos de la Gente Altamente Efectiva presentan un enfoque "de adentro hacia afuera" del desarrollo personal y la efectividad. "De adentro hacia afuera" significa comenzar contigo mismo; aún más fundamentalmente, comenzar con las partes más internas de ti mismo: tus paradigmas, tu carácter y tus motivos.'),

    (book_emotional_id, 1, 'Para Qué Sirven las Emociones', 
     'Las emociones son impulsos para actuar, planes instantáneos para enfrentarnos a la vida que la evolución nos ha inculcado. La raíz de la palabra emoción es motere, el verbo latino "mover", además del prefijo "e", que implica "alejarse", lo que sugiere que en toda emoción hay implícita una tendencia a actuar.

Que las emociones conducen a la acción es muy obvio cuando observamos a los animales o a los niños; es solo en los adultos "civilizados" en los que tan a menudo encontramos la gran anomalía del reino animal: emociones divorciadas de reacciones.

En nuestro repertorio emocional, cada emoción juega un papel singular, como revela su distintiva "firma" biológica. Con nuevos métodos para mirar dentro del cuerpo y el cerebro, los investigadores están descubriendo más detalles fisiológicos de cómo cada emoción prepara al cuerpo para un tipo muy diferente de respuesta:

• Con la ira, la sangre fluye a las manos, haciendo más fácil empuñar un arma o golpear a un enemigo; el ritmo cardíaco se eleva y un aumento de hormonas como la adrenalina genera un pulso de energía lo suficientemente fuerte para una acción vigorosa.

• Con el miedo, la sangre va a los músculos del esqueleto grandes, como los de las piernas, haciendo más fácil huir, y el rostro se queda pálido cuando la sangre se desvía de él (creando la sensación de que la sangre "se hiela").

• En la felicidad, hay un aumento de actividad en un centro nervioso que inhibe los sentimientos negativos y fomenta un aumento en la energía disponible, y una quietud de aquellos que generan pensamientos preocupantes.

Estas tendencias biológicas a actuar están moldeadas además por nuestra experiencia de vida y nuestra cultura.'),

    (book_emotional_id, 2, 'Anatomía de un Secuestro Emocional', 
     'Fue en agosto de 1963, el día en que Martin Luther King Jr. pronunció su histórico discurso "Tengo un sueño" ante el Lincoln Memorial, cuando Richard Robles decidió cometer un crimen que lo convertiría en uno de los criminales más buscados de Nueva York.

Robles, un ladrón de carrera de veintidós años que acababa de salir de prisión tres meses antes, había decidido hacer un último trabajo antes de "volverse honesto" y casarse con su novia. El apartamento que eligió para robar en el Upper East Side de Manhattan parecía perfecto: los inquilinos, dos jóvenes mujeres, habían salido. Pero cuando Robles estaba recogiendo los objetos de valor que había reunido, una de las mujeres, Janice Wylie, de veintiún años, regresó inesperadamente a casa.

Robles la ató, pero luego entró en pánico cuando la segunda mujer, Emily Hoffert, de veintitrés años, también regresó. Para evitar ser identificado, Robles las mató a ambas.

La carrera criminal de Robles ilustra una verdad inquietante sobre la vida emocional: es en esos momentos cuando nos sentimos arrastrados por emociones que más tarde lamentamos, cuando estamos siendo secuestrados por nuestro cerebro límbico.

Este secuestro ocurre en un instante, desencadenando esta reacción crucial antes de que la mente racional, el neocórtex, haya tenido la oportunidad de vislumbrar completamente lo que está sucediendo, y mucho menos decidir si es una buena respuesta.'),

    (book_deep_work_id, 1, 'Trabajo Profundo: Una Habilidad Valiosa', 
     'En enero de 2014, el autor y columnista del New York Times David Brooks escribió un artículo titulado "La Filosofía de los Datos". El artículo argumentaba que estamos en medio de una revolución de datos que está transformando la forma en que entendemos y mejoramos el rendimiento en muchos campos.

Para ilustrar este punto, Brooks se centró en el mundo del béisbol profesional, donde el análisis estadístico sofisticado (conocido como "sabermetrics") había revolucionado la forma en que los equipos evaluaban y desarrollaban el talento. Pero luego Brooks hizo una observación interesante: esta revolución de datos, argumentó, no se había extendido a muchas otras áreas importantes de la vida humana.

"Tenemos estadísticas de béisbol más sofisticadas que estadísticas de crianza de niños", escribió Brooks. Esta observación captura algo importante sobre nuestro momento actual: estamos inundados de datos sobre algunos aspectos de nuestras vidas, mientras que permanecemos sorprendentemente ignorantes sobre otros aspectos igualmente importantes.

Creo que hay una habilidad que es particularmente valiosa en nuestra economía, pero que permanece mal entendida y, por lo tanto, mal cultivada. Llamo a esta habilidad "trabajo profundo", y la defino de la siguiente manera:

Trabajo Profundo: Actividades profesionales realizadas en un estado de concentración libre de distracciones que empujan tus capacidades cognitivas a su límite. Estos esfuerzos crean nuevo valor, mejoran tu habilidad y son difíciles de replicar.'),

    (book_lean_in_id, 1, 'La Revolución Interna', 
     'Hace unos años, una joven empleada muy talentosa de Facebook se acercó a mí después de una presentación que había dado. Mientras hablábamos, me dijo que aunque le encantaba su trabajo, también estaba considerando dejar la empresa. Le pregunté por qué, esperando escuchar que había recibido una oferta increíble de otra parte. En cambio, me explicó que algún día quería tener hijos y había escuchado que trabajar en Facebook era demasiado demandante para permitir un equilibrio entre el trabajo y la vida personal.

"¿Cuándo planeas tener hijos?", le pregunté.

"Oh, en unos años", respondió. "Pero quiero ponerme en una trayectoria profesional más manejable ahora."

Me quedé atónita. Aquí había una mujer de veintipocos años que ya estaba limitando sus opciones profesionales para acomodar hijos hipotéticos en un futuro hipotético.

Desde esa conversación, he escuchado esta historia muchas veces. Las mujeres rara vez toman decisiones profesionales basadas únicamente en lo que quieren hacer o en lo que las haría más felices. En cambio, deciden qué hacer basándose en lo que creen que podrán hacer. Antes de que una mujer tenga su primer hijo, y a menudo antes de que esté embarazada, o incluso antes de que esté en una relación seria, ella ya está haciendo acomodaciones para los hijos que espera tener algún día.

Esta es la revolución interna que necesitamos: las mujeres tienen que dejar de limitarse a sí mismas.'),

    (book_lean_in_id, 2, 'Siéntate a la Mesa', 
     'Hace varios años, fui invitada a realizar una presentación en una conferencia de tecnología. Había unas trescientas personas en la audiencia, y noté que las mujeres estaban sentadas en la parte de atrás y a los lados de la sala, mientras que los hombres ocupaban las filas del frente y del centro.

Antes de comenzar mi charla, les dije a las mujeres que se movieran hacia adelante y ocuparan los asientos vacíos en el frente. Nadie se movió. Así que hice la solicitud más específica: "Quiero que todas las mujeres se pongan de pie ahora mismo y vengan a sentarse en las primeras dos filas." Unas veinte mujeres se levantaron y se movieron hacia adelante.

Mi presentación se centró en la importancia de que las mujeres se "sienten a la mesa", tanto literal como figurativamente. Demasiadas mujeres, incluso cuando están calificadas, no se postulan para trabajos o buscan desafíos porque no creen que merezcan estar allí. Demasiadas mujeres no hablan cuando deberían hacerlo. Como resultado, se quedan en la periferia, y los hombres en el centro toman las decisiones clave.

Cuando las mujeres no se sientan a la mesa, pierden oportunidades de aprender, contribuir y liderar. Y cuando esto sucede, todos perdemos.

El primer paso para sentarse a la mesa es creer que perteneces allí. Esta creencia no es solo sobre tener confianza, aunque eso es importante. Es sobre reconocer que tu perspectiva es valiosa y que tienes algo único que ofrecer.');
END $$;

-- Insert or update user reading statistics
INSERT INTO user_reading_stats (user_id, books_read, total_reading_time, reading_streak, points, level, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    12,
    2880, -- 48 hours in minutes
    15,
    2450,
    3,
    NOW(),
    NOW()
) ON CONFLICT (user_id) DO UPDATE SET
    books_read = EXCLUDED.books_read,
    total_reading_time = EXCLUDED.total_reading_time,
    reading_streak = EXCLUDED.reading_streak,
    points = EXCLUDED.points,
    level = EXCLUDED.level,
    updated_at = NOW();

-- Verification queries
SELECT 'Books inserted successfully' as status, COUNT(*) as total_books FROM books;

SELECT 
    title,
    author,
    category,
    rating,
    pages,
    published_year,
    reading_time,
    difficulty,
    is_recommended,
    array_length(tags, 1) as tag_count,
    array_length(key_topics, 1) as topic_count
FROM books 
ORDER BY created_at DESC;

SELECT 'User progress records' as status, COUNT(*) as progress_records FROM user_book_progress;

SELECT 
    b.title,
    b.author,
    COALESCE(ubp.percentage, 0) as progress,
    COALESCE(ubp.current_page, 0) as current_page,
    COALESCE(ubp.total_pages, b.pages) as total_pages,
    CASE 
        WHEN COALESCE(ubp.percentage, 0) >= 100 THEN 'Completado'
        WHEN COALESCE(ubp.percentage, 0) > 0 THEN 'En Progreso'
        ELSE 'No Iniciado'
    END as status
FROM books b
LEFT JOIN user_book_progress ubp ON b.id = ubp.book_id
ORDER BY COALESCE(ubp.percentage, 0) DESC;

SELECT 
    'User reading stats' as status,
    books_read,
    total_reading_time,
    reading_streak,
    points,
    level
FROM user_reading_stats
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

SELECT 
    b.title,
    COUNT(bc.id) as chapters_available
FROM books b
LEFT JOIN book_chapters bc ON b.id = bc.book_id
GROUP BY b.id, b.title
ORDER BY chapters_available DESC;

SELECT 
    'Library Setup Complete' as final_status,
    (SELECT COUNT(*) FROM books) as total_books,
    (SELECT COUNT(*) FROM book_chapters) as total_chapters,
    (SELECT COUNT(*) FROM user_book_progress) as user_progress_records,
    (SELECT COUNT(*) FROM user_reading_stats) as user_stats_records;
