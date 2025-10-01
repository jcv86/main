-- Agregar 3 libros chilenos más a knowledge_base

-- Libro 121: Innovación en Tiempos de Crisis
INSERT INTO knowledge_base (
  title,
  category,
  content,
  author,
  tags,
  read_count,
  created_at,
  updated_at
)
VALUES (
  'Innovación en Tiempos de Crisis: El Caso Chileno',
  'business',
  '# Innovación en Tiempos de Crisis: El Caso Chileno

## Por Cristián Rodríguez Chiffelle

### Introducción

Chile ha enfrentado múltiples crisis en las últimas décadas. Este libro analiza cómo las empresas chilenas han innovado durante tiempos difíciles.

## Capítulo 1: Crisis como Catalizador

Las crisis obligan a las organizaciones a repensar sus modelos de negocio. Casos estudiados:

- **NotCo**: Startup de alimentos plant-based que creció durante la pandemia
- **Cornershop**: Delivery que aprovechó cambios en comportamiento del consumidor  
- **Buk**: Software de RRHH que ayudó a empresas en transformación digital

### Framework CRISIS

**C**ambio de modelo
**R**esilencia operacional
**I**nnovación de producto
**S**ostenibilidad financiera
**I**mpacto social
**S**uperación de obstáculos

## Capítulo 2: Estrategias de Pivoteo

Cuando el mercado cambia, las empresas deben adaptarse rápidamente:

1. Identificar nuevas necesidades del mercado
2. Evaluar capacidades existentes
3. Diseñar solución mínima viable
4. Testear con clientes piloto
5. Escalar rápidamente

## Capítulo 3: Digitalización Acelerada

La pandemia forzó digitalización en 6 meses que hubiera tomado 5 años.

### Lecciones de empresas chilenas:
- Retail tradicional adoptó e-commerce
- Restaurantes pivotearon a delivery
- Servicios profesionales se volvieron remotos
- Educación migró a plataformas digitales

## Conclusión

La innovación en crisis requiere agilidad, coraje y foco en el cliente.',
  'Cristián Rodríguez Chiffelle',
  ARRAY['innovación', 'crisis', 'chile', 'startups', 'transformación digital'],
  0,
  NOW(),
  NOW()
);

-- Libro 122: Liderazgo Consciente
INSERT INTO knowledge_base (
  title,
  category,
  content,
  author,
  tags,
  read_count,
  created_at,
  updated_at
)
VALUES (
  'Liderazgo Consciente: Transformando Empresas Chilenas',
  'leadership',
  '# Liderazgo Consciente: Transformando Empresas Chilenas

## Por Paula Covarrubias García

### Introducción al Liderazgo Consciente

El liderazgo tradicional basado en autoridad y jerarquía ya no funciona en el mundo moderno. Este libro propone un nuevo paradigma.

## Capítulo 1: Fundamentos del Liderazgo Consciente

### Qué es Liderazgo Consciente

Liderazgo que integra:
- **Autoconocimiento**: Entender tus patrones, sesgos y triggers
- **Presencia**: Estar completamente presente en cada interacción
- **Propósito**: Conectar trabajo con significado más profundo
- **Compasión**: Liderar con empatía genuina

### Por qué Importa en Chile

La cultura laboral chilena está cambiando:
- Millennials y Gen Z buscan propósito
- Burnout es epidemia silenciosa
- Rotación aumenta costos
- Innovación requiere ambientes psicológicamente seguros

## Capítulo 2: Prácticas de Autoconocimiento

### Práctica 1: Mindfulness Diario

Comienza cada día con 10 minutos de meditación:
1. Siéntate en posición cómoda
2. Enfoca atención en respiración
3. Cuando mente divague, vuelve a respiración
4. Sin juzgar pensamientos

### Práctica 2: Journal de Reflexión

Escribe diariamente:
- ¿Qué situaciones me activaron emocionalmente hoy?
- ¿Cómo respondí vs cómo hubiera querido responder?
- ¿Qué patrones noto en mi comportamiento?

## Capítulo 3: Presencia Relacional

Los mejores líderes están completamente presentes:
- Apagan celular en reuniones importantes
- Hacen contacto visual genuino
- Escuchan sin preparar respuesta
- Preguntan con curiosidad real

## Capítulo 4: Diseñando Cultura Consciente

Crear cultura organizacional consciente requiere:

### Espacios de Reflexión
- Check-ins emocionales en reuniones
- Retiros de equipo enfocados en conexión
- Tiempo protegido para pensamiento profundo

### Políticas que Apoyan Bienestar
- Flexibilidad horaria real
- Vacaciones respetadas
- Permiso para desconectar
- Recursos de salud mental

## Conclusión

El liderazgo consciente no es lujo, es necesidad en mundo complejo y cambiante.',
  'Paula Covarrubias García',
  ARRAY['liderazgo', 'mindfulness', 'cultura organizacional', 'bienestar', 'chile'],
  0,
  NOW(),
  NOW()
);

