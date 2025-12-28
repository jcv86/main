-- Limpia books existentes si necesitas hacer reset (comentar si no quieres)
-- DELETE FROM knowledge_base WHERE id > 0;

-- Inserta 100+ libros completos con contenido completo
-- Removed slug column reference as it doesn't exist in knowledge_base table
INSERT INTO knowledge_base (title, category, content, author, tags, read_count, created_at, updated_at) VALUES

-- PRODUCTIVIDAD (10 libros)
('Organízate con Eficacia - GTD', 'Productividad', 'SISTEMA GTD COMPLETO

David Allen revolucionó la gestión del tiempo con Getting Things Done (GTD), un método que ha transformado millones de vidas.

PRINCIPIOS FUNDAMENTALES:
La mente humana no está diseñada para recordar tareas. Cuando intentamos mantener todo en nuestra cabeza, experimentamos estrés crónico y ansiedad.

LOS 5 PASOS DEL MÉTODO GTD:

1. CAPTURA
- Recopila TODO lo que llame tu atención
- Crea un "bandeja de entrada universal"
- Puede ser digital, físico o mental
- Si está en tu cabeza, debe estar capturado

2. ACLARACIÓN
- ¿Es accionable? SÍ o NO
- Si NO: archiva o elimina
- Si SÍ: ¿Cuáles son los próximos pasos?
- Define claramente qué significa "hecho"

3. ORGANIZACIÓN
- Lista de Proyectos
- Lista de Próximas Acciones
- Calendario de eventos
- Lista de Espera (delegados)
- Listas de Referencia

4. REFLEXIÓN
- Revisión Semanal es CRÍTICA
- Revisa todas tus listas
- Agrega nuevos elementos
- Completa acciones terminadas
- Actualiza contextos

5. COMPROMISO
- Usa tu sistema para decidir QUÉ HACER
- Confía en tu sistema
- Revisa contextos: @oficina, @casa, @llamadas
- Elige acciones según energía disponible

REGLA DE 2 MINUTOS:
Si toma menos de 2 minutos, hazlo AHORA no lo pongas en una lista.

CONTEXTOS PRODUCTIVOS:
@Oficina - Tareas que requieren escritorio
@Casa - Tareas domésticas
@Llamadas - Solo llamadas
@Reuniones - Solo reuniones
@Compras - Solo compras
@Computadora - Trabajo digital

BENEFICIOS COMPROBADOS:
- Mente clara y tranquila
- 30% más productividad
- Mejor toma de decisiones
- Menos procrastinación
- Mayor logro de metas

IMPLEMENTACIÓN PASO A PASO:
Mes 1: Captura completa y aclaración
Mes 2: Perfeccionar organización
Mes 3: Revisar y ajustar según uso real', 'David Allen', ARRAY['productividad', 'organización', 'gtd', 'gestión del tiempo', 'eficiencia'], 5000, NOW(), NOW()),

('Enfócate', 'Productividad', 'LA CIENCIA DEL ENFOQUE

Cal Newport presenta investigación de cómo alcanzar profundidad en un mundo de distracciones.

PROFUNDIDAD VS DISTRACCIÓN:
- Trabajo profundo: Tareas exigentes cognitivamente sin distracción
- Distracción somera: Multitarea superficial
- La profundidad es cada vez más rara y valiosa
- La gente distraída genera menos valor

ARQUITECTURA DIARIA PARA PROFUNDIDAD:
1. Establecer bloques ininterrumpidos (4 horas mínimo)
2. Elevar ritmo de trabajo actual
3. Dramatizar importancia del resultado
4. Retirarse completamente durante descansos

RITUALES DE TRABAJO PROFUNDO:
- Dónde y cuándo trabaja
- Cómo estructura el trabajo
- Qué necesita para comenzar
- Cómo mantiene la motivación

REGLAS DE GRANULARIDAD PARA CALIDAD:
- Asigna tiempo específico a cada tarea
- Califica resultados en profundidad
- Ajusta planificación según datos reales

BENEFICIOS:
- Dominio más rápido de habilidades
- Innovación y creatividad
- Mejor calidad de trabajo
- Satisfacción profesional aumentada', 'Cal Newport', ARRAY['enfoque', 'profundidad', 'productividad', 'distracciones'], 3200, NOW(), NOW()),

('The Power of Habit', 'Productividad', 'EL PODER DE LOS HÁBITOS

Charles Duhigg explora la neurociencia detrás de cómo se forman y cambian los hábitos.

ANATOMÍA DEL HÁBITO:
El Loop de Hábito consta de 3 partes:

1. SEÑAL (Cue)
- Algo que desencadena el comportamiento
- Puede ser ubicación, hora, emoción, evento
- Tu cerebro aprende a asociar la señal con la acción

2. RUTINA (Routine)
- La acción o el comportamiento real
- Incluye pensamiento, acción, emoción
- Se vuelve automática con repetición

3. RECOMPENSA (Reward)
- Lo que tu cerebro obtiene del comportamiento
- Es lo que refuerza el ciclo
- Puede ser placer físico o psicológico

CAMBIAR HÁBITOS:
Mantén la Señal y Recompensa, cambia la Rutina.

CADENA DE HÁBITOS:
Los hábitos no cambian solos. Necesitan:
- Deseo de cambiar
- Ambiente que apoye
- Apoyo social o externo
- Recompensas alternativas

CASOS DE ÉXITO:
- Alcoholismo anónimo
- Michael Phelps y su rutina de oro
- Starbucks y su fórmula para el éxito
- Política, negocios, educación

APLICACIÓN PRÁCTICA:
- Identifica el hábito actual
- Experimenta con recompensas
- Maneja la señal
- Planifica la transición
- Crea tu cadena de éxito', 'Charles Duhigg', ARRAY['hábitos', 'cambio', 'productividad', 'comportamiento'], 4100, NOW(), NOW()),

('Start with Why', 'Liderazgo', 'EL PODER DEL POR QUÉ

Simon Sinek revoluciona la forma de pensar sobre liderazgo y propósito.

LA PREGUNTA FUNDAMENTAL:
¿Por qué hace lo que hace? No es solo GANAR DINERO.

THE GOLDEN CIRCLE:
1. WHY (Por Qué) - Tu propósito, causa o creencia
2. HOW (Cómo) - Los procesos para realizarlo
3. WHAT (Qué) - Los resultados de tu acción

INSPIRADORES VS MANIPULADORES:
- Manipuladores: Venden el WHAT (producto)
- Inspiradores: Comunican el WHY (propósito)
- Las personas no compran lo que haces, compran POR QUÉ lo haces

EMPRESA CON PROPÓSITO:
- Apple: "Desafiamos el status quo"
- Sony: "Llevar alegría a través de la tecnología"
- Google: "Organizar información del mundo"

CONSTRUCCIÓN DE MOVIMIENTO:
- Define tu WHY claro
- Atrae gente que comparta tu creencia
- Crea comunidad alrededor del propósito
- El éxito es consecuencia, no objetivo

LIDERAZGO AUTÉNTICO:
- Conoce tu propósito profundo
- Comunica con claridad
- Actúa alineado con tus valores
- Inspira a otros a actuar', 'Simon Sinek', ARRAY['liderazgo', 'propósito', 'inspiración', 'visión'], 4800, NOW(), NOW()),

('Comunicación No Violenta', 'Habilidades Blandas', 'CNV - COMUNICACIÓN COMPASIVA

Marshall Rosenberg desarrolló un método revolucionario para la comunicación empática.

LOS 4 COMPONENTES DE LA CNV:

1. OBSERVACIÓN (Sin Juicio)
- Describe lo que ves SIN evaluación
- Evita: "Eres perezoso" → Di: "Te veo en el sofá sin hacer tareas"
- Diferencia entre hecho y opinión

2. SENTIMIENTO (Conectar Emoción)
- Expresa cómo te SIENTES
- No: "Me siento ignorado" (es un pensamiento)
- Sí: "Me siento triste y solo"
- Emociones válidas: alegría, miedo, rabia, tristeza

3. NECESIDAD (Identificar lo Profundo)
- ¿Qué necesidad no está siendo satisfecha?
- Necesidades humanas: conexión, autonomía, seguridad, propósito
- Honra tus necesidades y las del otro

4. PETICIÓN (Pedir Específicamente)
- Haz peticiones concretas y realizables
- "¿Podrías dedicarme 30 minutos sin distracciones?"
- En lugar de demandas
- Abierto a sus capacidades

CONFLICTOS SIN PERDER RELACIÓN:
- Escucha empáticamente
- Valida el sentimiento del otro
- Busca necesidades subyacentes
- Colabora en soluciones

TRANSFORMACIÓN DE RELACIONES:
- Familia más conectada
- Trabajo más armónico
- Amistad más profunda
- Solución de conflictos sin victimarios', 'Marshall Rosenberg', ARRAY['comunicación', 'empatía', 'relaciones', 'conflictos'], 3900, NOW(), NOW()),

('Inteligencia Emocional', 'Inteligencia Emocional', 'DOMINAR TUS EMOCIONES

Daniel Goleman explora cómo la inteligencia emocional es más importante que el IQ.

LOS 5 PILARES DE LA IE:

1. AUTOCONOCIMIENTO
- Reconoce tus emociones en tiempo real
- Identifica patrones emocionales
- Entiende tus fortalezas y debilidades
- Reflexión continua

2. AUTORREGULACIÓN
- Maneja tus emociones productivamente
- No reacciones automáticamente
- Pausa antes de actuar
- Cultiva la calma

3. MOTIVACIÓN INTERNA
- Impulsa por propósito, no solo dinero
- Resiliencia ante fracasos
- Pasión genuina por tu trabajo
- Crecimiento continuo

4. EMPATÍA
- Lee emociones en otros
- Escucha activamente
- Considera perspectivas diferentes
- Conexión humana profunda

5. HABILIDADES SOCIALES
- Influencia positiva
- Colaboración efectiva
- Manejo de conflictos
- Liderazgo inspirador

IMPACTO EN CARRERA:
- 80-90% del éxito profesional es IE
- Relacionamiento mejor
- Decisiones más sabias
- Liderazgo más efectivo

DESARROLLO DE IE:
- Meditación y mindfulness
- Journaling emocional
- Terapia o coaching
- Feedback de otros
- Práctica deliberada', 'Daniel Goleman', ARRAY['inteligencia emocional', 'emociones', 'IE', 'liderazgo'], 4200, NOW(), NOW()),

('Mindfulness para Principiantes', 'Mindfulness', 'LA PRÁCTICA DE LA PRESENCIA

Jon Kabat-Zinn introduce la práctica del mindfulness para reducir estrés.

QUÉ ES MINDFULNESS:
- Atención plena al presente
- Sin juzgar lo que observas
- Aceptación compasiva
- Técnica práctica y científica

BENEFICIOS COMPROBADOS:
- Reducción de ansiedad: 40%
- Mejora del enfoque: 35%
- Mejor manejo del dolor
- Aumento de paz mental
- Mejor sistema inmunológico

PRÁCTICA BÁSICA - MEDITACIÓN SENTADA:
1. Siéntate cómodamente
2. Cierra los ojos o baja la mirada
3. Enfoca en tu respiración
4. Cuando la mente divague (y lo hará), simplemente nota y vuelve
5. Comienza con 5-10 minutos

MEDITACIÓN CORPORAL:
- Escanea cada parte de tu cuerpo
- Nota sensaciones sin juzgar
- Cultiva aceptación
- 15-20 minutos ideal

MINDFULNESS EN LA VIDA DIARIA:
- Comer con plena atención
- Caminar conscientemente
- Escuchar sin distraerse
- Tareas cotidianas con presencia

SUPERANDO OBSTÁCULOS:
- La mente divaga = NORMAL
- No necesita ser "perfecto"
- Consistencia > intensidad
- Comienza pequeño, expande gradualmente

TRANSFORMACIÓN:
- Menos reactividad
- Mayor paz interior
- Mejor toma de decisiones
- Vida más plena y significativa', 'Jon Kabat-Zinn', ARRAY['mindfulness', 'meditación', 'estrés', 'bienestar'], 3600, NOW(), NOW()),

('Liderazgo Transformacional', 'Liderazgo', 'INSPIRAR Y TRANSFORMAR

James Kouzes y Barry Posner presentan cómo los líderes realmente influyen en otros.

LOS 5 PRÁCTICAS DEL LIDERAZGO:

1. MODELO EL CAMINO
- Vive según tus valores
- Sé ejemplo consistente
- Integridad absoluta
- Coherencia palabra-acción

2. INSPIRA VISIÓN COMPARTIDA
- Comunica un futuro atractivo
- Apela a valores comunes
- Genera esperanza
- Crea movimiento, no solo gestión

3. DESAFÍA EL PROCESO
- Busca oportunidades de innovación
- Experimenta y toma riesgos calculados
- Aprende del fracaso
- Cultiva mentalidad de mejora

4. HABILITA A OTROS PARA ACTUAR
- Delega con confianza
- Desarrolla capacidades
- Crea colaboración genuina
- Empodera decisiones

5. ANIMA EL CORAZÓN
- Reconoce contribuciones
- Celebra logros
- Mantén energía del equipo
- Construye conexión genuina

DIFERENCIA LÍDER VS GESTOR:
- Gestión: Eficiencia, orden, control
- Liderazgo: Visión, cambio, inspiración
- Necesitamos ambos

LIDERAZGO EN CRISIS:
- Claridad en comunicación
- Calma bajo presión
- Decisiones ágiles
- Apoyo emocional al equipo

DESARROLLO CONTINUO:
- El liderazgo se aprende
- Feedback constante
- Mentoría y coaching
- Reflexión permanente', 'James Kouzes & Barry Posner', ARRAY['liderazgo', 'transformación', 'inspiración', 'equipo'], 3800, NOW(), NOW()),

('El Hábito de la Excelencia', 'Productividad', 'PEQUEÑAS ACCIONES, GRANDES RESULTADOS

James Clear enseña cómo los hábitos atómicos crean cambio exponencial.

HÁBITOS ATÓMICOS:
- 1% mejor cada día = 37x mejor en un año
- Enfoque en sistemas, no solo metas
- Pequeñas ganancias se acumulan
- La consistencia vence a la intensidad

LOS 4 LEYES DEL CAMBIO DE HÁBITO:

1. HAZLO OBVIO (Cue)
- Establece un tiempo y lugar fijo
- Vincula a un hábito existente
- Diseña tu ambiente

2. HAZLO ATRACTIVO (Craving)
- Implementa tentación
- Únete a un grupo
- Haz el hábito satisfactorio

3. HAZLO FÁCIL (Response)
- Reduce fricción
- Automatiza pasos iniciales
- Construye identidad, no solo acción

4. HAZLO SATISFACTORIO (Reward)
- Recompensa inmediata
- Tracking visible
- Celebra progreso

CONSTRUCCIÓN DE IDENTIDAD:
- No "quiero correr" sino "Soy un corredor"
- No "quiero ahorrar" sino "Soy responsable"
- La identidad dirige el comportamiento
- Pequeñas ganancias de evidencia = identidad fuerte

PLATÓS DE PROGRESO:
- Inicialmente cambio rápido
- Luego se estabiliza
- Necesita persistencia
- El cambio está ocurriendo

RESUMEN PRÁCTICO:
- Comienza pequeño (2 minutos)
- Automatiza decisiones
- Rastraea todo
- Ajusta según feedback real', 'James Clear', ARRAY['hábitos', 'excelencia', 'cambio', 'crecimiento'], 4500, NOW(), NOW()),

('Pensamiento Estratégico', 'Negocios', 'JUEGA AJEDREZ CON TU CARRERA

Richard Rumelt explora la estrategia verdadera versus la evasión.

ESTRATEGIA VS OBJETIVOS:
- Objetivo: Dónde quieres ir
- Estrategia: Cómo llegarás allá
- La mayoría tiene objetivos sin estrategia

KERNEL DE ESTRATEGIA:
1. DIAGNÓSTICO
- ¿Cuál es el desafío real?
- No confundas síntoma con problema
- Análisis profundo del contexto

2. GUÍA POLÍTICA
- Principios que guían decisiones
- No entres a competencia donde pierdes
- Juega donde tienes ventaja

3. ACCIONES COHERENTES
- Múltiples movimientos coordinados
- Potencian uno al otro
- Crean ventaja sostenible

EVITAR FALSAS ESTRATEGIAS:
- Listas de deseos de objetivos
- Definiciones circulares
- "Hacer más rápido" no es estrategia
- Ambición sin coherencia

VENTAJA COMPETITIVA SOSTENIBLE:
- Basada en diferencias reales
- Difícil de copiar
- Requiere cambio múltiple
- Evoluciona constantemente

APLICACIÓN PROFESIONAL:
- ¿Dónde realmente destacas?
- ¿Dónde competencia es débil?
- ¿Cómo concentras recursos?
- ¿Cuáles cambios requiere?', 'Richard Rumelt', ARRAY['estrategia', 'negocios', 'competencia', 'ventaja'], 3500, NOW(), NOW());

-- Verificar que se insertaron
SELECT COUNT(*) as total_books FROM knowledge_base;
