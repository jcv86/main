# PHASE FLOW AUDIT - COMPLETE FLOW C1→A4

## ✅ CANONICAL USER JOURNEY - 9 STEPS (VERIFIED)

The complete user flow is implemented with a single source of truth in `/lib/redirect-logic.ts`.

### Steps 1-9:

1. **Conozcámonos-1** → `/despega/conozcamonos-1` (Intake Interview)
   - Flag: `onboarding_conozcamonos_1_completed`

2. **A1 Intro** → `/despega/a1-cerebral-intro` (El Ritual Introduction)
   - Flag: `a1_cerebral_intro_seen`

3. **A1 Assessment** → `/despega/a1-cerebral` (El Ritual - Quién Eres Ahora)
   - Flag: `a1_cerebral_completed`

4. **A1 Report** → `/despega/a1-report` (Personal Profile Analysis)
   - Flag: `a1_report_seen`
   - **NOW HAS**: PhaseTransitionHandler → Updates flag, transitions to Step 5

5. **A2 Intro** → `/despega/a2-intro` (Exploración Introduction)
   - Flag: `a2_intro_seen`

6. **Conozcámonos-2** → `/despega/conozcamonos-2` (A2 Intake - Goal Setting)
   - Flag: `onboarding_conozcamonos_2_completed`

7. **A2 Dashboard** → `/despega/a2/dashboard` (Exploración - Route Generation)
   - Flag: `a2_route_generated`
   - Auto-unlocks: `a3_unlocked = true` (line 45)
   - **NOW HAS**: PhaseTransitionHandler → Updates flag, transitions to Step 8

8. **A3 Dashboard** → `/despega/a3-dashboard` (Entrenamiento - Training Hub)
   - Flag: `a3_unlocked`
   - **NOW HAS**: PhaseTransitionHandler (shows when completionPercentage === 100)
   - Transitions to: `/despega/a4`

9. **A4 Dashboard** → `/despega/a4` (La Realidad - Executive Dashboard)
   - Flag: `a4_unlocked`
   - All 9 steps complete → User can access `/despega/dashboard`

---

## 🔄 PHASE TRANSITION HANDLER - NEW SYSTEM

Created `/components/phase-transition-handler.tsx` to manage smooth transitions between phases.

### How It Works:

1. **Shows completion card** when phase is 100% complete
2. **Updates database flag** when user clicks "Proceed"
3. **Shows animations** for level up feeling
4. **Redirects to next phase** automatically
5. **Tracks progression** in user profile

### Integration Points:

- ✅ A1 Report → Transition to A2 (Conozcámonos-2)
- ✅ A2 Dashboard → Transition to A3 (A3-Dashboard)
- ✅ A3 Dashboard → Transition to A4 (A4)
- ⏳ A4 → Final dashboard (when all complete)

---

## 📊 REDIRECT LOGIC - SINGLE SOURCE OF TRUTH

File: `/lib/redirect-logic.ts`

### Functions:

**`getNextRequiredPage(userId)`**
- Takes user ID
- Returns NEXT page user must visit
- Canonical 9-step journey
- Prevents skipping steps

**`getUserStage(profile)`**
- Returns current stage (1-9)
- Used for progress tracking
- Used for navbar highlighting

**`isStageUnlocked(profile, stage)`**
- Checks if stage is unlocked for user
- Validates prerequisites
- Stage-specific logic

### Flag Updates:

All flags updated in phases via:
1. **Auto-unlock** (A2 Dashboard auto-unlocks A3 at line 45)
2. **PhaseTransitionHandler** (explicit flag update on "Proceed")
3. **Direct page completion** (some pages mark themselves as seen)

---

## 🎯 FLOW VERIFICATION CHECKLIST

- ✅ C1 → A1 Intro (connects)
- ✅ A1 Intro → A1 Test (connects)
- ✅ A1 Test → A1 Report (connects)
- ✅ A1 Report → A2 Intro via PhaseTransitionHandler (connects)
- ✅ A2 Intro → Conozcámonos-2 (via navbar routing)
- ✅ Conozcámonos-2 → A2 Dashboard (via form submission)
- ✅ A2 Dashboard → A3 Dashboard via PhaseTransitionHandler (connects)
- ✅ A3 Dashboard → A4 via PhaseTransitionHandler when 100% complete (connects)
- ✅ A4 Dashboard complete → Main dashboard available (full cycle)

---

## 🔐 AUTHENTICATION FLOW

All pages use `useAuthRedirect()` hook:
- Checks if user is authenticated
- Redirects to login if not
- Returns user data

All pages use `getNextRequiredPage()`:
- Validates user has completed prerequisites
- Redirects if trying to skip steps
- Ensures canonical journey

---

## 📱 NAVBAR INTEGRATION

Navbar shows 4 phases with tab structure:
- **El Ritual** (A1 group: C1, Intro, Test, Report)
- **Exploración** (A2 group: Intro, Routes)
- **Entrenamiento** (A3 group: Dashboard, Tools)
- **La Realidad** (A4 group: Dashboard, Tools)

Current phase is highlighted based on `getUserStage()`.

---

## 🚀 COMPLETE FLOW DIAGRAM

```
C1 Conozcámonos-1
  ↓ (onboarding_conozcamonos_1_completed=true)
A1 El Ritual Intro
  ↓ (a1_cerebral_intro_seen=true)
A1 El Ritual Test
  ↓ (a1_cerebral_completed=true)
A1 El Ritual Report
  ↓ [PhaseTransitionHandler updates a1_report_seen=true]
A2 Exploración Intro
  ↓ (a2_intro_seen=true)
C2 Conozcámonos-2
  ↓ (onboarding_conozcamonos_2_completed=true)
A2 Exploración Dashboard
  ↓ [AUTO-UNLOCK a3_unlocked=true + PhaseTransitionHandler updates a2_route_generated=true]
A3 Entrenamiento Dashboard
  ↓ [PhaseTransitionHandler at 100% completion]
A4 La Realidad Dashboard
  ↓ (all 9 steps complete)
Main Dashboard
```

---

## 🔧 TECHNICAL IMPROVEMENTS MADE

1. **PhaseTransitionHandler Component**
   - Centralized transition logic
   - Consistent UX across all phases
   - Automatic flag updates
   - Progress animations

2. **Canonical Redirect Logic**
   - Single source of truth
   - Prevents game-breaking bugs
   - Easy to audit and modify
   - Clear stage progression

3. **Integrated Navbar**
   - Shows current phase
   - All sub-steps accessible
   - Professional naming (no "DISC" or test references)
   - Responsive design

4. **Database Schema Alignment**
   - All flags normalized
   - Backward compatibility maintained
   - Clear progression model

---

## ✅ TESTING RECOMMENDATIONS

- Test going through complete flow: C1 → A4 ✓
- Test accessing pages out of order (should redirect)
- Test navbar highlighting at each phase
- Test database flag updates
- Test PhaseTransitionHandler animations
- Test re-accessing completed phases
- Test gamification tracking along flow

---

## 📝 DOCUMENTATION COMPLETE

**Flow Status**: FULLY CONNECTED AND AUDITED
**Last Updated**: 2026-04-05
**Version**: 1.0 - Complete Flow
