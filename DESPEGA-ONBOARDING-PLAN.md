## DESPEGA ONBOARDING FLOW PLAN v120

### OVERVIEW
Complete onboarding flow for new users that creates unique profiles through the "Despega Cerebral" (A1) test, establishing the foundation for personalized development across 4 pillars over 90 days.

---

## CURRENT STATE ANALYSIS

### Existing Components
1. **Onboarding Page** (`/app/despega/onboarding/page.tsx`)
   - Step 1: Welcome/Intro - Explains 4 pillars and 90-day system
   - Step 2: Path Selection - Choose "Camino Persona" and/or "Camino Profesional"
   - Step 3: A1 Test - 8 questions covering Energía, Enfoque, Relaciones, Plan Ejecutivo
   - Step 4: Results - Shows diagnostic profile

2. **A1 Cerebral Test** (`/app/despega/a1-cerebral/page.tsx`)
   - 20 comprehensive questions across 4 areas
   - Mix of scale and multiple-choice questions
   - Saves results to `despega_a1_test_results` table

3. **Database Structure**
   - `despega_user_profiles` - Stores path selection, onboarding completion status
   - `despega_a1_test_results` - Stores test responses and scores
   - `despega_pilar_progress` - Tracks progress on 4 pillars (A1, A2, Aterrizaje, Base)
   - `despega_rankings` - Stores user scores for leaderboards

---

## ISSUES TO FIX

1. **BookOpen Icon Error** - landing-page-optimized.tsx still references undefined BookOpen
2. **Circular Flow** - After onboarding, unclear where users should go next
3. **Navigation Gaps** - No clear path from auth → onboarding → dashboard
4. **Test Gating** - Dashboard blocks content for 0 tests, but should redirect to onboarding
5. **Results Persistence** - Onboarding results need to properly unlock dashboard

---

## PROPOSED COMPLETE FLOW

### PHASE 1: Authentication → Onboarding Gate
**Entry Point**: User completes email confirmation after signup
- Check if user has completed onboarding via `despega_user_profiles.onboarding_completed`
- If NOT: Redirect to `/app/despega/onboarding` 
- If YES: Redirect to `/dashboard`

### PHASE 2: Onboarding (4 Steps)
**Location**: `/app/despega/onboarding/page.tsx`

**Step 1: Welcome Introduction** (Current ✓)
- Show 4 pillars of system
- Explain 90-day transformation
- Set expectations

**Step 2: Path Selection** (Current ✓)
- Camino Persona: Personal development focus
- Camino Profesional: Career development focus
- Can select both
- Saves to `despega_user_profiles`

**Step 3: Despega Cerebral A1 Test** (Current ✓)
- 8 questions (or expand to 20 from A1 Cerebral page)
- Categories: Energía, Enfoque, Relaciones, Plan Ejecutivo
- Calculate scores and level (Principiante/Intermedio/Avanzado)
- Real-time progress bar

**Step 4: Results & Profile Creation** (Current ✓)
- Show diagnostic profile with 4 dimension scores
- Display assigned level
- Personalized message based on results
- Save to database:
  - `despega_user_profiles` - Mark `onboarding_completed: true`
  - `despega_a1_test_results` - Store all responses
  - `despega_pilar_progress` - Initialize all 4 pillars
  - `despega_rankings` - Create initial scores

### PHASE 3: Post-Onboarding Redirect
After results shown, button: "Comenzar mi Desarrollo" → `/dashboard`

### PHASE 4: Dashboard (Unlocked)
**Location**: `/dashboard` with DashboardContent component
- Now that `onboarding_completed: true`, dashboard fully unlocks
- Shows personalized content based on:
  - Selected paths (Persona/Profesional)
  - Test scores in each dimension
  - Assigned level
- Can access all 4 pillars
- Start A2 Rutas (personalized to scores)
- Access Biblioteca
- Chat with Coach IA

---

## IMPLEMENTATION CHECKLIST

