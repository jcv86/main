# PLAN: Conexiones de Sistemas Post-Onboarding

## Visión General
Cuando un usuario **completa el onboarding (A1 Test DISC)**, necesitamos conectar los 4 pilares (A1→A2→A3→A4) para que funcionen como un sistema coherente de transformación de 90 días.

---

## 1. FLUJO POST-ONBOARDING (Después de completar A1)

```
Usuario completa A1 (Test DISC)
    ↓
Dashboard muestra resultado + próximo paso
    ↓
Usuario elige Camino Persona O Camino Profesional (A2)
    ↓
Se crea misión 90 días personalizada
    ↓
A2 genera Sprints basados en resultado DISC
    ↓
A3 entrenamientos se adaptan al patrón
    ↓
A4 noticias/contexto se personalizan
    ↓
Coach (Sofía/Dani) tiene conversación inicial
    ↓
Dashboard personalizado activado
```

---

## 2. CONEXIONES ESPECÍFICAS POR SISTEMA

### A. CONEXIÓN A1 → A2 (Diagnóstico → Rutas)

**Qué datos usa A2 de A1:**
- `a1_results.nivel_detectado` (Rojo/Naranja/Verde/Azul/Otros)
- `a1_results.score_energia` (0-100)
- `a1_results.score_enfoque` (0-100)
- `a1_results.score_relaciones` (0-100)
- `a1_results.score_plan_ejecutivo` (0-100)

**Cómo usarlo:**
```typescript
// En /app/despega/a2/camino/page.tsx
const a1Results = profile?.a1_results

// Recomendaciones personalizadas
if (a1Results.nivel_detectado === "Azul") {
  return <CaminoAzul /> // Enfoque en relaciones
} else if (a1Results.nivel_detectado === "Rojo") {
  return <CaminoRojo /> // Enfoque en dirección
}
```

**Tabla a actualizar:** `despega_user_profiles`
```sql
UPDATE despega_user_profiles 
SET camino_persona_active = true,
    camino_profesional_active = false,
    a2_mission_id = ${newMissionId},
    a2_started_at = now()
WHERE user_id = ${userId}
```

---

### B. CONEXIÓN A2 → A3 (Rutas → Entrenamientos)

**Qué datos crea A2 para A3:**
- `despega_a2_missions` - Misión de 90 días
  - `mission_id`
  - `user_id`
  - `camino_persona / camino_profesional`
  - `objetivo_principal`
  - `descripcion_exito`

- `despega_a2_sprints` - Sprints de 30 días
  - `sprint_id`
  - `mission_id`
  - `sprint_number` (1, 2, 3)
  - `tema_principal`
  - `objetivos_sprint`

- `despega_a2_semanas` - Semanas dentro de sprint
  - `semana_number` (1-4)
  - `tema_semanal`
  - `desafio_semanal`

**Cómo A3 usa esto:**
```typescript
// En /app/despega/a3/entrenamientos/page.tsx
const mission = await getMission(userId)
const currentSprint = mission.sprints[0] // Sprint actual

// Los entrenamientos se personalizan al tema del sprint
const trainings = await getTrainingsForTopic(currentSprint.tema_principal)
```

**Tabla a crear:** `despega_a3_training_assignments`
```sql
INSERT INTO despega_a3_training_assignments
  (user_id, training_id, sprint_id, semana, prioridad, fecha_asignada)
VALUES
  (${userId}, ${trainingId}, ${sprintId}, 1, 'alta', now())
```

---

### C. CONEXIÓN A3 → A4 (Entrenamientos → Contexto)

**Qué datos crea A3 para A4:**
- Tópicos de entrenamiento:
  - "Liderazgo" → A4 filtra noticias sobre liderazgo
  - "Emprendimiento" → A4 filtra noticias sobre startups
  - "Comunicación" → A4 filtra noticias sobre soft skills

