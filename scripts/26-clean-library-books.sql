-- Clean up library books - keep only 5 essential books
-- First, delete all existing books and related data
DELETE FROM user_book_bookmarks;
DELETE FROM user_book_progress;
DELETE FROM book_chapters;
DELETE FROM books;

-- Reset sequences if needed
ALTER SEQUENCE IF EXISTS books_id_seq RESTART WITH 1;

-- Insert only 5 essential professional development books
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
  is_free,
  created_at,
  updated_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Hábitos Atómicos',
  'James Clear',
  'Un método fácil y comprobado para crear buenos hábitos y eliminar los malos. Aprende cómo pequeños cambios pueden generar resultados extraordinarios en tu vida personal y profesional.',
  'Productividad',
  4.8,
  '4h 30min',
  8,
  2018,
  '/placeholder.svg?height=400&width=300&text=Hábitos%20Atómicos&bg=3b82f6&color=white',
  ARRAY['Hábitos', 'Productividad', 'Autoayuda', 'Comportamiento'],
  'Intermedio',
  ARRAY['Formación de hábitos', 'Productividad personal', 'Cambio de comportamiento', 'Sistemas vs objetivos'],
  true,
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Los 7 Hábitos de la Gente Altamente Efectiva',
  'Stephen R. Covey',
  'Lecciones poderosas de cambio personal que han inspirado a millones de personas. Un enfoque holístico para resolver problemas personales y profesionales.',
  'Liderazgo',
  4.6,
  '6h 15min',
  7,
  1989,
  '/placeholder.svg?height=400&width=300&text=7%20Hábitos&bg=1f2937&color=white',
  ARRAY['Liderazgo', 'Efectividad', 'Desarrollo Personal', 'Principios'],
  'Intermedio',
  ARRAY['Liderazgo personal', 'Efectividad', 'Principios de vida', 'Interdependencia'],
  true,
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Trabajo Profundo',
  'Cal Newport',
  'Reglas para el éxito enfocado en un mundo distraído. Desarrolla la habilidad más valiosa del siglo XXI: la capacidad de concentrarse sin distracciones.',
  'Productividad',
  4.7,
  '4h 45min',
  6,
  2016,
  '/placeholder.svg?height=400&width=300&text=Trabajo%20Profundo&bg=1f2937&color=white',
  ARRAY['Concentración', 'Productividad', 'Trabajo', 'Enfoque'],
  'Intermedio',
  ARRAY['Trabajo profundo', 'Concentración', 'Productividad cognitiva', 'Distracción digital'],
  true,
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Inteligencia Emocional',
  'Daniel Goleman',
  'Por qué puede importar más que el coeficiente intelectual. Estrategias para aumentar tu EQ y mejorar tus habilidades interpersonales.',
  'Habilidades Blandas',
  4.4,
  '3h 50min',
  6,
  1995,
  '/placeholder.svg?height=400&width=300&text=Inteligencia%20Emocional&bg=10b981&color=white',
  ARRAY['Inteligencia Emocional', 'Habilidades Blandas', 'Comunicación', 'Autoconciencia'],
  'Intermedio',
  ARRAY['Inteligencia emocional', 'Autoconciencia', 'Habilidades sociales', 'Autorregulación'],
  true,
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Lean In',
  'Sheryl Sandberg',
  'Las mujeres, el trabajo y la voluntad de liderar en el mundo profesional moderno. Un llamado a la acción para que las mujeres alcancen su potencial completo.',
  'Liderazgo',
  4.5,
  '5h 20min',
  6,
  2013,
  '/placeholder.svg?height=400&width=300&text=Lean%20In&bg=ec4899&color=white',
  ARRAY['Liderazgo', 'Carrera', 'Género', 'Empoderamiento'],
  'Fácil',
  ARRAY['Liderazgo femenino', 'Desarrollo profesional', 'Igualdad de género', 'Ambición'],
  false,
  true,
  NOW(),
  NOW()
);

-- Insert chapters only for "Hábitos Atómicos" (most popular book)
INSERT INTO book_chapters (book_id, chapter_number, title, content, estimated_reading_minutes) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 'Los Fundamentos: Por qué los pequeños cambios marcan una gran diferencia', 
'<div class="chapter-content">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 1: Los Fundamentos</h1>
<p class="text-lg mb-6 text-gray-700"><strong>Los hábitos son el interés compuesto de la superación personal.</strong> De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites.</p>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🚀 El poder de los pequeños cambios</h2>
<p class="mb-4 text-gray-700">Si puedes mejorar tan solo un <strong>1% cada día</strong> durante un año, terminarás siendo treinta y siete veces mejor al final del período.</p>

<div class="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-lg">
<h3 class="text-lg font-semibold text-blue-900 mb-3">📊 La matemática del 1%</h3>
<ul class="list-disc list-inside text-blue-800 space-y-2">
<li><strong>1% mejor cada día:</strong> 1.01^365 = 37.78</li>
<li><strong>1% peor cada día:</strong> 0.99^365 = 0.03</li>
</ul>
</div>

<blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-gray-50 rounded-r-lg italic text-lg text-gray-800">
"El éxito es el producto de hábitos diarios, no de transformaciones de una sola vez."
</blockquote>
</div>', 35),

('550e8400-e29b-41d4-a716-446655440001', 2, 'Cómo Funcionan Tus Hábitos',
'<div class="chapter-content">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 2: Cómo Funcionan Tus Hábitos</h1>
<p class="text-lg mb-6 text-gray-700">Un hábito es una rutina o comportamiento que se realiza regularmente y, en muchos casos, automáticamente.</p>

<h2 class="text-2xl font-semibold mb-4 text-gray-900 flex items-center">🔄 El Bucle del Hábito</h2>
<p class="mb-4 text-gray-700">Todos los hábitos siguen el mismo patrón de cuatro pasos:</p>

<div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-blue-900 mb-4">🎯 Los 4 Pasos del Hábito</h3>
<ol class="list-decimal list-inside text-blue-800 space-y-2">
<li><strong>Señal:</strong> El desencadenante que inicia el comportamiento</li>
<li><strong>Anhelo:</strong> La fuerza motivacional detrás de cada hábito</li>
<li><strong>Respuesta:</strong> El hábito real que realizas</li>
<li><strong>Recompensa:</strong> El beneficio que obtienes del hábito</li>
</ol>
</div>
</div>', 30);

-- Create or get demo user first
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Try to find existing demo user
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1;
    
    -- If no demo user exists, create one
    IF demo_user_id IS NULL THEN
        -- Insert into auth.users first
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '550e8400-e29b-41d4-a716-446655440000',
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'demo@example.com',
            '$2a$10$demo.password.hash.for.testing.purposes.only',
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Usuario Demo", "avatar_url": null}',
            false,
            '',
            '',
            '',
            ''
        ) ON CONFLICT (id) DO NOTHING;
        
        demo_user_id := '550e8400-e29b-41d4-a716-446655440000';
        
        -- Insert into profiles table
        INSERT INTO profiles (
            id,
            user_id,
            full_name,
            email,
            created_at,
            updated_at
        ) VALUES (
            demo_user_id,
            demo_user_id,
            'Usuario Demo',
            'demo@example.com',
            NOW(),
            NOW()
        ) ON CONFLICT (id) DO NOTHING;
    END IF;
    
    -- Now insert reading progress with the valid user_id
    INSERT INTO user_book_progress (
        user_id,
        book_id,
        current_chapter,
        progress_percentage,
        total_chapters,
        reading_time_minutes,
        started_at,
        last_read_at,
        created_at,
        updated_at
    ) VALUES 
    (
        demo_user_id,
        '550e8400-e29b-41d4-a716-446655440001',
        5,
        65,
        8,
        180,
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '2 hours',
        NOW(),
        NOW()
    ),
    (
        demo_user_id,
        '550e8400-e29b-41d4-a716-446655440004',
        5,
        80,
        6,
        240,
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '1 day',
        NOW(),
        NOW()
    ),
    (
        demo_user_id,
        '550e8400-e29b-41d4-a716-446655440002',
        7,
        100,
        7,
        375,
        NOW() - INTERVAL '15 days',
        NOW() - INTERVAL '3 days',
        NOW(),
        NOW()
    ),
    (
        demo_user_id,
        '550e8400-e29b-41d4-a716-446655440005',
        2,
        35,
        6,
        95,
        NOW() - INTERVAL '8 days',
        NOW() - INTERVAL '1 day',
        NOW(),
        NOW()
    ) ON CONFLICT (user_id, book_id) DO UPDATE SET
        progress_percentage = EXCLUDED.progress_percentage,
        current_chapter = EXCLUDED.current_chapter,
        reading_time_minutes = EXCLUDED.reading_time_minutes,
        last_read_at = EXCLUDED.last_read_at,
        updated_at = NOW();
        
    -- Insert user reading stats
    INSERT INTO user_reading_stats (
        user_id,
        books_read,
        total_reading_time,
        reading_streak,
        points,
        level,
        created_at,
        updated_at
    ) VALUES (
        demo_user_id,
        5,
        890, -- total minutes read
        12,
        1250,
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
END $$;

-- Verify the cleanup
SELECT 
    title,
    author,
    category,
    rating,
    is_recommended,
    array_length(tags, 1) as tag_count
FROM books 
ORDER BY created_at DESC;

-- Show progress summary
SELECT 
    b.title,
    b.author,
    ubp.progress_percentage,
    ubp.current_chapter,
    ubp.total_chapters,
    ubp.reading_time_minutes
FROM books b
LEFT JOIN user_book_progress ubp ON b.id = ubp.book_id
WHERE ubp.user_id IS NULL OR ubp.user_id = (SELECT id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1)
ORDER BY b.created_at;
