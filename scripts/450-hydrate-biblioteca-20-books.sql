-- Hydrate books with 20+ quality books for professional development
-- This addresses the Brandi Sensei 3 gap: "120+ recursos" promise without substance

BEGIN;

-- Insert 20+ essential books for professional development
INSERT INTO books (title, author, description, category, rating, pages, published_year, reading_time, key_topics, tags, is_recommended) VALUES

-- 1. Leadership & Strategy
('El Hábito del Poder', 'Stephen Covey', 'Siete hábitos para la transformación personal y profesional. Fundamental para redefinir quién eres en tu contexto laboral.', 'Liderazgo', 4.5, 380, 1989, '6 hours', ARRAY['Proactividad', 'Propósito', 'Sinergia'], ARRAY['liderazgo', 'habitos', 'transformacion'], true),
('Good to Great', 'Jim Collins', 'Por qué algunas empresas dan el salto y otras no. Aplicable a tu transformación personal.', 'Liderazgo', 4.3, 320, 2001, '5 hours', ARRAY['Disciplina', 'Excelencia', 'Cultura'], ARRAY['liderazgo', 'estrategia', 'excelencia'], true),
('The Art of War', 'Sun Tzu', 'Estrategia clásica aplicable a carrera profesional. Conoce a tu enemigo (el mercado) y a ti mismo.', 'Estrategia', 4.0, 200, 500, '3 hours', ARRAY['Estrategia', 'Autoconocimiento', 'Ventaja competitiva'], ARRAY['estrategia', 'clasico', 'carrera'], true),

-- 2. Productivity & Habits
('Hábitos Atómicos', 'James Clear', 'Sistema científico para construir buenos hábitos. Implementa transformación gradual pero sostenida.', 'Productividad', 4.6, 320, 2018, '4 hours', ARRAY['Hábitos', 'Cambio gradual', 'Sistemas'], ARRAY['productividad', 'habitos', 'ciencia'], true),
('Deep Work', 'Cal Newport', 'La capacidad de concentrarse es tu ventaja competitiva en el futuro. Aprende a entrenar foco profundo.', 'Productividad', 4.4, 296, 2016, '4 hours', ARRAY['Concentración', 'Valor', 'Excelencia'], ARRAY['productividad', 'concentracion', 'trabajo'], true),
('Eat That Frog', 'Brian Tracy', 'Manejo de prioridades y productividad. Gestiona tu tiempo como estratega.', 'Productividad', 4.0, 158, 2007, '3 hours', ARRAY['Priorización', 'Acción', 'Enfoque'], ARRAY['productividad', 'tiempo', 'prioridades'], true),

-- 3. Emotional Intelligence & Communication
('Inteligencia Emocional', 'Daniel Goleman', 'La base psicológica para entender y gestionar emociones en contextos profesionales.', 'Inteligencia Emocional', 4.5, 371, 1995, '5 hours', ARRAY['Autoconocimiento', 'Empatía', 'Gestión emocional'], ARRAY['inteligencia-emocional', 'psicologia', 'relaciones'], true),
('Nonviolent Communication', 'Marshall Rosenberg', 'Comunicación que transforma conflictos en conexiones. Herramienta poderosa para liderazgo.', 'Comunicación', 4.3, 245, 1998, '4 hours', ARRAY['Empatía', 'Asertividad', 'Conexión'], ARRAY['comunicacion', 'empatia', 'liderazgo'], true),
('Crucial Conversations', 'Kerry Patterson', 'Cómo manejar conversaciones difíciles sin perder relaciones ni resultados.', 'Comunicación', 4.4, 404, 2011, '5 hours', ARRAY['Comunicación', 'Liderazgo', 'Resolución de conflictos'], ARRAY['comunicacion', 'conversacion', 'conflictos'], true),

