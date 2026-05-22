# SQL Migration Guide - Gamification System

## Overview
The gamification system requires two SQL migration files to be executed in your Supabase database. Unfortunately, the Supabase SDK doesn't support direct SQL execution from Node.js, so you'll need to execute these manually via the Supabase dashboard.

## How to Execute

### Step 1: Open Supabase SQL Editor
1. Go to your project at https://supabase.com
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run First Migration (Gamification Schema)
1. Open the file: `/scripts/01-gamification-schema.sql`
2. Copy all the SQL content
3. Paste it into the Supabase SQL Editor query box
4. Click "Run" button (or press Cmd+Enter / Ctrl+Enter)

**What this creates:**
- `user_dtc_balance` - User's DTC point balance
- `dtc_transactions` - All DTC transactions (earn/spend/purchase)
- `interview_tips_usage` - Free and premium tip tracking
- `interview_session_gamification` - Interview session data
- `user_gamification_profile` - User's level, XP, badges, achievements
- `dtc_purchases` - Stripe purchase history
- Enhanced `a3_preguntas_entrevista` table with gamification metadata

### Step 3: Run Second Migration (Interview Questions)
1. Open the file: `/scripts/02-enhanced-interview-questions.sql`
2. Copy all the SQL content
3. Paste it into a new Supabase SQL Editor query
4. Click "Run" button

**What this does:**
- Adds 10 comprehensive interview questions per difficulty level
- Sets up question metadata for AI tips generation
- Populates coaching context and guidance for each question

### Step 4: Verify Tables Created
After both migrations complete successfully:
1. Go to the "Table Editor" in Supabase left sidebar
2. You should see these new tables:
   - user_dtc_balance
   - dtc_transactions
   - interview_tips_usage
   - interview_session_gamification
   - user_gamification_profile
   - dtc_purchases

## Troubleshooting

**Error: "relation... does not exist"**
- This usually means the `users` table or `a3_preguntas_entrevista` table doesn't exist
- Run existing migrations first before these gamification migrations
- Check that you're in the correct Supabase project

**Error: "Column already exists"**
- This means you've already run the migration successfully
- You can ignore this error or use `IF NOT EXISTS` clauses (already in our SQL)

**Error: "Permission denied"**
- Make sure you're using a role with sufficient permissions
- Try using the default authenticator role (usually has full access in Supabase)

## Next Steps After Migration

1. **Build & Deploy**: Run `pnpm build` and `pnpm deploy`
2. **Configure Stripe** (Optional): Add Stripe API keys for DTC purchases
3. **Test**: Complete an interview to verify gamification works
4. **Monitor**: Check Supabase logs for any runtime errors

## File Locations

- First migration: `scripts/01-gamification-schema.sql`
- Second migration: `scripts/02-enhanced-interview-questions.sql`

## Manual SQL Content

If you prefer, you can also paste the SQL content directly below:

### Migration 1: Gamification Schema

See file: `/scripts/01-gamification-schema.sql`

### Migration 2: Enhanced Interview Questions

See file: `/scripts/02-enhanced-interview-questions.sql`
