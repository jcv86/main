# CRITICAL FIXES ROADMAP - PRODUCTION READY (May 22-29, 2026)

## CURRENT STATE: 65% Production Ready

Based on comprehensive audit of 20+ documentation files, the platform is feature-complete but has **3 CRITICAL BLOCKERS** preventing production deployment.

---

## TIER 1: CRITICAL BLOCKERS (MUST FIX - 1.5 hours)

These prevent data integrity and enable user exploitation.

### 1.1 Complete A1 Mission Transaction RPC ⏱️ 30 min
**Status:** MISSING  
**Severity:** CRITICAL  
**Risk:** Points duplicated on double-click, data corruption

**What to build:**
- Create `complete_a1_mission_transaction()` RPC in Supabase
- 5 atomic operations: update mission, add points, update profile, update pilar, log event
- Must fail entirely or succeed entirely (ACID guarantee)
- Add idempotency check: `WHERE completed = FALSE`

**Impact:**
- Prevents 25-point duplication when user double-clicks "Completar Misión"
- Ensures data consistency even with network failures

**Files to create/modify:**
- `lib/supabase/migrations/add-complete-mission-rpc.sql` (NEW)
- `lib/supabase/rpc-helpers.ts` (MODIFY - add function call)

---

### 1.2 Implement Cycle ID System ⏱️ 45 min
**Status:** PARTIALLY BROKEN (hardcoded to "30")  
**Severity:** CRITICAL  
**Risk:** Progress wiped when cycle changes

**Current problem:**
```sql
-- Hardcoded:
despega_a1_results.ciclo = 30
despega_pilar_progress.ciclo_actual = 30

-- When Travis completes 30 → system moves to 31
-- UPSERT ON CONFLICT (user_id, pilar) without ciclo_actual
-- Result: Progress overwrites previous cycle = DATA LOSS
```

**What to build:**
1. Add `cycle_id UUID` column to `despega_pilar_progress`
2. Migrate existing: generate UUID for each user+pilar combination
3. Update UNIQUE constraint: `UNIQUE(user_id, pilar, cycle_id)`
4. Generate new cycle_id on each 90-day reset

**Impact:**
- Enables unlimited 90-day cycles
- Preserves all historical progress
- Prevents accidental overwrites

**Files to create/modify:**
- `lib/supabase/migrations/add-cycle-id.sql` (NEW)
- `lib/supabase/types.ts` (MODIFY - add cycle_id to DiscProfile types)
- `lib/actions/complete-mission.ts` (MODIFY - pass cycle_id to RPC)

---

### 1.3 Fix completeMision() to Use RPC ⏱️ 15 min
**Status:** BROKEN (uses direct upsert, not atomic)  
**Severity:** CRITICAL  
**Risk:** Half-written transactions crash

**Current problem:**
```typescript
// TODAY - NOT ATOMIC:
const { data } = await supabase
  .from('despega_a1_results')
  .upsert([{ user_id, ...data }])

// Problem: If network fails midway, data corrupted
```

**What to build:**
Replace with RPC call:
```typescript
const { data, error } = await supabase.rpc(
  'complete_a1_mission_transaction',
  { 
    user_id: user.id,
    mision_id: mission.id,
    cycle_id: currentCycleId,
    points: 25,
    pilar: mission.pilar
  }
)
```

**Impact:**
- All-or-nothing guarantee
- No half-written data
- Automatic rollback on error

**Files to modify:**
- `lib/actions/complete-mission.ts` (MODIFY - replace direct upsert with RPC call)

---

## TIER 2: HIGH-PRIORITY IMPROVEMENTS (3 hours)

These improve UX and data consistency.

### 2.1 Realign Conozcámonos-1 (5-7 questions vs 28) ⏱️ 45 min
**Status:** MISALIGNED (too heavy for intake)  
**Severity:** HIGH  
**Impact:** Better UX, clearer progression

**Current problem:**
```
TODAY (Confusing):
Login → Conozcámonos-1 [28 questions] → A1 Cerebral [28 Q] → Result

SHOULD BE (Clear):
Login → Conozcámonos-1 [5-7 Q intake] → A1 Cerebral [28 Q diagnostic] → Result
```

**What to build:**
1. Reduce Conozcámonos-1 to intake questions:
   - "¿Cuéntame de ti en 2 minutos?"
   - "¿Qué buscas en tu próximo rol?"
   - "¿Qué 3 cosas quieres desarrollar?"
   - "¿Qué soporte necesitas?"
   - "¿De dónde eres?" (optional)
   - "¿Hablas inglés?" (optional)

2. Update schema: `canon_conozcamonos_1_responses` → 7 fields instead of 28

**Impact:**
- Shorter onboarding (2 min vs 10 min)
- Clearer purpose: intake vs diagnostic
- Better conversion rates

**Files to modify:**
- `app/despega/conozcamonos-1/page.tsx` (MODIFY - reduce questions)
- `lib/supabase/schema.sql` (MODIFY - alter table, drop 21 columns)
- `components/conozcamonos-1-form.tsx` (MODIFY - 7-field form)

---

### 2.2 Centralize User State in despega_user_profiles ⏱️ 30 min
**Status:** FRAGMENTED across multiple tables  
**Severity:** HIGH  
**Risk:** Inconsistent navigation logic

