import { Card } from "@/components/ui/card"

interface OnboardingIntroProps {
  onBegin: () => void
}

export function OnboardingIntro({ onBegin }: OnboardingIntroProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <Card className="p-8 border-training/30 bg-black">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold text-training">Despega Cerebral</h1>
            <p className="text-lg text-foreground/80">
              Descubre tu perfil DISC y desbloquea tu potencial profesional
            </p>
            <p className="text-sm text-foreground/60">
              Este test te ayudará a entender tu estilo natural de comunicación y liderazgo
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground text-center">¿Qué descubrirás?</h2>
          <div className="grid gap-4">
            {[
              { letter: "D", desc: "Dirección - Tu capacidad de liderazgo y decisión" },
              { letter: "I", desc: "Influencia - Tu poder de persuasión y comunicación" },
              { letter: "S", desc: "Sosiego - Tu estabilidad y consistencia" },
              { letter: "C", desc: "Cumplimiento - Tu atención al detalle y calidad" },
            ].map((item) => (
              <div key={item.letter} className="flex items-start gap-4 p-4 border border-training/20 rounded">
                <div className="w-10 h-10 rounded-full bg-training/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-training">{item.letter}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            console.log("[v0] Plain button onClick fired")
            onBegin()
          }}
          className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-sm bg-training hover:bg-training/90 text-white cursor-pointer"
          type="button"
        >
          Cuando estés listo, comienza
        </button>
      </div>
    </div>
  )
}
