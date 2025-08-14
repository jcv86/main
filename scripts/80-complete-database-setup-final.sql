-- Complete database setup script
-- This script creates all tables and data from scratch

-- 1. Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if they exist (in correct order to avoid foreign key issues)
DROP TABLE IF EXISTS public.user_book_notes CASCADE;
DROP TABLE IF EXISTS public.user_book_bookmarks CASCADE;
DROP TABLE IF EXISTS public.user_book_progress CASCADE;
DROP TABLE IF EXISTS public.library_book_chapters CASCADE;
DROP TABLE IF EXISTS public.library_books CASCADE;
DROP TABLE IF EXISTS public.mirix_memories CASCADE;
DROP TABLE IF EXISTS public.calendar_events CASCADE;
DROP TABLE IF EXISTS public.user_goals CASCADE;
DROP TABLE IF EXISTS public.coaching_conversations CASCADE;
DROP TABLE IF EXISTS public.cv_data CASCADE;
DROP TABLE IF EXISTS public.personality_tests CASCADE;
DROP TABLE IF EXISTS public.skill_assessments CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. Create profiles table first (no foreign keys)
CREATE TABLE public.profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create library_books table (no foreign keys)
CREATE TABLE public.library_books (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    category TEXT,
    difficulty TEXT CHECK (difficulty IN ('Principiante', 'Intermedio', 'Avanzado')),
    estimated_reading_time INTEGER DEFAULT 240,
    pages INTEGER,
    published_year INTEGER,
    rating DECIMAL(3,2) DEFAULT 4.0,
    tags TEXT[],
    key_topics TEXT[],
    is_recommended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create library_book_chapters table (references library_books)
CREATE TABLE public.library_book_chapters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    book_id UUID NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    word_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, "order")
);

-- 6. Create tables that reference profiles
CREATE TABLE public.skill_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_type TEXT NOT NULL,
    score INTEGER NOT NULL,
    assessment_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.personality_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL,
    results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.cv_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    personal_info JSONB,
    experience JSONB,
    education JSONB,
    skills JSONB,
    languages JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.coaching_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT,
    messages JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.user_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    target_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.calendar_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.mirix_memories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    memory_type TEXT DEFAULT 'general',
    importance_score INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create tables that reference both profiles and books
CREATE TABLE public.user_book_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
    current_chapter INTEGER DEFAULT 1,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    reading_time_minutes INTEGER DEFAULT 0,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

