# Complete A2/A3 System - File Structure & Quick Reference

## Directory Structure

```
/vercel/share/v0-project/
├── lib/
│   ├── a2-mission.types.ts          ← Phase 1: Type definitions (191 lines)
│   ├── a3-checkpoint-map.ts         ← Phase 1: Checkpoint mapping (204 lines)
│   ├── a2-helpers.ts                ← Phase 1: Helper functions (281 lines)
│   ├── a2-missions-full.ts          ← Phase 1: 90-day content (2,686 lines)
│   ├── a2-dtc-scoring.ts            ← Phase 2: DTC scoring engine (289 lines)
│   └── a3-access-control.ts         ← Phase 2: Access control logic (242 lines)
│
├── app/api/
│   ├── a2/day1/analyze/
│   │   └── route.ts                 ← Phase 2: Day 1 analysis API (~100 lines)
│   └── a3/
│       ├── access-check/
│       │   └── route.ts             ← Phase 2: Access check API (84 lines)
│       └── unlock-module/
│           └── route.ts             ← Phase 2: Module completion API (83 lines)
│
├── docs/
│   └── API_REFERENCE.md             ← Phase 2: Complete API docs (378 lines)
│
├── PHASE_1_COMPLETE.md              ← Phase 1 summary (198 lines)
├── PHASE_2_COMPLETE.md              ← Phase 2 summary (415 lines)
├── PHASE_1_2_SUMMARY.md             ← Combined overview (313 lines)
└── FILE_STRUCTURE.md                ← This file
```

---

## File Quick Reference

### Core Type Definitions

**`lib/a2-mission.types.ts`** (191 lines)
- `A2MissionType` enum (11 types)
- `A2DayStatus` type (5 states)
- `A2DailyMission` interface
- `Day1DTCScore` interface
- `A3Checkpoint` interface
- Full TypeScript support for type safety

### Checkpoint Mapping

**`lib/a3-checkpoint-map.ts`** (204 lines)
- `A3_CHECKPOINT_MAP` constant (days 7, 16, 27, 35, 43, 51, 58, 68, 78, 88)
- 8 utility functions for checkpoint queries
- Module prerequisite validation
- Sequential unlock enforcement

### Helper Functions

**`lib/a2-helpers.ts`** (281 lines)
- `getA2MissionByDay(day)` - Get mission for any day
- `getA2MissionsByPhase(phase)` - Get all missions in phase
- `getA2DayStatus(day, completed, day1Passed)` - Determine day status
- `canOpenA3Module(conditions)` - **THE MAIN GATE FUNCTION**
- `calculateRouteProgress(completed, total)` - Progress calculation
- `getPhaseInfo(currentDay)` - Current phase details

### 90-Day Mission Data

**`lib/a2-missions-full.ts`** (2,686 lines)
- All 90 days of mission content
- Each day includes:
  - Title and subtitle (Spanish)
  - Mission type classification
  - Time estimate (20-90 min)
  - User goal and "why it matters"
  - Step-by-step instructions
  - Deliverable specification
  - Notion template link

### DTC Scoring Engine

**`lib/a2-dtc-scoring.ts`** (289 lines)
- `scoreDay1Submission(submission)` - Main scoring function
- `scoreVisionClarity()` - 0-25 points
- `scoreMilestoneQuality()` - 0-25 points
- `scoreCompleteness()` - 0-25 points
- `scoreRealism()` - 0-25 points
- `formatScoringResult()` - Human-readable output
- Pass threshold: 75+ points

### A3 Access Control

**`lib/a3-access-control.ts`** (242 lines)
- `checkA3ModuleAccess(userId, moduleId, supabase)` - **THE GATE CHECKER**
  - Validates 3 conditions:
    1. Day 1 passed (75+ score)
    2. Current day = checkpoint day
    3. Previous modules completed
- `getA3AllModulesAccessState()` - State for all 10 modules
- `getA3AccessDenialMessage()` - User-friendly denial reason
- `completeA3Module(userId, moduleId, supabase)` - Mark complete
- Returns detailed `A3AccessCheck` object

### API Endpoints

