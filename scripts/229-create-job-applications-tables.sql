-- Create job applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id VARCHAR(20) UNIQUE NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    candidate_name VARCHAR(255) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    candidate_phone VARCHAR(50),
    resume_url TEXT,
    cover_letter TEXT,
    linkedin_profile VARCHAR(500),
    portfolio_url VARCHAR(500),
    years_experience INTEGER,
    current_company VARCHAR(255),
    current_position VARCHAR(255),
    salary_expectation INTEGER,
    availability_date DATE,
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
    updated_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create application interviews table
CREATE TABLE IF NOT EXISTS application_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    interview_type VARCHAR(100) NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 60,
    interviewer_name VARCHAR(255),
    interviewer_email VARCHAR(255),
    meeting_link VARCHAR(500),
    location VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_applications_application_id ON job_applications(application_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(candidate_email);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_application_status_history_application_id ON application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_application_interviews_application_id ON application_interviews(application_id);

-- Function to generate application ID
CREATE OR REPLACE FUNCTION generate_application_id()
RETURNS VARCHAR(20) AS $$
DECLARE
    new_id VARCHAR(20);
    exists_check INTEGER;
BEGIN
    LOOP
        new_id := 'APP-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        SELECT COUNT(*) INTO exists_check FROM job_applications WHERE application_id = new_id;
        EXIT WHEN exists_check = 0;
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update application status
CREATE OR REPLACE FUNCTION update_application_status(
    app_id UUID,
    new_status VARCHAR(50),
    status_notes TEXT DEFAULT NULL,
    updated_by_user VARCHAR(255) DEFAULT 'system'
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Update the main application status
    UPDATE job_applications 
    SET status = new_status, updated_at = NOW()
    WHERE id = app_id;
    
    -- Insert status history record
    INSERT INTO application_status_history (application_id, status, notes, updated_by)
    VALUES (app_id, new_status, status_notes, updated_by_user);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get application details with history
CREATE OR REPLACE FUNCTION get_application_details(app_id VARCHAR(20))
RETURNS TABLE(
    id UUID,
    application_id VARCHAR(20),
    job_title VARCHAR(255),
    department VARCHAR(100),
    candidate_name VARCHAR(255),
    candidate_email VARCHAR(255),
    candidate_phone VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    status_history JSONB,
    interviews JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ja.id,
        ja.application_id,
        ja.job_title,
        ja.department,
        ja.candidate_name,
        ja.candidate_email,
        ja.candidate_phone,
        ja.status,
        ja.created_at,
        ja.updated_at,
        COALESCE(
            (SELECT jsonb_agg(
                jsonb_build_object(
                    'status', ash.status,
                    'notes', ash.notes,
                    'updated_by', ash.updated_by,
                    'created_at', ash.created_at
                ) ORDER BY ash.created_at DESC
            ) FROM application_status_history ash WHERE ash.application_id = ja.id),
            '[]'::jsonb
        ) as status_history,
        COALESCE(
            (SELECT jsonb_agg(
                jsonb_build_object(
                    'interview_type', ai.interview_type,
                    'scheduled_date', ai.scheduled_date,
                    'duration_minutes', ai.duration_minutes,
                    'interviewer_name', ai.interviewer_name,
                    'interviewer_email', ai.interviewer_email,
                    'meeting_link', ai.meeting_link,
                    'location', ai.location,
                    'status', ai.status,
                    'notes', ai.notes
                ) ORDER BY ai.scheduled_date ASC
            ) FROM application_interviews ai WHERE ai.application_id = ja.id),
            '[]'::jsonb
        ) as interviews
    FROM job_applications ja
    WHERE ja.application_id = app_id;
END;
$$ LANGUAGE plpgsql;
