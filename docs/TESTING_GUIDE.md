# A2 90-Day Route System - Testing Guide

## Overview
This guide covers complete testing scenarios for the A2 90-day professional development route integrated with A3 learning modules.

## Testing Environment Setup

```bash
npm run dev  # Start development server on http://localhost:3000
```

## Core Test Scenarios

### Test 1: Day 1 Vision/Milestone/Action Collection Flow
**Objective**: Verify Day 1 modal collects and validates user input

**Steps**:
1. Navigate to `/despega/a2/dia-1`
2. Click "Comenzar el Flujo Completo" to open Day 1 modal
3. **Step 1**: Enter vision answers:
   - Role target: "Senior Product Manager at Tech Company"
   - Desired outcome: "Lead a high-impact product team"
   - Environment: "Remote, collaborative, startup-like"
   - Click "Siguiente"
4. **Step 2**: Review coach-enhanced versions
   - Accept or regenerate suggestions
   - Click "Siguiente"
5. **Step 3**: Enter milestones:
   - Day 10: "Complete market analysis"
   - Day 20: "Build LinkedIn profile, 50+ connections"
   - Day 30: "3 interviews completed"
   - Click "Siguiente"
6. **Step 4**: Enter action plan:
   - Applications: "Apply to 20 companies"
   - Networking: "Daily LinkedIn engagement"
   - Learning: "Complete 2 courses"
   - Growth: "Practice interview speaking"
   - Click "Siguiente"
7. **Step 5**: Save to Notion or download
   - Optionally paste Notion template link
   - Click "Siguiente"
8. **Step 6**: Upload document
   - Create a simple .txt or PDF with your plan
   - Upload the document
   - Click "Analizar"
9. **Step 7**: Review DTC scoring
   - Should show 4 criteria: Vision (0-25), Milestones (0-25), Completeness (0-25), Realism (0-25)
   - Pass threshold: 75+
   - If score >= 75: Button says "Continuar al Día 2"
   - If score < 75: Button says "Revisar" for resubmission

**Expected Result**: Day 1 modal completes successfully, DTC score calculated and displayed.

---

### Test 2: Day 1 Pass (Score ≥75)
**Objective**: Verify Day 1 passing unlocks Day 2 and opens A3 system

**Prerequisites**: Complete Test 1 with comprehensive, realistic answers

**Steps**:
1. Complete Day 1 with high-quality submission (should score ≥75)
2. See "Congratulations!" pass message with score ≥75
3. Click "Continuar al Día 2"
4. Verify redirect to `/despega/a2/dia-2`
5. Check A3 progress dashboard:
   - Should show A3 modules now accessible
   - Module 1 (Espejo de Carrera) should be "available" (not locked)
   - Future modules should show as "locked"

**Expected Result**: Day 1 pass → Day 2 unlocks → A3 Module 1 becomes accessible.

---

### Test 3: Day 1 Fail (Score <75)
**Objective**: Verify Day 1 failure keeps Day 2 locked and A3 inaccessible

**Prerequisites**: Complete Day 1 with minimal/vague answers

**Steps**:
1. Complete Day 1 with weak submission (e.g., "I want a job" / "Make money" / no action plan)
2. See DTC score <75 with "Needs Revision" status
3. See button "Revisar" instead of "Continuar"
4. Click "Revisar" to edit submission
5. Try to navigate directly to `/despega/a2/dia-2`:
   - Should see "Day 1 must be completed first" message or lock
6. Try to navigate to `/despega/a3/career-mirror`:
   - Should see lock message: "Day 1: The Contract With Yourself must be completed with 75+ score"

**Expected Result**: Day 1 fail → Day 2 stays locked → A3 completely inaccessible.

---

### Test 4: Day 2-7 Navigation & A3 Module 1 Unlock
**Objective**: Verify sequential day progression and checkpoint unlock

**Prerequisites**: Complete Day 1 with passing score (≥75)

**Steps**:
1. After Day 1 passes, should be on Day 2
2. Verify Day 2 shows:
   - Mission card with title, subtitle, time estimate, mission type
   - "¿Por qué es importante?" section
   - Mark complete button
3. Navigate through days 2-6 using "Siguiente" buttons
4. Reach Day 7:
   - Should show A3 Checkpoint badge
   - "Module 1: Espejo de Carrera unlocks today" notification
5. Click "Comenzar Módulo" or navigate to `/despega/a3/career-mirror`
   - Should see full module content (NOT locked)
   - Green "Access Granted" badge at top

**Expected Result**: Days 2-6 progressive, Day 7 unlocks A3 Module 1.

---

### Test 5: A3 Module Sequential Unlock Enforcement
**Objective**: Verify modules lock until prerequisites complete

**Prerequisites**: Day 1 passed, currently on Day 7+

**Steps**:
1. From Day 7, complete Module 1 (Espejo de Carrera)
   - Click "Marcar Completado"
2. Navigate to `/despega/a3/value-mining-lab` (Module 2):
   - Should show lock screen
   - Message: "You must complete Module 1 first"
3. Navigate to `/despega/a3/cv-builder-studio` (Module 3):
   - Should show lock screen with same message
4. Complete Module 1
5. Retry `/despega/a3/value-mining-lab`:
   - If Day 16 not reached: Lock screen says "Available on Day 16"
