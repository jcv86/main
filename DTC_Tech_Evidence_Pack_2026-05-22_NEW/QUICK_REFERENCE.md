# Quick Reference - System Alignment Implementation

## The Problem (From Veredicto)
- Navigation was decentralized and error-prone
- No single source of truth for user state
- Flags set inconsistently across different APIs
- Difficult to troubleshoot user progression issues

## The Solution
Created **centralized state management** using `despega_user_profiles` flags as the single source of truth for ALL navigation logic.

---

## For Developers: How Navigation Works Now

### Check User's Status
```typescript
import { getNextRequiredPage } from '@/lib/redirect-logic'

const nextPage = await getNextRequiredPage(userId)
// Returns: '/despega/conozcamonos-1' or '/despega/a1-cerebral' etc.
```

### Add to Page for Smart Redirects
```typescript
useEffect(() => {
  if (!user?.id) return
  
  const redirect = async () => {
    const nextPage = await getNextRequiredPage(user.id)
    if (nextPage !== '/current/page') {
      router.push(nextPage)
    }
  }
  
  redirect()
}, [user?.id])
```

---

## For QA: Testing User Journey

### Test Data
1. Create new account → Check profile flags (all false)
2. Complete C1 → `onboarding_completed = true`
3. Complete A1 → `a1_test_completed = true`
4. Complete C2 → `onboarding_conozcamonos_2_completed = true`
5. Complete A2 → `a2_missions_started = true`
6. Complete A3 → `a3_training_started = true`
7. Complete A4 → `a4_unlocked = true`

### Verify Redirects
- Can't access A1 without completing C1? ✓
- Can't access A2 without completing A1? ✓
- Each stage has correct data in database? ✓

### Monitor Progress
Visit: `/admin/progress-dashboard`
- See all users and their current stage
- View completion percentages
- Check which stage users are stuck on

---

## For Admins: User Progress Monitoring

### Quick Stats
- Visit `/admin/progress-dashboard`
- See total users, % fully onboarded, average stage
- View charts and detailed user table

### Troubleshoot User Issues
```sql
-- User not progressing past A1?
SELECT * FROM despega_user_profiles 
WHERE user_id = 'problematic_user'
AND a1_test_completed = true
AND onboarding_conozcamonos_2_completed = false;

-- If A1 data exists but flag not set:
UPDATE despega_user_profiles
SET a1_test_completed = true, a1_test_completed_at = NOW()
WHERE user_id = 'problematic_user';
```

---

## Files You Need to Know

| File | Purpose |
|------|---------|
| `lib/redirect-logic.ts` | Single source of truth for navigation |
| `app/admin/progress-dashboard/page.tsx` | Monitor all users |
| `DATA_PERSISTENCE_VERIFICATION.md` | Data flow documentation |
| `SYSTEM_ALIGNMENT_COMPLETE.md` | Full implementation details |

---

## Common Issues & Solutions

### User stuck on same page?
**Check**: Is the flag set in `despega_user_profiles`?
```sql
SELECT * FROM despega_user_profiles WHERE user_id = '{id}';
```
**Fix**: If data was saved but flag not set, manually update the flag

### Redirect loop?
**Check**: Call `getNextRequiredPage(userId)` - what does it return?
**Fix**: Should return next incomplete stage, not current page

### User can skip stages?
**Check**: Are prerequisite checks in place?
**Fix**: Ensure page uses centralized redirect logic

---

## Deployment Notes

1. **No database migrations needed** - flags already exist
2. **API changes backward compatible** - all endpoints still work
3. **No breaking changes** - existing data structure unchanged
4. **Admin dashboard** available at `/admin/progress-dashboard`

---

## Success Metrics

After deployment, verify:
- [ ] Users navigate through stages sequentially
- [ ] No users can skip prerequisites
- [ ] All test data appears in correct tables
- [ ] Flags update when tests completed
- [ ] Admin dashboard shows realistic user distribution
- [ ] No console errors about redirect loops

---

## Contact for Issues

- **Navigation problems**: Check `lib/redirect-logic.ts`
- **Data not persisting**: Check test save API
- **Admin dashboard blank**: Check database permissions
- **Flags not updating**: Check test submit handler
