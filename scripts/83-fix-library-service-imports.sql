-- First, let's check if the library_books table exists and add missing columns
DO $$ 
BEGIN
    -- Add is_featured column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'library_books' AND column_name = 'is_featured'
    ) THEN
        ALTER TABLE public.library_books ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add is_recommended column if it doesn't exist (rename from is_featured if needed)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'library_books' AND column_name = 'is_recommended'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'library_books' AND column_name = 'is_featured'
        ) THEN
            -- If is_featured exists, rename it to is_recommended
            ALTER TABLE public.library_books RENAME COLUMN is_featured TO is_recommended;
        ELSE
            -- Otherwise, add is_recommended
            ALTER TABLE public.library_books ADD COLUMN is_recommended BOOLEAN DEFAULT FALSE;
        END IF;
    END IF;

    -- Ensure other required columns exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'library_books' AND column_name = 'pages'
    ) THEN
        ALTER TABLE public.library_books ADD COLUMN pages INTEGER;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'library_books' AND column_name = 'published_year'
    ) THEN
        ALTER TABLE public.library_books ADD COLUMN published_year INTEGER;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'library_books' AND column_name = 'rating'
    ) THEN
        ALTER TABLE public.library_books ADD COLUMN rating DECIMAL(3,2) DEFAULT 4.0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'library_books' AND column_name = 'key_topics'
    ) THEN
        ALTER TABLE public.library_books ADD COLUMN key_topics TEXT[];
    END IF;
END $$;

-- Update existing books to be featured/recommended
UPDATE public.library_books 
SET is_recommended = true 
WHERE id IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002', 
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440005'
);

-- Ensure we have some sample data if the table is empty
INSERT INTO public.library_books (
    id, title, author, description, cover_image, category, difficulty, 
    estimated_reading_time, pages, published_year, rating, tags, key_topics, is_recommended
) 
SELECT * FROM (VALUES 
    (
        '550e8400-e29b-41d4-a716-446655440001',
        'Hábitos Atómicos',
        'James Clear',
        'Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos.',
        '/books/atomic-habits.jpg',
        'Desarrollo Personal',
        'Intermedio',
        240,
        320,
        2018,
        4.8,
        ARRAY['hábitos', 'productividad', 'autoayuda'],
        ARRAY['Formación de hábitos', 'Cambio de comportamiento', 'Productividad personal'],
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440002',
        'Inteligencia Emocional',
        'Daniel Goleman',
        'Por qué es más importante que el cociente intelectual.',
        '/books/emotional-intelligence.jpg',
        'Psicología',
        'Intermedio',
        300,
        352,
        1995,
        4.5,
        ARRAY['inteligencia emocional', 'psicología', 'liderazgo'],
        ARRAY['Autoconciencia', 'Autorregulación', 'Empatía', 'Habilidades sociales'],
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440003',
        'Lean In',
        'Sheryl Sandberg',
        'Las mujeres, el trabajo y la voluntad de liderar.',
        '/books/lean-in.jpg',
        'Liderazgo',
        'Intermedio',
        250,
        240,
        2013,
        4.4,
        ARRAY['liderazgo femenino', 'carrera profesional', 'igualdad'],
        ARRAY['Liderazgo femenino', 'Desarrollo profesional', 'Igualdad de género'],
        true
    )
) AS v(id, title, author, description, cover_image, category, difficulty, estimated_reading_time, pages, published_year, rating, tags, key_topics, is_recommended)
WHERE NOT EXISTS (SELECT 1 FROM public.library_books WHERE library_books.id = v.id);
