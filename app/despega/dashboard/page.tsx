import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  Brain,
  Check,
  Compass,
  Lock,
  Radar,
  Sparkles,
  Target,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  PageContainer,
  PageHeader,
  PageSection,
  PageStack,
} from '@/components/layout/page-foundation'
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

  const continueAction = onboardingPending
    ? {
        href: nextPath,
        label: 'Continuar configuración',
        title: 'Completa la base de tu recorrido',
        description: 'Necesitamos cerrar tu configuración inicial para ordenar las siguientes etapas.',
      }
    : access.a4
      ? {
          href: PRODUCT_STAGES.A4.href,
          label: 'Abrir Radar Estratégico',
          title: 'Tu siguiente lectura está en el mercado',
          description: 'Revisa señales verificadas y conecta tu evolución con oportunidades reales.',
        }
      : state.currentModule === 'A3'
        ? {
            href: PRODUCT_STAGES.A3.href,
            label: 'Continuar Entrenamiento',
            title: 'Sigue entrenando con situaciones reales',
            description: 'Cada práctica agrega evidencia nueva a tu identidad profesional.',
          }
        : {
            href: `/despega/a2/dia-${state.highestA2DayUnlocked}`,
            label: `Continuar día ${state.highestA2DayUnlocked}`,
            title: 'Tu ruta tiene un siguiente paso claro',
            description: 'Avanza con una acción concreta y mantén conectado tu progreso.',
          }

  const stageStatus = (id: InternalJourneyStage) => {
    const isAccessible = access[id.toLowerCase() as keyof typeof access]
    if (!isAccessible) return 'locked' as const
    if (id === 'A1' && state.a1CompletedAt) return 'completed' as const
    if (id === 'A2' && state.a2CompletedAt) return 'completed' as const
    if (id === 'A3' && access.a4) return 'completed' as const
    if (id === 'A4' && access.a4) return 'active' as const
    if (state.currentModule === id) return 'active' as const
    return 'available' as const
  }

  const completedStages = PRODUCT_STAGE_ORDER.filter((stageId) => stageStatus(stageId) === 'completed').length
  const activeStage = PRODUCT_STAGE_ORDER.find((stageId) => stageStatus(stageId) === 'active') ?? 'A1'

  return (
    <PageContainer>
      <PageStack>
        <PageHeader
          eyebrow="Tu evolución profesional"
          title={`Hola, ${name}`}
          description="Tu recorrido conecta autoconocimiento, dirección, práctica y señales del mercado en un solo sistema."
        />

        <PageSection>
          <Card className="overflow-hidden border-[hsl(var(--primary)/0.28)] bg-[hsl(var(--primary)/0.08)]">
            <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="space-y-5">
                <Badge variant="secondary">Siguiente acción</Badge>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{continueAction.title}</h2>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    {continueAction.description}
                  </p>
                </div>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href={continueAction.href}>
                    {continueAction.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid min-w-56 gap-4 rounded-[var(--dtc-radius-lg)] border border-border bg-card/72 p-5 shadow-[var(--dtc-shadow-sm)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Etapa actual</p>
                  <p className="mt-1 text-lg font-bold text-foreground">{PRODUCT_STAGES[activeStage].name}</p>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>Ruta A2</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} aria-label={`${progress}% de la ruta completada`} />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Día {state.highestA2DayUnlocked} habilitado · {completedDays} completados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        <PageSection
          title="Tu evolución, de un vistazo"
          description="Primero contexto; después métricas."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Etapas completadas</p>
                <p className="mt-3 text-3xl font-bold">{completedStages} de 4</p>
                <p className="mt-2 text-sm text-muted-foreground">Cada etapa fortalece la siguiente.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Consistencia</p>
                <p className="mt-3 text-3xl font-bold">{completedDays} días</p>
                <p className="mt-2 text-sm text-muted-foreground">Progreso verificable dentro de tu ruta.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Career Identity</p>
                <div className="mt-3 flex items-center gap-2 text-foreground">
                  <Sparkles className="h-5 w-5 text-[hsl(var(--dtc-indigo-300))]" />
                  <p className="text-lg font-bold">En evolución</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Se actualiza con evidencia real de tu recorrido.</p>
              </CardContent>
            </Card>
          </div>
        </PageSection>

        {access.a4 ? (
          <PageSection>
            <Card className="border-[hsl(var(--success)/0.28)] bg-[hsl(var(--success)/0.08)]">
              <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--dtc-radius-md)] border border-[hsl(var(--success)/0.28)] bg-[hsl(var(--success)/0.12)] text-success">
                    <Radar className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold">Radar Estratégico disponible</h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Tu entrenamiento ya puede contrastarse con señales verificadas del mercado.
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href={PRODUCT_STAGES.A4.href}>Abrir Radar</Link>
                </Button>
              </CardContent>
            </Card>
          </PageSection>
        ) : null}

        <PageSection
          title="Tu recorrido conectado"
          description="Cada etapa utiliza la evidencia producida por la anterior."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {PRODUCT_STAGE_ORDER.map((stageId) => {
              const stage = PRODUCT_STAGES[stageId]
              const status = stageStatus(stageId)
              const Icon = STAGE_ICONS[stageId]
              const locked = status === 'locked'

              return (
                <Card key={stageId} className={locked ? 'opacity-65' : undefined} data-stage-id={stageId}>
                  <CardContent className="flex h-full flex-col gap-5 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-[var(--dtc-radius-md)] border border-border bg-muted/55 text-foreground">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h3 className="font-semibold">{stage.name}</h3>
                      </div>
                      <Badge
                        variant={
                          status === 'completed'
                            ? 'success'
                            : status === 'active'
                              ? 'default'
                              : locked
                                ? 'outline'
                                : 'secondary'
                        }
                      >
                        {status === 'completed' ? (
                          <Check className="h-3.5 w-3.5" />
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
                      </Badge>
                    </div>
                    <p className="flex-1 text-sm leading-6 text-muted-foreground">{stage.shortDescription}</p>
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
        </PageSection>
      </PageStack>
    </PageContainer>
  )
}
