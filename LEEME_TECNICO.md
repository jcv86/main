# README TÉCNICO - DTC Despega Tu Carrera

**Document:** Technical Setup & Operations  
**Date:** 2026-05-22  
**Version:** 6.0.0  
**Status:** ✅ Production Ready  

---

## Quick Start (5 Minutes)

```bash
# Clone repo
git clone https://github.com/jcv86/main.git
cd main

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development
pnpm dev

# Open browser
open http://localhost:3000
```

---

## Development Setup

### Prerequisites

- **Node.js**: 18.17+ (check with `node --version`)
- **pnpm**: 8.0+ (install: `npm install -g pnpm`)
- **Git**: 2.37+
- **Text Editor**: VS Code recommended

### Environment Variables

**Supabase**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**IA APIs**
```env
ANTHROPIC_API_KEY=sk-ant-xxxx
OPENAI_API_KEY=sk-xxxx
```

**Storage**
```env
VERCEL_BLOB_TOKEN=your-blob-token
```

**Application**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Local Development

### Running Dev Server

```bash
# Start with fast refresh
pnpm dev

# With debugging
pnpm dev --inspect

# Specific port
pnpm dev -p 3001
```

### Code Quality

```bash
# TypeScript check
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format

# All checks
pnpm check-all
```

### Database Setup (Local)

```bash
# Create local Supabase project (using Docker)
# See: https://supabase.com/docs/guides/local-development

# Or use cloud Supabase and run migrations manually
# Migrations are in: scripts/migrations/

# 1. Run RPC migration
# 2. Run Cycle ID migration
# 3. Run Progress Flags migration
```

---

## Project Structure

```
dtc-project/
├─ src/
│  ├─ app/              (Next.js App Router)
│  │  ├─ page.tsx       (Landing)
│  │  ├─ dashboard/     (Main hub)
│  │  ├─ modulos/       (A1-A4 modules)
│  │  ├─ api/           (API routes)
│  │  └─ layout.tsx     (Root layout)
│  ├─ components/       (React components)
│  │  ├─ dashboard/
│  │  ├─ modulos/       (Module-specific)
│  │  ├─ shared/        (Reusable)
│  │  └─ ui/            (shadcn components)
│  ├─ lib/              (Utilities)
│  │  ├─ supabase.ts    (DB client)
│  │  ├─ auth.ts        (Auth helpers)
│  │  ├─ api.ts         (API helpers)
│  │  └─ types.ts       (TypeScript types)
│  ├─ styles/           (Global CSS)
│  └─ hooks/            (React hooks)
├─ scripts/             (Utility scripts)
│  ├─ migrations/       (DB migrations)
│  └─ seed.ts           (Test data)
├─ public/              (Static files)
├─ .env.example         (Environment template)
├─ package.json         (Dependencies)
├─ tsconfig.json        (TypeScript config)
├─ tailwind.config.js   (Tailwind config)
└─ next.config.js       (Next.js config)
```

---

## Database Operations

### Supabase Console

```bash
# Open Supabase dashboard
# URL: https://app.supabase.com/

# Or use CLI
pnpm exec supabase start  # Local
pnpm exec supabase push   # Deploy migrations
```

### SQL Queries

```bash
# Via Supabase console (SQL Editor)
# Or via psql (if local Postgres)

psql "postgresql://user:password@localhost:5432/postgres"
```

### Common Tasks

```sql
-- Check migrations deployed
SELECT * FROM pg_migrations;

-- View user data
SELECT id, email, created_at FROM public.users;

-- Check A2 entries
SELECT * FROM public.a2_daily_entries 
WHERE user_id = 'user-id';

-- View progress flags
SELECT * FROM public.user_progress_flags 
WHERE user_id = 'user-id';
```

---

## API Endpoints

### Authentication

```
POST   /api/auth/login         (Email/password)
POST   /api/auth/signup        (Create account)
POST   /api/auth/logout        (Clear session)
GET    /api/auth/me            (Current user)
POST   /api/auth/refresh       (Refresh token)
```

### Missions (A1)

```
POST   /api/missions/complete  (Complete A1 mission)
GET    /api/missions/status    (Get progress)
```

### Daily (A2)

```
POST   /api/daily/analyze      (Stream daily analysis)
GET    /api/daily/[day]        (Get day info)
```

### IA Coach (A4)

```
POST   /api/ia/coach           (Stream coach response)
GET    /api/ia/history         (Chat history)
```

