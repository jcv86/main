-- Migration: Rename DISC dimension columns to new nomenclature
-- From: dominancia, influencia, estabilidad, consciencia
-- To: accion, inspiracion, apoyo, excelencia

-- Rename columns in despega_a1_test_results table
ALTER TABLE despega_a1_test_results
RENAME COLUMN score_dominancia TO score_accion;

ALTER TABLE despega_a1_test_results
RENAME COLUMN score_influencia TO score_inspiracion;

ALTER TABLE despega_a1_test_results
RENAME COLUMN score_estabilidad TO score_apoyo;

ALTER TABLE despega_a1_test_results
RENAME COLUMN score_consciencia TO score_excelencia;

-- Commit message: Update DISC dimension nomenclature from classic DISC to Action/Inspiration/Support/Excellence
