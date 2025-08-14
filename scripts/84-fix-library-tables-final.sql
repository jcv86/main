-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS user_book_bookmarks CASCADE;
DROP TABLE IF EXISTS user_book_progress CASCADE;
DROP TABLE IF EXISTS book_chapters CASCADE;
DROP TABLE IF EXISTS library_books CASCADE;

-- Create library_books table
CREATE TABLE library_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT,
    category TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('Fácil', 'Intermedio', 'Avanzado')) DEFAULT 'Intermedio',
    estimated_reading_time INTEGER DEFAULT 240,
    pages INTEGER,
    published_year INTEGER,
    rating DECIMAL(2,1) DEFAULT 4.0,
    tags TEXT[] DEFAULT '{}',
    key_topics TEXT[] DEFAULT '{}',
    is_recommended BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create book_chapters table
CREATE TABLE book_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, chapter_number)
);

-- Create user_book_progress table
CREATE TABLE user_book_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id UUID REFERENCES library_books(id) ON DELETE CASCADE,
    current_chapter INTEGER DEFAULT 1,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
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
    book_id UUID REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES book_chapters(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Library books are viewable by everyone" ON library_books FOR SELECT USING (true);
CREATE POLICY "Book chapters are viewable by everyone" ON book_chapters FOR SELECT USING (true);
CREATE POLICY "Users can view their own progress" ON user_book_progress FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view their own bookmarks" ON user_book_bookmarks FOR ALL USING (auth.uid()::text = user_id::text);

-- Insert sample books
INSERT INTO library_books (
    id, title, author, description, cover_image, category, difficulty, 
    estimated_reading_time, pages, published_year, rating, tags, key_topics, is_recommended, is_featured
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'Hábitos Atómicos',
    'James Clear',
    'Un método fácil y comprobado para crear buenos hábitos y eliminar los malos. Los pequeños cambios pueden generar resultados extraordinarios.',
    '/books/atomic-habits.jpg',
    'Productividad',
    'Intermedio',
    320,
    320,
    2018,
    4.8,
    ARRAY['hábitos', 'productividad', 'autoayuda', 'desarrollo personal'],
    ARRAY['Formación de hábitos', 'Cambio de comportamiento', 'Productividad personal', 'Mejora continua'],
    true,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'Inteligencia Emocional',
    'Daniel Goleman',
    'Por qué puede importar más que el coeficiente intelectual. Descubre cómo desarrollar tu inteligencia emocional para el éxito.',
    '/books/emotional-intelligence.jpg',
    'Psicología',
    'Intermedio',
    384,
    384,
    1995,
    4.5,
    ARRAY['inteligencia emocional', 'psicología', 'liderazgo', 'habilidades sociales'],
    ARRAY['Autoconciencia', 'Autorregulación', 'Empatía', 'Habilidades sociales', 'Motivación'],
    true,
    true
),
(
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'Lean In',
    'Sheryl Sandberg',
    'Las mujeres, el trabajo y la voluntad de liderar. Una guía inspiradora para el liderazgo femenino en el mundo profesional.',
    '/books/lean-in.jpg',
    'Liderazgo',
    'Intermedio',
    240,
    240,
    2013,
    4.4,
    ARRAY['liderazgo', 'mujeres', 'carrera', 'trabajo', 'igualdad'],
    ARRAY['Liderazgo femenino', 'Desarrollo profesional', 'Igualdad de género', 'Carrera profesional'],
    true,
    true
);

-- Insert sample chapters for Hábitos Atómicos
INSERT INTO book_chapters (id, book_id, chapter_number, title, content) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440101'::uuid,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    1,
    'El Sorprendente Poder de los Hábitos Atómicos',
    'Es muy fácil sobrestimar la importancia de un momento definitorio y subestimar el valor de hacer pequeñas mejoras diariamente. Con demasiada frecuencia, nos convencemos de que el cambio masivo requiere una acción masiva.

Ya sea que se trate de perder peso, construir un negocio, escribir un libro, ganar un campeonato o lograr cualquier otro objetivo, nos presionamos para hacer alguna mejora que sacuda la tierra y de la que todos hablen.

Mientras tanto, mejorar en un 1 por ciento no es particularmente notable, a veces ni siquiera es perceptible, pero puede ser mucho más significativo, especialmente a largo plazo. La diferencia que puede hacer una pequeña mejora con el tiempo es asombrosa.

Aquí está cómo funciona la matemática: si puedes mejorar en un 1 por ciento cada día durante un año, terminarás siendo treinta y siete veces mejor al final. Por el contrario, si empeoras en un 1 por ciento cada día durante un año, caerás casi hasta cero.

Los hábitos son el interés compuesto de la superación personal. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites.'
),
(
    '550e8400-e29b-41d4-a716-446655440102'::uuid,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    2,
    'Cómo Tus Hábitos Moldean Tu Identidad (y Viceversa)',
    '¿Por qué es tan fácil repetir los malos hábitos y tan difícil formar buenos? Pocas cosas pueden tener un impacto más poderoso en tu vida que mejorar tus hábitos diarios. Y sin embargo, es probable que este tiempo el próximo año estarás haciendo lo mismo en lugar de algo mejor.

Es fácil descartar la importancia de hacer mejores decisiones en el día a día. Después de todo, una decisión de 2 por ciento de mejora o una decisión de 1 por ciento de declive parece insignificante en el momento. En cualquier día dado, no parece importar mucho si comes una dona saludable, tienes una conversación productiva con tu pareja, o escribes unas pocas páginas de tu libro.

Pero cuando repetimos errores del 1 por ciento, día tras día, replicando decisiones pobres, duplicando pequeños errores, y racionalizando pequeñas excusas, nuestras pequeñas decisiones se combinan en resultados tóxicos.

El proceso funciona en reversa también. Cuando haces una decisión que es un 1 por ciento mejor o un 1 por ciento más precisa, se entrega un voto positivo para el tipo de persona que deseas convertirte. No hay transformación única que defina tu identidad, pero cada acción es un voto para el tipo de persona que deseas convertirte.'
);

