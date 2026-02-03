Perfecto — ese checklist está bien. Aquí tienes **lo prometido**: los **parches exactos** (microcopy + lógica de prioridades) y el **bloque RPC corregido** (con `RETURNING id`) + una **RPC adicional para completar misión** (atómica). Todo listo para copiar/pegar.

---

# 1) Parches de texto listos (microcopy)

### A) “Sin presión de orden” vs misiones bloqueadas

**Reemplaza** en pantalla de resultados:

* ❌ “accede a las 5 misiones del ciclo 30 (sin presión de orden)”
* ✅ **“accede a las 5 misiones del ciclo 30 (paso a paso, sin presión).”**

  * agrega: **“Puedes explorar otros paquetes cuando quieras.”**

### B) Sofía (anti-prescriptivo) – reemplazos 1:1

Busca y reemplaza:

* ❌ “¿Qué tal si empezamos con UNA cosa…?”
  ✅ **“Si te sirve, podríamos explorar una primera hipótesis…”**

* ❌ “Ese día podría ser tu ‘anclaje’.”
  ✅ **“¿Te hace sentido usar ese día como punto de observación?”**

* ❌ “Perfecto. Viernes a las 8pm es tu ANCLAJE.”
  ✅ **“Podría funcionar como un anclaje si quieres probarlo.”**

* ❌ “En ese viernes, reserva 30 minutos.”
  ✅ **“¿Podrías encontrar 30 minutos (aunque no sea perfecto) para observar tu semana?”**

---

# 2) Prioridades: regla + orden correcto (con empates)

Con tus scores:

* Plan Ejecutivo 20
* Energía 42
* Enfoque 50
* Relaciones 50

**Orden correcto por fricción (menor score primero):**

1. Plan Ejecutivo (20)
2. Energía (42)
3. Enfoque (50)
4. Relaciones (50) *(empate: desempate alfabético o editorial fijo)*

### Snippet TS simple (desempate alfabético)

```ts
type DimKey = "plan_ejecutivo" | "energia" | "enfoque" | "relaciones";

const labels: Record<DimKey, string> = {
  plan_ejecutivo: "Plan Ejecutivo",
  energia: "Energía",
  enfoque: "Enfoque",
  relaciones: "Relaciones",
};

function getPriorityOrder(scores: Record<DimKey, number>) {
  return (Object.keys(scores) as DimKey[])
    .sort((a, b) => {
      const diff = scores[a] - scores[b]; // menor score = más fricción = prioridad más alta
      if (diff !== 0) return diff;
      return labels[a].localeCompare(labels[b]); // desempate alfabético
    })
    .map((k, idx) => ({ key: k, label: labels[k], score: scores[k], priority: idx + 1 }));
}
```

---

# 3) RPC CORREGIDA (versión “mínimo cambio” + `RETURNING id`)

Esta versión **mantiene** tus parámetros de scores (si hoy ya los calculas en server action) pero:

* ✅ valida que `p_user_id` coincida con `auth.uid()`
* ✅ calcula `now()`/`current_date`/`expires_at` en DB
* ✅ devuelve el **id real** del resultado insertado
* ✅ evita confiar en timestamps del cliente

> **Requiere** extensión `pgcrypto` o `gen_random_uuid()` disponible (Supabase normalmente sí).
> Y asume que tus tablas ya existen.