### Documents (DTC)

```
POST   /api/documents/save     (Save document)
GET    /api/documents/list     (List user docs)
GET    /api/documents/[id]     (Get document)
DELETE /api/documents/[id]     (Delete document)
POST   /api/documents/export   (Export as PDF/TXT)
```

---

## Building for Production

### Production Build

```bash
# Create optimized build
pnpm build

# Test production build locally
pnpm start

# Analysis
pnpm analyze
```

### Build Optimization

- Tree-shaking enabled
- Code splitting per route
- Image optimization
- CSS minification

### Deployment

```bash
# Deploy to Vercel
vercel

# With custom domain
vercel --alias despega-tu-carrera.vercel.app

# View logs
vercel logs

# Monitor builds
vercel status
```

---

## Testing

### Manual Testing

See: [E2E-TESTING-CHECKLIST.md](./E2E-TESTING-CHECKLIST.md)

```bash
# Quick test checklist
# 1. Auth flow (signup, login, logout)
# 2. A1 mission completion
# 3. A2 day navigation
# 4. A3 module progression
# 5. A4 IA coaching
# 6. DTC document save/export
```

### Automated Testing (TODO)

```bash
# E2E tests (Playwright)
pnpm test:e2e

# Unit tests (Vitest)
pnpm test:unit

# Coverage
pnpm test:coverage
```

---

## Debugging

### Client-Side

```typescript
// Add console logs
console.log("[v0] Starting mission...", { userId, missionId })

// Check user context
console.log("[v0] User:", useUser())

// API debugging
fetch('/api/missions/complete', ...)
  .then(r => r.json())
  .then(d => console.log("[v0] Response:", d))
```

### Server-Side

```typescript
// API route debugging
export async function POST(req: Request) {
  console.log("[API] Headers:", req.headers)
  console.log("[API] Body:", await req.json())
  // Process...
}
```

### Database

```sql
-- Check RLS policies
SELECT * FROM information_schema.role_routine_grants 
WHERE routine_name = 'complete_a1_mission_transaction';

-- Monitor connections
SELECT * FROM pg_stat_activity;

-- Check query performance
EXPLAIN ANALYZE 
SELECT * FROM a2_daily_entries 
WHERE user_id = 'xyz';
```

---

## Performance Monitoring

### Development

```bash
# Next.js built-in analytics
# Dashboard shows in terminal during dev

# Browser DevTools
# Chrome: F12 → Performance tab
```

### Production

**Vercel Analytics**
- URL: https://vercel.com/dashboard
- Shows: LCP, FID, CLS (Core Web Vitals)

**Sentry** (ready to connect)
- Setup in `next.config.js`
- Tracks frontend errors

---

## Deployment Checklist

Before going live:

- [ ] All tests passing (E2E + unit)
- [ ] Environment variables configured
- [ ] Database migrations deployed
- [ ] RLS policies verified
- [ ] Backups enabled
- [ ] Monitoring configured
- [ ] Error tracking (Sentry) enabled
- [ ] Performance baseline recorded
- [ ] SSL certificate active
- [ ] CDN caching configured

---

## Troubleshooting

### Build Errors

**Error: "Cannot find module..."**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Error: "TypeScript compilation failed"**
```bash
# Check types
pnpm type-check

# Fix specific file
pnpm tsc --noEmit src/components/Example.tsx
```

### Runtime Errors

**"User not authenticated"**
- Check localStorage has JWT
- Verify NEXT_PUBLIC_SUPABASE_URL
- Check Supabase Auth settings

**"Database connection failed"**
- Verify DATABASE_URL is set
- Check Supabase status
- Test connection pooling

### Database Issues

**Migration didn't apply**
```bash
# Check migration status
pnpm exec supabase migration list

# Retry migration
pnpm exec supabase push --dry-run
```

---

## Resources

- **Docs**: [MVP_PROGRESS_CHECKLIST.md](./MVP_PROGRESS_CHECKLIST.md)
- **Architecture**: [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)
- **Status**: [GIT_AND_DEPLOY_STATUS.md](./GIT_AND_DEPLOY_STATUS.md)
- **Investor**: [INVESTOR_BRIEF.md](./INVESTOR_BRIEF.md)

### External Resources

- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com
- Vercel: https://vercel.com/docs

---

**Document:** README TECHINICAL  
**Updated:** 2026-05-22  
**Status:** ✅ Production Ready

