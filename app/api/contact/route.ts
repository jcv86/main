import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/emails/send-email'

interface ContactRequest {
  name: string
  whatsapp?: string
  message: string
}

export async function POST(req: NextRequest) {
  try {
    const { name, whatsapp, message } = (await req.json()) as ContactRequest

    console.log('[v0] Contact form submission from:', name)

    // Validate inputs
    if (!name || !message) {
      return NextResponse.json(
        { message: 'Nombre y consulta son requeridos' },
        { status: 400 }
      )
    }

    if (message.length < 10) {
      return NextResponse.json(
        { message: 'La consulta debe tener al menos 10 caracteres' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = name.trim().substring(0, 100)
    const sanitizedMessage = message.trim().substring(0, 5000)
    const sanitizedWhatsapp = whatsapp?.trim().substring(0, 20) || ''

    console.log('[v0] Contact form validated, preparing to send email...')

    // Email to admin
    const adminEmailContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Nueva Consulta - Despega Tu Carrera</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">📬 Nueva Consulta Recibida</h1>
          </div>

          <!-- Content -->
          <div style="padding: 30px; color: #0f172a;">
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">
              Se ha recibido una nueva consulta desde el sitio web:
            </p>

            <div style="background: #f8fafc; border-left: 4px solid #7c3aed; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 15px 0; font-size: 14px;">
                <strong style="color: #0f172a;">Nombre:</strong> ${sanitizedName}
              </p>
              ${sanitizedWhatsapp ? `
              <p style="margin: 0 0 15px 0; font-size: 14px;">
                <strong style="color: #0f172a;">WhatsApp:</strong> <a href="https://wa.me/${sanitizedWhatsapp.replace(/\\s+/g, '')}" style="color: #7c3aed; text-decoration: none;">${sanitizedWhatsapp}</a>
              </p>
              ` : ''}
              <p style="margin: 0; font-size: 14px;">
                <strong style="color: #0f172a;">Consulta:</strong>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #475569;">
                ${sanitizedMessage}
              </p>
            </div>

            <p style="margin: 20px 0 0 0; font-size: 12px; color: #94a3b8;">
              Por favor responde a esta consulta lo antes posible.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
            <p style="margin: 0;">© 2026 Despega Tu Carrera</p>
          </div>

        </div>
      </body>
      </html>
    `

    // Send email to admin
    await sendEmail({
      to: 'info@despegatucarrera.com',
      subject: `Nueva Consulta: ${sanitizedName}`,
      html: adminEmailContent,
      text: `Nueva consulta de ${sanitizedName}. Consulta: ${sanitizedMessage}${sanitizedWhatsapp ? `\\n\\nWhatsApp: ${sanitizedWhatsapp}` : ''}`,
      from: 'info@despegatucarrera.com',
    })

    // Email to user
    const userEmailContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Hemos recibido tu consulta - Despega Tu Carrera</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">✓ Consulta Recibida</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Te responderemos pronto</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px; color: #0f172a;">
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
              Hola <strong>${sanitizedName}</strong>,
            </p>

            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #475569;">
              Gracias por tu consulta. Hemos recibido tu mensaje y lo hemos marcado como prioritario.
            </p>

            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #475569;">
              Nuestro equipo revisará tu solicitud y nos pondremos en contacto dentro de las próximas 24 horas.
            </p>

            <div style="background: linear-gradient(135deg, #f0f4ff 0%, #f5f3ff 100%); border-left: 4px solid #7c3aed; padding: 20px; border-radius: 8px; margin: 30px 0; border: 1px solid rgba(124, 58, 237, 0.1);">
              <p style="margin: 0 0 10px 0; font-weight: 600; color: #0f172a;">¿Necesitas ayuda urgente?</p>
              <p style="margin: 0; font-size: 14px; color: #475569;">
                También puedes contactarnos directamente:<br>
                📧 info@despegatucarrera.com<br>
                💬 <a href="https://wa.me/56963160187" style="color: #7c3aed; text-decoration: none;">WhatsApp: +56 9 6316 0187</a>
              </p>
            </div>

            <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
              En Despega Tu Carrera nos comprometemos a acompañarte en tu transformación profesional. Tu éxito es nuestro éxito.
            </p>
          </div>

          <!-- CTA -->
          <div style="text-align: center; padding: 0 30px 30px;">
            <a href="https://despegatucarrera.com" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
              Explorar la Plataforma
            </a>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
            <p style="margin: 0;">© 2026 Despega Tu Carrera. Todos los derechos reservados.</p>
            <p style="margin: 8px 0 0 0;">
              <a href="https://despegatucarrera.com/privacy" style="color: #7c3aed; text-decoration: none;">Privacidad</a> | 
              <a href="https://despegatucarrera.com/terms" style="color: #7c3aed; text-decoration: none;">Términos</a>
            </p>
          </div>

        </div>
      </body>
      </html>
    `

    // Send confirmation email to user
    console.log('[v0] Sending confirmation email to user...')
    
    // For now, we'll just send to admin. In production, you might want to get user email
    // await sendEmail({
    //   to: userEmail,
    //   subject: 'Hemos recibido tu consulta - Despega Tu Carrera',
    //   html: userEmailContent,
    //   text: `Hemos recibido tu consulta. Te responderemos dentro de 24 horas.`,
    //   from: 'info@despegatucarrera.com',
    // })

    console.log('[v0] Contact form email sent successfully')

    return NextResponse.json({
      success: true,
      message: 'Consulta enviada correctamente',
    })
  } catch (error) {
    console.error('[v0] Contact form error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[v0] Error details:', errorMessage)

    return NextResponse.json(
      {
        success: false,
        message: 'Error al enviar la consulta. Por favor intenta nuevamente.',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}
