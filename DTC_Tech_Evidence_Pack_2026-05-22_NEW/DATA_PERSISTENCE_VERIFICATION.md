# Data Persistence Verification Guide

## Complete User Journey Data Flow

### Stage 1: Conozcámonos-1 (Initial Intake)
**User Action**: Completes 28 questions about background and goals
**Data Stored**:
- Table: `canon_conozcamonos_1_responses`
- Profile Flag: `onboarding_completed = true`
- Timestamp: `onboarding_completed_at`

**Verification Query**:
```sql
SELECT user_id, onboarding_completed, created_at 
FROM despega_user_profiles 
WHERE user_id = {user_id};

SELECT * FROM canon_conozcamonos_1_responses 
WHERE user_id = {user_id};
```

**Next Redirect**: `/despega/a1-cerebral-intro` (if flags set correctly)

---

### Stage 2: A1 Cerebral Assessment (Main DISC Test)
**User Action**: Completes 28-question DISC/Despega Cerebral test
**Data Stored**:
- Table: `a1_cerebral_assessment`
- Profile Flags: 
  - `onboarding_cerebral_completed = true`
  - `a1_test_completed = true`
- Timestamps: `onboarding_cerebral_completed_at`, `a1_test_completed_at`

**Verification Query**:
```sql
SELECT onboarding_cerebral_completed, a1_test_completed 
FROM despega_user_profiles 
WHERE user_id = {user_id};

SELECT disc_profile, created_at FROM a1_cerebral_assessment 
WHERE user_id = {user_id} 
ORDER BY created_at DESC LIMIT 1;
```

**Expected Output**: DISC profile with D/I/S/C scores (normalized to percentages)

**Next Redirect**: `/despega/a1/resultado` (results page) → `/despega/a2/intro`

---

### Stage 3: Conozcámonos-2 (Route Planning Assessment)
**User Action**: Completes assessment on learning style and goals for A2
**Data Stored**:
- Table: `canon_conozcamonos_2_responses`
- Profile Flag: `onboarding_conozcamonos_2_completed = true`
- Timestamp: `onboarding_conozcamonos_2_completed_at`

**Verification Query**:
```sql
SELECT onboarding_conozcamonos_2_completed FROM despega_user_profiles 
WHERE user_id = {user_id};

SELECT * FROM canon_conozcamonos_2_responses 
WHERE user_id = {user_id};
```

**Next Redirect**: `/despega/a2/dashboard` (if `a2_route_generated`)

---

### Stage 4: A2 - Mission Planning (90-Day Journey)
**User Action**: Generates personalized 90-day mission with 3 sprints
**Data Stored**:
- Table: `a2_user_missions`
- Profile Flags:
  - `a2_route_generated = true`
  - `a2_missions_started = true`
- Timestamps: `a2_route_generated_at`, `a2_missions_started_at`

**Verification Query**:
```sql
SELECT a2_route_generated, a2_missions_started FROM despega_user_profiles 
WHERE user_id = {user_id};

SELECT * FROM a2_user_missions 
WHERE user_id = {user_id};
```

**Daily Tracking**: `a2_user_bitacora` (bitácora entries)

**Next Redirect**: `/despega/a3` (if `a3_intro_completed`)

---

### Stage 5: A3 - Interview Training & Simulations
**User Action**: Completes interview simulations with AI feedback
**Data Stored**:
- Table: `a3_interview_results` (multimodal analysis)
- Profile Flags:
  - `a3_intro_completed = true`
  - `a3_entrevista_0_completed = true`
  - `a3_training_started = true`
- Timestamps: `a3_intro_completed_at`, `a3_entrevista_0_completed_at`

**Verification Query**:
```sql
SELECT a3_intro_completed, a3_entrevista_0_completed, a3_training_started 
FROM despega_user_profiles 
WHERE user_id = {user_id};

SELECT * FROM a3_interview_results 
WHERE user_id = {user_id} 
ORDER BY created_at DESC;
```

