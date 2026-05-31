# QUICK START IMPLEMENTATION CHECKLIST

**Print this page. Use it to track progress.**

---

## WEEK 1: SECURITY & CI/CD GATES (4 hours)

### Task 1.1: Add Security Headers (30 min)
- [ ] Open `vercel.json`
- [ ] Add security headers array:
  - [ ] Content-Security-Policy
  - [ ] X-Content-Type-Options
  - [ ] X-Frame-Options
  - [ ] X-XSS-Protection
  - [ ] Referrer-Policy
  - [ ] Permissions-Policy
- [ ] Test headers with: `curl -i https://staging... | grep -E "Content-Security|X-Frame"`
- [ ] Commit: `git commit -m "security: add HTTP security headers"`
- ✅ **DONE?** Headers show in curl response

### Task 1.2: Create GitHub Actions CI/CD Workflow (2 hours)
- [ ] Create folder: `.github/workflows/`
- [ ] Create file: `ci-cd.yml`
- [ ] Copy workflow from DEPLOYMENT_READINESS_PLAN.md Task 1.3
- [ ] Add secrets to GitHub:
  - [ ] VERCEL_TOKEN
  - [ ] VERCEL_ORG_ID
  - [ ] VERCEL_PROJECT_ID
- [ ] Test: Push to feature branch, watch GitHub Actions run
- [ ] Commit: `git commit -m "ci: add GitHub Actions CI/CD pipeline"`
- ✅ **DONE?** GitHub Actions tab shows green checkmarks on PR

### Task 1.3: Fix Broken Contact Link (30 min)
- [ ] Find where contact link is (likely `components/footer.tsx`)
- [ ] Replace: `<a href="/cdn-cgi/l/email-protection">...`
- [ ] With: `<a href="/contacto">Formulario de Contacto</a>`
  - OR: `<a href="mailto:support@despegatucarrera.com">Email</a>`
- [ ] Test link manually - should NOT return 404
- [ ] Commit: `git commit -m "fix: remove broken email obfuscation link"`
- ✅ **DONE?** Link works when clicked

### Task 1.4: Document Release Gates (1 hour)
- [ ] Create file: `RELEASE_GATES.md` (see DEPLOYMENT_READINESS_PLAN.md for template)
- [ ] List all gates that must pass before release
- [ ] Commit: `git commit -m "docs: define release gates for production"`
- ✅ **DONE?** File exists and lists all gates

---

## WEEK 2: CONNECTOR TESTING (4 hours)

### Task 2.1: Create E2E Tests for Pillar Flow (3 hours)
- [ ] Install Playwright: `pnpm add -D @playwright/test`
- [ ] Create: `e2e/pillar-connectors.spec.ts`
- [ ] Write test cases:
  - [ ] C1 → A1 unlock
  - [ ] A1 → C2 unlock
  - [ ] C2 → A2 unlock
  - [ ] A2 → A3 unlock
  - [ ] A3 → A4 unlock
  - [ ] All API endpoints return correct status
- [ ] Run tests: `npx playwright test`
- [ ] Fix any failures
- [ ] Commit: `git commit -m "test: add end-to-end connector tests for pillar flow"`
- ✅ **DONE?** All tests pass locally

### Task 2.2: Run Connector Tests on Staging (1 hour)
- [ ] Deploy to staging: `git push origin staging`
- [ ] Wait for staging deployment
- [ ] Run tests against staging: `npx playwright test --base-url=https://staging...`
- [ ] Fix any staging failures
- [ ] Document any issues found
- ✅ **DONE?** All tests pass on staging environment

---

## WEEK 3: MONITORING & ROLLBACK (6+ hours)

### Task 3.1: Setup Uptime Monitoring (2 hours)
- [ ] Choose tool: Vercel Monitoring OR Uptime Robot
- [ ] Configure checks for:
  - [ ] `GET /` → 200
  - [ ] `GET /auth/signin` → 200
  - [ ] `GET /despega/conozcamonos-1` → 200 or 302 (redirect)
  - [ ] `POST /api/a1/audit` → 200 or 401
  - [ ] `POST /api/a2/daily-task` → 200 or 401
  - [ ] `POST /api/a3/session` → 200 or 401
  - [ ] `POST /api/a4/analyze` → 200 or 401
- [ ] Set alert: Slack webhook on failure
- [ ] Test: Temporarily break an endpoint, verify alert fires
- ✅ **DONE?** Slack gets notified when endpoint fails

### Task 3.2: Create Post-Deploy Verification Script (2 hours)
- [ ] Create: `scripts/post-deploy-verification.ts`
- [ ] Copy from DEPLOYMENT_READINESS_PLAN.md Task 6.1
- [ ] Test locally: `tsx scripts/post-deploy-verification.ts`
- [ ] Add to CI/CD workflow to run after prod deploy
- [ ] Commit: `git commit -m "scripts: add post-deployment verification"`
- ✅ **DONE?** Script runs successfully and catches 404s

### Task 3.3: Setup One-Click Rollback (2 hours)
- [ ] Create: `.github/workflows/rollback.yml`
- [ ] Copy from DEPLOYMENT_READINESS_PLAN.md Task 6.1
- [ ] Test rollback procedure on staging:
  - [ ] Deploy v1
  - [ ] Deploy v2
  - [ ] Trigger rollback
  - [ ] Verify v1 is live again
- [ ] Document rollback button location
- [ ] Document how to use it (GitHub Actions → Workflows → Rollback → Run)
- [ ] Commit: `git commit -m "ci: add automated rollback capability"`
- ✅ **DONE?** Rollback works end-to-end

