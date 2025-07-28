-- First, fix the trigger function that's causing the error
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean up library books - keep only 5 essential books
-- First, delete all existing books and related data
DELETE FROM user_book_bookmarks;
DELETE FROM user_book_progress;
DELETE FROM book_chapters;
DELETE FROM books;

-- Reset sequences if needed
ALTER SEQUENCE IF EXISTS books_id_seq RESTART WITH 1;

-- Insert 5 essential professional development books with REAL data and proper cover images
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
  'James Clear presenta un sistema probado para crear buenos hábitos y romper los malos. Basado en investigación científica de psicología, neurociencia y biología, este libro revela cómo pequeños cambios pueden transformar tu vida. Clear explica cómo los hábitos funcionan y cómo diseñar tu entorno para el éxito automático.',
  'Productividad',
  4.8,
  '6h 45min',
  320,
  2018,
  '/placeholder.svg?height=400&width=300&text=HÁBITOS+ATÓMICOS&bg=2563eb&color=white',
  ARRAY['Hábitos', 'Productividad', 'Psicología', 'Autoayuda', 'Comportamiento'],
  'Intermedio',
  ARRAY['Formación de hábitos', 'Diseño de sistemas', 'Cambio de comportamiento', 'Productividad personal', 'Neuroplasticidad'],
  true,
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Los 7 Hábitos de la Gente Altamente Efectiva',
  'Stephen R. Covey',
  'Un clásico atemporal que ha vendido más de 25 millones de copias mundialmente. Covey presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales. Los siete hábitos representan un enfoque completo de la vida, desde la independencia hasta la interdependencia.',
  'Liderazgo',
  4.6,
  '8h 30min',
  432,
  1989,
  '/placeholder.svg?height=400&width=300&text=LOS+7+HÁBITOS&bg=7c3aed&color=white',
  ARRAY['Liderazgo', 'Efectividad', 'Principios', 'Desarrollo Personal', 'Gestión'],
  'Intermedio',
  ARRAY['Liderazgo personal', 'Gestión del tiempo', 'Comunicación efectiva', 'Trabajo en equipo', 'Visión personal'],
  true,
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Trabajo Profundo',
  'Cal Newport',
  'En una economía cada vez más competitiva, la habilidad de dominar cosas difíciles rápidamente es crucial. Newport argumenta que la capacidad de concentrarse sin distracción en una tarea cognitivamente demandante es la habilidad más valiosa en nuestra economía. Proporciona estrategias para cultivar esta habilidad.',
  'Productividad',
  4.7,
  '5h 15min',
  304,
  2016,
  '/placeholder.svg?height=400&width=300&text=TRABAJO+PROFUNDO&bg=1f2937&color=white',
  ARRAY['Concentración', 'Productividad', 'Tecnología', 'Enfoque', 'Trabajo'],
  'Intermedio',
  ARRAY['Trabajo profundo vs superficial', 'Gestión de distracciones', 'Concentración intensa', 'Productividad cognitiva', 'Minimalismo digital'],
  true,
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Inteligencia Emocional',
  'Daniel Goleman',
  'Goleman revolucionó nuestra comprensión de la inteligencia humana al mostrar que el coeficiente emocional puede ser más importante que el coeficiente intelectual. Basado en investigación cerebral, explica cómo podemos ser más inteligentes emocionalmente: autoconciencia, autorregulación, motivación, empatía y habilidades sociales.',
  'Habilidades Blandas',
  4.4,
  '7h 20min',
  384,
  1995,
  '/placeholder.svg?height=400&width=300&text=INTELIGENCIA+EMOCIONAL&bg=059669&color=white',
  ARRAY['Inteligencia Emocional', 'Psicología', 'Comunicación', 'Liderazgo', 'Relaciones'],
  'Intermedio',
  ARRAY['Autoconciencia emocional', 'Autorregulación', 'Empatía', 'Habilidades sociales', 'Motivación intrínseca'],
  true,
  true,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Lean In',
  'Sheryl Sandberg',
  'La COO de Facebook examina por qué el progreso de las mujeres hacia posiciones de liderazgo se ha estancado, explica las causas raíz y ofrece soluciones convincentes y prácticas. Sandberg combina investigación, datos y experiencias personales para abordar tanto los obstáculos externos como las barreras internas que enfrentan las mujeres.',
  'Liderazgo',
  4.2,
  '4h 45min',
  240,
  2013,
  '/placeholder.svg?height=400&width=300&text=LEAN+IN&bg=ec4899&color=white',
  ARRAY['Liderazgo Femenino', 'Carrera', 'Género', 'Ambición', 'Workplace'],
  'Fácil',
  ARRAY['Liderazgo femenino', 'Negociación salarial', 'Equilibrio trabajo-vida', 'Síndrome del impostor', 'Redes profesionales'],
  false,
  true,
  NOW(),
  NOW()
);

