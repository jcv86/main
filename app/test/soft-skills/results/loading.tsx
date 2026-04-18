"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MessageCircle, Crown, Users, Puzzle, RotateCcw, Heart, Clock, Target, Sparkles, Loader2 } from "lucide-react"

export default function SoftSkillsResultsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-8 bg-background"></div>
          <div className="h-4 bg-muted/20 rounded-lg w-2/3 mx-auto animate-pulse"></div>
        </div>

        {/* Progress Section */}
        <Card className="mb-8 border-red/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-red" />
                <span className="text-lg font-semibold text-gray-800">
                  Analizando tus competencias profesionales...
                </span>
              </div>
              <span className="text-red font-bold">75%</span>
            </div>
            <Progress value={75} className="h-3 mb-4" />

            {/* Processing Steps */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green">
                <div className="w-2 h-2 bg-green/50 rounded-full"></div>
                <span>✅ Evaluando competencias de comunicación</span>
              </div>
              <div className="flex items-center gap-2 text-green">
                <div className="w-2 h-2 bg-green/50 rounded-full"></div>
                <span>✅ Analizando habilidades de liderazgo</span>
              </div>
              <div className="flex items-center gap-2 text-green">
                <div className="w-2 h-2 bg-green/50 rounded-full"></div>
                <span>✅ Midiendo capacidad de trabajo en equipo</span>
              </div>
              <div className="flex items-center gap-2 text-red">
                <Loader2 className="w-2 h-2 animate-spin" />
                <span>🔄 Generando recomendaciones personalizadas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Descubre lo que analizaremos para ti</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-red/20 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 text-red mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Análisis de Comunicación</h4>
                <p className="text-sm text-muted/60">Evaluamos tu capacidad para transmitir ideas efectivamente</p>
              </CardContent>
            </Card>

            <Card className="border-purple/20 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Crown className="h-8 w-8 text-purple mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Potencial de Liderazgo</h4>
                <p className="text-sm text-muted/60">Medimos tu habilidad para guiar y motivar equipos</p>
              </CardContent>
            </Card>

            <Card className="border-blue/20 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Colaboración</h4>
                <p className="text-sm text-muted/60">Analizamos tu efectividad trabajando en equipo</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Competency Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: MessageCircle, name: "Comunicación", color: "pink" },
            { icon: Crown, name: "Liderazgo", color: "purple" },
            { icon: Users, name: "Trabajo en Equipo", color: "indigo" },
            { icon: Puzzle, name: "Resolución de Problemas", color: "blue" },
            { icon: RotateCcw, name: "Adaptabilidad", color: "green" },
            { icon: Heart, name: "Inteligencia Emocional", color: "red" },
            { icon: Clock, name: "Gestión del Tiempo", color: "yellow" },
            { icon: Target, name: "Pensamiento Crítico", color: "gray" },
            { icon: Sparkles, name: "Creatividad", color: "orange" },
          ].map((competency, index) => (
            <Card key={index} className="border-muted/20 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-${competency.color}-100`}>
                    <competency.icon className={`h-6 w-6 text-${competency.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted/20 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-muted/10 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-2 bg-muted/20 rounded-full animate-pulse"></div>
                  <div className="h-3 bg-muted/10 rounded animate-pulse"></div>
                  <div className="h-3 bg-muted/10 rounded animate-pulse w-4/5"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Animation */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-muted/60">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Preparando tu análisis personalizado...</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}
