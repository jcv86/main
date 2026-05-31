GUÍA DE IMPLEMENTACIÓN - 3 BLOCKER FIXES
========================================

## FIX #1: IDEMPOTENCIA EN MISIONES (5 minutos)

### Qué hace:
- Previene doble-click = duplicar puntos
- Si ya está completed, segundo click = silenciado (sin puntos extra)

### Cómo implementar:
```bash
# 1. Ejecuta en tu DB Supabase:
scripts/despega-006-BLOCKER-fixes.sql (línea 1-10)

# 2. Verifica:
SELECT * FROM despega_user_misiones 
  WHERE mision_id = 'a1_plan_ejecutivo_dia_1' AND completed = TRUE;
  
# Debe mostrar ÚNICA fila, no duplicadas
```

### Riesgo si NO lo haces:
```
Travis clicks "Completar": +25 puntos ✓
Travis clicks again (double): +25 puntos ❌ (duplicado)
Total: +50 (INCORRECTO)
```

---

## FIX #2: CYCLE_ID ÚNICO (45 minutos)

### Qué hace:
- Identifica cada ciclo unívocamente con UUID
- Previene que ciclo 30 UPSERT pise ciclo 31
- Permite histórico de múltiples ciclos

### Cómo implementar:
```bash
# 1. Ejecuta en tu DB:
scripts/despega-006-BLOCKER-fixes.sql (línea 15-43)

# 2. Migra datos existentes:
UPDATE despega_a1_results 
  SET cycle_id = gen_random_uuid() 
  WHERE cycle_id IS NULL;

UPDATE despega_pilar_progress 
  SET cycle_id = gen_random_uuid() 
  WHERE cycle_id IS NULL;

# 3. Verifica schema:
\d despega_pilar_progress
# Debe mostrar: cycle_id UUID, UNIQUE(user_id, pilar, cycle_id)
```

### Riesgo si NO lo haces:
```
Ciclo 30: Travis completa 5 misiones (progress 100%)
Ciclo 31 (new): UPSERT sin cycle_id
Resultado: progress resetea 100% → 0% (PERDIDA DE TRABAJO)
```

---

## FIX #3: COMPLETE_MISSION_TRANSACTION RPC (30 minutos)

### Qué hace:
- RPC atómica (todo sucede o nada)
- Implementa idempotencia server-side
- Calcula progress_pct automáticamente
- Logs para "Mi Evolución"

### Cómo implementar:
```bash
# 1. Ejecuta en tu DB:
scripts/despega-006-BLOCKER-fixes.sql (línea 48-170)

# 2. Actualiza /lib/despega/actions.ts
# CAMBIAR: completeMision() de actions.ts

FROM:
export async function completeMision(mision_id: string, notes?: string) {
  const { data, error } = await supabase
    .from("despega_user_misiones")
    .upsert({...})  // NO ATÓMICO
}

TO:
export async function completeMision(
  user_id: string,
  mision_id: string, 
  cycle_id: string,
  notes?: string
) {
  const { data, error } = await supabase.rpc(
    'complete_a1_mission_transaction',
    {
      p_user_id: user_id,
      p_mision_id: mision_id,
      p_cycle_id: cycle_id,
      p_notes: notes,
      p_puntos: 25
    }
  )
  if (error) throw error
  return data
}

# 3. Verifica:
SELECT pg_get_functiondef('complete_a1_mission_transaction'::regprocedure);
# Debe retornar 170+ líneas de función SQL
```

### Riesgo si NO lo haces:
```
Network error halfway through mission completion
Resultado: Misión marked completed pero puntos NO sumados
O: Puntos sumados pero progress_pct no actualizado
Data INCONSISTENTE = corrupción
```

---

## ORDEN DE EJECUCIÓN

### Paso 1: Idempotencia (5 min) ⭐ PRIMERO
- Implementa unique constraint
- Protege contra duplicados

### Paso 2: Cycle ID (45 min) ⭐ SEGUNDO
- Agrega columnas
- Migra datos
- Actualiza constraints

### Paso 3: RPC Completa (30 min) ⭐ TERCERO
- Crea función RPC
- Actualiza actions.ts
- Prueba end-to-end

---

## TESTING CHECKLIST

Después de implementar, ejecuta:

```sql
-- Test #1: Idempotencia
SELECT complete_a1_mission_transaction(
  'user_123'::UUID, 
  'mision_1', 
  'cycle-uuid-123'::UUID,
  'Test notes',
  25
);
-- Resultado: success=true, puntos_awarded=25

SELECT complete_a1_mission_transaction(
  'user_123'::UUID, 
  'mision_1', 
  'cycle-uuid-123'::UUID,
  'Double click test',
  25
);
-- Resultado: success=false, puntos_awarded=0
-- (No duplica puntos)

-- Test #2: Cicle Uniqueness
SELECT COUNT(*) FROM despega_pilar_progress 
  WHERE user_id='user_123' AND pilar='a1_cerebral';
-- Debe retornar 1 por cada cycle_id unique
-- (No se pisan datos)

-- Test #3: Progress Calculation
SELECT progress_pct FROM despega_pilar_progress 
  WHERE user_id='user_123' AND pilar='a1_cerebral' AND cycle_id='cycle-1';
-- 20% si 1 de 5 misiones completadas
-- 40% si 2 de 5
-- etc.
```

---

## VALIDACIÓN FINAL

Después de todos los fixes, ejecuta:

```
✅ Doble-click = no duplica puntos
✅ Ciclo nuevo = no pisa anterior
✅ Progress = (completed / total) * 100
✅ Timeline en "Mi Evolución" = correcto
✅ RLS policies = Travis solo ve su data
✅ Timestamps = server-side
```

Si TODO ✅, entonces:

**SISTEMA PRODUCTION-READY ✓**

---

## TIEMPO TOTAL

- Idempotencia: 5 min
- Cycle ID: 45 min
- RPC: 30 min
- Testing: 15 min
- ─────────────
  TOTAL: ~95 min (1.5 horas)

Después: Deploy con confianza.