-- Insert sample chapters for Inteligencia Emocional
INSERT INTO book_chapters (id, book_id, chapter_number, title, content) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440201'::uuid,
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    1,
    '¿Para Qué Sirven las Emociones?',
    'La mente emocional es mucho más rápida que la mente racional, entrando en acción sin detenerse ni un momento a considerar lo que está haciendo. Su rapidez excluye la reflexión deliberada y analítica que es el sello distintivo de la mente pensante.

En los momentos de pasión, la mente emocional domina a la racional. Cuanto más intenso es el sentimiento, más dominante se vuelve la mente emocional y más ineficaz la racional. Esta es una disposición que parece derivar de eones de ventaja evolutiva de tener emociones y intuiciones que guíen nuestras decisiones instantáneas en situaciones donde nuestras vidas están en peligro.

Las emociones, entonces, importan para la racionalidad. En la danza del sentimiento y el pensamiento, la facultad emocional guía nuestras decisiones momento a momento, trabajando de la mano con la mente racional, habilitando o deshabilitando el pensamiento mismo. Del mismo modo, el cerebro pensante juega un papel ejecutivo en nuestras emociones, excepto en aquellos momentos cuando las emociones se salen de control y el cerebro emocional corre desenfrenado.

En cierto sentido, tenemos dos cerebros, dos mentes y dos clases diferentes de inteligencia: racional y emocional. Cómo nos va en la vida está determinado por ambas; no es solo el CI lo que importa, sino también la inteligencia emocional.'
);

-- Insert sample chapters for Lean In
INSERT INTO book_chapters (id, book_id, chapter_number, title, content) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440301'::uuid,
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    1,
    'La Brecha de Ambición en el Liderazgo',
    'Un mundo verdaderamente igualitario sería aquel donde las mujeres dirigieran la mitad de nuestros países y empresas, y los hombres dirigieran la mitad de nuestros hogares. Creo que este sería un mundo mejor. Las leyes de la economía y muchos estudios sobre diversidad nos dicen que si aprovecháramos todo el conjunto de recursos humanos y talento, nuestro rendimiento mejoraría.

Las mujeres siguen enfrentando muchos obstáculos, incluyendo la falta de modelos a seguir, la falta de patrocinadores, y las políticas laborales inflexibles. También enfrentan estereotipos y sesgos sobre su compromiso, liderazgo y capacidades. Estos obstáculos son reales, y eliminarlos requerirá cambios en las políticas y actitudes.

Pero también creo firmemente que necesitamos más mujeres no solo participando en estas conversaciones, sino liderándolas. Para hacer esto, las mujeres deben estar preparadas para "inclinarse hacia adelante" - para ser asertivas, tomar riesgos y perseguir oportunidades de liderazgo con determinación.

Mi argumento es que sacar completamente a las mujeres de la fuerza laboral es una pérdida para las mujeres, sus familias, y la sociedad. Una mujer con una carrera exitosa puede ser un modelo a seguir para sus hijas y puede contribuir económicamente a su familia. Puede usar sus habilidades y educación para hacer una diferencia en el mundo.'
);

-- Create indexes for better performance
CREATE INDEX idx_library_books_category ON library_books(category);
CREATE INDEX idx_library_books_difficulty ON library_books(difficulty);
CREATE INDEX idx_library_books_featured ON library_books(is_featured);
CREATE INDEX idx_book_chapters_book_id ON book_chapters(book_id);
CREATE INDEX idx_user_book_progress_user_id ON user_book_progress(user_id);
CREATE INDEX idx_user_book_progress_book_id ON user_book_progress(book_id);
CREATE INDEX idx_user_book_bookmarks_user_id ON user_book_bookmarks(user_id);
CREATE INDEX idx_user_book_bookmarks_book_id ON user_book_bookmarks(book_id);
