Listo. Te lo dejo **cerrado para producción** (A1 completo) con:

1. **Modelo de ciclos sin pisarse** (cycle_id real)
2. **Scoring 100% server/DB** (cero spoofing)
3. **2 RPC atómicas** (guardar diagnóstico + completar misión)
4. **RLS + opt-in ranking**
5. **Microcopy final + prioridad consistente**
6. **Checklist de deploy**

Voy a asumir que estás en Supabase con Postgres y deploy en Vercel.

---

# 0) Decisión final de producción (para que no haya ambigüedad)

* **A1 funciona en ciclos de 30 días** (micro-loop).
* DTC mantiene su **horizonte macro de 90 días** arriba (no lo rompes), pero A1 es el motor mensual.
* Cada vez que Travis hace el diagnóstico A1, se crea o actualiza un **A1 cycle** (cycle_id).
* **Nunca** mezclas `diagnostic_score` con `points`.
* “Mi Evolución” se arma desde `score_events` (time-series), no desde rankings.

---

# 1) Migración SQL (schema mínimo “production-safe”)

> Esto es lo que ejecutas como migration. Si ya tienes tablas, aplica como “ALTER/CREATE IF NOT EXISTS” y agrega las constraints/índices.

```sql
-- 1) Extensiones útiles
create extension if not exists pgcrypto;

-- 2) A1 Cycles: evita que "ciclo_actual = 30" se pise cada mes
create table if not exists despega_cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  pilar text not null, -- 'a1_cerebral'
  cycle_length_days int not null default 30,
  started_at timestamptz not null default now(),
  ends_at timestamptz not null,
  status text not null default 'active', -- active|completed|archived
  created_at timestamptz not null default now(),
  unique(user_id, pilar, status) deferrable initially immediate
);

create index if not exists idx_despega_cycles_user_pilar on despega_cycles(user_id, pilar);

-- 3) A1 Results: 1 por check-in (ligado a cycle_id)
create table if not exists despega_a1_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  cycle_id uuid not null references despega_cycles(id) on delete cascade,

  diagnostic_score_energia int not null,
  diagnostic_score_enfoque int not null,
  diagnostic_score_relaciones int not null,
  diagnostic_score_plan_ejecutivo int not null,
  diagnostic_score_overall int not null,

  context_shift_worker boolean not null default false,
  context_caregiving boolean not null default false,
  context_neurodiversity boolean not null default false,
  context_other_approved boolean not null default false,

  created_at timestamptz not null default now()
);

create index if not exists idx_a1_results_user_cycle on despega_a1_results(user_id, cycle_id);

-- 4) Pilar progress: 1 fila por user+pilar+cycle_id
create table if not exists despega_pilar_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  pilar text not null, -- 'a1_cerebral'
  cycle_id uuid not null references despega_cycles(id) on delete cascade,

  diagnostic_score int not null,          -- inmutable durante el ciclo
  points_accumulated int not null default 0,
  missions_completed int not null default 0,
  total_missions_in_cycle int not null default 5,
  progress_pct int not null default 0,

  paquete_activo text not null default 'plan_ejecutivo',
  is_unlocked boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(user_id, pilar, cycle_id)
);

create index if not exists idx_progress_user_pilar on despega_pilar_progress(user_id, pilar);

-- 5) User missions: misiones ligadas a cycle_id + idempotencia por mission_key
create table if not exists despega_user_misiones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  pilar text not null default 'a1_cerebral',
  cycle_id uuid not null references despega_cycles(id) on delete cascade,

  mission_key text not null, -- ej: 'a1_plan_ejecutivo_01'
  paquete text not null,     -- plan_ejecutivo|energia|...
  dia_numero int not null,

  points int not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  puntos_earned int,
  user_notes text,

  context_adapted_shift boolean not null default false,
  context_adapted_caregiving boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(user_id, cycle_id, mission_key)
);

create index if not exists idx_user_misiones_user_cycle on despega_user_misiones(user_id, cycle_id);

-- 6) Score events: timeline “Mi Evolución”
create table if not exists despega_score_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  pilar text not null,
  cycle_id uuid not null references despega_cycles(id) on delete cascade,

  event_type text not null, -- diagnostic|mission_completed|cycle_completed
  diagnostic_score_at_event int not null default 0,
  points_delta int not null default 0,
  points_total int not null default 0,
  progress_pct_at_event int not null default 0,

  context_flags jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_score_events_user_cycle on despega_score_events(user_id, cycle_id);

-- 7) Context vault: opcional + expiración
create table if not exists despega_context_vault (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  cycle_id uuid not null references despega_cycles(id) on delete cascade,

  context_other_text text,
  consent_given boolean not null default false,
  retention_days int not null default 90,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_context_vault_expiry on despega_context_vault(expires_at);

-- 8) User profile: puntero a ciclo activo (A1)
alter table if exists despega_user_profiles
  add column if not exists a1_active_cycle_id uuid;

alter table if exists despega_user_profiles
  add column if not exists ranking_opt_in boolean not null default false;

-- 9) updated_at trigger helper
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_progress_updated_at on despega_pilar_progress;
create trigger trg_progress_updated_at
before update on despega_pilar_progress
for each row execute function set_updated_at();

drop trigger if exists trg_user_misiones_updated_at on despega_user_misiones;
create trigger trg_user_misiones_updated_at
before update on despega_user_misiones
for each row execute function set_updated_at();
```

