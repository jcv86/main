-- Verificar y expandir el contenido de todos los libros en la biblioteca
-- Este script identifica libros con contenido insuficiente y los expande

-- Primero, verificar el estado actual de los libros
SELECT 
    id,
    title,
    author,
    category,
    LENGTH(content) as content_length,
    CASE 
        WHEN LENGTH(content) < 500 THEN 'Muy corto'
        WHEN LENGTH(content) < 1500 THEN 'Corto'
        WHEN LENGTH(content) < 3000 THEN 'Medio'
        ELSE 'Completo'
    END as content_status
FROM knowledge_base 
ORDER BY LENGTH(content) ASC;

-- Expandir "Piense y Hágase Rico" con contenido completo
UPDATE knowledge_base 
SET content = 'Piense y Hágase Rico es uno de los libros de desarrollo personal más influyentes de todos los tiempos, basado en el estudio de más de 500 millonarios de la época.

**Los 13 Principios del Éxito:**

**1. Deseo Ardiente**
- El punto de partida de todo logro es el deseo
- Debe ser un deseo ardiente, no un simple deseo
- Fija una meta específica y desarrolla un plan para alcanzarla
- El deseo debe ser tan fuerte que se convierta en una obsesión

**2. Fe**
- La fe es el "elixir eterno" que da vida, poder y acción al impulso del pensamiento
- La fe es un estado mental que puede inducirse mediante la autosugestión
- Repite afirmaciones positivas hasta que tu subconsciente las acepte como verdad
- Actúa como si ya hubieras logrado tu objetivo

**3. Autosugestión**
- Es el medio de comunicación entre la mente consciente y subconsciente
- Repite tus objetivos en voz alta con emoción y convicción
- Visualiza tu éxito mientras repites tus afirmaciones
- La repetición constante graba el mensaje en tu subconsciente

**4. Conocimiento Especializado**
- El conocimiento general no es poder, solo el conocimiento especializado lo es
- Identifica el conocimiento específico que necesitas para tu objetivo
- Organiza y dirige tu conocimiento hacia un propósito definido
- Rodéate de expertos que complementen tus conocimientos

**5. Imaginación**
- La imaginación es el taller de la mente donde se forjan todos los planes
- Hay dos tipos: sintética (reorganiza ideas existentes) y creativa (crea algo nuevo)
- Usa la imaginación para crear planes detallados para alcanzar tus objetivos
- La imaginación se desarrolla con el uso, como un músculo

**6. Planificación Organizada**
- Transforma el deseo en acción a través de planes prácticos
- Forma un "Grupo Maestro" de personas que te ayuden
- Si un plan falla, reemplázalo inmediatamente con uno nuevo
- Los planes deben ser flexibles y adaptables

**7. Decisión**
- Las personas exitosas toman decisiones rápidamente y las cambian lentamente
- La indecisión es una causa principal del fracaso
- Analiza los hechos disponibles y decide
- No busques la opinión de demasiadas personas

**8. Persistencia**
- La persistencia es un factor esencial para transformar el deseo en su equivalente monetario
- La mayoría de las personas se rinden ante el primer signo de derrota
- La persistencia es un estado mental que puede cultivarse
- Desarrolla hábitos de persistencia a través de la práctica diaria

**9. El Poder del Grupo Maestro**
- Rodéate de personas que compartan tu visión y objetivos
- Dos o más mentes trabajando en armonía crean una tercera mente invisible
- Elige miembros que puedan contribuir con conocimientos, experiencia o influencia
- Mantén reuniones regulares y armonía en el grupo

**10. El Misterio de la Transmutación Sexual**
- La energía sexual es la más poderosa de todas las emociones humanas
- Esta energía puede canalizarse hacia objetivos creativos y productivos
- Los grandes líderes poseen naturalezas altamente sexuales
- Aprende a controlar y dirigir esta energía hacia tus objetivos

