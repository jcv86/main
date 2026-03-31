import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/emails/send-email'

interface ContactRequest {
  name: string
  email: string
  whatsapp?: string
  message: string
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, whatsapp, message } = (await req.json()) as ContactRequest

    console.log('[v0] Contact form submission from:', name)

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Nombre, email y consulta son requeridos' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Por favor ingresa un email válido' },
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
    const sanitizedEmail = email.trim().toLowerCase().substring(0, 100)
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
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 50px 30px; text-align: center; color: white;">
            <div style="font-size: 48px; margin-bottom: 15px;">📬</div>
            <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px;">Nueva Consulta</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; font-weight: 300;">Mensaje desde el sitio web</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; color: #0f172a;">
            
            <!-- Greeting -->
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; line-height: 1.3;">Se ha recibido una nueva consulta</h2>
            
            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: #475569;">
              Un usuario ha enviado una consulta desde el formulario de contacto. Revisa los detalles a continuación:
            </p>

            <!-- Consulta Details -->
            <div style="background: linear-gradient(135deg, #f0f4ff 0%, #f5f3ff 100%); border-left: 4px solid #7c3aed; padding: 24px; border-radius: 8px; margin: 32px 0; border: 1px solid rgba(124, 58, 237, 0.1);">
              <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 8px 0; font-weight: 600; color: #0f172a; font-size: 14px;">👤 Nombre:</p>
                <p style="margin: 0; font-size: 14px; color: #475569;">${sanitizedName}</p>
              </div>
              ${sanitizedWhatsapp ? `
              <div style="margin-bottom: 16px;">
                <p style="margin: 0 0 8px 0; font-weight: 600; color: #0f172a; font-size: 14px;">📱 WhatsApp:</p>
                <p style="margin: 0; font-size: 14px;"><a href="https://wa.me/${sanitizedWhatsapp.replace(/\\s+/g, '')}" style="color: #7c3aed; text-decoration: none; font-weight: 500;">${sanitizedWhatsapp}</a></p>
              </div>
              ` : ''}
              <div>
                <p style="margin: 0 0 8px 0; font-weight: 600; color: #0f172a; font-size: 14px;">💬 Mensaje:</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #475569;">${sanitizedMessage}</p>
              </div>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://despegatucarrera.com/admin/messages" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35);">
                Responder Consulta
              </a>
            </div>

            <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center;">
              Por favor revisa y responde esta consulta lo antes posible
            </p>

          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
            <p style="margin: 0 0 8px 0;">© 2026 Despega Tu Carrera. Todos los derechos reservados.</p>
            <p style="margin: 0;"><a href="https://despegatucarrera.com" style="color: #7c3aed; text-decoration: none;">despegatucarrera.com</a></p>
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

    // Email to user - confirmation
    const userEmailContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hemos recibido tu consulta - Despega Tu Carrera</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 50px 30px; text-align: center; color: white;">
            <div style="font-size: 56px; margin-bottom: 20px;">✓</div>
            <h1 style="margin: 0; font-size: 34px; font-weight: 700; letter-spacing: -1px;">Hemos recibido tu consulta</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; font-weight: 300;">Te responderemos pronto</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; color: #0f172a;">
            
            <!-- Greeting -->
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; line-height: 1.3;">¡Hola ${sanitizedName}! 👋</h2>
            
            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: #475569;">
              Gracias por contactarnos. Hemos recibido tu consulta y la hemos marcado como prioritaria en nuestro sistema.
            </p>

            <!-- Info Section -->
            <div style="background: linear-gradient(135deg, #f0f4ff 0%, #f5f3ff 100%); border-left: 4px solid #7c3aed; padding: 24px; border-radius: 8px; margin: 32px 0; border: 1px solid rgba(124, 58, 237, 0.1);">
              <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f172a;">⏱️ ¿Cuánto tiempo nos tomaremos?</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Nuestro equipo revisará tu consulta y se pondrá en contacto dentro de las próximas <strong>24 horas</strong> a través del email o WhatsApp que proporcionaste.
              </p>
            </div>

            <!-- What Happens Next -->
            <div style="margin: 32px 0;">
              <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f172a;">¿Qué sucede ahora?</h3>
              <ul style="margin: 0; padding: 0; list-style: none;">
                <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                  <span style="flex-shrink: 0; width: 24px; height: 24px; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600; margin-top: 2px;">1</span>
                  <div>
                    <strong style="color: #0f172a; font-size: 14px;">Revisión de tu consulta</strong>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Nuestro equipo especializado analiza tu solicitud</p>
                  </div>
                </li>
                <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                  <span style="flex-shrink: 0; width: 24px; height: 24px; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600; margin-top: 2px;">2</span>
                  <div>
                    <strong style="color: #0f172a; font-size: 14px;">Respuesta personalizada</strong>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Recibirás una respuesta detallada adaptada a tu necesidad</p>
                  </div>
                </li>
                <li style="display: flex; align-items: flex-start; gap: 12px;">
                  <span style="flex-shrink: 0; width: 24px; height: 24px; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600; margin-top: 2px;">3</span>
                  <div>
                    <strong style="color: #0f172a; font-size: 14px;">Seguimiento continuo</strong>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Te apoyaremos hasta resolver tu consulta</p>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Need Help Now? -->
            <div style="background: linear-gradient(135deg, #fef3f2 0%, #fef8f7 100%); border-radius: 8px; padding: 24px; margin: 32px 0; text-align: center; border: 1px solid rgba(239, 68, 68, 0.1);">
              <p style="margin: 0 0 12px 0; font-weight: 600; color: #0f172a; font-size: 14px;">¿Necesitas ayuda urgente?</p>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569;">Contáctanos directamente:</p>
              <p style="margin: 8px 0; font-size: 14px;">
                <a href="mailto:info@despegatucarrera.com" style="color: #7c3aed; text-decoration: none; font-weight: 500;">📧 info@despegatucarrera.com</a>
              </p>
              <p style="margin: 8px 0; font-size: 14px;">
                <a href="https://wa.me/56963160187" style="color: #7c3aed; text-decoration: none; font-weight: 500;">💬 WhatsApp: +56 9 6316 0187</a>
              </p>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://despegatucarrera.com" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35); transition: all 0.3s ease;">
                Explorar la Plataforma
              </a>
              <p style="margin: 12px 0 0 0; color: #94a3b8; font-size: 13px;">Mientras esperas, descubre lo que Despega Tu Carrera ofrece</p>
            </div>

            <!-- Closing -->
            <p style="margin: 32px 0 0 0; font-size: 14px; line-height: 1.6; color: #475569; text-align: center;">
              En Despega Tu Carrera nos comprometemos a acompañarte en tu transformación profesional. <strong>Tu éxito es nuestro éxito.</strong>
            </p>

          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
            <p style="margin: 0 0 8px 0;">© 2026 Despega Tu Carrera. Todos los derechos reservados.</p>
            <p style="margin: 0;"><a href="https://despegatucarrera.com" style="color: #7c3aed; text-decoration: none;">despegatucarrera.com</a></p>
          </div>

        </div>
      </body>
      </html>
    `

    // Send confirmation email to user
    console.log('[v0] Sending confirmation email to user at:', sanitizedEmail)
    
    await sendEmail({
      to: sanitizedEmail,
      subject: 'Hemos recibido tu consulta - Despega Tu Carrera',
      html: userEmailContent,
      text: `Hemos recibido tu consulta. Te responderemos dentro de 24 horas.`,
      from: 'info@despegatucarrera.com',
    })

    console.log('[v0] User confirmation email sent successfully')

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
