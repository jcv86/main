-- Seed a2_resource_library with verified resources

-- Notion Templates
INSERT INTO a2_resource_library (title, description, url, category, subcategory, resource_type, difficulty_level, estimated_time, tags) VALUES
('Notion Career Planning Template', 'Plantilla para planificar tu carrera con objetivos, milestones y timeline', 'https://www.notion.so/templates/career-planning', 'Notion Templates', 'Career Planning', 'Template', 'Beginner', '30 min', ARRAY['planning', 'career', 'notion']),
('Notion Goal Setting Framework', 'Framework OKR para establecer objetivos SMART y realizar seguimiento', 'https://www.notion.so/templates/goal-setting-okr', 'Notion Templates', 'Goal Setting', 'Template', 'Intermediate', '45 min', ARRAY['goals', 'okr', 'notion']),
('Notion Skills Tracker', 'Rastreador de habilidades con auto-evaluación y plan de mejora', 'https://www.notion.so/templates/skills-tracker', 'Notion Templates', 'Skills Assessment', 'Template', 'Beginner', '20 min', ARRAY['skills', 'assessment', 'notion']),
('Notion Interview Prep', 'Preparación para entrevistas con preguntas comunes y respuestas guiadas', 'https://www.notion.so/templates/interview-prep', 'Notion Templates', 'Interview', 'Template', 'Intermediate', '2h', ARRAY['interview', 'preparation', 'notion']),
('Notion DISC Profile Tracker', 'Seguimiento de perfil DISC y sugerencias de desarrollo personalizado', 'https://www.notion.so/templates/disc-profile', 'Notion Templates', 'Personality', 'Template', 'Beginner', '25 min', ARRAY['disc', 'personality', 'notion']),

-- LinkedIn Resources
('LinkedIn Profile Optimization Guide', 'Guía completa para optimizar perfil LinkedIn y aumentar visibilidad', 'https://www.linkedin.com/learning/paths/linkedin-profile-optimization', 'LinkedIn', 'Profile Building', 'Course', 'Beginner', '1.5h', ARRAY['linkedin', 'profile', 'branding']),
('LinkedIn Networking Best Practices', 'Estrategias efectivas para networking en LinkedIn de forma profesional', 'https://www.linkedin.com/learning/linkedin-networking-strategies', 'LinkedIn', 'Networking', 'Course', 'Intermediate', '2h', ARRAY['linkedin', 'networking', 'connections']),
('LinkedIn Job Search Strategy', 'Cómo buscar trabajo efectivamente usando LinkedIn como herramienta', 'https://www.linkedin.com/learning/job-search-strategies-for-linkedin', 'LinkedIn', 'Job Search', 'Course', 'Beginner', '1h', ARRAY['linkedin', 'job-search', 'career']),

-- Online Courses
('Google Career Certificates - Professional Development', 'Programas de certificación reconocidos en desarrollo profesional', 'https://www.coursera.org/google-certificates', 'Online Courses', 'Certifications', 'Course', 'Beginner', '3-6 months', ARRAY['certification', 'google', 'career']),
('Coursera - Leadership and Management Specialization', 'Especialización en liderazgo y gestión de equipos', 'https://www.coursera.org/specializations/leadership-management', 'Online Courses', 'Leadership', 'Course', 'Intermediate', '4 months', ARRAY['leadership', 'management', 'skills']),
('Udemy - Complete Project Management Masterclass', 'Curso completo de gestión de proyectos con herramientas prácticas', 'https://www.udemy.com/course/project-management-masterclass', 'Online Courses', 'Project Management', 'Course', 'Intermediate', '8h', ARRAY['project-management', 'skills', 'udemy']),
('LinkedIn Learning - Executive Presence', 'Desarrolla presencia ejecutiva y carisma profesional', 'https://www.linkedin.com/learning/executive-presence', 'Online Courses', 'Personal Branding', 'Course', 'Advanced', '2h', ARRAY['presence', 'branding', 'leadership']),

