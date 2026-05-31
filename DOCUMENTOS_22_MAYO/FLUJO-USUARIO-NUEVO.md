# Flujo Completo para Usuario Nuevo

## Resumen Visual

```
LOGIN → INTRO → C1 → DISC EDUCATION → TEST A1 → RESULTS → C2-PASO1 → C2-PASO2 → RUTA GENERADA → DASHBOARD
```

---

## Paso a Paso Detallado

### 1. LOGIN (Supabase Auth)
- Usuario accede a `/auth/login`
- Ingresa email y password
- Se redirige automáticamente a `/despega/onboarding`

---

### 2. INTRO - "Hola, bienvenido a Despega"
**URL**: `/despega/onboarding?step=intro`

**Lo que ve**:
- Título: "Hola, bienvenido a Despega"
- Subtítulo: "Tu Transformación de 90 Días Comienza Ahora"
- Descripción del programa
- Botón: "Cuando estés listo, comienza"

**Duración**: ~30 segundos de lectura

**Siguiente**: Apunta a C1

---

### 3. CONOZCÁMONOS 1 (C1) - Contexto Personal
**URL**: `/despega/onboarding?step=conozcamonos1`

**Las 7 preguntas**:
1. ¿Cuál es tu situación laboral actual?
2. ¿Cuántos años de experiencia laboral tienes?
3. ¿Qué es lo que más te desafía en tu carrera hoy?
4. ¿Cuál es tu objetivo principal para los próximos 3 meses?
5. ¿En qué áreas te gustaría mejorar?
6. ¿Qué recursos necesitas para crecer?
7. ¿Cuál es tu visión de éxito a largo plazo?

**Progreso**: Barra 0-100% que avanza con cada pregunta

**Duración**: ~2-3 minutos

**Siguiente**: Apunta a Instructions (Explicación DISC)

---

### 4. INSTRUCTIONS - "Qué es Despega Cerebral"
**URL**: `/despega/onboarding?step=instructions`

**Lo que aprende Travis**:
- **¿Qué es DISC?** Modelo de comportamiento con 4 perfiles
- **Los 4 Perfiles**:
  - **D (Dominante)**: Decisivo, orientado a resultados, líder
  - **I (Influyente)**: Comunicativo, entusiasta, colaborador
  - **S (Estable)**: Leal, paciente, confiable
  - **C (Cuidadoso)**: Analítico, detallista, meticuloso

- **¿Por qué importa?**: Entender su forma natural de actuar → mejor rendimiento
- **Cómo funciona**: Responde 28 preguntas honestas → recibe diagnóstico

**Visual**: 
- Cards explicativas para cada perfil
- Ejemplos de personas en cada perfil
- Ícono visual (colores) para cada uno

**Duración**: ~3-4 minutos de lectura

**Botón**: "Entiendo, Comenzar Mi Test"

**Siguiente**: Apunta a Test A1

---

### 5. TEST A1 - "Despega Cerebral Assessment"
**URL**: `/despega/onboarding?step=test`

**Lo que sucede**:
- 28 preguntas sobre comportamiento
- Cada pregunta tiene 2 opciones: "Más" o "Menos"
- Ejemplo: "Tiendo a tomar decisiones rápidamente"
  - Opción 1: "Más" (+2 puntos a D o I)
  - Opción 2: "Menos" (-1 punto)

**Formato**:
- Una pregunta por pantalla
- Progreso: Pregunta X de 28
- Barra visual 0-100%

**Duración**: ~3-4 minutos

**Scoring automático**: 
- Al completar la pregunta 28, calcula scores DISC automáticamente
- Identifica perfil dominante y secundario

**Siguiente**: Automáticamente a Results

---

### 6. RESULTS - "Tu Perfil DISC"
**URL**: `/despega/onboarding?step=results`

**Lo que ve Travis**:

```
┌─────────────────────────────────────────┐
│  Tu Perfil: DOMINANTE (D)              │
│  Puntuaciones:                          │
│  D: 78/100  I: 45/100  S: 32/100 C: 55/100 │
│                                          │
│  Dominante + Analítico (D/C)            │
│  Tu forma natural de actuar              │
└─────────────────────────────────────────┘
```

**Explicación personalizada**:
- "Como D: Eres decisivo y orientado a resultados"
- "Tu secundario C te hace analítico y cuidadoso"
- "Tu combinación es: Liderazgo estratégico"

**Fortalezas según su perfil**:
- Toma decisiones con velocidad
- Ve el panorama completo
- Motiva equipos

**Desafíos**:
- Puede parecer impulsivo
- Puede perder detalles importantes

**Botón**: "Continuar a Conozcámonos 2"

**Siguiente**: Apunta a C2-Paso1

---

### 7. CONOZCÁMONOS 2 - PASO 1 (9 preguntas)
**URL**: `/despega/onboarding?step=conozcamonos2-paso1`

**Las 9 preguntas de Contexto de Ejecución**:
1. ¿Cuánto tiempo disponible tienes diariamente?
2. ¿Cuál es tu meta principal en 30 días?
3. Nivel de energía actual (1-10)
4. Duración ideal de sesiones de trabajo
5. ¿Trabajas mejor solo o en equipo?
6. Obstáculos principales (máx 3)
7. ¿Tienes compromisos no-negociables?
8. Ambiente de trabajo preferido
9. ¿Necesitas supervisión/accountability?

