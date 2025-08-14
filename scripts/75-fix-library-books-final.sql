-- Fix library books database to match the correct structure and data
-- This script ensures all books are properly configured and operational

-- First, let's clean up and recreate the library tables with the correct structure
DROP TABLE IF EXISTS user_book_quotes CASCADE;
DROP TABLE IF EXISTS user_book_notes CASCADE;
DROP TABLE IF EXISTS user_book_highlights CASCADE;
DROP TABLE IF EXISTS user_book_bookmarks CASCADE;
DROP TABLE IF EXISTS user_book_progress CASCADE;
DROP TABLE IF EXISTS library_book_chapters CASCADE;
DROP TABLE IF EXISTS library_books CASCADE;

-- Create library_books table with correct structure
CREATE TABLE library_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Principiante', 'Intermedio', 'Avanzado')),
    rating DECIMAL(3,2) DEFAULT 4.0 CHECK (rating >= 0 AND rating <= 5),
    reading_time TEXT,
    pages INTEGER DEFAULT 0,
    published_year INTEGER,
    tags TEXT[] DEFAULT '{}',
    key_topics TEXT[] DEFAULT '{}',
    is_recommended BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create library_book_chapters table
CREATE TABLE library_book_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, "order")
);

-- Create user_book_progress table
CREATE TABLE user_book_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    current_chapter INTEGER DEFAULT 1,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    reading_time_minutes INTEGER DEFAULT 0,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- Create user_book_bookmarks table
CREATE TABLE user_book_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES library_book_chapters(id) ON DELETE CASCADE,
    chapter_title TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_book_highlights table
