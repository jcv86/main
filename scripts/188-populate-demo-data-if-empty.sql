-- Poblar con datos de demostración si las tablas están vacías
-- Populate with demo data if tables are empty

-- 1. Verificar si knowledge_base tiene datos
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM knowledge_base) = 0 THEN
        -- Insertar libros de demostración
        INSERT INTO knowledge_base (title, category, content, author, tags, slug) VALUES
        (
            'El Arte del Liderazgo Efectivo',
            'Liderazgo',
            'El liderazgo efectivo no se trata de tener autoridad, sino de inspirar a otros a alcanzar su máximo potencial. Un líder verdadero entiende que su papel principal es servir a su equipo, proporcionando la visión, los recursos y el apoyo necesarios para que cada miembro pueda contribuir de manera significativa.

Los pilares fundamentales del liderazgo efectivo incluyen:

1. **Comunicación Clara y Transparente**: Un líder debe ser capaz de articular la visión de manera que todos la entiendan y se sientan motivados a trabajar hacia ella. Esto implica no solo hablar, sino también escuchar activamente las preocupaciones y sugerencias del equipo.

2. **Inteligencia Emocional**: La capacidad de reconocer y gestionar las propias emociones, así como entender y responder apropiadamente a las emociones de otros, es crucial para mantener un ambiente de trabajo positivo y productivo.

3. **Toma de Decisiones Basada en Datos**: Los líderes efectivos recopilan información relevante, analizan las opciones disponibles y toman decisiones informadas, siempre considerando el impacto en todas las partes interesadas.

4. **Desarrollo del Talento**: Un buen líder invierte tiempo y recursos en el crecimiento profesional de su equipo, proporcionando oportunidades de aprendizaje, mentoría y retroalimentación constructiva.

5. **Adaptabilidad y Resiliencia**: En un mundo empresarial en constante cambio, los líderes deben ser flexibles y capaces de adaptarse rápidamente a nuevas circunstancias, manteniendo al mismo tiempo la moral y la productividad del equipo.

El liderazgo transformacional se enfoca en inspirar y motivar a los seguidores a superar sus propios intereses personales por el bien del grupo u organización. Este estilo de liderazgo se caracteriza por cuatro componentes principales: influencia idealizada, motivación inspiracional, estimulación intelectual y consideración individualizada.

La práctica del liderazgo ético es fundamental en el mundo empresarial actual. Los líderes deben actuar con integridad, ser transparentes en sus decisiones y asumir la responsabilidad de sus acciones y las de su equipo.',
            'Dr. María González',
            ARRAY['liderazgo', 'management', 'desarrollo profesional', 'comunicación'],
            'arte-liderazgo-efectivo'
        ),
        (
            'Inteligencia Emocional en el Trabajo',
            'Desarrollo Personal',
            'La inteligencia emocional (IE) se ha convertido en una de las competencias más valoradas en el entorno laboral moderno. Definida como la capacidad de reconocer, entender y gestionar nuestras propias emociones, así como las de otros, la IE es fundamental para el éxito profesional y personal.

Los componentes clave de la inteligencia emocional incluyen:

**1. Autoconciencia Emocional**
La autoconciencia es la base de la inteligencia emocional. Implica la capacidad de reconocer y entender nuestras propias emociones en el momento en que las experimentamos. Las personas con alta autoconciencia emocional pueden identificar qué sienten, por qué lo sienten y cómo estas emociones afectan su comportamiento y decisiones.

Para desarrollar la autoconciencia emocional, es útil:
- Practicar la atención plena (mindfulness)
- Llevar un diario emocional
- Solicitar retroalimentación honesta de colegas y supervisores
- Reflexionar regularmente sobre las reacciones emocionales

**2. Autorregulación Emocional**
Una vez que somos conscientes de nuestras emociones, el siguiente paso es aprender a gestionarlas de manera efectiva. La autorregulación no significa suprimir las emociones, sino canalizarlas de manera constructiva.

Estrategias para mejorar la autorregulación:
- Técnicas de respiración profunda
- Pausa antes de reaccionar en situaciones tensas
- Reencuadre cognitivo (cambiar la perspectiva sobre una situación)
- Establecimiento de límites saludables

**3. Motivación Intrínseca**
Las personas emocionalmente inteligentes están motivadas por factores internos más que por recompensas externas. Buscan el crecimiento personal, el logro de objetivos significativos y la satisfacción de contribuir positivamente.

**4. Empatía**
La empatía es la capacidad de entender y compartir los sentimientos de otros. En el contexto laboral, la empatía permite construir relaciones más fuertes, resolver conflictos de manera más efectiva y crear un ambiente de trabajo más colaborativo.

**5. Habilidades Sociales**
Las habilidades sociales incluyen la comunicación efectiva, la resolución de conflictos, el trabajo en equipo y la capacidad de influir positivamente en otros.

La aplicación práctica de la inteligencia emocional en el trabajo se manifiesta en situaciones como la gestión de equipos diversos, la navegación de cambios organizacionales, la resolución de conflictos interpersonales y la construcción de relaciones sólidas con clientes y colegas.',
            'Dr. Carlos Ruiz',
            ARRAY['inteligencia emocional', 'desarrollo personal', 'habilidades blandas', 'comunicación'],
            'inteligencia-emocional-trabajo'
        ),
        (
            'Estrategias de Comunicación Efectiva',
            'Comunicación',
            'La comunicación efectiva es la piedra angular del éxito en cualquier ámbito profesional. No se trata solo de transmitir información, sino de asegurar que el mensaje sea recibido, entendido y que genere la respuesta deseada. En el mundo empresarial actual, donde los equipos son cada vez más diversos y distribuidos, las habilidades de comunicación se vuelven aún más críticas.

**Principios Fundamentales de la Comunicación Efectiva**

1. **Claridad y Concisión**
El mensaje debe ser claro, directo y libre de ambigüedades. Esto implica:
- Usar un lenguaje simple y apropiado para la audiencia
- Estructurar la información de manera lógica
- Evitar jerga innecesaria o tecnicismos cuando no son apropiados
- Ser específico en lugar de vago

2. **Escucha Activa**
La comunicación es un proceso bidireccional. La escucha activa implica:
- Prestar atención completa al hablante
- Hacer preguntas clarificadoras
- Parafrasear para confirmar la comprensión
- Mostrar interés genuino en lo que se está comunicando

3. **Comunicación No Verbal**
Más del 55% de la comunicación es no verbal. Esto incluye:
- Lenguaje corporal
- Expresiones faciales
- Tono de voz
- Postura y gestos

**Estrategias para Diferentes Contextos**

**Comunicación en Reuniones**
- Preparar una agenda clara
- Establecer objetivos específicos
- Facilitar la participación de todos los miembros
- Resumir los puntos clave y las acciones a seguir

**Comunicación Escrita**
- Usar líneas de asunto descriptivas en emails
- Estructurar el contenido con encabezados y viñetas
- Revisar y editar antes de enviar
- Adaptar el tono al contexto y la audiencia

**Comunicación Intercultural**
En equipos diversos, es importante:
- Ser consciente de las diferencias culturales en la comunicación
- Adaptar el estilo de comunicación según sea necesario
- Ser paciente y comprensivo con las barreras del idioma
- Buscar puntos en común y construir sobre ellos

**Gestión de Conflictos a través de la Comunicación**
- Abordar los problemas de manera directa pero respetuosa
- Enfocarse en los comportamientos, no en las personalidades
- Buscar soluciones mutuamente beneficiosas
- Mantener la calma y la profesionalidad

**Comunicación Digital**
Con el auge del trabajo remoto, la comunicación digital se ha vuelto esencial:
- Elegir el canal apropiado (email, chat, videollamada)
- Ser más explícito en la comunicación escrita
- Usar herramientas colaborativas efectivamente
- Mantener la conexión humana a pesar de la distancia

La comunicación efectiva requiere práctica constante y adaptación continua. Es una habilidad que se puede desarrollar y mejorar a lo largo del tiempo con dedicación y retroalimentación constructiva.',
            'Lic. Ana Martínez',
            ARRAY['comunicación', 'habilidades blandas', 'liderazgo', 'trabajo en equipo'],
            'estrategias-comunicacion-efectiva'
        );

        RAISE NOTICE 'Se insertaron 3 libros en knowledge_base';
    ELSE
        RAISE NOTICE 'knowledge_base ya contiene datos (% registros)', (SELECT COUNT(*) FROM knowledge_base);
    END IF;
