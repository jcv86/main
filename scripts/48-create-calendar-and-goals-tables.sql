-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS goal_milestones CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;
DROP TABLE IF EXISTS interview_sessions CASCADE;

-- Create calendar events table
CREATE TABLE calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    event_time TIME,
    event_type TEXT CHECK (event_type IN ('goal', 'interview', 'assessment', 'coaching', 'reminder', 'deadline')) DEFAULT 'reminder',
    event_status TEXT CHECK (event_status IN ('pending', 'completed', 'missed', 'in_progress')) DEFAULT 'pending',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    related_module TEXT,
    google_event_id TEXT,
    notifications JSONB DEFAULT '{"email": true, "push": true, "timesBefore": [60]}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goals table
CREATE TABLE goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date TIMESTAMP WITH TIME ZONE NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    category TEXT CHECK (category IN ('career', 'skills', 'education', 'networking')) DEFAULT 'career',
    goal_status TEXT CHECK (goal_status IN ('active', 'completed', 'paused', 'cancelled')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goal milestones table
CREATE TABLE goal_milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    completed_date TIMESTAMP WITH TIME ZONE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview sessions table for simulator integration
CREATE TABLE interview_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    interview_type TEXT CHECK (interview_type IN ('hr_general', 'technical', 'behavioral', 'leadership', 'case_study')) DEFAULT 'hr_general',
    difficulty TEXT CHECK (difficulty IN ('entry', 'mid', 'senior', 'executive')) DEFAULT 'mid',
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    session_status TEXT CHECK (session_status IN ('setup', 'pre_assessment', 'active', 'paused', 'completed')) DEFAULT 'setup',
    pre_assessment JSONB,
    feedback JSONB,
    questions JSONB,
    responses JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_date ON calendar_events(event_date);
CREATE INDEX idx_calendar_events_type ON calendar_events(event_type);
CREATE INDEX idx_calendar_events_status ON calendar_events(event_status);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_target_date ON goals(target_date);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_status ON goals(goal_status);

CREATE INDEX idx_goal_milestones_goal_id ON goal_milestones(goal_id);
CREATE INDEX idx_goal_milestones_completed ON goal_milestones(completed);

CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_interview_sessions_status ON interview_sessions(session_status);

-- Enable Row Level Security (RLS)
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for calendar_events
CREATE POLICY "Users can view their own calendar events" ON calendar_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar events" ON calendar_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar events" ON calendar_events
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar events" ON calendar_events
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for goals
CREATE POLICY "Users can view their own goals" ON goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON goals
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for goal_milestones
CREATE POLICY "Users can view milestones of their own goals" ON goal_milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM goals 
            WHERE goals.id = goal_milestones.goal_id 
            AND goals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert milestones for their own goals" ON goal_milestones
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM goals 
            WHERE goals.id = goal_milestones.goal_id 
            AND goals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update milestones of their own goals" ON goal_milestones
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM goals 
            WHERE goals.id = goal_milestones.goal_id 
            AND goals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete milestones of their own goals" ON goal_milestones
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM goals 
            WHERE goals.id = goal_milestones.goal_id 
            AND goals.user_id = auth.uid()
        )
    );

-- Create RLS policies for interview_sessions
CREATE POLICY "Users can view their own interview sessions" ON interview_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interview sessions" ON interview_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview sessions" ON interview_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview sessions" ON interview_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_calendar_events_updated_at 
    BEFORE UPDATE ON calendar_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at 
    BEFORE UPDATE ON goals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goal_milestones_updated_at 
    BEFORE UPDATE ON goal_milestones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for demo
INSERT INTO calendar_events (user_id, title, description, event_date, event_time, event_type, priority, related_module) VALUES
(
    (SELECT id FROM auth.users LIMIT 1),
    'Simulación de Entrevista - Frontend Developer',
    'Práctica de entrevista para posición en startup tecnológica',
    NOW() + INTERVAL '3 days',
    '10:00',
    'interview',
    'high',
    'interview-simulator'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'Completar Test de Personalidad Big Five',
    'Evaluación pendiente para completar perfil profesional',
    NOW() + INTERVAL '1 day',
    '14:30',
    'assessment',
    'medium',
    'big-five-test'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'Sesión con AI Career Coach',
    'Revisión de progreso mensual y planificación de objetivos',
    NOW() + INTERVAL '5 days',
    '16:00',
    'coaching',
    'medium',
    'career-coach'
);

INSERT INTO goals (user_id, title, description, target_date, progress, category) VALUES
(
    (SELECT id FROM auth.users LIMIT 1),
    'Transición a Data Science',
    'Cambiar de carrera hacia Data Science con enfoque en Machine Learning',
    NOW() + INTERVAL '6 months',
    65,
    'career'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'Mejorar Habilidades de Comunicación',
    'Desarrollar habilidades blandas para liderazgo y presentaciones',
    NOW() + INTERVAL '3 months',
    80,
    'skills'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'Networking Profesional',
    'Expandir red de contactos en la industria tecnológica',
    NOW() + INTERVAL '4 months',
    40,
    'networking'
);

-- Insert sample milestones
INSERT INTO goal_milestones (goal_id, title, completed, completed_date, order_index) VALUES
(
    (SELECT id FROM goals WHERE title = 'Transición a Data Science' LIMIT 1),
    'Completar curso de Python',
    TRUE,
    NOW() - INTERVAL '2 months',
    1
),
(
    (SELECT id FROM goals WHERE title = 'Transición a Data Science' LIMIT 1),
    'Aprender SQL avanzado',
    TRUE,
    NOW() - INTERVAL '1 month',
    2
),
(
    (SELECT id FROM goals WHERE title = 'Transición a Data Science' LIMIT 1),
    'Proyecto de Machine Learning',
    FALSE,
    NULL,
    3
),
(
    (SELECT id FROM goals WHERE title = 'Transición a Data Science' LIMIT 1),
    'Certificación en Data Science',
    FALSE,
    NULL,
    4
),
(
    (SELECT id FROM goals WHERE title = 'Transición a Data Science' LIMIT 1),
    'Portfolio completo',
    FALSE,
    NULL,
    5
);

COMMENT ON TABLE calendar_events IS 'Stores user calendar events, reminders, and scheduled activities';
COMMENT ON TABLE goals IS 'Stores user professional goals and objectives';
COMMENT ON TABLE goal_milestones IS 'Stores milestones and sub-tasks for user goals';
COMMENT ON TABLE interview_sessions IS 'Stores interview simulation sessions and results';
