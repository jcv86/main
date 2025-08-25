-- Insertar contenido en la base de conocimiento

INSERT INTO knowledge_base (title, category, content, author, read_count) VALUES
(
    'Guía Completa del Test DISC',
    'Evaluaciones',
    'El test DISC es una herramienta de evaluación psicométrica que mide cuatro dimensiones principales del comportamiento: Dominancia (D), Influencia (I), Estabilidad (S) y Conciencia (C). Esta guía te ayudará a entender cómo interpretar tus resultados y aplicarlos en tu desarrollo profesional.',
    'Dr. María González',
    45
),
(
    'Desarrollo de Liderazgo en el Siglo XXI',
    'Liderazgo',
    'El liderazgo moderno requiere una combinación única de habilidades técnicas, emocionales y estratégicas. En esta guía exploramos las competencias clave que todo líder debe desarrollar para ser efectivo en el entorno empresarial actual.',
    'Carlos Mendoza',
    32
),
(
    'Comunicación Efectiva en Equipos Remotos',
    'Comunicación',
    'La comunicación en equipos remotos presenta desafíos únicos que requieren estrategias específicas. Aprende técnicas probadas para mantener la cohesión del equipo, facilitar reuniones efectivas y construir relaciones sólidas a distancia.',
    'Ana Rodríguez',
    28
),
(
    'Planificación de Carrera Profesional',
    'Desarrollo',
    'Una carrera exitosa no sucede por accidente. Requiere planificación estratégica, autoconocimiento y la capacidad de adaptarse a los cambios del mercado laboral. Esta guía te proporciona un marco estructurado para diseñar tu trayectoria profesional.',
    'Roberto Silva',
    51
),
(
    'Inteligencia Emocional en el Trabajo',
    'Habilidades Blandas',
    'La inteligencia emocional es fundamental para el éxito profesional. Aprende a reconocer y gestionar tus emociones, desarrollar empatía y construir relaciones interpersonales sólidas que impulsen tu carrera.',
    'Dra. Laura Martín',
    39
);

SELECT 'Base de conocimiento poblada exitosamente' as status;