```sql
CREATE OR REPLACE FUNCTION insert_a1_results_transaction(
  p_user_id UUID,
  p_score_energia INTEGER,
  p_score_enfoque INTEGER,
  p_score_relaciones INTEGER,
  p_score_plan_ejecutivo INTEGER,
  p_score_overall INTEGER,
  p_context_shift BOOLEAN,
  p_context_care BOOLEAN,
  p_context_neuro BOOLEAN,
  p_context_text TEXT,
  p_context_consent BOOLEAN
) RETURNS TABLE (
  result_id UUID,
  result_status TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid UUID;
  v_now TIMESTAMPTZ := now();
  v_today DATE := current_date;
  v_expires_at TIMESTAMPTZ := (now() + interval '90 days');
  v_result_id UUID;
BEGIN
  v_uid := auth.uid();

  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF p_user_id <> v_uid THEN
    RAISE EXCEPTION 'Forbidden: user mismatch';
  END IF;

  -- 1) A1 results (RETURNING id)
  INSERT INTO despega_a1_results (
    user_id,
    diagnostic_score_energia,
    diagnostic_score_enfoque,
    diagnostic_score_relaciones,
    diagnostic_score_plan_ejecutivo,
    diagnostic_score_overall,
    ciclo,
    context_shift_worker,
    context_caregiving,
    context_neurodiversity,
    context_other_approved,
    created_at
  ) VALUES (
    v_uid,
    p_score_energia,
    p_score_enfoque,
    p_score_relaciones,
    p_score_plan_ejecutivo,
    p_score_overall,
    30,
    p_context_shift,
    p_context_care,
    p_context_neuro,
    p_context_consent,
    v_now
  )
  RETURNING id INTO v_result_id;

  -- 2) Context vault (solo si hay consentimiento)
  IF p_context_consent THEN
    INSERT INTO despega_context_vault (
      user_id,
      context_other_text,
      consent_given,
      retention_days,
      expires_at,
      created_at
    ) VALUES (
      v_uid,
      p_context_text,
      TRUE,
      90,
      v_expires_at,
      v_now
    );
  END IF;

  -- 3) User profile (UPSERT)
  INSERT INTO despega_user_profiles (
    user_id,
    a1_test_completed,
    a1_test_completed_at,
    current_ciclo,
    ciclo_start_date,
    context_shift_worker,
    context_caregiving,
    context_neurodiversity,
    context_other_approved,
    updated_at
  ) VALUES (
    v_uid,
    TRUE,
    v_now,
    30,
    v_today,
    p_context_shift,
    p_context_care,
    p_context_neuro,
    p_context_consent,
    v_now
  )
  ON CONFLICT (user_id) DO UPDATE SET
    a1_test_completed = TRUE,
    a1_test_completed_at = EXCLUDED.a1_test_completed_at,
    current_ciclo = EXCLUDED.current_ciclo,
    ciclo_start_date = EXCLUDED.ciclo_start_date,
    context_shift_worker = EXCLUDED.context_shift_worker,
    context_caregiving = EXCLUDED.context_caregiving,
    context_neurodiversity = EXCLUDED.context_neurodiversity,
    context_other_approved = EXCLUDED.context_other_approved,
    updated_at = v_now;

  -- 4) Pilar progress
  INSERT INTO despega_pilar_progress (
    user_id,
    pilar,
    diagnostic_score,
    points_accumulated,
    progress_pct,
    total_missions_in_cycle,
    missions_completed,
    ciclo_actual,
    ciclo_start_date,
    paquete_activo,
    is_unlocked,
    created_at,
    updated_at
  ) VALUES (
    v_uid,
    'a1_cerebral',
    p_score_overall,
    0,
    0,
    5,
    0,
    30,
    v_today,
    'plan_ejecutivo',
    TRUE,
    v_now,
    v_now
  )
  ON CONFLICT (user_id, pilar, ciclo_actual) DO UPDATE SET
    diagnostic_score = EXCLUDED.diagnostic_score,
    points_accumulated = 0,
    progress_pct = 0,
    missions_completed = 0,
    paquete_activo = EXCLUDED.paquete_activo,
    updated_at = v_now;

  -- 5) Score event (time-series)
  INSERT INTO despega_score_events (
    user_id,
    event_type,
    pilar,
    diagnostic_score_at_event,
    points_delta,
    points_total,
    progress_pct_at_event,
    context_flags,
    created_at
  ) VALUES (
    v_uid,
    'diagnostic',
    'a1_cerebral',
    p_score_overall,
    0,
    0,
    0,
    jsonb_build_object(
      'shift_worker', p_context_shift,
      'caregiving', p_context_care,
      'neurodiversity', p_context_neuro
    ),
    v_now
  );

  RETURN QUERY SELECT v_result_id, 'SUCCESS';

EXCEPTION WHEN OTHERS THEN
  RAISE;
END;
$$;
```

✅ Esto arregla el issue del `result_id` y el exceso de confianza en timestamps del cliente.

---

# 4) RPC “completar misión” (atómica + idempotente)

Esta RPC hace **todo en 1 transacción**:

