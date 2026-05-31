# Training Progress Tracking System - Complete Implementation Guide

## Overview

The training progress tracking system captures time spent, rewards, XP, and all necessary metrics for a world-class interview training platform. The system automatically saves training sessions, calculates achievements, and displays comprehensive statistics.

## Architecture

### Components

#### 1. **Training Results Card** (`components/training-results-card.tsx`)
- Displays immediate training results after completion
- Automatically saves session to database
- Shows XP earned and rewards unlocked
- Calculates bonus points for speed, completion, and performance
- Displays achievements with animations

**XP Calculation:**
- Base XP: (score / 100) × 100
- Time Bonus: +25 XP if completed in < 10 minutes
- Completion Bonus: +50 XP if all questions answered
- Total: baseXP + timeBonus + completionBonus

**Rewards Earned:**
- `excellent_performance`: Score ≥ 90
- `strong_performance`: Score ≥ 80
- `speed_demon`: Completed in < 5 minutes
- `completion_master`: All questions completed
- `advanced_challenger`: Level "avanzado" with score ≥ 85

#### 2. **Training Progress Dashboard** (`components/training-progress-dashboard.tsx`)
- Real-time progress visualization
- Two tabs: Overview and History
- Shows cumulative metrics and individual sessions
- Displays all unlocked badges with animations

**Displayed Metrics:**
- Total XP earned
- Current streak (consecutive training days)
- Average score across all trainings
- Total trainings completed
- Best score achieved
- Total time invested
- Unlocked badges and achievements

#### 3. **Progress Tracking Utility** (`lib/training-progress-tracker.ts`)
Core functions:

- `saveTrainingSession(session)` - Saves training to database and updates gamification profile
- `getUserTrainingProgress()` - Retrieves user's overall statistics
- `getTrainingHistory(limit, offset)` - Paginated training history
- `updateGamificationProfile()` - Updates XP, level, and badges
- `trackTrainingAnalytics()` - Logs training events for analytics
- `calculateStreak()` - Calculates consecutive days of training
- `getAchievementBadges()` - Maps reward codes to badge objects

#### 4. **API Route** (`app/api/a3/training-progress/route.ts`)
RESTful endpoint for training data operations:
- `POST` with `action: 'save-session'` - Saves completed training
- `POST` with `action: 'get-progress'` - Retrieves user statistics
- `POST` with `action: 'get-history'` - Gets paginated training history

### Database Schema

#### `a3_training_sessions` Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → auth.users)
- training_type (VARCHAR) - Type of training
- level (VARCHAR) - 'basico', 'intermedio', or 'avanzado'
- score (INTEGER 0-100) - Final score
- time_spent_seconds (INTEGER) - Duration in seconds
- questions_completed (INTEGER) - Questions answered
- total_questions (INTEGER) - Total questions available
- xp_earned (INTEGER) - XP gained
- rewards_earned (TEXT[]) - Array of achievement IDs
- started_at (TIMESTAMP) - Training start time
- completed_at (TIMESTAMP) - Training completion time
- metadata (JSONB) - Additional data
```

#### `user_gamification_profile` Table (Updated)
```sql
- user_id (UUID)
- current_xp (INTEGER) - XP towards next level
- total_xp (INTEGER) - Total XP accumulated
- current_level (INTEGER) - User level (1 = 0-999 XP, 2 = 1000-1999 XP, etc.)
- total_interviews_completed (INTEGER)
- best_interview_streak (INTEGER)
- updated_at (TIMESTAMP)
```

#### `v_user_training_stats` View
Aggregate statistics view:
- total_trainings
- average_score
- best_score
- total_xp_earned
- total_time_spent_seconds
- unique_days_trained
- training_types

## Data Flow

### Training Session Completion Flow

```
1. User completes training
   ↓
2. TrainingResultsCard component receives result
   ↓
3. Saves session via POST /api/a3/training-progress
   ↓
4. Server calculates XP and rewards
   ↓
5. Inserts into a3_training_sessions
   ↓
6. Updates user_gamification_profile
   ↓
7. Tracks analytics in v1_analytics
   ↓
8. Returns XP, rewards, and level data
   ↓
9. Display results with animations
```

### Progress Retrieval Flow

```
1. User views dashboard
   ↓
2. TrainingProgressDashboard loads
   ↓
3. Fetches progress via POST /api/a3/training-progress (action: 'get-progress')
   ↓
4. Server queries v_user_training_stats
   ↓
5. Aggregates training session data
   ↓
6. Returns comprehensive metrics
   ↓
