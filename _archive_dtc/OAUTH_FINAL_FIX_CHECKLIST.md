# OAuth Google & LinkedIn Final Fix Checklist

## CRITICAL ISSUE IDENTIFIED
Your `NEXTAUTH_URL` environment variable has a **trailing slash**, causing double-slash callback URLs:
- ❌ Current: `https://www.despegatucarrera.com/` → generates `//api/auth/callback/google`
- ✅ Correct: `https://www.despegatucarrera.com` → generates `/api/auth/callback/google`

## Version 2.0.0 Changes
- ✅ Added LinkedIn OpenID Connect configuration (required for modern LinkedIn login)
- ✅ Improved debug logging to show OAuth configuration checklist
- ✅ NextAuth `url` property strips trailing slashes automatically

## YOUR ACTION ITEMS - Do These NOW

### 1. FIX NEXTAUTH_URL IN VERCEL (MOST IMPORTANT)
Go to Vercel Project Settings → Environment Variables:
- **Find:** `NEXTAUTH_URL`
- **Current value:** `https://www.despegatucarrera.com/` (with trailing slash)
- **Change to:** `https://www.despegatucarrera.com` (NO trailing slash)
- **Save and redeploy**

### 2. VERIFY GOOGLE CONSOLE
Open: https://console.cloud.google.com → Your Project → Credentials → OAuth 2.0 Client ID

**Authorized JavaScript origins** must include:
```
https://www.despegatucarrera.com
https://despegatucarrera.com
```

**Authorized redirect URIs** must be EXACTLY:
```
https://www.despegatucarrera.com/api/auth/callback/google
```

### 3. VERIFY LINKEDIN DEVELOPER
Open: https://www.linkedin.com/developers → Your App → Auth

**Check 1: Product is enabled**
- [ ] "Sign In with LinkedIn using OpenID Connect" is ENABLED (not the old deprecated one)

**Check 2: Redirect URLs**
Add this exact URL:
```
https://www.despegatucarrera.com/api/auth/callback/linkedin
```

**Check 3: Scope**
You should have permission to request:
- openid
- profile  
- email

### 4. VERIFY VERCEL ENVIRONMENT VARIABLES
Go to Vercel Settings → Environment Variables:

- [ ] `NEXTAUTH_URL=https://www.despegatucarrera.com` (NO trailing slash)
- [ ] `NEXTAUTH_SECRET=<your-secret>` (44+ chars)
- [ ] `GOOGLE_CLIENT_ID=105498909085-psshfi5...`
- [ ] `GOOGLE_CLIENT_SECRET=<your-secret>`
- [ ] `LINKEDIN_CLIENT_ID=782s4q94ixha4f`
- [ ] `LINKEDIN_CLIENT_SECRET=<your-secret>`
- [ ] `NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY=<your-key>`

## TEST AFTER DEPLOYMENT

1. Deploy v2.0.0 to Vercel
2. Open https://www.despegatucarrera.com/auth/signin
3. Click "Continuar con Google"
4. Check browser console (F12 → Console tab)
5. You should see:
```
[v0] ===== OAUTH CONFIGURATION CHECKLIST =====
[v0] Raw NEXTAUTH_URL env: https://www.despegatucarrera.com
[v0] Clean baseUrl: https://www.despegatucarrera.com
[v0] VERIFY THESE MATCH GOOGLE CONSOLE:
[v0] - Authorized JavaScript origins: https://www.despegatucarrera.com
[v0] - Authorized redirect URI: https://www.despegatucarrera.com/api/auth/callback/google
```

## EXPECTED ERRORS & SOLUTIONS

| Error | Cause | Fix |
|-------|-------|-----|
| `redirect_uri_mismatch` | Callback URL doesn't match Google Console | Update NEXTAUTH_URL, remove trailing slash |
| `invalid_client` | Client ID/Secret wrong | Verify values in Google Console |
| LinkedIn redirects but no user | Not using OpenID Connect | Enable "Sign In with LinkedIn using OpenID Connect" |
| `unauthorized_scope` | LinkedIn scopes not authorized | Check your app has `openid profile email` enabled |
| `origin not allowed` | Google JavaScript origin missing | Add `https://www.despegatucarrera.com` to Google Console |

## Next Steps

1. **Immediately:** Fix NEXTAUTH_URL (remove trailing slash)
2. **Then:** Verify Google Console callback URLs
3. **Then:** Verify LinkedIn has OpenID Connect enabled
4. **Then:** Redeploy v2.0.0
5. **Test:** Try clicking Google/LinkedIn buttons on signin page

If still not working after these steps, provide:
- Exact error message from browser console
- Screenshot of Google Console redirect URIs
- Screenshot of LinkedIn redirect URLs
- Screenshot of Vercel environment variables (hide secrets)
