-- Crear usuarios de prueba en auth.users si no existen
-- Nota: Este script puede requerir permisos de administrador

-- Verificar usuarios existentes
SELECT email, created_at FROM auth.users ORDER BY created_at DESC;

-- Insertar usuario demo si no existe
-- Nota: En producción, esto se haría a través de la API de Supabase
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'demo@despegaturcarrera.com',
    crypt('demo123', gen_salt('bf')),
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Usuario Demo"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
) ON CONFLICT (email) DO NOTHING;

-- Crear perfil para usuario demo
INSERT INTO user_profiles (
    email,
    name,
    profile_completion_percentage,
    total_xp,
    current_level,
    tests_completed,
    cv_generated,
    interview_simulations,
    bio,
    location
) VALUES (
    'demo@despegaturcarrera.com',
    'Usuario Demo',
    45,
    75,
    2,
    2,
    0,
    2,
    'Usuario de demostración de la plataforma DespegaTuCarrera',
    'Santiago, Chile'
) ON CONFLICT (email) DO UPDATE SET
    profile_completion_percentage = 45,
    total_xp = 75,
    current_level = 2,
    tests_completed = 2,
    cv_generated = 0,
    interview_simulations = 2,
    updated_at = NOW();

-- Verificar que se creó correctamente
SELECT 
    'Auth Users' as table_name, 
    COUNT(*) as count 
FROM auth.users 
WHERE email IN ('demo@despegaturcarrera.com', 'test@dtc.com')
UNION ALL
SELECT 
    'User Profiles' as table_name, 
    COUNT(*) as count 
FROM user_profiles 
WHERE email IN ('demo@despegaturcarrera.com', 'test@dtc.com');
