# A2 Days 11–30: Quick Phase Reference

## Overview: 4 Phases, 8–10 Weeks, 30 Days

```
PHASE A (Weeks 1–3)        | PHASE B (Weeks 2–3)        | PHASE C (Weeks 4–5)        | PHASE D (Weeks 5–6)
Days 11–15                 | Day 16 + Days 17–20        | Days 21–26                 | Days 27–30
─────────────────────────────────────────────────────────────────────────────────────────────────────
Value Alchemy & Proof      | A3 Checkpoint 2 + CV Prep  | CV Building & Refinement   | A3 Checkpoint 3 & Closure
─────────────────────────────────────────────────────────────────────────────────────────────────────
→ 5 value statements       | → Achievement Bank         | → 6+ bullet improvements  | → CV validated by A3
→ 3 achievement stories    | → CV Evidence Folder       | → Skills section v1       | → Recruiter perspective
→ Proof system ready       | → CV Skeleton              | → Clean language          | → Foundation Portfolio
→ Ready for A3 Module 2    | → Professional Summary v1  | → CV Stress Test Report   | → 30-day closure
```

---

## Phase A: Days 11–15 — Value Alchemy & Proof System

**Goal**: Transform Day 10 value seeds into professional value statements + achievement stories

### Days at a Glance

| Day | Title | Time | Input | Output | Key Action |
|-----|-------|------|-------|--------|-----------|
| 11 | Value Alchemy I | 55–75m | 5 value seeds | 2 value statements | Select 2 strongest + coach enhance |
| 12 | Value Alchemy II | 60–80m | Remaining 3 + 2 from Day 11 | 5 complete + ranked | Classify + rank all 5 |
| 13 | Escala de Prueba | 45–70m | 5 value statements | Professional Proof Map | Add proof types + fragments |
| 14 | Primera Historia | 55–75m | Strongest statement + proof | Achievement Story 1 | Build scene → action → result |
| 15 | Cámara de Prueba | 65–90m | Story 1 + 2 more | 3 stories + package | Build + stress-test + package |

### DB Tables (5)
- `a2_value_statements` — stores all value statements with coaching
- `a2_value_inventory` — ranks & categorizes statements
- `a2_proof_map` — maps proof types & fragments to each statement
- `a2_achievement_stories` — 3 achievement stories with context→result
- `a2_a3_checkpoint_package` — bundled for A3 Module 2 validation

### Components (5)
1. **Day 11**: Value Statement Builder + Coach Enhancement
2. **Day 12**: Inventory Organizer + Ranking UI
3. **Day 13**: Proof Type Selector + Fragment Uploader
4. **Day 14**: Story Builder (Scene + Action + Result)
5. **Day 15**: Multi-Story Builder + Cross-Examination Engine

### Effort: 16–23 days
- DB: 2–3 days
- Components: 12–15 days
- Testing: 2–3 days

---

## Phase B: Day 16 + Days 17–20 — A3 Checkpoint 2 + CV Prep

**Goal**: Validate achievement stories in A3 Module 2, then gather CV material & build skeleton

### Days at a Glance

| Day | Title | Time | Input | Output | Key Action |
|-----|-------|------|-------|--------|-----------|
| 16 | A3 Checkpoint 2 | 60–90m | a2_a3_checkpoint_package | Basic Achievement Bank | Validate in A3 Module 2 |
| 17 | CV Evidence Hunt | 40–65m | Achievement Bank | CV Evidence Folder | Gather ≥5 material items |
| 18 | CV Skeleton | 45–70m | Evidence Folder | CV Skeleton | Build section order + map |
| 19 | 10 Segundos | 50–75m | Skeleton + Materials | Professional Summary v1 | Build + recruiter sim |
| 20 | CV Load Mirror | 55–75m | All materials | CV Readiness Checklist | Check what's missing/weak |

### DB Tables (2)
- `a2_checkpoint_tracking` — tracks A3 checkpoint gate/completion
- `a2_cv_evidence_folder` — material collection + missing pieces
- `a2_cv_skeleton` — CV structure with section mapping
- `a2_professional_summary` — summary v1 + recruiter feedback
- `a2_cv_readiness_check` — quality checklist