CREATE TABLE public.user_book_bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.library_book_chapters(id) ON DELETE CASCADE,
    position INTEGER DEFAULT 0,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.user_book_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.library_book_chapters(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_book_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_book_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mirix_memories ENABLE ROW LEVEL SECURITY;

-- 9. Create simple RLS policies
CREATE POLICY "Public access" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Public access" ON public.skill_assessments FOR ALL USING (true);
CREATE POLICY "Public access" ON public.personality_tests FOR ALL USING (true);
CREATE POLICY "Public access" ON public.cv_data FOR ALL USING (true);
CREATE POLICY "Public access" ON public.user_book_progress FOR ALL USING (true);
CREATE POLICY "Public access" ON public.user_book_bookmarks FOR ALL USING (true);
CREATE POLICY "Public access" ON public.user_book_notes FOR ALL USING (true);
CREATE POLICY "Public access" ON public.coaching_conversations FOR ALL USING (true);
CREATE POLICY "Public access" ON public.user_goals FOR ALL USING (true);
CREATE POLICY "Public access" ON public.calendar_events FOR ALL USING (true);
CREATE POLICY "Public access" ON public.mirix_memories FOR ALL USING (true);

-- Books are public for reading
CREATE POLICY "Anyone can view books" ON public.library_books FOR SELECT USING (true);
CREATE POLICY "Anyone can view chapters" ON public.library_book_chapters FOR SELECT USING (true);

-- 10. Insert sample demo user
INSERT INTO public.profiles (id, email, full_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo@example.com', 'Usuario Demo', 'user');

-- 11. Insert sample books
INSERT INTO public.library_books (id, title, author, description, cover_image, category, difficulty, estimated_reading_time, pages, published_year, rating) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Hábitos Atómicos', 'James Clear', 'Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos.', '/books/atomic-habits.jpg', 'Desarrollo Personal', 'Principiante', 240, 320, 2018, 4.8),
('550e8400-e29b-41d4-a716-446655440002', 'Los 7 Hábitos de la Gente Altamente Efectiva', 'Stephen R. Covey', 'Lecciones poderosas de cambio personal que han inspirado a millones.', '/books/7-habits.jpg', 'Liderazgo', 'Intermedio', 360, 432, 1989, 4.7),
('550e8400-e29b-41d4-a716-446655440003', 'Trabajo Profundo', 'Cal Newport', 'Reglas para el éxito enfocado en un mundo distraído.', '/books/deep-work.jpg', 'Productividad', 'Intermedio', 280, 304, 2016, 4.6),
('550e8400-e29b-41d4-a716-446655440004', 'Inteligencia Emocional', 'Daniel Goleman', 'Por qué es más importante que el cociente intelectual.', '/books/emotional-intelligence.jpg', 'Psicología', 'Intermedio', 320, 384, 1995, 4.5),
('550e8400-e29b-41d4-a716-446655440005', 'Lean In', 'Sheryl Sandberg', 'Las mujeres, el trabajo y la voluntad de liderar.', '/books/lean-in.jpg', 'Liderazgo', 'Intermedio', 280, 240, 2013, 4.4);

-- 12. Insert chapters for Hábitos Atómicos
INSERT INTO public.library_book_chapters (id, book_id, title, content, "order", word_count) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'El Poder Sorprendente de los Hábitos Atómicos', 
'Los hábitos son el interés compuesto del auto-mejoramiento. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican mientras los repites.

Un cambio que parece pequeño e insignificante al principio se convertirá en algo significativo si te apegas a él durante años. Aquí radica el poder de los hábitos atómicos: pequeños cambios que generan resultados extraordinarios.

Los hábitos son una espada de doble filo. Pueden trabajar a tu favor o en tu contra, por eso entender los detalles es crucial. Los pequeños cambios a menudo parecen no hacer diferencia hasta que cruzas un umbral crítico.

En los primeros años de tu carrera, la diferencia entre buenos y malos hábitos parece pequeña, pero conforme pasa el tiempo, estas pequeñas mejoras o declives se acumulan, y de repente encuentras una gran brecha entre las personas que tienen buenos hábitos y aquellas que no.

El éxito es el producto de hábitos diarios, no transformaciones de una sola vez. Lo que importa es si tus hábitos te están poniendo en el camino hacia el éxito. Deberías estar más preocupado por tu trayectoria actual que por tus resultados actuales.

Los hábitos pueden ser difíciles de cambiar porque: 1) Tratamos de cambiar la cosa equivocada, 2) Tratamos de cambiar nuestros hábitos de la manera equivocada. En este libro, abordaremos ambos puntos.

Imagina que tienes una moneda sucia y decides pulirla cada día. El primer día, todavía se ve sucia. El segundo día, sigue sucia. El tercer día, no hay cambio visible. Pero sigues puliendo. El día 10, el día 20, el día 30... todavía no hay cambios dramáticos. Luego, un día, la moneda comienza a brillar. ¿Fue el trabajo del día 31 lo que causó el cambio? No, fue el trabajo acumulativo de todos los días anteriores.

Este es el poder de los hábitos atómicos. Los cambios que parecen pequeños e insignificantes al principio se convertirán en resultados notables si estás dispuesto a mantenerte con ellos durante años. Todos obtenemos lo que repetimos.

Si quieres mejores resultados, entonces olvídate de establecer metas. Enfócate en tu sistema en su lugar. Los ganadores y los perdedores tienen las mismas metas. La diferencia está en los sistemas. Las metas son sobre los resultados que quieres lograr. Los sistemas son sobre los procesos que llevan a esos resultados.

Los hábitos son como los átomos de nuestras vidas. Cada uno es una unidad fundamental que contribuye a tu mejora general. Al principio, estos pequeños cambios a menudo parecen no hacer diferencia hasta que cruzas un umbral crítico. Los efectos más poderosos de cualquier proceso de cambio compuesto siempre se retrasan. Necesitas ser paciente.', 1, 1800),