---

# 2) RLS (seguridad real)

> Esto es **obligatorio** para producción.

```sql
-- Enable RLS
alter table despega_cycles enable row level security;
alter table despega_a1_results enable row level security;
alter table despega_pilar_progress enable row level security;
alter table despega_user_misiones enable row level security;
alter table despega_score_events enable row level security;
alter table despega_context_vault enable row level security;

-- Policies: cada usuario solo ve/modifica sus filas
create policy "cycles_owner_select" on despega_cycles
for select using (auth.uid() = user_id);

create policy "cycles_owner_insert" on despega_cycles
for insert with check (auth.uid() = user_id);

create policy "cycles_owner_update" on despega_cycles
for update using (auth.uid() = user_id);

create policy "a1_results_owner_select" on despega_a1_results
for select using (auth.uid() = user_id);

create policy "progress_owner_select" on despega_pilar_progress
for select using (auth.uid() = user_id);

create policy "missions_owner_select" on despega_user_misiones
for select using (auth.uid() = user_id);

create policy "events_owner_select" on despega_score_events
for select using (auth.uid() = user_id);

create policy "vault_owner_select" on despega_context_vault
for select using (auth.uid() = user_id);

-- Nota: inserts/updates los haremos SOLO por RPC SECURITY DEFINER
-- entonces puedes NO permitir insert/update directos desde cliente.
```

---

# 3) RPC 1 — Guardar diagnóstico A1 (server-side scoring + crea cycle)

### ✅ Qué hace esta RPC

* crea (o reutiliza) un **cycle activo** para A1
* valida que `raw_answers` tenga 20 ints 1–10
* calcula scores en DB
* inserta results + progress + event + vault (si consent)
* actualiza `despega_user_profiles.a1_active_cycle_id`

