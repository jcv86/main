-- Create enhanced library tables for full book functionality

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS reading_sessions CASCADE;
DROP TABLE IF EXISTS user_book_quotes CASCADE;
DROP TABLE IF EXISTS user_book_notes CASCADE;
DROP TABLE IF EXISTS user_book_highlights CASCADE;
DROP TABLE IF EXISTS user_book_bookmarks CASCADE;
DROP TABLE IF EXISTS user_book_progress CASCADE;
DROP TABLE IF EXISTS library_book_chapters CASCADE;
DROP TABLE IF EXISTS library_books CASCADE;

-- Create library_books table
CREATE TABLE library_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Principiante', 'Intermedio', 'Avanzado')),
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    estimated_reading_time INTEGER NOT NULL DEFAULT 0, -- in minutes
    pages INTEGER NOT NULL DEFAULT 0,
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, "order")
);

-- Create user_book_progress table
CREATE TABLE user_book_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES library_book_chapters(id) ON DELETE CASCADE,
    chapter_title TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id, chapter_id)
);

-- Create user_book_highlights table
CREATE TABLE user_book_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES library_book_chapters(id) ON DELETE CASCADE,
    selected_text TEXT NOT NULL,
    start_position INTEGER NOT NULL,
    end_position INTEGER NOT NULL,
    color TEXT DEFAULT 'yellow' CHECK (color IN ('yellow', 'green', 'blue', 'pink', 'orange')),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_book_notes table
