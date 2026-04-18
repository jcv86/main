"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, Users, BookOpen, CheckCircle } from "lucide-react"

const engagementData = [
  { day: "Lun", articles: 120, tests: 45, resources: 32 },
  { day: "Mar", articles: 145, tests: 52, resources: 38 },
  { day: "Mié", articles: 165, tests: 58, resources: 42 },
  { day: "Jue", articles: 155, tests: 48, resources: 35 },
  { day: "Vie", articles: 190, tests: 72, resources: 55 },
  { day: "Sab", articles: 110, tests: 38, resources: 28 },
  { day: "Dom", articles: 95, tests: 25, resources: 18 },
]

const pointsData = [
  { date: "Sem 1", points: 2400 },
  { date: "Sem 2", points: 3200 },
  { date: "Sem 3", points: 2800 },
  { date: "Sem 4", points: 4100 },
]

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple" />
                <p className="text-xs text-muted-foreground">Usuarios Activos</p>
              </div>
              <p className="text-3xl font-bold">1,234</p>
              <Badge variant="secondary" className="text-xs">+12% esta semana</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple" />
                <p className="text-xs text-muted-foreground">Artículos Leídos</p>
              </div>
              <p className="text-3xl font-bold">5,847</p>
              <Badge variant="secondary" className="text-xs">+8% esta semana</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple" />
                <p className="text-xs text-muted-foreground">Pruebas Completadas</p>
              </div>
              <p className="text-3xl font-bold">892</p>
              <Badge variant="secondary" className="text-xs">+15% esta semana</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple" />
                <p className="text-xs text-muted-foreground">Puntos Distribuidos</p>
              </div>
              <p className="text-3xl font-bold">12,450</p>
              <Badge variant="secondary" className="text-xs">+22% esta semana</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Chart */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Engagement por Tipo de Contenido</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" opacity={0.2} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="articles" fill="var(--primary)" name="Artículos" />
              <Bar dataKey="tests" fill="var(--chart-1)" name="Pruebas" />
              <Bar dataKey="resources" fill="var(--chart-2)" name="Recursos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Points Distribution Chart */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Distribución de Puntos - Última 4 Semanas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pointsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Line 
                type="monotone" 
                dataKey="points" 
                stroke="var(--primary)" 
                strokeWidth={2}
                dot={{ fill: "var(--primary)", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Badges */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Insignias Más Ganadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { badge: "Lector Ávido", users: 342, icon: "📚" },
            { badge: "Estudiante", users: 298, icon: "✅" },
            { badge: "Consistencia", users: 156, icon: "🔥" },
            { badge: "Perfeccionista", users: 89, icon: "⭐" },
          ].map((item) => (
            <div key={item.badge} className="flex items-center justify-between p-3 bg-muted/50 rounded-[28px] border border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <p className="font-medium text-sm">{item.badge}</p>
              </div>
              <Badge variant="outline">{item.users} usuarios</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
