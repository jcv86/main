'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getDemoUser } from '@/lib/auth/demo-user'
import {
  Trophy,
  Flame,
  Zap,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  Star,
  Award,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

interface GamificationProfile {
  total_xp: number
  current_level: number
  xp_to_next_level: number
  daily_streak: number
  level_title?: string
}

interface PilarProgress {
  pilar: string
  estado: Record<string, unknown>
  progress_percentage?: number
  score?: number
}

interface RankingEntry {
  user_id: string
  score_general: number
  rank_position: number
  score_ritual?: number
  score_exploration?: number
  score_training?: number
  score_reality?: number
}

interface MisionUser {
  id: string
  status: string
  completed_at?: string
  mision?: {
    titulo: string
    descripcion: string
    tipo: string
    puntos: number
    duracion_minutos: number
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PILLAR_CONFIG = {
  ritual: {
    label: 'El Ritual',
    color: 'rgb(80,160,170)',
    bgColor: 'rgba(80,160,170,0.12)',
    borderColor: 'rgba(80,160,170,0.3)',
    href: '/despega/a1/resultado',
  },
  exploration: {
    label: 'Exploración',
    color: 'rgb(124,92,255)',
    bgColor: 'rgba(124,92,255,0.12)',
    borderColor: 'rgba(124,92,255,0.3)',
    href: '/despega/a2/recomendaciones',
  },
  training: {
    label: 'Entrenamiento',
    color: 'rgb(192,80,192)',
    bgColor: 'rgba(192,80,192,0.12)',
    borderColor: 'rgba(192,80,192,0.3)',
    href: '/despega/a3',
  },
  reality: {
    label: 'La Realidad',
    color: 'rgb(225,120,130)',
    bgColor: 'rgba(225,120,130,0.12)',
    borderColor: 'rgba(225,120,130,0.3)',
    href: '/despega/a4',
  },
}

const LEVEL_TITLES = [
  'Explorador',
  'Aprendiz',
  'Practicante',
  'Avanzado',
  'Experto',
  'Maestro',
  'Élite',
]

function getLevelTitle(level: number) {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] ?? 'Leyenda'
}

function xpForLevel(level: number) {
  return Math.round(100 * Math.pow(1.4, level - 1))
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}22` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-xs text-white/50 font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div>
        <p className="text-3xl font-bold text-white leading-none">{value}</p>
        {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

function XPCard({ profile }: { profile: GamificationProfile }) {
  const levelTitle = getLevelTitle(profile.current_level)
  const xpNeeded = xpForLevel(profile.current_level)
  const xpProgress = profile.xp_to_next_level
    ? Math.max(0, xpNeeded - profile.xp_to_next_level)
    : profile.total_xp % xpNeeded
  const pct = Math.min(100, Math.round((xpProgress / xpNeeded) * 100))

  return (
    <div
      className="rounded-2xl p-6 col-span-2"
      style={{ backgroundColor: 'rgba(80,160,170,0.08)', border: '1px solid rgba(80,160,170,0.2)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Nivel actual</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white">{profile.current_level}</span>
            <span className="text-lg font-semibold" style={{ color: 'rgb(80,160,170)' }}>{levelTitle}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/50 mb-0.5">XP Total</p>
          <p className="text-2xl font-bold text-white">{profile.total_xp.toLocaleString()}</p>
        </div>
      </div>

      {/* XP bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-white/40">
          <span>{xpProgress.toLocaleString()} XP</span>
          <span>{xpNeeded.toLocaleString()} para nivel {profile.current_level + 1}</span>
        </div>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: 'rgb(80,160,170)' }}
          />
        </div>
        <p className="text-xs text-white/30">{pct}% completado</p>
      </div>
    </div>
  )
}

function PillarCard({
  pilarKey,
  score,
}: {
  pilarKey: keyof typeof PILLAR_CONFIG
  score: number
}) {
  const cfg = PILLAR_CONFIG[pilarKey]
  const pct = Math.min(100, Math.round(score))

  return (
    <Link href={cfg.href}>
      <div
        className="rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02]"
        style={{ backgroundColor: cfg.bgColor, border: `1px solid ${cfg.borderColor}` }}
      >
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm font-semibold text-white/90">{cfg.label}</p>
          <ChevronRight className="w-4 h-4 text-white/30" />
        </div>
        <p className="text-2xl font-black mb-3" style={{ color: cfg.color }}>
          {score > 0 ? `${Math.round(score)}` : '—'}
          {score > 0 && <span className="text-base font-medium text-white/40"> pts</span>}
        </p>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: cfg.color }}
          />
        </div>
        <p className="text-xs mt-1.5" style={{ color: cfg.color, opacity: 0.7 }}>{pct}%</p>
      </div>
    </Link>
  )
}

function LeaderboardCard({ entry, rank, isMe }: { entry: RankingEntry; rank: number; isMe: boolean }) {
  const medalColors = ['rgb(255,215,0)', 'rgb(192,192,192)', 'rgb(205,127,50)']
  const isMedal = rank <= 3

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
      style={{
        backgroundColor: isMe ? 'rgba(80,160,170,0.12)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isMe ? 'rgba(80,160,170,0.3)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <div className="w-6 text-center flex-shrink-0">
        {isMedal ? (
          <span className="text-base" style={{ color: medalColors[rank - 1] }}>
            {rank === 1 ? '1' : rank === 2 ? '2' : '3'}
          </span>
        ) : (
          <span className="text-sm font-semibold text-white/30">{rank}</span>
        )}
      </div>
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
        style={{ backgroundColor: 'rgba(80,160,170,0.4)' }}
      >
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isMe ? 'text-white' : 'text-white/70'}`}>
          {isMe ? 'Tú' : `Usuario ${rank}`}
        </p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Star className="w-3.5 h-3.5" style={{ color: 'rgb(80,160,170)' }} />
        <span className="text-sm font-bold text-white">{entry.score_general}</span>
      </div>
    </div>
  )
}

