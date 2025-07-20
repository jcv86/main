-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS coaching_conversations CASCADE;
DROP TABLE IF EXISTS coaching_sessions CASCADE;
DROP TABLE IF EXISTS coaching_insights CASCADE;

-- Create coaching sessions table first (referenced by conversations)
CREATE TABLE IF NOT EXISTS coaching_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_title TEXT NOT NULL DEFAULT 'Nueva Sesión de Coaching',
    session_summary TEXT,
    total_messages INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coaching conversations table with proper session reference
CREATE TABLE IF NOT EXISTS coaching_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES coaching_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'analysis', 'recommendation', 'action_plan', 'insight')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coaching insights table for user insights tracking
CREATE TABLE IF NOT EXISTS coaching_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL,
    insight_data JSONB NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_last_activity ON coaching_sessions(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_session_id ON coaching_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_user_id ON coaching_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_conversations_created_at ON coaching_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coaching_insights_user_id ON coaching_insights(user_id);

-- Enable RLS
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for coaching_conversations
CREATE POLICY "Users can view their own coaching conversations" ON coaching_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coaching conversations" ON coaching_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coaching conversations" ON coaching_conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coaching conversations" ON coaching_conversations
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for coaching_sessions
DROP POLICY IF EXISTS "Users can view own coaching sessions" ON coaching_sessions;
CREATE POLICY "Users can view own coaching sessions" ON coaching_sessions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own coaching sessions" ON coaching_sessions;
CREATE POLICY "Users can insert own coaching sessions" ON coaching_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own coaching sessions" ON coaching_sessions;
CREATE POLICY "Users can update own coaching sessions" ON coaching_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for coaching_insights
DROP POLICY IF EXISTS "Users can view own coaching insights" ON coaching_insights;
CREATE POLICY "Users can view own coaching insights" ON coaching_insights
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own coaching insights" ON coaching_insights;
CREATE POLICY "Users can insert own coaching insights" ON coaching_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update session activity when new conversation is added
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the session that this conversation belongs to
    UPDATE coaching_sessions 
    SET 
        last_activity = NOW(),
        total_messages = total_messages + 1,
        updated_at = NOW()
    WHERE id = NEW.session_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for session activity updates
DROP TRIGGER IF EXISTS update_session_activity_trigger ON coaching_conversations;
CREATE TRIGGER update_session_activity_trigger
    AFTER INSERT ON coaching_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_session_activity();

-- Create function to automatically create a session if one doesn't exist
CREATE OR REPLACE FUNCTION ensure_user_session(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
    session_id UUID;
BEGIN
    -- Try to get the most recent session for the user
    SELECT id INTO session_id
    FROM coaching_sessions
    WHERE user_id = p_user_id
    ORDER BY last_activity DESC
    LIMIT 1;
    
    -- If no session exists, create one
    IF session_id IS NULL THEN
        INSERT INTO coaching_sessions (user_id, session_title)
        VALUES (p_user_id, 'Sesión de Coaching Profesional')
        RETURNING id INTO session_id;
    END IF;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Insert some demo data for testing
DO $$
DECLARE
    demo_user_id UUID;
    demo_session_id UUID;
BEGIN
    -- Get the demo user ID (assuming it exists from previous scripts)
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1;
    
    IF demo_user_id IS NOT NULL THEN
        -- Create a demo coaching session
        INSERT INTO coaching_sessions (user_id, session_title, session_summary, total_messages)
        VALUES (
            demo_user_id,
            'Initial Career Assessment',
            'First coaching session focusing on career goals and current situation',
            3
        ) RETURNING id INTO demo_session_id;
        
        -- Insert demo conversations
        INSERT INTO coaching_conversations (user_id, session_id, role, content, message_type) VALUES
        (demo_user_id, demo_session_id, 'user', 'Hi, I need help with my career development. I''m a software developer looking to advance to a senior role.', 'text'),
        (demo_user_id, demo_session_id, 'assistant', 'Hello! I''d be happy to help you advance your software development career. Based on your profile, I can see you have strong technical skills. Let''s discuss your specific goals and create a development plan.', 'text'),
        (demo_user_id, demo_session_id, 'assistant', 'Here''s my analysis of your current situation: You have solid programming fundamentals and good problem-solving skills. To reach a senior level, focus on: 1) System design and architecture, 2) Mentoring and leadership skills, 3) Cross-functional collaboration, 4) Technical decision-making experience.', 'analysis');
        
        -- Create some coaching insights
        INSERT INTO coaching_insights (user_id, insight_type, insight_data) VALUES
        (demo_user_id, 'career_goal', '{"goal": "Senior Software Developer", "timeline": "12-18 months", "key_areas": ["system_design", "leadership", "mentoring"]}', 0.85),
        (demo_user_id, 'skill_gap', '{"missing_skills": ["system_architecture", "team_leadership"], "recommended_actions": ["take_system_design_course", "volunteer_for_mentoring"]}', 0.78),
        (demo_user_id, 'market_insight', '{"salary_range": "$90k-$120k", "demand": "high", "growth_projection": "15% over 2 years"}', 0.92);
    END IF;
END $$;

-- Insert demo data for Chilean market
INSERT INTO coaching_sessions (id, user_id, session_title, session_summary, total_messages, last_activity) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Planificación de Carrera en Tecnología', 'Discusión sobre oportunidades en el sector tech chileno', 8, NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Negociación Salarial en Santiago', 'Estrategias para negociar salarios en el mercado chileno', 12, NOW() - INTERVAL '1 week'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Transición a Liderazgo', 'Desarrollo de habilidades de liderazgo en empresas chilenas', 15, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- Insert demo conversations in Spanish
INSERT INTO coaching_conversations (session_id, user_id, role, content, message_type) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'user', '¿Cuáles son las mejores oportunidades de carrera en tecnología en Chile?', 'text'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'assistant', 'El mercado tecnológico chileno está en pleno crecimiento. Las áreas con mayor demanda incluyen:\n\n🚀 **Desarrollo de Software**: Especialmente en fintech y e-commerce\n💡 **Data Science**: Con el auge de la transformación digital\n☁️ **Cloud Computing**: AWS y Azure tienen alta demanda\n🔒 **Ciberseguridad**: Sector en expansión por regulaciones bancarias\n📱 **Desarrollo Mobile**: Para startups y retail\n\nEmpresas como Cornershop, NotCo, y Fintual están liderando la innovación. ¿En qué área te interesa especializarte?', 'analysis'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'user', 'Quiero negociar mi salario como desarrollador senior en Santiago. ¿Cuál es el rango salarial actual?', 'text'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'assistant', 'Para desarrolladores senior en Santiago (2024), los rangos salariales son:\n\n💰 **Desarrollador Senior**: $2.500.000 - $4.000.000 CLP\n🏆 **Tech Lead**: $3.500.000 - $5.500.000 CLP\n👨‍💼 **Engineering Manager**: $4.500.000 - $7.000.000 CLP\n\n**Factores que influyen**:\n• Empresa (startups vs corporaciones)\n• Stack tecnológico (React, Python, etc.)\n• Inglés fluido (+20-30%)\n• Experiencia en equipos remotos\n• Certificaciones cloud\n\n**Estrategia de negociación**:\n1. Investiga salarios en GetOnBoard y LinkedIn\n2. Destaca proyectos de impacto\n3. Menciona ofertas competitivas\n4. Negocia beneficios adicionales\n\n¿Qué stack manejas y cuántos años de experiencia tienes?', 'recommendation')
ON CONFLICT DO NOTHING;

-- Insert demo insights
INSERT INTO coaching_insights (user_id, insight_type, insight_data) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'career_focus', '{"primary_interest": "tecnologia", "market": "chile", "experience_level": "senior", "salary_expectations": "high"}'),
('550e8400-e29b-41d4-a716-446655440000', 'skill_gaps', '{"missing_skills": ["liderazgo", "ingles_avanzado", "arquitectura_cloud"], "market_demand": "alta"}'),
('550e8400-e29b-41d4-a716-446655440000', 'market_positioning', '{"current_level": "senior", "target_level": "tech_lead", "timeline": "6_months", "location": "santiago"}')
ON CONFLICT DO NOTHING;
