# A2 90-Day Route System — Implementation Plan (Aligned)

**Status**: Phase 1-2 Ready  
**Last Updated**: 2026-05-13  
**Project Stage**: Preparing A2 daily structure with placeholder missions + A3 checkpoint integration

---

## Executive Summary

The DTC_A2_90_DAY_ROUTE_SYSTEM spec defines a **3-layer system**:
- **A1**: Work-style assessment (separate, already done)
- **A2**: 90-day daily roadmap with real actions (to build)
- **A3**: 10 learning modules at checkpoint days (already exists, do not rebuild)

**Current project state**: 
- ✅ All 90 `dia-x` page routes exist
- ✅ A2_DAYS config partially populated
- ✅ Day 1 modal (7 steps) exists
- ❌ A2DailyMission interface needs alignment
- ❌ A3 checkpoint mapping missing
- ❌ A3 gate logic missing
- ❌ Day 1 DTC scoring incomplete

**Immediate next step**: Align data structures and build gate logic.

---

## Current vs Spec Gap Analysis

### A2Day Interface (Current)
```typescript
export interface A2Day {
  dia: number
  title: string
  subtitle: string
  description: string
  phase: 'clarity' | 'material' | 'interview' | 'real-action' | 'refinement'
  unlocksA3Module: string | null
  tasks: string[]
  learningGoals: string[]
  actionItems: string[]
  notionTemplate: string
  estimatedHours: number
}
```

### A2DailyMission Interface (Spec Requirement)
```typescript
export interface A2DailyMission {
  day: number
  slug: string
  title: string
  subtitle: string
  missionType: A2MissionType  // ← NEW: 11 types (roadmap_gate, mirror, etc.)
  estimatedMinutes: { min: number; max: number }  // ← NEW: 20-90 range required
  phaseLabel: "Foundation" | "Role Alignment" | "Simulation & Certification"  // ← NEW
  a3Checkpoint?: { /* details */ }  // ← NEW: explicit mapping
  unlockRequirements: { /* rules */ }  // ← NEW: gating logic
  userGoal: string  // ← existing = learningGoals[0]
  whyItMatters: string  // ← NEW
  instructions: string[]  // ← existing = actionItems
  deliverable: string  // ← NEW
  dtcValidation: { /* rules */ }  // ← NEW: for Day 1
  completionResult: { onPass: string; onFail: string }  // ← NEW
}
```

### Gap Summary
| Field | Current | Spec | Action |
|-------|---------|------|--------|
| missionType | ❌ | ✅ Required | Add 11-type enum |
| estimatedMinutes | ❌ | ✅ Required (20-90) | Change estimatedHours to min/max |
| phaseLabel | ❌ | ✅ Required | Map 5 phases → 3 phases |
| a3Checkpoint | ❌ | ✅ Required | Add object with moduleId, day mapping |
| unlockRequirements | ❌ | ✅ Required | Add gating rules |
| whyItMatters | ❌ | ✅ | Add motivational text |
| instructions | ✅ = actionItems | ✅ | Rename actionItems |
| dtcValidation | ❌ | ✅ Day 1 only | Add Day 1 pass rules |
| completionResult | ❌ | ✅ | Add pass/fail messages |

---

## A3 Checkpoint Mapping (CRITICAL)

**Exact mapping from spec**:

