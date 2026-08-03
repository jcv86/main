import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  getCanonicalNextPath,
  getJourneyForCurrentUser,
  getModuleAccess,
  type JourneyModule,
} from '@/lib/journey/service'
import { repairLegacyC2Completion } from '@/lib/journey/transitions'

const MODULES: JourneyModule[] = ['C1', 'A1', 'A2', 'A3', 'A4']

export async function GET(request: Request) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    await repairLegacyC2Completion(currentUser.id)
    const journey = await getJourneyForCurrentUser()
    if (!journey) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const moduleValue = new URL(request.url).searchParams.get('module')
    const module = MODULES.includes(moduleValue as JourneyModule)
      ? (moduleValue as JourneyModule)
      : null
    if (!module) {
      return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 })
    }

    const access = getModuleAccess(journey, module)
    return NextResponse.json({
      success: true,
      module,
      canAccess: access.canAccess,
      reason: access.reason,
      nextPath: access.canAccess
        ? null
        : await getCanonicalNextPath(journey.profile),
    })
  } catch (error) {
    console.error('[v0] Journey module access error:', error)
    return NextResponse.json(
      { error: 'No pudimos verificar el acceso.' },
      { status: 500 },
    )
  }
}
