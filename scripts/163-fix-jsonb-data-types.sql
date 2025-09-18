-- Fix JSONB data types and create proper user profiles table
DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
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
        "lastActive": "",
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create AI interactions table for conversation history
DROP TABLE IF EXISTS ai_interactions CASCADE;

CREATE TABLE ai_interactions (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    metadata JSONB DEFAULT '{}'::jsonb,
    suggested_actions JSONB DEFAULT '[]'::jsonb,
    context_used JSONB DEFAULT '[]'::jsonb,
    confidence_score DECIMAL(3,2) DEFAULT 0.8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo user profile
INSERT INTO user_profiles (email, name, preferences, conversation_history, personality_insights, career_profile) 
VALUES (
    'demo@example.com',
    'Usuario Demo',
    '{
        "communicationStyle": "professional",
        "learningStyle": "visual",
        "careerGoals": ["liderazgo", "desarrollo profesional"],
        "interests": ["tecnología", "innovación", "gestión"],
        "skillLevel": "intermediate",
        "timeAvailability": "moderate"
    }'::jsonb,
    '{
        "totalMessages": 15,
        "topics": ["liderazgo", "carrera", "habilidades"],
        "lastActive": "2024-01-15T10:30:00Z",
        "commonQuestions": ["¿Cómo mejorar mi liderazgo?", "¿Qué habilidades desarrollar?"],
        "progressTracking": {
            "leadership": {
                "currentLevel": 3,
                "targetLevel": 5,
                "milestones": ["Completar curso de liderazgo", "Liderar proyecto"],
                "completedActions": ["Evaluación inicial"]
            }
        }
    }'::jsonb,
    '{
        "strengths": ["Comunicación", "Análisis", "Adaptabilidad"],
        "growthAreas": ["Delegación", "Gestión del tiempo"],
        "workStyle": "colaborativo",
        "motivators": ["Crecimiento profesional", "Impacto positivo"],
        "stressors": ["Plazos ajustados", "Ambigüedad"],
        "communicationPreferences": ["Directo", "Estructurado"]
    }'::jsonb,
    '{
        "experience": "5 años",
        "aspirations": ["Gerente de equipo", "Consultor senior"],
        "skillGaps": ["Gestión financiera", "Estrategia empresarial"],
        "networkingStyle": "profesional activo"
    }'::jsonb
) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    preferences = EXCLUDED.preferences,
    conversation_history = EXCLUDED.conversation_history,
    personality_insights = EXCLUDED.personality_insights,
    career_profile = EXCLUDED.career_profile,
    updated_at = CURRENT_TIMESTAMP;

-- Insert some demo conversation history
INSERT INTO ai_interactions (user_email, message_type, content, category, suggested_actions) VALUES
('demo@example.com', 'user', '¿Cómo puedo mejorar mis habilidades de liderazgo?', 'career', '[]'::jsonb),
('demo@example.com', 'assistant', 'Excelente pregunta sobre liderazgo. Basado en tu perfil, te recomiendo enfocarte en tres áreas clave: comunicación efectiva, delegación estratégica y desarrollo de equipos. ¿Te gustaría profundizar en alguna de estas áreas específicamente?', 'career', '["Comunicación efectiva", "Delegación estratégica", "Desarrollo de equipos"]'::jsonb),
('demo@example.com', 'user', 'Me interesa la delegación estratégica', 'skill', '[]'::jsonb),
('demo@example.com', 'assistant', 'Perfecto. La delegación estratégica es fundamental para tu crecimiento como líder. Te sugiero comenzar con estos pasos: 1) Identifica tareas que puedes delegar, 2) Selecciona a las personas adecuadas, 3) Proporciona contexto claro y expectativas. ¿Quieres que creemos un plan específico para tu situación?', 'skill', '["Crear plan de delegación", "Evaluar mi equipo actual", "Practicar técnicas de delegación"]'::jsonb);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_ai_interactions_user_email ON ai_interactions(user_email);
CREATE INDEX idx_ai_interactions_created_at ON ai_interactions(created_at);

-- Update function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
