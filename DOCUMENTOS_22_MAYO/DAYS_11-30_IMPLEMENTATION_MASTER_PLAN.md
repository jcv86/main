# A2 Days 11–30 Implementation Master Plan

## Executive Summary

Days 11–30 span **two major arcs**:
- **Arc 2 (Days 11–20)**: "De Tareas Normales a Valor Profesional" — Transform tasks into value, build achievement stories, reach A3 Checkpoint 2 (Day 16), then prep for CV
- **Arc 3 (Days 21–30)**: "Construir el Primer Activo Profesional Real" — Build real CV foundation, stress test, export, reach A3 Checkpoint 3 (Day 27), close month with portfolio

**Total Implementation**: 4 phases, ~8–10 weeks of development
- **Phase A (Days 11–15)**: Value alchemy + proof system (2–3 weeks)
- **Phase B (Day 16 + Days 17–20)**: A3 Checkpoint 2 + CV prep (2–3 weeks)
- **Phase C (Days 21–26)**: CV building + refinement (2–3 weeks)
- **Phase D (Days 27–30)**: A3 Checkpoint 3 + closure (1–2 weeks)

---

## Phase A: Days 11–15 — Value Alchemy & Proof System
**Duration**: 2–3 weeks | **Complexity**: High | **Database Changes**: 2 new tables | **Components**: 5

### Overview
Days 11–15 transform Day 10 value seeds into professional value statements, add proof systems, and build 3 achievement stories to prepare for A3 Module 2 checkpoint on Day 16.

### Days Breakdown

#### Day 11: Value Alchemy I
- **Mission Type**: evidence + coach_forge
- **Time**: 55–75 minutes
- **Input**: Day 10 value seeds (5 seeds)
- **Output**: 2 professional value statements with coach enhancement
- **Key Component**: Value statement builder with coach-enhanced edition
- **Database**: Loads from `a2_task_completions` (Day 10), saves to new `a2_value_statements` table
- **UI Pattern**: Multi-step (import → select 2 → transform → coach review → approve)

