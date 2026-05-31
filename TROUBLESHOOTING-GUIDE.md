# TROUBLESHOOTING GUIDE
**Versión**: 1.0  
**Para**: Support Team / DevOps  
**Actualizado**: Mayo 22, 2026

---

## QUICK TROUBLESHOOTING INDEX

| Problema | Síntomas | Solución | Tiempo |
|----------|----------|----------|--------|
| Auth falló | "Invalid credentials" | Check DB / reset password | 5 min |
| Misión no guarda | Puntos no aparecen | Check RPC / try again | 2 min |
| Lentitud | > 5s page load | Check DB queries / restart pool | 10 min |
| Ciclo incorrecto | cycle_id null | Reset cycle / migration check | 15 min |
| IA no responde | Timeout en A4 | Check API key / restart | 5 min |
| Redirect loop | Infinite loading | Clear cookies / check middleware | 3 min |

---

## USER-FACING ISSUES

### Issue: "Can't Log In"

**User Reports**: 
- "Password not working"
- "Email not recognized"
- "Stuck on login page"

**Quick Fix**:
```
1. Ask user: "Did you get the welcome email?"
   - YES → Ask: "Did you click the verification link?"
   - NO → Resend email via dashboard

2. If yes to both:
   - Ask: "What exact error message do you see?"
   
3. Solutions by error:
   - "Invalid credentials" → Reset password
   - "Email not verified" → Resend verification
   - "Account locked" → Contact support@despega.cl
```

**Backend Check**:
```sql
-- Check if user exists
SELECT id, email, email_confirmed_at, last_sign_in_at 
FROM auth.users 
WHERE email = '[user-email]';

-- If email_confirmed_at is NULL:
-- → Email verification incomplete
-- → Resend verification email

-- If last_sign_in_at is NOT NULL:
-- → Account works, might be password issue
-- → Trigger password reset
```

---

### Issue: "Missions Not Saving"

**User Reports**:
- "I completed the mission but no puntos"
- "Mission disappeared"
- "Points went down instead of up"

**Quick Fix**:
```
1. Ask: "What day are you on?"
   - If day > current_day → Middleware should redirect
   - If day < current_day → Should be viewable only
   - If day = current_day → Should be editable

2. Ask: "Did you see a success message?"
   - NO → Page might have error, check browser console
   - YES → But points missing → DB issue

3. Solutions:
   - Refresh page (might be cache)
   - Check browser console for errors
   - Try different mission on same day
   - Contact support if persists
```

**Backend Check**:
```sql
-- Check mission completion for user
SELECT user_id, pilar, ciclo_dia, mision_numero, puntos, created_at 
FROM despega_missione_completadas 
WHERE user_id = '[user-id]'
ORDER BY created_at DESC LIMIT 10;

-- If multiple entries for same mission/day:
-- → Double-click happened (RPC might be failing)
-- → Check RPC logs

-- If no entries but user thinks they clicked:
-- → RPC transaction failed
-- → Try mission again

-- If puntos negative:
-- → Contact backend engineer immediately
```

---

### Issue: "Can't Access A3"

**User Reports**:
- "A3 button grayed out"
- "Can't see A3 modules"
- "Completed A2 but still locked"

**Quick Fix**:
```
1. Verify: "Did you complete ALL 90 days of A2?"
   - NO → Need to complete A2 first
   - YES → Might be flag issue

2. Manual check:
   - Has flag: is_a2_pilar_complete = true
   - Has flag: is_a3_unlocked = true
   
3. If flags not set:
   - Refresh page
   - Log out and back in
   - Clear browser cache
   
4. If still broken:
   - Contact backend
```

**Backend Fix**:
```sql
-- Check flags for user
SELECT user_id, is_pilar_complete, is_a2_pilar_complete, is_a3_unlocked 
FROM despega_pilar_progress 
WHERE user_id = '[user-id]' AND pilar = 'A2';

-- If is_a2_pilar_complete = false but user claims done:
-- Manually set flag:
UPDATE despega_pilar_progress 
SET is_a2_pilar_complete = true, is_a3_unlocked = true 
WHERE user_id = '[user-id]' AND pilar = 'A2';

-- Notify user to refresh
```

---

### Issue: "A4 AI Coach Not Responding"

**User Reports**:
- "AI takes forever to respond"
- "Getting error: 'Request timeout'"
- "Blank screen in chat"

