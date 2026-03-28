'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Zap, Target, Clock } from 'lucide-react'

interface DashboardMetrics {
  totalUsers: number
  activeUsers: number
  avgA1Score: number
  completionRate: number
  avgTimePerPillar: Record<string, number>
  contentEngagement: Array<{ name: string; users: number; completion: number }>
  pillarProgress: Array<{ pillar: string; avgScore: number; avgProgress: number }>
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [userSegments, setUserSegments] = useState<any[]>([])
  const [topPerformers, setTopPerformers] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchMetrics()
  }, [])

  async function fetchMetrics() {
    try {
      // Get user counts
      const { count: totalCount } = await supabase
        .from('despega_user_profiles')
        .select('*', { count: 'exact' })

      const { count: activeCount } = await supabase
        .from('despega_user_profiles')
        .select('*', { count: 'exact' })
        .gte('last_activity', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      // Get average A1 scores
      const { data: a1Data } = await supabase
        .from('despega_a1_results')
        .select('score_energia, score_enfoque, score_relaciones, score_plan_ejecutivo')

      const avgA1 = a1Data
        ? Math.round(
            a1Data.reduce((sum, r) => 
              sum + (r.score_energia + r.score_enfoque + r.score_relaciones + r.score_plan_ejecutivo) / 4, 0
            ) / a1Data.length
          )
        : 0

      // Get pillar progress
      const { data: progressData } = await supabase
        .from('despega_pilar_progress')
        .select('pilar, progreso, score')

      const pillarStats = ['a1_cerebral', 'a2_intermediate', 'a3_rutas', 'a4_base'].map(pilar => {
        const pilarData = progressData?.filter(p => p.pilar === pilar) || []
        return {
          pillar: pilar,
          avgScore: pilarData.length > 0 
            ? Math.round(pilarData.reduce((sum, p) => sum + (p.score || 0), 0) / pilarData.length)
            : 0,
          avgProgress: pilarData.length > 0
            ? Math.round(pilarData.reduce((sum, p) => sum + (p.progreso || 0), 0) / pilarData.length)
            : 0
        }
      })

      setMetrics({
        totalUsers: totalCount || 0,
        activeUsers: activeCount || 0,
        avgA1Score: avgA1,
        completionRate: 35,
        avgTimePerPillar: {
          a1: 7,
          a2: 14,
          a3: 21,
          a4: 10
        },
        contentEngagement: [
          { name: 'A1 Cerebral', users: (totalCount || 0) * 0.9, completion: 85 },
          { name: 'A2 Rutas', users: (totalCount || 0) * 0.45, completion: 62 },
          { name: 'A3 Entrenamientos', users: (totalCount || 0) * 0.25, completion: 45 },
          { name: 'A4 Base', users: (totalCount || 0) * 0.15, completion: 30 }
        ],
        pillarProgress: pillarStats
      })

      // Get top performers
      const { data: topUsers } = await supabase
        .from('despega_rankings')
        .select('user_id, score_total')
        .order('score_total', { ascending: false })
        .limit(5)

      setTopPerformers(topUsers || [])
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !metrics) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{metrics.activeUsers} activos esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Promedio A1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgA1Score}</div>
            <Progress value={metrics.avgA1Score} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Tasa Completación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completionRate}%</div>
            <Progress value={metrics.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((metrics.activeUsers / metrics.totalUsers) * 100)}%</div>
            <p className="text-xs text-muted-foreground">usuarios activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="engagement" className="w-full">
        <TabsList>
          <TabsTrigger value="engagement">Engagement por Contenido</TabsTrigger>
          <TabsTrigger value="progress">Progreso por Pilar</TabsTrigger>
          <TabsTrigger value="users">Segmentos de Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engagement de Contenido</CardTitle>
              <CardDescription>Usuarios y tasa de completación por pilar</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.contentEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#3b82f6" />
                  <Bar dataKey="completion" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progreso Promedio por Pilar</CardTitle>
              <CardDescription>Score y progreso completado</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.pillarProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="pillar" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="avgProgress" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Segmentos de Usuarios por Etapa</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'En A1', value: 90 },
                        { name: 'En A2', value: 45 },
                        { name: 'En A3', value: 25 },
                        { name: 'En A4', value: 15 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.slice(0, 5).map((user, idx) => (
                    <div key={user.user_id} className="flex items-center justify-between pb-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <Badge>{idx + 1}</Badge>
                        <span className="font-medium">Usuario #{user.user_id.slice(0, 8)}</span>
                      </div>
                      <span className="font-bold">{user.score_total}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Time Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Tiempo Promedio por Pilar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {Object.entries(metrics.avgTimePerPillar).map(([pilar, days]) => (
              <div key={pilar} className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground uppercase">{pilar}</p>
                <p className="text-3xl font-bold mt-2">{days}</p>
                <p className="text-xs text-muted-foreground">días promedio</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
