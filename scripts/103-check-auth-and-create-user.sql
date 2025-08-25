-- Verificar autenticación y crear usuarios de prueba

-- Verificar si existe la tabla auth.users (Supabase)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth') THEN
        RAISE NOTICE 'Schema auth existe - usando Supabase Auth';
        
        -- Crear usuario de prueba en auth.users si no existe
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data
        ) VALUES (
            gen_random_uuid(),
            'travis@example.com',
            crypt('password123', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Travis Johnson"}'
        ) ON CONFLICT (email) DO NOTHING;
        
    ELSE
        RAISE NOTICE 'Schema auth no existe - usando autenticación local';
    END IF;
END $$;

-- Asegurar que el perfil de usuario existe
INSERT INTO user_profiles (
    email, 
    full_name, 
    current_level, 
    total_xp, 
    tests_completed
) VALUES (
    'travis@example.com',
    'Travis Johnson',
    1,
    0,
    0
) ON CONFLICT (email) DO NOTHING;

SELECT 'Verificación de autenticación completada' as status;
