-- Seed Advanced Market Intelligence Data
-- Datos avanzados del mercado tech chileno 2024

-- Insert comprehensive market intelligence
INSERT INTO market_intelligence (category, title, description, data, relevance_score, source, tags) VALUES

-- SALARY DATA
('salary', 'Salarios Frontend 2024 - Incremento 22%', 'Análisis completo de salarios frontend con incremento significativo', 
 '{"junior": {"min": 1800000, "max": 2500000, "growth": "22%"}, "senior": {"min": 3000000, "max": 4500000, "growth": "22%"}, "lead": {"min": 5500000, "max": 8000000, "growth": "25%"}}', 
 95, 'Encuesta Salarial Tech Chile 2024', ARRAY['frontend', 'salarios', 'react', 'javascript']),

('salary', 'Salarios Backend 2024 - Crecimiento Sostenido', 'Backend mantiene crecimiento sólido con alta demanda', 
 '{"junior": {"min": 2000000, "max": 2800000, "growth": "18%"}, "senior": {"min": 4000000, "max": 6000000, "growth": "18%"}, "architect": {"min": 6000000, "max": 9000000, "growth": "28%"}}', 
 93, 'Análisis Mercado Backend Chile', ARRAY['backend', 'salarios', 'python', 'node.js']),

('salary', 'AI/ML Engineers - Premium Salarial 35%', 'Roles de IA/ML con el mayor crecimiento salarial del mercado', 
 '{"junior": {"min": 3500000, "max": 5000000, "growth": "35%"}, "senior": {"min": 5000000, "max": 8500000, "growth": "35%"}, "premium": "40%", "companies_hiring": 28}', 
 98, 'Estudio IA/ML Chile 2024', ARRAY['ai', 'ml', 'python', 'data-science']),

-- COMPANIES DATA
('companies', 'NotCo - Expansión Masiva 25 Posiciones', 'NotCo en proceso de expansión con 25 posiciones tech abiertas', 
 '{"positions": 25, "salary_range": "4M-8M CLP", "urgency": "alta", "growth_stage": "Series C", "tech_stack": ["React", "Node.js", "Python", "AWS"], "culture": "Internacional, innovación, foodtech", "benefits": ["Stock options", "Seguro premium", "Trabajo híbrido", "Budget aprendizaje"]}', 
 95, 'NotCo Careers', ARRAY['notco', 'startup', 'foodtech', 'series-c']),

('companies', 'Fintual - Fintech Consolidado 18 Roles', 'Fintual busca talento para consolidar liderazgo fintech', 
 '{"positions": 18, "salary_range": "3.5M-6M CLP", "urgency": "alta", "growth_stage": "Consolidado", "tech_stack": ["React", "Python", "Django", "PostgreSQL"], "culture": "Transparencia, fintech, crecimiento", "benefits": ["Equity", "Seguro salud", "Vacaciones flexibles", "Presupuesto tech"]}', 
 92, 'Fintual Jobs', ARRAY['fintual', 'fintech', 'equity', 'consolidado']),

('companies', 'Buk - HR Tech en Escalamiento', 'Buk Series B busca 20 desarrolladores para escalamiento', 
 '{"positions": 20, "salary_range": "3M-5.5M CLP", "urgency": "media", "growth_stage": "Series B", "tech_stack": ["Vue.js", "Laravel", "MySQL", "AWS"], "culture": "HR tech, colaborativo, escalamiento", "benefits": ["Seguro complementario", "Bono alimentación", "Capacitación", "Trabajo remoto"]}', 
 88, 'Buk Careers', ARRAY['buk', 'hr-tech', 'vue.js', 'series-b']),

('companies', 'Betterfly - Insurtech con Propósito', 'Betterfly Series A enfocado en bienestar y propósito social', 
 '{"positions": 12, "salary_range": "4M-7M CLP", "urgency": "media", "growth_stage": "Series A", "tech_stack": ["React Native", "Node.js", "MongoDB", "GCP"], "culture": "Propósito social, insurtech, bienestar", "benefits": ["Seguro vida", "Wellness budget", "Días de voluntariado", "Stock options"]}', 
 85, 'Betterfly Careers', ARRAY['betterfly', 'insurtech', 'react-native', 'series-a']),

-- SKILLS DEMAND
('skills', 'React - Demanda Explosiva +35%', 'React lidera crecimiento en demanda con 45 empresas contratando', 
 '{"growth": "35%", "salary_premium": "15%", "companies": 45, "roles": ["Frontend Developer", "Full Stack", "React Native"], "learning_resources": ["React Docs", "Next.js", "TypeScript"], "avg_time_to_learn": "3-6 meses"}', 
 94, 'Análisis Skills Tech Chile', ARRAY['react', 'frontend', 'javascript', 'next.js']),

('skills', 'Python - Versatilidad Total +42%', 'Python domina backend, IA/ML y data science con 52 empresas', 
 '{"growth": "42%", "salary_premium": "20%", "companies": 52, "applications": ["Backend", "AI/ML", "Data Science", "Automation"], "frameworks": ["Django", "FastAPI", "Flask"], "avg_salary_boost": "20%"}', 
 96, 'Python Market Analysis', ARRAY['python', 'backend', 'ai', 'data-science']),

('skills', 'Kubernetes - Premium Técnico +30%', 'Kubernetes ofrece el mayor premium salarial en skills técnicos', 
 '{"growth": "38%", "salary_premium": "30%", "companies": 25, "complexity": "Alta", "learning_curve": "6-12 meses", "certifications": ["CKA", "CKAD"], "avg_salary_increase": "30%"}', 
 90, 'DevOps Skills Report', ARRAY['kubernetes', 'devops', 'cloud', 'containers']),

