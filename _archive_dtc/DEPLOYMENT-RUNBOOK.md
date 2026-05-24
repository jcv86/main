# DEPLOYMENT RUNBOOK
**Version**: 1.0  
**Última Actualización**: Mayo 22, 2026  
**Destinatario**: DevOps Team / Tech Lead

---

## QUICK REFERENCE

**Go-Live Date**: May 23, 2026  
**Environment**: Vercel (production)  
**Database**: Supabase PostgreSQL  
**Expected Users Week 1**: 500-1000  
**Expected Uptime**: 99.9%

---

## PRE-DEPLOYMENT CHECKLIST (1 HORA ANTES)

### 30 min antes
- [ ] Team standup (5 min)
  - Confirm DB backups are fresh
  - Confirm monitoring is active
  - Assign on-call engineer
  
- [ ] Final smoke tests (10 min)
  ```bash
  # Test critical paths
  curl -s https://despega-tu-carrera.vercel.app/health
  # Expected: 200 OK
  ```
  
- [ ] Notification setup (5 min)
  - [ ] Slack alert channels ready
  - [ ] Email escalation working
  - [ ] SMS alerts configured

### 5 min antes
- [ ] Monitor dashboards open
  - [ ] Vercel Analytics (browser)
  - [ ] Supabase dashboard (browser)
  - [ ] Error tracking (Sentry)
  
- [ ] Team in Zoom/Slack for coordination

---

## DEPLOYMENT PROCESS (5 MINUTES)

### Step 1: Database Verification (1 min)
```bash
# SSH to DevOps server
ssh devops@production

# Verify migrations
psql despega_prod -c "SELECT version();"

# Verify RPC exists
psql despega_prod -c "SELECT proname FROM pg_proc 
WHERE proname = 'complete_a1_mission_transaction';"

# Expected output: 
# complete_a1_mission_transaction
```

### Step 2: Backup (1 min)
```bash
# Trigger manual backup
# Via Supabase Console:
# Settings → Backups → Trigger backup
# Wait for confirmation
```

### Step 3: Deploy to Vercel (2 min)
```bash
cd /vercel/share/v0-project

# Push to main branch
git push origin v0/jcv86-4cea421a:main

# Vercel auto-deploys on push to main
# Monitor: https://vercel.com/despega-tu-carrera

# Wait for deployment complete
# Expected: Green checkmark, 0 errors
```

### Step 4: Verify Deployment (1 min)
```bash
# Check URL responds
curl -s -o /dev/null -w "%{http_code}" \
  https://despega-tu-carrera.vercel.app

# Expected: 200

# Test critical endpoint
curl -s https://despega-tu-carrera.vercel.app/api/health | jq .

# Expected: { "status": "ok" }
```

---

## POST-DEPLOYMENT MONITORING (24 HOURS)

### Hour 1 (Critical)
- [ ] **Every 2 min**: Check error rate
  - Target: < 0.1%
  - Action if > 1%: IMMEDIATE ROLLBACK
  
- [ ] **Every 2 min**: Check response times
  - Target: < 2000ms p95
  - Action if > 5000ms: Investigate
  
- [ ] **Every 2 min**: Check Supabase connection
  - No connection errors
  - Connection pool < 50 concurrent

### Hour 2-4
- [ ] **Every 5 min**: Error rate monitoring
- [ ] **Every 5 min**: Response time monitoring
- [ ] **Every 5 min**: User count tracking
- [ ] Check incoming support tickets (none expected)

### Hour 4-24
- [ ] **Every 15 min**: Error rate (target < 0.05%)
- [ ] **Every 30 min**: User count & engagement
- [ ] **Hourly**: Overall system health
- [ ] **Every 4h**: Full smoke test

### Success Metrics
- Error rate stays < 0.1%
- Response times stable
- 99% uptime minimum
- No critical bugs reported

---

## ROLLBACK PROCEDURE (IF NEEDED)

### Decision Criteria (ROLLBACK IF):
1. Error rate > 5%
2. Response time > 10s p95
3. Database connection failure
4. More than 50 critical bugs in first hour

### Rollback Steps (2 minutes)

```bash
# Step 1: Immediate traffic stop (via Vercel)
# In Vercel Console:
# - Click deployment
# - Click "Rollback to previous"
# - Confirm

# Step 2: Verify old version is live
curl https://despega-tu-carrera.vercel.app
# Should see previous version

# Step 3: Communication
# Send message to team:
# "Rollback completed. Investigating issue."
# Launch incident report

# Step 4: Database check
# Verify no data corruption from the brief time new code ran
psql despega_prod -c "SELECT COUNT(*) FROM despega_pilar_progress;"
# Compare with expected count
```

---

## COMMON ISSUES & FIXES

### Issue 1: High Response Time
**Symptoms**: > 5s response time  
**Probable Cause**: Database query slow  
**Fix**:
```bash
# Check slow queries
psql despega_prod -c "SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC LIMIT 10;"

# Kill stuck connections
psql despega_prod -c "SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle in transaction' 
AND query_start < NOW() - INTERVAL '5 minutes';"
```

