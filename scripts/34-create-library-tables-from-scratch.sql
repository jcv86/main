-- First, let's check what tables exist and their structure
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name IN ('books', 'user_book_progress', 'book_chapters', 'user_reading_stats')
ORDER BY table_name, ordinal_position;

-- Drop existing tables if they exist to recreate with correct structure
DROP TABLE IF EXISTS user_book_progress CASCADE;
DROP TABLE IF EXISTS book_chapters CASCADE;
DROP TABLE IF EXISTS user_reading_stats CASCADE;
DROP TABLE IF EXISTS books CASCADE;

-- Create books table with proper structure
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url VARCHAR(500),
    category VARCHAR(100),
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    pages INTEGER,
    published_year INTEGER,
    reading_time VARCHAR(50),
    difficulty VARCHAR(20) CHECK (difficulty IN ('Fácil', 'Intermedio', 'Avanzado')),
    tags TEXT[],
    key_topics TEXT[],
    is_recommended BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_book_progress table with correct column names
CREATE TABLE user_book_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    percentage INTEGER DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
    current_page INTEGER DEFAULT 0,
    total_pages INTEGER,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- Create book_chapters table
CREATE TABLE book_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(book_id, chapter_number)
);

-- Create user_reading_stats table
CREATE TABLE user_reading_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    books_read INTEGER DEFAULT 0,
    total_reading_time INTEGER DEFAULT 0, -- in minutes
    reading_streak INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_book_progress_user_id ON user_book_progress(user_id);
CREATE INDEX idx_user_book_progress_book_id ON user_book_progress(book_id);
CREATE INDEX idx_book_chapters_book_id ON book_chapters(book_id);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_difficulty ON books(difficulty);
CREATE INDEX idx_books_is_recommended ON books(is_recommended);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for books (public read access)
CREATE POLICY "Books are viewable by everyone" ON books
    FOR SELECT USING (true);

CREATE POLICY "Books are insertable by authenticated users" ON books
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Books are updatable by authenticated users" ON books
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for user_book_progress
CREATE POLICY "Users can view their own progress" ON user_book_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_book_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_book_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON user_book_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for book_chapters (public read access)
CREATE POLICY "Book chapters are viewable by everyone" ON book_chapters
    FOR SELECT USING (true);

