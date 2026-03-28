-- VERIFICACIÓN: Estado actual de RLS en tablas CANON
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('canon_conozcamonos_1_responses', 'canon_conozcamonos_2_responses', 'canon_rules_engine', 'canon_generated_routes')
ORDER BY tablename;

-- Listar todas las políticas RLS
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('canon_conozcamonos_1_responses', 'canon_conozcamonos_2_responses', 'canon_rules_engine', 'canon_generated_routes')
ORDER BY tablename, policyname;