CREATE TABLE user_book_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES library_book_chapters(id) ON DELETE CASCADE,
    selected_text TEXT NOT NULL,
    start_position INTEGER NOT NULL,
    end_position INTEGER NOT NULL,
    color TEXT DEFAULT 'yellow',
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_book_notes table
CREATE TABLE user_book_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES library_book_chapters(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_book_quotes table
CREATE TABLE user_book_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES library_book_chapters(id) ON DELETE CASCADE,
    quote_text TEXT NOT NULL,
    context TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_library_books_category ON library_books(category);
CREATE INDEX idx_library_books_difficulty ON library_books(difficulty);
CREATE INDEX idx_library_books_is_recommended ON library_books(is_recommended);
CREATE INDEX idx_library_book_chapters_book_id ON library_book_chapters(book_id);
CREATE INDEX idx_library_book_chapters_order ON library_book_chapters(book_id, "order");
CREATE INDEX idx_user_book_progress_user_id ON user_book_progress(user_id);
CREATE INDEX idx_user_book_progress_book_id ON user_book_progress(book_id);

-- Enable RLS
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Library books are viewable by everyone" ON library_books FOR SELECT USING (true);
CREATE POLICY "Library book chapters are viewable by everyone" ON library_book_chapters FOR SELECT USING (true);

CREATE POLICY "Users can view their own progress" ON user_book_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON user_book_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON user_book_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own progress" ON user_book_progress FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own bookmarks" ON user_book_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks" ON user_book_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookmarks" ON user_book_bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON user_book_bookmarks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own highlights" ON user_book_highlights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own highlights" ON user_book_highlights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own highlights" ON user_book_highlights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own highlights" ON user_book_highlights FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own notes" ON user_book_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notes" ON user_book_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON user_book_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON user_book_notes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own quotes" ON user_book_quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quotes" ON user_book_quotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quotes" ON user_book_quotes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own quotes" ON user_book_quotes FOR DELETE USING (auth.uid() = user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_library_books_updated_at BEFORE UPDATE ON library_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_progress_updated_at BEFORE UPDATE ON user_book_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_highlights_updated_at BEFORE UPDATE ON user_book_highlights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_notes_updated_at BEFORE UPDATE ON user_book_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_quotes_updated_at BEFORE UPDATE ON user_book_quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert all operational books with correct data
INSERT INTO library_books (
    id, title, author, description, cover_image, category, difficulty, 
    rating, reading_time, pages, published_year, tags, key_topics, is_recommended
) VALUES 
-- Hábitos Atómicos
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Hábitos Atómicos',
    'James Clear',
    'Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos. James Clear nos brinda estrategias prácticas que nos enseñarán exactamente cómo formar buenos hábitos, romper los malos, y dominar los pequeños comportamientos que llevan a resultados notables.',
    '/books/atomic-habits.jpg',
    'Desarrollo Personal',
    'Intermedio',
    4.8,
    '4h 30min',
    320,
    2018,
    ARRAY['hábitos', 'productividad', 'autoayuda', 'cambio personal'],
    ARRAY['Formación de hábitos', 'Cambio de comportamiento', 'Productividad', 'Psicología del cambio'],
    true
),
-- Los 7 Hábitos de la Gente Altamente Efectiva
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Los 7 Hábitos de la Gente Altamente Efectiva',
    'Stephen R. Covey',
    'Un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales. Covey presenta un camino claro para vivir con equidad, integridad, honestidad y dignidad humana.',
    '/books/7-habits.jpg',
    'Liderazgo',
    'Intermedio',
    4.7,
    '6h 15min',
    432,
    1989,
    ARRAY['liderazgo', 'efectividad', 'principios', 'desarrollo personal'],
    ARRAY['Liderazgo personal', 'Efectividad', 'Principios universales', 'Carácter'],
    true
),
-- Trabajo Profundo
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Trabajo Profundo',
    'Cal Newport',
    'En una economía cada vez más competitiva, aquellos que puedan dominar la habilidad de producir trabajo de alta calidad de manera rápida y eficiente prosperarán. Newport argumenta que la capacidad de concentrarse sin distracciones es una habilidad valiosa.',
    '/books/deep-work.jpg',
    'Productividad',
    'Avanzado',
    4.6,
    '4h 40min',
    296,
    2016,
    ARRAY['concentración', 'productividad', 'trabajo', 'enfoque'],
    ARRAY['Concentración profunda', 'Eliminación de distracciones', 'Productividad cognitiva'],
    true
),
-- Inteligencia Emocional
(
    '550e8400-e29b-41d4-a716-446655440004',
    'Inteligencia Emocional',
    'Daniel Goleman',
    'Goleman explica por qué la inteligencia emocional puede ser más importante que el coeficiente intelectual. Aprende a desarrollar la autoconciencia, autorregulación, motivación, empatía y habilidades sociales.',
    '/books/emotional-intelligence.jpg',
    'Psicología',
    'Intermedio',
    4.5,
    '5h 20min',
    352,
    1995,
    ARRAY['inteligencia emocional', 'psicología', 'relaciones', 'autoconocimiento'],
    ARRAY['Autoconciencia', 'Autorregulación', 'Empatía', 'Habilidades sociales'],
    true
),
-- Lean In
(
    '550e8400-e29b-41d4-a716-446655440005',
    'Lean In: Mujeres, Trabajo y la Voluntad de Liderar',
    'Sheryl Sandberg',
    'Una exploración sobre los desafíos que enfrentan las mujeres en el lugar de trabajo y cómo pueden superarlos para alcanzar posiciones de liderazgo. Sandberg examina las causas fundamentales y ofrece soluciones prácticas.',
    '/books/lean-in.jpg',
    'Liderazgo',
    'Intermedio',
    4.5,
    '4h 40min',
    320,
    2013,
    ARRAY['liderazgo femenino', 'igualdad de género', 'desarrollo profesional', 'empoderamiento'],
    ARRAY['Liderazgo femenino', 'Igualdad en el trabajo', 'Desarrollo de carrera', 'Empoderamiento personal'],
    true
),
-- Mindset
(
    '550e8400-e29b-41d4-a716-446655440006',
    'Mindset',
    'Carol S. Dweck',
    'La nueva psicología del éxito. Dweck revela cómo el éxito en la escuela, el trabajo, los deportes, las artes y casi todas las áreas de la actividad humana puede ser dramáticamente influenciado por cómo pensamos sobre nuestros talentos y habilidades.',
    '/books/mindset.jpg',
    'Psicología',
    'Principiante',
    4.6,
    '3h 40min',
    276,
    2006,
    ARRAY['mentalidad', 'crecimiento', 'psicología', 'éxito'],
    ARRAY['Mentalidad de crecimiento', 'Aprendizaje', 'Resiliencia', 'Desarrollo personal'],
    true
),
-- El Poder del Ahora
(
    '550e8400-e29b-41d4-a716-446655440007',
    'El Poder del Ahora',
    'Eckhart Tolle',
    'Una guía hacia la iluminación espiritual. Tolle nos enseña que es posible vivir libre del dolor emocional y alcanzar un estado de gracia, facilidad y ligereza. Este estado de libertad es posible para todos, aquí y ahora.',
    '/books/power-of-now.jpg',
    'Espiritualidad',
    'Intermedio',
    4.3,
    '3h 20min',
    236,
    1997,
    ARRAY['mindfulness', 'espiritualidad', 'presente', 'conciencia'],
    ARRAY['Mindfulness', 'Conciencia presente', 'Transformación personal', 'Espiritualidad'],
    false
),
-- Good to Great
(
    '550e8400-e29b-41d4-a716-446655440008',
    'Good to Great',
    'Jim Collins',
    'Por qué algunas empresas dan el salto... y otras no. Collins y su equipo de investigación identificaron las empresas que hicieron el salto de buenos resultados a grandes resultados y las sostuvieron durante al menos quince años.',
    '/books/good-to-great.jpg',
    'Negocios',
    'Avanzado',
    4.5,
    '5h 50min',
    300,
    2001,
    ARRAY['liderazgo empresarial', 'estrategia', 'excelencia', 'negocios'],
    ARRAY['Liderazgo empresarial', 'Transformación organizacional', 'Excelencia operativa', 'Estrategia'],
    true
),
-- La Semana Laboral de 4 Horas
(
    '550e8400-e29b-41d4-a716-446655440009',
    'La Semana Laboral de 4 Horas',
    'Timothy Ferriss',
    'Escapa de la rutina de 9-5, vive en cualquier lugar y únete a los nuevos ricos. Ferriss muestra cómo puedes vivir más y trabajar menos, usando los principios de automatización y liberación geográfica.',
    '/books/4-hour-workweek.jpg',
    'Emprendimiento',
    'Intermedio',
    4.2,
    '4h 40min',
    308,
    2007,
    ARRAY['emprendimiento', 'libertad financiera', 'productividad', 'automatización'],
    ARRAY['Automatización', 'Libertad geográfica', 'Emprendimiento digital', 'Productividad'],
    false
),
-- Conversaciones Cruciales
(
    '550e8400-e29b-41d4-a716-446655440010',
    'Conversaciones Cruciales',
    'Kerry Patterson',
    'Herramientas para hablar cuando hay mucho en juego. Los autores nos enseñan cómo prepararnos para conversaciones de alto riesgo, transformar la ira y el dolor en diálogo poderoso, y actuar sobre nuestras conversaciones.',
    '/books/crucial-conversations.jpg',
    'Comunicación',
    'Intermedio',
    4.4,
    '4h 00min',
    288,
    2002,
    ARRAY['comunicación', 'negociación', 'conflictos', 'diálogo'],
    ARRAY['Comunicación efectiva', 'Resolución de conflictos', 'Negociación', 'Liderazgo'],
    true
);

