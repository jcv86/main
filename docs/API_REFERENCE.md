# A2/A3 Gate System API Reference

Quick reference for all Phase 2 API endpoints and their usage.

---

## 1. Day 1 DTC Scoring Analysis

**Endpoint**: `POST /api/a2/day1/analyze`

**Purpose**: Analyze a Day 1 submission and calculate DTC score

**Request**:
```typescript
const response = await fetch('/api/a2/day1/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    visionRole: "Senior Product Manager at a Series A fintech startup",
    visionDesiredOutcome: "Lead a team of 3-5 engineers building payment infrastructure",
    visionEnvironment: "Remote-first, collaborative, metrics-driven environment",
    milestoneDay10: "Complete market research on fintech roles and compensation",
    milestoneDay20: "Refine resume targeting PM positions, conduct 5 informational interviews",
    milestoneDay30: "Secure 3 first interviews from direct applications",
    actionPlan: {
      week1: ["Research target companies", "Update LinkedIn"],
      week2: ["Conduct interviews", "Revise resume"],
      week3: ["Apply to roles", "Follow up"]
    }
  })
})

const { success, analysis } = await response.json()
```

**Response**:
```json
{
  "success": true,
  "analysis": {
    "totalScore": 82,
    "passed": true,
    "status": "pass",
    "scores": {
      "visionClarity": 22,
      "milestoneQuality": 20,
      "completeness": 20,
      "realism": 20
    },
    "breakdown": [
      "Vision Clarity: 22/25 — ✓ Role clearly defined | ...",
      "Milestone Quality: 20/25 — ✓ All three milestones...",
      "Completeness: 20/25 — ✓ All sections completed",
      "Realism: 20/25 — ✓ Milestone progression appears..."
    ],
    "recommendations": [],
    "formattedResult": "═══════════════════\n✓ PASS | Score: 82/100\n..."
  }
}
```

**Status Codes**:
- `200` — Success
- `400` — Missing required fields
- `401` — Not authenticated
- `500` — Server error

**Response Fields**:
- `totalScore` — 0-100 points
- `passed` — true if >= 75, false otherwise
- `status` — "pass" or "needs_revision"
- `scores` — Individual criterion scores
- `breakdown` — Human-readable feedback per criterion
- `recommendations` — What to improve (if not passed)
- `formattedResult` — Full formatted output for display

---

## 2. A3 Module Access Check

**Endpoint**: `GET /api/a3/access-check?moduleId={moduleId}`

**Purpose**: Check if user can access a specific A3 module

**Query Parameters**:
- `moduleId` — Module ID (e.g., 'career-mirror', 'value-mining-lab')

**Request**:
```typescript
const response = await fetch(
  `/api/a3/access-check?moduleId=career-mirror`
)

const { canAccess, denialMessage, blockReasons } = await response.json()

if (!canAccess) {
  console.log('Access denied:', denialMessage)
  blockReasons.forEach(reason => console.log(`• ${reason}`))
} else {
  // Load module
  loadModule('career-mirror')
}
```

**Response (Access Granted)**:
```json
{
  "success": true,
  "canAccess": true,
  "reason": "Access granted - all conditions met",
  "denialMessage": null,
  "blockReasons": [],
  "details": {
    "currentDay": 7,
    "checkpointDay": 7,
    "day1Status": "passed",
    "day1Score": 82,
    "requestedModuleId": "career-mirror"
  }
}
```

**Response (Access Denied)**:
```json
{
  "success": true,
  "canAccess": false,
  "reason": "Access denied",
  "denialMessage": "You cannot access this A3 module yet. Here's why:\n1. You're only on day 3...\n2. This module unlocks on day 7...",
  "blockReasons": [
    "You can only access A3 modules on their checkpoint days. career-mirror is available on day 7. You're currently on day 3.",
    "You must complete the previous module before accessing this one."
  ],
  "details": {
    "currentDay": 3,
    "checkpointDay": 7,
    "day1Status": "needs_revision",
    "day1Score": 68,
    "requestedModuleId": "career-mirror"
  }
}
```

**Status Codes**:
- `200` — Check completed (check canAccess field)
- `400` — Missing moduleId query param
- `401` — Not authenticated
- `500` — Server error

**Module IDs** (10 total):
1. `career-mirror` — Day 7
2. `value-mining-lab` — Day 16
3. `cv-builder-studio` — Day 27
4. `job-decoder` — Day 35
5. `answer-architecture` — Day 43
6. `coach-practice-room` — Day 51
7. `communication-gym` — Day 58
8. `first-recruiter-simulation` — Day 68
9. `risk-difficult-questions-lab` — Day 78
10. `basic-interview-mission` — Day 88

---

## 3. Complete A3 Module

**Endpoint**: `POST /api/a3/unlock-module`

