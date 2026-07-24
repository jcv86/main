'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getDemoUser } from '@/lib/auth/demo-user'
import {
  Trophy,
  Flame,
  Zap,
  Target,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Star,
  Award,
  Brain,
  Map,
  Mic,
  Rocket,
  Lock,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

interface GamificationProfile {
  total_xp: number
  current_xp: number
  current_level: string   // varchar: 'principiante' | 'explorador' | 'profesional' | 'experto' | 'maestro'
  interview_streak: number
  best_interview_streak: number
  total_interviews_completed: number
  badges: unknown[]
  achievements: unknown[]
}

interface PilarProgress {
  pilar: string
  progreso_porcentaje: number
  xp_earned: number
  estado: Record<string, unknown>
}

interface RankingEntry {
  user_id: string
  score_general: number
  rank_general: number
  score_a1_cerebral: number
  score_a2_rutas: number
  score_aterrizaje: number
  score_base: number
  score_camino_persona: number
  score_camino_profesional: number
  streak_actual: number
  mejor_streak: number
  total_misiones_completadas: number
  total_dias_activos: number
}

interface MisionUser {
  id: string
  completada: boolean
  completada_at: string | null
  misiones: {
    titulo: string
    descripcion: string
    xp_reward: number
    pilar: string
  } | null
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PILLAR_CONFIG = {
  a1: {
    label: 'El Ritual',
    color: 'rgb(54,224,192)',
    bgColor: 'rgba(54,224,192,0.08)',
    borderColor: 'rgba(54,224,192,0.2)',
    scoreKey: 'score_a1_cerebral' as keyof RankingEntry,
    icon: Brain,
    href: '/despega/a1/resultado',
  },
  a2: {
    label: 'Exploración',
    color: 'rgb(124,92,255)',
    bgColor: 'rgba(124,92,255,0.08)',
    borderColor: 'rgba(124,92,255,0.2)',
    scoreKey: 'score_a2_rutas' as keyof RankingEntry,
    icon: Map,
    href: '/despega/a2/recomendaciones',
  },
  a3: {
    label: 'Entrenamiento',
    color: 'rgb(220,80,180)',
    bgColor: 'rgba(220,80,180,0.08)',
    borderColor: 'rgba(220,80,180,0.2)',
    scoreKey: 'score_aterrizaje' as keyof RankingEntry,
    icon: Mic,
    href: '/despega/a3',
  },
  a4: {
    label: 'La Realidad',
    color: 'rgb(255,140,60)',
    bgColor: 'rgba(255,140,60,0.08)',
    borderColor: 'rgba(255,140,60,0.2)',
    scoreKey: 'score_base' as keyof RankingEntry,
    icon: Rocket,
    href: '/despega/a4',
  },
} as const

type PillarKey = keyof typeof PILLAR_CONFIG

// Matches the varchar values stored in user_gamification_profile.current_level
const LEVEL_CONFIG: Record<string, { label: string; xpNeeded: number; color: string }> = {
  principiante: { label: 'Principiante', xpNeeded: 100,   color: 'rgb(150,150,160)' },
  explorador:   { label: 'Explorador',   xpNeeded: 300,   color: 'rgb(54,224,192)'  },
  profesional:  { label: 'Profesional',  xpNeeded: 600,   color: 'rgb(124,92,255)'  },
  experto:      { label: 'Experto',      xpNeeded: 1000,  color: 'rgb(255,200,50)'  },
  maestro:      { label: 'Maestro',      xpNeeded: 99999, color: 'rgb(255,140,60)'  },
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
  const levelCfg  = LEVEL_CONFIG[profile.current_level] ?? LEVEL_CONFIG.principiante
  const currentXP = profile.current_xp ?? 0
  const pct       = Math.min(100, Math.round((currentXP / levelCfg.xpNeeded) * 100))

  return (
    <div
      className="rounded-2xl p-6 col-span-2"
      style={{ backgroundColor: 'rgba(54,224,192,0.07)', border: '1px solid rgba(54,224,192,0.18)' }}
    >
      <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Nivel actual</p>
          <p className="text-3xl font-black text-white leading-none">{levelCfg.label}</p>
          <p className="text-sm mt-1" style={{ color: levelCfg.color }}>
            {profile.total_xp.toLocaleString('es-CL')} XP totales
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
          <Flame className="w-4 h-4 text-orange-400" />
          <div>
            <p className="text-lg font-bold text-white leading-none">{profile.interview_streak}</p>
            <p className="text-[10px] text-white/40">racha días</p>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-white/40">
          <span>{currentXP.toLocaleString('es-CL')} XP</span>
          <span>
            {levelCfg.xpNeeded === 99999 ? 'Nivel máximo' : `${levelCfg.xpNeeded.toLocaleString('es-CL')} XP para siguiente nivel`}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, rgb(54,224,192), rgb(124,92,255))' }}
          />
        </div>
        <p className="text-xs text-white/30">{pct}% al siguiente nivel</p>
      </div>
    </div>
  )
}

function PillarCard({ pilarKey, score, pilarProgress }: {
  pilarKey: PillarKey
  score: number
  pilarProgress: PilarProgress | undefined
}) {
  const cfg  = PILLAR_CONFIG[pilarKey]
  const Icon = cfg.icon
  const pct  = pilarProgress?.progreso_porcentaje ?? Math.min(100, score)
  const xp   = pilarProgress?.xp_earned ?? 0

  return (
    <Link href={cfg.href}>
      <div
        className="rounded-2xl p-4 cursor-pointer transition-transform hover:scale-[1.02]"
        style={{ backgroundColor: cfg.bgColor, border: `1px solid ${cfg.borderColor}` }}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/10">
            <Icon className="w-4 h-4" style={{ color: cfg.color }} />
          </div>
          <ChevronRight className="w-4 h-4 text-white/25" />
        </div>
        <p className="text-sm font-semibold text-white/90 mb-1">{cfg.label}</p>
        <p className="text-2xl font-black leading-none mb-3" style={{ color: cfg.color }}>
          {score > 0 ? score : '—'}
          {score > 0 && <span className="text-sm font-medium text-white/40"> pts</span>}
        </p>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cfg.color, transition: 'width 0.7s' }} />
        </div>
        <div className="flex justify-between text-[10px] text-white/30 mt-1.5">
          <span>{pct}%</span>
          {xp > 0 && <span>{xp} XP</span>}
        </div>
      </div>
    </Link>
  )
}

