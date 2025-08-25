"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MessageCircle, Crown, Users, Puzzle, RotateCcw, Heart, Clock, Target, Sparkles, Loader2 } from "lucide-react"

export default function SoftSkillsResultsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-lg mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-2/3 mx-auto animate-pulse"></div>
        </div>

        {/* Progress Section */}
        <Card className="mb-8 border-pink-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-pink-600" />
                <span className="text-lg font-semibold text-gray-800">
                  Analizando tus competencias profesionales...
                </span>
              </div>
              <span className="text-pink-600 font-bold">75%</span>
            </div>
            <Progress value={75} className="h-3 mb-4" />

            {/* Processing Steps */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ Evaluando competencias de comunicación</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ Analizando habilidades de liderazgo</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ Midiendo capacidad de trabajo en equipo</span>
              </div>
              <div className="flex items-center gap-2 text-pink-600">
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
            <Card className="border-pink-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Análisis de Comunicación</h4>
                <p className="text-sm text-gray-600">Evaluamos tu capacidad para transmitir ideas efectivamente</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Crown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Potencial de Liderazgo</h4>
                <p className="text-sm text-gray-600">Medimos tu habilidad para guiar y motivar equipos</p>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 mb-1">Colaboración</h4>
                <p className="text-sm text-gray-600">Analizamos tu efectividad trabajando en equipo</p>
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
            <Card key={index} className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-${competency.color}-100`}>
                    <competency.icon className={`h-6 w-6 text-${competency.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-4/5"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Animation */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-gray-600">
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
