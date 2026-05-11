# A3 Module Unlock System - Complete Debugging & Initialization Guide

## Overview

The A3 learning path has 10 modules that must unlock sequentially based on XP progression:

1. **Auditoría Inicial** (0 XP required) - Always available
2. **Método STAR** (70 XP required) - Requires Auditoría Inicial
3. **CV Inteligente** (140 XP required) - Requires Método STAR  
4. **Análisis de Vacante** (210 XP required) - Requires CV Inteligente
5. **Análisis Multicanal** (280 XP required) - Requires Análisis de Vacante
6. **Entrenamiento Guiado** (350 XP required) - Requires Análisis Multicanal
7. **Entrenamiento Estructurado** (420 XP required) - Requires Entrenamiento Guiado
8. **Entrenamiento Desafiante** (490 XP required) - Requires Entrenamiento Estructurado
9. **Entrenamiento Conversacional** (560 XP required) - Requires Entrenamiento Desafiante
10. **Simulación Real** (630 XP required) - Requires Entrenamiento Conversacional

Each module completion awards 70 XP.

## Step 1: Initialize Module Unlock Rules in Database

The `a3_module_unlock_rules` table must be populated with all 10 modules.

### Option A: Using the API Endpoint (Recommended)

```bash
curl -X POST http://localhost:3000/api/admin/init-modules \
  -H 'x-init-secret: dev-secret-key' \
  -H 'Content-Type: application/json'
```

Expected response:
```json
{
  "success": true,
  "message": "Initialized 10 A3 modules",
  "modules": [
    {
      "module_id": "auditoria-inicial",
      "module_name": "Auditoría Inicial",
      "sequence_order": 1,
      "prerequisite_module_id": null,
      "xp_required": 0,
      "xp_reward": 70
    },
    ...
  ]
}
```

### Option B: Using SQL Script

Run the SQL script in Supabase SQL Editor:

```sql
-- scripts/init-module-unlock-rules.sql
DELETE FROM a3_module_unlock_rules;

INSERT INTO a3_module_unlock_rules (
  module_id,
  module_name,
  sequence_order,
  prerequisite_module_id,
  xp_required,
  xp_reward
) VALUES
  ('auditoria-inicial', 'Auditoría Inicial', 1, NULL, 0, 70),
  ('metodo-star', 'Método STAR', 2, 'auditoria-inicial', 70, 70),
  ('cv-inteligente', 'CV Inteligente', 3, 'metodo-star', 140, 70),
  ... (see scripts/init-module-unlock-rules.sql for full list)
```

## Step 2: Debug Current User Progress

### Check Your Current Status

```bash
curl "http://localhost:3000/api/admin/debug-progress?secret=dev-secret-key"
```

This returns:
- Module unlock rules in database
- Your current XP and completed modules
- Interview-0 score and completion status
- Calculated module states based on your progress

Example response:
```json
{
  "user": {
    "id": "abc12345...",
    "email": "user@example.com"
  },
  "modules": {
    "total_rules": 10,
    "rules_in_db": true,
    "expected_count": 10
  },
  "user_progress": {
    "exists": true,
    "total_xp": 70,
    "completed_modules": ["auditoria-inicial"],
    "last_activity": "2026-05-11T..."
  },
  "interview0": {
    "exists": true,
    "score": 100,
    "passed": true,
    "completed_at": "2026-05-11T..."
  },
  "module_states": {
    "auditoria-inicial": {
      "state": "completed",
      "details": { ... }
    },
    "metodo-star": {
      "state": "available",
      "details": { ... }
    },
    "cv-inteligente": {
      "state": "locked_xp",
      "details": {
        "completed": false,
        "has_xp": false,
        "has_prerequisite": true,
        "xp_required": 140,
        "prerequisite": "metodo-star"
      }
    }
  }
}
```

## Step 3: Test Interview-0 Completion

### Manually Trigger XP Award (Development Only)

If interview-0 completes but XP isn't awarded, you can manually test:

```bash
# First check console logs after completing interview-0
# Should see: "[v0] Saving interview-0..." and "[v0] completeInterview0: Starting..."

# Check progress after completion
curl "http://localhost:3000/api/admin/debug-progress?secret=dev-secret-key"
```

## Step 4: Verify Module Unlock

### Check A3 Dashboard

1. Go to `/despega/a3`
2. You should see:
   - Auditoría Inicial: COMPLETED ✓ (assuming you finished interview-0)
   - Método STAR: AVAILABLE (70 XP earned from interview-0)
   - CV Inteligente: LOCKED (requires 140 XP, you only have 70)
   - Other modules: LOCKED

