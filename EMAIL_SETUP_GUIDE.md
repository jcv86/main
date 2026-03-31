# 📧 Email Configuration Guide: Cloudflare + Resend

Complete setup for receiving and sending emails on Despega Tu Carrera.

## 📋 Quick Checklist

- [ ] Add `RESEND_API_KEY` to environment variables
- [ ] Set up Cloudflare Email Routing
- [ ] Verify Resend sender domain
- [ ] Test email sending

---

## 🚀 Step 1: Get Your Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up or log in
3. Navigate to **API Keys** in your dashboard
4. Click **Create API Key** 
5. Copy your key (format: `re_xxxxxxxxxxxxx`)

---

## 🔐 Step 2: Add RESEND_API_KEY to Environment

### Local Development
Create or edit `.env.local`:
```
RESEND_API_KEY=re_your_actual_key_here
```

### Vercel Production
1. Go to your Vercel project dashboard
2. Click **Settings** (top right)
3. Navigate to **Environment Variables**
4. Click **Add New**
   - Name: `RESEND_API_KEY`
   - Value: Your API key from Resend
5. Click **Save**
6. Redeploy your project

---

## ☁️ Step 3: Configure Cloudflare Email Routing

### Incoming Emails (Receive at info@despegatucarrera.com)

1. Go to [cloudflare.com](https://cloudflare.com)
2. Select your domain `despegatucarrera.com`
3. Left sidebar → **Email** → **Email Routing**
4. Click **Enable Email Routing**
5. Cloudflare will automatically add MX records:
   ```
   MX  despegatucarrera.com  30  route1.mx.cloudflare.net
   MX  despegatucarrera.com  10  route2.mx.cloudflare.net
   ```

### Create Routing Rule

1. In Email Routing, click **Create address**
2. **Address:** `info`
3. **Destination:** Your Gmail address (e.g., `yourname@gmail.com`)
4. Click **Create address**
5. Verify the forwarding works by sending a test email

**Result:** Emails sent to `info@despegatucarrera.com` will be forwarded to your Gmail inbox!

---

## 📨 Step 4: Verify Resend Sender Domain

For production emails, verify your domain with Resend:

1. Go to Resend dashboard → **Domains**
2. Click **Add Domain**
3. Enter `despegatucarrera.com`
4. Add the DNS records provided by Resend to Cloudflare:
   - Go to Cloudflare → Your domain → **DNS**
   - Add the CNAME records Resend provides
   - Wait for verification (usually 5-10 minutes)
5. Once verified, you can send from `info@despegatucarrera.com`

---

## ✉️ Step 5: Test Email Sending

### From Your Code

```typescript
import { Resend } from 'resend'
import { WelcomeEmail } from '@/lib/emails/welcome'
import { render } from '@react-email/render'

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendTestEmail() {
  const emailHtml = render(<WelcomeEmail email="test@example.com" />)
  
  const data = await resend.emails.send({
    from: 'info@despegatucarrera.com',
    to: 'your-email@gmail.com',
    subject: 'Test Email from Despega',
    html: emailHtml,
  })

  console.log('Email sent:', data.id)
}
```

### Manual Test via Resend Dashboard

1. Go to Resend → **Emails**
2. Click **Send Test Email**
3. Fill in recipient email
4. Select a template
5. Click **Send**

---

## 📧 Available Email Templates

### WelcomeEmail
- Sent when user subscribes to newsletter
- File: `lib/emails/welcome.tsx`
- Includes branded header, features list, CTA button

### TestCompleteEmail
- Sent after user completes a test
- File: `lib/emails/test-complete.tsx`
- Shows test result and link to report

---

## 🔗 How Emails Work in Your App

### Newsletter Subscription (in footer)
```
User clicks "Suscribirse"
  ↓
Sends email to `/api/newsletter-subscribe`
  ↓
API validates email & calls Resend
  ↓
Resend sends WelcomeEmail from info@despegatucarrera.com
  ↓
Email arrives in user's inbox
```

### After Test Completion
```
User completes test
  ↓
Test results saved to database
  ↓
API sends TestCompleteEmail via Resend
  ↓
Email includes link to their report
```

---

## 🐛 Troubleshooting

### Error: "Missing API key"
- Verify `RESEND_API_KEY` is set in `.env.local` or Vercel
- Restart your dev server: `npm run dev`
- Redeploy to Vercel: `git push`

### Emails not sending
- Check Resend dashboard for errors
- Verify sender domain is `info@despegatucarrera.com`
- Make sure domain is verified in Resend

### Not receiving forwarded emails
- Check Cloudflare Email Routing settings
- Verify MX records are set correctly
- Test by sending email to `info@despegatucarrera.com`

### Email template not rendering
- Install: `npm install @react-email/render`
- Make sure React components are in `.tsx` files
- Check for TypeScript errors in templates

---

## 📚 Useful Links

- **Resend Documentation:** https://resend.com/docs
- **Cloudflare Email Routing:** https://dash.cloudflare.com
- **React Email Components:** https://react.email

---

## 🎯 Next Steps

1. ✅ Add `RESEND_API_KEY` environment variable
2. ✅ Set up Cloudflare Email Routing
3. ✅ Verify domain in Resend
4. ✅ Test newsletter subscription in footer
5. ✅ Integrate email sending in test completion flow

Your email system is now production-ready!
