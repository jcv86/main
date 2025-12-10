-- CORRECCIÓN 1: Agregar columnas de contexto para evolución del informe
-- Usando DO block para evitar errores si las columnas ya existen

DO $$ 
BEGIN
  -- Add attempt_number column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='test_results' AND column_name='attempt_number') THEN
    ALTER TABLE test_results ADD COLUMN attempt_number INTEGER DEFAULT 1;
  END IF;

  -- Add user_context column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='test_results' AND column_name='user_context') THEN
    ALTER TABLE test_results ADD COLUMN user_context JSONB;
  END IF;

  -- Add personal_goals column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='test_results' AND column_name='personal_goals') THEN
    ALTER TABLE test_results ADD COLUMN personal_goals TEXT;
  END IF;

  -- Add current_situation column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='test_results' AND column_name='current_situation') THEN
    ALTER TABLE test_results ADD COLUMN current_situation TEXT;
  END IF;

  -- Add career_stage column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='test_results' AND column_name='career_stage') THEN
    ALTER TABLE test_results ADD COLUMN career_stage TEXT;
  END IF;

  -- Add priority_focus column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='test_results' AND column_name='priority_focus') THEN
    ALTER TABLE test_results ADD COLUMN priority_focus TEXT;
  END IF;
END $$;

-- Indices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_test_results_user_test ON test_results(user_id, test_type);
CREATE INDEX IF NOT EXISTS idx_test_results_attempt ON test_results(user_id, test_type, attempt_number);

-- CORRECCIÓN 2: Habilitar RLS en test_results (CRÍTICO PARA SEGURIDAD)
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Users can view own test results" ON test_results;
DROP POLICY IF EXISTS "Users can insert own test results" ON test_results;
DROP POLICY IF EXISTS "Users can update own test results" ON test_results;

-- Política: Los usuarios solo pueden ver sus propios resultados
CREATE POLICY "Users can view own test results"
ON test_results FOR SELECT
USING (auth.uid() = user_id);

-- Política: Los usuarios pueden insertar sus propios resultados
CREATE POLICY "Users can insert own test results"
ON test_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar sus propios resultados
CREATE POLICY "Users can update own test results"
ON test_results FOR UPDATE
USING (auth.uid() = user_id);

-- CORRECCIÓN 3: Normalizar nombres de tests en la base de datos
-- Actualizar registros existentes con nombres inconsistentes
UPDATE test_results SET test_type = 'MBTI' WHERE test_type = 'Mapa de Personalidad Despega';
UPDATE test_results SET test_type = 'RIASEC' WHERE test_type = 'Brújula Vocacional Despega';
UPDATE test_results SET test_type = 'Soft Skills' WHERE test_type = 'Competencias Despega';
UPDATE test_results SET test_type = 'Soft Skills' WHERE test_type = 'Competencias Blandas Despega';
UPDATE test_results SET test_type = 'Emotional Intelligence' WHERE test_type = 'Inteligencia Emocional Despega';
UPDATE test_results SET test_type = 'DISC' WHERE test_type = 'Despega Cerebral';
UPDATE test_results SET test_type = 'Big Five' WHERE test_type = '5 Dimensiones Despega';

-- Verificación final
SELECT 
  test_type, 
  COUNT(*) as total,
  COUNT(DISTINCT user_id) as unique_users
FROM test_results 
GROUP BY test_type
ORDER BY total DESC;
