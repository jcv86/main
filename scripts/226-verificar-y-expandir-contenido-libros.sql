-- Verificar y expandir contenido de libros clave
-- Este script verifica el contenido actual y expande libros importantes

-- Verificar libros existentes
SELECT id, title, author, category, 
       LENGTH(content) as content_length,
       CASE 
         WHEN LENGTH(content) < 1000 THEN 'Contenido corto'
         WHEN LENGTH(content) < 3000 THEN 'Contenido medio'
         ELSE 'Contenido completo'
       END as content_status
FROM knowledge_base 
ORDER BY read_count DESC;

-- Expandir "Piense y Hágase Rico" de Napoleon Hill
UPDATE knowledge_base 
SET content = '# Piense y Hágase Rico

Napoleon Hill pasó 20 años estudiando a los hombres más ricos de su época para descubrir los secretos del éxito financiero. Este libro presenta los 13 principios fundamentales para alcanzar la riqueza.

## Los 13 Principios del Éxito

### 1. Deseo Ardiente
El punto de partida de todo logro es el deseo. Los deseos débiles traen resultados débiles, así como un pequeño fuego produce poco calor.

**Características del deseo ardiente:**
- Debe ser específico y definido
- Debe tener una fecha límite
- Debe estar respaldado por un plan de acción
- Debe ser tan intenso que se convierta en una obsesión

**Pasos para desarrollar deseo ardiente:**
1. Fija una cantidad específica de dinero que deseas
2. Determina exactamente qué darás a cambio
3. Establece una fecha definida para poseer ese dinero
4. Crea un plan definido y comienza inmediatamente
5. Escribe una declaración clara de estos puntos
6. Lee tu declaración dos veces al día

### 2. Fe
La fe es el "elixir eterno" que da vida, poder y acción al impulso del pensamiento. La fe es un estado mental que puede inducirse mediante la autosugestión.

**Cómo desarrollar fe:**
- Repite afirmaciones positivas diariamente
- Visualiza tu éxito como si ya fuera real
- Rodéate de influencias positivas
- Actúa como si ya tuvieras lo que deseas

### 3. Autosugestión
La autosugestión es el medio de comunicación entre la mente consciente y la subconsciente. Es el principio a través del cual puedes alcanzar tu subconsciente e influir en él.

### 4. Conocimiento Especializado
El conocimiento general, sin importar cuán grande sea, tiene poco uso en la acumulación de dinero. El conocimiento es solo poder potencial.

### 5. Imaginación
La imaginación es el taller de la mente humana donde se transforman los viejos conceptos e ideas en nuevas combinaciones y planes.

### 6. Planificación Organizada
Debes tener planes prácticos para alcanzar tu deseo. Los planes débiles e indefinidos producen resultados débiles e indefinidos.

### 7. Decisión
El análisis de varios cientos de personas que habían acumulado fortunas reveló que todas tenían el hábito de tomar decisiones rápidamente y cambiarlas lentamente.

### 8. Persistencia
La persistencia es un factor esencial para transformar el deseo en su equivalente monetario. La base de la persistencia es el poder de la voluntad.

### 9. Poder del Grupo Maestro
El poder se define como "conocimiento organizado e inteligentemente dirigido". El poder es esencial para el éxito en la acumulación de dinero.

### 10. El Misterio de la Transmutación Sexual
La emoción del sexo es, por mucho, la más poderosa de todas las emociones humanas. Cuando se aprovecha y redirige, esta fuerza motriz es capaz de elevar a uno a la esfera del genio.

### 11. La Mente Subconsciente
La mente subconsciente funciona día y noche. A través de un método de procedimiento conocido por el hombre, puedes hacer que tu mente subconsciente trabaje para ti.

### 12. El Cerebro
El cerebro humano puede compararse con una estación de radio que recibe y transmite vibraciones de pensamiento.

### 13. El Sexto Sentido
El sexto sentido es esa porción de la mente subconsciente que se ha denominado imaginación creativa.

## Aplicación Práctica

La riqueza no es solo dinero; es un estado mental. Los principios de este libro no son solo para acumular dinero, sino para desarrollar una mentalidad de éxito que se aplique a todas las áreas de la vida.'
WHERE title = 'Piense y Hágase Rico' OR title LIKE '%Piense y Hagase Rico%';

