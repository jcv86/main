import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  Brain,
  Briefcase,
  Check,
  Compass,
  Lock,
  Radar,
  Sparkles,
  Target,
} from 'lucide-react'

import { PageContainer, PageHeader, PageSection, PageStack } from '@/components/layout/page-foundation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

  const continueAction = onboardingPending
    ? {
        href: nextPath,
        label: 'Continuar configuración',
        title: 'Completa tu punto de partida',
        description: 'Termina la configuración inicial para que el recorrido pueda adaptarse a tu contexto.',
      }
    : access.a4
      ? {
          href: PRODUCT_STAGES.A4.href,
          label: 'Abrir Radar Estratégico',
          title: 'Conecta tu avance con el mercado',
          description: 'Revisa señales verificadas y úsalas como contexto para tu siguiente decisión profesional.',
        }
      : state.currentModule === 'A3'
        ? {
            href: PRODUCT_STAGES.A3.href,
            label: 'Continuar Entrenamiento',
            title: 'Practica antes del momento decisivo',
            description: 'Retoma el entrenamiento activo y convierte tus aprendizajes en evidencia observable.',
          }
        : {
            href: `/despega/a2/dia-${state.highestA2DayUnlocked}`,
            label: `Continuar día ${state.highestA2DayUnlocked}`,
            title: 'Avanza un paso concreto hoy',
            description: 'Tu ruta está lista para continuar desde el último punto habilitado.',
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

  return (
    <PageContainer>
      <PageStack>
        <PageHeader
          eyebrow="Tu trayectoria"
          title={`Hola, ${name}`}
          description="Tu diagnóstico, tu ruta, el entrenamiento y las señales del mercado viven en un solo recorrido conectado."
          actions={
            <Button asChild>
              <Link href={continueAction.href}>
                {continueAction.label}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          }
        />

        <section
          aria-labelledby="next-action-title"
          className="overflow-hidden rounded-[var(--dtc-radius-xl)] border border-[hsl(var(--primary)/0.24)] bg-[hsl(var(--primary)/0.08)] shadow-[var(--dtc-shadow-md)]"
        >
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--dtc-indigo-300))]">
                Tu siguiente acción
              </p>
              <h2 id="next-action-title" className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {continueAction.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                {continueAction.description}
              </p>
              <Button asChild className="mt-6">
                <Link href={continueAction.href}>
                  {continueAction.label}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="rounded-[var(--dtc-radius-lg)] border border-border bg-background/72 p-5 shadow-[var(--dtc-shadow-sm)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Tu Ruta</p>
                  <p className="mt-1 text-sm font-semibold">Día {state.highestA2DayUnlocked} habilitado</p>
                </div>
                <span className="text-2xl font-bold text-primary">{progress}%</span>
              </div>
              <Progress value={progress} aria-label={`${progress}% de la ruta completada`} className="mt-4" />
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{completedDays} de 90 días completados.</p>
            </div>
          </div>
        </section>

        <PageSection title="Tu evolución, de un vistazo" description="Primero contexto; después métricas.">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--dtc-radius-md)] bg-[hsl(var(--primary)/0.12)] text-primary">
                  <Briefcase className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-5 text-3xl font-bold">{completedStages}/4</p>
                <p className="mt-1 text-sm font-semibold">Etapas completadas</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Cada etapa conserva evidencia útil para la siguiente.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--dtc-radius-md)] bg-[hsl(var(--primary)/0.12)] text-primary">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-5 text-lg font-bold">Career Identity</p>
                <p className="mt-1 text-sm font-semibold">Tu evidencia profesional conectada</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Reúne capacidades, decisiones y avance en una narrativa coherente.</p>
                <Button asChild variant="link" className="mt-3 px-0">
                  <Link href="/despega/career-identity">Ver identidad profesional</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--dtc-radius-md)] bg-[hsl(var(--primary)/0.12)] text-primary">
                  <Radar className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-5 text-lg font-bold">Radar Estratégico</p>
                <p className="mt-1 text-sm font-semibold">{access.a4 ? 'Disponible' : 'Se habilita al avanzar'}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {access.a4
                    ? 'Ya puedes contrastar tu recorrido con señales verificadas del mercado.'
                    : 'Completa las etapas previas para conectar tu progreso con el contexto externo.'}
                </p>
                {access.a4 ? (
                  <Button asChild variant="link" className="mt-3 px-0">
                    <Link href={PRODUCT_STAGES.A4.href}>Abrir Radar Estratégico</Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </PageSection>

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
                        <span className="flex h-11 w-11 items-center justify-center rounded-[var(--dtc-radius-md)] bg-[hsl(var(--primary)/0.1)] text-primary">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <h3 className="font-semibold">{stage.name}</h3>
                      </div>
                      <span className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                        {status === 'completed' ? (
                          <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                        ) : locked ? (
                          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
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
                          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
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
