# A2 Days 11–30: Detailed Component Specifications

## Component Index

**Phase A (Days 11–15)**: 5 components
**Phase B (Day 16 + Days 17–20)**: 5 components  
**Phase C (Days 21–26)**: 6 components
**Phase D (Days 27–30)**: 4 components

---

## PHASE A: Days 11–15

### Component A1: Day 11 Value Statement Builder
**File**: `components/a2-day11-experience.tsx`

**Props**:
```tsx
interface Day11ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load 5 value seeds from Day 10's `a2_task_completions` table
- Multi-step UI:
  - **Step 1**: Import + display all 5 seeds
  - **Step 2**: User selects 2 strongest + explains why
  - **Step 3**: Transform each into value statement using formula
  - **Step 4**: Coach enhances both (API call)
  - **Step 5**: User approves or edits
- Save to `a2_value_statements` table (2 rows)

**API Calls**:
- `GET /api/a2/day-10/seeds?user_id=X` — Load Day 10 seeds
- `POST /api/coach/enhance-value-statement` — Coach enhancement

**Key UI Pattern**:
- Card-based steps with progress indicator
- Expandable seed preview
- Inline editor for value statement text
- Coach response shown in highlighted box

---

### Component A2: Day 12 Value Inventory Organizer
**File**: `components/a2-day12-experience.tsx`

**Props**:
```tsx
interface Day12ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load 2 statements from Day 11 + remaining 3 seeds from Day 10
- Multi-step UI:
  - **Step 1**: Display 2 from Day 11, build 3 more from remaining seeds
  - **Step 2**: Coach enhances the 3 new statements
  - **Step 3**: Classify all 5 by category dropdown
  - **Step 4**: Rank all 5 (1=strongest for CV, 5=needs proof)
  - **Step 5**: Generate table with all 5 + metadata
- Save to `a2_value_inventory` table (5 rows)

**Key UI Pattern**:
- Reusable statement builder component (used 3×)
- Category selector dropdown
- Ranking drag-and-drop or numbered
- Final table with columns: Declaración | Categoría | Mejor uso | Fuerza

---

### Component A3: Day 13 Proof Type Selector & Fragment Uploader
**File**: `components/a2-day13-experience.tsx`

**Props**:
```tsx
interface Day13ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load 5 statements from `a2_value_inventory`
- Multi-step UI:
  - **Step 1**: Display all 5 statements
  - **Step 2**: For each statement, user selects proof types (multi-select checkboxes):
    - Frecuencia (diario, semanal, mensual, repetido)
    - Escala (1 persona, equipo, depto, clientes, sucursal)
    - Complejidad (difícil, urgente, sensible, presión)
    - Confianza, Riesgo, Mejora, Herramienta, Feedback
  - **Step 3**: For each statement, user uploads/pastes 3 proof fragments
    - File upload OR text paste
    - Proof types: screenshot, email, report, memory note, etc.
  - **Step 4**: DTC scores each fragment (strong/usable/weak/needs detail)
  - **Step 5**: Save to `a2_proof_map` table
- Save to `a2_proof_map` table (5 rows)

**Key UI Pattern**:
- Accordion for each statement
- Checkbox grid for proof types
- Multi-file uploader with drag-drop
- Color-coded strength badges

---

### Component A4: Day 14 Story Builder (Contexto → Resultado)
**File**: `components/a2-day14-experience.tsx`

**Props**:
```tsx
interface Day14ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load strongest value statement from `a2_value_inventory` + its proof from `a2_proof_map`
- Multi-step UI:
  - **Step 1**: Choose strongest statement (auto-selected)
  - **Step 2**: Build story scene (¿Dónde? ¿Cuál era la situación? ¿Qué problema?)
  - **Step 3**: Build action (¿Qué hiciste? ¿Qué decisiones? ¿Qué herramientas?)
  - **Step 4**: Build result (¿Qué cambió? ¿Quién se benefició? ¿Qué aprendiste?)
  - **Step 5**: Coach enhances into polished story (Context → Problem → Action → Result → Learning)
  - **Step 6**: User approves
- Save to `a2_achievement_stories` table (1 row with story_index=1)

**API Calls**:
- `POST /api/coach/enhance-achievement-story` — Coach polish

