-- Enhanced Library System Setup
-- This script creates all necessary tables for the advanced library functionality

-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS user_book_quotes CASCADE;
DROP TABLE IF EXISTS user_book_notes CASCADE;
DROP TABLE IF EXISTS user_book_highlights CASCADE;
DROP TABLE IF EXISTS user_book_bookmarks CASCADE;
DROP TABLE IF EXISTS user_reading_sessions CASCADE;
DROP TABLE IF EXISTS user_book_progress CASCADE;
DROP TABLE IF EXISTS book_chapters CASCADE;
DROP TABLE IF EXISTS library_books CASCADE;

-- Create library_books table
CREATE TABLE library_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    estimated_reading_time INTEGER NOT NULL DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    total_chapters INTEGER DEFAULT 0,
    total_pages INTEGER DEFAULT 0,
    language TEXT DEFAULT 'es',
    isbn TEXT,
    publication_year INTEGER,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create book_chapters table
CREATE TABLE book_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    word_count INTEGER DEFAULT 0,
    estimated_reading_time INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, chapter_number)
);

-- Create user_book_progress table
CREATE TABLE user_book_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    current_chapter INTEGER DEFAULT 1,
    current_position INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    total_reading_time INTEGER DEFAULT 0,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- Create user_reading_sessions table
