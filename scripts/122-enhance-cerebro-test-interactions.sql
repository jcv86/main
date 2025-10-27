-- Enhance Cerebro with better test interactions and Chilean market context
-- Fixed version without complex foreign key dependencies

-- Add Chilean market insights table
CREATE TABLE IF NOT EXISTS cerebro_market_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry VARCHAR(100) NOT NULL,
  role_category VARCHAR(100),
  insight_type VARCHAR(50), -- 'salary', 'demand', 'skills', 'trends'
  content TEXT NOT NULL,
  data_points JSONB, -- Statistical data
  source VARCHAR(200),
  confidence_score NUMERIC(3,2) DEFAULT 0.80,
  region VARCHAR(50) DEFAULT 'Chile',
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add test combination insights (when user completes multiple tests)
CREATE TABLE IF NOT EXISTS cerebro_test_combinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_combination VARCHAR(200) NOT NULL UNIQUE, -- e.g., 'disc+mbti+big-five'
  pattern_name VARCHAR(100),
  description TEXT,
  career_paths JSONB, -- Recommended careers for this combination
  success_indicators JSONB,
  development_focus JSONB,
  examples JSONB, -- Real-world examples
  confidence_score NUMERIC(3,2) DEFAULT 0.85,
  sample_size INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced test analysis with cross-test insights
CREATE TABLE IF NOT EXISTS cerebro_cross_test_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL, -- Using email instead of UUID for compatibility
  test_types TEXT[], -- Array of completed tests
  combined_profile JSONB, -- Synthesized personality/skills profile
  career_alignment_score INTEGER, -- 0-100
  top_career_matches JSONB,
  skill_gaps JSONB,
  development_priorities JSONB,
  market_fit_analysis JSONB, -- How well they fit Chilean market
  generated_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Populate Chilean market insights
INSERT INTO cerebro_market_insights (industry, role_category, insight_type, content, data_points, source) VALUES
('Tecnología', 'Desarrollo de Software', 'demand', 
 'La demanda de desarrolladores de software en Chile ha crecido un 45% en los últimos 2 años, especialmente en áreas de cloud computing, IA y desarrollo móvil.',
 '{"growth_rate": 45, "avg_salary_clp": 2500000, "top_skills": ["Python", "JavaScript", "AWS", "React"]}',
 'Encuesta Salarial Chile 2024'),

('Tecnología', 'Data Science', 'salary',
 'Los científicos de datos en Chile ganan entre $2.5M y $4.5M CLP mensuales, con alta demanda en retail, fintech y e-commerce.',
 '{"salary_min": 2500000, "salary_max": 4500000, "demand_level": "high", "growth_projection": "30%"}',
 'Estudio Mercado Laboral TI Chile 2024'),

('Finanzas', 'Analista Financiero', 'skills',
 'Las habilidades más demandadas incluyen modelamiento financiero, Excel avanzado, Power BI, y conocimiento de normativa chilena (CMF, SII).',
 '{"top_skills": ["Excel", "Power BI", "Modelamiento Financiero", "Normativa CMF"], "certifications": ["CFA", "Diplomado Finanzas"]}',
 'LinkedIn Chile Insights 2024'),

('Marketing', 'Marketing Digital', 'trends',
 'El marketing digital en Chile se enfoca en redes sociales (Instagram, TikTok), SEO local, y e-commerce. Crecimiento del 35% anual.',
 '{"growth_rate": 35, "hot_platforms": ["Instagram", "TikTok", "Google Ads"], "avg_budget_increase": "40%"}',
 'Asociación Chilena de Marketing Digital'),

('Recursos Humanos', 'Gestión de Personas', 'demand',
 'Alta demanda de profesionales de RRHH con enfoque en cultura organizacional, bienestar laboral y transformación digital.',
 '{"demand_level": "high", "key_focus": ["Cultura", "Bienestar", "Digital"], "salary_range": [1800000, 3200000]}',
 'Estudio Great Place to Work Chile 2024'),

('Educación', 'Docencia y Capacitación', 'trends',
 'Crecimiento en educación online y capacitación corporativa. Demanda de facilitadores con habilidades digitales.',
 '{"growth_rate": 28, "modalities": ["Online", "Híbrido", "Corporativo"], "avg_salary": 1800000}',
 'Ministerio de Educación Chile 2024'),

('Salud', 'Profesionales de la Salud', 'demand',
 'Alta demanda de profesionales de salud mental, telemedicina y gestión sanitaria post-pandemia.',
 '{"demand_level": "very_high", "specialties": ["Salud Mental", "Telemedicina", "Gestión"], "salary_range": [2000000, 4000000]}',
 'Colegio Médico de Chile 2024')
