# OAuth Exact Configuration Checklist - v3.2.0

## The Root Cause
Google and LinkedIn OAuth fail with "Error 401: invalid_client" when:
1. Redirect URIs don't match **exactly** between your code, Vercel, Google Console, and LinkedIn Developer
2. LinkedIn OIDC product is not enabled
3. Environment variables are missing or incorrect

## STEP 1: Verify Your Code Has Correct Callbacks

Your NextAuth app (`lib/auth.ts`) is configured to use:
```
Google Callback: https://www.despegatucarrera.com/api/auth/callback/google
LinkedIn Callback: https://www.despegatucarrera.com/api/auth/callback/linkedin
```

✅ This is correct and hardcoded in the app.

## STEP 2: Verify Google Cloud Console Configuration

### Go to: https://console.cloud.google.com

1. **Select your project**
2. **APIs & Services → Credentials**
3. **Click your OAuth 2.0 Client ID (Web application)**

### Check these EXACTLY match:

**Authorized JavaScript origins** (must include):
- `https://www.despegatucarrera.com`
- `https://despegatucarrera.com` (if you use both www and non-www)

**Authorized redirect URIs** (must include):
- `https://www.despegatucarrera.com/api/auth/callback/google`

✅ If different, update them and SAVE

## STEP 3: Verify LinkedIn Developer Configuration

### Go to: https://www.linkedin.com/developers/apps

1. **Select your app**
2. **Auth → Authorized redirect URLs**

### Check EXACTLY:
```
https://www.despegatucarrera.com/api/auth/callback/linkedin
```

✅ If different, update it and SAVE

### CRITICAL: Enable OpenID Connect Product

1. **Go to Products tab**
2. **Find "Sign In with LinkedIn using OpenID Connect"**
3. **Click "Request access" if not already enabled**

❌ Without this, LinkedIn login will ALWAYS fail

## STEP 4: Verify Vercel Environment Variables

### Go to: https://vercel.com/dashboard

1. **Select your project → Settings → Environment Variables**

### Check these are SET:
```
GOOGLE_CLIENT_ID=xxxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxxx
LINKEDIN_CLIENT_ID=xxxxxxxx
LINKEDIN_CLIENT_SECRET=xxxxxxxx
NEXTAUTH_SECRET=xxxxxxxx  (long random string)
```

✅ All must be present and filled

### REMOVE if present:
- `NEXTAUTH_URL` (we're using hardcoded URL instead)
- Any variables with trailing slashes

## STEP 5: Redeploy After Changes

After making ANY changes to Google/LinkedIn console OR Vercel env vars:

1. Go to Vercel dashboard
2. Click "Redeploy" on your latest deployment
3. Wait for deployment to complete

## STEP 6: Test

1. Go to https://www.despegatucarrera.com/auth/signin
2. Click "Continuar con Google"
3. You should see Google login (NOT "invalid_client" error)

## Troubleshooting

### Still getting "invalid_client"?

**Check this character-by-character:**
- Google console redirect URI
- LinkedIn console redirect URI  
- Your code callback paths

They must match EXACTLY - no extra spaces, no trailing slashes, exact capitalization.

### LinkedIn doesn't ask for permissions?

LinkedIn OIDC product is not enabled. Go to Products tab and enable "Sign In with LinkedIn using OpenID Connect".

### Redirects but user doesn't appear?

Check that:
- `NEXTAUTH_SECRET` is a long random string (not empty)
- Supabase is connected properly
- JWT session strategy is configured

## Current Configuration (v3.2.0)

```typescript
// This is what your app uses:
const baseUrl = 'https://www.despegatucarrera.com'

Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorization: { params: { scope: "openid profile email" } }
})

LinkedIn({
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  issuer: "https://www.linkedin.com/oauth",
  wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
  authorization: { params: { scope: "openid profile email" } }
})

// Callbacks:
// - Google: https://www.despegatucarrera.com/api/auth/callback/google
// - LinkedIn: https://www.despegatucarrera.com/api/auth/callback/linkedin
```

This matches what you should configure in Google and LinkedIn consoles.
