"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2 } from "lucide-react"

export function AdminUsersOverview() {
  return (
    <Card className="border-0 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Usuarios Registrados</CardTitle>
          <Badge variant="secondary">Total: 1,234</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {[
            { email: "usuario@example.com", points: 450, badges: 5, lastActive: "Hace 2 horas" },
            { email: "estudiante@example.com", points: 320, badges: 3, lastActive: "Hace 4 horas" },
            { email: "lector@example.com", points: 580, badges: 7, lastActive: "Hace 1 hora" },
            { email: "aprendiz@example.com", points: 210, badges: 2, lastActive: "Ayer" },
          ].map((user) => (
            <div key={user.email} className="p-3 bg-muted/50 rounded-[28px] border border-border/50 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  {user.points} puntos • {user.badges} insignias • {user.lastActive}
                </p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="text-xs px-2">
                  Ver Perfil
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function AdminTesisManager() {
  return (
    <Card className="border-0 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tesis del Día</CardTitle>
          <Button size="sm" className="text-xs gap-1">
            <Plus className="w-3 h-3" />
            Nueva Tesis
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { date: "Hoy", tesis: "IA consolidará adopción con diferenciador en datos propios", consensus: 0.75 },
          { date: "Ayer", tesis: "Sustentabilidad pasa de ESG a estrategia competitiva", consensus: 0.68 },
        ].map((item, idx) => (
          <div key={idx} className="p-4 bg-muted/50 rounded-[28px] border border-border/50 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">{item.date}</Badge>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="text-xs px-2">
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" className="text-xs px-2">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <p className="text-sm font-medium">{item.tesis}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Consensus: {(item.consensus * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function AdminNoticiasManager() {
  return (
    <Card className="border-0 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gestión de Noticias</CardTitle>
          <Button size="sm" className="text-xs gap-1">
            <Plus className="w-3 h-3" />
            Agregar Noticia
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Buscar noticias..." className="text-xs" />
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {[
            { title: "IA revoluciona automatización", category: "IA", linked: true },
            { title: "Startups de sustentabilidad en auge", category: "ESG", linked: false },
          ].map((news, idx) => (
            <div key={idx} className="p-3 bg-muted/50 rounded-[28px] border border-border/50 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm">{news.title}</p>
                <p className="text-xs text-muted-foreground">{news.category} • {news.linked ? "Ligado a Tesis" : "No ligado"}</p>
              </div>
              <Button size="sm" variant="outline" className="text-xs px-2">
                {news.linked ? "Desligar" : "Ligar"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function AdminTestsManager() {
  return (
    <Card className="border-0 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pruebas Gamificadas</CardTitle>
          <Button size="sm" className="text-xs gap-1">
            <Plus className="w-3 h-3" />
            Nueva Prueba
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { title: "Estrategia Digital", difficulty: "Intermedio", completions: 145, avgScore: 72 },
          { title: "Introducción a IA", difficulty: "Básico", completions: 298, avgScore: 85 },
        ].map((test, idx) => (
          <div key={idx} className="p-3 bg-muted/50 rounded-[28px] border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-sm">{test.title}</p>
                <p className="text-xs text-muted-foreground">{test.difficulty}</p>
              </div>
              <Button size="sm" variant="outline" className="text-xs px-2">
                Editar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {test.completions} completadas • Promedio: {test.avgScore}%
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function AdminBibliotecaManager() {
  return (
    <Card className="border-0 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recursos de Biblioteca</CardTitle>
          <Button size="sm" className="text-xs gap-1">
            <Plus className="w-3 h-3" />
            Nuevo Recurso
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          { title: "Transformación Digital", type: "Libro", verified: true, score: 0.95 },
          { title: "IA Generativa: Guía Práctica", type: "Artículo", verified: true, score: 0.88 },
          { title: "Sustentabilidad 2024", type: "Reporte", verified: false, score: 0.72 },
        ].map((resource, idx) => (
          <div key={idx} className="p-3 bg-muted/50 rounded-[28px] border border-border/50 flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-sm">{resource.title}</p>
              <p className="text-xs text-muted-foreground">{resource.type} • Score: {(resource.score * 100).toFixed(0)}%</p>
            </div>
            <div className="flex items-center gap-2">
              {resource.verified ? (
                <Badge variant="secondary" className="text-xs">✓ Verificado</Badge>
              ) : (
                <Badge variant="outline" className="text-xs">Pendiente</Badge>
              )}
              <Button size="sm" variant="outline" className="text-xs px-2">
                {resource.verified ? "Rechazar" : "Aprobar"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
