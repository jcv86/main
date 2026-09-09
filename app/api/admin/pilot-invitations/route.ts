import { createHash, randomBytes } from 'node:crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { sendEmail } from '@/lib/emails/send-email'
import { createAdminClient, createClient } from '@/lib/supabase/server'

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
})

const INVITATION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000
const APP_ORIGIN = 'https://www.despegatucarrera.com'

async function requireSuperadmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data } = await admin
    .from('user_roles_extended')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()

  return data?.role === 'superadmin' ? user : null
}

export async function POST(request: Request) {
  const administrator = await requireSuperadmin()
  if (!administrator) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ingresa un correo válido.' }, { status: 400 })
  }

  const token = randomBytes(32).toString('base64url')
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + INVITATION_LIFETIME_MS)
  const admin = createAdminClient()

  const { data: invitation, error: insertError } = await admin
    .from('pilot_invitations')
    .insert({ token_hash: tokenHash, expires_at: expiresAt.toISOString() })
    .select('id')
    .single()

  if (insertError || !invitation) {
    return NextResponse.json({ error: 'No se pudo crear la invitación.' }, { status: 500 })
  }

  const invitationUrl = `${APP_ORIGIN}/api/auth/invitation/claim?token=${token}`

  try {
    await sendEmail({
      to: parsed.data.email,
      from: 'info@despegatucarrera.com',
      subject: 'Tu invitación a DespegaTuCarrera',
      html: `
        <div style="background:#07111f;padding:32px 20px;font-family:Arial,sans-serif;color:#e8edf5">
          <div style="max-width:560px;margin:0 auto;background:#0d1b2d;border:1px solid #26364d;border-radius:18px;padding:32px">
            <p style="margin:0 0 12px;color:#67e8f9;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">DespegaTuCarrera</p>
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#ffffff">Tu acceso al piloto está listo</h1>
            <p style="margin:0 0 24px;line-height:1.65;color:#bdc8d8">Has sido invitado a iniciar tu recorrido profesional. Este enlace es personal, de un solo uso y vence en 7 días.</p>
            <a href="${invitationUrl}" style="display:inline-block;background:#22d3ee;color:#06111e;text-decoration:none;font-weight:700;padding:14px 20px;border-radius:10px">Aceptar invitación</a>
            <p style="margin:24px 0 0;font-size:12px;line-height:1.55;color:#8090a6">Si no esperabas esta invitación, puedes ignorar este correo.</p>
          </div>
        </div>`,
      text: `Tu acceso al piloto de DespegaTuCarrera está listo. Abre este enlace personal de un solo uso antes de 7 días: ${invitationUrl}`,
    })
  } catch {
    await admin
      .from('pilot_invitations')
      .update({ status: 'revoked', updated_at: new Date().toISOString() })
      .eq('id', invitation.id)
      .eq('status', 'issued')

    return NextResponse.json({ error: 'No se pudo enviar el correo; la invitación fue anulada.' }, { status: 502 })
  }

  return NextResponse.json({
    sent: true,
    invitationId: invitation.id,
    expiresAt: expiresAt.toISOString(),
  })
}
