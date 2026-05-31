-- Initialize all A3 module unlock rules with proper XP progression
-- XP calculation: Each module requires 70 more XP than the previous
-- Interview-0 (Auditoría Inicial): 0 XP (always available)
-- Module 2 (Método STAR): 70 XP
-- Module 3 (CV Inteligente): 140 XP
-- Module 4 (Análisis de Vacante): 210 XP
-- Module 5 (Análisis Multicanal): 280 XP
-- Module 6 (Entrenamiento Guiado): 350 XP
-- Module 7 (Entrenamiento Estructurado): 420 XP
-- Module 8 (Entrenamiento Desafiante): 490 XP
-- Module 9 (Entrenamiento Conversacional): 560 XP
-- Module 10 (Simulación Real): 630 XP

DELETE FROM a3_module_unlock_rules;

INSERT INTO a3_module_unlock_rules (
  module_id,
  module_name,
  sequence_order,
  prerequisite_module_id,
  xp_required,
  xp_reward
) VALUES
  ('auditoria-inicial', 'Auditoría Inicial', 1, NULL, 0, 70),
  ('metodo-star', 'Método STAR', 2, 'auditoria-inicial', 70, 70),
  ('cv-inteligente', 'CV Inteligente', 3, 'metodo-star', 140, 70),
  ('analisis-vacante', 'Análisis de Vacante', 4, 'cv-inteligente', 210, 70),
  ('analisis-multicanal', 'Análisis Multicanal', 5, 'analisis-vacante', 280, 70),
  ('entrenamiento-guiado', 'Entrenamiento Guiado', 6, 'analisis-multicanal', 350, 70),
  ('entrenamiento-estructurado', 'Entrenamiento Estructurado', 7, 'entrenamiento-guiado', 420, 70),
  ('entrenamiento-desafiante', 'Entrenamiento Desafiante', 8, 'entrenamiento-estructurado', 490, 70),
  ('entrenamiento-conversacional', 'Entrenamiento Conversacional', 9, 'entrenamiento-desafiante', 560, 70),
  ('simulacion-real', 'Simulación Real', 10, 'entrenamiento-conversacional', 630, 70);