**Key UI Pattern**:
- 4-step form with text areas
- Coach response as highlighted "polished story" block
- Edit button to refine coach's version

---

### Component A5: Day 15 Multi-Story Builder + Cross-Examination Engine
**File**: `components/a2-day15-experience.tsx`

**Props**:
```tsx
interface Day15ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load Achievement Story 1 from Day 14 + 2 more value statements
- Multi-step UI:
  - **Step 1**: Display Story 1 from Day 14
  - **Step 2**: Build Story 2 (same flow as Day 14)
  - **Step 3**: Build Story 3 (same flow as Day 14)
  - **Step 4**: Cross-examination engine:
    - DTC asks each story: "¿Qué hiciste exactamente? ¿Por qué importó?"
    - Score each: clarity (1–10), credibility (1–10), impact (1–10), evidence (1–10), usefulness (1–10)
    - Label: strong / usable / needs revision
  - **Step 5**: Package for A3 Module 2
    - Bundle: 5 value statements + 3 achievement stories + 3 proof fragments + strongest candidate
- Save to `a2_achievement_stories` table (3 rows with story_index=1,2,3)
- Save to `a2_a3_checkpoint_package` table (1 row)

**Key UI Pattern**:
- Reusable story builder component (Days 14 & 15)
- Score display as visual bars (1–10 scales)
- Strength badge (green=strong, yellow=usable, red=needs revision)
- "Ready for A3" confirmation screen

---

## PHASE B: Day 16 + Days 17–20

### Component B1: Day 16 A3 Checkpoint Gate (existing A3 Module 2)
**File**: No new file (uses existing A3 route)

**Role**:
- A2 unlock gate checks:
  - Days 1–15 completed
  - A3 Module 1 completed
  - Current day = 16
- Opens ONLY A3 Module 2
- Receives `a2_a3_checkpoint_package` from Day 15
- Returns "Basic Achievement Bank" to A2
- Unlocks Day 17 + awards 100 XP

**Database**:
- Inserts row into `a2_checkpoint_tracking` table
- Marks day_number=16, checkpoint_type="laboratorio-mineria-valor"
- Stores returned a3_completion_data as JSONB

---

### Component B2: Day 17 CV Evidence Folder Creator
**File**: `components/a2-day17-experience.tsx`

**Props**:
```tsx
interface Day17ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load Basic Achievement Bank from A3 Module 2 + Day 16 checkpoint
- Multi-step UI:
  - **Step 1**: Import + display achievement bank
  - **Step 2**: Instructions to create external folder (Notion/Google Docs/etc)
  - **Step 3**: User adds ≥5 material items:
    - Type selector (old CV, LinkedIn, job history, education, certification, tools, achievement story, evidence, project, portfolio)
    - Content input (text, URL, or upload)
  - **Step 4**: DTC detects missing pieces:
    - no summary, missing dates, weak achievements, unclear roles, missing skills, missing tools, no education, no target role
  - **Step 5**: Save folder path + material list + missing pieces
- Save to `a2_cv_evidence_folder` table (1 row)

**Key UI Pattern**:
- Material type selector
- Repeatable material item form
- Missing-pieces checklist with badges

---

### Component B3: Day 18 CV Skeleton Generator
**File**: `components/a2-day18-experience.tsx`

**Props**:
```tsx
interface Day18ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load CV Evidence Folder from Day 17
- Multi-step UI:
  - **Step 1**: Choose CV format (primer trabajo, profesional, cambio carrera, técnico, operaciones, comercial, liderazgo)
  - **Step 2**: Build section order (drag-to-order default sections or custom)
  - **Step 3**: Map materials to sections
    - Select material → assign to section
  - **Step 4**: DTC generates skeleton
    - Empty sections with notes
    - Material assignments visible
  - **Step 5**: Save skeleton (can download or stay in DTC)
- Save to `a2_cv_skeleton` table (1 row)

**Key UI Pattern**:
- Format selector with descriptions
- Drag-to-order sections
- Material mapping matrix
- Skeleton export preview

---

### Component B4: Day 19 Summary Builder + Recruiter Simulator
**File**: `components/a2-day19-experience.tsx`

**Props**:
```tsx
interface Day19ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load CV Skeleton + Achievement Bank + Professional Identity
- Multi-step UI:
  - **Step 1**: Show imported materials
  - **Step 2**: User writes summary draft (50–100 words)
  - **Step 3**: Coach enhances (API call)
  - **Step 4**: Recruiter simulator:
    - "What do you understand about this person in 10 seconds?"
    - DTC generates first impression, strengths, doubts, likely questions
  - **Step 5**: User approves