**Database Table Required**:
```sql
CREATE TABLE a2_value_statements (
  id UUID PRIMARY KEY,
  user_id UUID,
  day_number INT (11),
  value_seed_index INT,
  raw_statement TEXT,
  coach_enhanced_statement TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Day 12: Value Alchemy II
- **Mission Type**: evidence + builder
- **Time**: 60–80 minutes
- **Input**: Remaining 3 value seeds + 2 from Day 11 = 5 total
- **Output**: Complete Value Inventory with all 5 statements ranked & categorized
- **Key Component**: Value inventory table builder with ranking UI
- **Database**: Extends `a2_value_statements`, creates `a2_value_inventory` view/summary
- **UI Pattern**: Multi-step (import 3 more → build statements → classify → rank all 5 → export table)

**Database Table Required**:
```sql
CREATE TABLE a2_value_inventory (
  id UUID PRIMARY KEY,
  user_id UUID,
  day_number INT (12),
  statement_id UUID REFERENCES a2_value_statements(id),
  category VARCHAR(50), -- valor operativo, valor para clientes, etc
  best_use VARCHAR(50), -- CV, interview, role fit, needs proof, secondary
  strength_rank INT, -- 1=strongest, 5=weakest
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Day 13: Escala de Prueba (Impact Tags/Proof Types)
- **Mission Type**: evidence + field_action
- **Time**: 45–70 minutes
- **Input**: 5 value statements from Day 12
- **Output**: Professional Proof Map with proof types, proof fragments, & strength labels
- **Key Component**: Proof type selector + proof fragment uploader + strength classifier
- **Database**: Creates `a2_proof_map` table
- **UI Pattern**: Multi-step (import 5 → add proof types to each → upload/paste 3 fragments → DTC scores → save map)

**Database Table Required**:
```sql
CREATE TABLE a2_proof_map (
  id UUID PRIMARY KEY,
  user_id UUID,
  day_number INT (13),
  statement_id UUID REFERENCES a2_value_statements(id),
  proof_types TEXT[], -- frecuencia, escala, complejidad, confianza, riesgo, mejora, herramienta, feedback
  proof_fragment_1 TEXT, -- content or file URL
  proof_fragment_2 TEXT,
  proof_fragment_3 TEXT,
  proof_strength_1 VARCHAR(30), -- prueba fuerte, usable, débil, necesita detalle
  proof_strength_2 VARCHAR(30),
  proof_strength_3 VARCHAR(30),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Day 14: La Primera Historia de Logro (Story of Responsibility)
- **Mission Type**: builder + evidence
- **Time**: 55–75 minutes
- **Input**: Strongest value statement + proof map
- **Output**: Achievement Story 1 (Contexto → Problema → Acción → Resultado → Aprendizaje)
- **Key Component**: Story builder with coach enhancement
- **Database**: Creates `a2_achievement_stories` table
- **UI Pattern**: Multi-step (choose strongest statement → build scene → build action → build result → coach polish → approve)

**Database Table Required**:
```sql
CREATE TABLE a2_achievement_stories (
  id UUID PRIMARY KEY,
  user_id UUID,
  day_number INT (14 or 15),
  statement_id UUID REFERENCES a2_value_statements(id),
  story_index INT, -- 1, 2, 3
  context TEXT,
  problem TEXT,
  action TEXT,
  result TEXT,
  learning TEXT,
  raw_story TEXT,
  coach_enhanced_story TEXT,
  strength_score VARCHAR(20), -- strong, usable, needs revision
  clarity_score INT (1-10),
  credibility_score INT (1-10),
  impact_score INT (1-10),
  evidence_score INT (1-10),
  usefulness_score INT (1-10),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Day 15: La Cámara de Prueba (The Proof Chamber)
- **Mission Type**: coach_forge + debrief
- **Time**: 65–90 minutes
- **Input**: Achievement Story 1 + 2 more stories to build
- **Output**: 3 achievement stories + strength scores + A3 checkpoint package
- **Key Component**: Story builder × 2 (Stories 2 & 3) + coach cross-examination engine + package creator
- **Database**: Extends `a2_achievement_stories`, creates `a2_a3_checkpoint_package` table
- **UI Pattern**: Multi-step (build Story 2 → coach it → build Story 3 → coach it → cross-exam all 3 → score → package)

**Database Table Required**:
```sql
CREATE TABLE a2_a3_checkpoint_package (
  id UUID PRIMARY KEY,
  user_id UUID,
  day_number INT (15),
  checkpoint_type VARCHAR(50), -- "laboratorio-mineria-valor"
  value_statements_json JSONB, -- array of all 5 statements
  achievement_stories_json JSONB, -- array of 3 stories
  proof_fragments_json JSONB,
  strongest_story_index INT,
  weak_points_notes TEXT,
  ready_for_checkpoint BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Phase A: Development Tasks

| Task | Days | Effort | Notes |
|------|------|--------|-------|
| DB schema + migrations | - | 2–3 days | 5 new tables, indexes on user_id + day_number |
| Day 11 component | 11 | 2–3 days | Value statement builder + coach mock |
| Day 12 component | 12 | 2–3 days | Inventory table UI + ranking logic |
| Day 13 component | 13 | 3–4 days | Proof type selector + uploader + classifier |
| Day 14 component | 14 | 2–3 days | Story builder (Contexto → Resultado) |
| Day 15 component | 15 | 3–4 days | 2 more stories + cross-exam engine + package |
| A3 integration | 16 | 1–2 days | Checkpoint gate + package passing |
| Testing + fixes | - | 2–3 days | User flow, validation, coach responses |

**Total Phase A**: 16–23 days

---

## Phase B: Day 16 + Days 17–20 — A3 Checkpoint 2 & CV Prep
**Duration**: 2–3 weeks | **Complexity**: Medium | **Database Changes**: 2 new tables | **Components**: 5

### Overview
Day 16 is the A3 Checkpoint (validate achievement stories in A3 Module 2). Days 17–20 prep for CV building by gathering evidence, creating skeleton, and polishing the professional summary.

### Days Breakdown

#### Day 16: CHECKPOINT A3 Module 2 — Laboratorio de Minería de Valor
- **Mission Type**: a3_checkpoint
- **Time**: 60–90 minutes
- **Role**: Uses production A3 Module 2 route (existing)
- **Key Logic**: 
  - Unlock gate: Days 1–15 passed + A3 Module 1 completed
  - Opens ONLY A3 Module 2 (not Module 3)
  - Receives `a2_a3_checkpoint_package` from Day 15
  - User validates + improves stories inside A3
  - Returns "Basic Achievement Bank" back to A2
  - Unlocks Day 17

**Database Table Required** (for Day 16 tracking in A2):
```sql
CREATE TABLE a2_checkpoint_tracking (
  id UUID PRIMARY KEY,
  user_id UUID,
  day_number INT (16 or 27),
  checkpoint_type VARCHAR(50), -- "laboratorio-mineria-valor", "constructor-cv"
  a3_module_id INT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  a3_completion_data JSONB,
  xp_awarded INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Day 17: Caza de Evidencia para CV (CV Evidence Hunt)
- **Mission Type**: builder + field_action
- **Time**: 40–65 minutes
- **Input**: Basic Achievement Bank from A3 Module 2
- **Output**: CV Evidence Folder with ≥5 material items + missing pieces checklist
- **Key Component**: Evidence folder creator + material organizer + missing-pieces detector
- **Database**: Creates `a2_cv_evidence_folder` table
- **UI Pattern**: Multi-step (import achievement bank → create folder → add 5+ materials → DTC detects gaps → save)

**Database Table Required**:
```sql
CREATE TABLE a2_cv_evidence_folder (
  id UUID PRIMARY KEY,
  user_id UUID,
  day_number INT (17),
  material_items JSONB, -- array of {type, source, content/url, date_added}
  material_count INT,
  missing_sections TEXT[], -- no summary, missing dates, weak achievements, etc
  missing_count INT,
  folder_url VARCHAR(255), -- Notion, Google Drive, etc
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Day 18: Arquitectura del CV (CV Skeleton Day)
- **Mission Type**: builder
- **Time**: 45–70 minutes
- **Input**: CV Evidence Folder from Day 17
- **Output**: CV Skeleton (structure + empty sections + notes)
- **Key Component**: CV format selector + section mapper + skeleton generator
- **Database**: Creates `a2_cv_skeleton` table
- **UI Pattern**: Multi-step (choose format → build section order → map materials → generate skeleton → save)

**Database Table Required**:
```sql
CREATE TABLE a2_cv_skeleton (
  id UUID PRIMARY KEY,
  user_id UUID,
  day_number INT (18),
  cv_format VARCHAR(50), -- primer trabajo, profesional, cambio carrera, técnico, operaciones, comercial, liderazgo
  section_order JSONB, -- array of section names in order
  section_content JSONB, -- {section_name: {material_ids: [], status: "empty/partial/complete"}}
  material_mapping JSONB, -- {material_id: section_name}
  skeleton_content TEXT, -- raw CV skeleton
  storage_location VARCHAR(255), -- Notion, Google Docs, DOCX, etc
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Day 19: Los Primeros 10 Segundos del Reclutador (The Recruiter's First 10 Seconds)
- **Mission Type**: builder + coach_forge
- **Time**: 50–75 minutes
- **Input**: CV Skeleton + Achievement Bank + Professional Identity
- **Output**: Professional Summary v1 + first 10-second impression feedback
- **Key Component**: Summary builder + recruiter impression simulator
- **Database**: Creates `a2_professional_summary` table
- **UI Pattern**: Multi-step (import materials → build summary draft → coach reviews → recruiter sim → approve)

#### Day 20: Espejo de Carga (Load Mirror / CV Bulk Check)
- **Mission Type**: debrief + builder
- **Time**: 55–75 minutes
- **Input**: CV Skeleton + Professional Summary v1 + Achievement Stories
- **Output**: CV checklist (what exists, what's missing, what's weak)
- **Key Component**: CV quality checker + readiness scorer
- **Database**: Creates `a2_cv_readiness_check` table

### Phase B: Development Tasks

| Task | Days | Effort | Notes |
|------|------|--------|-------|
| A3 integration for Day 16 | 16 | 2–3 days | Checkpoint gate, package flow, XP award |
| Day 17 component | 17 | 2–3 days | Folder creator + material organizer |
| Day 18 component | 18 | 3–4 days | Format selector + section mapper + skeleton gen |
| Day 19 component | 19 | 3–4 days | Summary builder + recruiter simulator |
| Day 20 component | 20 | 2–3 days | CV quality checker + readiness score |
| Testing + fixes | - | 2–3 days | Material import, CV format compatibility |

**Total Phase B**: 15–21 days

---

## Phase C: Days 21–26 — CV Building & Refinement
**Duration**: 2–3 weeks | **Complexity**: High | **Database Changes**: 2 new tables | **Components**: 6

### Overview
Days 21–26 build the actual CV by improving bullets across multiple experiences, organizing skills, cleaning weak language, and stress-testing the draft before the Day 27 A3 checkpoint.

### Days Breakdown

#### Day 21: Mejora de Bullets I (Bullet Upgrade I)
- **Mission Type**: builder + evidence
- **Time**: 60–80 minutes
- **Output**: 3 improved bullets from primary experience (Acción + Área + Valor formula)
- **Key Component**: Bullet editor with coach enhancement
- **Database**: Creates `a2_cv_bullets` table

#### Day 22: Mejora de Bullets II (Bullet Upgrade II)
- **Mission Type**: builder + coach_forge
- **Time**: 60–80 minutes
- **Output**: 3 more improved bullets from secondary experience + category mapping
- **Key Component**: Bullet editor × 2 + value category classifier

#### Day 23: Arquitectura de Habilidades (Skill Architecture)
- **Mission Type**: builder + market_intel
- **Time**: 40–65 minutes
- **Output**: Skills section v1 organized by categories with evidence
- **Key Component**: Skill category organizer + evidence linker + market match checker
- **Database**: Creates `a2_cv_skills` table

#### Day 24: Juicio de Palabras Vacías (Empty Words Trial)
- **Mission Type**: builder + debrief
- **Time**: 45–65 minutes
- **Output**: Cleaned CV language (remove generic words, add evidence)
- **Key Component**: Weak language detector + rewriter

#### Day 25: Prueba de Estrés del CV (CV Stress Test)
- **Mission Type**: debrief + builder
- **Time**: 50–75 minutes
- **Output**: CV Stress Test Report with scores + revision list
- **Key Component**: Recruiter scan simulator + scoring engine + fix-list generator
- **Database**: Creates `a2_cv_stress_test` table

#### Day 26: Ritual de Exportación (Export Ritual)
- **Mission Type**: field_action + builder
- **Time**: 35–60 minutes
- **Output**: CV exported to external format + uploaded back to DTC
- **Key Component**: Export generator + file uploader + readiness checker
- **Database**: Creates `a2_cv_export` table

### Phase C: Development Tasks

| Task | Days | Effort | Notes |
|------|------|--------|-------|
| DB schema | - | 2–3 days | 2–3 new tables for bullets, skills, stress test |
| Days 21–22 components | 21–22 | 3–4 days | Bullet builder with coach enhancement |
| Day 23 component | 23 | 3–4 days | Skill organizer + evidence linker |
| Day 24 component | 24 | 2–3 days | Weak language detector + rewriter |
| Day 25 component | 25 | 3–4 days | Stress test simulator + scoring + fixes |
| Day 26 component | 26 | 2–3 days | Export generator + uploader |
| Testing + fixes | - | 2–3 days | CV structure validation, format export |

**Total Phase C**: 17–25 days

---

## Phase D: Days 27–30 — A3 Checkpoint 3 & Closure
**Duration**: 1–2 weeks | **Complexity**: Medium | **Database Changes**: 1 new table | **Components**: 4

### Overview
Day 27 is the A3 Checkpoint (validate CV in A3 Module 3). Days 28–30 provide recruiter perspective, portfolio assembly, and month-end closure.

### Days Breakdown

#### Day 27: CHECKPOINT A3 Module 3 — Estudio Constructor de CV
- **Mission Type**: a3_checkpoint
- **Time**: 60–90 minutes
- **Role**: Uses production A3 Module 3 route (existing)
- **Key Logic**:
  - Unlock gate: Days 1–26 completed + A3 Module 1 & 2 completed
  - Opens ONLY A3 Module 3
  - Does NOT open A3 Module 4
  - User validates CV inside A3
  - Returns "Basic CV Draft" validated back to A2

#### Day 28: Ojos de Reclutador (Recruiter Eyes)
- **Mission Type**: debrief + market_intel
- **Time**: 35–55 minutes
- **Output**: CV review notes from recruiter perspective
- **Key Component**: 10-second recruiter scan questionnaire + perception simulator
- **Database**: Creates `a2_recruiter_perspective` table

#### Day 29: Portafolio de Fundación (Foundation Portfolio)
- **Mission Type**: builder + debrief
- **Time**: 45–70 minutes
- **Output**: Foundation Portfolio (all 29-day assets assembled + status + growth visualization)
- **Key Component**: Portfolio assembler + asset status checker + progress visualizer
- **Database**: Creates `a2_foundation_portfolio` table

#### Day 30: Umbral de Mes — Reflexión y Preparación para Arc 2
- **Mission Type**: debrief + milestone
- **Time**: 60–90 minutes
- **Output**: 30-day closure report + Arc 2 readiness assessment + Day 31+ preview
- **Key Component**: Milestone closure ceremony + Arc 2 preview
- **Database**: Creates `a2_month1_closure` table

### Phase D: Development Tasks

| Task | Days | Effort | Notes |
|------|------|--------|-------|
| A3 integration for Day 27 | 27 | 1–2 days | Checkpoint gate, CV validation, Basic CV Draft return |
| Day 28 component | 28 | 2–3 days | 10-second scan questions + recruiter perception sim |
| Day 29 component | 29 | 2–3 days | Portfolio assembler + asset visualizer |
| Day 30 component | 30 | 2–3 days | Closure ceremony + Arc 2 preview |
| Testing + fixes | - | 1–2 days | Milestone logic, portfolio integrity |

**Total Phase D**: 8–13 days

---

## Complete Implementation Timeline

```
Week 1–3:   Phase A (Days 11–15) — Value alchemy + proof system
            DB: 5 tables
            Components: 5
            Est. 16–23 days
            
Week 2–3:   Phase B (Day 16 + Days 17–20) — A3 Checkpoint 2 + CV prep
            DB: 2 tables
            Components: 5
            Est. 15–21 days (overlaps with Phase A end)
            
Week 4–5:   Phase C (Days 21–26) — CV building + refinement
            DB: 2–3 tables
            Components: 6
            Est. 17–25 days
            
Week 5–6:   Phase D (Days 27–30) — A3 Checkpoint 3 + closure
            DB: 1 table
            Components: 4
            Est. 8–13 days

TOTAL: 8–10 weeks of development
```

---

## Database Schema Summary

### New Tables Required (10 total)

| Table | Day | Purpose | Key Fields |
|-------|-----|---------|-----------|
| `a2_value_statements` | 11–12 | Store value statements | user_id, day_number, statement, category |
| `a2_value_inventory` | 12 | Value ranking + classification | user_id, statement_id, best_use, strength_rank |
| `a2_proof_map` | 13 | Proof types + fragments | user_id, statement_id, proof_types[], fragments[] |
| `a2_achievement_stories` | 14–15 | Achievement stories | user_id, story_index, context, action, result, scores |
| `a2_a3_checkpoint_package` | 15 | A3 checkpoint input | user_id, checkpoint_type, all_data_json |
| `a2_checkpoint_tracking` | 16, 27 | Checkpoint state | user_id, day_number, checkpoint_type, a3_data |
| `a2_cv_evidence_folder` | 17 | CV material collection | user_id, material_items[], missing_sections[] |
| `a2_cv_skeleton` | 18 | CV structure | user_id, format, section_order, material_mapping |
| `a2_cv_bullets` | 21–22 | Improved bullets | user_id, experience_index, raw, enhanced, category |
| `a2_cv_skills` | 23 | Skills section | user_id, category, skill_list[], evidence_map |
| `a2_cv_stress_test` | 25 | Stress test results | user_id, scores, fixes_applied |
| `a2_cv_export` | 26 | Exported CV tracking | user_id, export_format, file_url, uploaded_at |
| `a2_recruiter_perspective` | 28 | Recruiter feedback | user_id, scan_answers, perception_sim |
| `a2_foundation_portfolio` | 29 | All assets portfolio | user_id, assets_json, status_map, visualization |

---

## Key Implementation Notes

### 1. Coach & AI Integration
- Days 11–15: Coach enhances value statements, builds achievement stories
- Days 21–24: Coach rewrites bullets, cleans language
- Days 25–28: Coach provides feedback through stress test, recruiter sim

**Coach Implementation**: Each day component calls `/api/coach/*` endpoint with day-specific prompt

### 2. A3 Checkpoint Logic
- **Day 16**: A2 Day 15 → `a2_a3_checkpoint_package` → A3 Module 2 → returns Basic Achievement Bank → unlocks Day 17
- **Day 27**: A2 Day 26 → uploaded CV → A3 Module 3 → returns Basic CV Draft → unlocks Day 28

### 3. Database Indexing Strategy
```sql
CREATE INDEX idx_a2_user_day ON a2_value_statements(user_id, day_number);
CREATE INDEX idx_a2_user_created ON a2_value_statements(user_id, created_at);
```

### 4. Component Reuse Patterns
- **Builder pattern**: Used in Days 11–12, 14–15, 18–22 (multi-step forms)
- **Evidence linker**: Used in Days 13–15, 17, 19–23
- **Coach forger**: Used in Days 11–12, 14–15, 19, 21–24
- **Simulator**: Used in Days 19, 25, 28

### 5. Data Flow Between Days
```
Day 10 (value seeds) → Day 11 (statements) → Day 12 (inventory) → Day 13 (proof) → Day 14–15 (stories)
    ↓
Day 16 (A3 Module 2 validation) → returns Basic Achievement Bank
    ↓
Day 17 (evidence gather) → Day 18 (skeleton) → Day 19 (summary) → Day 20 (checklist)
    ↓
Days 21–26 (CV building) → Day 27 (A3 Module 3 validation) → Day 28–30 (closure)
```

---

## Deliverables & Metrics

### By Phase End

**Phase A End (Day 15)**:
- ✅ 5 professional value statements
- ✅ 3 achievement stories with proof
- ✅ Ready for A3 Module 2 validation

**Phase B End (Day 20)**:
- ✅ Basic Achievement Bank from A3 Module 2
- ✅ CV Evidence Folder with ≥5 materials
- ✅ CV Skeleton with structure
- ✅ Professional Summary v1

**Phase C End (Day 26)**:
- ✅ 6+ improved bullets (3 from each experience)
- ✅ Skills section v1
- ✅ Clean CV language (empty words removed)
- ✅ CV Stress Test Report + fixes applied
- ✅ Exported & uploaded CV draft

**Phase D End (Day 30)**:
- ✅ Basic CV Draft from A3 Module 3 validation
- ✅ Recruiter Eyes notes
- ✅ Foundation Portfolio (all 29-day assets)
- ✅ Month-end closure + Arc 2 preview

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Coach AI responses too verbose | Template max lengths, truncation logic |
| Users skip CV Skeleton step | Make Day 18 high-friction until completed |
| Proof fragments too vague | Day 13 validation requires ≥2 usable proofs |
| Stories fail A3 validation | Days 14–15 stress test + scoring prevents weak stories |
| CV export fails | Day 26 includes file validation + format checking |
| A3 checkpoint gate breaks | Extensive unlock requirement testing |

---

## Success Metrics

- **Phase A**: 85%+ users complete Day 15 with ≥3 stories, ≥2 strong proofs
- **Phase B**: 90%+ users complete Day 20 with CV Skeleton + Summary v1
- **Phase C**: 80%+ users complete Day 26 with <5 critical stress test issues
- **Phase D**: 75%+ users reach Day 30 with Foundation Portfolio visible

