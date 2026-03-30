-- Rename a1_disc_assessment table to a1_cerebral_assessment
-- This is a cosmetic rename to align with Despega Tu Carrera branding (hide DISC terminology)

-- Step 1: Rename the main table
ALTER TABLE IF EXISTS a1_disc_assessment RENAME TO a1_cerebral_assessment;

-- Step 2: Rename the index
ALTER INDEX IF EXISTS idx_a1_disc_user_id RENAME TO idx_a1_cerebral_user_id;

-- Step 3: Update foreign key reference in a1_informe_completo
ALTER TABLE a1_informe_completo 
DROP CONSTRAINT IF EXISTS a1_informe_completo_a1_disc_assessment_id_fkey;

ALTER TABLE a1_informe_completo 
RENAME COLUMN a1_disc_assessment_id TO a1_cerebral_assessment_id;

ALTER TABLE a1_informe_completo 
ADD CONSTRAINT a1_informe_completo_a1_cerebral_assessment_id_fkey 
FOREIGN KEY (a1_cerebral_assessment_id) REFERENCES a1_cerebral_assessment(id) ON DELETE CASCADE;

-- Verify the changes
SELECT 
  tablename 
FROM pg_tables 
WHERE tablename LIKE 'a1_%assessment' 
OR tablename LIKE 'a1_informe%';