**Cómo A4 se personaliza:**
```typescript
// En /app/despega/a4/noticias/page.tsx
const trainingFocus = await getCurrentTrainingTopic(userId)
// trainingFocus = "Liderazgo"

// NewsAPI query se personalizaba
const newsQuery = `liderazgo profesional ${trainningFocus}`
```

**Tabla a usar:** `despega_a4_personalized_feeds`
```sql
INSERT INTO despega_a4_personalized_feeds
  (user_id, topic, priority, updated_at)
VALUES
  (${userId}, 'Liderazgo', 1, now())
```

---

### D. CONEXIÓN COACH (Sofia/Dani) CON TODO

**El Coach sabe:**
1. **De A1**: Patrón DISC del usuario
2. **De A2**: Misión y sprint actual
3. **De A3**: Entrenamiento en progreso
4. **De A4**: Noticias recientes que lee

**Prompts dinámicos del Coach:**
```typescript
// En /lib/coach-prompts.ts

export function getCoachContext(user, profile, currentMission, currentTraining) {
  return `
    El usuario ${user.name} es tipo ${profile.a1_results.nivel_detectado}.
    Está en su misión: ${currentMission.objetivo_principal}
    Sprint actual: ${currentMission.currentSprint.tema_principal}
    Entrenamiento: ${currentTraining.nombre}
    
    Usa este contexto para personalizar tus respuestas.
    - Si pregunta sobre rutas, conecta con su misión
    - Si pregunta sobre entrenamientos, conecta con su sprint
    - Si pregunta sobre noticias, conecta con su patrón DISC
  `
}
```

---

## 3. FLUJO TÉCNICO: POST-ONBOARDING

### Step 1: Usuario completa A1
```
POST /api/despega/save-test-results
├─ Guarda a1_results en DB
├─ Crea user_profile si no existe
└─ Redirige a /despega/a2/intro
```

### Step 2: Usuario entra a A2 (Elije Camino)
```
GET /despega/a2/camino
├─ Lee a1_results de profile
├─ Muestra recomendaciones personalizadas
└─ Usuario elige Persona O Profesional
```

### Step 3: Se crea misión A2
```
POST /api/despega/create-mission
├─ Recibe: userId, camino_elegido, objetivo
├─ Crea mission en DB
├─ Crea 3 sprints automáticos
├─ Crea 12 semanas (4 semanas × 3 sprints)
└─ Retorna mission_id
```

### Step 4: A3 entrenamientos se asignan
```
POST /api/despega/assign-trainings
├─ Lee mission_id y tema del sprint
├─ Busca entrenamientos relacionados
├─ Asigna automáticamente (máx 3 por semana)
└─ Actualiza training_assignments en DB
```

### Step 5: A4 se personaliza
```
POST /api/despega/personalize-a4
├─ Lee tema del sprint
├─ Lee patrón DISC del usuario
├─ Crea personalized_feeds record
├─ NewsAPI query se ajusta automáticamente
└─ News ticker muestra solo lo relevante
```

### Step 6: Coach se inicializa
```
CoachProvider en /app/despega/layout.tsx
├─ Lee profile (A1 + A2 + A3 data)
├─ Construye system_prompt dinámico
├─ Guarda en context
└─ CoachSidebar puede usar en conversaciones
```

---

## 4. TABLAS QUE NECESITAMOS / YA EXISTEN

### Existentes ✅
- `despega_user_profiles` - Datos de usuario
- `despega_a1_results` - Resultados DISC
- `despega_a2_missions` - Misiones 90 días
- `despega_a2_sprints` - Sprints
- `despega_a2_semanas` - Semanas
- `despega_a2_user_daily_actions` - Acciones diarias completadas
- `despega_a3_trainings` - Entrenamientos
- `despega_a4_biblioteca` - Noticias/recursos