- Save to `a2_professional_summary` table (1 row)

**API Calls**:
- `POST /api/coach/enhance-professional-summary`
- `POST /api/simulator/recruiter-impression` (uses coach API with simulator prompt)

**Key UI Pattern**:
- Textarea for summary draft
- Coach enhancement box (highlighted)
- Recruiter impression sim as card with subsections

---

### Component B5: Day 20 CV Readiness Checker
**File**: `components/a2-day20-experience.tsx`

**Props**:
```tsx
interface Day20ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load all materials from Days 17–19
- Multi-step UI:
  - **Step 1**: DTC audit CV completeness:
    - Summary: exists/weak/missing
    - Bullets: count (need ≥6)
    - Skills: exists/weak/missing
    - Education: exists/missing
    - Tools: exists/missing
    - Achievements: count, strength
  - **Step 2**: Generate readiness checklist
    - Green: complete
    - Yellow: partial
    - Red: missing/weak
  - **Step 3**: Show percentage readiness score
  - **Step 4**: Suggest priorities for Days 21–26
  - **Step 5**: Save checklist
- Save to `a2_cv_readiness_check` table (1 row)

**Key UI Pattern**:
- Audit matrix with status badges
- Readiness percentage bar
- Priority checklist

---

## PHASE C: Days 21–26

### Component C1–C2: Days 21–22 Bullet Editors (Primary & Secondary Experience)
**File**: `components/a2-day21-experience.tsx` + `components/a2-day22-experience.tsx`

**Props**:
```tsx
interface DayBulletExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
  dayNumber: 21 | 22
}
```

**Features** (Day 21 & 22 identical flow):
- Multi-step UI:
  - **Step 1**: User selects experience (most recent for Day 21, secondary for Day 22)
  - **Step 2**: User writes 3 raw bullets (weak versions)
  - **Step 3**: Teach formula (Acción + Área + Valor)
  - **Step 4**: Coach upgrades all 3 (API call)
  - **Step 5**: User approves or edits each
- Save to `a2_cv_bullets` table (3 rows per day × 2 days = 6 rows total)

**API Calls**:
- `POST /api/coach/upgrade-bullets` — coach enhances all 3

**Key UI Pattern**:
- Experience selector dropdown
- 3-bullet form with "before" + "after coach" layout
- Edit mode on each bullet

---

### Component C3: Day 23 Skill Architect
**File**: `components/a2-day23-experience.tsx`

**Props**:
```tsx
interface Day23ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load bullets from Days 21–22 + market signals
- Multi-step UI:
  - **Step 1**: Import market signals + achievement bank
  - **Step 2**: User creates skill categories (checkboxes + custom input)
  - **Step 3**: For each category, user adds skills (text input)
  - **Step 4**: For ≥5 skills, add evidence (where used, what role, what result)
  - **Step 5**: DTC compares with market signals
    - Mark: matches market, missing, weakly proven, should appear
  - **Step 6**: Coach creates clean skills section (API call)
- Save to `a2_cv_skills` table (1 row with array of skills + evidence)

**Key UI Pattern**:
- Category selector with examples
- Repeatable skill + evidence form
- Market match badges

---

### Component C4: Day 24 Empty Words Trial
**File**: `components/a2-day24-experience.tsx`

