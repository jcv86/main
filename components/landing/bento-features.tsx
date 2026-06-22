'use client'

import { Brain, Target, Zap, MessageCircle, FileText, TrendingUp } from 'lucide-react'

const TEAL = 'rgb(80, 160, 170)'

const FEATURES = [
  {
    icon: Brain,
    title: 'Diagnóstico Profundo',
    desc: 'Big Five, MBTI, DISC, inteligencia emocional y RIASEC. Un perfil vivo que evoluciona contigo.',
    size: 'large',
  },
  {
    icon: Target,
    title: 'Ruta Personalizada',
    desc: '90 días estructurados desde tu realidad, no desde la vacante.',
    size: 'small',
  },
  {
    icon: MessageCircle,
    title: 'Vera — Coach IA 24/7',
    desc: 'Tu coach personal con contexto completo de quién eres. Disponible cuando tú estás listo.',
    size: 'small',
  },
  {
    icon: Zap,
    title: 'Entrenamiento Real',
    desc: 'Simulaciones de entrevista, feedback en tiempo real, y práctica de skills que el mercado pide ahora.',
    size: 'medium',
  },
  {
    icon: FileText,
    title: 'CV ATS + Portfolio',
    desc: 'Resume optimizado para algoritmos ATS y portfolio profesional que abre puertas.',
    size: 'medium',
  },
  {
    icon: TrendingUp,
    title: 'Radar Estratégico',
    desc: 'Contexto real del mercado laboral chileno. Dónde están las oportunidades para tu perfil.',
    size: 'small',
  },
]

function FeatureCard({
  icon: Icon,
  title,
  desc,
  accentIdx,
}: {
  icon: React.ElementType
  title: string
  desc: string
  accentIdx: number
}) {
  const accents = [
    TEAL,
    'rgb(100, 180, 220)',
    'rgb(90, 170, 200)',
    TEAL,
    'rgb(80, 190, 190)',
    'rgb(70, 150, 160)',
  ]
  const accent = accents[accentIdx % accents.length]

  return (
    <div className="group relative p-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.04] h-full">
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: `radial-gradient(300px circle at 20% 0%, ${accent}12, transparent 70%)`,
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
          <h3 className="font-semibold text-base text-white mb-2">{title}</h3>
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
  return (
    <section className="relative py-24 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
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
            <FeatureCard {...FEATURES[0]} accentIdx={0} />
          </div>
          <div>
            <FeatureCard {...FEATURES[1]} accentIdx={1} />
          </div>
          <div>
            <FeatureCard {...FEATURES[2]} accentIdx={2} />
          </div>

          {/* Row 2: medium + medium */}
          <div>
            <FeatureCard {...FEATURES[3]} accentIdx={3} />
          </div>
          <div>
            <FeatureCard {...FEATURES[4]} accentIdx={4} />
          </div>

          {/* Row 3: full width */}
          <div className="md:col-span-3">
            <FeatureCard {...FEATURES[5]} accentIdx={5} />
          </div>
        </div>
      </div>
    </section>
  )
}