### Components (5)
1. **Day 16**: A3 Integration (exists, just unlock gate)
2. **Day 17**: Evidence Folder Creator + Material Organizer
3. **Day 18**: CV Format Selector + Section Mapper
4. **Day 19**: Summary Builder + Recruiter Simulator
5. **Day 20**: CV Quality Checker + Readiness Scorer

### Effort: 15–21 days
- DB: 1–2 days
- Components: 10–15 days
- Testing + A3 integration: 2–3 days

---

## Phase C: Days 21–26 — CV Building & Refinement

**Goal**: Build real CV by improving bullets, organizing skills, cleaning language, stress-testing

### Days at a Glance

| Day | Title | Time | Input | Output | Key Action |
|-----|-------|------|-------|--------|-----------|
| 21 | Bullets I | 60–80m | Evidence + Achievements | 3 improved bullets (Primary role) | Formula: Action + Area + Value |
| 22 | Bullets II | 60–80m | Evidence + Achievements | 3 improved bullets (Secondary role) | Formula + category mapping |
| 23 | Skill Architecture | 40–65m | Market signals + Bullets | Skills section v1 | Organize + add evidence |
| 24 | Empty Words Trial | 45–65m | All CV materials | Cleaned language | Detect + replace/prove generic words |
| 25 | Stress Test | 50–75m | Full CV draft | Report + fix list | Recruiter scan + scores |
| 26 | Export Ritual | 35–60m | Final CV draft | Exported + uploaded | Save external + upload back |

### DB Tables (3)
- `a2_cv_bullets` — improved bullets with categories
- `a2_cv_skills` — organized skills + evidence links
- `a2_cv_stress_test` — test report + scores + fixes
- `a2_cv_export` — export tracking + file URLs

### Components (6)
1. **Days 21–22**: Bullet Editor × 2 (Primary + Secondary)
2. **Day 23**: Skill Organizer + Evidence Linker
3. **Day 24**: Weak Language Detector + Rewriter
4. **Day 25**: Recruiter Scan Simulator + Scoring Engine
5. **Day 26**: Export Generator + File Uploader

### Effort: 17–25 days
- DB: 2–3 days
- Components: 12–18 days
- Testing: 2–3 days

---

## Phase D: Days 27–30 — A3 Checkpoint 3 & Closure

**Goal**: Validate CV in A3 Module 3, then provide recruiter feedback, assemble portfolio, close month

### Days at a Glance

| Day | Title | Time | Input | Output | Key Action |
|-----|-------|------|-------|--------|-----------|
| 27 | A3 Checkpoint 3 | 60–90m | Exported CV | Basic CV Draft (validated) | Validate in A3 Module 3 |
| 28 | Recruiter Eyes | 35–55m | Basic CV Draft | Recruiter perspective notes | 10-second scan → perception |
| 29 | Foundation Portfolio | 45–70m | All 29-day assets | Portfolio (all assets + status) | Assemble + visualize |
| 30 | Umbral de Mes | 60–90m | All assets + scores | Month-end closure + Arc 2 preview | Celebrate + prepare next |

### DB Tables (2)
- `a2_checkpoint_tracking` — tracks Day 27 checkpoint
- `a2_recruiter_perspective` — Day 28 scan answers + perception
- `a2_foundation_portfolio` — Day 29 complete asset list + status
- `a2_month1_closure` — Day 30 closure report + Arc 2 readiness

### Components (4)
1. **Day 27**: A3 Integration (exists, just unlock gate)
2. **Day 28**: Recruiter Scan Questions + Perception Simulator
3. **Day 29**: Portfolio Assembler + Asset Visualizer
4. **Day 30**: Closure Ceremony + Arc 2 Preview

### Effort: 8–13 days
- DB: 1–2 days
- Components: 5–8 days
- Testing + A3 integration: 1–2 days

---

## Implementation Roadmap

