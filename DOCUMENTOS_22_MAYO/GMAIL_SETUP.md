# Gmail SMTP Setup Guide - Despega Tu Carrera

## Quick Setup (5 minutes)

### Step 1: Generate Gmail App Password

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Windows Computer** (or your device)
3. Google generates a 16-character password: `xxxx xxxx xxxx xxxx`
4. Copy this password

### Step 2: Add Environment Variables to Vercel

Go to **Vercel Dashboard** → Your Despega Project → **Settings** → **Environment Variables**

Add these 3 variables:

```
GMAIL_USER = juan@n3uralia.com
GMAIL_APP_PASSWORD = xxxx xxxx xxxx xxxx (from Step 1)
GMAIL_FROM_EMAIL = juan@despegatucarrera.com
```

Click **Save** and **Redeploy** the project.

### Step 3: Test Gmail Connection

After deploying, visit: `https://your-domain.com/api/test-gmail`

You should see:
```json
{
  "success": true,
  "message": "Gmail SMTP test successful! Check your email inbox."
}
```

Check your Gmail inbox - you should receive a test email from `juan@despegatucarrera.com`.

---

## How It Works

- **Newsletter signup** (footer) → Uses Gmail SMTP to send welcome emails
- **From:** `juan@despegatucarrera.com` (via Gmail)
- **Using:** `juan@n3uralia.com` (Gmail account as SMTP relay)
- **Reply-to:** `juan@despegatucarrera.com`

---

## Key Files

- `lib/emails/gmail-service.ts` - Gmail SMTP configuration and sending logic
- `app/api/newsletter-subscribe/route.ts` - Newsletter subscription endpoint
- `app/api/test-gmail/route.ts` - Gmail connection test endpoint

---

## Troubleshooting

### "Gmail SMTP connection failed"
- Check that `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set correctly
- Ensure the app password is the 16-character one from Google, not your regular password
- Make sure 2-Factor Authentication is enabled on the Gmail account

### "Less secure app access" error
- Use the **App Password** method (16-character one), not a regular password
- App Passwords only work with 2FA enabled

### Emails not sending
- Visit `/api/test-gmail` to debug
- Check Vercel logs for error messages
- Verify Gmail account allows SMTP access

---

## Production Considerations

For production:
1. Store subscriber emails in database (Supabase) instead of in-memory Set
2. Add email validation and rate limiting
3. Implement unsubscribe functionality
4. Add email templates as proper React components

---

## Using with Other Services

This Gmail setup works for:
- Newsletter subscriptions
- Welcome emails after signup
- Test completion notifications
- Password reset emails
- Contact form notifications

Just call:
```typescript
import { sendViaGmail } from '@/lib/emails/gmail-service'

await sendViaGmail({
  to: userEmail,
  subject: 'Your Subject',
  html: '<h1>HTML Email</h1>',
  text: 'Plain text version',
})
```
