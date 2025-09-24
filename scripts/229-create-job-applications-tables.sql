-- Create job applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id VARCHAR(20) UNIQUE NOT NULL,
    job_id VARCHAR(100) NOT NULL,
    job_title VARCHAR(200) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    linkedin VARCHAR(500),
    portfolio VARCHAR(500),
    experience TEXT NOT NULL,
    motivation TEXT NOT NULL,
    availability VARCHAR(50) NOT NULL,
    expected_salary VARCHAR(100),
    cv_filename VARCHAR(255),
    cv_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create application status history table
CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS application_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    interview_type VARCHAR(50) NOT NULL, -- 'phone', 'technical', 'final'
    scheduled_date TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 60,
    interviewer_name VARCHAR(100),
    interviewer_email VARCHAR(255),
    meeting_link VARCHAR(500),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'rescheduled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_applications_application_id ON job_applications(application_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_application_status_history_application_id ON application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_application_interviews_application_id ON application_interviews(application_id);

-- Function to generate application ID
CREATE OR REPLACE FUNCTION generate_application_id() RETURNS VARCHAR(20) AS $$
DECLARE
    new_id VARCHAR(20);
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate ID in format: APP-YYYY-XXXXXX (APP-2024-123456)
        new_id := 'APP-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(FLOOR(RANDOM() * 999999 + 1)::TEXT, 6, '0');
        
        -- Check if ID already exists
        SELECT COUNT(*) INTO exists_check FROM job_applications WHERE application_id = new_id;
        
        -- If ID doesn't exist, break the loop
        IF exists_check = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically set application_id before insert
CREATE OR REPLACE FUNCTION set_application_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_id IS NULL OR NEW.application_id = '' THEN
        NEW.application_id := generate_application_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate application_id
DROP TRIGGER IF EXISTS trigger_set_application_id ON job_applications;
CREATE TRIGGER trigger_set_application_id
    BEFORE INSERT ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION set_application_id();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS trigger_update_job_applications_updated_at ON job_applications;
CREATE TRIGGER trigger_update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_application_interviews_updated_at ON application_interviews;
CREATE TRIGGER trigger_update_application_interviews_updated_at
    BEFORE UPDATE ON application_interviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create status history entry
CREATE OR REPLACE FUNCTION create_status_history() RETURNS TRIGGER AS $$
BEGIN
    -- Insert into status history when status changes
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
        INSERT INTO application_status_history (application_id, status, notes, changed_by)
        VALUES (NEW.id, NEW.status, 'Status changed automatically', 'system');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status history
DROP TRIGGER IF EXISTS trigger_create_status_history ON job_applications;
CREATE TRIGGER trigger_create_status_history
    AFTER INSERT OR UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION create_status_history();

-- Insert some sample data for testing
INSERT INTO job_applications (
    job_id, job_title, first_name, last_name, email, phone, 
    experience, motivation, availability, expected_salary, status
) VALUES 
(
    'senior-software-engineer', 
    'Ingeniero de Software Senior',
    'Juan',
    'Pérez',
    'juan.perez@email.com',
    '+56912345678',
    'Tengo 6 años de experiencia desarrollando aplicaciones web con React y Node.js. He trabajado en startups y empresas grandes, liderando equipos de desarrollo.',
    'Me interesa esta posición porque quiero contribuir al crecimiento profesional de otros desarrolladores y trabajar con tecnologías de vanguardia.',
    '2-semanas',
    '$4.000.000 CLP',
    'under_review'
),
(
    'product-manager',
    'Product Manager',
    'María',
    'González',
    'maria.gonzalez@email.com',
    '+56987654321',
    'Soy Product Manager con 4 años de experiencia en productos SaaS B2B. He liderado el lanzamiento de 3 productos exitosos.',
    'Esta oportunidad me emociona porque combina mi pasión por el producto con el impacto social del desarrollo profesional.',
    'inmediata',
    '$3.500.000 CLP',
    'interview_scheduled'
);

-- Update one application to have interview scheduled
DO $$
DECLARE
    app_id UUID;
BEGIN
    SELECT id INTO app_id FROM job_applications WHERE email = 'maria.gonzalez@email.com' LIMIT 1;
    
    IF app_id IS NOT NULL THEN
        INSERT INTO application_interviews (
            application_id, interview_type, scheduled_date, 
            interviewer_name, interviewer_email, meeting_link
        ) VALUES (
            app_id,
            'phone',
            NOW() + INTERVAL '2 days',
            'Ana Rodríguez',
            'ana.rodriguez@company.com',
            'https://meet.google.com/abc-defg-hij'
        );
    END IF;
END $$;

-- Verify the setup
SELECT 'Applications table created successfully' as status;
SELECT COUNT(*) as total_applications FROM job_applications;
SELECT COUNT(*) as total_status_history FROM application_status_history;
SELECT COUNT(*) as total_interviews FROM application_interviews;