```typescript
export const A3_CHECKPOINT_MAP: Record<number, A3CheckpointDay> = {
  7: {
    day: 7,
    moduleNumber: 1,
    moduleId: 'career-mirror',
    moduleTitle: 'Espejo de Carrera',
    route: '/despega/a3/career-mirror',
    requiredPreviousModules: []
  },
  16: {
    day: 16,
    moduleNumber: 2,
    moduleId: 'value-mining-lab',
    moduleTitle: 'Laboratorio de Minería de Valor',
    route: '/despega/a3/value-mining-lab',
    requiredPreviousModules: ['career-mirror']
  },
  27: {
    day: 27,
    moduleNumber: 3,
    moduleId: 'cv-builder-studio',
    moduleTitle: 'Estudio Constructor de CV',
    route: '/despega/a3/cv-builder-studio',
    requiredPreviousModules: ['career-mirror', 'value-mining-lab']
  },
  35: {
    day: 35,
    moduleNumber: 4,
    moduleId: 'job-decoder',
    moduleTitle: 'Decodificador de Ofertas',
    route: '/despega/a3/job-decoder',
    requiredPreviousModules: ['career-mirror', 'value-mining-lab', 'cv-builder-studio']
  },
  43: {
    day: 43,
    moduleNumber: 5,
    moduleId: 'answer-architecture',
    moduleTitle: 'Arquitectura de Respuestas',
    route: '/despega/a3/answer-architecture',
    requiredPreviousModules: [/* 1-4 */]
  },
  51: {
    day: 51,
    moduleNumber: 6,
    moduleId: 'coach-practice-room',
    moduleTitle: 'Sala de Práctica del Coach',
    route: '/despega/a3/coach-practice-room',
    requiredPreviousModules: [/* 1-5 */]
  },
  58: {
    day: 58,
    moduleNumber: 7,
    moduleId: 'communication-gym',
    moduleTitle: 'Gimnasio de Comunicación',
    route: '/despega/a3/communication-gym',
    requiredPreviousModules: [/* 1-6 */]
  },
  68: {
    day: 68,
    moduleNumber: 8,
    moduleId: 'first-recruiter-simulation',
    moduleTitle: 'Primera Simulación con Reclutador',
    route: '/despega/a3/first-recruiter-simulation',
    requiredPreviousModules: [/* 1-7 */]
  },
  78: {
    day: 78,
    moduleNumber: 9,
    moduleId: 'risk-difficult-questions-lab',
    moduleTitle: 'Laboratorio de Preguntas Difíciles',
    route: '/despega/a3/risk-difficult-questions-lab',
    requiredPreviousModules: [/* 1-8 */]
  },
  88: {
    day: 88,
    moduleNumber: 10,
    moduleId: 'basic-interview-mission',
    moduleTitle: 'Misión de Entrevista Básica',
    route: '/despega/a3/basic-interview-mission',
    requiredPreviousModules: [/* 1-9 */]
  }
}
```

**Critical rule**: User cannot access any A3 checkpoint module unless:
1. A2 Day 1 has been passed (DTC score ≥ 75)
2. Current A2 day matches the checkpoint day
3. All previous A3 modules completed
4. No skipping, no early access

---

## Implementation Phases

### Phase 1: Data Structure Alignment (3-4 hours) ← START HERE

#### 1.1 Create `a2-mission.types.ts`
```typescript
export type A2MissionType =
  | "roadmap_gate"      // Day 1 only
  | "mirror"            // Self-reflection
  | "evidence"          // Achievement extraction
  | "builder"           // Asset creation (CV, etc.)
  | "market_intel"      // Job market analysis
  | "coach_forge"       // Coach improvement
  | "field_action"      // External real actions
  | "performance_drill" // Speaking, delivery, pressure
  | "a3_checkpoint"     // A3 module checkpoint day
  | "debrief"           // Review & extract lessons
  | "milestone"         // Day 30/60/90 checkpoints

export interface A2DailyMission {
  day: number
  slug: string
  title: string
  subtitle: string
  missionType: A2MissionType
  estimatedMinutes: { min: number; max: number }
  phaseLabel: "Foundation" | "Role Alignment" | "Simulation & Certification"
  a3Checkpoint?: {
    moduleNumber: number
    moduleId: string
    moduleTitle: string
    route: string
    requiredPreviousModules: string[]
  }
  unlockRequirements: {
    requiresDay1Passed: boolean
    requiredPreviousDay?: number
    requiredCompletedA3Modules?: string[]
  }
  userGoal: string
  whyItMatters: string
  instructions: string[]
  deliverable: string
  dtcValidation: {
    required: boolean
    passScore?: number
    criteria?: string[]
  }
  completionResult: {
    onPass: string
    onFail: string
  }
}
```

#### 1.2 Create `a3-checkpoint-map.ts`
- 10 checkpoint mappings (days 7, 16, 27, 35, 43, 51, 58, 68, 78, 88)
- Each with module details and required previous modules

