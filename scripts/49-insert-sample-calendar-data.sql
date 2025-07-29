-- Insert sample calendar events for demo user
INSERT INTO calendar_events (user_id, title, description, event_date, event_time, event_type, event_status, priority, related_module, notifications) 
SELECT 
    u.id,
    'Simulación de Entrevista - Frontend Developer',
    'Práctica de entrevista para posición en startup tecnológica',
    NOW() + INTERVAL '3 days',
    '10:00',
    'interview',
    'pending',
    'high',
    'interview-simulator',
    '{"email": true, "push": true, "timesBefore": [60, 15]}'::jsonb
FROM auth.users u 
WHERE u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO calendar_events (user_id, title, description, event_date, event_time, event_type, event_status, priority, related_module, notifications) 
SELECT 
    u.id,
    'Completar Test de Personalidad Big Five',
    'Evaluación pendiente para completar perfil profesional',
    NOW() + INTERVAL '1 day',
    '14:30',
    'assessment',
    'completed',
    'medium',
    'big-five-test',
    '{"email": false, "push": true, "timesBefore": [30]}'::jsonb
FROM auth.users u 
WHERE u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO calendar_events (user_id, title, description, event_date, event_time, event_type, event_status, priority, related_module, notifications) 
SELECT 
    u.id,
    'Sesión con AI Career Coach',
    'Revisión de progreso mensual y planificación de objetivos',
    NOW() + INTERVAL '5 days',
    '16:00',
    'coaching',
    'pending',
    'medium',
    'career-coach',
    '{"email": true, "push": true, "timesBefore": [120, 30]}'::jsonb
FROM auth.users u 
WHERE u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO calendar_events (user_id, title, description, event_date, event_time, event_type, event_status, priority, related_module, notifications) 
SELECT 
    u.id,
    'Actualizar CV con nuevos proyectos',
    'Incluir proyecto de React y certificación completada',
    NOW() + INTERVAL '7 days',
    '09:00',
    'reminder',
    'pending',
    'high',
    'cv-builder',
    '{"email": true, "push": false, "timesBefore": [1440, 60]}'::jsonb
FROM auth.users u 
WHERE u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO calendar_events (user_id, title, description, event_date, event_time, event_type, event_status, priority, notifications) 
SELECT 
    u.id,
    'Meta: Conseguir trabajo como Data Scientist',
    'Objetivo principal para Q1 2025',
    NOW() + INTERVAL '4 months',
    '23:59',
    'goal',
    'in_progress',
    'high',
    '{"email": true, "push": true, "timesBefore": [10080, 1440, 60]}'::jsonb
FROM auth.users u 
WHERE u.email = 'demo@dtc.com'
LIMIT 1;

-- Insert sample goals
INSERT INTO goals (user_id, title, description, target_date, progress, category, goal_status) 
SELECT 
    u.id,
    'Transición a Data Science',
    'Cambiar de carrera hacia Data Science con enfoque en Machine Learning',
    NOW() + INTERVAL '6 months',
    65,
    'career',
    'active'
FROM auth.users u 
WHERE u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO goals (user_id, title, description, target_date, progress, category, goal_status) 
SELECT 
    u.id,
    'Mejorar Habilidades de Comunicación',
    'Desarrollar habilidades blandas para liderazgo y presentaciones',
    NOW() + INTERVAL '3 months',
    80,
    'skills',
    'active'
FROM auth.users u 
WHERE u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO goals (user_id, title, description, target_date, progress, category, goal_status) 
SELECT 
    u.id,
    'Networking Profesional',
    'Expandir red de contactos en la industria tecnológica',
    NOW() + INTERVAL '4 months',
    40,
    'networking',
    'active'
FROM auth.users u 
WHERE u.email = 'demo@dtc.com'
LIMIT 1;

-- Insert sample milestones for the first goal (Data Science transition)
INSERT INTO goal_milestones (goal_id, title, completed, completed_date, order_index) 
SELECT 
    g.id,
    'Completar curso de Python',
    TRUE,
    NOW() - INTERVAL '2 months',
    1
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Transición a Data Science' AND u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO goal_milestones (goal_id, title, completed, completed_date, order_index) 
SELECT 
    g.id,
    'Aprender SQL avanzado',
    TRUE,
    NOW() - INTERVAL '1 month',
    2
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Transición a Data Science' AND u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO goal_milestones (goal_id, title, completed, order_index) 
SELECT 
    g.id,
    'Proyecto de Machine Learning',
    FALSE,
    3
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Transición a Data Science' AND u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO goal_milestones (goal_id, title, completed, order_index) 
SELECT 
    g.id,
    'Certificación en Data Science',
    FALSE,
    4
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Transición a Data Science' AND u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO goal_milestones (goal_id, title, completed, order_index) 
SELECT 
    g.id,
    'Portfolio completo',
    FALSE,
    5
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Transición a Data Science' AND u.email = 'demo@dtc.com'
LIMIT 1;

-- Insert sample milestones for communication skills goal
INSERT INTO goal_milestones (goal_id, title, completed, completed_date, order_index) 
SELECT 
    g.id,
    'Curso de oratoria',
    TRUE,
    NOW() - INTERVAL '3 months',
    1
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Mejorar Habilidades de Comunicación' AND u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO goal_milestones (goal_id, title, completed, completed_date, order_index) 
SELECT 
    g.id,
    'Práctica de presentaciones',
    TRUE,
    NOW() - INTERVAL '2 months',
    2
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Mejorar Habilidades de Comunicación' AND u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO goal_milestones (goal_id, title, completed, order_index) 
SELECT 
    g.id,
    'Feedback de simulaciones',
    FALSE,
    3
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Mejorar Habilidades de Comunicación' AND u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO goal_milestones (goal_id, title, completed, order_index) 
SELECT 
    g.id,
    'Presentación en equipo',
    FALSE,
    4
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Mejorar Habilidades de Comunicación' AND u.email = 'demo@dtc.com'
LIMIT 1;

-- Insert sample milestones for networking goal
INSERT INTO goal_milestones (goal_id, title, completed, completed_date, order_index) 
SELECT 
    g.id,
    'Actualizar LinkedIn',
    TRUE,
    NOW() - INTERVAL '1 month',
    1
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Networking Profesional' AND u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO goal_milestones (goal_id, title, completed, order_index) 
SELECT 
    g.id,
    'Asistir a 3 eventos tech',
    FALSE,
    2
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Networking Profesional' AND u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO goal_milestones (goal_id, title, completed, order_index) 
SELECT 
    g.id,
    'Conectar con 50 profesionales',
    FALSE,
    3
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Networking Profesional' AND u.email = 'demo@dtc.com'
LIMIT 1;

INSERT INTO goal_milestones (goal_id, title, completed, order_index) 
SELECT 
    g.id,
    'Participar en comunidades online',
    FALSE,
    4
FROM goals g 
JOIN auth.users u ON g.user_id = u.id
WHERE g.title = 'Networking Profesional' AND u.email = 'demo@dtc.com'
LIMIT 1;