**11. La Mente Subconsciente**
- El subconsciente trabaja día y noche
- Alimenta tu subconsciente con pensamientos positivos y constructivos
- El subconsciente actúa sobre los pensamientos dominantes
- Usa emociones positivas para influir en tu subconsciente

**12. El Cerebro**
- El cerebro humano es una estación de transmisión y recepción de pensamientos
- Los pensamientos mezclados con emoción constituyen una fuerza magnética
- Puedes "sintonizar" con los pensamientos de otros a través de tu cerebro
- La creatividad funciona mejor cuando la mente vibra a alta frecuencia

**13. El Sexto Sentido**
- Es la puerta de entrada al templo de la sabiduría
- Se desarrolla solo después de dominar los otros 12 principios
- Te permite recibir advertencias de peligros inminentes
- Te conecta con fuentes infinitas de conocimiento

**Aplicación Práctica:**

**Fórmula del Éxito:**
1. Fija tu objetivo específico
2. Determina exactamente qué darás a cambio
3. Establece una fecha límite
4. Crea un plan definido
5. Escribe una declaración clara
6. Lee tu declaración dos veces al día

**Los Seis Fantasmas del Miedo:**
1. Miedo a la pobreza
2. Miedo a la crítica
3. Miedo a la mala salud
4. Miedo a perder el amor
5. Miedo a la vejez
6. Miedo a la muerte

**Características de los Líderes:**
- Coraje inquebrantable
- Autocontrol
- Sentido agudo de la justicia
- Firmeza en las decisiones
- Definición de planes
- Hábito de hacer más de lo que se paga
- Personalidad agradable
- Simpatía y comprensión
- Dominio de los detalles
- Disposición a asumir responsabilidad
- Cooperación

Este libro no es solo sobre hacer dinero, sino sobre desarrollar una mentalidad de éxito que se aplica a todas las áreas de la vida. Los principios han sido probados por millones de personas durante décadas.'
WHERE title = 'Piense y Hágase Rico';

-- Expandir "El Arte de la Guerra" con aplicaciones modernas
UPDATE knowledge_base 
SET content = 'El Arte de la Guerra de Sun Tzu es un tratado militar chino escrito hace más de 2,500 años que se ha convertido en una guía estratégica para los negocios, la política y la vida personal.

**Los 13 Capítulos y Sus Aplicaciones Modernas:**

**1. Hacer Planes (Estrategia)**
- "Toda guerra se basa en el engaño"
- **En Negocios**: Conoce tu mercado, competencia y capacidades antes de lanzar productos
- **En Vida Personal**: Planifica tus objetivos con información completa y realista
- **Principio Clave**: La preparación y planificación son fundamentales para el éxito

**2. Hacer la Guerra (Recursos)**
- "La guerra prolongada nunca benefició a nadie"
- **En Negocios**: Las campañas de marketing costosas y prolongadas agotan recursos
- **En Vida Personal**: Los conflictos prolongados drenan energía emocional
- **Principio Clave**: Actúa con decisión y eficiencia para conservar recursos

**3. Atacar por Estratagema (Táctica)**
- "La suprema excelencia es someter al enemigo sin luchar"
- **En Negocios**: Gana mercado a través de innovación, no solo competencia directa
- **En Negociación**: Logra tus objetivos sin crear conflicto innecesario
- **Principio Clave**: La victoria inteligente es mejor que la victoria por fuerza

**4. Disposiciones Tácticas (Posicionamiento)**
- "Los guerreros victoriosos ganan primero y después van a la guerra"
- **En Negocios**: Asegura ventajas competitivas antes de entrar al mercado
- **En Carrera**: Desarrolla habilidades y redes antes de buscar oportunidades
- **Principio Clave**: Crea condiciones favorables antes de actuar

**5. Energía (Momentum)**
- "El que llega primero al campo de batalla y espera al enemigo está fresco"
- **En Negocios**: Ser el primero en el mercado da ventajas significativas
- **En Proyectos**: Tomar la iniciativa permite controlar el ritmo y dirección
- **Principio Clave**: La iniciativa y el timing son cruciales

