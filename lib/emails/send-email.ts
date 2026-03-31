'use server'

import nodemailer from 'nodemailer'

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = 'juan@despegatucarrera.com',
}: SendEmailParams) {
  try {
    // Validate environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('[v0] Gmail credentials missing')
      throw new Error('Gmail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.')
    }

    console.log('[v0] Sending email via Gmail SMTP')
    console.log('[v0] To:', to)
    console.log('[v0] From:', from)

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // Send email
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || html,
      replyTo: from,
    })

    console.log('[v0] Email sent successfully. Message ID:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('[v0] Error sending email:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to send email'
    )
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
      <div style="background: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">¡Bienvenido a Despega Tu Carrera!</h1>
        <p>Hola ${userName},</p>
        <p>Estamos emocionados de tenerte con nosotros. Tu viaje hacia el éxito profesional comienza aquí.</p>
        
        <div style="background: #7c3aed; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <a href="https://despegatucarrera.com/dashboard" style="color: white; text-decoration: none; font-weight: bold;">
            Acceder a Mi Dashboard
          </a>
        </div>
        
        <p>Si tienes preguntas, no dudes en contactarnos.</p>
        <p>¡Que disfrutes tu experiencia!</p>
      </div>
    </div>
  `

  return sendEmail({
    to: userEmail,
    subject: '¡Bienvenido a Despega Tu Carrera!',
    html: htmlContent,
    text: `¡Bienvenido ${userName}! Tu cuenta ha sido creada exitosamente.`,
    from: 'juan@despegatucarrera.com',
  })
}
