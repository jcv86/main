-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias notificaciones" ON notifications;
DROP POLICY IF EXISTS "Los usuarios pueden insertar sus propias notificaciones" ON notifications;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propias notificaciones" ON notifications;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propias notificaciones" ON notifications;

-- Eliminar tabla si existe para recrearla limpiamente
DROP TABLE IF EXISTS notifications CASCADE;

-- Crear tabla de notificaciones
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    category TEXT DEFAULT 'sistema' CHECK (category IN ('evaluacion', 'trabajo', 'biblioteca', 'coach', 'logro', 'sistema')),
    priority TEXT DEFAULT 'media' CHECK (priority IN ('baja', 'media', 'alta', 'urgente')),
    icon TEXT DEFAULT '📢',
    action_url TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_category ON notifications(category);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_user_category ON notifications(user_id, category);

-- Habilitar RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY "usuarios_pueden_ver_sus_notificaciones"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "usuarios_pueden_insertar_sus_notificaciones"
    ON notifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "usuarios_pueden_actualizar_sus_notificaciones"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "usuarios_pueden_eliminar_sus_notificaciones"
    ON notifications FOR DELETE
    USING (auth.uid() = user_id);

-- Política para que el sistema pueda crear notificaciones para cualquier usuario
CREATE POLICY "sistema_puede_crear_notificaciones"
    ON notifications FOR INSERT
    WITH CHECK (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- Función para crear notificaciones automáticas
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

-- Función para marcar notificaciones como leídas
CREATE OR REPLACE FUNCTION mark_notification_as_read(notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE notifications 
    SET read = TRUE, updated_at = NOW()
    WHERE id = notification_id AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para marcar todas las notificaciones como leídas
CREATE OR REPLACE FUNCTION mark_all_notifications_as_read()
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    UPDATE notifications 
    SET read = TRUE, updated_at = NOW()
    WHERE user_id = auth.uid() AND read = FALSE;
    
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
        'unread', COUNT(*) FILTER (WHERE read = FALSE),
        'by_category', json_object_agg(
            category, 
            json_build_object(
                'total', category_count,
                'unread', category_unread
            )
        ),
        'by_priority', json_object_agg(
            priority,
            json_build_object(
                'total', priority_count,
                'unread', priority_unread
            )
        )
    ) INTO stats
    FROM (
        SELECT 
            category,
            COUNT(*) as category_count,
            COUNT(*) FILTER (WHERE read = FALSE) as category_unread,
            priority,
            COUNT(*) OVER (PARTITION BY priority) as priority_count,
            COUNT(*) FILTER (WHERE read = FALSE) OVER (PARTITION BY priority) as priority_unread
        FROM notifications 
        WHERE user_id = p_user_id
        GROUP BY category, priority
    ) subquery;
    
    RETURN COALESCE(stats, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para limpiar notificaciones antiguas (más de 30 días)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM notifications 
    WHERE created_at < NOW() - INTERVAL '30 days' 
    AND read = TRUE;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insertar notificaciones de ejemplo para usuarios existentes
DO $$
DECLARE
    user_record RECORD;
    notification_id UUID;
BEGIN
    -- Solo insertar si no existen notificaciones para evitar duplicados
    FOR user_record IN 
        SELECT u.id 
        FROM auth.users u 
        LEFT JOIN notifications n ON u.id = n.user_id 
        WHERE n.user_id IS NULL
    LOOP
        -- Notificación de bienvenida
        SELECT create_notification(
            user_record.id,
            '¡Bienvenido a tu plataforma de desarrollo profesional!',
            'Comienza explorando las evaluaciones de personalidad y habilidades para conocer mejor tu perfil profesional. Aquí encontrarás herramientas para potenciar tu carrera.',
            'info',
            'sistema',
            'media',
            '👋',
            '/dashboard'
        ) INTO notification_id;
        
        -- Notificación de libro recomendado
        SELECT create_notification(
            user_record.id,
            'Nuevo libro recomendado para ti',
            'Te recomendamos comenzar con "Hábitos Atómicos" de James Clear para mejorar tu productividad personal y profesional.',
            'info',
            'biblioteca',
            'baja',
            '📚',
            '/library'
        ) INTO notification_id;
        
        -- Notificación sobre evaluaciones
        SELECT create_notification(
            user_record.id,
            'Descubre tu perfil profesional',
            'Completa nuestras evaluaciones de personalidad y habilidades para obtener recomendaciones personalizadas.',
            'info',
            'evaluacion',
            'media',
            '📊',
            '/personality-test'
        ) INTO notification_id;
        
        -- Notificación sobre el coach de carrera
        SELECT create_notification(
            user_record.id,
            'Tu coach de carrera está disponible',
            'Chatea con nuestro coach de IA para obtener consejos personalizados sobre tu desarrollo profesional.',
            'info',
            'coach',
            'media',
            '🎯',
            '/career-coach'
        ) INTO notification_id;
        
    END LOOP;
    
    RAISE NOTICE 'Notificaciones de bienvenida creadas para usuarios nuevos';
END $$;

-- Crear función para notificaciones automáticas cuando se completa una evaluación
CREATE OR REPLACE FUNCTION notify_evaluation_completed()
RETURNS TRIGGER AS $$
BEGIN
    -- Crear notificación cuando se completa una evaluación
    PERFORM create_notification(
        NEW.user_id,
        '¡Evaluación completada exitosamente!',
        'Has completado una nueva evaluación. Revisa tus resultados y recomendaciones personalizadas en tu perfil.',
        'success',
        'evaluacion',
        'media',
        '✅',
        '/profile'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función para notificaciones de nuevas oportunidades laborales
CREATE OR REPLACE FUNCTION notify_new_job_opportunity(
    p_user_id UUID,
    p_company TEXT,
    p_position TEXT,
    p_job_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    SELECT create_notification(
        p_user_id,
        'Nueva oportunidad laboral disponible',
        format('%s está buscando un %s. Esta oferta coincide con tu perfil profesional y habilidades.', p_company, p_position),
        'info',
        'trabajo',
        'alta',
        '💼',
        COALESCE(p_job_url, '/job-search')
    ) INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función para notificaciones de logros
CREATE OR REPLACE FUNCTION notify_achievement_unlocked(
    p_user_id UUID,
    p_achievement_name TEXT,
    p_description TEXT
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    SELECT create_notification(
        p_user_id,
        format('¡Logro desbloqueado: %s!', p_achievement_name),
        p_description,
        'success',
        'logro',
        'media',
        '🏆',
        '/profile'
    ) INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función para recordatorios
CREATE OR REPLACE FUNCTION create_reminder_notification(
    p_user_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_action_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    SELECT create_notification(
        p_user_id,
        p_title,
        p_message,
        'warning',
        'sistema',
        'media',
        '⏰',
        p_action_url
    ) INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Programar limpieza automática de notificaciones antiguas (ejecutar manualmente cuando sea necesario)
-- SELECT cleanup_old_notifications();

COMMIT;
