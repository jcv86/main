-- Tabla para almacenar las diferentes versiones de prompts
CREATE TABLE IF NOT EXISTS prompt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_type TEXT NOT NULL CHECK (coach_type IN ('sofia', 'dani')),
  conversation_category TEXT NOT NULL CHECK (conversation_category IN ('autoconocimiento', 'desarrollo_habilidades', 'orientacion_carrera')),
  version_name TEXT NOT NULL, -- e.g., "v1.0", "v1.1-test", "v2.0-empathetic"
  system_prompt TEXT NOT NULL,
  welcome_message TEXT,
  suggested_questions TEXT[], -- Array de preguntas sugeridas
  suggested_action TEXT,
  is_active BOOLEAN DEFAULT false, -- Si está activa para A/B testing
  is_published BOOLEAN DEFAULT false, -- Si es la versión publicada (ganadora)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT, -- Email del admin que creó la versión
  notes TEXT, -- Notas sobre qué se cambió y por qué
  UNIQUE(coach_type, conversation_category, version_name)
);

-- Tabla para tracking de qué versión vio cada usuario
CREATE TABLE IF NOT EXISTS prompt_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES coaching_sessions(id),
  prompt_version_id UUID NOT NULL REFERENCES prompt_versions(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, prompt_version_id)
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_prompt_versions_coach_category 
  ON prompt_versions(coach_type, conversation_category);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_active 
  ON prompt_versions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_prompt_versions_published 
  ON prompt_versions(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_prompt_assignments_session 
  ON prompt_assignments(session_id);
CREATE INDEX IF NOT EXISTS idx_prompt_assignments_version 
  ON prompt_assignments(prompt_version_id);

-- Vista para análisis de performance por versión de prompt
CREATE OR REPLACE VIEW prompt_performance AS
SELECT 
  pv.id as prompt_version_id,
  pv.coach_type,
  pv.conversation_category,
  pv.version_name,
  pv.is_active,
  pv.is_published,
  COUNT(DISTINCT pa.session_id) as total_sessions,
  COUNT(cm.id) as total_feedback,
  AVG(cm.satisfaction_rating) as avg_satisfaction,
  AVG(cm.message_count) as avg_engagement,
  AVG(CASE WHEN cm.action_completed THEN 1 ELSE 0 END) * 100 as action_completion_rate,
  -- Identificar si es crítico según documento (satisfaction < 4.3, action < 60%, engagement < 70%)
  CASE 
    WHEN AVG(cm.satisfaction_rating) < 4.3 
      OR AVG(CASE WHEN cm.action_completed THEN 1 ELSE 0 END) * 100 < 60
      OR (AVG(cm.message_count) < 2) -- engagement < 70% de meta (2 mensajes)
    THEN true 
    ELSE false 
  END as is_critical
FROM prompt_versions pv
LEFT JOIN prompt_assignments pa ON pv.id = pa.prompt_version_id
LEFT JOIN coaching_sessions cs ON pa.session_id = cs.id
LEFT JOIN coaching_metrics cm ON cs.id = cm.session_id
GROUP BY pv.id, pv.coach_type, pv.conversation_category, pv.version_name, pv.is_active, pv.is_published;

-- Insertar versiones actuales de Sofia y Dani como v1.0 (baseline)
INSERT INTO prompt_versions (coach_type, conversation_category, version_name, system_prompt, welcome_message, suggested_questions, suggested_action, is_published, notes)
VALUES 
  -- Sofia - Autoconocimiento
  (
    'sofia',
    'autoconocimiento',
    'v1.0',
    'Eres Sofía, una coach de carrera empática y reflexiva especializada en autoconocimiento. Tu objetivo es ayudar a las personas a entender mejor sus fortalezas, valores y motivaciones a través de conversaciones profundas y reflexivas. Usas un tono cálido, cercano y alentador. Haces preguntas abiertas que invitan a la reflexión y validas las emociones del usuario. Evitas dar consejos directos; en su lugar, guías al usuario a descubrir sus propias respuestas.',
    '¡Hola! Soy Sofía, tu coach de autoconocimiento. Estoy aquí para ayudarte a entender mejor quién eres y qué te motiva. ¿En qué te gustaría que te ayude hoy?',
    ARRAY[
      '¿Qué aspectos de mi personalidad me gustaría explorar más?',
      '¿Cómo puedo usar mis fortalezas en mi carrera?',
      '¿Qué valores son más importantes para mí en el trabajo?'
    ],
    'Reflexiona sobre tus resultados y anota 3 fortalezas clave que identificaste',
    true,
    'Versión inicial baseline de Sofia para autoconocimiento'
  ),
  -- Dani - Desarrollo de habilidades
  (
    'dani',
    'desarrollo_habilidades',
    'v1.0',
    'Eres Dani, un coach de carrera práctico y orientado a la acción, especializado en desarrollo de habilidades. Tu objetivo es ayudar a las personas a identificar y desarrollar las competencias necesarias para alcanzar sus metas profesionales. Usas un tono motivador, directo y constructivo. Proporcionas estrategias concretas, ejercicios prácticos y planes de acción. Te enfocas en el "cómo" y en pasos específicos que el usuario puede tomar.',
    '¡Hola! Soy Dani, tu coach de desarrollo profesional. Estoy aquí para ayudarte a desarrollar las habilidades que necesitas para crecer en tu carrera. ¿Qué habilidad te gustaría mejorar?',
    ARRAY[
      '¿Qué habilidades debería desarrollar para mi próximo paso profesional?',
      '¿Cómo puedo mejorar mis habilidades de comunicación?',
      '¿Qué plan de acción puedo seguir para desarrollar esta competencia?'
    ],
    'Crea un plan de 30 días para desarrollar una habilidad específica que identificaste',
    true,
    'Versión inicial baseline de Dani para desarrollo de habilidades'
  ),
  -- Dani - Orientación de carrera
  (
    'dani',
    'orientacion_carrera',
    'v1.0',
    'Eres Dani, un coach de carrera práctico y orientado a la acción, especializado en orientación profesional. Tu objetivo es ayudar a las personas a explorar opciones de carrera, identificar oportunidades y tomar decisiones informadas sobre su futuro profesional. Usas un tono motivador, directo y constructivo. Proporcionas información sobre industrias, roles y trayectorias profesionales. Te enfocas en ayudar al usuario a crear un plan de acción concreto.',
    '¡Hola! Soy Dani, tu coach de orientación profesional. Estoy aquí para ayudarte a explorar opciones de carrera y planificar tu próximo paso. ¿Qué te gustaría explorar?',
    ARRAY[
      '¿Qué carreras se alinean con mis intereses y habilidades?',
      '¿Cómo puedo hacer la transición a una nueva industria?',
      '¿Qué pasos debo seguir para alcanzar mi meta profesional?'
    ],
    'Investiga 3 roles profesionales que se alineen con tus intereses y habilidades',
    true,
    'Versión inicial baseline de Dani para orientación de carrera'
  )
ON CONFLICT (coach_type, conversation_category, version_name) DO NOTHING;

COMMENT ON TABLE prompt_versions IS 'Almacena diferentes versiones de prompts para A/B testing';
COMMENT ON TABLE prompt_assignments IS 'Tracking de qué versión de prompt vio cada usuario';
COMMENT ON VIEW prompt_performance IS 'Vista agregada de performance por versión de prompt';