* valida que la misión pertenezca al usuario
* evita doble completado
* actualiza `despega_user_misiones`
* incrementa `points_accumulated` y `missions_completed`
* recalcula `progress_pct`
* inserta `despega_score_events`

```sql
CREATE OR REPLACE FUNCTION complete_a1_mission_transaction(
  p_mision_id TEXT,
  p_user_notes TEXT
) RETURNS TABLE (
  status TEXT,
  points_total INTEGER,
  progress_pct INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_now TIMESTAMPTZ := now();
  v_points_earned INTEGER;
  v_total_missions INTEGER;
  v_completed INTEGER;
  v_points_total INTEGER;
  v_diag_score INTEGER;
  v_progress_pct INTEGER;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- 1) Marcar misión como completada SOLO si aún no lo está (idempotencia)
  UPDATE despega_user_misiones
  SET
    completed = TRUE,
    completed_at = v_now,
    puntos_earned = COALESCE(puntos_earned, points),
    user_notes = p_user_notes
  WHERE user_id = v_uid
    AND mision_id = p_mision_id
    AND completed = FALSE
  RETURNING COALESCE(puntos_earned, points) INTO v_points_earned;

  IF NOT FOUND THEN
    -- ya estaba completada o no existe para este usuario
    SELECT points_accumulated, progress_pct
      INTO v_points_total, v_progress_pct
    FROM despega_pilar_progress
    WHERE user_id = v_uid AND pilar = 'a1_cerebral';

    RETURN QUERY SELECT 'ALREADY_COMPLETED', COALESCE(v_points_total, 0), COALESCE(v_progress_pct, 0);
    RETURN;
  END IF;

  -- 2) Leer estado actual del progreso
  SELECT
    diagnostic_score,
    total_missions_in_cycle,
    missions_completed,
    points_accumulated
  INTO
    v_diag_score,
    v_total_missions,
    v_completed,
    v_points_total
  FROM despega_pilar_progress
  WHERE user_id = v_uid AND pilar = 'a1_cerebral'
  FOR UPDATE;

  -- 3) Incrementos
  v_completed := COALESCE(v_completed, 0) + 1;
  v_points_total := COALESCE(v_points_total, 0) + COALESCE(v_points_earned, 0);

  v_progress_pct := CASE
    WHEN COALESCE(v_total_missions, 0) = 0 THEN 0
    ELSE ROUND((v_completed::numeric / v_total_missions::numeric) * 100)::int
  END;

  UPDATE despega_pilar_progress
  SET
    missions_completed = v_completed,
    points_accumulated = v_points_total,
    progress_pct = v_progress_pct,
    updated_at = v_now
  WHERE user_id = v_uid AND pilar = 'a1_cerebral';

  -- 4) Timeline event
  INSERT INTO despega_score_events (
    user_id,
    event_type,
    pilar,
    diagnostic_score_at_event,
    points_delta,
    points_total,
    progress_pct_at_event,
    context_flags,
    created_at
  ) VALUES (
    v_uid,
    'mission_completed',
    'a1_cerebral',
    COALESCE(v_diag_score, 0),
    COALESCE(v_points_earned, 0),
    v_points_total,
    v_progress_pct,
    '{}'::jsonb,
    v_now
  );

  RETURN QUERY SELECT 'SUCCESS', v_points_total, v_progress_pct;
END;
$$;
```

---

# 5) localStorage sin PII (parche directo)

En vez de guardar email/nombre, deja algo así:

```ts
localStorage.setItem("dtc_state", JSON.stringify({
  a1_iniciado: true,
  camino: "persona_coaching"
}));
```

Y lo demás siempre viene desde `supabase.auth.getUser()` / server.

---

## Cierre

Con estos bloques:

* arreglas la contradicción de UX,
* corriges prioridades,
* limpias prescripción del coach,
* **corriges el `result_id` real**,
* reduces spoofing del cliente,
* y dejas “completar misión” a prueba de doble click / reintentos.

Si quieres el siguiente paso lógico: te armo también el **modelo de ciclo** para evitar el problema de “(user_id,pilar,ciclo_actual)=30” pisándose entre meses (con `cycle_id` UUID o `ciclo_start_date` en unique key), pero con lo de arriba ya quedas en **Hardening Pass real**.