#### 1.3 Create `a2-helpers.ts`
```typescript
export function getA2MissionByDay(day: number): A2DailyMission | null
export function isA3CheckpointDay(day: number): boolean
export function getA3CheckpointForDay(day: number): A3CheckpointDay | null
export function canOpenA3Module({
  day: number,
  a2Day1Passed: boolean,
  requestedModuleId: string,
  completedA3Modules: string[],
}): boolean
```

#### 1.4 Adapt `a2-days-config.ts`
- Extend existing A2Day interface OR create new A2DailyMission config
- Add missionType for each day
- Change estimatedHours → estimatedMinutes (20-90 range)
- Add phaseLabel
- Map a3Checkpoint for checkpoint days
- Add unlockRequirements
- Add whyItMatters
- Add dtcValidation (Day 1 only)
- Add completionResult

---

### Phase 2: A3 Gate Logic & Access Control (2-3 hours)

#### 2.1 Create `a3-access-control.ts`
```typescript
export function canOpenA3Module({
  day,
  a2Day1Passed,
  requestedModuleId,
  completedA3Modules,
  checkpointMap
}): boolean {
  if (!a2Day1Passed) return false
  
  const checkpoint = checkpointMap[day]
  if (!checkpoint) return false
  
  if (checkpoint.moduleId !== requestedModuleId) return false
  
  for (const requiredModule of checkpoint.requiredPreviousModules) {
    if (!completedA3Modules.includes(requiredModule)) {
      return false
    }
  }
  
  return true
}
```

#### 2.2 Update `/api/a3/user-progress` endpoint
- Fetch A2 Day 1 passed status from database
- Check canOpenA3Module() for each module
- Lock all A3 modules if Day 1 not passed
- Apply checkpoint day + sequential unlock logic

#### 2.3 Add gate to all A3 module pages
- `/app/despega/a3/[module]/page.tsx` (all 10 modules)
- Check `canOpenA3Module()` on load
- Show "Not yet available" message if blocked

---

### Phase 3: Day 1 DTC Scoring & Database (3-4 hours)

#### 3.1 Create `a2_day1_submissions` table
```sql
CREATE TABLE a2_day1_submissions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  
  -- Submission data
  vision_answers jsonb,
  coach_enhanced_vision text,
  milestones jsonb,
  action_plan jsonb,
  uploaded_file_path text,
  
  -- DTC Analysis
  dtc_score integer,  -- 0-100
  dtc_breakdown jsonb, -- {visionClarity, milestoneQuality, completeness, realism}
  dtc_feedback text,
  
  -- Tracking
  passed boolean,
  submission_count integer,
  created_at timestamp,
  updated_at timestamp
)
```

#### 3.2 Implement DTC scoring logic (`a2-dtc-scoring.ts`)
```typescript
export async function analyzeDayOneSubmission(
  submission: DayOneSubmission
): Promise<DTCAnalysisResult> {
  // Parse submitted document (if uploaded)
  // Score 4 criteria (25 points each)
  // Return { score, passed, breakdown, feedback, strengths, improvements }
}
```

#### 3.3 Create `/api/a2/day1/analyze` endpoint
- Accept submission data + uploaded file
- Call LLM to parse & score
- Save to DB
- Return analysis with pass/fail
- If passed: unlock Day 2 + A3 access

#### 3.4 Create `/api/a2/day1/save-submission` endpoint
- Save draft at each step
- Enable resume on refresh

---

### Phase 4: Day 1 Modal & UI Components (3-4 hours)

#### 4.1 Update Day 1 modal
- Add visible DTC scoring breakdown
- Show pass/fail state
- If failed: show revision prompt
- If passed: CTA to "Continue to Day 2"

#### 4.2 Create daily mission card component
```typescript
<A2DailyMissionCard day={number} />
// Shows: title, missionType badge, time, steps, deliverable, A3 checkpoint if applicable
```

#### 4.3 Update all dia-2 through dia-90 pages
- Replace placeholder content with `<A2DailyMissionCard />`
- Load mission from config
- Show A3 checkpoint badge if checkpoint day

