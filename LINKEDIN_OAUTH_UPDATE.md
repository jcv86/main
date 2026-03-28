## LinkedIn OAuth - Update Your Existing App

You already have the app created: **DespegaTuCarrera** (Client ID: `782s4q94ixha4f`)

But it has the OLD URL. Here's what you need to do:

### Step 1: Update Privacy Policy URL

In your LinkedIn app (https://www.linkedin.com/developers/apps):
1. Click on "Settings" tab
2. Find "Privacy policy URL" 
3. Change from: `https://despegav22.vercel.app/politica-privacidad`
4. Change to: `https://www.despegaturcarrera.com/politica-privacidad` (or your actual domain)
5. Click Save

### Step 2: Get the Client Secret

1. Go to "Auth" tab
2. Look for "Client credentials"
3. You should see:
   - Client ID: `782s4q94ixha4f`
   - Client Secret: [Copy this]
4. If you don't see Client Secret, click "Generate secret"

### Step 3: Add Authorized redirect URIs

In the same "Auth" tab:
1. Find "Authorized redirect URLs"
2. Add these URLs:
   ```
   http://localhost:3000/api/auth/callback/linkedin
   https://www.despegaturcarrera.com/api/auth/callback/linkedin
   ```
3. Click "Add redirect URL" for each one
4. Save changes

### Step 4: Request "Sign in with LinkedIn" access

1. In "Products" tab
2. Look for "Sign in with LinkedIn" 
3. If it says "Request access", click it
4. Fill the form explaining your app
5. Submit - LinkedIn will review (usually 1-2 days)

### Step 5: Once approved, send me:

- Client ID: `782s4q94ixha4f`
- Client Secret: [from Auth tab]
- Confirmation that redirect URIs are set

Then I'll add them to Vercel env variables and activate LinkedIn login!
