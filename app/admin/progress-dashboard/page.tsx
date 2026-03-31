'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface UserProgress {
  user_id: string
  email: string
  created_at: string
  onboarding_completed: boolean
  onboarding_cerebral_completed: boolean
  a1_test_completed: boolean
  onboarding_conozcamonos_2_completed: boolean
  a2_route_generated: boolean
  a2_missions_started: boolean
  a3_intro_completed: boolean
  a3_entrevista_0_completed: boolean
  a3_training_started: boolean
  a4_unlocked: boolean
  completion_stage: number
}

export default function AdminProgressDashboard() {
  const [users, setUsers] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    stage1: 0,
    stage2: 0,
    stage3: 0,
    stage4: 0,
    stage5: 0,
    stage6: 0,
    fullyOnboarded: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    loadUserProgress()
  }, [])

  const loadUserProgress = async () => {
    try {
      const { data: usersData, error } = await supabase
        .from('despega_user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading user progress:', error)
        return
      }

      // Calculate completion stage for each user
      const enhancedUsers = usersData?.map((user) => {
        let stage = 0
        if (user.onboarding_completed) stage = 1
        if (user.onboarding_cerebral_completed) stage = 2
        if (user.a1_test_completed) stage = 2
        if (user.onboarding_conozcamonos_2_completed) stage = 3
        if (user.a2_route_generated) stage = 4
        if (user.a2_missions_started) stage = 4
        if (user.a3_intro_completed) stage = 5
        if (user.a3_entrevista_0_completed) stage = 5
        if (user.a4_unlocked) stage = 6

        return {
          ...user,
          email: user.email || 'No email',
          completion_stage: stage,
        }
      }) || []

      setUsers(enhancedUsers)

      // Calculate statistics
      const newStats = {
        totalUsers: enhancedUsers.length,
        stage1: enhancedUsers.filter((u) => u.completion_stage >= 1).length,
        stage2: enhancedUsers.filter((u) => u.completion_stage >= 2).length,
        stage3: enhancedUsers.filter((u) => u.completion_stage >= 3).length,
        stage4: enhancedUsers.filter((u) => u.completion_stage >= 4).length,
        stage5: enhancedUsers.filter((u) => u.completion_stage >= 5).length,
        stage6: enhancedUsers.filter((u) => u.completion_stage >= 6).length,
        fullyOnboarded: enhancedUsers.filter((u) => u.a4_unlocked).length,
      }
      setStats(newStats)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStageLabel = (stage: number) => {
    const labels = ['Not Started', 'Conozcámonos-1', 'A1 Cerebral', 'Conozcámonos-2', 'A2 Mission', 'A3 Training', 'A4 Complete']
    return labels[stage] || 'Unknown'
  }

  const getStageColor = (stage: number) => {
    const colors = ['gray', 'blue', 'cyan', 'green', 'yellow', 'orange', 'emerald']
    return colors[stage] || 'gray'
  }

  const chartData = [
    { name: 'Stage 1', users: stats.stage1 },
    { name: 'Stage 2', users: stats.stage2 },
    { name: 'Stage 3', users: stats.stage3 },
    { name: 'Stage 4', users: stats.stage4 },
    { name: 'Stage 5', users: stats.stage5 },
    { name: 'Stage 6', users: stats.stage6 },
  ]

  const completionData = [
    { name: 'Completed All Stages', value: stats.fullyOnboarded, fill: '#10b981' },
    { name: 'In Progress', value: stats.totalUsers - stats.fullyOnboarded, fill: '#f59e0b' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Despega Tu Carrera - Admin Progress Dashboard</h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Fully Onboarded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.fullyOnboarded}</div>
              <Progress value={(stats.fullyOnboarded / stats.totalUsers) * 100} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">{((stats.fullyOnboarded / stats.totalUsers) * 100).toFixed(1)}% completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Current Stage Avg</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(users.reduce((sum, u) => sum + u.completion_stage, 0) / users.length).toFixed(1)}
              </div>
              <p className="text-xs text-gray-500 mt-1">average stage across all users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Stuck/Incomplete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalUsers - stats.fullyOnboarded}</div>
              <p className="text-xs text-gray-500 mt-1">still in progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completion Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* User Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Progress Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>C-1</TableHead>
                    <TableHead>A1</TableHead>
                    <TableHead>C-2</TableHead>
                    <TableHead>A2</TableHead>
                    <TableHead>A3</TableHead>
                    <TableHead>A4</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell className="font-medium text-sm">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getStageLabel(user.completion_stage)}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.onboarding_completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        {user.a1_test_completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        {user.onboarding_conozcamonos_2_completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        {user.a2_missions_started ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        {user.a3_training_started ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        {user.a4_unlocked ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <Progress value={(user.completion_stage / 6) * 100} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Refresh Button */}
        <div className="mt-8 flex justify-center">
          <Button onClick={loadUserProgress} variant="outline">
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  )
}