**6. Puntos Débiles y Fuertes (Análisis)**
- "Ataca donde no esté preparado, aparece donde no te esperen"
- **En Negocios**: Identifica nichos desatendidos por la competencia
- **En Resolución de Problemas**: Aborda los aspectos más vulnerables primero
- **Principio Clave**: Enfócate en las debilidades del oponente y tus fortalezas

**7. Maniobra (Flexibilidad)**
- "La guerra es el camino del engaño"
- **En Negocios**: Mantén flexibilidad estratégica ante cambios del mercado
- **En Liderazgo**: Adapta tu estilo según la situación y las personas
- **Principio Clave**: La adaptabilidad es más valiosa que la rigidez

**8. Variación en las Tácticas (Adaptación)**
- "No hay reglas constantes en la guerra"
- **En Negocios**: Cambia estrategias según las circunstancias del mercado
- **En Vida Personal**: Ajusta tus métodos según los desafíos que enfrentes
- **Principio Clave**: La flexibilidad táctica dentro de la estrategia general

**9. Marcha del Ejército (Logística)**
- "Conoce a tu enemigo y conócete a ti mismo"
- **En Negocios**: Comprende profundamente tu industria y capacidades
- **En Desarrollo Personal**: Autoconocimiento y conocimiento del entorno
- **Principio Clave**: El conocimiento es la base de todas las decisiones

**10. Terreno (Contexto)**
- "Hay cinco tipos de terreno"
- **En Negocios**: Adapta estrategias según el contexto del mercado
- **En Liderazgo**: Ajusta tu enfoque según la cultura organizacional
- **Principio Clave**: El contexto determina la estrategia apropiada

**11. Las Nueve Situaciones (Escenarios)**
- "En terreno mortal, lucha"
- **En Crisis**: Cuando no hay alternativa, comprométete completamente
- **En Oportunidades**: Actúa decisivamente cuando las condiciones son favorables
- **Principio Clave**: Diferentes situaciones requieren diferentes niveles de compromiso

**12. Ataque por Fuego (Recursos Destructivos)**
- "Usa armas locales para atacar"
- **En Negocios**: Utiliza los recursos y fortalezas del mercado local
- **En Conflictos**: Usa las propias palabras o acciones del oponente
- **Principio Clave**: Maximiza el impacto usando recursos disponibles

**13. Uso de Espías (Información)**
- "El conocimiento previo no puede obtenerse de fantasmas ni espíritus"
- **En Negocios**: Invierte en investigación de mercado y inteligencia competitiva
- **En Toma de Decisiones**: Basa decisiones en información real, no suposiciones
- **Principio Clave**: La información precisa es invaluable

**Aplicaciones Modernas Específicas:**

**En el Liderazgo Empresarial:**
- Lidera con el ejemplo y la estrategia, no solo con autoridad
- Conoce las fortalezas y debilidades de tu equipo
- Adapta tu estilo de liderazgo según la situación
- Mantén la moral alta y la comunicación clara

**En Negociaciones:**
- Prepárate exhaustivamente antes de negociar
- Busca soluciones ganar-ganar cuando sea posible
- Mantén alternativas disponibles (BATNA)
- Usa el tiempo y la paciencia como herramientas

**En Gestión de Proyectos:**
- Planifica considerando múltiples escenarios
- Mantén flexibilidad en la ejecución
- Comunica claramente objetivos y expectativas
- Monitorea constantemente el progreso y ajusta según sea necesario

**En Desarrollo Personal:**
- Conoce tus fortalezas y debilidades
- Elige tus batallas sabiamente
- Desarrolla paciencia estratégica
- Mantén múltiples opciones abiertas