**What to build:**
Add flags to `despega_user_profiles`:
```sql
onboarding_completed BOOLEAN DEFAULT FALSE
a1_cerebral_completed BOOLEAN DEFAULT FALSE
a1_results_saved BOOLEAN DEFAULT FALSE
conozcamonos_2_completed BOOLEAN DEFAULT FALSE
a2_route_generated BOOLEAN DEFAULT FALSE
a2_missions_started BOOLEAN DEFAULT FALSE
a3_intro_completed BOOLEAN DEFAULT FALSE
a3_entrevista_0_completed BOOLEAN DEFAULT FALSE
a3_training_started BOOLEAN DEFAULT FALSE
a4_unlocked BOOLEAN DEFAULT FALSE
```

Update these flags on every milestone completion via RPC.

**Impact:**
- Single source of truth for navigation
- Consistent redirect logic across all pages
- Easy to audit progress

**Files to create/modify:**
- `lib/supabase/migrations/add-progress-flags.sql` (NEW)
- `lib/hooks/use-user-progress.ts` (NEW - hook that reads all flags)
- `middleware.ts` (MODIFY - use flags for routing)

---

### 2.3 Fix A2 Intro Mock Data Replacement ⏱️ 30 min
**Status:** FIXED but needs verification  
**Severity:** MEDIUM  
**Note:** Already applied per AUDIT_COMPLETE.md

**Files modified:**
- `app/despega/a2/intro/page.tsx` - replaced mock DISC with real Supabase fetch

**Verification needed:**
- Load real user's A1 profile → display actual DISC scores
- Test with user who has no A1 results (error handling)
- Test profile display: D/I/S/C values match A1

---

### 2.4 Fix A3 Prerequisite Redirects ⏱️ 30 min
**Status:** PARTIALLY BROKEN  
**Severity:** MEDIUM  
**Risk:** Users in infinite loops

**Current problem:**
```typescript
// TODAY - Generic redirect:
if (needsA2Intro) redirect('/despega/a2/intro')

// Problem: If already saw intro, redirects again → loop
```

**What to build:**
Smart prerequisite checking:
```typescript
const userFlags = await getUserProgressFlags(user.id)

if (!userFlags.onboarding_completed) 
  return redirect('/despega/conozcamonos-1')

if (!userFlags.a1_cerebral_completed) 
  return redirect('/despega/a1')

if (!userFlags.a2_missions_started) 
  return redirect('/despega/a2/intro')

// Otherwise continue to requested page
```

**Impact:**
- No infinite redirects
- Smarter progression
- Users see exactly where they are

**Files to modify:**
- `middleware.ts` (MODIFY - implement smart redirects)
- `lib/supabase/queries/user-progress.ts` (CREATE - helper function)

---

## TIER 3: OPTIONAL ENHANCEMENTS (2 hours)

These improve consistency and UX.

### 3.1 Gamification Audit Follow-ups ⏱️ 45 min
**Status:** 95% complete, minor issues

From AUDIT_REPORT.md, add missing tests:
- XP earned correctly on interview completion
- Streak counter increments daily
- Badge unlock conditions validated
- DTC balance updates atomically

**Files to create:**
- `lib/tests/gamification.test.ts` (NEW - 30 comprehensive tests)

---

### 3.2 A4 Coach Integration ⏱️ 45 min
**Status:** UI ready, needs full integration

- Integrate A4ContextCoach to A4 module pages
- Wire streaming responses to real OpenAI
- Add conversation history persistence
- Test Spanish language support

**Files to modify:**
- `app/despega/a4/contexto/page.tsx` (already done)
- `app/api/despega/a4-coach/route.ts` (enhance streaming)

---

## IMPLEMENTATION SEQUENCE

### Day 1 (May 22-23): CRITICAL FIXES
1. Create `complete_a1_mission_transaction()` RPC
2. Implement cycle_id system
3. Fix completeMision() to use RPC
4. ✅ Test: Double-click mission → 1x points (not 2x)
5. ✅ Test: Cycle 1 progress persists after cycle 2 starts

### Day 2 (May 24): HIGH-PRIORITY FIXES
1. Realign Conozcámonos-1 to 5-7 questions
2. Add progress flags to `despega_user_profiles`
3. Implement smart prerequisite redirects
4. ✅ Test: Full journey C1 → A4 with real data

### Day 3 (May 25): VERIFICATION & POLISH
1. Run comprehensive test suite
2. Verify gamification atomicity
3. A4 coach integration
4. ✅ Production readiness audit

### Day 4-5 (May 26-29): DOCUMENTATION & DEPLOYMENT
1. Update README with new architecture
2. Create runbook for cycle resets
3. Set up monitoring for RPC failures
4. Deploy to production
5. ✅ Production launch

---

## BUILD ARTIFACTS

After implementation, project will have:
- ✅ 0 data corruption risks
- ✅ 0 points duplication
- ✅ Unlimited 90-day cycles with full history
- ✅ Atomic transactions everywhere
- ✅ Clear user progression logic
- ✅ 100% type safety
- ✅ Production-ready monitoring

---

## ESTIMATED EFFORT
- **CRITICAL fixes:** 1.5 hours
- **HIGH-PRIORITY fixes:** 3 hours
- **Testing:** 2 hours
- **Documentation:** 1 hour
- **Deployment:** 0.5 hour
- **TOTAL: 8 hours work, deliverable by May 29**

---

## SUCCESS CRITERIA
- [ ] 0 test failures in critical.test.ts
- [ ] Cycle 1 & 2 data both persist
- [ ] Double-click protection verified
- [ ] Full C1→A4 flow works with real data
- [ ] All RPC calls atomic with 100% success rate
- [ ] Production readiness score: 95%+
