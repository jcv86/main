-- Complete library setup with real book data
-- This script creates and populates the library with authentic information

-- Clean up existing data
DELETE FROM user_book_progress;
DELETE FROM book_chapters;
DELETE FROM books;
DELETE FROM user_reading_stats;

-- Insert real books with authentic data using correct difficulty values
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
    'intermediate',
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
    'intermediate',
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
    'advanced',
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
    'intermediate',
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
    'beginner',
    ARRAY['liderazgo', 'mujeres', 'carrera', 'igualdad', 'trabajo', 'género'],
    ARRAY['Liderazgo femenino', 'Equilibrio trabajo-vida', 'Negociación', 'Confianza', 'Ambición'],
    false
);

-- Get book IDs for progress tracking
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

    -- Insert user reading progress
    INSERT INTO user_book_progress (user_id, book_id, progress_percentage, current_chapter, total_chapters, reading_time_minutes, last_read_at) VALUES
    (demo_user_id, book_atomic_habits_id, 25, 2, 16, 80, NOW() - INTERVAL '1 day'),
    (demo_user_id, book_7_habits_id, 100, 12, 12, 432, NOW() - INTERVAL '7 days'),
    (demo_user_id, book_emotional_id, 75, 8, 12, 288, NOW() - INTERVAL '2 days'),
    (demo_user_id, book_lean_in_id, 40, 3, 8, 96, NOW() - INTERVAL '3 days');

    -- Insert sample chapters for Hábitos Atómicos
    INSERT INTO book_chapters (book_id, chapter_number, title, content, reading_time_minutes) VALUES
    (book_atomic_habits_id, 1, 'El Sorprendente Poder de los Hábitos Atómicos', 
     'Los hábitos son el interés compuesto de la mejora personal. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites. Parecen hacer poca diferencia en un día cualquiera y, sin embargo, el impacto que generan a lo largo de los meses y años puede ser enorme.', 
     15),
    (book_atomic_habits_id, 2, 'Cómo Tus Hábitos Moldean Tu Identidad (y Viceversa)', 
     'Hay tres niveles en los que puede ocurrir el cambio. Puedes imaginar que son como las capas de una cebolla. El primer nivel es cambiar tus resultados. Este nivel se preocupa por cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato.', 
     18),
    (book_atomic_habits_id, 3, 'Cómo Construir Mejores Hábitos en 4 Simples Pasos', 
     'En 1898, un psicólogo llamado Edward Thorndike realizó un experimento que sentaría las bases para nuestro entendimiento de cómo se forman los hábitos. Thorndike estaba interesado en estudiar el comportamiento animal, así que construyó un laberinto llamado "caja rompecabezas".', 
     20);

    -- Insert sample chapters for other books
    INSERT INTO book_chapters (book_id, chapter_number, title, content, reading_time_minutes) VALUES
    (book_7_habits_id, 1, 'Paradigmas y Principios', 
     'La forma en que vemos el problema es el problema. Covey nos introduce al concepto de paradigmas y cómo estos afectan nuestra percepción de la realidad y nuestras acciones.', 
     25),
    (book_emotional_id, 1, 'Para Qué Sirven las Emociones', 
     'Las emociones son impulsos para actuar, planes instantáneos para enfrentarnos a la vida que la evolución nos ha inculcado. La raíz de la palabra emoción es motere, el verbo latino "mover".', 
     22);
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
    ubp.progress_percentage,
    ubp.current_chapter,
    ubp.total_chapters,
    ubp.reading_time_minutes,
    CASE 
        WHEN ubp.progress_percentage >= 100 THEN 'Completado'
        WHEN ubp.progress_percentage > 0 THEN 'En Progreso'
        ELSE 'No Iniciado'
    END as status
FROM books b
LEFT JOIN user_book_progress ubp ON b.id = ubp.book_id
ORDER BY ubp.progress_percentage DESC NULLS LAST;

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