('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', 'Cómo Tus Hábitos Moldean Tu Identidad (y Viceversa)', 
'Cambiar nuestros hábitos es desafiante por dos razones: 1) tratamos de cambiar la cosa equivocada y 2) tratamos de cambiar nuestros hábitos de la manera equivocada.

Hay tres capas de cambio de comportamiento: cambios en tus resultados, cambios en tus procesos, o cambios en tu identidad. Los resultados son sobre lo que obtienes. Los procesos son sobre lo que haces. La identidad es sobre lo que crees.

La mayoría de las personas comienzan con los resultados que quieren lograr. Esto puede funcionar por un tiempo hasta que una crisis de motivación golpea. Cuando tu comportamiento y tu identidad están desalineados, nunca durarás.

La alternativa es construir hábitos basados en la identidad. Con este enfoque, comenzamos enfocándonos en quién deseamos llegar a ser, no en lo que queremos lograr.

Tu identidad emerge de tus hábitos. Cada acción es un voto por el tipo de persona que deseas llegar a ser. Ninguna instancia individual transformará tus creencias, pero conforme los votos se acumulan, también lo hace la evidencia de tu nueva identidad.

Este es un proceso gradual. Cualquier cambio significativo requiere prueba. Los hábitos son el camino por el cual desarrollas esa prueba. Cada vez que escribes una página, eres un escritor. Cada vez que practicas el violín, eres un músico.

El proceso de construcción de hábitos es en realidad el proceso de convertirte en ti mismo. Los hábitos importan porque te ayudan a convertirte en el tipo de persona que deseas ser. Son el canal a través del cual desarrollas tus creencias más profundas sobre ti mismo.

La forma más práctica de cambiar quién eres es cambiar lo que haces. Cada vez que escribes una página, eres un escritor. Cada vez que practicas el violín, eres un músico. Cada vez que empiezas un entrenamiento, eres un atleta. Cada vez que alientas a tus empleados, eres un líder.

Cada acción que tomas es un voto por el tipo de persona que deseas llegar a ser. Ninguna instancia individual transformará tus creencias, pero conforme los votos se acumulan, también lo hace la evidencia de tu nueva identidad. Esta es una de las razones por las que el cambio significativo no requiere cambios radicales. Los pequeños cambios en el comportamiento pueden hacer una diferencia significativa en cómo te ves a ti mismo y a otros te ven.

El objetivo no es leer un libro, el objetivo es convertirse en un lector. El objetivo no es correr un maratón, el objetivo es convertirse en un corredor. El objetivo no es aprender un instrumento, el objetivo es convertirse en un músico.

Tus comportamientos son usualmente un reflejo de tu identidad. Lo que haces es una indicación del tipo de persona que crees que eres, ya sea consciente o inconscientemente. La investigación ha demostrado que una vez que una persona cree en un aspecto particular de su identidad, estará motivada para actuar de manera alineada con esa creencia.

El proceso funciona en ambas direcciones: tu identidad influye en tus hábitos y tus hábitos influyen en tu identidad. Es un ciclo de retroalimentación de dos vías. Cuanto más repites un comportamiento, más refuerzas la identidad asociada con ese comportamiento.', 2, 1750),

('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440001', 'Cómo Construir Mejores Hábitos en 4 Pasos Simples', 
'En 1898, un psicólogo llamado Edward Thorndike realizó un experimento que cambiaría la forma en que pensamos sobre la formación de hábitos. Thorndike estaba interesado en estudiar el comportamiento animal, así que construyó un laberinto llamado "caja de rompecabezas". Colocó un gato dentro de la caja, que estaba diseñada para que el gato pudiera escapar a través de una puerta, pero solo si presionaba una palanca en la secuencia correcta.

Al principio, los gatos se movían alrededor de la caja al azar. Arañaban las paredes y olfateaban los rincones. Luego, por casualidad, pisarían la palanca, la puerta se abriría, y escaparían. Thorndike rastreó el comportamiento de cada gato a lo largo del tiempo. En las primeras pruebas, los animales se movían alrededor de la caja durante mucho tiempo antes de encontrar la palanca. Pero cada vez que realizaban la prueba, escapaban un poco más rápido.

Lo que Thorndike descubrió fue la Ley del Efecto, que establece que "las respuestas que producen un efecto satisfactorio en una situación particular se vuelven más probables de ocurrir nuevamente en esa situación, y las respuestas que producen un efecto incómodo se vuelven menos probables de ocurrir nuevamente en esa situación."

En otras palabras, los comportamientos seguidos de consecuencias satisfactorias tienden a repetirse y aquellos que producen consecuencias desagradables son menos probables de repetirse. Thorndike describió esto como la Ley del Efecto porque el efecto de un comportamiento determina la probabilidad de que el comportamiento se repita en el futuro.

Décadas más tarde, este trabajo influenció a un joven profesor en Harvard llamado B.F. Skinner, quien fue uno de los psicólogos más influyentes del siglo XX. Skinner se dio cuenta de que nuestros comportamientos están determinados por cómo esperamos que otros respondan a nuestras acciones. Somos más propensos a repetir un comportamiento cuando la respuesta es satisfactoria.

Esto nos lleva a una pregunta importante: ¿cómo podemos diseñar un bucle de hábitos que sea satisfactorio? Los científicos han estado haciendo esta pregunta durante años, y ahora tenemos una respuesta bastante buena.

El proceso de construcción de un hábito se puede dividir en cuatro pasos simples: señal, anhelo, respuesta y recompensa. Esta descomposición de cuatro pasos se llama el Bucle del Hábito.

La señal desencadena tu cerebro para iniciar un comportamiento. Es un poco de información que predice una recompensa. Nuestros ancestros prehistóricos prestaban atención a las señales que indicaban la ubicación de recompensas primarias como comida, agua y sexo.

Los anhelos son la fuerza motivacional detrás de cada hábito. Sin algún nivel de motivación o deseo, sin anhelo, no tenemos razón para actuar. Lo que anhelas no es el hábito en sí, sino el cambio de estado que entrega.

La respuesta es el hábito real que realizas, que puede tomar la forma de un pensamiento o una acción. Si una respuesta requiere más esfuerzo físico o mental del que estás dispuesto a gastar, no lo harás.

Las recompensas son el objetivo final de cada hábito. La señal es sobre notar la recompensa. El anhelo es sobre querer la recompensa. La respuesta es sobre obtener la recompensa. Perseguimos recompensas porque sirven dos propósitos: 1) nos satisfacen y 2) nos enseñan.', 3, 1900);