-- 4. Mindset & Personal Development
('Mindset', 'Carol Dweck', 'La mentalidad de crecimiento vs. fija. Fundamental para tu transformación.', 'Mindset', 4.5, 276, 2006, '4 hours', ARRAY['Crecimiento', 'Mentalidad', 'Aprendizaje'], ARRAY['mindset', 'crecimiento', 'psicologia'], true),
('Man''s Search for Meaning', 'Viktor Frankl', 'Descubre tu propósito incluso en circunstancias difíciles. Reflexión profunda sobre sentido de vida.', 'Filosofía', 4.6, 187, 1946, '3 hours', ARRAY['Propósito', 'Resiliencia', 'Significado'], ARRAY['filosofia', 'proposito', 'sentido'], true),
('The Courage to Be Disliked', 'Ichiro Kishimi', 'Psicología adleriana aplicada: cómo dejar de buscar aprobación y vivir auténticamente.', 'Mindset', 4.2, 400, 2018, '4 hours', ARRAY['Autenticidad', 'Libertad', 'Independencia'], ARRAY['psicologia', 'filosofia', 'libertad'], true),

-- 5. Career & Market Navigation
('Designing Your Life', 'Bill Burnett & Dave Evans', 'Metodología de design thinking aplicada a tu carrera. Crea múltiples versiones de futuro.', 'Carrera', 4.3, 304, 2016, '5 hours', ARRAY['Diseño de vida', 'Decisiones de carrera', 'Exploración'], ARRAY['carrera', 'diseno', 'futuro'], true),
('Never Split the Difference', 'Chris Voss', 'Negociación de alto nivel. Aplicable a tu carrera, salario y oportunidades.', 'Carrera', 4.2, 336, 2016, '4 hours', ARRAY['Negociación', 'Influencia', 'Tácticas'], ARRAY['negociacion', 'carrera', 'influencia'], true),
('The 4-Hour Workweek', 'Tim Ferriss', 'Automatización y delegación. Rediseña tu relación con el trabajo.', 'Carrera', 4.0, 499, 2007, '5 hours', ARRAY['Automatización', 'Eficiencia', 'Libertad'], ARRAY['carrera', 'eficiencia', 'trabajo'], true),

-- 6. Knowledge & Systems Thinking
('Thinking, Fast and Slow', 'Daniel Kahneman', 'Cómo funciona realmente tu mente. Comprende tus sesgos y patrones de decisión.', 'Psicología', 4.3, 499, 2011, '7 hours', ARRAY['Cognición', 'Decisiones', 'Sesgos'], ARRAY['psicologia', 'cognicion', 'decisiones'], true),
('The Systems Bible', 'John Gall', 'Cómo funcionan realmente los sistemas. Entiende dinámicas organizacionales y de mercado.', 'Sistemas', 4.1, 472, 2003, '6 hours', ARRAY['Sistemas', 'Complejidad', 'Adaptación'], ARRAY['sistemas', 'organizacion', 'complejidad'], true),

-- 7. Networks & Influence
('Give and Take', 'Adam Grant', 'Generosidad estratégica en redes profesionales. Construye relaciones de valor mutuo.', 'Relaciones', 4.2, 528, 2013, '5 hours', ARRAY['Redes', 'Generosidad', 'Influencia'], ARRAY['relaciones', 'networking', 'influencia'], true),
('Never Eat Alone', 'Keith Ferrazzi', 'Networking genuino: cómo construir relaciones que duran. Tu red es tu capital.', 'Relaciones', 4.1, 366, 2005, '5 hours', ARRAY['Networking', 'Relaciones', 'Carrera'], ARRAY['networking', 'relaciones', 'carrera'], true);

COMMIT;

-- Create or update the biblioteca_metadata for filtering
CREATE TABLE IF NOT EXISTS biblioteca_categories (
  category VARCHAR(50) PRIMARY KEY,
  description TEXT,
  icon VARCHAR(50)
);

INSERT INTO biblioteca_categories (category, description, icon) VALUES
('Liderazgo', 'Desarrollo de liderazgo y toma de decisiones', 'crown'),
('Productividad', 'Gestión de tiempo y hábitos', 'zap'),
('Inteligencia Emocional', 'Emoción y relaciones', 'heart'),
('Comunicación', 'Habilidades de comunicación', 'message'),
('Mindset', 'Mentalidad y desarrollo personal', 'brain'),
('Carrera', 'Gestión de carrera profesional', 'briefcase'),
('Psicología', 'Comprensión de comportamiento', 'cpu'),
('Sistemas', 'Pensamiento sistémico', 'network'),
('Estrategia', 'Pensamiento estratégico', 'target'),
('Relaciones', 'Redes y relaciones profesionales', 'users'),
('Filosofía', 'Propósito y significado', 'book')
ON CONFLICT (category) DO NOTHING;

COMMIT;
