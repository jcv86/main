import { Heart, Brain, Users, Target, Lightbulb } from "lucide-react"

export default function EmotionalIntelligenceResultsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg">
              <Heart className="h-16 w-16 text-white animate-pulse" />
            </div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
        </div>

        {/* Overall Score Skeleton */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-8 mb-8 shadow-xl">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="text-center">
              <div className="h-20 w-20 bg-white bg-opacity-20 rounded-lg mx-auto mb-2 animate-pulse"></div>
              <div className="h-6 bg-white bg-opacity-20 rounded w-32 mx-auto animate-pulse"></div>
            </div>
            <div className="text-center">
              <div className="h-8 bg-white bg-opacity-20 rounded-lg w-24 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded w-40 mx-auto animate-pulse"></div>
            </div>
            <div className="text-center">
              <div className="h-8 bg-white bg-opacity-20 rounded-lg w-32 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded w-28 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-2 mb-8">
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="h-8 w-8 text-red-500 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-8 animate-pulse"></div>

          {/* Competency Cards Skeleton */}
          <div className="space-y-8">
            {[Brain, Target, Lightbulb, Heart, Users].map((Icon, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-4 bg-gray-200 rounded-xl animate-pulse">
                      <Icon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-12 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-wrap justify-center gap-4 pt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>

        {/* Loading Indicator */}
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando resultados...</h2>
            <p className="text-gray-600">Analizando tu perfil de inteligencia emocional</p>
          </div>
        </div>
      </div>
    </div>
  )
}
