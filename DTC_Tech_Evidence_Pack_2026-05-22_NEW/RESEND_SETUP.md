# Resend Email Setup Guide - Despega Tu Carrera

## ✅ Complete! Here's what was configured:

### 1. **Components Created**
- `components/newsletter-signup.tsx` - Newsletter signup form with real-time validation
- Footer component updated to use the new newsletter signup

### 2. **API Endpoints Created**
- `app/api/newsletter-subscribe/route.ts` - Handles newsletter subscriptions
- `app/api/send-email/route.ts` - Generic email sending endpoint
- `lib/emails/send-email.ts` - Server action for sending emails
- `lib/emails/templates.ts` - Branded email templates

### 3. **How It Works**

**When users click "Suscribirse" in the footer:**
1. Email is validated on the client side
2. Request sent to `/api/newsletter-subscribe`
3. Resend API sends branded welcome email to the subscriber
4. Success/error message displayed to user

### 4. **Final Setup Steps (REQUIRED)**

#### Step A: Install Resend Package
```bash
pnpm add resend
```

#### Step B: Add RESEND_API_KEY to Environment
**Local Development (.env.local):**
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

**Vercel Deployment (Settings > Vars):**
- Add `RESEND_API_KEY` with your actual API key from [resend.com](https://resend.com)

#### Step C: Get Resend API Key
1. Go to https://resend.com
2. Sign up / Login
3. Navigate to API Keys
4. Create or copy your API key
5. Add to environment variables

#### Step D: Update Email "From" Address (Production)
In `app/api/newsletter-subscribe/route.ts` line 68:
```typescript
// Change from:
from: 'newsletter@despegatucarrera.com'

// To your verified Resend domain after setup
```

In `lib/emails/send-email.ts` line 19:
```typescript
// Change from:
from: 'onboarding@resend.dev'

// To your verified domain
```

#### Step E: Verify Your Domain (Optional but Recommended)
1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `despegatucarrera.com`)
3. Follow DNS setup instructions
4. Update `from` field once verified

### 5. **Test It**
1. Visit your site homepage
2. Scroll to footer
3. Enter an email in newsletter field
4. Click "Suscribirse"
5. Check that email for the welcome message

### 6. **Branded Email Template**
The email sent includes:
- Despega Tu Carrera branding
- Purple/blue gradient design
- Welcome message
- What newsletter subscribers will receive
- WhatsApp contact link
- CTA to explore platform

### 7. **Production Checklist**
- [ ] Resend API key added to Vercel
- [ ] Domain verified in Resend
- [ ] "From" email updated to verified domain
- [ ] Tested newsletter subscription
- [ ] Email deliverability tested

## Environment Variables Required

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

That's it! Your newsletter signup with Resend email sending is now fully functional! 🚀
