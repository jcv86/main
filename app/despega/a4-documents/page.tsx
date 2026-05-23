'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Brain,
  TestTube,
  Trophy,
  Search,
  X,
  Play,
  Calendar,
  Loader,
  Mail,
  Mic,
  Map,
  MessageCircle,
  Users,
} from 'lucide-react'
import { 
  DOCUMENT_TYPE_MAP, 
  SPECIALTY_MAP, 
  ACTIVITY_NAMES,
  getDocumentLabel,
  getDocumentCategory 
} from '@/lib/constants/dtc-document-types'

interface DTCTestResult {
  id: string
  test_type: string
  test_name: string
  score: number
  interpretation: string
  tags: string[]
  completed_at: string
  results: Record<string, any>
}

interface DTCActivityArtifact {
  id: string
  activity_type: string
  title: string
  description: string
  artifact_type: string
  tags: string[]
  coach_feedback: string
  ai_summary: string
  completed_at: string
  content: Record<string, any>
}

interface DTCProgressMilestone {
  id: string
  phase: string
  milestone_type: string
  title: string
  description: string
  xp_earned: number
  points_earned: number
  badges_earned: string[]
  streak_count: number
  achieved_at: string
}

interface Stats {
  totalTests: number
  totalArtifacts: number
  totalMilestones: number
  totalXP: number
  totalPoints: number
}

