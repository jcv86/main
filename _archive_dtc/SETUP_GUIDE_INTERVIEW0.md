# Interview-0 Supabase Integration & User Role System - Setup Guide

## Overview
This project now features full Supabase data persistence, role-based module unlocking, and a superadmin testing mode. All data is saved to Supabase instead of localStorage.

## Database Tables Created
1. **a3_interview_0_progress** - Stores interview-0 audit block results and scores
2. **user_roles_extended** - Stores user roles (regular, superadmin) and unlock status
3. **a3_module_unlock_rules** - Defines module progression logic (10 modules with XP thresholds)
4. **a3_user_progress** - Tracks XP, DTC, and completed modules per user

## Setting Up Superadmin User (travisdev)

### Option 1: Via API Endpoint (Easiest for v0)
1. Set the environment variable `ADMIN_SETUP_SECRET` in your project settings
2. Call the endpoint:
```bash
curl -X POST http://localhost:3000/api/admin/setup-superadmin \
  -H "x-admin-secret: YOUR_ADMIN_SETUP_SECRET" \
  -H "Content-Type: application/json"
```

### Option 2: Via Node Script
```bash
cd /vercel/share/v0-project
# Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set
node scripts/setup-superadmin.js
```

### Superadmin User Details
- **Email**: travisdev@example.com
- **Password**: TestPassword123!
- **Features**:
  - All 10 modules unlocked (no progression restrictions)
  - XP: 999,999 (stays full, never changes)
  - Can freely explore all modules without restrictions
  - Represents a fully completed user account

## How Module Unlocking Works

### For Regular Users
Modules unlock sequentially based on:
1. **Prerequisite Completion** - Must complete the previous module first
2. **XP Requirements** - Must have earned enough XP
3. **Sequential Progression** - Follows Level 1 → Level 2 → Level 3 progression

### Module Progression
- **Level 1**: Auditoría Inicial (0 XP) → Unlocks 4 tools at 70 XP each
- **Level 2**: 4 Tools (140 XP each) → Unlocks Trainings at 140-200 XP
- **Level 3**: 4 Trainings (200 XP) → Unlocks Simulación Real at 280 XP

### For Superadmin Users
- All modules instantly unlocked
- XP always shows full (999,999)
- Can access any module without restrictions
- Perfect for testing the full app flow

## Data Flow

### Interview-0 Completion
1. User completes all 4 audit blocks
2. `/api/interview-0/save` persists data to Supabase
3. Upon completion, `completeInterview0()` is called
4. **70 XP awarded** to user
5. "Auditoría Inicial" marked as completed
6. User redirected to `/despega/a3`
7. Dashboard shows Método STAR and other tools now unlocked

### Module Unlock Check
When user accesses `/despega/a3`:
1. API calls `/api/a3/user-progress`
2. Checks `a3_user_progress` table for user's XP and completed modules
3. Queries `a3_module_unlock_rules` to determine which modules should unlock
4. Returns module states: available, locked, or completed
5. Frontend displays appropriate UI

## Key Utilities

### `lib/user-roles.ts`
- `getUserRole()` - Get user's role
- `isSuperadmin()` - Check if user is superadmin
- `setSuperadmin()` - Set user as superadmin (admin only)

### `lib/a3-module-unlock.ts`
- `isModuleUnlocked()` - Check if specific module is unlocked
- `getAllModulesUnlockStatus()` - Get unlock status for all modules
- `completeModule()` - Mark module as completed and award XP
- `getUserXP()` - Get user's current XP

### `lib/interview-0/db.ts`
- `saveInterview0Progress()` - Persist interview-0 blocks to Supabase
- `completeInterview0()` - Mark interview-0 complete and award XP
- `getInterview0Progress()` - Retrieve saved interview-0 data

## API Endpoints

### `/api/interview-0/save` (POST)
Saves interview-0 progress to Supabase. If `interview_0_completed: true` and `final_score` provided, awards 70 XP and marks module complete.

### `/api/interview-0/get` (GET)
Retrieves user's interview-0 progress from Supabase.

### `/api/a3/user-progress` (GET)
Returns user's XP, completed modules, and module unlock status. Superadmin users get all modules available and full XP display.

### `/api/admin/setup-superadmin` (POST)
Creates/updates travisdev superadmin user. Requires `x-admin-secret` header.

## Testing

### Test Regular User Flow
1. Sign in with any user
2. Complete interview-0 (all 4 audit blocks)
3. Earn 70 XP
4. See Método STAR and other tools unlocked
5. Complete tools to unlock trainings
6. Complete trainings to unlock final simulation

### Test Superadmin Flow
1. Set up travisdev superadmin (see above)
2. Sign in as travisdev@example.com / TestPassword123!
3. See all 10 modules available at `/despega/a3`
4. Access any module without restrictions
5. XP displays 999,999 and never changes
6. Perfect for testing all content without progression barriers

## Troubleshooting

**"No user found"** when saving interview-0
- Check if user session is valid
- For demo mode (no auth), data returns success but isn't persisted
- Ensure user is authenticated before completing interview-0

**Modules not unlocking**
- Check user's XP in `a3_user_progress` table
- Verify prerequisite module is in `completed_modules` array
- Check `a3_module_unlock_rules` for correct XP thresholds

**Superadmin setup fails**
- Ensure `ADMIN_SETUP_SECRET` environment variable is set
- Verify `SUPABASE_URL` and service role key are configured
- Check that database tables exist and RLS policies are correct
