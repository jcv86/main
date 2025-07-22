-- Clear existing data
DELETE FROM user_book_bookmarks;
DELETE FROM user_book_progress;
DELETE FROM books;

-- Insert books with proper UUIDs and complete data
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
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Atomic Habits',
  'James Clear',
  'Un método fácil y comprobado para crear buenos hábitos y eliminar los malos. James Clear revela estrategias prácticas que te enseñarán exactamente cómo formar buenos hábitos, romper los malos y dominar los pequeños comportamientos que llevan a resultados notables.',
  'Productividad',
  4.8,
  '4h 30min',
  320,
  2018,
  '/books/atomic-habits.jpg',
  ARRAY['Hábitos', 'Productividad', 'Autoayuda', 'Comportamiento'],
  'Intermedio',
  ARRAY['Formación de hábitos', 'Productividad personal', 'Cambio de comportamiento', 'Sistemas vs objetivos'],
  true,
  NOW(),
  NOW()
),
(
  'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  'The 7 Habits of Highly Effective People',
  'Stephen R. Covey',
  'Lecciones poderosas de cambio personal que han inspirado a millones de personas. Covey presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales.',
  'Liderazgo',
  4.6,
  '6h 15min',
  432,
  1989,
  '/books/7-habits.jpg',
  ARRAY['Liderazgo', 'Efectividad', 'Desarrollo Personal', 'Principios'],
  'Intermedio',
  ARRAY['Liderazgo personal', 'Efectividad', 'Principios de vida', 'Interdependencia'],
  false,
  NOW(),
  NOW()
),
(
  'c3d4e5f6-g7h8-9012-cdef-345678901234',
  'Lean In',
  'Sheryl Sandberg',
  'Las mujeres, el trabajo y la voluntad de liderar en el mundo profesional moderno. Sandberg examina por qué el progreso de las mujeres en el logro de roles de liderazgo se ha estancado.',
  'Liderazgo',
  4.5,
  '5h 20min',
  368,
  2013,
  '/books/lean-in.jpg',
  ARRAY['Liderazgo', 'Carrera', 'Género', 'Empoderamiento'],
  'Intermedio',
  ARRAY['Liderazgo femenino', 'Desarrollo profesional', 'Igualdad de género', 'Ambición'],
  true,
  NOW(),
  NOW()
),
(
  'd4e5f6g7-h8i9-0123-defg-456789012345',
  'Deep Work',
  'Cal Newport',
  'Reglas para el éxito enfocado en un mundo distraído. Newport argumenta que la capacidad de concentrarse sin distracción en una tarea cognitivamente demandante es una habilidad cada vez más valiosa.',
  'Productividad',
  4.7,
  '4h 45min',
  304,
  2016,
  '/books/deep-work.jpg',
  ARRAY['Concentración', 'Productividad', 'Trabajo', 'Enfoque'],
  'Avanzado',
  ARRAY['Trabajo profundo', 'Concentración', 'Productividad cognitiva', 'Distracción digital'],
  false,
  NOW(),
  NOW()
),
(
  'e5f6g7h8-i9j0-1234-efgh-567890123456',
  'Emotional Intelligence 2.0',
  'Travis Bradberry',
  'Estrategias para aumentar tu EQ y mejorar tus habilidades interpersonales. Bradberry y Greaves proporcionan un programa paso a paso para aumentar tu inteligencia emocional.',
  'Habilidades Blandas',
  4.4,
  '3h 50min',
  280,
  2009,
  '/books/emotional-intelligence.jpg',
  ARRAY['Inteligencia Emocional', 'Habilidades Blandas', 'Comunicación', 'Autoconciencia'],
  'Intermedio',
  ARRAY['Inteligencia emocional', 'Autoconciencia', 'Habilidades sociales', 'Autorregulación'],
  true,
  NOW(),
  NOW()
),
(
  'f6g7h8i9-j0k1-2345-fghi-678901234567',
  'The Lean Startup',
  'Eric Ries',
  'Cómo los emprendedores de hoy usan la innovación continua para crear negocios exitosos. Ries presenta un enfoque científico para crear y gestionar startups exitosas.',
  'Emprendimiento',
  4.3,
  '5h 10min',
  336,
  2011,
  '/books/lean-startup.jpg',
  ARRAY['Emprendimiento', 'Startup', 'Innovación', 'Metodología'],
  'Intermedio',
  ARRAY['Metodología lean', 'Validación de productos', 'Innovación', 'MVP'],
  false,
  NOW(),
  NOW()
),
(
  'g7h8i9j0-k1l2-3456-ghij-789012345678',
  'Mindset',
  'Carol S. Dweck',
  'La nueva psicología del éxito y cómo desarrollar una mentalidad de crecimiento. Dweck revela cómo el éxito en la escuela, el trabajo, los deportes, las artes y casi todas las áreas de la actividad humana puede ser dramáticamente influenciado por cómo pensamos sobre nuestros talentos y habilidades.',
  'Psicología',
  4.6,
  '4h 20min',
  276,
  2006,
  '/books/mindset.jpg',
  ARRAY['Mentalidad', 'Crecimiento', 'Psicología', 'Motivación'],
  'Intermedio',
  ARRAY['Mentalidad de crecimiento', 'Resiliencia', 'Aprendizaje', 'Motivación intrínseca'],
  true,
  NOW(),
  NOW()
),
(
  'h8i9j0k1-l2m3-4567-hijk-890123456789',
  'The Power of Now',
  'Eckhart Tolle',
  'Una guía hacia la iluminación espiritual y la presencia consciente. Tolle demuestra cómo vivir una vida más sana y feliz al vivir completamente en el presente.',
  'Espiritualidad',
  4.4,
  '3h 45min',
  236,
  1997,
  '/books/power-of-now.jpg',
  ARRAY['Mindfulness', 'Espiritualidad', 'Presente', 'Conciencia'],
  'Avanzado',
  ARRAY['Mindfulness', 'Conciencia', 'Presencia', 'Meditación'],
  false,
  NOW(),
  NOW()
),
(
  'i9j0k1l2-m3n4-5678-ijkl-901234567890',
  'Good to Great',
  'Jim Collins',
  'Por qué algunas empresas dan el salto... y otras no. Collins y su equipo de investigación identificaron las características distintivas de las empresas que hicieron la transición de buenas a grandiosas.',
  'Liderazgo',
  4.5,
  '5h 30min',
  300,
  2001,
  '/books/good-to-great.jpg',
  ARRAY['Liderazgo', 'Empresa', 'Excelencia', 'Gestión'],
  'Intermedio',
  ARRAY['Liderazgo empresarial', 'Transformación', 'Excelencia', 'Cultura organizacional'],
  true,
  NOW(),
  NOW()
),
(
  'j0k1l2m3-n4o5-6789-jklm-012345678901',
  'The 4-Hour Workweek',
  'Timothy Ferriss',
  'Escapa de la rutina de 9-5, vive en cualquier lugar y únete a los nuevos ricos. Ferriss muestra cómo vivir más y trabajar menos, utilizando los principios de automatización y liberación.',
  'Productividad',
  4.2,
  '4h 50min',
  308,
  2007,
  '/books/4-hour-workweek.jpg',
  ARRAY['Productividad', 'Libertad', 'Emprendimiento', 'Automatización'],
  'Intermedio',
  ARRAY['Automatización', 'Outsourcing', 'Libertad financiera', 'Estilo de vida'],
  false,
  NOW(),
  NOW()
),
(
  'k1l2m3n4-o5p6-7890-klmn-123456789012',
  'Crucial Conversations',
  'Kerry Patterson',
  'Herramientas para hablar cuando las apuestas son altas. Los autores enseñan cómo prepararse y manejar conversaciones cruciales con confianza y habilidad.',
  'Habilidades Blandas',
  4.7,
  '4h 15min',
  284,
  2002,
  '/books/crucial-conversations.jpg',
  ARRAY['Comunicación', 'Conversaciones', 'Habilidades Blandas', 'Conflictos'],
  'Intermedio',
  ARRAY['Comunicación efectiva', 'Resolución de conflictos', 'Diálogo', 'Negociación'],
  true,
  NOW(),
  NOW()
),
(
  'l2m3n4o5-p6q7-8901-lmno-234567890123',
  'Zero to One',
  'Peter Thiel',
  'Notas sobre startups, o cómo construir el futuro. Thiel muestra cómo construir empresas que crean cosas nuevas, basándose en su experiencia como cofundador de PayPal y primer inversor en Facebook.',
  'Emprendimiento',
  4.4,
  '3h 30min',
  224,
  2014,
  '/books/zero-to-one.jpg',
  ARRAY['Emprendimiento', 'Startup', 'Innovación', 'Tecnología'],
  'Avanzado',
  ARRAY['Innovación', 'Monopolios', 'Tecnología', 'Venture Capital'],
  true,
  NOW(),
  NOW()
);