-- Expandir "El Arte de la Guerra" de Sun Tzu
UPDATE knowledge_base 
SET content = '# El Arte de la Guerra

El Arte de la Guerra de Sun Tzu es uno de los tratados de estrategia más influyentes de la historia. Aunque fue escrito para el contexto militar, sus principios se aplican perfectamente a los negocios, la política y la vida personal.

## Los 13 Capítulos Fundamentales

### 1. Hacer Planes
La guerra es de vital importancia para el Estado; es el dominio de la vida o de la muerte, el camino hacia la supervivencia o la pérdida del Imperio.

**Los Cinco Factores Fundamentales:**
1. **El Camino (Tao)**: La causa moral que une al pueblo con su líder
2. **El Cielo**: Las condiciones climáticas y temporales
3. **La Tierra**: El terreno, las distancias y la geografía
4. **El Comandante**: Las virtudes de sabiduría, sinceridad, benevolencia, coraje y disciplina
5. **La Disciplina**: La organización del ejército, las graduaciones y rangos

**Aplicación en Negocios:**
- Define claramente la misión y visión de tu empresa
- Analiza las condiciones del mercado
- Conoce tu territorio competitivo
- Desarrolla liderazgo efectivo
- Establece sistemas y procesos claros

### 2. Hacer la Guerra
En la guerra, la mejor política es tomar un estado intacto; arruinarlo es inferior a esto.

**Principios Clave:**
- La guerra prolongada nunca beneficia a un país
- Es mejor someter al enemigo sin luchar
- La suprema excelencia consiste en quebrar la resistencia del enemigo sin luchar

### 3. Atacar por Estratagema
Conoce a tu enemigo y conócete a ti mismo; en cien batallas nunca correrás peligro.

**Los Niveles de Conocimiento:**
1. **Conocerte a ti mismo y al enemigo**: Victoria segura
2. **Conocerte solo a ti mismo**: 50% de posibilidades
3. **No conocer ni a ti mismo ni al enemigo**: Derrota segura

### 4. Disposiciones Tácticas
Los guerreros hábiles primero se hacen invencibles y después aguardan la vulnerabilidad del enemigo.

### 5. Energía
El que es experto en el uso de tropas, su ímpetu es como el de piedras redondas que ruedan montaña abajo.

### 6. Puntos Débiles y Fuertes
Aparece donde no te esperan; ataca donde no estén preparados.

### 7. Maniobra
En la guerra, el camino directo puede convertirse en indirecto, y el indirecto en directo.

### 8. Variación en las Tácticas
No hay reglas constantes en la guerra.

### 9. Marcha del Ejército
Conoce a tu enemigo y conócete a ti mismo.

### 10. Terreno
Hay cinco tipos de terreno que determinan la estrategia.

### 11. Las Nueve Situaciones
En terreno mortal, lucha.

### 12. Ataque por Fuego
Usa armas locales para atacar.

### 13. Uso de Espías
El conocimiento previo no puede obtenerse de fantasmas ni espíritus.

## Aplicaciones Modernas

### En el Liderazgo Empresarial
- Lidera con el ejemplo y la estrategia
- Conoce las fortalezas y debilidades de tu equipo
- Adapta tu estilo según la situación
- Mantén la moral alta y la comunicación clara

### En Negociaciones
- Prepárate exhaustivamente antes de negociar
- Busca soluciones ganar-ganar cuando sea posible
- Mantén alternativas disponibles
- Usa el tiempo y la paciencia como herramientas

### En Gestión de Proyectos
- Planifica considerando múltiples escenarios
- Mantén flexibilidad en la ejecución
- Comunica claramente objetivos y expectativas
- Monitorea constantemente el progreso

El Arte de la Guerra enseña que la victoria se logra a través de la preparación superior, el timing perfecto, y la ejecución inteligente.'
WHERE title = 'El Arte de la Guerra' OR title LIKE '%Arte de la Guerra%';

-- Expandir "Mindset" de Carol Dweck
UPDATE knowledge_base 
SET content = '# Mindset: La Nueva Psicología del Éxito

