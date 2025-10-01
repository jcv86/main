-- Agregar 3 libros más de referentes chilenos (121-123)
-- Estos libros completan la colección con autores chilenos destacados

INSERT INTO books (
  slug,
  title,
  author,
  description,
  category,
  pages,
  reading_time_minutes,
  difficulty_level,
  tags,
  cover_image,
  language,
  country,
  publication_year,
  content,
  key_takeaways
) VALUES

-- Libro 121: Innovación en Tiempos de Crisis
(
  'innovacion-en-tiempos-de-crisis-chile',
  'Innovación en Tiempos de Crisis: El Caso Chileno',
  'Cristián Rodríguez Chiffelle',
  'Análisis profundo de cómo las empresas chilenas han innovado durante crisis económicas y sociales, con casos de éxito y estrategias aplicables.',
  'Emprendimiento',
  340,
  425,
  'intermediate',
  ARRAY['innovación', 'crisis', 'resiliencia', 'emprendimiento chileno', 'adaptación', 'casos de éxito'],
  '/placeholder.svg?height=400&width=300',
  'es',
  'Chile',
  2022,
  E'# Innovación en Tiempos de Crisis: El Caso Chileno

## Introducción: La Crisis como Oportunidad

Chile ha enfrentado múltiples crisis a lo largo de su historia reciente: el estallido social de 2019, la pandemia de COVID-19, y diversas crisis económicas. Sin embargo, estas adversidades han demostrado ser catalizadores de innovación. Este libro examina cómo empresas, emprendedores y organizaciones chilenas han transformado la crisis en oportunidad.

## Parte I: El Contexto Chileno de Crisis e Innovación

### Capítulo 1: Historia de las Crisis en Chile

Chile ha experimentado transformaciones profundas en las últimas décadas. Desde la crisis asiática de 1997, pasando por el terremoto de 2010, hasta el estallido social de 2019 y la pandemia global, cada crisis ha dejado lecciones valiosas sobre adaptación y resiliencia.

La economía chilena, tradicionalmente dependiente del cobre y recursos naturales, ha tenido que diversificarse. Esta necesidad ha impulsado la innovación en sectores como tecnología, servicios, agroindustria y energías renovables.

**Características del ecosistema innovador chileno:**

1. **Pragmatismo empresarial**: Las empresas chilenas tienden a buscar soluciones prácticas y escalables
2. **Capacidad de pivoteo rápido**: La cultura empresarial valora la agilidad sobre la planificación excesiva
3. **Redes de apoyo sólidas**: Instituciones como Corfo y Start-Up Chile han creado ecosistemas de soporte
4. **Talento técnico disponible**: Universidades de calidad producen profesionales capacitados
5. **Acceso a mercados regionales**: Chile sirve como puente para expansión latinoamericana

### Capítulo 2: Anatomía de una Crisis

Toda crisis tiene etapas predecibles:

**Etapa 1: Shock Inicial (0-3 meses)**
- Confusión y parálisis
- Caída abrupta de ingresos
- Incertidumbre generalizada
- Decisiones reactivas

**Etapa 2: Adaptación Forzada (3-6 meses)**
- Búsqueda urgente de soluciones
- Prueba y error acelerado
- Reducción de costos
- Redefinición de prioridades

**Etapa 3: Innovación Estratégica (6-12 meses)**
- Nuevos modelos de negocio emergen
- Digitalización acelerada
- Colaboraciones inesperadas
- Identificación de oportunidades

**Etapa 4: Nueva Normalidad (12+ meses)**
- Consolidación de cambios
- Ventajas competitivas establecidas
- Aprendizajes integrados
- Preparación para futuras crisis

## Parte II: Casos de Éxito Chilenos

### Capítulo 3: NotCo - Disrumpiendo la Industria Alimentaria

**Contexto**: NotCo nació en 2015, pero fue durante la pandemia cuando su propuesta de valor de alimentos plant-based cobró máxima relevancia.

**El Desafío**: Crear alternativas vegetales que superen en sabor a los productos tradicionales, usando inteligencia artificial.

**La Innovación**: 

NotCo desarrolló "Giuseppe", una IA que analiza estructuras moleculares de alimentos animales y encuentra combinaciones vegetales que replican sabor, textura y propiedades nutricionales. Durante la crisis de 2020:

- Expandieron a supermercados cuando restaurantes cerraron
- Lanzaron productos de larga duración (leches vegetales)
- Aceleraron e-commerce y delivery directo
- Levantaron $85M en serie C durante la pandemia
- Expandieron a USA y Brasil aprovechando disrupciones logísticas

**Lecciones Aplicables**:

1. **Tecnología como diferenciador**: La IA les dio ventaja competitiva imposible de copiar rápidamente
2. **Múltiples canales de distribución**: No depender de un solo canal salvó la empresa
3. **Producto con propósito**: La sostenibilidad resonó fuertemente en tiempos de reflexión global
4. **Timing de fundraising**: Levantaron capital cuando competidores no podían
5. **Expansión contra-cíclica**: Entraron a mercados cuando otros se retiraban

### Capítulo 4: Cornershop - De Grocery Delivery a Ecosistema

**Contexto**: Fundada en 2015, Cornershop operaba en nicho pequeño hasta que COVID-19 transformó el delivery de supermercado en servicio esencial.

**El Pivote Estratégico**:

Cuando la pandemia golpeó Chile en marzo 2020:

- Demanda creció 300% en dos semanas
- Tuvieron que contratar 1000+ shoppers en un mes
- Rediseñaron procesos para seguridad sanitaria
- Desarrollaron sistema de priorización para clientes vulnerables
- Aceleraron integración tecnológica con supermercados

**El Outcome**:

- Uber adquirió Cornershop por $1.4B en 2020
- Se convirtieron en infraestructura crítica para retail chileno
- Expandieron a 9 países durante la pandemia
- Crearon 10,000+ empleos directos

**Factores de Éxito**:

1. **Infraestructura tecnológica escalable**: Su arquitectura soportó crecimiento 10x
2. **Relaciones con retailers construidas previamente**: Ya tenían acuerdos con cadenas principales
3. **Cultura de ejecución rápida**: Capacidad de contratar y entrenar masivamente
4. **Foco en experiencia de usuario**: Mantuvieron calidad pese a crecimiento explosivo
5. **Timing perfecto para exit**: Uber buscaba fortalecer segmento grocery

### Capítulo 5: Buk - Digitalizando RRHH en Crisis

**Contexto**: Buk, plataforma de gestión de recursos humanos, enfrentó paradoja: sus clientes (empresas) reducían costos, pero necesitaban más que nunca digitalizar RRHH.

**La Oportunidad Oculta**:

Durante 2020-2021, Buk identificó que:

- Trabajo remoto exigía nuevas herramientas de gestión de personas
- Empresas necesitaban automatizar procesos para reducir headcount
- Cumplimiento regulatorio se volvió más complejo
- Bienestar de colaboradores se volvió prioridad estratégica

**La Estrategia**:

1. **Modelo freemium agresivo**: Ofrecieron versión gratuita para PyMEs afectadas
2. **Onboarding remoto en 24 horas**: Simplificaron implementación radicalmente
3. **Módulos de crisis**: Agregaron funcionalidades para gestión de teletrabajo, control de aforo, tracking de síntomas
4. **Contenido educativo**: Webinars semanales sobre gestión de personas en pandemia
5. **Pricing flexible**: Planes ajustados a realidad de cada empresa

**Resultados**:

- Crecieron de 500 a 2500+ clientes en 18 meses
- Levantaron $50M serie B en 2021
- Expandieron a México, Colombia y Perú
- Valorizados en $250M+

**Aprendizajes Clave**:

1. **La crisis acelera adopción tecnológica**: Lo que habría tomado 5 años pasó en 6 meses
2. **Empatía como estrategia comercial**: Ayudar genuinamente generó lealtad
3. **Producto-mercado fit se intensifica**: Lo que funcionaba bien, funcionó mejor
4. **Contenido como motor de ventas**: Educación generó leads calificados
5. **Financiamiento en momento correcto**: VCs buscaban bets seguros en crisis

## Parte III: Estrategias de Innovación en Crisis

### Capítulo 6: El Framework de Innovación Resiliente

Basado en análisis de 50+ empresas chilenas exitosas durante crisis, desarrollamos el framework CRISIS:

**C - Conocimiento del contexto**
- Monitoreo continuo de señales débiles
- Escenarios múltiples (optimista, base, pesimista)
- Indicadores adelantados específicos de tu industria

**R - Rapidez en decisiones**
- Ciclos de decisión semanales vs mensuales
- Equipos pequeños con autonomía
- Experimentación antes que análisis parálisis

**I - Innovación en modelo de negocio**
- Diversificación de ingresos
- Nuevos segmentos de clientes
- Canales alternativos de distribución

**S - Solidez financiera**
- Runway mínimo 12 meses
- Líneas de crédito pre-aprobadas
- Control obsesivo de caja

**I - Integración con ecosistema**
- Alianzas estratégicas
- Co-innovación con clientes/proveedores
- Participación en redes de apoyo

**S - Sostenibilidad en personas**
- Comunicación transparente frecuente
- Cuidado de salud mental del equipo
- Flexibilidad laboral

### Capítulo 7: Digitalización Acelerada

La pandemia comprimió 10 años de transformación digital en 12 meses. Empresas chilenas que sobresalieron:

**Caso: Banco de Chile**

Antes de la pandemia, 40% de transacciones eran presenciales. En marzo 2020:

- Lanzaron 15 nuevos servicios digitales en 60 días
- Implementaron videollamadas para apertura de cuentas
- Crearon sistema de agendamiento para sucursales
- Digitalizaron 100% de procesos internos críticos

Resultado: 85% de transacciones digitales, reducción de 30% en costos operacionales, aumento en NPS.

**Lecciones de Digitalización Exitosa**:

1. **Empezar por procesos críticos**: No intentar digitalizar todo a la vez
2. **Experiencia de usuario obsesiva**: Simplicidad sobre funcionalidades
3. **Capacitación intensiva**: Invertir 10x más en training
4. **Infraestructura flexible**: Cloud-first desde el inicio
5. **Seguridad no negociable**: Ciberseguridad como prioridad

### Capítulo 8: Pivot Estratégico

**Definición**: Un pivot es un cambio fundamental en estrategia de negocio mientras se mantiene la visión central.

**Tipos de Pivots Exitosos en Chile**:

**1. Pivot de Segmento de Cliente**
- Ejemplo: Empresa de catering corporativo → meal prep para familias
- Tasa de éxito: 40%
- Tiempo promedio: 4-6 meses

**2. Pivot de Canal**
- Ejemplo: Retail físico → e-commerce + dark stores
- Tasa de éxito: 60%
- Tiempo promedio: 3-4 meses

**3. Pivot de Modelo de Ingresos**
- Ejemplo: Venta directa → marketplace + comisiones
- Tasa de éxito: 35%
- Tiempo promedio: 6-9 meses

**4. Pivot de Propuesta de Valor**
- Ejemplo: Producto premium → solución económica accesible
- Tasa de éxito: 45%
- Tiempo promedio: 5-7 meses

**Marco para Ejecutar un Pivot**:

**Fase 1: Detección (Semana 1-2)**
- Identificar señales de que modelo actual no funciona
- Métricas críticas: CAC, LTV, churn rate, burn rate
- Punto de no retorno: Runway < 6 meses

**Fase 2: Exploración (Semana 3-6)**
- Entrevistas profundas con clientes actuales y potenciales
- Análisis de competencia y mercado
- Prototipado rápido de alternativas
- Testing de hipótesis críticas

**Fase 3: Decisión (Semana 7-8)**
- Evaluación de factibilidad técnica
- Análisis de viabilidad financiera
- Compromiso del equipo
- Comunicación a stakeholders

**Fase 4: Ejecución (Semana 9-20)**
- Lanzamiento MVP del nuevo modelo
- Iteración rápida basada en feedback
- Ajuste de procesos operacionales
- Migración gradual de recursos

## Parte IV: Herramientas y Metodologías

### Capítulo 9: Design Thinking en Contexto de Crisis

Design Thinking debe adaptarse a la velocidad y restricciones de una crisis:

**DT Tradicional vs DT en Crisis**:

| Aspecto | DT Tradicional | DT en Crisis |
|---------|---------------|--------------|
| Empatía | 2-4 semanas | 3-5 días |
| Ideación | Divergencia amplia | Convergencia rápida |
| Prototipado | Alta fidelidad | Mínimo viable |
| Testing | Múltiples iteraciones | 1-2 ciclos máximo |
| Implementación | 3-6 meses | 2-4 semanas |

**Herramienta: Crisis Design Sprint (5 días)**

**Lunes - Entender**
- Mapeo de problema (2 horas)
- Entrevistas relámpago con usuarios (4 horas)
- Definición de desafío (2 horas)

**Martes - Idear**
- Lightning demos (1 hora)
- Generación de soluciones (3 horas)
- Heat map voting (1 hora)
- Storyboard (3 horas)

**Miércoles - Prototipar**
- Construcción de prototipo funcional
- Foco: Lo mínimo que demuestre valor
- Criterio: "Good enough to test"

**Jueves - Testear**
- 5-7 entrevistas con usuarios
- Observación de uso real
- Captura de insights críticos

**Viernes - Decidir**
- Análisis de resultados
- Go/No-go/Iterar
- Plan de acción para próxima semana

### Capítulo 10: Lean Startup en Mercado Chileno

El enfoque Lean Startup es especialmente relevante en crisis:

**Principios Adaptados**:

1. **Build-Measure-Learn en Warp Speed**
   - Ciclos de 1 semana en vez de 1 mes
   - MVPs extremadamente mínimos
   - Métricas que realmente importan

2. **Validated Learning con Recursos Limitados**
   - Experimentos de bajo costo
   - Pruebas cualitativas sobre cuantitativas
   - Aprender de competencia internacional

3. **Pivots Baratos**
   - Mantener arquitectura flexible
   - Evitar compromisos de largo plazo
   - Preservar cash runway

**Caso de Aplicación: Startup de Edtech Chilena**

**Semana 1-2**: Hipótesis inicial - Plataforma de tutorías online para escolares
- MVP: Landing page + Google Forms + Zoom
- Inversión: $0
- Aprendizaje: Padres no confían en tutores desconocidos

**Semana 3-4**: Pivot 1 - Plataforma con tutores certificados
- MVP: Mismo tech stack + proceso de certificación manual
- Inversión: $500 (certificaciones)
- Aprendizaje: Padres pagan pero precio debe ser < $15.000/hora

**Semana 5-6**: Pivot 2 - Modelo de suscripción vs pago por sesión
- MVP: Sistema de membresía simple
- Inversión: $200 (Stripe setup)
- Aprendizaje: Suscripción mensual funciona mejor

**Semana 7-8**: Validación - 50 familias pagando
- MRR: $400.000
- CAC: $8.000
- LTV: $120.000
- Decisión: Escalar

## Parte V: Liderazgo en Tiempos Difíciles

### Capítulo 11: Comunicación en Crisis

La comunicación efectiva es crítica durante crisis:

**Principios de Comunicación en Crisis**:

1. **Frecuencia sobre perfección**
   - Mejor comunicar frecuentemente con información parcial que esperar tener todo claro
   - Ritmo sugerido: Updates semanales al equipo, mensuales a stakeholders

2. **Transparencia radical**
   - Compartir tanto buenas como malas noticias
   - Admitir incertidumbres
   - No prometer lo que no puedes cumplir

3. **Empatía primero**
   - Reconocer emociones del equipo
   - Espacio para procesar
   - Apoyo psicológico disponible

4. **Claridad en prioridades**
   - Qué importa ahora vs qué puede esperar
   - Métricas que seguimos
   - Definición de éxito actualizada

**Ejemplo de Comunicación Efectiva**:

*Email del CEO de empresa chilena en abril 2020:*

"Equipo,

Sé que las últimas semanas han sido intensas y llenas de incertidumbre. Quiero compartir dónde estamos:

**Situación actual:**
- Ingresos bajaron 60% vs marzo 2019
- Tenemos runway para 8 meses con gastos actuales
- 3 clientes grandes han pausado contratos

**Qué estamos haciendo:**
- Reduciendo gastos no esenciales en 40%
- Explorando 2 pivots de modelo de negocio
- Aplicando a fondos de emergencia

**Qué necesito de ustedes:**
- Ideas para reducir costos sin afectar producto
- Conexiones con potenciales clientes en sectores resilientes
- Paciencia mientras navegamos esto juntos

**Qué NO voy a hacer:**
- Despidos (al menos próximos 6 meses)
- Reducir salarios
- Tomar decisiones sin consultarles

Los mantendré informados cada viernes. Mis DMs están abiertos 24/7.

Vamos a salir de esta."

### Capítulo 12: Tomando Decisiones Bajo Incertidumbre

En crisis, las decisiones se toman con información incompleta:

**Framework de Decisión en Crisis**:

**1. Categorizar la decisión**
- Tipo 1 (irreversible): Requiere análisis profundo
- Tipo 2 (reversible): Decidir rápido, ajustar después

**2. Establecer deadline**
- Toda decisión debe tener fecha límite
- Si no puedes decidir en ese plazo, es decisión Tipo 1

**3. Reunir información suficiente**
- 70% de información es suficiente
- Más allá de eso es procrastinación

**4. Consultar, pero no en comité**
- Escucha 3-5 opiniones expertas
- Tú decides solo

**5. Decidir y comunicar**
- Decisión clara y por escrito
- Rationale compartido
- Plan de contingencia si sale mal

**6. Revisar en X días**
- Toda decisión tiene fecha de revisión
- Estar dispuesto a cambiar de opinión

## Parte VI: Preparándose para la Próxima Crisis

### Capítulo 13: Construyendo Resiliencia Organizacional

La resiliencia no es accidental, se construye:

**Los 5 Pilares de Resiliencia**:

**1. Resiliencia Financiera**
- Runway mínimo: 12 meses
- Múltiples fuentes de financiamiento
- Líneas de crédito pre-aprobadas
- Estructura de costos flexible (70% variable)

**2. Resiliencia Operacional**
- Procesos documentados y automatizables
- Proveedores alternativos identificados
- Capacidad de trabajo remoto total
- Infraestructura en la nube

**3. Resiliencia de Talento**
- Equipo multifuncional (T-shaped)
- Cultura de aprendizaje continuo
- Bienestar como prioridad estratégica
- Plan de contingencia de roles críticos

**4. Resiliencia de Modelo de Negocio**
- Múltiples segmentos de clientes
- Diversificación geográfica
- Varios streams de ingresos
- Capacidad de pivot probada

**5. Resiliencia de Liderazgo**
- Comunicación transparente habitual
- Decisiones descentralizadas
- Cultura de experimentación
- Aprendizaje de errores normalizado

### Capítulo 14: El Futuro de la Innovación en Chile

Chile tiene oportunidad única de posicionarse como hub de innovación latinoamericano:

**Ventajas Competitivas**:
- Estabilidad macroeconómica relativa
- Ecosistema de startups maduro
- Talento técnico de calidad
- Acceso a capital de riesgo
- Conexión con mercados globales

**Desafíos a Superar**:
- Mercado interno pequeño
- Dependencia de recursos naturales
- Desigualdad estructural
- Burocracia regulatoria
- Fuga de talento

**Oportunidades para 2024-2030**:
- Energías renovables y electromovilidad
- Foodtech y agtech
- Healthtech y biotech
- Fintech y soluciones financieras inclusivas
- Soluciones de sostenibilidad y economía circular

## Conclusión: Lecciones para el Futuro

Las crisis son inevitables, pero la innovación en respuesta es opcional. Las empresas chilenas que prosperaron durante adversidades recientes comparten características comunes:

1. **Cultura de adaptabilidad**: No se aferran a planes obsoletos
2. **Foco en cliente**: Entienden necesidades cambiantes profundamente  
3. **Velocidad de ejecución**: Priorizan acción sobre análisis perfecto
4. **Solidez financiera**: Mantienen runway suficiente para experimentar
5. **Talento comprometido**: Equipos que creen en la misión

La próxima crisis vendrá. La pregunta no es si, sino cuándo. Las organizaciones que construyan músculo de innovación hoy, serán las que lideren mañana.

Chile tiene todo para ser referente de innovación en América Latina. Depende de nosotros convertir cada crisis en catalizador de transformación.',
  ARRAY[
    'La crisis acelera innovación cuando hay preparación previa',
    'Resiliencia financiera es base para experimentación',
    'Pivots rápidos requieren infraestructura flexible',
    'Comunicación transparente genera confianza en crisis',
    'Ecosistema colaborativo amplifica capacidad de adaptación',
    'Digitalización no es opción, es supervivencia',
    'Empatía con cliente revela oportunidades ocultas',
    'Velocidad de decisión supera perfección de análisis'
  ]
),

