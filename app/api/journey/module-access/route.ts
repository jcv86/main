import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  getCanonicalNextPath,
  getJourneyForCurrentUser,
  getModuleAccess,
  type JourneyModule,
} from '@/lib/journey/service'
import { repairLegacyC2Completion } from '@/lib/journey/transitions'

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
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    await repairLegacyC2Completion(currentUser.id)
    const journey = await getJourneyForCurrentUser()
    if (!journey) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const moduleValue = new URL(request.url).searchParams.get('module')
    const access = getModuleAccess(journey.state, journey.profile)

    if (!moduleValue) {
      return NextResponse.json({
        success: true,
        currentModule: journey.state.currentModule,
        access,
        completed: {
          a1: Boolean(journey.state.a1CompletedAt),
          a2: Boolean(journey.state.a2CompletedAt),
          // A4 only unlocks after the persisted A3 route closure.
          a3: Boolean(journey.state.a4UnlockedAt),
          a4: journey.state.currentModule === 'COMPLETED',
        },
      })
    }

    const module = MODULES.includes(
      moduleValue as Exclude<JourneyModule, 'COMPLETED'>,
    )
      ? (moduleValue as Exclude<JourneyModule, 'COMPLETED'>)
      : null
    if (!module) {
      return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 })
    }

    const canAccess = access[module.toLowerCase() as keyof typeof access]

    return NextResponse.json({
      success: true,
      module,
      canAccess,
      reason: canAccess ? 'Acceso habilitado' : 'Recorrido anterior incompleto',
      nextPath: canAccess
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
