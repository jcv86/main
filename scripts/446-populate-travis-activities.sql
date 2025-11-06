-- Populate calendar activities for travis@nuanu.com to test WhatsApp functionality

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user ID for travis@nuanu.com
  SELECT id INTO v_user_id FROM users WHERE email = 'travis@nuanu.com' LIMIT 1;
  
  -- If user doesn't exist, exit
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User travis@nuanu.com not found. Please create the user first.';
    RETURN;
  END IF;

  -- Delete existing activities for this user to start fresh
  DELETE FROM calendar_events WHERE user_id = v_user_id;

  -- Insert reading activities
  INSERT INTO calendar_events (id, user_id, title, description, event_type, start_time, end_time, created_at)
  VALUES
  -- Today's activities
  (
    gen_random_uuid(),
    v_user_id,
    'Leer: Conversaciones Cruciales',
    'Completar capítulos 1-3 sobre cómo manejar conversaciones difíciles en el trabajo',
    'reading',
    NOW(),
    NOW() + INTERVAL '30 minutes',
    NOW()
  ),
  (
    gen_random_uuid(),
    v_user_id,
    'Práctica: Elevator Pitch',
    'Practicar tu propuesta de valor en 30 segundos frente al espejo',
    'practice',
    NOW() + INTERVAL '2 hours',
    NOW() + INTERVAL '2 hours' + INTERVAL '15 minutes',
    NOW()
  ),
  
  -- Tomorrow's activities
  (
    gen_random_uuid(),
    v_user_id,
    'Test: Inteligencia Emocional',
    'Completar la evaluación de inteligencia emocional para identificar áreas de mejora',
    'test',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 day' + INTERVAL '20 minutes',
    NOW()
  ),
  (
    gen_random_uuid(),
    v_user_id,
    'Leer: Nunca Dividas la Diferencia',
    'Estudiar técnicas de negociación del FBI - Capítulos sobre escucha activa',
    'reading',
    NOW() + INTERVAL '1 day' + INTERVAL '3 hours',
    NOW() + INTERVAL '1 day' + INTERVAL '3 hours' + INTERVAL '45 minutes',
    NOW()
  ),
  
  -- This week
  (
    gen_random_uuid(),
    v_user_id,
    'Aplicar a: Gerente de Proyectos - Tech Corp',
    'Enviar aplicación con CV actualizado y carta de presentación personalizada',
    'application',
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days' + INTERVAL '1 hour',
    NOW()
  ),
  (
    gen_random_uuid(),
    v_user_id,
    'Networking: Conectar con 3 profesionales',
    'Enviar mensajes personalizados en LinkedIn a profesionales de tu industria objetivo',
    'networking',
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days' + INTERVAL '30 minutes',
    NOW()
  ),
  (
    gen_random_uuid(),
    v_user_id,
    'Leer: Comunicación No Violenta',
    'Aprender los 4 componentes de la comunicación compasiva',
    'reading',
    NOW() + INTERVAL '4 days',
    NOW() + INTERVAL '4 days' + INTERVAL '40 minutes',
    NOW()
  ),
  
  -- Next week
  (
    gen_random_uuid(),
    v_user_id,
    'Entrevista: Preparación STAR',
    'Preparar 5 historias usando el método STAR para entrevistas conductuales',
    'interview_prep',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '1 hour',
    NOW()
  );

  RAISE NOTICE 'Successfully created 8 calendar activities for travis@nuanu.com';
  
END $$;
