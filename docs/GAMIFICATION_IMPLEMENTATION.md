# Despega Gamification System - Implementation Guide

## Overview

The Despega gamification system creates engagement and motivation through:
- **XP (Experience Points)**: Earned through completion of activities
- **Levels**: Progression system from Level 1 (Beginner) to Level 7+ (Mythic)
- **DTC (Digital Training Coins)**: Currency earned and spent on platform
- **Rankings**: Global leaderboard with tier badges
- **Daily Streaks**: Consistency rewards
- **Achievements**: Badge system for milestones

## Quick Start

### 1. Database Setup

Execute the migration script to create tables:

```bash
# Via Supabase CLI
supabase db push scripts/003-gamification-schema.sql

# Or via SQL query directly in Supabase dashboard
```

### 2. Initialize User Data

When a user signs up, initialize their gamification profile:

```typescript
// app/api/auth/signup
const { error: gamError } = await supabase
  .from('user_gamification_profile')
  .insert({
    user_id: newUser.id,
    total_xp: 0,
    current_level: 1,
    daily_streak: 0,
    last_activity_date: new Date().toISOString(),
  })

// And DTC balance
const { error: dtcError } = await supabase
  .from('user_dtc_balance')
  .insert({
    user_id: newUser.id,
    balance: 0,
    lifetime_earned: 0,
    lifetime_spent: 0,
  })
```

### 3. Integrate Components

Add gamification components to pages:

```typescript
import { GamificationProfileEnhanced } from '@/components/gamification-profile-enhanced'
import { Leaderboard } from '@/components/leaderboard'
import { ActivityTimeline } from '@/components/activity-timeline'
import { StreakTracker } from '@/components/streak-tracker'
import { DTCWallet } from '@/components/dtc-wallet'

// In your page:
<GamificationProfileEnhanced />
<Leaderboard />
<StreakTracker />
<DTCWallet />
```

## XP System

### XP Awards

| Activity | XP | Condition |
|----------|----|----|
| Complete A3 Session | 150 | Normal completion |
| Perfect A3 Session | 200 | All answers correct |
| Complete A2 Route | 500 | Full route completion |
| Complete Interview | 500 | Interview passed |
| Daily Streak Day | 50 | Per day maintained |
| Perfect Interview Score | 200 | 90%+ score |
| First Interview | 250 | First completion bonus |

### Level Thresholds

```
Level 1: 0 XP (Beginner)
Level 2: 1,000 XP (Novice)
Level 3: 2,500 XP (Practitioner)
Level 4: 5,000 XP (Expert)
Level 5: 10,000 XP (Master)
Level 6: 20,000 XP (Legend)
Level 7: 50,000 XP (Mythic)
```

### Awarding XP

When activity completes, award XP:

```typescript
// app/api/a3/session/complete
const xpAmount = isPerf perfect ? 200 : 150

// Update profile
const { error } = await supabase
  .from('user_gamification_profile')
  .update({
    total_xp: totalXp + xpAmount,
    xp_a3_total: a3Xp + xpAmount,
  })
  .eq('user_id', userId)

// Log activity
await supabase
  .from('gamification_activity_log')
  .insert({
    user_id: userId,
    activity_type: 'a3_session',
    section: 'A3',
    xp_earned: xpAmount,
  })
```

## DTC System

### DTC Awards

| Action | DTC | Notes |
|--------|-----|-------|
| First Interview | 250 | One-time bonus |
| Each Interview | 100 | Per completion |
| Perfect Score | 50 | Interview bonus |
| Daily Streak | 25 | Per day |
| Route Completion | 100-500 | Varies by route |

### Using DTC

Users spend DTC on premium features. When spending:

```typescript
// app/api/premium/purchase
const { error } = await supabase
  .from('user_dtc_balance')
  .update({
    balance: currentBalance - cost,
    lifetime_spent: spent + cost,
  })
  .eq('user_id', userId)

// Record transaction
await supabase
  .from('dtc_transactions')
  .insert({
    user_id: userId,
    amount: cost,
    transaction_type: 'spend',
    description: 'Premium tip access',
  })
```

## Ranking System

### Automatic Recalculation

Rankings should recalculate:
- Daily (scheduled job)
- After major XP changes (immediate)
- When user levels up (immediate)

```typescript
// Trigger recalculation
const res = await fetch('/api/gamification/recalculate-rankings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
})
```

### Tier Assignments

```typescript
if (rank <= 10) tier = 'Diamond'
else if (rank <= 50) tier = 'Platinum'
else if (rank <= 100) tier = 'Gold'
else if (rank <= 500) tier = 'Silver'
else if (rank <= 1000) tier = 'Bronze'
else tier = 'Rising'
```

## Daily Streaks

### Tracking Logic