Mindset revela cómo nuestras creencias sobre nuestras habilidades afectan profundamente nuestro éxito en todas las áreas de la vida.

## Los Dos Tipos de Mentalidad

### Mentalidad Fija (Fixed Mindset)
- Cree que las habilidades, inteligencia y talentos son rasgos fijos
- Evita desafíos por miedo al fracaso
- Se rinde fácilmente ante obstáculos
- Ve el esfuerzo como signo de falta de habilidad
- Ignora críticas útiles
- Se siente amenazado por el éxito de otros

### Mentalidad de Crecimiento (Growth Mindset)
- Cree que las habilidades pueden desarrollarse a través del esfuerzo
- Abraza desafíos como oportunidades de crecimiento
- Persiste ante obstáculos
- Ve el esfuerzo como el camino hacia la maestría
- Aprende de las críticas
- Se inspira en el éxito de otros

## Aplicaciones en Diferentes Áreas

### En la Educación
Los estudiantes con mentalidad de crecimiento:
- Buscan desafíos académicos
- Ven los errores como oportunidades de aprendizaje
- Desarrollan mayor resistencia ante dificultades
- Logran mejores resultados a largo plazo

### En los Negocios
**Líderes con Mentalidad de Crecimiento:**
- Se rodean de personas más capaces
- Asumen responsabilidad por fracasos y aprenden de ellos
- Toman riesgos calculados para innovar
- Crean culturas de aprendizaje y colaboración

### En las Relaciones
**Mentalidad de Crecimiento en Relaciones:**
- "Podemos trabajar juntos para mejorar nuestra relación"
- Ve los conflictos como oportunidades de crecimiento
- Entiende que las relaciones requieren esfuerzo continuo
- Persiste y busca soluciones ante dificultades

## Cómo Desarrollar una Mentalidad de Crecimiento

### 1. Reconoce tu Mentalidad Actual
- Identifica situaciones donde muestras mentalidad fija
- Observa tus reacciones ante desafíos y fracasos
- Nota tu diálogo interno en momentos difíciles

### 2. Cambia tu Diálogo Interno
- En lugar de "No puedo hacer esto" → "Aún no puedo hacer esto"
- En lugar de "Soy un fracaso" → "Cometí un error y puedo aprender de él"
- En lugar de "Esto es muy difícil" → "Esto me ayudará a crecer"

### 3. Abraza los Desafíos
- Busca activamente situaciones que te saquen de tu zona de confort
- Ve los desafíos como oportunidades, no amenazas
- Celebra el coraje de intentar cosas nuevas

### 4. Aprende del Fracaso
- Analiza qué salió mal sin juzgarte duramente
- Identifica lecciones específicas que puedes aplicar
- Ve el fracaso como información valiosa, no como veredicto final

### 5. Valora el Proceso
- Enfócate en el esfuerzo y la estrategia, no solo en los resultados
- Celebra el progreso incremental
- Disfruta el proceso de aprendizaje

## El Poder de "Aún No"

Una simple palabra puede transformar completamente la experiencia de aprendizaje. En lugar de decir "No puedo hacer esto", agregar "aún" abre posibilidades infinitas de crecimiento y desarrollo.

La mentalidad de crecimiento no es solo una técnica de autoayuda, es una forma fundamentalmente diferente de ver el potencial humano y el proceso de desarrollo personal.'
WHERE title = 'Mindset' OR title LIKE '%Mindset%';

-- Verificar las actualizaciones
SELECT title, author, LENGTH(content) as new_length,
       CASE 
         WHEN LENGTH(content) < 1000 THEN 'Corto'
         WHEN LENGTH(content) < 3000 THEN 'Medio'
         ELSE 'Completo'
       END as status
FROM knowledge_base 
WHERE title IN ('Piense y Hágase Rico', 'El Arte de la Guerra', 'Mindset')
ORDER BY LENGTH(content) DESC;

-- Mostrar estadísticas finales
SELECT 
    COUNT(*) as total_libros,
    AVG(LENGTH(content)) as promedio_caracteres,
    COUNT(CASE WHEN LENGTH(content) >= 3000 THEN 1 END) as libros_completos,
    COUNT(CASE WHEN LENGTH(content) < 1000 THEN 1 END) as libros_cortos
FROM knowledge_base;
