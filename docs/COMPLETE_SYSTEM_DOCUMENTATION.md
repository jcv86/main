# DESPEGA SYSTEM ARCHITECTURE - COMPLETE DOCUMENTATION

## OVERVIEW
Sistema completo de ciclo de desarrollo profesional con 5 etapas (C1, A1, A2, A3, A4) integrando validación OpenAI, persistencia en base de datos Supabase, y generación de rutas personalizadas.

---

## CICLO COMPLETO: C1 → A4

### ETAPA 1: C1 (Conozcamonos 1)
**URL**: `/despega/conozcamonos-1`
**Tipo**: Formulario Multi-Step
**Propósito**: Recolectar información inicial del usuario

**Preguntas**:
- Preguntas abiertas de texto con validación OpenAI
- Preguntas de selección múltiple
- Duración: 3-5 preguntas

**Validación**:
- Endpoint: `POST /api/conozcamonos/validate-response`
- Validaciones:
  1. No puede estar vacío
  2. Mínimo 10 caracteres, 2+ palabras
  3. OpenAI `gpt-4o-mini` detecta si es spam/gibberish
  4. Rechaza: "asdasdasd", "xsadasfasfasfa afa sfas"
  5. Acepta: Respuestas coherentes y reflexionadas

**Guardado en BD**:
- Tabla: `canon_conozcamonos_1_responses`
- Campos: `user_id`, `responses` (JSON), `created_at`
- Flag en `despega_user_profiles`: `onboarding_conozcamonos_1_completed = true`

**Redirección**: → `/despega/a1-cerebral-intro`

---

### ETAPA 2A: A1-Intro (Introducción)
**URL**: `/despega/a1-cerebral-intro`
**Tipo**: Página educativa (sin formulario)
**Propósito**: Explicar qué es el test DISC

**Contenido**:
- Explicación del método DISC
- Preparación para el test
- Botón "Continuar con Test"

**Guardado**:
- Flag: `a1_cerebral_intro_seen = true`

**Redirección**: → `/despega/a1-cerebral`

---

### ETAPA 2B: A1-Cerebral (Test DISC)
**URL**: `/despega/a1-cerebral`
**Tipo**: Test interactivo de 28 preguntas
**Propósito**: Calcular perfil DISC del usuario

**Estructura del Test**:
- 28 preguntas
- Cada pregunta: 2 opciones (MÁS / MENOS)
- Usuario selecciona UNA opción para MÁS, UNA para MENOS
- No pueden ser la misma opción

**Validación Cliente-Side**:
- Requiere ambas selecciones (MÁS y MENOS)
- Rechaza si MÁS = MENOS
- Calcula score en tiempo real

**Cálculo DISC**:
- Energía: Suma de características extrovertidas
- Enfoque: Suma de características orientadas a tareas
- Relaciones: Suma de características sociales
- Plan Ejecutivo: Suma de características estructuradas
- Perfiles: Impulsor, Catalizador, Estabilizador, Arquitecto

**Guardado en BD**:
- Tabla 1: `canon_cerebral_responses` → Respuestas brutas
- Tabla 2: `despega_disc_profiles` → Perfil calculado
- Campos DISC: `energia`, `enfoque`, `relaciones`, `plan_ejecutivo`
- Primary/Secondary: `primary` (score más alto), `secondary` (segundo)

**Redirección**: → `/despega/a1-report`

---

### ETAPA 2C: A1-Report (Reporte DISC)
**URL**: `/despega/a1-report`
**Tipo**: Dashboard de resultados
**Propósito**: Mostrar perfil DISC y recomendaciones

**Mostrado**:
- Perfil DISC principal
- Gráfico radial con 4 dimensiones
- Recomendaciones personalizadas
- Patrones de comportamiento
- Botones: "Ir a Patrones" y "Ir a A2: Ruta"

**Redirección**: → `/despega/conozcamonos-2` o `/despega/a2-routes`

---

### ETAPA 3: A2 (Conozcamonos 2 - Tu Ruta)
**URL**: `/despega/conozcamonos-2`
**Tipo**: Formulario 2 Pasos
**Propósito**: Definir objetivo, estrategia y preferencias

**PASO 1: 3 Preguntas**
```
1. "¿Cuál es tu objetivo profesional principal?"
   - Tipo: Texto abierto
   - Validación: OpenAI (mínimo 10 chars, 2 palabras, coherencia)

2. "¿Qué sector o industria te interesa?"
   - Tipo: Dropdown (Marketing, Finanzas, Tech, etc.)
   - Validación: Obligatorio

3. "¿Qué rol específico buscas?"
   - Tipo: Texto abierto
   - Validación: OpenAI (coherencia)
```