**AI Analysis Stored**: Audio analysis, video analysis, response quality

**Next Redirect**: `/despega/a4` (if `a4_unlocked`)

---

### Stage 6: A4 - Strategic Radar & Market Intelligence
**User Action**: Engages with strategic insights, market news, gamified tests
**Data Stored**:
- Table: `a4_strategic_score` (radar scores)
- Table: `a4_gamified_test_results` (test performance)
- Table: `a4_engagement_tracking` (news reads, interactions)
- Profile Flag: `a4_unlocked = true`
- Timestamp: `a4_unlocked_at`

**Verification Query**:
```sql
SELECT a4_unlocked FROM despega_user_profiles 
WHERE user_id = {user_id};

SELECT * FROM a4_strategic_score 
WHERE user_id = {user_id} 
ORDER BY created_at DESC;
```

---

## Centralized State Management

All navigation logic depends on `despega_user_profiles` flags:

```typescript
// File: lib/redirect-logic.ts
export async function getNextRequiredPage(userId: string): Promise<string> {
  // Returns exact page user should visit based on completion flags
  // Never uses table existence as criteria - only uses explicit flags
}
```

**All Flags (Master List)**:
```sql
ALTER TABLE despega_user_profiles ADD COLUMN IF NOT EXISTS (
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,
  onboarding_cerebral_completed BOOLEAN DEFAULT false,
  onboarding_cerebral_completed_at TIMESTAMPTZ,
  a1_test_completed BOOLEAN DEFAULT false,
  a1_test_completed_at TIMESTAMPTZ,
  onboarding_conozcamonos_2_completed BOOLEAN DEFAULT false,
  onboarding_conozcamonos_2_completed_at TIMESTAMPTZ,
  a2_route_generated BOOLEAN DEFAULT false,
  a2_route_generated_at TIMESTAMPTZ,
  a2_missions_started BOOLEAN DEFAULT false,
  a2_missions_started_at TIMESTAMPTZ,
  a3_intro_completed BOOLEAN DEFAULT false,
  a3_intro_completed_at TIMESTAMPTZ,
  a3_entrevista_0_completed BOOLEAN DEFAULT false,
  a3_entrevista_0_completed_at TIMESTAMPTZ,
  a3_training_started BOOLEAN DEFAULT false,
  a3_training_started_at TIMESTAMPTZ,
  a4_unlocked BOOLEAN DEFAULT false,
  a4_unlocked_at TIMESTAMPTZ
);
```

---

## Testing Checklist

### Unit Tests (Per Stage)
- [ ] Conozcámonos-1: Form validates, saves to DB, sets flag
- [ ] A1 Cerebral: DISC scoring works, profile normalization correct, flags set
- [ ] Conozcámonos-2: Data saved, flag set, mission generation triggered
- [ ] A2 Mission: Route generated, bitácora tracking active
- [ ] A3 Interview: Multimodal analysis stored, AI feedback generated
- [ ] A4 Radar: Strategic scores calculated, engagement tracked

### Integration Tests (Full Journey)
- [ ] User goes through all 6 stages in sequence
- [ ] Each stage's data persists in database
- [ ] Redirects work based on completion flags only
- [ ] No data loss between stages
- [ ] AI insights generate correctly (OpenAI API working)

### Edge Cases
- [ ] Incomplete page refresh: User returns to same stage, data intact
- [ ] Skip to later stage: System redirects to earliest incomplete stage
- [ ] Missing prerequisites: Cannot access stage, redirects to required prerequisite
- [ ] Profile data corruption: System recovers from inconsistent state

---

## Performance Optimization

**Query Performance**:
- Profile lookup: Index on `user_id` (done)
- Stage data lookup: Index on `user_id, created_at DESC` (recommended)
- Redirect check: Single profile query (fast, under 100ms)

**Caching Strategy**:
- Profile flags: Cache for 60s (user rarely sees multiple stages in 1 minute)
- Assessment data: No cache (always fresh)
- Results/insights: Cache for 24h (expensive to regenerate)

