import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/emails/send-email'

interface SubscribeRequest {
  email: string
}

// Email list - in production, store in database/Supabase
const subscribers = new Set<string>()

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as SubscribeRequest

    console.log('[v0] Newsletter subscription request for:', email)

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Email inválido' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    if (subscribers.has(email)) {
      return NextResponse.json(
        { message: 'Este email ya está suscrito' },
        { status: 400 }
      )
    }

    // Add to subscribers
    subscribers.add(email)
    console.log('[v0] Newsletter subscriber added:', email)

    // Send welcome email via Resend
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a Despega Tu Carrera</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 50px 30px; text-align: center; color: white;">
            <div style="font-size: 56px; margin-bottom: 20px; letter-spacing: 2px;">🚀</div>
            <h1 style="margin: 0; font-size: 34px; font-weight: 700; letter-spacing: -1px;">Despega Tu Carrera</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; font-weight: 300;">¡Bienvenido a la comunidad de crecimiento profesional!</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; color: #0f172a;">
            
            <!-- Greeting -->
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; line-height: 1.3;">¡Hola, estamos emocionados de tenerte aquí! 👋</h2>
            
            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: #475569;">
              Gracias por suscribirte a <strong>Despega Tu Carrera</strong>. Acabas de unirte a una comunidad de profesionales comprometidos con transformar sus carreras.
            </p>

            <!-- What's Next Section -->
            <div style="background: linear-gradient(135deg, #f0f4ff 0%, #f5f3ff 100%); border-left: 4px solid #7c3aed; padding: 24px; border-radius: 8px; margin: 32px 0; border: 1px solid rgba(124, 58, 237, 0.1);">
              <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f172a;">¿Qué recibirás en tu inbox?</h3>
              <ul style="margin: 0; padding: 0; list-style: none;">
                <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                  <span style="flex-shrink: 0; width: 24px; height: 24px; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600; margin-top: 2px;">✓</span>
                  <div>
                    <strong style="color: #0f172a; font-size: 14px;">Tips Exclusivos de Desarrollo Profesional</strong>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Estrategias probadas para acelerar tu crecimiento</p>
                  </div>
                </li>
                <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                  <span style="flex-shrink: 0; width: 24px; height: 24px; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600; margin-top: 2px;">✓</span>
                  <div>
                    <strong style="color: #0f172a; font-size: 14px;">Recursos Curados</strong>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Herramientas, libros y materiales para tu éxito</p>
                  </div>
                </li>
                <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                  <span style="flex-shrink: 0; width: 24px; height: 24px; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600; margin-top: 2px;">✓</span>
                  <div>
                    <strong style="color: #0f172a; font-size: 14px;">Actualizaciones Exclusivas</strong>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Nuevas funciones y oportunidades especiales</p>
                  </div>
                </li>
                <li style="display: flex; align-items: flex-start; gap: 12px;">
                  <span style="flex-shrink: 0; width: 24px; height: 24px; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 600; margin-top: 2px;">✓</span>
                  <div>
                    <strong style="color: #0f172a; font-size: 14px;">Comunidad y Networking</strong>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Conecta con profesionales en tu área</p>
                  </div>
                </li>
              </ul>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://despegatucarrera.com" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 16px 50px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35); transition: all 0.3s ease; border: none; cursor: pointer;">
                Explorar la Plataforma
              </a>
              <p style="margin: 12px 0 0 0; color: #94a3b8; font-size: 13px;">Comienza tu transformación profesional hoy</p>
            </div>

            <!-- Social Proof -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 32px 0; border: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                Recibirás contenido de valor cada semana. <br>
                <span style="color: #94a3b8;">Siempre puedes desuscribirte. Respetamos tu privacidad.</span>
              </p>
            </div>

            <!-- Contact Section -->
            <div style="background: linear-gradient(135deg, #fef3f2 0%, #fef8f7 100%); border-radius: 8px; padding: 24px; margin: 32px 0; text-align: center; border: 1px solid rgba(239, 68, 68, 0.1);">
              <p style="margin: 0 0 16px 0; font-weight: 600; color: #0f172a; font-size: 14px;">¿Preguntas o sugerencias?</p>
              <p style="margin: 8px 0; font-size: 14px;">
                <a href="mailto:info@despegatucarrera.com" style="color: #7c3aed; text-decoration: none; font-weight: 500;">📧 info@despegatucarrera.com</a>
              </p>
              <p style="margin: 8px 0; font-size: 14px;">
                <a href="https://wa.me/56963160187" style="color: #7c3aed; text-decoration: none; font-weight: 500;">💬 WhatsApp: +56 9 6316 0187</a>
              </p>
            </div>

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

    const textContent = `
¡Bienvenido a Despega Tu Carrera!

Gracias por suscribirte a nuestro newsletter. Recibirás:
- Tips exclusivos de desarrollo profesional
- Recursos curados para tu crecimiento
- Nuevas funciones y actualizaciones
- Oportunidades de networking

¿Preguntas? Contáctanos:
📧 info@despegatucarrera.com
💬 +56 9 6316 0187 (WhatsApp)

Explora nuestra plataforma en: https://despegatucarrera.com

© 2026 Despega Tu Carrera
    `

    console.log('[v0] Attempting to send email via Resend...')

    // Send email using Resend API
    await sendEmail({
      to: email,
      subject: '¡Bienvenido a Despega Tu Carrera! 🚀',
      html: htmlContent,
      text: textContent,
      from: 'info@despegatucarrera.com',
    })

    console.log('[v0] Email sent successfully to:', email)

    return NextResponse.json({
      success: true,
      message: '¡Suscripción exitosa! Revisa tu email para confirmación.',
    })
  } catch (error) {
    console.error('[v0] Newsletter subscription error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error al suscribirse'
    console.error('[v0] Error details:', errorMessage)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error al procesar tu suscripción. Por favor intenta nuevamente.',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    )
  }
}

