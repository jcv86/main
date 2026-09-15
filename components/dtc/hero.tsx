import Link from 'next/link'
import { ArrowRight, Brain, Check, Dumbbell, Map, Radar, Sparkles } from 'lucide-react'
import { COLORS, GRADIENT_BTN, GradientText, ROUTES } from './theme'

const STAGES = [
  { icon: Brain, code: 'A1', label: 'Entenderte', detail: 'Identidad y evidencia', color: COLORS.purple, position: 'top-[2%] left-1/2 -translate-x-1/2' },
  { icon: Map, code: 'A2', label: 'Trazar tu ruta', detail: '90 días adaptables', color: '#d946ef', position: 'left-0 top-1/2 -translate-y-1/2' },
  { icon: Dumbbell, code: 'A3', label: 'Practicar', detail: 'Entrenar decisiones', color: COLORS.blue, position: 'right-0 top-1/2 -translate-y-1/2' },
  { icon: Radar, code: 'A4', label: 'Leer el mercado', detail: 'Señales con contexto', color: COLORS.teal, position: 'bottom-[2%] left-1/2 -translate-x-1/2' },
] as const

const TRUST = [
  'Tu evidencia, no respuestas genéricas',
  'Una ruta conectada de A1 a A4',
  'Vera ayuda a pensar; tú decides',
]

const PROOF = [
  { value: '4', label: 'etapas conectadas' },
  { value: '90', label: 'días de ruta adaptable' },
  { value: '1', label: 'contexto compartido' },
  { value: '2', label: 'modos de Vera' },
]

export default function DtcHero() {
  return (
    <section className="relative overflow-hidden pb-14 pt-24 sm:pb-18 sm:pt-28 lg:pb-20 lg:pt-[118px]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-20 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 64% 42%, rgba(63,169,255,0.16), transparent 30%), radial-gradient(circle at 45% 48%, rgba(124,92,255,0.18), transparent 38%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-8">
          <div className="max-w-2xl">
            <div
              className="mb-7 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
              style={{ border: `1px solid ${COLORS.border}`, background: 'rgba(255,255,255,0.035)', color: COLORS.textMuted }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: COLORS.teal }} aria-hidden />
              Vera Brain · IA con contexto, no un chat genérico
            </div>

            <h1 className="max-w-[780px] text-balance text-[2.65rem] font-bold leading-[1.03] tracking-[-0.045em] text-white sm:text-5xl lg:text-[4rem]">
              Entiende cómo funcionas. Decide tu siguiente paso con{' '}
              <GradientText>evidencia.</GradientText>
            </h1>

            <p className="mt-6 max-w-[650px] text-pretty text-base leading-7 sm:text-lg" style={{ color: COLORS.textMuted }}>
              Despega Tu Carrera conecta tu identidad profesional, una ruta de 90 días, práctica real y señales del mercado. Vera usa ese contexto para ayudarte a pensar mejor, sin decidir por ti.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={ROUTES.diagnostico}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#05060e] shadow-[0_12px_38px_rgba(83,120,255,0.22)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(83,120,255,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                style={{ background: GRADIENT_BTN }}
              >
                Comenzar mi diagnóstico
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                href="#como-funciona"
                className="inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                style={{ border: `1px solid ${COLORS.border}`, color: COLORS.text }}
              >
                Ver cómo funciona
              </Link>
            </div>

            <ul className="mt-7 grid gap-2.5 sm:grid-cols-3">
              {TRUST.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs leading-5 sm:text-[13px]" style={{ color: COLORS.textMuted }}>
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: COLORS.teal }} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <VeraSystemMap />
          </div>
        </div>

        <div
          className="mt-14 grid grid-cols-2 overflow-hidden rounded-2xl md:grid-cols-4"
          style={{ border: `1px solid ${COLORS.border}`, background: 'rgba(255,255,255,0.02)' }}
        >
          {PROOF.map((item, index) => (
            <div
              key={item.label}
              className="px-4 py-4 text-center sm:px-5 sm:py-5"
              style={{ borderLeft: index % 2 ? `1px solid ${COLORS.border}` : undefined, borderTop: index > 1 ? `1px solid ${COLORS.border}` : undefined }}
            >
              <div className="text-2xl font-bold sm:text-3xl"><GradientText>{item.value}</GradientText></div>
              <div className="mt-1 text-[11px] leading-snug sm:text-xs" style={{ color: COLORS.textMuted }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function VeraSystemMap() {
  return (
    <div className="vera-system relative aspect-square w-full max-w-[520px]" aria-label="Vera conecta las cuatro etapas de Despega Tu Carrera">
      <style>{`
        @keyframes vera-scan {
          to { transform: rotate(360deg); }
        }
        @keyframes vera-pulse {
          0%, 65%, 100% { opacity: .62; transform: scale(1); }
          8%, 22% { opacity: 1; transform: scale(1.035); }
        }
        .vera-scan { animation: vera-scan 12s linear infinite; }
        .vera-stage { animation: vera-pulse 8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .vera-scan, .vera-stage { animation: none !important; }
        }
      `}</style>

      <div aria-hidden className="absolute inset-[10%] rounded-full border border-white/[0.09]" />
      <div aria-hidden className="absolute inset-[22%] rounded-full border border-dashed border-white/[0.12]" />
      <div
        aria-hidden
        className="vera-scan absolute inset-[10%] rounded-full"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${COLORS.teal}22 26deg, transparent 58deg)`,
          maskImage: 'radial-gradient(circle, transparent 45%, black 46%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 45%, black 46%)',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative flex h-[176px] w-[176px] flex-col items-center justify-center rounded-[38%] px-5 text-center sm:h-[190px] sm:w-[190px]"
          style={{
            background: 'linear-gradient(145deg, rgba(18,22,42,0.96), rgba(8,12,28,0.96))',
            border: '1px solid rgba(124,92,255,0.42)',
            boxShadow: '0 0 0 10px rgba(124,92,255,0.035), 0 28px 80px rgba(52,74,180,0.28)',
          }}
        >
          <div className="mb-2 flex items-center gap-1.5 rounded-full border border-teal-300/20 bg-teal-300/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: COLORS.teal }}>
            <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
            Contexto activo
          </div>
          <span className="text-3xl font-bold tracking-tight text-white">Vera</span>
          <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.textMuted }}>Brain v2</span>
          <div className="mt-3 flex gap-1.5 text-[9px] font-medium">
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-white/70">Fast</span>
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-white/70">Agentic</span>
          </div>
          <span className="mt-3 text-[10px] leading-4" style={{ color: COLORS.textFaint }}>Router → evidencia → intervención</span>
        </div>
      </div>

      {STAGES.map((stage, index) => {
        const Icon = stage.icon
        return (
          <div
            key={stage.code}
            className={`vera-stage absolute ${stage.position} flex min-w-[142px] items-center gap-2.5 rounded-xl px-3 py-2.5 sm:min-w-[158px]`}
            style={{
              animationDelay: `${index * 1.8}s`,
              background: 'rgba(8,11,24,0.92)',
              border: `1px solid ${stage.color}55`,
              boxShadow: `0 12px 35px ${stage.color}12`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${stage.color}14`, border: `1px solid ${stage.color}35` }}>
              <Icon className="h-4 w-4" style={{ color: stage.color }} aria-hidden />
            </span>
            <span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: stage.color }}>{stage.code}</span>
              <span className="block text-xs font-semibold text-white">{stage.label}</span>
              <span className="block text-[9px] leading-4" style={{ color: COLORS.textFaint }}>{stage.detail}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