-- Insert chapters for key books (Hábitos Atómicos, Los 7 Hábitos, Lean In, Inteligencia Emocional)

-- Hábitos Atómicos chapters
INSERT INTO library_book_chapters (id, book_id, title, content, "order") VALUES 
(
    '550e8400-e29b-41d4-a716-446655440101',
    '550e8400-e29b-41d4-a716-446655440001',
    'Introducción: Mi Historia',
    'En el segundo año de la escuela secundaria, me golpearon en la cara con un bate de béisbol. Mientras esperaba mi turno durante la práctica de bateo, un compañero de equipo perdió el control de su swing y el bate me golpeó directamente entre los ojos.

No recuerdo los primeros días en el hospital. Según los informes médicos, sufrí una fractura nasal, múltiples fracturas en el cráneo y dos ojos morados. La lesión más grave fue una conmoción cerebral masiva.

Los médicos me informaron que mi recuperación sería larga y difícil. Durante meses, luché con síntomas que incluían náuseas constantes, dolores de cabeza severos y dificultades para concentrarme. Mi rendimiento académico se desplomó, y tuve que repetir mi segundo año.

Sin embargo, esta experiencia traumática se convirtió en el catalizador de una transformación extraordinaria. Durante mi lenta recuperación, comencé a desarrollar pequeños hábitos que, con el tiempo, cambiarían completamente mi vida.

## El Poder de los Pequeños Cambios

La mayoría de las personas subestiman el poder de los pequeños cambios. Pensamos que para lograr grandes resultados necesitamos tomar grandes acciones. Pero la realidad es diferente.

Los hábitos son el interés compuesto del auto-mejoramiento. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican mientras los repites.

Un cambio del 1% no parece mucho en el momento, pero los efectos se acumulan con el tiempo. Esto es lo que llamo "hábitos atómicos": pequeños cambios que forman parte de un sistema más grande.

## Mi Sistema de Hábitos

Durante mi recuperación, desarrollé un sistema simple pero poderoso:

1. **Empezar pequeño**: En lugar de intentar cambios dramáticos, me enfoqué en mejoras mínimas.

2. **Ser consistente**: La consistencia era más importante que la perfección.

3. **Enfocarse en el sistema, no en las metas**: En lugar de obsesionarme con los resultados, me concentré en el proceso.

4. **Hacer que los buenos hábitos fueran obvios, atractivos, fáciles y satisfactorios**.

Este enfoque me ayudó no solo a recuperarme de mi lesión, sino a prosperar de maneras que nunca había imaginado. Regresé al equipo de béisbol, fui seleccionado como capitán, y eventualmente recibí una beca académica para la universidad.

## La Ciencia de los Hábitos

Los hábitos no son solo rutinas personales; son la base de toda mejora. Cada acción que tomas es un voto por el tipo de persona que deseas convertirte.

La investigación muestra que aproximadamente el 40-45% de nuestras acciones diarias son hábitos. Esto significa que casi la mitad de lo que hacemos cada día no es realmente una decisión, sino un hábito.

Por eso es tan importante desarrollar buenos hábitos. No se trata solo de lograr un objetivo específico, sino de convertirte en el tipo de persona que puede lograr esos objetivos de manera consistente.

## El Camino Adelante

En este libro, aprenderás un sistema probado para construir buenos hábitos y eliminar los malos. Este sistema se basa en cuatro leyes simples:

**Las Cuatro Leyes del Cambio de Comportamiento**

1. **Hazlo Obvio** (1ª Ley)
2. **Hazlo Atractivo** (2ª Ley)  
3. **Hazlo Fácil** (3ª Ley)
4. **Hazlo Satisfactorio** (4ª Ley)

Cada ley corresponde a una de las cuatro etapas del bucle del hábito: señal, anhelo, respuesta y recompensa.

## Cómo Usar Este Libro

Este libro está organizado en seis partes. Las partes I y II sientan las bases explicando por qué los hábitos importan y cómo funcionan. Las partes III, IV, V y VI cubren cada una de las cuatro leyes del cambio de comportamiento.

Cada capítulo incluye historias de la vida real, investigación científica y estrategias prácticas que puedes usar inmediatamente.

Los hábitos atómicos no son solo otra técnica de productividad. Son una filosofía de vida. Son pequeños cambios que pueden transformar tu vida de maneras extraordinarias.

El secreto para obtener resultados que duren es nunca dejar de hacer mejoras. Es notable lo que puedes construir si no dejas de hacerlo.',
    1
),
(
    '550e8400-e29b-41d4-a716-446655440102',
    '550e8400-e29b-41d4-a716-446655440001',
    'Capítulo 1: El Sorprendente Poder de los Hábitos Atómicos',
    'Es muy fácil sobrestimar la importancia de un momento definitorio y subestimar el valor de hacer pequeñas mejoras diariamente. Con demasiada frecuencia, nos convencemos de que el cambio masivo requiere una acción masiva.

Ya sea perdiendo peso, construyendo un negocio, escribiendo un libro, ganando un campeonato, o logrando cualquier otra meta, nos presionamos para hacer alguna mejora que capture la atención de todos.

Mientras tanto, mejorar en un 1% no es particularmente notable, a veces ni siquiera es perceptible, pero puede ser mucho más significativo, especialmente a largo plazo.

## La Matemática de las Pequeñas Mejoras

Si puedes mejorar en un 1% cada día durante un año, terminarás siendo treinta y siete veces mejor al final del año. Por el contrario, si empeoras en un 1% cada día durante un año, caerás casi a cero.

1% mejor cada día: 1.01^365 = 37.78
1% peor cada día: 0.99^365 = 0.03

Lo que comienza como una pequeña ganancia o una pérdida menor se acumula en algo mucho más significativo.

## Los Hábitos Son el Interés Compuesto del Auto-Mejoramiento

Los hábitos son el interés compuesto del auto-mejoramiento. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican mientras los repites. Parecen hacer poca diferencia en un día dado, pero el impacto que entregan durante meses y años puede ser enorme.

Solo cuando miramos hacia atrás, dos, cinco o diez años después, el valor de los buenos hábitos y el costo de los malos se vuelve sorprendentemente aparente.

## El Valle de la Decepción

Imagina que tienes un cubo de hielo sentado en la mesa frente a ti. La habitación está fría y puedes ver tu aliento. Está a -10°C. Lentamente, la habitación comienza a calentarse.

-9°C... -8°C... -7°C...

El hielo sigue siendo sólido. Nada ha cambiado visiblemente.

-6°C... -5°C... -4°C...

Todavía nada. El cubo de hielo sigue intacto.

-3°C... -2°C... -1°C...

Aún sólido. Nada parece estar sucediendo.

0°C...

El hielo comienza a derretirse. Un cambio de un grado, aparentemente no diferente de los aumentos de temperatura que lo precedieron, ha desencadenado una transformación desproporcionada.

Los momentos de avance a menudo son el resultado de muchas acciones previas, que construyen el potencial requerido para desencadenar un cambio importante.

## Olvida las Metas, Enfócate en los Sistemas

Si eres entrenador, tu meta podría ser ganar un campeonato. Tu sistema es la forma en que reclutas jugadores, administra a tus asistentes y diriges las prácticas.

Si eres empresario, tu meta podría ser construir un negocio de un millón de dólares. Tu sistema es cómo pruebas ideas de productos, contratas empleados y ejecutas campañas de marketing.

Si eres músico, tu meta podría ser tocar una nueva pieza. Tu sistema es la frecuencia con la que practicas, cómo desglosas y abordas elementos difíciles, y tu método para recibir comentarios de tu instructor.

## Los Problemas con el Enfoque en las Metas

**Problema #1: Los ganadores y perdedores tienen las mismas metas.**

Cada atleta olímpico quiere ganar una medalla de oro. Cada candidato quiere conseguir el trabajo. Y si los exitosos y los no exitosos comparten las mismas metas, entonces la meta no puede ser lo que diferencia a los ganadores de los perdedores.

**Problema #2: Lograr una meta es solo un cambio momentáneo.**

Imagina que tienes una habitación desordenada y estableces la meta de limpiarla. Si reúnes la energía para ordenar, entonces tendrás una habitación limpia, por ahora. Pero si mantienes los mismos hábitos descuidados que llevaron a una habitación desordenada en primer lugar, pronto estarás mirando una nueva pila de desorden.

**Problema #3: Las metas restringen tu felicidad.**

La suposición implícita detrás de cualquier meta es: "Una vez que logre mi meta, seré feliz." El problema con una mentalidad de "primero la meta" es que continuamente pospones la felicidad hasta el próximo hito.

**Problema #4: Las metas están en desacuerdo con el progreso a largo plazo.**

Finalmente, una mentalidad orientada a metas puede crear un efecto "yo-yo". Muchas personas trabajan duro hasta que alcanzan una meta y luego se relajan. Es como correr una carrera, cruzar la línea de meta y luego dejar de correr.

## Un Sistema de Hábitos Atómicos

Si tienes problemas para cambiar tus hábitos, el problema no eres tú. El problema es tu sistema. Los malos hábitos se repiten una y otra vez no porque no quieras cambiar, sino porque tienes el sistema equivocado para el cambio.

No te elevas al nivel de tus metas. Caes al nivel de tus sistemas.

En este libro, aprenderás un sistema probado para construir buenos hábitos y eliminar los malos. Este sistema se basa en cuatro leyes simples:

**Las Cuatro Leyes del Cambio de Comportamiento**

1. **Hazlo Obvio** (1ª Ley)
2. **Hazlo Atractivo** (2ª Ley)  
3. **Hazlo Fácil** (3ª Ley)
4. **Hazlo Satisfactorio** (4ª Ley)

Cada ley corresponde a una de las cuatro etapas del bucle del hábito: señal, anhelo, respuesta y recompensa.

## Cómo Usar Este Libro

Este libro está organizado en seis partes. Las partes I y II sientan las bases explicando por qué los hábitos importan y cómo funcionan. Las partes III, IV, V y VI cubren cada una de las cuatro leyes del cambio de comportamiento.

Cada capítulo incluye historias de la vida real, investigación científica y estrategias prácticas que puedes usar inmediatamente.

Los hábitos atómicos no son solo otra técnica de productividad. Son una filosofía de vida. Son pequeños cambios que pueden transformar tu vida de maneras extraordinarias.

El secreto para obtener resultados que duren es nunca dejar de hacer mejoras. Es notable lo que puedes construir si no dejas de hacerlo.',
    1
),
(
    '550e8400-e29b-41d4-a716-446655440103',
    '550e8400-e29b-41d4-a716-446655440001',
    'Capítulo 2: Cómo Tus Hábitos Moldean Tu Identidad (y Viceversa)',
    'Por qué es tan fácil repetir los malos hábitos y tan difícil formar buenos? Pocas cosas pueden tener un impacto más poderoso en tu vida que mejorar tus hábitos diarios. Y sin embargo, es probable que esta vez el próximo año estarás haciendo las mismas cosas que estás haciendo hoy.

A menudo desperdiciamos nuestros esfuerzos de cambio en las cosas equivocadas. Y esto es la segunda razón por la que es tan difícil construir hábitos duraderos.

## Los Tres Niveles de Cambio

Hay tres niveles en los que puede ocurrir el cambio. Puedes imaginar estos como las capas de una cebolla.

**Nivel 1: Cambiar tus resultados**
Este nivel se trata de cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato. La mayoría de las metas que estableces están asociadas con este nivel de cambio.

**Nivel 2: Cambiar tu proceso**
Este nivel se trata de cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, decluttering tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación. La mayoría de los hábitos que construyes están asociados con este nivel.

**Nivel 3: Cambiar tu identidad**
Este nivel se trata de cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y otros. La mayoría de las creencias, suposiciones y sesgos que tienes están asociados con este nivel.

Los resultados se tratan de lo que obtienes. Los procesos se tratan de lo que haces. La identidad se trata de en lo que crees.

## El Problema Real del Cambio de Comportamiento

Detrás de cada sistema de acciones hay un sistema de creencias. El sistema de una democracia está fundado en creencias como la libertad, el estado de derecho y la igualdad social. El sistema de una dictadura tiene un conjunto muy diferente de creencias como la autoridad absoluta y la obediencia estricta.

Puedes imaginar cuán difícil sería cambiar las acciones de alguien si nunca cambiaras las creencias subyacentes que las motivaron. Lo mismo es cierto para los individuos.

## El Proceso de Dos Pasos para Cambiar Tu Identidad

Tu identidad emerge de tus hábitos. No naces con creencias preestablecidas. Cada creencia, incluyendo aquellas sobre ti mismo, se aprende y se condiciona a través de la experiencia.

Más precisamente, tus hábitos son cómo encarnas tu identidad. Cuando haces tu cama cada mañana, encarnas la identidad de una persona organizada. Cuando escribes cada día, encarnas la identidad de una persona creativa. Cuando entrenas cada día, encarnas la identidad de una persona atlética.

Cuanto más repites un comportamiento, más refuerzas la identidad asociada con ese comportamiento. De hecho, la palabra identidad originalmente se derivó de las palabras latinas essentitas, que significa ser, e identidem, que significa repetidamente. Tu identidad es literalmente tus "seres repetidos".

El proceso es un bucle de dos pasos:

1. Cada acción que tomas es un voto por el tipo de persona que deseas convertirte.
2. A medida que tus creencias sobre ti mismo cambian, también lo hacen tus acciones.

## Decidir el Tipo de Persona que Quieres Ser

El primer paso no es qué o cómo, sino quién. Necesitas saber quién quieres ser. De lo contrario, tu búsqueda del cambio es como un barco sin timón.

Aquí hay un ejercicio simple para comenzar:

1. Decide el tipo de persona que quieres ser.
2. Pruébatelo a ti mismo con pequeñas victorias.

**Pregúntate: "¿Qué haría una persona saludable?"**
- Una persona saludable caminaría.
- Una persona saludable comería una ensalada para el almuerzo.
- Una persona saludable tomaría las escaleras.

**Pregúntate: "¿Qué haría un escritor productivo?"**
- Un escritor productivo escribiría todos los días.
- Un escritor productivo tomaría su trabajo en serio.
- Un escritor productivo investigaría temas a fondo.

Cada hábito no solo obtiene resultados, también te enseña algo mucho más importante: confiar en ti mismo. Empiezas a creer que puedes lograr estas pequeñas cosas.

## El Verdadero Cambio es el Cambio de Identidad

Los hábitos que no se alinean con tu identidad deseada eventualmente se desvanecerán. Por eso es tan importante considerar el tipo de persona que quieres ser, no solo los resultados que quieres lograr.

Una vez que tienes un control sobre el tipo de persona que quieres ser, puedes comenzar a tomar pequeños pasos para reforzar tu identidad deseada.

El objetivo no es leer un libro, el objetivo es convertirse en un lector.
El objetivo no es correr un maratón, el objetivo es convertirse en un corredor.
El objetivo no es aprender un instrumento, el objetivo es convertirse en un músico.

Tus comportamientos generalmente son un reflejo de tu identidad. Lo que haces es una indicación del tipo de persona que crees que eres, ya sea consciente o inconscientemente.

El cambio real y duradero viene de cientos de pequeñas decisiones: hacer una llamada extra, mantenerse despierto una hora más, caminar una milla adicional.

Cada acción es un voto por el tipo de persona que deseas convertirte.',
    2
),
-- Los 7 Hábitos chapters
(
    '550e8400-e29b-41d4-a716-446655440201',
    '550e8400-e29b-41d4-a716-446655440002',
    'Introducción: Paradigmas y Principios',
    'En más de 25 años de trabajar con personas en empresas, universidades y en entornos matrimoniales y familiares, he llegado a contacto con muchas personas que han logrado un grado increíble de éxito externo, pero que luchan con una necesidad interna de desarrollar efectividad personal y relaciones saludables y crecientes con otras personas.

He llegado a creer que muchas personas con este tipo de éxito externo están más vacías que llenas. Internamente, luchan con un sentido de vacío personal, una sensación de que su vida carece de significado y contribución.

## El Cambio de Paradigma

Casi todos los avances significativos en los campos de la investigación científica han sido primero avances en la conciencia, primero cambios de paradigma, primero abandonar una vieja forma de pensar, una vieja forma de ver el mundo.

Para nuestros propósitos, un paradigma simple es una teoría, un conjunto de reglas y regulaciones que hace dos cosas: establece límites y te dice cómo comportarte dentro de esos límites para tener éxito.

Un paradigma es como un mapa. Todos sabemos que "el mapa no es el territorio". Un mapa es simplemente una descripción de ciertos aspectos del territorio.

Supongamos que quisieras llegar a un lugar específico en el centro de Chicago. Un mapa de la calle de Chicago sería de gran ayuda para ti en alcanzar tu destino. Pero supongamos que te dieran el mapa equivocado. Supongamos que te dieran un mapa de Detroit claramente etiquetado "Chicago". ¿Puedes imaginar la frustración, la inefectividad de tratar de llegar a donde quieres ir?

## La Ética del Carácter vs. La Ética de la Personalidad

En preparación para enseñar sobre liderazgo en los negocios, una vez revisé más de 200 años de literatura escrita sobre el éxito. Lo que encontré fue fascinante.

Durante los primeros 150 años, la literatura se centró en lo que podríamos llamar la Ética del Carácter como la base del éxito: cosas como integridad, humildad, fidelidad, templanza, coraje, justicia, paciencia, industria, simplicidad, modestia y la Regla de Oro.

Pero poco después de la Primera Guerra Mundial, la visión básica del éxito cambió de la Ética del Carácter a lo que podríamos llamar la Ética de la Personalidad. El éxito se convirtió más en una función de la personalidad, de la imagen pública, de las actitudes y comportamientos, habilidades y técnicas que lubrican los procesos de la interacción humana.

Esta Ética de la Personalidad esencialmente tomó dos caminos: uno era las técnicas de relaciones humanas e interpersonales, y el otro era la actitud mental positiva (AMP).

## Principios de Crecimiento y Cambio

Los principios no son prácticas. Una práctica es una actividad o acción específica. Una práctica que funciona en una circunstancia no necesariamente funcionará en otra.

Los principios, por el contrario, son verdades profundas, fundamentales, verdades clásicas, denominadores comunes. Son hebras estrechamente tejidas que corren con exactitud, consistencia, belleza y fuerza a través de la tela de la vida.

Los principios no son valores. Una pandilla de ladrones puede compartir valores, pero están violando los principios fundamentales que estamos discutiendo. Los principios son el territorio. Los valores son mapas.

## El Camino del Crecimiento Secuencial

El desarrollo de estos hábitos es un proceso evolutivo, no revolucionario. Contra el trasfondo de estos principios universales de efectividad, veremos cómo las personas crecen y se desarrollan naturalmente.

Observamos tres etapas secuenciales de crecimiento y desarrollo que llamamos el "Continuum de Madurez":

**Dependencia**: el paradigma de tú - tú cuidas de mí; tú vienes a través para mí; tú no vienes a través y yo te culpo por los resultados.

**Independencia**: el paradigma de yo - yo puedo hacerlo; yo soy responsable; yo soy autosuficiente; yo puedo elegir.

**Interdependencia**: el paradigma de nosotros - nosotros podemos hacerlo; nosotros podemos cooperar; nosotros podemos combinar nuestros talentos y habilidades y crear algo más grande juntos.

Los primeros tres hábitos tratan con el dominio propio. Se mueven de la dependencia a la independencia. Son las "victorias privadas", la esencia del desarrollo del carácter. Las victorias privadas preceden a las victorias públicas.

Los hábitos 4, 5 y 6 tratan con las relaciones con otros - trabajo en equipo, cooperación y comunicación. Estas son "victorias públicas".

El hábito 7 es el hábito de la renovación - renovación regular y equilibrada de las cuatro dimensiones básicas de la vida. Rodea a todos los otros hábitos y los hace posibles.',
    1
),
-- Lean In chapters
(
    '550e8400-e29b-41d4-a716-446655440501',
    '550e8400-e29b-41d4-a716-446655440005',
    'Capítulo 1: La Conversación Interna',
    'Una niña de ocho años me dijo que quería ser la jefa de Google. Esa misma semana, un niño me dijo que quería ser presidente. Cuando les pregunté por qué, la niña dijo: "No sé, pero sé que puedo hacerlo." El niño dijo: "Porque soy inteligente y trabajaré duro."

Sus respuestas me hicieron pensar sobre las diferencias en cómo los niños y las niñas se ven a sí mismas y sus ambiciones. Desde una edad temprana, los niños son alentados a tomar riesgos y ser líderes, mientras que las niñas son alentadas a ser perfectas y complacer a otros.

## El Problema de la Confianza

Hace varios años, Hewlett-Packard realizó un estudio interno sobre promociones y encontró que las mujeres solo solicitaban promociones cuando sentían que cumplían el 100% de las calificaciones, mientras que los hombres solicitaban promociones cuando sentían que cumplían el 60% de las calificaciones.

Esta diferencia es sorprendente y reveladora. Los hombres no necesariamente tienen más habilidades que las mujeres; simplemente tienen más confianza en sus habilidades.

## La Voz Interior

Desde una edad temprana, las niñas reciben el mensaje de que deben ser perfectas, complacer a otros y ser modestas sobre sus logros. Estos mensajes crean una voz interior que nos dice que no somos lo suficientemente buenas, lo suficientemente inteligentes o lo suficientemente capaces.

Esta voz interior puede ser increíblemente destructiva. Nos impide tomar riesgos, buscar oportunidades y creer en nosotras mismas. Nos mantiene pequeñas cuando deberíamos estar creciendo.

## El Síndrome del Impostor

Muchas mujeres exitosas sufren del síndrome del impostor - la sensación de que no merecen su éxito y que eventualmente serán "descubiertas" como fraudes. Este sentimiento es particularmente común entre las mujeres en posiciones de liderazgo.

El síndrome del impostor nos hace cuestionar nuestras habilidades y logros. Nos hace atribuir nuestro éxito a la suerte en lugar de a nuestro trabajo duro y talento.

## Cambiando la Conversación

Para cambiar el mundo, primero debemos cambiar la conversación que tenemos con nosotras mismas. Debemos:

1. **Reconocer nuestros logros**: En lugar de minimizar nuestros éxitos, debemos celebrarlos y reconocer el trabajo duro que los hizo posibles.

2. **Desafiar la voz interior**: Cuando esa voz nos dice que no somos lo suficientemente buenas, debemos desafiarla con evidencia de nuestras capacidades.

3. **Tomar riesgos**: Debemos estar dispuestas a fallar y aprender de nuestros errores, en lugar de evitar oportunidades por miedo al fracaso.

4. **Buscar mentores y patrocinadores**: Necesitamos personas que crean en nosotras y nos ayuden a avanzar en nuestras carreras.

## El Poder de la Ambición

La ambición no es una palabra sucia. Es el combustible que impulsa el progreso y el cambio. Las mujeres deben sentirse cómodas siendo ambiciosas y persiguiendo sus metas con determinación.

Cuando las mujeres son ambiciosas, no solo se benefician ellas mismas, sino que también abren puertas para otras mujeres. Cada mujer que alcanza una posición de liderazgo hace que sea más fácil para la próxima mujer hacer lo mismo.

## Apoyándonos Mutuamente

Las mujeres deben apoyarse mutuamente en lugar de competir entre sí. Cuando vemos a otra mujer tener éxito, debemos celebrar su éxito en lugar de sentir envidia o resentimiento.

Juntas, podemos cambiar la conversación y crear un mundo donde las mujeres se sientan empoderadas para perseguir sus sueños y alcanzar su máximo potencial.

## El Camino Adelante

Cambiar la conversación interna no es fácil. Requiere práctica, paciencia y persistencia. Pero es esencial si queremos crear un mundo más equitativo donde las mujeres puedan prosperar en todas las áreas de la vida.

Cada una de nosotras tiene el poder de cambiar su propia conversación interna. Y cuando lo hacemos, inspiramos a otras a hacer lo mismo. Este es el primer paso hacia la creación de un cambio real y duradero.',
    1
),
-- Inteligencia Emocional chapters
(
    '550e8400-e29b-41d4-a716-446655440401',
    '550e8400-e29b-41d4-a716-446655440004',
    'Capítulo 1: ¿Para Qué Sirven las Emociones?',
    'Considera el poder de las emociones para anular el pensamiento racional. Recuerdo vívidamente un incidente que ocurrió hace varios años cuando estaba volando de Nueva York a Londres. Era un vuelo nocturno, y la mayoría de los pasajeros estaban durmiendo cuando de repente el avión se sacudió violentamente.

El piloto anunció que habíamos encontrado turbulencia severa y que todos debían permanecer en sus asientos con los cinturones abrochados. Durante los siguientes veinte minutos, el avión se sacudió y se balanceó de manera aterradora.

Lo que me sorprendió no fue tanto la turbulencia, sino las reacciones emocionales de los pasajeros. Algunas personas permanecieron notablemente calmadas, leyendo o incluso durmiendo. Otras estaban visiblemente aterrorizadas, agarrando los reposabrazos con nudillos blancos, respirando rápidamente, algunos incluso llorando.

## El Cerebro Emocional

Todos tenemos dos mentes: una que piensa y otra que siente. Estas dos formas fundamentalmente diferentes de conocimiento interactúan para construir nuestra vida mental.

La mente racional es el modo de comprensión del que generalmente somos conscientes: más prominente en la conciencia, reflexivo, capaz de ponderar y reflexionar. Pero junto a ese existe otro sistema de conocimiento: impulsivo y poderoso, aunque a veces ilógico - la mente emocional.

## La Arquitectura Emocional

El diseño del cerebro que emergió a lo largo de millones de años de evolución nos dio emociones que fueron cruciales para la supervivencia. Aquellos de nuestros antepasados que desarrollaron este cerebro emocional tuvieron una ventaja de supervivencia.

El centro emocional del cerebro, el sistema límbico, puede secuestrar el cerebro pensante en momentos de crisis emocional intensa. Este "secuestro emocional" explica por qué las personas pueden hacer cosas en el calor de la pasión que más tarde lamentan profundamente.

## Las Emociones Como Guías

Las emociones nos guían cuando enfrentamos momentos demasiado importantes para dejarlos solo al intelecto: peligros, pérdidas dolorosas, persistir hacia una meta a pesar de las frustraciones, vincularse con un compañero, construir una familia.

Cada emoción nos prepara para actuar de una manera particular; cada una nos señala una dirección que ha funcionado bien para manejar los desafíos recurrentes de la vida humana.

**El Miedo** nos prepara para huir, bombeando sangre a los músculos grandes, especialmente en las piernas, haciendo más fácil correr.

**La Ira** lleva sangre a las manos, haciendo más fácil agarrar un arma o golpear a un enemigo; también aumenta el ritmo cardíaco y el flujo de hormonas como la adrenalina.

**La Felicidad** aumenta la actividad en un centro cerebral que inhibe los sentimientos negativos y fomenta un aumento en la energía disponible.

**El Amor, los sentimientos tiernos y la satisfacción sexual** activan el sistema nervioso parasimpático, lo opuesto a la movilización de "lucha o huida" que comparten el miedo y la ira.

## Cuando las Emociones Son Demasiado

Nuestras emociones han sido moldeadas por un largo período de evolución, una época en la que la vida era brutal y corta. Pero el mundo moderno presenta desafíos que nuestro cerebro emocional primitivo no está equipado para manejar.

En el mundo moderno, es raro que nuestras vidas estén en peligro físico real, pero nuestro cerebro emocional reacciona a las amenazas percibidas - como una fecha límite estresante o un conflicto con un colega - como si fueran amenazas de vida o muerte.

## La Inteligencia Emocional

La inteligencia emocional incluye la autoconciencia, el control de impulsos, la persistencia, el celo y la automotivación, la empatía y la destreza social. Estas son las cualidades que marcan a las personas que se destacan en la vida real.

La inteligencia emocional no significa dar rienda suelta a los sentimientos - "dejar que todo salga". Más bien, significa manejar los sentimientos de manera que se expresen apropiadamente y efectivamente, permitiendo que las personas trabajen juntas sin problemas hacia metas comunes.

## Los Componentes de la Inteligencia Emocional

**1. Autoconciencia**: Conocer las propias emociones. La autoconciencia es la piedra angular de la inteligencia emocional.

**2. Manejo de emociones**: Manejar las emociones apropiadamente se basa en la autoconciencia.

**3. Motivarse a uno mismo**: Canalizar las emociones al servicio de una meta es esencial para prestar atención, para la automotivación y el dominio, y para la creatividad.

**4. Reconocer emociones en otros**: La empatía es la habilidad fundamental de las personas.

**5. Manejar relaciones**: El arte de las relaciones es, en gran medida, la habilidad de manejar las emociones en otros.

## El Valor de la Inteligencia Emocional

Las reglas del trabajo están cambiando. Ahora se nos juzga por un nuevo estándar: no solo por qué tan inteligentes somos, o por nuestro entrenamiento y experiencia, sino también por qué tan bien nos manejamos a nosotros mismos y a otros.

Este estándar se aplica cada vez más en la elección de quién será contratado y quién no, quién será despedido y quién retenido, quién será pasado por alto y quién promovido.

Las nuevas reglas predicen quién tiene más probabilidades de convertirse en una estrella en el trabajo y quién es más propenso a descarrilarse. No importa en qué campo trabajemos actualmente, miden rasgos cruciales que determinan qué tan bien nos va en la vida.

Estas reglas tienen poco que ver con lo que la escuela nos dijo que era importante; el mundo académico se centra en las habilidades cognitivas, pero en la vida, la inteligencia emocional importa más.',
    1
);

