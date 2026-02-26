"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DESPEGA_PROFILES, getDespegarProfile, getBookRecommendations } from "@/lib/despega-profiles"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
// Recharts removed to avoid dependency issues - using simple visual instead

interface ResultsProps {
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

export function DiscResultsPage({ results, caminoPersona, caminoProfesional }: ResultsProps) {
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

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">¿Qué significa esto?</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Tu perfil muestra cómo naturalmente interactúas con el mundo. No es una etiqueta limitante, sino una brújula para entenderte mejor y desarrollarte.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Tu mayor fortaleza</h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                Tu perfil es tu superpoder. Los siguientes pasos te ayudarán a amplificar tus fortalezas y trabajar en tus áreas de desarrollo.
              </p>
            </CardContent>
          </Card>
        </div>

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
                  <h3 className="font-semibold mb-2 text-lg">Tu Perfil de Personalidad</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Cada dimensión representa una parte de cómo interactúas con el mundo. Una puntuación alta no es mejor que una baja, solo es diferente.
                  </p>
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

        {/* Context Section */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="text-lg">Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-bold text-indigo-700 dark:text-indigo-300 flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold">Libros y Recursos Recomendados</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Basados en tu perfil DISC, hemos seleccionado recursos específicos para acelerar tu aprendizaje.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-bold text-indigo-700 dark:text-indigo-300 flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold">Plan Personalizado</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Tu dashboard contiene estrategias y acciones diseñadas específicamente para tu transformación profesional.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-bold text-indigo-700 dark:text-indigo-300 flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold">Desarrollo Continuo</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Este es tu punto de partida. A través de práctica consistente, desarrollarás todas las dimensiones de tu potencial profesional.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fases Siguientes - Enhanced */}
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardHeader>
            <CardTitle className="text-xl">Tu Próximo Paso: Definir Tu Futuro</CardTitle>
            <CardDescription>Ya te conoces mejor. Ahora, construye tu plan personalizado y entiende el contexto del mercado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* MAIN CTA - A2 + A4 TOGETHER */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border-2 border-dashed border-green-300 dark:border-green-700">
              <h4 className="font-bold text-lg mb-2 text-green-900 dark:text-green-100">Las Fases A2 y A4 Van Juntas (4 semanas)</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                Define tu plan de transformación (A2) mientras entiendes el contexto del mercado (A4). Se retroalimentan entre sí.
              </p>
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                <Link href="/despega/a2/dashboard">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold" size="lg">
                    Ir a A2: Tu Plan <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/despega/a4-base">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold" size="lg">
                    Ir a A4: Contexto <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                O accede a ambas desde tu Dashboard de Jornada
              </p>
            </div>

            {/* JOURNEY DASHBOARD LINK */}
            <div className="text-center">
              <Link href="/despega/journey">
                <Button variant="outline" className="w-full md:w-auto">
                  Ver Mi Dashboard de Jornada Completa
                </Button>
              </Link>
            </div>

            {/* Phase Grid - Informational */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Phase A2 */}
              <div className="border-l-4 border-green-500 pl-4 py-3 bg-white dark:bg-slate-900/50 rounded">
                <h5 className="font-bold text-green-900 dark:text-green-100 mb-1">Fase A2: Tu Plan</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Crea un plan de 90 días personalizado con sprints semanales, bitácora de progreso y coaching IA.
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 font-semibold">Semanas 2-5</p>
              </div>

              {/* Phase A4 */}
              <div className="border-l-4 border-cyan-500 pl-4 py-3 bg-white dark:bg-slate-900/50 rounded">
                <h5 className="font-bold text-cyan-900 dark:text-cyan-100 mb-1">Fase A4: Contexto Estratégico</h5>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Accede a noticias del mercado, análisis de oportunidades y recursos curados para tu transformación.
                </p>
                <p className="text-xs text-cyan-700 dark:text-cyan-300 font-semibold">Semanas 2-5 (paralelo)</p>
              </div>
            </div>

            {/* Phase A3 - Coming Soon */}
            <div className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50 dark:bg-orange-950/20 rounded">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-bold text-orange-900 dark:text-orange-100 mb-1">Fase A3: Tu Práctica</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Entrenamientos inteligentes usando tu plan de A2 + contexto de A4. Feedback instantáneo y repetición deliberada.
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 font-semibold">Disponible después de A2+A4 (Semanas 6-13)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="flex flex-wrap gap-3 justify-center pt-6 pb-4">
          <Button
            size="lg"
            onClick={() => router.push("/despega/a2/dashboard")}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
          >
            Comenzar Fase A2: Exploración
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/dashboard?refetch=true")}
            className="shadow-md"
          >
            Ir a Mi Dashboard
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => router.push("/despega")}
            className="shadow-sm"
          >
            Volver a Inicio
          </Button>
        </div>
      </div>
    </div>
  )
}