---

## PRE-PRODUCTION CHECKLIST

### Before First Production Deploy

#### Security
- [ ] All 6 security headers present (verify with curl)
- [ ] No debug endpoints enabled (`/api/dev/seed` disabled in prod)
- [ ] No secrets in code (grep for API_KEY, SECRET)
- [ ] HTTPS enforced (vercel.json has redirects)

#### Quality
- [ ] All GitHub Actions pass (lint, typecheck, build, tests)
- [ ] No TypeScript errors locally
- [ ] No console errors in staging
- [ ] Error rate < 1% in staging

#### Functionality
- [ ] E2E tests all pass
- [ ] C1→A1→C2→A2→A3→A4 flow works manually
- [ ] Gated pages redirect unauthenticated users
- [ ] All API endpoints respond correctly

#### SEO/Performance
- [ ] Sitemap has no broken URLs (test each link)
- [ ] Canonical tag on homepage: `https://www.despegatucarrera.com`
- [ ] OG tags complete: og:title, og:description, og:image
- [ ] Page load < 3s on 4G (check with Vercel Speed Insights)

#### Observability
- [ ] Uptime monitoring configured
- [ ] Error alerts working (test by breaking something on staging)
- [ ] Post-deploy verification script tested
- [ ] Rollback procedure tested

#### Data
- [ ] Database backup created and tested
- [ ] Restore procedure documented and tested
- [ ] Migration script reviewed

#### Team
- [ ] Incident response team briefed
- [ ] Runbook shared with team
- [ ] On-call schedule defined
- [ ] Escalation path clear

---

## PRODUCTION RELEASE DAY

### Morning Of (2 hours before)
- [ ] Verify all checklist items above complete
- [ ] Create database backup
- [ ] Test backup restore on dev
- [ ] Brief incident response team

### Release (30 minutes)
- [ ] Create git tag: `git tag -a v5.1.0 -m "Release: Production-grade deployment"`
- [ ] Push tag: `git push origin v5.1.0`
- [ ] Watch GitHub Actions deploy to production
- [ ] Watch post-deploy verification run
- [ ] Monitor error logs for first 5 minutes

### First Hour (60 minutes)
- [ ] Monitor error rate (should be ~0%)
- [ ] Monitor page load time (should be < 3s)
- [ ] Test homepage, auth flow, pillar progression manually
- [ ] Check Slack for any alerts
- [ ] Monitor uptime checks (all should be green)

### First 24 Hours
- [ ] Keep monitoring dashboard open
- [ ] Check error logs hourly
- [ ] Verify users can complete flow
- [ ] Monitor database performance
- [ ] Have team on standby for quick rollback if needed

### Post-Release
- [ ] After 24 hours: Declare release successful
- [ ] Create incident post-mortem (even if no issues)
- [ ] Document any lessons learned
- [ ] Schedule retro with team

---

## IF SOMETHING BREAKS

### Step 1: Assess Severity
- [ ] Homepage broken? → Severity 1 (rollback immediately)
- [ ] Some users affected? → Severity 2 (assess before rollback)
- [ ] Background job failing? → Severity 3 (can wait, fix in next deploy)

### Step 2: Rollback Decision
- [ ] Error rate > 5%? → Rollback immediately
- [ ] Page load > 5s? → Rollback immediately
- [ ] API failing? → Rollback immediately
- [ ] Connector broken? → Rollback immediately
- [ ] Monitoring offline? → This is OK, investigate

### Step 3: Execute Rollback
- [ ] Go to: GitHub Actions → Workflows → Rollback Production
- [ ] Click: Run Workflow
- [ ] Wait: ~2-3 minutes for rollback to complete
- [ ] Verify: Previous version is now live
- [ ] Notify: #incidents Slack channel

### Step 4: Investigate & Fix
- [ ] Pull logs from broken deployment
- [ ] Identify root cause
- [ ] Fix in code
- [ ] Test on staging
- [ ] Re-deploy to production
- [ ] Post-mortem: What went wrong, how to prevent

---

## KEY CONTACTS & DOCS

- **Implementation Plan:** DEPLOYMENT_READINESS_PLAN.md
- **Current State Audit:** DEPLOYMENT_AUDIT.md
- **Executive Summary:** EXECUTIVE_SUMMARY_DEPLOYMENT.md
- **Release Gates:** RELEASE_GATES.md
- **Runbook:** This document

---

## TRACKING

| Week | Task | Status | Owner | Date |
|------|------|--------|-------|------|
| 1 | Security Headers | ❌ | ___ | ____ |
| 1 | GitHub Actions CI/CD | ❌ | ___ | ____ |
| 1 | Fix Broken Link | ❌ | ___ | ____ |
| 1 | Release Gates Doc | ❌ | ___ | ____ |
| 2 | E2E Tests | ❌ | ___ | ____ |
| 2 | Staging Test Run | ❌ | ___ | ____ |
| 3 | Uptime Monitoring | ❌ | ___ | ____ |
| 3 | Post-Deploy Verify | ❌ | ___ | ____ |
| 3 | One-Click Rollback | ❌ | ___ | ____ |
| — | Production Ready | ❌ | ___ | ____ |

---

**Last Updated:** May 26, 2026  
**Status:** Ready to implement  
**Next Milestone:** Complete Week 1 by May 31  

📋 **PRINT THIS PAGE AND CHECK BOXES AS YOU GO** 📋
