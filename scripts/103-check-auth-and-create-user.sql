-- Verificar si el usuario existe en auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    updated_at
FROM auth.users 
WHERE email = 'travis@nuanu.com';

-- Si no existe, necesitamos crearlo manualmente o usar otro método
-- Verificar qué usuarios existen en auth
SELECT 
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;

-- Verificar configuración de auth
SELECT 
    setting_name,
    setting_value
FROM auth.config
WHERE setting_name IN ('SITE_URL', 'JWT_SECRET', 'JWT_EXP');
