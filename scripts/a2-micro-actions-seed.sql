-- Insertar microacciones diarias personalizadas para A2
-- Muestra ejemplo para 3 rutas con perfiles A, B, C, D

-- Primero, obtenemos IDs de módulos (asumiendo que ya existen)
-- Esta es una estructura de ejemplo. En producción, vincularía cada microacción a un módulo específico

-- RUTA 1: TÉCNICO ESPECIALISTA (Perfil ideal: C - Cumplidor)
-- Día 1 para perfil A (Dominante)
INSERT INTO a2_micro_actions (module_id, dia, tipo_perfil, titulo, descripcion, formato, duracion_minutos, tareas, objetivos) VALUES
('00000000-0000-0000-0000-000000000001', 1, 'A', 'Domina Python: Primer Proyecto', 'Crea un script funcional que resuelva un problema real sin perder tiempo en teoría', 'proyecto', 45, '["Crear archivo main.py", "Definir función principal", "Testear localmente", "Compartir resultado"]', '["Ejecutar código Python", "Resolver problema real", "Setup inicial"]');

-- Día 1 para perfil B (Influyente)
INSERT INTO a2_micro_actions (module_id, dia, tipo_perfil, titulo, descripcion, formato, duracion_minutos, tareas, objetivos) VALUES
('00000000-0000-0000-0000-000000000001', 1, 'B', 'Python: Crea tu Primera App Compartible', 'Aprende Python a través de un proyecto que puedas mostrar a otros', 'video', 35, '["Ver caso de éxito", "Diseñar proyecto", "Code live", "Compartir en grupo"]', '["Entender basics de Python", "Generar algo shareable", "Conectar con comunidad"]');

-- Día 1 para perfil C (Cumplidor)
INSERT INTO a2_micro_actions (module_id, dia, tipo_perfil, titulo, descripcion, formato, duracion_minutos, tareas, objetivos) VALUES
('00000000-0000-0000-0000-000000000001', 1, 'C', 'Python Paso a Paso: Fundamentos', 'Curso estructurado sobre variables, tipos y operaciones básicas de Python', 'lectura', 60, '["Leer documentación oficial", "Hacer 5 ejercicios", "Quiz de validación", "Revisar soluciones"]', '["Dominar tipos de datos", "Entender operadores", "Practicar con ejercicios"]');

-- Día 1 para perfil D (Estable)
INSERT INTO a2_micro_actions (module_id, dia, tipo_perfil, titulo, descripcion, formato, duracion_minutos, tareas, objetivos) VALUES
('00000000-0000-0000-0000-000000000001', 1, 'D', 'Python: Aprende con la Comunidad', 'Video introductorio con ejemplos claros y práctica colaborativa', 'reflexion', 40, '["Ver introducción", "Escribir primer código", "Compartir dudas en comunidad", "Reflexionar sobre aprendizaje"]', '["Sentir confianza con Python", "Conectar con mentores", "Empezar a practicar"]');

