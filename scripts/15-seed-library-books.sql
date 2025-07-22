-- Seed library books with comprehensive data
-- This script populates the books table with professional development books

-- Insert books data
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
  'Atomic Habits',
  'James Clear',
  'Un método fácil y comprobado para crear buenos hábitos y eliminar los malos. James Clear revela estrategias prácticas que te enseñarán exactamente cómo formar buenos hábitos, romper los malos y dominar los pequeños comportamientos que llevan a resultados notables.',
  'Productividad',
  4.8,
  '4h 30min',
  320,
  2018,
  '/placeholder.svg?height=400&width=300&text=Atomic%20Habits&bg=f59e0b&color=white',
  ARRAY['Hábitos', 'Productividad', 'Autoayuda', 'Comportamiento'],
  'Intermedio',
  ARRAY['Formación de hábitos', 'Productividad personal', 'Cambio de comportamiento', 'Sistemas vs objetivos'],
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'The 7 Habits of Highly Effective People',
  'Stephen R. Covey',
  'Lecciones poderosas de cambio personal que han inspirado a millones de personas. Covey presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales.',
  'Liderazgo',
  4.6,
  '6h 15min',
  432,
  1989,
  '/placeholder.svg?height=400&width=300&text=7%20Habits&bg=1f2937&color=white',
  ARRAY['Liderazgo', 'Efectividad', 'Desarrollo Personal', 'Principios'],
  'Intermedio',
  ARRAY['Liderazgo personal', 'Efectividad', 'Principios de vida', 'Interdependencia'],
  false,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Lean In',
  'Sheryl Sandberg',
  'Las mujeres, el trabajo y la voluntad de liderar en el mundo profesional moderno. Sandberg examina por qué el progreso de las mujeres en el logro de roles de liderazgo se ha estancado.',
  'Liderazgo',
  4.5,
  '5h 20min',
  368,
  2013,
  '/placeholder.svg?height=400&width=300&text=Lean%20In&bg=ec4899&color=white',
  ARRAY['Liderazgo', 'Carrera', 'Género', 'Empoderamiento'],
  'Intermedio',
  ARRAY['Liderazgo femenino', 'Desarrollo profesional', 'Igualdad de género', 'Ambición'],
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Deep Work',
  'Cal Newport',
  'Reglas para el éxito enfocado en un mundo distraído. Newport argumenta que la capacidad de concentrarse sin distracción en una tarea cognitivamente demandante es una habilidad cada vez más valiosa.',
  'Productividad',
  4.7,
  '4h 45min',
  304,
  2016,
  '/placeholder.svg?height=400&width=300&text=DEEP%20WORK&bg=f59e0b&color=1f2937',
  ARRAY['Concentración', 'Productividad', 'Trabajo', 'Enfoque'],
  'Avanzado',
  ARRAY['Trabajo profundo', 'Concentración', 'Productividad cognitiva', 'Distracción digital'],
  false,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Emotional Intelligence 2.0',
  'Travis Bradberry',
  'Estrategias para aumentar tu EQ y mejorar tus habilidades interpersonales. Bradberry y Greaves proporcionan un programa paso a paso para aumentar tu inteligencia emocional.',
  'Habilidades Blandas',
  4.4,
  '3h 50min',
  280,
  2009,
  '/placeholder.svg?height=400&width=300&text=Emotional%20Intelligence&bg=3b82f6&color=white',
  ARRAY['Inteligencia Emocional', 'Habilidades Blandas', 'Comunicación', 'Autoconciencia'],
  'Intermedio',
  ARRAY['Inteligencia emocional', 'Autoconciencia', 'Habilidades sociales', 'Autorregulación'],
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440006',
  'The Lean Startup',
  'Eric Ries',
  'Cómo los emprendedores de hoy usan la innovación continua para crear negocios exitosos. Ries presenta un enfoque científico para crear y gestionar startups exitosas.',
  'Emprendimiento',
  4.3,
  '5h 10min',
  336,
  2011,
  '/placeholder.svg?height=400&width=300&text=THE%20LEAN%20STARTUP&bg=0ea5e9&color=white',
  ARRAY['Emprendimiento', 'Startup', 'Innovación', 'Metodología'],
  'Intermedio',
  ARRAY['Metodología lean', 'Validación de productos', 'Innovación', 'MVP'],
  false,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440007',
  'Mindset',
  'Carol S. Dweck',
  'La nueva psicología del éxito y cómo desarrollar una mentalidad de crecimiento. Dweck revela cómo el éxito en la escuela, el trabajo, los deportes, las artes y casi todas las áreas de la actividad humana puede ser dramáticamente influenciado por cómo pensamos sobre nuestros talentos y habilidades.',
  'Psicología',
  4.6,
  '4h 20min',
  276,
  2006,
  '/placeholder.svg?height=400&width=300&text=MINDSET&bg=10b981&color=white',
  ARRAY['Mentalidad', 'Crecimiento', 'Psicología', 'Motivación'],
  'Intermedio',
  ARRAY['Mentalidad de crecimiento', 'Resiliencia', 'Aprendizaje', 'Motivación intrínseca'],
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440008',
  'The Power of Now',
  'Eckhart Tolle',
  'Una guía hacia la iluminación espiritual y la presencia consciente. Tolle demuestra cómo vivir una vida más sana y feliz al vivir completamente en el presente.',
  'Espiritualidad',
  4.4,
  '3h 45min',
  236,
  1997,
  '/placeholder.svg?height=400&width=300&text=The%20Power%20of%20Now&bg=7c3aed&color=white',
  ARRAY['Mindfulness', 'Espiritualidad', 'Presente', 'Conciencia'],
  'Avanzado',
  ARRAY['Mindfulness', 'Conciencia', 'Presencia', 'Meditación'],
  false,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440009',
  'Good to Great',
  'Jim Collins',
  'Por qué algunas empresas dan el salto... y otras no. Collins y su equipo de investigación identificaron las características distintivas de las empresas que hicieron la transición de buenas a grandiosas.',
  'Liderazgo',
  4.5,
  '5h 30min',
  300,
  2001,
  '/placeholder.svg?height=400&width=300&text=Good%20to%20Great&bg=dc2626&color=white',
  ARRAY['Liderazgo', 'Empresa', 'Excelencia', 'Gestión'],
  'Intermedio',
  ARRAY['Liderazgo empresarial', 'Transformación', 'Excelencia', 'Cultura organizacional'],
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440010',
  'The 4-Hour Workweek',
  'Timothy Ferriss',
  'Escapa de la rutina de 9-5, vive en cualquier lugar y únete a los nuevos ricos. Ferriss muestra cómo vivir más y trabajar menos, utilizando los principios de automatización y liberación.',
  'Productividad',
  4.2,
  '4h 50min',
  308,
  2007,
  '/placeholder.svg?height=400&width=300&text=4-Hour%20Workweek&bg=f97316&color=white',
  ARRAY['Productividad', 'Libertad', 'Emprendimiento', 'Automatización'],
  'Intermedio',
  ARRAY['Automatización', 'Outsourcing', 'Libertad financiera', 'Estilo de vida'],
  false,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  'Crucial Conversations',
  'Kerry Patterson',
  'Herramientas para hablar cuando las apuestas son altas. Los autores enseñan cómo prepararse y manejar conversaciones cruciales con confianza y habilidad.',
  'Habilidades Blandas',
  4.7,
  '4h 15min',
  284,
  2002,
  '/placeholder.svg?height=400&width=300&text=Crucial%20Conversations&bg=059669&color=white',
  ARRAY['Comunicación', 'Conversaciones', 'Habilidades Blandas', 'Conflictos'],
  'Intermedio',
  ARRAY['Comunicación efectiva', 'Resolución de conflictos', 'Diálogo', 'Negociación'],
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  'Zero to One',
  'Peter Thiel',
  'Notas sobre startups, o cómo construir el futuro. Thiel muestra cómo construir empresas que crean cosas nuevas, basándose en su experiencia como cofundador de PayPal y primer inversor en Facebook.',
  'Emprendimiento',
  4.4,
  '3h 30min',
  224,
  2014,
  '/placeholder.svg?height=400&width=300&text=Zero%20to%20One&bg=1f2937&color=white',
  ARRAY['Emprendimiento', 'Startup', 'Innovación', 'Tecnología'],
  'Avanzado',
  ARRAY['Innovación', 'Monopolios', 'Tecnología', 'Venture Capital'],
  true,
  NOW(),
  NOW()
);