END $$;

-- 2. Insertar datos de progreso de lectura para usuario demo
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM user_reading_progress WHERE user_email = 'demo@example.com') = 0 THEN
        INSERT INTO user_reading_progress (user_email, book_id, reading_progress, target_percentage, status, reading_time_minutes, last_read_at)
        SELECT 
            'demo@example.com',
            kb.id,
            CASE 
                WHEN kb.id = (SELECT MIN(id) FROM knowledge_base) THEN 75
                WHEN kb.id = (SELECT MIN(id) + 1 FROM knowledge_base) THEN 30
                ELSE 0
            END,
            100,
            CASE 
                WHEN kb.id = (SELECT MIN(id) FROM knowledge_base) THEN 'reading'
                WHEN kb.id = (SELECT MIN(id) + 1 FROM knowledge_base) THEN 'reading'
                ELSE 'not_started'
            END,
            CASE 
                WHEN kb.id = (SELECT MIN(id) FROM knowledge_base) THEN 120
                WHEN kb.id = (SELECT MIN(id) + 1 FROM knowledge_base) THEN 45
                ELSE 0
            END,
            CASE 
                WHEN kb.id = (SELECT MIN(id) FROM knowledge_base) THEN NOW() - INTERVAL '2 days'
                WHEN kb.id = (SELECT MIN(id) + 1 FROM knowledge_base) THEN NOW() - INTERVAL '1 day'
                ELSE NULL
            END
        FROM knowledge_base kb;

        RAISE NOTICE 'Se insertó progreso de lectura para usuario demo';
    ELSE
        RAISE NOTICE 'Ya existe progreso de lectura para usuario demo';
    END IF;
