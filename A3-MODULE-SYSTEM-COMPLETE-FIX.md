# Complete A3 Module Unlock - Debugging & Recovery Guide

## THE ROOT PROBLEM

Your module unlock system wasn't working because:
1. **Empty module rules table** - `a3_module_unlock_rules` had no data
2. **Duplicate user progress records** - Some users had multiple progress records blocking updates
3. **Missing XP validation** - No way to verify if XP was actually saved

## COMPLETE FIX - 5 STEPS

### Step 1: Run Comprehensive Debug Endpoint
This endpoint will identify ALL issues and fix them automatically:

```bash
curl -X POST http://localhost:3000/api/admin/comprehensive-debug \
  -H 'x-debug-secret: debug-all-issues' \
  -H 'Content-Type: application/json'
```

**What this does:**
- ✅ Clears corrupted module rules
- ✅ Inserts all 10 modules with proper XP progression (0, 70, 140, 210, 280, 350, 420, 490, 560, 630)
- ✅ Finds and removes duplicate user progress records
- ✅ Validates all XP awards match completed modules
- ✅ Tests unlock logic and reports all findings

**Expected Response:**
```json
{
  "success": true,
  "issues": [...],
  "fixes": [...],
  "moduleRulesCount": 10,
  "summary": "Found X issues, Applied Y fixes",
  "details": { "issues": [...], "fixes": [...] }
```

### Step 2: Verify Module Rules Were Created

```bash
curl "http://localhost:3000/api/admin/debug-progress?secret=dev-secret-key"
```

Check the response includes all 10 modules with correct XP thresholds.

### Step 3: Test the Complete Flow

1. **Complete interview-0** (in browser):
   - Go to http://localhost:3000/despega/interview-0
   - Answer all checks
   - Score should be 100
   - Click "Continuar a Resultados"

2. **Check A3 Dashboard** (should show):
   - Auditoría Inicial ✓ (COMPLETED - green)
   - Método STAR 🔓 (UNLOCKED - orange, clickable)
   - Other modules 🔒 (LOCKED - gray)

### Step 4: Monitor Console Logs

Watch for `[v0]` prefixed logs showing:
- `[v0] completeInterview0: Starting for user...`
- `[v0] Updated interview-0 progress record`
- `[v0] Creating new progress record with 70 XP and auditoria-inicial`
- `[v0] Building module states:` with XP and modules info

### Step 5: Verify Database State

Check these SQL queries in Supabase:

**All module rules defined:**
```sql
SELECT module_id, xp_required, prerequisite_module_id, sequence_order 
FROM a3_module_unlock_rules 
ORDER BY sequence_order;
```

**User progress with XP:**
```sql
SELECT user_id, total_xp, completed_modules, created_at 
FROM a3_user_progress 
ORDER BY created_at DESC 
LIMIT 5;
```

**Interview-0 completions:**
```sql
SELECT user_id, final_score, passed, completed_at 
FROM a3_interview_0_progress 
ORDER BY completed_at DESC 
LIMIT 5;
```

## THE 10-MODULE PROGRESSION

| Module | XP Required | Prerequisite | Level |
|--------|------------|--------------|-------|
| 1. Auditoría Inicial | 0 | None | 1 |
| 2. Método STAR | 70 | Auditoría Inicial | 1 |
| 3. CV Inteligente | 140 | Método STAR | 1 |
| 4. Análisis de Vacante | 210 | CV Inteligente | 1 |
| 5. Análisis Multicanal | 280 | Análisis de Vacante | 1 |
| 6. Entrenamiento Guiado | 350 | Análisis Multicanal | 2 |
| 7. Entrenamiento Estructurado | 420 | Entrenamiento Guiado | 2 |
| 8. Entrenamiento Desafiante | 490 | Entrenamiento Estructurado | 2 |
| 9. Entrenamiento Conversacional | 560 | Entrenamiento Desafiante | 3 |
| 10. Simulación Real | 630 | Entrenamiento Conversacional | 3 |

## XP FLOW

```
Interview-0 Completion
    ↓
Awards 70 XP to user
    ↓
Marks auditoria-inicial as completed
    ↓
Updates a3_user_progress table
    ↓
Next API call checks:
  - Does user have 70+ XP? ✓
  - Is auditoria-inicial completed? ✓
    ↓
Método STAR automatically unlocked!
```

## TROUBLESHOOTING

### "Método STAR still locked after interview-0"

1. Run comprehensive-debug endpoint (Step 1)
2. Check console logs for `[v0]` entries
3. Verify a3_module_unlock_rules table has 10 rows
4. Check if user has 70 XP in a3_user_progress

### "Duplicate progress records"

The debug endpoint automatically removes these. If issues persist:
```sql
DELETE FROM a3_user_progress 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
    FROM a3_user_progress
  ) t WHERE rn > 1
);
```

### "XP not being awarded"

1. Check `/api/interview-0/save` endpoint is being called
2. Verify `completeInterview0()` function in `lib/interview-0/db.ts` runs
3. Search logs for errors in database INSERT/UPDATE

### "Still seeing [v0] debug logs"

These are now disabled. If you see them, restart dev server:
```bash
# Kill and restart
pnpm dev
```

## KEY FILES CHANGED

- `/api/admin/comprehensive-debug` - Main debugging & fixing endpoint
- `/scripts/audit-module-system.ts` - Database audit script
- `/api/a3/user-progress` - Added detailed logging (now disabled)
- `/lib/interview-0/db.ts` - Added completion logging (now disabled)
- `/api/interview-0/save` - Added call logging (now disabled)

## VERIFICATION CHECKLIST

- [ ] Ran comprehensive-debug endpoint
- [ ] Got "success": true response
- [ ] Debug endpoint found 10 module rules
- [ ] Completed interview-0 successfully
- [ ] Método STAR shows as unlocked in A3 dashboard
- [ ] Console shows `[v0]` logs during interview-0 save
- [ ] Database shows correct XP and completed modules
- [ ] No duplicate user progress records

## IF STILL NOT WORKING

1. Share the response from comprehensive-debug endpoint
2. Check database tables exist: `a3_module_unlock_rules`, `a3_user_progress`, `a3_interview_0_progress`
3. Verify no Supabase RLS policies are blocking writes
4. Check `/api/admin/debug-progress` response for actual module states

Good luck! 🚀
