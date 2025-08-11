-- Crear tablas para la integración de Mirix con la biblioteca

-- Tabla para insights de lectura
CREATE TABLE IF NOT EXISTS library_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id TEXT NOT NULL,
    chapter_id TEXT,
    content TEXT NOT NULL,
    insight_type TEXT CHECK (insight_type IN ('reflection', 'quote', 'note', 'connection')) DEFAULT 'reflection',
    importance TEXT CHECK (importance IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    tags TEXT[] DEFAULT '{}',
    page_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para sesiones de lectura
CREATE TABLE IF NOT EXISTS reading_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    pages_read INTEGER DEFAULT 0,
    insights_captured INTEGER DEFAULT 0,
    comprehension_score INTEGER CHECK (comprehension_score >= 0 AND comprehension_score <= 100),
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_library_insights_user_id ON library_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_library_insights_book_id ON library_insights(book_id);
CREATE INDEX IF NOT EXISTS idx_library_insights_importance ON library_insights(importance);
CREATE INDEX IF NOT EXISTS idx_library_insights_tags ON library_insights USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_library_insights_created_at ON library_insights(created_at);

CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_id ON reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_created_at ON reading_sessions(created_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para library_insights
DROP TRIGGER IF EXISTS update_library_insights_updated_at ON library_insights;
CREATE TRIGGER update_library_insights_updated_at
    BEFORE UPDATE ON library_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS para library_insights
ALTER TABLE library_insights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own library insights" ON library_insights;
CREATE POLICY "Users can view their own library insights"
    ON library_insights FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own library insights" ON library_insights;
CREATE POLICY "Users can insert their own library insights"
    ON library_insights FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own library insights" ON library_insights;
CREATE POLICY "Users can update their own library insights"
    ON library_insights FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own library insights" ON library_insights;
CREATE POLICY "Users can delete their own library insights"
    ON library_insights FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas RLS para reading_sessions
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own reading sessions" ON reading_sessions;
CREATE POLICY "Users can view their own reading sessions"
    ON reading_sessions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own reading sessions" ON reading_sessions;
CREATE POLICY "Users can insert their own reading sessions"
    ON reading_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reading sessions" ON reading_sessions;
CREATE POLICY "Users can update their own reading sessions"
    ON reading_sessions FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reading sessions" ON reading_sessions;
CREATE POLICY "Users can delete their own reading sessions"
    ON reading_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- Función para actualizar el contador de insights en sesiones
CREATE OR REPLACE FUNCTION update_session_insights_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar el contador de insights en la sesión activa
    UPDATE reading_sessions 
    SET insights_captured = insights_captured + 1
    WHERE user_id = NEW.user_id 
    AND book_id = NEW.book_id 
    AND end_time IS NULL
    AND DATE(created_at) = DATE(NEW.created_at);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar contador automáticamente
DROP TRIGGER IF EXISTS update_insights_count_trigger ON library_insights;
CREATE TRIGGER update_insights_count_trigger
    AFTER INSERT ON library_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_session_insights_count();

-- Insertar datos de ejemplo para testing (solo si existe el usuario demo)
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Buscar el usuario demo
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1;
    
    IF demo_user_id IS NOT NULL THEN
        -- Insertar insights de ejemplo
        INSERT INTO library_insights (user_id, book_id, content, insight_type, importance, tags, page_number) VALUES
        (demo_user_id, '1', 'Los hábitos pequeños pueden generar grandes cambios a largo plazo. Es importante enfocarse en el sistema, no en los objetivos.', 'reflection', 'high', ARRAY['hábitos', 'productividad', 'sistemas'], 45),
        (demo_user_id, '1', '"No te elevas al nivel de tus objetivos. Caes al nivel de tus sistemas."', 'quote', 'critical', ARRAY['sistemas', 'objetivos', 'filosofía'], 23),
        (demo_user_id, '2', 'La proactividad es la base de todos los demás hábitos. Sin ella, no podemos tomar control de nuestras vidas.', 'reflection', 'high', ARRAY['proactividad', 'liderazgo', 'control'], 67),
        (demo_user_id, '2', 'Conexión con "Hábitos Atómicos": Ambos libros enfatizan la importancia de los sistemas sobre los objetivos.', 'connection', 'medium', ARRAY['conexión', 'sistemas', 'comparación'], 89);
        
        -- Insertar sesión de lectura de ejemplo
        INSERT INTO reading_sessions (user_id, book_id, start_time, end_time, pages_read, insights_captured, comprehension_score, notes) VALUES
        (demo_user_id, '1', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', 25, 2, 85, 'Excelente capítulo sobre la formación de hábitos. Las estrategias son muy prácticas.');
    END IF;
END $$;
