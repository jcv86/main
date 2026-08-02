import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Brain, Check, Compass, Lock, Radar, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getCanonicalNextPath, getJourneyForCurrentUser } from '@/lib/journey/service'
import {
  PRODUCT_STAGE_ORDER,
  PRODUCT_STAGES,
  type InternalJourneyStage,
} from '@/lib/dtc/product-language'

const STAGE_ICONS = {
  A1: Brain,
  A2: Compass,
  A3: Target,
  A4: Radar,
} as const

export default async function DashboardPage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')

  const { user, state, access, profile } = journey
  const name =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split('@')[0] ??
    'Profesional'
  const completedDays = state.a2CompletedAt
    ? 90
    : Math.max(0, Math.min(89, state.highestA2DayUnlocked - 1))
  const progress = Math.round((completedDays / 90) * 100)
  const nextPath = await getCanonicalNextPath(profile)
  const onboardingPending = nextPath !== PRODUCT_STAGES.A2.href

  const stageStatus = (id: InternalJourneyStage) => {
    const isAccessible = access[id.toLowerCase() as keyof typeof access]
    if (!isAccessible) return 'locked' as const
    if (id === 'A1' && state.a1CompletedAt) return 'completed' as const
    if (id === 'A2' && state.a2CompletedAt) return 'completed' as const
    if (state.currentModule === id) return 'active' as const
    return 'available' as const
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:py-14">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Tu trayectoria
            </p>
            <h1 className="text-balance text-3xl font-bold sm:text-4xl">
              Hola, {name}
            </h1>
            <p className="max-w-2xl text-pretty text-muted-foreground">
              Un solo recorrido conecta tu diagnóstico, tu ruta, el entrenamiento y las señales del mercado.
            </p>
          </div>
          <Button asChild>
            <Link
              href={
                onboardingPending
                  ? nextPath
                  : `/despega/a2/dia-${state.highestA2DayUnlocked}`
              }
            >
              {onboardingPending
                ? 'Continuar configuración'
                : `Continuar día ${state.highestA2DayUnlocked}`}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </header>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle>{PRODUCT_STAGES.A2.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Día {state.highestA2DayUnlocked} habilitado · {completedDays} días completados
              </p>
            </div>
            <span className="text-2xl font-bold text-primary">{progress}%</span>
          </CardHeader>
          <CardContent>
            <Progress value={progress} aria-label={`${progress}% de la ruta completada`} />
          </CardContent>
        </Card>

        <section aria-labelledby="stages-heading" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="stages-heading" className="text-2xl font-bold">
              Tu recorrido conectado
            </h2>
            <p className="text-sm text-muted-foreground">
              Cada etapa utiliza la evidencia producida por la anterior.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {PRODUCT_STAGE_ORDER.map((stageId) => {
              const stage = PRODUCT_STAGES[stageId]
              const status = stageStatus(stageId)
              const Icon = STAGE_ICONS[stageId]
              const locked = status === 'locked'

              return (
                <Card
                  key={stageId}
                  className={locked ? 'opacity-65' : 'border-primary/25'}
                  data-stage-id={stageId}
                >
                  <CardContent className="flex h-full flex-col gap-5 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h3 className="font-semibold">{stage.name}</h3>
                      </div>
                      <span className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                        {status === 'completed' ? (
                          <Check className="h-3.5 w-3.5 text-primary" />
                        ) : locked ? (
                          <Lock className="h-3.5 w-3.5" />
                        ) : null}
                        {status === 'completed'
                          ? 'Completado'
                          : status === 'active'
                            ? 'En curso'
                            : locked
                              ? 'Bloqueado'
                              : 'Disponible'}
                      </span>
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                      {stage.shortDescription}
                    </p>
                    <Button
                      asChild={!locked}
                      variant={status === 'active' ? 'default' : 'outline'}
                      disabled={locked}
                      className="w-full"
                    >
                      {locked ? (
                        <span>Completa la etapa anterior</span>
                      ) : (
                        <Link href={stage.href}>
                          {stage.actionLabel}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
