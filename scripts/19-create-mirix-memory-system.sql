-- Create Mirix Memory System Tables
-- This system provides intelligent memory for AI agents

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create memory types enum
CREATE TYPE memory_type AS ENUM ('conversation', 'preference', 'insight', 'goal', 'context');

-- Create importance levels enum
CREATE TYPE importance_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Main memory storage table
CREATE TABLE IF NOT EXISTS mirix_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    agent_id VARCHAR(100) NOT NULL DEFAULT 'career_coach',
    session_id UUID,
    memory_type memory_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    importance importance_level DEFAULT 'medium',
    tags TEXT[] DEFAULT '{}',
    search_vector tsvector,
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memory connections table (for related memories)
CREATE TABLE IF NOT EXISTS mirix_memory_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_memory_id UUID NOT NULL REFERENCES mirix_memories(id) ON DELETE CASCADE,
    target_memory_id UUID NOT NULL REFERENCES mirix_memories(id) ON DELETE CASCADE,
    connection_type VARCHAR(50) NOT NULL DEFAULT 'related',
    strength DECIMAL(3,2) DEFAULT 0.5 CHECK (strength >= 0 AND strength <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_memory_id, target_memory_id)
);

-- Session tracking table
CREATE TABLE IF NOT EXISTS mirix_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    agent_id VARCHAR(100) NOT NULL,
    session_data JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    total_interactions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memory access logs
CREATE TABLE IF NOT EXISTS mirix_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memory_id UUID NOT NULL REFERENCES mirix_memories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    access_type VARCHAR(50) NOT NULL DEFAULT 'read',
    context JSONB DEFAULT '{}',
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mirix_memories_user_id ON mirix_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_mirix_memories_agent_id ON mirix_memories(agent_id);
CREATE INDEX IF NOT EXISTS idx_mirix_memories_session_id ON mirix_memories(session_id);
CREATE INDEX IF NOT EXISTS idx_mirix_memories_type ON mirix_memories(memory_type);
CREATE INDEX IF NOT EXISTS idx_mirix_memories_importance ON mirix_memories(importance);
CREATE INDEX IF NOT EXISTS idx_mirix_memories_created_at ON mirix_memories(created_at);
CREATE INDEX IF NOT EXISTS idx_mirix_memories_search_vector ON mirix_memories USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_mirix_memories_tags ON mirix_memories USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_mirix_sessions_user_id ON mirix_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mirix_sessions_agent_id ON mirix_sessions(agent_id);

CREATE INDEX IF NOT EXISTS idx_mirix_access_logs_memory_id ON mirix_access_logs(memory_id);
CREATE INDEX IF NOT EXISTS idx_mirix_access_logs_user_id ON mirix_access_logs(user_id);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_mirix_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('spanish', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, '') || ' ' || array_to_string(NEW.tags, ' '));
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector updates
DROP TRIGGER IF EXISTS trigger_update_mirix_search_vector ON mirix_memories;
CREATE TRIGGER trigger_update_mirix_search_vector
    BEFORE INSERT OR UPDATE ON mirix_memories
    FOR EACH ROW EXECUTE FUNCTION update_mirix_search_vector();

-- Function to increment access count
CREATE OR REPLACE FUNCTION increment_memory_access(memory_uuid UUID, user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE mirix_memories 
    SET access_count = access_count + 1,
        last_accessed_at = NOW()
    WHERE id = memory_uuid AND user_id = user_uuid;
    
    INSERT INTO mirix_access_logs (memory_id, user_id, access_type)
    VALUES (memory_uuid, user_uuid, 'read');
END;
$$ LANGUAGE plpgsql;

-- Function to clean expired memories
CREATE OR REPLACE FUNCTION clean_expired_memories()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM mirix_memories 
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get related memories
CREATE OR REPLACE FUNCTION get_related_memories(memory_uuid UUID, user_uuid UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    content TEXT,
    memory_type memory_type,
    importance importance_level,
    connection_strength DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.title,
        m.content,
        m.memory_type,
        m.importance,
        mc.strength as connection_strength,
        m.created_at
    FROM mirix_memories m
    JOIN mirix_memory_connections mc ON (
        (mc.source_memory_id = memory_uuid AND mc.target_memory_id = m.id) OR
        (mc.target_memory_id = memory_uuid AND mc.source_memory_id = m.id)
    )
    WHERE m.user_id = user_uuid 
    AND m.id != memory_uuid
    AND (m.expires_at IS NULL OR m.expires_at > NOW())
    ORDER BY mc.strength DESC, m.importance DESC, m.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE mirix_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE mirix_memory_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE mirix_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mirix_access_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own memories" ON mirix_memories
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own memory connections" ON mirix_memory_connections
    FOR ALL USING (
        source_memory_id IN (SELECT id FROM mirix_memories WHERE user_id = auth.uid()) OR
        target_memory_id IN (SELECT id FROM mirix_memories WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can only access their own sessions" ON mirix_sessions
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own access logs" ON mirix_access_logs
    FOR ALL USING (user_id = auth.uid());

-- Insert some demo data for testing (using proper UUIDs)
DO $$
DECLARE
    demo_user_uuid UUID;
BEGIN
    -- Get or create a demo user UUID
    SELECT id INTO demo_user_uuid FROM auth.users WHERE email = 'demo@example.com' LIMIT 1;
    
    -- If no demo user exists, create a placeholder UUID
    IF demo_user_uuid IS NULL THEN
        demo_user_uuid := gen_random_uuid();
    END IF;

    -- Insert demo memories
    INSERT INTO mirix_memories (user_id, agent_id, memory_type, title, content, importance, tags) VALUES
    (demo_user_uuid, 'career_coach', 'preference', 'Preferencia de Comunicación', 'El usuario prefiere explicaciones detalladas y ejemplos prácticos', 'high', ARRAY['comunicacion', 'estilo', 'aprendizaje']),
    (demo_user_uuid, 'career_coach', 'insight', 'Fortaleza en Análisis', 'Demostró habilidades analíticas fuertes durante la evaluación técnica', 'high', ARRAY['habilidades', 'analisis', 'fortaleza']),
    (demo_user_uuid, 'career_coach', 'goal', 'Objetivo Profesional', 'Quiere desarrollarse en el área de tecnología, específicamente en desarrollo de software', 'critical', ARRAY['objetivo', 'tecnologia', 'desarrollo']),
    (demo_user_uuid, 'career_coach', 'context', 'Contexto Educativo', 'Estudiante de último año de bachillerato técnico en informática', 'medium', ARRAY['educacion', 'bachillerato', 'informatica']);

    -- Create memory connections between related memories
    INSERT INTO mirix_memory_connections (source_memory_id, target_memory_id, connection_type, strength)
    SELECT 
        m1.id as source_memory_id,
        m2.id as target_memory_id,
        'related' as connection_type,
        0.8 as strength
    FROM mirix_memories m1, mirix_memories m2
    WHERE m1.user_id = demo_user_uuid 
    AND m2.user_id = demo_user_uuid
    AND m1.id != m2.id
    AND m1.tags && m2.tags  -- Arrays have common elements
    LIMIT 3;

END $$;

COMMIT;