**Principios Fundamentales para la Vida Moderna:**
1. **Preparación**: El éxito viene de la preparación adecuada
2. **Flexibilidad**: Adapta tus métodos sin perder de vista tus objetivos
3. **Información**: Toma decisiones basadas en datos reales
4. **Timing**: El momento adecuado es tan importante como la acción correcta
5. **Eficiencia**: Logra más con menos esfuerzo a través de la estrategia inteligente

El Arte de la Guerra no se trata de conflicto, sino de lograr objetivos de la manera más inteligente y eficiente posible.'
WHERE title = 'El Arte de la Guerra';

-- Expandir "Mindset" con contenido detallado
UPDATE knowledge_base 
SET content = 'Mindset: La Nueva Psicología del Éxito revela cómo nuestras creencias sobre nuestras habilidades afectan profundamente nuestro éxito en todas las áreas de la vida.

**Los Dos Tipos de Mentalidad:**

**Mentalidad Fija (Fixed Mindset)**
- Cree que las habilidades, inteligencia y talentos son rasgos fijos
- Evita desafíos por miedo al fracaso
- Se rinde fácilmente ante obstáculos
- Ve el esfuerzo como signo de falta de habilidad
- Ignora críticas útiles
- Se siente amenazado por el éxito de otros

**Características de la Mentalidad Fija:**
- "Soy inteligente" vs "No soy bueno en matemáticas"
- Busca validación constante de su inteligencia o habilidad
- Prefiere tareas fáciles donde puede lucir bien
- Interpreta los errores como fracasos personales
- Se enfoca en parecer inteligente en lugar de aprender

**Mentalidad de Crecimiento (Growth Mindset)**
- Cree que las habilidades pueden desarrollarse a través del esfuerzo
- Abraza desafíos como oportunidades de crecimiento
- Persiste ante obstáculos
- Ve el esfuerzo como el camino hacia la maestría
- Aprende de las críticas
- Se inspira en el éxito de otros

**Características de la Mentalidad de Crecimiento:**
- "Puedo aprender esto" vs "Aún no sé cómo hacer esto"
- Busca oportunidades para aprender y mejorar
- Ve los errores como parte natural del proceso de aprendizaje
- Se enfoca en el proceso más que en el resultado
- Celebra el progreso, no solo los logros finales

**Aplicaciones en Diferentes Áreas:**

**En la Educación:**
- **Mentalidad Fija**: "No soy bueno en matemáticas"
- **Mentalidad de Crecimiento**: "Aún no domino las matemáticas"
- Los estudiantes con mentalidad de crecimiento:
  - Buscan desafíos académicos
  - Ven los errores como oportunidades de aprendizaje
  - Desarrollan mayor resistencia ante dificultades
  - Logran mejores resultados a largo plazo

**En los Negocios:**
- **Líderes con Mentalidad Fija**:
  - Se rodean de personas que confirmen su superioridad
  - Culpan a otros por los fracasos
  - Evitan riesgos que puedan exponer debilidades
  - Crean culturas de miedo y competencia interna

- **Líderes con Mentalidad de Crecimiento**:
  - Se rodean de personas más capaces
  - Asumen responsabilidad por fracasos y aprenden de ellos
  - Toman riesgos calculados para innovar
  - Crean culturas de aprendizaje y colaboración

**En las Relaciones:**
- **Mentalidad Fija en Relaciones**:
  - "Si me amas, no deberías necesitar cambiar nada de mí"
  - Ve los conflictos como amenazas a la relación
  - Espera compatibilidad perfecta sin esfuerzo
  - Se rinde ante las primeras dificultades

- **Mentalidad de Crecimiento en Relaciones**:
  - "Podemos trabajar juntos para mejorar nuestra relación"
  - Ve los conflictos como oportunidades de crecimiento
  - Entiende que las relaciones requieren esfuerzo continuo
  - Persiste y busca soluciones ante dificultades

**En el Deporte:**
- **Atletas con Mentalidad Fija**:
  - Se enfocan en demostrar su talento natural
  - Evitan competencias donde podrían perder
  - Se desmoralizan ante derrotas
  - Culpan a factores externos por el mal rendimiento