function LeaderboardCard({ entry, rank, isMe }: { entry: RankingEntry; rank: number; isMe: boolean }) {
  const medals = ['rgb(255,215,0)', 'rgb(192,192,192)', 'rgb(205,127,50)']

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
      style={{
        backgroundColor: isMe ? 'rgba(54,224,192,0.10)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isMe ? 'rgba(54,224,192,0.28)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <span className="w-6 text-center flex-shrink-0 text-sm font-bold"
        style={{ color: rank <= 3 ? medals[rank - 1] : 'rgba(255,255,255,0.25)' }}>
        {rank}
      </span>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white/70"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        {entry.user_id.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isMe ? 'text-teal-300' : 'text-white/70'}`}>
          {isMe ? 'Tú' : `Participante ${rank}`}
        </p>
        <p className="text-[10px] text-white/30">Racha: {entry.streak_actual ?? 0}d</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Star className="w-3.5 h-3.5 text-teal-400/60" />
        <span className="text-sm font-bold text-white">{entry.score_general}</span>
      </div>
    </div>
  )
}

function MisionItem({ mision }: { mision: MisionUser }) {
  const isDone = mision.completada
  const pilarColor: Record<string, string> = {
    a1: 'rgb(54,224,192)',
    a2: 'rgb(124,92,255)',
    a3: 'rgb(220,80,180)',
    a4: 'rgb(255,140,60)',
  }
  const color = pilarColor[mision.misiones?.pilar ?? ''] ?? 'rgba(255,255,255,0.3)'

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl transition-opacity"
      style={{
        backgroundColor: isDone ? 'rgba(54,224,192,0.05)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isDone ? 'rgba(54,224,192,0.15)' : 'rgba(255,255,255,0.06)'}`,
        opacity: isDone ? 0.55 : 1,
      }}
    >
      <div className="mt-0.5 flex-shrink-0">
        {isDone
          ? <CheckCircle2 className="w-4 h-4 text-teal-400" />
          : <div className="w-4 h-4 rounded-full border-2 border-white/20" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isDone ? 'line-through text-white/35' : 'text-white/90'}`}>
          {mision.misiones?.titulo ?? 'Misión'}
        </p>
        {mision.misiones?.pilar && (
          <p className="text-[10px] mt-0.5" style={{ color }}>
            {PILLAR_CONFIG[mision.misiones.pilar as PillarKey]?.label ?? mision.misiones.pilar}
          </p>
        )}
      </div>
      {(mision.misiones?.xp_reward ?? 0) > 0 && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-yellow-400/60" />
          <span className="text-xs text-white/40">{mision.misiones!.xp_reward}</span>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function GamificacionDashboard() {
  const router = useRouter()
  const [userId,    setUserId]    = useState<string | null>(null)
  const [profile,   setProfile]   = useState<GamificationProfile | null>(null)
  const [pilares,   setPilares]   = useState<PilarProgress[]>([])
  const [rankings,  setRankings]  = useState<RankingEntry[]>([])
  const [misiones,  setMisiones]  = useState<MisionUser[]>([])
  const [myRanking, setMyRanking] = useState<RankingEntry | null>(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      let uid = user?.id ?? null

      if (!uid) {
        const demo = getDemoUser()
        if (demo) uid = demo.id
      }

      if (!uid) { router.push('/auth/signin'); return }
      setUserId(uid)

      const [xpRes, pilaresRes, rankingsRes, misionesRes] = await Promise.all([
        supabase
          .from('user_gamification_profile')
          .select('total_xp,current_xp,current_level,interview_streak,best_interview_streak,total_interviews_completed,badges,achievements')
          .eq('user_id', uid)
          .maybeSingle(),
        supabase
          .from('despega_pilar_progress')
          .select('pilar,progreso_porcentaje,xp_earned,estado')
          .eq('user_id', uid),
        supabase
          .from('despega_rankings')
          .select('user_id,score_general,rank_general,score_a1_cerebral,score_a2_rutas,score_aterrizaje,score_base,score_camino_persona,score_camino_profesional,streak_actual,mejor_streak,total_misiones_completadas,total_dias_activos')
          .order('score_general', { ascending: false })
          .limit(10),
        supabase
          .from('despega_user_misiones')
          .select('id,completada,completada_at,misiones:mision_id(titulo,descripcion,xp_reward,pilar)')
          .eq('user_id', uid)
          .order('completada', { ascending: true })
          .limit(8),
      ])

      setProfile(xpRes.data ?? {
        total_xp: 0, current_xp: 0, current_level: 'principiante',
        interview_streak: 0, best_interview_streak: 0,
        total_interviews_completed: 0, badges: [], achievements: [],
      })
      setPilares(pilaresRes.data ?? [])
      setRankings(rankingsRes.data ?? [])
      setMyRanking((rankingsRes.data ?? []).find((r: RankingEntry) => r.user_id === uid) ?? null)
      setMisiones((misionesRes.data ?? []) as MisionUser[])
      setLoading(false)
    }
    init()
  }, [])

  const misionesActivas     = misiones.filter(m => !m.completada)
  const misionesCompletadas = misiones.filter(m => m.completada)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05060e] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-teal-500/40 border-t-teal-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#05060e] text-white pb-16">
      {/* Header */}
      <div className="border-b border-white/8 px-6 py-5">
        <div className="flex items-center gap-2 text-white/40 text-sm mb-1">
          <Link href="/despega" className="hover:text-white/70 transition-colors">Área personal</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white/70">Mis Logros</span>
        </div>
        <h1 className="text-2xl font-bold text-white text-balance">Mis Logros</h1>
        <p className="text-white/40 text-sm mt-0.5">Tu XP, racha y posición en el ranking</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-8">

        {/* XP card + stats */}
        {profile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <XPCard profile={profile} />
            <StatCard
              icon={Trophy}
              label="Posición global"
              value={myRanking?.rank_general != null ? `#${myRanking.rank_general}` : '—'}
              sub={myRanking ? `${myRanking.score_general} puntos` : 'Sin datos aún'}
              color="rgb(255,215,0)"
            />
            <StatCard
              icon={TrendingUp}
              label="Días activos"
              value={myRanking?.total_dias_activos ?? '—'}
              sub="en la plataforma"
              color="rgb(124,92,255)"
            />
          </div>
        )}

        {/* Pilar progress */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-white/30" />
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Progreso por pilar</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.keys(PILLAR_CONFIG) as PillarKey[]).map(k => (
              <PillarCard
                key={k}
                pilarKey={k}
                score={myRanking ? (myRanking[PILLAR_CONFIG[k].scoreKey] as number) ?? 0 : 0}
                pilarProgress={pilares.find(p => p.pilar === k)}
              />
            ))}
          </div>
        </section>

        {/* Leaderboard + Misiones */}
        <div className="grid md:grid-cols-2 gap-6">

          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-white/30" />
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Top 10</h2>
              </div>
              <Link href="/despega/rankings" className="text-xs text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1">
                Ver completo <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-2">
              {rankings.length === 0
                ? <p className="text-sm text-white/30 px-1">Sin datos de ranking todavía.</p>
                : rankings.map((entry, i) => (
                    <LeaderboardCard
                      key={entry.user_id}
                      entry={entry}
                      rank={(entry.rank_general != null ? entry.rank_general : i + 1)}
                      isMe={entry.user_id === userId}
                    />
                  ))
              }
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-white/30" />
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                Misiones
              </h2>
              {misionesActivas.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-400">
                  {misionesActivas.length} activas
                </span>
              )}
            </div>

            <div className="space-y-2">
              {misiones.length === 0
                ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <Lock className="w-6 h-6 text-white/20" />
                    <p className="text-sm text-white/30">No hay misiones asignadas aún.</p>
                  </div>
                )
                : (
                  <>
                    {misionesActivas.map(m => <MisionItem key={m.id} mision={m} />)}
                    {misionesCompletadas.slice(0, 3).map(m => <MisionItem key={m.id} mision={m} />)}
                  </>
                )
              }
            </div>

            {misionesCompletadas.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5 px-1">
                <Award className="w-3.5 h-3.5 text-white/20" />
                <span className="text-xs text-white/30">{misionesCompletadas.length} completadas</span>
              </div>
            )}
          </section>
        </div>

        {/* Badges */}
        {profile?.badges && Array.isArray(profile.badges) && profile.badges.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-white/30" />
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Insignias</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((b: any, i: number) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Star className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-sm text-white/70">{b?.name ?? `Insignia ${i + 1}`}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
