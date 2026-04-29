import { Recommendation } from '@/lib/recommendation-engine'
import { Card } from '@/components/ui/card'
import { AlertCircle, TrendingUp, Lightbulb } from 'lucide-react'

interface RecommendationsDisplayProps {
  recommendations: Recommendation[]
}

export function RecommendationsDisplay({ recommendations }: RecommendationsDisplayProps) {
  if (recommendations.length === 0) {
    return null
  }

  const highPriority = recommendations.filter(r => r.priority === 'high')
  const mediumPriority = recommendations.filter(r => r.priority === 'medium')

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        Recomendaciones Personalizadas
      </h3>

      {/* High Priority Recommendations */}
      {highPriority.length > 0 && (
        <div className="space-y-3">
          {highPriority.map((rec, idx) => (
            <Card
              key={idx}
              className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-orange-400/50 p-4 hover:border-orange-400 transition cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-white text-sm">{rec.title}</h4>
                    <span className="text-xs bg-orange/50/30 text-orange-200 px-2 py-1 rounded">
                      Fase {rec.phase}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 mb-2">{rec.description}</p>
                  <p className="text-xs text-white/60 italic">{rec.reason}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Medium Priority Recommendations */}
      {mediumPriority.length > 0 && (
        <div className="space-y-3">
          {mediumPriority.map((rec, idx) => (
            <Card
              key={idx}
              className="bg-muted/30 border border-muted/50 p-4 hover:border-muted/70 transition"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-white text-sm">{rec.title}</h4>
                    <span className="text-xs bg-muted/50 text-white/70 px-2 py-1 rounded">
                      Fase {rec.phase}
                    </span>
                  </div>
                  <p className="text-sm text-white/75 mb-1">{rec.description}</p>
                  <p className="text-xs text-white/50 italic">{rec.reason}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