CREATE TABLE user_book_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES library_book_chapters(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_book_quotes table
CREATE TABLE user_book_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES library_book_chapters(id) ON DELETE CASCADE,
    quote_text TEXT NOT NULL,
    context TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reading_sessions table
CREATE TABLE reading_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES library_book_chapters(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    pages_read INTEGER DEFAULT 0,
    words_read INTEGER DEFAULT 0,
    focus_score INTEGER CHECK (focus_score >= 1 AND focus_score <= 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_library_books_category ON library_books(category);
CREATE INDEX idx_library_books_difficulty ON library_books(difficulty);
CREATE INDEX idx_library_books_is_recommended ON library_books(is_recommended);
CREATE INDEX idx_library_books_rating ON library_books(rating);

CREATE INDEX idx_library_book_chapters_book_id ON library_book_chapters(book_id);
CREATE INDEX idx_library_book_chapters_order ON library_book_chapters(book_id, "order");

CREATE INDEX idx_user_book_progress_user_id ON user_book_progress(user_id);
CREATE INDEX idx_user_book_progress_book_id ON user_book_progress(book_id);
CREATE INDEX idx_user_book_progress_last_read ON user_book_progress(last_read_at);

CREATE INDEX idx_user_book_bookmarks_user_id ON user_book_bookmarks(user_id);
CREATE INDEX idx_user_book_bookmarks_book_id ON user_book_bookmarks(book_id);

CREATE INDEX idx_user_book_highlights_user_id ON user_book_highlights(user_id);
CREATE INDEX idx_user_book_highlights_chapter_id ON user_book_highlights(chapter_id);
CREATE INDEX idx_user_book_highlights_position ON user_book_highlights(start_position);

CREATE INDEX idx_user_book_notes_user_id ON user_book_notes(user_id);
CREATE INDEX idx_user_book_notes_chapter_id ON user_book_notes(chapter_id);

CREATE INDEX idx_user_book_quotes_user_id ON user_book_quotes(user_id);
CREATE INDEX idx_user_book_quotes_is_favorite ON user_book_quotes(is_favorite);

CREATE INDEX idx_reading_sessions_user_id ON reading_sessions(user_id);
CREATE INDEX idx_reading_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX idx_reading_sessions_start_time ON reading_sessions(start_time);

-- Enable Row Level Security (RLS)
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Library books and chapters are readable by everyone
CREATE POLICY "Library books are viewable by everyone" ON library_books
    FOR SELECT USING (true);

CREATE POLICY "Library book chapters are viewable by everyone" ON library_book_chapters
    FOR SELECT USING (true);

-- User-specific data policies
CREATE POLICY "Users can view their own progress" ON user_book_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_book_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_book_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON user_book_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks" ON user_book_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON user_book_bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" ON user_book_bookmarks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON user_book_bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- Highlights policies
CREATE POLICY "Users can view their own highlights" ON user_book_highlights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own highlights" ON user_book_highlights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own highlights" ON user_book_highlights
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own highlights" ON user_book_highlights
    FOR DELETE USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can view their own notes" ON user_book_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON user_book_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON user_book_notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON user_book_notes
    FOR DELETE USING (auth.uid() = user_id);

-- Quotes policies
CREATE POLICY "Users can view their own quotes" ON user_book_quotes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quotes" ON user_book_quotes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotes" ON user_book_quotes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotes" ON user_book_quotes
    FOR DELETE USING (auth.uid() = user_id);

-- Reading sessions policies
CREATE POLICY "Users can view their own reading sessions" ON reading_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading sessions" ON reading_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading sessions" ON reading_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reading sessions" ON reading_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_library_books_updated_at BEFORE UPDATE ON library_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_library_book_chapters_updated_at BEFORE UPDATE ON library_book_chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_progress_updated_at BEFORE UPDATE ON user_book_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_highlights_updated_at BEFORE UPDATE ON user_book_highlights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_notes_updated_at BEFORE UPDATE ON user_book_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_quotes_updated_at BEFORE UPDATE ON user_book_quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert the Lean In book with all chapters
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
    is_recommended
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
    true
);

-- Insert chapters for Lean In book
INSERT INTO library_book_chapters (id, book_id, title, content, "order") VALUES
(
    '123e4567-e89b-12d3-a456-426614174000',
    '550e8400-e29b-41d4-a716-446655440005',
    'Introducción: La Conversación Interna',
    'En el mundo profesional actual, las mujeres enfrentan desafíos únicos que van más allá de las barreras externas. Existe una conversación interna que muchas mujeres mantienen consigo mismas, llena de dudas, cuestionamientos y limitaciones autoimpuestas.

Esta conversación interna a menudo incluye preguntas como: "¿Soy lo suficientemente buena para este puesto?" o "¿Qué pensarán si hablo en esta reunión?" Estas dudas no surgen de la nada; son el resultado de años de condicionamiento social y expectativas culturales.

El primer paso para el cambio es reconocer que esta conversación existe. Muchas mujeres talentosas se limitan a sí mismas antes de que cualquier barrera externa tenga la oportunidad de hacerlo. Cambian su comportamiento, reducen sus ambiciones y se conforman con menos de lo que merecen.

Pero también existe otra realidad: las mujeres que han logrado romper estas barreras internas han descubierto un poder transformador. Han aprendido a confiar en sus habilidades, a hablar con autoridad y a perseguir oportunidades con determinación.

El cambio comienza con la conciencia. Cuando las mujeres reconocen los patrones de pensamiento que las limitan, pueden comenzar a desafiarlos. Pueden empezar a reescribir esa conversación interna, transformándola de una fuente de dudas en una fuente de fortaleza.

Este libro explora cómo las mujeres pueden desarrollar la confianza necesaria para liderar, cómo pueden navegar los desafíos únicos del lugar de trabajo moderno, y cómo pueden crear un cambio positivo tanto para ellas mismas como para las generaciones futuras.

La igualdad de género en el lugar de trabajo no es solo un tema de justicia social; es una necesidad económica. Las organizaciones que aprovechan plenamente el talento femenino superan consistentemente a aquellas que no lo hacen. Sin embargo, para que esto suceda, las mujeres deben estar dispuestas a dar un paso adelante y reclamar su lugar en la mesa de decisiones.',
    1
),
(
    '123e4567-e89b-12d3-a456-426614174001',
    '550e8400-e29b-41d4-a716-446655440005',
    'Capítulo 1: Siéntate a la Mesa',
    'En una reunión ejecutiva de una empresa Fortune 500, había una mesa grande rodeada de sillas. Los ejecutivos masculinos se sentaron naturalmente alrededor de la mesa, mientras que las pocas mujeres presentes tomaron asiento en las sillas contra la pared. Esta escena se repite en salas de juntas de todo el mundo, y es una metáfora poderosa de un problema más amplio.

Las mujeres a menudo se excluyen a sí mismas de las conversaciones importantes, literal y figurativamente. No se sientan a la mesa principal, no hablan en las reuniones, y no se postulan para los puestos de liderazgo que merecen. Esta autoexclusión tiene raíces profundas en la socialización y las expectativas culturales.

Desde una edad temprana, a las niñas se les enseña a ser modestas, a no presumir, y a poner las necesidades de otros antes que las propias. Estos valores, aunque admirables en muchos contextos, pueden convertirse en obstáculos en el mundo profesional. Mientras que los hombres son alentados a ser asertivos y ambiciosos, las mujeres que muestran estas mismas cualidades a menudo son etiquetadas negativamente.

El síndrome del impostor afecta desproporcionadamente a las mujeres. Muchas mujeres exitosas sienten que no merecen sus logros, que han tenido suerte, o que pronto serán "descubiertas" como fraudes. Esta sensación las lleva a trabajar más duro para demostrar su valía, pero también las hace menos propensas a buscar nuevas oportunidades o a hablar con confianza sobre sus logros.

La investigación muestra que los hombres se postulan para trabajos cuando cumplen con el 60% de los requisitos, mientras que las mujeres esperan hasta cumplir con el 100%. Esta diferencia en la percepción de la preparación tiene consecuencias reales en las trayectorias profesionales.

Para sentarse a la mesa, las mujeres deben: Primero, reconocer su propio valor. Segundo, desarrollar la confianza para hablar. Tercero, buscar activamente oportunidades de liderazgo. Cuarto, construir una red de apoyo.

Sentarse a la mesa no es solo sobre ocupar un asiento físico; es sobre reclamar el espacio que las mujeres merecen en las conversaciones que dan forma al futuro de las organizaciones y la sociedad.',
    2
),
(
    '123e4567-e89b-12d3-a456-426614174002',
    '550e8400-e29b-41d4-a716-446655440005',
    'Capítulo 2: El Éxito y la Simpatía',
    'Existe un dilema fundamental que enfrentan las mujeres en el lugar de trabajo: el conflicto entre el éxito y la simpatía. La investigación ha demostrado consistentemente que cuando las mujeres tienen éxito, especialmente en roles tradicionalmente masculinos, a menudo son percibidas como menos simpáticas. Este fenómeno no afecta a los hombres de la misma manera.

Este dilema se manifiesta de múltiples formas en el entorno laboral. Una mujer que negocia agresivamente por un salario más alto puede ser vista como "difícil" o "demandante", mientras que un hombre que hace lo mismo es considerado "un buen negociador". Una líder femenina que toma decisiones difíciles puede ser etiquetada como "fría" o "calculadora", mientras que un líder masculino que hace lo mismo es visto como "decisivo" y "fuerte".

Esta doble moral tiene consecuencias reales. Las mujeres que son percibidas como menos simpáticas pueden enfrentar resistencia de colegas, dificultades para construir coaliciones, y obstáculos en su avance profesional. Como resultado, muchas mujeres modifican su comportamiento, suavizando su enfoque o disculpándose por sus éxitos, en un intento de mantener la simpatía.

El origen de este dilema se encuentra en las expectativas sociales profundamente arraigadas sobre cómo deben comportarse las mujeres. Se espera que las mujeres sean cálidas, serviciales y modestas. Cuando violan estas expectativas al ser asertivas o ambiciosas, enfrentan una reacción negativa.

Un estudio famoso ilustra este punto perfectamente. Los investigadores presentaron a los participantes el caso de estudio de un empresario exitoso. A la mitad de los participantes se les dijo que el empresario se llamaba "Howard", mientras que a la otra mitad se les dijo que se llamaba "Heidi". Aunque los logros y las cualidades eran idénticos, los participantes calificaron a Howard como más simpático y como alguien con quien les gustaría trabajar, mientras que Heidi fue vista como egoísta y menos deseable como colega.

Para navegar este dilema, las mujeres pueden: Primero, ser conscientes de que existe. Segundo, encontrar formas de ser asertivas mientras mantienen la calidez. Tercero, construir alianzas fuertes. Cuarto, no disculparse por sus éxitos legítimos.',
    3
),
(
    '123e4567-e89b-12d3-a456-426614174003',
    '550e8400-e29b-41d4-a716-446655440005',
    'Capítulo 3: Mentores y Patrocinadores',
    'En el camino hacia el liderazgo, pocas cosas son tan valiosas como tener mentores y patrocinadores. Sin embargo, existe una diferencia crucial entre estos dos roles, y entender esta diferencia puede ser determinante para el éxito profesional de una mujer.

Un mentor es alguien que ofrece consejos, comparte experiencias y ayuda a desarrollar habilidades. La relación de mentoría se basa en el intercambio de conocimientos y la orientación. Un patrocinador, por otro lado, es alguien que aboga activamente por tu avance profesional, que usa su influencia para crear oportunidades y que está dispuesto a apostar su reputación por tu éxito.

Las mujeres a menudo tienen más mentores que patrocinadores, y esta diferencia es significativa. Mientras que los mentores pueden ofrecer valiosos consejos, son los patrocinadores quienes realmente abren puertas. Son ellos quienes mencionan tu nombre cuando se discuten promociones, quienes te recomiendan para proyectos de alto perfil, y quienes te defienden cuando no estás en la habitación.

La investigación muestra que los hombres son más propensos a tener patrocinadores, mientras que las mujeres tienden a ser "sobre-mentoreadas y sub-patrocinadas". Esta disparidad contribuye a la brecha de género en posiciones de liderazgo.

Para desarrollar relaciones de patrocinio efectivas, las mujeres deben: Primero, entregar resultados excepcionales consistentemente. Segundo, hacer visible su trabajo y sus logros. Tercero, construir relaciones auténticas con líderes senior. Cuarto, ser específicas sobre sus aspiraciones profesionales.

Los patrocinadores efectivos no solo ofrecen consejos; toman acción. Crean oportunidades, hacen conexiones importantes, y proporcionan retroalimentación honesta sobre el rendimiento y la percepción. También ayudan a navegar la política organizacional y proporcionan visibilidad en niveles senior.

Es importante recordar que el patrocinio es una relación bidireccional. Los patrocinadores invierten en individuos que pueden entregar resultados y reflejar positivamente en su juicio. Por lo tanto, es crucial demostrar valor y potencial antes de esperar patrocinio.

Las organizaciones también tienen un papel que desempeñar en asegurar que las mujeres tengan acceso igual a oportunidades de patrocinio. Esto puede incluir programas formales de patrocinio, transparencia en los procesos de promoción, y responsabilidad de los líderes por desarrollar talento diverso.',
    4
);

-- Verification queries
SELECT 'Books inserted:' as status, COUNT(*) as count FROM library_books;
SELECT 'Chapters inserted:' as status, COUNT(*) as count FROM library_book_chapters;
SELECT 'Total character count:' as status, SUM(LENGTH(content)) as total_chars FROM library_book_chapters WHERE book_id = '550e8400-e29b-41d4-a716-446655440005';
