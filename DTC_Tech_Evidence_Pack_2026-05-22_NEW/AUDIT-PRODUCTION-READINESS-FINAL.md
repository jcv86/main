PRODUCTION READINESS AUDIT - FINAL REPORT
==========================================

## ESTADO ACTUAL vs REQUERIMIENTOS CRÍTICOS

### A) ✅ Escrituras críticas SOLO server-side

STATUS: PARCIALMENTE IMPLEMENTADO

✅ BIEN:
- RPC insert_a1_results_transaction() NO acepta timestamps del cliente
- Calcula v_now := NOW() en servidor
- Calcula v_expires_at en servidor
- Sanitiza PII (REGEXP_REPLACE de Alzheimer → "condición médica")

❌ FALTA:
- completeMision() en actions.ts NO es RPC atómica
- Usa .upsert() directo (no es atómico)
- No recalcula scores (acepta client logic)
- NO tiene idempotencia (doble-click duplica puntos)

### B) ✅ 2 RPC atómicas obligatorias

STATUS: 50% IMPLEMENTADO

✅ BIEN:
- insert_a1_results_transaction() implementada ✓
  * 5 operaciones atómicas (insert A1 + vault + upsert profile + upsert pilar + insert events)
  * ACID garantizado

❌ FALTA CRÍTICA:
- complete_a1_mission_transaction() NO EXISTE
- completeMision() es solo JavaScript (NO atómico)
- Si falla halfway: quedas con misión half-completed
- Puntos duplicados posibles

### C) ❌ Idempotencia en misiones (CRÍTICA)

STATUS: NO IMPLEMENTADO

RIESGO:
- Si Travis hace doble-click en "Completar misión"
- Resultado: +25 puntos x2 = +50 (INCORRECTO)
- Progress: 20% x2 = 40% (INCORRECTO)
- Sin validación: se duplican puntos

NECESARIO:
```sql
WHERE completed = FALSE  -- compare-and-set
OR
unique(user_id, mission_id, ciclo_actual, completed=true)
```

### D) ❌ Ciclos: identificación única (CRÍTICA)

STATUS: HARDCODED "30"

PROBLEMA:
- despega_a1_results.ciclo = 30 (hardcoded)
- despega_pilar_progress.ciclo_actual = 30 (hardcoded)
- Si cambias ciclo, UPSERT pisa progreso anterior
- No hay forma de distinguir ciclo 1 de ciclo 2

RIESGO:
- Travis completa ciclo 30 (progress 100%)
- Sistema reset a ciclo 31
- UPSERT ON CONFLICT (user_id, pilar) sin ciclo_actual
- Resultado: progress = 0% (PERDIDO TRABAJO)

NECESARIO:
- cycle_id = uuid (mejor)
- O cycle_key = user_id + start_date + pilar (alternativa)
- UNIQUE(user_id, pilar, cycle_id)

### E) ✅ Microcopy coherente (PARCIAL)

STATUS: PARCIALMENTE IMPLEMENTADO

❌ INCONSISTENCIAS:
- "sin presión de orden" vs "bloqueadas secuencialmente"
- "Empieza aquí" (prescriptivo) vs Sofia "¿podrías explorar?"
- Button text: "Comienza misión" vs "Si quieres explorar"

✅ BIEN:
- Sofia usa "¿Qué pasaría si...?"
- Evita "tienes que"
- Preserva agencia del usuario

---

## CHECKLIST: QUÉ IMPLEMENTAR AHORA

### PRIORIDAD 0 (BLOQUEADOR):

1. [ ] Create `complete_a1_mission_transaction()` RPC (atómica)
   - Líneas: ~80
   - Tiempo: 30 min
   - Impacto: CRÍTICO (evita duplicados)

2. [ ] Add idempotencia a mission completion
   - Agregar: `WHERE completed = FALSE`
   - O: `unique(user_id, mision_id, completed_true)`
   - Tiempo: 5 min
   - Impacto: CRÍTICO (no duplica puntos)

3. [ ] Implementar cycle_id (UUID)
   - Add column: cycle_id UUID NOT NULL
   - Migrate existing: ciclo 30 → generate UUID por user+pilar
   - Update UNIQUE constraint: (user_id, pilar, cycle_id)
   - Tiempo: 45 min
   - Impacto: CRÍTICO (no pisa progreso entre ciclos)

### PRIORIDAD 1 (MUST-HAVE):

4. [ ] Fix completeMision() → call RPC, no direct upsert
   - Cambiar: de actions.ts → rpc call
   - Tiempo: 15 min
   - Impacto: ALTO (atomicidad)

5. [ ] Documentar ciclo_id en schema
   - Dónde genera: en insert_a1_results_transaction()
   - Cómo usa: en pilar_progress UPSERT
   - Tiempo: 10 min
   - Impacto: MEDIO (documentación)

### PRIORIDAD 2 (NICE-TO-HAVE):

6. [ ] Auditoría de microcopy (find/replace)
   - "Empieza aquí" → "Podrías explorar aquí"
   - Tiempo: 10 min
   - Impacto: BAJO (UX consistency)

---

## RIESGOS ACTUALES (SIN IMPLEMENTAR)

| Risk | Severity | Probability | Impact | Mitigation |
|------|----------|-------------|--------|-----------|
| Doble-completado de misión | CRITICAL | HIGH (user clicks twice) | Duplica puntos | RPC + idempotencia |
| Reset de progreso entre ciclos | CRITICAL | HIGH (cuando ciclo cambia) | Perdida total de progreso | cycle_id único |
| Data inconsistente (half-written) | CRITICAL | MEDIUM (network error) | Corrupción de datos | RPC atómica |
| PII no sanitizada | HIGH | MEDIUM (user puts diagnosis) | Privacy breach | ✅ YA FIXED |
| Timestamps manipulados | MEDIUM | LOW (browser dev tools) | Falsos registros | ✅ YA FIXED |

---

## VEREDICTO FINAL

**CURRENT STATE:** 65% production-ready

**MISSING FOR 100%:**
- Idempotencia en misiones (30 min)
- Ciclo ID único (45 min)
- RPC completeMision() (30 min)
- Microcopy audit (10 min)

**TOTAL TIME TO PRODUCTION:** ~2 horas

**CAN DEPLOY NOW?** ⚠️ NO - riesgo crítico de data corruption

**STAMPED BLOCKERS:**
1. Sin complete_mission_transaction(): doble-click duplica +25 puntos ❌
2. Sin cycle_id unique: reset de progreso 100% → 0% ❌
3. Sin idempotencia: +50 puntos en lugar de +25 ❌

---

## RECOMENDACIÓN

Implementa ANTES de cualquier deployment:
- ✅ complete_a1_mission_transaction() (80 líneas SQL)
- ✅ Idempotencia check (1 WHERE clause)
- ✅ cycle_id UUID (schema migration)

Luego sí: "PRODUCTION-READY ✅"
