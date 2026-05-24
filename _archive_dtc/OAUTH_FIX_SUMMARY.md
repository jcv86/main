## OAUTH FIX - Schema Cache Issue Resolved

### Problem
- `/auth/signin` page was blocked with "This content is blocked" error
- Root cause: Coach context route was trying to INSERT into `coach_context_snapshots` table
- Supabase schema cache didn't recognize the columns, causing infinite error loop

### Solution Applied
**File:** `/app/rest/coach-context/route.ts`
- Removed the INSERT operation that was failing
- Now returns empty context object for new users WITHOUT writing to database
- Eliminates schema cache conflict completely

### Files Changed
- `app/rest/coach-context/route.ts` - Removed INSERT logic

### Testing Now
1. Go to: `https://www.despegaturcarrera.com/auth/signin`
2. You should see the sign-in page with Google and LinkedIn buttons
3. Click either button to test OAuth flow

### Alternative Test
- Visit: `https://www.despegaturcarrera.com/auth/test` to verify auth system

### Next Steps
Google + LinkedIn OAuth should now work. Test the flow and report any issues.
