-- Fix foreign key constraints and create AI Coach tables
-- This script creates the complete database structure for the AI Coach system

BEGIN;

-- Drop existing tables if they exist (with CASCADE to handle dependencies)
DROP TABLE IF EXISTS ai_insights CASCADE;
DROP TABLE IF EXISTS ai_conversations CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table with comprehensive JSONB fields
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_category VARCHAR(50) DEFAULT 'standard' CHECK (user_category IN ('standard', 'premium', 'enterprise')),
    preferences JSONB DEFAULT '{
        "communicationStyle": "professional",
        "learningStyle": "visual",
        "careerGoals": [],
        "interests": [],
        "skillLevel": "intermediate",
        "timeAvailability": "moderate"
    }'::jsonb,
    test_results JSONB DEFAULT '{}'::jsonb,
    conversation_history JSONB DEFAULT '{
        "totalMessages": 0,
        "topics": [],
        "lastActive": null,
        "commonQuestions": [],
        "progressTracking": {}
    }'::jsonb,
    personality_insights JSONB DEFAULT '{
        "strengths": [],
        "growthAreas": [],
        "workStyle": "collaborative",
        "motivators": [],
        "stressors": [],
        "communicationPreferences": []
    }'::jsonb,
    career_profile JSONB DEFAULT '{
        "currentRole": null,
        "industry": null,
        "experience": "intermediate",
        "aspirations": [],
        "skillGaps": [],
        "networkingStyle": "professional"
    }'::jsonb,
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

-- Create ai_conversations table for chat history
CREATE TABLE ai_conversations (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    category VARCHAR(100),
    suggested_actions JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_conversations_user_email 
        FOREIGN KEY (user_email) 
        REFERENCES user_profiles(email) 
        ON DELETE CASCADE
);