- **Atletas con Mentalidad de Crecimiento**:
  - Se enfocan en mejorar constantemente
  - Buscan competencia fuerte para crecer
  - Aprenden de las derrotas
  - Toman responsabilidad por su rendimiento

**En la Crianza:**
- **Elogios que Fomentan Mentalidad Fija**:
  - "Eres muy inteligente"
  - "Eres un artista natural"
  - "Tienes talento para esto"

- **Elogios que Fomentan Mentalidad de Crecimiento**:
  - "Me gusta cómo trabajaste duro en este problema"
  - "Tu estrategia realmente funcionó"
  - "Puedo ver tu progreso"

**Cómo Desarrollar una Mentalidad de Crecimiento:**

**1. Reconoce tu Mentalidad Actual**
- Identifica situaciones donde muestras mentalidad fija
- Observa tus reacciones ante desafíos y fracasos
- Nota tu diálogo interno en momentos difíciles

**2. Cambia tu Diálogo Interno**
- En lugar de "No puedo hacer esto" → "Aún no puedo hacer esto"
- En lugar de "Soy un fracaso" → "Cometí un error y puedo aprender de él"
- En lugar de "Esto es muy difícil" → "Esto me ayudará a crecer"

**3. Abraza los Desafíos**
- Busca activamente situaciones que te saquen de tu zona de confort
- Ve los desafíos como oportunidades, no amenazas
- Celebra el coraje de intentar cosas nuevas

**4. Aprende del Fracaso**
- Analiza qué salió mal sin juzgarte duramente
- Identifica lecciones específicas que puedes aplicar
- Ve el fracaso como información valiosa, no como veredicto final

**5. Valora el Proceso**
- Enfócate en el esfuerzo y la estrategia, no solo en los resultados
- Celebra el progreso incremental
- Disfruta el proceso de aprendizaje

**6. Busca Retroalimentación**
- Pide feedback específico y constructivo
- Ve las críticas como regalos para tu crecimiento
- Actúa sobre la retroalimentación recibida

**Impacto en el Rendimiento:**
- Las personas con mentalidad de crecimiento superan consistentemente a aquellas con mentalidad fija
- Desarrollan mayor resistencia ante adversidades
- Mantienen motivación a largo plazo
- Logran niveles más altos de satisfacción personal y profesional

**El Poder de "Aún No":**
Una simple palabra puede transformar completamente la experiencia de aprendizaje. En lugar de decir "No puedo hacer esto", agregar "aún" abre posibilidades infinitas de crecimiento y desarrollo.

La mentalidad de crecimiento no es solo una técnica de autoayuda, es una forma fundamentalmente diferente de ver el potencial humano y el proceso de desarrollo personal.'
WHERE title = 'Mindset';

-- Verificar los cambios realizados
SELECT 
    title,
    author,
    LENGTH(content) as new_content_length,
    CASE 
        WHEN LENGTH(content) < 500 THEN 'Muy corto'
        WHEN LENGTH(content) < 1500 THEN 'Corto'
        WHEN LENGTH(content) < 3000 THEN 'Medio'
        ELSE 'Completo'
    END as new_content_status
FROM knowledge_base 
WHERE title IN ('Piense y Hágase Rico', 'El Arte de la Guerra', 'Mindset')
ORDER BY LENGTH(content) DESC;

-- Mostrar resumen de todos los libros después de las actualizaciones
SELECT 
    COUNT(*) as total_libros,
    AVG(LENGTH(content)) as promedio_caracteres,
    MIN(LENGTH(content)) as minimo_caracteres,
    MAX(LENGTH(content)) as maximo_caracteres,
    COUNT(CASE WHEN LENGTH(content) >= 3000 THEN 1 END) as libros_completos,
    COUNT(CASE WHEN LENGTH(content) < 1500 THEN 1 END) as libros_cortos
FROM knowledge_base;