**Props**:
```tsx
interface Day24ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load all CV materials (summary, bullets, skills)
- Multi-step UI:
  - **Step 1**: DTC scans for empty words (responsible, proactive, dynamic, etc.)
  - **Step 2**: For each detected word/phrase:
    - User chooses: prove it / replace it / delete it
  - **Step 3**: Coach rewrites weak phrases (API call)
  - **Step 4**: Show cleaned CV language
  - **Step 5**: User approves
- Save cleaned language to database (or update existing rows)

**API Calls**:
- `POST /api/coach/detect-empty-words` — scan CV
- `POST /api/coach/rewrite-weak-phrases` — rewrite

**Key UI Pattern**:
- Detected phrases highlighted with badge
- Action selector (prove/replace/delete)
- Before + after rewrite display

---

### Component C5: Day 25 CV Stress Test Engine
**File**: `components/a2-day25-experience.tsx`

**Props**:
```tsx
interface Day25ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load full CV draft (all sections)
- Multi-step UI:
  - **Step 1**: DTC runs recruiter scan test:
    - ¿Se entiende el perfil en 10 segundos?
    - ¿El resumen tiene dirección?
    - ¿La experiencia muestra valor?
    - ¿Los bullets son claros?
    - ¿Las habilidades están organizadas?
    - ¿Hay evidencia suficiente?
    - ¿CV conecta con mercado?
  - **Step 2**: Score CV on 7 metrics (1–10 each):
    - claridad, estructura, especificidad, evidencia, alineación, lectura rápida, lenguaje profesional
  - **Step 3**: Generate revision list:
    - Critical fixes, Recommended improvements, Optional polish
  - **Step 4**: User applies ≥3 improvements
  - **Step 5**: Save report + improved CV draft
- Save to `a2_cv_stress_test` table (1 row)

**Key UI Pattern**:
- Recruiter scan questions as cards
- Score visualization (1–10 bars)
- Revision items with checkboxes (critical=red, recommended=yellow, optional=gray)
- Before + after CV preview

---

### Component C6: Day 26 Export Ritual
**File**: `components/a2-day26-experience.tsx`

**Props**:
```tsx
interface Day26ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load final CV draft
- Multi-step UI:
  - **Step 1**: Pre-export checklist (summary ✓, bullets ✓, skills ✓, stress test ✓, improvements ✓)
  - **Step 2**: Choose export format:
    - PDF, DOCX, upload from local
  - **Step 3**: DTC generates file + user downloads
  - **Step 4**: User uploads file back to DTC
  - **Step 5**: DTC validates:
    - File readable, sections present, ready for A3
- Save to `a2_cv_export` table (1 row)

**Key UI Pattern**:
- Pre-export checklist
- Format selector with descriptions
- Export progress bar
- Upload area with drag-drop
- "Ready for A3 Checkpoint" confirmation

---

## PHASE D: Days 27–30

### Component D1: Day 27 A3 Checkpoint Gate (existing A3 Module 3)
**File**: No new file (uses existing A3 route)

**Role**:
- A2 unlock gate checks:
  - Days 1–26 completed
  - A3 Module 1 & 2 completed
  - Current day = 27
- Opens ONLY A3 Module 3
- Does NOT open A3 Module 4
- Receives exported CV from Day 26
- Returns "Basic CV Draft" to A2
- Unlocks Day 28 + awards 120 XP

**Database**:
- Inserts row into `a2_checkpoint_tracking` table
- Marks day_number=27, checkpoint_type="constructor-cv"
- Stores returned a3_completion_data as JSONB

---

### Component D2: Day 28 Recruiter Eyes
**File**: `components/a2-day28-experience.tsx`

**Props**:
```tsx
interface Day28ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Load Basic CV Draft from A3 Module 3
- Multi-step UI:
  - **Step 1**: "Scan your CV in 10 seconds" — user answers:
    - What do you understand in first 10 seconds?
    - What generates trust?
    - What generates doubts?
    - What question would recruiter ask?
  - **Step 2**: DTC simulates recruiter perception:
    - First impression, Visible strengths, Possible doubts, Likely questions
  - **Step 3**: User writes 1 improvement note for later
    - Options: clarify role direction, add proof, adapt to vacancy, improve tools, clarify dates, shorten summary, strengthen bullets
  - **Step 4**: Save recruiter-view notes
- Save to `a2_recruiter_perspective` table (1 row)

**Key UI Pattern**:
- Scan questions as text areas
- Recruiter perception sim as card
- Improvement note as dropdown + text input

---

### Component D3: Day 29 Foundation Portfolio Assembler
**File**: `components/a2-day29-experience.tsx`

