# Comprehensive E2E Testing Plan - Production Readiness

## Test Scope
Verify all critical user flows work seamlessly across A1 → A2 → A3 → A4 progression.

## Pre-Test Checklist
- [ ] All 3 migrations deployed and verified
- [ ] Build passing (331 pages, 0 errors)
- [ ] Database backups created
- [ ] Test user account ready

## Test Case 1: Authentication & Onboarding
**User Journey: New User Registration**

Steps:
1. Navigate to /auth/signin
2. Sign up with new email
3. Verify email confirmation
4. Complete A1 onboarding flow
5. Verify despega_user_profiles record created
6. Verify initial cycles created

Expected Results:
- [ ] User account created
- [ ] Profile initialized with correct fields
- [ ] 4 initial cycles created (a1_cerebral, a2_rutas, aterrizaje, base)
- [ ] Redirected to A1 day 1

---

## Test Case 2: A1 Mission Completion & Atomic RPC
**User Journey: Complete A1 Mission (Double-Click Protection)**

Steps:
1. Access A1 day 1
2. Complete a mission
3. Verify points awarded (+25)
4. Double-click the complete button rapidly
5. Verify points NOT doubled (stays at +25)
6. Check database transaction record

Expected Results:
- [ ] Mission marked complete
- [ ] +25 points awarded
- [ ] Double-click: NO additional points (idempotent)
- [ ] Transaction record in despega_missione_completadas
- [ ] Progress percentage updated correctly
- [ ] RPC executed without error

---

## Test Case 3: Cycle ID Management & History Preservation
**User Journey: Complete Cycle & Start New Cycle**

Steps:
1. Complete A1 cycle (all days)
2. Verify cycle_id in pilar_progress
3. Check data preservation for cycle 1
4. Trigger new cycle
5. Verify new cycle_id (UUID)
6. Verify cycle 1 data still accessible

Expected Results:
- [ ] Cycle 1 completed with status 'complete'
- [ ] All missions for cycle 1 preserved
- [ ] New cycle 2 started with new UUID
- [ ] Unique constraint: (user_id, pilar, cycle_id) enforced
- [ ] Can retrieve history of all cycles
- [ ] Progress bar reset for cycle 2

---

## Test Case 4: Smart Middleware Redirects - A2 Day Protection
**User Journey: Prevent Future Day Access**

Steps:
1. Complete A1, unlock A2
2. Try to access /despega/a2/dia-5 (future day)
3. System should redirect to /despega/a2/dia-1 (current day)
4. Complete days 1-4
5. Try to access /despega/a2/dia-5 again
6. Should now ALLOW access to dia-5

Expected Results:
- [ ] Redirected from dia-5 to dia-1 when unauthorized
- [ ] Once current day advances, dia-5 becomes accessible
- [ ] User can review previous days (dia-1, dia-2, etc.)
- [ ] No infinite redirect loops
- [ ] Redirect happens silently (no error pages)

---

## Test Case 5: A2 → A3 Transition
**User Journey: Complete A2 and Unlock A3**

Steps:
1. Complete all 90 days of A2
2. Verify is_a2_pilar_complete = true
3. Verify is_a3_unlocked = true
4. Try to access /despega/a2/dia-1
5. System should redirect to /despega/a3

Expected Results:
- [ ] is_a2_pilar_complete flag set to true
- [ ] is_a3_unlocked flag set to true
- [ ] A2 page redirects to A3 dashboard
- [ ] A3 modules visible and accessible
- [ ] A3 progress initialized

---

## Test Case 6: A4 Context Coach API
**User Journey: Use A4 Chat Coach**

Steps:
1. Access /despega/a4/contexto
2. Verify A4ContextCoach component loads
3. Send a message to coach
4. Wait for streaming response
5. Verify message displays correctly
6. Send follow-up questions

Expected Results:
- [ ] Page loads without auth errors
- [ ] Chat interface renders
- [ ] API calls succeed (200 status)
- [ ] Streaming responses work smoothly
- [ ] Messages persist in conversation
- [ ] Error handling works for API failures

