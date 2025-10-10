-- Create career tips table for daily tips feature
CREATE TABLE IF NOT EXISTS career_tips (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  career_stage VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Insert initial career tips
INSERT INTO career_tips (title, content, category, career_stage, icon) VALUES
('Networking Estratégico', 'Dedica 15 minutos diarios a conectar con profesionales de tu industria. La consistencia es más valiosa que la cantidad.', 'networking', 'all', 'users'),
('Aprendizaje Continuo', 'Lee al menos un artículo de tu industria cada día. El conocimiento actualizado te mantiene competitivo.', 'learning', 'all', 'book-open'),
('Comunicación Efectiva', 'Practica el elevator pitch de tu propuesta de valor. Debes poder explicar tu expertise en 30 segundos.', 'communication', 'intermediate', 'message-square'),
('Gestión del Tiempo', 'Usa la técnica Pomodoro: 25 minutos de trabajo enfocado, 5 minutos de descanso. Aumenta tu productividad un 40%.', 'productivity', 'all', 'clock'),
('Marca Personal', 'Actualiza tu perfil de LinkedIn semanalmente. Una presencia activa aumenta tus oportunidades en un 70%.', 'branding', 'all', 'star'),
('Mentoría', 'Busca un mentor en tu campo. El 80% de los ejecutivos exitosos atribuyen su éxito a la mentoría.', 'mentorship', 'junior', 'award'),
('Feedback Constructivo', 'Solicita feedback específico después de cada proyecto. La retroalimentación acelera tu crecimiento profesional.', 'growth', 'all', 'trending-up'),
('Salud Mental', 'Toma descansos regulares. El burnout reduce tu productividad en un 50%. Tu bienestar es tu mayor activo.', 'wellness', 'all', 'heart'),
('Negociación Salarial', 'Investiga el rango salarial de tu posición antes de negociar. El conocimiento es poder en las negociaciones.', 'career', 'intermediate', 'dollar-sign'),
('Liderazgo', 'Practica la escucha activa con tu equipo. Los mejores líderes escuchan el doble de lo que hablan.', 'leadership', 'senior', 'users');

-- Add more tips for variety
INSERT INTO career_tips (title, content, category, career_stage, icon) VALUES
('Innovación', 'Dedica tiempo semanal a explorar nuevas tecnologías o metodologías. La innovación comienza con la curiosidad.', 'innovation', 'all', 'lightbulb'),
('Resiliencia', 'Cada rechazo es una oportunidad de aprendizaje. Los profesionales exitosos ven los obstáculos como escalones.', 'mindset', 'all', 'shield'),
('Colaboración', 'Celebra los éxitos de tu equipo públicamente. El reconocimiento fortalece la cultura colaborativa.', 'teamwork', 'all', 'users'),
('Automatización', 'Identifica tareas repetitivas que puedas automatizar. Libera tiempo para trabajo estratégico de alto valor.', 'efficiency', 'intermediate', 'zap'),
('Visión Estratégica', 'Piensa 5 años adelante. ¿Qué habilidades necesitarás? Comienza a desarrollarlas hoy.', 'strategy', 'senior', 'target');