('skills', 'TypeScript - Estándar Moderno +40%', 'TypeScript se convierte en estándar con 48 empresas adoptándolo', 
 '{"growth": "40%", "salary_premium": "18%", "companies": 48, "adoption_rate": "85%", "frameworks": ["React", "Angular", "Vue", "Node.js"], "learning_difficulty": "Media"}', 
 92, 'TypeScript Adoption Study', ARRAY['typescript', 'javascript', 'frontend', 'backend']),

-- MARKET TRENDS
('trends', 'Trabajo Híbrido - Nueva Normalidad 65%', 'Modalidad híbrida domina con 65% de empresas adoptándola', 
 '{"hybrid": "65%", "remote": "35%", "onsite": "5%", "employee_preference": "híbrido", "productivity_impact": "+15%", "retention_improvement": "+25%"}', 
 89, 'Estudio Modalidades Trabajo 2024', ARRAY['híbrido', 'remoto', 'modalidades', 'productividad']),

('trends', 'Startups vs Corporaciones - Salarios Premium', 'Startups ofrecen 15-25% premium salarial vs corporaciones', 
 '{"startup_premium": "15-25%", "equity_value": "2-5x potential", "risk_factor": "Alto", "growth_opportunity": "Muy Alto", "learning_acceleration": "3x faster"}', 
 87, 'Startup vs Corporate Analysis', ARRAY['startups', 'equity', 'premium', 'crecimiento']),

-- OPPORTUNITIES
('opportunities', 'Brecha AI/ML - Oportunidad Dorada', 'Escasez crítica de talento AI/ML crea oportunidades únicas', 
 '{"talent_gap": "70%", "open_positions": 150, "avg_time_to_fill": "4-6 meses", "salary_growth_potential": "40%", "companies_struggling": 28}', 
 97, 'AI/ML Talent Gap Report', ARRAY['ai', 'ml', 'oportunidad', 'escasez']),

('opportunities', 'Fintech Expansion - Regulación Favorable', 'Nueva regulación fintech abre oportunidades masivas', 
 '{"new_licenses": 12, "investment_increase": "45%", "job_creation": 300, "salary_premium": "20%", "growth_sectors": ["Payments", "Lending", "Crypto"]}', 
 91, 'Fintech Regulation Impact', ARRAY['fintech', 'regulación', 'crecimiento', 'oportunidades']);

-- Insert user career profile for demo user
INSERT INTO user_career_profiles (
    user_id, 
    current_role, 
    experience_level, 
    years_experience, 
    current_salary_clp, 
    target_salary_clp,
    skills,
    target_roles,
    work_preferences,
    career_goals,
    industry_preferences,
    company_size_preference,
    availability_status
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1),
    'Desarrollador Full Stack',
    'Senior',
    5,
    3500000,
    5500000,
    '{"React": "Avanzado", "Node.js": "Avanzado", "Python": "Intermedio", "AWS": "Intermedio", "TypeScript": "Avanzado", "PostgreSQL": "Intermedio"}',
    ARRAY['Tech Lead', 'Engineering Manager', 'Senior Full Stack Developer'],
    '{"modalidad": "híbrido", "ubicación": "Santiago", "viajes": "ocasionales", "horario": "flexible"}',
    ARRAY['Liderazgo técnico', 'Mentoring de equipos', 'Arquitectura de sistemas', 'Crecimiento salarial'],
    ARRAY['Fintech', 'E-commerce', 'SaaS', 'Startups'],
    'startup',
    'passive'
) ON CONFLICT (user_id) DO UPDATE SET
    current_role = EXCLUDED.current_role,
    experience_level = EXCLUDED.experience_level,
    updated_at = NOW();

-- Insert personalized insights for demo user
INSERT INTO personalized_insights (
    user_id,
    insight_type,
    title,
    description,
    priority_level,
    confidence_score,
    recommended_actions,
    expected_impact,
    timeline_estimate
) VALUES 
(
    (SELECT id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1),
    'opportunity',
    'Oportunidad Perfecta en Fintual',
    'Fintual busca exactamente tu perfil: Full Stack Senior con React/Node.js. Salario objetivo: 4.5M-6M CLP, equity incluido.',
    'high',
    0.92,
    ARRAY['Actualizar LinkedIn con proyectos recientes', 'Preparar portfolio con casos fintech', 'Contactar referidos en Fintual'],
    'Incremento salarial 25-30% + equity',
    '2-3 semanas'
),
(
    (SELECT id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1),
    'skill_gap',
    'Kubernetes = +30% Salario Premium',
    'Aprender Kubernetes te posicionaría para roles DevOps/Platform Engineer con 30% premium salarial.',
    'medium',
    0.88,
    ARRAY['Curso CKA certification', 'Proyecto personal con K8s', 'Contribuir a proyectos open source'],
    'Premium salarial +30% (1M+ CLP)',
    '4-6 meses'
),
(
    (SELECT id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1),
    'market_trend',
    'Tu Stack en Top 3 Demandado',
    'React + Node.js + TypeScript está en el top 3 de stacks más demandados. Momento perfecto para cambio.',
    'low',
    0.95,
    ARRAY['Aprovechar momentum actual', 'Considerar roles en startups Series B/C', 'Negociar desde posición de fuerza'],
    'Múltiples ofertas competitivas',
    '1-2 meses'
);