-- Insert realistic chapters for "Hábitos Atómicos" (most popular book)
INSERT INTO book_chapters (book_id, chapter_number, title, content, estimated_reading_minutes) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 'Los Fundamentos: Por qué los pequeños cambios marcan una gran diferencia', 
'<div class="chapter-content prose max-w-none">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 1: Los Fundamentos</h1>

<blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg italic text-lg text-gray-800">
"Los hábitos son el interés compuesto de la superación personal."
</blockquote>

<p class="text-lg mb-6 text-gray-700">De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites. Parecen marcar poca diferencia en un día cualquiera, pero el impacto que generan a lo largo de meses y años puede ser enorme.</p>

<h2 class="text-2xl font-semibold mb-4 text-gray-900">🚀 El poder de los pequeños cambios</h2>

<p class="mb-4 text-gray-700">Si puedes mejorar tan solo un <strong>1% cada día</strong> durante un año, terminarás siendo treinta y siete veces mejor al final del período. Por el contrario, si empeoras un 1% cada día durante un año, descenderás casi hasta cero.</p>

<div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-blue-900 mb-3">📊 La matemática del 1%</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="text-center">
<p class="text-2xl font-bold text-green-600">1.01³⁶⁵ = 37.78</p>
<p class="text-sm text-green-700">1% mejor cada día</p>
</div>
<div class="text-center">
<p class="text-2xl font-bold text-red-600">0.99³⁶⁵ = 0.03</p>
<p class="text-sm text-red-700">1% peor cada día</p>
</div>
</div>
</div>

<h2 class="text-2xl font-semibold mb-4 text-gray-900">🎯 ¿Qué importa realmente?</h2>

<p class="mb-4 text-gray-700">Los hábitos pueden ser un arma de doble filo. Pueden trabajar a tu favor o en tu contra, por eso entender los detalles es esencial.</p>

<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-yellow-900 mb-3">⚠️ Los hábitos negativos también se componen</h3>
<ul class="list-disc list-inside text-yellow-800 space-y-2">
<li>Estrés que se acumula día tras día</li>
<li>Pensamientos negativos que se repiten</li>
<li>Pequeñas decisiones poco saludables</li>
<li>Procrastinación que se vuelve rutina</li>
</ul>
</div>

<h2 class="text-2xl font-semibold mb-4 text-gray-900">🏔️ El valle de la desilusión</h2>

<p class="mb-4 text-gray-700">Esperamos que el progreso sea lineal. Esperamos hacer el doble de progreso en el doble de tiempo. Pero la realidad es que los resultados de nuestros esfuerzos suelen retrasarse.</p>

<p class="mb-4 text-gray-700">Imagina que tienes un cubo de hielo sentado sobre la mesa frente a ti. La habitación está fría y puedes ver tu aliento. Es de 25 grados bajo cero. Lentamente, la habitación comienza a calentarse.</p>

