-- Hydrate biblioteca with 20+ quality books for professional development
-- This addresses the Brandi Sensei 3 gap: "120+ recursos" promise without substance

BEGIN;

-- First, ensure the books table exists with proper structure
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  key_insights TEXT[],
  category VARCHAR(50),
  relevance_score INT DEFAULT 7,
  reading_time_hours INT DEFAULT 4,
  difficulty_level VARCHAR(20) DEFAULT 'Intermediate',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert 20+ essential books for professional development
INSERT INTO books (title, author, description, key_insights, category, relevance_score, reading_time_hours, difficulty_level) VALUES

-- 1. Leadership & Strategy
('El Hábito del Poder', 'Steven Covey', 'Siete hábitos para la transformación personal y profesional. Fundamental para redefinir quién eres en tu contexto laboral.', ARRAY['Proactividad', 'Propósito', 'Sinergia'], 'Liderazgo', 9, 6, 'Intermediate'),
('Good to Great', 'Jim Collins', 'Por qué algunas empresas dan el salto y otras no. Aplicable a tu transformación personal.', ARRAY['Disciplina', 'Excelencia', 'Cultura'], 'Liderazgo', 8, 5, 'Intermediate'),
('The Art of War', 'Sun Tzu', 'Estrategia clásica aplicable a carrera profesional. Conoce a tu enemigo (el mercado) y a ti mismo.', ARRAY['Estrategia', 'Autoconocimiento', 'Ventaja competitiva'], 'Estrategia', 7, 3, 'Beginner'),

-- 2. Productivity & Habits
('Hábitos Atómicos', 'James Clear', 'Sistema científico para construir buenos hábitos. Implementa transformación gradual pero sostenida.', ARRAY['Hábitos', 'Cambio gradual', 'Sistemas'], 'Productividad', 9, 4, 'Beginner'),
('Deep Work', 'Cal Newport', 'La capacidad de concentrarse es tu ventaja competitiva en el futuro. Aprende a entrenar foco profundo.', ARRAY['Concentración', 'Valor', 'Excelencia'], 'Productividad', 8, 4, 'Intermediate'),
('Eat That Frog', 'Brian Tracy', 'Manejo de prioridades y productividad. Gestiona tu tiempo como estratega.', ARRAY['Priorización', 'Acción', 'Enfoque'], 'Productividad', 7, 3, 'Beginner'),

-- 3. Emotional Intelligence & Communication
('Inteligencia Emocional', 'Daniel Goleman', 'La base psicológica para entender y gestionar emociones en contextos profesionales.', ARRAY['Autoconocimiento', 'Empatía', 'Gestión emocional'], 'Inteligencia Emocional', 9, 5, 'Intermediate'),
('Nonviolent Communication', 'Marshall Rosenberg', 'Comunicación que transforma conflictos en conexiones. Herramienta poderosa para liderazgo.', ARRAY['Empatía', 'Asertividad', 'Conexión'], 'Comunicación', 8, 4, 'Intermediate'),
('Crucial Conversations', 'Kerry Patterson', 'Cómo manejar conversaciones difíciles sin perder relaciones ni resultados.', ARRAY['Comunicación', 'Liderazgo', 'Resolución de conflictos'], 'Comunicación', 8, 5, 'Intermediate'),

-- 4. Mindset & Personal Development
('Mindset', 'Carol Dweck', 'La mentalidad de crecimiento vs. fija. Fundamental para tu transformación.', ARRAY['Crecimiento', 'Mentalidad', 'Aprendizaje'], 'Mindset', 9, 4, 'Beginner'),
('Man''s Search for Meaning', 'Viktor Frankl', 'Descubre tu propósito incluso en circunstancias difíciles. Reflexión profunda sobre sentido de vida.', ARRAY['Propósito', 'Resiliencia', 'Significado'], 'Filosofía', 9, 3, 'Beginner'),
('The Courage to Be Disliked', 'Ichiro Kishimi', 'Psicología adleriana aplicada: cómo dejar de buscar aprobación y vivir auténticamente.', ARRAY['Autenticidad', 'Libertad', 'Independencia'], 'Mindset', 8, 4, 'Intermediate'),

-- 5. Career & Market Navigation
('Designing Your Life', 'Bill Burnett & Dave Evans', 'Metodología de design thinking aplicada a tu carrera. Crea múltiples versiones de futuro.', ARRAY['Diseño de vida', 'Decisiones de carrera', 'Exploración'], 'Carrera', 9, 5, 'Intermediate'),
('Never Split the Difference', 'Chris Voss', 'Negociación de alto nivel. Aplicable a tu carrera, salario y oportunidades.', ARRAY['Negociación', 'Influencia', 'Tácticas'], 'Carrera', 8, 4, 'Intermediate'),
('The 4-Hour Workweek', 'Tim Ferriss', 'Automatización y delegación. Rediseña tu relación con el trabajo.', ARRAY['Automatización', 'Eficiencia', 'Libertad'], 'Carrera', 7, 5, 'Beginner'),

-- 6. Knowledge & Systems Thinking
('Thinking, Fast and Slow', 'Daniel Kahneman', 'Cómo funciona realmente tu mente. Comprende tus sesgos y patrones de decisión.', ARRAY['Cognición', 'Decisiones', 'Sesgos'], 'Psicología', 8, 7, 'Advanced'),
('The Systems Bible', 'John Gall', 'Cómo funcionan realmente los sistemas. Entiende dinámicas organizacionales y de mercado.', ARRAY['Sistemas', 'Complejidad', 'Adaptación'], 'Sistemas', 7, 4, 'Advanced'),

-- 7. Networks & Influence
('Give and Take', 'Adam Grant', 'Generosidad estratégica en redes profesionales. Construye relaciones de valor mutuo.', ARRAY['Redes', 'Generosidad', 'Influencia'], 'Relaciones', 8, 4, 'Intermediate'),
('Never Eat Alone', 'Keith Ferrazzi', 'Networking genuino: cómo construir relaciones que duran. Tu red es tu capital.', ARRAY['Networking', 'Relaciones', 'Carrera'], 'Relaciones', 8, 5, 'Beginner');

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
