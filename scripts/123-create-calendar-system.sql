-- Sistema de Calendario con Integración WhatsApp
-- Permite a los usuarios gestionar actividades y recibir recordatorios

-- Drop existing tables if they have wrong structure
DROP TABLE IF EXISTS activity_reminders CASCADE;
DROP TABLE IF EXISTS cerebro_motivational_messages CASCADE;
DROP TABLE IF EXISTS user_whatsapp_config CASCADE;
DROP TABLE IF EXISTS user_activities CASCADE;

-- Tabla de actividades del usuario
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  activity_type VARCHAR(50) NOT NULL, -- 'meeting', 'sport', 'study', 'personal', 'work'
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  reminder_minutes INTEGER DEFAULT 30,
  status VARCHAR(50) DEFAULT 'scheduled',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recordatorios enviados
CREATE TABLE activity_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID,
  user_email VARCHAR(255) NOT NULL,
  reminder_type VARCHAR(50) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message_content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'sent',
  metadata JSONB DEFAULT '{}'
);

-- Tabla de configuración de WhatsApp del usuario
CREATE TABLE user_whatsapp_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  country_code VARCHAR(5) DEFAULT '+56',
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{"reminders": true, "insights": true, "motivation": true}',
  last_message_sent TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de mensajes motivacionales generados por Cerebro
CREATE TABLE cerebro_motivational_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  message_type VARCHAR(50) NOT NULL,
  message_content TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  sent_via VARCHAR(50),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_user_activities_user_email ON user_activities(user_email);
CREATE INDEX idx_user_activities_start_time ON user_activities(start_time);
CREATE INDEX idx_user_activities_status ON user_activities(status);
CREATE INDEX idx_activity_reminders_activity_id ON activity_reminders(activity_id);
CREATE INDEX idx_user_whatsapp_config_user_email ON user_whatsapp_config(user_email);
CREATE INDEX idx_cerebro_motivational_messages_user_email ON cerebro_motivational_messages(user_email);

-- Función para obtener actividades próximas que necesitan recordatorio
CREATE OR REPLACE FUNCTION get_activities_needing_reminder()
RETURNS TABLE (
  activity_id UUID,
  user_email VARCHAR,
  phone_number VARCHAR,
  title VARCHAR,
  start_time TIMESTAMP WITH TIME ZONE,
  reminder_minutes INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ua.id,
    ua.user_email,
    uwc.phone_number,
    ua.title,
    ua.start_time,
    ua.reminder_minutes
  FROM user_activities ua
  JOIN user_whatsapp_config uwc ON ua.user_email = uwc.user_email
  WHERE ua.status = 'scheduled'
    AND uwc.is_active = true
    AND ua.start_time > NOW()
    AND ua.start_time <= NOW() + (ua.reminder_minutes || ' minutes')::INTERVAL
    AND NOT EXISTS (
      SELECT 1 FROM activity_reminders ar
      WHERE ar.activity_id = ua.id
        AND ar.sent_at > NOW() - INTERVAL '1 hour'
    );
END;
$$ LANGUAGE plpgsql;

-- Datos de ejemplo para insights de calendario
INSERT INTO cerebro_insights (category, title, content, confidence_score, metadata)
VALUES 
  ('calendar', 'Gestión de Tiempo', 'Organizar tu calendario mejora la productividad en un 40%. Programa bloques de tiempo para tareas importantes.', 0.95, '{"source": "time_management"}'),
  ('calendar', 'Balance Vida-Trabajo', 'Incluir actividades deportivas y personales en tu calendario reduce el estrés y mejora el rendimiento profesional.', 0.92, '{"source": "work_life_balance"}'),
  ('calendar', 'Hábitos Exitosos', 'Los profesionales exitosos revisan su calendario cada mañana y planifican la semana los domingos.', 0.88, '{"source": "success_habits"}')
ON CONFLICT (category, title) DO NOTHING;
