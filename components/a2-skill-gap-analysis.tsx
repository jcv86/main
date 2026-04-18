'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronRight, TrendingUp, AlertCircle } from 'lucide-react'

interface SkillGap {
  skillId: string
  skillName: string
  currentLevel: number
  targetLevel: number
  gap: number
  category: 'tecnico' | 'liderazgo' | 'comunicacion' | 'estrategia'
  actionItems: string[]
  estimatedWeeks: number
}

interface SkillGapAnalysisProps {
  a1Results: any
  userProgress?: any
  onSelectSkill?: (skill: SkillGap) => void
}

export function SkillGapAnalysis({ a1Results, userProgress, onSelectSkill }: SkillGapAnalysisProps) {
  const [gaps, setGaps] = useState<SkillGap[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('gap') // 'gap', 'impact', 'timeline'

  useEffect(() => {
    if (!a1Results) return

    // Calculate skill gaps from A1 scores
    const calculatedGaps: SkillGap[] = [
      {
        skillId: 'energia-rhythm',
        skillName: 'Ritmo de Energía Sostenible',
        currentLevel: Math.round((a1Results.score_energia || 30) / 100 * 5),
        targetLevel: 5,
        gap: 5 - Math.round((a1Results.score_energia || 30) / 100 * 5),
        category: 'tecnico',
        actionItems: [
          'Establecer rutina de sueño consistente',
          'Integrar ejercicio matutino de 15-30 min',
          'Nutrición consciente con hidratación regular'
        ],
        estimatedWeeks: 4
      },
      {
        skillId: 'focus-deep-work',
        skillName: 'Enfoque Profundo (Deep Work)',
        currentLevel: Math.round((a1Results.score_enfoque || 40) / 100 * 5),
        targetLevel: 5,
        gap: 5 - Math.round((a1Results.score_enfoque || 40) / 100 * 5),
        category: 'tecnico',
        actionItems: [
          'Dominar técnica Pomodoro',
          'Crear bloques de tiempo sin interrupciones',
          'Gestionar distracciones digitales'
        ],
        estimatedWeeks: 3
      },
      {
        skillId: 'relaciones-influence',
        skillName: 'Influencia y Relaciones',
        currentLevel: Math.round((a1Results.score_relaciones || 35) / 100 * 5),
        targetLevel: 5,
        gap: 5 - Math.round((a1Results.score_relaciones || 35) / 100 * 5),
        category: 'liderazgo',
        actionItems: [
          'Desarrollar escucha activa',
          'Crear red de contactos estratégicos',
          'Practicar comunicación empática'
        ],
        estimatedWeeks: 6
      },
      {
        skillId: 'exec-planning',
        skillName: 'Planificación Ejecutiva',
        currentLevel: Math.round((a1Results.score_plan_ejecutivo || 35) / 100 * 5),
        targetLevel: 5,
        gap: 5 - Math.round((a1Results.score_plan_ejecutivo || 35) / 100 * 5),
        category: 'estrategia',
        actionItems: [
          'Sistema OKR trimestral',
          'Ritual matutino de revisión',
          'Decisiones ágiles basadas en datos'
        ],
        estimatedWeeks: 5
      }
    ]

    setGaps(calculatedGaps)
  }, [a1Results])

  const filteredGaps = selectedCategory === 'all' 
    ? gaps 
    : gaps.filter(g => g.category === selectedCategory)

  const sortedGaps = [...filteredGaps].sort((a, b) => {
    if (sortBy === 'gap') return b.gap - a.gap
    if (sortBy === 'timeline') return a.estimatedWeeks - b.estimatedWeeks
    return 0
  })

  const totalGap = gaps.reduce((sum, g) => sum + g.gap, 0)
  const categoryBreakdown = {
    tecnico: gaps.filter(g => g.category === 'tecnico').reduce((sum, g) => sum + g.gap, 0),
    liderazgo: gaps.filter(g => g.category === 'liderazgo').reduce((sum, g) => sum + g.gap, 0),
    comunicacion: gaps.filter(g => g.category === 'comunicacion').reduce((sum, g) => sum + g.gap, 0),
    estrategia: gaps.filter(g => g.category === 'estrategia').reduce((sum, g) => sum + g.gap, 0),
  }

  const categoryLabels = {
    tecnico: 'Técnicas & Hábitos',
    liderazgo: 'Liderazgo',
    comunicacion: 'Comunicación',
    estrategia: 'Estrategia'
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Brecha Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGap}</div>
            <p className="text-xs text-muted-foreground">niveles a desarrollar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Áreas Críticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sortedGaps.filter(g => g.gap >= 3).length}</div>
            <p className="text-xs text-muted-foreground">necesitan atención inmediata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Semanas Estimadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.max(...gaps.map(g => g.estimatedWeeks))}</div>
            <p className="text-xs text-muted-foreground">para cierre completo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recomendación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">A3</div>
            <p className="text-xs text-muted-foreground">comenzar simulaciones</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Brechas por Categoría</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(categoryBreakdown).map(([category, value]) => (
            <div key={category}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">{categoryLabels[category as keyof typeof categoryLabels]}</label>
                <span className="text-sm text-muted-foreground">{value} niveles</span>
              </div>
              <Progress value={(value / totalGap) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills Detail */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Skills Detallados</h3>
          <div className="flex gap-2">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="gap">Mayor Brecha</option>
              <option value="timeline">Menor Tiempo</option>
            </select>
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="tecnico">Técnicos</TabsTrigger>
            <TabsTrigger value="liderazgo">Liderazgo</TabsTrigger>
            <TabsTrigger value="comunicacion">Comunicación</TabsTrigger>
            <TabsTrigger value="estrategia">Estrategia</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {sortedGaps.map((skill) => (
            <Card 
              key={skill.skillId}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectSkill?.(skill)}
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{skill.skillName}</h4>
                      <Badge variant="outline" className="capitalize">
                        {categoryLabels[skill.category as keyof typeof categoryLabels]}
                      </Badge>
                      {skill.gap >= 3 && (
                        <Badge className="bg-red/10 text-red-800 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Crítico
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Nivel: {skill.currentLevel}/5</span>
                        <span>Meta: {skill.targetLevel}/5</span>
                      </div>
                      <Progress value={(skill.currentLevel / skill.targetLevel) * 100} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {skill.actionItems.slice(0, 2).map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                      {skill.actionItems.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{skill.actionItems.length - 2} más
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-orange mb-2">{skill.gap}</div>
                    <p className="text-xs text-muted-foreground mb-3">niveles</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {skill.estimatedWeeks} semanas
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