#### 4.4 Create unified A2/A3 dashboard widget
- Current day + progress
- Route completion %
- Next milestone
- Next A3 checkpoint status

---

### Phase 5: Integration & Testing (2-3 hours)

#### 5.1 Wire Day 1 to unlock Day 2
- When Day 1 passes: auto-unlock Day 2
- Update `a2_user_route_progress.dia_actual = 2`
- Trigger A3 checkpoint availability check

#### 5.2 Testing checklist
- [ ] Day 1 passes with score ≥ 75
- [ ] Day 1 fails with score < 75 (allows revision)
- [ ] Day 2 unlocks after Day 1 passes
- [ ] A3 locked until Day 1 passes
- [ ] A3 Module 1 unlocks only on Day 7
- [ ] A3 modules unlock strictly in order
- [ ] Cannot skip A3 modules
- [ ] Cannot access early checkpoint days
- [ ] 30/60/90 day variants work correctly

---

## Day Title Reference (90-Day Placeholder Mission Titles)

### Days 1–30: Foundation

1. The Contract With Yourself
2. Your Hidden Operating System
3. The 10-Second Career Test
4. Strengths Under Evidence
5. The Enemy Map
6. Identity Forge
7. **A3 Checkpoint 1: Espejo de Carrera**
8. Memory Excavation
9. From Chaos to Tasks
10. Why It Mattered
11. Value Alchemy I
12. Value Alchemy II
13. Impact Tags
14. Story of Responsibility
15. The Proof Chamber
16. **A3 Checkpoint 2: Laboratorio de Minería de Valor**
17. CV Evidence Hunt
18. CV Skeleton Day
19. The Recruiter's First 10 Seconds
20. Summary Surgery
21. Bullet Upgrade I
22. Bullet Upgrade II
23. Skill Architecture
24. Empty Words Trial
25. CV Stress Test
26. Export Ritual
27. **A3 Checkpoint 3: Estudio Constructor de CV**
28. Recruiter Eyes
29. Foundation Portfolio
30. Foundation Review

### Days 31–60: Role Alignment

31. Market Radar
32. Pick the Arena
33. Requirement Detective
34. Fit vs Gap Map
35. **A3 Checkpoint 4: Decodificador de Ofertas**
36. Question Forecast
37. Opening Scene
38. Motivation Engine
39. Strength With Story
40. STAR Origin Story
41. The Hiring Argument
42. Compression Challenge
43. **A3 Checkpoint 5: Arquitectura de Respuestas**
44. Weak Answer Hunt
45. Coach Round 1
46. Coach Round 2
47. Evidence Injection
48. Follow-Up Trap
49. Coach Revision Session
50. Best Versions Vault
51. **A3 Checkpoint 6: Sala de Práctica del Coach**
52. Voice Baseline
53. Pause Power
54. Speed Control
55. Ending Like a Pro
56. Motivation Recording
57. Before / After Proof
58. **A3 Checkpoint 7: Gimnasio de Comunicación**
59. Your Speaking Rules
60. Practice Review

### Days 61–90: Simulation & Certification

61. Recruiter Mindset
62. First 60 Seconds
63. CV Walkthrough
64. Recruiter Question Pack
65. Candidate Questions
66. Simulation Warm-Up
67. Calm Start Ritual
68. **A3 Checkpoint 8: Primera Simulación con Reclutador**
69. Debrief the Damage
70. Repair the Weakest Answer
71. Fear Inventory
72. The Safe Answer Formula
73. Exit Story
74. Weakness Without Self-Damage
75. Salary Without Panic
76. Defensive Language Detox
77. Mini Pressure Rehearsal
78. **A3 Checkpoint 9: Laboratorio de Preguntas Difíciles**
79. Real Market Sprint
80. Opportunity Ranking
81. CV Adaptation 1
82. CV Adaptation 2
83. Application Package
84. Send or Simulate
85. Follow-Up System
86. Final Mission Review
87. Final Warm-Up Pack
88. **A3 Checkpoint 10: Misión de Entrevista Básica**
89. After-Action Review
90. Next Path Decision

