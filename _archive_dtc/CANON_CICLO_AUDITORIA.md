# AUDITORÍA COMPLETA DEL CICLO CANON v1.1

## 1. ENTRADA AL SISTEMA

### Punto de Entrada: `/despega/onboarding`
- Usuario accede a `/despega/onboarding/page.tsx`
- **Check 1**: Se verifica si usuario ya completó el test buscando en `a1_tests_results`
- Si ya completó: `onboardingAlreadyCompleted = true`
- Si NO completó: `onboardingAlreadyCompleted = false` (primera vez)

---

## 2. FLUJO DE PASOS (Step State Machine)

### PASO 1: "intro"
- Pantalla inicial con descripción de Despega Cerebral
- CTA: "Cuando estés listo, comienza"
- **Transición**: setStep("instructions")

### PASO 2: "instructions"
- Instrucciones del test (28 preguntas)
- Duración estimada: 3 minutos
- CTA: "Comenzar Test"
- **Transición**: setStep("test")

### PASO 3: "test"
- 28 preguntas A1 INMUTABLES (DISC: Dominancia, Influencia, Estabilidad, Conciencia)
- Cada pregunta: usuario selecciona MÁS y MENOS
- Captura en estado: `responses[questionId] = { mas: 'D', menos: 'I' }`
- Progreso visible en barra
- **Transición**: Al llegar a pregunta 28, siguiente llama a `calculateResults()`

### PASO 4: "results" (TEMPORAL - NO MOSTRADO EN PRIMERA VEZ)
- En primera completación: `isFirstCompletion = true` → **SALTAR DIRECTO A CONOZCÁMONOS 2**
- En reintentos: Mostrar "Ver mi resultado" y "Repetir test"
- **Transición (Primera vez)**: setStep("conozcamonos2-paso1")

---

## 3. MOTOR DE CÁLCULO (calculateResults)

### Scores de A1:
```
Para cada pregunta:
  - Respuesta MÁS: +2 puntos a esa dimensión
  - Respuesta MENOS: -1 punto a esa dimensión

Después: Normalizar a escala 0-100 para cada dimensión (D, I, S, C)

Guardar en: a1_tests_results {
  user_id
  test_name: "Despega Cerebral"
  responses: { d_score, i_score, s_score, c_score, dominant_profile }
  profile_type: 'D' o 'I' o 'S' o 'C'
  created_at
}
```

### Acción Post-Cálculo:
- Guardar resultados en `a1_tests_results`
- **MUY IMPORTANTE**: setIsFirstCompletion(true) → asegura que NO muestre botones de retry
- Esperar 1.5 segundos
- **Transición**: setStep("conozcamonos2-paso1")

---

## 4. CONOZCÁMONOS 2 - PASO 1

### UI/UX:
- Mensaje: "Ahora generaremos tu ruta personalizada de 30 días"
- Responde 9 preguntas sobre:
  1. Energía disponible
  2. Tempo preferido
  3. Barrera principal
  4. Formato de contenido
  5. Soporte necesario
  6. Métrica de éxito
  7. Frecuencia de check-in
  8. Ajuste requerido
  9. Nivel de compromiso

### Guardado de Datos:
```javascript
const { error } = await supabase
  .from("canon_conozcamonos_2_responses")
  .insert({
    user_id: user.id,
    paso: 1,
    responses: c2Step1Responses,
    created_at: new Date().toISOString(),
  })
```

### Transición: 
- Si error: log y stay
- Si OK: setStep("conozcamonos2-paso2")

---

## 5. CONOZCÁMONOS 2 - PASO 2

### UI/UX:
- Mensaje: "Últimas preguntas para extender tu ruta a 60 y 90 días"
- 5 preguntas opcionales sobre metas extended

### Guardado de Datos:
- Mismo flujo que Paso 1 pero con `paso: 2`

### Transición Final:
- Si OK: router.push("/despega") → Dashboard Principal

---

## 6. MOTOR DE REGLAS (Nivel 3 - canon-rules-engine.ts)

### Concepto:
El motor mapea: **Respuesta → Regla → Salida (Misión)**

### Reglas Core (6 reglas implementadas):

1. **focus-productivity** (REGLA 1)
   - Detecta: Si respuesta menciona "Productividad"
   - Output: Auditoría de Productividad Personal (30 días, weekly)
   - Trazabilidad: Pregunta 1 de C2-Paso1

2. **fear-paralysis** (REGLA 2)
   - Detecta: Si respuesta menciona "Miedo"
   - Output: Mapeo de Creencias Limitantes (30 días, daily)
   - Trazabilidad: Pregunta 3 (barrera principal)

