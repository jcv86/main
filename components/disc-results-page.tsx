"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DESPEGA_PROFILES, getDespegarProfile, getBookRecommendations } from "@/lib/despega-profiles"
import { useRouter } from "next/navigation"
// Recharts removed to avoid dependency issues - using simple visual instead

interface DiscResultsProps {
  results: {
    D: number
    I: number
    S: number
    C: number
    dominantProfile: "D" | "I" | "S" | "C"
    secondaryProfile: "D" | "I" | "S" | "C"
    total: number
  }
  caminoPersona: boolean
  caminoProfesional: boolean
}

export function DiscResultsPage({ results, caminoPersona, caminoProfesional }: DiscResultsProps) {
  const router = useRouter()
  const context = caminoProfesional ? "profesional" : "personal"

  const dominantProfile = getDespegarProfile(results.dominantProfile, context)
  const secondaryProfile = getDespegarProfile(results.secondaryProfile, context)
  const books = getBookRecommendations(results.dominantProfile)

  const scores = [
    { dimension: "D", label: "Impulsor", value: results.D, color: "#EF4444", icon: "⚡" },
    { dimension: "I", label: "Catalizador", value: results.I, color: "#F59E0B", icon: "✨" },
    { dimension: "S", label: "Estabilizador", value: results.S, color: "#10B981", icon: "🌱" },
    { dimension: "C", label: "Arquitecto", value: results.C, color: "#3B82F6", icon: "🏗️" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Tu Perfil Despega Cerebral Revelado
            </CardTitle>
            <CardDescription className="text-base mt-3 text-slate-600 dark:text-slate-400">
              El espejo ha mostrado quién eres hoy. Ahora construimos tu puente hacia quién quieres ser.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Primary Profile - Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Profile Card */}
            <Card className="border-l-8 shadow-2xl overflow-hidden" style={{ borderLeftColor: dominantProfile.color }}>
              <CardHeader className="pb-4" style={{ backgroundColor: `${dominantProfile.color}15` }}>
                <div className="flex items-center gap-4">
                  <div
                    className="text-5xl rounded-full w-24 h-24 flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: dominantProfile.color }}
                  >
                    {dominantProfile.emoji}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl">{dominantProfile.nombre}</CardTitle>
                    <CardDescription className="text-lg mt-1">{dominantProfile.arquetipo}</CardDescription>
                    <div className="mt-2 p-2 rounded text-sm font-semibold italic" style={{ color: dominantProfile.color }}>
                      "{dominantProfile.fraseClave}"
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Scores Grid */}
                <div>
                  <h3 className="font-semibold mb-4 text-lg">Tu Composición DISC</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {scores.map((score) => (
                      <div
                        key={score.dimension}
                        className="p-4 rounded-lg border-2 transition-all hover:shadow-md"
                        style={{
                          borderColor: score.color,
                          backgroundColor: `${score.color}08`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{score.icon}</span>
                          <span className="text-2xl font-bold" style={{ color: score.color }}>
                            {Math.round(results[score.dimension as keyof typeof results])}%
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{score.label}</p>
                        <Progress value={results[score.dimension as keyof typeof results]} className="mt-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Características */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span className="text-2xl">✨</span> Tus Características
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {dominantProfile.caracteristicas.map((car, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <span className="text-primary mt-1 text-lg">•</span>
                        <span className="text-sm">{car}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fortalezas */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span className="text-2xl">💪</span> Tus Fortalezas
                  </h3>
                  <div className="space-y-2">
                    {dominantProfile.fortalezas.map((fuerza, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border-l-4 border-emerald-500">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">✓</span>
                        <span className="text-sm">{fuerza}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Oportunidades de desarrollo */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <span className="text-2xl">🚀</span> Oportunidades de Desarrollo
                  </h3>
                  <div className="space-y-2">
                    {dominantProfile.oportunidades.map((oportunidad, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-sky-50 dark:bg-sky-950/30 rounded-lg border-l-4 border-sky-500">
                        <span className="text-sky-600 dark:text-sky-400 font-bold text-lg">→</span>
                        <span className="text-sm">{oportunidad}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secondary Profile */}
            {results.secondaryProfile !== results.dominantProfile && (
              <Card className="border-l-4 shadow-lg opacity-90" style={{ borderLeftColor: secondaryProfile.color }}>
                <CardHeader style={{ backgroundColor: `${secondaryProfile.color}10` }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="text-3xl rounded-full w-14 h-14 flex items-center justify-center text-white"
                      style={{ backgroundColor: secondaryProfile.color }}
                    >
                      {secondaryProfile.emoji}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Tu Perfil Secundario</p>
                      <p className="font-semibold text-lg">{secondaryProfile.nombre}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{secondaryProfile.arquetipo}</p>
                  <p className="italic font-medium">{secondaryProfile.fraseClave}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Section - Radar Chart & Books */}
          <div className="space-y-6">
            {/* Radar Chart - Simple SVG version */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Tu Perfil Visual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-80 flex items-center justify-center">
                  <svg viewBox="0 0 300 300" className="w-full h-full" style={{ maxWidth: "300px", maxHeight: "300px" }}>
                    {/* Circles */}
                    {[1, 2, 3, 4, 5].map((i) => (
                      <circle
                        key={`circle-${i}`}
                        cx="150"
                        cy="150"
                        r={30 * i}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                      />
                    ))}
                    
                    {/* Axes */}
                    {["D", "I", "S", "C"].map((dim, idx) => {
                      const angle = (idx * 90 * Math.PI) / 180
                      const x = 150 + 150 * Math.cos(angle)
                      const y = 150 + 150 * Math.sin(angle)
                      return (
                        <line key={`line-${dim}`} x1="150" y1="150" x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                      )
                    })}
                    
                    {/* Data polygons */}
                    {[
                      { dim: "D", color: "#EF4444", value: results.D },
                      { dim: "I", color: "#F59E0B", value: results.I },
                      { dim: "S", color: "#10B981", value: results.S },
                      { dim: "C", color: "#3B82F6", value: results.C },
                    ].map(({ dim, color, value }, idx) => {
                      const scale = value / 100
                      const angle = (idx * 90 * Math.PI) / 180
                      const x = 150 + 150 * scale * Math.cos(angle)
                      const y = 150 + 150 * scale * Math.sin(angle)
                      return (
                        <circle
                          key={`point-${dim}`}
                          cx={x}
                          cy={y}
                          r="4"
                          fill={color}
                        />
                      )
                    })}
                  </svg>
                  
                  {/* Labels */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="grid grid-cols-2 gap-8 text-center">
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-red-600">D</div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600">I</div>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-green-600">S</div>
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600">C</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Book Recommendations */}
            <Card className="shadow-xl border-t-4 border-amber-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>📚</span> Libros para Ti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {books.map((book, idx) => (
                  <div key={idx} className="p-3 border rounded-lg bg-amber-50 dark:bg-amber-950/20 hover:shadow-md transition-shadow">
                    <p className="font-semibold text-sm mb-1">{book.titulo}</p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mb-1">Por {book.autor}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{book.descripcion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-wrap gap-3 justify-center pt-6 pb-4">
          <Button
            size="lg"
            onClick={() => router.push("/dashboard?refetch=true")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
          >
            Ir a Mi Dashboard
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/despega")}
            className="shadow-md"
          >
            Volver a Inicio
          </Button>
        </div>
      </div>
    </div>
  )
}