END $$;

-- 3. Insertar algunos bookmarks para el usuario demo
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM user_bookmarks WHERE user_email = 'demo@example.com') = 0 THEN
        INSERT INTO user_bookmarks (user_email, book_id, bookmark_note)
        SELECT 
            'demo@example.com',
            kb.id,
            'Libro marcado como favorito para referencia futura'
        FROM knowledge_base kb
        WHERE kb.id = (SELECT MIN(id) FROM knowledge_base);

        RAISE NOTICE 'Se insertaron bookmarks para usuario demo';
    ELSE
        RAISE NOTICE 'Ya existen bookmarks para usuario demo';
    END IF;
END $$;

-- 4. Verificar los datos insertados
SELECT 'RESUMEN DE DATOS INSERTADOS' as status;

SELECT 
    'knowledge_base' as tabla,
    COUNT(*) as registros,
    string_agg(DISTINCT category, ', ') as categorias
FROM knowledge_base
UNION ALL
SELECT 
    'user_reading_progress' as tabla,
    COUNT(*) as registros,
    string_agg(DISTINCT status, ', ') as estados
FROM user_reading_progress
UNION ALL
SELECT 
    'user_bookmarks' as tabla,
    COUNT(*) as registros,
    COUNT(DISTINCT user_email)::TEXT || ' usuarios' as info
FROM user_bookmarks;

-- 5. Mostrar algunos datos de ejemplo
SELECT 'LIBROS DISPONIBLES' as info;
SELECT id, title, category, author, read_count FROM knowledge_base ORDER BY id;

SELECT 'PROGRESO USUARIO DEMO' as info;
SELECT 
    urp.book_id,
    kb.title,
    urp.reading_progress,
    urp.status,
    urp.reading_time_minutes
FROM user_reading_progress urp
JOIN knowledge_base kb ON urp.book_id = kb.id
WHERE urp.user_email = 'demo@example.com'
ORDER BY urp.book_id;
