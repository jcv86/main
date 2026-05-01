# Gamification System Integration Testing Guide

## Overview
This document outlines the complete testing strategy for the Despega gamification system covering XP, DTC coins, rankings, and achievements.

## System Architecture

### Components
- **User Gamification Profile**: Tracks total XP, level, and daily streaks
- **Rankings System**: Maintains global leaderboard and tier assignments
- **DTC Wallet**: Manages digital training coins
- **Achievement System**: Tracks unlocked badges and milestones
- **Activity Logger**: Records all user actions for gamification

### Database Tables
- `user_gamification_profile`
- `user_rankings`
- `user_dtc_balance`
- `dtc_transactions`
- `achievements`
- `gamification_activity_log`

## Test Cases

### 1. XP Earning & Leveling
**Objective**: Verify XP is awarded correctly and levels progress properly

**Test Steps**:
1. Create test user
2. Trigger XP-earning activity (complete A3 session)
3. Verify XP added to profile
4. Check level calculation is correct
5. Test level-up milestone rewards

**Expected Results**:
- XP increases by correct amount
- Level updates when XP threshold reached
- Level-up achievement created
- Bonus XP awarded at milestones

### 2. DTC Coin Earning
**Objective**: Verify DTC coins are awarded for milestones

**Test Steps**:
1. Complete interview
2. Check DTC balance updated
3. Verify transaction recorded
4. Test perfect score bonus
5. Verify spending functionality

**Expected Results**:
- DTC balance increases
- Transaction logged with correct type/description
- Balance reflects total earned - spent
- Spending reduces balance correctly

### 3. Ranking Recalculation
**Objective**: Verify rankings update correctly

**Test Steps**:
1. Create multiple test users
2. Assign varying XP amounts
3. Run ranking calculation
4. Verify rank assignment (1-based)
5. Check tier assignment:
   - Top 10 → Diamond
   - Top 50 → Platinum
   - Top 100 → Gold
   - Top 500 → Silver
   - Top 1000 → Bronze
   - Others → Rising

**Expected Results**:
- All users ranked correctly
- Tiers assigned based on rank
- Leaderboard sorted by XP descending
- Rankings persist after recalculation

### 4. Daily Streak Management
**Objective**: Verify streak tracking and milestones

**Test Steps**:
1. Create user with no streak
2. Record activity (0 streak → 1)
3. Skip day (streak resets)
4. Build streak to milestones (3, 7, 14, 30, 100)
5. Verify rewards at each milestone

**Expected Results**:
- Streak increments on consecutive days
- Resets after 1 day missed
- Milestones trigger achievements
- Bonus XP/DTC awarded at milestones

### 5. Leaderboard Generation
**Objective**: Verify leaderboard data accuracy

**Test Steps**:
1. Fetch global leaderboard
2. Verify top 50 users
3. Check user's rank
4. Verify XP breakdown by section (A1, A2, A3)
5. Test pagination (limit parameter)

**Expected Results**:
- Leaderboard sorted by total XP
- All required fields present
- Rank numbers sequential
- Pagination works correctly

### 6. A2 Route Gamification
**Objective**: Verify A2-specific XP and rewards

**Test Steps**:
1. Get user A2 route progress
2. Verify XP calculation based on completion %
3. Test milestone unlock (25%, 50%, 75%, 100%)
4. Verify DTC reward calculation
5. Test claim reward flow

**Expected Results**:
- XP scales with progress percentage
- Milestones unlock at expected checkpoints
- Rewards calculated correctly
- Claiming updates balances

### 7. Achievement System
**Objective**: Verify achievements unlock correctly

**Test Steps**:
1. Trigger achievement-unlocking events:
   - First activity
   - Level-ups
   - Streak milestones
   - Perfect scores
   - Interview completion
2. Verify achievement created
3. Check duplicate prevention
4. Test achievement display on profile

**Expected Results**:
- Achievements created at right time
- Duplicates prevented
- Achievement details correct
- Display on profile accurate

### 8. Activity Timeline
**Objective**: Verify activity history tracking

**Test Steps**:
1. Generate various gamification events
2. Fetch activity timeline
3. Verify events sorted by timestamp (newest first)
4. Test filtering by type
5. Test pagination (limit parameter)

**Expected Results**:
- All events recorded
- Timeline sorted correctly
- All fields present
- Pagination works

### 9. Profile Enhancement Data
**Objective**: Verify combined profile display

**Test Steps**:
1. Fetch enhanced profile
2. Verify user data included
3. Check gamification stats
4. Verify ranking info
5. Check DTC totals
6. Verify achievements list

**Expected Results**:
- All data fields present
- Data accurate and current
- No data leakage
- Performance acceptable

### 10. Authorization & Security
**Objective**: Verify proper access control

**Test Steps**:
1. Test GET endpoints without auth (should fail)
2. Test user can only see own data
3. Test user cannot modify others' stats
4. Verify admin-only endpoints protected
5. Test RLS policies

**Expected Results**:
- Unauthenticated users denied access
- Users see only own sensitive data
- Public leaderboard accessible
- Admin operations protected
- RLS policies enforce correctly

## Performance Testing

### Response Time Targets
- Global stats: < 100ms
- Rankings (limit=50): < 200ms
- Profile enhancement: < 150ms
- Leaderboard: < 300ms
- Activity timeline: < 250ms

### Load Testing
- Simulate 1000 concurrent users
- Verify no performance degradation
- Check database connection pooling

## Integration Points

### A1 Integration
- Track test completion XP
- Award DTC for profile completeness

### A2 Integration
- Track route progress XP
- Calculate milestone rewards
- Award DTC for completions

### A3 Integration
- Track session XP
- Award bonuses for consistency
- Track streak impact

### Interview Module
- Award XP for completion
- DTC for successful interviews
- Bonuses for perfect scores

## Deployment Checklist

- [ ] Database migration script executed
- [ ] Tables created with RLS policies
- [ ] Test users created
- [ ] API endpoints tested
- [ ] Components render correctly
- [ ] Leaderboard recalculated
- [ ] Streaks initialized
- [ ] DTC balances seeded
- [ ] Achievements configured
- [ ] Monitoring setup
- [ ] Error logging enabled

## Monitoring & Alerting

### Metrics to Track
- API response times
- Error rates
- User engagement metrics
- XP distribution
- DTC flow
- Ranking stability

### Alerts to Configure
- API latency > 1s
- Error rate > 1%
- Ranking calculation failures
- DTC transaction errors
- Database connection issues

## Rollback Plan

1. **Database**: Use Supabase backup
2. **Code**: Deploy previous version
3. **Cache**: Clear Redis cache
4. **Notify**: Alert affected users

## Success Criteria

- [ ] All test cases pass
- [ ] No security vulnerabilities
- [ ] Performance meets targets
- [ ] User engagement increases
- [ ] No data inconsistencies
- [ ] Deployment successful
- [ ] Monitoring operational
