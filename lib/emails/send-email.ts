'use server'

import { Resend } from 'resend'

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
  from = 'info@despegatucarrera.com',
}: SendEmailParams) {
  try {
    // Initialize Resend INSIDE the function, not at module level
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured in environment variables')
    }

    const resend = new Resend(apiKey)

    console.log('[v0] Sending email to:', to)
    console.log('[v0] From:', from)

    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text: text || html,
      replyTo: from,
    })

    // Check if the response has an error
    if (response.error) {
      throw new Error(`Resend API error: ${response.error.message}`)
    }

    console.log('[v0] Email sent successfully. Message ID:', response.data?.id)
    return { success: true, messageId: response.data?.id || '' }
  } catch (error) {
    console.error('[v0] Error sending email:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to send email')
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
      <div style="background: white; padding: 20px; border-radius: 8px;">
        <h1 style="color: #7c3aed;">¡Bienvenido a Despega Tu Carrera!</h1>
        <p>Hola ${userName},</p>
        <p>Estamos emocionados de tenerte con nosotros. Tu viaje hacia el éxito profesional comienza aquí.</p>
        <div style="background: #7c3aed; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <a href="https://despegatucarrera.com/dashboard" style="color: white; text-decoration: none; font-weight: bold;">Acceder a Mi Dashboard</a>
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
    from: 'info@despegatucarrera.com',
  })
}
