# CORRECT Learning Sequence Architecture

## Overview

The platform has **4 MAIN PILLARS** (shown in navbar: El Ritual, Exploración, Entrenamiento, La Realidad) with **diagnostic gatekeepers** before each one.

```
┌─────────────────────────────────────────────────────────────────┐
│                    4 MAIN PILLARS (A1-A4)                       │
│  Displayed in navbar: El Ritual | Exploración | Entrenamiento │ La Realidad
└─────────────────────────────────────────────────────────────────┘

A1: El Ritual (150 XP) - STAR Method & Interview Structure
A2: Exploración (150 XP) - Market Exploration & Positioning  
A3: Entrenamiento (150 XP) - Continuous Training & Practice
A4: La Realidad (200 XP) - Real Interviews & Application
```

## Complete Flow

```
User Starts
    ↓
[C1: Conozcámonos 1] ← Diagnostic, no XP
    ↓
[A1: El Ritual] ← Main pillar (150 XP)
    ↓
[CHECKPOINT] → Award 150 XP → Show celebration
    ↓
[PILLARS HUB] ← User sees all 4 pillars
  • A1: ✓ Completado (150 XP)
  • A2: 💜 Disponible
  • A3: 🔒 Bloqueado
  • A4: 🔒 Bloqueado
    ↓ (User chooses to continue)
[C2: Conozcámonos 2] ← Diagnostic
    ↓
[A2: Exploración] ← Main pillar (150 XP)
    ↓
[CHECKPOINT] → Award 150 XP
    ↓
[PILLARS HUB] ← Updated progress
  • A1: ✓ Completado (150 XP)
  • A2: ✓ Completado (150 XP)
  • A3: 💜 Disponible
  • A4: 🔒 Bloqueado
    ↓
[C3: Conozcámonos 3]
    ↓
[A3: Entrenamiento] (150 XP)
    ↓
[CHECKPOINT]
    ↓
[PILLARS HUB]
    ↓
[C4: Conozcámonos 4]
    ↓
[A4: La Realidad] (200 XP)
    ↓
[FINAL CHECKPOINT] → Award 200 XP + Completion Certificate
    ↓
[CELEBRATION SCREEN]
  "¡Completaste todos los pilares! Total: 650 XP"
```

## Data Structure

### Main Pillars (A1-A4)
```typescript
interface MainPillar {
  id: 'a1' | 'a2' | 'a3' | 'a4'
  name: string
  description: string
  xp: number
  diagnosticId: DiagnosticId // c1, c2, c3, c4
  icon: string
  color: string
}
```

### Learning Sequence
```typescript
const LEARNING_SEQUENCE = [
  { id: 'c1', type: 'diagnostic', order: 1, xp: 0 },
  { id: 'a1', type: 'main_pillar', order: 2, xp: 150, requiresCompletion: 'c1' },
  { id: 'c2', type: 'diagnostic', order: 3, xp: 0, requiresCompletion: 'a1' },
  { id: 'a2', type: 'main_pillar', order: 4, xp: 150, requiresCompletion: 'c2' },
  { id: 'c3', type: 'diagnostic', order: 5, xp: 0, requiresCompletion: 'a2' },
  { id: 'a3', type: 'main_pillar', order: 6, xp: 150, requiresCompletion: 'c3' },
  { id: 'c4', type: 'diagnostic', order: 7, xp: 0, requiresCompletion: 'a3' },
  { id: 'a4', type: 'main_pillar', order: 8, xp: 200, requiresCompletion: 'c4' },
]
```

## Implementation Files

### Core Library
**`lib/learning-sequence.ts`**
- Defines all 4 main pillars (A1-A4) with navbar display
- Defines learning sequence with diagnostics (C1-C4) as prerequisites
- Helper functions:
  - `getMainPillar()` - Get pillar details
  - `getSequenceStep()` - Get step (diagnostic or main pillar)
  - `getNextSequenceStep()` - Get next step
  - `isStepUnlocked()` - Check if step is available
  - `getMainPillarProgress()` - Calculate overall progress

### UI Components

