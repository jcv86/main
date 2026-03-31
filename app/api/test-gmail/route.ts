import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/emails/send-email'

export async function GET(req: NextRequest) {
  try {
    console.log('[v0] Testing Gmail SMTP via sendEmail function...')

    // Send test email
    await sendEmail({
      to: process.env.GMAIL_USER || 'test@example.com',
      subject: 'Test Email from Despega Tu Carrera',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h1 style="color: #7c3aed;">Test Email</h1>
            <p>Este es un email de prueba desde Despega Tu Carrera.</p>
            <p>Si recibiste este email, significa que Gmail SMTP está configurado correctamente.</p>
            <hr style="margin: 20px 0;" />
            <p><strong>Detalles:</strong></p>
            <ul>
              <li>Enviado desde: juan@despegatucarrera.com</li>
              <li>Cuenta Gmail: ${process.env.GMAIL_USER}</li>
              <li>Timestamp: ${new Date().toISOString()}</li>
            </ul>
          </div>
        </div>
      `,
      text: 'Test email from Despega Tu Carrera. If you received this, Gmail SMTP is working correctly.',
      from: 'juan@despegatucarrera.com',
    })

    return NextResponse.json({
      success: true,
      message: 'Gmail SMTP test successful! Check your email inbox.',
      details: {
        gmailUser: process.env.GMAIL_USER,
        fromEmail: 'juan@despegatucarrera.com',
      },
    })
  } catch (error) {
    console.error('[v0] Gmail test error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Gmail SMTP test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