ON CONFLICT (id) DO NOTHING;

-- Populate test combination patterns
INSERT INTO cerebro_test_combinations (test_combination, pattern_name, description, career_paths, development_focus) VALUES
('disc+mbti+big-five', 'Líder Analítico Empático',
 'Perfil de liderazgo con alta capacidad analítica, empatía y orientación a resultados. Excelente para roles de gestión estratégica.',
 '{"careers": ["Gerente General", "Director de Operaciones", "Consultor Senior", "Product Manager"], "industries": ["Tecnología", "Consultoría", "Finanzas"]}',
 '{"priorities": ["Desarrollo de visión estratégica", "Comunicación ejecutiva", "Gestión de cambio"], "timeframe": "6-12 meses"}'),

('disc+riasec+soft-skills', 'Profesional Técnico con Habilidades Blandas',
 'Combinación de competencias técnicas con fuertes habilidades interpersonales. Ideal para roles técnicos con interacción cliente.',
 '{"careers": ["Ingeniero de Soluciones", "Consultor Técnico", "Account Manager Técnico", "Scrum Master"], "industries": ["Tecnología", "Servicios Profesionales"]}',
 '{"priorities": ["Certificaciones técnicas", "Presentaciones efectivas", "Negociación"], "timeframe": "3-9 meses"}'),

('mbti+emotional-intelligence+soft-skills', 'Coach y Mentor Natural',
 'Alta inteligencia emocional combinada con habilidades de comunicación. Perfecto para roles de desarrollo de personas.',
 '{"careers": ["Coach Ejecutivo", "Gerente de RRHH", "Facilitador de Aprendizaje", "Consultor Organizacional"], "industries": ["Consultoría", "Educación", "RRHH"]}',
 '{"priorities": ["Certificación en coaching", "Psicología organizacional", "Facilitación de grupos"], "timeframe": "6-18 meses"}'),

('big-five+riasec', 'Explorador Vocacional Consciente',
 'Perfil con claridad sobre rasgos de personalidad y preferencias vocacionales. Ideal para transiciones de carrera.',
 '{"careers": ["Consultor de Carrera", "Emprendedor", "Especialista en Desarrollo Organizacional"], "industries": ["Consultoría", "Startups", "Educación"]}',
 '{"priorities": ["Exploración de industrias", "Networking estratégico", "Desarrollo de marca personal"], "timeframe": "3-6 meses"}'),

('disc+emotional-intelligence', 'Comunicador Empático',
 'Excelente en comunicación y gestión de relaciones. Perfecto para roles de cara al cliente y gestión de equipos.',
 '{"careers": ["Customer Success Manager", "Gerente de Cuentas", "Líder de Equipo", "Facilitador"], "industries": ["Servicios", "Tecnología", "Consultoría"]}',
 '{"priorities": ["Técnicas de negociación", "Gestión de conflictos", "Liderazgo situacional"], "timeframe": "4-8 meses"}')
ON CONFLICT (test_combination) DO NOTHING;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_insights_industry ON cerebro_market_insights(industry);
CREATE INDEX IF NOT EXISTS idx_market_insights_type ON cerebro_market_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_market_insights_region ON cerebro_market_insights(region);
CREATE INDEX IF NOT EXISTS idx_test_combinations_combo ON cerebro_test_combinations(test_combination);
CREATE INDEX IF NOT EXISTS idx_cross_test_user_email ON cerebro_cross_test_analysis(user_email);
CREATE INDEX IF NOT EXISTS idx_cross_test_generated ON cerebro_cross_test_analysis(generated_at);

-- Add comments for documentation
COMMENT ON TABLE cerebro_market_insights IS 'Chilean market insights for career guidance - includes salary data, demand trends, and skill requirements';
COMMENT ON TABLE cerebro_test_combinations IS 'Patterns and insights for specific test combinations - helps identify career paths based on multiple assessments';
COMMENT ON TABLE cerebro_cross_test_analysis IS 'Cross-test analysis combining multiple assessment results for comprehensive career guidance';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Cerebro enhancement completed successfully!';
  RAISE NOTICE 'Created tables: cerebro_market_insights, cerebro_test_combinations, cerebro_cross_test_analysis';
  RAISE NOTICE 'Populated % market insights', (SELECT COUNT(*) FROM cerebro_market_insights);
  RAISE NOTICE 'Populated % test combination patterns', (SELECT COUNT(*) FROM cerebro_test_combinations);
END $$;
