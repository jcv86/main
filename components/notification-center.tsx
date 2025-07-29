"use client"

import { useState, useEffect } from "react"
import { Bell, Search, Trash2, CheckCheck, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotifications, useNotificationTemplates } from "@/contexts/notifications-context"
import { cn } from "@/lib/utils"

const iconosPorCategoria = {
  evaluacion: "📊",
  trabajo: "💼",
  biblioteca: "📚",
  coach: "🎯",
  logro: "🏆",
  sistema: "⚙️",
}

const nombresCategorias = {
  evaluacion: "Evaluaciones",
  trabajo: "Oportunidades Laborales",
  biblioteca: "Biblioteca",
  coach: "Coaching",
  logro: "Logros",
  sistema: "Sistema",
}

export function NotificationCenter() {
  const {
    notifications,
    notificacionesNoLeidas,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
    limpiarTodas,
    obtenerNotificacionesPorCategoria,
    obtenerNotificacionesPorPrioridad,
  } = useNotifications()

  const {
    notificarEvaluacionCompletada,
    notificarNuevaOfertaTrabajo,
    notificarLibroRecomendado,
    notificarLogroDesbloqueado,
    notificarRecordatorio,
  } = useNotificationTemplates()

  const [filtroTexto, setFiltroTexto] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas")
  const [prioridadFiltro, setPrioridadFiltro] = useState<string>("todas")
  const [soloNoLeidas, setSoloNoLeidas] = useState(false)
  const [configuracionAbierta, setConfiguracionAbierta] = useState(false)

  // Configuración de notificaciones
  const [configuracion, setConfiguracion] = useState({
    evaluaciones: true,
    trabajos: true,
    biblioteca: true,
    coaching: true,
    logros: true,
    sistema: true,
    sonido: true,
    email: false,
    push: true,
  })

  useEffect(() => {
    const configGuardada = localStorage.getItem("configuracion-notificaciones")
    if (configGuardada) {
      setConfiguracion(JSON.parse(configGuardada))
    }
  }, [])

  const guardarConfiguracion = (nuevaConfig: typeof configuracion) => {
    setConfiguracion(nuevaConfig)
    localStorage.setItem("configuracion-notificaciones", JSON.stringify(nuevaConfig))
  }

  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha)
    return fechaObj.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const obtenerNotificacionesFiltradas = () => {
    let filtradas = [...notifications]

    // Filtro por texto
    if (filtroTexto) {
      filtradas = filtradas.filter(
        (n) =>
          n.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
          n.mensaje.toLowerCase().includes(filtroTexto.toLowerCase()),
      )
    }

    // Filtro por categoría
    if (categoriaFiltro !== "todas") {
      filtradas = filtradas.filter((n) => n.categoria === categoriaFiltro)
    }

    // Filtro por prioridad
    if (prioridadFiltro !== "todas") {
      filtradas = filtradas.filter((n) => n.prioridad === prioridadFiltro)
    }

    // Filtro solo no leídas
    if (soloNoLeidas) {
      filtradas = filtradas.filter((n) => !n.leida)
    }

    return filtradas
  }

  const notificacionesFiltradas = obtenerNotificacionesFiltradas()

  const estadisticas = {
    total: notifications.length,
    noLeidas: notificacionesNoLeidas,
    porCategoria: {
      evaluacion: obtenerNotificacionesPorCategoria("evaluacion").length,
      trabajo: obtenerNotificacionesPorCategoria("trabajo").length,
      biblioteca: obtenerNotificacionesPorCategoria("biblioteca").length,
      coach: obtenerNotificacionesPorCategoria("coach").length,
      logro: obtenerNotificacionesPorCategoria("logro").length,
      sistema: obtenerNotificacionesPorCategoria("sistema").length,
    },
    porPrioridad: {
      baja: obtenerNotificacionesPorPrioridad("baja").length,
      media: obtenerNotificacionesPorPrioridad("media").length,
      alta: obtenerNotificacionesPorPrioridad("alta").length,
      urgente: obtenerNotificacionesPorPrioridad("urgente").length,
    },
  }

  // Funciones de prueba para generar notificaciones
  const generarNotificacionesPrueba = () => {
    notificarEvaluacionCompletada("Personalidad Big Five")
    notificarNuevaOfertaTrabajo("Banco de Chile", "Desarrollador Frontend Senior")
    notificarLibroRecomendado("Hábitos Atómicos")
    notificarLogroDesbloqueado("Evaluador Experto", "Has completado 10 evaluaciones diferentes")
    notificarRecordatorio("Actualizar CV", "No has actualizado tu CV en 30 días")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Centro de Notificaciones</h1>
          <p className="text-muted-foreground">Gestiona todas tus notificaciones y configuraciones</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={generarNotificacionesPrueba} className="text-xs bg-transparent">
            Generar Pruebas
          </Button>
          <Button variant="outline" size="sm" onClick={() => setConfiguracionAbierta(!configuracionAbierta)}>
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.total}</div>
            <p className="text-xs text-muted-foreground">notificaciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">No Leídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{estadisticas.noLeidas}</div>
            <p className="text-xs text-muted-foreground">pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Trabajos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estadisticas.porCategoria.trabajo}</div>
            <p className="text-xs text-muted-foreground">oportunidades</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Logros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{estadisticas.porCategoria.logro}</div>
            <p className="text-xs text-muted-foreground">desbloqueados</p>
          </CardContent>
        </Card>
      </div>

      {/* Panel de Configuración */}
      {configuracionAbierta && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Configuración de Notificaciones</CardTitle>
                <CardDescription>Personaliza qué notificaciones quieres recibir y cómo</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setConfiguracionAbierta(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Categorías de Notificaciones</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(nombresCategorias).map(([key, nombre]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={configuracion[key as keyof typeof configuracion] as boolean}
                      onCheckedChange={(checked) =>
                        guardarConfiguracion({
                          ...configuracion,
                          [key]: checked,
                        })
                      }
                    />
                    <Label htmlFor={key} className="text-sm">
                      {iconosPorCategoria[key as keyof typeof iconosPorCategoria]} {nombre}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Métodos de Notificación</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sonido"
                    checked={configuracion.sonido}
                    onCheckedChange={(checked) =>
                      guardarConfiguracion({
                        ...configuracion,
                        sonido: checked,
                      })
                    }
                  />
                  <Label htmlFor="sonido" className="text-sm">
                    🔊 Sonido de notificación
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="push"
                    checked={configuracion.push}
                    onCheckedChange={(checked) =>
                      guardarConfiguracion({
                        ...configuracion,
                        push: checked,
                      })
                    }
                  />
                  <Label htmlFor="push" className="text-sm">
                    📱 Notificaciones push
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email"
                    checked={configuracion.email}
                    onCheckedChange={(checked) =>
                      guardarConfiguracion({
                        ...configuracion,
                        email: checked,
                      })
                    }
                  />
                  <Label htmlFor="email" className="text-sm">
                    📧 Notificaciones por email
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros y Acciones */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar notificaciones..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las categorías</SelectItem>
                  {Object.entries(nombresCategorias).map(([key, nombre]) => (
                    <SelectItem key={key} value={key}>
                      {iconosPorCategoria[key as keyof typeof iconosPorCategoria]} {nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={prioridadFiltro} onValueChange={setPrioridadFiltro}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="urgente">🔴 Urgente</SelectItem>
                  <SelectItem value="alta">🟠 Alta</SelectItem>
                  <SelectItem value="media">🟡 Media</SelectItem>
                  <SelectItem value="baja">⚪ Baja</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Switch id="solo-no-leidas" checked={soloNoLeidas} onCheckedChange={setSoloNoLeidas} />
                <Label htmlFor="solo-no-leidas" className="text-sm whitespace-nowrap">
                  Solo no leídas
                </Label>
              </div>
            </div>
          </div>

          {notificacionesNoLeidas > 0 && (
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={marcarTodasComoLeidas}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={limpiarTodas}
                className="text-destructive hover:text-destructive bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar todas
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {notificacionesFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">No hay notificaciones</h3>
                <p className="text-muted-foreground">
                  {filtroTexto || categoriaFiltro !== "todas" || prioridadFiltro !== "todas" || soloNoLeidas
                    ? "No se encontraron notificaciones con los filtros aplicados"
                    : "No tienes notificaciones en este momento"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notificacionesFiltradas.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 rounded-lg border transition-all hover:shadow-sm",
                      !notification.leida ? "bg-muted/30 border-primary/20" : "bg-background",
                      notification.prioridad === "urgente" && "border-l-4 border-l-red-500",
                      notification.prioridad === "alta" && "border-l-4 border-l-orange-400",
                      notification.prioridad === "media" && "border-l-4 border-l-blue-400",
                      notification.prioridad === "baja" && "border-l-4 border-l-gray-400",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl flex-shrink-0">{notification.icono}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm">{notification.titulo}</h3>
                            {!notification.leida && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.mensaje}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatearFecha(notification.fechaCreacion)}</span>
                            <Badge variant="outline" className="text-xs">
                              {nombresCategorias[notification.categoria as keyof typeof nombresCategorias]}
                            </Badge>
                            <Badge
                              variant={notification.prioridad === "urgente" ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {notification.prioridad}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.leida && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => marcarComoLeida(notification.id)}
                            className="h-8 w-8 p-0"
                            title="Marcar como leída"
                          >
                            <CheckCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarNotificacion(notification.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          title="Eliminar notificación"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