-- Insert sample reading progress for demo user with proper UUIDs
INSERT INTO user_book_progress (
  user_id,
  book_id,
  progress,
  current_page,
  total_pages,
  reading_time_minutes,
  started_at,
  last_read_at,
  created_at,
  updated_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000000', -- Demo user ID
  'c3d4e5f6-g7h8-9012-cdef-345678901234', -- Lean In
  35,
  129,
  368,
  105,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '1 day',
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000000', -- Demo user ID
  'e5f6g7h8-i9j0-1234-efgh-567890123456', -- Emotional Intelligence 2.0
  60,
  168,
  280,
  142,
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '2 days',
  NOW(),
  NOW()
);

-- Insert sample bookmarks for demo user with proper UUIDs
INSERT INTO user_book_bookmarks (
  user_id,
  book_id,
  page_number,
  chapter_title,
  note,
  created_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000000', -- Demo user ID
  'c3d4e5f6-g7h8-9012-cdef-345678901234', -- Lean In
  45,
  'Capítulo 2: Siéntate a la Mesa',
  'Punto importante sobre la confianza en las reuniones de trabajo.',
  NOW() - INTERVAL '3 days'
),
(
  '00000000-0000-0000-0000-000000000000', -- Demo user ID
  'c3d4e5f6-g7h8-9012-cdef-345678901234', -- Lean In
  87,
  'Capítulo 4: Es una Jungla Ahí Afuera',
  'Estadísticas interesantes sobre mujeres en posiciones de liderazgo.',
  NOW() - INTERVAL '2 days'
),
(
  '00000000-0000-0000-0000-000000000000', -- Demo user ID
  'e5f6g7h8-i9j0-1234-efgh-567890123456', -- Emotional Intelligence 2.0
  92,
  'Capítulo 3: Autoconciencia',
  'Ejercicio práctico para mejorar la autoconciencia emocional.',
  NOW() - INTERVAL '4 days'
),
(
  '00000000-0000-0000-0000-000000000000', -- Demo user ID
  'e5f6g7h8-i9j0-1234-efgh-567890123456', -- Emotional Intelligence 2.0
  134,
  'Capítulo 5: Habilidades Sociales',
  'Técnicas para leer mejor las emociones de otros.',
  NOW() - INTERVAL '1 day'
),
(
  '00000000-0000-0000-0000-000000000000', -- Demo user ID
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- Atomic Habits
  23,
  'Capítulo 1: El Poder de los Hábitos Atómicos',
  'La regla del 1% - pequeñas mejoras compuestas.',
  NOW() - INTERVAL '1 week'
);

-- Verify the data was inserted correctly
SELECT 
    COUNT(*) as total_books,
    COUNT(CASE WHEN is_recommended = true THEN 1 END) as recommended_books,
    COUNT(DISTINCT category) as categories
FROM books;

-- Show sample of inserted books with their cover URLs
SELECT id, title, author, category, rating, is_recommended, difficulty, cover_url 
FROM books 
ORDER BY rating DESC 
LIMIT 12;
