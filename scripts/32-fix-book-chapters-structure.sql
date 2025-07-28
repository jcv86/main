-- First, let's check what columns exist in book_chapters table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'book_chapters' 
ORDER BY ordinal_position;

-- Check what columns exist in user_book_progress table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_book_progress' 
ORDER BY ordinal_position;

-- Check the actual difficulty constraint values
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
WHERE t.relname = 'books' AND conname LIKE '%difficulty%';

-- Clean up existing data first
DELETE FROM user_book_progress;
DELETE FROM book_chapters WHERE 1=1;
DELETE FROM books;
DELETE FROM user_reading_stats WHERE 1=1;

-- Insert books with corrected difficulty values (using the actual constraint values)
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

-- Get book IDs and insert progress/chapters with correct column names
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

    -- Insert user reading progress (using correct column names)
    INSERT INTO user_book_progress (user_id, book_id, progress, current_page, total_pages, reading_time_minutes, last_read_at) VALUES
    (demo_user_id, book_atomic_habits_id, 25, 80, 320, 80, NOW() - INTERVAL '1 day'),
    (demo_user_id, book_7_habits_id, 100, 432, 432, 432, NOW() - INTERVAL '7 days'),
    (demo_user_id, book_emotional_id, 75, 288, 384, 288, NOW() - INTERVAL '2 days'),
    (demo_user_id, book_lean_in_id, 40, 96, 240, 96, NOW() - INTERVAL '3 days');

    -- Insert sample chapters for Hábitos Atómicos (using correct column names)
    INSERT INTO book_chapters (book_id, chapter_number, title, content) VALUES
    (book_atomic_habits_id, 1, 'El Sorprendente Poder de los Hábitos Atómicos', 
     'Los hábitos son el interés compuesto de la mejora personal. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites. Parecen hacer poca diferencia en un día cualquiera y, sin embargo, el impacto que generan a lo largo de los meses y años puede ser enorme. Es solo cuando miramos hacia atrás, dos, cinco o diez años después, que el valor de los buenos hábitos y el costo de los malos se vuelve asombrosamente aparente.

Este es uno de los significados centrales de este libro: un pequeño cambio puede hacer una gran diferencia. Pero saber que los pequeños hábitos marcan una gran diferencia es solo el primer paso. El verdadero desafío es descubrir cuáles son los pequeños hábitos que importan; enfocarse en ellos; y mantenerse motivado para seguir adelante cuando no veas resultados inmediatos.

Los hábitos atómicos son pequeños hábitos que forman parte de un sistema más grande. Así como los átomos son los bloques de construcción de las moléculas, los hábitos atómicos son los bloques de construcción de resultados notables. Los hábitos son como los átomos de nuestras vidas. Cada uno es una unidad fundamental que contribuye a tu mejora general.'),
    (book_atomic_habits_id, 2, 'Cómo Tus Hábitos Moldean Tu Identidad (y Viceversa)', 
     'Hay tres niveles en los que puede ocurrir el cambio. Puedes imaginar que son como las capas de una cebolla.

El primer nivel es cambiar tus resultados. Este nivel se preocupa por cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato. La mayoría de las metas que te fijas están asociadas con este nivel de cambio.

El segundo nivel es cambiar tu proceso. Este nivel se preocupa por cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, organizar tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación. La mayoría de los hábitos que construyes están asociados con este nivel.

El tercer y más profundo nivel es cambiar tu identidad. Este nivel se preocupa por cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y sobre otros. La mayoría de las creencias, suposiciones y sesgos que tienes están asociados con este nivel.

Los resultados son sobre lo que obtienes. Los procesos son sobre lo que haces. La identidad es sobre lo que crees. Cuando se trata de construir hábitos duraderos, es decir, no solo por unas pocas semanas o meses, sino por años y décadas, la identidad es el nivel más profundo de cambio.'),
    (book_atomic_habits_id, 3, 'Cómo Construir Mejores Hábitos en 4 Simples Pasos', 
     'En 1898, un psicólogo llamado Edward Thorndike realizó un experimento que sentaría las bases para nuestro entendimiento de cómo se forman los hábitos. Thorndike estaba interesado en estudiar el comportamiento animal, así que construyó un laberinto llamado "caja rompecabezas". Colocó un gato dentro de la caja, que estaba diseñada para que el gato pudiera escapar a través de una serie de acciones como tirar de una cuerda, presionar una palanca y pisar una plataforma.

Al principio, cada gato se movía alrededor de la caja al azar. Podría arañar las paredes o olfatear los rincones. Luego, por casualidad, presionaría la palanca correcta, la puerta se abriría, y el gato escaparía. Thorndike pondría el mismo gato de vuelta en la caja y cronometraría cuánto tiempo tardaba en escapar.

En las pruebas sucesivas, cada gato se volvía un poco más rápido. En lugar de vagar sin rumbo, los gatos comenzaron a ir directamente hacia la palanca. Después de veinte o treinta intentos, los gatos podían escapar en unos pocos segundos.

Durante sus experimentos, Thorndike describió el proceso de aprendizaje diciendo: "Los comportamientos seguidos por consecuencias satisfactorias tienden a repetirse y aquellos que producen consecuencias desagradables son menos propensos a repetirse." Su trabajo proporcionó la base científica para lo que conocemos como la Ley del Efecto, que establece que las respuestas que producen un efecto satisfactorio en una situación particular se vuelven más probables de ocurrir nuevamente en esa situación.');

    -- Insert sample chapters for other books
    INSERT INTO book_chapters (book_id, chapter_number, title, content) VALUES
    (book_7_habits_id, 1, 'Paradigmas y Principios', 
     'La forma en que vemos el problema es el problema. Covey nos introduce al concepto de paradigmas y cómo estos afectan nuestra percepción de la realidad y nuestras acciones.

Un paradigma es una teoría, un modelo o un marco de referencia. Es la manera en que "vemos" el mundo, no en términos de nuestro sentido de la vista, sino en términos de percepción, comprensión e interpretación. Para nuestros propósitos, una manera simple de entender los paradigmas es verlos como mapas.

Todos sabemos que "el mapa no es el territorio". Un mapa es simplemente una descripción de ciertos aspectos del territorio. Eso es exactamente lo que es un paradigma. Es una teoría, una explicación o un modelo de algo más.

Supongamos que quieres llegar a un lugar específico en el centro de Chicago. Un plano de la ciudad sería de gran ayuda. Pero supongamos que te dieran el mapa equivocado. Supongamos que te dieran un mapa de Detroit pero te dijeran que era un mapa de Chicago. ¿Puedes imaginar la frustración, la ineficacia de tratar de llegar a donde quieres ir?

Podrías trabajar en tu comportamiento: podrías tratar más duro, ser más diligente, duplicar tu velocidad. Pero tus esfuerzos solo te llevarían al lugar equivocado más rápido.

Podrías trabajar en tu actitud: podrías pensar más positivamente. Aún no llegarías al lugar correcto, pero tal vez no te importaría. Tu actitud sería tan positiva que te sentirías feliz donde sea que terminaras.

El punto es, tendrías el mapa equivocado.'),
    (book_emotional_id, 1, 'Para Qué Sirven las Emociones', 
     'Las emociones son impulsos para actuar, planes instantáneos para enfrentarnos a la vida que la evolución nos ha inculcado. La raíz de la palabra emoción es motere, el verbo latino "mover", además del prefijo "e", que implica "alejarse", lo que sugiere que en toda emoción hay implícita una tendencia a actuar.

Que las emociones conducen a la acción es muy obvio cuando observamos a los animales o a los niños; es solo en los adultos "civilizados" en los que tan a menudo encontramos la gran anomalía del reino animal: emociones divorciadas de reacciones.

En nuestro repertorio emocional, cada emoción juega un papel singular, como revela su distintiva "firma" biológica. Con nuevos métodos para mirar dentro del cuerpo y el cerebro, los investigadores están descubriendo más detalles fisiológicos de cómo cada emoción prepara al cuerpo para un tipo muy diferente de respuesta:

• Con la ira, la sangre fluye a las manos, haciendo más fácil empuñar un arma o golpear a un enemigo; el ritmo cardíaco se eleva y un aumento de hormonas como la adrenalina genera un pulso de energía lo suficientemente fuerte para una acción vigorosa.

• Con el miedo, la sangre va a los músculos del esqueleto grandes, como los de las piernas, haciendo más fácil huir, y el rostro se queda pálido cuando la sangre se desvía de él (creando la sensación de que la sangre "se hiela").

• En la felicidad, hay un aumento de actividad en un centro nervioso que inhibe los sentimientos negativos y fomenta un aumento en la energía disponible, y una quietud de aquellos que generan pensamientos preocupantes.');
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
    ubp.progress,
    ubp.current_page,
    ubp.total_pages,
    ubp.reading_time_minutes,
    CASE 
        WHEN ubp.progress >= 100 THEN 'Completado'
        WHEN ubp.progress > 0 THEN 'En Progreso'
        ELSE 'No Iniciado'
    END as status
FROM books b
LEFT JOIN user_book_progress ubp ON b.id = ubp.book_id
ORDER BY ubp.progress DESC NULLS LAST;

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
