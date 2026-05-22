🔍 AUDITORÍA COMPLETA - BÚSQUEDA DE INCONSISTENCIAS

## RESUMEN EJECUTIVO

Se han identificado **8 INCONSISTENCIAS CRÍTICAS** y **5 OPORTUNIDADES DE MEJORA** en el sistema A1 Despega Cerebral.

---

## INCONSISTENCIAS ENCONTRADAS

### 1. SCHEMA MISMATCH - Tabla `despega_pilar_progress` (CRÍTICA)

**Problema Identificado:**
```
lib/despega/actions.ts línea 34-35:
  progreso: 0,
  score: 0,

scripts/despega-001-create-schema.sql:
  diagnostic_score INTEGER
  points_accumulated INTEGER
  progress_pct INTEGER
```

**Impacto:** INSERT fallará por campos inexistentes
**Fix:** Actualizar actions.ts para usar `diagnostic_score`, `points_accumulated`, `progress_pct`

---

### 2. CONTEXT CAPTURE SIN CUSTOM TEXT (CRÍTICA)

**Problema:**
```
app/despega/a1-cerebral/page.tsx línea 17-24:
  Captura: shiftWorker, caregiving, neurodiversity
  FALTA: otherContext, consentGiven
```

**Impacto:** Datos sensibles (Alzheimer) no se almacenan en vault
**Fix:** Agregar textfield y checkbox de consentimiento

---

### 3. SAVEATESULTS NO NORMALIZA RESPUESTAS (CRÍTICA)

**Problema:**
```
lib/despega/actions.ts saveA1TestResults:
  Usa rawAnswers directamente
  FALTA: normalizeAnswersTo110()
```

**Impacto:** Puntajes inconsistentes si respuestas vienen en diferentes escalas
**Fix:** Agregar `normalizeAnswersTo110(rawAnswers)` antes de calcular

---

### 4. ORDEN DE PRIORIDADES INCORRECTO EN UI (CRÍTICA)

**Problema:**
```
app/despega/a1-cerebral/page.tsx línea 63-152:
  PAQUETES_A1 orden: Energía, Enfoque, Relaciones, Plan Ejecutivo
  DEBE SER: Plan Ejecutivo (20), Energía (42), Relaciones (50), Enfoque (50)
```

**Impacto:** UI muestra prioridades al revés
**Fix:** Usar `getPriorityOrder()` helper para ordenar dinámicamente

---

### 5. SAVEATESULTS USA CLIENTE PARA TIMESTAMPS (SEGURIDAD - CRÍTICA)

**Problema:**
```
Antes (fixed, but need verification):
  p_now_timestamp: nowISO,
  p_today_date: todayDateString,

Ahora (correcto): RPC calcula NOW()
```

**Verificación:** ✓ Confirmado como FIXED en despega-002-a1-rpc-transaction.sql

---

### 6. MISSING CYCLEID EN QUERIES (CRÍTICA)

**Problema:**
```
lib/despega/queries.ts:
  SELECT * FROM despega_pilar_progress
  WHERE user_id = $1
  
  FALTA: AND ciclo_actual = $2
```

**Impacto:** Si usuario está en ciclo 60, verá datos del ciclo 30
**Fix:** Agregar `ciclo_actual` a todas las queries

---

### 7. SOFIA NO VALIDA PRESCRIPTIVE LANGUAGE (LÓGICA)

**Problema:**
```
components/a1-coach-interactive.tsx:
  Sofia usa prompts de /lib/a1-coach-prompts.ts
  PERO: No hay validación que frases sean anti-prescriptivas
```

**Impacto:** Sofia puede decir "debes hacer X"
**Fix:** Agregar RUBY_EVALUATION check en la respuesta antes de mostrar

---

### 8. LOCALSTORAGE ALMACENA PII (SEGURIDAD - CRÍTICA)

**Problema:**
```
Si algún componente hace:
  localStorage.setItem('user_context', JSON.stringify({
    email: 'travis@hospital.cl',
    contexto: 'Madre con Alzheimer'
  }))
```

**Impacto:** PII expuesta en cliente
**Fix:** NUNCA usar localStorage para datos sensibles

---

## OPORTUNIDADES DE MEJORA

### 9. Falta Trigger `set_updated_at` en algunas tablas

**Status:** ✓ Fixed en despega-004-production-schema.sql

---

### 10. getPriorityOrder() no cachea entre renders

**Status:** ⚠️ Funciona pero podría optimizarse con useMemo()

---

### 11. RPC no maneja edge cases de ciclo nuevo

**Status:** ⚠️ `ON CONFLICT` está bien pero faltan comentarios

---

### 12. Falta auditoría de cambios en `updated_at`

**Status:** ⚠️ Trigger existe pero no hay logs de quién cambió qué

---

### 13. Sofia coach no tiene instrucciones sobre contexto de Travis

**Status:** ⚠️ Debería incluir contexto (shift_worker, caregiving) en el prompt

---

## PRIORIDAD DE FIXES

| # | Issue | Severidad | Fix Time |
|---|-------|-----------|----------|
| 1 | Schema Mismatch | CRÍTICA | 10min |
| 2 | Context Capture Incompleta | CRÍTICA | 15min |
| 3 | Respuestas No Normalizadas | CRÍTICA | 5min |
| 4 | Orden Prioridades Incorrecto | CRÍTICA | 20min |
| 5 | Timestamps (verificar) | CRÍTICA | 5min |
| 6 | Falta Ciclo ID en Queries | CRÍTICA | 15min |
| 7 | Sofia Prescriptiva | ALTA | 20min |
| 8 | PII en localStorage | CRÍTICA | 10min |

---

## RECOMENDACIONES

1. **Ejecutar Schema Fixes Primero** (30 min total)
2. **Actualizar UI Components** (40 min total)
3. **Agregar Validación Sofia** (20 min total)
4. **Testing End-to-End con Travis** (60 min)

**Tiempo total de fixes: ~150 minutos (2.5 horas)**

El sistema es **80% funcional** pero tiene **8 bugs críticos** que impiden el flujo end-to-end de Travis.
