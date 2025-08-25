-- Verificación simple de autenticación

-- Verificar usuarios existentes
SELECT 'Usuarios en user_profiles:' as info;
SELECT email, full_name, current_level, tests_completed 
FROM user_profiles 
ORDER BY created_at DESC;

-- Verificar tests completados
SELECT 'Tests completados:' as info;
SELECT user_email, test_name, score, completed_at 
FROM test_results 
ORDER BY completed_at DESC;

-- Verificar actividades
SELECT 'Actividades recientes:' as info;
SELECT user_email, activity_type, activity_description, xp_earned, created_at 
FROM user_activities 
ORDER BY created_at DESC 
LIMIT 10;

SELECT 'Verificación completada exitosamente' as status;
