'use server'

import { Resend } from 'resend'

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

function errorType(error: unknown): string {
  return error instanceof Error ? error.name : 'UnknownError'
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = 'info@despegatucarrera.com',
  replyTo,
}: SendEmailParams) {
  try {
    // Initialize Resend inside the function so builds and routes that do not
    // deliver email never instantiate a provider client unnecessarily.
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('EmailProviderNotConfigured')
    }

    const resend = new Resend(apiKey)

    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text: text || html,
      replyTo: replyTo || from,
    })

    if (response.error) {
      throw new Error('EmailProviderRejectedRequest')
    }

    // Provider message IDs are operational metadata and do not contain the
    // recipient or message body.
    console.info('[email] Delivery accepted', { messageId: response.data?.id || null })
    return { success: true, messageId: response.data?.id || '' }
  } catch (error) {
    // Never emit recipients, subjects, message bodies or provider payloads.
    console.error('[email] Delivery failed', { errorType: errorType(error) })
    throw new Error('Email delivery failed')
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
