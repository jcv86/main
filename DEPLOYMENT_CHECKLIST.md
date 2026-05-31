# Deployment Checklist - Despega Platform

## Pre-Deployment Requirements

### Environment Variables
- [ ] OPENAI_API_KEY configured in Vercel
- [ ] SUPABASE_URL set correctly
- [ ] SUPABASE_ANON_KEY configured
- [ ] SUPABASE_SERVICE_ROLE_KEY set (for server operations)
- [ ] NEXT_PUBLIC_APP_URL matches deployment domain

### Database
- [ ] Run migrations for new tables (a4_job_matches, a3_coaching_feedback, etc.)
- [ ] Set up Row Level Security (RLS) policies
- [ ] Configure indexes on frequently queried columns
- [ ] Test RLS policies with demo and real users
- [ ] Backup production database

### Authentication
- [ ] Test demo user flow (cookie persistence)
- [ ] Verify Supabase auth session handling
- [ ] Test logout and re-login
- [ ] Verify password reset flow
- [ ] Test phone number auth if used

### API Routes
- [ ] Verify all auth middleware working
- [ ] Test error handling and graceful degradation
- [ ] Check rate limiting is configured
- [ ] Verify CORS headers are correct
- [ ] Test demo user handling in all routes

### Performance
- [ ] Run Lighthouse audit (target: >80)
- [ ] Profile API response times
- [ ] Verify caching is working
- [ ] Check database query performance
- [ ] Test with slow 3G network

### Security
- [ ] Remove console.log debugging statements
- [ ] Verify sensitive data is not logged
- [ ] Check HTTPS is enforced
- [ ] Verify CORS is restrictive
- [ ] Test XSS/CSRF protections

### Features to Verify
- [ ] A1 DISC assessment saves and retrieves correctly
- [ ] A2 route recommendation generates based on A1
- [ ] A3 coaching feedback generates from OpenAI
- [ ] A4 job matching runs on A1 completion
- [ ] Job notifications appear in-app
- [ ] CV ATS validator (if deployed)
- [ ] All forms validate inputs
- [ ] Error states show appropriate messages

### Mobile & Responsiveness
- [ ] Test on iPhone/Android
- [ ] Verify touch interactions work
- [ ] Check responsive layouts
- [ ] Test viewport scaling
- [ ] Verify no horizontal scroll

### Documentation
- [ ] Update README with current features
- [ ] Document API endpoints
- [ ] Add troubleshooting guide
- [ ] Document environment variables needed
- [ ] Add changelog entry

## Staging Deployment Steps

```bash
# 1. Build locally and test
npm run build
npm run dev

# 2. Deploy to Vercel staging
vercel deploy --name despega-staging

# 3. Run smoke tests
npm run test:smoke

# 4. Check staging environment
- Visit https://despega-staging.vercel.app
- Test full user journey
- Check performance metrics

# 5. Get approval before production
```

## Production Deployment Steps

```bash
# 1. Tag release
git tag v1.0.0
git push origin v1.0.0

# 2. Deploy to production
vercel --prod

# 3. Monitor for errors
- Check Sentry/error logs
- Monitor API response times
- Check user feedback

# 4. Post-deployment
- Announce feature updates
- Update status page
- Notify support team
```

## Post-Deployment

- [ ] Monitor error rates for 24 hours
- [ ] Check database query performance
- [ ] Verify cache hit rates
- [ ] Monitor API rate limits
- [ ] Gather user feedback
- [ ] Plan next sprint

## Rollback Plan

If critical issues found:
```bash
# Rollback to previous deployment
vercel rollback

# OR revert code
git revert <commit-hash>
git push
vercel --prod
```

## Known Limitations (Current MVP)

- Job data is seeded, not real-time from LinkedIn/Indeed
- CV ATS validation is not yet integrated
- A2 personalization is smart but not AI-driven
- No SMS notifications (in-app only)
- No push notifications on mobile

## Next Iteration

1. Real job data integration (LinkedIn/Indeed API)
2. AI-driven interview prep
3. Mobile app with push notifications
4. Salary benchmarking
5. Company culture insights