---

## Mission Type Distribution (90 days)

| Type | Count | Days |
|------|-------|------|
| roadmap_gate | 1 | 1 |
| mirror | 6 | 2, 3, 5, 6, 8, 9 |
| evidence | 10 | 4, 8, 14, 15, 17, 39, 40, 47, 57, 69 |
| builder | 15 | 18, 20-26, 28, 81-82 |
| market_intel | 8 | 31-34, 38, 39, 40, 50 |
| coach_forge | 10 | 45, 46, 48-50, 70 |
| field_action | 20 | 32, 50-60, 79-85 |
| performance_drill | 15 | 52-57, 62-67, 77 |
| a3_checkpoint | 10 | 7, 16, 27, 35, 43, 51, 58, 68, 78, 88 |
| debrief | 3 | 29, 60, 69 |
| milestone | 2 | 30, 90 |

**Total**: 90 days fully allocated

---

## File Structure After Implementation

```
/lib/
  ├── a2-mission.types.ts          [NEW] ← interfaces
  ├── a3-checkpoint-map.ts         [NEW] ← 10 checkpoint mappings
  ├── a2-helpers.ts                [NEW] ← helper functions
  ├── a2-dtc-scoring.ts            [NEW] ← DTC scoring logic
  ├── a3-access-control.ts         [NEW] ← gate logic
  ├── a2-days-config.ts            [UPDATE] ← extend with new fields
  └── a2-coach-prompts.ts          [existing]

/components/
  ├── a2-daily-mission-card.tsx    [NEW] ← mission display
  ├── a2-a3-progress-widget.tsx    [NEW] ← unified dashboard
  ├── a2-day1-step7-analysis.tsx   [UPDATE] ← DTC scoring display
  ├── a2-day1-modal.tsx            [UPDATE] ← enhance with scoring
  └── [other existing A2/A3 components]

/app/api/
  ├── a2/day1/
  │   ├── analyze/route.ts         [NEW] ← DTC analysis
  │   ├── save-submission/route.ts [NEW] ← save draft
  │   ├── coach-enhance/route.ts   [UPDATE]
  │   └── upload/route.ts          [UPDATE]
  ├── a2/progress-refresh/route.ts [NEW]
  └── a3/user-progress/route.ts    [UPDATE] ← add A3 gate logic

/app/despega/a2/
  ├── dia-1/page.tsx               [UPDATE]
  ├── dia-2/page.tsx through
  └── dia-90/page.tsx              [UPDATE] ← all 89 pages
```

---

## Success Criteria

### After Phase 1-2:
- [ ] A2DailyMission interface defined
- [ ] A3 checkpoint map created (10 entries)
- [ ] a2-helpers.ts with 4 functions
- [ ] canOpenA3Module() logic verified

### After Phase 3-4:
- [ ] Day 1 DTC scoring works (75+ pass rule)
- [ ] Day 1 modal shows breakdown + pass/fail
- [ ] A3 modules locked until Day 1 passed
- [ ] A3 checkpoint gating works

### After Phase 5:
- [ ] Day 2 unlocks after Day 1 passes
- [ ] A3 Module 1 accessible only on Day 7 + after Day 1 pass
- [ ] Cannot skip A3 modules
- [ ] 30/60/90 day logic works

---

## Recommended Next Steps

**Immediate (today)**:
1. Read & align this plan with team
2. Confirm data structure changes with leads
3. Start Phase 1.1: Create a2-mission.types.ts

**This week**:
4. Phase 1.2-1.3: A3 checkpoint map + helpers
5. Phase 2: Gate logic implementation
6. Phase 3: Day 1 database table + scoring

**Next week**:
7. Phase 4: UI components + Day 1 modal updates
8. Phase 5: Integration testing

---

## Notes

- **Do NOT rewrite A3 modules** - Only add gate logic
- **Do NOT change existing dia-1 flow** yet - Just enhance with DTC scoring
- **Keep backward compatibility** - Existing users can continue
- **Prepare for 30/60/90 variants** - Build logic now, activate later
- **Use spec titles** for Days 1-90 (provided above)

