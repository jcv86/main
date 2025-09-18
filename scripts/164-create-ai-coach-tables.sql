-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS ai_insights CASCADE;
DROP TABLE IF EXISTS ai_conversations CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create comprehensive user profiles table
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_category VARCHAR(50) DEFAULT 'standard',
    
    -- User preferences
    preferences JSONB DEFAULT '{
        "communicationStyle": "professional",
        "learningStyle": "visual", 
        "careerGoals": [],
        "interests": [],
        "skillLevel": "intermediate",
        "timeAvailability": "moderate"
    }'::jsonb,
    
    -- Test results storage
    test_results JSONB DEFAULT '{}'::jsonb,
    
    -- Conversation history and analytics
    conversation_history JSONB DEFAULT '{
        "totalMessages": 0,
        "topics": [],
        "lastActive": null,
        "commonQuestions": [],
        "progressTracking": {}
    }'::jsonb,
    
    -- AI-generated personality insights
    personality_insights JSONB DEFAULT '{
        "strengths": [],
        "growthAreas": [],
        "workStyle": "collaborative",
        "motivators": [],
        "stressors": [],
        "communicationPreferences": []
    }'::jsonb,
    
    -- Career profile information
    career_profile JSONB DEFAULT '{
        "currentRole": null,
        "industry": null,
        "experience": "intermediate",
        "aspirations": [],
        "skillGaps": [],
        "networkingStyle": "professional"
    }'::jsonb,
    
    -- Learning profile and preferences
    learning_profile JSONB DEFAULT '{
        "completedBooks": [],
        "currentReading": [],
        "preferredFormats": ["digital", "interactive"],
        "learningPace": "moderate",
        "retentionStyle": "practical"
    }'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI conversations table for conversation storage
CREATE TABLE ai_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    category VARCHAR(50),
    suggested_actions JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_conversations_user_email 
        FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE
);