```sql
create or replace function insert_a1_checkin_transaction(
  p_raw_answers jsonb,
  p_context_shift boolean,
  p_context_care boolean,
  p_context_neuro boolean,
  p_context_text text,
  p_context_consent boolean
)
returns table (cycle_id uuid, result_id uuid, overall_score int)
language plpgsql
security definer
as $$
declare
  v_uid uuid := auth.uid();
  v_cycle_id uuid;
  v_result_id uuid;

  v_e int := 0;
  v_f int := 0;
  v_r int := 0;
  v_p int := 0;

  v_e_pct int;
  v_f_pct int;
  v_r_pct int;
  v_p_pct int;
  v_overall int;

  v_now timestamptz := now();
  v_expires_at timestamptz := now() + interval '90 days';

  v_arr int[];
begin
  if v_uid is null then
    raise exception 'Unauthorized';
  end if;

  -- 1) Validación básica: p_raw_answers debe ser array de 20 ints 1..10
  if jsonb_typeof(p_raw_answers) <> 'array' then
    raise exception 'raw_answers must be a JSON array';
  end if;

  select array_agg((value)::int)
  into v_arr
  from jsonb_array_elements_text(p_raw_answers);

  if array_length(v_arr, 1) <> 20 then
    raise exception 'raw_answers must contain 20 numeric values';
  end if;

  if exists (
    select 1 from unnest(v_arr) x
    where x < 1 or x > 10
  ) then
    raise exception 'raw_answers values must be 1..10';
  end if;

  -- 2) Cycle activo A1 (si no existe, créalo)
  select id into v_cycle_id
  from despega_cycles
  where user_id = v_uid and pilar = 'a1_cerebral' and status = 'active'
  limit 1;

  if v_cycle_id is null then
    insert into despega_cycles(user_id, pilar, cycle_length_days, started_at, ends_at, status)
    values (v_uid, 'a1_cerebral', 30, v_now, v_now + interval '30 days', 'active')
    returning id into v_cycle_id;
  end if;

  -- 3) Scoring: 4 dimensiones de 5 preguntas (1..5, 6..10, 11..15, 16..20)
  v_e := v_arr[1] + v_arr[2] + v_arr[3] + v_arr[4] + v_arr[5];
  v_f := v_arr[6] + v_arr[7] + v_arr[8] + v_arr[9] + v_arr[10];
  v_r := v_arr[11] + v_arr[12] + v_arr[13] + v_arr[14] + v_arr[15];
  v_p := v_arr[16] + v_arr[17] + v_arr[18] + v_arr[19] + v_arr[20];

  v_e_pct := round((v_e::numeric / 50::numeric) * 100)::int;
  v_f_pct := round((v_f::numeric / 50::numeric) * 100)::int;
  v_r_pct := round((v_r::numeric / 50::numeric) * 100)::int;
  v_p_pct := round((v_p::numeric / 50::numeric) * 100)::int;

  v_overall := round(((v_e_pct + v_f_pct + v_r_pct + v_p_pct)::numeric / 4))::int;

  -- 4) Insert result
  insert into despega_a1_results(
    user_id, cycle_id,
    diagnostic_score_energia, diagnostic_score_enfoque, diagnostic_score_relaciones, diagnostic_score_plan_ejecutivo, diagnostic_score_overall,
    context_shift_worker, context_caregiving, context_neurodiversity, context_other_approved,
    created_at
  ) values (
    v_uid, v_cycle_id,
    v_e_pct, v_f_pct, v_r_pct, v_p_pct, v_overall,
    p_context_shift, p_context_care, p_context_neuro, p_context_consent,
    v_now
  )
  returning id into v_result_id;

  -- 5) Context vault (opcional)
  if p_context_consent then
    insert into despega_context_vault(
      user_id, cycle_id, context_other_text, consent_given, retention_days, expires_at, created_at
    ) values (
      v_uid, v_cycle_id, p_context_text, true, 90, v_expires_at, v_now
    );
  end if;

  -- 6) Pilar progress: crea si no existe; si existe NO resetees si ya hay misiones hechas
  insert into despega_pilar_progress(
    user_id, pilar, cycle_id,
    diagnostic_score, points_accumulated, missions_completed, total_missions_in_cycle, progress_pct,
    paquete_activo, is_unlocked, created_at, updated_at
  ) values (
    v_uid, 'a1_cerebral', v_cycle_id,
    v_overall, 0, 0, 5, 0,
    'plan_ejecutivo', true, v_now, v_now
  )
  on conflict (user_id, pilar, cycle_id) do update set
    diagnostic_score = excluded.diagnostic_score,
    updated_at = v_now;

  -- 7) Event timeline
  insert into despega_score_events(
    user_id, pilar, cycle_id, event_type,
    diagnostic_score_at_event, points_delta, points_total, progress_pct_at_event,
    context_flags, created_at
  ) values (
    v_uid, 'a1_cerebral', v_cycle_id, 'diagnostic',
    v_overall, 0, 0, 0,
    jsonb_build_object(
      'shift_worker', p_context_shift,
      'caregiving', p_context_care,
      'neurodiversity', p_context_neuro
    ),
    v_now
  );

  -- 8) Pointer en profile
  update despega_user_profiles
  set a1_active_cycle_id = v_cycle_id
  where user_id = v_uid;

  return query select v_cycle_id, v_result_id, v_overall;
end;
$$;
```