**Props**:
```tsx
interface Day29ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Gather all 29-day assets from database
- Multi-step UI:
  - **Step 1**: DTC assembles all assets:
    - Roadmap aprobado, Bóveda de Evidencia, Reporte Señales, Tablero Candidato
    - Identidad Profesional v1, Career Mirror, Achievement Bank
    - CV Skeleton, Summary v1, Bullets, Skills, CV Draft
    - Stress Test Report, Recruiter Eyes Notes
    - (Total: 12–15 assets)
  - **Step 2**: Status check each asset (complete/partial/missing/needs revision)
  - **Step 3**: Visualize progress:
    - Timeline of 29 days
    - Asset completeness % by phase
    - Growth radar (identity clarity, value clarity, CV strength, market alignment)
  - **Step 4**: Portfolio download option
  - **Step 5**: Save portfolio summary
- Save to `a2_foundation_portfolio` table (1 row)

**Key UI Pattern**:
- Asset list with status badges
- Progress visualization (bars/radar/timeline)
- Download portfolio as PDF/ZIP
- Growth metrics dashboard

---

### Component D4: Day 30 Umbral de Mes (Month Closure Ceremony)
**File**: `components/a2-day30-experience.tsx`

**Props**:
```tsx
interface Day30ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}
```

**Features**:
- Multi-step UI:
  - **Step 1**: 30-day recap
    - Days completed: 30/30
    - Identity clarity score, Value clarity score, CV foundation score
    - Total XP earned
  - **Step 2**: Arc 1 completion celebration
    - "Fin de LA INVESTIGACIÓN DE FUNDAMENTOS"
    - Show Foundation Portfolio summary
  - **Step 3**: Arc 2 preview
    - "Próximo: OPTIMIZACIÓN Y APLICACIÓN EN MERCADO"
    - Tease Days 31–60 (interview prep, applications, networking)
  - **Step 4**: Arc 2 readiness check
    - Are you ready to start Days 31–60? (Yes/No)
    - Can continue to Day 31 or take break
  - **Step 5**: Save closure data + unlock Day 31 (optional)
- Save to `a2_month1_closure` table (1 row)

**Key UI Pattern**:
- Celebration animation/confetti
- Stats dashboard (completed, XP, scores)
- Arc 2 preview cards/carousel
- Readiness yes/no buttons

---

## Shared Utilities & Patterns

### Data Loading Pattern (All Components)

```tsx
// Every component loads data from previous days
async function loadPreviousDayData() {
  if (!userId) return
  const { data, error } = await supabase
    .from(`a2_table_name`)
    .select('*')
    .eq('user_id', userId)
    .eq('day_number', previousDayNumber)
    .single()
  
  if (error) {
    setError('Failed to load previous day')
    return
  }
  return data
}
```

### Coach API Pattern (All AI Components)

```tsx
// All coaching calls follow same pattern
async function callCoach(prompt: string) {
  const response = await fetch('/api/coach/enhance', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      userId,
      dayNumber,
      context: 'A2_DAY_X'
    })
  })
  
  const { enhanced } = await response.json()
  return enhanced
}
```

### Completion Pattern (All Components)

```tsx
// All days save + unlock same way
async function handleComplete() {
  // 1. Save to database
  await supabase.from(`a2_table_${dayNumber}`).insert({
    user_id: userId,
    day_number: dayNumber,
    data: submissionData,
    created_at: new Date()
  })
  
  // 2. Mark task complete
  await markTaskComplete(30, dayNumber, `Día ${dayNumber}`)
  
  // 3. Call onComplete
  await onComplete({ dayNumber, data: submissionData })
}
```

---

## Database Indexing (All Tables)

```sql
-- Applied to every a2_* table
CREATE INDEX idx_a2_user_day ON a2_table(user_id, day_number);
CREATE INDEX idx_a2_user_created ON a2_table(user_id, created_at);
CREATE INDEX idx_a2_day ON a2_table(day_number);
```

---

## Testing Strategy

- **Unit tests**: Each component in isolation
- **Integration tests**: Day-to-day data flow (Day 11 → Day 12 → Day 15 → A3)
- **User flow tests**: Complete Days 11–15 → A3 Checkpoint 2 → Days 17–20
- **Stress test**: Large CV inputs, multi-day concurrent users
- **A3 gate tests**: Unlock conditions, checkpoint validation

---

**Document Version**: 1.0 | **Status**: Ready for Development

