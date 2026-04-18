"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Briefcase, Video, MessageSquare, TrendingUp, Play, CheckCircle2 } from "lucide-react"

interface EntrenamientoEntrevista {
  id: string
  nombre: string
  tipo: "entrevista" | "conversacion" | "presentacion"
  dificultad: "fácil" | "media" | "difícil"
  descripcion: string
  duracion: number
  completada: boolean
  puntuacion?: number
  feedback?: string
}

const entrenamientosDisponibles: EntrenamientoEntrevista[] = [
  {
    id: "1",
    nombre: "Entrevista de Selección Técnica",
    tipo: "entrevista",
    dificultad: "media",
    descripcion: "Practica una entrevista técnica para posiciones de nivel medio",
    duracion: 30,
    completada: false,
  },
  {
    id: "2",
    nombre: "Conversación Difícil con Jefe",
    tipo: "conversacion",
    dificultad: "difícil",
    descripcion: "Negocia un aumento o cambio de proyecto con tu jefe",
    duracion: 20,
    completada: false,
  },
  {
    id: "3",
    nombre: "Presentación Ejecutiva",
    tipo: "presentacion",
    dificultad: "media",
    descripcion: "Presenta un proyecto a directivos y responde preguntas",
    duracion: 25,
    completada: false,
  },
]

export default function EntrenamientoEntrevistasClient() {
  const [entrenamientos, setEntrenamientos] = useState<EntrenamientoEntrevista[]>(entrenamientosDisponibles)
  const [filtroTipo, setFiltroTipo] = useState<string>("todas")
  const [filtroDificultad, setFiltroDificultad] = useState<string>("todas")

  const entrenamientosFiltrados = entrenamientos.filter((ent) => {
    const pasaTipo = filtroTipo === "todas" || ent.tipo === filtroTipo
    const pasaDificultad = filtroDificultad === "todas" || ent.dificultad === filtroDificultad
    return pasaTipo && pasaDificultad
  })

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case "entrevista":
        return <Briefcase className="h-4 w-4" />
      case "conversacion":
        return <MessageSquare className="h-4 w-4" />
      case "presentacion":
        return <Video className="h-4 w-4" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  const getColorDificultad = (dificultad: string) => {
    switch (dificultad) {
      case "fácil":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      case "media":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      case "difícil":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
      default:
        return "bg-muted/10 dark:bg-gray-800 text-gray-800 dark:text-muted/20"
    }
  }

  const handleIniciarEntrenamiento = (id: string) => {
    console.log("Iniciando entrenamiento de entrevista:", id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/5 to-white dark:from-background dark:to-muted/90">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Play className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            Entrenamiento de Entrevistas
          </h1>
          <p className="text-muted/60 dark:text-muted/40 mt-2">
            Practica entrevistas, conversaciones y presentaciones con feedback IA
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-4">
          <div>
            <label className="text-sm font-medium text-muted/70 dark:text-muted/30">Tipo</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="mt-1 px-3 py-2 border border-muted/30 dark:border-muted/60 rounded-lg bg-white dark:bg-card text-muted/90 dark:text-white"
            >
              <option value="todas">Todas</option>
              <option value="entrevista">Entrevistas</option>
              <option value="conversacion">Conversaciones</option>
              <option value="presentacion">Presentaciones</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted/70 dark:text-muted/30">Dificultad</label>
            <select
              value={filtroDificultad}
              onChange={(e) => setFiltroDificultad(e.target.value)}
              className="mt-1 px-3 py-2 border border-muted/30 dark:border-muted/60 rounded-lg bg-white dark:bg-card text-muted/90 dark:text-white"
            >
              <option value="todas">Todas</option>
              <option value="fácil">Fácil</option>
              <option value="media">Media</option>
              <option value="difícil">Difícil</option>
            </select>
          </div>
        </div>

        {/* Grid de entrenamientos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entrenamientosFiltrados.map((entrenamiento) => (
            <Card key={entrenamiento.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getIconoTipo(entrenamiento.tipo)}
                    <CardTitle className="text-lg">{entrenamiento.nombre}</CardTitle>
                  </div>
                  {entrenamiento.completada && <CheckCircle2 className="h-5 w-5 text-green dark:text-green-400" />}
                </div>
                <Badge className={getColorDificultad(entrenamiento.dificultad)}>{entrenamiento.dificultad}</Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription>{entrenamiento.descripcion}</CardDescription>

                <div className="flex items-center gap-2 text-sm text-muted/60 dark:text-muted/40">
                  <TrendingUp className="h-4 w-4" />
                  Duración estimada: {entrenamiento.duracion} min
                </div>

                {entrenamiento.completada && entrenamiento.puntuacion && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Puntuación:</span>
                      <span className="font-bold">{entrenamiento.puntuacion}/100</span>
                    </div>
                    <Progress value={entrenamiento.puntuacion} />
                  </div>
                )}

                <Button
                  onClick={() => handleIniciarEntrenamiento(entrenamiento.id)}
                  className="w-full"
                  variant={entrenamiento.completada ? "outline" : "default"}
                >
                  {entrenamiento.completada ? "Reintentar" : "Iniciar Entrenamiento"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {entrenamientosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted/50 dark:text-muted/40">
              No hay entrenamientos disponibles con los filtros seleccionados
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