**PASO 2: 5 Preguntas**
```
1. "¿Cuáles son las principales barreras/limitaciones?"
   - Tipo: MultiCheck (Tiempo, Dinero, Conocimiento, Experiencia)

2. "¿Cuáles son las principales habilidades que necesitas desarrollar?"
   - Tipo: MultiCheck (Liderazgo, Comunicación, Técnicas, etc.)

3. "¿Cuántas horas por semana disponibles?"
   - Tipo: Slider (5-20 horas)

4. "Preferencia de aprendizaje"
   - Tipo: Check multiple

5. "Disponibilidad horaria"
   - Tipo: Check multiple
```

**Validación OpenAI**:
- Evento: `onBlur` al salir del campo
- Endpoint: `POST /api/conozcamonos/validate-response`
- Valida:
  1. No vacío
  2. Mínimo 10 caracteres, 2 palabras
  3. OpenAI detecta gibberish/spam
- UI Feedback:
  - Campo ROJO si hay error
  - Mensaje de error prominente con ⚠️
  - Contador de caracteres visible
  - Botón "Siguiente" deshabilitado si hay error
  - Tooltip en botón explica por qué está deshabilitado

**Guardado en BD**:
- Tabla: `canon_conozcamonos_2_responses`
- Campos: `objective`, `sector`, `role`, `barriers`, `skills`, `time_per_week`, etc.

**Redirección**: → `/despega/a2-routes`

---

### ETAPA 4: A2-Routes (Tu Ruta de 90 Días)
**URL**: `/despega/a2-routes`
**Tipo**: Dashboard generado por IA
**Propósito**: Mostrar ruta personalizada de 90 días

**Generación IA**:
- Función: `generatePersonalizedRoute()` en `/lib/route-generator.ts`
- Entrada: DISC profile, objetivo, skills, horas/semana
- Modelo: OpenAI `gpt-4o-mini`
- Output: Estructura completa de 90 días

**Estructura de Ruta**:
```
Mes 1: Fundamentos (30 días)
├── Día 1: Tarea 1 (30 min) - 📚 Learning
├── Día 2: Tarea 2 (45 min) - 🛠️ Practice
├── Día 3: Tarea 3 (60 min) - 🤝 Networking
├── ...
└── Día 30: Milestone 1 (120 min) - 🏆 Milestone

Mes 2: Aceleración (30 días)
├── Tareas de nivel intermedio
└── ...

Mes 3: Dominio (30 días)
├── Tareas avanzadas
└── ...
```

**Cada Tarea Contiene**:
- `day`: Número de día (1-90)
- `title`: Título descriptivo
- `description`: Descripción detallada
- `type`: Tipo (learning, practice, networking, planning, milestone)
- `timeEstimate`: Minutos estimados
- `resources`: Array de recursos recomendados
- `icon`: Emoji representativo

**Guardado en BD**:
- Tabla: `a2_rutas_personalizadas`
- Campos:
  - `user_id`: Usuario propietario
  - `ruta_30_dias`: JSON array con 30 tareas
  - `ruta_60_dias`: JSON array con 30 tareas
  - `ruta_90_dias`: JSON array con 30 tareas
  - `focos_priorizados`: Array de skills del usuario
  - `orden_avance`: { objective, timePerWeek, DISC profile }
  - `ruta_activa`: '30 days' (default)

**UI Interactivo**:
- 3 tarjetas expandibles (Mes 1, Mes 2, Mes 3)
- Cada tarjeta muestra:
  - Nombre del mes (Fundamentos, Aceleración, Dominio)
  - Rango de días (1-30, 31-60, 61-90)
  - Botón expandir/contraer
  - Al expandir: Lista completa de tareas con todos los detalles

**Redirección**: → `/despega/a3-dashboard`

---

### ETAPA 5A: A3-Dashboard (Impulso)
**URL**: `/despega/a3-dashboard`
**Tipo**: Progress tracking dashboard
**Propósito**: Seguimiento de preparación para entrevistas

**Componentes**:
1. Interview 0: Entrevista de diagnóstico inicial
2. CV Preparation: Preparación de CV
3. Market Insights: Análisis de mercado
4. Interview Simulations: Simulaciones de entrevista

**Redirección**: → `/despega/a4`

---

### ETAPA 5B: A4 (La Realidad)
**URL**: `/despega/a4`
**Tipo**: Hub dashboard final
**Propósito**: Vista completa del progreso

**Tabs**:
- Progreso general
- Resultados finales
- Recomendaciones