**Progreso**: Barra 0-100%

**Duración**: ~2-3 minutos

**Botón en pregunta 9**: "Continuar"

**Siguiente**: Apunta a C2-Paso2

---

### 8. CONOZCÁMONOS 2 - PASO 2 (5 preguntas)
**URL**: `/despega/onboarding?step=conozcamonos2-paso2`

**Las 5 preguntas de Objetivos 30/60/90**:
1. Tu meta prioritaria en 30 días
2. ¿Qué necesitas lograr en 60 días?
3. Tu visión para 90 días
4. Métrica o indicador de éxito
5. ¿Qué apoyo/recurso necesitas?

**Progreso**: Barra 0-100%

**Duración**: ~2-3 minutos

**Botón en pregunta 5**: "Completar y Generar Ruta"

**Lo que sucede al hacer click**:

1. ✅ Se guardan las respuestas en BD
2. ✅ Se llama endpoint `/api/despega/canon-generate-route`
3. ✅ Motor CANON genera 15-20 acciones personalizadas basadas en:
   - Perfil DISC (de A1)
   - Contexto personal (de C1)
   - Ambiente de ejecución (de C2-Paso1)
   - Objetivos 30/60/90 (de C2-Paso2)
4. ✅ Se guarda ruta en tabla `canon_generated_routes`
5. ✅ Se espera 1 segundo para persistencia de datos
6. ✅ Se muestra pantalla: "¡Excelente! Tu ruta personalizada se está generando..."
7. ✅ Se redirija a `/despega` (Dashboard)

**Siguiente**: Automático a Dashboard

---

### 9. DASHBOARD - "Tu Ruta de 90 Días"
**URL**: `/despega`

**Lo que ve Travis**:

```
┌─────────────────────────────────────────┐
│ Hola, Travis! 👋                        │
│ Tu Transformación de 90 Días Comienza   │
│                                          │
│ PUNTOS TOTALES: 59                      │
│ TU RANKING: #- (De todos los usuarios)   │
│ PROGRESO TOTAL: 3%                       │
│ TU NIVEL: - (Detectado en A1)            │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ RUTA GENERADA                       │ │
│ │                                      │ │
│ │ ✓ Test A1 completado (Perfil DISC) │ │
│ │ → C1 y C2 completados               │ │
│ │ ◆ RESULTADO: Ruta personalizada     │ │
│ │                                      │ │
│ │ Tiempo estimado: 3 minutos          │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ [VER MI RUTA DE 30/60/90 DÍAS] →        │
└─────────────────────────────────────────┘
```

**Secciones disponibles**:
1. **Tu Ruta de 90 Días**: Misiones personalizadas
2. **Tu Dirección Clara**: A2 (Rutas personalizadas)
3. **Tu Aterrizaje**: A3 (Entrenamientos)
4. **Tu Contexto**: A4 (Noticias personalizadas)

**Duración total del flujo**: ~15-20 minutos

---

## Información Guardada en BD

### Tablas Pobladas:

1. **despega_user_profiles**
   - user_id, perfil_disc, scores D/I/S/C

2. **canon_conozcamonos_1_responses**
   - Respuestas a 7 preguntas de C1

3. **canon_conozcamonos_2_responses (Paso 1)**
   - Respuestas a 9 preguntas de contexto

4. **canon_conozcamonos_2_responses (Paso 2)**
   - Respuestas a 5 preguntas de objetivos

5. **a1_tests_results**
   - Scores DISC, perfil dominante, resultados completos

6. **canon_generated_routes**
   - Ruta personalizada con 15-20 acciones
   - Trazabilidad: qué pregunta generó cada acción

---

## Validaciones en Cada Paso

✅ C1: Todas las respuestas texto sanitizadas
✅ A1: Scores validados 0-100
✅ C2-Paso1: Respuestas únicas por usuario
✅ C2-Paso2: Generación no permite duplicados
✅ Ruta: Incluye solo acciones viables según DISC + objetivos

---

## Flujo de Datos (Architecture)

```
User Responses
      ↓
  Validación
      ↓
  Guardado BD
      ↓
  Motor CANON (Reglas)
      ↓
  Generación Ruta
      ↓
  Dashboard Actualizado
```

---

## Próximos Pasos Después del Onboarding

Una vez en el dashboard, Travis puede:

1. **Ver su ruta completa** → `/despega/a2/dashboard`
2. **Explorar misiones diarias** → `/despega/a2/camino`
3. **Ver su plan 90 días** → `/despega/a2/mision-90-dias`
4. **Recibir coaching personalizado** → `/despega/a2/coach`
5. **Ver sus sprints semanales** → `/despega/a2/sprint-1`

---

## Resumen

**Todo el flujo está diseñado para**:
1. Capturar contexto inicial (C1)
2. Evaluar perfil de comportamiento (A1 DISC)
3. Entender objetivos y constraints (C2)
4. Generar ruta 100% personalizada (Motor CANON)
5. Comenzar ejecución inmediatamente (Dashboard)

**Tiempo total**: 15-20 minutos desde login hasta tener ruta lista

**Estado**: ✅ COMPLETO Y FUNCIONAL