### Por crear 🆕
```sql
-- Tracking de asignaciones de A3 a usuario
CREATE TABLE despega_a3_training_assignments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  training_id UUID REFERENCES despega_a3_trainings,
  mission_id UUID REFERENCES despega_a2_missions,
  sprint_id UUID REFERENCES despega_a2_sprints,
  semana_number INT,
  prioridad VARCHAR (alta/media/baja),
  fecha_asignada TIMESTAMP,
  fecha_completada TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
)

-- Feeds personalizados de A4
CREATE TABLE despega_a4_personalized_feeds (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  topic VARCHAR,
  priority INT,
  updated_at TIMESTAMP
)

-- Coach context por usuario
CREATE TABLE despega_coach_context (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  a1_pattern VARCHAR,
  a2_mission_id UUID,
  a3_current_training_id UUID,
  a4_focus_topics JSONB,
  last_updated TIMESTAMP
)
```

---

## 5. ENDPOINTS QUE NECESITAMOS

### Existentes ✅
- `POST /api/despega/save-test-results` - Guarda A1
- `POST /api/despega/create-mission` - Crea A2 mission
- `GET /api/despega/a4-news-feed` - Obtiene noticias

### Por crear 🆕
```
POST /api/despega/assign-trainings
├─ Input: { userId, missionId }
├─ Output: { assignedTrainings: [] }
└─ Asigna entrenamientos basados en sprint

POST /api/despega/personalize-a4
├─ Input: { userId, missionId }
├─ Output: { personalizedTopics: [] }
└─ Crea feeds personalizados

GET /api/despega/coach-context/{userId}
├─ Output: { context: {...} }
└─ Retorna contexto completo para coach

POST /api/despega/update-coach-context
├─ Input: { userId, a1Pattern, a2MissionId, ... }
├─ Output: { success: true }
└─ Actualiza contexto del coach
```

---

## 6. COMPONENTES QUE NECESITAN ACTUALIZACIÓN

### A1 → A2
- `app/despega/page.tsx` - Dashboard principal
  - Mostrar botón "Ir a A2" después de A1 completo
  - Mostrar recomendaciones personalizadas

### A2 → A3
- `app/despega/a2/camino/page.tsx` - Elección de camino
  - Trigger: `POST /api/despega/create-mission`
  - Guardar mission_id en profile
  
- `app/despega/a3/entrenamientos/page.tsx` - Lista de entrenamientos
  - Trigger: `POST /api/despega/assign-trainings`
  - Mostrar solo entrenamientos asignados

### A3 → A4
- `app/despega/a4/layout.tsx` - Personalization
  - Trigger: `POST /api/despega/personalize-a4`
  - Actualizar news ticker con tópicos personalizados

### Coach
- `contexts/coach-context.tsx` - Coach initialization
  - Trigger: `GET /api/despega/coach-context`
  - Construir system_prompt dinámico
  - Actualizar cuando cambia misión/entrenamiento

---

## 7. ORDEN DE IMPLEMENTACIÓN

1. ✅ **Crear tablas en Supabase**
   - `despega_a3_training_assignments`
   - `despega_a4_personalized_feeds`
   - `despega_coach_context`

2. 🔄 **Crear endpoints**
   - `/api/despega/assign-trainings`
   - `/api/despega/personalize-a4`
   - `/api/despega/coach-context`
   - `/api/despega/update-coach-context`

3. 🔄 **Actualizar componentes A2**
   - Trigger assign-trainings después de elegir camino
   - Mostrar entrenamientos asignados

4. 🔄 **Actualizar componentes A3**
   - Mostrar solo entrenamientos asignados
   - Trigger personalize-a4 cuando inicia sprint

5. 🔄 **Actualizar Coach**
   - Usar coach-context en system_prompt
   - Actualizar cuando cambia misión/entrenamiento

6. 🔄 **Dashboard A4**
   - News ticker personalizado por tópico
   - Tests personalizados por tema del sprint

---

## 8. DIAGRAMA DE FLUJO COMPLETO

