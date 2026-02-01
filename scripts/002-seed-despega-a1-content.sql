-- Seed script for DTC Rutas and Misiones
-- This populates the foundation for A1, A2, Aterrizaje, and Base pillars

-- A1: DESPEGA CEREBRAL RUTAS
INSERT INTO despega_rutas (nombre, descripcion, pilar, paquete, camino, icon, color, order_index) VALUES
('Energía', 'Sueño, hábitos base, vitalidad y consistencia', 'a1_cerebral', 'energia', 'persona', '⚡', '#3b82f6', 1),
('Enfoque', 'Foco, atención, productividad y sistema semanal', 'a1_cerebral', 'enfoque', 'ambos', '🎯', '#10b981', 2),
('Relaciones', 'Comunicación, vínculos y networking', 'a1_cerebral', 'relaciones', 'persona', '🤝', '#f97316', 3),
('Plan Ejecutivo', 'Ejecución, prioridades, decisiones y rituales', 'a1_cerebral', 'plan_ejecutivo', 'profesional', '📋', '#a855f7', 4)
ON CONFLICT DO NOTHING;

-- Get the ruta IDs for A1
WITH a1_rutas AS (
  SELECT id, paquete FROM despega_rutas WHERE pilar = 'a1_cerebral'
)
INSERT INTO despega_misiones (ruta_id, ciclo, dia, titulo, descripcion, tipo, duracion_minutos, puntos, order_index) 
SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'energia'),
  30, 1, 'Establecer hora de dormir fija', 'Define tu hora de acostarte y despertarte', 'habito', 15, 10, 1
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'energia'),
  30, 2, 'Hidratación matutina', 'Bebe un vaso de agua al despertar', 'accion', 10, 10, 2
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'energia'),
  30, 3, 'Eliminar pantallas 1h antes de dormir', 'Reduce exposición a luz azul', 'habito', 20, 15, 3
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'energia'),
  30, 4, 'Crear rutina de relajación nocturna', '10 minutos de lectura o meditación', 'accion', 25, 15, 4
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'energia'),
  30, 5, 'Evaluar calidad del sueño', 'Registra cómo dormiste esta semana', 'reflexion', 15, 20, 5

UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'enfoque'),
  30, 1, 'Definir 3 prioridades del día', 'Identifica las 3 tareas más importantes', 'reflexion', 15, 10, 1
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'enfoque'),
  30, 2, 'Bloquear tiempo de concentración', '2 horas sin interrupciones', 'accion', 120, 15, 2
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'enfoque'),
  30, 3, 'Desactivar notificaciones', 'Elimina distracciones digitales', 'accion', 10, 10, 3
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'enfoque'),
  30, 4, 'Técnica Pomodoro', '25 min trabajo + 5 min descanso', 'accion', 35, 15, 4
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'enfoque'),
  30, 5, 'Revisión semanal', 'Evalúa tu semana y planifica la siguiente', 'reflexion', 20, 20, 5

UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'relaciones'),
  30, 1, 'Contactar a 1 persona importante', 'Envía un mensaje a alguien que valoras', 'accion', 15, 10, 1
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'relaciones'),
  30, 2, 'Practicar escucha activa', 'En tu próxima conversación, solo escucha', 'accion', 30, 15, 2
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'relaciones'),
  30, 3, 'Expresar gratitud', 'Agradece a alguien específicamente', 'accion', 10, 10, 3
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'relaciones'),
  30, 4, 'Pedir feedback', 'Solicita retroalimentación honesta', 'reflexion', 20, 15, 4
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'relaciones'),
  30, 5, 'Planificar conexión semanal', 'Agenda tiempo para relaciones importantes', 'reflexion', 15, 20, 5

UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'plan_ejecutivo'),
  30, 1, 'Definir objetivo semanal', '1 meta clara y medible para la semana', 'reflexion', 20, 10, 1
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'plan_ejecutivo'),
  30, 2, 'Crear checklist diario', 'Lista de tareas con prioridades', 'accion', 15, 10, 2
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'plan_ejecutivo'),
  30, 3, 'Eliminar 1 tarea innecesaria', 'Identifica qué puedes dejar de hacer', 'reflexion', 20, 15, 3
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'plan_ejecutivo'),
  30, 4, 'Implementar ritual matutino', '30 min de preparación mental', 'habito', 30, 15, 4
UNION ALL SELECT 
  (SELECT id FROM a1_rutas WHERE paquete = 'plan_ejecutivo'),
  30, 5, 'Revisar y ajustar plan', 'Evalúa progreso y ajusta estrategia', 'reflexion', 25, 20, 5
ON CONFLICT DO NOTHING;