✅ Esto elimina el spoofing de timestamps/scores.
✅ Cycle_id ya está “production-grade”.

---

# 4) RPC 2 — Completar misión (atómica + anti doble click)

```sql
create or replace function complete_a1_mission_transaction(
  p_mission_key text,
  p_user_notes text
)
returns table (status text, points_total int, progress_pct int)
language plpgsql
security definer
as $$
declare
  v_uid uuid := auth.uid();
  v_cycle_id uuid;
  v_points int;
  v_total int;
  v_done int;
  v_points_total int;
  v_diag int;
  v_progress int;
  v_now timestamptz := now();
begin
  if v_uid is null then raise exception 'Unauthorized'; end if;

  -- ciclo activo
  select a1_active_cycle_id into v_cycle_id
  from despega_user_profiles
  where user_id = v_uid;

  if v_cycle_id is null then
    raise exception 'No active A1 cycle';
  end if;

  -- marca misión (solo si no estaba completada)
  update despega_user_misiones
  set completed = true,
      completed_at = v_now,
      user_notes = p_user_notes,
      puntos_earned = coalesce(puntos_earned, points)
  where user_id = v_uid
    and cycle_id = v_cycle_id
    and mission_key = p_mission_key
    and completed = false
  returning coalesce(puntos_earned, points) into v_points;

  if not found then
    select points_accumulated, progress_pct
      into v_points_total, v_progress
    from despega_pilar_progress
    where user_id = v_uid and pilar = 'a1_cerebral' and cycle_id = v_cycle_id;

    return query select 'ALREADY_COMPLETED', coalesce(v_points_total,0), coalesce(v_progress,0);
    return;
  end if;

  -- lock progress row
  select diagnostic_score, total_missions_in_cycle, missions_completed, points_accumulated
    into v_diag, v_total, v_done, v_points_total
  from despega_pilar_progress
  where user_id = v_uid and pilar='a1_cerebral' and cycle_id=v_cycle_id
  for update;

  v_done := coalesce(v_done,0) + 1;
  v_points_total := coalesce(v_points_total,0) + coalesce(v_points,0);

  v_progress := case
    when coalesce(v_total,0)=0 then 0
    else round((v_done::numeric / v_total::numeric)*100)::int
  end;

  update despega_pilar_progress
  set missions_completed = v_done,
      points_accumulated = v_points_total,
      progress_pct = v_progress,
      updated_at = v_now
  where user_id = v_uid and pilar='a1_cerebral' and cycle_id=v_cycle_id;

  insert into despega_score_events(
    user_id, pilar, cycle_id, event_type,
    diagnostic_score_at_event, points_delta, points_total, progress_pct_at_event,
    context_flags, created_at
  ) values (
    v_uid, 'a1_cerebral', v_cycle_id, 'mission_completed',
    coalesce(v_diag,0), coalesce(v_points,0), v_points_total, v_progress,
    '{}'::jsonb, v_now
  );

  return query select 'SUCCESS', v_points_total, v_progress;
end;
$$;
```