**Redirección**: → `/despega/dashboard` (Hub principal)

---

## BASE DE DATOS - TABLAS PRINCIPALES

### canon_conozcamonos_1_responses
```
id: UUID
user_id: UUID (FK)
responses: JSONB
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### canon_cerebral_responses
```
id: UUID
user_id: UUID (FK)
responses: JSONB (respuestas del test)
created_at: TIMESTAMP
```

### despega_disc_profiles
```
id: UUID
user_id: UUID (FK)
energia: INT
enfoque: INT
relaciones: INT
plan_ejecutivo: INT
primary: VARCHAR
primaryScore: INT
secondary: VARCHAR
secondaryScore: INT
created_at: TIMESTAMP
```

### canon_conozcamonos_2_responses
```
id: UUID
user_id: UUID (FK)
objective: TEXT
sector: VARCHAR
role: TEXT
barriers: JSONB (array)
skills: JSONB (array)
time_per_week: INT
preferences: JSONB
created_at: TIMESTAMP
```

### a2_rutas_personalizadas
```
id: UUID
user_id: UUID (FK)
ruta_30_dias: JSONB (30 tareas)
ruta_60_dias: JSONB (30 tareas)
ruta_90_dias: JSONB (30 tareas)
focos_priorizados: JSONB (array de skills)
orden_avance: JSONB (objetivo, tiempo, DISC)
ruta_activa: VARCHAR ('30 days', '60 days', '90 days')
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### despega_user_profiles
```
id: UUID
user_id: UUID (FK)
onboarding_conozcamonos_1_completed: BOOLEAN
a1_cerebral_intro_seen: BOOLEAN
a1_cerebral_completed: BOOLEAN
a1_report_seen: BOOLEAN
a2_conozcamonos_completed: BOOLEAN
a2_routes_generated: BOOLEAN
a3_started: BOOLEAN
a4_started: BOOLEAN
```

---

## API ENDPOINTS

### Validación (OpenAI)
```
POST /api/conozcamonos/validate-response
Body: {
  questionId: number,
  question: string,
  response: string,
  questionType: 'text'
}
Response: {
  valid: boolean,
  message: string,
  suggestions?: string,
  errors?: string[]
}
```

### Generación de Ruta
```
POST /api/a2-routes/generate
Body: {
  discProfile: DespegarProfile,
  objective: string,
  skills: string[],
  timePerWeek: number
}
Response: {
  route: PersonalizedRoute,
  success: boolean,
  routeId: UUID
}
```

---

## VALIDACIÓN Y SEGURIDAD

### OpenAI Validation (todos los campos de texto)
- Modelo: `gpt-4o-mini`
- Temperatura: 0.3-0.5 (determinístico)
- Rechaza:
  - Texto vacío
  - < 10 caracteres o < 2 palabras
  - Gibberish/keyboard mashing: "asdasdasd", "xsadasfasfasfa"
  - Respuestas incoherentes
- Acepta:
  - Respuestas reflexionadas
  - Incluso si tienen faltas de ortografía
  - Intención genuina de responder

### Error Handling
- Client-side: Muestra error inmediato, desactiva botón
- Server-side: Valida independientemente
- Fallback: Si OpenAI falla, acepta respuesta (no bloquea user)
- Logging: Completo para debugging

---

## FLUJO DE DATOS GENERAL

```
Usuario Entra
    ↓
C1: Recolecta info inicial
    ↓ (Validación OpenAI)
A1-Intro: Educación
    ↓
A1-Cerebral: Test DISC (28 Q)
    ↓ (Calcula DISC profile)
A1-Report: Muestra perfil
    ↓
A2: Define objetivo y estrategia
    ↓ (Validación OpenAI cada campo)
A2-Routes: Genera ruta 90 días con IA
    ↓ (OpenAI gpt-4o-mini)
A3-Dashboard: Seguimiento
    ↓
A4: Vista final
    ↓
Dashboard Principal: Resumen completo
```

---

## TECNOLOGÍAS UTILIZADAS

- **Frontend**: Next.js 16 + React 19
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API (gpt-4o-mini)
- **Validation**: Zod, custom regex patterns
- **Styling**: Tailwind CSS + Dark mode
- **State**: React hooks + SWR

---

## STATUS FINAL

✅ Ciclo C1-A4 completamente funcional
✅ Validación OpenAI en C1 y A2
✅ Generación de rutas con IA
✅ Persistencia de datos en BD
✅ Error handling robusto
✅ UI feedback claro y visual
✅ Redirecciones correctas
✅ Listo para producción
