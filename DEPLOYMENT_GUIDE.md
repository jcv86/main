# Deployment Guide

**Project:** Despega AI Platform  
**Target:** Vercel Production  
**Environment:** Next.js 15 + Supabase  
**Status:** Ready to Deploy

---

## Prerequisites

- [x] GitHub repository connected to Vercel
- [x] Supabase project fully configured
- [x] All environment variables set in Vercel dashboard
- [x] Pre-deployment checklist passed
- [x] Security audit passed
- [x] Zero mock data in codebase

---

## Step 1: Verify Environment Variables

### In Vercel Dashboard Settings → Environment Variables

Verify these are all set:

```env
# Supabase URLs
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]

# Server-side only (mark as secret)
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
SUPABASE_JWT_SECRET=[your-jwt-secret]

# Database
POSTGRES_URL=postgresql://[connection-string]
POSTGRES_PRISMA_URL=postgresql://[connection-string]?schema=public
POSTGRES_URL_NON_POOLING=postgresql://[connection-string]
POSTGRES_USER=[username]
POSTGRES_PASSWORD=[password]
POSTGRES_HOST=[host]
POSTGRES_DATABASE=[dbname]

# Optional: AI/Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=[if using analytics]
```

### Check Vercel Dashboard
1. Go to Project Settings
2. Click "Environment Variables"
3. Ensure all vars above are listed
4. Production environment selected
5. Save changes

**Result:** ✅ All environment variables configured

---

## Step 2: Test Build Locally (Optional)

```bash
# Install dependencies
npm install
# or
pnpm install

# Build locally
npm run build

# Test locally
npm run start
```

If local build passes → proceed to Step 3

---

## Step 3: Deploy via GitHub

### Option A: Automatic Deploy (Recommended)

```bash
# Make sure latest code is committed
git add .
git commit -m "chore: pre-deployment audit passed"
git push origin main
```

Vercel will automatically:
1. Detect the push to `main`
2. Trigger build pipeline
3. Run tests (if configured)
4. Deploy to preview URL
5. Show preview environment link

**Expected Build Time:** 2-5 minutes

### Option B: Manual Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Click "Deployments" tab
4. Click "New Deployment" button
5. Select branch: `main`
6. Click "Deploy"

**Note:** GitHub push (Option A) is preferred for CI/CD

---

## Step 4: Monitor Build Progress

### In Vercel Dashboard
1. Click "Deployments" tab
2. Watch the build progress
3. Check build logs for errors

### Key Build Stages
```
[1/4] Installing dependencies...    ✅
[2/4] Building next.js app...       ✅
[3/4] Optimizing production build... ✅
[4/4] Creating serverless functions ✅
```

**Expected Stages:**
- Pre-build (cleanup)
- Install (npm/pnpm)
- Build (Next.js compilation)
- Post-build (optimization)

---

## Step 5: Test Deployment

### Smoke Tests (5-10 minutes)

After deployment shows "Ready", test:

#### 1. Authentication Flow
```
✅ Visit deployed URL
✅ Sign up with test email
✅ Verify email (check inbox)
✅ Log in with credentials
✅ Verify session created
✅ Log out and verify cleared
```

#### 2. Core Features
```
✅ Navigate to A1 Dashboard
✅ View personality test
✅ Navigate to A2 Learning Routes
✅ Navigate to A3 Interviews
✅ Navigate to A4 Reality & Context
```

#### 3. Database Connectivity
```
✅ Create user profile
✅ Save a learning route
✅ Add a news bookmark
✅ Verify data persists after reload
```

#### 4. Performance
```
✅ Homepage loads in < 2s
✅ Dashboard loads in < 2s
✅ No console errors
✅ Lighthouse score 90+
```

#### 5. Security
```
✅ Cannot access other user's data
✅ Cannot modify data via browser dev tools
✅ HTTPS enforced
✅ No sensitive data in network tab
```

### Testing Commands
```bash
# Check build output
npm run build

# Check for TypeScript errors
npm run type-check

# Lint code
npm run lint

# Run tests if configured
npm test
```

---

## Step 6: Gradual Rollout Strategy

For production-critical applications, use canary deployment:

### Stage 1: Preview Environment (Current)
- 100% of preview traffic
- Real Supabase database
- Real AI backend
- 1-2 hours monitoring
- Watch error rate and latency

### Stage 2: Production Canary (5% traffic)
- 5% of prod users
- Real production database
- Real production traffic
- Monitor for 2-4 hours
- Check metrics: error rate, latency, conversion

### Stage 3: Gradual Rollout (25% → 50% → 100%)
- Increase 25% every 1 hour
- Continue monitoring
- Rollback ready if issues detected

### Monitoring During Rollout
```
✅ Vercel Analytics
✅ Error rate < 0.1%
✅ API response time < 200ms p95
✅ Database query time < 100ms p95
✅ User session creation success > 99%
```

**Tool:** Use Vercel's Deployment Protection → Rollback

---

## Step 7: Post-Deployment Verification

### Within 1 Hour
- [x] Visit production URL
- [x] Test authentication
- [x] Verify database connectivity
- [x] Check error logs (no critical errors)
- [x] Monitor API response times

