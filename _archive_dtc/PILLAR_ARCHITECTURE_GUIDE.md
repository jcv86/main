# Pillar-Based Learning Architecture Guide

## Overview

The new system replaces the linear module sequence (C1→A1→A2→C2→A3→A4...) with a **pillar-based hub model** that naturally stops at checkpoints and shows all 4 pillars.

## Architecture

### Core Concepts

```
┌─────────────────────────────────────────────────┐
│         4 PILLARS (C1, C2, C3, C4)              │
├─────────────────────────────────────────────────┤
│ Pillar 1: Autoconocimiento                      │
│  ├── Conozcámonos 1 (Diagnostic) - 50 XP       │
│  ├── Actividad 1 - 50 XP                       │
│  └── Actividad 2 - 50 XP                       │
│  └─> CHECKPOINT: Award 150 XP → Show Hub       │
│                                                 │
│ Pillar 2: Método STAR (Unlock after C1)        │
│  ├── Conozcámonos 2 - 50 XP                    │
│  ├── Actividad 3 - 50 XP                       │
│  └── Actividad 4 - 50 XP                       │
│  └─> CHECKPOINT: Award 150 XP → Show Hub       │
│                                                 │
│ Pillar 3: Posicionamiento (Unlock after C2)    │
│ Pillar 4: Simulación Real (Unlock after C3)    │
└─────────────────────────────────────────────────┘
```

### Key Difference from Old System

**OLD (Linear):**
```
C1 → A1 → A2 → C2 → A3 → A4 → (continue to C3 without stopping)
```

**NEW (Pillar-based):**
```
C1 → A1 → A2 → [CHECKPOINT - Award XP] → Hub Dashboard
                                           ↓ (User chooses)
                                        C2 → A3 → A4 → [CHECKPOINT - Award XP] → Hub
```

## Flow Diagram

```
Start Learning
     ↓
[Pillar 1: Autoconocimiento]
  - Conozcámonos 1
  - Actividad 1
  - Actividad 2
     ↓
[CHECKPOINT SCREEN]
  Shows: "Pilar 1 Completado - 150 XP Ganados"
  Awards XP + Marks Pillar Complete
     ↓
[HUB DASHBOARD] ← USER SEES ALL 4 PILLARS HERE
  C1: ✓ Completado (150 XP)
  C2: DISPONIBLE (locked)
  C3: BLOQUEADO
  C4: BLOQUEADO
     ↓ (User clicks "Comenzar Pillar 2")
[Pillar 2: Método STAR]
  - Conozcámonos 2
  - Actividad 3
  - Actividad 4
     ↓
[CHECKPOINT SCREEN]
  Shows: "Pilar 2 Completado - 150 XP Ganados"
     ↓
[HUB DASHBOARD]
  C1: ✓ Completado (150 XP)
  C2: ✓ Completado (150 XP)
  C3: DISPONIBLE
  C4: BLOQUEADO
```

## Implementation Files

### Core Types & Utilities
**`lib/pillar-structure.ts`**
- Defines `PILLAR_SEQUENCE` with all 4 pillars
- Provides helper functions:
  - `getPillarById()` - Get pillar details
  - `getNextPillar()` - Get next pillar in sequence
  - `isPillarUnlocked()` - Check if pillar is available
  - `getPillarProgress()` - Calculate pillar completion %

### User Interface

**`app/despega/pillars/hub/page.tsx`**
- Main hub dashboard showing all 4 pillars
- Displays:
  - Pillar status (Completed ✓ / Available / Locked)
  - Progress bar per pillar
  - XP earned per pillar
  - "Comenzar Pilar" button for available pillars
  - Unlock requirements for locked pillars

**`components/pillar-completion-checkpoint.tsx`**
- Modal screen shown after pillar completion
- Displays XP earned
- Shows next pillar info
- Buttons to return to hub or proceed

### APIs

**`/api/user/pillar-progress/[userId]`** (GET)
- Fetches user's completed activities and pillars
- Returns:
  ```json
  {
    "completedActivities": ["a1", "a2", "a3"],
    "completedPillars": ["c1", "c2"],
    "totalXP": 300
  }
  ```

**`/api/user/award-xp`** (POST)
- Awards XP for pillar completion
- Input: `{ pillarId: "c1", xpAmount: 150 }`
- Updates `user_dtc_balance` and records in `dtc_transactions`

**`/api/user/complete-pillar`** (POST)
- Marks pillar as complete
- Input: `{ pillarId: "c1" }`
- Inserts into `despega_pillar_completion` table

## Database Schema Requirements

### New Table: `despega_pillar_completion`
```sql
CREATE TABLE despega_pillar_completion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  pillar_id TEXT NOT NULL, -- 'c1', 'c2', 'c3', 'c4'
  completed_at TIMESTAMP DEFAULT NOW(),
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, pillar_id)
);
```

### Modified Table: `a3_completed_modules`
- Already tracks individual activity completion
- Pillar system queries this to calculate progress

## How to Integrate with Existing Code

### 1. Conozcámonos Module (e.g., `/despega/conozcamonos/1/page.tsx`)
After activities complete, show checkpoint:

```typescript
import { PillarCompletionCheckpoint } from '@/components/pillar-completion-checkpoint'

export default function ConozcamosPage() {
  const [isCompleted, setIsCompleted] = useState(false)
  const pillarId = 'c1' // or 'c2', etc.
  const xpEarned = 150

  if (isCompleted) {
    return (
      <PillarCompletionCheckpoint
        pillarId={pillarId}
        xpEarned={xpEarned}
      />
    )
  }

  return (
    // ... conozcámonos content
    <button onClick={() => setIsCompleted(true)}>
      Completar Pilar
    </button>
  )
}
```

### 2. Navigation to Hub
After any pillar completion, route users to:
```
/despega/pillars/hub
```

### 3. Update Module Navigation
Instead of continuing to next module, trigger checkpoint:

```typescript
// OLD:
router.push('/despega/a3/next-module')

// NEW:
// Show checkpoint screen which will route to hub
setShowCheckpoint(true)
```

## XP Distribution Strategy

- **Per Pillar Completion**: 150 XP
  - 50 XP: Conozcámonos diagnostic
  - 50 XP: Activity 1
  - 50 XP: Activity 2

- **For C4 (Capstone)**: 200 XP
  - Higher value for final assessment

**Total Available**: 650 XP (150 + 150 + 150 + 200)

## User Journey

1. **User starts** → Sees hub with all pillars
2. **Only C1 available** → User clicks "Comenzar"
3. **Completes Conozcámonos 1 + Activities** → Checkpoint screen
4. **Sees 150 XP awarded** → Returns to hub
5. **Hub now shows**:
   - C1: ✓ Complete (150 XP)
   - C2: Available (💜 Disponible badge)
   - C3, C4: Locked
6. **Repeats for C2, C3, C4**
7. **After C4** → Completion screen, full path shown

## Benefits of This Architecture

✅ **Natural stopping points** - No fatigue from endless modules
✅ **Clear progress visualization** - See all 4 pillars at once
✅ **Motivating checkpoints** - XP awarded at natural breaks
✅ **Sequential unlocking** - Prevents skipping prerequisites
✅ **Easy to extend** - Add more pillars by extending config
✅ **User control** - Users choose when to proceed to next pillar
✅ **Better tracking** - Pillar-level and activity-level progress

## Future Enhancements

- [ ] Certificates for each pillar completion
- [ ] Leaderboards per pillar
- [ ] Recommended review content before unlocking next pillar
- [ ] Peer comparison within same pillar
- [ ] Time tracking per pillar
- [ ] Mobile app navigation optimized for this structure