-- RUTA 1: Día 2 para todos los perfiles (ejemplo mínimo)
INSERT INTO a2_micro_actions (module_id, dia, tipo_perfil, titulo, descripcion, formato, duracion_minutos, tareas, objetivos) VALUES
('00000000-0000-0000-0000-000000000001', 2, 'A', 'Python: Controla el Flujo', 'Ejercicio práctico: condicionales y bucles aplicados a problemas reales', 'ejercicio', 40, '["Resolver 3 ejercicios", "Aplicar a caso real", "Compartir solución"]', '["Dominar if/else/for", "Resolver problemas"]'),
('00000000-0000-0000-0000-000000000001', 2, 'B', 'Crea un Chatbot Simple en Python', 'Construye un bot conversacional y comparte tu creación', 'proyecto', 50, '["Diseñar respuestas", "Escribir código", "Testear", "Mostrar a amigos"]', '["Entender lógica de chatbots", "Crear algo impresionante"]),
('00000000-0000-0000-0000-000000000001', 2, 'C', 'Condicionales y Bucles: Guía Detallada', 'Aprendizaje estructurado con ejemplos paso a paso', 'lectura', 75, '["Leer secciones 1-3", "Hacer todos los ejercicios", "Quiz", "Revisar errores comunes"]', '["Dominar condicionales", "Entender bucles", "Evitar errores comunes"]),
('00000000-0000-0000-0000-000000000001', 2, 'D', 'Python: Práctica Guiada con Mentor', 'Video con mentoría paso a paso en comunidad', 'video', 45, '["Ver video", "Practicar junto a mentor", "Hacer preguntas", "Reflexionar logros"]', '["Practicar en comunidad", "Recibir retroalimentación"]);

-- RUTA 2: LÍDER EJECUTIVO (Perfil ideal: A - Dominante)
-- Día 1 para todos los perfiles
INSERT INTO a2_micro_actions (module_id, dia, tipo_perfil, titulo, descripcion, formato, duracion_minutos, tareas, objetivos) VALUES
('00000000-0000-0000-0000-000000000002', 1, 'A', 'Liderazgo: Toma Decisiones Rápidas', 'Caso: cómo decidir en 10 minutos con datos incompletos', 'proyecto', 40, '["Analizar caso real", "Tomar decisión", "Justificar en 2 min", "Compartir resultado"]', '["Decidir con confianza", "Actuar rápido", "Aceptar riesgo calculado"]),
('00000000-0000-0000-0000-000000000002', 1, 'B', 'Comunica como Líder: Inspira tu Equipo', 'Storytelling ejecutivo: cómo presentar visión que motiva', 'video', 35, '["Ver técnica", "Grabar tu pitch", "Compartir con grupo", "Recibir feedback"]', '["Comunicar visión", "Motivar equipos", "Influenciar"]),
('00000000-0000-0000-0000-000000000002', 1, 'C', 'Marcos de Decisión Ejecutiva', 'Guía detallada de 5 frameworks para decisiones estratégicas', 'lectura', 80, '["Leer marcos", "Comparar enfoques", "Aplicar a caso", "Quiz de comprensión"]', '["Dominar frameworks", "Pensar estratégico"]),
('00000000-0000-0000-0000-000000000002', 1, 'D', 'Liderazgo Empático: Escucha tu Equipo', 'Cómo conectar con tu equipo antes de decidir', 'reflexion', 45, '["Ver técnica", "Reflexionar sobre tu estilo", "Practicar escucha", "Compartir insights"]', '["Desarrollar empatía", "Conectar con equipo"]);

-- RUTA 3: EMPRENDEDOR CREATIVO (Perfil ideal: B - Influyente)
-- Día 1 para todos los perfiles
INSERT INTO a2_micro_actions (module_id, dia, tipo_perfil, titulo, descripcion, formato, duracion_minutos, tareas, objetivos) VALUES
('00000000-0000-0000-0000-000000000003', 1, 'A', 'MVP en 48 Horas: De Idea a Producto', 'Crea la versión mínima de tu negocio en 2 días', 'proyecto', 60, '["Definir problema", "Listar features", "Prototipear", "Validar con usuarios"]', '["Shipped rápido", "Aprender del mercado"]),
('00000000-0000-0000-0000-000000000003', 1, 'B', 'Storytelling de Negocios: Vende tu Idea', 'Pitch, social media, pitch deck: conéctate con tu audiencia', 'video', 50, '["Ver ejemplos", "Escribir tu pitch", "Grabar video", "Compartir en redes"]', '["Comunicar visión", "Viral storytelling", "Vender idea"]),
('00000000-0000-0000-0000-000000000003', 1, 'C', 'Plan de Negocio: Estructura Profesional', 'Template y guía paso a paso para crear plan de negocios formal', 'lectura', 90, '["Leer secciones", "Llenar template", "Analizar finanzas", "Revisar riesgos"]', '["Plan estructurado", "Pensar estratégico"]),
('00000000-0000-0000-0000-000000000003', 1, 'D', 'Emprendimiento Sostenible: Comunidad Primero', 'Cómo construir negocio que ayude a otros', 'reflexion', 50, '["Definir propósito", "Identificar impacto", "Conectar con comunidad", "Planificar acciones"]', '["Propósito claro", "Conectar con gente", "Crear impacto"]);

-- Ejemplos para Ruta 4: ESPECIALISTA COLABORATIVO (Perfil ideal: D - Estable)
INSERT INTO a2_micro_actions (module_id, dia, tipo_perfil, titulo, descripcion, formato, duracion_minutos, tareas, objetivos) VALUES
('00000000-0000-0000-0000-000000000004', 1, 'A', 'Colaboración Efectiva: Delega Rápido', 'Cómo trabajar con otros sin perder el control', 'ejercicio', 35, '["Identificar tareas", "Delegar", "Dar feedback", "Comunicar resultados"]', '["Trabajar en equipo", "Delegar efectivamente"]),
('00000000-0000-0000-0000-000000000004', 1, 'B', 'Construye Relaciones Duraderas en Equipo', 'Networking interno: cómo conectar y colaborar', 'networking', 40, '["Conocer colegas", "Organizar café", "Facilitar conexiones", "Compartir learnings"]', '["Red interna fuerte", "Colaboración fluida"]),
('00000000-0000-0000-0000-000000000004', 1, 'C', 'Procesos de Colaboración Efectiva', 'Guía: cómo documentar, comunicar y sincronizar en equipo', 'lectura', 75, '["Leer procesos", "Aplicar a tu equipo", "Crear checklist", "Implementar sistema"]', '["Procesos claros", "Comunicación efectiva"]),
('00000000-0000-0000-0000-000000000004', 1, 'D', 'Trabajo en Equipo: Apoyo Mutuo', 'Cómo ser un buen compañero y apoyar a otros', 'reflexion', 45, '["Ver ejemplos", "Reflexionar tu rol", "Identificar cómo ayudar", "Crear plan de apoyo"]', '["Empatía en equipo", "Apoyo genuino"]);