function MisionItem({ mision }: { mision: MisionUser }) {
  const isDone = mision.status === 'completed'
  const typeLabels: Record<string, string> = {
    interview: 'Entrevista',
    reflection: 'Reflexión',
    exercise: 'Ejercicio',
    reading: 'Lectura',
    task: 'Tarea',
  }

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl"
      style={{
        backgroundColor: isDone ? 'rgba(80,160,170,0.06)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isDone ? 'rgba(80,160,170,0.2)' : 'rgba(255,255,255,0.06)'}`,
        opacity: isDone ? 0.6 : 1,
      }}
    >
      <div className="mt-0.5 flex-shrink-0">
        {isDone ? (
          <CheckCircle2 className="w-4 h-4" style={{ color: 'rgb(80,160,170)' }} />
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-white/20" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isDone ? 'line-through text-white/40' : 'text-white/90'}`}>
          {mision.mision?.titulo ?? 'Misión'}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {mision.mision?.tipo && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/40">
              {typeLabels[mision.mision.tipo] ?? mision.mision.tipo}
            </span>
          )}
          {mision.mision?.duracion_minutos && (
            <span className="flex items-center gap-1 text-[10px] text-white/30">
              <Clock className="w-3 h-3" />
              {mision.mision.duracion_minutos} min
            </span>
          )}
        </div>
      </div>
      {mision.mision?.puntos && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <Zap className="w-3 h-3 text-yellow-400/60" />
          <span className="text-xs text-white/40">{mision.mision.puntos}</span>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function GamificacionDashboard() {
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<GamificationProfile | null>(null)
  const [pilares, setPilares] = useState<PilarProgress[]>([])
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [misiones, setMisiones] = useState<MisionUser[]>([])
  const [myRanking, setMyRanking] = useState<RankingEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      let uid = user?.id ?? null

      if (!uid) {
        const demo = getDemoUser()
        if (demo) uid = demo.id
      }

      if (!uid) { setLoading(false); return }
      setUserId(uid)

      // Fetch all in parallel
      const [xpRes, pilaresRes, rankingsRes, misionesRes] = await Promise.all([
        supabase
          .from('user_gamification_profile')
          .select('total_xp,current_level,xp_to_next_level,daily_streak')
          .eq('user_id', uid)
          .maybeSingle(),
        supabase
          .from('despega_pilar_progress')
          .select('pilar,estado,progress_percentage,score')
          .eq('user_id', uid),
        supabase
          .from('despega_rankings')
          .select('user_id,score_general,rank_position,score_ritual,score_exploration,score_training,score_reality')
          .order('score_general', { ascending: false })
          .limit(10),
        supabase
          .from('despega_user_misiones')
          .select('id,status,completed_at,mision:despega_misiones(titulo,descripcion,tipo,puntos,duracion_minutos)')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(8),
      ])

      // XP profile — fallback to defaults if no row yet
      setProfile(xpRes.data ?? {
        total_xp: 0,
        current_level: 1,
        xp_to_next_level: xpForLevel(1),
        daily_streak: 0,
      })

      setPilares(pilaresRes.data ?? [])
      setRankings(rankingsRes.data ?? [])
      setMyRanking(
        (rankingsRes.data ?? []).find((r: RankingEntry) => r.user_id === uid) ?? null
      )
      setMisiones((misionesRes.data ?? []) as MisionUser[])
      setLoading(false)
    }

    init()
  }, [])

  // Build pilar score map from rankings row (most reliable source)
  const pilarScores: Record<string, number> = {
    ritual: myRanking?.score_ritual ?? 0,
    exploration: myRanking?.score_exploration ?? 0,
    training: myRanking?.score_training ?? 0,
    reality: myRanking?.score_reality ?? 0,
  }

  // Fill from pilar_progress if ranking has no sub-scores
  for (const p of pilares) {
    const k = p.pilar?.toLowerCase()
    if (k && pilarScores[k] === 0 && p.score) pilarScores[k] = p.score
  }

  const misionesActivas = misiones.filter((m) => m.status !== 'completed')
  const misionesCompletadas = misiones.filter((m) => m.status === 'completed')

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white text-balance">Mis Logros</h1>
          <p className="text-white/40 text-sm mt-1">Tu progreso en el programa DTC</p>
        </div>

        {/* Top stats row */}
        {profile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <XPCard profile={profile} />
            <StatCard
              icon={Flame}
              label="Racha"
              value={`${profile.daily_streak}d`}
              sub={profile.daily_streak > 0 ? 'días consecutivos' : 'Comienza hoy'}
              color="rgb(255,140,50)"
            />
            <StatCard
              icon={Trophy}
              label="Posición"
              value={myRanking?.rank_position ?? '—'}
              sub="en el ranking"
              color="rgb(255,215,0)"
            />
          </div>
        )}

        {/* Pillar progress */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-white/40" />
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Progreso por pilar</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.keys(PILLAR_CONFIG) as (keyof typeof PILLAR_CONFIG)[]).map((k) => (
              <PillarCard key={k} pilarKey={k} score={pilarScores[k] ?? 0} />
            ))}
          </div>
        </section>

        {/* Leaderboard + Misiones */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Leaderboard */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-white/40" />
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Top 10 ranking</h2>
            </div>
            <div className="space-y-2">
              {rankings.length === 0 && (
                <p className="text-sm text-white/30 px-1">Sin datos de ranking todavía.</p>
              )}
              {rankings.map((entry, i) => (
                <LeaderboardCard
                  key={entry.user_id}
                  entry={entry}
                  rank={entry.rank_position ?? i + 1}
                  isMe={entry.user_id === userId}
                />
              ))}
            </div>
            <Link href="/despega/rankings">
              <div className="mt-3 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer px-1">
                <span>Ver ranking completo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </section>

          {/* Misiones */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-white/40" />
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                Misiones
                {misionesActivas.length > 0 && (
                  <span
                    className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: 'rgba(80,160,170,0.2)', color: 'rgb(80,160,170)' }}
                  >
                    {misionesActivas.length} activas
                  </span>
                )}
              </h2>
            </div>

            <div className="space-y-2">
              {misiones.length === 0 && (
                <p className="text-sm text-white/30 px-1">No hay misiones asignadas todavía.</p>
              )}
              {misionesActivas.map((m) => (
                <MisionItem key={m.id} mision={m} />
              ))}
              {misionesCompletadas.slice(0, 3).map((m) => (
                <MisionItem key={m.id} mision={m} />
              ))}
            </div>

            {misionesCompletadas.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5 px-1">
                <Award className="w-3.5 h-3.5 text-white/20" />
                <span className="text-xs text-white/30">
                  {misionesCompletadas.length} misiones completadas
                </span>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  )
}
