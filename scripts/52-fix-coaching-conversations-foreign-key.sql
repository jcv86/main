-- Arreglar restricción de clave foránea en coaching_conversations
-- Este script elimina la restricción problemática y actualiza la estructura

-- Verificar y corregir la tabla coaching_conversations
DO $$
BEGIN
    -- Verificar si la tabla existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coaching_conversations') THEN
        RAISE NOTICE 'Tabla coaching_conversations encontrada, procediendo con correcciones...';
        
        -- Eliminar restricción de clave foránea problemática si existe
        BEGIN
            ALTER TABLE coaching_conversations DROP CONSTRAINT IF EXISTS coaching_conversations_session_id_fkey;
            RAISE NOTICE 'Restricción de clave foránea eliminada exitosamente';
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'No se pudo eliminar la restricción: %', SQLERRM;
        END;
        
        -- Asegurar que session_id permita NULL y sea texto
        BEGIN
            ALTER TABLE coaching_conversations ALTER COLUMN session_id DROP NOT NULL;
            RAISE NOTICE 'Columna session_id ahora permite NULL';
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error al modificar session_id: %', SQLERRM;
        END;
        
        -- Actualizar session_ids nulos o inválidos
        UPDATE coaching_conversations 
        SET session_id = gen_random_uuid()::text
        WHERE session_id IS NULL OR session_id = '';
        
        RAISE NOTICE 'Session IDs actualizados exitosamente';
        
        -- Crear índices para mejorar rendimiento
        CREATE INDEX IF NOT EXISTS idx_coaching_conversations_session_id ON coaching_conversations(session_id);
        CREATE INDEX IF NOT EXISTS idx_coaching_conversations_user_id ON coaching_conversations(user_id);
        CREATE INDEX IF NOT EXISTS idx_coaching_conversations_created_at ON coaching_conversations(created_at DESC);
        
        RAISE NOTICE 'Índices creados exitosamente';
        
        -- Fix coaching conversations foreign key constraint
        BEGIN
            -- Drop the existing foreign key constraint if it exists
            IF EXISTS (
                SELECT 1 
                FROM information_schema.table_constraints 
                WHERE constraint_name = 'coaching_conversations_user_id_fkey' 
                AND table_name = 'coaching_conversations'
            ) THEN
                ALTER TABLE coaching_conversations DROP CONSTRAINT coaching_conversations_user_id_fkey;
                RAISE NOTICE 'Dropped existing foreign key constraint';
            END IF;

            -- Add the correct foreign key constraint
            ALTER TABLE coaching_conversations 
            ADD CONSTRAINT coaching_conversations_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
            
            RAISE NOTICE 'Added correct foreign key constraint for coaching_conversations';
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error fixing coaching conversations foreign key: %', SQLERRM;
        END;
        
    ELSE
        RAISE NOTICE 'Tabla coaching_conversations no existe, creándola...';
        
        -- Crear la tabla si no existe
        CREATE TABLE coaching_conversations (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID,
            session_id TEXT DEFAULT gen_random_uuid()::text,
            message TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
            context JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Fix coaching conversations foreign key constraint
        BEGIN
            -- Add the correct foreign key constraint
            ALTER TABLE coaching_conversations 
            ADD CONSTRAINT coaching_conversations_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
            
            RAISE NOTICE 'Added correct foreign key constraint for coaching_conversations';
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error fixing coaching conversations foreign key: %', SQLERRM;
        END;
        
        -- Habilitar RLS
        ALTER TABLE coaching_conversations ENABLE ROW LEVEL SECURITY;
        
        -- Crear políticas RLS
        CREATE POLICY "Users can view their own conversations" ON coaching_conversations
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can insert their own conversations" ON coaching_conversations
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
        -- Crear índices
        CREATE INDEX idx_coaching_conversations_session_id ON coaching_conversations(session_id);
        CREATE INDEX idx_coaching_conversations_user_id ON coaching_conversations(user_id);
        CREATE INDEX idx_coaching_conversations_created_at ON coaching_conversations(created_at DESC);
        
        RAISE NOTICE 'Tabla coaching_conversations creada exitosamente';
    END IF;
    
    -- Mostrar estadísticas finales
    DECLARE
        total_records INTEGER;
        unique_sessions INTEGER;
        unique_users INTEGER;
    BEGIN
        SELECT COUNT(*), COUNT(DISTINCT session_id), COUNT(DISTINCT user_id)
        INTO total_records, unique_sessions, unique_users
        FROM coaching_conversations;
        
        RAISE NOTICE 'Estadísticas finales:';
        RAISE NOTICE '- Total de registros: %', total_records;
        RAISE NOTICE '- Sesiones únicas: %', unique_sessions;
        RAISE NOTICE '- Usuarios únicos: %', unique_users;
    END;
    
    RAISE NOTICE 'Script de corrección completado exitosamente';
END $$;
