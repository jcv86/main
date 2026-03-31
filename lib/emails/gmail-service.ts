import nodemailer from 'nodemailer'

// Create Gmail transporter
export const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// Test Gmail connection
export async function testGmailConnection() {
  try {
    await gmailTransporter.verify()
    console.log('[v0] Gmail SMTP connection verified ✓')
    return { success: true, message: 'Gmail SMTP connection successful' }
  } catch (error) {
    console.error('[v0] Gmail SMTP connection failed:', error)
    return { success: false, message: error instanceof Error ? error.message : 'Connection failed' }
  }
}

// Send email via Gmail
export async function sendViaGmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.GMAIL_FROM_EMAIL) {
      throw new Error('Missing Gmail environment variables: GMAIL_USER, GMAIL_APP_PASSWORD, or GMAIL_FROM_EMAIL')
    }

    console.log('[v0] Sending email via Gmail SMTP...')
    console.log('[v0] From:', process.env.GMAIL_FROM_EMAIL)
    console.log('[v0] To:', to)
    console.log('[v0] Subject:', subject)

    const result = await gmailTransporter.sendMail({
      from: `"Despega Tu Carrera" <${process.env.GMAIL_FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
      replyTo: replyTo || process.env.GMAIL_FROM_EMAIL,
    })

    console.log('[v0] Email sent successfully via Gmail:', result.response)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('[v0] Error sending email via Gmail:', error)
    throw error
  }
}