-- Create AI insights table
CREATE TABLE ai_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    insight_type VARCHAR(20) NOT NULL CHECK (insight_type IN ('strength', 'opportunity', 'recommendation', 'milestone')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    actionable BOOLEAN DEFAULT true,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_insights_user_email 
        FOREIGN KEY (user_email) REFERENCES user_profiles(email) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_category ON user_profiles(user_category);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_email ON ai_conversations(user_email);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_email ON ai_insights(user_email);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_user_profiles_preferences ON user_profiles USING GIN (preferences);
CREATE INDEX IF NOT EXISTS idx_user_profiles_test_results ON user_profiles USING GIN (test_results);
CREATE INDEX IF NOT EXISTS idx_user_profiles_conversation_history ON user_profiles USING GIN (conversation_history);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_insights_updated_at ON ai_insights;
CREATE TRIGGER update_ai_insights_updated_at 
    BEFORE UPDATE ON ai_insights 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert demo users with different categories
INSERT INTO user_profiles (email, name, user_category, preferences, conversation_history, personality_insights, career_profile, learning_profile) 
VALUES 
(
    'demo@despegaturcarrera.com',
    'Ana García',
    'premium',
    '{
        "communicationStyle": "collaborative",
        "learningStyle": "kinesthetic",
        "careerGoals": ["gerencia", "innovación", "transformación digital"],
        "interests": ["marketing digital", "análisis de datos", "liderazgo"],
        "skillLevel": "advanced",
        "timeAvailability": "high"
    }'::jsonb,
    '{
        "totalMessages": 25,
        "topics": ["marketing", "liderazgo", "innovación", "análisis"],
        "lastActive": "2024-01-15T10:30:00Z",
        "commonQuestions": ["¿Cómo liderar equipos remotos?", "Estrategias de marketing digital"],
        "progressTracking": {
            "leadership": {"currentLevel": 8, "targetLevel": 10},
            "marketing": {"currentLevel": 9, "targetLevel": 10}
        }
    }'::jsonb,
    '{
        "strengths": ["Liderazgo estratégico", "Innovación", "Comunicación persuasiva", "Análisis de mercado"],
        "growthAreas": ["Gestión financiera", "Negociación avanzada"],
        "workStyle": "visionario-colaborativo",
        "motivators": ["Impacto transformacional", "Crecimiento de equipo", "Innovación disruptiva"],
        "stressors": ["Burocracia excesiva", "Resistencia al cambio"],
        "communicationPreferences": ["Visual", "Interactivo", "Estratégico"]
    }'::jsonb,
    '{
        "currentRole": "Marketing Manager",
        "industry": "Tecnología",
        "experience": "senior",
        "aspirations": ["Directora de Marketing", "VP de Innovación", "Consultora Senior"],
        "skillGaps": ["Finanzas corporativas", "Gestión de P&L"],
        "networkingStyle": "estratégico-relacional"
    }'::jsonb,
    '{
        "completedBooks": ["Good to Great", "The Lean Startup", "Crossing the Chasm"],
        "currentReading": ["Blue Ocean Strategy", "The Innovators Dilemma"],
        "preferredFormats": ["audiobook", "interactive", "video"],
        "learningPace": "accelerated",
        "retentionStyle": "visual-practical"
    }'::jsonb
),
(
    'travis@nuanu.com',
    'Travis Herrera',
    'enterprise',
    '{
        "communicationStyle": "direct",
        "learningStyle": "visual",
        "careerGoals": ["CTO", "arquitectura empresarial", "transformación digital"],
        "interests": ["tecnología", "arquitectura de software", "liderazgo técnico"],
        "skillLevel": "expert",
        "timeAvailability": "moderate"
    }'::jsonb,
    '{
        "totalMessages": 45,
        "topics": ["arquitectura", "liderazgo técnico", "innovación", "estrategia"],
        "lastActive": "2024-01-15T14:20:00Z",
        "commonQuestions": ["Arquitecturas escalables", "Liderazgo de equipos técnicos"],
        "progressTracking": {
            "technical_leadership": {"currentLevel": 9, "targetLevel": 10},
            "architecture": {"currentLevel": 10, "targetLevel": 10}
        }
    }'::jsonb,
    '{
        "strengths": ["Arquitectura de sistemas", "Liderazgo técnico", "Visión estratégica", "Innovación tecnológica"],
        "growthAreas": ["Comunicación ejecutiva", "Gestión de presupuestos"],
        "workStyle": "técnico-visionario",
        "motivators": ["Excelencia técnica", "Impacto escalable", "Mentoring"],
        "stressors": ["Decisiones no basadas en datos", "Tecnología legacy"],
        "communicationPreferences": ["Técnico", "Directo", "Basado en datos"]
    }'::jsonb,
    '{
        "currentRole": "Senior Software Architect",
        "industry": "Tecnología",
        "experience": "expert",
        "aspirations": ["CTO", "Principal Architect", "Tech Consultant"],
        "skillGaps": ["Gestión ejecutiva", "Comunicación con stakeholders"],
        "networkingStyle": "técnico-profesional"
    }'::jsonb,
    '{
        "completedBooks": ["Clean Architecture", "The Phoenix Project", "Accelerate"],
        "currentReading": ["Team Topologies", "The Technology Fallacy"],
        "preferredFormats": ["digital", "technical", "interactive"],
        "learningPace": "intensive",
        "retentionStyle": "hands-on-practical"
    }'::jsonb
),
(
    'test@dtc.com',
    'Carlos Mendoza',
    'standard',
    '{
        "communicationStyle": "supportive",
        "learningStyle": "auditory",
        "careerGoals": ["coordinación de proyectos", "gestión de equipos", "certificación PMP"],
        "interests": ["gestión de proyectos", "metodologías ágiles", "comunicación"],
        "skillLevel": "intermediate",
        "timeAvailability": "moderate"
    }'::jsonb,
    '{
        "totalMessages": 12,
        "topics": ["proyectos", "metodologías", "comunicación"],
        "lastActive": "2024-01-15T09:15:00Z",
        "commonQuestions": ["Metodologías ágiles", "Gestión de stakeholders"],
        "progressTracking": {
            "project_management": {"currentLevel": 6, "targetLevel": 8},
            "communication": {"currentLevel": 7, "targetLevel": 9}
        }
    }'::jsonb,
    '{
        "strengths": ["Organización", "Comunicación empática", "Resolución de conflictos"],
        "growthAreas": ["Liderazgo asertivo", "Gestión de riesgos"],
        "workStyle": "colaborativo-estructurado",
        "motivators": ["Trabajo en equipo", "Logro de objetivos", "Desarrollo personal"],
        "stressors": ["Conflictos no resueltos", "Plazos irreales"],
        "communicationPreferences": ["Empático", "Estructurado", "Inclusivo"]
    }'::jsonb,
    '{
        "currentRole": "Project Coordinator",
        "industry": "Consultoría",
        "experience": "intermediate",
        "aspirations": ["Project Manager", "Scrum Master", "Program Manager"],
        "skillGaps": ["Certificación PMP", "Gestión financiera de proyectos"],
        "networkingStyle": "colaborativo-profesional"
    }'::jsonb,
    '{
        "completedBooks": ["PMBOK Guide", "Scrum: The Art of Doing Twice"],
        "currentReading": ["The Lean Startup", "Crucial Conversations"],
        "preferredFormats": ["audiobook", "workshop", "peer-learning"],
        "learningPace": "steady",
        "retentionStyle": "discussion-based"
    }'::jsonb
);

