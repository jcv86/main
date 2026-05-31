# DESPEGA Platform - Production Launch Requirements

## CRITICAL - MUST BE DONE BEFORE LAUNCH

### 1. Vercel Environment Variables (REQUIRED)
Must be set in Vercel project settings:
```
OPENAI_API_KEY=sk-[your-key]
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=[your-key]
```

**How to set**:
1. Go to: https://vercel.com/despega-tu-carrera
2. Project Settings → Environment Variables
3. Add the three variables above
4. Redeploy

**Verification**: Test A3 coaching page - should work without errors

---

### 2. Supabase Configuration (REQUIRED)
- [x] Database created
- [x] Tables initialized
- [x] RLS policies active
- [x] Auth configured

**Verification**: Can log in and see user profile

---

### 3. Security Headers (DONE)
- [x] CORS configured
- [x] Content Security Policy set
- [x] HTTPS enforced

---

### 4. Error Monitoring Setup (RECOMMENDED)
Set up error tracking for production:

**Option A: Sentry (Recommended)**
- Create account at sentry.io
- Add DSN to Vercel env vars: `NEXT_PUBLIC_SENTRY_DSN`
- Configure error reports

**Option B: Vercel Logs**
- Built-in with Vercel
- No setup needed
- Check Function logs in dashboard

---

### 5. Lighthouse Performance Audit
Run before launch:
```bash
npm install -g @lighthouse-ci/cli
lighthouse https://despega-tu-carrera.vercel.app
```

Target scores:
- Performance: 85+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

### 6. Browser Compatibility Testing
Test on:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

### 7. Final Feature Verification
Before launch, test:

**Authentication**
- [ ] Register new user works
- [ ] Login works
- [ ] Logout works
- [ ] Session persists on reload
- [ ] Protected routes redirect to login

**A1 - Despega Cerebral**
- [ ] Assessment loads
- [ ] Questions display correctly
- [ ] Submit button works
- [ ] Results display
- [ ] PDF download works
- [ ] Career recommendations show

**A2 - Tu Ruta**
- [ ] Routes load
- [ ] Can select route
- [ ] Daily tasks display
- [ ] Can mark tasks complete
- [ ] Progress updates
- [ ] Skills show

**A3 - Coaching**
- [ ] Modules load
- [ ] Can access coaching
- [ ] OpenAI generates responses (takes 2-5 seconds)
- [ ] Feedback displays
- [ ] Can complete modules
- [ ] Progress tracked

**A4 - Oportunidades**
- [ ] Job list loads
- [ ] Can search jobs
- [ ] Can filter
- [ ] Job details display
- [ ] Can save favorites
- [ ] Can apply (if integrated)

**Supporting Features**
- [ ] CV upload works
- [ ] Document validation works
- [ ] Salary data loads
- [ ] Profile page loads
- [ ] Settings accessible

---

### 8. Database Backups (REQUIRED)
Ensure Supabase backups are active:
1. Go to Supabase dashboard
2. Database → Backups
3. Verify daily backups enabled
4. Test restore procedure

---

### 9. Monitoring & Alerts (RECOMMENDED)
Set up monitoring:

**Option A: Uptime Monitoring**
- Use: https://uptimerobot.com or similar
- Monitor: https://despega-tu-carrera.vercel.app
- Alert: Email on downtime

**Option B: Vercel Analytics**
- Built-in with Vercel
- Track performance metrics
- Monitor user analytics

---

## PRE-LAUNCH CHECKLIST

- [ ] All env vars set in Vercel
- [ ] Build successful in Vercel
- [ ] All features tested in production
- [ ] No errors in Vercel logs
- [ ] Lighthouse audit score > 85
- [ ] Browser compatibility verified
- [ ] Supabase backups active
- [ ] Error monitoring configured
- [ ] Team notified
- [ ] Ready to announce

---

## LAUNCH PROCEDURE

1. **Final Verification (30 minutes before)**
   - Verify build status: green
   - Test login
   - Test A1 assessment
   - Test A3 coaching
   - Check logs for errors

2. **Go Live**
   - Send announcement to users
   - Monitor logs closely
   - Be available for support

3. **Post-Launch Monitoring (First 24 hours)**
   - Check error logs hourly
   - Monitor performance metrics
   - Watch for user reports
   - Be ready to rollback if needed

4. **Post-Launch Optimization (First week)**
   - Review Lighthouse scores
   - Identify slow queries
   - Monitor error patterns
   - Make performance improvements

---

## ROLLBACK PROCEDURE

If critical issues occur:
1. In Vercel dashboard, go to Deployments
2. Find previous successful build
3. Click "Redeploy"
4. Verify service restored
5. Investigate issue in development

---

## POST-LAUNCH ACTIONS

**Day 1-7**
- Monitor error logs
- Track performance
- Respond to user feedback
- Make critical fixes

**Week 1-2**
- Run Lighthouse audit
- Optimize slow pages
- Implement any quick wins
- Plan larger optimizations

**Ongoing**
- Monitor analytics
- Track error rates
- Update dependencies
- Security patches
- Feature improvements