-- Insert some sample reading progress for the demo user
INSERT INTO user_book_progress (
  user_id,
  book_id,
  current_page,
  progress,
  total_pages,
  reading_time_minutes,
  started_at,
  last_read_at,
  created_at,
  updated_at
) VALUES 
(
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440003',
  129,
  35,
  368,
  180,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '2 hours',
  NOW(),
  NOW()
),
(
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440005',
  168,
  60,
  280,
  240,
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '1 day',
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
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440003',
  45,
  'Capítulo 2: Siéntate a la Mesa',
  'Importante: Las mujeres sistemáticamente subestiman sus propias habilidades. Recordar aplicar esto en mi próxima evaluación.',
  NOW() - INTERVAL '3 days'
),
(
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440003',
  78,
  'Capítulo 3: El Éxito y la Simpatía',
  'El dilema del éxito vs simpatía en mujeres. Estrategias para navegar esta situación en el contexto chileno.',
  NOW() - INTERVAL '2 days'
),
(
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440005',
  95,
  'Autoconciencia Emocional',
  'Ejercicio práctico: Identificar mis triggers emocionales en reuniones de trabajo.',
  NOW() - INTERVAL '1 day'
),
(
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440005',
  142,
  'Habilidades Sociales',
  'Técnicas de networking aplicables al mercado profesional chileno. Muy útil para eventos de la industria.',
  NOW() - INTERVAL '6 hours'
),
(
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440005',
  201,
  'Gestión de Relaciones',
  'Cómo manejar conflictos en equipos multiculturales. Aplicar en mi equipo actual.',
  NOW() - INTERVAL '3 hours'
);

-- Update statistics
UPDATE books SET 
  updated_at = NOW()
WHERE id IN (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440009',
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440012'
);

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

-- Show reading progress summary
SELECT 
  b.title,
  b.author,
  ubp.progress,
  ubp.current_page,
  ubp.total_pages,
  ubp.reading_time_minutes
FROM books b
JOIN user_book_progress ubp ON b.id = ubp.book_id
WHERE ubp.user_id = '00000000-0000-0000-0000-000000000000'
ORDER BY ubp.last_read_at DESC;

-- Show bookmarks summary
SELECT 
  b.title,
  ubb.page_number,
  ubb.chapter_title,
  LEFT(ubb.note, 50) || '...' as note_preview,
  ubb.created_at
FROM books b
JOIN user_book_bookmarks ubb ON b.id = ubb.book_id
WHERE ubb.user_id = '00000000-0000-0000-0000-000000000000'
ORDER BY ubb.created_at DESC;
