-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    location TEXT DEFAULT 'Chile',
    bio TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create CV data table for Chilean market
CREATE TABLE IF NOT EXISTS public.cv_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    personal_info JSONB DEFAULT '{}',
    education JSONB DEFAULT '[]',
    experience JSONB DEFAULT '[]',
    skills JSONB DEFAULT '[]',
    languages JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    projects JSONB DEFAULT '[]',
    template_id TEXT DEFAULT 'modern',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create assessment results table
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    assessment_type TEXT NOT NULL, -- 'personality', 'disc', 'soft_skills', 'technical_skills'
    results JSONB NOT NULL,
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coaching sessions table for Chilean market
CREATE TABLE IF NOT EXISTS public.coaching_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_title TEXT DEFAULT 'Coaching de Carrera - Mercado Chileno',
    session_summary TEXT,
    total_messages INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coaching conversations table
CREATE TABLE IF NOT EXISTS public.coaching_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.coaching_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table with Chilean companies
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    currency TEXT DEFAULT 'CLP',
    type TEXT DEFAULT 'full-time',
    remote BOOLEAN DEFAULT false,
    description TEXT,
    requirements TEXT[],
    benefits TEXT[],
    posted_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own CV data" ON public.cv_data;
DROP POLICY IF EXISTS "Users can update own CV data" ON public.cv_data;
DROP POLICY IF EXISTS "Users can insert own CV data" ON public.cv_data;
DROP POLICY IF EXISTS "Users can view own assessment results" ON public.assessment_results;
DROP POLICY IF EXISTS "Users can insert own assessment results" ON public.assessment_results;
DROP POLICY IF EXISTS "Users can view own coaching sessions" ON public.coaching_sessions;
DROP POLICY IF EXISTS "Users can update own coaching sessions" ON public.coaching_sessions;
DROP POLICY IF EXISTS "Users can insert own coaching sessions" ON public.coaching_sessions;
DROP POLICY IF EXISTS "Users can view own coaching conversations" ON public.coaching_conversations;
DROP POLICY IF EXISTS "Users can insert own coaching conversations" ON public.coaching_conversations;
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can update own job posts" ON public.jobs;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for CV data
CREATE POLICY "Users can view own CV data" ON public.cv_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own CV data" ON public.cv_data
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CV data" ON public.cv_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for assessment results
CREATE POLICY "Users can view own assessment results" ON public.assessment_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessment results" ON public.assessment_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for coaching sessions
CREATE POLICY "Users can view own coaching sessions" ON public.coaching_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own coaching sessions" ON public.coaching_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coaching sessions" ON public.coaching_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for coaching conversations
CREATE POLICY "Users can view own coaching conversations" ON public.coaching_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coaching conversations" ON public.coaching_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for jobs (public read, authenticated insert/update)
CREATE POLICY "Anyone can view active jobs" ON public.jobs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can insert jobs" ON public.jobs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own job posts" ON public.jobs
    FOR UPDATE USING (auth.uid() = posted_by);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email
    );
    
    INSERT INTO public.cv_data (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_cv_data_updated_at ON public.cv_data;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cv_data_updated_at BEFORE UPDATE ON public.cv_data
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to ensure user session for coaching
CREATE OR REPLACE FUNCTION public.ensure_user_session(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
    session_id UUID;
BEGIN
    -- Try to get existing session
    SELECT id INTO session_id
    FROM public.coaching_sessions
    WHERE user_id = p_user_id
    ORDER BY last_activity DESC
    LIMIT 1;
    
    -- If no session exists, create one
    IF session_id IS NULL THEN
        INSERT INTO public.coaching_sessions (user_id, session_title, session_summary)
        VALUES (
            p_user_id,
            'Coaching de Carrera - Mercado Chileno',
            'Sesión enfocada en oportunidades profesionales en Chile'
        )
        RETURNING id INTO session_id;
    END IF;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clear existing job data to avoid duplicates
DELETE FROM public.jobs WHERE company IN ('NotCo', 'Fintual', 'Cornershop by Uber', 'Banco de Chile', 'Ripley', 'Bci', 'Mercado Libre Chile', 'Pedidos Ya', 'Falabella', 'Entel');

-- Insert sample Chilean job data
INSERT INTO public.jobs (title, company, location, salary_min, salary_max, currency, type, remote, description, requirements, benefits) VALUES
('Desarrollador Full Stack Senior', 'NotCo', 'Santiago, Chile', 2500000, 4000000, 'CLP', 'full-time', true, 'Únete al unicornio chileno que está revolucionando la industria alimentaria con tecnología de vanguardia. Trabajarás en el desarrollo de plataformas que impactan millones de usuarios en Latinoamérica.', ARRAY['React', 'Node.js', 'TypeScript', 'AWS', 'Inglés intermedio'], ARRAY['Seguro de salud complementario', 'Vacaciones flexibles', 'Stock options', 'Trabajo remoto']),
('Tech Lead Frontend', 'Fintual', 'Santiago, Chile', 3500000, 5500000, 'CLP', 'full-time', false, 'Lidera el equipo frontend de la fintech más innovadora de Chile. Ayuda a democratizar las inversiones y construye productos que simplifican las finanzas personales.', ARRAY['React', 'TypeScript', 'Leadership', 'Fintech experience', 'Inglés avanzado'], ARRAY['Seguro de salud premium', 'Bonos por performance', 'Capacitación continua', 'Oficina en Las Condes']),
('Desarrollador Backend Python', 'Cornershop by Uber', 'Santiago, Chile', 2200000, 3800000, 'CLP', 'full-time', true, 'Desarrolla la plataforma de delivery líder en Latinoamérica. Construye sistemas escalables que conectan millones de usuarios con sus productos favoritos.', ARRAY['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'], ARRAY['Seguro de salud', 'Descuentos en Uber', 'Trabajo híbrido', 'Bonos trimestrales']),
('Data Scientist', 'Banco de Chile', 'Santiago, Chile', 2800000, 4200000, 'CLP', 'full-time', false, 'Impulsa la transformación digital del sector bancario chileno. Utiliza machine learning y analytics para mejorar la experiencia de nuestros clientes.', ARRAY['Python', 'R', 'Machine Learning', 'SQL', 'Tableau'], ARRAY['Seguro de salud familiar', 'Préstamos preferenciales', 'Capacitación internacional', 'Estabilidad laboral']),
('UX/UI Designer', 'Ripley', 'Santiago, Chile', 1800000, 2800000, 'CLP', 'full-time', false, 'Diseña experiencias digitales para el retail más grande de Chile. Crea interfaces que mejoran la vida de millones de chilenos en sus compras online y offline.', ARRAY['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems'], ARRAY['Descuentos en tiendas', 'Seguro de salud', 'Horario flexible', 'Capacitación en diseño']),
('DevOps Engineer', 'Bci', 'Santiago, Chile', 2600000, 4000000, 'CLP', 'full-time', true, 'Moderniza la infraestructura tecnológica del banco más innovador de Chile. Implementa soluciones cloud que soportan millones de transacciones diarias.', ARRAY['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'], ARRAY['Seguro de salud premium', 'Bonos por objetivos', 'Trabajo remoto', 'Certificaciones AWS']),
('Product Manager', 'Mercado Libre Chile', 'Santiago, Chile', 3200000, 4800000, 'CLP', 'full-time', false, 'Define la estrategia de productos para el marketplace líder de Latinoamérica en Chile. Impulsa la innovación en e-commerce y fintech.', ARRAY['Product Management', 'Analytics', 'Agile', 'E-commerce', 'Inglés avanzado'], ARRAY['Seguro de salud premium', 'Stock options', 'Capacitación internacional', 'Bonos anuales']),
('Desarrollador Mobile React Native', 'Pedidos Ya', 'Santiago, Chile', 2000000, 3200000, 'CLP', 'full-time', true, 'Desarrolla la app de delivery más usada en Chile. Crea funcionalidades que conectan restaurantes, repartidores y usuarios en tiempo real.', ARRAY['React Native', 'JavaScript', 'Redux', 'Firebase', 'Git'], ARRAY['Seguro de salud', 'Descuentos en pedidos', 'Trabajo remoto', 'Capacitación técnica']),
('Cybersecurity Analyst', 'Falabella', 'Santiago, Chile', 2400000, 3600000, 'CLP', 'full-time', false, 'Protege la infraestructura digital del grupo retail más grande de Sudamérica. Implementa soluciones de seguridad para proteger datos de millones de clientes.', ARRAY['Cybersecurity', 'SIEM', 'Incident Response', 'Risk Assessment', 'Certificaciones de seguridad'], ARRAY['Seguro de salud familiar', 'Descuentos en tiendas', 'Capacitación en seguridad', 'Estabilidad laboral']),
('Machine Learning Engineer', 'Entel', 'Santiago, Chile', 2800000, 4200000, 'CLP', 'full-time', false, 'Desarrolla soluciones de IA para la telco líder en Chile. Implementa modelos de machine learning que optimizan la red y mejoran la experiencia del cliente.', ARRAY['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Big Data'], ARRAY['Seguro de salud premium', 'Plan de telefonía', 'Capacitación en IA', 'Bonos por innovación']);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
