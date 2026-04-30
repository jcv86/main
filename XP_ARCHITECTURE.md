# XP Architecture Documentation

## Overview

This document explains the new XP architecture that cleanly separates **section-specific XP** from **global XP totals**.

## Architecture

```
Activity (A3 Interview, A4 Module, etc.)
    ↓
logXPActivity() from xp-logger.ts
    ↓
POST /api/gamification/xp-activity
    ↓
xp_activity_logs table (audit trail)
    ↓
Database Trigger: sync_xp_to_profile()
    ↓
user_gamification_profile (pre-calculated values)
    ↓
GET /api/gamification/global (reads cached values)
```

## Key Tables

### `xp_activity_logs` (Append-only audit trail)
```sql
- id (UUID)
- user_id (FK to auth.users)
- section (A3, A4, INTERVIEW, BONUS)
- activity_type (e.g., 'interview_completion', 'module_completion')
- xp_amount (int)
- reference_id (optional, e.g., interview_id or module_id)
- metadata (JSONB for context)
- created_at (timestamp)
```

**Key Property**: Immutable, append-only. Every XP gain is recorded here.

### `user_gamification_profile` (Pre-calculated values)
```sql
- xp_a3_total (sum of all A3 activities)
- xp_a4_total (sum of all A4 activities)
- xp_interview_bonus (sum of interview/bonus activities)
- xp_global_total (sum of all three above)
- current_level (calculated from xp_global_total)
- xp_last_sync (when values were last updated)
```

**Key Property**: Updated automatically by triggers. Always consistent.

## How It Works

### 1. Activity Occurs
User completes an interview in A3 with a score of 85.

### 2. Log the XP
```typescript
import { logXPActivity, XP_REWARDS } from '@/lib/xp-logger'

await logXPActivity({
  section: 'A3',
  activity_type: 'interview_completion',
  xp_amount: XP_REWARDS.A3.INTERVIEW_STRUCTURED, // 200 XP
  reference_id: interview.id,
  metadata: {
    score: 85,
    difficulty: 'structured',
    time_taken: 1200, // seconds
  }
})
```

### 3. Database Records It
- Row inserted into `xp_activity_logs`
- Trigger fires: `sync_xp_to_profile()`
- `user_gamification_profile` updated with new totals:
  - `xp_a3_total` += 200
  - `xp_global_total` += 200
  - `current_level` recalculated (1000 XP = 1 level)

### 4. Frontend Reads It
```typescript
// Get global stats
const response = await fetch('/api/gamification/global')
const data = await response.json()
// data.breakdown = { a3_xp: 200, a4_xp: 0, interview_bonus: 0 }
// data.total_xp = 200
// data.current_level = 1 (< 1000 XP)
```

## Integration Guide

### For A3 Interview Handlers

When a user completes an interview:

```typescript
import { logXPActivity, XP_REWARDS } from '@/lib/xp-logger'

// In your interview completion handler
const xpAmount = calculateXPForInterview(interview.score, interview.difficulty)

await logXPActivity({
  section: 'A3',
  activity_type: 'interview_completion',
  xp_amount: xpAmount,
  reference_id: interview.id,
  metadata: {
    score: interview.score,
    difficulty: interview.difficulty,
  }
})
```

### For A4 Module Handlers

When a user completes a module:

```typescript
import { logXPActivity, XP_REWARDS } from '@/lib/xp-logger'

// When module reaches 100%
await logXPActivity({
  section: 'A4',
  activity_type: 'module_completion',
  xp_amount: XP_REWARDS.A4.MODULE_100_PERCENT, // 150 XP
  reference_id: module.id,
  metadata: {
    module_name: module.name,
    completion_time: completionSeconds,
  }
})
```

### For Interview Score Bonuses

```typescript
import { logXPActivity, XP_REWARDS } from '@/lib/xp-logger'

// If score is 95+ or other criteria met
const bonus = XP_REWARDS.A3.PERFECT_SCORE_BONUS(interview.score)
if (bonus > 0) {
  await logXPActivity({
    section: 'A3',
    activity_type: 'perfect_score_bonus',
    xp_amount: bonus,
    reference_id: interview.id,
    metadata: { score: interview.score }
  })
}
```

## XP Rewards Reference

See `lib/xp-logger.ts` for `XP_REWARDS` object with all standard values.

## Data Consistency

### Before this system:
- XP values scattered across different tables
- No single source of truth
- Difficult to debug or audit XP gains
- No clear separation between section XP and global XP

### After this system:
- Single append-only audit trail (`xp_activity_logs`)
- Pre-calculated totals always in sync (`user_gamification_profile`)
- Clear breakdown by section
- Easy to audit ("what XP did user X earn?")
- No double-counting or conflicts

## FAQ

**Q: What if the database trigger fails?**
A: The XP activity is still logged. A background job can periodically resync profiles.

**Q: Can XP be removed or refunded?**
A: Yes, log a negative XP_REWARDS or REFUND activity with negative xp_amount.

**Q: How do I query user's XP history?**
A: Use `GET /api/gamification/xp-activity?section=A3&limit=50`

**Q: Is there a way to check data consistency?**
A: Run: `SELECT user_id, xp_global_total, (SELECT SUM(xp_amount) FROM xp_activity_logs WHERE user_id = ugp.user_id) as calculated FROM user_gamification_profile ugp` to compare profile totals vs. calculated sums.

## Deployment Checklist

- [ ] Apply migration: `02-xp-activity-logs.sql` in Supabase
- [ ] Update A3 interview handlers to call `logXPActivity()`
- [ ] Update A4 module handlers to call `logXPActivity()`
- [ ] Update interview score bonus logic to call `logXPActivity()`
- [ ] Test backfill: Verify historical XP was correctly populated
- [ ] Monitor: Check `xp_last_sync` timestamps to ensure triggers fire
- [ ] Validate: Run consistency check query above
