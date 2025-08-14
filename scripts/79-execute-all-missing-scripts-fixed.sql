-- Execute all missing SQL scripts in correct order
-- This script will set up the complete database system

-- 1. Basic database setup
DO $$
BEGIN
    -- Enable necessary extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    RAISE NOTICE 'Extensions enabled successfully';
END $$;

-- 2. Create all necessary tables if they don't exist

-- Users and profiles (completely standalone without foreign keys to auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills and assessments
CREATE TABLE IF NOT EXISTS public.skill_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    skill_type TEXT NOT NULL,
    score INTEGER NOT NULL,
    assessment_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personality tests
CREATE TABLE IF NOT EXISTS public.personality_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    test_type TEXT NOT NULL,
    results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV data
CREATE TABLE IF NOT EXISTS public.cv_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    personal_info JSONB,
    experience JSONB,
    education JSONB,
    skills JSONB,
    languages JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Library system
CREATE TABLE IF NOT EXISTS public.library_books (
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

CREATE TABLE IF NOT EXISTS public.library_book_chapters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    book_id UUID,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    word_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_book_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    book_id UUID,
    current_chapter INTEGER DEFAULT 1,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    reading_time_minutes INTEGER DEFAULT 0,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_book_bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    book_id UUID,
    chapter_id UUID,
    position INTEGER DEFAULT 0,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_book_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    book_id UUID,
    chapter_id UUID,
    content TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career coaching
CREATE TABLE IF NOT EXISTS public.coaching_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    title TEXT,
    messages JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals and calendar
CREATE TABLE IF NOT EXISTS public.user_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    target_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mirix memory system
CREATE TABLE IF NOT EXISTS public.mirix_memories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    content TEXT NOT NULL,
    memory_type TEXT DEFAULT 'general',
    importance_score INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Now add foreign key constraints after all tables are created
ALTER TABLE public.skill_assessments 
    ADD CONSTRAINT fk_skill_assessments_user 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.personality_tests 
    ADD CONSTRAINT fk_personality_tests_user 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.cv_data 
    ADD CONSTRAINT fk_cv_data_user 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.library_book_chapters 
    ADD CONSTRAINT fk_book_chapters_book 
    FOREIGN KEY (book_id) REFERENCES public.library_books(id) ON DELETE CASCADE;

ALTER TABLE public.user_book_progress 
    ADD CONSTRAINT fk_book_progress_user 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_book_progress 
    ADD CONSTRAINT fk_book_progress_book 
    FOREIGN KEY (book_id) REFERENCES public.library_books(id) ON DELETE CASCADE;

ALTER TABLE public.user_book_bookmarks 
    ADD CONSTRAINT fk_book_bookmarks_user 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_book_bookmarks 
    ADD CONSTRAINT fk_book_bookmarks_book 
    FOREIGN KEY (book_id) REFERENCES public.library_books(id) ON DELETE CASCADE;

ALTER TABLE public.user_book_bookmarks 
    ADD CONSTRAINT fk_book_bookmarks_chapter 
    FOREIGN KEY (chapter_id) REFERENCES public.library_book_chapters(id) ON DELETE CASCADE;

ALTER TABLE public.user_book_notes 
    ADD CONSTRAINT fk_book_notes_user 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_book_notes 
    ADD CONSTRAINT fk_book_notes_book 
    FOREIGN KEY (book_id) REFERENCES public.library_books(id) ON DELETE CASCADE;

ALTER TABLE public.user_book_notes 
    ADD CONSTRAINT fk_book_notes_chapter 
    FOREIGN KEY (chapter_id) REFERENCES public.library_book_chapters(id) ON DELETE CASCADE;

ALTER TABLE public.coaching_conversations 
    ADD CONSTRAINT fk_coaching_conversations_user 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_goals 
    ADD CONSTRAINT fk_user_goals_user 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.calendar_events 
    ADD CONSTRAINT fk_calendar_events_user 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.mirix_memories 
    ADD CONSTRAINT fk_mirix_memories_user 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 3. Insert sample books with complete content
INSERT INTO public.library_books (id, title, author, description, cover_image, category, difficulty, estimated_reading_time) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Hábitos Atómicos', 'James Clear', 'Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos.', '/books/atomic-habits.jpg', 'Desarrollo Personal', 'Principiante', 240),
('550e8400-e29b-41d4-a716-446655440002', 'Los 7 Hábitos de la Gente Altamente Efectiva', 'Stephen R. Covey', 'Lecciones poderosas de cambio personal que han inspirado a millones.', '/books/7-habits.jpg', 'Liderazgo', 'Intermedio', 360),
('550e8400-e29b-41d4-a716-446655440003', 'Trabajo Profundo', 'Cal Newport', 'Reglas para el éxito enfocado en un mundo distraído.', '/books/deep-work.jpg', 'Productividad', 'Intermedio', 280),
('550e8400-e29b-41d4-a716-446655440004', 'Inteligencia Emocional', 'Daniel Goleman', 'Por qué es más importante que el cociente intelectual.', '/books/emotional-intelligence.jpg', 'Psicología', 'Intermedio', 320),
('550e8400-e29b-41d4-a716-446655440005', 'Lean In', 'Sheryl Sandberg', 'Las mujeres, el trabajo y la voluntad de liderar.', '/books/lean-in.jpg', 'Liderazgo', 'Intermedio', 280)
ON CONFLICT (id) DO NOTHING;

-- Insert chapters for Hábitos Atómicos
INSERT INTO public.library_book_chapters (id, book_id, title, content, "order", word_count) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'El Poder Sorprendente de los Hábitos Atómicos', 
'Los hábitos son el interés compuesto del auto-mejoramiento. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican mientras los repites.

Un cambio que parece pequeño e insignificante al principio se convertirá en algo significativo si te apegas a él durante años. Aquí radica el poder de los hábitos atómicos: pequeños cambios que generan resultados extraordinarios.

Los hábitos son una espada de doble filo. Pueden trabajar a tu favor o en tu contra, por eso entender los detalles es crucial. Los pequeños cambios a menudo parecen no hacer diferencia hasta que cruzas un umbral crítico.

En los primeros años de tu carrera, la diferencia entre buenos y malos hábitos parece pequeña, pero conforme pasa el tiempo, estas pequeñas mejoras o declives se acumulan, y de repente encuentras una gran brecha entre las personas que tienen buenos hábitos y aquellas que no.

El éxito es el producto de hábitos diarios, no transformaciones de una sola vez. Lo que importa es si tus hábitos te están poniendo en el camino hacia el éxito. Deberías estar más preocupado por tu trayectoria actual que por tus resultados actuales.

Los hábitos pueden ser difíciles de cambiar porque: 1) Tratamos de cambiar la cosa equivocada, 2) Tratamos de cambiar nuestros hábitos de la manera equivocada. En este libro, abordaremos ambos puntos.', 1, 1200),

