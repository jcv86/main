import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles, Target, BookOpen, Zap, TrendingUp } from "lucide-react"
import { BrainChatInterface } from "@/components/brain-chat-interface"

export const metadata = {
  title: "Cerebro Inteligente | DTC Platform",
  description: "Conversa con nuestro cerebro AI alimentado por 120+ libros profesionales",
}

export default function CerebroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-500 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Cerebro Avanzado de IA
              </h1>
              <p className="text-muted-foreground">
                Sistema de coaching con inteligencia artificial de última generación
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              <Zap className="h-3 w-3 mr-1" />
              Beta
            </Badge>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Búsqueda Multi-Nivel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  3 niveles de búsqueda semántica con re-ranking inteligente para encontrar las mejores respuestas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Personalización Profunda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Respuestas adaptadas a tu perfil psicométrico, objetivos de carrera e historial de aprendizaje
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-600" />
                  Aprendizaje Continuo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  El sistema aprende de cada interacción y feedback para mejorar constantemente
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">220+</p>
                  <p className="text-xs text-muted-foreground">Fuentes de Conocimiento</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">95%+</p>
                  <p className="text-xs text-muted-foreground">Precisión de Respuesta</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
                  <p className="text-2xl font-bold">3x</p>
                  <p className="text-xs text-muted-foreground">Niveles de Búsqueda</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">&lt;2s</p>
                  <p className="text-xs text-muted-foreground">Tiempo de Respuesta</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Chat Component */}
        <BrainChatInterface />
      </div>
    </div>
  )
}