-- 13. Insert chapters for Los 7 Hábitos
INSERT INTO public.library_book_chapters (id, book_id, title, content, "order", word_count) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', 'Paradigmas y Principios', 
'La forma en que vemos el problema es el problema. Tenemos que mirar hacia adentro, a nuestros paradigmas y motivos.

Un paradigma es una teoría, un modelo o un marco de referencia. Es la manera en que "vemos" el mundo, no en términos de nuestro sentido de la vista, sino en términos de percepción, comprensión e interpretación.

Los paradigmas son poderosos porque crean los cristales o las lentes a través de los cuales vemos el mundo. El poder de un cambio de paradigma es el poder esencial de un cambio cuántico, ya sea instantáneo o lento y deliberado.

Todos tenemos muchos mapas en nuestras cabezas, que pueden dividirse en dos categorías principales: mapas de la forma en que son las cosas, o realidades, y mapas de la forma en que deberían ser, o valores. Interpretamos todo lo que experimentamos a través de estos mapas mentales.

El punto clave aquí es que todos vemos el mundo, no como es, sino como somos nosotros, o como estamos condicionados para verlo. Cuando abrimos nuestras bocas para describir lo que vemos, en efecto nos describimos a nosotros mismos, a nuestras percepciones, a nuestros paradigmas.

Los principios son como faros. Son leyes naturales que no pueden romperse. Como dijo Cecil B. DeMille sobre los principios contenidos en su película épica Los Diez Mandamientos: "Es imposible para nosotros romper la ley. Solo podemos rompernos a nosotros mismos contra la ley."