<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-gray-900 mb-3">🧊 La metáfora del cubo de hielo</h3>
<ul class="list-disc list-inside text-gray-700 space-y-2">
<li><strong>26 grados:</strong> Nada sucede</li>
<li><strong>27 grados:</strong> Nada sucede</li>
<li><strong>28 grados:</strong> Nada sucede</li>
<li><strong>29 grados:</strong> Nada sucede</li>
<li><strong>30 grados:</strong> Nada sucede</li>
<li><strong>31 grados:</strong> Nada sucede</li>
<li><strong>32 grados:</strong> ¡El hielo comienza a derretirse!</li>
</ul>
</div>

<p class="mb-4 text-gray-700">Un grado de diferencia, aparentemente sin importancia, y sin embargo marca el momento en que un cubo sólido de hielo se convierte en agua líquida. El punto de inflexión de un sistema.</p>

<blockquote class="border-l-4 border-green-500 pl-6 py-4 my-6 bg-green-50 rounded-r-lg italic text-lg text-gray-800">
"El éxito es el producto de hábitos diarios, no de transformaciones de una sola vez."
</blockquote>

<h2 class="text-2xl font-semibold mb-4 text-gray-900">🎪 Olvídate de los objetivos, concéntrate en los sistemas</h2>

<p class="mb-4 text-gray-700">Los objetivos son los resultados que quieres lograr. Los sistemas son los procesos que sigues para lograr esos resultados.</p>

<div class="bg-purple-50 border border-purple-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-purple-900 mb-3">🎯 Objetivos vs Sistemas</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<h4 class="font-semibold text-purple-800 mb-2">Objetivos</h4>
<ul class="list-disc list-inside text-purple-700 space-y-1 text-sm">
<li>Son sobre los resultados que quieres lograr</li>
<li>Son buenos para establecer una dirección</li>
<li>Son momentáneos</li>
</ul>
</div>
<div>
<h4 class="font-semibold text-purple-800 mb-2">Sistemas</h4>
<ul class="list-disc list-inside text-purple-700 space-y-1 text-sm">
<li>Son sobre los procesos que llevan a esos resultados</li>
<li>Son excelentes para hacer progreso real</li>
<li>Son para toda la vida</li>
</ul>
</div>
</div>
</div>

<p class="mb-4 text-gray-700">Si quieres mejores resultados, olvídate de establecer objetivos. Concéntrate en tu sistema en su lugar.</p>

<div class="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-green-900 mb-3">✅ Puntos clave del capítulo</h3>
<ul class="list-disc list-inside text-green-800 space-y-2">
<li>Los hábitos son el interés compuesto de la superación personal</li>
<li>Pequeños cambios a menudo parecen no marcar diferencia hasta que cruzas un umbral crítico</li>
<li>Los cambios más poderosos son aquellos que mejoran tu identidad</li>
<li>El objetivo no es leer un libro, el objetivo es convertirse en lector</li>
</ul>
</div>
</div>', 45),