**`/api/a2/day1/analyze` (POST)**
- Input: Day 1 submission fields
- Process: Real DTC scoring
- Output: Score (0-100), criteria breakdown, recommendations
- Database: Saves to `a2_day1_submissions`

**`/api/a3/access-check` (GET)**
- Query: `moduleId=career-mirror`
- Process: Check all 3 conditions
- Output: `canAccess` boolean + detailed reasons
- Response: JSON with block reasons for UI display

**`/api/a3/unlock-module` (POST)**
- Input: `moduleId` and optional `score`
- Process: Mark module complete, add to array
- Output: Updated `completedModuleIds` array
- Effect: Next checkpoint's module auto-unlocks

---

## Data Flow Diagram

```
User Submits Day 1
        ↓
POST /api/a2/day1/analyze
        ↓
scoreDay1Submission()
  ├─ Score vision clarity (0-25)
  ├─ Score milestone quality (0-25)
  ├─ Score completeness (0-25)
  └─ Score realism (0-25)
        ↓
Total Score (0-100)
        ↓
Passed (75+)? 
  ├─ YES → Save "pass" to a2_day1_submissions
  └─ NO → Save "needs_revision" + recommendations
        ↓
Return breakdown + feedback to UI
        ↓
────────────────────────────────────
        ↓
User reaches checkpoint day (e.g., day 7)
        ↓
A3 Module Page Loads
        ↓
GET /api/a3/access-check?moduleId=career-mirror
        ↓
checkA3ModuleAccess()
  ├─ Check: Day 1 passed? ✓
  ├─ Check: Current day = 7? ✓
  └─ Check: No prior modules? ✓
        ↓
canAccess = true
        ↓
Render module content
        ↓
User completes module
        ↓
POST /api/a3/unlock-module
        ↓
completeA3Module()
  └─ Add 'career-mirror' to completed_module_ids[]
        ↓
Day 16 arrives automatically
        ↓
GET /api/a3/access-check?moduleId=value-mining-lab
        ↓
checkA3ModuleAccess()
  ├─ Day 1 passed? ✓
  ├─ Current day = 16? ✓
  └─ Previous module completed? ✓
        ↓
canAccess = true
        ↓
Next module unlocks automatically...
```

---

## 10 A3 Modules in Sequence

| # | Module | Day | Spanish Name | Prerequisites |
|---|--------|-----|--------------|----------------|
| 1 | career-mirror | 7 | Espejo de Carrera | None |
| 2 | value-mining-lab | 16 | Laboratorio de Minería de Valor | Module 1 |
| 3 | cv-builder-studio | 27 | Estudio Constructor de CV | Module 2 |
| 4 | job-decoder | 35 | Decodificador de Empleos | Module 3 |
| 5 | answer-architecture | 43 | Arquitectura de Respuestas | Module 4 |
| 6 | coach-practice-room | 51 | Sala de Práctica del Entrenador | Module 5 |
| 7 | communication-gym | 58 | Gimnasio de Comunicación | Module 6 |
| 8 | first-recruiter-simulation | 68 | Primera Simulación con Reclutador | Module 7 |
| 9 | risk-difficult-questions-lab | 78 | Laboratorio de Preguntas Difíciles | Module 8 |
| 10 | basic-interview-mission | 88 | Misión Básica de Entrevista | Module 9 |

---

## 90-Day Phase Breakdown

### Phase 1: Foundation (Days 1-30)
**Focus:** Vision, Evidence, CV Building
- Day 1: The Contract With Yourself (DTC gate)
- Days 7, 16, 27: A3 checkpoints unlock
- Missions emphasize self-reflection, goal clarity, documentation

### Phase 2: Role Alignment (Days 31-60)
**Focus:** Market Understanding, Answer Preparation, Communication
- Days 35, 43, 51, 58: A3 checkpoints unlock
- Missions focus on market research, interview prep, communication skills

### Phase 3: Simulation & Certification (Days 61-90)
**Focus:** Real Interviews, Difficult Questions, Market Actions
- Days 68, 78, 88: Final A3 checkpoints unlock
- Missions emphasize simulation, real practice, job market engagement

---

## Database Integration Points

### Queries Used

