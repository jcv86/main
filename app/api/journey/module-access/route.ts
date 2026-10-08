import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  getCanonicalNextPath,
  getJourneyForCurrentUser,
  type JourneyModule,
} from '@/lib/journey/service'
import { repairLegacyC2Completion } from '@/lib/journey/transitions'

const NO_STORE_HEADERS = { 'Cache-Control': 'private, no-store' }

const MODULES: Array<Exclude<JourneyModule, 'COMPLETED'>> = [
  'A1',
  'A2',
  'A3',
  'A4',
]

export async function GET(request: Request) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401, headers: NO_STORE_HEADERS })
    }

    await repairLegacyC2Completion(currentUser.id)
    const journey = await getJourneyForCurrentUser()
    if (!journey) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401, headers: NO_STORE_HEADERS })
    }

    const moduleValue = new URL(request.url).searchParams.get('module')
    const module = MODULES.includes(
      moduleValue as Exclude<JourneyModule, 'COMPLETED'>,
    )
      ? (moduleValue as Exclude<JourneyModule, 'COMPLETED'>)
      : null
    if (!module) {
      return NextResponse.json({ error: 'Módulo inválido' }, { status: 400, headers: NO_STORE_HEADERS })
    }

    const access = journey.access
    const canAccess = access[module.toLowerCase() as keyof typeof access]

    return NextResponse.json({
      success: true,
      module,
      canAccess,
      reason: canAccess
        ? module === 'A4' && journey.a4AccessSource === 'qa_entitlement'
          ? 'Acceso de prueba autorizado' : 'Acceso habilitado'
        : 'Recorrido anterior incompleto',
      nextPath: canAccess
        ? null
        : await getCanonicalNextPath(journey.profile),
    }, { headers: NO_STORE_HEADERS })
  } catch (error) {
    console.error('[v0] Journey module access error:', error)
    return NextResponse.json(
      { error: 'No pudimos verificar el acceso.' },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
