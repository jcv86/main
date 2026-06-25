'use client'

import { Brain, Target, Zap, MessageCircle, FileText, TrendingUp } from 'lucide-react'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

const TEAL = 'rgb(80, 160, 170)'

const FEATURES = [
  {
    icon: Brain,
    title: 'Diagnóstico Profundo',
    desc: 'Big Five, MBTI, DISC, inteligencia emocional y RIASEC. Un perfil vivo que evoluciona contigo.',
    accent: TEAL,
  },
  {
    icon: Target,
    title: 'Ruta Personalizada',
    desc: '90 días estructurados desde tu realidad, no desde la vacante.',
    accent: 'rgb(100, 180, 220)',
  },
  {
    icon: MessageCircle,
    title: 'Vera — Coach IA 24/7',
    desc: 'Tu coach personal con contexto completo de quién eres. Disponible cuando tú estás listo.',
    accent: 'rgb(167, 139, 250)',
  },
  {
    icon: Zap,
    title: 'Entrenamiento Real',
    desc: 'Simulaciones de entrevista, feedback en tiempo real, y práctica de skills que el mercado pide ahora.',
    accent: 'rgb(251, 146, 60)',
  },
  {
    icon: FileText,
    title: 'CV ATS + Portfolio',
    desc: 'Resume optimizado para algoritmos ATS y portfolio profesional que abre puertas.',
    accent: 'rgb(52, 211, 153)',
  },
  {
    icon: TrendingUp,
    title: 'Radar Estratégico',
    desc: 'Contexto real del mercado laboral chileno. Dónde están las oportunidades para tu perfil.',
    accent: 'rgb(244, 114, 182)',
  },
]

function FeatureCard({
  icon: Icon,
  title,
  desc,
  accent,
  delay,
  inView,
}: {
  icon: React.ElementType
  title: string
  desc: string
  accent: string
  delay: number
  inView: boolean
}) {
  return (
    <div
      className="group relative p-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden h-full transition-all duration-500 hover:border-white/[0.14] hover:bg-white/[0.04]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.3s, background-color 0.3s`,
      }}
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: `radial-gradient(280px circle at 20% 10%, ${accent}15, transparent 70%)`,
        }}
      />

      <div className="relative flex flex-col h-full gap-4">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110"
          style={{
            borderColor: `${accent}40`,
            backgroundColor: `${accent}15`,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>

        <div>
          <h3 className="font-semibold text-base text-white mb-2 group-hover:text-white transition-colors">{title}</h3>
          <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
        style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
      />
    </div>
  )
}

export default function BentoFeatures() {
  const { ref, inView } = useScrollReveal({ threshold: 0.1 })

  return (
    <section ref={ref} className="relative py-24 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className="max-w-2xl mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: TEAL }}
          >
            Todo en un sistema
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight text-balance">
            No es una herramienta.
            <br />
            Es un sistema completo.
          </h2>
          <p className="mt-4 text-base text-white/50 max-w-xl leading-relaxed">
            Cada pieza está conectada. Diagnóstico, ruta, entrenamiento, ejecución — todo fluye hacia el mismo norte: claridad profesional real.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Row 1: large + small + small */}
          <div className="md:col-span-1 md:row-span-2 min-h-[280px]">
            <FeatureCard {...FEATURES[0]} delay={0} inView={inView} />
          </div>
          <div>
            <FeatureCard {...FEATURES[1]} delay={80} inView={inView} />
          </div>
          <div>
            <FeatureCard {...FEATURES[2]} delay={160} inView={inView} />
          </div>

          {/* Row 2: medium + medium */}
          <div>
            <FeatureCard {...FEATURES[3]} delay={240} inView={inView} />
          </div>
          <div>
            <FeatureCard {...FEATURES[4]} delay={320} inView={inView} />
          </div>

          {/* Row 3: full width */}
          <div className="md:col-span-3">
            <FeatureCard {...FEATURES[5]} delay={400} inView={inView} />
          </div>
        </div>
      </div>
    </section>
  )
}