3. **time-scarcity** (REGLA 3)
   - Detecta: Si energía disponible es baja (<5 horas/semana)
   - Output: Priorización Radical (30 días, twice-weekly)
   - Trazabilidad: Pregunta 1 (energía disponible)

4. **ambition-high** (REGLA 4)
   - Detecta: Si compromiso nivel es "Máximo"
   - Output: Sprint 30 Intenso (30 días, daily)
   - Trazabilidad: Pregunta 9 (nivel de compromiso)

5. **support-needed** (REGLA 5)
   - Detecta: Si respuesta pide coaching/mentoring
   - Output: Sesiones de Accountability (30 días, weekly)
   - Trazabilidad: Pregunta 5 (soporte necesario)

6. **metric-driven** (REGLA 6)
   - Detecta: Si usuario define métrica específica
   - Output: Dashboard de Seguimiento Personalizado (30 días, daily)
   - Trazabilidad: Pregunta 6 (métrica de éxito)

---

## 7. GENERADOR DE RUTAS (Nivel 3 - canon-routes-generator.ts)

### Input:
- Respuestas de C1 (7 preguntas pre-test)
- Respuestas de C2 Paso 1 (9 preguntas)
- Resultados de A1 (scores D, I, S, C + profile_type)

### Output:
Genera `canon_generated_routes`:
```
{
  user_id
  phase_30: [ misión1, misión2, misión3, ... ]  // 4-6 misiones distribuidas
  phase_60: [ misión4, misión5, misión6, ... ]  // opcionales
  phase_90: [ misión7, misión8, misión9, ... ]  // opcionales
  trazability: {
    mision1: { rule_id: 'focus-productivity', source_response_ids: [1, 6] }
    ...
  }
}
```

### Distribución:
- Semanas 1-4 (30): Misiones foundation + quick wins
- Semanas 5-8 (60): Misiones de profundización (si usuario lo quiere)
- Semanas 9-12 (90): Misiones de integración (si usuario lo quiere)

---

## 8. DASHBOARD - MOMENTO WOW

### Punto: `/despega/page.tsx`

### Carga de Datos:
```javascript
// Load user profile (nombre, niveles, progreso)
const { data: profileData } = await supabase
  .from("despega_user_profiles")
  .select("*")
  .eq("user_id", user.id)

// Load A1 results
const { data: a1Data } = await supabase
  .from("a1_tests_results")
  .select("*")
  .eq("user_id", user.id)

// Load CANON route
const { data: routeData } = await supabase
  .from("canon_generated_routes")
  .select("*")
  .eq("user_id", user.id)
```

### Secciones Visibles:
1. **Bienvenida personalizada**: "Hola, Travis! 👋"
2. **Stats**: Puntos, Ranking, Progreso total, Nivel detectado
3. **Tu Perfil de Personalidad**: Gráfico con D%, I%, S%, C%
4. **Tu Ruta de 90 Días (CANON)** ← **AQUÍ ESTÁ EL WOW**
   - Cada misión es expandible
   - Al expandir muestra: **"Esta misión está aquí porque respondiste X a la pregunta 'Y'"**
   - Trazabilidad visible a cada respuesta

5. **Los 4 Pilares** (A1, A2, A4, A3)

---

## 9. BASE DE DATOS - TABLAS CREADAS

### Tabla: `canon_conozcamonos_1_responses`
- user_id, test_name, q1-q7 (7 preguntas contexto)
- responses (JSONB), created_at, completed

### Tabla: `canon_conozcamonos_2_responses`
- user_id, test_name
- step1_completed, step1_completed_at
- q1-q9 (9 preguntas Paso 1)
- step2_completed, step2_completed_at
- q10-q14 (5 preguntas Paso 2)
- responses (JSONB), created_at

### Tabla: `canon_generated_routes`
- user_id, phase_30, phase_60, phase_90
- trazability (JSONB con mapeo regla→respuesta)
- created_at, updated_at

### Tabla: `canon_rules_engine` (Auditoría)
- user_id, rule_id, condition_met
- output_action, trazability_details
- created_at

### Tabla: `canon_orchestration_logs` (Auditoría)
- user_id, event_type, payload
- status, error_message
- created_at

---

## 10. FLUJO VISUAL COMPLETO