-- Assessment Tools
('Glassdoor Company Research', 'Investiga empresas, salarios, comentarios de empleados y procesos de entrevista', 'https://www.glassdoor.com', 'Assessment Tools', 'Company Research', 'Tool', 'Beginner', '30 min', ARRAY['research', 'companies', 'salaries']),
('Indeed Company Reviews', 'Opiniones y evaluaciones de empresas desde empleados reales', 'https://www.indeed.com/companies', 'Assessment Tools', 'Company Research', 'Tool', 'Beginner', '20 min', ARRAY['research', 'companies', 'reviews']),
('Blind Community', 'Comunidad anónima de profesionales discutiendo empresas y salarios', 'https://www.teamblind.com', 'Assessment Tools', 'Salary Research', 'Tool', 'Intermediate', '1h', ARRAY['salaries', 'community', 'research']),
('PayScale Salary Calculator', 'Calcula tu salario basado en experiencia, ubicación y rol', 'https://www.payscale.com', 'Assessment Tools', 'Salary Research', 'Tool', 'Beginner', '15 min', ARRAY['salary', 'calculator', 'compensation']),
('Levels.fyi Salary Database', 'Base de datos de salarios en tech por empresa y nivel', 'https://www.levels.fyi', 'Assessment Tools', 'Salary Research', 'Tool', 'Intermediate', '30 min', ARRAY['salary', 'tech', 'compensation']),

-- Industry Reports
('McKinsey - The State of the Industry', 'Reportes anuales sobre tendencias y cambios en la industria', 'https://www.mckinsey.com/featured-insights', 'Industry Reports', 'Market Analysis', 'Report', 'Advanced', '1-2h', ARRAY['industry', 'trends', 'analysis']),
('LinkedIn Jobs Report', 'Reportes anuales sobre el mercado laboral y tendencias de empleo', 'https://business.linkedin.com/talent-solutions/talent-trends', 'Industry Reports', 'Job Market', 'Report', 'Intermediate', '30 min', ARRAY['jobs', 'trends', 'market']),
('World Economic Forum - Future of Jobs', 'Informe sobre trabajos del futuro y habilidades requeridas', 'https://www.weforum.org/reports/future-of-jobs', 'Industry Reports', 'Future Trends', 'Report', 'Advanced', '2h', ARRAY['future', 'skills', 'trends']),

-- Articles & Guides
('HBR - Career Development Guide', 'Guía de Harvard Business Review sobre desarrollo de carrera', 'https://hbr.org/topics/careers', 'Articles & Guides', 'Career Development', 'Article', 'Intermediate', '20 min', ARRAY['career', 'hbr', 'development']),
('Medium - Career Growth Stories', 'Historias reales de profesionales sobre su crecimiento de carrera', 'https://medium.com/tag/career-growth', 'Articles & Guides', 'Success Stories', 'Article', 'Beginner', '15 min', ARRAY['career', 'stories', 'inspiration']),
('The Muse - Career Advice', 'Consejos prácticos para desarrollo de carrera y búsqueda de empleo', 'https://www.themuse.com/advice/career', 'Articles & Guides', 'Career Tips', 'Guide', 'Beginner', '10 min', ARRAY['career', 'advice', 'tips']),

-- Videos & Webinars
('TED Talks - Career Development', 'TED Talks sobre desarrollo profesional y carrera', 'https://www.ted.com/topics/career', 'Videos & Webinars', 'Inspiration', 'Video', 'Beginner', '15-20 min', ARRAY['ted', 'career', 'inspiration']),
('YouTube - Interview Preparation Tips', 'Tutoriales en video para prepararse para entrevistas de trabajo', 'https://www.youtube.com/results?search_query=interview+preparation', 'Videos & Webinars', 'Interview Prep', 'Video', 'Beginner', '10-30 min', ARRAY['interview', 'youtube', 'preparation']),
('LinkedIn Live - Career Talks', 'Eventos en vivo en LinkedIn con expertos en desarrollo de carrera', 'https://www.linkedin.com/events', 'Videos & Webinars', 'Live Events', 'Webinar', 'Intermediate', '30-60 min', ARRAY['linkedin', 'webinar', 'live']);