**Quick Fix**:
```
1. Ask: "How long do you wait?"
   - < 3 sec → Might still loading (be patient)
   - > 10 sec → Timeout happening

2. Solutions:
   - Refresh page
   - Try again with shorter message
   - Check internet connection
   - Clear browser cookies
   
3. If still failing:
   - Check if API key is valid
   - Restart streaming service
```

**Backend Check**:
```bash
# Check if Vercel AI Gateway is responding
curl -X POST "https://api.vercel.ai/chat/completions" \
  -H "Authorization: Bearer $AI_GATEWAY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3.5-sonnet",
    "messages": [{"role": "user", "content": "Hola"}],
    "stream": true
  }'

# If timeout → AI service issue
# If error → API key invalid
# If success → Service working, client-side issue
```

---

## TECHNICAL ISSUES (FOR DEVOPS)

### Issue: Database Connection Errors

**Error Logs**: 
```
Error: too many connections
Error: connection refused
Error: pool exhausted
```

**Diagnosis**:
```bash
# Check active connections
psql despega_prod -c "SELECT COUNT(*) FROM pg_stat_activity;"

# Check connection pool size
psql despega_prod -c "SHOW max_connections;"
# Default: 100

# Check idle connections
psql despega_prod -c "SELECT COUNT(*) FROM pg_stat_activity 
WHERE state = 'idle';"
```

**Fix**:
```bash
# Option 1: Kill idle connections
psql despega_prod -c "SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
AND state_change < NOW() - INTERVAL '10 minutes';"

# Option 2: Restart connection pool (Supabase)
# Via Console: Settings → Database → Connection Pooling → Restart

# Option 3: Check for queries that hold connections
psql despega_prod -c "SELECT pid, usename, state, query 
FROM pg_stat_activity 
WHERE state != 'idle' 
ORDER BY query_start DESC;"
```

---

### Issue: Slow Queries

**Symptoms**:
- Response time > 5 seconds
- Database CPU high
- Users complaining about slowness

**Diagnosis**:
```sql
-- Find slow queries
SELECT query, calls, mean_exec_time, max_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 1000  -- > 1 second
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Find missing indices
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE tablename = 'despega_pilar_progress';
```

**Fix**:
```sql
-- Create missing index if needed
CREATE INDEX idx_user_pilar_cycle 
ON despega_pilar_progress(user_id, pilar, cycle_id);

-- Analyze table statistics
ANALYZE despega_pilar_progress;

-- Check explain for problematic query
EXPLAIN ANALYZE SELECT * FROM despega_pilar_progress 
WHERE user_id = '[user-id]';
```

---

### Issue: Data Corruption

**Symptoms**:
- Duplicate missions completed
- Negative points
- cycle_id is NULL
- Inconsistent state

**Emergency Procedure**:
```
1. STOP - Do not attempt manual fixes
2. Escalate to Database Administrator
3. Prepare for rollback:
   - Note exactly what's wrong
   - What time it started
   - How many users affected
   
4. Execute restore from backup:
   Via Supabase Console:
   Settings → Backups → Select backup from before issue
   → Click "Restore"
   
5. ETA: 5-15 minutes downtime
6. Post-incident analysis to prevent repeat
```

---

### Issue: Middleware Redirect Loop

**Symptoms**:
- Page keeps reloading
- Stuck in infinite loading
- "Too many redirects" error

**Diagnosis**:
```bash
# Check middleware logs
tail -f /var/log/vercel/middleware.log

# Look for redirect chains:
# /despega/a1 → /despega/a1/dia-1 → /despega/a1/dia-1 → ...

# Common causes:
# 1. is_a3_unlocked incorrect
# 2. ciclo_dia calculation wrong
# 3. Redirect condition always true
```

**Fix**:
```bash
# Quick fix: Clear browser cache
# User: Cmd+Shift+Delete (Chrome) or Ctrl+Shift+Delete (Firefox)

# Backend fix: Check middleware conditions
vim /lib/supabase/middleware.ts

# Verify conditions:
# - if (currentDay < userDay) → redirect to currentDay
# - if (pilar === 'A2' && is_a2_pilar_complete) → unlock A3
# - Never redirect if destination is current page

# Test fix:
curl -I -H "Cookie: [session-cookie]" \
  https://despega-tu-carrera.vercel.app/despega/a2/dia-1
# Should get 200, not 302 redirect
```