**`app/despega/pillars-hub/page.tsx`**
- Hub dashboard showing all 4 main pillars
- Displays:
  - Current progress on each pillar
  - XP earned per pillar
  - Status (Completed ✓ / Available / Locked)
  - Buttons to start/continue/view each pillar

**`components/checkpoint-screen.tsx`**
- Modal shown after pillar completion
- Displays:
  - Pillar name
  - XP earned (+150 or +200)
  - Celebration message
  - Button to go to hub or next pillar

## User Journey

### Step 1: User Enters
- Sees `/despega/pillars-hub`
- Only A1 available (showing C1 needs to be done first)
- Clicks "Comenzar" → Navigates to C1

### Step 2: Diagnostic (C1)
- User completes Conozcámonos 1 diagnostic
- No XP awarded yet
- Marked as complete

### Step 3: Main Pillar (A1)
- User completes A1: El Ritual
- Interactive content, exercises, training

### Step 4: Checkpoint
- Checkpoint screen appears
- Shows: "¡Pilar Completado! +150 XP"
- User clicks "Ir al Siguiente Pilar" or "Ver Progreso"

### Step 5: Back to Hub
- Hub updated showing:
  - A1: ✓ Complete (150 XP)
  - A2: Now Available
  - A3: Still Locked
  - A4: Still Locked
- User can choose A2 or review A1

### Repeat for A2, A3, A4
- Each follows same pattern: C → A → Checkpoint → Hub

## XP Distribution

```
A1: El Ritual         = 150 XP
A2: Exploración       = 150 XP
A3: Entrenamiento     = 150 XP
A4: La Realidad       = 200 XP (Higher value for capstone)
───────────────────────────────
TOTAL AVAILABLE       = 650 XP
```

## Database Requirements

### Table: `despega_sequence_completion`
```sql
CREATE TABLE despega_sequence_completion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  step_id TEXT NOT NULL, -- 'c1', 'a1', 'c2', 'a2', etc.
  completed_at TIMESTAMP DEFAULT NOW(),
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, step_id)
);
```

### Track in `user_dtc_balance`
- `balance` - Current XP
- `lifetime_earned` - Total XP earned from all steps

## Key Differences from Previous Version

### OLD (Incorrect)
- Treated C1-C4 as "4 pillars"
- Mixed diagnostic with main content
- No clear hub showing main pillars

### NEW (Correct)
- C1-C4 are **diagnostic gatekeepers** (prerequisites)
- A1-A4 are **4 main pillars** (the real content)
- Hub shows progress through the **4 main pillars**
- Clear sequential unlock: C1→A1→C2→A2→C3→A3→C4→A4

## Integration Guide

### 1. Make Conozcámonos (Cn) Pages Redirect
After diagnostic completion, either:
- Automatically proceed to main pillar (An)
- Or redirect to hub where user can see A1-A4

```typescript
// After C1 completes:
router.push('/despega/pillars-hub') // Or directly to A1
```

### 2. Make Main Pillar (An) Pages Show Checkpoint
After main pillar content:

```typescript
if (isCompleted) {
  return (
    <CheckpointScreen
      completedPillarId="a1"
      xpEarned={150}
      userId={user.id}
    />
  )
}
```

### 3. Update Navigation
```typescript
// OLD: Linear sequence
/despega/metodo-star → /despega/cv-inteligente

// NEW: Hub-based
/despega/pillars-hub
  ├─ Conozcámonos (Cn) → Main Pillar (An)
  ├─ Checkpoint → Back to hub
  └─ User chooses next pillar
```

## Benefits

✅ **Clear main pillars** - Users see A1-A4 as their main journey
✅ **Diagnostic flow** - C1-C4 as prerequisites, not main content
✅ **Natural checkpoints** - Stop after each An, award XP
✅ **Hub control** - Users see all 4 pillars, choose path
✅ **Sequential unlocking** - Prevents skipping
✅ **Celebration moments** - Checkpoint screens motivate
✅ **Progress transparency** - Hub shows exact status

## Next Steps

1. Update Conozcámonos pages (C1-C4) to complete properly
2. Create main pillar pages (A1-A4) with real content
3. Test flow: C1 → A1 → Checkpoint → Hub → C2 → A2 → etc.
4. Verify XP is awarded correctly at checkpoints
5. Ensure hub reflects current progress