### Check API Response

```bash
curl "http://localhost:3000/api/a3/user-progress"
```

Should return:
```json
{
  "success": true,
  "progress": {
    "totalXp": 70,
    "completedModules": ["auditoria-inicial"],
    "moduleStates": {
      "auditoria-inicial": "completed",
      "metodo-star": "available",
      "cv-inteligente": "locked",
      ...
    }
  }
}
```

## Troubleshooting

### Problem: Module unlock rules not in database

**Solution:**
1. Check if table `a3_module_unlock_rules` exists
2. Call `/api/admin/init-modules` endpoint
3. Verify by checking `/api/admin/debug-progress`

### Problem: Interview-0 completes but XP not awarded

**Solution:**
1. Check browser console logs for `[v0]` messages
2. Check Supabase logs for errors
3. Verify `a3_user_progress` table exists and has proper RLS policies
4. Check that interview-0 completion is calling `completeInterview0()` function

### Problem: STAR module still locked after 70 XP earned

**Solution:**
1. Run debug endpoint: `curl "http://localhost:3000/api/admin/debug-progress?secret=dev-secret-key"`
2. Verify `completed_modules` array includes `"auditoria-inicial"`
3. Verify `total_xp` is >= 70
4. Check module unlock logic in `/lib/a3-module-unlock.ts`
5. Refresh browser to clear any cached states

### Problem: "Module rules error" in debug endpoint

**Solution:**
1. Ensure `a3_module_unlock_rules` table exists
2. Run SQL: `SELECT COUNT(*) FROM a3_module_unlock_rules;`
3. If count is 0, call `/api/admin/init-modules`
4. Check Supabase RLS policies allow SELECT on table

## Database Table Structure

### a3_user_progress
- `user_id` (UUID) - References auth.users
- `total_xp` (INTEGER) - Current XP total
- `total_dtc` (INTEGER) - Current DTC total
- `completed_modules` (TEXT[]) - Array of completed module IDs
- `last_activity_at` (TIMESTAMP) - When user last took action

### a3_interview_0_progress
- `user_id` (UUID) - References auth.users
- `final_score` (INTEGER) - Interview-0 score (0-100)
- `passed` (BOOLEAN) - Whether score >= 60
- `completed_at` (TIMESTAMP) - When interview-0 was completed

### a3_module_unlock_rules
- `module_id` (TEXT) - Unique module identifier (e.g., 'metodo-star')
- `module_name` (TEXT) - Display name (e.g., 'Método STAR')
- `sequence_order` (INTEGER) - Order in progression (1-10)
- `prerequisite_module_id` (TEXT) - Module that must be completed first
- `xp_required` (INTEGER) - XP needed to unlock
- `xp_reward` (INTEGER) - XP awarded for completing (70)

## Architecture Flow

```
User completes Interview-0
        ↓
/api/interview-0/save called with interview_0_completed: true
        ↓
completeInterview0(userId, finalScore) called
        ↓
1. Update a3_interview_0_progress
2. Award 70 XP to a3_user_progress
3. Add 'auditoria-inicial' to completed_modules array
        ↓
Método STAR automatically unlocks (has 70 XP + auditoria-inicial prerequisite met)
        ↓
/api/a3/user-progress returns module states
        ↓
Frontend displays: metodo-star as "available" instead of "locked"
```

## Console Logging

Enable debugging by watching browser console and server logs for `[v0]` messages:

- `[v0] Saving interview-0: ...` - Interview data being saved
- `[v0] completeInterview0: Starting...` - XP award process starting
- `[v0] Updated interview-0 progress record` - Interview record updated
- `[v0] Creating new progress record...` - First-time XP award
- `[v0] Updating existing progress...` - Subsequent XP awards
- `[v0] Building module states...` - API calculating unlock status
- `[v0] Checking metodo-star:...` - Module unlock check

## Testing Checklist

- [ ] Module rules initialized (10 modules in DB)
- [ ] User completes Interview-0 with score >= 60
- [ ] Check server logs show XP award messages
- [ ] Debug endpoint shows total_xp: 70 and completed_modules: ['auditoria-inicial']
- [ ] A3 dashboard shows Método STAR as AVAILABLE
- [ ] Other modules remain LOCKED until prerequisites met
- [ ] Complete Método STAR → 140 XP earned → CV Inteligente unlocks
- [ ] Progression continues sequentially through all 10 modules

