# Demo User System for Preview

## Overview
The A3 progress tracking system now works seamlessly in preview/development environments without requiring authentication.

## Demo User ID
- **ID**: `demo-user-preview-a3`
- **Persistent**: Same ID used across all sessions
- **Scope**: Development and preview environments only

## How It Works

### 1. **Starter XP API** (`/api/a3/starter-xp`)
- If authenticated: Uses real user ID from JWT token
- If no auth: Uses `demo-user-preview-a3`
- Gives 100 XP on first visit, then caches the result
- User can see 10% progress immediately

### 2. **Progress API** (`/api/a3/progress`)
- If authenticated: Fetches real user progress
- If no auth: Fetches demo user progress from `demo-user-preview-a3`
- Returns accumulated XP and completion percentage
- Auto-refreshes every 5 seconds

### 3. **Training Completion API** (`/api/a3/training-completion`)
- If authenticated: Saves to real user account
- If no auth: Saves to demo user `demo-user-preview-a3`
- Awards 120 XP per training completion
- Updates progress bar in real-time

## Preview Behavior

### First Visit
```
User visits /despega/a3 in preview
→ No auth required
→ Starter XP awarded automatically (+100 XP)
→ Progress dashboard shows:
   - 100 XP de 1000 (10%)
   - 1/7 entrenamientos completados
   - Smooth animation from 0% to 10%
```

### Simulating Training Completion
```
Click "Simular Completación (+120 XP)" button
→ Training saved for demo user
→ Progress updates to 220 XP (22%)
→ Can repeat unlimited times
→ Progress persists in database
```

### Real User (When Authenticated)
```
User logs in
→ Real JWT token used
→ Demo user XP is separate
→ Real user starts fresh OR sees existing progress
→ All actions saved to their account
```

## Database Structure

```sql
-- a3_training_module_completions table
- user_id: 'demo-user-preview-a3' (for demo user) OR real UUID
- training_type: 'STARTER_XP', 'PILLAR3_TRAINING1', etc.
- xp_amount: 100 (starter) or 120 (training)
- is_first_completion: true (prevents duplicate XP)
- first_completion_at: ISO timestamp
```

## Benefits

1. **No Auth Required**: Works immediately in preview
2. **No Fake Progress**: Real data stored in database
3. **Consistent**: Same demo user across sessions
4. **Motivating**: Shows immediate 10% progress to visitors
5. **Testable**: Can simulate all training completions
6. **Production Ready**: Authenticated users unaffected

## Security Notes

- Demo user ID is just a string - not a security risk
- Demo user data is completely separate from real users
- Each real user has their own UUID and data
- No authentication bypass - demo user is for development only

## Testing in Preview

```bash
1. Visit: /despega/a3
   → See 100 XP already awarded (10% progress)

2. Go to: /test-progress
   → See simulation buttons for testing XP accumulation

3. Click: "Simular Completación (+120 XP)"
   → Watch progress bar animate to 22%

4. Repeat: Click button multiple times
   → Progress accumulates: 340 XP (34%), 460 XP (46%), etc.

5. Click: "Reiniciar"
   → Demo user progress resets to 0 XP
```

## Transitioning to Real Users

When a real user logs in:
1. Auth token is extracted
2. Real user UUID is used instead of demo user ID
3. Their existing progress loads (if any)
4. New trainings are credited to their account
5. Demo user data is not transferred or deleted
