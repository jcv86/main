import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/emails/send-email'

interface SubscribeRequest {
  email: string
}

// Email list - in production, store in database
const subscribers = new Set<string>()

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as SubscribeRequest

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
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; min-height: 100vh;">
        <div style="background: white; border-radius: 12px; padding: 40px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
          
          {/* Header */}
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
              <span style="font-size: 28px; font-weight: bold; color: white;">🚀</span>
            </div>
            <h1 style="color: #0f172a; font-size: 28px; margin: 0; font-weight: bold;">¡Bienvenido a Despega Tu Carrera!</h1>
          </div>

          {/* Main Content */}
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hola,
          </p>

          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            ¡Gracias por suscribirte a nuestro newsletter! Nos complace saber que estás interesado en transformar tu carrera profesional.
          </p>

          <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-left: 4px solid #7c3aed; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #0f172a; margin: 0; font-weight: 600; margin-bottom: 10px;">📧 ¿Qué recibirás?</p>
            <ul style="color: #475569; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Tips exclusivos de desarrollo profesional</li>
              <li style="margin-bottom: 8px;">Recursos curados para tu crecimiento</li>
              <li style="margin-bottom: 8px;">Nuevas funciones y actualizaciones</li>
              <li>Oportunidades de networking y colaboración</li>
            </ul>
          </div>

          {/* CTA Button */}
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://despegatucarrera.com" style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; transition: all 0.3s ease;">
              Explorar Despega Tu Carrera
            </a>
          </div>

          {/* Footer */}
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Si tienes preguntas, puedes responder este email o contactarnos a través de WhatsApp:
            <br />
            <a href="https://wa.me/56963160187" style="color: #7c3aed; text-decoration: none; font-weight: 600;">+56 9 6316 0187</a>
          </p>

          <p style="color: #cbd5e1; font-size: 12px; text-align: center; margin-top: 15px;">
            © 2026 Despega Tu Carrera. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `

    const textContent = `
¡Bienvenido a Despega Tu Carrera!

Gracias por suscribirte a nuestro newsletter. Recibirás:
- Tips exclusivos de desarrollo profesional
- Recursos curados para tu crecimiento
- Nuevas funciones y actualizaciones
- Oportunidades de networking

Explora nuestra plataforma en: https://despegatucarrera.com

¿Preguntas? Contáctanos por WhatsApp: +56 9 6316 0187

© 2026 Despega Tu Carrera
    `

    await sendEmail({
      to: email,
      subject: '¡Bienvenido a Despega Tu Carrera! 🚀',
      html: htmlContent,
      text: textContent,
      from: 'newsletter@despegatucarrera.com', // Change to your verified Resend domain
    })

    return NextResponse.json({
      success: true,
      message: '¡Suscripción exitosa! Revisa tu email para confirmación.',
    })
  } catch (error) {
    console.error('[v0] Newsletter subscription error:', error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error al suscribirse',
      },
      { status: 500 }
    )
  }
}
