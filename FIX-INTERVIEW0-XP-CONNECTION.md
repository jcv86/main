# Fix Interview-0 → XP → A3 Module Unlock Connection

## The Problem
After completing interview-0, the XP is not being saved to the database, so:
- A3 page shows 0 XP (should show 70)
- A3 page shows "0/4 Niveles Completados" (should show "1/4")
- Método STAR shows "Bloqueado" (should show "Desbloqueado")

## Why It's Happening
The `completeInterview0()` function in `lib/interview-0/db.ts` is being called, but the data isn't persisting in the `a3_user_progress` table.

## Step-by-Step Fix

### Step 1: Verify Current Database State
```bash
curl -X POST http://localhost:3000/api/admin/verify-database \
  -H 'x-verify-secret: verify-db-now' \
  -H 'Content-Type: application/json'
```

This will show you:
- ✅ If `a3_user_progress` table has your record
- ✅ Current XP total
- ✅ Completed modules list
- ✅ If interview-0 is marked as completed

### Step 2: If No XP Data Exists
The data is not being saved. Run this endpoint to manually award the XP:

```bash
curl -X POST http://localhost:3000/api/admin/fix-xp-manually \
  -H 'x-fix-secret: fix-xp-now' \
  -H 'Content-Type: application/json'
```

This will:
- ✅ Mark interview-0 as complete with score 100
- ✅ Award 70 XP
- ✅ Mark 'auditoria-inicial' as completed
- ✅ Return verification that it worked

### Step 3: Verify A3 Page Shows Updates
1. Go to https://despega.local/despega/a3
2. You should now see:
   - XP GANADOS: 70 de 290 XP totales
   - PROGRESO GENERAL: 1/4 Niveles Completados (25%)
   - Auditoría Inicial: ✓ 70/70 XP (Completado)
   - Método STAR: 🔓 Desbloqueado (Available button)

### Step 4: If Still Not Working

#### Check Interview-0 Save Endpoint
The issue is likely in `/api/interview-0/save` route. This endpoint is called when you click "Continuar" after completing interview-0. It calls `completeInterview0()` which should save the XP.

**Debug Flow:**
1. Complete interview-0 normally (get 100/100 score)
2. Click "Continuar a Resultados" button
3. You should see console logs (press F12 to open DevTools)
4. Look for `[v0]` messages showing:
   - "Saving interview-0: ..."
   - "Completing interview-0 with score: 100"
   - "Interview-0 completion saved, 70 XP awarded"

#### Check Database Tables Exist
```bash
# In Supabase, go to SQL Editor and run:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'a3_%';
```

You should see:
- ✅ a3_user_progress
- ✅ a3_interview_0_progress
- ✅ a3_module_unlock_rules

#### Check Module Unlock Rules Are Populated
```bash
# In Supabase SQL Editor:
SELECT * FROM a3_module_unlock_rules ORDER BY sequence_order;
```

You should see 10 rows (one for each module):
1. auditoria-inicial (0 XP, no prerequisite)
2. metodo-star (70 XP, prerequisite: auditoria-inicial)
3. cv-inteligente (140 XP, prerequisite: metodo-star)
... etc

If empty, run `/api/admin/init-modules` endpoint to populate.

## The Full Data Flow

```
1. User completes interview-0
   ↓
2. Clicks "Continuar a Resultados" button
   ↓
3. Calls /api/interview-0/save POST
   ├─ Saves interview-0 progress
   └─ Calls completeInterview0(userId, finalScore)
   ↓
4. completeInterview0() function:
   ├─ Marks interview-0 as complete in a3_interview_0_progress
   ├─ Gets or creates a3_user_progress record
   ├─ Awards 70 XP
   ├─ Adds 'auditoria-inicial' to completed_modules array
   └─ Saves to database
   ↓
5. User navigates to A3 page (/despega/a3)
   ↓
6. A3 page calls /api/a3/user-progress GET
   ├─ Calls getUserXP(userId) → should return 70
   ├─ Calls getUserCompletedModules(userId) → should return ['auditoria-inicial']
   └─ Builds moduleStates based on XP and completed modules
   ↓
7. A3 displays:
   - Total XP: 70/280
   - Auditoría Inicial: Completed
   - Método STAR: Available (because XP >= 70 and prerequisite complete)
   - Other modules: Locked
```

## Temporary Workaround

If the data flow is broken, use the manual fix endpoint after each interview-0:

```bash
curl -X POST http://localhost:3000/api/admin/fix-xp-manually \
  -H 'x-fix-secret: fix-xp-now'
```

Then refresh the A3 page (F5).

## Troubleshooting Matrix

| Symptom | Cause | Fix |
|---------|-------|-----|
| `a3_user_progress` is empty | `completeInterview0()` not being called | Check if interview-0 save endpoint is reachable |
| `a3_user_progress` exists but XP is 0 | Data saved as wrong value | Check if final_score is being passed correctly |
| `completed_modules` array is empty | Module completion not added | Check `completeInterview0()` is using .push() correctly |
| Método STAR still locked after XP awarded | Module rules don't exist or are wrong | Run init-modules endpoint to populate rules |
| "Desbloquea al completar Nivel 1" text persists | Frontend not refreshing user progress | Go back to /despega/interview-0, then return to A3 |