### Part 1: Fix Landing Page (BLOCKING)
- [ ] Fix BookOpen undefined error in landing-page-optimized.tsx line 170
  - Remove BookOpen import, use alternative icon (Zap/Target)
  
### Part 2: Auth → Onboarding Flow
- [ ] Create middleware/guard in `/dashboard` that checks onboarding status
  - If NOT onboarded → redirect to `/app/despega/onboarding`
  - If onboarded → show dashboard
  
- [ ] After signup email confirmation → redirect to `/app/despega/onboarding`
  - Update auth page or session wrapper
  
### Part 3: Enhance Onboarding
- [ ] Verify database schema exists:
  - `despega_user_profiles`
  - `despega_a1_test_results`
  - `despega_pilar_progress`
  - `despega_rankings`

- [ ] Test end-to-end flow:
  1. Sign up with email
  2. Confirm email
  3. Redirect to onboarding
  4. Complete 4 steps
  5. View results
  6. Click "Comenzar" → Dashboard

### Part 4: Dashboard Integration
- [ ] Update dashboard-content.tsx to use `despega_user_profiles.onboarding_completed`
  - Instead of just checking `completedTests`, also check `onboarding_completed`
  - Show personalized content based on paths selected

### Part 5: Pillar Navigation
- [ ] Create pillar entry points:
  - A1 Cerebral: `/app/despega/a1-cerebral` (completed)
  - A2 Rutas: `/app/despega/a2-rutas` (to build)
  - Aterrizaje: `/app/despega/aterrizaje` (to build)
  - Base: `/app/despega/base` (to build)

- [ ] Link from dashboard to each pillar

### Part 6: Data Sync
- [ ] Ensure all 4 tables sync correctly:
  - After A1 test → update `despega_pilar_progress` with A1 results
  - Initialize A2, Aterrizaje, Base as "locked" until A1 complete
  - Update `despega_rankings` with initial scores

---

## DATABASE REQUIREMENTS

### Tables Needed
```
1. despega_user_profiles
   - user_id (FK)
   - camino_persona_active (bool)
   - camino_profesional_active (bool)
   - camino_foco (persona|profesional|ambos)
   - onboarding_completed (bool)
   - a1_test_completed (bool)

2. despega_a1_test_results
   - user_id (FK)
   - score_energia (0-100)
   - score_enfoque (0-100)
   - score_relaciones (0-100)
   - score_plan_ejecutivo (0-100)
   - nivel_detectado (principiante|intermedio|avanzado)
   - respuestas_raw (JSONB)

3. despega_pilar_progress
   - user_id (FK)
   - pilar (a1_cerebral|a2_rutas|aterrizaje|base)
   - estado (JSONB)
   - progreso (0-100)
   - score (0-100)

4. despega_rankings
   - user_id (FK)
   - score_pilar_a1, a2, aterrizaje, base
   - score_camino_persona, profesional
   - score_general
```

---

## SUCCESS CRITERIA

✅ New user signs up → Gets email confirmation  
✅ Confirms email → Automatically redirected to onboarding  
✅ Completes 4-step onboarding → Creates unique profile  
✅ Takes A1 Despega Cerebral test → Gets personalized scores  
✅ Views results → Redirects to dashboard  
✅ Dashboard shows personalized content based on profile  
✅ Can navigate to next pillar (A2)  
✅ Leaderboards show user ranked by scores  

---

## TIMELINE ESTIMATE

1. Fix landing page error: **5 min**
2. Auth → Onboarding redirect: **30 min**
3. Verify database schema: **15 min**
4. End-to-end testing: **20 min**
5. Dashboard personalization: **30 min**
6. Pillar navigation setup: **30 min**

**Total: ~2-3 hours for complete implementation**

---

## NEXT STEPS

Ready to start? Which area first?
1. Fix landing page error (prerequisite)
2. Implement auth redirect flow
3. Test onboarding end-to-end
4. Build next pillar (A2 Rutas)
