-- Insert training modules for A3 (Entrenamientos)
-- These are sample trainings that will be recommended based on user profile

INSERT INTO a3_entrenamientos (titulo, descripcion, tema, duracion_minutos, nivel, orden, activo) VALUES
-- Leadership trainings
('Fundamentos del Liderazgo Estratégico', 'Aprende a establecer visión, tomar decisiones y liderar equipos de alto desempeño', 'liderazgo', 45, 'Principiante', 1, true),
('Liderazgo Transformacional', 'Técnicas para inspirar cambio y adaptación en tu organización', 'liderazgo', 60, 'Intermedio', 2, true),
('Coaching para Líderes', 'Desarrolla habilidades de mentoría y desarrollo de talento', 'liderazgo', 50, 'Avanzado', 3, true),

-- Communication trainings
('Comunicación Efectiva en 5 Pasos', 'Mejora tu claridad, escucha y feedback', 'comunicacion', 40, 'Principiante', 1, true),
('Presentaciones que Impactan', 'Domina storytelling y presentaciones ejecutivas', 'comunicacion', 55, 'Intermedio', 2, true),
('Negociación Estratégica', 'Técnicas para conseguir acuerdos ganar-ganar', 'comunicacion', 60, 'Avanzado', 3, true),

-- Entrepreneurship trainings
('Validación de Idea de Negocio', 'Prueba tu concepto con usuarios reales antes de invertir', 'emprendimiento', 50, 'Principiante', 1, true),
('Modelo de Negocio Canvas', 'Diseña tu propuesta de valor y estructura de ingresos', 'emprendimiento', 45, 'Intermedio', 2, true),
('Pitch perfecto para inversionistas', 'Presenta tu startup de forma convincente', 'emprendimiento', 55, 'Avanzado', 3, true),

-- Digital transformation trainings
('Fundamentos de Transformación Digital', 'Entiende tecnología, datos y automatización', 'transformacion-digital', 50, 'Principiante', 1, true),
('Cultura Ágil en la Organización', 'Implementa metodologías ágiles en tu empresa', 'transformacion-digital', 60, 'Intermedio', 2, true),
('Data-Driven Decision Making', 'Toma decisiones basadas en datos y análisis', 'transformacion-digital', 55, 'Avanzado', 3, true),

-- Management trainings
('Gestión de Equipos Remotos', 'Liderazgo efectivo en equipos distribuidos', 'gestion', 45, 'Principiante', 1, true),
('Gestión del Cambio Organizacional', 'Guía a tu equipo a través de transformaciones', 'gestion', 60, 'Intermedio', 2, true),
('High-Performance Teams', 'Crea equipos de alto desempeño y retención', 'gestion', 55, 'Avanzado', 3, true),

-- Personal development trainings
('Productividad Personal Avanzada', 'Optimiza tu tiempo y resultados', 'desarrollo-personal', 40, 'Principiante', 1, true),
('Inteligencia Emocional en el Trabajo', 'Desarrolla autoconciencia y empatía', 'desarrollo-personal', 50, 'Intermedio', 2, true),
('Resiliencia y Adaptabilidad', 'Construye resistencia mental ante cambios', 'desarrollo-personal', 45, 'Avanzado', 3, true),

-- Sales trainings
('Fundamentos de Ventas Consultivas', 'Escucha, pregunta y soluciona necesidades', 'ventas', 50, 'Principiante', 1, true),
('Pipeline y Prospecting Efectivo', 'Llena tu pipeline y acelera ventas', 'ventas', 55, 'Intermedio', 2, true),
('Cierre de Grandes Negocios', 'Técnicas para cerrar deals complejos', 'ventas', 60, 'Avanzado', 3, true)
ON CONFLICT DO NOTHING;