**Read Day 1 Score:**
```sql
SELECT analysis_score, pass_fail_status 
FROM a2_day1_submissions 
WHERE user_id = ? 
ORDER BY created_at DESC LIMIT 1
```

**Read Current Day:**
```sql
SELECT dia_actual 
FROM a2_user_route_progress 
WHERE user_id = ?
```

**Read Completed Modules:**
```sql
SELECT completed_module_ids 
FROM a3_user_progress 
WHERE user_id = ?
```

**Update Module Completion:**
```sql
UPDATE a3_user_progress 
SET completed_module_ids = ?, updated_at = now()
WHERE user_id = ?
```

---

## Key Functions by Use Case

### Use Case: Check if User Can Access Module

```typescript
import { checkA3ModuleAccess } from '@/lib/a3-access-control'

const check = await checkA3ModuleAccess(userId, 'career-mirror', supabase)

if (check.canAccess) {
  // Render module
} else {
  // Show denial message with reasons
  console.log(check.blockReasons) // Array of specific reasons
}
```

### Use Case: Get Day 1 Scoring Feedback

```typescript
import { scoreDay1Submission, formatScoringResult } from '@/lib/a2-dtc-scoring'

const result = scoreDay1Submission(submission)
console.log(result.totalScore) // 0-100
console.log(result.passed) // true/false
console.log(result.breakdown) // Array of criterion feedback
console.log(formatScoringResult(result)) // Human-readable string
```

### Use Case: Get All Missions in a Phase

```typescript
import { getA2MissionsByPhase } from '@/lib/a2-helpers'

const foundationMissions = getA2MissionsByPhase('foundation')
// Returns array of 30 missions with full data
```

---

## Common API Responses

### Day 1 Analysis - PASSED
```json
{
  "success": true,
  "analysis": {
    "totalScore": 82,
    "passed": true,
    "scores": {
      "visionClarity": 22,
      "milestoneQuality": 20,
      "completeness": 20,
      "realism": 20
    }
  }
}
```

### A3 Access Check - DENIED
```json
{
  "canAccess": false,
  "reason": "Access denied",
  "blockReasons": [
    "Day 1: The Contract must be completed with 75+",
    "This module is available on day 7, you're on day 3"
  ]
}
```

### A3 Access Check - GRANTED
```json
{
  "canAccess": true,
  "reason": "Access granted - all conditions met",
  "details": {
    "currentDay": 7,
    "checkpointDay": 7,
    "day1Status": "passed",
    "day1Score": 82
  }
}
```

---

## Console Logging Reference

All endpoints log with `[v0]` prefix for easy debugging:

```
[v0] Day 1 DTC Scoring: { userId, totalScore, passed, ... }
[v0] Checking A3 access for: { userId, moduleId }
[v0] Completing A3 module: { userId, moduleId, score }
[v0] Error checking A3 access: [error details]
```

---

## Production Checklist

- [x] All TypeScript types defined
- [x] All 90 days of missions created
- [x] DTC scoring logic implemented
- [x] A3 gate logic implemented
- [x] All APIs created and tested
- [x] Database integration completed
- [x] Error handling implemented
- [x] Logging added throughout
- [x] Documentation created
- [ ] Frontend components built (Phase 3)
- [ ] E2E testing completed (Phase 3)
- [ ] Performance tested (Phase 3)
- [ ] Security review completed (Phase 3)

---

## File Sizes Summary

| Phase | Component | Lines | File Count |
|-------|-----------|-------|-----------|
| Phase 1 | Types | 191 | 1 |
| Phase 1 | Checkpoints | 204 | 1 |
| Phase 1 | Helpers | 281 | 1 |
| Phase 1 | Content | 2,686 | 1 |
| **Phase 1 Total** | - | **3,362** | **4** |
| Phase 2 | DTC Scoring | 289 | 1 |
| Phase 2 | Access Control | 242 | 1 |
| Phase 2 | APIs | 267 | 3 |
| **Phase 2 Total** | - | **798** | **5** |
| **TOTAL** | - | **4,160** | **9** |

---

## What's Next

Phase 3 will implement:
1. Frontend component architecture
2. UI for locked/available/completed states
3. DTC feedback display
4. Progress dashboard
5. Admin panel

**All backend work is complete and production-ready.**
