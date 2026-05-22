# DOWNLOAD AND USE - Setup Instructions

**For**: Investors, Partners, Technical Teams  
**Date**: 2026-05-22  
**Status**: ✅ Ready to Deploy  

---

## Option 1: Clone from GitHub (RECOMMENDED)

### For Developers

```bash
# Clone repository
git clone https://github.com/jcv86/main.git
cd main

# Checkout production branch
git checkout v0/jcv86-4cea421a

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local

# Add your API keys to .env.local
# (See .env.example for all variables)

# Run development server
pnpm dev

# Open http://localhost:3000
```

### For Non-Technical Users

1. Download code from: https://github.com/jcv86/main/releases
2. Extract ZIP file
3. Follow Developer setup above

---

## Option 2: Deploy Direct to Vercel (FASTEST)

### One-Click Deploy

```bash
# Fork on GitHub, then click:
# https://vercel.com/import

# Or use CLI:
vercel
```

### What You Need

- GitHub account
- Vercel account (free tier OK)
- Supabase account (free tier OK)
- API keys (see .env.example)

### Steps

1. **Create Supabase Project**
   - Go to: https://supabase.com/dashboard
   - Create new project
   - Copy URL and API key to .env

2. **Add API Keys**
   - Create Vercel Blob token
   - Create Anthropic API key
   - Create OpenAI API key (optional)

3. **Deploy**
   ```bash
   vercel
   ```

4. **Visit**
   - https://despega-tu-carrera.vercel.app

---

## Environment Setup

### Required Variables (.env.local)

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# IA APIs (REQUIRED for features)
ANTHROPIC_API_KEY=sk-ant-xxxx
OPENAI_API_KEY=sk-xxxx

# Storage (REQUIRED for file uploads)
VERCEL_BLOB_TOKEN=your-blob-token

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Optional Variables

```env
# Logging
LOG_LEVEL=info

# Debug mode
DEBUG=dtc:*

# Custom domain
VERCEL_URL=your-domain.com
```

See [.env.example](./.env.example) for complete list.

---

## Database Setup

### Automatic (Recommended)

```bash
# Vercel deploys migrations automatically
# No manual action needed
```

### Manual

```bash
# 1. Login to Supabase Console
# https://app.supabase.com/

# 2. Go to SQL Editor

# 3. Run migration files (in order):
# scripts/migrations/001-rpc-mission.sql
# scripts/migrations/002-cycle-id.sql
# scripts/migrations/003-progress-flags.sql

# Or use CLI:
pnpm exec supabase db push
```

---

## Running Locally

### Development

```bash
# Terminal 1: Dev Server
pnpm dev

# Terminal 2: Monitor (optional)
pnpm dev:inspect

# Open http://localhost:3000
```

### Testing

```bash
# Test auth flow
# Create account → Login → Access dashboard

# Test A1 module
# Complete vision scan → See roadmap

# Test A2 module
# Complete day 1-5 → Check progress

# Test A4 module
# Send message to IA Coach → See response
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Or deploy to Vercel (recommended)
vercel --prod
```

---

## First Time Setup Walkthrough

### 1. Prepare (5 min)

- [ ] GitHub account created
- [ ] Vercel account created
- [ ] Supabase account created
- [ ] API keys ready (see below)

### 2. Create API Keys

**Supabase**
- Go to: https://supabase.com/dashboard
- Create project → get API key and URL

**Anthropic**
- Go to: https://console.anthropic.com
- Create API key

**OpenAI** (optional)
- Go to: https://platform.openai.com/api/keys
- Create API key

**Vercel Blob** (optional, for file uploads)
- Go to Vercel dashboard → Storage → Blob
- Create connection → get token

### 3. Clone & Setup (10 min)

```bash
git clone https://github.com/jcv86/main.git
cd main
pnpm install
cp .env.example .env.local

# Add API keys to .env.local
nano .env.local  # or your editor

pnpm dev
# Opens http://localhost:3000
```

### 4. Create Test Account (5 min)

- Go to Sign Up
- Create account with email
- Login with credentials
- Explore dashboard

### 5. Test Modules (15 min)

- [ ] Try A1 (Cerebro Ejecutivo)
- [ ] Try A2 (90 Días)
- [ ] Try A3 (Renovación)
- [ ] Try A4 (Plan B Coach)
- [ ] Check DTC Documents

### 6. Deploy (10 min)

```bash
vercel
# Follows interactive setup
# Deploys to https://your-project.vercel.app
```

**Total Time**: ~1 hour for complete setup

---

## Customization

### Change Branding

```typescript
// src/lib/config.ts
export const APP_NAME = "My Company Platform"
export const APP_DESCRIPTION = "Custom description"
export const BRAND_COLOR = "#FF6B35"
```

### Modify Copy (Text)

```typescript
// src/lib/content.ts
export const MODULES = {
  A1: { title: "Custom A1 Title", ... },
  A2: { title: "Custom A2 Title", ... },
  // etc
}
```

### Add Custom Modules

```typescript
// 1. Create: src/app/modulos/a5/page.tsx
// 2. Add route: app router recognizes automatically
// 3. Add navigation: Update sidebar.tsx
// 4. Add to DB: migrations/004-add-a5-module.sql
```

---

## Deployment Options

### Vercel (Recommended)

```bash
vercel --prod
```

**Pros**:
- Auto-scaling
- Global CDN
- Git integration
- Free tier available

**Cost**: Free → $20/month at scale

### Docker

```bash
docker build -t dtc .
docker run -p 3000:3000 dtc
```

**Pros**:
- Run anywhere
- Full control
- Self-hosted

**Cost**: Infrastructure dependent

### AWS / Google Cloud

Requires more setup. Contact team for guidance.

---

## Monitoring & Support

### Check Health

```bash
# API health check
curl https://your-domain.com/api/health

# Database connection
psql $DATABASE_URL -c "SELECT 1"

# Logs
vercel logs

# Analytics
vercel analytics
```

### Troubleshooting

See: [TROUBLESHOOTING-GUIDE.md](./TROUBLESHOOTING-GUIDE.md)

### Get Help

- Docs: [README_TECHINICAL.md](./README_TECHINICAL.md)
- Architecture: [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)
- Status: [MVP_PROGRESS_CHECKLIST.md](./MVP_PROGRESS_CHECKLIST.md)

---

## Next Steps

1. **Setup** (1 hour) - Follow walkthrough above
2. **Explore** (1 hour) - Try all 4 modules
3. **Test** (30 min) - Run E2E tests
4. **Deploy** (30 min) - Go live to Vercel
5. **Monitor** (ongoing) - Watch analytics

---

## Package Contents

```
/
├─ src/ (All application code)
├─ scripts/ (Setup, migrations, seeds)
├─ docs/ (All documentation)
├─ public/ (Static files)
├─ .env.example (Configuration template)
├─ package.json (Dependencies)
├─ README.md (Quick start)
└─ [All other documentation files]

Size: ~200 MB (with node_modules)
Deploy Time: ~5 minutes
```

---

## Support

- **Documentation**: See docs/ folder
- **Issues**: GitHub Issues
- **Email**: [Your team contact]

---

**Document**: Download and Use  
**Updated**: 2026-05-22  
**Status**: ✅ Ready