-- Libro 122: Liderazgo Consciente
(
  'liderazgo-consciente-transformacion-empresas-chilenas',
  'Liderazgo Consciente: Transformando Empresas Chilenas',
  'Paula Covarrubias García',
  'Guía práctica sobre liderazgo consciente y mindfulness en el contexto empresarial chileno, con ejercicios y técnicas aplicables.',
  'Liderazgo',
  310,
  390,
  'intermediate',
  ARRAY['liderazgo', 'mindfulness', 'transformación', 'consciencia', 'bienestar', 'cultura organizacional'],
  '/placeholder.svg?height=400&width=300',
  'es',
  'Chile',
  2023,
  E'# Liderazgo Consciente: Transformando Empresas Chilenas

## Introducción: El Despertar del Liderazgo en Chile

Durante años, el liderazgo empresarial en Chile se caracterizó por un estilo autoritario, jerárquico y enfocado únicamente en resultados. El estallido social de 2019 y la pandemia de 2020 revelaron las grietas de este modelo: equipos quemados, alta rotación, baja innovación y desconexión entre líderes y colaboradores.

Este libro propone un nuevo paradigma: el liderazgo consciente. No se trata de técnicas superficiales de mindfulness corporativo, sino de una transformación profunda en cómo entendemos el poder, la responsabilidad y el impacto de liderar.

He trabajado con más de 50 empresas chilenas en los últimos 5 años, desde startups hasta corporaciones tradicionales. Lo que he observado es claro: las organizaciones lideradas conscientemente superan consistentemente a sus competidoras en innovación, retención de talento, satisfacción de clientes y resultados financieros.

## Parte I: Fundamentos del Liderazgo Consciente

### Capítulo 1: Qué es Liderazgo Consciente

Liderazgo consciente es la práctica de liderar con presencia, intención y compasión, reconociendo la interconexión entre bienestar individual, salud organizacional y resultados de negocio.

**Los Tres Pilares**:

**1. Autoconocimiento Profundo**
- Entender tus valores, motivaciones y sombras
- Reconocer patrones automáticos de comportamiento
- Aceptar vulnerabilidades sin juicio
- Claridad sobre tu propósito de liderazgo

**2. Presencia Relacional**
- Escucha activa sin agenda
- Empatía genuina con experiencia del otro
- Comunicación auténtica y vulnerable
- Construcción de confianza como práctica

**3. Impacto Sistémico**
- Entender que cada acción tiene ondas expansivas
- Diseñar sistemas que amplifiquen lo mejor de las personas
- Medir éxito más allá de lo financiero
- Responsabilidad con stakeholders múltiples

**Diferencias con Liderazgo Tradicional**:

| Aspecto | Liderazgo Tradicional | Liderazgo Consciente |
|---------|---------------------|-------------------|
| Foco | Resultados exclusivamente | Resultados + proceso + personas |
| Poder | Jerárquico, top-down | Distribuido, empowering |
| Decisiones | Racional, datos duros | Integra razón, emoción e intuición |
| Errores | Castigados o escondidos | Oportunidades de aprendizaje |
| Éxito | Individual | Colectivo |
| Tiempo | Corto plazo | Sostenibilidad largo plazo |

### Capítulo 2: La Crisis de Liderazgo en Chile

**Síntomas de Liderazgo Inconsciente**:

1. **Burnout Epidémico**
   - 62% de profesionales chilenos reportan agotamiento (estudio UC 2022)
   - Licencias médicas por salud mental aumentaron 300% 2018-2023
   - Rotación promedio en tech: 18-24 meses

2. **Desconexión Generacional**
   - Millennials y Gen Z rechazan modelos autoritarios
   - Priorización de propósito sobre salario
   - Expectativa de líderes vulnerables y auténticos

3. **Falta de Innovación**
   - Cultura del miedo inhibe creatividad
   - Silos organizacionales bloquean colaboración
   - Perfeccionismo paraliza experimentación

4. **Crisis de Confianza**
   - Desconfianza en instituciones tradicionales
   - Escándalos empresariales recurrentes
   - Demanda por transparencia y valores

**El Costo del Liderazgo Inconsciente**:

Estudio que realicé con 30 empresas chilenas (2020-2023):

- Pérdida de productividad por desenganche: $15-30M CLP anuales (empresa mediana)
- Costo de reemplazo por rotación: 6-9 meses de salario por posición
- Impacto en innovación: 40-60% menos experimentos/año
- Reputación de marca empleadora: Caída de 20-40 puntos NPS

### Capítulo 3: Mindfulness para Líderes

Mindfulness no es escapismo New Age, es entrenamiento de atención que mejora toma de decisiones.

**Práctica Core: Meditación Diaria**

**Protocolo para Ejecutivos Ocupados (10 minutos)**:

1. **Minutos 1-2: Asentar**
   - Siéntate cómodamente
   - Columna erguida pero relajada
   - Ojos cerrados o mirada baja
   - Tres respiraciones profundas

2. **Minutos 3-7: Atención a la Respiración**
   - Observa inhalar y exhalar
   - Cuando mente divague (lo hará), regresa suavemente
   - No juzgues distracciones, solo nota y vuelve
   - Ancla: sensación del aire en nariz o abdomen

3. **Minutos 8-9: Expansión**
   - Amplía atención a sonidos
   - Luego a sensaciones corporales
   - Luego a pensamientos como nubes pasando
   - Mantén perspectiva de observador

4. **Minuto 10: Integración**
   - Establece intención para el día
   - "Que pueda liderar con presencia y compasión"
   - Abre los ojos lentamente

**Resultados Documentados**:

Estudio con 45 ejecutivos chilenos (12 semanas de práctica diaria):

- Reducción 35% en cortisol (hormona del estrés)
- Mejora 28% en función ejecutiva (tests cognitivos)
- Aumento 42% en satisfacción laboral reportada
- Mejora 31% en evaluación 360° de liderazgo

**Práctica Avanzada: Mindfulness en Acción**

La verdadera prueba de mindfulness es mantener presencia durante desafíos:

**Ejercicio: STOP en Momentos Críticos**

Cuando sientes activación (enojo, ansiedad, frustración):

- **S**top: Para todo
- **T**ake a breath: Respira tres veces
- **O**bserve: Qué siento en el cuerpo? Qué historia me cuento?
- **P**roceed: Actúa con intención, no reacción

**Escenarios Comunes**:

*Situación 1*: Empleado llega con problema urgente mientras preparas presentación importante
- Reacción inconsciente: "No tengo tiempo, resuélvelo tú"
- Respuesta consciente: STOP, respiro, reconozco prioridades múltiples, "Dame 2 minutos para cerrar esto y te atiendo completamente"

*Situación 2*: Recibes feedback crítico en reunión pública
- Reacción inconsciente: Defensividad, contraataque, justificación
- Respuesta consciente: STOP, respiro, agradezco feedback, "Déjame procesar esto y conversamos mañana"

## Parte II: Autoconocimiento del Líder

### Capítulo 4: Tus Valores en Acción

Muchos líderes hablan de valores pero no los encarnan. El primer paso es claridad radical.

**Ejercicio: Identificación de Valores Core**

**Paso 1**: Haz lista de 20 valores que resuenan (ej: integridad, creatividad, familia, logro, colaboración)

**Paso 2**: Reduce a 10 preguntando "Si tuviera que elegir, cuál es más importante?"

**Paso 3**: Reduce a 5 con misma pregunta

**Paso 4**: Por cada valor, escribe:
- Qué significa específicamente para ti
- Una historia donde lo viviste plenamente  
- Una situación donde lo comprometiste
- Cómo se ve en tu liderazgo diario

**Paso 5**: Comparte con tu equipo y pide feedback: "¿Ven estos valores en cómo lidero?"

**Caso Real: CEO de Startup Fintech Chilena**

*Valores declarados*: Innovación, transparencia, ejecución, cuidado del equipo, cliente primero

*Test de realidad*: Lanzamiento de producto con bugs conocidos por presión de inversionistas

*Conflicto*: "Cliente primero" vs "Ejecución" vs "Transparencia"

*Decisión consciente*: Posponer lanzamiento 2 semanas, comunicar honestamente a inversionistas sobre bugs, usar tiempo para arreglar

*Resultado*: Lanzamiento exitoso, confianza de inversionistas aumenta, equipo siente que valores son reales

### Capítulo 5: Tus Sombras de Liderazgo

Carl Jung enseñó que todos tenemos "sombras" - aspectos de nosotros que negamos o proyectamos en otros.

**Sombras Comunes en Líderes Chilenos**:

1. **Necesidad de Control**
   - Origen: Miedo a caos, perfeccionismo, trauma de fracaso pasado
   - Manifestación: Micromanagement, dificultad para delegar, cuellos de botella
   - Impacto: Equipo dependiente, falta de desarrollo, burnout del líder

2. **Miedo a Vulnerabilidad**
   - Origen: Cultura machista, "líderes no pueden mostrar debilidad"
   - Manifestación: Fachada de invulnerabilidad, distancia emocional
   - Impacto: Falta de confianza, equipo esconde problemas, silos

3. **Perfeccionismo Paralizante**
   - Origen: Autoexigencia extrema, crítica internalizada
   - Manifestación: Retrasar decisiones, analizar en exceso, criticar rigurosamente
   - Impacto: Lentitud, parálisis por análisis, miedo a innovar

4. **Agresividad Pasiva**
   - Origen: Desconexión con enojo legítimo
   - Manifestación: Sarcasmo, retrasar feedback, sabotaje sutil
   - Impacto: Confusión en equipo, temas no se resuelven, toxicidad latente

**Ejercicio de Integración de Sombras**:

**Parte 1: Identificación**
- ¿Qué comportamientos de otros líderes te molestan intensamente?
- (Pista: Probablemente refleja tu sombra)

**Parte 2: Investigación**
- ¿Cuándo tú manifiestas ese comportamiento?
- ¿En qué contextos surge?
- ¿Qué necesidad subyacente intentas satisfacer?

**Parte 3: Práctica**
- ¿Cómo podrías satisfacer esa necesidad sanamente?
- ¿Qué nueva práctica podrías implementar?

## Parte III: Liderazgo Relacional

### Capítulo 6: La Escucha Como Superpoder

La escucha verdadera es rara. La mayoría "espera su turno para hablar".

**Niveles de Escucha**:

**Nivel 1: Escucha Transaccional**
- Oigo palabras, esperando mi turno
- Pensando en mi respuesta
- Juzgando lo que dice
- Interrumpiendo frecuentemente

**Nivel 2: Escucha Empática**
- Entiendo contenido y emoción
- Hago preguntas clarificadoras
- Valido su experiencia
- Parafraseo para confirmar

**Nivel 3: Escucha Generativa**  
- Sostengo espacio sin agenda
- Noto lo no dicho
- Ayudo a persona a descubrir su verdad
- Emergen insights sorprendentes

**Práctica: 10 Minutos de Escucha Profunda**

Protocolo semanal con cada reporte directo:

1. Agenda limpia, sin otras tareas
2. Lenguaje corporal abierto
3. "Cuéntame, ¿cómo estás realmente?"
4. 10 minutos solo escuchando
5. Preguntas abiertas si acaso: "¿Qué más?", "¿Cómo te hace sentir eso?"
6. Resistir urgencia de resolver o aconsejar inmediatamente
7. Al final: "¿Qué necesitas de mí?"

**Impacto Medido**:

En estudio con 20 líderes implementando esto durante 8 semanas:

- Problemas detectados 3x más temprano
- Retención de talento mejoró 25%
- Ideas innovadoras aumentaron 40%
- Confianza en líder subió 35 puntos NPS

### Capítulo 7: Feedback Consciente

Feedback efectivo es regalo que transforma. Feedback mal dado destruye confianza.

**Principios de Feedback Consciente**:

1. **Momento adecuado**
   - No en caliente (esperar 24 horas si estás activado)
   - Privado para constructivo, público para positivo
   - Cuando persona está receptiva

2. **Observación vs Juicio**
   - ❌ "Eres desorganizado"
   - ✅ "Noté que últimos 3 reportes llegaron con retraso"

3. **Impacto específico**
   - ❌ "Eso es malo para el equipo"
   - ✅ "Cuando reportes llegan tarde, equipo X no puede avanzar y se estresan"

4. **Curiosidad vs Certeza**
   - ❌ "Debes priorizar mejor"
   - ✅ "Me pregunto si hay algo bloqueando tu capacidad de cumplir plazos. ¿Qué está pasando?"

5. **Co-creación de soluciones**
   - No imponer tu solución
   - Preguntar: "¿Qué crees que podría ayudar?"
   - Ofrecer apoyo: "¿Cómo puedo facilitarte esto?"

**Protocolo de Feedback Difícil**:

**Antes**:
- Claridad: ¿Cuál es comportamiento específico?
- Verificación: ¿Es patrón o incidente aislado?
- Intención: ¿Quiero ayudar a crecer o desahogar frustración?
- Auto-regulación: ¿Estoy centrado para esta conversación?

**Durante**:
- "Hay algo que necesito compartir contigo. ¿Es buen momento?"
- "He notado [observación específica]"
- "El impacto que veo es [consecuencia concreta]"
- "Me pregunto [curiosidad genuina sobre causas]"
- "¿Cómo lo ves tú?"
- [Escuchar profundamente]
- "¿Qué podríamos hacer diferente?"
- "¿Cómo puedo apoyarte?"

**Después**:
- Follow-up en 1-2 semanas
- Reconocer cualquier mejora
- Sostener accountability con compasión

## Parte IV: Transformando Sistemas

### Capítulo 8: Diseñando Cultura Conscientemente  

Cultura no es foosball y comida gratis. Cultura es "cómo hacemos las cosas cuando nadie mira".

**Los 5 Elementos de Cultura Consciente**:

**1. Seguridad Psicológica**

Google estudió 180 equipos y encontró que el predictor #1 de alto rendimiento es seguridad psicológica: puedo tomar riesgos sin miedo a humillación.

Prácticas que construyen seguridad:

- Líder admite errores públicamente
- Celebrar experimentos fallidos como aprendizaje
- Política explícita de no culpa en post-mortems
- Espacio para expresar desacuerdo sin retaliación

**2. Propósito Compartido**

Por qué existimos más allá de hacer dinero?

Ejercicio con tu equipo:
- "Si nuestra empresa desapareciera mañana, ¿qué perdería el mundo?"
- "¿A quién servimos en su mejor versión?"
- "¿Qué mundo queremos ayudar a crear?"

**3. Transparencia Radical**

Información es poder. Democratizar información es democratizar poder.

Qué compartir:
- Métricas clave de negocio (incluyendo financieras)
- Decisiones estratégicas y su rationale
- Desafíos que enfrenta la organización
- Feedback de clientes (bueno y malo)

**4. Experimentación Continua**

Cultura de aprendizaje vs cultura de saber.

Prácticas:
- 10-20% tiempo para proyectos experimentales
- Budget dedicado a "fallar rápido"
- Show & Tell semanal de experimentos
- Premios a mejores fallas (de las que más aprendimos)

**5. Bienestar Integral**

Personas florecientes hacen equipos florecientes.

Políticas conscientes:
- Vacaciones ilimitadas (con mínimo obligatorio)
- Días de salud mental sin preguntas
- Subsidio para terapia/coaching
- Horarios flexibles reales
- Meetingsless Fridays

### Capítulo 9: Reuniones que Nutren vs Drenan

Meetings son donde la cultura se vive o muere.

**Anatomía de Reunión Consciente**:

**Check-in (5 min)**
- Cada persona comparte: "¿Cómo llego a este espacio?" (emocional/mental/físico)
- Genera presencia y conexión
- Revela temas subyacentes

**Recordatorio de Propósito (2 min)**
- ¿Para qué estamos aquí?
- ¿Qué queremos lograr?
- ¿Qué no se resolverá hoy?

**Trabajo (60-80% del tiempo)**
- Dinámicas facilitadas
- Espacio equitativo para voces
- Parquear temas para después

**Decisiones Claras (5-10 min)**
- ¿Qué decidimos?
- ¿Quién hace qué para cuándo?
- ¿Cómo mediremos progreso?

**Check-out (3 min)**
- "¿Con qué me voy de aquí?"
- Reconocimientos
- Aprendizajes

**Tipos de Meetings Conscientes**:

1. **Weekly Team Sync (60 min)**
   - Purpose: Alineación y soporte mutuo
   - Participantes: Todo el equipo
   - Dinámicas: Round robin updates, collaborative problem-solving

2. **One-on-Ones (30-60 min, semanal/bisemanal)**
   - Purpose: Desarrollo y relación  
   - Participantes: Líder + colaborador
   - Dinámicas: Escucha profunda, coaching, feedback

3. **Estratégica Mensual (2-3 horas)**
   - Purpose: Pensar largo plazo, innovar
   - Participantes: Leadership team
   - Dinámicas: Offsite, sin laptops, pensamiento sistémico

4. **All-Hands (60 min, mensual)**
   - Purpose: Transparencia y construcción de tribu
   - Participantes: Toda la empresa
   - Dinámicas: Updates CEO, Q&A abierto, celebraciones

## Parte V: Liderazgo en el Contexto Chileno

### Capítulo 10: Superando Patrones Culturales Limitantes

Chile tiene fortalezas culturales pero también patrones que inhiben liderazgo consciente.

**Patrón 1: Cultura del "Sí" pero Complaciente**

- Evitamos conflicto a toda costa
- Decimos "sí" sin compromiso real
- Temas importantes no se discuten abiertamente

**Antídoto**: Normalizar desacuerdo respetuoso

Práctica: "Devil's Advocate" estructurado en decisiones importantes
- Alguien debe argumentar en contra
- Se aplaude visión crítica
- Se busca síntesis, no imponer

**Patrón 2: Machismo Sutil**

- Líderes mujeres deben ser "duras" para ser tomadas en serio
- Vulnerabilidad vista como debilidad
- Emociones no tienen lugar en trabajo

**Antídoto**: Modelar integración de fortaleza y vulnerabilidad

Ejemplo: CEO hombre compartiendo en All-Hands que está en terapia por ansiedad, y cómo le ha ayudado

**Patrón 3: Formalismo que Inhibe Innovación**

- Jerarquías rígidas
- Ideas de juniors ignoradas
- "Así se ha hecho siempre"

**Antídoto**: Crear canales explícitos de disrupto

Práctica: "Intraemprendimiento month" donde cualquiera puede proponer y probar nuevo modelo

**Patrón 4: Individualismo Disfrazado**

- Cultura de "me las puedo solo"
- Pedir ayuda es debilidad
- Información es poder personal

**Antídoto**: Premiar colaboración y pedir ayuda

Práctica: En reviews, evaluar no solo logros individuales sino contribución al éxito de otros

### Capítulo 11: Liderazgo Femenino Consciente

Chile necesita urgentemente más mujeres en liderazgo. No solo por equidad, sino porque traen dimensiones de consciencia valiosas.

**Fortalezas del Liderazgo Femenino** (en promedio, no universal):

1. **Inteligencia Emocional**
   - Mayor capacidad de leer contextos emocionales
   - Empatía natural con diversidad de experiencias
   - Construcción de confianza relacional

2. **Pensamiento Holístico**
   - Ver interconexiones vs silos
   - Considerar stakeholders múltiples
   - Balance entre corto y largo plazo

3. **Colaboración vs Competencia**
   - Win-win sobre win-lose
   - Co-creación vs imposición
   - Equipos sobre héroes individuales

**Desafíos Únicos**:

1. **Doble Estándar**
   - Asertiva = "agresiva"
   - Empática = "débil"
   - Imposible balance perfecto

   Respuesta Consciente: Ser auténticamente tú, dejar de buscar aprobación universal

2. **Carga Mental Invisible**
   - Trabajo emocional de equipo recae en ti
   - Expectativa de ser "mamá del equipo"
   - Balance vida-trabajo más difícil por roles tradicionales

   Respuesta Consciente: Establecer límites claros, distribuir carga emocional

3. **Síndrome del Impostor Intenso**
   - Duda constante de capacidades
   - Sobrecalificación antes de postular
   - Minimización de logros

   Respuesta Consciente: Tracking de wins, mentoría con otras líderes, terapia

**Mentoras Chilenas Inspiradoras**:

- Magdalena Vergara (co-fundadora Laboratoria): Liderazgo inclusivo en educación tech
- María Paz Truffello (ex-CEO CorpAraucanía): Transformación de institución pública con enfoque humano
- Sofía Vergara (CEO Emerge): Empoderando liderazgo femenino en startups

### Capítulo 12: Midiendo Impacto del Liderazgo Consciente

"Lo que se mide, se gestiona" - pero ¿qué métricas importan?

**Dashboard de Liderazgo Consciente**:

**1. Engagement del Equipo**
- Herramienta: Pulse surveys semanales (1 pregunta)
- Métrica: % de respuestas positivas
- Benchmark: >75% es excelente
- Frecuencia: Semanal

**2. Seguridad Psicológica**
- Herramienta: Encuesta Amy Edmondson (7 preguntas)
- Métrica: Escala 1-5
- Benchmark: >4.0 es excelente
- Frecuencia: Trimestral

**3. Innovación Comportamental**
- Métrica: # de experimentos lanzados por trimestre
- Métrica: # de ideas generadas en brainstorms
- Benchmark: 2-3 experimentos/trimestre por persona
- Frecuencia: Continua

**4. Desarrollo de Talento**
- Métrica: % de posiciones llenadas internamente
- Métrica: Horas de learning por persona/mes
- Benchmark: >60% interno, >8 horas learning
- Frecuencia: Trimestral

**5. Bienestar del Equipo**
- Métrica: Días de licencia médica (especialmente salud mental)
- Métrica: Rotación voluntaria
- Métrica: Scores de burnout (Maslach Burnout Inventory)
- Benchmark: <5% rotación anual, <20% burnout
- Frecuencia: Mensual

**6. Resultados de Negocio**
- Revenue, margins, customer satisfaction
- Pero contextualizados con métricas de proceso

## Conclusión: El Viaje, No el Destino

Convertirse en líder consciente no es alcanzar un estado final. Es práctica diaria, con avances y retrocesos.

**Mi Compromiso Contigo**:

No pretendo ser líder perfecta. Sigo metiendo la pata, reaccionando desde ego, perdiendo presencia. La diferencia es que ahora:

1. Lo noto más rápido
2. Me disculpo y reparo
3. Aprendo de cada vez
4. Sostengo compasión para mí y otros

**Tu Práctica Inicial (Primeros 30 Días)**:

**Semana 1: Autoconocimiento**
- 10 min meditación diaria
- Journaling: "¿Cuándo perdí presencia hoy?"
- Ejercicio de valores

**Semana 2: Escucha**
- Un 1-1 de 10 min de escucha pura con cada reporte
- Práctica STOP en 3 interacciones desafiantes
- Nota cuándo estás en cada nivel de escucha

**Semana 3: Feedback**
- Da un feedback consciente (protocolo completo)
- Pide feedback sobre tu liderazgo a 3 personas
- Practica recibir feedback sin defenderte

**Semana 4: Sistema**
- Rediseña una reunión con elementos conscientes
- Comparte una vulnerabilidad con tu equipo
- Establece una métrica de bienestar para trackear

Después de 30 días, evalúa qué cambió. Sutilezas importan.

**Recursos y Comunidad**:

Liderazgo consciente no se practica solo:

- Grupo de práctica mensual (Santiago, formato círculo)
- Programa de certificación en liderazgo consciente (6 meses)
- Coaching 1-1 para líderes
- Retiros de profundización trimestrales

**Último Mensaje**:

Chile está en momento crucial. Podemos perpetuar modelos de liderazgo que enferman personas y organizaciones, o podemos ser pioneers de nuevo paradigma.

Cada líder que elige consciencia, activa ondas expansivas. Tu equipo nota. Tus pares se inspiran. Tu industria evoluciona.

No es hipérbole: tu liderazgo consciente puede ayudar a sanar Chile.

¿Aceptas la invitación?',
  ARRAY[
    'Liderazgo consciente integra resultados, proceso y bienestar de personas',
    'Mindfulness es entrenamiento de atención que mejora toma de decisiones',
    'Escucha profunda es superpoder de líderes transformadores',
    'Cultura se diseña intencionalmente, no emerge accidentalmente',
    'Vulnerabilidad del líder genera confianza y seguridad psicológica',
    'Feedback consciente transforma, feedback inconsciente destruye',
    'Métricas de bienestar son tan importantes como métricas financieras',
    'Liderazgo es práctica diaria, no estado final que se alcanza'
  ]
),

