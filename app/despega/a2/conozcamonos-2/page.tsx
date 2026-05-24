"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

export default function ContratoDeTuRutaPage() {
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const router = useRouter()

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 100) {
      setScrolledToBottom(true)
    }
  }

  return (
    <div className="min-h-screen flex">
      <main className="flex-1 pt-4">
        <div className="flex min-h-screen">
          <main className="flex-1">
            <div className="min-h-screen bg-background">
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 md:mb-20 px-6 md:px-8 pt-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-3 md:mb-4">
                    EL CONTRATO DE TU RUTA
                  </h1>
                  <p className="text-xl text-white/80">
                    Antes de entrar, tienes que saber hacia dónde vas.
                  </p>
                </div>

                {/* Main Content */}
                <div className="w-full space-y-6 px-6 md:px-8">
                  <div className="space-y-6">
                    <div className="max-w-3xl mx-auto space-y-6">
                      {/* Text Content */}
                      <div className="space-y-4">
                        <p className="text-white/90 text-lg leading-relaxed">
                          Durante los próximos 90 días, no vamos a prepararte en el vacío. Vamos a construir
                          una candidatura real basada en investigación real, mercado real y evidencia real.
                        </p>

                        <p className="text-white/90 text-lg leading-relaxed">
                          Hoy creamos el mapa. No tiene que ser perfecto. Tiene que ser claro, posible y tuyo.
                        </p>

                        <p className="text-white/90 text-lg leading-relaxed">
                          Este no es un formulario más. Es un contrato con tu futuro profesional. Lo vas a
                          crear aquí, lo vas a editar afuera, lo vas a personalizar, y luego lo subirás. DTC lo
                          validará. Si es fuerte, desbloquearás los próximos 89 días.
                        </p>
                      </div>

                      {/* Task List */}
                      <div
                        className="rounded-lg p-8 border-2 border-[rgba(80,160,170,0.2)] bg-white/5 space-y-6"
                        onScroll={handleScroll}
                      >
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4">
                            Lo que vas a hacer hoy:
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-white/90">
                              <span className="text-green-400 flex-shrink-0 mt-1">✓</span>
                              <span>Responder 3 preguntas sobre tu visión</span>
                            </li>
                            <li className="flex items-start gap-3 text-white/90">
                              <span className="text-green-400 flex-shrink-0 mt-1">✓</span>
                              <span>Ver una hipótesis de ruta generada por coach</span>
                            </li>
                            <li className="flex items-start gap-3 text-white/90">
                              <span className="text-green-400 flex-shrink-0 mt-1">✓</span>
                              <span>Definir 3 puertas (hitos de validación)</span>
                            </li>
                            <li className="flex items-start gap-3 text-white/90">
                              <span className="text-green-400 flex-shrink-0 mt-1">✓</span>
                              <span>Generar un documento de ruta profesional</span>
                            </li>
                            <li className="flex items-start gap-3 text-white/90">
                              <span className="text-green-400 flex-shrink-0 mt-1">✓</span>
                              <span>Descargarlo, editarlo afuera, subirlo</span>
                            </li>
                            <li className="flex items-start gap-3 text-white/90">
                              <span className="text-green-400 flex-shrink-0 mt-1">✓</span>
                              <span>Obtener puntuación y feedback</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button
                        onClick={() => router.push("/despega/a2/vision-questions")}
                        className="w-full h-16 md:h-20 text-lg md:text-xl font-semibold rounded-full bg-purple/70 hover:bg-purple/80 text-white border-2 border-purple/50 transition-all"
                      >
                        Comenzar Escaneo de Visión
                        <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </main>
    </div>
  )
}
