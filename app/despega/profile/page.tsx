import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  Check,
  Coins,
  Flame,
  Lock,
  LogOut,
  Settings,
  Trophy,
  User,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  PRODUCT_STAGE_ORDER,
  PRODUCT_STAGES,
  type InternalJourneyStage,
} from '@/lib/dtc/product-language'
import { getGamificationSummary } from '@/lib/gamification/server-summary'
import { getJourneyForCurrentUser } from '@/lib/journey/service'

function clampProgress(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export default async function ProfilePage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')

  const { user, state, access } = journey
  const gamification = await getGamificationSummary(user.id)
  const completedDays = state.a2CompletedAt
    ? 90
    : Math.max(0, state.highestA2DayUnlocked - 1)

  const stageProgress: Record<InternalJourneyStage, number> = {
    A1: state.a1CompletedAt ? 100 : 0,
    A2: clampProgress((completedDays / 90) * 100),
    A3: gamification.training.progress,
    A4: gamification.radar.progress,
  }

  const overallProgress = clampProgress(
    PRODUCT_STAGE_ORDER.reduce(
      (sum, stageId) => sum + stageProgress[stageId],
      0,
    ) / PRODUCT_STAGE_ORDER.length,
  )
  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split('@')[0] ??
    'Profesional'

  const stageStatus = (stageId: InternalJourneyStage) => {
    const allowed = access[stageId.toLowerCase() as keyof typeof access]
    if (!allowed) return 'locked' as const
    if (stageProgress[stageId] >= 100) return 'completed' as const
    if (state.currentModule === stageId || stageProgress[stageId] > 0) {
      return 'active' as const
    }
    return 'available' as const
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:py-14">
        <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <User className="h-7 w-7" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Perfil vivo
              </p>
              <h1 className="text-3xl font-bold sm:text-4xl">{displayName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Tu progreso se construye con la evidencia real de cada etapa.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/despega/settings">
                <Settings className="mr-2 h-4 w-4" />
                Preferencias
              </Link>
            </Button>
            <form action="/api/auth/signout" method="post">
              <Button type="submit" variant="ghost">
                <LogOut className="mr-2 h-4 w-4" />
                Salir
              </Button>
            </form>
          </div>
        </header>

        <Card>
          <CardContent className="grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm text-muted-foreground">Cuenta activa</p>
              <p className="mt-1 font-medium">{user.email ?? 'Sesión demo de DTC'}</p>
            </div>
            <div className="min-w-64 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Avance global</span>
                <span className="font-semibold text-primary">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} />
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Resumen de progreso">
          <MetricCard
            icon={Zap}
            label="Experiencia acumulada"
            value={gamification.totalXp.toLocaleString('es-CL')}
            detail={`${gamification.xpToNextLevel.toLocaleString('es-CL')} XP para el próximo nivel`}
          />
          <MetricCard
            icon={Trophy}
            label="Nivel actual"
            value={String(gamification.currentLevel)}
            detail={gamification.levelLabel}
          />
          <MetricCard
            icon={Coins}
            label="Puntos DTC"
            value={gamification.totalPoints.toLocaleString('es-CL')}
            detail="Saldo disponible"
          />
          <MetricCard
            icon={Flame}
            label="Racha"
            value={String(gamification.dailyStreak)}
            detail="días consecutivos"
          />
        </section>

        <section className="space-y-4" aria-labelledby="profile-journey-heading">
          <div>
            <h2 id="profile-journey-heading" className="text-2xl font-bold">
              Tu recorrido conectado
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Diagnóstico, acción, práctica y contexto comparten un único estado de avance.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {PRODUCT_STAGE_ORDER.map((stageId) => {
              const stage = PRODUCT_STAGES[stageId]
              const status = stageStatus(stageId)
              const locked = status === 'locked'

              return (
                <Card key={stageId} data-stage-id={stageId} className={locked ? 'opacity-65' : ''}>
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                      <CardTitle>{stage.name}</CardTitle>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {stage.shortDescription}
                      </p>
                    </div>
                    <Badge variant={status === 'active' ? 'default' : 'outline'}>
                      {status === 'completed' ? (
                        <Check className="mr-1 h-3.5 w-3.5" />
                      ) : locked ? (
                        <Lock className="mr-1 h-3.5 w-3.5" />
                      ) : null}
                      {status === 'completed'
                        ? 'Completado'
                        : status === 'active'
                          ? 'En curso'
                          : locked
                            ? 'Bloqueado'
                            : 'Disponible'}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span className="font-semibold">{stageProgress[stageId]}%</span>
                      </div>
                      <Progress value={stageProgress[stageId]} />
                    </div>
                    <Button asChild={!locked} disabled={locked} variant={status === 'active' ? 'default' : 'outline'} className="w-full">
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

        {gamification.badges.length > 0 && (
          <section className="space-y-3" aria-labelledby="achievements-heading">
            <h2 id="achievements-heading" className="text-xl font-bold">Logros</h2>
            <div className="flex flex-wrap gap-2">
              {gamification.badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="px-3 py-1.5">
                  {badge}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Zap
  label: string
  value: string
  detail: string
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <Icon className="h-6 w-6 text-primary" />
      </CardContent>
    </Card>
  )
}