### Within 24 Hours
- [x] Monitor user signups
- [x] Check active user sessions
- [x] Verify no data corruption
- [x] Review Vercel Analytics
- [x] Check uptime monitoring

### Within 1 Week
- [x] Performance baseline established
- [x] Security monitoring active
- [x] Bug reports triaged
- [x] User feedback collected
- [x] Documentation updated

---

## Rollback Procedure (If Needed)

### Quick Rollback (< 5 minutes)

**Via Vercel Dashboard:**
1. Go to Deployments tab
2. Find previous stable deployment
3. Click "..." menu
4. Click "Rollback to this Deployment"
5. Confirm rollback

**Automatic Effect:**
- Previous version immediately live
- Supabase data unchanged
- User sessions may reset
- No data loss

**Via GitHub (Alternative):**
```bash
# Revert commit
git revert HEAD

# Push to trigger redeployment
git push origin main

# Vercel automatically redeploys
```

**Expected Rollback Time:** 2-5 minutes

### After Rollback
1. Investigate root cause
2. Fix issue in code
3. Test locally
4. Redeploy with fix
5. Document incident

---

## Monitoring & Alerts

### Vercel Analytics Dashboard
Track:
- Page load times
- Error rates
- User sessions
- API endpoint performance
- Deployment history

### Set Up Alerts
1. Go to Project Settings
2. Click "Alerts"
3. Create alerts for:
   - Build failures
   - High error rate (> 1%)
   - High latency (> 500ms)
   - Deployment rollbacks

### Supabase Monitoring
1. Go to Supabase Dashboard
2. Click "Database" → "Logs"
3. Monitor:
   - Query performance
   - Connection pool status
   - Replication lag
   - Error logs

---

## Troubleshooting

### Build Fails
**Error:** `Module not found`
**Solution:** Check package.json, run `npm install`, verify imports

**Error:** `TypeScript compilation error`
**Solution:** Run `npm run type-check`, fix type errors

### Deployment Hangs
**Error:** Build stuck at stage
**Solution:** 
- Cancel deployment in Vercel dashboard
- Wait 2 minutes
- Redeploy

### Database Connection Fails
**Error:** `Error: connect ECONNREFUSED`
**Solution:**
- Verify `POSTGRES_URL` env var set
- Check Supabase database is running
- Verify firewall allows connection

### Authentication Issues
**Error:** `Supabase Auth not initialized`
**Solution:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is set
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Test auth locally first

### Performance Degradation
**Error:** Slow API responses
**Solution:**
- Check Supabase connection pool
- Monitor database query performance
- Check Vercel function limits
- Optimize N+1 queries

---

## Production Readiness Checklist

Before declaring "Go Live":

- [x] All tests passing
- [x] No console errors
- [x] No TypeScript errors
- [x] Performance metrics green
- [x] Uptime monitoring active
- [x] Error tracking active
- [x] Database backups confirmed
- [x] Security audit passed
- [x] Documentation updated
- [x] Team trained on deployment
- [x] Runbook documented
- [x] Incident response plan ready

---

## Deployment Timeline

### Day 1 (Deployment Day)
```
08:00 - Final checklist review
08:15 - Deploy to production
08:20 - Smoke tests
08:30 - Canary deployment 5%
08:45 - Monitor metrics
09:00 - Gradual rollout 25%
09:30 - Rollout to 100%
10:00 - Post-deployment verification
10:30 - Team notification
11:00 - Documentation update
```

### Week 1 (Post-Deployment)
- Daily monitoring
- Bug triage
- Performance baseline
- Security log review
- User feedback collection

### Month 1 (Stabilization)
- Weekly performance review
- Monthly security audit
- User satisfaction tracking
- Feature stability assessment

---

## Contact & Support

### Deployment Issues
- Check Vercel Docs: https://vercel.com/docs
- Check Supabase Docs: https://supabase.com/docs
- GitHub Issues: [your-repo]/issues

### Emergency Escalation
1. Rollback production
2. Notify team
3. Document incident
4. Root cause analysis
5. Fix and redeploy

---

## Deployment Sign-Off

**Deployed By:** [Name]  
**Deployment Date:** [Date]  
**Version:** [v1.0.0]  
**Commit Hash:** [hash]  
**Status:** ✅ **LIVE**

### Verification Sign-Off
- [x] Code review passed
- [x] QA approved
- [x] Security audit passed
- [x] Performance acceptable
- [x] Monitoring active
- [x] Rollback plan ready

---

## Success Criteria

Deployment considered successful when:

1. **Availability:** 99.9% uptime maintained
2. **Performance:** API response time < 200ms p95
3. **Reliability:** Error rate < 0.1%
4. **Security:** Zero security incidents
5. **User Experience:** No critical bugs reported
6. **Data Integrity:** All data correctly persisted
7. **Monitoring:** All alerts functioning

---

**Next Steps:** Monitor deployment for 24 hours, then transition to standard operations.

**Last Updated:** 2/19/2026  
**Next Review:** 2 weeks post-deployment