```
Usuario accede a /despega/onboarding
    ↓
Check: ¿Ya completó test?
    ├─ NO → Mostrar intro
    │   ↓
    │   instructions (lee normas)
    │   ↓
    │   test (28 preguntas A1)
    │   ↓ (calculateResults())
    │   Guardar en a1_tests_results
    │   ↓ (isFirstCompletion=true, setStep("conozcamonos2-paso1"))
    │   conozcamonos2-paso1 (9 preguntas)
    │   ↓
    │   Guardar en canon_conozcamonos_2_responses (paso=1)
    │   ↓
    │   conozcamonos2-paso2 (5 preguntas opcionales)
    │   ↓
    │   Guardar en canon_conozcamonos_2_responses (paso=2)
    │   ↓
    │   router.push("/despega") → DASHBOARD
    │
    └─ SÍ → Mostrar intro con opción "Repetir test"
        ↓
        Si click "Ver resultado" → /despega/a1/resultado
        Si click "Repetir" → vuelve a test

En DASHBOARD:
    - Cargar A1 results → mostrar profile
    - Cargar CANON route → mostrar misiones con trazabilidad
    - WOW MOMENT: "Esta misión está aquí porque respondiste X"
```

---

## 11. PUNTOS CRÍTICOS A AUDITAR

### ✅ Completado:
- [x] Tablas creadas en Supabase (5 tablas CANON)
- [x] Flujo de onboarding con steps correctos
- [x] Guardado de A1 resultados
- [x] Guardado de C2-Paso1 y C2-Paso2
- [x] Motor de reglas (6 reglas core)
- [x] Generador de rutas (distribución 30/60/90)
- [x] Componente de trazabilidad en dashboard
- [x] Import correcto en archivos (lib/supabase/client)

### ⚠️ Por Verificar:
- [ ] ¿Los datos C2 se están guardando realmente en BD?
- [ ] ¿El motor de reglas se está ejecutando después de completar test?
- [ ] ¿La ruta se genera automáticamente o requiere un trigger?
- [ ] ¿El dashboard está cargando canon_generated_routes?
- [ ] ¿La trazabilidad es visible al expandir misiones?

---

## 12. PROBLEMAS CONOCIDOS

### Problema 1: "Ruta no generada"
**Síntoma**: Dashboard muestra "Ruta no generada. Completa el test para comenzar"
**Causa Probable**: 
- `canon_generated_routes` vacío para el usuario
- Motor de reglas NO se ejecutó después del test
- Transición fue directa a dashboard sin generar ruta

**Solución**: 
- Necesita un trigger que ejecute el motor de reglas cuando C2-Paso1 se complete
- O agregar un endpoint que genere la ruta on-demand

### Problema 2: Usuario ve "Conozcámonos 2" pero no llega
**Síntoma**: Usuario completa test y es redirigido a `/despega` en lugar de ver C2-Paso1
**Causa Probable**: 
- `isFirstCompletion` no se está marcando correctamente
- O hay un redirect automático en onboarding

**Solución**: 
- Verificar que `isFirstCompletion` es true antes de mostrar retry buttons
- Debuggar con console.log el flujo de steps

---

## 13. PRÓXIMOS PASOS

1. **Generar Rutas Automáticamente**
   - Crear un webhook/trigger que ejecute el motor cuando C2-Paso1 se guarde
   - O hacer que dashboard llame a un endpoint para generar on-demand

2. **Implementar Stress Tests (Nivel 4)**
   - Detección de contradicciones en respuestas
   - Sanitización de texto libre (limitar caracteres, no URLs, etc.)
   - Validaciones de coherencia

3. **Visualización de Trazabilidad**
   - Mejorar componente de expandir misiones
   - Mostrar "por qué existe" cada misión

4. **Testing E2E**
   - Test completo: intro → test → C2 → Dashboard
   - Verificar que datos persisten correctamente

---

## 14. COMANDOS ÚTILES PARA AUDITAR

### Ver todos los pasos del usuario:
```sql
SELECT * FROM canon_orchestration_logs WHERE user_id = 'xxx' ORDER BY created_at DESC;
```

### Ver respuestas de C2-Paso1:
```sql
SELECT * FROM canon_conozcamonos_2_responses WHERE user_id = 'xxx' AND paso = 1;
```

### Ver ruta generada:
```sql
SELECT * FROM canon_generated_routes WHERE user_id = 'xxx';
```

### Ver reglas ejecutadas:
```sql
SELECT * FROM canon_rules_engine WHERE user_id = 'xxx' ORDER BY created_at DESC;
```

---

**Documento generado**: Auditoría completa del ciclo CANON v1.1
**Estado**: En implementación - WOW Moments pendientes de validación
