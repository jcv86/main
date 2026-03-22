# DEEP INVESTIGATION: Why Google OAuth Still Fails with "invalid_client"

## ROOT CAUSE IDENTIFIED

After thorough investigation of all code, environment variables, and configuration, I found **THREE LAYERS OF PROBLEMS**:

### Problem 1: Timing Issue - Config is Evaluated at Import Time
- **File**: `lib/auth.ts` line 116 sets `url: baseUrl`
- **File**: `app/api/auth/[...nextauth]/route.ts` tries to fix env var at request time
- **Issue**: The `authConfig` is imported and evaluated BEFORE the route handler runs
- **Result**: The env var fix in route.ts doesn't affect authConfig which was already evaluated

### Problem 2: NextAuth Uses Multiple URL Sources
NextAuth generates callback URLs from:
1. The `url` property in config (we set this to baseUrl)
2. The `NEXTAUTH_URL` env var (has trailing slash)
3. The `Host` header from the request
4. If `trustHost: true`, it prefers the Host header over config

**Current Config**: 
- `trustHost: true` (line 113) means NextAuth IGNORES the `url` config and uses Host header
- `url: baseUrl` (line 116) is set but won't be used because trustHost=true

### Problem 3: Vercel's Host Header
When Vercel routes requests, the Host header is set to the domain. But the problem is:
- Google console is configured to expect `https://www.despegatucarrera.com/api/auth/callback/google`
- But NextAuth might be receiving a different Host or adding `basePath` incorrectly

## THE ACTUAL ISSUE

The error "Error 401: invalid_client" means Google is saying:
> "The callback URL you're trying to use (`https://www.despegatucarrera.com//api/auth/callback/google` or something similar) doesn't match what's registered in your app credentials"

## THE FIX

Set `trustHost: false` so NextAuth uses the explicit `url` config instead of the Host header. This ensures the callback URL is ALWAYS generated correctly.

## REQUIRED CHANGES

1. Set `trustHost: false` in authConfig
2. Ensure `url: baseUrl` is definitely being used
3. Verify Google Console has redirect URI: `https://www.despegatucarrera.com/api/auth/callback/google` (single slash)
4. Deploy to force redeployment

## VERIFICATION STEPS

After deployment, check debug logs for:
- `[v0] NEXTAUTH_URL is clean (no trailing slash):` confirmation
- Google OAuth button should redirect to Google consent screen (not error)
- After approval, should redirect to `/despega/conozcamonos-1`