('550e8400-e29b-41d4-a716-446655440001', 2, 'Cómo Funcionan Tus Hábitos: Las Cuatro Leyes del Cambio de Comportamiento',
'<div class="chapter-content prose max-w-none">
<h1 class="text-3xl font-bold mb-6 text-gray-900">Capítulo 2: Cómo Funcionan Tus Hábitos</h1>

<p class="text-lg mb-6 text-gray-700">Un hábito es una rutina o comportamiento que se realiza regularmente y, en muchos casos, automáticamente. Pero, ¿cómo se forman exactamente los hábitos? ¿Cómo podemos diseñar mejores hábitos?</p>

<h2 class="text-2xl font-semibold mb-4 text-gray-900">🔄 El Bucle del Hábito</h2>

<p class="mb-4 text-gray-700">En la década de 1990, un grupo de investigadores del MIT comenzaron a estudiar los hábitos. Descubrieron un patrón neurológico simple que está en el núcleo de cada hábito, un bucle de tres pasos:</p>

<div class="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-blue-900 mb-4">🎯 Los 4 Pasos del Hábito</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-4">
<div class="flex items-start space-x-3">
<div class="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
<div>
<h4 class="font-semibold text-blue-800">Señal (Cue)</h4>
<p class="text-sm text-blue-700">El desencadenante que inicia el comportamiento. Le dice a tu cerebro que entre en modo automático.</p>
</div>
</div>
<div class="flex items-start space-x-3">
<div class="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
<div>
<h4 class="font-semibold text-blue-800">Anhelo (Craving)</h4>
<p class="text-sm text-blue-700">La fuerza motivacional detrás de cada hábito. Sin motivación, no hay razón para actuar.</p>
</div>
</div>
</div>
<div class="space-y-4">
<div class="flex items-start space-x-3">
<div class="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
<div>
<h4 class="font-semibold text-blue-800">Respuesta (Response)</h4>
<p class="text-sm text-blue-700">El hábito real que realizas, que puede ser un pensamiento o una acción.</p>
</div>
</div>
<div class="flex items-start space-x-3">
<div class="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
<div>
<h4 class="font-semibold text-blue-800">Recompensa (Reward)</h4>
<p class="text-sm text-blue-700">El beneficio que obtienes del hábito. Satisface tu anhelo y te enseña qué vale la pena recordar.</p>
</div>
</div>
</div>
</div>
</div>

<h2 class="text-2xl font-semibold mb-4 text-gray-900">📱 Ejemplo: Revisar tu teléfono</h2>

<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
<div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
<div>
<div class="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">1</div>
<h4 class="font-semibold text-gray-800">Señal</h4>
<p class="text-sm text-gray-600">Ves tu teléfono</p>
</div>
<div>
<div class="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">2</div>
<h4 class="font-semibold text-gray-800">Anhelo</h4>
<p class="text-sm text-gray-600">Quieres saber si tienes mensajes</p>
</div>
<div>
<div class="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">3</div>
<h4 class="font-semibold text-gray-800">Respuesta</h4>
<p class="text-sm text-gray-600">Tomas el teléfono y revisas</p>
</div>
<div>
<div class="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">4</div>
<h4 class="font-semibold text-gray-800">Recompensa</h4>
<p class="text-sm text-gray-600">Satisfaces tu curiosidad</p>
</div>
</div>
</div>

<h2 class="text-2xl font-semibold mb-4 text-gray-900">⚖️ Las Cuatro Leyes del Cambio de Comportamiento</h2>

<p class="mb-4 text-gray-700">Podemos transformar estos cuatro pasos en un conjunto práctico de reglas que podemos usar para diseñar buenos hábitos y eliminar los malos:</p>

<div class="space-y-6 my-6">
<div class="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
<h3 class="text-lg font-semibold text-green-900 mb-3">✅ Cómo Crear un Buen Hábito</h3>
<div class="space-y-3">
<div class="flex items-center space-x-3">
<span class="font-bold text-green-700">1ª Ley (Señal):</span>
<span class="text-green-800">Hazlo obvio</span>
</div>
<div class="flex items-center space-x-3">
<span class="font-bold text-green-700">2ª Ley (Anhelo):</span>
<span class="text-green-800">Hazlo atractivo</span>
</div>
<div class="flex items-center space-x-3">
<span class="font-bold text-green-700">3ª Ley (Respuesta):</span>
<span class="text-green-800">Hazlo fácil</span>
</div>
<div class="flex items-center space-x-3">
<span class="font-bold text-green-700">4ª Ley (Recompensa):</span>
<span class="text-green-800">Hazlo satisfactorio</span>
</div>
</div>
</div>

<div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
<h3 class="text-lg font-semibold text-red-900 mb-3">❌ Cómo Romper un Mal Hábito</h3>
<div class="space-y-3">
<div class="flex items-center space-x-3">
<span class="font-bold text-red-700">Inversión de la 1ª Ley:</span>
<span class="text-red-800">Hazlo invisible</span>
</div>
<div class="flex items-center space-x-3">
<span class="font-bold text-red-700">Inversión de la 2ª Ley:</span>
<span class="text-red-800">Hazlo poco atractivo</span>
</div>
<div class="flex items-center space-x-3">
<span class="font-bold text-red-700">Inversión de la 3ª Ley:</span>
<span class="text-red-800">Hazlo difícil</span>
</div>
<div class="flex items-center space-x-3">
<span class="font-bold text-red-700">Inversión de la 4ª Ley:</span>
<span class="text-red-800">Hazlo insatisfactorio</span>
</div>
</div>
</div>
</div>

<h2 class="text-2xl font-semibold mb-4 text-gray-900">🧠 El papel del cerebro</h2>

<p class="mb-4 text-gray-700">Cuando repites un comportamiento lo suficiente, tu cerebro comienza a automatizar el proceso. Los hábitos son, literalmente, cambios físicos en tu cerebro.</p>

<div class="bg-purple-50 border border-purple-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-purple-900 mb-3">🔬 La ciencia detrás de los hábitos</h3>
<ul class="list-disc list-inside text-purple-800 space-y-2">
<li>Los hábitos reducen la carga cognitiva y liberan capacidad mental para otras tareas</li>
<li>El cerebro siempre busca formas de conservar energía</li>
<li>Los hábitos son la forma que tiene el cerebro de ser más eficiente</li>
<li>Una vez que un hábito se forma, nunca desaparece completamente</li>
</ul>
</div>

<blockquote class="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg italic text-lg text-gray-800">
"Hasta que hagas consciente lo inconsciente, dirigirá tu vida y lo llamarás destino." - Carl Jung
</blockquote>

<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
<h3 class="text-lg font-semibold text-yellow-900 mb-3">💡 Puntos clave del capítulo</h3>
<ul class="list-disc list-inside text-yellow-800 space-y-2">
<li>Un hábito es un comportamiento que se ha repetido lo suficiente como para volverse automático</li>
<li>El proceso de construcción de hábitos comienza con prueba y error</li>
<li>Los hábitos son atajos mentales aprendidos de la experiencia</li>
<li>Las cuatro etapas del hábito son: señal, anhelo, respuesta y recompensa</li>
<li>Las Cuatro Leyes del Cambio de Comportamiento son una forma simple de recordar las reglas básicas</li>
</ul>
</div>
</div>', 40);

-- Create or get demo user first
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Try to find existing demo user
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1;
    
    -- If no demo user exists, create one
    IF demo_user_id IS NULL THEN
        -- Insert into auth.users first (this will trigger the handle_new_user function)
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
        
        -- Update the profile with additional info (the trigger should have created the basic profile)
        UPDATE profiles SET
            email = 'demo@example.com',
            created_at = NOW(),
            updated_at = NOW()
        WHERE user_id = demo_user_id;
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
        '550e8400-e29b-41d4-a716-446655440001', -- Hábitos Atómicos
        2,
        25,
        16,
        120,
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '2 hours',
        NOW(),
        NOW()
    ),
    (
        demo_user_id,
        '550e8400-e29b-41d4-a716-446655440004', -- Inteligencia Emocional
        8,
        75,
        12,
        340,
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '1 day',
        NOW(),
        NOW()
    ),
    (
        demo_user_id,
        '550e8400-e29b-41d4-a716-446655440002', -- 7 Hábitos
        15,
        100,
        15,
        510,
        NOW() - INTERVAL '20 days',
        NOW() - INTERVAL '3 days',
        NOW(),
        NOW()
    ),
    (
        demo_user_id,
        '550e8400-e29b-41d4-a716-446655440005', -- Lean In
        3,
        40,
        8,
        135,
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
        1, -- Only completed 7 Habits
        1105, -- total minutes read across all books
        15,
        1850,
        4,
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
    pages,
    published_year,
    reading_time
FROM books 
ORDER BY created_at DESC;

-- Show progress summary
SELECT 
    b.title,
    b.author,
    b.pages,
    ubp.progress_percentage,
    ubp.current_chapter,
    ubp.reading_time_minutes
FROM books b
LEFT JOIN user_book_progress ubp ON b.id = ubp.book_id
WHERE ubp.user_id IS NULL OR ubp.user_id = (SELECT id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1)
ORDER BY b.created_at;
