import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileText,
  Radar,
  ShieldCheck,
  Target,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DailySnapshotHistory } from '@/components/a4/daily-snapshot-history'
import { EvidencePulse } from '@/components/a4/evidence-pulse'
import { StrategicRadarWorkspace } from '@/components/a4/strategic-radar-workspace'
import {
  normalizeA4DailySnapshot,
  type A4DailyEvidenceSnapshot,
} from '@/lib/a4/daily-snapshots'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { createAdminClient } from '@/lib/supabase/server'
import type { A4Decision, A4VerifiedSignal } from '@/lib/a4/strategic-radar'
import { getLiveUserProfile } from '@/lib/a4/profile-snapshot'
import { PageContainer, PageHeader, PageStack } from '@/components/layout/page-foundation'

function numberValue(value: unknown): number | null {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function formatDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return 'Sin fecha registrada'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha registrada'
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'long',
    timeZone: 'America/Santiago',
  }).format(date)
}

export default async function RadarEstrategicoPage() {
  const journey = await getJourneyForCurrentUser()
  if (!journey) redirect('/auth/signin')
  if (!journey.access.a4) redirect('/despega/a3')

  const supabase = createAdminClient()
  const userId = journey.user.id
  const [
    a3Result,
    documentsResult,
    signalsResult,
    decisionsResult,
    snapshotsResult,
    liveProfile,
  ] = await Promise.all([
    supabase
      .from('a3_session_attempts')
      .select('module_id,status,score,created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('dtc_documents')
      .select('id,title,type,status,created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('a4_verified_signals')
      .select(
        'id,title,category,classification,summary,relevance,confidence,source_type,source_name,source_url,source_reference,source_date,source_verification_status,source_authority,source_checked_at,source_http_status,source_final_url,source_verification_note,status,created_at,updated_at',
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('a4_decision_log')
      .select(
        'id,signal_id,decision,rationale,expected_evidence,status,review_on,outcome,reviewed_at,review_classification,external_outcomes,created_at,updated_at',
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('a4_daily_evidence_snapshots')
      .select(
        'id,snapshot_date,timezone,priority,active_signals,facts,hypotheses,recent_signals,stale_signals,low_confidence_hypotheses,covered_categories,category_counts,overdue_reviews,reviews_today,reviews_next_7_days,reviews_later,open_decisions,closed_decisions,created_at,updated_at',
      )
      .eq('user_id', userId)
      .order('snapshot_date', { ascending: false })
      .limit(31),
    getLiveUserProfile(userId),
  ])

  if (a3Result.error) console.error('[v0] A4 A3 context error:', a3Result.error)
  if (documentsResult.error) {
    console.error('[v0] A4 document context error:', documentsResult.error)
  }
  if (signalsResult.error) console.error('[v0] A4 signal context error:', signalsResult.error)
  if (decisionsResult.error) {
    console.error('[v0] A4 decision context error:', decisionsResult.error)
  }
  if (snapshotsResult.error) {
    console.error('[v0] A4 snapshot history error:', snapshotsResult.error)
  }

  const loadFailures = [
    a3Result.error && 'progreso de Entrenamiento',
    documentsResult.error && 'documentos',
    signalsResult.error && 'señales verificadas',
    decisionsResult.error && 'decisiones',
    snapshotsResult.error && 'cortes diarios',
  ].filter((failure): failure is string => Boolean(failure))

  if (loadFailures.length > 0) {
    return (
      <PageContainer className="py-8">
        <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center">
          <Card
            role="alert"
            aria-live="assertive"
            className="w-full border-amber-400/30 bg-card"
          >
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-400/10 p-3 text-amber-300">
                  <AlertTriangle aria-hidden="true" className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                    Datos temporalmente no disponibles
                  </p>
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    No pudimos cargar tu Radar
                  </h1>
                  <p className="leading-relaxed text-muted-foreground">
                    No mostramos cifras parciales para evitar que un problema temporal
                    parezca un resultado real. Tus datos no fueron reemplazados ni
                    reiniciados.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-sm font-medium text-foreground">
                  Secciones pendientes de recuperar:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {loadFailures.map((failure) => (
                    <li key={failure}>{failure}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <form action="/despega/a4" method="get">
                  <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-400">
                    Reintentar
                  </Button>
                </form>
                <Button asChild variant="outline" className="border-border">
                  <Link href="/despega">Volver al panel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    )
  }

  const completedSessions = (a3Result.data ?? []).filter(
    (session) => session.status === 'completed',
  )
  const uniqueModules = new Set(
    completedSessions
      .map((session) => textValue(session.module_id))
      .filter(Boolean),
  )
  const scores = completedSessions
    .map((session) => numberValue(session.score))
    .filter((score): score is number => score !== null)
  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : null
  const documents = documentsResult.data ?? []
  const signals = (signalsResult.data ?? []) as A4VerifiedSignal[]
  const decisions = (decisionsResult.data ?? []) as A4Decision[]
  const snapshots: A4DailyEvidenceSnapshot[] = (snapshotsResult.data ?? []).map(
    (row) => normalizeA4DailySnapshot(row as Record<string, unknown>),
  )

  return (
    <PageContainer>
      <PageStack>
        <PageHeader
          eyebrow="A4 · Radar Estratégico"
          title="Bitácora de Señales y Decisiones"
          description="Conecta señales externas con tu evidencia profesional, distingue hechos de hipótesis y convierte el contexto del mercado en decisiones revisables."
          actions={
            <Badge className="border-rose-400/30 bg-rose-400/10 text-rose-700 dark:text-rose-200">
              Evidencia antes que opinión
            </Badge>
          }
        />
        <div className="space-y-8">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="ghost" className="text-muted-foreground">
              <Link href="/despega">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al panel
              </Link>
            </Button>
            <Badge className="border-rose-400/30 bg-rose-400/10 text-rose-200">
              Radar Estratégico · A4
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
              El Radar conserva fuente, fecha y clasificación de cada señal: no inventa noticias, puntajes ni conclusiones para completar espacios vacíos.
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 lg:min-w-72">
              <p className="flex items-center gap-2 font-semibold text-emerald-200">
                <CheckCircle2 className="h-5 w-5" /> Acceso verificado
              </p>
              <p className="mt-2 text-sm text-emerald-100/70">
                Habilitado por el cierre persistido de Entrenamiento.
              </p>
              <p className="mt-3 text-xs text-emerald-100/50">
                {formatDate(journey.state.a4UnlockedAt)}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Módulos A3 verificados',
              value: `${uniqueModules.size}/10`,
              detail: `${completedSessions.length} sesiones persistidas`,
              icon: <Target className="h-5 w-5 text-emerald-400" />,
            },
            {
              label: 'Promedio de Entrenamiento',
              value: averageScore === null ? '—' : `${averageScore}/100`,
              detail: 'Calculado solo desde sesiones completadas',
              icon: <BarChart3 className="h-5 w-5 text-cyan-400" />,
            },
            {
              label: 'Documentos disponibles',
              value: documents.length,
              detail: 'Contexto persistido de A1, A2 y A3',
              icon: <FileText className="h-5 w-5 text-purple-400" />,
            },
            {
              label: 'Contrato de evidencia',
              value: 'Activo',
              detail: 'Fuente, fecha y clasificación obligatorias',
              icon: <ShieldCheck className="h-5 w-5 text-rose-300" />,
            },
          ].map((item) => (
            <Card key={item.label} className="border-border bg-card">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  {item.icon}
                </div>
                <p className="text-3xl font-bold text-foreground">{item.value}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-rose-400/25 bg-gradient-to-br from-rose-400/10 to-purple-500/5">
          <CardContent className="grid gap-4 p-6 md:grid-cols-3">
            {[
              ['1', 'Registrar', 'Describe una señal y conserva la evidencia que permite revisarla.'],
              ['2', 'Distinguir', 'Marca si es un hecho verificado o una hipótesis todavía abierta.'],
              ['3', 'Revisar', 'Vincula decisiones a evidencia futura y registra el resultado observado.'],
            ].map(([number, title, detail]) => (
              <div key={number} className="rounded-xl border border-white/10 bg-muted/30 p-4">
                <p className="text-xs font-semibold text-rose-300">PASO {number}</p>
                <p className="mt-2 font-semibold text-foreground">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-cyan-400/25 bg-gradient-to-br from-cyan-400/10 via-slate-900/70 to-emerald-400/5">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Tu preparación para actuar
                </p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">
                  Lo que A1, A2 y A3 ya saben de ti
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  El Radar usa tu evidencia persistida para convertir oportunidades en decisiones
                  concretas. Estos indicadores no reemplazan una evaluación humana ni inventan
                  información cuando todavía falta evidencia.
                </p>
              </div>
              {liveProfile?.targetRole ? (
                <Badge className="w-fit border-cyan-400/30 bg-cyan-400/10 text-cyan-100">
                  Objetivo: {liveProfile.targetRole}
                </Badge>
              ) : null}
            </div>

            {liveProfile ? (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ['Preparación para postular', liveProfile.applicationReadiness],
                    ['CV', liveProfile.cvReadiness],
                    ['Entrevista', liveProfile.interviewReadiness],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-xl border border-white/10 bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="mt-2 text-3xl font-bold text-foreground">{Number(value)}/100</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                    <p className="font-semibold text-emerald-200">Fortalezas que ya puedes usar</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {(liveProfile.strengths.length ? liveProfile.strengths.slice(0, 3) : ['Aún falta evidencia suficiente para destacar fortalezas.']).map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                    <p className="font-semibold text-amber-200">Brechas antes de postular</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {(liveProfile.missingProof.length ? liveProfile.missingProof.slice(0, 3) : ['No hay brechas de evidencia prioritarias registradas.']).map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                    <p className="font-semibold text-cyan-200">Siguiente mejor acción</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {(liveProfile.nextBestActions.length ? liveProfile.nextBestActions.slice(0, 3) : ['Registra evidencia y objetivos para recibir acciones personalizadas.']).map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-white/10 bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground">
                Todavía no hay suficiente evidencia consolidada para construir tu perfil de acción.
                Puedes seguir usando el Radar y completar entregables de A1–A3; el perfil se irá
                enriqueciendo sin bloquearte.
              </div>
            )}
          </CardContent>
        </Card>

        <EvidencePulse signals={signals} decisions={decisions} />

        <DailySnapshotHistory initialSnapshots={snapshots} />

        <div id="a4-workspace" className="scroll-mt-6">
          <StrategicRadarWorkspace
            initialSignals={signals}
            initialDecisions={decisions}
          />
        </div>

        <Card className="border-border bg-card">
          <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <Radar className="h-5 w-5 text-rose-300" /> El Radar conserva el contexto
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Puedes volver a Entrenamiento para revisar entregables. Las señales y
                decisiones permanecen separadas de los XP y no alteran resultados anteriores.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="shrink-0 border-border">
                <Link href="/despega/a3">Revisar Entrenamiento</Link>
              </Button>
              <Button asChild className="shrink-0 bg-rose-500 hover:bg-rose-400">
                <Link href="/despega/a4/resultados">Ver reporte A4</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </PageStack>
    </PageContainer>
  )
}
