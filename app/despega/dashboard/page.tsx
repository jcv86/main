import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Brain, Briefcase, Check, Compass, Lock, Radar, Sparkles, Target } from 'lucide-react'
import { PageContainer, PageHeader, PageSection, PageStack } from '@/components/layout/page-foundation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getCanonicalNextPath, getJourneyForCurrentUser } from '@/lib/journey/service'
import { loadJourneyFlow } from '@/lib/journey/flow-service'
import { PRODUCT_STAGE_ORDER, PRODUCT_STAGES, type InternalJourneyStage } from '@/lib/dtc/product-language'

const STAGE_ICONS = { A1: Brain, A2: Compass, A3: Target, A4: Radar } as const

export default async function DashboardPage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')
  const { user, access, profile } = journey
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Profesional'
  const flow = await loadJourneyFlow(journey)
  const completedDays = flow.cycleCompletedDays
  const progress = flow.cycleProgress
  const nextPath = await getCanonicalNextPath(profile)
  const onboardingPending = nextPath !== PRODUCT_STAGES.A2.href
  const continueAction = flow.next
  const stageStatus = (id: InternalJourneyStage) => flow.cards.find((card) => card.id === id)!.state
  const completedStages = PRODUCT_STAGE_ORDER.filter((id) => stageStatus(id) === 'completed').length

  return (
    <PageContainer>
      <PageStack>
        <PageHeader eyebrow="Tu trayectoria" title={`Hola, ${name}`} description="Tu autoconocimiento, tu ruta, el entrenamiento y las señales del mercado viven en un solo recorrido conectado."
          actions={<Button asChild className="bg-emerald-700 text-white hover:bg-emerald-800"><Link href={continueAction.href}>{continueAction.label}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>} />
        <section aria-labelledby="next-action-title" className="overflow-hidden rounded-[var(--dtc-radius-xl)] border border-[hsl(var(--primary)/0.24)] bg-[hsl(var(--primary)/0.08)] shadow-[var(--dtc-shadow-md)]">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--dtc-indigo-300))]">Tu siguiente acción</p>
              <h2 id="next-action-title" className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{continueAction.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{continueAction.description}</p>
              <Button asChild className="mt-6 bg-emerald-700 text-white hover:bg-emerald-800"><Link href={continueAction.href}>{continueAction.label}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
            </div>
            <div className="rounded-[var(--dtc-radius-lg)] border border-border bg-background/72 p-5 shadow-[var(--dtc-shadow-sm)]">
              <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Tu Ruta</p><p className="mt-1 text-sm font-semibold">{onboardingPending ? 'Completa tu punto de partida' : `Día ${flow.resumeDay} para retomar`}</p></div><span className="text-2xl font-bold text-primary">{progress}%</span></div>
              <Progress value={progress} aria-label={`${progress}% del ciclo de ${flow.activeHorizon} días completado`} className="mt-4" />
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{completedDays} de {flow.activeHorizon} días con finalización registrada. Un día habilitado no se cuenta como completado.</p>
            </div>
          </div>
        </section>
        <PageSection title="Tu evolución, de un vistazo" description="Primero contexto; después métricas.">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardContent className="p-6"><span className="flex h-10 w-10 items-center justify-center rounded-[var(--dtc-radius-md)] bg-[hsl(var(--primary)/0.12)] text-primary"><Briefcase className="h-5 w-5" aria-hidden="true" /></span><p className="mt-5 text-3xl font-bold">{completedStages}/4</p><p className="mt-1 text-sm font-semibold">Etapas completadas</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Cada etapa conserva evidencia útil para la siguiente.</p></CardContent></Card>
            <Card><CardContent className="p-6"><span className="flex h-10 w-10 items-center justify-center rounded-[var(--dtc-radius-md)] bg-[hsl(var(--primary)/0.12)] text-primary"><Sparkles className="h-5 w-5" aria-hidden="true" /></span><p className="mt-5 text-lg font-bold">Career Identity</p><p className="mt-1 text-sm font-semibold">Tu evidencia profesional conectada</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Distingue preferencias, práctica, decisiones y avance con sus fuentes.</p><Button asChild variant="link" className="mt-3 px-0"><Link href="/despega/career-identity">Ver identidad profesional</Link></Button></CardContent></Card>
            <Card><CardContent className="p-6"><span className="flex h-10 w-10 items-center justify-center rounded-[var(--dtc-radius-md)] bg-[hsl(var(--primary)/0.12)] text-primary"><Radar className="h-5 w-5" aria-hidden="true" /></span><p className="mt-5 text-lg font-bold">Radar Estratégico</p><p className="mt-1 text-sm font-semibold">{flow.radarAvailable ? 'Radar Estratégico desbloqueado' : 'Requiere cierre verificado de A3'}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{flow.radarAvailable ? 'Ya puedes contrastar tu recorrido con señales verificadas del mercado.' : 'Completa el entrenamiento y verifica su cierre antes de ingresar a A4.'}</p>{flow.radarAvailable && <Button asChild variant="link" className="mt-3 px-0"><Link href={PRODUCT_STAGES.A4.href}>Abrir Radar Estratégico</Link></Button>}</CardContent></Card>
          </div>
        </PageSection>
        <PageSection title="Tu recorrido conectado" description="Cada etapa conserva sus fuentes; ninguna cifra de A1 acredita una habilidad.">
          <div className="grid gap-4 md:grid-cols-2">{PRODUCT_STAGE_ORDER.map(stageId => {
            const stage=PRODUCT_STAGES[stageId],status=stageStatus(stageId),Icon=STAGE_ICONS[stageId],locked=status==='locked'
            const flowCard=flow.cards.find(card=>card.id===stageId)!
            return <Card key={stageId} data-stage-id={stageId}><CardContent className="flex h-full flex-col gap-5 p-6">
              <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-[var(--dtc-radius-md)] bg-[hsl(var(--primary)/0.1)] text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span><h3 className="font-semibold">{stage.name}</h3></div><span className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{status==='completed'?<Check className="h-3.5 w-3.5" aria-hidden="true"/>:locked?<Lock className="h-3.5 w-3.5" aria-hidden="true"/>:null}{status==='completed'?'Completado':status==='active'?'En curso':locked?'Bloqueado':'Disponible'}</span></div>
              <p className="flex-1 text-sm leading-6 text-muted-foreground">{stage.shortDescription}</p><p className="text-xs leading-relaxed text-muted-foreground">{flowCard.detail}</p>
              <Button asChild={!locked} variant="outline" disabled={locked} className="w-full h-auto min-h-11 whitespace-normal">{locked?<span>{stageId==='A3'?'Primer checkpoint desde el Día 7':stageId==='A4'?'Requiere el cierre verificado de A3':'Completa tu punto de partida'}</span>:<Link href={flowCard.href || stage.href}>{stage.actionLabel}<ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" /></Link>}</Button>
            </CardContent></Card>
          })}</div>
        </PageSection>
        <Button asChild variant="outline"><Link href="/despega/recorrido">Ver mi recorrido A1–A4<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
      </PageStack>
    </PageContainer>
  )
}