-- Create ai_insights table for AI-generated insights
CREATE TABLE ai_insights (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('strength', 'opportunity', 'recommendation', 'milestone')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    actionable BOOLEAN DEFAULT true,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_insights_user_email 
        FOREIGN KEY (user_email) 
        REFERENCES user_profiles(email) 
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_category ON user_profiles(user_category);
CREATE INDEX idx_conversations_user_email ON ai_conversations(user_email);
CREATE INDEX idx_conversations_created_at ON ai_conversations(created_at);
CREATE INDEX idx_insights_user_email ON ai_insights(user_email);
CREATE INDEX idx_insights_priority ON ai_insights(priority);
CREATE INDEX idx_insights_created_at ON ai_insights(created_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_insights_updated_at 
    BEFORE UPDATE ON ai_insights 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically categorize users based on email domain
CREATE OR REPLACE FUNCTION categorize_user_by_email(user_email VARCHAR(255))
RETURNS VARCHAR(50) AS $$
BEGIN
    -- Enterprise category for specific domains
    IF user_email LIKE '%@nuanu.com' OR 
       user_email LIKE '%@microsoft.com' OR 
       user_email LIKE '%@google.com' OR 
       user_email LIKE '%@amazon.com' OR
       user_email LIKE '%@meta.com' OR
       user_email LIKE '%@apple.com' THEN
        RETURN 'enterprise';
    
    -- Premium category for business domains
    ELSIF user_email LIKE '%@despegaturcarrera.com' OR 
          user_email LIKE '%@consulting.com' OR 
          user_email LIKE '%@strategy.com' OR
          user_email LIKE '%@leadership.com' THEN
        RETURN 'premium';
    
    -- Standard category for everyone else
    ELSE
        RETURN 'standard';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set user category on insert
CREATE OR REPLACE FUNCTION set_user_category()
RETURNS TRIGGER AS $$
BEGIN
    -- Only set category if not explicitly provided
    IF NEW.user_category IS NULL OR NEW.user_category = 'standard' THEN
        NEW.user_category = categorize_user_by_email(NEW.email);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_category_trigger
    BEFORE INSERT ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION set_user_category();

-- Insert sample users for each category
INSERT INTO user_profiles (email, name, user_category, preferences, conversation_history, personality_insights, career_profile, learning_profile) VALUES

-- Premium User: Ana García (Marketing Manager)
('demo@despegaturcarrera.com', 'Ana García', 'premium', 
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
}'::jsonb),

-- Enterprise User: Travis Herrera (Senior Software Architect)
('travis@nuanu.com', 'Travis Herrera', 'enterprise',
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
}'::jsonb),

-- Standard User: Carlos Mendoza (Project Coordinator)
('test@dtc.com', 'Carlos Mendoza', 'standard',
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
}'::jsonb);

-- Insert sample AI insights for each user
INSERT INTO ai_insights (user_email, insight_type, title, description, priority, progress, actionable, category) VALUES

-- Ana García (Premium) insights
('demo@despegaturcarrera.com', 'strength', 'Liderazgo Estratégico Excepcional', 
'Tu capacidad para liderar con visión estratégica y comunicación persuasiva te posiciona perfectamente para roles de dirección en marketing e innovación.', 
'high', 90, true, 'Liderazgo'),

('demo@despegaturcarrera.com', 'opportunity', 'Desarrollo en Finanzas Corporativas', 
'Para alcanzar roles de VP, desarrollar competencias en gestión financiera y P&L será crucial para tu crecimiento.', 
'high', 30, true, 'Finanzas'),

('demo@despegaturcarrera.com', 'recommendation', 'Certificación en Marketing Digital Avanzado', 
'Considera obtener certificaciones en Google Analytics 4 y Marketing Automation para fortalecer tu perfil técnico.', 
'medium', 0, true, 'Certificaciones'),

-- Travis Herrera (Enterprise) insights
('travis@nuanu.com', 'strength', 'Arquitectura y Liderazgo Técnico', 
'Tu expertise en arquitectura de sistemas combinado con liderazgo técnico te posiciona idealmente para roles de CTO.', 
'high', 95, true, 'Técnico'),

('travis@nuanu.com', 'opportunity', 'Comunicación Ejecutiva', 
'Desarrollar habilidades de comunicación con stakeholders no técnicos será clave para tu transición a roles ejecutivos.', 
'high', 40, true, 'Comunicación'),

('travis@nuanu.com', 'milestone', 'Preparación para CTO', 
'Estás en el 85% del camino hacia un rol de CTO. Enfócate en gestión de presupuestos y estrategia empresarial.', 
'high', 85, true, 'Carrera'),

-- Carlos Mendoza (Standard) insights
('test@dtc.com', 'strength', 'Comunicación Empática y Organización', 
'Tus habilidades naturales de comunicación empática y organización son perfectas para roles de gestión de proyectos.', 
'medium', 75, true, 'Comunicación'),

('test@dtc.com', 'recommendation', 'Certificación PMP', 
'La certificación PMP te abrirá puertas significativas en gestión de proyectos. Considera comenzar la preparación.', 
'high', 20, true, 'Certificaciones'),

('test@dtc.com', 'opportunity', 'Liderazgo Asertivo', 
'Desarrollar un estilo de liderazgo más asertivo te ayudará a gestionar equipos más grandes y proyectos complejos.', 
'medium', 35, true, 'Liderazgo');

-- Insert sample conversation history
INSERT INTO ai_conversations (user_email, message_type, content, category, suggested_actions, metadata) VALUES

-- Ana García conversations
('demo@despegaturcarrera.com', 'assistant', 
'¡Hola Ana! Como tu AI Coach Premium, veo que tienes un perfil excepcional en marketing estratégico. ¿En qué área específica te gustaría enfocar tu desarrollo hoy?', 
'bienvenida', 
'["Estrategia de liderazgo", "Marketing digital avanzado", "Preparación para VP", "Análisis financiero"]'::jsonb,
'{"confidence": 0.95, "contextUsed": ["profile", "history", "preferences"], "userCategory": "premium"}'::jsonb),

-- Travis Herrera conversations  
('travis@nuanu.com', 'assistant',
'¡Hola Travis! Tu perfil Enterprise muestra una trayectoria impresionante hacia CTO. Con tu expertise en arquitectura, ¿te gustaría trabajar en habilidades ejecutivas o profundizar en estrategia tecnológica?',
'bienvenida',
'["Comunicación ejecutiva", "Estrategia tecnológica", "Gestión de equipos", "Arquitectura empresarial"]'::jsonb,
'{"confidence": 0.98, "contextUsed": ["profile", "technical_background", "career_goals"], "userCategory": "enterprise"}'::jsonb),

-- Carlos Mendoza conversations
('test@dtc.com', 'assistant',
'¡Hola Carlos! Veo que estás desarrollando excelentes habilidades en gestión de proyectos. ¿Te gustaría que te ayude con metodologías ágiles o preparación para certificaciones?',
'bienvenida', 
'["Metodologías ágiles", "Preparación PMP", "Liderazgo de equipos", "Gestión de stakeholders"]'::jsonb,
'{"confidence": 0.88, "contextUsed": ["profile", "career_goals"], "userCategory": "standard"}'::jsonb);

COMMIT;

-- Verification queries
SELECT 'User Profiles Created:' as status, COUNT(*) as count FROM user_profiles;
SELECT 'AI Insights Created:' as status, COUNT(*) as count FROM ai_insights;
SELECT 'Conversations Created:' as status, COUNT(*) as count FROM ai_conversations;

-- Show user categories distribution
SELECT 
    user_category,
    COUNT(*) as user_count,
    ARRAY_AGG(name) as users
FROM user_profiles 
GROUP BY user_category 
ORDER BY user_category;

-- Show sample of each user's data
SELECT 
    name,
    user_category,
    email,
    (preferences->>'skillLevel') as skill_level,
    (career_profile->>'currentRole') as current_role,
    (conversation_history->>'totalMessages')::int as total_messages
FROM user_profiles 
ORDER BY user_category, name;
