-- Create function to add default activities for new users
-- This will be called when a new user signs up

CREATE OR REPLACE FUNCTION create_default_user_activities()
RETURNS TRIGGER AS $$
BEGIN
  -- Add welcome reading activity
  INSERT INTO calendar_events (id, user_id, title, description, event_type, start_time, end_time, created_at)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    '¡Bienvenido! Comienza con esta lectura',
    'Lee "Los 7 Hábitos de la Gente Altamente Efectiva" para comenzar tu desarrollo profesional',
    'reading',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 day' + INTERVAL '30 minutes',
    NOW()
  );

  -- Add first assessment activity
  INSERT INTO calendar_events (id, user_id, title, description, event_type, start_time, end_time, created_at)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    'Completa tu Primera Evaluación',
    'Realiza el test DISC para conocer tu estilo de personalidad y recibir recomendaciones personalizadas',
    'test',
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days' + INTERVAL '20 minutes',
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically add activities for new users
DROP TRIGGER IF EXISTS trigger_create_default_activities ON users;

CREATE TRIGGER trigger_create_default_activities
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_user_activities();
