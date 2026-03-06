-- PASO 4A: RLS (Row Level Security) para tablas CANON
-- Asegurar que usuarios solo vean sus propios datos

-- Enable RLS on all CANON tables
ALTER TABLE canon_conozcamonos_1_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE canon_conozcamonos_2_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE canon_rules_engine ENABLE ROW LEVEL SECURITY;
ALTER TABLE canon_generated_routes ENABLE ROW LEVEL SECURITY;

-- Policy: canon_conozcamonos_1_responses
-- Users can only SELECT, INSERT their own data
CREATE POLICY "Users can view own C1 responses"
ON canon_conozcamonos_1_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own C1 responses"
ON canon_conozcamonos_1_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own C1 responses"
ON canon_conozcamonos_1_responses FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: canon_conozcamonos_2_responses
-- Users can only view/insert their own responses
CREATE POLICY "Users can view own C2 responses"
ON canon_conozcamonos_2_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own C2 responses"
ON canon_conozcamonos_2_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own C2 responses"
ON canon_conozcamonos_2_responses FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: canon_rules_engine (read-only for users - aplicado por sistema)
-- Users can only READ (no insert/update - es de solo lectura)
CREATE POLICY "Users can view rules"
ON canon_rules_engine FOR SELECT
USING (true);

-- Policy: canon_generated_routes
-- Users can only view their own routes
CREATE POLICY "Users can view own routes"
ON canon_generated_routes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routes"
ON canon_generated_routes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routes"
ON canon_generated_routes FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Verificación: confirmar RLS está habilitado
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('canon_conozcamonos_1_responses', 'canon_conozcamonos_2_responses', 'canon_rules_engine', 'canon_generated_routes')
ORDER BY tablename;
