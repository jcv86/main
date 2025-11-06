-- Deshabilitar RLS temporalmente para testing
-- IMPORTANTE: Habilitar RLS en producción con políticas apropiadas

-- Agregando deshabilitar RLS en coaching_sessions también
-- Deshabilitar RLS en la tabla coaching_sessions
ALTER TABLE coaching_sessions DISABLE ROW LEVEL SECURITY;

-- Deshabilitar RLS en la tabla coaching_metrics
ALTER TABLE coaching_metrics DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está deshabilitado en ambas tablas
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('coaching_metrics', 'coaching_sessions');