### Issue 2: Connection Pool Exhausted
**Symptoms**: "too many connections" error  
**Probable Cause**: Connections not being released  
**Fix**:
```bash
# Check active connections
psql despega_prod -c "SELECT COUNT(*) FROM pg_stat_activity;"

# If > 50:
# Restart connection pooling (Supabase Console)
# Settings → Database → Connection Pooling → Restart
```

### Issue 3: RPC Function Error
**Symptoms**: "function not found" in logs  
**Probable Cause**: Migration didn't run  
**Fix**:
```bash
# Verify RPC exists
psql despega_prod -c "SELECT proname FROM pg_proc 
WHERE proname = 'complete_a1_mission_transaction';"

# If not found: Re-run migration
psql despega_prod < migrations/001-complete-mission-transaction.sql
```

### Issue 4: Data Corruption
**Symptoms**: Missing data or inconsistent state  
**Probable Cause**: Transaction rollback issue  
**Fix**:
```bash
# STOP - do not attempt fix
# Escalate to Database Administrator
# Execute restore from backup:

# In Supabase Console:
# Settings → Backups → Select recent backup → Restore
# ETA: 5-15 minutes
```

---

## MONITORING DASHBOARD

### URL: https://vercel.com/despega-tu-carrera
**Monitor**:
- Deployment status (green = good)
- Error rate (target < 0.1%)
- Response time (target < 2s)
- Build logs (look for errors)

### URL: Supabase Console
**Monitor**:
- Active connections (< 50)
- Database usage (< 80%)
- Slow queries (none expected)
- RLS policy activity

### URL: Sentry (if configured)
**Monitor**:
- Error spikes
- Stack traces
- User sessions affected
- Alerts triggering

---

## ESCALATION MATRIX

| Issue | Severity | Action | Contact |
|-------|----------|--------|---------|
| Error rate > 1% | Critical | ROLLBACK | Tech Lead |
| Error rate 0.5% | High | Investigate | Backend Eng |
| Error rate < 0.1% | Low | Monitor | On-call |
| Response time > 5s | Critical | ROLLBACK | Tech Lead |
| DB connection fail | Critical | ROLLBACK | DevOps |
| Minor bugs | Medium | Hotfix | Frontend Eng |

---

## POST-INCIDENT COMMUNICATION

### Success Announcement (if all good)
```
📢 We're excited to announce: Despega Tu Carrera is now LIVE!

🚀 Status: Production deployment successful
✅ All systems operational
📊 500+ users signing up

Join us: despega-tu-carrera.vercel.app
```

### Rollback Notification (if needed)
```
⚠️ Temporary Maintenance Alert

We've rolled back to our previous version to investigate a performance issue.

🔧 Working on fix
⏱️ ETA: [time]
📧 Updates: [email]

We apologize for any inconvenience.
```

---

## WEEK 1 MAINTENANCE PLAN

### Day 1 (May 23)
- 24h continuous monitoring
- On-call engineer available
- Standup at 9 AM & 5 PM UTC
- Response time: < 5 min for critical issues

### Day 2-3 (May 24-25)
- Monitoring 16h/day
- Peak time coverage (9 AM - 9 PM UTC)
- Review metrics hourly
- User feedback analysis

### Day 4-7 (May 26-29)
- Standard monitoring hours
- Incident review meetings
- Performance optimization
- Feature requests compilation

---

## SUCCESS CRITERIA

**All of these must be TRUE for launch to be considered successful**:

✅ Error rate < 0.1%  
✅ Response time < 2s p95  
✅ Uptime > 99.9%  
✅ Database stable  
✅ 0 critical bugs  
✅ Users able to complete A1 Day 1  
✅ No data corruption  
✅ No security incidents  
✅ Support tickets < 10

**If all TRUE**: 🎉 MISSION ACCOMPLISHED  
**If any FALSE**: 🔧 ONGOING WORK

---

## REFERENCE DOCS

- Database Verification: DB-VERIFICATION-REPORT.md
- E2E Tests: E2E_TEST_PLAN.md
- Production Checklist: PRODUCTION_DEPLOYMENT_CHECKLIST.md
- Architecture: /documentation/technical/ARCHITECTURE.md

---

## TEAM CONTACTS

- **Tech Lead**: [Name] - [Slack] - [Email]
- **DevOps**: [Name] - [Slack] - [Email]
- **Backend**: [Name] - [Slack] - [Email]
- **Frontend**: [Name] - [Slack] - [Email]
- **On-Call**: [Rotation] - [Slack channel]

---

## NOTES

- Deployment usually takes 2-5 minutes
- Rollback is instant (< 30 seconds)
- No downtime expected
- All data preserved on rollback
- Questions? Ask Tech Lead before deployment

---

**Last Updated**: May 22, 2026  
**Next Review**: After May 23 deployment  
**Document Owner**: Tech Lead