6. Manually set date to Day 16 (admin/test mode)
7. Retry Module 2:
   - Should now be accessible (both Module 1 complete + Day 16 reached)

**Expected Result**: Modules lock until previous completed AND checkpoint day reached.

---

### Test 6: A3 Checkpoint Day Blocking
**Objective**: Verify modules unavailable before checkpoint day

**Prerequisites**: Day 1 passed, Module 1 completed

**Steps**:
1. Currently on Day 7, Module 1 accessible
2. Module 2 checkpoint is Day 16
3. Navigate to `/despega/a3/value-mining-lab`:
   - Should show lock with message: "Available on Day 16. You're currently on Day 7."
4. Navigate forward to Day 16
5. Retry Module 2:
   - Now accessible (assuming Module 1 complete)

**Expected Result**: Module unavailable until its exact checkpoint day.

---

### Test 7: Full 90-Day Navigation Path
**Objective**: Verify all 90 days load correctly with new template

**Steps**:
1. Visit `/despega/a2/dia-1` through `/despega/a2/dia-90`
2. Each day should show:
   - Day number badge ("Día X de 90")
   - Mission type badge (learning, practice, networking, planning, milestone)
   - A3 Checkpoint badge (on days 7, 16, 27, 35, 43, 51, 58, 68, 78, 88)
   - Daily mission card with expandable details
   - "¿Por qué es importante?" section
   - Previous/Next navigation buttons
3. Verify A3 checkpoint days (7, 16, 27, 35, 43, 51, 58, 68, 78, 88):
   - Show A3 Checkpoint notification
   - Mention the unlocking module
4. Day 90 should have "Completar Ruta" button instead of "Siguiente"

**Expected Result**: All 90 days render correctly with proper template.

---

### Test 8: A2/A3 Progress Widget
**Objective**: Verify unified progress dashboard

**Steps**:
1. Navigate to `/despega` or dashboard page with progress widget
2. Verify A2 section shows:
   - "Day X of 90"
   - Progress bar (X%)
   - Current phase label
3. Verify A3 section shows:
   - "0/10 Modules completed"
   - "0/1340 XP" (initially)
   - Timeline of 10 checkpoints
4. Complete Day 1:
   - Widget updates to "Day 2 of 90"
5. Reach Day 7 and complete Module 1:
   - A3 shows "1/10 Modules"
   - Shows Module 1 name as completed
   - XP reflects Module 1 reward (~80 XP)

**Expected Result**: Widget accurately reflects A2 and A3 progress.

---

### Test 9: DTC Scoring Model Validation
**Objective**: Verify 4-part scoring criteria

**Steps**:
1. Complete Day 1 with varied submission quality:
   - High vision clarity: 20-25 points
   - Good milestones: 15-25 points
   - Complete action plan: 20-25 points
   - Realistic overall: 15-25 points
2. Review breakdown to verify:
   - Total = sum of 4 criteria
   - Each criterion 0-25 range
   - Pass if total >= 75
   - Fail if total < 75
3. Test edge cases:
   - All zeros: Score 0, fail
   - Perfect submission: Score 100, pass
   - Borderline (74): Fail
   - Borderline (75): Pass

**Expected Result**: Scoring consistently applies 4-part rubric with 75 threshold.

---

### Test 10: API Endpoint Verification
**Objective**: Verify all critical API endpoints work

**Steps**:
1. **GET /api/a3/user-progress**
   - Should return: { progress, a2Day1Passed, a2CurrentDay, canAccessA3 }
   - Verify day1Status and score fields

2. **POST /api/a2/day1/analyze**
   - Send valid Day 1 submission
   - Should return: { analysis with scores, passed status, recommendations }
   - Verify criteria breakdown

3. **GET /api/a3/access-check?moduleId=career-mirror**
   - Should return: { canAccess, reason, blockReasons, currentDay, checkpointDay }
   - When locked, reason explains why

4. **POST /api/a3/unlock-module**
   - After module completion
   - Should mark module complete and unlock next

**Expected Result**: All endpoints return correct data structures and status codes.

---

## Regression Testing Checklist

- [ ] All 90 day pages compile without errors
- [ ] No TypeScript errors in entire project
- [ ] Day 1 modal opens and closes properly
- [ ] A3 modules show access gates correctly
- [ ] Progress widget updates in real-time
- [ ] Navigation between days works smoothly
- [ ] API endpoints respond with correct data
- [ ] DTC scoring calculation is consistent
- [ ] Module unlock sequence respects prerequisites
- [ ] No console errors or warnings

## Known Limitations

1. **30/60 Day Routes**: Currently only 90-day path tested. 30/60 variants need separate testing.
2. **PDF Parsing**: Document analysis uses LLM mock scoring, not real content parsing.
3. **Multi-revision**: Can submit Day 1 multiple times, but previous scores not tracked.
4. **Admin Override**: No admin bypass for module locks (can be added).

## Performance Benchmarks

- Day page load: <500ms
- Access check: <200ms
- DTC scoring: <1000ms
- Progress widget render: <300ms

## Future Enhancements

1. A2/A3 sync to track time spent per day
2. Analytics dashboard for completion rates
3. Admin override panel for testing
4. Batch scoring for multiple users
5. Export day/module progress as PDF/CSV