CREATE POLICY "Book chapters are insertable by authenticated users" ON book_chapters
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Book chapters are updatable by authenticated users" ON book_chapters
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for user_reading_stats
CREATE POLICY "Users can view their own stats" ON user_reading_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON user_reading_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON user_reading_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample books
INSERT INTO books (
    title, author, description, cover_url, category, rating, pages, 
    published_year, reading_time, difficulty, tags, key_topics, is_recommended
) VALUES 
(
    'Hábitos Atómicos',
    'James Clear',
    'Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos. James Clear nos brinda estrategias prácticas que nos enseñarán exactamente cómo formar buenos hábitos, romper los malos, y dominar los pequeños comportamientos que llevan a resultados notables.',
    '/placeholder.svg?height=300&width=200&text=Hábitos+Atómicos',
    'Productividad',
    4.8,
    320,
    2018,
    '5h 20min',
    'Fácil',
    ARRAY['hábitos', 'productividad', 'autoayuda', 'psicología', 'cambio', 'comportamiento'],
    ARRAY['Formación de hábitos', 'Cambio de comportamiento', 'Mejora continua', 'Sistemas vs objetivos', 'Identidad y hábitos'],
    true
),
(
    'Los 7 Hábitos de la Gente Altamente Efectiva',
    'Stephen R. Covey',
    'Un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales. Covey revela un proceso paso a paso para vivir con equidad, integridad, honestidad y dignidad humana.',
    '/placeholder.svg?height=300&width=200&text=7+Hábitos',
    'Liderazgo',
    4.7,
    432,
    1989,
    '7h 12min',
    'Intermedio',
    ARRAY['liderazgo', 'efectividad', 'principios', 'carácter', 'desarrollo personal'],
    ARRAY['Proactividad', 'Liderazgo personal', 'Gestión personal', 'Beneficio mutuo', 'Comunicación empática'],
    true
),
(
    'Trabajo Profundo',
    'Cal Newport',
    'Reglas para el éxito enfocado en un mundo distraído. Newport argumenta que la capacidad de concentrarse sin distracciones en una tarea cognitivamente exigente es una habilidad que se está volviendo cada vez más valiosa en nuestra economía.',
    '/placeholder.svg?height=300&width=200&text=Trabajo+Profundo',
    'Productividad',
    4.6,
    304,
    2016,
    '5h 4min',
    'Avanzado',
    ARRAY['concentración', 'productividad', 'tecnología', 'enfoque', 'distracción'],
    ARRAY['Concentración profunda', 'Distracción digital', 'Valor del trabajo', 'Filosofías de trabajo profundo'],
    false
),
(
    'Inteligencia Emocional',
    'Daniel Goleman',
    'Por qué es más importante que el cociente intelectual. Goleman explica cómo la inteligencia emocional puede ser fomentada y fortalecida en todos nosotros, y cómo esta habilidad determina nuestro éxito en las relaciones, el trabajo y hasta nuestro bienestar físico.',
    '/placeholder.svg?height=300&width=200&text=Inteligencia+Emocional',
    'Desarrollo Personal',
    4.5,
    384,
    1995,
    '6h 24min',
    'Intermedio',
    ARRAY['emociones', 'psicología', 'relaciones', 'autoconciencia', 'empatía'],
    ARRAY['Autoconciencia emocional', 'Autorregulación', 'Empatía', 'Habilidades sociales', 'Motivación'],
    true
),
(
    'Lean In',
    'Sheryl Sandberg',
    'Las mujeres, el trabajo y la voluntad de liderar. Sandberg examina por qué el progreso de las mujeres en el logro de roles de liderazgo se ha estancado, explica las causas fundamentales, y ofrece soluciones convincentes y prácticas.',
    '/placeholder.svg?height=300&width=200&text=Lean+In',
    'Liderazgo',
    4.4,
    240,
    2013,
    '4h 0min',
    'Fácil',
    ARRAY['liderazgo', 'mujeres', 'carrera', 'igualdad', 'trabajo', 'género'],
    ARRAY['Liderazgo femenino', 'Equilibrio trabajo-vida', 'Negociación', 'Confianza', 'Ambición'],
    false
),
(
    'Mindset: La Actitud del Éxito',
    'Carol S. Dweck',
    'La psicóloga de renombre mundial Carol Dweck descubrió una idea simple pero poderosa: el poder de la mentalidad. En este libro brillante, muestra cómo el éxito en la escuela, el trabajo, los deportes, las artes y casi todas las áreas de la actividad humana puede ser dramáticamente influenciado por cómo pensamos sobre nuestros talentos y habilidades.',
    '/placeholder.svg?height=300&width=200&text=Mindset',
    'Desarrollo Personal',
    4.6,
    276,
    2006,
    '5h 30min',
    'Intermedio',
    ARRAY['mentalidad', 'crecimiento', 'psicología', 'éxito', 'aprendizaje'],
    ARRAY['Mentalidad fija vs crecimiento', 'Aprendizaje continuo', 'Resiliencia', 'Feedback constructivo'],
    true
),
(
    'El Poder del Ahora',
    'Eckhart Tolle',
    'Para hacer el viaje hacia El Poder del Ahora necesitaremos dejar atrás nuestra mente analítica y su falso yo, el ego. Desde el comienzo del libro hasta el final, Tolle se mueve entre el mundo de la forma y el mundo del ser, entre el ego y la esencia, entre la mente pensante y la conciencia pura.',
    '/placeholder.svg?height=300&width=200&text=El+Poder+del+Ahora',
    'Desarrollo Personal',
    4.3,
    236,
    1997,
    '4h 45min',
    'Avanzado',
    ARRAY['mindfulness', 'espiritualidad', 'presente', 'conciencia', 'meditación'],
    ARRAY['Vivir en el presente', 'Conciencia plena', 'Liberación del ego', 'Paz interior'],
    false
),
(
    'Good to Great',
    'Jim Collins',
    'Jim Collins y su equipo de investigación han analizado las historias de 28 empresas, descubriendo por qué algunas hacen el salto y otras no. Los hallazgos incluyen disciplina, liderazgo de nivel 5, el concepto del erizo, una cultura de disciplina, aceleradores tecnológicos y un volante que construye impulso.',
    '/placeholder.svg?height=300&width=200&text=Good+to+Great',
    'Liderazgo',
    4.5,
    320,
    2001,
    '6h 15min',
    'Avanzado',
    ARRAY['liderazgo', 'empresas', 'excelencia', 'transformación', 'gestión'],
    ARRAY['Liderazgo nivel 5', 'Concepto del erizo', 'Cultura de disciplina', 'Transformación empresarial'],
    true
);

