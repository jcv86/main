"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MASTER_PROMPT_BANK, getPromptBankStats, searchPrompts } from "@/lib/ai/master-prompt-bank"
import {
  Search,
  TrendingUp,
  Star,
  CheckCircle,
  Brain,
  Briefcase,
  MessageSquare,
  DollarSign,
  Repeat,
} from "lucide-react"

export function PromptBankDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  const stats = getPromptBankStats()

  // Filter prompts
  let filteredPrompts = MASTER_PROMPT_BANK

  if (searchQuery) {
    filteredPrompts = searchPrompts(searchQuery)
  }

  if (selectedCategory !== "all") {
    filteredPrompts = filteredPrompts.filter((p) => p.categoria === selectedCategory)
  }

  if (selectedLevel !== "all") {
    filteredPrompts = filteredPrompts.filter((p) => p.nivel === selectedLevel)
  }

  const categoryIcons = {
    autoconocimiento_proposito: Brain,
    cv_linkedin_marca: Briefcase,
    entrevistas_comunicacion: MessageSquare,
    crecimiento_salarial: DollarSign,
    reinvencion_transicion: Repeat,
  }

  const categoryColors = {
    autoconocimiento_proposito: "bg-purple/50/10 text-purple dark:text-purple-200",
    cv_linkedin_marca: "bg-blue/50/10 text-blue dark:text-blue-200",
    entrevistas_comunicacion: "bg-green/50/10 text-green dark:text-green/30",
    crecimiento_salarial: "bg-orange/50/10 text-orange dark:text-orange/30",
    reinvencion_transicion: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Banco maestro completo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Nivel</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.byLevel.basico}/{stats.byLevel.intermedio}/{stats.byLevel.avanzado}
            </div>
            <p className="text-xs text-muted-foreground">Básico / Intermedio / Avanzado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sofia vs Dani</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.byTone.sofia}/{stats.byTone.dani}
            </div>
            <p className="text-xs text-muted-foreground">+ {stats.byTone.hibrido} híbridos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Áreas de desarrollo</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Prompts</CardTitle>
          <CardDescription>Explora el banco maestro de prompts por categoría, nivel o búsqueda libre</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por keywords o contenido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              Todas las categorías
            </Button>
            <Button
              variant={selectedCategory === "autoconocimiento_proposito" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("autoconocimiento_proposito")}
            >
              Autoconocimiento
            </Button>
            <Button
              variant={selectedCategory === "cv_linkedin_marca" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("cv_linkedin_marca")}
            >
              CV/LinkedIn
            </Button>
            <Button
              variant={selectedCategory === "entrevistas_comunicacion" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("entrevistas_comunicacion")}
            >
              Entrevistas
            </Button>
            <Button
              variant={selectedCategory === "crecimiento_salarial" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("crecimiento_salarial")}
            >
              Crecimiento
            </Button>
            <Button
              variant={selectedCategory === "reinvencion_transicion" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("reinvencion_transicion")}
            >
              Transición
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedLevel === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("all")}
            >
              Todos los niveles
            </Button>
            <Button
              variant={selectedLevel === "basico" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("basico")}
            >
              Básico
            </Button>
            <Button
              variant={selectedLevel === "intermedio" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("intermedio")}
            >
              Intermedio
            </Button>
            <Button
              variant={selectedLevel === "avanzado" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel("avanzado")}
            >
              Avanzado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prompts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{filteredPrompts.length} prompts encontrados</h2>
        </div>

        <div className="grid gap-4">
          {filteredPrompts.map((prompt) => {
            const Icon = categoryIcons[prompt.categoria]
            const colorClass = categoryColors[prompt.categoria]

            return (
              <Card key={prompt.prompt_id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <CardTitle className="text-base">{prompt.entrada_usuario}</CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={colorClass}>
                          {prompt.categoria.replace(/_/g, " ")}
                        </Badge>
                        <Badge variant="outline">{prompt.nivel}</Badge>
                        <Badge variant="outline">
                          {prompt.tono === "sofia" ? "👩 Sofia" : prompt.tono === "dani" ? "👨 Dani" : "🤝 Híbrido"}
                        </Badge>
                        <Badge variant="secondary">ID: {prompt.prompt_id}</Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {prompt.respuesta_sofia && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Respuesta Sofia:</p>
                      <p className="text-sm text-muted-foreground bg-purple/5 dark:bg-purple/20 p-3 rounded-lg">
                        {prompt.respuesta_sofia}
                      </p>
                    </div>
                  )}

                  {prompt.respuesta_dani && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Respuesta Dani:</p>
                      <p className="text-sm text-muted-foreground bg-blue/5 dark:bg-blue/20 p-3 rounded-lg">
                        {prompt.respuesta_dani}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <p className="text-sm font-medium">{prompt.metricas_esperadas.engagement_rate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Satisfacción</p>
                      <p className="text-sm font-medium">{prompt.metricas_esperadas.satisfaccion_promedio}★</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Acción</p>
                      <p className="text-sm font-medium">{prompt.metricas_esperadas.acciones_completadas}%</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {prompt.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