export default function A4DocumentsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthRedirect()
  
  const [testResults, setTestResults] = useState<DTCTestResult[]>([])
  const [artifacts, setArtifacts] = useState<DTCActivityArtifact[]>([])
  const [milestones, setMilestones] = useState<DTCProgressMilestone[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('timeline')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)

  // Fetch all documents data
  const fetchDocuments = useCallback(async () => {
    if (authLoading || !user) return

    try {
      setLoading(true)
      setError(null)
      
      const supabase = createClient()
      
      console.log('[v0] Starting fetch...')

      // Fetch test results
      console.log('[v0] Fetching test results...')
      const { data: testsData, error: testsError } = await supabase
        .from('dtc_test_results')
        .select('*')
        .order('completed_at', { ascending: false })

      console.log('[v0] Test results:', { count: testsData?.length, error: testsError })

      if (testsError) throw testsError

      // Fetch activity artifacts
      console.log('[v0] Fetching artifacts...')
      const { data: artifactsData, error: artifactsError } = await supabase
        .from('dtc_activity_artifacts')
        .select('*')
        .order('completed_at', { ascending: false })

      console.log('[v0] Artifacts:', { count: artifactsData?.length, error: artifactsError })

      if (artifactsError) throw artifactsError

      // Fetch progress milestones
      console.log('[v0] Fetching milestones...')
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('dtc_progress_milestones')
        .select('*')
        .order('achieved_at', { ascending: false })

      console.log('[v0] Milestones:', { count: milestonesData?.length, error: milestonesError })

      if (milestonesError) throw milestonesError

      setTestResults(testsData || [])
      setArtifacts(artifactsData || [])
      setMilestones(milestonesData || [])

      // Calculate stats
      const totalXP = (milestonesData || []).reduce((sum, m) => sum + (m.xp_earned || 0), 0)
      const totalPoints = (milestonesData || []).reduce((sum, m) => sum + (m.points_earned || 0), 0)

      const newStats = {
        totalTests: testsData?.length || 0,
        totalArtifacts: artifactsData?.length || 0,
        totalMilestones: milestonesData?.length || 0,
        totalXP,
        totalPoints,
      }

      console.log('[v0] Final stats:', newStats)
      setStats(newStats)
    } catch (err) {
      console.error('[v0] Error fetching documents:', err)
      setError('Error al cargar documentos')
    } finally {
      setLoading(false)
    }
  }, [authLoading, user])

  useEffect(() => {
    if (!authLoading && user) {
      fetchDocuments()
    }
  }, [fetchDocuments, authLoading, user])

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'cv':
        return <FileText className="w-5 h-5" />
      case 'cover_letter':
        return <Mail className="w-5 h-5" />
      case 'elevator_pitch':
        return <Mic className="w-5 h-5" />
      case 'linkedin_summary':
        return <Users className="w-5 h-5" />
      case 'career_roadmap':
        return <Map className="w-5 h-5" />
      case 'interview_prep':
        return <MessageCircle className="w-5 h-5" />
      case 'video':
        return <Play className="w-5 h-5" />
      case 'document':
        return <FileText className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getActivityColor = (phase: string) => {
    const colors: Record<string, string> = {
      'A1': 'bg-blue-100 text-blue-800',
      'A2': 'bg-purple-100 text-purple-800',
      'A3': 'bg-green-100 text-green-800',
      'A4': 'bg-orange-100 text-orange-800',
      'A5': 'bg-red-100 text-red-800',
      'A6': 'bg-pink-100 text-pink-800',
    }
    return colors[phase] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex items-center justify-center h-96">
          <Loader className="w-12 h-12 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Mi Workspace DTC</h1>
          <p className="text-muted-foreground">
            Gestiona todos tus documentos, resultados de pruebas, actividades y logros en un solo lugar.
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-card border border-border/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Pruebas</div>
              <div className="text-2xl font-bold text-foreground">{stats.totalTests}</div>
            </div>
            <div className="bg-card border border-border/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Artefactos</div>
              <div className="text-2xl font-bold text-foreground">{stats.totalArtifacts}</div>
            </div>
            <div className="bg-card border border-border/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Logros</div>
              <div className="text-2xl font-bold text-foreground">{stats.totalMilestones}</div>
            </div>
            <div className="bg-card border border-border/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">XP Ganados</div>
              <div className="text-2xl font-bold text-primary">{stats.totalXP}</div>
            </div>
            <div className="bg-card border border-border/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Puntos</div>
              <div className="text-2xl font-bold text-primary">{stats.totalPoints}</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos, pruebas o logros..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterType || 'all'} onValueChange={(val) => setFilterType(val === 'all' ? null : val)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="cv">CV</SelectItem>
              <SelectItem value="cover_letter">Carta de Presentación</SelectItem>
              <SelectItem value="elevator_pitch">Elevator Pitch</SelectItem>
              <SelectItem value="linkedin_summary">LinkedIn Summary</SelectItem>
              <SelectItem value="career_roadmap">Ruta de Carrera</SelectItem>
              <SelectItem value="interview_prep">Prep. Entrevista</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              <span className="hidden sm:inline">Pruebas</span>
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Artefactos</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Logros</span>
            </TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <div className="space-y-3">
              {/* Merge and sort all items */}
              {[
                ...testResults.map(t => ({ ...t, type: 'test', date: t.completed_at })),
                ...artifacts.map(a => ({ ...a, type: 'artifact', date: a.completed_at })),
                ...milestones.map(m => ({ ...m, type: 'milestone', date: m.achieved_at })),
              ]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item) => (
                  <div key={item.id} className="bg-card border border-border/30 rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 text-primary">
                        {item.type === 'test' && <TestTube className="w-5 h-5" />}
                        {item.type === 'artifact' && <FileText className="w-5 h-5" />}
                        {item.type === 'milestone' && <Trophy className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {item.test_name || item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description || item.interpretation}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {(item.tags || []).slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.activity_type && (
                            <Badge className={`text-xs ${getActivityColor(item.activity_type)}`}>
                              {item.activity_type}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('es-ES')}
                        </div>
                        {item.score && (
                          <div className="text-lg font-bold text-primary mt-1">
                            {item.score}%
                          </div>
                        )}
                        {item.xp_earned && (
                          <div className="text-sm font-semibold text-primary">
                            +{item.xp_earned} XP
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testResults.map((test) => (
                <div key={test.id} className="bg-card border border-border/30 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Brain className="w-6 h-6 text-primary" />
                      <div>
                        <h3 className="font-semibold text-foreground">{test.test_name}</h3>
                        <p className="text-xs text-muted-foreground">{test.test_type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{test.score}%</div>
                      <p className="text-xs text-muted-foreground">Puntuación</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {test.interpretation}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {test.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                    {new Date(test.completed_at).toLocaleDateString('es-ES')}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Artifacts Tab */}
          <TabsContent value="artifacts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {artifacts.map((artifact) => {
                const docType = DOCUMENT_TYPE_MAP[artifact.artifact_type]
                const category = getDocumentCategory(artifact.artifact_type)
                const specialty = artifact.tags?.find(tag => SPECIALTY_MAP[tag])
                
                return (
                  <div key={artifact.id} className="bg-card border border-border/30 rounded-lg p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${docType?.color || 'bg-blue-500'} bg-opacity-10`}>
                          {getTypeIcon(artifact.artifact_type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{artifact.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {category}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {artifact.description}
                    </p>
                    {artifact.ai_summary && (
                      <p className="text-xs bg-secondary/50 p-2 rounded mb-3 line-clamp-2">
                        {artifact.ai_summary}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {specialty && (
                        <Badge className={`text-xs ${SPECIALTY_MAP[specialty].color}`}>
                          {SPECIALTY_MAP[specialty].label}
                        </Badge>
                      )}
                      {artifact.tags?.slice(0, 2).map(tag => {
                        if (!SPECIALTY_MAP[tag]) {
                          return (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          )
                        }
                        return null
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground pt-3 border-t border-border">
                      {new Date(artifact.completed_at).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4">
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="bg-card border border-border/30 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Trophy className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {milestone.description}
                        </p>
                        {milestone.badges_earned && milestone.badges_earned.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {milestone.badges_earned.map(badge => (
                              <Badge key={badge} className="bg-primary/20 text-primary text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right whitespace-nowrap ml-4">
                      <div className="space-y-1">
                        {milestone.xp_earned > 0 && (
                          <div className="text-sm font-bold text-primary">+{milestone.xp_earned} XP</div>
                        )}
                        {milestone.points_earned > 0 && (
                          <div className="text-sm font-bold text-primary">+{milestone.points_earned} pts</div>
                        )}
                        {milestone.streak_count > 1 && (
                          <div className="text-xs text-muted-foreground">Racha: {milestone.streak_count}</div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-3">
                        {new Date(milestone.achieved_at).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