**Purpose**: Mark an A3 module as completed (enables next module)

**Request**:
```typescript
const response = await fetch('/api/a3/unlock-module', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    moduleId: 'career-mirror',
    score: 850  // Optional: XP or score earned
  })
})

const { success, progress } = await response.json()

console.log('Completed modules:', progress.completedModuleIds)
console.log('Total XP:', progress.totalXp)
```

**Request Body**:
```json
{
  "moduleId": "career-mirror",
  "score": 850
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Module career-mirror completed successfully",
  "progress": {
    "completedModuleIds": ["career-mirror"],
    "totalXp": 850
  }
}
```

**Status Codes**:
- `200` — Success
- `400` — Missing moduleId
- `401` — Not authenticated
- `500` — Server error

---

## Decision Tree: When to Call Each Endpoint

```
User navigates to A3 module page
        ↓
Call: GET /api/a3/access-check?moduleId={moduleId}
        ↓
canAccess = true?
  ├─ YES → Render module content
  │        User completes module
  │        Call: POST /api/a3/unlock-module
  │        ↓
  │        Next checkpoint day: module auto-available
  │
  └─ NO → Show locked state
           Display denialMessage
           Show blockReasons
           Suggest next action
```

---

## Error Scenarios

### Scenario 1: User Not Authenticated
```
Any endpoint without demo_user cookie
Response: { error: "Not authenticated" } [401]
```

### Scenario 2: Day 1 Not Passed Yet
```
GET /api/a3/access-check?moduleId=career-mirror
Response: {
  "canAccess": false,
  "blockReasons": [
    "Day 1: The Contract With Yourself must be completed with a score of 75+"
  ]
}
```

### Scenario 3: Not Yet at Checkpoint Day
```
GET /api/a3/access-check?moduleId=career-mirror on day 5
Response: {
  "canAccess": false,
  "blockReasons": [
    "You can only access A3 modules on their checkpoint days. 
     career-mirror is available on day 7. 
     You're currently on day 5."
  ]
}
```

### Scenario 4: Missing Prerequisite Module
```
GET /api/a3/access-check?moduleId=value-mining-lab on day 16
Without completing career-mirror
Response: {
  "canAccess": false,
  "blockReasons": [
    "You must complete the previous module before accessing this one."
  ]
}
```

---

## Frontend Integration Example

```typescript
// A3 Module Page Component
export async function A3ModulePageContent({ moduleId }: { moduleId: string }) {
  // 1. Check access
  const accessResponse = await fetch(
    `/api/a3/access-check?moduleId=${moduleId}`
  )
  const { canAccess, denialMessage, details } = await accessResponse.json()

  if (!canAccess) {
    return (
      <LockedModuleUI
        message={denialMessage}
        currentDay={details.currentDay}
        checkpointDay={details.checkpointDay}
        day1Status={details.day1Status}
        day1Score={details.day1Score}
      />
    )
  }

  // 2. Render module content
  return (
    <A3ModuleContent
      moduleId={moduleId}
      onComplete={async (score) => {
        // 3. Mark as complete
        const completeResponse = await fetch('/api/a3/unlock-module', {
          method: 'POST',
          body: JSON.stringify({ moduleId, score })
        })
        const { progress } = await completeResponse.json()
        
        // Show completion feedback
        showSuccessMessage(
          `Great! You've completed this module. ` +
          `${progress.completedModuleIds.length} of 10 modules done!`
        )
      }}
    />
  )
}
```

---

## Debugging

### Enable console logging
```typescript
// All endpoints log to console with [v0] prefix
// Check browser console or server logs for:
// [v0] Checking A3 access for: { userId, moduleId }
// [v0] Day 1 DTC Scoring: { totalScore, passed, ... }
// [v0] Completing A3 module: { userId, moduleId }
```

### Test with curl
```bash
# Test access check
curl "http://localhost:3000/api/a3/access-check?moduleId=career-mirror" \
  -H "Cookie: demo_user={...}"

# Test Day 1 analysis
curl -X POST "http://localhost:3000/api/a2/day1/analyze" \
  -H "Content-Type: application/json" \
  -H "Cookie: demo_user={...}" \
  -d '{
    "visionRole": "...",
    "visionDesiredOutcome": "...",
    "visionEnvironment": "...",
    "milestoneDay10": "...",
    "milestoneDay20": "...",
    "milestoneDay30": "...",
    "actionPlan": {}
  }'
```

---

## Rate Limiting & Quotas

Currently no rate limiting implemented. Endpoints are optimized for:
- Access checks: < 200ms (2 DB queries)
- Day 1 analysis: < 100ms (pure computation)
- Module completion: < 500ms (1 DB update)

---

## Version History

- **v1.0** (Phase 2) — Initial implementation with 3 core APIs
- Planned: v2.0 — Admin overrides, batch operations
