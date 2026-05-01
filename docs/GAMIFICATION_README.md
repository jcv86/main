# Despega Gamification System - README

## 🎮 Overview

The Despega gamification system creates a comprehensive engagement and motivation framework through Experience Points (XP), Digital Training Coins (DTC), global rankings, daily streaks, and achievements. This system spans across all learning sections (A1, A2, A3) and encourages consistent user engagement.

## 🎯 Core Features

### 1. Experience Points (XP) & Leveling
- Users earn XP by completing activities
- Levels progress from 1 (Beginner) to 7+ (Mythic)
- Each level requires more XP than the last
- Visual level progression with badges

**XP Sources**:
- A3 sessions: 150-200 XP
- Interviews: 500 XP
- A2 routes: Scaled to completion %
- Daily streak bonuses: 50 XP per day

### 2. DTC Coins (Digital Training Coins)
- Secondary currency earned through achievements
- Spendable on premium features and tips
- Transaction history tracking
- Lifetime earned/spent metrics

**DTC Earning**:
- First interview: 250 DTC (bonus)
- Each interview: 100 DTC
- Perfect scores: +50 DTC
- Daily streaks: +25 DTC
- Route completion: 100-500 DTC

### 3. Global Rankings & Tiers
- Real-time leaderboard with user rankings
- Tier system based on rank:
  - 🥇 **Diamond**: Top 10
  - ⭐ **Platinum**: Top 50
  - 🏆 **Gold**: Top 100
  - 🥈 **Silver**: Top 500
  - 🥉 **Bronze**: Top 1000
  - 📈 **Rising**: Growing members

### 4. Daily Streaks
- Tracks consecutive days of activity
- Resets after 1 day missed
- Milestone rewards at 3, 7, 14, 30, 60, 100 days
- Bonus XP for maintaining streaks

### 5. Achievements & Badges
- Unlock badges for milestones
- Automatic achievement creation
- Category-based organization
- Displayed on user profiles

## 📁 Project Structure

```
/app
  /api/gamification/
    - global.ts              # Global stats
    - rankings.ts            # Leaderboard
    - a2-progress.ts         # A2 route gamification
    - claim-reward.ts        # Reward claiming
    - activity-timeline.ts   # Activity history
    - streak.ts              # Streak tracking
    - recalculate-rankings.ts # Ranking calculation
  /api/user/
    - profile-enhancement.ts  # Enhanced profile data
  /api/dtc/
    - wallet.ts              # DTC wallet info
  /gamification/
    - page.tsx               # Gamification hub
    - gamification-client.tsx # Client component

/components/
  - gamification-profile-enhanced.tsx  # Main profile component
  - leaderboard.tsx                    # Leaderboard display
  - activity-timeline.tsx              # Activity history
  - a2-gamification.tsx                # A2 route gamification
  - profile-enhancement.tsx            # Profile stats
  - dtc-wallet.tsx                     # DTC wallet
  - streak-tracker.tsx                 # Streak tracker

/lib/gamification/
  - calculations.ts   # XP, level, and tier calculations

/scripts/
  - 003-gamification-schema.sql    # Database schema
  - verify-gamification.ts         # System verification

/docs/
  - GAMIFICATION_TESTING.md        # Testing guide
  - GAMIFICATION_IMPLEMENTATION.md # Implementation details
  - GAMIFICATION_DEPLOYMENT.md     # Deployment guide
```

## 🚀 Quick Start

### 1. Database Setup
```bash
# Execute schema migration
supabase db push scripts/003-gamification-schema.sql
```

### 2. Add Components to Pages
```typescript
import { GamificationProfileEnhanced } from '@/components/gamification-profile-enhanced'
import { Leaderboard } from '@/components/leaderboard'
import { StreakTracker } from '@/components/streak-tracker'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <GamificationProfileEnhanced />
      <Leaderboard />
      <StreakTracker />
    </div>
  )
}
```

### 3. Award XP on Actions
```typescript
// When activity completes
const xpAmount = 150 // Base XP

await supabase
  .from('user_gamification_profile')
  .update({
    total_xp: currentXP + xpAmount,
    xp_a3_total: currentA3XP + xpAmount,
  })
  .eq('user_id', userId)

// Log activity
await supabase
  .from('gamification_activity_log')
  .insert({
    user_id: userId,
    activity_type: 'session_complete',
    xp_earned: xpAmount,
  })
```