---

### Issue: RPC Transaction Failure

**Symptoms**:
- Mission saved but no points added
- Points added but mission not marked complete
- "Transaction failed" error

**Diagnosis**:
```bash
# Check RPC function syntax
psql despega_prod -c "\df complete_a1_mission_transaction;"

# Check function source
psql despega_prod -c "SELECT prosrc FROM pg_proc 
WHERE proname = 'complete_a1_mission_transaction';"

# Test function manually
psql despega_prod -c "SELECT complete_a1_mission_transaction(
  'user-id'::uuid,
  1,
  'mision-1'
);"
```

**Fix**:
```sql
-- If function missing or corrupted, redeploy:
-- Run migration again:
psql despega_prod < migrations/001-complete-mission-transaction.sql

-- Test it works:
SELECT complete_a1_mission_transaction(
  'test-user-id'::uuid,
  1,
  'test-mission'
);
```

---

## COMMON FIXES QUICK REFERENCE

### Fix #1: Reset User Session
```bash
# User is logged in but sees old data
# Solution: Force logout and back in

# Backend:
DELETE FROM auth.sessions 
WHERE user_id = '[user-id]';

# User will be auto-logged out on next page refresh
```

---

### Fix #2: Recalculate Points
```sql
-- If points seem wrong:
SELECT 
  user_id,
  SUM(puntos) as total_puntos
FROM despega_missione_completadas
GROUP BY user_id;

-- Compare with expected points
-- If mismatch: Check for duplicate entries
SELECT 
  user_id, mision_numero, COUNT(*) as count
FROM despega_missione_completadas
GROUP BY user_id, mision_numero
HAVING COUNT(*) > 1;

-- If duplicates found: Delete duplicates
DELETE FROM despega_missione_completadas
WHERE id NOT IN (
  SELECT MIN(id) FROM despega_missione_completadas
  GROUP BY user_id, mision_numero
);
```

---

### Fix #3: Reset Cycle
```sql
-- If cycle_id is NULL for a user:
UPDATE despega_pilar_progress
SET cycle_id = gen_random_uuid()
WHERE user_id = '[user-id]' AND cycle_id IS NULL;

-- Verify:
SELECT cycle_id FROM despega_pilar_progress
WHERE user_id = '[user-id]';
```

---

### Fix #4: Update Progress Flags
```sql
-- If flags out of sync:
UPDATE despega_pilar_progress
SET 
  is_pilar_complete = false,
  is_a2_pilar_complete = false,
  is_a3_unlocked = false
WHERE user_id = '[user-id]' AND pilar = 'A1';

-- Then recalculate based on missions completed
UPDATE despega_pilar_progress
SET is_pilar_complete = true
WHERE user_id = '[user-id]' 
AND pilar = 'A1'
AND (SELECT COUNT(*) FROM despega_missione_completadas 
     WHERE user_id = despega_pilar_progress.user_id) >= 90;
```

---

## ESCALATION CONTACTS

**Tier 1 Issues** (< 5 min fix):
- Clear cache
- Reset password
- Refresh page
→ Contact: Support Team

**Tier 2 Issues** (< 30 min fix):
- DB connection pool restart
- Slow queries
- Flag corrections
→ Contact: DevOps Engineer

**Tier 3 Issues** (> 30 min or data-critical):
- Data corruption
- RPC function failures
- Rollback needed
→ Contact: Database Administrator + Tech Lead

**Emergency** (Production down):
- Call: Tech Lead + DevOps
- SMS: [On-call number]
- Action: Assess rollback vs. hotfix

---

## MONITORING SETUP

### Alerts to Configure
- [ ] Error rate > 1%
- [ ] Response time > 5s
- [ ] DB connections > 80
- [ ] Disk space > 90%
- [ ] CPU > 80%

### Check Every Shift
```bash
# Health check script
curl https://despega-tu-carrera.vercel.app/health
curl https://api.supabase.io/health

# Check error logs
tail -50 /var/log/vercel/function.log
```

---

## REFERENCE DOCS
- Deployment Runbook: DEPLOYMENT-RUNBOOK.md
- DB Verification: DB-VERIFICATION-REPORT.md
- Architecture: /documentation/ARCHITECTURE.md

---

**Last Updated**: May 22, 2026  
**Document Owner**: Support Lead / DevOps  
**Review Schedule**: Monthly or after incidents