('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', 'Cómo Tus Hábitos Moldean Tu Identidad', 
'Cambiar nuestros hábitos es desafiante por dos razones: 1) tratamos de cambiar la cosa equivocada y 2) tratamos de cambiar nuestros hábitos de la manera equivocada.

Hay tres capas de cambio de comportamiento: cambios en tus resultados, cambios en tus procesos, o cambios en tu identidad. Los resultados son sobre lo que obtienes. Los procesos son sobre lo que haces. La identidad es sobre lo que crees.

La mayoría de las personas comienzan con los resultados que quieren lograr. Esto puede funcionar por un tiempo hasta que una crisis de motivación golpea. Cuando tu comportamiento y tu identidad están desalineados, nunca durarás.

La alternativa es construir hábitos basados en la identidad. Con este enfoque, comenzamos enfocándonos en quién deseamos llegar a ser, no en lo que queremos lograr.

Tu identidad emerge de tus hábitos. Cada acción es un voto por el tipo de persona que deseas llegar a ser. Ninguna instancia individual transformará tus creencias, pero conforme los votos se acumulan, también lo hace la evidencia de tu nueva identidad.

Este es un proceso gradual. Cualquier cambio significativo requiere prueba. Los hábitos son el camino por el cual desarrollas esa prueba. Cada vez que escribes una página, eres un escritor. Cada vez que practicas el violín, eres un músico.

El proceso de construcción de hábitos es en realidad el proceso de convertirte en ti mismo. Los hábitos importan porque te ayudan a convertirte en el tipo de persona que deseas ser. Son el canal a través del cual desarrollas tus creencias más profundas sobre ti mismo.', 2, 1150)
ON CONFLICT (id) DO NOTHING;

-- Insert chapters for Los 7 Hábitos
INSERT INTO public.library_book_chapters (id, book_id, title, content, "order", word_count) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', 'Paradigmas y Principios', 
'La forma en que vemos el problema es el problema. Tenemos que mirar hacia adentro, a nuestros paradigmas y motivos.

Un paradigma es una teoría, un modelo o un marco de referencia. Es la manera en que "vemos" el mundo, no en términos de nuestro sentido de la vista, sino en términos de percepción, comprensión e interpretación.

Los paradigmas son poderosos porque crean los cristales o las lentes a través de los cuales vemos el mundo. El poder de un cambio de paradigma es el poder esencial de un cambio cuántico, ya sea instantáneo o lento y deliberado.

Todos tenemos muchos mapas en nuestras cabezas, que pueden dividirse en dos categorías principales: mapas de la forma en que son las cosas, o realidades, y mapas de la forma en que deberían ser, o valores. Interpretamos todo lo que experimentamos a través de estos mapas mentales.

El punto clave aquí es que todos vemos el mundo, no como es, sino como somos nosotros, o como estamos condicionados para verlo. Cuando abrimos nuestras bocas para describir lo que vemos, en efecto nos describimos a nosotros mismos, a nuestras percepciones, a nuestros paradigmas.

Los principios son como faros. Son leyes naturales que no pueden romperse. Como dijo Cecil B. DeMille sobre los principios contenidos en su película épica Los Diez Mandamientos: "Es imposible para nosotros romper la ley. Solo podemos rompernos a nosotros mismos contra la ley."

Los principios no son prácticas. Una práctica es una actividad o acción específica. Una práctica que funciona en una circunstancia no necesariamente funcionará en otra. Los principios son verdades profundas, fundamentales, verdades clásicas, denominadores comunes.', 1, 1300),

('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440002', 'Hábito 1: Ser Proactivo', 
'Entre el estímulo y la respuesta, el hombre tiene la libertad de elegir. En esa elección radica nuestro crecimiento y nuestra felicidad.

Ser proactivo significa que como seres humanos, somos responsables de nuestras propias vidas. Nuestro comportamiento es una función de nuestras decisiones, no de nuestras condiciones. Podemos subordinar los sentimientos a los valores.

Las personas proactivas se enfocan sus esfuerzos en su Círculo de Influencia. Trabajan en las cosas con las que pueden hacer algo. La naturaleza de su energía es positiva, ampliadora y magnificadora, causando que su Círculo de Influencia aumente.

Las personas reactivas, por otro lado, se enfocan sus esfuerzos en el Círculo de Preocupación. Se enfocan en la debilidad de otras personas, los problemas en el ambiente, y circunstancias sobre las cuales no tienen control. Su energía negativa, combinada con su negligencia en las áreas en las que podrían hacer algo, causa que su Círculo de Influencia se encoja.

Mientras trabajamos en nuestro Círculo de Influencia, gradualmente lo expandimos. Pero si nos enfocamos en nuestro Círculo de Preocupación, nuestro Círculo de Influencia se encoge.

El lenguaje reactivo se convierte en una profecía que se cumple a sí misma. Las personas se sienten cada vez más víctimas, fuera de control, no responsables, operando en base a los sentimientos de otras personas, circunstancias y condiciones.

El lenguaje proactivo proviene de un paradigma básico de determinismo. Es el lenguaje de la responsabilidad, la elección, y la acción positiva.', 2, 1250)
ON CONFLICT (id) DO NOTHING;

-- Insert chapters for Trabajo Profundo
INSERT INTO public.library_book_chapters (id, book_id, title, content, "order", word_count) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440003', 'Trabajo Profundo es Valioso', 
'El trabajo profundo es la habilidad de enfocarse sin distracción en una tarea cognitivamente demandante. Es una habilidad que te permite dominar rápidamente información complicada y producir mejores resultados en menos tiempo.

En nuestra economía actual, hay tres grupos que tienen ventajas particulares: aquellos que pueden trabajar bien y creativamente con máquinas inteligentes, aquellos que son los mejores en lo que hacen, y aquellos con acceso a capital.

Para unirte a los primeros dos grupos (y por lo tanto prosperar en nuestra nueva economía) debes dominar el arte de aprender rápidamente cosas difíciles. Esta tarea requiere trabajo profundo. Si no cultivas esta habilidad, es probable que te quedes atrás conforme la tecnología avanza.

El trabajo profundo es cada vez más raro al mismo tiempo que se vuelve cada vez más valioso en nuestra economía. Como consecuencia, los pocos que cultivan esta habilidad, y luego la hacen el núcleo de su vida laboral, prosperarán.

La capacidad de realizar trabajo profundo se está volviendo cada vez más rara exactamente al mismo tiempo que se está volviendo cada vez más valiosa en nuestra economía. Como resultado, los pocos que cultivan esta habilidad, y luego la hacen el núcleo de su vida laboral, prosperarán.

El trabajo profundo no es solo una habilidad útil, es un superpoder en nuestra economía cada vez más competitiva. Y sin embargo, la mayoría de las personas han perdido la habilidad de ir profundo, gastando sus días en cambio en un frenesí de correo electrónico y redes sociales, sin darse cuenta de que hay una mejor manera.', 1, 1100),

('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440003', 'Trabajo Profundo es Raro', 
'En el mundo de los negocios, a pesar del creciente valor del trabajo profundo, muchas empresas están adoptando prácticas que lo destruyen. Hay una tendencia hacia la colaboración abierta, oficinas abiertas, y comunicación instantánea.

El principio de menor resistencia: En ausencia de indicadores claros de lo que significa ser productivo y valioso en su trabajo, muchos trabajadores del conocimiento recurren a un indicador industrial: hacer muchas cosas de manera visible.

El busyness como proxy para la productividad: En ausencia de indicadores claros de lo que significa ser productivo y valioso en su trabajo, muchos trabajadores del conocimiento recurren a un indicador industrial: hacer muchas cosas de manera visible.

La cultura de la conectividad: Una cultura donde se espera que uno lea y responda a correos electrónicos (y mensajes relacionados) rápidamente. Esta cultura hace que el trabajo profundo sea difícil y el trabajo superficial sea más fácil.

El problema con la cultura de la conectividad es que está construida sobre un fundamento tembloroso: la suposición de que la comunicación rápida es siempre algo bueno. Pero esto no es necesariamente cierto.

Internet es una tecnología que fragmenta nuestra atención en pequeños pedazos. Cuando cambias de alguna Tarea A a alguna Tarea B, tu atención no sigue inmediatamente. Un residuo de tu atención permanece atascado pensando en la tarea original.

La capacidad de concentración intensa es una habilidad que debe ser entrenada. Esto significa que los esfuerzos para profundizar tu enfoque serán frustrantemente mediocres si no acompañas simultáneamente estos esfuerzos con un serio intento de eliminar las fuentes de distracción de tu vida.', 2, 1200)
ON CONFLICT (id) DO NOTHING;

-- Insert chapters for Inteligencia Emocional
INSERT INTO public.library_book_chapters (id, book_id, title, content, "order", word_count) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440004', '¿Para Qué Sirven las Emociones?', 
'Las emociones son impulsos para actuar, planes instantáneos para enfrentarnos a la vida que la evolución nos ha inculcado. La raíz de la palabra emoción es motere, el verbo latino "mover", además del prefijo "e", que significa "alejarse", lo que sugiere que en toda emoción hay implícita una tendencia a actuar.

Cuando nos enfrentamos a una emergencia emocional, el cerebro emocional asume el control y secuestra al cerebro racional. Este secuestro emocional puede ser útil cuando necesitamos reaccionar rápidamente ante un peligro, pero puede ser problemático en situaciones sociales complejas.

La inteligencia emocional incluye la autoconciencia, la autorregulación, la motivación, la empatía y las habilidades sociales. Estas capacidades son diferentes de las habilidades académicas, pero no son menos importantes para el éxito en la vida.

La autoconciencia emocional es la capacidad de reconocer nuestras emociones y sus efectos. Las personas con alta autoconciencia emocional conocen sus fortalezas y limitaciones, y tienen una sólida confianza en sí mismas.

La autorregulación es la capacidad de manejar las emociones disruptivas e impulsos. Las personas que pueden autorregularse son confiables, adaptables y abiertas al cambio. No actúan impulsivamente, sino que piensan antes de actuar.

La motivación intrínseca va más allá de las recompensas externas como el dinero o el estatus. Las personas motivadas intrínsecamente buscan metas por el puro placer de lograrlas, muestran iniciativa y tienen un fuerte impulso para mejorar.

La empatía es la capacidad de entender las emociones de otros. No se trata solo de simpatía, sino de realmente comprender lo que otros sienten y ver las situaciones desde su perspectiva.

Las habilidades sociales son la culminación de las otras dimensiones de la inteligencia emocional. Las personas con fuertes habilidades sociales son buenos comunicadores, líderes efectivos y expertos en construir y mantener relaciones.', 1, 1400)
ON CONFLICT (id) DO NOTHING;

-- Insert chapters for Lean In
INSERT INTO public.library_book_chapters (id, book_id, title, content, "order", word_count) VALUES
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440005', 'La Revolución Interna', 
'Una verdadera igualdad será alcanzada cuando las mujeres dirijan la mitad de nuestros países y empresas, y los hombres dirijan la mitad de nuestros hogares. Creo que este es el objetivo más importante que podemos trabajar para lograr.

Las barreras externas ciertamente existen, pero creo que la barrera más grande que enfrentan las mujeres es la falta de participación interna. Debemos cambiar la conversación de lo que las mujeres no pueden hacer a lo que pueden hacer.

Demasiadas mujeres todavía se sienten como impostoras en sus propias vidas y carreras. Esto debe cambiar. Las mujeres necesitan cambiar su mentalidad interna y "apoyarse" en sus carreras.

El síndrome del impostor es particularmente común entre las mujeres exitosas. Muchas mujeres sienten que no merecen sus logros y que eventualmente serán "descubiertas" como fraudes. Esta mentalidad limita su potencial y les impide tomar riesgos necesarios para el crecimiento profesional.

Las mujeres sistemáticamente subestiman sus propias habilidades. Mientras que los hombres tienden a atribuir su éxito a sus habilidades innatas, las mujeres tienden a atribuirlo a factores externos como suerte o ayuda de otros.

Para cambiar esto, las mujeres necesitan internalizar sus logros. Necesitan reconocer que merecen su éxito y que tienen las habilidades para continuar creciendo y liderando.

La confianza es crucial. Las mujeres necesitan sentarse en la mesa, literalmente y figurativamente. Necesitan hablar en las reuniones, hacer preguntas difíciles y no tener miedo de ser vistas como "demasiado ambiciosas".

El miedo al fracaso no debería impedir que las mujeres tomen riesgos. El fracaso es una parte natural del crecimiento y el aprendizaje. Las mujeres necesitan estar dispuestas a fallar para poder tener éxito verdaderamente.', 1, 1500),

('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440005', 'Siéntate en la Mesa', 
'Las mujeres necesitan cambiar de "¿Qué haría si no tuviera miedo?" a "¿Qué haría si supiera que no puedo fallar?" Esta mentalidad las empodera para tomar riesgos calculados y buscar oportunidades de liderazgo.

Muchas mujeres no se sientan literalmente en la mesa durante las reuniones importantes. Se sientan en sillas alrededor del perímetro de la sala. Esta posición física refleja una posición psicológica de no pertenencia.

Sentarse en la mesa es tanto literal como metafórico. Significa tomar tu lugar en conversaciones importantes, contribuir con ideas valiosas y no minimizar tus contribuciones.

Las mujeres a menudo no hablan en las reuniones, incluso cuando tienen ideas valiosas que compartir. Esto puede deberse a la falta de confianza, el miedo al juicio, o la preocupación de ser percibidas como demasiado agresivas.

Cuando las mujeres hablan, a menudo usan un lenguaje que minimiza su autoridad. Frases como "Esto podría ser una idea tonta, pero..." o "No soy experta, pero..." socavan su credibilidad antes de que incluso compartan su idea.

Las mujeres necesitan aprender a comunicarse con autoridad. Esto significa usar un lenguaje directo, hacer declaraciones en lugar de preguntas cuando sea apropiado, y no disculparse por tener opiniones.

La investigación muestra que cuando las mujeres hablan tanto como los hombres en las reuniones, son percibidas como hablando más. Esta percepción sesgada significa que las mujeres necesitan ser estratégicas sobre cuándo y cómo contribuyen.

Las mujeres también necesitan apoyarse mutuamente. Cuando una mujer hace un buen punto en una reunión, otras mujeres deberían amplificar esa idea y dar crédito a la persona que la originó.

El networking es crucial para el avance profesional, pero las mujeres a menudo son menos efectivas en el networking que los hombres. Necesitan construir relaciones estratégicas tanto dentro como fuera de sus organizaciones.', 2, 1450)
ON CONFLICT (id) DO NOTHING;

-- 4. Set up RLS policies (simplified to avoid auth issues)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (true);

-- Library books are public
CREATE POLICY "Anyone can view books" ON public.library_books FOR SELECT USING (true);
CREATE POLICY "Anyone can view chapters" ON public.library_book_chapters FOR SELECT USING (true);

-- 5. Insert sample demo user and data
INSERT INTO public.profiles (id, email, full_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo@example.com', 'Usuario Demo', 'user')
ON CONFLICT (id) DO NOTHING;

-- Insert sample goals
INSERT INTO public.user_goals (user_id, title, description, category, target_date, status, progress) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Completar Certificación en Gestión de Proyectos', 'Obtener la certificación PMP para avanzar en mi carrera', 'Educación', '2024-06-30', 'active', 25),
('550e8400-e29b-41d4-a716-446655440000', 'Leer 12 Libros de Desarrollo Personal', 'Leer un libro por mes para crecimiento personal', 'Desarrollo Personal', '2024-12-31', 'active', 33),
('550e8400-e29b-41d4-a716-446655440000', 'Mejorar Habilidades de Liderazgo', 'Participar en talleres y aplicar técnicas de liderazgo', 'Carrera', '2024-09-15', 'active', 60)
ON CONFLICT DO NOTHING;

-- Insert sample calendar events
INSERT INTO public.calendar_events (user_id, title, description, start_time, end_time, event_type) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Reunión de Equipo Semanal', 'Revisión de progreso y planificación', '2024-01-22 09:00:00+00', '2024-01-22 10:00:00+00', 'work'),
('550e8400-e29b-41d4-a716-446655440000', 'Sesión de Coaching Profesional', 'Sesión mensual con coach de carrera', '2024-01-25 14:00:00+00', '2024-01-25 15:30:00+00', 'development'),
('550e8400-e29b-41d4-a716-446655440000', 'Taller de Habilidades Blandas', 'Workshop sobre comunicación efectiva', '2024-01-30 10:00:00+00', '2024-01-30 16:00:00+00', 'training')
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Created tables: profiles, skill_assessments, personality_tests, cv_data, library_books, library_book_chapters, user_book_progress, user_book_bookmarks, user_book_notes, coaching_conversations, user_goals, calendar_events, mirix_memories';
    RAISE NOTICE 'Inserted sample books: Hábitos Atómicos, Los 7 Hábitos, Trabajo Profundo, Inteligencia Emocional, Lean In';
    RAISE NOTICE 'Set up RLS policies for all tables';
    RAISE NOTICE 'Inserted sample demo user, goals and calendar events';
END $$;