```typescript
const today = new Date().toISOString().split('T')[0]
const lastActivityDay = new Date(profile.last_activity_date)
  .toISOString()
  .split('T')[0]

if (lastActivityDay === today) {
  // Already active today, don't increment
} else if (yesterday === lastActivityDay) {
  // Streak continues
  newStreak = profile.daily_streak + 1
} else {
  // Streak breaks, reset
  newStreak = 1
}

// Update with activity
await supabase
  .from('user_gamification_profile')
  .update({
    daily_streak: newStreak,
    last_activity_date: today,
  })
  .eq('user_id', userId)
```

### Streak Milestones

Reward at: 3, 7, 14, 30, 60, 100 days

```typescript
const milestones = [3, 7, 14, 30, 60, 100]
if (milestones.includes(newStreak)) {
  await awardStreakMilestone(userId, newStreak)
}
```

## Achievement System

### Achievement Types

- **Milestone**: Reaching certain XP/level
- **Activity**: Completing specific actions
- **Streak**: Maintaining streaks
- **Badge**: Special accomplishments

### Creating Achievements

```typescript
await supabase
  .from('achievements')
  .insert({
    user_id: userId,
    title: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    category: 'streak',
    xp_reward: 50,
    dtc_reward: 50,
  })
```

## Leaderboard API

### Fetch Rankings

```typescript
const res = await fetch('/api/gamification/rankings?limit=50')
const data = await res.json()

// Returns:
// {
//   rankings: Array<LeaderboardEntry>,
//   current_user_rank: number,
//   total_users: number
// }
```

### Leaderboard Entry Structure

```typescript
{
  rank: 1,
  user: {
    id: string,
    full_name: string,
    avatar_url?: string
  },
  scores: {
    general: number,
    a1_cerebral: number,
    a2_rutas: number
  },
  stats: {
    active_days: number,
    current_streak: number,
    missions_completed: number
  }
}
```

## A2 Route Integration

### Progress Gamification

```typescript
const progressPercentage = mission.completion_percentage

// Calculate XP based on progress
const xpEarned = (progressPercentage / 100) * 5000
const dtcEarned = (progressPercentage / 100) * 500

// Store in A2 gamification table
await supabase
  .from('a2_route_gamification')
  .upsert({
    user_id: userId,
    route_id: routeId,
    xp_earned: xpEarned,
    dtc_earned: dtcEarned,
    progress_percentage: progressPercentage,
  })
```

## Monitoring

### Key Metrics

```typescript
// XP Distribution
SELECT current_level, COUNT(*) FROM user_gamification_profile
GROUP BY current_level

// DTC Flow
SELECT transaction_type, SUM(amount) FROM dtc_transactions
GROUP BY transaction_type

// Engagement
SELECT COUNT(DISTINCT user_id), DATE(created_at)
FROM gamification_activity_log
GROUP BY DATE(created_at)

// Leaderboard Activity
SELECT tier, COUNT(*) FROM user_rankings
GROUP BY tier
```

### Alerts

Configure alerts for:
- XP anomalies (sudden spikes)
- DTC balance issues
- Ranking calculation failures
- API latency increases

## Performance Optimization

### Indexing

All frequently queried columns should be indexed:
- `user_gamification_profile.total_xp`
- `user_rankings.rank`
- `dtc_transactions.created_at`
- `achievements.user_id`

### Caching

Cache these endpoints (5-minute TTL):
- Global rankings
- User profile gamification data
- Level configuration

```typescript
const CACHE_KEY = `gamif:rankings:${limit}`
const cached = await redis.get(CACHE_KEY)
if (cached) return JSON.parse(cached)

// Fetch and cache
const data = await fetchRankings()
await redis.setex(CACHE_KEY, 300, JSON.stringify(data))
```

## Troubleshooting

### Issue: XP Not Updating

```typescript
// Check activity log
SELECT * FROM gamification_activity_log
WHERE user_id = 'user-id'
ORDER BY created_at DESC

// Check profile update
SELECT total_xp, xp_a3_total FROM user_gamification_profile
WHERE user_id = 'user-id'
```

### Issue: Ranking Incorrect

```typescript
// Verify calculation
SELECT rank, tier, general_score FROM user_rankings
WHERE user_id = 'user-id'

// Recalculate
POST /api/gamification/recalculate-rankings
```

### Issue: DTC Balance Wrong

```typescript
// Check balance
SELECT * FROM user_dtc_balance WHERE user_id = 'user-id'

// Check transactions
SELECT SUM(CASE WHEN transaction_type = 'earn' THEN amount ELSE -amount END)
FROM dtc_transactions
WHERE user_id = 'user-id'
```

## Deployment

1. Execute migration script
2. Seed level configuration
3. Initialize existing users
4. Deploy components
5. Set up monitoring
6. Recalculate rankings
7. Send announcement to users

## Support

For issues or questions about the gamification system, check:
- `/docs/GAMIFICATION_TESTING.md` - Testing guide
- `components/` - Component implementation
- `app/api/gamification/` - API endpoints
- `lib/gamification/` - Utility functions
