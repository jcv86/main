-- Update test names to Despega branding
-- This script updates all test references in the database to use the new Despega branded names

-- Temporarily disable triggers to avoid updated_at errors
ALTER TABLE test_results DISABLE TRIGGER ALL;
ALTER TABLE test_questions DISABLE TRIGGER ALL;
ALTER TABLE personality_assessments DISABLE TRIGGER ALL;
ALTER TABLE ai_interpretations DISABLE TRIGGER ALL;

-- Update test_results table
UPDATE test_results 
SET test_name = 'Despega Cerebral'
WHERE test_name IN ('DISC', 'Test DISC', 'Evaluación DISC');

UPDATE test_results 
SET test_name = 'Mapa de Personalidad Despega'
WHERE test_name IN ('MBTI', 'Test MBTI', 'Indicador MBTI');

UPDATE test_results 
SET test_name = '5 Dimensiones Despega'
WHERE test_name IN ('Big Five', 'Test Big Five');

UPDATE test_results 
SET test_name = 'Brújula Vocacional Despega'
WHERE test_name IN ('RIASEC', 'Test RIASEC', 'Intereses Profesionales');

UPDATE test_results 
SET test_name = 'Inteligencia Emocional Despega'
WHERE test_name IN ('Inteligencia Emocional', 'Test IE', 'Emotional Intelligence');

UPDATE test_results 
SET test_name = 'Competencias Despega'
WHERE test_name IN ('Soft Skills', 'Habilidades Blandas', 'Test Soft Skills');

-- Update test_questions table
UPDATE test_questions 
SET test_type = 'despega-cerebral'
WHERE test_type IN ('disc', 'DISC');

UPDATE test_questions 
SET test_type = 'mapa-personalidad'
WHERE test_type IN ('mbti', 'MBTI');

UPDATE test_questions 
SET test_type = '5-dimensiones'
WHERE test_type IN ('big-five', 'big_five', 'bigfive');

UPDATE test_questions 
SET test_type = 'brujula-vocacional'
WHERE test_type IN ('riasec', 'RIASEC');

UPDATE test_questions 
SET test_type = 'ie-despega'
WHERE test_type IN ('emotional-intelligence', 'emotional_intelligence', 'ei');

UPDATE test_questions 
SET test_type = 'competencias-despega'
WHERE test_type IN ('soft-skills', 'soft_skills', 'softskills');

-- Update personality_assessments table
UPDATE personality_assessments 
SET assessment_type = 'despega-cerebral'
WHERE assessment_type IN ('disc', 'DISC');

UPDATE personality_assessments 
SET assessment_type = 'mapa-personalidad'
WHERE assessment_type IN ('mbti', 'MBTI');

UPDATE personality_assessments 
SET assessment_type = '5-dimensiones'
WHERE assessment_type IN ('big-five', 'big_five');

-- Update ai_interpretations table
UPDATE ai_interpretations 
SET test_name = 'Despega Cerebral'
WHERE test_name IN ('DISC', 'Test DISC', 'Evaluación DISC');

UPDATE ai_interpretations 
SET test_name = 'Mapa de Personalidad Despega'
WHERE test_name IN ('MBTI', 'Test MBTI', 'Indicador MBTI');

UPDATE ai_interpretations 
SET test_name = '5 Dimensiones Despega'
WHERE test_name IN ('Big Five', 'Test Big Five');

UPDATE ai_interpretations 
SET test_name = 'Brújula Vocacional Despega'
WHERE test_name IN ('RIASEC', 'Test RIASEC', 'Intereses Profesionales');

UPDATE ai_interpretations 
SET test_name = 'Inteligencia Emocional Despega'
WHERE test_name IN ('Inteligencia Emocional', 'Test IE');

UPDATE ai_interpretations 
SET test_name = 'Competencias Despega'
WHERE test_name IN ('Soft Skills', 'Habilidades Blandas');

-- Re-enable triggers
ALTER TABLE test_results ENABLE TRIGGER ALL;
ALTER TABLE test_questions ENABLE TRIGGER ALL;
ALTER TABLE personality_assessments ENABLE TRIGGER ALL;
ALTER TABLE ai_interpretations ENABLE TRIGGER ALL;
