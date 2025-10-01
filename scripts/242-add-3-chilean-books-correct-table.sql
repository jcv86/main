-- Agregar 3 libros más de referentes chilenos a knowledge_base
-- Usando la estructura correcta de la tabla

INSERT INTO knowledge_base (
  title,
  category,
  content,
  author,
  tags,
  read_count,
  created_at,
  updated_at
) VALUES

-- Libro 121: Innovación en Tiempos de Crisis
(
  'Innovación en Tiempos de Crisis: El Caso Chileno',
  'Emprendimiento',
  '# Innovación en Tiempos de Crisis: El Caso Chileno

## Introducción: La Crisis como Oportunidad

Chile ha enfrentado múltiples crisis a lo largo de su historia reciente: el estallido social de 2019, la pandemia de COVID-19, y diversas crisis económicas. Sin embargo, estas adversidades han demostrado ser catalizadores de innovación.

**Autor**: Cristián Rodríguez Chiffelle
**Páginas**: 340 | **Tiempo de lectura**: 425 minutos

## Parte I: El Contexto Chileno

### Capítulo 1: Historia de Crisis e Innovación

Chile ha experimentado transformaciones profundas en las últimas décadas. Cada crisis ha dejado lecciones valiosas sobre adaptación y resiliencia.

**Características del ecosistema innovador chileno:**
- Pragmatismo empresarial
- Capacidad de pivoteo rápido
- Redes de apoyo sólidas con Corfo y Start-Up Chile
- Talento técnico de calidad
- Acceso a mercados regionales

### Capítulo 2: Anatomía de una Crisis

**Etapa 1: Shock Inicial (0-3 meses)**
Confusión y parálisis, caída de ingresos, incertidumbre, decisiones reactivas

**Etapa 2: Adaptación Forzada (3-6 meses)**
Búsqueda urgente de soluciones, prueba y error, reducción de costos

**Etapa 3: Innovación Estratégica (6-12 meses)**
Nuevos modelos de negocio, digitalización acelerada, colaboraciones inesperadas

**Etapa 4: Nueva Normalidad (12+ meses)**
Consolidación de cambios, ventajas competitivas establecidas

## Parte II: Casos de Éxito

### Capítulo 3: NotCo - Disrumpiendo la Industria Alimentaria

NotCo desarrolló Giuseppe, una IA que analiza estructuras moleculares de alimentos y encuentra combinaciones vegetales que replican sabor y textura.

**Durante la crisis de 2020:**
- Expandieron a supermercados cuando restaurantes cerraron
- Lanzaron productos de larga duración
- Aceleraron e-commerce y delivery directo
- Levantaron 85M USD en serie C durante la pandemia
- Expandieron a USA y Brasil

**Lecciones**: Tecnología como diferenciador, múltiples canales, producto con propósito, timing de fundraising, expansión contra-cíclica

### Capítulo 4: Cornershop - De Grocery a Ecosistema

Cuando la pandemia llegó en marzo 2020:
- Demanda creció 300% en dos semanas
- Contrataron 1000+ shoppers en un mes
- Rediseñaron procesos para seguridad
- Desarrollaron priorización para vulnerables

**Resultado**: Uber adquirió Cornershop por 1.4B USD en 2020, crearon 10,000+ empleos

**Factores de éxito**: Infraestructura escalable, relaciones previas con retailers, cultura de ejecución rápida, timing perfecto

### Capítulo 5: Buk - Digitalizando RRHH

Buk identificó que trabajo remoto exigía nuevas herramientas de gestión de personas.

**Estrategia**: Modelo freemium agresivo, onboarding en 24 horas, módulos de crisis, pricing flexible

**Resultados**: De 500 a 2500+ clientes en 18 meses, levantaron 50M USD serie B, expandieron a LATAM

## Parte III: Framework CRISIS

### Capítulo 6: Metodología de Innovación Resiliente

**C - Conocimiento del contexto**
Monitoreo continuo, escenarios múltiples, indicadores adelantados

**R - Rapidez en decisiones**
Ciclos semanales, equipos autónomos, experimentación > análisis

**I - Innovación en modelo de negocio**
Diversificación de ingresos, nuevos segmentos, canales alternativos

**S - Solidez financiera**
Runway 12+ meses, líneas de crédito pre-aprobadas, control de caja

**I - Integración con ecosistema**
Alianzas estratégicas, co-innovación, participación en redes

**S - Sostenibilidad en personas**
Comunicación transparente, salud mental, flexibilidad laboral

### Capítulo 7: Digitalización Acelerada

**Caso Banco de Chile**: De 40% presencial a 85% digital en 12 meses

Lanzaron 15 servicios nuevos en 60 días, implementaron videollamadas para cuentas, digitalizaron 100% de procesos críticos

**Lecciones**: Empezar por procesos críticos, UX obsesiva, capacitación intensiva, infraestructura flexible

### Capítulo 8: El Arte del Pivot

**Tipos de Pivots Exitosos:**
- Pivot de Segmento (40% éxito, 4-6 meses)
- Pivot de Canal (60% éxito, 3-4 meses)
- Pivot de Modelo de Ingresos (35% éxito, 6-9 meses)
- Pivot de Propuesta de Valor (45% éxito, 5-7 meses)

**Marco de Ejecución:**
Fase 1: Detección (Semana 1-2)
Fase 2: Exploración (Semana 3-6)
Fase 3: Decisión (Semana 7-8)
Fase 4: Ejecución (Semana 9-20)

## Conclusión

Las empresas chilenas exitosas comparten: cultura de adaptabilidad, foco en cliente, velocidad de ejecución, solidez financiera, talento comprometido.

**Key Takeaways:**
- La crisis acelera innovación con preparación previa
- Resiliencia financiera permite experimentación
- Pivots rápidos requieren infraestructura flexible
- Comunicación transparente genera confianza
- Ecosistema colaborativo amplifica adaptación
- Digitalización es supervivencia, no opción
- Empatía con cliente revela oportunidades
- Velocidad supera perfección de análisis',
  'Cristián Rodríguez Chiffelle',
  ARRAY['innovación', 'crisis', 'resiliencia', 'emprendimiento chileno', 'casos de éxito', 'NotCo', 'Cornershop', 'Buk'],
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- Libro 122: Liderazgo Consciente
(
  'Liderazgo Consciente: Transformando Empresas Chilenas',
  'Liderazgo',
  '# Liderazgo Consciente: Transformando Empresas Chilenas

## Introducción: El Despertar del Liderazgo

El estallido social de 2019 y la pandemia revelaron las grietas del modelo autoritario tradicional chileno. Este libro propone el liderazgo consciente: liderar con presencia, intención y compasión.

**Autora**: Paula Covarrubias García
**Páginas**: 310 | **Tiempo de lectura**: 390 minutos

## Parte I: Fundamentos

### Capítulo 1: Qué es Liderazgo Consciente

**Los Tres Pilares:**

1. **Autoconocimiento Profundo**
   - Entender valores y motivaciones
   - Reconocer patrones automáticos
   - Aceptar vulnerabilidades sin juicio
   - Claridad sobre propósito

2. **Presencia Relacional**
   - Escucha activa sin agenda
   - Empatía genuina
   - Comunicación auténtica
   - Construcción de confianza

3. **Impacto Sistémico**
   - Cada acción tiene ondas expansivas
   - Diseñar sistemas que amplifiquen lo mejor
   - Medir más allá de lo financiero
   - Responsabilidad con stakeholders múltiples

### Capítulo 2: La Crisis en Chile

**Síntomas de Liderazgo Inconsciente:**
- Burnout epidémico (62% de profesionales)
- Desconexión generacional
- Falta de innovación
- Crisis de confianza

**Costos Medibles:**
- Pérdida productividad: 15-30M CLP anuales
- Rotación: 6-9 meses de salario por posición
- Innovación: 40-60% menos experimentos
- NPS: Caída de 20-40 puntos

### Capítulo 3: Mindfulness para Líderes

**Práctica Core: 10 Minutos Diarios**

Minutos 1-2: Asentar (postura, intención)
Minutos 3-7: Atención a respiración
Minutos 8-9: Expansión a sensaciones
Minuto 10: Integración y cierre

**Resultados documentados** (45 ejecutivos, 12 semanas):
- Reducción 35% en cortisol
- Mejora 28% en función ejecutiva
- Aumento 42% en satisfacción laboral
- Mejora 31% en evaluación 360°

**Práctica STOP en Crisis:**
- Stop: Para todo
- Take a breath: Respira 3 veces
- Observe: Qué siento en el cuerpo
- Proceed: Actúa con intención

## Parte II: Autoconocimiento

### Capítulo 4: Valores en Acción

**Ejercicio de Identificación:**
1. Lista 20 valores que resuenan
2. Reduce a 10
3. Reduce a 5
4. Define qué significa cada uno
5. Comparte con tu equipo

### Capítulo 5: Sombras de Liderazgo

**Sombras Comunes en Líderes Chilenos:**
- Necesidad de control
- Miedo a vulnerabilidad
- Perfeccionismo paralizante
- Agresividad pasiva

**Ejercicio de Integración:**
Qué te molesta en otros, cuándo tú lo manifiestas, cómo satisfacer esa necesidad sanamente

## Parte III: Liderazgo Relacional

### Capítulo 6: La Escucha Como Superpoder

**Niveles de Escucha:**
- Nivel 1: Transaccional (oír palabras)
- Nivel 2: Empática (sentir emociones)
- Nivel 3: Generativa (percibir posibilidades)

**Práctica**: 10 minutos de escucha profunda semanal con cada reporte

**Impacto medido** (20 líderes, 8 semanas):
- Problemas detectados 3x más temprano
- Retención mejoró 25%
- Ideas innovadoras +40%
- Confianza +35 puntos NPS

### Capítulo 7: Feedback Consciente

**Principios:**
1. Momento adecuado
2. Observación vs Juicio
3. Impacto específico
4. Curiosidad vs Certeza
5. Co-creación de soluciones

**Protocolo Feedback Difícil:**
- Antes: Claridad de intención, verificar hechos
- Durante: Compartir observación, preguntar, escuchar
- Después: Follow-up, reconocer mejoras

## Parte IV: Transformando Sistemas

### Capítulo 8: Diseñando Cultura

**5 Elementos de Cultura Consciente:**
1. Seguridad Psicológica
2. Propósito Compartido
3. Transparencia Radical
4. Experimentación Continua
5. Bienestar Integral

### Capítulo 9: Reuniones que Nutren

**Estructura de Reunión Consciente:**
- Check-in personal (5 min)
- Recordatorio de propósito (2 min)
- Trabajo colaborativo (60-80%)
- Decisiones claras (5-10 min)
- Check-out y compromisos (3 min)

## Parte V: Contexto Chileno

### Capítulo 10: Patrones Culturales

**Patrones limitantes:**
- Cultura del sí complaciente
- Machismo sutil
- Formalismo que inhibe innovación
- Individualismo disfrazado

**Cómo superarlos:** Nombrarlos, crear seguridad, modelar alternativas

### Capítulo 11: Liderazgo Femenino

**Fortalezas**: Inteligencia emocional, pensamiento holístico, colaboración natural

**Desafíos**: Doble estándar, carga mental invisible, síndrome del impostor

**Estrategias**: Redes de apoyo, mentoras, visibilidad estratégica

### Capítulo 12: Midiendo Impacto

**Dashboard de Liderazgo Consciente:**
1. Engagement del Equipo (eNPS)
2. Seguridad Psicológica (encuesta)
3. Innovación Comportamental (experimentos/mes)
4. Desarrollo de Talento (promociones internas)
5. Bienestar del Equipo (burnout index)
6. Resultados de Negocio (KPIs core)

## Conclusión: El Viaje Continuo

Convertirse en líder consciente es práctica diaria, no destino. Chile está en momento crucial de transformación. Tu liderazgo consciente puede ayudar a sanar y evolucionar el país.

**Key Takeaways:**
- Liderazgo consciente integra resultados y bienestar
- Mindfulness mejora toma de decisiones 28%
- Escucha profunda es superpoder de líderes
- Cultura se diseña intencionalmente
- Vulnerabilidad genera confianza
- Feedback consciente transforma relaciones
- Métricas de bienestar = métricas financieras
- Liderazgo es práctica diaria, no estado final',
  'Paula Covarrubias García',
  ARRAY['liderazgo', 'mindfulness', 'transformación', 'consciencia', 'cultura organizacional', 'bienestar', 'Chile'],
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),

-- Libro 123: Negociación Efectiva
(
  'Negociación Efectiva en el Mercado Chileno',
  'Comunicación',
  '# Negociación Efectiva en el Mercado Chileno

## Introducción: Negociar en Chile

Después de 15 años negociando desde startups hasta corporaciones en Chile, este libro destila lecciones de 200+ negociaciones exitosas adaptadas al contexto cultural chileno.

**Autor**: Rodrigo Soto Bravo
**Páginas**: 285 | **Tiempo de lectura**: 355 minutos

## Parte I: Fundamentos Chilenos

### Capítulo 1: El Estilo Chileno

**Características Culturales Clave:**

1. **Indirectez y Contexto**
   - Rara vez dicen no directamente
   - Lo voy a pensar = probablemente no
   - Interesante propuesta = cortesía, no interés
   - El silencio comunica mucho

2. **Relaciones Antes que Transacciones**
   - Confianza personal primero
   - Primera reunión es para conocerse
   - Apuro genera desconfianza
   - Networking es inversión largo plazo

3. **Formalidad con Informalidad Selectiva**
   - Usted inicial, tú después con confianza
   - Títulos importan (ingeniero, doctor)
   - Vestimenta formal en primera reunión
   - Café después de reunión es clave

4. **Jerarquía Respetada**
   - Decisiones se toman arriba
   - Identificar decision-maker temprano
   - No saltar jerarquía sin permiso

5. **Adversidad al Riesgo**
   - Preferencia por lo conocido
   - Referencias locales son críticas
   - Garantías muy valoradas
   - Primera oferta conservadora

### Capítulo 2: Preparación - El 80% del Éxito

**Framework de Preparación en 7 Pasos:**

**Paso 1: Investigación (2-3 horas)**
- LinkedIn de stakeholders
- Noticias recientes de empresa
- Situación financiera
- Cultura organizacional

**Paso 2: Tu BATNA (Best Alternative)**
Tu poder real en negociación = calidad de tu BATNA

Si BATNA es débil: Mejórala antes de negociar o ajusta expectativas

**Paso 3: ZOPA (Zona de Posible Acuerdo)**
Tu reserva: Lo mínimo aceptable
Su reserva: Lo máximo que pagarían
ZOPA = Overlap entre reservas

**Paso 4: Intereses vs Posiciones**
Posición: Necesito descuento de 30%
Interés real: Proyecto debe estar en presupuesto este año

Negociar intereses abre creatividad: pago diferido, modelo uso, servicios incluidos

**Paso 5: Mapear Stakeholders**
CEO/CFO → Influencer Técnico + Financiero → Usuario Final + Procurement

Alinear cada uno con mensajes personalizados

**Paso 6: Anticipar Objeciones**
Lista 5-10 objeciones probables y prepara respuestas

**Paso 7: Ensayar**
Practicar en voz alta hace enorme diferencia

## Parte II: Estrategias Avanzadas

### Capítulo 3: El Arte del Anclaje

**Definición**: El primer número ancla la negociación

**Cuándo Anclar Primero:**
- Tienes información superior
- Producto único/difícil comparar
- Quieres establecer expectativas altas

**Técnicas en Chile:**

1. **Anclaje Aspiracional pero Justificable**
Sustentado con data: Casos similares valoran esto en...

Ejemplo: Consultoría tech
- Costo real: 15M CLP
- Anclaje: 25M CLP (rango 22-28M)
- Cierre: 20M CLP (33% sobre costo)

2. **Anclaje Múltiple (Rango)**
Para proyectos así vemos inversiones entre X - Y
El punto medio se vuelve ancla psicológica

3. **Re-Anclaje**
Si anclan bajo: reformular propuesta con alcance que justifica precio mayor

### Capítulo 4: Manejo de Objeciones

**Las 5 Objeciones Más Comunes:**

**1. Es Muy Caro**

Significado real: No veo valor / No tengo presupuesto / Táctica

Respuesta A - Reframe Valor:
Cuánto les cuesta actualmente el problema? Clientes calcularon $X en pérdidas. Nuestro costo $Y = ahorro Z% primer año

Respuesta B - Opciones de Pricing:
3 opciones: Base, Estándar, Premium con features diferenciados

Respuesta C - Términos Favorables:
Estructurar pagos en cuotas / diferido / modelo éxito compartido

**2. Necesito Consultar**

Significado: No soy decision-maker / Necesito validación / Táctica

Respuesta: Para facilitar esa conversación:
- Qué preguntas surgirán?
- Qué información adicional ayudaría?
- Tiene sentido que esté presente?

**3. Evaluando Otras Opciones**

Significado: Tengo leverage / Quiero mejor precio / Comparando

Respuesta: Razonable hacer due diligence:
- Qué criterios son más importantes?
- Hay gaps en nuestra propuesta?
- Cómo comparar manzanas con manzanas?

**4. No Tenemos Presupuesto Este Año**

Respuesta genuina:
- Piloto con presupuesto disponible?
- Estructurar para Q1 próximo año?
- Mantener conversación para top-of-mind?

Respuesta táctica:
Si encontramos forma sin impactar presupuesto este año, querrían avanzar?

**5. Necesito Referencias Locales**

Respuesta: 3 referencias de industria/tamaño similar disponibles para conversar + conexión con persona que respetan

### Capítulo 5: Tácticas de Cierre

**Señales de Listos para Cerrar:**
- Preguntan detalles implementación
- Mencionan timelines específicos
- Introducen más stakeholders
- Negocian términos menores
- Lenguaje cambia de si a cuando

**Técnicas de Cierre:**

1. **Cierre Asumido**
Entonces siguiente paso sería... Enviamos contrato mañana para revisión?

2. **Cierre de Alternativa**
Preferirían empezar con Opción A o tiene más sentido Opción B?

3. **Cierre de Concesión**
Si pudiera hacer concesión X, estarían listos para avanzar hoy?

4. **Cierre de Urgencia Genuina**
Para cumplir timeline, necesitamos empezar en fecha X

5. **Cierre Consultivo (más efectivo en Chile)**
Basado en todo conversado, mi recomendación honesta es... Cómo lo ves?

**Qué NO Hacer:**
- Presión agresiva (solo hoy hay descuento)
- Ultimátums artificiales
- Cerrar sin construir relación
- Ignorar señales de necesitar más tiempo

## Parte III: Negociaciones Complejas

### Capítulo 6: Negociaciones Multipartitas

Ejemplo: Startup busca financiamiento con Founders, VCs, Angels, Equipo, Board

**Estrategia:**
- Pre: Reuniones 1-1, identificar conflictos, construir coaliciones
- Durante: Facilitar, hacer visibles trade-offs, crear valor antes de dividir
- Post: Documentar todo, comunicar decisiones, gestionar implementación

### Capítulo 7: Negociando con Corporaciones

**Framework:**
Fase 1: Identificar campeón interno
Fase 2: Entender proceso de compra
Fase 3: Crear urgencia real
Fase 4: Negociar términos contractuales

**Táctica Redline Limitado:**
Contrato de 40 páginas:
- No 200 cambios (genera fricción)
- Identifica 5-7 términos críticos
- Acepta el resto
- Justifica cada cambio
- Ofrece lenguaje alternativo

### Capítulo 8: Negociaciones Salariales

**Fuentes Chile:** Michael Page, Hays, Glassdoor, networking, recruiters

**Rango Objetivo:**
- P25: Tu piso absoluto
- P50: Target realista
- P75: Aspiracional defendible

**Estrategia:**

1. **Timing**: Espera que mencionen compensación primero
2. **Anclaje en Rango**: Entre $Y - $Z para total compensation
3. **Paquete Completo**: Base + Bono + Equity + Beneficios + Flexibilidad
4. **Si-Entonces**: Si pudieran hacer $X base + Y% bono + Z equity, acepto hoy
5. **Oferta Baja**: Esperaba más cercano a $X. Hay flexibilidad? Si no, compensar en equity/bono/revisión?

**Errores Comunes:**
- Aceptar primera oferta sin negociar
- Revelar compensación actual
- Negociar solo salario base
- Ser demasiado agresivo
- No tener BATNA claro

## Conclusión: Práctica Deliberada

Negociar bien se desarrolla con práctica deliberada.

**Tu Plan:**
- Negocia algo pequeño cada semana
- Lleva journal de negociaciones
- Busca mentor que negocie bien
- Lee Never Split the Difference, Getting to Yes
- Practica role-plays con colegas

**Key Takeaways:**
- Preparación = 80% del éxito
- Anclar primero con número aspiracional genera ventaja
- Entender intereses reales abre creatividad
- En Chile, relación precede transacción
- BATNA fuerte es tu verdadero poder
- Objeciones = oportunidades para entender
- Negociar paquete completo, no solo precio
- Reflexión post-negociación acelera desarrollo',
  'Rodrigo Soto Bravo',
  ARRAY['negociación', 'comunicación', 'estrategia', 'cultura chilena', 'ventas', 'acuerdos', 'BATNA', 'anclaje'],
  0,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Verificar inserción
SELECT 
  COUNT(*) as total_libros,
  COUNT(DISTINCT category) as categorias_unicas
FROM knowledge_base;

-- Mostrar últimos 3 libros
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
