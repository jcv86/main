"use client"

import { useEffect, useState } from "react"
import { MirixMemoryDashboard } from "@/components/mirix-memory-dashboard"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Bot, User, Zap } from "lucide-react"

export default function MirixPage() {
  const { user } = useAuth()
  const [selectedAgent, setSelectedAgent] = useState("career_coach")
  const [agentStats, setAgentStats] = useState<Record<string, any>>({})

  const agents = [
    {
      id: "career_coach",
      name: "Career Coach",
      description: "Asistente de desarrollo profesional",
      icon: <Bot className="h-5 w-5" />,
    },
    {
      id: "personality_analyzer",
      name: "Analizador de Personalidad",
      description: "Análisis de personalidad y comportamiento",
      icon: <User className="h-5 w-5" />,
    },
    {
      id: "interview_simulator",
      name: "Simulador de Entrevistas",
      description: "Práctica de entrevistas laborales",
      icon: <Zap className="h-5 w-5" />,
    },
  ]

  useEffect(() => {
    if (user) {
      loadAgentStats()
    }
  }, [user])

  const loadAgentStats = async () => {
    try {
      const stats: Record<string, any> = {}

      for (const agent of agents) {
        const response = await fetch(`/api/mirix?userId=${user?.id}&agentType=${agent.id}&action=retrieve&limit=1`)
        const data = await response.json()
        stats[agent.id] = {
          totalMemories: data.memories?.length || 0,
          lastActivity: data.memories?.[0]?.created_at || null,
        }
      }

      setAgentStats(stats)
    } catch (error) {
      console.error("Error loading agent stats:", error)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Acceso Requerido</CardTitle>
            <CardDescription>Debes iniciar sesión para acceder al Sistema Mirix</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Sistema Mirix</h1>
            <p className="text-xl text-muted-foreground">Memory Intelligence & Retrieval Index</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">¿Qué es Mirix?</h2>
          <p className="text-muted-foreground">
            Mirix es un sistema avanzado de memoria para agentes de IA que permite mantener contexto persistente,
            aprender preferencias del usuario y mejorar continuamente las interacciones. Cada agente tiene su propia
            memoria especializada que evoluciona con cada conversación.
          </p>
        </div>
      </div>

      {/* Agent Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Seleccionar Agente</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className={`cursor-pointer transition-all ${
                selectedAgent === agent.id ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
              }`}
              onClick={() => setSelectedAgent(agent.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  {agent.icon}
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription className="text-sm">{agent.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Memorias:</span>
                  <span className="font-medium">{agentStats[agent.id]?.totalMemories || 0}</span>
                </div>
                {agentStats[agent.id]?.lastActivity && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Última actividad:</span>
                    <span className="font-medium">
                      {new Date(agentStats[agent.id].lastActivity).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Memory Dashboard */}
      <MirixMemoryDashboard />
    </div>
  )
}
