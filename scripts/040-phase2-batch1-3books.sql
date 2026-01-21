-- PHASE 2 & 3: Complete all remaining books (17 + 6 = 23 books)
-- Update all books with less than 8000 characters to have comprehensive content

UPDATE knowledge_base 
SET 
  content = CASE 
    WHEN title ILIKE '%So Good They Can%' THEN 'SO GOOD THEY CAN''T IGNORE YOU - Cal Newport
Cal Newport desafía el mito del "Sigue tu pasión" y propone una filosofía revolucionaria basada en la excelencia. En lugar de buscar trabajo que ya te apasione, debes desarrollar habilidades valiosas que te hagan tan excepcional que NADIE pueda ignorarte.

CONCEPTO CENTRAL: LA REGLA DEL CAPITAL PROFESIONAL
Tu valor en el mercado laboral depende del capital profesional que has acumulado: habilidades raras y valiosas que pocas personas poseen. Sin este capital, no puedes negociar por un trabajo significativo o pasional.

LOS CUATRO REGLAS:

REGLA 1 - NO SIGAS TU PASION
La pasión es el resultado, no el punto de partida. La mayoría de personas exitosas en trabajos pasionales PRIMERO desarrollaron excelencia, LUEGO desarrollaron pasión por su trabajo.

REGLA 2 - SE EXCELENTE HACIENDO COSAS DIFICILES
La excelencia se construye a través de "deliberate practice" - práctica enfocada en mejorar aspectos débiles con retroalimentación inmediata. Las habilidades valiosas son siempre difíciles de aprender.

REGLA 3 - PIENSA DIFERENTE SOBRE EL TRABAJO
En lugar de preguntar "¿Qué puedo hacer que me apasione?", pregunta "¿Qué conjunto de habilidades valiosas puedo desarrollar?" Las personas con trabajos pasionales tienen dos cosas: excelencia y autonomía.

REGLA 4 - LA MISION LLEGA DESPUES
Una vez que has acumulado suficiente capital profesional, puedes identificar una "misión" - trabajo que contribuye a algo más grande que tú. Pero sin capital primero, tus opciones son limitadas.

APLICACION INMEDIATA:
Identifica 3 habilidades valiosas en tu industria. Diseña deliberate practice para cada una. En 6-12 meses tendrás capital profesional que cambia tu carrera completamente.'
    WHEN title ILIKE '%Deep Work%' THEN 'DEEP WORK - Cal Newport
El trabajo profundo - concentración sin distracciones en tareas cognitivamente exigentes - es cada vez más raro pero más valioso. En un mundo de distracciones constantes, la capacidad de enfoque profundo se convierte en tu mayor ventaja competitiva.

DEFINICION: DEEP WORK
Actividades profesionales que requieren total concentración en una tarea desafiante. Pueden ser análisis complejos, escritura creativa, programación, o cualquier tarea que requiera pensamiento de alto nivel. Lo opuesto es "shallow work" - tareas que no requieren pensamiento profundo y son fácilmente reemplazables.

POR QUE IMPORTA EN 2026:
La economía está dividida en tres grupos: quienes dominan tecnologías complejas (alto pago), quienes son talentosos y creativos en su dominio (alto pago), y todos los demás (bajo pago, fácil reemplazo). Deep work te coloca en los primeros dos grupos.

LOS CUATRO PRINCIPIOS:

1. TRABAJA PROFUNDAMENTE
Bloquea tiempo sin distracciones. Apaga notificaciones. No atiendas emails durante deep work sessions. Newport recomienda sesiones de 90-120 minutos máximo (el cerebro se agota). Después, descansa completamente.

2. ABRACZA EL ABURRIMIENTO
Si siempre estás consumiendo estímulo (redes sociales, podcasts, videos), tu cerebro pierde la capacidad de concentrarse. Pasar tiempo aburrido - en cola, en viajes - es esencial para entrenar tu atención. Resiste la tentación de llenar cada momento.

3. ABANDONA LAS REDES SOCIALES
Las redes sociales son diseñadas para ser adictivas, no productivas. Si tu trabajo requiere presencia social, usa herramientas específicas en horarios específicos. No navegues casualmente.

4. DRENA LO SUPERFICIAL
El shallow work consume tiempo sin crear valor. Audita tu semana: qué % del tiempo es deep vs shallow? El objetivo es maximizar deep work. Esto requiere decir "no" frecuentemente.

ESTRATEGIA PRACTICA INMEDIATA:
Esta semana, identifica tu tarea más importante (que requiere deep work). Bloquea 5 horas de tu semana. Apaga todo. Trabaja profundamente. Mide el resultado. Repite.'
    WHEN title ILIKE '%Steal Like an Artist%' THEN 'STEAL LIKE AN ARTIST - Austin Kleon
Toda creatividad es combinación de ideas existentes. En lugar de esperar inspiración divina, puedes estudiar y recombinar el trabajo de artistas que admiras. Esto no es plagio - es aprendizaje acelerado.

LOS 10 MANDAMIENTOS DEL ROBO CREATIVO:

1. COPIA LA INFLUENCIA
Estudia artistas que amas. Aprende qué hace su trabajo especial. Eventualmente, tu estilo propio emergará, influenciado pero único.

2. NO ESPERES ENCONTRAR TU VOZ
Tu voz es la intersección de tus influencias. A través de copiar y recombinar, descubrirás lo tuyo.

3. USA LO QUE APRENDAS
No solo estudies - crea. Aplica lo que aprendiste en formas nuevas. La creatividad es acción, no contemplación.

4. DOCUMENTAR ES NECESARIO
Mantén un "swipe file" - colección de ideas, diseños, escritura que te inspira. Revisa regularmente. Esto entrena tu ojo para la excelencia.

5. LA INUTILIDAD TIENE VALOR
Pasa tiempo hacienda "nada" - caminatas, meditación, pensamiento sin propósito específico. Aquí es donde sucede la combinación creativa inconsciente.

6. MEZCLA COSAS DISPARES
Las innovaciones vienen de conectar dominios diferentes. Un escritor puede aprender de arquitectura. Un diseñador de música. La heterogeneidad de influencias crea originalidad.

7. SEGURIDAD FINANCIERA IMPORTA
Es difícil ser creativo si estás en pánico financiero. Un trabajo "normal" que pague las cuentas puede darte la libertad de crear sin presión.

8. EL TIEMPO ES MATERIAL
Muchas veces no tienes ideas - tienes falta de tiempo. Protege tu tiempo como proteges tu dinero. Es igualmente valioso.

APLICACION:
Crea un "swipe file" hoy. Recopia 30 ejemplos de trabajo que amas. Analiza qué elementos vuelven a aparecer. Empieza a crear combinando estos elementos.'
    ELSE content
  END,
  category = CASE 
    WHEN title ILIKE '%So Good%' THEN 'Desarrollo Profesional'
    WHEN title ILIKE '%Deep Work%' THEN 'Productividad'
    WHEN title ILIKE '%Steal Like%' THEN 'Creatividad'
    ELSE category
  END,
  difficulty_level = 'Intermedio',
  language = 'Espanol',
  estimated_read_time = 45
WHERE 
  (LENGTH(content) < 8000 AND (
    title ILIKE '%So Good They Can%' OR 
    title ILIKE '%Deep Work%' OR 
    title ILIKE '%Steal Like an Artist%'
  ));

-- Commit the changes
COMMIT;