-- Libro 123: Negociación Efectiva en el Mercado Chileno
(
  'negociacion-efectiva-mercado-chileno',
  'Negociación Efectiva en el Mercado Chileno',
  'Rodrigo Soto Bravo',
  'Técnicas y estrategias de negociación adaptadas a la cultura empresarial chilena, con casos reales y ejercicios prácticos.',
  'Comunicación',
  285,
  355,
  'intermediate',
  ARRAY['negociación', 'comunicación', 'estrategia', 'cultura chilena', 'ventas', 'acuerdos'],
  '/placeholder.svg?height=400&width=300',
  'es',
  'Chile',
  2023,
  E'# Negociación Efectiva en el Mercado Chileno

## Introducción: La Negociación en el Contexto Chileno

Negociar en Chile requiere entender sutilezas culturales que hacen la diferencia entre cerrar un acuerdo excepcional o perder una oportunidad valiosa. Después de 15 años negociando desde startups hasta corporaciones, puedo afirmar que las técnicas "universales" de negociación deben adaptarse profundamente al contexto local.

Este libro destila lecciones de 200+ negociaciones exitosas (y algunas fallidas) en Chile, desde deals de $5K hasta $50M. No encontrarás teoría abstracta, sino estrategias accionables probadas en el mercado chileno.

## Parte I: Fundamentos de Negociación en Chile

### Capítulo 1: El Estilo Chileno de Negociación

**Características Culturales que Impactan Negociación**:

**1. Indirectez y Contexto**
- Chilenos rara vez dicen "no" directamente
- "Lo voy a pensar" frecuentemente significa "no"
- "Interesante propuesta" no es entusiasmo, es cortesía
- El silencio comunica tanto como las palabras

**2. Relaciones Antes que Transacciones**
- Confianza personal precede a confianza comercial
- Primera reunión rara vez es para "cerrar", es para conocerse
- Apuro por cerrar rápido genera desconfianza
- Networking es inversión de largo plazo, no táctica inmediata

**3. Formalidad con Informalidad Selectiva**
- Tratamiento de "usted" inicial, "tú" solo cuando hay confianza
- Títulos académicos/profesionales importan ("Ingeniero", "Doctor")
- Código de vestimenta formal en primeras interacciones
- Pero café después de reunión es donde pasan cosas reales

**4. Jerarquía y Autoridad**
- Decisiones finales frecuentemente se toman "arriba"
- Persona con quien negocias puede no tener poder de decisión
- Importante identificar real decision-maker temprano
- Saltarse jerarquía puede ofender

**5. Adversidad al Riesgo**
- Preferencia por lo conocido sobre lo innovador
- Referencias y casos de éxito locales son críticos
- Garantías y reversibilidad valoradas altamente
- Primera oferta tiende a ser conservadora

**Comparación con Otros Estilos**:

| Dimensión | Chile | USA | Brasil |
|-----------|-------|-----|--------|
| Directez | Baja | Alta | Media |
| Velocidad | Lenta | Rápida | Media |
| Formalidad | Alta inicialmente | Baja | Media |
| Importancia de relación | Alta | Baja | Muy alta |
| Orientación temporal | Largo plazo | Corto plazo | Medio plazo |

### Capítulo 2: Preparación - El 80% del Éxito

**Framework de Preparación: 7 Pasos Críticos**

**Paso 1: Investigación de Contraparte (2-3 horas)**

*Qué investigar*:
- Historia de la empresa/persona
- Desempeño financiero reciente
- Desafíos actuales (noticias, RRSS, informes)
- Cultura organizacional (Glassdoor, LinkedIn)
- Quién es el decision-maker real
- Con quién han trabajado anteriormente

*Herramientas*:
- LinkedIn Sales Navigator
- Google News + alertas
- Infocomercio (Chile)
- Networking: "¿Conoces a alguien que trabaje/trabajó ahí?"

**Caso Real**: Startup tech negociando con retail grande
- Investigación reveló que CIO nuevo (3 meses en cargo)
- Prioridad #1: "Quick wins" para demostrar valor
- Ajustamos propuesta a proyecto piloto rápido (30 días)
- Resultado: Cerramos en 2 reuniones vs 6 meses promedio

**Paso 2: Definir Tu BATNA (Best Alternative To Negotiated Agreement)**

*Preguntas clave*:
- Si esta negociación falla, ¿cuál es mi mejor alternativa?
- ¿Qué tan fuerte es mi BATNA vs el de ellos?
- ¿Cómo puedo fortalecer mi BATNA antes/durante negociación?

*Ejemplo*:
Negociando salario en nueva posición:
- BATNA débil: Sin otras ofertas, necesitas trabajo urgente
- BATNA fuerte: Tienes 2 ofertas más + empleo actual estable

**Tu BATNA define tu poder**. Si tu BATNA es débil, no reveles urgencia.

**Paso 3: Zona de Posible Acuerdo (ZOPA)**

Identifica rangos donde hay overlap:
