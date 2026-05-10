# Gamification System Deployment Guide

## Pre-Deployment Checklist

### Database & Schema
- [ ] Review migration script: `scripts/003-gamification-schema.sql`
- [ ] Backup current database
- [ ] Execute migration in Supabase
- [ ] Verify tables created:
  - `user_gamification_profile`
  - `user_rankings`
  - `user_dtc_balance`
  - `dtc_transactions`
  - `achievements`
  - `gamification_activity_log`
  - `gamification_level_config`
- [ ] Verify RLS policies enabled
- [ ] Seed level configuration

### Code Review
- [ ] Review all API endpoints in `/app/api/gamification/`
- [ ] Review components in `/components/`
- [ ] Check error handling and logging
- [ ] Verify TypeScript types are complete
- [ ] Review database queries for N+1 issues

### Testing
- [ ] Run unit tests for calculations
- [ ] Test API endpoints manually
- [ ] Test components render correctly
- [ ] Verify RLS policies work
- [ ] Test with multiple users
- [ ] Test edge cases (new users, no data, etc.)

### Performance
- [ ] Check database indexes exist
- [ ] Verify query performance
- [ ] Test API response times
- [ ] Check for memory leaks in components
- [ ] Verify caching strategy

### Security
- [ ] Verify authentication required
- [ ] Check RLS policies prevent unauthorized access
- [ ] Review sensitive data exposure
- [ ] Test injection prevention
- [ ] Verify CORS settings

## Deployment Steps

### Stage 1: Database Migration

```bash
# 1. Via Supabase Dashboard
# - Go to SQL Editor
# - Run: scripts/003-gamification-schema.sql

# OR via Supabase CLI
supabase db push

# 2. Verify tables
supabase db list

# 3. Verify RLS enabled
# In Supabase Dashboard, check each table has RLS enabled
```

### Stage 2: Code Deployment

```bash
# 1. Review changes
git diff main v0/branch

# 2. Create/update PR with:
# - Database schema changes
# - New API endpoints
# - New components
# - Documentation updates

# 3. Deploy to preview
# - Vercel auto-deploys on commit to feature branch

# 4. Test in preview
# - Run through test cases
# - Verify all APIs work
# - Check components render

# 5. Merge to main
# - Ensure all CI checks pass
# - Get approval from team
# - Merge PR

# 6. Deploy to production
# - Vercel deploys main automatically
# - Monitor for errors
```

### Stage 3: Initialization

```typescript
// Run initialization script (one-time)
// This initializes existing users with gamification profiles

// API endpoint to create:
POST /api/admin/initialize-gamification

// This will:
// 1. Create user_gamification_profile for all users
// 2. Create user_dtc_balance for all users
// 3. Create initial user_rankings
// 4. Log initialization activity
```

### Stage 4: Activation

```bash
# 1. Enable feature flag (if using)
# 2. Add gamification components to pages:
#    - Profile page: ProfileEnhancement
#    - Dashboard: GamificationProfileEnhanced
#    - Leaderboard page: Leaderboard
#    - Activity page: ActivityTimeline

# 3. Update navigation to include gamification hub

# 4. Send announcement to users
```

## Post-Deployment

### Monitoring Setup

1. **Application Performance Monitoring (APM)**
   - Monitor API endpoint latencies
   - Track error rates
   - Watch database query times

2. **Metrics to Track**
   - API response times per endpoint
   - Error rate by endpoint
   - User engagement increase
   - XP distribution
   - DTC flow

3. **Alerts to Configure**
   ```
   - API latency > 1000ms
   - Error rate > 1%
   - Ranking calculation failures
   - DTC transaction errors
   - Database connection errors
   ```

### Daily Checks (First Week)

- [ ] Check error logs for issues
- [ ] Verify API response times normal
- [ ] Check user adoption
- [ ] Monitor DTC balance calculations
- [ ] Verify rankings accurate
- [ ] Check streak tracking working

### Scheduled Tasks

Setup recurring jobs:
1. **Ranking Recalculation** (Daily at 2 AM UTC)
   ```bash
   POST /api/gamification/recalculate-rankings
   ```

2. **Streak Reset** (Daily at 1 AM UTC)
   - Check for users with broken streaks
   - Reset if needed

3. **Achievement Awards** (Hourly)
   - Check for pending achievements
   - Award on milestone completion

## Rollback Plan

If critical issues occur:

### Level 1: Soft Rollback (No data loss)
```bash
# 1. Revert code to previous version
git revert <commit-hash>

# 2. Redeploy
# Vercel auto-deploys

# 3. Keep database as-is
# All data preserved
```

### Level 2: Hard Rollback (Need database restore)
```bash
# 1. Use Supabase backup
#    - Go to Backups in Supabase dashboard
#    - Restore to specific point in time

# 2. Redeploy code
# 3. Re-run tests
```

### Level 3: Full Rollback
```bash
# 1. Take gamification system offline
# 2. Restore from backup
# 3. Disable gamification in app
# 4. Post incident report
# 5. Schedule postmortem
```

## Troubleshooting

### Issue: API Returns 401 Unauthorized
**Solution**: Verify user is authenticated
```typescript
const { user } = await supabase.auth.getUser()
if (!user) return 401
```

### Issue: Data Not Persisting
**Solution**: Check RLS policies and update permissions
```typescript
// Verify user_id matches authenticated user
WHERE user_id = auth.uid()
```

### Issue: Rankings Not Updating
**Solution**: Manually recalculate
```bash
curl -X POST http://localhost:3000/api/gamification/recalculate-rankings
```

### Issue: DTC Balance Wrong
**Solution**: Audit transactions
```sql
SELECT user_id, SUM(CASE WHEN transaction_type = 'earn' THEN amount 
                        WHEN transaction_type = 'spend' THEN -amount END)
FROM dtc_transactions
GROUP BY user_id
```

### Issue: Component Not Rendering
**Solution**: Check imports and dependencies
```typescript
// Verify all required components imported
import { GamificationProfileEnhanced } from '@/components/gamification-profile-enhanced'
```

## Component Integration Guide

### Add to Dashboard
```typescript
import { GamificationProfileEnhanced } from '@/components/gamification-profile-enhanced'

export function Dashboard() {
  return (
    <div>
      <h1>Your Dashboard</h1>
      <GamificationProfileEnhanced />
    </div>
  )
}
```

### Add to Profile Page
```typescript
import { ProfileEnhancement } from '@/components/profile-enhancement'
import { DTCWallet } from '@/components/dtc-wallet'
import { StreakTracker } from '@/components/streak-tracker'

export function ProfilePage() {
  return (
    <div className="space-y-6">
      <ProfileEnhancement />
      <StreakTracker />
      <DTCWallet />
    </div>
  )
}
```

### Add Leaderboard Page
```typescript
import { Leaderboard } from '@/components/leaderboard'

export function LeaderboardPage() {
  return (
    <div>
      <h1>Global Leaderboard</h1>
      <Leaderboard />
    </div>
  )
}
```

### Add Gamification Hub
```typescript
import GamificationClient from '@/app/gamification/gamification-client'

export function GamificationHub() {
  return <GamificationClient />
}
```

## Documentation Structure

- `docs/GAMIFICATION_TESTING.md` - Comprehensive testing guide
- `docs/GAMIFICATION_IMPLEMENTATION.md` - Implementation details
- `scripts/003-gamification-schema.sql` - Database schema
- `scripts/verify-gamification.ts` - Verification script
- Component JSDoc comments - Implementation docs

## Success Metrics

After deployment, measure:

1. **User Adoption**
   - % of users viewing gamification hub
   - % of users with streaks
   - Average XP per user

2. **Engagement**
   - Daily active users increase
   - Session duration increase
   - Feature usage frequency

3. **System Health**
   - API uptime > 99.9%
   - Average response time < 200ms
   - Error rate < 0.1%

4. **Data Quality**
   - No ranking calculation failures
   - DTC balance accuracy 100%
   - No orphaned achievements

## Support & Maintenance

### Regular Maintenance
- Monitor error logs weekly
- Review performance metrics weekly
- Update documentation as needed
- Patch security vulnerabilities

### User Support
- Add FAQ section to help docs
- Set up support for gamification issues
- Create user guides for features
- Gather feedback for improvements

## Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Development | 2-3 days | Code + tests |
| Review | 1 day | Approvals |
| Staging | 1 day | Testing |
| Deployment | 1 day | Live + monitoring |
| Monitoring | 1 week | Initial issues resolved |

## Contacts

- **Technical Lead**: [Name]
- **Database Admin**: [Name]
- **DevOps**: [Name]
- **Product Owner**: [Name]

## Sign-Off

- [ ] Tech Lead Approval
- [ ] Security Review
- [ ] Database Admin Approval
- [ ] Product Owner Approval
- [ ] Ready for Production Deployment