-- Create function for obtaining user reading statistics
CREATE OR REPLACE FUNCTION get_user_reading_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'books_read', COALESCE(books_completed.count, 0),
        'total_reading_time', COALESCE(total_time.minutes, 0),
        'current_streak', 5, -- Placeholder for now
        'books_in_progress', COALESCE(books_progress.count, 0)
    ) INTO result
    FROM (
        SELECT COUNT(*) as count
        FROM user_book_progress 
        WHERE user_id = user_uuid AND completed_at IS NOT NULL
    ) books_completed
    CROSS JOIN (
        SELECT COALESCE(SUM(reading_time_minutes), 0) as minutes
        FROM user_book_progress 
        WHERE user_id = user_uuid
    ) total_time
    CROSS JOIN (
        SELECT COUNT(*) as count
        FROM user_book_progress 
        WHERE user_id = user_uuid AND completed_at IS NULL AND progress_percentage > 0
    ) books_progress;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for obtaining recommended books
CREATE OR REPLACE FUNCTION get_recommended_books(user_uuid UUID DEFAULT NULL)
RETURNS TABLE(
    id UUID,
    title TEXT,
    author TEXT,
    description TEXT,
    cover_image TEXT,
    category TEXT,
    difficulty TEXT,
    rating DECIMAL,
    reading_time TEXT,
    pages INTEGER,
    user_progress INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.title,
        b.author,
        b.description,
        b.cover_image,
        b.category,
        b.difficulty,
        b.rating,
        b.reading_time,
        b.pages,
        COALESCE(p.progress_percentage, 0) as user_progress
    FROM library_books b
    LEFT JOIN user_book_progress p ON b.id = p.book_id AND p.user_id = user_uuid
    WHERE b.is_recommended = true
    ORDER BY b.rating DESC, b.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for testing
INSERT INTO user_book_progress (user_id, book_id, current_chapter, progress_percentage, reading_time_minutes, last_read_at)
VALUES 
-- Usuario demo leyendo Hábitos Atómicos
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 2, 65, 180, NOW() - INTERVAL '2 hours'),
-- Usuario demo completó Los 7 Hábitos
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 7, 100, 375, NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week'),
-- Usuario demo empezó Lean In
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 1, 25, 70, NOW() - INTERVAL '1 day');
