import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveInvitationCookieSecret } from '@/lib/auth/invitation-cookie'
import { processInvitationClaim } from '@/lib/auth/process-invitation-claim'

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43,128}$/

function signInErrorUrl(request: NextRequest) {
  return new URL('/auth/signin?error=invalid_invitation', request.url)
}

/**
 * Email security scanners commonly open every link in a message. Keep GET
 * strictly read-only so that only the person who confirms the form can reserve
 * the single-use invitation.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  const secret = resolveInvitationCookieSecret()

  if (!TOKEN_PATTERN.test(token) || secret.length < 32) {
    return NextResponse.redirect(signInErrorUrl(request), 303)
  }

  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex,nofollow,noarchive" />
    <title>Confirmar invitación · DespegaTuCarrera</title>
    <style>
      :root { color-scheme: dark; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      * { box-sizing: border-box; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 24px; color: #f8fafc; background: #020617; }
      main { width: min(100%, 460px); padding: 32px; border: 1px solid #334155; border-radius: 20px; background: #0f172a; box-shadow: 0 24px 70px rgba(0,0,0,.35); }
      .eyebrow { margin: 0 0 12px; color: #5eead4; font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
      h1 { margin: 0; font-size: clamp(28px, 7vw, 38px); line-height: 1.1; }
      p { margin: 18px 0 0; color: #cbd5e1; line-height: 1.65; }
      button { width: 100%; min-height: 48px; margin-top: 28px; border: 0; border-radius: 12px; padding: 12px 18px; color: #042f2e; background: #5eead4; font: inherit; font-weight: 800; cursor: pointer; }
      button:hover { background: #99f6e4; }
      button:focus-visible { outline: 3px solid #f8fafc; outline-offset: 3px; }
      small { display: block; margin-top: 16px; color: #94a3b8; line-height: 1.5; }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">Acceso personal</p>
      <h1>Confirma tu invitación</h1>
      <p>Continúa solo si tú solicitaste abrir este enlace. La invitación se reservará cuando presiones el botón.</p>
      <form method="post" action="/api/auth/invitation/claim">
        <input type="hidden" name="token" value="${token}" />
        <button type="submit">Confirmar y continuar</button>
      </form>
      <small>Después podrás ingresar con Google o LinkedIn. Usa la cuenta con la que quieres conservar tu avance.</small>
    </main>
  </body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      'Content-Type': 'text/html; charset=utf-8',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
  })
}

export async function POST(request: NextRequest) {
  const admin = createAdminClient()
  return processInvitationClaim(request, {
    createClaimId: randomUUID,
    claim: (tokenHash, claimId) =>
      admin.rpc('claim_pilot_invitation', {
        p_token_hash: tokenHash,
        p_claim_id: claimId,
      }),
  })
}
