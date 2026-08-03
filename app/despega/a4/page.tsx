import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  FileText,
  Radar,
  ShieldCheck,
  Target,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getSharedJourneyContext } from '@/lib/journey/service'

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
  const context = await getSharedJourneyContext()
  if (!context) redirect('/auth/signin')

  const completedSessions = context.a3.filter(
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
  const bestScore = scores.length > 0 ? Math.max(...scores) : null

  const strategicScore = context.a4.strategicScore
  const currentStrategicScore = numberValue(strategicScore?.score)
  const sevenDayAverage = numberValue(strategicScore?.score_7day_average)
  const strategicUpdatedAt =
    strategicScore?.last_updated_at || strategicScore?.updated_at
  const documents = context.a4.documents
  const unlockDate = context.state.a4UnlockedAt

  const summary = [
    {
      label: 'Módulos de Entrenamiento',
      value: `${uniqueModules.size}/10`,
      detail: `${completedSessions.length} sesiones completadas`,
      icon: <Target className="h-5 w-5 text-emerald-400" />,
    },
    {
      label: 'Puntaje promedio A3',
      value: averageScore === null ? '—' : `${averageScore}/100`,
      detail: bestScore === null ? 'Sin puntajes persistidos' : `Mejor resultado: ${bestScore}/100`,
      icon: <BarChart3 className="h-5 w-5 text-cyan-400" />,
    },
    {
      label: 'Documentos disponibles',
      value: documents.length,
      detail: 'Contexto persistido para análisis',
      icon: <FileText className="h-5 w-5 text-purple-400" />,
    },
    {
      label: 'Puntaje estratégico',
      value:
        currentStrategicScore === null
          ? '—'
          : `${Math.round(currentStrategicScore)}/100`,
      detail:
        sevenDayAverage === null
          ? 'Sin promedio reciente verificado'
          : `Promedio registrado: ${Math.round(sevenDayAverage)}/100`,
      icon: <Radar className="h-5 w-5 text-rose-300" />,
    },
  ]

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="ghost" className="text-slate-300">
              <Link href="/despega/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al panel
              </Link>
            </Button>
            <Badge className="border-rose-400/30 bg-rose-400/10 text-rose-200">
              Radar Estratégico · A4
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
                Contexto después de Entrenamiento
              </p>
              <h1 className="mt-3 text-4xl font-bold md:text-6xl">
                Radar Estratégico
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
                Este espacio reúne la evidencia que ya construiste y cualquier lectura
                estratégica guardada en tu cuenta. No inventa señales ni presenta datos
                externos como actuales sin una fuente y una fecha verificables.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 lg:min-w-72">
              <p className="flex items-center gap-2 font-semibold text-emerald-200">
                <CheckCircle2 className="h-5 w-5" /> Acceso verificado
              </p>
              <p className="mt-2 text-sm text-emerald-100/70">
                Desbloqueado al cerrar la ruta completa de Entrenamiento.
              </p>
              <p className="mt-3 text-xs text-emerald-100/50">
                {formatDate(unlockDate)}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map((item) => (
            <Card key={item.label} className="border-slate-800 bg-slate-900/70">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  {item.icon}
                </div>
                <p className="text-3xl font-bold text-white">{item.value}</p>
                <p className="text-xs leading-relaxed text-slate-500">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="border-slate-800 bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                Estado de tu lectura estratégica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {currentStrategicScore === null ? (
                <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5">
                  <p className="font-semibold text-amber-200">
                    No hay una lectura estratégica verificada todavía
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-amber-100/65">
                    El acceso a A4 está activo, pero la cuenta aún no tiene un puntaje o
                    análisis persistido. El sistema no completará ese vacío con contenido
                    simulado.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Puntaje registrado</p>
                      <p className="mt-1 text-4xl font-bold text-cyan-300">
                        {Math.round(currentStrategicScore)}/100
                      </p>
                    </div>
                    <p className="text-right text-xs text-slate-500">
                      Actualizado<br />{formatDate(strategicUpdatedAt)}
                    </p>
                  </div>
                  <Progress value={Math.max(0, Math.min(100, currentStrategicScore))} />
                  <p className="text-sm leading-relaxed text-slate-400">
                    Este valor se muestra tal como está almacenado. No se interpreta como
                    recomendación automática ni reemplaza una revisión de sus fuentes.
                  </p>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ['1', 'Reunir contexto', 'A1, Tu Ruta y Entrenamiento aportan evidencia.'],
                  ['2', 'Registrar señales', 'Cada lectura debe conservar fecha y procedencia.'],
                  ['3', 'Contrastar', 'Se distinguen hechos, hipótesis y decisiones pendientes.'],
                ].map(([number, title, description]) => (
                  <div key={number} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-xs font-semibold text-rose-300">PASO {number}</p>
                    <p className="mt-2 font-medium text-white">{title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-purple-400" />
                Evidencia disponible
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.length === 0 ? (
                <p className="rounded-xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-400">
                  No hay documentos guardados en esta cuenta.
                </p>
              ) : (
                documents.slice(0, 8).map((document) => (
                  <div
                    key={textValue(document.id) || `${document.name}-${document.created_at}`}
                    className="flex items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">
                        {textValue(document.name) || 'Documento sin nombre'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {textValue(document.document_type) || 'Tipo no registrado'} ·{' '}
                        {formatDate(document.created_at)}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs text-slate-300">
                      {textValue(document.status) || 'registrado'}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <Card className="border-rose-400/25 bg-gradient-to-br from-rose-400/10 to-purple-500/5">
          <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-white">Tu recorrido permanece conectado</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                Puedes volver a Entrenamiento para revisar entregables. Repetir módulos no
                elimina el desbloqueo de A4 ni duplica XP.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 border-white/20">
              <Link href="/despega/a3">Revisar Entrenamiento</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