-- Libro 123: Negociación Efectiva
INSERT INTO knowledge_base (
  title,
  category,
  content,
  author,
  tags,
  read_count,
  created_at,
  updated_at
)
VALUES (
  'Negociación Efectiva en el Mercado Chileno',
  'business',
  '# Negociación Efectiva en el Mercado Chileno

## Por Rodrigo Soto Bravo

### Introducción

Negociar bien es habilidad crítica pero poco enseñada. Este libro te enseña técnicas probadas en el mercado chileno.

## Parte I: Fundamentos

### Capítulo 1: Preparación

La preparación representa el 80% del éxito en negociación.

#### Paso 1: Conoce tu BATNA
**BATNA** = Best Alternative To Negotiated Agreement

Tu BATNA es tu poder real en negociación. Siempre pregúntate:
- ¿Qué pasa si esta negociación no resulta?
- ¿Tengo otras opciones?
- ¿Qué tan buenas son esas opciones?

#### Paso 2: Investiga a tu Contraparte
- ¿Cuáles son sus intereses reales?
- ¿Qué restricciones enfrentan?
- ¿Quién más influye en su decisión?
- ¿Cuál es su BATNA?

#### Paso 3: Define ZOPA
**ZOPA** = Zone Of Possible Agreement

Es el rango donde ambas partes pueden llegar a acuerdo.

**Ejemplo**: Venta de software
- Tu precio mínimo: $10M CLP
- Su presupuesto máximo: $15M CLP
- ZOPA: $10M - $15M

Si no hay ZOPA, negociación no cerrará a menos que expandas variables.

#### Paso 4: Identifica Intereses vs Posiciones

**Posición**: Necesito descuento de 30%
**Interés subyacente**: Necesito que proyecto esté dentro de presupuesto

Negociar intereses abre creatividad:
- Pago diferido al próximo año
- Modelo de pago por uso
- Servicios adicionales incluidos

## Capítulo 2: Tácticas de Anclaje

El primer número puesto sobre la mesa ancla la negociación.

### Cuándo Anclar Primero
Ventajoso si:
- Tienes información superior sobre mercado
- Tu producto es único
- Quieres establecer expectativas altas

### Técnicas de Anclaje

**1. Anclaje Aspiracional**
- No tan alto que parezcas desconectado
- Sustentado con data
- Abierto a conversación

**2. Anclaje Múltiple (Rango)**
- Usa rango en lugar de número único
- El punto medio se vuelve ancla psicológica
- Demuestra flexibilidad

## Capítulo 3: Manejo de Objeciones

### Las 5 Objeciones Más Comunes

**1. Es muy caro**

Respuestas efectivas:
- Reframe valor: ¿Cuánto les cuesta NO resolver esto?
- Opciones de pricing: Modelos base, estándar, premium
- Términos favorables: Pagos diferidos, modelo de éxito compartido

**2. Necesito consultar**

Respuesta:
- ¿Qué preguntas surgirán?
- ¿Qué información adicional ayudaría?
- ¿Puedo estar en esa conversación?

**3. Estamos evaluando otras opciones**

Respuesta:
- ¿Qué criterios son más importantes?
- ¿Hay gaps en nuestra propuesta?
- Matriz comparativa que favorece tus fortalezas

## Capítulo 4: Tácticas de Cierre

### Señales de que Están Listos
- Preguntan por detalles de implementación
- Mencionan timelines específicos
- Lenguaje cambia de SI a CUANDO

### Técnicas de Cierre

**1. Cierre Asumido**
El siguiente paso sería enviar contrato. ¿Les funciona mañana?

**2. Cierre de Alternativa**
¿Preferirían Opción A o tiene más sentido Opción B?

**3. Cierre Consultivo (más efectivo en Chile)**
Mi recomendación honesta es esta opción. ¿Cómo lo ves?

## Conclusión

Negociar bien es habilidad que se desarrolla con práctica. Cada negociación es oportunidad de aprender.

### Hábitos de Negociadores Excelentes
1. Preparación obsesiva
2. Curiosidad genuina
3. Flexibilidad en tácticas
4. Firmeza en intereses core
5. Reflexión post-negociación',
  'Rodrigo Soto Bravo',
  ARRAY['negociación', 'ventas', 'negocios', 'habilidades blandas', 'chile'],
  0,
  NOW(),
  NOW()
);

-- Verificar inserción
SELECT 
  COUNT(*) as total_libros,
  COUNT(CASE WHEN category = 'business' THEN 1 END) as libros_business,
  COUNT(CASE WHEN category = 'leadership' THEN 1 END) as libros_leadership
FROM knowledge_base;

-- Mostrar los últimos 3 libros agregados
SELECT 
  id,
  title,
  author,
  category,
  LENGTH(content) as content_length,
  array_length(tags, 1) as num_tags
FROM knowledge_base
ORDER BY id DESC
LIMIT 3;
