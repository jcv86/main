# OAuth Fix Plan v3.2.0 - FINAL SOLUTION

## Problem Statement
**Error:** "Error 401: invalid_client" when clicking Google/LinkedIn login buttons
**Root Cause:** The `NEXTAUTH_URL` environment variable in Vercel has a trailing slash, causing NextAuth to generate callback URLs with double slashes (`//api/auth/callback/google`), which Google and LinkedIn reject.

## Why Previous Attempts Failed
- v1.0-v2.0: Tried to strip trailing slash in code - Vercel kept re-adding it
- v3.0: Tried hardcoding production URL - v3.0 code never deployed (still shows old logs)
- v3.1: Tried auto-detection from request headers - deployment issue persisted

## Root Cause Analysis
The debug logs reveal:
```
[v0] NEXTAUTH_URL: https://www.despegatucarrera.com/
[v0] Google Callback URL should be: https://www.despegatucarrera.com//api/auth/callback/google
                                                                    ^^ DOUBLE SLASH
```

And the logs still show OLD logging format, meaning **v3.1.0 code is NOT deployed** to production. The Vercel build/deployment process is not picking up the code changes.

## Solution v3.2.0 - DEFINITIVE FIX

### Strategy
1. **Hardcode production URL** - Don't read NEXTAUTH_URL env var at all
2. **Always set `url` property** - Remove conditional logic that might not execute
3. **Explicit logging** - Show exactly what URL is being used
4. **Force deployment** - Bump version to trigger new build

### Changes Made
**File: `/lib/auth.ts`**
- Line 44-45: Hardcode baseUrl as `https://www.despegatucarrera.com` (production) or `http://localhost:3000` (dev)
- Line 47-57: Explicit logging showing the hardcoded URL, ignoring the env var
- Line 102-104: Set `url: baseUrl` directly (NOT conditional)

### Expected Behavior After Deployment
```
[v0] Base URL (hardcoded, NOT from env var): https://www.despegatucarrera.com
[v0] Google Callback: https://www.despegatucarrera.com/api/auth/callback/google
[v0] LinkedIn Callback: https://www.despegatucarrera.com/api/auth/callback/linkedin
```

### Testing Steps
1. Click "Continuar con Google"
2. Should redirect to Google OAuth login (NOT show "invalid_client" error)
3. After Google approval, should redirect to `/despega/conozcamonos-1`
4. Check browser console - should show clean single-slash URLs

## Why This Will Work
- **No dependency on env vars**: Hardcoded URL is immune to Vercel's trailing slash issue
- **Explicit url property**: NextAuth will use this exact URL for callback generation
- **trustHost: true**: Allows NextAuth to trust the Host header in development
- **Force deployment**: Version bump ensures Vercel rebuilds and deploys new code

## If This Still Doesn't Work
The issue would be in Google/LinkedIn console configuration:
- Verify Google Console has exact redirect URI: `https://www.despegatucarrera.com/api/auth/callback/google`
- Verify LinkedIn has exact redirect URI: `https://www.despegatucarrera.com/api/auth/callback/linkedin`
- No double slashes, no trailing slashes in the console config
