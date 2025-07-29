-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias notificaciones" ON notifications;
DROP POLICY IF EXISTS "Los usuarios pueden crear sus propias notificaciones" ON notifications;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propias notificaciones" ON notifications;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propias notificaciones" ON notifications;
DROP POLICY IF EXISTS "users_can_view_own_notifications" ON notifications;
DROP POLICY IF EXISTS "users_can_create_own_notifications" ON notifications;
DROP POLICY IF EXISTS "users_can_update_own_notifications" ON notifications;
DROP POLICY IF EXISTS "users_can_delete_own_notifications" ON notifications;
DROP POLICY IF EXISTS "system_can_create_notifications" ON notifications;

-- Eliminar tabla si existe
DROP TABLE IF EXISTS notifications CASCADE;

-- Crear tabla de notificaciones
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('success', 'info', 'warning', 'error')),
  category TEXT DEFAULT 'sistema' CHECK (category IN ('evaluacion', 'trabajo', 'biblioteca', 'coach', 'logros', 'sistema', 'recordatorio')),
  priority TEXT DEFAULT 'media' CHECK (priority IN ('baja', 'media', 'alta', 'urgente')),
  icon TEXT DEFAULT '📢',
  action_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY "users_can_view_own_notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_create_own_notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Política para permitir que el sistema cree notificaciones
CREATE POLICY "system_can_create_notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_category ON notifications(user_id, category);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para crear notificaciones desde SQL
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_category TEXT DEFAULT 'sistema',
  p_priority TEXT DEFAULT 'media',
  p_icon TEXT DEFAULT '📢',
  p_action_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (
    user_id, title, message, type, category, priority, icon, action_url
  ) VALUES (
    p_user_id, p_title, p_message, p_type, p_category, p_priority, p_icon, p_action_url
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para marcar notificación como leída
CREATE OR REPLACE FUNCTION mark_notification_as_read(notification_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notifications 
  SET read = TRUE, updated_at = NOW()
  WHERE id = notification_id AND user_id = p_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para marcar todas las notificaciones como leídas
CREATE OR REPLACE FUNCTION mark_all_notifications_as_read(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  UPDATE notifications 
  SET read = TRUE, updated_at = NOW()
  WHERE user_id = p_user_id AND read = FALSE;
  
  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas de notificaciones
CREATE OR REPLACE FUNCTION get_notification_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total', COUNT(*),
    'no_leidas', COUNT(*) FILTER (WHERE read = FALSE),
    'leidas', COUNT(*) FILTER (WHERE read = TRUE),
    'por_categoria', json_object_agg(category, COUNT(*)),
    'por_prioridad', json_object_agg(priority, COUNT(*))
  ) INTO stats
  FROM notifications
  WHERE user_id = p_user_id;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para limpiar notificaciones antiguas (más de 30 días)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notifications 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insertar algunas notificaciones de ejemplo para el usuario demo
DO $$
DECLARE
  demo_user_id UUID;
BEGIN
  -- Buscar el usuario demo
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    -- Notificación de bienvenida
    PERFORM create_notification(
      demo_user_id,
      '¡Bienvenido a tu plataforma de desarrollo profesional!',
      'Explora todas las herramientas disponibles para impulsar tu carrera profesional.',
      'success',
      'sistema',
      'alta',
      '🎉'
    );
    
    -- Notificación de evaluación pendiente
    PERFORM create_notification(
      demo_user_id,
      'Evaluación de habilidades disponible',
      'Completa tu evaluación de habilidades técnicas para obtener recomendaciones personalizadas.',
      'info',
      'evaluacion',
      'media',
      '📊',
      '/technical-skills-test'
    );
    
    -- Notificación de trabajo
    PERFORM create_notification(
      demo_user_id,
      'Nuevas oportunidades laborales',
      'Se han encontrado 5 nuevas ofertas de trabajo que coinciden con tu perfil.',
      'info',
      'trabajo',
      'media',
      '💼',
      '/job-search'
    );
    
    -- Notificación de biblioteca
    PERFORM create_notification(
      demo_user_id,
      'Libro recomendado: "Atomic Habits"',
      'Basado en tu perfil, te recomendamos este libro para mejorar tus hábitos profesionales.',
      'info',
      'biblioteca',
      'baja',
      '📚',
      '/library'
    );
  END IF;
END $$;
