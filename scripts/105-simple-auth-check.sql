-- Verificar si existen usuarios en auth.users
SELECT 
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;

-- Verificar si existe la tabla user_profiles
SELECT COUNT(*) as profile_count FROM user_profiles;

-- Verificar conexión básica
SELECT NOW() as current_time, 'Database connection OK' as status;