---

# 5) UI/Producto final (sin contradicciones)

### A) Texto de resultados (secuencial sin presión)

* ✅ “Accede a las 5 misiones del ciclo 30 **(paso a paso, sin presión)**.”
* ✅ “Puedes explorar otros paquetes cuando quieras.”

### B) Prioridades (regla única)

* Ordena por **menor score → mayor fricción → prioridad 1**
* Empates: alfabético o editorial fijo.

### C) Sofía (100% “pattern explainer”)

Aplica los reemplazos 1:1 que te dejé antes. Regla: **cero “empezamos”, “haz”, “reserva”, “es tu anclaje”** sin condicional.

---

# 6) Server Action (Next.js) listo para prod (llama RPC 1)

```ts
export async function submitA1Checkin({
  rawAnswers, // number[20] (1..10)
  contextFlags,
  contextText,
  consentGiven,
}: {
  rawAnswers: number[];
  contextFlags: { shift: boolean; care: boolean; neuro: boolean };
  contextText?: string;
  consentGiven: boolean;
}) {
  const supabase = await createClient();

  const payload = {
    p_raw_answers: rawAnswers,
    p_context_shift: !!contextFlags.shift,
    p_context_care: !!contextFlags.care,
    p_context_neuro: !!contextFlags.neuro,
    p_context_text: consentGiven ? (contextText ?? "") : null,
    p_context_consent: !!consentGiven,
  };

  const { data, error } = await supabase.rpc("insert_a1_checkin_transaction", payload);
  if (error) throw error;

  // Revalida vistas relevantes
  revalidatePath("/despega");
  revalidatePath("/despega/rankings");

  return data; // {cycle_id, result_id, overall_score}
}
```

### Completar misión (RPC 2)

```ts
export async function completeA1Mission({
  missionKey,
  userNotes,
}: {
  missionKey: string;
  userNotes: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("complete_a1_mission_transaction", {
    p_mission_key: missionKey,
    p_user_notes: userNotes,
  });
  if (error) throw error;

  revalidatePath("/despega");
  revalidatePath("/despega/rankings");

  return data; // status, points_total, progress_pct
}
```

---

# 7) Ranking global opt-in (production safe)

* En `despega_user_profiles`: `ranking_opt_in boolean default false`
* Tu query global solo incluye usuarios con `ranking_opt_in = true`
* Para no filtrar PII: leaderboard muestra “posición + score + percentil”, no nombres/email.

Puedes hacerlo con una **view** o una RPC `get_global_rankings()` que devuelva sólo datos agregados.

---

# 8) Checklist final de producción (cero sorpresas)

### DB

* [ ] Migraciones aplicadas (cycles + constraints + indexes)
* [ ] RLS enabled en todas las tablas
* [ ] Policies mínimas (select por owner)
* [ ] RPCs con `SECURITY DEFINER` y **auth.uid() obligatorio**
* [ ] Clientes **NO** insert/update directo a tablas sensibles (solo RPC)

### App

* [ ] localStorage sin PII (solo flags UX)
* [ ] “Mi Evolución” por defecto
* [ ] Prioridad ordenada por fricción real
* [ ] Sofía sin frases directivas

### Observabilidad

* [ ] Logs de fallos RPC (sin PII)
* [ ] Métrica: % errores por RPC, % doble submit detectado (ALREADY_COMPLETED)

---

## Resultado

Con esto, A1 queda **realmente listo para producción**:

* ciclo no se pisa,
* scoring no se puede falsificar,
* misiones no se duplican por doble click,
* timeline es consistente,
* privacidad/RLS en orden,
* y el lenguaje está alineado al framework.

Si quieres, el siguiente paso (rápido) es dejar **un script seed** para crear automáticamente las 5 misiones del paquete activo al iniciar ciclo (para que el usuario no “entre a un vacío”).