7. Display in dashboard with stats and history
```

## Features

### 1. Real-time Progress Tracking
- Automatically saves every training session
- Captures exact time spent and performance metrics
- Updates user level and streaks immediately

### 2. Gamification System
- XP earned for each training (base + bonuses)
- Automatic level progression (1000 XP per level)
- Achievement badges for various accomplishments
- Training streaks with visual indicators

### 3. Comprehensive Statistics
- Individual session details with scores and times
- Aggregated metrics (average, best, total time)
- Performance trends over time
- Badge tracking and unlocking

### 4. Visual Feedback
- Animated score counting on results screen
- XP and reward earning animations
- Streak flame icon on consecutive days
- Badge unlock celebrations

### 5. Analytics Integration
- Tracks training events for platform analytics
- Monitors user engagement patterns
- Records achievement unlocking for insights

## Usage

### Saving a Training Session

```typescript
const result = await saveTrainingSession({
  training_type: 'Entrenamiento Estructurado',
  level: 'intermedio',
  score: 85,
  time_spent_seconds: 1200,
  questions_completed: 5,
  total_questions: 5,
  started_at: '2024-01-15T10:00:00Z',
  completed_at: '2024-01-15T10:20:00Z'
})

// Returns:
// {
//   success: true,
//   xpEarned: 175,      // 85 base + 50 completion + 40 other
//   rewards: ['strong_performance', 'completion_master']
// }
```

### Retrieving User Progress

```typescript
const progress = await getUserTrainingProgress()

// Returns:
// {
//   total_trainings: 15,
//   average_score: 82,
//   best_score: 95,
//   total_xp_earned: 2450,
//   total_time_spent: 18000,  // seconds
//   training_streak: 5,       // days
//   total_rewards_earned: 8,
//   unlocked_badges: ['excellent_performance', 'speed_demon', ...]
// }
```

### Integration Points

#### In Training Pages

```typescript
// Before training ends, call:
handleComplete = (result: any) => {
  setScore(result.score)
  setStage('farewell')
  // TrainingResultsCard automatically saves via API
}
```

#### In Dashboard

```typescript
// Display progress dashboard anywhere:
import { TrainingProgressDashboard } from '@/components/training-progress-dashboard'

export default function DashboardPage() {
  return <TrainingProgressDashboard />
}
```

## Performance Optimizations

1. **Database Indexes**
   - user_id index for fast queries
   - completed_at for time-based sorting
   - training_type for filtering

2. **Materialized Views**
   - `v_user_training_stats` aggregates data
   - Reduces real-time calculation overhead

3. **Row Level Security**
   - Users only see their own sessions
   - System role can manage data

4. **Pagination**
   - History limited to 10 items per request
   - Prevents large dataset transfers

## Monitoring & Analytics

### Key Metrics Tracked
- Training completion rates
- Average scores by level
- Time spent trends
- XP earning patterns
- Badge unlock rates
- User engagement streaks

### Analytics Events
- `training_completed` - Logged when session finishes
- Metadata includes: level, score, training_type

## Security

1. **Row Level Security (RLS)**
   - Users can only access their own data
   - System role maintains admin access

2. **Authentication**
   - All operations require valid user session
   - User ID verified on backend

3. **Data Validation**
   - Score validated (0-100)
   - Time validated (positive seconds)
   - Level validated against enum

## Future Enhancements

1. **Leaderboards**
   - Global rankings by score
   - Peer comparison features
   - Weekly/monthly challenges

2. **Advanced Analytics**
   - Performance trend analysis
   - Predictive performance modeling
   - Area-specific improvement tracking

3. **Personalized Recommendations**
   - Suggest training based on weak areas
   - Recommend difficulty level progression
   - Custom training plans

4. **Social Features**
   - Share achievements
   - Team challenges
   - Collaborative learning

## Troubleshooting

### Session Not Saving
1. Check user authentication status
2. Verify Supabase connection
3. Check API endpoint logs
4. Ensure all required fields present

### Progress Not Updating
1. Clear browser cache
2. Refresh the page
3. Check RLS policies
4. Verify user_id matches

### XP Not Calculating Correctly
1. Verify score between 0-100
2. Check time_spent > 0
3. Ensure questions_completed ≤ total_questions
4. Review bonus calculation logic

## Support

For issues or questions about the training progress system, check:
- `/lib/training-progress-tracker.ts` - Core logic
- `/components/training-results-card.tsx` - Display logic
- `/app/api/a3/training-progress/route.ts` - API implementation
- Database logs for query issues