---

## Test Case 7: Database Transaction Atomicity
**User Journey: Verify All Transactions are Atomic**

Steps:
1. Complete missions in rapid succession
2. Stop midway through a mission completion
3. Check database state
4. Complete the mission again
5. Verify no duplicate entries

Expected Results:
- [ ] Interrupted transaction: NO partial updates
- [ ] Either fully committed or fully rolled back
- [ ] Retry works without duplication
- [ ] Data consistency maintained
- [ ] No orphaned records

---

## Test Case 8: Progress Flags Consistency
**User Journey: Verify Progress Flags Stay Synchronized**

Steps:
1. Complete A1 pilar
2. Check is_pilar_complete = true
3. Complete A2 pilar
4. Check is_a2_pilar_complete = true
5. Navigate between modules
6. Verify flags consistent on refresh

Expected Results:
- [ ] Flags update on mission completion
- [ ] Flags remain correct across page refresh
- [ ] Navigation respects flag state
- [ ] No stale flag data
- [ ] Flags synchronized with actual progress

---

## Test Case 9: Load & Performance
**User Journey: Monitor Performance Under Load**

Steps:
1. Load A2 dashboard with 90 days of data
2. Measure page load time
3. Complete multiple missions quickly
4. Monitor API response times
5. Check for memory leaks

Expected Results:
- [ ] A2 dashboard < 2 seconds load
- [ ] API responses < 500ms
- [ ] No memory leaks after 50 operations
- [ ] UI remains responsive
- [ ] No database connection exhaustion

---

## Test Case 10: Error Recovery
**User Journey: Verify Graceful Error Handling**

Steps:
1. Disconnect from database mid-operation
2. Attempt mission completion
3. Verify error message displayed
4. Reconnect and retry
5. Verify transaction succeeds

Expected Results:
- [ ] Clear error messages shown to user
- [ ] Retry mechanism works
- [ ] No silent failures
- [ ] Transaction completes on retry
- [ ] No data corruption from errors

---

## Test Results Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1. Auth & Onboarding | [ ] PASS | |
| 2. Mission Completion RPC | [ ] PASS | |
| 3. Cycle Management | [ ] PASS | |
| 4. Middleware Redirects | [ ] PASS | |
| 5. A2→A3 Transition | [ ] PASS | |
| 6. A4 Coach API | [ ] PASS | |
| 7. Transaction Atomicity | [ ] PASS | |
| 8. Progress Flags | [ ] PASS | |
| 9. Performance | [ ] PASS | |
| 10. Error Recovery | [ ] PASS | |

---

## Production Deployment Checklist

Once all tests pass:

- [ ] Database backups verified
- [ ] All migrations tested in production schema
- [ ] Error monitoring configured
- [ ] Analytics setup complete
- [ ] Rollback plan documented
- [ ] Team trained on support procedures
- [ ] Documentation updated
- [ ] Status page created
- [ ] Communication sent to users
- [ ] Monitor for 24 hours post-launch

---

## Critical Failure Criteria

Deployment blocked if ANY of these fail:
- ❌ RPC idempotency check fails (double-click duplication)
- ❌ Atomic transaction rollback fails
- ❌ Cycle ID collision occurs
- ❌ Middleware causes infinite redirects
- ❌ A2→A3 transition fails
- ❌ Database corrupts on error

---

## Success Criteria

Production launch approved when:
- ✅ All 10 test cases PASS
- ✅ No critical failures
- ✅ Performance benchmarks met
- ✅ Error recovery tested
- ✅ Database verified healthy
- ✅ Load testing successful
- ✅ Team confident in deployment

---

## Timeline

- Phase 1: Manual testing (30 min)
- Phase 2: Automated testing (30 min)
- Phase 3: Production deployment (30 min)
- Phase 4: Post-launch monitoring (24 hours)

**Total time to production: ~2 hours**
