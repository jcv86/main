# Quick Start: Fix Module Unlock System

## The Problem
After completing interview-0, the next module (Método STAR) stays locked instead of unlocking when 70 XP is earned.

## The Solution: 3 Steps

### Step 1: Initialize Module Rules
Run this command in your terminal (or curl from Postman):

```bash
curl -X POST http://localhost:3000/api/admin/init-modules \
  -H 'x-init-secret: dev-secret-key' \
  -H 'Content-Type: application/json'
```

Expected: `{ "success": true, "message": "Initialized 10 A3 modules" }`

### Step 2: Complete Interview-0 (in browser)
1. Go to `/despega/interview-0`
2. Complete all 4 blocks and get score 100
3. Click "Continuar a Resultados"
4. Check browser console for `[v0]` logs (proof of XP award)

### Step 3: Verify in A3 Dashboard
1. Go to `/despega/a3`
2. You should see:
   - ✅ Auditoría Inicial: COMPLETED
   - 🔓 Método STAR: AVAILABLE (NOT LOCKED!)
   - 🔒 CV Inteligente: LOCKED (needs 140 XP)

## Debug: Check Your Progress

```bash
curl "http://localhost:3000/api/admin/debug-progress?secret=dev-secret-key"
```

Look for:
- `"total_xp": 70` ← You got XP!
- `"completed_modules": ["auditoria-inicial"]` ← Module marked complete
- `"state": "available"` for metodo-star ← Should unlock!

## What Happens Next

Each module you complete:
- Auditoría Inicial → +70 XP (total: 70) → Método STAR unlocks
- Método STAR → +70 XP (total: 140) → CV Inteligente unlocks
- CV Inteligente → +70 XP (total: 210) → Análisis de Vacante unlocks
- ... continues to Simulación Real at 630 XP

All 10 modules automatically unlock as you earn XP and complete prerequisites.

## Architecture

```
Interview-0 Score 100
    ↓
Award 70 XP
    ↓
Mark 'auditoria-inicial' as completed
    ↓
Check unlock rules for 'metodo-star':
  - Prerequisites: auditoria-inicial ✓ (completed)
  - XP required: 70 ✓ (you have 70)
    ↓
Método STAR becomes AVAILABLE
    ↓
Frontend loads and shows it unlocked!
```

## Key Files

- **Database**: `a3_module_unlock_rules` table (populated by init endpoint)
- **Logic**: `lib/a3-module-unlock.ts` (checks XP and prerequisites)
- **API**: `/api/a3/user-progress` (returns module states)
- **XP Save**: `lib/interview-0/db.ts` completeInterview0() function
- **Debug**: `/api/admin/debug-progress` (shows current status)

## Logging

Watch browser console for these messages after completing interview-0:

```
[v0] Saving interview-0: { userId: 'abc12345', ... }
[v0] Completing interview-0 with score: 100
[v0] completeInterview0: Starting for user abc12345 with score 100
[v0] Updated interview-0 progress record
[v0] Existing progress found: false
[v0] Creating new progress record with 70 XP and auditoria-inicial module
[v0] Progress record created successfully
[v0] completeInterview0: Finished successfully
```

## Still Locked? Troubleshoot

1. **Module rules not initialized?**
   ```bash
   curl -X POST http://localhost:3000/api/admin/init-modules \
     -H 'x-init-secret: dev-secret-key'
   ```

2. **XP not saved?**
   - Check browser console for `[v0]` messages
   - Check `/api/admin/debug-progress` - is total_xp showing as 0?

3. **Module rules not in DB?**
   - Run debug endpoint
   - Look for `"rules_in_db": true`
   - If false, run init endpoint above

4. **Still confused?**
   - Read full guide: `docs/A3-MODULE-UNLOCK-DEBUG.md`
   - Check server logs for errors
   - Call debug endpoint for detailed status

## Success Criteria

✅ Module rules initialized (10 modules in DB)
✅ Interview-0 completes with score 100
✅ 70 XP awarded to user
✅ Auditoría Inicial marked as completed
✅ Método STAR shows as AVAILABLE in A3 dashboard
✅ Next module (CV Inteligente) shows as LOCKED until 140 XP earned