-- Get book IDs for inserting progress and chapters
DO $$
DECLARE
    book_atomic_habits_id UUID;
    book_7_habits_id UUID;
    book_deep_work_id UUID;
    book_emotional_id UUID;
    book_lean_in_id UUID;
    book_mindset_id UUID;
    book_power_now_id UUID;
    book_good_great_id UUID;
    demo_user_id UUID := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
    -- Get book IDs
    SELECT id INTO book_atomic_habits_id FROM books WHERE title = 'Hábitos Atómicos';
    SELECT id INTO book_7_habits_id FROM books WHERE title = 'Los 7 Hábitos de la Gente Altamente Efectiva';
    SELECT id INTO book_deep_work_id FROM books WHERE title = 'Trabajo Profundo';
    SELECT id INTO book_emotional_id FROM books WHERE title = 'Inteligencia Emocional';
    SELECT id INTO book_lean_in_id FROM books WHERE title = 'Lean In';
    SELECT id INTO book_mindset_id FROM books WHERE title = 'Mindset: La Actitud del Éxito';
    SELECT id INTO book_power_now_id FROM books WHERE title = 'El Poder del Ahora';
    SELECT id INTO book_good_great_id FROM books WHERE title = 'Good to Great';

    -- Insert user reading progress with correct column names
    INSERT INTO user_book_progress (user_id, book_id, percentage, current_page, total_pages, last_read_at) VALUES
    (demo_user_id, book_atomic_habits_id, 25, 80, 320, NOW() - INTERVAL '1 day'),
    (demo_user_id, book_7_habits_id, 100, 432, 432, NOW() - INTERVAL '7 days'),
    (demo_user_id, book_emotional_id, 75, 288, 384, NOW() - INTERVAL '2 days'),
    (demo_user_id, book_lean_in_id, 40, 96, 240, NOW() - INTERVAL '3 days'),
    (demo_user_id, book_mindset_id, 60, 165, 276, NOW() - INTERVAL '1 day'),
    (demo_user_id, book_deep_work_id, 15, 45, 304, NOW() - INTERVAL '5 days');

    -- Insert comprehensive book chapters
    INSERT INTO book_chapters (book_id, chapter_number, title, content) VALUES
    -- Hábitos Atómicos chapters
    (book_atomic_habits_id, 1, 'El Sorprendente Poder de los Hábitos Atómicos', 
     'Los hábitos son el interés compuesto de la mejora personal. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites. Parecen hacer poca diferencia en un día cualquiera y, sin embargo, el impacto que generan a lo largo de los meses y años puede ser enorme.

Es solo cuando miramos hacia atrás, dos, cinco o diez años después, que el valor de los buenos hábitos y el costo de los malos se vuelve asombrosamente aparente. Este es uno de los significados centrales de este libro: un pequeño cambio puede hacer una gran diferencia.

Los hábitos atómicos son pequeños hábitos que forman parte de un sistema más grande. Así como los átomos son los bloques de construcción de las moléculas, los hábitos atómicos son los bloques de construcción de resultados notables. Los hábitos son como los átomos de nuestras vidas. Cada uno es una unidad fundamental que contribuye a tu mejora general.

Si quieres mejores resultados, entonces olvídate de establecer metas. Enfócate en tu sistema en su lugar. Los ganadores y los perdedores tienen las mismas metas. La diferencia está en los sistemas. Las metas son buenas para establecer una dirección, pero los sistemas son mejores para hacer progreso real.

Un sistema de hábitos atómicos puede llevarte a nuevas alturas. Es solo una cuestión de saber cómo hacer que los hábitos trabajen para ti en lugar de en tu contra.'),
    
    (book_atomic_habits_id, 2, 'Cómo Tus Hábitos Moldean Tu Identidad (y Viceversa)', 
     'Hay tres niveles en los que puede ocurrir el cambio. Puedes imaginar que son como las capas de una cebolla.

El primer nivel es cambiar tus resultados. Este nivel se preocupa por cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato. La mayoría de las metas que te fijas están asociadas con este nivel de cambio.

El segundo nivel es cambiar tu proceso. Este nivel se preocupa por cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, organizar tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación. La mayoría de los hábitos que construyes están asociados con este nivel.

El tercer y más profundo nivel es cambiar tu identidad. Este nivel se preocupa por cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y sobre otros. La mayoría de las creencias, suposiciones y sesgos que tienes están asociados con este nivel.

Los resultados son sobre lo que obtienes. Los procesos son sobre lo que haces. La identidad es sobre lo que crees. Cuando se trata de construir hábitos duraderos, es decir, no solo por unas pocas semanas o meses, sino por años y décadas, la identidad es el nivel más profundo de cambio.

El verdadero cambio de comportamiento es cambio de identidad. Podrías comenzar un hábito debido a la motivación, pero la única razón por la que lo mantendrás es que se convierte en parte de tu identidad. Cualquiera puede convencerse de visitar el gimnasio o comer saludable una o dos veces, pero si no cambias la creencia detrás del comportamiento, entonces es difícil mantener el cambio a largo plazo.

Cada acción que tomas es un voto por el tipo de persona que deseas convertirte. Ninguna instancia individual transformará tus creencias, pero a medida que los votos se acumulan, también lo hace la evidencia de tu nueva identidad.'),
    
    (book_atomic_habits_id, 3, 'Cómo Construir Mejores Hábitos en 4 Simples Pasos', 
     'En 1898, un psicólogo llamado Edward Thorndike realizó un experimento que sentaría las bases para nuestro entendimiento de cómo se forman los hábitos. Thorndike estaba interesado en estudiar el comportamiento animal, así que construyó un laberinto llamado "caja rompecabezas".

Al principio, cada gato se movía alrededor de la caja al azar. Podría arañar las paredes o olfatear los rincones. Luego, por casualidad, presionaría la palanca correcta, la puerta se abriría, y el gato escaparía. En las pruebas sucesivas, cada gato se volvía un poco más rápido. Después de veinte o treinta intentos, los gatos podían escapar en unos pocos segundos.

Durante sus experimentos, Thorndike describió el proceso de aprendizaje diciendo: "Los comportamientos seguidos por consecuencias satisfactorias tienden a repetirse y aquellos que producen consecuencias desagradables son menos propensos a repetirse."

Este proceso dentro de nuestros cerebros es un bucle de retroalimentación de cuatro pasos: señal, anhelo, respuesta, recompensa. Y este ciclo es la columna vertebral de cada hábito.

La señal desencadena un anhelo, que motiva una respuesta, que proporciona una recompensa, que satisface el anhelo y, en última instancia, se asocia con la señal. Juntos, estos cuatro pasos forman un bucle de retroalimentación neurológica que en última instancia permite que se formen todos los hábitos humanos.

Este ciclo de cuatro pasos no es algo que ocurre de vez en cuando, sino más bien un bucle sin fin que se ejecuta cada momento que estás vivo. Incluso ahora, tu cerebro está monitoreando continuamente la situación interna y externa, buscando pistas de dónde están ubicadas las recompensas.

Podemos dividir estos cuatro pasos en dos fases: la fase del problema y la fase de la solución. La fase del problema incluye la señal y el anhelo, y es cuando te das cuenta de que algo necesita cambiar. La fase de la solución incluye la respuesta y la recompensa, y es cuando tomas acción y logras el cambio que deseas.'),

    -- Los 7 Hábitos chapters
    (book_7_habits_id, 1, 'Paradigmas y Principios', 
     'La forma en que vemos el problema es el problema. Covey nos introduce al concepto de paradigmas y cómo estos afectan nuestra percepción de la realidad y nuestras acciones.

Un paradigma es una teoría, un modelo o un marco de referencia. Es la manera en que "vemos" el mundo, no en términos de nuestro sentido de la vista, sino en términos de percepción, comprensión e interpretación. Para nuestros propósitos, una manera simple de entender los paradigmas es verlos como mapas.

Todos sabemos que "el mapa no es el territorio". Un mapa es simplemente una descripción de ciertos aspectos del territorio. Eso es exactamente lo que es un paradigma. Es una teoría, una explicación o un modelo de algo más.

Supongamos que quieres llegar a un lugar específico en el centro de Chicago. Un plano de la ciudad sería de gran ayuda. Pero supongamos que te dieran el mapa equivocado. Supongamos que te dieran un mapa de Detroit pero te dijeran que era un mapa de Chicago. ¿Puedes imaginar la frustración, la ineficacia de tratar de llegar a donde quieres ir?

Podrías trabajar en tu comportamiento: podrías tratar más duro, ser más diligente, duplicar tu velocidad. Pero tus esfuerzos solo te llevarían al lugar equivocado más rápido. Podrías trabajar en tu actitud: podrías pensar más positivamente. Aún no llegarías al lugar correcto, pero tal vez no te importaría.

El punto es, tendrías el mapa equivocado. Este libro es sobre tener el mapa correcto de la vida, un mapa basado en principios universales y atemporales. Los principios son como faros. Son leyes naturales que no pueden romperse.

Los principios no son prácticas. Una práctica es una actividad o acción específica. Una práctica que funciona en una circunstancia no necesariamente funcionará en otra. Los principios son verdades profundas, fundamentales, verdades clásicas, denominadores comunes. Son hebras estrechamente tejidas que atraviesan las telas de todas las familias duraderas y prósperas, organizaciones y sociedades a lo largo de la historia.'),
    
    (book_7_habits_id, 2, 'Los 7 Hábitos - Una Visión General', 
     'Nuestro carácter, básicamente, es un compuesto de nuestros hábitos. "Siembra un pensamiento, cosecha una acción; siembra una acción, cosecha un hábito; siembra un hábito, cosecha un carácter; siembra un carácter, cosecha un destino", dice el refrán.

Los hábitos son factores poderosos en nuestras vidas. Porque son patrones consistentes, a menudo inconscientes, constantemente expresan nuestro carácter y producen nuestra efectividad... o inefectividad.

Como Horace Mann, el gran educador, dijo una vez: "Los hábitos son como una cuerda. Tejemos un hilo cada día y pronto se vuelve tan fuerte que no podemos romperla." Pero algunos de nosotros encontramos que la cuerda que hemos tejido se ha convertido en una soga.

Los hábitos pueden ser aprendidos y desaprendidos. Pero sé que no es un proceso rápido o fácil. Involucra un compromiso tremendo y un proceso gradual.

Los 7 Hábitos de la Gente Altamente Efectiva presentan un enfoque "de adentro hacia afuera" del desarrollo personal y la efectividad. "De adentro hacia afuera" significa comenzar contigo mismo; aún más fundamentalmente, comenzar con las partes más internas de ti mismo: tus paradigmas, tu carácter y tus motivos.

Los primeros tres hábitos tratan del dominio propio. Se mueven de la dependencia a la independencia. Son las "victorias privadas", la esencia del desarrollo del carácter. Las victorias privadas preceden a las victorias públicas. No puedes invertir este proceso, así como no puedes cosechar antes de sembrar.

Los hábitos 4, 5 y 6 tratan de las relaciones con otros: trabajo en equipo, cooperación y comunicación. Estas son "victorias públicas".

El hábito 7 es el hábito de la renovación, un hábito de mejora continua que crea un espiral ascendente de crecimiento que te lleva a nuevos niveles de comprensión y vivir cada uno de los hábitos a medida que subes la espiral.'),

    -- Inteligencia Emocional chapters
    (book_emotional_id, 1, 'Para Qué Sirven las Emociones', 
     'Las emociones son impulsos para actuar, planes instantáneos para enfrentarnos a la vida que la evolución nos ha inculcado. La raíz de la palabra emoción es motere, el verbo latino "mover", además del prefijo "e", que implica "alejarse", lo que sugiere que en toda emoción hay implícita una tendencia a actuar.

Que las emociones conducen a la acción es muy obvio cuando observamos a los animales o a los niños; es solo en los adultos "civilizados" en los que tan a menudo encontramos la gran anomalía del reino animal: emociones divorciadas de reacciones.

En nuestro repertorio emocional, cada emoción juega un papel singular, como revela su distintiva "firma" biológica. Con nuevos métodos para mirar dentro del cuerpo y el cerebro, los investigadores están descubriendo más detalles fisiológicos de cómo cada emoción prepara al cuerpo para un tipo muy diferente de respuesta:

• Con la ira, la sangre fluye a las manos, haciendo más fácil empuñar un arma o golpear a un enemigo; el ritmo cardíaco se eleva y un aumento de hormonas como la adrenalina genera un pulso de energía lo suficientemente fuerte para una acción vigorosa.

• Con el miedo, la sangre va a los músculos del esqueleto grandes, como los de las piernas, haciendo más fácil huir, y el rostro se queda pálido cuando la sangre se desvía de él (creando la sensación de que la sangre "se hiela").

• En la felicidad, hay un aumento de actividad en un centro nervioso que inhibe los sentimientos negativos y fomenta un aumento en la energía disponible, y una quietud de aquellos que generan pensamientos preocupantes.

• Con el amor, los sentimientos de ternura y satisfacción sexual implican activación parasimpática, el opuesto fisiológico de la movilización "lucha o huida" que comparten el miedo y la ira.

• El levantar las cejas en sorpresa permite que entre más luz a la retina, lo que ofrece más información sobre el evento inesperado, haciendo más fácil descifrar exactamente lo que está sucediendo y idear el mejor plan de acción.

Estas tendencias biológicas a actuar están moldeadas además por nuestra experiencia de vida y nuestra cultura.'),
    
    (book_emotional_id, 2, 'Anatomía de un Secuestro Emocional', 
     'Fue en agosto de 1963, el día en que Martin Luther King Jr. pronunció su histórico discurso "Tengo un sueño" ante el Lincoln Memorial, cuando Richard Robles decidió cometer un crimen que lo convertiría en uno de los criminales más buscados de Nueva York.

Robles, un ladrón de carrera de veintidós años que acababa de salir de prisión tres meses antes, había decidido hacer un último trabajo antes de "volverse honesto" y casarse con su novia. El apartamento que eligió para robar en el Upper East Side de Manhattan parecía perfecto: los inquilinos, dos jóvenes mujeres, habían salido.

Pero cuando Robles estaba recogiendo los objetos de valor que había reunido, una de las mujeres, Janice Wylie, de veintiún años, regresó inesperadamente a casa. Robles la ató, pero luego entró en pánico cuando la segunda mujer, Emily Hoffert, de veintitrés años, también regresó. Para evitar ser identificado, Robles las mató a ambas.

La carrera criminal de Robles ilustra una verdad inquietante sobre la vida emocional: es en esos momentos cuando nos sentimos arrastrados por emociones que más tarde lamentamos, cuando estamos siendo secuestrados por nuestro cerebro límbico.

Este secuestro ocurre en un instante, desencadenando esta reacción crucial antes de que la mente racional, el neocórtex, haya tenido la oportunidad de vislumbrar completamente lo que está sucediendo, y mucho menos decidir si es una buena respuesta. El sello del secuestro es que una vez que el momento pasa, aquellos así arrebatados tienen la sensación distintiva de no saber lo que les pasó.

Estos secuestros no son accidentes fortuitos, sino que surgen de la arquitectura misma del cerebro emocional. En momentos de crisis emocional, el centro límbico del cerebro proclama una emergencia, reclutando el resto del cerebro a su urgente agenda. El secuestro ocurre en un instante, desencadenando esta reacción antes de que el neocórtex, la mente pensante, haya tenido la oportunidad de vislumbrar completamente lo que está sucediendo, y mucho menos decidir si es una buena respuesta.

La sede de todas las pasiones es la amígdala, un grupo de estructuras interconectadas con forma de almendra encaramadas sobre el tronco cerebral, cerca de la parte inferior del anillo límbico. En los seres humanos hay dos amígdalas, una a cada lado del cerebro, anidadas hacia el lado de la cabeza.'),

    -- Trabajo Profundo chapters
    (book_deep_work_id, 1, 'Trabajo Profundo: Una Habilidad Valiosa', 
     'En enero de 2014, el autor y columnista del New York Times David Brooks escribió un artículo titulado "La Filosofía de los Datos". El artículo argumentaba que estamos en medio de una revolución de datos que está transformando la forma en que entendemos y mejoramos el rendimiento en muchos campos.

Para ilustrar este punto, Brooks se centró en el mundo del béisbol profesional, donde el análisis estadístico sofisticado (conocido como "sabermetrics") había revolucionado la forma en que los equipos evaluaban y desarrollaban el talento. Pero luego Brooks hizo una observación interesante: esta revolución de datos, argumentó, no se había extendido a muchas otras áreas importantes de la vida humana.

"Tenemos estadísticas de béisbol más sofisticadas que estadísticas de crianza de niños", escribió Brooks. Esta observación captura algo importante sobre nuestro momento actual: estamos inundados de datos sobre algunos aspectos de nuestras vidas, mientras que permanecemos sorprendentemente ignorantes sobre otros aspectos igualmente importantes.

Creo que hay una habilidad que es particularmente valiosa en nuestra economía, pero que permanece mal entendida y, por lo tanto, mal cultivada. Llamo a esta habilidad "trabajo profundo", y la defino de la siguiente manera:

Trabajo Profundo: Actividades profesionales realizadas en un estado de concentración libre de distracciones que empujan tus capacidades cognitivas a su límite. Estos esfuerzos crean nuevo valor, mejoran tu habilidad y son difíciles de replicar.

El trabajo profundo es valioso. Vivimos en una economía de la información alimentada por nuestras capacidades para crear, procesar y comunicar información. Si no puedes aprender, no puedes prosperar. Y si no puedes producir, no serás recompensado sin importar cuán talentoso o bien intencionado seas.

Ahora conecta esto con el hecho de que, según varios estudios, el trabajador del conocimiento promedio verifica el correo electrónico cada seis minutos. O considera que, según una encuesta de Harvard Business Review, el ejecutivo promedio pasa veintitrés horas por semana en reuniones, sin contar las llamadas telefónicas, videoconferencias y otras formas de comunicación.

Estas estadísticas describen un mundo de trabajo donde la capacidad de mantener el enfoque y ir profundo se está volviendo cada vez más rara. Y al mismo tiempo, exactamente esta habilidad se está volviendo cada vez más valiosa en nuestra economía.'),

    -- Lean In chapters
    (book_lean_in_id, 1, 'La Revolución Interna', 
     'Hace unos años, una joven empleada muy talentosa de Facebook se acercó a mí después de una presentación que había dado. Mientras hablábamos, me dijo que aunque le encantaba su trabajo, también estaba considerando dejar la empresa. Le pregunté por qué, esperando escuchar que había recibido una oferta increíble de otra parte.

En cambio, me explicó que algún día quería tener hijos y había escuchado que trabajar en Facebook era demasiado demandante para permitir un equilibrio entre el trabajo y la vida personal.

"¿Cuándo planeas tener hijos?", le pregunté.

"Oh, en unos años", respondió. "Pero quiero ponerme en una trayectoria profesional más manejable ahora."

Me quedé atónita. Aquí había una mujer de veintipocos años que ya estaba limitando sus opciones profesionales para acomodar hijos hipotéticos en un futuro hipotético.

Desde esa conversación, he escuchado esta historia muchas veces. Las mujeres rara vez toman decisiones profesionales basadas únicamente en lo que quieren hacer o en lo que las haría más felices. En cambio, deciden qué hacer basándose en lo que creen que podrán hacer.

Antes de que una mujer tenga su primer hijo, y a menudo antes de que esté embarazada, o incluso antes de que esté en una relación seria, ella ya está haciendo acomodaciones para los hijos que espera tener algún día.

Esta es la revolución interna que necesitamos: las mujeres tienen que dejar de limitarse a sí mismas. Tenemos que dejar de evitar oportunidades antes de que nos sean ofrecidas. Tenemos que dejar de esperar que alguien más nos dé permiso para liderar. Tenemos que dejar de aceptar que los hombres serán los únicos que tomen las decisiones importantes.

Y tenemos que empezar a sentarnos a la mesa.'),
    
    (book_lean_in_id, 2, 'Siéntate a la Mesa', 
     'Hace varios años, fui invitada a realizar una presentación en una conferencia de tecnología. Había unas trescientas personas en la audiencia, y noté que las mujeres estaban sentadas en la parte de atrás y a los lados de la sala, mientras que los hombres ocupaban las filas del frente y del centro.

Antes de comenzar mi charla, les dije a las mujeres que se movieran hacia adelante y ocuparan los asientos vacíos en el frente. Nadie se movió. Así que hice la solicitud más específica: "Quiero que todas las mujeres se pongan de pie ahora mismo y vengan a sentarse en las primeras dos filas." Unas veinte mujeres se levantaron y se movieron hacia adelante.

Mi presentación se centró en la importancia de que las mujeres se "sienten a la mesa", tanto literal como figurativamente. Demasiadas mujeres, incluso cuando están calificadas, no se postulan para trabajos o buscan desafíos porque no creen que merezcan estar allí.

Demasiadas mujeres no hablan cuando deberían hacerlo. Como resultado, se quedan en la periferia, y los hombres en el centro toman las decisiones clave. Cuando las mujeres no se sientan a la mesa, pierden oportunidades de aprender, contribuir y liderar. Y cuando esto sucede, todos perdemos.

El primer paso para sentarse a la mesa es creer que perteneces allí. Esta creencia no es solo sobre tener confianza, aunque eso es importante. Es sobre reconocer que tu perspectiva es valiosa y que tienes algo único que ofrecer.

Muchas mujeres sienten que no están listas para sentarse a la mesa. Sienten que necesitan trabajar más duro, aprender más, o esperar hasta que alguien más las invite. Pero la verdad es que nadie se siente completamente listo. Los hombres no esperan hasta sentirse completamente preparados antes de postularse para un trabajo o buscar una promoción.

Las mujeres necesitan cambiar de "No estoy lista para hacer eso" a "Quiero hacer eso, y aprenderé haciendo".'),

    -- Mindset chapters
    (book_mindset_id, 1, 'Las Mentalidades', 
     'Cuando era solo una niña de seis años, algo sucedió que cambió mi vida. Mi maestra de primer grado, la Sra. Wilson, dividió la clase en dos grupos basándose en el coeficiente intelectual. Ella puso a los niños "inteligentes" en un lado del aula y a los niños "no tan inteligentes" en el otro lado.

Yo estaba en el lado "inteligente", y desde ese momento, todo lo que hice fue para mantener esa etiqueta. Cada tarea, cada examen, cada actividad se convirtió en una medida de si yo era realmente inteligente o no. Mi confianza se volvió frágil. ¿Qué pasaría si no era tan inteligente como pensaba?

Años más tarde, como psicóloga, me di cuenta de que había dos mentalidades que podían guiar nuestras vidas: la mentalidad fija y la mentalidad de crecimiento.

En una mentalidad fija, las personas creen que sus cualidades básicas, como su inteligencia o talento, son simplemente rasgos fijos. Pasan su tiempo documentando su inteligencia o talento en lugar de desarrollarlos. También creen que el talento solo crea el éxito, sin esfuerzo.

En una mentalidad de crecimiento, las personas creen que sus habilidades más básicas pueden desarrollarse a través de la dedicación y el trabajo duro: los cerebros y el talento son solo el punto de partida. Esta visión crea un amor por el aprendizaje y una resistencia que es esencial para grandes logros.

La mentalidad fija crea una urgencia interna de probarse a sí mismo una y otra vez. Si tienes solo una cierta cantidad de inteligencia, una cierta personalidad y un cierto carácter moral, entonces será mejor que pruebes que tienes una dosis saludable de ellos. Simplemente no se puede ver como si tuvieras una deficiencia en estas características más básicas.

La mentalidad de crecimiento se basa en la creencia de que tus cualidades básicas son cosas que puedes cultivar a través de tus esfuerzos, tus estrategias y la ayuda de otros. Aunque las personas pueden diferir en todos los sentidos, en sus talentos y aptitudes iniciales, intereses o temperamentos, todos pueden cambiar y crecer a través de la aplicación y la experiencia.

¿Crees que tu inteligencia es algo muy básico sobre ti que no puedes cambiar mucho? ¿O crees que puedes desarrollar sustancialmente tu inteligencia?'),

    -- El Poder del Ahora chapters
    (book_power_now_id, 1, 'No Eres Tu Mente', 
     'La mayor parte del dolor humano es innecesario. Es creado por ti mismo mientras la mente no observada dirige tu vida.

El dolor que creas ahora siempre surge de alguna forma de no aceptación, alguna forma de resistencia inconsciente a lo que es. En el nivel del pensamiento, la resistencia es alguna forma de juicio. En el nivel emocional, es alguna forma de negatividad. La intensidad del dolor depende del grado de resistencia al momento presente, y esto a su vez depende de qué tan fuertemente te identifiques con tu mente.

La mente es un instrumento soberbio si se usa correctamente. Sin embargo, si se usa incorrectamente, se vuelve muy destructiva. Para decirlo más precisamente, no es tanto que uses tu mente incorrectamente: usualmente no la usas en absoluto. Ella te usa a ti. Esta es la enfermedad. Crees que eres tu mente. Este es el engaño. El instrumento se ha apoderado de ti.

No me malinterpretes. No hay nada malo con el pensamiento. El error radica en identificarte con él, en derivar tu sentido del yo de él. La mente es un instrumento soberbio si se usa correctamente. Sin embargo, si se usa incorrectamente, se vuelve muy destructiva.

Cuando no te das cuenta de esta separación, te conviertes en un pensador compulsivo. Es decir, no puedes dejar de pensar. Esto es una aflicción, pero no te das cuenta de ello porque casi todos sufren de ella, por lo que se considera normal. Este ruido mental incesante te impide encontrar ese reino de quietud interior que es inseparable del Ser.

También crea un falso yo hecho de mente que proyecta una sombra de miedo y sufrimiento. Examinaremos todo esto más adelante.

El filósofo Descartes creía que había encontrado la verdad más fundamental cuando hizo su famosa declaración: "Pienso, luego existo." En realidad, había dado expresión al error más básico: equiparar el pensamiento con el Ser y la identidad con el pensamiento. El pensador compulsivo, que es prácticamente todo el mundo, vive en un estado de separación aparente, en un mundo insanamente complejo de problemas y conflictos continuos, un mundo que refleja la fragmentación cada vez mayor de la mente.'),

    -- Good to Great chapters
    (book_good_great_id, 1, 'Bueno es el Enemigo de lo Grandioso', 
     'Bueno es el enemigo de lo grandioso. Y esa es una de las razones clave por las que tenemos tan pocas cosas que se vuelven grandiosas.

No tenemos principalmente grandes escuelas, principalmente porque tenemos buenas escuelas. No tenemos principalmente un gran gobierno, principalmente porque tenemos un buen gobierno. Pocas personas llevan vidas grandiosas, en gran parte porque es muy fácil conformarse con una vida buena.

El vasto número de buenas compañías permanece así: simplemente buenas. Solo unas pocas compañías hacen la transición de buenas a grandiosas. Y de esas que lo hacen, aún menos permanecen grandiosas.

La búsqueda de lo grandioso no es solo un negocio de negocios. No importa si diriges una corporación, entrenas un equipo de fútbol americano, diriges un hospital, lideras una iglesia o enseñas en una escuela primaria, el desafío permanece igual: ¿Cómo tomas algo bueno y lo haces grandioso?

Más específicamente, ¿por qué algunas compañías hacen el salto de buenas a grandiosas mientras que otras no?

Durante cinco años, mi equipo de investigación y yo buscamos responder a esta pregunta. Buscamos compañías que hicieron un salto sustancial y lo sostuvieron. Compañías que rompieron a través del muro de la mediocridad para entregar resultados superiores, y siguieron entregando esos resultados por al menos quince años después del avance.

Encontramos solo once compañías que cumplían estos estrictos estándares. Para cada una de estas compañías "de buenas a grandiosas", seleccionamos la mejor compañía de comparación directa que no logró hacer el salto de buenas a grandiosas.

Luego estudiamos las compañías de contraste para entender qué distinguía a las compañías de buenas a grandiosas de las compañías de comparación. Los hallazgos fueron, en muchos casos, exactamente lo opuesto de lo que esperábamos.

Contrario a la sabiduría convencional, no encontramos que las compañías de buenas a grandiosas fueran más emprendedoras, más visionarias, más carismáticas, más agresivas, más propensas a tomar riesgos o más estimulantes que las compañías de comparación. De hecho, las compañías de buenas a grandiosas fueron más disciplinadas, más rigurosas y más determinadas.

Los ejecutivos que llevaron a las compañías de buenas a grandiosas no eran celebridades de alto perfil que llegaron de afuera con grandes visiones y planes audaces. En cambio, eran individuos algo autodidactas, más como Lincoln y Sócrates que como Patton o César.');

    -- Insert user reading statistics
    INSERT INTO user_reading_stats (user_id, books_read, total_reading_time, reading_streak, points, level, created_at, updated_at)
    VALUES (
        demo_user_id,
        12,
        2880, -- 48 hours in minutes
        15,
        2450,
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

-- Final verification queries
SELECT 'Library Setup Complete' as status;

SELECT 
    'Books Created' as category,
    COUNT(*) as count,
    string_agg(DISTINCT category, ', ') as categories,
    string_agg(DISTINCT difficulty, ', ') as difficulties
FROM books;

SELECT 
    'User Progress Records' as category,
    COUNT(*) as count,
    AVG(percentage) as avg_progress,
    COUNT(CASE WHEN percentage = 100 THEN 1 END) as completed_books,
    COUNT(CASE WHEN percentage > 0 AND percentage < 100 THEN 1 END) as in_progress_books
FROM user_book_progress;

SELECT 
    'Book Chapters' as category,
    COUNT(*) as total_chapters,
    COUNT(DISTINCT book_id) as books_with_chapters
FROM book_chapters;

SELECT 
    'User Stats' as category,
    books_read,
    total_reading_time,
    reading_streak,
    points,
    level
FROM user_reading_stats
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

-- Show sample data
SELECT 
    b.title,
    b.author,
    b.category,
    b.difficulty,
    b.rating,
    b.is_recommended,
    COALESCE(ubp.percentage, 0) as progress,
    CASE 
        WHEN COALESCE(ubp.percentage, 0) >= 100 THEN 'Completado'
        WHEN COALESCE(ubp.percentage, 0) > 0 THEN 'En Progreso'
        ELSE 'No Iniciado'
    END as status
FROM books b
LEFT JOIN user_book_progress ubp ON b.id = ubp.book_id AND ubp.user_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY COALESCE(ubp.percentage, 0) DESC, b.title;
