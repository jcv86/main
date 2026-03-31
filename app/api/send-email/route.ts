import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html, text, from } = await req.json()

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      )
    }

    const data = await resend.emails.send({
      from: from || 'onboarding@resend.dev', // Change this to your verified domain
      to,
      subject,
      html,
      text: text || html, // Fallback to HTML if no text provided
    })

    console.log('[v0] Email sent successfully:', data)

    return NextResponse.json({
      success: true,
      messageId: data.id,
    })
  } catch (error) {
    console.error('[v0] Error sending email:', error)
    return NextResponse.json(
      {
        error: 'Failed to send email',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