Los principios no son prácticas. Una práctica es una actividad o acción específica. Una práctica que funciona en una circunstancia no necesariamente funcionará en otra. Los principios son verdades profundas, fundamentales, verdades clásicas, denominadores comunes.

Los principios son directrices para la conducta humana que han demostrado tener un valor duradero y permanente. Son fundamentales. Son esencialmente indiscutibles porque son evidentes por sí mismos. Un ejemplo rápido sería el principio de equidad, del cual las personas de todo el mundo están conscientes.

La equidad o justicia es un principio. Si construyes tu vida familiar, tu vida de trabajo y tu vida en la comunidad en el principio de respeto por todos los seres humanos, tendrás estabilidad, felicidad y unidad.

Los principios no son valores. Una pandilla de ladrones puede compartir valores, pero están violando los principios fundamentales que tenemos en común. Los principios son el territorio. Los valores son mapas. Cuando valoramos principios correctos, tenemos la verdad, un conocimiento de las cosas como realmente son.

Los principios son leyes naturales en la dimensión humana que son tan reales, tan inmutables y tan indiscutiblemente "ahí" como la ley de la gravedad en la dimensión física. Estos principios se tejen en el tejido de cada sociedad civilizada a lo largo de la historia y constituyen las raíces de cada familia e institución que ha perdurado y prosperado.

El grado en que las personas en una sociedad reconocen y viven en armonía con principios básicos como equidad, integridad, honestidad y dignidad humana determina tanto la supervivencia individual como social.', 1, 1600),

