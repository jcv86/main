# Points and XP System Documentation

## Overview

The Despega platform features a dual-currency gamification system designed to motivate users through Pillar 3 (Entrenamiento/Training). This document explains how XP and Points work.

## System Definitions

### Experience Points (XP)
- **Purpose**: Measures progression through Pillar 3
- **Scope**: Represents completion of the 7 training parts
- **Distribution**: Each of the 7 parts = 1/7 (≈14.3%) of Pillar 3 progression
- **Display**: Shows as a percentage bar in the general progress dashboard
- **Calculation**: 
  - Base: 100 XP points for score
  - Time Bonus: +25 XP if completed in under 10 minutes
  - Completion Bonus: +50 XP if all questions completed
  - Max per session: ~175 XP

### Points (Spendable Currency)
- **Purpose**: Spendable in-game currency for various portal features
- **Earning**: Fixed amount per training completion (currently 100 points)
- **Accumulation**: 
  - Accumulates in user's general progress profile
  - Accumulates in user's main profile ("Mi Perfil")
  - Tracked across all Pillar 3 activities
- **Usage**: Can be spent in different parts of the portal (to be defined)
- **Persistence**: Stored in `user_dtc_balance` table

## Database Schema

### Key Tables

#### `a3_training_sessions`
Stores individual training session data:
- `user_id`: User identifier
- `training_type`: Type of training (entrenamiento-guiado, etc.)
- `score`: Performance score (0-100)
- `xp_earned`: XP gained from this session
- `points_earned`: Points gained from this session
- `completed_at`: Completion timestamp

#### `user_gamification_profile`
Stores aggregated XP and level data:
- `user_id`: User identifier
- `total_xp`: Total XP accumulated
- `current_xp`: Current XP in current level (0-999)
- `current_level`: User's level (1+)
- `best_interview_streak`: Best consecutive training days
- `total_interviews_completed`: Cumulative session count

#### `user_dtc_balance`
Stores points balance (separate from XP):
- `user_id`: User identifier
- `balance`: Current available points
- `lifetime_earned`: Total points earned all-time
- `lifetime_spent`: Total points spent all-time (if applicable)

## Implementation Details

### Training Session Flow

1. User completes a training session (e.g., `/despega/a3/entrenamiento-guiado`)
2. Training results are calculated
3. `saveTrainingSession()` is called with session data
4. Function calculates:
   - **XP**: Score-based with bonuses
   - **Points**: Fixed 100 per completion
5. Data is stored in `a3_training_sessions`
6. `user_gamification_profile` is updated (XP + Level)
7. `user_dtc_balance` is updated (Points)
8. User sees results in training results card

### Display Locations

#### 1. Training Results Card
**File**: `components/training-results-card.tsx`

Shows immediately after training completion:
- ✅ XP Earned: e.g., "+150"
- ✅ Points Earned: e.g., "+100"
- ✅ Rewards Unlocked: Number of badges

#### 2. Pillar 3 Progress Dashboard
**File**: `app/despega/a3/progress/page.tsx`

Shows overall Pillar 3 statistics:
- Sesiones Completadas (total sessions)
- **NEW** Puntos Acumulados (total points earned)
- Score de Empleabilidad
- Horas Entrenadas

#### 3. User Profile ("Mi Perfil")
**File**: `app/despega/profile/page.tsx`

Shows global user progress across all pillars:
- Nivel Actual (Level)
- XP Total (with progress bar to next level)
- **NEW** Puntos Disponibles (total points balance)
- Readiness Score

## Integration Points

### API Endpoints

#### `/api/a3/training-progress` (POST)
- **Action**: `save-session`
- **Input**: Training session data
- **Output**: 
  ```json
  {
    "success": true,
    "xpEarned": 150,
    "pointsEarned": 100,
    "rewards": ["excellent_performance"]
  }
  ```

### Functions

#### `saveTrainingSession(session: TrainingSession)`
Located in: `lib/training-progress-tracker.ts`

Saves a training session and updates user progress:
```typescript
interface TrainingSession {
  user_id: string
  training_type: string
  level: 'basico' | 'intermedio' | 'avanzado'
  score: number
  time_spent_seconds: number
  questions_completed: number
  total_questions: number
  started_at: string
  completed_at: string
  metadata?: Record<string, any>
}
```

Returns: `{ success, xpEarned, pointsEarned, rewards }`

#### `getUserTrainingProgress(): Promise<TrainingProgress>`
Located in: `lib/training-progress-tracker.ts`

Gets aggregated progress data for Pillar 3:
```typescript
interface TrainingProgress {
  total_trainings: number
  total_time_spent: number
  average_score: number
  total_xp_earned: number
  total_points_earned: number  // NEW
  total_rewards_earned: number
  consecutive_days: number
  best_score: number
  training_streak: number
  unlocked_badges: string[]
}
```

## Future Enhancements

### Points Usage System
Currently points are earned but not spent. Future implementation should include:
- Points shop/marketplace
- Redeeming points for premium features
- Points transfer/gifting
- Points expiration rules (if applicable)

### Points History Tracking
Consider adding `points_history` table for audit trail:
- Transaction ID
- User ID
- Amount (positive/negative)
- Reason (earned_training, spent_shop, etc.)
- Timestamp

### Dynamic Point Values
Currently fixed at 100 per completion. Consider:
- Bonus multipliers (x1.5 on weekends, etc.)
- Difficulty-based rewards (avanzado = more points)
- Achievement bonuses (consecutive completions, etc.)

## Testing Checklist

- [ ] Completing training awards XP
- [ ] Completing training awards 100 Points
- [ ] XP displays in training results card
- [ ] Points display in training results card
- [ ] Points counter appears in Pillar 3 progress dashboard
- [ ] Points balance appears in user profile
- [ ] Points accumulate across multiple training sessions
- [ ] Bonus XP is awarded correctly (time, completion)
- [ ] Level advances correctly when XP threshold is reached
- [ ] User can see lifetime points earned in profile

## Notes

- XP is primarily for progression tracking and gamification
- Points are the spendable currency for future marketplace/features
- Both systems update simultaneously when training completes
- No XP decay or expiration currently implemented
- Points never decrease unless explicitly spent (future feature)
