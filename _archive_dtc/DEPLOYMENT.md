# A4 Dashboard - Deployment & Testing Guide

## Overview
The A4 Dashboard is a comprehensive learning platform with strategic analysis, news curation, gamification, and administrative controls.

## Prerequisites

### Environment Variables Required
```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
AUTH0_ID=your_auth0_id
AUTH0_SECRET=your_auth0_secret

# Admin Access
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,admin2@example.com
```

## Database Setup

### 1. Run Migrations
```bash
# Execute in order:
# 1. Core tables
psql -f scripts/01-a4-core-tables.sql

# 2. Engagement tables
psql -f scripts/02-a4-engagement-tables.sql

# 3. RLS Policies
psql -f scripts/03-a4-rls-policies.sql

# 4. Seed data
psql -f scripts/04-a4-seed-data.sql
```

Or use Supabase CLI:
```bash
supabase migration up
```

### 2. Verify Tables
```sql
\dt a4_*
\dt a1_*
\dt biblioteca
```

## Application Structure

### Main Routes
- `/a4-dashboard` - User-facing dashboard (7 tabs)
- `/admin` - Admin dashboard (protected by email)
- `/auth/login` - Authentication

### Components
- **Dashboard Tabs:**
  - Radar Estratégico - Strategic analysis with 7 layers
  - Noticias Feed - News with engagement tracking
  - Gamified Tests - Interactive quizzes
  - Pruebas (Cases) - Real-world case studies
  - Biblioteca - Curated resources
  - Mi Progreso - Engagement tracking
  - Insignias - Points and badges

- **Admin Dashboard:**
  - Analytics - Platform metrics
  - Users - User management
  - Tesis - Daily thesis management
  - Noticias - News curation
  - Tests - Quiz management
  - Biblioteca - Resource verification

### Data Models
- Points & Badges System (10 badge types, point rewards)
- User Engagement Tracking (articles, tests, resources)
- Personalization (DISC profiles, custom feeds)
- Leaderboard (ranking system)

## Testing Checklist

### User Features
- [ ] Login/Authentication works
- [ ] Radar Estratégico loads with current data
- [ ] News feed displays with search/filter
- [ ] Gamified tests function correctly
- [ ] Case studies display and mark as complete
- [ ] Biblioteca resources load and can be saved
- [ ] Points are awarded for actions
- [ ] Badges appear when earned
- [ ] Engagement dashboard updates in real-time
- [ ] DISC profile displays personalization

### Admin Features
- [ ] Admin login restricted to allowed emails
- [ ] Analytics dashboard loads metrics
- [ ] Can create/edit tesis
- [ ] Can manage noticias
- [ ] Can create/edit tests
- [ ] Can verify biblioteca resources
- [ ] Can view users and their progress

### Data Integrity
- [ ] RLS policies prevent unauthorized access
- [ ] User-specific data is isolated
- [ ] Public content is readable by all
- [ ] Points calculations are accurate
- [ ] Badge awards are unique per user

### Performance
- [ ] Dashboard loads in < 2 seconds
- [ ] Search completes in < 500ms
- [ ] Pagination works smoothly
- [ ] Images lazy-load properly
- [ ] Mobile responsive on all breakpoints

## Local Development

### Start Dev Server
```bash
npm run dev
# or
yarn dev
```

### Test Database
1. Create test user in Supabase
2. Test engagement tracking:
   - Read articles → +1 point
   - Share articles → +2 points
   - Complete tests → +5-10 points
   - Save resources → +1 point

### Debug Console Logs
Check for debug messages with `[v0]` prefix to trace issues.

## Deployment Steps

### 1. Vercel Deployment
```bash
# Connect GitHub repo to Vercel
# Add environment variables in Vercel dashboard
# Deploy with: vercel deploy --prod
```

### 2. Database Setup on Vercel
- Ensure Supabase is configured
- Run migrations on production
- Seed initial data

### 3. Post-Deployment Tests
- [ ] Test all pages load
- [ ] Authentication works
- [ ] Admin access restricted
- [ ] Database queries execute
- [ ] Points system functions
- [ ] No console errors

## Monitoring

### Key Metrics to Track
- Daily Active Users (DAU)
- Articles read per user
- Test completion rate
- Badge earn distribution
- Points per user
- Engagement funnel

### Admin Analytics View
Dashboard shows:
- User statistics
- Content engagement charts
- Badge distribution
- Weekly points trends

## Troubleshooting

### Common Issues

**Database Connection Error**
```
Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
Verify VPN/firewall isn't blocking database
```

**Authentication Fails**
```
Verify NEXTAUTH_SECRET is set
Check NEXTAUTH_URL matches deployment URL
Confirm Auth0/provider credentials
```

**Admin Dashboard Inaccessible**
```
Verify email in NEXT_PUBLIC_ADMIN_EMAILS
Check user is logged in
Verify auth session is valid
```

**Points Not Updating**
```
Check engagement tracking logs
Verify RLS policies allow INSERT
Check user_id is being passed correctly
```

## API Integration Notes

The system uses:
- `next-auth` for authentication
- Supabase client for database
- Server-side queries in RSCs
- Client-side SWR for real-time data

Key queries use proper error handling with try-catch and console logging.

## Next Steps for Enhancement

1. Email notifications for badges
2. Real-time leaderboard updates
3. Advanced analytics export
4. API endpoints for third-party integration
5. Mobile app version
6. Webhooks for external events
7. Advanced recommendation engine
8. Integration with external content sources

## Support & Documentation

- Check console logs for debug information
- Review database schema in scripts/
- Component documentation in component files
- Query documentation in lib/supabase/a4-queries.ts