('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440002', 'Hábito 1: Ser Proactivo - Los Principios de la Visión Personal', 
'Entre el estímulo y la respuesta, el hombre tiene la libertad de elegir. En esa elección radica nuestro crecimiento y nuestra felicidad.

Ser proactivo significa que como seres humanos, somos responsables de nuestras propias vidas. Nuestro comportamiento es una función de nuestras decisiones, no de nuestras condiciones. Podemos subordinar los sentimientos a los valores.

Las personas proactivas se enfocan sus esfuerzos en su Círculo de Influencia. Trabajan en las cosas con las que pueden hacer algo. La naturaleza de su energía es positiva, ampliadora y magnificadora, causando que su Círculo de Influencia aumente.

Las personas reactivas, por otro lado, se enfocan sus esfuerzos en el Círculo de Preocupación. Se enfocan en la debilidad de otras personas, los problemas en el ambiente, y circunstancias sobre las cuales no tienen control. Su energía negativa, combinada con su negligencia en las áreas en las que podrían hacer algo, causa que su Círculo de Influencia se encoja.

Mientras trabajamos en nuestro Círculo de Influencia, gradualmente lo expandimos. Pero si nos enfocamos en nuestro Círculo de Preocupación, nuestro Círculo de Influencia se encoge.

El lenguaje reactivo se convierte en una profecía que se cumple a sí misma. Las personas se sienten cada vez más víctimas, fuera de control, no responsables, operando en base a los sentimientos de otras personas, circunstancias y condiciones.

El lenguaje proactivo proviene de un paradigma básico de determinismo. Es el lenguaje de la responsabilidad, la elección, y la acción positiva.

La palabra responsabilidad, "response-ability", es la habilidad de elegir tu respuesta. Las personas altamente proactivas reconocen esa responsabilidad. No culpan a las circunstancias, condiciones o condicionamiento por su comportamiento. Su comportamiento es un producto de su propia elección consciente, basada en valores, en lugar de un producto de sus condiciones, basado en sentimientos.

Porque somos por naturaleza proactivos, si nuestras vidas son una función de condicionamiento y condiciones, es porque hemos, por elección consciente o por defecto, elegido empoderar esas cosas para controlarnos.

Al elegir nuestras respuestas a las circunstancias, poderosa mente afectamos nuestras circunstancias. Cuando cambiamos una parte de la ecuación química, cambiamos la naturaleza de toda la ecuación.

Ser proactivo no significa ser insistente, agresivo o insensible. Significa ser responsable de hacer que las cosas sucedan. Los líderes proactivos entienden que "responsabilidad" significa la habilidad de elegir la respuesta. Usan esa habilidad para elegir respuestas que están basadas en principios y que traen resultados positivos.

Tomar la iniciativa no significa ser molesto, agresivo o insensible. Significa reconocer nuestra responsabilidad de hacer que las cosas sucedan. Durante años, he trabajado con personas en situaciones de negocios, universitarias y matrimoniales para ayudarles a ser más proactivos.', 2, 1550);

-- 14. Insert sample goals
INSERT INTO public.user_goals (user_id, title, description, category, target_date, status, progress) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Completar Certificación en Gestión de Proyectos', 'Obtener la certificación PMP para avanzar en mi carrera profesional', 'Educación', '2024-06-30', 'active', 25),
('550e8400-e29b-41d4-a716-446655440000', 'Leer 12 Libros de Desarrollo Personal', 'Leer un libro por mes para crecimiento personal y profesional', 'Desarrollo Personal', '2024-12-31', 'active', 33),
('550e8400-e29b-41d4-a716-446655440000', 'Mejorar Habilidades de Liderazgo', 'Participar en talleres y aplicar técnicas de liderazgo en el trabajo', 'Carrera', '2024-09-15', 'active', 60),
('550e8400-e29b-41d4-a716-446655440000', 'Dominar Excel Avanzado', 'Completar curso de Excel avanzado para análisis de datos', 'Habilidades Técnicas', '2024-04-30', 'completed', 100),
('550e8400-e29b-41d4-a716-446655440000', 'Networking Profesional', 'Asistir a 6 eventos de networking este año', 'Carrera', '2024-12-31', 'active', 50);

-- 15. Insert sample calendar events
INSERT INTO public.calendar_events (user_id, title, description, start_time, end_time, event_type) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Reunión de Equipo Semanal', 'Revisión de progreso y planificación de tareas', '2024-01-22 09:00:00+00', '2024-01-22 10:00:00+00', 'work'),
('550e8400-e29b-41d4-a716-446655440000', 'Sesión de Coaching Profesional', 'Sesión mensual con coach de carrera', '2024-01-25 14:00:00+00', '2024-01-25 15:30:00+00', 'development'),
('550e8400-e29b-41d4-a716-446655440000', 'Taller de Habilidades Blandas', 'Workshop sobre comunicación efectiva y trabajo en equipo', '2024-01-30 10:00:00+00', '2024-01-30 16:00:00+00', 'training'),
('550e8400-e29b-41d4-a716-446655440000', 'Presentación de Proyecto', 'Presentar resultados del proyecto Q4 al equipo directivo', '2024-02-05 15:00:00+00', '2024-02-05 16:30:00+00', 'work'),
('550e8400-e29b-41d4-a716-446655440000', 'Conferencia de Liderazgo', 'Conferencia anual sobre tendencias en liderazgo empresarial', '2024-02-15 08:00:00+00', '2024-02-15 18:00:00+00', 'conference');

-- 16. Insert sample book progress
INSERT INTO public.user_book_progress (user_id, book_id, current_chapter, progress_percentage, reading_time_minutes, last_read_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 2, 45, 120, NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 1, 15, 45, NOW() - INTERVAL '1 week');

-- 17. Insert sample personality test results
INSERT INTO public.personality_tests (user_id, test_type, results) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'soft_skills', '{"communication": 85, "teamwork": 78, "leadership": 72, "problem_solving": 88, "adaptability": 80, "time_management": 75, "creativity": 82, "emotional_intelligence": 79}'),
('550e8400-e29b-41d4-a716-446655440000', 'big_five', '{"openness": 75, "conscientiousness": 82, "extraversion": 68, "agreeableness": 79, "neuroticism": 35}');

-- 18. Insert sample skill assessments
INSERT INTO public.skill_assessments (user_id, skill_type, score, assessment_data) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'technical', 78, '{"programming": 85, "data_analysis": 72, "project_management": 80, "digital_marketing": 65}'),
('550e8400-e29b-41d4-a716-446655440000', 'language', 90, '{"spanish": 100, "english": 85, "portuguese": 70}');

-- Success message
SELECT 'Database setup completed successfully!' as message,
       'Created all tables with proper foreign key relationships' as details,
       'Inserted sample data for demo user' as data_status;