```
┌─────────────────────────────────────┐
│  WEEK 1–3: PHASE A                  │
│  Days 11–15                         │
│  Value Alchemy + Proof System       │
│  16–23 dev days                     │
│  Outputs: 5 statements + 3 stories  │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  WEEK 2–3: PHASE B (overlap)        │
│  Day 16 + Days 17–20                │
│  A3 Checkpoint 2 + CV Prep          │
│  15–21 dev days                     │
│  Outputs: Skeleton + Summary v1     │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  WEEK 4–5: PHASE C                  │
│  Days 21–26                         │
│  CV Building + Refinement           │
│  17–25 dev days                     │
│  Outputs: 6+ bullets + Skills + Exp │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  WEEK 5–6: PHASE D                  │
│  Days 27–30                         │
│  A3 Checkpoint 3 + Closure          │
│  8–13 dev days                      │
│  Outputs: Portfolio + Closure       │
└─────────────────────────────────────┘

TOTAL: 8–10 weeks, 56–82 dev days
```

---

## Key Milestones

| Milestone | Day | Phase | Status |
|-----------|-----|-------|--------|
| **Value System Complete** | 15 | A | Ready for A3 Checkpoint 2 |
| **A3 Module 2 Validation** | 16 | B | Returns Achievement Bank |
| **CV Structure Ready** | 20 | B | Skeleton + Summary ready |
| **CV Draft Complete** | 26 | C | Exported + uploaded |
| **A3 Module 3 Validation** | 27 | D | Returns CV Draft validated |
| **Foundation Portfolio** | 29 | D | All assets visualized |
| **Month 1 Complete** | 30 | D | Arc 2 preview + readiness check |

---

## Database Total

### New Tables: 14
- Phase A: 5 tables
- Phase B: 3 tables  
- Phase C: 4 tables
- Phase D: 2 tables

### Indexes Strategy
```sql
-- All tables indexed on (user_id, day_number) for fast queries
-- All tables have created_at index for timeline views
-- a2_achievement_stories indexed on story_index for bulk loads
```

### Data Volume Estimates (per user)
- Value statements: 5 rows
- Achievement stories: 3 rows  
- Proof fragments: 3–15 rows
- CV bullets: 6 rows
- CV skills: 20–50 rows
- Total: ~100–150 rows per user for all 30 days

---

## Component Architecture Pattern

**Every day component follows**:

```
1. IMPORT DATA
   └─ Load from previous day's table via user_id + day_number

2. LOAD OR CREATE STATE
   └─ Show existing or create new

3. MULTI-STEP UI
   └─ Step 1: Input / Select
   └─ Step 2: Transform / Edit
   └─ Step 3: Coach Review
   └─ Step 4: User Approval
   └─ Step 5: Save

4. DATABASE SAVE
   └─ INSERT into day's table
   └─ Track completion
   └─ Unlock next day

5. COMPLETION CEREMONY
   └─ Show deliverable
   └─ Show next day preview
```

---

## Risk Summary

| Risk | Mitigation | Phase |
|------|-----------|-------|
| Coach AI fails | Fallback templates, manual mode | A |
| A3 checkpoint gate breaks | Extensive testing, condition matrix | B, D |
| CV export format issues | Validation layer, format checking | C |
| Users skip steps | Make steps mandatory, high friction | All |
| Data import fails between days | Logging, fallback to empty state | All |
| Proof fragments too large | File size limits, text truncation | A |

---

## Next Steps

1. **Approve this plan** ✓
2. **Start Phase A** (Weeks 1–3)
   - Create 5 DB tables
   - Build Days 11–15 components
   - Integration test with Days 1–10
3. **Review Phase A output** (Week 3)
   - 5 value statements, 3 stories, proof system working
4. **Start Phase B** (Weeks 2–3, overlaps A)
   - A3 Checkpoint 2 gate + unlock logic
   - Days 17–20 components
5. **Continue phases C & D in parallel**

---

**Document Version**: 1.0 | **Date**: 2026-05-18 | **Plan Status**: Ready for Development