```
Dashboard A1 (Test DISC)
    ↓ [Completa test]
    ↓
Dashboard Despega
    ├─ Muestra A1 results
    ├─ Botón "Activa tu Camino" → A2 Intro
    ↓
A2 Intro → Elige Camino (Persona vs Profesional)
    ↓ [Elige camino]
    ↓ [API] create-mission → Crea A2 mission + 3 sprints
    ↓
A2 Camino - Misión 90 días
    ├─ Sprint 1 (Days 1-30)
    │   ├─ Semana 1-4
    │   └─ Tema: "Autoconocimiento"
    ├─ Sprint 2 (Days 31-60)
    │   ├─ Semana 5-8
    │   └─ Tema: "Acción"
    ├─ Sprint 3 (Days 61-90)
    │   ├─ Semana 9-12
    │   └─ Tema: "Integración"
    ↓
A3 Entrenamientos - Se asignan automáticamente
    ├─ [API] assign-trainings
    ├─ Lee sprint actual: "Autoconocimiento"
    ├─ Busca trainings relacionados
    └─ Asigna max 3 por semana
    ↓
A4 Contexto - Se personaliza
    ├─ [API] personalize-a4
    ├─ Lee tema del sprint
    ├─ Lee patrón DISC
    ├─ Crea feeds personalizados
    └─ Noticias se filtran automáticamente
    ↓
Coach (Sofia/Dani)
    ├─ Lee: A1 pattern, A2 mission, A3 training, A4 topics
    ├─ [API] coach-context
    ├─ Construye system_prompt dinámico
    └─ Conversa con contexto completo

Resultado:
✅ Usuario ve sistema COHERENTE
✅ Cada pillar conectado al anterior
✅ Progreso personalizado
✅ Coach con contexto real
```

---

## 9. EJEMPLO REAL: Usuario "Maria"

```
1. Maria completa A1 → Resultado: AZUL (Relaciones)

2. Dashboard muestra:
   "Maria, eres AZUL - El camino para ti"
   - Enfoque en conexiones humanas
   - Desarrollo de equipos
   - Liderazgo empático

3. Maria elige: Camino Profesional

4. Se crea:
   - Mission: "Liderar con empatía"
   - Sprint 1: "Comprenderme a mi mismo como líder"
   - Sprint 2: "Crear equipos de alto desempeño"
   - Sprint 3: "Impacto sostenible"

5. A3 asigna entrenamientos:
   - Week 1: "Inteligencia emocional" (2h)
   - Week 1: "Test DISC aplicado" (1h)
   - Week 1: "Escucha activa" (1h)

6. A4 personaliza:
   - Noticias sobre: liderazgo, management, recursos humanos
   - No muestra: trading de acciones, startups técnicas

7. Coach Sofia dice:
   "Vi que eres azul y estás en sprint de autoconocimiento.
    ¿Qué significa para ti ser un 'líder empático'?
    Podemos conectar esto con tus entrenamientos esta semana."

✅ Todo conectado, todo coherente, todo personalizado.
```

---

## 10. RESUMEN DE CONEXIONES

| De | A | Datos | API | Resultado |
|---|---|---|---|---|
| A1 | Dashboard | DISC pattern | - | Mostrar recomendaciones |
| A1 | A2 | DISC pattern | create-mission | Misión personalizada |
| A2 | A3 | Sprint tema | assign-trainings | Entrenamientos personalizados |
| A3 | A4 | Training topic | personalize-a4 | Noticias personalizadas |
| Todo | Coach | A1+A2+A3+A4 | coach-context | Sistema coherente |

---

## 11. PRÓXIMOS PASOS

1. ✅ Leer este plan
2. 🔄 Crear las 3 nuevas tablas en Supabase
3. 🔄 Crear los 4 nuevos endpoints
4. 🔄 Actualizar componentes A2, A3, A4
5. 🔄 Actualizar Coach context
6. 🔄 Testing end-to-end con un usuario de prueba
7. ✅ Deployment a producción

---

**Estado**: PLAN COMPLETO - LISTO PARA IMPLEMENTACIÓN
**Última actualización**: 2026-02-18