## 📊 API Endpoints

### Global Stats
```
GET /api/gamification/global
Returns: User's total XP, level, daily streak, and breakdowns
```

### Leaderboard
```
GET /api/gamification/rankings?limit=50
Returns: Top users with ranks and tier badges
```

### A2 Progress
```
GET /api/gamification/a2-progress?routeId=<id>
Returns: Route-specific XP and DTC progress
```

### Profile Enhancement
```
GET /api/user/profile-enhancement
Returns: Complete gamification profile with all stats
```

### DTC Wallet
```
GET /api/dtc/wallet
Returns: DTC balance and transaction history
```

### Streak Data
```
GET /api/gamification/streak
Returns: Current streak and milestone progress
```

### Activity Timeline
```
GET /api/gamification/activity-timeline?limit=20
Returns: Recent gamification events
```

## 🎨 Components

### GamificationProfileEnhanced
Main profile component showing XP, level, DTC balance, and achievements.

```typescript
<GamificationProfileEnhanced />
```

### Leaderboard
Global leaderboard with filtering and pagination.

```typescript
<Leaderboard limit={50} />
```

### StreakTracker
Daily streak visualization with milestone rewards.

```typescript
<StreakTracker userId={userId} />
```

### DTCWallet
DTC balance and transaction history.

```typescript
<DTCWallet userId={userId} />
```

### ActivityTimeline
User's recent gamification activities.

```typescript
<ActivityTimeline limit={20} />
```

## 🔐 Security

- All endpoints require authentication
- Row-Level Security (RLS) prevents unauthorized data access
- Users can only see their own private data
- Public leaderboard data accessible to all
- Admin operations protected

## 📈 Performance

- Optimized database queries with proper indexing
- Caching strategy for leaderboard (5-min TTL)
- Efficient component rendering
- Lazy loading of large lists
- Response times < 300ms target

## 🧪 Testing

See `/docs/GAMIFICATION_TESTING.md` for comprehensive testing guide including:
- Unit test cases
- Integration test scenarios
- Performance testing
- Security testing
- Load testing

## 📋 Deployment

See `/docs/GAMIFICATION_DEPLOYMENT.md` for deployment checklist and procedures including:
- Pre-deployment verification
- Step-by-step deployment
- Post-deployment monitoring
- Rollback procedures
- Troubleshooting

## 📖 Implementation

See `/docs/GAMIFICATION_IMPLEMENTATION.md` for detailed implementation including:
- XP system details
- DTC system details
- Ranking calculations
- Streak logic
- Achievement system
- Integration points

## 🐛 Troubleshooting

### XP Not Updating
- Check activity logging
- Verify user profile exists
- Check RLS policies

### Rankings Incorrect
- Manually recalculate: `POST /api/gamification/recalculate-rankings`
- Verify XP values are correct
- Check tier assignment logic

### DTC Balance Wrong
- Audit transactions
- Verify balance calculation
- Check for double charges

See full troubleshooting in `/docs/GAMIFICATION_DEPLOYMENT.md`

## 📊 Monitoring

Key metrics to track:
- API response times per endpoint
- Error rates
- User engagement metrics
- XP distribution
- DTC flow (earned vs spent)
- Ranking stability

## 🤝 Contributing

When adding new gamification features:
1. Update database schema if needed
2. Create API endpoint
3. Create component
4. Add tests
5. Update documentation
6. Update this README

## 📞 Support

For questions about the gamification system:
- Check `/docs/GAMIFICATION_IMPLEMENTATION.md` for technical details
- Check `/docs/GAMIFICATION_TESTING.md` for testing procedures
- Review component JSDoc comments
- Check `/app/api/gamification/` for endpoint examples

## 🎉 Success Criteria

System is working well when:
- ✅ APIs respond in < 300ms
- ✅ Error rate < 0.1%
- ✅ User engagement increases
- ✅ Rankings accurate
- ✅ DTC balances correct
- ✅ No data inconsistencies
- ✅ All tests passing

## 📝 Changelog

### v1.0.0 (Current)
- Initial gamification system
- XP and leveling system
- DTC coins system
- Global rankings
- Daily streaks
- Achievements
- Activity logging
- All components and APIs

## 📄 License

Internal Despega project. All rights reserved.

---

**Last Updated**: 2026-05-01  
**Version**: 1.0.0  
**Status**: Production Ready