-- Insert initial insights for demo users
INSERT INTO ai_insights (user_email, insight_type, title, description, priority, progress, category)
VALUES 
-- Ana García insights
('demo@despegaturcarrera.com', 'strength', 'Liderazgo Estratégico Excepcional', 'Tu capacidad para liderar con visión estratégica y comunicación persuasiva te posiciona perfectamente para roles de dirección en marketing e innovación.', 'high', 90, 'Liderazgo'),
('demo@despegaturcarrera.com', 'opportunity', 'Desarrollo en Finanzas Corporativas', 'Para alcanzar roles de VP, desarrollar competencias en gestión financiera y P&L será crucial para tu crecimiento.', 'high', 30, 'Finanzas'),
('demo@despegaturcarrera.com', 'recommendation', 'Programa de Mentoring Ejecutivo', 'Considera un programa de mentoring con ejecutivos C-level para acelerar tu transición a roles de dirección.', 'high', 0, 'Desarrollo'),

-- Travis Herrera insights  
('travis@nuanu.com', 'strength', 'Arquitectura y Liderazgo Técnico', 'Tu expertise en arquitectura de sistemas combinado con liderazgo técnico te posiciona idealmente para roles de CTO.', 'high', 95, 'Técnico'),
('travis@nuanu.com', 'opportunity', 'Comunicación Ejecutiva', 'Desarrollar habilidades de comunicación con stakeholders no técnicos será clave para tu transición a CTO.', 'medium', 60, 'Comunicación'),
('travis@nuanu.com', 'milestone', 'Progreso hacia CTO', 'Has completado el 85% de las competencias técnicas necesarias para un rol de CTO. Enfócate ahora en habilidades de gestión.', 'high', 85, 'Carrera'),

-- Carlos Mendoza insights
('test@dtc.com', 'strength', 'Organización y Comunicación Empática', 'Tus fortalezas en organización y comunicación empática son fundamentales para la gestión efectiva de proyectos.', 'medium', 75, 'Comunicación'),
('test@dtc.com', 'opportunity', 'Certificación PMP', 'Obtener la certificación PMP acelerará significativamente tu progreso hacia roles de Project Manager senior.', 'high', 20, 'Certificación'),
('test@dtc.com', 'recommendation', 'Metodologías Ágiles Avanzadas', 'Profundizar en Scrum y Kanban te dará ventaja competitiva en el mercado actual de gestión de proyectos.', 'medium', 40, 'Metodologías');

-- Verify the data was inserted correctly
SELECT 
    email, 
    name, 
    user_category,
    (conversation_history->>'totalMessages')::int as total_messages,
    jsonb_array_length(personality_insights->'strengths') as strengths_count
FROM user_profiles;

-- Verify insights were created
SELECT 
    user_email,
    insight_type,
    title,
    priority,
    category
FROM ai_insights
ORDER BY user_email, priority DESC;

-- Grant permissions (adjust role names as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ai_conversations TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ai_insights TO authenticated;

COMMIT;