CREATE TABLE user_reading_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES book_chapters(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 0,
    pages_read INTEGER DEFAULT 0,
    words_read INTEGER DEFAULT 0,
    focus_score DECIMAL(3,2) DEFAULT 0.0,
    session_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_book_bookmarks table
CREATE TABLE user_book_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES book_chapters(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    title TEXT,
    note TEXT,
    color TEXT DEFAULT 'blue',
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_book_highlights table
CREATE TABLE user_book_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES book_chapters(id) ON DELETE CASCADE,
    start_position INTEGER NOT NULL,
    end_position INTEGER NOT NULL,
    highlighted_text TEXT NOT NULL,
    color TEXT DEFAULT 'yellow' CHECK (color IN ('yellow', 'green', 'blue', 'pink', 'orange')),
    note TEXT,
    is_private BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_book_notes table
CREATE TABLE user_book_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES book_chapters(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    title TEXT,
    content TEXT NOT NULL,
    note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'question', 'insight', 'summary', 'reflection')),
    is_private BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_book_quotes table
CREATE TABLE user_book_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES book_chapters(id) ON DELETE CASCADE,
    quote_text TEXT NOT NULL,
    context TEXT,
    personal_reflection TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT false,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_library_books_category ON library_books(category);
CREATE INDEX idx_library_books_difficulty ON library_books(difficulty);
CREATE INDEX idx_library_books_featured ON library_books(is_featured);
CREATE INDEX idx_library_books_tags ON library_books USING GIN(tags);

CREATE INDEX idx_book_chapters_book_id ON book_chapters(book_id);
CREATE INDEX idx_book_chapters_number ON book_chapters(book_id, chapter_number);

CREATE INDEX idx_user_book_progress_user_id ON user_book_progress(user_id);
CREATE INDEX idx_user_book_progress_book_id ON user_book_progress(book_id);
CREATE INDEX idx_user_book_progress_last_read ON user_book_progress(last_read_at);

CREATE INDEX idx_user_reading_sessions_user_id ON user_reading_sessions(user_id);
CREATE INDEX idx_user_reading_sessions_book_id ON user_reading_sessions(book_id);
CREATE INDEX idx_user_reading_sessions_start_time ON user_reading_sessions(start_time);

CREATE INDEX idx_user_book_bookmarks_user_book ON user_book_bookmarks(user_id, book_id);
CREATE INDEX idx_user_book_bookmarks_chapter ON user_book_bookmarks(chapter_id);

CREATE INDEX idx_user_book_highlights_user_book ON user_book_highlights(user_id, book_id);
CREATE INDEX idx_user_book_highlights_chapter ON user_book_highlights(chapter_id);
CREATE INDEX idx_user_book_highlights_color ON user_book_highlights(color);

CREATE INDEX idx_user_book_notes_user_book ON user_book_notes(user_id, book_id);
CREATE INDEX idx_user_book_notes_chapter ON user_book_notes(chapter_id);
CREATE INDEX idx_user_book_notes_type ON user_book_notes(note_type);

CREATE INDEX idx_user_book_quotes_user_book ON user_book_quotes(user_id, book_id);
CREATE INDEX idx_user_book_quotes_chapter ON user_book_quotes(chapter_id);
CREATE INDEX idx_user_book_quotes_favorite ON user_book_quotes(is_favorite);

-- Enable RLS on all tables
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Library books - readable by all authenticated users
CREATE POLICY "Library books are viewable by authenticated users" ON library_books
    FOR SELECT USING (auth.role() = 'authenticated');

-- Book chapters - readable by all authenticated users
CREATE POLICY "Book chapters are viewable by authenticated users" ON book_chapters
    FOR SELECT USING (auth.role() = 'authenticated');

-- User book progress - users can only see and modify their own progress
CREATE POLICY "Users can view their own book progress" ON user_book_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own book progress" ON user_book_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own book progress" ON user_book_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own book progress" ON user_book_progress
    FOR DELETE USING (auth.uid() = user_id);

-- User reading sessions - users can only see and modify their own sessions
CREATE POLICY "Users can view their own reading sessions" ON user_reading_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading sessions" ON user_reading_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading sessions" ON user_reading_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- User bookmarks - users can only see and modify their own bookmarks
CREATE POLICY "Users can view their own bookmarks" ON user_book_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON user_book_bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" ON user_book_bookmarks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON user_book_bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- User highlights - users can only see and modify their own highlights
CREATE POLICY "Users can view their own highlights" ON user_book_highlights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own highlights" ON user_book_highlights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own highlights" ON user_book_highlights
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own highlights" ON user_book_highlights
    FOR DELETE USING (auth.uid() = user_id);

-- User notes - users can only see and modify their own notes
CREATE POLICY "Users can view their own notes" ON user_book_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON user_book_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON user_book_notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON user_book_notes
    FOR DELETE USING (auth.uid() = user_id);

-- User quotes - users can only see and modify their own quotes
CREATE POLICY "Users can view their own quotes" ON user_book_quotes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quotes" ON user_book_quotes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotes" ON user_book_quotes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotes" ON user_book_quotes
    FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_library_books_updated_at BEFORE UPDATE ON library_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_progress_updated_at BEFORE UPDATE ON user_book_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_bookmarks_updated_at BEFORE UPDATE ON user_book_bookmarks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_highlights_updated_at BEFORE UPDATE ON user_book_highlights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_notes_updated_at BEFORE UPDATE ON user_book_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_quotes_updated_at BEFORE UPDATE ON user_book_quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert the "Lean In" book with complete content
INSERT INTO library_books (
    id,
    title,
    author,
    description,
    cover_image,
    category,
    difficulty,
    estimated_reading_time,
    tags,
    is_featured,
    total_chapters,
    total_pages,
    language,
    publication_year,
    rating
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'Lean In: Women, Work, and the Will to Lead',
    'Sheryl Sandberg',
    'Una guía poderosa para mujeres que buscan alcanzar sus ambiciones profesionales y personales. Sandberg examina por qué el progreso de las mujeres en el liderazgo se ha estancado, explica las causas fundamentales y ofrece soluciones prácticas y factibles para que las mujeres puedan lograr sus objetivos.',
    '/books/lean-in.jpg',
    'Liderazgo',
    'Intermediate',
    240,
    ARRAY['liderazgo', 'mujeres', 'carrera', 'desarrollo profesional', 'igualdad'],
    true,
    4,
    224,
    'es',
    2013,
    4.2
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    author = EXCLUDED.author,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Insert chapters for "Lean In" with proper UUIDs
INSERT INTO book_chapters (id, book_id, chapter_number, title, content, word_count, estimated_reading_time) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440101',
    '550e8400-e29b-41d4-a716-446655440001',
    1,
    'La conversación interna',
    'Mi abuela Rosalind Einhorn nació exactamente cincuenta y dos años antes que yo, el 28 de agosto de 1917. Como muchas mujeres de su generación, mi abuela se definía por su marido y sus hijos. Nunca trabajó fuera de casa ni tuvo una cuenta bancaria a su nombre. Sin embargo, mi abuela era una mujer extraordinaria que influyó profundamente en mi vida.

Cuando tenía cinco años, mi abuela me enseñó a jugar al gin rummy, y pronto me convertí en una oponente formidable. Cada vez que la visitaba, jugábamos partida tras partida, y ella me dejaba ganar solo ocasionalmente. Cuando cumplí nueve años, mi abuela me anunció que ya no me dejaría ganar nunca más. "Tienes que aprender a perder", me dijo, "porque en la vida no siempre vas a ganar". Esa lección se quedó conmigo.

Mi abuela también me enseñó sobre la importancia de la educación. Aunque ella nunca tuvo la oportunidad de ir a la universidad, valoraba enormemente el aprendizaje. Me contaba historias sobre mujeres que habían logrado cosas extraordinarias y me animaba a soñar en grande. "Puedes ser lo que quieras ser", me decía, "pero tienes que trabajar duro para conseguirlo".

A medida que crecí, me di cuenta de que las mujeres de la generación de mi abuela habían enfrentado limitaciones que yo no tendría que enfrentar. Tenían menos oportunidades educativas, menos opciones profesionales y menos control sobre sus propias vidas. Sin embargo, muchas de estas mujeres encontraron formas de ejercer influencia y hacer contribuciones significativas dentro de las limitaciones de su tiempo.

Cuando comencé mi carrera profesional, asumí que las barreras que habían enfrentado las mujeres de generaciones anteriores ya no existían. Creía que si trabajaba duro y hacía un buen trabajo, sería recompensada en consecuencia. Pronto descubrí que la realidad era más complicada.

En mis primeros trabajos, noté que las mujeres a menudo se comportaban de manera diferente a los hombres en las reuniones. Tendían a hablar menos, a disculparse más y a ser menos asertivas al presentar sus ideas. Al principio, pensé que esto era simplemente una cuestión de personalidad individual, pero con el tiempo me di cuenta de que había patrones más amplios en juego.

La "conversación interna" se refiere a los mensajes que nos decimos a nosotras mismas sobre nuestras capacidades, nuestro valor y nuestro lugar en el mundo. Para muchas mujeres, esta conversación interna está llena de dudas y limitaciones autoimpuestas. Nos preguntamos si somos lo suficientemente inteligentes, lo suficientemente experimentadas o lo suficientemente calificadas para asumir nuevos desafíos.

Esta conversación interna negativa no surge de la nada. Es el resultado de años de mensajes sutiles y no tan sutiles de la sociedad sobre lo que las mujeres pueden y deben hacer. Desde una edad temprana, a las niñas se les enseña a ser agradables, a no destacar demasiado y a poner las necesidades de otros antes que las propias.

Estos mensajes se refuerzan a lo largo de nuestras vidas de maneras que a menudo ni siquiera notamos. En la escuela, los maestros pueden llamar más a los niños que a las niñas. En el lugar de trabajo, las mujeres pueden ser penalizadas por ser demasiado agresivas o demasiado ambiciosas. En los medios de comunicación, vemos representaciones limitadas de lo que significa ser una mujer exitosa.

El resultado es que muchas mujeres internalizan estos mensajes y desarrollan lo que los psicólogos llaman "síndrome del impostor": la sensación persistente de que no merecemos nuestros logros y que eventualmente seremos "descubiertas" como fraudes.

Para cambiar esta conversación interna, primero debemos tomar conciencia de ella. Debemos prestar atención a los pensamientos que tenemos sobre nosotras mismas y cuestionar aquellos que son limitantes o negativos. Cuando nos encontremos pensando "No soy lo suficientemente buena para este trabajo" o "No tengo suficiente experiencia", debemos detenernos y preguntarnos: ¿Es esto realmente cierto? ¿O es simplemente el resultado de años de condicionamiento social?

También debemos ser conscientes de cómo nuestras acciones reflejan nuestra conversación interna. Si constantemente nos disculpamos por nuestras opiniones o minimizamos nuestros logros, estamos enviando el mensaje de que no valoramos nuestras propias contribuciones.

Cambiar la conversación interna no es fácil, pero es posible. Requiere práctica consciente y, a menudo, el apoyo de otros. Necesitamos rodearnos de personas que nos animen a perseguir nuestros objetivos y que nos desafíen cuando nos limitamos a nosotras mismas.

Mi abuela nunca tuvo la oportunidad de "inclinarse hacia adelante" en su carrera profesional porque las opciones simplemente no existían para las mujeres de su generación. Pero me enseñó lecciones valiosas sobre la perseverancia, la importancia de la educación y el valor de creer en una misma. Estas lecciones me han servido bien a lo largo de mi carrera, y espero poder transmitirlas a la próxima generación de mujeres.',
    1247,
    62
),
(
    '550e8400-e29b-41d4-a716-446655440102',
    '550e8400-e29b-41d4-a716-446655440001',
    2,
    'Siéntate a la mesa',
    'En 2005, fui invitada a dar una charla en una conferencia de mujeres en tecnología. Era relativamente nueva en Google en ese momento, y estaba emocionada por la oportunidad de hablar sobre mi experiencia en la industria tecnológica. Preparé cuidadosamente mi presentación, esperando inspirar a otras mujeres a perseguir carreras en tecnología.

Después de mi charla, una mujer joven se me acercó. Era brillante, articulada y claramente apasionada por la tecnología. Pero cuando comenzó a hablar sobre sus objetivos profesionales, noté algo preocupante. Constantemente se subestimaba a sí misma, hablaba sobre lo que no sabía en lugar de lo que sí sabía, y parecía más enfocada en las razones por las que podría no tener éxito que en las razones por las que podría tenerlo.

Esta conversación me hizo reflexionar sobre un patrón que había observado repetidamente a lo largo de mi carrera: las mujeres a menudo no se "sientan a la mesa" literalmente y figurativamente. En las reuniones, tienden a sentarse en las sillas alrededor de la mesa de conferencias en lugar de en la mesa misma. Cuando se les ofrece oportunidades, a menudo dudan en tomarlas, preguntándose si están realmente calificadas.

El concepto de "sentarse a la mesa" va más allá de la ubicación física en una sala de reuniones. Se trata de tener la confianza para participar plenamente, para hacer que tu voz sea escuchada y para tomar tu lugar como un miembro igual del equipo.

He observado este fenómeno en innumerables situaciones. En Harvard Business School, donde estudié mi MBA, noté que las mujeres participaban menos en las discusiones de clase, a pesar de estar igualmente preparadas y ser igualmente inteligentes que sus compañeros masculinos. En el lugar de trabajo, he visto a mujeres talentosas rechazar promociones porque no se sienten "listas", mientras que los hombres con calificaciones similares o incluso menores aceptan esos mismos roles sin dudarlo.

Esta reticencia a "sentarse a la mesa" tiene raíces profundas. Desde una edad temprana, a las niñas se les enseña a ser modestas y a no presumir. Se les dice que es más importante ser queridas que ser respetadas. Estos mensajes, aunque a menudo bien intencionados, pueden tener consecuencias duraderas en la forma en que las mujeres se ven a sí mismas y en cómo navegan por sus carreras profesionales.

La investigación respalda estas observaciones. Los estudios muestran que las mujeres subestiman sistemáticamente su propio rendimiento, mientras que los hombres tienden a sobreestimarlo. Cuando se les pregunta sobre sus calificaciones para un trabajo, las mujeres tienden a enumerar las habilidades que no tienen, mientras que los hombres se enfocan en las que sí tienen.

Esta diferencia en la autoconfianza tiene implicaciones reales para el avance profesional. Si no creemos que merecemos estar en la mesa, es menos probable que busquemos oportunidades de liderazgo. Si no hablamos en las reuniones, nuestras ideas no serán escuchadas. Si no negociamos por nosotras mismas, es menos probable que recibamos la compensación que merecemos.

Pero "sentarse a la mesa" no se trata solo de confianza individual. También se trata de cambiar las estructuras y culturas organizacionales que pueden hacer que las mujeres se sientan menos bienvenidas o menos valoradas. Los líderes tienen la responsabilidad de crear entornos donde todas las voces sean escuchadas y valoradas.

Esto significa prestar atención a quién habla en las reuniones y asegurarse de que todos tengan la oportunidad de contribuir. Significa reconocer y abordar los sesgos inconscientes que pueden influir en cómo evaluamos el rendimiento y el potencial. Significa crear políticas y prácticas que apoyen a todos los empleados, independientemente de su género.

Para las mujeres que luchan por encontrar su lugar en la mesa, mi consejo es comenzar pequeño pero comenzar. Habla en la próxima reunión, incluso si es solo para hacer una pregunta. Ofrécete como voluntaria para liderar un proyecto, incluso si no te sientes completamente preparada. Aplica para ese trabajo, incluso si no cumples con todos los requisitos enumerados.

También es importante buscar aliados y mentores que puedan ayudarte a navegar por los desafíos únicos que enfrentan las mujeres en el lugar de trabajo. Estos pueden ser tanto hombres como mujeres que entienden la importancia de la diversidad y la inclusión y que están dispuestos a abogar por ti.

Recuerda que sentarse a la mesa no es un acto de arrogancia o egoísmo. Es un reconocimiento de tu propio valor y una afirmación de tu derecho a participar plenamente en tu carrera y en tu vida. Cuando las mujeres se sientan a la mesa, no solo se benefician ellas mismas, sino que también abren el camino para otras mujeres que vendrán después.

La mesa es lo suficientemente grande para todos nosotros. Es hora de que las mujeres tomen su lugar en ella.',
    1156,
    58
),
(
    '550e8400-e29b-41d4-a716-446655440103',
    '550e8400-e29b-41d4-a716-446655440001',
    3,
    'El éxito y la simpatía',
    'En 2003, dos profesores de la Universidad de Columbia, Frank Flynn y Cameron Anderson, decidieron realizar un experimento fascinante. Tomaron un estudio de caso de Harvard Business School sobre una empresaria exitosa llamada Heidi Roizen, una capitalista de riesgo en Silicon Valley conocida por su extensa red de contactos y su habilidad para hacer negocios.

Los profesores crearon dos versiones idénticas del estudio de caso. En una versión, la protagonista se llamaba Heidi Roizen. En la otra, cambiaron el nombre a Howard Roizen. Todo lo demás permaneció exactamente igual: los logros, las estrategias de networking, los resultados comerciales.

Luego presentaron estos estudios de caso a dos grupos de estudiantes y les pidieron que evaluaran tanto la competencia como la simpatía del protagonista. Los resultados fueron reveladores y perturbadores.

Ambos grupos calificaron a Heidi y Howard como igualmente competentes. Esto tenía sentido, ya que sus logros eran idénticos. Sin embargo, cuando se trataba de simpatía, los resultados fueron dramáticamente diferentes. Los estudiantes encontraron a Howard más simpático que a Heidi. Describieron a Howard como alguien con quien les gustaría trabajar, mientras que veían a Heidi como egoísta y "no el tipo de persona que contratarías o para quien trabajarías".

Este experimento ilustra perfectamente uno de los dilemas más desafiantes que enfrentan las mujeres en el lugar de trabajo: el conflicto entre el éxito y la simpatía. Para los hombres, el éxito y la simpatía están positivamente correlacionados. Cuanto más exitoso es un hombre, más simpático tiende a parecer. Para las mujeres, la relación es exactamente la opuesta. Cuanto más exitosa es una mujer, menos simpática puede parecer.

Este fenómeno tiene raíces profundas en nuestras expectativas sociales sobre cómo deben comportarse las mujeres. Desde una edad temprana, se espera que las niñas sean cariñosas, serviciales y orientadas hacia otros. Se les enseña a ser "buenas niñas" que no causan problemas y que ponen las necesidades de otros antes que las propias.

Cuando las mujeres exhiben las mismas cualidades de liderazgo que admiramos en los hombres - asertividad, ambición, decisión - a menudo son percibidas negativamente. Son etiquetadas como "mandonas", "agresivas" o "difíciles". Esta doble moral crea un dilema imposible: las mujeres necesitan ser asertivas para tener éxito, pero ser asertiva puede hacer que sean menos queridas.

He experimentado este dilema personalmente a lo largo de mi carrera. En mis primeros trabajos, a menudo luchaba con cómo presentar mis ideas de manera que fueran tomadas en serio sin parecer demasiado agresiva. Aprendí a suavizar mi lenguaje, a hacer preguntas en lugar de declaraciones, y a dar crédito a otros incluso cuando las ideas eran mías.

Estas estrategias a veces funcionaban, pero también tenían costos. Al suavizar mi comunicación, a veces mis ideas no eran tomadas tan en serio como podrían haberlo sido. Al dar crédito a otros, a veces no recibía el reconocimiento que merecía por mi trabajo.

La investigación muestra que este dilema afecta a las mujeres en todas las etapas de sus carreras. En las evaluaciones de desempeño, las mujeres son más propensas a recibir comentarios sobre su "estilo de comunicación" o su "presencia ejecutiva", mientras que los hombres reciben comentarios más específicos sobre sus logros y resultados.

En las negociaciones salariales, las mujeres enfrentan una penalización particular. Cuando los hombres negocian por salarios más altos, son vistos como asertivos y orientados a objetivos. Cuando las mujeres hacen lo mismo, pueden ser percibidas como codiciosas o poco razonables. Esta percepción puede llevar a que las mujeres eviten negociar por completo, lo que contribuye a la brecha salarial de género.

El dilema del éxito y la simpatía también afecta cómo las mujeres son percibidas como líderes. Los estudios muestran que cuando las mujeres están en posiciones de autoridad, a menudo enfrentan más resistencia y cuestionamiento que sus contrapartes masculinas. Sus decisiones son más propensas a ser desafiadas, y su competencia es más propensa a ser cuestionada.

Entonces, ¿cómo pueden las mujeres navegar por este dilema? No hay respuestas fáciles, pero hay estrategias que pueden ayudar.

Primero, es importante ser consciente del dilema y entender que no es un defecto personal, sino un sesgo sistémico. Cuando enfrentamos reacciones negativas por ser asertivas, no significa que estemos haciendo algo mal. Significa que estamos desafiando expectativas sociales profundamente arraigadas.

Segundo, podemos buscar formas de ser asertivas mientras mantenemos la calidez y la conexión con otros. Esto podría significar explicar nuestro razonamiento detrás de las decisiones difíciles, mostrar empatía por cómo nuestras acciones afectan a otros, o encontrar formas de enmarcar nuestros logros en términos de beneficios para el equipo o la organización.

Tercero, podemos buscar aliados que entiendan estos desafíos y que estén dispuestos a abogar por nosotras. A veces, tener a alguien más que presente nuestras ideas o que hable sobre nuestros logros puede ser más efectivo que hacerlo nosotras mismas.

Finalmente, debemos trabajar para cambiar las expectativas y normas sociales que crean este dilema en primer lugar. Esto significa desafiar los estereotipos sobre cómo deben comportarse las mujeres, celebrar a las mujeres que son asertivas y exitosas, y crear culturas organizacionales que valoren tanto la competencia como la colaboración.

El dilema del éxito y la simpatía es real y desafiante, pero no es insuperable. Al entenderlo y trabajar juntos para abordarlo, podemos crear un mundo donde las mujeres no tengan que elegir entre ser exitosas y ser queridas.',
    1298,
    65
),
(
    '550e8400-e29b-41d4-a716-446655440104',
    '550e8400-e29b-41d4-a716-446655440001',
    4,
    'Es una jungla ahí afuera: Busca mentores y patrocinadores',
    'Cuando comencé mi carrera en McKinsey & Company como consultora recién graduada, me sentía como si hubiera entrado en un mundo completamente nuevo. El ritmo era frenético, las expectativas eran altas, y parecía que todos los demás sabían exactamente lo que estaban haciendo mientras yo luchaba por mantenerme al día.

Fue durante esos primeros meses desafiantes que conocí a alguien que cambiaría el curso de mi carrera: Larry Summers, quien en ese momento era el Secretario del Tesoro. Larry se convirtió en más que un jefe; se convirtió en un mentor que me desafió, me apoyó y me ayudó a navegar por las complejidades del mundo profesional.

La diferencia entre un mentor y un patrocinador es crucial, aunque a menudo se confunden. Un mentor es alguien que te da consejos, te ayuda a desarrollar habilidades y te proporciona orientación sobre tu carrera. Un patrocinador, por otro lado, es alguien que aboga activamente por ti, que usa su influencia para ayudarte a avanzar y que está dispuesto a apostar su reputación por tu éxito.

Larry fue ambos para mí. Como mentor, me enseñó a pensar de manera más estratégica, a comunicar mis ideas de manera más efectiva y a tener confianza en mis capacidades. Como patrocinador, me dio oportunidades que no habría tenido de otra manera y habló positivamente de mi trabajo a otros líderes.

La importancia de tener mentores y patrocinadores no puede ser subestimada, especialmente para las mujeres. La investigación muestra que las mujeres son menos propensas que los hombres a tener patrocinadores, y esta diferencia contribuye significativamente a la brecha de género en el liderazgo.

Hay varias razones por las que las mujeres pueden tener más dificultades para encontrar mentores y patrocinadores. Primero, dado que la mayoría de los líderes senior siguen siendo hombres, puede haber menos modelos a seguir naturales para las mujeres. Segundo, tanto los hombres como las mujeres pueden sentirse más cómodos mentoreando a personas que se parecen a ellos, lo que puede crear barreras invisibles para las mujeres.

Además, existe lo que los investigadores llaman el "problema de la percepción". Los hombres senior pueden ser más cautelosos sobre mentorear a mujeres jóvenes debido a preocupaciones sobre cómo podría ser percibida la relación por otros. Esta cautela, aunque comprensible, puede privar a las mujeres de oportunidades valiosas de desarrollo.

Para las mujeres que buscan mentores y patrocinadores, mi consejo es ser proactiva y estratégica. No esperes a que alguien se acerque a ti; busca activamente relaciones que puedan ser mutuamente beneficiosas.

Primero, identifica a las personas en tu organización o industria que admiras y de las que podrías aprender. Estas no tienen que ser necesariamente las personas en los niveles más altos; a menudo, alguien que está uno o dos niveles por encima de ti puede ser un mentor muy efectivo porque recuerda más vívidamente los desafíos que estás enfrentando.

Segundo, piensa en lo que puedes ofrecer a cambio. Las mejores relaciones de mentoría son bidireccionales. Tal vez puedas ofrecer perspectivas sobre nuevas tecnologías, insights sobre mercados más jóvenes, o simplemente energía y entusiasmo frescos.

Tercero, sé específica sobre lo que estás buscando. En lugar de pedir vagamente "mentoría", pide consejos sobre desafíos específicos o oportunidades para observar y aprender. Esto hace que sea más fácil para los mentores potenciales entender cómo pueden ayudarte.

También es importante reconocer que no todos los mentores y patrocinadores serán mujeres, y eso está bien. Algunos de mis mentores más influyentes han sido hombres que entendieron la importancia de la diversidad y que estaban comprometidos con ayudar a las mujeres a tener éxito.

Para los líderes que están en posición de ser mentores y patrocinadores, mi mensaje es simple: hazlo. El mentoría y el patrocinio no son solo actos de generosidad; son inversiones en el futuro de tu organización y tu industria.

Si eres un hombre que está considerando mentorear a una mujer, no dejes que las preocupaciones sobre la percepción te detengan. Mantén las interacciones profesionales, sé transparente sobre tus intenciones, y enfócate en el desarrollo profesional. Los beneficios de la diversidad en el liderazgo son demasiado importantes como para dejar que la incomodidad social los obstaculice.

Para las organizaciones, es crucial crear estructuras formales que faciliten el mentoría y el patrocinio. Esto podría incluir programas de mentoría estructurados, oportunidades de networking entre niveles, y métricas que rastreen el desarrollo y avance de empleados diversos.

También debemos reconocer que el mentoría y el patrocinio pueden tomar muchas formas. No siempre se trata de relaciones uno-a-uno a largo plazo. Puede ser tan simple como dar retroalimentación constructiva después de una presentación, hacer una introducción valiosa, o hablar positivamente sobre el trabajo de alguien en una reunión donde esa persona no está presente.

Una de las cosas más poderosas que un patrocinador puede hacer es ayudar a amplificar la voz de alguien. En las reuniones, esto podría significar repetir y dar crédito a una buena idea que una mujer acaba de compartir, o asegurarse de que las mujeres en el equipo tengan oportunidades de presentar su trabajo a audiencias importantes.

El mentoría y el patrocinio también deben extenderse más allá de las fronteras organizacionales. Algunas de las relaciones más valiosas que he tenido han sido con personas fuera de mi empresa inmediata que pudieron ofrecer perspectivas diferentes y conexiones más amplias.

Finalmente, es importante recordar que ser mentoreado es solo el primer paso. A medida que avanzas en tu carrera, tienes la responsabilidad de extender la mano y ayudar a otros. El mentoría y el patrocinio crean un círculo virtuoso: cuando ayudamos a otros a tener éxito, fortalecemos toda la red.

La jungla profesional puede ser desafiante de navegar, especialmente para las mujeres que enfrentan obstáculos únicos. Pero con los mentores y patrocinadores adecuados, y con nuestro propio compromiso de ayudar a otros, podemos crear caminos más claros hacia el éxito para todos.',
    1456,
    73
) ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    word_count = EXCLUDED.word_count,
    estimated_reading_time = EXCLUDED.estimated_reading_time;

-- Update the book's total chapters count
UPDATE library_books 
SET total_chapters = 4, 
    updated_at = NOW() 
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- Verification queries
SELECT 'Books created:' as status, COUNT(*) as count FROM library_books;
SELECT 'Chapters created:' as status, COUNT(*) as count FROM book_chapters;
SELECT 'Total content length:' as status, SUM(LENGTH(content)) as total_chars FROM book_chapters;

-- Success message
SELECT 'Enhanced library system setup completed successfully!' as message;
