-- Add RIASEC test support to the database
-- This script ensures RIASEC test results are properly stored and integrated with AI coaching

-- Create RIASEC-specific results table for detailed analysis
CREATE TABLE IF NOT EXISTS riasec_results (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    r_score INTEGER NOT NULL, -- Realistic
    i_score INTEGER NOT NULL, -- Investigative
    a_score INTEGER NOT NULL, -- Artistic
    s_score INTEGER NOT NULL, -- Social
    e_score INTEGER NOT NULL, -- Enterprising
    c_score INTEGER NOT NULL, -- Conventional
    holland_code VARCHAR(3) NOT NULL, -- e.g., 'IEA'
    primary_interests JSONB NOT NULL,
    secondary_interests JSONB,
    personality_summary TEXT,
    career_recommendations JSONB,
    work_environments JSONB,
    strengths JSONB,
    work_values JSONB,
    development_areas JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for RIASEC results
CREATE INDEX IF NOT EXISTS idx_riasec_results_user_email ON riasec_results(user_email);
CREATE INDEX IF NOT EXISTS idx_riasec_results_holland_code ON riasec_results(holland_code);
CREATE INDEX IF NOT EXISTS idx_riasec_results_created_at ON riasec_results(created_at);

-- Function to automatically create RIASEC detailed results when test is completed
CREATE OR REPLACE FUNCTION create_riasec_detailed_results()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process RIASEC test results
    IF NEW.test_name = 'RIASEC' THEN
        INSERT INTO riasec_results (
            user_email,
            r_score,
            i_score,
            a_score,
            s_score,
            e_score,
            c_score,
            holland_code,
            primary_interests,
            secondary_interests,
            personality_summary,
            career_recommendations,
            work_environments,
            strengths,
            work_values,
            development_areas
        ) VALUES (
            NEW.user_email,
            COALESCE((NEW.results->>'R')::INTEGER, 0),
            COALESCE((NEW.results->>'I')::INTEGER, 0),
            COALESCE((NEW.results->>'A')::INTEGER, 0),
            COALESCE((NEW.results->>'S')::INTEGER, 0),
            COALESCE((NEW.results->>'E')::INTEGER, 0),
            COALESCE((NEW.results->>'C')::INTEGER, 0),
            COALESCE(NEW.results->>'holland_code', ''),
            COALESCE(NEW.results->'primary_interests', '[]'::jsonb),
            COALESCE(NEW.results->'secondary_interests', '[]'::jsonb),
            COALESCE(NEW.results->>'personality_summary', ''),
            COALESCE(NEW.results->'career_recommendations', '[]'::jsonb),
            COALESCE(NEW.results->'work_environments', '[]'::jsonb),
            COALESCE(NEW.results->'strengths', '[]'::jsonb),
            COALESCE(NEW.results->'work_values', '[]'::jsonb),
            COALESCE(NEW.results->'development_areas', '[]'::jsonb)
        )
        ON CONFLICT (user_email) DO UPDATE SET
            r_score = EXCLUDED.r_score,
            i_score = EXCLUDED.i_score,
            a_score = EXCLUDED.a_score,
            s_score = EXCLUDED.s_score,
            e_score = EXCLUDED.e_score,
            c_score = EXCLUDED.c_score,
            holland_code = EXCLUDED.holland_code,
            primary_interests = EXCLUDED.primary_interests,
            secondary_interests = EXCLUDED.secondary_interests,
            personality_summary = EXCLUDED.personality_summary,
            career_recommendations = EXCLUDED.career_recommendations,
            work_environments = EXCLUDED.work_environments,
            strengths = EXCLUDED.strengths,
            work_values = EXCLUDED.work_values,
            development_areas = EXCLUDED.development_areas,
            updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for RIASEC results
DROP TRIGGER IF EXISTS trigger_create_riasec_detailed_results ON test_results;
CREATE TRIGGER trigger_create_riasec_detailed_results
    AFTER INSERT OR UPDATE ON test_results
    FOR EACH ROW
    EXECUTE FUNCTION create_riasec_detailed_results();

-- Add unique constraint to prevent duplicate RIASEC results per user
ALTER TABLE riasec_results 
ADD CONSTRAINT unique_riasec_per_user UNIQUE (user_email);

-- Insert sample RIASEC data for Travis
INSERT INTO test_results (user_email, test_name, test_type, score, results, completed_at, duration_minutes) VALUES
('travis@dtcfinal.com', 'RIASEC', 'vocational', 78, '{
    "R": 65,
    "I": 85,
    "A": 75,
    "S": 70,
    "E": 80,
    "C": 60,
    "holland_code": "IEA",
    "primary_interests": ["Investigativo", "Emprendedor", "Artístico"],
    "secondary_interests": ["Social"],
    "personality_summary": "Perfil de innovador emprendedor con fuerte orientación hacia la investigación y la creatividad.",
    "career_recommendations": [
        "Consultor de Innovación",
        "Director de I+D",
        "Emprendedor Tecnológico",
        "Arquitecto de Soluciones",
        "Product Manager",
        "Consultor de Estrategia"
    ],
    "work_environments": [
        "Startups tecnológicas",
        "Departamentos de innovación",
        "Consultorías estratégicas",
        "Centros de investigación aplicada",
        "Empresas de diseño y creatividad"
    ],
    "strengths": [
        "Excelente capacidad para identificar oportunidades",
        "Habilidad natural para generar ideas innovadoras",
        "Facilidad para conectar conceptos complejos",
        "Motivación intrínseca para resolver problemas"
    ],
    "work_values": [
        "Autonomía e independencia",
        "Oportunidades de crecimiento",
        "Impacto y significado del trabajo",
        "Flexibilidad y variedad"
    ],
    "development_areas": [
        "Desarrollar mayor paciencia con procesos rutinarios",
        "Mejorar habilidades de implementación práctica",
        "Fortalecer la atención al detalle en tareas administrativas"
    ]
}', NOW() - INTERVAL '2 days', 12)
ON CONFLICT (user_email, test_name) DO UPDATE SET
    score = EXCLUDED.score,
    results = EXCLUDED.results,
    completed_at = EXCLUDED.completed_at,
    duration_minutes = EXCLUDED.duration_minutes;

-- Generate AI insights for RIASEC
INSERT INTO ai_insights (user_email, insight_type, insight_title, insight_content, confidence_score, source_tests) VALUES
('travis@dtcfinal.com', 'career', 'Perfil IEA - Innovador Emprendedor', 'Tu código Holland IEA indica una combinación poderosa: la curiosidad investigativa, el impulso emprendedor y la creatividad artística. Esta combinación es ideal para roles de liderazgo en innovación.', 94, '["RIASEC"]'),
('travis@dtcfinal.com', 'development', 'Equilibrio Investigación-Acción', 'Para maximizar tu potencial IEA, busca roles que te permitan investigar tendencias, desarrollar estrategias innovadoras y liderar su implementación creativa.', 89, '["RIASEC"]'),
('travis@dtcfinal.com', 'compatibility', 'Equipos de Innovación', 'Tu perfil RIASEC sugiere que destacas en equipos multidisciplinarios donde puedes combinar análisis profundo con visión empresarial y soluciones creativas.', 91, '["RIASEC"]')
ON CONFLICT DO NOTHING;

-- Update user activities
INSERT INTO user_activities (user_email, activity_type, activity_description, xp_earned) VALUES
('travis@dtcfinal.com', 'test_completed', 'Completó el Test RIASEC con código Holland IEA - Puntuación: 78%', 50)
ON CONFLICT DO NOTHING;

-- Function to get comprehensive career recommendations based on all tests
CREATE OR REPLACE FUNCTION get_comprehensive_career_recommendations(p_user_email VARCHAR(255))
RETURNS JSONB AS $$
DECLARE
    recommendations JSONB;
BEGIN
    SELECT jsonb_build_object(
        'riasec_recommendations', (
            SELECT career_recommendations
            FROM riasec_results
            WHERE user_email = p_user_email
        ),
        'personality_based', (
            SELECT jsonb_agg(DISTINCT jsonb_extract_path_text(results, 'career_recommendations'))
            FROM test_results
            WHERE user_email = p_user_email
            AND test_name IN ('Big Five', 'MBTI')
        ),
        'behavioral_style', (
            SELECT jsonb_extract_path(results, 'career_recommendations')
            FROM test_results
            WHERE user_email = p_user_email
            AND test_name = 'DISC'
        ),
        'integrated_analysis', 'Análisis integrado pendiente de generación por IA'
    ) INTO recommendations;
    
    RETURN recommendations;
END;
$$ LANGUAGE plpgsql;

COMMIT;
